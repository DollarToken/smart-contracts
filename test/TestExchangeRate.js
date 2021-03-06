require('mocha-generators').install();

var { fetchEvent } = require('./helpers');

var ExchangeRate = artifacts.require('ExchangeRate.sol');

contract('ExchangeRate', function(accounts) {
    it("should allow triggering price fetch", function* () {
        let exchangeRate = yield ExchangeRate.deployed();

        let result = yield exchangeRate.initFetch();

        let fetchEventHappened = false;
        for (let log of result.logs) {
            if (log.event === 'FetchExchangeRate') {
                fetchEventHappened = true;
            }
        }
        assert.equal(fetchEventHappened, true);

        let log = yield fetchEvent(exchangeRate.UpdateExchangeRate("latest"));
        assert.equal(log.event, "UpdateExchangeRate");
    });
});
