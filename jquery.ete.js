/**
  * ETE v1.0.1 jQuery Plugin
  * Extensible Template Engine (ETE) is a simple but powerful javascript XML/XHTML template engine.
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
(function(a){a.fn.ete=function(c){var j={namespace:"ETE_",cache:true,data:null,callbefore:null,hash:function(k){return(k.replace(/\s/g,"").replace(/#/g,"_ID_").replace(/>/g,"_CLD_").replace(/\./g,"_CLS_").replace(/\+/g,"_DEP_").replace(/~/g,"_SIB_").replace(/:/g,"_SEL_").replace(/-/g,"_MIN_").replace(/\*/g,"_MUL_").toUpperCase())},load:function(k){return(a(k).html())},parse:function(k){k=k.replace(/\n|\f|\r|\t|\v/g,"");var m=k.split(/<!-|-->|#!-|--#/g);var l=[];for(i=0;i<m.length;i++){if(m[i].match(/^-.*/gi)){l.push({isJs:true,code:m[i].substring(1,m[i].length)})}else{if(jQuery.trim(m[i])!=""){l.push({isJs:false,code:m[i].replace(/'/g,"\\'")})}}}return(l)},compile:function(m,l){var k="var template = ''; ";for(i=0;i<l.length;i++){if(l[i]["isJs"]){k+=l[i]["code"].replace(/"/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'")+"\n"}else{k+="template += '"+l[i]["code"]+"';\n"}}k+="return(template);";return(k)},callback:function(l,k){a(l).replaceWith(k)},debug:null,};var c=jQuery.extend(j,c);var e=c.hash(this.selector);if(c.debug){if(e!=""){c.debug({majorSequenceNo:1,minorSequenceNo:1,message:"Internal template ID is:",data:c.namespace+e});if(c.callbefore!=null){c.debug({majorSequenceNo:2,minorSequenceNo:1,message:"Execute callbefore",data:c.callbefore});c.callbefore(this.selector,c);c.debug({majorSequenceNo:2,minorSequenceNo:2,message:"Callbefore executed",data:null})}else{c.debug({majorSequenceNo:2,minorSequenceNo:1,message:"Callbefore is null",data:null})}if(c.cache){if(window[c.namespace+e]!=null){c.debug({majorSequenceNo:7,minorSequenceNo:1,message:"Execute cached function:",data:window[c.namespace+e]});var h=window[c.namespace+e](c.data);c.debug({majorSequenceNo:7,minorSequenceNo:2,message:"Cached function executed, function returned:",data:h});c.debug({majorSequenceNo:8,minorSequenceNo:1,message:"Execute callback handler:",data:c.callback});return(c.callback(this.selector,h))}else{c.debug({majorSequenceNo:3,minorSequenceNo:1,message:"Start loading",data:null});var g=c.load(this.selector);c.debug({majorSequenceNo:3,minorSequenceNo:2,message:"Loading finished, result:",data:g});c.debug({majorSequenceNo:4,minorSequenceNo:1,message:"Start parsing",data:null});var b=c.parse(g);c.debug({majorSequenceNo:4,minorSequenceNo:2,message:"Parsing finished, result:",data:b});c.debug({majorSequenceNo:5,minorSequenceNo:1,message:"Start compiling",data:null});var d=c.compile(c.namespace+e,b);c.debug({majorSequenceNo:5,minorSequenceNo:2,message:"Compiling finished, result:",data:d});c.debug({majorSequenceNo:6,minorSequenceNo:1,message:"Create function and cache",data:null});window[c.namespace+e]=new Function("data",d);c.debug({majorSequenceNo:6,minorSequenceNo:2,message:"Function created and cached, result:",data:window[c.namespace+e]});if(c.data!=null){c.debug({majorSequenceNo:7,minorSequenceNo:1,message:"Execute cached function:",data:window[c.namespace+e]});var h=window[c.namespace+e](c.data);c.debug({majorSequenceNo:7,minorSequenceNo:2,message:"Cached function executed, function returned:",data:h});c.debug({majorSequenceNo:8,minorSequenceNo:1,message:"Execute callback handler:",data:c.callback});return(c.callback(this.selector,h))}else{return}}}else{c.debug({majorSequenceNo:3,minorSequenceNo:1,message:"Start loading",data:null});var g=c.load(this.selector);c.debug({majorSequenceNo:3,minorSequenceNo:2,message:"Loading finished, result:",data:g});c.debug({majorSequenceNo:4,minorSequenceNo:1,message:"Start parsing",data:null});var b=c.parse(g);c.debug({majorSequenceNo:4,minorSequenceNo:2,message:"Parsing finished, result:",data:b});c.debug({majorSequenceNo:5,minorSequenceNo:1,message:"Start compiling",data:null});var d=c.compile(c.namespace+e,b);c.debug({majorSequenceNo:5,minorSequenceNo:2,message:"Compiling finished, result:",data:d});c.debug({majorSequenceNo:6,minorSequenceNo:1,message:"Create function",data:null});var f=new Function("data",d);c.debug({majorSequenceNo:6,minorSequenceNo:2,message:"Function created, result:",data:f});c.debug({majorSequenceNo:7,minorSequenceNo:1,message:"Execute function:",data:f});var h=f(c.data);c.debug({majorSequenceNo:7,minorSequenceNo:2,message:"Function executed, function returned:",data:h});c.debug({majorSequenceNo:8,minorSequenceNo:1,message:"Execute callback handler:",data:c.callback});return(c.callback(this.selector,h))}}else{c.debug({majorSequenceNo:1,minorSequenceNo:1,message:"Template ID is empty",data:null})}}else{if(e!=""){if(c.callbefore!=null){c.callbefore(this.selector,c)}if(c.cache){if(window[c.namespace+e]!=null){var h=window[c.namespace+e](c.data);return(c.callback(this.selector,h))}else{var g=c.load(this.selector);var b=c.parse(g);var d=c.compile(c.namespace+e,b);window[c.namespace+e]=new Function("data",d);if(c.data!=null){var h=window[c.namespace+e](c.data);return(c.callback(this.selector,h))}else{return}}}else{var g=c.load(this.selector);var b=c.parse(g);var d=c.compile(c.namespace+e,b);var f=new Function("data",d);var h=f(c.data);return(c.callback(this.selector,h))}}}}})(jQuery);