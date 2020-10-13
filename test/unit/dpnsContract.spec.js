const crypto = require('crypto');

const DashPlatformProtocol = require('@dashevo/dpp');

const generateRandomIdentifier = require('@dashevo/dpp/lib/test/utils/generateRandomIdentifier');

const dpnsContractDocumentsSchema = require('../../schema/dpns-contract-documents.json');

describe('DPNS Contract', () => {
  let dpp;
  let contract;
  let identityId;

  beforeEach(function beforeEach() {
    const fetchContractStub = this.sinon.stub();

    dpp = new DashPlatformProtocol({
      stateRepository: {
        fetchDataContract: fetchContractStub,
      },
    });

    identityId = generateRandomIdentifier();

    contract = dpp.dataContract.create(identityId, dpnsContractDocumentsSchema);

    fetchContractStub.resolves(contract);
  });

  it('should have a valid contract definition', async () => {
    const validationResult = await dpp.dataContract.validate(contract);

    expect(validationResult.isValid()).to.be.true();
  });

  describe('documents', () => {
    describe('preorder', () => {
      let preorderData;

      beforeEach(() => {
        preorderData = {
          saltedDomainHash: crypto.randomBytes(32),
        };
      });

      describe('saltedDomainHash', () => {
        it('should be defined', async () => {
          delete preorderData.saltedDomainHash;

          const preorder = dpp.document.create(contract, identityId, 'preorder', preorderData);

          const result = await dpp.document.validate(preorder);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('saltedDomainHash');
        });

        it('should not be empty', async () => {
          preorderData.saltedDomainHash = Buffer.alloc(0);

          const preorder = dpp.document.create(contract, identityId, 'preorder', preorderData);

          const result = await dpp.document.validate(preorder);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('minBytesLength');
          expect(error.dataPath).to.equal('.saltedDomainHash');
        });

        it('should exactly 32 bytes length', async () => {
          preorderData.saltedDomainHash = crypto.randomBytes(10);
          let preorder = dpp.document.create(contract, identityId, 'preorder', preorderData);

          let result = await dpp.document.validate(preorder);
          await dpp.document.validate(preorder);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          let [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('minBytesLength');
          expect(error.dataPath).to.equal('.saltedDomainHash');

          preorderData.saltedDomainHash = crypto.randomBytes(40);
          identityId = generateRandomIdentifier();
          preorder = dpp.document.create(contract, identityId, 'preorder', preorderData);

          result = await dpp.document.validate(preorder);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('maxBytesLength');
          expect(error.dataPath).to.equal('.saltedDomainHash');
        });
      });

      it('should not have additional properties', async () => {
        preorderData.someOtherProperty = 42;

        const preorder = dpp.document.create(contract, identityId, 'preorder', preorderData);

        const result = await dpp.document.validate(preorder);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('additionalProperties');
        expect(error.params.additionalProperty).to.equal('someOtherProperty');
      });

      it('should be valid', async () => {
        const preorder = dpp.document.create(contract, identityId, 'preorder', preorderData);

        const result = await dpp.document.validate(preorder);

        expect(result.isValid()).to.be.true();
      });
    });

    describe('domain', () => {
      let domainData;

      beforeEach(() => {
        domainData = {
          label: 'Wallet',
          normalizedLabel: 'wallet',
          normalizedParentDomainName: 'dash',
          preorderSalt: crypto.randomBytes(32),
          records: {
            dashUniqueIdentityId: generateRandomIdentifier(),
          },
          subdomainRules: {
            allowSubdomains: false,
          },
        };
      });

      describe('label', () => {
        it('should be defined', async () => {
          delete domainData.label;

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('label');
        });

        it('should follow pattern', async () => {
          domainData.label = 'invalid label';

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('pattern');
          expect(error.dataPath).to.equal('.label');
        });

        it('should be longer than 3 chars', async () => {
          domainData.label = 'ab';

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('minLength');
          expect(error.dataPath).to.equal('.label');
        });

        it('should be less than 63 chars', async () => {
          domainData.label = 'a'.repeat(64);

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('maxLength');
          expect(error.dataPath).to.equal('.label');
        });
      });

      describe('normalizedLabel', () => {
        it('should be defined', async () => {
          delete domainData.normalizedLabel;

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('normalizedLabel');
        });

        it('should follow pattern', async () => {
          domainData.normalizedLabel = 'InValiD label';

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('pattern');
          expect(error.dataPath).to.equal('.normalizedLabel');
        });

        it('should be less than 63 chars', async () => {
          domainData.normalizedLabel = 'a'.repeat(64);

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('maxLength');
          expect(error.dataPath).to.equal('.normalizedLabel');
        });
      });

      describe('normalizedParentDomainName', () => {
        it('should be defined', async () => {
          delete domainData.normalizedParentDomainName;

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('normalizedParentDomainName');
        });

        it('should be less than 190 chars', async () => {
          domainData.normalizedParentDomainName = 'a'.repeat(191);

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('maxLength');
          expect(error.dataPath).to.equal('.normalizedParentDomainName');
        });

        it('should follow pattern', async () => {
          domainData.normalizedParentDomainName = '';

          let domain = dpp.document.create(contract, identityId, 'domain', domainData);

          let result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.true();

          domainData.normalizedParentDomainName = 'notNormalized';
          domain = dpp.document.create(contract, identityId, 'domain', domainData);
          result = await dpp.document.validate(domain);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('pattern');
          expect(error.dataPath).to.equal('.normalizedParentDomainName');
        });
      });

      describe('preorderSalt', () => {
        it('should be defined', async () => {
          delete domainData.preorderSalt;

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('preorderSalt');
        });

        it('should not be empty', async () => {
          domainData.preorderSalt = Buffer.alloc(0);

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('minBytesLength');
          expect(error.dataPath).to.equal('.preorderSalt');
        });

        it('should exactly 32 bytes length', async () => {
          domainData.preorderSalt = crypto.randomBytes(10);

          let domain = dpp.document.create(contract, identityId, 'domain', domainData);

          let result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          let [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('minBytesLength');
          expect(error.dataPath).to.equal('.preorderSalt');

          domainData.preorderSalt = crypto.randomBytes(40);

          domain = dpp.document.create(contract, identityId, 'domain', domainData);

          result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('maxBytesLength');
          expect(error.dataPath).to.equal('.preorderSalt');
        });
      });

      it('should not have additional properties', async () => {
        domainData.someOtherProperty = 42;

        const domain = dpp.document.create(contract, identityId, 'domain', domainData);

        const result = await dpp.document.validate(domain);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('additionalProperties');
        expect(error.params.additionalProperty).to.equal('someOtherProperty');
      });

      it('should be valid', async () => {
        const domain = dpp.document.create(contract, identityId, 'domain', domainData);

        const result = await dpp.document.validate(domain);

        expect(result.isValid()).to.be.true();
      });

      describe('Records', () => {
        it('should be defined', async () => {
          delete domainData.records;

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('records');
        });

        it('should not be empty', async () => {
          domainData.records = {};

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('minProperties');
          expect(error.dataPath).to.equal('.records');
        });

        it('should not have additional properties', async () => {
          domainData.records = {
            someOtherProperty: 42,
          };

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('additionalProperties');
          expect(error.dataPath).to.equal('.records');
          expect(error.params.additionalProperty).to.equal('someOtherProperty');
        });

        describe('Dash Identity', () => {
          it('should have either `dashUniqueIdentityId` or `dashAliasIdentityId`', async () => {
            domainData.records = {
              dashUniqueIdentityId: identityId,
              dashAliasIdentityId: identityId,
            };

            const domain = dpp.document.create(contract, identityId, 'domain', domainData);

            const result = await dpp.document.validate(domain);

            expect(result.isValid()).to.be.false();
            expect(result.errors).to.have.a.lengthOf(1);

            const [error] = result.errors;

            expect(error.name).to.equal('JsonSchemaError');
            expect(error.keyword).to.equal('maxProperties');
            expect(error.dataPath).to.equal('.records');
          });

          describe('dashUniqueIdentityId', () => {
            it('should no less than 32 bytes', async () => {
              domainData.records = {
                dashUniqueIdentityId: crypto.randomBytes(30),
              };

              const domain = await dpp.document.create(contract, identityId, 'domain', domainData);

              const result = await dpp.document.validate(domain);

              expect(result.isValid()).to.be.false();
              expect(result.errors).to.have.a.lengthOf(1);

              const [error] = result.errors;

              expect(error.name).to.equal('JsonSchemaError');
              expect(error.keyword).to.equal('minBytesLength');
              expect(error.dataPath).to.equal('.records.dashUniqueIdentityId');
            });

            it('should no more than 32 bytes', async () => {
              domainData.records = {
                dashUniqueIdentityId: crypto.randomBytes(64),
              };

              const domain = await dpp.document.create(contract, identityId, 'domain', domainData);

              const result = await dpp.document.validate(domain);

              expect(result.isValid()).to.be.false();
              expect(result.errors).to.have.a.lengthOf(1);

              const [error] = result.errors;

              expect(error.name).to.equal('JsonSchemaError');
              expect(error.keyword).to.equal('maxBytesLength');
              expect(error.dataPath).to.equal('.records.dashUniqueIdentityId');
            });
          });

          describe('dashAliasIdentityId', () => {
            it('should no less than 32 bytes', async () => {
              domainData.records = {
                dashAliasIdentityId: crypto.randomBytes(30),
              };

              const domain = await dpp.document.create(contract, identityId, 'domain', domainData);

              const result = await dpp.document.validate(domain);

              expect(result.isValid()).to.be.false();
              expect(result.errors).to.have.a.lengthOf(1);

              const [error] = result.errors;

              expect(error.name).to.equal('JsonSchemaError');
              expect(error.keyword).to.equal('minBytesLength');
              expect(error.dataPath).to.equal('.records.dashAliasIdentityId');
            });

            it('should no more than 32 bytes', async () => {
              domainData.records = {
                dashAliasIdentityId: crypto.randomBytes(64),
              };

              const domain = await dpp.document.create(contract, identityId, 'domain', domainData);

              const result = await dpp.document.validate(domain);

              expect(result.isValid()).to.be.false();
              expect(result.errors).to.have.a.lengthOf(1);

              const [error] = result.errors;

              expect(error.name).to.equal('JsonSchemaError');
              expect(error.keyword).to.equal('maxLength');
              expect(error.dataPath).to.equal('.records.dashAliasIdentityId');
            });
          });
        });
      });

      describe('subdomainRules', () => {
        it('should be defined', async () => {
          delete domainData.subdomainRules;

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('subdomainRules');
        });

        it('should not have additional properties', async () => {
          domainData.subdomainRules.someOtherProperty = 42;

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('additionalProperties');
          expect(error.dataPath).to.equal('.subdomainRules');
        });

        describe('allowSubdomains', () => {
          it('should be boolean', async () => {
            domainData.subdomainRules.allowSubdomains = 'data';

            const domain = dpp.document.create(contract, identityId, 'domain', domainData);

            const result = await dpp.document.validate(domain);

            expect(result.isValid()).to.be.false();
            expect(result.errors).to.have.a.lengthOf(1);

            const [error] = result.errors;

            expect(error.name).to.equal('JsonSchemaError');
            expect(error.keyword).to.equal('type');
            expect(error.dataPath).to.equal('.subdomainRules.allowSubdomains');
          });
        });
      });
    });
  });
});
