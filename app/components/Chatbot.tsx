'use client';
import { useState, KeyboardEvent } from "react";
import { BRAND, BOOKING } from "@/information";

interface ChatMessage {
	role: "assistant" | "user";
	content: string;
}

export default function Chatbot() {
	const [open, setOpen] = useState<boolean>(false);
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			role: "assistant",
			content:
				"I am Vega — your design intelligence. Ask about branding, websites, or AI. Want a 60-second brief?",
		},
	]);
	const [input, setInput] = useState<string>("");
	
	const push = (role: "assistant" | "user", content: string) => 
		setMessages((m) => [...m, { role, content }]);

	async function send() {
		const v = input.trim();
		if (!v) return;
		setInput("");
		push("user", v);
		setTimeout(
			() =>
				push(
					"assistant",
					"Thanks! Want to book a quick strategy call?"
				),
			300
		);
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			send();
		}
	};

	return (
		<>
			<a
				href={BRAND.phone}
				className="fixed bottom-3 left-5 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm shadow-lg transition-all hover:scale-[1.02]"
				style={{ background: 'linear-gradient(90deg, #00FFFF, #00BFFF)', color: '#000', fontWeight: 500 }}
			>
				{BRAND.contactNum}
			</a>
			<button
				onClick={() => setOpen((v) => !v)}
				className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm shadow-lg transition-all hover:scale-[1.02]"
				style={{
					background: open
						? "rgba(0,0,0,0.85)"
						: "linear-gradient(90deg,#00FFFF,#00BFFF)",
					color: open ? "white" : "black",
					border: open ? '1px solid rgba(255,255,255,0.1)' : 'none',
					fontWeight: 500,
				}}
			>
				{open ? "Close Chat" : "Vega AI"}
			</button>
			{open && (
				<div className="fixed bottom-20 right-5 z-50 w-[92vw] max-w-sm overflow-hidden rounded-2xl border border-white/10 shadow-2xl" style={{ background: 'rgba(11,11,11,0.95)', backdropFilter: 'blur(16px)' }}>
					<div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
						<div className="text-sm font-medium text-white flex items-center gap-2">
							<img
								src="/logo-vega-agent.png"
								alt="Vega"
								className="h-6 w-4 rounded-full"
							/>
							Vega — AI Design Guide
						</div>
						<div className="flex items-center gap-2">
							<a
								href={BOOKING}
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-full px-2.5 py-1 text-[11px] font-medium text-black hover:opacity-90"
								style={{ background: 'linear-gradient(90deg, #00FFFF, #00BFFF)' }}
							>
								Book
							</a>
							<span className="text-xs text-neutral-500">
								Online
							</span>
						</div>
					</div>
					<div className="max-h-80 space-y-2 overflow-y-auto p-3">
						{messages.map((m, i) => (
							<div
								key={i}
								className={`flex ${
									m.role === "assistant"
										? "justify-start"
										: "justify-end"
								}`}
							>
								<div
									className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
										m.role === "assistant"
											? "bg-white/[0.06] text-white border border-white/[0.06]"
											: "text-black"
									}`}
									style={m.role === "user" ? { background: 'linear-gradient(90deg, #00FFFF, #00BFFF)' } : {}}
								>
									{m.content}
								</div>
							</div>
						))}
					</div>
					<div className="flex items-center gap-2 border-t border-white/[0.06] p-3">
						<input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Ask about services, pricing, timelines…"
							className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
						/>
						<button
							onClick={send}
							className="rounded-xl px-3 py-2 text-sm font-semibold text-black"
							style={{
								background:
									"linear-gradient(90deg,#00FFFF,#00BFFF)",
							}}
						>
							Send
						</button>
					</div>
				</div>
			)}
		</>
	);
}
