/**
 * Created with JetBrains WebStorm.
 * User: firefish
 * Date: 16/12/12
 * Time: 20:21
 * To change this template use File | Settings | File Templates.
 */
document.addEventListener("DOMContentLoaded", load, false);
var a = 1;
var process_board;
var dist_func_board;
var dens_func_board;
var histogram_board;

var x = [];
var y = [];

function generate_process(){
    for(var i = 0 ; i<300;i++){
        x[i] = i;
        y[i] = Math.random();
    }
}

function dist_func(x){
    var sigma = document.forms['params_form'].param_sigm.value;
    var mu = document.forms['params_form'].param_mu.value;
    var ret = Math.exp( -(x-mu)*(x-mu)/(2*sigma*sigma) )/ (sigma * Math.sqrt(2 * Math.PI));
    return ret;
}

function dens_func(x){
    return a * Math.cos(x)*Math.cos(x);
}

function histogram(x){
    return a * Math.sin(x)*Math.sin(x);
}

function load(){
    generate_process();

    process_board = JXG.JSXGraph.initBoard('process_div', {boundingbox:[0,1,300,-0.1], axis:true});
    process_board.create('curve', [x,y]);

    dist_func_board = JXG.JSXGraph.initBoard('dist_func_div', {boundingbox:[-5,1,5,-0.1], axis:true});
    dist_func_board.create('functiongraph', [dist_func,-4,4]);

    dens_func_board = JXG.JSXGraph.initBoard('dens_func_div', {boundingbox:[-4,4,4,-4], keepaspectratio: true, axis:true});
    dens_func_board.create('functiongraph', [dens_func,-4,4]);

    histogram_board = JXG.JSXGraph.initBoard('histogram_div', {boundingbox:[-4,4,4,-4], keepaspectratio: true, axis:true});
    histogram_board.create('functiongraph', [histogram,-4,4]);

    process_div   = document.getElementById("process_div");
    dist_func_div = document.getElementById("dist_func_div");
    dens_func_div = document.getElementById("dens_func_div");
    histogram_div = document.getElementById("histogram_div");
}

function replot(){
    generate_process();
    process_board.update();
    dist_func_board.update();
    dens_func_board.update();
    histogram_board.update();
    return false;
}

var process_div;
var dist_func_div;
var dens_func_div;
var histogram_div;

function show_process(){
    process_div.style.display = "block";
    dist_func_div.style.display = "none";
    dens_func_div.style.display = "none";
    histogram_div.style.display = "none";
}

function show_dist_func(){
    process_div.style.display = "none";
    dist_func_div.style.display = "block";
    dens_func_div.style.display = "none";
    histogram_div.style.display = "none";
}

function show_dens_func(){
    process_div.style.display = "none";
    dist_func_div.style.display = "none";
    dens_func_div.style.display = "block";
    histogram_div.style.display = "none";
}

function show_histogram(){
    process_div.style.display = "none";
    dist_func_div.style.display = "none";
    dens_func_div.style.display = "none";
    histogram_div.style.display = "block";
}