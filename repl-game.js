const prompt = require('readline-sync');

const npc = {

    grunt: {
        maxHP: 5,
        health: 5,
        name: "grunt",
        damageGun: function (){return randNum(1,3);},
        takeTurn: function(){
            let dmg = this.damageGun();
            player.health = player.health - dmg;
            console.log(`***The grunt fires a round with a plasma pistol***\n***You take ${dmg} damage***`);
        },
        reset: function() {this.health = this.maxHP;}
    },
    brute: {
        maxHP: 10,
        health: 10,
        name: "brute",
        damageGun: function (){return randNum(1,5);},
        damageMele: function (){return randNum(2,8);},
        takeTurn: function(){
            let dmg;
            if(this.health < (this.maxHP/2)){
                dmg = this.damageMele();
                player.health = player.health - dmg;
                console.log("***The brute screams and charges at you with its bear hands***");
                console.log(`***You take ${dmg} damage***`);
            } else{
                dmg = this.damageGun();
                player.health = player.health - dmg;
                console.log("***The brute shoots at you with a bruteshot***");
                console.log(`***You take ${dmg} damage***`);
            }
        },
        reset: function() {this.health = this.maxHP;}
    },
    hunter: {
        maxHP: 15,
        health: 15,
        name: "hunter",
        damageGun: function (){return randNum(3, 6);},
        damageMele: function (){return randNum(3, 10)},
        takeTurn: function(){
            let dmg;
            if(this.health < (this.maxHP/2)){
                dmg = this.damageMele();
                player.health = player.health - dmg;
                console.log("***The hunter barrels towards you and swings its shelid at you***");
                console.log(`***You take ${dmg} damage***`);
            } else{
                dmg = this.damageGun();
                player.health = player.health - dmg;
                console.log("***The hunter levels its cannon and shoots at you***");
                console.log(`***You take ${dmg} damage***`);
            }
        },
        reset: function() {this.health = this.maxHP;
        }
    }
}


const player = {
    maxHP: 200,
    health: 20,
    grenades: 2,
    healthPacks: 1,
    damageGun: function (){return randNum(1, 3);},
    damageGrenade: function (){return randNum(2, 7);},
    reset: function() {
        this.health = this.maxHP;
        this.grenades = 2;
        this.healthPacks = 1;
    },
    printStats: function (){
        console.log('-'.repeat(40));
        console.log(`HP: ${this.health} | Grenades: ${this.grenades} | Health Packs: ${this.healthPacks}`);
        console.log('-'.repeat(40));
    },
    useHealthpack: function (){
        if(player.healthPacks > 0){
            player.health = this.maxHP;
            player.healthPacks--;
            console.log("***Your health is fully restored***")
        }
        else{
            console.log("***You don't have any health packs***");
        }
    }
}

//console.log( "Halo: ODST" );

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
while(stillPlaying){
    console.log(phase);
    switch(phase){
        case 1:
            printLevel(phase);
            phase = phase + level(npc.grunt, phase);
            break;
        case 2:
            printLevel(phase);
            phase = phase + level(npc.brute, phase);
            break;  
        case 3:
            printLevel(phase);
            phase = phase + level(npc.hunter, phase);
            break;
        default:
            if(prompt.keyInYN("Do you want to keep playing?")){
                phase = 1;
                resetGame();
            } else{
                stillPlaying = false;
            }        
            break;
    }
}

