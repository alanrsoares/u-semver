"use strict";function semVerToNum(e){var r=toValidIntMatches(e),t=function(e,r,t){return e+r*MULTIPLIERS[t]};return r.reduce(t,0)}function sortSemVer(e,r){var t=[e,r].map(semVerToNum),n=_slicedToArray(t,2),i=n[0],u=n[1];if(arePreReleases([e,r])){var a=[e,r].map(getBaseSemVer),o=_slicedToArray(a,2),f=o[0],s=o[1];if(and(f===s,contains(e,"beta"),contains(r,"alpha")))return 1}return i-u}function findLatest(e){var r=sort(e),t=last(r);return allowsPreRelease(t)?find(e,function(e){return e===t.split("-")[0]})||t:t}function findPattern(e,r,t){var n=new RegExp(r);return findLatest(e.filter(function(e){return n.test(e)}).filter(filterVersion(t)))}function resolve(e,r,t){if("latest"===e)return findLatest(r);var n=SEMVER_RX.exec(e),i=_slicedToArray(n,7),u=i[0],a=i[1],o=i[2],f=i[3],s=i[4],c=i[5],l=i[6];if(!a)return find(r,function(e){return e===u});var d="^"===a?"^("+o+")\\.(\\d+)\\.(\\d+)":"^("+o+")\\.("+f+")\\.(\\d+)",R=[o,f,s,c,l];return t?findPattern(r,d+"(-(\\w+)(\\.(\\d+))?)?$",R):findPattern(r,d+"$",R)}Object.defineProperty({},"__esModule",{value:!0});var _slicedToArray=function(){function e(e,r){var t=[],n=!0,i=!1,u=void 0;try{for(var a,o=e[Symbol.iterator]();!(n=(a=o.next()).done)&&(t.push(a.value),!r||t.length!==r);n=!0);}catch(e){i=!0,u=e}finally{try{!n&&o.return&&o.return()}finally{if(i)throw u}}return t}return function(r,t){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r))return e(r,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),SEMVER_RX=/^([\^\~])?(\d+)\.(\d+)\.(\d+)(-(\w+)(\.(\d+))?)?$/,BASE_SEMVER_RX=/^(\d+).(\d+).(\d+)/,MULTIPLIERS=[1e6,1e3,10,0,1],find=function(e,r){return e.filter(r)[0]},last=function(e){return e[e.length-1]},contains=function(e,r){return e.indexOf(r)>-1},and=function(e,r){return r.reduce(function(r,t){return r&&e(t)},!0)},toValidIntMatches=function(e){return e.match(SEMVER_RX).slice(1).map(function(e){return+e}).filter(function(e){return!isNaN(e)})},filterVersion=function(e){return function(r){return toValidIntMatches(r).reduce(function(r,t,n){return r&&(void 0!==e[n]?t>=e[n]:!0)},!0)}},isPreRelease=function(e){return/(alpha|beta)/.test(e)},arePreReleases=function(e){return and(isPreRelease,e)},allowsPreRelease=function(e){return e&&e.indexOf("-")>=0},getBaseSemVer=function(e){return e.match(BASE_SEMVER_RX)[0]},sort=function(e){return e.sort(sortSemVer)},SemVer={resolve:resolve,sort:sort};