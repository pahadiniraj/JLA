import EmailVerification from "../../lib/modals/emailVerification";
import transporter from "./emailConfig";

interface User {
  id: string;
  email: string;
  fullname: string;
}

export const GenerateOtpAndSendMail = async (user: User): Promise<number> => {
  const otp = Math.floor(1000 + Math.random() * 9000); // Corrected OTP generation

  await EmailVerification.create({
    userId: user.id,
    otp: otp,
  });

  const otpLink = `${process.env.FRONTEND_HOST}/verify-email`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Verify your email",
    html: `
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        color: #fff;
      }
      .container {
        width: 90%;
        max-width: 600px;
        margin: 20px auto;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
        padding: 20px;
        text-align: left;
        border-left: 6px solid #00c6ff;
      }
      h1 {
        color: #00c6ff;
        font-size: 24px;
        margin-bottom: 15px;
        font-weight: bold;
      }
      p {
        font-size: 15px;
        color: #e0e0e0;
        line-height: 1.5;
        margin-bottom: 15px;
      }
      .otp-code {
        font-size: 20px;
        font-weight: bold;
        color: #fff;
        background: #1a1a1a;
        padding: 10px;
        border-radius: 4px;
        margin: 15px 0;
        display: inline-block;
      }
      .button {
        color: #ffffff;
        text-decoration: none;
        background: linear-gradient(90deg, #00c6ff, #0072ff);
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: bold;
        font-size: 15px;
        display: inline-block;
        margin-top: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        transition: background 0.3s, transform 0.3s;
      }
      .button:hover {
        background: linear-gradient(90deg, #0072ff, #00c6ff);
        transform: scale(1.05);
      }
      .footer {
        margin-top: 20px;
        font-size: 13px;
        color: #b0b0b0;
      }
      .footer a {
        color: #00c6ff;
        text-decoration: none;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <table
      width="100%"
      border="0"
      cellspacing="0"
      cellpadding="0"
      bgcolor="#000"
    >
      <tr>
        <td
          background="https://static.vecteezy.com/system/resources/previews/006/430/145/non_2x/technology-background-concept-circuit-board-electronic-system-futuristic-hi-tech-light-on-dark-blue-free-vector.jpg"
          bgcolor="#000"
          style="
            background-size: cover;
            background-position: center center;
            padding: 20px;
          "
        >
          <div class="container" style="background: rgba(0, 0, 0, 0.7)">
            <h1>Hello ${user.fullname},</h1>
            <p>Welcome aboard! I'm Niraj and i hope you are doing wonderful.</p>
            <p>To complete your registration, please use the following code:</p>
            <div class="otp-code">${otp}</div>
            <p>
              <strong
                >🔗 Copy the OTP above, then click the button below to go to my
                website and paste it to finish your registration.</strong
              >
            </p>
            <a href="${otpLink}" class="button"
              >🔐 Complete Registration</a
            >
            <p>
              If you have any questions or need assistance, feel free to
              <a href="mailto:sharma12345niraj@gmail.com">contact me</a>.
            </p>
            <div class="footer">
              
              <p>
                <a href="${process.env.FRONTEND_HOST}">Explore my website</a> |
                <a href="mailto:sharma12345niraj@gmail.com">Contact me</a>
              </p>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
  });

  return otp;
};

export default GenerateOtpAndSendMail;
