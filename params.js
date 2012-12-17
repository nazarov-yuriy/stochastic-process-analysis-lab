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

//==== stupid params show/hide logic

var div_N;
var div_a;
var div_b;
var div_lambda;
var div_sigma;
var div_mu;

function show(div){
    div.style.display = '';
}

function hide(div){
    div.style.display = 'none';
}

function params_show(select){
    switch(select.value){
        case 'uniform':
            show(div_a);
            show(div_b);
            hide(div_lambda);
            hide(div_sigma);
            hide(div_mu);
            break;
        case 'normal':
            hide(div_a);
            hide(div_b);
            hide(div_lambda);
            show(div_sigma);
            show(div_mu);
            break;
        case 'lognormal':
            hide(div_a);
            hide(div_b);
            hide(div_lambda);
            show(div_sigma);
            show(div_mu);
            break;
        case 'exp':
            hide(div_a);
            hide(div_b);
            show(div_lambda);
            hide(div_sigma);
            hide(div_mu);
            break;
    }
}

function params_load(){
    div_N      = document.getElementById('div_N');
    div_a      = document.getElementById('div_a');
    div_b      = document.getElementById('div_b');
    div_lambda = document.getElementById('div_lambda');
    div_sigma  = document.getElementById('div_sigma');
    div_mu     = document.getElementById('div_mu');
}

document.addEventListener("DOMContentLoaded", params_load, false);