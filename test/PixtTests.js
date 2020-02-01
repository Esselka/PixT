const PIXT = artifacts.require('PixT');
const truffleAssert = require('truffle-assertions');

contract('PixT', function(accounts) {
    const owner = accounts[0];
    const acc1 = accounts[1];

    beforeEach(async function() {
        PIXTInstance = await PIXT.new({ from: owner });

        // Création d'un token pour pouvoir effectuer la plupart des tests
        let datas = "25/12/2019 15:37:21,eos 1300d,25,Paris,France,Vacances Disney,Jean Dupont,QmSyMfjwNyuHUQE4YJ6Rq78YaztbuhRnhTxfEwQvULHqhK,A l'entrée du parc";
        let permission = true;
        await PIXTInstance.createNewPicture(datas, permission);
    });

    it('A créé une nouvelle image', async() => {
        let datas = "25/12/2019 15:37:21,eos 1300d,25,Paris,France,Vacances Disney,Jean Dupont,QmSyMfjwNyuHUQE4YJ6Rq78YaztbuhRnhTxfEwQvULHqhK,A l'entrée du parc";
        let permission = true;
        await truffleAssert.passes(
            PIXTInstance.createNewPicture(datas, permission),
            'This method should not run out of gas'
        );
    });

    /*it('a acheté une image', async() => {
        await truffleAssert.passes(
            let donnees = "25/12/2019 15:37:21,eos 1300d,25,Paris,France,Vacances Disney,Jean Dupont,QmSyMfjwNyuHUQE4YJ6Rq78YaztbuhRnhTxfEwQvULHqhK,A l'entrée du parc";
            let perm = true; PIXTInstance.createNewPicture(donnees, perm),

            PIXTInstance.buyPics(
                "0",
                "1",
                "1",
                "2", { value: web3.utils.toWei("1", "finney") }
            )
        );
    });*/

    it('A autorisé l\'impression de l\'image', async() => {
        await truffleAssert.passes(
            PIXTInstance.setPrintable(
                "0", "true"
            )
        );
    });

    it('A autorisé PixT à gérer la commercialisation de l\'image', async() => {
        await truffleAssert.passes(
            PIXTInstance.setPermission(
                "0", "true"
            )
        );
    });

    it('A définit le niveau d\'accés de l\'image', async() => {
        await truffleAssert.passes(
            PIXTInstance.setAccessLevel(
                "0", "3"
            )
        );
    });

    it('A récupérer les infos des ventes et revenus d\'une adresse', async() => {
        await truffleAssert.passes(
            PIXTInstance.getPhotoOwnerInfos(
                accounts[1]
            )
        );
    });

    it('A récupérer la liste des images détenues par une adresse', async() => {
        await truffleAssert.passes(
            PIXTInstance.getListToken(
                owner
            )
        );
    });

    it('A récupérer les métadonnées d\'une image', async() => {
        await truffleAssert.passes(
            PIXTInstance.getPicInfos(
                "0"
            )
        );
    });

    it('A récupérer le nombre d\'image que possède une adresse', async() => {
        await truffleAssert.passes(
            PIXTInstance.balanceOf(
                owner
            )
        );
    });

    it('A récupérer l\'adresse du propriétaire de l\'image', async() => {
        await truffleAssert.passes(
            PIXTInstance.ownerOf(
                "0"
            )
        );
    });

    it('A récupérer la balance du smart contract', async() => {
        await truffleAssert.passes(
            PIXTInstance.balanceOfSC()
        );
    });

    it('A réussi le transfer d\'une image entre 2 adresses', async() => {
        await truffleAssert.passes(
            PIXTInstance.transferFrom(
                owner, acc1, "0"
            )
        );
    });

    it('Doit être un echec car transfer interdit n\'étant pas propriétaire de l\'image', async() => {
        await truffleAssert.fails(
            PIXTInstance.transferFrom(
                acc1, accounts[4], "0"
            ),
            truffleAssert.ErrorType.REVERT,
            "ERC721: transfer of token that is not own"
        );
    });

    it('Doit être un echec car l\'adresse ne possède pas d\'image', async() => {
        await truffleAssert.fails(
            PIXTInstance.getListToken(
                acc1
            ),
            truffleAssert.ErrorType.REVERT,
            "No token owned."
        );
    });

    it('Doit être un echec car pas le propriétaire de l\'image', async() => {
        await truffleAssert.fails(
            PIXTInstance.setPrintable(
                "0", "true", { from: acc1 }
            ),
            truffleAssert.ErrorType.REVERT,
            "Not token's owner"
        );
    });

    it('Doit être un echec car pas le propriétaire de l\'image', async() => {
        await truffleAssert.fails(
            PIXTInstance.setPermission(
                "0", "true", { from: acc1 }
            ),
            truffleAssert.ErrorType.REVERT,
            "Not token's owner"
        );
    });

    it('Doit être un echec car pas le bon niveau d\'accés', async() => {
        await truffleAssert.fails(
            PIXTInstance.setAccessLevel(
                "0", "2", { from: acc1 }
            ),
            truffleAssert.ErrorType.REVERT
        );
    });

    it('Doit être un echec car l\'image n\'existe pas', async() => {
        await truffleAssert.fails(
            PIXTInstance.setAccessLevel(
                "1", "3"
            ),
            truffleAssert.ErrorType.REVERT,
            "This token doesn't exists."
        );
    });

});