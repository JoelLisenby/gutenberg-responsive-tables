<?php
/**
 * Plugin Name: Table Cards Responsive
 * Description: Adds an optional "Cards" responsive mode to the core Gutenberg Table block with per-table breakpoint control.
 * Author: Joel Lisenby
 * Version: 0.1.1
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Enqueue frontend script
add_action( 'wp_enqueue_scripts', function() {
    wp_enqueue_script(
        'table-responsive-cards',
        plugin_dir_url( __FILE__ ) . 'assets/js/frontend.js',
        [],
        '1.1',
        true
    );
    wp_enqueue_style(
        'table-responsive-cards-style',
        plugin_dir_url( __FILE__ ) . 'assets/css/style.css',
        [],
        '1.1'
    );
});

// Enqueue editor script
add_action( 'enqueue_block_editor_assets', function() {
    wp_enqueue_script(
        'table-responsive-cards-editor',
        plugin_dir_url( __FILE__ ) . 'assets/js/editor.js',
        [ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-hooks' ],
        '1.1',
        true
    );
});

// Register new attribute on core/table block
add_filter( 'register_block_type_args', function( $args, $block_name ) {
    if ( $block_name === 'core/table' ) {
        $args['attributes']['responsiveBreakpoint'] = [
            'type'    => 'number',
            'default' => null,
        ];
    }
    return $args;
}, 10, 2 );

// Add data attribute to the table on the frontend when breakpoint is set
add_filter( 'render_block_core/table', function( $block_content, $block ) {
    if ( ! empty( $block['attrs']['responsiveBreakpoint'] ) ) {
        $breakpoint = absint( $block['attrs']['responsiveBreakpoint'] );
        $block_content = str_replace(
            '<table',
            '<table data-responsive-breakpoint="' . $breakpoint . '"',
            $block_content
        );
    }
    return $block_content;
}, 10, 2 );
