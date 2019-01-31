const crypto = require('./crypto');

describe('Crypto', () => {
    it('sha256 is working as expected', () => {
        expect(crypto.sha256('Hello World')).toEqual('07CF55095EF805A89C07BF3D4764B07352A8F4B2CC3DF166E89D2193131536BD'.toLowerCase());
    });

    it('sha256 produces the same hash for multiple arguments', () => {
        expect(crypto.sha256('Hello', 'World')).toEqual(crypto.sha256('World','Hello'));
    });

    it('should produce a unique hash when properties have changed', () => {
        const foo = {};
        const originalHash = crypto.sha256(foo);
        foo['a'] = 'dummy';
        expect(crypto.sha256(foo)).not.toEqual(originalHash);
    });
});