const DashPlatformProtocol = require('@dashevo/dpp');

const dpnsDocumentsSchema = require('../../src/schema/dpns-documents.json');

describe('DPNS Contract', () => {
  let dpp;
  let contract;

  beforeEach(() => {
    dpp = new DashPlatformProtocol();

    contract = dpp.contract.create('DPNSContract', dpnsDocumentsSchema);

    dpp.setContract(contract);
    dpp.setUserId('000000000000000000000000000000000000000000000000000000000000000f');
  });

  it('should have a valid contract definition', () => {
    const validationResult = dpp.contract.validate(contract);

    expect(validationResult.isValid()).to.be.true();
  });

  describe('documents', () => {
    describe('preorder', () => {
      let preorderData;

      beforeEach(() => {
        preorderData = {
          saltedDomainHash: '',
        };
      });

      it('should throw validation error if `saltedDomainHash` is not specified', () => {
        delete preorderData.saltedDomainHash;

        const preorder = dpp.document.create('preorder', preorderData);

        const result = dpp.document.validate(preorder);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('required');
        expect(error.params.missingProperty).to.equal('saltedDomainHash');
      });

      it('should throw validation error if `saltedDomainHash` is invalid', () => {
        const preorder = dpp.document.create('preorder', preorderData);

        const result = dpp.document.validate(preorder);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('required');
        expect(error.params.missingProperty).to.equal('saltedDomainHash');
      });

      it('should successfuly validate preorder document if it is valid', () => {
        const preorder = dpp.document.create('preorder', preorderData);

        const result = dpp.document.validate(preorder);

        expect(result.isValid()).to.be.true();
      });
    });

    describe('domain', () => {
      let domainData;

      beforeEach(() => {
        domainData = {
          hash: '',
          label: '',
          normalizedLabel: '',
          parentDomainHash: '',
          preorderSalt: '',
          records: [
            { dashIdentity: '' },
          ],
        };
      });

      it('should throw validation error if `hash` is not specified', () => {
        delete domainData.hash;

        const domain = dpp.document.create('domain', domainData);

        const result = dpp.document.validate(domain);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('required');
        expect(error.params.missingProperty).to.equal('hash');
      });

      it('should throw validation error if `hash` is invalid', () => {
        domainData.hash = 'invalid hash';

        const domain = dpp.document.create('domain', domainData);

        const result = dpp.document.validate(domain);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('required');
        expect(error.params.missingProperty).to.equal('hash');
      });

      it('should throw validation error if `label` is not specified', () => {
        delete domainData.label;

        const domain = dpp.document.create('domain', domainData);

        const result = dpp.document.validate(domain);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('required');
        expect(error.params.missingProperty).to.equal('label');
      });

      it('should throw validation error if `label` is invalid', () => {
        domainData.label = 'invalid label';

        const domain = dpp.document.create('domain', domainData);

        const result = dpp.document.validate(domain);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('required');
        expect(error.params.missingProperty).to.equal('label');
      });

      it('should throw validation error if `normalizedLabel` is not specified', () => {
        delete domainData.normalizedLabel;

        const domain = dpp.document.create('domain', domainData);

        const result = dpp.document.validate(domain);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('required');
        expect(error.params.missingProperty).to.equal('normalizedLabel');
      });

      it('should throw validation error if `normalizedLabel` is invalid', () => {
        domainData.normalizedLabel = 'InValiD label';

        const domain = dpp.document.create('domain', domainData);

        const result = dpp.document.validate(domain);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('required');
        expect(error.params.missingProperty).to.equal('normalizedLabel');
      });

      it('should throw validation error if `parentDomainHash` is not specified', () => {
        delete domainData.parentDomainHash;

        const domain = dpp.document.create('domain', domainData);

        const result = dpp.document.validate(domain);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('required');
        expect(error.params.missingProperty).to.equal('parentDomainHash');
      });

      it('should throw validation error if `parentDomainHash` is invalid', () => {
        domainData.parentDomainHash = 'invalid parent hash';

        const domain = dpp.document.create('domain', domainData);

        const result = dpp.document.validate(domain);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('required');
        expect(error.params.missingProperty).to.equal('parentDomainHash');
      });

      it('should throw validation error if `preorderSalt` is not specified', () => {
        delete domainData.preorderSalt;

        const domain = dpp.document.create('domain', domainData);

        const result = dpp.document.validate(domain);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('required');
        expect(error.params.missingProperty).to.equal('preorderSalt');
      });

      it('should throw validation error if `preorderSalt` is invalid', () => {
        domainData.preorderSalt = 'invalid preorder salt';

        const domain = dpp.document.create('domain', domainData);

        const result = dpp.document.validate(domain);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('required');
        expect(error.params.missingProperty).to.equal('preorderSalt');
      });

      it('should throw validation error if `records` are not specified', () => {
        delete domainData.records;

        const domain = dpp.document.create('domain', domainData);

        const result = dpp.document.validate(domain);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('required');
        expect(error.params.missingProperty).to.equal('records');
      });

      it('should throw validation error if `records` is empty', () => {
        domainData.records = [];

        const domain = dpp.document.create('domain', domainData);

        const result = dpp.document.validate(domain);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('required');
        expect(error.params.missingProperty).to.equal('normalizedLabel');
      });

      it('should throw validation error if `records` have an invalid record', () => {
        domainData.records = [
          // TODO: add invalid record
        ];

        const domain = dpp.document.create('domain', domainData);

        const result = dpp.document.validate(domain);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('required');
        expect(error.params.missingProperty).to.equal('normalizedLabel');
      });

      it('shoud successfuly validate a domain document is it is valid', () => {
        const domain = dpp.document.create('domain', domainData);

        const result = dpp.document.validate(domain);

        expect(result.isValid()).to.be.true();
      });
    });
  });

  describe('data triggers', () => {

  });
});
