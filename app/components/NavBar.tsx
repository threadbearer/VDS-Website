'use client'
import { useState } from "react";
import Link from "next/link";
import { BRAND, BOOKING } from "@/information";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
	const [menuOpen, setMenuOpen] = useState<boolean>(false);

	return (
		<header className="sticky top-0 z-50 bg-bg-surface/80 backdrop-blur-md border-b border-subtle">
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
							className="text-lg font-display font-semibold tracking-wide text-gradient"
						>
							{BRAND.name}
						</Link>
					</div>
					<nav className="hidden md:flex items-center gap-7 text-sm">
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
								className="text-text-secondary hover:text-text-primary transition-colors duration-200"
							>
								{link.label}
							</Link>
						))}
					</nav>
					<div className="flex items-center gap-3">
						<ThemeToggle />
						<a
							href={BOOKING}
							target="_blank"
							rel="noopener noreferrer"
							className="hidden sm:inline-flex bg-brand-gradient text-[#0a0a0f] font-medium px-4 py-2 rounded-md text-sm hover:opacity-90 transition-opacity"
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
							<span className={`block w-5 h-[1.5px] bg-text-primary transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
							<span className={`block w-5 h-[1.5px] bg-text-primary transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
							<span className={`block w-5 h-[1.5px] bg-text-primary transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			<div
				className={`md:hidden overflow-hidden transition-all duration-300 ease-out bg-bg-surface border-b border-subtle ${menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 border-transparent'}`}
			>
				<nav className="flex flex-col px-6 py-4 gap-1 border-t border-subtle">
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
							className="py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
						>
							{link.label}
						</Link>
					))}
					<a
						href={BOOKING}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-2 w-full text-center bg-brand-gradient text-[#0a0a0f] font-medium px-4 py-2 rounded-md text-sm"
					>
						Book Consultation
					</a>
				</nav>
			</div>
		</header>
	);
}
