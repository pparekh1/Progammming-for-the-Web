'use strict';

const AppError = require('./app-error');
const validate = require('./validate');

const assert = require('assert');
const mongo = require('mongodb').MongoClient;

class Sensors {

    constructor(client,database){
    this.client=client;
    this.database=database;
    for (const [k, v] of Object.entries(COLLECTIONS)) {
      this[k] = this.database.collection(v);
    }
    
  }
  /** Return a new instance of this class with database as
   *  per mongoDbUrl.  Note that mongoDbUrl is expected to
   *  be of the form mongodb://HOST:PORT/DB.
   */
  static async newSensors(mongoDbUrl) {
    //@TODO
    //const url=mongoDbUrl;
    console.log(mongoDbUrl);
    const url =  mongoDbUrl.match(/(\w+):\/\/([^/]+)\/(.*)/);
    if (!url) {
      throw [ `Incorrect format of URL` ];
    }
    
    else{
   // const m = url.match(/(\w+)(.*):(\d*)\/?(.*)/);
   // const m=url.match(/(^mongodb):\/\/([A-Za-z0-9\.-]{3,}(?:\:\d+))\/(.*)/);
    var [full,name,port,dbName]=url;
    // console.log(full);
    // console.log(name);
    // console.log(port);
    // console.log(db);
    var db1=dbName;
    var mongoUrl = `mongodb://${port}`;
    console.log(mongoUrl);
    
    }
    // if(name!=="mongodb"){
    //   throw [ `invalid name` ];
    // }
    //let dbName=db;
    //console.log(dbName);
    
    const client= await mongo.connect(mongoUrl,MONGO_OPTIONS);
   
    const database = client.db(db1);
    //console.log("Successfully connected");
    //console.log(database);
  
  
    return new Sensors(client,database);    
  }

  

  /** Release all resources held by this Sensors instance.
   *  Specifically, close any database connections.
   */
  async close() {
    //@TODO
    await this.client.close();
  }

  /** Clear database */
  async clear() {
    //@TODO
    await this.database.dropDatabase();
  }

  /** Subject to field validation as per validate('addSensorType',
   *  info), add sensor-type specified by info to this.  Replace any
   *  earlier information for a sensor-type with the same id.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async addSensorType(info) {
    const sensorType = validate('addSensorType', info);
    //@TODO
   // console.log(sensorType.id);
  //  var senType=[];
   //var mode=0;
    
  //   console.log("inside add sensor types");
  //  // var col=senType.push(await this.database.collection("sensorTypes").find().toArray());
  //   //console.log(col);
    // for(var i in await this.database.collection("sensorTypes").find().toArray()){
    //   if(sensorType.id){
    //     mode=1;
    //   }
    // }
    // if(mode===1){
    //   const err = `Already present`;
    // throw [ new AppError('present', err) ];

    // }
    // else{
     await this.database.collection("sensorTypes").replaceOne({id:sensorType.id}
      ,sensorType,{upsert:true});
    // let test1 = await this.database.collection("sensorTypes").find({id:"ge-t37c"}).toArray();
    // console.log(test1);

    
   //  }
    
  //   if(sensorType.id===this.database.collection("sensortTypes")){
  //     const err = `Already present`;
  //   throw [ new AppError('present', err) ];
    
  //   //let ret=await test.insertMany()
  // }
  // else{
  //   let test = await this.database.collection("sensorTypes").insertOne(sensorType);
  //   let test1 = await this.database.collection("sensorTypes").find({id:"ge-t37c"}).toArray();
  //   console.log(test1);
    
  // }
}
  /** Subject to field validation as per validate('addSensor', info)
   *  add sensor specified by info to this.  Note that info.model must
   *  specify the id of an existing sensor-type.  Replace any earlier
   *  information for a sensor with the same id.
   *
   *  All user errors must be thrown as an array of AppError's.
   */

  async addSensor(info) {
    const sensor = validate('addSensor', info);
    //@
    var mode=0;
    var senType;
    senType=await this.database.collection("sensorTypes").find().toArray();
    console.log(senType);
    for(var i of senType){
      if(i.id===sensor.model){
        mode=1;
      }
    }
    if(mode===1){
      await this.database.collection("sensors").insertOne(sensor);

    }
    else{
      const err = `Already present`;
    throw [ new AppError('present', err) ];
    }


  }

