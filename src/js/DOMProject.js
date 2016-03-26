import DOMTest from './DOMTest';

/**
 *
 * @param {Project} project
 * @constructor
 * @class DOMProject
 * @extends DOMTest
 * @property {boolean} collapsed
 * @property {string}  title
 */
var DOMProject                                = function DOMProject(project) {
   DOMTest.call(this, project);
   this.project   = project;
   this.collapsed = false;
};

DOMProject.prototype                          = Object.create(DOMTest.prototype);
//noinspection JSUnusedGlobalSymbols
DOMProject.prototype.constructor              = DOMProject;

/**
 * Build the DOM of the project.
 * @param {boolean} collapsed If true, then all tests will be collapsed.
 */
DOMProject.prototype.buildDOM                 = function buildDOM(collapsed) {

   this.globalDOM = document.createElement('div');
   this.globalDOM.classList.add('testJS');

   DOMTest.prototype.buildDOM.call(this, collapsed);

   this.dom.classList.remove('test');
   this.dom.classList.add('project');

   this.globalDOM.appendChild(this.dom);

   // Add authors
};

/**
 * @param {string|HTMLElement} location
 */
DOMProject.prototype.display                  = function display(location) {
   var /** @type {HTMLElement} */ dom;

   dom = location instanceof HTMLElement ? location : document.querySelector(location);
   this.buildDOM(false);

   dom.appendChild(this.globalDOM);
};

/**
 *
 * @returns {Object}
 */
DOMProject.prototype.getTemplateData          = function getTemplateData() {

   var /** @type {Object} */ data;

   data = DOMTest.prototype.getTemplateData.call(this);
   data['authors'] = this.project.getAuthors();

   return data;
};

export default DOMProject;