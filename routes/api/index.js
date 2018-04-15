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
const zipcode = require('./zipcode')
const twitter = require('./twitter')

router.use('/zipcode', zipcode)
router.use('/twitter', twitter)

router.get('/', function(req, res, next) {
    var dict = {
      title: 'Budglit API',
      bgcolor: '#ffffff'
    };
  
    res.render('index', dict);
  });

module.exports = router;