<?php
/**
 * Balisage enregistré avant Ufo Tools Highlight 1.0.0 : étiquette dans le
 * panneau, sous le titre. La dépréciation de l'éditeur ne migre ce balisage
 * qu'au réenregistrement de la page ; en attendant, le rendu replace
 * l'étiquette avant le titre.
 *
 * Les positions viennent du tokenizer de WP_HTML_Tag_Processor (signets) et
 * pas d'une recherche de chaîne : un texte « <h3 class=… » placé dans une
 * valeur d'attribut n'est pas une balise et ne peut pas servir de point
 * d'insertion (ce qui casserait le balisage filtré par kses).
 *
 * @package UfoToolsHighlight
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

final class Ufo_Tools_Highlight_Legacy_Markup extends WP_HTML_Tag_Processor {

	/**
	 * @param string $content HTML d'une carte.
	 * @return string HTML avec l'étiquette avant le titre, ou inchangé.
	 */
	public static function move_badge_above_title( $content ) {
		$processor = new self( $content );

		if ( ! $processor->find( 'H3', 'ufo-card-switcher__title', 'title' )
			|| ! $processor->find( 'SPAN', 'ufo-card-switcher__badge', 'badge' )
			|| ! $processor->find_closer( 'SPAN', 'badge_end' ) ) {
			return $content;
		}

		$title_at  = $processor->bookmarks['title']->start;
		$badge_at  = $processor->bookmarks['badge']->start;
		$badge_end = $processor->bookmarks['badge_end']->start + $processor->bookmarks['badge_end']->length;
		$badge     = substr( $content, $badge_at, $badge_end - $badge_at );

		return substr( $content, 0, $title_at )
			. $badge
			. substr( $content, $title_at, $badge_at - $title_at )
			. substr( $content, $badge_end );
	}

	/**
	 * Avance jusqu'à la prochaine balise ouvrante $tag portant $class et la
	 * marque d'un signet.
	 */
	private function find( $tag, $class, $bookmark ) {
		while ( $this->next_tag( array( 'tag_name' => $tag ) ) ) {
			if ( $this->has_class( $class ) ) {
				return $this->set_bookmark( $bookmark );
			}
		}
		return false;
	}

	/**
	 * Avance jusqu'à la balise fermante de l'élément $tag courant (en
	 * comptant les éléments $tag imbriqués) et la marque d'un signet.
	 */
	private function find_closer( $tag, $bookmark ) {
		$depth = 1;
		while ( $this->next_tag( array( 'tag_name' => $tag, 'tag_closers' => 'visit' ) ) ) {
			$depth += $this->is_tag_closer() ? -1 : 1;
			if ( 0 === $depth ) {
				return $this->set_bookmark( $bookmark );
			}
		}
		return false;
	}
}
