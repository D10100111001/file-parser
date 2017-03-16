/**
 * Created by Shahrukh on 7/31/2016.
 */

var a = new FileFormat(PESpec);
a.createClasses();

var reader;
var progress = document.querySelector('.percent');

function processFiles() {
    var fInput = document.getElementById("files");
    processFileSelect(fInput.files);
}

function errorHandler(evt) {
    switch (evt.target.error.code) {
        case evt.target.error.NOT_FOUND_ERR:
            alert('File Not Found!');
            break;
        case evt.target.error.NOT_READABLE_ERR:
            alert('File is not readable');
            break;
        case evt.target.error.ABORT_ERR:
            break; // noop
        default:
            alert('An error occurred reading this file.');
    }
    ;
}

function updateProgress(evt) {
    // evt is an ProgressEvent.
    if (evt.lengthComputable) {
        var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
        // Increase the progress bar length.
        if (percentLoaded < 100) {
            progressbar.setAttribute("style", "width: " + percentLoaded + "%");
            progressbar.textContent = percentLoaded + '%';
        }
    }
}
function handleFileSelect(evt) {
    var files = evt.target.files;
    var progressDiv = document.getElementById("progress");
    for (var i = 0, f; f = files[i]; i++) {
        var file = document.createElement("div");
        file.id = "file" + i;
        file.textContent = f.name;
        var progress = document.createElement("div");
        progress.className = "progress";
        var progressbar = document.createElement("div");
        progressbar.className = "progress-bar";
        progressbar.id = "progress-file" + i;
        progressbar.setAttribute("style", "width: 0%");
        progressbar.textContent = "0%";
        progress.appendChild(progressbar);
        var rmBtn = document.createElement("button");
        rmBtn.innerText = "x";
        file.appendChild(rmBtn);
        file.appendChild(progress);
        progressDiv.appendChild(file);
    }
}

function processFileSelect(files) {
    for (var i = 0, f; f = files[i]; i++) {
        reader = new FileReader();
        //reader.onerror = errorHandler;
        //reader.onprogress = updateProgress;
        reader.onabort = function (e) {
            alert('File read cancelled');
        };
        reader.onloadstart = function (e) {
            //document.getElementById('progress_bar').className = 'loading';
        };
        reader.onload = (function (f) {
            return function (e) {
                //progress.style.width = '100%';
                //progress.textContent = '100%';
                var file = {filename: f.name, data: a.parse(e.target.result)};
                console.log(file);
            }
        })(f);

        // Read in the image file as a binary string.
        reader.readAsArrayBuffer(f);
    }
}

document.getElementById('process').addEventListener('click', processFiles, false);
document.getElementById('files').addEventListener('change', handleFileSelect, false);
