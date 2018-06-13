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
			data: {},
			callbefore: null,
			path: function(node){
				var path;
				while(node.length){
					var realNode = node[0], name = realNode.localName;
					if (!name) break;
					name = name.toLowerCase();

					var parent = node.parent();

					var sameTagSiblings = parent.children(name);
					if (sameTagSiblings.length > 1) { 
						allSiblings = parent.children();
						var index = allSiblings.index(realNode) + 1;
						if (index > 1) {
							name += ':nth-child(' + index + ')';
						}
					}

					path = name + (path ? '>' + path : '');
					node = parent;
				}
				
				var id = node.attr('id');
				var classes = node.attr('class');
				if(id && id !== ''){
					return(path + '#' + id);
				}else if(classes && classes !== ''){
					var cls = classes.split(' ');
					
					for(var c in cls){
						path += '.' + cls[c];
					}
					
					return(path);
				}else{
					return(path);
				}
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
						codeBlock = true;
						templBatch.push([ true, tokens[++i] ]);
					}else if(codeBlock && tokens[i].match(/(%>)|(%#)/g)){
						codeBlock = false;
					}else{
                        templBatch.push([ false, tokens[i].replace(/'/g, "\\'") ]);
					}
				}
				
				return(templBatch);
			},
			compile: function(funcName,templBatch){
				var funcBody = "var template = ''; ";
				
				for(var i = 0; i < templBatch.length; i++){
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

		options = jQuery.extend(defaults, options);

		var selector = options.path(this);
		if(selector){
			if(options.callbefore){ options.callbefore(options); }

			if($.fn.ete[selector]){
				var xmlString = $.fn.ete[selector](options.data);
				return(options.callback(xmlString));
			}else{
				var loadedTempl = this.html();
				var parsedTempl = options.parse(loadedTempl);
				var compiledTempl = options.compile(selector, parsedTempl);
				$.fn.ete[selector] = new Function('data', compiledTempl);
				var xmlString = $.fn.ete[selector](options.data);
				return(options.callback(xmlString));
			}
		}
	};
})(jQuery);