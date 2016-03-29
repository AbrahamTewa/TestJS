'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _DOMProject = require('./DOMProject');

var _DOMProject2 = _interopRequireDefault(_DOMProject);

var _TestUnit = require('./TestUnit');

var _TestUnit2 = _interopRequireDefault(_TestUnit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @constructor
 * @class Project
 * @extends TestUnit
 * @property {string[]}    authors
 * @property {string}      description
 * @property {string}      name
 */
var Project = function Project(name) {
   _TestUnit2.default.call(this, { project: this, title: name });

   this.name = !name ? 'Test' : name;
   this.authors = [];
   this.domProject = new _DOMProject2.default(this);
};

Project.prototype = Object.create(_TestUnit2.default.prototype);
//noinspection JSUnusedGlobalSymbols
Project.prototype.constructor = Project;

//noinspection JSUnusedGlobalSymbols
/**
 *
 * @param {string} author
 */
Project.prototype.addAuthor = function (author) {
   this.authors.push(author);
};

/**
 *
 * @param {string|HTMLElement} [location='body']
 * @returns {Promise}
 */
Project.prototype.display = function (location) {

   location = location ? location : 'body';

   document.addEventListener("DOMContentLoaded", function () {
      this.domProject.display(location);
   }.bind(this));
};

/**
 *
 * @returns {string[]}
 */
Project.prototype.getAuthors = function () {
   return this.authors.slice(0);
};

/**
 *
 * @param {Date} date
 * @returns {number|undefined}
 */
Project.prototype.getTime = function (date) {
   if (date === undefined) return undefined;
   return date - this.getStartDate();
};

/**
 *
 * @returns {boolean}
 */
Project.prototype.isUnitTest = function () {
   return false;
};

Project.prototype.isValid = function () {
   return true;
};

//noinspection JSUnusedGlobalSymbols
/**
 *
 * @param {string} title
 */
Project.prototype.setTitle = function (title) {
   this.title = title;
};

exports.default = Project;
//# sourceMappingURL=Project.js.map
