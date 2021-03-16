const sgMail = require('@sendgrid/mail');
const sendgridAPIKey = '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';

sgMail.setApiKey(sendgridAPIKey);

const sendSignupEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'soen390shop@gmail.com',
        subject: 'this is test email',
        text: `Hello ${name}, you have successfully signed up! `
    })
}

module.exports = {
    sendSignupEmail
}