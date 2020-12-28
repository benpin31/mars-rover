/*  various function

    gather function general function which are not specific to the project
*/

function positivMod(n, mod) {
    // classic n%mod operator gives a negative number when n < 0. This function give a positiv modulo in such cases .
    return (n%mod+mod)%mod;
}

function areArrayEqual(arr1, arr2) {
    // for array whose element can be wompared with ===, say if to arrays are equal
    let res ;
    if (arr1.length === arr2.length) {
        res = true;
        let cpt = 0;
        while (cpt < arr1.length && res) {
            res = arr1[cpt] === arr2[cpt] ;
            cpt++;
        }
    } else {
        res = false;
    }
  
  return(res);
 }


/*  rover functions

    gather function which apply a a single rover
*/

exports.constructRover = function(name, direction, position, commandSet) {
    // constructor of a rover
    let rover = {
        name: name,
        direction: direction,
        position: position,
        nextPosition: [],
        tracking: [[position[0], position[1], direction, "ON"]],
        commandSet: commandSet,
        status: "ON"
    } ;

    return rover ;
} ;

function copyRoverSet(roverSet) {
    // roverSet are an array of object, we create a function which copy reverSet without references
    let newRoverSet = [];
    roverSet.forEach(rover => {
        let name =rover.name;
        let direction=rover.direction;
        let position=rover.position.slice();
        let commandSet=rover.commandSet;
        newRoverSet.push(module.exports.constructRover(name, direction, position, commandSet)) ;
    }) ;

    return(newRoverSet) ;
}

function logTracking(tracking) {
    // print tracking
    let textTracking = '(' + tracking[0] + ') ' ;
    tracking.slice(1).forEach(position => {textTracking += "\n => (" + position + ")" ;}) ;
    return textTracking + ' => END';
}

function updateTracking(rover) {
    newTracking = rover.position.slice() ;
    newTracking.push(rover.direction);
    newTracking.push(rover.status) ;
    rover.tracking.push(newTracking) ;
}

function isAnObstacle(position, obstacleSet) {
    //  given a rover and a set of obstacle, say if the position is in the set of obstacle
    let cpt = 0;

    while (
        cpt < obstacleSet.length && 
        !areArrayEqual(position, obstacleSet[cpt].position))
    {
        cpt++;  
    }
    return cpt !== obstacleSet.length;
}

const directionList = ['N', 'E', 'S', 'O'] ;
    /*  constant used in function turnLeft and turnRight. turning right(left) constists in moving right(left) 
        in this array with loop when we are at the begining or at the end
    */

function turnLeft(rover, printConsoleLog = true) {
    //  turn left a rover. Print log only if printConsoleLog is true
    let actualIndexDirection = directionList.indexOf(rover.direction);
    let oldDirection = rover.direction;
    rover.direction = directionList[positivMod(actualIndexDirection-1,4)];
    rover.nextPosition = rover.position;
    if (printConsoleLog) {
        console.log(`Rover ${rover.name} turn from ${oldDirection} to ${rover.direction}`);
    }
    return rover;
} 
   
function turnRight(rover, printConsoleLog = true) {
    //  turn right a rover. Print log only if printConsoleLog is true
    let actualIndexDirection = directionList.indexOf(rover.direction);
    let oldDirection = rover.direction;
    rover.direction = directionList[positivMod(actualIndexDirection+1,4)];
    rover.nextPosition = rover.position;
    if (printConsoleLog) {
        console.log(`Rover ${rover.name} turn from ${oldDirection} to ${rover.direction}`);
    }    
    return(rover);
} 

function moveForward(rover) {
    /*  If possible, move forcard a rover. If the rover can't move because of obctacle, call of function keepPosition with parameter
        'stoped' which indicate that the rovers stoped because an obstacle, and no because the rover had no command anymore.
        Print log only if printConsoleLog is true 
    */
    let nextPosition;
    switch(rover.direction) {
        case 'N': 
            nextPosition = [rover.position[0] + 1, rover.position[1]];
            break;
        case 'S': 
            nextPosition = [rover.position[0] - 1, rover.position[1]];
            break;
        case 'E': 
            nextPosition = [rover.position[0], rover.position[1] + 1];
            break;
        case 'O': 
            nextPosition = [rover.position[0], rover.position[1] - 1];
            break;
        default:
            nextPosition = rover.position;
    }

    rover.nextPosition = nextPosition;

   /* let oldPosition = rover.position;
    if (!isAnObstacle({name: rover.name, position:newPosition}, grid.obstacleSet)  &&
    newPosition[0] > 0 && newPosition[0] <= grid.size[0] &&
    newPosition[1] > 0 && newPosition[1] <= grid.size[1]) {
        // if the new position is not an obstacle and the position is in the grid limit, the, we update position of the rover.
        rover.position = newPosition; 
        if (printConsoleLog) {
            console.log(`Rover ${rover.name} move from (${oldPosition}) to (${rover.position})`);
        }
    } else {
        // if the rover can't move because of an obstacle
        keepPosition(rover,  'STOPED' ,printConsoleLog) ;
    } */
} 

function moveBackward(rover) {
    // moving backward is equivalent to change direction to times, then move forward. At the end, one must change direction again
    turnLeft(turnLeft(rover, false), false) ;
    moveForward(rover);
    turnLeft(turnLeft(rover, false), false) ;
} 


function turnOff(rover) {
   rover.status='OFF' ; 
}


