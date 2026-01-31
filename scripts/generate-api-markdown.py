#!/usr/bin/env python3
"""
Generate API reference markdown from Python/TypeScript source code.
- Python: Uses griffe for parsing
- TypeScript: Uses TypeDoc JSON output
Output is clean markdown compatible with Nextra/MDX.
"""

import sys
import json
import subprocess
import re
from pathlib import Path
from typing import Optional, Any

# ============ PYTHON (griffe) ============

# Folder-to-category mapping (auto-detected from module paths)
# Format: "folder_prefix" -> ("Category Title", "Description")
# Order matters - first match wins. More specific prefixes should come first.
FOLDER_CATEGORY_MAP = {
    "hoodini": {
        "cli": ("CLI Commands", "Command-line interface entry points."),
        "config": ("Configuration", "Configuration management and runtime settings."),
        "pipeline": ("Pipeline Stages", "Core pipeline stages for genomic neighborhood analysis."),
        "download": ("Data Downloads", "Functions for downloading databases and reference data."),
        "extra_tools": ("Extra Tools", "Integration with external bioinformatics tools."),
        "models": ("Data Models", "Table schemas and data validation."),
        "utils": ("Utilities", "Helper functions and utilities."),
    },
    "hoodini_colab": {
        "widget": ("Launcher Widget", "Interactive widget for running Hoodini in Google Colab notebooks."),
        "utils": ("Installation Utilities", "Functions for installing and managing Hoodini in Colab environments."),
    },
}


# ============ CLICK CLI PARSER ============

def is_click_decorated(func) -> bool:
    """Check if a griffe Function has Click decorators."""
    if not hasattr(func, 'decorators') or not func.decorators:
        return False
    for dec in func.decorators:
        dec_str = str(dec.value) if hasattr(dec, 'value') else str(dec)
        if 'click' in dec_str.lower() or '.command' in dec_str or '.group' in dec_str:
            return True
    return False


def get_click_decorator_type(func) -> str | None:
    """Get the Click decorator type: 'group', 'command', or None."""
    if not hasattr(func, 'decorators') or not func.decorators:
        return None
    for dec in func.decorators:
        dec_str = str(dec.value) if hasattr(dec, 'value') else str(dec)
        if '.group' in dec_str or dec_str.endswith('group()'):
            return 'group'
        if '.command' in dec_str or dec_str.endswith('command()') or '@click.command' in dec_str:
            return 'command'
    return None


def get_click_command_name(func) -> str:
    """Extract the Click command name from decorator or function name."""
    if hasattr(func, 'decorators') and func.decorators:
        for dec in func.decorators:
            dec_str = str(dec.value) if hasattr(dec, 'value') else str(dec)
            # Look for @group.command("name") pattern
            import re
            match = re.search(r'\.command\(["\']([^"\']+)["\']\)', dec_str)
            if match:
                return match.group(1)
    return func.name


def get_click_parent_group(func) -> str | None:
    """Get the parent group name from decorator like @cli.command or @download.command."""
    if not hasattr(func, 'decorators') or not func.decorators:
        return None
    for dec in func.decorators:
        dec_str = str(dec.value) if hasattr(dec, 'value') else str(dec)
        import re
        # Match @parent.command or @parent.group
        match = re.search(r'@?(\w+)\.(command|group)', dec_str)
        if match:
            return match.group(1)
    return None


def extract_click_options(func) -> list[dict]:
    """Extract Click options/arguments from decorators."""
    options = []
    if not hasattr(func, 'decorators') or not func.decorators:
        return options
    
    import re
    
    for dec in func.decorators:
        dec_str = str(dec.value) if hasattr(dec, 'value') else str(dec)
        
        # Parse @click.option
        if 'click.option' in dec_str or '.option(' in dec_str:
            opt = {"type": "option"}
            
            # Extract option names (--name, -n)
            names_match = re.findall(r'["\'](-{1,2}[\w-]+)["\']', dec_str)
            if names_match:
                opt["names"] = names_match
            
            # Extract help text
            help_match = re.search(r'help\s*=\s*["\']([^"\']+)["\']', dec_str)
            if help_match:
                opt["help"] = help_match.group(1)
            
            # Check if it's a flag
            if 'is_flag=True' in dec_str:
                opt["is_flag"] = True
            
            # Extract type if specified
            type_match = re.search(r'type\s*=\s*click\.Choice\(\[([^\]]+)\]\)', dec_str)
            if type_match:
                choices = re.findall(r'["\']([^"\']+)["\']', type_match.group(1))
                opt["choices"] = choices
            
            if "names" in opt:
                options.append(opt)
        
        # Parse @click.argument
        elif 'click.argument' in dec_str or '.argument(' in dec_str:
            arg = {"type": "argument"}
            
            # Extract argument name
            name_match = re.search(r'argument\(["\'](\w+)["\']', dec_str, re.IGNORECASE)
            if name_match:
                arg["name"] = name_match.group(1)
                options.append(arg)
    
    return options


