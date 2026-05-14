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
				className="fixed bottom-3 left-5 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm shadow-lg transition-all hover:scale-[1.02] bg-brand-gradient text-[#0a0a0f] font-medium"
			>
				{BRAND.contactNum}
			</a>
			<button
				onClick={() => setOpen((v) => !v)}
				className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm shadow-lg transition-all hover:scale-[1.02] font-medium ${
					open ? 'bg-bg-surface-2 border border-subtle text-text-primary' : 'bg-brand-gradient text-[#0a0a0f]'
				}`}
			>
				{open ? "Close Chat" : "Vega AI"}
			</button>
			{open && (
				<div className="fixed bottom-20 right-5 z-50 w-[92vw] max-w-sm overflow-hidden shadow-2xl bg-bg-surface border border-subtle rounded-xl">
					<div className="flex items-center justify-between border-b border-subtle px-4 py-3 bg-bg-surface/50 backdrop-blur-md">
						<div className="text-sm font-medium text-text-primary flex items-center gap-2">
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
								className="rounded-full px-2.5 py-1 text-[11px] font-medium text-[#0a0a0f] bg-brand-gradient hover:opacity-90"
							>
								Book
							</a>
							<span className="text-xs text-text-muted">
								Online
							</span>
						</div>
					</div>
					<div className="max-h-80 space-y-3 overflow-y-auto p-4 bg-bg-page/50">
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
									className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${
										m.role === "assistant"
											? "bg-bg-surface-2 text-text-primary rounded-lg rounded-bl-sm border border-subtle"
											: "bg-accent-violet/15 text-text-primary rounded-lg rounded-br-sm"
									}`}
								>
									{m.content}
								</div>
							</div>
						))}
					</div>
					<div className="flex items-center gap-2 border-t border-subtle p-3 bg-bg-surface">
						<input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Ask about services, pricing, timelines…"
							className="flex-1 bg-bg-raised border border-subtle focus:border-accent-violet rounded-sm text-text-primary placeholder-text-muted text-sm px-3 py-2 w-full outline-none transition"
						/>
						<button
							onClick={send}
							className="bg-brand-gradient text-[#0a0a0f] font-medium px-4 py-2 rounded-md text-sm transition-opacity hover:opacity-90"
						>
							Send
						</button>
					</div>
				</div>
			)}
		</>
	);
}
