
Extensible Template Engine (ETE)
-----------------------------------------------------------------------------------------------------------------------------------------------
ETE is a small and simple JavaScript template engine with caching and debugging facilities. 
ETE is completely customizable by overwriting its standard behaviour with custom handlers.
As a consequence, ETE offers full flexibility and control over each step of processing templates.

There are two ETE libraries available:
	a) as a jQuery plugin (recommended) and 
	b) a standalone library.
Both implementations offer the same functionality.

ETE shows its power and full potential in conjunction with jQuery. For example, ETE can be used to load and process a single or dozens of templates with a few lines of code. These templates will be cached for later use and can be reused as often as needed.
It may also support you in achieving a clean software architecture, by separating view and view-related code from logic and data.

License
-----------------------------------------------------------------------------------------------------------------------------------------------
Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.opensource.org/licenses/gpl-3.0.html).

The ETE templating process
------------------------------------------------------
The following diagram roughly explains the ETE templating process:
[Init] -> [Hash] -> [Callbefore] -> Cached? -> [Load] -> [Parse] -> [Compile] -> [Callback(ExecuteTemplateFunction)]
									   |YES
						[Callback(ExecuteTemplateFunction)]
						
For further details see section "ETE template engine parameters and handlers".


Configuring the ETE template engine
------------------------------------------------------
	ETE template engine internal variables
	------------------------------------------------------
	The "template" variable is reserved for internal use and is basically a string containing the compiled template (which will be converted into a JavaScript function later on). 
		Assign content of other variables as described below:
			<img class="processing" src="#!-- template += data.pathPrefix; --#/template/processing.gif" alt="Processing" />
		Note:  do not decalre/initialize a second variable named "template", this may overwrite the internal template and cause errors!

	The "data" variable: encapsulates all data you pass into ETE. 
			$('script#tplNeighborSpotsTableBody').ete({
				...,
				data: {	spotList: spotList,
						selector: 'neighborSpots'
				}
			});
			
		If you have to pass only one value, just assign it as follows:
			$('script#tplNeighborSpots').ete({
				...,
				data: geocache
			}); 

	ETE template engine parameters and handlers
	------------------------------------------------------
		Parameter:	Default:		Description:
		------------------------------------------------------
		namespace: 	'ETE'			Prefix, used for caching template in the document.window object, to avoid collisions with other objects.

		cache: 		true			Enable or disable caching. Note: cache will be cleared after each page relaod.

		(selector:)	(null)			(An ID or the template name, necessary and avaialble only in standalone ETE library. In the jQuery version, the ID/Class etc. or name is passed as jQuery parameter: $('#ID').ete({...}), $('.class').ete({...}), $('tagName').ete({...}) or $('templateName').ete({...}))
		
		data: 		null			The data you want to pass into ETE template engine. If data is null, ETE will compile and cache the template but not execute the template function.
		
		debug: 		null			If a debug handler is specefied (is not null) the custom debug handler will be executed before and after each sequence/step (see examples for further details). The debug function always receives a log object of the following structure: { majorSequenceNo: 1, minorSequenceNo: 1, message: 'Internal template ID is:', data: templateId }
									Handler-interface: 	function(logObject){ ... }
									Returns by default: nothing
									
		hash:		See source...	Creates a hash from the specified selector or template name.
									Handler-interface: 	function(str){ ... }
									Returns by default: hashed template name.

		callbefore: null			Will be called before the template is loaded and compiled.
									Handler-interface: 	function(templateSelector, options){ ... }
									Returns by default: nothing

		load: 		See source...	Handles the load operation (only if caching is enabled and template is not already cached). Will be executed after callbefore handler.
									Handler-interface: 	function(templateSelector){ ... }
									Returns by default: a string containing the template.
									
		parse: 		See source...	Parses the template, will be executed after loading the template. 
									Handler-interface: 	function(template){ ... }
									Returns by default:	a two dimensional array. Each row contains a boolean flag (isJs) which indicates whether the row (code) contains a JavaScript- or XML-fragment.
														Example: { isJs: false, code: codeToken }
		compile: 	See source...	Translates the template into an JavaScript function. 
									Handler-interface: 	function(functionName,templBatch){ ... }
									Returns by default:	a string which will be converted into JavaScript function (with new Function()).

		callback: 	See source...	Assumes by default an inlined template, replaces the inlined template with the compiled template.
									Handler-interface: 	function(templateSelector, compiledTemplate){ ... }
									Returns by default:	nothing
	
		Overwrite default functions and behaviour
		------------------------------------------------------
		ETEs default behaviour is defined by the following functions: hash, callbefore, load, parse, compile, debug and callback.
		If this default behavoir does not meet your expectations, just overwrite the function with your custom handler. This is, for example, necessary	when ETE has to load the template content from an external template library (loaded by AJAX). See: "Example 4. Loding a template library".
		
		Overwriting the default behavour is also necessary if you have to debug your template. By default, there is no debug-handler registred. If you want to use
		your custom debug handler, just decalre it while initializing ETE:
		
		var neighbors = $('script#tplNeighborSpots').ete({
			callback: 	function(sel, template){ return(template); }, //Overwrite default callback handler, the default handler would replace the "source" template with the compiled template, instead of returning the compiled template as a string...
			debug: 		function(log){	//Define a custom debug handler...
				if(log.majorSequenceNo == 8 && (log.minorSequenceNo == 1 || log.minorSequenceNo == 2)){
					var msg = log.message + '\n';
					if(log.data)
						msg += log.data;
					alert(msg);
				}
			},
			data: {	geocache: geocache }
		}); 

	Embedding ETE within XML/XHTML tags
	------------------------------------------------------
	Use XML comments (<!-- and -->) to embed ETE code within XML/XHTML tags. Always use well-formed and standard XML/XHTML:
	<script type="text/xml" id="tplAddress">
		<h2>Address</h2>
		<!-- if(data != null && data.Status.code == G_GEO_SUCCESS){ -->
			<!-- for(var j = 0; j < data.Placemark[0].address.split(',').length; j++){ -->
				<!-- if(j <= 1){ -->
					<div><b><!-- template += data.Placemark[0].address.split(',')[j]; --></b></div>
				<!-- }else{ -->
					<b><!-- template += data.Placemark[0].address.split(',')[j]; --></b> 
				<!-- } -->
			<!--} -->
		<!-- }else{ -->
			<b>Unable to find address</b>
		<!--} -->
		<h2>Geo. Coordinate</h2>
		<p><b>Latitude:</b> <!-- template += getWGS84Latitude(data); --> </p>
		<p><b>Longitude:</b> <!-- template += getWGS84Longitude(data); --> </p>
	</script>
	
	Embedding ETE within XML/XHTML attributes
	------------------------------------------------------
	Use the following marker to embed ETE in XML attributes: #!-- and --#. Do not use < and > characters within attributes. Use Entities instead: &lt; and %gt;. Always use well-formed and standard XML/XHTML:
	<div onclick="alert('#!-- if(data['caption'].length &gt; 0){ template+= data['caption']; }else{ template+= 'Empty caption!'; } --#');">

