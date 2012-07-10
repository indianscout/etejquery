/**
  * ETE v1.7.2 jQuery Plugin
  * Extensible Template Engine (ETE) is a simple but powerful JavaScript XML/XHTML template engine.
  * 
  * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
  * and GPL (http://www.opensource.org/licenses/gpl-3.0.html).
  *
  *  Dependencies:
  *   - jquery.js jQuery Core Plugin
  *
  *   Copyright (c) 2010 Koller Oliver (spotwizard.org)
  *   Permission is hereby granted, free of charge, to any person obtaining a copy
  *   of this software and associated documentation files (the "Software"), to deal
  *   in the Software without restriction, including without limitation the rights
  *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  *   copies of the Software, and to permit persons to whom the Software is
  *   furnished to do so, subject to the following conditions:
  *   
  *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  *   THE SOFTWARE.
  */

(function($){  
	$.fn.ete = function(options){
		var defaults = {
			namespace: 	'ETE_',
			cache: 		true,
			data : 		null,
			callbefore: null,
			hash:		function(str){
							return(str.replace(/\s/g, '').replace(/#/g, '_ID_').replace(/>/g, '_CLD_').replace(/\./g, '_CLS_').replace(/\+/g, '_DEP_').replace(/~/g, '_SIB_').replace(/:/g, '_SEL_').replace(/-/g, '_MIN_').replace(/\*/g, '_MUL_').toUpperCase()); 
						},
			load: 		function(templateSelector){
							return($(templateSelector).html());
						},
			parse: 		function(template){
							template = template.replace(/\n|\f|\r|\t|\v/g, '');
							var tokens = template.split(/<!-|-->|#!-|--#/g);
							var templateBatch = [];
							for(i = 0; i < tokens.length; i++){
								if(tokens[i].match(/^-.*/gi))
									templateBatch.push({ isJs: true, code: tokens[i].substring(1, tokens[i].length) });
								else{
									if(jQuery.trim(tokens[i]) != '')
										templateBatch.push({ isJs: false, code: tokens[i].replace(/'/g, "\\'") });
								}
							}
							
							return(templateBatch);
						},
			compile:	function(functionName,templBatch){
							var body = "var template = ''; ";
							for(i = 0; i < templBatch.length; i++){
								if(templBatch[i]['isJs'])
									body += templBatch[i]['code'].replace(/"/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")+'\n';
								else
									body += "template += '"+templBatch[i]['code']+"';\n";
							}
							body += "return(template);";
							return(body);
						},
			callback: 	function(templateSelector, compiledTemplate){
							$(templateSelector).replaceWith(compiledTemplate);
						},
			debug: 		null,
		};
		
		var options = jQuery.extend(defaults, options); 
		
		var templateId = options.hash(this.selector);
		
		if(options.debug){
			if(templateId != ''){
				options.debug({majorSequenceNo: 1, minorSequenceNo: 1, message: 'Internal template ID is:', data: defaults.namespace + templateId});
				
				if(options.callbefore != null){
					options.debug({majorSequenceNo: 2, minorSequenceNo: 1, message: 'Execute callbefore', data: options.callbefore});
					
					options.callbefore(this.selector, options);
					
					options.debug({majorSequenceNo: 2, minorSequenceNo: 2, message: 'Callbefore executed', data: null});
				}else
					options.debug({majorSequenceNo: 2, minorSequenceNo: 1, message: 'Callbefore is null', data: null});
				
				if(options.cache){					
					if($.fn.ete[defaults.namespace + templateId]){ //Templete cached...
						/*
						 * Execute  template function...
						 */
						options.debug({majorSequenceNo: 7, minorSequenceNo: 1, message: 'Execute cached function:', data: $.fn.ete[defaults.namespace + templateId]});
						
						var xmlString = $.fn.ete[defaults.namespace + templateId](options.data);
						
						options.debug({majorSequenceNo: 7, minorSequenceNo: 2, message: 'Cached function executed, function returned:', data: xmlString});
						
						
						/*
						 * Execute callback handler...
						 */
						options.debug({majorSequenceNo: 8, minorSequenceNo: 1, message: 'Execute callback handler:', data: options.callback});
					
						return(options.callback(this.selector, xmlString));
					}else{ //Compile template and cache...
						/*
						 * Load template...
						 */
						options.debug({majorSequenceNo: 3, minorSequenceNo: 1, message: 'Start loading', data: null});
						
						var loadedTempl = options.load(this.selector);
						
						options.debug({majorSequenceNo: 3, minorSequenceNo: 2, message: 'Loading finished, result:', data: loadedTempl});
						
						
						/*
						 * Parse template...
						 */
						options.debug({majorSequenceNo: 4, minorSequenceNo: 1, message: 'Start parsing', data: null});
						
						var parsedTempl = options.parse(loadedTempl);
						
						options.debug({majorSequenceNo: 4, minorSequenceNo: 2, message: 'Parsing finished, result:', data: parsedTempl});
						
						
						/*
						 * Compile template...
						 */
						options.debug({majorSequenceNo: 5, minorSequenceNo: 1, message: 'Start compiling', data: null});
						
						var compiledTempl = options.compile(templateId, parsedTempl);
						
						options.debug({majorSequenceNo: 5, minorSequenceNo: 2, message: 'Compiling finished, result:', data: compiledTempl});
						
						
						/*
						 * Create function...
						 */
						options.debug({majorSequenceNo: 6, minorSequenceNo: 1, message: 'Create function and cache', data: null});
						
						$.fn.ete[defaults.namespace + templateId] = new Function('data', compiledTempl);
						
						options.debug({majorSequenceNo: 6, minorSequenceNo: 2, message: 'Function created and cached, result:', data: $.fn.ete[defaults.namespace + templateId]});
						
						if(options.data != null){ //If data is null, cache only...
							/*
							 * Execute  template function...
							 */
							options.debug({majorSequenceNo: 7, minorSequenceNo: 1, message: 'Execute cached function:', data: $.fn.ete[defaults.namespace + templateId]});
							
							var xmlString = $.fn.ete[defaults.namespace + templateId](options.data);
							
							options.debug({majorSequenceNo: 7, minorSequenceNo: 2, message: 'Cached function executed, function returned:', data: xmlString});
							
							
							/*
							 * Execute callback handler...
							 */
							options.debug({majorSequenceNo: 8, minorSequenceNo: 1, message: 'Execute callback handler:', data: options.callback});
						
							return(options.callback(this.selector, xmlString));
						}else
							return;
					}
				}else{ //Do not cache template...
					/*
					 * Load template...
					 */
					options.debug({majorSequenceNo: 3, minorSequenceNo: 1, message: 'Start loading', data: null});
					
					var loadedTempl = options.load(this.selector);
					
					options.debug({majorSequenceNo: 3, minorSequenceNo: 2, message: 'Loading finished, result:', data: loadedTempl});
					
					
					/*
					 * Parse template...
					 */
					options.debug({majorSequenceNo: 4, minorSequenceNo: 1, message: 'Start parsing', data: null});
					
					var parsedTempl = options.parse(loadedTempl);
					
					options.debug({majorSequenceNo: 4, minorSequenceNo: 2, message: 'Parsing finished, result:', data: parsedTempl});
					
					
					/*
					 * Compile template...
					 */
					options.debug({majorSequenceNo: 5, minorSequenceNo: 1, message: 'Start compiling', data: null});
					
					var compiledTempl = options.compile(templateId, parsedTempl);
					
					options.debug({majorSequenceNo: 5, minorSequenceNo: 2, message: 'Compiling finished, result:', data: compiledTempl});
					
					
					/*
					 * Create function...
					 */
					options.debug({majorSequenceNo: 6, minorSequenceNo: 1, message: 'Create function', data: null});
					
					var func = new Function('data', compiledTempl);
					
					options.debug({majorSequenceNo: 6, minorSequenceNo: 2, message: 'Function created, result:', data: func});
					
					/*
					 * Execute  template function...
					 */
					options.debug({majorSequenceNo: 7, minorSequenceNo: 1, message: 'Execute function:', data: func});
					
					var xmlString = func(options.data);
					
					options.debug({majorSequenceNo: 7, minorSequenceNo: 2, message: 'Function executed, function returned:', data: xmlString});
					
					/*
					 * Execute callback handler...
					 */
					options.debug({majorSequenceNo: 8, minorSequenceNo: 1, message: 'Execute callback handler:', data: options.callback});
					
					return(options.callback(this.selector, xmlString));
				}
			}else
				options.debug({majorSequenceNo: 1, minorSequenceNo: 1, message: 'Template ID is empty', data: null});
		}else{
			if(templateId != ''){
				if(options.callbefore != null){ options.callbefore(this.selector, options); }
				
				if(options.cache){
					if($.fn.ete[defaults.namespace + templateId]){ //Templete cached...
						var xmlString = $.fn.ete[defaults.namespace + templateId](options.data);
						return(options.callback(this.selector, xmlString));
					}else{ //Compile template and cache...
						var loadedTempl = options.load(this.selector);
						var parsedTempl = options.parse(loadedTempl);
						var compiledTempl = options.compile(templateId, parsedTempl);
						$.fn.ete[defaults.namespace + templateId] = new Function('data', compiledTempl);
						if(options.data != null){ //If data is null, cache only...
							var xmlString = $.fn.ete[defaults.namespace + templateId](options.data);
							return(options.callback(this.selector, xmlString));
						}else
							return;
					}
				}else{ //Do not cache template...
					var loadedTempl = options.load(this.selector);
					var parsedTempl = options.parse(loadedTempl);
					var compiledTempl = options.compile(templateId, parsedTempl);
					var func = new Function('data', compiledTempl);
					var xmlString = func(options.data);
					return(options.callback(this.selector, xmlString));
				}
			}
		}
	};
})(jQuery);  