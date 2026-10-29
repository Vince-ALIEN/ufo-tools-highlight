import { registerBlockType } from '@wordpress/blocks';
import './editor.css';
import './style.css';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { getBlockIcon } from '../icons';

registerBlockType( metadata.name, {
	icon: getBlockIcon( 'Layers', {
		background: '#F6F6F7',
		color: '#EB9188',
	} ),
	edit: Edit,
	save,
} );
