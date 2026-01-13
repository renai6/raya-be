import nodemailer from 'nodemailer';

export const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ALERT_EMAIL, // raffibucog@gmail.com
    pass: process.env.ALERT_EMAIL_PASSWORD, // app password
  },
  tls: {
    rejectUnauthorized: false,
  },
});