//phase 1: grunt fight
function level(enemy, level){
    quitGame = false;
    while(!quitGame){
        player.printStats();
        console.log( "What do you want to do?");
        let option = prompt.questionInt( "Options:\n [1] Shoot\n [2] Throw grenade\n [3] Verbally abuse\n [4] Use health pack\n [5] Search for supplies\n [6] Quit level\n" );
        
        let hit= 0;
        //players turn
        switch(option) {
            //Shoot
            case 1:
                hit = enemy.damageGun();
                enemy.health = enemy.health - hit;
                console.log(`***You shoot at the ${enemy.name} with your assault rifle***`);
                console.log(`***The grunt takes ${hit} damage***`);
                break;
            //throw grenade
            case 2:
                if(player.grenades > 0){
                    hit = player.damageGrenade();
                    enemy.health = enemy.health - hit;
                    player.grenades--;
                    console.log(`***You throw a grenade at the ${enemy.name}***`);
                    console.log(`***The grunt takes ${hit} damage***`);
                }
                else{
                    console.log("***You don't have any grenades***");
                }          
                break;
            //Verbally abuse
            case 3:
                console.log(`***You yell insults about the grunt's height***\n***The grunt has been conditioned by adolescent bullying and takes no damage***`);
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
              console.log( "Incorrect input, try again." );
        }

        if(enemy.health <= 0) {
            console.log(`***You killed the ${enemy.name}***`)
            return 1; // move to next phase
        }

        //Grunts turn
        enemy.takeTurn();

        if(player.health <= 0){
            console.log(`***You died, I guess you don't have what it takes to be an ODST***`);
            printLevel(4);
            return -100; //get to default branch in the loop
        }
    }
}

// //phase 2: Brute fight
// function phase2(){
//     quitGame = false;
//     while(!quitGame){
//         player.printStats();
//         console.log( "What do you want to do?");
//         let option = prompt.questionInt( "Options:\n [1] Shoot\n [2] Throw grenade\n [3] Verbally abuse\n [4] Use Medkit\n [5] Search for Supplies\n [6] Quit Level\n" );
//         let hit= 0;

//         //players turn
//         switch(option) {
//             //Shoot
//             case 1:
//                 hit = player.damageGun();
//                 brute.health = brute.health - hit;
//                 console.log(`***You shoot at the brute with your assault rifle***`);
//                 console.log(`***The brute takes ${hit} damage***`);
//                 break;
//             //throw grenade
//             case 2:
//                 if(player.grenades > 0){
//                     hit = player.damageGrenade();
//                     brute.health = brute.health - hit;
//                     player.grenades--;
//                     console.log(`***You throw a grenade at the brute***`);
//                     console.log(`***The brute takes ${hit} damage***`);
//                 }
//                 else{
//                     console.log("***You don't have any grenades***");
//                 }          
//                 break;
//             //Verbally abuse
//             case 3:
//                 brute.health = brute.health -1;
//                 console.log(`***You yell that he brute isn't as cool as he thinks he is***\n***The brute pretends it doesn't hurt him but takes 1 damage***`);
//               break;
//             //Use Medkit
//             case 4:
//                 player.useHealthpack();
//                 break;
//             case 5:
//                 suppliesCheck();
//                 break;
//             case 6:
//                 console.log("Quiting game.")
//                 return -100;
//             default: 
//               console.log( "Incorrect input, try again." );
//         }

//         //burte is dead
//         if(brute.health <= 0) {
//             console.log(`***You killed the brute***`)
//             return 1; // move to next phase
//         }

//         //brutes turn
//         brute.takeTurn();

//         //Player died
//         if(player.health <= 0){
//             console.log(`***You died, I guess you don't have what it takes to be an ODST***`);
//             printLevel(4);
//             return -100; //get to default branch in the loop
//         }
//     }
// }


// //phase 3: hunter fight
// function phase3(){
//     quitGame = false;
//     while(!quitGame){
//         player.printStats();
//         console.log( "What do you want to do?");
//         let option = prompt.questionInt( "Options:\n [1] Shoot\n [2] Throw grenade\n [3] Verbally abuse\n [4] Use Medkit\n [5] Search for Supplies\n [6] Quit Level\n" );
//         console.log("\n");
//         let hit= 0;