def build_click_command_tree(functions: list) -> dict:
    """
    Build a tree structure of Click commands from a list of functions.
    Returns: {group_name: {"func": func, "doc": doc, "subcommands": [...]}}
    """
    tree = {}
    commands_by_name = {}
    
    for path, func in functions:
        if not is_click_decorated(func):
            continue
        
        dec_type = get_click_decorator_type(func)
        cmd_name = get_click_command_name(func)
        parent = get_click_parent_group(func)
        
        cmd_info = {
            "func": func,
            "path": path,
            "name": cmd_name,
            "type": dec_type,
            "parent": parent,
            "subcommands": [],
            "options": extract_click_options(func),
        }
        
        commands_by_name[func.name] = cmd_info
    
    # Build tree structure
    for name, cmd in commands_by_name.items():
        parent_name = cmd["parent"]
        if parent_name and parent_name in commands_by_name:
            commands_by_name[parent_name]["subcommands"].append(cmd)
        else:
            # Top-level command or group
            tree[name] = cmd
    
    return tree


def format_click_command_md(cmd_info: dict, level: int = 3) -> list[str]:
    """Format a Click command as markdown."""
    md = []
    func = cmd_info["func"]
    cmd_name = cmd_info["name"]
    cmd_type = cmd_info["type"]
    options = cmd_info["options"]
    subcommands = cmd_info["subcommands"]
    
    # Header
    prefix = "#" * level
    type_label = "Command Group" if cmd_type == "group" else "Command"
    
    if cmd_type == "group":
        md.append(f"{prefix} `{cmd_name}` {type_label}\n")
    else:
        md.append(f"{prefix} `{cmd_name}`\n")
    
    # Description from docstring
    if func.docstring:
        doc = func.docstring.value.strip()
        # Get first paragraph
        first_para = doc.split("\n\n")[0].strip()
        md.append(f"{first_para}\n")
    
    # Usage
    if cmd_type == "group":
        md.append(f"```bash\nhoodini {cmd_name} <command> [options]\n```\n")
    else:
        # Build usage from parent chain
        parent = cmd_info.get("parent")
        if parent and parent != "cli":
            md.append(f"```bash\nhoodini {parent} {cmd_name} [options]\n```\n")
        elif parent == "cli" or not parent:
            md.append(f"```bash\nhoodini {cmd_name} [options]\n```\n")
    
    # Options table
    if options:
        md.append("**Options:**\n")
        md.append("| Option | Description |")
        md.append("|--------|-------------|")
        for opt in options:
            if opt["type"] == "option":
                names = ", ".join(f"`{n}`" for n in opt.get("names", []))
                help_text = opt.get("help", "")
                if opt.get("is_flag"):
                    help_text = f"(flag) {help_text}"
                if opt.get("choices"):
                    help_text += f" Choices: {', '.join(opt['choices'])}"
                md.append(f"| {names} | {help_text} |")
            elif opt["type"] == "argument":
                md.append(f"| `{opt.get('name', 'ARG')}` | (positional argument) |")
        md.append("")
    
    # Subcommands
    if subcommands:
        md.append("**Subcommands:**\n")
        for subcmd in sorted(subcommands, key=lambda x: x["name"]):
            subcmd_name = subcmd["name"]
            subcmd_doc = ""
            if subcmd["func"].docstring:
                subcmd_doc = subcmd["func"].docstring.value.strip().split("\n")[0]
            md.append(f"- `{subcmd_name}` - {subcmd_doc}")
        md.append("")
        
        # Render subcommands
        for subcmd in sorted(subcommands, key=lambda x: x["name"]):
            md.extend(format_click_command_md(subcmd, level + 1))
    
    return md

def get_category_for_module(package_name: str, module_path: str) -> tuple[str, str] | None:
    """
    Determine category for a module based on its path prefix.
    
    Returns (category_name, description) or None if uncategorized.
    """
    folder_map = FOLDER_CATEGORY_MAP.get(package_name, {})
    
    # Check each folder prefix (more specific first if needed)
    for prefix, (cat_name, cat_desc) in folder_map.items():
        # Module path starts with the prefix (exact match or submodule)
        if module_path == prefix or module_path.startswith(f"{prefix}."):
            return (cat_name, cat_desc)
    
    return None


