document.addEventListener('DOMContentLoaded', function() {
    let count = 0;
    let clickValue = 1;
    let autoClickValue = 0;
    let trophyCount = 0;
    let achievements = {
        'First Click': false,
        'Thousand Citizens': false,
        'Millionaire': false,
    };
    let boostCount = 0;
    const MAX_BOOSTS = 10;
    let isClickSoundEnabled = true;
    let isBackgroundMusicEnabled = true;

    const clicker = document.getElementById('clicker');
    const counter = document.getElementById('count');
    const trophyCounter = document.getElementById('trophyCount');
    const achievementsList = document.getElementById('achievements');
    const events = document.getElementById('events');
    const perSecondDisplay = document.getElementById('perSecond');
    const toggleClickSoundButton = document.getElementById('toggleClickSound');
    const toggleBackgroundMusicButton = document.getElementById('toggleBackgroundMusic');

    let backgroundMusic = new Audio('Musique.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;

    // Nouvelle automatisation: Clonage cellulaire
    let cellCloningActive = false;
    let cellCloningMultiplier = 1;

    // Nouvelle automatisation: Réseau neuronal
    let neuralNetworkActive = false;
    let neuralNetworkMultiplier = 1;

    function showEvent(message, color = 'red') {
        let eventDiv = document.createElement('div');
        eventDiv.textContent = message;
        eventDiv.style.color = color;
        events.prepend(eventDiv);
        setTimeout(() => {
            if (events.firstChild === eventDiv) {
                events.removeChild(eventDiv);
            }
        }, 5000);
    }

    function manageDisasters() {
        if (Math.random() < 0.01) {
            const disasters = ['Épidémie', 'Inondation', 'Invasion Alien', 'Trou Noir', 'Supernova'];
            const disaster = disasters[Math.floor(Math.random() * disasters.length)];
            const loss = Math.floor(count * 0.1);
            count -= loss;
            updateDisplay();
            showEvent(`${disaster} ! -${Math.floor(loss).toLocaleString()} personnes`);
        }
    }

    function formatNumber(num) {
        return Math.floor(num).toLocaleString(); // Juste le nombre formaté avec séparateurs de milliers
    }

    function updateDisplay() {
        counter.textContent = formatNumber(count);
        perSecondDisplay.textContent = formatNumber(autoClickValue * (1 + (cellCloningActive ? cellCloningMultiplier : 0) + (neuralNetworkActive ? neuralNetworkMultiplier : 0)));
        checkAchievements();
    }

    function updateCount() {
        count += autoClickValue;
        if (cellCloningActive) {
            count += autoClickValue * cellCloningMultiplier;
        }
        if (neuralNetworkActive) {
            count += autoClickValue * neuralNetworkMultiplier;
        }
        updateDisplay();
    }

    function checkAchievements() {
        for (let achievement in achievements) {
            if (!achievements[achievement]) {
                switch (achievement) {
                    case 'First Click':
                        if (count > 0) {
                            achievements[achievement] = true;
                            trophyCount++;
                            trophyCounter.textContent = trophyCount;
                            addAchievement(achievement, 'Clicqué pour la première fois !');
                            playAchievementSound();
                        }
                        break;
                    case 'Thousand Citizens':
                        if (count >= 1000) {
                            achievements[achievement] = true;
                            trophyCount++;
                            trophyCounter.textContent = trophyCount;
                            addAchievement(achievement, 'Atteint 1,000 citoyens.');
                            playAchievementSound();
                        }
                        break;
                    // Ajoutez ici les conditions pour chaque niveau de population (Million, Billion, etc.)
                    default:
                        let targetNumber = parseInt(achievement.split('illionaire')[0]);
                        if (targetNumber && count >= Math.pow(10, (targetNumber * 3) + 3)) {
                            achievements[achievement] = true;
                            trophyCount++;
                            trophyCounter.textContent = trophyCount;
                            addAchievement(achievement, `Atteint ${achievement.toLowerCase().replace('aire', '')}.`);
                            playAchievementSound();
                        }
                }
            }
        }
    }

    function addAchievement(name, description) {
        let achievementDiv = document.createElement('div');
        achievementDiv.className = 'achievement';
        achievementDiv.innerHTML = `<strong>${name}</strong><br>${description}`;
        achievementsList.appendChild(achievementDiv);
    }

    function upgradeHandler(button, cost, gain) {
        if (count >= cost && !button.classList.contains('disabled')) {
            count -= cost;
            updateDisplay();
            if (button.id === 'doubleClicks') {
                clickValue = 2;
            } else if (button.id === 'populationExplosion') {
                count *= 2;
                updateDisplay();
                button.textContent = "Explosion Utilisée";
            } else if (button.id === 'buyBoost') {
                clickValue *= 2;
                boostCount++;
                setTimeout(() => {
                    clickValue = Math.max(1, clickValue / 2);
                    boostCount--;
                }, 60000);
            } else if (button.id === 'cellCloning') {
                cellCloningActive = true;
                cellCloningMultiplier = 1;
            } else if (button.id === 'neuralNetwork') {
                neuralNetworkActive = true;
                neuralNetworkMultiplier = 1;
            } else {
                autoClickValue += gain;
            }
            button.textContent = `${button.textContent} Activé`;
            button.classList.add('disabled');
            button.style.backgroundColor = '#cccccc';
            document.getElementById(button.id + 'Cost').textContent = "Coût: Acheté";
            showEvent(`${button.textContent} activé !`, 'green');
        } else if (count < cost) {
            showEvent("Population insuffisante pour acheter cette amélioration.", 'orange');
        } else if (button.id === 'buyBoost' && boostCount >= MAX_BOOSTS) {
            showEvent('Limite de boosts atteinte !', 'orange');
        }
    }

    function revealCost(buttonId) {
        const costElement = document.getElementById(buttonId + 'Cost');
        if (costElement && costElement.textContent === "Coût: ???") {
            const costs = {
                doubleClicks: 100,
                maternity: 500,
                populationExplosion: 5000,
                immigration: 10000,
                education: 2000,
                tourism: 100000,
                buyBoost: 10000,
                grandma: 100,
                farm: 1000,
                factory: 10000,
                bank: 100000,
                portal: 1000000,
                timeMachine: 10000000,
                antimatterCondenser: 100000000,
                cellCloning: 1000000000,
                neuralNetwork: 10000000000
            };
            costElement.textContent = `Coût: ${formatNumber(costs[buttonId])}`;
        }
    }

    function playClickSound() {
        if (isClickSoundEnabled) {
            const clickSound = new Audio('click.aac');
            clickSound.play();
        }
    }

    function playAchievementSound() {
        const achievementSound = new Audio('trophee.aac');
        achievementSound.play();
    }

    function toggleSound(button, soundType) {
        if (soundType === 'click') {
            isClickSoundEnabled = !isClickSoundEnabled;
            button.textContent = isClickSoundEnabled ? 'Son' : 'Son';
            button.classList.toggle('active', isClickSoundEnabled);
            button.classList.toggle('inactive', !isClickSoundEnabled);
        } else if (soundType === 'music') {
            isBackgroundMusicEnabled = !isBackgroundMusicEnabled;
            if (isBackgroundMusicEnabled) {
                backgroundMusic.play();
            } else {
                backgroundMusic.pause();
            }
            button.textContent = isBackgroundMusicEnabled ? 'Musique' : 'Musique';
            button.classList.toggle('active', isBackgroundMusicEnabled);
            button.classList.toggle('inactive', !isBackgroundMusicEnabled);
        }
    }

    function createFloatingText(value, x, y) {
        const floatingText = document.createElement('div');
        floatingText.textContent = `+${value}`;
        floatingText.style.position = 'absolute';
        floatingText.style.left = `${x}px`;
        floatingText.style.top = `${y}px`;
        floatingText.style.color = 'green';
        floatingText.style.fontSize = '20px';
        floatingText.style.fontWeight = 'bold';
        floatingText.style.pointerEvents = 'none';
        floatingText.style.transition = 'all 1s ease-out';
        document.body.appendChild(floatingText);

        setTimeout(() => {
            floatingText.style.opacity = 0;
            floatingText.style.transform = 'translateY(-50px)';
        }, 0);

        setTimeout(() => {
            document.body.removeChild(floatingText);
        }, 1000);
    }

    if (clicker && counter) {
        clicker.addEventListener('click', function(event) {
            count += clickValue;
            updateDisplay();
            playClickSound();

            createFloatingText(clickValue, event.clientX, event.clientY);

            const thresholds = [100, 500, 5000, 10000, 2000, 100000, 10000, 100, 1000, 10000, 100000, 1000000, 1e7, 1e10, 1e13, 1e16, 1e19, 1e22, 1e25, 1e28, 1e31, 1e9, 1e10];
            const buttons = ['doubleClicks', 'maternity', 'populationExplosion', 'immigration', 'education', 'tourism', 'buyBoost', 'grandma', 'farm', 'factory', 'bank', 'portal', 'timeMachine', 'antimatterCondenser', 'cellCloning', 'neuralNetwork'];
            
            buttons.forEach((buttonId, index) => {
                const button = document.getElementById(buttonId);
                if (count >= thresholds[index] && !button.classList.contains('show')) {
                    button.classList.add('show');
                    revealCost(buttonId);
                }
            });
        });
    }

    // Gestion des boutons d'amélioration
    const buttons = ['doubleClicks', 'maternity', 'populationExplosion', 'immigration', 'education', 'tourism', 'buyBoost', 'grandma', 'farm', 'factory', 'bank', 'portal', 'timeMachine', 'antimatterCondenser', 'cellCloning', 'neuralNetwork'];

    buttons.forEach((buttonId, index) => {
        const button = document.getElementById(buttonId);
        button.addEventListener('click', function() {
            const costs = {
                doubleClicks: 100,
                maternity: 500,
                populationExplosion: 5000,
                immigration: 10000,
                education: 2000,
                tourism: 100000,
                buyBoost: 10000,
                grandma: 100,
                farm: 1000,
                factory: 10000,
                bank: 100000,
                portal: 1000000,
                timeMachine: 10000000,
                antimatterCondenser: 100000000,
                cellCloning: 1000000000,
                neuralNetwork: 10000000000
            };
            let cost = costs[buttonId];
            let gain = 0; // Par défaut, on met le gain à 0

            switch (buttonId) {
                case 'doubleClicks': 
                    gain = 0; // Pas de gain ici, l'effet est sur clickValue
                    break;
                case 'maternity':
                    gain = 5; // Ajoute 5 personnes par seconde
                    break;
                case 'populationExplosion':
                    gain = 0; // L'effet est géré dans upgradeHandler
                    break;
                case 'immigration':
                    gain = 20; // 20 personnes par seconde
                    break;
                case 'education':
                    gain = 0; // Pas de gain ici, l'effet est sur clickValue
                    break;
                case 'tourism':
                    gain = 100; // 100 personnes par seconde
                    break;
                case 'buyBoost':
                    gain = 0; // L'effet est géré dans upgradeHandler
                    break;
                case 'grandma':
                    gain = 1; // 1 personne par seconde
                    break;
                case 'farm':
                    gain = 10; // 10 personnes par seconde
                    break;
                case 'factory':
                    gain = 100; // 100 personnes par seconde
                    break;
                case 'bank':
                    gain = 1000; // 1000 personnes par seconde
                    break;
                case 'portal':
                    gain = 10000; // 10000 personnes par seconde
                    break;
                case 'timeMachine':
                    gain = 100000; // 100000 personnes par seconde
                    break;
                case 'antimatterCondenser':
                    gain = 1000000; // 1 million de personnes par seconde
                    break;
                case 'cellCloning':
                    gain = 0; // L'effet est géré dans upgradeHandler
                    break;
                case 'neuralNetwork':
                    gain = 0; // L'effet est géré dans upgradeHandler
                    break;
                default:
                    gain = Math.pow(10, index + 1) * 10; // Si jamais une nouvelle amélioration n'a pas de gain spécifique
            }

            upgradeHandler(this, cost, gain);
        });
    });

    // Initialiser les boutons avec la classe correcte pour la couleur
    toggleClickSoundButton.classList.add(isClickSoundEnabled ? 'active' : 'inactive');
    toggleBackgroundMusicButton.classList.add(isBackgroundMusicEnabled ? 'active' : 'inactive');

    toggleClickSoundButton.addEventListener('click', () => toggleSound(toggleClickSoundButton, 'click'));
    toggleBackgroundMusicButton.addEventListener('click', () => toggleSound(toggleBackgroundMusicButton, 'music'));

    if (isBackgroundMusicEnabled) {
        backgroundMusic.play();
    }

    // Ajout d'événements cosmiques
    setInterval(() => {
        if (Math.random() < 0.005) {
            const cosmicEvents = ['Éruption Solaire', 'Collision de Météorite', 'Expansion de l\'Univers', 'Fusion Galactique'];
            const event = cosmicEvents[Math.floor(Math.random() * cosmicEvents.length)];
            const bonus = Math.floor(count * 0.05);
            count += bonus;
            updateDisplay();
            showEvent(`${event} ! +${formatNumber(bonus)} personnes`, 'blue');
        }
    }, 30000);

    disasterInterval = setInterval(manageDisasters, 10000);
    setInterval(updateCount, 1000); // Met à jour la population chaque seconde pour les gains automatiques
});