// icons.js
// Même rendu que les icônes de bloc d'ufo-tools-blocks (src/icons.js).
// Import uniquement les icônes utilisées pour réduire la taille du bundle
import { Layers, LayersArrowUp } from 'lucide-react';

// Map des icônes disponibles
const iconMap = {
	Layers,
	LayersArrowUp,
};

export const getBlockIcon = ( iconName, options = {} ) => {
	const Icon = iconMap[ iconName ];
	if ( ! Icon ) {
		return null;
	}

	const {
		size = 20,
		color = '#F6F6F7',
		background = '#F6F6F7',
		borderRadius = '4px',
	} = options;

	return {
		src: (
			<div
				style={ {
					backgroundColor: background,
					borderRadius,
					padding: '6px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				} }
			>
				<Icon
					size={ size }
					color={ color }
					style={ { fill: 'none' } }
				/>
			</div>
		),
	};
};
