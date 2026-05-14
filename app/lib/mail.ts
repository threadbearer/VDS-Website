import { Resend } from "resend";
import nodemailer from "nodemailer";

export interface SendMailParams {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export async function sendMail({ to, subject, html, text, replyTo }: SendMailParams): Promise<boolean> {
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
    } catch (e) { 
      console.error("Resend failed, falling back to SMTP", e);
    }
  }
  
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS)) {
    console.warn("Email provider not configured. Cannot send mail.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  await transporter.sendMail({ 
    from: `Vega Leads <${SMTP_USER}>`, 
    to: Array.isArray(to) ? to.join(",") : to, 
    subject, 
    html, 
    text, 
    ...(replyTo ? { replyTo } : {}) 
  });
  
  return true;
}

export interface NotifyLeadParams {
  name: string;
  phone: string;
  issue: string;
  source: string;
}

export async function notifyAgencyOfLead({ name, phone, issue, source }: NotifyLeadParams) {
  const studioEmail = process.env.STUDIO_EMAIL;
  const assistantEmail = "jlegorreta@vegadesign.studio";

  const summary = `New Vega lead Qualified by AI
———————
Name: ${name}
Phone: ${phone}
Issue: ${issue}
Source: ${source}
When: ${new Date().toLocaleString()}`;

  const recipients = [studioEmail, assistantEmail].filter((email): email is string => Boolean(email));
  
  if (recipients.length > 0) {
    await sendMail({
      to: recipients,
      subject: `🚨 Hot Lead Alert: ${name} [${source}]`,
      html: `<div style="font-family:sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0f172a;">New AI Qualified Lead!</h2>
        <p>An inbound lead has been qualified by the AI assistant.</p>
        <hr style="border-top: 1px solid #eee;" />
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Bottleneck/Issue:</b> ${issue}</p>
        <p><b>Source:</b> ${source}</p>
        <br/>
        <p style="font-size: 12px; color: #64748b;">Automated by Vega Technology Partners</p>
      </div>`,
      text: summary
    });
  }
}
