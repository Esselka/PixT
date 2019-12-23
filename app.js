let metaMaskconnected = false;
async function createMetaMaskDapp() {
    try {
        // Demande à MetaMask l'autorisation de se connecter
        const addresses = await ethereum.enable();
        const user = addresses[0];
        // Connection au noeud fourni par l'objet web3
        const provider = new ethers.providers.Web3Provider(ethereum);
        // Création de l'accès au contrat
        let monContrat = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        let monContratSigne = monContrat.connect(provider.getSigner(user.address));
        dapp = { provider, monContrat, monContratSigne, user };
        console.log("DApp ready: ", dapp);
        metaMaskconnected = true;
        // Surveiller l'évênement Transfer et notifier les transferts dans la console
        dapp.monContrat.on('Transfer', (_from, _to, _tokenID) => {
            console.log(`Transfert effectué\nFrom    : ${_from}\nTo      : ${_to}\nTokenID : ${_tokenID}`);
        });
        document.getElementById("metaMaskOK").innerHTML = " Connexion au contrat établie";
    } catch (err) {
        // Gestion des erreurs
        document.getElementById("metaMaskOK").innerHTML = " La connexion à MetaMask a échouée";
        console.error(err);
    }
}

//TODO : test si on rentre autre chose qu'un number en tokenID
//TODO : faire un tableau pour les données
async function getPicInfos(tokenID) {
    if (metaMaskconnected === true) {
        try {
            let infos = await dapp.monContrat.getPicInfos(tokenID);
            infos = infos.toString().split(',');

            document.getElementById("infosPic").innerHTML = `<br><strong><u>Metadonnées image n°${tokenID}</u></strong> :<br><br>
            <strong><u>Date</u> : </strong>${infos[0]}<br>
            <strong><u>Modèle caméra</u> : </strong>${infos[1]}<br>
            <strong><u>Prix</u> : </strong>${infos[2]}<br>
            <strong><u>Ville</u> : </strong>${infos[3]}<br>
            <strong><u>Pays</u> : </strong>${infos[4]}<br>
            <strong><u>Titre</u> : </strong>${infos[5]}<br>
            <strong><u>Auteur</u> : </strong>${infos[6]}<br>
            <strong><u>Hash</u> : </strong>${infos[7]}<br>
            <strong><u>Description</u> : </strong>${infos[8]}<br>
            <strong><u>Violation de copyright</u> : </strong>${infos[9]}<br>
            <strong><u>Image imprimable</u> : </strong>${infos[10]}<br><br>`;
        } catch (err) {
            console.error(err);
        }
    } else {
        alert("Veuillez vous connecter à MetaMask avant d'effectuer toute opération.");
    }
}

async function lireCSV() {
    if (metaMaskconnected === true) {
        try {
            let numToken = await dapp.monContrat.getTokenID();
            let file = document.getElementById("csvFile").files[0];
            if (file !== undefined) {
                let reader = new FileReader();

                let content = document.getElementById('csvResult');
                reader.onload = async function(event) {
                    let imgArray = reader.result.split(',');
                    let autorisation = document.getElementsByName('autorisation')[1].checked === true ? false : true;
                    await dapp.monContratSigne.createNewPicture(imgArray.toString(), autorisation);
                    content.innerHTML = `<strong><u>Image créée avec les metadonnées suivantes</u> :</strong><br>
                                        <strong><u>Identifiant image</u> : </strong>${numToken}<br>
                                        <strong><u>Date</u> : </strong>${imgArray[0]}<br>
                                        <strong><u>Modèle caméra</u> : </strong>${imgArray[1]}<br>
                                        <strong><u>Prix</u> : </strong>${imgArray[2]}<br>
                                        <strong><u>Ville</u> : </strong>${imgArray[3]}<br>
                                        <strong><u>Pays</u> : </strong>${imgArray[4]}<br>
                                        <strong><u>Titre</u> : </strong>${imgArray[5]}<br>
                                        <strong><u>Auteur</u> : </strong>${imgArray[6]}<br>
                                        <strong><u>Hash</u> : </strong>${imgArray[7]}<br>
                                        <strong><u>Description</u> : </strong>${imgArray[8]}<br><br>
            `;
                };
                reader.readAsText(file);
            } else {
                document.getElementById('csvResult').innerHTML = "Fichier métadonnées images manquant.";
            }
        } catch (err) {
            console.error(err);
        }
    } else {
        alert("Veuillez vous connecter à MetaMask avant d'effectuer toute opération.");
    }
}

