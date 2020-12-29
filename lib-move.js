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
        nextDirection: [],
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
    /*  constant used in function turnRover. turning right(left) constists in moving right(left) 
        in this array with loop when we are at the begining or at the end
    */

function turnRover(rover, turnType) {
    let toAdd;
    if (turnType === 'right') {
        toAdd = 1;
    } else {
        toAdd = -1;
    }

    let actualIndexDirection = directionList.indexOf(rover.direction);
    rover.nextDirection = directionList[positivMod(actualIndexDirection+toAdd,4)];
    rover.nextPosition = rover.position;
    return rover; // to be able to compose the function
} 

function move(rover, moveType) {
    let toAdd;
    if (moveType === 'forward') {
        toAdd = 1;
    } else {
        toAdd = -1;
    }

    let nextPosition;
    switch(rover.direction) {
        case 'N': 
            nextPosition = [rover.position[0] + toAdd, rover.position[1]];
            break;
        case 'S': 
            nextPosition = [rover.position[0] - toAdd, rover.position[1]];
            break;
        case 'E': 
            nextPosition = [rover.position[0], rover.position[1] + toAdd];
            break;
        case 'O': 
            nextPosition = [rover.position[0], rover.position[1] - toAdd];
            break;
        default:
            nextPosition = rover.position;
    }

    rover.nextPosition = nextPosition;
    rover.nextDirection = rover.direction;

} 


function turnOff(rover, grid) {
   rover.status='OFF' ; 
   rover.nextPosition = rover.position ;
   rover.nextDirection = rover.direction ;
   grid.obstacleSet.push({position: rover.position}) ;
}


function roverPotentialNextMove(rover, command) { 

    if (rover.status === 'ON') {
        switch(command) {
        case 'l':
            turnRover(rover, 'left') ;
            break ;
        case 'r':
            turnRover(rover, 'right') ;            
            break ;
        case 'f':
            move(rover, 'forward') ;      
            break ;
        case 'b':
            move(rover, 'backward') ;    
            break ;
        }
    }
} 

function nextPositionOutOfGrid(rover, grid) {
    return rover.nextPosition[0] < 1 || rover.nextPosition[0] > grid.size[0] ||
    rover.nextPosition[1] < 1 || rover.nextPosition[1] > grid.size[1] ;
}

function getCrashedRover(rover, roverSet) {
    let crashedRover = [];
    roverSet.forEach(otherRover => {
        if (
                rover.name !== otherRover.name &&
                (   areArrayEqual(rover.nextPosition, otherRover.nextPosition) || 
                    (areArrayEqual(rover.nextPosition, otherRover.position) && areArrayEqual(rover.position, otherRover.nextPosition))
                )
            ) {
            crashedRover.push(otherRover);
        }
    }) ;

    return crashedRover ;
}


function moveRoverSet(rover, roverSet, grid, command) {
    if (rover.status === 'ON') {
        if (['r', 'l', 'b', 'f'].includes(command)) {
            if (nextPositionOutOfGrid(rover, grid)) {
                turnOff(rover, grid) ;
                stopedChainedRover(rover, roverSet, grid) ;
                console.log(`Rover ${rover.name} stoped because it exceed grid size`);
            } else if (isAnObstacle(rover.nextPosition, grid.obstacleSet)) {
                turnOff(rover, grid) ;
                stopedChainedRover(rover, roverSet, grid) ;
                console.log(`Rover ${rover.name} stoped because it meet an obstacle`);
            } else if (getCrashedRover(rover, roverSet).length > 0) {
                roverToStop = getCrashedRover(rover, roverSet);
                roverToStop.unshift(rover) ;
                let roverNameList = '' ;
                roverToStop.forEach(crashedRover => { 
                    turnOff(crashedRover, grid) ; 
                }) ;
                roverToStop.forEach(crashedRover => { 
                    stopedChainedRover(crashedRover, roverSet, grid) ;
                    roverNameList += crashedRover.name + ",";
                }) ;
                console.log(`Rover ${roverNameList} stoped because they would have crashed together`);
            } else {
                if (['r', 'l'].includes(command)) {
                    console.log(`Rover ${rover.name} turn from ${rover.direction} to ${rover.nextDirection}`);
                } else {
                    console.log(`Rover ${rover.name} move from (${rover.position}) to (${rover.nextPosition})`);
                }
                rover.position = rover.nextPosition ;
                rover.direction = rover.nextDirection ;
            }
        } else if (command === undefined) {
            turnOff(rover, grid) ;
            console.log(`Rover ${rover.name} command push is finished. Rover turn off. Current position = (${rover.position})`);
        } else {
            turnOff(rover, grid) ;
            console.log(`Bad command : Rover ${rover.name} is stoped. Current position = (${rover.position})`);
        }
    } else {
        console.log(`Rover ${rover.name} is OFF. Current position = (${rover.position})`);
    }

    updateTracking(rover) ;  

}

function stopedChainedRover(stopedRover, roverSet, grid) {

    let roverToStop = [];
    roverSet.forEach(rover => {
        if (rover.name !== stopedRover.name && areArrayEqual(rover.nextPosition,stopedRover.position)) {
            roverToStop.push(rover) ;
        }
    }) ;

    if (roverToStop.length !== 0) {
        roverToStop.forEach(rover => {
            turnOff(rover, grid) ;
            console.log(`Rover ${rover.name} stoped because rover ${stopedRover.name} stoped before it` ) ;
            stopedChainedRover(rover, roverSet, grid);
        }) ;
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

exports.main = function(roverSet, grid) {

    const longestCommandSet = getLongestCommandSet(roverSet) ; 
        // we loop as many time as the longest set of command

    for (k=0 ; k<longestCommandSet ; k++) {
        console.log("Step "+k) ;
        roverSet.forEach(rover => {
            roverPotentialNextMove(rover, rover.commandSet[k]) ;
        }) ;
        // compute the potential rover next moves
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
