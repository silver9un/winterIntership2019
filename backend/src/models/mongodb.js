"use strict"
const mongoose = require("mongoose")
const log = require("../logger/logger.js")
const keepalive = require("./keepalive_schema.js")
const property = require("./property_schema.js")
const fileName = __filename.split("/").pop()

let config = {
  databaseUrl: "mongodb://0.0.0.0:27017/iot",
  database: null
}

// mongoose.set('debug', true);

module.exports = {
  setServerAddress: function(databaseUrl) {
    config.databaseUrl = databaseUrl
  },

  connect: function(callback) {
    mongoose.Promise = global.Promise
    mongoose.connect(
      config.databaseUrl,
      { useNewUrlParser: true }
    )
    config.database = mongoose.connection

    config.database.on("error", function(err) {
      log.error(`${fileName}`, "Database Connection Error " + err)
      config.database.close()
      callback(err, null)
    });
    config.database.on("open", function() {
      log.info(
        `${fileName}`,
        "Database Connection Success " + config.databaseUrl
      )
      callback(null, true)
    });
    config.database.on("disconnected", function() {
      log.warn(`${fileName}`, "Database Disconnected Error")
      config.database.close()
      callback(null, null)
    });
  },

  /*
  setProperty : function(input, callback) {

    property.schema = mongoose.Schema({
        resource : { type : String, require : true},
        label : { type : String, require : true},
        properties : { type : Object, require : true}
    })
    log.info('property Schema Configuration')
  
    property.model = mongoose.model('Property', property.schema)
    log.info('property Model Configuration')
    
    const newProperty = new property.model({
      resource: input.resource,
      label: input.label,
      properties: input.properties
    })
    
	  newProperty.save(function(err) {
      if (err) {
        callback(err, null);
      return;
	  }
		
	  log.info("Property insert");
      callback(null, newProperty);
    });
  },
  */

  getKeepalive: function(resource, callback) {
    let query
    if (resource) {
      query = keepalive.find({ resource: resource })
    } else {
      query = keepalive.find()
    }

    query.exec(function(err, docs) {
      if (err) {
        log.error(`${fileName}`, "Get keepalive Error " + err)
        callback(err, null)
      } else if (docs.length == 0) {
        log.info(`${fileName}`, "Get keepalive no data")
        callback(null, null)
      } else {
        log.log("Get keepalive Success")
        callback(null, docs)
      }
    })
  },

  getProperty: function(resource, callback) {
    let query
    if (resource) {
      query = property.find({ resource: resource })
    } else {
      query = property.find()
    }

    query.exec(function(err, docs) {
      if (err) {
        log.error(`${fileName}`, "Get Property Error " + err)
        callback(err, null)
      } else if (docs.length == 0) {
        log.info(`${fileName}`, "Get Property no data")
        callback(null, null)
      } else {
        log.log("Get Property Success")
        callback(null, docs)
      }
    })
  },

  close: function() {
    log.warn(`${fileName}`, "mongodb close")
    config.database.close()
  }
}
