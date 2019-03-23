import nodemailer from "nodemailer";

const sendUserConfirmationEmail = (to: string) => {
  const smtpTransport = nodemailer.createTransport({
    host: "fpa.org",
    auth: {
      user: "no-reply@fpa.org",
      pass: "123123123",
    },
  });

  const mailOptions = {
    from: "no-reply@fpa.org",
    to,
    subject: "Welcome to FPA!, plz confirm your email!!",
    html: "<h2>Welcome to Hello world!!</h2>",
  };

  smtpTransport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email send: ", info.response);
    }
  });
};

export { sendUserConfirmationEmail };
