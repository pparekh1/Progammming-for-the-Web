<!DOCTYPE html>
<html>
  <head>
    <title>Search Sensor</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Search Sensor</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    <form method="GET" action="{{{base}}}/tst-sensors-search.html">
   
	{{#fields}}
  
  {{#isSearchS}}
	    <label>
	    <span class="label">
	      {{#isRequiredSensor}}{{/isRequiredSensor}}{{friendlyName}}:
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
      {{/isSearchS}}
	 {{/fields}}
      <input name="submit" type="submit" value="search" class="control">
    </form> 
  <h2>Results Summary</h2>

  <table class="summary">
        <thead>
    	   <tr>
                  <th>Sensor ID</th>
                  <th>Model</th>
                  <th>Period</th>
                  <th colspan="2">Expected Range</th>
    	   </tr>
    	   <tr>
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
    <a class="tst-prev" href="?_index&#x3D;5" rel="prev">&lt;&lt;</a>
    <a class="tst-next" href="?_index&#x3D;15" rel="next">&gt;&gt;</a>
    </div>
    
    {{>footer}}
  
</html>
