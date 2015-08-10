## ETE template engine internal variables ##
The "template" variable is reserved for internal use and is basically a string containing the compiled template (which will be converted into a JavaScript function later on).

Assign content of other variables as described below:
```
<div><b><%= data.Placemark[0].address.split(',')[0]; %></b></div>
```

or within attributes:
```
<img class="processing" src="#%= data.pathPrefix; %#/template/processing.gif" alt="Processing" />
```

Note: do not decalre/initialize a second variable named "template", this may overwrite the internal template and cause errors!

The "data" variable encapsulates all data you pass into ETE:

```
$('script#tplNeighborSpotsTableBody').ete({
  ...,
  data: { spotList: spotList, selector: 'neighborSpots' }
});
```

If you have to pass only one value assign it as follows:

```
$('script#tplNeighborSpots').ete({
  ...,
  data: geocache
});
```

## ETE template engine parameters and handlers ##
|**Parameter**|**Default:**|**Description:**|
|:------------|:-----------|:---------------|
|**namespace**|'ETE'       |Prefix, used for caching template in the document.window object, to avoid collisions with other objects.|
|**cache**    |true        |Enable or disable caching. Note: cache will be cleared after each page relaod.|
|**(selector:)**|(null)      |(An ID or the template name, necessary and available only in standalone ETE library. In the jQuery version, the ID/Class etc. or name is passed as jQuery parameter: $('#ID').ete({...}), $('.class').ete({...}), $('tagName').ete({...}) or $('templateName').ete({...}))|
|**data**     |null        |The data you want to pass into ETE template engine. If data is null, ETE will compile, cache and execute the template function.|
|**debug**    |null        |If a debug handler is specefied (is not null) the custom debug handler will be executed before and after each sequence/step (see examples for further details). The debug function always receives a log object of the following structure: { majorSequenceNo: 1, minorSequenceNo: 1, message: 'Internal template ID is:', data: templateId } **Handler-interface:**  function(templateId, options, templateFunction){ ... } **Returns by default:** nothing|
|**hash**     |See source...|Creates a hash from the specified selector or template name. **Handler-interface:** function(str){ ... } **Returns by default:** hashed template name.|
|**callbefore**|null        |Will be called before the template is loaded and compiled. **Handler-interface:** function(templateSelector, options){ ... } **Returns by default:** nothing|
|**load**     |See source...|Handles the load operation (only if caching is enabled and template is not already cached). Will be executed after callbefore handler. **Handler-interface:** function(templateSelector){ ... } **Returns by default:** a string containing the template.|
|**parse**    |See source...|Parses the template, will be executed after loading the template. **Handler-interface:** function(template){ ... } **Returns by default:** a two dimensional array. Each row contains a boolean flag (isJs) which indicates whether the row (code) contains a JavaScript- or XML-fragment.|
|**compile**  |See source...|Translates the template into an JavaScript function. **Handler-interface:** function(functionName,templBatch){ ... } **Returns by default:** a string which will be converted into JavaScript function (with new Function()).|
|**callback** |See source...|Assumes by default an inlined template, replaces the inlined template with the compiled template. **Handler-interface:** function(templateSelector, compiledTemplate){ ... } **Returns by default:** nothing|

## Overwrite default functions and behaviour ##
ETEs default behaviour is defined by the following functions: hash, callbefore, load, parse, compile, debug and callback.
If this default behavoir does not meet your expectations, just overwrite the function with your custom handler. This is, for example, necessary    when ETE has to load the template content from an external template library (loaded by AJAX). See: "Example 4. Loding a template library".

Overwriting the default behavour is also necessary if you have to debug your template. By default, there is no debug-handler registred. If you want to use your custom debug handler, just decalre it while initializing ETE:

```
var neighbors = $('script#tplNeighborSpots').ete({
            callback:     function(sel, template){ return(template); }, //Overwrite default callback handler, the default handler would replace the "source" template with the compiled template, instead of returning the compiled template as a string...
            debug:         function(log){    //Define a custom debug handler...
                if(log.majorSequenceNo == 8 && (log.minorSequenceNo == 1 || log.minorSequenceNo == 2)){
                    var msg = log.message + '\n';
                    if(log.data)
                        msg += log.data;
                    alert(msg);
                }
            },
            data: { geocache: geocache }
        });
```

## Embedding ETE within XML/XHTML tags ##
Use XML comments (<% and %>) to embed ETE code within XML/XHTML tags. Always use well-formed and standard XML/XHTML:
```
<script type="text/xml" id="tplAddress">
     <h2>Address</h2>
     <% if(data != null && data.Status.code == G_GEO_SUCCESS){ %>
         <% for(var j = 0; j < data.Placemark[0].address.split(',').length; j++){ %>
            <% if(j <= 1){ %>
                <div><b><%= data.Placemark[0].address.split(',')[j]; %></b></div>
             <% }else{ -->
                <b><%= data.Placemark[0].address.split(',')[j]; %></b>
            <% } %>
        <% } %>
    <% }else{ %>
        <b>Unable to find address</b>
     <% } %>
     <h2>Geo. Coordinate</h2>
     <p><b>Latitude:</b> <%= getWGS84Latitude(data); %> </p>
     <p><b>Longitude:</b> <%= getWGS84Longitude(data); %> </p>
</script>
```

## Embedding ETE within XML/XHTML attributes ##
Use the following marker to embed ETE in XML attributes: #% and %#. Do not use < and > characters within attributes. Use Entities instead: &lt; and &gt;. Always use well-formed and standard XML/XHTML:
```
<div onclick="alert('#% if(data['caption'].length &gt; 0){ template+= data['caption']; }else{ template+= 'Empty caption!'; } %#');">
```