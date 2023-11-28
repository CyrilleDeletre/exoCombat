// Variables globales

// Déclarer des variables pour stocker les références aux éléments hpLost pour chaque joueur
let hpLostPlayer1;
let hpLostPlayer2;

let actionPointsPlayer1;
let actionPointsPlayer2;

let wakfuPointsPlayer1;
let wakfuPointsPlayer2;

// Variable pour récupéré les data du Fetch
let fetchedData;
let currentTurn = 1;

// Variable pour selectionner une Classe
let selectedClass = null;

let player1 = {
    actionPoints: 0, // Nombre de points d'action
    wakfuPoints: 0,  // Nombre de points de wakfu
};

let player2 = {
    actionPoints: 0, // Nombre de points d'action
    wakfuPoints: 0,  // Nombre de points de wakfu
};

// Variables pour les équipes
let equipe1 = document.querySelector("#equipe-1");
let equipe2 = document.querySelector("#equipe-2");
let classesSelections = document.querySelector("#classes-selection");
let selectTitle = document.querySelector("#select-title");

// Variable pour suivre le nombre de joueurs créés
let joueurCount = 0;

let classesDiv;


// Fonction pour créer dynamiquement des boutons générique
function createElement(type, id, className, text, backgroundImg, parent, event) {

    // Création dans le DOM du bouton
    const htmlElement = document.createElement(type);
    // Ajout au bouton d'une ID
    htmlElement.id = id;
    // Ajout au bouton d'une classe
    htmlElement.className = className;
    // Ajout au bouton d'un text
    htmlElement.textContent = text;
    // Ajout au bouton d'un backgroundImage
    htmlElement.style.backgroundImage = `url(${backgroundImg})`;
    // Ajout du bouton dans un parent dans le DOM
    parent.appendChild(htmlElement);
    // Ajout au bouton d'un gestionnaire d'évènement
    htmlElement.addEventListener('click', event);
    // Retourne l'élément créé
    return htmlElement;
}

fetch("classes.json")
    .then(response => response.json())
    .then(data => {
        // Stockage des données du fetch dans la variable globale
        fetchedData = data;

        classesDiv = createElement("div", "classesDiv", "classes-div", "", "", classesSelections,)

        // Créer des boutons pour chaque classe
        data.classes.forEach(classe => {
            createElement("button", `${classe.name.fr.toLowerCase()}`, "class-img", "", classe.image, classesDiv, doSomething);

            // // Créer des boutons pour chaque sort pour chaque classe en fonction de la classe
            // classe.spells.forEach(spell => {
            //     createElement(`${spell.name.fr.toLowerCase()}`, "spell-img", spell.image, document.body);
            // });
        });

        // Créer le bouton "selectButton"
        createElement("button", "selectButton", "select-button", "Selectionner", "", classesSelections, selectClass);

    })
    .catch(error => console.error('Erreur de chargement JSON :', error));


// Fonction pour gérer la sélection d'une classe
function doSomething() {
    // Obtenez la classe associée au bouton cliqué
    const classesName = this.id;
    const selectedNewClasse = fetchedData.classes.find((classe) => classe.name.fr.toLowerCase() === classesName);

    // Affichez des informations sur la classe pré-sélectionnée
    console.log(`Classe pré-sélectionnée : ${selectedNewClasse.name.fr}`);


    // Ajoutez ou remplacez l'image dans la div de l'équipe
    const equipeDiv = joueurCount === 0 ? equipe1 : equipe2;

    // Retirez la classe 'selected-class' de l'ancien bouton (s'il existe)
    const oldSelectedButton = document.querySelector('.class-img.selected-class');
    if (oldSelectedButton) {
        oldSelectedButton.classList.remove('selected-class');
    }

    // Ajoutez la classe 'selected-class' au bouton actuel
    this.classList.add('selected-class');

    // Créez un nouvel élément image sans bordure
    const newSelectedImage = document.createElement('img');
    newSelectedImage.src = selectedNewClasse.image;
    newSelectedImage.alt = selectedNewClasse.name.fr;

    // Ajoutez le nouvel élément image à la div de l'équipe
    equipeDiv.innerHTML = '';
    equipeDiv.appendChild(newSelectedImage);

    // Mettez à jour la classe sélectionnée
    selectedClass = selectedNewClasse;
}
// Fonction pour gérer la sélection d'une classe

