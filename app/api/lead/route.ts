import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

interface LeadPayload {
  email: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  source?: string;
  timestamp?: string;
}

interface SendMailParams {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

function textSummary({ email, projectType, budget, timeline, source, timestamp }: LeadPayload): string {
  return `New Vega lead
————————
Email: ${email}
Project: ${projectType || "—"}
Budget: ${budget || "—"}
Timeline: ${timeline || "—"}
Source: ${source || "chat-qualifier"}
When: ${timestamp || new Date().toISOString()}`;
}

async function sendMail({ to, subject, html, text, replyTo }: SendMailParams): Promise<boolean> {
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Vega Leads <noreply@vegadesign.studio>",
        to: Array.isArray(to) ? to : [to],
        subject, 
        html, 
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      });
      return true;
    } catch (e) { /* fall through */ }
  }
  
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS)) {
    throw new Error("Email provider not configured");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  await transporter.sendMail({ 
    from: `Vega Leads <${SMTP_USER}>`, 
    to, 
    subject, 
    html, 
    text, 
    ...(replyTo ? { replyTo } : {}) 
  });
  
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as LeadPayload;
    const { email, projectType, budget, timeline, source = "chat-qualifier", timestamp } = body || {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    const studioEmail = process.env.STUDIO_EMAIL;
    const assistantEmail = "jlegorreta@vegadesign.studio";
    const booking = process.env.BOOKING_LINK || "https://calendar.app.google/MCoM4jfg2dWgypC47";

    const summary = textSummary({ email, projectType, budget, timeline, source, timestamp });

    // Notify studio + assistant
    if (studioEmail || assistantEmail) {
      const recipients = [studioEmail, assistantEmail].filter((email): email is string => Boolean(email));
      await sendMail({
        to: recipients,
        subject: "New lead from Vega site",
        html: `<pre style="font-family:monospace">${summary}</pre>`,
        text: summary,
        replyTo: email
      });
    }

    // Auto-replies to lead
    await sendMail({
      to: email,
      subject: "Thanks — we received your brief",
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2>Great to meet you!</h2>
        <p><b>Your details</b><br/>Project: ${projectType || "—"}<br/>Budget: ${budget || "—"}<br/>Timeline: ${timeline || "—"}</p>
        <p>— Vega Design Studio</p></div>`,
      text: `Thanks for the brief. Project: ${projectType || "—"}, Budget: ${budget || "—"}, Timeline: ${timeline || "—"}.`
    });

    await sendMail({
      to: email,
      subject: "Grab a slot — quick strategy call",
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2>Next step: 10‑minute consult</h2>
        <p>Pick a time that works for you — we’ll outline a plan with clear pricing.</p>
        <p><a href="${booking}" style="background:#00FFFF;color:#000;padding:12px 20px;border-radius:6px;font-weight:700;text-decoration:none;display:inline-block">📅 Book a Private Consultation</a></p>
        <p>— Vega Design Studio</p></div>`,
      text: `Book a quick strategy call: ${booking}`
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Email send failed" }, { status: 500 });
  }
}
