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
        tracking: [[position, direction]],
        commandSet: commandSet
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

function isAnObstacle(rover, obstacleSet) {
    //  given a rover and a set of obstacle, say if the position is in the set of obstacle
    let cpt = 0;

    while (
        cpt < obstacleSet.length && 
        (!areArrayEqual(rover.position, obstacleSet[cpt].position) ||
        rover.name === obstacleSet[cpt].name))
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
    if (printConsoleLog) {
        console.log(`Rover ${rover.name} turn from ${oldDirection} to ${rover.direction}`);
    }    
    return(rover);
} 

function moveForward(rover, grid, printConsoleLog = true) {
    /*  If possible, move forcard a rover. If the rover can't move because of obctacle, call of function keepPosition with parameter
        'stoped' which indicate that the rovers stoped because an obstacle, and no because the rover had no command anymore.
        Print log only if printConsoleLog is true 
    */
    let newPosition;
    switch(rover.direction) {
        case 'N': 
            newPosition = [rover.position[0] + 1, rover.position[1]];
            break;
        case 'S': 
            newPosition = [rover.position[0] - 1, rover.position[1]];
            break;
        case 'E': 
            newPosition = [rover.position[0], rover.position[1] + 1];
            break;
        case 'O': 
            newPosition = [rover.position[0], rover.position[1] - 1];
            break;
        default:
            newPosition = rover.position;
    }

    let oldPosition = rover.position;
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
    }
} 

function moveBackward(rover, grid, printConsoleLog = true) {
    // moving backward is equivalent to change direction to times, then move forward. At the end, one must change direction again
    turnLeft(turnLeft(rover, false), false) ;
    moveForward(rover, grid, printConsoleLog);
    turnLeft(turnLeft(rover, false), false) ;
} 


function keepPosition(rover, reason = "STOPED", printConsoleLog = true) {
    /*  Function called when the rover don't move, because of an obstacle, or because, it it's command list is finished. If
        the rover once, we delete its command to indicate that a reover has definitly stoped. Thus, even if it had other command, they 
        won't be execute
    */
    if (printConsoleLog) {
        if (reason==="STOPED") {
            console.log(`Rover ${rover.name} can't move : current position = (${rover.position})`);
        } else {
            console.log(`Rover ${rover.name} stoped : current position = (${rover.position})`);
        }
    }
    rover.commandSet = []; // when a rover meet an obstacle, it defenitly stop
}


function moveRover(rover, grid, command, printConsoleLog = true) { 
    /*  turn left(right) the rover with command l(r)? move forward(backward) the rover with command f(b)
        For each move, one complete the rover tracking
    */

    let newTracking ;
    switch(command) {
        case 'l':
            turnLeft(rover, printConsoleLog) ;
            newTracking = rover.position.slice() ;
            newTracking.push(rover.direction);
            rover.tracking.push(newTracking) ;
            break ;
        case 'r':
            turnRight(rover, printConsoleLog) ;
            newTracking = rover.position.slice() ;
            newTracking.push(rover.direction);
            rover.tracking.push(newTracking) ;            
            break ;
        case 'f':
            moveForward(rover, grid, printConsoleLog) ;
            newTracking = rover.position.slice() ;
            newTracking.push(rover.direction);
            rover.tracking.push(newTracking) ;           
            break ;
        case 'b':
            moveBackward(rover, grid, printConsoleLog) ;
            newTracking = rover.position.slice() ;
            newTracking.push(rover.direction);
            rover.tracking.push(newTracking) ;      
            break ;
        default:
            keepPosition(rover, 'END',printConsoleLog) ;
            newTracking = rover.position.slice() ;
            newTracking.push(rover.direction);
            rover.tracking.push("END") ; 
        }

} 

/*  Grid and obstacle function

    gather function chich apply to a gris and obstacle
*/

exports.constructObstacleSet = function(nameSet, positionSet) {
    // constructor of obstacle
    const obstacleSet = [] ;
    
    for (k=0; k<nameSet.length; k++) {
        obstacleSet.push({name: nameSet[k], position: positionSet[k]}) ;
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
        console.log(`Move ${k}`) ;
        let futureRoverSet = copyRoverSet(roverSet);
            // rover set use to get the rover obstacle position. One use function copyRoverSet because "=" copy by reference 
        grid.obstacleSet = copyObstacleSet(fixedObstacleGrid.obstacleSet) ;
            // At this instant, rover obstacle of the grid are not relevant anymore. Only fixed obstacle are still. It will be enriched 
            // next with update rover obectacle. One use function copyObstacleSet because "=" copy by reference 
        futureRoverSet.forEach(rover => {
            moveRover(rover, fixedObstacleGrid, rover.commandSet[k], false) ;
            grid.obstacleSet.push({name: rover.name, position: rover.position}) ;
        }) ;
            // Get new relevant rover obstacle
        roverSet.forEach(rover => {
            moveRover(rover, grid, rover.commandSet[k]) ;
        }) ;
            // Move orver with relevant obstacle
        
    }

    console.log('Rover moves : ') ;
    roverSet.forEach(rover => {
        console.log(`${rover.name} tracking : \n` + logTracking(rover.tracking)) ;
    }) ;
} ;
