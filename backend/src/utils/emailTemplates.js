function otpEmailTemplate({
  name = "User",
  otp,
  purpose = "verification",
  expiryMinutes = 10,
}) {
  return {
    subject: `Your ${purpose} OTP`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.4; color:#111;">
        <h2>Hello ${name},</h2>
        <p>Your <strong>${purpose}</strong> OTP is:</p>
        <p style="font-size:24px; letter-spacing:4px;"><strong>${otp}</strong></p>
        <p>This OTP will expire in ${expiryMinutes} minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr/>
        <small>Thanks,<br/>The Team</small>
      </div>
    `,
  };
}

module.exports = { otpEmailTemplate };
