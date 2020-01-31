const { BN, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const PIXT = artifacts.require('PixT');

contract('PixT', function(accounts) {
    const owner = accounts[0];
    const recipient = accounts[1];

    beforeEach(async function() {
        this.PIXTInstance = await PIXT.new({ from: owner });
    });
});
it('a créé une nouvelle image', async function() {
    let datas = "25/12/2019 15:37:21,eos 1300d,25,Paris,France,Vacances Disney,Jean Dupont,QmSyMfjwNyuHUQE4YJ6Rq78YaztbuhRnhTxfEwQvULHqhK,A l'entrée du parc";
    let permission = true;
    let tokenIDValeurAvant = await this.PIXTInstance.getTokenID();
    await this.PIXTInstance.createNewPicture(datas, permission);
    expect(await this.PIXTInstance.getTokenID()).to.equal(tokenIDValeurAvant + 1);
});

it('test pour voir', async function() {
    let gt = 12;
    expect(gt).to.equal(12);
});