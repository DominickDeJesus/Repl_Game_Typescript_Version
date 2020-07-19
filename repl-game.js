const prompt = require('readline-sync');

//character objects
const grunt = {
    health: 5,
    damageGun: function (){return(Math.floor((Math.random()*2)+1));},
    reset: function() {this.health = 5;}
}

const brute = {
    health: 10,
    damageGun: function (){return(Math.floor((Math.random()*5)+1));},
    damageMele: function (){return(Math.floor((Math.random()*8)+1));},
    reset: function() {this.health = 10;}
}


const hunter = {
    health: 15,
    damageGun: function (){return(Math.floor((Math.random()*6)+1));},
    damageMele: function (){return(Math.floor((Math.random()*10)+1));},
    reset: function() {
        this.health = 15;
    }
}

const player = {
    health: 10,
    grenades: 2,
    healthPacks: 1,
    damageGun: function (){return(Math.floor((Math.random()*3)+1));},
    damageGrenade: function (){return(Math.floor((Math.random()*7)+2));},
    reset: function() {
        this.health = 10;
        this.grenades = 2;
        this.healthPacks = 1;
    },
    printStats: function (){
        console.log('-'.repeat(40));
        console.log(`HP: ${this.health} | Grenades: ${this.grenades} | Health Packs: ${this.healthPacks}`);
        console.log('-'.repeat(40));
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
            phase = phase + phase1();
            break;
        case 2:
            printLevel(phase);
            phase = phase + phase2();
            break;  
        case 3:
            printLevel(phase);
            phase = phase + phase3();
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
function phase1(){
    console.log("***You see a grunt taking a nap next to a tree***\n");
    quitGame = false;
    while(!quitGame){
        player.printStats();
        console.log( "What do you want to do?");
        let option = prompt.questionInt( "Options:\n [1] Shoot\n [2] Throw grenade\n [3] Verbally abuse\n [4] Use Medkit\n [5] Search for Supplies\n [6] Quit Level\n" );
        console.log("\n");
        let hit= 0;

        //players turn
        switch(option) {
            //Shoot
            case 1:
                hit = player.damageGun();
                grunt.health = grunt.health - hit;
                console.log(`***You shoot at the grunt with your assault rifle***`);
                console.log(`***The grunt takes ${hit} damage***`);
                break;
            //throw grenade
            case 2:
                if(player.grenades > 0){
                    hit = player.damageGrenade();
                    grunt.health = grunt.health - hit;
                    player.grenades--;
                    console.log(`***You throw a grenade at the grunt***`);
                    console.log(`***The grunt takes ${hit} damage***`);
                }
                else{
                    console.log("***You don't have any grenades***");
                }          
                break;
            //Verbally abuse
            case 3:
                grunt.health = grunt.health - 1;
                console.log(`***You yell explatives about the grunt's mother***\n***The grunt takes 1 damage***`);
                break;
            //Use Medkit
            case 4:
                if(player.healthPacks > 0){
                    player.health = 10;
                    player.healthPacks--;
                    console.log("***Your health is fully restored***")
                }
                else{
                    console.log("***You are already at full health***");
                }
                break;
            case 5:
                suppliesCheck();
                break;
            case 6:
                console.log("Quiting game")
                return -100;
            default: 
              console.log( "Incorrect input, try again." );
        }

        if(grunt.health <= 0) {
            console.log(`***You killed the grunt***`)
            return 1; // move to next phase
        }

        //Grunts turn
        hit = grunt.damageGun();
        player.health = player.health - hit;
        console.log(`***Grunt fires a round with a plasma pistol***\n***You take ${hit} damage***`);

        if(player.health <= 0){
            console.log(`***You died, I guess you don't have what it takes to be an ODST***`);
            return -100; //get to default branch in the loop
        }
    }
}

//phase 2: elite fight
function phase2(){
    console.log("***You move to the body of the dead grunt and confirm the kill***")
    console.log("***You make your way down the street slowly ducking bewteen covers making your way to the objective***")
    console.log("***You see a brute standing outside the entrance of the building***");
    quitGame = false;
    while(!quitGame){
        player.printStats();
        console.log( "What do you want to do?");
        let option = prompt.questionInt( "Options:\n [1] Shoot\n [2] Throw grenade\n [3] Verbally abuse\n [4] Use Medkit\n [5] Search for Supplies\n [6] Quit Level\n" );
        let hit= 0;

        //players turn
        switch(option) {
            //Shoot
            case 1:
                hit = player.damageGun();
                brute.health = brute.health - hit;
                console.log(`***You shoot at the brute with your assault rifle***`);
                console.log(`***The brute takes ${hit} damage***`);
                break;
            //throw grenade
            case 2:
                if(player.grenades > 0){
                    hit = player.damageGrenade();
                    brute.health = brute.health - hit;
                    player.grenades--;
                    console.log(`***You throw a grenade at the grunt***`);
                    console.log(`The brute takes ${hit} damage`);
                }
                else{
                    console.log("***You don't have any grenades***");
                }          
                break;
            //Verbally abuse
            case 3:
              console.log(`***You yell explatives about the grunt's mother inflicting critical damage to moral***`);
              brute.health = brute.health -1;
              break;
            //Use Medkit
            case 4:
                if(player.healthPacks > 0){
                    player.health = 10;
                    player.healthPacks--;
                    console.log("***Your health is fully restored***")
                }
                else{
                    console.log("***You are already at full health***");
                }
                break;
            case 5:
                suppliesCheck();
                break;
            case 6:
                console.log("Quiting game.")
                return -100;
            default: 
              console.log( "Incorrect input, try again." );
        }

        //burte is dead
        if(brute.health <= 0) {
            console.log(`***You killed the brute***`)
            return 1; // move to next phase
        }

        //Grunts turn
        if(brute.health < brute.health/2){
            hit = brute.damageMele();
            console.log("***The brute screams and charges at you with its bear hands***");
            console.log(`***You take ${hit} damage***`);
        } else{
            hit = brute.damageGun();
            console.log("***The brute shoots at you with a bruteshot***");
            console.log(`***You take ${hit} damage***`);
        }
        
        //Player died
        if(player.health <= 0){
            console.log(`***You died, I guess you don't have what it takes to be an ODST***`);
            return -100; //get to default branch in the loop
        }
    }
}


//phase 3: hunter fight
function phase3(){
    console.log("You see a grunt taking a nap next to a tree.");
    quitGame = false;
    while(!quitGame){
        player.printStats();
        console.log( "What do you want to do?");
        let option = prompt.questionInt( "Options:\n [1] Shoot\n [2] Throw grenade\n [3] Verbally abuse\n [4] Use Medkit\n [5] Search for Supplies\n [6] Quit Level\n" );
        let hit= 0;

        //players turn
        switch(option) {
            //Shoot
            case 1:
                hit = player.damageGun();
                grunt.health = grunt.health - hit;
                console.log(`The grunt takes ${hit} damage`);
                break;
            //throw grenade
            case 2:
                if(player.grenades > 0){
                    hit = player.damageGrenade();
                    grunt.health = grunt.health - hit;
                    player.grenades--;
                    console.log(`The grunt takes ${hit} damage`);
                }
                else{
                    console.log("You don't have any grenades.");
                }          
                break;
            //Verbally abuse
            case 3:
              console.log(`You yell explatives about the grunt's mother inflicting critical damage to moral.`);
              grunt.health = grunt.health -1;
              break;
            //Use Medkit
            case 4:
                if(player.healthPacks > 0){
                    player.health = 10;
                    player.healthPacks--;
                    console.log("Your health is fully restored.")
                }
                else{
                    console.log("You are already at full health.");
                }
                break;
            case 5:
                suppliesCheck();
                break;
            case 6:
                console.log("Quiting game.")
                return -100;
            default: 
              console.log( "Incorrect input, try again." );
        }

        if(grunt.health <= 0) {
            console.log(`You killed the grunt.`)
            return 1; // move to next phase
        }

        //Grunts turn
        hit = grunt.damageGun();
        player.health = player.health - hit;
        console.log(`Grunt fires a round with a plasma pistol and you take ${hit} damage.`);

        if(player.health <= 0){
            console.log(`You died, I guess you don't have what it takes to be an ODST.`);
            return -100; //get to default branch in the loop
        }
    }
}

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
            break;
        case 2:
            console.log(`
                +-+-+-+-+-+ +-+-+ +-+-+-+-+-+ +-+-+-+-+-+
                |L|e|v|e|l| |2|:| |B|r|u|t|e| |F|o|r|c|e|
                +-+-+-+-+-+ +-+-+ +-+-+-+-+-+ +-+-+-+-+-+
            `);
            break;
        case 3:
            console.log(`            
                +-+-+-+-+-+ +-+-+ +-+-+-+ +-+-+-+-+-+-+
                |L|e|v|e|l| |3|:| |T|h|e| |H|u|n|t|e|d|
                +-+-+-+-+-+ +-+-+ +-+-+-+ +-+-+-+-+-+-+
            `);
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

function resetGame(){
    player.reset();
    grunt.reset();
    brute.reset();
    hunter.reset();
}
