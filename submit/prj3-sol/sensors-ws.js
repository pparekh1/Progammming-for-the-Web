const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const AppError = require('./app-error');

const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;

function serve(port,sensors) {
  //@TODO set up express app, routing and listen
  const app = express();
  app.locals.port = port;
  app.locals.sensors = sensors;
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
  });
}


module.exports = { serve : serve};

//@TODO routing function, handlers, utility functions

function setupRoutes(app) {

  app.use(cors());
  app.use(bodyParser.json());
  app.get('/sensor-types', getsensortype(app));
  app.get('/sensors', getSensor(app));
  app.get(`${'/sensor-types'}/:id`, getSensorTypeId(app));
  app.get(`${'/sensors'}/:id`, getSensorId(app));
  app.get(`${'/sensor-data'}/:id`, getSensorDataId(app));
  app.get(`${'/sensor-data'}/:id/:timestamp`, getSensorDataIdTs(app));
  app.post('/sensor-types', postSensorType(app));
  app.post('/sensors', postSensor(app));
  app.post(`${'/sensor-data'}/:id`, postSensorData(app));

  app.use(doErrors()); //must be last   
}


function getsensortype(app) {

  return errorWrap(async function(req, res) {
    const q = req.query || {};
    try {
      const results = await app.locals.sensors.findSensorTypes(q);
      results.self = requestUrl(req);
      for(var key of results.data){
        key.self=req.protocol+'://'+req.hostname+':'+req.app.locals.port+'/sensor-types/' + key.id;
      }
      if(results.nextIndex !== -1){
        if(req.query._count){
        results.next=req.protocol+'://'+req.hostname+':'+req.app.locals.port+'/sensor-types/' + '?_index=' + results.nextIndex +'&_count='+req.query._count;
      }
      else{
        results.next=req.protocol+'://'+req.hostname+':'+req.app.locals.port+'/sensor-types/' + '?_index=' + results.nextIndex ;
      }
    }
      if(results.previousIndex !== -1 && results.previousIndex !== 0){
        results.previous=req.protocol+'://'+req.hostname+':'+req.app.locals.port+'/sensor-types/' + '?_index=' + results.previousIndex + '&_count='+req.query._count;
      }
      res.json(results);
    }
    catch (err) {
      err[0].isDomain=true;
      console.log(err[0]);
      err[0].errorcode='NOT_FOUND';
     // err[0].message=`user ${id} not found`;
      const mapped = mapError(err[0]);
      console.log(mapped);
      const final = Object.assign({},mapped);
      delete final.status;
      //const final = {errors : [mapped]};
      res.status(mapped.status).json({errors:[final]});
    }
  });
}

function getSensor(app) {
  return errorWrap(async function(req, res) {
     const q = req.query || {};
     try {
       const results = await app.locals.sensors.findSensors(q);
       results.self = requestUrl(req);
       if(results.nextIndex !== -1){
        results.next=requestUrl(req) + '&_index=' + results.nextIndex;
      }
       for(var key of results.data){
        key.self=key.self=req.protocol+'://'+req.hostname+':'+req.app.locals.port+'/sensors/' + key.id;
      }
       res.json(results);
     }
     catch (err) {
       const mapped = mapError(err);
       res.status(mapped.status).json(mapped);
     }
   });
 }

function getSensorTypeId(app) {
  return errorWrap(async function(req, res) {
    try {
      const id = req.params.id;
      const results = await app.locals.sensors.findSensorTypes({ id: id });
      if (results.length === 0) {
	throw {
    
	  isDomain: true,
	  errorCode: 'NOT_FOUND',
	  message: `user ${id} not found`,
	};
      }
      else {
        results.self = requestUrl(req);
        for(var key of results.data){
          key.self=req.protocol+'://'+req.hostname+':'+req.app.locals.port+'/sensor-types/' + key.id;
        }
  res.json(results);
  
      }
    }
    catch(err) {
      err[0].isDomain=true;
      console.log(err[0]);
      err[0].errorcode='NOT_FOUND';
      const mapped = mapError(err[0]);
      console.log(mapped);
      const final = Object.assign({},mapped);
      delete final.status;
      //const final = {errors : [mapped]};
      res.status(mapped.status).json({errors:[final]});
    }
  });
}