function moveRover(rover, grid, command, printConsoleLog = true) { 
    /*  turn left(right) the rover with command l(r)? move forward(backward) the rover with command f(b)
        For each move, one complete the rover tracking
    */

    if (rover.status === 'ON') {
        let newTracking ;
        switch(command) {
            case 'l':
                turnLeft(rover, printConsoleLog) ;
                break ;
            case 'r':
                turnRight(rover, printConsoleLog) ;            
                break ;
            case 'f':
                moveForward(rover) ;      
                break ;
            case 'b':
                moveBackward(rover) ;    
                break ;
            case undefined:
                turnOff(rover) ;
                console.log(`Rover ${rover.name} command push is finished. Rover turn off. Current position = (${rover.position})`);
                break ;
            default:
                turnOff(rover) ;
                console.log(`Bad command : Rover ${rover.name} is stoped. Current position = (${rover.position})`);
         }
    } else {
        console.log(`Rover ${rover.name} is OFF. Current position = (${rover.position})`);
    }


} 

function moveRoverSet(rover, roverSet, grid, command) {

    if (rover.status === 'ON' && (command === "f" || command === "b")) {
        if (rover.nextPosition[0] < 1 || rover.nextPosition[0] > grid.size[0] ||
            rover.nextPosition[1] < 1 || rover.nextPosition[1] > grid.size[1]) {
            stopedChainedRover(rover, roverSet) ;
            console.log(`Rover ${rover.name} stoped because it exceed grid size`);
        } else if (isAnObstacle(rover.nextPosition, grid.obstacleSet)) {
            turnOff(rover) ;
            console.log(`Rover ${rover.name} stoped because it meet an obstacle`);
        } else {
            console.log(`Rover ${rover.name} move from (${rover.position}) to (${rover.nextPosition})`);
            rover.position = rover.nextPosition ;
        }
    }
    updateTracking(rover) ;  

}

function stopedChainedRover(stopedRover, roverSet) {

    console.log(roverSet[0]) ;
    console.log(roverSet[1]) ;

    let roverToStop = [];
    roverSet.forEach(rover => {
        console.log(rover.name) ;
        console.log(stopedRover.name) ;
        console.log(rover.nextPosition) ;
        console.log(stopedRover.position) ;
console.log(rover.name !== stopedRover.name) ;

        if (rover.name !== stopedRover.name && rover.nextPosition === stopedRover.position) {
            roverToStop.push(rover) ;
        }
    }) ;

    if (roverToStop.length === 0) {
        console.log("toto") ;
        turnOff(stopedRover) ;
    } else {
        roverToStop.forEach(rover => {stopedChainedRover(rover, roverSet);}) ;
        console.log("titi") ;
    }
}


/*  Grid and obstacle function

    gather function chich apply to a gris and obstacle
*/

exports.constructObstacleSet = function(positionSet) {
    // constructor of obstacle
    const obstacleSet = [] ;
    
    for (k=0; k<positionSet.length; k++) {
        obstacleSet.push({position: positionSet[k]}) ;
    }

    return obstacleSet;
} ;

exports.constructGrid = function(gridSize, obstacleSet) {
    // constructor of grid
    const grid = {
        size: gridSize,
        obstacleSet:obstacleSet
    } ;
    
    return grid ;
} ;

function getFixedObstacle(grid) {
    // return a grid with the same properties that the argument, but only with fixed obstacle
    const fixedObstacleSet = [];

    grid.obstacleSet.forEach(obstacle => {
        if(obstacle.name === 'fixed') {
            fixedObstacleSet.push({name:obstacle.name, position: obstacle.position.slice()}) ;
        }
    }) ;

    return {size: grid.size, obstacleSet:fixedObstacleSet};
} 

function copyObstacleSet(obstacleSet) {
    //  obstacle set are array. Affectation is by reference by default. This function copy obstacle set without reference.
    let obstacleSetCopy = [] ;

    obstacleSet.forEach(obstacle => {
        obstacleSetCopy.push({name: obstacle.name, position: obstacle.position.slice()}) ;
    }) ;

    return(obstacleSetCopy) ;
}


/*  roverSet function

    gather function chich apply to a roverSet
*/


function getLongestCommandSet(roverSet) {
    // give an of rover, indicate the longest command set of the rover

    let getLongestCommandSet = roverSet[0].commandSet.length ;

    if(roverSet.length > 1) {
        roverSet.slice(1).forEach(rover => {
            if(getLongestCommandSet < rover.commandSet.length) {
                getLongestCommandSet = rover.commandSet.length ;
            }
        }) ;
    }

    return getLongestCommandSet;

} 

exports.moveRoverSet = function(roverSet, grid) {
    /*  Consider the rovers position a one instant t. For step t+1, the set of obstacle is the set of fixed obstacle 
        plus the set of rover obstacle AT t+1. To get this set of obstacle, one make a copy of actuel rover set position,
        then we launch a virtual move with only fixed obstacles. Rover position that we obtains are added to the obstacle set.
        and one can launch the true move of rover set with the previous obstacle set
    */

    const longestCommandSet = getLongestCommandSet(roverSet) ; 
        // we loop as many time as the longest set of command

    const fixedObstacleGrid = getFixedObstacle(grid); 
        // grid with only fixed obstacle which will be enriched each loop with rover obstacle  
    for (k=0 ; k<longestCommandSet ; k++) {
        console.log("t = "+k) ;
        roverSet.forEach(rover => {
            moveRover(rover, grid, rover.commandSet[k]) ;
        }) ;
        roverSet.forEach(rover => {
            moveRoverSet(rover, roverSet, grid, rover.commandSet[k]) ;
        }) ;

            // Move orver with relevant obstacle
    }

    console.log('Rover moves : ') ;
    roverSet.forEach(rover => {
        console.log(`${rover.name} tracking : \n` + logTracking(rover.tracking)) ;
    }) ;
} ;
