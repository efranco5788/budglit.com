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
const superagent = require('superagent');
const fs = require('file-system');
const apiURL = "https://www.budglit.com"

function createAPIString(image){
  let imgPath = apiURL + '/' + image;
  return imgPath;
}

function getImage(obj, callback){
  let imagePath = createAPIString(obj);
  console.log(imagePath);

  fs.access(apiURL, fs.constants.R_OK | fs.constants.W_OK, (err) => {
    console.log(err ? 'no access!' : 'can read/write');
  });
  // superagent
  // .get(apiURL)
  // .query({query: obj})
  // .end(function(err, res){
  //   if(err) console.log(res);
  //   else {
  //     console.log('Here I am');
  //     console.log(res);
  //   }
  // });

}

router.get('/', function(req, res, next) {
  let query = req.query;
  if (query) {
    let qImg = query.name;
    getImage(qImg);
  }
  else{
    res.send(fs);
    console.log(fs);
  }

});

module.exports = router;
