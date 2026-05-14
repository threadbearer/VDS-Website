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
		<section className={`py-16 sm:py-24 ${className}`}>{children}</section>
	);
}

export function Card({ children, className = "" }: ClassNameProps) {
	return (
		<div
			className={`rounded-2xl border border-white/10 bg-white/5 p-6 ${className}`}
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
			className={`rounded-2xl border border-white/10 bg-white/5 p-6 ${className}`}
		>
			<h3 className="text-lg font-semibold">{title}</h3>
			<p className="mt-2 text-sm text-neutral-300">{blurb}</p>
			<div className="mt-4 flex gap-3">
				<a
					href={primaryHref}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
				>
					Book a call
				</a>
				<Link
					href={secondaryHref}
					className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
				>
					Email us
				</Link>
			</div>
		</section>
	);
}
