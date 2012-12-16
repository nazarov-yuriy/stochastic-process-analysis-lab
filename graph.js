/**
 * Created with JetBrains WebStorm.
 * User: firefish
 * Date: 16/12/12
 * Time: 20:21
 * To change this template use File | Settings | File Templates.
 */
document.addEventListener("DOMContentLoaded", load, false);
var a = 1;
var board;

function g(x){
    return a * Math.sin(x);
}

function load(){
    board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox:[-4,4,4,-4], keepaspectratio: true, axis:true});
    board.create('functiongraph', [g,-4,4]);
}

function replot(){
   a = Math.random();
    board.update();
    return false;
}