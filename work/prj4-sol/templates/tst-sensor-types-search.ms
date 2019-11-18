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
    <form method="POST" action="{{{base}}}/tst-sensor-types.search.html">
   
	{{#fields}}
	    <label>
	    <span class="label">
	      {{#isRequired}}* {{/isRequired}}{{friendlyName}}:
	    </span>
	    <input name="{{name}}" {{#type}}type="{{type}}"{{/type}}
	           value="{{value}}">
	    </label>
	    <br/>
	    {{#errorMessage}}
	      <span class="error">{{errorMessage}}</span><br/>
	    {{/errorMessage}}
	 {{/fields}}
      <input name="submit" type="submit" value="search" class="control">
    </form> 
    {{>footer}}
  </body>
</html>
