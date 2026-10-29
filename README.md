# UFO Tools Highlight

Bloc Gutenberg **« Sélecteur de cartes »** : un accordéon horizontal de cartes image + titre, basé sur `<details>` / `<summary>`. Aucun JavaScript sur le site, accessible au clavier et aux lecteurs d'écran.

> Fait partie des plugins **Ufo Tools** de [UFO Agency](https://ufo-agency.com) (voir [ufo-tools-blocks](https://github.com/Vince-ALIEN/ufo-tools-blocks)).

## Blocs

| Bloc | Nom du bloc | Description |
|---|---|---|
| UFO Sélecteur de cartes | `ufo-highlight/card-switcher` | Conteneur des cartes |
| UFO Carte du sélecteur | `ufo-highlight/card-switcher-item` | Carte : image, titre, étiquette, description, bouton |

Les noms de blocs (`ufo-highlight/*`) et les classes CSS sont ceux d'UFO Highlight 1.0.0 : les contenus existants restent valides. Les blocs apparaissent dans la catégorie **UFO Blocks**, partagée avec les autres Ufo Tools.

## Comportement

- **Desktop (≥ 640 px)** : cartes en rangée ; la carte ouverte s'élargit et révèle étiquette, description et bouton. Une seule carte ouverte à la fois (`<details name>`).
- **Mobile (< 640 px)** : cartes empilées, titre, étiquette, description et bouton **toujours visibles** (`::details-content`, Chrome 131+, Safari 18.4+, Firefox 143+ ; les navigateurs plus anciens gardent l'accordéon).

## Édition

- Cliquer sur une carte (ou sur son nom dans la barre latérale du sélecteur, panneau « Cartes ») l'ouvre dans l'éditeur pour la modifier ; sans sélection, la carte « ouverte par défaut » est affichée.
- Repère « Carte N » sur chaque carte.
- Barre d'outils de la carte : ★ ouverte par défaut, lien du bouton, remplacer / retirer l'image.
- Barre d'outils du sélecteur : « Ajouter une carte ».

## Installation

```bash
cd wp-content/plugins
git clone https://github.com/Vince-ALIEN/ufo-tools-highlight.git
cd ufo-tools-highlight
npm install
npm run build
```

Le design (couleurs, typographie, dégradés) utilise des classes Tailwind CSS v4 générées par le thème : ajoutez ce plugin aux sources Tailwind du thème.

```css
@source "../../../plugins/ufo-tools-highlight/src/**/*.js";
```

La structure (rangée / pile, hauteurs, ouverture du panneau, affichage mobile) est en CSS simple dans le plugin et ne dépend pas du thème.

## Mises à jour

Les sites installés depuis le zip de release reçoivent les mises à jour depuis les releases GitHub (`includes/class-ufo-tools-highlight-updater.php`). Publier une version : mettre à jour `Version:` dans `ufo-tools-highlight.php` et `CHANGELOG.md`, puis pousser un tag `vX.Y.Z` ; le workflow construit et publie `ufo-tools-highlight.zip`.

## Licence

GPL-2.0-or-later
