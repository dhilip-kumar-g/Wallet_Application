#!/usr/bin/env node
const email = require('./Email')

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, async function(msg) {
            var temp = msg.content.toString()
            var data = temp.split(",")
           // console.log(data[0])
            await email.sendEmail(data[0],data[1])
            .then(res=>{
              //  console.log(" [x] Received %s", data[1]);
                console.log("result"+res)
            })
            .catch(err=>{
                console.log("error"+err)
            })
        }, {
            noAck: true
        });
    });
}); 