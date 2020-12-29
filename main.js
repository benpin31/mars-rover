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
        b) direction : it is the CURRENT direction. the direction property can contain one of four values: "N", "S", "E", or "W". 
        The rover’s default direction will be "N" (as North).
        c) nextDirection : it is the POTENTIAL NEXT direction. It is computed without taking account of all obstacles on the grid.
        the nextDirection property can contain one of four values: "N", "S", "E", or "W". 
        d) position : an array of two number which give its CURRENT position
        e) nextPosition : it is the POTENTIAL NEXT direction. It is computed without taking account of all obstacles on the grid.
        f) tracking : an array whose each element is an array of two number and a direction : it represents the histocal of moves of the rover
        g) commandSet : a string of command which are These commands will be the first letter of either (f)orward, (b)ackward (r)ight, or (l)eft.
        h) status : ON or OFF. Indicates if the rover is turn on or off.
    2/ "obstacle". It is an object which contains
        a) a type. There is two kind of obstacle : fixes, and rover obstacle. If the obstacle is a fixed obxtacle, type="fixed", else, 
        type=<rover name>
        b) a position : an array of two number which represent the position of the obstacle
*/

let rover1 = libMove.constructRover('rover1', 'N', [1,2], 'rffafff') ;
let rover2 = libMove.constructRover('rover2', 'N', [1,1], 'rfffbbb') ;
let rover3 = libMove.constructRover('rover3', 'N', [1,2], 'rffffff') ;
let rover4 = libMove.constructRover('rover4', 'N', [4,3], 'llffffff') ;


roverSet = [rover1, rover2] ;

let obstaclePositionSet = [ [10,10]] ;
let obstacleSet = libMove.constructObstacleSet(obstaclePositionSet) ;
let grid = libMove.constructGrid([10,10], obstacleSet) ;

//console.log(grid.obstacleSet) ;
//console.log(libMove.moveForward(roverSet[0], grid)) ;
libMove.moveRoverSet(roverSet, grid) ;

a = ['a', 'b'];
console.log(a.includes('a')) ;
