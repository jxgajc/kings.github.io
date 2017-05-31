var _at_tool={};
{
	if (!Array.prototype.indexOf){  
        Array.prototype.indexOf = function(elt /*, from*/){  
        var len = this.length >>> 0;  
        var from = Number(arguments[1]) || 0;  
        from = (from < 0)  
             ? Math.ceil(from)  
             : Math.floor(from);  
        if (from < 0)  
          from += len;  
        for (; from < len; from++)  
        {  
          if (from in this &&  
              this[from] === elt)  
            return from;  
        }  
        return -1;  
      };  
    }  
	
/**跨域通信兼容方案**/
	window._CD_Messenger__ = (function(){

	    // 消息前缀, 建议使用自己的项目名, 避免多项目之间的冲突
	    // !注意 消息前缀应使用字符串类型
	    var prefix = "[PROJECT_NAME]",
	        supportPostMessage = 'postMessage' in window;

	    // Target 类, 消息对象
	    function Target(target, name, prefix){
	        var errMsg = '';
	        if(arguments.length < 2){
	            errMsg = 'target error - target and name are both required';
	        } else if (typeof target != 'object'){
	            errMsg = 'target error - target itself must be window object';
	        } else if (typeof name != 'string'){
	            errMsg = 'target error - target name must be string type';
	        }
	        if(errMsg){
	            throw new Error(errMsg);
	        }
	        this.target = target;
	        this.name = name;
	        this.prefix = prefix;
	    }

	    // 往 target 发送消息, 出于安全考虑, 发送消息会带上前缀
	    if ( supportPostMessage ){
	        // IE8+ 以及现代浏览器支持
	        Target.prototype.send = function(msg){
	            this.target.postMessage(this.prefix + '|' + this.name + '__Messenger__' + msg, '*');
	        };
	    } else {
	        // 兼容IE 6/7
	        Target.prototype.send = function(msg){
	            var targetFunc = window.navigator[this.prefix + this.name];
	            if ( typeof targetFunc == 'function' ) {
	                targetFunc(this.prefix + msg, window);
	            } else {
	                throw new Error("target callback function is not defined");
	            }
	        };
	    }

	    // 信使类
	    // 创建Messenger实例时指定, 必须指定Messenger的名字, (可选)指定项目名, 以避免Mashup类应用中的冲突
	    // !注意: 父子页面中projectName必须保持一致, 否则无法匹配
	    function Messenger(messengerName, projectName){
	        this.targets = {};
	        this.name = messengerName;
	        this.listenFunc = [];
	        this.prefix = projectName || prefix;
	        this.initListen();
	    }

	    // 添加一个消息对象
	    Messenger.prototype.addTarget = function(target, name){
	        var targetObj = new Target(target, name,  this.prefix);
	        this.targets[name] = targetObj;
	    };

	    // 初始化消息监听
	    Messenger.prototype.initListen = function(){
	        var self = this;
	        var generalCallback = function(msg){
	            if(typeof msg == 'object' && msg.data){
	                msg = msg.data;
	            }
	            
	            var msgPairs = msg.split('__Messenger__');
	            var msg = msgPairs[1];
	            var pairs = msgPairs[0].split('|');
	            var prefix = pairs[0];
	            var name = pairs[1];

	            for(var i = 0; i < self.listenFunc.length; i++){
	                if (prefix + name === self.prefix + self.name) {
	                    self.listenFunc[i](msg);
	                }
	            }
	        };

	        if ( supportPostMessage ){
	            if ( 'addEventListener' in document ) {
	                window.addEventListener('message', generalCallback, false);
	            } else if ( 'attachEvent' in document ) {
	                window.attachEvent('onmessage', generalCallback);
	            }
	        } else {
	            // 兼容IE 6/7
	            window.navigator[this.prefix + this.name] = generalCallback;
	        }
	    };

	    // 监听消息
	    Messenger.prototype.listen = function(callback){
	        var i = 0;
	        var len = this.listenFunc.length;
	        var cbIsExist = false;
	        for (; i < len; i++) {
	            if (this.listenFunc[i] == callback) {
	                cbIsExist = true;
	                break;
	            }
	        }
	        if (!cbIsExist) {
	            this.listenFunc.push(callback);
	        }
	    };
	    // 注销监听
	    Messenger.prototype.clear = function(){
	        this.listenFunc = [];
	    };
	    // 广播消息
	    Messenger.prototype.send = function(msg){
	        var targets = this.targets,
	            target;
	        for(target in targets){
	            if(targets.hasOwnProperty(target)){
	                targets[target].send(msg);
	            }
	        }
	    };

	    return Messenger;
	})();

	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
	
	var __i_tk = base64decode('Z2FpbnR3ZWI=');
	
	/**
	 * base64编码
	 * 
	 * @param {Object}
	 *            str
	 */
	function base64encode(str){
	    var out, i, len;
	    var c1, c2, c3;
	    len = str.length;
	    i = 0;
	    out = "";
	    while (i < len) {
	        c1 = str.charCodeAt(i++) & 0xff;
	        if (i == len) {
	            out += base64EncodeChars.charAt(c1 >> 2);
	            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
	            out += "==";
	            break;
	        }
	        c2 = str.charCodeAt(i++);
	        if (i == len) {
	            out += base64EncodeChars.charAt(c1 >> 2);
	            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
	            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
	            out += "=";
	            break;
	        }
	        c3 = str.charCodeAt(i++);
	        out += base64EncodeChars.charAt(c1 >> 2);
	        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
	        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
	        out += base64EncodeChars.charAt(c3 & 0x3F);
	    }
	    return out;
	}
	/**
	 * base64解码
	 * 
	 * @param {Object}
	 *            str
	 */
	function base64decode(str){
		if( typeof str == "undefined"){
			
			return "";
		}
	    var c1, c2, c3, c4;
	    var i, len, out;
	    len = str.length;
	    i = 0;
	    out = "";
	    while (i < len) {
	        /* c1 */
	        do {
	            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
	        }
	        while (i < len && c1 == -1);
	        if (c1 == -1) 
	            break;
	        /* c2 */
	        do {
	            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
	        }
	        while (i < len && c2 == -1);
	        if (c2 == -1) 
	            break;
	        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
	        /* c3 */
	        do {
	            c3 = str.charCodeAt(i++) & 0xff;
	            if (c3 == 61) 
	                return out;
	            c3 = base64DecodeChars[c3];
	        }
	        while (i < len && c3 == -1);
	        if (c3 == -1) 
	            break;
	        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
	        /* c4 */
	        do {
	            c4 = str.charCodeAt(i++) & 0xff;
	            if (c4 == 61) 
	                return out;
	            c4 = base64DecodeChars[c4];
	        }
	        while (i < len && c4 == -1);
	        if (c4 == -1) 
	            break;
	        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
	    }
	    return out;
	}
	/**
	 * utf16转utf8
	 * 
	 * @param {Object}
	 *            str
	 */
	function utf16to8(str){
	    var out, i, len, c;
	    out = "";
	    len = str.length;
	    for (i = 0; i < len; i++) {
	        c = str.charCodeAt(i);
	        if ((c >= 0x0001) && (c <= 0x007F)) {
	            out += str.charAt(i);
	        }
	        else 
	            if (c > 0x07FF) {
	                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
	                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
	                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
	            }
	            else {
	                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
	                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
	            }
	    }
	    return out;
	}
	/**
	 * utf8转utf16
	 * 
	 * @param {Object}
	 *            str
	 */
	function utf8to16(str){
	    var out, i, len, c;
	    var char2, char3;
	    out = "";
	    len = str.length;
	    i = 0;
	    while (i < len) {
	        c = str.charCodeAt(i++);
	        switch (c >> 4) {
	            case 0:
	            case 1:
	            case 2:
	            case 3:
	            case 4:
	            case 5:
	            case 6:
	            case 7:
	                out += str.charAt(i - 1);
	                break;
	            case 12:
	            case 13:
	                char2 = str.charCodeAt(i++);
	                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
	                break;
	            case 14:
	                char2 = str.charCodeAt(i++);
	                char3 = str.charCodeAt(i++);
	                out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
	                break;
	        }
	    }
	    return out;
	}
	
/*
 * CryptoJS v3.1.2 code.google.com/p/crypto-js (c) 2009-2013 by Jeff Mott. All
 * rights reserved. code.google.com/p/crypto-js/wiki/License
 */  
var CryptoJS=CryptoJS||function(u,l){var d={},n=d.lib={},p=function(){},s=n.Base={extend:function(a){p.prototype=this;var c=new p;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},  
q=n.WordArray=s.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=l?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,m=a.words,f=this.sigBytes;a=a.sigBytes;this.clamp();if(f%4)for(var t=0;t<a;t++)c[f+t>>>2]|=(m[t>>>2]>>>24-8*(t%4)&255)<<24-8*((f+t)%4);else if(65535<m.length)for(t=0;t<a;t+=4)c[f+t>>>2]=m[t>>>2];else c.push.apply(c,m);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<  
32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=s.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],m=0;m<a;m+=4)c.push(4294967296*u.random()|0);return new q.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var m=[],f=0;f<a;f++){var t=c[f>>>2]>>>24-8*(f%4)&255;m.push((t>>>4).toString(16));m.push((t&15).toString(16))}return m.join("")},parse:function(a){for(var c=a.length,m=[],f=0;f<c;f+=2)m[f>>>3]|=parseInt(a.substr(f,  
2),16)<<24-4*(f%8);return new q.init(m,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var m=[],f=0;f<a;f++)m.push(String.fromCharCode(c[f>>>2]>>>24-8*(f%4)&255));return m.join("")},parse:function(a){for(var c=a.length,m=[],f=0;f<c;f++)m[f>>>2]|=(a.charCodeAt(f)&255)<<24-8*(f%4);return new q.init(m,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},  
r=n.BufferedBlockAlgorithm=s.extend({reset:function(){this._data=new q.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,m=c.words,f=c.sigBytes,t=this.blockSize,b=f/(4*t),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*t;f=u.min(4*a,f);if(a){for(var e=0;e<a;e+=t)this._doProcessBlock(m,e);e=m.splice(0,a);c.sigBytes-=f}return new q.init(e,f)},clone:function(){var a=s.clone.call(this);  
a._data=this._data.clone();return a},_minBufferSize:0});n.Hasher=r.extend({cfg:s.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){r.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,m){return(new a.init(m)).finalize(c)}},_createHmacHelper:function(a){return function(c,m){return(new e.HMAC.init(a,  
m)).finalize(c)}}});var e=d.algo={};return d}(Math);  
(function(){var u=CryptoJS,l=u.lib.WordArray;u.enc.Base64={stringify:function(d){var n=d.words,l=d.sigBytes,s=this._map;d.clamp();d=[];for(var q=0;q<l;q+=3)for(var w=(n[q>>>2]>>>24-8*(q%4)&255)<<16|(n[q+1>>>2]>>>24-8*((q+1)%4)&255)<<8|n[q+2>>>2]>>>24-8*((q+2)%4)&255,v=0;4>v&&q+0.75*v<l;v++)d.push(s.charAt(w>>>6*(3-v)&63));if(n=s.charAt(64))for(;d.length%4;)d.push(n);return d.join("")},parse:function(d){var n=d.length,p=this._map,s=p.charAt(64);s&&(s=d.indexOf(s),-1!=s&&(n=s));for(var s=[],q=0,w=0;w<  
n;w++)if(w%4){var v=p.indexOf(d.charAt(w-1))<<2*(w%4),b=p.indexOf(d.charAt(w))>>>6-2*(w%4);s[q>>>2]|=(v|b)<<24-8*(q%4);q++}return l.create(s,q)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();  
(function(u){function l(b,e,a,c,m,f,t){b=b+(e&a|~e&c)+m+t;return(b<<f|b>>>32-f)+e}function d(b,e,a,c,m,f,t){b=b+(e&c|a&~c)+m+t;return(b<<f|b>>>32-f)+e}function n(b,e,a,c,m,f,t){b=b+(e^a^c)+m+t;return(b<<f|b>>>32-f)+e}function p(b,e,a,c,m,f,t){b=b+(a^(e|~c))+m+t;return(b<<f|b>>>32-f)+e}for(var s=CryptoJS,q=s.lib,w=q.WordArray,v=q.Hasher,q=s.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;q=q.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},  
_doProcessBlock:function(r,e){for(var a=0;16>a;a++){var c=e+a,m=r[c];r[c]=(m<<8|m>>>24)&16711935|(m<<24|m>>>8)&4278255360}var a=this._hash.words,c=r[e+0],m=r[e+1],f=r[e+2],t=r[e+3],y=r[e+4],q=r[e+5],s=r[e+6],w=r[e+7],v=r[e+8],u=r[e+9],x=r[e+10],z=r[e+11],A=r[e+12],B=r[e+13],C=r[e+14],D=r[e+15],g=a[0],h=a[1],j=a[2],k=a[3],g=l(g,h,j,k,c,7,b[0]),k=l(k,g,h,j,m,12,b[1]),j=l(j,k,g,h,f,17,b[2]),h=l(h,j,k,g,t,22,b[3]),g=l(g,h,j,k,y,7,b[4]),k=l(k,g,h,j,q,12,b[5]),j=l(j,k,g,h,s,17,b[6]),h=l(h,j,k,g,w,22,b[7]),  
g=l(g,h,j,k,v,7,b[8]),k=l(k,g,h,j,u,12,b[9]),j=l(j,k,g,h,x,17,b[10]),h=l(h,j,k,g,z,22,b[11]),g=l(g,h,j,k,A,7,b[12]),k=l(k,g,h,j,B,12,b[13]),j=l(j,k,g,h,C,17,b[14]),h=l(h,j,k,g,D,22,b[15]),g=d(g,h,j,k,m,5,b[16]),k=d(k,g,h,j,s,9,b[17]),j=d(j,k,g,h,z,14,b[18]),h=d(h,j,k,g,c,20,b[19]),g=d(g,h,j,k,q,5,b[20]),k=d(k,g,h,j,x,9,b[21]),j=d(j,k,g,h,D,14,b[22]),h=d(h,j,k,g,y,20,b[23]),g=d(g,h,j,k,u,5,b[24]),k=d(k,g,h,j,C,9,b[25]),j=d(j,k,g,h,t,14,b[26]),h=d(h,j,k,g,v,20,b[27]),g=d(g,h,j,k,B,5,b[28]),k=d(k,g,  
h,j,f,9,b[29]),j=d(j,k,g,h,w,14,b[30]),h=d(h,j,k,g,A,20,b[31]),g=n(g,h,j,k,q,4,b[32]),k=n(k,g,h,j,v,11,b[33]),j=n(j,k,g,h,z,16,b[34]),h=n(h,j,k,g,C,23,b[35]),g=n(g,h,j,k,m,4,b[36]),k=n(k,g,h,j,y,11,b[37]),j=n(j,k,g,h,w,16,b[38]),h=n(h,j,k,g,x,23,b[39]),g=n(g,h,j,k,B,4,b[40]),k=n(k,g,h,j,c,11,b[41]),j=n(j,k,g,h,t,16,b[42]),h=n(h,j,k,g,s,23,b[43]),g=n(g,h,j,k,u,4,b[44]),k=n(k,g,h,j,A,11,b[45]),j=n(j,k,g,h,D,16,b[46]),h=n(h,j,k,g,f,23,b[47]),g=p(g,h,j,k,c,6,b[48]),k=p(k,g,h,j,w,10,b[49]),j=p(j,k,g,h,  
C,15,b[50]),h=p(h,j,k,g,q,21,b[51]),g=p(g,h,j,k,A,6,b[52]),k=p(k,g,h,j,t,10,b[53]),j=p(j,k,g,h,x,15,b[54]),h=p(h,j,k,g,m,21,b[55]),g=p(g,h,j,k,v,6,b[56]),k=p(k,g,h,j,D,10,b[57]),j=p(j,k,g,h,s,15,b[58]),h=p(h,j,k,g,B,21,b[59]),g=p(g,h,j,k,y,6,b[60]),k=p(k,g,h,j,z,10,b[61]),j=p(j,k,g,h,f,15,b[62]),h=p(h,j,k,g,u,21,b[63]);a[0]=a[0]+g|0;a[1]=a[1]+h|0;a[2]=a[2]+j|0;a[3]=a[3]+k|0},_doFinalize:function(){var b=this._data,e=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;e[c>>>5]|=128<<24-c%32;var m=u.floor(a/  
4294967296);e[(c+64>>>9<<4)+15]=(m<<8|m>>>24)&16711935|(m<<24|m>>>8)&4278255360;e[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(e.length+1);this._process();b=this._hash;e=b.words;for(a=0;4>a;a++)c=e[a],e[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});s.MD5=v._createHelper(q);s.HmacMD5=v._createHmacHelper(q)})(Math);  
(function(){var u=CryptoJS,l=u.lib,d=l.Base,n=l.WordArray,l=u.algo,p=l.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:l.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,l){for(var p=this.cfg,v=p.hasher.create(),b=n.create(),u=b.words,r=p.keySize,p=p.iterations;u.length<r;){e&&v.update(e);var e=v.update(d).finalize(l);v.reset();for(var a=1;a<p;a++)e=v.finalize(e),v.reset();b.concat(e)}b.sigBytes=4*r;return b}});u.EvpKDF=function(d,l,n){return p.create(n).compute(d,  
l)}})();  
CryptoJS.lib.Cipher||function(u){var l=CryptoJS,d=l.lib,n=d.Base,p=d.WordArray,s=d.BufferedBlockAlgorithm,q=l.enc.Base64,w=l.algo.EvpKDF,v=d.Cipher=s.extend({cfg:n.extend(),createEncryptor:function(m,a){return this.create(this._ENC_XFORM_MODE,m,a)},createDecryptor:function(m,a){return this.create(this._DEC_XFORM_MODE,m,a)},init:function(m,a,b){this.cfg=this.cfg.extend(b);this._xformMode=m;this._key=a;this.reset()},reset:function(){s.reset.call(this);this._doReset()},process:function(a){this._append(a);return this._process()},  
finalize:function(a){a&&this._append(a);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(m){return{encrypt:function(f,b,e){return("string"==typeof b?c:a).encrypt(m,f,b,e)},decrypt:function(f,b,e){return("string"==typeof b?c:a).decrypt(m,f,b,e)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=l.mode={},x=function(a,f,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var e=0;e<b;e++)a[f+e]^=  
c[e]},r=(d.BlockCipherMode=n.extend({createEncryptor:function(a,f){return this.Encryptor.create(a,f)},createDecryptor:function(a,f){return this.Decryptor.create(a,f)},init:function(a,f){this._cipher=a;this._iv=f}})).extend();r.Encryptor=r.extend({processBlock:function(a,f){var b=this._cipher,c=b.blockSize;x.call(this,a,f,c);b.encryptBlock(a,f);this._prevBlock=a.slice(f,f+c)}});r.Decryptor=r.extend({processBlock:function(a,b){var c=this._cipher,e=c.blockSize,d=a.slice(b,b+e);c.decryptBlock(a,b);x.call(this,  
a,b,e);this._prevBlock=d}});b=b.CBC=r;r=(l.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,e=c<<24|c<<16|c<<8|c,d=[],l=0;l<c;l+=4)d.push(e);c=p.create(d,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:r}),reset:function(){v.reset.call(this);var a=this.cfg,c=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var b=a.createEncryptor;else b=a.createDecryptor,this._minBufferSize=1;this._mode=b.call(a,  
this,c&&c.words)},_doProcessBlock:function(a,c){this._mode.processBlock(a,c)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var c=this._process(!0)}else c=this._process(!0),a.unpad(c);return c},blockSize:4});var e=d.CipherParams=n.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(l.format={}).OpenSSL={stringify:function(a){var c=a.ciphertext;a=a.salt;return(a?p.create([1398893684,  
1701076831]).concat(a).concat(c):c).toString(q)},parse:function(a){a=q.parse(a);var c=a.words;if(1398893684==c[0]&&1701076831==c[1]){var b=p.create(c.slice(2,4));c.splice(0,4);a.sigBytes-=16}return e.create({ciphertext:a,salt:b})}},a=d.SerializableCipher=n.extend({cfg:n.extend({format:b}),encrypt:function(a,c,b,d){d=this.cfg.extend(d);var l=a.createEncryptor(b,d);c=l.finalize(c);l=l.cfg;return e.create({ciphertext:c,key:b,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},  
decrypt:function(a,c,b,e){e=this.cfg.extend(e);c=this._parse(c,e.format);return a.createDecryptor(b,e).finalize(c.ciphertext)},_parse:function(a,c){return"string"==typeof a?c.parse(a,this):a}}),l=(l.kdf={}).OpenSSL={execute:function(a,c,b,d){d||(d=p.random(8));a=w.create({keySize:c+b}).compute(a,d);b=p.create(a.words.slice(c),4*b);a.sigBytes=4*c;return e.create({key:a,iv:b,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:l}),encrypt:function(c,b,e,d){d=this.cfg.extend(d);e=d.kdf.execute(e,  
c.keySize,c.ivSize);d.iv=e.iv;c=a.encrypt.call(this,c,b,e.key,d);c.mixIn(e);return c},decrypt:function(c,b,e,d){d=this.cfg.extend(d);b=this._parse(b,d.format);e=d.kdf.execute(e,c.keySize,c.ivSize,b.salt);d.iv=e.iv;return a.decrypt.call(this,c,b,e.key,d)}})}();  
(function(){function u(b,a){var c=(this._lBlock>>>b^this._rBlock)&a;this._rBlock^=c;this._lBlock^=c<<b}function l(b,a){var c=(this._rBlock>>>b^this._lBlock)&a;this._lBlock^=c;this._rBlock^=c<<b}var d=CryptoJS,n=d.lib,p=n.WordArray,n=n.BlockCipher,s=d.algo,q=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4],w=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,  
55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32],v=[1,2,4,6,8,10,12,14,15,17,19,21,23,25,27,28],b=[{"0":8421888,268435456:32768,536870912:8421378,805306368:2,1073741824:512,1342177280:8421890,1610612736:8389122,1879048192:8388608,2147483648:514,2415919104:8389120,2684354560:33280,2952790016:8421376,3221225472:32770,3489660928:8388610,3758096384:0,4026531840:33282,134217728:0,402653184:8421890,671088640:33282,939524096:32768,1207959552:8421888,1476395008:512,1744830464:8421378,2013265920:2,  
2281701376:8389120,2550136832:33280,2818572288:8421376,3087007744:8389122,3355443200:8388610,3623878656:32770,3892314112:514,4160749568:8388608,1:32768,268435457:2,536870913:8421888,805306369:8388608,1073741825:8421378,1342177281:33280,1610612737:512,1879048193:8389122,2147483649:8421890,2415919105:8421376,2684354561:8388610,2952790017:33282,3221225473:514,3489660929:8389120,3758096385:32770,4026531841:0,134217729:8421890,402653185:8421376,671088641:8388608,939524097:512,1207959553:32768,1476395009:8388610,  
1744830465:2,2013265921:33282,2281701377:32770,2550136833:8389122,2818572289:514,3087007745:8421888,3355443201:8389120,3623878657:0,3892314113:33280,4160749569:8421378},{"0":1074282512,16777216:16384,33554432:524288,50331648:1074266128,67108864:1073741840,83886080:1074282496,100663296:1073758208,117440512:16,134217728:540672,150994944:1073758224,167772160:1073741824,184549376:540688,201326592:524304,218103808:0,234881024:16400,251658240:1074266112,8388608:1073758208,25165824:540688,41943040:16,58720256:1073758224,  
75497472:1074282512,92274688:1073741824,109051904:524288,125829120:1074266128,142606336:524304,159383552:0,176160768:16384,192937984:1074266112,209715200:1073741840,226492416:540672,243269632:1074282496,260046848:16400,268435456:0,285212672:1074266128,301989888:1073758224,318767104:1074282496,335544320:1074266112,352321536:16,369098752:540688,385875968:16384,402653184:16400,419430400:524288,436207616:524304,452984832:1073741840,469762048:540672,486539264:1073758208,503316480:1073741824,520093696:1074282512,  
276824064:540688,293601280:524288,310378496:1074266112,327155712:16384,343932928:1073758208,360710144:1074282512,377487360:16,394264576:1073741824,411041792:1074282496,427819008:1073741840,444596224:1073758224,461373440:524304,478150656:0,494927872:16400,511705088:1074266128,528482304:540672},{"0":260,1048576:0,2097152:67109120,3145728:65796,4194304:65540,5242880:67108868,6291456:67174660,7340032:67174400,8388608:67108864,9437184:67174656,10485760:65792,11534336:67174404,12582912:67109124,13631488:65536,  
14680064:4,15728640:256,524288:67174656,1572864:67174404,2621440:0,3670016:67109120,4718592:67108868,5767168:65536,6815744:65540,7864320:260,8912896:4,9961472:256,11010048:67174400,12058624:65796,13107200:65792,14155776:67109124,15204352:67174660,16252928:67108864,16777216:67174656,17825792:65540,18874368:65536,19922944:67109120,20971520:256,22020096:67174660,23068672:67108868,24117248:0,25165824:67109124,26214400:67108864,27262976:4,28311552:65792,29360128:67174400,30408704:260,31457280:65796,32505856:67174404,  
17301504:67108864,18350080:260,19398656:67174656,20447232:0,21495808:65540,22544384:67109120,23592960:256,24641536:67174404,25690112:65536,26738688:67174660,27787264:65796,28835840:67108868,29884416:67109124,30932992:67174400,31981568:4,33030144:65792},{"0":2151682048,65536:2147487808,131072:4198464,196608:2151677952,262144:0,327680:4198400,393216:2147483712,458752:4194368,524288:2147483648,589824:4194304,655360:64,720896:2147487744,786432:2151678016,851968:4160,917504:4096,983040:2151682112,32768:2147487808,  
98304:64,163840:2151678016,229376:2147487744,294912:4198400,360448:2151682112,425984:0,491520:2151677952,557056:4096,622592:2151682048,688128:4194304,753664:4160,819200:2147483648,884736:4194368,950272:4198464,1015808:2147483712,1048576:4194368,1114112:4198400,1179648:2147483712,1245184:0,1310720:4160,1376256:2151678016,1441792:2151682048,1507328:2147487808,1572864:2151682112,1638400:2147483648,1703936:2151677952,1769472:4198464,1835008:2147487744,1900544:4194304,1966080:64,2031616:4096,1081344:2151677952,  
1146880:2151682112,1212416:0,1277952:4198400,1343488:4194368,1409024:2147483648,1474560:2147487808,1540096:64,1605632:2147483712,1671168:4096,1736704:2147487744,1802240:2151678016,1867776:4160,1933312:2151682048,1998848:4194304,2064384:4198464},{"0":128,4096:17039360,8192:262144,12288:536870912,16384:537133184,20480:16777344,24576:553648256,28672:262272,32768:16777216,36864:537133056,40960:536871040,45056:553910400,49152:553910272,53248:0,57344:17039488,61440:553648128,2048:17039488,6144:553648256,  
10240:128,14336:17039360,18432:262144,22528:537133184,26624:553910272,30720:536870912,34816:537133056,38912:0,43008:553910400,47104:16777344,51200:536871040,55296:553648128,59392:16777216,63488:262272,65536:262144,69632:128,73728:536870912,77824:553648256,81920:16777344,86016:553910272,90112:537133184,94208:16777216,98304:553910400,102400:553648128,106496:17039360,110592:537133056,114688:262272,118784:536871040,122880:0,126976:17039488,67584:553648256,71680:16777216,75776:17039360,79872:537133184,  
83968:536870912,88064:17039488,92160:128,96256:553910272,100352:262272,104448:553910400,108544:0,112640:553648128,116736:16777344,120832:262144,124928:537133056,129024:536871040},{"0":268435464,256:8192,512:270532608,768:270540808,1024:268443648,1280:2097152,1536:2097160,1792:268435456,2048:0,2304:268443656,2560:2105344,2816:8,3072:270532616,3328:2105352,3584:8200,3840:270540800,128:270532608,384:270540808,640:8,896:2097152,1152:2105352,1408:268435464,1664:268443648,1920:8200,2176:2097160,2432:8192,  
2688:268443656,2944:270532616,3200:0,3456:270540800,3712:2105344,3968:268435456,4096:268443648,4352:270532616,4608:270540808,4864:8200,5120:2097152,5376:268435456,5632:268435464,5888:2105344,6144:2105352,6400:0,6656:8,6912:270532608,7168:8192,7424:268443656,7680:270540800,7936:2097160,4224:8,4480:2105344,4736:2097152,4992:268435464,5248:268443648,5504:8200,5760:270540808,6016:270532608,6272:270540800,6528:270532616,6784:8192,7040:2105352,7296:2097160,7552:0,7808:268435456,8064:268443656},{"0":1048576,  
16:33555457,32:1024,48:1049601,64:34604033,80:0,96:1,112:34603009,128:33555456,144:1048577,160:33554433,176:34604032,192:34603008,208:1025,224:1049600,240:33554432,8:34603009,24:0,40:33555457,56:34604032,72:1048576,88:33554433,104:33554432,120:1025,136:1049601,152:33555456,168:34603008,184:1048577,200:1024,216:34604033,232:1,248:1049600,256:33554432,272:1048576,288:33555457,304:34603009,320:1048577,336:33555456,352:34604032,368:1049601,384:1025,400:34604033,416:1049600,432:1,448:0,464:34603008,480:33554433,  
496:1024,264:1049600,280:33555457,296:34603009,312:1,328:33554432,344:1048576,360:1025,376:34604032,392:33554433,408:34603008,424:0,440:34604033,456:1049601,472:1024,488:33555456,504:1048577},{"0":134219808,1:131072,2:134217728,3:32,4:131104,5:134350880,6:134350848,7:2048,8:134348800,9:134219776,10:133120,11:134348832,12:2080,13:0,14:134217760,15:133152,2147483648:2048,2147483649:134350880,2147483650:134219808,2147483651:134217728,2147483652:134348800,2147483653:133120,2147483654:133152,2147483655:32,  
2147483656:134217760,2147483657:2080,2147483658:131104,2147483659:134350848,2147483660:0,2147483661:134348832,2147483662:134219776,2147483663:131072,16:133152,17:134350848,18:32,19:2048,20:134219776,21:134217760,22:134348832,23:131072,24:0,25:131104,26:134348800,27:134219808,28:134350880,29:133120,30:2080,31:134217728,2147483664:131072,2147483665:2048,2147483666:134348832,2147483667:133152,2147483668:32,2147483669:134348800,2147483670:134217728,2147483671:134219808,2147483672:134350880,2147483673:134217760,  
2147483674:134219776,2147483675:0,2147483676:133120,2147483677:2080,2147483678:131104,2147483679:134350848}],x=[4160749569,528482304,33030144,2064384,129024,8064,504,2147483679],r=s.DES=n.extend({_doReset:function(){for(var b=this._key.words,a=[],c=0;56>c;c++){var d=q[c]-1;a[c]=b[d>>>5]>>>31-d%32&1}b=this._subKeys=[];for(d=0;16>d;d++){for(var f=b[d]=[],l=v[d],c=0;24>c;c++)f[c/6|0]|=a[(w[c]-1+l)%28]<<31-c%6,f[4+(c/6|0)]|=a[28+(w[c+24]-1+l)%28]<<31-c%6;f[0]=f[0]<<1|f[0]>>>31;for(c=1;7>c;c++)f[c]>>>=  
4*(c-1)+3;f[7]=f[7]<<5|f[7]>>>27}a=this._invSubKeys=[];for(c=0;16>c;c++)a[c]=b[15-c]},encryptBlock:function(b,a){this._doCryptBlock(b,a,this._subKeys)},decryptBlock:function(b,a){this._doCryptBlock(b,a,this._invSubKeys)},_doCryptBlock:function(e,a,c){this._lBlock=e[a];this._rBlock=e[a+1];u.call(this,4,252645135);u.call(this,16,65535);l.call(this,2,858993459);l.call(this,8,16711935);u.call(this,1,1431655765);for(var d=0;16>d;d++){for(var f=c[d],n=this._lBlock,p=this._rBlock,q=0,r=0;8>r;r++)q|=b[r][((p^  
f[r])&x[r])>>>0];this._lBlock=p;this._rBlock=n^q}c=this._lBlock;this._lBlock=this._rBlock;this._rBlock=c;u.call(this,1,1431655765);l.call(this,8,16711935);l.call(this,2,858993459);u.call(this,16,65535);u.call(this,4,252645135);e[a]=this._lBlock;e[a+1]=this._rBlock},keySize:2,ivSize:2,blockSize:2});d.DES=n._createHelper(r);s=s.TripleDES=n.extend({_doReset:function(){var b=this._key.words;this._des1=r.createEncryptor(p.create(b.slice(0,2)));this._des2=r.createEncryptor(p.create(b.slice(2,4)));this._des3=  
r.createEncryptor(p.create(b.slice(4,6)))},encryptBlock:function(b,a){this._des1.encryptBlock(b,a);this._des2.decryptBlock(b,a);this._des3.encryptBlock(b,a)},decryptBlock:function(b,a){this._des3.decryptBlock(b,a);this._des2.encryptBlock(b,a);this._des1.decryptBlock(b,a)},keySize:6,ivSize:2,blockSize:2});d.TripleDES=n._createHelper(s)})();  

CryptoJS.mode.ECB = (function () {  
    var ECB = CryptoJS.lib.BlockCipherMode.extend();  
  
    ECB.Encryptor = ECB.extend({  
        processBlock: function (words, offset) {  
            this._cipher.encryptBlock(words, offset);  
        }  
    });  
  
    ECB.Decryptor = ECB.extend({  
        processBlock: function (words, offset) {  
            this._cipher.decryptBlock(words, offset);  
        }  
    });  
  
    return ECB;  
}());  

/*
 * CryptoJS v3.1.2 code.google.com/p/crypto-js (c) 2009-2013 by Jeff Mott. All
 * rights reserved. code.google.com/p/crypto-js/wiki/License
 */  
var CryptoJS=CryptoJS||function(s,p){var m={},l=m.lib={},n=function(){},r=l.Base={extend:function(b){n.prototype=this;var h=new n;b&&h.mixIn(b);h.hasOwnProperty("init")||(h.init=function(){h.$super.init.apply(this,arguments)});h.init.prototype=h;h.$super=this;return h},create:function(){var b=this.extend();b.init.apply(b,arguments);return b},init:function(){},mixIn:function(b){for(var h in b)b.hasOwnProperty(h)&&(this[h]=b[h]);b.hasOwnProperty("toString")&&(this.toString=b.toString)},clone:function(){return this.init.prototype.extend(this)}},  
q=l.WordArray=r.extend({init:function(b,h){b=this.words=b||[];this.sigBytes=h!=p?h:4*b.length},toString:function(b){return(b||t).stringify(this)},concat:function(b){var h=this.words,a=b.words,j=this.sigBytes;b=b.sigBytes;this.clamp();if(j%4)for(var g=0;g<b;g++)h[j+g>>>2]|=(a[g>>>2]>>>24-8*(g%4)&255)<<24-8*((j+g)%4);else if(65535<a.length)for(g=0;g<b;g+=4)h[j+g>>>2]=a[g>>>2];else h.push.apply(h,a);this.sigBytes+=b;return this},clamp:function(){var b=this.words,h=this.sigBytes;b[h>>>2]&=4294967295<<  
32-8*(h%4);b.length=s.ceil(h/4)},clone:function(){var b=r.clone.call(this);b.words=this.words.slice(0);return b},random:function(b){for(var h=[],a=0;a<b;a+=4)h.push(4294967296*s.random()|0);return new q.init(h,b)}}),v=m.enc={},t=v.Hex={stringify:function(b){var a=b.words;b=b.sigBytes;for(var g=[],j=0;j<b;j++){var k=a[j>>>2]>>>24-8*(j%4)&255;g.push((k>>>4).toString(16));g.push((k&15).toString(16))}return g.join("")},parse:function(b){for(var a=b.length,g=[],j=0;j<a;j+=2)g[j>>>3]|=parseInt(b.substr(j,  
2),16)<<24-4*(j%8);return new q.init(g,a/2)}},a=v.Latin1={stringify:function(b){var a=b.words;b=b.sigBytes;for(var g=[],j=0;j<b;j++)g.push(String.fromCharCode(a[j>>>2]>>>24-8*(j%4)&255));return g.join("")},parse:function(b){for(var a=b.length,g=[],j=0;j<a;j++)g[j>>>2]|=(b.charCodeAt(j)&255)<<24-8*(j%4);return new q.init(g,a)}},u=v.Utf8={stringify:function(b){try{return decodeURIComponent(escape(a.stringify(b)))}catch(g){throw Error("Malformed UTF-8 data");}},parse:function(b){return a.parse(unescape(encodeURIComponent(b)))}},  
g=l.BufferedBlockAlgorithm=r.extend({reset:function(){this._data=new q.init;this._nDataBytes=0},_append:function(b){"string"==typeof b&&(b=u.parse(b));this._data.concat(b);this._nDataBytes+=b.sigBytes},_process:function(b){var a=this._data,g=a.words,j=a.sigBytes,k=this.blockSize,m=j/(4*k),m=b?s.ceil(m):s.max((m|0)-this._minBufferSize,0);b=m*k;j=s.min(4*b,j);if(b){for(var l=0;l<b;l+=k)this._doProcessBlock(g,l);l=g.splice(0,b);a.sigBytes-=j}return new q.init(l,j)},clone:function(){var b=r.clone.call(this);  
b._data=this._data.clone();return b},_minBufferSize:0});l.Hasher=g.extend({cfg:r.extend(),init:function(b){this.cfg=this.cfg.extend(b);this.reset()},reset:function(){g.reset.call(this);this._doReset()},update:function(b){this._append(b);this._process();return this},finalize:function(b){b&&this._append(b);return this._doFinalize()},blockSize:16,_createHelper:function(b){return function(a,g){return(new b.init(g)).finalize(a)}},_createHmacHelper:function(b){return function(a,g){return(new k.HMAC.init(b,  
g)).finalize(a)}}});var k=m.algo={};return m}(Math);  
(function(s){function p(a,k,b,h,l,j,m){a=a+(k&b|~k&h)+l+m;return(a<<j|a>>>32-j)+k}function m(a,k,b,h,l,j,m){a=a+(k&h|b&~h)+l+m;return(a<<j|a>>>32-j)+k}function l(a,k,b,h,l,j,m){a=a+(k^b^h)+l+m;return(a<<j|a>>>32-j)+k}function n(a,k,b,h,l,j,m){a=a+(b^(k|~h))+l+m;return(a<<j|a>>>32-j)+k}for(var r=CryptoJS,q=r.lib,v=q.WordArray,t=q.Hasher,q=r.algo,a=[],u=0;64>u;u++)a[u]=4294967296*s.abs(s.sin(u+1))|0;q=q.MD5=t.extend({_doReset:function(){this._hash=new v.init([1732584193,4023233417,2562383102,271733878])},  
_doProcessBlock:function(g,k){for(var b=0;16>b;b++){var h=k+b,w=g[h];g[h]=(w<<8|w>>>24)&16711935|(w<<24|w>>>8)&4278255360}var b=this._hash.words,h=g[k+0],w=g[k+1],j=g[k+2],q=g[k+3],r=g[k+4],s=g[k+5],t=g[k+6],u=g[k+7],v=g[k+8],x=g[k+9],y=g[k+10],z=g[k+11],A=g[k+12],B=g[k+13],C=g[k+14],D=g[k+15],c=b[0],d=b[1],e=b[2],f=b[3],c=p(c,d,e,f,h,7,a[0]),f=p(f,c,d,e,w,12,a[1]),e=p(e,f,c,d,j,17,a[2]),d=p(d,e,f,c,q,22,a[3]),c=p(c,d,e,f,r,7,a[4]),f=p(f,c,d,e,s,12,a[5]),e=p(e,f,c,d,t,17,a[6]),d=p(d,e,f,c,u,22,a[7]),  
c=p(c,d,e,f,v,7,a[8]),f=p(f,c,d,e,x,12,a[9]),e=p(e,f,c,d,y,17,a[10]),d=p(d,e,f,c,z,22,a[11]),c=p(c,d,e,f,A,7,a[12]),f=p(f,c,d,e,B,12,a[13]),e=p(e,f,c,d,C,17,a[14]),d=p(d,e,f,c,D,22,a[15]),c=m(c,d,e,f,w,5,a[16]),f=m(f,c,d,e,t,9,a[17]),e=m(e,f,c,d,z,14,a[18]),d=m(d,e,f,c,h,20,a[19]),c=m(c,d,e,f,s,5,a[20]),f=m(f,c,d,e,y,9,a[21]),e=m(e,f,c,d,D,14,a[22]),d=m(d,e,f,c,r,20,a[23]),c=m(c,d,e,f,x,5,a[24]),f=m(f,c,d,e,C,9,a[25]),e=m(e,f,c,d,q,14,a[26]),d=m(d,e,f,c,v,20,a[27]),c=m(c,d,e,f,B,5,a[28]),f=m(f,c,  
d,e,j,9,a[29]),e=m(e,f,c,d,u,14,a[30]),d=m(d,e,f,c,A,20,a[31]),c=l(c,d,e,f,s,4,a[32]),f=l(f,c,d,e,v,11,a[33]),e=l(e,f,c,d,z,16,a[34]),d=l(d,e,f,c,C,23,a[35]),c=l(c,d,e,f,w,4,a[36]),f=l(f,c,d,e,r,11,a[37]),e=l(e,f,c,d,u,16,a[38]),d=l(d,e,f,c,y,23,a[39]),c=l(c,d,e,f,B,4,a[40]),f=l(f,c,d,e,h,11,a[41]),e=l(e,f,c,d,q,16,a[42]),d=l(d,e,f,c,t,23,a[43]),c=l(c,d,e,f,x,4,a[44]),f=l(f,c,d,e,A,11,a[45]),e=l(e,f,c,d,D,16,a[46]),d=l(d,e,f,c,j,23,a[47]),c=n(c,d,e,f,h,6,a[48]),f=n(f,c,d,e,u,10,a[49]),e=n(e,f,c,d,  
C,15,a[50]),d=n(d,e,f,c,s,21,a[51]),c=n(c,d,e,f,A,6,a[52]),f=n(f,c,d,e,q,10,a[53]),e=n(e,f,c,d,y,15,a[54]),d=n(d,e,f,c,w,21,a[55]),c=n(c,d,e,f,v,6,a[56]),f=n(f,c,d,e,D,10,a[57]),e=n(e,f,c,d,t,15,a[58]),d=n(d,e,f,c,B,21,a[59]),c=n(c,d,e,f,r,6,a[60]),f=n(f,c,d,e,z,10,a[61]),e=n(e,f,c,d,j,15,a[62]),d=n(d,e,f,c,x,21,a[63]);b[0]=b[0]+c|0;b[1]=b[1]+d|0;b[2]=b[2]+e|0;b[3]=b[3]+f|0},_doFinalize:function(){var a=this._data,k=a.words,b=8*this._nDataBytes,h=8*a.sigBytes;k[h>>>5]|=128<<24-h%32;var l=s.floor(b/  
4294967296);k[(h+64>>>9<<4)+15]=(l<<8|l>>>24)&16711935|(l<<24|l>>>8)&4278255360;k[(h+64>>>9<<4)+14]=(b<<8|b>>>24)&16711935|(b<<24|b>>>8)&4278255360;a.sigBytes=4*(k.length+1);this._process();a=this._hash;k=a.words;for(b=0;4>b;b++)h=k[b],k[b]=(h<<8|h>>>24)&16711935|(h<<24|h>>>8)&4278255360;return a},clone:function(){var a=t.clone.call(this);a._hash=this._hash.clone();return a}});r.MD5=t._createHelper(q);r.HmacMD5=t._createHmacHelper(q)})(Math);  

	
	/** **encrpty** */
	(function(window, document, undefined) {
		/*
		 * Object ES5 extend
		 */
		if (!Object.create) {
			Object.create = function (o) {
				if (arguments.length > 1) {
					throw new Error('Object.create implementation only accepts the first parameter.');
				}
				function F() {}
				F.prototype = o;
				return new F();
			};
		}
		
		if (!Object.keys) {
			Object.keys = function(o) {
				if (o !== Object(o)) {
					throw new TypeError('Object.keys called on a non-object');
				}
				var k=[], p;
				for (p in o) {
					if (Object.prototype.hasOwnProperty.call(o,p)) {
						k.push(p);
					}
				}
				return k;
			};
		}
		
		/*
		 * Date ES5 extend
		 */
		if (!Date.now) {
			Date.now = function now() {
				return (new Date).valueOf();
			};
		}
		
		/*
		 * Function ES5 extend
		 */
		if (!Function.prototype.bind) {
		  	Function.prototype.bind = function (oThis) {
				if (typeof this !== "function") {
			  		// closest thing possible to the ECMAScript 5 internal
					// IsCallable function
			  		throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
				}
		
				var aArgs = Array.prototype.slice.call(arguments, 1), 
					fToBind = this, 
					fNOP = function () {},
					fBound = function () {
				  		return fToBind.apply(this instanceof fNOP && oThis
										 ? this
										 : oThis || window,
									   aArgs.concat(Array.prototype.slice.call(arguments)));
					};
		
				fNOP.prototype = this.prototype;
				fBound.prototype = new fNOP();
		
				return fBound;
		  	};
		}
		
		/*
		 * String ES5 extend
		 */
		if(!String.prototype.trim) {
			String.prototype.trim = function () {
				return this.replace(/^\s+|\s+$/g,'');
			};
		}
		
		/*
		 * Array ES5 extend
		 */
		if(!Array.isArray) {
			Array.isArray = function (vArg) {
				return Object.prototype.toString.call(vArg) === "[object Array]";
			};
		}
		
		if (typeof Array.prototype.forEach != "function") {
		  	Array.prototype.forEach = function (fn, scope) {
				var i, len;
				for (i = 0, len = this.length; i < len; ++i) {
					if (i in this) {
						fn.call(scope, this[i], i, this);
					}
				}
	    	};
		}
		
		if (typeof Array.prototype.map != "function") {
		  Array.prototype.map = function (fn, context) {
			var arr = [];
			if (typeof fn === "function") {
			  for (var k = 0, length = this.length; k < length; k++) {
				  arr.push(fn.call(context, this[k], k, this));
			  }
			}
			return arr;
		  };
		}
		
		if (typeof Array.prototype.filter != "function") {
		  Array.prototype.filter = function (fn, context) {
			var arr = [];
			if (typeof fn === "function") {
			  for (var k = 0, length = this.length; k < length; k++) {
				  fn.call(context, this[k], k, this) && arr.push(this[k]);
			  }
			}
			return arr;
		  };
		}
		
		if (typeof Array.prototype.some != "function") {
		  Array.prototype.some = function (fn, context) {
			var passed = false;
			if (typeof fn === "function") {
			  for (var k = 0, length = this.length; k < length; k++) {
				  if (passed === true) break;
				  passed = !!fn.call(context, this[k], k, this);
			  }
			}
			return passed;
		  };
		}
		
		if (typeof Array.prototype.every != "function") {
		  Array.prototype.every = function (fn, context) {
			var passed = true;
			if (typeof fn === "function") {
			  for (var k = 0, length = this.length; k < length; k++) {
				  if (passed === false) break;
				  passed = !!fn.call(context, this[k], k, this);
			  }
			}
			return passed;
		  };
		}
		
		if (typeof Array.prototype.indexOf != "function") {
		  Array.prototype.indexOf = function (searchElement, fromIndex) {
			var index = -1;
			fromIndex = fromIndex * 1 || 0;
		
			for (var k = 0, length = this.length; k < length; k++) {
			  if (k >= fromIndex && this[k] === searchElement) {
				  index = k;
				  break;
			  }
			}
			return index;
		  };
		}
		
		if (typeof Array.prototype.lastIndexOf != "function") {
		  Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
			var index = -1, length = this.length;
			fromIndex = fromIndex * 1 || length - 1;
		
			for (var k = length - 1; k > -1; k-=1) {
				if (k <= fromIndex && this[k] === searchElement) {
					index = k;
					break;
				}
			}
			return index;
		  };
		}
		
		if (typeof Array.prototype.reduce != "function") {
		  Array.prototype.reduce = function (callback, initialValue ) {
			 var previous = initialValue, k = 0, length = this.length;
			 if (typeof initialValue === "undefined") {
				previous = this[0];
				k = 1;
			 }
			 
			if (typeof callback === "function") {
			  for (k; k < length; k++) {
				 this.hasOwnProperty(k) && (previous = callback(previous, this[k], k, this));
			  }
			}
			return previous;
		  };
		}
		
		if (typeof Array.prototype.reduceRight != "function") {
		  Array.prototype.reduceRight = function (callback, initialValue ) {
			var length = this.length, k = length - 1, previous = initialValue;
			if (typeof initialValue === "undefined") {
				previous = this[length - 1];
				k--;
			}
			if (typeof callback === "function") {
			   for (k; k > -1; k-=1) {          
				  this.hasOwnProperty(k) && (previous = callback(previous, this[k], k, this));
			   }
			}
			return previous;
		  };
		}
		
		/**
		 * dom method that extend
		 */
//		var oDomExtend = {
//			// selector realtive
//			querySelector: function(selector) {
//				return oDomExtend.querySelectorAll.call(this, selector)[0] || null;
//			},
//			querySelectorAll: function(selector) {
//				return fDomExtend(Sizzle(selector, this));
//			},
//			getElementsByClassName: function(classNames) {
//				return this.querySelectorAll("." + classNames.trim().replace(/\s+/, "."));
//			},
//			// addEventListener
//			addEventListener: function(eventType, funcHandle, useCapture) {
//				var element = this, eventStoreType = '';
//				if (eventType == "input") { eventType = "propertychange"; }
//				if (typeof funcHandle != "function") return;
//				// some compatibility deal
//				var eventHandle = function(event) {
//					event = event || window.event || {};
//					
//					if (!event.target) event.target = event.srcElement;	
//					if (!event.preventDefault) event.preventDefault = function() {
//						event.returnValue = false;
//					};
//					
//					if (eventType == "propertychange") {
//						if (event.propertyName !== "value" || element.r_oldvalue === element.value) return;
//						element.r_oldvalue = element.value;
//					} 
//					return funcHandle.call(element, event || {});
//				};
//				eventHandle.initFuncHandle = funcHandle;
//				
//				// event bind
//				element.attachEvent("on" + eventType, eventHandle);
//				
//				// event store
//				if (element["event" + eventType]) {
//					element["event" + eventType].push(eventHandle);
//				} else {
//					element["event" + eventType] = [eventHandle];
//				}			
//			},
//			dispatchEvent: function(event) {
//				var eventType = event && event.type;			
//				if (eventType && this["event" + eventType]) {
//					event.target = this;
//					this["event" + eventType].forEach(function(eventHandle) {
//						event.timeStamp = Date.now();
//						eventHandle.call(this, event);
//					}.bind(this));
//				}			
//			},
//			removeEventListener: function(eventType, funcHandle, useCapture) {			
//				var arrEventStore = this["event" + eventType];
//				if (Array.isArray(arrEventStore)) {
//					this["event" + eventType] = arrEventStore.filter(function(eventHandle) {
//						if (eventHandle.initFuncHandle === funcHandle) {
//							this.detachEvent("on" + eventType, eventHandle);
//							return false;
//						}					
//						return true;
//					}.bind(this));
//				}	
//			}
//			
//		};
		
//		var fDomExtend = function(collection) {
//			// collection extend some dom method
//			collection.forEach(function(element, index) {
//				for (var key in oDomExtend) {
//					element[key] = oDomExtend[key].bind(element);
//				}
//			});
//			return collection;
//		};
		
		/*
		 * document.querySelector, document.querySelectorAll
		 */
//		document.querySelector = function(selector) {
//			return document.querySelectorAll(selector)[0] || null;
//		};
//		document.querySelectorAll = function(selector) {
//			var collection = Sizzle(selector);		
//			return fDomExtend(collection);	
//		};
		/*
		 * getElementsByClassName
		 */
//		if (!document.getElementsByClassName) {
//			document.getElementsByClassName = function(classNames) {			
//				return oDomExtend.getElementsByClassName.call(document, classNames);
//			};
//		}
		/*
		 * addEventListener include event of "input"
		 */
//		if (typeof document.addEventListener == "undefined") {
//			[window, document].forEach(function(global) {
//				global.addEventListener = function(eventType, funcHandle, useCapture) {
//					oDomExtend.addEventListener.call(global, eventType, funcHandle, useCapture);
//				};
//				global.dispatchEvent = function(event) {
//					oDomExtend.dispatchEvent.call(global, event);
//				};
//				global.removeEventListener = function() {
//					if (typeof(eventType) != "undefined") 
//						oDomExtend.removeEventListener.call(global, eventType, funcHandle, useCapture);	
//				};
//			});	
//		}
		if (!document.createEvent) {
			document.createEvent = function(type) {
				var event = {};
				switch (type) {
					case "Event": case "Events": case "HTMLEvents": {
						event = {
							initEvent: function(eventType, canBubble, cancelable) {
								event.type = eventType;
								event.canBubble = canBubble || false;
								event.cancelable = cancelable || false;
								delete(event.initEvent);
							},
							bubbles: false,
							cancelBubble: false,
							cancelable: false,
							clipboardData: undefined,
							currentTarget: null,
							defaultPrevented: false,
							eventPhase: 0,
							returnValue: true,
							srcElement: null,
							target: null,
							timeStamp: Date.now(),
							type: ""	
						};					
						
						break;	
					}
					case "MouseEvents": {					
						event = {
							initMouseEvent: function(eventType, canBubble, cancelable, view, 
								detail, screenX, screenY, clientX, clientY,
								ctrlKey, altKey, shiftKey, metaKey,
								button, relatedTarget
							) {
								event.type = eventType;
								event.canBubble = canBubble || false;
								event.cancelable = cancelable || false;
								event.view = view || null;
								event.screenX = screenX || 0;
								event.screenY = screenY || 0;
								event.clientX = clientX || 0;
								event.clientY = clientY || 0;
								event.ctrlKey = ctrlKey || false;
								event.altKey = altKey || false;
								event.shiftKey = shiftKey || false;
								event.metaKey = metaKey || false;
								event.button = button || 0;
								event.relatedTarget = relatedTarget || null;
								delete(event.initMouseEvent);
							},
							altKey: false,
							bubbles: false,
							button: 0,
							cancelBubble: false,
							cancelable: false,
							charCode: 0,
							clientX: 0,
							clientY: 0,
							clipboardData: undefined,
							ctrlKey: false,
							currentTarget: null,
							dataTransfer: null,
							defaultPrevented: false,
							detail: 0,
							eventPhase: 0,
							fromElement: null,
							keyCode: 0,
							layerX: 0,
							layerY: 0,
							metaKey: false,
							offsetX: 0,
							offsetY: 0,
							pageX: 0,
							pageY: 0,
							relatedTarget: null,
							returnValue: true,
							screenX: 0,
							screenY: 0,
							shiftKey: false,
							srcElement: null,
							target: null,
							timeStamp: Date.now(),
							toElement: null,
							type: "",
							view: null,
							webkitMovementX: 0,
							webkitMovementY: 0,
							which: 0,
							x: 0,
							y: 0
						};
						
						break;
					}
					case "UIEvents": {					
						event = {
							initUIEvent: function(eventType, canBubble, cancelable, view, detail) {
								event.type = eventType;
								event.canBubble = canBubble || false;
								event.cancelable = cancelable || false;
								event.view = view || null;
								event.detail = detail || 0;
								delete(event.initUIEvent);
							},
							bubbles: false,
							cancelBubble: false,
							cancelable: false,
							charCode: 0,
							clipboardData: undefined,
							currentTarget: null,
							defaultPrevented: false,
							detail: 0,
							eventPhase: 0,
							keyCode: 0,
							layerX: 0,
							layerY: 0,
							pageX: 0,
							pageY: 0,
							returnValue: true,
							srcElement: null,
							target: null,
							timeStamp: Date.now(),
							type: "",
							view: null,
							which: 0	
						};					
						break;
					}
					default: {
						throw new TypeError("NotSupportedError: The implementation did not support the requested type of object or operation.");	
					}
				}
				return event;
			};		
		}
		
		/**
		 * onhashchange
		 */
		// exit if the browser implements that event
		if (!("addEventListener" in document.createElement("div"))) {
			var location = window.location,
				oldURL = location.href,
				oldHash = location.hash;
			
			// check the location hash on a 100ms interval
			setInterval(function() {
				var newURL = location.href,
				  newHash = location.hash;
			
				// if the hash has changed and a handler has been bound...
				if ( newHash != oldHash && typeof window.onhashchange === "function" ) {
				  // execute the handler
				  window.onhashchange({
					type: "hashchange",
					oldURL: oldURL,
					newURL: newURL
				  });
			
				  oldURL = newURL;
				  oldHash = newHash;
				}
			 }, 100);
		}
		
		/**
		 * getComputedStyle
		 */
		if (typeof window.getComputedStyle !== "function") {
			window.getComputedStyle = function(el, pseudo) {
				var oStyle = {};
				var oCurrentStyle = el.currentStyle || {};
				for (var key in oCurrentStyle) {
					oStyle[key] = oCurrentStyle[key];
				}
				 
				oStyle.styleFloat = oStyle.cssFloat;
				 
	            oStyle.getPropertyValue = function(prop) {
					// return oCurrentStyle.getAttribute(prop) || null; // IE6
					// do
					// not support "key-key" but "keyKey"
					var re = /(\-([a-z]){1})/g;
					if (prop == 'float') prop = 'styleFloat';
					if (re.test(prop)) {
						prop = prop.replace(re, function () {
							return arguments[2].toUpperCase();
						});
					}
					return el.currentStyle[prop] ? el.currentStyle[prop] : null;
				}
				return oStyle;
			}
		}
		
	})(window, document);

	/*
	 * ! Sizzle CSS Selector Engine v@VERSION http://sizzlejs.com/
	 * 
	 * Copyright 2013 jQuery Foundation, Inc. and other contributors Released
	 * under the MIT license http://jquery.org/license
	 * 
	 * Date: @DATE
	 */
	(function( window ) {

	var i,
		support,
		cachedruns,
		Expr,
		getText,
		isXML,
		compile,
		outermostContext,
		sortInput,
		hasDuplicate,

		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,

		// Instance-specific data
		expando = "sizzle" + -(new Date()),
		preferredDoc = window.document,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},

		// General-purpose constants
		strundefined = typeof undefined,
		MAX_NEGATIVE = 1 << 31,

		// Instance methods
		hasOwn = ({}).hasOwnProperty,
		arr = [],
		pop = arr.pop,
		push_native = arr.push,
		push = arr.push,
		slice = arr.slice,
		// Use a stripped-down indexOf if we can't use a native one
		indexOf = arr.indexOf || function( elem ) {
			var i = 0,
				len = this.length;
			for ( ; i < len; i++ ) {
				if ( this[i] === elem ) {
					return i;
				}
			}
			return -1;
		},

		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

		// Regular expressions

		// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",
		// http://www.w3.org/TR/css3-syntax/#characters
		characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

		// Loosely modeled on CSS identifier characters
		// An unquoted value should be a CSS identifier
		// http://www.w3.org/TR/css3-selectors/#attribute-selectors
		// Proper syntax:
		// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = characterEncoding.replace( "w", "w#" ),

		// Acceptable operators
		// http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
			"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

		// Prefer arguments quoted,
		// then not containing pseudos/brackets,
		// then attribute selectors/non-parenthetical expressions,
		// then anything else
		// These preferences are here to reduce the number of selectors
		// needing tokenize in the PSEUDO preFilter
		pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

		// Leading and non-escaped trailing whitespace, capturing some
		// non-whitespace characters preceding the latter
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

		rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),

		matchExpr = {
			"ID": new RegExp( "^#(" + characterEncoding + ")" ),
			"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
			"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
				"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
				"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
				whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},

		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,

		rnative = /^[^{]+\{\s*\[native \w/,

		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

		rsibling = /[+~]/,
		rescape = /'|\\/g,

		// CSS escapes
		// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
		funescape = function( _, escaped, escapedWhitespace ) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ?
				escaped :
				high < 0 ?
					// BMP codepoint
					String.fromCharCode( high + 0x10000 ) :
					// Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		};

	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			(arr = slice.call( preferredDoc.childNodes )),
			preferredDoc.childNodes
		);
		// Support: Android<4.0
		// Detect silently failing push.apply
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?

			// Leverage slice if possible
			function( target, els ) {
				push_native.apply( target, slice.call(els) );
			} :

			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;
				// Can't trust NodeList.length
				while ( (target[j++] = els[i++]) ) {}
				target.length = j - 1;
			}
		};
	}

	function Sizzle( selector, context, results, seed ) {
		var match, elem, m, nodeType,
			// QSA vars
			i, groups, old, nid, newContext, newSelector;

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}

		context = context || document;
		results = results || [];

		if ( !selector || typeof selector !== "string" ) {
			return results;
		}

		if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
			return [];
		}

		if ( documentIsHTML && !seed ) {

			// Shortcuts
			if ( (match = rquickExpr.exec( selector )) ) {
				// Speed-up: Sizzle("#ID")
				if ( (m = match[1]) ) {
					if ( nodeType === 9 ) {
						elem = context.getElementById( m );
						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document (jQuery
						// #6963)
						if ( elem && elem.parentNode ) {
							// Handle the case where IE, Opera, and Webkit
							// return
							// items
							// by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}
					} else {
						// Context is not a document
						if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
							contains( context, elem ) && elem.id === m ) {
							results.push( elem );
							return results;
						}
					}

				// Speed-up: Sizzle("TAG")
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Speed-up: Sizzle(".CLASS")
				} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// QSA path
			if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
				nid = old = expando;
				newContext = context;
				newSelector = nodeType === 9 && selector;

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the
				// technique)
				// IE 8 doesn't work on object elements
				if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					groups = tokenize( selector );

					if ( (old = context.getAttribute("id")) ) {
						nid = old.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", nid );
					}
					nid = "[id='" + nid + "'] ";

					i = groups.length;
					while ( i-- ) {
						groups[i] = nid + toSelector( groups[i] );
					}
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
					newSelector = groups.join(",");
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch(qsaError) {
					} finally {
						if ( !old ) {
							context.removeAttribute("id");
						}
					}
				}
			}
		}

		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}

	/**
	 * Create key-value caches of limited size
	 * 
	 * @returns {Function(string, Object)} Returns the Object data after storing
	 *          it on itself with property name the (space-suffixed) string and
	 *          (if the cache is larger than Expr.cacheLength) deleting the
	 *          oldest entry
	 */
	function createCache() {
		var keys = [];

		function cache( key, value ) {
			// Use (key + " ") to avoid collision with native prototype
			// properties
			// (see Issue #157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return (cache[ key + " " ] = value);
		}
		return cache;
	}

	/**
	 * Mark a function for special use by Sizzle
	 * 
	 * @param {Function}
	 *            fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}

	/**
	 * Support testing using an element
	 * 
	 * @param {Function}
	 *            fn Passed the created div and expects a boolean result
	 */
	function assert( fn ) {
		var div = document.createElement("div");

		try {
			return !!fn( div );
		} catch (e) {
			return false;
		} finally {
			// Remove from its parent by default
			if ( div.parentNode ) {
				div.parentNode.removeChild( div );
			}
			// release memory in IE
			div = null;
		}
	}

	/**
	 * Adds the same handler for all of the specified attrs
	 * 
	 * @param {String}
	 *            attrs Pipe-separated list of attributes
	 * @param {Function}
	 *            handler The method that will be applied
	 */
	function addHandle( attrs, handler ) {
		var arr = attrs.split("|"),
			i = attrs.length;

		while ( i-- ) {
			Expr.attrHandle[ arr[i] ] = handler;
		}
	}

	/**
	 * Checks document order of two siblings
	 * 
	 * @param {Element}
	 *            a
	 * @param {Element}
	 *            b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if
	 *          a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				( ~b.sourceIndex || MAX_NEGATIVE ) -
				( ~a.sourceIndex || MAX_NEGATIVE );

		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}

		// Check if b follows a
		if ( cur ) {
			while ( (cur = cur.nextSibling) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}

		return a ? 1 : -1;
	}

	/**
	 * Returns a function to use in pseudos for input types
	 * 
	 * @param {String}
	 *            type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for buttons
	 * 
	 * @param {String}
	 *            type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for positionals
	 * 
	 * @param {Function}
	 *            fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction(function( argument ) {
			argument = +argument;
			return markFunction(function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;

				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ (j = matchIndexes[i]) ] ) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}

	/**
	 * Checks a node for validity as a Sizzle context
	 * 
	 * @param {Element|Object=}
	 *            context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise
	 *          a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== strundefined && context;
	}

	// Expose support vars for convenience
	support = Sizzle.support = {};

	/**
	 * Detects XML nodes
	 * 
	 * @param {Element|Object}
	 *            elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */
	isXML = Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = elem && (elem.ownerDocument || elem).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};

	/**
	 * Sets document-related variables once based on the current document
	 * 
	 * @param {Element|Object}
	 *            [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var hasCompare,
			doc = node ? node.ownerDocument || node : preferredDoc,
			parent = doc.defaultView;

		// If no document and documentElement is available, return
		if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}

		// Set our document
		document = doc;
		docElem = doc.documentElement;

		// Support tests
		documentIsHTML = !isXML( doc );

		// Support: IE>8
		// If iframe document is assigned to "document" variable and if iframe
		// has
		// been reloaded,
		// IE will throw "permission denied" error when accessing "document"
		// variable, see jQuery #13936
		// IE6-8 do not support the defaultView property so parent will be
		// undefined
		if ( parent && parent !== parent.top ) {
			// IE11 does not have attachEvent, so all must suffer
			if ( parent.addEventListener ) {
				parent.addEventListener( "unload", function() {
					setDocument();
				}, false );
			} else if ( parent.attachEvent ) {
				parent.attachEvent( "onunload", function() {
					setDocument();
				});
			}
		}

		/*
		 * Attributes
		 * ----------------------------------------------------------------------
		 */

		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert(function( div ) {
			div.className = "i";
			return !div.getAttribute("className");
		});

		/***********************************************************************
		 * getElement(s)By
		 * ----------------------------------------------------------------------
		 */

		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function( div ) {
			div.appendChild( doc.createComment("") );
			return !div.getElementsByTagName("*").length;
		});

		// Check if getElementsByClassName can be trusted
		support.getElementsByClassName = rnative.test( doc.getElementsByClassName ) && assert(function( div ) {
			div.innerHTML = "<div class='a'></div><div class='a i'></div>";

			// Support: Safari<4
			// Catch class over-caching
			div.firstChild.className = "i";
			// Support: Opera<10
			// Catch gEBCN failure to find non-leading classes
			return div.getElementsByClassName("i").length === 2;
		});

		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programatically-set
		// names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function( div ) {
			docElem.appendChild( div ).id = expando;
			return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
		});

		// ID find and filter
		if ( support.getById ) {
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
					var m = context.getElementById( id );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					return m && m.parentNode ? [m] : [];
				}
			};
			Expr.filter["ID"] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute("id") === attrId;
				};
			};
		} else {
			// Support: IE6/7
			// getElementById is not reliable as a find shortcut
			delete Expr.find["ID"];

			Expr.filter["ID"] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};
		}

		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== strundefined ) {
					return context.getElementsByTagName( tag );
				}
			} :
			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,
					results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					while ( (elem = results[i++]) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			};

		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
			if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};

		/*
		 * QSA/matchesSelector
		 * ----------------------------------------------------------------------
		 */

		// QSA and matchesSelector support

		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];

		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE
		// error
		// See http://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];

		if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function( div ) {
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// http://bugs.jquery.com/ticket/12359
				div.innerHTML = "<select t=''><option selected=''></option></select>";

				// Support: IE8, Opera 10-12
				// Nothing should be selected when empty strings follow ^= or $=
				// or
				// *=
				if ( div.querySelectorAll("[t^='']").length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}

				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !div.querySelectorAll("[selected]").length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}

				// Webkit/Opera - :checked should return selected option
				// elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":checked").length ) {
					rbuggyQSA.push(":checked");
				}
			});

			assert(function( div ) {
				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML
				// assignment
				var input = doc.createElement("input");
				input.setAttribute( "type", "hidden" );
				div.appendChild( input ).setAttribute( "name", "D" );

				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if ( div.querySelectorAll("[name=d]").length ) {
					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
				}

				// FF 3.5 - :enabled/:disabled and hidden elements (hidden
				// elements
				// are still enabled)
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":enabled").length ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}

				// Opera 10-11 does not throw on post-comma invalid pseudos
				div.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}

		if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector) )) ) {

			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( div, "div" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( div, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			});
		}

		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

		/*
		 * Contains
		 * ----------------------------------------------------------------------
		 */
		hasCompare = rnative.test( docElem.compareDocumentPosition );

		// Element contains another
		// Purposefully does not implement inclusive descendent
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test( docElem.contains ) ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				));
			} :
			function( a, b ) {
				if ( b ) {
					while ( (b = b.parentNode) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};

		/*
		 * Sorting
		 * ----------------------------------------------------------------------
		 */

		// Document order sorting
		sortOrder = hasCompare ?
		function( a, b ) {

			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			// Sort on method existence if only one input has
			// compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}

			// Calculate position if both inputs belong to the same document
			compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :

				// Otherwise we know they are disconnected
				1;

			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred
				// document
				if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		} :
		function( a, b ) {
			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];

			// Parentless nodes are either documents or disconnected
			if ( !aup || !bup ) {
				return a === doc ? -1 :
					b === doc ? 1 :
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;

			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}

			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( (cur = cur.parentNode) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( (cur = cur.parentNode) ) {
				bp.unshift( cur );
			}

			// Walk down the tree looking for a discrepancy
			while ( ap[i] === bp[i] ) {
				i++;
			}

			return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[i], bp[i] ) :

				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 :
				bp[i] === preferredDoc ? 1 :
				0;
		};

		return doc;
	};

	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};

	Sizzle.matchesSelector = function( elem, expr ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		// Make sure that attribute selectors are quoted
		expr = expr.replace( rattributeQuotes, "='$1']" );

		if ( support.matchesSelector && documentIsHTML &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

			try {
				var ret = matches.call( elem, expr );

				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a
						// document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch(e) {}
		}

		return Sizzle( expr, document, null, [elem] ).length > 0;
	};

	Sizzle.contains = function( context, elem ) {
		// Set document vars if needed
		if ( ( context.ownerDocument || context ) !== document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};

	Sizzle.attr = function( elem, name ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		var fn = Expr.attrHandle[ name.toLowerCase() ],
			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;

		return val !== undefined ?
			val :
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				(val = elem.getAttributeNode(name)) && val.specified ?
					val.value :
					null;
	};

	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};

	/**
	 * Document sorting and removing duplicates
	 * 
	 * @param {ArrayLike}
	 *            results
	 */
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;

		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			while ( (elem = results[i++]) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}

		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;

		return results;
	};

	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * 
	 * @param {Array|Element}
	 *            elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery
			// #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes

		return ret;
	};

	Expr = Sizzle.selectors = {

		// Can be adjusted by the user
		cacheLength: 50,

		createPseudo: markFunction,

		match: matchExpr,

		attrHandle: {},

		find: {},

		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},

		preFilter: {
			"ATTR": function( match ) {
				match[1] = match[1].replace( runescape, funescape );

				// Move the given value to match[3] whether quoted or unquoted
				match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

				if ( match[2] === "~=" ) {
					match[3] = " " + match[3] + " ";
				}

				return match.slice( 0, 4 );
			},

			"CHILD": function( match ) {
				/*
				 * matches from matchExpr["CHILD"] 1 type (only|nth|...) 2 what
				 * (child|of-type) 3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				 * 4 xn-component of xn+y argument ([+-]?\d*n|) 5 sign of
				 * xn-component 6 x of xn-component 7 sign of y-component 8 y of
				 * y-component
				 */
				match[1] = match[1].toLowerCase();

				if ( match[1].slice( 0, 3 ) === "nth" ) {
					// nth-* requires argument
					if ( !match[3] ) {
						Sizzle.error( match[0] );
					}

					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
					match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

				// other types prohibit arguments
				} else if ( match[3] ) {
					Sizzle.error( match[0] );
				}

				return match;
			},

			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[5] && match[2];

				if ( matchExpr["CHILD"].test( match[0] ) ) {
					return null;
				}

				// Accept quoted arguments as-is
				if ( match[3] && match[4] !== undefined ) {
					match[2] = match[4];

				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

					// excess is a negative index
					match[0] = match[0].slice( 0, excess );
					match[2] = unquoted.slice( 0, excess );
				}

				// Return only captures needed by the pseudo filter method (type
				// and
				// argument)
				return match.slice( 0, 3 );
			}
		},

		filter: {

			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() { return true; } :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},

			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];

				return pattern ||
					(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
					classCache( className, function( elem ) {
						return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
					});
			},

			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );

					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}

					result += "";

					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
				};
			},

			"CHILD": function( type, what, argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";

				return first === 1 && last === 0 ?

					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :

					function( elem, context, xml ) {
						var cache, outerCache, node, diff, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType;

						if ( parent ) {

							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( (node = node[ dir ]) ) {
										if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
											return false;
										}
									}
									// Reverse direction for :only-* (if we
									// haven't
									// yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}

							start = [ forward ? parent.firstChild : parent.lastChild ];

							// non-xml :nth-child(...) stores cache data on
							// `parent`
							if ( forward && useCache ) {
								// Seek `elem` from a previously-cached index
								outerCache = parent[ expando ] || (parent[ expando ] = {});
								cache = outerCache[ type ] || [];
								nodeIndex = cache[0] === dirruns && cache[1];
								diff = cache[0] === dirruns && cache[2];
								node = nodeIndex && parent.childNodes[ nodeIndex ];

								while ( (node = ++nodeIndex && node && node[ dir ] ||

									// Fallback to seeking `elem` from the start
									(diff = nodeIndex = 0) || start.pop()) ) {

									// When found, cache indexes on `parent` and
									// break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										outerCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}

							// Use previously-cached element index if available
							} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
								diff = cache[1];

							// xml :nth-child(...) or :nth-last-child(...) or
							// :nth(-last)?-of-type(...)
							} else {
								// Use the same loop as above to seek `elem`
								// from
								// the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
										// Cache the index of each encountered
										// element
										if ( useCache ) {
											(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}

							// Incorporate the offset, then check against cycle
							// size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},

			"PSEUDO": function( pseudo, argument ) {
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are
				// added
				// with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );

				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}

				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction(function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf.call( seed, matched[i] );
								seed[ idx ] = !( matches[ idx ] = matched[i] );
							}
						}) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}

				return fn;
			}
		},

		pseudos: {
			// Potentially complex pseudos
			"not": markFunction(function( selector ) {
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );

				return matcher[ expando ] ?
					markFunction(function( seed, matches, context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;

						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( (elem = unmatched[i]) ) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) :
					function( elem, context, xml ) {
						input[0] = elem;
						matcher( input, null, xml, results );
						return !results.pop();
					};
			}),

			"has": markFunction(function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			}),

			"contains": markFunction(function( text ) {
				return function( elem ) {
					return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
				};
			}),

			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is
			// performed
			// case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {
				// lang value must be a valid identifier
				if ( !ridentifier.test(lang || "") ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( (elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
					return false;
				};
			}),

			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},

			"root": function( elem ) {
				return elem === docElem;
			},

			"focus": function( elem ) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},

			// Boolean properties
			"enabled": function( elem ) {
				return elem.disabled === false;
			},

			"disabled": function( elem ) {
				return elem.disabled === true;
			},

			"checked": function( elem ) {
				// In CSS3, :checked should return both checked and selected
				// elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
			},

			"selected": function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}

				return elem.selected === true;
			},

			// Contents
			"empty": function( elem ) {
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3;
				// cdata: 4; entity ref: 5),
				// but not by others (comment: 8; processing instruction: 7;
				// etc.)
				// nodeType < 6 works because attributes (2) do not appear as
				// children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},

			"parent": function( elem ) {
				return !Expr.pseudos["empty"]( elem );
			},

			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},

			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},

			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},

			"text": function( elem ) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&

					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with
					// elem.type === "text"
					( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
			},

			// Position-in-collection
			"first": createPositionalPseudo(function() {
				return [ 0 ];
			}),

			"last": createPositionalPseudo(function( matchIndexes, length ) {
				return [ length - 1 ];
			}),

			"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			}),

			"even": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"odd": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			})
		}
	};

	Expr.pseudos["nth"] = Expr.pseudos["eq"];

	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}

	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();

	function tokenize( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];

		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}

		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;

		while ( soFar ) {

			// Comma and first run
			if ( !matched || (match = rcomma.exec( soFar )) ) {
				if ( match ) {
					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[0].length ) || soFar;
				}
				groups.push( (tokens = []) );
			}

			matched = false;

			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					// Cast descendant combinators to space
					type: match[0].replace( rtrim, " " )
				});
				soFar = soFar.slice( matched.length );
			}

			// Filters
			for ( type in Expr.filter ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match ))) ) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: type,
						matches: match
					});
					soFar = soFar.slice( matched.length );
				}
			}

			if ( !matched ) {
				break;
			}
		}

		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :
				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	}

	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[i].value;
		}
		return selector;
	}

	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			checkNonElements = base && dir === "parentNode",
			doneName = done++;

		return combinator.first ?
			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
			} :

			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var data, cache, outerCache,
					dirkey = dirruns + " " + doneName;

				// We can't set arbitrary data on XML nodes, so they don't
				// benefit
				// from dir caching
				if ( xml ) {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || (elem[ expando ] = {});
							if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
								if ( (data = cache[1]) === true || data === cachedruns ) {
									return data === true;
								}
							} else {
								cache = outerCache[ dir ] = [ dirkey ];
								cache[1] = matcher( elem, context, xml ) || cachedruns;
								if ( cache[1] === true ) {
									return true;
								}
							}
						}
					}
				}
			};
	}

	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[i]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[0];
	}

	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;

		for ( ; i < len; i++ ) {
			if ( (elem = unmatched[i]) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}

		return newUnmatched;
	}

	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction(function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,

				// Get initial elements from seed or context
				elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

				// Prefilter to get matcher input, preserving a map for
				// seed-results
				// synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,

				matcherOut = matcher ?
					// If we have a postFinder, or filtered seed, or non-seed
					// postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

						// ...intermediate processing is necessary
						[] :

						// ...otherwise use results directly
						results :
					matcherIn;

			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}

			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );

				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( (elem = temp[i]) ) {
						matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
					}
				}
			}

			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {
						// Get the final matcherOut by condensing this
						// intermediate
						// into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( (elem = matcherOut[i]) ) {
								// Restore matcherIn since elem is not yet a
								// final
								// match
								temp.push( (matcherIn[i] = elem) );
							}
						}
						postFinder( null, (matcherOut = []), temp, xml );
					}

					// Move matched elements from seed to results to keep them
					// synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) &&
							(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

							seed[temp] = !(results[temp] = elem);
						}
					}
				}

			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		});
	}

	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[0].type ],
			implicitRelative = leadingRelative || Expr.relative[" "],
			i = leadingRelative ? 1 : 0,

			// The foundational matcher ensures that elements are reachable from
			// top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf.call( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					(checkContext = context).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
			} ];

		for ( ; i < len; i++ ) {
			if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
				matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
			} else {
				matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {
					// Find the next relative operator (if any) for proper
					// handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[j].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(
							// If the preceding token was a descendant
							// combinator,
							// insert an implicit any-element `*`
							tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
						).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}

		return elementMatcher( matchers );
	}

	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		// A counter to specify which element is currently being matched
		var matcherCachedRuns = 0,
			bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,
					// We must always have either seed elements or outermost
					// context
					elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
					len = elems.length;

				if ( outermost ) {
					outermostContext = context !== document && context;
					cachedruns = matcherCachedRuns;
				}

				// Add elements passing elementMatchers directly to results
				// Keep `i` a string if there are no elements so `matchedCount`
				// will
				// be "00" below
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>)
				// matching elements by id
				for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;
						while ( (matcher = elementMatchers[j++]) ) {
							if ( matcher( elem, context, xml ) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
							cachedruns = ++matcherCachedRuns;
						}
					}

					// Track unmatched elements for set filters
					if ( bySet ) {
						// They will have gone through all possible matchers
						if ( (elem = !matcher && elem) ) {
							matchedCount--;
						}

						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}

				// Apply set filters to unmatched elements
				matchedCount += i;
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( (matcher = setMatchers[j++]) ) {
						matcher( unmatched, setMatched, context, xml );
					}

					if ( seed ) {
						// Reintegrate element matches to eliminate the need for
						// sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !(unmatched[i] || setMatched[i]) ) {
									setMatched[i] = pop.call( results );
								}
							}
						}

						// Discard index placeholder values to get only actual
						// matches
						setMatched = condense( setMatched );
					}

					// Add matches to results
					push.apply( results, setMatched );

					// Seedless set matches succeeding multiple successful
					// matchers
					// stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {

						Sizzle.uniqueSort( results );
					}
				}

				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}

				return unmatched;
			};

		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}

	compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];

		if ( !cached ) {
			// Generate a function of recursive functions that can be used to
			// check
			// each element
			if ( !group ) {
				group = tokenize( selector );
			}
			i = group.length;
			while ( i-- ) {
				cached = matcherFromTokens( group[i] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}

			// Cache the compiled function
			cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
		}
		return cached;
	};

	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[i], results );
		}
		return results;
	}

	function select( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			match = tokenize( selector );

		if ( !seed ) {
			// Try to minimize operations if there is only one group
			if ( match.length === 1 ) {

				// Take a shortcut and set the context if the root selector is
				// an ID
				tokens = match[0] = match[0].slice( 0 );
				if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
						support.getById && context.nodeType === 9 && documentIsHTML &&
						Expr.relative[ tokens[1].type ] ) {

					context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
					if ( !context ) {
						return results;
					}
					selector = selector.slice( tokens.shift().value.length );
				}

				// Fetch a seed set for right-to-left matching
				i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
				while ( i-- ) {
					token = tokens[i];

					// Abort if we hit a combinator
					if ( Expr.relative[ (type = token.type) ] ) {
						break;
					}
					if ( (find = Expr.find[ type ]) ) {
						// Search, expanding context for leading sibling
						// combinators
						if ( (seed = find(
							token.matches[0].replace( runescape, funescape ),
							rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
						)) ) {

							// If seed is empty or no tokens remain, we can
							// return
							// early
							tokens.splice( i, 1 );
							selector = seed.length && toSelector( tokens );
							if ( !selector ) {
								push.apply( results, seed );
								return results;
							}

							break;
						}
					}
				}
			}
		}

		// Compile and execute a filtering function
		// Provide `match` to avoid retokenization if we modified the selector
		// above
		compile( selector, match )(
			seed,
			context,
			!documentIsHTML,
			results,
			rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	}

	// One-time assignments

	// Sort stability
	support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

	// Support: Chrome<14
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;

	// Initialize against the default document
	setDocument();

	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function( div1 ) {
		// Should return 1, but returns 4 (following)
		return div1.compareDocumentPosition( document.createElement("div") ) & 1;
	});

	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild.getAttribute("href") === "#" ;
	}) ) {
		addHandle( "type|href|height|width", function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
			}
		});
	}

	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if ( !support.attributes || !assert(function( div ) {
		div.innerHTML = "<input/>";
		div.firstChild.setAttribute( "value", "" );
		return div.firstChild.getAttribute( "value" ) === "";
	}) ) {
		addHandle( "value", function( elem, name, isXML ) {
			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
				return elem.defaultValue;
			}
		});
	}

	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if ( !assert(function( div ) {
		return div.getAttribute("disabled") == null;
	}) ) {
		addHandle( booleans, function( elem, name, isXML ) {
			var val;
			if ( !isXML ) {
				return elem[ name ] === true ? name.toLowerCase() :
						(val = elem.getAttributeNode( name )) && val.specified ?
						val.value :
					null;
			}
		});
	}

	// EXPOSE
	if ( typeof define === "function" && define.amd ) {
		define(function() { return Sizzle; });
	// Sizzle requires that there be a global window in Common-JS like
	// environments
	} else if ( typeof module !== "undefined" && module.exports ) {
		module.exports = Sizzle;
	} else {
		window.Sizzle = Sizzle;
	}
	// EXPOSE

	})( window );




	/*
	 * json2.js 2013-05-26 Public Domain. NO WARRANTY EXPRESSED OR IMPLIED. USE
	 * AT YOUR OWN RISK. See http://www.JSON.org/js.html This code should be
	 * minified before deployment. See
	 * http://javascript.crockford.com/jsmin.html
	 */


	// Create a JSON object only if one does not already exist. We create the
	// methods in a closure to avoid creating global variables.

	if (typeof JSON !== 'object') {
	    JSON = {};
	}

	(function () {
	    'use strict';

	    function f(n) {
	        // Format integers to have at least two digits.
	        return n < 10 ? '0' + n : n;
	    }

	    if (typeof Date.prototype.toJSON !== 'function') {

	        Date.prototype.toJSON = function () {

	            return isFinite(this.valueOf())
	                ? this.getUTCFullYear()     + '-' +
	                    f(this.getUTCMonth() + 1) + '-' +
	                    f(this.getUTCDate())      + 'T' +
	                    f(this.getUTCHours())     + ':' +
	                    f(this.getUTCMinutes())   + ':' +
	                    f(this.getUTCSeconds())   + 'Z'
	                : null;
	        };

	        String.prototype.toJSON      =
	            Number.prototype.toJSON  =
	            Boolean.prototype.toJSON = function () {
	                return this.valueOf();
	            };
	    }

	    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        gap,
	        indent,
	        meta = {    // table of character substitutions
	            '\b': '\\b',
	            '\t': '\\t',
	            '\n': '\\n',
	            '\f': '\\f',
	            '\r': '\\r',
	            '"' : '\\"',
	            '\\': '\\\\'
	        },
	        rep;


	    function quote(string) {

	// If the string contains no control characters, no quote characters, and no
	// backslash characters, then we can safely slap some quotes around it.
	// Otherwise we must also replace the offending characters with safe escape
	// sequences.

	        escapable.lastIndex = 0;
	        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	            var c = meta[a];
	            return typeof c === 'string'
	                ? c
	                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	        }) + '"' : '"' + string + '"';
	    }


	    function str(key, holder) {

	// Produce a string from holder[key].

	        var i,          // The loop counter.
	            k,          // The member key.
	            v,          // The member value.
	            length,
	            mind = gap,
	            partial,
	            value = holder[key];

	// If the value has a toJSON method, call it to obtain a replacement value.

	        if (value && typeof value === 'object' &&
	                typeof value.toJSON === 'function') {
	            value = value.toJSON(key);
	        }

	// If we were called with a replacer function, then call the replacer to
	// obtain a replacement value.

	        if (typeof rep === 'function') {
	            value = rep.call(holder, key, value);
	        }

	// What happens next depends on the value's type.

	        switch (typeof value) {
	        case 'string':
	            return quote(value);

	        case 'number':

	// JSON numbers must be finite. Encode non-finite numbers as null.

	            return isFinite(value) ? String(value) : 'null';

	        case 'boolean':
	        case 'null':

	// If the value is a boolean or null, convert it to a string. Note:
	// typeof null does not produce 'null'. The case is included here in
	// the remote chance that this gets fixed someday.

	            return String(value);

	// If the type is 'object', we might be dealing with an object or an array
	// or
	// null.

	        case 'object':

	// Due to a specification blunder in ECMAScript, typeof null is 'object',
	// so watch out for that case.

	            if (!value) {
	                return 'null';
	            }

	// Make an array to hold the partial results of stringifying this object
	// value.

	            gap += indent;
	            partial = [];

	// Is the value an array?

	            if (Object.prototype.toString.apply(value) === '[object Array]') {

	// The value is an array. Stringify every element. Use null as a placeholder
	// for non-JSON values.

	                length = value.length;
	                for (i = 0; i < length; i += 1) {
	                    partial[i] = str(i, value) || 'null';
	                }

	// Join all of the elements together, separated with commas, and wrap them
	// in
	// brackets.

	                v = partial.length === 0
	                    ? '[]'
	                    : gap
	                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
	                    : '[' + partial.join(',') + ']';
	                gap = mind;
	                return v;
	            }

	// If the replacer is an array, use it to select the members to be
	// stringified.

	            if (rep && typeof rep === 'object') {
	                length = rep.length;
	                for (i = 0; i < length; i += 1) {
	                    if (typeof rep[i] === 'string') {
	                        k = rep[i];
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            } else {

	// Otherwise, iterate through all of the keys in the object.

	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            }

	// Join all of the member texts together, separated with commas,
	// and wrap them in braces.

	            v = partial.length === 0
	                ? '{}'
	                : gap
	                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
	                : '{' + partial.join(',') + '}';
	            gap = mind;
	            return v;
	        }
	    }

	// If the JSON object does not yet have a stringify method, give it one.

	    if (typeof JSON.stringify !== 'function') {
	        JSON.stringify = function (value, replacer, space) {

	// The stringify method takes a value and an optional replacer, and an
	// optional
	// space parameter, and returns a JSON text. The replacer can be a function
	// that can replace values, or an array of strings that will select the
	// keys.
	// A default replacer method can be provided. Use of the space parameter can
	// produce text that is more easily readable.

	            var i;
	            gap = '';
	            indent = '';

	// If the space parameter is a number, make an indent string containing that
	// many spaces.

	            if (typeof space === 'number') {
	                for (i = 0; i < space; i += 1) {
	                    indent += ' ';
	                }

	// If the space parameter is a string, it will be used as the indent string.

	            } else if (typeof space === 'string') {
	                indent = space;
	            }

	// If there is a replacer, it must be a function or an array.
	// Otherwise, throw an error.

	            rep = replacer;
	            if (replacer && typeof replacer !== 'function' &&
	                    (typeof replacer !== 'object' ||
	                    typeof replacer.length !== 'number')) {
	                throw new Error('JSON.stringify');
	            }

	// Make a fake root object containing our value under the key of ''.
	// Return the result of stringifying the value.

	            return str('', {'': value});
	        };
	    }


	// If the JSON object does not yet have a parse method, give it one.

	    if (typeof JSON.parse !== 'function') {
	        JSON.parse = function (text, reviver) {

	// The parse method takes a text and an optional reviver function, and
	// returns
	// a JavaScript value if the text is a valid JSON text.

	            var j;

	            function walk(holder, key) {

	// The walk method is used to recursively walk the resulting structure so
	// that modifications can be made.

	                var k, v, value = holder[key];
	                if (value && typeof value === 'object') {
	                    for (k in value) {
	                        if (Object.prototype.hasOwnProperty.call(value, k)) {
	                            v = walk(value, k);
	                            if (v !== undefined) {
	                                value[k] = v;
	                            } else {
	                                delete value[k];
	                            }
	                        }
	                    }
	                }
	                return reviver.call(holder, key, value);
	            }


	// Parsing happens in four stages. In the first stage, we replace certain
	// Unicode characters with escape sequences. JavaScript handles many
	// characters
	// incorrectly, either silently deleting them, or treating them as line
	// endings.

	            text = String(text);
	            cx.lastIndex = 0;
	            if (cx.test(text)) {
	                text = text.replace(cx, function (a) {
	                    return '\\u' +
	                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	                });
	            }

	// In the second stage, we run the text against regular expressions that
	// look
	// for non-JSON patterns. We are especially concerned with '()' and 'new'
	// because they can cause invocation, and '=' because it can cause mutation.
	// But just to be safe, we want to reject all unexpected forms.

	// We split the second stage into 4 regexp operations in order to work
	// around
	// crippling inefficiencies in IE's and Safari's regexp engines. First we
	// replace the JSON backslash pairs with '@' (a non-JSON character). Second,
	// we
	// replace all simple value tokens with ']' characters. Third, we delete all
	// open brackets that follow a colon or comma or that begin the text.
	// Finally,
	// we look to see that the remaining characters are only whitespace or ']'
	// or
	// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

	            if (/^[\],:{}\s]*$/
	                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
	                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
	                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

	// In the third stage we use the eval function to compile the text into a
	// JavaScript structure. The '{' operator is subject to a syntactic
	// ambiguity
	// in JavaScript: it can begin a block or an object literal. We wrap the
	// text
	// in parens to eliminate the ambiguity.

	                j = eval('(' + text + ')');

	// In the optional fourth stage, we recursively walk the new structure,
	// passing
	// each name/value pair to a reviver function for possible transformation.

	                return typeof reviver === 'function'
	                    ? walk({'': j}, '')
	                    : j;
	            }

	// If the text is not JSON parseable, then a SyntaxError is thrown.

	            throw new SyntaxError('JSON.parse');
	        };
	    }
	}());

	/**
	 * Detect.js: User-Agent Parser https://github.com/darcyclarke/Detect.js
	 * Dual licensed under the MIT and GPL licenses.
	 * 
	 * @version 2.2.2
	 * @author Darcy Clarke
	 * @url http://darcyclarke.me
	 * @createdat Mon Oct 26 2015 08:21:54 GMT-0200 (Horário brasileiro de
	 *            verão)
	 * 
	 * Based on UA-Parser (https://github.com/tobie/ua-parser) by Tobie Langel
	 * 
	 * Example Usage: var agentInfo = detect.parse(navigator.userAgent);
	 * console.log(agentInfo.browser.family); // Chrome
	 */
	(function(root, undefined) {
	    // Shim Array.prototype.map if necessary
	    // Production steps of ECMA-262, Edition 5, 15.4.4.19
	    // Reference: http://es5.github.com/#x15.4.4.19
	    if (!Array.prototype.map) {
	        Array.prototype.map = function(callback, thisArg) {
	            var T, A, k;
	            if (this == null) {
	                throw new TypeError(" this is null or not defined");
	            }
	            // 1. Let O be the result of calling ToObject passing the |this|
	            // value as the argument.
	            var O = Object(this);
	            // 2. Let lenValue be the result of calling the Get internal
				// method
	            // of O with the argument "length".
	            // 3. Let len be ToUint32(lenValue).
	            var len = O.length >>> 0;
	            // 4. If IsCallable(callback) is false, throw a TypeError
				// exception.
	            // See: http://es5.github.com/#x9.11
	            if (typeof callback !== "function") {
	                throw new TypeError(callback + " is not a function");
	            }
	            // 5. If thisArg was supplied, let T be thisArg; else let T be
	            // undefined.
	            if (thisArg) {
	                T = thisArg;
	            }
	            // 6. Let A be a new array created as if by the expression new
	            // Array(len) where Array is
	            // the standard built-in constructor with that name and len is
				// the
	            // value of len.
	            A = new Array(len);
	            // 7. Let k be 0
	            k = 0;
	            // 8. Repeat, while k < len
	            while (k < len) {
	                var kValue, mappedValue;
	                // a. Let Pk be ToString(k).
	                // This is implicit for LHS operands of the in operator
	                // b. Let kPresent be the result of calling the HasProperty
	                // internal method of O with argument Pk.
	                // This step can be combined with c
	                // c. If kPresent is true, then
	                if (k in O) {
	                    // i. Let kValue be the result of calling the Get
						// internal
	                    // method of O with argument Pk.
	                    kValue = O[k];
	                    // ii. Let mappedValue be the result of calling the Call
	                    // internal method of callback
	                    // with T as the this value and argument list containing
	                    // kValue, k, and O.
	                    mappedValue = callback.call(T, kValue, k, O);
	                    // iii. Call the DefineOwnProperty internal method of A
						// with
	                    // arguments
	                    // Pk, Property Descriptor {Value: mappedValue, : true,
	                    // Enumerable: true, Configurable: true},
	                    // and false.
	                    // In browsers that support Object.defineProperty, use
						// the
	                    // following:
	                    // Object.defineProperty(A, Pk, { value: mappedValue,
	                    // writable: true, enumerable: true, configurable: true
						// });
	                    // For best browser support, use the following:
	                    A[k] = mappedValue;
	                }
	                // d. Increase k by 1.
	                k++;
	            }
	            // 9. return A
	            return A;
	        };
	    }
	    // Detect
	    var detect = root.detect = function() {
	        // Context
	        var _this = function() {};
	        // Regexes
	        var regexes = {
	            browser_parsers: [{
	                regex: "^(Opera)/(\\d+)\\.(\\d+) \\(Nintendo Wii",
	                family_replacement: "Wii",
	                manufacturer: "Nintendo"
	            },
	            {
	                regex: "(SeaMonkey|Camino)/(\\d+)\\.(\\d+)\\.?([ab]?\\d+[a-z]*)",
	                family_replacement: "Camino",
	                other: true
	            },
	            {
	                regex: "(Pale[Mm]oon)/(\\d+)\\.(\\d+)\\.?(\\d+)?",
	                family_replacement: "Pale Moon (Firefox Variant)",
	                other: true
	            },
	            {
	                regex: "(Fennec)/(\\d+)\\.(\\d+)\\.?([ab]?\\d+[a-z]*)",
	                family_replacement: "Firefox Mobile"
	            },
	            {
	                regex: "(Fennec)/(\\d+)\\.(\\d+)(pre)",
	                family_replacment: "Firefox Mobile"
	            },
	            {
	                regex: "(Fennec)/(\\d+)\\.(\\d+)",
	                family_replacement: "Firefox Mobile"
	            },
	            {
	                regex: "Mobile.*(Firefox)/(\\d+)\\.(\\d+)",
	                family_replacement: "Firefox Mobile"
	            },
	            {
	                regex: "(Namoroka|Shiretoko|Minefield)/(\\d+)\\.(\\d+)\\.(\\d+(?:pre)?)",
	                family_replacement: "Firefox ($1)"
	            },
	            {
	                regex: "(Firefox)/(\\d+)\\.(\\d+)(a\\d+[a-z]*)",
	                family_replacement: "Firefox Alpha"
	            },
	            {
	                regex: "(Firefox)/(\\d+)\\.(\\d+)(b\\d+[a-z]*)",
	                family_replacement: "Firefox Beta"
	            },
	            {
	                regex: "(Firefox)-(?:\\d+\\.\\d+)?/(\\d+)\\.(\\d+)(a\\d+[a-z]*)",
	                family_replacement: "Firefox Alpha"
	            },
	            {
	                regex: "(Firefox)-(?:\\d+\\.\\d+)?/(\\d+)\\.(\\d+)(b\\d+[a-z]*)",
	                family_replacement: "Firefox Beta"
	            },
	            {
	                regex: "(Namoroka|Shiretoko|Minefield)/(\\d+)\\.(\\d+)([ab]\\d+[a-z]*)?",
	                family_replacement: "Firefox ($1)"
	            },
	            {
	                regex: "(Firefox).*Tablet browser (\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "MicroB",
	                tablet: true
	            },
	            {
	                regex: "(MozillaDeveloperPreview)/(\\d+)\\.(\\d+)([ab]\\d+[a-z]*)?"
	            },
	            {
	                regex: "(Flock)/(\\d+)\\.(\\d+)(b\\d+?)",
	                family_replacement: "Flock",
	                other: true
	            },
	            {
	                regex: "(RockMelt)/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Rockmelt",
	                other: true
	            },
	            {
	                regex: "(Navigator)/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Netscape"
	            },
	            {
	                regex: "(Navigator)/(\\d+)\\.(\\d+)([ab]\\d+)",
	                family_replacement: "Netscape"
	            },
	            {
	                regex: "(Netscape6)/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Netscape"
	            },
	            {
	                regex: "(MyIBrow)/(\\d+)\\.(\\d+)",
	                family_replacement: "My Internet Browser",
	                other: true
	            },
	            {
	                regex: "(Opera Tablet).*Version/(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
	                family_replacement: "Opera Tablet",
	                tablet: true
	            },
	            {
	                regex: "(Opera)/.+Opera Mobi.+Version/(\\d+)\\.(\\d+)",
	                family_replacement: "Opera Mobile"
	            },
	            {
	                regex: "Opera Mobi",
	                family_replacement: "Opera Mobile"
	            },
	            {
	                regex: "(Opera Mini)/(\\d+)\\.(\\d+)",
	                family_replacement: "Opera Mini"
	            },
	            {
	                regex: "(Opera Mini)/att/(\\d+)\\.(\\d+)",
	                family_replacement: "Opera Mini"
	            },
	            {
	                regex: "(Opera)/9.80.*Version/(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
	                family_replacement: "Opera"
	            },
	            {
	                regex: "(OPR)/(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
	                family_replacement: "Opera"
	            },
	            {
	                regex: "(webOSBrowser)/(\\d+)\\.(\\d+)",
	                family_replacement: "webOS"
	            },
	            {
	                regex: "(webOS)/(\\d+)\\.(\\d+)",
	                family_replacement: "webOS"
	            },
	            {
	                regex: "(wOSBrowser).+TouchPad/(\\d+)\\.(\\d+)",
	                family_replacement: "webOS TouchPad"
	            },
	            {
	                regex: "(luakit)",
	                family_replacement: "LuaKit",
	                other: true
	            },
	            {
	                regex: "(Lightning)/(\\d+)\\.(\\d+)([ab]?\\d+[a-z]*)",
	                family_replacement: "Lightning",
	                other: true
	            },
	            {
	                regex: "(Firefox)/(\\d+)\\.(\\d+)\\.(\\d+(?:pre)?) \\(Swiftfox\\)",
	                family_replacement: "Swiftfox",
	                other: true
	            },
	            {
	                regex: "(Firefox)/(\\d+)\\.(\\d+)([ab]\\d+[a-z]*)? \\(Swiftfox\\)",
	                family_replacement: "Swiftfox",
	                other: true
	            },
	            {
	                regex: "rekonq",
	                family_replacement: "Rekonq",
	                other: true
	            },
	            {
	                regex: "(conkeror|Conkeror)/(\\d+)\\.(\\d+)\\.?(\\d+)?",
	                family_replacement: "Conkeror",
	                other: true
	            },
	            {
	                regex: "(konqueror)/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Konqueror",
	                other: true
	            },
	            {
	                regex: "(WeTab)-Browser",
	                family_replacement: "WeTab",
	                other: true
	            },
	            {
	                regex: "(Comodo_Dragon)/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Comodo Dragon",
	                other: true
	            },
	            {
	                regex: "(YottaaMonitor)",
	                family_replacement: "Yottaa Monitor",
	                other: true
	            },
	            {
	                regex: "(Kindle)/(\\d+)\\.(\\d+)",
	                family_replacement: "Kindle"
	            },
	            {
	                regex: "(Symphony) (\\d+).(\\d+)",
	                family_replacement: "Symphony",
	                other: true
	            },
	            {
	                regex: "Minimo",
	                family_replacement: "Minimo",
	                other: true
	            },
	            {
	                regex: "(Edge)/(\\d+)\\.(\\d+)",
	                family_replacement: "Edge"
	            },
	            {
	                regex: "(CrMo)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Chrome Mobile"
	            },
	            {
	                regex: "(CriOS)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Chrome Mobile iOS"
	            },
	            {
	                regex: "(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+) Mobile",
	                family_replacement: "Chrome Mobile"
	            },
	            {
	                regex: "(chromeframe)/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Chrome Frame"
	            },
	            {
	                regex: "(UC Browser)(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "UC Browser",
	                other: true
	            },
	            {
	                regex: "(SLP Browser)/(\\d+)\\.(\\d+)",
	                family_replacement: "Tizen Browser",
	                other: true
	            },
	            {
	                regex: "(Epiphany)/(\\d+)\\.(\\d+).(\\d+)",
	                family_replacement: "Epiphany",
	                other: true
	            },
	            {
	                regex: "(SE 2\\.X) MetaSr (\\d+)\\.(\\d+)",
	                family_replacement: "Sogou Explorer",
	                other: true
	            },
	            {
	                regex: "(Pingdom.com_bot_version_)(\\d+)\\.(\\d+)",
	                family_replacement: "PingdomBot",
	                other: true
	            },
	            {
	                regex: "(facebookexternalhit)/(\\d+)\\.(\\d+)",
	                family_replacement: "FacebookBot"
	            },
	            {
	                regex: "(Twitterbot)/(\\d+)\\.(\\d+)",
	                family_replacement: "TwitterBot"
	            },
	            {
	                regex: "(AdobeAIR|Chromium|FireWeb|Jasmine|ANTGalio|Midori|Fresco|Lobo|PaleMoon|Maxthon|Lynx|OmniWeb|Dillo|Camino|Demeter|Fluid|Fennec|Shiira|Sunrise|Chrome|Flock|Netscape|Lunascape|WebPilot|NetFront|Netfront|Konqueror|SeaMonkey|Kazehakase|Vienna|Iceape|Iceweasel|IceWeasel|Iron|K-Meleon|Sleipnir|Galeon|GranParadiso|Opera Mini|iCab|NetNewsWire|ThunderBrowse|Iron|Iris|UP\\.Browser|Bunjaloo|Google Earth|Raven for Mac)/(\\d+)\\.(\\d+)\\.(\\d+)"
	            },
	            {
	                regex: "(Bolt|Jasmine|IceCat|Skyfire|Midori|Maxthon|Lynx|Arora|IBrowse|Dillo|Camino|Shiira|Fennec|Phoenix|Chrome|Flock|Netscape|Lunascape|Epiphany|WebPilot|Opera Mini|Opera|NetFront|Netfront|Konqueror|Googlebot|SeaMonkey|Kazehakase|Vienna|Iceape|Iceweasel|IceWeasel|Iron|K-Meleon|Sleipnir|Galeon|GranParadiso|iCab|NetNewsWire|Iron|Space Bison|Stainless|Orca|Dolfin|BOLT|Minimo|Tizen Browser|Polaris)/(\\d+)\\.(\\d+)"
	            },
	            {
	                regex: "(iRider|Crazy Browser|SkipStone|iCab|Lunascape|Sleipnir|Maemo Browser) (\\d+)\\.(\\d+)\\.(\\d+)"
	            },
	            {
	                regex: "(iCab|Lunascape|Opera|Android|Jasmine|Polaris|BREW) (\\d+)\\.(\\d+)\\.?(\\d+)?"
	            },
	            {
	                regex: "(Android) Donut",
	                v2_replacement: "2",
	                v1_replacement: "1"
	            },
	            {
	                regex: "(Android) Eclair",
	                v2_replacement: "1",
	                v1_replacement: "2"
	            },
	            {
	                regex: "(Android) Froyo",
	                v2_replacement: "2",
	                v1_replacement: "2"
	            },
	            {
	                regex: "(Android) Gingerbread",
	                v2_replacement: "3",
	                v1_replacement: "2"
	            },
	            {
	                regex: "(Android) Honeycomb",
	                v1_replacement: "3"
	            },
	            {
	                regex: "(IEMobile)[ /](\\d+)\\.(\\d+)",
	                family_replacement: "IE Mobile"
	            },
	            {
	                regex: "(MSIE) (\\d+)\\.(\\d+).*XBLWP7",
	                family_replacement: "IE Large Screen"
	            },
	            {
	                regex: "(Firefox)/(\\d+)\\.(\\d+)\\.(\\d+)"
	            },
	            {
	                regex: "(Firefox)/(\\d+)\\.(\\d+)(pre|[ab]\\d+[a-z]*)?"
	            },
	            {
	                regex: "(Obigo)InternetBrowser",
	                other: true
	            },
	            {
	                regex: "(Obigo)\\-Browser",
	                other: true
	            },
	            {
	                regex: "(Obigo|OBIGO)[^\\d]*(\\d+)(?:.(\\d+))?",
	                other: true
	            },
	            {
	                regex: "(MAXTHON|Maxthon) (\\d+)\\.(\\d+)",
	                family_replacement: "Maxthon",
	                other: true
	            },
	            {
	                regex: "(Maxthon|MyIE2|Uzbl|Shiira)",
	                v1_replacement: "0",
	                other: true
	            },
	            {
	                regex: "(PLAYSTATION) (\\d+)",
	                family_replacement: "PlayStation",
	                manufacturer: "Sony"
	            },
	            {
	                regex: "(PlayStation Portable)[^\\d]+(\\d+).(\\d+)",
	                manufacturer: "Sony"
	            },
	            {
	                regex: "(BrowseX) \\((\\d+)\\.(\\d+)\\.(\\d+)",
	                other: true
	            },
	            {
	                regex: "(POLARIS)/(\\d+)\\.(\\d+)",
	                family_replacement: "Polaris",
	                other: true
	            },
	            {
	                regex: "(Embider)/(\\d+)\\.(\\d+)",
	                family_replacement: "Polaris",
	                other: true
	            },
	            {
	                regex: "(BonEcho)/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Bon Echo",
	                other: true
	            },
	            {
	                regex: "(iPod).+Version/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Mobile Safari",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPod).*Version/(\\d+)\\.(\\d+)",
	                family_replacement: "Mobile Safari",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPod)",
	                family_replacement: "Mobile Safari",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPhone).*Version/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Mobile Safari",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPhone).*Version/(\\d+)\\.(\\d+)",
	                family_replacement: "Mobile Safari",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPhone)",
	                family_replacement: "Mobile Safari",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPad).*Version/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Mobile Safari",
	                tablet: true,
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPad).*Version/(\\d+)\\.(\\d+)",
	                family_replacement: "Mobile Safari",
	                tablet: true,
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPad)",
	                family_replacement: "Mobile Safari",
	                tablet: true,
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(AvantGo) (\\d+).(\\d+)",
	                other: true
	            },
	            {
	                regex: "(Avant)",
	                v1_replacement: "1",
	                other: true
	            },
	            {
	                regex: "^(Nokia)",
	                family_replacement: "Nokia Services (WAP) Browser",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(NokiaBrowser)/(\\d+)\\.(\\d+).(\\d+)\\.(\\d+)",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(NokiaBrowser)/(\\d+)\\.(\\d+).(\\d+)",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(NokiaBrowser)/(\\d+)\\.(\\d+)",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(BrowserNG)/(\\d+)\\.(\\d+).(\\d+)",
	                family_replacement: "NokiaBrowser",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(Series60)/5\\.0",
	                v2_replacement: "0",
	                v1_replacement: "7",
	                family_replacement: "NokiaBrowser",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(Series60)/(\\d+)\\.(\\d+)",
	                family_replacement: "Nokia OSS Browser",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(S40OviBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Nokia Series 40 Ovi Browser",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(Nokia)[EN]?(\\d+)",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(PlayBook).+RIM Tablet OS (\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Blackberry WebKit",
	                tablet: true,
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(Black[bB]erry).+Version/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Blackberry WebKit",
	                manufacturer: "RIM"
	            },
	            {
	                regex: "(Black[bB]erry)\\s?(\\d+)",
	                family_replacement: "Blackberry",
	                manufacturer: "RIM"
	            },
	            {
	                regex: "(OmniWeb)/v(\\d+)\\.(\\d+)",
	                other: true
	            },
	            {
	                regex: "(Blazer)/(\\d+)\\.(\\d+)",
	                family_replacement: "Palm Blazer",
	                manufacturer: "Palm"
	            },
	            {
	                regex: "(Pre)/(\\d+)\\.(\\d+)",
	                family_replacement: "Palm Pre",
	                manufacturer: "Palm"
	            },
	            {
	                regex: "(Links) \\((\\d+)\\.(\\d+)",
	                other: true
	            },
	            {
	                regex: "(QtWeb) Internet Browser/(\\d+)\\.(\\d+)",
	                other: true
	            },
	            {
	                regex: "(Silk)/(\\d+)\\.(\\d+)(?:\\.([0-9\\-]+))?",
	                other: true,
	                tablet: true
	            },
	            {
	                regex: "(AppleWebKit)/(\\d+)\\.?(\\d+)?\\+ .* Version/\\d+\\.\\d+.\\d+ Safari/",
	                family_replacement: "WebKit Nightly"
	            },
	            {
	                regex: "(Version)/(\\d+)\\.(\\d+)(?:\\.(\\d+))?.*Safari/",
	                family_replacement: "Safari"
	            },
	            {
	                regex: "(Safari)/\\d+"
	            },
	            {
	                regex: "(OLPC)/Update(\\d+)\\.(\\d+)",
	                other: true
	            },
	            {
	                regex: "(OLPC)/Update()\\.(\\d+)",
	                v1_replacement: "0",
	                other: true
	            },
	            {
	                regex: "(SEMC\\-Browser)/(\\d+)\\.(\\d+)",
	                other: true
	            },
	            {
	                regex: "(Teleca)",
	                family_replacement: "Teleca Browser",
	                other: true
	            },
	            {
	                regex: "Trident(.*)rv.(\\d+)\\.(\\d+)",
	                family_replacement: "IE"
	            },
	            {
	                regex: "(MSIE) (\\d+)\\.(\\d+)",
	                family_replacement: "IE"
	            }],
	            os_parsers: [{
	                regex: "(Android) (\\d+)\\.(\\d+)(?:[.\\-]([a-z0-9]+))?"
	            },
	            {
	                regex: "(Android)\\-(\\d+)\\.(\\d+)(?:[.\\-]([a-z0-9]+))?"
	            },
	            {
	                regex: "(Android) Donut",
	                os_v2_replacement: "2",
	                os_v1_replacement: "1"
	            },
	            {
	                regex: "(Android) Eclair",
	                os_v2_replacement: "1",
	                os_v1_replacement: "2"
	            },
	            {
	                regex: "(Android) Froyo",
	                os_v2_replacement: "2",
	                os_v1_replacement: "2"
	            },
	            {
	                regex: "(Android) Gingerbread",
	                os_v2_replacement: "3",
	                os_v1_replacement: "2"
	            },
	            {
	                regex: "(Android) Honeycomb",
	                os_v1_replacement: "3"
	            },
	            {
	                regex: "(Silk-Accelerated=[a-z]{4,5})",
	                os_replacement: "Android"
	            },
	            {
	                regex: "(Windows Phone 6\\.5)"
	            },
	            {
	                regex: "(Windows (?:NT 5\\.2|NT 5\\.1))",
	                os_replacement: "Windows XP"
	            },
	            {
	                regex: "(XBLWP7)",
	                os_replacement: "Windows Phone OS"
	            },
	            {
	                regex: "(Windows NT 6\\.1)",
	                os_replacement: "Windows 7"
	            },
	            {
	                regex: "(Windows NT 6\\.0)",
	                os_replacement: "Windows Vista"
	            },
	            {
	                regex: "(Windows 98|Windows XP|Windows ME|Windows 95|Windows CE|Windows 7|Windows NT 4\\.0|Windows Vista|Windows 2000)"
	            },
	            {
	                regex: "(Windows NT 6\\.4|Windows NT 10\\.0)",
	                os_replacement: "Windows 10"
	            },
	            {
	                regex: "(Windows NT 6\\.2)",
	                os_replacement: "Windows 8"
	            },
	            {
	                regex: "(Windows Phone 8)",
	                os_replacement: "Windows Phone 8"
	            },
	            {
	                regex: "(Windows NT 5\\.0)",
	                os_replacement: "Windows 2000"
	            },
	            {
	                regex: "(Windows Phone OS) (\\d+)\\.(\\d+)"
	            },
	            {
	                regex: "(Windows ?Mobile)",
	                os_replacement: "Windows Mobile"
	            },
	            {
	                regex: "(WinNT4.0)",
	                os_replacement: "Windows NT 4.0"
	            },
	            {
	                regex: "(Win98)",
	                os_replacement: "Windows 98"
	            },
	            {
	                regex: "(Tizen)/(\\d+)\\.(\\d+)",
	                other: true
	            },
	            {
	                regex: "(Mac OS X) (\\d+)[_.](\\d+)(?:[_.](\\d+))?",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(?:PPC|Intel) (Mac OS X)",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(CPU OS|iPhone OS) (\\d+)_(\\d+)(?:_(\\d+))?",
	                os_replacement: "iOS",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPhone|iPad|iPod); Opera",
	                os_replacement: "iOS",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPad); Opera",
	                tablet: true,
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPhone|iPad|iPod).*Mac OS X.*Version/(\\d+)\\.(\\d+)",
	                os_replacement: "iOS",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(CrOS) [a-z0-9_]+ (\\d+)\\.(\\d+)(?:\\.(\\d+))?",
	                os_replacement: "Chrome OS"
	            },
	            {
	                regex: "(Debian)-(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
	                other: true
	            },
	            {
	                regex: "(Linux Mint)(?:/(\\d+))?",
	                other: true
	            },
	            {
	                regex: "(Mandriva)(?: Linux)?/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
	                other: true
	            },
	            {
	                regex: "(Symbian[Oo][Ss])/(\\d+)\\.(\\d+)",
	                os_replacement: "Symbian OS"
	            },
	            {
	                regex: "(Symbian/3).+NokiaBrowser/7\\.3",
	                os_replacement: "Symbian^3 Anna"
	            },
	            {
	                regex: "(Symbian/3).+NokiaBrowser/7\\.4",
	                os_replacement: "Symbian^3 Belle"
	            },
	            {
	                regex: "(Symbian/3)",
	                os_replacement: "Symbian^3"
	            },
	            {
	                regex: "(Series 60|SymbOS|S60)",
	                os_replacement: "Symbian OS"
	            },
	            {
	                regex: "(MeeGo)",
	                other: true
	            },
	            {
	                regex: "Symbian [Oo][Ss]",
	                os_replacement: "Symbian OS"
	            },
	            {
	                regex: "(Black[Bb]erry)[0-9a-z]+/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
	                os_replacement: "BlackBerry OS",
	                manufacturer: "RIM"
	            },
	            {
	                regex: "(Black[Bb]erry).+Version/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
	                os_replacement: "BlackBerry OS",
	                manufacturer: "RIM"
	            },
	            {
	                regex: "(RIM Tablet OS) (\\d+)\\.(\\d+)\\.(\\d+)",
	                os_replacement: "BlackBerry Tablet OS",
	                tablet: true,
	                manufacturer: "RIM"
	            },
	            {
	                regex: "(Play[Bb]ook)",
	                os_replacement: "BlackBerry Tablet OS",
	                tablet: true,
	                manufacturer: "RIM"
	            },
	            {
	                regex: "(Black[Bb]erry)",
	                os_replacement: "Blackberry OS",
	                manufacturer: "RIM"
	            },
	            {
	                regex: "(webOS|hpwOS)/(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
	                os_replacement: "webOS"
	            },
	            {
	                regex: "(SUSE|Fedora|Red Hat|PCLinuxOS)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
	                other: true
	            },
	            {
	                regex: "(SUSE|Fedora|Red Hat|Puppy|PCLinuxOS|CentOS)/(\\d+)\\.(\\d+)\\.(\\d+)",
	                other: true
	            },
	            {
	                regex: "(Ubuntu|Kindle|Bada|Lubuntu|BackTrack|Red Hat|Slackware)/(\\d+)\\.(\\d+)"
	            },
	            {
	                regex: "(Windows|OpenBSD|FreeBSD|NetBSD|Ubuntu|Kubuntu|Android|Arch Linux|CentOS|WeTab|Slackware)"
	            },
	            {
	                regex: "(Linux|BSD)",
	                other: true
	            }],
	            mobile_os_families: ["Windows Phone 6.5", "Windows CE", "Symbian OS"],
	            device_parsers: [{
	                regex: "HTC ([A-Z][a-z0-9]+) Build",
	                device_replacement: "HTC $1",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "HTC ([A-Z][a-z0-9 ]+) \\d+\\.\\d+\\.\\d+\\.\\d+",
	                device_replacement: "HTC $1",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "HTC_Touch_([A-Za-z0-9]+)",
	                device_replacement: "HTC Touch ($1)",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "USCCHTC(\\d+)",
	                device_replacement: "HTC $1 (US Cellular)",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "Sprint APA(9292)",
	                device_replacement: "HTC $1 (Sprint)",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "HTC ([A-Za-z0-9]+ [A-Z])",
	                device_replacement: "HTC $1",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "HTC-([A-Za-z0-9]+)",
	                device_replacement: "HTC $1",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "HTC_([A-Za-z0-9]+)",
	                device_replacement: "HTC $1",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "HTC ([A-Za-z0-9]+)",
	                device_replacement: "HTC $1",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "(ADR[A-Za-z0-9]+)",
	                device_replacement: "HTC $1",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "(HTC)",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "SonyEricsson([A-Za-z0-9]+)/",
	                device_replacement: "Ericsson $1",
	                other: true,
	                manufacturer: "Sony"
	            },
	            {
	                regex: "Android[\\- ][\\d]+\\.[\\d]+\\; [A-Za-z]{2}\\-[A-Za-z]{2}\\; WOWMobile (.+) Build"
	            },
	            {
	                regex: "Android[\\- ][\\d]+\\.[\\d]+\\.[\\d]+; [A-Za-z]{2}\\-[A-Za-z]{2}\\; (.+) Build"
	            },
	            {
	                regex: "Android[\\- ][\\d]+\\.[\\d]+\\-update1\\; [A-Za-z]{2}\\-[A-Za-z]{2}\\; (.+) Build"
	            },
	            {
	                regex: "Android[\\- ][\\d]+\\.[\\d]+\\; [A-Za-z]{2}\\-[A-Za-z]{2}\\; (.+) Build"
	            },
	            {
	                regex: "Android[\\- ][\\d]+\\.[\\d]+\\.[\\d]+; (.+) Build"
	            },
	            {
	                regex: "NokiaN([0-9]+)",
	                device_replacement: "Nokia N$1",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "Nokia([A-Za-z0-9\\v-]+)",
	                device_replacement: "Nokia $1",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "NOKIA ([A-Za-z0-9\\-]+)",
	                device_replacement: "Nokia $1",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "Nokia ([A-Za-z0-9\\-]+)",
	                device_replacement: "Nokia $1",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "Lumia ([A-Za-z0-9\\-]+)",
	                device_replacement: "Lumia $1",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "Symbian",
	                device_replacement: "Nokia",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(PlayBook).+RIM Tablet OS",
	                device_replacement: "Blackberry Playbook",
	                tablet: true,
	                manufacturer: "RIM"
	            },
	            {
	                regex: "(Black[Bb]erry [0-9]+);",
	                manufacturer: "RIM"
	            },
	            {
	                regex: "Black[Bb]erry([0-9]+)",
	                device_replacement: "BlackBerry $1",
	                manufacturer: "RIM"
	            },
	            {
	                regex: "(Pre)/(\\d+)\\.(\\d+)",
	                device_replacement: "Palm Pre",
	                manufacturer: "Palm"
	            },
	            {
	                regex: "(Pixi)/(\\d+)\\.(\\d+)",
	                device_replacement: "Palm Pixi",
	                manufacturer: "Palm"
	            },
	            {
	                regex: "(Touchpad)/(\\d+)\\.(\\d+)",
	                device_replacement: "HP Touchpad",
	                manufacturer: "HP"
	            },
	            {
	                regex: "HPiPAQ([A-Za-z0-9]+)/(\\d+).(\\d+)",
	                device_replacement: "HP iPAQ $1",
	                manufacturer: "HP"
	            },
	            {
	                regex: "Palm([A-Za-z0-9]+)",
	                device_replacement: "Palm $1",
	                manufacturer: "Palm"
	            },
	            {
	                regex: "Treo([A-Za-z0-9]+)",
	                device_replacement: "Palm Treo $1",
	                manufacturer: "Palm"
	            },
	            {
	                regex: "webOS.*(P160UNA)/(\\d+).(\\d+)",
	                device_replacement: "HP Veer",
	                manufacturer: "HP"
	            },
	            {
	                regex: "(Kindle Fire)",
	                manufacturer: "Amazon"
	            },
	            {
	                regex: "(Kindle)",
	                manufacturer: "Amazon"
	            },
	            {
	                regex: "(Silk)/(\\d+)\\.(\\d+)(?:\\.([0-9\\-]+))?",
	                device_replacement: "Kindle Fire",
	                tablet: true,
	                manufacturer: "Amazon"
	            },
	            {
	                regex: "(iPad) Simulator;",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPad);",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPod);",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPhone) Simulator;",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPhone);",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "Nexus\\ ([A-Za-z0-9\\-]+)",
	                device_replacement: "Nexus $1"
	            },
	            {
	                regex: "acer_([A-Za-z0-9]+)_",
	                device_replacement: "Acer $1",
	                manufacturer: "Acer"
	            },
	            {
	                regex: "acer_([A-Za-z0-9]+)_",
	                device_replacement: "Acer $1",
	                manufacturer: "Acer"
	            },
	            {
	                regex: "Amoi\\-([A-Za-z0-9]+)",
	                device_replacement: "Amoi $1",
	                other: true,
	                manufacturer: "Amoi"
	            },
	            {
	                regex: "AMOI\\-([A-Za-z0-9]+)",
	                device_replacement: "Amoi $1",
	                other: true,
	                manufacturer: "Amoi"
	            },
	            {
	                regex: "Asus\\-([A-Za-z0-9]+)",
	                device_replacement: "Asus $1",
	                manufacturer: "Asus"
	            },
	            {
	                regex: "ASUS\\-([A-Za-z0-9]+)",
	                device_replacement: "Asus $1",
	                manufacturer: "Asus"
	            },
	            {
	                regex: "BIRD\\-([A-Za-z0-9]+)",
	                device_replacement: "Bird $1",
	                other: true
	            },
	            {
	                regex: "BIRD\\.([A-Za-z0-9]+)",
	                device_replacement: "Bird $1",
	                other: true
	            },
	            {
	                regex: "BIRD ([A-Za-z0-9]+)",
	                device_replacement: "Bird $1",
	                other: true
	            },
	            {
	                regex: "Dell ([A-Za-z0-9]+)",
	                device_replacement: "Dell $1",
	                manufacturer: "Dell"
	            },
	            {
	                regex: "DoCoMo/2\\.0 ([A-Za-z0-9]+)",
	                device_replacement: "DoCoMo $1",
	                other: true
	            },
	            {
	                regex: "([A-Za-z0-9]+)\\_W\\;FOMA",
	                device_replacement: "DoCoMo $1",
	                other: true
	            },
	            {
	                regex: "([A-Za-z0-9]+)\\;FOMA",
	                device_replacement: "DoCoMo $1",
	                other: true
	            },
	            {
	                regex: "vodafone([A-Za-z0-9]+)",
	                device_replacement: "Huawei Vodafone $1",
	                other: true
	            },
	            {
	                regex: "i\\-mate ([A-Za-z0-9]+)",
	                device_replacement: "i-mate $1",
	                other: true
	            },
	            {
	                regex: "Kyocera\\-([A-Za-z0-9]+)",
	                device_replacement: "Kyocera $1",
	                other: true
	            },
	            {
	                regex: "KWC\\-([A-Za-z0-9]+)",
	                device_replacement: "Kyocera $1",
	                other: true
	            },
	            {
	                regex: "Lenovo\\-([A-Za-z0-9]+)",
	                device_replacement: "Lenovo $1",
	                manufacturer: "Lenovo"
	            },
	            {
	                regex: "Lenovo\\_([A-Za-z0-9]+)",
	                device_replacement: "Lenovo $1",
	                manufacturer: "Levovo"
	            },
	            {
	                regex: "LG/([A-Za-z0-9]+)",
	                device_replacement: "LG $1",
	                manufacturer: "LG"
	            },
	            {
	                regex: "LG-LG([A-Za-z0-9]+)",
	                device_replacement: "LG $1",
	                manufacturer: "LG"
	            },
	            {
	                regex: "LGE-LG([A-Za-z0-9]+)",
	                device_replacement: "LG $1",
	                manufacturer: "LG"
	            },
	            {
	                regex: "LGE VX([A-Za-z0-9]+)",
	                device_replacement: "LG $1",
	                manufacturer: "LG"
	            },
	            {
	                regex: "LG ([A-Za-z0-9]+)",
	                device_replacement: "LG $1",
	                manufacturer: "LG"
	            },
	            {
	                regex: "LGE LG\\-AX([A-Za-z0-9]+)",
	                device_replacement: "LG $1",
	                manufacturer: "LG"
	            },
	            {
	                regex: "LG\\-([A-Za-z0-9]+)",
	                device_replacement: "LG $1",
	                manufacturer: "LG"
	            },
	            {
	                regex: "LGE\\-([A-Za-z0-9]+)",
	                device_replacement: "LG $1",
	                manufacturer: "LG"
	            },
	            {
	                regex: "LG([A-Za-z0-9]+)",
	                device_replacement: "LG $1",
	                manufacturer: "LG"
	            },
	            {
	                regex: "(KIN)\\.One (\\d+)\\.(\\d+)",
	                device_replacement: "Microsoft $1"
	            },
	            {
	                regex: "(KIN)\\.Two (\\d+)\\.(\\d+)",
	                device_replacement: "Microsoft $1"
	            },
	            {
	                regex: "(Motorola)\\-([A-Za-z0-9]+)",
	                manufacturer: "Motorola"
	            },
	            {
	                regex: "MOTO\\-([A-Za-z0-9]+)",
	                device_replacement: "Motorola $1",
	                manufacturer: "Motorola"
	            },
	            {
	                regex: "MOT\\-([A-Za-z0-9]+)",
	                device_replacement: "Motorola $1",
	                manufacturer: "Motorola"
	            },
	            {
	                regex: "Philips([A-Za-z0-9]+)",
	                device_replacement: "Philips $1",
	                manufacturer: "Philips"
	            },
	            {
	                regex: "Philips ([A-Za-z0-9]+)",
	                device_replacement: "Philips $1",
	                manufacturer: "Philips"
	            },
	            {
	                regex: "SAMSUNG-([A-Za-z0-9\\-]+)",
	                device_replacement: "Samsung $1",
	                manufacturer: "Samsung"
	            },
	            {
	                regex: "SAMSUNG\\; ([A-Za-z0-9\\-]+)",
	                device_replacement: "Samsung $1",
	                manufacturer: "Samsung"
	            },
	            {
	                regex: "Softbank/1\\.0/([A-Za-z0-9]+)",
	                device_replacement: "Softbank $1",
	                other: true
	            },
	            {
	                regex: "Softbank/2\\.0/([A-Za-z0-9]+)",
	                device_replacement: "Softbank $1",
	                other: true
	            },
	            {
	                regex: "(hiptop|avantgo|plucker|xiino|blazer|elaine|up.browser|up.link|mmp|smartphone|midp|wap|vodafone|o2|pocket|mobile|pda)",
	                device_replacement: "Generic Smartphone"
	            },
	            {
	                regex: "^(1207|3gso|4thp|501i|502i|503i|504i|505i|506i|6310|6590|770s|802s|a wa|acer|acs\\-|airn|alav|asus|attw|au\\-m|aur |aus |abac|acoo|aiko|alco|alca|amoi|anex|anny|anyw|aptu|arch|argo|bell|bird|bw\\-n|bw\\-u|beck|benq|bilb|blac|c55/|cdm\\-|chtm|capi|comp|cond|craw|dall|dbte|dc\\-s|dica|ds\\-d|ds12|dait|devi|dmob|doco|dopo|el49|erk0|esl8|ez40|ez60|ez70|ezos|ezze|elai|emul|eric|ezwa|fake|fly\\-|fly\\_|g\\-mo|g1 u|g560|gf\\-5|grun|gene|go.w|good|grad|hcit|hd\\-m|hd\\-p|hd\\-t|hei\\-|hp i|hpip|hs\\-c|htc |htc\\-|htca|htcg)",
	                device_replacement: "Generic Feature Phone"
	            },
	            {
	                regex: "^(htcp|htcs|htct|htc\\_|haie|hita|huaw|hutc|i\\-20|i\\-go|i\\-ma|i230|iac|iac\\-|iac/|ig01|im1k|inno|iris|jata|java|kddi|kgt|kgt/|kpt |kwc\\-|klon|lexi|lg g|lg\\-a|lg\\-b|lg\\-c|lg\\-d|lg\\-f|lg\\-g|lg\\-k|lg\\-l|lg\\-m|lg\\-o|lg\\-p|lg\\-s|lg\\-t|lg\\-u|lg\\-w|lg/k|lg/l|lg/u|lg50|lg54|lge\\-|lge/|lynx|leno|m1\\-w|m3ga|m50/|maui|mc01|mc21|mcca|medi|meri|mio8|mioa|mo01|mo02|mode|modo|mot |mot\\-|mt50|mtp1|mtv |mate|maxo|merc|mits|mobi|motv|mozz|n100|n101|n102|n202|n203|n300|n302|n500|n502|n505|n700|n701|n710|nec\\-|nem\\-|newg|neon)",
	                device_replacement: "Generic Feature Phone"
	            },
	            {
	                regex: "^(netf|noki|nzph|o2 x|o2\\-x|opwv|owg1|opti|oran|ot\\-s|p800|pand|pg\\-1|pg\\-2|pg\\-3|pg\\-6|pg\\-8|pg\\-c|pg13|phil|pn\\-2|pt\\-g|palm|pana|pire|pock|pose|psio|qa\\-a|qc\\-2|qc\\-3|qc\\-5|qc\\-7|qc07|qc12|qc21|qc32|qc60|qci\\-|qwap|qtek|r380|r600|raks|rim9|rove|s55/|sage|sams|sc01|sch\\-|scp\\-|sdk/|se47|sec\\-|sec0|sec1|semc|sgh\\-|shar|sie\\-|sk\\-0|sl45|slid|smb3|smt5|sp01|sph\\-|spv |spv\\-|sy01|samm|sany|sava|scoo|send|siem|smar|smit|soft|sony|t\\-mo|t218|t250|t600|t610|t618|tcl\\-|tdg\\-|telm|tim\\-|ts70|tsm\\-|tsm3|tsm5|tx\\-9|tagt)",
	                device_replacement: "Generic Feature Phone"
	            },
	            {
	                regex: "^(talk|teli|topl|tosh|up.b|upg1|utst|v400|v750|veri|vk\\-v|vk40|vk50|vk52|vk53|vm40|vx98|virg|vite|voda|vulc|w3c |w3c\\-|wapj|wapp|wapu|wapm|wig |wapi|wapr|wapv|wapy|wapa|waps|wapt|winc|winw|wonu|x700|xda2|xdag|yas\\-|your|zte\\-|zeto|aste|audi|avan|blaz|brew|brvw|bumb|ccwa|cell|cldc|cmd\\-|dang|eml2|fetc|hipt|http|ibro|idea|ikom|ipaq|jbro|jemu|jigs|keji|kyoc|kyok|libw|m\\-cr|midp|mmef|moto|mwbp|mywa|newt|nok6|o2im|pant|pdxg|play|pluc|port|prox|rozo|sama|seri|smal|symb|treo|upsi|vx52|vx53|vx60|vx61|vx70|vx80|vx81|vx83|vx85|wap\\-|webc|whit|wmlb|xda\\-|xda\\_)",
	                device_replacement: "Generic Feature Phone"
	            },
	            {
	                regex: "(bot|borg|google(^tv)|yahoo|slurp|msnbot|msrbot|openbot|archiver|netresearch|lycos|scooter|altavista|teoma|gigabot|baiduspider|blitzbot|oegp|charlotte|furlbot|http%20client|polybot|htdig|ichiro|mogimogi|larbin|pompos|scrubby|searchsight|seekbot|semanticdiscovery|silk|snappy|speedy|spider|voila|vortex|voyager|zao|zeal|fast\\-webcrawler|converacrawler|dataparksearch|findlinks)",
	                device_replacement: "Spider"
	            }],
	            mobile_browser_families: ["Firefox Mobile", "Opera Mobile", "Opera Mini", "Mobile Safari", "webOS", "IE Mobile", "Playstation Portable", "Nokia", "Blackberry", "Palm", "Silk", "Android", "Maemo", "Obigo", "Netfront", "AvantGo", "Teleca", "SEMC-Browser", "Bolt", "Iris", "UP.Browser", "Symphony", "Minimo", "Bunjaloo", "Jasmine", "Dolfin", "Polaris", "BREW", "Chrome Mobile", "Chrome Mobile iOS", "UC Browser", "Tizen Browser"]
	        };
	        // Parsers
	        _this.parsers = ["device_parsers", "browser_parsers", "os_parsers", "mobile_os_families", "mobile_browser_families"];
	        // Types
	        _this.types = ["browser", "os", "device"];
	        // Regular Expressions
	        _this.regexes = regexes ||
	        function() {
	            var results = {};
	            _this.parsers.map(function(parser) {
	                results[parser] = [];
	            });
	            return results;
	        } ();
	        // Families
	        _this.families = function() {
	            var results = {};
	            _this.types.map(function(type) {
	                results[type] = [];
	            });
	            return results;
	        } ();
	        // Utility Variables
	        var ArrayProto = Array.prototype,
	        ObjProto = Object.prototype,
	        FuncProto = Function.prototype,
	        nativeForEach = ArrayProto.forEach,
	        nativeIndexOf = ArrayProto.indexOf;
	        // Find Utility
	        var find = function(ua, obj) {
	            var ret = {};
	            for (var i = 0; i < obj.length; i++) {
	                ret = obj[i](ua);
	                if (ret) {
	                    break;
	                }
	            }
	            return ret;
	        };
	        // Remove Utility
	        var remove = function(arr, props) {
	            each(arr,
	            function(obj) {
	                each(props,
	                function(prop) {
	                    delete obj[prop];
	                });
	            });
	        };
	        // Contains Utility
	        var contains = function(obj, target) {
	            var found = false;
	            if (obj == null) return found;
	            if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
	            found = any(obj,
	            function(value) {
	                return value === target;
	            });
	            return found;
	        };
	        // Each Utility
	        var each = forEach = function(obj, iterator, context) {
	            if (obj == null) return;
	            if (nativeForEach && obj.forEach === nativeForEach) {
	                obj.forEach(iterator, context);
	            } else if (obj.length === +obj.length) {
	                for (var i = 0,
	                l = obj.length; i < l; i++) {
	                    iterator.call(context, obj[i], i, obj);
	                }
	            } else {
	                for (var key in obj) {
	                    if (_.has(obj, key)) {
	                        iterator.call(context, obj[key], key, obj);
	                    }
	                }
	            }
	        };
	        // Extend Utiltiy
	        var extend = function(obj) {
	            each(slice.call(arguments, 1),
	            function(source) {
	                for (var prop in source) {
	                    obj[prop] = source[prop];
	                }
	            });
	            return obj;
	        };
	        // Check String Utility
	        var check = function(str) {
	            return !! (str && typeof str != "undefined" && str != null);
	        };
	        // To Version String Utility
	        var toVersionString = function(obj) {
	            var output = "";
	            obj = obj || {};
	            if (check(obj)) {
	                if (check(obj.major)) {
	                    output += obj.major;
	                    if (check(obj.minor)) {
	                        output += "." + obj.minor;
	                        if (check(obj.patch)) {
	                            output += "." + obj.patch;
	                        }
	                    }
	                }
	            }
	            return output;
	        };
	        // To String Utility
	        var toString = function(obj) {
	            obj = obj || {};
	            var suffix = toVersionString(obj);
	            if (suffix) suffix = " " + suffix;
	            return obj && check(obj.family) ? obj.family + suffix: "";
	        };
	        // Parse User-Agent String
	        _this.parse = function(ua) {
	            // Parsers Utility
	            var parsers = function(type) {
	                return _this.regexes[type + "_parsers"].map(function(obj) {
	                    var regexp = new RegExp(obj.regex),
	                    rep = obj[(type === "browser" ? "family": type) + "_replacement"],
	                    major_rep = obj.major_version_replacement;
	                    function parser(ua) {
	                        var m = ua.match(regexp);
	                        if (!m) return null;
	                        var ret = {};
	                        ret.family = (rep ? rep.replace("$1", m[1]) : m[1]) || "other";
	                        ret.major = parseInt(major_rep ? major_rep: m[2]) || null;
	                        ret.minor = m[3] ? parseInt(m[3]) : null;
	                        ret.patch = m[4] ? parseInt(m[4]) : null;
	                        ret.tablet = obj.tablet;
	                        ret.man = obj.manufacturer || null;
	                        return ret;
	                    }
	                    return parser;
	                });
	            };
	            // User Agent
	            var UserAgent = function() {};
	            // Browsers Parsed
	            var browser_parsers = parsers("browser");
	            // Operating Systems Parsed
	            var os_parsers = parsers("os");
	            // Devices Parsed
	            var device_parsers = parsers("device");
	            // Set Agent
	            var a = new UserAgent();
	            // Remember the original user agent string
	            a.source = ua;
	            // Set Browser
	            a.browser = find(ua, browser_parsers);
	            if (check(a.browser)) {
	                a.browser.name = toString(a.browser);
	                a.browser.version = toVersionString(a.browser);
	            } else {
	                a.browser = {};
	            }
	            // Set OS
	            a.os = find(ua, os_parsers);
	            if (check(a.os)) {
	                a.os.name = toString(a.os);
	                a.os.version = toVersionString(a.os);
	            } else {
	                a.os = {};
	            }
	            // Set Device
	            a.device = find(ua, device_parsers);
	            if (check(a.device)) {
	                a.device.name = toString(a.device);
	                a.device.version = toVersionString(a.device);
	            } else {
	                a.device = {
	                    tablet: false,
	                    family: "Other"
	                };
	            }
	            // Determine Device Type
	            var mobile_agents = {};
	            var mobile_browser_families = _this.regexes.mobile_browser_families.map(function(str) {
	                mobile_agents[str] = true;
	            });
	            var mobile_os_families = _this.regexes.mobile_os_families.map(function(str) {
	                mobile_agents[str] = true;
	            });
	            // Is Spider
	            if (a.browser.family === "Spider") {
	                a.device.type = "Spider";
	            } else if (a.browser.tablet || a.os.tablet || a.device.tablet) {
	                a.device.type = "Tablet";
	            } else if (mobile_agents.hasOwnProperty(a.browser.family)) {
	                a.device.type = "Mobile";
	            } else {
	                a.device.type = "Desktop";
	            }
	            // Determine Device Manufacturer
	            a.device.manufacturer = a.browser.man || a.os.man || a.device.man || null;
	            // Cleanup Objects
	            remove([a.browser, a.os, a.device], ["tablet", "man"]);
	            // Return Agent
	            return a;
	        };
	        // Return context
	        return _this;
	    } ();
	    // Export the Underscore object for **Node.js** and **"CommonJS"**,
	    // backwards-compatibility for the old `require()` API. If we're not
	    // CommonJS, add `_` to the global object via a string identifier
	    // the Closure Compiler "advanced" mode. Registration as an AMD
	    // via define() happens at the end of this file
	    if (typeof exports !== "undefined") {
	        if (typeof module !== "undefined" && module.exports) {
	            exports = module.exports = detect;
	        }
	        exports.detect = detect;
	    } else {
	        root["detect"] = detect;
	    }
	    // AMD define happens at the end for compatibility with AMD
	    // that don't enforce next-turn semantics on modules
	    if (typeof define === "function" && define.amd) {
	        define(function(require) {
	            return detect;
	        });
	    }
	})(window);


	function importJQCookie(){

		/*
		 * ! jQuery Cookie Plugin v1.4.1
		 * https://github.com/carhartl/jquery-cookie
		 * 
		 * Copyright 2013 Klaus Hartl Released under the MIT license
		 */
		(function (factory) {
			if (typeof define === 'function' && define.amd) {
				// AMD
				define(['jquery'], factory);
			} else if (typeof exports === 'object') {
				// CommonJS
				factory(require('jquery'));
			} else {
				// Browser globals
				factory(jQuery);
			}
		}(function ($) {

			var pluses = /\+/g;

			function encode(s) {
				return config.raw ? s : encodeURIComponent(s);
			}

			function decode(s) {
				return config.raw ? s : decodeURIComponent(s);
			}

			function stringifyCookieValue(value) {
				return encode(config.json ? JSON.stringify(value) : String(value));
			}

			function parseCookieValue(s) {
				if (s.indexOf('"') === 0) {
					// This is a quoted cookie as according to RFC2068,
					// unescape...
					s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
				}

				try {
					// Replace server-side written pluses with spaces.
					// If we can't decode the cookie, ignore it, it's unusable.
					// If we can't parse the cookie, ignore it, it's unusable.
					s = decodeURIComponent(s.replace(pluses, ' '));
					return config.json ? JSON.parse(s) : s;
				} catch(e) {}
			}

			function read(s, converter) {
				var value = config.raw ? s : parseCookieValue(s);
				return $.isFunction(converter) ? converter(value) : value;
			}

			var config = $.cookie = function (key, value, options) {

				// Write

				if (value !== undefined && !$.isFunction(value)) {
					options = $.extend({}, config.defaults, options);

					if (typeof options.expires === 'number') {
						var days = options.expires, t = options.expires = new Date();
						t.setTime(+t + days * 864e+5);
					}

					return (document.cookie = [
						encode(key), '=', stringifyCookieValue(value),
						options.expires ? '; expires=' + options.expires.toUTCString() : '', // use
																								// expires
																								// attribute,
																								// max-age
																								// is
																								// not
																								// supported
																								// by
																								// IE
						options.path    ? '; path=' + options.path : '',
						options.domain  ? '; domain=' + options.domain : '',
						options.secure  ? '; secure' : ''
					].join(''));
				}

				var result = key ? undefined : {};
				var cookies = document.cookie ? document.cookie.split('; ') : [];

				for (var i = 0, l = cookies.length; i < l; i++) {
					var parts = cookies[i].split('=');
					var name = decode(parts.shift());
					var cookie = parts.join('=');

					if (key && key === name) {
						result = read(cookie, value);
						break;
					}

					if (!key && (cookie = read(cookie)) !== undefined) {
						result[name] = cookie;
					}
				}

				return result;
			};

			config.defaults = {};

			$.removeCookie = function (key, options) {
				if ($.cookie(key) === undefined) {
					return false;
				}

				// Must not alter options, thus extending a fresh object...
				$.cookie(key, '', $.extend({}, options, { expires: -1 }));
				return !$.cookie(key);
			};

		}));
	}

	function getScript(url, success) {
	    var script = document.createElement('script');
	    script.src = url;
	    var head = document.getElementsByTagName('head')[0],
	    done = false;
	    // Attach handlers for all browsers
	    script.onload = script.onreadystatechange = function() {
	        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
	            done = true;
	            success();
	            script.onload = script.onreadystatechange = null;
	            head.removeChild(script);
	        };
	    };
	    head.appendChild(script);
	};


	/**
	 * 
	 * 使用方式： 调用 _at_tool.init(data);即可实现用户信息提交
	 * 
	 * data可填入字段项： { appname：应用系统的名字; 如："中国日报网" uid：用户的唯一id; 如："u10a0878" }
	 * 
	 * 例如： var _hmt = _hmt || []; (function() { var hm =
	 * document.createElement("script"); hm.src =
	 * "//localhost:8002/analytics?token=fdsdafewghrhjkln"; var s =
	 * document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(hm,
	 * s); })();
	 * 
	 * var data={}; data.appname="chinadaily"; data.uid="aacdgghr3";
	 * _at_tool.init(data);
	 * 
	 */

	_at_tool.init=function(data){
		_at_tool.data=data;
		_at_tool.launch();
	}

	_at_tool.info={};

	_at_tool.focusStatus="";
	
	_at_tool.getFocusStatus=function(){
		var hidden, state, visibilityChange; 
		if (typeof document.hidden !== "undefined") {
			hidden = "hidden";
			visibilityChange = "visibilitychange";
			state = "visibilityState";
		} else if (typeof document.mozHidden !== "undefined") {
			hidden = "mozHidden";
			visibilityChange = "mozvisibilitychange";
			state = "mozVisibilityState";
		} else if (typeof document.msHidden !== "undefined") {
			hidden = "msHidden";
			visibilityChange = "msvisibilitychange";
			state = "msVisibilityState";
		} else if (typeof document.webkitHidden !== "undefined") {
			hidden = "webkitHidden";
			visibilityChange = "webkitvisibilitychange";
			state = "webkitVisibilityState";
		}
		_at_tool.focusStatus=document[state];
		
		// 添加监听器，在title里显示状态变化
		document.addEventListener(visibilityChange, function() {
			if (document[state] === 'hidden') {
				_at_tool.focusStatus =document[state]; // 页面不可见时 ，可换成你的 title
			} else {
				_at_tool.focusStatus =document[state]; // 页面可见
			}
		}, false);
	}

	_at_tool.launch=function launch(){
		importJQCookie();
		_at_tool.getFocusStatus();
		_at_tool.unloadEvent();
		_at_tool.postStatus();
	}

	_at_tool.unloadEvent=function launch(){
		$(window).unload(function(){
			_at_tool.info.leave="true";
			_at_tool.postStatus();
		});
	}
	
	
	function encryptByDES(message, key) {  
	    var keyHex = CryptoJS.enc.Utf8.parse(key);  
	    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {  
	        mode: CryptoJS.mode.ECB,  
	        padding: CryptoJS.pad.Pkcs7  
	    });  
	    return encrypted.toString();  
	}  
	
	function decryptByDES(message, key) {  
	    var keyHex = CryptoJS.enc.Utf8.parse(key);  
	    var decrypted = CryptoJS.DES.decrypt(message, keyHex, {
	        mode: CryptoJS.mode.ECB,
	        padding: CryptoJS.pad.Pkcs7
	    });
	    return decrypted.toString();  
	}  

	_at_tool.info.ft=Date.parse(new Date())/1000;
	_at_tool.info.count=0;
	
	/***用户行为采集***/
	_at_tool.postStatus= function postStatus(){
		//过滤url，只要合法url
		if(verifyURL()==false){
			return;
		}
		
		var ua = detect.parse(navigator.userAgent);
		var info ;
		if(!(typeof app_uid_ === 'undefined')){
			info.app_uid_=app_uid_;
		}
		
		if(_at_tool.info.count>0){
			info={};
		}else{
			info = _at_tool.info;
		}
		//超过一个小时不再提交
		if(Date.parse(new Date())/1000-_at_tool.info.ft>3550){
			return;
		}
		info.fs=_at_tool.focusStatus;// focusStatus
		if(_at_tool.info.count>0){
			info.count=_at_tool.info.count;
			info.duration=Date.parse(new Date())/1000-_at_tool.info.ft;
		}else{
			info.fs=_at_tool.focusStatus;// focusStatus
			info.ad=_at_tool.data;// appdata
			info.bf=ua.browser.family;// browser_family
			info.bv=ua.browser.version;// browser_version
			info.df=ua.device.family;// device_family
			info.dv=ua.device.version;// device_version
			info.of=ua.os.family;// os_family
			info.ov=ua.os.version;// os_version
			info.rr=document.referrer;// referrer
			info.lang=navigator.language;
			info.title=document.title;
			info.sh=window.screen.height;// screen_h
			info.sw=window.screen.width;// screen_w
			info.url=document.URL;
			info.lt=Date.parse(new Date())/1000;// localtime
		}
		var message = JSON.stringify(info);  
		var ciphertext = encryptByDES(message, __i_tk);  
		var pdata;

		if(!_at_tool._aid){
			pdata={d:ciphertext,rec:1};
		}else{
			pdata={d:ciphertext,_aid:_at_tool._aid};// aid:访问的唯一标识
		}
		jQuery.ajax(
			  {
				  type: 'GET',
				  dataType: 'jsonp', 
				  url:__render_host+"uac",
				  async:true,
				  data:pdata,
				  jsonp:'icb_uac',
				  jsonpCallback:'icb_uac', 
			      success: function(json){ 
			    	  if(info.count==0){
			    		  _at_tool._aid=json._aid;
			    			render_msg(json)
			    	  }
			    	  _at_tool.info.count= _at_tool.info.count+1;
			    	  setTimeout(function(){_at_tool.postStatus();},__render_refresh); 
	              },error:function(){
	            	  setTimeout(function(){_at_tool.postStatus();},__render_refresh); 
	              }
			  }
		);
	}
}


