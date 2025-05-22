function  get_rsa_public_key (){
  var pubkey='-----BEGIN PUBLIC KEY-----';
  pubkey+='MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDB1KN7CZXlTZ6NaeXid4MaI+m6';
  pubkey+='qMXfvTwaRHx9JIS6i9V+MNERN/4rbX0phfSqf6IIK3nFEnLNQLRqoU3CcODrPT3U';
  pubkey+='DMkk7IuGOp9XDLHVWOMwbRn23JfgE/bz7opETrtg9iRVrarcp6P19XEC/eZ90TkQ';
  pubkey+='N108CxhjOZq93bs1MQIDAQAB';
  pubkey+='-----END PUBLIC KEY-----';
  return pubkey;
}
module.exports = {
  get_public_key:get_rsa_public_key
}
