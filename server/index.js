const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Create mail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  const { to_email, to_name, from_name, subject, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"${from_name}" <${process.env.SMTP_EMAIL}>`,
      to: to_email,
      subject: subject,
      html: message
    });

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});