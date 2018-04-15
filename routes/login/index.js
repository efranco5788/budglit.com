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
const accountParser = require('../../javascripts/accountParser');
const db = require('../../database');
const encryption = require('../../javascripts/encryption');

router.post('/', function(req, res){
  res.set('Content-Type', 'application/json');
  let body = req.body;
  //let isMobile =
  if(!body) return res.status(500).send();
  if(!body.user_email || !body.user_password) return res.status(400).send();

  let user = body.user_email;
  let password = body.user_password.toString();
  let encrypted = encryption.encrypt(password);
  let sqlQuery = "SELECT `email`, `fName`, `lName`, `profileIMG` FROM `accounts` WHERE email=? AND password=?";
  let values = [user, encrypted];
  let pool = db.getPool();

  db.runQuery(pool, sqlQuery, values, true, function(results){
    //res.set('Content-Type', 'application/json');
    if (!results) {res.status(400)}
    else {
      res.status(200);

      let file = accountParser.parse(results, false);
      req.session.email = file.email;
      req.session.fName = file.fName;
      req.session.lName = file.lName;
      req.session.profileIMG = file.profileIMG;
      let jsonFile = accountParser.generateJSON(file);
      console.log(file.fName);
      res.send(jsonFile);
    }
  });

});

router.get('/', function(req, res){

  var dict = {
    title: 'Budglit Login',
    bgcolor: '#ffffff'
  };

  res.render('index', dict);

});

module.exports = router;
