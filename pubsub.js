const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub{
    constructor({blockchain}){
        this.blockchain = blockchain;

        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();
        
        Object.values(CHANNELS).map(channel => {
            this.subscriber.subscribe(channel);
        });

        this.subscriber.on('message', this.handleMessage);
    }

    handleMessage(channel, message){
        console.log(`Message Received from Chanel: ${channel} Message: ${message}`);

        const payload = JSON.parse(message);

        if(channel === CHANNELS.BLOCKCHAIN){
            this.blockchain.replaceChain(payload);
        }
    }

    publish({channel, message}) {
        this.publisher.publish(channel, message);
    }

    broadcastChain(){
        this.publish(
            {
                channel: CHANNELS.BLOCKCHAIN,
                message: JSON.stringify(this.blockchain.chain)
            }
        );
    }
}

module.exports = PubSub;