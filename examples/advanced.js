const {
    getIpAddress,
    getExternalIpAddress,
    getExternalIpAddressPromise,
} = require('..');

// you can pass IP's `family/version` to be returned
const ip1 = getIpAddress('IPv6');
console.log('getIpAddress IPv6', ip1);

// you can pass the second argument - an array of NodeJS HTTP.request options to
// be used before default ones.
getExternalIpAddress((ip2) => {
    // 'https://ipapi.co/ip' was used as first attempt to get IP
    console.log('getExternalIpAddress IPv4', ip2);
}, [{ host: 'ipapi.co', path: '/ip', port: 443 }]);

// or as the first argument if you prefer Promise variant
getExternalIpAddressPromise([{ host: 'ident.me' }])
    .then((ip3) => {
        console.log('getExternalIpAddressPromise IPv4', ip3);
    });
