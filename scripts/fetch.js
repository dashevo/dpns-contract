const DAPIClient = require('@dashevo/dapi-client');

/**
 * Fetch DPNS contract
 */
async function fetch() {
  // TODO: get seeds
  const dapiClient = new DAPIClient();

  const contractId = process.argv[2];

  const contract = await dapiClient.fetchContract(contractId);

  // TODO: define how to return and show this data
  return {
    contract,
  };
}

fetch();
