const accountSid = 'AC9828dd4c9f2a6635333ea51a5eeacb07'; // Replace with your Twilio Account SID
const authToken = '5f9b2852ae37e7f7a00f3a0be25d6f25'; // Replace with your Twilio Auth Token
const client = require('twilio')(accountSid, authToken);

const sendMessage = (toNumber, message) => {
  client.messages
    .create({
      body: message,
      from: 'Team DevSQL',
      to: toNumber
    })
    .then((message) => console.log(`Message sent with SID: ${message.sid}`))
    .catch((error) => console.error(error));
};

module.exports = sendMessage;