//TODO : expérience utilisateur après achat
async function acheterImage() {
    if (metaMaskconnected === true) {
        try {
            let choixExp = document.querySelector('input[name="choix-expedition"]:checked').value;
            let choixFor = document.querySelector('input[name="choix-format"]:checked').value;
            let token = document.getElementById('tokenID-achat').value;
            let datas = await dapp.monContrat.getPicInfos(token);
            let prix = datas[0].split(',')[2];

            //TODO : conversion du prix en eth avant envoi, pour l'instant 0.01 ETH pour le test
            let overrides = { value: ethers.utils.parseEther('0.01') };

            await dapp.monContratSigne.buyPics(token, prix, choixExp, choixFor, overrides);
        } catch (err) {
            console.error(err);
        }
    } else {
        alert("Veuillez vous connecter à MetaMask avant d'effectuer toute opération.");
    }
}

//TODO : expérience utilisateur
async function setPrintable() {
    if (metaMaskconnected === true) {
        try {
            let choixPrint = document.querySelector('input[name="choix-printable"]:checked').value;
            let tokenID = document.getElementById('tokenID-printable').value;
            await dapp.monContratSigne.setPrintable(tokenID, choixPrint);
        } catch (err) {
            console.error(err);
        }
    } else {
        alert("Veuillez vous connecter à MetaMask avant d'effectuer toute opération.");
    }
}

//TODO : expérience utilisateur
async function setPermission() {
    if (metaMaskconnected === true) {
        try {
            let choixPerm = document.querySelector('input[name="choix-permission"]:checked').value;
            let tokenID = document.getElementById('tokenID-permission').value;
            await dapp.monContratSigne.setPermission(tokenID, choixPerm);
        } catch (err) {
            console.error(err);
        }
    } else {
        alert("Veuillez vous connecter à MetaMask avant d'effectuer toute opération.");
    }
}

//TODO : expérience utilisateur
async function setAccessLevel() {
    if (metaMaskconnected === true) {
        try {
            let getNiv = document.getElementById('accesLevel');
            let choixNiveau = getNiv.options[getNiv.selectedIndex].value;
            let tokenID = document.getElementById('tokenID-acces-level').value;
            await dapp.monContratSigne.setAccessLevel(tokenID, choixNiveau);
        } catch (err) {
            console.error(err);
        }
    } else {
        alert("Veuillez vous connecter à MetaMask avant d'effectuer toute opération.");
    }
}

//TODO : expérience utilisateur
async function getOwnerOf(token) {
    if (metaMaskconnected === true) {
        try {
            let res = await dapp.monContrat.ownerOf(token);
            document.getElementById('adresseProprio').innerHTML = `<u>L'adresse propriétaire de l'image n°${token} est</u> :<br><br><strong>${res}</strong>`
        } catch (err) {
            console.error(err);
        }
    } else {
        alert("Veuillez vous connecter à MetaMask avant d'effectuer toute opération.");
    }
}

//TODO : expérience utilisateur
async function transferImage(tokenID, to) {
    if (metaMaskconnected === true) {
        try {
            await dapp.monContratSigne.transferFrom(dapp.user, to, tokenID);
        } catch (err) {
            console.error(err);
        }
    } else {
        alert("Veuillez vous connecter à MetaMask avant d'effectuer toute opération.");
    }
}

//TODO : expérience utilisateur
async function setNewOwner() {
    if (metaMaskconnected === true) {
        try {
            let newOwnerAddress = document.getElementById('newOwnerAddr').value;
            await dapp.monContratSigne.setOwner(newOwnerAddress);
        } catch (err) {
            console.error(err);
        }
    } else {
        alert("Veuillez vous connecter à MetaMask avant d'effectuer toute opération.");
    }
}

//TODO : expérience utilisateur
async function setRolesAddress() {
    if (metaMaskconnected === true) {
        try {
            let addr1 = document.getElementById('admin1').value;
            let addr2 = document.getElementById('admin2').value;
            let addr3 = document.getElementById('admin3').value;
            await dapp.monContratSigne.setRolesAddress(addr1, addr2, addr3);
        } catch (err) {
            console.error(err);
        }
    } else {
        alert("Veuillez vous connecter à MetaMask avant d'effectuer toute opération.");
    }
}

//TODO : expérience utilisateur
async function getBalance() {
    if (metaMaskconnected === true) {
        try {
            let balance = await dapp.monContratSigne.balanceOfSC();
            document.getElementById('SCBalance').innerHTML = `Le contrat possède actuellement ${balance} ETH.`;
        } catch (err) {
            console.error(err);
        }
    } else {
        alert("Veuillez vous connecter à MetaMask avant d'effectuer toute opération.");
    }
}