// Fonction pour gérer la sélection d'une classe
function selectClass() {
    const allClassButtons = document.querySelectorAll('.class-img');
    allClassButtons.forEach(button => {
        button.classList.remove('selected-class');
    });
    if (selectedClass && joueurCount < 2) {
        // Créez un joueur en fonction de la classe sélectionnée
        const playerName = prompt("Entrez le nom du joueur :");
        const newPlayer = createPlayer(playerName, selectedClass);

        if (selectedClass && joueurCount < 2) {

            if (joueurCount === 0) {
                player1 = newPlayer;
                equipe1.innerHTML += `<div>${newPlayer.name} - ${newPlayer.class.name.fr}</div>`;

                // Appel à la fonction pour créer l'élément hpLost lors de la sélection du joueur 1
                createPlayerElements(player1.class);
            } else {
                player2 = newPlayer;
                equipe2.innerHTML += `<div>${newPlayer.name} - ${newPlayer.class.name.fr}</div>`;

                // Appel à la fonction pour créer l'élément hpLost lors de la sélection du joueur 2
                createPlayerElements(player2.class);
            }
        }

        // Ajoutez les boutons de sorts sous l'image de la classe dans l'équipe
        SpellButtons(selectedClass.spells, joueurCount === 0 ? equipe1 : equipe2, joueurCount === 0 ? player1 : player2);
        // Incrémente le nombre de joueurs créés
        joueurCount++;

        // Affichez des informations sur le nouveau joueur
        console.log(`Joueur créé : ${newPlayer.name} de la classe ${newPlayer.class.name.fr}`);

        // Vérifiez si les deux équipes sont complètes
        if (joueurCount === 2) {
            console.log("Les deux équipes sont complètes. Aucun autre joueur ne peut être ajouté.");
            startCombat();
        }

        // Réinitialisez la classe sélectionnée
        selectedClass = null;
    } else if (joueurCount >= 2) {
        alert("Les deux équipes sont complètes. Aucun autre joueur ne peut être ajouté.");
    } else {
        alert("Aucune classe sélectionnée.");
    }
}

// Fonction pour créer un joueur
function createPlayer(name, selectedClass) {
    return {
        name: name,
        class: selectedClass,
    };
}


function SpellButtons(spells, parent, currentPlayer) {
    spells.forEach(spell => {
        createElement("button", `${spell.name.fr.toLowerCase()}`, "spell-img", "", spell.image, parent, function () {
            // Vérifiez si la cible a encore des points de vie
            if (currentPlayer.actionPoints >= spell.ap && currentPlayer.class.hp > 0) {
                const targetPlayer = currentPlayer === player1 ? player2 : player1;
                const attackerPlayer = currentPlayer;
                damage(attackerPlayer.class, targetPlayer.class, spell);

                // Déduisez le coût du sort des points d'action du joueur
                currentPlayer.actionPoints -= spell.ap;

                // Mettez à jour l'affichage des points d'action
                updateActionPointsDisplay(currentPlayer);

                // Vérifiez si le joueur a utilisé tous ses points d'action
                if (currentPlayer.actionPoints === 0) {
                    endTurn();
                }
            } else if (currentPlayer.class.hp <= 0) {
                alert("La cible est déjà vaincue ! Choisissez une autre action.");
            } else {
                alert("Pas assez de points d'action !");
            }
        });
    });
}

function startCombat() {
    // Supprimer le titre :
    selectTitle.textContent = "C'est l'heure du du-du-duel"
    // Supprimer tous les boutons de classe
    const classButtons = document.querySelectorAll('.class-img');

    classButtons.forEach(button => {
        classesDiv.removeChild(button);
    });

    classesSelections.removeChild(selectButton)

    // Commencez le premier tour avec le joueur 1
    startTurn(player1);
}

function damage(attackerClass, targetClass, spell) {
    // Vérifiez si les propriétés nécessaires sont présentes
    if (targetClass && targetClass.hp !== undefined && spell && spell.damage !== undefined) {
        // Calculer les dégâts en fonction du sort utilisé
        const calculatedDamage = spell.damage;

        // Appliquer les dégâts à la classe cible
        targetClass.hp -= calculatedDamage;

        // Assurez-vous que les points de vie ne deviennent pas négatifs
        targetClass.hp = Math.max(targetClass.hp, 0);

        // Choisissez la bonne variable hpLost en fonction de la personne qui subit les dégâts
        let hpLost;
        if (targetClass === player1.class) {
            hpLost = hpLostPlayer1;
        } else {
            hpLost = hpLostPlayer2;
        }

        // Utilisez la nouvelle fonction pour mettre à jour les points de vie et afficher l'alerte
        updateHealthAndShowAlert(targetClass === player1.class ? player1 : player2, hpLost);
    } else {
        console.error("Erreur : Propriétés manquantes pour calculer les dégâts.");
    }
}
function startTurn(player) {
    // Vérifiez si le joueur a encore des points de vie
    if (player.class.hp > 0) {
        player.actionPoints = player.class.pointsActions;
        // Mettez à jour l'affichage des points d'action
        updateActionPointsDisplay(player);
    } else {
        // Affichez un message ou effectuez d'autres actions pour indiquer que le joueur a été vaincu
        console.log(`${player.name} a été vaincu ! Fin du combat.`);
        // Ajoutez ici toute logique ou fonctionnalité nécessaire pour gérer la fin du combat
    }
}

