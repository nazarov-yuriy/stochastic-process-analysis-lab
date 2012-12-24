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

//states
var loaded_from_file = false;

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

var dens_chart = [
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0];
var dist_chart = [];
//==== process data ====
var y = [];
var proc = [0];
var j = [];
var min_y = 0;
var max_y = 0;
//==== processes parameters ====
var n = 100;
var a = 1;
var b = 1;
var sigma = 1;
var lambda = 1;
var mu = 0;
var tau = 0;

//=== calc params ===
var disc_int = 1;

//==== charactyristics ===
var m1;
var m2;
var m3;
var m4;

var v1;
var v2;
var v3;
var v4;

var sigma1;
var assim;
var exc;

//==== functions that produce process data values ====
function generate_uniform(n,a,b){
    min_y = Number.POSITIVE_INFINITY;
    max_y = Number.NEGATIVE_INFINITY;
    proc[0] = 0;

    for(var i = 0 ; i<n;i++){
        y[i] = a+Math.random()*(b-a);
        proc[i+1] = proc[i]+y[i];
        if(y[i]<min_y)
            min_y = y[i];
        if(y[i]>max_y)
            max_y = y[i];
    }
}

function generate_norm(n,sigma,mu){
    min_y = Number.POSITIVE_INFINITY;
    max_y = Number.NEGATIVE_INFINITY;

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
        proc[i+1] = proc[i]+y[i];

        if(y[i]<min_y)
            min_y = y[i];
        if(y[i]>max_y)
            max_y = y[i];
    }
}

function generate_lognorm(n,sigma,mu){
    min_y = Number.POSITIVE_INFINITY;
    max_y = Number.NEGATIVE_INFINITY;

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
        proc[i+1] = proc[i]+y[i];

        if(y[i]<min_y)
            min_y = y[i];
        if(y[i]>max_y)
            max_y = y[i];
    }
}

