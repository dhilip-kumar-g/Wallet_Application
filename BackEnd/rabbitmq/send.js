#!/usr/bin/env node

const amqp = require("amqplib/callback_api");
function sendToQueue(msg){
  amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
      var queue = 'hello';

      channel.assertQueue(queue, {
        durable: false
      });

      channel.sendToQueue(queue, Buffer.from(msg));
      console.log(" [x] Sent %s", msg);
    });
   /* setTimeout(function() {
      connection.close();
    }, 500);*/
  });
}
module.exports = {sendToQueue};