function getSensorId(app) {
  return errorWrap(async function(req, res) {
    try {
      const id = req.params.id;
      const results = await app.locals.sensors.findSensors({ id: id });
      results.self = requestUrl(req);
       if(results.nextIndex !== -1){
        results.next=requestUrl(req) + '&_index=' + results.nextIndex;
      }
      
       for(var key of results.data){
       
        key.self=req.protocol+'://'+req.hostname+':'+req.app.locals.port+'/sensors/' + key.id;
      }
      if (results.length === 0) {
	throw {
	  isDomain: true,
	  errorCode: 'NOT_FOUND',
	  message: `user ${id} not found`,
	};
      }
      else {
	res.json(results);
      }
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function getSensorDataIdTs(app) {
  var arr=[];
  var arr1=[];
  return errorWrap(async function(req, res) {
    try {
      const id = req.params.id;
      const timestamp = req.params.timestamp;
      const results = await app.locals.sensors.findSensorData({ sensorId: id , timestamp:timestamp});
       // console.log("Result data length"+results.data.length);
        for(var i of results.data) {
        if(i.timestamp===Number(timestamp)){
         arr1.push(i);
          i.self=requestUrl(req);   
          res.json({data:i, self :requestUrl(req), nextIndex:-1});
          break;
        }
          else {
            throw {
            isDomain: true,
            errorCode: 'NOT_FOUND',
            message: `no data for timestamp ${timestamp}`,
          };
        }
        //res.json({data:arr1, self :requestUrl(req), nextIndex:-1});
        }
      }
    catch(err) {
 
      console.log(err[0]);
      const mapped = map_error(err);
      console.log(mapped);
      const final = Object.assign({},mapped);
      delete final.status;
      res.status(mapped.status).json({errors:[final]});
    }
  });
}


function getSensorDataId(app) {
  return errorWrap(async function(req, res) {
    try {
      const id = req.params.id;
      const timestamp = req.query.timestamp;
      const statuses = req.query.statuses;
      const results = await app.locals.sensors.findSensorData({ sensorId: id , timestamp:timestamp , statuses:statuses});
      for(var key of results.data){
      key.self=req.protocol+'://'+req.hostname+':'+req.app.locals.port+'/sensor-data/' + id + '/' + key.timestamp;
      }
    
      if (results.length === 0) {
	throw {
	  isDomain: true,
	  errorCode: 'NOT_FOUND',
	  message: `user ${id} not found`,
	};
      }
      else {
        results.self = requestUrl(req);
	res.json(results);
      }
    }
    catch(err) {

      err[0].isDomain=true;
      console.log(err[0]);
      err[0].errorcode='NOT_FOUND';
      const mapped = mapError(err[0]);
      console.log(mapped);
      const final = Object.assign({},mapped);
      delete final.status;
      res.status(mapped.status).json({errors:[final]});
    }
  });
}

function postSensorType(app) {
  return errorWrap(async function(req, res) {
    try {
      const obj = req.body;
      const results = await app.locals.sensors.addSensorType(obj);
      res.append('Location', requestUrl(req) + '/' + obj.id);
      res.sendStatus(CREATED);
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function postSensor(app) {
  return errorWrap(async function(req, res) {
    try {
      const obj = req.body;
      const results = await app.locals.sensors.addSensor(obj);
      res.append('Location', requestUrl(req) + '/' + obj.id);
      res.sendStatus(CREATED);
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function postSensorData(app) {
  return errorWrap(async function(req, res) {
    try {
      const replacement = Object.assign({}, req.body);
      replacement.sensorId = req.params.id;
      const results = await app.locals.sensors.addSensorData(replacement);
      res.sendStatus(CREATED);
    }
    catch(err) {
      err[0].isDomain=true;
      console.log(err[0]);
      err[0].errorcode='NOT_FOUND';
      const mapped = mapError(err[0]);
      console.log(mapped);
      const final = Object.assign({},mapped);
      delete final.status;
      res.status(mapped.status).json({errors:[final]});
    }
  });
}

function doErrors(app) {
  return async function(err, req, res, next) {
    res.status(SERVER_ERROR);
    res.json({ code: 'SERVER_ERROR', message: err.message });
   
    //console.log(err);
    console.error(err);
  };
}

function errorWrap(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    }
    catch (err) {
      next(err);
    }
  };
}

/*************************** Mapping Errors ****************************/

const ERROR_MAP = {
  EXISTS: CONFLICT,
  NOT_FOUND: NOT_FOUND,
  
}

/** Map domain/internal errors into suitable HTTP errors.  Return'd
 *  object will have a "status" property corresponding to HTTP status
 *  code.
 */
function mapError(err) {
  console.error(err);
  return err.isDomain
    ? { status: (ERROR_MAP[err.code] || BAD_REQUEST),
	code: err.code,
	message: err.msg
      }
    : { status: NOT_FOUND,
	code: 'NOT_FOUND',
	message: err.toString()
      };
} 

function map_error(err) {
  console.error(err);
  console.log("inside mapped error");
  if(err.isDomain===true){
    return { status: (ERROR_MAP[err.errorCode] || BAD_REQUEST),
	code: err.errorCode,
	message: err.message
      };
    }
    else{
      return {status: NOT_FOUND,
        code: 'NOT_FOUND',
        message: err.toString()
            };

      }
    }

function requestUrl(req) {
  const port = req.app.locals.port;
  return `${req.protocol}://${req.hostname}:${port}${req.originalUrl}`;
}
