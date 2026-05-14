export interface Brand {
	name: string;
	domain: string;
	city: string;
	phone: string;
	contactNum: string;
	email: string;
	github: string;
	gold: string;
	dark: string;
	mid: string;
}

export interface Project {
	slug: string;
	title: string;
	tag: string;
	img: string;
	hero: string;
	blurb: string;
	overview: string;
	challenge: string;
	solution: string;
	impact: string[];
	services: string[];
	tech: string[];
	liveUrl: string;
	repoUrl: string;
	process: string[];
	gallery: string[];
}

export const BOOKING: string = "https://calendar.app.google/MCoM4jfg2dWgypC47";

export const BRAND: Brand = {
	name: "VegaDesign.Studio",
	domain: "vegadesign.studio",
	city: "Los Angeles",
	phone: "tel:+16614771610",
	contactNum: "(661) 477-1610",
	email: "jlegorreta@vegadesign.studio",
	github: "https://github.com/threadbearer",
	gold: "#C6A664",
	dark: "#0B0B0B",
	mid: "#1A1A1A",
};

export const PROJECTS: Project[] = [
	{
		slug: "adelphos-manila",
		title: "Adelphos Manila — Premium Web Storefront",
		tag: "E-Commerce • Vanilla JS • Serverless",
		img: "/project-adelphos-manila.png",
		hero: "/project-adelphos-manila.png",
		blurb:
			"A zero-dependency luxury storefront for Masonic fraternity apparel — featuring real-time cart sync, glassmorphic UI, and a serverless Google Apps Script backend.",
		overview:
			"Built a high-fidelity e-commerce experience without frameworks — pure HTML5, CSS3 Custom Properties, and Vanilla ES6+ JavaScript with a Google Apps Script backend for secure order processing.",
		challenge:
			"Create a premium brand storefront with complex cart interactions, membership verification, and client-side file processing — all without heavy frameworks or database hosting costs.",
		solution:
			"Engineered a unified state-sync engine that coordinates a slide-out cart drawer, inline checkout grid, and per-item customizer simultaneously. Integrated Base64 document encoding for serverless file uploads via Google Sheets.",
		impact: [
			"Combined JS/CSS weight under 60KB — fraction of typical SPA bundle",
			"Dual-layer real-time cart synchronization across all UI surfaces",
			"Serverless architecture eliminated database hosting costs entirely",
		],
		services: ["Web Development", "E-Commerce", "UI/UX Design"],
		tech: ["HTML5", "CSS3", "Vanilla JS", "Google Apps Script"],
		liveUrl: "https://threadbearer.github.io/AdelphosManila/",
		repoUrl: "https://github.com/threadbearer/AdelphosManila",
		process: [
			"Brand Visual Identity & Color System",
			"Product Catalog & State Architecture",
			"Cart Sync Engine & Checkout Flow",
			"Serverless Backend Integration",
			"Form Validation & File Processing",
		],
		gallery: [],
	},
	{
		slug: "mp-water",
		title: "Montalvo's Pure Water — Website Redesign",
		tag: "Redesign • SEO • Performance",
		img: "/project-mp-water.png",
		hero: "/project-mp-water.png",
		blurb:
			"A ground-up redesign for a family-owned water store — replacing bloated Webflow output with a hand-coded solution that achieved 91% code reduction and production-grade SEO.",
		overview:
			"Replaced the entire front end of a Webflow-generated site with a custom, zero-dependency build. From 580KB of bloated export code down to 47KB — with significantly more functionality, better SEO, and modern performance.",
		challenge:
			"The original Webflow-exported site was bloated (580KB), visually dated, and lacking SEO. The business needed better local search visibility across two retail locations in Palmdale and Lancaster, CA.",
		solution:
			"Hand-coded everything from scratch: dynamic product catalog with category filtering, glassmorphic design system, dual JSON-LD LocalBusiness schemas, WebP image pipeline, and scroll-triggered animations — all in native JS.",
		impact: [
			"91% code reduction — 580KB → 47KB of source code",
			"Dual LocalBusiness JSON-LD for two store locations",
			"WebP image pipeline with lazy loading and hero preload",
		],
		services: ["Web Development", "SEO", "Performance"],
		tech: ["HTML5", "CSS3", "Vanilla JS", "JSON-LD"],
		liveUrl: "https://threadbearer.github.io/MPWater/",
		repoUrl: "https://github.com/threadbearer/MPWater",
		process: [
			"Legacy Site Audit & Performance Baseline",
			"Design System & CSS Custom Properties",
			"Dynamic Product Catalog Engine",
			"SEO Implementation & Structured Data",
			"Image Optimization Pipeline",
			"Deployment to Production",
		],
		gallery: [],
	},
	{
		slug: "jsp-construction",
		title: "JSP Construction — Contractor Website",
		tag: "Multi-Page • CSS Architecture • Accessibility",
		img: "/project-jsp-construction.png",
		hero: "/project-jsp-construction.png",
		blurb:
			"A production website for a licensed LA general contractor — featuring modular CSS design tokens, IntersectionObserver scroll reveals, and WCAG-accessible markup. All under 115KB.",
		overview:
			"Designed and built a multi-page business website implementing an 'Elevated Professional Trust' design language with a 5-file modular CSS architecture, fluid typography via clamp(), and comprehensive SEO.",
		challenge:
			"Build a professional web presence for a licensed contractor (CSLB #1094925) that converts visitors into consultation requests while achieving strong organic search performance in the competitive LA market.",
		solution:
			"Created a 5-file CSS architecture (variables → base → layout → components → pages) with 119 design tokens. Built performant scroll animations via IntersectionObserver, client-side form validation with Formspree, and full WCAG accessibility.",
		impact: [
			"Entire site under 115KB — zero framework overhead",
			"5-file modular CSS system with 119 design tokens",
			"Full SEO: canonical URLs, Open Graph, XML sitemap, heading hierarchy",
		],
		services: ["Web Development", "UI/UX Design", "SEO"],
		tech: ["HTML5", "CSS3", "Vanilla JS", "Formspree", "GCP"],
		liveUrl: "https://threadbearer.github.io/JSPConstruction/",
		repoUrl: "https://github.com/threadbearer/JSPConstruction",
		process: [
			"Brand Identity & Design Token System",
			"Modular CSS Architecture",
			"Multi-Page Layout & Navigation",
			"Form Validation & Submission",
			"SEO & Accessibility Audit",
			"GCP Deployment",
		],
		gallery: [],
	},
	{
		slug: "gr-counseling",
		title: "GR Counseling — Health Services Platform",
		tag: "Next.js • SCSS • GCP",
		img: "/project-gr-counseling.png",
		hero: "/project-gr-counseling.png",
		blurb:
			"A health services web application migrated to Next.js — featuring a warm minimalist luxury design system, 15+ pages, and contact form integration for a counseling practice.",
		overview:
			"Migrated a counseling practice's web presence to a modern Next.js architecture with a cohesive 'Warm Minimalist Luxury' design system spanning 15+ pages, complete with appointment booking, service pages, and resource sections.",
		challenge:
			"Transform a fragmented, dated counseling website into a cohesive, professional platform that inspires trust and warmth while meeting the unique needs of a healthcare provider.",
		solution:
			"Built a Next.js application with SCSS modules, a comprehensive design system (typography, palette, spacing tokens), responsive layouts across 15+ pages, and server-side rendering for SEO performance.",
		impact: [
			"15+ responsive pages with cohesive design system",
			"Server-side rendering for healthcare SEO",
			"Modern appointment booking integration",
		],
		services: ["Web Development", "UI/UX Design"],
		tech: ["Next.js", "React", "SCSS", "Google Cloud"],
		liveUrl: "https://threadbearer.github.io/GRCounseling/",
		repoUrl: "https://github.com/threadbearer/GRCounseling",
		process: [
			"Discovery & Client Requirements",
			"Design System Creation",
			"Component Architecture",
			"Page Implementation (15+ pages)",
			"Form Integration & Testing",
			"GCP Deployment",
		],
		gallery: [],
	},
];
