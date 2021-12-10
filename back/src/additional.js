const alphabet = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';

module.exports.getRandomString = function getRandomString(size = 10) {
    let string = '';

    while (string.length < size) {
        string += alphabet[Math.floor(Math.random() * alphabet.length)];
    };

    return string;
}