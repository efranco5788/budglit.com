/*
 * Author: Emmanuel Franco <efranco5788@gmail.com>
 *
 * This work is licensed under the Creative Commons Attribution 4.0
 * International License. To view a copy of this license,
 * visit http://creativecommons.org/licenses/by/4.0/ or send a letter
 * to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
*/

 function generateJSON(node){ //Generate a JSON file
  if(!node) return null;

  let json = JSON.stringify(node);

  if(json) return json;
  else return null;
}

module.exports = {

  parseDealCount : function(list){
    if(!list) return;
    let dealCount = list.length;
    let count = dealCount.toString();
    let obj = {
      parsedList: []
    };

    obj.parsedList.push({
      'count': count
    });

    let jsonFile = generateJSON(obj);
    return jsonFile;

}, // End of deal count function

  parseDeals : function(list){
    if(!list) return;
    let obj = {
      parsedList: [],
      deals: []
    };

    if (list.length <= 0) {
      obj.parsedList.push({
        'count': '0'
      });
    }
    else{

      obj.parsedList.push({
        'count': list.length,
      });

      list.forEach(function(e){
        obj.deals.push({
          'deal': e
        });

      });
    }

    let jsonFile = generateJSON(obj);
    return jsonFile;

  } // End of deal function

}
