const sgMail = require("@sendgrid/mail");
 
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  try {
    sgMail.send({
      to: email,
      from: "rahulvv88@gmail.com",
      subject: "Registered Successfully to the Task Manager App.",
      text: `Welcome to the app, ${name}. Let me know how you ge along with the app.`,
    });
  } catch (error) {
    console.log(error);
  }
};

const sendCancelEmail = (email, name) => {
  try {
    sgMail.send({
      to: email,
      from: "rahulvv88@gmail.com",
      subject: "Removed Successfully from the Task Manager App.",
      text: `Your account is successfully removed from the Task Manger App, ${name}. Please let us know why.`,
    });
  } catch (error) {
    console.log(error);
  }
};




module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
};
