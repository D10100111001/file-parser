/**
 * Created by Shahrukh on 8/15/2016.
 */

function Process(name, callback) {
	this.name = name;
	this.callback = callback;
}

function Option(key, callback, options) {
	this.name = key;
	this.callback = callback;
	var options = options || {};

	this.descriptor = options.descriptor || Option.DESCRIPTOR.OPTIONAL; //Bit Flag (bitwise OR for more descriptors)
	this.type = options.type || Option.TYPE.ANY;
	this.mutexGroup = options.mutexGroup || 0;
}

Option.prototype.validate = function (obj) {
	return (this.descriptor === Option.DESCRIPTOR.REQUIRED && obj.hasOwnProperty(this.name)) &&
		this.checkType(obj[this.name]);

}

Option.prototype.checkType = function (prop) {
	return (this.type === Option.TYPE.ANY ? true : (this.type == Option.getType(prop)));
}

Option.getType = function (prop) {
	return Object.prototype.toString.call(prop).match(/^\[object (.*)\]$/)[1];
}

Option.DESCRIPTOR = {
	OPTIONAL: 0,
	REQUIRED: 1
};

Option.TYPE = {
	NONE: null,
	ANY: "Any",
	OBJ: "Object",
	ARR: "Array",
	STR: "String",
	FN: "Function",
	NUM: "Number"
}

function InvalidOptionFormatException(value) {
	this.value = value;
	this.message = "Invalid Option Format: ";
	this.toString = function () {
		return this.message + this.value;
	};
}

function PipelineHandler(name, pipeline, obj, data) {
	this.name = name;
	this.pipeline = pipeline;
	this.obj = obj;
	this.data = data;

	var validateOptions = function () {
		for (var oIndex in this.pipeline) {
			var element = this.pipeline[oIndex];
			if (!PipelineHandler.validateElementType(element))
				return element + " is not an instace of the supported chain element types (" + PipelineHandler.SupportedChainElementTypes.toString() + ".";
			else if (!element.validate(this.obj))
				return element + " does not match its descriptor and/or type requirements."
		}
		return true;
	}
	var message;
	if ((message = validateOptions()) !== true)
		throw new InvalidOptionFormatException(message);

	this.exclusivityFlag = 0;
}

PipelineHandler.validateElementType = function (element) {
	return PipelineHandler.SupportedChainElementTypes.some(function (t) {
		return element instanceof t;
	});
}

PipelineHandler.SupportedChainElementTypes = [
	Option,
	Process
];

PipelineHandler.prototype.process = function () {
	var self = this;
	var chainResult = {};
	result = null;
	for (var i in self.pipeline) {
		var element = self.pipeline[i];
		var value;
		if (element instanceof Option && !this.obj.hasOwnProperty(element.name))
			continue;
		if (element instanceof Option) {
			var currentObjOptionValue = this.obj[element.name];
			if (element.mutexGroup > 0) {
				if (this.exclusivityFlag & element.mutexGroup)
					throw new InvalidOptionFormatException("The option " + element.name + " is not mutually exclusive to its mutexGroup " + element.mutexGroup + ". Mutex Group Options: " + this.pipeline.filter(o => o.mutexGroup === element.mutexGroup));
				else
					this.exclusivityFlag |= element.mutexGroup;
			}
			switch (Option.getType(currentObjOptionValue)) {
				case Option.TYPE.FN:
					value = currentObjOptionValue.call(this.data);
					break;
				default:
					value = currentObjOptionValue;
					break;
			}
		}
		chainResult[element.name] = result = element.callback ? element.callback.call(chainResult, value) : value;
	}
	return { name: this.obj.name, value: result, chain: chainResult };
};
