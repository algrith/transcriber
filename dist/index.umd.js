!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n(require("react")):"function"==typeof define&&define.amd?define(["react"],n):(e||self).reactSpeechTranscriber=n(e.react)}(this,function(e){function n(){return n=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var r=arguments[n];for(var t in r)({}).hasOwnProperty.call(r,t)&&(e[t]=r[t])}return e},n.apply(null,arguments)}var r={google:"https://speech.googleapis.com/v1/speech:recognize"};return function(t,o){var i=r[o.engine]+"?key="+t,a=e.useState({loading:!1,transcript:"",error:null}),c=a[1];return{transcribe:function(e){var r=new FileReader;r.onloadend=function(){if(r.result&&"string"==typeof r.result){c(function(e){return n({},e,{loading:!0})});var e=r.result.split(",")[1];fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({config:{sampleRateHertz:48e3,encoding:"WEBM_OPUS",languageCode:"en-US"},audio:{content:e}})}).then(function(e){return e.json()}).then(function(e){var r=e.results.map(function(e){return e.alternatives[0].transcript}).join("\n");c(function(e){return n({},e,{loading:!1,error:null,transcript:r})})}).catch(function(e){console.error("Error performing speech-to-text:",e),c(function(r){return n({},r,{loading:!1,transcript:"",error:e})})})}},r.readAsDataURL(e)},response:a[0]}}});
//# sourceMappingURL=index.umd.js.map