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
  // app.locals.base = base;
  // app.locals.model = model;
  app.locals.sensors = sensors;
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
    console.log(port);
    //console.log(err);
    //console.log(mongoDbUrl);

  });
}


module.exports = { serve : serve};

//@TODO routing function, handlers, utility functions

function setupRoutes(app) {
 // console.log(port);
  //const base = app.locals.base;
  app.use(cors());
  app.use(bodyParser.json());
  app.get('/sensor-types', getsensortype(app));
  app.get('/sensors', getSensor(app));
  app.get('/sensor-data', getSensorData(app));
  app.get(`${'/sensor-types'}/:id`, getSensorTypeId(app));
  app.get(`${'/sensors'}/:id`, getSensorId(app));
  app.get(`${'/sensor-data'}/:id`, getSensorDataId(app));
  app.post('/sensor-types', postSensorType(app));
  app.post('/sensors', postSensor(app));
  // app.delete(`${base}/:id`, doDelete(app));
  // app.put(`${base}/:id`, doReplace(app));
  // app.patch(`${base}/:id`, doUpdate(app));
  app.use(doErrors()); //must be last   
}


function getsensortype(app) {
 //console.log(err);
  return errorWrap(async function(req, res) {
    const q = req.query || {};
    try {
      const results = await app.locals.sensors.findSensorTypes(q);
      //res.append('Location', requestUrl(req) + '/' + q.id);
      results.self = requestUrl(req);
      res.json(results);
    }
    catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function getSensor(app) {
  // console.log(port);
   return errorWrap(async function(req, res) {
     const q = req.query || {};
     try {
       const results = await app.locals.sensors.findSensors(q);
       results.self = requestUrl(req);
       res.json(results);
     }
     catch (err) {
       const mapped = mapError(err);
       res.status(mapped.status).json(mapped);
     }
   });
 }

 function getSensorData(app) {
  // console.log(port);
   return errorWrap(async function(req, res) {
     const q = req.query || {};
     try {
       const results = await app.locals.sensors.findSensorData(q);
       results.self = requestUrl(req);
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
  res.json(results);
  res.append('Location', requestUrl(req) + '/' + id.id);
      }
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function getSensorId(app) {
  return errorWrap(async function(req, res) {
    try {
      const id = req.params.id;
      const results = await app.locals.sensors.findSensors({ id: id });
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
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function getSensorDataId(app) {
  return errorWrap(async function(req, res) {
    try {
      const id = req.params.id;
      const results = await app.locals.sensors.findSensorData({ id: id });
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
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}


function postSensorType(app) {
  return errorWrap(async function(req, res) {
    try {
      const obj = req.body;
      const results = await app.locals.sensors.addSensorType(obj);
      res.append('Location', requestUrl(req) + '/' + obj.id);
      //results.self = requestUrl(req);
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
      //results.self = requestUrl(req);
      res.sendStatus(CREATED);
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}



function doErrors(app) {
  return async function(err, req, res, next) {
    res.status(SERVER_ERROR);
    res.json({ code: 'SERVER_ERROR', message: err.message });
    console.log("errrrroooooorrrrrrsssss");
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
  NOT_FOUND: NOT_FOUND
}

/** Map domain/internal errors into suitable HTTP errors.  Return'd
 *  object will have a "status" property corresponding to HTTP status
 *  code.
 */
function mapError(err) {
  console.error(err);
  return err.isDomain
    ? { status: (ERROR_MAP[err.errorCode] || BAD_REQUEST),
	code: err.errorCode,
	message: err.message
      }
    : { status: SERVER_ERROR,
	code: 'INTERNAL',
	message: err.toString()
      };
} 

function requestUrl(req) {
  const port = req.app.locals.port;
  return `${req.protocol}://${req.hostname}:${port}${req.originalUrl}`;
}
