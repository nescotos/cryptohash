const INITIAL_DIFFICULTY = 3;

module.exports = {
    GENESIS_DATA : {
        timestamp: 1,
        previousHash: '****',
        hash: 'one',
        data: [],
        difficulty: INITIAL_DIFFICULTY,
        nonce: 0
    },
    MINE_RATE: 1000,
    PORT: 3300,
    STARTING_BALANCE: 1000,
    REWARD: {
        address: 'authority'
    },
    REWARD_RATE: 100
}