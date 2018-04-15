const express = require('express');
const router = express.Router();
const app = express();
const path = require('path');

router.get('/', function(req, res, next){
  res.sendFile(path.join(__dirname + '/test.html'));
});

module.exports = router;
