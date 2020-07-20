const prompt = require('readline-sync');

const npc = {
    grunt: {
        maxHP: 5,
        health: 5,
        name: "grunt",
        damageGun: function () { return randNum(1, 3); },
        takeTurn: function () {
            let dmg = this.damageGun();
            player.health = player.health - dmg;
            console.log(`***The grunt fires a round with a plasma pistol***\n***You take ${dmg} damage***`);
        },
        reset: function () { this.health = this.maxHP; }
    },
    brute: {
        maxHP: 10,
        health: 10,
        name: "brute",
        damageGun: function () { return randNum(3, 6); },
        damageMele: function () { return randNum(4, 10); },
        takeTurn: function () {
            let dmg;
            if (this.health < (this.maxHP / 2)) {
                dmg = this.damageMele();
                player.health = player.health - dmg;
                console.log("***The brute screams and charges at you with its bear hands***");
                console.log(`***You take ${dmg} damage***`);
            } else {
                dmg = this.damageGun();
                player.health = player.health - dmg;
                console.log("***The brute shoots at you with a bruteshot***");
                console.log(`***You take ${dmg} damage***`);
            }
        },
        reset: function () { this.health = this.maxHP; }
    },
    hunter: {
        maxHP: 15,
        health: 15,
        name: "hunter",
        damageGun: function () { return randNum(3, 9); },
        damageMele: function () { return randNum(5, 13) },
        takeTurn: function () {
            let dmg;
            if (this.health < (this.maxHP / 2)) {
                dmg = this.damageMele();
                player.health = player.health - dmg;
                console.log("***The hunter barrels towards you and swings its shelid at you***");
                console.log(`***You take ${dmg} damage***`);
            } else {
                dmg = this.damageGun();
                player.health = player.health - dmg;
                console.log("***The hunter levels its cannon and shoots at you***");
                console.log(`***You take ${dmg} damage***`);
            }
        },
        reset: function () {
            this.health = this.maxHP;
        }
    }
}

const player = {
    maxHP: 20,
    health: 20,
    grenades: 2,
    healthPacks: 1,
    damageGun: function () { return randNum(1, 3); },
    damageGrenade: function () { return randNum(2, 7); },
    reset: function () {
        this.health = this.maxHP;
        this.grenades = 2;
        this.healthPacks = 1;
    },
    damageVerbal: function (enemy) {
        if (enemy.name === "grunt") {
            console.log(`***You yell insults about the grunt's height***`);
            console.log(`***The grunt has been conditioned by adolescent bullying and takes no damage***`);
        }
        else if (enemy.name === "brute") {
            enemy.health = enemy.health - 1;
            console.log(`***You yell that the brute isn't as cool as he thinks he is***`);
            console.log(`***The brute pretends it doesn't hurt him but takes 1 damage***`);
        }
        else if (enemy.name === "hunter") {
            enemy.health = enemy.health - 5;
            console.log(`***You yell profanities about the hunter's mother***`);
            console.log(`***The hunter is shocked and takes 5 damage***`);
        }
        else {
            console.log("Unknow enemy!");
        }
    },
    printStats: function () {
        console.log('-'.repeat(40));
        console.log(`HP: ${this.health} | Grenades: ${this.grenades} | Health Packs: ${this.healthPacks}`);
        console.log('-'.repeat(40));
    },
    useHealthpack: function () {
        if (player.healthPacks > 0) {
            player.health = this.maxHP;
            player.healthPacks--;
            console.log("***Your health is fully restored***")
        }
        else {
            console.log("***You don't have any health packs***");
        }
    }
}

console.log(`
 __    __       ___       __        ______           ______    _______       _______.___________.
|  |  |  |     /   \\     |  |      /  __  \\   _     /  __  \\  |       \\     /       |           |
|  |__|  |    /  ^  \\    |  |     |  |  |  | (_)   |  |  |  | |  .--.  |   |   (----\`---|  |----\`
|   __   |   /  /_\\  \\   |  |     |  |  |  |       |  |  |  | |  |  |  |    \\   \\       |  |     
|  |  |  |  /  _____  \\  |  \`----.|  \`--'  |  _    |  \`--'  | |  '--'  |.----)   |      |  |     
|__|  |__| /__/     \\__\\ |_______| \\______/  (_)    \\______/  |_______/ |_______/       |__|                                                                                                     
`);

let stillPlaying = true;
let phase = 1;

//Main game logic
while (stillPlaying) {
    switch (phase) {
        case 1:
            printLevel(phase);
            phase = phase + level(npc.grunt);
            break;
        case 2:
            printLevel(phase);
            phase = phase + level(npc.brute);
            break;
        case 3:
            printLevel(phase);
            phase = phase + level(npc.hunter);
            break;
        case 4:
            printLevel(phase);
        default:
            let ask = true;
            while(ask){
                let input = prompt.keyInYN("Do you want to stop playing?");
                if (input === '') {
                    console.log("Bad input!");
                } else if(!input){
                    stillPlaying = false;
                    ask= false;                }
                else{
                    phase = 1;
                    resetGame();
                    ask= false;
                }
            }
            break;
    }
}

