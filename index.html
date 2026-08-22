const RESEND_API_URL = "https://api.resend.com/emails";

function clean(value, maxLength = 3000) {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, maxLength);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendEmail({
  from,
  to,
  subject,
  html,
  replyTo
}) {
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {})
    })
  });

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

async function sendWhatsApp({
  name,
  email,
  phone,
  message
}) {
  const {
    WHATSAPP_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID,
    WHATSAPP_TO,
    WHATSAPP_TEMPLATE_NAME,
    WHATSAPP_TEMPLATE_LANGUAGE
  } = process.env;

  // WhatsApp is optional until these variables are configured.
  if (
    !WHATSAPP_TOKEN ||
    !WHATSAPP_PHONE_NUMBER_ID ||
    !WHATSAPP_TO ||
    !WHATSAPP_TEMPLATE_NAME
  ) {
    return {
      skipped: true
    };
  }

  const url =
    `https://graph.facebook.com/vXX.X/` +
    `${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to: WHATSAPP_TO,
    type: "template",
    template: {
      name: WHATSAPP_TEMPLATE_NAME,
      language: {
        code:
          WHATSAPP_TEMPLATE_LANGUAGE ||
          "en_US"
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: name || "Not provided"
            },
            {
              type: "text",
              text: email || "Not provided"
            },
            {
              type: "text",
              text: phone || "Not provided"
            },
            {
              type: "text",
              text: message || "No message"
            }
          ]
        }
      ]
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization:
        `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type":
        "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
      "WhatsApp API failed"
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

    const name =
      clean(body.name, 120);

    const email =
      clean(body.email, 180).toLowerCase();

    const phone =
      clean(body.phone, 60);

    const message =
      clean(body.message, 4000);

    const service =
      clean(body.service, 120);

    // Honeypot anti-spam field
    const website =
      clean(body.website, 100);

    if (website) {
      return res.status(200).json({
        success: true
      });
    }

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and message are required."
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address."
      });
    }

    const safeName =
      escapeHtml(name);

    const safeEmail =
      escapeHtml(email);

    const safePhone =
      escapeHtml(phone || "Not provided");

    const safeService =
      escapeHtml(
        service || "General enquiry"
      );

    const safeMessage =
      escapeHtml(message)
        .replace(/\n/g, "<br>");

    /* -----------------------------------------
       1. Email to Wetech
    ----------------------------------------- */

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
          background:#080a0c;
          color:#f4f7f8;
          padding:30px;
          border-radius:16px;
        ">

          <h1 style="
            margin:0 0 6px;
            font-size:24px;
          ">
            New Wetech Enquiry
          </h1>

          <p style="
            color:#9ba5ab;
            margin-top:0;
          ">
            A new enquiry has been submitted
            from the Wetech website.
          </p>

          <hr style="
            border:none;
            border-top:1px solid #22282d;
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
            margin-top:20px;
            padding:18px;
            background:#101418;
            border-radius:12px;
            color:#c9d0d5;
          ">
            <strong>Message</strong>

            <p style="
              line-height:1.7;
              margin-bottom:0;
            ">
              ${safeMessage}
            </p>
          </div>

          <p style="
            margin-top:25px;
            color:#7d888f;
            font-size:12px;
          ">
            Reply directly to this email to contact the client.
          </p>

        </div>
      `
    });

    /* -----------------------------------------
       2. Confirmation email to client
    ----------------------------------------- */

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
          color:#222;
          padding:30px;
        ">

          <h1 style="
            margin-bottom:8px;
          ">
            Hi ${safeName},
          </h1>

          <p>
            Thank you for reaching out to Wetech.
          </p>

          <p style="
            line-height:1.7;
          ">
            We've received your enquiry regarding
            <strong>${safeService}</strong>
            and our team will review the details
            and get back to you shortly.
          </p>

          <p style="
            line-height:1.7;
          ">
            We're excited to learn more about your
            project and explore how we can build
            something great together.
          </p>

          <br>

          <p>
            Best regards,<br>
            <strong>Wetech</strong><br>
            Digital Studio<br>
            WhatsApp: +91 8445209063
          </p>

        </div>
      `
    });

    /* -----------------------------------------
       3. WhatsApp notification
    ----------------------------------------- */

    let whatsappStatus = "not_configured";

    try {

      const whatsapp =
        await sendWhatsApp({
          name,
          email,
          phone,
          message
        });

      whatsappStatus =
        whatsapp?.skipped
          ? "not_configured"
          : "sent";

    } catch (whatsappError) {

      console.error(
        "WhatsApp notification error:",
        whatsappError
      );

      whatsappStatus =
        "failed";

    }


    return res.status(200).json({
      success: true,
      whatsapp: whatsappStatus
    });

  } catch (error) {

    console.error(
      "Contact API error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "We couldn't process your enquiry right now. Please try again."
    });
  }
};
