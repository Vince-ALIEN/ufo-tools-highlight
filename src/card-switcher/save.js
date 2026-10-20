import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { groupLabel } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'ufo-card-switcher',
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className:
			'ufo-card-switcher__list px-4 m-0 flex list-none flex-col gap-6 p-0 sm:flex-row',
		role: 'group',
		'aria-label': groupLabel || undefined,
	} );

	return (
		<div { ...blockProps }>
			<div { ...innerBlocksProps } />
		</div>
	);
}