Examples
-----------------------------------------------------------------------------------------------------------------------------------------------
If you are using jQuery.ete.js, see eteTest.html and eteTemplateLibraryTest.html for further examples.
If you are using ete.js, see eteStandaloneTest.html and eteStandaloneTemplateLibraryTest.html for further examples.

	1. Example: Initialize tabbed GOOGLE infowindow
	-------------------------------------------------------------
	Load templates and return XHTML string instead of injecting into DOM:	

	JavaScript code:
	var neighbors = $('script#tplNeighborSpots').ete({
		callback: function(sel, template){ return(template); },
		data: {	geocache: geocache }
	}); 
		
	var address = $('script#tplAddress').ete({
		callback: function(sel, template){ return(template); }, 
		data: {	geocache: geocache }
	});
		
	return(new Array(	new GInfoWindowTab('Nearby',  neighbors),
						new GInfoWindowTab('Details', address)));

						
	Template code:
	<script type="text/xml" id="tplNeighborSpots">
		<div>
			<div>Spots near <!-- template += getAddressFromGeocache(data.geocache,false); --></div>
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
			<!-- if(data != null && data.Status.code == G_GEO_SUCCESS){ -->
				<!-- for(var j = 0; j < data.Placemark[0].address.split(',').length; j++){ -->
					<!-- if(j < 1){ -->
						<span style="display:block"><b><!-- template += data.Placemark[0].address.split(',')[j]; --></b></span>
					<!-- }else{ -->
						<b><!-- template += data.Placemark[0].address.split(',')[j]; --></b> 
					<!-- } -->
				<!-- } -->
			<!-- }else{ -->
				<b>Unable to find address</b>
			<!--} -->
			<div>Geo. Coordinate</div>
			<p><b>Latitude:</b> <!-- template += getWGS84Latitude(data); --> </p>
			<p><b>Longitude:</b> <!-- template += getWGS84Longitude(data); --> </p>
		<div>
	</script>

	2. Example: Inlined templates
	-------------------------------------------------------------
	Expand inlined templates (replace template source with compiled XHTML):
	
	JavaScript code:
	$('#fourthTarget').ete({
		data: {	caption: '3. Space-Taxi Timetable (3.1.1982):',
				table: new Array(	new Array('Space-Taxi' 			,'Neptun'	,'Uranus'	,'Saturn'	,'Jupiter'	,'Earth'),
									new Array('Alan' 				,6			,''			,''			,''			,22		),
									new Array('Ida' 				,12 		,15			,'17:30'	,18			,20		),
									new Array('Enterprise' 			,8			,'9:30'	,	,'10:30'	,11			,12		),
									new Array('Clingonian spaceship' ,16 		,'17:30',	,''			,19			,null	))
		}
	});
	
	Template code:
	<html>
	<body>
	...
		<div id="fourthTarget" style="display:none">
			<div>
				<h2> <!-- template += data['caption']; --> </h2>
				<div>
					<table>
						<thead>
							<tr>
							<!-- for(var i = 0; i < data['th'].length; ++i){ -->
								<th><b><!--template += data['th'] [i]--></b></th>
							<!-- } -->
							</tr>
						</thead>
						<tbody>
						<!-- for(var i = 0; i < data['table'].length; ++i){ -->
							<!-- if((i+1) % 5 == 0){-->
							<tr style="color: red;">
								<td> <!-- template += (i+1) ; --> </td>
								<!-- for(var j = 0; j < data['table'][i].length; ++j){ -->
								<td>
									<!-- if(data['table'][i][j] == ''){ -->
										<b>Empty...</b>
									<!-- }else{  -->
										<!-- if(data['table'][i][j] != null){
											template += '<b>'+data['table'][i][j]+'</b>';
										}else{  -->
											<b>-</b>
										<!-- } -->
									<!-- } -->
								</td>
								<!-- } -->
							</tr>
							<!--}else{  -->
							<tr  style="color: green;">
								<td> <!-- template += (i+1) ; --> </td>
								<!-- for(var j = 0; j < data['table'][i].length; ++j){ -->
								<td>
									<!-- if(data['table'][i][j] == ''){ -->
										<b>Empty...</b>
									<!-- }else{  -->
										<!-- if(data['table'][i][j] != null){
											template += '<b>'+data['table'][i][j]+'</b>';
										}else{  -->
											<b>-</b>
										<!-- } -->
									<!-- } -->
								</td>
								<!-- } -->
							</tr>
							<!-- } -->
						<!-- } -->
						</tbody>
					</table>
				</div>
			</div>
		</div>
	...
	</html>
	</body>

	3. Example: inject template into DOM
	-------------------------------------------------------------
	Use the following code snippet if you want to append XML/XHTML data within an existing container:
	
	JavaScript code:
	$('script#tplNeighborSpotsTableBody').ete({
		callbefore: function(sel, template){
			$(selector+' table > tbody > *').remove(); //Cleanup legacy data first..
		},
		callback: function(sel, template){
			$(selector+' table > tbody').append(template); //There is already a table with tbody where the XML code will be injected...
		},
		data: {	spotList: spotList, selector: 'spotNeighborSpots' }
	});

	Template code:
	<script type="text/xml" id="tplNeighborSpotsTableBody">
		<!-- if(data.spotList.result){ -->
			<!-- if(data.spotList.code == SUCCESS || data.spotList.result.length != 0){ -->
				<!-- for(var i = 0; i < data.spotList.result.length; ++i){ -->
					<tr>
						<td><!-- template += (i+1) --></td>
						<!-- if(data.spotList.result[i].distance >= 1000){ -->
							<td><!-- template += round(data.spotList.result[i].distance/1000,0); --></td>
						<!-- }else{ -->
							<td><!-- template += round(data.spotList.result[i].distance,0)/1000; --></td>
						<!-- } -->
						<td><b><!-- template += round(data.spotList.result[i].rating,0); --></b></td>
						<td><!-- template += getAddressFromGeocache(data.spotList.result[i].geocache); --></td>
						<td>
							<input type="button" onclick="jump2spot('#!-- template += data.spotList.result[i].id;--#', map, false,$('##!--template += data.selector;--# #direction_2_#!--template += data.spotList.result[i].id;--#').val());" value="Jump"></input>
						</td>
						<td>
							<select id="direction_2_#!-- template += data.spotList.result[i].id;--#">
								<option value="none"></option>
								<option value="G_TRAVEL_MODE_DRIVING">Drive</option>
							</select>
						</td>
					</tr>
				<!-- } -->
			<!-- }else{ -->
				<tr><td colspan="6"><b>No neighbor spots found...</b></td></tr>
			<!-- } -->
		<!-- }else{ -->
			<tr><td colspan="6"><b>No neighbor spots found...</b></td></tr>
		<!-- } -->
	</script>
	
	3. Loading data via AJAX
	------------------------------------------------------------------------------------------------------------
	Load data via AJAX call and expand template. ETE will inject/replace the original template with the expanded XML/XHTML code.
	
	JavaScript code:
	jQuery.ajax({
		url: 'json.php',
		dataType: 'json',
		success: function(ajaxData){
			$('#fourthTarget').ete({
				data: ajaxData
			});
		},
		error: function(error){ alert('Error occured: '+error); } 
	});
	
	Template Code:
	<div id="fourthTarget" style="display:none">
		<div onclick="alert('ET calling home...');">
			<h2> <!-- template += data['caption']; --> </h2>
			<div>
				<table>
					<thead>
						<tr>
						<!-- for(var i = 0; i < data['th'].length; ++i){ -->
							<th><b><!--template += data['th'] [i]--></b></th>
						<!-- } -->
						</tr>
					</thead>
					<tbody>
					<!-- for(var i = 0; i < data['table'].length; ++i){ -->
						<!-- if((i+1) % 5 == 0){-->
						<tr style="color: red;">
							<td> <!-- template += (i+1) ; --> </td>
							<!-- for(var j = 0; j < data['table'][i].length; ++j){ -->
							<td>
								<!-- if(data['table'][i][j] == ''){ -->
									<b>Empty...</b>
								<!-- }else{  -->
									<!-- if(data['table'][i][j] != null){
										template += "<b>"+data["table"][i][j]+"</b>";
									}else{  -->
										<b>-</b>
									<!-- } -->
								<!-- } -->
							</td>
							<!-- } -->
						</tr>
						<!--}else{  -->
						<tr  style="color: green;">
							<td> <!-- template += (i+1) ; --> </td>
							<!-- for(var j = 0; j < data['table'][i].length; ++j){ -->
							<td>
								<!-- if(data['table'][i][j] == ''){ -->
									<b>Empty...</b>
								<!-- }else{  -->
									<!-- if(data['table'][i][j] != null){
										template += '<b>'+data['table'][i][j]+'</b>';
									}else{  -->
										<b>-</b>
									<!-- } -->
								<!-- } -->
							</td>
							<!-- } -->
						</tr>
						<!-- } -->
					<!-- } -->
					</tbody>
				</table>
			</div>
		</div>
	</div>
	
	4. Loading a template library
	------------------------------------------------------------------------------------------------------------
	ETE is capable of loading a template library containing a single or dozens of templates.  The data to feed ETE may also be loaded via AJAX...
	
	JavaScript code:
	jQuery.ajax({
		url: 'template.xml',
		dataType: 'html',
		success: function(xmlData){
			$(xmlData).find('eteTemplate').each(function(){
				var templ = $(this).html();
				$($(this).attr('id')).ete({ //Note: we pass in the ID of the template as template name and not an ordinary selector! In order to access the compiled template, you have to know this name... You may also use another mechanism to label your template but keep in mind, the name must be unique. Otherwise ETE will ignore (will not cache) further templates with the same name!
					load: function(templateSelector){
						return(templ);
					}
				});
			});
			
			//ETE call,  trigger ajax request and inject compiled template into DOM...
			jQuery.ajax({
				url: 'json.php',
				dataType: 'json',
				success: function(ajaxData){
					$('fourthTemplate').ete({
						callback: function(sel, template){ $('#fourthTarget').replaceWith(template); },
						data: ajaxData
					});
				},
				error: function(error){ alert('Error occured: '+error); } 
			});
		},
		error: function(error){ alert('Error occured: '+error); } 
	});
	
	Template library:
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
				<h2> <!-- template += data['caption']; --> </h2>
				<div>
					<table class="tablesorter">
						<thead>
							<tr>
							<!-- for(var i = 0; i < data['th'].length; ++i){ -->
								<th><b><!--template += data['th'] [i]--></b></th>
							<!-- } -->
							</tr>
						</thead>
						<tbody>
						<!-- for(var i = 0; i < data['table'].length; ++i){ -->
							<!-- if((i+1) % 5 == 0){-->
							<tr style="color: red;">
								<td> <!-- template += (i+1) ; --> </td>
								<!-- for(var j = 0; j < data['table'][i].length; ++j){ -->
								<td>
									<!-- if(data['table'][i][j] == ''){ -->
										<b>Empty...</b>
									<!-- }else{  -->
										<!-- if(data['table'][i][j] != null){
											template += "<b>"+data["table"][i][j]+"</b>";
										}else{  -->
											<b>-</b>
										<!-- } -->
									<!-- } -->
								</td>
								<!-- } -->
							</tr>
							<!-- }else{  -->
							<tr style="color: green;">
								<td> <!-- template += (i+1) ; --> </td>
								<!-- for(var j = 0; j < data['table'][i].length; ++j){ -->
								<td>
									<!-- if(data['table'][i][j] == ''){ -->
										<b>Empty...</b>
									<!-- }else{  -->
										<!-- if(data['table'][i][j] != null){
											template += '<b>'+data['table'][i][j]+'</b>';
										}else{  -->
											<b>-</b>
										<!-- } -->
									<!-- } -->
								</td>
								<!-- } -->
							</tr>
							<!-- } -->
						<!-- } -->
						</tbody>
					</table>
				</div>
			</div>
		</eteTemplate>
	</templates>
	
	Template code:
	...
	<body>
		<p id="firstTarget"></p>
		
		<p id="secondTarget"></p>
		
		<p id="thirdTarget"></p>
		
		<div id="fourthTarget" style="display:none"></div>
	</body>
	...
	
