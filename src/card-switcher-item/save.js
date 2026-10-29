import { RichText, useBlockProps } from '@wordpress/block-editor';
import ArrowIcon from './arrow-icon';

export default function save( { attributes } ) {
	const {
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

	const groupName = `ufo-card-switcher-${ groupId || 'standalone' }`;

	const blockProps = useBlockProps.save( {
		className:
			'group relative flex flex-1 flex-col justify-end overflow-hidden rounded-2xl bg-slate-900 transition-all duration-500 ease-in-out motion-reduce:transition-none min-w-[220px] min-h-[480px] sm:h-[480px] sm:min-h-0',
		name: groupName,
		open: defaultOpen || undefined,
	} );

	const hasBadge = badge && badge.trim().length > 0;
	const hasDescription = description && description.trim().length > 0;
	const hasCta = ctaText && ctaText.trim().length > 0;

	return (
		<details { ...blockProps }>
			<summary className="block cursor-pointer list-none rounded-2xl p-6 pb-0 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-background">
				{ imageUrl && (
					<img
						src={ imageUrl }
						alt={ imageAlt || '' }
						className="not-prose absolute inset-0 h-full w-full object-cover"
						loading="lazy"
					/>
				) }
				<span
					className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent"
					aria-hidden="true"
				/>
				{ hasBadge && (
					<RichText.Content
						tagName="span"
						className="ufo-card-switcher__badge inline-block w-fit rounded-full border border-background/40 bg-background/20 px-3 py-1 text-xs font-semibold text-background"
						value={ badge }
					/>
				) }
				<RichText.Content
					tagName="h3"
					className="ufo-card-switcher__title not-prose relative mb-6 text-xl font-semibold leading-tight text-background sm:text-2xl"
					value={ title }
				/>
			</summary>
			<div className="ufo-card-switcher__panel relative hidden flex-col items-start gap-3 px-6 pb-6 pt-3 group-open:flex">
				{ hasDescription && (
					<RichText.Content
						tagName="p"
						className="ufo-card-switcher__description not-prose m-0 text-base leading-relaxed text-background"
						value={ description }
					/>
				) }
				{ hasCta &&
					( linkUrl ? (
						<a
							className="ufo-card-switcher__cta inline-flex w-fit items-center gap-2 rounded-md bg-background px-4 py-2 text-sm font-medium text-slate-900 no-underline hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
							href={ linkUrl }
							target={ linkNewTab ? '_blank' : undefined }
							rel={
								linkNewTab ? 'noopener noreferrer' : undefined
							}
						>
							<RichText.Content
								tagName="span"
								className="ufo-card-switcher__cta-text"
								value={ ctaText }
							/>
							<ArrowIcon />
						</a>
					) : (
						<span className="ufo-card-switcher__cta inline-flex w-fit items-center gap-2 rounded-md bg-background px-4 py-2 text-sm font-medium text-slate-900">
							<RichText.Content
								tagName="span"
								className="ufo-card-switcher__cta-text"
								value={ ctaText }
							/>
							<ArrowIcon />
						</span>
					) ) }
			</div>
		</details>
	);
}
