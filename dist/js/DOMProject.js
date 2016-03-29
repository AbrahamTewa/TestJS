'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _DOMTest = require('./DOMTest');

var _DOMTest2 = _interopRequireDefault(_DOMTest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param {Project} project
 * @constructor
 * @class DOMProject
 * @extends DOMTest
 * @property {boolean} collapsed
 * @property {string}  title
 */
var DOMProject = function DOMProject(project) {
   _DOMTest2.default.call(this, project);
   this.project = project;
   this.collapsed = false;
};

DOMProject.prototype = Object.create(_DOMTest2.default.prototype);
//noinspection JSUnusedGlobalSymbols
DOMProject.prototype.constructor = DOMProject;

/**
 * Build the DOM of the project.
 * @param {boolean} collapsed If true, then all tests will be collapsed.
 */
DOMProject.prototype.buildDOM = function buildDOM(collapsed) {

   this.globalDOM = document.createElement('div');
   this.globalDOM.classList.add('testJS');

   _DOMTest2.default.prototype.buildDOM.call(this, collapsed);

   this.dom.classList.remove('test');
   this.dom.classList.add('project');

   this.globalDOM.appendChild(this.dom);

   // Add authors
};

/**
 * @param {string|HTMLElement} location
 */
DOMProject.prototype.display = function display(location) {
   var /** @type {HTMLElement} */dom;

   dom = location instanceof HTMLElement ? location : document.querySelector(location);
   this.buildDOM(false);

   dom.appendChild(this.globalDOM);
};

/**
 *
 * @returns {Object}
 */
DOMProject.prototype.getTemplateData = function getTemplateData() {

   var /** @type {Object} */data;

   data = _DOMTest2.default.prototype.getTemplateData.call(this);
   data['authors'] = this.project.getAuthors();

   return data;
};

exports.default = DOMProject;
//# sourceMappingURL=DOMProject.js.map
