## 1. Example: Initialize tabbed GOOGLE infowindow ##

Load templates and return XHTML string instead of injecting into DOM:

**Javascript code:**
```
    var neighbors = $('script#tplNeighborSpots').ete({
        callback: function(sel, template){ return(template); },
        data: { geocache: geocache }
    });
        
    var address = $('script#tplAddress').ete({
        callback: function(sel, template){ return(template); },
        data: { geocache: geocache }
    });
        
    marker.bindInfoWindowTabs(new Array(new GInfoWindowTab('Nearby',  neighbors),
                                        new GInfoWindowTab('Details', address)));
```

**Template code:**
```
    <script type="text/xml" id="tplNeighborSpots">
        <div>
            <div>Spots near <%= getAddressFromGeocache(data.geocache,false); %></div>
            <table>
                <thead>
                    <tr>
                        <th><b>No.</b></th>
                        <th><b>Distance (km):</b></th>
                        <th><b>Rating:</b></th>
                        <th><b>Address:</b></th>
                        <th>Jump</th>
                        <th>Directions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="6"><img src="./template/processing.gif" alt="Processing" /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </script>

    <script type="text/xml" id="tplAddress">
        <div>
            <div>Address</div>
            <% if(data != null && data.Status.code == G_GEO_SUCCESS){ %>
                <% for(var j = 0; j < data.Placemark[0].address.split(',').length; j++){ %>
                    <% if(j < 1){ %>
                        <span style="display:block"><b><%= data.Placemark[0].address.split(',')[j]; %></b></span>
                    <% }else{ %>
                        <b><%= data.Placemark[0].address.split(',')[j]; %></b>
                    <% } %>
                <% } %>
            <% }else{ %>
                <b>Unable to find address</b>
            <!--} %>
            <div>Geo. Coordinate</div>
            <p><b>Latitude:</b> <%= getWGS84Latitude(data); %> </p>
            <p><b>Longitude:</b> <%= getWGS84Longitude(data); %> </p>
        <div>
    </script>
```

## 2. Example: Inlined templates ##

Expand inlined templates (replace template source with compiled XHTML)

**Javascript code:**
```
    $('#fourthTarget').ete({
        data: {    caption: '3. Space-Taxi Timetable (3.1.1982):',
                   "th":["No.","Space-Taxi","Earth","Jupiter","Saturn","Uranus","Neptun"],
                   table: new Array(   new Array('Space-Taxi','Neptun','Uranus','Saturn','Jupiter','Earth'),
                                    new Array('Alan',6,'','','',22),
                                    new Array('Ida',12,15,'17:30',18,20),
                                    new Array('Enterprise',8,'9:30','10:30',11,12),
                                    new Array('Clingonian spaceship',16,'17:30','',19,null))
        }
    });
```

**Template code:**
```
    <html>
    <body>
    ...
        <div id="fourthTarget" style="display:none">
            <div>
                <h2><%= data['caption']; %></h2>
                <div>
                    <table>
                        <thead>
                            <tr>
                            <% for(var i = 0; i < data['th'].length; ++i){ %>
                                <th><b><%= data['th'][i]; %></b></th>
                            <% } %>
                            </tr>
                        </thead>
                        <tbody>
                        <% for(var i = 0; i < data['table'].length; ++i){ %>
                            <% if((i+1) % 5 == 0){-->
                            <tr style="color: red;">
                                <td> <% template += (i+1) ; %> </td>
                                <% for(var j = 0; j < data['table'][i].length; ++j){ %>
                                <td>
                                    <% if(data['table'][i][j] == ''){ %>
                                        <b>Empty...</b>
                                    <% }else{  %>
                                        <% if(data['table'][i][j] != null){
                                            template += '<b>'+data['table'][i][j]+'</b>';
                                        }else{  %>
                                            <b>-</b>
                                        <% } %>
                                    <% } %>
                                </td>
                                <% } %>
                            </tr>
                            <!--}else{  %>
                            <tr  style="color: green;">
                                <td> <%= (i+1); %> </td>
                                <% for(var j = 0; j < data['table'][i].length; ++j){ %>
                                <td>
                                    <% if(data['table'][i][j] == ''){ %>
                                        <b>Empty...</b>
                                    <% }else{  %>
                                        <% if(data['table'][i][j] != null){
                                            template += '<b>'+data['table'][i][j]+'</b>';
                                        }else{  %>
                                            <b>-</b>
                                        <% } %>
                                    <% } %>
                                </td>
                                <% } %>
                            </tr>
                            <% } %>
                        <% } %>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    ...
    </html>
    </body>
```

## 3. Example: inject template into DOM ##

Use the following code snippet if you want to append XML/XHTML data within an existing container:

**Javascript code:**
```
    $('script#tplNeighborSpotsTableBody').ete({
        callbefore: function(sel, template){
            $(selector+' table > tbody > *').remove(); //Cleanup legacy data first..
        },
        callback: function(sel, template){
            $(selector+' table > tbody').append(template); //There is already a table with tbody where the XML code will be injected...
        },
        data: { spotList: spotList, selector: 'spotNeighborSpots' }
    });
```

