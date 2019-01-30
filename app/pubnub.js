const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-4e010501-135c-4114-b806-aef4ee0bf84f',
    subscribeKey: 'sub-c-6656c1a0-03d9-11e9-a399-32ec39b2e34f',
    secretKey: 'sec-c-OGNmNWM2MDQtYTc0OS00ZjE4LWJhMmYtODA4YzUyYTIyNmE3'
}

const CHANNELS = {
    TEST: 'TEST'
}

class PubSub{
    constructor(){
        this.pubnub = new PubNub(credentials);
        this.pubnub.subscribe({ channels: [Object.values(CHANNELS)]});
        this.pubnub.addListener(this.listener());
    }

    listener(){
        return {
            message: response => {
                const { channel, message } = response;
                console.log(`Message Received from ${channel} with payload: ${message}`);
            }
        }
    }

    publish({channel, message}){
        this.pubnub.publish({channel, message});
    }
}

const testPubSub = new PubSub();
testPubSub.publish({channel: CHANNELS.TEST, message: 'Hello There!'});

module.exports = PubSub;