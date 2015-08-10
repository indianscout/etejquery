## Always use well-formed and standard XML/XHTML ##

Not well-formed templates cause XML-parsers to fail (e.g. when loading XML-templates via AJAX, when injecting template data into DOM, etc.)!
There is only one adequate solution: use well-formed and standard XML/XHTML!

## Use always <% if(...){ %>...<% }else{ %>...<% } %> ##

ETE loads and compiles the following template without errors, but the internal translation into a JavaScript function fails:
```
<% if(data.geocache.Placemark) %>
        <input type="radio" name="spot_id" value="0" checked="checked" /> <b><%= address; %>, Latitude: <%= round(data.lat,4); %> / Longitude: <%= round(data.lng,4); %><\/b>
<% else %>
        <input type="radio" name="spot_id" value="0" checked="checked" /> <b>Unknown Address, Latitude: <%= round(data.lat,4); %> / Longitude: <%= round(data.lng,4); %><\/b>
```

**Reason:** the template code will be translated to:
```
        if(data.geocache.Placemark)
            template += '<input type="radio" name="spot_id" value="0" checked="checked" /> <b>';
             template += address;
            template += ', Latitude: ';
             template += round(data.lat,4);
            template += ' / Longitude: ';
             template += round(data.lng,4);
            template += '<\/b>';
        else
            template += '<input type="radio" name="spot_id" value="0" checked="checked" /> <b>Unknown Address, Latitude: ';
             template += round(data.lat,4);
            template += ' / Longitude: ';
             template += round(data.lng,4);
            template += '<\/b>';
```
As you can see, the if() and else section contains more than one instruction and the brackets ({}) are missing. If this code is passed to "new Function()" (internally), the JavaScript parser will fail!

**Use the following template code instead:**
```
        <% if(data.geocache.Placemark){ %>
            <input type="radio" name="spot_id" value="0" checked="checked" /> <b><%= address; %>, Latitude: <%= round(data.lat,4); %> / Longitude: <%= round(data.lng,4); %><\/b>
        <% }else{ %>
            <input type="radio" name="spot_id" value="0" checked="checked" /> <b>Unknown Address, Latitude: <%= round(data.lat,4); %> / Longitude: <%= round(data.lng,4); %><\/b>
        <% } %>
```

## Use different variable name for loop counters ##

Loop counters are internal variables, use different variable names to avoid mutual interference:
```
    <% for(var i = 0; i < data.latestVisits.result.length; i++){ %>
        <% for(var j = 0; j < data.latestVisits.result.length; j++){ %>
            <% if(data.latestVisits.result[j]['image_path']){ %>
                <a href="#%= '.'+IMAGE_PATH+data.latestVisits.result[j]['image_path']; %#" title="#%= removeHTMLTags(data.latestVisits.result[j]['comment']); %# (&copy; #%= data.latestVisits.result[j]['user']; %#)" style="display:none">
                    <img style="display:none" src="#%= '.'+IMAGE_PATH+data.latestVisits.result[j]['image_path']; %#" alt="#%= removeHTMLTags(data.latestVisits.result[j]['comment']); %# (&copy; #%= data.latestVisits.result[j]['user']; %#)" />
                </a>
            <% } %>
        <% } %>
    <% } %>
```

## Quotation problems ##

Be careful with quoting and escaping quotes, this may cause ETEs compiling process to fail, as the following error-message shows:
```
        Error: illegal character
        ...itude+\',\\'\'+jQuery.base64Encode(jQuery.toJSON(data.spot.result[0].geocache))+\'\\');" title="Modify this article..." value="Modify this article" />';
```