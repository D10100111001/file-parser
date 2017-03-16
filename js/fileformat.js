
function FileFormatSection(section, options) {
    var self = this;
    self.name = section.name;
    self.fields = section.fields;
}

function FileFormat(fileFormat) {
    this.defaultFieldSize = DataReader.x86StorageSizeENUM.WORD;
    this.defaultEndianess = DataReader.EndiannessENUM.BIG_ENDIAN;
    //this.defaultfieldType =
    this.sections = [];
    if (arguments.length >= 1) {
        if (Array.isArray(fileFormat)) {
            this.sections = fileFormat.map(function(ffSection) { return new FileFormatSection(ffSection); });
        } else if (typeof fileFormat === "object") {
            this.sections = fileFormat.spec.map(function(ffSection) {return new FileFormatSection(ffSection); });
            this.defaultFieldSize = fileFormat.meta.size || this.defaultFieldSize;
            this.defaultEndianess = fileFormat.meta.endianness || this.defaultEndianess;
        }
    }
}

FileFormat.prototype.createClasses = function () {
    var self = this;
    self.classes = {};
    self.sections.forEach(function (section) {
        var className = section.name.replace(/[^\d\w]*/g, "");
        this.classes[className] = function () {
            var fnThis = this;
            section.fields.forEach(function (field) {
                var fieldType = typeof field;
                if (fieldType === "string")
                    this[field] = null;
                else if (fieldType === "object") {
                    if (field.count > 1)
                        this[field.name] = [];
                    else
                        this[field.name] = null;
                }
            }, fnThis);
        }
        Object.defineProperty(this.classes[className], "name", {value: className});
    }, self);
};

FileFormat.getReadDataFn = function(dr) {
	return function() {
		"use strict";
		//If the size is explicitly set to null, no data is read and the returned value from the process function is returned.
		if (this.size === null)
			return this.process;
		var data = [];
		var count = this.count || 1;
		if (this.fields)
			data = null;
		else
			for (var i = 0; i < count; i++)
				data.push(dr.read(this.size));
		return data;
	}

}

FileFormat.getPipeline = function(dr) {
	var pipeline = [];
	pipeline.push(new Option("process", null, { type: Option.TYPE.FN }),
				 new Option("skip", function(value) { dr.skipBytes(value); }, { mutexGroup: 1 }),
				 new Option("skipTo", function(value) { dr.skipTo(value); }, { mutexGroup: 1 }),
				 new Option("size"),
				 new Option("count"),
				 new Option("fields"),
				 new Process("readData", FileFormat.getReadDataFn(dr)),
				 new Option("map", function(value) { return this.readData.map(function(e) { return value[e] || e; }) }, { mutexGroup: 2 }),
				 new Option("flag", function(value) { return this.readData.map(function(e) { var flags = []; Object.keys(value).forEach(function(f) { if (f & e) flags.push(value[f]); }); return flags; }) }, { mutexGroup: 2 }),
				 new Option("format", function(value) { return this.readData.map(function(e) { switch (value.toUpperCase()) { case "ASCII": return byteArrToString(intToByteArr(e, dr.endianness)); case "DATE": return new Date(e*1000).toUTCString(); } }) }, { mutexGroup: 2 }));
	return pipeline;
}


FileFormat.prototype.parse = function (ArrBuffer) {
    var self = this;
    var dr = new DataReader(ArrBuffer);
    dr.endianness = self.defaultEndianess;
    dr.defaultReadSize = self.defaultFieldSize;
	var pipeline = FileFormat.getPipeline(dr);
    var fileSections = {};

    self.sections.forEach(function (section) {
        var className = section.name.replace(/[^\d\w]*/g, "");
        fileSections[className] = new this.classes[className]();
        var sectionData = fileSections[className];
		FileFormat.parseFields(section.fields, pipeline, dr, sectionData, fileSections);

    }, self);
    return fileSections;
};

FileFormat.parseFields = function(fields, pipeline, dr, sectionData, fileSections) {
	"use strict";
	var data = [];
	fields.forEach(function (field) {
		var fieldType = typeof field;
		if (fieldType === "string") {
			sectionData[field] = dr.read();
			data.push(field);
		} else if (fieldType === "object") {
			/*
			 *  process | optional
			 *  skip or skipTo | optional
			 *  size | optional
			 *  count | optional
			 *  map or flag or format | optional
			 */
			var fieldHandler = new PipelineHandler("fieldProcessor", pipeline, field, fileSections);
			var result = fieldHandler.process();
			if (field.fields) {
				//TODO: Simplify this step to allow parsing of fields once and using the same field specification in a loop.
				result.value = [];
				var i = 0;
				var retData = null;

				while((result.chain.count || 1) > i) {
					result.value[i] = {};
					if (!retData)
						retData = FileFormat.parseFields(field.fields, pipeline, dr, result.value[i], fileSections);
					else {
						for (var f = 0; f < retData.length; f++) {
							if (typeof retData[f] === "string")
								result.value[i][retData[f]] = dr.read();
							else if (typeof retData[f] === "object") {
								var resData = FileFormat.getReadDataFn(dr).call(retData[f].chain);
								result.value[i][retData[f].name] = Array.isArray(resData) && resData.length === 1 ? resData[0] : resData;
							}
						}
					}
					i++;
				}
			}
			data.push(result);
			sectionData[field.name] = Array.isArray(result.value) && result.value.length === 1 ? result.value[0] : result.value;
		}
	});
	return data;
}

function roundUp(numToRound, multiple) {
    if (multiple === 0)
        return numToRound;

    var remainder = numToRound % multiple;
    if (remainder === 0)
        return numToRound;

    return Math.ceil(numToRound + multiple - remainder);
}

function intToByteArr(val, endianness) {
	if (!Number.isSafeInteger(val))
    	throw "Invalid Value: Not a Safe Integer!";
    endianness = endianness || 0;
    var bytes = roundUp(Math.log2(val), 8) / 8;
    var byteArr = new Uint8Array(bytes);
    var i = bytes;
    while (i--) {
        var byte = val & 0xFF;
        byteArr[i] = byte;
        val = val / 256;
    }
    if (endianness)
    	byteArr.reverse();
    return byteArr;
}

function byteArrToString(arr) {
    //return arr.map(String.fromCharCode).join("");
    var ASCIIArr = [];
    arr.forEach(function (e) {
        ASCIIArr.push(String.fromCharCode(e));
    });
    return ASCIIArr.join("");
}
