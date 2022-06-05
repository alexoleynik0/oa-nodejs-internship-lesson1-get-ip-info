const { getIpAddress, getExternalIpAddress } = require('..');

const ip1 = getIpAddress('IPv6');
console.log('getIpAddress IPv6', ip1);

getExternalIpAddress((ip2) => {
    // 'https://ipapi.co/ip' was used as first attempt to get IP
    console.log('getExternalIpAddress IPv4', ip2);
}, [{ host: 'ipapi.co', path: '/ip', port: 443 }]);
