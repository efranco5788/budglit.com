/*
 * Author: Emmanuel Franco <efranco5788@gmail.com>
 *
 * This work is licensed under the Creative Commons Attribution 4.0
 * International License. To view a copy of this license,
 * visit http://creativecommons.org/licenses/by/4.0/ or send a letter
 * to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
*/

const ISO_FORMAT = "T00:00:00"

module.exports = {
  // Instance of current date
  getTodayString: function(){

    var today = new Date()
    var dd = today.getDate()
    var mm = (today.getMonth() + 1)
    var yyyy = today.getFullYear()

    if (dd < 10) dd = '0' + dd

    if (mm < 10) mm = '0' + mm

    //today = yyyy + '-' + mm + '-' + dd;
    let todayString = yyyy + '-' + mm + '-' + dd

    return today

  },

  convertISOFormatString: function(dateString){

    if(!dateString) return console.error('date not defined')

    if(dateString.includes('T')){
      console.log('Already in ISO Format')
      return dateString
    }

    let date = new Date (dateString)

    console.log(date)

    let isoDate = dateString.concat(ISO_FORMAT)

    return isoDate

  },

  convertToUTC: function(date){

    if(!date) return console.error('Date is not found')

    let utcDate = date.toUTCString()

    if(!utcDate) console.error('Error creating date')

    return utcDate
  }

}
