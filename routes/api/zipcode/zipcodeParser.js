/*
 * Author: Emmanuel Franco <efranco5788@gmail.com>
 *
 * This work is licensed under the Creative Commons Attribution 4.0
 * International License. To view a copy of this license,
 * visit http://creativecommons.org/licenses/by/4.0/ or send a letter
 * to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
*/
const check = require('check-types')

module.exports = {
  // Instance of current date
  parseZipcodes : function(list){
    
    if(!list) return

    let zipcodes = list.zip_codes
    let obj = {
      parsedList: []
    }

    if(check.array(zipcodes)){
      obj.parsedList.push(zipcodes)

      let json = JSON.stringify(obj)

      if (json) return json
      else return null
    }
    else{
  
      zipcodes.forEach(function(element) {
  
        obj.parsedList.push({
          'zipcode': element.zip_code,
          'distance': element.distance
        })
    }) // end of forEach loop
  
    let json = JSON.stringify(obj)
  
    if (json) return json
    else return null
    
    } // end of Check array statement

  },

}
