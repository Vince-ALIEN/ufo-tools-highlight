import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	Button,
} from '@wordpress/components';
import ArrowIcon from './arrow-icon';

export default function Edit( {
	attributes,
	setAttributes,
	clientId,
	context,
} ) {
	const {
		uid,
		groupId,
		defaultOpen,
		imageUrl,
		imageAlt,
		badge,
		title,
		description,
		ctaText,
		linkUrl,
		linkNewTab,
	} = attributes;

	const switcherId = context[ 'ufo-highlight/switcherId' ];

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

	const groupName = `ufo-card-switcher-${
		switcherId || groupId || 'standalone'
	}`;

	const blockProps = useBlockProps( {
		className:
			'group relative flex flex-1 flex-col justify-end overflow-hidden rounded-2xl bg-slate-900 transition-all duration-500 ease-in-out motion-reduce:transition-none min-w-[220px] min-h-[480px] sm:h-[480px] sm:min-h-0',
		name: groupName,
		open: defaultOpen || undefined,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Image', 'ufo-highlight' ) }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									imageUrl: media.url,
									imageId: media.id,
									imageAlt: imageAlt || media.alt || '',
								} )
							}
							allowedTypes={ [ 'image' ] }
							value={ attributes.imageId }
							render={ ( { open } ) => (
								<Button onClick={ open } variant="secondary">
									{ imageUrl
										? __(
												"Changer l'image",
												'ufo-highlight'
										  )
										: __(
												'Choisir une image',
												'ufo-highlight'
										  ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
					<TextControl
						label={ __(
							"Texte alternatif de l'image",
							'ufo-highlight'
						) }
						value={ imageAlt }
						onChange={ ( value ) =>
							setAttributes( { imageAlt: value } )
						}
						help={ __(
							"Laissez vide si l'image est purement décorative (le titre et la description suffisent).",
							'ufo-highlight'
						) }
						disabled={ ! imageUrl }
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Comportement', 'ufo-highlight' ) }
					initialOpen={ false }
				>
					<ToggleControl
						label={ __( 'Ouverte par défaut', 'ufo-highlight' ) }
						checked={ defaultOpen }
						onChange={ ( value ) =>
							setAttributes( { defaultOpen: value } )
						}
						help={ __(
							"Une seule carte du groupe doit être ouverte par défaut. Le clic natif étant désactivé dans l'éditeur (pour permettre l'édition du texte), utilisez ce réglage pour prévisualiser l'état ouvert.",
							'ufo-highlight'
						) }
					/>
				</PanelBody>

				<PanelBody
					title={ __(
						'Lien du bouton (optionnel)',
						'ufo-highlight'
					) }
					initialOpen={ false }
				>
					<TextControl
						label={ __( 'URL', 'ufo-highlight' ) }
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
								'ufo-highlight'
							) }
							checked={ linkNewTab }
							onChange={ ( value ) =>
								setAttributes( { linkNewTab: value } )
							}
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<details { ...blockProps }>
				<summary
					className="block cursor-pointer list-none rounded-2xl p-6 pb-0 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-background"
					onClick={ ( event ) => event.preventDefault() }
				>
					{ imageUrl ? (
						<img
							src={ imageUrl }
							alt=""
							className="not-prose absolute inset-0 h-full w-full object-cover"
						/>
					) : (
						<span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-sm text-background/60">
							{ __( 'Aucune image', 'ufo-highlight' ) }
						</span>
					) }
					<span
						className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent"
						aria-hidden="true"
					/>
					<RichText
						tagName="h3"
						className="ufo-card-switcher__title relative m-0 text-[1.375rem] font-semibold leading-tight text-background sm:text-2xl"
						value={ title }
						onChange={ ( value ) =>
							setAttributes( { title: value } )
						}
						placeholder={ __(
							'Titre de la carte…',
							'ufo-highlight'
						) }
						allowedFormats={ [] }
					/>
				</summary>
				<div className="ufo-card-switcher__panel relative hidden flex-col items-start gap-3 px-6 pb-6 pt-3 group-open:flex">
					<RichText
						tagName="span"
						className="ufo-card-switcher__badge inline-block w-fit rounded-full border border-background/40 bg-background/20 px-3 py-1 text-xs font-semibold text-background"
						value={ badge }
						onChange={ ( value ) =>
							setAttributes( { badge: value } )
						}
						placeholder={ __(
							'Badge (optionnel)…',
							'ufo-highlight'
						) }
						allowedFormats={ [] }
					/>
					<RichText
						tagName="p"
						className="ufo-card-switcher__description m-0 text-base leading-relaxed text-background"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						placeholder={ __(
							'Description de la carte…',
							'ufo-highlight'
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
								'ufo-highlight'
							) }
							allowedFormats={ [] }
						/>
						<ArrowIcon />
					</span>
				</div>
			</details>
		</>
	);
}
