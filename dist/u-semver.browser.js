"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _slicedToArray=function(){function r(r,t){var e=[],n=!0,i=!1,o=void 0;try{for(var a,u=r[Symbol.iterator]();!(n=(a=u.next()).done)&&(e.push(a.value),!t||e.length!==t);n=!0);}catch(f){i=!0,o=f}finally{try{!n&&u["return"]&&u["return"]()}finally{if(i)throw o}}return e}return function(t,e){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return r(t,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),find=function(r,t){return r.filter(t)[0]},findLatest=function(r){return r.sort().reverse()[0]},findPattern=function(r,t){var e=new RegExp(t);return findLatest(r.filter(e.test.bind(e)))},resolve=function(r,t,e){if("latest"===r)return findLatest(t);var n=/^([\^\~])?(\d+)\.(\d+)\.(\d+)(-(\w+))?$/,i=n.exec(r),o=_slicedToArray(i,4),a=o[0],u=o[1],f=o[2],d=o[3];if(!u)return find(t,function(r){return r===a});var s="^"===u?"^("+f+")\\.(\\d+)\\.(\\d+)":"^("+f+").("+d+")\\.(\\d+)";return e?findPattern(t,s+"(-(\\w+))?$"):findPattern(t,s+"$")};exports.resolve=resolve;