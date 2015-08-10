ETE is a small and flexible XML/XHTML template engine with efficient caching and debugging facilities.
ETE supports inlined templates as well as loading entire template libraries from DOM or external sources (e.g. XML files).

ETE is completely customizable by overwriting its standard behaviour with custom handlers. As a consequence, ETE offers full flexibility and control over each step of processing templates.

ETE translates XML/XHTML comments containing Java Script code  (<% ... %> resp. code embedded in attributes with #% ... %#) into a executabe, reusable Java Script function.

ETE shows its power and full potential in conjunction with jQuery. For example, ETE can be used to load and process a single or dozens of templates with a few lines of code. These templates will be cached for later use and can be reused as often as needed.
It may also support you in achieving a clean software architecture, by separating view and view-related code from logic and data.

**Demo:** http://jsfiddle.net/kse7hpk3/2/