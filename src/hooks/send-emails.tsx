import {Resend} from "resend";


function useSendEmails() {

const resend = new Resend(process.env.RESEND_API_KEY);

const send_email = async (emailAddress:string[], emailSubject:string, emailMessage:string) => {
    try{
        await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: emailAddress,
            subject: emailSubject,
            react: emailMessage,
          });
    } catch(error){
        console.log("There was an error sending the email")
    }
}

return{
    send_email
};

}
export default useSendEmails;