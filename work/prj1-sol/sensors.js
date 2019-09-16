'use strict';

const assert = require('assert');

class Sensors {

  

  constructor() {
    //@TODO
     this.senType=[];
     this.sen=[];
     this.senData=[];
     this.nextIndex=0;
     this.noArgs=[];
     this.sensorArr=[];
     this.dataArr=[];
     
     this.type;
  }

  /** Clear out all data from this object. */
  async clear() {
    //@TODO
  }

  /** Subject to field validation as per FN_INFOS.addSensorType,
   *  add sensor-type specified by info to this.  Replace any
   *  earlier information for a sensor-type with the same id.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async addSensorType(info) {
    //sendata  =  info;
    
    
    
    

    const sensorType = validate('addSensorType', info);
    
    //@TODO
    //this.senType.push(info);
    var mode=0;
    for(var i=0; i<this.senType.length;i++){
      if(this.senType[i].id===info.id ){
        mode=1;
      }
      } 
      if(mode===1){
        console.log("Already present");
      }
      else {
       
        this.senType.push(info);
      }
    
  
    

  }
  
  /** Subject to field validation as per FN_INFOS.addSensor, add
   *  sensor specified by info to this.  Replace any earlier
   *  information for a sensor with the same id.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async addSensor(info) {
    const sensor = validate('addSensor', info);
    // var nextIndex = DEFAULT_COUNT;
    // this.sen.push(info);
     var mode=0;
    // for(var i=0;i<nextIndex;i++){
    //   console.log(this.sen[i]);
    // }
    // console.log(this.sen.length);
    // console.log(this.senType.length);
    for(var i=0; i<this.senType.length;i++){

     
      if(this.senType[i].id===info.model){
        mode=1;
      }
      } 
    
      if(mode===1){
        this.sen.push(info);
      }
      // else {
      //   console.log("absent");
      // }
    
    
    
    //@TODO
  }

  /** Subject to field validation as per FN_INFOS.addSensorData, add
   *  reading given by info for sensor specified by info.sensorId to
   *  this. Replace any earlier reading having the same timestamp for
   *  the same sensor.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async addSensorData(info) {
    const sensorData = validate('addSensorData', info);
    //this.senData.push(info);
    //@TODO
    var mode=0;
    for(var i=0; i<this.sen.length;i++){
      if(this.sen[i].id===info.sensorId ){
        mode=1;
      }
      } 
      if(mode===1){
        this.senData.push(info);
      }
      else {
        
        
        throw "Absent";
      }
  }

  /** Subject to validation of search-parameters in info as per
   *  FN_INFOS.findSensorTypes, return all sensor-types which
   *  satisfy search specifications in info.  Note that the
   *  search-specs can filter the results by any of the primitive
   *  properties of sensor types.  
   *
   *  The returned value should be an object containing a data
   *  property which is a list of sensor-types previously added using
   *  addSensorType().  The list should be sorted in ascending order
   *  by id.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  index property for the next search.  Note that the index (when 
   *  set to the lastIndex) and count search-spec parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensor-types which meet some filter criteria.
   *
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensorTypes(info) {
    
    const searchSpecs = validate('findSensorTypes', info);
    //@TODO
    //var allKeys;
  //var allValues;
    //var s = info;
    // var allKeys= [];
    // for( var k in info)
    //   allKeys.push(k);
    //allValues=Object.values(info);
    //let allKeys=this.sentype.map(a =>a.id);
    //console.log(allKeys);
    
    //console.log(this.senType);
    var mode=0;
    let noArgs=[];
    var defaultArr=[];
    var nextIndex=0;
    this.senType.sort((a, b) => (a.id > b.id) ? 1 : -1)

    /**********Default=5******* */
    
    //return noArgs;
    // /*************ID************************/
    // for(var i=0;i<this.senType.length;i++){
    //   if(this.senType[i].id===info.id){
    //     // console.log(this.senType[i]);
    //   }
    // }
    // /*************Manufacturer************************/
    // for(var i=0;i<this.senType.length;i++){
    //   if(this.senType[i].manufacturer===info.manufacturer){
    //     console.log(this.senType[i]);
    //   }
    // }
    // /*************ModelNumber************************/
    // for(var i=0;i<this.senType.length;i++){
    //   if(this.senType[i].modelNumber===info.modelNumber){
    //     console.log(this.senType[i]);
    //   }
    // }
    
    /**************QUANTITY*************** */
    console.log(info);
    if(info.quantity){
    for(var i=0;i<this.senType.length;i++){
      if(this.senType[i].quantity===info.quantity){
        nextIndex=-1;
        this.noArgs.push(this.senType[i]);
        // data=defaultArr.push(this.senType[i]);
        
      }
    }
  }
    // /*************Unit************************/
    // for(var i=0;i<this.senType.length;i++){
    //   if(this.senType[i].unit===info.unit){
    //     console.log(this.senType[i]);
    //   }
    // }
    
