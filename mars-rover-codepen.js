/*  various function

    Gather function general function which are not specific to the project
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

/*  Object creations

    We will use two objects in this project : 
        1/ "grid" which represent mars ground : it contains two objects : 
            a) a size which is an array of two number which represent the horizontal and vertical size of the grid
            b) obstacleSet : an array of obstacle. obstacle is an object which will be definied late
        2/ "roverSet" which represent the set of rover. It is an array of rover which will be defined later
    Previous objects contains other objects that we will describe now : 
        1/ "rover" : it contains :
            a) a name 
            b) direction : it is the CURRENT direction. the direction property can contain one of four values: "N", "S", "E", or "W". 
            The rover’s default direction will be "N" (as North).
            c) nextDirection : it is the POTENTIAL NEXT direction. It is computed without taking account of all obstacles on the grid.
            the nextDirection property can contain one of four values: "N", "S", "E", or "W". 
            d) position : an array of two number which give its CURRENT position
            e) nextPosition : it is the POTENTIAL NEXT direction. It is computed without taking account of all obstacles on the grid.
            f) tracking : History of the rover state. It is an array whose each element is an array of 4 components :
                - the two first are the position of the rover
                - the third element is its direction
                - the forth element is its status : ON or OFF
            g) commandSet : a string of command which are These commands will be the first letter of either (f)orward, (b)ackward, 
                (r)ight, or (l)eft.
            h) status : ON or OFF. Indicates if the rover is turn on or off.
        2/ "obstacle". It is an object which contains a position : an array of two number which represent the position of the obstacle. 
*/

function constructRover(name, direction, position, commandSet) {
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
} 

function constructObstacleSet(positionSet) {
    // constructor of obstacle
    const obstacleSet = [] ;
    
    for (let k=0; k<positionSet.length; k++) {
        obstacleSet.push({position: positionSet[k]}) ;
    }

    return obstacleSet;
} 

function constructGrid(gridSize, obstacleSet) {
    // constructor of grid
    const grid = {
        size: gridSize,
        obstacleSet:obstacleSet
    } ;
    
    return grid ;
} 


/*  Move functions

    Moving a rover will depend on various factors : next move could be impossible because the rover will get out the limit of the grid, 
    or because it will crash with another rover. because there could be more than one over on the grid, wee need to manage all rover 
    simultanly, and not one by one. Here is how I tried to solve the probleme.
    
    Condiser move setp t done, here whart will happen a step t+1 : 
    1/  we will compute POTENTIAL new position and direction (nextPosition and nextDirection properties of object rover) for all rover as if
        there were no obstacle. 
    2/  for all rovers, we check rovers that need to stop. Here are the rules for stoping a rover : 
        RULE 1 : the next direction will be out of the grid
        RULE 2 : the rover will crash with an obstacle (the direction have same coordinates than an obstacle)
        RULE 3 : two rovers will crash together. For example rove1: (5,6) -> (6,6) and rover2: (6,5) -> (6,6)
        RULE 4 : Each time a rover stop, all rovers whose new position should be rover current position must stop : this rule is chained rule :
            for example, if one have rover1 : (5,6) -> (6,6), rover2 : (4,6) -> (5,6) and rover3 : (3,6) -> (4,6) and rover1 can't move, 
            then rover2 can't move, and because rover2 can't move, rover3 can't move too.
        When a rover is stopped, it's current position is added to obstacle set
        If a rover follow none of this rules, then it can move : properties direction and position are updated with 
        nextPosition and nextDirection
*/

    /*  Potential moving functions   

        This part gather functions which give potiential move, without taking into account the obstacles
    */

const directionList = ['N', 'E', 'S', 'O'] ;
   /*  constant used in function turnRover. turning right(left) constists in moving right(left) 
       in this array with loop when we are at the begining or at the end
   */

function potentialTurnRover(rover, turnType) {
    /* Use directionList constant to get the potential (without taking account of obstacle) position and direction of 
    the rover after it turn left or right */
   let toAdd;
   if (turnType === 'right') {
       toAdd = 1;
   } else {
       toAdd = -1;
   }

   let actualIndexDirection = directionList.indexOf(rover.direction);
   rover.nextDirection = directionList[positivMod(actualIndexDirection+toAdd,4)];
   rover.nextPosition = rover.position;
} 

