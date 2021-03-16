const sgMail = require('@sendgrid/mail');
const sendgridAPIKey = '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';

sgMail.setApiKey(sendgridAPIKey);

sgMail.send({
    to: "soen390shop@gmail.com",
    from: "soen390shop@gmail.com",
    subject: "test",
    text: "test1"
});