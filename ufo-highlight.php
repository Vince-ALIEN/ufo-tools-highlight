<?php

/**
 * Plugin Name:       UFO Highlight
 * Description:       Bloc Gutenberg « Sélecteur de cartes » interactif et accessible (clavier + lecteurs d'écran), sans système de build Tailwind.
 * Requires at least: 6.1
 * Requires PHP:      7.4
 * Version:           1.0.0
 * Author:            Vincent LASSERRE
 * License:           GPL-2.0-or-later
 * License URI:       https://www.ufo-agency.com/
 * Text Domain:       ufo-highlight
 *
 * @package UfoHighlight
 */

if (!defined("ABSPATH")) {
    exit();
}

function ufo_highlight_register_blocks()
{
    register_block_type(__DIR__ . "/build/card-switcher");
    register_block_type(__DIR__ . "/build/card-switcher-item");
}
add_action("init", "ufo_highlight_register_blocks");

function ufo_highlight_register_category($categories)
{
    return array_merge(
        $categories,
        array(
            array(
                'slug'  => 'ufo-highlight',
                'title' => __('UFO Highlight', 'ufo-highlight'),
            ),
        )
    );
}
add_filter('block_categories_all', 'ufo_highlight_register_category', 10, 2);