function strToHexCharCode(str) {
	if (str === "")
		return "";
	var hexCharCode = [];
	hexCharCode.push("0x");
	for (var i = 0; i < str.length; i++) {
		hexCharCode.push((str.charCodeAt(i)).toString(16));
	}
	return hexCharCode.join("");
}

function hexCharCodeToStr(hexCharCodeStr) {
	var trimedStr = hexCharCodeStr.trim();
	var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr
			.substr(2)
			: trimedStr;
	var len = rawStr.length;
	if (len % 2 !== 0) {
		return "";
	}
	var curCharCode;
	var resultStr = [];
	for (var i = 0; i < len; i = i + 2) {
		curCharCode = parseInt(rawStr.substr(i, 2), 16);
		resultStr.push(String.fromCharCode(curCharCode));
	}
	return resultStr.join("");
}

function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name
			+ "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg)) {
		console.log("#@@"+unescape(arr[2]));
		return unescape(arr[2]);
	} else {
		return null;
	}
}

function getUserInfo(){
	if(getCookie("U_INFO")!=null){
		var temp = getCookie("U_INFO").replace("\"","").replace("\"","");
		var desTemp = decryptByDES(temp,__i_tk);
		return hexCharCodeToStr(desTemp);
	}else{
		return '{"status":"0","msg":"未登录"}';
	}
}
=======
var _at_tool={};
{
	if (!Array.prototype.indexOf){  
        Array.prototype.indexOf = function(elt /*, from*/){  
        var len = this.length >>> 0;  
        var from = Number(arguments[1]) || 0;  
        from = (from < 0)  
             ? Math.ceil(from)  
             : Math.floor(from);  
        if (from < 0)  
          from += len;  
        for (; from < len; from++)  
        {  
          if (from in this &&  
              this[from] === elt)  
            return from;  
        }  
        return -1;  
      };  
    }  
	
/**跨域通信兼容方案**/
	window._CD_Messenger__ = (function(){

	    // 消息前缀, 建议使用自己的项目名, 避免多项目之间的冲突
	    // !注意 消息前缀应使用字符串类型
	    var prefix = "[PROJECT_NAME]",
	        supportPostMessage = 'postMessage' in window;

	    // Target 类, 消息对象
	    function Target(target, name, prefix){
	        var errMsg = '';
	        if(arguments.length < 2){
	            errMsg = 'target error - target and name are both required';
	        } else if (typeof target != 'object'){
	            errMsg = 'target error - target itself must be window object';
	        } else if (typeof name != 'string'){
	            errMsg = 'target error - target name must be string type';
	        }
	        if(errMsg){
	            throw new Error(errMsg);
	        }
	        this.target = target;
	        this.name = name;
	        this.prefix = prefix;
	    }

	    // 往 target 发送消息, 出于安全考虑, 发送消息会带上前缀
	    if ( supportPostMessage ){
	        // IE8+ 以及现代浏览器支持
	        Target.prototype.send = function(msg){
	            this.target.postMessage(this.prefix + '|' + this.name + '__Messenger__' + msg, '*');
	        };
	    } else {
	        // 兼容IE 6/7
	        Target.prototype.send = function(msg){
	            var targetFunc = window.navigator[this.prefix + this.name];
	            if ( typeof targetFunc == 'function' ) {
	                targetFunc(this.prefix + msg, window);
	            } else {
	                throw new Error("target callback function is not defined");
	            }
	        };
	    }

	    // 信使类
	    // 创建Messenger实例时指定, 必须指定Messenger的名字, (可选)指定项目名, 以避免Mashup类应用中的冲突
	    // !注意: 父子页面中projectName必须保持一致, 否则无法匹配
	    function Messenger(messengerName, projectName){
	        this.targets = {};
	        this.name = messengerName;
	        this.listenFunc = [];
	        this.prefix = projectName || prefix;
	        this.initListen();
	    }

	    // 添加一个消息对象
	    Messenger.prototype.addTarget = function(target, name){
	        var targetObj = new Target(target, name,  this.prefix);
	        this.targets[name] = targetObj;
	    };

	    // 初始化消息监听
	    Messenger.prototype.initListen = function(){
	        var self = this;
	        var generalCallback = function(msg){
	            if(typeof msg == 'object' && msg.data){
	                msg = msg.data;
	            }
	            
	            var msgPairs = msg.split('__Messenger__');
	            var msg = msgPairs[1];
	            var pairs = msgPairs[0].split('|');
	            var prefix = pairs[0];
	            var name = pairs[1];

	            for(var i = 0; i < self.listenFunc.length; i++){
	                if (prefix + name === self.prefix + self.name) {
	                    self.listenFunc[i](msg);
	                }
	            }
	        };

	        if ( supportPostMessage ){
	            if ( 'addEventListener' in document ) {
	                window.addEventListener('message', generalCallback, false);
	            } else if ( 'attachEvent' in document ) {
	                window.attachEvent('onmessage', generalCallback);
	            }
	        } else {
	            // 兼容IE 6/7
	            window.navigator[this.prefix + this.name] = generalCallback;
	        }
	    };

	    // 监听消息
	    Messenger.prototype.listen = function(callback){
	        var i = 0;
	        var len = this.listenFunc.length;
	        var cbIsExist = false;
	        for (; i < len; i++) {
	            if (this.listenFunc[i] == callback) {
	                cbIsExist = true;
	                break;
	            }
	        }
	        if (!cbIsExist) {
	            this.listenFunc.push(callback);
	        }
	    };
	    // 注销监听
	    Messenger.prototype.clear = function(){
	        this.listenFunc = [];
	    };
	    // 广播消息
	    Messenger.prototype.send = function(msg){
	        var targets = this.targets,
	            target;
	        for(target in targets){
	            if(targets.hasOwnProperty(target)){
	                targets[target].send(msg);
	            }
	        }
	    };

	    return Messenger;
	})();

	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
	
	var __i_tk = base64decode('Z2FpbnR3ZWI=');
	
	/**
	 * base64编码
	 * 
	 * @param {Object}
	 *            str
	 */
	function base64encode(str){
	    var out, i, len;
	    var c1, c2, c3;
	    len = str.length;
	    i = 0;
	    out = "";
	    while (i < len) {
	        c1 = str.charCodeAt(i++) & 0xff;
	        if (i == len) {
	            out += base64EncodeChars.charAt(c1 >> 2);
	            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
	            out += "==";
	            break;
	        }
	        c2 = str.charCodeAt(i++);
	        if (i == len) {
	            out += base64EncodeChars.charAt(c1 >> 2);
	            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
	            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
	            out += "=";
	            break;
	        }
	        c3 = str.charCodeAt(i++);
	        out += base64EncodeChars.charAt(c1 >> 2);
	        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
	        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
	        out += base64EncodeChars.charAt(c3 & 0x3F);
	    }
	    return out;
	}
	/**
	 * base64解码
	 * 
	 * @param {Object}
	 *            str
	 */
	function base64decode(str){
		if( typeof str == "undefined"){
			
			return "";
		}
	    var c1, c2, c3, c4;
	    var i, len, out;
	    len = str.length;
	    i = 0;
	    out = "";
	    while (i < len) {
	        /* c1 */
	        do {
	            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
	        }
	        while (i < len && c1 == -1);
	        if (c1 == -1) 
	            break;
	        /* c2 */
	        do {
	            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
	        }
	        while (i < len && c2 == -1);
	        if (c2 == -1) 
	            break;
	        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
	        /* c3 */
	        do {
	            c3 = str.charCodeAt(i++) & 0xff;
	            if (c3 == 61) 
	                return out;
	            c3 = base64DecodeChars[c3];
	        }
	        while (i < len && c3 == -1);
	        if (c3 == -1) 
	            break;
	        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
	        /* c4 */
	        do {
	            c4 = str.charCodeAt(i++) & 0xff;
	            if (c4 == 61) 
	                return out;
	            c4 = base64DecodeChars[c4];
	        }
	        while (i < len && c4 == -1);
	        if (c4 == -1) 
	            break;
	        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
	    }
	    return out;
	}
	/**
	 * utf16转utf8
	 * 
	 * @param {Object}
	 *            str
	 */
	function utf16to8(str){
	    var out, i, len, c;
	    out = "";
	    len = str.length;
	    for (i = 0; i < len; i++) {
	        c = str.charCodeAt(i);
	        if ((c >= 0x0001) && (c <= 0x007F)) {
	            out += str.charAt(i);
	        }
	        else 
	            if (c > 0x07FF) {
	                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
	                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
	                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
	            }
	            else {
	                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
	                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
	            }
	    }
	    return out;
	}
	/**
	 * utf8转utf16
	 * 
	 * @param {Object}
	 *            str
	 */
	function utf8to16(str){
	    var out, i, len, c;
	    var char2, char3;
	    out = "";
	    len = str.length;
	    i = 0;
	    while (i < len) {
	        c = str.charCodeAt(i++);
	        switch (c >> 4) {
	            case 0:
	            case 1:
	            case 2:
	            case 3:
	            case 4:
	            case 5:
	            case 6:
	            case 7:
	                out += str.charAt(i - 1);
	                break;
	            case 12:
	            case 13:
	                char2 = str.charCodeAt(i++);
	                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
	                break;
	            case 14:
	                char2 = str.charCodeAt(i++);
	                char3 = str.charCodeAt(i++);
	                out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
	                break;
	        }
	    }
	    return out;
	}
	
/*
 * CryptoJS v3.1.2 code.google.com/p/crypto-js (c) 2009-2013 by Jeff Mott. All
 * rights reserved. code.google.com/p/crypto-js/wiki/License
 */  
var CryptoJS=CryptoJS||function(u,l){var d={},n=d.lib={},p=function(){},s=n.Base={extend:function(a){p.prototype=this;var c=new p;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},  
q=n.WordArray=s.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=l?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,m=a.words,f=this.sigBytes;a=a.sigBytes;this.clamp();if(f%4)for(var t=0;t<a;t++)c[f+t>>>2]|=(m[t>>>2]>>>24-8*(t%4)&255)<<24-8*((f+t)%4);else if(65535<m.length)for(t=0;t<a;t+=4)c[f+t>>>2]=m[t>>>2];else c.push.apply(c,m);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<  
32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=s.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],m=0;m<a;m+=4)c.push(4294967296*u.random()|0);return new q.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var m=[],f=0;f<a;f++){var t=c[f>>>2]>>>24-8*(f%4)&255;m.push((t>>>4).toString(16));m.push((t&15).toString(16))}return m.join("")},parse:function(a){for(var c=a.length,m=[],f=0;f<c;f+=2)m[f>>>3]|=parseInt(a.substr(f,  
2),16)<<24-4*(f%8);return new q.init(m,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var m=[],f=0;f<a;f++)m.push(String.fromCharCode(c[f>>>2]>>>24-8*(f%4)&255));return m.join("")},parse:function(a){for(var c=a.length,m=[],f=0;f<c;f++)m[f>>>2]|=(a.charCodeAt(f)&255)<<24-8*(f%4);return new q.init(m,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},  
r=n.BufferedBlockAlgorithm=s.extend({reset:function(){this._data=new q.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,m=c.words,f=c.sigBytes,t=this.blockSize,b=f/(4*t),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*t;f=u.min(4*a,f);if(a){for(var e=0;e<a;e+=t)this._doProcessBlock(m,e);e=m.splice(0,a);c.sigBytes-=f}return new q.init(e,f)},clone:function(){var a=s.clone.call(this);  
a._data=this._data.clone();return a},_minBufferSize:0});n.Hasher=r.extend({cfg:s.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){r.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,m){return(new a.init(m)).finalize(c)}},_createHmacHelper:function(a){return function(c,m){return(new e.HMAC.init(a,  
m)).finalize(c)}}});var e=d.algo={};return d}(Math);  
(function(){var u=CryptoJS,l=u.lib.WordArray;u.enc.Base64={stringify:function(d){var n=d.words,l=d.sigBytes,s=this._map;d.clamp();d=[];for(var q=0;q<l;q+=3)for(var w=(n[q>>>2]>>>24-8*(q%4)&255)<<16|(n[q+1>>>2]>>>24-8*((q+1)%4)&255)<<8|n[q+2>>>2]>>>24-8*((q+2)%4)&255,v=0;4>v&&q+0.75*v<l;v++)d.push(s.charAt(w>>>6*(3-v)&63));if(n=s.charAt(64))for(;d.length%4;)d.push(n);return d.join("")},parse:function(d){var n=d.length,p=this._map,s=p.charAt(64);s&&(s=d.indexOf(s),-1!=s&&(n=s));for(var s=[],q=0,w=0;w<  
n;w++)if(w%4){var v=p.indexOf(d.charAt(w-1))<<2*(w%4),b=p.indexOf(d.charAt(w))>>>6-2*(w%4);s[q>>>2]|=(v|b)<<24-8*(q%4);q++}return l.create(s,q)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();  
(function(u){function l(b,e,a,c,m,f,t){b=b+(e&a|~e&c)+m+t;return(b<<f|b>>>32-f)+e}function d(b,e,a,c,m,f,t){b=b+(e&c|a&~c)+m+t;return(b<<f|b>>>32-f)+e}function n(b,e,a,c,m,f,t){b=b+(e^a^c)+m+t;return(b<<f|b>>>32-f)+e}function p(b,e,a,c,m,f,t){b=b+(a^(e|~c))+m+t;return(b<<f|b>>>32-f)+e}for(var s=CryptoJS,q=s.lib,w=q.WordArray,v=q.Hasher,q=s.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;q=q.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},  
_doProcessBlock:function(r,e){for(var a=0;16>a;a++){var c=e+a,m=r[c];r[c]=(m<<8|m>>>24)&16711935|(m<<24|m>>>8)&4278255360}var a=this._hash.words,c=r[e+0],m=r[e+1],f=r[e+2],t=r[e+3],y=r[e+4],q=r[e+5],s=r[e+6],w=r[e+7],v=r[e+8],u=r[e+9],x=r[e+10],z=r[e+11],A=r[e+12],B=r[e+13],C=r[e+14],D=r[e+15],g=a[0],h=a[1],j=a[2],k=a[3],g=l(g,h,j,k,c,7,b[0]),k=l(k,g,h,j,m,12,b[1]),j=l(j,k,g,h,f,17,b[2]),h=l(h,j,k,g,t,22,b[3]),g=l(g,h,j,k,y,7,b[4]),k=l(k,g,h,j,q,12,b[5]),j=l(j,k,g,h,s,17,b[6]),h=l(h,j,k,g,w,22,b[7]),  
g=l(g,h,j,k,v,7,b[8]),k=l(k,g,h,j,u,12,b[9]),j=l(j,k,g,h,x,17,b[10]),h=l(h,j,k,g,z,22,b[11]),g=l(g,h,j,k,A,7,b[12]),k=l(k,g,h,j,B,12,b[13]),j=l(j,k,g,h,C,17,b[14]),h=l(h,j,k,g,D,22,b[15]),g=d(g,h,j,k,m,5,b[16]),k=d(k,g,h,j,s,9,b[17]),j=d(j,k,g,h,z,14,b[18]),h=d(h,j,k,g,c,20,b[19]),g=d(g,h,j,k,q,5,b[20]),k=d(k,g,h,j,x,9,b[21]),j=d(j,k,g,h,D,14,b[22]),h=d(h,j,k,g,y,20,b[23]),g=d(g,h,j,k,u,5,b[24]),k=d(k,g,h,j,C,9,b[25]),j=d(j,k,g,h,t,14,b[26]),h=d(h,j,k,g,v,20,b[27]),g=d(g,h,j,k,B,5,b[28]),k=d(k,g,  
h,j,f,9,b[29]),j=d(j,k,g,h,w,14,b[30]),h=d(h,j,k,g,A,20,b[31]),g=n(g,h,j,k,q,4,b[32]),k=n(k,g,h,j,v,11,b[33]),j=n(j,k,g,h,z,16,b[34]),h=n(h,j,k,g,C,23,b[35]),g=n(g,h,j,k,m,4,b[36]),k=n(k,g,h,j,y,11,b[37]),j=n(j,k,g,h,w,16,b[38]),h=n(h,j,k,g,x,23,b[39]),g=n(g,h,j,k,B,4,b[40]),k=n(k,g,h,j,c,11,b[41]),j=n(j,k,g,h,t,16,b[42]),h=n(h,j,k,g,s,23,b[43]),g=n(g,h,j,k,u,4,b[44]),k=n(k,g,h,j,A,11,b[45]),j=n(j,k,g,h,D,16,b[46]),h=n(h,j,k,g,f,23,b[47]),g=p(g,h,j,k,c,6,b[48]),k=p(k,g,h,j,w,10,b[49]),j=p(j,k,g,h,  
C,15,b[50]),h=p(h,j,k,g,q,21,b[51]),g=p(g,h,j,k,A,6,b[52]),k=p(k,g,h,j,t,10,b[53]),j=p(j,k,g,h,x,15,b[54]),h=p(h,j,k,g,m,21,b[55]),g=p(g,h,j,k,v,6,b[56]),k=p(k,g,h,j,D,10,b[57]),j=p(j,k,g,h,s,15,b[58]),h=p(h,j,k,g,B,21,b[59]),g=p(g,h,j,k,y,6,b[60]),k=p(k,g,h,j,z,10,b[61]),j=p(j,k,g,h,f,15,b[62]),h=p(h,j,k,g,u,21,b[63]);a[0]=a[0]+g|0;a[1]=a[1]+h|0;a[2]=a[2]+j|0;a[3]=a[3]+k|0},_doFinalize:function(){var b=this._data,e=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;e[c>>>5]|=128<<24-c%32;var m=u.floor(a/  
4294967296);e[(c+64>>>9<<4)+15]=(m<<8|m>>>24)&16711935|(m<<24|m>>>8)&4278255360;e[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(e.length+1);this._process();b=this._hash;e=b.words;for(a=0;4>a;a++)c=e[a],e[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});s.MD5=v._createHelper(q);s.HmacMD5=v._createHmacHelper(q)})(Math);  
(function(){var u=CryptoJS,l=u.lib,d=l.Base,n=l.WordArray,l=u.algo,p=l.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:l.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,l){for(var p=this.cfg,v=p.hasher.create(),b=n.create(),u=b.words,r=p.keySize,p=p.iterations;u.length<r;){e&&v.update(e);var e=v.update(d).finalize(l);v.reset();for(var a=1;a<p;a++)e=v.finalize(e),v.reset();b.concat(e)}b.sigBytes=4*r;return b}});u.EvpKDF=function(d,l,n){return p.create(n).compute(d,  
l)}})();  
CryptoJS.lib.Cipher||function(u){var l=CryptoJS,d=l.lib,n=d.Base,p=d.WordArray,s=d.BufferedBlockAlgorithm,q=l.enc.Base64,w=l.algo.EvpKDF,v=d.Cipher=s.extend({cfg:n.extend(),createEncryptor:function(m,a){return this.create(this._ENC_XFORM_MODE,m,a)},createDecryptor:function(m,a){return this.create(this._DEC_XFORM_MODE,m,a)},init:function(m,a,b){this.cfg=this.cfg.extend(b);this._xformMode=m;this._key=a;this.reset()},reset:function(){s.reset.call(this);this._doReset()},process:function(a){this._append(a);return this._process()},  
finalize:function(a){a&&this._append(a);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(m){return{encrypt:function(f,b,e){return("string"==typeof b?c:a).encrypt(m,f,b,e)},decrypt:function(f,b,e){return("string"==typeof b?c:a).decrypt(m,f,b,e)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=l.mode={},x=function(a,f,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var e=0;e<b;e++)a[f+e]^=  
c[e]},r=(d.BlockCipherMode=n.extend({createEncryptor:function(a,f){return this.Encryptor.create(a,f)},createDecryptor:function(a,f){return this.Decryptor.create(a,f)},init:function(a,f){this._cipher=a;this._iv=f}})).extend();r.Encryptor=r.extend({processBlock:function(a,f){var b=this._cipher,c=b.blockSize;x.call(this,a,f,c);b.encryptBlock(a,f);this._prevBlock=a.slice(f,f+c)}});r.Decryptor=r.extend({processBlock:function(a,b){var c=this._cipher,e=c.blockSize,d=a.slice(b,b+e);c.decryptBlock(a,b);x.call(this,  
a,b,e);this._prevBlock=d}});b=b.CBC=r;r=(l.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,e=c<<24|c<<16|c<<8|c,d=[],l=0;l<c;l+=4)d.push(e);c=p.create(d,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:r}),reset:function(){v.reset.call(this);var a=this.cfg,c=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var b=a.createEncryptor;else b=a.createDecryptor,this._minBufferSize=1;this._mode=b.call(a,  
this,c&&c.words)},_doProcessBlock:function(a,c){this._mode.processBlock(a,c)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var c=this._process(!0)}else c=this._process(!0),a.unpad(c);return c},blockSize:4});var e=d.CipherParams=n.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(l.format={}).OpenSSL={stringify:function(a){var c=a.ciphertext;a=a.salt;return(a?p.create([1398893684,  
1701076831]).concat(a).concat(c):c).toString(q)},parse:function(a){a=q.parse(a);var c=a.words;if(1398893684==c[0]&&1701076831==c[1]){var b=p.create(c.slice(2,4));c.splice(0,4);a.sigBytes-=16}return e.create({ciphertext:a,salt:b})}},a=d.SerializableCipher=n.extend({cfg:n.extend({format:b}),encrypt:function(a,c,b,d){d=this.cfg.extend(d);var l=a.createEncryptor(b,d);c=l.finalize(c);l=l.cfg;return e.create({ciphertext:c,key:b,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},  
decrypt:function(a,c,b,e){e=this.cfg.extend(e);c=this._parse(c,e.format);return a.createDecryptor(b,e).finalize(c.ciphertext)},_parse:function(a,c){return"string"==typeof a?c.parse(a,this):a}}),l=(l.kdf={}).OpenSSL={execute:function(a,c,b,d){d||(d=p.random(8));a=w.create({keySize:c+b}).compute(a,d);b=p.create(a.words.slice(c),4*b);a.sigBytes=4*c;return e.create({key:a,iv:b,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:l}),encrypt:function(c,b,e,d){d=this.cfg.extend(d);e=d.kdf.execute(e,  
c.keySize,c.ivSize);d.iv=e.iv;c=a.encrypt.call(this,c,b,e.key,d);c.mixIn(e);return c},decrypt:function(c,b,e,d){d=this.cfg.extend(d);b=this._parse(b,d.format);e=d.kdf.execute(e,c.keySize,c.ivSize,b.salt);d.iv=e.iv;return a.decrypt.call(this,c,b,e.key,d)}})}();  
(function(){function u(b,a){var c=(this._lBlock>>>b^this._rBlock)&a;this._rBlock^=c;this._lBlock^=c<<b}function l(b,a){var c=(this._rBlock>>>b^this._lBlock)&a;this._lBlock^=c;this._rBlock^=c<<b}var d=CryptoJS,n=d.lib,p=n.WordArray,n=n.BlockCipher,s=d.algo,q=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4],w=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,  
55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32],v=[1,2,4,6,8,10,12,14,15,17,19,21,23,25,27,28],b=[{"0":8421888,268435456:32768,536870912:8421378,805306368:2,1073741824:512,1342177280:8421890,1610612736:8389122,1879048192:8388608,2147483648:514,2415919104:8389120,2684354560:33280,2952790016:8421376,3221225472:32770,3489660928:8388610,3758096384:0,4026531840:33282,134217728:0,402653184:8421890,671088640:33282,939524096:32768,1207959552:8421888,1476395008:512,1744830464:8421378,2013265920:2,  
2281701376:8389120,2550136832:33280,2818572288:8421376,3087007744:8389122,3355443200:8388610,3623878656:32770,3892314112:514,4160749568:8388608,1:32768,268435457:2,536870913:8421888,805306369:8388608,1073741825:8421378,1342177281:33280,1610612737:512,1879048193:8389122,2147483649:8421890,2415919105:8421376,2684354561:8388610,2952790017:33282,3221225473:514,3489660929:8389120,3758096385:32770,4026531841:0,134217729:8421890,402653185:8421376,671088641:8388608,939524097:512,1207959553:32768,1476395009:8388610,  
1744830465:2,2013265921:33282,2281701377:32770,2550136833:8389122,2818572289:514,3087007745:8421888,3355443201:8389120,3623878657:0,3892314113:33280,4160749569:8421378},{"0":1074282512,16777216:16384,33554432:524288,50331648:1074266128,67108864:1073741840,83886080:1074282496,100663296:1073758208,117440512:16,134217728:540672,150994944:1073758224,167772160:1073741824,184549376:540688,201326592:524304,218103808:0,234881024:16400,251658240:1074266112,8388608:1073758208,25165824:540688,41943040:16,58720256:1073758224,  
75497472:1074282512,92274688:1073741824,109051904:524288,125829120:1074266128,142606336:524304,159383552:0,176160768:16384,192937984:1074266112,209715200:1073741840,226492416:540672,243269632:1074282496,260046848:16400,268435456:0,285212672:1074266128,301989888:1073758224,318767104:1074282496,335544320:1074266112,352321536:16,369098752:540688,385875968:16384,402653184:16400,419430400:524288,436207616:524304,452984832:1073741840,469762048:540672,486539264:1073758208,503316480:1073741824,520093696:1074282512,  
276824064:540688,293601280:524288,310378496:1074266112,327155712:16384,343932928:1073758208,360710144:1074282512,377487360:16,394264576:1073741824,411041792:1074282496,427819008:1073741840,444596224:1073758224,461373440:524304,478150656:0,494927872:16400,511705088:1074266128,528482304:540672},{"0":260,1048576:0,2097152:67109120,3145728:65796,4194304:65540,5242880:67108868,6291456:67174660,7340032:67174400,8388608:67108864,9437184:67174656,10485760:65792,11534336:67174404,12582912:67109124,13631488:65536,  
14680064:4,15728640:256,524288:67174656,1572864:67174404,2621440:0,3670016:67109120,4718592:67108868,5767168:65536,6815744:65540,7864320:260,8912896:4,9961472:256,11010048:67174400,12058624:65796,13107200:65792,14155776:67109124,15204352:67174660,16252928:67108864,16777216:67174656,17825792:65540,18874368:65536,19922944:67109120,20971520:256,22020096:67174660,23068672:67108868,24117248:0,25165824:67109124,26214400:67108864,27262976:4,28311552:65792,29360128:67174400,30408704:260,31457280:65796,32505856:67174404,  
17301504:67108864,18350080:260,19398656:67174656,20447232:0,21495808:65540,22544384:67109120,23592960:256,24641536:67174404,25690112:65536,26738688:67174660,27787264:65796,28835840:67108868,29884416:67109124,30932992:67174400,31981568:4,33030144:65792},{"0":2151682048,65536:2147487808,131072:4198464,196608:2151677952,262144:0,327680:4198400,393216:2147483712,458752:4194368,524288:2147483648,589824:4194304,655360:64,720896:2147487744,786432:2151678016,851968:4160,917504:4096,983040:2151682112,32768:2147487808,  
98304:64,163840:2151678016,229376:2147487744,294912:4198400,360448:2151682112,425984:0,491520:2151677952,557056:4096,622592:2151682048,688128:4194304,753664:4160,819200:2147483648,884736:4194368,950272:4198464,1015808:2147483712,1048576:4194368,1114112:4198400,1179648:2147483712,1245184:0,1310720:4160,1376256:2151678016,1441792:2151682048,1507328:2147487808,1572864:2151682112,1638400:2147483648,1703936:2151677952,1769472:4198464,1835008:2147487744,1900544:4194304,1966080:64,2031616:4096,1081344:2151677952,  
1146880:2151682112,1212416:0,1277952:4198400,1343488:4194368,1409024:2147483648,1474560:2147487808,1540096:64,1605632:2147483712,1671168:4096,1736704:2147487744,1802240:2151678016,1867776:4160,1933312:2151682048,1998848:4194304,2064384:4198464},{"0":128,4096:17039360,8192:262144,12288:536870912,16384:537133184,20480:16777344,24576:553648256,28672:262272,32768:16777216,36864:537133056,40960:536871040,45056:553910400,49152:553910272,53248:0,57344:17039488,61440:553648128,2048:17039488,6144:553648256,  
10240:128,14336:17039360,18432:262144,22528:537133184,26624:553910272,30720:536870912,34816:537133056,38912:0,43008:553910400,47104:16777344,51200:536871040,55296:553648128,59392:16777216,63488:262272,65536:262144,69632:128,73728:536870912,77824:553648256,81920:16777344,86016:553910272,90112:537133184,94208:16777216,98304:553910400,102400:553648128,106496:17039360,110592:537133056,114688:262272,118784:536871040,122880:0,126976:17039488,67584:553648256,71680:16777216,75776:17039360,79872:537133184,  
83968:536870912,88064:17039488,92160:128,96256:553910272,100352:262272,104448:553910400,108544:0,112640:553648128,116736:16777344,120832:262144,124928:537133056,129024:536871040},{"0":268435464,256:8192,512:270532608,768:270540808,1024:268443648,1280:2097152,1536:2097160,1792:268435456,2048:0,2304:268443656,2560:2105344,2816:8,3072:270532616,3328:2105352,3584:8200,3840:270540800,128:270532608,384:270540808,640:8,896:2097152,1152:2105352,1408:268435464,1664:268443648,1920:8200,2176:2097160,2432:8192,  
2688:268443656,2944:270532616,3200:0,3456:270540800,3712:2105344,3968:268435456,4096:268443648,4352:270532616,4608:270540808,4864:8200,5120:2097152,5376:268435456,5632:268435464,5888:2105344,6144:2105352,6400:0,6656:8,6912:270532608,7168:8192,7424:268443656,7680:270540800,7936:2097160,4224:8,4480:2105344,4736:2097152,4992:268435464,5248:268443648,5504:8200,5760:270540808,6016:270532608,6272:270540800,6528:270532616,6784:8192,7040:2105352,7296:2097160,7552:0,7808:268435456,8064:268443656},{"0":1048576,  
16:33555457,32:1024,48:1049601,64:34604033,80:0,96:1,112:34603009,128:33555456,144:1048577,160:33554433,176:34604032,192:34603008,208:1025,224:1049600,240:33554432,8:34603009,24:0,40:33555457,56:34604032,72:1048576,88:33554433,104:33554432,120:1025,136:1049601,152:33555456,168:34603008,184:1048577,200:1024,216:34604033,232:1,248:1049600,256:33554432,272:1048576,288:33555457,304:34603009,320:1048577,336:33555456,352:34604032,368:1049601,384:1025,400:34604033,416:1049600,432:1,448:0,464:34603008,480:33554433,  
496:1024,264:1049600,280:33555457,296:34603009,312:1,328:33554432,344:1048576,360:1025,376:34604032,392:33554433,408:34603008,424:0,440:34604033,456:1049601,472:1024,488:33555456,504:1048577},{"0":134219808,1:131072,2:134217728,3:32,4:131104,5:134350880,6:134350848,7:2048,8:134348800,9:134219776,10:133120,11:134348832,12:2080,13:0,14:134217760,15:133152,2147483648:2048,2147483649:134350880,2147483650:134219808,2147483651:134217728,2147483652:134348800,2147483653:133120,2147483654:133152,2147483655:32,  
2147483656:134217760,2147483657:2080,2147483658:131104,2147483659:134350848,2147483660:0,2147483661:134348832,2147483662:134219776,2147483663:131072,16:133152,17:134350848,18:32,19:2048,20:134219776,21:134217760,22:134348832,23:131072,24:0,25:131104,26:134348800,27:134219808,28:134350880,29:133120,30:2080,31:134217728,2147483664:131072,2147483665:2048,2147483666:134348832,2147483667:133152,2147483668:32,2147483669:134348800,2147483670:134217728,2147483671:134219808,2147483672:134350880,2147483673:134217760,  
2147483674:134219776,2147483675:0,2147483676:133120,2147483677:2080,2147483678:131104,2147483679:134350848}],x=[4160749569,528482304,33030144,2064384,129024,8064,504,2147483679],r=s.DES=n.extend({_doReset:function(){for(var b=this._key.words,a=[],c=0;56>c;c++){var d=q[c]-1;a[c]=b[d>>>5]>>>31-d%32&1}b=this._subKeys=[];for(d=0;16>d;d++){for(var f=b[d]=[],l=v[d],c=0;24>c;c++)f[c/6|0]|=a[(w[c]-1+l)%28]<<31-c%6,f[4+(c/6|0)]|=a[28+(w[c+24]-1+l)%28]<<31-c%6;f[0]=f[0]<<1|f[0]>>>31;for(c=1;7>c;c++)f[c]>>>=  
4*(c-1)+3;f[7]=f[7]<<5|f[7]>>>27}a=this._invSubKeys=[];for(c=0;16>c;c++)a[c]=b[15-c]},encryptBlock:function(b,a){this._doCryptBlock(b,a,this._subKeys)},decryptBlock:function(b,a){this._doCryptBlock(b,a,this._invSubKeys)},_doCryptBlock:function(e,a,c){this._lBlock=e[a];this._rBlock=e[a+1];u.call(this,4,252645135);u.call(this,16,65535);l.call(this,2,858993459);l.call(this,8,16711935);u.call(this,1,1431655765);for(var d=0;16>d;d++){for(var f=c[d],n=this._lBlock,p=this._rBlock,q=0,r=0;8>r;r++)q|=b[r][((p^  
f[r])&x[r])>>>0];this._lBlock=p;this._rBlock=n^q}c=this._lBlock;this._lBlock=this._rBlock;this._rBlock=c;u.call(this,1,1431655765);l.call(this,8,16711935);l.call(this,2,858993459);u.call(this,16,65535);u.call(this,4,252645135);e[a]=this._lBlock;e[a+1]=this._rBlock},keySize:2,ivSize:2,blockSize:2});d.DES=n._createHelper(r);s=s.TripleDES=n.extend({_doReset:function(){var b=this._key.words;this._des1=r.createEncryptor(p.create(b.slice(0,2)));this._des2=r.createEncryptor(p.create(b.slice(2,4)));this._des3=  
r.createEncryptor(p.create(b.slice(4,6)))},encryptBlock:function(b,a){this._des1.encryptBlock(b,a);this._des2.decryptBlock(b,a);this._des3.encryptBlock(b,a)},decryptBlock:function(b,a){this._des3.decryptBlock(b,a);this._des2.encryptBlock(b,a);this._des1.decryptBlock(b,a)},keySize:6,ivSize:2,blockSize:2});d.TripleDES=n._createHelper(s)})();  

CryptoJS.mode.ECB = (function () {  
    var ECB = CryptoJS.lib.BlockCipherMode.extend();  
  
    ECB.Encryptor = ECB.extend({  
        processBlock: function (words, offset) {  
            this._cipher.encryptBlock(words, offset);  
        }  
    });  
  
    ECB.Decryptor = ECB.extend({  
        processBlock: function (words, offset) {  
            this._cipher.decryptBlock(words, offset);  
        }  
    });  
  
    return ECB;  
}());  

/*
 * CryptoJS v3.1.2 code.google.com/p/crypto-js (c) 2009-2013 by Jeff Mott. All
 * rights reserved. code.google.com/p/crypto-js/wiki/License
 */  
var CryptoJS=CryptoJS||function(s,p){var m={},l=m.lib={},n=function(){},r=l.Base={extend:function(b){n.prototype=this;var h=new n;b&&h.mixIn(b);h.hasOwnProperty("init")||(h.init=function(){h.$super.init.apply(this,arguments)});h.init.prototype=h;h.$super=this;return h},create:function(){var b=this.extend();b.init.apply(b,arguments);return b},init:function(){},mixIn:function(b){for(var h in b)b.hasOwnProperty(h)&&(this[h]=b[h]);b.hasOwnProperty("toString")&&(this.toString=b.toString)},clone:function(){return this.init.prototype.extend(this)}},  
q=l.WordArray=r.extend({init:function(b,h){b=this.words=b||[];this.sigBytes=h!=p?h:4*b.length},toString:function(b){return(b||t).stringify(this)},concat:function(b){var h=this.words,a=b.words,j=this.sigBytes;b=b.sigBytes;this.clamp();if(j%4)for(var g=0;g<b;g++)h[j+g>>>2]|=(a[g>>>2]>>>24-8*(g%4)&255)<<24-8*((j+g)%4);else if(65535<a.length)for(g=0;g<b;g+=4)h[j+g>>>2]=a[g>>>2];else h.push.apply(h,a);this.sigBytes+=b;return this},clamp:function(){var b=this.words,h=this.sigBytes;b[h>>>2]&=4294967295<<  
32-8*(h%4);b.length=s.ceil(h/4)},clone:function(){var b=r.clone.call(this);b.words=this.words.slice(0);return b},random:function(b){for(var h=[],a=0;a<b;a+=4)h.push(4294967296*s.random()|0);return new q.init(h,b)}}),v=m.enc={},t=v.Hex={stringify:function(b){var a=b.words;b=b.sigBytes;for(var g=[],j=0;j<b;j++){var k=a[j>>>2]>>>24-8*(j%4)&255;g.push((k>>>4).toString(16));g.push((k&15).toString(16))}return g.join("")},parse:function(b){for(var a=b.length,g=[],j=0;j<a;j+=2)g[j>>>3]|=parseInt(b.substr(j,  
2),16)<<24-4*(j%8);return new q.init(g,a/2)}},a=v.Latin1={stringify:function(b){var a=b.words;b=b.sigBytes;for(var g=[],j=0;j<b;j++)g.push(String.fromCharCode(a[j>>>2]>>>24-8*(j%4)&255));return g.join("")},parse:function(b){for(var a=b.length,g=[],j=0;j<a;j++)g[j>>>2]|=(b.charCodeAt(j)&255)<<24-8*(j%4);return new q.init(g,a)}},u=v.Utf8={stringify:function(b){try{return decodeURIComponent(escape(a.stringify(b)))}catch(g){throw Error("Malformed UTF-8 data");}},parse:function(b){return a.parse(unescape(encodeURIComponent(b)))}},  
g=l.BufferedBlockAlgorithm=r.extend({reset:function(){this._data=new q.init;this._nDataBytes=0},_append:function(b){"string"==typeof b&&(b=u.parse(b));this._data.concat(b);this._nDataBytes+=b.sigBytes},_process:function(b){var a=this._data,g=a.words,j=a.sigBytes,k=this.blockSize,m=j/(4*k),m=b?s.ceil(m):s.max((m|0)-this._minBufferSize,0);b=m*k;j=s.min(4*b,j);if(b){for(var l=0;l<b;l+=k)this._doProcessBlock(g,l);l=g.splice(0,b);a.sigBytes-=j}return new q.init(l,j)},clone:function(){var b=r.clone.call(this);  
b._data=this._data.clone();return b},_minBufferSize:0});l.Hasher=g.extend({cfg:r.extend(),init:function(b){this.cfg=this.cfg.extend(b);this.reset()},reset:function(){g.reset.call(this);this._doReset()},update:function(b){this._append(b);this._process();return this},finalize:function(b){b&&this._append(b);return this._doFinalize()},blockSize:16,_createHelper:function(b){return function(a,g){return(new b.init(g)).finalize(a)}},_createHmacHelper:function(b){return function(a,g){return(new k.HMAC.init(b,  
g)).finalize(a)}}});var k=m.algo={};return m}(Math);  
(function(s){function p(a,k,b,h,l,j,m){a=a+(k&b|~k&h)+l+m;return(a<<j|a>>>32-j)+k}function m(a,k,b,h,l,j,m){a=a+(k&h|b&~h)+l+m;return(a<<j|a>>>32-j)+k}function l(a,k,b,h,l,j,m){a=a+(k^b^h)+l+m;return(a<<j|a>>>32-j)+k}function n(a,k,b,h,l,j,m){a=a+(b^(k|~h))+l+m;return(a<<j|a>>>32-j)+k}for(var r=CryptoJS,q=r.lib,v=q.WordArray,t=q.Hasher,q=r.algo,a=[],u=0;64>u;u++)a[u]=4294967296*s.abs(s.sin(u+1))|0;q=q.MD5=t.extend({_doReset:function(){this._hash=new v.init([1732584193,4023233417,2562383102,271733878])},  
_doProcessBlock:function(g,k){for(var b=0;16>b;b++){var h=k+b,w=g[h];g[h]=(w<<8|w>>>24)&16711935|(w<<24|w>>>8)&4278255360}var b=this._hash.words,h=g[k+0],w=g[k+1],j=g[k+2],q=g[k+3],r=g[k+4],s=g[k+5],t=g[k+6],u=g[k+7],v=g[k+8],x=g[k+9],y=g[k+10],z=g[k+11],A=g[k+12],B=g[k+13],C=g[k+14],D=g[k+15],c=b[0],d=b[1],e=b[2],f=b[3],c=p(c,d,e,f,h,7,a[0]),f=p(f,c,d,e,w,12,a[1]),e=p(e,f,c,d,j,17,a[2]),d=p(d,e,f,c,q,22,a[3]),c=p(c,d,e,f,r,7,a[4]),f=p(f,c,d,e,s,12,a[5]),e=p(e,f,c,d,t,17,a[6]),d=p(d,e,f,c,u,22,a[7]),  
c=p(c,d,e,f,v,7,a[8]),f=p(f,c,d,e,x,12,a[9]),e=p(e,f,c,d,y,17,a[10]),d=p(d,e,f,c,z,22,a[11]),c=p(c,d,e,f,A,7,a[12]),f=p(f,c,d,e,B,12,a[13]),e=p(e,f,c,d,C,17,a[14]),d=p(d,e,f,c,D,22,a[15]),c=m(c,d,e,f,w,5,a[16]),f=m(f,c,d,e,t,9,a[17]),e=m(e,f,c,d,z,14,a[18]),d=m(d,e,f,c,h,20,a[19]),c=m(c,d,e,f,s,5,a[20]),f=m(f,c,d,e,y,9,a[21]),e=m(e,f,c,d,D,14,a[22]),d=m(d,e,f,c,r,20,a[23]),c=m(c,d,e,f,x,5,a[24]),f=m(f,c,d,e,C,9,a[25]),e=m(e,f,c,d,q,14,a[26]),d=m(d,e,f,c,v,20,a[27]),c=m(c,d,e,f,B,5,a[28]),f=m(f,c,  
d,e,j,9,a[29]),e=m(e,f,c,d,u,14,a[30]),d=m(d,e,f,c,A,20,a[31]),c=l(c,d,e,f,s,4,a[32]),f=l(f,c,d,e,v,11,a[33]),e=l(e,f,c,d,z,16,a[34]),d=l(d,e,f,c,C,23,a[35]),c=l(c,d,e,f,w,4,a[36]),f=l(f,c,d,e,r,11,a[37]),e=l(e,f,c,d,u,16,a[38]),d=l(d,e,f,c,y,23,a[39]),c=l(c,d,e,f,B,4,a[40]),f=l(f,c,d,e,h,11,a[41]),e=l(e,f,c,d,q,16,a[42]),d=l(d,e,f,c,t,23,a[43]),c=l(c,d,e,f,x,4,a[44]),f=l(f,c,d,e,A,11,a[45]),e=l(e,f,c,d,D,16,a[46]),d=l(d,e,f,c,j,23,a[47]),c=n(c,d,e,f,h,6,a[48]),f=n(f,c,d,e,u,10,a[49]),e=n(e,f,c,d,  
C,15,a[50]),d=n(d,e,f,c,s,21,a[51]),c=n(c,d,e,f,A,6,a[52]),f=n(f,c,d,e,q,10,a[53]),e=n(e,f,c,d,y,15,a[54]),d=n(d,e,f,c,w,21,a[55]),c=n(c,d,e,f,v,6,a[56]),f=n(f,c,d,e,D,10,a[57]),e=n(e,f,c,d,t,15,a[58]),d=n(d,e,f,c,B,21,a[59]),c=n(c,d,e,f,r,6,a[60]),f=n(f,c,d,e,z,10,a[61]),e=n(e,f,c,d,j,15,a[62]),d=n(d,e,f,c,x,21,a[63]);b[0]=b[0]+c|0;b[1]=b[1]+d|0;b[2]=b[2]+e|0;b[3]=b[3]+f|0},_doFinalize:function(){var a=this._data,k=a.words,b=8*this._nDataBytes,h=8*a.sigBytes;k[h>>>5]|=128<<24-h%32;var l=s.floor(b/  
4294967296);k[(h+64>>>9<<4)+15]=(l<<8|l>>>24)&16711935|(l<<24|l>>>8)&4278255360;k[(h+64>>>9<<4)+14]=(b<<8|b>>>24)&16711935|(b<<24|b>>>8)&4278255360;a.sigBytes=4*(k.length+1);this._process();a=this._hash;k=a.words;for(b=0;4>b;b++)h=k[b],k[b]=(h<<8|h>>>24)&16711935|(h<<24|h>>>8)&4278255360;return a},clone:function(){var a=t.clone.call(this);a._hash=this._hash.clone();return a}});r.MD5=t._createHelper(q);r.HmacMD5=t._createHmacHelper(q)})(Math);  

	
	/** **encrpty** */
	(function(window, document, undefined) {
		/*
		 * Object ES5 extend
		 */
		if (!Object.create) {
			Object.create = function (o) {
				if (arguments.length > 1) {
					throw new Error('Object.create implementation only accepts the first parameter.');
				}
				function F() {}
				F.prototype = o;
				return new F();
			};
		}
		
		if (!Object.keys) {
			Object.keys = function(o) {
				if (o !== Object(o)) {
					throw new TypeError('Object.keys called on a non-object');
				}
				var k=[], p;
				for (p in o) {
					if (Object.prototype.hasOwnProperty.call(o,p)) {
						k.push(p);
					}
				}
				return k;
			};
		}
		
		/*
		 * Date ES5 extend
		 */
		if (!Date.now) {
			Date.now = function now() {
				return (new Date).valueOf();
			};
		}
		
		/*
		 * Function ES5 extend
		 */
		if (!Function.prototype.bind) {
		  	Function.prototype.bind = function (oThis) {
				if (typeof this !== "function") {
			  		// closest thing possible to the ECMAScript 5 internal
					// IsCallable function
			  		throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
				}
		
				var aArgs = Array.prototype.slice.call(arguments, 1), 
					fToBind = this, 
					fNOP = function () {},
					fBound = function () {
				  		return fToBind.apply(this instanceof fNOP && oThis
										 ? this
										 : oThis || window,
									   aArgs.concat(Array.prototype.slice.call(arguments)));
					};
		
				fNOP.prototype = this.prototype;
				fBound.prototype = new fNOP();
		
				return fBound;
		  	};
		}
		
		/*
		 * String ES5 extend
		 */
		if(!String.prototype.trim) {
			String.prototype.trim = function () {
				return this.replace(/^\s+|\s+$/g,'');
			};
		}
		
		/*
		 * Array ES5 extend
		 */
		if(!Array.isArray) {
			Array.isArray = function (vArg) {
				return Object.prototype.toString.call(vArg) === "[object Array]";
			};
		}
		
		if (typeof Array.prototype.forEach != "function") {
		  	Array.prototype.forEach = function (fn, scope) {
				var i, len;
				for (i = 0, len = this.length; i < len; ++i) {
					if (i in this) {
						fn.call(scope, this[i], i, this);
					}
				}
	    	};
		}
		
		if (typeof Array.prototype.map != "function") {
		  Array.prototype.map = function (fn, context) {
			var arr = [];
			if (typeof fn === "function") {
			  for (var k = 0, length = this.length; k < length; k++) {
				  arr.push(fn.call(context, this[k], k, this));
			  }
			}
			return arr;
		  };
		}
		
		if (typeof Array.prototype.filter != "function") {
		  Array.prototype.filter = function (fn, context) {
			var arr = [];
			if (typeof fn === "function") {
			  for (var k = 0, length = this.length; k < length; k++) {
				  fn.call(context, this[k], k, this) && arr.push(this[k]);
			  }
			}
			return arr;
		  };
		}
		
		if (typeof Array.prototype.some != "function") {
		  Array.prototype.some = function (fn, context) {
			var passed = false;
			if (typeof fn === "function") {
			  for (var k = 0, length = this.length; k < length; k++) {
				  if (passed === true) break;
				  passed = !!fn.call(context, this[k], k, this);
			  }
			}
			return passed;
		  };
		}
		
		if (typeof Array.prototype.every != "function") {
		  Array.prototype.every = function (fn, context) {
			var passed = true;
			if (typeof fn === "function") {
			  for (var k = 0, length = this.length; k < length; k++) {
				  if (passed === false) break;
				  passed = !!fn.call(context, this[k], k, this);
			  }
			}
			return passed;
		  };
		}
		
		if (typeof Array.prototype.indexOf != "function") {
		  Array.prototype.indexOf = function (searchElement, fromIndex) {
			var index = -1;
			fromIndex = fromIndex * 1 || 0;
		
			for (var k = 0, length = this.length; k < length; k++) {
			  if (k >= fromIndex && this[k] === searchElement) {
				  index = k;
				  break;
			  }
			}
			return index;
		  };
		}
		
		if (typeof Array.prototype.lastIndexOf != "function") {
		  Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
			var index = -1, length = this.length;
			fromIndex = fromIndex * 1 || length - 1;
		
			for (var k = length - 1; k > -1; k-=1) {
				if (k <= fromIndex && this[k] === searchElement) {
					index = k;
					break;
				}
			}
			return index;
		  };
		}
		
		if (typeof Array.prototype.reduce != "function") {
		  Array.prototype.reduce = function (callback, initialValue ) {
			 var previous = initialValue, k = 0, length = this.length;
			 if (typeof initialValue === "undefined") {
				previous = this[0];
				k = 1;
			 }
			 
			if (typeof callback === "function") {
			  for (k; k < length; k++) {
				 this.hasOwnProperty(k) && (previous = callback(previous, this[k], k, this));
			  }
			}
			return previous;
		  };
		}
		
		if (typeof Array.prototype.reduceRight != "function") {
		  Array.prototype.reduceRight = function (callback, initialValue ) {
			var length = this.length, k = length - 1, previous = initialValue;
			if (typeof initialValue === "undefined") {
				previous = this[length - 1];
				k--;
			}
			if (typeof callback === "function") {
			   for (k; k > -1; k-=1) {          
				  this.hasOwnProperty(k) && (previous = callback(previous, this[k], k, this));
			   }
			}
			return previous;
		  };
		}
		
		/**
		 * dom method that extend
		 */
		var oDomExtend = {
			// selector realtive
			querySelector: function(selector) {
				return oDomExtend.querySelectorAll.call(this, selector)[0] || null;
			},
			querySelectorAll: function(selector) {
				return fDomExtend(Sizzle(selector, this));
			},
			getElementsByClassName: function(classNames) {
				return this.querySelectorAll("." + classNames.trim().replace(/\s+/, "."));
			},
			// addEventListener
			addEventListener: function(eventType, funcHandle, useCapture) {
				var element = this, eventStoreType = '';
				if (eventType == "input") { eventType = "propertychange"; }
				if (typeof funcHandle != "function") return;
				// some compatibility deal
				var eventHandle = function(event) {
					event = event || window.event || {};
					
					if (!event.target) event.target = event.srcElement;	
					if (!event.preventDefault) event.preventDefault = function() {
						event.returnValue = false;
					};
					
					if (eventType == "propertychange") {
						if (event.propertyName !== "value" || element.r_oldvalue === element.value) return;
						element.r_oldvalue = element.value;
					} 
					return funcHandle.call(element, event || {});
				};
				eventHandle.initFuncHandle = funcHandle;
				
				// event bind
				element.attachEvent("on" + eventType, eventHandle);
				
				// event store
				if (element["event" + eventType]) {
					element["event" + eventType].push(eventHandle);
				} else {
					element["event" + eventType] = [eventHandle];
				}			
			},
			dispatchEvent: function(event) {
				var eventType = event && event.type;			
				if (eventType && this["event" + eventType]) {
					event.target = this;
					this["event" + eventType].forEach(function(eventHandle) {
						event.timeStamp = Date.now();
						eventHandle.call(this, event);
					}.bind(this));
				}			
			},
			removeEventListener: function(eventType, funcHandle, useCapture) {			
				var arrEventStore = this["event" + eventType];
				if (Array.isArray(arrEventStore)) {
					this["event" + eventType] = arrEventStore.filter(function(eventHandle) {
						if (eventHandle.initFuncHandle === funcHandle) {
							this.detachEvent("on" + eventType, eventHandle);
							return false;
						}					
						return true;
					}.bind(this));
				}	
			}
			
		};
		
		var fDomExtend = function(collection) {
			// collection extend some dom method
			collection.forEach(function(element, index) {
				for (var key in oDomExtend) {
					element[key] = oDomExtend[key].bind(element);
				}
			});
			return collection;
		};
		
		/*
		 * document.querySelector, document.querySelectorAll
		 */
		document.querySelector = function(selector) {
			return document.querySelectorAll(selector)[0] || null;
		};
		document.querySelectorAll = function(selector) {
			var collection = Sizzle(selector);		
			return fDomExtend(collection);	
		};
		/*
		 * getElementsByClassName
		 */
		if (!document.getElementsByClassName) {
			document.getElementsByClassName = function(classNames) {			
				return oDomExtend.getElementsByClassName.call(document, classNames);
			};
		}
		/*
		 * addEventListener include event of "input"
		 */
		if (typeof document.addEventListener == "undefined") {
			[window, document].forEach(function(global) {
				global.addEventListener = function(eventType, funcHandle, useCapture) {
					oDomExtend.addEventListener.call(global, eventType, funcHandle, useCapture);
				};
				global.dispatchEvent = function(event) {
					oDomExtend.dispatchEvent.call(global, event);
				};
				global.removeEventListener = function() {
					if (typeof(eventType) != "undefined") 
						oDomExtend.removeEventListener.call(global, eventType, funcHandle, useCapture);	
				};
			});	
		}
		if (!document.createEvent) {
			document.createEvent = function(type) {
				var event = {};
				switch (type) {
					case "Event": case "Events": case "HTMLEvents": {
						event = {
							initEvent: function(eventType, canBubble, cancelable) {
								event.type = eventType;
								event.canBubble = canBubble || false;
								event.cancelable = cancelable || false;
								delete(event.initEvent);
							},
							bubbles: false,
							cancelBubble: false,
							cancelable: false,
							clipboardData: undefined,
							currentTarget: null,
							defaultPrevented: false,
							eventPhase: 0,
							returnValue: true,
							srcElement: null,
							target: null,
							timeStamp: Date.now(),
							type: ""	
						};					
						
						break;	
					}
					case "MouseEvents": {					
						event = {
							initMouseEvent: function(eventType, canBubble, cancelable, view, 
								detail, screenX, screenY, clientX, clientY,
								ctrlKey, altKey, shiftKey, metaKey,
								button, relatedTarget
							) {
								event.type = eventType;
								event.canBubble = canBubble || false;
								event.cancelable = cancelable || false;
								event.view = view || null;
								event.screenX = screenX || 0;
								event.screenY = screenY || 0;
								event.clientX = clientX || 0;
								event.clientY = clientY || 0;
								event.ctrlKey = ctrlKey || false;
								event.altKey = altKey || false;
								event.shiftKey = shiftKey || false;
								event.metaKey = metaKey || false;
								event.button = button || 0;
								event.relatedTarget = relatedTarget || null;
								delete(event.initMouseEvent);
							},
							altKey: false,
							bubbles: false,
							button: 0,
							cancelBubble: false,
							cancelable: false,
							charCode: 0,
							clientX: 0,
							clientY: 0,
							clipboardData: undefined,
							ctrlKey: false,
							currentTarget: null,
							dataTransfer: null,
							defaultPrevented: false,
							detail: 0,
							eventPhase: 0,
							fromElement: null,
							keyCode: 0,
							layerX: 0,
							layerY: 0,
							metaKey: false,
							offsetX: 0,
							offsetY: 0,
							pageX: 0,
							pageY: 0,
							relatedTarget: null,
							returnValue: true,
							screenX: 0,
							screenY: 0,
							shiftKey: false,
							srcElement: null,
							target: null,
							timeStamp: Date.now(),
							toElement: null,
							type: "",
							view: null,
							webkitMovementX: 0,
							webkitMovementY: 0,
							which: 0,
							x: 0,
							y: 0
						};
						
						break;
					}
					case "UIEvents": {					
						event = {
							initUIEvent: function(eventType, canBubble, cancelable, view, detail) {
								event.type = eventType;
								event.canBubble = canBubble || false;
								event.cancelable = cancelable || false;
								event.view = view || null;
								event.detail = detail || 0;
								delete(event.initUIEvent);
							},
							bubbles: false,
							cancelBubble: false,
							cancelable: false,
							charCode: 0,
							clipboardData: undefined,
							currentTarget: null,
							defaultPrevented: false,
							detail: 0,
							eventPhase: 0,
							keyCode: 0,
							layerX: 0,
							layerY: 0,
							pageX: 0,
							pageY: 0,
							returnValue: true,
							srcElement: null,
							target: null,
							timeStamp: Date.now(),
							type: "",
							view: null,
							which: 0	
						};					
						break;
					}
					default: {
						throw new TypeError("NotSupportedError: The implementation did not support the requested type of object or operation.");	
					}
				}
				return event;
			};		
		}
		
		/**
		 * onhashchange
		 */
		// exit if the browser implements that event
		if (!("addEventListener" in document.createElement("div"))) {
			var location = window.location,
				oldURL = location.href,
				oldHash = location.hash;
			
			// check the location hash on a 100ms interval
			setInterval(function() {
				var newURL = location.href,
				  newHash = location.hash;
			
				// if the hash has changed and a handler has been bound...
				if ( newHash != oldHash && typeof window.onhashchange === "function" ) {
				  // execute the handler
				  window.onhashchange({
					type: "hashchange",
					oldURL: oldURL,
					newURL: newURL
				  });
			
				  oldURL = newURL;
				  oldHash = newHash;
				}
			 }, 100);
		}
		
		/**
		 * getComputedStyle
		 */
		if (typeof window.getComputedStyle !== "function") {
			window.getComputedStyle = function(el, pseudo) {
				var oStyle = {};
				var oCurrentStyle = el.currentStyle || {};
				for (var key in oCurrentStyle) {
					oStyle[key] = oCurrentStyle[key];
				}
				 
				oStyle.styleFloat = oStyle.cssFloat;
				 
	            oStyle.getPropertyValue = function(prop) {
					// return oCurrentStyle.getAttribute(prop) || null; // IE6
					// do
					// not support "key-key" but "keyKey"
					var re = /(\-([a-z]){1})/g;
					if (prop == 'float') prop = 'styleFloat';
					if (re.test(prop)) {
						prop = prop.replace(re, function () {
							return arguments[2].toUpperCase();
						});
					}
					return el.currentStyle[prop] ? el.currentStyle[prop] : null;
				}
				return oStyle;
			}
		}
		
	})(window, document);

	/*
	 * ! Sizzle CSS Selector Engine v@VERSION http://sizzlejs.com/
	 * 
	 * Copyright 2013 jQuery Foundation, Inc. and other contributors Released
	 * under the MIT license http://jquery.org/license
	 * 
	 * Date: @DATE
	 */
	(function( window ) {

	var i,
		support,
		cachedruns,
		Expr,
		getText,
		isXML,
		compile,
		outermostContext,
		sortInput,
		hasDuplicate,

		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,

		// Instance-specific data
		expando = "sizzle" + -(new Date()),
		preferredDoc = window.document,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},

		// General-purpose constants
		strundefined = typeof undefined,
		MAX_NEGATIVE = 1 << 31,

		// Instance methods
		hasOwn = ({}).hasOwnProperty,
		arr = [],
		pop = arr.pop,
		push_native = arr.push,
		push = arr.push,
		slice = arr.slice,
		// Use a stripped-down indexOf if we can't use a native one
		indexOf = arr.indexOf || function( elem ) {
			var i = 0,
				len = this.length;
			for ( ; i < len; i++ ) {
				if ( this[i] === elem ) {
					return i;
				}
			}
			return -1;
		},

		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

		// Regular expressions

		// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",
		// http://www.w3.org/TR/css3-syntax/#characters
		characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

		// Loosely modeled on CSS identifier characters
		// An unquoted value should be a CSS identifier
		// http://www.w3.org/TR/css3-selectors/#attribute-selectors
		// Proper syntax:
		// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = characterEncoding.replace( "w", "w#" ),

		// Acceptable operators
		// http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
			"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

		// Prefer arguments quoted,
		// then not containing pseudos/brackets,
		// then attribute selectors/non-parenthetical expressions,
		// then anything else
		// These preferences are here to reduce the number of selectors
		// needing tokenize in the PSEUDO preFilter
		pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

		// Leading and non-escaped trailing whitespace, capturing some
		// non-whitespace characters preceding the latter
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

		rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),

		matchExpr = {
			"ID": new RegExp( "^#(" + characterEncoding + ")" ),
			"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
			"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
				"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
				"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
				whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},

		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,

		rnative = /^[^{]+\{\s*\[native \w/,

		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

		rsibling = /[+~]/,
		rescape = /'|\\/g,

		// CSS escapes
		// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
		funescape = function( _, escaped, escapedWhitespace ) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ?
				escaped :
				high < 0 ?
					// BMP codepoint
					String.fromCharCode( high + 0x10000 ) :
					// Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		};

	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			(arr = slice.call( preferredDoc.childNodes )),
			preferredDoc.childNodes
		);
		// Support: Android<4.0
		// Detect silently failing push.apply
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?

			// Leverage slice if possible
			function( target, els ) {
				push_native.apply( target, slice.call(els) );
			} :

			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;
				// Can't trust NodeList.length
				while ( (target[j++] = els[i++]) ) {}
				target.length = j - 1;
			}
		};
	}

	function Sizzle( selector, context, results, seed ) {
		var match, elem, m, nodeType,
			// QSA vars
			i, groups, old, nid, newContext, newSelector;

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}

		context = context || document;
		results = results || [];

		if ( !selector || typeof selector !== "string" ) {
			return results;
		}

		if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
			return [];
		}

		if ( documentIsHTML && !seed ) {

			// Shortcuts
			if ( (match = rquickExpr.exec( selector )) ) {
				// Speed-up: Sizzle("#ID")
				if ( (m = match[1]) ) {
					if ( nodeType === 9 ) {
						elem = context.getElementById( m );
						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document (jQuery
						// #6963)
						if ( elem && elem.parentNode ) {
							// Handle the case where IE, Opera, and Webkit
							// return
							// items
							// by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}
					} else {
						// Context is not a document
						if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
							contains( context, elem ) && elem.id === m ) {
							results.push( elem );
							return results;
						}
					}

				// Speed-up: Sizzle("TAG")
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Speed-up: Sizzle(".CLASS")
				} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// QSA path
			if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
				nid = old = expando;
				newContext = context;
				newSelector = nodeType === 9 && selector;

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the
				// technique)
				// IE 8 doesn't work on object elements
				if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					groups = tokenize( selector );

					if ( (old = context.getAttribute("id")) ) {
						nid = old.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", nid );
					}
					nid = "[id='" + nid + "'] ";

					i = groups.length;
					while ( i-- ) {
						groups[i] = nid + toSelector( groups[i] );
					}
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
					newSelector = groups.join(",");
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch(qsaError) {
					} finally {
						if ( !old ) {
							context.removeAttribute("id");
						}
					}
				}
			}
		}

		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}

	/**
	 * Create key-value caches of limited size
	 * 
	 * @returns {Function(string, Object)} Returns the Object data after storing
	 *          it on itself with property name the (space-suffixed) string and
	 *          (if the cache is larger than Expr.cacheLength) deleting the
	 *          oldest entry
	 */
	function createCache() {
		var keys = [];

		function cache( key, value ) {
			// Use (key + " ") to avoid collision with native prototype
			// properties
			// (see Issue #157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return (cache[ key + " " ] = value);
		}
		return cache;
	}

	/**
	 * Mark a function for special use by Sizzle
	 * 
	 * @param {Function}
	 *            fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}

	/**
	 * Support testing using an element
	 * 
	 * @param {Function}
	 *            fn Passed the created div and expects a boolean result
	 */
	function assert( fn ) {
		var div = document.createElement("div");

		try {
			return !!fn( div );
		} catch (e) {
			return false;
		} finally {
			// Remove from its parent by default
			if ( div.parentNode ) {
				div.parentNode.removeChild( div );
			}
			// release memory in IE
			div = null;
		}
	}

	/**
	 * Adds the same handler for all of the specified attrs
	 * 
	 * @param {String}
	 *            attrs Pipe-separated list of attributes
	 * @param {Function}
	 *            handler The method that will be applied
	 */
	function addHandle( attrs, handler ) {
		var arr = attrs.split("|"),
			i = attrs.length;

		while ( i-- ) {
			Expr.attrHandle[ arr[i] ] = handler;
		}
	}

	/**
	 * Checks document order of two siblings
	 * 
	 * @param {Element}
	 *            a
	 * @param {Element}
	 *            b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if
	 *          a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				( ~b.sourceIndex || MAX_NEGATIVE ) -
				( ~a.sourceIndex || MAX_NEGATIVE );

		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}

		// Check if b follows a
		if ( cur ) {
			while ( (cur = cur.nextSibling) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}

		return a ? 1 : -1;
	}

	/**
	 * Returns a function to use in pseudos for input types
	 * 
	 * @param {String}
	 *            type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for buttons
	 * 
	 * @param {String}
	 *            type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for positionals
	 * 
	 * @param {Function}
	 *            fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction(function( argument ) {
			argument = +argument;
			return markFunction(function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;

				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ (j = matchIndexes[i]) ] ) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}

	/**
	 * Checks a node for validity as a Sizzle context
	 * 
	 * @param {Element|Object=}
	 *            context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise
	 *          a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== strundefined && context;
	}

	// Expose support vars for convenience
	support = Sizzle.support = {};

	/**
	 * Detects XML nodes
	 * 
	 * @param {Element|Object}
	 *            elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */
	isXML = Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = elem && (elem.ownerDocument || elem).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};

	/**
	 * Sets document-related variables once based on the current document
	 * 
	 * @param {Element|Object}
	 *            [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var hasCompare,
			doc = node ? node.ownerDocument || node : preferredDoc,
			parent = doc.defaultView;

		// If no document and documentElement is available, return
		if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}

		// Set our document
		document = doc;
		docElem = doc.documentElement;

		// Support tests
		documentIsHTML = !isXML( doc );

		// Support: IE>8
		// If iframe document is assigned to "document" variable and if iframe
		// has
		// been reloaded,
		// IE will throw "permission denied" error when accessing "document"
		// variable, see jQuery #13936
		// IE6-8 do not support the defaultView property so parent will be
		// undefined
		if ( parent && parent !== parent.top ) {
			// IE11 does not have attachEvent, so all must suffer
			if ( parent.addEventListener ) {
				parent.addEventListener( "unload", function() {
					setDocument();
				}, false );
			} else if ( parent.attachEvent ) {
				parent.attachEvent( "onunload", function() {
					setDocument();
				});
			}
		}

		/*
		 * Attributes
		 * ----------------------------------------------------------------------
		 */

		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert(function( div ) {
			div.className = "i";
			return !div.getAttribute("className");
		});

		/***********************************************************************
		 * getElement(s)By
		 * ----------------------------------------------------------------------
		 */

		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function( div ) {
			div.appendChild( doc.createComment("") );
			return !div.getElementsByTagName("*").length;
		});

		// Check if getElementsByClassName can be trusted
		support.getElementsByClassName = rnative.test( doc.getElementsByClassName ) && assert(function( div ) {
			div.innerHTML = "<div class='a'></div><div class='a i'></div>";

			// Support: Safari<4
			// Catch class over-caching
			div.firstChild.className = "i";
			// Support: Opera<10
			// Catch gEBCN failure to find non-leading classes
			return div.getElementsByClassName("i").length === 2;
		});

		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programatically-set
		// names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function( div ) {
			docElem.appendChild( div ).id = expando;
			return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
		});

		// ID find and filter
		if ( support.getById ) {
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
					var m = context.getElementById( id );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					return m && m.parentNode ? [m] : [];
				}
			};
			Expr.filter["ID"] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute("id") === attrId;
				};
			};
		} else {
			// Support: IE6/7
			// getElementById is not reliable as a find shortcut
			delete Expr.find["ID"];

			Expr.filter["ID"] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};
		}

		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== strundefined ) {
					return context.getElementsByTagName( tag );
				}
			} :
			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,
					results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					while ( (elem = results[i++]) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			};

		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
			if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};

		/*
		 * QSA/matchesSelector
		 * ----------------------------------------------------------------------
		 */

		// QSA and matchesSelector support

		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];

		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE
		// error
		// See http://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];

		if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function( div ) {
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// http://bugs.jquery.com/ticket/12359
				div.innerHTML = "<select t=''><option selected=''></option></select>";

				// Support: IE8, Opera 10-12
				// Nothing should be selected when empty strings follow ^= or $=
				// or
				// *=
				if ( div.querySelectorAll("[t^='']").length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}

				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !div.querySelectorAll("[selected]").length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}

				// Webkit/Opera - :checked should return selected option
				// elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":checked").length ) {
					rbuggyQSA.push(":checked");
				}
			});

			assert(function( div ) {
				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML
				// assignment
				var input = doc.createElement("input");
				input.setAttribute( "type", "hidden" );
				div.appendChild( input ).setAttribute( "name", "D" );

				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if ( div.querySelectorAll("[name=d]").length ) {
					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
				}

				// FF 3.5 - :enabled/:disabled and hidden elements (hidden
				// elements
				// are still enabled)
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":enabled").length ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}

				// Opera 10-11 does not throw on post-comma invalid pseudos
				div.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}

		if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector) )) ) {

			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( div, "div" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( div, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			});
		}

		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

		/*
		 * Contains
		 * ----------------------------------------------------------------------
		 */
		hasCompare = rnative.test( docElem.compareDocumentPosition );

		// Element contains another
		// Purposefully does not implement inclusive descendent
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test( docElem.contains ) ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				));
			} :
			function( a, b ) {
				if ( b ) {
					while ( (b = b.parentNode) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};

		/*
		 * Sorting
		 * ----------------------------------------------------------------------
		 */

		// Document order sorting
		sortOrder = hasCompare ?
		function( a, b ) {

			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			// Sort on method existence if only one input has
			// compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}

			// Calculate position if both inputs belong to the same document
			compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :

				// Otherwise we know they are disconnected
				1;

			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred
				// document
				if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		} :
		function( a, b ) {
			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];

			// Parentless nodes are either documents or disconnected
			if ( !aup || !bup ) {
				return a === doc ? -1 :
					b === doc ? 1 :
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;

			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}

			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( (cur = cur.parentNode) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( (cur = cur.parentNode) ) {
				bp.unshift( cur );
			}

			// Walk down the tree looking for a discrepancy
			while ( ap[i] === bp[i] ) {
				i++;
			}

			return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[i], bp[i] ) :

				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 :
				bp[i] === preferredDoc ? 1 :
				0;
		};

		return doc;
	};

	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};

	Sizzle.matchesSelector = function( elem, expr ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		// Make sure that attribute selectors are quoted
		expr = expr.replace( rattributeQuotes, "='$1']" );

		if ( support.matchesSelector && documentIsHTML &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

			try {
				var ret = matches.call( elem, expr );

				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a
						// document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch(e) {}
		}

		return Sizzle( expr, document, null, [elem] ).length > 0;
	};

	Sizzle.contains = function( context, elem ) {
		// Set document vars if needed
		if ( ( context.ownerDocument || context ) !== document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};

	Sizzle.attr = function( elem, name ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		var fn = Expr.attrHandle[ name.toLowerCase() ],
			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;

		return val !== undefined ?
			val :
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				(val = elem.getAttributeNode(name)) && val.specified ?
					val.value :
					null;
	};

	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};

	/**
	 * Document sorting and removing duplicates
	 * 
	 * @param {ArrayLike}
	 *            results
	 */
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;

		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			while ( (elem = results[i++]) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}

		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;

		return results;
	};

	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * 
	 * @param {Array|Element}
	 *            elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery
			// #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes

		return ret;
	};

	Expr = Sizzle.selectors = {

		// Can be adjusted by the user
		cacheLength: 50,

		createPseudo: markFunction,

		match: matchExpr,

		attrHandle: {},

		find: {},

		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},

		preFilter: {
			"ATTR": function( match ) {
				match[1] = match[1].replace( runescape, funescape );

				// Move the given value to match[3] whether quoted or unquoted
				match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

				if ( match[2] === "~=" ) {
					match[3] = " " + match[3] + " ";
				}

				return match.slice( 0, 4 );
			},

			"CHILD": function( match ) {
				/*
				 * matches from matchExpr["CHILD"] 1 type (only|nth|...) 2 what
				 * (child|of-type) 3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				 * 4 xn-component of xn+y argument ([+-]?\d*n|) 5 sign of
				 * xn-component 6 x of xn-component 7 sign of y-component 8 y of
				 * y-component
				 */
				match[1] = match[1].toLowerCase();

				if ( match[1].slice( 0, 3 ) === "nth" ) {
					// nth-* requires argument
					if ( !match[3] ) {
						Sizzle.error( match[0] );
					}

					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
					match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

				// other types prohibit arguments
				} else if ( match[3] ) {
					Sizzle.error( match[0] );
				}

				return match;
			},

			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[5] && match[2];

				if ( matchExpr["CHILD"].test( match[0] ) ) {
					return null;
				}

				// Accept quoted arguments as-is
				if ( match[3] && match[4] !== undefined ) {
					match[2] = match[4];

				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

					// excess is a negative index
					match[0] = match[0].slice( 0, excess );
					match[2] = unquoted.slice( 0, excess );
				}

				// Return only captures needed by the pseudo filter method (type
				// and
				// argument)
				return match.slice( 0, 3 );
			}
		},

		filter: {

			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() { return true; } :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},

			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];

				return pattern ||
					(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
					classCache( className, function( elem ) {
						return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
					});
			},

			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );

					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}

					result += "";

					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
				};
			},

			"CHILD": function( type, what, argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";

				return first === 1 && last === 0 ?

					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :

					function( elem, context, xml ) {
						var cache, outerCache, node, diff, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType;

						if ( parent ) {

							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( (node = node[ dir ]) ) {
										if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
											return false;
										}
									}
									// Reverse direction for :only-* (if we
									// haven't
									// yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}

							start = [ forward ? parent.firstChild : parent.lastChild ];

							// non-xml :nth-child(...) stores cache data on
							// `parent`
							if ( forward && useCache ) {
								// Seek `elem` from a previously-cached index
								outerCache = parent[ expando ] || (parent[ expando ] = {});
								cache = outerCache[ type ] || [];
								nodeIndex = cache[0] === dirruns && cache[1];
								diff = cache[0] === dirruns && cache[2];
								node = nodeIndex && parent.childNodes[ nodeIndex ];

								while ( (node = ++nodeIndex && node && node[ dir ] ||

									// Fallback to seeking `elem` from the start
									(diff = nodeIndex = 0) || start.pop()) ) {

									// When found, cache indexes on `parent` and
									// break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										outerCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}

							// Use previously-cached element index if available
							} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
								diff = cache[1];

							// xml :nth-child(...) or :nth-last-child(...) or
							// :nth(-last)?-of-type(...)
							} else {
								// Use the same loop as above to seek `elem`
								// from
								// the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
										// Cache the index of each encountered
										// element
										if ( useCache ) {
											(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}

							// Incorporate the offset, then check against cycle
							// size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},

			"PSEUDO": function( pseudo, argument ) {
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are
				// added
				// with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );

				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}

				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction(function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf.call( seed, matched[i] );
								seed[ idx ] = !( matches[ idx ] = matched[i] );
							}
						}) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}

				return fn;
			}
		},

		pseudos: {
			// Potentially complex pseudos
			"not": markFunction(function( selector ) {
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );

				return matcher[ expando ] ?
					markFunction(function( seed, matches, context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;

						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( (elem = unmatched[i]) ) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) :
					function( elem, context, xml ) {
						input[0] = elem;
						matcher( input, null, xml, results );
						return !results.pop();
					};
			}),

			"has": markFunction(function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			}),

			"contains": markFunction(function( text ) {
				return function( elem ) {
					return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
				};
			}),

			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is
			// performed
			// case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {
				// lang value must be a valid identifier
				if ( !ridentifier.test(lang || "") ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( (elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
					return false;
				};
			}),

			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},

			"root": function( elem ) {
				return elem === docElem;
			},

			"focus": function( elem ) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},

			// Boolean properties
			"enabled": function( elem ) {
				return elem.disabled === false;
			},

			"disabled": function( elem ) {
				return elem.disabled === true;
			},

			"checked": function( elem ) {
				// In CSS3, :checked should return both checked and selected
				// elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
			},

			"selected": function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}

				return elem.selected === true;
			},

			// Contents
			"empty": function( elem ) {
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3;
				// cdata: 4; entity ref: 5),
				// but not by others (comment: 8; processing instruction: 7;
				// etc.)
				// nodeType < 6 works because attributes (2) do not appear as
				// children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},

			"parent": function( elem ) {
				return !Expr.pseudos["empty"]( elem );
			},

			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},

			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},

			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},

			"text": function( elem ) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&

					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with
					// elem.type === "text"
					( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
			},

			// Position-in-collection
			"first": createPositionalPseudo(function() {
				return [ 0 ];
			}),

			"last": createPositionalPseudo(function( matchIndexes, length ) {
				return [ length - 1 ];
			}),

			"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			}),

			"even": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"odd": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			})
		}
	};

	Expr.pseudos["nth"] = Expr.pseudos["eq"];

	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}

	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();

	function tokenize( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];

		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}

		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;

		while ( soFar ) {

			// Comma and first run
			if ( !matched || (match = rcomma.exec( soFar )) ) {
				if ( match ) {
					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[0].length ) || soFar;
				}
				groups.push( (tokens = []) );
			}

			matched = false;

			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					// Cast descendant combinators to space
					type: match[0].replace( rtrim, " " )
				});
				soFar = soFar.slice( matched.length );
			}

			// Filters
			for ( type in Expr.filter ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match ))) ) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: type,
						matches: match
					});
					soFar = soFar.slice( matched.length );
				}
			}

			if ( !matched ) {
				break;
			}
		}

		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :
				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	}

	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[i].value;
		}
		return selector;
	}

	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			checkNonElements = base && dir === "parentNode",
			doneName = done++;

		return combinator.first ?
			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
			} :

			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var data, cache, outerCache,
					dirkey = dirruns + " " + doneName;

				// We can't set arbitrary data on XML nodes, so they don't
				// benefit
				// from dir caching
				if ( xml ) {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || (elem[ expando ] = {});
							if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
								if ( (data = cache[1]) === true || data === cachedruns ) {
									return data === true;
								}
							} else {
								cache = outerCache[ dir ] = [ dirkey ];
								cache[1] = matcher( elem, context, xml ) || cachedruns;
								if ( cache[1] === true ) {
									return true;
								}
							}
						}
					}
				}
			};
	}

	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[i]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[0];
	}

	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;

		for ( ; i < len; i++ ) {
			if ( (elem = unmatched[i]) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}

		return newUnmatched;
	}

	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction(function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,

				// Get initial elements from seed or context
				elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

				// Prefilter to get matcher input, preserving a map for
				// seed-results
				// synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,

				matcherOut = matcher ?
					// If we have a postFinder, or filtered seed, or non-seed
					// postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

						// ...intermediate processing is necessary
						[] :

						// ...otherwise use results directly
						results :
					matcherIn;

			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}

			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );

				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( (elem = temp[i]) ) {
						matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
					}
				}
			}

			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {
						// Get the final matcherOut by condensing this
						// intermediate
						// into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( (elem = matcherOut[i]) ) {
								// Restore matcherIn since elem is not yet a
								// final
								// match
								temp.push( (matcherIn[i] = elem) );
							}
						}
						postFinder( null, (matcherOut = []), temp, xml );
					}

					// Move matched elements from seed to results to keep them
					// synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) &&
							(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

							seed[temp] = !(results[temp] = elem);
						}
					}
				}

			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		});
	}

	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[0].type ],
			implicitRelative = leadingRelative || Expr.relative[" "],
			i = leadingRelative ? 1 : 0,

			// The foundational matcher ensures that elements are reachable from
			// top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf.call( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					(checkContext = context).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
			} ];

		for ( ; i < len; i++ ) {
			if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
				matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
			} else {
				matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {
					// Find the next relative operator (if any) for proper
					// handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[j].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(
							// If the preceding token was a descendant
							// combinator,
							// insert an implicit any-element `*`
							tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
						).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}

		return elementMatcher( matchers );
	}

	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		// A counter to specify which element is currently being matched
		var matcherCachedRuns = 0,
			bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,
					// We must always have either seed elements or outermost
					// context
					elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
					len = elems.length;

				if ( outermost ) {
					outermostContext = context !== document && context;
					cachedruns = matcherCachedRuns;
				}

				// Add elements passing elementMatchers directly to results
				// Keep `i` a string if there are no elements so `matchedCount`
				// will
				// be "00" below
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>)
				// matching elements by id
				for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;
						while ( (matcher = elementMatchers[j++]) ) {
							if ( matcher( elem, context, xml ) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
							cachedruns = ++matcherCachedRuns;
						}
					}

					// Track unmatched elements for set filters
					if ( bySet ) {
						// They will have gone through all possible matchers
						if ( (elem = !matcher && elem) ) {
							matchedCount--;
						}

						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}

				// Apply set filters to unmatched elements
				matchedCount += i;
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( (matcher = setMatchers[j++]) ) {
						matcher( unmatched, setMatched, context, xml );
					}

					if ( seed ) {
						// Reintegrate element matches to eliminate the need for
						// sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !(unmatched[i] || setMatched[i]) ) {
									setMatched[i] = pop.call( results );
								}
							}
						}

						// Discard index placeholder values to get only actual
						// matches
						setMatched = condense( setMatched );
					}

					// Add matches to results
					push.apply( results, setMatched );

					// Seedless set matches succeeding multiple successful
					// matchers
					// stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {

						Sizzle.uniqueSort( results );
					}
				}

				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}

				return unmatched;
			};

		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}

	compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];

		if ( !cached ) {
			// Generate a function of recursive functions that can be used to
			// check
			// each element
			if ( !group ) {
				group = tokenize( selector );
			}
			i = group.length;
			while ( i-- ) {
				cached = matcherFromTokens( group[i] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}

			// Cache the compiled function
			cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
		}
		return cached;
	};

	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[i], results );
		}
		return results;
	}

	function select( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			match = tokenize( selector );

		if ( !seed ) {
			// Try to minimize operations if there is only one group
			if ( match.length === 1 ) {

				// Take a shortcut and set the context if the root selector is
				// an ID
				tokens = match[0] = match[0].slice( 0 );
				if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
						support.getById && context.nodeType === 9 && documentIsHTML &&
						Expr.relative[ tokens[1].type ] ) {

					context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
					if ( !context ) {
						return results;
					}
					selector = selector.slice( tokens.shift().value.length );
				}

				// Fetch a seed set for right-to-left matching
				i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
				while ( i-- ) {
					token = tokens[i];

					// Abort if we hit a combinator
					if ( Expr.relative[ (type = token.type) ] ) {
						break;
					}
					if ( (find = Expr.find[ type ]) ) {
						// Search, expanding context for leading sibling
						// combinators
						if ( (seed = find(
							token.matches[0].replace( runescape, funescape ),
							rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
						)) ) {

							// If seed is empty or no tokens remain, we can
							// return
							// early
							tokens.splice( i, 1 );
							selector = seed.length && toSelector( tokens );
							if ( !selector ) {
								push.apply( results, seed );
								return results;
							}

							break;
						}
					}
				}
			}
		}

		// Compile and execute a filtering function
		// Provide `match` to avoid retokenization if we modified the selector
		// above
		compile( selector, match )(
			seed,
			context,
			!documentIsHTML,
			results,
			rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	}

	// One-time assignments

	// Sort stability
	support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

	// Support: Chrome<14
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;

	// Initialize against the default document
	setDocument();

	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function( div1 ) {
		// Should return 1, but returns 4 (following)
		return div1.compareDocumentPosition( document.createElement("div") ) & 1;
	});

	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild.getAttribute("href") === "#" ;
	}) ) {
		addHandle( "type|href|height|width", function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
			}
		});
	}

	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if ( !support.attributes || !assert(function( div ) {
		div.innerHTML = "<input/>";
		div.firstChild.setAttribute( "value", "" );
		return div.firstChild.getAttribute( "value" ) === "";
	}) ) {
		addHandle( "value", function( elem, name, isXML ) {
			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
				return elem.defaultValue;
			}
		});
	}

	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if ( !assert(function( div ) {
		return div.getAttribute("disabled") == null;
	}) ) {
		addHandle( booleans, function( elem, name, isXML ) {
			var val;
			if ( !isXML ) {
				return elem[ name ] === true ? name.toLowerCase() :
						(val = elem.getAttributeNode( name )) && val.specified ?
						val.value :
					null;
			}
		});
	}

	// EXPOSE
	if ( typeof define === "function" && define.amd ) {
		define(function() { return Sizzle; });
	// Sizzle requires that there be a global window in Common-JS like
	// environments
	} else if ( typeof module !== "undefined" && module.exports ) {
		module.exports = Sizzle;
	} else {
		window.Sizzle = Sizzle;
	}
	// EXPOSE

	})( window );




	/*
	 * json2.js 2013-05-26 Public Domain. NO WARRANTY EXPRESSED OR IMPLIED. USE
	 * AT YOUR OWN RISK. See http://www.JSON.org/js.html This code should be
	 * minified before deployment. See
	 * http://javascript.crockford.com/jsmin.html
	 */


	// Create a JSON object only if one does not already exist. We create the
	// methods in a closure to avoid creating global variables.

	if (typeof JSON !== 'object') {
	    JSON = {};
	}

	(function () {
	    'use strict';

	    function f(n) {
	        // Format integers to have at least two digits.
	        return n < 10 ? '0' + n : n;
	    }

	    if (typeof Date.prototype.toJSON !== 'function') {

	        Date.prototype.toJSON = function () {

	            return isFinite(this.valueOf())
	                ? this.getUTCFullYear()     + '-' +
	                    f(this.getUTCMonth() + 1) + '-' +
	                    f(this.getUTCDate())      + 'T' +
	                    f(this.getUTCHours())     + ':' +
	                    f(this.getUTCMinutes())   + ':' +
	                    f(this.getUTCSeconds())   + 'Z'
	                : null;
	        };

	        String.prototype.toJSON      =
	            Number.prototype.toJSON  =
	            Boolean.prototype.toJSON = function () {
	                return this.valueOf();
	            };
	    }

	    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        gap,
	        indent,
	        meta = {    // table of character substitutions
	            '\b': '\\b',
	            '\t': '\\t',
	            '\n': '\\n',
	            '\f': '\\f',
	            '\r': '\\r',
	            '"' : '\\"',
	            '\\': '\\\\'
	        },
	        rep;


	    function quote(string) {

	// If the string contains no control characters, no quote characters, and no
	// backslash characters, then we can safely slap some quotes around it.
	// Otherwise we must also replace the offending characters with safe escape
	// sequences.

	        escapable.lastIndex = 0;
	        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	            var c = meta[a];
	            return typeof c === 'string'
	                ? c
	                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	        }) + '"' : '"' + string + '"';
	    }


	    function str(key, holder) {

	// Produce a string from holder[key].

	        var i,          // The loop counter.
	            k,          // The member key.
	            v,          // The member value.
	            length,
	            mind = gap,
	            partial,
	            value = holder[key];

	// If the value has a toJSON method, call it to obtain a replacement value.

	        if (value && typeof value === 'object' &&
	                typeof value.toJSON === 'function') {
	            value = value.toJSON(key);
	        }

	// If we were called with a replacer function, then call the replacer to
	// obtain a replacement value.

	        if (typeof rep === 'function') {
	            value = rep.call(holder, key, value);
	        }

	// What happens next depends on the value's type.

	        switch (typeof value) {
	        case 'string':
	            return quote(value);

	        case 'number':

	// JSON numbers must be finite. Encode non-finite numbers as null.

	            return isFinite(value) ? String(value) : 'null';

	        case 'boolean':
	        case 'null':

	// If the value is a boolean or null, convert it to a string. Note:
	// typeof null does not produce 'null'. The case is included here in
	// the remote chance that this gets fixed someday.

	            return String(value);

	// If the type is 'object', we might be dealing with an object or an array
	// or
	// null.

	        case 'object':

	// Due to a specification blunder in ECMAScript, typeof null is 'object',
	// so watch out for that case.

	            if (!value) {
	                return 'null';
	            }

	// Make an array to hold the partial results of stringifying this object
	// value.

	            gap += indent;
	            partial = [];

	// Is the value an array?

	            if (Object.prototype.toString.apply(value) === '[object Array]') {

	// The value is an array. Stringify every element. Use null as a placeholder
	// for non-JSON values.

	                length = value.length;
	                for (i = 0; i < length; i += 1) {
	                    partial[i] = str(i, value) || 'null';
	                }

	// Join all of the elements together, separated with commas, and wrap them
	// in
	// brackets.

	                v = partial.length === 0
	                    ? '[]'
	                    : gap
	                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
	                    : '[' + partial.join(',') + ']';
	                gap = mind;
	                return v;
	            }

	// If the replacer is an array, use it to select the members to be
	// stringified.

	            if (rep && typeof rep === 'object') {
	                length = rep.length;
	                for (i = 0; i < length; i += 1) {
	                    if (typeof rep[i] === 'string') {
	                        k = rep[i];
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            } else {

	// Otherwise, iterate through all of the keys in the object.

	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            }

	// Join all of the member texts together, separated with commas,
	// and wrap them in braces.

	            v = partial.length === 0
	                ? '{}'
	                : gap
	                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
	                : '{' + partial.join(',') + '}';
	            gap = mind;
	            return v;
	        }
	    }

	// If the JSON object does not yet have a stringify method, give it one.

	    if (typeof JSON.stringify !== 'function') {
	        JSON.stringify = function (value, replacer, space) {

	// The stringify method takes a value and an optional replacer, and an
	// optional
	// space parameter, and returns a JSON text. The replacer can be a function
	// that can replace values, or an array of strings that will select the
	// keys.
	// A default replacer method can be provided. Use of the space parameter can
	// produce text that is more easily readable.

	            var i;
	            gap = '';
	            indent = '';

	// If the space parameter is a number, make an indent string containing that
	// many spaces.

	            if (typeof space === 'number') {
	                for (i = 0; i < space; i += 1) {
	                    indent += ' ';
	                }

	// If the space parameter is a string, it will be used as the indent string.

	            } else if (typeof space === 'string') {
	                indent = space;
	            }

	// If there is a replacer, it must be a function or an array.
	// Otherwise, throw an error.

	            rep = replacer;
	            if (replacer && typeof replacer !== 'function' &&
	                    (typeof replacer !== 'object' ||
	                    typeof replacer.length !== 'number')) {
	                throw new Error('JSON.stringify');
	            }

	// Make a fake root object containing our value under the key of ''.
	// Return the result of stringifying the value.

	            return str('', {'': value});
	        };
	    }


	// If the JSON object does not yet have a parse method, give it one.

	    if (typeof JSON.parse !== 'function') {
	        JSON.parse = function (text, reviver) {

	// The parse method takes a text and an optional reviver function, and
	// returns
	// a JavaScript value if the text is a valid JSON text.

	            var j;

	            function walk(holder, key) {

	// The walk method is used to recursively walk the resulting structure so
	// that modifications can be made.

	                var k, v, value = holder[key];
	                if (value && typeof value === 'object') {
	                    for (k in value) {
	                        if (Object.prototype.hasOwnProperty.call(value, k)) {
	                            v = walk(value, k);
	                            if (v !== undefined) {
	                                value[k] = v;
	                            } else {
	                                delete value[k];
	                            }
	                        }
	                    }
	                }
	                return reviver.call(holder, key, value);
	            }


	// Parsing happens in four stages. In the first stage, we replace certain
	// Unicode characters with escape sequences. JavaScript handles many
	// characters
	// incorrectly, either silently deleting them, or treating them as line
	// endings.

	            text = String(text);
	            cx.lastIndex = 0;
	            if (cx.test(text)) {
	                text = text.replace(cx, function (a) {
	                    return '\\u' +
	                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	                });
	            }

	// In the second stage, we run the text against regular expressions that
	// look
	// for non-JSON patterns. We are especially concerned with '()' and 'new'
	// because they can cause invocation, and '=' because it can cause mutation.
	// But just to be safe, we want to reject all unexpected forms.

	// We split the second stage into 4 regexp operations in order to work
	// around
	// crippling inefficiencies in IE's and Safari's regexp engines. First we
	// replace the JSON backslash pairs with '@' (a non-JSON character). Second,
	// we
	// replace all simple value tokens with ']' characters. Third, we delete all
	// open brackets that follow a colon or comma or that begin the text.
	// Finally,
	// we look to see that the remaining characters are only whitespace or ']'
	// or
	// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

	            if (/^[\],:{}\s]*$/
	                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
	                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
	                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

	// In the third stage we use the eval function to compile the text into a
	// JavaScript structure. The '{' operator is subject to a syntactic
	// ambiguity
	// in JavaScript: it can begin a block or an object literal. We wrap the
	// text
	// in parens to eliminate the ambiguity.

	                j = eval('(' + text + ')');

	// In the optional fourth stage, we recursively walk the new structure,
	// passing
	// each name/value pair to a reviver function for possible transformation.

	                return typeof reviver === 'function'
	                    ? walk({'': j}, '')
	                    : j;
	            }

	// If the text is not JSON parseable, then a SyntaxError is thrown.

	            throw new SyntaxError('JSON.parse');
	        };
	    }
	}());

	/**
	 * Detect.js: User-Agent Parser https://github.com/darcyclarke/Detect.js
	 * Dual licensed under the MIT and GPL licenses.
	 * 
	 * @version 2.2.2
	 * @author Darcy Clarke
	 * @url http://darcyclarke.me
	 * @createdat Mon Oct 26 2015 08:21:54 GMT-0200 (Horário brasileiro de
	 *            verão)
	 * 
	 * Based on UA-Parser (https://github.com/tobie/ua-parser) by Tobie Langel
	 * 
	 * Example Usage: var agentInfo = detect.parse(navigator.userAgent);
	 * console.log(agentInfo.browser.family); // Chrome
	 */
	(function(root, undefined) {
	    // Shim Array.prototype.map if necessary
	    // Production steps of ECMA-262, Edition 5, 15.4.4.19
	    // Reference: http://es5.github.com/#x15.4.4.19
	    if (!Array.prototype.map) {
	        Array.prototype.map = function(callback, thisArg) {
	            var T, A, k;
	            if (this == null) {
	                throw new TypeError(" this is null or not defined");
	            }
	            // 1. Let O be the result of calling ToObject passing the |this|
	            // value as the argument.
	            var O = Object(this);
	            // 2. Let lenValue be the result of calling the Get internal
				// method
	            // of O with the argument "length".
	            // 3. Let len be ToUint32(lenValue).
	            var len = O.length >>> 0;
	            // 4. If IsCallable(callback) is false, throw a TypeError
				// exception.
	            // See: http://es5.github.com/#x9.11
	            if (typeof callback !== "function") {
	                throw new TypeError(callback + " is not a function");
	            }
	            // 5. If thisArg was supplied, let T be thisArg; else let T be
	            // undefined.
	            if (thisArg) {
	                T = thisArg;
	            }
	            // 6. Let A be a new array created as if by the expression new
	            // Array(len) where Array is
	            // the standard built-in constructor with that name and len is
				// the
	            // value of len.
	            A = new Array(len);
	            // 7. Let k be 0
	            k = 0;
	            // 8. Repeat, while k < len
	            while (k < len) {
	                var kValue, mappedValue;
	                // a. Let Pk be ToString(k).
	                // This is implicit for LHS operands of the in operator
	                // b. Let kPresent be the result of calling the HasProperty
	                // internal method of O with argument Pk.
	                // This step can be combined with c
	                // c. If kPresent is true, then
	                if (k in O) {
	                    // i. Let kValue be the result of calling the Get
						// internal
	                    // method of O with argument Pk.
	                    kValue = O[k];
	                    // ii. Let mappedValue be the result of calling the Call
	                    // internal method of callback
	                    // with T as the this value and argument list containing
	                    // kValue, k, and O.
	                    mappedValue = callback.call(T, kValue, k, O);
	                    // iii. Call the DefineOwnProperty internal method of A
						// with
	                    // arguments
	                    // Pk, Property Descriptor {Value: mappedValue, : true,
	                    // Enumerable: true, Configurable: true},
	                    // and false.
	                    // In browsers that support Object.defineProperty, use
						// the
	                    // following:
	                    // Object.defineProperty(A, Pk, { value: mappedValue,
	                    // writable: true, enumerable: true, configurable: true
						// });
	                    // For best browser support, use the following:
	                    A[k] = mappedValue;
	                }
	                // d. Increase k by 1.
	                k++;
	            }
	            // 9. return A
	            return A;
	        };
	    }
	    // Detect
	    var detect = root.detect = function() {
	        // Context
	        var _this = function() {};
	        // Regexes
	        var regexes = {
	            browser_parsers: [{
	                regex: "^(Opera)/(\\d+)\\.(\\d+) \\(Nintendo Wii",
	                family_replacement: "Wii",
	                manufacturer: "Nintendo"
	            },
	            {
	                regex: "(SeaMonkey|Camino)/(\\d+)\\.(\\d+)\\.?([ab]?\\d+[a-z]*)",
	                family_replacement: "Camino",
	                other: true
	            },
	            {
	                regex: "(Pale[Mm]oon)/(\\d+)\\.(\\d+)\\.?(\\d+)?",
	                family_replacement: "Pale Moon (Firefox Variant)",
	                other: true
	            },
	            {
	                regex: "(Fennec)/(\\d+)\\.(\\d+)\\.?([ab]?\\d+[a-z]*)",
	                family_replacement: "Firefox Mobile"
	            },
	            {
	                regex: "(Fennec)/(\\d+)\\.(\\d+)(pre)",
	                family_replacment: "Firefox Mobile"
	            },
	            {
	                regex: "(Fennec)/(\\d+)\\.(\\d+)",
	                family_replacement: "Firefox Mobile"
	            },
	            {
	                regex: "Mobile.*(Firefox)/(\\d+)\\.(\\d+)",
	                family_replacement: "Firefox Mobile"
	            },
	            {
	                regex: "(Namoroka|Shiretoko|Minefield)/(\\d+)\\.(\\d+)\\.(\\d+(?:pre)?)",
	                family_replacement: "Firefox ($1)"
	            },
	            {
	                regex: "(Firefox)/(\\d+)\\.(\\d+)(a\\d+[a-z]*)",
	                family_replacement: "Firefox Alpha"
	            },
	            {
	                regex: "(Firefox)/(\\d+)\\.(\\d+)(b\\d+[a-z]*)",
	                family_replacement: "Firefox Beta"
	            },
	            {
	                regex: "(Firefox)-(?:\\d+\\.\\d+)?/(\\d+)\\.(\\d+)(a\\d+[a-z]*)",
	                family_replacement: "Firefox Alpha"
	            },
	            {
	                regex: "(Firefox)-(?:\\d+\\.\\d+)?/(\\d+)\\.(\\d+)(b\\d+[a-z]*)",
	                family_replacement: "Firefox Beta"
	            },
	            {
	                regex: "(Namoroka|Shiretoko|Minefield)/(\\d+)\\.(\\d+)([ab]\\d+[a-z]*)?",
	                family_replacement: "Firefox ($1)"
	            },
	            {
	                regex: "(Firefox).*Tablet browser (\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "MicroB",
	                tablet: true
	            },
	            {
	                regex: "(MozillaDeveloperPreview)/(\\d+)\\.(\\d+)([ab]\\d+[a-z]*)?"
	            },
	            {
	                regex: "(Flock)/(\\d+)\\.(\\d+)(b\\d+?)",
	                family_replacement: "Flock",
	                other: true
	            },
	            {
	                regex: "(RockMelt)/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Rockmelt",
	                other: true
	            },
	            {
	                regex: "(Navigator)/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Netscape"
	            },
	            {
	                regex: "(Navigator)/(\\d+)\\.(\\d+)([ab]\\d+)",
	                family_replacement: "Netscape"
	            },
	            {
	                regex: "(Netscape6)/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Netscape"
	            },
	            {
	                regex: "(MyIBrow)/(\\d+)\\.(\\d+)",
	                family_replacement: "My Internet Browser",
	                other: true
	            },
	            {
	                regex: "(Opera Tablet).*Version/(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
	                family_replacement: "Opera Tablet",
	                tablet: true
	            },
	            {
	                regex: "(Opera)/.+Opera Mobi.+Version/(\\d+)\\.(\\d+)",
	                family_replacement: "Opera Mobile"
	            },
	            {
	                regex: "Opera Mobi",
	                family_replacement: "Opera Mobile"
	            },
	            {
	                regex: "(Opera Mini)/(\\d+)\\.(\\d+)",
	                family_replacement: "Opera Mini"
	            },
	            {
	                regex: "(Opera Mini)/att/(\\d+)\\.(\\d+)",
	                family_replacement: "Opera Mini"
	            },
	            {
	                regex: "(Opera)/9.80.*Version/(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
	                family_replacement: "Opera"
	            },
	            {
	                regex: "(OPR)/(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
	                family_replacement: "Opera"
	            },
	            {
	                regex: "(webOSBrowser)/(\\d+)\\.(\\d+)",
	                family_replacement: "webOS"
	            },
	            {
	                regex: "(webOS)/(\\d+)\\.(\\d+)",
	                family_replacement: "webOS"
	            },
	            {
	                regex: "(wOSBrowser).+TouchPad/(\\d+)\\.(\\d+)",
	                family_replacement: "webOS TouchPad"
	            },
	            {
	                regex: "(luakit)",
	                family_replacement: "LuaKit",
	                other: true
	            },
	            {
	                regex: "(Lightning)/(\\d+)\\.(\\d+)([ab]?\\d+[a-z]*)",
	                family_replacement: "Lightning",
	                other: true
	            },
	            {
	                regex: "(Firefox)/(\\d+)\\.(\\d+)\\.(\\d+(?:pre)?) \\(Swiftfox\\)",
	                family_replacement: "Swiftfox",
	                other: true
	            },
	            {
	                regex: "(Firefox)/(\\d+)\\.(\\d+)([ab]\\d+[a-z]*)? \\(Swiftfox\\)",
	                family_replacement: "Swiftfox",
	                other: true
	            },
	            {
	                regex: "rekonq",
	                family_replacement: "Rekonq",
	                other: true
	            },
	            {
	                regex: "(conkeror|Conkeror)/(\\d+)\\.(\\d+)\\.?(\\d+)?",
	                family_replacement: "Conkeror",
	                other: true
	            },
	            {
	                regex: "(konqueror)/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Konqueror",
	                other: true
	            },
	            {
	                regex: "(WeTab)-Browser",
	                family_replacement: "WeTab",
	                other: true
	            },
	            {
	                regex: "(Comodo_Dragon)/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Comodo Dragon",
	                other: true
	            },
	            {
	                regex: "(YottaaMonitor)",
	                family_replacement: "Yottaa Monitor",
	                other: true
	            },
	            {
	                regex: "(Kindle)/(\\d+)\\.(\\d+)",
	                family_replacement: "Kindle"
	            },
	            {
	                regex: "(Symphony) (\\d+).(\\d+)",
	                family_replacement: "Symphony",
	                other: true
	            },
	            {
	                regex: "Minimo",
	                family_replacement: "Minimo",
	                other: true
	            },
	            {
	                regex: "(Edge)/(\\d+)\\.(\\d+)",
	                family_replacement: "Edge"
	            },
	            {
	                regex: "(CrMo)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Chrome Mobile"
	            },
	            {
	                regex: "(CriOS)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Chrome Mobile iOS"
	            },
	            {
	                regex: "(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+) Mobile",
	                family_replacement: "Chrome Mobile"
	            },
	            {
	                regex: "(chromeframe)/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Chrome Frame"
	            },
	            {
	                regex: "(UC Browser)(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "UC Browser",
	                other: true
	            },
	            {
	                regex: "(SLP Browser)/(\\d+)\\.(\\d+)",
	                family_replacement: "Tizen Browser",
	                other: true
	            },
	            {
	                regex: "(Epiphany)/(\\d+)\\.(\\d+).(\\d+)",
	                family_replacement: "Epiphany",
	                other: true
	            },
	            {
	                regex: "(SE 2\\.X) MetaSr (\\d+)\\.(\\d+)",
	                family_replacement: "Sogou Explorer",
	                other: true
	            },
	            {
	                regex: "(Pingdom.com_bot_version_)(\\d+)\\.(\\d+)",
	                family_replacement: "PingdomBot",
	                other: true
	            },
	            {
	                regex: "(facebookexternalhit)/(\\d+)\\.(\\d+)",
	                family_replacement: "FacebookBot"
	            },
	            {
	                regex: "(Twitterbot)/(\\d+)\\.(\\d+)",
	                family_replacement: "TwitterBot"
	            },
	            {
	                regex: "(AdobeAIR|Chromium|FireWeb|Jasmine|ANTGalio|Midori|Fresco|Lobo|PaleMoon|Maxthon|Lynx|OmniWeb|Dillo|Camino|Demeter|Fluid|Fennec|Shiira|Sunrise|Chrome|Flock|Netscape|Lunascape|WebPilot|NetFront|Netfront|Konqueror|SeaMonkey|Kazehakase|Vienna|Iceape|Iceweasel|IceWeasel|Iron|K-Meleon|Sleipnir|Galeon|GranParadiso|Opera Mini|iCab|NetNewsWire|ThunderBrowse|Iron|Iris|UP\\.Browser|Bunjaloo|Google Earth|Raven for Mac)/(\\d+)\\.(\\d+)\\.(\\d+)"
	            },
	            {
	                regex: "(Bolt|Jasmine|IceCat|Skyfire|Midori|Maxthon|Lynx|Arora|IBrowse|Dillo|Camino|Shiira|Fennec|Phoenix|Chrome|Flock|Netscape|Lunascape|Epiphany|WebPilot|Opera Mini|Opera|NetFront|Netfront|Konqueror|Googlebot|SeaMonkey|Kazehakase|Vienna|Iceape|Iceweasel|IceWeasel|Iron|K-Meleon|Sleipnir|Galeon|GranParadiso|iCab|NetNewsWire|Iron|Space Bison|Stainless|Orca|Dolfin|BOLT|Minimo|Tizen Browser|Polaris)/(\\d+)\\.(\\d+)"
	            },
	            {
	                regex: "(iRider|Crazy Browser|SkipStone|iCab|Lunascape|Sleipnir|Maemo Browser) (\\d+)\\.(\\d+)\\.(\\d+)"
	            },
	            {
	                regex: "(iCab|Lunascape|Opera|Android|Jasmine|Polaris|BREW) (\\d+)\\.(\\d+)\\.?(\\d+)?"
	            },
	            {
	                regex: "(Android) Donut",
	                v2_replacement: "2",
	                v1_replacement: "1"
	            },
	            {
	                regex: "(Android) Eclair",
	                v2_replacement: "1",
	                v1_replacement: "2"
	            },
	            {
	                regex: "(Android) Froyo",
	                v2_replacement: "2",
	                v1_replacement: "2"
	            },
	            {
	                regex: "(Android) Gingerbread",
	                v2_replacement: "3",
	                v1_replacement: "2"
	            },
	            {
	                regex: "(Android) Honeycomb",
	                v1_replacement: "3"
	            },
	            {
	                regex: "(IEMobile)[ /](\\d+)\\.(\\d+)",
	                family_replacement: "IE Mobile"
	            },
	            {
	                regex: "(MSIE) (\\d+)\\.(\\d+).*XBLWP7",
	                family_replacement: "IE Large Screen"
	            },
	            {
	                regex: "(Firefox)/(\\d+)\\.(\\d+)\\.(\\d+)"
	            },
	            {
	                regex: "(Firefox)/(\\d+)\\.(\\d+)(pre|[ab]\\d+[a-z]*)?"
	            },
	            {
	                regex: "(Obigo)InternetBrowser",
	                other: true
	            },
	            {
	                regex: "(Obigo)\\-Browser",
	                other: true
	            },
	            {
	                regex: "(Obigo|OBIGO)[^\\d]*(\\d+)(?:.(\\d+))?",
	                other: true
	            },
	            {
	                regex: "(MAXTHON|Maxthon) (\\d+)\\.(\\d+)",
	                family_replacement: "Maxthon",
	                other: true
	            },
	            {
	                regex: "(Maxthon|MyIE2|Uzbl|Shiira)",
	                v1_replacement: "0",
	                other: true
	            },
	            {
	                regex: "(PLAYSTATION) (\\d+)",
	                family_replacement: "PlayStation",
	                manufacturer: "Sony"
	            },
	            {
	                regex: "(PlayStation Portable)[^\\d]+(\\d+).(\\d+)",
	                manufacturer: "Sony"
	            },
	            {
	                regex: "(BrowseX) \\((\\d+)\\.(\\d+)\\.(\\d+)",
	                other: true
	            },
	            {
	                regex: "(POLARIS)/(\\d+)\\.(\\d+)",
	                family_replacement: "Polaris",
	                other: true
	            },
	            {
	                regex: "(Embider)/(\\d+)\\.(\\d+)",
	                family_replacement: "Polaris",
	                other: true
	            },
	            {
	                regex: "(BonEcho)/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Bon Echo",
	                other: true
	            },
	            {
	                regex: "(iPod).+Version/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Mobile Safari",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPod).*Version/(\\d+)\\.(\\d+)",
	                family_replacement: "Mobile Safari",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPod)",
	                family_replacement: "Mobile Safari",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPhone).*Version/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Mobile Safari",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPhone).*Version/(\\d+)\\.(\\d+)",
	                family_replacement: "Mobile Safari",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPhone)",
	                family_replacement: "Mobile Safari",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPad).*Version/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Mobile Safari",
	                tablet: true,
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPad).*Version/(\\d+)\\.(\\d+)",
	                family_replacement: "Mobile Safari",
	                tablet: true,
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPad)",
	                family_replacement: "Mobile Safari",
	                tablet: true,
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(AvantGo) (\\d+).(\\d+)",
	                other: true
	            },
	            {
	                regex: "(Avant)",
	                v1_replacement: "1",
	                other: true
	            },
	            {
	                regex: "^(Nokia)",
	                family_replacement: "Nokia Services (WAP) Browser",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(NokiaBrowser)/(\\d+)\\.(\\d+).(\\d+)\\.(\\d+)",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(NokiaBrowser)/(\\d+)\\.(\\d+).(\\d+)",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(NokiaBrowser)/(\\d+)\\.(\\d+)",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(BrowserNG)/(\\d+)\\.(\\d+).(\\d+)",
	                family_replacement: "NokiaBrowser",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(Series60)/5\\.0",
	                v2_replacement: "0",
	                v1_replacement: "7",
	                family_replacement: "NokiaBrowser",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(Series60)/(\\d+)\\.(\\d+)",
	                family_replacement: "Nokia OSS Browser",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(S40OviBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Nokia Series 40 Ovi Browser",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(Nokia)[EN]?(\\d+)",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(PlayBook).+RIM Tablet OS (\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Blackberry WebKit",
	                tablet: true,
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(Black[bB]erry).+Version/(\\d+)\\.(\\d+)\\.(\\d+)",
	                family_replacement: "Blackberry WebKit",
	                manufacturer: "RIM"
	            },
	            {
	                regex: "(Black[bB]erry)\\s?(\\d+)",
	                family_replacement: "Blackberry",
	                manufacturer: "RIM"
	            },
	            {
	                regex: "(OmniWeb)/v(\\d+)\\.(\\d+)",
	                other: true
	            },
	            {
	                regex: "(Blazer)/(\\d+)\\.(\\d+)",
	                family_replacement: "Palm Blazer",
	                manufacturer: "Palm"
	            },
	            {
	                regex: "(Pre)/(\\d+)\\.(\\d+)",
	                family_replacement: "Palm Pre",
	                manufacturer: "Palm"
	            },
	            {
	                regex: "(Links) \\((\\d+)\\.(\\d+)",
	                other: true
	            },
	            {
	                regex: "(QtWeb) Internet Browser/(\\d+)\\.(\\d+)",
	                other: true
	            },
	            {
	                regex: "(Silk)/(\\d+)\\.(\\d+)(?:\\.([0-9\\-]+))?",
	                other: true,
	                tablet: true
	            },
	            {
	                regex: "(AppleWebKit)/(\\d+)\\.?(\\d+)?\\+ .* Version/\\d+\\.\\d+.\\d+ Safari/",
	                family_replacement: "WebKit Nightly"
	            },
	            {
	                regex: "(Version)/(\\d+)\\.(\\d+)(?:\\.(\\d+))?.*Safari/",
	                family_replacement: "Safari"
	            },
	            {
	                regex: "(Safari)/\\d+"
	            },
	            {
	                regex: "(OLPC)/Update(\\d+)\\.(\\d+)",
	                other: true
	            },
	            {
	                regex: "(OLPC)/Update()\\.(\\d+)",
	                v1_replacement: "0",
	                other: true
	            },
	            {
	                regex: "(SEMC\\-Browser)/(\\d+)\\.(\\d+)",
	                other: true
	            },
	            {
	                regex: "(Teleca)",
	                family_replacement: "Teleca Browser",
	                other: true
	            },
	            {
	                regex: "Trident(.*)rv.(\\d+)\\.(\\d+)",
	                family_replacement: "IE"
	            },
	            {
	                regex: "(MSIE) (\\d+)\\.(\\d+)",
	                family_replacement: "IE"
	            }],
	            os_parsers: [{
	                regex: "(Android) (\\d+)\\.(\\d+)(?:[.\\-]([a-z0-9]+))?"
	            },
	            {
	                regex: "(Android)\\-(\\d+)\\.(\\d+)(?:[.\\-]([a-z0-9]+))?"
	            },
	            {
	                regex: "(Android) Donut",
	                os_v2_replacement: "2",
	                os_v1_replacement: "1"
	            },
	            {
	                regex: "(Android) Eclair",
	                os_v2_replacement: "1",
	                os_v1_replacement: "2"
	            },
	            {
	                regex: "(Android) Froyo",
	                os_v2_replacement: "2",
	                os_v1_replacement: "2"
	            },
	            {
	                regex: "(Android) Gingerbread",
	                os_v2_replacement: "3",
	                os_v1_replacement: "2"
	            },
	            {
	                regex: "(Android) Honeycomb",
	                os_v1_replacement: "3"
	            },
	            {
	                regex: "(Silk-Accelerated=[a-z]{4,5})",
	                os_replacement: "Android"
	            },
	            {
	                regex: "(Windows Phone 6\\.5)"
	            },
	            {
	                regex: "(Windows (?:NT 5\\.2|NT 5\\.1))",
	                os_replacement: "Windows XP"
	            },
	            {
	                regex: "(XBLWP7)",
	                os_replacement: "Windows Phone OS"
	            },
	            {
	                regex: "(Windows NT 6\\.1)",
	                os_replacement: "Windows 7"
	            },
	            {
	                regex: "(Windows NT 6\\.0)",
	                os_replacement: "Windows Vista"
	            },
	            {
	                regex: "(Windows 98|Windows XP|Windows ME|Windows 95|Windows CE|Windows 7|Windows NT 4\\.0|Windows Vista|Windows 2000)"
	            },
	            {
	                regex: "(Windows NT 6\\.4|Windows NT 10\\.0)",
	                os_replacement: "Windows 10"
	            },
	            {
	                regex: "(Windows NT 6\\.2)",
	                os_replacement: "Windows 8"
	            },
	            {
	                regex: "(Windows Phone 8)",
	                os_replacement: "Windows Phone 8"
	            },
	            {
	                regex: "(Windows NT 5\\.0)",
	                os_replacement: "Windows 2000"
	            },
	            {
	                regex: "(Windows Phone OS) (\\d+)\\.(\\d+)"
	            },
	            {
	                regex: "(Windows ?Mobile)",
	                os_replacement: "Windows Mobile"
	            },
	            {
	                regex: "(WinNT4.0)",
	                os_replacement: "Windows NT 4.0"
	            },
	            {
	                regex: "(Win98)",
	                os_replacement: "Windows 98"
	            },
	            {
	                regex: "(Tizen)/(\\d+)\\.(\\d+)",
	                other: true
	            },
	            {
	                regex: "(Mac OS X) (\\d+)[_.](\\d+)(?:[_.](\\d+))?",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(?:PPC|Intel) (Mac OS X)",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(CPU OS|iPhone OS) (\\d+)_(\\d+)(?:_(\\d+))?",
	                os_replacement: "iOS",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPhone|iPad|iPod); Opera",
	                os_replacement: "iOS",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPad); Opera",
	                tablet: true,
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPhone|iPad|iPod).*Mac OS X.*Version/(\\d+)\\.(\\d+)",
	                os_replacement: "iOS",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(CrOS) [a-z0-9_]+ (\\d+)\\.(\\d+)(?:\\.(\\d+))?",
	                os_replacement: "Chrome OS"
	            },
	            {
	                regex: "(Debian)-(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
	                other: true
	            },
	            {
	                regex: "(Linux Mint)(?:/(\\d+))?",
	                other: true
	            },
	            {
	                regex: "(Mandriva)(?: Linux)?/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
	                other: true
	            },
	            {
	                regex: "(Symbian[Oo][Ss])/(\\d+)\\.(\\d+)",
	                os_replacement: "Symbian OS"
	            },
	            {
	                regex: "(Symbian/3).+NokiaBrowser/7\\.3",
	                os_replacement: "Symbian^3 Anna"
	            },
	            {
	                regex: "(Symbian/3).+NokiaBrowser/7\\.4",
	                os_replacement: "Symbian^3 Belle"
	            },
	            {
	                regex: "(Symbian/3)",
	                os_replacement: "Symbian^3"
	            },
	            {
	                regex: "(Series 60|SymbOS|S60)",
	                os_replacement: "Symbian OS"
	            },
	            {
	                regex: "(MeeGo)",
	                other: true
	            },
	            {
	                regex: "Symbian [Oo][Ss]",
	                os_replacement: "Symbian OS"
	            },
	            {
	                regex: "(Black[Bb]erry)[0-9a-z]+/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
	                os_replacement: "BlackBerry OS",
	                manufacturer: "RIM"
	            },
	            {
	                regex: "(Black[Bb]erry).+Version/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
	                os_replacement: "BlackBerry OS",
	                manufacturer: "RIM"
	            },
	            {
	                regex: "(RIM Tablet OS) (\\d+)\\.(\\d+)\\.(\\d+)",
	                os_replacement: "BlackBerry Tablet OS",
	                tablet: true,
	                manufacturer: "RIM"
	            },
	            {
	                regex: "(Play[Bb]ook)",
	                os_replacement: "BlackBerry Tablet OS",
	                tablet: true,
	                manufacturer: "RIM"
	            },
	            {
	                regex: "(Black[Bb]erry)",
	                os_replacement: "Blackberry OS",
	                manufacturer: "RIM"
	            },
	            {
	                regex: "(webOS|hpwOS)/(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
	                os_replacement: "webOS"
	            },
	            {
	                regex: "(SUSE|Fedora|Red Hat|PCLinuxOS)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
	                other: true
	            },
	            {
	                regex: "(SUSE|Fedora|Red Hat|Puppy|PCLinuxOS|CentOS)/(\\d+)\\.(\\d+)\\.(\\d+)",
	                other: true
	            },
	            {
	                regex: "(Ubuntu|Kindle|Bada|Lubuntu|BackTrack|Red Hat|Slackware)/(\\d+)\\.(\\d+)"
	            },
	            {
	                regex: "(Windows|OpenBSD|FreeBSD|NetBSD|Ubuntu|Kubuntu|Android|Arch Linux|CentOS|WeTab|Slackware)"
	            },
	            {
	                regex: "(Linux|BSD)",
	                other: true
	            }],
	            mobile_os_families: ["Windows Phone 6.5", "Windows CE", "Symbian OS"],
	            device_parsers: [{
	                regex: "HTC ([A-Z][a-z0-9]+) Build",
	                device_replacement: "HTC $1",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "HTC ([A-Z][a-z0-9 ]+) \\d+\\.\\d+\\.\\d+\\.\\d+",
	                device_replacement: "HTC $1",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "HTC_Touch_([A-Za-z0-9]+)",
	                device_replacement: "HTC Touch ($1)",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "USCCHTC(\\d+)",
	                device_replacement: "HTC $1 (US Cellular)",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "Sprint APA(9292)",
	                device_replacement: "HTC $1 (Sprint)",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "HTC ([A-Za-z0-9]+ [A-Z])",
	                device_replacement: "HTC $1",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "HTC-([A-Za-z0-9]+)",
	                device_replacement: "HTC $1",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "HTC_([A-Za-z0-9]+)",
	                device_replacement: "HTC $1",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "HTC ([A-Za-z0-9]+)",
	                device_replacement: "HTC $1",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "(ADR[A-Za-z0-9]+)",
	                device_replacement: "HTC $1",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "(HTC)",
	                manufacturer: "HTC"
	            },
	            {
	                regex: "SonyEricsson([A-Za-z0-9]+)/",
	                device_replacement: "Ericsson $1",
	                other: true,
	                manufacturer: "Sony"
	            },
	            {
	                regex: "Android[\\- ][\\d]+\\.[\\d]+\\; [A-Za-z]{2}\\-[A-Za-z]{2}\\; WOWMobile (.+) Build"
	            },
	            {
	                regex: "Android[\\- ][\\d]+\\.[\\d]+\\.[\\d]+; [A-Za-z]{2}\\-[A-Za-z]{2}\\; (.+) Build"
	            },
	            {
	                regex: "Android[\\- ][\\d]+\\.[\\d]+\\-update1\\; [A-Za-z]{2}\\-[A-Za-z]{2}\\; (.+) Build"
	            },
	            {
	                regex: "Android[\\- ][\\d]+\\.[\\d]+\\; [A-Za-z]{2}\\-[A-Za-z]{2}\\; (.+) Build"
	            },
	            {
	                regex: "Android[\\- ][\\d]+\\.[\\d]+\\.[\\d]+; (.+) Build"
	            },
	            {
	                regex: "NokiaN([0-9]+)",
	                device_replacement: "Nokia N$1",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "Nokia([A-Za-z0-9\\v-]+)",
	                device_replacement: "Nokia $1",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "NOKIA ([A-Za-z0-9\\-]+)",
	                device_replacement: "Nokia $1",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "Nokia ([A-Za-z0-9\\-]+)",
	                device_replacement: "Nokia $1",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "Lumia ([A-Za-z0-9\\-]+)",
	                device_replacement: "Lumia $1",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "Symbian",
	                device_replacement: "Nokia",
	                manufacturer: "Nokia"
	            },
	            {
	                regex: "(PlayBook).+RIM Tablet OS",
	                device_replacement: "Blackberry Playbook",
	                tablet: true,
	                manufacturer: "RIM"
	            },
	            {
	                regex: "(Black[Bb]erry [0-9]+);",
	                manufacturer: "RIM"
	            },
	            {
	                regex: "Black[Bb]erry([0-9]+)",
	                device_replacement: "BlackBerry $1",
	                manufacturer: "RIM"
	            },
	            {
	                regex: "(Pre)/(\\d+)\\.(\\d+)",
	                device_replacement: "Palm Pre",
	                manufacturer: "Palm"
	            },
	            {
	                regex: "(Pixi)/(\\d+)\\.(\\d+)",
	                device_replacement: "Palm Pixi",
	                manufacturer: "Palm"
	            },
	            {
	                regex: "(Touchpad)/(\\d+)\\.(\\d+)",
	                device_replacement: "HP Touchpad",
	                manufacturer: "HP"
	            },
	            {
	                regex: "HPiPAQ([A-Za-z0-9]+)/(\\d+).(\\d+)",
	                device_replacement: "HP iPAQ $1",
	                manufacturer: "HP"
	            },
	            {
	                regex: "Palm([A-Za-z0-9]+)",
	                device_replacement: "Palm $1",
	                manufacturer: "Palm"
	            },
	            {
	                regex: "Treo([A-Za-z0-9]+)",
	                device_replacement: "Palm Treo $1",
	                manufacturer: "Palm"
	            },
	            {
	                regex: "webOS.*(P160UNA)/(\\d+).(\\d+)",
	                device_replacement: "HP Veer",
	                manufacturer: "HP"
	            },
	            {
	                regex: "(Kindle Fire)",
	                manufacturer: "Amazon"
	            },
	            {
	                regex: "(Kindle)",
	                manufacturer: "Amazon"
	            },
	            {
	                regex: "(Silk)/(\\d+)\\.(\\d+)(?:\\.([0-9\\-]+))?",
	                device_replacement: "Kindle Fire",
	                tablet: true,
	                manufacturer: "Amazon"
	            },
	            {
	                regex: "(iPad) Simulator;",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPad);",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPod);",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPhone) Simulator;",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "(iPhone);",
	                manufacturer: "Apple"
	            },
	            {
	                regex: "Nexus\\ ([A-Za-z0-9\\-]+)",
	                device_replacement: "Nexus $1"
	            },
	            {
	                regex: "acer_([A-Za-z0-9]+)_",
	                device_replacement: "Acer $1",
	                manufacturer: "Acer"
	            },
	            {
	                regex: "acer_([A-Za-z0-9]+)_",
	                device_replacement: "Acer $1",
	                manufacturer: "Acer"
	            },
	            {
	                regex: "Amoi\\-([A-Za-z0-9]+)",
	                device_replacement: "Amoi $1",
	                other: true,
	                manufacturer: "Amoi"
	            },
	            {
	                regex: "AMOI\\-([A-Za-z0-9]+)",
	                device_replacement: "Amoi $1",
	                other: true,
	                manufacturer: "Amoi"
	            },
	            {
	                regex: "Asus\\-([A-Za-z0-9]+)",
	                device_replacement: "Asus $1",
	                manufacturer: "Asus"
	            },
	            {
	                regex: "ASUS\\-([A-Za-z0-9]+)",
	                device_replacement: "Asus $1",
	                manufacturer: "Asus"
	            },
	            {
	                regex: "BIRD\\-([A-Za-z0-9]+)",
	                device_replacement: "Bird $1",
	                other: true
	            },
	            {
	                regex: "BIRD\\.([A-Za-z0-9]+)",
	                device_replacement: "Bird $1",
	                other: true
	            },
	            {
	                regex: "BIRD ([A-Za-z0-9]+)",
	                device_replacement: "Bird $1",
	                other: true
	            },
	            {
	                regex: "Dell ([A-Za-z0-9]+)",
	                device_replacement: "Dell $1",
	                manufacturer: "Dell"
	            },
	            {
	                regex: "DoCoMo/2\\.0 ([A-Za-z0-9]+)",
	                device_replacement: "DoCoMo $1",
	                other: true
	            },
	            {
	                regex: "([A-Za-z0-9]+)\\_W\\;FOMA",
	                device_replacement: "DoCoMo $1",
	                other: true
	            },
	            {
	                regex: "([A-Za-z0-9]+)\\;FOMA",
	                device_replacement: "DoCoMo $1",
	                other: true
	            },
	            {
	                regex: "vodafone([A-Za-z0-9]+)",
	                device_replacement: "Huawei Vodafone $1",
	                other: true
	            },
	            {
	                regex: "i\\-mate ([A-Za-z0-9]+)",
	                device_replacement: "i-mate $1",
	                other: true
	            },
	            {
	                regex: "Kyocera\\-([A-Za-z0-9]+)",
	                device_replacement: "Kyocera $1",
	                other: true
	            },
	            {
	                regex: "KWC\\-([A-Za-z0-9]+)",
	                device_replacement: "Kyocera $1",
	                other: true
	            },
	            {
	                regex: "Lenovo\\-([A-Za-z0-9]+)",
	                device_replacement: "Lenovo $1",
	                manufacturer: "Lenovo"
	            },
	            {
	                regex: "Lenovo\\_([A-Za-z0-9]+)",
	                device_replacement: "Lenovo $1",
	                manufacturer: "Levovo"
	            },
	            {
	                regex: "LG/([A-Za-z0-9]+)",
	                device_replacement: "LG $1",
	                manufacturer: "LG"
	            },
	            {
	                regex: "LG-LG([A-Za-z0-9]+)",
	                device_replacement: "LG $1",
	                manufacturer: "LG"
	            },
	            {
	                regex: "LGE-LG([A-Za-z0-9]+)",
	                device_replacement: "LG $1",
	                manufacturer: "LG"
	            },
	            {
	                regex: "LGE VX([A-Za-z0-9]+)",
	                device_replacement: "LG $1",
	                manufacturer: "LG"
	            },
	            {
	                regex: "LG ([A-Za-z0-9]+)",
	                device_replacement: "LG $1",
	                manufacturer: "LG"
	            },
	            {
	                regex: "LGE LG\\-AX([A-Za-z0-9]+)",
	                device_replacement: "LG $1",
	                manufacturer: "LG"
	            },
	            {
	                regex: "LG\\-([A-Za-z0-9]+)",
	                device_replacement: "LG $1",
	                manufacturer: "LG"
	            },
	            {
	                regex: "LGE\\-([A-Za-z0-9]+)",
	                device_replacement: "LG $1",
	                manufacturer: "LG"
	            },
	            {
	                regex: "LG([A-Za-z0-9]+)",
	                device_replacement: "LG $1",
	                manufacturer: "LG"
	            },
	            {
	                regex: "(KIN)\\.One (\\d+)\\.(\\d+)",
	                device_replacement: "Microsoft $1"
	            },
	            {
	                regex: "(KIN)\\.Two (\\d+)\\.(\\d+)",
	                device_replacement: "Microsoft $1"
	            },
	            {
	                regex: "(Motorola)\\-([A-Za-z0-9]+)",
	                manufacturer: "Motorola"
	            },
	            {
	                regex: "MOTO\\-([A-Za-z0-9]+)",
	                device_replacement: "Motorola $1",
	                manufacturer: "Motorola"
	            },
	            {
	                regex: "MOT\\-([A-Za-z0-9]+)",
	                device_replacement: "Motorola $1",
	                manufacturer: "Motorola"
	            },
	            {
	                regex: "Philips([A-Za-z0-9]+)",
	                device_replacement: "Philips $1",
	                manufacturer: "Philips"
	            },
	            {
	                regex: "Philips ([A-Za-z0-9]+)",
	                device_replacement: "Philips $1",
	                manufacturer: "Philips"
	            },
	            {
	                regex: "SAMSUNG-([A-Za-z0-9\\-]+)",
	                device_replacement: "Samsung $1",
	                manufacturer: "Samsung"
	            },
	            {
	                regex: "SAMSUNG\\; ([A-Za-z0-9\\-]+)",
	                device_replacement: "Samsung $1",
	                manufacturer: "Samsung"
	            },
	            {
	                regex: "Softbank/1\\.0/([A-Za-z0-9]+)",
	                device_replacement: "Softbank $1",
	                other: true
	            },
	            {
	                regex: "Softbank/2\\.0/([A-Za-z0-9]+)",
	                device_replacement: "Softbank $1",
	                other: true
	            },
	            {
	                regex: "(hiptop|avantgo|plucker|xiino|blazer|elaine|up.browser|up.link|mmp|smartphone|midp|wap|vodafone|o2|pocket|mobile|pda)",
	                device_replacement: "Generic Smartphone"
	            },
	            {
	                regex: "^(1207|3gso|4thp|501i|502i|503i|504i|505i|506i|6310|6590|770s|802s|a wa|acer|acs\\-|airn|alav|asus|attw|au\\-m|aur |aus |abac|acoo|aiko|alco|alca|amoi|anex|anny|anyw|aptu|arch|argo|bell|bird|bw\\-n|bw\\-u|beck|benq|bilb|blac|c55/|cdm\\-|chtm|capi|comp|cond|craw|dall|dbte|dc\\-s|dica|ds\\-d|ds12|dait|devi|dmob|doco|dopo|el49|erk0|esl8|ez40|ez60|ez70|ezos|ezze|elai|emul|eric|ezwa|fake|fly\\-|fly\\_|g\\-mo|g1 u|g560|gf\\-5|grun|gene|go.w|good|grad|hcit|hd\\-m|hd\\-p|hd\\-t|hei\\-|hp i|hpip|hs\\-c|htc |htc\\-|htca|htcg)",
	                device_replacement: "Generic Feature Phone"
	            },
	            {
	                regex: "^(htcp|htcs|htct|htc\\_|haie|hita|huaw|hutc|i\\-20|i\\-go|i\\-ma|i230|iac|iac\\-|iac/|ig01|im1k|inno|iris|jata|java|kddi|kgt|kgt/|kpt |kwc\\-|klon|lexi|lg g|lg\\-a|lg\\-b|lg\\-c|lg\\-d|lg\\-f|lg\\-g|lg\\-k|lg\\-l|lg\\-m|lg\\-o|lg\\-p|lg\\-s|lg\\-t|lg\\-u|lg\\-w|lg/k|lg/l|lg/u|lg50|lg54|lge\\-|lge/|lynx|leno|m1\\-w|m3ga|m50/|maui|mc01|mc21|mcca|medi|meri|mio8|mioa|mo01|mo02|mode|modo|mot |mot\\-|mt50|mtp1|mtv |mate|maxo|merc|mits|mobi|motv|mozz|n100|n101|n102|n202|n203|n300|n302|n500|n502|n505|n700|n701|n710|nec\\-|nem\\-|newg|neon)",
	                device_replacement: "Generic Feature Phone"
	            },
	            {
	                regex: "^(netf|noki|nzph|o2 x|o2\\-x|opwv|owg1|opti|oran|ot\\-s|p800|pand|pg\\-1|pg\\-2|pg\\-3|pg\\-6|pg\\-8|pg\\-c|pg13|phil|pn\\-2|pt\\-g|palm|pana|pire|pock|pose|psio|qa\\-a|qc\\-2|qc\\-3|qc\\-5|qc\\-7|qc07|qc12|qc21|qc32|qc60|qci\\-|qwap|qtek|r380|r600|raks|rim9|rove|s55/|sage|sams|sc01|sch\\-|scp\\-|sdk/|se47|sec\\-|sec0|sec1|semc|sgh\\-|shar|sie\\-|sk\\-0|sl45|slid|smb3|smt5|sp01|sph\\-|spv |spv\\-|sy01|samm|sany|sava|scoo|send|siem|smar|smit|soft|sony|t\\-mo|t218|t250|t600|t610|t618|tcl\\-|tdg\\-|telm|tim\\-|ts70|tsm\\-|tsm3|tsm5|tx\\-9|tagt)",
	                device_replacement: "Generic Feature Phone"
	            },
	            {
	                regex: "^(talk|teli|topl|tosh|up.b|upg1|utst|v400|v750|veri|vk\\-v|vk40|vk50|vk52|vk53|vm40|vx98|virg|vite|voda|vulc|w3c |w3c\\-|wapj|wapp|wapu|wapm|wig |wapi|wapr|wapv|wapy|wapa|waps|wapt|winc|winw|wonu|x700|xda2|xdag|yas\\-|your|zte\\-|zeto|aste|audi|avan|blaz|brew|brvw|bumb|ccwa|cell|cldc|cmd\\-|dang|eml2|fetc|hipt|http|ibro|idea|ikom|ipaq|jbro|jemu|jigs|keji|kyoc|kyok|libw|m\\-cr|midp|mmef|moto|mwbp|mywa|newt|nok6|o2im|pant|pdxg|play|pluc|port|prox|rozo|sama|seri|smal|symb|treo|upsi|vx52|vx53|vx60|vx61|vx70|vx80|vx81|vx83|vx85|wap\\-|webc|whit|wmlb|xda\\-|xda\\_)",
	                device_replacement: "Generic Feature Phone"
	            },
	            {
	                regex: "(bot|borg|google(^tv)|yahoo|slurp|msnbot|msrbot|openbot|archiver|netresearch|lycos|scooter|altavista|teoma|gigabot|baiduspider|blitzbot|oegp|charlotte|furlbot|http%20client|polybot|htdig|ichiro|mogimogi|larbin|pompos|scrubby|searchsight|seekbot|semanticdiscovery|silk|snappy|speedy|spider|voila|vortex|voyager|zao|zeal|fast\\-webcrawler|converacrawler|dataparksearch|findlinks)",
	                device_replacement: "Spider"
	            }],
	            mobile_browser_families: ["Firefox Mobile", "Opera Mobile", "Opera Mini", "Mobile Safari", "webOS", "IE Mobile", "Playstation Portable", "Nokia", "Blackberry", "Palm", "Silk", "Android", "Maemo", "Obigo", "Netfront", "AvantGo", "Teleca", "SEMC-Browser", "Bolt", "Iris", "UP.Browser", "Symphony", "Minimo", "Bunjaloo", "Jasmine", "Dolfin", "Polaris", "BREW", "Chrome Mobile", "Chrome Mobile iOS", "UC Browser", "Tizen Browser"]
	        };
	        // Parsers
	        _this.parsers = ["device_parsers", "browser_parsers", "os_parsers", "mobile_os_families", "mobile_browser_families"];
	        // Types
	        _this.types = ["browser", "os", "device"];
	        // Regular Expressions
	        _this.regexes = regexes ||
	        function() {
	            var results = {};
	            _this.parsers.map(function(parser) {
	                results[parser] = [];
	            });
	            return results;
	        } ();
	        // Families
	        _this.families = function() {
	            var results = {};
	            _this.types.map(function(type) {
	                results[type] = [];
	            });
	            return results;
	        } ();
	        // Utility Variables
	        var ArrayProto = Array.prototype,
	        ObjProto = Object.prototype,
	        FuncProto = Function.prototype,
	        nativeForEach = ArrayProto.forEach,
	        nativeIndexOf = ArrayProto.indexOf;
	        // Find Utility
	        var find = function(ua, obj) {
	            var ret = {};
	            for (var i = 0; i < obj.length; i++) {
	                ret = obj[i](ua);
	                if (ret) {
	                    break;
	                }
	            }
	            return ret;
	        };
	        // Remove Utility
	        var remove = function(arr, props) {
	            each(arr,
	            function(obj) {
	                each(props,
	                function(prop) {
	                    delete obj[prop];
	                });
	            });
	        };
	        // Contains Utility
	        var contains = function(obj, target) {
	            var found = false;
	            if (obj == null) return found;
	            if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
	            found = any(obj,
	            function(value) {
	                return value === target;
	            });
	            return found;
	        };
	        // Each Utility
	        var each = forEach = function(obj, iterator, context) {
	            if (obj == null) return;
	            if (nativeForEach && obj.forEach === nativeForEach) {
	                obj.forEach(iterator, context);
	            } else if (obj.length === +obj.length) {
	                for (var i = 0,
	                l = obj.length; i < l; i++) {
	                    iterator.call(context, obj[i], i, obj);
	                }
	            } else {
	                for (var key in obj) {
	                    if (_.has(obj, key)) {
	                        iterator.call(context, obj[key], key, obj);
	                    }
	                }
	            }
	        };
	        // Extend Utiltiy
	        var extend = function(obj) {
	            each(slice.call(arguments, 1),
	            function(source) {
	                for (var prop in source) {
	                    obj[prop] = source[prop];
	                }
	            });
	            return obj;
	        };
	        // Check String Utility
	        var check = function(str) {
	            return !! (str && typeof str != "undefined" && str != null);
	        };
	        // To Version String Utility
	        var toVersionString = function(obj) {
	            var output = "";
	            obj = obj || {};
	            if (check(obj)) {
	                if (check(obj.major)) {
	                    output += obj.major;
	                    if (check(obj.minor)) {
	                        output += "." + obj.minor;
	                        if (check(obj.patch)) {
	                            output += "." + obj.patch;
	                        }
	                    }
	                }
	            }
	            return output;
	        };
	        // To String Utility
	        var toString = function(obj) {
	            obj = obj || {};
	            var suffix = toVersionString(obj);
	            if (suffix) suffix = " " + suffix;
	            return obj && check(obj.family) ? obj.family + suffix: "";
	        };
	        // Parse User-Agent String
	        _this.parse = function(ua) {
	            // Parsers Utility
	            var parsers = function(type) {
	                return _this.regexes[type + "_parsers"].map(function(obj) {
	                    var regexp = new RegExp(obj.regex),
	                    rep = obj[(type === "browser" ? "family": type) + "_replacement"],
	                    major_rep = obj.major_version_replacement;
	                    function parser(ua) {
	                        var m = ua.match(regexp);
	                        if (!m) return null;
	                        var ret = {};
	                        ret.family = (rep ? rep.replace("$1", m[1]) : m[1]) || "other";
	                        ret.major = parseInt(major_rep ? major_rep: m[2]) || null;
	                        ret.minor = m[3] ? parseInt(m[3]) : null;
	                        ret.patch = m[4] ? parseInt(m[4]) : null;
	                        ret.tablet = obj.tablet;
	                        ret.man = obj.manufacturer || null;
	                        return ret;
	                    }
	                    return parser;
	                });
	            };
	            // User Agent
	            var UserAgent = function() {};
	            // Browsers Parsed
	            var browser_parsers = parsers("browser");
	            // Operating Systems Parsed
	            var os_parsers = parsers("os");
	            // Devices Parsed
	            var device_parsers = parsers("device");
	            // Set Agent
	            var a = new UserAgent();
	            // Remember the original user agent string
	            a.source = ua;
	            // Set Browser
	            a.browser = find(ua, browser_parsers);
	            if (check(a.browser)) {
	                a.browser.name = toString(a.browser);
	                a.browser.version = toVersionString(a.browser);
	            } else {
	                a.browser = {};
	            }
	            // Set OS
	            a.os = find(ua, os_parsers);
	            if (check(a.os)) {
	                a.os.name = toString(a.os);
	                a.os.version = toVersionString(a.os);
	            } else {
	                a.os = {};
	            }
	            // Set Device
	            a.device = find(ua, device_parsers);
	            if (check(a.device)) {
	                a.device.name = toString(a.device);
	                a.device.version = toVersionString(a.device);
	            } else {
	                a.device = {
	                    tablet: false,
	                    family: "Other"
	                };
	            }
	            // Determine Device Type
	            var mobile_agents = {};
	            var mobile_browser_families = _this.regexes.mobile_browser_families.map(function(str) {
	                mobile_agents[str] = true;
	            });
	            var mobile_os_families = _this.regexes.mobile_os_families.map(function(str) {
	                mobile_agents[str] = true;
	            });
	            // Is Spider
	            if (a.browser.family === "Spider") {
	                a.device.type = "Spider";
	            } else if (a.browser.tablet || a.os.tablet || a.device.tablet) {
	                a.device.type = "Tablet";
	            } else if (mobile_agents.hasOwnProperty(a.browser.family)) {
	                a.device.type = "Mobile";
	            } else {
	                a.device.type = "Desktop";
	            }
	            // Determine Device Manufacturer
	            a.device.manufacturer = a.browser.man || a.os.man || a.device.man || null;
	            // Cleanup Objects
	            remove([a.browser, a.os, a.device], ["tablet", "man"]);
	            // Return Agent
	            return a;
	        };
	        // Return context
	        return _this;
	    } ();
	    // Export the Underscore object for **Node.js** and **"CommonJS"**,
	    // backwards-compatibility for the old `require()` API. If we're not
	    // CommonJS, add `_` to the global object via a string identifier
	    // the Closure Compiler "advanced" mode. Registration as an AMD
	    // via define() happens at the end of this file
	    if (typeof exports !== "undefined") {
	        if (typeof module !== "undefined" && module.exports) {
	            exports = module.exports = detect;
	        }
	        exports.detect = detect;
	    } else {
	        root["detect"] = detect;
	    }
	    // AMD define happens at the end for compatibility with AMD
	    // that don't enforce next-turn semantics on modules
	    if (typeof define === "function" && define.amd) {
	        define(function(require) {
	            return detect;
	        });
	    }
	})(window);


	function importJQCookie(){

		/*
		 * ! jQuery Cookie Plugin v1.4.1
		 * https://github.com/carhartl/jquery-cookie
		 * 
		 * Copyright 2013 Klaus Hartl Released under the MIT license
		 */
		(function (factory) {
			if (typeof define === 'function' && define.amd) {
				// AMD
				define(['jquery'], factory);
			} else if (typeof exports === 'object') {
				// CommonJS
				factory(require('jquery'));
			} else {
				// Browser globals
				factory(jQuery);
			}
		}(function ($) {

			var pluses = /\+/g;

			function encode(s) {
				return config.raw ? s : encodeURIComponent(s);
			}

			function decode(s) {
				return config.raw ? s : decodeURIComponent(s);
			}

			function stringifyCookieValue(value) {
				return encode(config.json ? JSON.stringify(value) : String(value));
			}

			function parseCookieValue(s) {
				if (s.indexOf('"') === 0) {
					// This is a quoted cookie as according to RFC2068,
					// unescape...
					s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
				}

				try {
					// Replace server-side written pluses with spaces.
					// If we can't decode the cookie, ignore it, it's unusable.
					// If we can't parse the cookie, ignore it, it's unusable.
					s = decodeURIComponent(s.replace(pluses, ' '));
					return config.json ? JSON.parse(s) : s;
				} catch(e) {}
			}

			function read(s, converter) {
				var value = config.raw ? s : parseCookieValue(s);
				return $.isFunction(converter) ? converter(value) : value;
			}

			var config = $.cookie = function (key, value, options) {

				// Write

				if (value !== undefined && !$.isFunction(value)) {
					options = $.extend({}, config.defaults, options);

					if (typeof options.expires === 'number') {
						var days = options.expires, t = options.expires = new Date();
						t.setTime(+t + days * 864e+5);
					}

					return (document.cookie = [
						encode(key), '=', stringifyCookieValue(value),
						options.expires ? '; expires=' + options.expires.toUTCString() : '', // use
																								// expires
																								// attribute,
																								// max-age
																								// is
																								// not
																								// supported
																								// by
																								// IE
						options.path    ? '; path=' + options.path : '',
						options.domain  ? '; domain=' + options.domain : '',
						options.secure  ? '; secure' : ''
					].join(''));
				}

				var result = key ? undefined : {};
				var cookies = document.cookie ? document.cookie.split('; ') : [];

				for (var i = 0, l = cookies.length; i < l; i++) {
					var parts = cookies[i].split('=');
					var name = decode(parts.shift());
					var cookie = parts.join('=');

					if (key && key === name) {
						result = read(cookie, value);
						break;
					}

					if (!key && (cookie = read(cookie)) !== undefined) {
						result[name] = cookie;
					}
				}

				return result;
			};

			config.defaults = {};

			$.removeCookie = function (key, options) {
				if ($.cookie(key) === undefined) {
					return false;
				}

				// Must not alter options, thus extending a fresh object...
				$.cookie(key, '', $.extend({}, options, { expires: -1 }));
				return !$.cookie(key);
			};

		}));
	}

	function getScript(url, success) {
	    var script = document.createElement('script');
	    script.src = url;
	    var head = document.getElementsByTagName('head')[0],
	    done = false;
	    // Attach handlers for all browsers
	    script.onload = script.onreadystatechange = function() {
	        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
	            done = true;
	            success();
	            script.onload = script.onreadystatechange = null;
	            head.removeChild(script);
	        };
	    };
	    head.appendChild(script);
	};


	/**
	 * 
	 * 使用方式： 调用 _at_tool.init(data);即可实现用户信息提交
	 * 
	 * data可填入字段项： { appname：应用系统的名字; 如："中国日报网" uid：用户的唯一id; 如："u10a0878" }
	 * 
	 * 例如： var _hmt = _hmt || []; (function() { var hm =
	 * document.createElement("script"); hm.src =
	 * "//localhost:8002/analytics?token=fdsdafewghrhjkln"; var s =
	 * document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(hm,
	 * s); })();
	 * 
	 * var data={}; data.appname="chinadaily"; data.uid="aacdgghr3";
	 * _at_tool.init(data);
	 * 
	 */

	_at_tool.init=function(data){
		_at_tool.data=data;
		_at_tool.launch();
	}

	_at_tool.info={};

	_at_tool.focusStatus="";
	
	_at_tool.getFocusStatus=function(){
		var hidden, state, visibilityChange; 
		if (typeof document.hidden !== "undefined") {
			hidden = "hidden";
			visibilityChange = "visibilitychange";
			state = "visibilityState";
		} else if (typeof document.mozHidden !== "undefined") {
			hidden = "mozHidden";
			visibilityChange = "mozvisibilitychange";
			state = "mozVisibilityState";
		} else if (typeof document.msHidden !== "undefined") {
			hidden = "msHidden";
			visibilityChange = "msvisibilitychange";
			state = "msVisibilityState";
		} else if (typeof document.webkitHidden !== "undefined") {
			hidden = "webkitHidden";
			visibilityChange = "webkitvisibilitychange";
			state = "webkitVisibilityState";
		}
		_at_tool.focusStatus=document[state];
		
		// 添加监听器，在title里显示状态变化
		document.addEventListener(visibilityChange, function() {
			if (document[state] === 'hidden') {
				_at_tool.focusStatus =document[state]; // 页面不可见时 ，可换成你的 title
			} else {
				_at_tool.focusStatus =document[state]; // 页面可见
			}
		}, false);
	}

	_at_tool.launch=function launch(){
		importJQCookie();
		_at_tool.getFocusStatus();
		_at_tool.unloadEvent();
		_at_tool.postStatus();
	}

	_at_tool.unloadEvent=function launch(){
		$(window).unload(function(){
			_at_tool.info.leave="true";
			_at_tool.postStatus();
		});
	}
	
	
	function encryptByDES(message, key) {  
	    var keyHex = CryptoJS.enc.Utf8.parse(key);  
	    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {  
	        mode: CryptoJS.mode.ECB,  
	        padding: CryptoJS.pad.Pkcs7  
	    });  
	    return encrypted.toString();  
	}  
	
	function decryptByDES(message, key) {  
	    var keyHex = CryptoJS.enc.Utf8.parse(key);  
	    var decrypted = CryptoJS.DES.decrypt(message, keyHex, {
	        mode: CryptoJS.mode.ECB,
	        padding: CryptoJS.pad.Pkcs7
	    });
	    return decrypted.toString();  
	}  

	_at_tool.info.ft=Date.parse(new Date())/1000;
	_at_tool.info.count=0;
	
	/***用户行为采集***/
	_at_tool.postStatus= function postStatus(){
		//过滤url，只要合法url
		if(verifyURL()==false){
			return;
		}
		
		var ua = detect.parse(navigator.userAgent);
		var info ;
		if(!(typeof app_uid_ === 'undefined')){
			info.app_uid_=app_uid_;
		}
		
		if(_at_tool.info.count>0){
			info={};
		}else{
			info = _at_tool.info;
		}
		//超过一个小时不再提交
		if(Date.parse(new Date())/1000-_at_tool.info.ft>3550){
			return;
		}
		info.fs=_at_tool.focusStatus;// focusStatus
		if(_at_tool.info.count>0){
			info.count=_at_tool.info.count;
			info.duration=Date.parse(new Date())/1000-_at_tool.info.ft;
		}else{
			info.fs=_at_tool.focusStatus;// focusStatus
			info.ad=_at_tool.data;// appdata
			info.bf=ua.browser.family;// browser_family
			info.bv=ua.browser.version;// browser_version
			info.df=ua.device.family;// device_family
			info.dv=ua.device.version;// device_version
			info.of=ua.os.family;// os_family
			info.ov=ua.os.version;// os_version
			info.rr=document.referrer;// referrer
			info.lang=navigator.language;
			info.title=document.title;
			info.sh=window.screen.height;// screen_h
			info.sw=window.screen.width;// screen_w
			info.url=document.URL;
			info.lt=Date.parse(new Date())/1000;// localtime
		}
		var message = JSON.stringify(info);  
		var ciphertext = encryptByDES(message, __i_tk);  
		var pdata;

		if(!_at_tool._aid){
			pdata={d:ciphertext,rec:1};
		}else{
			pdata={d:ciphertext,_aid:_at_tool._aid};// aid:访问的唯一标识
		}
		jQuery.ajax(
			  {
				  type: 'GET',
				  dataType: 'jsonp', 
				  url:__render_host+"uac",
				  async:true,
				  data:pdata,
				  jsonp:'icb_uac',
				  jsonpCallback:'icb_uac', 
			      success: function(json){ 
			    	  if(info.count==0){
			    		  _at_tool._aid=json._aid;
			    			render_msg(json)
			    	  }
			    	  _at_tool.info.count= _at_tool.info.count+1;
			    	  setTimeout(function(){_at_tool.postStatus();},__render_refresh); 
	              },error:function(){
	            	  setTimeout(function(){_at_tool.postStatus();},__render_refresh); 
	              }
			  }
		);
	}
}


function strToHexCharCode(str) {
	if (str === "")
		return "";
	var hexCharCode = [];
	hexCharCode.push("0x");
	for (var i = 0; i < str.length; i++) {
		hexCharCode.push((str.charCodeAt(i)).toString(16));
	}
	return hexCharCode.join("");
}

function hexCharCodeToStr(hexCharCodeStr) {
	var trimedStr = hexCharCodeStr.trim();
	var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr
			.substr(2)
			: trimedStr;
	var len = rawStr.length;
	if (len % 2 !== 0) {
		return "";
	}
	var curCharCode;
	var resultStr = [];
	for (var i = 0; i < len; i = i + 2) {
		curCharCode = parseInt(rawStr.substr(i, 2), 16);
		resultStr.push(String.fromCharCode(curCharCode));
	}
	return resultStr.join("");
}

function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name
			+ "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg)) {
		return unescape(arr[2]);
	} else {
		return null;
	}
}

function getUserInfo(){
	if(getCookie("U_INFO")!=null){
		var temp = getCookie("U_INFO").replace("\"","").replace("\"","");
		var desTemp = decryptByDES(temp,__i_tk);
		return hexCharCodeToStr(desTemp);
	}else{
		return '{"status":"0","msg":"未登录"}';
	}
}
