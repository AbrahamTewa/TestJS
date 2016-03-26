var Mustache = require('mustache');

/**
 *
 * @param value
 * @returns {*}
 */
function copy(value) {
   return JSON.parse(JSON.stringify(value))
}

/**
 *
 * text from http://ksblog.org/index.php?q=lpad-rpad-functions-javascript&id=44
 */
function lpad(originalstr, length, strToPad) {
    while (originalstr.length < length)
        originalstr = strToPad + originalstr;
    return originalstr;
}

function render2dom(template, value) {

   var /** @type {HTMLElement} */ div
     , /** @type {string}      */ htmlString;

   htmlString = Mustache.render(template, value);

   div = document.createElement('div');
   div.innerHTML = htmlString;

   return div.firstChild;
}

/**
 *
 * @param {number} time
 * @returns {string}
 */
function time2string(time) {

   var /** @type {string} */ timeString
     , /** @type {number} */ hours
     , /** @type {number} */ minutes
     , /** @type {number} */ seconds
     , /** @type {number} */ milliseconds;

   if (time === undefined)
      return '';

   hours = Math.floor(time / (60 * 60 * 1000));
   time -= hours * 60 * 60 * 1000;

   minutes = Math.floor(time / (60 * 1000));
   time -= minutes * 60 * 1000;

   seconds = Math.floor(time / 1000);
   time -= seconds * 1000;

   milliseconds = time;

   timeString = hours + 'h' + lpad(minutes, 2, '0') + 'm' + lpad(milliseconds, 4, '0');

   return timeString;
}

export { copy
       , lpad
       , render2dom
       , time2string }