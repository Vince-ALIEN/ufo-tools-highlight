import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

const TEMPLATE = [
	[ 'ufo-highlight/card-switcher-item', { defaultOpen: true } ],
	[ 'ufo-highlight/card-switcher-item', {} ],
	[ 'ufo-highlight/card-switcher-item', {} ],
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { uid, groupLabel } = attributes;

	useEffect( () => {
		if ( ! uid ) {
			setAttributes( { uid: clientId.slice( 0, 8 ) } );
		}
	}, [ uid, clientId, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'ufo-card-switcher',
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className:
				'ufo-card-switcher__list px-4 m-0 flex list-none flex-col gap-6 p-0 sm:flex-row',
			role: 'group',
			'aria-label':
				groupLabel || __( 'Sélecteur de cartes', 'ufo-highlight' ),
		},
		{
			allowedBlocks: [ 'ufo-highlight/card-switcher-item' ],
			template: TEMPLATE,
			templateLock: false,
			orientation: 'horizontal',
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Accessibilité', 'ufo-highlight' ) }>
					<TextControl
						label={ __(
							"Libellé du groupe (lecteurs d'écran)",
							'ufo-highlight'
						) }
						value={ groupLabel }
						onChange={ ( value ) =>
							setAttributes( { groupLabel: value } )
						}
						help={ __(
							"Décrit le rôle de ce groupe de cartes pour les technologies d'assistance.",
							'ufo-highlight'
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
