(()=>{"use strict";var e={8442:(e,r,t)=>{t.r(r),t.d(r,{default:()=>he});var n=t(4942),u=t(885),o=t(9526),l=t(7132),a=t(8576),i=t(4333),c=t(1133),s=t(5809);function f(){var e=function(){var e=o.useRef(new Map);return{set:function(r,t){return e.current.set(r,t)},has:function(r){return e.current.has(r)},get:function(r){return e.current.get(r)}}}();return function(r,t){if(!e.has(r)){e.set(r,(function e(){return e.current.apply(e,arguments)}))}return e.get(r).current=t,e.get(r)}}function d(e){var r=o.useRef(e);return r.current=e,r}function p(e){var r=Object.keys(e);for(var t of r)if(b(e[t])){if(p(e[t]))return!0}else if(e[t])return!0;return!1}function b(e){return null!==e&&("function"===typeof e||"object"===typeof e)}var h={},v="en";function m(e,r){var t,n=e||v;h[n]||console.warn("[react-native-use-form] "+e+" is not registered, key: "+r);var u=null==h||null==(t=h[n])?void 0:t[r];return u||console.warn("[react-native-use-form] "+e+" is registered, but "+r+" is missing"),u||r}function g(e,r){h[e]=r}var y=t(141),O=Object.prototype.hasOwnProperty;function j(e,r){return"number"===typeof r&&Array.isArray(e)||function(e,r){if(null==e)return!1;return Object.prototype.hasOwnProperty.call(e,r)}(e,r)}function w(e){if(x(e))return!1;if(!e)return!0;if(P(e)&&0===e.length)return!0;if(!C(e)){for(var r in e)if(O.call(e,r))return!1;return!0}return!1}function x(e){return"number"===typeof e}function C(e){return"string"===typeof e}function P(e){return Array.isArray(e)}function S(e){var r=parseInt(e);return r.toString()===e?r:e}function k(e,r,t){return null==e?r?t?[]:{}:e:P(e)?e.slice():function(e,r){for(var t in r)O.call(r,t)&&(e[t]=r[t]);return e}({},e)}function T(e,r,t,n){if(x(t)&&(t=[t]),w(t))return r;if(C(t))return T(e,r,t.split(".").map(S),n);var u=t[0];return e&&e!==r||(e=k(r,!0,x(u))),1===t.length?n(e,u):(null!=r&&(r=r[u]),e[u]=T(e[u],r,t.slice(1),n),e)}function L(e,r){if("number"===typeof r&&(r=[r]),!r||0===r.length)return e;if("string"===typeof r)return r.includes(".")?L(e,r.split(".")):e[r];var t=S(r[0]),n=function(e,r){if(j(e,r))return e[r]}(e,t);return void 0!==n?1===r.length?n:L(e[t],r.slice(1)):void 0}var E=function(e,r,t,n){return w(t)?n:T(e,r,t,(function(e,r){return e[r]=n,e}))}.bind(null,null);const R=function(e){var r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],t=function(){var e=o.useRef(!1);return o.useEffect((function(){return e.current=!0,function(){e.current=!1}}),[]),e}(),n=o.useState(e),u=(0,s.default)(n,2),l=u[0],a=u[1],i=o.useRef(l),c=o.useCallback((function(e){!t.current&&r||(i.current="function"===typeof e?e(i.current):e,a(i.current))}),[r,t]);return[i,c]};function D(e){var r=e.locale,t=e.referencedCallback,n=R({}),u=(0,s.default)(n,2),l=u[0],a=u[1],i=o.useMemo((function(){return"undefined"!==typeof Intl?new Intl.NumberFormat(r).format(1.1).includes(",")?",":".":(console.warn("[react-native-use-form] please upgrade React Native to provide Intl support to detect separation character"),".")}),[r]);return function(e,r,n,u){var o,c=L(n,e),s=(""+(o=c,o||0===o?c:"")).replace(".",i);return{onChangeText:t("number."+e,(function(t){var n=function(e){var r=e.lastIndexOf(","),t=e.lastIndexOf("."),n=e.endsWith(","),u=e.endsWith("."),o=function(e){var r=0,t=function(e){var r="";for(var t of e)r=t+r;return r}(e);for(var n of t){if("0"!==n)return r;r++}return r}(e),l=o>0,a=Math.max(r,t);if(n||u||a>0&&o>0){var i=e.length-o,c=l?i:a;return i-1===a&&(c=a),{firstPart:e.slice(0,c),lastPart:e.slice(c,e.length),hasLastPart:!0}}return{firstPart:e,lastPart:"",hasLastPart:!1}}(t),o=n.lastPart,l=n.hasLastPart,i=n.firstPart;if(a(l?function(r){return E(r,e,o)}:function(r){return E(r,e,void 0)}),""===t)u(e,null,r);else{var c=Number(i.replace(",","."));u(e,c,r)}})),value:""+(s||"")+(L(l.current,e)||"")}}}function M(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function q(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?M(Object(t),!0).forEach((function(r){(0,y.default)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):M(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function F(e){var r=e.options,t=e.locale,n=e.referencedCallback,u=e.error,a=u.errors,i=u.updateHandler,c=u.hasError,f=u.checkAndSetError,p=e.layout.onLayoutKey,b=e.value,h=b.values,v=b.setValues,m=e.touch,g=m.touched,y=m.setTouched,O=e.focusedOnce,j=O.focusedOnce,w=O.setFocusedOnce,x=e.nextAndSubmit.inputReferencer,C=d(null==r?void 0:r.onChange),P=d(null==r?void 0:r.enhance),S=o.useCallback((function(e,r,t){var n=(null==t||null==t.enhance?void 0:t.enhance(r,h.current))||r,u=E((null==t||null==t.enhanceValues?void 0:t.enhanceValues(n,h.current))||h.current,e,n),o=P.current?P.current(u,{previousValues:h.current}):u;null==t||null==t.onChangeText||t.onChangeText(n),null==t||null==t.onChange||t.onChange(n),v(o),f(e,t,n,o),y(e,!0),null==C.current||C.current(o,{touched:g.current,focusedOnce:j.current,errors:a.current})}),[h,P,v,f,y,C,g,j,a]),k=function(e,r){return n("blur."+e,(function(t){null==r||null==r.onBlur||r.onBlur(t),w(e,!0)}))},T=function(e,r){return i(e,r),t={testID:e,onLayout:p(e),onBlur:k(e,r),error:c(e),errorMessage:L(a.current,e),label:null==r?void 0:r.label},Object.fromEntries(Object.entries(t).filter((function(e){var r=(0,s.default)(e,2);return r[0],void 0!==r[1]})));var t},R=function(e,r){return q(q(q({},x(e)),T(e,r)),{},{value:L(h.current,e)||"",onChangeText:n("text."+e,(function(t){return S(e,t,r)}))})},M=D({locale:t,referencedCallback:n}),F=function(e,r){return q(q(q({},x(e)),T(e,r)),M(e,r,h.current,S))},N=function(e,r){return q(q({},R(e,r)),{},{autoCapitalize:"words",autoComplete:"name",autoCorrect:!1})},K=o.useCallback((function(e,r){S(e,r,void 0)}),[S]);return{inputs:{text:R,number:function(e,r){return q(q({},F(e,r)),{},{keyboardType:"number-pad"})},decimal:function(e,r){return q(q({},F(e,r)),{},{keyboardType:"decimal-pad"})},numberText:function(e,r){return q(q({},R(e,r)),{},{keyboardType:"number-pad"})},decimalText:function(e,r){return q(q({},R(e,r)),{},{keyboardType:"decimal-pad"})},postalCode:function(e,r){return q(q({},R(e,r)),{},{autoCapitalize:"characters",textContentType:"postalCode",autoComplete:"postal-code",autoCorrect:!1})},streetAddress:function(e,r){return q(q({},R(e,r)),{},{autoCapitalize:"words",autoComplete:"street-address",autoCorrect:!1})},city:function(e,r){return q(q({},R(e,r)),{},{autoCapitalize:"words",textContentType:"addressCity",autoCorrect:!1})},telephone:function(e,r){return q(q({},R(e,r)),{},{textContentType:"telephoneNumber",autoComplete:"tel",keyboardType:"phone-pad",autoCorrect:!1})},name:N,firstName:function(e,r){return q(q({},N(e,r)),{},{autoComplete:"given-name"})},middleName:function(e,r){return q(q({},N(e,r)),{},{autoComplete:"name-middle\n"})},lastName:function(e,r){return q(q({},N(e,r)),{},{autoComplete:"family-name"})},username:function(e,r){return q(q({},R(e,r)),{},{textContentType:"username",autoComplete:"username",autoCapitalize:"none",autoCorrect:!1,selectTextOnFocus:"web"!==l.default.OS})},password:function(e,r){return q(q({},R(e,r)),{},{textContentType:"password",autoComplete:"password",secureTextEntry:!0,autoCorrect:!1,selectTextOnFocus:"web"!==l.default.OS,label:null==r?void 0:r.label})},email:function(e,r){return q(q({},R(e,r)),{},{textContentType:"emailAddress",autoComplete:"email",keyboardType:"email-address",autoCapitalize:"none",autoCorrect:!1})},raw:function(e,r){return q(q({},T(e,r)),{},{onChange:n("raw."+e,(function(t){y(e,!0),w(e,!0),S(e,t,r)})),value:L(h.current,e)})}},setField:K}}var N=t(126),K=t(8053);function V(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function B(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?V(Object(t),!0).forEach((function(r){(0,y.default)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):V(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}var z=t(5126);function A(e,r,t,n,u){var o;if(t)if(!0!==(null==t?void 0:t.required)||n)if(void 0!==t.minLength&&(""+n).length<t.minLength)o=m(e,"lengtShouldBeLongerThan")({fieldKey:r,label:null==t?void 0:t.label,requiredLength:t.minLength});else if(void 0!==t.maxLength&&(""+n).length>t.maxLength)o=m(e,"lengthShouldBeShorterThan")({fieldKey:r,label:null==t?void 0:t.label,requiredLength:t.maxLength});else if(t.shouldFollowRegexes)for(var l of t.shouldFollowRegexes){var a=l.regex,i=l.errorMessage;if(!a.test(""+n)){o=m(e,"shouldFollowRegex")({fieldKey:r,label:null==t?void 0:t.label,errorMessage:i});break}}else t.validate&&(o=null==t.validate?void 0:t.validate(n,u));else o=m(e,"required")({fieldKey:r,label:null==t?void 0:t.label});return!0!==o&&void 0!==o&&null!==o&&o}var _="undefined"!==typeof window&&"ontouchstart"in window,I="undefined"!==typeof window&&window.matchMedia("(min-width: 1000px)").matches;const H=_&&!I;function W(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function U(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?W(Object(t),!0).forEach((function(r){(0,y.default)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):W(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function $(e,r){var t=(null==r?void 0:r.locale)||v,n=function(){var e=R({}),r=(0,s.default)(e,2),t=r[0],n=r[1];return{touched:t,setTouched:o.useCallback((function(e,r){n((function(t){return E(t,e,r)}))}),[n])}}(),u=function(e){var r=R(e),t=(0,s.default)(r,2);return{values:t[0],setValues:t[1]}}(e),l=function(){var e=R({}),r=(0,s.default)(e,2),t=r[0],n=r[1];return{focusedOnce:t,setFocusedOnce:o.useCallback((function(e,r){n((function(t){return E(t,e,r)}))}),[n])}}(),a=function(){var e=R(!1),r=(0,s.default)(e,2);return{wasSubmitted:r[0],setWasSubmitted:r[1]}}(),i=f(),c=function(e){var r=e.referencedCallback,t=e.scrollViewRef,n=o.useRef({});return{onLayoutKey:function(e,u){return r("layout."+e,(function(r){null==u||null==u.onLayout||u.onLayout(r),null!=t&&t.current&&function(e,r,t){var n,u=e.nativeEvent.target.getBoundingClientRect(),o=null==(n=r.current)||null==n.getBoundingClientRect?void 0:n.getBoundingClientRect();t({x:u.x,y:u.y-o.y})}(r,t,(function(r){n.current=B(B({},n.current),{},(0,y.default)({},e,r))}))}))},layoutsRef:n}}({referencedCallback:i,scrollViewRef:null==r?void 0:r.scrollViewRef}),b=function(e){var r=e.locale,t=e.touch.touched,n=e.value.values,u=e.focusedOnce.focusedOnce,l=e.wasSubmitted.wasSubmitted,a=o.useRef({});a.current={};var i=R({}),c=(0,s.default)(i,2),f=c[0],d=c[1],b=o.useCallback((function(e,r){r&&(a.current[e]=r)}),[]),h=o.useCallback((function(e,t,n,u){var o=A(r,e,t,L(u,e),u);L(f.current,e)!==o&&d((function(r){return E(r,e,o)}))}),[f,r,d]),v=o.useCallback((function(e){var r=L(t.current,e),n=L(u.current,e),o=L(f.current,e);return!!(r&&n||l.current)&&!(!1===o)}),[f,u,t,l]);return o.useEffect((function(){var e=Object.keys(a.current).reduce((function(e,t){var u=t,o=a.current[u],l=L(n.current,u),i=n.current,c=A(r,u,o,l,i);return E(e,u,c)}),{});(0,z.deepEqual)(e,f.current)||d(e)})),{hasError:v,hasErrors:p(f.current),updateHandler:b,errors:f,checkAndSetError:h}}({locale:t,touch:n,value:u,focusedOnce:l,wasSubmitted:a}),h=function(e){var r=e.options,t=e.layout,n=e.error,u=n.hasErrors,l=n.errors,a=e.wasSubmitted,i=e.value.values,c=e.touch.touched,s=e.focusedOnce.focusedOnce,f=null==r?void 0:r.scrollViewRef,p=t.layoutsRef,b=d(null==r?void 0:r.onSubmit);return{wasSubmitted:a,submit:o.useCallback((function(){if(K.default.dismiss(),a.setWasSubmitted(!0),u){if(null!=f&&f.current){var e=Object.keys(p.current).filter((function(e){return!!L(l.current,e)})),r=Math.min.apply(Math,(0,N.default)(e.map((function(e){var r,t;return(null==(r=p.current)||null==(t=r[e])?void 0:t.y)||0}))));r&&f.current.scrollTo({y:r-24,animated:!0})}}else null==b.current||b.current(i.current,{touched:c.current,focusedOnce:s.current})}),[a,u,b,i,c,s,f,p,l])}}({options:r,layout:c,error:b,touch:n,wasSubmitted:a,value:u,focusedOnce:l}),m=function(e){var r=e.submit,t=o.useRef(0),n=R(void 0),u=(0,s.default)(n,2),l=u[0],a=u[1],i=o.useRef({}),c=o.useRef({}),d=o.useRef({});t.current=0,c.current={},d.current={};var p=f();return o.useEffect((function(){var e=Object.keys(c.current).map((function(e){return Number(c.current[e])})),r=Math.max.apply(Math,(0,N.default)(e));a(d.current[r])}),[a,i]),{inputReferencer:function(e){return c.current[e]=t.current,d.current[t.current]=e,t.current=t.current+1,{ref:p("ref."+e,(function(r){i.current[e]=r})),onSubmitEditing:p("onSubmitEditing."+e,(function(){var t=Object.keys(c.current).map((function(e){return Number(c.current[e])})),n=Object.keys(i.current).reduce((function(e,r){return U(U({},e),{},(0,y.default)({},c.current[r],i.current[r]))}),{}),u=t.sort((function(e,r){return e-r})),o=u[u.length-1],l=c.current[e]||0,a=n[l];if((o&&(null==n?void 0:n[o]))!==a&&H){var s=u.filter((function(e){return e>l})).map((function(e){return n[e]})).filter(Boolean).find((function(e){var r=null==e?void 0:e.props;return!0!==(null==r?void 0:r.disabled)&&!1!==(null==r?void 0:r.editable)&&e}));null==s||null==s.focus||s.focus(),null==a||null==a.blur||a.blur()}else r.submit()})),blurOnSubmit:l.current===e,returnKeyType:l.current===e?"send":"next"}}}}({submit:h}),g=F({options:r,locale:t,error:b,layout:c,value:u,touch:n,focusedOnce:l,referencedCallback:i,nextAndSubmit:m});return[{wasSubmitted:a.wasSubmitted.current,hasErrors:b.hasErrors,errors:b.errors.current,hasError:b.hasError,values:u.values.current,setValues:u.setValues,touched:n.touched.current,setTouched:n.setTouched,focusedOnce:l.focusedOnce.current,setField:g.setField,submit:h.submit,formProps:{}},g.inputs]}var G=o.createContext({}),J=t(7557),Q={};function X(e){var r=e.children;return(0,J.jsx)(G.Provider,{value:Q,children:r})}t(8808),t(4018);i.default.create({full:{flex:1}});const Y={required:function(e){return(e.label||e.fieldKey)+" is verplicht"},lengtShouldBeLongerThan:function(e){return(e.label||e.fieldKey)+" moet langer zijn dan "+e.requiredLength},lengthShouldBeShorterThan:function(e){return(e.label||e.fieldKey)+" moet korter zijn dan "+e.requiredLength},shouldFollowRegex:function(e){return e.errorMessage||(e.label||e.fieldKey)+" is niet in het juiste formaat"}};const Z={required:function(e){return(e.label||e.fieldKey)+" is required"},lengtShouldBeLongerThan:function(e){return(e.label||e.fieldKey)+" length should be longer than "+e.requiredLength},lengthShouldBeShorterThan:function(e){return(e.label||e.fieldKey)+" length should be shorter than "+e.requiredLength},shouldFollowRegex:function(e){return e.errorMessage||(e.label||e.fieldKey)+" is not in the right format"}};var ee=t(4695),re=t(5899),te=t(2703),ne=t(5987),ue=t(9001),oe=t(6001),le=["errorMessage"];function ae(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function ie(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ae(Object(t),!0).forEach((function(r){(0,n.default)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ae(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}const ce=o.memo(o.forwardRef((function(e,r){var t=e.errorMessage,n=(0,ne.default)(e,le);return console.log("render",n.label),(0,J.jsxs)(J.Fragment,{children:[(0,J.jsx)(ue.default,ie(ie({},n),{},{ref:r})),(0,J.jsx)(oe.default,{type:"error",visible:n.error,children:t||" "})]})})));var se,fe=t(4152),de=t(853);function pe(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function be(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?pe(Object(t),!0).forEach((function(r){(0,n.default)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):pe(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function he(){var e=o.useState(se.EN),r=(0,u.default)(e,2),t=r[0],n=r[1],l=o.useState(!1),i=(0,u.default)(l,2),s=i[0],f=i[1],d=(0,o.useRef)(null),p=$({email:"",telephone:"",password:"",age:void 0,money:void 0,description:"",postalCode:"",postalCodeDisabled:"",organization:{name:"",telephone:"",revenue:0}},{scrollViewRef:d,locale:t,onChange:function(){},onSubmit:function(e,r){console.log("no errors, submit!",{v:e,extra:r})}}),b=(0,u.default)(p,2),h=b[0],v=h.submit,m=h.formProps,g=h.hasError,y=b[1];return(0,J.jsx)(fe.SafeAreaProvider,{children:(0,J.jsxs)(c.default,{style:me.root,children:[(0,J.jsx)(ee.default.Header,{children:(0,J.jsx)(ee.default.Content,{title:"Form"})}),(0,J.jsx)(a.default,{style:me.scrollView,ref:d,children:(0,J.jsxs)(c.default,{style:me.inner,children:[(0,J.jsx)(re.default,{children:"Number format + default errors"}),(0,J.jsx)(de.default,{multiSelect:!1,value:t,onValueChange:function(e){return n(e)},buttons:[{value:se.EN,label:"English"},{value:se.NL,label:"Dutch"}]}),(0,J.jsxs)(X,be(be({},m),{},{children:[(0,J.jsx)(ce,be({mode:"outlined",error:g("email")},y.email("email",{validate:function(e){return!!function(e){var r=e.lastIndexOf("@"),t=e.lastIndexOf(".");return r<t&&r>0&&-1===e.indexOf("@@")&&t>2&&e.length-t>2}(e)||"Email-address is invalid"},label:"Email"}))),(0,J.jsx)(te.default,{onPress:function(){return f((function(e){return!e}))},children:"hide required field"}),!s&&(0,J.jsx)(ce,be({mode:"outlined"},y.telephone("telephone",{required:!0,minLength:3,maxLength:10,shouldFollowRegexes:[ve],label:"Telephone"}))),(0,J.jsx)(ce,be({mode:"outlined"},y.text("postalCode",{enhance:function(e){return(e||"").toUpperCase()},label:"Postalcode"}))),(0,J.jsx)(ce,be({editable:!1,mode:"outlined"},y.text("postalCode",{enhance:function(e){return(e||"").toUpperCase()},label:"Postalcode (disabled)"}))),(0,J.jsx)(ce,be({mode:"outlined"},y.password("password",{required:!0,minLength:3,maxLength:10,label:"Password"}))),(0,J.jsx)(ce,be({mode:"outlined"},y.number("age",{required:!0,minLength:3,maxLength:10,label:"Age"}))),(0,J.jsx)(ce,be({mode:"outlined"},y.decimal("money",{required:!0,minLength:3,maxLength:10,label:"Money bank account"}))),(0,J.jsx)(ce,be({mode:"outlined"},y.text("organization.telephone",{required:!0,minLength:3,maxLength:10,shouldFollowRegexes:[ve],label:"Organization telephone"}))),(0,J.jsx)(ce,be({mode:"outlined"},y.number("organization.revenue",{required:!0,minLength:3,maxLength:10,validate:function(e){if(e<10)return"revenue too low"},label:"Organization revenue"}))),(0,J.jsx)(ce,be({mode:"outlined"},y.text("description",{label:"Description",required:!0,minLength:3,maxLength:10}))),(0,J.jsx)(te.default,{mode:"contained",onPress:v,style:{marginTop:24},children:"Save"})]}))]})})]})})}g("en",Z),g("nl",Y),function(e){e.EN="en",e.NL="nl"}(se||(se={}));var ve={regex:new RegExp(/^\d+$/),errorMessage:"Telephone is invalid"};var me=i.default.create({root:{flex:1,maxHeight:"web"===l.default.OS?"100vh":void 0},scrollView:{flex:1},inner:{marginTop:100,marginLeft:12,marginRight:12,alignSelf:"center",width:300,paddingBottom:500}})}},r={};function t(n){var u=r[n];if(void 0!==u)return u.exports;var o=r[n]={exports:{}};return e[n].call(o.exports,o,o.exports,t),o.exports}t.m=e,(()=>{var e=[];t.O=(r,n,u,o)=>{if(!n){var l=1/0;for(s=0;s<e.length;s++){for(var[n,u,o]=e[s],a=!0,i=0;i<n.length;i++)(!1&o||l>=o)&&Object.keys(t.O).every((e=>t.O[e](n[i])))?n.splice(i--,1):(a=!1,o<l&&(l=o));if(a){e.splice(s--,1);var c=u();void 0!==c&&(r=c)}}return r}o=o||0;for(var s=e.length;s>0&&e[s-1][2]>o;s--)e[s]=e[s-1];e[s]=[n,u,o]}})(),t.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return t.d(r,{a:r}),r},(()=>{var e,r=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__;t.t=function(n,u){if(1&u&&(n=this(n)),8&u)return n;if("object"===typeof n&&n){if(4&u&&n.__esModule)return n;if(16&u&&"function"===typeof n.then)return n}var o=Object.create(null);t.r(o);var l={};e=e||[null,r({}),r([]),r(r)];for(var a=2&u&&n;"object"==typeof a&&!~e.indexOf(a);a=r(a))Object.getOwnPropertyNames(a).forEach((e=>l[e]=()=>n[e]));return l.default=()=>n,t.d(o,l),o}})(),t.d=(e,r)=>{for(var n in r)t.o(r,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:r[n]})},t.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}(),t.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),t.r=e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.p="/",(()=>{var e={179:0};t.O.j=r=>0===e[r];var r=(r,n)=>{var u,o,[l,a,i]=n,c=0;if(l.some((r=>0!==e[r]))){for(u in a)t.o(a,u)&&(t.m[u]=a[u]);if(i)var s=i(t)}for(r&&r(n);c<l.length;c++)o=l[c],t.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return t.O(s)},n=self.webpackChunkweb=self.webpackChunkweb||[];n.forEach(r.bind(null,0)),n.push=r.bind(null,n.push.bind(n))})();var n=t.O(void 0,[918],(()=>t(9484)));n=t.O(n)})();
//# sourceMappingURL=main.1b06ace8.js.map