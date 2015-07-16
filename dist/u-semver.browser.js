"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _slicedToArray=function(){function r(r,e){var t=[],n=!0,i=!1,o=void 0;try{for(var a,u=r[Symbol.iterator]();!(n=(a=u.next()).done)&&(t.push(a.value),!e||t.length!==e);n=!0);}catch(f){i=!0,o=f}finally{try{!n&&u["return"]&&u["return"]()}finally{if(i)throw o}}return t}return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return r(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();if(!exports)var _exports2={};var find=function(r,e){return r.filter(e)[0]},findLatest=function(r){return r.sort().reverse()[0]},findPattern=function(r,e){var t=new RegExp(e);return findLatest(r.filter(t.test.bind(t)))},resolve=function(r,e,t){if("latest"===r)return findLatest(e);var n=/^([\^\~])?(\d+)\.(\d+)\.(\d+)(-(\w+))?$/,i=n.exec(r),o=_slicedToArray(i,4),a=o[0],u=o[1],f=o[2],d=o[3];if(!u)return find(e,function(r){return r===a});var s="^"===u?"^("+f+")\\.(\\d+)\\.(\\d+)":"^("+f+").("+d+")\\.(\\d+)";return t?findPattern(e,s+"(-(\\w+))?$"):findPattern(e,s+"$")},SemVer={resolve:resolve};exports["default"]=SemVer,module.exports=exports["default"];