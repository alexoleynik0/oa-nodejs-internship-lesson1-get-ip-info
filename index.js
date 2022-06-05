const http = require('http');
const { networkInterfaces } = require('os');

const DEFAULT_IP_ADDRESS = '0.0.0.0';

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

module.exports.getExternalIpAddress = (
    callback,
    apiHttpOptions = [],
    requestTimeout = 100,
    attempt = 0,
) => {
    let externalIpAddress = DEFAULT_IP_ADDRESS;

    const makeCallback = () => {
        if (typeof callback === 'function') {
            callback(externalIpAddress);
        }
    };

    const handleError = () => {
        module.exports.getExternalIpAddress(
            callback,
            apiHttpOptions,
            requestTimeout,
            attempt + 1,
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
        .setTimeout(requestTimeout)
        .on('error', handleError)
        .end();
};
