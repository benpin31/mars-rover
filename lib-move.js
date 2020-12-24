const directionList = ['N', 'E', 'S', 'O'] ;

// various function
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
            res = arr1[cpt] === arr2[cpt]
            cpt++;
        }
    } else {
        res = false;
    }
  
  return(res);
 }

function isAnObstacle(rover, obstacleSet) {
    //  given a rover and a set of obstacle, say if the position is in the set of obstacle
    let cpt = 0;
    while (
        cpt < obstacleSet.length && 
        !areArrayEqual(rover.position, obstacleSet[cpt].position) &&
        rover.name !== obstacleSet[cpt].name)
    {
        cpt++;
    }
    return cpt !== obstacleSet.length;
}


// rover functions
function turnLeft(rover, printConsoleLog = true) {
    if (printConsoleLog) {console.log('turnLeft was called!');}
    let actualIndexDirection = directionList.indexOf(rover.direction);
    rover.direction = directionList[positivMod(actualIndexDirection-1,4)];
    return rover;
} 
   
function turnRight(rover, printConsoleLog = true) {
    if (printConsoleLog) {console.log('turnRight was called!');}
    let actualIndexDirection = directionList.indexOf(rover.direction);
    rover.direction = directionList[positivMod(actualIndexDirection+1,4)];
    return(rover);
} 

exports.moveForward = function(rover, grid, printConsoleLog = true) {
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
        case 'N': 
            newPosition = [rover.position[0], rover.position[1] - 1];
            break;
        default:
            newPosition = rover.position;
    }


    if (
        !isAnObstacle({name: rover.name, position:newPosition}, grid.obstacleSet)  &&
        newPosition[0] > 0 && newPosition[0] <= grid.size[0] &&
        newPosition[1] > 0 && newPosition[1] <= grid.size[1]) {
            rover.position = newPosition;
    }

    if (printConsoleLog) {
        console.log('moveForward was called');
    }
} 

exports.movebackward = function(rover, grid) {
    // moving backward is equivalent to change direction to times, then move forward. At the end, one must change direction again
    turnLeft(turnLeft(rover, false), false) ;
    this.moveForward(rover, grid, false);
    turnLeft(turnLeft(rover, false), false) ;
    console.log('movebackward was called');
} 