# oa-nodejs-internship-lesson1-get-ip-info

Node.js utility to get IPv4 or IPv6 addresses of a current machine.

## Basic Usage

```js
const {
    getIpAddress,
    getExternalIpAddress,
    getExternalIpAddressPromise,
} = require('oa-nodejs-internship-lesson1-get-ip-info');

const ipv4Address = getIpAddress(); // e.g. '192.0.2.146'
```

Or you can use callback-based `getExternalIpAddress` function to get the IP that is seen when you make any HTTP request. This might be useful when first variant gives you LAN IP instead of **WAN IP**.

The `getExternalIpAddressPromise` is equivalent to the `getExternalIpAddress` but is it's promisified version, so first param (callback) is omitted.

```js
// if you like callbacks
getExternalIpAddress((ipv4Address) => {
    console.log(ipv4Address); // e.g. '103.114.98.206'
});

// if you like Promises
getExternalIpAddressPromise()
    .then((ipv4Address) => {
        console.log(ipv4Address); // e.g. '103.114.98.206'
    });
```

If for some reason it's impossible to specify the IP address, `'0.0.0.0'` is returned as result from any of functions.

## Advanced Usage

The `getIpAddress` accepts one optional _family_ string param, which can be either `'IPv4'` (default) or `'IPv6'`. 
> Note: But if you're using Node.js version **18.x or higher**, this param should be **numeric** `4` or `6` accordingly, and should be passed **always**. Check [Node.js v18.x OS docs].

```js
const ipv6Address = getIpAddress('IPv6');
//=> e.g. '2001:0db8:85a3:0000:0000:8a2e:0370:7334'

// but for Node.js v18.x or higher
const ipv6Address = getIpAddress(6);
```

The `getExternalIpAddress` accepts one optional _apiHttpOptions_ array params, defaults to empty array `[]`, which is an additional list of [Node.js HTTP Request Options] that should be used before predefined list of Public IP Address API services: 
[api.ipify.org], [ipinfo.io/ip], [icanhazip.com], [ident.me] -- in given order.

When request to one API fails, attempt to get IP from the next is made, and down to the last/success or to default '0.0.0.0' fallback value.

Only `text/plain` or `text/html` response **content-types** are supported.
No caching supported, and no multiple concurrent use advised.

```js
getExternalIpAddress((ipv4Address) => {
    console.log(ipv4Address); // 'https://ipapi.co/ip' was used as first attempt to get IP
}, [{ host: 'ipapi.co', path: '/ip', port: 443 }]);

// or if you like Promises
getExternalIpAddressPromise([{ host: 'ident.me' }])
    .then((ipv4Address) => {
        console.log(ipv4Address); // 'http://ident.me' was used as first attempt to get IP
    });
```

For more examples see [usage examples].

> Note: By default `'http:'` protocol is used (`80` port). If your service uses 'https:' protocol you need to specify that in the **apiHttpOptions** array's item by passing `port: 443` (as in example above) or `protocol: 'https:'`. 
> If **crypto** module is disabled in the current Node.js build, no error will be shown.

> Note: The **family/version** of returned **IP** (IPv4 or IPv6) fully depends on the passed API service options. By default it's an `IPv4`.

## License

[ISC]

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [Node.js v18.x OS docs]: <https://nodejs.org/dist/latest-v18.x/docs/api/os.html#osnetworkinterfaces>
   [Node.js HTTP Request Options]: <https://nodejs.org/dist/latest-v16.x/docs/api/http.html#httprequestoptions-callback>
   [api.ipify.org]: <http://api.ipify.org>
   [ipinfo.io/ip]: <http://ipinfo.io/ip>
   [icanhazip.com]: <http://icanhazip.com>
   [ident.me]: <http://ident.me>
   [usage examples]: <https://github.com/alexoleynik0/oa-nodejs-internship-lesson1-get-ip-info/tree/master/examples>
   [ISC]: <https://github.com/alexoleynik0/oa-nodejs-internship-lesson1-get-ip-info/blob/master/LICENSE>
