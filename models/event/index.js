/*
 * Author: Emmanuel Franco <efranco5788@gmail.com>
 *
 * This work is licensed under the Creative Commons Attribution 4.0
 * International License. To view a copy of this license,
 * visit http://creativecommons.org/licenses/by/4.0/ or send a letter
 * to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
*/
const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const name = 'Event'

const eventSchema = new Schema({

    "event": String,
    "address": String,
    "state": String,
    "city": String,
    "zipcode": String,
    "date": {type: Date, default: Date.now},
    "budget": String

}, {collection: 'events'})

module.exports = {

    makeModel: function(){

        return new Promise(function(resolve, reject){

            var events = mongoose.model(name, eventSchema)

            if(!events) reject()
            else resolve(events)

        })
    }

}

//mongoose.model('Event', eventSchema);