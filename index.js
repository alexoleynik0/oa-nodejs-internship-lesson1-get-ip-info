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
