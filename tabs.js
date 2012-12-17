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

//==== stupid tabs logic
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

function tabs_load(){
    process_div   = document.getElementById("process_div");
    dist_func_div = document.getElementById("dist_func_div");
    dens_func_div = document.getElementById("dens_func_div");
    histogram_div = document.getElementById("histogram_div");
}

document.addEventListener("DOMContentLoaded", tabs_load, false);