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

var dens_chart = [1,2,3,4];
//==== process data ====
var y = [];
//==== processes parameters ====
var n;
var a;
var b;
var sigma;
var lambda;
var mu;

//==== functions that produce process data values ====
function generate_uniform(n,a,b){
    for(var i = 0 ; i<n;i++){
        y[i] = a+Math.random(b-a);
    }
}

function generate_norm(n,sigma,mu){
    for(var i = 0 ; i<n;i++){
        var lx;
        var ly;
        var ls;

        //Используется Преобразование Бокса — Мюллера
        var lz;
        do {
            lx = 2 * Math.random() - 1;
            ly = 2 * Math.random() - 1;
            ls = lx * lx + ly * ly;
        } while (ls > 1 || ls == 0);
        lz = lx * Math.sqrt( -2 * Math.log(ls) / ls );

        y[i] = mu+sigma*lz;
    }
}

function generate_lognorm(n,sigma,mu){
    for(var i = 0 ; i<n;i++){
        var lx;
        var ly;
        var ls;

        //Используется Преобразование Бокса — Мюллера
        var lz;
        do {
            lx = 2 * Math.random() - 1;
            ly = 2 * Math.random() - 1;
            ls = lx * lx + ly * ly;
        } while (ls > 1 || ls == 0);
        lz = lx * Math.sqrt( -2 * Math.log(ls) / ls );

        y[i] = Math.exp( mu+sigma*lz );
    }
}

function generate_exp(n,lambda){
    for(var i = 0 ; i<n;i++){
        y[i] = -Math.log( Math.random() )/lambda;
    }
}

//==== analytical distribution dunctions ====
function dist_uniform(x){
    var ret = 0;
    if(a<=x && x<=b){
        ret = (x-a)/(b-a);
    } else if(b < x) {
        ret = 1;
    }
    return ret;
}

//ToDo: improve error function calculation
function erf(x){
    var res = 0;
    var lx=x;
    for(var i = 0; i < 5000; i++){
        res += lx/(2*i+1);
        lx = -lx*x*x;
    }
    return 2*res/Math.sqrt(Math.PI);
}

function dist_normal(x){
    return ( 1 + erf( (x - mu)/Math.sqrt(2*sigma*sigma) ) )/2;
}

function dist_lognormal(x){
    return ( 1 + erf( ( Math.log(x) - mu)/Math.sqrt(2*sigma*sigma) ) )/2;
}

function dist_exp(x){
    var ret = 0;
    if(x>0)
        ret = 1-Math.exp(-lambda * x);
    return ret;
}

//==== analytical density dunctions ====
function dens_uniform(x){
    var ret = 0;
    if(a<=x && x<=b){
        ret = 1/(b-a);
    }
    return ret;
}

function dens_normal(x){
    return Math.exp( -(x-mu)*(x-mu)/(2*sigma*sigma) )/(sigma*Math.sqrt(2*Math.PI));
}

function dens_lognormal(x){
    var ret = 0;
    if(x>0){
        ret = Math.exp( -(Math.log(x)-mu)*(Math.log(x)-mu)/(2*sigma*sigma) )/(sigma*Math.sqrt(2*Math.PI));
    }
    return ret;
}

function dens_exp(x){
    var ret = 0;
    if(x>0){
        ret = lambda * Math.exp(-lambda*x);
    }
    return ret;
}

//==== functions for graphs ====
function dist_func(x){
    var ret = 0;
    switch(form.process_type_select.value){
        case 'uniform':   ret = dist_uniform(x);
            break;
        case 'normal':    ret = dist_normal(x);
            break;
        case 'lognormal': ret = dist_lognormal(x);
            break;
        case 'exp':       ret = dist_exp(x);
            break;
    }
    return ret;
}

function dens_func(x){
    var ret = 0;
    switch(form.process_type_select.value){
        case 'uniform':   ret = dens_uniform(x);
            break;
        case 'normal':    ret = dens_normal(x);
            break;
        case 'lognormal': ret = dens_lognormal(x);
            break;
        case 'exp':       ret = dens_exp(x);
            break;
    }
    return ret;
}

//==== other logic ===
function fillProcess(){
    var d1 = new Date();
    var start = d1.getTime();

    n      = parseInt(form.param_N.value);
    a      = parseFloat(form.param_a.value);
    b      = parseFloat(form.param_b.value);
    sigma  = parseFloat(form.param_sigma.value);
    lambda = parseFloat(form.param_lambda.value);
    mu     = parseFloat(form.param_mu.value);

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

    process_board = JXG.JSXGraph.initBoard('process_div', {boundingbox:[0,1.1,100,-0.1], axis:true});
    process_board.create('curve', [x_graph,y_graph]);

    dist_func_board = JXG.JSXGraph.initBoard('dist_func_div', {boundingbox:[-5,1.1,5,-0.1], axis:true});
    dist_func_board.create('functiongraph', [dist_func,-10,10]);

    dens_func_board = JXG.JSXGraph.initBoard('dens_func_div', {boundingbox:[-5,1.1,5,-0.1], axis:true});
    dens_func_board.create('functiongraph', [dens_func,-10,10]);

    histogram_board = JXG.JSXGraph.initBoard('histogram_div', {boundingbox:[0,5.1,100,-0.1], axis:true});
    histogram_board.create('chart', dens_chart, {chartStyle:'bar',width:0.9});
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
