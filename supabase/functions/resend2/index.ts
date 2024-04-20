const RESEND_API_KEY = "re_igEh9nUo_g35mBvg2w8yEpURm5SJmRXN2"; //Deno.env.get("RESEND_API_KEY");

const handler = async (_request: Request): Promise<Response> => {
  const requestBody = await _request.json();
  const { to, subject, html } = requestBody;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "notifications@pickup-app-notifications.com",
      to,
      subject,
      html,
    }),
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

Deno.serve(handler);
