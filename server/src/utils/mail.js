import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'PMS',
      link: 'https://pms.com',
    },
  });
  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host : process.env.MAILTRAP_SMTP_HOST,
    port : process.env.MAILTRAP_SMTP_PORT,
    auth : {
      user : process.env.MAILTRAP_SMTP_USER,
      pass : process.env.MAILTRAP_SMTP_PASS
    }
  })

  const mail = {
    from : "mail.pms@example.com",
    to : options.email,
    subject : options.subject,
    text : emailTextual,
    html : emailHtml
  }
  try {
    await transporter.sendMail(mail)
  } catch (error) {
    console.error("Email sending error or Check for the env file");
    console.log(error);
  }
};

const emailVerificationMail = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      Intro: "Welcome to PMS We\'re very excited to have you on board.",
      action: {
        intstructions: 'TO verify your email please click on the following button',
        button: {
          color: '#22BC66',
          text: 'Verify your email',
        },
        link: verificationUrl,
      },
      outro: "Need help, or have questions? Just reply to this email, we\'d love to help",
    },
  };
};

const forgotPasswordMail = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      Intro: 'We got a request to reset a pasword of your account',
      action: {
        intstructions: 'TO reset password please click on the following button',
        button: {
          color: '#ff1100ff',
          text: 'Verify your email',
        },
        link: passwordResetUrl,
      },
      outro: "Need help, or have questions? Just reply to this email, we\'d love to help",
    },
  };
};

export { emailVerificationMail, forgotPasswordMail, sendEmail};
