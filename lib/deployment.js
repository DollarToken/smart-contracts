const co = require('co');

const asyncDeploy = function(generator) {
    const wrapper = function(deployer, network) {
        return deployer.then(co.wrap(function *() {
            return yield generator(deployer, network);
        }));
    }

    return wrapper;
}

const deployService = co.wrap(function *(web3, deployer, artifacts, service) {
    const Services = artifacts.require("Services.sol");
    let services = yield Services.deployed()

    yield deployer.deploy(service, services.address);
    let instance = yield service.deployed();

    let name = service.contract_name;
    console.log("  Registering service...", name);
    yield services.specifyService(
        web3.sha3(name), instance.address
    );
    console.log("  Registered.");

    return instance;
});

module.exports = {
    asyncDeploy, deployService
}
