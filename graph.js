/**
 Copyright (C) 2012 Nazarov Yuriy

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

//==== graph boards ====
var process_board;
var dist_func_board;
var dens_func_board;
var histogram_board;

//==== some useful DOM elements ====
var form;
var status;

//==== data for graph ====
var x_graph = [];
var y_graph = [];
//==== process data ====
var y = [];

//==== functions that produce process data values ====
function generate_uniform(n,a,b){
    for(var i = 0 ; i<n;i++){
        y[i] = a+Math.random(b-a);
    }
}

function generate_norm(n,sigma,mu){
    for(var i = 0 ; i<n;i++){
        y[i] = Math.random();
    }
}

function generate_lognorm(n,sigma,mu){
    for(var i = 0 ; i<n;i++){
        y[i] = Math.random();
    }
}

function generate_exp(n,lambda){
    for(var i = 0 ; i<n;i++){
        y[i] = Math.random();
    }
}

//==== functions for graphs ====
function dist_func(x){
    return 0;
    //var sigma = form.param_sigm.value;
    //var mu = form.param_mu.value;
    //return Math.exp( -(x-mu)*(x-mu)/(2*sigma*sigma) )/ (sigma * Math.sqrt(2 * Math.PI));
}

function dens_func(x){
    return 0;
    //return y[Math.floor(x)];
}

function histogram(x){
    return 0;
    //return a * Math.sin(x)*Math.sin(x);
}

//==== other logic ===
function fillProcess(){
    var d1 = new Date();
    var start = d1.getTime();

    var n      = parseInt(form.param_N.value);
    var a      = parseFloat(form.param_a.value);
    var b      = parseFloat(form.param_b.value);
    var sigma  = parseFloat(form.param_sigma.value);
    var lambda = parseFloat(form.param_lambda.value);
    var mu     = parseFloat(form.param_mu.value);

    switch(form.process_type_select.value){
        case 'uniform':   generate_uniform(n, a, b);
            break;
        case 'normal':    generate_norm(n,sigma, mu);
            break;
        case 'lognormal': generate_lognorm(n, sigma, mu);
            break;
        case 'exp':       generate_exp(n, lambda);
            break;
    }

    for(var i = 0; i < n; i++){
        x_graph[i] = i;
        y_graph[i] = y[i];
    }

    var d2 = new Date();
    var end = d2.getTime();
    status.textContent = "Generated in "+(end-start)+" ms.";
}

function graph_load(){
    form = document.forms['params_form'];
    status = document.getElementById('status');

    process_board = JXG.JSXGraph.initBoard('process_div', {boundingbox:[0,1,100,-0.1], axis:true});
    process_board.create('curve', [x_graph,y_graph]);

    dist_func_board = JXG.JSXGraph.initBoard('dist_func_div', {boundingbox:[-5,1,5,-0.1], axis:true});
    dist_func_board.create('functiongraph', [dist_func,-4,4]);

    dens_func_board = JXG.JSXGraph.initBoard('dens_func_div', {boundingbox:[0,1,10000,-0.1], axis:true});
    dens_func_board.create('functiongraph', [dens_func,0,10000]);

    histogram_board = JXG.JSXGraph.initBoard('histogram_div', {boundingbox:[-4,4,4,-4], axis:true});
    histogram_board.create('functiongraph', [histogram,-4,4]);
}

//==== "generate" button handler. Generate and update graphs.
function replot(){
    fillProcess();
    generate_downloadlink();
    process_board.update();
    dist_func_board.update();
    dens_func_board.update();
    histogram_board.update();
    return false;
}

document.addEventListener("DOMContentLoaded", graph_load, false);