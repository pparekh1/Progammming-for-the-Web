<!DOCTYPE html>
<html>
  <head>
    <title>Search Sensor Type</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  
  <body>
    <h1>Search Sensor Types</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    <form method="GET" action="{{{base}}}/tst-sensor-types-search.html">
   
	{{#fields}}
  {{#isSearchST}}
	    <label>
	    <span class="label">
	      {{#isRequired}}{{/isRequired}}{{friendlyName}}:
	    </span>
      {{#isRequired}}
	    <input name="{{name}}" {{#type}}type="{{type}}"{{/type}}
	           value="{{value}}"> 
        {{/isRequired}}     
      {{#isSelect}}
 <select name="quantity"
     id="quantity" class="tst-quantity">
      <option value="" selected>
        Select
      </option>
      <option value="temperature">
        Temperature
      </option>
      <option value="pressure">
        Pressure
      </option>
      <option value="flow">
        Flow Rate
      </option>
      <option value="humidity">
        Relative Humidity
      </option>
  </select>
{{/isSelect}}
	    </label>
	    <br/>
	    {{#errorMessage}}
	      <span class="error">{{errorMessage}}</span><br/>
	    {{/errorMessage}}
      {{/isSearchST}}
	 {{/fields}}
      <input name="submit" type="submit" value="search" class="control">
    </form> 
    <h2>Results Summary</h2>

    <table class="summary">
        <thead>
    	   <tr>
                  
                  <th>Sensor Type ID</th>
                  <th>Manufacturer</th>
                  <th>Model Number</th>
                  <th>Measure</th>
                  <th colspan="2">Limits</th>
    	   </tr>
    	   <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>Min</th>
                  <th>Max</th>
    	   </tr>
    </thead>
    <tbody>
    {{#users}}
     <tr>
   {{#fields}}
	  {{#value}}
     <td>
          {{value}}
           </td>
	  {{/value}}
     {{/fields}}
       </tr>
     {{/users}}
    
     </tbody>
                
   </table>
  </body>
  
   
   <div class="scroll">
    <a  href="">&lt;&lt;</a>
  {{#shub}}
    <a  href={{shub}}>&gt;&gt;</a>
    {{/shub}}
    </div>
  
   {{>footer}}
</html>
