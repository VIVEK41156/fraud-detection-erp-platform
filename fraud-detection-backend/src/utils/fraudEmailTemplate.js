const fraudEmailTemplate =
  ({
    merchantName,
    amount,
    location,
    riskScore,
    ipAddress,
  }) => {
    return `
    <div style="
      font-family: Arial;
      background:#0f172a;
      color:white;
      padding:40px;
      border-radius:20px;
    ">

      <h1 style="
        color:#ef4444;
      ">
        🚨 Fraud Alert Detected
      </h1>

      <p>
        A suspicious transaction
        was detected.
      </p>

      <div style="
        background:#1e293b;
        padding:25px;
        border-radius:20px;
        margin-top:20px;
      ">

        <h2>
          Transaction Details
        </h2>

        <p>
          <strong>Merchant:</strong>
          ${merchantName}
        </p>

        <p>
          <strong>Amount:</strong>
          ₹${amount}
        </p>

        <p>
          <strong>Location:</strong>
          ${location}
        </p>

        <p>
          <strong>Risk Score:</strong>
          ${riskScore}
        </p>

        <p>
          <strong>IP Address:</strong>
          ${ipAddress}
        </p>

      </div>

      <div style="
        margin-top:30px;
      ">

        <a
          href="#"
          style="
            background:#22c55e;
            color:white;
            padding:14px 28px;
            border-radius:12px;
            text-decoration:none;
            margin-right:15px;
          "
        >
          Approve
        </a>

        <a
          href="#"
          style="
            background:#ef4444;
            color:white;
            padding:14px 28px;
            border-radius:12px;
            text-decoration:none;
          "
        >
          Block
        </a>

      </div>

    </div>
    `;
  };

module.exports =
  fraudEmailTemplate;