const DAPIClient = require('@dashevo/dapi-client');

/**
 * Fetch DPNS contract
 *
 * @param {string} contractId
 *
 * @returns {Object}
 */
async function fetch(contractId) {
  const seeds = process.env.DAPI_CLIENT_SEEDS
    .split(',')
    .map(ip => ({ service: `${ip}:${process.env.DAPI_CLIENT_PORT}` }));

  const dapiClient = new DAPIClient({
    seeds,
    timeout: 30000,
  });

  const contract = await dapiClient.fetchContract(contractId);

  return contract;
}

module.exports = fetch;
