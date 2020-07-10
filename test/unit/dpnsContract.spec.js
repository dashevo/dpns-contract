const DashPlatformProtocol = require('@dashevo/dpp');
const generateRandomId = require('@dashevo/dpp/lib/test/utils/generateRandomId');

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

    identityId = generateRandomId();

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
          saltedDomainHash: Buffer.alloc(34).toString('hex'),
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
          preorderData.saltedDomainHash = '';

          const preorder = dpp.document.create(contract, identityId, 'preorder', preorderData);

          const result = await dpp.document.validate(preorder);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('minLength');
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
          nameHash: Buffer.alloc(34).toString('hex'),
          label: 'Wallet',
          normalizedLabel: 'wallet',
          normalizedParentDomainName: 'dash',
          preorderSalt: 'yTU2B8bTaq1X17Sm4QdTjfgtPQ6MD2Mx2c',
          records: {
            dashUniqueIdentityId: generateRandomId(),
          },
        };
      });

      describe('nameHash', () => {
        it('should be defined', async () => {
          delete domainData.nameHash;

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('nameHash');
        });

        it('should not be empty', async () => {
          domainData.nameHash = '';

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('minLength');
          expect(error.dataPath).to.equal('.nameHash');
        });
      })

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
      })

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
          domainData.preorderSalt = '';

          const domain = dpp.document.create(contract, identityId, 'domain', domainData);

          const result = await dpp.document.validate(domain);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('minLength');
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
            someOtherProperty: 42
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
            it('should be longer than 42 chars', async () => {
              domainData.records = {
                dashUniqueIdentityId: 'short indentity',
              };

              const domain = await dpp.document.create(contract, identityId, 'domain', domainData);

              const result = await dpp.document.validate(domain);

              expect(result.isValid()).to.be.false();
              expect(result.errors).to.have.a.lengthOf(1);

              const [error] = result.errors;

              expect(error.name).to.equal('JsonSchemaError');
              expect(error.keyword).to.equal('minLength');
              expect(error.dataPath).to.equal('.records.dashUniqueIdentityId');
            });

            it('should be less than 44 chars', async () => {
              domainData.records = {
                dashUniqueIdentityId: Buffer.alloc(64).toString('hex'),
              };

              const domain = await dpp.document.create(contract, identityId, 'domain', domainData);

              const result = await dpp.document.validate(domain);

              expect(result.isValid()).to.be.false();
              expect(result.errors).to.have.a.lengthOf(1);

              const [error] = result.errors;

              expect(error.name).to.equal('JsonSchemaError');
              expect(error.keyword).to.equal('maxLength');
              expect(error.dataPath).to.equal('.records.dashUniqueIdentityId');
            });
          });

          describe('dashAliasIdentityId', () => {
            it('should be longer than 42 chars', async () => {
              domainData.records = {
                dashAliasIdentityId: 'short indentity',
              };

              const domain = await dpp.document.create(contract, identityId, 'domain', domainData);

              const result = await dpp.document.validate(domain);

              expect(result.isValid()).to.be.false();
              expect(result.errors).to.have.a.lengthOf(1);

              const [error] = result.errors;

              expect(error.name).to.equal('JsonSchemaError');
              expect(error.keyword).to.equal('minLength');
              expect(error.dataPath).to.equal('.records.dashAliasIdentityId');
            });

            it('should be less than 44 chars', async () => {
              domainData.records = {
                dashAliasIdentityId: Buffer.alloc(64).toString('hex'),
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
      })
    });
  });
});
