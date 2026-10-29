import { __, sprintf } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	BlockControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	Button,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { plus, starFilled } from '@wordpress/icons';

const ITEM = 'ufo-highlight/card-switcher-item';

const TEMPLATE = [
	[ ITEM, { defaultOpen: true } ],
	[ ITEM, {} ],
	[ ITEM, {} ],
];

// Titre RichText (HTML) → texte brut pour la liste des cartes.
const toPlainText = ( html ) =>
	( html || '' )
		.replace( /<[^>]*>/g, '' )
		.replace( /&nbsp;/g, ' ' )
		.trim();

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { uid, groupLabel } = attributes;

	const cards = useSelect(
		( select ) => select( blockEditorStore ).getBlocks( clientId ),
		[ clientId ]
	);
	const { insertBlock, selectBlock } = useDispatch( blockEditorStore );

	useEffect( () => {
		if ( ! uid ) {
			setAttributes( { uid: clientId.slice( 0, 8 ) } );
		}
	}, [ uid, clientId, setAttributes ] );

	const addCard = () =>
		insertBlock( createBlock( ITEM ), cards.length, clientId );

	const blockProps = useBlockProps( {
		className: 'ufo-card-switcher',
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className:
				'ufo-card-switcher__list px-4 m-0 flex list-none flex-col gap-6 p-0 sm:flex-row',
			role: 'group',
			'aria-label':
				groupLabel ||
				__( 'Sélecteur de cartes', 'ufo-tools-highlight' ),
		},
		{
			allowedBlocks: [ ITEM ],
			template: TEMPLATE,
			templateLock: false,
			orientation: 'horizontal',
			renderAppender: false,
		}
	);

	return (
		<>
			<BlockControls group="other">
				<ToolbarGroup>
					<ToolbarButton icon={ plus } onClick={ addCard }>
						{ __( 'Ajouter une carte', 'ufo-tools-highlight' ) }
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={ __( 'Cartes', 'ufo-tools-highlight' ) }>
					<p className="ufo-card-switcher__cards-help">
						{ __(
							"Cliquez sur une carte (ici ou dans la page) pour l'ouvrir et la modifier.",
							'ufo-tools-highlight'
						) }
					</p>
					<ul className="ufo-card-switcher__cards">
						{ cards.map( ( card, index ) => (
							<li key={ card.clientId }>
								<Button
									variant="tertiary"
									icon={
										card.attributes.defaultOpen
											? starFilled
											: undefined
									}
									iconPosition="right"
									onClick={ () =>
										selectBlock( card.clientId )
									}
								>
									{ sprintf(
										/* translators: 1: card position, 2: card title. */
										__(
											'%1$d. %2$s',
											'ufo-tools-highlight'
										),
										index + 1,
										toPlainText( card.attributes.title ) ||
											__(
												'(sans titre)',
												'ufo-tools-highlight'
											)
									) }
								</Button>
							</li>
						) ) }
					</ul>
					<Button
						variant="secondary"
						icon={ plus }
						onClick={ addCard }
					>
						{ __( 'Ajouter une carte', 'ufo-tools-highlight' ) }
					</Button>
				</PanelBody>
				<PanelBody
					title={ __( 'Accessibilité', 'ufo-tools-highlight' ) }
					initialOpen={ false }
				>
					<TextControl
						label={ __(
							"Libellé du groupe (lecteurs d'écran)",
							'ufo-tools-highlight'
						) }
						value={ groupLabel }
						onChange={ ( value ) =>
							setAttributes( { groupLabel: value } )
						}
						help={ __(
							"Décrit le rôle de ce groupe de cartes pour les technologies d'assistance.",
							'ufo-tools-highlight'
						) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
