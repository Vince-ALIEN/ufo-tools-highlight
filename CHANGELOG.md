# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-10-29

### Added
- **« UFO Carte du sélecteur » insérable seule**, partout dans l'éditeur (cellule ufo Row, racine de la page…), plus seulement dans un « UFO Sélecteur de cartes ». Une carte seule s'ouvre et se ferme indépendamment des autres (pas d'attribut `name`), s'ouvre dans l'éditeur quand elle est sélectionnée et charge la feuille de style du sélecteur. Une carte sortie d'un sélecteur quitte son accordéon.

### Changed
- Icône du bloc « UFO Carte du sélecteur » : `LayersArrowUp` de Lucide, même traitement que le sélecteur.
- `lucide-react` 1.64 (`LayersArrowUp` n'existe pas en 0.x).
- Icône du bloc « UFO Sélecteur de cartes » : `Layers` de Lucide, sur fond `#F6F6F7` en `#EB9188`, comme les blocs d'ufo-tools-blocks.
- WordPress 6.3 minimum (blocs en `apiVersion` 3, `WP_HTML_Tag_Processor`).
- Licence : fichier `LICENSE.txt` (GPL-2.0) et `License URI` vers le texte de la GPL.
- `uninstall.php` supprime le cache des releases GitHub.

### Security
- **Rendu de la carte** : un `$0` ou `\1` dans le texte alternatif de l'image n'est plus interprété par le remplacement de l'`<img>` (`preg_replace_callback`). Il permettait à un contributeur d'injecter un attribut dans la balise.
- `render.php` s'arrête s'il est appelé directement.
- « Vérifier à nouveau » ne contourne le cache des releases que pour un utilisateur qui peut mettre à jour les plugins.

### Fixed
- Image supprimée de la médiathèque : la carte garde l'image enregistrée au lieu de n'en afficher aucune.

## [1.0.0] - 2026-10-29

Première version d'**Ufo Tools Highlight**, successeur d'UFO Highlight 1.0.0 (nouveau dépôt).

### Changed
- **Plugin renommé `ufo-tools-highlight`** (dossier, fichier principal `ufo-tools-highlight.php`, text domain, dépôt GitHub `Vince-ALIEN/ufo-tools-highlight`, préfixes PHP `ufo_tools_highlight_`). Les noms de blocs (`ufo-highlight/*`) et les classes CSS sont inchangés : les contenus existants restent valides.
  - Migration : installer et activer Ufo Tools Highlight, qui désactive UFO Highlight, puis supprimer UFO Highlight. Tant qu'UFO Highlight est actif, Ufo Tools Highlight ne charge rien et affiche un avertissement.
  - Thèmes : remplacer le chemin `@source` Tailwind par `plugins/ufo-tools-highlight/src`.
- Les blocs passent dans la catégorie partagée **UFO Blocks**.
- **Étiquette au-dessus du titre** (dans le `<summary>`) : révélée à l'ouverture sur desktop, toujours visible sur mobile. Les cartes enregistrées avec l'étiquette sous le titre restent valides (dépréciation) et sont migrées à la prochaine sauvegarde  ; d'ici là, le rendu replace l'étiquette au-dessus du titre sur le site (WordPress 6.2+, via `WP_HTML_Tag_Processor`).
- Titre en `text-lg` (au lieu de `text-[1.375rem]`) sur mobile, description en `not-prose`.
- **Édition** : la carte sélectionnée s'ouvre dans l'éditeur (plus besoin de basculer « Ouverte par défaut » pour modifier une carte). Les cartes sont rendues en `<div>` dans l'éditeur : la barre d'espace et le clic ne déclenchent plus l'ouverture native du `<summary>` pendant la saisie du titre.
  - Repère « Carte N » sur chaque carte, liste des cartes cliquable dans la barre latérale du sélecteur, bouton « Ajouter une carte ».
  - Barre d'outils de la carte : ouverte par défaut, lien du bouton (LinkControl), remplacer / retirer l'image.

### Fixed
- **Mobile** (< 640 px) : titre, étiquette, description et bouton restent visibles sur toutes les cartes, ouvertes ou non.
- La structure (rangée à partir de 640 px, hauteurs, ouverture du panneau) ne dépend plus du Tailwind du thème : sans lui, les cartes restaient empilées et fermées sur desktop.

### Added
- Mises à jour depuis les releases GitHub (`Update URI`, asset `ufo-tools-highlight.zip` publié par le workflow de release sur tag `vX.Y.Z`).
