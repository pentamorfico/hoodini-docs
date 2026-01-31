#!/bin/bash
# Generate API documentation for Hoodini ecosystem
# This script generates Markdown files from source code

set -e

DOCS_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONTENT_DIR="$DOCS_DIR/content/docs"

echo "📚 Generating API documentation..."

# ============================================
# Python (Hoodini CLI) - using pydoc-markdown
# ============================================
HOODINI_DIR="/home/pentamorfico/software/hoodini"
PYTHON_BIN="$HOME/miniforge3/envs/hoodini/bin/python"
PYDOC_BIN="$HOME/miniforge3/envs/hoodini/bin/pydoc-markdown"

if [ -d "$HOODINI_DIR" ] && [ -f "$PYDOC_BIN" ]; then
    echo "🐍 Generating Python API docs..."
    
    OUTPUT_DIR="$CONTENT_DIR/hoodini/api"
    mkdir -p "$OUTPUT_DIR"
    
    # Generate CLI reference
    cd "$HOODINI_DIR"
    $PYDOC_BIN -I src -m hoodini.cli --render-toc > "$OUTPUT_DIR/cli-reference.mdx"
    
    # Add frontmatter
    sed -i '1s/^/---\ntitle: CLI Reference\ndescription: Auto-generated API documentation for Hoodini CLI\n---\n\n/' "$OUTPUT_DIR/cli-reference.mdx"
    
    echo "  ✅ Python docs generated: $OUTPUT_DIR/cli-reference.mdx"
else
    echo "  ⚠️  Skipping Python docs (hoodini or pydoc-markdown not found)"
fi

# ============================================
# TypeScript (Hoodini Viz) - using TypeDoc
# ============================================
VIZ_DIR="/home/pentamorfico/software/hoodini-viz"

if [ -d "$VIZ_DIR" ]; then
    echo "📘 Generating TypeScript API docs..."
    
    OUTPUT_DIR="$CONTENT_DIR/viz/api"
    mkdir -p "$OUTPUT_DIR"
    
    cd "$VIZ_DIR"
    
    # Check if typedoc is installed
    if [ -f "node_modules/.bin/typedoc" ]; then
        npx typedoc --plugin typedoc-plugin-markdown \
            --out "$OUTPUT_DIR" \
            --skipErrorChecking \
            --readme none \
            --entryFileName reference.mdx \
            src/index.ts 2>/dev/null || true
        
        # Rename .md to .mdx
        find "$OUTPUT_DIR" -name "*.md" -exec bash -c 'mv "$0" "${0%.md}.mdx"' {} \;
        
        echo "  ✅ TypeScript docs generated: $OUTPUT_DIR/"
    else
        echo "  ⚠️  typedoc not found in hoodini-viz, installing..."
        npm install --save-dev typedoc typedoc-plugin-markdown
        # Re-run after install
        npx typedoc --plugin typedoc-plugin-markdown \
            --out "$OUTPUT_DIR" \
            --skipErrorChecking \
            --readme none \
            --entryFileName reference.mdx \
            src/index.ts 2>/dev/null || true
    fi
else
    echo "  ⚠️  Skipping TypeScript docs (hoodini-viz not found)"
fi

echo ""
echo "✨ API documentation generation complete!"
echo ""
echo "Generated files:"
find "$CONTENT_DIR" -name "*reference*.mdx" -o -name "*api*.mdx" 2>/dev/null | head -20
