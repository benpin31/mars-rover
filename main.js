let libMove = require("./lib-move") ;

/* 
Mars rover objects :
We will use two objects in this project : 
    1/ "grid" which represent mars ground : it contains two objects : 
        a) a size which is an array of two number which represent the horizontal and vertical size of the grid
        b) obstacleSet : an array of obstacle. obstacle is an object which will be definied late
    2/ "roverSet" which represent the set of rover. It is an array of rover which will be defined later
Previous objects contains other objects that we will describe now : 
    1/ "rover" : it contains :
        a) a name 
        b) direction : The direction property can contain one of four values: "N", "S", "E", or "W". 
        The rover’s default direction will be "N" (as North).
        c) position : an array of two number which give its position
        d) tracking : an array whose each element is an array of two number and a direction : it represents the histocal of moves of the rover
        e) commandSet : a string of command which are These commands will be the first letter of either (f)orward, (b)ackward (r)ight, or (l)eft.
    2/ "obstacle". It is an object which contains
        a) a type. There is two kind of obstacle : fixes, and rover obstacle. If the obstacle is a fixed obxtacle, type="fixed", else, 
        type=<rover name>
        b) a position : an array of two number which represent the position of the obstacle
*/

let rover1 = libMove.constructRover('rover1', 'N', [1,1], 'rffffff') ;
let rover2 = libMove.constructRover('rover2', 'N', [1,11], 'rbbbbbbbbbb') ;
roverSet = [rover1, rover2] ;

let obstacleNameSet = ['fixed', 'fixed'] ;
let obstaclePositionSet = [[2,9], [10,10]] ;
let obstacleSet = libMove.constructObstacleSet(obstacleNameSet, obstaclePositionSet) ;
let grid = libMove.constructGrid([11,11], obstacleSet) ;

//console.log(grid.obstacleSet) ;
//console.log(libMove.moveForward(roverSet[0], grid)) ;
libMove.moveRoverSet(roverSet, grid) ;