**Template code:**
```
    <script type="text/xml" id="tplNeighborSpotsTableBody">
        <% if(data.spotList.result){ %>
            <% if(data.spotList.code == SUCCESS || data.spotList.result.length != 0){ %>
                <% for(var i = 0; i < data.spotList.result.length; ++i){ %>
                    <tr>
                        <td><% template += (i+1) %></td>
                        <% if(data.spotList.result[i].distance >= 1000){ %>
                            <td><% template += round(data.spotList.result[i].distance/1000,0); %></td>
                        <% }else{ %>
                            <td><% template += round(data.spotList.result[i].distance,0)/1000; %></td>
                        <% } %>
                        <td><b><% template += round(data.spotList.result[i].rating,0); %></b></td>
                        <td><% template += getAddressFromGeocache(data.spotList.result[i].geocache); %></td>
                        <td>
                            <input type="button" onclick="jump2spot('#% template += data.spotList.result[i].id;--#', map, false,$('##!--template += data.selector;--# #direction_2_#!--template += data.spotList.result[i].id;--#').val());" value="Jump"></input>
                        </td>
                        <td>
                            <select id="direction_2_#% template += data.spotList.result[i].id;--#">
                                <option value="none"></option>
                                <option value="G_TRAVEL_MODE_DRIVING">Drive</option>
                            </select>
                        </td>
                    </tr>
                <% } %>
            <% }else{ %>
                <tr><td colspan="6"><b>No neighbor spots found...</b></td></tr>
            <% } %>
        <% }else{ %>
            <tr><td colspan="6"><b>No neighbor spots found...</b></td></tr>
        <% } %>
    </script>
```


## 4. Loading a template library ##

ETE is capable of loading a template library containing a single or dozens of templates.  The data to feed ETE may also be loaded via AJAX...

**Javascript code:**
```
    jQuery.ajax({
        url: 'template.xml',
        dataType: 'html',
        success: function(xmlData){
            $(xmlData).find('eteTemplate').each(function(){
                var templ = $(this).html();
                $($(this).attr('id')).ete({ //Note: we pass in the ID of the template as template name and not an ordinary selector! In order to access the compiled template, you have to know this name... You may also use another mechanism to label your template but keep in mind, the name must be unique. Otherwise ETE will ignore (will not cache) further templates with the same name!
                    load: function(templateSelector){return(templ);}
                });
            });
            
            //Trigger an ajax request and inject compiled template into DOM...
            jQuery.ajax({
                url: 'json.php',
                dataType: 'json',
                success: function(ajaxData){
                    $('fourthTemplate').ete({
                        callback: function(sel, template){ $('#fourthTarget').replaceWith(template); },
                        data: ajaxData
                    });
                }
            });
        }
    });
```

**Template library:**
```
    <?xml version="1.0" encoding="utf-8"?>
    <templates>
        <eteTemplate id="template">
        ...
        </eteTemplate>
        
        <eteTemplate id="thirdTemplate">
        ...
        </eteTemplate>
        
        <eteTemplate id="fourthTemplate">
            <div>
                <h2> <% template += data['caption']; %> </h2>
                <div>
                    <table class="tablesorter">
                        <thead>
                            <tr>
                            <% for(var i = 0; i < data['th'].length; ++i){ %>
                                <th><b><!--template += data['th'] [i]--></b></th>
                            <% } %>
                            </tr>
                        </thead>
                        <tbody>
                        <% for(var i = 0; i < data['table'].length; ++i){ %>
                            <% if((i+1) % 5 == 0){-->
                            <tr style="color: red;">
                                <td> <% template += (i+1) ; %> </td>
                                <% for(var j = 0; j < data['table'][i].length; ++j){ %>
                                <td>
                                    <% if(data['table'][i][j] == ''){ %>
                                        <b>Empty...</b>
                                    <% }else{  %>
                                        <% if(data['table'][i][j] != null){
                                            template += "<b>"+data["table"][i][j]+"</b>";
                                        }else{  %>
                                            <b>-</b>
                                        <% } %>
                                    <% } %>
                                </td>
                                <% } %>
                            </tr>
                            <% }else{  %>
                            <tr style="color: green;">
                                <td> <%= (i+1); %></td>
                                <% for(var j = 0; j < data['table'][i].length; ++j){ %>
                                <td>
                                    <% if(data['table'][i][j] == ''){ %>
                                        <b>Empty...</b>
                                    <% }else{ %>
                                        <% if(data['table'][i][j] != null){
                                            template += '<b>'+data['table'][i][j]+'</b>';
                                        }else{ %>
                                            <b>-</b>
                                        <% } %>
                                    <% } %>
                                </td>
                                <% } %>
                            </tr>
                            <% } %>
                        <% } %>
                        </tbody>
                    </table>
                </div>
            </div>
        </eteTemplate>
    </templates>
```

**Template code:**
```
    ...
    <body>
        <p id="firstTarget"></p>
        
        <p id="secondTarget"></p>
        
        <p id="thirdTarget"></p>
        
        <div id="fourthTarget" style="display:none"></div>
    </body>
    ...
```