export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
export function getOTPHTML(otp) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f6fb;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f4f6fb; padding: 24px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background: #ffffff; border-radius: 12px; border: 1px solid #e0e0e0; overflow: hidden;">
            <tr>
              <td style="padding: 32px 40px; font-family: Arial, sans-serif; color: #333;">
                <h1 style="margin: 0 0 16px; font-size: 24px; color: #1a73e8;">Your verification code</h1>
                <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5;">Use the code below to complete your login or account verification:</p>
                <div style="text-align: center; margin: 0 0 24px;">
                  <span style="display: inline-block; padding: 18px 26px; font-size: 28px; letter-spacing: 4px; background: #f5f8ff; color: #0d1f44; border-radius: 10px; font-weight: 700;">${otp}</span>
                </div>
                <p style="margin: 0 0 16px; font-size: 14px; color: #555;">This code expires shortly. Do not share it with anyone.</p>
                <p style="margin: 0; font-size: 14px; color: #777;">If you did not request this verification code, please ignore this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
