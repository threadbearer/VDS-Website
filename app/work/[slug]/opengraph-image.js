import { ImageResponse } from "next/og";
import { PROJECTS } from "@/information";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
	const p = PROJECTS.find((x) => x.slug === params.slug);
	const title = p?.title ?? "Vega Design Studio";
	const tag = p?.tag ?? "Design • Web • AI";
	return new ImageResponse(
		(
			<div
				style={{
					width: 1200,
					height: 630,
					display: "flex",
					flexDirection: "column",
					justifyContent: "flex-end",
					padding: 48,
					color: "white",
					background: "linear-gradient(160deg,#030303,#0a0f14)",
				}}
			>
				<div style={{ fontSize: 20, opacity: 0.7, marginBottom: 8 }}>
					{tag}
				</div>
				<div style={{ fontSize: 56, fontWeight: 800 }}>{title}</div>
				<div style={{ marginTop: 16, fontSize: 18, opacity: 0.7 }}>
					Vega Design Studio
				</div>
			</div>
		),
		size
	);
}
