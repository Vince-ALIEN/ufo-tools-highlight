<?php
/**
 * Désinstallation : seul le cache des releases GitHub est propre au plugin.
 * Les contenus (blocs ufo-highlight/*) restent dans les pages.
 *
 * @package UfoToolsHighlight
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit();
}

delete_site_transient( 'ufo_tools_highlight_github_release' );
