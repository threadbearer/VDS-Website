import { PROJECTS, BRAND } from "@/information";
export default function sitemap() {
  const base = `https://${BRAND.domain}`;
  const now = new Date();
	return [
    { url: `${base}/`, lastModified: now },
    { url: `${base}/work`, lastModified: now },
    { url: `${base}/services`, lastModified: now },
    { url: `${base}/about`, lastModified: now },
    { url: `${base}/contact`, lastModified: now },
    ...PROJECTS.map(p => ({ url: `${base}/work/${p.slug}`, lastModified: now })),
  ];
}