function endTurn() {
    const currentPlayer = currentTurn % 2 === 1 ? player1 : player2;

    // Vérifiez si le joueur actuel a utilisé tous ses points d'action
    if (currentPlayer.actionPoints === 0) {
        // Code pour passer au tour suivant, éventuellement mettre à jour l'affichage, etc.
        currentTurn++;

        // Déterminez le prochain joueur à jouer en fonction du numéro du tour
        const nextPlayer = currentTurn % 2 === 1 ? player1 : player2;
        // Commencez le tour du prochain joueur
        startTurn(nextPlayer);

        // Réinitialisez les points d'action du joueur actuel après le passage au tour suivant
        currentPlayer.actionPoints = nextPlayer.class.pointsActions;
        // Mettez à jour l'affichage des points d'action
        updateActionPointsDisplay(currentPlayer);
    } else {
        // Si le joueur actuel a encore des points d'action, laissez-le continuer son tour
        // ou effectuez d'autres actions nécessaires
    }
}

function startTurn(player) {
    player.actionPoints = player.class.actionPoints;
    // Mettez à jour l'affichage des points d'action seulement si le joueur a des points d'action
    if (player.actionPoints !== undefined) {
        updateActionPointsDisplay(player);
    }
    endTurn();
}
function updateActionPointsDisplay(player) {
    // Code pour mettre à jour l'affichage des points d'action (par exemple, modifier le texte d'un élément HTML)
    console.log(`Points d'action restants pour ${player.name}: ${player.actionPoints}`);


}

function createPlayerElements(targetClass) {
    // Déterminez la div de l'équipe concernée
    const equipeDiv = targetClass === player1.class ? equipe1 : equipe2;

    // Créez l'élément hpLost avec le texte initial
    const hpLost = createElement("p", `hpLost${targetClass.name}`, "hp-lost", `Points de vie : ${targetClass.hp}`, "", equipeDiv);

    // Créez l'élément actionPoints avec le texte initial
    const actionPoints = createElement("p", `actionPoints${targetClass.name}`, "action-points", `Points d'action : ${targetClass.actionPoints}`, "", equipeDiv);

    // Créez l'élément wakfuPoints avec le texte initial
    const wakfuPoints = createElement("p", `wakfuPoints${targetClass.name}`, "wakfu-points", `Points de wakfu : ${targetClass.wakfuPoints}`, "", equipeDiv);

    // Stockez la référence à hpLost, actionPoints et wakfuPoints dans les variables appropriées
    if (targetClass === player1.class) {
        hpLostPlayer1 = hpLost;
        actionPointsPlayer1 = actionPoints;
        wakfuPointsPlayer1 = wakfuPoints;
    } else {
        hpLostPlayer2 = hpLost;
        actionPointsPlayer2 = actionPoints;
        wakfuPointsPlayer2 = wakfuPoints;
    }
}

function updateHealthAndShowAlert(player, hpLost) {
    // Mettez à jour les points de vie
    hpLost.textContent = `Points de vie : ${player.class.hp}`;

    // Vérifiez si la cible a atteint 0 points de vie ou moins
    if (player.class.hp <= 0) {
        disableSpellButtons();
        // Utilisez setTimeout pour retarder l'affichage de l'alerte
        setTimeout(function() {
            alert(`${player.class.name.fr} a été vaincu ! Fin du combat.`);
        }, 100); // Délai d'une seconde (ajustez selon vos besoins)
    }
}

function updateActionPointsDisplay(player) {
    // Vérifiez si le joueur et sa classe sont définis avant d'accéder à actionPoints
    const actionPoints = player && player.actionPoints !== undefined ? player.actionPoints : 0;

    // Code pour mettre à jour l'affichage des points d'action (par exemple, modifier le texte d'un élément HTML)
    console.log(`Points d'action restants pour ${player.name}: ${actionPoints}`);

    // Mettez à jour l'affichage des points d'action dans l'élément correspondant
    const actionPointsElement = player === player1 ? actionPointsPlayer1 : actionPointsPlayer2;
    if (actionPointsElement) {
        actionPointsElement.textContent = `Points d'actions : ${actionPoints}`;
    }
}

// Fonction pour désactiver les boutons de sort
function disableSpellButtons() {
    // Logique pour désactiver les boutons de sort, par exemple :
    const spellButtons = document.querySelectorAll('.spell-button');
    spellButtons.forEach(button => {
        button.disabled = true;
        button.disabled = true;
    });
}
