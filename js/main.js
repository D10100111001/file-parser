
var spec = [
    { name: "MS-DOS Header", properties:
        [ "magic",
            "usedBytesInLastPage",
            "fileSizeInPages",
            "numRelocationItems",
            "headerSizeInParagraphs",
            "minExtraParagraphs",
            "maxExtraParagraphs",
            "initialSS",
            "initialSP",
            "checksum",
            "initialIP",
            "initialRelativeCS",
            "addressOfRelocationTable",
            "overlayNumber",
            { name: "reserved", count: 4 },
            "oemId",
            "oemInfo",
            { name : "reserved2",  count: 4 },
            { name: "addressOfNewExeHeader", size: DataReader.x86StorageSizeENUM.DWORD },
            { name: "stubSize", calc: function() {
                var stubSize = this.fileSizeInPages * 512 - (512 - this.usedBytesInLastPage);
                if (stubSize > this.addressOfNewExeHeader)
                    stubSize = this.addressOfNewExeHeader;
                stubSize -= this.headerSizeInParagraphs * 16;
                return stubSize;
            } }
        ]}
];

var a = new FileFormat(spec);
a.createClasses();

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.


    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        output.push('<li><strong>', htmlEncode(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
            '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function htmlEncode( html ) {
    return document.createElement( 'a' ).appendChild(
        document.createTextNode( html ) ).parentNode.innerHTML;
};

function htmlDecode( html ) {
    var a = document.createElement( 'a' ); a.innerHTML = html;
    return a.textContent;
};

// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

https://jsfiddle.net/8pgg0aq8/
