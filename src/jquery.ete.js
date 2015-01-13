/**
  * ETE v2.0.0 jQuery Plugin
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
			namespace:      'ETE_',
			cache:          true,
			data:           null,
			callbefore:		null,
			hash: function(str){
				return(str.replace(/\s/g, '').replace(/#/g, '_ID_').replace(/>/g, '_CLD_').replace(/\./g, '_CLS_').replace(/\+/g, '_DEP_').replace(/~/g, '_SIB_').replace(/:/g, '_SEL_').replace(/-/g, '_MIN_').replace(/\*/g, '_MUL_').toUpperCase()); 
			},
			load: function(templateSelector){
				return($(templateSelector).html());
			},
			parse: function(template){
				template = template.replace(/\n|\f|\r|\t|\v/g, '');
				var tokens = template.split(/(<%)|(%>)|(#%)|(%#)/g).filter(function(n){ return n !== undefined && !/^\s*$/.test(n); });
				var templBatch = [];
				for(var i = 0, codeBlock = false; i < tokens.length; i++){
					if(tokens[i].match(/(<%)|(#%)/g)){
						/*
						 * A js code block starts when a start marker (<%)|(#%) shows up.
						 * In this case - jump one step ahead in the tokens array (tokens[++i]) because the js code fragment is in the next cell...
						 */
						codeBlock = true;
						templBatch.push([ true, tokens[++i] ]);
					}else if(codeBlock && tokens[i].match(/(%>)|(%#)/g)){
						/*
						 * The code block ends when template an end marker (%>)|(%#) shows up...
						 */
						codeBlock = false;
					}else{
						/*
						 * Template fragment is markup...
						 */
                        templBatch.push([ false, tokens[i].replace(/'/g, "\\'") ]);
					}
				}
				
				return(templBatch);
			},
			compile: function(funcName,templBatch){
				var funcBody = "var template = ''; ";
				
				for(i = 0; i < templBatch.length; i++){
					if(templBatch[i][0]){
						if(templBatch[i][1].match(/^=/g)){
							funcBody += 'template +' + templBatch[i][1].replace(/"/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'") + '\n';
						}else if(templBatch[i][1].match(/^#/g)){
							funcBody += 'template += "<!-- ' + templBatch[i][1].substr(1) + ' -->"\n';
						}else{
							funcBody += templBatch[i][1].replace(/"/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'") + '\n';
						}
					}else{
						funcBody += "template += '" + templBatch[i][1] + "';\n";
					}
				}

				funcBody += 'return(template);';

				return(funcBody);
			},
			callback: function(templateSelector, compiledTemplate){
				$(templateSelector).replaceWith(compiledTemplate);
			},
			debug: null
		};

		var options = jQuery.extend(defaults, options);

		var templateId = options.hash(this.selector);

		if(options.debug){
			if(templateId != ''){
				options.debug({majorSequenceNo: 1, minorSequenceNo: 1, message: 'Internal template ID is:', data: defaults.namespace + templateId});

				if(options.callbefore){
					options.debug({majorSequenceNo: 2, minorSequenceNo: 1, message: 'Execute callbefore', data: options.callbefore});

					options.callbefore(this.selector, options);

					options.debug({majorSequenceNo: 2, minorSequenceNo: 2, message: 'Callbefore executed', data: null});
				}else{
					options.debug({majorSequenceNo: 2, minorSequenceNo: 1, message: 'Callbefore is null', data: null});
				}

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
			}else{
				options.debug({majorSequenceNo: 1, minorSequenceNo: 1, message: 'Template ID is empty', data: null});
			}
		}else{
			if(templateId != ''){
				if(options.callbefore){ options.callbefore(this.selector, options); }

				if(options.cache){
					if($.fn.ete[defaults.namespace + templateId]){ //Templete cached...
						var xmlString = $.fn.ete[defaults.namespace + templateId](options.data);
						return(options.callback(this.selector, xmlString));
					}else{ //Compile template and cache...
						var loadedTempl = options.load(this.selector);
						var parsedTempl = options.parse(loadedTempl);
						var compiledTempl = options.compile(templateId, parsedTempl);
						$.fn.ete[defaults.namespace + templateId] = new Function('data', compiledTempl);
						var xmlString = $.fn.ete[defaults.namespace + templateId](options.data);
						return(options.callback(this.selector, xmlString));
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