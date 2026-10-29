<?php
/**
 * Front-end override for `ufo-highlight/card-switcher-item`.
 *
 * The block stays a normal static block (title/badge/description/CTA are
 * still authored with RichText and frozen into post_content by save.js —
 * touching that would have broken editing, see below). This file only
 * swaps the single `<img>` tag save.js produces for a `wp_get_attachment_image()`
 * call, so the card photo gets a real responsive `srcset` instead of the one
 * fixed-resolution URL the editor stored. Everything else in $content
 * (the frozen markup) is passed through untouched.
 *
 * A first attempt made this a fully dynamic block (render.php generating
 * *all* the markup, save() returning null) so wp_get_attachment_image()
 * could be used server-side. That broke editing: badge/title/description/
 * ctaText are declared with `source: "html"`, meaning their value is read
 * back from save()'s rendered output, not stored as plain JSON attributes —
 * with save() returning null there was nowhere left to persist them. This
 * surgical, content-preserving approach avoids that entirely.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Contenu enregistré avant 1.0.0 (étiquette dans le panneau, sous le titre) :
// l'étiquette est replacée avant le titre, comme le fait save.js désormais,
// sans attendre que la page soit réenregistrée dans l'éditeur (la
// dépréciation ne migre le balisage qu'à ce moment-là). L'étiquette n'a
// aucun format autorisé : elle ne contient jamais de <span> imbriqué.
if ( preg_match( '/<span class="ufo-card-switcher__badge[^"]*">.*?<\/span>/s', $content, $badge, PREG_OFFSET_CAPTURE ) ) {
	$title_offset = strpos( $content, '<h3 class="ufo-card-switcher__title' );

	if ( false !== $title_offset && $badge[0][1] > $title_offset ) {
		$content = substr_replace( $content, '', $badge[0][1], strlen( $badge[0][0] ) );
		$content = substr_replace( $content, $badge[0][0], $title_offset, 0 );
	}
}

$image_id = $attributes['imageId'] ?? 0;

if ( empty( $image_id ) ) {
	echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	return;
}

$responsive_image = wp_get_attachment_image(
	$image_id,
	'large',
	false,
	array(
		'alt'      => $attributes['imageAlt'] ?? '',
		'class'    => 'not-prose absolute inset-0 h-full w-full object-cover',
		'loading'  => 'lazy',
		'decoding' => 'async',
	)
);

$updated_content = preg_replace(
	'/<img\b[^>]*class="[^"]*not-prose absolute inset-0 h-full w-full object-cover[^"]*"[^>]*\/?>/',
	$responsive_image,
	$content,
	1
);

echo null !== $updated_content ? $updated_content : $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
