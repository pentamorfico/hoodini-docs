# Hoodini Colab API Reference

Python API for running Hoodini in Google Colab notebooks.

**Version:** `'0.1.2'`


Hoodini Colab provides an interactive widget interface for running Hoodini analysis directly in Google Colab.
It handles installation, parameter configuration, and execution in a user-friendly way.

**Usage:**
```python
from hoodini_colab import create_launcher
launcher = create_launcher()
display(launcher)
```

---

## Launcher Widget

Interactive widget for running Hoodini in Google Colab notebooks.

### `widget`

Hoodini Launcher widget - Interactive parameter configurator for Hoodini CLI.

#### `HoodiniLauncher`

Interactive Hoodini CLI launcher widget with Sidebar and Modes.

This widget provides an interactive interface for configuring and launching
Hoodini genomic neighborhood analysis with various input modes:
- Single Input: Single protein ID or FASTA
- Input List: Multiple IDs or files
- Input Sheet: Tabular data with multiple columns

**Attributes:**
    command: The generated command line string.
    run_requested: Trigger for running the command.
    status_state: Current status (idle, installing, running, finished, error).
    status_message: Status message to display.

**Methods:**

- `keep_alive()`

  ```python
  def keep_alive(interval_seconds: int = 30)
  ```

  Start a background heartbeat to keep Colab alive without blocking UI.

#### `create_launcher()`

```python
def create_launcher() -> HoodiniLauncher
```

Create and configure a HoodiniLauncher widget with execution handler.

This function sets up the launcher widget and attaches the execution handler
that manages installation checks and command execution.

**Returns:**
    HoodiniLauncher: Configured launcher widget ready to be displayed.

**Example:**
    >>> from hoodini_colab import create_launcher
    >>> launcher = create_launcher()
    >>> display(launcher)

---

## Installation Utilities

Functions for installing and managing Hoodini in Colab environments.

### `utils`

Utility functions for hoodini installation and package management.

#### `check_launcher_packages()`

```python
def check_launcher_packages() -> bool
```

Check if launcher dependencies are installed.

**Returns:**
    bool: True if all dependencies are installed, False otherwise.

#### `install_launcher_packages()`

```python
def install_launcher_packages() -> bool
```

Install launcher dependencies.

**Returns:**
    bool: True if installation succeeded, False otherwise.

#### `check_hoodini_installed()`

```python
def check_hoodini_installed() -> bool
```

Check if hoodini is available in PATH or via pixi.

**Returns:**
    bool: True if hoodini is installed, False otherwise.

#### `run_cmd()`

```python
def run_cmd(cmd: str, shell: bool = True) -> int
```

Run command and stream output.

**Args:**
    cmd: Command to run.
    shell: Whether to run command in shell.

**Returns:**
    int: Return code of the command.

#### `install_hoodini()`

```python
def install_hoodini(command: str = '', launcher = None) -> bool
```

Install pixi and hoodini environment.

**Args:**
    command: The hoodini command to be executed, used to determine which databases to download.
    launcher: Optional HoodiniLauncher widget to update status.

**Returns:**
    bool: True if installation succeeded, False otherwise.
