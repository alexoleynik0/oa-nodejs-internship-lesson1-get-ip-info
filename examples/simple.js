const { getIpAddress, getExternalIpAddress } = require('..');

const ip1 = getIpAddress();
console.log('getIpAddress IPv4', ip1);

getExternalIpAddress((ip2) => {
    console.log('getExternalIpAddress IPv4', ip2);
});
