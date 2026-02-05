// @/lib/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendOTPEmail(
  email: string,
  otp: string,
  username: string,
) {
  const mailOptions = {
    from: `"ReCook" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email - OTP Code",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - ReCook</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #EEEEEE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #EEEEEE; padding: 40px 0;">
          <tr>
            <td align="center">
              <!-- Main Container -->
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                
                <!-- Header with Brand Color -->
                <tr>
                  <td style="background: linear-gradient(135deg, #8BD65E 0%, #6FB84A 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                      🍽️ ReCook
                    </h1>
                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                      Your Personalized Recipe Assistant
                    </p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 16px 0; color: #333333; font-size: 24px; font-weight: 600;">
                      Welcome, ${username}! 👋
                    </h2>
                    <p style="margin: 0 0 24px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                      Thank you for joining ReCook! To get started, please verify your email address using the OTP code below:
                    </p>
                    
                    <!-- OTP Box -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <div style="background: linear-gradient(135deg, #8BD65E 0%, #6FB84A 100%); border-radius: 12px; padding: 30px; display: inline-block; box-shadow: 0 4px 12px rgba(139, 214, 94, 0.3);">
                            <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                              Your OTP Code
                            </p>
                            <div style="background-color: #ffffff; border-radius: 8px; padding: 16px 32px; margin: 0;">
                              <span style="color: #8BD65E; font-size: 40px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                ${otp}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Timer Info -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 24px 0;">
                          <div style="background-color: #FFF8E1; border-left: 4px solid #FFC107; padding: 16px 20px; border-radius: 8px; text-align: left;">
                            <p style="margin: 0; color: #F57C00; font-size: 14px; line-height: 1.5;">
                              ⏰ <strong>Important:</strong> This code will expire in <strong>10 minutes</strong>. Please verify your email soon!
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 0; color: #777777; font-size: 14px; line-height: 1.6;">
                      If you didn't create an account with ReCook, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #F9F9F9; padding: 30px; text-align: center; border-top: 1px solid #E0E0E0;">
                    <p style="margin: 0 0 8px 0; color: #999999; font-size: 12px;">
                      This is an automated message, please do not reply to this email.
                    </p>
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      © ${new Date().getFullYear()} ReCook. All rights reserved.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetOtp: string,
  username: string,
) {
  const mailOptions = {
    from: `"ReCook" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password - ReCook",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - ReCook</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #EEEEEE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #EEEEEE; padding: 40px 0;">
          <tr>
            <td align="center">
              <!-- Main Container -->
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                
                <!-- Header with Brand Color -->
                <tr>
                  <td style="background: linear-gradient(135deg, #8BD65E 0%, #6FB84A 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                      🍽️ ReCook
                    </h1>
                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                      Your Personalized Recipe Assistant
                    </p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 16px 0; color: #333333; font-size: 24px; font-weight: 600;">
                      Reset Your Password 🔐
                    </h2>
                    <p style="margin: 0 0 8px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                      Hello <strong>${username}</strong>,
                    </p>
                    <p style="margin: 0 0 24px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                      We received a request to reset your password. Please use the following OTP code to reset your password:
                    </p>
                    
                    <!-- OTP Box -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <div style="background: linear-gradient(135deg, #8BD65E 0%, #6FB84A 100%); border-radius: 12px; padding: 30px; display: inline-block; box-shadow: 0 4px 12px rgba(139, 214, 94, 0.3);">
                            <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                              Password Reset OTP
                            </p>
                            <div style="background-color: #ffffff; border-radius: 8px; padding: 16px 32px; margin: 0;">
                              <span style="color: #8BD65E; font-size: 40px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                ${resetOtp}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Timer Info -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 24px 0;">
                          <div style="background-color: #FFF8E1; border-left: 4px solid #FFC107; padding: 16px 20px; border-radius: 8px; text-align: left;">
                            <p style="margin: 0; color: #F57C00; font-size: 14px; line-height: 1.5;">
                              ⏰ <strong>Important:</strong> This OTP will expire in <strong>10 minutes</strong>. Please reset your password soon!
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 24px 0 0 0; color: #777777; font-size: 14px; line-height: 1.6;">
                      If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #F9F9F9; padding: 30px; text-align: center; border-top: 1px solid #E0E0E0;">
                    <p style="margin: 0 0 8px 0; color: #999999; font-size: 12px;">
                      This is an automated message, please do not reply to this email.
                    </p>
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      © ${new Date().getFullYear()} ReCook. All rights reserved.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
}
