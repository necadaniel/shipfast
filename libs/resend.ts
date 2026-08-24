import { Resend } from "resend";
import config from "@/config";

let cachedResend: Resend | null = null;

const getResend = (): Resend => {
  if (cachedResend) return cachedResend;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is missing. Add it to .env.local — see .env.example."
    );
  }

  cachedResend = new Resend(apiKey);
  return cachedResend;
};

/**
 * Sends a transactional email.
 * The `from` domain must be verified in your Resend dashboard.
 */
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string | string[];
}) => {
  const { data, error } = await getResend().emails.send({
    from: config.resend.fromAdmin,
    to,
    subject,
    text,
    html,
    ...(replyTo && { replyTo }),
  });

  if (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }

  return data;
};