function generate_exp(n,lambda){
    min_y = Number.POSITIVE_INFINITY;
    max_y = Number.NEGATIVE_INFINITY;

    for(var i = 0 ; i<n;i++){
        y[i] = -Math.log( Math.random() )/lambda;
        proc[i+1] = proc[i]+y[i];

        if(y[i]<min_y)
            min_y = y[i];
        if(y[i]>max_y)
            max_y = y[i];
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
    for(var i = 0; i < 500; i++){
        res += lx/(2*i+1);
        lx = -lx*x*x;
    }
    return 2*res/Math.sqrt(Math.PI);
}

function dist_normal(x){
    return ( 1 + erf( (x - mu)/Math.sqrt(2*sigma*sigma) ) )/2;
}

function dist_lognormal(x){
    if(x<=0)
        return 0;
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
        ret = Math.exp( -(Math.log(x)-mu)*(Math.log(x)-mu)/(2*sigma*sigma) )/(x*sigma*Math.sqrt(2*Math.PI));
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
function dist_func_real(x){
    var ret = 0;
    var addr_down = Math.floor( 100*(x-min_y)/(max_y-min_y) );
    var addr_up   = -Math.floor( -100*(x-min_y)/(max_y-min_y) );
    var fract     = 100*(x-min_y)/(max_y-min_y) - addr_down;

    if(0<=addr_up && addr_down <= 100){
        var d = (addr_down < 0) ? 0 : dist_chart[addr_down];
        var u = (addr_up > 100) ? 1 : dist_chart[addr_up];
        ret = u*fract + d*(1-fract);
    } else if (100 < addr_down) {
        ret = 1;
    }
    return ret;
}

function dist_func(x){
    var ret = 0;
    if(loaded_from_file)
        return 0;
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

function dens_func_real(x){
    var ret = 0;
    var addr_down = Math.floor( 100*(x-min_y)/(max_y-min_y) );
    var addr_up   = -Math.floor( -100*(x-min_y)/(max_y-min_y) );
    var fract     = 100*(x-min_y)/(max_y-min_y) - addr_down;

    if(0<=addr_up && addr_down <= 99){
        var d = (addr_down < 0) ? 0 : dens_chart[addr_down];
        var u = (addr_up > 99) ? 0 : dens_chart[addr_up];
        ret = u*fract + d*(1-fract);
    } else if (99 < addr_down) {
        ret = 0;
    }
    return ret;
}

function dens_func(x){
    var ret = 0;
    if(loaded_from_file)
        return 0;
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
function fill_hyst(){
    var cor = 100;
    dens_chart = [];
    for (var i = 0; i < cor; i++) {
        dens_chart[i] = 0;
    }
    for(i = 0; i < y.length; i++){
        var addr = Math.floor( cor*(y[i]-min_y)/(max_y-min_y) );
        if (0 <= addr)
            dens_chart[addr]+=cor/ y.length/(max_y-min_y);
    }
    dist_chart[0] = 0;
    for (i = 0; i < cor; i++) {
        dist_chart[i+1] = dist_chart[i] + dens_chart[i]*(max_y-min_y)/cor;
    }
}
function fill_process_graph(){
    for(var i = 0; i < Math.min(y.length,1000); i++){
        x_graph[i] = i;
        y_graph[i] = y[i];
    }
}

function fill_process(){
    var d1 = new Date();
    var start = d1.getTime();

    n      = parseInt(form.param_N.value);
    a      = parseFloat(form.param_a.value);
    b      = parseFloat(form.param_b.value);
    sigma  = parseFloat(form.param_sigma.value);
    lambda = parseFloat(form.param_lambda.value);
    mu     = parseFloat(form.param_mu.value);
    tau    = parseFloat(form.param_tau.value);

    disc_int= parseFloat(form.param_int.value);

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

    fill_process_graph();

    var d2 = new Date();
    var end = d2.getTime();
    status.textContent = "Сгенерировано за "+(end-start)+" мс.";
}

function calc_char(){
    v1 = 0;
    v2 = 0;
    v3 = 0;
    v4 = 0;
    for(var i=0; i<y.length; i++){
        v1 += y[i];
        v2 += y[i]*y[i];
        v3 += y[i]*y[i]*y[i];
        v4 += y[i]*y[i]*y[i]*y[i];
    }
    v1 = v1/n;
    v2 = v2/n;
    v3 = v3/n;
    v4 = v4/n;

    m1 = 0;
    m2 = 0;
    m3 = 0;
    m4 = 0;
    for(i=0; i<y.length; i++){
        m1 += y[i]-v1;
        m2 += (y[i]-v1)*(y[i]-v1);
        m3 += (y[i]-v1)*(y[i]-v1)*(y[i]-v1);
        m4 += (y[i]-v1)*(y[i]-v1)*(y[i]-v1)*(y[i]-v1);
    }
    m1 = m1/n;
    m2 = m2/n;
    m3 = m3/n;
    m4 = m4/n;

    sigma1 = Math.sqrt(m2);

    assim = m3/(sigma1*sigma1*sigma1);
    exc   = m4/(sigma1*sigma1*sigma1*sigma1)-3;
}

function graph_load(){
    form = document.forms['params_form'];
    status = document.getElementById('status');

    process_board = JXG.JSXGraph.initBoard('process_div', {boundingbox:[0, 1.1, 1000, -0.1], axis:true});
    process_board.create('curve', [x_graph,y_graph],{strokeColor:'blue'});

    dist_func_board = JXG.JSXGraph.initBoard('dist_func_div', {boundingbox:[-5,1.1,5,-0.1], axis:true});
    dist_func_board.create('functiongraph', [dist_func_real,-10,50],{strokeColor:'green',strokeWidth:3});
    dist_func_board.create('functiongraph', [dist_func,-10,50],{strokeColor:'blue'});

    dens_func_board = JXG.JSXGraph.initBoard('dens_func_div', {boundingbox:[-5,1.1,5,-0.1], axis:true});
    dens_func_board.create('functiongraph', [dens_func_real,-10,50],{strokeColor:'green',strokeWidth:3});
    dens_func_board.create('functiongraph', [dens_func,-10,50],{strokeColor:'blue'});

    histogram_board = JXG.JSXGraph.initBoard('histogram_div', {boundingbox:[0,1.1,101,-0.01], axis:true});
    //MAKE ME UNSEE IT
    var f;
    f = [
        function(){return dens_chart[0];}, function(){return dens_chart[1];}, function(){return dens_chart[2];}, function(){return dens_chart[3];}, function(){return dens_chart[4];},
        function(){return dens_chart[5];}, function(){return dens_chart[6];}, function(){return dens_chart[7];}, function(){return dens_chart[8];}, function(){return dens_chart[9];},
        function(){return dens_chart[10];}, function(){return dens_chart[11];}, function(){return dens_chart[12];}, function(){return dens_chart[13];}, function(){return dens_chart[14];},
        function(){return dens_chart[15];}, function(){return dens_chart[16];}, function(){return dens_chart[17];}, function(){return dens_chart[18];}, function(){return dens_chart[19];},
        function(){return dens_chart[20];}, function(){return dens_chart[21];}, function(){return dens_chart[22];}, function(){return dens_chart[23];}, function(){return dens_chart[24];},
        function(){return dens_chart[25];}, function(){return dens_chart[26];}, function(){return dens_chart[27];}, function(){return dens_chart[28];}, function(){return dens_chart[29];},
        function(){return dens_chart[30];}, function(){return dens_chart[31];}, function(){return dens_chart[32];}, function(){return dens_chart[33];}, function(){return dens_chart[34];},
        function(){return dens_chart[35];}, function(){return dens_chart[36];}, function(){return dens_chart[37];}, function(){return dens_chart[38];}, function(){return dens_chart[39];},
        function(){return dens_chart[40];}, function(){return dens_chart[41];}, function(){return dens_chart[42];}, function(){return dens_chart[43];}, function(){return dens_chart[44];},
        function(){return dens_chart[45];}, function(){return dens_chart[46];}, function(){return dens_chart[47];}, function(){return dens_chart[48];}, function(){return dens_chart[49];},
        function(){return dens_chart[50];}, function(){return dens_chart[51];}, function(){return dens_chart[52];}, function(){return dens_chart[53];}, function(){return dens_chart[54];},
        function(){return dens_chart[55];}, function(){return dens_chart[56];}, function(){return dens_chart[57];}, function(){return dens_chart[58];}, function(){return dens_chart[59];},
        function(){return dens_chart[60];}, function(){return dens_chart[61];}, function(){return dens_chart[62];}, function(){return dens_chart[63];}, function(){return dens_chart[64];},
        function(){return dens_chart[65];}, function(){return dens_chart[66];}, function(){return dens_chart[67];}, function(){return dens_chart[68];}, function(){return dens_chart[69];},
        function(){return dens_chart[70];}, function(){return dens_chart[71];}, function(){return dens_chart[72];}, function(){return dens_chart[73];}, function(){return dens_chart[74];},
        function(){return dens_chart[75];}, function(){return dens_chart[76];}, function(){return dens_chart[77];}, function(){return dens_chart[78];}, function(){return dens_chart[79];},
        function(){return dens_chart[80];}, function(){return dens_chart[81];}, function(){return dens_chart[82];}, function(){return dens_chart[83];}, function(){return dens_chart[84];},
        function(){return dens_chart[85];}, function(){return dens_chart[86];}, function(){return dens_chart[87];}, function(){return dens_chart[88];}, function(){return dens_chart[89];},
        function(){return dens_chart[90];}, function(){return dens_chart[91];}, function(){return dens_chart[92];}, function(){return dens_chart[93];}, function(){return dens_chart[94];},
        function(){return dens_chart[95];}, function(){return dens_chart[96];}, function(){return dens_chart[97];}, function(){return dens_chart[98];}, function(){return dens_chart[99];}];
    histogram_board.create('chart', [f], {chartStyle:'bar',width:0.9});

}

function update_graphs(){
    process_board.setBoundingBox([0,min_y + 1.1*(max_y-min_y),Math.min(y.length, 1000),max_y - 1.1*(max_y-min_y)], false);
    process_board.update();

    dist_func_board.setBoundingBox([max_y - 1.1*(max_y-min_y),1.1,min_y + 1.1*(max_y-min_y),-0.1], false);
    dist_func_board.update();

    dens_func_board.setBoundingBox([max_y - 1.1*(max_y-min_y),1.1,min_y + 1.1*(max_y-min_y),-0.1], false);
    dens_func_board.update();

    histogram_board.update();
}

function in_interval(tau){
    var to = 1;
    var j_max = 0;
    for(var from=0; from<proc.length-1; from++){
        while(proc[from]+tau > proc[to] && to<proc.length){
            to++;
        }
        j[from] = to-from;
        j_max = Math.max(j_max, to-from);
    }
    return j_max;
}

//==== "generate" button handler. Generate and update graphs.
function replot(){
    loaded_from_file = false;
    fill_process();
    fill_hyst();
    update_graphs();
    show_link();

    calc_char();

    var res2 = 0;
    res2 = in_interval(tau);
    document.getElementById('res').textContent = "Мат.ожидание: "+v1+"\nДисперсия: "+m2+"\nКоэф. асимметрии: "+assim+"\nКоэф. эксцесса: "+exc+"\nМакс. число отсчётов на интервале наблюдения: "+res2;

    return false;
}

document.addEventListener("DOMContentLoaded", graph_load, false);
