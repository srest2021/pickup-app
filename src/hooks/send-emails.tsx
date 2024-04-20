import {Resend} from "resend";
import 'web-streams-polyfill';


function useSendEmails() {

const resend = new Resend("re_igEh9nUo_g35mBvg2w8yEpURm5SJmRXN2");

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