const nodemailer = require(
  "nodemailer"
);

const sendFraudEmail =
  async ({
    email,
    name,
    amount,
    merchantName,
    location,
    riskScore,
  }) => {
    try {
      const transporter =
        nodemailer.createTransport(
          {
            service: "gmail",
            auth: {
              user:
                process.env
                  .EMAIL_USER,

              pass:
                process.env
                  .EMAIL_PASS,
            },
          }
        );

      const mailOptions = {
        from:
          process.env.EMAIL_USER,

        to: email,

        subject:
          "⚠ Fraud Alert Detected",

        html: `
          <h2>
            Fraud Alert
          </h2>

          <p>
            Hi ${name},
          </p>

          <p>
            We detected a suspicious transaction.
          </p>

          <ul>
            <li>
              Amount:
              ₹${amount}
            </li>

            <li>
              Merchant:
              ${merchantName}
            </li>

            <li>
              Location:
              ${location}
            </li>

            <li>
              Risk Score:
              ${riskScore}
            </li>
          </ul>

          <p>
            If this wasn't you,
            please take action immediately.
          </p>
        `,
      };

      await transporter.sendMail(
        mailOptions
      );

      console.log(
        "✅ Fraud Email Sent"
      );
    } catch (error) {
      console.log(
        "Email Error:",
        error.message
      );
    }
  };

module.exports = {
  sendFraudEmail,
};