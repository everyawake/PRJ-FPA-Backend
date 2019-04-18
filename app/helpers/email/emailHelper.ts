import sgMail from "@sendgrid/mail";

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("Should set Sendgrid API key!!");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendUserConfirmationEmail = async (to: string) => {
  const msg = {
    to,
    from: "no-reply@fpa.org",
    subject: "Welcome to FPA!, plz confirm your email!!",
    html: "<h2>Welcome to Hello world!!</h2>",
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    console.error("[ERR] FAILED to MAIL SEND", err);
  }
};

export { sendUserConfirmationEmail };
