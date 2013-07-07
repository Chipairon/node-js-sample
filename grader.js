#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(in_file) {
  var in_str = in_file.toString();
  if(!fs.existsSync(in_str)) {
    console.log("%s does not exist. Exiting.", in_str);
    process.exit(1);
  }
  return in_str;
};

var cheerioHtmlFile = function(html_file) {
  return cheerio.load(fs.readFileSync(html_file));
};

var loadChecks = function(checks_file) {
  return JSON.parse(fs.readFileSync(checks_file));
};

var checkHtmlFile = function(html_file, checks_file) {
  $ = cheerioHtmlFile(html_file);
  var checks = loadChecks(checks_file).sort();
  var out =  {};
  for(var ii in checks) {
    var present = $(checks[ii]).length > 0;
    out[checks[ii]] = present;
  }
  return out;
};

// Workaround for commander.js issue.
// http://stackoverflow.com/a/6772648
var clone = function(fn) {
  return fn.bind({});
};

if(require.main == module) {
  program
    .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
    .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
    .parse(process.argv);
    var check_json = checkHtmlFile(program.file, program.checks);
    var out_json = JSON.stringify(check_json, null, 4);
    console.log(out_json);
} else {
  exports.checkHtmlFile = checkHtmlFile;
}
