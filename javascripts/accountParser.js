/*
 * Author: Emmanuel Franco <efranco5788@gmail.com>
 *
 * This work is licensed under the Creative Commons Attribution 4.0
 * International License. To view a copy of this license,
 * visit http://creativecommons.org/licenses/by/4.0/ or send a letter
 * to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
*/
module.exports = {
  // Instance of current date
  parse: function(obj, isJSON){
    if(!obj) return null;
    let dict = {
    };

    if (obj.length <= 0) {
      dict = {count: obj.length};
    }
    else if (obj.length > 0) {
      let nodeObj = obj[0];
      dict = {
        count: obj.length,
        email: nodeObj.email,
        fName: nodeObj.fName,
        lName: nodeObj.lName,
        profileIMG: nodeObj.profileIMG
      };
    }

    let results = null;

    if (isJSON) results = generateJSON(dict);
    else results = Object.assign({}, dict);

    return results;
  },

  //Generate a JSON file
  generateJSON: function(node){
    if(!node) return null;

    let json = JSON.stringify(node);

    if(json) return json;
    else return null;
  }

}
