import { Container } from "@/ui/elements";
import { BRAND } from "@/information";

export default function Footer() {
	return (
		<footer className="border-t border-white/[0.06] py-12" style={{ background: 'var(--bg)' }}>
			<Container>
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="text-center md:text-left">
						<div className="brand-gradient-animated text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
							{BRAND.name}
						</div>
						<div className="mt-1 text-xs text-neutral-500">
							© {new Date().getFullYear()} Vega Design Studio • {BRAND.city}
						</div>
					</div>
					<div className="flex items-center gap-6 text-sm text-neutral-500">
						<a href={BRAND.phone} className="hover:text-white transition-colors">
							{BRAND.contactNum}
						</a>
						<a href={`mailto:${BRAND.email}`} className="hover:text-white transition-colors">
							Email
						</a>
						<a href={BRAND.github} target="_blank" rel="noopener" className="hover:text-white transition-colors">
							GitHub
						</a>
					</div>
				</div>
			</Container>
		</footer>
	);
}
