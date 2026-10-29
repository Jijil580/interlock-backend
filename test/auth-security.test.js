const test = require('node:test');
const assert = require('node:assert/strict');
const {hashPassword,verifyPassword,createAiToken,verifyAiToken}=require('../auth-security');

test('scrypt password hash verifies only the correct password', async()=>{
  const hash=await hashPassword('a strong password');
  assert.match(hash,/^scrypt\$/);
  assert.equal(await verifyPassword('a strong password',hash),true);
  assert.equal(await verifyPassword('wrong password',hash),false);
});

test('legacy plaintext password can be safely compared for one-time migration',async()=>{
  assert.equal(await verifyPassword('legacy-password','legacy-password'),true);
  assert.equal(await verifyPassword('wrong','legacy-password'),false);
  assert.equal(await verifyPassword('',''),false);
});

test('AI token signature, subject and expiration are validated',()=>{
  const secret='test-only-secret';
  const token=createAiToken({_id:'user-id',username:'office'},secret,60);
  assert.equal(verifyAiToken(token,secret).sub,'user-id');
  assert.equal(verifyAiToken(token,'different-secret'),null);
  const expired=createAiToken({_id:'user-id',username:'office'},secret,-1);
  assert.equal(verifyAiToken(expired,secret),null);
});
