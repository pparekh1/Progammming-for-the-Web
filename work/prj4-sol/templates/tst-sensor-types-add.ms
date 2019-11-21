<!DOCTYPE html>
<html>
  <head>
    <title>Add Sensor Type</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Create/Update Sensor Types</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    <form method="POST" action="{{{base}}}/tst-sensor-types-add.html">
   
	{{#fields}}
  {{#isAddST}}
	    <label>
	    <span class="label">
	      {{#isRequired}}* {{/isRequired}}{{friendlyName}}
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
      {{/isAddST}}
	 {{/fields}}
      <input name="submit" type="submit" value="add" class="control">
    </form> 
    {{>footer}}
  </body>
</html>