    /***************NextIndex************/
   else if(info.index && info.count){
    var index=Number(info.index);
    var count=Number(info.count);
    var len = index+count;
    //console.log(nextIndex);
    for(var i=info.index;i<len;i++){
      //console.log(this.senType[i]);
      this.noArgs.push(this.senType[i]);
    }
    nextIndex=this.noArgs.length;
  }
  // nextIndex=noArgs.length;

  else{
    var def=DEFAULT_COUNT;
    //if(nextIndex>=0){
    for(var i=0;i<def;i++){
      // console.log(this.senType[i]);
      this.noArgs.push(this.senType[i]);
    }
     nextIndex=this.noArgs.length;
  }

  
    //console.log(info);
   
  
    return {nextIndex:nextIndex,data:this.noArgs};
  }
  
  /** Subject to validation of search-parameters in info as per
   *  FN_INFOS.findSensors, return all sensors which
   *  satisfy search specifications in info.  Note that the
   *  search-specs can filter the results by any of the primitive
   *  properties of a sensor.  
   *
   *  The returned value should be an object containing a data
   *  property which is a list of all sensors satisfying the
   *  search-spec which were previously added using addSensor().  The
   *  list should be sorted in ascending order by id.
   *
   *  If info specifies a truthy value for a doDetail property, 
   *  then each sensor S returned within the data array will have
   *  an additional S.sensorType property giving the complete 
   *  sensor-type for that sensor S.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  index property for the next search.  Note that the index (when 
   *  set to the lastIndex) and count search-spec parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensors which meet some filter criteria.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensors(info) {
    const searchSpecs = validate('findSensors', info);
    //@TODO
    var sensorArr=[];
    var auxSen=[]
    var nextIndex=1;
    this.sen.sort((a, b) => (a.id > b.id) ? 1 : -1)
    

    /**************************************/
    if(info.model && info.count){
    let c=[];
    //console.log(info.count);
    for(var i=0; i<this.sen.length;i++){
      
      if(this.sen[i].model===info.model){
          //c++;
          //console.log(c);
      
          //console.log(this.sen[i]);
          auxSen.push(this.sen[i]);
      }
    }
        //   if(c===info.count){
        //     break;
        //   }
        //   else
        //   {
        //     c++;
        //     console.log(c);
        //   }
        //   console.log(this.sen[i]);
        // }
        for(var counter=0;counter<info.count;counter++){
          //console.log(Number(counter)+Number(sensorArr.length));
          this.sensorArr.push(auxSen[counter]);
        }
        nextIndex=this.sensorArr.length;
      }
      else if(info.model && info.count && info.index){
        for(var i=o;i<this.sen.length;i++){
          if(this.sen[i]===info.model){
            this.sensorArr.push(this.sen[i]);

          }
        }
      }
      
      else {
        /**********Default=5******* */
    var def=DEFAULT_COUNT;
    
    
    for(var i=0;i<def;i++){
      //console.log(this.sen[i]);
      this.sensorArr.push(this.sen[i]);
    }
    nextIndex=this.sensorArr.length;

      }
    //console.log(this.sen);
    return {nextIndex:nextIndex,data:this.sensorArr};
  }
  
  /** Subject to validation of search-parameters in info as per
   *  FN_INFOS.findSensorData, return all sensor reading which satisfy
   *  search specifications in info.  Note that info must specify a
   *  sensorId property giving the id of a previously added sensor
   *  whose readings are desired.  The search-specs can filter the
   *  results by specifying one or more statuses (separated by |).
   *
   *  The returned value should be an object containing a data
   *  property which is a list of objects giving readings for the
   *  sensor satisfying the search-specs.  Each object within data
   *  should contain the following properties:
   * 
   *     timestamp: an integer giving the timestamp of the reading.
   *     value: a number giving the value of the reading.
   *     status: one of "ok", "error" or "outOfRange".
   *
   *  The data objects should be sorted in reverse chronological
   *  order by timestamp (latest reading first).
   *
   *  If the search-specs specify a timestamp property with value T,
   *  then the first returned reading should be the latest one having
   *  timestamp <= T.
   * 
   *  If info specifies a truthy value for a doDetail property, 
   *  then the returned object will have additional 
   *  an additional sensorType giving the sensor-type information
   *  for the sensor and a sensor property giving the sensor
   *  information for the sensor.
   *
   *  Note that the timestamp and count search-spec parameters can be
   *  used in successive calls to allow scrolling through the
   *  collection of all readings for the specified sensor.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensorData(info) {
    const searchSpecs = validate('findSensorData', info);
    //@TODO
    this.senData.sort((a, b) => (a.timestamp > b.timestamp) ? -1 : 1)
    /******************************************************************* */
    var auxData=[];
    //console.log(this.senData);
    for(var i=0; i<this.senData.length;i++){
      
      if(this.senData[i].sensorId === info.sensorId){
        auxData.push(this.senData[i]);

      }
    }
    //console.log(auxData);
    var auxID = auxData[0].sensorId;

    for(var i = 0; i < this.sen.length; i++) {
      if (this.sen[i].id === auxID) {
        var senIndex = i;
        var expectedRange = this.sen[i].expected;
        var model = this.sen[i].model;
      }
    }

    // console.log(expectedRange);
    // console.log(model);

    for(var i = 0; i < this.senType.length; i++) {
      if (this.senType[i].id === model) {
        var senTypeIndex = i;
        var limitRange = this.senType[i].limits;
      }
    }

    //console.log(limitRange);

    function inRange(values,exp,lim) {
      for (var i = 0; i<values.length; i++) {
        //console.log(values[i]);
        if(parseFloat(values[i].value)>parseFloat(exp.min) && parseFloat(values[i].value)<parseFloat(exp.max) && parseFloat(values[i].value)>parseFloat(lim.min) && parseFloat(values[i].value)<parseFloat(lim.max)){
          //console.log(values[i].value);
          values[i].status= 'ok';
          delete values[i].sensorId;
        }
        else if ((parseFloat(values[i].value) > parseFloat(lim.min) && parseFloat(values[i].value) < parseFloat(exp.min)) || (parseFloat(values[i].value) > parseFloat(exp.max) && parseFloat(values[i].value) < parseFloat(lim.max))){
          //console.log(values[i].value);
          values[i].status = 'outOfRange';
          delete values[i].sensorId;
        }
        else{
          //console.log(values[i].value);
          values[i].status = 'error';
          delete values[i].sensorId;
       }
     } 
   }
    
    inRange(auxData,expectedRange,limitRange);

    let auxDataCount = [];

    for (var i = 0; i < info.count; i++) {
      auxDataCount.push(auxData[i]);

    }

    //console.log(auxData);
    console.log(auxDataCount);
