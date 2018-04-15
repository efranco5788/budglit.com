/*
 * Author: Emmanuel Franco <efranco5788@gmail.com>
 *
 * This work is licensed under the Creative Commons Attribution 4.0
 * International License. To view a copy of this license,
 * visit http://creativecommons.org/licenses/by/4.0/ or send a letter
 * to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
*/

const sha512 = require('js-sha512');

module.exports = {
  // Instance of current date
  encrypt : function(obj){
    if(!obj) return null;
    let encryptedObj = sha512(obj);
    return encryptedObj;
  }

}
