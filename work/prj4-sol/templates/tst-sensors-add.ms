<!DOCTYPE html>
<html>
  <head>
    <title>Add Sensors</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Create/Update Sensors</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    <form method="POST" action="{{{base}}}/tst-sensors-add.html">
   
	{{#fields}}
  {{#isAddS}}
	    <label>
	    <span class="label">
	      {{#isRequiredSensor}}* {{/isRequiredSensor}}{{friendlyName}}
	    </span>
      {{#isRequiredSensor}}
	    <input name="{{name}}" {{#type}}type="{{type}}"{{/type}}
	           value="{{value}}"> 
        {{/isRequiredSensor}}     
      
	    </label>
	    <br/>
	    {{#errorMessage}}
	      <span class="error">{{errorMessage}}</span><br/>
	    {{/errorMessage}}
      {{/isAddS}}
	 {{/fields}}
      <input name="submit" type="submit" value="add" class="control">
    </form> 
    {{>footer}}
  </body>
</html>
