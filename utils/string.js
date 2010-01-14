/*jslint laxbreak: true, eqeqeq: true, undef: true, regexp: false */
/*global require, process, exports */

var sys = require('sys');

/* Function: smart_split(s)
 *      Split a string by spaces, leaving qouted phrases together. Supports both
 *      single and double qoutes, and supports escaping strings qoutes with
 *      backslashes. Qoutemarks wil not be removed.
 *
 *  Returns:
 *      Array of strings.
 */
function smart_split(s) {
    // regular expression from django/utils/text.py in Django project.
    var re = /([^\s"]*"(?:[^"\\]*(?:\\.[^"\\]*)*)"\S*|[^\s']*'(?:[^'\\]*(?:\\.[^'\\]*)*)'\S*|\S+)/g,
        out = [],
        m = false;

    while (m = re.exec(s)) {
        out.push(m[0]);
    }
    return out;
}
exports.smart_split = smart_split;

/* Function: add_slashes
 *      Escapes qoutes in string by adding backslashes in front of them.
 */
function add_slashes(s) {
    return s.replace(/['"]/g, "\\$&"); 
}
exports.add_slashes = add_slashes;

/* Function: cap_first
 *      Capitalizes first letter of string
 */
function cap_first(s) {
    return s[0].toUpperCase() + s.substring(1); 
}
exports.cap_first = cap_first;


/*************************************************************************
* sprintf() and str_repeat() from http://code.google.com/p/sprintf/
*/

/**
 * sprintf() for JavaScript v.0.4
 *
 * Copyright (c) 2007 Alexandru Marasteanu <http://alexei.417.ro/>
 * Thanks to David Baird (unit test and patch).
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, write to the Free Software Foundation, Inc., 59 Temple
 * Place, Suite 330, Boston, MA 02111-1307 USA
 */

function str_repeat(i, m) { for (var o = []; m > 0; o[--m] = i); return(o.join('')); }

function sprintf () {
  var i = 0, a, f = arguments[i++], o = [], m, p, c, x;
  while (f) {
    if (m = /^[^\x25]+/.exec(f)) o.push(m[0]);
    else if (m = /^\x25{2}/.exec(f)) o.push('%');
    else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
      if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) throw("Too few arguments.");
      if (/[^s]/.test(m[7]) && (typeof(a) != 'number'))
        throw("Expecting number but found " + typeof(a));
      switch (m[7]) {
        case 'b': a = a.toString(2); break;
        case 'c': a = String.fromCharCode(a); break;
        case 'd': a = parseInt(a); break;
        case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
        case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
        case 'o': a = a.toString(8); break;
        case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
        case 'u': a = Math.abs(a); break;
        case 'x': a = a.toString(16); break;
        case 'X': a = a.toString(16).toUpperCase(); break;
      }
      a = (/[def]/.test(m[7]) && m[2] && a > 0 ? '+' + a : a);
      c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
      x = m[5] - String(a).length;
      p = m[5] ? str_repeat(c, x) : '';
      o.push(m[4] ? a + p : p + a);
    }
    else throw ("Huh ?!");
    f = f.substring(m[0].length);
  }
  return o.join('');
}
/*************************************************************************/

/*************************************************************************
* titleCaps from http://ejohn.org/files/titleCaps.js (by John Resig)
*/

var small = "(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)";
var punct = "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)";

var titleCaps = function(title){
    var parts = [], split = /[:.;?!] |(?: |^)["Ò]/g, index = 0;
    
    while (true) {
        var m = split.exec(title);

        parts.push( title.substring(index, m ? m.index : title.length)
            .replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, function(all){
                return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all);
            })
            .replace(RegExp("\\b" + small + "\\b", "ig"), lower)
            .replace(RegExp("^" + punct + small + "\\b", "ig"), function(all, punct, word){
                return punct + upper(word);
            })
            .replace(RegExp("\\b" + small + punct + "$", "ig"), upper));
        
        index = split.lastIndex;
        
        if ( m ) parts.push( m[0] );
        else break;
    }
    
    return parts.join("").replace(/ V(s?)\. /ig, " v$1. ")
        .replace(/(['Õ])S\b/ig, "$1s")
        .replace(/\b(AT&T|Q&A)\b/ig, function(all){
            return all.toUpperCase();
        });
};

function lower(word){
    return word.toLowerCase();
}

function upper(word){
  return word.substr(0,1).toUpperCase() + word.substr(1);
}

exports.titleCaps = titleCaps;


/*************************************************************************/

exports.sprintf = sprintf;
exports.str_repeat = str_repeat;


function center(s, width) {
    if (s.length > width) { return s; }
    var right = Math.round((width - s.length) / 2);
    var left = width - (s.length + right);
    return str_repeat(' ', left) + s + str_repeat(' ', right);
}
exports.center = center;