function potentialMoveBackwardForwardRover(rover, moveType) {
    /* the potential (without taking account of obstacle) position and direction of 
    the rover after it move forcard or backward */   
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

function potentialMoveRover(rover, command) { 
    /*  Combine potentialTurnRover and potentialMoveBackwardForwardRover function to get a potential position after one of the command
        l, r, f, b. If rover status is off (rover stopped), nothing happen*/
    if (rover.status === 'ON') {
        switch(command) {
        case 'l':
            potentialTurnRover(rover, 'left') ;
            break ;
        case 'r':
            potentialTurnRover(rover, 'right') ;            
            break ;
        case 'f':
            potentialMoveBackwardForwardRover(rover, 'forward') ;      
            break ;
        case 'b':
            potentialMoveBackwardForwardRover(rover, 'backward') ;    
            break ;
        }
    }
} 

    /*  Position and direction validation function   

        This part gather functions that validate (or not) the potential position and direction computed before
    */

function nextPositionOutOfGrid(rover, grid) {
    /* RULE 1 : indicate if the computed next position is out of grid */
    return rover.nextPosition[0] < 1 || rover.nextPosition[0] > grid.size[0] ||
    rover.nextPosition[1] < 1 || rover.nextPosition[1] > grid.size[1] ;
}

function nextPositionIsAnObstacle(rover, grid) {
    /* RULE 2 : given a rover and a set of obstacle, say if the position is in the set of obstacle */
    let cpt= 0;

    while (
        cpt < grid.obstacleSet.length && 
        !areArrayEqual(rover.nextPosition, grid.obstacleSet[cpt].position))
    {
        cpt++;  
    }
    return cpt !== grid.obstacleSet.length;
}

function getCrashedRover(rover, roverSet) {
    /*  RULE 3 : get all the rovers of the set which will crash with the rover passed as first argument. All this rover will be stop 
        two rover1 and rover2 will crash if rover1.nextPosition = rover2.nextPosition or if they cross themself. For example : 
        rover1 :(4,5) -> (5,5) and rover2: (5,5) -> (4,5)*/
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

function turnOff(rover, grid) {
    /* stop a rover puting OFF on status property. At the end, the current position of the rover is add to the obstacle grid property. */
  rover.status='OFF' ; 
  rover.nextPosition = rover.position ;
  rover.nextDirection = rover.direction ;
  grid.obstacleSet.push({position: rover.position}) ;
}
    
function stoppedChainedRover(stoppedRover, roverSet, grid) {
    /*  RULE 4 : Chain stop the rover : must be called each time function turnoff is called. The function stops all the rover of roverSet blocked
        stopped because an other rover stopped. It is a recursive algorithm : first we check all rover which will hace to stop because of 
        stoppedRover : it is the set of all the rovers whose nextPosition = stoppedRover.position. If there is no such rover, one has
        nothing to do. Else we stop the rovers, then one have to redo the operation for the new potentialy blocked rovers */
    let roverToStop = [];
        // find the rover whe ave to stopped
    roverSet.forEach(rover => {
        if (rover.name !== stoppedRover.name && areArrayEqual(rover.nextPosition,stoppedRover.position)) {
            roverToStop.push(rover) ;
        }
    }) ;

        // stop the previous rover, and find rovers which could be stoped by them
    if (roverToStop.length !== 0) {
        roverToStop.forEach(rover => {
            turnOff(rover, grid) ;
            console.log(`${rover.name} is chained stopped because of ${stoppedRover.name}` ) ;
            stoppedChainedRover(rover, roverSet, grid); // RULE 4 : always chain stop the rovers
            //recursive part : One have to find rover stopped by the previous stopped rovers.
        }) ;
    }
}

function updateTracking(rover) {
    /* add an element in tracking properties of the rovers */
    newTracking = rover.position.slice() ;
    newTracking.push(rover.direction);
    newTracking.push(rover.status) ;
    rover.tracking.push(newTracking) ;
}


function moveRoverSetOneStep(rover, roverSet, grid, command) {
    /*  Move the rovers taking account of the differents obstacles on the grid. First, one check and stop all the rover that have to,
        then we effectively move the rover updating rover.position and rover.direction. Each move or stop is loged. */ 
    if (rover.status === 'ON') {
        if (['r', 'l', 'b', 'f'].includes(command)) {
            if (nextPositionOutOfGrid(rover, grid)) {
                // RULE 1
                turnOff(rover, grid) ;
                stoppedChainedRover(rover, roverSet, grid) ; // RULE 4 : always chain stop the rovers
                console.log(`${rover.name} stopped because it exceed grid size`);
            } else if (nextPositionIsAnObstacle(rover, grid)) {
                turnOff(rover, grid) ;
                stoppedChainedRover(rover, roverSet, grid) ; // RULE 4 : always chain stop the rovers
                console.log(`${rover.name} stopped because it meet an obstacle`);
            } else if (getCrashedRover(rover, roverSet).length > 0) {
                roverToStop = getCrashedRover(rover, roverSet);
                roverToStop.unshift(rover) ;
                let roverNameList = '' ;
                roverToStop.forEach(crashedRover => { 
                    turnOff(crashedRover, grid) ; 
                }) ;
                roverToStop.forEach(crashedRover => { 
                    stoppedChainedRover(crashedRover, roverSet, grid) ; // RULE 4 : always chain stop the rovers
                    roverNameList += crashedRover.name + ",";
                }) ;
                console.log(`${roverNameList} stopped because they would have crashed together`);
            } else {
                if (['r', 'l'].includes(command)) {
                    console.log(`${rover.name} turn from ${rover.direction} to ${rover.nextDirection}`);
                } else {
                    console.log(`${rover.name} move from (${rover.position}) to (${rover.nextPosition})`);
                }
                rover.position = rover.nextPosition ;
                rover.direction = rover.nextDirection ;
            }
        } else if (command === undefined) {
            // if there is no more command for the rover, its journey is finished and we stop it
            turnOff(rover, grid) ;
            stoppedChainedRover(rover, roverSet, grid) ; // RULE 4 : always chain stop the rovers
            console.log(`${rover.name} command push is finished. Rover turn off. Current position = (${rover.position})`);
        } else {
            // if the commande is not l, r, f, b or empty, this is a mistake and the rover stop
            turnOff(rover, grid) ;
            stoppedChainedRover(rover, roverSet, grid) ; // RULE 4 : always chain stop the rovers
            console.log(`Bad command : ${rover.name} is stopped. Current position = (${rover.position})`);
        }
    } else {
        console.log(`${rover.name} is OFF. Current position = (${rover.position})`);
    }

    updateTracking(rover) ;  

}

    /*  Realization of the complete scenario : 

        Until now, all the functions only move a rover for 1 command. This part gather the set of function which realized the complete 
        scenario. Each rover has its own command set, and on havec to move (if possible) all the rovers until the last command. 
    */

function repSpace(n) {
    // use to align items in column in function logTracking : return a string of n white space
    res = '' ;
    for (let k = 0; k < n; k++) {
        res += ' ' ;
    }
    return(res) ;
}

function logTracking(roverSet) {
    // print tracking
    let nbStep = roverSet[0].tracking.length ;

    let logTrackingText = '\nRovers journey : \n' ;
    roverSet.forEach(rover => {
        logTrackingText += '' + rover.name + repSpace(16-rover.name.length) ;
    }) ;
    logTrackingText += '\n' ;

    for (k=0 ; k < nbStep ; k++) {
        let line = '';
        for (let l=0; l < roverSet.length ; l++) {
            if (l === roverSet.length-1) {
                line += '(' + roverSet[l].tracking[k] + ')\n' ;
            } else {
                let trackingText = '(' + roverSet[l].tracking[k] + ')' ;
                line += trackingText + repSpace(15-trackingText.length) +'|' ;
            } 
        }
        logTrackingText += line ;
    }



    console.log(logTrackingText) ;
}

function getLongestCommandSet(roverSet) {
    /*  If 2 rovers have different commandset length, this function give the longest. Thus, one can continue the journey : 
        the rover with shorter command will have empty command and will stop (function moveRoverSetOneStep)*/
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

function moveRoverSet(roverSet, grid) {

    const longestCommandSet = getLongestCommandSet(roverSet) ; 
        // we loop as many time as the longest set of command

    for (let k=0 ; k<longestCommandSet ; k++) {
        console.log("Step "+k) ;
        roverSet.forEach(rover => {
            potentialMoveRover(rover, rover.commandSet[k]) ;
        }) ;
        // compute the potential rover next moves
        roverSet.forEach(rover => {
            moveRoverSetOneStep(rover, roverSet, grid, rover.commandSet[k]) ;
        }) ;
        // validate or not each moves
    }

    logTracking(roverSet) ;
} 

/* Main */


let rover1 = constructRover('rover1', 'N', [15,18], 'rfffff') ;
let rover2 = constructRover('rover2', 'N', [11,14], 'rfffff') ;
let rover3 = constructRover('rover3', 'N', [9,10], 'llffff') ;
let rover4 = constructRover('rover4', 'N', [3,8], 'rfflff') ;
let rover5 = constructRover('rover5', 'N', [3,6], 'rffflf') ;
let rover6 = constructRover('rover6', 'N', [3,5], 'rffffl') ;
let rover7 = constructRover('rover7', 'N', [3,4], 'rfffff') ;
let rover8 = constructRover('rover8', 'N', [10,2], 'lbb') ;
let rover9 = constructRover('rover9', 'N', [5,9], 'rrrllff') ;
let rover10 = constructRover('rover10', 'N', [4,9], 'rrrllff') ;




roverSet = [rover1, rover2, rover3, rover4, rover5, rover6, rover7, rover8, rover9, rover10] ;

let obstaclePositionSet = [ [11,16]] ;
let obstacleSet = constructObstacleSet(obstaclePositionSet) ;
let grid = constructGrid([20,20], obstacleSet) ;

moveRoverSet(roverSet, grid) ;