/************************************************************* */
    let details = {};
    if (info.doDetail) {
      details.data = auxDataCount;
      details.sensorType = this.senType[senTypeIndex];
      details.sensor = this.sen[senIndex];
    }

    console.log(details);
/******************************************************88 */
    let curStatus = {};
    let ar=[];
    //console.log(typeof(info.statuses));
    console.log(info.statuses);
    if (info.statuses) {
      for (var i = 0; i < auxData.length; i++) {
        if(auxData[i].status===info.statuses)
        {
          ar.push(auxData[i]);
        }
      }
        //console.log(ar);
        // if (auxData[i].status === info.statuses) {
        //   curStatus.data = auxData[i];
        let arr = [];
        for(var i=0;i<info.count;i++){
          //console.log(i);
          arr.push(ar[i]);
          //console.log(curStatus);

        }
        curStatus.data = arr;
        console.log(curStatus);
        
    }
    

    
    /**************************************************** */
    
    //   for(var counter=0;counter<info.count;counter++){
    //     //console.log(Number(counter)+Number(sensorArr.length));
    //     this.dataArr.push(auxData[counter]);
    //   }

  //     function inRange(value,senType,sen){

  //     if((value<sen.expected.max && value>sen.expected.min) && (value<senType.limits.max && value>senType.limits.min))
  //     {
  //       return "OK";
  //     }
  //     if((this.senData.value>this.sen.expected.max && this.senData.value>this.senType.limits.max) && (this.senData.value>this.sen.expected.min && this.senData.value>this.senType.limits.min))
  //     {
  //       return "Error";
  //     }
  //     if((this.senData.value<this.sen.expected.min && this.senData.value>this.sen.expected.max) && (this.senData.value>this.sen.expected.max && this.senData.value<this.senType.limits.max))
  //     {
  //       return "Out of Range";
  //   }
  // }

    // for(var i=0; i<this.senData.length;i++){
    //   var status2=inRange(this.senData[i].value,this.senType,this.Sen);
    //   this.senData[i].status=status2;
    // }
    //   for(let j of this.senData){
    //    var status2=inRange(j.value,this.senType,this.sen);
    //    j.status=status2;
    //  }
    // var exp;
    // for(let j of this.senData){
    //     for(var i=0;i<this.sen.length;j++)
    //     {
    //       if(j.sensorId===this.sen[i].id)
    //       {
    //         exp=this.sen[i].expected;
    //         console.log(exp);
            
    //       }
    //     }
    //    }
       

    
    return {};
  }
  
  
}

