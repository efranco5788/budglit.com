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
  let body = req.body;
  if (body) {
    let username = body.user_email;
    let password = body.user_password.toString();
    let encrypted = encryption.encrypt(password);
    let sqlQuery = "SELECT `email`, `fName`, `lName`, `profileIMG` FROM `accounts` WHERE email=? AND password=?";
    let values = [username, encrypted];
    db.runQuery(sqlQuery, values, true, function(results){
      res.set('Content-Type', 'application/json');
      let file = accountParser.parse(results);
      res.send(file);
    });
  }
  else return null;

});

router.get('/', function(req, res, next){
  console.log(req.session);
  res.send('here');
});

/*
router.get('/', function(req, res, next) {
  if (req.session.views) {
    req.session.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    req.session.views = 1
    res.end('welcome to the session demo. refresh!')
  }
})
*/
module.exports = router;