  /** Subject to field validation as per validate('addSensorData',
   *  info), add reading given by info for sensor specified by
   *  info.sensorId to this. Note that info.sensorId must specify the
   *  id of an existing sensor.  Replace any earlier reading having
   *  the same timestamp for the same sensor.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async addSensorData(info) {
    const sensorData = validate('addSensorData', info);
    //@TODO
    var mode=0;
    var sen;
    sen=await this.database.collection("sensors").find().toArray();
    for(var i of sen){
      if(i.id===sensorData.sensorId){
        mode=1;
      }
    }
    if(mode===1){
      await this.database.collection("sensorData").insertOne(sensorData);

    }
    else{
      const err = `Already present`;
    throw [ new AppError('present', err) ];
    }
  }

  /** Subject to validation of search-parameters in info as per
   *  validate('findSensorTypes', info), return all sensor-types which
   *  satisfy search specifications in info.  Note that the
   *  search-specs can filter the results by any of the primitive
   *  properties of sensor types (except for meta-properties starting
   *  with '_').
   *
   *  The returned value should be an object containing a data
   *  property which is a list of sensor-types previously added using
   *  addSensorType().  The list should be sorted in ascending order
   *  by id.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  _index meta-property for the next search.  Note that the _index
   *  (when set to the lastIndex) and _count search-spec
   *  meta-parameters can be used in successive calls to allow
   *  scrolling through the collection of all sensor-types which meet
   *  some filter criteria.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async findSensorTypes(info) {
    //@TODO
    const searchSpecs = validate('findSensorTypes', info);
    //this.database.collection("sensorTypes").find().sort({id:1}).toArray;
   // console.log(searchSpecs.id);
    var test1;
    var nextIndex=-1;
   
    let type=[];
    
  console.log(searchSpecs._index);
  console.log(searchSpecs._count);

    if(searchSpecs.id){
      //var test = await this.database.collection("sensorTypes").insertOne(sensorType);
      test1 = await this.database.collection("sensorTypes").find({id:searchSpecs.id}).sort({id:1}).toArray();
      type.push(test1);
   
    }
    else if(searchSpecs.manufacturer && searchSpecs.quantity){
      test1= await this.database.collection("sensorTypes").find({manufacturer:searchSpecs.manufacturer,quantity:searchSpecs.quantity}).sort({id:1}).limit(searchSpecs._count).skip(searchSpecs._index).toArray();
      type.push(test1);
      //nextIndex=-1;
    }    
    else if(searchSpecs.manufacturer){
      test1=await this.database.collection("sensorTypes").find({manufacturer:searchSpecs.manufacturer}).sort({id:1}).limit(searchSpecs._count).skip(searchSpecs._index).toArray();
      type.push(test1);
 }

//console.log(type);
for(let i=0;i<test1.length;i++){
  delete test1[i]['_id'];
}
if(searchSpecs._index!==0 &&searchSpecs._count!==5){
  nextIndex= searchSpecs._index+searchSpecs._count;
}



    //console.log(test1);
    return { data:[type], nextIndex };
  }
  
  /** Subject to validation of search-parameters in info as per
   *  validate('findSensors', info), return all sensors which satisfy
   *  search specifications in info.  Note that the search-specs can
   *  filter the results by any of the primitive properties of a
   *  sensor (except for meta-properties starting with '_').
   *
   *  The returned value should be an object containing a data
   *  property which is a list of all sensors satisfying the
   *  search-spec which were previously added using addSensor().  The
   *  list should be sorted in ascending order by id.
   *
   *  If info specifies a truthy value for a _doDetail meta-property,
   *  then each sensor S returned within the data array will have an
   *  additional S.sensorType property giving the complete sensor-type
   *  for that sensor S.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  _index meta-property for the next search.  Note that the _index (when 
   *  set to the lastIndex) and _count search-spec meta-parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensors which meet some filter criteria.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async findSensors(info) {
    //@TODO
    const searchSpecs = validate('findSensors', info);
    var test1;
    var s=[];
    var nextIndex;
    var len;
    len=await this.database.collection("sensors").find({model:searchSpecs.model}).sort({id:1}).toArray()
    console.log(len.length);

    if(searchSpecs.model){
      test1=(await this.database.collection("sensors").find({model:searchSpecs.model}).sort({id:1}).limit(searchSpecs._count).skip(searchSpecs._index).toArray());
      console.log(typeof(test1));
      s.push(test1);
      nextIndex=test1.length+searchSpecs._index;

    }
    // else if(searchSpecs.model && searchSpecs._index && searchSpecs._count){
    //   test1=(await this.database.collection("sensors").find({model:searchSpecs.model}).sort({id:1}).limit(searchSpecs._count).toArray());
    //   s.push(test1);
    //   console.log(s.length);
    //   nextIndex=len.length+searchSpecs._index;

    // }
    return { data: s, nextIndex };
  }
  
  /** Subject to validation of search-parameters in info as per
   *  validate('findSensorData', info), return all sensor readings
   *  which satisfy search specifications in info.  Note that info
   *  must specify a sensorId property giving the id of a previously
   *  added sensor whose readings are desired.  The search-specs can
   *  filter the results by specifying one or more statuses (separated
   *  by |).
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
   *  Note that the timestamp search-spec parameter and _count
   *  search-spec meta-parameters can be used in successive calls to
   *  allow scrolling through the collection of all readings for the
   *  specified sensor.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async findSensorData(info) {
    //@TODO
    const searchSpecs = validate('findSensorData', info);
    var auxData=[];
    var senDataC;
    var senDataId;
    var senTypeC;
    var sensorC;
    
    
    senDataC=await this.database.collection("sensorData")
                .find().sort({a:1}).toArray();
    senTypeC=await this.database.collection("sensorTypes").find()
                .sort({a:1}).toArray();  
    sensorC=await this.database.collection("sensors").find()
                  .sort({a:1}).toArray();
    //console.log(senC);
    senDataId=await this.database.collection("sensorData").find({sensorId:searchSpecs.sensorId}).sort({id:1}).toArray();
    console.log(senDataId[0]);
    // for(var i in senDataC){
    //   if(i.sensorId===searchSpecs.sensorId){
        
    var auxId=senDataId[0].sensorId;
    //console.log(auxId);
    
    for(var i=0;i<sensorC.length;i++){
      
      if(sensorC[i].id===auxId){
      
        var sensorIndex=i;
        var expectedRange=sensorC[i].expected;
        var model=sensorC[i].model;
      }
    }
    // console.log(expectedRange);
    // console.log(model);

    for(var i = 0; i < senTypeC.length; i++) {
      if (senTypeC[i].id === model) {
        var senTypeIndex = i;
        var limitRange = senTypeC[i].limits;
      }
    }
    //console.log(limitRange);

    function inRange(values,exp,lim) {
      let dataCopy = [];
      for (var i = 0; i<values.length; i++) {
        //console.log(values[i]);
        if(parseFloat(values[i].value)>parseFloat(exp.min) && parseFloat(values[i].value)<parseFloat(exp.max) && parseFloat(values[i].value)>parseFloat(lim.min) && parseFloat(values[i].value)<parseFloat(lim.max)){
          //console.log(values[i].value);
          dataCopy.push({timestamp: values[i].timestamp,
                         value: values[i].value,
                          status: 'ok'}); 
        }
        else if ((parseFloat(values[i].value) > parseFloat(lim.min) && parseFloat(values[i].value) < parseFloat(exp.min)) || (parseFloat(values[i].value) > parseFloat(exp.max) && parseFloat(values[i].value) < parseFloat(lim.max))){
          //console.log(values[i].value);
          dataCopy.push({timestamp: values[i].timestamp,
            value: values[i].value,
             status: 'outOfRange'});
        }
        else{
          //console.log(values[i].value);
          dataCopy.push({timestamp: values[i].timestamp,
            value: values[i].value,
             status: 'error'});
       }
     } 
     return dataCopy;
   }

   var datacopy = inRange(senDataId,expectedRange,limitRange);
   
   //console.log(datacopy);

   function count (data, count) {
    let auxDataCount = [];

    for (var i = 0; i < count; i++) {
    auxDataCount.push(data[i]);
    }

    //console.log(auxDataCount);
    return auxDataCount;
  }


  if(searchSpecs._count){
    var res = count(datacopy, info._count);
  }

  var counter=0;
   if(searchSpecs.sensorId && (!info.statuses) && (!info._count) && (!info.timestamp) && (!info.doDetail)){
     var helper=[];
     for(var i=0;i<datacopy.length &&  counter<searchSpecs._count;i++){
       if(datacopy[i].status==='ok'){
         helper.push(datacopy[i]);
         counter++;

       }
       
       }
       console.log("helper");
       return {data:helper};
     }
     

   
   else if(searchSpecs.sensorId && info.statuses && (!info._count) && (!info.timestamp) && (!info.doDetail))
   {
    var helper1=[];
    for(var i=0;i<datacopy.length &&  counter<searchSpecs._count;i++){
      //if(datacopy[i].status){
        helper1.push(datacopy[i]);
        counter++;

     // }
      
      }
      console.log("helper1");

      return {data:helper1};
   
  
  
  
   }
   else if(searchSpecs.sensorId && searchSpecs.statuses && searchSpecs._count && searchSpecs.timestamp && (!info.doDetail)){
     var helper3=[];
     var counter=0;
      for(var i=0;i<datacopy.length && counter<searchSpecs._count;i++){
          if(datacopy[i].timestamp<=searchSpecs.timestamp){
            helper3.push(datacopy[i]);
            counter++;
          }
        

      }
      console.log("helper3");
      return {data:helper3}; 
   }




    //id,count
  else if(info.sensorId && (!info.statuses) && info._count && (!info.timestamp) && (!info.doDetail)){
      return {data: res};
    
}

//console.log(auxData);
//console.log(auxDataCount);

/************************************************************* */
else if (searchSpecs.sensorId && searchSpecs.statuses && searchSpecs.count && (!searchSpecs.timestamp) && searchSpecs._doDetail){
  var details = {};
  if (searchSpecs._doDetail) {
  details.data = res;
  details.sensorType = senTypeC[senTypeIndex];
  details.sensor = sensorC[senIndex];
  }
  return details;
}


/****************************************************************/

else if (info.sensorId && info.statuses && info._count && (!info.timestamp) && (!info._doDetail)  || (info.sensorId && info.statuses && info._count && info.timestamp && (!info._doDetail))) 
{

  console.log("ar contents:");
  console.log(ar);
  let curStatus = {};
  let ar=[];
  var counter=0;

  if (info.statuses) {
    let choice1;
    let choice2;;
    if(info.statuses.includes('|')){                 
     choice1 = info.statuses.split('|')[0];
    choice2 = info.statuses.split('|')[1];
}    else{
   choice1 = info.statuses;
}
    for (var i = 0; i < senDataId.length; i++) {             //changed   senDataId
      if(datacopy[i].status===choice1 || datacopy[i].status===choice2)
      {
        ar.push(datacopy[i]);
      
      }
    }  
    let arr=[];
    for(var i=0;i<ar.length;i++){
      if(info.timestamp){
        if(ar[i].timestamp<=info.timestamp){
          arr.push(ar[i]);
        }
      }
    }
    var arrTemp=[];
    var arTemp=[];
    for(var i=0;i<info.count;i++){
      if(info.timestamp){
        arrTemp.push(arr[i]);
      }
    
    else{
      arTemp.push(ar[i]);
    }
  }
  if(info.timestamp){
    curStatus.data=arrTemp;
}  else {
  curStatus.data=arTemp;
}
    
}   
 return curStatus;
 
    }

  }

    //return { data: [], };
  
}
  
  

 //class Sensors


module.exports = Sensors.newSensors;

//Options for creating a mongo client
const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


function inRange(value, range) {
  return Number(range.min) <= value && value <= Number(range.max);
}

const COLLECTIONS = {
  sensorTypes: 'sensorTypes',
  sensors: 'sensors',
  // sensorData: 'sensorData',
};

