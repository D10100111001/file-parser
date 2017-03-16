/**
 * Created by Shahrukh on 7/31/2016.
 */

function DataReader(ArrBuffer) {
    var position = 0;
	function gsPosition(value) {
		if (value)
			position = value;
		else
			return position;
	}

	this.getPosition = function() { return gsPosition(); };
	this.setPosition = function(value) { return gsPosition(value); }
    this.endianness = DataReader.EndiannessENUM.BIG_ENDIAN;
    this.defaultReadSize = DataReader.x86StorageSizeENUM.WORD;
    this.buffer = ArrBuffer;
    this.dataView = new DataView(this.buffer);
}

DataReader.EndiannessENUM = {
    BIG_ENDIAN: 0,
    LITTLE_ENDIAN: 1
}

DataReader.x86StorageSizeENUM = {
    BYTE: 1,
    WORD: 2,
    DWORD: 4,
    QWORD: 8,
    DQWORD: 16
};

DataReader.prototype.skipBytes = function (numBytes) {
    this.setPosition(this.getPosition() + numBytes);
}

DataReader.prototype.skipTo = function (byteOffset) {
    this.setPosition(byteOffset);
}

DataReader.prototype.read = function (bytes, options) {
    bytes = bytes || this.defaultReadSize;
    options = options || {};
    var returnVal;
    if (!(Math.log2(bytes) % 1)) {
        if (options.arrLength > 0)
            returnVal = new Uint8Array(this.buffer, this.getPosition(), options.arrLength);
        else if (bytes <= 4)
            returnVal = this.dataView['getUint' + (bytes * 8)](this.getPosition(), this.endianness);
    }
    this.setPosition(this.getPosition() + (bytes * (options.arrLength || 1)));
    return returnVal;
}

DataReader.prototype.readByte = function(arrLength) {
	return this.read(1, { arrLength: arrLength });
}

DataReader.prototype.readWord = function () {
    return this.read(DataReader.x86StorageSizeENUM.DWORD);
}

DataReader.prototype.readDWord = function () {
    return this.read(DataReader.x86StorageSizeENUM.DWORD);
}
