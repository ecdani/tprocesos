var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
  auth: {
    api_user: 'ecdani',
    api_key: 'Nieblusco1'
  }
}

var client = nodemailer.createTransport(sgTransport(options));

var email = {
  from: 'awesome@bar.com',
  to: 'ec.dani@gmail.com',
  subject: 'Hello',
  text: 'Hello world',
  html: '<b>Hello world</b>'
};

client.sendMail(email, function(err, info){
    if (err ){
      console.log(error);
    }
    else {
      console.log('Message sent: ' + info.response);
    }
});