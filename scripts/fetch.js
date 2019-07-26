const DAPIClient = require('@dashevo/dapi-client');

/**
 * Fetch DPNS contract
 */
async function fetch() {
  const seeds = process.env.DAPI_CLIENT_SEEDS
    .split(',')
    .map(ip => ({ service: `${ip}:${process.env.DAPI_CLIENT_PORT}` }));

  const dapiClient = new DAPIClient({
    seeds,
    timeout: 30000,
  });

  const contractId = process.argv[2];

  const contract = await dapiClient.fetchContract(contractId);

  // TODO: define how to return and show this data
  return {
    contract,
  };
}

fetch();
