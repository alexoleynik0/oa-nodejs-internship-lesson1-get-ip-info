const http = require('http');
const { networkInterfaces } = require('os');

const DEFAULT_IP_ADDRESS = '0.0.0.0';

/**
 * Returns the IP address of current external network.
 * Can return LAN IP in some cases.
 *
 * @param {string|number} [family=IPv4] - The family/version of
 * network IP address.
 * @returns {string} IP address or '0.0.0.0' as fallback.
 */
module.exports.getIpAddress = (family = 'IPv4') => {
    const netInterfaces = networkInterfaces();
    let ipAddress = DEFAULT_IP_ADDRESS;

    Object.keys(netInterfaces).forEach((netInterfacesName) => {
        netInterfaces[netInterfacesName].some((netAddress) => {
            // skip internal / loopback addresses
            if (!netAddress.internal && netAddress.family === family) {
                ipAddress = netAddress.address;
                return true;
            }
            return false;
        });
    });

    return ipAddress;
};

/**
 * List of default public IP API services HTTP options.
 */
const EXTERNAL_IP_ADDRESS_API_HTTP_OPTIONS = [
    {
        host: 'api.ipify.org', port: 80,
    },
    {
        host: 'ipinfo.io', path: '/ip', port: 80,
    },
    {
        host: 'icanhazip.com', port: 80,
    },
    {
        host: 'ident.me', port: 80,
    },
];

/**
 * The number of the current attempt
 * which points to the httpOptions element.
 */
let attempt = 0;

/**
 * The callback to be passed to `getExternalIpAddress` function
 * as first argument.
 *
 * @callback getExternalIpAddressCallback
 * @param {string} ip - IP address or '0.0.0.0' as fallback.
 */

/**
 * Returns the external IP address determined using Public IP
 * address check API services.
 *
 * @param {getExternalIpAddressCallback} callback - to be called with found IP.
 * @param {*[]} [apiHttpOptions=[]] - array of Node.js http options to use
 * before default list.
 */
module.exports.getExternalIpAddress = (callback, apiHttpOptions = []) => {
    let externalIpAddress = DEFAULT_IP_ADDRESS;

    const makeCallback = () => {
        attempt = 0;
        if (typeof callback === 'function') {
            callback(externalIpAddress);
        }
    };

    const handleError = () => {
        module.exports.getExternalIpAddress(
            callback,
            apiHttpOptions,
        );
    };

    const combinedRequestOptions = [
        ...apiHttpOptions,
        ...EXTERNAL_IP_ADDRESS_API_HTTP_OPTIONS,
    ];

    // terminate if it's excess attempt
    if (combinedRequestOptions.length <= attempt) {
        makeCallback();
        return;
    }
    const requestOptions = combinedRequestOptions[attempt];
    attempt += 1;

    const requestCallback = (response) => {
        response.setEncoding('utf8'); // to not deal with Buffer

        if (response.statusCode >= 200 && response.statusCode <= 299) {
            response.on('data', (data) => {
                externalIpAddress = data.trim();
            });
            response.on('end', () => {
                makeCallback();
            });
        } else {
            handleError();
        }
    };

    let httpToUse = http;
    if (requestOptions.port === 443 || requestOptions.protocol === 'https:') {
        try {
            httpToUse = require('https'); // eslint-disable-line global-require
        } catch (_err) {
            handleError(); // https support is disabled
        }
    }

    httpToUse.request(requestOptions, requestCallback)
        .on('error', handleError)
        .end();
};
