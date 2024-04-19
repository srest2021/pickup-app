import ContactMeEmail from "Email";
import { Resend } from "resend";
import * as z from "zod";
import { supabase } from "../../lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

  //const { name, emailAddress, phoneNumber, content } = await supabase.auth.admin.
  const data = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["to email"],
    subject: `${name} has a message!`,
    react: ContactMeEmail({ name, emailAddress, phoneNumber, content }),
  });
  