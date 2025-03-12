import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderDetails } = req.body;

    // Set up the transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or your preferred email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send the email
    await transporter.sendMail({
      from: `"Order Notification" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL, // Owner's email
      subject: '🚀 New Order Received!',
      html: `
        <h2>New Order Alert 📦</h2>
        <p>You have a new order:</p>
        <pre>${JSON.stringify(orderDetails, null, 2)}</pre>
      `,
    });

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