//level structures
function level(enemy) {
    quitGame = false;
    while (!quitGame) {
        console.log("");

        player.printStats();
        console.log("What do you want to do?");
        let option = prompt.questionInt("Options:\n [1] Shoot\n [2] Throw grenade\n [3] Verbally abuse\n [4] Use health pack\n [5] Search for supplies\n [6] Quit level\n");
        
        console.log("");
        
        let hit = 0;
        //players turn
        switch (option) {
            //Shoot
            case 1:
                hit = enemy.damageGun();
                enemy.health = enemy.health - hit;
                console.log(`***You shoot at the ${enemy.name} with your assault rifle***`);
                console.log(`***The ${enemy.name} takes ${hit} damage***`);
                break;
            //throw grenade
            case 2:
                if (player.grenades > 0) {
                    hit = player.damageGrenade();
                    enemy.health = enemy.health - hit;
                    player.grenades--;
                    console.log(`***You throw a grenade at the ${enemy.name}***`);
                    console.log(`***The ${enemy.name} takes ${hit} damage***`);
                }
                else {
                    console.log("***You don't have any grenades***");
                }
                break;
            //Verbally abuse
            case 3:
                player.damageVerbal(enemy)
            break;
            //Use Medkit
            case 4:
                player.useHealthpack();
                break;
            //Search for supplies
            case 5:
                suppliesCheck();
                break;
            //Quit game
            case 6:
                console.log("Quiting game")
                return -100;
            default:
                console.log("Incorrect input, try again.");
        }

        //checks if enemy is killed
        if (enemy.health <= 0) {
            console.log(`***You killed the ${enemy.name}***`)
            return 1; // move to next phase
        }

        //enemys turn
        enemy.takeTurn();

        //check if player died
        if (player.health <= 0) {
            console.log(`***You died, I guess you don't have what it takes to be an ODST***`);
            printLevel(4);
            return -100; //get to default branch in the loop
        }
    }
}

// randomly gives the player a grenade, healthpack, or nothing.
function suppliesCheck() {
    let chanceNumer = Math.floor(Math.random() * (8 - 1)) + 1;
    if (chanceNumer === 1) {
        console.log("***You find a healthpack***");
        player.healthPacks++;
    } else if (chanceNumer === 2) {
        console.log("***You find a grenade***");
        player.grenades++;
    } else if (chanceNumer === 3) {
        console.log("***You find a healthpack and a grenade***");
        player.healthPacks++;
        player.grenades++;
    } else {
        console.log("***You look around but you don't see anything***");
    }
}

//prints the level title
function printLevel(level) {
    switch (level) {
        case 1:
            console.log(`
                +-+-+-+-+-+ +-+-+ +-+-+-+-+-+ +-+-+-+-+-+
                |L|e|v|e|l| |1|:| |G|r|u|n|t| |P|u|n|c|h|
                +-+-+-+-+-+ +-+-+ +-+-+-+-+-+ +-+-+-+-+-+
            `);
            console.log("\n***You drop down from your ship and land alone behind enemy lines***");
            console.log("***Your mission is to rescue a stranded ONI politician***");
            console.log("***You look around and see a grunt taking a nap next to a tree***");
            break;
        case 2:
            console.log(`
                +-+-+-+-+-+ +-+-+ +-+-+-+-+-+ +-+-+-+-+-+
                |L|e|v|e|l| |2|:| |B|r|u|t|e| |F|o|r|c|e|
                +-+-+-+-+-+ +-+-+ +-+-+-+-+-+ +-+-+-+-+-+
            `);
            console.log("\n***You move to the body of the dead grunt and confirm the kill***")
            console.log("***You make your way down the street slowly ducking bewteen covers making your way to the objective***")
            console.log("***You see a brute standing outside the entrance of the last know location of the politician***");
            break;
        case 3:
            console.log(`            
                +-+-+-+-+-+ +-+-+ +-+-+-+ +-+-+-+-+-+-+
                |L|e|v|e|l| |3|:| |T|h|e| |H|u|n|t|e|d|
                +-+-+-+-+-+ +-+-+ +-+-+-+ +-+-+-+-+-+-+
            `);
            console.log("***As you finish off the brute, A hunter bursts through the entrance of the building and shrieks***");
            break;
        case 4:
            console.log(`
            +-+-+-+-+ +-+-+-+-+-+
            |G|a|m|e| |O|v|e|r|!|
            +-+-+-+-+ +-+-+-+-+-+            
            `);
            break;
        default:
            console.log("***You search the building and find the politician in his office hiding under his desk***");
            console.log("***You and the politician escape and make it back to base***");
            console.log(` 
                +-+-+-+-+-+-+-+ +-+-+-+-+-+-+-+-+-+
                |M|i|s|s|i|o|n| |C|o|m|p|l|e|t|e|!|
                +-+-+-+-+-+-+-+ +-+-+-+-+-+-+-+-+-+
                `)
            break;
    }
}

function randNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function resetGame() {
    player.reset();
    npc.grunt.reset();
    npc.brute.reset();
    npc.hunter.reset();
}
