const {
    getIpAddress,
    getExternalIpAddress,
    getExternalIpAddressPromise,
} = require('..');

const ip1 = getIpAddress();
console.log('getIpAddress IPv4', ip1);

// if you like callbacks
getExternalIpAddress((ip2) => {
    console.log('getExternalIpAddress IPv4', ip2);
});

// if you like Promises
getExternalIpAddressPromise()
    .then((ip3) => {
        console.log('getExternalIpAddressPromise IPv4', ip3);
    });

// if you like async-awaits
const yourCoolAsyncFn = async () => {
    const ip4 = await getExternalIpAddressPromise();
    console.log('getExternalIpAddressPromise async IPv4', ip4);
};
yourCoolAsyncFn();
