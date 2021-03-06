'use strict';

const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const querystring = require('querystring');

const mustache = require('mustache');
const widgetView = require('./widget-view');

const STATIC_DIR = 'statics';
const TEMPLATES_DIR = 'templates';

function serve(port, model, base='') {
  //@TODO
  const app = express();
  app.locals.port = port;
  app.locals.base = base;
  app.locals.model = model;
  process.chdir(__dirname);
  app.use(base, express.static(STATIC_DIR));
  setupTemplates(app);
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
  });
}


module.exports = serve;

//@TODO

const URLS = {
  sensorTypeAdd: `/tst-sensor-types-add.html`,
  sensorTypeSearch: `/tst-sensor-types-search.html`,
  sensorAdd: `/tst-sensors-add.html`,
  sensorSearch: `/tst-sensors-search.html`,
};


function setupRoutes(app) {
  const base = app.locals.base;
 
  app.get(URLS.sensorTypeAdd, getST(app));
  app.post(URLS.sensorTypeAdd, bodyParser.urlencoded({extended: false}),
     addST(app));
  app.get(URLS.sensorTypeSearch, doSearchST(app));
  app.get(URLS.sensorSearch, doSearchS(app));
  app.get(URLS.sensorAdd, getS(app));
  app.post(URLS.sensorAdd, bodyParser.urlencoded({extended: false}),
     addS(app));
 
}
function getST(app) {
  return async function(req, res) {
    const model = { base: app.locals.base, fields: FIELDS };
    const html = doMustache(app, 'tst-sensor-types-add', model);
    res.send(html);
  };
};
function getS(app) {
  return async function(req, res) {
    const model = { base: app.locals.base, fields: FIELDS_S };
    const html = doMustache(app, 'tst-sensors-add', model);
    res.send(html);
  };
};

function doSearchST(app) {
  return async function(req, res) {
    let users = [];
    let errors = undefined;
    const search = getNonEmptyValues(req.query);
    //console.log("search req.query");
    //console.log(search);
      errors = validate(search);
      //console.log("errors req.query");
    //console.log(errors);
      if (Object.keys(search).length == 0) {
	const msg = 'at least one search parameter must be specified';
      }
  
  const q = querystring.stringify(search);
  //console.log("q stringify");
    //console.log(q);
  try {
    //console.log("inside try");
    users = await app.locals.model.list('sensor-types',search);
    //console.log("users req.query");
    //console.log(users);
    for(var i=0; i< users.data.length;i++){
      //console.log(users.data.limits.min);
      users.data[i].min=users.data[i].limits.min;
      users.data[i].max=users.data[i].limits.max;
    }
  }
 	catch (err) {
    console.error(err);
	  errors = wsErrors(err);
  }
  let model;

   if(errors){
     
     model = { base: app.locals.base, err: errors ,fields:FIELDS};
   }

   else{
        const val =
   users.data.map((u) => ({id: u.id, fields: fieldsWithValues(u)}));
  
   let n="";
   let p="";
   let n1;
   let p1;
   if(users.next){

  n=users.next.split('?')[1];
    n1="?"+n;
   }
   if(users.prev){
    p=users.prev.split('?')[1];
    p1="?"+p;
  }
  model = { base: app.locals.base,users:val,fields:FIELDS,next:n1,prev:p1};
}
  
  //console.log(baseUrl);
  //   users.temp = "http://localhost:2346/tst-sensor-types-search.html?"+q+'&_index='+users.nextIndex;
  //   //users.temp=q+'&_index='+users.nextIndex;
 
    const html = doMustache(app, 'tst-sensor-types-search', model);
    res.send(html);
  };
};


function doSearchS(app) {
  return async function(req, res) {
    let users = [];
    let errors = undefined;
    const search = getNonEmptyValuesSensor(req.query);
 
      errors = validateSensor(search);
      if (Object.keys(search).length == 0) {
	const msg = 'at least one search parameter must be specified';
      }

  const q = querystring.stringify(search);
  //console.log("log for search of sensors");
  //console.log(search);
	try {
    users = await app.locals.model.list('sensors',search);
    for(var i=0; i< users.data.length;i++){
      //console.log(users.data.limits.min);
      users.data[i].min=users.data[i].expected.min;
      users.data[i].max=users.data[i].expected.max;
    }
  }
  
	catch (err) {
    console.error(err);
	  errors = wsErrors(err);
  }
  let model;

  if(errors){
     
    model = { base: app.locals.base, err: errors ,fields:FIELDS_S};
  }
  else{
 
   let n1;
   let p1;
   const val =
   users.data.map((u) => ({id: u.id, fields: fieldsWithValuesSensor(u)}));
       model = { base: app.locals.base, users: val ,fields:FIELDS_S};
   
    let n="";
   let p="";
   if(users.next){
    n=users.next.split('?')[1];
    n1="?"+n;
   }
   if(users.prev){
    p=users.prev.split('?')[1];
    p1="?"+p;
  }
  model = { base: app.locals.base,users:val,fields:FIELDS_S,next:n1,prev:p1};
} 
  
    const html = doMustache(app, 'tst-sensors-search', model);
    res.send(html);
  };
};


