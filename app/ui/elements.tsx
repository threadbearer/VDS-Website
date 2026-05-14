import React from "react";
import Link from "next/link";

interface SimpleProps {
	children: React.ReactNode;
}

interface ClassNameProps extends SimpleProps {
	className?: string;
}

export function Container({ children }: SimpleProps) {
	return (
		<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
	);
}

export function Section({ children, className = "" }: ClassNameProps) {
	return (
		<section className={`py-20 md:py-28 ${className}`}>{children}</section>
	);
}

export function Card({ children, className = "" }: ClassNameProps) {
	return (
		<div
			className={`bg-bg-surface border border-subtle rounded-lg p-5 card-hover ${className}`}
		>
			{children}
		</div>
	);
}

interface CallToActionProps {
	title?: string;
	blurb?: string;
	primaryHref?: string;
	secondaryHref?: string;
	className?: string;
}

export function CallToAction({
	title = "Start a Project",
	blurb = "Tell us what you’re building. We’ll reply with a quick plan and fixed price.",
	primaryHref = "https://calendar.app.google/MCoM4jfg2dWgypC47",
	secondaryHref = "mailto:jlegorreta@vegadesign.studio",
	className = "",
}: CallToActionProps) {
	return (
		<section
			className={`glass p-8 md:p-12 text-center w-full ${className}`}
		>
			<h3 className="text-3xl md:text-4xl font-bold font-display"><span className="text-gradient">{title}</span></h3>
			<p className="mt-4 text-lg text-text-secondary max-w-xl mx-auto">{blurb}</p>
			<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
				<a
					href={primaryHref}
					target="_blank"
					rel="noopener noreferrer"
					className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-brand-gradient px-6 py-3 text-sm font-medium text-[#0a0a0f] hover:opacity-90 transition-opacity"
				>
					Book a call
				</a>
				<Link
					href={secondaryHref}
					className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-mid bg-bg-surface-2 px-6 py-3 text-sm font-medium text-text-primary hover:border-accent-violet/40 transition-colors"
				>
					Email us
				</Link>
			</div>
		</section>
	);
}
