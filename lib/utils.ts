import { mailer } from './mailer';

export async function logger(user: any) {
  try {
    console.log('sending');
    await mailer.sendMail({
      from: `"Raya Logger" <${process.env.ALERT_EMAIL}>`,
      to: 'info.skerylayf+1@gmail.com',
      subject: '🔐 User Login Detected',
      text: `
        A user has logged in.

        User ID: ${user.id}
        Email: ${user.email}
        Role: ${user.role}
        Time: ${new Date().toISOString()}
      `,
    });
  } catch (err) {
    console.error('Login email alert failed:', err);
  }
}
