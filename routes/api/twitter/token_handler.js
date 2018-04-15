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
const callbackURL = 'twitterclient://restart'

router.post('/', function(req, res, next){

})

router.get('/', function(req, res, next){

    let token = req.query.oauth_token
    let verifier = req.query.oauth_verifier

    let redirect = callbackURL

    if(token){
        redirect = redirect + ('?oauth_token=' + token)
    }
    else{
        redirect = redirect + ('?no')
    }

    if(verifier){
        redirect = redirect +('&oauth_verifier=' + verifier)
    }

    console.log(redirect)

    res.redirect(301, redirect)
})

module.exports = router;