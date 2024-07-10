import nodemailder from "nodemailer";

export async function getMailClient() {
  const account = await nodemailder.createTestAccount();

  const transporter = nodemailder.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  return transporter;
}