/**
 * |#Module#|: DocumentationGenerator
 * |#Author#|: Shahrukh
 * |#Language#|: C#
 * |#CreationDate#|: 8/9/2016
 *
 */


/*
* |#Name#|
* DocumentationGenerator
* |#Type#|
* Object > Function > Class Constructor
* |#Parameters#|
*
* |#Description#|
* This module allows for traversing of source code and compiling documentation based on the comments and language syntax, control, and design processing.
* Explicit markers/tokens, used as meta/action directive, allow for further customization, optimization, and advanced configuration of the resulting documentation.
* Directives are only processed when placed inside the specific programming language's single-line or multi-line comment. The comment syntax must be one that is supported by the official programming language syntax.
* Directives must be contained on its own line.
* Research Comment Syntax of various programming languages: https://en.wikipedia.org/wiki/Comparison_of_programming_languages_(syntax)#Comments
* */
function DocumentationGenerator(programName, programLanguage) {
	this.programName = programName;
    this.programLanguage = programLanguage;
	this.timeStamp = Date.now();
	this.programModules = [];
}

DocumentationGenerator.TOKEN = /^.*?\|#(\w+)#\|:\s?(.*?)\s*$/gm;

DocumentationGenerator.SUPPORTED_LANGUAGES = {
    JAVASCRIPT: { exts: ["js"], syntax: { statement: ";", block: "{}", comment: {inline:"//", block:"/\\*.*\\*/"} } },
    CSHARP: { exts: ["cs"], syntax: { statement: ";", block: "{}", comment: {inline:"///?", block:"/\\*\\*?.*\\*/"} } },
    CPLUSPLUS: { exts: ["cpp"], syntax: { statement: ";", block: "{}", comment: {inline:"//", block:"/\\*.*\\*/"}, lineContinuation: "\\" } },
    JAVA: { exts: ["java"], syntax: { statement: ";", block: "{}", comment: {inline:"//", block:"/\\*\\*?.*\\*/"} } }
};

/*
* fileText must be of type string. The fileText is
 */
DocumentationGenerator.prototype.parse = function(fileName, fileText) {
    var module = new ProgramModule();
    fileText.split("\n").forEach(function(line) {
        if (line)
            return;
        
    });
};

function ProgramModule(moduleName) {
	this.name = moduleName;
    this.authorName;
    this.language;
    this.creationDate;
	this.members = {
		constructors : [],
		properties: [],
		methods: [],
		fields: []
	};
}

function ProgramMember() {
	this.name;
	this.description;
	this.syntax = {
		parameters: [{
            name: "test",
            type: "",
            description: "",
            flags: 0 //
        }]
	};
	this.details;
	this.examples = [];
}

function ProgramConstructor() {
	ProgramMember.call(this);
}
ProgramConstructor.prototype = Object.create(ProgramMember.prototype);
ProgramConstructor.prototype.constructor = ProgramConstructor;

function ProgramProperty() {
	ProgramMember.call(this);
}
ProgramProperty.prototype = Object.create(ProgramMember.prototype);
ProgramProperty.prototype.constructor = ProgramProperty;

function ProgramMethod() {
	ProgramMember.call(this);
}
ProgramMethod.prototype = Object.create(ProgramMember.prototype);
ProgramMethod.prototype.constructor = ProgramMethod;

function ProgramField() {
	ProgramMember.call(this);
}
ProgramField.prototype = Object.create(ProgramMember.prototype);
ProgramField.prototype.constructor = ProgramField;
