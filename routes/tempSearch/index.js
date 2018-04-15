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
const moment = require("moment");
const dealParser = require('../dealParser');
const zipcodeAPI = require('../../routes/api/zipcode');
const EMPTY_VALUE = 'emptyValues';

router.post('/', function(req, res){
  var role = req.body;
  var result = [];
  
  if (role) {
    let userZip = role.zipcode;
    let allZip = role.surroundingZipcodes;

    if(!userZip && !allZip){
      result.push({EMPTY_VALUE: true, error: 'No postal codes found'});
      res.send(JSON.stringify(result));
    }

    // Retrieve the GET data
    var budgetStringVal = role.budget_filter;
    var date = role.date_filter;
    var budget = 0.00;

    // Parse budget string to float
    if (budgetStringVal) budget = parseFloat(budgetStringVal);

    // Instance of current date
    if (!date) date = moment().local();
    var pool = db.getPool();
    res.set('Content-Type', 'application/json');
    
    if (allZip) {
      var qString = "SELECT `deals`.`dealID` FROM `deals`, `venues` WHERE deals.venue = venues.venuesID AND venues.zipcode IN (?) AND deals.dealBudget<=? AND deals.date_of_event=?";
      let values = [allZip, budget, date];

      db.runQuery(pool, qString, values, true).then(function(results){
        let jsonResults = dealParser.parseDealCount(results);
        console.log('all zips is ');
        console.log(jsonResults);
        res.send(jsonResults);
      }).catch(function(err){
        console.log(err)
      })

    }
    else if (userZip){
      userZip = userZip.trim();
      let qString = "SELECT `deals`.`dealID` FROM `deals`, `venues` WHERE deals.venue = venues.venuesID AND venues.zipcode=? AND deals.dealBudget<=? AND deals.date_of_event=?";
      let values = [userZip, budget, date];

      db.runQuery(pool, qString, values, true).then(function(results){

        console.log(results);
        let jsonResults = dealParser.parseDealCount(results);
        console.log('userzip is ');
        console.log(jsonResults);
        res.send(jsonResults);

      }).catch(function(err){
        console.log(err)
      })

    }

  }


});

router.get('/', function(req, res){
  let role = req.body;
  let result = [];

  if (role) {
    let userZip = role.zipcode;
    //let allZip = role.surroundingZipcodes;
    let allZip = ['33172', '33175'];

    if(!userZip && !allZip){
      result.push({EMPTY_VALUE: true, error: 'No postal codes found'});
      res.send(JSON.stringify(result));
    }

    var budgetStringVal = role.budget_filter;
    var date = role.date_filter;
    var budget = 0.00;

    // Parse budget string to float
    if (budgetStringVal) budget = parseFloat(budgetStringVal);

    // Instance of current date
    if (!date) date = moment().local();
    res.set('Content-Type', 'application/json');

    if (allZip) {
      var qString = "SELECT `deals`.`dealID` FROM `deals`, `venues` WHERE deals.venue = venues.venuesID AND venues.zipcode IN (?) AND deals.dealBudget<=? AND deals.date_of_event=?";
      let values = [allZip, budget, date];
      db.runQuery(null, qString, values, true, function(results){
        console.log(results);

        let jsonResults = dealParser.parseDealCount(results);
        console.log('userzip is ');
        console.log(jsonResults);
        res.send(jsonResults);

      });

    }
    else if (userZip) {
      userZip = userZip.trim();
      var qString = "SELECT `deals`.`dealID` FROM `deals`, `venues` WHERE deals.venue = venues.venuesID AND venues.zipcode=? AND deals.dealBudget<=? AND deals.date_of_event=?";
      var values = [userZip, budget, date];
      db.runQuery(null, qString, values, true, function(results){

        console.log(results);

        let jsonResults = dealParser.parseDealCount(results);
        console.log('userzip is ');
        console.log(jsonResults);
        res.send(jsonResults);

      });
    }

  }


});

module.exports = router;