def generate_python_api(package_name: str, search_paths: list[str], output_path: str):
    """Generate API reference markdown for Python package using griffe."""
    from griffe import load, Module, Class, Function, Attribute
    
    print(f"Loading Python package {package_name}...")
    module = load(package_name, search_paths=search_paths)
    
    md = []
    
    # Package-specific titles and descriptions
    package_info = {
        "hoodini": {
            "title": "Hoodini API Reference",
            "description": "Python API for gene neighborhood analysis at scale.",
            "intro": """
Hoodini is a comprehensive tool for gene-centric comparative genomics using publicly available data.
This reference documents the Python API for programmatic access to Hoodini's functionality.

**Quick Links:**
- [CLI Reference](/docs/hoodini/cli-reference) - Command-line usage
- [Quick Start](/docs/hoodini/quickstart) - Getting started guide
- [Outputs](/docs/hoodini/outputs) - Output file formats
""",
        },
        "hoodini_colab": {
            "title": "Hoodini Colab API Reference",
            "description": "Python API for running Hoodini in Google Colab notebooks.",
            "intro": """
Hoodini Colab provides an interactive widget interface for running Hoodini analysis directly in Google Colab.
It handles installation, parameter configuration, and execution in a user-friendly way.

**Usage:**
```python
from hoodini_colab import create_launcher
launcher = create_launcher()
display(launcher)
```
""",
        },
    }
    
    info = package_info.get(package_name, {
        "title": f"{package_name.replace('_', ' ').title()} API Reference",
        "description": f"API documentation for `{package_name}`.",
        "intro": "",
    })
    
    md.append(f"# {info['title']}\n")
    md.append(f"{info['description']}\n")
    
    # Collect version
    for name, obj in module.members.items():
        if isinstance(obj, Attribute) and name == "__version__":
            md.append(f"**Version:** `{obj.value}`\n")
            break
    
    if info.get("intro"):
        md.append(info["intro"])
    
    def format_signature(func, include_self=False):
        params = []
        for param in func.parameters:
            if param.name == "self" and not include_self:
                continue
            param_str = param.name
            if param.annotation:
                ann = str(param.annotation)
                ann = ann.replace("<", "\\<").replace(">", "\\>")
                param_str += f": {ann}"
            if param.default:
                default_str = str(param.default)
                # Clean up common defaults
                if default_str == "None":
                    param_str += " = None"
                elif default_str == "{}":
                    param_str += " = \\{\\}"
                else:
                    param_str += f" = {default_str}"
            params.append(param_str)
        sig = f"def {func.name}({', '.join(params)})"
        if func.returns:
            ret = str(func.returns).replace("<", "\\<").replace(">", "\\>")
            sig += f" -> {ret}"
        return sig
    
    def format_docstring(obj):
        if not obj.docstring:
            return ""
        return obj.docstring.value
    
    def parse_docstring_sections(docstring: str) -> dict:
        """Parse docstring into sections (Args, Returns, etc.)."""
        sections = {"description": "", "args": [], "returns": "", "raises": [], "examples": ""}
        if not docstring:
            return sections
        
        lines = docstring.strip().split("\n")
        current_section = "description"
        current_content = []
        
        section_headers = {
            "args:": "args", "arguments:": "args", "parameters:": "args", "params:": "args",
            "returns:": "returns", "return:": "returns",
            "raises:": "raises", "raise:": "raises", "exceptions:": "raises",
            "example:": "examples", "examples:": "examples",
            "yields:": "yields", "yield:": "yields",
            "note:": "note", "notes:": "note",
        }
        
        for line in lines:
            lower = line.strip().lower()
            if lower in section_headers:
                # Save current section
                if current_section == "description":
                    sections["description"] = "\n".join(current_content).strip()
                current_section = section_headers[lower]
                current_content = []
            else:
                current_content.append(line)
        
        # Save last section
        if current_section == "description":
            sections["description"] = "\n".join(current_content).strip()
        elif current_section == "returns":
            sections["returns"] = "\n".join(current_content).strip()
        elif current_section == "examples":
            sections["examples"] = "\n".join(current_content).strip()
        
        return sections
    
    def format_docstring_rich(obj):
        """Format docstring with proper markdown sections.
        
        Converts docstring sections to styled text (not headers) to avoid TOC pollution.
        Also removes underline-style headers (lines of dashes/equals) that would create H1/H2.
        """
        if not obj.docstring:
            return ""
        
        doc = obj.docstring.value.strip()
        
        # Get first paragraph as description
        parts = doc.split("\n\n", 1)
        description = parts[0].strip()
        
        # If there's more content, process it to avoid TOC headers
        if len(parts) > 1:
            rest = parts[1]
            
            import re
            
            # First, remove Setext-style header underlines (lines of dashes or equals)
            # These create H1/H2 headers in markdown when following any text
            processed_rest = re.sub(r'\n[-=]{3,}\n', '\n', rest)
            # Also handle case where underline is at end of text block
            processed_rest = re.sub(r'\n[-=]{3,}$', '', processed_rest)
            
            # Convert section headers to styled text (not markdown headers)
            # These patterns in docstrings should not become TOC entries
            section_patterns = [
                "Expected Files:", "Generated Files:", "Process:", 
                "Parameters:", "Returns:", "Args:", "Arguments:",
                "Raises:", "Yields:", "Example:", "Examples:",
                "Note:", "Notes:", "Warning:", "Warnings:",
                "See Also:", "References:", "Attributes:",
            ]
            
            for pattern in section_patterns:
                # Replace standalone section headers with bold text
                # Match the pattern when it's on its own line or starts a section
                processed_rest = re.sub(
                    rf'^({re.escape(pattern)})',
                    r'**\1**',
                    processed_rest,
                    flags=re.MULTILINE
                )
            
            return f"{description}\n\n{processed_rest}"
        
        return description
    
    # Collect ALL items recursively
    all_modules = []  # (path, module, doc)
    all_classes = []  # (path, class)
    all_functions = []  # (path, function)
    
    def collect_from_module(mod, path=""):
        current_path = f"{path}.{mod.name}" if path else mod.name
        display_path = current_path.replace(f"{package_name}.", "")
        if display_path == package_name:
            display_path = ""
        
        doc = format_docstring(mod)
        if display_path:
            all_modules.append((display_path, mod, doc))
        
        for name, obj in mod.members.items():
            if name.startswith("_"):
                continue
            
            if isinstance(obj, Module):
                collect_from_module(obj, current_path)
            elif isinstance(obj, Class):
                all_classes.append((display_path, obj))
            elif isinstance(obj, Function):
                all_functions.append((display_path, obj))
    
    collect_from_module(module)
    
    # Group by module path
    modules_by_path = {}
    for path, mod, doc in all_modules:
        modules_by_path[path] = {"module": mod, "doc": doc, "classes": [], "functions": []}
    
    modules_by_path[""] = {"module": None, "doc": "", "classes": [], "functions": []}
    
    for path, cls in all_classes:
        if path not in modules_by_path:
            modules_by_path[path] = {"module": None, "doc": "", "classes": [], "functions": []}
        modules_by_path[path]["classes"].append(cls)
    
    for path, func in all_functions:
        if path not in modules_by_path:
            modules_by_path[path] = {"module": None, "doc": "", "classes": [], "functions": []}
        modules_by_path[path]["functions"].append(func)
    
    # Get folder-based category mapping for this package
    folder_map = FOLDER_CATEGORY_MAP.get(package_name, {})
    
    if folder_map:
        # Auto-categorize modules based on their path prefix
        # Group modules by their detected category
        categories_found = {}  # {(cat_name, cat_desc): [module_paths]}
        uncategorized = []
        
        for path in modules_by_path.keys():
            if not path:  # Skip root module
                continue
            
            cat_info = get_category_for_module(package_name, path)
            if cat_info:
                if cat_info not in categories_found:
                    categories_found[cat_info] = []
                categories_found[cat_info].append(path)
            else:
                uncategorized.append(path)
        
        # Define category order for consistent output
        category_order = list(folder_map.values())
        
        # Output categorized modules in defined order
        for cat_name, cat_desc in category_order:
            cat_key = (cat_name, cat_desc)
            if cat_key not in categories_found:
                continue
            
            matching_paths = categories_found[cat_key]
            
            # Category header
            md.append("---\n")
            md.append(f"## {cat_name}\n")
            if cat_desc:
                md.append(f"{cat_desc}\n")
            
            # Special handling for CLI Commands - parse Click decorators
            if cat_name == "CLI Commands":
                # Collect all functions from CLI modules
                cli_functions = []
                for path in matching_paths:
                    info = modules_by_path[path]
                    for func in info["functions"]:
                        cli_functions.append((path, func))
                
                # Build Click command tree
                click_tree = build_click_command_tree(cli_functions)
                
                if click_tree:
                    # Render Click commands with proper hierarchy
                    for cmd_name in sorted(click_tree.keys()):
                        cmd_info = click_tree[cmd_name]
                        md.extend(format_click_command_md(cmd_info, level=3))
                else:
                    # Fallback to standard function rendering if no Click commands found
                    for path in sorted(matching_paths):
                        info = modules_by_path[path]
                        for func in info["functions"]:
                            md.append(f"### `{func.name}()`\n")
                            md.append("```python")
                            md.append(format_signature(func))
                            md.append("```\n")
                            func_doc = format_docstring_rich(func)
                            if func_doc:
                                md.append(f"{func_doc}\n")
                continue
            
            # Standard rendering for non-CLI categories
            # Output modules in this category
            for path in sorted(matching_paths):
                info = modules_by_path[path]
                classes = info["classes"]
                functions = info["functions"]
                module_doc = info["doc"]
                
                if not classes and not functions and not module_doc:
                    continue
                
                # Module sub-header
                md.append(f"### `{path}`\n")
                if module_doc:
                    md.append(f"{module_doc}\n")
                
                # Classes
                for cls in classes:
                    cls_doc = format_docstring_rich(cls)
                    md.append(f"#### `{cls.name}`\n")
                    if cls_doc:
                        md.append(f"{cls_doc}\n")
                    
                    # Methods
                    methods = [m for m in cls.members.values() 
                              if isinstance(m, Function) and not m.name.startswith("_")]
                    if methods:
                        md.append("**Methods:**\n")
                        for method in methods:
                            md.append(f"- `{method.name}()`\n")
                            md.append("  ```python")
                            md.append(f"  {format_signature(method)}")
                            md.append("  ```\n")
                            method_doc = format_docstring_rich(method)
                            if method_doc:
                                # First line only for brevity
                                first_line = method_doc.split("\n")[0]
                                md.append(f"  {first_line}\n")
                
                # Functions
                for func in functions:
                    md.append(f"#### `{func.name}()`\n")
                    md.append("```python")
                    md.append(format_signature(func))
                    md.append("```\n")
                    
                    func_doc = format_docstring_rich(func)
                    if func_doc:
                        md.append(f"{func_doc}\n")
        
        # Handle uncategorized modules (modules not matching any folder prefix)
        if uncategorized:
            md.append("---\n")
            md.append("## Other Modules\n")
            
            for path in sorted(uncategorized):
                info = modules_by_path[path]
                classes = info["classes"]
                functions = info["functions"]
                module_doc = info["doc"]
                
                if not classes and not functions and not module_doc:
                    continue
                
                md.append(f"### `{path}`\n")
                if module_doc:
                    md.append(f"{module_doc}\n")
                
                for cls in classes:
                    cls_doc = format_docstring_rich(cls)
                    md.append(f"#### `{cls.name}`\n")
                    if cls_doc:
                        md.append(f"{cls_doc}\n")
                    
                    methods = [m for m in cls.members.values() 
                              if isinstance(m, Function) and not m.name.startswith("_")]
                    if methods:
                        md.append("**Methods:**\n")
                        for method in methods:
                            md.append(f"- `{method.name}()`\n")
                            md.append("  ```python")
                            md.append(f"  {format_signature(method)}")
                            md.append("  ```\n")
                
                for func in functions:
                    md.append(f"#### `{func.name}()`\n")
                    md.append("```python")
                    md.append(format_signature(func))
                    md.append("```\n")
                    func_doc = format_docstring_rich(func)
                    if func_doc:
                        md.append(f"{func_doc}\n")
    
    else:
        # Fallback: original flat organization
        sorted_paths = sorted(modules_by_path.keys(), key=lambda x: (x == "", x))
        
        for path in sorted_paths:
            info = modules_by_path[path]
            classes = info["classes"]
            functions = info["functions"]
            module_doc = info["doc"]
            
            if not classes and not functions and not module_doc:
                continue
            
            if path:
                md.append("---\n")
                md.append(f"## Module: `{path}`\n")
                if module_doc:
                    md.append(f"{module_doc}\n")
            
            if classes:
                if path:
                    md.append("### Classes\n")
                else:
                    md.append("## Classes\n")
                
                for cls in classes:
                    cls_doc = format_docstring_rich(cls)
                    if path:
                        md.append(f"#### `{cls.name}`\n")
                    else:
                        md.append(f"### `{cls.name}`\n")
                    
                    if cls_doc:
                        md.append(f"{cls_doc}\n")
                    
                    methods = [m for m in cls.members.values() 
                              if isinstance(m, Function) and not m.name.startswith("_")]
                    if methods:
                        md.append("**Methods:**\n")
                        for method in methods:
                            md.append(f"- `{method.name}()`\n")
                            md.append("  ```python")
                            md.append(f"  {format_signature(method)}")
                            md.append("  ```\n")
            
            if functions:
                if path:
                    md.append("### Functions\n")
                else:
                    md.append("## Functions\n")
                
                for func in functions:
                    if path:
                        md.append(f"#### `{func.name}()`\n")
                    else:
                        md.append(f"### `{func.name}()`\n")
                    
                    md.append("```python")
                    md.append(format_signature(func))
                    md.append("```\n")
                    
                    func_doc = format_docstring_rich(func)
                    if func_doc:
                        md.append(f"{func_doc}\n")
    
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    Path(output_path).write_text("\n".join(md))
    print(f"Generated {output_path}")


