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

var header = "data:application/octet-stream,";

function show_link(){
    var link = document.getElementById('downloadlink');
    link.hidden = false;
}

function generate_downloadlink(){
    progress = 0;

    var link = document.getElementById('downloadlink');
    var crlf = "%0D%0A";
    var string=header+ y.length+crlf+"1";


    var quant = y.length/100;
    for(var i = 0; i < y.length; i++){
        progress = i/quant;

        var tmp = crlf + y[i];
        tmp=tmp.replace(/\./,"%2C");
        tmp=tmp.replace(/,/,"%2C");
        string += tmp;
    }
    link.href = string;

    progress = -1;
}

function generate_downloadlink_wrapper(){
    setTimeout(generate_downloadlink, 0);
}

function parse(text){
    var lines = text.split(/[\n\r]+/);
    var l_cnt = parseInt(lines[0]);
    //var l_disc = parseFloat(lines[1]);

    if( isNaN(l_cnt) ){
        window.alert("Count is not a number.");
    } else if(l_cnt != lines.length-2){
        window.alert("Count is not equal real elements count.");
    } else {
        y = [];
        min_y = Number.POSITIVE_INFINITY;
        max_y = Number.NEGATIVE_INFINITY;

        for(var i = 0; i < lines.length-2; i++){

            y[i] = parseFloat( lines[i+2].replace(",", ".") );
            if(y[i]<min_y)
                min_y = y[i];
            if(y[i]>max_y)
                max_y = y[i];
        }
        loaded_from_file = true;
        fill_process_graph();
        fill_hyst();
        update_graphs();
    }
}

function parse_file(fileinput){
    var files = fileinput.files;

    if (!files.length) {
        alert('Please select a file!');
        return;
    }

    var file = files[0];
    var start = 0;
    var stop = file.size - 1;

    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) {
            parse(evt.target.result);
        }
    };

    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
}

