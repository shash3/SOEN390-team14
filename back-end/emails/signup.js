const sgMail = require('@sendgrid/mail');
const sendgridAPIKey = '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';

sgMail.setApiKey(sendgridAPIKey);

const sendSignupEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'soen390shop@gmail.com',
        subject: 'Soen390-team14 signup',
        text: `Hello ${name}, you have successfully signed up! `
    })
}

module.exports = {
    sendSignupEmail
}