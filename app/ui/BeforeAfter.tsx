"use client";
import { useId, useRef, useState } from "react";

interface BeforeAfterProps {
	before: string;
	after: string;
	label?: string;
}

export default function BeforeAfter({
	before,
	after,
	label,
}: BeforeAfterProps) {
	const sliderId = useId();
	const afterRef = useRef<HTMLImageElement | null>(null);
	const [pct, setPct] = useState<number>(50);

	return (
		<div className="rounded-2xl border border-white/10 bg-white/5 p-4 my-6">
			<div className="mb-3 text-sm text-neutral-300">
				{label || "Before / After"}
			</div>
			<div className="relative h-64 w-full overflow-hidden rounded-xl">
				<img
					src={before}
					alt="before"
					className="absolute inset-0 h-full w-full object-cover"
				/>
				<img
					ref={afterRef}
					src={after}
					alt="after"
					className="absolute inset-0 h-full w-full object-cover"
					style={{ clipPath: `inset(0 0 0 ${pct}%)` }}
				/>
				<label htmlFor={sliderId} className="sr-only">
					Reveal
				</label>
				<input
					id={sliderId}
					type="range"
					min={0}
					max={100}
					value={pct}
					onChange={(e) => setPct(parseInt(e.target.value, 10))}
					className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 w-[60%]"
				/>
			</div>
		</div>
	);
}
