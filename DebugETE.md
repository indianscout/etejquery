## General ##

I recommend using Mozilla Firefox due its great developper tools and the Firebug plugin.

## The ETE debugging facility ##

Internally the ETE template engine has a fixed sequence of steps to process templates. After each step, the debug handler will be called (only in debug mode). The debug function always receives an object of the following structure: {majorSequenceNo: 1, minorSequenceNo: 1, message: 'Internal template ID is:', data: templateId}

The majorSequenceNo and minorSequenceNo indicates the internal state:

|majorSequenceNo:|minorSequenceNo:|message:|data:|
|:---------------|:---------------|:-------|:----|
|1               |1               |Internal template ID is:|templateid|
|2               |1               |Execute callbefore:|options.callbefore|
|2               |2               |Callbefore executed|null |
|3               |1               |Start loading|null |
|3               |2               |Loading finished, result:|loadedtempl|
|4               |1               |Start parsing|null |
|4               |2               |Parsing finished, result:|parsedtempl|
|5               |1               |Start compiling|null |
|5               |2               |Compiling finished, result:|compiledtempl|
|6               |1               |Create function and cache|null |
|6               |2               |Function created and cached, result:|window[options.namespace + templateid]|
|7               |1               |Execute cached function:|window[options.namespace + templateid]|
|7               |2               |Function executed, function returned:|xmlstring|
|8               |1               |Execute callback handler:|options.callback|

Use the a debug handler to get more information about template processing internals:
```
        debug: function(log){
            if(log.majorSequenceNo == 8 && (log.minorSequenceNo == 1 || log.minorSequenceNo == 2)){
                var msg = log.message + '\n';
                if(log.data)
                    msg += log.data;
                alert(msg);
            }
        }
```