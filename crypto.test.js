const crypto = require('./crypto');

describe('Crypto', () => {
    it('sha256 is working as expected', () => {
        expect(crypto.sha256('Hello World')).toEqual('A591A6D40BF420404A011733CFB7B190D62C65BF0BCDA32B57B277D9AD9F146E'.toLowerCase());
    });

    it('sha256 produces the same hash for multiple arguments', () => {
        expect(crypto.sha256('Hello', 'World')).toEqual(crypto.sha256('World','Hello'));
    });
});