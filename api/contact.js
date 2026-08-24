const RESEND_API_URL = "https://api.resend.com/emails";

function clean(value, maxLength = 4000) {
  if (typeof value !== "string") return "";

  return value
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, maxLength);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendEmail({
  from,
  to,
  subject,
  html,
  replyTo
}) {
  const response = await fetch(
    RESEND_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization":
          `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo
          ? { reply_to: replyTo }
          : {})
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      "Email service failed"
    );
  }

  return data;
}

module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {

    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        "RESEND_API_KEY is not configured"
      );
    }

    if (!process.env.OWNER_EMAIL) {
      throw new Error(
        "OWNER_EMAIL is not configured"
      );
    }

    const body = req.body || {};

    const name = clean(body.name, 120);
    const email = clean(body.email, 180).toLowerCase();
    const phone = clean(body.phone, 80);
    const service = clean(body.service, 150);
    const message = clean(body.message, 4000);

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please complete the required fields."
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(
      phone || "Not provided"
    );
    const safeService = escapeHtml(
      service || "General enquiry"
    );
    const safeMessage = escapeHtml(message)
      .replace(/\n/g, "<br>");

    // =====================================
    // EMAIL TO YOU
    // =====================================

    await sendEmail({
      from:
        process.env.RESEND_FROM ||
        "Wetech <onboarding@resend.dev>",

      to:
        process.env.OWNER_EMAIL,

      replyTo:
        email,

      subject:
        `🔔 New Wetech Enquiry — ${name}`,

      html: `
        <div style="
          font-family:Arial,sans-serif;
          max-width:650px;
          margin:auto;
          background:#07101d;
          color:#f4f9ff;
          padding:30px;
          border-radius:18px;
        ">

          <h1>
            New Wetech Enquiry
          </h1>

          <p style="color:#9fb5c8;">
            A new enquiry was submitted
            from the Wetech website.
          </p>

          <hr style="
            border:none;
            border-top:1px solid #19304a;
            margin:24px 0;
          ">

          <p>
            <strong>Name:</strong>
            ${safeName}
          </p>

          <p>
            <strong>Email:</strong>
            ${safeEmail}
          </p>

          <p>
            <strong>Phone:</strong>
            ${safePhone}
          </p>

          <p>
            <strong>Service:</strong>
            ${safeService}
          </p>

          <div style="
            margin-top:22px;
            padding:18px;
            background:#0b1829;
            border-radius:12px;
          ">

            <strong>Message</strong>

            <p style="
              color:#c7d8e7;
              line-height:1.7;
            ">
              ${safeMessage}
            </p>

          </div>

          <p style="
            color:#718ba3;
            font-size:12px;
            margin-top:24px;
          ">
            Reply directly to this email
            to contact the client.
          </p>

        </div>
      `
    });

    // =====================================
    // CONFIRMATION EMAIL TO CLIENT
    // =====================================

    await sendEmail({
      from:
        process.env.RESEND_FROM ||
        "Wetech <onboarding@resend.dev>",

      to:
        email,

      subject:
        "We received your enquiry — Wetech",

      html: `
        <div style="
          font-family:Arial,sans-serif;
          max-width:650px;
          margin:auto;
          padding:30px;
          color:#17212b;
        ">

          <h1>
            Hi ${safeName},
          </h1>

          <p>
            Thank you for reaching out to Wetech.
          </p>

          <p style="line-height:1.8;">
            We've received your enquiry regarding
            <strong>${safeService}</strong>.
            Our team will review the details
            and get back to you shortly.
          </p>

          <p style="line-height:1.8;">
            We're excited to learn more about
            your project and explore how we can
            build something great together.
          </p>

          <p>
            Best regards,<br>
            <strong>Wetech</strong><br>
            Digital Studio
          </p>

        </div>
      `
    });

    return res.status(200).json({
      success: true
    });

  } catch (error) {

    console.error(
      "Contact API error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "We couldn't process your enquiry right now."
    });
  }
};
