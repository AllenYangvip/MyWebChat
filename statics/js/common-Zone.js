function uaMatch(e) {
	e = e.toLowerCase();
	var t = rwebkit.exec(e) || ropera.exec(e) || rmsie.exec(e) || e.indexOf("compatible") < 0 && rmozilla.exec(e) || [];
	return {
		browser: t[1] || "",
		version: t[2] || "0"
	}
}

function linksClickStat(e, t) {
	void 0 == t && (t = "");
	var n = $.gozap,
		i = n.labi,
		o = "/link/clickcount/update?" + n.param({
			linksId: e,
			source: t
		});
	i.ajax({
		url: o,
		success: function(e) {
			"9999" == e.code
		}
	})
}

function versionStat() {
	var e = $.gozap,
		t = e.labi,
		n = "/version/stat";
	t.ajax({
		url: n,
		type: "POST",
		data: e.param({
			version: "2.0"
		}),
		success: function(e) {
			window.location.reload(), "9999" == e.code
		}
	})
}

function rhex(e) {
	for(str = "", j = 0; j <= 3; j++) str += hex_chr.charAt(e >> 8 * j + 4 & 15) + hex_chr.charAt(e >> 8 * j & 15);
	return str
}

function str2blks_MD5(e) {
	for(nblk = (e.length + 8 >> 6) + 1, blks = new Array(16 * nblk), i = 0; i < 16 * nblk; i++) blks[i] = 0;
	for(i = 0; i < e.length; i++) blks[i >> 2] |= e.charCodeAt(i) << i % 4 * 8;
	return blks[i >> 2] |= 128 << i % 4 * 8, blks[16 * nblk - 2] = 8 * e.length, blks
}

function add(e, t) {
	var n = (65535 & e) + (65535 & t),
		i = (e >> 16) + (t >> 16) + (n >> 16);
	return i << 16 | 65535 & n
}

function rol(e, t) {
	return e << t | e >>> 32 - t
}

function cmn(e, t, n, i, o, a) {
	return add(rol(add(add(t, e), add(i, a)), o), n)
}

function ff(e, t, n, i, o, a, s) {
	return cmn(t & n | ~t & i, e, t, o, a, s)
}

function gg(e, t, n, i, o, a, s) {
	return cmn(t & i | n & ~i, e, t, o, a, s)
}

function hh(e, t, n, i, o, a, s) {
	return cmn(t ^ n ^ i, e, t, o, a, s)
}

function ii(e, t, n, i, o, a, s) {
	return cmn(n ^ (t | ~i), e, t, o, a, s)
}

function MD5(e) {
	x = str2blks_MD5(e);
	var t = 1732584193,
		n = -271733879,
		o = -1732584194,
		a = 271733878;
	for(i = 0; i < x.length; i += 16) {
		var s = t,
			r = n,
			l = o,
			c = a;
		t = ff(t, n, o, a, x[i + 0], 7, -680876936), a = ff(a, t, n, o, x[i + 1], 12, -389564586), o = ff(o, a, t, n, x[i + 2], 17, 606105819), n = ff(n, o, a, t, x[i + 3], 22, -1044525330), t = ff(t, n, o, a, x[i + 4], 7, -176418897), a = ff(a, t, n, o, x[i + 5], 12, 1200080426), o = ff(o, a, t, n, x[i + 6], 17, -1473231341), n = ff(n, o, a, t, x[i + 7], 22, -45705983), t = ff(t, n, o, a, x[i + 8], 7, 1770035416), a = ff(a, t, n, o, x[i + 9], 12, -1958414417), o = ff(o, a, t, n, x[i + 10], 17, -42063), n = ff(n, o, a, t, x[i + 11], 22, -1990404162), t = ff(t, n, o, a, x[i + 12], 7, 1804603682), a = ff(a, t, n, o, x[i + 13], 12, -40341101), o = ff(o, a, t, n, x[i + 14], 17, -1502002290), n = ff(n, o, a, t, x[i + 15], 22, 1236535329), t = gg(t, n, o, a, x[i + 1], 5, -165796510), a = gg(a, t, n, o, x[i + 6], 9, -1069501632), o = gg(o, a, t, n, x[i + 11], 14, 643717713), n = gg(n, o, a, t, x[i + 0], 20, -373897302), t = gg(t, n, o, a, x[i + 5], 5, -701558691), a = gg(a, t, n, o, x[i + 10], 9, 38016083), o = gg(o, a, t, n, x[i + 15], 14, -660478335), n = gg(n, o, a, t, x[i + 4], 20, -405537848), t = gg(t, n, o, a, x[i + 9], 5, 568446438), a = gg(a, t, n, o, x[i + 14], 9, -1019803690), o = gg(o, a, t, n, x[i + 3], 14, -187363961), n = gg(n, o, a, t, x[i + 8], 20, 1163531501), t = gg(t, n, o, a, x[i + 13], 5, -1444681467), a = gg(a, t, n, o, x[i + 2], 9, -51403784), o = gg(o, a, t, n, x[i + 7], 14, 1735328473), n = gg(n, o, a, t, x[i + 12], 20, -1926607734), t = hh(t, n, o, a, x[i + 5], 4, -378558), a = hh(a, t, n, o, x[i + 8], 11, -2022574463), o = hh(o, a, t, n, x[i + 11], 16, 1839030562), n = hh(n, o, a, t, x[i + 14], 23, -35309556), t = hh(t, n, o, a, x[i + 1], 4, -1530992060), a = hh(a, t, n, o, x[i + 4], 11, 1272893353), o = hh(o, a, t, n, x[i + 7], 16, -155497632), n = hh(n, o, a, t, x[i + 10], 23, -1094730640), t = hh(t, n, o, a, x[i + 13], 4, 681279174), a = hh(a, t, n, o, x[i + 0], 11, -358537222), o = hh(o, a, t, n, x[i + 3], 16, -722521979), n = hh(n, o, a, t, x[i + 6], 23, 76029189), t = hh(t, n, o, a, x[i + 9], 4, -640364487), a = hh(a, t, n, o, x[i + 12], 11, -421815835), o = hh(o, a, t, n, x[i + 15], 16, 530742520), n = hh(n, o, a, t, x[i + 2], 23, -995338651), t = ii(t, n, o, a, x[i + 0], 6, -198630844), a = ii(a, t, n, o, x[i + 7], 10, 1126891415), o = ii(o, a, t, n, x[i + 14], 15, -1416354905), n = ii(n, o, a, t, x[i + 5], 21, -57434055), t = ii(t, n, o, a, x[i + 12], 6, 1700485571), a = ii(a, t, n, o, x[i + 3], 10, -1894986606), o = ii(o, a, t, n, x[i + 10], 15, -1051523), n = ii(n, o, a, t, x[i + 1], 21, -2054922799), t = ii(t, n, o, a, x[i + 8], 6, 1873313359), a = ii(a, t, n, o, x[i + 15], 10, -30611744), o = ii(o, a, t, n, x[i + 6], 15, -1560198380), n = ii(n, o, a, t, x[i + 13], 21, 1309151649), t = ii(t, n, o, a, x[i + 4], 6, -145523070), a = ii(a, t, n, o, x[i + 11], 10, -1120210379), o = ii(o, a, t, n, x[i + 2], 15, 718787259), n = ii(n, o, a, t, x[i + 9], 21, -343485551), t = add(t, s), n = add(n, r), o = add(o, l), a = add(a, c)
	}
	return rhex(t) + rhex(n) + rhex(o) + rhex(a)
}

function WL() {
	function e() {
		"function" == typeof window.WebSocket ? (window.console.log("WebSocketIM"), n.wl = new WebSocketIM({
			wsUrl: n.wsUrl,
			httpUrl: n.httpUrl,
			token: n.token,
			stateHander: n.stateHander,
			messageHander: n.messageHander,
			wsErrorHander: n.wsErrorHander,
			type: n.type
		})) : (window.console.log("LongPollingIM"), n.wl = new LongPollingIM({
			lpUrl: n.lpUrl,
			httpUrl: n.httpUrl,
			token: n.token,
			stateHander: n.stateHander,
			messageHander: n.messageHander,
			type: n.type
		}))
	}

	function t(e) {
		if("object" == typeof e)
			for(var t in e) n[t] = e[t]
	}
	var n = this;
	return n.wl = null, n.type = "post", n.wsUrl = null, n.lpUrl = null, n.httpUrl = null, n.token = null, n.stateHander = null, n.messageHander = [], arguments.length > 0 && (t(arguments[0]), e()), n.wl
}

function LongPollingIM() {
	function e(e, t, n) {
		n ? e.unshift(t) : e.push(t)
	}

	function t(e) {
		if("object" == typeof e)
			for(var t in e) a[t] = e[t]
	}

	function n() {
		return "http://" + a.httpUrl + "/m/api/internal/send_message?debug=1"
	}

	function i() {
		return "http://" + a.lpUrl + "/messages?" + a.token
	}

	function o() {
		r = n(), l = i()
	}
	var a = this;
	a.type = "post", a.lpUrl = null, a.httpUrl = null, a.token = null, a.stateHander = null, a.messageHander = null;
	var s = new Array,
		r = null,
		l = null;
	a.init = function(e) {
		a.token = e
	}, a.sendMessage = function(t) {
		e(s, t)
	};
	if(arguments.length > 0) return t(arguments[0]), o(), !1
}

function WebSocketIM() {
	function e() {
		P = u(), M = p()
	}

	function t(e) {
		w = null, b = null, window.console.log("initWS"), b = new WebSocket(P), b.onopen = function() {
			window.console.log("onopen"), "function" == typeof e && e()
		}, b.onclose = function(e) {
			window.console.log("onclose")
		}, b.onerror = function() {
			window.console.log("onerror"), w = 52
		}, b.onmessage = function(e) {
			window.console.log("onmessage"), a(e)
		}
	}

	function n(e) {
		null != b && b.readyState != WebSocket.CLOSED || t()
	}

	function i() {
		window.console.log("reconnect state_token=" + w), 52 == w ? "function" == typeof v.stateHander && v.stateHander(52) : (b && b.readyState == WebSocket.CLOSED && n(), setTimeout(i, I))
	}

	function o() {
		b && b.readyState == WebSocket.OPEN && s(x, {
			message_type: 0
		}, !0), setTimeout(o, E)
	}

	function a(e) {
		if(e) {
			var t = JSON.parse(e.data),
				n = t.message_type;
			if(1 == n) w = 1;
			else if(52 == n) w = 52;
			else if(51 == n) w = 1;
			else {
				if(w = 1, v.messageHander && v.messageHander.length > 0)
					for(var i = 0; i < v.messageHander.length; i++) "function" == typeof v.messageHander[i] && v.messageHander[i](t);
				105 == n && r(t)
			}
		}
	}

	function s(e, t, n) {
		n ? e.unshift(t) : e.push(t)
	}

	function r(e) {
		if(e.id && N[e.message_type]) {
			var t = {
				id: e.id,
				message_type: N[e.message_type]
			};
			s(x, t)
		}
	}

	function l() {
		y = y ? y : x.shift(), y ? (window.console.log("handleMessageQueue currentSendMessage.message_type=" + y.message_type), 105 == y.message_type ? d(y, function(e) {
			window.console.log("handleMessageQueue ajax_SendMessage 发送结果" + e), e ? (y = null, setTimeout(l, _)) : setTimeout(l, T)
		}) : 104 == y.message_type || 0 == y.message_type ? (window.console.log("state_token=" + w), 52 != w ? c(y, function(e) {
			window.console.log("handleMessageQueue ws_SendMessage 发送结果" + e), e ? (y = null, setTimeout(l, _)) : setTimeout(l, T)
		}) : setTimeout(l, C)) : y = null) : setTimeout(l, S)
	}

	function c(e, t) {
		b && b.readyState == WebSocket.OPEN ? ("string" == typeof e ? b.send(e) : b.send(JSON.stringify(e)), t(!0)) : y = e
	}

	function d(e, t) {
		if("function" == typeof window.jQuery) {
			var n = M,
				i = {
					url: n,
					type: v.type ? v.type : "get",
					contentType: "application/x-www-form-urlencoded",
					data: e,
					dataType: "json",
					success: function(e) {
						var n = e;
						t(0 == n.code)
					},
					error: function(e, n, i) {
						t(!1)
					}
				};
			$.ajax(i)
		} else {
			var o = f();
			if(o.onreadystatechange = function() {
					if(4 == o.readyState)
						if(o.status >= 200 && o.status < 300 || 304 == o.status) {
							var e = JSON.parse(o.responseText);
							t(0 == e.code ? !0 : !1)
						} else t(!1)
				}, "post" == v.type) {
				var n = M;
				o.open("post", n, !0), o.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), o.send(g(e))
			} else {
				var n = m(M, e);
				o.open("get", n, !0), o.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), o.send(null)
			}
		}
	}

	function u() {
		return "ws://" + v.wsUrl + "/messages?" + v.token
	}

	function p() {
		return "http://" + v.httpUrl + "/m/api/internal/send_message?debug=1"
	}

	function h(e) {
		if("object" == typeof e)
			for(var t in e) v[t] = e[t]
	}

	function f() {
		if("undefined" != typeof XMLHttpRequest) return new XMLHttpRequest;
		if("undefined" != typeof ActiveXObject) {
			if("string" != typeof arguments.callee.activeXString) {
				var e, t, n = ["MSXML2.XMLHttp6.0", "MSXML2.XMLHttp3.0", "MSXML2.XMLHttp"];
				for(e = 0, t = n.length; e < t; e++) try {
					new ActiveXObject(n[e]), arguments.callee.activeXString = n[e];
					break
				} catch(i) {}
			}
			return new ActiveXObject(arguments.callee.activeXString)
		}
		return null
	}

	function m(e, t) {
		if("object" == typeof t) {
			e += e.indexOf("?") == -1 ? "?" : "&";
			for(var n in t) e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n])
		}
		return e
	}

	function g(e) {
		var t = "";
		if("object" == typeof e)
			for(var n in e) t += encodeURIComponent(n) + "=" + encodeURIComponent(e[n]) + "&";
		return t = t.replace(/&$/, ""), t ? t : null
	}
	var v = this,
		b = null,
		x = new Array,
		y = null,
		w = null,
		_ = 10,
		T = 3e3,
		C = 3e3,
		k = 1e3,
		S = 3e3,
		E = 6e4,
		j = 6e4,
		I = 1e4,
		O = 1e4;
	v.type = "post", v.wsUrl = null, v.httpUrl = null, v.token = null, v.stateHander = null, v.messageHander = null, v.wsErrorHander = null;
	var P = null,
		M = null;
	v.sendMessage = function(e) {
		s(x, e)
	}, v.init = function(n) {
		v.token = n, e(), t(function() {
			setTimeout(i, O), setTimeout(o, j)
		})
	};
	var N = new Object;
	N[100] = 101, N[105] = 104, arguments.length > 0 && (h(arguments[0]), e(), n(), setTimeout(l, k), setTimeout(i, O), setTimeout(o, j))
}

function getStringLength(e) {
	return e.replace(/[^\x00-\xff]/g, "  ").length
}

function replaceHttps(e) {
	return e && e.indexOf("https") < 0 ? e.indexOf("http") < 0 ? e : e.split("http:")[1] : e
}

function isIEBrowser() {
	return !!window.attachEvent
}! function(e, t) {
	"object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
		if(!e.document) throw new Error("jQuery requires a window with a document");
		return t(e)
	} : t(e)
}("undefined" != typeof window ? window : this, function(e, t) {
	function n(e) {
		var t = "length" in e && e.length,
			n = oe.type(e);
		return "function" !== n && !oe.isWindow(e) && (!(1 !== e.nodeType || !t) || ("array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e))
	}

	function i(e, t, n) {
		if(oe.isFunction(t)) return oe.grep(e, function(e, i) {
			return !!t.call(e, i, e) !== n
		});
		if(t.nodeType) return oe.grep(e, function(e) {
			return e === t !== n
		});
		if("string" == typeof t) {
			if(pe.test(t)) return oe.filter(t, e, n);
			t = oe.filter(t, e)
		}
		return oe.grep(e, function(e) {
			return oe.inArray(e, t) >= 0 !== n
		})
	}

	function o(e, t) {
		do e = e[t]; while (e && 1 !== e.nodeType);
		return e
	}

	function a(e) {
		var t = ye[e] = {};
		return oe.each(e.match(xe) || [], function(e, n) {
			t[n] = !0
		}), t
	}

	function s() {
		fe.addEventListener ? (fe.removeEventListener("DOMContentLoaded", r, !1), e.removeEventListener("load", r, !1)) : (fe.detachEvent("onreadystatechange", r), e.detachEvent("onload", r))
	}

	function r() {
		(fe.addEventListener || "load" === event.type || "complete" === fe.readyState) && (s(), oe.ready())
	}

	function l(e, t, n) {
		if(void 0 === n && 1 === e.nodeType) {
			var i = "data-" + t.replace(ke, "-$1").toLowerCase();
			if(n = e.getAttribute(i), "string" == typeof n) {
				try {
					n = "true" === n || "false" !== n && ("null" === n ? null : +n + "" === n ? +n : Ce.test(n) ? oe.parseJSON(n) : n)
				} catch(o) {}
				oe.data(e, t, n)
			} else n = void 0
		}
		return n
	}

	function c(e) {
		var t;
		for(t in e)
			if(("data" !== t || !oe.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
		return !0
	}

	function d(e, t, n, i) {
		if(oe.acceptData(e)) {
			var o, a, s = oe.expando,
				r = e.nodeType,
				l = r ? oe.cache : e,
				c = r ? e[s] : e[s] && s;
			if(c && l[c] && (i || l[c].data) || void 0 !== n || "string" != typeof t) return c || (c = r ? e[s] = G.pop() || oe.guid++ : s), l[c] || (l[c] = r ? {} : {
				toJSON: oe.noop
			}), ("object" == typeof t || "function" == typeof t) && (i ? l[c] = oe.extend(l[c], t) : l[c].data = oe.extend(l[c].data, t)), a = l[c], i || (a.data || (a.data = {}), a = a.data), void 0 !== n && (a[oe.camelCase(t)] = n), "string" == typeof t ? (o = a[t], null == o && (o = a[oe.camelCase(t)])) : o = a, o
		}
	}

	function u(e, t, n) {
		if(oe.acceptData(e)) {
			var i, o, a = e.nodeType,
				s = a ? oe.cache : e,
				r = a ? e[oe.expando] : oe.expando;
			if(s[r]) {
				if(t && (i = n ? s[r] : s[r].data)) {
					oe.isArray(t) ? t = t.concat(oe.map(t, oe.camelCase)) : t in i ? t = [t] : (t = oe.camelCase(t), t = t in i ? [t] : t.split(" ")), o = t.length;
					for(; o--;) delete i[t[o]];
					if(n ? !c(i) : !oe.isEmptyObject(i)) return
				}(n || (delete s[r].data, c(s[r]))) && (a ? oe.cleanData([e], !0) : ne.deleteExpando || s != s.window ? delete s[r] : s[r] = null)
			}
		}
	}

	function p() {
		return !0
	}

	function h() {
		return !1
	}

	function f() {
		try {
			return fe.activeElement
		} catch(e) {}
	}

	function m(e) {
		var t = Le.split("|"),
			n = e.createDocumentFragment();
		if(n.createElement)
			for(; t.length;) n.createElement(t.pop());
		return n
	}

	function g(e, t) {
		var n, i, o = 0,
			a = typeof e.getElementsByTagName !== Te ? e.getElementsByTagName(t || "*") : typeof e.querySelectorAll !== Te ? e.querySelectorAll(t || "*") : void 0;
		if(!a)
			for(a = [], n = e.childNodes || e; null != (i = n[o]); o++) !t || oe.nodeName(i, t) ? a.push(i) : oe.merge(a, g(i, t));
		return void 0 === t || t && oe.nodeName(e, t) ? oe.merge([e], a) : a
	}

	function v(e) {
		Ie.test(e.type) && (e.defaultChecked = e.checked)
	}

	function b(e, t) {
		return oe.nodeName(e, "table") && oe.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
	}

	function x(e) {
		return e.type = (null !== oe.find.attr(e, "type")) + "/" + e.type, e
	}

	function y(e) {
		var t = Je.exec(e.type);
		return t ? e.type = t[1] : e.removeAttribute("type"), e
	}

	function w(e, t) {
		for(var n, i = 0; null != (n = e[i]); i++) oe._data(n, "globalEval", !t || oe._data(t[i], "globalEval"))
	}

	function _(e, t) {
		if(1 === t.nodeType && oe.hasData(e)) {
			var n, i, o, a = oe._data(e),
				s = oe._data(t, a),
				r = a.events;
			if(r) {
				delete s.handle, s.events = {};
				for(n in r)
					for(i = 0, o = r[n].length; o > i; i++) oe.event.add(t, n, r[n][i])
			}
			s.data && (s.data = oe.extend({}, s.data))
		}
	}

	function T(e, t) {
		var n, i, o;
		if(1 === t.nodeType) {
			if(n = t.nodeName.toLowerCase(), !ne.noCloneEvent && t[oe.expando]) {
				o = oe._data(t);
				for(i in o.events) oe.removeEvent(t, i, o.handle);
				t.removeAttribute(oe.expando)
			}
			"script" === n && t.text !== e.text ? (x(t).text = e.text, y(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), ne.html5Clone && e.innerHTML && !oe.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && Ie.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
		}
	}

	function C(t, n) {
		var i, o = oe(n.createElement(t)).appendTo(n.body),
			a = e.getDefaultComputedStyle && (i = e.getDefaultComputedStyle(o[0])) ? i.display : oe.css(o[0], "display");
		return o.detach(), a
	}

	function k(e) {
		var t = fe,
			n = Ke[e];
		return n || (n = C(e, t), "none" !== n && n || (Qe = (Qe || oe("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement), t = (Qe[0].contentWindow || Qe[0].contentDocument).document, t.write(), t.close(), n = C(e, t), Qe.detach()), Ke[e] = n), n
	}

	function S(e, t) {
		return {
			get: function() {
				var n = e();
				if(null != n) return n ? void delete this.get : (this.get = t).apply(this, arguments)
			}
		}
	}

	function $(e, t) {
		if(t in e) return t;
		for(var n = t.charAt(0).toUpperCase() + t.slice(1), i = t, o = pt.length; o--;)
			if(t = pt[o] + n, t in e) return t;
		return i
	}

	function E(e, t) {
		for(var n, i, o, a = [], s = 0, r = e.length; r > s; s++) i = e[s], i.style && (a[s] = oe._data(i, "olddisplay"), n = i.style.display, t ? (a[s] || "none" !== n || (i.style.display = ""), "" === i.style.display && Ee(i) && (a[s] = oe._data(i, "olddisplay", k(i.nodeName)))) : (o = Ee(i), (n && "none" !== n || !o) && oe._data(i, "olddisplay", o ? n : oe.css(i, "display"))));
		for(s = 0; r > s; s++) i = e[s], i.style && (t && "none" !== i.style.display && "" !== i.style.display || (i.style.display = t ? a[s] || "" : "none"));
		return e
	}

	function j(e, t, n) {
		var i = lt.exec(t);
		return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : t
	}

	function I(e, t, n, i, o) {
		for(var a = n === (i ? "border" : "content") ? 4 : "width" === t ? 1 : 0, s = 0; 4 > a; a += 2) "margin" === n && (s += oe.css(e, n + $e[a], !0, o)), i ? ("content" === n && (s -= oe.css(e, "padding" + $e[a], !0, o)), "margin" !== n && (s -= oe.css(e, "border" + $e[a] + "Width", !0, o))) : (s += oe.css(e, "padding" + $e[a], !0, o), "padding" !== n && (s += oe.css(e, "border" + $e[a] + "Width", !0, o)));
		return s
	}

	function O(e, t, n) {
		var i = !0,
			o = "width" === t ? e.offsetWidth : e.offsetHeight,
			a = et(e),
			s = ne.boxSizing && "border-box" === oe.css(e, "boxSizing", !1, a);
		if(0 >= o || null == o) {
			if(o = tt(e, t, a), (0 > o || null == o) && (o = e.style[t]), it.test(o)) return o;
			i = s && (ne.boxSizingReliable() || o === e.style[t]), o = parseFloat(o) || 0
		}
		return o + I(e, t, n || (s ? "border" : "content"), i, a) + "px"
	}

	function P(e, t, n, i, o) {
		return new P.prototype.init(e, t, n, i, o)
	}

	function M() {
		return setTimeout(function() {
			ht = void 0
		}), ht = oe.now()
	}

	function N(e, t) {
		var n, i = {
				height: e
			},
			o = 0;
		for(t = t ? 1 : 0; 4 > o; o += 2 - t) n = $e[o], i["margin" + n] = i["padding" + n] = e;
		return t && (i.opacity = i.width = e), i
	}

	function A(e, t, n) {
		for(var i, o = (xt[t] || []).concat(xt["*"]), a = 0, s = o.length; s > a; a++)
			if(i = o[a].call(n, t, e)) return i
	}

	function L(e, t, n) {
		var i, o, a, s, r, l, c, d, u = this,
			p = {},
			h = e.style,
			f = e.nodeType && Ee(e),
			m = oe._data(e, "fxshow");
		n.queue || (r = oe._queueHooks(e, "fx"), null == r.unqueued && (r.unqueued = 0, l = r.empty.fire, r.empty.fire = function() {
			r.unqueued || l()
		}), r.unqueued++, u.always(function() {
			u.always(function() {
				r.unqueued--, oe.queue(e, "fx").length || r.empty.fire()
			})
		})), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [h.overflow, h.overflowX, h.overflowY], c = oe.css(e, "display"), d = "none" === c ? oe._data(e, "olddisplay") || k(e.nodeName) : c, "inline" === d && "none" === oe.css(e, "float") && (ne.inlineBlockNeedsLayout && "inline" !== k(e.nodeName) ? h.zoom = 1 : h.display = "inline-block")), n.overflow && (h.overflow = "hidden", ne.shrinkWrapBlocks() || u.always(function() {
			h.overflow = n.overflow[0], h.overflowX = n.overflow[1], h.overflowY = n.overflow[2]
		}));
		for(i in t)
			if(o = t[i], mt.exec(o)) {
				if(delete t[i], a = a || "toggle" === o, o === (f ? "hide" : "show")) {
					if("show" !== o || !m || void 0 === m[i]) continue;
					f = !0
				}
				p[i] = m && m[i] || oe.style(e, i)
			} else c = void 0;
		if(oe.isEmptyObject(p)) "inline" === ("none" === c ? k(e.nodeName) : c) && (h.display = c);
		else {
			m ? "hidden" in m && (f = m.hidden) : m = oe._data(e, "fxshow", {}), a && (m.hidden = !f), f ? oe(e).show() : u.done(function() {
				oe(e).hide()
			}), u.done(function() {
				var t;
				oe._removeData(e, "fxshow");
				for(t in p) oe.style(e, t, p[t])
			});
			for(i in p) s = A(f ? m[i] : 0, i, u), i in m || (m[i] = s.start, f && (s.end = s.start, s.start = "width" === i || "height" === i ? 1 : 0))
		}
	}

	function D(e, t) {
		var n, i, o, a, s;
		for(n in e)
			if(i = oe.camelCase(n), o = t[i], a = e[n], oe.isArray(a) && (o = a[1], a = e[n] = a[0]), n !== i && (e[i] = a, delete e[n]), s = oe.cssHooks[i], s && "expand" in s) {
				a = s.expand(a), delete e[i];
				for(n in a) n in e || (e[n] = a[n], t[n] = o)
			} else t[i] = o
	}

	function B(e, t, n) {
		var i, o, a = 0,
			s = bt.length,
			r = oe.Deferred().always(function() {
				delete l.elem
			}),
			l = function() {
				if(o) return !1;
				for(var t = ht || M(), n = Math.max(0, c.startTime + c.duration - t), i = n / c.duration || 0, a = 1 - i, s = 0, l = c.tweens.length; l > s; s++) c.tweens[s].run(a);
				return r.notifyWith(e, [c, a, n]), 1 > a && l ? n : (r.resolveWith(e, [c]), !1)
			},
			c = r.promise({
				elem: e,
				props: oe.extend({}, t),
				opts: oe.extend(!0, {
					specialEasing: {}
				}, n),
				originalProperties: t,
				originalOptions: n,
				startTime: ht || M(),
				duration: n.duration,
				tweens: [],
				createTween: function(t, n) {
					var i = oe.Tween(e, c.opts, t, n, c.opts.specialEasing[t] || c.opts.easing);
					return c.tweens.push(i), i
				},
				stop: function(t) {
					var n = 0,
						i = t ? c.tweens.length : 0;
					if(o) return this;
					for(o = !0; i > n; n++) c.tweens[n].run(1);
					return t ? r.resolveWith(e, [c, t]) : r.rejectWith(e, [c, t]), this
				}
			}),
			d = c.props;
		for(D(d, c.opts.specialEasing); s > a; a++)
			if(i = bt[a].call(c, e, d, c.opts)) return i;
		return oe.map(d, A, c), oe.isFunction(c.opts.start) && c.opts.start.call(e, c), oe.fx.timer(oe.extend(l, {
			elem: e,
			anim: c,
			queue: c.opts.queue
		})), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always)
	}

	function H(e) {
		return function(t, n) {
			"string" != typeof t && (n = t, t = "*");
			var i, o = 0,
				a = t.toLowerCase().match(xe) || [];
			if(oe.isFunction(n))
				for(; i = a[o++];) "+" === i.charAt(0) ? (i = i.slice(1) || "*", (e[i] = e[i] || []).unshift(n)) : (e[i] = e[i] || []).push(n)
		}
	}

	function R(e, t, n, i) {
		function o(r) {
			var l;
			return a[r] = !0, oe.each(e[r] || [], function(e, r) {
				var c = r(t, n, i);
				return "string" != typeof c || s || a[c] ? s ? !(l = c) : void 0 : (t.dataTypes.unshift(c), o(c), !1)
			}), l
		}
		var a = {},
			s = e === Ut;
		return o(t.dataTypes[0]) || !a["*"] && o("*")
	}

	function z(e, t) {
		var n, i, o = oe.ajaxSettings.flatOptions || {};
		for(i in t) void 0 !== t[i] && ((o[i] ? e : n || (n = {}))[i] = t[i]);
		return n && oe.extend(!0, e, n), e
	}

	function F(e, t, n) {
		for(var i, o, a, s, r = e.contents, l = e.dataTypes;
			"*" === l[0];) l.shift(), void 0 === o && (o = e.mimeType || t.getResponseHeader("Content-Type"));
		if(o)
			for(s in r)
				if(r[s] && r[s].test(o)) {
					l.unshift(s);
					break
				}
		if(l[0] in n) a = l[0];
		else {
			for(s in n) {
				if(!l[0] || e.converters[s + " " + l[0]]) {
					a = s;
					break
				}
				i || (i = s)
			}
			a = a || i
		}
		return a ? (a !== l[0] && l.unshift(a), n[a]) : void 0
	}

	function U(e, t, n, i) {
		var o, a, s, r, l, c = {},
			d = e.dataTypes.slice();
		if(d[1])
			for(s in e.converters) c[s.toLowerCase()] = e.converters[s];
		for(a = d.shift(); a;)
			if(e.responseFields[a] && (n[e.responseFields[a]] = t), !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = a, a = d.shift())
				if("*" === a) a = l;
				else if("*" !== l && l !== a) {
			if(s = c[l + " " + a] || c["* " + a], !s)
				for(o in c)
					if(r = o.split(" "), r[1] === a && (s = c[l + " " + r[0]] || c["* " + r[0]])) {
						s === !0 ? s = c[o] : c[o] !== !0 && (a = r[0], d.unshift(r[1]));
						break
					}
			if(s !== !0)
				if(s && e["throws"]) t = s(t);
				else try {
					t = s(t)
				} catch(u) {
					return {
						state: "parsererror",
						error: s ? u : "No conversion from " + l + " to " + a
					}
				}
		}
		return {
			state: "success",
			data: t
		}
	}

	function W(e, t, n, i) {
		var o;
		if(oe.isArray(t)) oe.each(t, function(t, o) {
			n || Jt.test(e) ? i(e, o) : W(e + "[" + ("object" == typeof o ? t : "") + "]", o, n, i)
		});
		else if(n || "object" !== oe.type(t)) i(e, t);
		else
			for(o in t) W(e + "[" + o + "]", t[o], n, i)
	}

	function q() {
		try {
			return new e.XMLHttpRequest
		} catch(t) {}
	}

	function Y() {
		try {
			return new e.ActiveXObject("Microsoft.XMLHTTP")
		} catch(t) {}
	}

	function J(e) {
		return oe.isWindow(e) ? e : 9 === e.nodeType && (e.defaultView || e.parentWindow)
	}
	var G = [],
		X = G.slice,
		V = G.concat,
		Z = G.push,
		Q = G.indexOf,
		K = {},
		ee = K.toString,
		te = K.hasOwnProperty,
		ne = {},
		ie = "1.11.3",
		oe = function(e, t) {
			return new oe.fn.init(e, t)
		},
		ae = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
		se = /^-ms-/,
		re = /-([\da-z])/gi,
		le = function(e, t) {
			return t.toUpperCase()
		};
	oe.fn = oe.prototype = {
		jquery: ie,
		constructor: oe,
		selector: "",
		length: 0,
		toArray: function() {
			return X.call(this)
		},
		get: function(e) {
			return null != e ? 0 > e ? this[e + this.length] : this[e] : X.call(this)
		},
		pushStack: function(e) {
			var t = oe.merge(this.constructor(), e);
			return t.prevObject = this, t.context = this.context, t
		},
		each: function(e, t) {
			return oe.each(this, e, t)
		},
		map: function(e) {
			return this.pushStack(oe.map(this, function(t, n) {
				return e.call(t, n, t)
			}))
		},
		slice: function() {
			return this.pushStack(X.apply(this, arguments))
		},
		first: function() {
			return this.eq(0)
		},
		last: function() {
			return this.eq(-1)
		},
		eq: function(e) {
			var t = this.length,
				n = +e + (0 > e ? t : 0);
			return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
		},
		end: function() {
			return this.prevObject || this.constructor(null)
		},
		push: Z,
		sort: G.sort,
		splice: G.splice
	}, oe.extend = oe.fn.extend = function() {
		var e, t, n, i, o, a, s = arguments[0] || {},
			r = 1,
			l = arguments.length,
			c = !1;
		for("boolean" == typeof s && (c = s, s = arguments[r] || {}, r++), "object" == typeof s || oe.isFunction(s) || (s = {}), r === l && (s = this, r--); l > r; r++)
			if(null != (o = arguments[r]))
				for(i in o) e = s[i], n = o[i], s !== n && (c && n && (oe.isPlainObject(n) || (t = oe.isArray(n))) ? (t ? (t = !1, a = e && oe.isArray(e) ? e : []) : a = e && oe.isPlainObject(e) ? e : {}, s[i] = oe.extend(c, a, n)) : void 0 !== n && (s[i] = n));
		return s
	}, oe.extend({
		expando: "jQuery" + (ie + Math.random()).replace(/\D/g, ""),
		isReady: !0,
		error: function(e) {
			throw new Error(e)
		},
		noop: function() {},
		isFunction: function(e) {
			return "function" === oe.type(e)
		},
		isArray: Array.isArray || function(e) {
			return "array" === oe.type(e)
		},
		isWindow: function(e) {
			return null != e && e == e.window
		},
		isNumeric: function(e) {
			return !oe.isArray(e) && e - parseFloat(e) + 1 >= 0
		},
		isEmptyObject: function(e) {
			var t;
			for(t in e) return !1;
			return !0
		},
		isPlainObject: function(e) {
			var t;
			if(!e || "object" !== oe.type(e) || e.nodeType || oe.isWindow(e)) return !1;
			try {
				if(e.constructor && !te.call(e, "constructor") && !te.call(e.constructor.prototype, "isPrototypeOf")) return !1
			} catch(n) {
				return !1
			}
			if(ne.ownLast)
				for(t in e) return te.call(e, t);
			for(t in e);
			return void 0 === t || te.call(e, t)
		},
		type: function(e) {
			return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? K[ee.call(e)] || "object" : typeof e
		},
		globalEval: function(t) {
			t && oe.trim(t) && (e.execScript || function(t) {
				e.eval.call(e, t)
			})(t)
		},
		camelCase: function(e) {
			return e.replace(se, "ms-").replace(re, le)
		},
		nodeName: function(e, t) {
			return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
		},
		each: function(e, t, i) {
			var o, a = 0,
				s = e.length,
				r = n(e);
			if(i) {
				if(r)
					for(; s > a && (o = t.apply(e[a], i), o !== !1); a++);
				else
					for(a in e)
						if(o = t.apply(e[a], i), o === !1) break
			} else if(r)
				for(; s > a && (o = t.call(e[a], a, e[a]), o !== !1); a++);
			else
				for(a in e)
					if(o = t.call(e[a], a, e[a]), o === !1) break; return e
		},
		trim: function(e) {
			return null == e ? "" : (e + "").replace(ae, "")
		},
		makeArray: function(e, t) {
			var i = t || [];
			return null != e && (n(Object(e)) ? oe.merge(i, "string" == typeof e ? [e] : e) : Z.call(i, e)), i
		},
		inArray: function(e, t, n) {
			var i;
			if(t) {
				if(Q) return Q.call(t, e, n);
				for(i = t.length, n = n ? 0 > n ? Math.max(0, i + n) : n : 0; i > n; n++)
					if(n in t && t[n] === e) return n
			}
			return -1
		},
		merge: function(e, t) {
			for(var n = +t.length, i = 0, o = e.length; n > i;) e[o++] = t[i++];
			if(n !== n)
				for(; void 0 !== t[i];) e[o++] = t[i++];
			return e.length = o, e
		},
		grep: function(e, t, n) {
			for(var i, o = [], a = 0, s = e.length, r = !n; s > a; a++) i = !t(e[a], a), i !== r && o.push(e[a]);
			return o
		},
		map: function(e, t, i) {
			var o, a = 0,
				s = e.length,
				r = n(e),
				l = [];
			if(r)
				for(; s > a; a++) o = t(e[a], a, i), null != o && l.push(o);
			else
				for(a in e) o = t(e[a], a, i), null != o && l.push(o);
			return V.apply([], l)
		},
		guid: 1,
		proxy: function(e, t) {
			var n, i, o;
			return "string" == typeof t && (o = e[t], t = e, e = o), oe.isFunction(e) ? (n = X.call(arguments, 2), i = function() {
				return e.apply(t || this, n.concat(X.call(arguments)))
			}, i.guid = e.guid = e.guid || oe.guid++, i) : void 0
		},
		now: function() {
			return +new Date
		},
		support: ne
	}), oe.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
		K["[object " + t + "]"] = t.toLowerCase()
	});
	var ce = function(e) {
		function t(e, t, n, i) {
			var o, a, s, r, l, c, u, h, f, m;
			if((t ? t.ownerDocument || t : R) !== P && O(t), t = t || P, n = n || [], r = t.nodeType, "string" != typeof e || !e || 1 !== r && 9 !== r && 11 !== r) return n;
			if(!i && N) {
				if(11 !== r && (o = be.exec(e)))
					if(s = o[1]) {
						if(9 === r) {
							if(a = t.getElementById(s), !a || !a.parentNode) return n;
							if(a.id === s) return n.push(a), n
						} else if(t.ownerDocument && (a = t.ownerDocument.getElementById(s)) && B(t, a) && a.id === s) return n.push(a), n
					} else {
						if(o[2]) return Q.apply(n, t.getElementsByTagName(e)), n;
						if((s = o[3]) && w.getElementsByClassName) return Q.apply(n, t.getElementsByClassName(s)), n
					}
				if(w.qsa && (!A || !A.test(e))) {
					if(h = u = H, f = t, m = 1 !== r && e, 1 === r && "object" !== t.nodeName.toLowerCase()) {
						for(c = k(e), (u = t.getAttribute("id")) ? h = u.replace(ye, "\\$&") : t.setAttribute("id", h), h = "[id='" + h + "'] ", l = c.length; l--;) c[l] = h + p(c[l]);
						f = xe.test(e) && d(t.parentNode) || t, m = c.join(",")
					}
					if(m) try {
						return Q.apply(n, f.querySelectorAll(m)), n
					} catch(g) {} finally {
						u || t.removeAttribute("id")
					}
				}
			}
			return $(e.replace(le, "$1"), t, n, i)
		}

		function n() {
			function e(n, i) {
				return t.push(n + " ") > _.cacheLength && delete e[t.shift()], e[n + " "] = i
			}
			var t = [];
			return e
		}

		function i(e) {
			return e[H] = !0, e
		}

		function o(e) {
			var t = P.createElement("div");
			try {
				return !!e(t)
			} catch(n) {
				return !1
			} finally {
				t.parentNode && t.parentNode.removeChild(t), t = null
			}
		}

		function a(e, t) {
			for(var n = e.split("|"), i = e.length; i--;) _.attrHandle[n[i]] = t
		}

		function s(e, t) {
			var n = t && e,
				i = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || J) - (~e.sourceIndex || J);
			if(i) return i;
			if(n)
				for(; n = n.nextSibling;)
					if(n === t) return -1;
			return e ? 1 : -1
		}

		function r(e) {
			return function(t) {
				var n = t.nodeName.toLowerCase();
				return "input" === n && t.type === e
			}
		}

		function l(e) {
			return function(t) {
				var n = t.nodeName.toLowerCase();
				return("input" === n || "button" === n) && t.type === e
			}
		}

		function c(e) {
			return i(function(t) {
				return t = +t, i(function(n, i) {
					for(var o, a = e([], n.length, t), s = a.length; s--;) n[o = a[s]] && (n[o] = !(i[o] = n[o]))
				})
			})
		}

		function d(e) {
			return e && "undefined" != typeof e.getElementsByTagName && e
		}

		function u() {}

		function p(e) {
			for(var t = 0, n = e.length, i = ""; n > t; t++) i += e[t].value;
			return i
		}

		function h(e, t, n) {
			var i = t.dir,
				o = n && "parentNode" === i,
				a = F++;
			return t.first ? function(t, n, a) {
				for(; t = t[i];)
					if(1 === t.nodeType || o) return e(t, n, a)
			} : function(t, n, s) {
				var r, l, c = [z, a];
				if(s) {
					for(; t = t[i];)
						if((1 === t.nodeType || o) && e(t, n, s)) return !0
				} else
					for(; t = t[i];)
						if(1 === t.nodeType || o) {
							if(l = t[H] || (t[H] = {}), (r = l[i]) && r[0] === z && r[1] === a) return c[2] = r[2];
							if(l[i] = c, c[2] = e(t, n, s)) return !0
						}
			}
		}

		function f(e) {
			return e.length > 1 ? function(t, n, i) {
				for(var o = e.length; o--;)
					if(!e[o](t, n, i)) return !1;
				return !0
			} : e[0]
		}

		function m(e, n, i) {
			for(var o = 0, a = n.length; a > o; o++) t(e, n[o], i);
			return i
		}

		function g(e, t, n, i, o) {
			for(var a, s = [], r = 0, l = e.length, c = null != t; l > r; r++)(a = e[r]) && (!n || n(a, i, o)) && (s.push(a), c && t.push(r));
			return s
		}

		function v(e, t, n, o, a, s) {
			return o && !o[H] && (o = v(o)), a && !a[H] && (a = v(a, s)), i(function(i, s, r, l) {
				var c, d, u, p = [],
					h = [],
					f = s.length,
					v = i || m(t || "*", r.nodeType ? [r] : r, []),
					b = !e || !i && t ? v : g(v, p, e, r, l),
					x = n ? a || (i ? e : f || o) ? [] : s : b;
				if(n && n(b, x, r, l), o)
					for(c = g(x, h), o(c, [], r, l), d = c.length; d--;)(u = c[d]) && (x[h[d]] = !(b[h[d]] = u));
				if(i) {
					if(a || e) {
						if(a) {
							for(c = [], d = x.length; d--;)(u = x[d]) && c.push(b[d] = u);
							a(null, x = [], c, l)
						}
						for(d = x.length; d--;)(u = x[d]) && (c = a ? ee(i, u) : p[d]) > -1 && (i[c] = !(s[c] = u))
					}
				} else x = g(x === s ? x.splice(f, x.length) : x), a ? a(null, s, x, l) : Q.apply(s, x)
			})
		}

		function b(e) {
			for(var t, n, i, o = e.length, a = _.relative[e[0].type], s = a || _.relative[" "], r = a ? 1 : 0, l = h(function(e) {
					return e === t
				}, s, !0), c = h(function(e) {
					return ee(t, e) > -1
				}, s, !0), d = [function(e, n, i) {
					var o = !a && (i || n !== E) || ((t = n).nodeType ? l(e, n, i) : c(e, n, i));
					return t = null, o
				}]; o > r; r++)
				if(n = _.relative[e[r].type]) d = [h(f(d), n)];
				else {
					if(n = _.filter[e[r].type].apply(null, e[r].matches), n[H]) {
						for(i = ++r; o > i && !_.relative[e[i].type]; i++);
						return v(r > 1 && f(d), r > 1 && p(e.slice(0, r - 1).concat({
							value: " " === e[r - 2].type ? "*" : ""
						})).replace(le, "$1"), n, i > r && b(e.slice(r, i)), o > i && b(e = e.slice(i)), o > i && p(e))
					}
					d.push(n)
				}
			return f(d)
		}

		function x(e, n) {
			var o = n.length > 0,
				a = e.length > 0,
				s = function(i, s, r, l, c) {
					var d, u, p, h = 0,
						f = "0",
						m = i && [],
						v = [],
						b = E,
						x = i || a && _.find.TAG("*", c),
						y = z += null == b ? 1 : Math.random() || .1,
						w = x.length;
					for(c && (E = s !== P && s); f !== w && null != (d = x[f]); f++) {
						if(a && d) {
							for(u = 0; p = e[u++];)
								if(p(d, s, r)) {
									l.push(d);
									break
								}
							c && (z = y)
						}
						o && ((d = !p && d) && h--, i && m.push(d))
					}
					if(h += f, o && f !== h) {
						for(u = 0; p = n[u++];) p(m, v, s, r);
						if(i) {
							if(h > 0)
								for(; f--;) m[f] || v[f] || (v[f] = V.call(l));
							v = g(v)
						}
						Q.apply(l, v), c && !i && v.length > 0 && h + n.length > 1 && t.uniqueSort(l)
					}
					return c && (z = y, E = b), m
				};
			return o ? i(s) : s
		}
		var y, w, _, T, C, k, S, $, E, j, I, O, P, M, N, A, L, D, B, H = "sizzle" + 1 * new Date,
			R = e.document,
			z = 0,
			F = 0,
			U = n(),
			W = n(),
			q = n(),
			Y = function(e, t) {
				return e === t && (I = !0), 0
			},
			J = 1 << 31,
			G = {}.hasOwnProperty,
			X = [],
			V = X.pop,
			Z = X.push,
			Q = X.push,
			K = X.slice,
			ee = function(e, t) {
				for(var n = 0, i = e.length; i > n; n++)
					if(e[n] === t) return n;
				return -1
			},
			te = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
			ne = "[\\x20\\t\\r\\n\\f]",
			ie = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
			oe = ie.replace("w", "w#"),
			ae = "\\[" + ne + "*(" + ie + ")(?:" + ne + "*([*^$|!~]?=)" + ne + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + oe + "))|)" + ne + "*\\]",
			se = ":(" + ie + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ae + ")*)|.*)\\)|)",
			re = new RegExp(ne + "+", "g"),
			le = new RegExp("^" + ne + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ne + "+$", "g"),
			ce = new RegExp("^" + ne + "*," + ne + "*"),
			de = new RegExp("^" + ne + "*([>+~]|" + ne + ")" + ne + "*"),
			ue = new RegExp("=" + ne + "*([^\\]'\"]*?)" + ne + "*\\]", "g"),
			pe = new RegExp(se),
			he = new RegExp("^" + oe + "$"),
			fe = {
				ID: new RegExp("^#(" + ie + ")"),
				CLASS: new RegExp("^\\.(" + ie + ")"),
				TAG: new RegExp("^(" + ie.replace("w", "w*") + ")"),
				ATTR: new RegExp("^" + ae),
				PSEUDO: new RegExp("^" + se),
				CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ne + "*(even|odd|(([+-]|)(\\d*)n|)" + ne + "*(?:([+-]|)" + ne + "*(\\d+)|))" + ne + "*\\)|)", "i"),
				bool: new RegExp("^(?:" + te + ")$", "i"),
				needsContext: new RegExp("^" + ne + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ne + "*((?:-\\d)?\\d*)" + ne + "*\\)|)(?=[^-]|$)", "i")
			},
			me = /^(?:input|select|textarea|button)$/i,
			ge = /^h\d$/i,
			ve = /^[^{]+\{\s*\[native \w/,
			be = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
			xe = /[+~]/,
			ye = /'|\\/g,
			we = new RegExp("\\\\([\\da-f]{1,6}" + ne + "?|(" + ne + ")|.)", "ig"),
			_e = function(e, t, n) {
				var i = "0x" + t - 65536;
				return i !== i || n ? t : 0 > i ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
			},
			Te = function() {
				O()
			};
		try {
			Q.apply(X = K.call(R.childNodes), R.childNodes), X[R.childNodes.length].nodeType
		} catch(Ce) {
			Q = {
				apply: X.length ? function(e, t) {
					Z.apply(e, K.call(t))
				} : function(e, t) {
					for(var n = e.length, i = 0; e[n++] = t[i++];);
					e.length = n - 1
				}
			}
		}
		w = t.support = {}, C = t.isXML = function(e) {
			var t = e && (e.ownerDocument || e).documentElement;
			return !!t && "HTML" !== t.nodeName
		}, O = t.setDocument = function(e) {
			var t, n, i = e ? e.ownerDocument || e : R;
			return i !== P && 9 === i.nodeType && i.documentElement ? (P = i, M = i.documentElement, n = i.defaultView, n && n !== n.top && (n.addEventListener ? n.addEventListener("unload", Te, !1) : n.attachEvent && n.attachEvent("onunload", Te)), N = !C(i), w.attributes = o(function(e) {
				return e.className = "i", !e.getAttribute("className")
			}), w.getElementsByTagName = o(function(e) {
				return e.appendChild(i.createComment("")), !e.getElementsByTagName("*").length
			}), w.getElementsByClassName = ve.test(i.getElementsByClassName), w.getById = o(function(e) {
				return M.appendChild(e).id = H, !i.getElementsByName || !i.getElementsByName(H).length
			}), w.getById ? (_.find.ID = function(e, t) {
				if("undefined" != typeof t.getElementById && N) {
					var n = t.getElementById(e);
					return n && n.parentNode ? [n] : []
				}
			}, _.filter.ID = function(e) {
				var t = e.replace(we, _e);
				return function(e) {
					return e.getAttribute("id") === t
				}
			}) : (delete _.find.ID, _.filter.ID = function(e) {
				var t = e.replace(we, _e);
				return function(e) {
					var n = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
					return n && n.value === t
				}
			}), _.find.TAG = w.getElementsByTagName ? function(e, t) {
				return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : w.qsa ? t.querySelectorAll(e) : void 0
			} : function(e, t) {
				var n, i = [],
					o = 0,
					a = t.getElementsByTagName(e);
				if("*" === e) {
					for(; n = a[o++];) 1 === n.nodeType && i.push(n);
					return i
				}
				return a
			}, _.find.CLASS = w.getElementsByClassName && function(e, t) {
				return N ? t.getElementsByClassName(e) : void 0
			}, L = [], A = [], (w.qsa = ve.test(i.querySelectorAll)) && (o(function(e) {
				M.appendChild(e).innerHTML = "<a id='" + H + "'></a><select id='" + H + "-\f]' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && A.push("[*^$]=" + ne + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || A.push("\\[" + ne + "*(?:value|" + te + ")"), e.querySelectorAll("[id~=" + H + "-]").length || A.push("~="), e.querySelectorAll(":checked").length || A.push(":checked"), e.querySelectorAll("a#" + H + "+*").length || A.push(".#.+[+~]")
			}), o(function(e) {
				var t = i.createElement("input");
				t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && A.push("name" + ne + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || A.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), A.push(",.*:")
			})), (w.matchesSelector = ve.test(D = M.matches || M.webkitMatchesSelector || M.mozMatchesSelector || M.oMatchesSelector || M.msMatchesSelector)) && o(function(e) {
				w.disconnectedMatch = D.call(e, "div"), D.call(e, "[s!='']:x"), L.push("!=", se)
			}), A = A.length && new RegExp(A.join("|")), L = L.length && new RegExp(L.join("|")), t = ve.test(M.compareDocumentPosition), B = t || ve.test(M.contains) ? function(e, t) {
				var n = 9 === e.nodeType ? e.documentElement : e,
					i = t && t.parentNode;
				return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
			} : function(e, t) {
				if(t)
					for(; t = t.parentNode;)
						if(t === e) return !0;
				return !1
			}, Y = t ? function(e, t) {
				if(e === t) return I = !0, 0;
				var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
				return n ? n : (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1, 1 & n || !w.sortDetached && t.compareDocumentPosition(e) === n ? e === i || e.ownerDocument === R && B(R, e) ? -1 : t === i || t.ownerDocument === R && B(R, t) ? 1 : j ? ee(j, e) - ee(j, t) : 0 : 4 & n ? -1 : 1)
			} : function(e, t) {
				if(e === t) return I = !0, 0;
				var n, o = 0,
					a = e.parentNode,
					r = t.parentNode,
					l = [e],
					c = [t];
				if(!a || !r) return e === i ? -1 : t === i ? 1 : a ? -1 : r ? 1 : j ? ee(j, e) - ee(j, t) : 0;
				if(a === r) return s(e, t);
				for(n = e; n = n.parentNode;) l.unshift(n);
				for(n = t; n = n.parentNode;) c.unshift(n);
				for(; l[o] === c[o];) o++;
				return o ? s(l[o], c[o]) : l[o] === R ? -1 : c[o] === R ? 1 : 0
			}, i) : P
		}, t.matches = function(e, n) {
			return t(e, null, null, n)
		}, t.matchesSelector = function(e, n) {
			if((e.ownerDocument || e) !== P && O(e), n = n.replace(ue, "='$1']"), !(!w.matchesSelector || !N || L && L.test(n) || A && A.test(n))) try {
				var i = D.call(e, n);
				if(i || w.disconnectedMatch || e.document && 11 !== e.document.nodeType) return i
			} catch(o) {}
			return t(n, P, null, [e]).length > 0
		}, t.contains = function(e, t) {
			return(e.ownerDocument || e) !== P && O(e), B(e, t)
		}, t.attr = function(e, t) {
			(e.ownerDocument || e) !== P && O(e);
			var n = _.attrHandle[t.toLowerCase()],
				i = n && G.call(_.attrHandle, t.toLowerCase()) ? n(e, t, !N) : void 0;
			return void 0 !== i ? i : w.attributes || !N ? e.getAttribute(t) : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
		}, t.error = function(e) {
			throw new Error("Syntax error, unrecognized expression: " + e)
		}, t.uniqueSort = function(e) {
			var t, n = [],
				i = 0,
				o = 0;
			if(I = !w.detectDuplicates, j = !w.sortStable && e.slice(0), e.sort(Y), I) {
				for(; t = e[o++];) t === e[o] && (i = n.push(o));
				for(; i--;) e.splice(n[i], 1)
			}
			return j = null, e
		}, T = t.getText = function(e) {
			var t, n = "",
				i = 0,
				o = e.nodeType;
			if(o) {
				if(1 === o || 9 === o || 11 === o) {
					if("string" == typeof e.textContent) return e.textContent;
					for(e = e.firstChild; e; e = e.nextSibling) n += T(e)
				} else if(3 === o || 4 === o) return e.nodeValue
			} else
				for(; t = e[i++];) n += T(t);
			return n
		}, _ = t.selectors = {
			cacheLength: 50,
			createPseudo: i,
			match: fe,
			attrHandle: {},
			find: {},
			relative: {
				">": {
					dir: "parentNode",
					first: !0
				},
				" ": {
					dir: "parentNode"
				},
				"+": {
					dir: "previousSibling",
					first: !0
				},
				"~": {
					dir: "previousSibling"
				}
			},
			preFilter: {
				ATTR: function(e) {
					return e[1] = e[1].replace(we, _e), e[3] = (e[3] || e[4] || e[5] || "").replace(we, _e), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
				},
				CHILD: function(e) {
					return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
				},
				PSEUDO: function(e) {
					var t, n = !e[6] && e[2];
					return fe.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && pe.test(n) && (t = k(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
				}
			},
			filter: {
				TAG: function(e) {
					var t = e.replace(we, _e).toLowerCase();
					return "*" === e ? function() {
						return !0
					} : function(e) {
						return e.nodeName && e.nodeName.toLowerCase() === t
					}
				},
				CLASS: function(e) {
					var t = U[e + " "];
					return t || (t = new RegExp("(^|" + ne + ")" + e + "(" + ne + "|$)")) && U(e, function(e) {
						return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
					})
				},
				ATTR: function(e, n, i) {
					return function(o) {
						var a = t.attr(o, e);
						return null == a ? "!=" === n : !n || (a += "", "=" === n ? a === i : "!=" === n ? a !== i : "^=" === n ? i && 0 === a.indexOf(i) : "*=" === n ? i && a.indexOf(i) > -1 : "$=" === n ? i && a.slice(-i.length) === i : "~=" === n ? (" " + a.replace(re, " ") + " ").indexOf(i) > -1 : "|=" === n && (a === i || a.slice(0, i.length + 1) === i + "-"))
					}
				},
				CHILD: function(e, t, n, i, o) {
					var a = "nth" !== e.slice(0, 3),
						s = "last" !== e.slice(-4),
						r = "of-type" === t;
					return 1 === i && 0 === o ? function(e) {
						return !!e.parentNode
					} : function(t, n, l) {
						var c, d, u, p, h, f, m = a !== s ? "nextSibling" : "previousSibling",
							g = t.parentNode,
							v = r && t.nodeName.toLowerCase(),
							b = !l && !r;
						if(g) {
							if(a) {
								for(; m;) {
									for(u = t; u = u[m];)
										if(r ? u.nodeName.toLowerCase() === v : 1 === u.nodeType) return !1;
									f = m = "only" === e && !f && "nextSibling"
								}
								return !0
							}
							if(f = [s ? g.firstChild : g.lastChild], s && b) {
								for(d = g[H] || (g[H] = {}), c = d[e] || [], h = c[0] === z && c[1], p = c[0] === z && c[2], u = h && g.childNodes[h]; u = ++h && u && u[m] || (p = h = 0) || f.pop();)
									if(1 === u.nodeType && ++p && u === t) {
										d[e] = [z, h, p];
										break
									}
							} else if(b && (c = (t[H] || (t[H] = {}))[e]) && c[0] === z) p = c[1];
							else
								for(;
									(u = ++h && u && u[m] || (p = h = 0) || f.pop()) && ((r ? u.nodeName.toLowerCase() !== v : 1 !== u.nodeType) || !++p || (b && ((u[H] || (u[H] = {}))[e] = [z, p]), u !== t)););
							return p -= o, p === i || p % i === 0 && p / i >= 0
						}
					}
				},
				PSEUDO: function(e, n) {
					var o, a = _.pseudos[e] || _.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
					return a[H] ? a(n) : a.length > 1 ? (o = [e, e, "", n], _.setFilters.hasOwnProperty(e.toLowerCase()) ? i(function(e, t) {
						for(var i, o = a(e, n), s = o.length; s--;) i = ee(e, o[s]), e[i] = !(t[i] = o[s])
					}) : function(e) {
						return a(e, 0, o)
					}) : a
				}
			},
			pseudos: {
				not: i(function(e) {
					var t = [],
						n = [],
						o = S(e.replace(le, "$1"));
					return o[H] ? i(function(e, t, n, i) {
						for(var a, s = o(e, null, i, []), r = e.length; r--;)(a = s[r]) && (e[r] = !(t[r] = a))
					}) : function(e, i, a) {
						return t[0] = e, o(t, null, a, n), t[0] = null, !n.pop()
					}
				}),
				has: i(function(e) {
					return function(n) {
						return t(e, n).length > 0
					}
				}),
				contains: i(function(e) {
					return e = e.replace(we, _e),
						function(t) {
							return(t.textContent || t.innerText || T(t)).indexOf(e) > -1
						}
				}),
				lang: i(function(e) {
					return he.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(we, _e).toLowerCase(),
						function(t) {
							var n;
							do
								if(n = N ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-");
							while((t = t.parentNode) && 1 === t.nodeType);
							return !1
						}
				}),
				target: function(t) {
					var n = e.location && e.location.hash;
					return n && n.slice(1) === t.id
				},
				root: function(e) {
					return e === M
				},
				focus: function(e) {
					return e === P.activeElement && (!P.hasFocus || P.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
				},
				enabled: function(e) {
					return e.disabled === !1
				},
				disabled: function(e) {
					return e.disabled === !0
				},
				checked: function(e) {
					var t = e.nodeName.toLowerCase();
					return "input" === t && !!e.checked || "option" === t && !!e.selected
				},
				selected: function(e) {
					return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
				},
				empty: function(e) {
					for(e = e.firstChild; e; e = e.nextSibling)
						if(e.nodeType < 6) return !1;
					return !0
				},
				parent: function(e) {
					return !_.pseudos.empty(e)
				},
				header: function(e) {
					return ge.test(e.nodeName)
				},
				input: function(e) {
					return me.test(e.nodeName)
				},
				button: function(e) {
					var t = e.nodeName.toLowerCase();
					return "input" === t && "button" === e.type || "button" === t
				},
				text: function(e) {
					var t;
					return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
				},
				first: c(function() {
					return [0]
				}),
				last: c(function(e, t) {
					return [t - 1]
				}),
				eq: c(function(e, t, n) {
					return [0 > n ? n + t : n]
				}),
				even: c(function(e, t) {
					for(var n = 0; t > n; n += 2) e.push(n);
					return e
				}),
				odd: c(function(e, t) {
					for(var n = 1; t > n; n += 2) e.push(n);
					return e
				}),
				lt: c(function(e, t, n) {
					for(var i = 0 > n ? n + t : n; --i >= 0;) e.push(i);
					return e
				}),
				gt: c(function(e, t, n) {
					for(var i = 0 > n ? n + t : n; ++i < t;) e.push(i);
					return e
				})
			}
		}, _.pseudos.nth = _.pseudos.eq;
		for(y in {
				radio: !0,
				checkbox: !0,
				file: !0,
				password: !0,
				image: !0
			}) _.pseudos[y] = r(y);
		for(y in {
				submit: !0,
				reset: !0
			}) _.pseudos[y] = l(y);
		return u.prototype = _.filters = _.pseudos, _.setFilters = new u, k = t.tokenize = function(e, n) {
			var i, o, a, s, r, l, c, d = W[e + " "];
			if(d) return n ? 0 : d.slice(0);
			for(r = e, l = [], c = _.preFilter; r;) {
				(!i || (o = ce.exec(r))) && (o && (r = r.slice(o[0].length) || r), l.push(a = [])), i = !1, (o = de.exec(r)) && (i = o.shift(), a.push({
					value: i,
					type: o[0].replace(le, " ")
				}), r = r.slice(i.length));
				for(s in _.filter) !(o = fe[s].exec(r)) || c[s] && !(o = c[s](o)) || (i = o.shift(), a.push({
					value: i,
					type: s,
					matches: o
				}), r = r.slice(i.length));
				if(!i) break
			}
			return n ? r.length : r ? t.error(e) : W(e, l).slice(0)
		}, S = t.compile = function(e, t) {
			var n, i = [],
				o = [],
				a = q[e + " "];
			if(!a) {
				for(t || (t = k(e)), n = t.length; n--;) a = b(t[n]), a[H] ? i.push(a) : o.push(a);
				a = q(e, x(o, i)), a.selector = e
			}
			return a
		}, $ = t.select = function(e, t, n, i) {
			var o, a, s, r, l, c = "function" == typeof e && e,
				u = !i && k(e = c.selector || e);
			if(n = n || [], 1 === u.length) {
				if(a = u[0] = u[0].slice(0), a.length > 2 && "ID" === (s = a[0]).type && w.getById && 9 === t.nodeType && N && _.relative[a[1].type]) {
					if(t = (_.find.ID(s.matches[0].replace(we, _e), t) || [])[0], !t) return n;
					c && (t = t.parentNode), e = e.slice(a.shift().value.length)
				}
				for(o = fe.needsContext.test(e) ? 0 : a.length; o-- && (s = a[o], !_.relative[r = s.type]);)
					if((l = _.find[r]) && (i = l(s.matches[0].replace(we, _e), xe.test(a[0].type) && d(t.parentNode) || t))) {
						if(a.splice(o, 1), e = i.length && p(a), !e) return Q.apply(n, i), n;
						break
					}
			}
			return(c || S(e, u))(i, t, !N, n, xe.test(e) && d(t.parentNode) || t), n
		}, w.sortStable = H.split("").sort(Y).join("") === H, w.detectDuplicates = !!I, O(), w.sortDetached = o(function(e) {
			return 1 & e.compareDocumentPosition(P.createElement("div"))
		}), o(function(e) {
			return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
		}) || a("type|href|height|width", function(e, t, n) {
			return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
		}), w.attributes && o(function(e) {
			return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
		}) || a("value", function(e, t, n) {
			return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
		}), o(function(e) {
			return null == e.getAttribute("disabled")
		}) || a(te, function(e, t, n) {
			var i;
			return n ? void 0 : e[t] === !0 ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
		}), t
	}(e);
	oe.find = ce, oe.expr = ce.selectors, oe.expr[":"] = oe.expr.pseudos, oe.unique = ce.uniqueSort, oe.text = ce.getText, oe.isXMLDoc = ce.isXML, oe.contains = ce.contains;
	var de = oe.expr.match.needsContext,
		ue = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
		pe = /^.[^:#\[\.,]*$/;
	oe.filter = function(e, t, n) {
		var i = t[0];
		return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === i.nodeType ? oe.find.matchesSelector(i, e) ? [i] : [] : oe.find.matches(e, oe.grep(t, function(e) {
			return 1 === e.nodeType
		}))
	}, oe.fn.extend({
		find: function(e) {
			var t, n = [],
				i = this,
				o = i.length;
			if("string" != typeof e) return this.pushStack(oe(e).filter(function() {
				for(t = 0; o > t; t++)
					if(oe.contains(i[t], this)) return !0
			}));
			for(t = 0; o > t; t++) oe.find(e, i[t], n);
			return n = this.pushStack(o > 1 ? oe.unique(n) : n), n.selector = this.selector ? this.selector + " " + e : e, n
		},
		filter: function(e) {
			return this.pushStack(i(this, e || [], !1))
		},
		not: function(e) {
			return this.pushStack(i(this, e || [], !0))
		},
		is: function(e) {
			return !!i(this, "string" == typeof e && de.test(e) ? oe(e) : e || [], !1).length
		}
	});
	var he, fe = e.document,
		me = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
		ge = oe.fn.init = function(e, t) {
			var n, i;
			if(!e) return this;
			if("string" == typeof e) {
				if(n = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : me.exec(e), !n || !n[1] && t) return !t || t.jquery ? (t || he).find(e) : this.constructor(t).find(e);
				if(n[1]) {
					if(t = t instanceof oe ? t[0] : t, oe.merge(this, oe.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : fe, !0)), ue.test(n[1]) && oe.isPlainObject(t))
						for(n in t) oe.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
					return this
				}
				if(i = fe.getElementById(n[2]), i && i.parentNode) {
					if(i.id !== n[2]) return he.find(e);
					this.length = 1, this[0] = i
				}
				return this.context = fe, this.selector = e, this
			}
			return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : oe.isFunction(e) ? "undefined" != typeof he.ready ? he.ready(e) : e(oe) : (void 0 !== e.selector && (this.selector = e.selector, this.context = e.context), oe.makeArray(e, this))
		};
	ge.prototype = oe.fn, he = oe(fe);
	var ve = /^(?:parents|prev(?:Until|All))/,
		be = {
			children: !0,
			contents: !0,
			next: !0,
			prev: !0
		};
	oe.extend({
		dir: function(e, t, n) {
			for(var i = [], o = e[t]; o && 9 !== o.nodeType && (void 0 === n || 1 !== o.nodeType || !oe(o).is(n));) 1 === o.nodeType && i.push(o), o = o[t];
			return i
		},
		sibling: function(e, t) {
			for(var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
			return n
		}
	}), oe.fn.extend({
		has: function(e) {
			var t, n = oe(e, this),
				i = n.length;
			return this.filter(function() {
				for(t = 0; i > t; t++)
					if(oe.contains(this, n[t])) return !0
			})
		},
		closest: function(e, t) {
			for(var n, i = 0, o = this.length, a = [], s = de.test(e) || "string" != typeof e ? oe(e, t || this.context) : 0; o > i; i++)
				for(n = this[i]; n && n !== t; n = n.parentNode)
					if(n.nodeType < 11 && (s ? s.index(n) > -1 : 1 === n.nodeType && oe.find.matchesSelector(n, e))) {
						a.push(n);
						break
					}
			return this.pushStack(a.length > 1 ? oe.unique(a) : a)
		},
		index: function(e) {
			return e ? "string" == typeof e ? oe.inArray(this[0], oe(e)) : oe.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
		},
		add: function(e, t) {
			return this.pushStack(oe.unique(oe.merge(this.get(), oe(e, t))))
		},
		addBack: function(e) {
			return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
		}
	}), oe.each({
		parent: function(e) {
			var t = e.parentNode;
			return t && 11 !== t.nodeType ? t : null
		},
		parents: function(e) {
			return oe.dir(e, "parentNode")
		},
		parentsUntil: function(e, t, n) {
			return oe.dir(e, "parentNode", n)
		},
		next: function(e) {
			return o(e, "nextSibling")
		},
		prev: function(e) {
			return o(e, "previousSibling")
		},
		nextAll: function(e) {
			return oe.dir(e, "nextSibling")
		},
		prevAll: function(e) {
			return oe.dir(e, "previousSibling")
		},
		nextUntil: function(e, t, n) {
			return oe.dir(e, "nextSibling", n)
		},
		prevUntil: function(e, t, n) {
			return oe.dir(e, "previousSibling", n)
		},
		siblings: function(e) {
			return oe.sibling((e.parentNode || {}).firstChild, e)
		},
		children: function(e) {
			return oe.sibling(e.firstChild)
		},
		contents: function(e) {
			return oe.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : oe.merge([], e.childNodes)
		}
	}, function(e, t) {
		oe.fn[e] = function(n, i) {
			var o = oe.map(this, t, n);
			return "Until" !== e.slice(-5) && (i = n), i && "string" == typeof i && (o = oe.filter(i, o)), this.length > 1 && (be[e] || (o = oe.unique(o)), ve.test(e) && (o = o.reverse())), this.pushStack(o)
		}
	});
	var xe = /\S+/g,
		ye = {};
	oe.Callbacks = function(e) {
		e = "string" == typeof e ? ye[e] || a(e) : oe.extend({}, e);
		var t, n, i, o, s, r, l = [],
			c = !e.once && [],
			d = function(a) {
				for(n = e.memory && a, i = !0, s = r || 0, r = 0, o = l.length, t = !0; l && o > s; s++)
					if(l[s].apply(a[0], a[1]) === !1 && e.stopOnFalse) {
						n = !1;
						break
					}
				t = !1, l && (c ? c.length && d(c.shift()) : n ? l = [] : u.disable())
			},
			u = {
				add: function() {
					if(l) {
						var i = l.length;
						! function a(t) {
							oe.each(t, function(t, n) {
								var i = oe.type(n);
								"function" === i ? e.unique && u.has(n) || l.push(n) : n && n.length && "string" !== i && a(n)
							})
						}(arguments), t ? o = l.length : n && (r = i, d(n))
					}
					return this
				},
				remove: function() {
					return l && oe.each(arguments, function(e, n) {
						for(var i;
							(i = oe.inArray(n, l, i)) > -1;) l.splice(i, 1), t && (o >= i && o--, s >= i && s--)
					}), this
				},
				has: function(e) {
					return e ? oe.inArray(e, l) > -1 : !(!l || !l.length)
				},
				empty: function() {
					return l = [], o = 0, this
				},
				disable: function() {
					return l = c = n = void 0, this
				},
				disabled: function() {
					return !l
				},
				lock: function() {
					return c = void 0, n || u.disable(), this
				},
				locked: function() {
					return !c
				},
				fireWith: function(e, n) {
					return !l || i && !c || (n = n || [], n = [e, n.slice ? n.slice() : n], t ? c.push(n) : d(n)), this
				},
				fire: function() {
					return u.fireWith(this, arguments), this
				},
				fired: function() {
					return !!i
				}
			};
		return u
	}, oe.extend({
		Deferred: function(e) {
			var t = [
					["resolve", "done", oe.Callbacks("once memory"), "resolved"],
					["reject", "fail", oe.Callbacks("once memory"), "rejected"],
					["notify", "progress", oe.Callbacks("memory")]
				],
				n = "pending",
				i = {
					state: function() {
						return n
					},
					always: function() {
						return o.done(arguments).fail(arguments), this
					},
					then: function() {
						var e = arguments;
						return oe.Deferred(function(n) {
							oe.each(t, function(t, a) {
								var s = oe.isFunction(e[t]) && e[t];
								o[a[1]](function() {
									var e = s && s.apply(this, arguments);
									e && oe.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[a[0] + "With"](this === i ? n.promise() : this, s ? [e] : arguments)
								})
							}), e = null
						}).promise()
					},
					promise: function(e) {
						return null != e ? oe.extend(e, i) : i
					}
				},
				o = {};
			return i.pipe = i.then, oe.each(t, function(e, a) {
				var s = a[2],
					r = a[3];
				i[a[1]] = s.add, r && s.add(function() {
					n = r
				}, t[1 ^ e][2].disable, t[2][2].lock), o[a[0]] = function() {
					return o[a[0] + "With"](this === o ? i : this, arguments), this
				}, o[a[0] + "With"] = s.fireWith
			}), i.promise(o), e && e.call(o, o), o
		},
		when: function(e) {
			var t, n, i, o = 0,
				a = X.call(arguments),
				s = a.length,
				r = 1 !== s || e && oe.isFunction(e.promise) ? s : 0,
				l = 1 === r ? e : oe.Deferred(),
				c = function(e, n, i) {
					return function(o) {
						n[e] = this, i[e] = arguments.length > 1 ? X.call(arguments) : o, i === t ? l.notifyWith(n, i) : --r || l.resolveWith(n, i)
					}
				};
			if(s > 1)
				for(t = new Array(s), n = new Array(s), i = new Array(s); s > o; o++) a[o] && oe.isFunction(a[o].promise) ? a[o].promise().done(c(o, i, a)).fail(l.reject).progress(c(o, n, t)) : --r;
			return r || l.resolveWith(i, a), l.promise()
		}
	});
	var we;
	oe.fn.ready = function(e) {
		return oe.ready.promise().done(e), this
	}, oe.extend({
		isReady: !1,
		readyWait: 1,
		holdReady: function(e) {
			e ? oe.readyWait++ : oe.ready(!0)
		},
		ready: function(e) {
			if(e === !0 ? !--oe.readyWait : !oe.isReady) {
				if(!fe.body) return setTimeout(oe.ready);
				oe.isReady = !0, e !== !0 && --oe.readyWait > 0 || (we.resolveWith(fe, [oe]), oe.fn.triggerHandler && (oe(fe).triggerHandler("ready"), oe(fe).off("ready")))
			}
		}
	}), oe.ready.promise = function(t) {
		if(!we)
			if(we = oe.Deferred(), "complete" === fe.readyState) setTimeout(oe.ready);
			else if(fe.addEventListener) fe.addEventListener("DOMContentLoaded", r, !1), e.addEventListener("load", r, !1);
		else {
			fe.attachEvent("onreadystatechange", r), e.attachEvent("onload", r);
			var n = !1;
			try {
				n = null == e.frameElement && fe.documentElement
			} catch(i) {}
			n && n.doScroll && ! function o() {
				if(!oe.isReady) {
					try {
						n.doScroll("left")
					} catch(e) {
						return setTimeout(o, 50)
					}
					s(), oe.ready()
				}
			}()
		}
		return we.promise(t)
	};
	var _e, Te = "undefined";
	for(_e in oe(ne)) break;
	ne.ownLast = "0" !== _e, ne.inlineBlockNeedsLayout = !1, oe(function() {
			var e, t, n, i;
			n = fe.getElementsByTagName("body")[0], n && n.style && (t = fe.createElement("div"), i = fe.createElement("div"), i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(i).appendChild(t), typeof t.style.zoom !== Te && (t.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", ne.inlineBlockNeedsLayout = e = 3 === t.offsetWidth, e && (n.style.zoom = 1)), n.removeChild(i))
		}),
		function() {
			var e = fe.createElement("div");
			if(null == ne.deleteExpando) {
				ne.deleteExpando = !0;
				try {
					delete e.test
				} catch(t) {
					ne.deleteExpando = !1
				}
			}
			e = null
		}(), oe.acceptData = function(e) {
			var t = oe.noData[(e.nodeName + " ").toLowerCase()],
				n = +e.nodeType || 1;
			return(1 === n || 9 === n) && (!t || t !== !0 && e.getAttribute("classid") === t)
		};
	var Ce = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		ke = /([A-Z])/g;
	oe.extend({
		cache: {},
		noData: {
			"applet ": !0,
			"embed ": !0,
			"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
		},
		hasData: function(e) {
			return e = e.nodeType ? oe.cache[e[oe.expando]] : e[oe.expando], !!e && !c(e)
		},
		data: function(e, t, n) {
			return d(e, t, n)
		},
		removeData: function(e, t) {
			return u(e, t)
		},
		_data: function(e, t, n) {
			return d(e, t, n, !0)
		},
		_removeData: function(e, t) {
			return u(e, t, !0)
		}
	}), oe.fn.extend({
		data: function(e, t) {
			var n, i, o, a = this[0],
				s = a && a.attributes;
			if(void 0 === e) {
				if(this.length && (o = oe.data(a), 1 === a.nodeType && !oe._data(a, "parsedAttrs"))) {
					for(n = s.length; n--;) s[n] && (i = s[n].name, 0 === i.indexOf("data-") && (i = oe.camelCase(i.slice(5)), l(a, i, o[i])));
					oe._data(a, "parsedAttrs", !0)
				}
				return o
			}
			return "object" == typeof e ? this.each(function() {
				oe.data(this, e)
			}) : arguments.length > 1 ? this.each(function() {
				oe.data(this, e, t)
			}) : a ? l(a, e, oe.data(a, e)) : void 0
		},
		removeData: function(e) {
			return this.each(function() {
				oe.removeData(this, e)
			})
		}
	}), oe.extend({
		queue: function(e, t, n) {
			var i;
			return e ? (t = (t || "fx") + "queue", i = oe._data(e, t), n && (!i || oe.isArray(n) ? i = oe._data(e, t, oe.makeArray(n)) : i.push(n)), i || []) : void 0
		},
		dequeue: function(e, t) {
			t = t || "fx";
			var n = oe.queue(e, t),
				i = n.length,
				o = n.shift(),
				a = oe._queueHooks(e, t),
				s = function() {
					oe.dequeue(e, t)
				};
			"inprogress" === o && (o = n.shift(), i--), o && ("fx" === t && n.unshift("inprogress"), delete a.stop, o.call(e, s, a)), !i && a && a.empty.fire()
		},
		_queueHooks: function(e, t) {
			var n = t + "queueHooks";
			return oe._data(e, n) || oe._data(e, n, {
				empty: oe.Callbacks("once memory").add(function() {
					oe._removeData(e, t + "queue"), oe._removeData(e, n)
				})
			})
		}
	}), oe.fn.extend({
		queue: function(e, t) {
			var n = 2;
			return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? oe.queue(this[0], e) : void 0 === t ? this : this.each(function() {
				var n = oe.queue(this, e, t);
				oe._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && oe.dequeue(this, e)
			})
		},
		dequeue: function(e) {
			return this.each(function() {
				oe.dequeue(this, e)
			})
		},
		clearQueue: function(e) {
			return this.queue(e || "fx", [])
		},
		promise: function(e, t) {
			var n, i = 1,
				o = oe.Deferred(),
				a = this,
				s = this.length,
				r = function() {
					--i || o.resolveWith(a, [a])
				};
			for("string" != typeof e && (t = e, e = void 0), e = e || "fx"; s--;) n = oe._data(a[s], e + "queueHooks"), n && n.empty && (i++, n.empty.add(r));
			return r(), o.promise(t)
		}
	});
	var Se = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
		$e = ["Top", "Right", "Bottom", "Left"],
		Ee = function(e, t) {
			return e = t || e, "none" === oe.css(e, "display") || !oe.contains(e.ownerDocument, e)
		},
		je = oe.access = function(e, t, n, i, o, a, s) {
			var r = 0,
				l = e.length,
				c = null == n;
			if("object" === oe.type(n)) {
				o = !0;
				for(r in n) oe.access(e, t, r, n[r], !0, a, s)
			} else if(void 0 !== i && (o = !0, oe.isFunction(i) || (s = !0), c && (s ? (t.call(e, i), t = null) : (c = t, t = function(e, t, n) {
					return c.call(oe(e), n)
				})), t))
				for(; l > r; r++) t(e[r], n, s ? i : i.call(e[r], r, t(e[r], n)));
			return o ? e : c ? t.call(e) : l ? t(e[0], n) : a
		},
		Ie = /^(?:checkbox|radio)$/i;
	! function() {
		var e = fe.createElement("input"),
			t = fe.createElement("div"),
			n = fe.createDocumentFragment();
		if(t.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", ne.leadingWhitespace = 3 === t.firstChild.nodeType, ne.tbody = !t.getElementsByTagName("tbody").length, ne.htmlSerialize = !!t.getElementsByTagName("link").length, ne.html5Clone = "<:nav></:nav>" !== fe.createElement("nav").cloneNode(!0).outerHTML, e.type = "checkbox", e.checked = !0, n.appendChild(e), ne.appendChecked = e.checked, t.innerHTML = "<textarea>x</textarea>", ne.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue, n.appendChild(t), t.innerHTML = "<input type='radio' checked='checked' name='t'/>", ne.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, ne.noCloneEvent = !0, t.attachEvent && (t.attachEvent("onclick", function() {
				ne.noCloneEvent = !1
			}), t.cloneNode(!0).click()), null == ne.deleteExpando) {
			ne.deleteExpando = !0;
			try {
				delete t.test
			} catch(i) {
				ne.deleteExpando = !1
			}
		}
	}(),
	function() {
		var t, n, i = fe.createElement("div");
		for(t in {
				submit: !0,
				change: !0,
				focusin: !0
			}) n = "on" + t, (ne[t + "Bubbles"] = n in e) || (i.setAttribute(n, "t"), ne[t + "Bubbles"] = i.attributes[n].expando === !1);
		i = null
	}();
	var Oe = /^(?:input|select|textarea)$/i,
		Pe = /^key/,
		Me = /^(?:mouse|pointer|contextmenu)|click/,
		Ne = /^(?:focusinfocus|focusoutblur)$/,
		Ae = /^([^.]*)(?:\.(.+)|)$/;
	oe.event = {
		global: {},
		add: function(e, t, n, i, o) {
			var a, s, r, l, c, d, u, p, h, f, m, g = oe._data(e);
			if(g) {
				for(n.handler && (l = n, n = l.handler, o = l.selector), n.guid || (n.guid = oe.guid++), (s = g.events) || (s = g.events = {}), (d = g.handle) || (d = g.handle = function(e) {
						return typeof oe === Te || e && oe.event.triggered === e.type ? void 0 : oe.event.dispatch.apply(d.elem, arguments)
					}, d.elem = e), t = (t || "").match(xe) || [""], r = t.length; r--;) a = Ae.exec(t[r]) || [], h = m = a[1], f = (a[2] || "").split(".").sort(), h && (c = oe.event.special[h] || {}, h = (o ? c.delegateType : c.bindType) || h, c = oe.event.special[h] || {}, u = oe.extend({
					type: h,
					origType: m,
					data: i,
					handler: n,
					guid: n.guid,
					selector: o,
					needsContext: o && oe.expr.match.needsContext.test(o),
					namespace: f.join(".")
				}, l), (p = s[h]) || (p = s[h] = [], p.delegateCount = 0, c.setup && c.setup.call(e, i, f, d) !== !1 || (e.addEventListener ? e.addEventListener(h, d, !1) : e.attachEvent && e.attachEvent("on" + h, d))), c.add && (c.add.call(e, u), u.handler.guid || (u.handler.guid = n.guid)), o ? p.splice(p.delegateCount++, 0, u) : p.push(u), oe.event.global[h] = !0);
				e = null
			}
		},
		remove: function(e, t, n, i, o) {
			var a, s, r, l, c, d, u, p, h, f, m, g = oe.hasData(e) && oe._data(e);
			if(g && (d = g.events)) {
				for(t = (t || "").match(xe) || [""], c = t.length; c--;)
					if(r = Ae.exec(t[c]) || [], h = m = r[1], f = (r[2] || "").split(".").sort(), h) {
						for(u = oe.event.special[h] || {}, h = (i ? u.delegateType : u.bindType) || h, p = d[h] || [], r = r[2] && new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = a = p.length; a--;) s = p[a], !o && m !== s.origType || n && n.guid !== s.guid || r && !r.test(s.namespace) || i && i !== s.selector && ("**" !== i || !s.selector) || (p.splice(a, 1), s.selector && p.delegateCount--, u.remove && u.remove.call(e, s));
						l && !p.length && (u.teardown && u.teardown.call(e, f, g.handle) !== !1 || oe.removeEvent(e, h, g.handle), delete d[h])
					} else
						for(h in d) oe.event.remove(e, h + t[c], n, i, !0);
				oe.isEmptyObject(d) && (delete g.handle, oe._removeData(e, "events"))
			}
		},
		trigger: function(t, n, i, o) {
			var a, s, r, l, c, d, u, p = [i || fe],
				h = te.call(t, "type") ? t.type : t,
				f = te.call(t, "namespace") ? t.namespace.split(".") : [];
			if(r = d = i = i || fe, 3 !== i.nodeType && 8 !== i.nodeType && !Ne.test(h + oe.event.triggered) && (h.indexOf(".") >= 0 && (f = h.split("."), h = f.shift(), f.sort()), s = h.indexOf(":") < 0 && "on" + h, t = t[oe.expando] ? t : new oe.Event(h, "object" == typeof t && t), t.isTrigger = o ? 2 : 3, t.namespace = f.join("."), t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = i), n = null == n ? [t] : oe.makeArray(n, [t]), c = oe.event.special[h] || {}, o || !c.trigger || c.trigger.apply(i, n) !== !1)) {
				if(!o && !c.noBubble && !oe.isWindow(i)) {
					for(l = c.delegateType || h, Ne.test(l + h) || (r = r.parentNode); r; r = r.parentNode) p.push(r), d = r;
					d === (i.ownerDocument || fe) && p.push(d.defaultView || d.parentWindow || e)
				}
				for(u = 0;
					(r = p[u++]) && !t.isPropagationStopped();) t.type = u > 1 ? l : c.bindType || h, a = (oe._data(r, "events") || {})[t.type] && oe._data(r, "handle"), a && a.apply(r, n), a = s && r[s], a && a.apply && oe.acceptData(r) && (t.result = a.apply(r, n), t.result === !1 && t.preventDefault());
				if(t.type = h, !o && !t.isDefaultPrevented() && (!c._default || c._default.apply(p.pop(), n) === !1) && oe.acceptData(i) && s && i[h] && !oe.isWindow(i)) {
					d = i[s], d && (i[s] = null), oe.event.triggered = h;
					try {
						i[h]()
					} catch(m) {}
					oe.event.triggered = void 0, d && (i[s] = d)
				}
				return t.result
			}
		},
		dispatch: function(e) {
			e = oe.event.fix(e);
			var t, n, i, o, a, s = [],
				r = X.call(arguments),
				l = (oe._data(this, "events") || {})[e.type] || [],
				c = oe.event.special[e.type] || {};
			if(r[0] = e, e.delegateTarget = this, !c.preDispatch || c.preDispatch.call(this, e) !== !1) {
				for(s = oe.event.handlers.call(this, e, l), t = 0;
					(o = s[t++]) && !e.isPropagationStopped();)
					for(e.currentTarget = o.elem, a = 0;
						(i = o.handlers[a++]) && !e.isImmediatePropagationStopped();)(!e.namespace_re || e.namespace_re.test(i.namespace)) && (e.handleObj = i, e.data = i.data, n = ((oe.event.special[i.origType] || {}).handle || i.handler).apply(o.elem, r), void 0 !== n && (e.result = n) === !1 && (e.preventDefault(), e.stopPropagation()));
				return c.postDispatch && c.postDispatch.call(this, e), e.result
			}
		},
		handlers: function(e, t) {
			var n, i, o, a, s = [],
				r = t.delegateCount,
				l = e.target;
			if(r && l.nodeType && (!e.button || "click" !== e.type))
				for(; l != this; l = l.parentNode || this)
					if(1 === l.nodeType && (l.disabled !== !0 || "click" !== e.type)) {
						for(o = [], a = 0; r > a; a++) i = t[a], n = i.selector + " ", void 0 === o[n] && (o[n] = i.needsContext ? oe(n, this).index(l) >= 0 : oe.find(n, this, null, [l]).length), o[n] && o.push(i);
						o.length && s.push({
							elem: l,
							handlers: o
						})
					}
			return r < t.length && s.push({
				elem: this,
				handlers: t.slice(r)
			}), s
		},
		fix: function(e) {
			if(e[oe.expando]) return e;
			var t, n, i, o = e.type,
				a = e,
				s = this.fixHooks[o];
			for(s || (this.fixHooks[o] = s = Me.test(o) ? this.mouseHooks : Pe.test(o) ? this.keyHooks : {}), i = s.props ? this.props.concat(s.props) : this.props, e = new oe.Event(a), t = i.length; t--;) n = i[t], e[n] = a[n];
			return e.target || (e.target = a.srcElement || fe), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, s.filter ? s.filter(e, a) : e
		},
		props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
		fixHooks: {},
		keyHooks: {
			props: "char charCode key keyCode".split(" "),
			filter: function(e, t) {
				return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
			}
		},
		mouseHooks: {
			props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
			filter: function(e, t) {
				var n, i, o, a = t.button,
					s = t.fromElement;
				return null == e.pageX && null != t.clientX && (i = e.target.ownerDocument || fe, o = i.documentElement, n = i.body, e.pageX = t.clientX + (o && o.scrollLeft || n && n.scrollLeft || 0) - (o && o.clientLeft || n && n.clientLeft || 0), e.pageY = t.clientY + (o && o.scrollTop || n && n.scrollTop || 0) - (o && o.clientTop || n && n.clientTop || 0)), !e.relatedTarget && s && (e.relatedTarget = s === e.target ? t.toElement : s), e.which || void 0 === a || (e.which = 1 & a ? 1 : 2 & a ? 3 : 4 & a ? 2 : 0), e
			}
		},
		special: {
			load: {
				noBubble: !0
			},
			focus: {
				trigger: function() {
					if(this !== f() && this.focus) try {
						return this.focus(), !1
					} catch(e) {}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					return this === f() && this.blur ? (this.blur(), !1) : void 0
				},
				delegateType: "focusout"
			},
			click: {
				trigger: function() {
					return oe.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
				},
				_default: function(e) {
					return oe.nodeName(e.target, "a")
				}
			},
			beforeunload: {
				postDispatch: function(e) {
					void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
				}
			}
		},
		simulate: function(e, t, n, i) {
			var o = oe.extend(new oe.Event, n, {
				type: e,
				isSimulated: !0,
				originalEvent: {}
			});
			i ? oe.event.trigger(o, null, t) : oe.event.dispatch.call(t, o), o.isDefaultPrevented() && n.preventDefault()
		}
	}, oe.removeEvent = fe.removeEventListener ? function(e, t, n) {
		e.removeEventListener && e.removeEventListener(t, n, !1)
	} : function(e, t, n) {
		var i = "on" + t;
		e.detachEvent && (typeof e[i] === Te && (e[i] = null), e.detachEvent(i, n))
	}, oe.Event = function(e, t) {
		return this instanceof oe.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && e.returnValue === !1 ? p : h) : this.type = e, t && oe.extend(this, t), this.timeStamp = e && e.timeStamp || oe.now(), void(this[oe.expando] = !0)) : new oe.Event(e, t)
	}, oe.Event.prototype = {
		isDefaultPrevented: h,
		isPropagationStopped: h,
		isImmediatePropagationStopped: h,
		preventDefault: function() {
			var e = this.originalEvent;
			this.isDefaultPrevented = p, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
		},
		stopPropagation: function() {
			var e = this.originalEvent;
			this.isPropagationStopped = p, e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0)
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;
			this.isImmediatePropagationStopped = p, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation()
		}
	}, oe.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function(e, t) {
		oe.event.special[e] = {
			delegateType: t,
			bindType: t,
			handle: function(e) {
				var n, i = this,
					o = e.relatedTarget,
					a = e.handleObj;
				return(!o || o !== i && !oe.contains(i, o)) && (e.type = a.origType, n = a.handler.apply(this, arguments), e.type = t), n
			}
		}
	}), ne.submitBubbles || (oe.event.special.submit = {
		setup: function() {
			return !oe.nodeName(this, "form") && void oe.event.add(this, "click._submit keypress._submit", function(e) {
				var t = e.target,
					n = oe.nodeName(t, "input") || oe.nodeName(t, "button") ? t.form : void 0;
				n && !oe._data(n, "submitBubbles") && (oe.event.add(n, "submit._submit", function(e) {
					e._submit_bubble = !0
				}), oe._data(n, "submitBubbles", !0))
			})
		},
		postDispatch: function(e) {
			e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && oe.event.simulate("submit", this.parentNode, e, !0))
		},
		teardown: function() {
			return !oe.nodeName(this, "form") && void oe.event.remove(this, "._submit")
		}
	}), ne.changeBubbles || (oe.event.special.change = {
		setup: function() {
			return Oe.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (oe.event.add(this, "propertychange._change", function(e) {
				"checked" === e.originalEvent.propertyName && (this._just_changed = !0)
			}), oe.event.add(this, "click._change", function(e) {
				this._just_changed && !e.isTrigger && (this._just_changed = !1), oe.event.simulate("change", this, e, !0)
			})), !1) : void oe.event.add(this, "beforeactivate._change", function(e) {
				var t = e.target;
				Oe.test(t.nodeName) && !oe._data(t, "changeBubbles") && (oe.event.add(t, "change._change", function(e) {
					!this.parentNode || e.isSimulated || e.isTrigger || oe.event.simulate("change", this.parentNode, e, !0)
				}), oe._data(t, "changeBubbles", !0))
			})
		},
		handle: function(e) {
			var t = e.target;
			return this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type ? e.handleObj.handler.apply(this, arguments) : void 0
		},
		teardown: function() {
			return oe.event.remove(this, "._change"), !Oe.test(this.nodeName)
		}
	}), ne.focusinBubbles || oe.each({
		focus: "focusin",
		blur: "focusout"
	}, function(e, t) {
		var n = function(e) {
			oe.event.simulate(t, e.target, oe.event.fix(e), !0)
		};
		oe.event.special[t] = {
			setup: function() {
				var i = this.ownerDocument || this,
					o = oe._data(i, t);
				o || i.addEventListener(e, n, !0), oe._data(i, t, (o || 0) + 1)
			},
			teardown: function() {
				var i = this.ownerDocument || this,
					o = oe._data(i, t) - 1;
				o ? oe._data(i, t, o) : (i.removeEventListener(e, n, !0), oe._removeData(i, t))
			}
		}
	}), oe.fn.extend({
		on: function(e, t, n, i, o) {
			var a, s;
			if("object" == typeof e) {
				"string" != typeof t && (n = n || t, t = void 0);
				for(a in e) this.on(a, t, n, e[a], o);
				return this
			}
			if(null == n && null == i ? (i = t, n = t = void 0) : null == i && ("string" == typeof t ? (i = n, n = void 0) : (i = n, n = t, t = void 0)), i === !1) i = h;
			else if(!i) return this;
			return 1 === o && (s = i, i = function(e) {
				return oe().off(e), s.apply(this, arguments)
			}, i.guid = s.guid || (s.guid = oe.guid++)), this.each(function() {
				oe.event.add(this, e, i, n, t)
			})
		},
		one: function(e, t, n, i) {
			return this.on(e, t, n, i, 1)
		},
		off: function(e, t, n) {
			var i, o;
			if(e && e.preventDefault && e.handleObj) return i = e.handleObj, oe(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
			if("object" == typeof e) {
				for(o in e) this.off(o, t, e[o]);
				return this
			}
			return(t === !1 || "function" == typeof t) && (n = t, t = void 0), n === !1 && (n = h), this.each(function() {
				oe.event.remove(this, e, n, t)
			})
		},
		trigger: function(e, t) {
			return this.each(function() {
				oe.event.trigger(e, t, this)
			})
		},
		triggerHandler: function(e, t) {
			var n = this[0];
			return n ? oe.event.trigger(e, t, n, !0) : void 0
		}
	});
	var Le = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
		De = / jQuery\d+="(?:null|\d+)"/g,
		Be = new RegExp("<(?:" + Le + ")[\\s/>]", "i"),
		He = /^\s+/,
		Re = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
		ze = /<([\w:]+)/,
		Fe = /<tbody/i,
		Ue = /<|&#?\w+;/,
		We = /<(?:script|style|link)/i,
		qe = /checked\s*(?:[^=]|=\s*.checked.)/i,
		Ye = /^$|\/(?:java|ecma)script/i,
		Je = /^true\/(.*)/,
		Ge = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
		Xe = {
			option: [1, "<select multiple='multiple'>", "</select>"],
			legend: [1, "<fieldset>", "</fieldset>"],
			area: [1, "<map>", "</map>"],
			param: [1, "<object>", "</object>"],
			thead: [1, "<table>", "</table>"],
			tr: [2, "<table><tbody>", "</tbody></table>"],
			col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
			td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
			_default: ne.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
		},
		Ve = m(fe),
		Ze = Ve.appendChild(fe.createElement("div"));
	Xe.optgroup = Xe.option, Xe.tbody = Xe.tfoot = Xe.colgroup = Xe.caption = Xe.thead, Xe.th = Xe.td, oe.extend({
		clone: function(e, t, n) {
			var i, o, a, s, r, l = oe.contains(e.ownerDocument, e);
			if(ne.html5Clone || oe.isXMLDoc(e) || !Be.test("<" + e.nodeName + ">") ? a = e.cloneNode(!0) : (Ze.innerHTML = e.outerHTML, Ze.removeChild(a = Ze.firstChild)), !(ne.noCloneEvent && ne.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || oe.isXMLDoc(e)))
				for(i = g(a), r = g(e), s = 0; null != (o = r[s]); ++s) i[s] && T(o, i[s]);
			if(t)
				if(n)
					for(r = r || g(e), i = i || g(a), s = 0; null != (o = r[s]); s++) _(o, i[s]);
				else _(e, a);
			return i = g(a, "script"), i.length > 0 && w(i, !l && g(e, "script")), i = r = o = null, a
		},
		buildFragment: function(e, t, n, i) {
			for(var o, a, s, r, l, c, d, u = e.length, p = m(t), h = [], f = 0; u > f; f++)
				if(a = e[f], a || 0 === a)
					if("object" === oe.type(a)) oe.merge(h, a.nodeType ? [a] : a);
					else if(Ue.test(a)) {
				for(r = r || p.appendChild(t.createElement("div")), l = (ze.exec(a) || ["", ""])[1].toLowerCase(), d = Xe[l] || Xe._default, r.innerHTML = d[1] + a.replace(Re, "<$1></$2>") + d[2], o = d[0]; o--;) r = r.lastChild;
				if(!ne.leadingWhitespace && He.test(a) && h.push(t.createTextNode(He.exec(a)[0])), !ne.tbody)
					for(a = "table" !== l || Fe.test(a) ? "<table>" !== d[1] || Fe.test(a) ? 0 : r : r.firstChild, o = a && a.childNodes.length; o--;) oe.nodeName(c = a.childNodes[o], "tbody") && !c.childNodes.length && a.removeChild(c);
				for(oe.merge(h, r.childNodes), r.textContent = ""; r.firstChild;) r.removeChild(r.firstChild);
				r = p.lastChild
			} else h.push(t.createTextNode(a));
			for(r && p.removeChild(r), ne.appendChecked || oe.grep(g(h, "input"), v), f = 0; a = h[f++];)
				if((!i || -1 === oe.inArray(a, i)) && (s = oe.contains(a.ownerDocument, a), r = g(p.appendChild(a), "script"), s && w(r), n))
					for(o = 0; a = r[o++];) Ye.test(a.type || "") && n.push(a);
			return r = null, p
		},
		cleanData: function(e, t) {
			for(var n, i, o, a, s = 0, r = oe.expando, l = oe.cache, c = ne.deleteExpando, d = oe.event.special; null != (n = e[s]); s++)
				if((t || oe.acceptData(n)) && (o = n[r], a = o && l[o])) {
					if(a.events)
						for(i in a.events) d[i] ? oe.event.remove(n, i) : oe.removeEvent(n, i, a.handle);
					l[o] && (delete l[o], c ? delete n[r] : typeof n.removeAttribute !== Te ? n.removeAttribute(r) : n[r] = null, G.push(o))
				}
		}
	}), oe.fn.extend({
		text: function(e) {
			return je(this, function(e) {
				return void 0 === e ? oe.text(this) : this.empty().append((this[0] && this[0].ownerDocument || fe).createTextNode(e))
			}, null, e, arguments.length)
		},
		append: function() {
			return this.domManip(arguments, function(e) {
				if(1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
					var t = b(this, e);
					t.appendChild(e)
				}
			})
		},
		prepend: function() {
			return this.domManip(arguments, function(e) {
				if(1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
					var t = b(this, e);
					t.insertBefore(e, t.firstChild)
				}
			})
		},
		before: function() {
			return this.domManip(arguments, function(e) {
				this.parentNode && this.parentNode.insertBefore(e, this)
			})
		},
		after: function() {
			return this.domManip(arguments, function(e) {
				this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
			})
		},
		remove: function(e, t) {
			for(var n, i = e ? oe.filter(e, this) : this, o = 0; null != (n = i[o]); o++) t || 1 !== n.nodeType || oe.cleanData(g(n)), n.parentNode && (t && oe.contains(n.ownerDocument, n) && w(g(n, "script")), n.parentNode.removeChild(n));
			return this
		},
		empty: function() {
			for(var e, t = 0; null != (e = this[t]); t++) {
				for(1 === e.nodeType && oe.cleanData(g(e, !1)); e.firstChild;) e.removeChild(e.firstChild);
				e.options && oe.nodeName(e, "select") && (e.options.length = 0)
			}
			return this
		},
		clone: function(e, t) {
			return e = null != e && e, t = null == t ? e : t, this.map(function() {
				return oe.clone(this, e, t)
			})
		},
		html: function(e) {
			return je(this, function(e) {
				var t = this[0] || {},
					n = 0,
					i = this.length;
				if(void 0 === e) return 1 === t.nodeType ? t.innerHTML.replace(De, "") : void 0;
				if(!("string" != typeof e || We.test(e) || !ne.htmlSerialize && Be.test(e) || !ne.leadingWhitespace && He.test(e) || Xe[(ze.exec(e) || ["", ""])[1].toLowerCase()])) {
					e = e.replace(Re, "<$1></$2>");
					try {
						for(; i > n; n++) t = this[n] || {}, 1 === t.nodeType && (oe.cleanData(g(t, !1)), t.innerHTML = e);
						t = 0
					} catch(o) {}
				}
				t && this.empty().append(e)
			}, null, e, arguments.length)
		},
		replaceWith: function() {
			var e = arguments[0];
			return this.domManip(arguments, function(t) {
				e = this.parentNode, oe.cleanData(g(this)), e && e.replaceChild(t, this)
			}), e && (e.length || e.nodeType) ? this : this.remove()
		},
		detach: function(e) {
			return this.remove(e, !0)
		},
		domManip: function(e, t) {
			e = V.apply([], e);
			var n, i, o, a, s, r, l = 0,
				c = this.length,
				d = this,
				u = c - 1,
				p = e[0],
				h = oe.isFunction(p);
			if(h || c > 1 && "string" == typeof p && !ne.checkClone && qe.test(p)) return this.each(function(n) {
				var i = d.eq(n);
				h && (e[0] = p.call(this, n, i.html())), i.domManip(e, t)
			});
			if(c && (r = oe.buildFragment(e, this[0].ownerDocument, !1, this), n = r.firstChild, 1 === r.childNodes.length && (r = n), n)) {
				for(a = oe.map(g(r, "script"), x), o = a.length; c > l; l++) i = r, l !== u && (i = oe.clone(i, !0, !0), o && oe.merge(a, g(i, "script"))), t.call(this[l], i, l);
				if(o)
					for(s = a[a.length - 1].ownerDocument, oe.map(a, y), l = 0; o > l; l++) i = a[l], Ye.test(i.type || "") && !oe._data(i, "globalEval") && oe.contains(s, i) && (i.src ? oe._evalUrl && oe._evalUrl(i.src) : oe.globalEval((i.text || i.textContent || i.innerHTML || "").replace(Ge, "")));
				r = n = null
			}
			return this
		}
	}), oe.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function(e, t) {
		oe.fn[e] = function(e) {
			for(var n, i = 0, o = [], a = oe(e), s = a.length - 1; s >= i; i++) n = i === s ? this : this.clone(!0), oe(a[i])[t](n), Z.apply(o, n.get());
			return this.pushStack(o)
		}
	});
	var Qe, Ke = {};
	! function() {
		var e;
		ne.shrinkWrapBlocks = function() {
			if(null != e) return e;
			e = !1;
			var t, n, i;
			return n = fe.getElementsByTagName("body")[0], n && n.style ? (t = fe.createElement("div"), i = fe.createElement("div"), i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(i).appendChild(t), typeof t.style.zoom !== Te && (t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", t.appendChild(fe.createElement("div")).style.width = "5px", e = 3 !== t.offsetWidth), n.removeChild(i), e) : void 0
		}
	}();
	var et, tt, nt = /^margin/,
		it = new RegExp("^(" + Se + ")(?!px)[a-z%]+$", "i"),
		ot = /^(top|right|bottom|left)$/;
	e.getComputedStyle ? (et = function(t) {
		return t.ownerDocument.defaultView.opener ? t.ownerDocument.defaultView.getComputedStyle(t, null) : e.getComputedStyle(t, null)
	}, tt = function(e, t, n) {
		var i, o, a, s, r = e.style;
		return n = n || et(e), s = n ? n.getPropertyValue(t) || n[t] : void 0, n && ("" !== s || oe.contains(e.ownerDocument, e) || (s = oe.style(e, t)), it.test(s) && nt.test(t) && (i = r.width, o = r.minWidth, a = r.maxWidth, r.minWidth = r.maxWidth = r.width = s, s = n.width, r.width = i, r.minWidth = o, r.maxWidth = a)), void 0 === s ? s : s + ""
	}) : fe.documentElement.currentStyle && (et = function(e) {
		return e.currentStyle
	}, tt = function(e, t, n) {
		var i, o, a, s, r = e.style;
		return n = n || et(e), s = n ? n[t] : void 0, null == s && r && r[t] && (s = r[t]), it.test(s) && !ot.test(t) && (i = r.left, o = e.runtimeStyle, a = o && o.left, a && (o.left = e.currentStyle.left), r.left = "fontSize" === t ? "1em" : s, s = r.pixelLeft + "px", r.left = i, a && (o.left = a)), void 0 === s ? s : s + "" || "auto"
	}), ! function() {
		function t() {
			var t, n, i, o;
			n = fe.getElementsByTagName("body")[0], n && n.style && (t = fe.createElement("div"), i = fe.createElement("div"), i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(i).appendChild(t), t.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", a = s = !1, l = !0, e.getComputedStyle && (a = "1%" !== (e.getComputedStyle(t, null) || {}).top, s = "4px" === (e.getComputedStyle(t, null) || {
				width: "4px"
			}).width, o = t.appendChild(fe.createElement("div")), o.style.cssText = t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", o.style.marginRight = o.style.width = "0", t.style.width = "1px", l = !parseFloat((e.getComputedStyle(o, null) || {}).marginRight), t.removeChild(o)), t.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", o = t.getElementsByTagName("td"), o[0].style.cssText = "margin:0;border:0;padding:0;display:none", r = 0 === o[0].offsetHeight, r && (o[0].style.display = "", o[1].style.display = "none", r = 0 === o[0].offsetHeight), n.removeChild(i))
		}
		var n, i, o, a, s, r, l;
		n = fe.createElement("div"), n.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", o = n.getElementsByTagName("a")[0], (i = o && o.style) && (i.cssText = "float:left;opacity:.5", ne.opacity = "0.5" === i.opacity, ne.cssFloat = !!i.cssFloat, n.style.backgroundClip = "content-box", n.cloneNode(!0).style.backgroundClip = "", ne.clearCloneStyle = "content-box" === n.style.backgroundClip, ne.boxSizing = "" === i.boxSizing || "" === i.MozBoxSizing || "" === i.WebkitBoxSizing, oe.extend(ne, {
			reliableHiddenOffsets: function() {
				return null == r && t(), r
			},
			boxSizingReliable: function() {
				return null == s && t(), s
			},
			pixelPosition: function() {
				return null == a && t(), a
			},
			reliableMarginRight: function() {
				return null == l && t(), l
			}
		}))
	}(), oe.swap = function(e, t, n, i) {
		var o, a, s = {};
		for(a in t) s[a] = e.style[a], e.style[a] = t[a];
		o = n.apply(e, i || []);
		for(a in t) e.style[a] = s[a];
		return o
	};
	var at = /alpha\([^)]*\)/i,
		st = /opacity\s*=\s*([^)]*)/,
		rt = /^(none|table(?!-c[ea]).+)/,
		lt = new RegExp("^(" + Se + ")(.*)$", "i"),
		ct = new RegExp("^([+-])=(" + Se + ")", "i"),
		dt = {
			position: "absolute",
			visibility: "hidden",
			display: "block"
		},
		ut = {
			letterSpacing: "0",
			fontWeight: "400"
		},
		pt = ["Webkit", "O", "Moz", "ms"];
	oe.extend({
		cssHooks: {
			opacity: {
				get: function(e, t) {
					if(t) {
						var n = tt(e, "opacity");
						return "" === n ? "1" : n
					}
				}
			}
		},
		cssNumber: {
			columnCount: !0,
			fillOpacity: !0,
			flexGrow: !0,
			flexShrink: !0,
			fontWeight: !0,
			lineHeight: !0,
			opacity: !0,
			order: !0,
			orphans: !0,
			widows: !0,
			zIndex: !0,
			zoom: !0
		},
		cssProps: {
			"float": ne.cssFloat ? "cssFloat" : "styleFloat"
		},
		style: function(e, t, n, i) {
			if(e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
				var o, a, s, r = oe.camelCase(t),
					l = e.style;
				if(t = oe.cssProps[r] || (oe.cssProps[r] = $(l, r)), s = oe.cssHooks[t] || oe.cssHooks[r], void 0 === n) return s && "get" in s && void 0 !== (o = s.get(e, !1, i)) ? o : l[t];
				if(a = typeof n, "string" === a && (o = ct.exec(n)) && (n = (o[1] + 1) * o[2] + parseFloat(oe.css(e, t)), a = "number"), null != n && n === n && ("number" !== a || oe.cssNumber[r] || (n += "px"), ne.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), !(s && "set" in s && void 0 === (n = s.set(e, n, i))))) try {
					l[t] = n
				} catch(c) {}
			}
		},
		css: function(e, t, n, i) {
			var o, a, s, r = oe.camelCase(t);
			return t = oe.cssProps[r] || (oe.cssProps[r] = $(e.style, r)), s = oe.cssHooks[t] || oe.cssHooks[r], s && "get" in s && (a = s.get(e, !0, n)), void 0 === a && (a = tt(e, t, i)), "normal" === a && t in ut && (a = ut[t]), "" === n || n ? (o = parseFloat(a), n === !0 || oe.isNumeric(o) ? o || 0 : a) : a
		}
	}), oe.each(["height", "width"], function(e, t) {
		oe.cssHooks[t] = {
			get: function(e, n, i) {
				return n ? rt.test(oe.css(e, "display")) && 0 === e.offsetWidth ? oe.swap(e, dt, function() {
					return O(e, t, i)
				}) : O(e, t, i) : void 0
			},
			set: function(e, n, i) {
				var o = i && et(e);
				return j(e, n, i ? I(e, t, i, ne.boxSizing && "border-box" === oe.css(e, "boxSizing", !1, o), o) : 0)
			}
		}
	}), ne.opacity || (oe.cssHooks.opacity = {
		get: function(e, t) {
			return st.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
		},
		set: function(e, t) {
			var n = e.style,
				i = e.currentStyle,
				o = oe.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
				a = i && i.filter || n.filter || "";
			n.zoom = 1, (t >= 1 || "" === t) && "" === oe.trim(a.replace(at, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || i && !i.filter) || (n.filter = at.test(a) ? a.replace(at, o) : a + " " + o)
		}
	}), oe.cssHooks.marginRight = S(ne.reliableMarginRight, function(e, t) {
		return t ? oe.swap(e, {
			display: "inline-block"
		}, tt, [e, "marginRight"]) : void 0
	}), oe.each({
		margin: "",
		padding: "",
		border: "Width"
	}, function(e, t) {
		oe.cssHooks[e + t] = {
			expand: function(n) {
				for(var i = 0, o = {}, a = "string" == typeof n ? n.split(" ") : [n]; 4 > i; i++) o[e + $e[i] + t] = a[i] || a[i - 2] || a[0];
				return o
			}
		}, nt.test(e) || (oe.cssHooks[e + t].set = j)
	}), oe.fn.extend({
		css: function(e, t) {
			return je(this, function(e, t, n) {
				var i, o, a = {},
					s = 0;
				if(oe.isArray(t)) {
					for(i = et(e), o = t.length; o > s; s++) a[t[s]] = oe.css(e, t[s], !1, i);
					return a
				}
				return void 0 !== n ? oe.style(e, t, n) : oe.css(e, t)
			}, e, t, arguments.length > 1)
		},
		show: function() {
			return E(this, !0)
		},
		hide: function() {
			return E(this)
		},
		toggle: function(e) {
			return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
				Ee(this) ? oe(this).show() : oe(this).hide()
			})
		}
	}), oe.Tween = P, P.prototype = {
		constructor: P,
		init: function(e, t, n, i, o, a) {
			this.elem = e, this.prop = n, this.easing = o || "swing", this.options = t, this.start = this.now = this.cur(), this.end = i, this.unit = a || (oe.cssNumber[n] ? "" : "px")
		},
		cur: function() {
			var e = P.propHooks[this.prop];
			return e && e.get ? e.get(this) : P.propHooks._default.get(this)
		},
		run: function(e) {
			var t, n = P.propHooks[this.prop];
			return this.options.duration ? this.pos = t = oe.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : P.propHooks._default.set(this), this
		}
	}, P.prototype.init.prototype = P.prototype, P.propHooks = {
		_default: {
			get: function(e) {
				var t;
				return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = oe.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop]
			},
			set: function(e) {
				oe.fx.step[e.prop] ? oe.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[oe.cssProps[e.prop]] || oe.cssHooks[e.prop]) ? oe.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
			}
		}
	}, P.propHooks.scrollTop = P.propHooks.scrollLeft = {
		set: function(e) {
			e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
		}
	}, oe.easing = {
		linear: function(e) {
			return e
		},
		swing: function(e) {
			return .5 - Math.cos(e * Math.PI) / 2
		}
	}, oe.fx = P.prototype.init, oe.fx.step = {};
	var ht, ft, mt = /^(?:toggle|show|hide)$/,
		gt = new RegExp("^(?:([+-])=|)(" + Se + ")([a-z%]*)$", "i"),
		vt = /queueHooks$/,
		bt = [L],
		xt = {
			"*": [function(e, t) {
				var n = this.createTween(e, t),
					i = n.cur(),
					o = gt.exec(t),
					a = o && o[3] || (oe.cssNumber[e] ? "" : "px"),
					s = (oe.cssNumber[e] || "px" !== a && +i) && gt.exec(oe.css(n.elem, e)),
					r = 1,
					l = 20;
				if(s && s[3] !== a) {
					a = a || s[3], o = o || [], s = +i || 1;
					do r = r || ".5", s /= r, oe.style(n.elem, e, s + a); while (r !== (r = n.cur() / i) && 1 !== r && --l)
				}
				return o && (s = n.start = +s || +i || 0, n.unit = a, n.end = o[1] ? s + (o[1] + 1) * o[2] : +o[2]), n
			}]
		};
	oe.Animation = oe.extend(B, {
			tweener: function(e, t) {
				oe.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
				for(var n, i = 0, o = e.length; o > i; i++) n = e[i], xt[n] = xt[n] || [], xt[n].unshift(t)
			},
			prefilter: function(e, t) {
				t ? bt.unshift(e) : bt.push(e)
			}
		}), oe.speed = function(e, t, n) {
			var i = e && "object" == typeof e ? oe.extend({}, e) : {
				complete: n || !n && t || oe.isFunction(e) && e,
				duration: e,
				easing: n && t || t && !oe.isFunction(t) && t
			};
			return i.duration = oe.fx.off ? 0 : "number" == typeof i.duration ? i.duration : i.duration in oe.fx.speeds ? oe.fx.speeds[i.duration] : oe.fx.speeds._default, (null == i.queue || i.queue === !0) && (i.queue = "fx"), i.old = i.complete, i.complete = function() {
				oe.isFunction(i.old) && i.old.call(this), i.queue && oe.dequeue(this, i.queue)
			}, i
		}, oe.fn.extend({
			fadeTo: function(e, t, n, i) {
				return this.filter(Ee).css("opacity", 0).show().end().animate({
					opacity: t
				}, e, n, i)
			},
			animate: function(e, t, n, i) {
				var o = oe.isEmptyObject(e),
					a = oe.speed(t, n, i),
					s = function() {
						var t = B(this, oe.extend({}, e), a);
						(o || oe._data(this, "finish")) && t.stop(!0)
					};
				return s.finish = s, o || a.queue === !1 ? this.each(s) : this.queue(a.queue, s)
			},
			stop: function(e, t, n) {
				var i = function(e) {
					var t = e.stop;
					delete e.stop, t(n)
				};
				return "string" != typeof e && (n = t, t = e, e = void 0), t && e !== !1 && this.queue(e || "fx", []), this.each(function() {
					var t = !0,
						o = null != e && e + "queueHooks",
						a = oe.timers,
						s = oe._data(this);
					if(o) s[o] && s[o].stop && i(s[o]);
					else
						for(o in s) s[o] && s[o].stop && vt.test(o) && i(s[o]);
					for(o = a.length; o--;) a[o].elem !== this || null != e && a[o].queue !== e || (a[o].anim.stop(n), t = !1, a.splice(o, 1));
					(t || !n) && oe.dequeue(this, e)
				})
			},
			finish: function(e) {
				return e !== !1 && (e = e || "fx"), this.each(function() {
					var t, n = oe._data(this),
						i = n[e + "queue"],
						o = n[e + "queueHooks"],
						a = oe.timers,
						s = i ? i.length : 0;
					for(n.finish = !0, oe.queue(this, e, []), o && o.stop && o.stop.call(this, !0), t = a.length; t--;) a[t].elem === this && a[t].queue === e && (a[t].anim.stop(!0), a.splice(t, 1));
					for(t = 0; s > t; t++) i[t] && i[t].finish && i[t].finish.call(this);
					delete n.finish
				})
			}
		}), oe.each(["toggle", "show", "hide"], function(e, t) {
			var n = oe.fn[t];
			oe.fn[t] = function(e, i, o) {
				return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(N(t, !0), e, i, o)
			}
		}), oe.each({
			slideDown: N("show"),
			slideUp: N("hide"),
			slideToggle: N("toggle"),
			fadeIn: {
				opacity: "show"
			},
			fadeOut: {
				opacity: "hide"
			},
			fadeToggle: {
				opacity: "toggle"
			}
		}, function(e, t) {
			oe.fn[e] = function(e, n, i) {
				return this.animate(t, e, n, i)
			}
		}), oe.timers = [], oe.fx.tick = function() {
			var e, t = oe.timers,
				n = 0;
			for(ht = oe.now(); n < t.length; n++) e = t[n], e() || t[n] !== e || t.splice(n--, 1);
			t.length || oe.fx.stop(), ht = void 0
		}, oe.fx.timer = function(e) {
			oe.timers.push(e), e() ? oe.fx.start() : oe.timers.pop()
		}, oe.fx.interval = 13, oe.fx.start = function() {
			ft || (ft = setInterval(oe.fx.tick, oe.fx.interval))
		}, oe.fx.stop = function() {
			clearInterval(ft), ft = null
		}, oe.fx.speeds = {
			slow: 600,
			fast: 200,
			_default: 400
		}, oe.fn.delay = function(e, t) {
			return e = oe.fx ? oe.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, n) {
				var i = setTimeout(t, e);
				n.stop = function() {
					clearTimeout(i)
				}
			})
		},
		function() {
			var e, t, n, i, o;
			t = fe.createElement("div"), t.setAttribute("className", "t"), t.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", i = t.getElementsByTagName("a")[0], n = fe.createElement("select"), o = n.appendChild(fe.createElement("option")), e = t.getElementsByTagName("input")[0], i.style.cssText = "top:1px", ne.getSetAttribute = "t" !== t.className, ne.style = /top/.test(i.getAttribute("style")), ne.hrefNormalized = "/a" === i.getAttribute("href"), ne.checkOn = !!e.value, ne.optSelected = o.selected, ne.enctype = !!fe.createElement("form").enctype, n.disabled = !0, ne.optDisabled = !o.disabled, e = fe.createElement("input"), e.setAttribute("value", ""), ne.input = "" === e.getAttribute("value"), e.value = "t", e.setAttribute("type", "radio"), ne.radioValue = "t" === e.value
		}();
	var yt = /\r/g;
	oe.fn.extend({
		val: function(e) {
			var t, n, i, o = this[0];
			return arguments.length ? (i = oe.isFunction(e), this.each(function(n) {
				var o;
				1 === this.nodeType && (o = i ? e.call(this, n, oe(this).val()) : e, null == o ? o = "" : "number" == typeof o ? o += "" : oe.isArray(o) && (o = oe.map(o, function(e) {
					return null == e ? "" : e + ""
				})), t = oe.valHooks[this.type] || oe.valHooks[this.nodeName.toLowerCase()], t && "set" in t && void 0 !== t.set(this, o, "value") || (this.value = o))
			})) : o ? (t = oe.valHooks[o.type] || oe.valHooks[o.nodeName.toLowerCase()], t && "get" in t && void 0 !== (n = t.get(o, "value")) ? n : (n = o.value, "string" == typeof n ? n.replace(yt, "") : null == n ? "" : n)) : void 0
		}
	}), oe.extend({
		valHooks: {
			option: {
				get: function(e) {
					var t = oe.find.attr(e, "value");
					return null != t ? t : oe.trim(oe.text(e))
				}
			},
			select: {
				get: function(e) {
					for(var t, n, i = e.options, o = e.selectedIndex, a = "select-one" === e.type || 0 > o, s = a ? null : [], r = a ? o + 1 : i.length, l = 0 > o ? r : a ? o : 0; r > l; l++)
						if(n = i[l], !(!n.selected && l !== o || (ne.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && oe.nodeName(n.parentNode, "optgroup"))) {
							if(t = oe(n).val(), a) return t;
							s.push(t)
						}
					return s
				},
				set: function(e, t) {
					for(var n, i, o = e.options, a = oe.makeArray(t), s = o.length; s--;)
						if(i = o[s], oe.inArray(oe.valHooks.option.get(i), a) >= 0) try {
							i.selected = n = !0
						} catch(r) {
							i.scrollHeight
						} else i.selected = !1;
					return n || (e.selectedIndex = -1), o
				}
			}
		}
	}), oe.each(["radio", "checkbox"], function() {
		oe.valHooks[this] = {
			set: function(e, t) {
				return oe.isArray(t) ? e.checked = oe.inArray(oe(e).val(), t) >= 0 : void 0
			}
		}, ne.checkOn || (oe.valHooks[this].get = function(e) {
			return null === e.getAttribute("value") ? "on" : e.value
		})
	});
	var wt, _t, Tt = oe.expr.attrHandle,
		Ct = /^(?:checked|selected)$/i,
		kt = ne.getSetAttribute,
		St = ne.input;
	oe.fn.extend({
		attr: function(e, t) {
			return je(this, oe.attr, e, t, arguments.length > 1)
		},
		removeAttr: function(e) {
			return this.each(function() {
				oe.removeAttr(this, e)
			})
		}
	}), oe.extend({
		attr: function(e, t, n) {
			var i, o, a = e.nodeType;
			if(e && 3 !== a && 8 !== a && 2 !== a) return typeof e.getAttribute === Te ? oe.prop(e, t, n) : (1 === a && oe.isXMLDoc(e) || (t = t.toLowerCase(), i = oe.attrHooks[t] || (oe.expr.match.bool.test(t) ? _t : wt)), void 0 === n ? i && "get" in i && null !== (o = i.get(e, t)) ? o : (o = oe.find.attr(e, t), null == o ? void 0 : o) : null !== n ? i && "set" in i && void 0 !== (o = i.set(e, n, t)) ? o : (e.setAttribute(t, n + ""), n) : void oe.removeAttr(e, t))
		},
		removeAttr: function(e, t) {
			var n, i, o = 0,
				a = t && t.match(xe);
			if(a && 1 === e.nodeType)
				for(; n = a[o++];) i = oe.propFix[n] || n, oe.expr.match.bool.test(n) ? St && kt || !Ct.test(n) ? e[i] = !1 : e[oe.camelCase("default-" + n)] = e[i] = !1 : oe.attr(e, n, ""), e.removeAttribute(kt ? n : i)
		},
		attrHooks: {
			type: {
				set: function(e, t) {
					if(!ne.radioValue && "radio" === t && oe.nodeName(e, "input")) {
						var n = e.value;
						return e.setAttribute("type", t), n && (e.value = n), t
					}
				}
			}
		}
	}), _t = {
		set: function(e, t, n) {
			return t === !1 ? oe.removeAttr(e, n) : St && kt || !Ct.test(n) ? e.setAttribute(!kt && oe.propFix[n] || n, n) : e[oe.camelCase("default-" + n)] = e[n] = !0, n
		}
	}, oe.each(oe.expr.match.bool.source.match(/\w+/g), function(e, t) {
		var n = Tt[t] || oe.find.attr;
		Tt[t] = St && kt || !Ct.test(t) ? function(e, t, i) {
			var o, a;
			return i || (a = Tt[t], Tt[t] = o, o = null != n(e, t, i) ? t.toLowerCase() : null, Tt[t] = a), o
		} : function(e, t, n) {
			return n ? void 0 : e[oe.camelCase("default-" + t)] ? t.toLowerCase() : null
		}
	}), St && kt || (oe.attrHooks.value = {
		set: function(e, t, n) {
			return oe.nodeName(e, "input") ? void(e.defaultValue = t) : wt && wt.set(e, t, n)
		}
	}), kt || (wt = {
		set: function(e, t, n) {
			var i = e.getAttributeNode(n);
			return i || e.setAttributeNode(i = e.ownerDocument.createAttribute(n)), i.value = t += "", "value" === n || t === e.getAttribute(n) ? t : void 0
		}
	}, Tt.id = Tt.name = Tt.coords = function(e, t, n) {
		var i;
		return n ? void 0 : (i = e.getAttributeNode(t)) && "" !== i.value ? i.value : null
	}, oe.valHooks.button = {
		get: function(e, t) {
			var n = e.getAttributeNode(t);
			return n && n.specified ? n.value : void 0
		},
		set: wt.set
	}, oe.attrHooks.contenteditable = {
		set: function(e, t, n) {
			wt.set(e, "" !== t && t, n)
		}
	}, oe.each(["width", "height"], function(e, t) {
		oe.attrHooks[t] = {
			set: function(e, n) {
				return "" === n ? (e.setAttribute(t, "auto"), n) : void 0
			}
		}
	})), ne.style || (oe.attrHooks.style = {
		get: function(e) {
			return e.style.cssText || void 0
		},
		set: function(e, t) {
			return e.style.cssText = t + ""
		}
	});
	var $t = /^(?:input|select|textarea|button|object)$/i,
		Et = /^(?:a|area)$/i;
	oe.fn.extend({
		prop: function(e, t) {
			return je(this, oe.prop, e, t, arguments.length > 1)
		},
		removeProp: function(e) {
			return e = oe.propFix[e] || e, this.each(function() {
				try {
					this[e] = void 0, delete this[e]
				} catch(t) {}
			})
		}
	}), oe.extend({
		propFix: {
			"for": "htmlFor",
			"class": "className"
		},
		prop: function(e, t, n) {
			var i, o, a, s = e.nodeType;
			if(e && 3 !== s && 8 !== s && 2 !== s) return a = 1 !== s || !oe.isXMLDoc(e), a && (t = oe.propFix[t] || t, o = oe.propHooks[t]), void 0 !== n ? o && "set" in o && void 0 !== (i = o.set(e, n, t)) ? i : e[t] = n : o && "get" in o && null !== (i = o.get(e, t)) ? i : e[t]
		},
		propHooks: {
			tabIndex: {
				get: function(e) {
					var t = oe.find.attr(e, "tabindex");
					return t ? parseInt(t, 10) : $t.test(e.nodeName) || Et.test(e.nodeName) && e.href ? 0 : -1
				}
			}
		}
	}), ne.hrefNormalized || oe.each(["href", "src"], function(e, t) {
		oe.propHooks[t] = {
			get: function(e) {
				return e.getAttribute(t, 4)
			}
		}
	}), ne.optSelected || (oe.propHooks.selected = {
		get: function(e) {
			var t = e.parentNode;
			return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
		}
	}), oe.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
		oe.propFix[this.toLowerCase()] = this
	}), ne.enctype || (oe.propFix.enctype = "encoding");
	var jt = /[\t\r\n\f]/g;
	oe.fn.extend({
		addClass: function(e) {
			var t, n, i, o, a, s, r = 0,
				l = this.length,
				c = "string" == typeof e && e;
			if(oe.isFunction(e)) return this.each(function(t) {
				oe(this).addClass(e.call(this, t, this.className))
			});
			if(c)
				for(t = (e || "").match(xe) || []; l > r; r++)
					if(n = this[r], i = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(jt, " ") : " ")) {
						for(a = 0; o = t[a++];) i.indexOf(" " + o + " ") < 0 && (i += o + " ");
						s = oe.trim(i), n.className !== s && (n.className = s)
					}
			return this
		},
		removeClass: function(e) {
			var t, n, i, o, a, s, r = 0,
				l = this.length,
				c = 0 === arguments.length || "string" == typeof e && e;
			if(oe.isFunction(e)) return this.each(function(t) {
				oe(this).removeClass(e.call(this, t, this.className))
			});
			if(c)
				for(t = (e || "").match(xe) || []; l > r; r++)
					if(n = this[r], i = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(jt, " ") : "")) {
						for(a = 0; o = t[a++];)
							for(; i.indexOf(" " + o + " ") >= 0;) i = i.replace(" " + o + " ", " ");
						s = e ? oe.trim(i) : "", n.className !== s && (n.className = s)
					}
			return this
		},
		toggleClass: function(e, t) {
			var n = typeof e;
			return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : this.each(oe.isFunction(e) ? function(n) {
				oe(this).toggleClass(e.call(this, n, this.className, t), t)
			} : function() {
				if("string" === n)
					for(var t, i = 0, o = oe(this), a = e.match(xe) || []; t = a[i++];) o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
				else(n === Te || "boolean" === n) && (this.className && oe._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : oe._data(this, "__className__") || "")
			})
		},
		hasClass: function(e) {
			for(var t = " " + e + " ", n = 0, i = this.length; i > n; n++)
				if(1 === this[n].nodeType && (" " + this[n].className + " ").replace(jt, " ").indexOf(t) >= 0) return !0;
			return !1
		}
	}), oe.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
		oe.fn[t] = function(e, n) {
			return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
		}
	}), oe.fn.extend({
		hover: function(e, t) {
			return this.mouseenter(e).mouseleave(t || e)
		},
		bind: function(e, t, n) {
			return this.on(e, null, t, n)
		},
		unbind: function(e, t) {
			return this.off(e, null, t)
		},
		delegate: function(e, t, n, i) {
			return this.on(t, e, n, i)
		},
		undelegate: function(e, t, n) {
			return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
		}
	});
	var It = oe.now(),
		Ot = /\?/,
		Pt = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
	oe.parseJSON = function(t) {
		if(e.JSON && e.JSON.parse) return e.JSON.parse(t + "");
		var n, i = null,
			o = oe.trim(t + "");
		return o && !oe.trim(o.replace(Pt, function(e, t, o, a) {
			return n && t && (i = 0), 0 === i ? e : (n = o || t, i += !a - !o, "")
		})) ? Function("return " + o)() : oe.error("Invalid JSON: " + t)
	}, oe.parseXML = function(t) {
		var n, i;
		if(!t || "string" != typeof t) return null;
		try {
			e.DOMParser ? (i = new DOMParser, n = i.parseFromString(t, "text/xml")) : (n = new ActiveXObject("Microsoft.XMLDOM"), n.async = "false", n.loadXML(t))
		} catch(o) {
			n = void 0
		}
		return n && n.documentElement && !n.getElementsByTagName("parsererror").length || oe.error("Invalid XML: " + t), n
	};
	var Mt, Nt, At = /#.*$/,
		Lt = /([?&])_=[^&]*/,
		Dt = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
		Bt = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		Ht = /^(?:GET|HEAD)$/,
		Rt = /^\/\//,
		zt = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
		Ft = {},
		Ut = {},
		Wt = "*/".concat("*");
	try {
		Nt = location.href
	} catch(qt) {
		Nt = fe.createElement("a"), Nt.href = "", Nt = Nt.href
	}
	Mt = zt.exec(Nt.toLowerCase()) || [], oe.extend({
		active: 0,
		lastModified: {},
		etag: {},
		ajaxSettings: {
			url: Nt,
			type: "GET",
			isLocal: Bt.test(Mt[1]),
			global: !0,
			processData: !0,
			async: !0,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			accepts: {
				"*": Wt,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},
			contents: {
				xml: /xml/,
				html: /html/,
				json: /json/
			},
			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},
			converters: {
				"* text": String,
				"text html": !0,
				"text json": oe.parseJSON,
				"text xml": oe.parseXML
			},
			flatOptions: {
				url: !0,
				context: !0
			}
		},
		ajaxSetup: function(e, t) {
			return t ? z(z(e, oe.ajaxSettings), t) : z(oe.ajaxSettings, e)
		},
		ajaxPrefilter: H(Ft),
		ajaxTransport: H(Ut),
		ajax: function(e, t) {
			function n(e, t, n, i) {
				var o, d, v, b, y, _ = t;
				2 !== x && (x = 2, r && clearTimeout(r), c = void 0, s = i || "", w.readyState = e > 0 ? 4 : 0, o = e >= 200 && 300 > e || 304 === e, n && (b = F(u, w, n)), b = U(u, b, w, o), o ? (u.ifModified && (y = w.getResponseHeader("Last-Modified"), y && (oe.lastModified[a] = y), y = w.getResponseHeader("etag"), y && (oe.etag[a] = y)), 204 === e || "HEAD" === u.type ? _ = "nocontent" : 304 === e ? _ = "notmodified" : (_ = b.state, d = b.data, v = b.error, o = !v)) : (v = _, (e || !_) && (_ = "error", 0 > e && (e = 0))), w.status = e, w.statusText = (t || _) + "", o ? f.resolveWith(p, [d, _, w]) : f.rejectWith(p, [w, _, v]), w.statusCode(g), g = void 0, l && h.trigger(o ? "ajaxSuccess" : "ajaxError", [w, u, o ? d : v]), m.fireWith(p, [w, _]), l && (h.trigger("ajaxComplete", [w, u]), --oe.active || oe.event.trigger("ajaxStop")))
			}
			"object" == typeof e && (t = e, e = void 0), t = t || {};
			var i, o, a, s, r, l, c, d, u = oe.ajaxSetup({}, t),
				p = u.context || u,
				h = u.context && (p.nodeType || p.jquery) ? oe(p) : oe.event,
				f = oe.Deferred(),
				m = oe.Callbacks("once memory"),
				g = u.statusCode || {},
				v = {},
				b = {},
				x = 0,
				y = "canceled",
				w = {
					readyState: 0,
					getResponseHeader: function(e) {
						var t;
						if(2 === x) {
							if(!d)
								for(d = {}; t = Dt.exec(s);) d[t[1].toLowerCase()] = t[2];
							t = d[e.toLowerCase()]
						}
						return null == t ? null : t
					},
					getAllResponseHeaders: function() {
						return 2 === x ? s : null
					},
					setRequestHeader: function(e, t) {
						var n = e.toLowerCase();
						return x || (e = b[n] = b[n] || e, v[e] = t), this
					},
					overrideMimeType: function(e) {
						return x || (u.mimeType = e), this
					},
					statusCode: function(e) {
						var t;
						if(e)
							if(2 > x)
								for(t in e) g[t] = [g[t], e[t]];
							else w.always(e[w.status]);
						return this
					},
					abort: function(e) {
						var t = e || y;
						return c && c.abort(t), n(0, t), this
					}
				};
			if(f.promise(w).complete = m.add, w.success = w.done, w.error = w.fail, u.url = ((e || u.url || Nt) + "").replace(At, "").replace(Rt, Mt[1] + "//"), u.type = t.method || t.type || u.method || u.type, u.dataTypes = oe.trim(u.dataType || "*").toLowerCase().match(xe) || [""], null == u.crossDomain && (i = zt.exec(u.url.toLowerCase()), u.crossDomain = !(!i || i[1] === Mt[1] && i[2] === Mt[2] && (i[3] || ("http:" === i[1] ? "80" : "443")) === (Mt[3] || ("http:" === Mt[1] ? "80" : "443")))), u.data && u.processData && "string" != typeof u.data && (u.data = oe.param(u.data, u.traditional)), R(Ft, u, t, w), 2 === x) return w;
			l = oe.event && u.global, l && 0 === oe.active++ && oe.event.trigger("ajaxStart"), u.type = u.type.toUpperCase(), u.hasContent = !Ht.test(u.type), a = u.url, u.hasContent || (u.data && (a = u.url += (Ot.test(a) ? "&" : "?") + u.data, delete u.data), u.cache === !1 && (u.url = Lt.test(a) ? a.replace(Lt, "$1_=" + It++) : a + (Ot.test(a) ? "&" : "?") + "_=" + It++)), u.ifModified && (oe.lastModified[a] && w.setRequestHeader("If-Modified-Since", oe.lastModified[a]), oe.etag[a] && w.setRequestHeader("If-None-Match", oe.etag[a])), (u.data && u.hasContent && u.contentType !== !1 || t.contentType) && w.setRequestHeader("Content-Type", u.contentType), w.setRequestHeader("Accept", u.dataTypes[0] && u.accepts[u.dataTypes[0]] ? u.accepts[u.dataTypes[0]] + ("*" !== u.dataTypes[0] ? ", " + Wt + "; q=0.01" : "") : u.accepts["*"]);
			for(o in u.headers) w.setRequestHeader(o, u.headers[o]);
			if(u.beforeSend && (u.beforeSend.call(p, w, u) === !1 || 2 === x)) return w.abort();
			y = "abort";
			for(o in {
					success: 1,
					error: 1,
					complete: 1
				}) w[o](u[o]);
			if(c = R(Ut, u, t, w)) {
				w.readyState = 1, l && h.trigger("ajaxSend", [w, u]), u.async && u.timeout > 0 && (r = setTimeout(function() {
					w.abort("timeout")
				}, u.timeout));
				try {
					x = 1, c.send(v, n)
				} catch(_) {
					if(!(2 > x)) throw _;
					n(-1, _)
				}
			} else n(-1, "No Transport");
			return w
		},
		getJSON: function(e, t, n) {
			return oe.get(e, t, n, "json")
		},
		getScript: function(e, t) {
			return oe.get(e, void 0, t, "script")
		}
	}), oe.each(["get", "post"], function(e, t) {
		oe[t] = function(e, n, i, o) {
			return oe.isFunction(n) && (o = o || i, i = n, n = void 0), oe.ajax({
				url: e,
				type: t,
				dataType: o,
				data: n,
				success: i
			})
		}
	}), oe._evalUrl = function(e) {
		return oe.ajax({
			url: e,
			type: "GET",
			dataType: "script",
			async: !1,
			global: !1,
			"throws": !0
		})
	}, oe.fn.extend({
		wrapAll: function(e) {
			if(oe.isFunction(e)) return this.each(function(t) {
				oe(this).wrapAll(e.call(this, t))
			});
			if(this[0]) {
				var t = oe(e, this[0].ownerDocument).eq(0).clone(!0);
				this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
					for(var e = this; e.firstChild && 1 === e.firstChild.nodeType;) e = e.firstChild;
					return e
				}).append(this)
			}
			return this
		},
		wrapInner: function(e) {
			return this.each(oe.isFunction(e) ? function(t) {
				oe(this).wrapInner(e.call(this, t))
			} : function() {
				var t = oe(this),
					n = t.contents();
				n.length ? n.wrapAll(e) : t.append(e)
			})
		},
		wrap: function(e) {
			var t = oe.isFunction(e);
			return this.each(function(n) {
				oe(this).wrapAll(t ? e.call(this, n) : e)
			})
		},
		unwrap: function() {
			return this.parent().each(function() {
				oe.nodeName(this, "body") || oe(this).replaceWith(this.childNodes)
			}).end()
		}
	}), oe.expr.filters.hidden = function(e) {
		return e.offsetWidth <= 0 && e.offsetHeight <= 0 || !ne.reliableHiddenOffsets() && "none" === (e.style && e.style.display || oe.css(e, "display"))
	}, oe.expr.filters.visible = function(e) {
		return !oe.expr.filters.hidden(e)
	};
	var Yt = /%20/g,
		Jt = /\[\]$/,
		Gt = /\r?\n/g,
		Xt = /^(?:submit|button|image|reset|file)$/i,
		Vt = /^(?:input|select|textarea|keygen)/i;
	oe.param = function(e, t) {
		var n, i = [],
			o = function(e, t) {
				t = oe.isFunction(t) ? t() : null == t ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
			};
		if(void 0 === t && (t = oe.ajaxSettings && oe.ajaxSettings.traditional), oe.isArray(e) || e.jquery && !oe.isPlainObject(e)) oe.each(e, function() {
			o(this.name, this.value)
		});
		else
			for(n in e) W(n, e[n], t, o);
		return i.join("&").replace(Yt, "+")
	}, oe.fn.extend({
		serialize: function() {
			return oe.param(this.serializeArray())
		},
		serializeArray: function() {
			return this.map(function() {
				var e = oe.prop(this, "elements");
				return e ? oe.makeArray(e) : this
			}).filter(function() {
				var e = this.type;
				return this.name && !oe(this).is(":disabled") && Vt.test(this.nodeName) && !Xt.test(e) && (this.checked || !Ie.test(e))
			}).map(function(e, t) {
				var n = oe(this).val();
				return null == n ? null : oe.isArray(n) ? oe.map(n, function(e) {
					return {
						name: t.name,
						value: e.replace(Gt, "\r\n")
					}
				}) : {
					name: t.name,
					value: n.replace(Gt, "\r\n")
				}
			}).get()
		}
	}), oe.ajaxSettings.xhr = void 0 !== e.ActiveXObject ? function() {
		return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && q() || Y()
	} : q;
	var Zt = 0,
		Qt = {},
		Kt = oe.ajaxSettings.xhr();
	e.attachEvent && e.attachEvent("onunload", function() {
		for(var e in Qt) Qt[e](void 0, !0)
	}), ne.cors = !!Kt && "withCredentials" in Kt, Kt = ne.ajax = !!Kt, Kt && oe.ajaxTransport(function(e) {
		if(!e.crossDomain || ne.cors) {
			var t;
			return {
				send: function(n, i) {
					var o, a = e.xhr(),
						s = ++Zt;
					if(a.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)
						for(o in e.xhrFields) a[o] = e.xhrFields[o];
					e.mimeType && a.overrideMimeType && a.overrideMimeType(e.mimeType), e.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest");
					for(o in n) void 0 !== n[o] && a.setRequestHeader(o, n[o] + "");
					a.send(e.hasContent && e.data || null), t = function(n, o) {
						var r, l, c;
						if(t && (o || 4 === a.readyState))
							if(delete Qt[s], t = void 0, a.onreadystatechange = oe.noop, o) 4 !== a.readyState && a.abort();
							else {
								c = {}, r = a.status, "string" == typeof a.responseText && (c.text = a.responseText);
								try {
									l = a.statusText
								} catch(d) {
									l = ""
								}
								r || !e.isLocal || e.crossDomain ? 1223 === r && (r = 204) : r = c.text ? 200 : 404
							}
						c && i(r, l, c, a.getAllResponseHeaders())
					}, e.async ? 4 === a.readyState ? setTimeout(t) : a.onreadystatechange = Qt[s] = t : t()
				},
				abort: function() {
					t && t(void 0, !0)
				}
			}
		}
	}), oe.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /(?:java|ecma)script/
		},
		converters: {
			"text script": function(e) {
				return oe.globalEval(e), e
			}
		}
	}), oe.ajaxPrefilter("script", function(e) {
		void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
	}), oe.ajaxTransport("script", function(e) {
		if(e.crossDomain) {
			var t, n = fe.head || oe("head")[0] || fe.documentElement;
			return {
				send: function(i, o) {
					t = fe.createElement("script"), t.async = !0, e.scriptCharset && (t.charset = e.scriptCharset), t.src = e.url, t.onload = t.onreadystatechange = function(e, n) {
						(n || !t.readyState || /loaded|complete/.test(t.readyState)) && (t.onload = t.onreadystatechange = null, t.parentNode && t.parentNode.removeChild(t), t = null, n || o(200, "success"))
					}, n.insertBefore(t, n.firstChild)
				},
				abort: function() {
					t && t.onload(void 0, !0)
				}
			}
		}
	});
	var en = [],
		tn = /(=)\?(?=&|$)|\?\?/;
	oe.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function() {
			var e = en.pop() || oe.expando + "_" + It++;
			return this[e] = !0, e
		}
	}), oe.ajaxPrefilter("json jsonp", function(t, n, i) {
		var o, a, s, r = t.jsonp !== !1 && (tn.test(t.url) ? "url" : "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && tn.test(t.data) && "data");
		return r || "jsonp" === t.dataTypes[0] ? (o = t.jsonpCallback = oe.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, r ? t[r] = t[r].replace(tn, "$1" + o) : t.jsonp !== !1 && (t.url += (Ot.test(t.url) ? "&" : "?") + t.jsonp + "=" + o), t.converters["script json"] = function() {
			return s || oe.error(o + " was not called"), s[0]
		}, t.dataTypes[0] = "json", a = e[o], e[o] = function() {
			s = arguments
		}, i.always(function() {
			e[o] = a, t[o] && (t.jsonpCallback = n.jsonpCallback, en.push(o)), s && oe.isFunction(a) && a(s[0]), s = a = void 0
		}), "script") : void 0
	}), oe.parseHTML = function(e, t, n) {
		if(!e || "string" != typeof e) return null;
		"boolean" == typeof t && (n = t, t = !1), t = t || fe;
		var i = ue.exec(e),
			o = !n && [];
		return i ? [t.createElement(i[1])] : (i = oe.buildFragment([e], t, o), o && o.length && oe(o).remove(), oe.merge([], i.childNodes))
	};
	var nn = oe.fn.load;
	oe.fn.load = function(e, t, n) {
		if("string" != typeof e && nn) return nn.apply(this, arguments);
		var i, o, a, s = this,
			r = e.indexOf(" ");
		return r >= 0 && (i = oe.trim(e.slice(r, e.length)), e = e.slice(0, r)), oe.isFunction(t) ? (n = t, t = void 0) : t && "object" == typeof t && (a = "POST"), s.length > 0 && oe.ajax({
			url: e,
			type: a,
			dataType: "html",
			data: t
		}).done(function(e) {
			o = arguments, s.html(i ? oe("<div>").append(oe.parseHTML(e)).find(i) : e)
		}).complete(n && function(e, t) {
			s.each(n, o || [e.responseText, t, e])
		}), this
	}, oe.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
		oe.fn[t] = function(e) {
			return this.on(t, e)
		}
	}), oe.expr.filters.animated = function(e) {
		return oe.grep(oe.timers, function(t) {
			return e === t.elem
		}).length
	};
	var on = e.document.documentElement;
	oe.offset = {
		setOffset: function(e, t, n) {
			var i, o, a, s, r, l, c, d = oe.css(e, "position"),
				u = oe(e),
				p = {};
			"static" === d && (e.style.position = "relative"), r = u.offset(), a = oe.css(e, "top"), l = oe.css(e, "left"), c = ("absolute" === d || "fixed" === d) && oe.inArray("auto", [a, l]) > -1, c ? (i = u.position(), s = i.top, o = i.left) : (s = parseFloat(a) || 0, o = parseFloat(l) || 0), oe.isFunction(t) && (t = t.call(e, n, r)), null != t.top && (p.top = t.top - r.top + s), null != t.left && (p.left = t.left - r.left + o), "using" in t ? t.using.call(e, p) : u.css(p)
		}
	}, oe.fn.extend({
		offset: function(e) {
			if(arguments.length) return void 0 === e ? this : this.each(function(t) {
				oe.offset.setOffset(this, e, t)
			});
			var t, n, i = {
					top: 0,
					left: 0
				},
				o = this[0],
				a = o && o.ownerDocument;
			return a ? (t = a.documentElement, oe.contains(t, o) ? (typeof o.getBoundingClientRect !== Te && (i = o.getBoundingClientRect()), n = J(a), {
				top: i.top + (n.pageYOffset || t.scrollTop) - (t.clientTop || 0),
				left: i.left + (n.pageXOffset || t.scrollLeft) - (t.clientLeft || 0)
			}) : i) : void 0
		},
		position: function() {
			if(this[0]) {
				var e, t, n = {
						top: 0,
						left: 0
					},
					i = this[0];
				return "fixed" === oe.css(i, "position") ? t = i.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), oe.nodeName(e[0], "html") || (n = e.offset()), n.top += oe.css(e[0], "borderTopWidth", !0), n.left += oe.css(e[0], "borderLeftWidth", !0)), {
					top: t.top - n.top - oe.css(i, "marginTop", !0),
					left: t.left - n.left - oe.css(i, "marginLeft", !0)
				}
			}
		},
		offsetParent: function() {
			return this.map(function() {
				for(var e = this.offsetParent || on; e && !oe.nodeName(e, "html") && "static" === oe.css(e, "position");) e = e.offsetParent;
				return e || on
			})
		}
	}), oe.each({
		scrollLeft: "pageXOffset",
		scrollTop: "pageYOffset"
	}, function(e, t) {
		var n = /Y/.test(t);
		oe.fn[e] = function(i) {
			return je(this, function(e, i, o) {
				var a = J(e);
				return void 0 === o ? a ? t in a ? a[t] : a.document.documentElement[i] : e[i] : void(a ? a.scrollTo(n ? oe(a).scrollLeft() : o, n ? o : oe(a).scrollTop()) : e[i] = o)
			}, e, i, arguments.length, null)
		}
	}), oe.each(["top", "left"], function(e, t) {
		oe.cssHooks[t] = S(ne.pixelPosition, function(e, n) {
			return n ? (n = tt(e, t), it.test(n) ? oe(e).position()[t] + "px" : n) : void 0
		})
	}), oe.each({
		Height: "height",
		Width: "width"
	}, function(e, t) {
		oe.each({
			padding: "inner" + e,
			content: t,
			"": "outer" + e
		}, function(n, i) {
			oe.fn[i] = function(i, o) {
				var a = arguments.length && (n || "boolean" != typeof i),
					s = n || (i === !0 || o === !0 ? "margin" : "border");
				return je(this, function(t, n, i) {
					var o;
					return oe.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (o = t.documentElement, Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e])) : void 0 === i ? oe.css(t, n, s) : oe.style(t, n, i, s)
				}, t, a ? i : void 0, a, null)
			}
		})
	}), oe.fn.size = function() {
		return this.length
	}, oe.fn.andSelf = oe.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
		return oe
	});
	var an = e.jQuery,
		sn = e.$;
	return oe.noConflict = function(t) {
		return e.$ === oe && (e.$ = sn), t && e.jQuery === oe && (e.jQuery = an), oe
	}, typeof t === Te && (e.jQuery = e.$ = oe), oe
}), jQuery.easing.jswing = jQuery.easing.swing, jQuery.extend(jQuery.easing, {
	def: "easeOutQuad",
	swing: function(e, t, n, i, o) {
		return jQuery.easing[jQuery.easing.def](e, t, n, i, o)
	},
	easeInQuad: function(e, t, n, i, o) {
		return i * (t /= o) * t + n
	},
	easeOutQuad: function(e, t, n, i, o) {
		return -i * (t /= o) * (t - 2) + n
	},
	easeInOutQuad: function(e, t, n, i, o) {
		return(t /= o / 2) < 1 ? i / 2 * t * t + n : -i / 2 * (--t * (t - 2) - 1) + n
	},
	easeInCubic: function(e, t, n, i, o) {
		return i * (t /= o) * t * t + n
	},
	easeOutCubic: function(e, t, n, i, o) {
		return i * ((t = t / o - 1) * t * t + 1) + n
	},
	easeInOutCubic: function(e, t, n, i, o) {
		return(t /= o / 2) < 1 ? i / 2 * t * t * t + n : i / 2 * ((t -= 2) * t * t + 2) + n
	},
	easeInQuart: function(e, t, n, i, o) {
		return i * (t /= o) * t * t * t + n
	},
	easeOutQuart: function(e, t, n, i, o) {
		return -i * ((t = t / o - 1) * t * t * t - 1) + n
	},
	easeInOutQuart: function(e, t, n, i, o) {
		return(t /= o / 2) < 1 ? i / 2 * t * t * t * t + n : -i / 2 * ((t -= 2) * t * t * t - 2) + n
	},
	easeInQuint: function(e, t, n, i, o) {
		return i * (t /= o) * t * t * t * t + n
	},
	easeOutQuint: function(e, t, n, i, o) {
		return i * ((t = t / o - 1) * t * t * t * t + 1) + n
	},
	easeInOutQuint: function(e, t, n, i, o) {
		return(t /= o / 2) < 1 ? i / 2 * t * t * t * t * t + n : i / 2 * ((t -= 2) * t * t * t * t + 2) + n
	},
	easeInSine: function(e, t, n, i, o) {
		return -i * Math.cos(t / o * (Math.PI / 2)) + i + n
	},
	easeOutSine: function(e, t, n, i, o) {
		return i * Math.sin(t / o * (Math.PI / 2)) + n
	},
	easeInOutSine: function(e, t, n, i, o) {
		return -i / 2 * (Math.cos(Math.PI * t / o) - 1) + n
	},
	easeInExpo: function(e, t, n, i, o) {
		return 0 == t ? n : i * Math.pow(2, 10 * (t / o - 1)) + n
	},
	easeOutExpo: function(e, t, n, i, o) {
		return t == o ? n + i : i * (-Math.pow(2, -10 * t / o) + 1) + n
	},
	easeInOutExpo: function(e, t, n, i, o) {
		return 0 == t ? n : t == o ? n + i : (t /= o / 2) < 1 ? i / 2 * Math.pow(2, 10 * (t - 1)) + n : i / 2 * (-Math.pow(2, -10 * --t) + 2) + n
	},
	easeInCirc: function(e, t, n, i, o) {
		return -i * (Math.sqrt(1 - (t /= o) * t) - 1) + n
	},
	easeOutCirc: function(e, t, n, i, o) {
		return i * Math.sqrt(1 - (t = t / o - 1) * t) + n
	},
	easeInOutCirc: function(e, t, n, i, o) {
		return(t /= o / 2) < 1 ? -i / 2 * (Math.sqrt(1 - t * t) - 1) + n : i / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + n
	},
	easeInElastic: function(e, t, n, i, o) {
		var a = 1.70158,
			s = 0,
			r = i;
		if(0 == t) return n;
		if(1 == (t /= o)) return n + i;
		if(s || (s = .3 * o), r < Math.abs(i)) {
			r = i;
			var a = s / 4
		} else var a = s / (2 * Math.PI) * Math.asin(i / r);
		return -(r * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * o - a) * (2 * Math.PI) / s)) + n
	},
	easeOutElastic: function(e, t, n, i, o) {
		var a = 1.70158,
			s = 0,
			r = i;
		if(0 == t) return n;
		if(1 == (t /= o)) return n + i;
		if(s || (s = .3 * o), r < Math.abs(i)) {
			r = i;
			var a = s / 4
		} else var a = s / (2 * Math.PI) * Math.asin(i / r);
		return r * Math.pow(2, -10 * t) * Math.sin((t * o - a) * (2 * Math.PI) / s) + i + n
	},
	easeInOutElastic: function(e, t, n, i, o) {
		var a = 1.70158,
			s = 0,
			r = i;
		if(0 == t) return n;
		if(2 == (t /= o / 2)) return n + i;
		if(s || (s = o * (.3 * 1.5)), r < Math.abs(i)) {
			r = i;
			var a = s / 4
		} else var a = s / (2 * Math.PI) * Math.asin(i / r);
		return t < 1 ? -.5 * (r * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * o - a) * (2 * Math.PI) / s)) + n : r * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * o - a) * (2 * Math.PI) / s) * .5 + i + n
	},
	easeInBack: function(e, t, n, i, o, a) {
		return void 0 == a && (a = 1.70158), i * (t /= o) * t * ((a + 1) * t - a) + n
	},
	easeOutBack: function(e, t, n, i, o, a) {
		return void 0 == a && (a = 1.70158), i * ((t = t / o - 1) * t * ((a + 1) * t + a) + 1) + n
	},
	easeInOutBack: function(e, t, n, i, o, a) {
		return void 0 == a && (a = 1.70158), (t /= o / 2) < 1 ? i / 2 * (t * t * (((a *= 1.525) + 1) * t - a)) + n : i / 2 * ((t -= 2) * t * (((a *= 1.525) + 1) * t + a) + 2) + n
	},
	easeInBounce: function(e, t, n, i, o) {
		return i - jQuery.easing.easeOutBounce(e, o - t, 0, i, o) + n
	},
	easeOutBounce: function(e, t, n, i, o) {
		return(t /= o) < 1 / 2.75 ? i * (7.5625 * t * t) + n : t < 2 / 2.75 ? i * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + n : t < 2.5 / 2.75 ? i * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + n : i * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + n
	},
	easeInOutBounce: function(e, t, n, i, o) {
		return t < o / 2 ? .5 * jQuery.easing.easeInBounce(e, 2 * t, 0, i, o) + n : .5 * jQuery.easing.easeOutBounce(e, 2 * t - o, 0, i, o) + .5 * i + n
	}
}), jQuery.extend({
	browser: function() {
		var e = {},
			t = window.navigator.userAgent,
			n = uaMatch(t);
		return n.browser && (e[n.browser] = !0, e.version = n.version), {
			browser: e
		}
	}
}), ! function(e) {
	"function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? module.exports = e : e(jQuery)
}(function(e) {
	function t(t) {
		var s = t || window.event,
			r = l.call(arguments, 1),
			c = 0,
			u = 0,
			p = 0,
			h = 0,
			f = 0,
			m = 0;
		if(t = e.event.fix(s), t.type = "mousewheel", "detail" in s && (p = -1 * s.detail), "wheelDelta" in s && (p = s.wheelDelta), "wheelDeltaY" in s && (p = s.wheelDeltaY), "wheelDeltaX" in s && (u = -1 * s.wheelDeltaX), "axis" in s && s.axis === s.HORIZONTAL_AXIS && (u = -1 * p, p = 0), c = 0 === p ? u : p, "deltaY" in s && (p = -1 * s.deltaY, c = p), "deltaX" in s && (u = s.deltaX, 0 === p && (c = -1 * u)), 0 !== p || 0 !== u) {
			if(1 === s.deltaMode) {
				var g = e.data(this, "mousewheel-line-height");
				c *= g, p *= g, u *= g
			} else if(2 === s.deltaMode) {
				var v = e.data(this, "mousewheel-page-height");
				c *= v, p *= v, u *= v
			}
			if(h = Math.max(Math.abs(p), Math.abs(u)), (!a || a > h) && (a = h, i(s, h) && (a /= 40)), i(s, h) && (c /= 40, u /= 40, p /= 40), c = Math[c >= 1 ? "floor" : "ceil"](c / a), u = Math[u >= 1 ? "floor" : "ceil"](u / a), p = Math[p >= 1 ? "floor" : "ceil"](p / a), d.settings.normalizeOffset && this.getBoundingClientRect) {
				var b = this.getBoundingClientRect();
				f = t.clientX - b.left, m = t.clientY - b.top
			}
			return t.deltaX = u, t.deltaY = p, t.deltaFactor = a, t.offsetX = f, t.offsetY = m, t.deltaMode = 0, r.unshift(t, c, u, p), o && clearTimeout(o), o = setTimeout(n, 200), (e.event.dispatch || e.event.handle).apply(this, r)
		}
	}

	function n() {
		a = null
	}

	function i(e, t) {
		return d.settings.adjustOldDeltas && "mousewheel" === e.type && t % 120 === 0
	}
	var o, a, s = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
		r = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
		l = Array.prototype.slice;
	if(e.event.fixHooks)
		for(var c = s.length; c;) e.event.fixHooks[s[--c]] = e.event.mouseHooks;
	var d = e.event.special.mousewheel = {
		version: "3.1.12",
		setup: function() {
			if(this.addEventListener)
				for(var n = r.length; n;) this.addEventListener(r[--n], t, !1);
			else this.onmousewheel = t;
			e.data(this, "mousewheel-line-height", d.getLineHeight(this)), e.data(this, "mousewheel-page-height", d.getPageHeight(this))
		},
		teardown: function() {
			if(this.removeEventListener)
				for(var n = r.length; n;) this.removeEventListener(r[--n], t, !1);
			else this.onmousewheel = null;
			e.removeData(this, "mousewheel-line-height"), e.removeData(this, "mousewheel-page-height")
		},
		getLineHeight: function(t) {
			var n = e(t),
				i = n["offsetParent" in e.fn ? "offsetParent" : "parent"]();
			return i.length || (i = e("body")), parseInt(i.css("fontSize"), 10) || parseInt(n.css("fontSize"), 10) || 16
		},
		getPageHeight: function(t) {
			return e(t).height()
		},
		settings: {
			adjustOldDeltas: !0,
			normalizeOffset: !0
		}
	};
	e.fn.extend({
		mousewheel: function(e) {
			return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
		},
		unmousewheel: function(e) {
			return this.unbind("mousewheel", e)
		}
	})
}), ! function(e) {
	"function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? module.exports = e : e(jQuery)
}(function(e) {
	function t(t) {
		var s = t || window.event,
			r = l.call(arguments, 1),
			c = 0,
			u = 0,
			p = 0,
			h = 0,
			f = 0,
			m = 0;
		if(t = e.event.fix(s), t.type = "mousewheel", "detail" in s && (p = -1 * s.detail), "wheelDelta" in s && (p = s.wheelDelta), "wheelDeltaY" in s && (p = s.wheelDeltaY), "wheelDeltaX" in s && (u = -1 * s.wheelDeltaX), "axis" in s && s.axis === s.HORIZONTAL_AXIS && (u = -1 * p, p = 0), c = 0 === p ? u : p, "deltaY" in s && (p = -1 * s.deltaY, c = p), "deltaX" in s && (u = s.deltaX, 0 === p && (c = -1 * u)), 0 !== p || 0 !== u) {
			if(1 === s.deltaMode) {
				var g = e.data(this, "mousewheel-line-height");
				c *= g, p *= g, u *= g
			} else if(2 === s.deltaMode) {
				var v = e.data(this, "mousewheel-page-height");
				c *= v, p *= v, u *= v
			}
			if(h = Math.max(Math.abs(p), Math.abs(u)), (!a || a > h) && (a = h, i(s, h) && (a /= 40)), i(s, h) && (c /= 40, u /= 40, p /= 40), c = Math[c >= 1 ? "floor" : "ceil"](c / a), u = Math[u >= 1 ? "floor" : "ceil"](u / a), p = Math[p >= 1 ? "floor" : "ceil"](p / a), d.settings.normalizeOffset && this.getBoundingClientRect) {
				var b = this.getBoundingClientRect();
				f = t.clientX - b.left, m = t.clientY - b.top
			}
			return t.deltaX = u, t.deltaY = p, t.deltaFactor = a, t.offsetX = f, t.offsetY = m, t.deltaMode = 0, r.unshift(t, c, u, p), o && clearTimeout(o), o = setTimeout(n, 200), (e.event.dispatch || e.event.handle).apply(this, r)
		}
	}

	function n() {
		a = null
	}

	function i(e, t) {
		return d.settings.adjustOldDeltas && "mousewheel" === e.type && t % 120 === 0
	}
	var o, a, s = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
		r = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
		l = Array.prototype.slice;
	if(e.event.fixHooks)
		for(var c = s.length; c;) e.event.fixHooks[s[--c]] = e.event.mouseHooks;
	var d = e.event.special.mousewheel = {
		version: "3.1.12",
		setup: function() {
			if(this.addEventListener)
				for(var n = r.length; n;) this.addEventListener(r[--n], t, !1);
			else this.onmousewheel = t;
			e.data(this, "mousewheel-line-height", d.getLineHeight(this)), e.data(this, "mousewheel-page-height", d.getPageHeight(this))
		},
		teardown: function() {
			if(this.removeEventListener)
				for(var n = r.length; n;) this.removeEventListener(r[--n], t, !1);
			else this.onmousewheel = null;
			e.removeData(this, "mousewheel-line-height"), e.removeData(this, "mousewheel-page-height")
		},
		getLineHeight: function(t) {
			var n = e(t),
				i = n["offsetParent" in e.fn ? "offsetParent" : "parent"]();
			return i.length || (i = e("body")), parseInt(i.css("fontSize"), 10) || parseInt(n.css("fontSize"), 10) || 16
		},
		getPageHeight: function(t) {
			return e(t).height()
		},
		settings: {
			adjustOldDeltas: !0,
			normalizeOffset: !0
		}
	};
	e.fn.extend({
		mousewheel: function(e) {
			return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
		},
		unmousewheel: function(e) {
			return this.unbind("mousewheel", e)
		}
	})
}), ! function(e) {
	"undefined" != typeof module && module.exports ? module.exports = e : e(jQuery, window, document)
}(function(e) {
	! function(t) {
		var n = "function" == typeof define && define.amd,
			i = "undefined" != typeof module && module.exports,
			o = "https:" == document.location.protocol ? "https:" : "http:",
			a = "cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js";
		n || (i ? require("jquery-mousewheel")(e) : e.event.special.mousewheel || e("head").append(decodeURI("%3Cscript src=" + o + "//" + a + "%3E%3C/script%3E"))), t()
	}(function() {
		var t, n = "mCustomScrollbar",
			i = "mCS",
			o = ".mCustomScrollbar",
			a = {
				setTop: 0,
				setLeft: 0,
				axis: "y",
				scrollbarPosition: "inside",
				scrollInertia: 950,
				autoDraggerLength: !0,
				alwaysShowScrollbar: 0,
				snapOffset: 0,
				mouseWheel: {
					enable: !0,
					scrollAmount: "auto",
					axis: "y",
					deltaFactor: "auto",
					disableOver: ["select", "option", "keygen", "datalist", "textarea"]
				},
				scrollButtons: {
					scrollType: "stepless",
					scrollAmount: "auto"
				},
				keyboard: {
					enable: !0,
					scrollType: "stepless",
					scrollAmount: "auto"
				},
				contentTouchScroll: 25,
				documentTouchScroll: !0,
				advanced: {
					autoScrollOnFocus: "input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",
					updateOnContentResize: !0,
					updateOnImageLoad: "auto",
					autoUpdateTimeout: 60
				},
				theme: "light",
				callbacks: {
					onTotalScrollOffset: 0,
					onTotalScrollBackOffset: 0,
					alwaysTriggerOffsets: !0
				}
			},
			s = 0,
			r = {},
			l = window.attachEvent && !window.addEventListener ? 1 : 0,
			c = !1,
			d = ["mCSB_dragger_onDrag", "mCSB_scrollTools_onDrag", "mCS_img_loaded", "mCS_disabled", "mCS_destroyed", "mCS_no_scrollbar", "mCS-autoHide", "mCS-dir-rtl", "mCS_no_scrollbar_y", "mCS_no_scrollbar_x", "mCS_y_hidden", "mCS_x_hidden", "mCSB_draggerContainer", "mCSB_buttonUp", "mCSB_buttonDown", "mCSB_buttonLeft", "mCSB_buttonRight"],
			u = {
				init: function(t) {
					var t = e.extend(!0, {}, a, t),
						n = p.call(this);
					if(t.live) {
						var l = t.liveSelector || this.selector || o,
							c = e(l);
						if("off" === t.live) return void f(l);
						r[l] = setTimeout(function() {
							c.mCustomScrollbar(t), "once" === t.live && c.length && f(l)
						}, 500)
					} else f(l);
					return t.setWidth = t.set_width ? t.set_width : t.setWidth, t.setHeight = t.set_height ? t.set_height : t.setHeight, t.axis = t.horizontalScroll ? "x" : m(t.axis), t.scrollInertia = t.scrollInertia > 0 && t.scrollInertia < 17 ? 17 : t.scrollInertia, "object" != typeof t.mouseWheel && 1 == t.mouseWheel && (t.mouseWheel = {
						enable: !0,
						scrollAmount: "auto",
						axis: "y",
						preventDefault: !1,
						deltaFactor: "auto",
						normalizeDelta: !1,
						invert: !1
					}), t.mouseWheel.scrollAmount = t.mouseWheelPixels ? t.mouseWheelPixels : t.mouseWheel.scrollAmount, t.mouseWheel.normalizeDelta = t.advanced.normalizeMouseWheelDelta ? t.advanced.normalizeMouseWheelDelta : t.mouseWheel.normalizeDelta, t.scrollButtons.scrollType = g(t.scrollButtons.scrollType), h(t), e(n).each(function() {
						var n = e(this);
						if(!n.data(i)) {
							n.data(i, {
								idx: ++s,
								opt: t,
								scrollRatio: {
									y: null,
									x: null
								},
								overflowed: null,
								contentReset: {
									y: null,
									x: null
								},
								bindEvents: !1,
								tweenRunning: !1,
								sequential: {},
								langDir: n.css("direction"),
								cbOffsets: null,
								trigger: null,
								poll: {
									size: {
										o: 0,
										n: 0
									},
									img: {
										o: 0,
										n: 0
									},
									change: {
										o: 0,
										n: 0
									}
								}
							});
							var o = n.data(i),
								a = o.opt,
								r = n.data("mcs-axis"),
								l = n.data("mcs-scrollbar-position"),
								c = n.data("mcs-theme");
							r && (a.axis = r), l && (a.scrollbarPosition = l), c && (a.theme = c, h(a)), v.call(this), o && a.callbacks.onCreate && "function" == typeof a.callbacks.onCreate && a.callbacks.onCreate.call(this), e("#mCSB_" + o.idx + "_container img:not(." + d[2] + ")").addClass(d[2]), u.update.call(null, n)
						}
					})
				},
				update: function(t, n) {
					var o = t || p.call(this);
					return e(o).each(function() {
						var t = e(this);
						if(t.data(i)) {
							var o = t.data(i),
								a = o.opt,
								s = e("#mCSB_" + o.idx + "_container"),
								r = e("#mCSB_" + o.idx),
								l = [e("#mCSB_" + o.idx + "_dragger_vertical"), e("#mCSB_" + o.idx + "_dragger_horizontal")];
							if(!s.length) return;
							o.tweenRunning && Y(t), n && o && a.callbacks.onBeforeUpdate && "function" == typeof a.callbacks.onBeforeUpdate && a.callbacks.onBeforeUpdate.call(this), t.hasClass(d[3]) && t.removeClass(d[3]), t.hasClass(d[4]) && t.removeClass(d[4]), r.css("max-height", "none"), r.height() !== t.height() && r.css("max-height", t.height()), x.call(this), "y" === a.axis || a.advanced.autoExpandHorizontalScroll || s.css("width", b(s)), o.overflowed = C.call(this), E.call(this), a.autoDraggerLength && w.call(this), _.call(this), S.call(this);
							var c = [Math.abs(s[0].offsetTop), Math.abs(s[0].offsetLeft)];
							"x" !== a.axis && (o.overflowed[0] ? l[0].height() > l[0].parent().height() ? k.call(this) : (J(t, c[0].toString(), {
								dir: "y",
								dur: 0,
								overwrite: "none"
							}), o.contentReset.y = null) : (k.call(this), "y" === a.axis ? $.call(this) : "yx" === a.axis && o.overflowed[1] && J(t, c[1].toString(), {
								dir: "x",
								dur: 0,
								overwrite: "none"
							}))), "y" !== a.axis && (o.overflowed[1] ? l[1].width() > l[1].parent().width() ? k.call(this) : (J(t, c[1].toString(), {
								dir: "x",
								dur: 0,
								overwrite: "none"
							}), o.contentReset.x = null) : (k.call(this), "x" === a.axis ? $.call(this) : "yx" === a.axis && o.overflowed[0] && J(t, c[0].toString(), {
								dir: "y",
								dur: 0,
								overwrite: "none"
							}))), n && o && (2 === n && a.callbacks.onImageLoad && "function" == typeof a.callbacks.onImageLoad ? a.callbacks.onImageLoad.call(this) : 3 === n && a.callbacks.onSelectorChange && "function" == typeof a.callbacks.onSelectorChange ? a.callbacks.onSelectorChange.call(this) : a.callbacks.onUpdate && "function" == typeof a.callbacks.onUpdate && a.callbacks.onUpdate.call(this)), W.call(this)
						}
					})
				},
				scrollTo: function(t, n) {
					if("undefined" != typeof t && null != t) {
						var o = p.call(this);
						return e(o).each(function() {
							var o = e(this);
							if(o.data(i)) {
								var a = o.data(i),
									s = a.opt,
									r = {
										trigger: "external",
										scrollInertia: s.scrollInertia,
										scrollEasing: "mcsEaseInOut",
										moveDragger: !1,
										timeout: 60,
										callbacks: !0,
										onStart: !0,
										onUpdate: !0,
										onComplete: !0
									},
									l = e.extend(!0, {}, r, n),
									c = F.call(this, t),
									d = l.scrollInertia > 0 && l.scrollInertia < 17 ? 17 : l.scrollInertia;
								c[0] = U.call(this, c[0], "y"), c[1] = U.call(this, c[1], "x"), l.moveDragger && (c[0] *= a.scrollRatio.y, c[1] *= a.scrollRatio.x), l.dur = ne() ? 0 : d, setTimeout(function() {
									null !== c[0] && "undefined" != typeof c[0] && "x" !== s.axis && a.overflowed[0] && (l.dir = "y", l.overwrite = "all", J(o, c[0].toString(), l)), null !== c[1] && "undefined" != typeof c[1] && "y" !== s.axis && a.overflowed[1] && (l.dir = "x", l.overwrite = "none", J(o, c[1].toString(), l))
								}, l.timeout)
							}
						})
					}
				},
				stop: function() {
					var t = p.call(this);
					return e(t).each(function() {
						var t = e(this);
						t.data(i) && Y(t)
					})
				},
				disable: function(t) {
					var n = p.call(this);
					return e(n).each(function() {
						var n = e(this);
						n.data(i) && (n.data(i), W.call(this, "remove"), $.call(this), t && k.call(this), E.call(this, !0), n.addClass(d[3]))
					})
				},
				destroy: function() {
					var t = p.call(this);
					return e(t).each(function() {
						var o = e(this);
						if(o.data(i)) {
							var a = o.data(i),
								s = a.opt,
								r = e("#mCSB_" + a.idx),
								l = e("#mCSB_" + a.idx + "_container"),
								c = e(".mCSB_" + a.idx + "_scrollbar");
							s.live && f(s.liveSelector || e(t).selector), W.call(this, "remove"), $.call(this), k.call(this), o.removeData(i), Z(this, "mcs"), c.remove(), l.find("img." + d[2]).removeClass(d[2]), r.replaceWith(l.contents()), o.removeClass(n + " _" + i + "_" + a.idx + " " + d[6] + " " + d[7] + " " + d[5] + " " + d[3]).addClass(d[4])
						}
					})
				}
			},
			p = function() {
				return "object" != typeof e(this) || e(this).length < 1 ? o : this
			},
			h = function(t) {
				var n = ["rounded", "rounded-dark", "rounded-dots", "rounded-dots-dark"],
					i = ["rounded-dots", "rounded-dots-dark", "3d", "3d-dark", "3d-thick", "3d-thick-dark", "inset", "inset-dark", "inset-2", "inset-2-dark", "inset-3", "inset-3-dark"],
					o = ["minimal", "minimal-dark"],
					a = ["minimal", "minimal-dark"],
					s = ["minimal", "minimal-dark"];
				t.autoDraggerLength = !(e.inArray(t.theme, n) > -1) && t.autoDraggerLength, t.autoExpandScrollbar = !(e.inArray(t.theme, i) > -1) && t.autoExpandScrollbar, t.scrollButtons.enable = !(e.inArray(t.theme, o) > -1) && t.scrollButtons.enable, t.autoHideScrollbar = e.inArray(t.theme, a) > -1 || t.autoHideScrollbar, t.scrollbarPosition = e.inArray(t.theme, s) > -1 ? "outside" : t.scrollbarPosition
			},
			f = function(e) {
				r[e] && (clearTimeout(r[e]), Z(r, e))
			},
			m = function(e) {
				return "yx" === e || "xy" === e || "auto" === e ? "yx" : "x" === e || "horizontal" === e ? "x" : "y"
			},
			g = function(e) {
				return "stepped" === e || "pixels" === e || "step" === e || "click" === e ? "stepped" : "stepless"
			},
			v = function() {
				var t = e(this),
					o = t.data(i),
					a = o.opt,
					s = a.autoExpandScrollbar ? " " + d[1] + "_expand" : "",
					r = ["<div id='mCSB_" + o.idx + "_scrollbar_vertical' class='mCSB_scrollTools mCSB_" + o.idx + "_scrollbar mCS-" + a.theme + " mCSB_scrollTools_vertical" + s + "'><div class='" + d[12] + "'><div id='mCSB_" + o.idx + "_dragger_vertical' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>", "<div id='mCSB_" + o.idx + "_scrollbar_horizontal' class='mCSB_scrollTools mCSB_" + o.idx + "_scrollbar mCS-" + a.theme + " mCSB_scrollTools_horizontal" + s + "'><div class='" + d[12] + "'><div id='mCSB_" + o.idx + "_dragger_horizontal' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],
					l = "yx" === a.axis ? "mCSB_vertical_horizontal" : "x" === a.axis ? "mCSB_horizontal" : "mCSB_vertical",
					c = "yx" === a.axis ? r[0] + r[1] : "x" === a.axis ? r[1] : r[0],
					u = "yx" === a.axis ? "<div id='mCSB_" + o.idx + "_container_wrapper' class='mCSB_container_wrapper' />" : "",
					p = a.autoHideScrollbar ? " " + d[6] : "",
					h = "x" !== a.axis && "rtl" === o.langDir ? " " + d[7] : "";
				a.setWidth && t.css("width", a.setWidth), a.setHeight && t.css("height", a.setHeight), a.setLeft = "y" !== a.axis && "rtl" === o.langDir ? "989999px" : a.setLeft, t.addClass(n + " _" + i + "_" + o.idx + p + h).wrapInner("<div id='mCSB_" + o.idx + "' class='mCustomScrollBox mCS-" + a.theme + " " + l + "'><div id='mCSB_" + o.idx + "_container' class='mCSB_container' style='position:relative; top:" + a.setTop + "; left:" + a.setLeft + ";' dir=" + o.langDir + " /></div>");
				var f = e("#mCSB_" + o.idx),
					m = e("#mCSB_" + o.idx + "_container");
				"y" === a.axis || a.advanced.autoExpandHorizontalScroll || m.css("width", b(m)), "outside" === a.scrollbarPosition ? ("static" === t.css("position") && t.css("position", "relative"), t.css("overflow", "visible"), f.addClass("mCSB_outside").after(c)) : (f.addClass("mCSB_inside").append(c), m.wrap(u)), y.call(this);
				var g = [e("#mCSB_" + o.idx + "_dragger_vertical"), e("#mCSB_" + o.idx + "_dragger_horizontal")];
				g[0].css("min-height", g[0].height()), g[1].css("min-width", g[1].width())
			},
			b = function(t) {
				var n = [t[0].scrollWidth, Math.max.apply(Math, t.children().map(function() {
						return e(this).outerWidth(!0)
					}).get())],
					i = t.parent().width();
				return n[0] > i ? n[0] : n[1] > i ? n[1] : "100%"
			},
			x = function() {
				var t = e(this),
					n = t.data(i),
					o = n.opt,
					a = e("#mCSB_" + n.idx + "_container");
				if(o.advanced.autoExpandHorizontalScroll && "y" !== o.axis) {
					a.css({
						width: "auto",
						"min-width": 0,
						"overflow-x": "scroll"
					});
					var s = Math.ceil(a[0].scrollWidth);
					3 === o.advanced.autoExpandHorizontalScroll || 2 !== o.advanced.autoExpandHorizontalScroll && s > a.parent().width() ? a.css({
						width: s,
						"min-width": "100%",
						"overflow-x": "inherit"
					}) : a.css({
						"overflow-x": "inherit",
						position: "absolute"
					}).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({
						width: Math.ceil(a[0].getBoundingClientRect().right + .4) - Math.floor(a[0].getBoundingClientRect().left),
						"min-width": "100%",
						position: "relative"
					}).unwrap()
				}
			},
			y = function() {
				var t = e(this),
					n = t.data(i),
					o = n.opt,
					a = e(".mCSB_" + n.idx + "_scrollbar:first"),
					s = ee(o.scrollButtons.tabindex) ? "tabindex='" + o.scrollButtons.tabindex + "'" : "",
					r = ["<a href='#' class='" + d[13] + "' oncontextmenu='return false;' " + s + " />", "<a href='#' class='" + d[14] + "' oncontextmenu='return false;' " + s + " />", "<a href='#' class='" + d[15] + "' oncontextmenu='return false;' " + s + " />", "<a href='#' class='" + d[16] + "' oncontextmenu='return false;' " + s + " />"],
					l = ["x" === o.axis ? r[2] : r[0], "x" === o.axis ? r[3] : r[1], r[2], r[3]];
				o.scrollButtons.enable && a.prepend(l[0]).append(l[1]).next(".mCSB_scrollTools").prepend(l[2]).append(l[3])
			},
			w = function() {
				var t = e(this),
					n = t.data(i),
					o = e("#mCSB_" + n.idx),
					a = e("#mCSB_" + n.idx + "_container"),
					s = [e("#mCSB_" + n.idx + "_dragger_vertical"), e("#mCSB_" + n.idx + "_dragger_horizontal")],
					r = [o.height() / a.outerHeight(!1), o.width() / a.outerWidth(!1)],
					c = [parseInt(s[0].css("min-height")), Math.round(r[0] * s[0].parent().height()), parseInt(s[1].css("min-width")), Math.round(r[1] * s[1].parent().width())],
					d = l && c[1] < c[0] ? c[0] : c[1],
					u = l && c[3] < c[2] ? c[2] : c[3];
				s[0].css({
					height: d,
					"max-height": s[0].parent().height() - 10
				}).find(".mCSB_dragger_bar").css({
					"line-height": c[0] + "px"
				}), s[1].css({
					width: u,
					"max-width": s[1].parent().width() - 10
				})
			},
			_ = function() {
				var t = e(this),
					n = t.data(i),
					o = e("#mCSB_" + n.idx),
					a = e("#mCSB_" + n.idx + "_container"),
					s = [e("#mCSB_" + n.idx + "_dragger_vertical"), e("#mCSB_" + n.idx + "_dragger_horizontal")],
					r = [a.outerHeight(!1) - o.height(), a.outerWidth(!1) - o.width()],
					l = [r[0] / (s[0].parent().height() - s[0].height()), r[1] / (s[1].parent().width() - s[1].width())];
				n.scrollRatio = {
					y: l[0],
					x: l[1]
				}
			},
			T = function(e, t, n) {
				var i = n ? d[0] + "_expanded" : "",
					o = e.closest(".mCSB_scrollTools");
				"active" === t ? (e.toggleClass(d[0] + " " + i), o.toggleClass(d[1]), e[0]._draggable = e[0]._draggable ? 0 : 1) : e[0]._draggable || ("hide" === t ? (e.removeClass(d[0]), o.removeClass(d[1])) : (e.addClass(d[0]), o.addClass(d[1])))
			},
			C = function() {
				var t = e(this),
					n = t.data(i),
					o = e("#mCSB_" + n.idx),
					a = e("#mCSB_" + n.idx + "_container"),
					s = null == n.overflowed ? a.height() : a.outerHeight(!1),
					r = null == n.overflowed ? a.width() : a.outerWidth(!1),
					l = a[0].scrollHeight,
					c = a[0].scrollWidth;
				return l > s && (s = l), c > r && (r = c), [s > o.height(), r > o.width()]
			},
			k = function() {
				var t = e(this),
					n = t.data(i),
					o = n.opt,
					a = e("#mCSB_" + n.idx),
					s = e("#mCSB_" + n.idx + "_container"),
					r = [e("#mCSB_" + n.idx + "_dragger_vertical"), e("#mCSB_" + n.idx + "_dragger_horizontal")];
				if(Y(t), ("x" !== o.axis && !n.overflowed[0] || "y" === o.axis && n.overflowed[0]) && (r[0].add(s).css("top", 0), J(t, "_resetY")), "y" !== o.axis && !n.overflowed[1] || "x" === o.axis && n.overflowed[1]) {
					var l = dx = 0;
					"rtl" === n.langDir && (l = a.width() - s.outerWidth(!1), dx = Math.abs(l / n.scrollRatio.x)), s.css("left", l), r[1].css("left", dx), J(t, "_resetX")
				}
			},
			S = function() {
				function t() {
					s = setTimeout(function() {
						e.event.special.mousewheel ? (clearTimeout(s), M.call(n[0])) : t()
					}, 100)
				}
				var n = e(this),
					o = n.data(i),
					a = o.opt;
				if(!o.bindEvents) {
					if(I.call(this), a.contentTouchScroll && O.call(this), P.call(this), a.mouseWheel.enable) {
						var s;
						t()
					}
					L.call(this), B.call(this), a.advanced.autoScrollOnFocus && D.call(this), a.scrollButtons.enable && H.call(this), a.keyboard.enable && R.call(this), o.bindEvents = !0
				}
			},
			$ = function() {
				var t = e(this),
					n = t.data(i),
					o = n.opt,
					a = i + "_" + n.idx,
					s = ".mCSB_" + n.idx + "_scrollbar",
					r = e("#mCSB_" + n.idx + ",#mCSB_" + n.idx + "_container,#mCSB_" + n.idx + "_container_wrapper," + s + " ." + d[12] + ",#mCSB_" + n.idx + "_dragger_vertical,#mCSB_" + n.idx + "_dragger_horizontal," + s + ">a"),
					l = e("#mCSB_" + n.idx + "_container");
				o.advanced.releaseDraggableSelectors && r.add(e(o.advanced.releaseDraggableSelectors)), o.advanced.extraDraggableSelectors && r.add(e(o.advanced.extraDraggableSelectors)), n.bindEvents && (e(document).add(e(!N() || top.document)).unbind("." + a), r.each(function() {
					e(this).unbind("." + a)
				}), clearTimeout(t[0]._focusTimeout), Z(t[0], "_focusTimeout"), clearTimeout(n.sequential.step), Z(n.sequential, "step"), clearTimeout(l[0].onCompleteTimeout), Z(l[0], "onCompleteTimeout"), n.bindEvents = !1)
			},
			E = function(t) {
				var n = e(this),
					o = n.data(i),
					a = o.opt,
					s = e("#mCSB_" + o.idx + "_container_wrapper"),
					r = s.length ? s : e("#mCSB_" + o.idx + "_container"),
					l = [e("#mCSB_" + o.idx + "_scrollbar_vertical"), e("#mCSB_" + o.idx + "_scrollbar_horizontal")],
					c = [l[0].find(".mCSB_dragger"), l[1].find(".mCSB_dragger")];
				"x" !== a.axis && (o.overflowed[0] && !t ? (l[0].add(c[0]).add(l[0].children("a")).css("display", "block"), r.removeClass(d[8] + " " + d[10])) : (a.alwaysShowScrollbar ? (2 !== a.alwaysShowScrollbar && c[0].css("display", "none"), r.removeClass(d[10])) : (l[0].css("display", "none"), r.addClass(d[10])), r.addClass(d[8]))), "y" !== a.axis && (o.overflowed[1] && !t ? (l[1].add(c[1]).add(l[1].children("a")).css("display", "block"), r.removeClass(d[9] + " " + d[11])) : (a.alwaysShowScrollbar ? (2 !== a.alwaysShowScrollbar && c[1].css("display", "none"), r.removeClass(d[11])) : (l[1].css("display", "none"), r.addClass(d[11])), r.addClass(d[9]))), o.overflowed[0] || o.overflowed[1] ? n.removeClass(d[5]) : n.addClass(d[5])
			},
			j = function(t) {
				var n = t.type,
					i = t.target.ownerDocument !== document ? [e(frameElement).offset().top, e(frameElement).offset().left] : null,
					o = N() && t.target.ownerDocument !== top.document ? [e(t.view.frameElement).offset().top, e(t.view.frameElement).offset().left] : [0, 0];
				switch(n) {
					case "pointerdown":
					case "MSPointerDown":
					case "pointermove":
					case "MSPointerMove":
					case "pointerup":
					case "MSPointerUp":
						return i ? [t.originalEvent.pageY - i[0] + o[0], t.originalEvent.pageX - i[1] + o[1], !1] : [t.originalEvent.pageY, t.originalEvent.pageX, !1];
					case "touchstart":
					case "touchmove":
					case "touchend":
						var a = t.originalEvent.touches[0] || t.originalEvent.changedTouches[0],
							s = t.originalEvent.touches.length || t.originalEvent.changedTouches.length;
						return t.target.ownerDocument !== document ? [a.screenY, a.screenX, s > 1] : [a.pageY, a.pageX, s > 1];
					default:
						return i ? [t.pageY - i[0] + o[0], t.pageX - i[1] + o[1], !1] : [t.pageY, t.pageX, !1]
				}
			},
			I = function() {
				function t(e) {
					var t = f.find("iframe");
					if(t.length) {
						var n = e ? "auto" : "none";
						t.css("pointer-events", n)
					}
				}

				function n(e, t, n, i) {
					if(f[0].idleTimer = u.scrollInertia < 233 ? 250 : 0, o.attr("id") === h[1]) var a = "x",
						s = (o[0].offsetLeft - t + i) * d.scrollRatio.x;
					else var a = "y",
						s = (o[0].offsetTop - e + n) * d.scrollRatio.y;
					J(r, s.toString(), {
						dir: a,
						drag: !0
					})
				}
				var o, a, s, r = e(this),
					d = r.data(i),
					u = d.opt,
					p = i + "_" + d.idx,
					h = ["mCSB_" + d.idx + "_dragger_vertical", "mCSB_" + d.idx + "_dragger_horizontal"],
					f = e("#mCSB_" + d.idx + "_container"),
					m = e("#" + h[0] + ",#" + h[1]),
					g = u.advanced.releaseDraggableSelectors ? m.add(e(u.advanced.releaseDraggableSelectors)) : m,
					v = u.advanced.extraDraggableSelectors ? e(!N() || top.document).add(e(u.advanced.extraDraggableSelectors)) : e(!N() || top.document);
				m.bind("mousedown." + p + " touchstart." + p + " pointerdown." + p + " MSPointerDown." + p, function(n) {
					if(n.stopImmediatePropagation(), n.preventDefault(), Q(n)) {
						c = !0, l && (document.onselectstart = function() {
							return !1
						}), t(!1), Y(r), o = e(this);
						var i = o.offset(),
							d = j(n)[0] - i.top,
							p = j(n)[1] - i.left,
							h = o.height() + i.top,
							f = o.width() + i.left;
						h > d && d > 0 && f > p && p > 0 && (a = d, s = p), T(o, "active", u.autoExpandScrollbar)
					}
				}).bind("touchmove." + p, function(e) {
					e.stopImmediatePropagation(), e.preventDefault();
					var t = o.offset(),
						i = j(e)[0] - t.top,
						r = j(e)[1] - t.left;
					n(a, s, i, r)
				}), e(document).add(v).bind("mousemove." + p + " pointermove." + p + " MSPointerMove." + p, function(e) {
					if(o) {
						var t = o.offset(),
							i = j(e)[0] - t.top,
							r = j(e)[1] - t.left;
						if(a === i && s === r) return;
						n(a, s, i, r)
					}
				}).add(g).bind("mouseup." + p + " touchend." + p + " pointerup." + p + " MSPointerUp." + p, function(e) {
					o && (T(o, "active", u.autoExpandScrollbar), o = null), c = !1, l && (document.onselectstart = null), t(!0)
				})
			},
			O = function() {
				function n(e) {
					if(!K(e) || c || j(e)[2]) return void(t = 0);
					t = 1, _ = 0, T = 0, d = 1, C.removeClass("mCS_touch_action");
					var n = I.offset();
					u = j(e)[0] - n.top, p = j(e)[1] - n.left, D = [j(e)[0], j(e)[1]]
				}

				function o(e) {
					if(K(e) && !c && !j(e)[2] && (S.documentTouchScroll || e.preventDefault(), e.stopImmediatePropagation(), (!T || _) && d)) {
						g = X();
						var t = E.offset(),
							n = j(e)[0] - t.top,
							i = j(e)[1] - t.left,
							o = "mcsLinearOut";
						if(P.push(n), M.push(i), D[2] = Math.abs(j(e)[0] - D[0]), D[3] = Math.abs(j(e)[1] - D[1]), k.overflowed[0]) var a = O[0].parent().height() - O[0].height(),
							s = u - n > 0 && n - u > -(a * k.scrollRatio.y) && (2 * D[3] < D[2] || "yx" === S.axis);
						if(k.overflowed[1]) var r = O[1].parent().width() - O[1].width(),
							h = p - i > 0 && i - p > -(r * k.scrollRatio.x) && (2 * D[2] < D[3] || "yx" === S.axis);
						s || h ? (R || e.preventDefault(), _ = 1) : (T = 1, C.addClass("mCS_touch_action")), R && e.preventDefault(), y = "yx" === S.axis ? [u - n, p - i] : "x" === S.axis ? [null, p - i] : [u - n, null], I[0].idleTimer = 250, k.overflowed[0] && l(y[0], A, o, "y", "all", !0), k.overflowed[1] && l(y[1], A, o, "x", L, !0)
					}
				}

				function a(e) {
					if(!K(e) || c || j(e)[2]) return void(t = 0);
					t = 1, e.stopImmediatePropagation(), Y(C), m = X();
					var n = E.offset();
					h = j(e)[0] - n.top, f = j(e)[1] - n.left, P = [], M = []
				}

				function s(e) {
					if(K(e) && !c && !j(e)[2]) {
						d = 0, e.stopImmediatePropagation(), _ = 0, T = 0, v = X();
						var t = E.offset(),
							n = j(e)[0] - t.top,
							i = j(e)[1] - t.left;
						if(!(v - g > 30)) {
							x = 1e3 / (v - m);
							var o = "mcsEaseOut",
								a = 2.5 > x,
								s = a ? [P[P.length - 2], M[M.length - 2]] : [0, 0];
							b = a ? [n - s[0], i - s[1]] : [n - h, i - f];
							var u = [Math.abs(b[0]), Math.abs(b[1])];
							x = a ? [Math.abs(b[0] / 4), Math.abs(b[1] / 4)] : [x, x];
							var p = [Math.abs(I[0].offsetTop) - b[0] * r(u[0] / x[0], x[0]), Math.abs(I[0].offsetLeft) - b[1] * r(u[1] / x[1], x[1])];
							y = "yx" === S.axis ? [p[0], p[1]] : "x" === S.axis ? [null, p[1]] : [p[0], null], w = [4 * u[0] + S.scrollInertia, 4 * u[1] + S.scrollInertia];
							var C = parseInt(S.contentTouchScroll) || 0;
							y[0] = u[0] > C ? y[0] : 0, y[1] = u[1] > C ? y[1] : 0, k.overflowed[0] && l(y[0], w[0], o, "y", L, !1), k.overflowed[1] && l(y[1], w[1], o, "x", L, !1)
						}
					}
				}

				function r(e, t) {
					var n = [1.5 * t, 2 * t, t / 1.5, t / 2];
					return e > 90 ? t > 4 ? n[0] : n[3] : e > 60 ? t > 3 ? n[3] : n[2] : e > 30 ? t > 8 ? n[1] : t > 6 ? n[0] : t > 4 ? t : n[2] : t > 8 ? t : n[3]
				}

				function l(e, t, n, i, o, a) {
					e && J(C, e.toString(), {
						dur: t,
						scrollEasing: n,
						dir: i,
						overwrite: o,
						drag: a
					})
				}
				var d, u, p, h, f, m, g, v, b, x, y, w, _, T, C = e(this),
					k = C.data(i),
					S = k.opt,
					$ = i + "_" + k.idx,
					E = e("#mCSB_" + k.idx),
					I = e("#mCSB_" + k.idx + "_container"),
					O = [e("#mCSB_" + k.idx + "_dragger_vertical"), e("#mCSB_" + k.idx + "_dragger_horizontal")],
					P = [],
					M = [],
					A = 0,
					L = "yx" === S.axis ? "none" : "all",
					D = [],
					B = I.find("iframe"),
					H = ["touchstart." + $ + " pointerdown." + $ + " MSPointerDown." + $, "touchmove." + $ + " pointermove." + $ + " MSPointerMove." + $, "touchend." + $ + " pointerup." + $ + " MSPointerUp." + $],
					R = void 0 !== document.body.style.touchAction;
				I.bind(H[0], function(e) {
					n(e)
				}).bind(H[1], function(e) {
					o(e)
				}), E.bind(H[0], function(e) {
					a(e)
				}).bind(H[2], function(e) {
					s(e)
				}), B.length && B.each(function() {
					e(this).load(function() {
						N(this) && e(this.contentDocument || this.contentWindow.document).bind(H[0], function(e) {
							n(e), a(e)
						}).bind(H[1], function(e) {
							o(e)
						}).bind(H[2], function(e) {
							s(e)
						})
					})
				})
			},
			P = function() {
				function n() {
					return window.getSelection ? window.getSelection().toString() : document.selection && "Control" != document.selection.type ? document.selection.createRange().text : 0
				}

				function o(e, t, n) {
					d.type = n && a ? "stepped" : "stepless", d.scrollAmount = 10, z(s, e, t, "mcsLinearOut", n ? 60 : null)
				}
				var a, s = e(this),
					r = s.data(i),
					l = r.opt,
					d = r.sequential,
					u = i + "_" + r.idx,
					p = e("#mCSB_" + r.idx + "_container"),
					h = p.parent();
				p.bind("mousedown." + u, function(e) {
					t || a || (a = 1, c = !0)
				}).add(document).bind("mousemove." + u, function(e) {
					if(!t && a && n()) {
						var i = p.offset(),
							s = j(e)[0] - i.top + p[0].offsetTop,
							c = j(e)[1] - i.left + p[0].offsetLeft;
						s > 0 && s < h.height() && c > 0 && c < h.width() ? d.step && o("off", null, "stepped") : ("x" !== l.axis && r.overflowed[0] && (0 > s ? o("on", 38) : s > h.height() && o("on", 40)), "y" !== l.axis && r.overflowed[1] && (0 > c ? o("on", 37) : c > h.width() && o("on", 39)))
					}
				}).bind("mouseup." + u + " dragend." + u, function(e) {
					t || (a && (a = 0, o("off", null)), c = !1)
				})
			},
			M = function() {
				function t(t, i) {
					if(Y(n), !A(n, t.target)) {
						var s = "auto" !== a.mouseWheel.deltaFactor ? parseInt(a.mouseWheel.deltaFactor) : l && t.deltaFactor < 100 ? 100 : t.deltaFactor || 100,
							d = a.scrollInertia;
						if("x" === a.axis || "x" === a.mouseWheel.axis) var u = "x",
							p = [Math.round(s * o.scrollRatio.x), parseInt(a.mouseWheel.scrollAmount)],
							h = "auto" !== a.mouseWheel.scrollAmount ? p[1] : p[0] >= r.width() ? .9 * r.width() : p[0],
							f = Math.abs(e("#mCSB_" + o.idx + "_container")[0].offsetLeft),
							m = c[1][0].offsetLeft,
							g = c[1].parent().width() - c[1].width(),
							v = t.deltaX || t.deltaY || i;
						else var u = "y",
							p = [Math.round(s * o.scrollRatio.y), parseInt(a.mouseWheel.scrollAmount)],
							h = "auto" !== a.mouseWheel.scrollAmount ? p[1] : p[0] >= r.height() ? .9 * r.height() : p[0],
							f = Math.abs(e("#mCSB_" + o.idx + "_container")[0].offsetTop),
							m = c[0][0].offsetTop,
							g = c[0].parent().height() - c[0].height(),
							v = t.deltaY || i;
						"y" === u && !o.overflowed[0] || "x" === u && !o.overflowed[1] || ((a.mouseWheel.invert || t.webkitDirectionInvertedFromDevice) && (v = -v), a.mouseWheel.normalizeDelta && (v = 0 > v ? -1 : 1), (v > 0 && 0 !== m || 0 > v && m !== g || a.mouseWheel.preventDefault) && (t.stopImmediatePropagation(), t.preventDefault()), t.deltaFactor < 2 && !a.mouseWheel.normalizeDelta && (h = t.deltaFactor, d = 17), J(n, (f - v * h).toString(), {
							dir: u,
							dur: d
						}))
					}
				}
				if(e(this).data(i)) {
					var n = e(this),
						o = n.data(i),
						a = o.opt,
						s = i + "_" + o.idx,
						r = e("#mCSB_" + o.idx),
						c = [e("#mCSB_" + o.idx + "_dragger_vertical"), e("#mCSB_" + o.idx + "_dragger_horizontal")],
						d = e("#mCSB_" + o.idx + "_container").find("iframe");
					d.length && d.each(function() {
						e(this).load(function() {
							N(this) && e(this.contentDocument || this.contentWindow.document).bind("mousewheel." + s, function(e, n) {
								t(e, n)
							})
						})
					}), r.bind("mousewheel." + s, function(e, n) {
						t(e, n)
					})
				}
			},
			N = function(e) {
				var t = null;
				if(e) {
					try {
						var n = e.contentDocument || e.contentWindow.document;
						t = n.body.innerHTML
					} catch(i) {}
					return null !== t
				}
				try {
					var n = top.document;
					t = n.body.innerHTML
				} catch(i) {}
				return null !== t
			},
			A = function(t, n) {
				var o = n.nodeName.toLowerCase(),
					a = t.data(i).opt.mouseWheel.disableOver,
					s = ["select", "textarea"];
				return e.inArray(o, a) > -1 && !(e.inArray(o, s) > -1 && !e(n).is(":focus"))
			},
			L = function() {
				var t, n = e(this),
					o = n.data(i),
					a = i + "_" + o.idx,
					s = e("#mCSB_" + o.idx + "_container"),
					r = s.parent(),
					l = e(".mCSB_" + o.idx + "_scrollbar ." + d[12]);
				l.bind("mousedown." + a + " touchstart." + a + " pointerdown." + a + " MSPointerDown." + a, function(n) {
					c = !0, e(n.target).hasClass("mCSB_dragger") || (t = 1)
				}).bind("touchend." + a + " pointerup." + a + " MSPointerUp." + a, function(e) {
					c = !1
				}).bind("click." + a, function(i) {
					if(t && (t = 0, e(i.target).hasClass(d[12]) || e(i.target).hasClass("mCSB_draggerRail"))) {
						Y(n);
						var a = e(this),
							l = a.find(".mCSB_dragger");
						if(a.parent(".mCSB_scrollTools_horizontal").length > 0) {
							if(!o.overflowed[1]) return;
							var c = "x",
								u = i.pageX > l.offset().left ? -1 : 1,
								p = Math.abs(s[0].offsetLeft) - .9 * u * r.width()
						} else {
							if(!o.overflowed[0]) return;
							var c = "y",
								u = i.pageY > l.offset().top ? -1 : 1,
								p = Math.abs(s[0].offsetTop) - .9 * u * r.height()
						}
						J(n, p.toString(), {
							dir: c,
							scrollEasing: "mcsEaseInOut"
						})
					}
				})
			},
			D = function() {
				var t = e(this),
					n = t.data(i),
					o = n.opt,
					a = i + "_" + n.idx,
					s = e("#mCSB_" + n.idx + "_container"),
					r = s.parent();
				s.bind("focusin." + a, function(n) {
					var i = e(document.activeElement),
						a = s.find(".mCustomScrollBox").length,
						l = 0;
					i.is(o.advanced.autoScrollOnFocus) && (Y(t), clearTimeout(t[0]._focusTimeout), t[0]._focusTimer = a ? (l + 17) * a : 0, t[0]._focusTimeout = setTimeout(function() {
						var e = [te(i)[0], te(i)[1]],
							n = [s[0].offsetTop, s[0].offsetLeft],
							a = [n[0] + e[0] >= 0 && n[0] + e[0] < r.height() - i.outerHeight(!1), n[1] + e[1] >= 0 && n[0] + e[1] < r.width() - i.outerWidth(!1)],
							c = "yx" !== o.axis || a[0] || a[1] ? "all" : "none";
						"x" === o.axis || a[0] || J(t, e[0].toString(), {
							dir: "y",
							scrollEasing: "mcsEaseInOut",
							overwrite: c,
							dur: l
						}), "y" === o.axis || a[1] || J(t, e[1].toString(), {
							dir: "x",
							scrollEasing: "mcsEaseInOut",
							overwrite: c,
							dur: l
						})
					}, t[0]._focusTimer))
				})
			},
			B = function() {
				var t = e(this),
					n = t.data(i),
					o = i + "_" + n.idx,
					a = e("#mCSB_" + n.idx + "_container").parent();
				a.bind("scroll." + o, function(t) {
					(0 !== a.scrollTop() || 0 !== a.scrollLeft()) && e(".mCSB_" + n.idx + "_scrollbar").css("visibility", "hidden")
				})
			},
			H = function() {
				var t = e(this),
					n = t.data(i),
					o = n.opt,
					a = n.sequential,
					s = i + "_" + n.idx,
					r = ".mCSB_" + n.idx + "_scrollbar",
					l = e(r + ">a");
				l.bind("mousedown." + s + " touchstart." + s + " pointerdown." + s + " MSPointerDown." + s + " mouseup." + s + " touchend." + s + " pointerup." + s + " MSPointerUp." + s + " mouseout." + s + " pointerout." + s + " MSPointerOut." + s + " click." + s, function(i) {
					function s(e, n) {
						a.scrollAmount = o.scrollButtons.scrollAmount, z(t, e, n)
					}
					if(i.preventDefault(), Q(i)) {
						var r = e(this).attr("class");
						switch(a.type = o.scrollButtons.scrollType, i.type) {
							case "mousedown":
							case "touchstart":
							case "pointerdown":
							case "MSPointerDown":
								if("stepped" === a.type) return;
								c = !0, n.tweenRunning = !1, s("on", r);
								break;
							case "mouseup":
							case "touchend":
							case "pointerup":
							case "MSPointerUp":
							case "mouseout":
							case "pointerout":
							case "MSPointerOut":
								if("stepped" === a.type) return;
								c = !1, a.dir && s("off", r);
								break;
							case "click":
								if("stepped" !== a.type || n.tweenRunning) return;
								s("on", r)
						}
					}
				})
			},
			R = function() {
				function t(t) {
					function i(e, t) {
						s.type = a.keyboard.scrollType, s.scrollAmount = a.keyboard.scrollAmount, "stepped" === s.type && o.tweenRunning || z(n, e, t)
					}
					switch(t.type) {
						case "blur":
							o.tweenRunning && s.dir && i("off", null);
							break;
						case "keydown":
						case "keyup":
							var r = t.keyCode ? t.keyCode : t.which,
								l = "on";
							if("x" !== a.axis && (38 === r || 40 === r) || "y" !== a.axis && (37 === r || 39 === r)) {
								if((38 === r || 40 === r) && !o.overflowed[0] || (37 === r || 39 === r) && !o.overflowed[1]) return;
								"keyup" === t.type && (l = "off"), e(document.activeElement).is(u) || (t.preventDefault(), t.stopImmediatePropagation(), i(l, r))
							} else if(33 === r || 34 === r) {
								if((o.overflowed[0] || o.overflowed[1]) && (t.preventDefault(), t.stopImmediatePropagation()), "keyup" === t.type) {
									Y(n);
									var p = 34 === r ? -1 : 1;
									if("x" === a.axis || "yx" === a.axis && o.overflowed[1] && !o.overflowed[0]) var h = "x",
										f = Math.abs(c[0].offsetLeft) - .9 * p * d.width();
									else var h = "y",
										f = Math.abs(c[0].offsetTop) - .9 * p * d.height();
									J(n, f.toString(), {
										dir: h,
										scrollEasing: "mcsEaseInOut"
									})
								}
							} else if((35 === r || 36 === r) && !e(document.activeElement).is(u) && ((o.overflowed[0] || o.overflowed[1]) && (t.preventDefault(), t.stopImmediatePropagation()), "keyup" === t.type)) {
								if("x" === a.axis || "yx" === a.axis && o.overflowed[1] && !o.overflowed[0]) var h = "x",
									f = 35 === r ? Math.abs(d.width() - c.outerWidth(!1)) : 0;
								else var h = "y",
									f = 35 === r ? Math.abs(d.height() - c.outerHeight(!1)) : 0;
								J(n, f.toString(), {
									dir: h,
									scrollEasing: "mcsEaseInOut"
								})
							}
					}
				}
				var n = e(this),
					o = n.data(i),
					a = o.opt,
					s = o.sequential,
					r = i + "_" + o.idx,
					l = e("#mCSB_" + o.idx),
					c = e("#mCSB_" + o.idx + "_container"),
					d = c.parent(),
					u = "input,textarea,select,datalist,keygen,[contenteditable='true']",
					p = c.find("iframe"),
					h = ["blur." + r + " keydown." + r + " keyup." + r];
				p.length && p.each(function() {
					e(this).load(function() {
						N(this) && e(this.contentDocument || this.contentWindow.document).bind(h[0], function(e) {
							t(e)
						})
					})
				}), l.attr("tabindex", "0").bind(h[0], function(e) {
					t(e)
				})
			},
			z = function(t, n, o, a, s) {
				function r(e) {
					u.snapAmount && (p.scrollAmount = u.snapAmount instanceof Array ? "x" === p.dir[0] ? u.snapAmount[1] : u.snapAmount[0] : u.snapAmount);
					var n = "stepped" !== p.type,
						i = s ? s : e ? n ? m / 1.5 : g : 1e3 / 60,
						o = e ? n ? 7.5 : 40 : 2.5,
						l = [Math.abs(h[0].offsetTop), Math.abs(h[0].offsetLeft)],
						d = [c.scrollRatio.y > 10 ? 10 : c.scrollRatio.y, c.scrollRatio.x > 10 ? 10 : c.scrollRatio.x],
						f = "x" === p.dir[0] ? l[1] + p.dir[1] * d[1] * o : l[0] + p.dir[1] * d[0] * o,
						v = "x" === p.dir[0] ? l[1] + p.dir[1] * parseInt(p.scrollAmount) : l[0] + p.dir[1] * parseInt(p.scrollAmount),
						b = "auto" !== p.scrollAmount ? v : f,
						x = a ? a : e ? n ? "mcsLinearOut" : "mcsEaseInOut" : "mcsLinear",
						y = !!e;
					return e && 17 > i && (b = "x" === p.dir[0] ? l[1] : l[0]), J(t, b.toString(), {
						dir: p.dir[0],
						scrollEasing: x,
						dur: i,
						onComplete: y
					}), e ? void(p.dir = !1) : (clearTimeout(p.step), void(p.step = setTimeout(function() {
						r()
					}, i)))
				}

				function l() {
					clearTimeout(p.step), Z(p, "step"), Y(t)
				}
				var c = t.data(i),
					u = c.opt,
					p = c.sequential,
					h = e("#mCSB_" + c.idx + "_container"),
					f = "stepped" === p.type,
					m = u.scrollInertia < 26 ? 26 : u.scrollInertia,
					g = u.scrollInertia < 1 ? 17 : u.scrollInertia;
				switch(n) {
					case "on":
						if(p.dir = [o === d[16] || o === d[15] || 39 === o || 37 === o ? "x" : "y", o === d[13] || o === d[15] || 38 === o || 37 === o ? -1 : 1], Y(t), ee(o) && "stepped" === p.type) return;
						r(f);
						break;
					case "off":
						l(), (f || c.tweenRunning && p.dir) && r(!0)
				}
			},
			F = function(t) {
				var n = e(this).data(i).opt,
					o = [];
				return "function" == typeof t && (t = t()), t instanceof Array ? o = t.length > 1 ? [t[0], t[1]] : "x" === n.axis ? [null, t[0]] : [t[0], null] : (o[0] = t.y ? t.y : t.x || "x" === n.axis ? null : t, o[1] = t.x ? t.x : t.y || "y" === n.axis ? null : t), "function" == typeof o[0] && (o[0] = o[0]()), "function" == typeof o[1] && (o[1] = o[1]()), o
			},
			U = function(t, n) {
				if(null != t && "undefined" != typeof t) {
					var o = e(this),
						a = o.data(i),
						s = a.opt,
						r = e("#mCSB_" + a.idx + "_container"),
						l = r.parent(),
						c = typeof t;
					n || (n = "x" === s.axis ? "x" : "y");
					var d = "x" === n ? r.outerWidth(!1) : r.outerHeight(!1),
						p = "x" === n ? r[0].offsetLeft : r[0].offsetTop,
						h = "x" === n ? "left" : "top";
					switch(c) {
						case "function":
							return t();
						case "object":
							var f = t.jquery ? t : e(t);
							if(!f.length) return;
							return "x" === n ? te(f)[1] : te(f)[0];
						case "string":
						case "number":
							if(ee(t)) return Math.abs(t);
							if(-1 !== t.indexOf("%")) return Math.abs(d * parseInt(t) / 100);
							if(-1 !== t.indexOf("-=")) return Math.abs(p - parseInt(t.split("-=")[1]));
							if(-1 !== t.indexOf("+=")) {
								var m = p + parseInt(t.split("+=")[1]);
								return m >= 0 ? 0 : Math.abs(m)
							}
							if(-1 !== t.indexOf("px") && ee(t.split("px")[0])) return Math.abs(t.split("px")[0]);
							if("top" === t || "left" === t) return 0;
							if("bottom" === t) return Math.abs(l.height() - r.outerHeight(!1));
							if("right" === t) return Math.abs(l.width() - r.outerWidth(!1));
							if("first" === t || "last" === t) {
								var f = r.find(":" + t);
								return "x" === n ? te(f)[1] : te(f)[0]
							}
							return e(t).length ? "x" === n ? te(e(t))[1] : te(e(t))[0] : (r.css(h, t), void u.update.call(null, o[0]))
					}
				}
			},
			W = function(t) {
				function n() {
					return clearTimeout(p[0].autoUpdate), 0 === r.parents("html").length ? void(r = null) : void(p[0].autoUpdate = setTimeout(function() {
						return c.advanced.updateOnSelectorChange && (l.poll.change.n = a(), l.poll.change.n !== l.poll.change.o) ? (l.poll.change.o = l.poll.change.n, void s(3)) : c.advanced.updateOnContentResize && (l.poll.size.n = r[0].scrollHeight + r[0].scrollWidth + p[0].offsetHeight + r[0].offsetHeight + r[0].offsetWidth, l.poll.size.n !== l.poll.size.o) ? (l.poll.size.o = l.poll.size.n, void s(1)) : !c.advanced.updateOnImageLoad || "auto" === c.advanced.updateOnImageLoad && "y" === c.axis || (l.poll.img.n = p.find("img").length, l.poll.img.n === l.poll.img.o) ? void((c.advanced.updateOnSelectorChange || c.advanced.updateOnContentResize || c.advanced.updateOnImageLoad) && n()) : (l.poll.img.o = l.poll.img.n, void p.find("img").each(function() {
							o(this)
						}))
					}, c.advanced.autoUpdateTimeout))
				}

				function o(t) {
					function n(e, t) {
						return function() {
							return t.apply(e, arguments)
						}
					}

					function i() {
						this.onload = null, e(t).addClass(d[2]), s(2)
					}
					if(e(t).hasClass(d[2])) return void s();
					var o = new Image;
					o.onload = n(o, i), o.src = t.src
				}

				function a() {
					c.advanced.updateOnSelectorChange === !0 && (c.advanced.updateOnSelectorChange = "*");
					var e = 0,
						t = p.find(c.advanced.updateOnSelectorChange);
					return c.advanced.updateOnSelectorChange && t.length > 0 && t.each(function() {
						e += this.offsetHeight + this.offsetWidth
					}), e
				}

				function s(e) {
					clearTimeout(p[0].autoUpdate), u.update.call(null, r[0], e)
				}
				var r = e(this),
					l = r.data(i),
					c = l.opt,
					p = e("#mCSB_" + l.idx + "_container");
				return t ? (clearTimeout(p[0].autoUpdate), void Z(p[0], "autoUpdate")) : void n()
			},
			q = function(e, t, n) {
				return Math.round(e / t) * t - n
			},
			Y = function(t) {
				var n = t.data(i),
					o = e("#mCSB_" + n.idx + "_container,#mCSB_" + n.idx + "_container_wrapper,#mCSB_" + n.idx + "_dragger_vertical,#mCSB_" + n.idx + "_dragger_horizontal");
				o.each(function() {
					V.call(this)
				})
			},
			J = function(t, n, o) {
				function a(e) {
					return l && c.callbacks[e] && "function" == typeof c.callbacks[e]
				}

				function s() {
					return [c.callbacks.alwaysTriggerOffsets || y >= w[0] + C, c.callbacks.alwaysTriggerOffsets || -k >= y]
				}

				function r() {
					var e = [h[0].offsetTop, h[0].offsetLeft],
						n = [b[0].offsetTop, b[0].offsetLeft],
						i = [h.outerHeight(!1), h.outerWidth(!1)],
						a = [p.height(), p.width()];
					t[0].mcs = {
						content: h,
						top: e[0],
						left: e[1],
						draggerTop: n[0],
						draggerLeft: n[1],
						topPct: Math.round(100 * Math.abs(e[0]) / (Math.abs(i[0]) - a[0])),
						leftPct: Math.round(100 * Math.abs(e[1]) / (Math.abs(i[1]) - a[1])),
						direction: o.dir
					}
				}
				var l = t.data(i),
					c = l.opt,
					d = {
						trigger: "internal",
						dir: "y",
						scrollEasing: "mcsEaseOut",
						drag: !1,
						dur: c.scrollInertia,
						overwrite: "all",
						callbacks: !0,
						onStart: !0,
						onUpdate: !0,
						onComplete: !0
					},
					o = e.extend(d, o),
					u = [o.dur, o.drag ? 0 : o.dur],
					p = e("#mCSB_" + l.idx),
					h = e("#mCSB_" + l.idx + "_container"),
					f = h.parent(),
					m = c.callbacks.onTotalScrollOffset ? F.call(t, c.callbacks.onTotalScrollOffset) : [0, 0],
					g = c.callbacks.onTotalScrollBackOffset ? F.call(t, c.callbacks.onTotalScrollBackOffset) : [0, 0];
				if(l.trigger = o.trigger, (0 !== f.scrollTop() || 0 !== f.scrollLeft()) && (e(".mCSB_" + l.idx + "_scrollbar").css("visibility", "visible"), f.scrollTop(0).scrollLeft(0)), "_resetY" !== n || l.contentReset.y || (a("onOverflowYNone") && c.callbacks.onOverflowYNone.call(t[0]), l.contentReset.y = 1), "_resetX" !== n || l.contentReset.x || (a("onOverflowXNone") && c.callbacks.onOverflowXNone.call(t[0]), l.contentReset.x = 1), "_resetY" !== n && "_resetX" !== n) {
					if(!l.contentReset.y && t[0].mcs || !l.overflowed[0] || (a("onOverflowY") && c.callbacks.onOverflowY.call(t[0]), l.contentReset.x = null), !l.contentReset.x && t[0].mcs || !l.overflowed[1] || (a("onOverflowX") && c.callbacks.onOverflowX.call(t[0]), l.contentReset.x = null), c.snapAmount) {
						var v = c.snapAmount instanceof Array ? "x" === o.dir ? c.snapAmount[1] : c.snapAmount[0] : c.snapAmount;
						n = q(n, v, c.snapOffset)
					}
					switch(o.dir) {
						case "x":
							var b = e("#mCSB_" + l.idx + "_dragger_horizontal"),
								x = "left",
								y = h[0].offsetLeft,
								w = [p.width() - h.outerWidth(!1), b.parent().width() - b.width()],
								_ = [n, 0 === n ? 0 : n / l.scrollRatio.x],
								C = m[1],
								k = g[1],
								S = C > 0 ? C / l.scrollRatio.x : 0,
								$ = k > 0 ? k / l.scrollRatio.x : 0;
							break;
						case "y":
							var b = e("#mCSB_" + l.idx + "_dragger_vertical"),
								x = "top",
								y = h[0].offsetTop,
								w = [p.height() - h.outerHeight(!1), b.parent().height() - b.height()],
								_ = [n, 0 === n ? 0 : n / l.scrollRatio.y],
								C = m[0],
								k = g[0],
								S = C > 0 ? C / l.scrollRatio.y : 0,
								$ = k > 0 ? k / l.scrollRatio.y : 0
					}
					_[1] < 0 || 0 === _[0] && 0 === _[1] ? _ = [0, 0] : _[1] >= w[1] ? _ = [w[0], w[1]] : _[0] = -_[0], t[0].mcs || (r(), a("onInit") && c.callbacks.onInit.call(t[0])), clearTimeout(h[0].onCompleteTimeout), G(b[0], x, Math.round(_[1]), u[1], o.scrollEasing), (l.tweenRunning || !(0 === y && _[0] >= 0 || y === w[0] && _[0] <= w[0])) && G(h[0], x, Math.round(_[0]), u[0], o.scrollEasing, o.overwrite, {
						onStart: function() {
							o.callbacks && o.onStart && !l.tweenRunning && (a("onScrollStart") && (r(), c.callbacks.onScrollStart.call(t[0])), l.tweenRunning = !0, T(b), l.cbOffsets = s())
						},
						onUpdate: function() {
							o.callbacks && o.onUpdate && a("whileScrolling") && (r(), c.callbacks.whileScrolling.call(t[0]))
						},
						onComplete: function() {
							if(o.callbacks && o.onComplete) {
								"yx" === c.axis && clearTimeout(h[0].onCompleteTimeout);
								var e = h[0].idleTimer || 0;
								h[0].onCompleteTimeout = setTimeout(function() {
									a("onScroll") && (r(), c.callbacks.onScroll.call(t[0])), a("onTotalScroll") && _[1] >= w[1] - S && l.cbOffsets[0] && (r(), c.callbacks.onTotalScroll.call(t[0])), a("onTotalScrollBack") && _[1] <= $ && l.cbOffsets[1] && (r(), c.callbacks.onTotalScrollBack.call(t[0])), l.tweenRunning = !1, h[0].idleTimer = 0, T(b, "hide")
								}, e)
							}
						}
					})
				}
			},
			G = function(e, t, n, i, o, a, s) {
				function r() {
					w.stop || (b || f.call(), b = X() - v, l(), b >= w.time && (w.time = b > w.time ? b + p - (b - w.time) : b + p - 1, w.time < b + 1 && (w.time = b + 1)), w.time < i ? w.id = h(r) : g.call())
				}

				function l() {
					i > 0 ? (w.currVal = u(w.time, x, _, i, o), y[t] = Math.round(w.currVal) + "px") : y[t] = n + "px", m.call()
				}

				function c() {
					p = 1e3 / 60, w.time = b + p, h = window.requestAnimationFrame ? window.requestAnimationFrame : function(e) {
						return l(), setTimeout(e, .01)
					}, w.id = h(r)
				}

				function d() {
					null != w.id && (window.requestAnimationFrame ? window.cancelAnimationFrame(w.id) : clearTimeout(w.id), w.id = null)
				}

				function u(e, t, n, i, o) {
					switch(o) {
						case "linear":
						case "mcsLinear":
							return n * e / i + t;
						case "mcsLinearOut":
							return e /= i, e--, n * Math.sqrt(1 - e * e) + t;
						case "easeInOutSmooth":
							return e /= i / 2, 1 > e ? n / 2 * e * e + t : (e--, -n / 2 * (e * (e - 2) - 1) + t);
						case "easeInOutStrong":
							return e /= i / 2, 1 > e ? n / 2 * Math.pow(2, 10 * (e - 1)) + t : (e--, n / 2 * (-Math.pow(2, -10 * e) + 2) + t);
						case "easeInOut":
						case "mcsEaseInOut":
							return e /= i / 2, 1 > e ? n / 2 * e * e * e + t : (e -= 2, n / 2 * (e * e * e + 2) + t);
						case "easeOutSmooth":
							return e /= i, e--, -n * (e * e * e * e - 1) + t;
						case "easeOutStrong":
							return n * (-Math.pow(2, -10 * e / i) + 1) + t;
						case "easeOut":
						case "mcsEaseOut":
						default:
							var a = (e /= i) * e,
								s = a * e;
							return t + n * (.499999999999997 * s * a + -2.5 * a * a + 5.5 * s + -6.5 * a + 4 * e)
					}
				}
				e._mTween || (e._mTween = {
					top: {},
					left: {}
				});
				var p, h, s = s || {},
					f = s.onStart || function() {},
					m = s.onUpdate || function() {},
					g = s.onComplete || function() {},
					v = X(),
					b = 0,
					x = e.offsetTop,
					y = e.style,
					w = e._mTween[t];
				"left" === t && (x = e.offsetLeft);
				var _ = n - x;
				w.stop = 0, "none" !== a && d(), c()
			},
			X = function() {
				return window.performance && window.performance.now ? window.performance.now() : window.performance && window.performance.webkitNow ? window.performance.webkitNow() : Date.now ? Date.now() : (new Date).getTime()
			},
			V = function() {
				var e = this;
				e._mTween || (e._mTween = {
					top: {},
					left: {}
				});
				for(var t = ["top", "left"], n = 0; n < t.length; n++) {
					var i = t[n];
					e._mTween[i].id && (window.requestAnimationFrame ? window.cancelAnimationFrame(e._mTween[i].id) : clearTimeout(e._mTween[i].id), e._mTween[i].id = null, e._mTween[i].stop = 1)
				}
			},
			Z = function(e, t) {
				try {
					delete e[t]
				} catch(n) {
					e[t] = null
				}
			},
			Q = function(e) {
				return !(e.which && 1 !== e.which)
			},
			K = function(e) {
				var t = e.originalEvent.pointerType;
				return !(t && "touch" !== t && 2 !== t)
			},
			ee = function(e) {
				return !isNaN(parseFloat(e)) && isFinite(e)
			},
			te = function(e) {
				var t = e.parents(".mCSB_container");
				return [e.offset().top - t.offset().top, e.offset().left - t.offset().left]
			},
			ne = function() {
				function e() {
					var e = ["webkit", "moz", "ms", "o"];
					if("hidden" in document) return "hidden";
					for(var t = 0; t < e.length; t++)
						if(e[t] + "Hidden" in document) return e[t] + "Hidden";
					return null
				}
				var t = e();
				return !!t && document[t]
			};
		e.fn[n] = function(t) {
			return u[t] ? u[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof t && t ? void e.error("Method " + t + " does not exist") : u.init.apply(this, arguments)
		}, e[n] = function(t) {
			return u[t] ? u[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof t && t ? void e.error("Method " + t + " does not exist") : u.init.apply(this, arguments)
		}, e[n].defaults = a, window[n] = !0, e(window).load(function() {
			e(o)[n](), e.extend(e.expr[":"], {
				mcsInView: e.expr[":"].mcsInView || function(t) {
					var n, i, o = e(t),
						a = o.parents(".mCSB_container");
					if(a.length) return n = a.parent(), i = [a[0].offsetTop, a[0].offsetLeft], i[0] + te(o)[0] >= 0 && i[0] + te(o)[0] < n.height() - o.outerHeight(!1) && i[1] + te(o)[1] >= 0 && i[1] + te(o)[1] < n.width() - o.outerWidth(!1)
				},
				mcsOverflow: e.expr[":"].mcsOverflow || function(t) {
					var n = e(t).data(i);
					if(n) return n.overflowed[0] || n.overflowed[1]
				}
			})
		})
	})
});
var context = context || function() {
	function e(e) {
		a = $.extend({}, a, e), $(document).on("click", "html", function() {
			$(".dropdown-context").fadeOut(a.fadeSpeed, function() {
				$(".dropdown-context").css({
					display: ""
				}).find(".drop-left").removeClass("drop-left")
			})
		}), a.preventDoubleContext && $(document).on("contextmenu", ".dropdown-context", function(e) {
			e.preventDefault()
		}), $(document).on("mouseenter", ".dropdown-submenu", function() {
			var e = $(this).find(".dropdown-context-sub:first"),
				t = e.width(),
				n = e.offset().left,
				i = t + n > window.innerWidth;
			i && e.addClass("drop-left")
		})
	}

	function t(e) {
		a = $.extend({}, a, e)
	}

	function n(e, t, i) {
		var o = i ? " dropdown-context-sub" : "",
			s = a.compress ? " compressed-context" : "",
			r = $('<ul class="dropdown-menu dropdown-context' + o + s + '" id="dropdown-' + t + '"></ul>'),
			l = 0,
			c = "";
		for(l; l < e.length; l++) {
			if("undefined" != typeof e[l].divider) r.append('<li class="divider"></li>');
			else if("undefined" != typeof e[l].header) r.append('<li class="nav-header">' + e[l].header + "</li>");
			else {
				if("undefined" == typeof e[l].href && (e[l].href = "#"), "undefined" != typeof e[l].target && (c = ' target="' + e[l].target + '"'), "undefined" != typeof e[l].subMenu ? $sub = '<li class="dropdown-submenu"><a tabindex="-1" href="' + e[l].href + '">' + e[l].text + "</a></li>" : $sub = $('<li><a tabindex="-1" href="' + e[l].href + '"' + c + ">" + e[l].text + "</a></li>"), "undefined" != typeof e[l].action) {
					var d = new Date,
						u = "event-" + d.getTime() * Math.floor(1e5 * Math.random()),
						p = e[l].action;
					$sub.find("a").attr("id", u), $("#" + u).addClass("context-event"), $(document).on("click", "#" + u, p)
				}
				if(r.append($sub), "undefined" != typeof e[l].subMenu) {
					var h = n(e[l].subMenu, t, !0);
					r.find("li:last").append(h)
				}
			}
			"function" == typeof a.filter && a.filter(r.find("li:last"))
		}
		return r
	}

	function i(e, t, i) {
		var o = new Date,
			s = o.getTime(),
			r = n(t, s);
		$("body").append(r), $(document).on("contextmenu", e, function(e) {
			if(e.preventDefault(), e.stopPropagation(), $(".dropdown-context:not(.dropdown-context-sub)").hide(), $dd = $("#dropdown-" + s), $dd.attr(i.attr, $(e.target).closest(i.tar).attr(i.attr)), "boolean" == typeof a.above && a.above) $dd.addClass("dropdown-context-up").css({
				top: e.pageY - 20 - $("#dropdown-" + s).height(),
				left: e.pageX - 13
			}).fadeIn(a.fadeSpeed);
			else if("string" == typeof a.above && "auto" == a.above) {
				$dd.removeClass("dropdown-context-up");
				var t = $dd.height() + 12;
				e.pageY + t > $("html").height() ? $dd.addClass("dropdown-context-up").css({
					top: e.pageY - 20 - t,
					left: e.pageX - 13
				}).fadeIn(a.fadeSpeed) : $dd.css({
					top: e.pageY + 10,
					left: e.pageX - 13
				}).fadeIn(a.fadeSpeed)
			}
		})
	}

	function o(e) {
		$(document).off("contextmenu", e).off("click", ".context-event")
	}
	var a = {
		fadeSpeed: 100,
		filter: function(e) {},
		above: "auto",
		preventDoubleContext: !0,
		compress: !1
	};
	return {
		init: e,
		settings: t,
		attach: i,
		destroy: o
	}
}();
! function(e) {
	e.gozap || (e.gozap = {}), G = e.gozap;
	var t = Object.prototype.toString,
		n = {};
	e.extend(G, {
		TIPS_TYPE: {
			success: "0",
			error: "1",
			loading: "2",
			warning: "3"
		},
		RESULT_CODE: {
			success: "9999"
		},
		type: function(e) {
			return null == e ? String(e) : n[t.call(e)] || "object"
		},
		clone: function(t) {
			var n, i, o = t;
			if(t && ((n = e.isArray(t)) || e.isPlainObject(t))) {
				o = n ? [] : {};
				for(i in t) t.hasOwnProperty(i) && (o[i] = G.clone(t[i]))
			}
			return o
		},
		namespace: function(t, n, i) {
			var o, a, s = t.split("."),
				r = n || e,
				l = s.length;
			for(a = 0; a < l; a++) o = s[a], r[o] || (i && a === l - 1 ? r[o] == i : r[o] = {}), r = r[o];
			return r
		},
		now: function() {
			return(new Date).getTime()
		},
		getRandomId: function(e) {
			for(var t, n = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], i = "", o = 0; o < e; o++) t = Math.floor(35 * Math.random()), i += n[t];
			return i
		},
		containsAll: function(t, n) {
			if(n.length > t.length) return !1;
			for(var i, o = 0, a = n.length; o < a; o++)
				if(i = n[o], e.inArray(i, t) < 0) return !1;
			return !0
		},
		isEqualArray: function(t, n) {
			if(t.length !== n.length) return !1;
			t = t.concat(), n = n.concat();
			var i, o, a;
			n.length;
			for(i = t.length - 1; i >= 0; i--) {
				if(o = t[i], !((a = e.inArray(o, n)) > -1)) return !1;
				t.splice(i, 1), n.splice(a, 1)
			}
			return !0
		},
		unique: function(e, t) {
			t = t || function(e, t) {
				return e === t
			};
			var n, i, o = e.length;
			for(n = o - 1; n > 0; n--)
				for(i = n - 1; i >= 0; i--)
					if(t(e[n], e[i])) {
						e.splice(n, 1);
						break
					}
		},
		deleteAttribute: function(e, t) {
			void 0 !== e[t] && (e[t] = null, delete e[t])
		},
		toArray: function(e) {
			return e || "" === e || 0 === e ? G.isArray(e) ? e : [e] : []
		}
	}), e.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(e, t) {
		var i = t.toLowerCase();
		n["[object " + t + "]"] = i, G["is" + t] = function(e) {
			return G.type(e) == i
		}
	}), G.namespace("gozap.labi"), G.namespace("gozap.datoutie"), G.namespace("gozap.digg")
}(jQuery),
function(e) {
	var t = e.gozap;
	e.extend(t, {
		imageZoomMethods: {
			DEFAULT: 0,
			LOCKED_RATIO_SMALL: 1,
			LOCKED_RATIO_BIG: 2,
			UNLOCKED_RATIO: 3,
			LOCKED_RATIO_SMALL_NARROW: 4,
			LOCKED_RATIO_SMALL_ENLARGE: 5,
			LOCKED_RATIO_BIG_NARROW: 6,
			LOCKED_RATIO_BIG_ENLARGE: 7,
			UNLOCKED_RATIO_NARROW: 8,
			UNLOCKED_RATIO_ENLARGE: 9
		},
		getImageZoomUrl: function(e, n, i, o) {
			var a = "",
				s = e.lastIndexOf(".");
			return o = o || t.imageZoomMethods.DEFAULT, a += e.substring(0, s), a += "=" + n + "x" + i, t.imageZoomMethods.LOCKED_RATIO_SMALL_NARROW === o && (a += ")"), a += e.substring(s)
		}
	})
}(jQuery),
function(e) {
	function t(t, a) {
		var s = [],
			r = function(t, n) {
				n = e.isFunction(n) ? n() : n, s.push(o(t) + "=" + o(n))
			};
		if(i.isArray(t)) e.each(t, function(e, t) {
			var n = a ? a + "." + t.name : t.name;
			r(n, t.value)
		});
		else
			for(var l in t) n(l, t[l], r);
		return s.join("&")
	}

	function n(t, o, a) {
		if(i.isArray(o)) e.each(o, function(e, i) {
			n(t + "[" + e + "]", i, a)
		});
		else if(null != o && "object" == typeof o)
			for(var s in o) n(t + "." + s, o[s], a);
		else a(t, o)
	}
	var i = e.gozap,
		o = encodeURIComponent;
	e.extend(i, {
		ajax: function(t) {
			try {
				t = t || {};
				var n, o = t.success;
				n = function(t) {
					if(t && (t.result || t.code)) {
						var n, a = t.result || t,
							s = a.code;
						if("1002" != s) {
							if("22157" == s) {
								e("#isAjax").val("1");
								var r = e(".module-login-mask"),
									l = r.find(".box-register"),
									c = r.find(".box-login"),
									d = r.find(".box-register-mobile"),
									u = r.find(".box-register-detail");
								l.css("padding-left", 0), c.hide(), r.find(".box-active").removeClass("box-active"), r.find(".box-register").find(".header").eq(1).addClass("box-active").css("border-radius", "5px 5px 0 0").find("span").html("填写基本资料"), r.find(".body-register").css("border-radius", "0 0 5px 5px"), r.find(".btn-close").hide(), r.find(".step-box").find("span").hide(), d.hide(), u.show(), r.show(), r.find(".box-register-detail").find(".err-msg").html('<span class="err-content">请先完善资料才能进行操作</sapn>'), r.find(".nick").focus(), "海外" == a.data.proveName ? (r.find(".rgregion").find('option[value="1"]').attr("selected", "seleced"), r.find(".rgregion").change()) : "" == a.data.proveName || (r.find(".rgpro").find('option[value="' + a.data.proveName + '"]').attr("selected", "seleced"), r.find(".rgpro").change(), r.find(".rgcity").find('option[value="' + a.data.cityName + '"]').attr("selected", "seleced")), r.find(".nick").val(a.data.nick), r.find('.sex[value="' + a.data.sex + '"]').click(), r.find(".sign").val(a.data.sign)
							} else n = s == i.RESULT_CODE.success ? i.TIPS_TYPE.success : i.TIPS_TYPE.error;
							a.data && a.data.query && a.data.query.item && (a.data.query.item = i.toArray(a.data.query.item)), e.isFunction(o) && o(a)
						}
					}
				}, e.extend(t, {
					dataType: "json",
					success: n
				}), t.success = n, e.ajax(t)
			} catch(a) {
				console.log(a)
			}
		},
		serialize: function(e, t) {
			return t ? i.param(e.serializeArray(), t) : e.serialize()
		},
		param: function(n, o) {
			var a = {};
			return o && !i.isArray(n) ? e.each(n, function(e, t) {
				e = o + "." + e, a[e] = t
			}) : a = n, t(a, o)
		},
		unparam: function() {}
	}), e.ajaxSetup({
		type: "POST",
		traditional: !0,
		timeout: 3e4
	})
}(jQuery),
function(e) {
	var t = e.gozap,
		n = {
			url: "((?:https|http)://)?(?:[0-9a-z_!~*'()-]+\\.)*(?:[0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\\.[a-z]{2,6}(?::[0-9]{1,4})?(?:/[0-9A-Za-z_!~*'().;?:@&=+$,%#-]*)*",
			email: "[_a-zA-Z0-9.]+@(?:[_a-z0-9]+\\.)+[a-z0-9]{2,4}",
			phone: "\\+?[0-9]+-?[0-9]{3,18}",
			cn: "[一-龥]+",
			mobile: "(12593|12520|10193|17900|17911|17951|125930|125200|101930|179000|179110|179510|(\\+?86))?1(3|4|5|7|8)([0-9]{9})"
		};
	e.extend(t, {
		regExp: {}
	}), e.each("Url Email Phone CN Mobile".split(" "), function(e, i) {
		var o = i.toLowerCase(),
			a = n[o];
		t.regExp["is" + i] = function(e) {
			return new RegExp("^" + a + "$").test(e)
		}
	})
}(jQuery),
function(e) {
	var t = e.gozap;
	t.DOM = {}, e.extend(t.DOM, {
		addStyleSheet: function(n, i) {
			if(i = i || "style-" + t.now(), e.browser.msie) {
				var o = document.createElement("style");
				o.type = "text/css", o.id = i;
				var a = document.getElementsByTagName("head")[0];
				a.firstChild ? a.insertBefore(o, a.firstChild) : a.appendChild(o), o.styleSheet.cssText = n
			} else e("<style type='text/css' id='" + i + "'></style>").html(n).appendTo("head")
		},
		setPosition: function(t, n) {
			var i, o, a = {
					target: null,
					offset: {
						left: 0,
						top: 0
					},
					container: e(document.body),
					position: "bottom"
				},
				s = e.extend({}, a, n);
			if(null !== s.target) {
				var r = s.target.offset(),
					l = s.position;
				"left" === l ? (i = r.left - t.width(), o = r.top) : "right" === l ? (i = r.left + s.target.outerWidth(), o = r.top) : "top" === l ? (i = r.left, o = r.top - t.height()) : (i = r.left, o = r.top + s.target.outerHeight() + (s.container ? s.container.scrollTop() : 0)), i += s.offset.left, o += s.offset.top
			} else {
				var c = document.documentElement.clientWidth,
					d = document.documentElement.clientHeight,
					u = t.width(),
					p = t.height();
				i = Math.max(0, (c - u) / 2) + document.documentElement.scrollLeft + document.body.scrollLeft, o = Math.max(0, (d - p) / 2) + document.documentElement.scrollTop + document.body.scrollTop
			}
			t.css({
				position: "absolute",
				zIndex: "100",
				left: i,
				top: o
			})
		}
	})
}(jQuery),
function(e) {
	var t = e.gozap;
	t.namespace("gozap.swf"), e.extend(t.swf, {
		version: function() {
			var e = navigator;
			if(e.plugins && e.mimeTypes.length) {
				var t = e.plugins["Shockwave Flash"];
				if(t && t.description) return t.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s)+r/, ".") + ".0"
			} else if(window.ActiveXObject && !window.opera)
				for(var n = 10; n >= 2; n--) try {
					var i = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + n);
					if(i) {
						var o = i.GetVariable("$version");
						return o.replace(/WIN/g, "").replace(/,/g, ".")
					}
				} catch(a) {}
		}()
	})
}(jQuery),
function(e) {
	e.fn.extend({
		getRegion: function() {
			var e = this.offset();
			return {
				left: e.left,
				top: e.top,
				right: e.left + this.outerWidth(),
				bottom: e.top - this.outerHeight()
			}
		}
	}), e.extend({
		isUndefined: function(e) {
			return void 0 === e
		},
		isBoolean: function(e) {
			return "boolean" == typeof e
		},
		isString: function(e) {
			return "string" == typeof e
		},
		isNumber: function(e) {
			return "number" == typeof e && isFinite(e)
		},
		addStyleSheet: function(t, n) {
			if(n = n || "labi-style", e.browser.msie) {
				var i = document.createElement("style");
				i.type = "text/css", i.id = n;
				var o = document.getElementsByTagName("head")[0];
				o.firstChild ? o.insertBefore(i, o.firstChild) : o.appendChild(i), i.styleSheet.cssText = t
			} else e("<style type='text/css' id='" + n + "'></style>").html(t).appendTo("head")
		},
		limitTextarea: function(t, n) {
			var i = function() {
				var t = e(this);
				t.val().length > n && t.val(t.val().substring(0, n))
			};
			t.bind("keydown", i).bind("change", i)
		},
		bindTipsEvent: function(t) {
			return t.focus(function() {
				var t = e(this),
					n = t.attr("id"),
					i = t.siblings("label[for='" + n + "']");
				i.hide()
			}).blur(function() {
				var t = e(this),
					n = t.attr("id"),
					i = t.siblings("label[for='" + n + "']");
				"" === e.trim(t.val()) && i.show()
			})
		},
		bindInputTipsEvent: function(t, n) {
			return t.focus(function() {
				var t = e(this),
					i = e.trim(t.val());
				if("" === i) {
					var o = t.attr("tips"),
						a = e("<span></span>").text(o).addClass("input_tips").appendTo(document.body);
					e.setPosition(a, {
						target: t,
						offset: n
					}), t.data("tips", a)
				}
			}).blur(function() {
				var t = e(this);
				t.data("tips") && t.data("tips").remove()
			}).keyup(function() {
				var t = e(this);
				"" !== e.trim(t.val()) && t.data("tips") && (t.data("tips").remove(), t.removeData("tips"))
			}).change(function() {
				var t = e(this);
				"" !== e.trim(t.val()) && t.data("tips") && (t.data("tips").remove(), t.removeData("tips"))
			})
		},
		setPosition: function(t, n) {
			var i = {
					target: null,
					offset: {
						left: 0,
						top: 0
					},
					container: e(document.body)
				},
				o = e.extend({}, i, n);
			if(null !== o.target) {
				var a = o.target.offset(),
					s = a.left + o.offset.left,
					r = a.top + o.target.outerHeight() + (o.container ? o.container.scrollTop() : 0) + o.offset.top;
				t.css({
					position: "absolute",
					zIndex: "100",
					left: s,
					top: r
				})
			} else {
				var l = document.documentElement.clientWidth,
					c = document.documentElement.clientHeight,
					d = t.width(),
					u = t.height(),
					s = Math.max(0, (l - d) / 2) + document.documentElement.scrollLeft,
					r = Math.max(0, (c - u) / 2) + document.documentElement.scrollTop;
				t.css({
					left: s,
					top: r
				})
			}
		},
		getWeekOfMonth: function(e) {
			var t = e.getDate(),
				n = e.getDay();
			return 0 === n && (n = 7), t > n ? Math.ceil((t - n) / 7) + 1 : 1
		},
		getWeekDayOfMonth: function(t) {
			var n = e.getWeekOfMonth(t),
				i = t.getDay(),
				o = new Date(t.getFullYear(), t.getMonth(), 1).getDay();
			return 0 !== i && o > i && n--, n
		}
	}), e.fn.extend({
		getData: function(e) {
			return this.attr("data-" + e)
		},
		setData: function(e, t) {
			return this.attr("data-" + e, t)
		},
		autoRemove: function(t) {
			var n = {
					hideMask: !1
				},
				i = e.extend({}, n, t),
				o = this,
				a = function() {
					o.remove(), o.data("shim") && o.data("shim").remove(), i.hideMask && L.hideMask(), r()
				},
				s = function() {
					for(var t = window; t && (e(t.document).unbind("click", a).bind("click", a), t !== t.parent);) t = t.parent
				},
				r = function() {
					for(var t = window; t && (e(t.document).unbind("click", a), t !== t.parent);) t = t.parent
				};
			setTimeout(function() {
				s(), o.hover(function() {
					r()
				}, function() {
					s()
				})
			}, 1)
		},
		bindTipsEvent: function() {
			return e.bindTipsEvent(this)
		},
		bindInputTipsEvent: function(t) {
			return e.bindInputTipsEvent(this, t)
		}
	}), e.extend(e.browser, {
		chrome: function() {
			return /chrome\/(\d+\.\d)/i.test(navigator.userAgent)
		}()
	})
}(jQuery),
function(e) {
	var t = e.gozap,
		n = t.labi,
		i = {
			common: {
				httpError: {
					5: "本地网络异常，请稍候再试",
					6: "请求超时，请稍候再试",
					0: "本地网络异常，请稍候再试"
				},
				topTips: {
					loading: "数据加载中..."
				},
				inputTips: {
					searchContacts: "搜索联系人..."
				},
				buttonText: {
					confirm: "确定",
					cancel: "取消"
				},
				close: "关闭",
				year: "年",
				month: "月",
				date: "日",
				add: "添加",
				remove: "删除",
				set: "修改",
				create: "创建",
				restore: "恢复",
				mobile: "手机",
				website: "站点",
				contact: "联系人",
				"new": "新",
				old: "旧",
				sendMail: "发邮件",
				operateTips: {
					setSuccess: "设置成功",
					failed: "操作失败"
				},
				basicErrorTips: {
					400: "操作请求出错，请联系客服！",
					403: "您没有权限执行此操作！",
					404: "目前服务不可用，请稍后再试！",
					500: "内部服务器出错，请稍后再试！",
					502: "服务器处理超时，请稍后再试！",
					503: "目前服务不可用，请稍后再试！",
					noPacketBack: "服务器处理超时，请稍后再试！"
				},
				inactive: "未激活",
				allPnum: "所有号码"
			},
			ui: {}
		};
	n.i18n || (n.i18n = {}), e.extend(n.i18n, i)
}(jQuery),
function(e) {
	var t, n = e.gozap,
		i = n.labi,
		o = i.i18n,
		a = 3e3;
	window.top.document;
	currentPage = {}, e.extend(i, {
		TIPS_TYPE: n.TIPS_TYPE,
		RESULT_CODE: n.RESULT_CODE,
		buttonType: {
			BTN_TYPE_LEAD: "1",
			BTN_TYPE_NON_LEAD: "2",
			BIN_TYPE_NORMAL: "3",
			BTN_TYPE_TOOL: "4",
			BTN_TYPE_PNUM: "5"
		},
		show: function(e) {
			return e.show()
		},
		hide: function(e) {
			return e.hide()
		},
		formatDate: function(e) {
			var t = new Date(parseInt(e) / 1e3),
				n = t.getHours() < 10 ? "0" + t.getHours() : t.getHours(),
				i = t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes();
			return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + "  " + n + ":" + i
		},
		showTopTips: function(n, s, r) {
			var l = i.TIPS_TYPE,
				c = e("#tips_top_container"),
				d = c.children(),
				u = d.find("a"),
				p = d.find("span"),
				n = n || l.loading;
			r = r || a, n === l.loading ? (p.css("margin", "0 20px"), u.hide(), s = s || o.common.topTips.loading, d.css({
				borderColor: "#99ccff",
				backgroundColor: "#cae1fe"
			})) : (p.css("margin", "0 30px 0 10px"), u.show().removeClass().addClass("icon-common"), n === l.success ? (d.css({
				borderColor: "#34cb00",
				backgroundColor: "#ccffcc"
			}), u.addClass("icon-close-success")) : n === l.error ? (d.css({
				borderColor: "#ff9999",
				backgroundColor: "#ffcccc"
			}), u.addClass("icon-close-fail")) : n === l.warning && (d.css({
				borderColor: "#f3c302",
				backgroundColor: "#ffffd5"
			}), u.addClass("icon-close-warning")), t && (t = clearTimeout(t)), t = setTimeout(function() {
				c.hide(), t = null
			}, r)), d.find("span").html(s), c.show()
		},
		hideTopTips: function() {
			t && (t = clearTimeout(t)), e("#tips_top_container").hide()
		},
		isAvailable: function(e) {
			return e && !(e instanceof Object) && "[object Object]" != e
		},
		toArray: n.toArray,
		getReturnPage: function(e, t, n, i) {
			e = parseInt(e), t = parseInt(t), n = parseInt(n), i = parseInt(i);
			var o = Math.ceil(n / t);
			return e == o && e > 1 && (i == t || i == n % t) ? e - 1 : e
		},
		resizeLabiFrame: function() {
			e("#main_frame, #main_content").height(e("#main_frame").contents().find("#content").height())
		},
		goTop: function() {
			e(window).scrollTop(0)
		},
		changeMainNavStyle: function(t) {
			var n = currentPage.module;
			if("crc" === n && (n = "sms"), "crc" === t && (t = "sms"), t != n) {
				var i = e("#nav_" + n);
				i.length > 0 && i.removeClass("nav-" + n + "-active").removeClass("nav-" + n + "-mouseover");
				var o = e("#nav_" + t);
				o.length > 0 && o.addClass("nav-" + t + "-active")
			}
		},
		initModule: function(e, t) {
			i.changeMainNavStyle(e), currentPage.module = e, t ? currentPage.info = t : delete currentPage.info
		},
		showMask: function() {
			e("#mask").css({
				width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
				height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
			}).show()
		},
		hideMask: function() {
			e("#mask").hide()
		},
		compareVersion: function(e, t) {
			for(var n, i, o = e.split("."), a = t.split("."), s = Math.min(o.length, a.length), r = 0; r < s; r++)
				if(n = parseInt(o[r]), i = parseInt(a[r]), n !== i) return n - i;
			return o.length - a.length
		},
		highlight: function(e, t) {
			return t ? e.replace(new RegExp(t, "g"), function(e) {
				return "<b>" + e + "</b>"
			}) : e
		},
		cutOff: function(e, t) {
			return e.length > t ? e.substring(0, t) + "..." : e
		},
		viewPhone: function(e, t) {
			var n = parent.statusInfo[e],
				i = n.pnum;
			return i ? i : !t && n.brand ? n.brand + " " + n.model : i18nCommon.inactive
		},
		getImgPath: function(e) {
			if(e) {
				var t, n, i = "http://img.labi.com",
					o = DEFAULT_USER_IMAGE_PATH;
				return 0 == e.indexOf(o) ? (n = e, t = e.replace(o, "")) : 0 == e.indexOf(i) ? (t = e.replace(i, ""), n = o + t) : ("/" != e.substring(0, 1) && (e = "/" + e), t = e, n = o + t), {
					absolute: n,
					relative: t
				}
			}
			return {
				absolute: "",
				relative: ""
			}
		},
		getImageAbsolutePath: function(e) {
			return i.getImgPath(e).absolute
		},
		setButtonDisabled: function(e, t) {
			var n = t;
			parseInt(n) && (e.removeAttr("abled-status"), e.addClass("button-disabled-" + n).css({
				cursor: "default",
				outline: "none"
			}).find("span").css("cursor", "default"))
		},
		setButtonAbled: function(e, t) {
			var n = t;
			parseInt(n) && (e.attr("abled-status", !0), e.removeClass("button-disabled-" + n).css("cursor", "pointer").find("span").css("cursor", "pointer"))
		},
		buttonCanAbled: function(e) {
			return !!e.attr("abled-status")
		}
	})
}(jQuery),
function(e) {
	var t = e.gozap,
		n = t.labi;
	n.i18n;
	e.extend(n, {
		ajax: function(e) {
			e = e || {}, t.ajax(e)
		}
	}), e.ajaxSetup({
		error: function(e, t) {
			if(t = t.toLowerCase(), "error" === t) {
				e.status.toString().substring(0, 1)
			}
		}
	})
}(jQuery),
function(e) {
	function t() {
		var t = '<object id="swf_ava_upload" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="541" height="451"><param name="movie" value="' + h + 'GozapToolComponentTest.swf" /><param name="quality" value="high" /><param name="allowScriptAccess" value="always" /><param name="FlashVars" value="swfId=swf_ava_upload&showStyle=0&uploadDataFieldName=upload&uploadSvrURL=imageUpload!flashUpload.action"><embed src="' + h + 'GozapToolComponentTest.swf" id="GozapToolComponentTest" allowscriptaccess="always" swliveconnect="true" quality="high" type="application/x-shockwave-flash" flashvars="swfId=swf_ava_upload&showStyle=0&uploadDataFieldName=upload&uploadSvrURL=imageUpload!flashUpload.action" width="541" height="451"></embed></object>',
			n = {
				id: "H-avaupload-dialog",
				dialogClass: "avaupload-dialog",
				title: d.title,
				titleImgClass: "avaupload-dialog-icon",
				content: t,
				contentClass: "flash-dialog-content",
				container: e(document.body),
				buttons: {}
			};
		e.dialog(n)
	}

	function n() {
		return o
	}

	function i(t) {
		if("-1" == t) s.showTopTips(s.TIPS_TYPE.error, d.failed);
		else if("IOError" == t) s.showTopTips(s.TIPS_TYPE.error, d.failed);
		else {
			e("#H-avaupload-dialog").remove(), s.hideMask();
			var n = s.getImgPath(t),
				i = e("#main_frame").contents();
			"" == o ? e.ajax({
				type: "POST",
				url: "labiCard!setCardAttr.action",
				data: "ava=" + n.relative,
				error: function(e, t) {
					treatError(e, t)
				},
				success: function(t) {
					return t == SESSION_TIMEOUT ? void treatSessionTimeout() : void(t == common.RESULT ? (getContentWindow().cardItem && (getContentWindow().cardItem.ava = n.relative), e("#head_ava").attr("src", chouti.replaceHttps(n.absolute)), "setting" == currentPage.module && i.find("#contact-ava").attr("src", chouti.replaceHttps(n.absolute)), s.showTopTips(s.TIPS_TYPE.success, labiTips.setAvaSuccess)) : s.showTopTips(s.TIPS_TYPE.error, d.failed))
				}
			}) : "add" == o ? (i.find("#contact-ava").attr("src", chouti.replaceHttps(n.absolute)), getContentWindow().contact.setAvaForAdd(t)) : e.ajax({
				type: "POST",
				url: "labiContacts!setContactAttr.action",
				data: "guid=" + o + "&ava=" + n.relative,
				error: function(e, t) {
					treatError(e, t)
				},
				success: function(e) {
					if(e == SESSION_TIMEOUT) return void treatSessionTimeout();
					if(e == common.RESULT) {
						i.find("#contact-ava").attr("src", chouti.replaceHttps(n.absolute));
						for(var t = r.getAllData(), a = t.cnt, l = 0; l < a.length; l++)
							if(a[l].guid == o) {
								a[l].ava = n.relative;
								break
							}
						s.showTopTips(s.TIPS_TYPE.success, labiTips.setAvaSuccess)
					} else s.showTopTips(s.TIPS_TYPE.error, d.failed)
				}
			})
		}
	}
	var o, a = e.gozap,
		s = a.labi,
		r = s.contact,
		l = s.i18n,
		c = l.common,
		d = l.avaUpload,
		u = 300,
		p = 300,
		h = "/images/",
		f = "fileTypeError",
		m = "fileSizeError",
		g = null,
		v = null,
		b = e.browser.msie && e.browser.version < 7,
		x = b ? "blank.html" : "about:blank",
		y = function(n, i) {
			if(a.swf.version && parseInt(a.swf.version.substring(0, a.swf.version.indexOf("."))) > 9 && !e.browser.chrome) return o = n, void t();
			var r = e("<div></div>").addClass("avaupload-dialog-content"),
				l = (e('<iframe name="uploadIframe"></iframe>').css("display", "none").attr({
					src: x
				}).appendTo(r), e('<form enctype="multipart/form-data" method="post"></form>').attr({
					target: "uploadIframe",
					action: "imageUpload!insertImageNotConfirm.action?t=1"
				}).html('<input type="hidden" name="x1" value="0" /><input type="hidden" name="y1" value="0" /><input type="hidden" name="width" value="0" /><input type="hidden" name="height" value="0" /><input type="hidden" name="guid" value="' + n + '" /><input type="hidden" name="fileName" value="" />').appendTo(r)),
				u = (e('<input type="file" name="upload" />').addClass("file").attr({
					size: "37"
				}).bind("change", function() {
					e("#H-avaupload-dialog a.btn" + BTN_TYPE_LEAD).attr("disabled", "disabled"), g.hide(), v.show(), l.attr("action", "imageUpload!insertImageNotConfirm.action?t=1").submit()
				}).appendTo(l), e("<table></table>").attr({
					cellspacing: "0",
					cellpadding: "0",
					width: "100%"
				}).appendTo(r)),
				p = e("<tr></tr>").appendTo(u),
				h = e('<td width="330" valign="top"></td>').appendTo(p),
				f = e('<td valign="top"></td>').appendTo(p),
				m = (e("<div></div>").addClass("picture-dialog-content-uploadtips").text(d.imageUploadTips).appendTo(h), e("<div></div>").addClass("picture-dialog-content-imagecontainer").appendTo(h)),
				g = (e('<img src="" />').attr({
					id: "H-ava-upload"
				}).css("display", "none").appendTo(m), e('<img src="image/upload-default.png" />').addClass("upload-image-default").attr({
					id: "H-upload-image-default"
				}).appendTo(m)),
				v = e('<img src="image/upload-loading.gif" />').addClass("upload-image-loading").attr({
					id: "H-upload-ava-loading"
				}).appendTo(m),
				b = (e("<div></div>").addClass("picture-dialog-content-uploadtips").text(d.tips).appendTo(f), e('<div><img src="" style="position:relative;display:none;" /></div>').addClass("ava-preview-140").attr({
					id: "H-image-preview-140"
				}).appendTo(f), e("<div></div>").addClass("ava-preview-size").text("140x140").appendTo(f), e('<div><img src="" style="position:relative;display:none;" /></div>').addClass("ava-preview-48").attr({
					id: "H-image-preview-48"
				}).appendTo(f), e("<div></div>").addClass("ava-preview-size").text("48x48").appendTo(f), {
					id: "H-avaupload-dialog",
					dialogClass: "avaupload-dialog",
					title: d.title,
					titleImgClass: "avaupload-dialog-icon",
					content: r,
					container: e(document.body),
					buttons: {}
				});
			b.buttons[d.upload] = function() {
				return "" == e("#H-avaupload-dialog input[name='fileName']").val() ? (s.showTopTips(s.TIPS_TYPE.error, d.select), !1) : (l.attr("action", "imageUpload!uploadAvatar.action").submit(), !1)
			}, b.buttons[c.buttonText.cancel] = "", e.dialog(b)
		},
		w = function(t, n) {
			var i = 48 / (n.width || 1),
				o = 48 / (n.height || 1),
				a = e(t);
			null === g && (g = a.width()), null === v && (v = a.height()), e("#H-image-preview-48>img").css({
				width: Math.round(i * g) + "px",
				height: Math.round(o * v) + "px",
				marginLeft: "-" + Math.round(i * n.x1) + "px",
				marginTop: "-" + Math.round(o * n.y1) + "px"
			}), i = 140 / (n.width || 1), o = 140 / (n.height || 1), e("#H-image-preview-140>img").css({
				width: Math.round(i * g) + "px",
				height: Math.round(o * v) + "px",
				marginLeft: "-" + Math.round(i * n.x1) + "px",
				marginTop: "-" + Math.round(o * n.y1) + "px"
			})
		},
		_ = function(t, n, i, o) {
			if(e("#H-avaupload-dialog a.btn" + BTN_TYPE_LEAD).removeAttr("disabled"), e("#H-upload-ava-loading").hide(), e("#H-ava-upload").show(), "error" == t) s.showTopTips(s.TIPS_TYPE.error, d.failed);
			else if(t == f) s.showTopTips(s.TIPS_TYPE.error, d.fileTypeError);
			else if(t == m) s.showTopTips(s.TIPS_TYPE.error, d.fileSizeError);
			else {
				g = null, v = null, i = parseInt(i), o = parseInt(o);
				var a, r, l, c;
				i < o ? (a = 0, l = i - 1, r = parseInt((o - i) / 2), c = r + i - 1) : (a = parseInt((i - o) / 2), l = a + o - 1, r = 0, c = o - 1), e("#H-ava-upload").attr("src", t).css({
					position: "absolute",
					left: (u - i) / 2,
					top: (p - o) / 2
				}).show().imgAreaSelect({
					handles: !0,
					parent: e("#H-avaupload-dialog"),
					aspectRatio: "1:1",
					x1: a,
					y1: r,
					x2: l,
					y2: c,
					onInit: w,
					onSelectEnd: function(t, n) {
						e("#H-avaupload-dialog input[name=x1]").val(n.x1), e("#H-avaupload-dialog input[name=y1]").val(n.y1), e("#H-avaupload-dialog input[name=width]").val(n.width), e("#H-avaupload-dialog input[name=height]").val(n.height)
					},
					onSelectChange: w
				}), e("#H-image-preview-48>img, #H-image-preview-140>img").attr("src", t).show(), e("#H-avaupload-dialog input:file").val(""), e("#H-avaupload-dialog input[name=fileName]").val(n), e("#H-avaupload-dialog input[name=width]").val(Math.min(i, o)), e("#H-avaupload-dialog input[name=height]").val(Math.min(i, o)), e("#H-avaupload-dialog input[name=x1]").val(a), e("#H-avaupload-dialog input[name=y1]").val(r)
			}
		},
		T = function(t, n, i, o, a) {
			var l = s.getImgPath(n),
				d = e("#main_frame").contents();
			if("" == o) a == common.RESULT ? (getContentWindow().cardItem && (getContentWindow().cardItem.ava = l.relative), e("#head_ava").attr("src", chouti.replaceHttps(l.absolute)), "setting" == currentPage.module && d.find("#contact-ava").attr("src", chouti.replaceHttps(l.absolute)), e("#H-avaupload-dialog").remove(), s.hideMask(), s.showTopTips(s.TIPS_TYPE.success, labiTips.setAvaSuccess)) : s.showTopTips(s.TIPS_TYPE.error, c.basicErrorTips[a]);
			else if("add" == o) a == common.RESULT ? (d.find("#contact-ava").attr("src", chouti.replaceHttps(l.absolute)), e("#H-avaupload-dialog").remove(), s.hideMask(), getContentWindow().contact.setAvaForAdd(n)) : s.showTopTips(s.TIPS_TYPE.error, c.basicErrorTips[a]);
			else if(a == common.RESULT) {
				d.find("#contact-ava").attr("src", chouti.replaceHttps(l.absolute));
				for(var u = r.getAllData(), p = u.cnt, h = 0; h < p.length; h++)
					if(p[h].guid == o) {
						p[h].ava = l.relative;
						break
					}
				e("#H-avaupload-dialog").remove(), s.hideMask(), s.showTopTips(s.TIPS_TYPE.success, labiTips.setAvaSuccess)
			} else s.showTopTips(s.TIPS_TYPE.error, c.basicErrorTips[a])
		};
	NS_avaUpload = {
		init: y,
		avaUploadCallback: _,
		avaUploadFinish: T,
		flashUploadCallback: i,
		getGuid: n
	}
}(jQuery),
function(e) {
	var t = {
		enable: !0,
		target: null,
		callback: {
			onMove: function(e) {},
			onDrop: function(e) {}
		}
	};
	e.fn.drag = function(n) {
		var i = e.extend({}, t, n);
		return this.each(function() {
			if(i.enable) {
				var t = e(this);
				t.bind("mousedown", function(n) {
					var o = i.target || t.parent().parent(),
						a = o.outerHeight(),
						s = o.outerWidth(),
						r = o.offset(),
						l = r.left,
						c = r.top,
						d = l,
						u = c,
						p = {
							left: l,
							top: c,
							pageX: n.pageX,
							pageY: n.pageY
						},
						h = e("<div></div>").appendTo(document.body),
						f = e(document),
						m = document.documentElement || document.body,
						g = Math.max(m.scrollWidth, m.clientWidth),
						v = Math.max(m.scrollHeight, m.clientHeight),
						b = {
							move: function(e) {
								window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(), l = d + e.pageX - e.data.pageX, c = u + e.pageY - e.data.pageY, parseInt(l) < 0 && (l = 0), parseInt(c) < 0 && (c = 0), c > v - a && (c = v - a), l > g - s && (l = g - s), h.css({
									left: l,
									top: c
								}), i.callback.onMove(e)
							},
							drop: function(e) {
								h.remove(), o.css({
									left: l,
									top: c
								});
								var t = o.data("shim");
								t && t.css({
									left: l,
									top: c
								}), f.unbind("mousemove", b.move).css("cursor", ""), i.callback.onDrop(e)
							}
						};
					f.css("cursor", "move"), h.css({
						height: o.outerHeight(),
						width: o.outerWidth(),
						border: "1px dotted #333",
						cursor: "move",
						position: "absolute",
						zIndex: parseInt(o.css("z-index")) + 1,
						left: l,
						top: c
					}), f.bind("mousemove", p, b.move).bind("mouseup", p, b.drop)
				})
			}
		})
	}
}(jQuery),
function(e) {
	var t, n, i = e.gozap,
		o = i.labi,
		a = o.i18n,
		s = a.common,
		r = a.sms,
		l = (a.ui.dialog, "dialog "),
		c = {
			id: "labi-dialog",
			title: "",
			titleImgClass: "",
			closeText: s.close,
			content: "",
			height: "auto",
			width: 300,
			maxHeight: !1,
			maxWidth: !1,
			minHeight: 150,
			minWidth: 150,
			position: "center",
			zIndex: 100,
			dialogClass: "",
			draggable: !0,
			showMask: !0,
			buttons: {},
			otherButtonPaneElem: !1,
			target: null,
			autoClose: !1,
			closeButtonHandler: null,
			container: !1,
			closeDialogCallback: !1,
			showCloseButton: !0,
			contentClass: ""
		};
	e.dialog = function(t) {
		return n = e.extend({}, c, t), d(n)
	};
	var d = function(n) {
			e("#" + n.id).length > 0 && e("#" + n.id).remove();
			var i = n.container || e(document.body);
			t = e("<div></div>").appendTo(i).css({
				zIndex: n.zIndex
			}).addClass(l + n.dialogClass).attr("id", n.id);
			var o = e("<div></div>").addClass("dialog-titlebar").prependTo(t),
				a = e("<div></div>").addClass("dialog-title ").append(e("<div></div>").addClass(n.titleImgClass)).append(e("<span></span>").html(n.title)).appendTo(o),
				r = (e("<div></div>").html(n.content).addClass("dialog-content " + n.contentClass).appendTo(t), n.id);
			return h(n.buttons, n.showMask, r), n.showCloseButton && e("<div></div>").addClass("dialog-titlebar-close").click(function() {
				var e, t = n.buttons[s.buttonText.cancel];
				t && !1 === (e = t.apply(this, arguments)) || f(n.showMask, n.id), e === MASK_HOLD && u()
			}).hover(function() {
				e(this).css("background-position", "-17px -32px")
			}, function() {
				e(this).css("background-position", "0 -32px")
			}).appendTo(o), n.showMask && u(n.zIndex - 1), e.setPosition(t, {
				target: n.target,
				container: n.container
			}), t.show(), n.autoClose && t.autoRemove(), n.draggable && a.drag(), t
		},
		u = function(e) {
			o.showMask()
		},
		p = function() {
			o.hideMask()
		},
		h = function(i, o, a) {
			var l = !1;
			if("object" == typeof i && null !== i && e.each(i, function() {
					return !(l = !0)
				}), l) {
				var c = e("<div></div>").addClass("dialog-buttonpane");
				n.otherButtonPaneElem && c.append(n.otherButtonPaneElem);
				var d = e("<div></div>").addClass("button-container").appendTo(c);
				if("H-sms-send-dialog" === a) {
					e("<span></span>").addClass("cost-tips").text(r.smsCostTips).appendTo(c);
					e.each(i, function(t, n) {
						var i;
						i = t == s.buttonText.cancel ? e('<a href="javascript:;" class="btn-cancel">' + t + "</a>").click(function() {
							"disabled" != e(this).attr("disabled") && (n && n.apply(this, arguments), f(o, a))
						}).appendTo(d) : e(common.genButtonHtml(t, "3", "sms_sender_button_send")).bind("click", function() {
							"disabled" != e(this).attr("disabled") && n.apply(this, arguments)
						}).appendTo(d)
					});
					e('<img src="' + parent.DEFAULT_SYSTEM_IMAGE_PATH + 'loading_16_16.gif" />').addClass("sms-send-load-img").appendTo(d)
				} else e.each(i, function(t, n) {
					var i;
					i = t == s.buttonText.cancel ? e(common.genButtonHtml(t, BTN_TYPE_NON_LEAD)).click(function() {
						if("disabled" != e(this).attr("disabled")) {
							var t;
							n && !1 === (t = n.apply(this, arguments)) || f(o, a), t === MASK_HOLD && u()
						}
					}).appendTo(d) : e(common.genButtonHtml(t, BTN_TYPE_LEAD)).bind("click", function() {
						if("disabled" != e(this).attr("disabled")) {
							var t;
							!1 !== (t = n.apply(this, arguments)) && f(o, a), t === MASK_HOLD && u()
						}
					}).appendTo(d)
				});
				c.appendTo(t)
			}
		},
		f = function(t, i) {
			t && p(), e("#" + i).remove(), n.closeDialogCallback && n.closeDialogCallback()
		}
}(jQuery),
function() {
	function time_radio_get_html(e, t, n) {
		for(var i = "#6598CD", o = '<div><div style="position:absolute;top:' + (25 * t + 8) + "px;font-size:9pt;font-family:tohuma,Arial;font-weight: bold;width:15px;color:" + i + ';" align="right">' + 6 * t + '</div><div style="width:' + e + "px;left:20px;position:absolute;top:" + 25 * t + 'px;"><table width="100%" height="22" border="0" cellspacing="0" cellpadding="0" id="list_' + n + "_" + t + '"><tr>', a = 0; a <= 72; a++) {
			var s = "border-bottom: 1px solid " + i + ";font-size:1pt;";
			72 == a && (s = "font-size:1pt;");
			var r = " style='" + s + "'";
			if(!(a % 2)) {
				var l = "time_x3_1_5.jpg";
				a % 12 && (l = "time_x4_1_2.jpg"), r = " style='background-image: url(" + time_radio_url_path + l + ");background-repeat: no-repeat;background-position: left bottom;font-size:1pt;" + s + "'"
			}
			o += "<td" + r + ' type_i="' + a + '" num="' + t + '">' + (browser.msie ? "&nbsp;" : "") + "</td>"
		}
		return o += '</tr></table></div><div style="position:absolute;top:' + (25 * t + 8) + "px;font-size:9pt;font-family:tohuma,Arial;font-weight: bold;width:15px;color:" + i + ";left:" + (e + 20) + 'px;" align="left">' + (6 * t + 6) + "</div></div>"
	}

	function time_radio(e, t, n) {
		function i() {
			"" == z$(e + "_radio_ok_time").style.display && o(z$(e + "_radio_ok_time").innerHTML, !0)
		}

		function o(t, n) {
			try {
				var i = t.split(":"),
					o = Math.floor(i[0] / 6),
					a = f[o].getElementsByTagName("td"),
					s = 12 * (i[0] - 6 * o) + 2 * Math.floor(i[1] / 10);
				time_radio_move_to(e, a[s].getAttribute("type_i"), a[s], a[s].getAttribute("num")), n || time_radio_ok_click(e)
			} catch(r) {}
		}
		null == t && (t = 500);
		var a = z$(e);
		a || alert("没有找到对象" + e);
		var s, r = 0,
			l = 0;
		time_radio_global_val[e] = new Object, time_radio_global_val[e].hour = 0, time_radio_global_val[e].o = a, time_radio_global_val[e].ok_fun = n;
		var c = '<div style="position:absolute;"><div style="position:absolute;left:10px;top:5px;">' + time_radio_get_html(t - 60, 0, e) + time_radio_get_html(t - 60, 1, e) + time_radio_get_html(t - 60, 2, e) + time_radio_get_html(t - 60, 3, e) + '</div><div style="position:absolute"><div style="position:absolute;left:10px;top:0px;z-index:1000;background-color:#ff0000;filter:alpha(opacity=0);opacity:0;width:' + (t - 20) + 'px;height:112px;" id="' + e + '_radio_listener"></div><input type="text" id="' + e + '_key_listener" style="width:1px;height:1px;filter:alpha(opacity=0);opacity:0;"/></div></div><div style="width:' + t + 'px;height:112px;"></div>';
		a.innerHTML = c, z$(e + "_radio_listener").innerHTML = a.firstChild.firstChild.innerHTML;
		var d = document.createElement("div");
		d.style.cssText = "position:absolute;width:0px;height:20px;border-right:2px solid #FF6503;left:20px;top:10px;", d.innerHTML = '<div id="' + e + '_radio_hand"></div>';
		var u = document.createElement("div");
		u.style.cssText = "left:-3px;top:25px;border:1px solid #FF6503;position:absolute;", u.innerHTML = '<div id="' + e + '_radio_time" align="center" style="font-size:9pt;font-family:tohuma,Arial;line-height:26px;font-weight: bold;width:46px;height:26px;background-color:#FFFFCB;cursor: default;">0:00</div>';
		var p = document.createElement("div");
		p.style.cssText = "position:absolute;", p.innerHTML = '<div id="' + e + '_radio_ok_time" align="center" style="font-size:9pt;font-family:tohuma,Arial;background-color:#CC0000;width:38px;height:18px;color:#fff;line-height:18px;display:none;">0:00</div>';
		var h = document.createElement("div");
		h.style.cssText = "position:absolute;border-right:2px solid #CC0000;width:0px;height:7px;display:none;", h.innerHTML = '<div id="' + e + '_radio_ok_heand"></div>';
		for(var f = a.firstChild.firstChild.childNodes, m = f.length - 1; m >= 0; m--) time_radio_init_tds(f[m].getElementsByTagName("td"), z$("list_" + e + "_" + m).parentNode, 6 * m + 6, e, m);
		f = z$(e + "_radio_listener").childNodes;
		for(var m = f.length - 1; m >= 0; m--) time_radio_init_td_listener(f[m].getElementsByTagName("td"), e);
		a.firstChild.firstChild.appendChild(d), a.firstChild.firstChild.appendChild(p), a.firstChild.firstChild.appendChild(h), a.firstChild.firstChild.appendChild(u), z$(e + "_key_listener").onkeyup = function(t) {
			if(null == t && (t = window.event), 13 == t.keyCode) time_radio_ok_click(e);
			else if(!s) {
				var n = this.value;
				if(this.value = "", !isNaN(n)) {
					if(500 > (new Date).getTime() - l && 24 >= parseInt(r + "" + n)) return void o(r + "" + n + ":00", !0);
					r = n, l = (new Date).getTime(), o(n + ":00", !0)
				}
			}
		}, z$(e + "_key_listener").onkeydown = function(t) {
			if(s = !1, null == t && (t = window.event), 39 == t.keyCode || 68 == t.keyCode || 37 == t.keyCode || 65 == t.keyCode || 38 == t.keyCode || 87 == t.keyCode || 40 == t.keyCode || 83 == t.keyCode) {
				time_radio_global_val[e].mousemove = !1;
				try {
					null == time_radio_global_val[e].curr_o && (time_radio_global_val[e].curr_o = f[0].getElementsByTagName("td")[0], time_radio_global_val[e].curr_i = 0, time_radio_global_val[e].curr_num = 0);
					for(var n = f[time_radio_global_val[e].curr_num].getElementsByTagName("td"), i = n.length - 1; i >= 0; i--)
						if(n[i] == time_radio_global_val[e].curr_o) {
							var a = 0;
							39 == t.keyCode || 68 == t.keyCode ? (a = 1, time_radio_global_val[e].curr_i % 2 && (a = 2)) : 37 == t.keyCode || 65 == t.keyCode ? (a = -1, time_radio_global_val[e].curr_i % 2 || (a = -2)) : 38 == t.keyCode || 87 == t.keyCode ? (time_radio_global_val[e].curr_num--, 0 > time_radio_global_val[e].curr_num && (time_radio_global_val[e].curr_num = 3), n = f[time_radio_global_val[e].curr_num].getElementsByTagName("td")) : 40 != t.keyCode && 83 != t.keyCode || (time_radio_global_val[e].curr_num++, 3 < time_radio_global_val[e].curr_num && (time_radio_global_val[e].curr_num = 0), n = f[time_radio_global_val[e].curr_num].getElementsByTagName("td"));
							var c = i + a;
							c >= n.length ? (c = 0, time_radio_global_val[e].curr_num++, 3 < time_radio_global_val[e].curr_num && (time_radio_global_val[e].curr_num = 0), n = f[time_radio_global_val[e].curr_num].getElementsByTagName("td")) : c < 0 && (time_radio_global_val[e].curr_num--, 0 > time_radio_global_val[e].curr_num && (time_radio_global_val[e].curr_num = 3), n = f[time_radio_global_val[e].curr_num].getElementsByTagName("td"), c = n.length - 1), time_radio_move_to(e, n[c].getAttribute("type_i"), n[c], n[c].getAttribute("num")), s = !0;
							break
						}
				} catch(d) {
					alert(d)
				}
			} else if(13 != t.keyCode) {
				var u = String.fromCharCode(t.keyCode);
				if(!isNaN(u)) {
					if(500 > (new Date).getTime() - l && 24 >= parseInt(r + "" + u)) return o(r + "" + u + ":00", !0), void(s = !0);
					r = u, l = (new Date).getTime(), o(u + ":00", !0), s = !0
				}
			}
		};
		var g;
		z$(e + "_radio_listener").onmouseout = function(e) {
			g = setTimeout(i, 100)
		}, z$(e + "_radio_listener").onmouseover = function(e) {
			clearTimeout(g)
		}, z$(e + "_radio_listener").onmousemove = function(t) {
			try {
				time_radio_global_val[e].mousemove = !0
			} catch(n) {}
		}, z$(e + "_radio_listener").onmouseup = function() {
			time_radio_ok_click(e)
		}, time_radio.prototype.focus = function() {
			z$(e + "_key_listener").focus()
		}, time_radio.prototype.setTime = function(e, t) {
			o(e, t)
		}
	}

	function zring_get_obj_xy(e) {
		for(var t = y = 0;
			"body" != e.nodeName.toLowerCase();) t += e.offsetLeft, y += e.offsetTop, e = e.parentNode;
		return {
			x: t,
			y: y
		}
	}

	function zring_getBody() {
		return "CSS1Compat" == document.compatMode ? document.documentElement : document.body
	}

	function getOffset(e) {
		var t = e.target;
		void 0 == t.offsetLeft && (t = t.parentNode);
		var n = getPageCoord(t),
			i = {
				x: window.pageXOffset + e.clientX,
				y: window.pageYOffset + e.clientY
			},
			o = {
				offsetX: i.x - n.x,
				offsetY: i.y - n.y
			};
		return o
	}

	function getPageCoord(e) {
		for(var t = {
				x: 0,
				y: 0
			}; e;) t.x += e.offsetLeft, t.y += e.offsetTop, e = e.offsetParent;
		return t
	}

	function time_radio_hs_keyup(e, t) {
		13 == e.keyCode ? time_radio_ok_click(t) : 67 == e.keyCode && time_radio_hidden_mask(t)
	}

	function time_radio_ok_click(e) {
		if(z$(e + "_radio_ok_time").style.display = "", z$(e + "_radio_ok_time").innerHTML = z$(e + "_radio_time").innerHTML, z$(e + "_radio_ok_time").parentNode.style.left = z$(e + "_radio_hand").parentNode.offsetLeft - z$(e + "_radio_ok_time").offsetWidth / 2 + "px", z$(e + "_radio_ok_time").parentNode.style.top = z$(e + "_radio_time").parentNode.offsetTop - 33 + "px", z$(e + "_radio_ok_heand").parentNode.style.display = "", z$(e + "_radio_ok_heand").parentNode.style.left = z$(e + "_radio_hand").parentNode.offsetLeft + "px", z$(e + "_radio_ok_heand").parentNode.style.top = z$(e + "_radio_ok_time").parentNode.offsetTop + z$(e + "_radio_ok_time").offsetHeight + "px", null != time_radio_global_val[e].ok_fun) try {
			time_radio_global_val[e].ok_fun(z$(e + "_radio_time").innerHTML)
		} catch(t) {}
	}

	function time_radio_key_down(e, t, n) {
		if(9 == e.keyCode || 8 == e.keyCode || 46 == e.keyCode || 39 == e.keyCode || 37 == e.keyCode) return !0;
		if(38 == e.keyCode || 87 == e.keyCode || 40 == e.keyCode || 83 == e.keyCode)
			if(0 == t)
				if(38 == e.keyCode || 87 == e.keyCode) {
					var i = parseInt(n.value) + 1;
					i > 24 && (i = 0), n.value = i
				} else {
					var i = parseInt(n.value) - 1;
					i < 0 && (i = 24), n.value = i
				}
		else if(38 == e.keyCode || 87 == e.keyCode) {
			var i = parseInt(n.value) + 1;
			i > 60 && (i = 0), n.value = i
		} else {
			var i = parseInt(n.value) - 1;
			i < 0 && (i = 60), n.value = i
		}
	}

	function time_radio_format_hour(e) {
		isNaN(e.value) || "" == e.value ? e.value = "0" : 24 < parseInt(e.value) && (e.value = "0")
	}

	function time_radio_format_second(e) {
		if(isNaN(e.value) || "" == e.value) e.value = "00";
		else {
			var t = parseInt(e.value);
			60 < t ? e.value = "00" : t < 10 ? e.value = "0" + t : e.value = t
		}
	}

	function time_radio_init_td_listener(e, t) {
		for(var n = e.length - 1; n >= 0; n--) e[n].onmouseover = function() {
			z$(t + "_key_listener").focus(), time_radio_global_val[t].mousemove && time_radio_move_to(t, this.getAttribute("type_i"), this, this.getAttribute("num"))
		}
	}

	function time_radio_init_tds(tds, o, endNum, id, i) {
		var col_num = "#6598CD";
		endNum--;
		for(var i = tds.length - 1; i >= 0; i--)
			if(!(i % 2 || i % 12 || 0 == i || tds.length - 1 == i)) {
				var div = document.createElement("div");
				with(div.innerHTML = endNum--, div.style) position = "absolute", left = tds[i].offsetLeft + "px", top = "0px", fontSize = "9pt", color = col_num, cursor = "default";
				o.appendChild(div)
			}
	}

	function time_radio_move_to(e, t, n, i) {
		var o = z$(e + "_radio_hand").parentNode,
			a = z$(e + "_radio_time").parentNode,
			s = t % 2 ? n.offsetLeft + n.offsetWidth + 19 : n.offsetLeft + 20;
		o.style.left = s + "px", a.style.left = s - 23 + "px", o.style.top = 25 * i + 10 + "px", a.style.top = 25 * i + 30 + "px", time_radio_global_val[e].hour = 6 * i, time_radio_global_val[e].curr_o = n, time_radio_global_val[e].curr_i = t, time_radio_global_val[e].curr_num = i, time_radio_get_time(e, t)
	}

	function time_radio_get_time(e, t) {
		var n = time_radio_global_val[e].hour;
		minute = 10 * Math.ceil(t / 2), second = minute % 60, second_str = second < 10 ? "0" + second : second;
		var i = Math.floor(n + minute / 60);
		10 > i && (i = "0" + i), z$(e + "_radio_time").innerHTML = i + ":" + second_str
	}

	function init(e, t, n) {
		var i = new time_radio(e, t, n);
		return i.focus(), i
	}
	var z$ = function(e) {
			return "string" == typeof e ? document.getElementById(e) : e
		},
		appStr = navigator.userAgent.toLowerCase(),
		browser = {
			msie: /msie/.test(appStr) && !/opera/.test(appStr),
			mozilla: /mozilla/.test(appStr) && !/(compatible|webkit)/.test(appStr),
			safari: /webkit/.test(appStr),
			opera: /opera/.test(appStr),
			firefox: /firefox/.test(appStr)
		},
		time_radio_url_path = "https://www.labi.com/image/",
		time_radio_global_val = {};
	NS_timeRadio = {
		init: init,
		setPath: function(e) {
			time_radio_url_path = e
		}
	}
}(), jQuery.cookie = function(e, t, n) {
		if("undefined" == typeof t) {
			var i = null;
			if(document.cookie && "" != document.cookie)
				for(var o = document.cookie.split(";"), a = 0; a < o.length; a++) {
					var s = jQuery.trim(o[a]);
					if(s.substring(0, e.length + 1) == e + "=") {
						i = decodeURIComponent(s.substring(e.length + 1));
						break
					}
				}
			return i
		}
		n = n || {}, null === t && (t = "", n.expires = -1);
		var r = "";
		if(n.expires && ("number" == typeof n.expires || n.expires.toUTCString)) {
			var l;
			"number" == typeof n.expires ? (l = new Date, l.setTime(l.getTime() + 24 * n.expires * 60 * 60 * 1e3)) : l = n.expires, r = "; expires=" + l.toUTCString()
		}
		var c = n.path ? "; path=" + n.path : "",
			d = n.domain ? "; domain=" + n.domain : "",
			u = n.secure ? "; secure" : "";
		document.cookie = [e, "=", encodeURIComponent(t), r, c, d, u].join("")
	},
	function($) {
		var G = $.gozap,
			L = G.labi,
			i18n = L.i18n,
			i18nfeedback = i18n.feedback,
			ResultCodeSuccess = L.RESULT_CODE.success,
			timePool = null,
			oldTime = "",
			htimePool = null,
			qita = 1,
			jubaoTime1 = null;
		chouti = {
			replaceHttps: function(e) {
				return e.indexOf("https") < 0 ? e.indexOf("http") < 0 ? e : e.split("http:")[1] : e
			},
			Init: function() {
				NS_publish_dialog.init(), chouti.showLoginDialog(), chouti.addTopTips(), chouti.showSearchBox(), chouti.playVido(), chouti.initTopNews(), chouti.initImgClickEvent(), $.browser.msie && "6.0" == $.browser.version && ($("a.discus-a b, a.user-a b, span.time-into a, a.collect-a b").hover(function() {
					$(this).css({
						"text-decoration": "underline",
						color: "#336699"
					})
				}, function() {
					$(this).css({
						"text-decoration": "none",
						color: "#99AECB"
					})
				}), $("a.discus-a, a.user-a, a.collect-a").hover(function() {
					$(this).children("b").css({
						"text-decoration": "underline",
						color: "#336699"
					})
				}, function() {
					$(this).children("b").css({
						"text-decoration": "none",
						color: "#99AECB"
					})
				})), $("a.digg-a").hover(function() {
					$(this).attr("title", "推荐")
				}, function() {
					$(this).attr("title", "")
				}), $("a.discus-a").hover(function() {
					$(this).attr("title", "评论")
				}, function() {
					$(this).attr("title", "")
				}), $("a.isVoted").hover(function() {
					$(this).attr("title", "取消推荐")
				}, function() {
					$(this).attr("title", "")
				}), $(window).resize(function() {
					var e = $(".main-content");
					if(!(e.length <= 0)) {
						var t = parseInt(e.outerWidth() + e.offset().left + 20),
							n = $("html").width();
						n < 1024 && (t = n - 300), $("#gotop").css("left", t + "px")
					}
				})
			},
			initTopNews: function() {
				var e = $("#tpl-top-content-news"),
					t = $("#tpl-top-content-comments"),
					n = $("#top-title-news"),
					i = $("#top-title-comments"),
					o = $("#top-content-news"),
					a = $("#top-content-comments"),
					s = $(".top-band-type"),
					r = $(".top-band-title");
				a.hide();
				var l = $("#top-bandArrow");
				if(n.hover(function() {
						n.removeClass("top-band-title-default").addClass("top-band-title-select"), i.removeClass("top-band-title-select").addClass("top-band-title-default"), o.show(), a.hide(), l.css("left", "70px"), chouti.fixedAdvert()
					}), i.hover(function() {
						i.removeClass("top-band-title-default").addClass("top-band-title-select"), n.removeClass("top-band-title-select").addClass("top-band-title-default"), a.show(), o.hide(), l.css("left", "220px"), chouti.fixedAdvert()
					}), Handlebars.registerHelper("ifIsVote", function(e, t, n) {
						return e == t ? n.fn(this) : ""
					}), e.length > 0) {
					var c = "/getTopTenLinksOrComments.json";
					L.ajax({
						url: c,
						type: "GET",
						dataType: "json",
						cache: !1,
						success: function(t) {
							if(9999 == t.code) {
								var n = e.html(),
									i = Handlebars.compile(n),
									a = i({
										data: t.data
									});
								o.html(a), s.css({
									display: "block"
								}), r.css({
									display: "block"
								}), chouti.fixedAdvert()
							}
						}
					});
					var d = "/getTopTenLinksOrComments.json?isGetComments=1";
					L.ajax({
						url: d,
						type: "GET",
						dataType: "json",
						cache: !1,
						success: function(e) {
							if(9999 == e.code) {
								var n = t.html(),
									i = Handlebars.compile(n),
									o = i({
										data: e.data
									});
								a.html(o), chouti.oprateDigg(), chouti.oprateDigg02()
							}
						}
					})
				}
				chouti.oprateDigg(), chouti.oprateDigg02()
			},
			oprateDigg: function() {
				$("a.hot-comment-ding, a.hot-comment-cai").click(function() {
					var e = $(this);
					if(e.attr("class").indexOf("ding") >= 0) var t = 1;
					else var t = -1;
					var n = e.attr("linkid"),
						i = e.attr("jid"),
						o = e.attr("lang"),
						a = "/comments/vote",
						s = {
							url: a,
							type: "POST",
							data: G.param({
								linkId: n,
								id: o,
								jid: i,
								vote: t
							}),
							success: function(n) {
								if(n.code == ResultCodeSuccess) 1 == t ? ($(e).html("已顶[" + n.data + "]"), $(e).removeClass("top-comm-operate-pre").addClass("top-comm-operate-after"), $(e).siblings(".hot-comment-cai").removeClass("top-comm-operate-pre").addClass("top-comm-operate-after"), $(e).unbind("click"), $(e).siblings(".hot-comment-cai").unbind("click")) : ($(e).html("已踩[" + n.data + "]"), $(e).removeClass("top-comm-operate-pre").addClass("top-comm-operate-after"), $(e).siblings(".hot-comment-ding").removeClass("top-comm-operate-pre").addClass("top-comm-operate-after"), $(e).unbind("click"), $(e).siblings(".hot-comment-ding").unbind("click")), chouti.executeBeforOprate(!0);
								else {
									if("22157" != n.code) return !!chouti.reponseNoLogin(n.code, n.message, "投票成功") && void L.showTopTips(L.TIPS_TYPE.error, n.message);
									$("#login_ajaxInfo").val("投票成功")
								}
							}
						};
					$("#isAjax").data("ajax", s), L.ajax(s)
				})
			},
			oprateDigg02: function() {
				$("a.ding, a.cai").unbind("click").click(function() {
					var e = $(this);
					if(e.removeClass("hover"), "ding" == e.attr("class")) var t = 1;
					else var t = -1;
					var n = e.attr("linkid") ? e.attr("linkid") : $(".part2 i").length > 0 ? $(".part2 i").html() : "",
						i = e.attr("jid"),
						o = e.attr("lang"),
						a = "/comments/vote",
						s = {
							url: a,
							type: "POST",
							data: G.param({
								linkId: n,
								id: o,
								jid: i,
								vote: t
							}),
							success: function(n) {
								if(n.code == ResultCodeSuccess) 1 == t ? ($(e).find(".ding-num").html("[" + n.data + "]").css("color", "#C30"), $(e).css({
									cursor: "text",
									color: "#B4B4B4",
									"text-decoration": "none"
								}).unbind().siblings(".cai").unbind(), $(e).find("b").html("已顶"), $(e).hover(function() {
									$(this).css("text-decoration", "none")
								}), $(e).siblings(".cai").css({
									cursor: "text",
									color: "#B4B4B4"
								}).hover(function() {
									$(this).css("text-decoration", "none")
								})) : ($(e).find(".cai-num").html("[" + n.data + "]").css("color", "#C30"), $(e).css({
									cursor: "text",
									color: "#B4B4B4",
									"text-decoration": "none"
								}).unbind().siblings(".ding").unbind(), $(e).find("b").html("已踩"), $(e).hover(function() {
									$(this).css("text-decoration", "none")
								}), $(e).siblings(".ding").css({
									cursor: "text",
									color: "#B4B4B4"
								}).hover(function() {
									$(this).css("text-decoration", "none")
								})), chouti.executeBeforOprate(!0);
								else {
									if("22157" != n.code) return !!chouti.reponseNoLogin(n.code, n.message, "投票成功") && void L.showTopTips(L.TIPS_TYPE.error, n.message);
									$("#login_ajaxInfo").val("投票成功")
								}
							}
						};
					$("#isAjax").data("ajax", s), L.ajax(s)
				})
			},
			showHomePageNotice: function() {
				$("#btnDtaiShw").click(function() {
					$("#Dtai-em").css("display", "none")
				}), $("#btnNotShw").unbind("click").click(function() {
					var e = $("#user_notice_page");
					if("block" == e.css("display")) return void e.hide();
					"" != $(this).find(".notice-no").html() || $(this).find(".notice-no").hasClass("notice-no-more") || (location.href = "/message/1");
					var t = $("#btnNotShw").offset().left - 170;
					e.css("left", t + "px").show(), $("#userOprBox").hide();
					var n = "/message/topShow";
					L.ajax({
						url: n,
						type: "GET",
						dataType: "json",
						success: function(n) {
							if(n.code == ResultCodeSuccess) {
								if(n.data.items <= 0) return void(location.href = "/message/1");
								var i = $("#homeNotice-template").html(),
									o = Handlebars.compile(i),
									a = o(n.data);
								$("#notice_box").html(a), chouti.chgNoticeTag(), $(".f-close").click(function(e) {
									var n = $(this).attr("lang");
									chouti.setNoticeRead(n, "", t)
								}), $(".GB_tongzhi").click(function(e) {
									var n = $(this).parent().attr("lang");
									chouti.setNoticeRead(n, "", t)
								}), $(".f-list .f-t .f-href ").click(function() {
									var e = $(this).parent().attr("lang");
									chouti.setNoticeRead(e, "", t)
								}), $("#btnReadAll").click(function() {
									chouti.setNoticeRead("", "all", t)
								}), $(".f-list .f-t .f-href, .f-list .f-t .a-jid,.GB_tongzhi").click(function() {
									e.hide()
								}), chouti.homePageNotice(), chouti.listerDocu("#user_notice_page", "btnNotShw", "notice-num-title")
							}
						}
					})
				})
			},
			chatMskIframe: function(e, t, n) {
				"hide" == e ? ($(t).hide(), $("#maskIframe").hide()) : ($(t).show(), chouti.changeMskIframeHe(t, n))
			},
			changeMskIframeHe: function(e, t) {
				var n = $(e).height(),
					i = $(e).width();
				"#userOprBox" == e && (n += 2, i += 2), $("#maskIframe").css({
					display: "block",
					width: i + "px",
					height: n + "px",
					left: t + "px"
				})
			},
			listerDocu: function(e, t, n, i) {
				$(document).unbind().click(function(n) {
					var i = $(e),
						o = n || window.event,
						a = o.srcElement || o.target;
					return a && a.id && a.id != t && i.find("#" + a.id).length > 0 ? void i.show() : void(a.id == t || "notice-em" == a.id || "ico_notice_span" == a.id || $(a).hasClass("ico-notice") || i.hide())
				})
			},
			chgNoticeTag: function() {
				$("#user_notice_page .f-list").each(function() {
					var e = $(this),
						t = e.attr("messageid"),
						n = e.attr("id");
					e.attr("content");
					if(2 == t || 3 == t || 11 == t || 10 == t) switch(t) {
						case "10":
							e.find("#bs_" + n).removeClass("f-bs-s").addClass("f-bs-w");
							break;
						case "11":
							e.find("#bs_" + n).removeClass("f-bs-s").addClass("f-bs-f");
							break;
						case "2":
							e.find("#bs_" + n).removeClass("f-bs-s").addClass("f-bs-p");
							break;
						case "3":
							e.find("#bs_" + n).removeClass("f-bs-s").addClass("f-bs-h")
					}
				})
			},
			setNoticeRead: function(e, t, n) {
				if("" == t) var i = "/message/read?" + G.param({
					id: e
				});
				else var i = "/message/read?" + G.param({
					isAll: !0
				});
				L.ajax({
					url: i,
					type: "POST",
					success: function(n) {
						if(n.code != ResultCodeSuccess) return void L.showTopTips(L.TIPS_TYPE.error, n.message);
						var i = n.data;
						chouti.chgNoticeNum(i), "" == t ? $("#" + e).remove() : $("#user_notice_page").hide()
					}
				})
			},
			homePageNotice: function() {
				$("#user_notice_page .f-list").hover(function() {
					$(this).find(".f-close").show()
				}, function() {
					$(this).find(".f-close").hide()
				})
			},
			chgNoticeNum: function(e) {
				var t = $("#notice-num-title");
				if(!(e < 0)) return 0 == e ? void t.hide().children(".notice-no").text("") : e > 99 ? void t.show().find(".notice-no").addClass(".notice-no-more") : void t.find(".notice-no").text(e)
			},
			chgMailNum: function(e) {
				var t = $("#mail-num-title");
				if(!(e < 0)) {
					if(0 == e) return void t.hide().children("em").text("");
					if(e > 99) return t.css("display", "inline-block").children("em").text("99"), void t.children("i").css("display", "inline-block");
					t.css("display", "inline-block").children("em").text(e), t.children("i").hide()
				}
			},
			chgDtaiNum: function(e) {
				var t = $("#Dtai-num-title");
				if(!(e < 0)) return 0 == e ? void t.hide().children("div").text("") : 1 == e ? void t.show() : void 0
			},
			countNumShare: function(e, t, n) {
				var i = "/share/site/stat?" + G.param({
					linksId: e,
					siteId: t,
					state: n
				});
				L.ajax({
					url: i,
					type: "POST",
					success: function(e) {
						e.code == ResultCodeSuccess
					}
				})
			},
			attention: function(e) {
				if(e) {
					var t = $(".main-content");
					if(t.length <= 0) return;
					var n = parseInt(t.outerWidth() + t.offset().left);
					$("#attention-area").css("left", n + 1 + "px").show()
				} else $("#attention-area").css("z-index", "-1")
			},
			returnShareVal: function(e) {
				var t = e.parent().parent().parent(".part2"),
					n = t.attr("share-title"),
					i = t.attr("share-linkid"),
					o = "http://" + window.location.host + "/link/" + i,
					a = t.attr("share-pic"),
					s = t.attr("share-summary"),
					r = t.attr("share-subject");
				"" != a && void 0 != a || (a = "");
				var l = [];
				return l[0] = n, l[1] = o, l[2] = a, l[3] = s, l[4] = i, l[5] = r, l
			},
			shareToSina: function(e, t, n) {
				var i = {
						url: t,
						appkey: "579273896",
						title: e,
						pic: n.replace("=C60x60", ""),
						ralateUid: "1821459487",
						searchPic: "false"
					},
					o = [];
				for(var a in i) o.push(a + "=" + encodeURIComponent(i[a] || ""));
				var s = "http://service.weibo.com/share/share.php?" + o.join("&");
				window.open(s, "", "width=700, height=480, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no")
			},
			shareToDouban: function(e, t, n, i) {
				var o = document,
					a = encodeURIComponent,
					s = window.getSelection,
					r = o.getSelection,
					l = o.selection,
					c = s ? s() : r ? r() : l ? l.createRange().text : "",
					d = "http://www.douban.com/recommend/?url=" + a(t) + "&title=" + a(e) + "&image=" + a(n.replace("=C60x60", "")) + "&text=" + a(i) + "&sel=" + a(c) + "&v=1",
					u = function() {
						window.open(d, "douban", "toolbar=0,resizable=1,scrollbars=yes,status=1,width=450,height=330") || (location.href = d + "&r=1")
					};
				/Firefox/.test(navigator.userAgent) ? setTimeout(u, 0) : u()
			},
			shareToqqzone: function(e, t, n, i) {
				var o = {
						url: t,
						desc: "",
						summary: i,
						title: e,
						site: "抽屉新热榜",
						pics: n.replace("=C60x60", "")
					},
					a = [];
				for(var s in o) a.push(s + "=" + encodeURIComponent(o[s] || ""));
				var r = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + a.join("&");
				window.open(r, "", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no")
			},
			shareToTenxun: function(e, t, n) {
				var i = encodeURIComponent(t) + " (分享自@choutixinrebang)",
					o = encodeURI(n.replace("=C60x60", "")),
					a = e;
				document.getElementsByTagName("meta");
				a.length > 120 && (a = a.substr(0, 117) + "..."), a = encodeURI(a);
				var s = "http://share.v.t.qq.com/index.php?c=share&a=index&url=" + i + "&appkey=801059706&pic=" + o + "&assname=抽屉新热榜&title=" + a;
				window.open(s, "", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no")
			},
			shareToRenren: function(e, t, n, i) {
				var o = {
					resourceUrl: t,
					pic: n.replace("=C60x60", ""),
					title: e,
					description: i
				};
				rrShareOnclick(o)
			},
			shareToMail: function(e, t, n) {
				$("#MailShare-dialog").length <= 0 && $("#footer-band").append($("#sendMail-model").html()), chouti.showMask("#MailShare-dialog", "top");
				var i = n.offset().top - $("#MailShare-dialog").height() / 2 + 30;
				i <= 0 && (i = 30), $("#mask").show(), $("#MailShare-dialog").show().css("top", i + "px"), $("#chatIframe").css({
					height: "0px",
					width: "0px"
				}), chouti.initMailDialog(e, t), chouti.sendMail(e, t)
			},
			bindShareWeibo: function(e) {
				var t = ".part2 .share-site-to .share-icon ";
				$("body").off("click", t + ".icon-sina").on("click", t + ".icon-sina", function() {
					var t = chouti.returnShareVal($(this), e),
						n = t[0],
						i = t[1],
						o = t[2],
						a = t[3],
						s = t[4];
					chouti.shareToSina(n, i, o, a), chouti.countNumShare(s, 1, 1)
				}), $("body").off("click", t + ".icon-douban").on("click", t + ".icon-douban", function() {
					var e = chouti.returnShareVal($(this)),
						t = e[0],
						n = e[1],
						i = e[2],
						o = e[3],
						a = e[4];
					chouti.shareToDouban(t, n, i, o), chouti.countNumShare(a, 2, 1)
				}), $("body").off("click", t + ".icon-qqzone").on("click", t + ".icon-qqzone", function() {
					var e = chouti.returnShareVal($(this)),
						t = e[0],
						n = e[1],
						i = e[2],
						o = e[3],
						a = e[4];
					chouti.shareToqqzone(t, n, i, o), chouti.countNumShare(a, 3, 1)
				}), $("body").off("click", t + ".icon-tenxun").on("click", t + ".icon-tenxun", function() {
					var e = chouti.returnShareVal($(this)),
						t = e[0],
						n = e[1],
						i = e[2],
						o = e[3],
						a = e[4];
					chouti.shareToTenxun(t, n, i, o), chouti.countNumShare(a, 4, 1)
				}), $("body").off("click", t + ".icon-renren").on("click", t + ".icon-renren", function() {
					var e = chouti.returnShareVal($(this)),
						t = e[0],
						n = e[1],
						i = e[2],
						o = e[3],
						a = e[4];
					chouti.shareToRenren(t, n, i, o), chouti.countNumShare(a, 5, 1)
				}), $("body").off("click", t + ".icon-mail").on("click", t + ".icon-mail", function() {
					var e = chouti.returnShareVal($(this)),
						t = e[0] + " （分享自 @抽屉新热榜）",
						n = e[1],
						i = e[4],
						o = e[5];
					"段子" == o && (t = "【段子】" + t), chouti.shareToMail(t, n, $(this)), chouti.countNumShare(i, 6, 1)
				})
			},
			initMailDialog: function(e, t) {
				$("#receiveName").val(""), $("#mailTitle").val(""), $("#MailErrDesc").html(""), $("#mailContent").val(e + "\n" + t), $("#sendMailBtn").addClass("new-pub-btn-unvalid").removeClass("new-pub-btn-valid"), $("#MailShare-dialog :text, #MailShare-dialog textarea").focus(function() {
					$(this).css("border", "1px solid #88afd5")
				}).blur(function() {
					$(this).css("border", "1px solid #bdc9d2")
				}), $("#receiveName").focus(), $.extend({
					inputMail: function(e, t) {
						var n = document.getElementById(e);
						null != n && n.addEventListener("input", t, !1)
					}
				}), $.inputMail("receiveName", function() {
					chouti.listenMailTxt("receiveName", "mailTitle")
				}), $.inputMail("mailTitle", function() {
					chouti.listenMailTxt("mailTitle", "receiveName")
				}), $("#dialog-mail-close, #clear-btn-mail").click(function() {
					$("#MailShare-dialog").hide(), $("#mask").hide().remove(), $("#chatIframe").css({
						height: "475px",
						width: "300px"
					})
				})
			},
			listenMailTxt: function(e, t) {
				var n = $("#" + e).val(),
					i = $.trim($("#" + t).val());
				return "" == $.trim(n) ? void $("#sendMailBtn").addClass("new-pub-btn-unvalid").removeClass("new-pub-btn-valid") : void("" != i && $("#sendMailBtn").addClass("new-pub-btn-valid").removeClass("new-pub-btn-unvalid"))
			},
			sendMail: function(e, t) {
				$("#sendMailBtn").unbind().click(function() {
					var n = $.trim($("#receiveName").val()),
						i = $.trim($("#mailTitle").val());
					if("" != n && "" != i || !$("#sendMailBtn").hasClass("new-pub-btn-unvalid")) {
						if(!gozapCommon.isEmail(n)) return void $("#MailErrDesc").html("邮箱格式不合法，请重新输入").show();
						$("#sendMailBtn").hide(), $("#mailSend-loading").css("display", "inline-block");
						var o = ($("#mailContent").val(), "/share/mail");
						L.ajax({
							url: o,
							type: "POST",
							data: {
								receiver: n,
								subject: i,
								content: e,
								url: t
							},
							success: function(e) {
								if(e.code == ResultCodeSuccess) return L.showTopTips(L.TIPS_TYPE.success, e.message), $("#sendMailBtn").show().addClass("new-pub-btn-unvalid").removeClass("new-pub-btn-valid"), $("#mailSend-loading").css("display", "none"), void $("#dialog-mail-close").click();
								var t = e.message;
								return $("#MailErrDesc").html(t).show(), $("#sendMailBtn").show(), $("#mailSend-loading").css("display", "none"), void(ispublishing = !1)
							}
						})
					}
				})
			},
			shareweibo: function(e) {
				chouti.bindShareWeibo(e);
				var t = "<span class='share-site-to' style='visibility:visible'><i>分享到</i><span class='share-icon'><a class='icon-sina' id='icon-sina' title='分享到新浪微博' href='javascript:;' hidefocus='true'></a><a class='icon-douban' id='icon-douban' title='分享到豆瓣' href='javascript:;' hidefocus='true'></a><a class='icon-qqzone' id='icon-qqzone' title='分享到QQ空间' href='javascript:;' hidefocus='true'></a><a class='icon-tenxun' id='icon-tenxun' title='分享到腾讯微博' href='javascript:;' hidefocus='true'></a><a class='icon-renren' id='icon-renren' title='分享到人人网' href='javascript:;' hidefocus='true'></a><a class='share-none'> </a></span></span>";
				chouti.checkserAgent() ? $("#content-list .item").each(function() {
					$(this).find(".part2").append(t)
				}) : $("#content-list .item").hover(function(e) {
					if($(this).find(".show-content-grey, .show-content").length > 0) {
						var n = $(this).find(".part2"),
							i = n.find(".share-site-to");
						i.length <= 0 && n.append(t), i.css({
							display: "inline-block"
						})
					}
				}, function() {
					$(this).find(".share-site-to").css("display", "none")
				})
			},
			showItemDomain: function() {
				$("#content-list .item").hover(function() {
					$(this).find("span.content-source").show()
				}, function() {
					$(this).find("span.content-source").hide()
				})
			},
			addTopTips: function() {
				var e = "<div id='tips_top_container' style='display: none;'>";
				e += "<div class='inline-block tips-top'>", e += "<span class='tips-top-text' style='margin: 0pt 30px 0pt 10px;'></span>", e += "<a class='icon-common icon-close-success' href='javascript:;' style='display: block;'></a>", e += "</div></div>", $("body").append(e), $(".icon-close-success").click(function() {
					$("#tips_top_container").hide()
				})
			},
			showStreamNotice: function() {
				var e = "/message/unread/count";
				L.ajax({
					url: e,
					type: "GET",
					cache: !1,
					success: function(e) {
						e.code == ResultCodeSuccess && chouti.showNoticeCount(parseInt(e.data), $("#notice-num-title"))
					}
				})
			},
			showStreamDtai: function() {
				var e = "/flow/state";
				L.ajax({
					url: e,
					type: "GET",
					cache: !1,
					success: function(e) {
						if(e.code == ResultCodeSuccess) {
							var t = e.data;
							chouti.showDtaiCount(parseInt(t.flowState), $("#Dtai-num-title"))
						}
					}
				})
			},
			getCaptchaAction: function(e, t) {
				var n = "/captcha/init.do";
				L.ajax({
					url: n,
					type: "GET",
					cache: !1,
					success: function(n) {
						if(n.code == ResultCodeSuccess) {
							var i = n.data;
							initGeetest({
								gt: i.gt,
								challenge: i.challenge,
								product: e,
								offline: !i.success
							}, t)
						}
					}
				})
			},
			showStreamMail: function() {
				var e = "/letter/noread/count.do";
				L.ajax({
					url: e,
					type: "GET",
					cache: !1,
					success: function(e) {
						e.code == ResultCodeSuccess && chouti.showNoticeCount(parseInt(e.data), $("#mail-num-title"))
					}
				})
			},
			getNewIntoHot: function(e, t) {
				var n = "/comet/channel/" + e;
				L.ajax({
					url: n,
					type: "GET",
					success: function(e) {
						e.code == ResultCodeSuccess && $(t).attr("src", chouti.replaceHttps(e.data))
					}
				})
			},
			showNoticeCount: function(e, t) {
				if("number" == typeof e) {
					var n = e,
						i = n;
					if(n < 1) return i = "", void t.hide();
					if(n > 99) {
						var i = "99";
						return void t.show().children("div").addClass("notice-no-more")
					}
					t.show().find(".notice-no").text(i)
				}
			},
			showDtaiCount: function(e, t) {
				if("number" == typeof e) {
					var n = e;
					if(0 == n || "" == n) return void t.hide();
					1 == n && chouti.chgDtaiNum(n)
				}
			},
			logout: function() {
				$(".logout").click(function() {
					var e = "/logout";
					L.ajax({
						url: e,
						success: function(e) {
							if(e.code == ResultCodeSuccess) {
								localStorage.removeItem("jid");
								var t = window.location.href;
								if(t.indexOf("user/link/saved") > 0) {
									var n = $("#i_jid").text();
									window.location.href = "/user/" + n + "/submitted/1"
								}
								t.indexOf("/letter") > 0 || t.indexOf("chattarget") ? window.location.href = "/" : window.location.reload()
							}
						}
					})
				})
			},
			tabsNavPage: function() {
				$("#tabs-nav .tb").click(function() {
					window.location.href = $(this).children("a").attr("href")
				}), $("#person-tabs-nav .tb").click(function() {
					window.location.href = $(this).children("a").attr("href")
				})
			},
			showMask: function(e, t) {
				var n = $("body").height(),
					i = $("body").width(),
					o = parseInt(i / 2) - parseInt($(e).width() / 2),
					a = document.documentElement.clientHeight || document.body.clientHeight,
					s = parseInt(a / 2) - parseInt($(e).height() / 2) + parseInt($(window).scrollTop());
				"" == t ? $(e).css({
					left: o,
					top: s
				}) : $(e).css({
					left: o
				}), n = parseInt($("body").height()), a = parseInt(a), n = n > a ? n : a, mask = "<div class='op mask' id='mask' style='width: " + i + "px; height: " + n + "px;filter: alpha(opacity=50)'></div>", $("body").append(mask)
			},
			showUploadImgDialog: function() {
				$("#modifyPersonPhoto").click(function() {
					chouti.showMask("#H-avaupload-dialog", ""), $("#mask").show(), $("#H-avaupload-dialog").show()
				})
			},
			hidPublishWindow: function() {
				$("#publishBtn").hide()
			},
			clearTimeInterval: function() {
				window.clearInterval(timePool), window.clearInterval(htimePool)
			},
			timeChange: function() {
				timePool = window.setInterval(function() {
					$("#content-list .item").each(function() {
						var e = $(this).find(".timeIntoPool").html(),
							t = $(this).data("nowTotalTime");
						if(void 0 == t || null == t) {
							if(!e) return !1;
							var n = e.substring(e.indexOf(",") + 1);
							n = parseFloat(n / 1e3) + 6e4 + 6e4, $(this).data("nowTotalTime", n + 6e4)
						} else {
							var n = parseFloat($(this).data("nowTotalTime"));
							$(this).data("nowTotalTime", n + 6e4)
						}
						oldTime = e.substring(0, e.indexOf(",")), oldTime = parseFloat(oldTime / 1e3) + 6e4;
						var i = chouti.getDifferTime(n, oldTime);
						$(this).children(".news-content").children(".part2").children(".time-into").children(".time-a").children("b").html(i)
					})
				}, 6e4)
			},
			HttimeChange: function() {
				htimePool = window.setInterval(function() {
					$(".topic-c-box").each(function() {
						var e = $(this).find(".detail-c").find(".item"),
							t = e.find(".timeIntoPool").html(),
							n = $(this).data("nowTotalTime");
						if(void 0 == n || null == n) {
							var i = t.substring(t.indexOf(",") + 1);
							i = parseFloat(i / 1e3) + 6e4 + 6e4, $(this).data("nowTotalTime", i + 6e4)
						} else {
							var i = parseFloat($(this).data("nowTotalTime"));
							$(this).data("nowTotalTime", i + 6e4)
						}
						oldTime = t.substring(0, t.indexOf(",")), oldTime = parseFloat(oldTime / 1e3) + 6e4;
						var o = chouti.getDifferTime(i, oldTime);
						$(this).children(".time-p").children(".pb").children("i").html(o)
					})
				}, 6e4)
			},
			getDifferTime: function(e, t) {
				if("" != t) {
					var n = 1e3,
						i = t;
					if(e - i <= 60 * n) return "小于1分钟前";
					if(e > i && e - i < 3600 * n) return parseInt((e - i) / (60 * n)) + "分钟前";
					if(e > i && e - i < 86400 * n) {
						var o = parseInt((e - i) / (3600 * n)),
							a = parseInt((e - i - 60 * o * 60 * n) / (60 * n));
						return a < 59 && (a += 1), o + "小时" + a + "分钟前"
					}
					if(e > i && e - i < 2592e3 * n) {
						var s = parseInt((e - i) / (86400 * n)),
							o = parseInt((e - i - 60 * s * 60 * 24 * n) / (3600 * n));
						return o < 23 && (o += 1), s + "天" + o + "小时前"
					}
				}
			},
			showPublishWindow: function(e) {
				$("#publishBtn").click(chouti.pubNews)
			},
			pubNews: function(e) {
				var t = "/link/share",
					n = {
						url: t,
						type: "POST",
						success: function(t) {
							var n = t.code;
							if(n != ResultCodeSuccess) return "22157" == t.code ? void $("#login_ajaxInfo").val("publish") : !!chouti.reponseNoLogin(n, t.message, "publish") && void L.showTopTips(L.TIPS_TYPE.error, t.message);
							if("publish" != $("#login_ajaxInfo").val()) {
								$("#chatIframe").css({
									height: "0px",
									width: "0px"
								}), $("#digg-dialog-publish").length <= 0 && ($("#footer-band").append($("#publish-dialog-code").html()), NS_publish_dialog.init(), "huati" == e && chouti.initHtInfo(), $(".dialog-title").drag()), NS_publish_dialog.clearAllTextInput(), chouti.showMask("#digg-dialog-publish", "top"), $("#mask").show(), $("#digg-dialog-publish").show().css("top", "130px"), $("#pubTabZixun").click();
								var i = $("#publishBtn").attr("lang");
								chouti.showOrHidePubtoBox(i)
							}
							chouti.executeBeforOprate(!1)
						}
					};
				$("#isAjax").data("ajax", n), L.ajax(n)
			},
			showOrHidePubtoBox: function(e) {
				switch(e) {
					case "news":
						$("#pubTabDuanzi").hide(), $("#pubTabPic").hide(), $("#to-btn-zixun").show().siblings("a").hide();
						break;
					case "scoff":
						$("#pubTabPic").hide(), $("#to-btn-duanzi").show().click().siblings("a").hide(), $("#to-btn-duanzi2").show().siblings("a").hide();
						break;
					case "pic":
						$("#pubTabDuanzi").hide(), $("#to-btn-pic").show().click().siblings("a").hide(), $("#to-btn-pic2").show().siblings("a").hide();
						break;
					case "tec":
						$("#pubTabDuanzi").hide(), $("#pubTabPic").hide(), $("#to-btn-tec").show().click().siblings("a").hide();
						break;
					case "pub":
						$("#pubTabDuanzi").hide(), $("#to-btn-unfavor").show().click().siblings("a").hide(), $("#to-btn-unfavor2").show().click().siblings("a").hide();
						break;
					case "ask":
						$("#pubTabZixun").show(), $("#pubTabDuanzi").show(), $("#pubTabPic").show(), $("#to-btn-ask").show().click().siblings("a").hide(), $("#to-btn-ask2, #to-btn-ask3").show().click().siblings("a").hide();
						break;
					default:
						$("#pubTabZixun").show(), $("#pubTabDuanzi").show(), $("#pubTabPic").show()
				}
			},
			initHtInfo: function() {
				var e = $("#htPubBtn"),
					t = e.attr("lang"),
					n = (e.attr("htTag"), e.attr("title"));
				$("#shareTitle").html(n), $("#hidHtTag").val("huati").attr("topicId", t)
			},
			showLoginBox: function(e) {
				$("#chatIframe").css({
					height: "0px",
					width: "0px"
				}), $(".module-login-mask").show(), $(".module-login-mask").find(".box-active").removeClass("box-active"), e ? ($(".module-login-mask").find(".box-register").find(".header").eq(1).addClass("box-active"), $(".module-login-mask").find(".rgmobile").focus()) : ($(".module-login-mask").find(".box-login").find(".header").addClass("box-active"), 2 == localStorage.getItem("logintype") ? $(".module-login-mask").find(".userid").focus() : $(".module-login-mask").find(".mobile").focus())
			},
			showLoginDialog: function() {
				$("#reg-link-a, #reg-link-a-a").click(function() {
					chouti.showLoginBox("reg")
				}), $("#login-link-a, #login-link-a-a").click(function() {
					chouti.showLoginBox()
				})
			},
			isVideoUrl: function(e) {
				var t = "^(http://)(\\S){0,}((v.youku.com)|(player.youku.com)|(static.youku.com)|(tudou.com)|(js.tudouui.com)|(iqiyi.com)|(video.qiyi.com)|(17173.tv.sohu.com)|(tv.sohu.com)|(vrs.sohu.com)|(v.qq.com)|(video.qq.com)|(imgcache.qq.com)|(v.ku6.com)|(player.ku6.com)|(player.ku6cdn.com)|(v.pptv.com)|(player.pptv.com)|(player.pplive.cn)|(video.sina.com.cn)|(56.com)|(v.163.com)|(swf.ws.126.net)|(v.ent.163.com)|(joy.cn)|(letv.com)|(yinyuetai.com)|(vod.kankan.com)|(video.kankan.com)|(kankan.com/vod)|(mv.baidu.com)|(tieba.baidu.com/shipin/bw/video)|(v.pps.tv)|(player.pps.tv)|(v.ifeng.com)|(img.ifeng.com/swf)|(player.cntv.cn)|(xiyou.cntv.cn)|(m1905.com/vod/play)|(m1905.com/video/play)|(jstv.com)|(btv.com.cn/video/VID)|(v.iqilu.com)|(xinhuanet.com[\\S]{0,}video)|(movie.mtime.com)|(v1.cn)|(v.zol.com)|(tv.tom.com[\\S]{1,}video_id=[\\d]{1,})|(tv.tom.com[\\S]{1,}\\.swf[\\S]{1,}video=)|(boosj.com\\/[\\d]{4,})|(static.boosj.com)|(video.baomihua.com)|(acfun.tv/v/ac[\\d]{4,})|(bilibili.smgbb.cn/video/av[\\d]{4,})|(video6.smgbb.cn)|(kugou.com[\\S]{1,}mv_[\\d]{3,})|(weiphone.com[\\S]{1,}weplayer.swf)|(art.china))(\\S){0,}",
					n = new RegExp(t, "g");
				return null != e.match(n)
			},
			playVido: function() {
				$("a.vidio-a").unbind().bind("click", function() {
					var $spaniCon = $(this).find("span"),
						id = $(this).attr("lang"),
						flashUrl = $(this).attr("flashUrl");
					$("#comment-box-area-" + id).hide();
					var $parent = $(this).parent().parent(),
						$videoBox = $("#videoBox" + id);
					if("block" == $videoBox.css("display")) return void chouti.hidePlayVido(id);
					var ua = navigator.userAgent.toLowerCase();
					if(ua.match(/iphone/) || ua.match(/ipad/)) {
						if($("#videoBox" + id).length > 0) return;
						try {
							var loading = "<a class='loading-ico flash-loading' href='javascript:;' id='loadingF" + id + "'></a>";
							$parent.append(loading);
							var xmlhttp = new XMLHttpRequest,
								url = $parent.find("div").first().find("a").first().attr("href");
							return chouti.isVideoUrl(url) || (url = flashUrl), url = "http://" + window.location.host + "/link/videoinfo.do?url=" + encodeURIComponent(url) + "&t=" + Math.random(), xmlhttp.onreadystatechange = function() {
								if(4 == xmlhttp.readyState && 200 == xmlhttp.status) {
									$("#loadingF" + id).remove();
									var json = "",
										img = "",
										video = "";
									try {
										json = eval("(" + xmlhttp.responseText + ")"), video = json.data.videoUrlArray[0], img = json.data.imgUrl
									} catch(e) {
										$("#loadingF" + id).remove()
									}
									if(video.length > 0) {
										if(!($("#videoBox" + id).length > 0)) {
											var str = "<div class='video-box' id='videoBox" + id + "'>";
											str += "<video controls='controls' width='450' height='366' >", str += "<source src='" + video + "'/>", str += "</video>", str += "</div>", $parent.append(str), $("#videoBox" + id).show(), $spaniCon.removeClass("vidio-s").addClass("vidio-e"), $("#vidio-a-" + id).attr("title", "收起视频")
										}
									} else alert("此站点不支持ios设备")
								} else xmlhttp.status >= 400 && ($("#loadingF" + id).remove(), alert("此站点不支持ios设备"))
							}, xmlhttp.open("GET", url, !0), void xmlhttp.send()
						} catch(e) {
							$("#loadingF" + id).remove(), alert("此站点不支持ios设备")
						}
					} else chouti.requestFlashUrl(id, $parent, $spaniCon, flashUrl)
				})
			},
			hidePlayVido: function(e) {
				var t = $("#vidio-a-" + e),
					n = t.find("span");
				n.removeClass("vidio-e").addClass("vidio-s"), $("#videoBox" + e).remove(), t.attr("title", "展开视频")
			},
			requestFlashUrl: function(e, t, n, i) {
				var o = "<div class='video-box' id='videoBox" + e + "'>";
				o += "<object width='450' height='366' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' name='FlashObj" + e + "' id='FlashObj" + e + "'>", o += "<param value='" + i + "' name='movie'>", o += "<param value='high' name='quality'>", o += "<param value='always' name='allowscriptaccess'>", o += "<param value='Opaque' name='wmode'>", o += "<param value='true' name='allowfullscreen'>", o += "<embed width='450' height='366' src='" + i + "' quality='high' pluginspage='http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash' type='application/x-shockwave-flash' wmode='Opaque' allowscriptaccess='always' allowfullscreen='true' name='FlashObj" + e + "'>", o += "</object>", o += "</div>", t.append(o), $("#videoBox" + e).show(), n.removeClass("vidio-s").addClass("vidio-e"), $("#vidio-a-" + e).attr("title", "收起视频")
			},
			addCollect: function() {
				$("a.collect-a").unbind().bind("click", function(e) {
					var t = $(this),
						n = t.attr("lang"),
						i = "/link/self/add?" + G.param({
							linksId: n
						}),
						o = t.parent().parent().parent(),
						a = {
							url: i,
							type: "GET",
							error: function(e, t) {
								if(t = t.toLowerCase(), "error" === t) {
									var n = e.status.toString().substring(0, 1);
									return void("5" === n && L.showTopTips(L.TIPS_TYPE.error, i18n.common.httpError[n]))
								}
							},
							success: function(e) {
								if(e.code == ResultCodeSuccess) {
									var i = parseInt($(t).parent().css("padding-top").replace("px", "")),
										a = $("<img>", {
											src: "/images/add-save.gif?v=2.13"
										}).css({
											top: parseInt($(t).parent().position().top + i - 25) + "px",
											left: parseInt($(t).position().left - 9) + "px"
										}).addClass("add-coll-img").appendTo(o);
									a.animate({
										top: "-=10"
									}, 400, function() {}), window.setTimeout(function() {
										a.remove()
									}, 800);
									var s = t.attr("destjid"),
										r = t.attr("jid"),
										l = "<a href='javascript:;' class='remove-col-a' id='collect-a-" + n + "' lang='" + n + "' title='移出私藏' destjid='" + s + "' jid='" + r + "'><span class='hand-icon icon-collect collect-actived'></span><b>私藏</b></a>";
									t.before(l), t.remove(), $("#shu_collect").html(e.data), chouti.removeCollect(), chouti.executeBeforOprate(!0)
								} else {
									if("22157" != e.code) return !!chouti.reponseNoLogin(e.code, e.message, "添加收藏已成功") && void L.showTopTips(L.TIPS_TYPE.error, e.message);
									$("#login_ajaxInfo").val("添加收藏已成功")
								}
							}
						};
					return $("#isAjax").data("ajax", a), L.ajax(a), !1
				})
			},
			removeCollect: function() {
				$("a.remove-col-a, a.del-coll-btn").unbind().bind("click", function(e) {
					var t = $(this),
						n = t.attr("lang"),
						i = "/link/self/del?" + G.param({
							linksId: n
						}),
						o = t.parent().parent().parent(),
						a = {
							url: i,
							type: "GET",
							error: function(e, t) {
								if(t = t.toLowerCase(), "error" === t) {
									var n = e.status.toString().substring(0, 1);
									return void("5" === n && L.showTopTips(L.TIPS_TYPE.error, i18n.common.httpError[n]));
								}
							},
							success: function(e) {
								if(e.code != ResultCodeSuccess) return !!chouti.reponseNoLogin(e.code, e.message, "移出收藏已成功") && void L.showTopTips(L.TIPS_TYPE.error, e.message);
								var i = t.attr("destjid"),
									a = t.attr("jid"),
									s = parseInt($(t).parent().css("padding-top").replace("px", ""));
								if(t.hasClass("remove-col-a")) {
									var r = $("<img>", {
										src: "/images/del-save.gif?v=2.13"
									}).css({
										top: parseInt($(t).parent().position().top + s - 25) + "px",
										left: parseInt($(t).position().left - 9) + "px"
									}).addClass("mov-coll-img").appendTo(o);
									r.animate({
										top: "-=10"
									}, 400, function() {}), window.setTimeout(function() {
										r.remove()
									}, 900);
									var l = "<a href='javascript:;' class='collect-a' id='collect-a-" + n + "' lang='" + n + "' title='加入私藏' destjid='" + i + "' jid='" + a + "'><span class='hand-icon icon-collect'></span><b>私藏</b></a>";
									t.before(l), t.remove()
								}
								t.hasClass("del-coll-btn") && t.parent().slideUp("400").remove(), $("#shu_collect").html(e.data), $(".show-items #person_collect_count").html(e.data), chouti.addCollect(), chouti.executeBeforOprate(!0)
							}
						};
					return $("#isAjax").data("ajax", a), L.ajax(a), !1
				})
			},
			vote: function(e) {
				$("a.digg-a").unbind().bind("click", function(e) {
					var t = $(this);
					t.hide();
					var n = (t.parent(), t.children("b").html()),
						i = "<span class='digg-a' href='javascript:;' id='temp-a'><span class='hand-icon icon-digg'></span><b class='green'>" + n + "</b><i style='display:none'></i></span>";
					t.before(i);
					var o = t.parent().parent().parent(),
						a = t.children("i").html(),
						s = "/link/vote?" + G.param({
							linksId: a
						}),
						r = {
							url: s,
							type: "POST",
							error: function(e, n) {
								if(n = n.toLowerCase(), "error" === n) {
									var i = e.status.toString().substring(0, 1);
									return "5" === i && L.showTopTips(L.TIPS_TYPE.error, i18n.common.httpError[i]), t.css("display", "inline-block"), void $("#temp-a").remove()
								}
							},
							success: function(n) {
								if(t.css("display", "inline-block"), $("#temp-a").remove(), n.code != ResultCodeSuccess) return "22157" == n.code ? (t.children("span").removeClass("vote-actived"), void $("#login_ajaxInfo").val("推荐已成功")) : !!chouti.reponseNoLogin(n.code, n.message, "推荐已成功") && (t.children("span").removeClass("vote-actived"), L.showTopTips(L.TIPS_TYPE.error, n.message), void("30010" == n.code && 1 == $("#isAjax").val() && (window.location.reload(), $("#isAjax").val(0))));
								chouti.showDiggMove(o, e, t), t.children("span").addClass("vote-actived"), t.children("b").html(n.data.lvCount).css("color", "#9add7f").unbind();
								var i = $("#i_destjid").html(),
									a = $("#i_jid").html();
								i == a && $("#shu_digg").html(n.data.uvCount), "" == a && $("#shu_digg").html(n.data.uvCount), t.hover(function() {
									t.children("span").css("background-position", "0 -20px"), t.attr("title", "推荐")
								}, function() {
									t.children("span").css("background-position", "0 -20px"), t.attr("title", "推荐")
								}).addClass("isVoted").removeClass("digg-a").attr("title", "取消推荐").unbind(), chouti.cancelVote(), chouti.executeBeforOprate(!0)
							}
						};
					return $("#isAjax").data("ajax", r), L.ajax(r), !1
				})
			},
			cancelVote: function(e) {
				$("a.isVoted").unbind().bind("click", function(e) {
					var t = $(this);
					t.hide();
					var n = (t.parent(), t.children("b").html()),
						i = "<span class='digg-a' href='javascript:;' id='temp-a'><span class='hand-icon icon-digg'></span><b class='green'>" + n + "</b><i style='display:none'></i></span>";
					t.before(i);
					var o = t.parent().parent().parent(),
						a = t.children("i").html(),
						s = "/vote/cancel/vote.do",
						r = {
							url: s,
							type: "POST",
							data: G.param({
								linksId: a
							}),
							error: function(e, n) {
								if(n = n.toLowerCase(), "error" === n) {
									var i = e.status.toString().substring(0, 1);
									return "5" === i && L.showTopTips(L.TIPS_TYPE.error, i18n.common.httpError[i]), t.css("display", "inline-block"), void $("#temp-a").remove()
								}
							},
							success: function(n) {
								if(t.css("display", "inline-block"), $("#temp-a").remove(), n.code != ResultCodeSuccess) return !!chouti.reponseNoLogin(n.code, n.message, "取消推荐已成功") && (L.showTopTips(L.TIPS_TYPE.error, n.message), void("30010" == n.code && 1 == $("#isAjax").val() && (window.location.reload(), $("#isAjax").val(0))));
								chouti.showLessMove(o, e, t), t.children("span").removeClass("vote-actived"), t.children("b").html(n.data.lvCount).css("color", "#99AECB");
								var i = $("#i_destjid").html(),
									a = $("#i_jid").html();
								i == a && $("#shu_digg").html(n.data.uvCount), "" == a && $("#shu_digg").html(n.data.uvCount), t.hover(function() {
									t.children("span").css("background-position", "0 0"), t.attr("title", "推荐")
								}, function() {
									t.children("span").css("background-position", "0 -40px"), t.attr("title", "")
								}).removeClass("isVoted").addClass("digg-a").attr("title", "推荐").unbind(), chouti.vote(""), chouti.executeBeforOprate(!0)
							}
						};
					return $("#isAjax").data("ajax", r), L.ajax(r), !1
				})
			},
			executeBeforOprate: function(e) {
				var t = $("#isAjax").val();
				if(1 == t) {
					var n = $("#login_ajaxInfo").val();
					e && "share" != n && L.showTopTips(L.TIPS_TYPE.success, n), $("#isAjax").val(0), $("#login_ajaxInfo").val(""), $("#isAjax").data("ajax", null), window.location.reload()
				}
				$("#isAjax").data("ajax", null)
			},
			reponseNoLogin: function(e, t, n) {
				return "-1" != e && "20006" != e && "22157" != e || (chouti.showLoginBox(), "20006" == e && (t = "您需要先登录才能继续刚才的操作"), $("#login-wrong-info").html(t), $(".login-er-icon").css("display", "inline-block"), $("#isAjax").val(1), $("#login_ajaxInfo").val(n), !1)
			},
			showDiggMove: function(e, t, n) {
				var i = $("<span></span>", {
					css: {
						"font-weight": "bold",
						color: "#4fc416",
						"font-size": "20px",
						position: "absolute",
						"z-index": "6",
						left: "25px",
						top: $(n).parent().position().top + "px"
					}
				}).text("+1").appendTo(e);
				i.animate({
					top: "-=70",
					left: "+=3",
					"font-size": 60,
					opacity: 0
				}, 600, function() {
					i.remove()
				})
			},
			showLessMove: function(e, t, n) {
				var i = $("<span></span>", {
					css: {
						"font-weight": "bold",
						color: "#99AECB",
						"font-size": "20px",
						position: "absolute",
						"z-index": "6",
						left: "25px",
						top: $(n).parent().position().top + "px"
					}
				}).text("-1").appendTo(e);
				i.animate({
					top: "-=70",
					left: "+=18",
					"font-size": 60,
					opacity: 0
				}, 600, function() {
					i.remove()
				})
			},
			showMsgPanel: function(e, t) {
				var n = $("#isAjax").val();
				if(1 == n) {
					var i = $("#login_ajaxInfo").val();
					return $("#isAjax").val(0), $("#login_ajaxInfo").val(""), $("#isAjax").data("ajax", null), window.location.reload(), void L.showTopTips(L.TIPS_TYPE.error, e)
				}
				var i = $("<div class='yellow-msg-box corner' id='yellow-msg-box'></div>").html("<span>" + e + "</span>").css({
					top: $(t).position().top + $(t).height() + 12
				}).appendTo("#content-list");
				$(i).position().top + 32 > $("#content-list").height() && $(i).css("top", $("#content-list").height() - 32), $(".msg-close-a, body").click(function() {
					$(i).hide().remove()
				}), window.setTimeout(function() {
					$(i).hide().remove()
				}, 3e3)
			},
			showSearchBox: function() {
				$("#txtSearch2").focus(function() {
					$("#txtSearch2").css({
						"background-color": "#fff"
					})
				}).blur(function() {
					$("#txtSearch2").css({
						"background-color": "#f4f4f4"
					})
				}), $("#searchBtn_3").click(function() {
					$.trim($("#txtSearch2").val());
					return $("#searchFrm2").submit(), !1
				})
			},
			clearEditorContent: function() {
				$("#clearFeedback").click(function() {
					ze.clear()
				})
			},
			clickClear: function() {
				$("#txt-duanzi").bindTipsEvent(), $("#txt-yaoyan").bindTipsEvent(), $("#txt-zixun").bindTipsEvent(), $("#txt-img").bindTipsEvent(), $("#txt-comment").bindTipsEvent(), $("#reg_destJid").bindTipsEvent(), $("#reg_password").bindTipsEvent(), $("#reg_confirm_password").bindTipsEvent(), $("#reg_secret_mail").bindTipsEvent(), $("#phoneCode").bindTipsEvent(), $("#verify_code").bindTipsEvent(), $("#sms_code").bindTipsEvent(), $("#feedback_content").bindTipsEvent(), $("#txtSearch2").bindTipsEvent()
			},
			top10name: function(e) {
				$(".top-band-type em").html(e)
			},
			shake: function(e, t, n) {
				var i = 0,
					o = !1,
					a = e.attr("class") + " ",
					s = "",
					n = n || 2;
				o || (o = setInterval(function() {
					i++, s = i % 2 ? a + t : a, e.attr("class", s), i == 2 * n && (clearInterval(o), e.removeClass(t))
				}, 200))
			},
			flashErrorTip: function(e) {
				var t = e;
				return "block" != t.css("display") || (chouti.shake(t, "flash", 3), !1)
			},
			showGoTop: function() {
				var e = $(".main-content");
				if(!(e.length <= 0)) {
					var t = parseInt(e.outerWidth() + e.offset().left + 20),
						n = $("html").width();
					n < 1024 && (t = n - 300);
					var i = "<a href='javascript:;' title='回到顶部' class='icon-main' id='gotop' style='left:" + t + "px'></a>";
					$("body").append(i), $("#gotop").click(function() {
						$("body,html").animate({
							scrollTop: 0
						}, 200)
					}), $(window).scroll(function() {
						$(window).scrollTop();
						$(window).scrollTop() > 0 ? $("#gotop").css("display", "block") : $(window).scrollTop() <= 0 && $("#gotop").hide()
					})
				}
			},
			isEmail: function(e) {
				return !!/^[_a-zA-Z0-9.]+@([_a-z0-9]+\.)+[a-z0-9]{2,3}$/.test(e)
			},
			Head_Pic_Rece_URL_info: function(e, t) {
				if("IOError" == e) return void L.showTopTips(L.TIPS_TYPE.error, "图片上传失败，请稍候再试");
				var n = e.lastIndexOf(".");
				e = e.substring(0, n) + "=48x48." + e.substring(n + 1), $(".my-photo #personImgUrl").attr("src", chouti.replaceHttps(e)), $("#hidImgUrl").val(e), Head_Pic_Cancel()
			},
			Head_Pic_Cancel_info: function() {
				$("#H-avaupload-dialog").hide(), $("#mask").hide().remove()
			},
			hoverItems: function() {
				$(".list-item").hover(function() {
					$(this).data("backColor", $(this).css("background-color")), $(this).css({
						backgroundColor: "#e9f0f8"
					})
				}, function() {
					var e = $(this).data("backColor");
					$(this).css("background-color", e)
				})
			},
			showDelDialog: function() {
				$("#del_a").click(function() {
					chouti.showMask("#del-dialog", ""), $("#mask").fadeIn("500", function() {
						$("#del-dialog").show()
					})
				})
			},
			checkserAgent: function() {
				var e = navigator.userAgent,
					t = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod", "MQQBrowser"),
					n = !1;
				if(e.indexOf("Windows NT") < 0 || e.indexOf("Macintosh") < 0 || e.indexOf("Mac OS") < 0 || e.indexOf("Linux") < 0 && e.indexOf("Android") < 0)
					for(var i = 0; i < t.length; i++) e.indexOf(t[i]) >= 0 && (n = !0);
				return n
			},
			showChatSwf: function(e, t, n, i) {
				new JsMucChat(e, t, n, i);
				"0" == $(".isBan").val() && banChat()
			},
			lazyLoadImg: function(e) {
				$(e).lazyload({
					placeholder: "/images/bai.png",
					effect: "show"
				})
			},
			initImgClickEvent: function() {
				try {
					$("img.big-img-load").remove(), $("img.big-img").remove(), $(window).unbind("click")
				} catch(e) {}
				var t = $("#content-list .item .news-pic img");
				t.click(function() {
					return chouti.showBigImg($(this)), !1
				}), t.hover(function() {
					var e = chouti.prefix();
					if(null != e) {
						var t = "-" + e + "-zoom-in";
						$(this).css("cursor", t)
					} else $(this).css("cursor", "url(/images/cursor/zoom_in.cur),auto")
				})
			},
			prefix: function() {
				var e = navigator.userAgent.toLowerCase();
				return e.indexOf("webkit") >= 0 ? "webkit" : e.indexOf("firefox") >= 0 ? "moz" : e.indexOf("opera") >= 0 ? "o" : void 0
			},
			showBigImg: function(e) {
				var t = e.attr("lang") + "";
				try {
					$("img.big-img[id!=bigImg" + t + "]").animate({
						width: "60px",
						height: "60px"
					}, function() {
						$(this).remove()
					}), $("img.big-img-load[id!=bigImgLoading" + t + "]").remove()
				} catch(n) {}
				if(!($("#bigImg" + t).length > 0)) {
					var i = e.attr("original") + "";
					bigImgUrl = i.substring(0, i.lastIndexOf("=")) + "=C200x200" + i.substring(i.lastIndexOf("."), i.length);
					var o = "<img class='big-img' id='bigImg" + t + "' width='200px' height='200px' src='" + i + "' alt='抽屉新热榜' />";
					$(document.body).append(o);
					var a = $("#bigImg" + t);
					docWidth = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth, a.hover(function() {
						var e = chouti.prefix();
						if(null != e) {
							var t = "-" + e + "-zoom-out";
							$(this).css("cursor", t)
						} else $(this).css("cursor", "url(/images/cursor/zoom_out.cur),auto")
					}), a.css({
						position: "absolute",
						top: e.offset().top + "px",
						right: docWidth - e.offset().left - 64 + "px",
						"z-index": 2,
						"background-color": "#fff",
						border: "1px solid #ccc",
						padding: "1px",
						"vertical-align": "top"
					}), a.css({
						width: "60px",
						height: "60px"
					});
					var s = new Image;
					s.src = bigImgUrl, s.width > 0 && a.attr("src", chouti.replaceHttps(bigImgUrl)), a.animate({
						width: "200px",
						height: "200px"
					}, function() {
						if(s.width > 0) a.attr("src", chouti.replaceHttps(bigImgUrl));
						else {
							var n = "<img class='big-img-load' id='bigImgLoading" + t + "' width='16px' height='16px' src='/images/loading.gif'/>";
							$(document.body).append(n), $("#bigImgLoading" + t).css({
								position: "absolute",
								top: e.offset().top + 92 + "px",
								right: docWidth - e.offset().left - 64 + 92 + "px",
								"z-index": 3
							}), s.onload = function() {
								$("#bigImgLoading" + t).remove(), a.attr("src", chouti.replaceHttps(bigImgUrl))
							}
						}
					}), $(document).click(function(e) {
						a.animate({
							width: "60px",
							height: "60px"
						}, function() {
							a.remove();
							var e = $("#content-list .item .news-pic img"),
								t = chouti.prefix();
							if(null != t) {
								var n = "-" + t + "-zoom-out";
								e.css("cursor", n)
							} else e.css("cursor", "url(/images/cursor/zoom_out.cur),pointer")
						})
					})
				}
			},
			oprateJuBao: function() {
				$("a.jubao").unbind().click(function() {
					var e = $(this),
						t = e.attr("lang"),
						n = chouti.checkLogin(e, t);
					n && chouti.showJubaoDialog(e, t)
				})
			},
			checkLogin: function(e, t) {
				var n = "/link/share";
				L.ajax({
					url: n,
					success: function(n) {
						var i = n.code;
						if("9999" != i) {
							if("22157" == n.code) return;
							var o = n.message;
							return "-1" == i || "20006" == i ? void chouti.showLoginBox() : (L.showTopTips(L.TIPS_TYPE.error, o), !1)
						}
						chouti.showJubaoDialog(e, t)
					}
				})
			},
			repeatJubao: function() {
				var e = $("#hidJubaoTime").val();
				if(jubaoTime1 = (new Date).getTime(), "" == e) return $("#hidJubaoTime").val(jubaoTime1), !0;
				var t = parseInt((jubaoTime1 - e) / 1e3);
				return t <= 10 ? (L.showTopTips(L.TIPS_TYPE.error, "您举报过于频繁，请稍候重新举报"), !1) : ($("#hidJubaoTime").val(jubaoTime1), !0)
			},
			closeJubaoBox: function() {
				$("#Jubao-dialog").hide(), $("#mask").hide().remove(), $("#chatIframe").css({
					height: "475px",
					width: "300px"
				})
			},
			showJubaoDialog: function(e, t) {
				$("#Jubao-dialog").length <= 0 && $("#footer-band").append($("#jubao-dialog-code").html()), chouti.showMask("#Jubao-dialog", "top");
				var n = e.offset().top - $("#Jubao-dialog").height() / 2;
				n <= 0 && (n = 30), $("#mask").show(), $("#Jubao-dialog").show().css("top", n + "px"), $("#chatIframe").css({
					height: "0px",
					width: "0px"
				}), $("#dialog-jubao-close, #clear-btn-jubao").click(function() {
					chouti.closeJubaoBox()
				}), $(":radio:first[name=radio_bad]").attr("checked", "checked"), $("#trJubao").hide(), qita = 1, $("#otherReson").val(""), $(":radio[name=radio_bad]").click(function() {
					"qita" == $(this).attr("id") ? ($("#trJubao").show(), $("#otherReson").focus(), qita = 0) : ($("#trJubao").hide(), qita = 1)
				}), chouti.clsJubaoResBox(e, t)
			},
			submitJubaoInfo: function(e, t) {
				var n = "/comments/report";
				L.ajax({
					url: n,
					type: "POST",
					data: G.param({
						id: e
					}),
					success: function(e) {
						var n = e.code;
						if("9999" != n) {
							if("22157" == e.code) return !1;
							var i = e.message;
							return L.showTopTips(L.TIPS_TYPE.error, i), !1
						}
						chouti.closeJubaoBox(), L.showTopTips(L.TIPS_TYPE.success, "举报成功"), $(t).css({
							cursor: "default",
							color: "#B4B4B4",
							"text-decoration": "none"
						}).unbind(), $(t).hover(function() {
							$(this).css("text-decoration", "none")
						})
					}
				})
			},
			clsJubaoResBox: function(e, t) {
				$("#sendJubaoBtn").unbind().click(function() {
					var n = $.trim($("#otherReson").val());
					return 0 == qita && "" == n ? void $("#otherReson").focus() : void chouti.submitJubaoInfo(t, e)
				})
			},
			showUserOprBox: function() {
				$("#loginUserNc").hover(function() {
					var e = $("#userOprBox"),
						t = $(".key-sera").offset().left;
					t -= 127, e.css("left", t + "px").show(), $(".chat-notice-area").hide(), $("#user_notice_page").hide()
				}, function() {
					e.hide(), $(".chat-notice-area").show()
				});
				var e = $("#userOprBox");
				e.hover(function() {
					e.show(), $(".chat-notice-area").hide()
				}, function() {
					e.hide(), $(".chat-notice-area").show()
				})
			},
			changeAdPositon: function(e, t, n) {
				var i = $(window).scrollTop();
				if(i > n - 42) {
					t.addClass("advertIframe");
					var o = $(".content-R").offset().left - document.body.scrollLeft,
						a = navigator.userAgent.toLowerCase();
					if(a.indexOf("firefox") > 0) var o = $(".content-R").offset().left - document.documentElement.scrollLeft;
					var o;
					t.css("left", o + "px")
				} else t.removeClass("advertIframe")
			},
			subNickLength: function(e, t) {
				var n = 0,
					i = "",
					o = 0,
					a = e;
				e = e.split("");
				for(var s = 0; s < e.length; s++) {
					if(!(o <= 4)) {
						i += "...";
						break
					}
					i += e[s];
					var r = a.charCodeAt(s);
					r >= 1 && r <= 126 || 65376 <= r && r <= 65439 ? n++ : n += 2, o = parseInt(n / 2);
					var l = n % 2;
					0 != l && (o += 1)
				}
				return i
			},
			checkLogin: function() {
				if("" == $("#hidjid").val()) return chouti.showLoginBox(), !1
			},
			lahei: function() {
				$("#laHeiBtn").unbind().click(function() {
					var e = $(this).attr("otherNick");
					if(confirm("确定把" + e + "拉入黑名单吗？")) {
						var t = "/letter/add/blacklist.do",
							n = $(this).attr("otherJid");
						L.ajax({
							url: t,
							type: "POST",
							data: G.param({
								jid: n
							}),
							success: function(t) {
								if(t.code != ResultCodeSuccess) return void L.showTopTips(L.TIPS_TYPE.error, t.message);
								L.showTopTips(L.TIPS_TYPE.success, "拉黑成功");
								var i = "<span class='removeLahe'><span class='heimdan'></span>已加入黑名单</span><a href='javascript:;' id='laHeiRemoveBtn' otherJid='" + n + "' otherNick='" + e + "'>解除</a>";
								$("#laheiBox").html(i), chouti.laHeiRemove()
							}
						})
					}
				})
			},
			laHeiRemove: function() {
				$("#laHeiRemoveBtn").unbind().click(function() {
					var e = "/letter/del/blacklist.do",
						t = $(this).attr("otherJid"),
						n = $(this).attr("otherNick");
					L.ajax({
						url: e,
						type: "POST",
						data: G.param({
							jid: t
						}),
						success: function(e) {
							if(e.code != ResultCodeSuccess) return void L.showTopTips(L.TIPS_TYPE.error, e.message);
							L.showTopTips(L.TIPS_TYPE.success, "解除成功");
							var i = "<a href='javascript:;' id='laHeiBtn' otherJid='" + t + "' otherNick='" + n + "'><span class='heimdan'></span>拉入黑名单</a>";
							$("#laheiBox").html(i), chouti.lahei()
						}
					})
				})
			},
			fixedAdvert: function() {
				var e = navigator.userAgent.toLowerCase(),
					t = $("#advertIframe");
				if(!(t.length <= 0)) {
					var n = t.offset().top;
					$(window).scroll(function() {
						chouti.changeAdPositon(e, t, n)
					}), $(window).resize(function() {
						chouti.changeAdPositon(e, t, n)
					})
				}
			}
		}
	}(jQuery),
	function(e) {
		var t = e.gozap,
			n = t.labi,
			i = n.i18n,
			o = {
				StateMessage: {
					loading: "注册中，请稍候...",
					success: "注册成功",
					fail: "注册失败"
				},
				warnInfo: {
					username: {
						nullContent: "请输入用户名",
						errorStyle: "用户名格式不正确，请重新输入"
					},
					oldpassword: {
						nullContent: "请输入密码",
						errorStyle: "密码长度必须为6-16位字符，请重新输入"
					},
					password: {
						nullContent: "请输入密码",
						errorStyle: "密码长度必须为6-16位字符，请重新输入"
					},
					confirmPassword: {
						nullContent: "请输入确认密码",
						errorStyle: "两次密码不一致，请重新输入"
					},
					mail: {
						nullContent: "请输入联系邮箱",
						errorStyle: "邮箱格式不合法，请重新输入"
					},
					bindphone: {
						nullContent: "请输入手机号",
						errorStyle: "手机号不合法，请重新输入"
					},
					verifycode: {
						nullContent: "请输入验证码",
						errorStyle: ""
					},
					usernick: {
						nullContent: "请输入用户昵称",
						errorStyle: "支持中英文、数字、下划线",
						errorLengthStyle: "不能超过10个汉字"
					}
				}
			};
		i.register || (i.register = {}), e.extend(i.register, o)
	}(jQuery),
	function(e) {
		var t = e.gozap,
			n = t.labi,
			i = n.i18n,
			o = {
				StateMessage: {
					loading: "注册中，请稍候...",
					success: "注册成功",
					fail: "注册失败"
				},
				showTipTitle: {
					title: "内容：",
					date: "时间：",
					location: "地点：",
					notes: "说明：",
					priority: "优先级：",
					fb: "状态：",
					clock: "闹钟："
				}
			};
		i.resetpassword || (i.resetpassword = {}), e.extend(i.resetpassword, o)
	}(jQuery);
var userNameCorss = !1,
	userNickCorss = !1,
	userPassCorss = !1,
	userOldPassCorss = !1,
	userPhoneCorss = !1,
	userSamePassCorss = !1,
	userMailCorss = !1,
	userVertifyCorss = !1,
	allSubmit = !1;
! function(e) {
	var t = e.gozap,
		n = t.labi,
		i = n.i18n,
		o = i.register,
		a = o.warnInfo,
		s = n.RESULT_CODE.success;
	regCheckRule = {
		checkVerfifyCodeRule: function() {
			var i = e.trim(e("#verify_code").val());
			if(gozapCommon.isEmpty(i)) return regCheckRule.inputTextChangeClass("add", "#verify_code", tipsObjs.verify_code.errorTip, tipsObjs.verify_code.successTip), e(".tips-info", "#tips_verifyCodeError").html(a.verifycode.nullContent), userVertifyCorss = !1, !1;
			i = MD5(i);
			var o = "/passport/valAccessCode.do";
			n.ajax({
				url: o,
				type: "POST",
				data: t.param({
					code: i
				}),
				async: !1,
				success: function(t) {
					return t.code != s ? (regCheckRule.inputTextChangeClass("add", "#verify_code", tipsObjs.verify_code.errorTip, tipsObjs.verify_code.successTip), tipsObjs.verify_code.errorTip.show(), e(".tips-info", "#tips_verifyCodeError").html(t.message), "24000" == t.code && e("#authImg").attr("src", "/gozapIdentifyCode?t=" + Math.random()), userVertifyCorss = !1, !1) : (tipsObjs.verify_code.successTip.show(), tipsObjs.verify_code.errorTip.hide(), userVertifyCorss = !0, !0)
				}
			})
		},
		checkUSerSamePassRule: function() {
			var t = e.trim(e("#confirm_password").val());
			return gozapCommon.isEmpty(t) ? (regCheckRule.inputTextChangeClass("add", "#confirm_password", tipsObjs.confirm_password.errorTip, tipsObjs.confirm_password.successTip), e(".tips-info", "#tips_userPassSameError").html(a.confirmPassword.nullContent), userSamePassCorss = !1, !1) : t != e.trim(e("#new_password").val()) ? (regCheckRule.inputTextChangeClass("add", "#confirm_password", tipsObjs.confirm_password.errorTip, tipsObjs.confirm_password.successTip), e(".tips-info", "#tips_userPassSameError").html(a.confirmPassword.errorStyle), userSamePassCorss = !1, !1) : (userSamePassCorss = !0, !0)
		},
		checkUSerSecretMailRule: function() {
			var t = e.trim(e("#secret_mail").val());
			return gozapCommon.isEmpty(t) ? (regCheckRule.inputTextChangeClass("add", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip), e(".tips-info", "#tips_userSecretMailError").html(a.mail.nullContent), userMailCorss = !1, !1) : gozapCommon.isEmail(t) ? (userMailCorss = !0, !0) : (regCheckRule.inputTextChangeClass("add", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip), e(".tips-info", "#tips_userSecretMailError").html(a.mail.errorStyle), userMailCorss = !1, !1)
		},
		checkUSerSecretMailExist: function(i) {
			var o = e.trim(e("#secret_mail").val());
			if(gozapCommon.isEmpty(o)) return regCheckRule.inputTextChangeClass("add", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip), e(".tips-info", "#tips_userSecretMailError").html(a.mail.nullContent), userMailCorss = !1, !1;
			if(!gozapCommon.isEmail(o)) return regCheckRule.inputTextChangeClass("add", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip), e(".tips-info", "#tips_userSecretMailError").html(a.mail.errorStyle), userMailCorss = !1, !1;
			if("" == i) {
				var r = "/profile/email/exist";
				n.ajax({
					url: r,
					type: "POST",
					data: t.param({
						email: o
					}),
					async: !1,
					success: function(t) {
						return t.code != s ? (regCheckRule.inputTextChangeClass("add", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip), e(".tips-info", "#tips_userSecretMailError").html(t.message), userMailCorss = !1, !1) : (tipsObjs.secret_mail.successTip.show(), tipsObjs.secret_mail.errorTip.hide(), userMailCorss = !0, !0)
					}
				})
			} else {
				var r = "/profile/email/notexist";
				n.ajax({
					url: r,
					type: "POST",
					data: t.param({
						email: o
					}),
					async: !1,
					success: function(t) {
						return t.code == s ? (tipsObjs.secret_mail.successTip.show(), tipsObjs.secret_mail.errorTip.hide(), userMailCorss = !0, !0) : (regCheckRule.inputTextChangeClass("add", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip), e(".tips-info", "#tips_userSecretMailError").html(t.message), userMailCorss = !1, !1)
					}
				})
			}
		},
		checkUSerPassRule: function() {
			var t = e.trim(e("#new_password").val());
			return gozapCommon.isEmpty(t) ? (regCheckRule.inputTextChangeClass("add", "#new_password", tipsObjs.password.errorTip, tipsObjs.password.successTip), e(".tips-info", "#tips_userPassError").html(a.password.nullContent), userPassCorss = !1, !1) : gozapCommon.isBetweenLength(t, 6, 16) ? (userPassCorss = !0, !0) : (regCheckRule.inputTextChangeClass("add", "#new_password", tipsObjs.password.errorTip, tipsObjs.password.successTip), e(".tips-info", "#tips_userPassError").html(a.password.errorStyle), e("#new_password").val(""), userPassCorss = !1, !1)
		},
		checkUSerOldPassRule: function() {
			var t = e.trim(e("#old_password").val());
			return gozapCommon.isEmpty(t) ? (regCheckRule.inputTextChangeClass("add", "#old_password", tipsObjs.oldpassword.errorTip, tipsObjs.oldpassword.successTip), e(".tips-info", "#tips_userOldPassError").html(a.oldpassword.nullContent), userOldPassCorss = !1, !1) : gozapCommon.isBetweenLength(t, 6, 16) ? (userOldPassCorss = !0, !0) : (regCheckRule.inputTextChangeClass("add", "#old_password", tipsObjs.oldpassword.errorTip, tipsObjs.oldpassword.successTip), e(".tips-info", "#tips_userOldPassError").html(a.oldpassword.errorStyle), userOldPassCorss = !1, !1)
		},
		checkUSerNickRule: function() {
			var t = e.trim(e("#nick").val());
			return gozapCommon.isEmpty(t) ? (regCheckRule.inputTextChangeClass("add", "#nick", tipsObjs.usernick.errorTip, tipsObjs.usernick.successTip), e(".tips-info", "#tips_userNickError").html(a.usernick.nullContent), userNickCorss = !1, !1) : /^[\u4e00-\u9fa5\w]+$/.test(t) ? (userNickCorss = !0, t.length > 10 ? (regCheckRule.inputTextChangeClass("add", "#nick", tipsObjs.usernick.errorTip, tipsObjs.usernick.successTip), e(".tips-info", "#tips_userNickError").html(a.usernick.errorLengthStyle), userNickCorss = !1, !1) : (userNickCorss = !0, !0)) : (regCheckRule.inputTextChangeClass("add", "#nick", tipsObjs.usernick.errorTip, tipsObjs.usernick.successTip), e(".tips-info", "#tips_userNickError").html(a.usernick.errorStyle), userNickCorss = !1, !1)
		},
		countNickLength: function(e, t) {
			for(var n = 0, i = 0; i < e.length; i++) {
				var o = e.charCodeAt(i);
				o >= 1 && o <= 126 || 65376 <= o && o <= 65439 ? n++ : n += 2
			}
			var a = parseInt(n / 2),
				s = n % 2;
			0 != s && (a += 1);
			var r = t - a;
			return !(r < 0)
		},
		checkUSerNameRule: function() {
			var t = e.trim(e("#destJid").val());
			return gozapCommon.isEmpty(t) ? (regCheckRule.inputTextChangeClass("add", "#destJid", tipsObjs.destJid.errorTip, tipsObjs.destJid.successTip), e(".tips-info", "#tips_userNameError").html(a.username.nullContent), userNameCorss = !1, !1) : gozapCommon.isUserName(t) && gozapCommon.isBetweenLength(t, 5, 10) ? void n.ajax({
				url: "userReg!selUser.action",
				data: "profile.destJid=" + t,
				success: function(t) {
					return t.code != s ? (regCheckRule.inputTextChangeClass("add", "#destJid", tipsObjs.destJid.errorTip, tipsObjs.destJid.successTip), e(".tips-info", "#tips_userNameError").html(t.ext.msg), userNameCorss = !1, !1) : (tipsObjs.destJid.successTip.show(), tipsObjs.destJid.errorTip.hide(), userNameCorss = !0, !0)
				}
			}) : (regCheckRule.inputTextChangeClass("add", "#destJid", tipsObjs.destJid.errorTip, tipsObjs.destJid.successTip), e(".tips-info", "#tips_userNameError").html(a.username.errorStyle), userNameCorss = !1, !1)
		},
		checkUSerNameExsit: function() {
			var i = e.trim(e("#user_destJid").val());
			if(gozapCommon.isEmpty(i)) return regCheckRule.inputTextChangeClass("add", "#user_destJid", tipsObjs.destJid.errorTip, tipsObjs.destJid.successTip), e(".tips-info", "#tips_userNameError").html(a.username.nullContent), userNameCorss = !1, !1;
			if(!gozapCommon.isUserName(i) || !gozapCommon.isBetweenLength(i, 5, 20)) return regCheckRule.inputTextChangeClass("add", "#user_destJid", tipsObjs.destJid.errorTip, tipsObjs.destJid.successTip), e(".tips-info", "#tips_userNameError").html(a.username.errorStyle), userNameCorss = !1, !1;
			var o = "/profile/user/exist";
			n.ajax({
				url: o,
				type: "POST",
				data: t.param({
					jid: i
				}),
				success: function(t) {
					return t.code == s ? (tipsObjs.destJid.successTip.show(), tipsObjs.destJid.errorTip.hide(), userNameCorss = !0, !0) : (regCheckRule.inputTextChangeClass("add", "#user_destJid", tipsObjs.destJid.errorTip, tipsObjs.destJid.successTip), e(".tips-info", "#tips_userNameError").html(t.message), userNameCorss = !1, !1)
				}
			})
		},
		checkUSerOldPassExsit: function() {
			var i = e.trim(e("#old_password").val()),
				o = "/profile/password/auth";
			n.ajax({
				url: o,
				type: "POST",
				data: t.param({
					password: i
				}),
				async: !1,
				success: function(t) {
					return t.code == s ? (tipsObjs.oldpassword.successTip.show(), tipsObjs.oldpassword.errorTip.hide(), userOldPassCorss = !0, !0) : (regCheckRule.inputTextChangeClass("add", "#old_password", tipsObjs.oldpassword.errorTip, tipsObjs.oldpassword.successTip), e(".tips-info", "#tips_userOldPassError").html(t.message), userOldPassCorss = !1, !1)
				}
			})
		},
		checkUSerPhoneRule: function() {
			var n = e.trim(e("#phoneCode").val());
			return gozapCommon.isEmpty(n) ? (regCheckRule.inputTextChangeClass("add", "#phoneCode", tipsObjs.bindphone.errorTip, tipsObjs.bindphone.successTip), e(".tips-info", "#tips_userPhoneError").html(a.bindphone.nullContent), userPhoneCorss = !1, !1) : t.regExp.isMobile(n) ? (userPhoneCorss = !0, !0) : (regCheckRule.inputTextChangeClass("add", "#phoneCode", tipsObjs.bindphone.errorTip, tipsObjs.bindphone.successTip), e(".tips-info", "#tips_userPhoneError").html(a.bindphone.errorStyle), userPhoneCorss = !1, !1)
		},
		inputTextChangeClass: function(t, n, i, o) {
			"add" == t ? (e(n).addClass("text-error"), i.show(), o.hide()) : (e(n).removeClass("text-error"), i.hide(), o.show())
		},
		destJidBlurTips: function(t) {
			e("#user_destJid").focus(function() {
				regCheckRule.inputTextChangeClass("remove", "#user_destJid", tipsObjs.destJid.errorTip, tipsObjs.destJid.successTip), tipsObjs.destJid.normalTip.show(), tipsObjs.destJid.successTip.hide()
			}).blur(function() {
				if(e(this).removeClass("text-active"), tipsObjs.destJid.normalTip.hide(), "resetpassword" == t) {
					if(!regCheckRule.checkUSerNameExsit()) return
				} else if(!regCheckRule.checkUSerNameRule()) return;
				regCheckRule.inputTextChangeClass("remove", "#user_destJid", tipsObjs.destJid.errorTip, tipsObjs.destJid.successTip)
			})
		},
		oldpasswordBlurTips: function(t) {
			e("#old_password").focus(function() {
				regCheckRule.inputTextChangeClass("remove", "#old_password", tipsObjs.oldpassword.errorTip, tipsObjs.oldpassword.successTip), tipsObjs.oldpassword.normalTip.show(), tipsObjs.oldpassword.successTip.hide()
			}).blur(function() {
				return e(this).removeClass("text-active"), tipsObjs.oldpassword.normalTip.hide(), regCheckRule.checkUSerOldPassRule() ? void(regCheckRule.checkUSerOldPassExsit() && regCheckRule.inputTextChangeClass("remove", "#old_password", tipsObjs.oldpassword.errorTip, tipsObjs.oldpassword.successTip)) : (userOldPassCorss = !1, !1)
			})
		},
		passwordBlurTips: function(t) {
			e("#new_password").focus(function() {
				regCheckRule.inputTextChangeClass("remove", "#new_password", tipsObjs.password.errorTip, tipsObjs.password.successTip), tipsObjs.password.normalTip.show(), tipsObjs.password.successTip.hide()
			}).blur(function() {
				return e(this).removeClass("text-active"), tipsObjs.password.normalTip.hide(), !!regCheckRule.checkUSerPassRule() && (regCheckRule.inputTextChangeClass("remove", "#new_password", tipsObjs.password.errorTip, tipsObjs.password.successTip), void("" != e.trim(e("#confirm_password").val()) && e("#confirm_password").blur()))
			}).keyup(function() {
				var t = e.trim(e(this).val());
				if("" != t) {
					var n = passwordStrength.policy(t);
					passwordStrength.changePS(n, "#password_strong_line")
				}
			})
		},
		confirmpasswordBlurTips: function() {
			e("#confirm_password").focus(function() {
				regCheckRule.inputTextChangeClass("remove", "#confirm_password", tipsObjs.confirm_password.errorTip, tipsObjs.confirm_password.successTip), tipsObjs.confirm_password.normalTip.show(), tipsObjs.confirm_password.successTip.hide()
			}).blur(function() {
				e(this).removeClass("text-active"), tipsObjs.confirm_password.normalTip.hide(), regCheckRule.checkUSerSamePassRule() && (regCheckRule.inputTextChangeClass("remove", "#confirm_password", tipsObjs.confirm_password.errorTip, tipsObjs.confirm_password.successTip), tipsObjs.confirm_password.successTip.show())
			})
		},
		secretmailBlurNotTips: function(t) {
			e("#secret_mail").focus(function() {
				regCheckRule.inputTextChangeClass("remove", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip), tipsObjs.secret_mail.normalTip.show(), tipsObjs.secret_mail.successTip.hide()
			}).blur(function() {
				e(this).removeClass("text-active"), tipsObjs.secret_mail.normalTip.hide(), regCheckRule.checkUSerSecretMailExist("exsit") && regCheckRule.inputTextChangeClass("remove", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip)
			})
		},
		secretmailBlurTips: function(t) {
			e("#secret_mail").focus(function() {
				regCheckRule.inputTextChangeClass("remove", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip), tipsObjs.secret_mail.normalTip.show(), tipsObjs.secret_mail.successTip.hide()
			}).blur(function() {
				if(e(this).removeClass("text-active"), tipsObjs.secret_mail.normalTip.hide(), "finduser" == t) {
					if(!regCheckRule.checkUSerSecretMailExist("")) return
				} else {
					if("exsit" == t && !regCheckRule.checkUSerSecretMailExist(t)) return;
					if(!regCheckRule.checkUSerSecretMailRule()) return
				}
				regCheckRule.inputTextChangeClass("remove", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip)
			})
		},
		verifycodeBlurTips: function(t) {
			e("#verify_code").focus(function() {
				regCheckRule.inputTextChangeClass("remove", "#verify_code", tipsObjs.verify_code.errorTip, tipsObjs.verify_code.successTip), tipsObjs.verify_code.normalTip.show(), tipsObjs.verify_code.successTip.hide()
			}).blur(function() {
				e(this).removeClass("text-active"), tipsObjs.verify_code.normalTip.hide(), regCheckRule.checkVerfifyCodeRule() && regCheckRule.inputTextChangeClass("remove", "#verify_code", tipsObjs.verify_code.errorTip, tipsObjs.verify_code.successTip)
			}).keydown(function(n) {
				13 == n.keyCode && (e("#verify_code").blur(), userVertifyCorss && e(t).click())
			})
		},
		phoneBlurTips: function() {
			e("#phoneCode").focus(function() {
				regCheckRule.inputTextChangeClass("remove", "#phoneCode", tipsObjs.bindphone.errorTip, tipsObjs.bindphone.successTip), tipsObjs.bindphone.normalTip.show(), tipsObjs.bindphone.successTip.hide()
			}).blur(function() {
				e(this).removeClass("text-active"), tipsObjs.bindphone.normalTip.hide(), regCheckRule.checkUSerPhoneRule() && regCheckRule.inputTextChangeClass("remove", "#phoneCode", tipsObjs.bindphone.errorTip, tipsObjs.bindphone.successTip)
			})
		},
		userNickBlurTips: function() {
			e("#nick").focus(function() {
				regCheckRule.inputTextChangeClass("remove", "#nick", tipsObjs.usernick.errorTip, tipsObjs.usernick.successTip), tipsObjs.usernick.normalTip.show(), tipsObjs.usernick.successTip.hide()
			}).blur(function() {
				return e(this).removeClass("text-active"), tipsObjs.usernick.normalTip.hide(), regCheckRule.checkUSerNickRule() ? void regCheckRule.inputTextChangeClass("remove", "#nick", tipsObjs.usernick.errorTip, tipsObjs.usernick.successTip) : (userNickCorss = !1, !1)
			})
		},
		loginTextFocusorBlur: function(t) {
			e(t).focus(function() {
				e(this).parent().addClass("text-box-active")
			}).blur(function() {
				e(this).parent().removeClass("text-box-active")
			})
		},
		isEmptyBlur: function(t) {
			e("#phoneCode").focus(function() {
				regCheckRule.inputTextChangeClass("remove", "#phoneCode", tipsObjs.bindphone.errorTip, tipsObjs.bindphone.successTip), tipsObjs.bindphone.normalTip.show(), tipsObjs.bindphone.successTip.hide();
			}).blur(function() {
				return e(this).removeClass("text-active"), tipsObjs.bindphone.normalTip.hide(), 0 == e("#phoneCode").val().length ? (regCheckRule.inputTextChangeClass("add", "#phoneCode", tipsObjs.bindphone.errorTip, tipsObjs.bindphone.successTip), e(".tips-info", "#tips_userPhoneError").html("请输入手机号"), void(userPhoneEmptyCorss = !1)) : (userPhoneEmptyCorss = !0, void regCheckRule.inputTextChangeClass("remove", "#phoneCode", tipsObjs.bindphone.errorTip, tipsObjs.bindphone.successTip))
			})
		},
		usersignBlur: function() {
			e("#usersign").focus(function() {
				regCheckRule.inputTextChangeClass("remove", "#usersign", tipsObjs.usersign.errorTip, tipsObjs.usersign.successTip), tipsObjs.usersign.normalTip.show(), tipsObjs.usersign.successTip.hide()
			}).blur(function() {
				return e(this).removeClass("text-active"), tipsObjs.usersign.normalTip.hide(), e("#usersign").val().length > 100 ? (regCheckRule.inputTextChangeClass("add", "#usersign", tipsObjs.usersign.errorTip, tipsObjs.usersign.successTip), e(".tips-info", "#tips_userSignError").html("签名档长度不能超过100个字符"), !1) : (regCheckRule.inputTextChangeClass("remove", "#usersign", tipsObjs.usersign.errorTip, tipsObjs.usersign.successTip), !0)
			})
		},
		initTipsBind: function() {
			tipsObjs = {
				destJid: {
					normalTip: e("#tips_userNameNormal"),
					errorTip: e("#tips_userNameError"),
					successTip: e("#username_sucess_ico")
				},
				oldpassword: {
					normalTip: e("#tips_userOldPassNormal"),
					errorTip: e("#tips_userOldPassError"),
					successTip: e("#userOldpass_sucess_ico")
				},
				password: {
					normalTip: e("#tips_userPassNormal"),
					errorTip: e("#tips_userPassError"),
					successTip: e("#userpass_sucess_ico")
				},
				confirm_password: {
					normalTip: e("#tips_userPassSameNormal"),
					errorTip: e("#tips_userPassSameError"),
					successTip: e("#userpasssame_sucess_ico")
				},
				secret_mail: {
					normalTip: e("#tips_userSecretMailNormal"),
					errorTip: e("#tips_userSecretMailError"),
					successTip: e("#usersecretmail_sucess_ico")
				},
				bindphone: {
					normalTip: e("#tips_userPhoneNormal"),
					errorTip: e("#tips_userPhoneError"),
					successTip: e("#userphone_sucess_ico")
				},
				verify_code: {
					normalTip: e("#tips_verifyCodeNormal"),
					errorTip: e("#tips_verifyCodeError"),
					successTip: e("#verfycode_sucess_ico")
				},
				usernick: {
					normalTip: e("#tips_userNick"),
					errorTip: e("#tips_userNickError"),
					successTip: e("#usernick_sucess_ico")
				},
				usersign: {
					normalTip: e("#tips_userSign"),
					errorTip: e("#tips_userSignError"),
					successTip: e("#usersign_sucess_ico")
				}
			}
		},
		inputTextFocusorBlur: function() {
			e(":text, :password").focus(function() {
				e(this).addClass("text-active")
			}).blur(function() {
				e(this).removeClass("text-active")
			})
		}
	}
}(jQuery),
function(e, t) {
	function n(e) {
		return l()
	}
	var i = e.gozap,
		o = i.labi,
		a = o.i18n,
		s = (a.register, o.RESULT_CODE.success);
	loginWin = {
		enterIn: function(e) {
			var e = e ? e : window.event ? window.event : null;
			13 == e.keyCode && loginWin.login_submit()
		},
		login_submit: function() {
			var t = e("#login-wrong-info"),
				n = e("#destJid"),
				a = e("#password");
			if("" == e.trim(n.val())) return t.html("请输入您的用户名"), n.focus(), !1;
			if("" == a.val()) return t.html("请输入您的密码"), a.focus(), !1;
			var r = e("#autologin");
			r.attr("checked") ? r.val("1") : r.val("0");
			var l = "/passport/login.do";
			e("#login_btn").hide(), e("#info_loading_ico").show(), o.ajax({
				url: l,
				type: "POST",
				data: i.param({
					jid: e.trim(n.val()),
					password: a.val(),
					oneMonth: r.val()
				}),
				success: function(t) {
					if(t.code != s) {
						var n = t.data.extMst;
						return "" == n ? e("#login-wrong-info").html(t.message) : o.showTopTips(o.TIPS_TYPE.error, n), e("#login_btn").css("display", "inline-block"), e("#info_loading_ico").hide(), !1
					}
					if(e("#login-dialog-btn-close").click(), e.cookie("puid", t.data.puid), 1 == e("#isAjax").val()) {
						var a = e("#isAjax").data("ajax"),
							r = e("#isAjax").data("ajax"),
							l = t.data.destJid;
						if(comitUrl = a.data + "&" + i.param({
								jid: l
							}), comitUrl = comitUrl.replace("jid=&", ""), comitUrl = comitUrl.replace("jid=undefined&", ""), a.data = comitUrl, "投票成功" == e("#login_ajaxInfo").val()) return void o.ajax(a);
						if("推荐已成功" == e("#login_ajaxInfo").val()) return void o.ajax(r);
						if("publish" == e("#login_ajaxInfo").val()) return void window.location.reload();
						var c = e("#isComment").data("isComment");
						"" != c && null != c && (o.showTopTips(o.TIPS_TYPE.success, "发表评论成功"), window.location.reload(), o.ajax(a), e("discus-a-" + c).click())
					} else e("#login-dialog-btn-close").click(), window.location.reload(), "" != e.trim(e("#txt-comment").val()) && (e("#hidjid").val(t.data.destJid), e("#pub-btn4").click())
				}
			})
		}
	};
	var r = {
		destJid: {
			normalTip: e("#tips_userNameNormal"),
			errorTip: function() {
				e("#reg_username_sucess_ico").css("background-position", "0px -630px")
			},
			successTip: function() {
				e("#reg_username_sucess_ico").css("background-position", "0px -615px")
			}
		},
		password: {
			normalTip: e("#tips_userPassNormal"),
			errorTip: function() {
				e("#reg_userpassword_sucess_ico").css("background-position", "0px -630px")
			},
			successTip: function() {
				e("#reg_userpassword_sucess_ico").css("background-position", "0px -615px")
			}
		},
		confirm_password: {
			normalTip: e("#tips_userPassSameNormal"),
			errorTip: function() {
				e("#reg_userpasswordconfir_sucess_ico").css("background-position", "0px -630px")
			},
			successTip: function() {
				e("#reg_userpasswordconfir_sucess_ico").css("background-position", "0px -615px")
			}
		},
		secret_mail: {
			normalTip: e("#tips_userSecretMailNormal"),
			errorTip: function() {
				e("#reg_usermail_sucess_ico").css("background-position", "0px -630px")
			},
			successTip: function() {
				e("#reg_usermail_sucess_ico").css("background-position", "0px -615px")
			}
		},
		verify_code: {
			normalTip: e("#tips_verifyCodeNormal"),
			errorTip: e("#tips_verifyCodeError"),
			successTip: e("#verfycode_sucess_ico")
		}
	};
	regWin = {
		enterIn: function(e) {
			var e = e ? e : window.event ? window.event : null;
			13 == e.keyCode && regWin.reg_submit()
		},
		tipshowInfo: function(t) {
			e("#reg-wrong-info").html(t)
		},
		checkUSerSecretMailRule: function() {
			var t = e.trim(e("#reg_secret_mail").val());
			if(gozapCommon.isEmpty(t)) return mailCorss = !1, !1;
			if(!gozapCommon.isEmail(t)) return regWin.tipshowInfo("邮箱格式不合法，请重新输入"), r.secret_mail.errorTip(), e("#reg_usermail_sucess_ico").show(), mailCorss = !1, !1;
			var n = "/profile/email/notexist";
			o.ajax({
				url: n,
				type: "POST",
				data: i.param({
					email: t
				}),
				success: function(t) {
					return t.code == s ? (e("#reg_usermail_sucess_ico").show(), r.secret_mail.successTip(), mailCorss = !0, !0) : (regWin.tipshowInfo(t.message), e("#reg_usermail_sucess_ico").show(), r.secret_mail.errorTip(), mailCorss = !1, !1)
				}
			})
		},
		checkUSerSamePassRule: function() {
			var t = e.trim(e("#reg_confirm_password").val());
			return gozapCommon.isEmpty(t) ? (conpassCorss = !1, !1) : t == e.trim(e("#reg_password").val()) || (regWin.tipshowInfo("两次密码不一致，请重新输入"), r.confirm_password.errorTip(), e("#reg_userpasswordconfir_sucess_ico").show(), conpassCorss = !1, !1)
		},
		checkUSerPassRule: function() {
			var t = e.trim(e("#reg_password").val());
			return gozapCommon.isEmpty(t) ? (passCorss = !1, !1) : gozapCommon.isBetweenLength(t, 6, 16) ? !("" != e.trim(e("#reg_confirm_password").val()) && !regWin.checkUSerSamePassRule()) : (regWin.tipshowInfo("密码长度必须为6-16位字符，请重新输入"), r.password.errorTip(), e("#reg_userpassword_sucess_ico").show(), passCorss = !1, !1)
		},
		checkUSerNameExsit: function() {
			var t = e.trim(e("#reg_destJid").val());
			if(gozapCommon.isEmpty(t)) return reguserNameCorss = !1, !1;
			if(!gozapCommon.isUserName(t) || !gozapCommon.isBetweenLength(t, 5, 20)) return regWin.tipshowInfo("用户名格式不正确，请重新输入"), r.destJid.errorTip(), e("#reg_username_sucess_ico").show(), reguserNameCorss = !1, !1;
			var n = "/profile/user/notexist";
			o.ajax({
				url: n,
				type: "POST",
				data: i.param({
					jid: t
				}),
				success: function(t) {
					return t.code == s ? (e("#reg_username_sucess_ico").show(), r.destJid.successTip(), reguserNameCorss = !0, !0) : (regWin.tipshowInfo(t.message), e("#reg_username_sucess_ico").show(), r.destJid.errorTip(), reguserNameCorss = !1, !1)
				}
			})
		},
		destJidBlurTips: function(t) {
			e("#reg_destJid").focus(function() {
				e(this).parent().addClass("text-box-active")
			}).blur(function() {
				return e(this).parent().removeClass("text-box-active"), regWin.tipshowInfo(""), !!regWin.checkUSerNameExsit() && (reguserNameCorss = !0, r.destJid.successTip(), void e("#reg_username_sucess_ico").show())
			})
		},
		passwordBlurTips: function(t) {
			e("#reg_password").focus(function() {
				e(this).parent().addClass("text-box-active")
			}).blur(function() {
				return e(this).parent().removeClass("text-box-active"), regWin.tipshowInfo(""), !!regWin.checkUSerPassRule() && (passCorss = !0, r.password.successTip(), void e("#reg_userpassword_sucess_ico").show())
			})
		},
		confirmpasswordBlurTips: function(t) {
			e("#reg_confirm_password").focus(function() {
				e(this).parent().addClass("text-box-active")
			}).blur(function() {
				return e(this).parent().removeClass("text-box-active"), regWin.tipshowInfo(""), regWin.checkUSerSamePassRule() ? (conpassCorss = !0, r.confirm_password.successTip(), void e("#reg_userpasswordconfir_sucess_ico").show()) : (conpassCorss = !1, !1)
			})
		},
		secretmailBlurTips: function() {
			e("#reg_secret_mail").focus(function() {
				e(this).parent().addClass("text-box-active")
			}).blur(function() {
				return e(this).parent().removeClass("text-box-active"), regWin.tipshowInfo(""), !!regWin.checkUSerSecretMailRule() && (mailCorss = !0, r.secret_mail.successTip(), void e("#reg_usermail_sucess_ico").show())
			})
		},
		reg_submit: function() {
			var t = e("#reg-wrong-info"),
				n = e("#reg_destJid"),
				a = e("#reg_password"),
				l = e("#reg_confirm_password"),
				c = e("#reg_secret_mail"),
				d = e("#reg_code");
			if("" == e.trim(n.val())) return t.html("请输入用户名"), r.destJid.errorTip(), e("#reg_username_sucess_ico").show(), !1;
			if(regWin.checkUSerNameExsit(), "" == a.val()) return t.html("请输入密码"), r.password.errorTip(), e("#reg_userpassword_sucess_ico").show(), !1;
			if(regWin.checkUSerPassRule(), "" == l.val()) return t.html("请输入确认密码"), r.confirm_password.errorTip(), e("#reg_userpasswordconfir_sucess_ico").show(), !1;
			if(regWin.checkUSerSamePassRule(), "" == e.trim(c.val())) return t.html("请输入联系邮箱"), r.secret_mail.errorTip(), e("#reg_usermail_sucess_ico").show(), c.focus(), !1;
			if(regWin.checkUSerSecretMailRule(), reguserNameCorss && passCorss && conpassCorss && mailCorss) {
				if(!e("#readPl").attr("checked")) return void regWin.tipshowInfo("请阅读并接受服务条款和隐私政策");
				e("#reg_btn").hide(), e("#reg_info_loading_ico").show();
				var u = e.trim(n.val()),
					p = a.val(),
					h = (l.val(), e.trim(c.val())),
					f = "/passport/register.do";
				o.ajax({
					url: f,
					type: "POST",
					data: i.param({
						jid: u,
						password: p,
						email: h,
						code: MD5(e.trim(d.val()))
					}),
					success: function(t) {
						return t.code != s ? (e("#reg_btn").css("display", "inline-block"), e("#reg_info_loading_ico").hide(), o.showTopTips(o.TIPS_TYPE.error, t.data.extMst), !1) : (e("#reg_btn").css("display", "inline-block"), e("#reg_info_loading_ico").hide(), o.showTopTips(o.TIPS_TYPE.success, t.data.extMst), window.location.reload(), void 0)
					}
				})
			}
		}
	};
	var l = function() {
		function t() {
			var e = document.createElement("input");
			return "placeholder" in e
		}

		function n(e) {
			this.input = e, this.label = document.createElement("label"), this.label.innerHTML = e.getAttribute("placeholder"), this.label.style.cssText = "position:absolute; text-indent:4px;color:#999999; font-size:12px;top:7px;left:5px;", "" != e.value && (this.label.style.display = "none"), this.init(e)
		}

		function a(e) {
			for(var t = 0, n = [], i = e.length; t < i; t++) n[t] = e[t];
			return n
		}
		var s = this,
			r = e(".module-login-mask"),
			l = r.find(".box-login"),
			c = r.find(".box-register"),
			d = r.find(".box-register-mobile"),
			u = r.find(".box-register-detail"),
			p = {
				"北京": ["西城", "东城", "朝阳", "海淀", "丰台", "石景山", "门头沟", "房山", "通州", "顺义", "大兴", "昌平", "平谷", "怀柔", "密云", "延庆"],
				"天津": ["河东", "河西", "南开", "河北", "红桥", "滨海新区", "东丽", "西青", "北辰", "津南", "武清", "宝坻", "静海", "宁河", "蓟县", "和平"],
				"河北": ["石家庄", "秦皇岛", "廊坊", "保定", "邯郸", "唐山", "邢台", "衡水", "张家口", "承德", "沧州"],
				"山西": ["太原", "大同", "长治", "晋中", "阳泉", "朔州", "运城", "临汾", "晋城", "忻州", "吕梁"],
				"内蒙古": ["呼和浩特", "赤峰", "通辽", "锡林郭勒", "兴安盟", "包头", "乌海", "鄂尔多斯", "呼伦贝尔", "巴彦淖尔", "乌兰察布", "阿拉善盟"],
				"辽宁": ["大连", "沈阳", "鞍山", "抚顺", "营口", "锦州", "丹东", "朝阳", "辽阳", "阜新", "铁岭", "盘锦", "本溪", "葫芦岛"],
				"吉林": ["长春", "吉林", "四平", "辽源", "通化", "延边", "白城", "松原", "白山"],
				"黑龙江": ["哈尔滨", "齐齐哈尔", "大庆", "牡丹江", "鹤岗", "佳木斯", "绥化", "伊春", "鸡西", "双鸭山", "七台河", "黑河", "大兴安岭"],
				"上海": ["浦东", "杨浦", "徐汇", "静安", "黄浦", "普陀", "闸北", "虹口", "长宁", "宝山", "闵行", "嘉定", "金山", "松江", "青浦", "崇明", "奉贤"],
				"江苏": ["南京", "苏州", "无锡", "常州", "扬州", "徐州", "南通", "镇江", "泰州", "淮安", "连云港", "宿迁", "盐城"],
				"浙江": ["杭州", "金华", "宁波", "温州", "嘉兴", "绍兴", "丽水", "湖州", "台州", "舟山", "衢州"],
				"安徽": ["合肥", "马鞍山", "蚌埠", "黄山", "芜湖", "淮南", "铜陵", "阜阳", "宣城", "安庆", "淮北", "宿州", "滁州", "六安", "池州", "毫州"],
				"福建": ["福州", "厦门", "泉州", "漳 州", "南平", "龙岩", "莆田", "三明", "宁德"],
				"江西": ["南昌", "景德镇", "上饶", "萍乡", "九江", "吉安", "宜春", "鹰潭", "新余", "赣州", "抚州"],
				"山东": ["青岛", "济南", "淄博", "烟台", "泰安", "临沂", "日照", "德州", "威海", "东营", "菏泽", "济宁", "潍坊", "枣庄", "聊城", "滨州", "莱芜"],
				"河南": ["郑州", "洛阳", "开封", "平顶山", "濮阳", "安阳", "许昌", "南阳", "信阳", "周口", "新乡", "焦作", "三门峡", "商丘", "鹤壁", "驻马店", "济源"],
				"湖北": ["武汉", "孝感", "十堰", "荆州", "黄石", "宜昌", "黄冈", "恩施", "鄂州", "荆门", "咸宁", "襄阳", "随州", "仙桃"],
				"湖南": ["长沙", "湘潭", "岳阳", "株洲", "怀化", "永州", "益阳", "张家界", "常德", "衡阳", "湘西", "邵阳", "娄底", "郴州"],
				"广东": ["广州", "深圳", "东莞", "佛山", "珠海", "汕头", "韶关", "江门", "梅州", "揭阳", "中山", "河源", "惠州", "茂名", "湛江", "阳江", "潮州", "云浮", "汕尾", "肇庆", "清远"],
				"广西": ["南宁", "桂林", "柳州", "梧州", "来宾", "贵港", "玉林", "贺州", "北海", "防城港", "钦州", "百色", "河池", "崇左"],
				"海南": ["海口", "三亚", "白沙", "保亭", "昌江", "澄迈", "定安", "东方", "儋州", "乐东", "临高", "琼海", "屯昌", "万宁", "文昌", "五指山", "三沙", "陵水", "琼中", "洋浦"],
				"重庆": ["渝中", "大渡口", "江北", "沙坪坝", "九龙坡", "南岸", "北碚", "万盛", "双桥", "渝北", "巴南", "万州", "涪陵", "黔江", "长寿", "綦江", "大足", "江津", "合川", "永川", "南川", "璧山", "铜梁", "潼南", "荣昌", "梁平", "城口", "丰都", "垫江", "忠县", "开县", "云阳", "奉节", "巫山", "巫溪", "武隆", "石柱", "秀山", "酉阳", "彭水"],
				"四川": ["成都", "达州", "南充", "乐山", "绵阳", "德阳", "内江", "遂宁", "宜宾", "巴中", "自贡", "攀枝花", "泸州", "广元", "资阳", "雅安", "阿坝", "甘孜", "凉山", "广安", "眉山"],
				"贵州": ["贵阳", "遵义", "安顺", "黔西南", "六盘水", "毕节", "铜仁", "黔东南", "黔南"],
				"云南": ["昆明", "丽江", "昭通", "玉溪", "临沧", "文山", "红河", "大理", "曲靖", "保山", "普洱", "德宏", "怒江", "迪庆", "楚雄", "西双版纳"],
				"西藏": ["拉萨", "林芝", "日喀则", "昌都", "山南", "那曲", "阿里"],
				"陕西": ["西安", "咸阳", "延安", "汉中", "榆林", "商洛", "宝鸡", "渭南", "铜川", "安康", "杨凌"],
				"甘肃": ["兰州", "金昌", "天水", "武威", "张掖", "平凉", "酒泉", "嘉峪关", "白银", "定西", "陇南", "庆阳", "临夏", "甘南"],
				"青海": ["黄南", "海南", "西宁", "海东", "海西", "海北", "果洛", "玉树"],
				"宁夏": ["银川", "吴忠", "石嘴山", "固原", "中卫"],
				"新疆": ["乌鲁木齐", "哈密", "喀什", "巴音郭楞", "昌吉", "伊犁", "阿勒泰", "克拉玛依", "博尔塔拉", "吐鲁番", "阿克苏", "克孜勒苏", "和田"],
				"香港": ["中西区", "湾仔区", "东区", "南区", "九龙", "新界"],
				"澳门": ["花地玛堂区", "圣安多尼堂区", "大堂区", "望德堂区", "风顺堂区", "嘉模堂区", "圣方济各堂区", "路氹城"],
				"台湾": ["台北", "高雄", "台中", "新北", "桃园", "台南", "基隆", "新竹", "嘉义"]
			},
			h = function() {
				c.css("padding-left", "350px"), r.find(".step-box").find(".step-1").addClass("step-active"), r.find(".step-box").find(".step-2").removeClass("step-active"), r.find(".box-active").removeClass("box-active"), r.find(".box-login").find(".header").addClass("box-active"), d.show(), u.hide(), g()
			},
			f = function() {
				c.animate({
					"padding-left": 0
				}, 300), l.hide(), r.find(".step-box").find(".step-1").removeClass("step-active"), r.find(".step-box").find(".step-2").addClass("step-active"), r.find(".box-register").find(".header").eq(1).css("border-radius", "5px 5px 0 0").find("span").html("填写基本资料"), r.find(".body-register").css("border-radius", "0 0 5px 5px"), r.find(".btn-close").hide(), d.hide(), u.show()
			},
			m = function(e, t) {
				return g(), e.html('<span class="err-content">' + t + "</sapn>"), !1
			},
			g = function() {
				e(".err-content").remove()
			},
			v = function(e, t, n) {
				return n = n || "请填写完整信息", !!t || m(e, n)
			},
			b = function(e, t) {
				return !(t.length > 16 || t.length < 6) || m(e, "密码长度应在6-16位之间")
			},
			x = function(e, t) {
				return !(t.length > 100) || m(e, "签名长度不能超过100个字符")
			},
			y = function(e, t) {
				return t.length > 10 ? m(e, "昵称不能超过10个汉字") : !!/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_])*$/g.test(t) || m(e, "昵称只支持中英文、数字或下划线")
			},
			w = function() {
				var e = "";
				for(var t in p) e += '<option value="' + t + '">' + t + "</option>";
				r.find(".rgpro").append(e)
			},
			_ = function(e) {
				var t = "";
				for(var n in p[e]) t += '<option value="' + p[e][n] + '">' + p[e][n] + "</option>";
				r.find(".rgcity").html(t)
			};
		if(h(), w(), r.find(".box-register").click(function(t) {
				var n = e(t.target);
				n.hasClass(".box-login") || n.parents(".box-login").length > 0 ? (r.find(".box-active").removeClass("box-active"), r.find(".box-login").find(".header").addClass("box-active")) : (r.find(".box-active").removeClass("box-active"), r.find(".box-register").find(".header").eq(1).addClass("box-active"))
			}), s.loginAction = function(t) {
				r.find(".tab-box").find(".active").hasClass("tab-mobilelogin") ? v(r.find(".box-login").find(".err-msg"), r.find(".mobile").val(), "手机号不能为空") && v(r.find(".box-login").find(".err-msg"), r.find(".mbpwd").val(), "密码不能为空") && (r.find(".btn-login").find("span").eq(0).hide(), r.find(".btn-login").find("span").eq(1).show(), e.ajax({
					url: "/login",
					data: {
						phone: r.find(".region option:selected").val() + r.find(".mobile").val(),
						password: r.find(".mbpwd").val(),
						oneMonth: r.find(".keeplogin:checked").val() ? 1 : null
					},
					success: function(t) {
						t = JSON.parse(t);
						var n = t.result;
						if(g(), "9999" == t.result.code)
							if(r.find(".form-mobilelogin").submit(), "1" == t.result.data.complateReg) r.find(".box-active").removeClass("box-active"), r.find(".box-register").find(".header").eq(1).addClass("box-active").find("span").html("填写基本资料"), r.find(".btn-close").hide(), r.find(".step-box").find("span").hide(), d.hide(), u.show(), r.show(), r.find(".nick").focus(), r.find(".box-register-detail").find(".err-msg").html('<span class="err-content">请先完善资料才能进行操作</sapn>'), f(), "海外" == t.result.data.proveName ? (r.find(".rgregion").find('option[value="1"]').attr("selected", "seleced"), r.find(".rgregion").change()) : "" == t.result.data.proveName || (r.find(".rgpro").find('option[value="' + t.result.data.proveName + '"]').attr("selected", "seleced"), r.find(".rgpro").change(), r.find(".rgcity").find('option[value="' + t.result.data.cityName + '"]').attr("selected", "seleced")), r.find(".nick").val(t.result.data.nick), r.find('.sex[value="' + t.result.data.sex + '"]').click(), r.find(".sign").val(t.result.data.sign);
							else {
								if(e.cookie("puid", n.data.destJid), r.find(".btn-login").find("span").eq(0).hide(), r.find(".btn-login").find("span").eq(1).show(), 1 == e("#isAjax").val()) {
									var a = e("#isAjax").data("ajax"),
										s = e("#isAjax").data("ajax"),
										l = n.data.destJid;
									if(comitUrl = a.data + "&" + i.param({
											jid: l
										}), comitUrl = comitUrl.replace("jid=&", ""), comitUrl = comitUrl.replace("jid=undefined&", ""), a.data = comitUrl, "投票成功" == e("#login_ajaxInfo").val()) return o.ajax(a), void window.location.reload();
									if("推荐已成功" == e("#login_ajaxInfo").val()) return o.ajax(s), void window.location.reload();
									if("添加收藏已成功" == e("#login_ajaxInfo").val()) return o.ajax(s), void window.location.reload();
									if("publish" == e("#login_ajaxInfo").val()) return void window.location.reload();
									var c = e("#isComment").data("isComment");
									"" != c && null != c && (o.showTopTips(o.TIPS_TYPE.success, "发表评论成功"), window.location.reload(), o.ajax(a), e("discus-a-" + c).click())
								} else window.location.reload(), "" != e.trim(e("#txt-comment").val()) && (e("#hidjid").val(n.data.destJid), e("#pub-btn4").click());
								window.location.reload()
							}
						else "22157" == t.result.code ? f() : m(r.find(".box-mobilelogin").find(".err-msg"), t.result.message);
						r.find(".btn-login").find("span").eq(0).show(), r.find(".btn-login").find("span").eq(1).hide()
					}
				})) : v(r.find(".box-login").find(".err-msg"), r.find(".userid").val(), "用户名不能为空") && v(r.find(".box-login").find(".err-msg"), r.find(".pwd").val(), "密码不能为空") && (r.find(".btn-login").find("span").eq(0).hide(), r.find(".btn-login").find("span").eq(1).show(), e.ajax({
					url: "/login",
					data: {
						jid: r.find(".userid").val(),
						password: r.find(".pwd").val(),
						oneMonth: r.find(".keeplogin:checked").val() ? 1 : null
					},
					success: function(t) {
						t = JSON.parse(t);
						var n = t.result;
						if(g(), "9999" == t.result.code)
							if(r.find(".form-idlogin").submit(), "1" == t.result.data.complateReg) r.find(".box-active").removeClass("box-active"), r.find(".box-register").find(".header").eq(1).addClass("box-active").find("span").html("填写基本资料"), r.find(".btn-close").hide(), r.find(".step-box").find("span").hide(), d.hide(), u.show(), r.show(), r.find(".nick").focus(), r.find(".box-register-detail").find(".err-msg").html('<span class="err-content">请先完善资料才能进行操作</sapn>'), f(), "海外" == t.result.data.proveName ? (r.find(".rgregion").find('option[value="1"]').attr("selected", "seleced"), r.find(".rgregion").change()) : "" == t.result.data.proveName || (r.find(".rgpro").find('option[value="' + t.result.data.proveName + '"]').attr("selected", "seleced"), r.find(".rgpro").change(), r.find(".rgcity").find('option[value="' + t.result.data.cityName + '"]').attr("selected", "seleced")), r.find(".nick").val(t.result.data.nick), r.find('.sex[value="' + t.result.data.sex + '"]').click(), r.find(".sign").val(t.result.data.sign);
							else {
								if(e.cookie("puid", n.data.destJid), o.showTopTips(o.TIPS_TYPE.success, "登录成功"), 1 == e("#isAjax").val()) {
									var a = e("#isAjax").data("ajax"),
										s = e("#isAjax").data("ajax"),
										l = n.data.destJid;
									if(comitUrl = a.data + "&" + i.param({
											jid: l
										}), comitUrl = comitUrl.replace("jid=&", ""), comitUrl = comitUrl.replace("jid=undefined&", ""), a.data = comitUrl, "投票成功" == e("#login_ajaxInfo").val()) return o.ajax(a), void window.location.reload();
									if("推荐已成功" == e("#login_ajaxInfo").val()) return o.ajax(s), void window.location.reload();
									if("添加收藏已成功" == e("#login_ajaxInfo").val()) return o.ajax(s), void window.location.reload();
									if("publish" == e("#login_ajaxInfo").val()) return void window.location.reload();
									var c = e("#isComment").data("isComment");
									"" != c && null != c && (o.showTopTips(o.TIPS_TYPE.success, "发表评论成功"), window.location.reload(), o.ajax(a), e("discus-a-" + c).click())
								} else window.location.reload(), "" != e.trim(e("#txt-comment").val()) && (e("#hidjid").val(n.data.destJid), e("#pub-btn4").click());
								window.location.reload()
							}
						else "22157" == t.result.code ? f() : m(r.find(".box-idlogin").find(".err-msg"), t.result.message);
						r.find(".btn-login").find("span").eq(0).show(), r.find(".btn-login").find("span").eq(1).hide()
					}
				}))
			}, r.find(".btn-login").click(function() {
				s.loginAction()
			}), r.find(".btn-register").click(function() {
				v(r.find(".box-register-mobile").find(".err-msg"), r.find(".rgmobile").val(), "手机号不能为空") && v(r.find(".box-register-mobile").find(".err-msg"), r.find(".rgpwd").val(), "密码不能为空") && v(r.find(".box-register-mobile").find(".err-msg"), r.find(".rgcode").val(), "验证码不能为空") && b(r.find(".box-register-mobile").find(".err-msg"), r.find(".rgpwd").val()) && (r.find(".btn-register").find("span").eq(0).hide(), r.find(".btn-register").find("span").eq(1).show(), e.ajax({
					url: "/register",
					data: {
						phone: r.find(".rgmobileregion option:selected").val() + r.find(".rgmobile").val(),
						password: r.find(".rgpwd").val(),
						authCode: r.find(".rgcode").val()
					},
					success: function(e) {
						e = JSON.parse(e), g(), "9999" == e.result.code ? (f(), e.result.data.proveName && (r.find(".rgpro").find('option[value="' + e.result.data.proveName + '"]').attr("selected", "seleced"), r.find(".rgpro").change(), r.find(".rgcity").find('option[value="' + e.result.data.cityName + '"]').attr("selected", "seleced"))) : m(r.find(".box-register-mobile").find(".err-msg"), e.result.message), r.find(".btn-register").find("span").eq(1).hide(), r.find(".btn-register").find("span").eq(0).show()
					}
				}))
			}), r.find(".btn-accomplish").click(function() {
				v(r.find(".box-register-detail").find(".err-msg"), r.find(".nick").val(), "昵称不能为空") && y(r.find(".box-register-detail").find(".err-msg"), r.find(".nick").val()) && x(r.find(".box-register-detail").find(".err-msg"), r.find(".sign").val()) && (r.find(".btn-accomplish").find("span").eq(0).hide(), r.find(".btn-accomplish").find("span").eq(1).show(), e.ajax({
					url: "/perfect/userinfo",
					data: {
						nick: r.find(".nick").val(),
						proveName: "0" == r.find(".rgregion option:selected").val() ? r.find(".rgpro option:selected").val() : "海外",
						cityName: "0" == r.find(".rgregion option:selected").val() ? r.find(".rgcity option:selected").val() : "海外",
						sex: r.find(".sex:checked").val(),
						sign: r.find(".sign").val()
					},
					success: function(t) {
						t = JSON.parse(t);
						var n = t.result;
						if(g(), "9999" == t.result.code) {
							if(1 == e("#isAjax").val()) {
								var a = e("#isAjax").data("ajax"),
									s = e("#isAjax").data("ajax"),
									l = n.data.destJid;
								if(a) {
									if(comitUrl = a.data + "&" + i.param({
											jid: l
										}), comitUrl = comitUrl.replace("jid=&", ""), comitUrl = comitUrl.replace("jid=undefined&", ""), a.data = comitUrl, "投票成功" == e("#login_ajaxInfo").val()) return o.ajax(a), void window.location.reload();
									if("推荐已成功" == e("#login_ajaxInfo").val()) return o.ajax(s), void window.location.reload();
									if("添加收藏已成功" == e("#login_ajaxInfo").val()) return o.ajax(s), void window.location.reload();
									if("publish" == e("#login_ajaxInfo").val()) return void window.location.reload();
									var c = e("#isComment").data("isComment");
									"" != c && null != c && (o.showTopTips(o.TIPS_TYPE.success, "发表评论成功"), window.location.reload(), o.ajax(a), e("discus-a-" + c).click())
								} else "" != e.trim(e("#txt-comment").val()) && e("#pub-btn4").click()
							}
							window.location.reload()
						} else m(r.find(".box-register-detail").find(".err-msg"), t.result.message);
						r.find(".btn-accomplish").find("span").eq(0).show(), r.find(".btn-accomplish").find("span").eq(1).hide()
					}
				}))
			}), r.find(".btn-getcode").click(function() {
				var t = e(this);
				v(r.find(".box-register-mobile").find(".err-msg"), r.find(".rgmobile").val(), "手机号不能为空") && !t.hasClass("btn-disable") ? e.ajax({
					url: "/profile/sendcode",
					data: {
						phone: r.find(".rgmobileregion option:selected").val() + r.find(".rgmobile").val(),
						authType: "msg",
						type: 1,
						auth_secret: MD5(r.find(".rgmobileregion option:selected").val() + r.find(".rgmobile").val() + "-wbb8cadf-cc689fxycd_yw72ewqrt")
					},
					success: function(e) {
						if(e = JSON.parse(e), g(), "9999" == e.result.code) {
							var n = 60;
							t.addClass("btn-disable");
							var i = setInterval(function() {
								if(n > 0) {
									var e = "已发送(" + n + ")";
									n--
								} else clearInterval(i), e = "发送验证码", t.removeClass("btn-disable");
								t.html(e)
							}, 1e3)
						} else m(r.find(".box-register-mobile").find(".err-msg"), e.result.message)
					}
				}) : m(r.find(".box-register-mobile").find(".err-msg"), "请输入手机号")
			}), r.find(".btn-getvoicecode").click(function() {
				var t = e(this);
				v(r.find(".box-register-mobile").find(".err-msg"), r.find(".rgmobile").val(), "手机号不能为空") && !t.hasClass("btn-disable") && "86" == r.find(".rgmobileregion").find("option:selected").val() && e.ajax({
					url: "/profile/sendcode",
					data: {
						phone: r.find(".rgmobileregion option:selected").val() + r.find(".rgmobile").val(),
						authType: "voice",
						type: 1,
						auth_secret: MD5(r.find(".rgmobileregion option:selected").val() + r.find(".rgmobile").val() + "-wbb8cadf-cc689fxycd_yw72ewqrt")
					},
					success: function(e) {
						e = JSON.parse(e), g(), "9999" == e.result.code ? t.html("已拨打，请等待") : m(r.find(".box-register-mobile").find(".err-msg"), e.result.message)
					}
				})
			}), r.find(".btn-close").click(function() {
				r.hide(), h()
			}), r.find(".tab-box").find("span").click(function() {
				var t, n = e(this);
				n.hasClass("active") || (r.find(".tab-box").find(".active").removeClass("active"), n.addClass("active"), n.hasClass("tab-mobilelogin") ? (r.find(".box-mobilelogin").show(), r.find(".box-idlogin").hide(), r.find(".mobile").focus(), t = 1) : (r.find(".box-mobilelogin").hide(), r.find(".box-idlogin").show(), r.find(".userid").focus(), t = 2)), localStorage.setItem("logintype", t)
			}), 2 == localStorage.getItem("logintype") && r.find(".tab-idlogin").click(), r.find(".rgregion").change(function() {
				var t = e(this);
				"0" == t.val() ? r.find(".box-rgcity").show() : r.find(".box-rgcity").hide()
			}), r.find(".rgmobileregion").change(function() {
				var t = e(this);
				if("86" == t.val()) r.find(".box-voicecode").show();
				else if(r.find(".box-voicecode").hide(), "852" != t.val() && "853" != t.val() && "886" != t.val()) r.find(".rgregion").find('option[value="1"]').attr("selected", "seleced"), r.find(".rgregion").change();
				else {
					switch(t.val()) {
						case "852":
							r.find(".rgpro").find('option[value="香港"]').attr("selected", "seleced");
							break;
						case "853":
							r.find(".rgpro").find('option[value="澳门"]').attr("selected", "seleced");
							break;
						case "886":
							r.find(".rgpro").find('option[value="台湾"]').attr("selected", "seleced")
					}
					r.find(".rgpro").change()
				}
			}), r.find(".rgpro").change(function() {
				var t = e(this);
				_(t.val())
			}), r.find(".mbpwd, .pwd").keydown(function(t) {
				13 == t.keyCode && e(".btn-login").click()
			}), !t()) {
			n.prototype = {
				getxy: function(e) {
					var t, n;
					if(document.documentElement.getBoundingClientRect) {
						var i = document.documentElement,
							o = document.body,
							a = e.getBoundingClientRect(),
							s = i.scrollTop || o.scrollTop,
							r = i.scrollLeft || o.scrollLeft,
							l = i.clientTop || o.clientTop,
							c = i.clientLeft || o.clientLeft;
						t = a.left + r - c, n = a.top + s - l
					} else
						for(; e;) t += e.offsetLeft, n += e.offsetTop, e = e.offsetParent;
					return {
						left: t,
						top: n
					}
				},
				getwh: function(e) {
					return {
						w: e.offsetWidth,
						h: e.offsetHeight
					}
				},
				setStyles: function(e, t) {
					for(var n in t) e.style[n] = t[n] + "px"
				},
				init: function(t) {
					var n = this.label,
						i = this.input;
					this.getxy(i), this.getwh(i);
					e(t).parent().append(n), n.onclick = function() {
						this.style.display = "none", i.focus()
					}, i.onfocus = function() {
						n.style.display = "none"
					}, i.onblur = function() {
						"" == this.value && (n.style.display = "block")
					}
				}
			};
			for(var T = document.getElementsByTagName("input"), C = document.getElementsByTagName("textarea"), k = a(T), S = a(C), $ = k.concat(S), E = 0; E < $.length; E++) $[E].getAttribute("placeholder") && new n($[E])
		}
		return s
	};
	NS_login = {
		init: n
	}
}(jQuery);
var gozapCommon = {
		isEmpty: function(e) {
			return null == e || "" == $.trim(e) || "undefined" == e
		},
		isBetweenLength: function(e, t, n) {
			return e.length >= t && e.length <= n
		},
		isUserName: function(e) {
			return !!/^[0-9A-Za-z_]*$/.test(e)
		},
		isEmail: function(e) {
			return !!/^[_a-zA-Z0-9.]+@([_a-z0-9]+\.)+[a-z0-9]{2,3}$/.test(e)
		},
		isPhone: function(e) {
			var t = /^1[3|4|5|8][0-9]\d{4,8}$/;
			return !!t.test(e)
		},
		isOpenCapsLock: function(e) {
			var t = e || window.event,
				n = t.target || t.srcElement,
				i = (n.nextSibling, t.keyCode || t.which),
				o = t.shifKey || 16 == i || !1;
			return !!(i >= 65 && i <= 90 && !o || i >= 97 && i <= 122 && o)
		},
		isCookieEnabled: function() {
			return !!navigator.cookieEnabled
		},
		goTop: function() {
			window.scrollTo(0, 0)
		},
		goBottom: function() {
			window.scrollTo(0, document.body.scrollHeight)
		}
	},
	passwordStrength = {
		changePS: function(e, t) {
			0 == e ? $(t).css({
				width: "88px",
				"background-color": "#fff"
			}) : e <= 25 && e > 0 ? $(t).css({
				width: "22px",
				"background-color": "#ff0000"
			}) : e > 25 && e <= 50 ? $(t).css({
				width: "44px",
				"background-color": "#ff9900"
			}) : e > 50 && e <= 75 ? $(t).css({
				width: "66px",
				"background-color": "#0099ff"
			}) : e > 75 && e <= 100 && $(t).css({
				width: "88px",
				"background-color": "#009933"
			})
		},
		policy: function(e) {
			var t = 0;
			return e.length >= 6 ? (e.length >= 6 && e.length <= 8 ? t += 5 : e.length >= 9 && e.length <= 12 ? t += 10 : e.length >= 13 && e.length <= 16 && (t += 25), /^[a-z]+$/.test(e) && (t += 10), /[a-z]+/.test(e) && /[A-Z]+/.test(e) && (t += 20), /\d{2,}|(\d(\w+)\d)+/.test(e) ? t += 20 : /\d{1}/.test(e) && (t += 10), /\W{2,}|\W(\w+)\W/.test(e) ? t += 25 : /\W{1}/.test(e) && (t += 10), /[a-z]/.test(e) && /[A-Z]/.test(e) && /\d/.test(e) && /\W/.test(e) ? t += 5 : /[a-z|A-Z]/.test(e) && /\d/.test(e) && /\W/.test(e) ? t += 3 : /[a-z|A-Z]/.test(e) && /\d/.test(e) && (t += 2)) : e.length > 0 && e.length < 6 && (t += 1), t
		}
	},
	labi_view = {
		sms: {
			send: {
				title: "发短信",
				content: "内容",
				cont_tooLong_tips_a: "您的短信过长，将分成",
				cont_tooLong_tips_b: "条发送，是否继续发送？",
				loading: {
					cont_a: "短信正在发送：",
					cont_b: "条",
					complete_a: "短信发送完成，2秒后返回",
					complete_b: "短信发送完毕",
					to: "致",
					error: "短信发送失败！",
					success: "短信已送达"
				},
				faces: "表情",
				link: "网址",
				picture: "图片",
				contact: "联系人"
			},
			tips: {
				remove_success: "删除成功",
				addPnumToCnt: "添加到联系人",
				addPnum_title: "您可以将此号码添加到新联系人或现有联系人",
				addPnum_noChoice: "请选择要添加到的联系人",
				off: "您的手机蜡笔离线，请登录手机蜡笔后使用此功能",
				search: "搜索短信...",
				contentInput: "请输入短信内容...",
				pnumInput: "请点击左侧收件人，或直接输入姓名或号码（按Ctrl+Enter键发送）",
				sendMethod: "按Ctrl+Enter键发送",
				illegalOperation: {
					noSearchCondition: "请输入搜索条件",
					noRemoveOption: "请选择要删除的短信",
					noInputContent: "请输入短信内容",
					tooLongContent: "您所发的短信长度过长",
					noInputPnum: "请输入要发送的手机号码",
					unValidPnum: "请输入有效的手机号码",
					noReSendPnum: "请选择要重发的号码"
				},
				confirm: {
					removeOneSms: "您确定要将这条短信放到回收站吗?\n注意：这条短信将在手机上被删除！（黑莓手机除外）",
					removeSms: function(e) {
						return "您确定要将这“" + e + "”条短信放到回收站吗?\n注意：这条短信将在手机上被删除！（黑莓手机除外）"
					}
				}
			},
			search: {
				tips: "搜索短信...",
				result_a: "符合“",
				result_b: "”的短信搜索结果",
				no_result: "<strong>没有符合您搜索条件的短信</strong><br />您可以通过姓名、电话号码、短信内容进行搜索"
			},
			remove: "删除",
			noData: "此分类下没有短信",
			recipient: "收件人",
			addresser: "发件人",
			op: {
				reply: {
					title: "回复"
				},
				forward: {
					title: "转发"
				},
				remove: {
					title: "删除"
				},
				dialog: {
					title: "查看对话"
				}
			},
			sendTo: "发送至",
			name: {
				1: "收件箱",
				2: "已发短信",
				"": "全部短信"
			},
			sendError: {
				404: "手机蜡笔不在线，请登录手机蜡笔后重试！",
				500: "手机蜡笔短信发送失败，请稍后重试！",
				100: "手机蜡笔短信发送失败，请稍后重试！",
				503: "手机蜡笔短信发送失败，请稍后重试！",
				101: "手机蜡笔短信发送失败，请稍后重试！",
				504: "手机蜡笔短信发送超时，请稍后重试！"
			}
		},
		contact: {
			Address_Book: "蜡笔通讯录",
			info: "联系人信息",
			addTr: "添加",
			removeTr: "删除",
			group_add_title: "新建分组名称",
			group_add_opName: "新建分组",
			group_set_opName: "重命名组",
			group_remove_opName: "删除该组",
			ava_remove_opName: "删除头像",
			groupName: {
				"": "全部联系人",
				"-10": "未分类"
			},
			opName: {
				add: "新建联系人",
				set: "编辑联系人",
				imp: "导入",
				exp: "导出",
				print: "打印"
			},
			search_tips: "搜索联系人...",
			noData: {
				noGroup: "您没有未分组的联系人",
				inGroup: "此分组下没有联系人",
				addCnt: "添加成员",
				search: "<strong>没有符合您搜索条件的联系人</strong><br />您可以通过姓名、电话号码、公司名称、备注等信息进行搜索",
				print: "您没有联系人可供打印",
				favorite: {
					title: "常用联系人为空",
					tips: "常用联系人使用提示：",
					content: ["把您最常使用的联系人设为常用联系人，有助于更方便的使用联系人", "点击单个联系人右上角的星标记，把单个联系人设为常用联系人，再次点击取消设置"]
				}
			},
			groupInto: "分组",
			groupTo: "添加到...",
			remove: "删除",
			elemName: {
				name: "姓名",
				ln: "姓",
				fn: "名",
				nts: "备注",
				jt: "头衔",
				com: "公司",
				birth: "生日",
				ava: "头像",
				group: "分组"
			},
			attrName: {
				ph: {
					MP: "手机",
					HM: "手机(家庭)",
					WM: "手机(工作)",
					PH: "电话",
					HP: "电话(家庭)",
					WP: "电话(工作)",
					FX: "传真",
					HF: "传真(家庭)",
					WF: "传真(工作)",
					PP: "寻呼机",
					"": "其它电话"
				},
				im: {
					QQ: "QQ",
					MSN: "MSN",
					GTA: "Google Talk",
					SKY: "Skype",
					ICQ: "ICQ",
					AIM: "AIM",
					YAH: "YAH",
					JAB: "Jabber"
				},
				em: {
					HE: "邮箱(家庭)",
					WE: "邮箱(工作)",
					"": "其它邮箱"
				},
				addr: {
					HA: "地址(家庭)",
					WA: "地址(工作)",
					OA: "其它地址"
				},
				wp: {
					"": "网址",
					HW: "网址(家庭)",
					WW: "网址(工作)"
				},
				nts: {
					"": "备注"
				}
			},
			set: "编辑",
			tips: {
				noName: "请输入姓名",
				noGroupName: "请输入分组名",
				groupIsExist: "该分组名已存在",
				addGrp_success: "成功创建新分组",
				setGrp_success: "修改成功",
				confirm: {
					removeOneCnt: "您确定要删除此联系人？\n注意：删除后，此联系人在手机上也将被删除！",
					removeCnts: function(e) {
						return "您确定要删除这 " + e + " 个联系人？\n注意：删除后，这些联系人在手机上也将被删除！"
					},
					removeGrp: "您确定要删除这个联系人分组吗?\n(保留该分组中的联系人)"
				},
				noChoice_remove: "请选择要删除的联系人",
				noChoice_group: "请选择要分组的联系人",
				cnt_remove_success: "删除成功",
				addCntsToGrp_success: "已将所选联系人添加到",
				removeCntsFromGrp_success_a: "已从",
				removeCntsFromGrp_success_b: "删除所选联系人",
				search: "搜索联系人..."
			},
			addInto: "添加到...",
			removeFrom: "从以下组中删除...",
			history: {
				viewSMSSess: "查看短信记录",
				viewCRCSess: "查看通话记录",
				view: "查看修改历史",
				tips: {
					noData_1: "此联系人没有历史修改记录",
					noData_2: "后续您对此联系人的任何修改可在此查看"
				}
			},
			favorite: {
				0: {
					title: "设置为常用联系人"
				},
				1: {
					title: "从常用联系人中删除"
				}
			}
		},
		recipient: {
			tips: "点击选择收件人",
			title: "从联系人中添加",
			middle_left: "短信联系人",
			search: "搜索联系人...",
			middle_right_a: "收件人",
			middle_right_b: "（已添加0人）",
			noData: "您没有联系人",
			opName_remove: "移除"
		},
		status: {
			online: "手机蜡笔在线",
			off: "手机蜡笔离线",
			dnd: "数据读取中",
			off_tips: "本手机蜡笔不在线<br/>请启动您的手机蜡笔",
			model_set: "设置手机型号",
			status_set: "切换同步状态",
			sync_close: "手机蜡笔服务状态为”关闭同步”时将无法发送短信，是否需要开启手机蜡笔的同步服务？",
			sync_close_virtSms: "手机蜡笔服务状态为”关闭同步”时将无法创建虚拟短信，是否需要开启手机蜡笔的同步服务？",
			smsSync_manual: "手机蜡笔短信同步模式为”手动同步”时站点将无法立刻显示您已发送的短信，是否需要将其设置为“自动同步”",
			op: {
				success: "设置成功",
				remove_success: "删除成功",
				error: "操作失败,请稍后再试"
			},
			confirm_remove: "确定解除绑定？\n解除绑定后，此手机的相关信息及同步状态将被清理！",
			tips_client_remove: function(e) {
				return "注：如果已不再使用此手机，您可以“<span onclick=\"removeClient('" + e + "');\">解除此手机和本帐号的绑定</span>”！"
			}
		},
		notice: {
			title: "公告",
			user: {
				win_close: "[知道了，关闭窗口吧]"
			}
		},
		recycle: {
			title: "联系人回收站",
			removeOn: "删除于：",
			opName: {
				remove: "彻底删除",
				removeOne: "彻底删除",
				restore: "还原",
				restoreCnts: "还原"
			},
			tips: {
				confirm: {
					removeOne: "您确定要永久删除此联系人吗?\n此操作不可撤销！",
					remove: function(e) {
						return "您确定要永久删除这“" + e + "”个联系人吗?\n此操作不可撤销！"
					}
				},
				noChoice_remove: "请选择要永久删除的联系人",
				noChoice_restore: "请选择要还原的联系人",
				remove_success: "删除成功",
				restore_success: "还原成功"
			},
			noData: {
				title: "联系人回收站为空",
				tips: "回收站使用提示：",
				content: ["联系人回收站会保存您在手机上或站点上删除的联系人数据", "如果您误删了联系人数据，可在回收站内选择“还原”该联系人", "如果您想彻底删除联系人数据，可在回收站内选择联系人后“清除”该数据即可"]
			}
		},
		clearDouble: {
			title: "联系人去重",
			tips: {
				noCondition: "请选择去重条件",
				noDouble: "没有找到您联系人中的重复项",
				noCntToMerge: "您没有选择要合并的联系人"
			},
			exact: "完全匹配",
			approximate: "近似匹配",
			similar_entries: "近似条目",
			condition: {
				name: "姓名",
				ph: "电话",
				em: "邮件"
			},
			init_a: "您联系人中找到",
			init_b: "个数据重复内容",
			init_c: "的重复内容",
			init_exact: "在此过程中，这些内容会经过您同意安全的删除。",
			init_approximate: "当点击下一步时，您将有机会合并这些重复内容，以便完全控制您想要保留的详细信息",
			process_a: "重复联系人合并处理中",
			process_ba: "将合并",
			process_bb: "个近似匹配数据",
			process_c: "建议合并的重复数据内容",
			process_d: "预览合并后的结果",
			rightInfo: "这是正确的联系人信息",
			last_aa: "将从您的联系人数据中合并以下",
			last_ab: "项重复内容，点击“完成”将更改应用于联系人。",
			last_b: "请查阅将要删除和合并的联系人",
			last_ca: "将从您的联系人数据中删除下列",
			last_cb: "个重复内容",
			last_da: "将合并下列",
			last_db: "个近似匹配内容",
			finish_a: "正在处理您的联系人数据，请稍后...",
			finish_b: "正在删除完全匹配项",
			finish_c: "正在合并近似匹配项：",
			finish_d: "当前处理进度：",
			finish_e: "您的联系人重复数据已成功去除！",
			finish_f: "3秒后页面将自动跳转到蜡笔主页面，您也可以手动",
			finish_g: "点击这里跳转"
		},
		cntSel: {
			title: "选择联系人到此分组",
			cnt: "联系人",
			top_a: "（已添加",
			top_b: "人）"
		},
		dialog: {
			tips: {
				noData: "您没有与此人的对话",
				hideDialog: "收起对话",
				remove_success: "删除成功",
				confirm_remove: "您确定要将与此人的对话放到回收站吗？\n注意：与此人的对话将在手机上被删除！（黑莓手机除外）"
			},
			opName: {
				ex: "导出对话",
				remove: "删除对话"
			},
			ex_a: "请输入验证码后再导出对话",
			code: "验证码",
			code_tips: "(请输入图片中的数字)",
			code_change: "看不清换一张",
			me: "我："
		},
		tools: {
			title: "工具",
			ex_help_title: "如何将导出文件导入到以下服务："
		},
		set: {
			title: "设置",
			card: {
				title: "我的名片",
				nts: "自我介绍",
				set: "名片设置"
			},
			phone: {
				title: "我的手机",
				tips: {
					noData: {
						a: "您的帐号还没有绑定手机！请下载安装手机蜡笔后使用",
						b: "手机蜡笔是一款安装并运行在手机上的软件。没有它，我们将无法为您提供服务",
						c: "立即下载手机蜡笔>>"
					},
					brand_sel: "请选择手机品牌",
					model_sel: "请选择手机型号",
					noModelSel: "请选择您要设置的手机型号"
				},
				opName_change: "更改",
				noModel: "未知型号",
				brand: "品牌",
				model: "手机型号",
				model_a: "型号",
				model_change: "更改手机型号",
				pnum: "手机号码",
				timezone: "手机时区",
				version: "软件版本",
				remind: "站点登录提醒",
				state: "同步服务",
				sync: "同步状态",
				sync_auto: "自动同步",
				sync_manual: "手动同步",
				sync_open: "开启同步",
				sync_close: "关闭同步",
				open: "开启",
				close: "关闭",
				sms: "短信",
				contact: "联系人",
				crc: "通话记录",
				labiSet: "手机蜡笔设置",
				blackBerry: "黑莓"
			},
			account: {
				title: "帐号密码",
				password_change: "修改密码",
				email_change: "修改保密邮箱",
				data_clear: "清除帐号数据",
				button_clear: "一键清除帐号数据",
				username: "用户名",
				password: "密码",
				a: "如果不是您的帐号请点击此处",
				tips: {
					noPasswordInput: "请输入密码",
					confirm_clear: "您确定要一键清除您在蜡笔站点的所有数据吗？\n此操作不可恢复！",
					finish_a: "您在蜡笔站点的所有数据已经全部清除。\n3秒钟后页面将自动跳转到蜡笔首页，您可以手动",
					finish_b: "点击此链接跳转"
				},
				check: {
					labi_logout: "请确保您手机上的手机蜡笔软件已退出",
					data_exist: "请确保您手机上的短信、联系人数据依然存在"
				}
			},
			no_active: "此手机蜡笔未激活！",
			no_active_tips: "请打开此手机上的手机蜡笔软件“激活”后进行相关设置。"
		},
		newUser: {
			sms: {
				title: "您的帐号没有短信记录",
				opTitle: "如果您想把手机短信同步到蜡笔页面请按以下步骤操作：",
				opStep1: "1.绑定手机",
				opStep2: "2.同步数据",
				opStep1_cont_a: "立即下载手机蜡笔",
				opStep1_cont_b: "安装后按提示绑定蜡笔帐号",
				opStep2_cont: "手机功能表里打开“安装”文件夹 > 点击蜡笔图标登录，登录后您可以按照个人需求将手机数据自动同步到蜡笔页面"
			}
		},
		button: {
			value: {
				send: "发送",
				confirm: "确定",
				cancel: "取消",
				reSend: "重发失败短信",
				save: "保存",
				next: "下一步",
				back: "返回",
				skip: "跳过",
				merge: "审批",
				skipAll: "全部跳过",
				mergeAll: "全部审批",
				finish: "完成",
				ex: "导出",
				newCnt: "新建",
				addToCnt: "添加到现有",
				save_and_continue: "保存并新建",
				insert: "插入"
			}
		},
		goTop: "回到顶部",
		selectAll: "全选",
		nextPage: "下页",
		smsTips: {
			title: "蜡笔提示您：",
			a: "您有",
			b: "条新短信，点击查看"
		},
		code: {
			timeout: "验证码已超时",
			error: "您输入的数字与图片数字不符"
		},
		noName: "未命名",
		pleaseSelect: "请选择",
		please_select_group: "分组到",
		avatar_upload: "头像上传",
		tips: {
			off: "您的手机蜡笔离线，请登录手机蜡笔后使用此功能",
			op_fail: "操作失败，请稍后再试"
		},
		search_result: "搜索结果",
		a: "个",
		back: "<< 返回",
		sort: "排序",
		eachPage: "/页",
		year: "年",
		month: "月",
		day: "日"
	},
	labiTips = {
		removeSmsSuccess: "成功删除1条短信",
		removeSmsFailed: "短信删除失败，请稍后再试",
		sendSmsSuccess: "短信发送成功",
		issueSmsSuccess: "短信已下发到手机蜡笔",
		sendSmsFailed: "短信发送失败，请稍后再试",
		removeSmsDlgSuccess: "删除成功",
		removeSmsDlgFailed: "删除对话失败，请稍后再试",
		addCntSuccess: "联系人新建成功",
		addCntFailed: "保存信息时出错，操作失败，请稍后再试",
		setCntSuccess: "联系人信息修改成功",
		setCntFailed: "保存信息时出错，操作失败，请稍后再试",
		removeCntSuccess: "成功删除1个联系人",
		removeCntFailed: "联系人删除失败，请稍后再试",
		removeGrpSuccess: "成功删除该分组",
		operationFailed: "操作失败，请稍后再试",
		setCardSuccess: "您的名片修改成功",
		setCardFailed: "名片修改失败，请稍后再试",
		netError: "本地网络异常，请检查后重试",
		timeoutError: "网络超时，请检查本地网络后重试",
		loading: "数据加载中…",
		cntDataLoading: "联系人数据加载中…",
		emptyRecycleFailed: "操作失败，请稍后再试",
		restoreCntsFailed: "操作失败，请稍后再试",
		setPHModelSuccess: "手机型号修改成功",
		setPHModelFailed: "手机型号修改失败，请稍后再试",
		phNotValid: "手机号格式不合法",
		emNotValid: "邮件格式不合法",
		setAvaSuccess: "头像更新成功",
		setAvaFailed: "头像更新失败，请稍后再试",
		addVirtualSmsSuccess: "虚拟短信创建成功",
		addVirtualSmsFailed: "虚拟短信创建失败",
		noEnterName: "请输入姓名",
		noEnterPnum: "请输入号码",
		noEnterMsg: "请输入短信内容",
		noSelDt: "请选择时间"
	};
! function(e) {
	var t = e.gozap,
		n = t.labi,
		i = n.i18n,
		o = {
			confirmTips: function(e) {
				return e > 0 ? "您确定要删除这" + e + "条通知吗？" : "您确定要删除这条通知吗？"
			},
			topTips: "请选择要删除的通知",
			readTips: "请选择要标记为已读的通知",
			allReadSuccessTips: "已标记为已读",
			allReadFailTips: "标记失败，请稍候再试！",
			allDelFailTips: "删除失败，请稍候再试！"
		};
	i.notice || (i.notice = {}), e.extend(i.notice, o)
}(jQuery),
function(e) {
	function t(t) {
		e.extend(this, i, t), this._init()
	}
	var n = "broadcast,service".split(","),
		i = {
			logLevel: "warn"
		};
	t.prototype = {
		_init: function() {
			var t = this,
				n = "comet_proxy_iframe",
				i = document.getElementById(n);
			null == i && (e("body").append('<iframe style="display:none;" id="' + n + '" src="' + t.iframeUrl + '"></iframe>'), i = document.getElementById(n)), this.iframe = i, window.attachEvent ? i.attachEvent("onload", function() {
				t.iframeOnload.call(t)
			}) : i.addEventListener("load", function() {
				t.iframeOnload.call(t)
			}, !1)
		},
		broadcast: function(e) {
			this._isReady ? (this.cometd.isDisconnected() && this.cometd.handshake(), this.cometd.subscribe(t.generateChannel("broadcast", this.appId), e)) : this.addReadyListener(function() {
				this.broadcast(e)
			})
		},
		deliver: function(e) {
			this._isReady ? (this.cometd.isDisconnected() && this.cometd.handshake(), this.cometd.subscribe(t.generateChannel("service", this.appId), e)) : this.addReadyListener(function() {
				this.deliver(e)
			})
		},
		iframeOnload: function() {
			try {
				var e = this,
					t = e.iframe,
					n = t.contentWindow.cometd;
				e.cometd = n, n.configure({
					url: e.serviceUrl,
					logLevel: e.logLevel
				})
			} catch(i) {
				return void console.log(i.name + ": " + i.message)
			}
			if(!this._isReady && (this._isReady = !0, this._onReadyArray))
				for(var o = 0; o < this._onReadyArray.length; o++) this._onReadyArray[o].call(e)
		},
		addReadyListener: function(e) {
			if(!e) throw new Error("invalid param: listener[" + e + "]");
			this._onReadyArray || (this._onReadyArray = new Array), this._onReadyArray.push(e)
		}
	}, e.extend(t, {
		generateChannel: function(t, i) {
			if(e.inArray(t, n) < 0) throw new Error("invalid param: type");
			if(null == i || i.indexOf("/") > -1) throw new Error("invalid param: appId");
			return "/" + t + "/" + i
		}
	}), window.GozapComet = t
}(jQuery);
var Renren = Renren || {};
Renren.share || (Renren.share = function() {
	var e = navigator.userAgent.match(/(msie) ([\w.]+)/i),
		t = location.href.indexOf("#"),
		n = t == -1 ? location.href : location.href.substr(0, t),
		i = "",
		o = function(e) {
			return e.getAttribute("type") || "button"
		},
		a = {};
	"undefined" != typeof imgMinWidth ? a.imgMinWidth = imgMinWidth || 60 : a.imgMinWidth = 60, "undefined" != typeof imgMinHeight ? a.imgMinHeight = imgMinHeight || 60 : a.imgMinHeight = 60;
	var s = function(e, t) {
			if(!e.rendered) {
				e.paramIndex = t;
				var n = o(e).split("_"),
					i = "icon" == n[0] ? "icon" : "button",
					a = n[1] || "small",
					s = "xn_share_" + i + "_" + a,
					r = ['<span class="xn_share_wrapper ', s, '"></span>'];
				e.innerHTML = r.join(""), e.rendered = !0
			}
		},
		r = function(t) {
			var n = document.createElement("form");
			n.action = t.url, n.target = t.target, n.method = "POST", n.acceptCharset = "UTF-8";
			for(var i in t.params) {
				var o = t.params[i];
				if(null !== o && void 0 !== o) {
					var a = document.createElement("textarea");
					a.name = i, a.value = o, n.appendChild(a)
				}
			}
			var s = document.getElementById("renren-root-hidden");
			s || (s = document.createElement("div"), syl = s.style, syl.positon = "absolute", syl.top = "-10000px", syl.width = syl.height = "0px", s.id = "renren-root-hidden", (document.body || document.getElementsByTagName("body")[0]).appendChild(s)), s.appendChild(n);
			try {
				var r = null;
				e && "UTF-8" != document.charset.toUpperCase() && (r = document.charset, document.charset = "UTF-8"), n.submit()
			} finally {
				n.parentNode.removeChild(n), r && (document.charset = r)
			}
		},
		l = function() {
			if(document.charset) return document.charset.toUpperCase();
			for(var e = document.getElementsByTagName("meta"), t = 0; t < e.length; t++) {
				var n = e[t],
					i = n.getAttribute("charset");
				if(i) return n.getAttribute("charset");
				var o = n.getAttribute("content");
				if(o) {
					var a = o.toLowerCase(),
						s = a.indexOf("charset=");
					if(s != -1) {
						var r = a.indexOf(";", s + "charset=".length);
						return r != -1 ? a.substring(s + "charset=".length, r) : a.substring(s + "charset=".length)
					}
				}
			}
			return ""
		},
		c = l(),
		d = function(e) {
			return e = e || {}, e.api_key = e.api_key || "", e.resourceUrl = e.resourceUrl || n, e.title = e.title || "", e.pic = e.pic || "", e.description = e.description || "", n == e.resourceUrl && (e.images = e.images || i), e.charset = e.charset || c || "", e
		},
		u = function(t) {
			var n = "http://widget.renren.com/dialog/share",
				i = d(t),
				o = [];
			for(var a in i) i[a] && o.push(a + "=" + encodeURIComponent(i[a]));
			var s = n + "?" + o.join("&"),
				l = e ? 2048 : 4100,
				c = "width=700,height=650,left=0,top=0,resizable=yes,scrollbars=1";
			return s.length > l ? (window.open("about:blank", "fwd", c), r({
				url: n,
				target: "fwd",
				params: i
			})) : window.open(s, "fwd", c), !1
		};
	window.rrShareOnclick = u;
	var p = function() {
		if(!Renren.share.isReady && "complete" === document.readyState) {
			for(var e = document.getElementsByTagName("img"), t = [], n = 0; n < e.length; n++) e[n].width >= a.imgMinWidth && e[n].height >= a.imgMinHeight && t.push(e[n].src);
			window.rrShareImgs = t, t.length > 0 && (i = t.join("|")), document.addEventListener ? document.removeEventListener("DOMContentLoaded", p, !1) : document.detachEvent("onreadystatechange", p);
			for(var o = document.getElementsByName("xn_share"), r = o ? o.length : 0, l = 0; l < r; l++) {
				var c = o[l];
				s(c, l)
			}
			Renren.share.isReady = !0
		}
	};
	"complete" === document.readyState ? p() : document.addEventListener ? (document.addEventListener("DOMContentLoaded", p, !1), window.addEventListener("load", p, !1)) : (document.attachEvent("onreadystatechange", p), window.attachEvent("onload", p))
}, Renren.share());
var hex_chr = "0123456789abcdef";
if("Microsoft Internet Explorer" == navigator.appName) {
	var v = !1;
	navigator.appVersion.indexOf("MSIE 6") > -1 ? v = !0 : navigator.appVersion.indexOf("MSIE 7") > -1 ? v = !0 : navigator.appVersion.indexOf("MSIE 8") > -1 ? v = !0 : navigator.appVersion.indexOf("MSIE 9") > -1 && (v = !0), v && "function" == typeof window.jQuery && (jQuery.support.cors = !0)
}
window.console || (window.console = {
	log: function() {}
}), Date.prototype.Format = function(e) {
	var t = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		S: this.getMilliseconds()
	};
	/(y+)/.test(e) && (e = e.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
	for(var n in t) new RegExp("(" + n + ")").test(e) && (e = e.replace(RegExp.$1, 1 == RegExp.$1.length ? t[n] : ("00" + t[n]).substr(("" + t[n]).length)));
	return e
};
var timeFormat = function(e) {
		var t = new Date(e / 1e3),
			n = new Date;
		n.setHours(0, 0, 0);
		var i = new Date(n.getTime() - 864e5),
			o = new Date(n.getTime() - 5184e5),
			a = {
				y: t.getFullYear(),
				m: t.getMonth(),
				d: t.getDate(),
				day: t.getDay(),
				time: t.Format("hh:mm")
			},
			s = {
				y: n.getFullYear(),
				m: n.getMonth(),
				d: n.getDate(),
				day: n.getDay()
			},
			r = {
				y: i.getFullYear(),
				m: i.getMonth(),
				d: i.getDate(),
				day: i.getDay()
			},
			l = ({
				y: o.getFullYear(),
				m: o.getMonth(),
				d: o.getDate(),
				day: o.getDay()
			}, ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]),
			e = {
				f: a.time
			};
		return a.y == s.y && a.m == s.m && a.d == s.d ? e.h = "今天" : a.y == r.y && a.m == r.m && a.d == r.d ? e.h = "昨天" : t.getTime() >= o.getTime() ? e.h = l[a.day] : e.h = t.Format("yyyy-MM-dd"), e.str = e.h + " " + e.f, e
	},
	getArgs = function() {
		for(var e = {}, t = null, n = decodeURIComponent(location.search.substring(1)), i = /(?:([^&]+)=([^&]+))/g; null !== (t = i.exec(n));) e[t[1]] = t[2];
		return e
	},
	getArgsHash = function() {
		for(var e = {}, t = null, n = decodeURIComponent(location.hash.substring(1)), i = /(?:([^&]+)=([^&]+))/g; null !== (t = i.exec(n));) e[t[1]] = t[2];
		return e
	},
	playAudio = function() {
		function e() {
			return r || (r = new AudioContext), r
		}

		function t(e, t) {
			var n = new XMLHttpRequest;
			n.open("GET", e), n.responseType = "blob", n.onload = function() {
				t(this.response)
			}, n.onerror = function() {
				alert("Failed to fetch " + e)
			}, n.send()
		}

		function n(e, t) {
			var n = new FileReader;
			n.onload = function(e) {
				var n = new Uint8Array(e.target.result);
				t(n)
			}, n.readAsArrayBuffer(e)
		}

		function i(e, t) {
			n(e, function(e) {
				o(e)
			})
		}

		function o(e) {
			var t = AMR.decode(e);
			return t ? void a(t) : void alert("Failed to decode!")
		}

		function a(t) {
			var n = e(),
				i = n.createBufferSource(),
				o = n.createBuffer(1, t.length, 8e3);
			if(o.copyToChannel) o.copyToChannel(t, 0, 0);
			else {
				var a = o.getChannelData(0);
				a.set(t)
			}
			i.buffer = o, i.connect(n.destination), i.start()
		}

		function s() {
			$(".play_audio").click(function() {
				if(!l) {
					l = !0;
					var e = $(this).children("img");
					e.attr("src", "/images/wallet/voice_chat.gif");
					var n = $(this).html();
					n = 1e3 * parseInt(n.substr(n.indexOf("&nbsp;") + 6)), setTimeout(function() {
						e.attr("src", "/images/wallet/voice.png"), l = !1
					}, n ? n : 0), t($(this).attr("data-href"), function(e) {
						i(e)
					})
				}
			})
		}
		if(!isIEBrowser()) {
			window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
			var r = new AudioContext,
				l = !1;
			return {
				init: s
			}
		}
	}();
$(window).ready(function() {
		var e = $.gozap,
			t = e.labi;
		window.node = {
			purchase: {
				init: function(e) {
					$("#quantity_input").focus(), $(".CTB_number").unbind("keyup").bind("keyup", function() {
						$(this).val($(this).val().replace(/[^0-9]/g, "")), parseInt($(this).val()) > 0 ? $(".payment-amount span").html(parseInt($(this).val())) : $(".payment-amount span").html("")
					}), $(".czfs_right").unbind("click").bind("click", function() {
						$(".pay-wx").addClass("active"), $(".pay-zfb").removeClass("active")
					}), $(".czfs_left").unbind("click").bind("click", function() {
						$(".pay-zfb").addClass("active"), $(".pay-wx").removeClass("active")
					}), $(".btn-recharge").unbind("click").bind("click", function() {
						$(".purchase_CTB").find(".active").hasClass("pay-zfb") && ($(".CTB_number").val() ? $.ajax({
							url: "/alipay/placeOrder",
							type: "POST",
							data: {
								ct: $(".CTB_number").val()
							},
							dataType: "json",
							success: function(n) {
								"9999" == n.result.code ? (window.open("/alipay/direct?orderNo=" + n.result.data.orderNo), node.purchase.close(), node.paystatus.open({
									type: "paying",
									callback: function() {
										var t = function() {
											$.ajax({
												url: "/getOrderStatus",
												dataType: "json",
												data: {
													orderNo: n.result.data.orderNo
												},
												success: function(n) {
													"9999" == n.result.code ? $(".purchase_bg").length > 0 && node.paystatus.close({
														callback: function() {
															node.paystatus.open({
																type: "success",
																onclose: e.onclose,
																from: "recharge"
															})
														}
													}) : $(".purchase_bg").length > 0 && setTimeout(t, 3e3)
												}
											})
										};
										t()
									},
									onclose: function() {
										t.showTopTips(t.TIPS_TYPE.error, "充值取消")
									}
								})) : t.showTopTips(t.TIPS_TYPE.error, n.result.message)
							}
						}) : $(".CTB_number").focus()), $(".purchase_CTB").find(".active").hasClass("pay-wx") && ($(".CTB_number").val() ? $.ajax({
							url: "/pay/weixinCharge",
							type: "POST",
							data: {
								ct: $(".CTB_number").val()
							},
							dataType: "json",
							success: function(n) {
								if("9999" == n.result.code) {
									$(".purchase_CTB").html(['<div style="text-align:center;">', '<div class="btn-close" tar="purchase"></div>', '<div style="font-size:18px;color:#858d9e;">扫码支付</div>', '<div style="padding:10px;border-radius:4px;background:#edf4fd;width:180px;height:180px;display:inline-block;margin-top:18px;"><img src="' + n.result.data.qrcodeurl + '" width="180px" height="180px"></div>', '<div style="font-size:14px;color:#858d9e;margin-top:12px;">请用微信扫一扫支付</div>', "</div>"].join("")).css({
										padding: "44px 0 30px",
										width: "316px",
										"margin-left": "-108px",
										height: "270px"
									});
									var i = function() {
										$.ajax({
											url: "/getOrderStatus",
											dataType: "json",
											data: {
												orderNo: n.result.data.orderNo
											},
											success: function(t) {
												"9999" == t.result.code ? $(".purchase_bg").length > 0 && node.paystatus.close({
													callback: function() {
														node.paystatus.open({
															type: "success",
															onclose: e.onclose,
															from: "recharge"
														})
													}
												}) : $(".purchase_bg").length > 0 && setTimeout(i, 3e3)
											}
										})
									};
									i()
								} else t.showTopTips(t.TIPS_TYPE.error, n.result.message)
							}
						}) : $(".CTB_number").focus())
					})
				},
				open: function(e) {
					e.ct = e.ct || "", e.n.append(['<div class="purchase_bg">', '<div class="purchase_CTB">', '<div class="btn-close" tar="purchase"></div>', '<div class="purchase_top">', '<div class="quantity">', "<div>购买CT币数量</div>", '<input type="text" name="CTB_number" class="CTB_number" id="quantity_input" maxlength="8" size="8" value="' + e.ct + '" />', "</div>", '<div class="payment-amount">', "<div>需支付（元）</div>", "<span>" + e.ct + "</span>", "</div>", "</div>", '<div class="purchase_bottom">', '<div class="recharge_method">充值方式</div>', '<div class="czfs_left pay-zfb active"></div>', '<div class="czfs_right pay-wx"></div>', '<div class="btn-recharge">去充值</div>', "</div>", "</div>", "</div>"].join("")), node.purchase.init(e)
				},
				close: function() {
					$(".purchase_bg").remove()
				}
			},
			paystatus: {
				init: function(e) {
					$(".purchase_bg").find(".btn-submit").click(function() {
						"recharge" == e.from && (e.onclose = null), node.paystatus.close({
							callback: e.onclose || null
						})
					}), e.callback && e.callback()
				},
				open: function(e) {
					switch(e.type) {
						case "paying":
							$(".main-content").prepend(['<div class="purchase_bg">', '<div style="position:fixed;left:50%;top:200px;width:582px;margin-left:-291px;background:white;border-radius:8px;text-align:center;">', '<div class="btn btn-close" tar="purchase"></div>', '<div style="text-align:left;color:#575c66;font-size:24px;padding:60px 80px 20px;line-height:30px;">正在等待支付结果...</div>', '<div style="height:40px;padding:23px 0;background:#E9F3FB;border-bottom-left-radius:8px;border-bottom-right-radius:8px;">', '<div class="btn btn-block btn-submit" style="width:418px;margin-right:14px;color:white;background:#09639A;">取消支付</div>', "</div>", "</div>", "</div>"].join(""));
							break;
						case "success":
							$(".main-content").prepend(['<div class="purchase_bg">', '<div style="position:fixed;left:50%;top:200px;width:582px;margin-left:-291px;background:white;border-radius:8px;text-align:center;">', '<div class="btn btn-close" tar="purchase"></div>', '<div style="text-align:left;color:#575c66;font-size:24px;padding:60px 80px 20px;line-height:54px;">', '<div style="background:url(/images/wallet/buy_success.png) no-repeat left center;padding-left:74px;">支付成功!</div>', "</div>", '<div style="height:40px;padding:23px 0;background:#E9F3FB;border-bottom-left-radius:8px;border-bottom-right-radius:8px;">', '<div class="btn btn-block btn-submit" style="width:418px;margin-right:14px;color:white;background:#09639A;">完成支付</div>', "</div>", "</div>", "</div>"].join(""));
							break;
						case "chat-success":
							$(".main-content").prepend(['<div class="purchase_bg">', '<div style="position:fixed;left:50%;top:200px;width:582px;margin-left:-291px;background:white;border-radius:8px;text-align:center;">', '<div class="btn btn-close" tar="purchase"></div>', '<div style="text-align:left;color:#575c66;font-size:24px;padding:60px 80px 20px;">', '<div style="background:url(/images/wallet/buy_success.png) no-repeat left center;padding-left:74px;"><div>支付成功</div><div style="font-size:18px;color:#858d9e;margin-top:5px;">可以和' + e.nick + "开聊了</div></div>", "</div>", '<div style="height:40px;padding:23px 0;background:#E9F3FB;border-bottom-left-radius:8px;border-bottom-right-radius:8px;">', '<div class="btn btn-block btn-submit" style="width:418px;margin-right:14px;color:white;background:#09639A;">开聊</div>', "</div>", "</div>", "</div>"].join(""));
							break;
						case "chat-notenough":
							$(".main-content").prepend(['<div class="purchase_bg">', '<div style="position:fixed;left:50%;top:200px;width:582px;margin-left:-291px;background:white;border-radius:8px;text-align:center;">', '<div class="btn btn-close" tar="purchase"></div>', '<div style="text-align:left;color:#575c66;font-size:24px;padding:60px 80px 20px;">', '<div style="background:url(/images/wallet/warning.png) no-repeat left center;padding-left:74px;"><div style="color:red;">余额不足</div><div style="font-size:18px;color:#858d9e;margin-top:5px;">当前余额:<span style="color:red;font-size:22px;">' + e.balance + "</span></div></div>", "</div>", '<div style="height:40px;padding:23px 0;background:#E9F3FB;border-bottom-left-radius:8px;border-bottom-right-radius:8px;">', '<div class="btn btn-block btn-submit" style="width:418px;margin-right:14px;color:white;background:#09639A;">去充值</div>', "</div>", "</div>", "</div>"].join(""))
					}
					node.paystatus.init(e)
				},
				close: function(e) {
					$(".purchase_bg").remove(), e.callback && e.callback()
				}
			},
			chatbox: {
				user: {},
				preload: function(e) {
					return getArgsHash().chattarget ? ($.ajax({
						type: "post",
						url: "/u/ischat",
						data: {
							type: 1
						},
						success: function(t) {
							var t = JSON.parse(t).result;
							"9999" == t.code && 0 == t.data.ischat && ($('.page-chat textarea[name="text"]').blur(), e.n.prepend(['<div class="chat-loading" style="background-color: transparent">', '<img src="/images/notice-chat-private.png"/>', "</div>"].join("")), $(".chat-loading").click(function() {
								$(this).hide(), $('.page-chat textarea[name="text"]').focus()
							}))
						}
					}), void node.chatbox.open(e)) : getArgsHash().notice ? (setTimeout(function() {
						$(".page-chat").each(function() {
							0 == parseInt($(this).css("left"), 10) && (isIEBrowser() ? $(this).css({
								left: "300px"
							}, 300) : $(this).animate({
								left: "300px"
							}, 300))
						})
					}, 0), $.ajax({
						type: "post",
						url: "/u/ischat",
						data: {
							type: 2
						},
						success: function(t) {
							var t = JSON.parse(t).result;
							"9999" == t.code && 0 == t.data.ischat && (e.n.prepend(['<div class="chat-loading" style="background-color: transparent">', '<img src="/images/notice-chat-list.png"/>', "</div>"].join("")), $(".chat-loading").click(function() {
								$(this).hide(), location.hash = ""
							}))
						}
					}), localStorage.setItem("chat-notice-close", "closed"), void node.chatbox.open(e)) : (e.n.prepend(['<div class="chat-loading">', '<div class="chat-loading-main" style="margin-top:200px;">', '<div style="padding-left:12px;"><img src="/images/logo_big.png" ></div>', '<div style="font-size:16px;margin-top:10px;">抽屉聊天 <span style="font-size:12px;margin-top:20px;">(v2.0)</span></div>', '<div style="margin-top:10px;font-size:12px;">玩命拉抽屉中……</div>', '<div style="position:absolute;width:260px;font-size:14px;left:20px;bottom:50px;">' + $(".chat-area").find(".slogan").val() + "</div>", "</div>", "</div>"].join("")), e.n.find(".chat-loading-main").animate({
						"margin-top": "250"
					}, 3e3, "easeOutSine", function() {
						e.n.find(".chat-loading").animate({
							top: "-480"
						}, 500, "easeInCirc", function() {
							e.n.find(".chat-loading").remove()
						})
					}), void node.chatbox.open(e))
				},
				init: function(e) {
					node.chatbox.user = {
						jid: $("#hidjid").val(),
						img_url: $("#userProImg").attr("src"),
						nick: $("#userProNick").html()
					}, $(".chat-box").find(".tab-public").unbind("click").bind("click", function() {
						$(this).hasClass("active") || ($(".chat-box").find(".chat-private-box").hide(), $(this).addClass("active"), $(".chat-box").find(".tab-private").removeClass("active"), $(".chat-public-box").find("textarea").focus()), location.hash = ""
					}), $(".chat-box").find(".tab-private").unbind("click").bind("click", function() {
						$(this).hasClass("active") || ($(".chat-box").find(".chat-private-box").show(), $(this).addClass("active"), $(".chat-box").find(".tab-public").removeClass("active"))
					}), $(".chat-public-content").mCustomScrollbar({
						theme: "minimal-dark",
						callbacks: {
							onScroll: function() {
								$("#mCSB_1_container").height() == Math.abs(parseInt($("#mCSB_1_container").css("top"), 10)) + $(".chat-public-content").height() && $(".chat-public-content .chat-message-notice").remove()
							}
						}
					}), $(".chat-private-content").mCustomScrollbar({
						theme: "minimal-dark",
						callbacks: {
							onScroll: function() {
								var e = $('.page-chat[style="left: 0px;"]'),
									t = e.find(".mCSB_container") || e.select(".mCSB_container");
								t.height() == Math.abs(parseInt(t.css("top"), 10)) + $(".page-main-content").height() && $(".page-main-content .chat-message-notice").remove()
							}
						}
					}), context.init({
						compress: !0
					}), context.attach(".chat-private-content li", [{
						text: "加入黑名单",
						action: function() {
							$.ajax({
								url: "/pullBlack",
								dataType: "json",
								data: {
									jid: $(this).closest("ul").attr("jid")
								},
								success: function(e) {
									"9999" == e.result.code ? t.showTopTips(t.TIPS_TYPE.success, "拉黑成功,取消拉黑请在客户端操作") : t.showTopTips(t.TIPS_TYPE.error, e.result.message)
								}
							})
						}
					}], {
						attr: "jid",
						tar: "li"
					}), $(".chat-box").on("click", ".btn-face", function() {
						$(".chat-box").find(".exp-box").length > 0 ? node.chatbox.expression.close() : node.chatbox.expression.open({
							n: $(this).parents(".chat-sender"),
							tar: $(this).parents(".chat-sender").find(".inputer textarea")
						})
					}), $(".chat-box").on("click", ".btn-pic", function() {
						var e = $(this),
							n = $('<form enctype="multipart/form-data"><input name="file" type="file" accept="image/png,image/gif,image/jpg,image/jpeg" ></form>');
						n.find(":file").click(), n.find(":file").change(function() {
							var n = this.files[0];
							if(n.size > 5242880) return void t.showTopTips(t.TIPS_TYPE.error, "图片大小不能超过5MB");
							var i = new FileReader;
							i.onload = function(t) {
								var i = new Image;
								i.src = t.target.result, i.onload = function() {
									var o = new FormData;
									o.append("file", n), node.chatbox.message.add({
										tar: $("." + e.attr("tar")),
										file: o,
										status: e.attr("type"),
										isme: !0,
										content: {
											content: {
												url: t.target.result,
												width: i.naturalWidth,
												height: i.naturalHeight
											},
											createTime: 1e3 * (new Date).getTime(),
											user: {
												img_url: replaceHttps(e.attr("img")),
												nick: e.attr("nick"),
												jid: e.attr("jid")
											},
											type: 1
										}
									})
								}
							}, i.readAsDataURL(n)
						})
					}), $(".chat-box").on("click", ".btn-send", function() {
						if(!$(".chat-area").find(".islogin").val()) return void $(".login-btn-a").click();
						if(1 == $(".user-completereg").val()) return void $("#loginUserNc").click();
						if($(this).parent().prev().val()) {
							var e = $.trim($(this).parent().prev().val());
							e = e.replace(/[<>&"]/g, function(e) {
								return {
									"<": "&lt;",
									">": "&gt;",
									"&": "&amp;",
									'"': "&quot;"
								}[e]
							}), node.chatbox.message.add({
								tar: $("." + $(this).attr("tar")),
								status: $(this).attr("type"),
								isme: !0,
								content: {
									content: {
										text: e
									},
									createTime: 1e3 * (new Date).getTime(),
									user: {
										img_url: replaceHttps($(this).attr("img")),
										nick: $(this).attr("nick"),
										jid: $(this).attr("jid")
									},
									type: 0
								}
							}), $(this).parent().prev().val("").focus()
						}
					}), $(".chat-box").on("keypress", "textarea", function(e) {
						if(e.ctrlKey && 13 == e.which) {
							var t = $(this).val();
							$(this).val(t + "\r\n")
						}
						e.ctrlKey || 13 != e.which || $(this).parent().find(".btn-send").click()
					}), $(".chat-box").on("click", ".chat-public-box .message-other .userpic", function() {
						node.chatbox.infopage.open({
							jid: $(this).attr("jid")
						})
					}), $(".chat-box").on("click", ".chat-public-box .message-self .userpic", function() {
						window.open("/user/link/saved/1")
					}), $(".chat-box").on("click", ".chat-private-box .message-content", function() {
						setTimeout(function() {
							$(".chat-box").find(".mCS_destroyed").mCustomScrollbar("scrollTo", "last")
						}, 0), node.chatbox.chatpage.open({
							jid: $(this).parents("li").attr("jid")
						}), node.notice.setnum(localStorage.getItem("chat-notice-num") - $(this).closest("li").find(".message-num").html()), node.notice.close(), location.hash = ""
					}), $(".chat-box").on("click", ".chat-private-box .message .userpic", function() {
						window.open("/user/" + $(this).parents("li").attr("jid") + "/submitted/1")
					}), $(".chat-box").off("click", ".page-info .btn-close").on("click", ".page-info .btn-close", function() {
						node.chatbox.infopage.close({
							tar: $(this).attr("jid")
						})
					}), $(".chat-box").on("click", ".chat-private-box .btn-clearall", function() {
						node.chatbox.allclear.open()
					}), $(".chat-box").on("click", ".chat-private-box .btn-setcoin", function() {
						node.chatbox.setcoin.open()
					}), $(".chat-box").on("click", ".page-chat .btn-back", function() {
						getArgsHash().chattarget && (location.hash = ""), node.chatbox.chatpage.close({
							tar: $(this).parents(".page").attr("tar")
						}), $(".page-main-content .chat-message-notice").remove()
					}), $(".chat-box").mousewheel(function(e) {
						return e.stopPropagation(), e.preventDefault(), !1
					}), $.ajax({
						url: "/groupChat/getHistory.do",
						type: "post",
						dataType: "json",
						success: function(e) {
							if(e.messages.length > 0) {
								$.each(e.messages, function(e, t) {
									t.content.user.img_url = replaceHttps(t.content.user.img_url)
								});
								for(var t = 0; t < e.messages.length; t++) node.chatbox.message.add($.extend({
									tar: $(".chat-public-content"),
									form: "history"
								}, e.messages[t]))
							}
						}
					}), e.islogin && $.ajax({
						url: "/chat/getUnreadMessages",
						type: "post",
						dataType: "json",
						success: function(e) {
							if("9999" == e.result.code) {
								if(e.result.data.messages.length > 0) {
									for(var t = e.result.data.messages, n = t.length - 1; n >= 0; n--) node.chatbox.chatpage.open({
										hide: !0,
										jid: t[n].user.jid
									});
									node.chatbox.chatlist.init(e.result.data.messages)
								}
								if($(".chat-area").length > 0) {
									var i = 0;
									$(".chat-private-content .message .message-num").each(function() {
										i += "" == $(this).text() ? 0 : parseInt($(this).text(), 10)
									}), 0 == i && (node.notice.setnum(0), node.notice.close())
								}
							}
						}
					});
					setInterval(function() {
						$.ajax({
							url: "/groupChat/updateActiveTime.do",
							dataType: "json",
							success: function(e) {}
						})
					}, 6e5), getArgsHash().chattarget && ($(".page-chat").each(function() {
						0 == parseInt($(this).css("left"), 10) && (isIEBrowser() ? $(this).css({
							left: "300px"
						}, 300) : $(this).animate({
							left: "300px"
						}, 300))
					}), node.chatbox.chatpage.open({
						jid: getArgsHash().chattarget
					})), getArgsHash().notice && $(".chat-box").find(".tab-private").click(), $(window).on("beforeunload", function() {
						e.islogin && ($(".chat-public-content").html("<ul></ul>"), $(".chat-private-content, .page-main-content").css("overflow", "hidden"), $(".chat-private-content, .page-main-content").mCustomScrollbar("destroy"), $(".chat-box").find(".page-info").remove(), $(".chat-box").find(".chat-public-box .btn-send").attr("nick", $("#userProNick").html()), $(".chat-box").find(".chat-public-box .btn-send").attr("img", $("#userProImg").attr("src")), $(".chat").find(".chat-loading").remove(), localStorage.setItem("chat-box", $(".chat-area .chat").html()), localStorage.setItem("jid", node.chatbox.user.jid))
					}), e.isStorage && $(".chat-box").find(".mCS_destroyed").mCustomScrollbar({
						theme: "minimal-dark",
						callbacks: {
							onScroll: function() {
								var e = $('.page-chat[style="left: 0px;"]'),
									t = e.find(".mCSB_container") || e.select(".mCSB_container");
								t.height() == Math.abs(parseInt(t.css("top"), 10)) + $(".page-main-content").height() && $(".page-main-content .chat-message-notice").remove()
							}
						}
					}), e.isStorage && setTimeout(function() {
						$(".chat-box").find(".mCS_destroyed").mCustomScrollbar("scrollTo", "last")
					}, 0)
				},
				open: function(e) {
					if(localStorage.getItem("chat-box")) {
						if(e.islogin || $(".chat-notice-area") && localStorage.getItem("jid") == $("#hidjid").val()) {
							var t = $(localStorage.getItem("chat-box"));
							if(0 != t.length) {
								var n, i = t.find(".J_message_time"),
									o = 0,
									a = i.length;
								for(o; o < a; o++) {
									var s = i[o].getAttribute("time");
									$(i[o]).hasClass("message-time") ? (n = timeFormat(s), i[o].innerHTML = n.str) : (n = $.inArray(timeFormat(s).h, ["今天", "昨天", "周日", "周一", "周二", "周三", "周四", "周五", "周六"]) >= 0 ? timeFormat(s).h : new Date(s / 1e3).Format("yyyy-MM-dd"), i[o].innerHTML = n)
								}
								$(".chat-area .chat").append(t[0].outerHTML)
							}
							return isIEBrowser() || playAudio.init(), void node.chatbox.init($.extend({
								isStorage: !0
							}, e))
						}
						localStorage.removeItem("chat-box")
					}
					var r = "";
					r = e.islogin ? '<div class="tab-public active" style="width:50%;border-top-left-radius:4px;">公共聊天</div><div class="tab-private" style="width:50%;border-top-right-radius:4px;">消息</div>' : '<div class="tab-public active" style="width:100%;border-top-radius:4px;">公共聊天</div>', e.n.append(['<div class="chat-box">', '<div class="chat-mask"><div style="display:inline-block;width:30px;height:100%;background:white;"></div><div style="display:inline-block;width:30px;height:100%;background:#ededed;"></div><div style="position:absolute;width:300px;height:20px;background:white;left:-300px;top:-21px;"></div></div>', '<div class="chat-main-box">', '<div class="chat-main-header">', r, "</div>", '<div class="chat-public-box">', '<div class="chat-public-content"><ul></ul></div>', '<div class="chat-sender">', '<div class="funcbar"><div class="btn btn-face"></div></div>', '<div class="inputer">', '<textarea name="text"></textarea>', '<div style="text-align:right;"><div class="btn btn-send" tar="chat-public-content" nick="' + $("#userProNick").html() + '" jid="' + $("#hidjid").val() + '" img="' + $("#userProImg").attr("src") + '">发送</div></div>', "</div>", "</div>", "</div>", '<div class="chat-private-box" style="display:none;">', '<div class="func"><div class="btn btn-clearall">全部置为已读</div><div class="btn btn-setcoin">设置聊天门槛</div></div>', '<div class="chat-private-content"><ul><img style="display:block;margin:50% auto;" src="/images/wallet/chatlist_empty.png"/></ul></div>', "</div>", "</div>", "</div>"].join("")),
						node.chatbox.init(e)
				},
				close: function() {},
				message: {
					messageNoticeSeting: {
						state: "show"
					},
					init: function(e) {},
					add: function(e) {
						if(0 != e.content.type || 0 != $.trim(e.content.content.text).length) {
							var n = e.content.user.jid == node.chatbox.user.jid ? "self" : "other";
							e.isme && function() {
								n = "self"
							}();
							var i, o;
							switch(e.content.type) {
								case 0:
									var a = e.content.content.text;
									if(a.indexOf("http://") != -1 || a.indexOf("https://") != -1) {
										a = a.replace("http", " http");
										for(var s = a.split(" "), r = 0; r < s.length; r++) s[r].indexOf("http://") == -1 && s[r].indexOf("https://") == -1 || (s[r] = '<a style="color:#369;" target="_blank" href="' + s[r] + '">' + s[r] + "</a>");
										a = s.join(" ")
									}
									if(getStringLength(a) > 1200) return void t.showTopTips(t.TIPS_TYPE.error, "最多输入1200字符!");
									i = a, o = "文字消息";
									break;
								case 1:
									i = e.isme ? '<div class="pic-mask" style="position:absolute;z-index:1;width:100%;height:100%;top:0;right:0;background:white;opacity:0.75;"></div><figure><img style="margin:-10px;border-radius:8px;max-width:190px;display:block;" src="' + e.content.content.url + '" data-size="' + e.content.content.width + "x" + e.content.content.height + '" class="pic"></figure>' : '<figure><img style="margin:-10px;border-radius:8px;max-width:190px;display:block;" src="' + e.content.content.url + '" data-size="' + e.content.content.width + "x" + e.content.content.height + '" class="pic"></figure>', o = "图片消息";
									break;
								case 2:
									if(isIEBrowser()) i = '<span style="line-height:12px;vertical-align: middle"><img style="height:12px" src="/images/wallet/voice.png">&nbsp;收到一条语音消息,请到客户端收听</span>';
									else {
										var l = 50 + 3 * parseInt(e.content.content.duration);
										i = '<span class="play_audio" style="width:' + l + 'px" data-href="' + e.content.content.url + '"><img src="/images/wallet/voice.png">&nbsp;' + e.content.content.duration + "&quot;</span>"
									}
									o = "语音消息";
									break;
								case 3:
									i = '<a href="http://m.amap.com/?q=' + e.content.content.lon + "," + e.content.content.lat + '" target="_blank"><div class="ditu_container"><div class="tip">' + e.content.content.location + '</div><div id="ditu_container_' + e.content.id + '"></div></div></a>', o = "位置消息";
									break;
								case 7:
									i = e.content.content.text;
									break;
								default:
									return
							}
							if(!(e.content.id && $(".chat-box").find(".message#" + e.content.id).length > 0)) {
								if("private" != e.status) {
									var c = $(['<li class="message message-' + n + '" id="' + e.content.id + '">', '<div class="userpic" jid="' + e.content.user.jid + '">', '<img src="' + replaceHttps(e.content.user.img_url) + '" width="28px" height="28px">', "</div>", '<div class="message-content">', '<div class="message-info"><a href="/user/' + e.content.user.jid + '/submitted/1" target="_blank">' + e.content.user.nick + '</a><span style="margin-left:7px;">' + timeFormat(e.content.createTime).str + "</span></div>", '<div class="message-text">' + node.chatbox.expression.exchange(i).replace("\r\n", "<br>") + '<div class="status"></div></div>', "</div>", "</li>"].join(""));
									if($("#mCSB_1_container").height() > Math.abs(parseInt($("#mCSB_1_container").css("top"), 10)) + $(".chat-public-content").height() && !e.isme && "show" == node.chatbox.message.messageNoticeSeting.state) {
										if(0 == $(".chat-public-content .chat-message-notice").length) {
											var d = $(['<div class="chat-message-notice">', '<span class="headimg" style="background-image:url(' + replaceHttps(e.content.user.img_url) + ')"></span>', '<span class="nickname">' + e.content.user.nick + ":</span>", '<span class="content">' + e.content.content.text.replace("\r\n", "<br>") + "</span>", '<div class="btn-close" tar="notice"></div>', "</div>"].join(""));
											$(".chat-public-content").append(d)
										} else {
											var d = $(['<span class="headimg" style="background-image:url(' + replaceHttps(e.content.user.img_url) + ')"></span>', '<span class="nickname">' + e.content.user.nick + ":</span>", '<span class="content">' + e.content.content.text.replace("\r\n", "<br>") + "</span>", '<div class="btn-close" tar="notice"></div>'].join(""));
											$(".chat-public-content .chat-message-notice").html(d)
										}
										$(".chat-message-notice .content").css("width", 240 - Math.ceil($(".chat-public-content .chat-message-notice .nickname").width()) + "px"), $(".chat-public-content .chat-message-notice").unbind("click").bind("click", function() {
											$(this).remove(), $(".chat-public-content").mCustomScrollbar("scrollTo", "last")
										}), $(".chat-public-content .chat-message-notice .btn-close").unbind("click").bind("click", function() {
											$(".chat-public-content .chat-message-notice").remove(), node.chatbox.message.messageNoticeSeting.state = "hide"
										})
									} else e.isme || $("#mCSB_1_container").height() == Math.abs(parseInt($("#mCSB_1_container").css("top"), 10)) + $(".chat-public-content").height() ? $(".chat-public-content").mCustomScrollbar("scrollTo", "last") : "history" == e.form && setTimeout(function() {
										$(".chat-public-content").mCustomScrollbar("scrollTo", "last")
									}, 50)
								} else {
									var u = $('.page-chat[style="left: 0px;"]'),
										p = u.find(".mCSB_container") || u.select(".mCSB_container");
									if(p.height() > Math.abs(parseInt(p.css("top"), 10)) + $(".page-main-content").height() + 1 && !e.isme && "show" == node.chatbox.message.messageNoticeSeting.state && 7 != e.content.type) {
										if($('.page-chat[tar="' + e.content.user.jid + '"]') && 0 == parseInt($('.page-chat[tar="' + e.content.user.jid + '"]').css("left"), 10)) {
											var h;
											if(h = 0 == e.content.type ? e.content.content.text.replace("\r\n", "<br>") : o, 0 == u.find(".page-main-content .chat-message-notice").length) {
												var d = $(['<div class="chat-message-notice">', '<span class="headimg" style="background-image:url(' + replaceHttps(e.content.user.img_url) + ')"></span>', '<span class="nickname">' + e.content.user.nick + ":</span>", '<span class="content">' + h + "</span>", '<div class="btn-close" tar="notice"></div>', "</div>"].join(""));
												u.find(".page-main-content").append(d)
											} else {
												var d = $(['<span class="headimg" style="background-image:url(' + replaceHttps(e.content.user.img_url) + ')"></span>', '<span class="nickname">' + e.content.user.nick + ":</span>", '<span class="content">' + h + "</span>", '<div class="btn-close" tar="notice"></div>'].join(""));
												u.find(".page-main-content .chat-message-notice").html(d)
											}
											$(".page-main-content .content").css("width", 240 - Math.ceil($(".page-main-content .chat-message-notice .nickname").width()) + "px"), $(".page-main-content .chat-message-notice").unbind("click").bind("click", function() {
												$(this).remove(), u.find(".page-main-content").mCustomScrollbar("scrollTo", "last")
											}), $(".page-main-content .chat-message-notice .btn-close").unbind("click").bind("click", function() {
												$(".page-main-content .chat-message-notice").remove(), node.chatbox.message.messageNoticeSeting.state = "hide"
											})
										}
									} else(e.isme || p.height() == Math.abs(parseInt(p.css("top"), 10)) + $(".page-main-content").height() || 7 == e.content.type) && setTimeout(function() {
										u.find(".page-main-content").mCustomScrollbar("scrollTo", "last")
									}, 50);
									if(e.isinit || localStorage.getItem("chat-message") && localStorage.getItem("chat-message").indexOf(e.content.id) != -1 || node.chatbox.chatlist.add($.extend({
											isnew: e.isnew,
											isme: e.isme
										}, e.content)), 7 != e.content.type) {
										if($('.page-chat[tar="' + e.content.user.jid + '"]') && 0 == parseInt($('.page-chat[tar="' + e.content.user.jid + '"]').css("left"), 10)) {
											console.log("notice"), $.ajax({
												url: "/chat/setUnreadMessages",
												dataType: "json",
												data: {
													jid: e.content.user.jid
												},
												success: function(n) {
													"9999" == n.result.code ? node.chatbox.chatlist.resetNum(e.jid) : t.showTopTips(t.TIPS_TYPE.error, n.result.message)
												}
											});
											var f = localStorage.getItem("chat-message") + ";" + e.content.id;
											localStorage.setItem("chat-message", f)
										} else if(!localStorage.getItem("chat-message") || localStorage.getItem("chat-message").indexOf(e.content.id) == -1) {
											var f = localStorage.getItem("chat-message") + ";" + e.content.id;
											localStorage.setItem("chat-message", f), node.notice.setnum(parseInt(localStorage.getItem("chat-notice-num")) + 1), node.notice.open({
												sum: parseInt(localStorage.getItem("chat-notice-num"))
											})
										}
										var m = e.tar.find(".message-time").length;
										if(0 == m || e.content.createTime - e.tar.find(".message-time").last().attr("time") >= 3e8) var c = $(['<li class="message message-' + n + '" id="' + e.content.id + '">', '<div class="message-time J_message_time" time="' + e.content.createTime + '">' + timeFormat(e.content.createTime).str + "</div>", '<div class="message-content">', '<div class="message-text">' + node.chatbox.expression.exchange(i) + '<div class="status"></div></div>', "</div>", "</li>"].join(""));
										else var c = $(['<li class="message message-' + n + '" id="' + e.content.id + '">', '<div class="message-content">', '<div class="message-text">' + node.chatbox.expression.exchange(i) + '<div class="status"></div></div>', "</div>", "</li>"].join(""))
									} else c = $(['<li class="message message-system" id="' + e.content.id + '">', '<div class="message-text">' + i + "</div>", "</li>"].join("")), $.ajax({
										url: "/chat/setUnreadMessages",
										dataType: "json",
										data: {
											jid: e.content.user.jid
										},
										success: function(n) {
											"9999" == n.result.code ? node.chatbox.chatlist.resetNum(e.jid) : t.showTopTips(t.TIPS_TYPE.error, n.result.message)
										}
									})
								}
								if(e.tar.find("ul").append(c), 3 == e.content.type) {
									var g = [e.content.content.lon, e.content.content.lat],
										v = new AMap.Map("ditu_container_" + e.content.id, {
											resizeEnable: !0,
											zoom: 15,
											zoomEnable: !1,
											center: g
										}),
										b = new AMap.Marker({
											position: g
										});
									b.setMap(v)
								} else 2 != e.content.type || isIEBrowser() || playAudio.init();
								e.isme && (c.find(".status").addClass("status-waiting"), !isIEBrowser() && function() {
									e.file = e.file || new FormData, e.file.append("content", JSON.stringify({
										content: {
											text: e.content.content.text
										},
										type: e.content.type,
										user: {
											jid: e.content.user.jid || null
										}
									}))
								}(), e.status ? (!isIEBrowser() && $.ajax({
									url: "/privateChat/sendMessage.do",
									type: "POST",
									xhr: function() {
										var e = $.ajaxSettings.xhr();
										return e.upload && e.upload.addEventListener("progress", function(e) {
											c.find(".pic-mask").animate({
												height: 100 - e.loaded / e.total * 100 + "%"
											}, 300)
										}, !1), e.open("POST", "/privateChat/sendMessage.do"), e
									},
									timeout: 3e4,
									dataType: "JSON",
									success: function(n) {
										"9999" == n.result.code ? (c.find(".status").removeClass("status-waiting"), c.find(".pic-mask").remove(), node.chatbox.chatlist.add($.extend({
											isme: !0,
											isnew: !0
										}, e.content))) : (c.find(".pic-mask").remove(), c.find(".status").removeClass("status-waiting").addClass("status-error"), t.showTopTips(t.TIPS_TYPE.error, n.result.message))
									},
									error: function(e, n, i) {
										e.abort(), "timeout" == n ? t.showTopTips(t.TIPS_TYPE.error, "发送超时！") : t.showTopTips(t.TIPS_TYPE.error, "发生错误，请重试！")
									},
									data: e.file,
									cache: !1,
									contentType: !1,
									processData: !1
								}), isIEBrowser() && $.ajax({
									url: "/privateChat/sendMessage.do",
									type: "post",
									data: {
										content: JSON.stringify({
											content: {
												text: e.content.content.text
											},
											type: e.content.type,
											user: {
												jid: e.content.user.jid
											}
										})
									},
									dataType: "json",
									success: function(n) {
										"9999" == n.result.code ? (c.find(".status").removeClass("status-waiting"), node.chatbox.chatlist.add($.extend({
											isme: !0,
											isnew: !0
										}, e.content))) : (c.find(".status").removeClass("status-waiting").addClass("status-error"), t.showTopTips(t.TIPS_TYPE.error, n.result.message))
									}
								})) : $.ajax({
									url: "/groupChat/sendMessage.do",
									type: "post",
									data: {
										content: JSON.stringify({
											content: {
												text: e.content.content.text
											},
											type: 0,
											user: {}
										})
									},
									dataType: "json",
									success: function(e) {
										if("9999" == e.code) c.find(".status").removeClass("status-waiting");
										else {
											if("21104" == e.result.code) return c.find(".status").removeClass("status-waiting").addClass("status-error"), void t.showTopTips(t.TIPS_TYPE.error, e.result.message);
											c.find(".status").removeClass("status-waiting").addClass(".status-error"), t.showTopTips(t.TIPS_TYPE.error, e.result.message)
										}
									}
								}))
							}
						}
					}
				},
				expression: {
					e: ["微笑", "撇嘴", "色", "吓", "发呆", "得意", "流泪", "娇羞", "闭嘴", "生病", "睡", "委屈", "傲娇", "发怒", "大笑", "难过", "晕", "已老", "吻我", "愉快", "吐", "懒得理你", "邪恶", "雾霾", "妩媚", "汗", "吃惊", "高冷", "龅牙笑", "舔舔", "呆滞", "鬼魅", "猥琐", "享受", "徒丁来了", "大胸妹", "飞机场我怕谁", "点赞", "爱", "OK", "shit", "肛花", "秘籍"],
					init: function(e) {
						e.n.find(".exp-box li").unbind("click").bind("click", function() {
							var t = e.tar.val();
							e.tar.val(t + "[" + $(this).attr("title") + "]"), e.tar.focus(), node.chatbox.expression.close()
						}), $("body").unbind("click").bind("click", function(e) {
							0 == $(e.target).parents(".funcbar").length && node.chatbox.expression.close()
						})
					},
					open: function(e) {
						for(var t = "", n = node.chatbox.expression.e, i = 0; i < n.length; i++) t += ['<li title="' + n[i] + '"><div class="exp" style="background-position:' + node.chatbox.expression.getExp(i).str + ';"></div></li>'].join("");
						e.n.append(['<div class="exp-box"><ul>' + t + "</ul></div>"].join("")), node.chatbox.expression.init(e)
					},
					close: function() {
						$(".chat-box").find(".exp-box").remove()
					},
					exchange: function(e) {
						return "string" == typeof e ? e.replace(/\[(\S+?)\]/g, function(e, t) {
							return $.inArray(t, node.chatbox.expression.e) >= 0 ? '<div class="exp" title="' + t + '" style="background-position:' + node.chatbox.expression.getExp($.inArray(t, node.chatbox.expression.e)).str + ';" ></div>' : e
						}) : e
					},
					getExp: function(e) {
						var t, n;
						return t = -e % 8 * 36, n = 36 * -Math.floor(e / 8), {
							x: t,
							y: n,
							str: t + "px " + n + "px "
						}
					}
				},
				infopage: {
					init: function(e) {
						$(".chat-box").find('.page-info[tar="' + e.jid + '"] .btn-info').click(function() {
							window.open("/user/" + e.jid + "/submitted/1")
						}), $(".chat-box").find('.page-info[tar="' + e.jid + '"] .btn-chat').click(function() {
							return 1 == $(".user-completereg").val() ? void $("#loginUserNc").click() : (node.chatbox.infopage.close({
								tar: e.jid
							}), void node.chatbox.chatpage.open({
								jid: e.jid
							}))
						}), $(".chat-box").find('.page-info[tar="' + e.jid + '"] .chat-coin').click(function(t) {
							return t.stopPropagation(), t.preventDefault(), 1 == $(".user-completereg").val() ? void $("#loginUserNc").click() : void node.chatbox.paycoin.open({
								jid: $(this).parents(".page-info").attr("tar"),
								callback: function() {
									$(".chat-box").find('.page-info[tar="' + e.jid + '"] .btn-chat').click()
								}
							})
						})
					},
					open: function(e) {
						$.ajax({
							url: "/getChatCondition",
							dataType: "json",
							data: {
								jid: e.jid
							},
							success: function(t) {
								if("20006" == t.result.code && window.open("/user/" + e.jid + "/submitted/1"), "9999" == t.result.code) {
									if(0 == $(".chat-box").find('.page-info[tar="' + e.jid + '"]').length) {
										var n = "";
										t.result.data.ct > 0 && (n = '<div class="chat-coin"><div class="num">' + t.result.data.ct + '</div><div style="font-size:14px;">CT币</div></div>'), $(".chat-box").append(['<div class="page page-info" tar="' + e.jid + '" style="display:none;">', '<div class="btn btn-close" jid="' + e.jid + '"></div>', '<div class="page-info-userpic"><img src="' + replaceHttps(t.result.data.imgUrl) + '" width="100px" height="100px" > </div>', '<div class="page-info-content">', '<div class="page-info-nick">' + t.result.data.nick + "</div>", '<div class="page-info-vice">' + (t.result.data.sex ? "男" : "女") + "，" + t.result.data.cityName + "</div>", '<div class="page-info-data">关注' + t.result.data.followCount + " | 粉丝" + t.result.data.fansCount + "</div>", '<div class="page-info-sign" title="' + t.result.data.sign + '">' + t.result.data.sign + "</div>", '<div class="page-info-enter">', '<div class="btn btn-round btn-chat">' + n + "聊天</div>", '<div class="btn btn-round btn-info">个人中心</div>', "</div>", "</div>", "</div>"].join(""))
									}
									$(".chat-box").find('.page-info[tar="' + e.jid + '"]').fadeIn(300), node.chatbox.infopage.init(e)
								}
							}
						})
					},
					close: function(e) {
						$(".chat-box").find('.page-info[tar="' + e.tar + '"]').fadeOut(300, function() {
							$(".chat-box").find('.page-info[tar="' + e.tar + '"]').remove()
						})
					}
				},
				chatpage: {
					init: function(e) {
						for(var t = node.chatbox.chatlist.list.length - 1; t >= 0; t--)
							if(node.chatbox.chatlist.list[t].user.jid == e.jid) {
								var n = node.chatbox.chatlist.list[t].content,
									i = {};
								switch(node.chatbox.chatlist.list[t].type) {
									case 0:
										i = {
											text: n.text
										};
										break;
									case 1:
										i = {
											url: n.url,
											height: n.height,
											width: n.width,
											filePath: n.filePath
										};
										break;
									case 2:
										i = {
											url: n.url,
											duration: Math.floor(n.duration / 1e3),
											filePath: n.filePath
										};
										break;
									case 3:
										i = {
											location: n.location,
											lat: n.lat,
											lon: n.lon
										};
										break;
									case 7:
										i = {
											text: n.text
										}
								}
								node.chatbox.message.add({
									tar: $('.page-chat[tar="' + e.jid + '"]').find(".page-main-content"),
									status: "private",
									content: {
										content: i,
										type: node.chatbox.chatlist.list[t].type,
										createTime: node.chatbox.chatlist.list[t].createTime,
										id: node.chatbox.chatlist.list[t].id,
										user: {
											img_url: replaceHttps(node.chatbox.chatlist.list[t].user.img_url),
											nick: node.chatbox.chatlist.list[t].user.nick,
											jid: e.jid
										}
									},
									isinit: !0
								})
							}
					},
					open: function(e) {
						0 == $(".chat-box").find('.page-chat[tar="' + e.jid + '"]').length ? $.ajax({
							url: "/getChatCondition",
							dataType: "json",
							async: !1,
							data: {
								jid: e.jid
							},
							success: function(n) {
								if("9999" == n.result.code)
									if(0 == n.result.data.ct) {
										var i;
										i = isIEBrowser() ? "" : '<div class="btn btn-pic" type="private" tar="page-main-content[jid=' + e.jid + ']" type="private" nick="' + n.result.data.nick + '" jid="' + e.jid + '" img="' + replaceHttps(n.result.data.imgUrl) + '"></div>', $(".chat-box").append(['<div class="page page-chat ' + (e.hide ? "" : "active") + '" tar="' + e.jid + '">', '<div class="page-head">', '<div class="btn btn-back"></div>', '<div class="page-head-content" tar="' + e.jid + '">', '<div class="page-head-userpic"><img src="' + replaceHttps(n.result.data.imgUrl) + '" width="30px" height="30px" ></div>', '<div><div class="page-head-nick"><a href="/user/' + n.result.data.jid + '/submitted/1" target="_blank">' + n.result.data.nick + '</a></div><div class="page-head-sign" title="' + n.result.data.sign + '">' + n.result.data.sign + "</div></div>", "</div>", "</div>", '<div class="page-main-content" jid="' + e.jid + '"><ul></ul></div>', '<div class="chat-sender">', '<div class="funcbar"><div class="btn btn-face"></div>' + i + "</div>", '<div class="inputer">', '<textarea name="text"></textarea>', '<div style="text-align:right;"><div class="btn btn-send" tar="page-main-content[jid=' + e.jid + ']" type="private" nick="' + n.result.data.nick + '" jid="' + e.jid + '" img="' + replaceHttps(n.result.data.imgUrl) + '">发送</div></div>', "</div>", "</div>", "</div>"].join("")), $('.page-chat[tar="' + e.jid + '"] .page-main-content').mCustomScrollbar({
											theme: "minimal-dark",
											callbacks: {
												onScroll: function() {
													var e = $('.page-chat[style="left: 0px;"]'),
														t = e.find(".mCSB_container") || e.select(".mCSB_container");
													t.height() == Math.abs(parseInt(t.css("top"), 10)) + $(".page-main-content").height() && $(".page-main-content .chat-message-notice").remove()
												}
											}
										}), e.hide || (isIEBrowser() ? $(".chat-box").find('.page-chat[tar="' + e.jid + '"]').css({
											left: 0
										}, 300) : $(".chat-box").find('.page-chat[tar="' + e.jid + '"]').animate({
											left: 0
										}, 300), $(".chat-box").find('.page-chat[tar="' + e.jid + '"]').find("textarea").focus(), $.ajax({
											url: "/chat/setUnreadMessages",
											dataType: "json",
											data: {
												jid: e.jid
											},
											success: function(n) {
												"9999" == n.result.code ? node.chatbox.chatlist.resetNum(e.jid) : t.showTopTips(t.TIPS_TYPE.error, n.result.message)
											}
										})), e.callback && e.callback(), node.chatbox.chatpage.init(e)
									} else console.log("对方设置了聊天门槛");
								else t.showTopTips(t.TIPS_TYPE.error, n.result.message)
							}
						}) : (e.hide || (isIEBrowser() ? $(".chat-box").find('.page-chat[tar="' + e.jid + '"]').css({
							left: 0
						}, 300) : $(".chat-box").find('.page-chat[tar="' + e.jid + '"]').animate({
							left: 0
						}, 300), $(".chat-box").find('.page-chat[tar="' + e.jid + '"]').toggleClass("active"), $(".chat-box").find('.page-chat[tar="' + e.jid + '"]').find("textarea").focus(), $.ajax({
							url: "/chat/setUnreadMessages",
							dataType: "json",
							data: {
								jid: e.jid
							},
							success: function(n) {
								"9999" == n.result.code ? node.chatbox.chatlist.resetNum(e.jid) : t.showTopTips(t.TIPS_TYPE.error, n.result.message)
							}
						}), node.chatbox.chatpage.init(e)), e.callback && e.callback())
					},
					close: function(e) {
						isIEBrowser() ? $(".chat-box").find('.page-chat[tar="' + e.tar + '"]').css({
							left: "300px"
						}, 300) : $(".chat-box").find('.page-chat[tar="' + e.tar + '"]').animate({
							left: "300px"
						}, 300), $(".chat-box").find('.page-chat[tar="' + e.tar + '"]').toggleClass("active"), $.ajax({
							url: "/chat/setUnreadMessages",
							dataType: "json",
							data: {
								jid: e.tar
							},
							success: function(n) {
								"9999" == n.result.code ? node.chatbox.chatlist.resetNum(e.tar) : t.showTopTips(t.TIPS_TYPE.error, n.result.message)
							}
						})
					}
				},
				chatlist: {
					list: [],
					init: function(e) {
						node.chatbox.chatlist.list = e;
						for(var t = e.length - 1; t >= 0; t--) node.chatbox.chatlist.add({
							content: {
								text: e[t].content.text
							},
							type: e[t].type,
							createTime: e[t].createTime,
							id: e[t].id,
							user: {
								img_url: replaceHttps(e[t].user.img_url),
								nick: e[t].user.nick,
								jid: e[t].user.jid
							},
							isnew: !0
						})
					},
					add: function(e) {
						var t = $(".chat-box").find('.chat-private-content li[jid="' + e.user.jid + '"]');
						if(0 == $(".chat-box").find(".chat-private-content ul li").length && $(".chat-box").find(".chat-private-content ul").empty(), 0 == t.length) {
							var n;
							switch(e.type) {
								case 0:
									n = e.content.text;
									break;
								case 1:
									n = "[图片]";
									break;
								case 2:
									n = "[语音]";
									break;
								case 3:
									n = "[位置]";
									break;
								case 7:
									n = !1
							}
							if(!n) return;
							var i;
							i = $.inArray(timeFormat(e.createTime).h, ["今天", "昨天", "周日", "周一", "周二", "周三", "周四", "周五", "周六"]) >= 0 ? timeFormat(e.createTime).h : new Date(e.createTime / 1e3).Format("yyyy-MM-dd");
							var o = $(['<li class="message" jid="' + e.user.jid + '">', '<div class="userpic"><img src="' + replaceHttps(e.user.img_url) + '" width="38px" height="38px"></div>', '<div class="message-content">', '<div class="message-info">' + e.user.nick + '<span class="J_message_time" style="float:right;color:#bebebe;font-size:10px;" time="' + e.createTime + '">' + i + "</span></div>", '<div class="message-text"><span>' + n + '</span><span class="message-num">1</span></div>', "</div>", "</li>"].join(""));
							e.isnew ? $(".chat-box").find(".chat-private-content ul").prepend(o) : $(".chat-box").find(".chat-private-content ul").append(o), e.isme && node.chatbox.chatlist.resetNum(e.user.jid)
						} else {
							if(!e.isme && e.isnew) {
								if(localStorage.getItem("isMessageNum") && localStorage.getItem("isMessageNum").indexOf(e.id) != -1) return;
								var a = localStorage.getItem("isMessageNum") + "-" + e.id;
								if(localStorage.setItem("isMessageNum", a), e.id && $(".chat-box").find(".message#" + e.id).length > 0) return;
								var s = parseInt(t.find(".message-num").html());
								t.find(".message-num").html(1 + s), 0 == s && t.find(".message-num").show(), s > 99 && t.find(".message-num").html("…")
							}
							if(e.isnew) {
								var n;
								switch(e.type) {
									case 0:
										n = e.content.text;
										break;
									case 1:
										n = "[图片]";
										break;
									case 2:
										n = "[语音]";
										break;
									case 3:
										n = "[位置]";
										break;
									case 7:
										n = !1
								}
								if(!n) return;
								t.find(".message-text span").eq(0).html(n);
								var i;
								i = $.inArray(timeFormat(e.createTime).h, ["今天", "昨天", "周日", "周一", "周二", "周三", "周四", "周五", "周六"]) >= 0 ? timeFormat(e.createTime).h : new Date(e.createTime / 1e3).Format("yyyy-MM-dd"), t.find(".message-info span").html(i).attr("time", e.createTime), t.prependTo($(".chat-box").find(".chat-private-content ul"))
							}
						}
					},
					resetNum: function(e) {
						e ? $(".chat-box").find('.chat-private-content li[jid="' + e + '"]').find(".message-num").html(0).hide() : $(".chat-box").find(".chat-private-content li").find(".message-num").html(0).hide()
					}
				},
				allclear: {
					init: function() {
						$(".purchase_bg").find(".btn-cancel").click(function() {
							node.chatbox.allclear.close()
						}), $(".purchase_bg").find(".btn-submit").click(function() {
							localStorage.setItem("chat-notice-num", 0), localStorage.removeItem("chat-notice-close"), $.ajax({
								url: "/chat/setAllUnreadMessages",
								dataType: "json",
								success: function(e) {
									"9999" == e.result.code ? (node.chatbox.allclear.close(), node.chatbox.chatlist.resetNum(), node.notice.close(), t.showTopTips(t.TIPS_TYPE.success, "操作成功!")) : t.showTopTips(t.TIPS_TYPE.error, e.result.message)
								}
							})
						})
					},
					open: function() {
						$(".main-content").prepend(['<div class="purchase_bg">', '<div style="position:fixed;left:50%;top:200px;width:450px;height:200px;margin-left:-225px;background:white;border-radius:8px;text-align:center;">', '<div class="btn btn-close" tar="purchase"></div>', '<div style="height:54px;padding-top:60px;color:#858d9e;font-size:18px;background:url(/images/wallet/question_mark.png) no-repeat 65px 53px;padding-left:40px;">你确定将所有的消息置为已读吗？</div>', '<div style="height:40px;padding:23px 0;background:#E9F3FB;border-bottom-left-radius:8px;border-bottom-right-radius:8px;">', '<div class="btn btn-block btn-submit" style="width:108px;margin-right:14px;color:white;background:#09639A;">确定</div><div class="btn btn-block btn-cancel" style="width:108px;color:#858d9e;background:white;">取消</div>', "</div>", "</div>", "</div>"].join("")), node.chatbox.allclear.init()
					},
					close: function() {
						$(".purchase_bg").remove()
					}
				},
				setcoin: {
					init: function() {
						$(".purchase_bg").find(".btn-cancel").click(function() {
							node.chatbox.setcoin.close()
						}), $(".purchase_bg").find(".btn-submit").click(function() {
							$.ajax({
								url: "/setChatCondition",
								dataType: "json",
								data: {
									ct: $(".purchase_bg").find(".ct").val() || 0
								},
								success: function(e) {
									"9999" == e.result.code ? (node.chatbox.setcoin.close(), t.showTopTips(t.TIPS_TYPE.success, "设置聊天门槛成功!")) : t.showTopTips(t.TIPS_TYPE.error, e.result.message)
								}
							})
						}), $(".purchase_bg").find(".ct").unbind("keyup").bind("keyup", function() {
							$(this).val($(this).val().replace(/[^0-9]/g, "")), parseInt($(this).val()) < 0 ? $(this).val(0) : parseInt($(this).val()) > 999 && $(this).val(999)
						})
					},
					open: function() {
						$.ajax({
							url: "/getChatCondition",
							dataType: "json",
							data: {
								jid: node.chatbox.user.jid
							},
							success: function(e) {
								"9999" == e.result.code ? ($(".main-content").prepend(['<div class="purchase_bg">', '<div style="position:fixed;left:50%;top:200px;width:500px;margin-left:-250px;background:white;border-radius:8px;text-align:center;">', '<div class="btn btn-close" tar="purchase"></div>', '<div style="padding-top:60px;text-align: center;">', '<div style="text-align:left;padding:0 50px;">', '<span style="color:#858d9e;font-size:20px;">设置聊天门槛（CT币）</span>', '<span><input class="ct" value="' + parseInt(e.result.data.ct) + '" ></span>', "</div>", '<div style="color:#adb6c9;font-size:18px;padding:10px 50px 20px;line-height:30px;text-align:left;">对方需支付相应CT币才能和你聊天</div>', "</div>", '<div style="height:40px;padding:23px 0;background:#E9F3FB;border-bottom-left-radius:8px;border-bottom-right-radius:8px;">', '<div class="btn btn-block btn-submit" style="width:400px;color:white;background:#09639A;">保存</div>', "</div>", "</div>", "</div>"].join("")), node.chatbox.setcoin.init()) : t.showTopTips(t.TIPS_TYPE.error, e.result.message)
							}
						})
					},
					close: function() {
						$(".purchase_bg").remove()
					}
				},
				paycoin: {
					init: function(e) {
						$(".purchase_bg").find(".btn-submit").click(function() {
							var n = $(this);
							n.hasClass("disable") || (n.html("支付中...").toggleClass("disable"), $.ajax({
								url: "/pay/purchaseChat",
								dataType: "json",
								data: {
									jid: e.jid,
									ct: e.ct
								},
								success: function(i) {
									"9999" == i.result.code ? (node.chatbox.paycoin.close(), node.paystatus.open({
										type: "chat-success",
										onclose: e.callback,
										nick: e.nick
									})) : "25025" == i.result.code ? (node.chatbox.paycoin.close(), node.paystatus.open({
										type: "chat-notenough",
										onclose: function() {
											node.purchase.open({
												n: $(".main-content"),
												ct: e.ct - i.result.data.balance,
												onclose: function() {
													e.callback()
												}
											})
										},
										nick: e.nick,
										balance: i.result.data.balance
									})) : (t.showTopTips(t.TIPS_TYPE.error, i.result.message), n.html("立即支付").toggleClass("disable"))
								}
							}))
						})
					},
					open: function(e) {
						$.ajax({
							url: "/getChatCondition",
							dataType: "json",
							data: {
								jid: e.jid
							},
							success: function(t) {
								$(".main-content").prepend(['<div class="purchase_bg">', '<div style="position:fixed;left:50%;top:200px;width:582px;margin-left:-291px;background:white;border-radius:8px;text-align:center;">', '<div class="btn btn-close" tar="purchase"></div>', '<div style="text-align: center;color:#adb6c9;font-size:18px;padding:60px 80px 20px;line-height:30px;">', '<div>对方设置了聊天门槛,你需支付<span style="color:red;font-size:22px;">' + t.result.data.ct + "</span>CT币</div>", "<div>才能与" + (t.result.data.sex ? "他" : "她") + "聊天,只需支付一次,以后将无限制聊天</div>", "</div>", '<div style="height:40px;padding:23px 0;background:#E9F3FB;border-bottom-left-radius:8px;border-bottom-right-radius:8px;">', '<div class="btn btn-block btn-submit" style="width:418px;margin-right:14px;color:white;background:#09639A;">立即支付</div>', "</div>", "</div>", "</div>"].join("")), node.chatbox.paycoin.init($.extend({
									ct: t.result.data.ct,
									nick: t.result.data.nick
								}, e))
							}
						})
					},
					close: function() {
						$(".purchase_bg").remove()
					}
				}
			},
			notice: {
				init: function(e) {
					$(".chat-notice-area").find(".notice span").unbind("click").click(function() {
						$(window).scrollTop(0), localStorage.setItem("chat-notice-close", "closed"), $(".chat-box").find(".tab-private").click(), $(".page-chat").each(function() {
							0 == parseInt($(this).css("left"), 10) && (isIEBrowser() ? $(this).css({
								left: "300px"
							}, 300) : $(this).animate({
								left: "300px"
							}, 300))
						}), node.notice.close()
					})
				},
				open: function(e) {
					if(e = e || {}, 0 == $(".chat-notice-area").find(".notice").length) {
						if(e.sum < 0) return;
						console.log("+++++++++++++++++++++++++++");
						var t = "";
						t = 1 == $(".chat-area").length ? '<span>你有<span class="chat-notice-nums">' + e.sum + "</span>条新消息</span>" : '<a href="/#notice=val">你有<span class="chat-notice-nums">' + e.sum + "</span>条新消息</a>", $(".chat-notice-area").prepend(['<div class="notice fix">', t, '<div class="btn-close" tar="notice"></div>', "</div>"].join("")), 1 == $(".chat-area").length && node.notice.init(e)
					} else e.sum > 0 && $(".chat-notice-area").find(".notice").find(".chat-notice-nums").html(e.sum), console.log("//////////////////////////////");
					localStorage.removeItem("chat-notice-close")
				},
				noticenum: function() {
					localStorage.getItem("jid") != $("#hidjid").val() && (localStorage.setItem("chat-notice-num", 0), localStorage.removeItem("chat-notice-close"), localStorage.removeItem("chat-message")), localStorage.getItem("chat-notice-close") || localStorage.getItem("chat-notice-num") > 0 && node.notice.open({
						sum: parseInt(localStorage.getItem("chat-notice-num"))
					})
				},
				setnum: function(e) {
					parseInt(e) >= 0 ? localStorage.setItem("chat-notice-num", e) : localStorage.setItem("chat-notice-num", 0)
				},
				close: function() {
					$(".chat-notice-area .notice").remove()
				}
			}
		}, $("#buy_CTB").click(function() {
			node.purchase.open({
				n: $(".main-content"),
				onclose: function() {
					window.location.reload()
				}
			})
		}), $(".main-content,.chat-notice-area").on("click", ".btn-close", function(e) {
			e.stopPropagation(), localStorage.setItem("chat-notice-close", "closed"), $(this).attr("tar") && node[$(this).attr("tar")].close()
		}), ($(".chat-area").length > 0 || $(".chat-notice-area").length > 0) && (node.chatbox.preload({
			n: $(".chat-area").find(".chat"),
			islogin: $(".chat-area").find(".islogin").val()
		}), node.notice.noticenum()), $(".profile-B_2").find(".btn-chat").click(function() {
			var e = $(this);
			return 1 == $(".user-completereg").val() ? void $("#loginUserNc").click() : void($(this).attr("ct") ? node.chatbox.paycoin.open({
				jid: $(this).attr("jid"),
				callback: function() {
					window.location = "/#chattarget=" + e.attr("jid")
				}
			}) : window.location = "/#chattarget=" + $(this).attr("jid"))
		}), $.each($(".consumer_fine_ul").find(".order-time"), function() {
			var e = $(this),
				t = timeFormat(e.attr("time"));
			e.find("div").first().html(t.h), e.find("div").last().html(t.f)
		}), $(".inputer").click(function() {
			$(this).children("textarea").focus()
		})
	}), ! function(e, t) {
		"function" == typeof define && define.amd ? define(t) : "object" == typeof exports ? module.exports = t() : e.PhotoSwipe = t()
	}(this, function() {
		"use strict";
		var e = function(e, t, n, i) {
			var o = {
				features: null,
				bind: function(e, t, n, i) {
					var o = (i ? "remove" : "add") + "EventListener";
					t = t.split(" ");
					for(var a = 0; a < t.length; a++) t[a] && e[o](t[a], n, !1)
				},
				isArray: function(e) {
					return e instanceof Array
				},
				createEl: function(e, t) {
					var n = document.createElement(t || "div");
					return e && (n.className = e), n
				},
				getScrollY: function() {
					var e = window.pageYOffset;
					return void 0 !== e ? e : document.documentElement.scrollTop
				},
				unbind: function(e, t, n) {
					o.bind(e, t, n, !0)
				},
				removeClass: function(e, t) {
					var n = new RegExp("(\\s|^)" + t + "(\\s|$)");
					e.className = e.className.replace(n, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "")
				},
				addClass: function(e, t) {
					o.hasClass(e, t) || (e.className += (e.className ? " " : "") + t)
				},
				hasClass: function(e, t) {
					return e.className && new RegExp("(^|\\s)" + t + "(\\s|$)").test(e.className)
				},
				getChildByClass: function(e, t) {
					for(var n = e.firstChild; n;) {
						if(o.hasClass(n, t)) return n;
						n = n.nextSibling
					}
				},
				arraySearch: function(e, t, n) {
					for(var i = e.length; i--;)
						if(e[i][n] === t) return i;
					return -1
				},
				extend: function(e, t, n) {
					for(var i in t)
						if(t.hasOwnProperty(i)) {
							if(n && e.hasOwnProperty(i)) continue;
							e[i] = t[i]
						}
				},
				easing: {
					sine: {
						out: function(e) {
							return Math.sin(e * (Math.PI / 2))
						},
						inOut: function(e) {
							return -(Math.cos(Math.PI * e) - 1) / 2
						}
					},
					cubic: {
						out: function(e) {
							return --e * e * e + 1
						}
					}
				},
				detectFeatures: function() {
					if(o.features) return o.features;
					var e = o.createEl(),
						t = e.style,
						n = "",
						i = {};
					if(i.oldIE = document.all && !document.addEventListener, i.touch = "ontouchstart" in window, window.requestAnimationFrame && (i.raf = window.requestAnimationFrame, i.caf = window.cancelAnimationFrame), i.pointerEvent = navigator.pointerEnabled || navigator.msPointerEnabled, !i.pointerEvent) {
						var a = navigator.userAgent;
						if(/iP(hone|od)/.test(navigator.platform)) {
							var s = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
							s && s.length > 0 && (s = parseInt(s[1], 10), s >= 1 && 8 > s && (i.isOldIOSPhone = !0))
						}
						var r = a.match(/Android\s([0-9\.]*)/),
							l = r ? r[1] : 0;
						l = parseFloat(l), l >= 1 && (4.4 > l && (i.isOldAndroid = !0), i.androidVersion = l), i.isMobileOpera = /opera mini|opera mobi/i.test(a)
					}
					for(var c, d, u = ["transform", "perspective", "animationName"], p = ["", "webkit", "Moz", "ms", "O"], h = 0; 4 > h; h++) {
						n = p[h];
						for(var f = 0; 3 > f; f++) c = u[f], d = n + (n ? c.charAt(0).toUpperCase() + c.slice(1) : c), !i[c] && d in t && (i[c] = d);
						n && !i.raf && (n = n.toLowerCase(), i.raf = window[n + "RequestAnimationFrame"], i.raf && (i.caf = window[n + "CancelAnimationFrame"] || window[n + "CancelRequestAnimationFrame"]))
					}
					if(!i.raf) {
						var m = 0;
						i.raf = function(e) {
							var t = (new Date).getTime(),
								n = Math.max(0, 16 - (t - m)),
								i = window.setTimeout(function() {
									e(t + n)
								}, n);
							return m = t + n, i
						}, i.caf = function(e) {
							clearTimeout(e)
						}
					}
					return i.svg = !!document.createElementNS && !!document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,
						o.features = i, i
				}
			};
			o.detectFeatures(), o.features.oldIE && (o.bind = function(e, t, n, i) {
				t = t.split(" ");
				for(var o, a = (i ? "detach" : "attach") + "Event", s = function() {
						n.handleEvent.call(n)
					}, r = 0; r < t.length; r++)
					if(o = t[r])
						if("object" == typeof n && n.handleEvent) {
							if(i) {
								if(!n["oldIE" + o]) return !1
							} else n["oldIE" + o] = s;
							e[a]("on" + o, n["oldIE" + o])
						} else e[a]("on" + o, n)
			});
			var a = this,
				s = 25,
				r = 3,
				l = {
					allowPanToNext: !0,
					spacing: .12,
					bgOpacity: .5,
					mouseUsed: !1,
					loop: !0,
					pinchToClose: !0,
					closeOnScroll: !0,
					closeOnVerticalDrag: !0,
					verticalDragRange: .75,
					hideAnimationDuration: 333,
					showAnimationDuration: 333,
					showHideOpacity: !1,
					focus: !0,
					escKey: !0,
					arrowKeys: !0,
					mainScrollEndFriction: .35,
					panEndFriction: .35,
					isClickableElement: function(e) {
						return "A" === e.tagName
					},
					getDoubleTapZoom: function(e, t) {
						return e ? 1 : t.initialZoomLevel < .7 ? 1 : 1.33
					},
					maxSpreadZoom: 1.33,
					modal: !0,
					scaleMode: "fit"
				};
			o.extend(l, i);
			var c, d, u, p, h, f, m, g, v, b, x, y, w, _, T, C, k, S, $, E, j, I, O, P, M, N, A, L, D, B, H, R, z, F, U, W, q, Y, J, G, X, V, Z, Q, K, ee, te, ne, ie, oe, ae, se, re, le, ce, de, ue = function() {
					return {
						x: 0,
						y: 0
					}
				},
				pe = ue(),
				he = ue(),
				fe = ue(),
				me = {},
				ge = 0,
				ve = {},
				be = ue(),
				xe = 0,
				ye = !0,
				we = [],
				_e = {},
				Te = !1,
				Ce = function(e, t) {
					o.extend(a, t.publicMethods), we.push(e)
				},
				ke = function(e) {
					var t = Kt();
					return e > t - 1 ? e - t : 0 > e ? t + e : e
				},
				Se = {},
				$e = function(e, t) {
					return Se[e] || (Se[e] = []), Se[e].push(t)
				},
				Ee = function(e) {
					var t = Se[e];
					if(t) {
						var n = Array.prototype.slice.call(arguments);
						n.shift();
						for(var i = 0; i < t.length; i++) t[i].apply(a, n)
					}
				},
				je = function() {
					return(new Date).getTime()
				},
				Ie = function(e) {
					le = e, a.bg.style.opacity = e * l.bgOpacity
				},
				Oe = function(e, t, n, i, o) {
					(!Te || o && o !== a.currItem) && (i /= o ? o.fitRatio : a.currItem.fitRatio), e[I] = y + t + "px, " + n + "px" + w + " scale(" + i + ")"
				},
				Pe = function(e) {
					ie && (e && (b > a.currItem.fitRatio ? Te || (pn(a.currItem, !1, !0), Te = !0) : Te && (pn(a.currItem), Te = !1)), Oe(ie, fe.x, fe.y, b))
				},
				Me = function(e) {
					e.container && Oe(e.container.style, e.initialPosition.x, e.initialPosition.y, e.initialZoomLevel, e)
				},
				Ne = function(e, t) {
					t[I] = y + e + "px, 0px" + w
				},
				Ae = function(e, t) {
					if(!l.loop && t) {
						var n = p + (be.x * ge - e) / be.x,
							i = Math.round(e - bt.x);
						(0 > n && i > 0 || n >= Kt() - 1 && 0 > i) && (e = bt.x + i * l.mainScrollEndFriction)
					}
					bt.x = e, Ne(e, h)
				},
				Le = function(e, t) {
					var n = xt[e] - ve[e];
					return he[e] + pe[e] + n - n * (t / x)
				},
				De = function(e, t) {
					e.x = t.x, e.y = t.y, t.id && (e.id = t.id)
				},
				Be = function(e) {
					e.x = Math.round(e.x), e.y = Math.round(e.y)
				},
				He = null,
				Re = function() {
					He && (o.unbind(document, "mousemove", Re), o.addClass(e, "pswp--has_mouse"), l.mouseUsed = !0, Ee("mouseUsed")), He = setTimeout(function() {
						He = null
					}, 100)
				},
				ze = function() {
					o.bind(document, "keydown", a), H.transform && o.bind(a.scrollWrap, "click", a), l.mouseUsed || o.bind(document, "mousemove", Re), o.bind(window, "resize scroll", a), Ee("bindEvents")
				},
				Fe = function() {
					o.unbind(window, "resize", a), o.unbind(window, "scroll", v.scroll), o.unbind(document, "keydown", a), o.unbind(document, "mousemove", Re), H.transform && o.unbind(a.scrollWrap, "click", a), Y && o.unbind(window, m, a), Ee("unbindEvents")
				},
				Ue = function(e, t) {
					var n = ln(a.currItem, me, e);
					return t && (ne = n), n
				},
				We = function(e) {
					return e || (e = a.currItem), e.initialZoomLevel
				},
				qe = function(e) {
					return e || (e = a.currItem), e.w > 0 ? l.maxSpreadZoom : 1
				},
				Ye = function(e, t, n, i) {
					return i === a.currItem.initialZoomLevel ? (n[e] = a.currItem.initialPosition[e], !0) : (n[e] = Le(e, i), n[e] > t.min[e] ? (n[e] = t.min[e], !0) : n[e] < t.max[e] && (n[e] = t.max[e], !0))
				},
				Je = function() {
					if(I) {
						var t = H.perspective && !P;
						return y = "translate" + (t ? "3d(" : "("), void(w = H.perspective ? ", 0px)" : ")")
					}
					I = "left", o.addClass(e, "pswp--ie"), Ne = function(e, t) {
						t.left = e + "px"
					}, Me = function(e) {
						var t = e.fitRatio > 1 ? 1 : e.fitRatio,
							n = e.container.style,
							i = t * e.w,
							o = t * e.h;
						n.width = i + "px", n.height = o + "px", n.left = e.initialPosition.x + "px", n.top = e.initialPosition.y + "px"
					}, Pe = function() {
						if(ie) {
							var e = ie,
								t = a.currItem,
								n = t.fitRatio > 1 ? 1 : t.fitRatio,
								i = n * t.w,
								o = n * t.h;
							e.width = i + "px", e.height = o + "px", e.left = fe.x + "px", e.top = fe.y + "px"
						}
					}
				},
				Ge = function(e) {
					var t = "";
					l.escKey && 27 === e.keyCode ? t = "close" : l.arrowKeys && (37 === e.keyCode ? t = "prev" : 39 === e.keyCode && (t = "next")), t && (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey || (e.preventDefault ? e.preventDefault() : e.returnValue = !1, a[t]()))
				},
				Xe = function(e) {
					e && (X || G || oe || W) && (e.preventDefault(), e.stopPropagation())
				},
				Ve = function() {
					a.setScrollOffset(0, o.getScrollY())
				},
				Ze = {},
				Qe = 0,
				Ke = function(e) {
					Ze[e] && (Ze[e].raf && N(Ze[e].raf), Qe--, delete Ze[e])
				},
				et = function(e) {
					Ze[e] && Ke(e), Ze[e] || (Qe++, Ze[e] = {})
				},
				tt = function() {
					for(var e in Ze) Ze.hasOwnProperty(e) && Ke(e)
				},
				nt = function(e, t, n, i, o, a, s) {
					var r, l = je();
					et(e);
					var c = function() {
						if(Ze[e]) {
							if(r = je() - l, r >= i) return Ke(e), a(n), void(s && s());
							a((n - t) * o(r / i) + t), Ze[e].raf = M(c)
						}
					};
					c()
				},
				it = {
					shout: Ee,
					listen: $e,
					viewportSize: me,
					options: l,
					isMainScrollAnimating: function() {
						return oe
					},
					getZoomLevel: function() {
						return b
					},
					getCurrentIndex: function() {
						return p
					},
					isDragging: function() {
						return Y
					},
					isZooming: function() {
						return K
					},
					setScrollOffset: function(e, t) {
						ve.x = e, B = ve.y = t, Ee("updateScrollOffset", ve)
					},
					applyZoomPan: function(e, t, n, i) {
						fe.x = t, fe.y = n, b = e, Pe(i)
					},
					init: function() {
						if(!c && !d) {
							var n;
							a.framework = o, a.template = e, a.bg = o.getChildByClass(e, "pswp__bg"), A = e.className, c = !0, H = o.detectFeatures(), M = H.raf, N = H.caf, I = H.transform, D = H.oldIE, a.scrollWrap = o.getChildByClass(e, "pswp__scroll-wrap"), a.container = o.getChildByClass(a.scrollWrap, "pswp__container"), h = a.container.style, a.itemHolders = C = [{
								el: a.container.children[0],
								wrap: 0,
								index: -1
							}, {
								el: a.container.children[1],
								wrap: 0,
								index: -1
							}, {
								el: a.container.children[2],
								wrap: 0,
								index: -1
							}], C[0].el.style.display = C[2].el.style.display = "none", Je(), v = {
								resize: a.updateSize,
								scroll: Ve,
								keydown: Ge,
								click: Xe
							};
							var i = H.isOldIOSPhone || H.isOldAndroid || H.isMobileOpera;
							for(H.animationName && H.transform && !i || (l.showAnimationDuration = l.hideAnimationDuration = 0), n = 0; n < we.length; n++) a["init" + we[n]]();
							if(t) {
								var s = a.ui = new t(a, o);
								s.init()
							}
							Ee("firstUpdate"), p = p || l.index || 0, (isNaN(p) || 0 > p || p >= Kt()) && (p = 0), a.currItem = Qt(p), (H.isOldIOSPhone || H.isOldAndroid) && (ye = !1), e.setAttribute("aria-hidden", "false"), l.modal && (ye ? e.style.position = "fixed" : (e.style.position = "absolute", e.style.top = o.getScrollY() + "px")), void 0 === B && (Ee("initialLayout"), B = L = o.getScrollY());
							var u = "pswp--open ";
							for(l.mainClass && (u += l.mainClass + " "), l.showHideOpacity && (u += "pswp--animate_opacity "), u += P ? "pswp--touch" : "pswp--notouch", u += H.animationName ? " pswp--css_animation" : "", u += H.svg ? " pswp--svg" : "", o.addClass(e, u), a.updateSize(), f = -1, xe = null, n = 0; r > n; n++) Ne((n + f) * be.x, C[n].el.style);
							D || o.bind(a.scrollWrap, g, a), $e("initialZoomInEnd", function() {
								a.setContent(C[0], p - 1), a.setContent(C[2], p + 1), C[0].el.style.display = C[2].el.style.display = "block", l.focus && e.focus(), ze()
							}), a.setContent(C[1], p), a.updateCurrItem(), Ee("afterInit"), ye || (_ = setInterval(function() {
								Qe || Y || K || b !== a.currItem.initialZoomLevel || a.updateSize()
							}, 1e3)), o.addClass(e, "pswp--visible")
						}
					},
					close: function() {
						c && (c = !1, d = !0, Ee("close"), Fe(), tn(a.currItem, null, !0, a.destroy))
					},
					destroy: function() {
						Ee("destroy"), Gt && clearTimeout(Gt), e.setAttribute("aria-hidden", "true"), e.className = A, _ && clearInterval(_), o.unbind(a.scrollWrap, g, a), o.unbind(window, "scroll", a), Ct(), tt(), Se = null
					},
					panTo: function(e, t, n) {
						n || (e > ne.min.x ? e = ne.min.x : e < ne.max.x && (e = ne.max.x), t > ne.min.y ? t = ne.min.y : t < ne.max.y && (t = ne.max.y)), fe.x = e, fe.y = t, Pe()
					},
					handleEvent: function(e) {
						e = e || window.event, v[e.type] && v[e.type](e)
					},
					goTo: function(e) {
						e = ke(e);
						var t = e - p;
						xe = t, p = e, a.currItem = Qt(p), ge -= t, Ae(be.x * ge), tt(), oe = !1, a.updateCurrItem()
					},
					next: function() {
						a.goTo(p + 1)
					},
					prev: function() {
						a.goTo(p - 1)
					},
					updateCurrZoomItem: function(e) {
						if(e && Ee("beforeChange", 0), C[1].el.children.length) {
							var t = C[1].el.children[0];
							ie = o.hasClass(t, "pswp__zoom-wrap") ? t.style : null
						} else ie = null;
						ne = a.currItem.bounds, x = b = a.currItem.initialZoomLevel, fe.x = ne.center.x, fe.y = ne.center.y, e && Ee("afterChange")
					},
					invalidateCurrItems: function() {
						T = !0;
						for(var e = 0; r > e; e++) C[e].item && (C[e].item.needsUpdate = !0)
					},
					updateCurrItem: function(e) {
						if(0 !== xe) {
							var t, n = Math.abs(xe);
							if(!(e && 2 > n)) {
								a.currItem = Qt(p), Te = !1, Ee("beforeChange", xe), n >= r && (f += xe + (xe > 0 ? -r : r), n = r);
								for(var i = 0; n > i; i++) xe > 0 ? (t = C.shift(), C[r - 1] = t, f++, Ne((f + 2) * be.x, t.el.style), a.setContent(t, p - n + i + 1 + 1)) : (t = C.pop(), C.unshift(t), f--, Ne(f * be.x, t.el.style), a.setContent(t, p + n - i - 1 - 1));
								if(ie && 1 === Math.abs(xe)) {
									var o = Qt(k);
									o.initialZoomLevel !== b && (ln(o, me), pn(o), Me(o))
								}
								xe = 0, a.updateCurrZoomItem(), k = p, Ee("afterChange")
							}
						}
					},
					updateSize: function(t) {
						if(!ye && l.modal) {
							var n = o.getScrollY();
							if(B !== n && (e.style.top = n + "px", B = n), !t && _e.x === window.innerWidth && _e.y === window.innerHeight) return;
							_e.x = window.innerWidth, _e.y = window.innerHeight, e.style.height = _e.y + "px"
						}
						if(me.x = a.scrollWrap.clientWidth, me.y = a.scrollWrap.clientHeight, Ve(), be.x = me.x + Math.round(me.x * l.spacing), be.y = me.y, Ae(be.x * ge), Ee("beforeResize"), void 0 !== f) {
							for(var i, s, c, d = 0; r > d; d++) i = C[d], Ne((d + f) * be.x, i.el.style), c = p + d - 1, l.loop && Kt() > 2 && (c = ke(c)), s = Qt(c), s && (T || s.needsUpdate || !s.bounds) ? (a.cleanSlide(s), a.setContent(i, c), 1 === d && (a.currItem = s, a.updateCurrZoomItem(!0)), s.needsUpdate = !1) : -1 === i.index && c >= 0 && a.setContent(i, c), s && s.container && (ln(s, me), pn(s), Me(s));
							T = !1
						}
						x = b = a.currItem.initialZoomLevel, ne = a.currItem.bounds, ne && (fe.x = ne.center.x, fe.y = ne.center.y, Pe(!0)), Ee("resize")
					},
					zoomTo: function(e, t, n, i, a) {
						t && (x = b, xt.x = Math.abs(t.x) - fe.x, xt.y = Math.abs(t.y) - fe.y, De(he, fe));
						var s = Ue(e, !1),
							r = {};
						Ye("x", s, r, e), Ye("y", s, r, e);
						var l = b,
							c = {
								x: fe.x,
								y: fe.y
							};
						Be(r);
						var d = function(t) {
							1 === t ? (b = e, fe.x = r.x, fe.y = r.y) : (b = (e - l) * t + l, fe.x = (r.x - c.x) * t + c.x, fe.y = (r.y - c.y) * t + c.y), a && a(t), Pe(1 === t)
						};
						n ? nt("customZoomTo", 0, 1, n, i || o.easing.sine.inOut, d) : d(1)
					}
				},
				ot = 30,
				at = 10,
				st = {},
				rt = {},
				lt = {},
				ct = {},
				dt = {},
				ut = [],
				pt = {},
				ht = [],
				ft = {},
				mt = 0,
				gt = ue(),
				vt = 0,
				bt = ue(),
				xt = ue(),
				yt = ue(),
				wt = function(e, t) {
					return e.x === t.x && e.y === t.y
				},
				_t = function(e, t) {
					return Math.abs(e.x - t.x) < s && Math.abs(e.y - t.y) < s
				},
				Tt = function(e, t) {
					return ft.x = Math.abs(e.x - t.x), ft.y = Math.abs(e.y - t.y), Math.sqrt(ft.x * ft.x + ft.y * ft.y)
				},
				Ct = function() {
					V && (N(V), V = null)
				},
				kt = function() {
					Y && (V = M(kt), zt())
				},
				St = function() {
					return !("fit" === l.scaleMode && b === a.currItem.initialZoomLevel)
				},
				$t = function(e, t) {
					return !(!e || e === document) && (!(e.getAttribute("class") && e.getAttribute("class").indexOf("pswp__scroll-wrap") > -1) && (t(e) ? e : $t(e.parentNode, t)))
				},
				Et = {},
				jt = function(e, t) {
					return Et.prevent = !$t(e.target, l.isClickableElement), Ee("preventDragEvent", e, t, Et), Et.prevent
				},
				It = function(e, t) {
					return t.x = e.pageX, t.y = e.pageY, t.id = e.identifier, t
				},
				Ot = function(e, t, n) {
					n.x = .5 * (e.x + t.x), n.y = .5 * (e.y + t.y)
				},
				Pt = function(e, t, n) {
					if(e - z > 50) {
						var i = ht.length > 2 ? ht.shift() : {};
						i.x = t, i.y = n, ht.push(i), z = e
					}
				},
				Mt = function() {
					var e = fe.y - a.currItem.initialPosition.y;
					return 1 - Math.abs(e / (me.y / 2))
				},
				Nt = {},
				At = {},
				Lt = [],
				Dt = function(e) {
					for(; Lt.length > 0;) Lt.pop();
					return O ? (de = 0, ut.forEach(function(e) {
						0 === de ? Lt[0] = e : 1 === de && (Lt[1] = e), de++
					})) : e.type.indexOf("touch") > -1 ? e.touches && e.touches.length > 0 && (Lt[0] = It(e.touches[0], Nt), e.touches.length > 1 && (Lt[1] = It(e.touches[1], At))) : (Nt.x = e.pageX, Nt.y = e.pageY, Nt.id = "", Lt[0] = Nt), Lt
				},
				Bt = function(e, t) {
					var n, i, o, s, r = 0,
						c = fe[e] + t[e],
						d = t[e] > 0,
						u = bt.x + t.x,
						p = bt.x - pt.x;
					return n = c > ne.min[e] || c < ne.max[e] ? l.panEndFriction : 1, c = fe[e] + t[e] * n, !l.allowPanToNext && b !== a.currItem.initialZoomLevel || (ie ? "h" !== ae || "x" !== e || G || (d ? (c > ne.min[e] && (n = l.panEndFriction, r = ne.min[e] - c, i = ne.min[e] - he[e]), (0 >= i || 0 > p) && Kt() > 1 ? (s = u, 0 > p && u > pt.x && (s = pt.x)) : ne.min.x !== ne.max.x && (o = c)) : (c < ne.max[e] && (n = l.panEndFriction, r = c - ne.max[e], i = he[e] - ne.max[e]), (0 >= i || p > 0) && Kt() > 1 ? (s = u, p > 0 && u < pt.x && (s = pt.x)) : ne.min.x !== ne.max.x && (o = c))) : s = u, "x" !== e) ? void(oe || Z || b > a.currItem.fitRatio && (fe[e] += t[e] * n)) : (void 0 !== s && (Ae(s, !0), Z = s !== pt.x), ne.min.x !== ne.max.x && (void 0 !== o ? fe.x = o : Z || (fe.x += t.x * n)), void 0 !== s)
				},
				Ht = function(e) {
					if(!("mousedown" === e.type && e.button > 0)) {
						if(Zt) return void e.preventDefault();
						if(!q || "mousedown" !== e.type) {
							if(jt(e, !0) && e.preventDefault(), Ee("pointerDown"), O) {
								var t = o.arraySearch(ut, e.pointerId, "id");
								0 > t && (t = ut.length), ut[t] = {
									x: e.pageX,
									y: e.pageY,
									id: e.pointerId
								}
							}
							var n = Dt(e),
								i = n.length;
							Q = null, tt(), Y && 1 !== i || (Y = se = !0, o.bind(window, m, a), U = ce = re = W = Z = X = J = G = !1, ae = null, Ee("firstTouchStart", n), De(he, fe), pe.x = pe.y = 0, De(ct, n[0]), De(dt, ct), pt.x = be.x * ge, ht = [{
								x: ct.x,
								y: ct.y
							}], z = R = je(), Ue(b, !0), Ct(), kt()), !K && i > 1 && !oe && !Z && (x = b, G = !1, K = J = !0, pe.y = pe.x = 0, De(he, fe), De(st, n[0]), De(rt, n[1]), Ot(st, rt, yt), xt.x = Math.abs(yt.x) - fe.x, xt.y = Math.abs(yt.y) - fe.y, ee = te = Tt(st, rt))
						}
					}
				},
				Rt = function(e) {
					if(e.preventDefault(), O) {
						var t = o.arraySearch(ut, e.pointerId, "id");
						if(t > -1) {
							var n = ut[t];
							n.x = e.pageX, n.y = e.pageY
						}
					}
					if(Y) {
						var i = Dt(e);
						if(ae || X || K) Q = i;
						else if(bt.x !== be.x * ge) ae = "h";
						else {
							var a = Math.abs(i[0].x - ct.x) - Math.abs(i[0].y - ct.y);
							Math.abs(a) >= at && (ae = a > 0 ? "h" : "v", Q = i)
						}
					}
				},
				zt = function() {
					if(Q) {
						var e = Q.length;
						if(0 !== e)
							if(De(st, Q[0]), lt.x = st.x - ct.x, lt.y = st.y - ct.y, K && e > 1) {
								if(ct.x = st.x, ct.y = st.y, !lt.x && !lt.y && wt(Q[1], rt)) return;
								De(rt, Q[1]), G || (G = !0, Ee("zoomGestureStarted"));
								var t = Tt(st, rt),
									n = Yt(t);
								n > a.currItem.initialZoomLevel + a.currItem.initialZoomLevel / 15 && (ce = !0);
								var i = 1,
									o = We(),
									s = qe();
								if(o > n)
									if(l.pinchToClose && !ce && x <= a.currItem.initialZoomLevel) {
										var r = o - n,
											c = 1 - r / (o / 1.2);
										Ie(c), Ee("onPinchClose", c), re = !0
									} else i = (o - n) / o, i > 1 && (i = 1), n = o - i * (o / 3);
								else n > s && (i = (n - s) / (6 * o), i > 1 && (i = 1), n = s + i * o);
								0 > i && (i = 0), ee = t, Ot(st, rt, gt), pe.x += gt.x - yt.x, pe.y += gt.y - yt.y, De(yt, gt), fe.x = Le("x", n), fe.y = Le("y", n), U = n > b, b = n, Pe()
							} else {
								if(!ae) return;
								if(se && (se = !1, Math.abs(lt.x) >= at && (lt.x -= Q[0].x - dt.x), Math.abs(lt.y) >= at && (lt.y -= Q[0].y - dt.y)), ct.x = st.x, ct.y = st.y, 0 === lt.x && 0 === lt.y) return;
								if("v" === ae && l.closeOnVerticalDrag && !St()) {
									pe.y += lt.y, fe.y += lt.y;
									var d = Mt();
									return W = !0, Ee("onVerticalDrag", d), Ie(d), void Pe()
								}
								Pt(je(), st.x, st.y), X = !0, ne = a.currItem.bounds;
								var u = Bt("x", lt);
								u || (Bt("y", lt), Be(fe), Pe())
							}
					}
				},
				Ft = function(e) {
					if(H.isOldAndroid) {
						if(q && "mouseup" === e.type) return;
						e.type.indexOf("touch") > -1 && (clearTimeout(q), q = setTimeout(function() {
							q = 0
						}, 600))
					}
					Ee("pointerUp"), jt(e, !1) && e.preventDefault();
					var t;
					if(O) {
						var n = o.arraySearch(ut, e.pointerId, "id");
						if(n > -1)
							if(t = ut.splice(n, 1)[0], navigator.pointerEnabled) t.type = e.pointerType || "mouse";
							else {
								var i = {
									4: "mouse",
									2: "touch",
									3: "pen"
								};
								t.type = i[e.pointerType], t.type || (t.type = e.pointerType || "mouse")
							}
					}
					var s, r = Dt(e),
						c = r.length;
					if("mouseup" === e.type && (c = 0), 2 === c) return Q = null, !0;
					1 === c && De(dt, r[0]), 0 !== c || ae || oe || (t || ("mouseup" === e.type ? t = {
						x: e.pageX,
						y: e.pageY,
						type: "mouse"
					} : e.changedTouches && e.changedTouches[0] && (t = {
						x: e.changedTouches[0].pageX,
						y: e.changedTouches[0].pageY,
						type: "touch"
					})), Ee("touchRelease", e, t));
					var d = -1;
					if(0 === c && (Y = !1, o.unbind(window, m, a), Ct(), K ? d = 0 : -1 !== vt && (d = je() - vt)), vt = 1 === c ? je() : -1, s = -1 !== d && 150 > d ? "zoom" : "swipe", K && 2 > c && (K = !1, 1 === c && (s = "zoomPointerUp"), Ee("zoomGestureEnded")), Q = null, X || G || oe || W)
						if(tt(), F || (F = Ut()), F.calculateSwipeSpeed("x"), W) {
							var u = Mt();
							if(u < l.verticalDragRange) a.close();
							else {
								var p = fe.y,
									h = le;
								nt("verticalDrag", 0, 1, 300, o.easing.cubic.out, function(e) {
									fe.y = (a.currItem.initialPosition.y - p) * e + p, Ie((1 - h) * e + h), Pe()
								}), Ee("onVerticalDrag", 1)
							}
						} else {
							if((Z || oe) && 0 === c) {
								var f = qt(s, F);
								if(f) return;
								s = "zoomPointerUp"
							}
							if(!oe) return "swipe" !== s ? void Jt() : void(!Z && b > a.currItem.fitRatio && Wt(F))
						}
				},
				Ut = function() {
					var e, t, n = {
						lastFlickOffset: {},
						lastFlickDist: {},
						lastFlickSpeed: {},
						slowDownRatio: {},
						slowDownRatioReverse: {},
						speedDecelerationRatio: {},
						speedDecelerationRatioAbs: {},
						distanceOffset: {},
						backAnimDestination: {},
						backAnimStarted: {},
						calculateSwipeSpeed: function(i) {
							ht.length > 1 ? (e = je() - z + 50, t = ht[ht.length - 2][i]) : (e = je() - R, t = dt[i]), n.lastFlickOffset[i] = ct[i] - t, n.lastFlickDist[i] = Math.abs(n.lastFlickOffset[i]), n.lastFlickDist[i] > 20 ? n.lastFlickSpeed[i] = n.lastFlickOffset[i] / e : n.lastFlickSpeed[i] = 0, Math.abs(n.lastFlickSpeed[i]) < .1 && (n.lastFlickSpeed[i] = 0), n.slowDownRatio[i] = .95, n.slowDownRatioReverse[i] = 1 - n.slowDownRatio[i], n.speedDecelerationRatio[i] = 1
						},
						calculateOverBoundsAnimOffset: function(e, t) {
							n.backAnimStarted[e] || (fe[e] > ne.min[e] ? n.backAnimDestination[e] = ne.min[e] : fe[e] < ne.max[e] && (n.backAnimDestination[e] = ne.max[e]), void 0 !== n.backAnimDestination[e] && (n.slowDownRatio[e] = .7, n.slowDownRatioReverse[e] = 1 - n.slowDownRatio[e], n.speedDecelerationRatioAbs[e] < .05 && (n.lastFlickSpeed[e] = 0, n.backAnimStarted[e] = !0, nt("bounceZoomPan" + e, fe[e], n.backAnimDestination[e], t || 300, o.easing.sine.out, function(t) {
								fe[e] = t, Pe()
							}))))
						},
						calculateAnimOffset: function(e) {
							n.backAnimStarted[e] || (n.speedDecelerationRatio[e] = n.speedDecelerationRatio[e] * (n.slowDownRatio[e] + n.slowDownRatioReverse[e] - n.slowDownRatioReverse[e] * n.timeDiff / 10), n.speedDecelerationRatioAbs[e] = Math.abs(n.lastFlickSpeed[e] * n.speedDecelerationRatio[e]), n.distanceOffset[e] = n.lastFlickSpeed[e] * n.speedDecelerationRatio[e] * n.timeDiff, fe[e] += n.distanceOffset[e])
						},
						panAnimLoop: function() {
							return Ze.zoomPan && (Ze.zoomPan.raf = M(n.panAnimLoop), n.now = je(), n.timeDiff = n.now - n.lastNow, n.lastNow = n.now, n.calculateAnimOffset("x"), n.calculateAnimOffset("y"), Pe(), n.calculateOverBoundsAnimOffset("x"), n.calculateOverBoundsAnimOffset("y"), n.speedDecelerationRatioAbs.x < .05 && n.speedDecelerationRatioAbs.y < .05) ? (fe.x = Math.round(fe.x), fe.y = Math.round(fe.y), Pe(), void Ke("zoomPan")) : void 0
						}
					};
					return n
				},
				Wt = function(e) {
					return e.calculateSwipeSpeed("y"), ne = a.currItem.bounds, e.backAnimDestination = {}, e.backAnimStarted = {}, Math.abs(e.lastFlickSpeed.x) <= .05 && Math.abs(e.lastFlickSpeed.y) <= .05 ? (e.speedDecelerationRatioAbs.x = e.speedDecelerationRatioAbs.y = 0, e.calculateOverBoundsAnimOffset("x"), e.calculateOverBoundsAnimOffset("y"), !0) : (et("zoomPan"), e.lastNow = je(), void e.panAnimLoop())
				},
				qt = function(e, t) {
					var n;
					oe || (mt = p);
					var i;
					if("swipe" === e) {
						var s = ct.x - dt.x,
							r = t.lastFlickDist.x < 10;
						s > ot && (r || t.lastFlickOffset.x > 20) ? i = -1 : -ot > s && (r || t.lastFlickOffset.x < -20) && (i = 1)
					}
					var c;
					i && (p += i, 0 > p ? (p = l.loop ? Kt() - 1 : 0, c = !0) : p >= Kt() && (p = l.loop ? 0 : Kt() - 1, c = !0), (!c || l.loop) && (xe += i, ge -= i, n = !0));
					var d, u = be.x * ge,
						h = Math.abs(u - bt.x);
					return n || u > bt.x == t.lastFlickSpeed.x > 0 ? (d = Math.abs(t.lastFlickSpeed.x) > 0 ? h / Math.abs(t.lastFlickSpeed.x) : 333, d = Math.min(d, 400), d = Math.max(d, 250)) : d = 333, mt === p && (n = !1), oe = !0, Ee("mainScrollAnimStart"), nt("mainScroll", bt.x, u, d, o.easing.cubic.out, Ae, function() {
						tt(), oe = !1, mt = -1, (n || mt !== p) && a.updateCurrItem(), Ee("mainScrollAnimComplete")
					}), n && a.updateCurrItem(!0), n
				},
				Yt = function(e) {
					return 1 / te * e * x
				},
				Jt = function() {
					var e = b,
						t = We(),
						n = qe();
					t > b ? e = t : b > n && (e = n);
					var i, s = 1,
						r = le;
					return re && !U && !ce && t > b ? (a.close(), !0) : (re && (i = function(e) {
						Ie((s - r) * e + r)
					}), a.zoomTo(e, 0, 200, o.easing.cubic.out, i), !0)
				};
			Ce("Gestures", {
				publicMethods: {
					initGestures: function() {
						var e = function(e, t, n, i, o) {
							S = e + t, $ = e + n, E = e + i, j = o ? e + o : ""
						};
						O = H.pointerEvent, O && H.touch && (H.touch = !1), O ? navigator.pointerEnabled ? e("pointer", "down", "move", "up", "cancel") : e("MSPointer", "Down", "Move", "Up", "Cancel") : H.touch ? (e("touch", "start", "move", "end", "cancel"), P = !0) : e("mouse", "down", "move", "up"), m = $ + " " + E + " " + j, g = S, O && !P && (P = navigator.maxTouchPoints > 1 || navigator.msMaxTouchPoints > 1), a.likelyTouchDevice = P, v[S] = Ht, v[$] = Rt, v[E] = Ft, j && (v[j] = v[E]), H.touch && (g += " mousedown", m += " mousemove mouseup", v.mousedown = v[S], v.mousemove = v[$], v.mouseup = v[E]), P || (l.allowPanToNext = !1)
					}
				}
			});
			var Gt, Xt, Vt, Zt, Qt, Kt, en, tn = function(t, n, i, s) {
					Gt && clearTimeout(Gt), Zt = !0, Vt = !0;
					var r;
					t.initialLayout ? (r = t.initialLayout, t.initialLayout = null) : r = l.getThumbBoundsFn && l.getThumbBoundsFn(p);
					var c = i ? l.hideAnimationDuration : l.showAnimationDuration,
						d = function() {
							Ke("initialZoom"), i ? (a.template.removeAttribute("style"), a.bg.removeAttribute("style")) : (Ie(1), n && (n.style.display = "block"), o.addClass(e, "pswp--animated-in"), Ee("initialZoom" + (i ? "OutEnd" : "InEnd"))), s && s(), Zt = !1
						};
					if(!c || !r || void 0 === r.x) return Ee("initialZoom" + (i ? "Out" : "In")), b = t.initialZoomLevel, De(fe, t.initialPosition), Pe(), e.style.opacity = i ? 0 : 1, Ie(1), void(c ? setTimeout(function() {
						d()
					}, c) : d());
					var h = function() {
						var n = u,
							s = !a.currItem.src || a.currItem.loadError || l.showHideOpacity;
						t.miniImg && (t.miniImg.style.webkitBackfaceVisibility = "hidden"), i || (b = r.w / t.w, fe.x = r.x, fe.y = r.y - L, a[s ? "template" : "bg"].style.opacity = .001, Pe()), et("initialZoom"), i && !n && o.removeClass(e, "pswp--animated-in"), s && (i ? o[(n ? "remove" : "add") + "Class"](e, "pswp--animate_opacity") : setTimeout(function() {
							o.addClass(e, "pswp--animate_opacity")
						}, 30)), Gt = setTimeout(function() {
							if(Ee("initialZoom" + (i ? "Out" : "In")), i) {
								var a = r.w / t.w,
									l = {
										x: fe.x,
										y: fe.y
									},
									u = b,
									p = le,
									h = function(t) {
										1 === t ? (b = a, fe.x = r.x, fe.y = r.y - B) : (b = (a - u) * t + u, fe.x = (r.x - l.x) * t + l.x, fe.y = (r.y - B - l.y) * t + l.y), Pe(), s ? e.style.opacity = 1 - t : Ie(p - t * p)
									};
								n ? nt("initialZoom", 0, 1, c, o.easing.cubic.out, h, d) : (h(1), Gt = setTimeout(d, c + 20))
							} else b = t.initialZoomLevel, De(fe, t.initialPosition), Pe(), Ie(1), s ? e.style.opacity = 1 : Ie(1), Gt = setTimeout(d, c + 20)
						}, i ? 25 : 90)
					};
					h()
				},
				nn = {},
				on = [],
				an = {
					index: 0,
					errorMsg: '<div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div>',
					forceProgressiveLoading: !1,
					preload: [1, 1],
					getNumItemsFn: function() {
						return Xt.length
					}
				},
				sn = function() {
					return {
						center: {
							x: 0,
							y: 0
						},
						max: {
							x: 0,
							y: 0
						},
						min: {
							x: 0,
							y: 0
						}
					}
				},
				rn = function(e, t, n) {
					var i = e.bounds;
					i.center.x = Math.round((nn.x - t) / 2), i.center.y = Math.round((nn.y - n) / 2) + e.vGap.top, i.max.x = t > nn.x ? Math.round(nn.x - t) : i.center.x, i.max.y = n > nn.y ? Math.round(nn.y - n) + e.vGap.top : i.center.y, i.min.x = t > nn.x ? 0 : i.center.x, i.min.y = n > nn.y ? e.vGap.top : i.center.y
				},
				ln = function(e, t, n) {
					if(e.src && !e.loadError) {
						var i = !n;
						if(i && (e.vGap || (e.vGap = {
								top: 0,
								bottom: 0
							}), Ee("parseVerticalMargin", e)), nn.x = t.x, nn.y = t.y - e.vGap.top - e.vGap.bottom, i) {
							var o = nn.x / e.w,
								a = nn.y / e.h;
							e.fitRatio = a > o ? o : a;
							var s = l.scaleMode;
							"orig" === s ? n = 1 : "fit" === s && (n = e.fitRatio), n > 1 && (n = 1), e.initialZoomLevel = n, e.bounds || (e.bounds = sn())
						}
						if(!n) return;
						return rn(e, e.w * n, e.h * n), i && n === e.initialZoomLevel && (e.initialPosition = e.bounds.center), e.bounds
					}
					return e.w = e.h = 0, e.initialZoomLevel = e.fitRatio = 1, e.bounds = sn(), e.initialPosition = e.bounds.center, e.bounds
				},
				cn = function(e, t, n, i, o, s) {
					t.loadError || i && (t.imageAppended = !0, pn(t, i, t === a.currItem && Te), n.appendChild(i), s && setTimeout(function() {
						t && t.loaded && t.placeholder && (t.placeholder.style.display = "none", t.placeholder = null)
					}, 500))
				},
				dn = function(e) {
					e.loading = !0, e.loaded = !1;
					var t = e.img = o.createEl("pswp__img", "img"),
						n = function() {
							e.loading = !1, e.loaded = !0, e.loadComplete ? e.loadComplete(e) : e.img = null, t.onload = t.onerror = null, t = null
						};
					return t.onload = n, t.onerror = function() {
						e.loadError = !0, n()
					}, t.src = e.src, t
				},
				un = function(e, t) {
					return e.src && e.loadError && e.container ? (t && (e.container.innerHTML = ""), e.container.innerHTML = l.errorMsg.replace("%url%", e.src), !0) : void 0
				},
				pn = function(e, t, n) {
					if(e.src) {
						t || (t = e.container.lastChild);
						var i = n ? e.w : Math.round(e.w * e.fitRatio),
							o = n ? e.h : Math.round(e.h * e.fitRatio);
						e.placeholder && !e.loaded && (e.placeholder.style.width = i + "px", e.placeholder.style.height = o + "px"), t.style.width = i + "px", t.style.height = o + "px"
					}
				},
				hn = function() {
					if(on.length) {
						for(var e, t = 0; t < on.length; t++) e = on[t], e.holder.index === e.index && cn(e.index, e.item, e.baseDiv, e.img, !1, e.clearPlaceholder);
						on = []
					}
				};
			Ce("Controller", {
				publicMethods: {
					lazyLoadItem: function(e) {
						e = ke(e);
						var t = Qt(e);
						t && (!t.loaded && !t.loading || T) && (Ee("gettingData", e, t), t.src && dn(t))
					},
					initController: function() {
						o.extend(l, an, !0), a.items = Xt = n, Qt = a.getItemAt, Kt = l.getNumItemsFn, en = l.loop, Kt() < 3 && (l.loop = !1), $e("beforeChange", function(e) {
							var t, n = l.preload,
								i = null === e || e >= 0,
								o = Math.min(n[0], Kt()),
								s = Math.min(n[1], Kt());
							for(t = 1;
								(i ? s : o) >= t; t++) a.lazyLoadItem(p + t);
							for(t = 1;
								(i ? o : s) >= t; t++) a.lazyLoadItem(p - t)
						}), $e("initialLayout", function() {
							a.currItem.initialLayout = l.getThumbBoundsFn && l.getThumbBoundsFn(p)
						}), $e("mainScrollAnimComplete", hn), $e("initialZoomInEnd", hn), $e("destroy", function() {
							for(var e, t = 0; t < Xt.length; t++) e = Xt[t], e.container && (e.container = null), e.placeholder && (e.placeholder = null), e.img && (e.img = null), e.preloader && (e.preloader = null), e.loadError && (e.loaded = e.loadError = !1);
							on = null
						})
					},
					getItemAt: function(e) {
						return e >= 0 && void 0 !== Xt[e] && Xt[e]
					},
					allowProgressiveImg: function() {
						return l.forceProgressiveLoading || !P || l.mouseUsed || screen.width > 1200
					},
					setContent: function(e, t) {
						l.loop && (t = ke(t));
						var n = a.getItemAt(e.index);
						n && (n.container = null);
						var i, s = a.getItemAt(t);
						if(!s) return void(e.el.innerHTML = "");
						Ee("gettingData", t, s), e.index = t, e.item = s;
						var r = s.container = o.createEl("pswp__zoom-wrap");
						if(!s.src && s.html && (s.html.tagName ? r.appendChild(s.html) : r.innerHTML = s.html), un(s), ln(s, me), !s.src || s.loadError || s.loaded) s.src && !s.loadError && (i = o.createEl("pswp__img", "img"), i.style.opacity = 1, i.src = s.src, pn(s, i), cn(t, s, r, i, !0));
						else {
							if(s.loadComplete = function(n) {
									if(c) {
										if(e && e.index === t) {
											if(un(n, !0)) return n.loadComplete = n.img = null, ln(n, me), Me(n), void(e.index === p && a.updateCurrZoomItem());
											n.imageAppended ? !Zt && n.placeholder && (n.placeholder.style.display = "none", n.placeholder = null) : H.transform && (oe || Zt) ? on.push({
												item: n,
												baseDiv: r,
												img: n.img,
												index: t,
												holder: e,
												clearPlaceholder: !0
											}) : cn(t, n, r, n.img, oe || Zt, !0)
										}
										n.loadComplete = null, n.img = null, Ee("imageLoadComplete", t, n)
									}
								}, o.features.transform) {
								var d = "pswp__img pswp__img--placeholder";
								d += s.msrc ? "" : " pswp__img--placeholder--blank";
								var u = o.createEl(d, s.msrc ? "img" : "");
								s.msrc && (u.src = s.msrc), pn(s, u), r.appendChild(u), s.placeholder = u
							}
							s.loading || dn(s), a.allowProgressiveImg() && (!Vt && H.transform ? on.push({
								item: s,
								baseDiv: r,
								img: s.img,
								index: t,
								holder: e
							}) : cn(t, s, r, s.img, !0, !0))
						}
						Vt || t !== p ? Me(s) : (ie = r.style, tn(s, i || s.img)), e.el.innerHTML = "", e.el.appendChild(r)
					},
					cleanSlide: function(e) {
						e.img && (e.img.onload = e.img.onerror = null), e.loaded = e.loading = e.img = e.imageAppended = !1
					}
				}
			});
			var fn, mn = {},
				gn = function(e, t, n) {
					var i = document.createEvent("CustomEvent"),
						o = {
							origEvent: e,
							target: e.target,
							releasePoint: t,
							pointerType: n || "touch"
						};
					i.initCustomEvent("pswpTap", !0, !0, o), e.target.dispatchEvent(i)
				};
			Ce("Tap", {
				publicMethods: {
					initTap: function() {
						$e("firstTouchStart", a.onTapStart), $e("touchRelease", a.onTapRelease), $e("destroy", function() {
							mn = {}, fn = null
						})
					},
					onTapStart: function(e) {
						e.length > 1 && (clearTimeout(fn), fn = null)
					},
					onTapRelease: function(e, t) {
						if(t && !X && !J && !Qe) {
							var n = t;
							if(fn && (clearTimeout(fn), fn = null, _t(n, mn))) return void Ee("doubleTap", n);
							if("mouse" === t.type) return void gn(e, t, "mouse");
							var i = e.target.tagName.toUpperCase();
							if("BUTTON" === i || o.hasClass(e.target, "pswp__single-tap")) return void gn(e, t);
							De(mn, n), fn = setTimeout(function() {
								gn(e, t), fn = null
							}, 300)
						}
					}
				}
			});
			var vn;
			Ce("DesktopZoom", {
				publicMethods: {
					initDesktopZoom: function() {
						D || (P ? $e("mouseUsed", function() {
							a.setupDesktopZoom()
						}) : a.setupDesktopZoom(!0))
					},
					setupDesktopZoom: function(t) {
						vn = {};
						var n = "wheel mousewheel DOMMouseScroll";
						$e("bindEvents", function() {
							o.bind(e, n, a.handleMouseWheel)
						}), $e("unbindEvents", function() {
							vn && o.unbind(e, n, a.handleMouseWheel)
						}), a.mouseZoomedIn = !1;
						var i, s = function() {
								a.mouseZoomedIn && (o.removeClass(e, "pswp--zoomed-in"), a.mouseZoomedIn = !1), 1 > b ? o.addClass(e, "pswp--zoom-allowed") : o.removeClass(e, "pswp--zoom-allowed"), r()
							},
							r = function() {
								i && (o.removeClass(e, "pswp--dragging"), i = !1)
							};
						$e("resize", s), $e("afterChange", s), $e("pointerDown", function() {
							a.mouseZoomedIn && (i = !0, o.addClass(e, "pswp--dragging"))
						}), $e("pointerUp", r), t || s()
					},
					handleMouseWheel: function(e) {
						if(b <= a.currItem.fitRatio) return l.modal && (!l.closeOnScroll || Qe || Y ? e.preventDefault() : I && Math.abs(e.deltaY) > 2 && (u = !0, a.close())), !0;
						if(e.stopPropagation(), vn.x = 0, "deltaX" in e) 1 === e.deltaMode ? (vn.x = 18 * e.deltaX, vn.y = 18 * e.deltaY) : (vn.x = e.deltaX, vn.y = e.deltaY);
						else if("wheelDelta" in e) e.wheelDeltaX && (vn.x = -.16 * e.wheelDeltaX), e.wheelDeltaY ? vn.y = -.16 * e.wheelDeltaY : vn.y = -.16 * e.wheelDelta;
						else {
							if(!("detail" in e)) return;
							vn.y = e.detail
						}
						Ue(b, !0);
						var t = fe.x - vn.x,
							n = fe.y - vn.y;
						(l.modal || t <= ne.min.x && t >= ne.max.x && n <= ne.min.y && n >= ne.max.y) && e.preventDefault(), a.panTo(t, n)
					},
					toggleDesktopZoom: function(t) {
						t = t || {
							x: me.x / 2 + ve.x,
							y: me.y / 2 + ve.y
						};
						var n = l.getDoubleTapZoom(!0, a.currItem),
							i = b === n;
						a.mouseZoomedIn = !i, a.zoomTo(i ? a.currItem.initialZoomLevel : n, t, 333), o[(i ? "remove" : "add") + "Class"](e, "pswp--zoomed-in")
					}
				}
			});
			var bn, xn, yn, wn, _n, Tn, Cn, kn, Sn, $n, En, jn, In = {
					history: !0,
					galleryUID: 1
				},
				On = function() {
					return En.hash.substring(1)
				},
				Pn = function() {
					bn && clearTimeout(bn), yn && clearTimeout(yn)
				},
				Mn = function() {
					var e = On(),
						t = {};
					if(e.length < 5) return t;
					var n, i = e.split("&");
					for(n = 0; n < i.length; n++)
						if(i[n]) {
							var o = i[n].split("=");
							o.length < 2 || (t[o[0]] = o[1])
						}
					if(l.galleryPIDs) {
						var a = t.pid;
						for(t.pid = 0, n = 0; n < Xt.length; n++)
							if(Xt[n].pid === a) {
								t.pid = n;
								break
							}
					} else t.pid = parseInt(t.pid, 10) - 1;
					return t.pid < 0 && (t.pid = 0), t
				},
				Nn = function() {
					if(yn && clearTimeout(yn), Qe || Y) return void(yn = setTimeout(Nn, 500));
					wn ? clearTimeout(xn) : wn = !0;
					var e = p + 1,
						t = Qt(p);
					t.hasOwnProperty("pid") && (e = t.pid);
					var n = Cn + "&gid=" + l.galleryUID + "&pid=" + e;
					kn || -1 === En.hash.indexOf(n) && ($n = !0);
					var i = En.href.split("#")[0] + "#" + n;
					jn ? "#" + n !== window.location.hash && history[kn ? "replaceState" : "pushState"]("", document.title, i) : kn ? En.replace(i) : En.hash = n, kn = !0, xn = setTimeout(function() {
						wn = !1
					}, 60)
				};
			Ce("History", {
				publicMethods: {
					initHistory: function() {
						if(o.extend(l, In, !0), l.history) {
							En = window.location, $n = !1, Sn = !1, kn = !1, Cn = On(), jn = "pushState" in history, Cn.indexOf("gid=") > -1 && (Cn = Cn.split("&gid=")[0], Cn = Cn.split("?gid=")[0]), $e("afterChange", a.updateURL), $e("unbindEvents", function() {
								o.unbind(window, "hashchange", a.onHashChange)
							});
							var e = function() {
								Tn = !0, Sn || ($n ? history.back() : Cn ? En.hash = Cn : jn ? history.pushState("", document.title, En.pathname + En.search) : En.hash = ""), Pn()
							};
							$e("unbindEvents", function() {
								u && e()
							}), $e("destroy", function() {
								Tn || e()
							}), $e("firstUpdate", function() {
								p = Mn().pid
							});
							var t = Cn.indexOf("pid=");
							t > -1 && (Cn = Cn.substring(0, t), "&" === Cn.slice(-1) && (Cn = Cn.slice(0, -1))), setTimeout(function() {
								c && o.bind(window, "hashchange", a.onHashChange)
							}, 40)
						}
					},
					onHashChange: function() {
						return On() === Cn ? (Sn = !0, void a.close()) : void(wn || (_n = !0, a.goTo(Mn().pid), _n = !1))
					},
					updateURL: function() {
						Pn(), _n || (kn ? bn = setTimeout(Nn, 800) : Nn())
					}
				}
			}), o.extend(a, it)
		};
		return e
	}), ! function(e, t) {
		"function" == typeof define && define.amd ? define(t) : "object" == typeof exports ? module.exports = t() : e.PhotoSwipeUI_Default = t()
	}(this, function() {
		"use strict";
		var e = function(e, t) {
			var n, i, o, a, s, r, l, c, d, u, p, h, f, m, g, v, b, x, y, w = this,
				_ = !1,
				T = !0,
				C = !0,
				k = {
					barsSize: {
						top: 44,
						bottom: "auto"
					},
					closeElClasses: ["item", "caption", "zoom-wrap", "ui", "top-bar"],
					timeToIdle: 4e3,
					timeToIdleOutside: 1e3,
					loadingIndicatorDelay: 1e3,
					addCaptionHTMLFn: function(e, t) {
						return e.title ? (t.children[0].innerHTML = e.title, !0) : (t.children[0].innerHTML = "", !1)
					},
					closeEl: !0,
					captionEl: !0,
					fullscreenEl: !0,
					zoomEl: !0,
					shareEl: !0,
					counterEl: !0,
					arrowEl: !0,
					preloaderEl: !0,
					tapToClose: !1,
					tapToToggleControls: !0,
					clickToCloseNonZoomable: !0,
					shareButtons: [{
						id: "facebook",
						label: "Share on Facebook",
						url: "https://www.facebook.com/sharer/sharer.php?u={{url}}"
					}, {
						id: "twitter",
						label: "Tweet",
						url: "https://twitter.com/intent/tweet?text={{text}}&url={{url}}"
					}, {
						id: "pinterest",
						label: "Pin it",
						url: "http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}"
					}, {
						id: "download",
						label: "Download image",
						url: "{{raw_image_url}}",
						download: !0
					}],
					getImageURLForShare: function() {
						return e.currItem.src || ""
					},
					getPageURLForShare: function() {
						return window.location.href
					},
					getTextForShare: function() {
						return e.currItem.title || ""
					},
					indexIndicatorSep: " / ",
					fitControlsWidth: 1200
				},
				S = function(e) {
					if(v) return !0;
					e = e || window.event, g.timeToIdle && g.mouseUsed && !d && L();
					for(var n, i, o = e.target || e.srcElement, a = o.getAttribute("class") || "", s = 0; s < W.length; s++) n = W[s], n.onTap && a.indexOf("pswp__" + n.name) > -1 && (n.onTap(), i = !0);
					if(i) {
						e.stopPropagation && e.stopPropagation(), v = !0;
						var r = t.features.isOldAndroid ? 600 : 30;
						b = setTimeout(function() {
							v = !1
						}, r)
					}
				},
				$ = function() {
					return !e.likelyTouchDevice || g.mouseUsed || screen.width > g.fitControlsWidth
				},
				E = function(e, n, i) {
					t[(i ? "add" : "remove") + "Class"](e, "pswp__" + n)
				},
				j = function() {
					var e = 1 === g.getNumItemsFn();
					e !== m && (E(i, "ui--one-slide", e), m = e)
				},
				I = function() {
					E(l, "share-modal--hidden", C)
				},
				O = function() {
					return C = !C, C ? (t.removeClass(l, "pswp__share-modal--fade-in"), setTimeout(function() {
						C && I()
					}, 300)) : (I(), setTimeout(function() {
						C || t.addClass(l, "pswp__share-modal--fade-in")
					}, 30)), C || M(), !1
				},
				P = function(t) {
					t = t || window.event;
					var n = t.target || t.srcElement;
					return e.shout("shareLinkClick", t, n), !!n.href && (!!n.hasAttribute("download") || (window.open(n.href, "pswp_share", "scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=550,height=420,top=100,left=" + (window.screen ? Math.round(screen.width / 2 - 275) : 100)), C || O(), !1))
				},
				M = function() {
					for(var e, t, n, i, o, a = "", s = 0; s < g.shareButtons.length; s++) e = g.shareButtons[s], n = g.getImageURLForShare(e), i = g.getPageURLForShare(e), o = g.getTextForShare(e), t = e.url.replace("{{url}}", encodeURIComponent(i)).replace("{{image_url}}", encodeURIComponent(n)).replace("{{raw_image_url}}", n).replace("{{text}}", encodeURIComponent(o)), a += '<a href="' + t + '" target="_blank" class="pswp__share--' + e.id + '"' + (e.download ? "download" : "") + ">" + e.label + "</a>", g.parseShareButtonOut && (a = g.parseShareButtonOut(e, a));
					l.children[0].innerHTML = a, l.children[0].onclick = P
				},
				N = function(e) {
					for(var n = 0; n < g.closeElClasses.length; n++)
						if(t.hasClass(e, "pswp__" + g.closeElClasses[n])) return !0
				},
				A = 0,
				L = function() {
					clearTimeout(y),
						A = 0, d && w.setIdle(!1)
				},
				D = function(e) {
					e = e ? e : window.event;
					var t = e.relatedTarget || e.toElement;
					t && "HTML" !== t.nodeName || (clearTimeout(y), y = setTimeout(function() {
						w.setIdle(!0)
					}, g.timeToIdleOutside))
				},
				B = function() {
					g.fullscreenEl && !t.features.isOldAndroid && (n || (n = w.getFullscreenAPI()), n ? (t.bind(document, n.eventK, w.updateFullscreen), w.updateFullscreen(), t.addClass(e.template, "pswp--supports-fs")) : t.removeClass(e.template, "pswp--supports-fs"))
				},
				H = function() {
					g.preloaderEl && (R(!0), u("beforeChange", function() {
						clearTimeout(f), f = setTimeout(function() {
							e.currItem && e.currItem.loading ? (!e.allowProgressiveImg() || e.currItem.img && !e.currItem.img.naturalWidth) && R(!1) : R(!0)
						}, g.loadingIndicatorDelay)
					}), u("imageLoadComplete", function(t, n) {
						e.currItem === n && R(!0)
					}))
				},
				R = function(e) {
					h !== e && (E(p, "preloader--active", !e), h = e)
				},
				z = function(e) {
					var n = e.vGap;
					if($()) {
						var s = g.barsSize;
						if(g.captionEl && "auto" === s.bottom)
							if(a || (a = t.createEl("pswp__caption pswp__caption--fake"), a.appendChild(t.createEl("pswp__caption__center")), i.insertBefore(a, o), t.addClass(i, "pswp__ui--fit")), g.addCaptionHTMLFn(e, a, !0)) {
								var r = a.clientHeight;
								n.bottom = parseInt(r, 10) || 44
							} else n.bottom = s.top;
						else n.bottom = "auto" === s.bottom ? 0 : s.bottom;
						n.top = s.top
					} else n.top = n.bottom = 0
				},
				F = function() {
					g.timeToIdle && u("mouseUsed", function() {
						t.bind(document, "mousemove", L), t.bind(document, "mouseout", D), x = setInterval(function() {
							A++, 2 === A && w.setIdle(!0)
						}, g.timeToIdle / 2)
					})
				},
				U = function() {
					u("onVerticalDrag", function(e) {
						T && .95 > e ? w.hideControls() : !T && e >= .95 && w.showControls()
					});
					var e;
					u("onPinchClose", function(t) {
						T && .9 > t ? (w.hideControls(), e = !0) : e && !T && t > .9 && w.showControls()
					}), u("zoomGestureEnded", function() {
						e = !1, e && !T && w.showControls()
					})
				},
				W = [{
					name: "caption",
					option: "captionEl",
					onInit: function(e) {
						o = e
					}
				}, {
					name: "share-modal",
					option: "shareEl",
					onInit: function(e) {
						l = e
					},
					onTap: function() {
						O()
					}
				}, {
					name: "button--share",
					option: "shareEl",
					onInit: function(e) {
						r = e
					},
					onTap: function() {
						O()
					}
				}, {
					name: "button--zoom",
					option: "zoomEl",
					onTap: e.toggleDesktopZoom
				}, {
					name: "counter",
					option: "counterEl",
					onInit: function(e) {
						s = e
					}
				}, {
					name: "button--close",
					option: "closeEl",
					onTap: e.close
				}, {
					name: "button--arrow--left",
					option: "arrowEl",
					onTap: e.prev
				}, {
					name: "button--arrow--right",
					option: "arrowEl",
					onTap: e.next
				}, {
					name: "button--fs",
					option: "fullscreenEl",
					onTap: function() {
						n.isFullscreen() ? n.exit() : n.enter()
					}
				}, {
					name: "preloader",
					option: "preloaderEl",
					onInit: function(e) {
						p = e
					}
				}],
				q = function() {
					var e, n, o, a = function(i) {
						if(i)
							for(var a = i.length, s = 0; a > s; s++) {
								e = i[s], n = e.className;
								for(var r = 0; r < W.length; r++) o = W[r], n.indexOf("pswp__" + o.name) > -1 && (g[o.option] ? (t.removeClass(e, "pswp__element--disabled"), o.onInit && o.onInit(e)) : t.addClass(e, "pswp__element--disabled"))
							}
					};
					a(i.children);
					var s = t.getChildByClass(i, "pswp__top-bar");
					s && a(s.children)
				};
			w.init = function() {
				t.extend(e.options, k, !0), g = e.options, i = t.getChildByClass(e.scrollWrap, "pswp__ui"), u = e.listen, U(), u("beforeChange", w.update), u("doubleTap", function(t) {
					var n = e.currItem.initialZoomLevel;
					e.getZoomLevel() !== n ? e.zoomTo(n, t, 333) : e.zoomTo(g.getDoubleTapZoom(!1, e.currItem), t, 333)
				}), u("preventDragEvent", function(e, t, n) {
					var i = e.target || e.srcElement;
					i && i.getAttribute("class") && e.type.indexOf("mouse") > -1 && (i.getAttribute("class").indexOf("__caption") > 0 || /(SMALL|STRONG|EM)/i.test(i.tagName)) && (n.prevent = !1)
				}), u("bindEvents", function() {
					t.bind(i, "pswpTap click", S), t.bind(e.scrollWrap, "pswpTap", w.onGlobalTap), e.likelyTouchDevice || t.bind(e.scrollWrap, "mouseover", w.onMouseOver)
				}), u("unbindEvents", function() {
					C || O(), x && clearInterval(x), t.unbind(document, "mouseout", D), t.unbind(document, "mousemove", L), t.unbind(i, "pswpTap click", S), t.unbind(e.scrollWrap, "pswpTap", w.onGlobalTap), t.unbind(e.scrollWrap, "mouseover", w.onMouseOver), n && (t.unbind(document, n.eventK, w.updateFullscreen), n.isFullscreen() && (g.hideAnimationDuration = 0, n.exit()), n = null)
				}), u("destroy", function() {
					g.captionEl && (a && i.removeChild(a), t.removeClass(o, "pswp__caption--empty")), l && (l.children[0].onclick = null), t.removeClass(i, "pswp__ui--over-close"), t.addClass(i, "pswp__ui--hidden"), w.setIdle(!1)
				}), g.showAnimationDuration || t.removeClass(i, "pswp__ui--hidden"), u("initialZoomIn", function() {
					g.showAnimationDuration && t.removeClass(i, "pswp__ui--hidden")
				}), u("initialZoomOut", function() {
					t.addClass(i, "pswp__ui--hidden")
				}), u("parseVerticalMargin", z), q(), g.shareEl && r && l && (C = !0), j(), F(), B(), H()
			}, w.setIdle = function(e) {
				d = e, E(i, "ui--idle", e)
			}, w.update = function() {
				T && e.currItem ? (w.updateIndexIndicator(), g.captionEl && (g.addCaptionHTMLFn(e.currItem, o), E(o, "caption--empty", !e.currItem.title)), _ = !0) : _ = !1, C || O(), j()
			}, w.updateFullscreen = function(i) {
				i && setTimeout(function() {
					e.setScrollOffset(0, t.getScrollY())
				}, 50), t[(n.isFullscreen() ? "add" : "remove") + "Class"](e.template, "pswp--fs")
			}, w.updateIndexIndicator = function() {
				g.counterEl && (s.innerHTML = e.getCurrentIndex() + 1 + g.indexIndicatorSep + g.getNumItemsFn())
			}, w.onGlobalTap = function(n) {
				n = n || window.event;
				var i = n.target || n.srcElement;
				if(!v)
					if(n.detail && "mouse" === n.detail.pointerType) {
						if(N(i)) return void e.close();
						t.hasClass(i, "pswp__img") && (1 === e.getZoomLevel() && e.getZoomLevel() <= e.currItem.fitRatio ? g.clickToCloseNonZoomable && e.close() : e.toggleDesktopZoom(n.detail.releasePoint))
					} else if(g.tapToToggleControls && (T ? w.hideControls() : w.showControls()), g.tapToClose && (t.hasClass(i, "pswp__img") || N(i))) return void e.close()
			}, w.onMouseOver = function(e) {
				e = e || window.event;
				var t = e.target || e.srcElement;
				E(i, "ui--over-close", N(t))
			}, w.hideControls = function() {
				t.addClass(i, "pswp__ui--hidden"), T = !1
			}, w.showControls = function() {
				T = !0, _ || w.update(), t.removeClass(i, "pswp__ui--hidden")
			}, w.supportsFullscreen = function() {
				var e = document;
				return !!(e.exitFullscreen || e.mozCancelFullScreen || e.webkitExitFullscreen || e.msExitFullscreen)
			}, w.getFullscreenAPI = function() {
				var t, n = document.documentElement,
					i = "fullscreenchange";
				return n.requestFullscreen ? t = {
					enterK: "requestFullscreen",
					exitK: "exitFullscreen",
					elementK: "fullscreenElement",
					eventK: i
				} : n.mozRequestFullScreen ? t = {
					enterK: "mozRequestFullScreen",
					exitK: "mozCancelFullScreen",
					elementK: "mozFullScreenElement",
					eventK: "moz" + i
				} : n.webkitRequestFullscreen ? t = {
					enterK: "webkitRequestFullscreen",
					exitK: "webkitExitFullscreen",
					elementK: "webkitFullscreenElement",
					eventK: "webkit" + i
				} : n.msRequestFullscreen && (t = {
					enterK: "msRequestFullscreen",
					exitK: "msExitFullscreen",
					elementK: "msFullscreenElement",
					eventK: "MSFullscreenChange"
				}), t && (t.enter = function() {
					return c = g.closeOnScroll, g.closeOnScroll = !1, "webkitRequestFullscreen" !== this.enterK ? e.template[this.enterK]() : void e.template[this.enterK](Element.ALLOW_KEYBOARD_INPUT)
				}, t.exit = function() {
					return g.closeOnScroll = c, document[this.exitK]()
				}, t.isFullscreen = function() {
					return document[this.elementK]
				}), t
			}
		};
		return e
	}),
	function(e) {
		e.fn.lazyload = function(t) {
			var n = {
				threshold: 0,
				failurelimit: 0,
				event: "scroll",
				effect: "show",
				container: window
			};
			t && e.extend(n, t);
			var i = this;
			return "scroll" == n.event && e(n.container).bind("scroll", function(t) {
				var o = 0;
				i.each(function() {
					if(e.abovethetop(this, n) || e.leftofbegin(this, n));
					else if(e.belowthefold(this, n) || e.rightoffold(this, n)) {
						if(o++ > n.failurelimit) return !1
					} else e(this).trigger("appear")
				});
				var a = e.grep(i, function(e) {
					return !e.loaded
				});
				i = e(a)
			}), this.each(function() {
				var t = this;
				void 0 == e(t).attr("original") && e(t).attr("original", e(t).attr("src")), "scroll" != n.event || void 0 == e(t).attr("src") || n.placeholder == e(t).attr("src") || e.abovethetop(t, n) || e.leftofbegin(t, n) || e.belowthefold(t, n) || e.rightoffold(t, n) ? (n.placeholder ? e(t).attr("src", n.placeholder) : e(t).removeAttr("src"), t.loaded = !1) : t.loaded = !0, e(t).one("appear", function() {
					this.loaded || e("<img />").bind("load", function() {
						e(t).hide().attr("src", e(t).attr("original"))[n.effect](n.effectspeed), t.loaded = !0
					}).attr("src", e(t).attr("original"))
				}), "scroll" != n.event && e(t).bind(n.event, function(n) {
					t.loaded || e(t).trigger("appear")
				})
			}), e(n.container).trigger(n.event), this
		}, e.belowthefold = function(t, n) {
			if(void 0 === n.container || n.container === window) var i = e(window).height() + e(window).scrollTop();
			else var i = e(n.container).offset().top + e(n.container).height();
			return i <= e(t).offset().top - n.threshold
		}, e.rightoffold = function(t, n) {
			if(void 0 === n.container || n.container === window) var i = e(window).width() + e(window).scrollLeft();
			else var i = e(n.container).offset().left + e(n.container).width();
			return i <= e(t).offset().left - n.threshold
		}, e.abovethetop = function(t, n) {
			if(void 0 === n.container || n.container === window) var i = e(window).scrollTop();
			else var i = e(n.container).offset().top;
			return i >= e(t).offset().top + n.threshold + e(t).height()
		}, e.leftofbegin = function(t, n) {
			if(void 0 === n.container || n.container === window) var i = e(window).scrollLeft();
			else var i = e(n.container).offset().left;
			return i >= e(t).offset().left + n.threshold + e(t).width()
		}, e.extend(e.expr[":"], {
			"below-the-fold": "$.belowthefold(a, {threshold : 0, container: window})",
			"above-the-fold": "!$.belowthefold(a, {threshold : 0, container: window})",
			"right-of-fold": "$.rightoffold(a, {threshold : 0, container: window})",
			"left-of-fold": "!$.rightoffold(a, {threshold : 0, container: window})"
		})
	}(jQuery),
	function($, undefined) {
		function init() {
			clearAllTextInput(), closeDialog(), chouti.clickClear(), changeTab(), $("#pub-btn1").click(function() {
				checkIsHuaTi(), publish()
			}), $("#pub-btn0").click(function() {
				checkIsHuaTi(), zixunPublish()
			}), $("#pub-btn2").click(function() {
				if(checkIsHuaTi(), uploadImgSucess) return imgPublish(), !0;
				var e = $.trim($(txtInputNum[kind]).val());
				return "" != e ? ($("#write-error-box" + kind + " .write-error-desc").html("请先添加图片，再点击发布").show(), !1) : void 0
			}), $("#add-pub-btn0").click(function() {
				is_link_clean = !1, addLink()
			}), $("#txt-zixun").keydown(function(e) {
				13 == e.keyCode && $("#add-pub-btn0").click()
			}), listenZixunPblicButton(), $("#to-btn-zixun, #to-btn-duanzi, #to-btn-duanzi2, #to-btn-yaoyan, #to-btn-pic, #to-btn-pic2, #to-btn-ask, #to-btn-ask2, #to-btn-ask3").click(function() {
				$(this).addClass("toclass-btn-valid").removeClass("toclass-btn-unvalid"), $(this).siblings(":not(.un1024,.unfavor)").addClass("toclass-btn-unvalid"), $(this).siblings(":not(.un1024,.unfavor)").removeClass("toclass-btn-valid"), $(".unfavor, .un1024").removeClass("toclass-btn-unfavor-valid").addClass("toclass-btn-unfavor-unvalid");
				var e = parseInt($(this).attr("lang"));
				classType = e
			}), $(".unfavor").click(function() {
				$(this).addClass("toclass-btn-unfavor-valid").removeClass("toclass-btn-unfavor-unvalid"), $(this).siblings(":not(.un1024,.unfavor)").addClass("toclass-btn-unvalid"), $(this).siblings(":not(.un1024,.unfavor)").removeClass("toclass-btn-valid"), $(".un1024").removeClass("toclass-btn-unfavor-valid").addClass("toclass-btn-unfavor-unvalid");
				var e = parseInt($(this).attr("lang"));
				classType = e
			}), $(".un1024").click(function() {
				$(this).addClass("toclass-btn-unfavor-valid").removeClass("toclass-btn-unfavor-unvalid"), $(this).siblings().not(".unfavor,.un1024").addClass("toclass-btn-unvalid"), $(this).siblings().not(".unfavor,.un1024").removeClass("toclass-btn-valid"), $(".unfavor").removeClass("toclass-btn-unfavor-valid").addClass("toclass-btn-unfavor-unvalid");
				var e = parseInt($(this).attr("lang"));
				classType = e
			});
			var e = $("#txt-zixun, #txt-zixun-content, #txt-zhaiyao, #txt-duanzi, #txt-img, #link-zixun-content");
			e.focus(function() {
				$(this).css("border", "1px solid #99ccff")
			}), e.blur(function() {
				$(this).css("border", "1px solid #CCDCEF")
			}), $("#clear-btn-link").bind("click", aclearLink), $("#clear-btn-wanzi").bind("click", aclearWenzi), $("#clear-btn-pic").bind("click", aclearPic)
		}

		function checkIsHuaTi() {
			var e = $("#hidHtTag").val();
			"huati" == e ? (isHtPub = !0, topicId = $("#hidHtTag").attr("topicId")) : isHtPub = !1
		}

		function aclearWenzi() {
			ispublishing || ($("#pubTabDuanzi").click(), $("#write-error-box1 .write-error-desc").html(""))
		}

		function aclearLink() {
			ispublishing || ($("#pubTabZixun").click(), $("#txt-zixun").focus().val(""), is_link_clean = !0)
		}

		function aclearPic() {
			ispublishing || ($("#pubTabPic").click(), $("#repeat-upload-btn").click(), is_pic_clean = !0)
		}

		function changeTab() {
			$("#pubTabZixun").click(function() {
				clearAllTextInput(), $(this).addClass("w-active color").siblings().removeClass("w-active color");
				var e = $("#tabs a").index(this);
				$("#dialog-main-content").children().eq(e).show().siblings().hide(), kind = 0, classType = 1, is_link_clean = !0, ispublishing = !1, $("#txt-zixun").focus().val(" ").val(""), listenButton(kind);
				var t = $("#publishBtn").attr("lang");
				chouti.showOrHidePubtoBox(t), $("#to-btn-duanzi2").addClass("toclass-btn-valid").removeClass("toclass-btn-unvalid")
			}), $("#pubTabDuanzi").click(function() {
				$(this).addClass("w-active color").siblings().removeClass("w-active color");
				var e = $("#tabs a").index(this);
				$("#dialog-main-content").children().eq(e).show().siblings().hide(), kind = 1, classType = 2, ispublishing = !1, $("#txt-duanzi").focus().val(" ").val(""), listenButton(kind);
				var t = $("#publishBtn").attr("lang");
				chouti.showOrHidePubtoBox(t), $("#to-btn-duanzi2").addClass("toclass-btn-valid").removeClass("toclass-btn-unvalid")
			}), $("#pubTabPic").click(function() {
				clearAllTextInput(), $(this).addClass("w-active color").siblings().removeClass("w-active color");
				var e = $("#tabs a").index(this);
				$("#dialog-main-content").children().eq(e).show().siblings().hide(), kind = 2, classType = 4, is_pic_clean = !0, ispublishing = !1, $("#txt-img").focus().val(" ").val("");
				var t = $("#publishBtn").attr("lang");
				chouti.showOrHidePubtoBox(t), uploadImg(), listenButton(kind), repeatUploadImg(), $("#to-btn-pic2").addClass("toclass-btn-valid").removeClass("toclass-btn-unvalid")
			})
		}

		function uploadImg() {
			$("#add-pub-btn2").click(function() {
				is_pic_clean = !1, identifie = (new Date).getTime(), $("#timeHidden").val(identifie), $("#upload-img").attr({
					origin: ""
				}), $("#upload-img").attr("src", ""), $("#imgUrl").val(""), $("#imgUrl").unbind().change(function() {
					var e = $(this).val(),
						t = e.substring(e.lastIndexOf(".") + 1);
					t = t.toLowerCase();
					var n = "#write-error-box" + kind + " .write-error-desc";
					if(this.files && this.files[0]) {
						var i = this.files[0].size;
						if(i >= 10485760) return void $(n).html("您上传的图片大小超出限制，请重新上传小于10m的图片").show();
						$(n).hide()
					}
					return "jpg" != t && "jpeg" != t && "gif" != t && "png" != t ? void $(n).html("您上传的图片格式不合法，请重新上传").show() : ($(n).hide(), $("#add-pub-btn" + kind).hide(), $("#add-pub-loading" + kind).css("display", "block"), $(".imgRule").hide(), window.setTimeout(function() {
						IframeEvent(), $("#uploadPicFrm").submit()
					}, 1), void $("#txt-img").focus())
				})
			})
		}

		function IframeEvent() {
			window.attachEvent ? document.getElementById("uploadIframe").attachEvent("onload", uploadCallback) : document.getElementById("uploadIframe").addEventListener("load", uploadCallback, !1)
		}

		function uploadCallback() {
			var e = document.getElementById("uploadIframe");
			e.contentWindow ? responseData = e.contentWindow.document.body ? e.contentWindow.document.body.innerHTML : null : e.contentDocument && (responseData = e.contentDocument.document.body ? e.contentDocument.document.body.innerHTML : null), DataProssesing(responseData)
		}

		function DataProssesing(responseData) {
			var d1 = responseData.indexOf("{"),
				d2 = responseData.lastIndexOf("}"),
				values = responseData.substring(d1, d2 + 1);
			values = eval("(" + values + ")");
			var code = values.result.code;
			if(code == ResultCodeSuccess) values.result.data.identifie != identifie || is_pic_clean || ($("#img-alt-title").html("预览图片"), $("#upload-img-area").hide(), $("#show-img-area").show(), $("#upload-img").attr({
				origin: values.result.data.imgUrl
			}), $("#upload-img").attr({
				src: replaceHttps(values.result.data.imgUrl)
			}), uploadImgSucess = !0);
			else {
				$("#img-alt-title").html("添加图片"), $(".imgRule").show(), $("#upload-img-area").show(), $("#show-img-area").hide(), uploadImgSucess = !1;
				var tempError = values.result.message,
					errbox = "#write-error-box" + kind + " .write-error-desc";
				$(errbox).html(tempError).show(), $("#add-pub-btn" + kind).show(), $("#add-pub-loading" + kind).css("display", "none")
			}
			return $("#add-pub-btn" + kind).show(), $("#add-pub-loading" + kind).css("display", "none"), !1
		}

		function repeatUploadImg() {
			$("#repeat-upload-btn").click(function() {
				$("#upload-img-area").show(), $("#show-img-area").hide(), $("#img-alt-title").html("添加图片"), $(".imgRule").show(), $("#upload-img").attr({
					origin: ""
				}), $("#upload-img").attr("src", ""), $("#add-pub-btn2").addClass("add-pub-btn-valid").css("display", "inline-block"), $("#add-pub-loading2").hide(), uploadImgSucess = !1, is_pic_clean = !1, $("#write-error-box" + kind + " .write-error-desc").html("").hide()
			})
		}

		function imgPublish() {
			ispublishing = !0;
			var e = $.trim($(txtInputNum[kind]).val());
			if("" != e) {
				var t = $("#dialog-buttonpane" + kind + " .write-error");
				if(chouti.flashErrorTip(t)) {
					$("#pub-btn" + kind).hide(), $("#pub-loading" + kind).css("display", "inline-block"), $(txtInputNum[kind]).attr("disabled", !0).css("background-color", "#ece9d8");
					var n = 0,
						i = $("#upload-img").attr("origin"),
						o = "/link/create";
					if(isHtPub) var a = G.param({
						subjectId: classType,
						title: submitTxtContent,
						yellow: n,
						imgUrl: i,
						tabType: kind,
						topicId: topicId
					});
					else var a = G.param({
						subjectId: classType,
						title: submitTxtContent,
						yellow: n,
						imgUrl: i,
						tabType: kind
					});
					L.ajax({
						url: o,
						type: "POST",
						data: a,
						success: function(e) {
							if(e.code != ResultCodeSuccess) {
								var t = e.message;
								return $("#write-error-box" + kind + " .write-error-desc").html(t).show(), $(txtInputNum[kind]).attr("disabled", !1).css("background-color", "#fff"), $("#pub-btn" + kind).show(), $("#pub-loading" + kind).css("display", "none"), ispublishing = !1, !1
							}
							isHtPub ? goHtPage() : ($(".dialog").hide(), $(txtInputNum[kind]).attr("disabled", !1).css("background-color", "#fff"), $(txtInputNum[kind]).val(""), $("#pub-btn" + kind).show(), $("#pub-loading" + kind).css("display", "none"), L.showTopTips(L.TIPS_TYPE.success, e.message), redirectCommentPage(e.data.linkId), L.showTopTips(L.TIPS_TYPE.success, e.message))
						}
					})
				}
			}
		}

		function zixunPublish() {
			ispublishing = !0;
			var e = $.trim($("#txt-zixun-content").val());
			if("" != e || !$("#pub-btn0").hasClass("new-pub-btn-unvalid")) {
				var t = $("#dialog-buttonpane" + kind + " .write-error");
				if(chouti.flashErrorTip(t)) {
					$("#pub-btn" + kind).hide(), $("#pub-loading" + kind).css("display", "inline-block"), $(txtInputNum[kind]).attr("disabled", !0).css("background-color", "#ece9d8");
					var n = $("#txt-zixun").val(),
						i = $("#txt-zixun-content").val(),
						o = $("#txt-zhaiyao").val(),
						a = "/link/create";
					if(isHtPub) var s = G.param({
						subjectId: classType,
						title: i,
						url: n,
						content: o,
						tabType: kind,
						topicId: topicId
					});
					else var s = G.param({
						subjectId: classType,
						title: i,
						url: n,
						content: o,
						tabType: kind
					});
					L.ajax({
						url: a,
						type: "POST",
						data: s,
						success: function(e) {
							if(e.code != ResultCodeSuccess) {
								var t = e.message;
								return $("#write-error-box" + kind + " .write-error-desc").html(t).show(), $(txtInputNum[kind]).attr("disabled", !1).css("background-color", "#fff"), $("#pub-btn" + kind).show(), $("#pub-loading" + kind).css("display", "none"), void(ispublishing = !1)
							}
							isHtPub ? goHtPage() : ($(".dialog").hide(), L.showTopTips(L.TIPS_TYPE.success, e.message), redirectCommentPage(e.data.linkId))
						}
					})
				}
			}
		}

		function addLink() {
			var e = $.trim($(txtInputNum[kind]).val());
			if("" != e) {
				$("#add-pub-loading" + kind).css("display", "block"), $("#add-pub-btn0").css("display", "none"), $(txtInputNum[kind]).attr("disabled", "disabled").css({
					"background-color": "#ece9d8",
					border: "1px solid #CCDCEF"
				}), $("#url").val($("#txt-zixun").val());
				var t = "/link/catch/title";
				L.ajax({
					url: t,
					type: "POST",
					data: G.param({
						url: submitTxtContent
					}),
					error: function(e, t) {
						if(t = t.toLowerCase(), "timeout" === t && !is_link_clean) return $(txtInputNum[kind]).attr("disabled", !1).css({
							"background-color": "#fff",
							color: "#333"
						}), $("#add-pub-btn0").css("display", "block"), $("#add-pub-loading" + kind).css("display", "none"), L.showTopTips(L.TIPS_TYPE.error, i18n.common.httpError[6]), void e.abort()
					},
					success: function(e) {
						if(e.code != ResultCodeSuccess || is_link_clean) {
							var t = e.message;
							return "30009" == e.code && (L.showTopTips(L.TIPS_TYPE.success, e.message), window.setTimeout(function() {
								redirectCommentPage(e.data.linkId)
							}, 800)), $(txtInputNum[kind]).attr("disabled", !1).css({
								"background-color": "#fff",
								color: "#333"
							}), $("#add-pub-btn0").css("display", "block"), $("#add-pub-loading" + kind).css("display", "none"), void $("#write-error-box0 .write-error-desc").show().html(t)
						}
						$("#add-pub-loading" + kind).css("display", "none");
						var n = e.data.title;
						if(n) var i = n;
						else var i = "";
						var o = e.data.summary;
						if(o) var a = o;
						else var a = "";
						$(txtInputNum[kind]).attr("disabled", !0).css({
							"background-color": "#ece9d8",
							color: "#ccc",
							border: "1px solid #CCDCEF"
						}), $("#zixun-button-container").hide(), $("#txt-zixun").css("width", "523px"), $("#txt-zixun-area").css("width", "530px"), $("#zixun-big-area").show(), listenZixunPblicButton(), $("#txt-zixun-content").val(i).attr("disabled", !1).css({
							"background-color": "#fff"
						}), $("#txt-zhaiyao").val(a).attr("disabled", !1).css({
							"background-color": "#fff"
						}), $("#pub-btn0").addClass("new-pub-btn-valid").removeClass("new-pub-btn-unvalid")
					}
				})
			}
		}

		function redirectCommentPage(e) {
			var t = window.location.host;
			t = location.protocol + "//" + t + "/link/" + e;
			var n = navigator.userAgent;
			if(n.indexOf("IE") >= 0) {
				var i = document.createElement("a");
				i.href = t, document.body.appendChild(i), i.click()
			} else window.location.href = t
		}

		function selectZixunImg(e, t) {
			$("#zixun-sel-img .inline-img").click(function() {
				imgurlSelect = "";
				var e = $(this).children(".sel-icon");
				e.show().parent().siblings().children(".sel-icon").hide(), imgurlSelect = $(this).find("img").attr("src")
			}), t > 1 ? $("#zixun-sel-img .inline-img").eq(1).children(".sel-icon").show() : $("#zixun-sel-img .inline-img").eq(0).children(".sel-icon").show(), imgurlSelect = e
		}

		function publish() {
			ispublishing = !0;
			var e = $.trim($(txtInputNum[kind]).val());
			if("" != e) {
				var t = $("#dialog-buttonpane" + kind + " .write-error");
				if(chouti.flashErrorTip(t)) {
					$("#pub-btn" + kind).hide(), $("#pub-loading" + kind).css("display", "inline-block"), $(txtInputNum[kind]).attr("disabled", !0).css("background-color", "#ece9d8");
					var n = "/link/create";
					if(isHtPub) var i = G.param({
						subjectId: classType,
						title: submitTxtContent,
						tabType: kind,
						topicId: topicId
					});
					else var i = G.param({
						subjectId: classType,
						title: submitTxtContent,
						tabType: kind
					});
					L.ajax({
						url: n,
						type: "POST",
						data: i,
						success: function(e) {
							return e.code != ResultCodeSuccess ? ($("#write-error-box" + kind + " .write-error-desc").html(e.message).show(), $("#pub-btn" + kind).show(), $("#pub-loading" + kind).css("display", "none"), $(txtInputNum[kind]).attr("disabled", !1).css("background-color", "#fff"), ispublishing = !1, !1) : void(isHtPub ? goHtPage() : ($(".dialog").hide(), L.showTopTips(L.TIPS_TYPE.success, e.message), redirectCommentPage(e.data.linkId)))
						}
					})
				}
			}
		}

		function clearBeforeNull(e) {
			var t = /^(\s+)|(\s+)$/,
				n = e;
			return n = n.replace(t, ""), n = n.replace(t, "")
		}

		function clearMidNull(e) {
			var t = /\s+/g,
				n = e.replace(t, " ");
			return n
		}

		function listenZixunPblicButton() {
			$.input("txt-zixun-content", inputStateZixunContent)
		}

		function listenButton(e) {
			switch(setButtonDisabled(e), $("#showLength" + e).html(sumWriteLength), e) {
				case 0:
					obj = "#txt-zixun", $.input("txt-zixun", inputState);
					break;
				case 1:
					obj = "#txt-duanzi", $.input("txt-duanzi", inputState);
					break;
				case 2:
					obj = "#txt-img", $.input("txt-img", inputState)
			}
		}

		function inputStateZixunContent() {
			var e = kind,
				t = $("#txt-zixun-content").val();
			return "" == $.trim(t) ? (setButtonDisabled(e), void $("#showLength" + e).html(sumWriteLength)) : (setButtonAbled(e), void countDuanziLength(t, e))
		}

		function inputState() {
			var e = kind,
				t = $(obj).val();
			if("" == $.trim(t)) return setButtonDisabled(e), void $("#showLength" + e).html(sumWriteLength);
			switch(setButtonAbled(e), e) {
				case 0:
					countZixunLength(t, e);
					break;
				case 1:
					countDuanziLength(t, e);
					break;
				case 2:
					countDuanziLength(t, e);
					break;
				case 3:
					countDuanziLength(t, e)
			}
		}

		function checkCharCodeAt(e, t) {
			e = e.split("");
			for(var n = "", i = 0; i < e.length; i++)
				if(e[i].charCodeAt(0) > 65280) {
					var o = String.fromCharCode(e[i].charCodeAt(0) - 65248);
					n += o
				} else n += e[i];
			return n
		}

		function countZixunLength(e, t) {
			var e = clearBeforeNull(e);
			e = clearMidNull(e);
			for(var n = 0, i = 0; i < e.length; i++) {
				var o = e.charCodeAt(i);
				o >= 1 && o <= 126 || 65376 <= o && o <= 65439 ? n++ : n += 2
			}
			var a = parseInt(n / 2),
				s = n % 2;
			0 != s && (a += 1), submitTxtContent = e;
			var r = sumZixunLength - a;
			r < 0 ? $("#write-error-box0 .write-error-desc").html("您输入的链接过长，请重新输入").show() : $("#write-error-box0 .write-error-desc").hide()
		}

		function countDuanziLength(e, t) {
			var e = clearBeforeNull(e);
			e = clearMidNull(e);
			for(var n = 0, i = 0; i < e.length; i++) {
				var o = e.charCodeAt(i);
				o >= 1 && o <= 126 || 65376 <= o && o <= 65439 ? n++ : n += 2
			}
			var a = parseInt(n / 2),
				s = n % 2;
			0 != s && (a += 1), submitTxtContent = e;
			var r = sumWriteLength - a;
			$("#showLength" + t).html(r), r < 0 ? ($("#moreLength" + t).html(-r), $("#dialog-buttonpane" + kind + " .write-error").show(), $("#showLength" + t).html(0), $("#dialog-buttonpane" + kind + " .write-length").hide()) : ($("#dialog-buttonpane" + kind + " .write-error").hide(), $("#dialog-buttonpane" + kind + " .write-length").show())
		}

		function setButtonAbled(e) {
			$("#pub-btn" + e).addClass("new-pub-btn-valid").removeClass("new-pub-btn-unvalid"), "" == $.trim($("#txt-zixun-content").val()) && $("#pub-btn0").addClass("new-pub-btn-unvalid").removeClass("new-pub-btn-valid"), 0 == kind && $("#add-pub-btn" + e).addClass("pub-btn-valid").removeClass("pub-btn-unvalid")
		}

		function setButtonDisabled(e) {
			$("#pub-btn" + e).addClass("new-pub-btn-unvalid").removeClass("new-pub-btn-valid"), "" != $.trim($("#txt-zixun-content").val()) && $("#pub-btn0").addClass("new-pub-btn-valid").removeClass("new-pub-btn-unvalid"), 0 == kind && $("#add-pub-btn" + e).addClass("pub-btn-unvalid").removeClass("pub-btn-valid")
		}

		function closeDialog() {
			$("#dialog-btn-close").click(function() {
				$("#digg-dialog-publish").hide(), $("#mask").hide().remove(), $("#chatIframe").css({
					height: "475px",
					width: "300px"
				}), is_pic_clean = !0, is_link_clean = !0, ispublishing = !1
			})
		}

		function clearAllTextInput() {
			$("#txt-duanzi").val("").attr("disabled", !1).css("background-color", "#fff"), $("#lab-duanzi").show(), $("#txt-zixun").val("").attr("disabled", !1).css({
				"background-color": "#fff",
				color: "#333"
			}), $("#txt-zixun-content").val("").attr("disabled", !0).css("background-color", "#ece9d8"), $("#txt-zhaiyao").val("").attr("disabled", !0).css("background-color", "#ece9d8"), $("#zixun-button-container").show(), $("#add-pub-btn0").show().removeClass("pub-btn-valid").addClass("pub-btn-unvalid"), $("#pub-btn0, #pub-btn1, #pub-btn2, #pub-btn3").show().removeClass("new-pub-btn-valid").addClass("new-pub-btn-unvalid"), $("#add-pub-loading0").hide(), $("#txt-zixun").css("width", "420px"), $("#txt-zixun-area").css("width", "426px"), $("#lab-zixun").show(), $("#txt-img").val("").attr("disabled", !1).css("background-color", "#fff"), $("#lab-img").show(), $("#upload-img-area").show(), $("#upload-img-area .imgRule").show(), $("#show-img-area").hide(), $("#show-img-area #upload-img").attr("src", ""), $("#repeat-upload-btn").click(), $("#add-pub-loading2").hide();
			for(var e = 0; e < 4; e++) $("#write-error-box" + e + " .write-error-desc").html(""), $(".write-length #showLength" + e).html(sumWriteLength);
			$(".write-error").hide(), $(".write-length").show(), sumWriteLength = 150, sumZixunLength = 512, kind = 0, submitTxtContent = "", obj = "", imgurlSelect = "", uploadImgSucess = !1, is_pic_clean = !0, is_link_clean = !0, ispublishing = !1
		}

		function goHtPage(e, t) {
			L.showTopTips(L.TIPS_TYPE.success, "发布成功"), $(".dialog").hide(), $(txtInputNum[kind]).attr("disabled", !1).css("background-color", "#fff"), $(txtInputNum[kind]).val(""), $("#pub-btn" + kind).show(), $("#pub-loading" + kind).css("display", "none"), $("#mask").hide().remove()
		}
		var G = $.gozap,
			L = G.labi,
			i18n = L.i18n,
			i18nNotice = i18n.notice,
			ResultCodeSuccess = L.RESULT_CODE.success,
			sumWriteLength = 150,
			sumZixunLength = 512,
			kind = 0,
			classType = 1,
			is_pic_clean = !1,
			is_link_clean = !1,
			submitTxtContent = "",
			obj = "",
			ispublishing = !1,
			imgurlSelect = "",
			identifie = "",
			uploadImgSucess = !1,
			isHtPub = !1,
			topicId = 0,
			txtInputNum = {
				0: "#txt-zixun",
				1: "#txt-duanzi",
				2: "#txt-img"
			};
		$.extend({
			input: function(e, t) {
				var n = document.getElementById(e);
				null != n && n.addEventListener("input", t, !1)
			}
		}), NS_publish_dialog = {
			init: init,
			clearAllTextInput: clearAllTextInput
		}
	}(jQuery),
	function(e) {
		function t(t) {
			n(), e("body").click(function(t) {
				0 != e(t.target).parents(".main-content").length || e(t.target).hasClass("main-content") || e(t.target).hasClass("big-img") || "gotop" == e(t.target).attr("id") || e(".comment-box-area").hide()
			}), e(".discus-a").click(function() {
				E = e(this);
				var t = e(this).attr("lang");
				chouti.hidePlayVido(t);
				var n = e("#comment-box-area-" + t);
				if(!n.is(":hidden")) return void n.hide();
				n.show().find("#loading-comment-top-" + t).css({
					display: "inline"
				}), e("#comment-box-top-" + t).hide(), e("#yaoyan-sel-area-" + t).hide(), e("#huifu-top-box-" + t).hide(), e("#comment-list-top-" + t).html(""), e("#write-error-desc-" + t).hide(), e("#hidden-comt-" + t).hide();
				var i = e(this).position().left + 5;
				e("#comt-arrow-" + t).css("left", i + "px"), a(t, "")
			}), e(".txt-huifu-top").focus(function() {
				e(this).css({
					border: "1px solid #ffc875",
					height: "40px",
					resize: "vertical"
				});
				var t = e(this).attr("lang"),
					n = e("#lab-comment-top-" + t);
				n.is(":hidden") && e(this).css("text-indent", "0px")
			}).blur(function() {
				e(this).css({
					border: "1px solid #CCDCEF"
				})
			}).keydown(function(t) {
				chouti.checkLogin();
				var n = e(this).attr("lang"),
					i = e(this).data("parentid"),
					o = e("#lab-comment-top-" + n);
				t.ctrlKey && 13 == t.keyCode && ("" == i ? m(n, "comment", "") : m(n, "huifu", i));
				var a = e(this).cursorPosition();
				8 == t.keyCode && o.is(":visible") && a < 1 && ($ = !1, o.hide(), e(this).css("text-indent", "0px"), j.indexOf("MSIE") > 0 && (e(this).blur(), e(this).focus()), e(this).data("parentid", ""), e("#pub-btn-top-" + n).unbind().bind("click", function() {
					m(n, "comment", "")
				}))
			}), e(".hiddenCom-Btn, .close-comt").click(function() {
				var t = e(this).attr("lang");
				e("#comment-box-area-" + t).hide()
			}), e(".yaoyan-sel-area :radio").click(function() {
				var t = e(this).attr("lang");
				e("#txt-huifu-top-" + t).attr("disabled", !1).css("background-color", "#fff").focus()
			})
		}

		function n() {
			for(var t = e("#content-list .item"), n = 0; n < t.length; n++)
				if(e(t[n]).find(".news-pic").length > 0) {
					var i = e(t[n]).find(".part1").outerHeight(),
						o = e(t[n]).find(".part2").outerHeight(),
						a = e(t[n]).find(".area-summary").outerHeight(),
						s = i + o + a;
					s < 64 && e(t[n]).find(".part2").css({
						"padding-top": 64 - s + "px"
					})
				}
		}

		function i(t, n) {
			var i = e.trim(e("#" + t).val());
			return "" == i ? void v(n) : void b(n)
		}

		function o(e) {
			e = e.split("");
			for(var t = "", n = 0; n < e.length; n++) t += 32 == e[n].charCodeAt(0) ? " " : e[n];
			return t
		}

		function a(t, n) {
			var o = "score",
				a = "/comments";
			try {
				y.ajax({
					url: a,
					type: "POST",
					data: x.param({
						linkId: t,
						sortType: o,
						id: 0
					}),
					dataFilter: function(e, t) {
						return e.replace(/[\t\n\r]+/g, "")
					},
					success: function(o) {
						if(o.code != _) return y.showTopTips(y.TIPS_TYPE.error, o.message), e("#loading-comment-top-" + t).hide(), !1;
						var a = parseInt(o.data.items),
							s = (parseInt(o.data.remain), o.data.noComments);
						e("#discus-a-" + t).find("b").html(a), e("#newestCount-" + t).html(a), a >= 1 && r(o, t);
						var l = e("#lab-comment-top-" + t);
						l.hide(), e("#loading-comment-top-" + t).hide().siblings().show(), e("#pub-btn-top-" + t).unbind().bind("click", function() {
							m(t, "comment", "")
						}), v(t), e("#write-error-desc-" + t).hide(), e("#txt-huifu-top-" + t).data("parentid", "").css({
							"text-indent": "0px",
							height: "20px",
							resize: "none"
						}), "huifu" == n && j.indexOf("AppleWebKit") < 0 && e("#txt-huifu-top-" + t).focus(), e("#txt-huifu-top-" + t).val(" ").val(""), "huifu" == n && j.indexOf("AppleWebKit") >= 0 && e("#txt-huifu-top-" + t).focus(), e("#hidden-comt-" + t).show(), e.inputComment("txt-huifu-top-" + t, t, i), g(), chouti.oprateJuBao();
						var c = e("#coloseComment" + t);
						if(s) {
							var d = "<div class='coloseComment' id='coloseComment" + t + "'>此评论已关闭</div>";
							c.length > 0 ? c.show() : e("#huifu-top-box-" + t).after(d), e("#huifu-top-box-" + t).hide()
						} else e("#huifu-top-box-" + t).show(), c.hide()
					}
				})
			} catch(s) {
				console.log(s)
			}
		}

		function s(e) {
			return e && e.indexOf("https") < 0 ? e.indexOf("http") < 0 ? e : e.split("http:")[1] : e
		}

		function r(t, n) {
			for(var i = "", o = t.data.noComments, a = t.data.dataList, r = e("#hidjid").val(), c = 0; c < a.length; c++) {
				var h = a[c].action;
				k = "", C = "", S = 1, i += "<li class='items'>";
				var f = a[c].commentTime,
					m = a[c].content,
					g = a[c].depth,
					v = a[c].downs,
					b = a[c].ups,
					x = s(a[c].nickImgUrl),
					y = a[c].nick,
					w = a[c].isVote,
					_ = a[c].id,
					r = a[c].jid,
					T = a[c].assentText,
					$ = a[c].deleteInfo,
					E = a[c].sourceType,
					j = a[c].sourceAppUrl,
					I = e("#hidjid").val();
				i += "<span class='folder' >", i += "<div class='comment-L comment-L-top'>", i += "<a href='#' class='icons zhan-ico'></a>", i += "<a href='/user/" + r + "/submitted/1'><img src='" + x + "' /></a>", i += "</div>", i += "<div class='comment-R comment-R-top'>", i += "<div class='pp'>", i += "<a class='name' href='/user/" + r + "/submitted/1'>" + y + "</a>";
				var O = e("#collect-a-" + n).attr("jid");
				if(O == r && (i += "<span class='author'>(楼主)</span>"), i += "<span class='p3'>", i += 2 != h ? m : "<em style='font-style:oblique;color:#B4B4B4'>该评论因  ''" + $ + "'' 被删除</em>", i += "</span>", i += "<span class='into-time into-time-top'>" + f + "发布</span>", "相信" == T ? i += "<span class='yaoyan-state-top'>" + T + "</span>" : "" != T && (i += "<span class='yaoyan-state-top' style='color:#CC3300'>" + T + "</span>"), void 0 != E) {
					switch(E) {
						case 1:
							j = "/download/model/iphone";
							break;
						case 3:
							j = "/download/model/wphone";
							break;
						case 5:
							j = "/download/model/iphone";
							break;
						case 6:
							j = "/download/model/iphone"
					}
					i += "<span class='into-time s-phone'>来自<a class='phone-name' href='" + j + "' target='_blank'>" + sourcePhone[E] + "</a></span>";
				}
				i += "</div>", 2 == h || o || (i += "<div class='comment-line-top'>", i += "<div class='comment-state'>", i += "0" == w ? "<a class='ding' lang='" + n + "' href='javascript:;'><b>顶</b><span class='ding-num'>[" + b + "]</span></a><a class='cai' lang='" + n + "' href='javascript:;'><b>踩</b><span class='cai-num'>[" + v + "]</span></a>" : 1 == w ? "<span class='ding' href='javascript:;'><b>已顶</b><span class='ding-num'>[" + b + "]</span></span><span class='cai' lang='" + n + "' href='javascript:;'><b>踩</b><span class='cai-num'>[" + v + "]</span></span>" : "<span class='ding' lang='" + n + "' href='javascript:;'><b>顶</b><span class='ding-num'>[" + b + "]</span></span><span class='cai' href='javascript:;'><b>已踩</b><span class='cai-num'>[" + v + "]</span></span>", I != r && (i += "<span class='line-huifu'>|</span>", i += "<a class='see-a jubao' href='javascript:;' lang='" + _ + "'  linkid='" + n + "'>举报</a>"), e(".isCateAdmin").length > 0 && (i += "<span class='line-huifu'>|</span>", i += "<a class='see-a btn-delete-comment' lang='" + _ + "'  linkid='" + n + "' style='cursor:pointer;'>删除</a>"), g < 6 && 2 != h && (i += "<span class='line-huifu'>|</span>", i += "<a class='see-a huifu-a' href='javascript:;' id='huifuBtn" + _ + "' lang='" + _ + "' usernick='" + y + "'  linkid='" + n + "'>回复</a>"), i += "<input type='hidden' id='hid" + _ + "' value='" + _ + "' />", i += "</div>", i += "</div>"), i += "</div>", i += "</span>", a[c].childs && p(a[c].childs, n, o), i += k, i += "</li>"
			}
			e("#comment-list-top-" + n).html(i).treeview(), u(n), l(), d()
		}

		function l() {
			e(".huifu-a").unbind().bind("click", function() {
				$ = !0;
				var t = e(this).attr("lang"),
					n = e(this).attr("usernick"),
					i = e(this).attr("linkid"),
					o = e("#lab-comment-top-" + i);
				o.show().find("span").html(n);
				o.width();
				j.indexOf("AppleWebKit") > 0 ? e("#txt-huifu-top-" + i).data("parentid", t).css({
					"background-color": "#fff"
				}).attr("disabled", !1).val(" ").focus() : e("#txt-huifu-top-" + i).data("parentid", t).css({
					"background-color": "#fff"
				}).attr("disabled", !1).focus().val(" ").val(""), v(i), e("#pub-btn-top-" + i).unbind().bind("click", function() {
					m(i, "huifu", t)
				})
			})
		}

		function c(t, n, i) {
			var o = "",
				a = n.data,
				r = a.commentTime,
				c = a.content,
				u = (a.depth, a.downs, a.ups, s(a.nickImgUrl)),
				p = a.nick,
				h = (a.isVote, a.id),
				f = a.assentText,
				m = a.items,
				g = a.jid,
				v = a.sourceType,
				b = a.sourceAppUrl;
			o += "<li class='items last'>", o += "<span class='folder' style='background: none'>", o += "<div class='comment-L comment-L-top'>", o += "<a class='icons zhan-ico' href='#'></a>", o += "<a href='/user/" + g + "/submitted/1'><img src='" + u + "'></a>", o += "</div>", o += "<div class='comment-R comment-R-top'>", o += "<div class='pp'>", o += "<a href='/user/" + g + "/submitted/1' class='name' target='_blank'>" + p + "</a>";
			var x = e("#collect-a-" + i).attr("jid");
			if(x == g && (o += "<span class='author'>(楼主)</span>"), o += "<span class='p3'>" + c + "</span>", o += "<span class='into-time  into-time-top'>" + r + "发布</span>", "相信" == f ? o += "<span class='yaoyan-state-top'>" + f + "</span>" : "" != f && (o += "<span class='yaoyan-state-top' style='color:#CC3300'>" + f + "</span>"), void 0 != v) {
				switch(v) {
					case 1:
						b = "/download/model/iphone";
						break;
					case 3:
						b = "/download/model/wphone";
						break;
					case 5:
						b = "/download/model/iphone";
						break;
					case 6:
						b = "/download/model/iphone"
				}
				o += "<span class='into-time s-phone'>来自<a class='phone-name' href='" + b + "' target='_blank'>" + sourcePhone[v] + "</a></span>"
			}
			o += "</div>", o += "<div class='comment-line-top'>", o += "<div class='comment-state'>", o += "<span href='javascript:;' class='ding'><b>已顶</b><span class='ding-num'>[1]</span></span>", o += "<span href='javascript:;' lang='" + i + "' class='cai'><b>踩</b><span class='cai-num'>[0]</span></span>", e(".isCateAdmin").length > 0 && (o += "<span class='line-huifu'>|</span>", o += "<a class='see-a btn-delete-comment' lang='" + h + "'  linkid='" + i + "' style='cursor:pointer;'>删除</a>"), o += "<span class='line-huifu'>|</span>", o += "<a id='huifuBtn" + h + "' href='javascript:;' class='see-a huifu-a' lang='" + h + "' usernick='" + p + "' linkid='" + i + "'>回复</a>", o += "<input type='hidden' value='" + h + "' id='hid" + h + "' />", o += "</div>", o += "</div>", o += "</div>", o += "</span>", o += "</li>", "last" == t ? (e("#comment-list-top-" + i + " > li.last").removeClass("last"), e("#comment-list-top-" + i).append(o).show()) : e("#comment-list-top-" + i + " li:first").before(o).show(), e("#newestCount-" + i).html(m), e("#discus-a-" + i).find("b").html(m), e("#txt-huifu-top-" + i).focus(), l(), d()
		}

		function d() {
			e(".comment-list-top-2 .comment-R-top").hover(function() {
				e(this).css({
					"background-color": "#f6ecdc"
				}).find(".comment-line-top").show()
			}, function() {
				e(this).css("background-color", "#F6F6F6").find(".comment-line-top").hide()
			})
		}

		function u(t) {
			for(var n = "#comment-list-top-" + t, i = e("#comment-list-top-" + t + " li.items"), o = 0; o < i.length; o++) {
				var a = e(i[o]).children();
				a.length <= 1 && e(i[o]).children("span.folder").css("background", "none")
			}
			e(n + " li.items:last").children("div.lastCollapsable-hitarea").css("background-position", "-64px -45px"), e(n + " li.last span.folder").css("background", "none"), e(n + " li.last").parent("ul").css("background", "none"), e(n + " li.items li.lastCollapsable").parent("ul").css("background", "none").prev("ul").css("background", "url('/images/pinglun_line.gif') no-repeat scroll 0 -10px transparent"), e(n + " li.items li.last").parent("ul").prev("ul").css("background", "url('/images/pinglun_line.gif') no-repeat scroll 0 -10px transparent"), e(n + " li.collapsable:first ul:last").css("background", "none"), e(n + " li.items:last").children("div.items-hitarea").click(function() {
				e(this).hasClass("lastExpandable-hitarea") ? e(this).css("background-position", "-80px -13px") : e(this).css("background-position", "-64px -45px")
			}), e(n + " li.items div.items-hitarea").click(function() {
				e(this).children("ul:first li:first b").focus()
			})
		}

		function p(t, n, i) {
			if(!(null == t || t.length <= 0))
				for(var o = 0; o < t.length; o++) {
					var a = t[o].commentTime,
						r = t[o].content,
						l = t[o].depth,
						c = t[o].downs,
						d = t[o].ups,
						u = s(t[o].nickImgUrl),
						h = t[o].nick,
						f = t[o].isVote,
						m = t[o].id,
						g = t[o].jid,
						v = t[o].action,
						b = t[o].deleteInfo,
						x = t[o].sourceType,
						y = t[o].sourceAppUrl,
						w = e("#hidjid").val();
					C += "<ul><li>", C += "<span class='folder'>", C += "<div class='comment-L comment-L-top'>", C += "<a href='#' class='icons zhan-ico'></a>", C += "<a href='/user/" + g + "/submitted/1'><img src='" + u + "' /></a>", C += "</div>", C += "<div class='comment-R comment-R-top'>", C += "<div class='pp'>", C += "<a class='name' href='/user/" + g + "/submitted/1'>" + h + "</a>";
					var _ = e("#collect-a-" + n).attr("jid");
					if(_ == g && (C += "<span class='author'>(楼主)</span>"), C += "<span class='p3'>", C += 2 != v ? r : "<em style='font-style:oblique;color:#B4B4B4'>该评论因  ''" + b + "'' 被删除</em>", C += "</span>", C += "<span class='into-time into-time-top'>" + a + "发布</span>", void 0 != x) {
						switch(x) {
							case 1:
								y = "/download/model/iphone";
								break;
							case 3:
								y = "/download/model/wphone";
								break;
							case 5:
								y = "/download/model/iphone";
								break;
							case 6:
								y = "/download/model/iphone"
						}
						C += "<span class='into-time s-phone'>来自<a class='phone-name' href='" + y + "' target='_blank'>" + sourcePhone[x] + "</a></span>"
					}
					C += "</div>", 2 == v || i || (C += "<div class='comment-line-top'>", C += "<div class='comment-state'>", C += "0" == f ? "<a class='ding' lang='" + n + "' href='javascript:;'><b>顶</b><span class='ding-num'>[" + d + "]</span></a><a class='cai' lang='" + n + "'  href='javascript:;'><b>踩</b><span class='cai-num'>[" + c + "]</span></a>" : 1 == f ? "<span class='ding' href='javascript:;'><b>已顶</b><span class='ding-num'>[" + d + "]</span></span><span class='cai' lang='" + n + "' href='javascript:;'><b>踩</b><span class='cai-num'>[" + c + "]</span></span>" : "<span class='ding' lang='" + n + "' href='javascript:;'><b>顶</b><span class='ding-num'>[" + d + "]</span></span><span class='cai' href='javascript:;'><b>已踩</b><span class='cai-num'>[" + c + "]</span></span>", w != g && (C += "<span class='line-huifu'>|</span>", C += "<a class='see-a jubao' href='javascript:;' lang='" + m + "'  linkid='" + n + "'>举报</a>"), e(".isCateAdmin").length > 0 && (C += "<span class='line-huifu'>|</span>", C += "<a class='see-a btn-delete-comment' lang='" + m + "'  linkid='" + n + "' style='cursor:pointer;'>删除</a>"), l < 6 && 2 != v && (C += "<span class='line-huifu'>|</span>", C += "<a class='see-a huifu-a' href='javascript:;' id='huifuBtn" + m + "'  lang='" + m + "' usernick='" + h + "' linkid='" + n + "'>回复</a>"), C += "<input type='hidden' id='hid" + m + "' value='" + m + "' />", C += "</div>", C += "</div>"), C += "</div>", C += "</span>", t[o].childs && (S++, p(t[o].childs, n, i)), C += "</li></ul>", k += C, C = "", S = 1
				}
		}

		function h(e) {
			var t = /^(\s+)|(\s+)$/,
				n = e;
			return n = n.replace(t, ""), n = n.replace(t, "")
		}

		function f(e) {
			var t = /\s+/g,
				n = e.replace(t, " ");
			return n
		}

		function m(t, n, i) {
			var s = e("#txt-huifu-top-" + t),
				r = e.trim(s.val());
			if("" != r) {
				r = h(r), r = f(r), r = o(r);
				var l = e("#pub-btn-top-" + t);
				l.hide();
				var d = e("#pub-loading-top-" + t);
				d.css("display", "inline-block");
				var u = e("#write-error-desc-" + t);
				u.hide();
				var p = r,
					m = e("#hidsubjectid-" + t).val(),
					g = e("#hidjid").val(),
					w = "score";
				if(e("#yaoyan-sel-area-" + t + " :radio").length >= 1) var C = e("#yaoyan-sel-area-" + t + " :radio:checked").val();
				if("3" != m) var C = "";
				var k = "/comments/create";
				if("huifu" == n) var S = x.param({
					jid: g,
					linkId: t,
					content: p,
					parentId: i
				});
				else {
					if(void 0 == C && 3 == m) return u.html("对于谣言，要先表明立场，才能评论哦").show(), l.show(), d.css("display", "none"), void b(t);
					var S = x.param({
						jid: g,
						linkId: t,
						isAssent: C,
						content: p,
						sortType: w
					})
				}
				var $ = {
					url: k,
					type: "POST",
					data: S,
					success: function(o) {
						if(o.code == _) s.val(""), l.show(), d.css("display", "none"), y.showTopTips(y.TIPS_TYPE.success, o.message), "huifu" == n ? a(t, "huifu") : c("last", o, t), v(t), e("#lab-comment-top-" + t).hide();
						else {
							if("21106" != o.code) return chouti.reponseNoLogin(o.code, o.message, "发表评论成功") ? (u.html(o.message).show(), l.show(), d.css("display", "none"), b(t), !1) : (l.show(), d.css("display", "none"), !1);
							var r = function(e, t) {
									h();
									var n = '<div class="error" style="position:absolute;top:' + e + 'px;left:350px;font-size:12px;border:1px #ff8996 solid;padding:8px;border-radius:5px;width:164px;"><div style="position:absolute;background:url(/images/bb-arrow.png) left center;top:5px;left:-12px;width:20px;height:20px;"></div><div class="error-info">' + t + "</div></div>";
									C.find(".bind-box").append(n)
								},
								h = function() {
									C.find(".error").remove()
								},
								f = function() {
									var e = (C.find('input[name="msgcode"]'), C.find(".btn-getMsgcode"));
									e.addClass("unable illegal");
									var t = 6e4,
										n = setInterval(function() {
											t > 0 ? (e.html(t / 1e3 + "秒后重新发送"), t -= 1e3) : (e.html("获取短信验证码").removeClass("unable illegal"), clearInterval(n))
										}, 1e3)
								},
								m = '<style>.illegal{background-color:#dfdfdf !important;} .bind-box input, .bind-box select{padding:0 5px;height:30px;width:186px;line-height:30px;font-size:12px;} .input-error{border:1px solid #ff8996;}</style><div class="mb" style="background:url(/images/op.png);position:fixed;top:0;left:0;width:100%;height:100%;text-align:center;z-index:2;"><div class="bind-box" style="padding:30px 230px 70px 30px;margin-top:100px;background-color:white;text-align:left;display:inline-block;position:relative;width:300px;"><div style="color:#4d4b47;font-size:14px;">评论/回复前，需要先绑定手机号</div><div style="margin-top:32px;font-size:12px;"><span style="display:inline-block;width:100px;">地区</span><span style="display:inline-block;width:200px;"><select class="bdmobileregion" style="width:200px;"><option value="86">中国(+86)</option><option value="852">中国香港(+852)</option><option value="853">中国澳门(+853)</option><option value="886">中国台湾(+886)</option><option value="1">美国(+1)</option><option value="1">加拿大(+1)</option><option value="60">马来西亚(+60)</option><option value="61">澳洲(+61)</option><option value="81">日本(+81)</option><option value="82">韩国(+82)</option><option value="65">新加坡(+65)</option><option value="44">英国(+44)</option><option value="33">法国(+33)</option><option value="7">俄罗斯(+7)</option><option value="91">印度(+91)</option><option value="66">泰国(+66)</option><option value="49">德国(+49)</option></select></span></div><div style="margin-top:10px;font-size:12px;"><span style="display:inline-block;width:100px;">手机号</span><span style="display:inline-block;width:200px;"><input name="phone" type="text" /></span></div><div style="margin-top:10px;"><div class="btn-getMsgcode illegal" style="cursor:pointer;display:inline-block;padding:10px 0;background-color:#5991d7;color:white;font-size:14px;margin-left:100px;width:200px;text-align:center;">获取短信验证码</div></div><div style="margin-top:10px;font-size:12px;"><span style="display:inline-block;width:100px;">验证码</span><span style="display:inline-block;width:200px;"><input name="msgcode" type="text" /></span></div><div style="margin-top:32px;"><div class="btn-bind illegal" style="cursor:pointer;display:inline-block;padding:10px 0px;background-color:#5991d7;color:white;font-size:14px;margin-left:100px;width:200px;text-align:center;">绑定手机</div></div></div></div>';
							e("body").append(m);
							var C = e(".mb");
							C.find(".btn-close").click(function() {
								C.remove(), e(".txt-huifu").attr("disabled", !1).css("background-color", "#fff"), e("#pub-btn5").show(), e("#pub-loading5").css("display", "none")
							}), C.find('input[name="phone"]').keyup(function() {
								var t = e(this),
									n = t.val();
								n ? C.find(".btn-getMsgcode").hasClass("unable") || (C.find(".btn-getMsgcode").removeClass("illegal"), h()) : r(120, "请输入手机号")
							}), C.find('input[name="msgcode"]').keydown(function(t) {
								if("13" == t.which) C.find(".btn-bind").trigger("click");
								else {
									var n = e(this),
										i = n.val();
									i ? C.find(".btn-bind").removeClass("illegal") : C.find(".btn-bind").addClass("illegal")
								}
							}), C.find('input[name="code"]').keydown(function(e) {
								"13" == e.which && C.find(".btn-getMsgcode").trigger("click")
							}), C.find(".btn-getMsgcode").click(function() {
								C.find('input[name="phone"]').val() || r(120, "请输入手机号"), e(this).hasClass("illegal") || e.ajax({
									url: "/profile/sendcode",
									data: {
										phone: C.find(".bdmobileregion option:selected").val() + C.find('input[name="phone"]').val(),
										authType: "msg",
										type: 1,
										auth_secret: MD5(C.find(".bdmobileregion option:selected").val() + C.find('input[name="phone"]').val() + "-wbb8cadf-cc689fxycd_yw72ewqrt")
									},
									dataType: "json",
									success: function(e) {
										"9999" != e.result.code ? r(120, e.result.message) : (f(), r(120, "发送成功，请稍等"))
									}
								})
							}), C.find(".btn-bind").click(function() {
								e(this).hasClass("illegal") || e.ajax({
									url: "/profile/bind",
									data: {
										phone: C.find(".bdmobileregion option:selected").val() + C.find('input[name="phone"]').val(),
										code: C.find('input[name="msgcode"]').val()
									},
									dataType: "json",
									success: function(n) {
										"9999" != n.result.code ? r(210, n.result.message) : (y.ajax({
											url: k,
											type: "POST",
											data: x.param({
												jid: g,
												linkId: t,
												content: p,
												parentId: i
											}),
											success: function(t) {
												t.code == _ && (e(".txt-huifu").attr("disabled", !1).css("background-color", "#fff"), e(".txt-huifu").val(""), e("#showLength4").html(T), e("#pub-btn5").show(), e("#pub-loading5").css("display", "none"), y.showTopTips(y.TIPS_TYPE.success, t.message), e(".txt-huifu").parent().parent().parent().hide().html(""), "score" == w ? e("#comment-hot-tab").click() : e("#comment-new-tab").click(), C.remove())
											}
										}), window.location.reload())
									}
								})
							})
						}
					}
				};
				e("#isAjax").data("ajax", $), e("#isComment").data("isComment", t), y.ajax($)
			}
		}

		function g() {
			e("a.ding, a.cai").click(function() {
				var t = e(this);
				if(t.removeClass("hover"), "ding" == t.attr("class")) var n = 1;
				else var n = -1;
				var i = t.attr("lang"),
					o = e("#hidjid").val(),
					a = t.siblings("input:hidden").val(),
					s = "/comments/vote",
					r = {
						url: s,
						type: "POST",
						data: x.param({
							linkId: i,
							id: a,
							jid: o,
							vote: n
						}),
						success: function(i) {
							if(i.code == _) 1 == n ? (e(t).find(".ding-num").html("[" + i.data + "]"), e(t).css({
								cursor: "default",
								color: "#B4B4B4",
								"text-decoration": "none"
							}).unbind().siblings(".cai").unbind(), e(t).find("b").html("已顶"), e(t).hover(function() {
								e(this).css("text-decoration", "none")
							}), e(t).siblings(".cai").css({
								cursor: "default",
								color: "#B4B4B4"
							}).hover(function() {
								e(this).css("text-decoration", "none")
							})) : (e(t).find(".cai-num").html("[" + i.data + "]"), e(t).css({
								cursor: "default",
								color: "#B4B4B4",
								"text-decoration": "none"
							}).unbind().siblings(".ding").unbind(), e(t).find("b").html("已踩"), e(t).hover(function() {
								e(this).css("text-decoration", "none")
							}), e(t).siblings(".ding").css({
								cursor: "default",
								color: "#B4B4B4"
							}).hover(function() {
								e(this).css("text-decoration", "none")
							})), chouti.executeBeforOprate(!0);
							else {
								if("22157" != i.code) return !!chouti.reponseNoLogin(i.code, i.message, "投票成功") && void y.showTopTips(y.TIPS_TYPE.error, i.message);
								e("#login_ajaxInfo").val("投票成功")
							}
						}
					};
				e("#isAjax").data("ajax", r), y.ajax(r)
			})
		}

		function v(t) {
			e("#pub-btn-top-" + t).addClass("add-pub-btn-unvalid").removeClass("add-pub-btn-valid")
		}

		function b(t) {
			e("#pub-btn-top-" + t).addClass("add-pub-btn-valid").removeClass("add-pub-btn-unvalid")
		}
		var x = e.gozap,
			y = x.labi,
			w = y.i18n,
			_ = (w.notice, y.RESULT_CODE.success),
			T = 150,
			C = "",
			k = "",
			S = 1,
			$ = !1;
		sourcePhone = {
			1: "iPhone",
			2: "Android",
			3: "WPhone",
			5: "iPad"
		};
		var E, j = navigator.userAgent;
		e.extend({
			inputComment: function(e, t, n) {
				var o = document.getElementById(e);
				o && o.addEventListener("input", function() {
					i(e, t)
				}, !1)
			}
		}), NS_links_comment_top = {
			init: t
		}
	}(jQuery),
	function(e) {
		e.extend(e.fn, {
			swapClass: function(e, t) {
				var n = this.filter("." + e);
				return this.filter("." + t).removeClass(t).addClass(e), n.removeClass(e).addClass(t), this
			},
			replaceClass: function(e, t) {
				return this.filter("." + e).removeClass(e).addClass(t).end()
			},
			hoverClass: function(t) {
				return t = t || "hover", this.hover(function() {
					e(this).addClass(t)
				}, function() {
					e(this).removeClass(t)
				})
			},
			heightToggle: function(e, t) {
				e ? this.animate({
					height: "toggle"
				}, e, t) : this.each(function() {
					jQuery(this)[jQuery(this).is(":hidden") ? "show" : "hide"](), t && t.apply(this, arguments)
				})
			},
			heightHide: function(e, t) {
				e ? this.animate({
					height: "hide"
				}, e, t) : (this.hide(), t && this.each(t))
			},
			prepareBranches: function(e) {
				return e.prerendered || (this.filter(":last-child:not(ul)").addClass(t.last), this.filter((e.collapsed ? "" : "." + t.closed) + ":not(." + t.open + ")").find(">ul").hide()), this.filter(":has(>ul)")
			},
			applyClasses: function(n, i) {
				if(this.filter(":has(>ul):not(:has(>a))").find(">span").unbind("click.treeview").bind("click.treeview", function(t) {
						this == t.target && i.apply(e(this).next())
					}).add(e("a", this)).hoverClass(), !n.prerendered) {
					this.filter(":has(>ul:hidden)").addClass(t.expandable).replaceClass(t.last, t.lastExpandable), this.not(":has(>ul:hidden)").addClass(t.collapsable).replaceClass(t.last, t.lastCollapsable);
					var o = this.find("div." + t.hitarea);
					o.length || (o = this.prepend('<div class="' + t.hitarea + '"/>').find("div." + t.hitarea)), o.removeClass().addClass(t.hitarea).each(function() {
						var t = "";
						e.each(e(this).parent().attr("class").split(" "), function() {
							t += this + "-hitarea "
						}), e(this).addClass(t)
					})
				}
				this.find("div." + t.hitarea).click(i)
			},
			treeview: function(n) {
				function i(n, i) {
					function a(i) {
						return function() {
							return o.apply(e("div." + t.hitarea, n).filter(function() {
								return !i || e(this).parent("." + i).length
							})), !1
						}
					}
					e("a:eq(0)", i).click(a(t.collapsable)), e("a:eq(1)", i).click(a(t.expandable)), e("a:eq(2)", i).click(a())
				}

				function o() {
					e(this).parent().find(">.hitarea").swapClass(t.collapsableHitarea, t.expandableHitarea).swapClass(t.lastCollapsableHitarea, t.lastExpandableHitarea).end().swapClass(t.collapsable, t.expandable).swapClass(t.lastCollapsable, t.lastExpandable).find(">ul").heightToggle(n.animated, n.toggle), n.unique && e(this).parent().siblings().find(">.hitarea").replaceClass(t.collapsableHitarea, t.expandableHitarea).replaceClass(t.lastCollapsableHitarea, t.lastExpandableHitarea).end().replaceClass(t.collapsable, t.expandable).replaceClass(t.lastCollapsable, t.lastExpandable).find(">ul").heightHide(n.animated, n.toggle)
				}

				function a() {
					var t = [];
					l.each(function(n, i) {
						t[n] = e(i).is(":has(>ul:visible)") ? 1 : 0
					}), e.cookie(n.cookieId, t.join(""), n.cookieOptions)
				}

				function s() {
					var t = e.cookie(n.cookieId);
					if(t) {
						var i = t.split("");
						l.each(function(t, n) {
							e(n).find(">ul")[parseInt(i[t]) ? "show" : "hide"]()
						})
					}
				}
				if(n = e.extend({
						cookieId: "treeview"
					}, n), n.toggle) {
					var r = n.toggle;
					n.toggle = function() {
						return r.apply(e(this).parent()[0], arguments)
					}
				}
				this.data("toggler", o), this.addClass("treeview");
				var l = this.find("li").prepareBranches(n);
				switch(n.persist) {
					case "cookie":
						var c = n.toggle;
						n.toggle = function() {
							a(), c && c.apply(this, arguments)
						}, s();
						break;
					case "location":
						var d = this.find("a").filter(function() {
							return this.href.toLowerCase() == location.href.toLowerCase()
						});
						if(d.length) {
							var u = d.addClass("selected").parents("ul, li").add(d.next()).show();
							n.prerendered && u.filter("li").swapClass(t.collapsable, t.expandable).swapClass(t.lastCollapsable, t.lastExpandable).find(">.hitarea").swapClass(t.collapsableHitarea, t.expandableHitarea).swapClass(t.lastCollapsableHitarea, t.lastExpandableHitarea)
						}
				}
				return l.applyClasses(n, o), n.control && (i(this, n.control), e(n.control).show()), this
			}
		}), e.treeview = {};
		var t = e.treeview.classes = {
			open: "open",
			closed: "closed",
			expandable: "expandable",
			expandableHitarea: "expandable-hitarea",
			lastExpandableHitarea: "lastExpandable-hitarea",
			collapsable: "collapsable",
			collapsableHitarea: "collapsable-hitarea",
			lastCollapsableHitarea: "lastCollapsable-hitarea",
			lastCollapsable: "lastCollapsable",
			lastExpandable: "lastExpandable",
			last: "last",
			hitarea: "hitarea"
		}
	}(jQuery), $.fn.extend({
		cursorPosition: function(e) {
			var t = this[0];
			if(!t || "TEXTAREA" != t.tagName && "text" != t.type.toLowerCase()) {
				if(void 0 === e) return
			} else if($.browser.msie) {
				var n;
				if(n = "TEXTAREA" == t.tagName ? event.srcElement.createTextRange() : document.selection.createRange(), void 0 === e) return n.moveStart("character", -event.srcElement.value.length), n.text.length;
				if("number" == typeof e) {
					var i = this.position();
					i > e ? n.moveEnd("character", e - i) : n.moveStart("character", e - i), n.select()
				}
			} else {
				if(void 0 === e) return t.selectionStart;
				"number" == typeof e && (t.selectionEnd = e, t.selectionStart = e)
			}
		}
	});
var Handlebars = {};
Handlebars.VERSION = "1.0.beta.6", Handlebars.helpers = {}, Handlebars.partials = {}, Handlebars.registerHelper = function(e, t, n) {
	n && (t.not = n), this.helpers[e] = t
}, Handlebars.registerPartial = function(e, t) {
	this.partials[e] = t
}, Handlebars.registerHelper("helperMissing", function(e) {
	if(2 !== arguments.length) throw new Error("Could not find property '" + e + "'")
});
var toString = Object.prototype.toString,
	functionType = "[object Function]";
Handlebars.registerHelper("blockHelperMissing", function(e, t) {
	var n = t.inverse || function() {},
		i = t.fn,
		o = "",
		a = toString.call(e);
	if(a === functionType && (e = e.call(this)), e === !0) return i(this);
	if(e === !1 || null == e) return n(this);
	if("[object Array]" === a) {
		if(e.length > 0)
			for(var s = 0, r = e.length; s < r; s++) o += i(e[s]);
		else o = n(this);
		return o
	}
	return i(e)
}), Handlebars.registerHelper("each", function(e, t) {
	var n = t.fn,
		i = t.inverse,
		o = "";
	if(e && e.length > 0)
		for(var a = 0, s = e.length; a < s; a++) o += n(e[a]);
	else o = i(this);
	return o
}), Handlebars.registerHelper("if", function(e, t) {
	var n = toString.call(e);
	return n === functionType && (e = e.call(this)), !e || Handlebars.Utils.isEmpty(e) ? t.inverse(this) : t.fn(this)
}), Handlebars.registerHelper("unless", function(e, t) {
	var n = t.fn,
		i = t.inverse;
	return t.fn = i, t.inverse = n, Handlebars.helpers["if"].call(this, e, t)
}), Handlebars.registerHelper("with", function(e, t) {
	return t.fn(e)
}), Handlebars.registerHelper("log", function(e) {
	Handlebars.log(e)
});
var handlebars = function() {
	var e = {
			trace: function() {},
			yy: {},
			symbols_: {
				error: 2,
				root: 3,
				program: 4,
				EOF: 5,
				statements: 6,
				simpleInverse: 7,
				statement: 8,
				openInverse: 9,
				closeBlock: 10,
				openBlock: 11,
				mustache: 12,
				partial: 13,
				CONTENT: 14,
				COMMENT: 15,
				OPEN_BLOCK: 16,
				inMustache: 17,
				CLOSE: 18,
				OPEN_INVERSE: 19,
				OPEN_ENDBLOCK: 20,
				path: 21,
				OPEN: 22,
				OPEN_UNESCAPED: 23,
				OPEN_PARTIAL: 24,
				params: 25,
				hash: 26,
				param: 27,
				STRING: 28,
				INTEGER: 29,
				BOOLEAN: 30,
				hashSegments: 31,
				hashSegment: 32,
				ID: 33,
				EQUALS: 34,
				pathSegments: 35,
				SEP: 36,
				$accept: 0,
				$end: 1
			},
			terminals_: {
				2: "error",
				5: "EOF",
				14: "CONTENT",
				15: "COMMENT",
				16: "OPEN_BLOCK",
				18: "CLOSE",
				19: "OPEN_INVERSE",
				20: "OPEN_ENDBLOCK",
				22: "OPEN",
				23: "OPEN_UNESCAPED",
				24: "OPEN_PARTIAL",
				28: "STRING",
				29: "INTEGER",
				30: "BOOLEAN",
				33: "ID",
				34: "EQUALS",
				36: "SEP"
			},
			productions_: [0, [3, 2],
				[4, 3],
				[4, 1],
				[4, 0],
				[6, 1],
				[6, 2],
				[8, 3],
				[8, 3],
				[8, 1],
				[8, 1],
				[8, 1],
				[8, 1],
				[11, 3],
				[9, 3],
				[10, 3],
				[12, 3],
				[12, 3],
				[13, 3],
				[13, 4],
				[7, 2],
				[17, 3],
				[17, 2],
				[17, 2],
				[17, 1],
				[25, 2],
				[25, 1],
				[27, 1],
				[27, 1],
				[27, 1],
				[27, 1],
				[26, 1],
				[31, 2],
				[31, 1],
				[32, 3],
				[32, 3],
				[32, 3],
				[32, 3],
				[21, 1],
				[35, 3],
				[35, 1]
			],
			performAction: function(e, t, n, i, o, a, s) {
				var r = a.length - 1;
				switch(o) {
					case 1:
						return a[r - 1];
					case 2:
						this.$ = new i.ProgramNode(a[r - 2], a[r]);
						break;
					case 3:
						this.$ = new i.ProgramNode(a[r]);
						break;
					case 4:
						this.$ = new i.ProgramNode([]);
						break;
					case 5:
						this.$ = [a[r]];
						break;
					case 6:
						a[r - 1].push(a[r]), this.$ = a[r - 1];
						break;
					case 7:
						this.$ = new i.InverseNode(a[r - 2], a[r - 1], a[r]);
						break;
					case 8:
						this.$ = new i.BlockNode(a[r - 2], a[r - 1], a[r]);
						break;
					case 9:
						this.$ = a[r];
						break;
					case 10:
						this.$ = a[r];
						break;
					case 11:
						this.$ = new i.ContentNode(a[r]);
						break;
					case 12:
						this.$ = new i.CommentNode(a[r]);
						break;
					case 13:
						this.$ = new i.MustacheNode(a[r - 1][0], a[r - 1][1]);
						break;
					case 14:
						this.$ = new i.MustacheNode(a[r - 1][0], a[r - 1][1]);
						break;
					case 15:
						this.$ = a[r - 1];
						break;
					case 16:
						this.$ = new i.MustacheNode(a[r - 1][0], a[r - 1][1]);
						break;
					case 17:
						this.$ = new i.MustacheNode(a[r - 1][0], a[r - 1][1], (!0));
						break;
					case 18:
						this.$ = new i.PartialNode(a[r - 1]);
						break;
					case 19:
						this.$ = new i.PartialNode(a[r - 2], a[r - 1]);
						break;
					case 20:
						break;
					case 21:
						this.$ = [
							[a[r - 2]].concat(a[r - 1]), a[r]
						];
						break;
					case 22:
						this.$ = [
							[a[r - 1]].concat(a[r]), null
						];
						break;
					case 23:
						this.$ = [
							[a[r - 1]], a[r]
						];
						break;
					case 24:
						this.$ = [
							[a[r]], null
						];
						break;
					case 25:
						a[r - 1].push(a[r]), this.$ = a[r - 1];
						break;
					case 26:
						this.$ = [a[r]];
						break;
					case 27:
						this.$ = a[r];
						break;
					case 28:
						this.$ = new i.StringNode(a[r]);
						break;
					case 29:
						this.$ = new i.IntegerNode(a[r]);
						break;
					case 30:
						this.$ = new i.BooleanNode(a[r]);
						break;
					case 31:
						this.$ = new i.HashNode(a[r]);
						break;
					case 32:
						a[r - 1].push(a[r]), this.$ = a[r - 1];
						break;
					case 33:
						this.$ = [a[r]];
						break;
					case 34:
						this.$ = [a[r - 2], a[r]];
						break;
					case 35:
						this.$ = [a[r - 2], new i.StringNode(a[r])];
						break;
					case 36:
						this.$ = [a[r - 2], new i.IntegerNode(a[r])];
						break;
					case 37:
						this.$ = [a[r - 2], new i.BooleanNode(a[r])];
						break;
					case 38:
						this.$ = new i.IdNode(a[r]);
						break;
					case 39:
						a[r - 2].push(a[r]), this.$ = a[r - 2];
						break;
					case 40:
						this.$ = [a[r]]
				}
			},
			table: [{
				3: 1,
				4: 2,
				5: [2, 4],
				6: 3,
				8: 4,
				9: 5,
				11: 6,
				12: 7,
				13: 8,
				14: [1, 9],
				15: [1, 10],
				16: [1, 12],
				19: [1, 11],
				22: [1, 13],
				23: [1, 14],
				24: [1, 15]
			}, {
				1: [3]
			}, {
				5: [1, 16]
			}, {
				5: [2, 3],
				7: 17,
				8: 18,
				9: 5,
				11: 6,
				12: 7,
				13: 8,
				14: [1, 9],
				15: [1, 10],
				16: [1, 12],
				19: [1, 19],
				20: [2, 3],
				22: [1, 13],
				23: [1, 14],
				24: [1, 15]
			}, {
				5: [2, 5],
				14: [2, 5],
				15: [2, 5],
				16: [2, 5],
				19: [2, 5],
				20: [2, 5],
				22: [2, 5],
				23: [2, 5],
				24: [2, 5]
			}, {
				4: 20,
				6: 3,
				8: 4,
				9: 5,
				11: 6,
				12: 7,
				13: 8,
				14: [1, 9],
				15: [1, 10],
				16: [1, 12],
				19: [1, 11],
				20: [2, 4],
				22: [1, 13],
				23: [1, 14],
				24: [1, 15]
			}, {
				4: 21,
				6: 3,
				8: 4,
				9: 5,
				11: 6,
				12: 7,
				13: 8,
				14: [1, 9],
				15: [1, 10],
				16: [1, 12],
				19: [1, 11],
				20: [2, 4],
				22: [1, 13],
				23: [1, 14],
				24: [1, 15]
			}, {
				5: [2, 9],
				14: [2, 9],
				15: [2, 9],
				16: [2, 9],
				19: [2, 9],
				20: [2, 9],
				22: [2, 9],
				23: [2, 9],
				24: [2, 9]
			}, {
				5: [2, 10],
				14: [2, 10],
				15: [2, 10],
				16: [2, 10],
				19: [2, 10],
				20: [2, 10],
				22: [2, 10],
				23: [2, 10],
				24: [2, 10]
			}, {
				5: [2, 11],
				14: [2, 11],
				15: [2, 11],
				16: [2, 11],
				19: [2, 11],
				20: [2, 11],
				22: [2, 11],
				23: [2, 11],
				24: [2, 11]
			}, {
				5: [2, 12],
				14: [2, 12],
				15: [2, 12],
				16: [2, 12],
				19: [2, 12],
				20: [2, 12],
				22: [2, 12],
				23: [2, 12],
				24: [2, 12]
			}, {
				17: 22,
				21: 23,
				33: [1, 25],
				35: 24
			}, {
				17: 26,
				21: 23,
				33: [1, 25],
				35: 24
			}, {
				17: 27,
				21: 23,
				33: [1, 25],
				35: 24
			}, {
				17: 28,
				21: 23,
				33: [1, 25],
				35: 24
			}, {
				21: 29,
				33: [1, 25],
				35: 24
			}, {
				1: [2, 1]
			}, {
				6: 30,
				8: 4,
				9: 5,
				11: 6,
				12: 7,
				13: 8,
				14: [1, 9],
				15: [1, 10],
				16: [1, 12],
				19: [1, 11],
				22: [1, 13],
				23: [1, 14],
				24: [1, 15]
			}, {
				5: [2, 6],
				14: [2, 6],
				15: [2, 6],
				16: [2, 6],
				19: [2, 6],
				20: [2, 6],
				22: [2, 6],
				23: [2, 6],
				24: [2, 6]
			}, {
				17: 22,
				18: [1, 31],
				21: 23,
				33: [1, 25],
				35: 24
			}, {
				10: 32,
				20: [1, 33]
			}, {
				10: 34,
				20: [1, 33]
			}, {
				18: [1, 35]
			}, {
				18: [2, 24],
				21: 40,
				25: 36,
				26: 37,
				27: 38,
				28: [1, 41],
				29: [1, 42],
				30: [1, 43],
				31: 39,
				32: 44,
				33: [1, 45],
				35: 24
			}, {
				18: [2, 38],
				28: [2, 38],
				29: [2, 38],
				30: [2, 38],
				33: [2, 38],
				36: [1, 46]
			}, {
				18: [2, 40],
				28: [2, 40],
				29: [2, 40],
				30: [2, 40],
				33: [2, 40],
				36: [2, 40]
			}, {
				18: [1, 47]
			}, {
				18: [1, 48]
			}, {
				18: [1, 49]
			}, {
				18: [1, 50],
				21: 51,
				33: [1, 25],
				35: 24
			}, {
				5: [2, 2],
				8: 18,
				9: 5,
				11: 6,
				12: 7,
				13: 8,
				14: [1, 9],
				15: [1, 10],
				16: [1, 12],
				19: [1, 11],
				20: [2, 2],
				22: [1, 13],
				23: [1, 14],
				24: [1, 15]
			}, {
				14: [2, 20],
				15: [2, 20],
				16: [2, 20],
				19: [2, 20],
				22: [2, 20],
				23: [2, 20],
				24: [2, 20]
			}, {
				5: [2, 7],
				14: [2, 7],
				15: [2, 7],
				16: [2, 7],
				19: [2, 7],
				20: [2, 7],
				22: [2, 7],
				23: [2, 7],
				24: [2, 7]
			}, {
				21: 52,
				33: [1, 25],
				35: 24
			}, {
				5: [2, 8],
				14: [2, 8],
				15: [2, 8],
				16: [2, 8],
				19: [2, 8],
				20: [2, 8],
				22: [2, 8],
				23: [2, 8],
				24: [2, 8]
			}, {
				14: [2, 14],
				15: [2, 14],
				16: [2, 14],
				19: [2, 14],
				20: [2, 14],
				22: [2, 14],
				23: [2, 14],
				24: [2, 14]
			}, {
				18: [2, 22],
				21: 40,
				26: 53,
				27: 54,
				28: [1, 41],
				29: [1, 42],
				30: [1, 43],
				31: 39,
				32: 44,
				33: [1, 45],
				35: 24
			}, {
				18: [2, 23]
			}, {
				18: [2, 26],
				28: [2, 26],
				29: [2, 26],
				30: [2, 26],
				33: [2, 26]
			}, {
				18: [2, 31],
				32: 55,
				33: [1, 56]
			}, {
				18: [2, 27],
				28: [2, 27],
				29: [2, 27],
				30: [2, 27],
				33: [2, 27]
			}, {
				18: [2, 28],
				28: [2, 28],
				29: [2, 28],
				30: [2, 28],
				33: [2, 28]
			}, {
				18: [2, 29],
				28: [2, 29],
				29: [2, 29],
				30: [2, 29],
				33: [2, 29]
			}, {
				18: [2, 30],
				28: [2, 30],
				29: [2, 30],
				30: [2, 30],
				33: [2, 30]
			}, {
				18: [2, 33],
				33: [2, 33]
			}, {
				18: [2, 40],
				28: [2, 40],
				29: [2, 40],
				30: [2, 40],
				33: [2, 40],
				34: [1, 57],
				36: [2, 40]
			}, {
				33: [1, 58]
			}, {
				14: [2, 13],
				15: [2, 13],
				16: [2, 13],
				19: [2, 13],
				20: [2, 13],
				22: [2, 13],
				23: [2, 13],
				24: [2, 13]
			}, {
				5: [2, 16],
				14: [2, 16],
				15: [2, 16],
				16: [2, 16],
				19: [2, 16],
				20: [2, 16],
				22: [2, 16],
				23: [2, 16],
				24: [2, 16]
			}, {
				5: [2, 17],
				14: [2, 17],
				15: [2, 17],
				16: [2, 17],
				19: [2, 17],
				20: [2, 17],
				22: [2, 17],
				23: [2, 17],
				24: [2, 17]
			}, {
				5: [2, 18],
				14: [2, 18],
				15: [2, 18],
				16: [2, 18],
				19: [2, 18],
				20: [2, 18],
				22: [2, 18],
				23: [2, 18],
				24: [2, 18]
			}, {
				18: [1, 59]
			}, {
				18: [1, 60]
			}, {
				18: [2, 21]
			}, {
				18: [2, 25],
				28: [2, 25],
				29: [2, 25],
				30: [2, 25],
				33: [2, 25]
			}, {
				18: [2, 32],
				33: [2, 32]
			}, {
				34: [1, 57]
			}, {
				21: 61,
				28: [1, 62],
				29: [1, 63],
				30: [1, 64],
				33: [1, 25],
				35: 24
			}, {
				18: [2, 39],
				28: [2, 39],
				29: [2, 39],
				30: [2, 39],
				33: [2, 39],
				36: [2, 39]
			}, {
				5: [2, 19],
				14: [2, 19],
				15: [2, 19],
				16: [2, 19],
				19: [2, 19],
				20: [2, 19],
				22: [2, 19],
				23: [2, 19],
				24: [2, 19]
			}, {
				5: [2, 15],
				14: [2, 15],
				15: [2, 15],
				16: [2, 15],
				19: [2, 15],
				20: [2, 15],
				22: [2, 15],
				23: [2, 15],
				24: [2, 15]
			}, {
				18: [2, 34],
				33: [2, 34]
			}, {
				18: [2, 35],
				33: [2, 35]
			}, {
				18: [2, 36],
				33: [2, 36]
			}, {
				18: [2, 37],
				33: [2, 37]
			}],
			defaultActions: {
				16: [2, 1],
				37: [2, 23],
				53: [2, 21]
			},
			parseError: function(e, t) {
				throw new Error(e)
			},
			parse: function(e) {
				function t() {
					var e;
					return e = n.lexer.lex() || 1, "number" != typeof e && (e = n.symbols_[e] || e), e
				}
				var n = this,
					i = [0],
					o = [null],
					a = [],
					s = this.table,
					r = "",
					l = 0,
					c = 0,
					d = 0;
				this.lexer.setInput(e), this.lexer.yy = this.yy, this.yy.lexer = this.lexer, "undefined" == typeof this.lexer.yylloc && (this.lexer.yylloc = {});
				var u = this.lexer.yylloc;
				a.push(u), "function" == typeof this.yy.parseError && (this.parseError = this.yy.parseError);
				for(var p, h, f, m, g, v, b, x, y, w = {};;) {
					if(f = i[i.length - 1], this.defaultActions[f] ? m = this.defaultActions[f] : (null == p && (p = t()), m = s[f] && s[f][p]), !("undefined" != typeof m && m.length && m[0] || d)) {
						y = [];
						for(v in s[f]) this.terminals_[v] && v > 2 && y.push("'" + this.terminals_[v] + "'");
						var _ = "";
						_ = this.lexer.showPosition ? "Parse error on line " + (l + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + y.join(", ") + ", got '" + this.terminals_[p] + "'" : "Parse error on line " + (l + 1) + ": Unexpected " + (1 == p ? "end of input" : "'" + (this.terminals_[p] || p) + "'"), this.parseError(_, {
							text: this.lexer.match,
							token: this.terminals_[p] || p,
							line: this.lexer.yylineno,
							loc: u,
							expected: y
						})
					}
					if(m[0] instanceof Array && m.length > 1) throw new Error("Parse Error: multiple actions possible at state: " + f + ", token: " + p);
					switch(m[0]) {
						case 1:
							i.push(p), o.push(this.lexer.yytext), a.push(this.lexer.yylloc), i.push(m[1]), p = null, h ? (p = h, h = null) : (c = this.lexer.yyleng, r = this.lexer.yytext, l = this.lexer.yylineno, u = this.lexer.yylloc, d > 0 && d--);
							break;
						case 2:
							if(b = this.productions_[m[1]][1], w.$ = o[o.length - b], w._$ = {
									first_line: a[a.length - (b || 1)].first_line,
									last_line: a[a.length - 1].last_line,
									first_column: a[a.length - (b || 1)].first_column,
									last_column: a[a.length - 1].last_column
								}, g = this.performAction.call(w, r, c, l, this.yy, m[1], o, a), "undefined" != typeof g) return g;
							b && (i = i.slice(0, -1 * b * 2), o = o.slice(0, -1 * b), a = a.slice(0, -1 * b)), i.push(this.productions_[m[1]][0]), o.push(w.$), a.push(w._$), x = s[i[i.length - 2]][i[i.length - 1]], i.push(x);
							break;
						case 3:
							return !0
					}
				}
				return !0
			}
		},
		t = function() {
			var e = {
				EOF: 1,
				parseError: function(e, t) {
					if(!this.yy.parseError) throw new Error(e);
					this.yy.parseError(e, t)
				},
				setInput: function(e) {
					return this._input = e, this._more = this._less = this.done = !1, this.yylineno = this.yyleng = 0, this.yytext = this.matched = this.match = "", this.conditionStack = ["INITIAL"], this.yylloc = {
						first_line: 1,
						first_column: 0,
						last_line: 1,
						last_column: 0
					}, this
				},
				input: function() {
					var e = this._input[0];
					this.yytext += e, this.yyleng++, this.match += e, this.matched += e;
					var t = e.match(/\n/);
					return t && this.yylineno++, this._input = this._input.slice(1), e
				},
				unput: function(e) {
					return this._input = e + this._input, this
				},
				more: function() {
					return this._more = !0, this
				},
				pastInput: function() {
					var e = this.matched.substr(0, this.matched.length - this.match.length);
					return(e.length > 20 ? "..." : "") + e.substr(-20).replace(/\n/g, "")
				},
				upcomingInput: function() {
					var e = this.match;
					return e.length < 20 && (e += this._input.substr(0, 20 - e.length)), (e.substr(0, 20) + (e.length > 20 ? "..." : "")).replace(/\n/g, "")
				},
				showPosition: function() {
					var e = this.pastInput(),
						t = new Array(e.length + 1).join("-");
					return e + this.upcomingInput() + "\n" + t + "^"
				},
				next: function() {
					if(this.done) return this.EOF;
					this._input || (this.done = !0);
					var e, t, n;
					this._more || (this.yytext = "", this.match = "");
					for(var i = this._currentRules(), o = 0; o < i.length; o++)
						if(t = this._input.match(this.rules[i[o]])) return n = t[0].match(/\n.*/g), n && (this.yylineno += n.length), this.yylloc = {
								first_line: this.yylloc.last_line,
								last_line: this.yylineno + 1,
								first_column: this.yylloc.last_column,
								last_column: n ? n[n.length - 1].length - 1 : this.yylloc.last_column + t[0].length
							}, this.yytext += t[0], this.match += t[0], this.matches = t, this.yyleng = this.yytext.length, this._more = !1, this._input = this._input.slice(t[0].length),
							this.matched += t[0], e = this.performAction.call(this, this.yy, this, i[o], this.conditionStack[this.conditionStack.length - 1]), e ? e : void 0;
					return "" === this._input ? this.EOF : void this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
						text: "",
						token: null,
						line: this.yylineno
					})
				},
				lex: function() {
					var e = this.next();
					return "undefined" != typeof e ? e : this.lex()
				},
				begin: function(e) {
					this.conditionStack.push(e)
				},
				popState: function() {
					return this.conditionStack.pop()
				},
				_currentRules: function() {
					return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
				},
				topState: function() {
					return this.conditionStack[this.conditionStack.length - 2]
				},
				pushState: function(e) {
					this.begin(e)
				}
			};
			return e.performAction = function(e, t, n, i) {
				switch(n) {
					case 0:
						if("\\" !== t.yytext.slice(-1) && this.begin("mu"), "\\" === t.yytext.slice(-1) && (t.yytext = t.yytext.substr(0, t.yyleng - 1), this.begin("emu")), t.yytext) return 14;
						break;
					case 1:
						return 14;
					case 2:
						return this.popState(), 14;
					case 3:
						return 24;
					case 4:
						return 16;
					case 5:
						return 20;
					case 6:
						return 19;
					case 7:
						return 19;
					case 8:
						return 23;
					case 9:
						return 23;
					case 10:
						return t.yytext = t.yytext.substr(3, t.yyleng - 5), this.popState(), 15;
					case 11:
						return 22;
					case 12:
						return 34;
					case 13:
						return 33;
					case 14:
						return 33;
					case 15:
						return 36;
					case 16:
						break;
					case 17:
						return this.popState(), 18;
					case 18:
						return this.popState(), 18;
					case 19:
						return t.yytext = t.yytext.substr(1, t.yyleng - 2).replace(/\\"/g, '"'), 28;
					case 20:
						return 30;
					case 21:
						return 30;
					case 22:
						return 29;
					case 23:
						return 33;
					case 24:
						return t.yytext = t.yytext.substr(1, t.yyleng - 2), 33;
					case 25:
						return "INVALID";
					case 26:
						return 5
				}
			}, e.rules = [/^[^\x00]*?(?=(\{\{))/, /^[^\x00]+/, /^[^\x00]{2,}?(?=(\{\{))/, /^\{\{>/, /^\{\{#/, /^\{\{\//, /^\{\{\^/, /^\{\{\s*else\b/, /^\{\{\{/, /^\{\{&/, /^\{\{![\s\S]*?\}\}/, /^\{\{/, /^=/, /^\.(?=[} ])/, /^\.\./, /^[\/.]/, /^\s+/, /^\}\}\}/, /^\}\}/, /^"(\\["]|[^"])*"/, /^true(?=[}\s])/, /^false(?=[}\s])/, /^[0-9]+(?=[}\s])/, /^[a-zA-Z0-9_$-]+(?=[=}\s\/.])/, /^\[[^\]]*\]/, /^./, /^$/], e.conditions = {
				mu: {
					rules: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
					inclusive: !1
				},
				emu: {
					rules: [2],
					inclusive: !1
				},
				INITIAL: {
					rules: [0, 1, 26],
					inclusive: !0
				}
			}, e
		}();
	return e.lexer = t, e
}();
"undefined" != typeof require && "undefined" != typeof exports && (exports.parser = handlebars, exports.parse = function() {
		return handlebars.parse.apply(handlebars, arguments)
	}, exports.main = function(e) {
		if(!e[1]) throw new Error("Usage: " + e[0] + " FILE");
		if("undefined" != typeof process) var t = require("fs").readFileSync(require("path").join(process.cwd(), e[1]), "utf8");
		else var n = require("file").path(require("file").cwd()),
			t = n.join(e[1]).read({
				charset: "utf-8"
			});
		return exports.parser.parse(t)
	}, "undefined" != typeof module && require.main === module && exports.main("undefined" != typeof process ? process.argv.slice(1) : require("system").args)), Handlebars.Parser = handlebars, Handlebars.parse = function(e) {
		return Handlebars.Parser.yy = Handlebars.AST, Handlebars.Parser.parse(e)
	}, Handlebars.print = function(e) {
		return(new Handlebars.PrintVisitor).accept(e)
	}, Handlebars.logger = {
		DEBUG: 0,
		INFO: 1,
		WARN: 2,
		ERROR: 3,
		level: 3,
		log: function(e, t) {}
	}, Handlebars.log = function(e, t) {
		Handlebars.logger.log(e, t)
	},
	function() {
		Handlebars.AST = {}, Handlebars.AST.ProgramNode = function(e, t) {
			this.type = "program", this.statements = e, t && (this.inverse = new Handlebars.AST.ProgramNode(t))
		}, Handlebars.AST.MustacheNode = function(e, t, n) {
			this.type = "mustache", this.id = e[0], this.params = e.slice(1), this.hash = t, this.escaped = !n
		}, Handlebars.AST.PartialNode = function(e, t) {
			this.type = "partial", this.id = e, this.context = t
		};
		var e = function(e, t) {
			if(e.original !== t.original) throw new Handlebars.Exception(e.original + " doesn't match " + t.original)
		};
		Handlebars.AST.BlockNode = function(t, n, i) {
			e(t.id, i), this.type = "block", this.mustache = t, this.program = n
		}, Handlebars.AST.InverseNode = function(t, n, i) {
			e(t.id, i), this.type = "inverse", this.mustache = t, this.program = n
		}, Handlebars.AST.ContentNode = function(e) {
			this.type = "content", this.string = e
		}, Handlebars.AST.HashNode = function(e) {
			this.type = "hash", this.pairs = e
		}, Handlebars.AST.IdNode = function(e) {
			this.type = "ID", this.original = e.join(".");
			for(var t = [], n = 0, i = 0, o = e.length; i < o; i++) {
				var a = e[i];
				".." === a ? n++ : "." === a || "this" === a ? this.isScoped = !0 : t.push(a)
			}
			this.parts = t, this.string = t.join("."), this.depth = n, this.isSimple = 1 === t.length && 0 === n
		}, Handlebars.AST.StringNode = function(e) {
			this.type = "STRING", this.string = e
		}, Handlebars.AST.IntegerNode = function(e) {
			this.type = "INTEGER", this.integer = e
		}, Handlebars.AST.BooleanNode = function(e) {
			this.type = "BOOLEAN", this.bool = e
		}, Handlebars.AST.CommentNode = function(e) {
			this.type = "comment", this.comment = e
		}
	}(), Handlebars.Exception = function(e) {
		var t = Error.prototype.constructor.apply(this, arguments);
		for(var n in t) t.hasOwnProperty(n) && (this[n] = t[n]);
		this.message = t.message
	}, Handlebars.Exception.prototype = new Error, Handlebars.SafeString = function(e) {
		this.string = e
	}, Handlebars.SafeString.prototype.toString = function() {
		return this.string.toString()
	},
	function() {
		var e = {
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&#x27;",
				"`": "&#x60;"
			},
			t = /&(?!\w+;)|[<>"'`]/g,
			n = /[&<>"'`]/,
			i = function(t) {
				return e[t] || "&amp;"
			};
		Handlebars.Utils = {
			escapeExpression: function(e) {
				return e instanceof Handlebars.SafeString ? e.toString() : null == e || e === !1 ? "" : n.test(e) ? e.replace(t, i) : e
			},
			isEmpty: function(e) {
				return "undefined" == typeof e || (null === e || (e === !1 || "[object Array]" === Object.prototype.toString.call(e) && 0 === e.length))
			}
		}
	}(), Handlebars.Compiler = function() {}, Handlebars.JavaScriptCompiler = function() {},
	function(e, t) {
		e.OPCODE_MAP = {
			appendContent: 1,
			getContext: 2,
			lookupWithHelpers: 3,
			lookup: 4,
			append: 5,
			invokeMustache: 6,
			appendEscaped: 7,
			pushString: 8,
			truthyOrFallback: 9,
			functionOrFallback: 10,
			invokeProgram: 11,
			invokePartial: 12,
			push: 13,
			assignToHash: 15,
			pushStringParam: 16
		}, e.MULTI_PARAM_OPCODES = {
			appendContent: 1,
			getContext: 1,
			lookupWithHelpers: 2,
			lookup: 1,
			invokeMustache: 3,
			pushString: 1,
			truthyOrFallback: 1,
			functionOrFallback: 1,
			invokeProgram: 3,
			invokePartial: 1,
			push: 1,
			assignToHash: 1,
			pushStringParam: 1
		}, e.DISASSEMBLE_MAP = {};
		for(var n in e.OPCODE_MAP) {
			var i = e.OPCODE_MAP[n];
			e.DISASSEMBLE_MAP[i] = n
		}
		e.multiParamSize = function(t) {
			return e.MULTI_PARAM_OPCODES[e.DISASSEMBLE_MAP[t]]
		}, e.prototype = {
			compiler: e,
			disassemble: function() {
				for(var t, n, i, o, a, s = this.opcodes, r = [], l = 0, c = s.length; l < c; l++)
					if(t = s[l], "DECLARE" === t) o = s[++l], a = s[++l], r.push("DECLARE " + o + " = " + a);
					else {
						i = e.DISASSEMBLE_MAP[t];
						for(var d = e.multiParamSize(t), u = [], p = 0; p < d; p++) n = s[++l], "string" == typeof n && (n = '"' + n.replace("\n", "\\n") + '"'), u.push(n);
						i = i + " " + u.join(" "), r.push(i)
					}
				return r.join("\n")
			},
			guid: 0,
			compile: function(e, t) {
				this.children = [], this.depths = {
					list: []
				}, this.options = t;
				var n = this.options.knownHelpers;
				if(this.options.knownHelpers = {
						helperMissing: !0,
						blockHelperMissing: !0,
						each: !0,
						"if": !0,
						unless: !0,
						"with": !0,
						log: !0
					}, n)
					for(var i in n) this.options.knownHelpers[i] = n[i];
				return this.program(e)
			},
			accept: function(e) {
				return this[e.type](e)
			},
			program: function(e) {
				var t, n = e.statements;
				this.opcodes = [];
				for(var i = 0, o = n.length; i < o; i++) t = n[i], this[t.type](t);
				return this.isSimple = 1 === o, this.depths.list = this.depths.list.sort(function(e, t) {
					return e - t
				}), this
			},
			compileProgram: function(e) {
				var t = (new this.compiler).compile(e, this.options),
					n = this.guid++;
				this.usePartial = this.usePartial || t.usePartial, this.children[n] = t;
				for(var i = 0, o = t.depths.list.length; i < o; i++) depth = t.depths.list[i], depth < 2 || this.addDepth(depth - 1);
				return n
			},
			block: function(e) {
				var t, n = e.mustache,
					i = this.setupStackForMustache(n),
					o = this.compileProgram(e.program);
				e.program.inverse && (t = this.compileProgram(e.program.inverse), this.declare("inverse", t)), this.opcode("invokeProgram", o, i.length, !!n.hash), this.declare("inverse", null), this.opcode("append")
			},
			inverse: function(e) {
				var t = this.setupStackForMustache(e.mustache),
					n = this.compileProgram(e.program);
				this.declare("inverse", n), this.opcode("invokeProgram", null, t.length, !!e.mustache.hash), this.declare("inverse", null), this.opcode("append")
			},
			hash: function(e) {
				var t, n, i = e.pairs;
				this.opcode("push", "{}");
				for(var o = 0, a = i.length; o < a; o++) t = i[o], n = t[1], this.accept(n), this.opcode("assignToHash", t[0])
			},
			partial: function(e) {
				var t = e.id;
				this.usePartial = !0, e.context ? this.ID(e.context) : this.opcode("push", "depth0"), this.opcode("invokePartial", t.original), this.opcode("append")
			},
			content: function(e) {
				this.opcode("appendContent", e.string)
			},
			mustache: function(e) {
				var t = this.setupStackForMustache(e);
				this.opcode("invokeMustache", t.length, e.id.original, !!e.hash), e.escaped && !this.options.noEscape ? this.opcode("appendEscaped") : this.opcode("append")
			},
			ID: function(e) {
				this.addDepth(e.depth), this.opcode("getContext", e.depth), this.opcode("lookupWithHelpers", e.parts[0] || null, e.isScoped || !1);
				for(var t = 1, n = e.parts.length; t < n; t++) this.opcode("lookup", e.parts[t])
			},
			STRING: function(e) {
				this.opcode("pushString", e.string)
			},
			INTEGER: function(e) {
				this.opcode("push", e.integer)
			},
			BOOLEAN: function(e) {
				this.opcode("push", e.bool)
			},
			comment: function() {},
			pushParams: function(e) {
				for(var t, n = e.length; n--;) t = e[n], this.options.stringParams ? (t.depth && this.addDepth(t.depth), this.opcode("getContext", t.depth || 0), this.opcode("pushStringParam", t.string)) : this[t.type](t)
			},
			opcode: function(t, n, i, o) {
				this.opcodes.push(e.OPCODE_MAP[t]), void 0 !== n && this.opcodes.push(n), void 0 !== i && this.opcodes.push(i), void 0 !== o && this.opcodes.push(o)
			},
			declare: function(e, t) {
				this.opcodes.push("DECLARE"), this.opcodes.push(e), this.opcodes.push(t)
			},
			addDepth: function(e) {
				0 !== e && (this.depths[e] || (this.depths[e] = !0, this.depths.list.push(e)))
			},
			setupStackForMustache: function(e) {
				var t = e.params;
				return this.pushParams(t), e.hash && this.hash(e.hash), this.ID(e.id), t
			}
		}, t.prototype = {
			nameLookup: function(e, n, i) {
				return /^[0-9]+$/.test(n) ? e + "[" + n + "]" : t.isValidJavaScriptVariableName(n) ? e + "." + n : e + "['" + n + "']"
			},
			appendToBuffer: function(e) {
				return this.environment.isSimple ? "return " + e + ";" : "buffer += " + e + ";"
			},
			initializeBuffer: function() {
				return this.quotedString("")
			},
			namespace: "Handlebars",
			compile: function(e, t, n, i) {
				this.environment = e, this.options = t || {}, this.name = this.environment.name, this.isChild = !!n, this.context = n || {
					programs: [],
					aliases: {
						self: "this"
					},
					registers: {
						list: []
					}
				}, this.preamble(), this.stackSlot = 0, this.stackVars = [], this.compileChildren(e, t);
				var o, a = e.opcodes;
				for(this.i = 0, r = a.length; this.i < r; this.i++) o = this.nextOpcode(0), "DECLARE" === o[0] ? (this.i = this.i + 2, this[o[1]] = o[2]) : (this.i = this.i + o[1].length, this[o[0]].apply(this, o[1]));
				return this.createFunctionContext(i)
			},
			nextOpcode: function(t) {
				var n, i, o, a, s = this.environment.opcodes,
					r = s[this.i + t];
				if("DECLARE" === r) return n = s[this.i + 1], i = s[this.i + 2], ["DECLARE", n, i];
				n = e.DISASSEMBLE_MAP[r], o = e.multiParamSize(r), a = [];
				for(var l = 0; l < o; l++) a.push(s[this.i + l + 1 + t]);
				return [n, a]
			},
			eat: function(e) {
				this.i = this.i + e.length
			},
			preamble: function() {
				var e = [];
				if(this.useRegister("foundHelper"), this.isChild) e.push("");
				else {
					var t = this.namespace,
						n = "helpers = helpers || " + t + ".helpers;";
					this.environment.usePartial && (n = n + " partials = partials || " + t + ".partials;"), e.push(n)
				}
				this.environment.isSimple ? e.push("") : e.push(", buffer = " + this.initializeBuffer()), this.lastContext = 0, this.source = e
			},
			createFunctionContext: function(e) {
				var t = this.stackVars;
				if(this.isChild || (t = t.concat(this.context.registers.list)), t.length > 0 && (this.source[1] = this.source[1] + ", " + t.join(", ")), !this.isChild) {
					for(var n in this.context.aliases) this.source[1] = this.source[1] + ", " + n + "=" + this.context.aliases[n]
				}
				this.source[1] && (this.source[1] = "var " + this.source[1].substring(2) + ";"), this.isChild || (this.source[1] += "\n" + this.context.programs.join("\n") + "\n"), this.environment.isSimple || this.source.push("return buffer;");
				for(var i = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"], o = 0, a = this.environment.depths.list.length; o < a; o++) i.push("depth" + this.environment.depths.list[o]);
				if(e) return i.push(this.source.join("\n  ")), Function.apply(this, i);
				var s = "function " + (this.name || "") + "(" + i.join(",") + ") {\n  " + this.source.join("\n  ") + "}";
				return Handlebars.log(Handlebars.logger.DEBUG, s + "\n\n"), s
			},
			appendContent: function(e) {
				this.source.push(this.appendToBuffer(this.quotedString(e)))
			},
			append: function() {
				var e = this.popStack();
				this.source.push("if(" + e + " || " + e + " === 0) { " + this.appendToBuffer(e) + " }"), this.environment.isSimple && this.source.push("else { " + this.appendToBuffer("''") + " }")
			},
			appendEscaped: function() {
				var e = this.nextOpcode(1),
					t = "";
				this.context.aliases.escapeExpression = "this.escapeExpression", "appendContent" === e[0] && (t = " + " + this.quotedString(e[1][0]), this.eat(e)), this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")" + t))
			},
			getContext: function(e) {
				this.lastContext !== e && (this.lastContext = e)
			},
			lookupWithHelpers: function(e, t) {
				if(e) {
					var n = this.nextStack();
					this.usingKnownHelper = !1;
					var i;
					!t && this.options.knownHelpers[e] ? (i = n + " = " + this.nameLookup("helpers", e, "helper"), this.usingKnownHelper = !0) : t || this.options.knownHelpersOnly ? i = n + " = " + this.nameLookup("depth" + this.lastContext, e, "context") : (this.register("foundHelper", this.nameLookup("helpers", e, "helper")), i = n + " = foundHelper || " + this.nameLookup("depth" + this.lastContext, e, "context")), i += ";", this.source.push(i)
				} else this.pushStack("depth" + this.lastContext)
			},
			lookup: function(e) {
				var t = this.topStack();
				this.source.push(t + " = (" + t + " === null || " + t + " === undefined || " + t + " === false ? " + t + " : " + this.nameLookup(t, e, "context") + ");")
			},
			pushStringParam: function(e) {
				this.pushStack("depth" + this.lastContext), this.pushString(e)
			},
			pushString: function(e) {
				this.pushStack(this.quotedString(e))
			},
			push: function(e) {
				this.pushStack(e)
			},
			invokeMustache: function(e, t, n) {
				this.populateParams(e, this.quotedString(t), "{}", null, n, function(e, t, n) {
					this.usingKnownHelper || (this.context.aliases.helperMissing = "helpers.helperMissing", this.context.aliases.undef = "void 0", this.source.push("else if(" + n + "=== undef) { " + e + " = helperMissing.call(" + t + "); }"), e !== n && this.source.push("else { " + e + " = " + n + "; }"))
				})
			},
			invokeProgram: function(e, t, n) {
				var i = this.programExpression(this.inverse),
					o = this.programExpression(e);
				this.populateParams(t, null, o, i, n, function(e, t, n) {
					this.usingKnownHelper || (this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing", this.source.push("else { " + e + " = blockHelperMissing.call(" + t + "); }"))
				})
			},
			populateParams: function(e, t, n, i, o, a) {
				var s, r, l = o || this.options.stringParams || i || this.options.data,
					c = this.popStack(),
					d = [];
				if(l ? (this.register("tmp1", n), r = "tmp1") : r = "{ hash: {} }", l) {
					var u = o ? this.popStack() : "{}";
					this.source.push("tmp1.hash = " + u + ";")
				}
				this.options.stringParams && this.source.push("tmp1.contexts = [];");
				for(var p = 0; p < e; p++) s = this.popStack(), d.push(s), this.options.stringParams && this.source.push("tmp1.contexts.push(" + this.popStack() + ");");
				i && (this.source.push("tmp1.fn = tmp1;"), this.source.push("tmp1.inverse = " + i + ";")), this.options.data && this.source.push("tmp1.data = data;"), d.push(r), this.populateCall(d, c, t || c, a, "{}" !== n)
			},
			populateCall: function(e, t, n, i, o) {
				var a = ["depth0"].concat(e).join(", "),
					s = ["depth0"].concat(n).concat(e).join(", "),
					r = this.nextStack();
				if(this.usingKnownHelper) this.source.push(r + " = " + t + ".call(" + a + ");");
				else {
					this.context.aliases.functionType = '"function"';
					var l = o ? "foundHelper && " : "";
					this.source.push("if(" + l + "typeof " + t + " === functionType) { " + r + " = " + t + ".call(" + a + "); }")
				}
				i.call(this, r, s, t), this.usingKnownHelper = !1
			},
			invokePartial: function(e) {
				params = [this.nameLookup("partials", e, "partial"), "'" + e + "'", this.popStack(), "helpers", "partials"], this.options.data && params.push("data"), this.pushStack("self.invokePartial(" + params.join(", ") + ");")
			},
			assignToHash: function(e) {
				var t = this.popStack(),
					n = this.topStack();
				this.source.push(n + "['" + e + "'] = " + t + ";")
			},
			compiler: t,
			compileChildren: function(e, t) {
				for(var n, i, o = e.children, a = 0, s = o.length; a < s; a++) {
					n = o[a], i = new this.compiler, this.context.programs.push("");
					var r = this.context.programs.length;
					n.index = r, n.name = "program" + r, this.context.programs[r] = i.compile(n, t, this.context)
				}
			},
			programExpression: function(e) {
				if(null == e) return "self.noop";
				for(var t = this.environment.children[e], n = t.depths.list, i = [t.index, t.name, "data"], o = 0, a = n.length; o < a; o++) depth = n[o], 1 === depth ? i.push("depth0") : i.push("depth" + (depth - 1));
				return 0 === n.length ? "self.program(" + i.join(", ") + ")" : (i.shift(), "self.programWithDepth(" + i.join(", ") + ")")
			},
			register: function(e, t) {
				this.useRegister(e), this.source.push(e + " = " + t + ";")
			},
			useRegister: function(e) {
				this.context.registers[e] || (this.context.registers[e] = !0, this.context.registers.list.push(e))
			},
			pushStack: function(e) {
				return this.source.push(this.nextStack() + " = " + e + ";"), "stack" + this.stackSlot
			},
			nextStack: function() {
				return this.stackSlot++, this.stackSlot > this.stackVars.length && this.stackVars.push("stack" + this.stackSlot), "stack" + this.stackSlot
			},
			popStack: function() {
				return "stack" + this.stackSlot--
			},
			topStack: function() {
				return "stack" + this.stackSlot
			},
			quotedString: function(e) {
				return '"' + e.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r") + '"'
			}
		};
		for(var o = "break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield".split(" "), a = t.RESERVED_WORDS = {}, s = 0, r = o.length; s < r; s++) a[o[s]] = !0;
		t.isValidJavaScriptVariableName = function(e) {
			return !(t.RESERVED_WORDS[e] || !/^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(e))
		}
	}(Handlebars.Compiler, Handlebars.JavaScriptCompiler), Handlebars.precompile = function(e, t) {
		t = t || {};
		var n = Handlebars.parse(e),
			i = (new Handlebars.Compiler).compile(n, t);
		return(new Handlebars.JavaScriptCompiler).compile(i, t)
	}, Handlebars.compile = function(e, t) {
		function n() {
			var n = Handlebars.parse(e),
				i = (new Handlebars.Compiler).compile(n, t),
				o = (new Handlebars.JavaScriptCompiler).compile(i, t, void 0, !0);
			return Handlebars.template(o)
		}
		t = t || {};
		var i;
		return function(e, t) {
			return i || (i = n()), i.call(this, e, t)
		}
	}, Handlebars.VM = {
		template: function(e) {
			var t = {
				escapeExpression: Handlebars.Utils.escapeExpression,
				invokePartial: Handlebars.VM.invokePartial,
				programs: [],
				program: function(e, t, n) {
					var i = this.programs[e];
					return n ? Handlebars.VM.program(t, n) : i ? i : i = this.programs[e] = Handlebars.VM.program(t)
				},
				programWithDepth: Handlebars.VM.programWithDepth,
				noop: Handlebars.VM.noop
			};
			return function(n, i) {
				return i = i || {}, e.call(t, Handlebars, n, i.helpers, i.partials, i.data)
			}
		},
		programWithDepth: function(e, t, n) {
			var i = Array.prototype.slice.call(arguments, 2);
			return function(n, o) {
				return o = o || {}, e.apply(this, [n, o.data || t].concat(i))
			}
		},
		program: function(e, t) {
			return function(n, i) {
				return i = i || {}, e(n, i.data || t)
			}
		},
		noop: function() {
			return ""
		},
		invokePartial: function(e, t, n, i, o, a) {
			if(options = {
					helpers: i,
					partials: o,
					data: a
				}, void 0 === e) throw new Handlebars.Exception("The partial " + t + " could not be found");
			if(e instanceof Function) return e(n, options);
			if(Handlebars.compile) return o[t] = Handlebars.compile(e), o[t](n, options);
			throw new Handlebars.Exception("The partial " + t + " could not be compiled when running in runtime-only mode")
		}
	}, Handlebars.template = Handlebars.VM.template;