function addST(app) {
  return async function(req, res) {
    const user = getNonEmptyValues(req.body);
    let errors = validate(user, ['id','manufacturer','modelNumber','quantity','min','max']);
    const minimum=user.min;
    const maximum=user.max;
    user.limits={minimum,maximum};
  
    if(user.quantity==='pressure'){
      user.unit='PSI';
    }
    else if(user.quantity==='flow'){
      user.unit='gpm';
    }
    else if(user.quantity==='humidity'){
      user.unit='%';
    }
    else{
    user.unit='C';
    }
 
    if (!errors) {
      try {

	  await app.locals.model.update('sensor-types',user);

	res.redirect(`${app.locals.base}/tst-sensor-types-search.html`);
      }
      catch (err) {
	//console.error(err);
	errors = wsErrors(err);
      }
    }
    if (errors) {
      const model = errorModel(app, user, errors);
      const html = doMustache(app,'tst-sensor-types-add', model);
      res.send(html);
    }
  };
};

function addS(app) {
  return async function(req, res) {
    const user = getNonEmptyValuesSensor(req.body);
    let errors = validateSensor(user, ['id','model','period','min','max']);
    const min=user.min;
    const max=user.max;
    user.expected={min,max};
    
    
    if (!errors) {
      try {

	  await app.locals.model.update('sensors',user);

	res.redirect(`${app.locals.base}/tst-sensors-search.html`);
      }
      catch (err) {

	errors = wsErrors(err);
      }
    }
    if (errors) {
      const model = errorModelSensor(app, user, errors);
      const html = doMustache(app,'tst-sensors-add', model);
      res.send(html);
    }
  };
};