Debugging ETE templates
------------------------------------------------------------------------------------------------------------
	General
	-------
	I recommend using Mozilla Firefox due its great developper tools and the Firebug plugin.

	The ETE debugging facility
	---------------------------
	Internally the ETE template engine has a fixed sequence of steps to process templates. After each step, the debug handler will be called (only in debug mode). The debug function always receives an object of the following structure:
		{majorSequenceNo: 1, minorSequenceNo: 1, message: 'Internal template ID is:', data: templateId}
	The majorSequenceNo and minorSequenceNo indicates the internal state:
	majorSequenceNo:	minorSequenceNo:	message: 				data:
	1			1			Internal template ID is:				templateId
	2			1			Execute callbefore:						options.callbefore
	2			2			Callbefore executed						null
	3			1			Start loading							null
	3			2			Loading finished, result:				loadedTempl
	4			1			Start parsing							null
	4			2			Parsing finished, result:				parsedTempl
	5			1			Start compiling							null
	5			2			Compiling finished, result:				compiledTempl
	6			1			Create function and cache				null
	6			2			Function created and cached, result:	window[options.namespace + templateId]
	7			1			Execute cached function:				window[options.namespace + templateId]
	7			2			Function executed, function returned:	xmlString
	8			1			Execute callback handler:				options.callback

	Use the a debug handler to get more information about template processing internals:
		debug: function(log){
			if(log.majorSequenceNo == 8 && (log.minorSequenceNo == 1 || log.minorSequenceNo == 2)){
				var msg = log.message + '\n';
				if(log.data)
					msg += log.data;
				alert(msg);
			}
		}
		