# ============ TYPESCRIPT (TypeDoc JSON) ============

def format_ts_type(type_obj: Any) -> str:
    """Format a TypeDoc type object to string."""
    if type_obj is None:
        return "any"
    if isinstance(type_obj, str):
        return type_obj
    
    t = type_obj.get("type", "")
    
    if t == "intrinsic":
        return type_obj.get("name", "any")
    elif t == "reference":
        name = type_obj.get("name", "")
        args = type_obj.get("typeArguments", [])
        if args:
            arg_strs = [format_ts_type(a) for a in args]
            return f"{name}<{', '.join(arg_strs)}>"
        return name
    elif t == "array":
        elem = format_ts_type(type_obj.get("elementType"))
        return f"{elem}[]"
    elif t == "union":
        types = type_obj.get("types", [])
        return " | ".join(format_ts_type(t) for t in types)
    elif t == "intersection":
        types = type_obj.get("types", [])
        return " & ".join(format_ts_type(t) for t in types)
    elif t == "literal":
        val = type_obj.get("value")
        if isinstance(val, str):
            return f'"{val}"'
        return str(val)
    elif t == "tuple":
        elems = type_obj.get("elements", [])
        return f"[{', '.join(format_ts_type(e) for e in elems)}]"
    elif t == "reflection":
        return "object"
    else:
        return "any"


