export const Templates = {
    OTP: {
      title: "IQUEST OTP CODE RECEIVED",
      content: `
        <div style="text-align: center; padding: 20px;">
          <h2 style="color: #333;">Your OTP Code</h2>
          <p style="font-size: 16px; color: #555;">Use the following One-Time Password (OTP) to complete your login process:</p>
          <div style="font-size: 24px; color: #000; font-weight: bold; margin: 20px 0; letter-spacing : 1px;">
            <%= OTP %>
          </div>
          <p style="font-size: 14px; color: #777;">This OTP is valid for the next 10 minutes. If you did not request this, please ignore this email.</p>
          <br />
          <p style="font-size: 14px; color: #555;">Thank you,<br />Iquest Team</p>
        </div>
      `
    },
    PaymentSuccess: {
      title: "Payment Successful - Welcome to IQUEST Digital Platform",
      content: `
        <div style="text-align: center; padding: 20px;">
          <h2 style="color: #333;">Payment Successful</h2>
          <p style="font-size: 16px; color: #555;">Congratulations! Your account has been successfully registered with the IQUEST Digital platform.</p>
          <p style="font-size: 16px; color: #555;">You can now log in and start exploring our platform.</p>
          <div style="margin: 20px 0;">
            <a href="<%= loginLink %>" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none;">Login Here</a>
          </div>
          <p style="font-size: 14px; color: #555;">Thank you for choosing IQUEST. We look forward to serving you.</p>
          <br />
          <p style="font-size: 14px; color: #555;">Best regards,<br />Iquest Team</p>
        </div>
      `
    },
    ConflictLogin: {
      title: "Security Alert: Unrecognized Login Attempt",
      content: `
        <div style="text-align: center; padding: 20px;">
          <h2 style="color: #333;">Security Alert</h2>
          <p style="font-size: 16px; color: #555;">Hey <%= userName %>,</p>
          <p style="font-size: 16px; color: #555;">Someone is trying to log into your IQUEST account with this device<br /> <b style="color: #333;"><%= ua %></b>.</p>
          <p style="font-size: 16px; color: #555;">If this was you, you can safely ignore this email. Otherwise, please check your account activity immediately.</p>
          <div style="margin: 20px 0;">
            <a href="<%= accountActivityLink %>" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #ff0000; border-radius: 5px; text-decoration: none;">Check Activity</a>
          </div>
          <p style="font-size: 14px; color: #555;">Thank you,<br />Iquest Team</p>
        </div>
      `
    }
  }
  