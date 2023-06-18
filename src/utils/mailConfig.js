import nodemailer from 'nodemailer';

export const mailConfig = async (token, email) => {
    const transport = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass:  process.env.EMAIL_PASS,
        }
    });

    const message = {
        from: '"Todolist" <info@mytodolist.fun>',
        to: email,
        subject: 'Restore password',
        text: 'Please, follow the link to set new password',
        html: `
            <h2>Please, follow the link to set new password</h2>
            <h4>If you don't restore your password ignore this mail</h4>
            <hr/>
            <br/>
            <a href='https://mytodolist.fun/auth/reset/${token}'>Link for set new password</a>
        `
    };

    const status = await transport.sendMail(message);

    return status;
}
