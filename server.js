const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 

app.use(cors());
app.use(express.json());

// Zoho Mail SMTP transporter configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Zoho SMTP connection error:', error);
    } else {
        console.log('Zoho SMTP server is ready to send emails');
    }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill all required fields.' });
  }

  const mailOptions = {
    from: '"ChatFun Website" <support@chatfun.live>', // Use your Zoho email here
    to: 'support@chatfun.live',
    subject: `New Contact Form Message from ${name}`,
    replyTo: email, // User's email for reply
    text: `
You have received a new message from the ChatFun website contact form.

Name: ${name}
Email: ${email}
Message:
${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
