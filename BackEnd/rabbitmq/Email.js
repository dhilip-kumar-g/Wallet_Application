var nodemailer = require('nodemailer')

async function sendEmail(mailId,text){

  console.log(mailId)
  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dhilipkumar01012001@gmail.com',
      pass: 'stark$2021'
    }
  });
  
  var mailOptions = {
    from: 'dhilipkumar01012001@gmail.com',
    to:mailId,
    subject: 'Sending Email using Node.js',
    text: text
    // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
    
}
module.exports ={
    sendEmail
}
