const RESEND_API_KEY = "re_igEh9nUo_g35mBvg2w8yEpURm5SJmRXN2"; //Deno.env.get("RESEND_API_KEY"); //process.env.RESEND_API_KEY

const handler = async (_request: Request): Promise<Response> => {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: ['kforsbe1@jhu.edu', 'delivered@resend.dev'],
      subject: 'this is sofia',
      html: '<strong>it works!</strong>',
    }),
  })

  const data = await res.json()

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

Deno.serve(handler)