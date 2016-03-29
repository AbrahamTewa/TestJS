import DOMProject from './DOMProject';
import TestUnit from './TestUnit';

/**
 *
 * @constructor
 * @class Project
 * @extends TestUnit
 * @property {string[]}    authors
 * @property {string}      description
 * @property {string}      name
 */
var Project                                   = function Project(name) {
   TestUnit.call(this, {project: this, title : name});

   this.name    = !name ? 'Test' : name;
   this.authors = [];
   this.domProject = new DOMProject(this);
};

Project.prototype                             = Object.create(TestUnit.prototype);
//noinspection JSUnusedGlobalSymbols
Project.prototype.constructor                 = Project;

//noinspection JSUnusedGlobalSymbols
/**
 *
 * @param {string} author
 */
Project.prototype.addAuthor                   = function (author) {
   this.authors.push(author);
};

/**
 *
 * @param {string|HTMLElement} [location='body']
 * @returns {Promise}
 */
Project.prototype.display                     = function (location) {

   location = location ? location : 'body';

   document.addEventListener("DOMContentLoaded", function() {
      this.domProject.display(location);
   }.bind(this));

};

/**
 *
 * @returns {string[]}
 */
Project.prototype.getAuthors                  = function () {
   return this.authors.slice(0);
};

/**
 *
 * @param {Date} date
 * @returns {number|undefined}
 */
Project.prototype.getTime                     = function (date) {
   if (date === undefined)
      return undefined;
   return date - this.getStartDate();
};

/**
 *
 * @returns {boolean}
 */
Project.prototype.isUnitTest                  = function () {
   return false;
};

Project.prototype.isValid                     = function () {
   return true;
};

//noinspection JSUnusedGlobalSymbols
/**
 *
 * @param {string} title
 */
Project.prototype.setTitle                    = function (title) {
   this.title = title;
};

export default Project;