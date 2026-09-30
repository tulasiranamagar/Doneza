const { transporter } = require("./transporter");

async function sendVerificationEmail(to, token) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: to,
    subject: "Email Verification",
    html: `
      <h1>Click on the link to verify your email</h1>
      <a href="${process.env.FRONTEND_URL}/verify-email/${token}">
        Verify Email
      </a>
    `,
  };

  return transporter.sendMail(mailOptions);
}

async function sendResetPasswordEmail(to, token) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: "Reset Your Doneza Password",
    text: "Reset your Doneza password",
    html: `
      <h1>Reset Your Doneza Password</h1>

      <p>Click the link below to reset your password:</p>

      <a href="${process.env.FRONTEND_URL}/reset-password/${token}">
        Reset Password
      </a>

      <p>This link will expire in 15 minutes.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
};