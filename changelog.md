v0.1.2 - 5/9/2026

feat: Implement Rows to Cards responsive mode with sidebar controls and conditional loading

- Add "Rows to Cards" as a second responsive option for the Table block
- Add toggle + conditional settings in the block sidebar
- Only load assets when responsive mode is enabled on a table
- Add recursive block detection for Reusable Blocks, Template Parts & Query Loops
- Improve accessibility and add full i18n support
- Use wp_enqueue_block_style() for CSS
- Bump to v0.1.3 + add README.md