Pittfalls
------------------------------------------------------------------------------------------------------------
	Always use well-formed and standard XML/XHTML
	-------------------------------------------------
	Not well-formed templates cause XML-parsers to fail (e.g. when loading XML-templates via AJAX, injecting template data into DOM, etc.)!
	There is only one adequate solution: use well-formed and standard XML/XHTML!
	
	
	Use always <!--if(...){-->...<!-- }else{ -->...<!-- } -->
	---------------------------------------------------------
	ETE loads and compiles the following template without errors, but the internal translation into a JavaScript function fails:
	<!-- if(data.geocache.Placemark) -->
		<input type="radio" name="spot_id" value="0" checked="checked" /> <b><!-- template += address; -->, Latitude: <!-- template += round(data.lat,4); --> / Longitude: <!-- template += round(data.lng,4); --><\/b>
	<!-- else -->
		<input type="radio" name="spot_id" value="0" checked="checked" /> <b>Unknown Address, Latitude: <!-- template += round(data.lat,4); --> / Longitude: <!-- template += round(data.lng,4); --><\/b>
	
	Reason:
		Template code will be translated to:
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
		As you can see, the if() and else section contain more than one instruction and the brackets ({}) are missing. 
		If this code is passed to new Function() (internally), the JavaScript parser will fail!
	
	Use the following template code instead:
		<!-- if(data.geocache.Placemark){ -->
			<input type="radio" name="spot_id" value="0" checked="checked" /> <b><!-- template += address; -->, Latitude: <!-- template += round(data.lat,4); --> / Longitude: <!-- template += round(data.lng,4); --><\/b>
		<!-- }else{ -->
			<input type="radio" name="spot_id" value="0" checked="checked" /> <b>Unknown Address, Latitude: <!-- template += round(data.lat,4); --> / Longitude: <!-- template += round(data.lng,4); --><\/b>
		<!-- } -->
	
	Use different variable name for loop counters
	-------------------------------------------------
	Loop counters are internal variables, use different variable names to avoid mutual interference:
	<!-- for(var i = 0; i < data.latestVisits.result.length; i++){ -->
		<!-- for(var j = 0; j < data.latestVisits.result.length; j++){ -->
			<!-- if(data.latestVisits.result[j]['image_path']){ -->
				<a href="#!-- template += '.'+IMAGE_PATH+data.latestVisits.result[j]['image_path']; --#" title="#!-- template += removeHTMLTags(data.latestVisits.result[j]['comment']); --# (&copy; #!-- template += data.latestVisits.result[j]['user']; --#)" style="display:none">
					<img style="display:none" src="#!-- template += '.'+IMAGE_PATH+data.latestVisits.result[j]['image_path']; --#" alt="#!-- template += removeHTMLTags(data.latestVisits.result[j]['comment']); --# (&copy; #!-- template += data.latestVisits.result[j]['user']; --#)" /> 
				</a>
			<!-- } -->
		<!-- } -->
	<!-- } -->
	
	Quotation problems
	--------------------------------------------------
	Be careful with quoting and escaping quotes, this may cause ETEs compiling process to fail, as the following error-message shows:
		Error: illegal character
		...itude+\',\\'\'+jQuery.base64Encode(jQuery.toJSON(data.spot.result[0].geocache))+\'\\');" title="Modify this article..." value="Modify this article" />';