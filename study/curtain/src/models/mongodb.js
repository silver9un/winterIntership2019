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
    })
    config.database.on("open", function() {
      log.info(
        `${fileName}`,
        "Database Connection Success " + config.databaseUrl
      )
      callback(null, true)
    })
    config.database.on("disconnected", function() {
      log.warn(`${fileName}`, "Database Disconnected Error")
      config.database.close()
      callback(null, null)
    })
  },

  getKeepalive: function(resource, callback) {
    let query
    if (resource) {
      query = keepalive.find({ resource: resource })
      //query = keepalive.find({ resource: resource }).read('secondaryPreferred') //read 전용
    } else {
      query = keepalive.find()
      //query = keepalive.find().read('secondaryPreferred') //read 전용
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
 
  insertKeepalive : function(input, callback) {
    const newKeepalive = new keepalive({
      resource: input.resource,
      timeStamp: input.timeStamp,
      label: input.label
    })
    
    newKeepalive.save(function (err) {
      if (err) {
        callback(err, null)
        return
      }
		
      log.info("insertKeepalive success")
      callback(null, newKeepalive)
    })
  },

  updateKeepalive : function(input, callback) {
    let query = { resource: input.resource }
    let newData = { timeStamp: input.timeStamp }
    keepalive.findOneAndUpdate(query, newData, { upsert:false }, function(err, doc) {
      if (err) {
        callback(err, null)
        return
      }

      log.info("updateKeepalive success")
      callback(null, doc)
    })
  },

  removeKeepalive : function(resource, callback) {
    let query
    if (resource) {
      console.log('resource', resource)
      query = keepalive.find({ resource: resource }).remove()
      //query = keepalive.find({ resource: resource }).read('secondaryPreferred') //read 전용
    } else {
      query = keepalive.find().remove()
      //query = keepalive.find().read('secondaryPreferred') //read 전용
    }

    query.exec(function(err, docs) {
      if (err) {
        log.error(`${fileName}`, "removeKeepalive Error " + err)
        callback(err, null)
      } else if (docs.length == 0) {
        log.info(`${fileName}`, "removeKeepalive no data")
        callback(null, null)
      } else {
        log.log("removeKeepalive Success")
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

  insertProperty : function(input, callback) {
    const newProperty = new property({
      resource: input.resource,
      label: input.label,
      property: input.property
    })
    
    newProperty.save(function(err) {
      if (err) {
        callback(err, null)
        return
      }
		
      log.info("insertProperty success")
      callback(null, newProperty)
    })
  },

  updateProperty : function(query, newData, callback) {
    keepalive.findOneAndUpdate(query, newData, { upsert:false }, function(err, doc) {
      if (err) {
        callback(err, null)
        return
      }

      log.info("updateProperty success")
      callback(null, doc)
    })
  },

  removeProperty : function(resource, callback) {
    let query
    if (resource) {
      console.log('resource', resource)
      query = property.find({ resource: resource }).remove()
      //query = keepalive.find({ resource: resource }).read('secondaryPreferred') //read 전용
    } else {
      query = property.find().remove()
      //query = keepalive.find().read('secondaryPreferred') //read 전용
    }

    query.exec(function(err, docs) {
      if (err) {
        log.error(`${fileName}`, "removeProperty Error " + err)
        callback(err, null)
      } else if (docs.length == 0) {
        log.info(`${fileName}`, "removeProperty no data")
        callback(null, null)
      } else {
        log.log("removeProperty Success")
        callback(null, docs)
      }
    })
  },

  close: function() {
    log.warn(`${fileName}`, "mongodb close")
    config.database.close()
  }
}
