import Mailgen from  "mailgen";
import nodemailer from "nodemailer";


//sending email using mailtrap

const  sendEmail = async(options) => {
    const mailGenerator = new Mailgen({ // Configure mailgen by setting a theme and your product info
        theme: "default",
        product: {
            name: "Task Manager App",
            link: "https://taskmanagerlink.com"
        }
    })
    // Generate the email content based on the provided options
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent) // Generate the HTML version of the email content

    const emailHTML = mailGenerator.generate(options.mailgenContent) // Create a transporter object using the default SMTP transport

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_STMP_HOST,
        port: Number(process.env.MAILTRAP_STMP_PORT),
        auth: {
            user: process.env.MAILTRAP_STMP_USER, 
            pass: process.env.MAILTRAP_STMP_PASSWORD // Replace with your Mailtrap credentials
        }
    })

    // Define the email options
    const mail = {
        from: "mail.taskmanager@example.com",
        to: options.email, // Replace with the recipient's email address
        subject: options.subject, //    Replace with the email subject
        text: emailTextual, // Set the email content as plain text
        html: emailHTML // Set the email content as HTML
    }

    //error handling
    try{
        await transporter.sendMail(mail) // Send the email using the transporter
        console.log("Email sent successfully")

    }catch(error){
        console.log(`Error in sending email: ${error}`)
    }
}

const emailVerificationMailgenContent =  (username, verificationUrl) => 
    {
        return {
            body: {
                name: username,
                intro: "welcome to our App! We're very excited to have you on board.",
                action: {
                    instruction: "To verify your email please click on the following button",
                    button: {
                        color: "#22BC66", // Optional action button color
                        text: "Verify Email",
                        link: verificationUrl
                    }
                },
                outro: "Need help, or have questions? Just reply to this email, we'd love to help."             
                    }
                }
  };

  const forgotPasswordMailgenContent =  (username, verificationUrl) => 
    {
        return {
            body: {
                name: username,
                intro: "You have received this email because a password reset request for your account was received. If you did not make this request, please ignore this email.",
                action: {
                    instruction: "To reset your password, please click on the following button",
                    button: {
                        color: "#22BC66", // Optional action button color
                        text: "Reset Password",
                        link: verificationUrl
                    }
                },
                outro: "Need help, or have questions? Just reply to this email, we'd love to help."             
                    }
                }
  };

export {sendEmail, emailVerificationMailgenContent, forgotPasswordMailgenContent};