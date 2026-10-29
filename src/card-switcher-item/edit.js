import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	BlockControls,
	MediaUpload,
	MediaUploadCheck,
	MediaReplaceFlow,
	LinkControl,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	Button,
	Popover,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { link, linkOff, starEmpty, starFilled } from '@wordpress/icons';
import ArrowIcon from './arrow-icon';

export default function Edit( {
	attributes,
	setAttributes,
	clientId,
	context,
	isSelected,
} ) {
	const {
		uid,
		groupId,
		defaultOpen,
		imageUrl,
		imageAlt,
		imageId,
		badge,
		title,
		description,
		ctaText,
		linkUrl,
		linkNewTab,
	} = attributes;

	const [ isLinkPopoverOpen, setIsLinkPopoverOpen ] = useState( false );
	const [ ctaAnchor, setCtaAnchor ] = useState( null );

	const switcherId = context[ 'ufo-highlight/switcherId' ];

	// Dans l'éditeur, la carte ouverte est celle qu'on édite : la carte
	// sélectionnée si la sélection est dans ce sélecteur, sinon la carte
	// « Ouverte par défaut » (état affiché sur le site).
	const { isOpen, position, siblingsCount } = useSelect(
		( select ) => {
			const {
				getBlockRootClientId,
				getBlockOrder,
				getSelectedBlockClientId,
			} = select( blockEditorStore );
			const siblings = getBlockOrder( getBlockRootClientId( clientId ) );
			const selectedId = getSelectedBlockClientId();

			return {
				isOpen: siblings.includes( selectedId )
					? selectedId === clientId
					: defaultOpen,
				position: siblings.indexOf( clientId ) + 1,
				siblingsCount: siblings.length,
			};
		},
		[ clientId, defaultOpen ]
	);

	useEffect( () => {
		if ( ! uid ) {
			setAttributes( { uid: clientId.slice( 0, 8 ) } );
		}
	}, [ uid, clientId, setAttributes ] );

	useEffect( () => {
		if ( switcherId && switcherId !== groupId ) {
			setAttributes( { groupId: switcherId } );
		}
	}, [ switcherId, groupId, setAttributes ] );

	useEffect( () => {
		if ( ! isSelected ) {
			setIsLinkPopoverOpen( false );
		}
	}, [ isSelected ] );

	const onSelectImage = ( media ) =>
		setAttributes( {
			imageUrl: media.url,
			imageId: media.id,
			imageAlt: imageAlt || media.alt || '',
		} );

	const onResetImage = () =>
		setAttributes( { imageUrl: '', imageId: 0, imageAlt: '' } );

	// <details>/<summary> sont remplacés par des <div> dans l'éditeur : un
	// <summary> intercepte la barre d'espace et le clic (le titre devenait
	// difficile à éditer) et l'ouverture native se battait avec la sélection.
	// L'attribut `open` est conservé pour que les styles [open] / group-open
	// du site s'appliquent à l'identique.
	const blockProps = useBlockProps( {
		className:
			'group relative flex flex-1 flex-col justify-end overflow-hidden rounded-2xl bg-slate-900 transition-all duration-500 ease-in-out motion-reduce:transition-none min-w-[220px] min-h-[480px] sm:h-[480px] sm:min-h-0',
		open: isOpen || undefined,
		'aria-label': sprintf(
			/* translators: 1: card position, 2: number of cards. */
			__( 'Carte %1$d sur %2$d', 'ufo-tools-highlight' ),
			position,
			siblingsCount
		),
	} );

	return (
		<>
			<BlockControls group="block">
				<ToolbarGroup>
					<ToolbarButton
						icon={ defaultOpen ? starFilled : starEmpty }
						label={
							defaultOpen
								? __(
										'Ne plus ouvrir par défaut',
										'ufo-tools-highlight'
								  )
								: __(
										'Ouvrir par défaut',
										'ufo-tools-highlight'
								  )
						}
						isPressed={ defaultOpen }
						onClick={ () =>
							setAttributes( { defaultOpen: ! defaultOpen } )
						}
					/>
					<ToolbarButton
						ref={ setCtaAnchor }
						icon={ linkUrl ? linkOff : link }
						label={
							linkUrl
								? __(
										'Modifier le lien du bouton',
										'ufo-tools-highlight'
								  )
								: __(
										'Ajouter un lien au bouton',
										'ufo-tools-highlight'
								  )
						}
						isActive={ !! linkUrl || isLinkPopoverOpen }
						onClick={ () => setIsLinkPopoverOpen( ( v ) => ! v ) }
					/>
				</ToolbarGroup>
			</BlockControls>

			<BlockControls group="other">
				<MediaReplaceFlow
					mediaId={ imageId }
					mediaURL={ imageUrl }
					allowedTypes={ [ 'image' ] }
					accept="image/*"
					onSelect={ onSelectImage }
					onReset={ imageUrl ? onResetImage : undefined }
					name={
						imageUrl
							? __( "Remplacer l'image", 'ufo-tools-highlight' )
							: __( 'Ajouter une image', 'ufo-tools-highlight' )
					}
				/>
			</BlockControls>

			{ isLinkPopoverOpen && (
				<Popover
					anchor={ ctaAnchor }
					placement="bottom"
					onClose={ () => setIsLinkPopoverOpen( false ) }
					focusOnMount
				>
					<div style={ { padding: '8px', minWidth: 320 } }>
						<LinkControl
							value={ {
								url: linkUrl,
								opensInNewTab: linkNewTab,
							} }
							onChange={ ( { url, opensInNewTab } ) =>
								setAttributes( {
									linkUrl: url || '',
									linkNewTab: !! opensInNewTab,
								} )
							}
							onRemove={ () => {
								setAttributes( {
									linkUrl: '',
									linkNewTab: false,
								} );
								setIsLinkPopoverOpen( false );
							} }
						/>
					</div>
				</Popover>
			) }

			<InspectorControls>
				<PanelBody title={ __( 'Image', 'ufo-tools-highlight' ) }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectImage }
							allowedTypes={ [ 'image' ] }
							value={ imageId }
							render={ ( { open } ) => (
								<Button onClick={ open } variant="secondary">
									{ imageUrl
										? __(
												"Changer l'image",
												'ufo-tools-highlight'
										  )
										: __(
												'Choisir une image',
												'ufo-tools-highlight'
										  ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
					<TextControl
						label={ __(
							"Texte alternatif de l'image",
							'ufo-tools-highlight'
						) }
						value={ imageAlt }
						onChange={ ( value ) =>
							setAttributes( { imageAlt: value } )
						}
						help={ __(
							"Laissez vide si l'image est purement décorative (le titre et la description suffisent).",
							'ufo-tools-highlight'
						) }
						disabled={ ! imageUrl }
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Comportement', 'ufo-tools-highlight' ) }
					initialOpen={ false }
				>
					<ToggleControl
						label={ __(
							'Ouverte par défaut',
							'ufo-tools-highlight'
						) }
						checked={ defaultOpen }
						onChange={ ( value ) =>
							setAttributes( { defaultOpen: value } )
						}
						help={ __(
							"Carte ouverte au chargement de la page (une seule par sélecteur). Dans l'éditeur, la carte sélectionnée s'ouvre toujours pour être modifiée.",
							'ufo-tools-highlight'
						) }
					/>
				</PanelBody>

				<PanelBody
					title={ __(
						'Lien du bouton (optionnel)',
						'ufo-tools-highlight'
					) }
					initialOpen={ false }
				>
					<TextControl
						label={ __( 'URL', 'ufo-tools-highlight' ) }
						value={ linkUrl }
						onChange={ ( value ) =>
							setAttributes( { linkUrl: value } )
						}
						placeholder="https://"
						type="url"
					/>
					{ linkUrl && (
						<ToggleControl
							label={ __(
								'Ouvrir dans un nouvel onglet',
								'ufo-tools-highlight'
							) }
							checked={ linkNewTab }
							onChange={ ( value ) =>
								setAttributes( { linkNewTab: value } )
							}
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<span
					className="ufo-card-switcher__editor-label"
					aria-hidden="true"
				>
					{ sprintf(
						/* translators: %d: card position. */
						__( 'Carte %d', 'ufo-tools-highlight' ),
						position
					) }
					{ defaultOpen &&
						` · ${ __(
							'ouverte par défaut',
							'ufo-tools-highlight'
						) }` }
				</span>
				<div className="block rounded-2xl p-6 pb-0">
					{ imageUrl ? (
						<img
							src={ imageUrl }
							alt=""
							className="not-prose absolute inset-0 h-full w-full object-cover"
						/>
					) : (
						<span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-sm text-background/60">
							{ __( 'Aucune image', 'ufo-tools-highlight' ) }
						</span>
					) }
					<span
						className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent"
						aria-hidden="true"
					/>
					<RichText
						tagName="span"
						className="ufo-card-switcher__badge inline-block w-fit rounded-full border border-background/40 bg-background/20 px-3 py-1 text-xs font-semibold text-background"
						value={ badge }
						onChange={ ( value ) =>
							setAttributes( { badge: value } )
						}
						placeholder={ __(
							'Étiquette (optionnelle)…',
							'ufo-tools-highlight'
						) }
						allowedFormats={ [] }
					/>
					<RichText
						tagName="h3"
						className="ufo-card-switcher__title not-prose relative mb-6 text-xl font-semibold leading-tight text-background sm:text-2xl"
						value={ title }
						onChange={ ( value ) =>
							setAttributes( { title: value } )
						}
						placeholder={ __(
							'Titre de la carte…',
							'ufo-tools-highlight'
						) }
						allowedFormats={ [] }
					/>
				</div>
				<div className="ufo-card-switcher__panel relative hidden flex-col items-start gap-3 px-6 pb-6 pt-3 group-open:flex">
					<RichText
						tagName="p"
						className="ufo-card-switcher__description not-prose m-0 text-base leading-relaxed text-background"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						placeholder={ __(
							'Description de la carte…',
							'ufo-tools-highlight'
						) }
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
					/>
					<span className="ufo-card-switcher__cta inline-flex w-fit items-center gap-2 rounded-md bg-background px-4 py-2 text-sm font-medium text-slate-900 no-underline hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background">
						<RichText
							tagName="span"
							className="ufo-card-switcher__cta-text"
							value={ ctaText }
							onChange={ ( value ) =>
								setAttributes( { ctaText: value } )
							}
							placeholder={ __(
								'En savoir plus',
								'ufo-tools-highlight'
							) }
							allowedFormats={ [] }
						/>
						<ArrowIcon />
					</span>
				</div>
			</div>
		</>
	);
}
