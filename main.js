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
        d) tracking : an array whose each element is an array of two number : it represents the histocal of moves of the rover
        e) commandSet : a string of command which are These commands will be the first letter of either (f)orward, (b)ackward (r)ight, or (l)eft.
    2/ "obstacle". It is an object which contains
        a) type : There is two kind of obstacle : fixes, and rover obstacle. If the obstacle is a fixed obxtacle, type="fixed", else, 
        type=<rover name>
        b) position : an array of two number which represent the position of the obstacle
*/

const obstacle1 = {
    name: "fixed",
    position: [4,7]
} ;

const obstacle2 = {
    name: "fixed",
    position: [8,3]
} ;

const grid = {
    size: [10,10],
    obstacleSet:[obstacle1, obstacle2]
} ;

let rover1 = {
    name: "rover1",
    direction: "N",
    position: [5,7],
    tracking: [[2,4]],
    commandSet: "lrfffrlb"
} ;

let rover2 = {
    name: "rover1",
    direction: "N",
    position: [2,4],
    tracking: [[2,4]],
    commandSet: "lrfffrlb"
} ;

console.log(rover1) ;
libMove.movebackward(rover1, grid) ;
console.log(rover1) ;
