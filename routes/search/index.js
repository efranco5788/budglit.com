/*
 * Author: Emmanuel Franco <efranco5788@gmail.com>
 *
 * This work is licensed under the Creative Commons Attribution 4.0
 * International License. To view a copy of this license,
 * visit http://creativecommons.org/licenses/by/4.0/ or send a letter
 * to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
*/
const express = require('express');
const router = express.Router();
const db = require('../../database');
const moment = require('moment') //https://momentjs.com/
const dealParser = require('../dealParser');
const zipcodeAPI = require('../../routes/api/zipcode');
const EMPTY_VALUE = 'emptyValues';
const DEFAULT_BUDGET = '-1';

router.post('/', function(req, res, next){
  var role = req.body
  var result = []
  res.set('Content-Type', 'application/json');

  if(role){

    let userCity = role.city;

    let userState = role.state;

    if(!userCity && !userState){

      result.push({EMPTY_VALUE: true, error: 'No location found'});
      res.send(JSON.stringify(result));

    }
    else{

      userCity = userCity.toLowerCase()
      userState = userState.toLowerCase()

      let budgetStringVal = role.budget_filter;
      let budget = 0.00;

      if(budgetStringVal === DEFAULT_BUDGET || !budgetStringVal){
        budget = parseFloat('100');
      }
      else budget = parseFloat(budgetStringVal);

      let dateString = role.date_filter

      var date

      if(!dateString){
        date = moment().local()
      }
      else{
        if(!Object.prototype.toString.call(dateString) === "[object Date]"){
          console.error("object is not valid date")
          date = moment().local()
        }

        if(!moment(dateString).isValid()){
          date = moment.local()
        }

        let timezone = role.timezone

        if(timezone){
          console.log('timezone is ')
          console.log(timezone)
          let localTime = dateString + timezone
          date = moment(localTime).utcOffset(localTime)
        }
        else{
          date = moment(dateString)
        }

      }

      //console.log(date)

      let UTC_Date = moment.utc(date)

      //console.log('UTC Date')

      //console.log(UTC_Date)

      let formattedDate = moment(UTC_Date).format()

      let eventSchemaModel = require('../../models/event')

      var day = UTC_Date.date()
      var month = (UTC_Date.month() + 1)
      var year = UTC_Date.year()

      eventSchemaModel.makeModel().then(function(eventModel){

        eventModel.aggregate([

          {
            $match: {
              state: {$eq: userState},
              city: {$eq: userCity}
            }

          },

          {
            $project: {
            year: { $year: "$date"},
            month:{ $month: "$date"},
            day: {$dayOfMonth: "$date"}
          }
        }, // end of project aggregate

        {
          $match: {
            year: { $eq: year},
            month: { $eq: month},
            day: {$eq: day}
          }
        }

        ], function(err, result) {

          if(err) {
            console.log(err)
            return
          }

          if(result.length == 0){
            let jsonList = JSON.stringify({"deals" : []})
            res.send(jsonList)
          }
          else{

            let list = []

            result.forEach(element => {

              eventModel.find({_id: element._id}, function(err, event){

                list.push(event)

                if(list.length == result.length){
                  let jsonResults = dealParser.parseDeals(list)
                  //let jsonList = JSON.stringify({"deals" : list})
                  console.log(jsonResults)
                  res.send(jsonResults)
                  }

              })


            }); // End of ForEach loop

          }

        })

      }).catch(function(){
        console.log('error with model')
      })
    

    }

  } // end of role statement



  /*
  if (role) {

    let userZip = role.zipcode;
    let allZip = role.surroundingZipcodes;
    
    if(!userZip && !allZip){
      result.push({EMPTY_VALUE: true, error: 'No postal codes found'});
      res.send(JSON.stringify(result));
    }

    let budgetStringVal = role.budget_filter;
    var date = role.date_filter;
    var budget = 0.00;

    // Parse budget string to float
    if (budgetStringVal === DEFAULT_BUDGET){
      budget = parseFloat('100')
    }
    else budget = parseFloat(budgetStringVal)

    // Instance of current date
    if (!date) date = dateParser.getToday();

    // Instance of DB pool
    let pool = db.getPool();

    // Set the response Content Type to JSON
    res.set('Content-Type', 'application/json');

    if (allZip) {
      let query = "SELECT `deals`.`dealID`, `deals`.`dealDescription`, `deals`.`dealBudget`, `deals`.`date_of_event`, `deals`.`duration_end`, GROUP_CONCAT(`tags`.`name`) AS `tags`, `venues`.`name`, `venues`.`imageURL`, `venues`.`address`, `venues`.`twtrUsername`, `states`.`name` AS `state`, `cities`.`name` AS `city`, `venues`.`zipcode`, `venues`.`phone` FROM `deals` INNER JOIN `tagDetails` ON (tagDetails.dealID=deals.dealID), `venues`, `cities`, `states`, `tags` WHERE (tags.tagID=tagDetails.tagID AND venues.city = cities.cityID AND cities.state = states.stateID AND deals.venue = venues.venuesID AND venues.zipcode IN (?) AND deals.dealBudget<=? AND deals.date_of_event=?) GROUP BY `deals`.`dealID`";
      let values = [allZip, budget, date];


      db.runQuery(pool, query, values, true).then(function(results){
        let jsonResults = dealParser.parseDeals(results)
        res.send(jsonResults)
      }).catch(function(err){

      })

    }
    else if (userZip){
      userZip = userZip.trim();
      let qString = "SELECT `deals`.`dealID` FROM `deals`, `venues` WHERE deals.venue = venues.venuesID AND venues.zipcode=? AND deals.dealBudget<=? AND deals.date_of_event=?";
      let query = "SELECT `deals`.`dealID`, `deals`.`dealDescription`, `deals`.`dealBudget`, `deals`.`date_of_event`, `deals`.`duration_end`, `venues`.`name`, `venues`.`imageURL`, `venues`.`address`, `states`.`name` AS `state`, `cities`.`name` AS `city`, `venues`.`zipcode`, `venues`.`phone` FROM `deals`, `venues`, `cities`, `states` WHERE venues.city = cities.cityID AND cities.state = states.stateID AND deals.venue = venues.venuesID AND venues.zipcode=? AND deals.dealBudget<=? AND deals.date_of_event=?";
      let values = [userZip, budget, date];

      db.runQuery(pool, qString, values, true).then(function(results){
        res.send(results)
      }).catch(function(err){

      })

    }

  }

  */

});

module.exports = router;
