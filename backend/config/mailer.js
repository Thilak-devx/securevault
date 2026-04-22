import nodemailer from "nodemailer";

export function createMailerTransport() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error("Missing EMAIL_USER or EMAIL_PASS environment variable.");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
}

export async function sendPasswordResetEmail({ to, resetLink }) {
  const transporter = createMailerTransport();
  const emailUser = process.env.EMAIL_USER;

  await transporter.verify();

  await transporter.sendMail({
    from: emailUser,
    to,
    subject: "Reset your Secure Notes password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>Reset your password</h2>
        <p>We received a request to reset your Secure Notes password.</p>
        <p>Click the button below to choose a new password. This link expires in 1 hour.</p>
        <p>
          <a
            href="${resetLink}"
            style="display:inline-block;padding:12px 20px;border-radius:12px;background:#facc15;color:#111827;text-decoration:none;font-weight:600;"
          >
            Reset Password
          </a>
        </p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}
