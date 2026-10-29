<?php

/**
 * Plugin Name:       Ufo Tools Highlight
 * Description:       Bloc Gutenberg « Sélecteur de cartes » interactif et accessible (clavier + lecteurs d'écran), sans JavaScript sur le site.
 * Requires at least: 6.1
 * Requires PHP:      7.4
 * Version:           1.0.0
 * Author:            Vincent LASSERRE
 * License:           GPL-2.0-or-later
 * License URI:       https://www.ufo-agency.com/
 * Text Domain:       ufo-tools-highlight
 * Update URI:        https://github.com/Vince-ALIEN/ufo-tools-highlight
 *
 * @package UfoToolsHighlight
 */

if (!defined("ABSPATH")) {
    exit();
}

// Ancien nom du plugin (UFO Highlight 1.0.0). Il enregistre les mêmes blocs :
// il est désactivé à l'activation de celui-ci, et tant qu'il reste actif ce
// plugin ne charge rien pour ne pas enregistrer les blocs deux fois.
const UFO_TOOLS_HIGHLIGHT_PREDECESSOR = 'ufo-highlight/ufo-highlight.php';

register_activation_hook(__FILE__, function () {
    deactivate_plugins(UFO_TOOLS_HIGHLIGHT_PREDECESSOR, true, is_network_admin());
});

if (in_array(UFO_TOOLS_HIGHLIGHT_PREDECESSOR, (array) get_option('active_plugins', array()), true)
    || array_key_exists(UFO_TOOLS_HIGHLIGHT_PREDECESSOR, (array) get_site_option('active_sitewide_plugins', array()))) {
    add_action('admin_notices', function () {
        if (current_user_can('activate_plugins')) {
            printf(
                '<div class="notice notice-warning"><p>%s</p></div>',
                esc_html__('Ufo Tools Highlight remplace UFO Highlight : désactivez et supprimez UFO Highlight pour que les blocs soient fournis par Ufo Tools Highlight.', 'ufo-tools-highlight')
            );
        }
    });
    return;
}

require_once plugin_dir_path(__FILE__) . 'includes/class-ufo-tools-highlight-updater.php';

// WP_HTML_Tag_Processor : WordPress 6.2+.
if (class_exists('WP_HTML_Tag_Processor')) {
    require_once plugin_dir_path(__FILE__) . 'includes/legacy-markup.php';
}

// Mises à jour depuis les releases GitHub (hors is_admin() : la
// vérification des mises à jour tourne aussi en cron).
add_action('plugins_loaded', function () {
    $updater = new Ufo_Tools_Highlight_Updater(plugin_basename(__FILE__), plugin_dir_path(__FILE__));
    $updater->register_hooks();
});

// Les blocs gardent leur nom historique (ufo-highlight/*) pour que les
// contenus existants restent valides.
function ufo_tools_highlight_register_blocks()
{
    register_block_type(__DIR__ . "/build/card-switcher");
    register_block_type(__DIR__ . "/build/card-switcher-item");
}
add_action("init", "ufo_tools_highlight_register_blocks");

// Catégorie partagée avec Ufo Tools Blocks et les autres Ufo Tools : ajoutée
// seulement si aucun d'eux ne l'a déjà fait.
function ufo_tools_highlight_register_category($categories) {
    if (in_array('ufo-blocks', wp_list_pluck($categories, 'slug'), true)) {
        return $categories;
    }

    $categories[] = array(
        'slug'  => 'ufo-blocks',
        'title' => __('UFO Blocks', 'ufo-tools-highlight'),
    );
    return $categories;
}
add_filter('block_categories_all', 'ufo_tools_highlight_register_category', 20);
