# Table Cards Responsive

**Version:** 0.1.15  
**Released:** May 9, 2026

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

## Settings Page

<img width="300" alt="image" src="https://github.com/user-attachments/assets/e2527c56-e2d5-4e28-9d85-15f07bedf956" />

## Responsive Mode: Horizontal Scroll

<img width="300" alt="image" src="https://github.com/user-attachments/assets/fc526858-9048-42d8-bda0-d5d9e956b18b" />

## Responsive Mode: Rows to Cards

<img width="300" alt="image" src="https://github.com/user-attachments/assets/651ff997-ad53-43cb-81da-b2c226f78501" />

## Changelog

See [changelog.md](changelog.md) for the complete history of changes and fixes.

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

## About

Plugin that makes Gutenberg Tables block responsive with both horizontal scroll or cards option.

### Resources

- [GitHub Repository](https://github.com/JoelLisenby/gutenberg-responsive-tables)
- [Changelog](changelog.md)
