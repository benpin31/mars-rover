const directionList = ['N', 'E', 'S', 'O'] ;

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
    let rover = {
        name: name,
        direction: direction,
        position: position,
        tracking: [position],
        commandSet: commandSet
    } ;

    return rover ;
} ;

function logTracking(tracking) {
    let textTracking = '' ;
    tracking.forEach(position => {textTracking += "(" + position + ") => "})
    return textTracking + ' stop';
}

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

function turnLeft(rover, printConsoleLog = true) {
    let actualIndexDirection = directionList.indexOf(rover.direction);
    let oldDirection = rover.direction;
    rover.direction = directionList[positivMod(actualIndexDirection-1,4)];
    if (printConsoleLog) {
        console.log(`Rover ${rover.name} turn from ${oldDirection} to ${rover.direction}`);
    }
    return rover;
} 
   
function turnRight(rover, printConsoleLog = true) {
    let actualIndexDirection = directionList.indexOf(rover.direction);
    let oldDirection = rover.direction;
    rover.direction = directionList[positivMod(actualIndexDirection+1,4)];
    if (printConsoleLog) {
        console.log(`Rover ${rover.name} turn from ${oldDirection} to ${rover.direction}`);
    }    
    return(rover);
} 

function keepPosition(rover, printConsoleLog = true) {
    /*  Function called when the rover don't move, because of an obstacle, or because, it it's command list is finished.
        It add an entry in the tracking attribute of rover which is equal to the current position
    */
    if (printConsoleLog) {
        console.log(`Rover ${rover.name} dosn't move : current position = (${rover.position})`);
    }
    rover.commandSet = []; // when a rover meet an obstacle, it defenitly stop
}

function moveForward(rover, grid, printConsoleLog = true) {
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

    // if the new position is not an obstacle and the position is in the grid limit, the, we update position of the rover.
    let oldPosition = rover.position;
    if (!isAnObstacle({name: rover.name, position:newPosition}, grid.obstacleSet)  &&
    newPosition[0] > 0 && newPosition[0] <= grid.size[0] &&
    newPosition[1] > 0 && newPosition[1] <= grid.size[1]) {
        rover.position = newPosition; 
        if (printConsoleLog) {
            console.log(`Rover ${rover.name} move from (${oldPosition}) to (${rover.position})`);
        }
    } else {
        // if the rover can't move
        keepPosition(rover, printConsoleLog = printConsoleLog) ;
    }
} 

function moveBackward(rover, grid, printConsoleLog = true) {
    // moving backward is equivalent to change direction to times, then move forward. At the end, one must change direction again
    turnLeft(turnLeft(rover, false), false) ;
    moveForward(rover, grid, printConsoleLog);
    turnLeft(turnLeft(rover, false), false) ;
} 

function moveRover(rover, grid, command, printConsoleLog = true) {
    // turn left(right) the rover with command l(r)? move forward(backward) the rover with command f(b)

    switch(command) {
        case 'l':
            turnLeft(rover, printConsoleLog) ;
            rover.tracking.push(rover.position) ;
            break ;
        case 'r':
            turnRight(rover, printConsoleLog) ;
            rover.tracking.push(rover.position) ;
            break ;
        case 'f':
            moveForward(rover, grid, printConsoleLog) ;
            rover.tracking.push(rover.position) ;
            break ;
        case 'b':
            moveBackward(rover, grid, printConsoleLog) ;
            rover.tracking.push(rover.position) ;
            break ;
        default:
            keepPosition(rover, printConsoleLog) ;
            rover.tracking.push(rover.position) ;
    }

} 

/*  Grid and obstacle function

    gather function chich apply to a gris and obstacle
*/

exports.constructObstacleSet = function(nameSet, positionSet) {
    const obstacleSet = [] ;
    
    for (k=0; k<nameSet.length; k++) {
        obstacleSet.push({name: nameSet[k], position: positionSet[k]}) ;
    }

    return obstacleSet;
} ;

function getFixedObstacle(grid) {
    const fixedObstacleSet = [];

    grid.obstacleSet.forEach(obstacle => {
        if(obstacle.name === 'fixed') {
            fixedObstacleSet.push({name:obstacle.name, position: obstacle.position.slice()}) ;
        }
    }) ;

    return {size: grid.size, obstacleSet:fixedObstacleSet};
} 

function copyObstacleSet(obstacleSet) {
    let obstacleSetCopy = [] ;

    obstacleSet.forEach(obstacle => {
        obstacleSetCopy.push({name: obstacle.name, position: obstacle.position.slice()}) ;
    }) ;

    return(obstacleSetCopy) ;
}

exports.constructGrid = function(gridSize, obstacleSet) {
    const grid = {
        size: gridSize,
        obstacleSet:obstacleSet
    } ;
    
    return grid ;
} ;


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
    const longestCommandSet = getLongestCommandSet(roverSet) ;

    let fixedObstacleGrid = getFixedObstacle(grid);
    for (k=0 ; k<longestCommandSet ; k++) {
        let futureRoverSet = copyRoverSet(roverSet);
        grid.obstacleSet = copyObstacleSet(fixedObstacleGrid.obstacleSet) ;
        futureRoverSet.forEach(rover => {
            moveRover(rover, fixedObstacleGrid, rover.commandSet[k], false) ;
            grid.obstacleSet.push({name: rover.name, position: rover.position}) ;
        }) ;
        roverSet.forEach(rover => {
            moveRover(rover, grid, rover.commandSet[k]) ;
        }) ;
        
    }

    console.log('Rover moves : ')
    roverSet.forEach(rover => {
        console.log(`${rover.name} tracking ` + logTracking(rover.tracking)) ;
    }) ;
} ;