//         //players turn
//         switch(option) {
//             //Shoot
//             case 1:
//                 hit = player.damageGun();
//                 hunter.health = hunter.health - hit;
//                 console.log(`***You shoot at the hunter with your assault rifle***`);
//                 console.log(`***The hunter takes ${hit} damage***`);
//                 break;
//             //throw grenade
//             case 2:
//                 if(player.grenades > 0){
//                     hit = player.damageGrenade();
//                     hunter.health = hunter.health - hit;
//                     player.grenades--;
//                     console.log(`***You throw a grenade at the hunter***`);
//                     console.log(`***The hunter takes ${hit} damage***`);
//                 }
//                 else{
//                     console.log("***You don't have any grenades***");
//                 }          
//                 break;
//             //Verbally abuse
//             case 3:
//                 hunter.health = hunter.health - 5;
//                 console.log(`***You yell profanities about the hunter's mother***\n***The hunter is shocked and takes 5 damage***`);
//                 break;
//             //Use health packs
//             case 4:
//                 player.useHealthpack();
//                 break;
//             case 5:
//                 suppliesCheck();
//                 break;
//             case 6:
//                 console.log("Quiting game")
//                 return -100;
//             default: 
//               console.log( "Incorrect input, try again." );
//         }

//         //hunter died
//         if(hunter.health <= 0) {
//             console.log(`***You killed the Hunter***`)
//             return 1; // move to next phase
//         }

//         //Hunters turn
//         hunter.takeTurn();

//         //Player died
//         if(player.health <= 0){
//             console.log(`***You died, I guess you don't have what it takes to be an ODST***`);
//             printLevel(4);
//             return -100; //get to default branch in the loop
//         }
//     }
// }

// randomly gives the player a grenade, healthpack, or nothing.
function suppliesCheck(){
    let chanceNumer = Math.floor(Math.random() * (8 - 1)) + 1;

//    console.log(chanceNumer)
  
    if(chanceNumer === 1){
        console.log("You find a healthpack.");
        player.healthPacks++;
    }else if(chanceNumer === 2 ){
        console.log("You find a grenade.");
        player.grenades++;
    }else if(chanceNumer === 3){
        console.log("You find a healthpack and a grenade.");
        player.healthPacks++;
        player.grenades++;
    } else{
        console.log("You look around but you don't see anything.");
    }
}


//prints the level title
function printLevel(level){
    switch(level){
        case 1:
            console.log(`
                +-+-+-+-+-+ +-+-+ +-+-+-+-+-+ +-+-+-+-+-+
                |L|e|v|e|l| |1|:| |G|r|u|n|t| |P|u|n|c|h|
                +-+-+-+-+-+ +-+-+ +-+-+-+-+-+ +-+-+-+-+-+
            `);
            console.log("\n***You see a grunt taking a nap next to a tree***\n");
            break;
        case 2:
            console.log(`
                +-+-+-+-+-+ +-+-+ +-+-+-+-+-+ +-+-+-+-+-+
                |L|e|v|e|l| |2|:| |B|r|u|t|e| |F|o|r|c|e|
                +-+-+-+-+-+ +-+-+ +-+-+-+-+-+ +-+-+-+-+-+
            `);
            console.log("\n***You move to the body of the dead grunt and confirm the kill***")
            console.log("***You make your way down the street slowly ducking bewteen covers making your way to the objective***")
            console.log("***You see a brute standing outside the entrance of the building***\n");
            break;
        case 3:
            console.log(`            
                +-+-+-+-+-+ +-+-+ +-+-+-+ +-+-+-+-+-+-+
                |L|e|v|e|l| |3|:| |T|h|e| |H|u|n|t|e|d|
                +-+-+-+-+-+ +-+-+ +-+-+-+ +-+-+-+-+-+-+
            `);
            console.log("\n***As you finish off the brute, A hunter bursts through the entrance of the building and shrieks***\n");
            break;
        default:
            console.log(`
                        +-+-+-+-+ +-+-+-+-+-+
                        |G|a|m|e| |O|v|e|r|!|
                        +-+-+-+-+ +-+-+-+-+-+            
            `);
            break;
    }
}

function randNum(min, max){
    return Math.floor(Math.random() * (max - min) ) + min;
}

function resetGame(){
    player.reset();
    grunt.reset();
    brute.reset();
    hunter.reset();
}
