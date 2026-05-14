'use client'
import { useState } from "react";
import Link from "next/link";
import { BRAND, BOOKING } from "@/information";

export default function NavBar() {
	const [menuOpen, setMenuOpen] = useState<boolean>(false);

	return (
		<header className="sticky top-0 z-50 border-b border-white/[0.06]" style={{ background: 'rgba(11,11,11,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-3">
						<img
							src="/logo-vega-agent.png"
							alt="Vega Design Studio"
							className="h-9 w-auto hidden sm:block"
						/>
						<Link
							href="/"
							className="text-lg font-semibold tracking-wide brand-gradient-animated"
						>
							{BRAND.name}
						</Link>
					</div>
					<nav className="hidden md:flex items-center gap-7 text-sm text-neutral-400">
						{[
							{ href: "/", label: "Home" },
							{ href: "/work", label: "Work" },
							{ href: "/services", label: "Services" },
							{ href: "/about", label: "About" },
							{ href: "/contact", label: "Contact" },
						].map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="transition-colors duration-200 hover:text-white"
							>
								{link.label}
							</Link>
						))}
					</nav>
					<div className="flex items-center gap-3">
						<a
							href={BOOKING}
							target="_blank"
							rel="noopener noreferrer"
							className="hidden sm:inline-flex rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
							style={{ background: 'linear-gradient(90deg, #00FFFF, #00BFFF)', color: '#000' }}
						>
							Book Consultation
						</a>
						{/* Mobile hamburger */}
						<button
							onClick={() => setMenuOpen(!menuOpen)}
							className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
							aria-label="Toggle navigation"
							aria-expanded={menuOpen}
						>
							<span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
							<span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
							<span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			<div
				className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}
				style={{ background: 'rgba(11,11,11,0.95)', backdropFilter: 'blur(16px)' }}
			>
				<nav className="flex flex-col px-6 py-4 gap-1 border-t border-white/[0.06]">
					{[
						{ href: "/", label: "Home" },
						{ href: "/work", label: "Work" },
						{ href: "/services", label: "Services" },
						{ href: "/about", label: "About" },
						{ href: "/contact", label: "Contact" },
					].map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setMenuOpen(false)}
							className="py-2.5 text-sm text-neutral-300 hover:text-white transition-colors"
						>
							{link.label}
						</Link>
					))}
					<a
						href={BOOKING}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-2 rounded-full px-4 py-2 text-sm font-medium text-center text-black"
						style={{ background: 'linear-gradient(90deg, #00FFFF, #00BFFF)' }}
					>
						Book Consultation
					</a>
				</nav>
			</div>
		</header>
	);
}
