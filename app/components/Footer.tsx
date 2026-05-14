import { Container } from "@/ui/elements";
import { BRAND } from "@/information";
import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-bg-surface border-t border-subtle py-12">
			<Container>
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="text-center md:text-left">
						<div className="text-lg font-display font-semibold text-gradient">
							{BRAND.name}
						</div>
						<div className="mt-2 text-xs text-text-muted">
							© {new Date().getFullYear()} Vega Design Studio • {BRAND.city}
						</div>
					</div>
					<div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-text-muted justify-center md:justify-end">
						<a href={BRAND.phone} className="hover:text-text-secondary transition-colors">
							{BRAND.contactNum}
						</a>
						<a href={`mailto:${BRAND.email}`} className="hover:text-text-secondary transition-colors">
							Email
						</a>
						<a href={BRAND.github} target="_blank" rel="noopener noreferrer" className="hover:text-text-secondary transition-colors">
							GitHub
						</a>
						<Link href="/privacy" className="hover:text-text-secondary transition-colors">
							Privacy
						</Link>
					</div>
				</div>
			</Container>
		</footer>
	);
}
