export default function CaseSummary({
	tag,
	blurb,
	impact = [],
	services = [],
}) {
	return (
		<section className="rounded-2xl border border-white/10 bg-white/5 p-6">
			<div className="text-xs uppercase tracking-wide text-neutral-400">
				{tag || "Case Study"}
			</div>
			{blurb && <p className="mt-2 text-neutral-200">{blurb}</p>}

			<div className="mt-4 grid gap-4 sm:grid-cols-2">
				{services?.length > 0 && (
					<div>
						<h4 className="text-sm font-semibold">
							What we delivered
						</h4>
						<ul className="mt-2 list-disc pl-5 text-sm text-neutral-300">
							{services.slice(0, 5).map((s, i) => (
								<li key={i}>{s}</li>
							))}
						</ul>
					</div>
				)}
				{impact?.length > 0 && (
					<div>
						<h4 className="text-sm font-semibold">Results</h4>
						<ul className="mt-2 list-disc pl-5 text-sm text-neutral-300">
							{impact.slice(0, 5).map((s, i) => (
								<li key={i}>{s}</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</section>
	);
}