def generate_typescript_api(project_dir: str, output_path: str):
    """Generate API reference markdown for TypeScript using TypeDoc JSON."""
    import tempfile
    
    print(f"Generating TypeDoc JSON for {project_dir}...")
    
    with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
        tmp_path = tmp.name
    
    try:
        result = subprocess.run(
            ["npx", "typedoc", "--json", tmp_path, "--plugin", "none"],
            cwd=project_dir,
            capture_output=True,
            text=True
        )
        if result.returncode != 0:
            subprocess.run(
                ["npx", "typedoc", "--json", tmp_path],
                cwd=project_dir,
                capture_output=True,
                text=True,
                check=True
            )
        
        with open(tmp_path) as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error running TypeDoc: {e}")
        sys.exit(1)
    finally:
        Path(tmp_path).unlink(missing_ok=True)
    
    md = []
    project_name = data.get("name", "API")
    md.append(f"# {project_name} API Reference\n")
    md.append("Auto-generated API documentation.\n")
    
    def get_comment(obj):
        comment = obj.get("comment", {})
        summary = comment.get("summary", [])
        if summary:
            return " ".join(p.get("text", "") for p in summary)
        return ""
    
    def gen_function(obj, heading="###"):
        lines = []
        name = obj.get("name", "")
        lines.append(f"{heading} `{name}`\n")
        
        sigs = obj.get("signatures", [])
        for sig in sigs:
            params = sig.get("parameters", [])
            param_strs = []
            for p in params:
                pname = p.get("name", "")
                ptype = format_ts_type(p.get("type"))
                param_strs.append(f"{pname}: {ptype}")
            
            ret_type = format_ts_type(sig.get("type"))
            lines.append("```typescript")
            lines.append(f"function {name}({', '.join(param_strs)}): {ret_type}")
            lines.append("```\n")
            
            comment = get_comment(sig)
            if comment:
                lines.append(comment + "\n")
        
        return "\n".join(lines)
    
    def gen_method(obj):
        lines = []
        name = obj.get("name", "")
        
        sigs = obj.get("signatures", [])
        for sig in sigs:
            params = sig.get("parameters", [])
            param_strs = []
            for p in params:
                pname = p.get("name", "")
                ptype = format_ts_type(p.get("type"))
                param_strs.append(f"{pname}: {ptype}")
            
            ret_type = format_ts_type(sig.get("type"))
            lines.append(f"- `{name}()`")
            lines.append("  ```typescript")
            lines.append(f"  function {name}({', '.join(param_strs)}): {ret_type}")
            lines.append("  ```")
            
            comment = get_comment(sig)
            if comment:
                lines.append(f"  {comment}")
        lines.append("")
        
        return "\n".join(lines)
    
    def gen_class(obj, heading="###"):
        lines = []
        name = obj.get("name", "")
        lines.append(f"{heading} `{name}`\n")
        
        comment = get_comment(obj)
        if comment:
            lines.append(comment + "\n")
        
        children = obj.get("children", [])
        
        # Properties
        props = [c for c in children if c.get("kind") == 1024]
        if props:
            lines.append("**Properties:**\n")
            lines.append("| Property | Type |")
            lines.append("|----------|------|")
            for prop in props:
                pname = prop.get("name", "")
                ptype = format_ts_type(prop.get("type")).replace("|", "\\|")
                lines.append(f"| `{pname}` | `{ptype}` |")
            lines.append("")
        
        # Methods
        methods = [c for c in children if c.get("kind") == 2048 and not c.get("name", "").startswith("_")]
        if methods:
            lines.append("**Methods:**\n")
            for method in methods:
                lines.append(gen_method(method))
        
        return "\n".join(lines)
    
    def gen_interface(obj, heading="###"):
        lines = []
        name = obj.get("name", "")
        lines.append(f"{heading} `{name}`\n")
        
        comment = get_comment(obj)
        if comment:
            lines.append(comment + "\n")
        
        children = obj.get("children", [])
        if children:
            lines.append("| Property | Type | Description |")
            lines.append("|----------|------|-------------|")
            for child in children:
                cname = child.get("name", "")
                ctype = format_ts_type(child.get("type")).replace("|", "\\|")
                cdoc = get_comment(child).replace("|", "\\|").replace("\n", " ")[:100]
                lines.append(f"| `{cname}` | `{ctype}` | {cdoc} |")
            lines.append("")
        
        return "\n".join(lines)
    
    def gen_type_alias(obj, heading="###"):
        lines = []
        name = obj.get("name", "")
        lines.append(f"{heading} `{name}`\n")
        
        comment = get_comment(obj)
        if comment:
            lines.append(comment + "\n")
        
        t = format_ts_type(obj.get("type"))
        lines.append("```typescript")
        lines.append(f"type {name} = {t}")
        lines.append("```\n")
        
        return "\n".join(lines)
    
    def gen_react_component(obj, props_interface=None):
        """Generate documentation for a React component."""
        lines = []
        name = obj.get("name", "")
        comment = get_comment(obj)
        
        lines.append(f"### `<{name} />`\n")
        
        if comment:
            lines.append(comment + "\n")
        
        # Show the import statement
        lines.append("**Import:**")
        lines.append("```typescript")
        lines.append(f"import {{ {name} }} from 'hoodini-viz';")
        lines.append("```\n")
        
        # If we have the props interface, show key props
        if props_interface:
            children = props_interface.get("children", [])
            required = [c for c in children if not c.get("flags", {}).get("isOptional", False)]
            optional = [c for c in children if c.get("flags", {}).get("isOptional", False)]
            
            if required:
                lines.append("**Required Props:**\n")
                lines.append("| Prop | Type | Description |")
                lines.append("|------|------|-------------|")
                for child in required:
                    cname = child.get("name", "")
                    ctype = format_ts_type(child.get("type")).replace("|", "\\|")
                    cdoc = get_comment(child).replace("|", "\\|").replace("\n", " ")[:80]
                    lines.append(f"| `{cname}` | `{ctype}` | {cdoc} |")
                lines.append("")
            
            if optional:
                lines.append("**Optional Props:**\n")
                lines.append("| Prop | Type | Default | Description |")
                lines.append("|------|------|---------|-------------|")
                for child in optional:
                    cname = child.get("name", "")
                    ctype = format_ts_type(child.get("type")).replace("|", "\\|")
                    cdoc = get_comment(child).replace("|", "\\|").replace("\n", " ")[:60]
                    lines.append(f"| `{cname}?` | `{ctype}` | - | {cdoc} |")
                lines.append("")
        
        return "\n".join(lines)
    
    children = data.get("children", [])
    
    # Group by kind
    classes = [c for c in children if c.get("kind") == 128]
    interfaces = [c for c in children if c.get("kind") == 256]
    functions = [c for c in children if c.get("kind") == 64]
    variables = [c for c in children if c.get("kind") == 32]
    type_aliases = [c for c in children if c.get("kind") == 2097152]
    
    # Build interface lookup
    interface_by_name = {i.get("name"): i for i in interfaces}
    
    # Identify React components (variables that are ForwardRefExoticComponent or similar)
    react_components = []
    other_variables = []
    for var in variables:
        vtype = var.get("type", {})
        type_name = vtype.get("name", "") if isinstance(vtype, dict) else ""
        # React component patterns
        if type_name in ("ForwardRefExoticComponent", "FC", "FunctionComponent", "ComponentType") or \
           "Component" in type_name or \
           var.get("name", "") in ("HoodiniDashboard", "HoodiniViz"):
            react_components.append(var)
        else:
            other_variables.append(var)
    
    # ========== SECTION 1: React Components ==========
    if react_components:
        md.append("## React Components\n")
        md.append("Main components exported by hoodini-viz for building genomic neighborhood visualizations.\n")
        
        # Sort to show HoodiniDashboard first, then HoodiniViz
        def component_sort_key(c):
            name = c.get("name", "")
            if name == "HoodiniDashboard":
                return (0, name)
            elif name == "HoodiniViz":
                return (1, name)
            return (2, name)
        
        react_components.sort(key=component_sort_key)
        
        for comp in react_components:
            name = comp.get("name", "")
            # Find matching props interface
            props_name = f"{name}Props"
            props_interface = interface_by_name.get(props_name)
            md.append(gen_react_component(comp, props_interface))
    
    # ========== SECTION 2: Component Props Interfaces ==========
    props_interfaces = [i for i in interfaces if i.get("name", "").endswith("Props")]
    config_interfaces = [i for i in interfaces if "Config" in i.get("name", "")]
    data_interfaces = [i for i in interfaces if i.get("name", "").endswith("Data") or "Data" in i.get("name", "")]
    other_interfaces = [i for i in interfaces if i not in props_interfaces and i not in config_interfaces and i not in data_interfaces]
    
    if props_interfaces:
        md.append("---\n")
        md.append("## Component Props\n")
        md.append("Prop interfaces for the React components.\n")
        for iface in props_interfaces:
            md.append(gen_interface(iface, "###"))
    
    # ========== SECTION 3: Configuration Interfaces ==========
    if config_interfaces:
        md.append("---\n")
        md.append("## Configuration\n")
        md.append("Configuration interfaces for customizing visualization behavior.\n")
        for iface in config_interfaces:
            md.append(gen_interface(iface, "###"))
    
    # ========== SECTION 4: Data Types ==========
    if data_interfaces:
        md.append("---\n")
        md.append("## Data Types\n")
        md.append("Data structures for passing genomic data to components.\n")
        for iface in data_interfaces:
            md.append(gen_interface(iface, "###"))
    
    # ========== SECTION 5: Other Interfaces ==========
    if other_interfaces:
        md.append("---\n")
        md.append("## Other Interfaces\n")
        for iface in other_interfaces:
            md.append(gen_interface(iface, "###"))
    
    # ========== SECTION 6: Type Aliases ==========
    if type_aliases:
        md.append("---\n")
        md.append("## Type Aliases\n")
        for ta in type_aliases:
            md.append(gen_type_alias(ta, "###"))
    
    # ========== SECTION 7: Model Classes ==========
    if classes:
        md.append("---\n")
        md.append("## Model Classes\n")
        md.append("Internal model classes for representing genomic data structures.\n")
        for cls in classes:
            md.append(gen_class(cls, "###"))
    
    # ========== SECTION 8: Utility Functions ==========
    if functions:
        md.append("---\n")
        md.append("## Utility Functions\n")
        for func in functions:
            md.append(gen_function(func, "###"))
    
    # ========== SECTION 9: Constants ==========
    if other_variables:
        md.append("---\n")
        md.append("## Constants\n")
        for var in other_variables:
            name = var.get("name", "")
            vtype = format_ts_type(var.get("type"))
            comment = get_comment(var)
            
            md.append(f"### `{name}`\n")
            md.append("```typescript")
            md.append(f"const {name}: {vtype}")
            md.append("```\n")
            if comment:
                md.append(comment + "\n")
    
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    Path(output_path).write_text("\n".join(md))
    print(f"Generated {output_path}")


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Generate API markdown from source code")
    parser.add_argument("--python", "-p", nargs=2, metavar=("PACKAGE", "SEARCH_PATH"), 
                        help="Generate Python docs: package name and search path")
    parser.add_argument("--typescript", "-t", metavar="PROJECT_DIR",
                        help="Generate TypeScript docs: project directory")
    parser.add_argument("--output", "-o", required=True, help="Output markdown file path")
    
    args = parser.parse_args()
    
    if args.python:
        generate_python_api(args.python[0], [args.python[1]], args.output)
    elif args.typescript:
        generate_typescript_api(args.typescript, args.output)
    else:
        parser.error("Must specify either --python or --typescript")


if __name__ == "__main__":
    main()