module.exports = Sensors;

//@TODO add auxiliary functions as necessary

const DEFAULT_COUNT = 5;    

/** Validate info parameters for function fn.  If errors are
 *  encountered, then throw array of error messages.  Otherwise return
 *  an object built from info, with type conversions performed and
 *  default values plugged in.  Note that any unknown properties in
 *  info are passed unchanged into the returned object.
 */
function validate(fn, info) {
  const errors = [];
  const values = validateLow(fn, info, errors);
  if (errors.length > 0) throw errors; 
  return values;
}

function validateLow(fn, info, errors, name='') {
  const values = Object.assign({}, info);
  for (const [k, v] of Object.entries(FN_INFOS[fn])) {
    const validator = TYPE_VALIDATORS[v.type] || validateString;
    const xname = name ? `${name}.${k}` : k;
    const value = info[k];
    const isUndef = (
      value === undefined ||
      value === null ||
      String(value).trim() === ''
    );
    values[k] =
      (isUndef)
      ? getDefaultValue(xname, v, errors)
      : validator(xname, value, v, errors);
  }
  return values;
}

function getDefaultValue(name, spec, errors) {
  if (spec.default !== undefined) {
    return spec.default;
  }
  else {
    errors.push(`missing value for ${name}`);
    return;
  }
}

function validateString(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'string') {
    errors.push(`require type String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
    return;
  }
  else {
    return value;
  }
}

function validateNumber(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  switch (typeof value) {
  case 'number':
    return value;
  case 'string':
    if (value.match(/^[-+]?\d+(\.\d+)?([eE][-+]?\d+)?$/)) {
      return Number(value);
    }
    else {
      errors.push(`value ${value} for ${name} is not a number`);
      return;
    }
  default:
    errors.push(`require type Number or String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
}

function validateInteger(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  switch (typeof value) {
  case 'number':
    if (Number.isInteger(value)) {
      return value;
    }
    else {
      errors.push(`value ${value} for ${name} is not an integer`);
      return;
    }
  case 'string':
    if (value.match(/^[-+]?\d+$/)) {
      return Number(value);
    }
    else {
      errors.push(`value ${value} for ${name} is not an integer`);
      return;
    }
  default:
    errors.push(`require type Number or String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
}

function validateRange(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'object') {
    errors.push(`require type Object for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
  return validateLow('_range', value, errors, name);
}

const STATUSES = new Set(['ok', 'error', 'outOfRange']);

function validateStatuses(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'string') {
    errors.push(`require type String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
  if (value === 'all') return STATUSES;
  const statuses = value.split('|');
  const badStatuses = statuses.filter(s => !STATUSES.has(s));
  if (badStatuses.length > 0) {
    errors.push(`invalid status ${badStatuses} in status ${value}`);
  }
  return new Set(statuses);
}

const TYPE_VALIDATORS = {
  'integer': validateInteger,
  'number': validateNumber,
  'range': validateRange,
  'statuses': validateStatuses,
};


/** Documents the info properties for different commands.
 *  Each property is documented by an object with the
 *  following properties:
 *     type: the type of the property.  Defaults to string.
 *     default: default value for the property.  If not
 *              specified, then the property is required.
 */
const FN_INFOS = {
  addSensorType: {
    id: { }, 
    manufacturer: { }, 
    modelNumber: { }, 
    quantity: { }, 
    unit: { },
    limits: { type: 'range', },
  },
  addSensor:   {
    id: { },
    model: { },
    period: { type: 'integer' },
    expected: { type: 'range' },
  },
  addSensorData: {
    sensorId: { },
    timestamp: { type: 'integer' },
    value: { type: 'number' },
  },
  findSensorTypes: {
    id: { default: null },  //if specified, only matching sensorType returned.
    index: {  //starting index of first result in underlying collection
      type: 'integer',
      default: 0,
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
  },
  findSensors: {
    id: { default: null }, //if specified, only matching sensor returned.
    index: {  //starting index of first result in underlying collection
      type: 'integer',
      default: 0,
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
    doDetail: { //if truthy string, then sensorType property also returned
      default: null, 
    },
  },
  findSensorData: {
    sensorId: { },
    timestamp: {
      type: 'integer',
      default: Date.now() + 999999999, //some future date
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
    statuses: { //ok, error or outOfRange, combined using '|'; returned as Set
      type: 'statuses',
      default: new Set(['ok']),
    },
    doDetail: {     //if truthy string, then sensor and sensorType properties
      default: null,//also returned
    },
  },
  _range: { //pseudo-command; used internally for validating ranges
    min: { type: 'number' },
    max: { type: 'number' },
  },
};  

