const {
  Transaction,
  PrivateKey,
} = require('@dashevo/dashcore-lib');

const DashPlatformProtocol = require('@dashevo/dpp');
const DAPIClient = require('@dashevo/dapi-client');

const dpnsDocumentsSchema = require('../src/schema/dpns-documents.json');

/**
 * Execute DPNS contract registration
 */
async function register() {
  const seeds = process.env.DAPI_CLIENT_SEEDS
    .split(',')
    .map(ip => ({ service: `${ip}:${process.env.DAPI_CLIENT_PORT}` }));

  const dapiClient = new DAPIClient({
    seeds,
    timeout: 30000,
  });

  const dpp = new DashPlatformProtocol();

  const contract = dpp.contract.create('DPNSContract', dpnsDocumentsSchema);

  dpp.setContract(contract);

  const contractPacket = dpp.packet.create(contract);

  const privateKey = new PrivateKey(
    process.env.DPNS_USER_PRIVATE_KEY_STRING,
  );

  const transaction = new Transaction()
    .setType(Transaction.TYPES.TRANSACTION_SUBTX_TRANSITION);

  transaction.extraPayload
    .setRegTxId(process.env.DPNS_USER_REG_TX_ID)
    .setHashPrevSubTx(process.env.DPNS_USER_PREVIOUS_ST)
    .setHashSTPacket(contractPacket.hash())
    .setCreditFee(1000)
    .sign(privateKey);

  const transitionHash = await dapiClient.sendRawTransition(
    transaction.serialize(),
    contractPacket.serialize().toString('hex'),
  );

  // TODO: define how to return and show this data
  return {
    contractId: contract.getId(),
    transitionHash,
  };
}

register();
