/*
 * Author: Emmanuel Franco <efranco5788@gmail.com>
 *
 * This work is licensed under the Creative Commons Attribution 4.0
 * International License. To view a copy of this license,
 * visit http://creativecommons.org/licenses/by/4.0/ or send a letter
 * to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
*/
//https://www.zipcodeapi.com/rest/<api_key>/radius.<format>/<zip_code>/<distance>/<units>
const express = require('express');
const router = express.Router();
const superagent = require('superagent');
const zipcodeParser = require('./zipcodeParser');
const apiKey = 'c9kuYmZT08RhniJHOTgzRtSZQaBjtDjFND9L08E1hwiFP1mEVCdN66NXgogK2ApP';
const domain = 'https://www.zipcodeapi.com'
const apiDomainREST = '/rest/';
const apiAPIRadiusType = 'radius';
const apiAPICityType = 'city-zips';
const apiJSONType = '.json';
const apiUnitType = 'mile';

function createAPIZipcodeByRadiusString(zipcode, distance){
  let apiString = domain + apiDomainREST + apiKey + '/' + apiAPIRadiusType + 
  apiJSONType + zipcode + '/' + distance + '/' + apiUnitType

  return apiString;
}

function createAPILocationToZipcodeString(city, state){
  let apiString = domain + apiDomainREST + apiKey + '/' + apiAPICityType + 
  apiJSONType + '/' + city + '/' + state

  return apiString;
}

function getZipcodes(obj, callback){
  superagent
  .get(obj)
  .end(function(err, res){
    if (err) console.error(err);
    else {
      let list = res.body;
      let returnedObj = zipcodeParser.parseZipcodes(list);
      callback(returnedObj);
    }
  });
}

router.get('/', function(req, res, next){

  res.set('Content-Type', 'application/json')
  let city = req.query.city
  let state = req.query.state
  let zip = req.query.zipcode
  let dis = req.query.distance

  if(city && state){
    let apiString = createAPILocationToZipcodeString(city, state);
    console.log(apiString)
    getZipcodes(apiString, function(returnedZipcodes){
      res.send(returnedZipcodes)
    })

  }
  else if(dis && zip){
    let apiString = createAPIZipcodeByRadiusString(zip, dis);

    getZipcodes(apiString, function(returnedZipcodes){
      console.log("Here " + returnedZipcodes)
      res.send(returnedZipcodes)
    })
  }
  else{
    let emptyObj = {};
    let returnedZipcodes = JSON.stringify(emptyObj);
    res.send(returnedZipcodes);
  }

});

module.exports = router;
