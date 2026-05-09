<?php
/**
 * Plugin Name: Table Cards Responsive
 * Plugin URI:  https://github.com/JoelLisenby/gutenberg-responsive-tables
 * Description: Adds responsive options (Horizontal Scroll or Rows to Cards) to the Gutenberg Table block with accessibility improvements.
 * Version:     0.1.16
 * Author:      Joel Lisenby
 * License:     GPL-2.0-or-later
 * Text Domain: table-cards-responsive
 * Domain Path: /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
add_filter( 'register_block_type_args', function( $args, $block_name ) {
	if ( $block_name === 'core/table' ) {
		$args['attributes']['enableResponsive'] = [ 'type' => 'boolean', 'default' => false ];
		$args['attributes']['responsiveMode'] = [ 'type' => 'string', 'default' => 'scroll' ];
		$args['attributes']['responsiveBreakpoint'] = [ 'type' => 'number', 'default' => null ];
	}
	return $args;
}, 10, 2 );
function tcr_has_responsive_table( $blocks ) {
	foreach ( $blocks as $block ) {
		if ( $block['blockName'] === 'core/table' ) {
			if ( ! empty( $block['attrs']['enableResponsive'] ) ) {
				return true;
			}
		}
		if ( $block['blockName'] === 'core/query' ) {
			return true;
		}
		if ( ! empty( $block['innerBlocks'] ) ) {
			if ( tcr_has_responsive_table( $block['innerBlocks'] ) ) {
				return true;
			}
		}
	}
	return false;
}
add_action( 'enqueue_block_editor_assets', function() {
	wp_enqueue_script(
		'table-responsive-editor',
		plugin_dir_url( __FILE__ ) . 'assets/js/editor.js',
		[
			'wp-blocks',
			'wp-element',
			'wp-editor',
			'wp-components',
			'wp-compose',
			'wp-hooks',
			'wp-i18n',
		],
		'0.1.15',
		true
	);
});
add_action( 'wp_enqueue_scripts', function() {
	if ( ! is_singular() ) {
		return;
	}
	global $post;
	if ( empty( $post->post_content ) ) {
		return;
	}
	$blocks = parse_blocks( $post->post_content );
	if ( tcr_has_responsive_table( $blocks ) ) {
		wp_enqueue_script(
			'table-responsive-frontend',
			plugin_dir_url( __FILE__ ) . 'assets/js/frontend.js',
			[],
			'0.1.15',
			true
		);
	}
});
add_action( 'init', function() {
	wp_enqueue_block_style(
		'core/table',
		[
			'handle' => 'table-responsive-style',
			'src' => plugin_dir_url( __FILE__ ) . 'assets/css/style.css',
			'ver' => '0.1.15',
		]
	);
});
add_filter( 'render_block_core/table', function( $block_content, $block ) {
	$attrs = $block['attrs'] ?? [];
	if ( empty( $attrs['enableResponsive'] ) ) {
		return $block_content;
	}
	$mode = $attrs['responsiveMode'] ?? 'scroll';
	$breakpoint = $attrs['responsiveBreakpoint'] ?? null;
	$bp = $breakpoint ? absint( $breakpoint ) : 782;
	$extra = ' data-responsive-mode="' . esc_attr( $mode ) . '" data-responsive-breakpoint="' . $bp . '"';
	if ( $mode === 'cards' ) {
		$extra .= ' data-responsive-cards';
	}
	if ( $mode === 'scroll' ) {
		$block_content = sprintf(
			'<div class="table-responsive-scroll" role="region" aria-label="%s">%s</div>',
			esc_attr__( 'Scrollable data table', 'table-cards-responsive' ),
			$block_content
		);
	}
	$block_content = str_replace( '<table', '<table' . $extra, $block_content );
	wp_enqueue_style(
		'table-responsive-media-' . $bp,
		plugin_dir_url( __FILE__ ) . 'assets/css/responsive.css',
		[ 'table-responsive-style' ],
		'0.1.15',
		'screen and (max-width:' . $bp . 'px)'
	);
	return $block_content;
}, 10, 2 );