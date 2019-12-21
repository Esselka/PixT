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
}

async function lireCSV() {
    let file = document.getElementById("csvFile").files[0];
    if (file !== undefined) {
        let reader = new FileReader();

        let content = document.getElementById('csvResult');
        reader.onload = async function(event) {
            let imgArray = reader.result.split(',');
            await dapp.monContratSigne.createNewPicture(imgArray.toString());
            content.innerHTML = `<strong><u>Image créée avec les metadonnées suivantes</u> :
            </strong><br><strong><u>Date</u> : </strong>${imgArray[0]}<br>
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
        document.getElementById('csvResult').innerHTML = "Fichier contenant les métadonnées images manquant.";
    }
}

const convertToTimestamp = (date) => {
    let dt = date.replace(/[/ :]/g, ',').split(',');
    let timestamp = new Date(Date.UTC(dt[2], dt[1] - 1, dt[0], dt[3], dt[4], dt[5]));
    return timestamp.getTime() / 1000;
}