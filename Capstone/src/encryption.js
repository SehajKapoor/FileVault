const crypto = require('crypto');

// import { Cipher } from 'js-cipher';
// import * as crypto from 'crypto-es';

function KeyGen(base, modulo, exponent) {
  var result = 1;
  while (exponent > 0) {
    if (exponent % 2 == 1) {
      result = (result * base) % modulo;
    }
    base = (base * base) % modulo;
    exponent = exponent >>> 1;
  }
  return result.toString();
}

const fixedBlob = '1234567812345678';

const cypherServer = (password) => {
  const cipher = new Cipher();
  return cipher.encrypt(password, 13);
};

const cypherChain = (password) => {
  const cipher = new Cipher();
  return cipher.encrypt(password, 10);
};

const fitto16 = (s) => {
  return s.substring(0, 16);
};

const encryptGroup = (message, key) => {
  const sharedkey = fitto16(key + fixedBlob);
  const encrypted = crypto.default.AES.encrypt(message, sharedkey).toString();
  return encrypted;
};

const decryptGroup = (encryptedMessage, key) => {
  const sharedkey = fitto16(key + fixedBlob);
  return crypto.default.AES.decrypt(
    encryptedMessage.toString(),
    sharedkey
  ).toString(crypto.default.enc.Utf8);
};

const encrypt = (message, key, pk) => {
  var modulo = 2000303;
  const sharedkey = fitto16(KeyGen(key, modulo, pk).toString() + fixedBlob);
  const encrypted = crypto.default.AES.encrypt(
    message.toString(),
    sharedkey.toString()
  ).toString();
  return encrypted;
};

const decrypt = (encryptedMessage, key, pk) => {
  var modulo = 2000303;
  const sharedkey = fitto16(KeyGen(key, modulo, pk).toString() + fixedBlob);
  const decrypted = crypto.default.AES.decrypt(
    encryptedMessage.toString(),
    sharedkey.toString()
  ).toString(crypto.default.enc.Utf8);
  return decrypted;
};

const alice = crypto.createECDH('secp256k1');
alice.generateKeys();

const bob = crypto.createECDH('secp256k1');
bob.generateKeys();

const alicePublicKeyBase64 = alice.getPublicKey().toString('base64');
const bobPublicKeyBase64 = bob.getPublicKey().toString('base64');

const aliceSharedKey = alice.computeSecret(bobPublicKeyBase64, 'base64', 'hex');
const bobSharedKey = bob.computeSecret(alicePublicKeyBase64, 'base64', 'hex');

console.log(aliceSharedKey === bobSharedKey);
console.log('Alice shared Key: ', aliceSharedKey);
console.log('Bob shared Key: ', bobSharedKey);

const aes256 = require('aes256');
const message = 'this is some random message...';
const encrypted = aes256.encrypt(aliceSharedKey, message);

const decrypted = aes256.decrypt(bobSharedKey, encrypted);
console.table({ encrypted, decrypted });
