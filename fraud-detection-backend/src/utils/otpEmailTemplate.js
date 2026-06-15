const otpEmailTemplate =
  (otp) => {
    return `
      <div style="
        font-family:Arial;
        background:#0f172a;
        color:white;
        padding:40px;
        border-radius:20px;
      ">

        <h1 style="
          color:#facc15;
        ">
          🔐 Transaction Verification
        </h1>

        <p>
          Your transaction
          requires OTP verification.
        </p>

        <div style="
          background:#1e293b;
          padding:30px;
          border-radius:20px;
          text-align:center;
          margin-top:20px;
        ">

          <h1 style="
            font-size:48px;
            letter-spacing:10px;
            color:#22c55e;
          ">
            ${otp}
          </h1>

        </div>

        <p style="
          margin-top:20px;
        ">
          OTP expires in
          <strong>
            5 minutes
          </strong>
        </p>

      </div>
    `;
  };

module.exports =
  otpEmailTemplate;