# Table Cards Responsive

A lightweight plugin that adds responsive behavior options to the core Gutenberg Table block.

## Features

- **Two Responsive Modes**:
  - **Horizontal Scroll** — Wraps the table in a scrollable container (with proper accessibility attributes).
  - **Rows to Cards** — Converts each table row into a mobile-friendly card layout.
- Per-table settings in the block sidebar.
- Automatic breakpoint detection with option to override per table.
- Accessibility improvements for screen readers.
- Only loads assets when responsive mode is enabled.
- Supports Reusable Blocks, Template Parts, and Query Loops.

## Installation

1. Download or clone this repository.
2. Upload the plugin folder to your `/wp-content/plugins/` directory.
3. Activate the plugin through the **Plugins** menu in WordPress.

## Usage

1. Add a **Table** block in the Gutenberg editor.
2. In the block sidebar, toggle **"Enable Responsive Mode"**.
3. Choose between **Horizontal Scroll** or **Rows to Cards**.
4. (Optional) Set a custom mobile breakpoint.

## Requirements

- WordPress 6.0 or higher
- Gutenberg editor (included in WordPress)

## License

GPL-2.0-or-later