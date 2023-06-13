const accountSid = 'AC9828dd4c9f2a6635333ea51a5eeacb07'; // Replace with your Twilio Account SID
const authToken = '03c95815ae7bae4d382af40e47563468'; // Replace with your Twilio Auth Token
const client = require('twilio')(accountSid, authToken);

const sendMessage = (toNumber, message) => {
  console.log({ toNumber, message });
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
