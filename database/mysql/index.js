/*
 * Author: Emmanuel Franco <efranco5788@gmail.com>
 *
 * This work is licensed under the Creative Commons Attribution 4.0
 * International License. To view a copy of this license,
 * visit http://creativecommons.org/licenses/by/4.0/ or send a letter
 * to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
*/
const express = require('express');
const mysql = require('mysql');

const PRODUCTION_DB = process.env.DB_NAME
  , TEST_DB = 'app_test_database'

module.exports.MODE_TEST = 'mode_test'
module.exports.MODE_PRODUCTION = 'mode_production'

const state = {
  pool: null,
  mode: null,
}

closeConnection = function(close){
  if (close){
    connection.destroy();
    console.log('Connection Closed');
  }
  else {
    connection.release();
  }
}

module.exports = {

  connect: function(mode){

    return new Promise (function(resolve, reject){

      const config = {
        host : process.env.DB_HOST,
        port: process.env.DB_PORT,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database: mode === module.exports.MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB,
        dateStrings : true,
        connectionLimit: 100,
        connectTimeout: 60000,
        acquireTimeout: 60000,
      }

      if(!config) reject()
  
      state.pool = mysql.createPool(config)
      state.mode = mode
      resolve()
    })

  },

  getPool: function(){
    return state.pool;
  },

  runQuery: function(pool, query, values, shouldClose){

    return new Promise (function(resolve, reject){
      
          var dbPool = pool === null ? state.pool : pool
      
          if(!dbPool) reject();
          else{
      
            if (query && !values) {
      
              dbPool.getConnection(function(err, connection){
                
                console.log('connected to database')
      
                connection.query(query, function(error, results, fields){
                  
                  if(error){
                    console.error(error)
                    reject(error)
                  }
        
                  connection.release()
                  results(results)
      
                }) // Running Query
        
              }) // End of getConnection()
        
            }
            else if (query && values) {
              dbPool.getConnection(function(err, connection){
      
                console.log('connected to database');
      
                connection.query({
                  sql: query,
                  timeout: 40000, // 40s
                  values: values
                }, function (error, results, fields) {
        
                  if(error){
                    console.log(error)
                    reject(error)
                  }
      
                  connection.release()
                  resolve(results)
                });
        
              }) // End of getConnection()
        
            }
            else{
              console.error('No Query Found');
              reject('No Query Found');
            } 
      
      
          } // End of top else statement
      
        }) // End of Promise

  },

  
  killConnections: function(pool){
    pool.end(function(err){
      if(err) throw err;

      console.log('All connections have been terminated');
    })
  } // End of killConnections Function
/*
  killConnections: function(pool){

    return new Promise = (function(resolve, reject){

      pool.end(function(err){
        if(err) reject(err)
  
        console.log('All connections have been terminated')
        resolve()
      })

    })



  } // End of killConnections Function
*/
}