const FIELDS_INFO = {
  id: {
    friendlyName: 'Sensor Type ID',
    isSearchST: true,
    isAddST:true,
    isRequired: true,
    regex: /^[a-zA-Z\d-_]+$/,
    error: 'User Id field can only contain alphanumerics, - or _ characters',
  },
  manufacturer: {
    friendlyName: 'Manufacturer',
    isRequired: true,
    isAddST:true,
    isSearchST :true,
    regex: /^([a-zA-Z' -])*$/,
    error: 'Can contain only \-, \', space or alphabetic characters',
  },
  modelNumber: {
    friendlyName: 'Model Number',
    isRequired: true,
    isAddST:true,
    isSearchST:true,
    regex: /^([a-zA-Z0-9' -])*$/,
    error: 'Can contain only \-, \', space or alphanumeric characters.',
  },
  quantity: {
    friendlyName: 'Quantity',
    isSearchST :true,
    isAddST:true,
    isSelect:true,
    regex: /\b(temperature|pressure|flow|humidity)\b/,
    error: 'Can only have internal values temperature, pressure, flow or humidity.',
  },
  min: {
    friendlyName: 'Minimum Limit',
    isAddST:true,
    isRequired: true,
    regex: /^(\d*\.)?\d+$/,
    error: 'A number.',
  },
  max: {
    friendlyName: 'Maximum Limit',
    isRequired: true,
    isAddST:true,
    regex: /^(\d*\.)?\d+$/,
    error: 'A number.',
  },
  _index: '5',
};
const FIELDS_INFO_S = {
  id: {
    friendlyName: 'Sensor ID',
    isSearchS: true,
    isAddS:true,
    isRequiredSensor: true,
    regex: /^[a-zA-Z\d-_]+$/,
    error: ' Can only contain alphanumerics, - or _ characters.',
  },
  model: {
    friendlyName: 'Model',
    isRequiredSensor: true,
    isAddS:true,
    isSearchS :true,
    regex: /^[a-zA-Z\d-_]+$/,
    error: ' Can only contain alphanumerics, - or _ characters.',
  },
  period: {
    friendlyName: 'Period',
    isRequiredSensor: true,
    isAddS:true,
    isSearchS :true,
    regex: /^[-+]?\d+$/,
    error: 'Must be an integer.',
  },
  min: {
    friendlyName: 'Expected Minimum',
    isRequiredSensor: true,
    isAddS:true,
    regex: /^(\d*\.)?\d+$/,
    error: 'A number.',
  },
  max: {
    friendlyName: 'Expected Maximum ',
    isAddS:true,
    isRequiredSensor: true,
    regex: /^(\d*\.)?\d+$/,
    error: 'A number.',
  },
  _index: '5',
};
const FIELDS =
  Object.keys(FIELDS_INFO).map((n) => Object.assign({name: n}, FIELDS_INFO[n]));

const FIELDS_S =
  Object.keys(FIELDS_INFO_S).map((n) => Object.assign({name: n}, FIELDS_INFO_S[n]));


function fieldsWithValues(values, errors={}) {
  return FIELDS.map(function (info) {
    const name = info.name;
    const extraInfo = { value: values[name] };
    if(extraInfo.value===0){
      extraInfo.value='0';
    }
    if (errors[name]) extraInfo.errorMessage = errors[name];
    return Object.assign(extraInfo, info);
  });
}

function fieldsWithValuesSensor(values, errors={}) {
  return FIELDS_S.map(function (info) {
    const name = info.name;
    const extraInfo = { value: values[name] };
    if(extraInfo.value===0){
      extraInfo.value='0';
    }
    if (errors[name]) extraInfo.errorMessage = errors[name];
    return Object.assign(extraInfo, info);
  });
}

function validate(values, requires=[]) {
  const errors = {};
  requires.forEach(function (name) {
    if (values[name] === undefined) {
      errors[name] =
	`A value for '${FIELDS_INFO[name].friendlyName}' must be provided`;
    }
  });
  for (const name of Object.keys(values)) {
    const fieldInfo = FIELDS_INFO[name];
    const value = values[name];
    if (fieldInfo.regex && !value.match(fieldInfo.regex)) {
      errors[name] = fieldInfo.error;
    }
  }
  return Object.keys(errors).length > 0 && errors;
}

function validateSensor(values, requires=[]) {
  const errors = {};
  requires.forEach(function (name) {
    if (values[name] === undefined) {
      errors[name] =
	`A value for '${FIELDS_INFO_S[name].friendlyName}' must be provided`;
    }
  });
  for (const name of Object.keys(values)) {
    const fieldInfo1 = FIELDS_INFO_S[name];
    const value = values[name];
    if (fieldInfo1.regex && !value.match(fieldInfo1.regex)) {
      errors[name] = fieldInfo1.error;
    }
  }
  return Object.keys(errors).length > 0 && errors;
}

function getNonEmptyValues(values) {
  const out = {};
  Object.keys(values).forEach(function(k) {
    if (FIELDS_INFO[k] !== undefined) {
      const v = values[k];
      if (v && v.trim().length > 0) out[k] = v.trim();
    }
  });
  return out;
}

function getNonEmptyValuesSensor(values) {
  const out = {};
  Object.keys(values).forEach(function(k) {
    if (FIELDS_INFO_S[k] !== undefined) {
      const v = values[k];
      if (v && v.trim().length > 0) out[k] = v.trim();
    }
  });
  return out;
}

/** Return a model suitable for mixing into a template */
function errorModel(app, values={}, errors={}) {
  return {
    base: app.locals.base,
    errors: errors._,
    fields: fieldsWithValues(values, errors)
  };
}

function errorModelSensor(app, values={}, errors={}) {
  return {
    base: app.locals.base,
    errors: errors._,
    fields: fieldsWithValuesSensor(values, errors)
  };
}



/************************ General Utilities ****************************/

/** Decode an error thrown by web services into an errors hash
 *  with a _ key.
 */
function wsErrors(err) {
  const msg = (err.message) ? err.message : 'web service error';
  console.error(msg);
  return { _: [ msg ] };
}

function doMustache(app, templateId, view) {
  const templates = { footer: app.templates.footer };
  return mustache.render(app.templates[templateId], view, templates);
}

function errorPage(app, errors, res) {
  if (!Array.isArray(errors)) errors = [ errors ];
  const html = doMustache(app, 'errors', { errors: errors });
  res.send(html);
}

function isNonEmpty(v) {
  return (v !== undefined) && v.trim().length > 0;
}

function setupTemplates(app) {
  app.templates = {};
  for (let fname of fs.readdirSync(TEMPLATES_DIR)) {
    const m = fname.match(/^([\w\-]+)\.ms$/);
    if (!m) continue;
    try {
      app.templates[m[1]] =
	String(fs.readFileSync(`${TEMPLATES_DIR}/${fname}`));
    }
    catch (e) {
      console.error(`cannot read ${fname}: ${e}`);
      process.exit(1);
    }
  }
}
