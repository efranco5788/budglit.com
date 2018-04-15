/*
 * Author: Emmanuel Franco <efranco5788@gmail.com>
 *
 * This work is licensed under the Creative Commons Attribution 4.0
 * International License. To view a copy of this license,
 * visit http://creativecommons.org/licenses/by/4.0/ or send a letter
 * to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
*/
const express = require('express')
const router = express.Router()
const check = require('check-types') //https://www.npmjs.com/package/check-types#some-examples
const stringSimilarity = require('string-similarity') //https://www.npmjs.com/package/string-similarity
const MODE_CONNECTED = 'connected'
const MODE_DISCONNECTED = 'disconnected'
const RESPONSE_KEY = 'response.json.results'

const state = {
  client: null,
  mode: MODE_DISCONNECTED,
}

const compareStringInArray = function(obj, myArray){

  let comparingString = obj.toLowerCase()

  if(myArray.length === 0) return  null
  else if(myArray.length === 1){
    let comparer = myArray[0].formatted_address.toLowerCase()

    let similarity = stringSimilarity.compareTwoStrings(comparingString, comparer)
    
    if(similarity >= 0.7) return myArray[0]
    else return null

  }
  else{

    let addresses = []

    // convert all strings to lowercase
    myArray.forEach(function(element){
      let address = element.formatted_address.toLowerCase()
      addresses.push(address)
    })

    let results = stringSimilarity.findBestMatch(comparingString, addresses)

    let addressMatch = results.bestMatch

    if(!addressMatch) return null

    let addressTarget = addressMatch.target

    let matchedResult = null

    myArray.forEach(function(element){
      let address = element.formatted_address.toLowerCase()
      if(addressTarget === address)
      {
        matchedResult = element
      }
    })

    return matchedResult

  }
  

}

const geocodeAddress = function(address){

  return new Promise(function(resolve, reject){

    let validAddress = check.assigned(address)

    if (!validAddress) reject()

    if(state.mode == MODE_CONNECTED){

      if(check.nonEmptyArray(address))
      {
        var list = []
        var counter = 1

        address.forEach(function(element) {
          state.client.geocode({
            address: element},
            function(err, response) {

              // If Geocoding did not return error
              if (!err) {
                let responseData = []
                let result = response.json.results

                // Check if geocode returned multiple locations
                if(check.nonEmptyArray(result)){

                  if(result.length < 1) return reject('Array is empty')
                  if(result.length > 1){
                    let matchedPlace = compareStringInArray(element, result)

                    if(matchedPlace){
                      matchedPlace.formatted_address = element
                      responseData.push(matchedPlace)
                    } 
                    else{
                      console.log('------ ERROR ---------')
                      console.log(result)
                      console.log('------ ERROR ---------')
                    } 

                  }
                  else{
                    result[0].formatted_address = element
                    responseData.push(result[0])
                  } 

                }
                else reject('Array is not defined')

                list.push(responseData)

                if(counter === address.length){
                  resolve(list)
                }
                else counter++
              }
              else reject(err)
              
            }); // end of google geocode method

          }, this);

          
      }
      else if(check.string(address)){
        state.client.geocode({
          address: address},
          function(err, response) {
            if (!err) {
              response.json.results.formatted_address = address
              let responseData = response.json.results
              resolve(responseData);

            }
            else console.log('something went wrong')
            
          }); // end of google geocode method

      }

    }
    else reject('disconnected from Google api')

  }) // end of Promise

}

router.createClient = function(APIKey){

  return new Promise(function(resolve, result){
    
    if(APIKey === null) reject('API Key is not defined')

    state.client = require('@google/maps').createClient({
      key: APIKey
    })

    state.mode = MODE_CONNECTED
    
    resolve('Google Client created')

  })

}

router.destroyClient = function(callback){
  state.client = null
  state.mode = MODE_DISCONNECTED
}

router.post('/', function(req, res){

  if (state.mode == MODE_CONNECTED) {

    var dict = req.body
    var address = dict.address
    geocodeAddress(address).then(function(result){
      res.send(result);
    }).catch(function(){
      console.log('failed');
    })

  }

})

router.get('/', function(req, res){

  if (state.mode == MODE_CONNECTED) {
    state.client.geocode({
  address: '1600 Amphitheatre Parkway, Mountain View, CA'
}, function(err, response) {

  if (!err) {
    console.log(RESPONSE_KEY);
    res.send(response);
  }
});

  }

})

module.exports = router;
