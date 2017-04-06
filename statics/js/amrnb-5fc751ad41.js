var AMR = function() {
	function globalEval(e) {
		eval.call(null, e)
	}

	function assert(e, r) {
		e || abort("Assertion failed: " + r)
	}

	function getCFunc(ident) {
		var func = Module["_" + ident];
		if(!func) try {
			func = eval("_" + ident)
		} catch(e) {}
		return assert(func, "Cannot call unknown function " + ident + " (perhaps LLVM optimizations or closure removed it?)"), func
	}

	function setValue(e, r, n, t) {
		switch(n = n || "i8", "*" === n.charAt(n.length - 1) && (n = "i32"), n) {
			case "i1":
				HEAP8[e >> 0] = r;
				break;
			case "i8":
				HEAP8[e >> 0] = r;
				break;
			case "i16":
				HEAP16[e >> 1] = r;
				break;
			case "i32":
				HEAP32[e >> 2] = r;
				break;
			case "i64":
				tempI64 = [r >>> 0, (tempDouble = r, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (0 | Math_min(+Math_floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[e >> 2] = tempI64[0], HEAP32[e + 4 >> 2] = tempI64[1];
				break;
			case "float":
				HEAPF32[e >> 2] = r;
				break;
			case "double":
				HEAPF64[e >> 3] = r;
				break;
			default:
				abort("invalid type for setValue: " + n)
		}
	}

	function getValue(e, r, n) {
		switch(r = r || "i8", "*" === r.charAt(r.length - 1) && (r = "i32"), r) {
			case "i1":
				return HEAP8[e >> 0];
			case "i8":
				return HEAP8[e >> 0];
			case "i16":
				return HEAP16[e >> 1];
			case "i32":
				return HEAP32[e >> 2];
			case "i64":
				return HEAP32[e >> 2];
			case "float":
				return HEAPF32[e >> 2];
			case "double":
				return HEAPF64[e >> 3];
			default:
				abort("invalid type for setValue: " + r)
		}
		return null
	}

	function allocate(e, r, n, t) {
		var i, o;
		"number" == typeof e ? (i = !0, o = e) : (i = !1, o = e.length);
		var a, s = "string" == typeof r ? r : null;
		if(a = n == ALLOC_NONE ? t : [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][void 0 === n ? ALLOC_STATIC : n](Math.max(o, s ? 1 : r.length)), i) {
			var l, t = a;
			for(assert(0 == (3 & a)), l = a + (o & -4); t < l; t += 4) HEAP32[t >> 2] = 0;
			for(l = a + o; t < l;) HEAP8[t++ >> 0] = 0;
			return a
		}
		if("i8" === s) return e.subarray || e.slice ? HEAPU8.set(e, a) : HEAPU8.set(new Uint8Array(e), a), a;
		for(var f, u, c, d = 0; d < o;) {
			var h = e[d];
			"function" == typeof h && (h = Runtime.getFunctionIndex(h)), f = s || r[d], 0 !== f ? ("i64" == f && (f = "i32"), setValue(a + d, h, f), c !== f && (u = Runtime.getNativeTypeSize(f), c = f), d += u) : d++
		}
		return a
	}

	function getMemory(e) {
		return staticSealed ? "undefined" != typeof _sbrk && !_sbrk.called || !runtimeInitialized ? Runtime.dynamicAlloc(e) : _malloc(e) : Runtime.staticAlloc(e)
	}

	function Pointer_stringify(e, r) {
		if(0 === r || !e) return "";
		for(var n, t = 0, i = 0;;) {
			if(n = HEAPU8[e + i >> 0], t |= n, 0 == n && !r) break;
			if(i++, r && i == r) break
		}
		r || (r = i);
		var o = "";
		if(t < 128) {
			for(var a, s = 1024; r > 0;) a = String.fromCharCode.apply(String, HEAPU8.subarray(e, e + Math.min(r, s))), o = o ? o + a : a, e += s, r -= s;
			return o
		}
		return Module.UTF8ToString(e)
	}

	function AsciiToString(e) {
		for(var r = "";;) {
			var n = HEAP8[e++ >> 0];
			if(!n) return r;
			r += String.fromCharCode(n)
		}
	}

	function stringToAscii(e, r) {
		return writeAsciiToMemory(e, r, !1)
	}

	function UTF8ArrayToString(e, r) {
		for(var n, t, i, o, a, s, l = "";;) {
			if(n = e[r++], !n) return l;
			if(128 & n)
				if(t = 63 & e[r++], 192 != (224 & n))
					if(i = 63 & e[r++], 224 == (240 & n) ? n = (15 & n) << 12 | t << 6 | i : (o = 63 & e[r++], 240 == (248 & n) ? n = (7 & n) << 18 | t << 12 | i << 6 | o : (a = 63 & e[r++], 248 == (252 & n) ? n = (3 & n) << 24 | t << 18 | i << 12 | o << 6 | a : (s = 63 & e[r++], n = (1 & n) << 30 | t << 24 | i << 18 | o << 12 | a << 6 | s))), n < 65536) l += String.fromCharCode(n);
					else {
						var f = n - 65536;
						l += String.fromCharCode(55296 | f >> 10, 56320 | 1023 & f)
					}
			else l += String.fromCharCode((31 & n) << 6 | t);
			else l += String.fromCharCode(n)
		}
	}

	function UTF8ToString(e) {
		return UTF8ArrayToString(HEAPU8, e)
	}

	function stringToUTF8Array(e, r, n, t) {
		if(!(t > 0)) return 0;
		for(var i = n, o = n + t - 1, a = 0; a < e.length; ++a) {
			var s = e.charCodeAt(a);
			if(s >= 55296 && s <= 57343 && (s = 65536 + ((1023 & s) << 10) | 1023 & e.charCodeAt(++a)), s <= 127) {
				if(n >= o) break;
				r[n++] = s
			} else if(s <= 2047) {
				if(n + 1 >= o) break;
				r[n++] = 192 | s >> 6, r[n++] = 128 | 63 & s
			} else if(s <= 65535) {
				if(n + 2 >= o) break;
				r[n++] = 224 | s >> 12, r[n++] = 128 | s >> 6 & 63, r[n++] = 128 | 63 & s
			} else if(s <= 2097151) {
				if(n + 3 >= o) break;
				r[n++] = 240 | s >> 18, r[n++] = 128 | s >> 12 & 63, r[n++] = 128 | s >> 6 & 63, r[n++] = 128 | 63 & s
			} else if(s <= 67108863) {
				if(n + 4 >= o) break;
				r[n++] = 248 | s >> 24, r[n++] = 128 | s >> 18 & 63, r[n++] = 128 | s >> 12 & 63, r[n++] = 128 | s >> 6 & 63, r[n++] = 128 | 63 & s
			} else {
				if(n + 5 >= o) break;
				r[n++] = 252 | s >> 30, r[n++] = 128 | s >> 24 & 63, r[n++] = 128 | s >> 18 & 63, r[n++] = 128 | s >> 12 & 63, r[n++] = 128 | s >> 6 & 63, r[n++] = 128 | 63 & s
			}
		}
		return r[n] = 0, n - i
	}

	function stringToUTF8(e, r, n) {
		return stringToUTF8Array(e, HEAPU8, r, n)
	}

	function lengthBytesUTF8(e) {
		for(var r = 0, n = 0; n < e.length; ++n) {
			var t = e.charCodeAt(n);
			t >= 55296 && t <= 57343 && (t = 65536 + ((1023 & t) << 10) | 1023 & e.charCodeAt(++n)), t <= 127 ? ++r : r += t <= 2047 ? 2 : t <= 65535 ? 3 : t <= 2097151 ? 4 : t <= 67108863 ? 5 : 6
		}
		return r
	}

	function UTF16ToString(e) {
		for(var r = 0, n = "";;) {
			var t = HEAP16[e + 2 * r >> 1];
			if(0 == t) return n;
			++r, n += String.fromCharCode(t)
		}
	}

	function stringToUTF16(e, r, n) {
		if(void 0 === n && (n = 2147483647), n < 2) return 0;
		n -= 2;
		for(var t = r, i = n < 2 * e.length ? n / 2 : e.length, o = 0; o < i; ++o) {
			var a = e.charCodeAt(o);
			HEAP16[r >> 1] = a, r += 2
		}
		return HEAP16[r >> 1] = 0, r - t
	}

	function lengthBytesUTF16(e) {
		return 2 * e.length
	}

	function UTF32ToString(e) {
		for(var r = 0, n = "";;) {
			var t = HEAP32[e + 4 * r >> 2];
			if(0 == t) return n;
			if(++r, t >= 65536) {
				var i = t - 65536;
				n += String.fromCharCode(55296 | i >> 10, 56320 | 1023 & i)
			} else n += String.fromCharCode(t)
		}
	}

	function stringToUTF32(e, r, n) {
		if(void 0 === n && (n = 2147483647), n < 4) return 0;
		for(var t = r, i = t + n - 4, o = 0; o < e.length; ++o) {
			var a = e.charCodeAt(o);
			if(a >= 55296 && a <= 57343) {
				var s = e.charCodeAt(++o);
				a = 65536 + ((1023 & a) << 10) | 1023 & s
			}
			if(HEAP32[r >> 2] = a, r += 4, r + 4 > i) break
		}
		return HEAP32[r >> 2] = 0, r - t
	}

	function lengthBytesUTF32(e) {
		for(var r = 0, n = 0; n < e.length; ++n) {
			var t = e.charCodeAt(n);
			t >= 55296 && t <= 57343 && ++n, r += 4
		}
		return r
	}

	function demangle(e) {
		function r() {
			l++, "K" === e[l] && l++;
			for(var r = [];
				"E" !== e[l];)
				if("S" !== e[l])
					if("C" !== e[l]) {
						var n = parseInt(e.substr(l)),
							t = n.toString().length;
						if(!n || !t) {
							l--;
							break
						}
						var i = e.substr(l + t, n);
						r.push(i), u.push(i), l += t + n
					} else r.push(r[r.length - 1]), l += 2;
			else {
				l++;
				var o = e.indexOf("_", l),
					a = e.substring(l, o) || 0;
				r.push(u[a] || "?"), l = o + 1
			}
			return l++, r
		}

		function n(t, i, o) {
			function a() {
				return "(" + d.join(", ") + ")"
			}
			i = i || 1 / 0;
			var s, u = "",
				d = [];
			if("N" === e[l]) {
				if(s = r().join("::"), i--, 0 === i) return t ? [s] : s
			} else {
				("K" === e[l] || c && "L" === e[l]) && l++;
				var h = parseInt(e.substr(l));
				if(h) {
					var E = h.toString().length;
					s = e.substr(l + E, h), l += E + h
				}
			}
			if(c = !1, "I" === e[l]) {
				l++;
				var w = n(!0),
					m = n(!0, 1, !0);
				u += m[0] + " " + s + "<" + w.join(", ") + ">"
			} else u = s;
			e: for(; l < e.length && i-- > 0;) {
				var S = e[l++];
				if(S in f) d.push(f[S]);
				else switch(S) {
					case "P":
						d.push(n(!0, 1, !0)[0] + "*");
						break;
					case "R":
						d.push(n(!0, 1, !0)[0] + "&");
						break;
					case "L":
						l++;
						var p = e.indexOf("E", l),
							h = p - l;
						d.push(e.substr(l, h)), l += h + 2;
						break;
					case "A":
						var h = parseInt(e.substr(l));
						if(l += h.toString().length, "_" !== e[l]) throw "?";
						l++, d.push(n(!0, 1, !0)[0] + " [" + h + "]");
						break;
					case "E":
						break e;
					default:
						u += "?" + S;
						break e
				}
			}
			return o || 1 !== d.length || "void" !== d[0] || (d = []), t ? (u && d.push(u + "?"), d) : u + a()
		}
		var t = !!Module.___cxa_demangle;
		if(t) try {
			var i = _malloc(e.length);
			writeStringToMemory(e.substr(1), i);
			var o = _malloc(4),
				a = Module.___cxa_demangle(i, 0, 0, o);
			if(0 === getValue(o, "i32") && a) return Pointer_stringify(a)
		} catch(s) {} finally {
			i && _free(i), o && _free(o), a && _free(a)
		}
		var l = 3,
			f = {
				v: "void",
				b: "bool",
				c: "char",
				s: "short",
				i: "int",
				l: "long",
				f: "float",
				d: "double",
				w: "wchar_t",
				a: "signed char",
				h: "unsigned char",
				t: "unsigned short",
				j: "unsigned int",
				m: "unsigned long",
				x: "long long",
				y: "unsigned long long",
				z: "..."
			},
			u = [],
			c = !0,
			d = e;
		try {
			if("Object._main" == e || "_main" == e) return "main()";
			if("number" == typeof e && (e = Pointer_stringify(e)), "_" !== e[0]) return e;
			if("_" !== e[1]) return e;
			if("Z" !== e[2]) return e;
			switch(e[3]) {
				case "n":
					return "operator new()";
				case "d":
					return "operator delete()"
			}
			d = n()
		} catch(s) {
			d += "?"
		}
		return d.indexOf("?") >= 0 && !t && Runtime.warnOnce("warning: a problem occurred in builtin C++ name demangling; build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling"), d
	}

	function demangleAll(e) {
		return e.replace(/__Z[\w\d_]+/g, function(e) {
			var r = demangle(e);
			return e === r ? e : e + " [" + r + "]"
		})
	}

	function jsStackTrace() {
		var e = new Error;
		if(!e.stack) {
			try {
				throw new Error(0)
			} catch(r) {
				e = r
			}
			if(!e.stack) return "(no stack trace available)"
		}
		return e.stack.toString()
	}

	function stackTrace() {
		return demangleAll(jsStackTrace())
	}

	function alignMemoryPage(e) {
		return e % 4096 > 0 && (e += 4096 - e % 4096), e
	}

	function enlargeMemory() {
		abort("Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with ALLOW_MEMORY_GROWTH which adjusts the size at runtime but prevents some optimizations, or (3) set Module.TOTAL_MEMORY before the program runs.")
	}

	function callRuntimeCallbacks(e) {
		for(; e.length > 0;) {
			var r = e.shift();
			if("function" != typeof r) {
				var n = r.func;
				"number" == typeof n ? void 0 === r.arg ? Runtime.dynCall("v", n) : Runtime.dynCall("vi", n, [r.arg]) : n(void 0 === r.arg ? null : r.arg)
			} else r()
		}
	}

	function preRun() {
		if(Module.preRun)
			for("function" == typeof Module.preRun && (Module.preRun = [Module.preRun]); Module.preRun.length;) addOnPreRun(Module.preRun.shift());
		callRuntimeCallbacks(__ATPRERUN__)
	}

	function ensureInitRuntime() {
		runtimeInitialized || (runtimeInitialized = !0, callRuntimeCallbacks(__ATINIT__))
	}

	function preMain() {
		callRuntimeCallbacks(__ATMAIN__)
	}

	function exitRuntime() {
		callRuntimeCallbacks(__ATEXIT__), runtimeExited = !0
	}

	function postRun() {
		if(Module.postRun)
			for("function" == typeof Module.postRun && (Module.postRun = [Module.postRun]); Module.postRun.length;) addOnPostRun(Module.postRun.shift());
		callRuntimeCallbacks(__ATPOSTRUN__)
	}

	function addOnPreRun(e) {
		__ATPRERUN__.unshift(e)
	}

	function addOnInit(e) {
		__ATINIT__.unshift(e)
	}

	function addOnPreMain(e) {
		__ATMAIN__.unshift(e)
	}

	function addOnExit(e) {
		__ATEXIT__.unshift(e)
	}

	function addOnPostRun(e) {
		__ATPOSTRUN__.unshift(e)
	}

	function intArrayFromString(e, r, n) {
		var t = n > 0 ? n : lengthBytesUTF8(e) + 1,
			i = new Array(t),
			o = stringToUTF8Array(e, i, 0, i.length);
		return r && (i.length = o), i
	}

	function intArrayToString(e) {
		for(var r = [], n = 0; n < e.length; n++) {
			var t = e[n];
			t > 255 && (t &= 255), r.push(String.fromCharCode(t))
		}
		return r.join("")
	}

	function writeStringToMemory(e, r, n) {
		for(var t = intArrayFromString(e, n), i = 0; i < t.length;) {
			var o = t[i];
			HEAP8[r + i >> 0] = o, i += 1
		}
	}

	function writeArrayToMemory(e, r) {
		for(var n = 0; n < e.length; n++) HEAP8[r++ >> 0] = e[n]
	}

	function writeAsciiToMemory(e, r, n) {
		for(var t = 0; t < e.length; ++t) HEAP8[r++ >> 0] = e.charCodeAt(t);
		n || (HEAP8[r >> 0] = 0)
	}

	function unSign(e, r, n) {
		return e >= 0 ? e : r <= 32 ? 2 * Math.abs(1 << r - 1) + e : Math.pow(2, r) + e
	}

	function reSign(e, r, n) {
		if(e <= 0) return e;
		var t = r <= 32 ? Math.abs(1 << r - 1) : Math.pow(2, r - 1);
		return e >= t && (r <= 32 || e > t) && (e = -2 * t + e), e
	}

	function getUniqueRunDependency(e) {
		return e
	}

	function addRunDependency(e) {
		runDependencies++, Module.monitorRunDependencies && Module.monitorRunDependencies(runDependencies)
	}

	function removeRunDependency(e) {
		if(runDependencies--, Module.monitorRunDependencies && Module.monitorRunDependencies(runDependencies), 0 == runDependencies && (null !== runDependencyWatcher && (clearInterval(runDependencyWatcher), runDependencyWatcher = null), dependenciesFulfilled)) {
			var r = dependenciesFulfilled;
			dependenciesFulfilled = null, r()
		}
	}

	function copyTempFloat(e) {
		HEAP8[tempDoublePtr] = HEAP8[e], HEAP8[tempDoublePtr + 1] = HEAP8[e + 1], HEAP8[tempDoublePtr + 2] = HEAP8[e + 2], HEAP8[tempDoublePtr + 3] = HEAP8[e + 3]
	}

	function copyTempDouble(e) {
		HEAP8[tempDoublePtr] = HEAP8[e], HEAP8[tempDoublePtr + 1] = HEAP8[e + 1], HEAP8[tempDoublePtr + 2] = HEAP8[e + 2], HEAP8[tempDoublePtr + 3] = HEAP8[e + 3], HEAP8[tempDoublePtr + 4] = HEAP8[e + 4], HEAP8[tempDoublePtr + 5] = HEAP8[e + 5], HEAP8[tempDoublePtr + 6] = HEAP8[e + 6], HEAP8[tempDoublePtr + 7] = HEAP8[e + 7]
	}

	function _sbrk(e) {
		var r = _sbrk;
		r.called || (DYNAMICTOP = alignMemoryPage(DYNAMICTOP), r.called = !0, assert(Runtime.dynamicAlloc), r.alloc = Runtime.dynamicAlloc, Runtime.dynamicAlloc = function() {
			abort("cannot dynamically allocate, sbrk now has control")
		});
		var n = DYNAMICTOP;
		if(0 != e) {
			var t = r.alloc(e);
			if(!t) return -1 >>> 0
		}
		return n
	}

	function ___setErrNo(e) {
		return Module.___errno_location && (HEAP32[Module.___errno_location() >> 2] = e), e
	}

	function _sysconf(e) {
		switch(e) {
			case 30:
				return PAGE_SIZE;
			case 85:
				return totalMemory / PAGE_SIZE;
			case 132:
			case 133:
			case 12:
			case 137:
			case 138:
			case 15:
			case 235:
			case 16:
			case 17:
			case 18:
			case 19:
			case 20:
			case 149:
			case 13:
			case 10:
			case 236:
			case 153:
			case 9:
			case 21:
			case 22:
			case 159:
			case 154:
			case 14:
			case 77:
			case 78:
			case 139:
			case 80:
			case 81:
			case 82:
			case 68:
			case 67:
			case 164:
			case 11:
			case 29:
			case 47:
			case 48:
			case 95:
			case 52:
			case 51:
			case 46:
				return 200809;
			case 79:
				return 0;
			case 27:
			case 246:
			case 127:
			case 128:
			case 23:
			case 24:
			case 160:
			case 161:
			case 181:
			case 182:
			case 242:
			case 183:
			case 184:
			case 243:
			case 244:
			case 245:
			case 165:
			case 178:
			case 179:
			case 49:
			case 50:
			case 168:
			case 169:
			case 175:
			case 170:
			case 171:
			case 172:
			case 97:
			case 76:
			case 32:
			case 173:
			case 35:
				return -1;
			case 176:
			case 177:
			case 7:
			case 155:
			case 8:
			case 157:
			case 125:
			case 126:
			case 92:
			case 93:
			case 129:
			case 130:
			case 131:
			case 94:
			case 91:
				return 1;
			case 74:
			case 60:
			case 69:
			case 70:
			case 4:
				return 1024;
			case 31:
			case 42:
			case 72:
				return 32;
			case 87:
			case 26:
			case 33:
				return 2147483647;
			case 34:
			case 1:
				return 47839;
			case 38:
			case 36:
				return 99;
			case 43:
			case 37:
				return 2048;
			case 0:
				return 2097152;
			case 3:
				return 65536;
			case 28:
				return 32768;
			case 44:
				return 32767;
			case 75:
				return 16384;
			case 39:
				return 1e3;
			case 89:
				return 700;
			case 71:
				return 256;
			case 40:
				return 255;
			case 2:
				return 100;
			case 180:
				return 64;
			case 25:
				return 20;
			case 5:
				return 16;
			case 6:
				return 6;
			case 73:
				return 4;
			case 84:
				return "object" == typeof navigator ? navigator.hardwareConcurrency || 1 : 1
		}
		return ___setErrNo(ERRNO_CODES.EINVAL), -1
	}

	function _emscripten_memcpy_big(e, r, n) {
		return HEAPU8.set(HEAPU8.subarray(r, r + n), e), e
	}

	function _abort() {
		Module.abort()
	}

	function _emscripten_set_main_loop_timing(e, r) {
		function n(e) {
			e.source === window && e.data === i && (e.stopPropagation(), t.shift()())
		}
		if(Browser.mainLoop.timingMode = e, Browser.mainLoop.timingValue = r, !Browser.mainLoop.func) return 1;
		if(0 == e) Browser.mainLoop.scheduler = function() {
			setTimeout(Browser.mainLoop.runner, r)
		}, Browser.mainLoop.method = "timeout";
		else if(1 == e) Browser.mainLoop.scheduler = function() {
			Browser.requestAnimationFrame(Browser.mainLoop.runner)
		}, Browser.mainLoop.method = "rAF";
		else if(2 == e) {
			if(!window.setImmediate) {
				var t = [],
					i = "__emcc";
				window.addEventListener("message", n, !0), window.setImmediate = function(e) {
					t.push(e), window.postMessage(i, "*")
				}
			}
			Browser.mainLoop.scheduler = function() {
				window.setImmediate(Browser.mainLoop.runner)
			}, Browser.mainLoop.method = "immediate"
		}
		return 0
	}

	function _emscripten_set_main_loop(e, r, n, t, i) {
		Module.noExitRuntime = !0, assert(!Browser.mainLoop.func, "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters."), Browser.mainLoop.func = e, Browser.mainLoop.arg = t;
		var o = Browser.mainLoop.currentlyRunningMainloop;
		if(Browser.mainLoop.runner = function() {
				if(!ABORT) {
					if(Browser.mainLoop.queue.length > 0) {
						var r = Date.now(),
							n = Browser.mainLoop.queue.shift();
						if(n.func(n.arg), Browser.mainLoop.remainingBlockers) {
							var i = Browser.mainLoop.remainingBlockers,
								a = i % 1 == 0 ? i - 1 : Math.floor(i);
							n.counted ? Browser.mainLoop.remainingBlockers = a : (a += .5, Browser.mainLoop.remainingBlockers = (8 * i + a) / 9)
						}
						return console.log('main loop blocker "' + n.name + '" took ' + (Date.now() - r) + " ms"), Browser.mainLoop.updateStatus(), void setTimeout(Browser.mainLoop.runner, 0)
					}
					if(!(o < Browser.mainLoop.currentlyRunningMainloop)) {
						if(Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0, 1 == Browser.mainLoop.timingMode && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) return void Browser.mainLoop.scheduler();
						"timeout" === Browser.mainLoop.method && Module.ctx && (Module.printErr("Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!"), Browser.mainLoop.method = ""), Browser.mainLoop.runIter(function() {
							"undefined" != typeof t ? Runtime.dynCall("vi", e, [t]) : Runtime.dynCall("v", e)
						}), o < Browser.mainLoop.currentlyRunningMainloop || ("object" == typeof SDL && SDL.audio && SDL.audio.queueNewAudioData && SDL.audio.queueNewAudioData(), Browser.mainLoop.scheduler())
					}
				}
			}, i || (r && r > 0 ? _emscripten_set_main_loop_timing(0, 1e3 / r) : _emscripten_set_main_loop_timing(1, 1), Browser.mainLoop.scheduler()), n) throw "SimulateInfiniteLoop"
	}

	function _time(e) {
		var r = Date.now() / 1e3 | 0;
		return e && (HEAP32[e >> 2] = r), r
	}

	function _pthread_self() {
		return 0
	}

	function ExitStatus(e) {
		this.name = "ExitStatus", this.message = "Program terminated with exit(" + e + ")", this.status = e
	}

	function run(e) {
		function r() {
			Module.calledRun || (Module.calledRun = !0, ABORT || (ensureInitRuntime(), preMain(), Module.onRuntimeInitialized && Module.onRuntimeInitialized(), Module._main && shouldRunNow && Module.callMain(e), postRun()))
		}
		e = e || Module.arguments, null === preloadStartTime && (preloadStartTime = Date.now()), runDependencies > 0 || (preRun(), runDependencies > 0 || Module.calledRun || (Module.setStatus ? (Module.setStatus("Running..."), setTimeout(function() {
			setTimeout(function() {
				Module.setStatus("")
			}, 1), r()
		}, 1)) : r()))
	}

	function exit(e, r) {
		if(!r || !Module.noExitRuntime) throw Module.noExitRuntime || (ABORT = !0, EXITSTATUS = e, STACKTOP = initialStackTop, exitRuntime(), Module.onExit && Module.onExit(e)), ENVIRONMENT_IS_NODE ? (process.stdout.once("drain", function() {
			process.exit(e)
		}), console.log(" "), setTimeout(function() {
			process.exit(e)
		}, 500)) : ENVIRONMENT_IS_SHELL && "function" == typeof quit && quit(e), new ExitStatus(e)
	}

	function abort(e) {
		void 0 !== e ? (Module.print(e), Module.printErr(e), e = JSON.stringify(e)) : e = "", ABORT = !0, EXITSTATUS = 1;
		var r = "\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.",
			n = "abort(" + e + ") at " + stackTrace() + r;
		throw abortDecorators && abortDecorators.forEach(function(r) {
			n = r(n, e)
		}), n
	}
	var AMR = {
			toWAV: function(e) {
				var r = this._decode(e);
				if(!r) return null;
				var n = new Uint8Array(r.buffer, r.byteOffset, r.byteLength),
					t = new Uint8Array(n.length + this.WAV_HEADER_SIZE),
					i = 0,
					o = function(e) {
						var r = new Uint8Array(2);
						new Int16Array(r.buffer)[0] = e, t.set(r, i), i += 2
					},
					a = function(e) {
						var r = new Uint8Array(4);
						new Int32Array(r.buffer)[0] = e, t.set(r, i), i += 4
					},
					s = function(e) {
						var r = new TextEncoder("utf-8").encode(e);
						t.set(r, i), i += r.length
					};
				s("RIFF"), a(36 + n.length), s("WAVEfmt "), a(16);
				var l = 16,
					f = 8e3,
					u = 1,
					c = l / 8 * u,
					d = c * f;
				return o(1), o(1), a(f), a(d), o(c), o(l), s("data"), a(n.length), t.set(n, i), t
			},
			decode: function(e) {
				var r = this._decode(e);
				if(!r) return null;
				for(var n = new Float32Array(r.length), t = 0; t < n.length; t++) n[t] = r[t] / 32768;
				return n
			},
			_decode: function(e) {
				if(String.fromCharCode.apply(null, e.subarray(0, this.AMR_HEADER.length)) !== this.AMR_HEADER) return null;
				var r = this.Decoder_Interface_init();
				if(!r) return null;
				var n = new Int16Array(Math.floor(e.length / 6 * this.PCM_BUFFER_COUNT)),
					t = Module._malloc(this.AMR_BUFFER_COUNT),
					i = new Uint8Array(Module.HEAPU8.buffer, t, this.AMR_BUFFER_COUNT);
				t = Module._malloc(2 * this.PCM_BUFFER_COUNT);
				for(var o = new Int16Array(Module.HEAPU8.buffer, t, this.PCM_BUFFER_COUNT), a = 6, s = 0; a + 1 < e.length && s + 1 < n.length;) {
					var l = this.SIZES[e[a] >> 3 & 15];
					if(a + l + 1 > e.length) break;
					if(i.set(e.subarray(a, a + l + 1)), this.Decoder_Interface_Decode(r, i.byteOffset, o.byteOffset, 0), s + this.PCM_BUFFER_COUNT > n.length) {
						var f = new Int16Array(2 * n.length);
						f.set(n.subarray(0, s)), n = f
					}
					n.set(o, s), s += this.PCM_BUFFER_COUNT, a += l + 1
				}
				return Module._free(i.byteOffset), Module._free(o.byteOffset), this.Decoder_Interface_exit(r), n.subarray(0, s)
			},
			encode: function(e, r, n) {
				if(r < 8e3) return console.error("pcmSampleRate should not be less than 8000."), null;
				"undefined" == typeof n && (n = this.Mode.MR795);
				var t = this.Encoder_Interface_init();
				if(!t) return null;
				var i = Module._malloc(2 * this.PCM_BUFFER_COUNT),
					o = new Int16Array(Module.HEAPU8.buffer, i, this.PCM_BUFFER_COUNT);
				i = Module._malloc(this.AMR_BUFFER_COUNT);
				for(var a = new Uint8Array(Module.HEAPU8.buffer, i, this.AMR_BUFFER_COUNT), s = r / 8e3, l = Math.floor(e.length / s), f = new Int16Array(l), u = 0; u < l; u++) f[u] = 32767 * e[Math.floor(u * s)];
				var c = this.SIZES[n] + 1,
					d = new Uint8Array(Math.ceil(l / this.PCM_BUFFER_COUNT * c) + this.AMR_HEADER.length);
				d.set(new TextEncoder("utf-8").encode(this.AMR_HEADER));
				for(var h = 0, E = this.AMR_HEADER.length; h + this.PCM_BUFFER_COUNT < f.length && E + c < d.length;) {
					o.set(f.subarray(h, h + this.PCM_BUFFER_COUNT));
					var w = this.Encoder_Interface_Encode(t, n, o.byteOffset, a.byteOffset, 0);
					if(w != c) {
						console.error([w, c]);
						break
					}
					d.set(a.subarray(0, w), E), h += this.PCM_BUFFER_COUNT, E += w
				}
				return Module._free(o.byteOffset), Module._free(a.byteOffset), this.Encoder_Interface_exit(t), d.subarray(0, E)
			},
			Decoder_Interface_init: function() {
				return console.warn("Decoder_Interface_init not initialized."), 0
			},
			Decoder_Interface_exit: function(e) {
				console.warn("Decoder_Interface_exit not initialized.")
			},
			Decoder_Interface_Decode: function(e, r, n, t) {
				console.warn("Decoder_Interface_Decode not initialized.")
			},
			Encoder_Interface_init: function(e) {
				return console.warn("Encoder_Interface_init not initialized."), 0
			},
			Encoder_Interface_exit: function(e) {
				console.warn("Encoder_Interface_exit not initialized.")
			},
			Encoder_Interface_Encode: function(e, r, n, t, i) {
				console.warn("Encoder_Interface_Encode not initialized.")
			},
			Mode: {
				MR475: 0,
				MR515: 1,
				MR59: 2,
				MR67: 3,
				MR74: 4,
				MR795: 5,
				MR102: 6,
				MR122: 7,
				MRDTX: 8
			},
			SIZES: [12, 13, 15, 17, 19, 20, 26, 31, 5, 6, 5, 5, 0, 0, 0, 0],
			AMR_BUFFER_COUNT: 32,
			PCM_BUFFER_COUNT: 160,
			AMR_HEADER: "#!AMR\n",
			WAV_HEADER_SIZE: 44
		},
		Module = {
			canvas: {},
			print: function(e) {
				console.log(e)
			},
			_main: function() {
				return AMR.Decoder_Interface_init = Module._Decoder_Interface_init, AMR.Decoder_Interface_exit = Module._Decoder_Interface_exit, AMR.Decoder_Interface_Decode = Module._Decoder_Interface_Decode, AMR.Encoder_Interface_init = Module._Encoder_Interface_init, AMR.Encoder_Interface_exit = Module._Encoder_Interface_exit, AMR.Encoder_Interface_Encode = Module._Encoder_Interface_Encode, 0
			}
		},
		Module;
	Module || (Module = ("undefined" != typeof Module ? Module : null) || {});
	var moduleOverrides = {};
	for(var key in Module) Module.hasOwnProperty(key) && (moduleOverrides[key] = Module[key]);
	var ENVIRONMENT_IS_WEB = "object" == typeof window,
		ENVIRONMENT_IS_WORKER = "function" == typeof importScripts,
		ENVIRONMENT_IS_NODE = "object" == typeof process && "function" == typeof require && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER,
		ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
	if(ENVIRONMENT_IS_NODE) {
		Module.print || (Module.print = function(e) {
			process.stdout.write(e + "\n")
		}), Module.printErr || (Module.printErr = function(e) {
			process.stderr.write(e + "\n")
		});
		var nodeFS = require("fs"),
			nodePath = require("path");
		Module.read = function(e, r) {
			e = nodePath.normalize(e);
			var n = nodeFS.readFileSync(e);
			return n || e == nodePath.resolve(e) || (e = path.join(__dirname, "..", "src", e), n = nodeFS.readFileSync(e)), n && !r && (n = n.toString()), n
		}, Module.readBinary = function(e) {
			return Module.read(e, !0)
		}, Module.load = function(e) {
			globalEval(read(e))
		}, Module.thisProgram || (process.argv.length > 1 ? Module.thisProgram = process.argv[1].replace(/\\/g, "/") : Module.thisProgram = "unknown-program"), Module.arguments = process.argv.slice(2), "undefined" != typeof module && (module.exports = Module), process.on("uncaughtException", function(e) {
			if(!(e instanceof ExitStatus)) throw e
		}), Module.inspect = function() {
			return "[Emscripten Module object]"
		}
	} else if(ENVIRONMENT_IS_SHELL) Module.print || (Module.print = print), "undefined" != typeof printErr && (Module.printErr = printErr), "undefined" != typeof read ? Module.read = read : Module.read = function() {
		throw "no read() available (jsc?)"
	}, Module.readBinary = function(e) {
		if("function" == typeof readbuffer) return new Uint8Array(readbuffer(e));
		var r = read(e, "binary");
		return assert("object" == typeof r), r
	}, "undefined" != typeof scriptArgs ? Module.arguments = scriptArgs : "undefined" != typeof arguments && (Module.arguments = arguments);
	else {
		if(!ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER) throw "Unknown runtime environment. Where are we?";
		if(Module.read = function(e) {
				var r = new XMLHttpRequest;
				return r.open("GET", e, !1), r.send(null), r.responseText
			}, "undefined" != typeof arguments && (Module.arguments = arguments), "undefined" != typeof console) Module.print || (Module.print = function(e) {
			console.log(e)
		}), Module.printErr || (Module.printErr = function(e) {
			console.log(e)
		});
		else {
			var TRY_USE_DUMP = !1;
			Module.print || (Module.print = TRY_USE_DUMP && "undefined" != typeof dump ? function(e) {
				dump(e)
			} : function(e) {})
		}
		ENVIRONMENT_IS_WORKER && (Module.load = importScripts), "undefined" == typeof Module.setWindowTitle && (Module.setWindowTitle = function(e) {
			document.title = e
		})
	}!Module.load && Module.read && (Module.load = function(e) {
		globalEval(Module.read(e))
	}), Module.print || (Module.print = function() {}), Module.printErr || (Module.printErr = Module.print), Module.arguments || (Module.arguments = []), Module.thisProgram || (Module.thisProgram = "./this.program"), Module.print = Module.print, Module.printErr = Module.printErr, Module.preRun = [], Module.postRun = [];
	for(var key in moduleOverrides) moduleOverrides.hasOwnProperty(key) && (Module[key] = moduleOverrides[key]);
	var Runtime = {
		setTempRet0: function(e) {
			tempRet0 = e
		},
		getTempRet0: function() {
			return tempRet0
		},
		stackSave: function() {
			return STACKTOP
		},
		stackRestore: function(e) {
			STACKTOP = e
		},
		getNativeTypeSize: function(e) {
			switch(e) {
				case "i1":
				case "i8":
					return 1;
				case "i16":
					return 2;
				case "i32":
					return 4;
				case "i64":
					return 8;
				case "float":
					return 4;
				case "double":
					return 8;
				default:
					if("*" === e[e.length - 1]) return Runtime.QUANTUM_SIZE;
					if("i" === e[0]) {
						var r = parseInt(e.substr(1));
						return assert(r % 8 === 0), r / 8
					}
					return 0
			}
		},
		getNativeFieldSize: function(e) {
			return Math.max(Runtime.getNativeTypeSize(e), Runtime.QUANTUM_SIZE)
		},
		STACK_ALIGN: 16,
		prepVararg: function(e, r) {
			return "double" === r || "i64" === r ? 7 & e && (assert(4 === (7 & e)), e += 4) : assert(0 === (3 & e)), e
		},
		getAlignSize: function(e, r, n) {
			return n || "i64" != e && "double" != e ? e ? Math.min(r || (e ? Runtime.getNativeFieldSize(e) : 0), Runtime.QUANTUM_SIZE) : Math.min(r, 8) : 8
		},
		dynCall: function(e, r, n) {
			return n && n.length ? (n.splice || (n = Array.prototype.slice.call(n)), n.splice(0, 0, r), Module["dynCall_" + e].apply(null, n)) : Module["dynCall_" + e].call(null, r)
		},
		functionPointers: [],
		addFunction: function(e) {
			for(var r = 0; r < Runtime.functionPointers.length; r++)
				if(!Runtime.functionPointers[r]) return Runtime.functionPointers[r] = e, 2 * (1 + r);
			throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS."
		},
		removeFunction: function(e) {
			Runtime.functionPointers[(e - 2) / 2] = null
		},
		warnOnce: function(e) {
			Runtime.warnOnce.shown || (Runtime.warnOnce.shown = {}), Runtime.warnOnce.shown[e] || (Runtime.warnOnce.shown[e] = 1, Module.printErr(e))
		},
		funcWrappers: {},
		getFuncWrapper: function(e, r) {
			assert(r), Runtime.funcWrappers[r] || (Runtime.funcWrappers[r] = {});
			var n = Runtime.funcWrappers[r];
			return n[e] || (n[e] = function() {
				return Runtime.dynCall(r, e, arguments)
			}), n[e]
		},
		getCompilerSetting: function(e) {
			throw "You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work"
		},
		stackAlloc: function(e) {
			var r = STACKTOP;
			return STACKTOP = STACKTOP + e | 0, STACKTOP = STACKTOP + 15 & -16, r
		},
		staticAlloc: function(e) {
			var r = STATICTOP;
			return STATICTOP = STATICTOP + e | 0, STATICTOP = STATICTOP + 15 & -16, r
		},
		dynamicAlloc: function(e) {
			var r = DYNAMICTOP;
			if(DYNAMICTOP = DYNAMICTOP + e | 0, DYNAMICTOP = DYNAMICTOP + 15 & -16, DYNAMICTOP >= TOTAL_MEMORY) {
				var n = enlargeMemory();
				if(!n) return DYNAMICTOP = r, 0
			}
			return r
		},
		alignMemory: function(e, r) {
			var n = e = Math.ceil(e / (r ? r : 16)) * (r ? r : 16);
			return n
		},
		makeBigInt: function(e, r, n) {
			var t = n ? +(e >>> 0) + 4294967296 * +(r >>> 0) : +(e >>> 0) + 4294967296 * +(0 | r);
			return t
		},
		GLOBAL_BASE: 8,
		QUANTUM_SIZE: 4,
		__dummy__: 0
	};
	Module.Runtime = Runtime;
	var __THREW__ = 0,
		ABORT = !1,
		EXITSTATUS = 0,
		undef = 0,
		tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat, tempI64, tempI64b, tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9, globalScope = this,
		cwrap, ccall;
	! function() {
		function parseJSFunc(e) {
			var r = e.toString().match(sourceRegex).slice(1);
			return {
				arguments: r[0],
				body: r[1],
				returnValue: r[2]
			}
		}
		var JSfuncs = {
				stackSave: function() {
					Runtime.stackSave()
				},
				stackRestore: function() {
					Runtime.stackRestore()
				},
				arrayToC: function(e) {
					var r = Runtime.stackAlloc(e.length);
					return writeArrayToMemory(e, r), r
				},
				stringToC: function(e) {
					var r = 0;
					return null !== e && void 0 !== e && 0 !== e && (r = Runtime.stackAlloc((e.length << 2) + 1), writeStringToMemory(e, r)), r
				}
			},
			toC = {
				string: JSfuncs.stringToC,
				array: JSfuncs.arrayToC
			};
		ccall = function(e, r, n, t, i) {
			var o = getCFunc(e),
				a = [],
				s = 0;
			if(t)
				for(var l = 0; l < t.length; l++) {
					var f = toC[n[l]];
					f ? (0 === s && (s = Runtime.stackSave()), a[l] = f(t[l])) : a[l] = t[l]
				}
			var u = o.apply(null, a);
			if("string" === r && (u = Pointer_stringify(u)), 0 !== s) {
				if(i && i.async) return void EmterpreterAsync.asyncFinalizers.push(function() {
					Runtime.stackRestore(s)
				});
				Runtime.stackRestore(s)
			}
			return u
		};
		var sourceRegex = /^function\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/,
			JSsource = {};
		for(var fun in JSfuncs) JSfuncs.hasOwnProperty(fun) && (JSsource[fun] = parseJSFunc(JSfuncs[fun]));
		cwrap = function cwrap(ident, returnType, argTypes) {
			argTypes = argTypes || [];
			var cfunc = getCFunc(ident),
				numericArgs = argTypes.every(function(e) {
					return "number" === e
				}),
				numericRet = "string" !== returnType;
			if(numericRet && numericArgs) return cfunc;
			var argNames = argTypes.map(function(e, r) {
					return "$" + r
				}),
				funcstr = "(function(" + argNames.join(",") + ") {",
				nargs = argTypes.length;
			if(!numericArgs) {
				funcstr += "var stack = " + JSsource.stackSave.body + ";";
				for(var i = 0; i < nargs; i++) {
					var arg = argNames[i],
						type = argTypes[i];
					if("number" !== type) {
						var convertCode = JSsource[type + "ToC"];
						funcstr += "var " + convertCode.arguments + " = " + arg + ";", funcstr += convertCode.body + ";", funcstr += arg + "=" + convertCode.returnValue + ";"
					}
				}
			}
			var cfuncname = parseJSFunc(function() {
				return cfunc
			}).returnValue;
			if(funcstr += "var ret = " + cfuncname + "(" + argNames.join(",") + ");", !numericRet) {
				var strgfy = parseJSFunc(function() {
					return Pointer_stringify
				}).returnValue;
				funcstr += "ret = " + strgfy + "(ret);"
			}
			return numericArgs || (funcstr += JSsource.stackRestore.body.replace("()", "(stack)") + ";"), funcstr += "return ret})", eval(funcstr)
		}
	}(), Module.ccall = ccall, Module.cwrap = cwrap, Module.setValue = setValue, Module.getValue = getValue;
	var ALLOC_NORMAL = 0,
		ALLOC_STACK = 1,
		ALLOC_STATIC = 2,
		ALLOC_DYNAMIC = 3,
		ALLOC_NONE = 4;
	Module.ALLOC_NORMAL = ALLOC_NORMAL, Module.ALLOC_STACK = ALLOC_STACK, Module.ALLOC_STATIC = ALLOC_STATIC, Module.ALLOC_DYNAMIC = ALLOC_DYNAMIC, Module.ALLOC_NONE = ALLOC_NONE, Module.allocate = allocate, Module.getMemory = getMemory, Module.Pointer_stringify = Pointer_stringify, Module.AsciiToString = AsciiToString, Module.stringToAscii = stringToAscii, Module.UTF8ArrayToString = UTF8ArrayToString, Module.UTF8ToString = UTF8ToString, Module.stringToUTF8Array = stringToUTF8Array, Module.stringToUTF8 = stringToUTF8, Module.lengthBytesUTF8 = lengthBytesUTF8, Module.UTF16ToString = UTF16ToString, Module.stringToUTF16 = stringToUTF16, Module.lengthBytesUTF16 = lengthBytesUTF16, Module.UTF32ToString = UTF32ToString, Module.stringToUTF32 = stringToUTF32, Module.lengthBytesUTF32 = lengthBytesUTF32, Module.stackTrace = stackTrace;
	for(var PAGE_SIZE = 4096, HEAP, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64, STATIC_BASE = 0, STATICTOP = 0, staticSealed = !1, STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0, DYNAMIC_BASE = 0, DYNAMICTOP = 0, TOTAL_STACK = Module.TOTAL_STACK || 65536, TOTAL_MEMORY = Module.TOTAL_MEMORY || 524288, totalMemory = 65536; totalMemory < TOTAL_MEMORY || totalMemory < 2 * TOTAL_STACK;) totalMemory < 16777216 ? totalMemory *= 2 : totalMemory += 16777216;
	totalMemory !== TOTAL_MEMORY && (Module.printErr("increasing TOTAL_MEMORY to " + totalMemory + " to be compliant with the asm.js spec (and given that TOTAL_STACK=" + TOTAL_STACK + ")"), TOTAL_MEMORY = totalMemory), assert("undefined" != typeof Int32Array && "undefined" != typeof Float64Array && !!new Int32Array(1).subarray && !!new Int32Array(1).set, "JS engine does not provide full typed array support");
	var buffer;
	buffer = new ArrayBuffer(TOTAL_MEMORY), HEAP8 = new Int8Array(buffer), HEAP16 = new Int16Array(buffer), HEAP32 = new Int32Array(buffer), HEAPU8 = new Uint8Array(buffer), HEAPU16 = new Uint16Array(buffer), HEAPU32 = new Uint32Array(buffer), HEAPF32 = new Float32Array(buffer), HEAPF64 = new Float64Array(buffer), HEAP32[0] = 255, assert(255 === HEAPU8[0] && 0 === HEAPU8[3], "Typed arrays 2 must be run on a little-endian system"), Module.HEAP = HEAP, Module.buffer = buffer, Module.HEAP8 = HEAP8, Module.HEAP16 = HEAP16, Module.HEAP32 = HEAP32, Module.HEAPU8 = HEAPU8, Module.HEAPU16 = HEAPU16, Module.HEAPU32 = HEAPU32, Module.HEAPF32 = HEAPF32, Module.HEAPF64 = HEAPF64;
	var __ATPRERUN__ = [],
		__ATINIT__ = [],
		__ATMAIN__ = [],
		__ATEXIT__ = [],
		__ATPOSTRUN__ = [],
		runtimeInitialized = !1,
		runtimeExited = !1;
	Module.addOnPreRun = addOnPreRun, Module.addOnInit = addOnInit, Module.addOnPreMain = addOnPreMain, Module.addOnExit = addOnExit, Module.addOnPostRun = addOnPostRun, Module.intArrayFromString = intArrayFromString, Module.intArrayToString = intArrayToString, Module.writeStringToMemory = writeStringToMemory, Module.writeArrayToMemory = writeArrayToMemory, Module.writeAsciiToMemory = writeAsciiToMemory, Math.imul && Math.imul(4294967295, 5) === -5 || (Math.imul = function(e, r) {
		var n = e >>> 16,
			t = 65535 & e,
			i = r >>> 16,
			o = 65535 & r;
		return t * o + (n * o + t * i << 16) | 0
	}), Math.imul = Math.imul, Math.clz32 || (Math.clz32 = function(e) {
		e >>>= 0;
		for(var r = 0; r < 32; r++)
			if(e & 1 << 31 - r) return r;
		return 32
	}), Math.clz32 = Math.clz32;
	var Math_abs = Math.abs,
		Math_cos = Math.cos,
		Math_sin = Math.sin,
		Math_tan = Math.tan,
		Math_acos = Math.acos,
		Math_asin = Math.asin,
		Math_atan = Math.atan,
		Math_atan2 = Math.atan2,
		Math_exp = Math.exp,
		Math_log = Math.log,
		Math_sqrt = Math.sqrt,
		Math_ceil = Math.ceil,
		Math_floor = Math.floor,
		Math_pow = Math.pow,
		Math_imul = Math.imul,
		Math_fround = Math.fround,
		Math_min = Math.min,
		Math_clz32 = Math.clz32,
		runDependencies = 0,
		runDependencyWatcher = null,
		dependenciesFulfilled = null;
	Module.addRunDependency = addRunDependency, Module.removeRunDependency = removeRunDependency, Module.preloadedImages = {}, Module.preloadedAudios = {};
	var memoryInitializer = null,
		ASM_CONSTS = [];
	STATIC_BASE = 8, STATICTOP = STATIC_BASE + 31776, __ATINIT__.push(), allocate([154, 14, 0, 0, 188, 14, 0, 0, 226, 14, 0, 0, 8, 15, 0, 0, 46, 15, 0, 0, 84, 15, 0, 0, 130, 15, 0, 0, 208, 15, 0, 0, 66, 16, 0, 0, 108, 16, 0, 0, 42, 17, 0, 0, 248, 17, 0, 0, 228, 18, 0, 0, 240, 19, 0, 0, 24, 21, 0, 0, 86, 22, 0, 0, 238, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 13, 0, 15, 0, 17, 0, 19, 0, 20, 0, 26, 0, 31, 0, 5, 0, 6, 0, 5, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 252, 146, 252, 36, 253, 182, 253, 72, 254, 218, 254, 108, 255, 0, 0, 0, 0, 32, 78, 32, 78, 32, 78, 32, 78, 32, 78, 80, 70, 0, 64, 0, 32, 0, 0, 0, 0, 255, 127, 112, 125, 112, 125, 112, 125, 112, 125, 112, 125, 153, 89, 255, 127, 112, 125, 112, 125, 102, 102, 102, 38, 153, 25, 153, 25, 154, 89, 185, 62, 232, 43, 188, 30, 132, 21, 16, 15, 139, 10, 97, 7, 42, 5, 157, 3, 0, 96, 0, 72, 0, 54, 128, 40, 96, 30, 200, 22, 22, 17, 209, 12, 157, 9, 54, 7, 102, 70, 184, 38, 75, 21, 182, 11, 113, 6, 139, 3, 243, 1, 18, 1, 151, 0, 83, 0, 154, 89, 185, 62, 232, 43, 188, 30, 132, 21, 16, 15, 139, 10, 97, 7, 42, 5, 157, 3, 44, 3, 128, 0, 30, 2, 140, 0, 57, 11, 111, 4, 218, 8, 74, 13, 19, 8, 51, 2, 133, 49, 135, 2, 36, 16, 6, 7, 225, 21, 165, 20, 9, 30, 118, 1, 151, 14, 185, 1, 160, 42, 78, 10, 31, 46, 190, 9, 10, 80, 29, 3, 98, 20, 163, 2, 68, 26, 162, 32, 162, 20, 160, 6, 208, 5, 172, 1, 250, 22, 196, 1, 212, 20, 232, 15, 255, 13, 244, 4, 165, 9, 133, 3, 22, 62, 237, 3, 134, 58, 199, 12, 91, 40, 250, 18, 51, 14, 229, 7, 36, 10, 67, 3, 72, 48, 28, 19, 174, 47, 168, 6, 120, 52, 68, 6, 158, 35, 37, 9, 128, 15, 2, 6, 103, 21, 208, 38, 211, 14, 161, 1, 79, 5, 158, 1, 56, 14, 33, 6, 59, 31, 213, 13, 141, 44, 133, 2, 104, 33, 123, 2, 216, 15, 97, 5, 224, 64, 236, 23, 156, 44, 188, 2, 215, 7, 95, 2, 127, 48, 42, 6, 111, 43, 46, 18, 112, 53, 172, 6, 214, 46, 205, 4, 60, 31, 129, 28, 175, 51, 83, 22, 124, 9, 135, 4, 25, 8, 149, 7, 74, 24, 233, 23, 218, 13, 12, 7, 221, 34, 10, 7, 231, 33, 44, 6, 111, 54, 248, 13, 1, 52, 93, 24, 254, 23, 106, 4, 106, 23, 198, 6, 61, 55, 54, 18, 7, 44, 249, 12, 194, 47, 15, 6, 107, 54, 199, 11, 217, 19, 224, 40, 228, 36, 50, 26, 153, 6, 171, 2, 156, 5, 26, 5, 44, 28, 93, 15, 242, 15, 153, 10, 113, 30, 192, 2, 222, 58, 34, 3, 155, 24, 92, 20, 241, 16, 237, 20, 20, 26, 29, 2, 174, 23, 114, 2, 83, 53, 116, 14, 234, 44, 104, 9, 28, 63, 204, 2, 145, 47, 239, 2, 129, 31, 225, 44, 170, 24, 208, 8, 114, 17, 240, 1, 125, 28, 11, 2, 229, 39, 249, 14, 202, 32, 221, 11, 211, 32, 198, 3, 148, 55, 88, 7, 255, 33, 33, 21, 11, 64, 255, 18, 252, 28, 187, 7, 201, 23, 206, 4, 155, 36, 46, 17, 222, 56, 35, 13, 247, 52, 57, 11, 107, 51, 185, 5, 158, 21, 142, 6, 82, 51, 179, 57, 170, 28, 88, 2, 38, 5, 36, 2, 156, 16, 211, 13, 60, 39, 60, 9, 91, 41, 110, 2, 32, 51, 157, 2, 46, 55, 198, 13, 175, 19, 56, 38, 234, 59, 107, 2, 43, 12, 78, 2, 58, 64, 197, 11, 182, 60, 72, 16, 177, 60, 75, 6, 45, 60, 204, 4, 151, 62, 83, 36, 110, 29, 112, 19, 198, 7, 189, 4, 183, 44, 133, 4, 224, 48, 143, 21, 3, 37, 84, 10, 36, 30, 242, 7, 224, 51, 191, 8, 139, 62, 229, 19, 130, 31, 105, 26, 99, 39, 133, 5, 138, 19, 43, 9, 235, 48, 87, 23, 22, 59, 83, 11, 88, 71, 241, 8, 211, 61, 223, 9, 137, 63, 14, 40, 59, 57, 55, 44, 5, 7, 81, 1, 43, 12, 141, 1, 182, 13, 112, 11, 240, 17, 110, 10, 95, 29, 116, 2, 151, 44, 144, 2, 58, 23, 131, 9, 144, 25, 199, 28, 46, 32, 61, 3, 160, 15, 95, 3, 48, 39, 188, 9, 185, 62, 223, 13, 28, 71, 30, 4, 215, 23, 174, 5, 252, 22, 220, 30, 64, 73, 140, 13, 72, 7, 32, 2, 238, 35, 171, 2, 103, 45, 64, 16, 242, 17, 108, 6, 86, 12, 133, 4, 81, 62, 0, 10, 61, 48, 149, 14, 12, 68, 140, 20, 218, 23, 212, 7, 101, 11, 206, 6, 83, 64, 137, 20, 147, 65, 144, 6, 53, 67, 223, 6, 165, 18, 159, 12, 218, 28, 147, 23, 6, 56, 28, 39, 195, 15, 186, 1, 98, 16, 202, 1, 254, 35, 194, 8, 3, 29, 121, 16, 60, 50, 33, 3, 178, 43, 57, 3, 104, 49, 36, 8, 156, 50, 154, 25, 33, 37, 228, 3, 229, 25, 217, 3, 41, 41, 198, 9, 185, 59, 142, 19, 58, 49, 7, 8, 124, 60, 117, 6, 66, 63, 9, 27, 151, 55, 158, 22, 66, 10, 60, 3, 239, 21, 150, 6, 95, 53, 146, 22, 84, 14, 18, 6, 49, 44, 73, 10, 42, 38, 179, 5, 179, 54, 125, 18, 25, 62, 147, 24, 134, 24, 78, 7, 230, 30, 237, 8, 82, 66, 219, 17, 192, 64, 9, 15, 144, 59, 7, 9, 151, 62, 172, 12, 123, 56, 144, 69, 71, 46, 203, 10, 189, 7, 127, 5, 120, 5, 108, 3, 239, 16, 219, 13, 39, 17, 114, 16, 29, 21, 168, 2, 53, 68, 13, 3, 101, 25, 254, 19, 155, 31, 253, 29, 187, 28, 26, 3, 141, 32, 158, 4, 193, 58, 88, 12, 80, 58, 223, 11, 197, 79, 112, 3, 209, 56, 84, 3, 49, 48, 116, 57, 248, 26, 128, 7, 129, 16, 165, 3, 26, 32, 63, 4, 163, 41, 244, 15, 98, 39, 181, 17, 175, 10, 72, 3, 177, 80, 57, 4, 71, 65, 78, 23, 1, 62, 226, 17, 119, 42, 14, 10, 189, 14, 142, 4, 183, 56, 204, 15, 219, 80, 67, 10, 115, 59, 174, 10, 170, 59, 138, 8, 113, 24, 154, 12, 69, 51, 24, 76, 28, 28, 162, 3, 158, 9, 82, 6, 163, 17, 20, 12, 28, 54, 181, 16, 220, 40, 65, 3, 187, 67, 42, 3, 251, 65, 241, 8, 186, 60, 25, 32, 35, 53, 148, 6, 125, 12, 42, 7, 76, 62, 4, 11, 196, 61, 207, 20, 110, 66, 134, 9, 148, 65, 46, 5, 55, 61, 220, 31, 206, 45, 108, 33, 178, 14, 5, 8, 91, 37, 37, 5, 249, 52, 134, 26, 195, 47, 144, 7, 244, 31, 222, 13, 231, 51, 242, 6, 171, 63, 199, 25, 163, 63, 78, 30, 73, 33, 247, 9, 57, 28, 85, 10, 93, 71, 65, 29, 245, 65, 200, 8, 218, 69, 68, 11, 113, 67, 0, 13, 201, 36, 194, 78, 34, 43, 128, 32, 6, 5, 108, 2, 151, 5, 71, 2, 105, 23, 241, 8, 138, 15, 42, 14, 24, 20, 240, 2, 97, 52, 62, 3, 177, 21, 44, 11, 244, 45, 20, 23, 241, 41, 48, 2, 70, 21, 52, 2, 9, 52, 192, 11, 170, 46, 99, 14, 175, 77, 30, 3, 97, 38, 216, 2, 95, 53, 44, 34, 223, 28, 237, 11, 211, 9, 10, 3, 162, 23, 65, 3, 69, 25, 210, 19, 113, 32, 159, 9, 253, 23, 73, 7, 204, 59, 238, 4, 72, 56, 195, 17, 95, 53, 163, 17, 65, 12, 167, 11, 175, 9, 235, 4, 240, 58, 39, 18, 22, 60, 47, 10, 156, 56, 88, 9, 174, 48, 233, 9, 115, 29, 133, 11, 109, 50, 28, 47, 92, 21, 172, 2, 69, 12, 210, 2, 217, 19, 250, 4, 188, 49, 104, 16, 198, 59, 169, 2, 139, 30, 80, 2, 134, 25, 229, 7, 94, 64, 33, 34, 52, 52, 114, 3, 21, 21, 131, 3, 64, 57, 130, 8, 149, 57, 131, 16, 190, 55, 18, 5, 105, 54, 237, 7, 117, 60, 58, 29, 199, 61, 220, 17, 217, 9, 221, 7, 198, 19, 12, 7, 39, 20, 182, 25, 218, 27, 13, 14, 168, 42, 75, 6, 209, 45, 172, 6, 7, 66, 127, 13, 140, 63, 240, 25, 90, 36, 239, 3, 153, 36, 58, 8, 238, 74, 173, 19, 153, 48, 173, 16, 47, 62, 52, 5, 253, 59, 184, 13, 122, 46, 61, 55, 229, 62, 198, 26, 218, 7, 225, 2, 195, 14, 93, 3, 190, 44, 64, 11, 236, 13, 212, 13, 97, 35, 217, 4, 103, 48, 128, 3, 98, 33, 21, 18, 41, 45, 144, 22, 193, 31, 77, 2, 26, 32, 76, 2, 40, 73, 171, 14, 173, 50, 77, 12, 113, 61, 246, 2, 250, 64, 242, 2, 118, 59, 130, 43, 255, 61, 160, 8, 65, 18, 98, 2, 234, 39, 166, 2, 153, 59, 50, 16, 97, 22, 255, 12, 185, 32, 134, 6, 150, 77, 17, 9, 90, 60, 135, 21, 230, 54, 105, 21, 96, 22, 72, 11, 156, 29, 66, 5, 48, 56, 205, 20, 108, 63, 110, 15, 14, 59, 160, 14, 202, 59, 155, 5, 5, 57, 230, 15, 13, 48, 80, 61, 193, 29, 163, 6, 122, 8, 116, 3, 107, 17, 215, 17, 174, 70, 234, 12, 198, 49, 47, 3, 78, 58, 139, 3, 168, 58, 185, 16, 158, 60, 176, 32, 74, 70, 63, 4, 54, 9, 97, 3, 153, 63, 203, 14, 63, 61, 244, 17, 228, 63, 254, 5, 200, 64, 162, 8, 193, 65, 225, 37, 57, 62, 161, 17, 205, 12, 61, 4, 171, 37, 139, 8, 197, 46, 180, 23, 239, 35, 110, 17, 251, 34, 93, 6, 49, 40, 246, 11, 97, 64, 35, 20, 106, 60, 154, 27, 110, 53, 239, 9, 153, 20, 229, 8, 106, 65, 69, 24, 15, 65, 80, 13, 80, 79, 35, 13, 0, 73, 193, 7, 92, 55, 67, 50, 50, 59, 87, 61, 121, 17, 252, 3, 145, 6, 118, 3, 215, 16, 205, 16, 248, 34, 73, 14, 5, 23, 123, 4, 127, 45, 172, 5, 14, 62, 179, 8, 230, 17, 244, 25, 17, 27, 181, 4, 76, 24, 31, 3, 127, 48, 81, 13, 96, 62, 37, 15, 147, 77, 61, 8, 217, 37, 93, 8, 150, 57, 126, 34, 144, 56, 39, 10, 25, 7, 214, 4, 91, 30, 45, 3, 135, 74, 58, 17, 178, 21, 16, 8, 103, 14, 28, 11, 27, 68, 208, 8, 57, 65, 134, 17, 71, 63, 12, 21, 92, 31, 203, 10, 77, 13, 71, 8, 18, 68, 101, 21, 130, 53, 226, 10, 167, 77, 160, 10, 138, 35, 40, 15, 252, 70, 225, 18, 184, 67, 175, 47, 252, 19, 228, 3, 71, 19, 220, 3, 160, 38, 9, 12, 126, 23, 251, 20, 9, 62, 131, 6, 213, 32, 159, 4, 239, 58, 62, 9, 65, 77, 90, 27, 187, 46, 26, 6, 111, 28, 104, 4, 219, 65, 252, 5, 146, 61, 5, 21, 116, 57, 17, 8, 137, 78, 107, 8, 6, 67, 53, 32, 247, 69, 174, 24, 91, 21, 224, 5, 4, 16, 14, 10, 13, 68, 154, 26, 41, 22, 72, 11, 252, 64, 54, 13, 15, 35, 39, 7, 191, 78, 129, 18, 94, 76, 126, 28, 2, 26, 221, 10, 208, 44, 249, 12, 197, 75, 190, 19, 190, 73, 114, 18, 55, 64, 69, 9, 206, 79, 34, 17, 89, 44, 158, 103, 73, 45, 252, 11, 50, 11, 30, 6, 244, 19, 46, 4, 142, 37, 51, 19, 75, 19, 208, 13, 117, 29, 110, 3, 237, 80, 83, 3, 26, 27, 43, 17, 159, 65, 53, 30, 153, 39, 251, 3, 117, 38, 196, 3, 134, 60, 115, 15, 99, 60, 102, 13, 175, 73, 214, 3, 152, 78, 195, 3, 236, 65, 87, 50, 254, 55, 104, 16, 199, 25, 196, 4, 6, 36, 46, 3, 46, 66, 14, 20, 29, 22, 34, 19, 112, 21, 6, 7, 34, 79, 122, 15, 109, 66, 34, 24, 9, 70, 41, 23, 149, 36, 92, 13, 50, 29, 179, 7, 81, 76, 57, 20, 59, 74, 190, 11, 70, 64, 204, 14, 198, 62, 63, 9, 216, 33, 183, 10, 229, 36, 246, 102, 104, 42, 7, 5, 227, 13, 241, 3, 230, 21, 38, 14, 253, 75, 136, 21, 165, 48, 29, 3, 154, 80, 143, 3, 67, 60, 250, 11, 141, 66, 35, 40, 195, 73, 73, 10, 73, 15, 244, 4, 63, 76, 43, 13, 132, 70, 110, 20, 91, 75, 142, 6, 52, 76, 100, 12, 152, 70, 2, 42, 241, 64, 189, 26, 62, 12, 250, 8, 117, 42, 133, 9, 220, 60, 1, 27, 53, 49, 53, 13, 108, 43, 225, 12, 122, 65, 120, 9, 165, 73, 59, 26, 19, 67, 159, 38, 199, 49, 45, 10, 233, 34, 68, 12, 89, 74, 84, 30, 171, 71, 40, 15, 251, 79, 98, 14, 146, 76, 52, 13, 244, 50, 173, 75, 30, 41, 84, 90, 1, 0, 3, 0, 0, 0, 1, 0, 2, 0, 4, 0, 82, 120, 26, 113, 81, 106, 240, 99, 241, 93, 78, 88, 2, 83, 7, 78, 89, 73, 242, 68, 51, 115, 174, 103, 80, 93, 251, 83, 149, 75, 6, 68, 56, 61, 25, 55, 150, 49, 161, 44, 205, 76, 21, 46, 166, 27, 151, 16, 244, 9, 249, 5, 149, 3, 38, 2, 74, 1, 198, 0, 249, 79, 26, 80, 59, 80, 92, 80, 125, 80, 164, 80, 197, 80, 236, 80, 13, 81, 52, 81, 85, 81, 124, 81, 157, 81, 196, 81, 236, 81, 19, 82, 58, 82, 97, 82, 137, 82, 176, 82, 215, 82, 255, 82, 38, 83, 84, 83, 123, 83, 169, 83, 208, 83, 254, 83, 38, 84, 84, 84, 129, 84, 175, 84, 221, 84, 11, 85, 57, 85, 103, 85, 149, 85, 201, 85, 247, 85, 43, 86, 89, 86, 142, 86, 194, 86, 247, 86, 43, 87, 95, 87, 148, 87, 200, 87, 3, 88, 56, 88, 115, 88, 174, 88, 233, 88, 36, 89, 95, 89, 154, 89, 219, 89, 22, 90, 88, 90, 153, 90, 212, 90, 28, 91, 94, 91, 159, 91, 231, 91, 48, 92, 113, 92, 192, 92, 8, 93, 80, 93, 159, 93, 237, 93, 60, 94, 138, 94, 224, 94, 46, 95, 131, 95, 217, 95, 52, 96, 138, 96, 229, 96, 72, 97, 163, 97, 6, 98, 104, 98, 209, 98, 51, 99, 156, 99, 11, 100, 123, 100, 234, 100, 96, 101, 214, 101, 76, 102, 201, 102, 76, 103, 207, 103, 82, 104, 220, 104, 108, 105, 252, 105, 147, 106, 48, 107, 205, 107, 113, 108, 27, 109, 204, 109, 125, 110, 59, 111, 249, 111, 197, 112, 150, 113, 111, 114, 84, 115, 64, 116, 50, 117, 50, 118, 63, 119, 88, 120, 225, 122, 255, 127, 255, 127, 255, 127, 255, 127, 255, 127, 255, 127, 255, 127, 225, 122, 88, 120, 63, 119, 50, 118, 50, 117, 64, 116, 84, 115, 111, 114, 150, 113, 197, 112, 249, 111, 59, 111, 125, 110, 204, 109, 27, 109, 113, 108, 205, 107, 48, 107, 147, 106, 252, 105, 108, 105, 220, 104, 82, 104, 207, 103, 76, 103, 201, 102, 76, 102, 214, 101, 96, 101, 234, 100, 123, 100, 11, 100, 156, 99, 51, 99, 209, 98, 104, 98, 6, 98, 163, 97, 72, 97, 229, 96, 138, 96, 52, 96, 217, 95, 131, 95, 46, 95, 224, 94, 138, 94, 60, 94, 237, 93, 159, 93, 80, 93, 8, 93, 192, 92, 113, 92, 48, 92, 231, 91, 159, 91, 94, 91, 28, 91, 212, 90, 153, 90, 88, 90, 22, 90, 219, 89, 154, 89, 95, 89, 36, 89, 233, 88, 174, 88, 115, 88, 56, 88, 3, 88, 200, 87, 148, 87, 95, 87, 43, 87, 247, 86, 194, 86, 142, 86, 89, 86, 43, 86, 247, 85, 201, 85, 149, 85, 103, 85, 57, 85, 11, 85, 221, 84, 175, 84, 129, 84, 84, 84, 38, 84, 254, 83, 208, 83, 169, 83, 123, 83, 84, 83, 38, 83, 255, 82, 215, 82, 176, 82, 137, 82, 97, 82, 58, 82, 19, 82, 236, 81, 196, 81, 157, 81, 124, 81, 85, 81, 52, 81, 13, 81, 236, 80, 197, 80, 164, 80, 125, 80, 92, 80, 59, 80, 26, 80, 249, 79, 210, 79, 177, 79, 145, 79, 112, 79, 13, 0, 14, 0, 16, 0, 18, 0, 20, 0, 21, 0, 27, 0, 32, 0, 6, 0, 7, 0, 6, 0, 6, 0, 0, 0, 0, 0, 0, 0, 1, 0, 13, 0, 14, 0, 16, 0, 18, 0, 19, 0, 21, 0, 26, 0, 31, 0, 6, 0, 6, 0, 6, 0, 6, 0, 0, 0, 0, 0, 0, 0, 1, 0, 79, 115, 156, 110, 74, 97, 126, 77, 72, 54, 9, 31, 195, 10, 153, 251, 125, 242, 48, 239, 127, 240, 173, 244, 231, 249, 176, 254, 22, 2, 202, 3, 255, 3, 55, 3, 4, 2, 220, 0, 0, 0, 125, 255, 62, 255, 41, 255, 0, 0, 216, 127, 107, 127, 182, 126, 187, 125, 123, 124, 248, 122, 53, 121, 53, 119, 250, 116, 137, 114, 128, 46, 128, 67, 0, 120, 0, 101, 128, 94, 64, 113, 64, 95, 192, 28, 64, 76, 192, 57, 84, 0, 1, 0, 254, 255, 2, 0, 5, 0, 10, 0, 5, 0, 9, 0, 20, 0, 84, 0, 1, 0, 254, 255, 2, 0, 5, 0, 10, 0, 5, 0, 9, 0, 20, 0, 84, 0, 1, 0, 254, 255, 2, 0, 3, 0, 6, 0, 5, 0, 9, 0, 20, 0, 84, 0, 1, 0, 254, 255, 2, 0, 3, 0, 6, 0, 5, 0, 9, 0, 20, 0, 84, 0, 1, 0, 254, 255, 2, 0, 3, 0, 6, 0, 5, 0, 9, 0, 20, 0, 84, 0, 1, 0, 254, 255, 2, 0, 3, 0, 6, 0, 10, 0, 19, 0, 20, 0, 84, 0, 1, 0, 254, 255, 2, 0, 3, 0, 6, 0, 5, 0, 9, 0, 20, 0, 94, 0, 0, 0, 253, 255, 3, 0, 3, 0, 6, 0, 5, 0, 9, 0, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 19, 0, 19, 0, 19, 0, 19, 0, 23, 0, 39, 0, 57, 0, 5, 0, 8, 0, 8, 0, 7, 0, 8, 0, 7, 0, 2, 0, 8, 0, 4, 0, 7, 0, 2, 0, 4, 0, 7, 0, 2, 0, 8, 0, 4, 0, 7, 0, 2, 0, 8, 0, 8, 0, 7, 0, 8, 0, 7, 0, 2, 0, 6, 0, 4, 0, 7, 0, 2, 0, 6, 0, 4, 0, 7, 0, 2, 0, 6, 0, 4, 0, 7, 0, 2, 0, 6, 0, 8, 0, 9, 0, 9, 0, 8, 0, 9, 0, 2, 0, 6, 0, 4, 0, 9, 0, 2, 0, 6, 0, 8, 0, 9, 0, 2, 0, 6, 0, 4, 0, 9, 0, 2, 0, 6, 0, 8, 0, 9, 0, 9, 0, 8, 0, 11, 0, 3, 0, 7, 0, 4, 0, 11, 0, 3, 0, 7, 0, 8, 0, 11, 0, 3, 0, 7, 0, 4, 0, 11, 0, 3, 0, 7, 0, 8, 0, 9, 0, 9, 0, 8, 0, 13, 0, 4, 0, 7, 0, 5, 0, 13, 0, 4, 0, 7, 0, 8, 0, 13, 0, 4, 0, 7, 0, 5, 0, 13, 0, 4, 0, 7, 0, 9, 0, 9, 0, 9, 0, 8, 0, 13, 0, 4, 0, 4, 0, 5, 0, 6, 0, 13, 0, 4, 0, 4, 0, 5, 0, 8, 0, 13, 0, 4, 0, 4, 0, 5, 0, 6, 0, 13, 0, 4, 0, 4, 0, 5, 0, 8, 0, 9, 0, 9, 0, 8, 0, 1, 0, 1, 0, 1, 0, 1, 0, 10, 0, 10, 0, 7, 0, 7, 0, 5, 0, 1, 0, 1, 0, 1, 0, 1, 0, 10, 0, 10, 0, 7, 0, 7, 0, 8, 0, 1, 0, 1, 0, 1, 0, 1, 0, 10, 0, 10, 0, 7, 0, 7, 0, 5, 0, 1, 0, 1, 0, 1, 0, 1, 0, 10, 0, 10, 0, 7, 0, 7, 0, 7, 0, 8, 0, 9, 0, 8, 0, 6, 0, 9, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 5, 0, 6, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 5, 0, 9, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 5, 0, 6, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 5, 0, 3, 0, 8, 0, 9, 0, 9, 0, 6, 0, 95, 0, 103, 0, 118, 0, 134, 0, 148, 0, 159, 0, 204, 0, 244, 0, 39, 0, 43, 0, 38, 0, 37, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 48, 0, 49, 0, 61, 0, 62, 0, 82, 0, 83, 0, 47, 0, 46, 0, 45, 0, 44, 0, 81, 0, 80, 0, 79, 0, 78, 0, 17, 0, 18, 0, 20, 0, 22, 0, 77, 0, 76, 0, 75, 0, 74, 0, 29, 0, 30, 0, 43, 0, 42, 0, 41, 0, 40, 0, 38, 0, 39, 0, 16, 0, 19, 0, 21, 0, 50, 0, 51, 0, 59, 0, 60, 0, 63, 0, 64, 0, 72, 0, 73, 0, 84, 0, 85, 0, 93, 0, 94, 0, 32, 0, 33, 0, 35, 0, 36, 0, 53, 0, 54, 0, 56, 0, 57, 0, 66, 0, 67, 0, 69, 0, 70, 0, 87, 0, 88, 0, 90, 0, 91, 0, 34, 0, 55, 0, 68, 0, 89, 0, 37, 0, 58, 0, 71, 0, 92, 0, 31, 0, 52, 0, 65, 0, 86, 0, 7, 0, 6, 0, 5, 0, 4, 0, 3, 0, 2, 0, 1, 0, 0, 0, 15, 0, 14, 0, 13, 0, 12, 0, 11, 0, 10, 0, 9, 0, 8, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 46, 0, 65, 0, 84, 0, 45, 0, 44, 0, 43, 0, 64, 0, 63, 0, 62, 0, 83, 0, 82, 0, 81, 0, 102, 0, 101, 0, 100, 0, 42, 0, 61, 0, 80, 0, 99, 0, 28, 0, 47, 0, 66, 0, 85, 0, 18, 0, 41, 0, 60, 0, 79, 0, 98, 0, 29, 0, 48, 0, 67, 0, 17, 0, 20, 0, 22, 0, 40, 0, 59, 0, 78, 0, 97, 0, 21, 0, 30, 0, 49, 0, 68, 0, 86, 0, 19, 0, 16, 0, 87, 0, 39, 0, 38, 0, 58, 0, 57, 0, 77, 0, 35, 0, 54, 0, 73, 0, 92, 0, 76, 0, 96, 0, 95, 0, 36, 0, 55, 0, 74, 0, 93, 0, 32, 0, 51, 0, 33, 0, 52, 0, 70, 0, 71, 0, 89, 0, 90, 0, 31, 0, 50, 0, 69, 0, 88, 0, 37, 0, 56, 0, 75, 0, 94, 0, 34, 0, 53, 0, 72, 0, 91, 0, 0, 0, 1, 0, 4, 0, 5, 0, 3, 0, 6, 0, 7, 0, 2, 0, 13, 0, 15, 0, 8, 0, 9, 0, 11, 0, 12, 0, 14, 0, 10, 0, 16, 0, 28, 0, 74, 0, 29, 0, 75, 0, 27, 0, 73, 0, 26, 0, 72, 0, 30, 0, 76, 0, 51, 0, 97, 0, 50, 0, 71, 0, 96, 0, 117, 0, 31, 0, 77, 0, 52, 0, 98, 0, 49, 0, 70, 0, 95, 0, 116, 0, 53, 0, 99, 0, 32, 0, 78, 0, 33, 0, 79, 0, 48, 0, 69, 0, 94, 0, 115, 0, 47, 0, 68, 0, 93, 0, 114, 0, 46, 0, 67, 0, 92, 0, 113, 0, 19, 0, 21, 0, 23, 0, 22, 0, 18, 0, 17, 0, 20, 0, 24, 0, 111, 0, 43, 0, 89, 0, 110, 0, 64, 0, 65, 0, 44, 0, 90, 0, 25, 0, 45, 0, 66, 0, 91, 0, 112, 0, 54, 0, 100, 0, 40, 0, 61, 0, 86, 0, 107, 0, 39, 0, 60, 0, 85, 0, 106, 0, 36, 0, 57, 0, 82, 0, 103, 0, 35, 0, 56, 0, 81, 0, 102, 0, 34, 0, 55, 0, 80, 0, 101, 0, 42, 0, 63, 0, 88, 0, 109, 0, 41, 0, 62, 0, 87, 0, 108, 0, 38, 0, 59, 0, 84, 0, 105, 0, 37, 0, 58, 0, 83, 0, 104, 0, 0, 0, 1, 0, 4, 0, 3, 0, 5, 0, 6, 0, 13, 0, 7, 0, 2, 0, 8, 0, 9, 0, 11, 0, 15, 0, 12, 0, 14, 0, 10, 0, 28, 0, 82, 0, 29, 0, 83, 0, 27, 0, 81, 0, 26, 0, 80, 0, 30, 0, 84, 0, 16, 0, 55, 0, 109, 0, 56, 0, 110, 0, 31, 0, 85, 0, 57, 0, 111, 0, 48, 0, 73, 0, 102, 0, 127, 0, 32, 0, 86, 0, 51, 0, 76, 0, 105, 0, 130, 0, 52, 0, 77, 0, 106, 0, 131, 0, 58, 0, 112, 0, 33, 0, 87, 0, 19, 0, 23, 0, 53, 0, 78, 0, 107, 0, 132, 0, 21, 0, 22, 0, 18, 0, 17, 0, 20, 0, 24, 0, 25, 0, 50, 0, 75, 0, 104, 0, 129, 0, 47, 0, 72, 0, 101, 0, 126, 0, 54, 0, 79, 0, 108, 0, 133, 0, 46, 0, 71, 0, 100, 0, 125, 0, 128, 0, 103, 0, 74, 0, 49, 0, 45, 0, 70, 0, 99, 0, 124, 0, 42, 0, 67, 0, 96, 0, 121, 0, 39, 0, 64, 0, 93, 0, 118, 0, 38, 0, 63, 0, 92, 0, 117, 0, 35, 0, 60, 0, 89, 0, 114, 0, 34, 0, 59, 0, 88, 0, 113, 0, 44, 0, 69, 0, 98, 0, 123, 0, 43, 0, 68, 0, 97, 0, 122, 0, 41, 0, 66, 0, 95, 0, 120, 0, 40, 0, 65, 0, 94, 0, 119, 0, 37, 0, 62, 0, 91, 0, 116, 0, 36, 0, 61, 0, 90, 0, 115, 0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 26, 0, 87, 0, 27, 0, 88, 0, 28, 0, 89, 0, 29, 0, 90, 0, 30, 0, 91, 0, 51, 0, 80, 0, 112, 0, 141, 0, 52, 0, 81, 0, 113, 0, 142, 0, 54, 0, 83, 0, 115, 0, 144, 0, 55, 0, 84, 0, 116, 0, 145, 0, 58, 0, 119, 0, 59, 0, 120, 0, 21, 0, 22, 0, 23, 0, 17, 0, 18, 0, 19, 0, 31, 0, 60, 0, 92, 0, 121, 0, 56, 0, 85, 0, 117, 0, 146, 0, 20, 0, 24, 0, 25, 0, 50, 0, 79, 0, 111, 0, 140, 0, 57, 0, 86, 0, 118, 0, 147, 0, 49, 0, 78, 0, 110, 0, 139, 0, 48, 0, 77, 0, 53, 0, 82, 0, 114, 0, 143, 0, 109, 0, 138, 0, 47, 0, 76, 0, 108, 0, 137, 0, 32, 0, 33, 0, 61, 0, 62, 0, 93, 0, 94, 0, 122, 0, 123, 0, 41, 0, 42, 0, 43, 0, 44, 0, 45, 0, 46, 0, 70, 0, 71, 0, 72, 0, 73, 0, 74, 0, 75, 0, 102, 0, 103, 0, 104, 0, 105, 0, 106, 0, 107, 0, 131, 0, 132, 0, 133, 0, 134, 0, 135, 0, 136, 0, 34, 0, 63, 0, 95, 0, 124, 0, 35, 0, 64, 0, 96, 0, 125, 0, 36, 0, 65, 0, 97, 0, 126, 0, 37, 0, 66, 0, 98, 0, 127, 0, 38, 0, 67, 0, 99, 0, 128, 0, 39, 0, 68, 0, 100, 0, 129, 0, 40, 0, 69, 0, 101, 0, 130, 0, 8, 0, 7, 0, 6, 0, 5, 0, 4, 0, 3, 0, 2, 0, 14, 0, 16, 0, 9, 0, 10, 0, 12, 0, 13, 0, 15, 0, 11, 0, 17, 0, 20, 0, 22, 0, 24, 0, 23, 0, 19, 0, 18, 0, 21, 0, 56, 0, 88, 0, 122, 0, 154, 0, 57, 0, 89, 0, 123, 0, 155, 0, 58, 0, 90, 0, 124, 0, 156, 0, 52, 0, 84, 0, 118, 0, 150, 0, 53, 0, 85, 0, 119, 0, 151, 0, 27, 0, 93, 0, 28, 0, 94, 0, 29, 0, 95, 0, 30, 0, 96, 0, 31, 0, 97, 0, 61, 0, 127, 0, 62, 0, 128, 0, 63, 0, 129, 0, 59, 0, 91, 0, 125, 0, 157, 0, 32, 0, 98, 0, 64, 0, 130, 0, 1, 0, 0, 0, 25, 0, 26, 0, 33, 0, 99, 0, 34, 0, 100, 0, 65, 0, 131, 0, 66, 0, 132, 0, 54, 0, 86, 0, 120, 0, 152, 0, 60, 0, 92, 0, 126, 0, 158, 0, 55, 0, 87, 0, 121, 0, 153, 0, 117, 0, 116, 0, 115, 0, 46, 0, 78, 0, 112, 0, 144, 0, 43, 0, 75, 0, 109, 0, 141, 0, 40, 0, 72, 0, 106, 0, 138, 0, 36, 0, 68, 0, 102, 0, 134, 0, 114, 0, 149, 0, 148, 0, 147, 0, 146, 0, 83, 0, 82, 0, 81, 0, 80, 0, 51, 0, 50, 0, 49, 0, 48, 0, 47, 0, 45, 0, 44, 0, 42, 0, 39, 0, 35, 0, 79, 0, 77, 0, 76, 0, 74, 0, 71, 0, 67, 0, 113, 0, 111, 0, 110, 0, 108, 0, 105, 0, 101, 0, 145, 0, 143, 0, 142, 0, 140, 0, 137, 0, 133, 0, 41, 0, 73, 0, 107, 0, 139, 0, 37, 0, 69, 0, 103, 0, 135, 0, 38, 0, 70, 0, 104, 0, 136, 0, 7, 0, 6, 0, 5, 0, 4, 0, 3, 0, 2, 0, 1, 0, 0, 0, 16, 0, 15, 0, 14, 0, 13, 0, 12, 0, 11, 0, 10, 0, 9, 0, 8, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0, 31, 0, 115, 0, 116, 0, 117, 0, 118, 0, 119, 0, 120, 0, 72, 0, 73, 0, 161, 0, 162, 0, 65, 0, 68, 0, 69, 0, 108, 0, 111, 0, 112, 0, 154, 0, 157, 0, 158, 0, 197, 0, 200, 0, 201, 0, 32, 0, 33, 0, 121, 0, 122, 0, 74, 0, 75, 0, 163, 0, 164, 0, 66, 0, 109, 0, 155, 0, 198, 0, 19, 0, 23, 0, 21, 0, 22, 0, 18, 0, 17, 0, 20, 0, 24, 0, 25, 0, 37, 0, 36, 0, 35, 0, 34, 0, 80, 0, 79, 0, 78, 0, 77, 0, 126, 0, 125, 0, 124, 0, 123, 0, 169, 0, 168, 0, 167, 0, 166, 0, 70, 0, 67, 0, 71, 0, 113, 0, 110, 0, 114, 0, 159, 0, 156, 0, 160, 0, 202, 0, 199, 0, 203, 0, 76, 0, 165, 0, 81, 0, 82, 0, 92, 0, 91, 0, 93, 0, 83, 0, 95, 0, 85, 0, 84, 0, 94, 0, 101, 0, 102, 0, 96, 0, 104, 0, 86, 0, 103, 0, 87, 0, 97, 0, 127, 0, 128, 0, 138, 0, 137, 0, 139, 0, 129, 0, 141, 0, 131, 0, 130, 0, 140, 0, 147, 0, 148, 0, 142, 0, 150, 0, 132, 0, 149, 0, 133, 0, 143, 0, 170, 0, 171, 0, 181, 0, 180, 0, 182, 0, 172, 0, 184, 0, 174, 0, 173, 0, 183, 0, 190, 0, 191, 0, 185, 0, 193, 0, 175, 0, 192, 0, 176, 0, 186, 0, 38, 0, 39, 0, 49, 0, 48, 0, 50, 0, 40, 0, 52, 0, 42, 0, 41, 0, 51, 0, 58, 0, 59, 0, 53, 0, 61, 0, 43, 0, 60, 0, 44, 0, 54, 0, 194, 0, 179, 0, 189, 0, 196, 0, 177, 0, 195, 0, 178, 0, 187, 0, 188, 0, 151, 0, 136, 0, 146, 0, 153, 0, 134, 0, 152, 0, 135, 0, 144, 0, 145, 0, 105, 0, 90, 0, 100, 0, 107, 0, 88, 0, 106, 0, 89, 0, 98, 0, 99, 0, 62, 0, 47, 0, 57, 0, 64, 0, 45, 0, 63, 0, 46, 0, 55, 0, 56, 0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 23, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 38, 0, 141, 0, 39, 0, 142, 0, 40, 0, 143, 0, 41, 0, 144, 0, 42, 0, 145, 0, 43, 0, 146, 0, 44, 0, 147, 0, 45, 0, 148, 0, 46, 0, 149, 0, 47, 0, 97, 0, 150, 0, 200, 0, 48, 0, 98, 0, 151, 0, 201, 0, 49, 0, 99, 0, 152, 0, 202, 0, 86, 0, 136, 0, 189, 0, 239, 0, 87, 0, 137, 0, 190, 0, 240, 0, 88, 0, 138, 0, 191, 0, 241, 0, 91, 0, 194, 0, 92, 0, 195, 0, 93, 0, 196, 0, 94, 0, 197, 0, 95, 0, 198, 0, 29, 0, 30, 0, 31, 0, 32, 0, 33, 0, 34, 0, 35, 0, 50, 0, 100, 0, 153, 0, 203, 0, 89, 0, 139, 0, 192, 0, 242, 0, 51, 0, 101, 0, 154, 0, 204, 0, 55, 0, 105, 0, 158, 0, 208, 0, 90, 0, 140, 0, 193, 0, 243, 0, 59, 0, 109, 0, 162, 0, 212, 0, 63, 0, 113, 0, 166, 0, 216, 0, 67, 0, 117, 0, 170, 0, 220, 0, 36, 0, 37, 0, 54, 0, 53, 0, 52, 0, 58, 0, 57, 0, 56, 0, 62, 0, 61, 0, 60, 0, 66, 0, 65, 0, 64, 0, 70, 0, 69, 0, 68, 0, 104, 0, 103, 0, 102, 0, 108, 0, 107, 0, 106, 0, 112, 0, 111, 0, 110, 0, 116, 0, 115, 0, 114, 0, 120, 0, 119, 0, 118, 0, 157, 0, 156, 0, 155, 0, 161, 0, 160, 0, 159, 0, 165, 0, 164, 0, 163, 0, 169, 0, 168, 0, 167, 0, 173, 0, 172, 0, 171, 0, 207, 0, 206, 0, 205, 0, 211, 0, 210, 0, 209, 0, 215, 0, 214, 0, 213, 0, 219, 0, 218, 0, 217, 0, 223, 0, 222, 0, 221, 0, 73, 0, 72, 0, 71, 0, 76, 0, 75, 0, 74, 0, 79, 0, 78, 0, 77, 0, 82, 0, 81, 0, 80, 0, 85, 0, 84, 0, 83, 0, 123, 0, 122, 0, 121, 0, 126, 0, 125, 0, 124, 0, 129, 0, 128, 0, 127, 0, 132, 0, 131, 0, 130, 0, 135, 0, 134, 0, 133, 0, 176, 0, 175, 0, 174, 0, 179, 0, 178, 0, 177, 0, 182, 0, 181, 0, 180, 0, 185, 0, 184, 0, 183, 0, 188, 0, 187, 0, 186, 0, 226, 0, 225, 0, 224, 0, 229, 0, 228, 0, 227, 0, 232, 0, 231, 0, 230, 0, 235, 0, 234, 0, 233, 0, 238, 0, 237, 0, 236, 0, 96, 0, 199, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 2, 0, 0, 0, 3, 0, 1, 0, 3, 0, 2, 0, 4, 0, 1, 0, 4, 0, 1, 0, 4, 0, 0, 0, 205, 12, 156, 25, 0, 32, 102, 38, 205, 44, 0, 48, 51, 51, 102, 54, 154, 57, 205, 60, 0, 64, 51, 67, 102, 70, 154, 73, 205, 76, 159, 0, 64, 241, 53, 167, 206, 0, 190, 242, 52, 176, 12, 1, 67, 244, 88, 185, 93, 1, 201, 245, 133, 194, 163, 1, 215, 246, 223, 200, 226, 1, 166, 247, 189, 205, 42, 2, 116, 248, 147, 210, 125, 2, 66, 249, 109, 215, 221, 2, 18, 250, 77, 220, 74, 3, 222, 250, 30, 225, 201, 3, 174, 251, 0, 230, 90, 4, 124, 252, 216, 234, 1, 5, 74, 253, 179, 239, 193, 5, 25, 254, 141, 244, 158, 6, 231, 254, 104, 249, 156, 7, 181, 255, 67, 254, 193, 8, 133, 0, 33, 3, 17, 10, 83, 1, 252, 7, 147, 11, 33, 2, 213, 12, 80, 13, 240, 2, 178, 17, 79, 15, 190, 3, 140, 22, 155, 17, 141, 4, 104, 27, 63, 20, 91, 5, 67, 32, 72, 23, 41, 6, 29, 37, 199, 26, 248, 6, 249, 41, 203, 30, 199, 7, 212, 46, 105, 35, 149, 8, 175, 51, 185, 40, 100, 9, 138, 56, 222, 48, 113, 10, 224, 62, 135, 63, 244, 11, 253, 71, 150, 82, 120, 13, 27, 81, 93, 107, 252, 14, 57, 90, 93, 107, 252, 14, 57, 90, 0, 0, 1, 0, 3, 0, 2, 0, 6, 0, 4, 0, 5, 0, 7, 0, 0, 0, 1, 0, 3, 0, 2, 0, 5, 0, 6, 0, 4, 0, 7, 0, 248, 127, 211, 127, 76, 127, 108, 126, 51, 125, 163, 123, 188, 121, 127, 119, 239, 116, 12, 114, 217, 110, 89, 107, 141, 103, 121, 99, 31, 95, 130, 90, 166, 85, 141, 80, 60, 75, 182, 69, 0, 64, 28, 58, 15, 52, 223, 45, 141, 39, 32, 33, 156, 26, 6, 20, 97, 13, 178, 6, 0, 0, 78, 249, 159, 242, 250, 235, 100, 229, 224, 222, 115, 216, 33, 210, 241, 203, 228, 197, 0, 192, 74, 186, 196, 180, 115, 175, 90, 170, 126, 165, 225, 160, 135, 156, 115, 152, 167, 148, 39, 145, 244, 141, 17, 139, 129, 136, 68, 134, 93, 132, 205, 130, 148, 129, 180, 128, 45, 128, 8, 128, 255, 127, 46, 124, 174, 120, 118, 117, 125, 114, 186, 111, 41, 109, 194, 106, 131, 104, 102, 102, 105, 100, 137, 98, 194, 96, 19, 95, 122, 93, 245, 91, 130, 90, 33, 89, 207, 87, 139, 86, 85, 85, 44, 84, 15, 83, 252, 81, 244, 80, 246, 79, 1, 79, 20, 78, 48, 77, 83, 76, 126, 75, 175, 74, 231, 73, 37, 73, 104, 72, 178, 71, 0, 71, 84, 70, 173, 69, 10, 69, 107, 68, 209, 67, 59, 67, 168, 66, 25, 66, 142, 65, 6, 65, 130, 64, 0, 64, 0, 0, 175, 5, 50, 11, 140, 16, 192, 21, 207, 26, 188, 31, 136, 36, 53, 41, 196, 45, 55, 50, 143, 54, 206, 58, 245, 62, 4, 67, 252, 70, 223, 74, 174, 78, 105, 82, 17, 86, 167, 89, 44, 93, 159, 96, 3, 100, 87, 103, 155, 106, 209, 109, 250, 112, 20, 116, 33, 119, 34, 122, 23, 125, 255, 127, 255, 127, 217, 127, 98, 127, 157, 126, 138, 125, 42, 124, 125, 122, 133, 120, 66, 118, 182, 115, 227, 112, 202, 109, 110, 106, 208, 102, 242, 98, 215, 94, 130, 90, 246, 85, 52, 81, 64, 76, 29, 71, 206, 65, 87, 60, 186, 54, 252, 48, 31, 43, 40, 37, 26, 31, 249, 24, 200, 18, 140, 12, 72, 6, 0, 0, 184, 249, 116, 243, 56, 237, 7, 231, 230, 224, 216, 218, 225, 212, 4, 207, 70, 201, 169, 195, 50, 190, 227, 184, 192, 179, 204, 174, 10, 170, 126, 165, 41, 161, 14, 157, 48, 153, 146, 149, 54, 146, 29, 143, 74, 140, 190, 137, 123, 135, 131, 133, 214, 131, 118, 130, 99, 129, 158, 128, 39, 128, 0, 128, 249, 150, 148, 221, 53, 235, 27, 241, 93, 244, 116, 246, 223, 247, 237, 248, 184, 249, 86, 250, 214, 250, 61, 251, 148, 251, 221, 251, 26, 252, 78, 252, 123, 252, 163, 252, 197, 252, 227, 252, 252, 252, 18, 253, 38, 253, 55, 253, 69, 253, 81, 253, 91, 253, 100, 253, 106, 253, 111, 253, 114, 253, 116, 253, 116, 253, 114, 253, 111, 253, 106, 253, 100, 253, 91, 253, 81, 253, 69, 253, 55, 253, 38, 253, 18, 253, 252, 252, 227, 252, 197, 252, 163, 252, 123, 252, 78, 252, 26, 252, 221, 251, 148, 251, 61, 251, 214, 250, 86, 250, 184, 249, 237, 248, 223, 247, 116, 246, 93, 244, 27, 241, 53, 235, 148, 221, 249, 150, 48, 117, 144, 101, 8, 82, 152, 58, 64, 31, 0, 0, 192, 224, 104, 197, 248, 173, 112, 154, 153, 104, 33, 3, 201, 9, 85, 253, 154, 250, 70, 2, 92, 2, 6, 251, 183, 13, 250, 232, 182, 17, 13, 254, 108, 248, 195, 11, 62, 236, 238, 21, 58, 248, 219, 251, 77, 250, 90, 17, 68, 253, 41, 235, 1, 18, 196, 1, 179, 253, 232, 242, 137, 11, 243, 4, 68, 251, 226, 245, 195, 6, 86, 14, 133, 238, 49, 252, 39, 17, 23, 246, 181, 3, 173, 250, 45, 252, 102, 22, 66, 118, 247, 14, 60, 240, 156, 11, 232, 251, 22, 252, 173, 9, 29, 244, 255, 10, 73, 247, 217, 6, 181, 249, 178, 6, 17, 249, 7, 6, 16, 252, 173, 1, 87, 255, 216, 1, 16, 251, 128, 8, 110, 245, 219, 9, 171, 249, 88, 1, 58, 3, 7, 250, 188, 6, 135, 249, 165, 6, 241, 247, 84, 10, 12, 244, 81, 11, 70, 248, 45, 2, 12, 3, 167, 250, 74, 3, 143, 2, 98, 57, 254, 44, 244, 4, 55, 245, 217, 233, 90, 29, 221, 255, 9, 245, 32, 244, 215, 18, 136, 11, 24, 223, 201, 14, 175, 5, 131, 8, 67, 222, 115, 31, 201, 247, 82, 250, 9, 3, 84, 4, 175, 246, 206, 8, 149, 254, 94, 253, 201, 247, 158, 23, 207, 233, 48, 4, 51, 12, 62, 236, 192, 20, 231, 246, 112, 241, 12, 27, 207, 240, 163, 2, 17, 249, 29, 0, 161, 39, 66, 118, 247, 14, 60, 240, 156, 11, 232, 251, 22, 252, 173, 9, 29, 244, 255, 10, 73, 247, 217, 6, 181, 249, 178, 6, 17, 249, 7, 6, 16, 252, 173, 1, 87, 255, 216, 1, 16, 251, 128, 8, 110, 245, 219, 9, 171, 249, 88, 1, 58, 3, 7, 250, 188, 6, 135, 249, 165, 6, 241, 247, 84, 10, 12, 244, 81, 11, 70, 248, 45, 2, 12, 3, 167, 250, 74, 3, 143, 2, 0, 64, 103, 65, 213, 66, 76, 68, 203, 69, 82, 71, 226, 72, 122, 74, 28, 76, 199, 77, 123, 79, 56, 81, 255, 82, 209, 84, 172, 86, 146, 88, 130, 90, 126, 92, 132, 94, 150, 96, 180, 98, 221, 100, 18, 103, 84, 105, 162, 107, 254, 109, 102, 112, 221, 114, 96, 117, 242, 119, 147, 122, 66, 125, 255, 127, 3, 115, 186, 110, 119, 98, 225, 79, 109, 57, 245, 33, 71, 12, 184, 250, 206, 238, 23, 233, 38, 233, 191, 237, 33, 245, 96, 253, 187, 4, 232, 9, 58, 12, 175, 11, 211, 8, 146, 4, 0, 0, 23, 252, 140, 249, 180, 248, 126, 249, 133, 251, 48, 254, 218, 0, 244, 2, 36, 4, 75, 4, 136, 3, 38, 2, 135, 0, 11, 255, 254, 253, 134, 253, 166, 253, 61, 254, 25, 255, 0, 0, 191, 0, 52, 1, 84, 1, 40, 1, 198, 0, 78, 0, 220, 255, 136, 255, 93, 255, 91, 255, 124, 255, 177, 255, 237, 255, 34, 0, 73, 0, 91, 0, 89, 0, 70, 0, 38, 0, 0, 0, 254, 254, 194, 254, 73, 254, 134, 253, 112, 253, 251, 252, 57, 253, 10, 254, 244, 254, 63, 255, 254, 255, 125, 0, 122, 0, 217, 255, 247, 255, 105, 0, 129, 0, 27, 1, 116, 1, 63, 2, 235, 254, 188, 254, 59, 255, 25, 254, 67, 254, 150, 254, 220, 254, 229, 255, 177, 0, 31, 2, 86, 1, 5, 2, 4, 2, 130, 0, 27, 0, 152, 255, 136, 255, 116, 255, 182, 255, 200, 255, 204, 253, 81, 252, 16, 250, 59, 252, 210, 252, 242, 253, 190, 254, 254, 255, 159, 0, 145, 2, 200, 254, 228, 254, 126, 254, 171, 253, 19, 254, 242, 253, 94, 254, 27, 255, 105, 0, 193, 1, 211, 253, 154, 252, 205, 251, 105, 252, 74, 252, 16, 253, 59, 253, 196, 254, 62, 0, 230, 1, 198, 254, 65, 255, 53, 255, 182, 254, 96, 255, 153, 255, 205, 255, 131, 0, 82, 1, 3, 2, 10, 6, 224, 8, 194, 14, 112, 21, 60, 27, 190, 32, 63, 39, 221, 43, 222, 49, 146, 53, 84, 37, 17, 42, 27, 49, 236, 51, 45, 56, 131, 45, 92, 41, 39, 38, 145, 33, 84, 25, 6, 0, 82, 0, 125, 255, 154, 0, 200, 255, 33, 253, 183, 0, 191, 255, 247, 254, 9, 0, 46, 255, 151, 254, 113, 0, 206, 2, 25, 7, 242, 3, 190, 4, 37, 6, 89, 3, 53, 5, 228, 8, 59, 3, 32, 6, 141, 7, 205, 2, 197, 7, 158, 8, 70, 3, 148, 4, 31, 7, 209, 2, 232, 3, 106, 8, 30, 1, 220, 1, 229, 5, 9, 255, 237, 253, 230, 0, 147, 0, 174, 255, 57, 2, 26, 0, 79, 255, 80, 252, 229, 255, 239, 254, 180, 2, 92, 255, 248, 254, 73, 255, 224, 0, 22, 3, 15, 4, 131, 3, 178, 3, 89, 2, 229, 1, 3, 3, 126, 4, 12, 2, 165, 2, 135, 3, 116, 255, 119, 1, 10, 3, 154, 1, 164, 2, 173, 1, 45, 1, 18, 2, 241, 3, 207, 2, 134, 2, 38, 0, 226, 0, 111, 1, 40, 0, 145, 0, 211, 255, 7, 254, 34, 1, 121, 0, 135, 255, 46, 1, 127, 0, 166, 0, 132, 255, 129, 254, 68, 252, 154, 254, 57, 254, 47, 252, 203, 2, 110, 3, 126, 3, 210, 3, 155, 3, 211, 0, 221, 1, 16, 1, 64, 0, 188, 0, 178, 255, 17, 0, 113, 255, 191, 255, 38, 0, 131, 2, 74, 2, 109, 2, 122, 255, 86, 254, 117, 253, 91, 1, 33, 2, 4, 11, 164, 4, 166, 10, 138, 9, 142, 0, 176, 255, 199, 6, 27, 1, 130, 0, 205, 1, 250, 254, 113, 254, 135, 251, 101, 254, 155, 0, 174, 1, 73, 1, 119, 1, 11, 3, 53, 0, 30, 255, 117, 255, 127, 255, 20, 255, 146, 6, 29, 1, 232, 2, 47, 5, 226, 2, 185, 2, 128, 6, 56, 1, 153, 1, 10, 1, 69, 1, 208, 2, 135, 0, 1, 0, 221, 0, 197, 1, 8, 0, 203, 0, 145, 0, 43, 1, 128, 2, 248, 2, 29, 0, 212, 1, 126, 2, 103, 0, 173, 1, 123, 1, 164, 1, 186, 3, 164, 3, 46, 5, 186, 4, 234, 4, 192, 2, 244, 3, 128, 4, 90, 255, 68, 254, 246, 254, 196, 254, 126, 255, 136, 254, 191, 0, 127, 4, 112, 7, 16, 255, 225, 253, 20, 251, 144, 255, 12, 1, 183, 4, 70, 0, 38, 4, 47, 6, 22, 1, 80, 5, 38, 6, 254, 254, 240, 254, 0, 253, 19, 0, 51, 2, 192, 8, 253, 255, 247, 254, 135, 0, 217, 254, 177, 253, 124, 254, 140, 0, 98, 1, 50, 255, 252, 254, 8, 254, 229, 252, 79, 254, 50, 253, 217, 250, 109, 0, 75, 1, 194, 3, 83, 254, 169, 255, 140, 2, 216, 254, 170, 1, 251, 3, 17, 255, 7, 3, 83, 3, 233, 1, 54, 5, 49, 4, 178, 254, 180, 254, 25, 0, 31, 2, 182, 4, 15, 7, 70, 1, 61, 0, 215, 2, 66, 2, 81, 3, 125, 5, 48, 255, 235, 254, 73, 1, 104, 255, 64, 0, 157, 2, 78, 254, 90, 253, 41, 253, 58, 254, 185, 255, 251, 0, 93, 2, 224, 1, 254, 0, 30, 254, 11, 0, 228, 3, 223, 254, 139, 1, 230, 1, 210, 2, 25, 4, 160, 5, 226, 255, 196, 254, 238, 252, 150, 255, 141, 255, 149, 253, 93, 3, 194, 5, 132, 5, 31, 4, 86, 5, 160, 4, 44, 3, 213, 4, 157, 3, 42, 0, 5, 255, 192, 253, 86, 1, 141, 0, 58, 254, 88, 255, 176, 255, 79, 5, 170, 254, 112, 253, 29, 249, 100, 0, 53, 3, 213, 2, 222, 3, 235, 2, 32, 3, 76, 1, 184, 1, 56, 2, 151, 2, 123, 1, 84, 3, 112, 0, 165, 0, 143, 254, 85, 2, 142, 3, 26, 1, 248, 255, 66, 3, 1, 5, 160, 254, 60, 2, 183, 2, 206, 1, 198, 8, 14, 7, 89, 1, 190, 0, 94, 5, 160, 1, 147, 3, 118, 8, 168, 0, 174, 255, 24, 1, 252, 253, 66, 254, 72, 3, 47, 0, 21, 2, 44, 0, 150, 254, 57, 253, 137, 251, 22, 0, 193, 0, 192, 5, 171, 255, 233, 0, 21, 7, 194, 255, 67, 2, 224, 5, 38, 2, 176, 3, 213, 6, 211, 2, 138, 2, 124, 4, 204, 3, 116, 3, 115, 5, 87, 254, 131, 2, 0, 0, 232, 3, 184, 3, 74, 4, 249, 0, 166, 5, 160, 2, 178, 254, 169, 255, 124, 8, 214, 253, 90, 7, 112, 10, 140, 0, 34, 7, 61, 7, 152, 3, 213, 6, 30, 10, 52, 4, 141, 7, 246, 7, 119, 255, 69, 254, 237, 249, 245, 4, 150, 4, 212, 1, 19, 254, 134, 255, 241, 5, 61, 254, 9, 4, 190, 4, 226, 1, 159, 6, 94, 4, 47, 3, 137, 2, 128, 1, 66, 254, 76, 253, 107, 0, 193, 254, 163, 253, 138, 255, 49, 255, 7, 254, 13, 2, 44, 254, 244, 255, 176, 10, 75, 0, 142, 7, 25, 5, 112, 3, 54, 9, 219, 8, 5, 5, 39, 6, 212, 7, 208, 255, 208, 254, 94, 251, 77, 254, 51, 254, 5, 255, 146, 254, 108, 254, 221, 253, 223, 254, 163, 253, 171, 253, 230, 253, 214, 252, 91, 255, 136, 255, 3, 0, 100, 1, 127, 2, 217, 4, 222, 5, 96, 0, 177, 0, 238, 2, 77, 254, 183, 253, 106, 251, 156, 254, 109, 0, 177, 255, 27, 254, 32, 1, 213, 7, 9, 0, 92, 4, 219, 2, 112, 3, 86, 8, 178, 3, 247, 254, 49, 6, 41, 4, 133, 4, 186, 4, 75, 3, 14, 254, 100, 253, 175, 1, 118, 1, 65, 1, 27, 255, 160, 5, 53, 8, 101, 5, 193, 1, 205, 1, 131, 4, 151, 255, 39, 0, 128, 254, 249, 254, 111, 1, 182, 0, 141, 254, 108, 253, 5, 3, 68, 255, 127, 4, 203, 3, 53, 5, 96, 6, 155, 5, 6, 3, 243, 4, 197, 4, 30, 254, 192, 252, 47, 250, 19, 255, 46, 255, 92, 3, 122, 3, 79, 6, 40, 4, 216, 1, 38, 4, 168, 4, 185, 0, 53, 4, 221, 3, 200, 253, 32, 252, 88, 249, 63, 254, 122, 252, 5, 248, 114, 255, 135, 254, 54, 254, 46, 255, 214, 253, 251, 251, 245, 255, 109, 4, 217, 8, 183, 254, 93, 253, 131, 252, 6, 255, 145, 2, 163, 4, 7, 2, 230, 5, 243, 6, 8, 2, 27, 2, 123, 5, 15, 2, 141, 5, 22, 5, 205, 253, 153, 252, 32, 251, 109, 255, 49, 254, 111, 3, 180, 255, 30, 9, 24, 11, 51, 2, 13, 10, 81, 9, 120, 2, 134, 7, 104, 11, 207, 2, 231, 7, 48, 7, 223, 253, 45, 253, 84, 4, 129, 0, 131, 255, 116, 3, 137, 5, 96, 6, 157, 3, 162, 255, 30, 6, 215, 6, 171, 254, 253, 5, 15, 6, 79, 2, 139, 1, 238, 254, 180, 255, 213, 3, 15, 11, 153, 0, 169, 11, 52, 7, 8, 4, 5, 10, 189, 10, 228, 5, 16, 11, 87, 7, 23, 3, 175, 4, 26, 2, 66, 255, 59, 254, 209, 5, 234, 254, 220, 253, 134, 4, 11, 255, 149, 7, 252, 7, 0, 4, 24, 6, 114, 6, 0, 2, 253, 0, 210, 1, 194, 255, 189, 254, 127, 4, 39, 254, 136, 254, 251, 1, 79, 254, 100, 5, 114, 8, 131, 3, 151, 7, 165, 5, 134, 0, 192, 2, 184, 1, 204, 1, 13, 2, 228, 255, 62, 254, 23, 1, 58, 5, 0, 0, 203, 3, 252, 0, 67, 254, 141, 253, 33, 252, 164, 254, 166, 253, 112, 250, 142, 1, 200, 2, 120, 6, 149, 255, 58, 1, 78, 255, 93, 0, 178, 8, 190, 8, 6, 2, 81, 3, 144, 2, 50, 254, 57, 253, 65, 254, 174, 0, 222, 255, 167, 4, 137, 255, 42, 0, 237, 3, 140, 254, 18, 1, 246, 2, 12, 4, 48, 9, 46, 7, 163, 2, 188, 6, 218, 5, 174, 1, 6, 5, 85, 8, 127, 255, 73, 254, 0, 0, 139, 254, 32, 3, 96, 8, 6, 0, 51, 6, 174, 9, 222, 1, 84, 2, 80, 8, 84, 254, 32, 253, 225, 5, 129, 1, 178, 0, 212, 3, 139, 0, 193, 1, 201, 4, 242, 253, 182, 252, 42, 252, 145, 0, 18, 6, 218, 4, 111, 2, 168, 5, 144, 2, 93, 1, 248, 3, 202, 5, 31, 0, 232, 254, 159, 1, 196, 254, 212, 2, 105, 6, 104, 1, 34, 4, 44, 2, 76, 254, 154, 254, 177, 4, 157, 254, 99, 4, 147, 7, 145, 1, 48, 6, 200, 8, 241, 253, 12, 252, 99, 1, 233, 0, 238, 0, 185, 8, 218, 253, 127, 252, 129, 253, 147, 254, 11, 254, 165, 7, 133, 1, 68, 7, 85, 6, 162, 0, 108, 4, 240, 4, 19, 255, 150, 4, 110, 5, 128, 253, 101, 254, 116, 0, 28, 255, 158, 6, 250, 8, 103, 6, 138, 8, 219, 8, 50, 2, 249, 4, 98, 10, 67, 1, 82, 1, 238, 6, 66, 2, 83, 4, 84, 3, 22, 0, 82, 2, 166, 3, 113, 255, 206, 2, 190, 1, 50, 0, 71, 0, 247, 255, 174, 254, 70, 253, 129, 250, 102, 0, 118, 255, 204, 252, 202, 254, 43, 254, 133, 251, 158, 1, 67, 0, 245, 254, 36, 4, 46, 3, 161, 5, 12, 6, 80, 5, 248, 4, 218, 6, 103, 7, 125, 6, 227, 7, 85, 8, 28, 7, 16, 7, 14, 9, 53, 7, 132, 2, 163, 255, 198, 1, 90, 3, 73, 1, 120, 255, 233, 1, 254, 254, 128, 255, 58, 255, 23, 253, 215, 255, 204, 255, 247, 254, 39, 252, 90, 1, 137, 0, 223, 1, 51, 249, 20, 253, 84, 253, 117, 251, 67, 249, 145, 254, 129, 252, 135, 251, 240, 252, 24, 254, 78, 252, 56, 252, 171, 255, 122, 254, 43, 253, 215, 0, 172, 254, 85, 255, 252, 3, 148, 3, 177, 7, 52, 2, 179, 0, 234, 2, 150, 2, 209, 3, 198, 6, 119, 3, 110, 2, 146, 3, 171, 3, 88, 3, 141, 4, 53, 1, 176, 2, 35, 3, 149, 3, 161, 0, 58, 2, 118, 0, 236, 255, 229, 254, 208, 252, 214, 255, 204, 0, 52, 251, 187, 254, 50, 254, 61, 252, 54, 255, 113, 255, 36, 252, 28, 254, 151, 254, 66, 253, 46, 252, 35, 254, 210, 254, 234, 252, 92, 251, 156, 255, 238, 252, 192, 251, 226, 251, 77, 252, 108, 249, 54, 255, 181, 252, 242, 252, 241, 251, 158, 250, 123, 252, 144, 253, 146, 255, 171, 255, 100, 1, 213, 0, 246, 255, 19, 254, 108, 1, 6, 3, 169, 1, 54, 3, 223, 1, 173, 255, 45, 2, 8, 2, 32, 252, 232, 249, 196, 253, 165, 253, 27, 253, 230, 255, 10, 254, 130, 253, 121, 252, 209, 0, 50, 1, 147, 0, 196, 254, 175, 253, 172, 253, 171, 255, 45, 255, 31, 255, 106, 252, 239, 253, 117, 0, 233, 0, 73, 254, 30, 253, 77, 4, 239, 2, 121, 2, 177, 5, 180, 6, 231, 5, 229, 6, 177, 5, 142, 3, 98, 4, 132, 4, 81, 3, 74, 5, 100, 3, 214, 1, 153, 252, 130, 251, 252, 248, 153, 252, 163, 252, 32, 252, 138, 255, 155, 0, 212, 0, 229, 251, 175, 252, 162, 253, 163, 251, 199, 248, 66, 245, 5, 252, 109, 250, 179, 248, 114, 1, 72, 255, 98, 254, 191, 3, 237, 1, 104, 0, 190, 3, 15, 4, 31, 2, 154, 0, 141, 2, 201, 0, 225, 4, 251, 1, 150, 0, 151, 2, 247, 1, 230, 0, 111, 2, 9, 3, 163, 2, 147, 2, 88, 0, 146, 255, 75, 3, 244, 0, 224, 0, 126, 1, 29, 2, 46, 1, 212, 2, 177, 1, 154, 2, 142, 4, 222, 2, 85, 1, 118, 255, 20, 0, 115, 254, 97, 251, 88, 254, 210, 255, 191, 254, 160, 254, 132, 255, 53, 5, 253, 3, 56, 4, 6, 1, 110, 1, 211, 2, 154, 3, 27, 1, 217, 253, 31, 0, 132, 253, 157, 253, 79, 253, 71, 253, 97, 254, 72, 252, 245, 252, 55, 255, 207, 250, 170, 253, 153, 254, 71, 252, 251, 250, 166, 0, 237, 1, 49, 1, 221, 0, 78, 3, 191, 2], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE), allocate([98, 2, 72, 3, 168, 3, 6, 3, 45, 253, 212, 250, 19, 251, 155, 254, 255, 251, 148, 250, 184, 251, 160, 250, 147, 254, 120, 250, 167, 248, 160, 253, 250, 248, 65, 249, 94, 253, 223, 253, 107, 251, 65, 253, 166, 2, 18, 3, 148, 0, 133, 255, 184, 2, 8, 5, 132, 2, 94, 1, 246, 255, 158, 1, 102, 2, 15, 0, 137, 0, 88, 1, 45, 255, 210, 252, 24, 250, 205, 252, 121, 254, 94, 252, 180, 253, 47, 0, 177, 253, 126, 252, 115, 252, 183, 251, 93, 255, 8, 251, 113, 251, 99, 255, 72, 250, 11, 250, 123, 254, 6, 251, 92, 251, 144, 253, 159, 2, 213, 0, 198, 1, 124, 0, 238, 254, 243, 253, 39, 253, 16, 254, 104, 255, 192, 250, 122, 0, 135, 0, 167, 244, 179, 253, 118, 254, 64, 249, 185, 1, 206, 255, 196, 5, 136, 3, 19, 3, 60, 1, 236, 0, 72, 254, 165, 254, 217, 0, 157, 1, 113, 252, 107, 252, 121, 0, 57, 254, 92, 252, 202, 0, 164, 255, 47, 254, 137, 254, 232, 1, 134, 1, 218, 1, 108, 3, 217, 2, 60, 1, 233, 248, 224, 250, 99, 253, 87, 0, 194, 3, 176, 1, 51, 2, 7, 255, 222, 251, 250, 0, 29, 1, 81, 4, 117, 4, 171, 1, 184, 2, 242, 251, 128, 249, 210, 249, 76, 252, 90, 1, 160, 0, 203, 254, 240, 254, 166, 252, 158, 2, 112, 2, 226, 4, 80, 252, 104, 254, 102, 253, 162, 253, 192, 254, 128, 254, 20, 254, 230, 0, 65, 0, 78, 1, 206, 255, 240, 255, 240, 255, 78, 253, 139, 250, 255, 6, 180, 6, 119, 5, 174, 9, 15, 8, 124, 5, 221, 4, 191, 5, 146, 5, 130, 254, 243, 251, 254, 255, 173, 0, 114, 254, 121, 4, 211, 5, 232, 7, 9, 7, 4, 3, 250, 4, 226, 5, 149, 5, 199, 6, 209, 7, 55, 4, 194, 4, 249, 4, 126, 251, 197, 248, 207, 250, 216, 252, 147, 251, 184, 251, 61, 254, 247, 251, 70, 249, 65, 0, 66, 2, 172, 255, 60, 250, 126, 246, 14, 249, 3, 253, 170, 250, 18, 254, 38, 255, 174, 253, 93, 252, 81, 1, 20, 255, 50, 2, 53, 9, 102, 10, 146, 7, 209, 5, 252, 4, 106, 3, 189, 0, 102, 1, 118, 1, 17, 250, 23, 247, 214, 246, 57, 252, 9, 251, 209, 247, 140, 253, 92, 251, 250, 249, 125, 6, 19, 4, 34, 2, 53, 2, 37, 4, 220, 2, 192, 255, 188, 252, 78, 254, 76, 254, 160, 255, 203, 0, 54, 4, 192, 4, 100, 6, 139, 3, 254, 5, 218, 3, 70, 1, 197, 3, 77, 3, 142, 0, 172, 255, 197, 0, 214, 1, 75, 9, 34, 6, 109, 4, 214, 1, 190, 4, 139, 1, 96, 5, 176, 4, 101, 4, 18, 4, 92, 1, 225, 253, 46, 251, 136, 254, 41, 255, 75, 255, 225, 1, 101, 248, 171, 249, 46, 255, 18, 253, 95, 251, 134, 1, 29, 0, 113, 254, 27, 0, 52, 3, 212, 4, 243, 2, 183, 2, 211, 3, 153, 1, 82, 255, 173, 4, 11, 4, 144, 3, 76, 5, 54, 7, 32, 252, 99, 250, 228, 1, 51, 250, 92, 249, 208, 0, 100, 254, 180, 4, 152, 5, 241, 254, 128, 3, 120, 4, 96, 254, 241, 6, 154, 5, 96, 249, 172, 245, 52, 255, 3, 249, 241, 249, 9, 4, 136, 249, 233, 249, 23, 5, 27, 251, 203, 249, 57, 4, 99, 253, 185, 251, 190, 255, 86, 253, 64, 1, 167, 254, 147, 2, 49, 1, 45, 4, 244, 250, 220, 252, 237, 255, 157, 249, 245, 250, 29, 0, 109, 249, 15, 254, 71, 0, 225, 254, 249, 255, 156, 255, 18, 254, 62, 252, 19, 255, 84, 3, 89, 7, 204, 6, 63, 251, 149, 250, 227, 0, 108, 253, 46, 1, 117, 1, 96, 0, 63, 4, 233, 4, 206, 251, 123, 249, 160, 0, 229, 1, 28, 8, 6, 7, 90, 252, 36, 255, 40, 2, 172, 253, 156, 253, 237, 0, 80, 1, 184, 6, 111, 3, 131, 2, 117, 2, 178, 1, 243, 4, 10, 2, 97, 6, 15, 0, 244, 0, 71, 254, 195, 5, 205, 2, 184, 0, 27, 7, 54, 6, 173, 6, 220, 3, 5, 1, 169, 3, 45, 8, 41, 9, 240, 5, 91, 8, 66, 7, 70, 6, 191, 253, 189, 253, 77, 251, 68, 252, 135, 0, 24, 254, 48, 254, 51, 0, 174, 254, 139, 253, 164, 254, 45, 253, 122, 4, 25, 8, 162, 5, 144, 8, 186, 5, 143, 3, 92, 250, 220, 249, 26, 247, 120, 5, 198, 2, 17, 5, 55, 5, 121, 2, 160, 3, 154, 5, 146, 8, 34, 10, 118, 9, 156, 8, 89, 7, 214, 3, 194, 8, 62, 7, 124, 1, 24, 3, 121, 4, 193, 255, 229, 253, 158, 1, 4, 255, 60, 252, 198, 254, 19, 251, 85, 253, 244, 252, 193, 252, 242, 253, 19, 252, 126, 249, 145, 251, 88, 254, 181, 249, 60, 254, 213, 254, 244, 4, 24, 4, 130, 2, 123, 4, 85, 3, 88, 3, 93, 253, 176, 254, 139, 0, 220, 8, 63, 5, 138, 5, 29, 0, 0, 3, 29, 3, 56, 251, 167, 1, 52, 2, 218, 250, 198, 251, 245, 0, 234, 250, 212, 252, 61, 2, 238, 250, 175, 249, 134, 2, 56, 252, 66, 3, 211, 2, 225, 3, 116, 6, 235, 7, 65, 255, 207, 252, 176, 1, 150, 2, 60, 0, 198, 0, 114, 2, 229, 3, 50, 5, 112, 6, 171, 7, 9, 5, 195, 249, 163, 255, 211, 255, 192, 251, 37, 0, 172, 255, 117, 6, 47, 10, 33, 9, 41, 4, 248, 7, 73, 9, 115, 4, 22, 9, 70, 8, 91, 3, 101, 1, 230, 5, 152, 2, 203, 4, 75, 4, 223, 1, 80, 5, 144, 3, 105, 7, 218, 6, 227, 7, 144, 4, 117, 7, 248, 6, 143, 1, 34, 0, 0, 1, 175, 253, 208, 254, 227, 251, 35, 2, 158, 6, 127, 5, 135, 2, 157, 255, 171, 254, 212, 5, 111, 6, 166, 4, 38, 0, 124, 253, 44, 255, 139, 1, 78, 3, 222, 0, 64, 253, 3, 253, 52, 253, 44, 253, 84, 248, 12, 245, 106, 255, 35, 1, 174, 255, 209, 4, 179, 5, 239, 3, 116, 255, 101, 255, 153, 0, 183, 1, 41, 1, 32, 6, 7, 250, 102, 254, 132, 253, 0, 6, 199, 1, 19, 255, 208, 250, 117, 255, 252, 254, 19, 2, 42, 2, 100, 3, 13, 1, 240, 4, 94, 2, 23, 255, 115, 3, 207, 1, 230, 2, 88, 2, 136, 255, 183, 255, 165, 1, 212, 0, 73, 254, 198, 255, 36, 3, 250, 250, 39, 251, 216, 2, 38, 1, 22, 254, 50, 0, 177, 253, 119, 252, 26, 251, 42, 0, 81, 253, 147, 0, 231, 255, 17, 1, 84, 2, 201, 254, 189, 4, 89, 2, 14, 253, 81, 3, 72, 2, 173, 1, 95, 2, 75, 2, 166, 253, 90, 255, 205, 1, 228, 252, 201, 252, 9, 3, 100, 5, 142, 3, 219, 6, 119, 0, 137, 5, 204, 3, 37, 255, 144, 252, 196, 249, 231, 251, 14, 252, 182, 1, 55, 253, 157, 250, 78, 0, 0, 0, 65, 254, 101, 251, 144, 251, 217, 250, 219, 249, 200, 8, 231, 6, 29, 5, 178, 3, 47, 6, 152, 5, 126, 4, 226, 1, 180, 1, 43, 254, 172, 251, 106, 2, 65, 254, 58, 252, 64, 4, 28, 251, 21, 250, 142, 255, 176, 251, 40, 248, 189, 253, 210, 0, 101, 2, 241, 1, 73, 248, 99, 250, 130, 2, 11, 251, 168, 252, 243, 3, 146, 249, 95, 251, 39, 4, 237, 249, 96, 253, 180, 4, 100, 249, 166, 251, 111, 2, 45, 252, 210, 250, 3, 251, 27, 2, 109, 255, 126, 3, 182, 250, 127, 252, 78, 254, 120, 3, 219, 1, 172, 1, 153, 0, 128, 254, 82, 1, 44, 250, 1, 254, 103, 1, 50, 252, 165, 251, 42, 254, 105, 0, 218, 253, 165, 2, 87, 252, 135, 251, 109, 3, 124, 1, 252, 254, 210, 0, 149, 6, 156, 3, 232, 4, 239, 6, 166, 4, 71, 4, 139, 5, 119, 2, 21, 2, 115, 2, 43, 1, 165, 254, 101, 254, 234, 253, 135, 2, 118, 253, 29, 0, 173, 253, 134, 254, 169, 250, 27, 6, 122, 5, 97, 4, 185, 5, 65, 4, 130, 5, 136, 2, 208, 247, 190, 251, 250, 255, 55, 1, 62, 255, 155, 252, 129, 253, 193, 252, 160, 1, 118, 251, 56, 251, 69, 5, 33, 251, 83, 252, 21, 7, 111, 247, 61, 248, 197, 1, 149, 253, 169, 250, 68, 252, 186, 249, 76, 248, 29, 250, 105, 251, 223, 251, 176, 251, 135, 254, 89, 2, 201, 0, 84, 7, 57, 3, 118, 1, 82, 254, 213, 250, 29, 0, 139, 250, 31, 251, 205, 250, 17, 252, 32, 250, 192, 3, 135, 250, 39, 248, 197, 0, 157, 250, 99, 248, 20, 255, 203, 251, 123, 0, 166, 1, 103, 2, 245, 4, 34, 2, 206, 254, 246, 5, 136, 3, 170, 4, 252, 6, 153, 4, 142, 253, 140, 252, 10, 250, 199, 0, 254, 2, 224, 5, 215, 251, 94, 3, 197, 0, 246, 251, 19, 249, 137, 252, 224, 252, 145, 0, 87, 2, 146, 251, 249, 253, 114, 2, 75, 251, 122, 248, 244, 1, 114, 252, 239, 251, 141, 250, 60, 250, 225, 249, 55, 252, 245, 253, 74, 3, 34, 0, 2, 7, 134, 2, 94, 3, 73, 251, 160, 248, 22, 252, 178, 255, 247, 255, 96, 253, 20, 4, 247, 2, 80, 0, 168, 253, 115, 4, 251, 3, 57, 0, 208, 7, 142, 5, 191, 252, 134, 5, 97, 4, 78, 251, 94, 6, 236, 4, 51, 254, 140, 5, 220, 4, 1, 6, 207, 3, 253, 0, 229, 254, 68, 1, 153, 254, 87, 2, 61, 255, 106, 0, 76, 2, 62, 0, 181, 253, 11, 253, 133, 2, 205, 0, 51, 0, 177, 4, 246, 2, 71, 251, 161, 2, 122, 254, 144, 253, 45, 6, 173, 3, 105, 255, 255, 3, 223, 2, 4, 11, 21, 5, 178, 2, 210, 254, 12, 2, 157, 255, 124, 252, 204, 249, 91, 251, 60, 4, 251, 0, 238, 0, 222, 7, 0, 7, 242, 3, 221, 4, 97, 6, 205, 6, 53, 251, 252, 249, 72, 251, 147, 253, 200, 1, 147, 255, 40, 0, 191, 255, 20, 3, 219, 252, 69, 253, 186, 250, 185, 253, 136, 3, 64, 3, 223, 252, 20, 2, 82, 2, 180, 7, 128, 5, 71, 5, 103, 251, 168, 248, 190, 247, 251, 252, 56, 2, 180, 3, 9, 252, 55, 4, 236, 4, 169, 251, 226, 1, 126, 255, 242, 6, 20, 4, 12, 3, 45, 250, 245, 0, 144, 3, 196, 254, 139, 251, 107, 252, 232, 253, 94, 250, 214, 246, 239, 252, 246, 249, 60, 248, 45, 248, 1, 1, 141, 3, 199, 248, 135, 253, 71, 251, 254, 249, 130, 248, 226, 251, 70, 6, 191, 8, 40, 6, 201, 253, 36, 250, 248, 249, 1, 251, 195, 0, 89, 5, 207, 252, 37, 1, 195, 4, 243, 253, 118, 2, 173, 4, 94, 249, 135, 246, 208, 248, 209, 254, 219, 2, 235, 2, 111, 251, 5, 255, 13, 1, 74, 252, 181, 255, 148, 6, 98, 251, 59, 254, 237, 3, 193, 249, 73, 2, 122, 1, 229, 247, 197, 253, 85, 254, 239, 253, 121, 251, 109, 251, 229, 254, 51, 255, 204, 253, 228, 252, 222, 4, 205, 2, 229, 8, 159, 3, 27, 2, 58, 254, 47, 2, 184, 1, 51, 253, 180, 5, 79, 6, 250, 251, 28, 4, 74, 6, 111, 251, 118, 255, 79, 3, 226, 0, 39, 0, 156, 253, 29, 251, 150, 255, 39, 253, 117, 253, 200, 3, 22, 5, 54, 253, 132, 253, 191, 6, 97, 1, 45, 4, 154, 1, 226, 252, 100, 255, 75, 4, 194, 253, 150, 3, 190, 1, 226, 250, 244, 3, 210, 1, 128, 5, 55, 6, 253, 2, 149, 5, 100, 5, 221, 6, 157, 7, 164, 7, 74, 9, 42, 6, 255, 7, 100, 8, 148, 3, 98, 0, 249, 255, 101, 7, 138, 5, 93, 8, 92, 1, 125, 5, 43, 6, 152, 0, 110, 4, 9, 7, 245, 254, 154, 0, 115, 5, 114, 251, 213, 1, 30, 4, 138, 251, 107, 254, 207, 251, 195, 250, 40, 247, 211, 249, 148, 254, 101, 3, 170, 6, 118, 251, 37, 2, 14, 6, 55, 251, 116, 248, 126, 249, 51, 250, 71, 248, 249, 247, 65, 249, 118, 252, 158, 255, 151, 248, 233, 0, 212, 5, 124, 3, 108, 0, 181, 254, 64, 249, 110, 251, 92, 249, 220, 251, 188, 7, 254, 6, 210, 251, 51, 249, 139, 248, 245, 255, 3, 6, 37, 5, 192, 249, 94, 0, 241, 1, 165, 1, 187, 1, 59, 255, 214, 249, 163, 254, 30, 252, 169, 253, 229, 253, 116, 4, 59, 252, 117, 250, 127, 255, 195, 250, 175, 0, 65, 254, 137, 254, 31, 5, 7, 8, 141, 254, 118, 253, 205, 254, 207, 251, 93, 2, 109, 1, 247, 247, 143, 255, 174, 1, 140, 2, 146, 3, 199, 3, 12, 252, 206, 249, 237, 246, 225, 5, 224, 4, 47, 2, 6, 1, 26, 254, 111, 254, 65, 249, 62, 5, 10, 6, 50, 0, 56, 0, 176, 1, 182, 254, 119, 0, 164, 253, 19, 250, 200, 251, 214, 252, 178, 3, 103, 4, 31, 4, 136, 250, 89, 249, 80, 249, 10, 251, 64, 253, 219, 250, 39, 3, 29, 7, 119, 4, 200, 10, 70, 6, 123, 8, 96, 4, 153, 1, 106, 255, 109, 255, 148, 1, 191, 3, 135, 9, 119, 7, 141, 8, 118, 252, 115, 255, 158, 252, 120, 252, 114, 255, 54, 254, 211, 253, 60, 253, 113, 249, 194, 252, 105, 250, 209, 249, 206, 248, 190, 250, 194, 251, 188, 249, 240, 254, 147, 3, 84, 251, 4, 3, 32, 4, 130, 253, 46, 251, 151, 248, 12, 254, 175, 255, 202, 252, 247, 250, 179, 249, 33, 253, 139, 255, 17, 3, 168, 0, 190, 251, 109, 4, 154, 3, 184, 251, 22, 253, 104, 5, 31, 1, 221, 253, 217, 251, 160, 250, 103, 247, 76, 251, 128, 247, 222, 249, 35, 249, 25, 250, 63, 247, 253, 252, 55, 249, 75, 4, 62, 3, 204, 249, 212, 2, 219, 4, 250, 249, 181, 2, 37, 3, 102, 249, 16, 255, 129, 6, 92, 249, 252, 255, 100, 253, 101, 8, 48, 3, 18, 4, 206, 252, 207, 248, 22, 0, 4, 253, 5, 254, 193, 1, 129, 251, 151, 253, 33, 1, 181, 252, 196, 249, 16, 255, 242, 1, 22, 255, 111, 253, 16, 253, 224, 1, 142, 6, 193, 254, 31, 254, 193, 0, 213, 252, 171, 0, 137, 255, 176, 247, 54, 255, 176, 252, 181, 6, 116, 4, 164, 6, 67, 0, 239, 255, 66, 0, 244, 255, 102, 249, 187, 253, 152, 255, 240, 254, 204, 251, 94, 251, 203, 248, 136, 254, 140, 251, 98, 252, 92, 254, 198, 255, 253, 254, 112, 253, 146, 251, 215, 253, 252, 6, 203, 4, 199, 1, 129, 0, 206, 1, 185, 1, 16, 255, 240, 253, 72, 3, 2, 2, 130, 0, 181, 255, 90, 4, 111, 2, 153, 0, 216, 0, 44, 4, 52, 2, 250, 255, 236, 254, 95, 4, 215, 2, 190, 0, 188, 255, 192, 2, 50, 1, 119, 0, 248, 254, 73, 1, 61, 0, 156, 255, 156, 0, 108, 1, 123, 0, 183, 0, 48, 255, 85, 255, 133, 255, 220, 0, 191, 255, 206, 254, 194, 255, 146, 1, 17, 0, 108, 253, 86, 252, 246, 254, 0, 0, 129, 1, 235, 0, 20, 1, 29, 1, 64, 1, 12, 1, 176, 254, 56, 255, 44, 253, 17, 0, 172, 255, 125, 1, 224, 253, 173, 1, 238, 1, 7, 2, 139, 255, 32, 1, 48, 1, 73, 1, 131, 2, 157, 0, 189, 2, 252, 1, 176, 4, 113, 2, 28, 3, 96, 2, 230, 3, 165, 1, 236, 1, 120, 2, 180, 4, 12, 3, 190, 1, 132, 0, 233, 4, 76, 3, 35, 2, 193, 1, 61, 3, 146, 2, 29, 2, 214, 1, 108, 4, 234, 4, 150, 3, 127, 2, 35, 2, 51, 0, 167, 1, 23, 1, 9, 0, 136, 1, 83, 0, 94, 0, 30, 2, 31, 2, 229, 0, 109, 255, 58, 255, 129, 0, 194, 0, 71, 255, 161, 252, 215, 250, 210, 254, 30, 0, 171, 253, 139, 253, 237, 255, 114, 0, 124, 252, 199, 251, 210, 1, 97, 1, 53, 250, 219, 249, 15, 0, 113, 255, 84, 249, 245, 247, 17, 253, 196, 0, 172, 248, 237, 247, 126, 253, 254, 254, 225, 246, 66, 250, 62, 254, 204, 253, 184, 253, 70, 255, 152, 252, 98, 254, 243, 248, 36, 252, 155, 251, 226, 250, 42, 253, 151, 251, 28, 0, 169, 0, 241, 251, 160, 252, 50, 253, 10, 255, 228, 1, 36, 0, 23, 255, 207, 255, 9, 1, 67, 0, 33, 1, 211, 1, 178, 0, 31, 2, 42, 3, 28, 2, 84, 0, 26, 1, 160, 2, 191, 2, 49, 252, 247, 252, 129, 0, 31, 1, 86, 252, 29, 255, 187, 3, 83, 2, 175, 249, 223, 254, 68, 3, 137, 2, 201, 248, 41, 255, 82, 4, 206, 2, 14, 248, 195, 251, 138, 2, 184, 1, 203, 247, 239, 253, 139, 3, 63, 2, 37, 248, 176, 254, 158, 2, 204, 0, 171, 246, 76, 253, 104, 1, 137, 0, 148, 247, 100, 247, 247, 255, 24, 1, 246, 254, 119, 0, 39, 0, 193, 0, 78, 0, 197, 255, 136, 255, 226, 0, 49, 252, 166, 252, 243, 252, 185, 251, 149, 253, 99, 254, 61, 254, 182, 252, 64, 251, 215, 250, 211, 252, 141, 252, 160, 250, 177, 249, 118, 254, 84, 254, 31, 253, 167, 251, 219, 253, 234, 252, 144, 252, 49, 252, 57, 252, 126, 253, 39, 252, 138, 252, 7, 251, 175, 250, 39, 254, 220, 252, 135, 250, 129, 250, 160, 0, 247, 254, 105, 252, 237, 254, 8, 255, 6, 255, 50, 253, 132, 254, 97, 0, 153, 255, 137, 254, 27, 255, 97, 254, 63, 255, 121, 255, 213, 253, 116, 2, 105, 1, 119, 0, 216, 0, 67, 2, 108, 1, 135, 1, 209, 0, 122, 2, 10, 2, 102, 255, 108, 255, 14, 2, 133, 1, 170, 0, 33, 0, 105, 0, 11, 1, 64, 0, 124, 1, 33, 250, 24, 252, 226, 255, 143, 254, 210, 251, 58, 0, 135, 2, 223, 0, 16, 250, 221, 254, 109, 2, 51, 1, 5, 250, 156, 0, 250, 2, 148, 1, 19, 248, 141, 0, 222, 2, 243, 1, 199, 248, 118, 253, 50, 1, 0, 2, 69, 255, 152, 255, 197, 255, 182, 1, 134, 0, 26, 255, 156, 0, 70, 255, 195, 255, 252, 254, 240, 255, 10, 0, 199, 253, 253, 255, 91, 254, 215, 254, 67, 249, 247, 253, 166, 254, 178, 0, 174, 250, 197, 255, 212, 255, 157, 0, 158, 247, 51, 254, 42, 254, 163, 254, 134, 247, 255, 255, 143, 254, 135, 255, 213, 249, 139, 254, 124, 252, 9, 252, 163, 251, 177, 253, 155, 253, 240, 252, 207, 253, 122, 0, 181, 255, 63, 254, 252, 255, 85, 255, 133, 255, 140, 254, 192, 0, 168, 0, 180, 255, 124, 255, 252, 0, 149, 255, 84, 1, 210, 0, 136, 1, 253, 1, 16, 1, 181, 0, 147, 255, 145, 0, 218, 0, 119, 0, 96, 254, 249, 254, 229, 1, 9, 1, 75, 255, 248, 255, 226, 254, 226, 0, 12, 255, 38, 255, 69, 0, 222, 254, 98, 255, 191, 0, 255, 255, 192, 255, 176, 253, 166, 255, 213, 0, 160, 255, 255, 0, 179, 1, 178, 0, 176, 255, 143, 254, 238, 255, 223, 255, 176, 255, 214, 255, 159, 1, 140, 0, 34, 255, 119, 4, 139, 2, 137, 2, 73, 1, 255, 2, 44, 2, 249, 0, 235, 0, 180, 3, 157, 1, 186, 1, 23, 1, 141, 0, 83, 1, 100, 1, 45, 2, 42, 254, 86, 255, 99, 0, 237, 0, 199, 253, 224, 252, 96, 1, 53, 2, 26, 1, 217, 1, 214, 1, 76, 1, 57, 255, 78, 253, 252, 250, 107, 252, 63, 255, 86, 254, 224, 252, 158, 251, 230, 255, 141, 254, 22, 254, 63, 255, 125, 2, 83, 2, 7, 2, 74, 1, 152, 1, 141, 255, 79, 0, 12, 0, 221, 1, 87, 0, 153, 255, 136, 254, 102, 253, 165, 254, 235, 254, 221, 254, 2, 254, 31, 254, 169, 0, 41, 1, 195, 252, 30, 253, 51, 255, 85, 255, 192, 254, 228, 253, 72, 1, 27, 1, 165, 252, 66, 252, 186, 1, 254, 255, 44, 2, 174, 2, 130, 0, 56, 0, 103, 5, 244, 3, 243, 2, 171, 1, 100, 2, 229, 2, 116, 2, 41, 2, 173, 254, 228, 252, 134, 0, 21, 1, 135, 253, 195, 251, 254, 255, 10, 255, 144, 252, 245, 251, 185, 249, 216, 251, 30, 252, 38, 254, 142, 251, 24, 254, 98, 254, 229, 252, 73, 0, 50, 255, 248, 255, 117, 255, 183, 1, 204, 0, 80, 255, 190, 253, 23, 0, 131, 0, 243, 254, 11, 253, 65, 255, 245, 0, 147, 255, 174, 254, 112, 0, 60, 1, 120, 0, 106, 254, 138, 255, 99, 2, 76, 255, 70, 255, 123, 253, 115, 0, 83, 255, 34, 0, 250, 253, 23, 254, 105, 255, 61, 0, 185, 253, 180, 252, 220, 0, 118, 255, 87, 253, 4, 252, 135, 1, 239, 255, 170, 253, 191, 254, 157, 0, 217, 254, 129, 0, 155, 0, 98, 252, 149, 252, 37, 252, 29, 1, 241, 0, 173, 255, 131, 255, 131, 255, 108, 2, 85, 2, 176, 1, 92, 0, 137, 1, 78, 0, 153, 1, 61, 0, 119, 254, 29, 253, 99, 254, 20, 253, 83, 0, 54, 0, 105, 1, 27, 0, 196, 251, 130, 0, 175, 254, 74, 253, 227, 249, 41, 1, 62, 1, 237, 255, 175, 248, 36, 0, 51, 0, 195, 254, 237, 246, 10, 255, 231, 0, 172, 255, 254, 246, 241, 252, 40, 0, 77, 255, 71, 247, 94, 252, 38, 254, 50, 254, 14, 253, 170, 255, 224, 254, 142, 253, 149, 246, 57, 254, 193, 255, 171, 0, 181, 251, 186, 251, 230, 255, 113, 255, 87, 251, 57, 254, 106, 254, 131, 254, 163, 253, 46, 255, 160, 255, 205, 255, 188, 253, 36, 254, 236, 254, 241, 255, 85, 251, 134, 253, 77, 251, 143, 252, 134, 254, 35, 255, 99, 253, 72, 252, 82, 2, 178, 0, 109, 254, 92, 253, 251, 2, 71, 1, 89, 2, 34, 1, 172, 0, 44, 1, 203, 0, 157, 0, 200, 255, 176, 254, 100, 1, 24, 0, 28, 255, 216, 254, 253, 254, 227, 255, 70, 255, 7, 1, 160, 1, 14, 0, 159, 254, 117, 1, 244, 255, 40, 255, 1, 1, 96, 0, 174, 0, 57, 0, 10, 250, 152, 253, 70, 252, 13, 254, 15, 254, 104, 255, 179, 254, 125, 0, 105, 0, 200, 0, 179, 0, 159, 255, 181, 254, 32, 255, 253, 2, 185, 2, 248, 2, 0, 1, 45, 1, 59, 0, 199, 1, 171, 255, 204, 0, 32, 1, 254, 253, 240, 0, 251, 0, 147, 255, 0, 1, 161, 1, 222, 255, 99, 254, 101, 0, 174, 1, 128, 1, 156, 0, 225, 255, 246, 255, 206, 0, 170, 1, 77, 2, 145, 0, 143, 0, 71, 0, 40, 3, 138, 3, 77, 1, 93, 1, 218, 3, 170, 3, 77, 2, 75, 1, 20, 5, 56, 3, 187, 0, 253, 1, 38, 4, 141, 2, 123, 1, 210, 1, 182, 5, 169, 3, 145, 1, 18, 1, 19, 3, 93, 3, 9, 1, 2, 0, 97, 2, 41, 2, 28, 0, 49, 1, 158, 3, 84, 1, 106, 0, 130, 1, 241, 0, 245, 254, 109, 255, 225, 0, 78, 255, 234, 253, 91, 1, 246, 1, 125, 253, 131, 254, 141, 1, 30, 0, 117, 253, 35, 253, 77, 254, 142, 1, 105, 254, 42, 253, 28, 254, 8, 255, 235, 252, 110, 252, 74, 254, 36, 254, 14, 254, 122, 254, 75, 0, 217, 254, 60, 252, 178, 253, 162, 253, 150, 0, 135, 255, 207, 255, 101, 255, 178, 255, 167, 3, 38, 2, 133, 1, 38, 0, 191, 254, 127, 0, 168, 1, 59, 1, 227, 254, 143, 255, 27, 1, 3, 1, 146, 2, 203, 0, 66, 1, 230, 1, 135, 3, 249, 1, 236, 2, 161, 1, 99, 2, 167, 1, 43, 2, 0, 2, 239, 0, 173, 255, 190, 253, 237, 255, 173, 254, 37, 253, 93, 1, 13, 0, 90, 252, 137, 250, 142, 255, 152, 254, 107, 0, 180, 2, 182, 0, 90, 0, 37, 251, 254, 249, 241, 249, 43, 253, 200, 253, 121, 252, 173, 250, 243, 253, 251, 253, 171, 252, 163, 252, 20, 252, 88, 255, 78, 253, 189, 252, 63, 0, 119, 255, 212, 253, 221, 253, 144, 0, 226, 254, 207, 252, 229, 1, 63, 1, 109, 255, 104, 254, 14, 2, 246, 0, 165, 254, 78, 254, 41, 1, 228, 255, 222, 254, 41, 254, 170, 251, 251, 250, 52, 254, 153, 254, 36, 252, 230, 252, 67, 5, 19, 5, 178, 2, 11, 2, 192, 4, 44, 4, 70, 4, 245, 2, 57, 3, 116, 4, 240, 2, 238, 1, 228, 4, 85, 5, 171, 4, 130, 3, 9, 2, 29, 4, 20, 2, 176, 1, 178, 254, 40, 255, 199, 254, 249, 254, 96, 255, 52, 0, 40, 254, 101, 255, 127, 0, 136, 0, 132, 254, 44, 0, 83, 3, 154, 1, 94, 255, 23, 254, 123, 0, 1, 255, 228, 252, 101, 253, 66, 4, 149, 3, 21, 3, 237, 1, 117, 5, 173, 4, 46, 2, 202, 0, 205, 255, 138, 255, 170, 254, 67, 253, 83, 0, 108, 0, 214, 255, 71, 254, 61, 0, 95, 0, 31, 1, 0, 1, 229, 255, 89, 0, 12, 2, 19, 2, 95, 1, 227, 0, 80, 2, 33, 2, 185, 2, 155, 0, 92, 255, 51, 1, 126, 2, 18, 1, 23, 254, 206, 255, 242, 2, 240, 0, 90, 255, 132, 255, 140, 255, 189, 253, 68, 251, 193, 255, 190, 0, 217, 254, 240, 251, 240, 250, 147, 0, 136, 254, 79, 255, 143, 255, 73, 3, 217, 4, 27, 4, 156, 2, 2, 0, 37, 1, 39, 2, 48, 1, 184, 251, 71, 252, 8, 255, 120, 1, 18, 253, 59, 252, 87, 0, 4, 2, 237, 254, 252, 253, 177, 2, 135, 1, 133, 254, 125, 253, 108, 3, 82, 2, 122, 254, 11, 252, 123, 253, 61, 2, 149, 255, 200, 253, 79, 253, 198, 252, 255, 251, 229, 255, 184, 254, 53, 255, 93, 3, 237, 2, 36, 2, 233, 0, 132, 249, 237, 251, 195, 1, 108, 0, 108, 253, 148, 253, 174, 1, 236, 0, 21, 0, 116, 254, 122, 251, 137, 253, 92, 5, 18, 5, 199, 3, 65, 2, 101, 4, 101, 4, 77, 2, 198, 1, 189, 254, 159, 252, 45, 254, 153, 0, 44, 254, 69, 253, 220, 252, 3, 254, 120, 254, 50, 253, 52, 255, 221, 255, 165, 253, 187, 251, 201, 253, 94, 255, 7, 254, 20, 252, 154, 255, 94, 1, 219, 0, 224, 0, 167, 1, 252, 0, 139, 1, 79, 2, 96, 2, 107, 1, 22, 253, 160, 255, 117, 1, 172, 0, 171, 0, 39, 1, 202, 2, 83, 1, 233, 0, 77, 0, 107, 0, 21, 1, 157, 0, 153, 0, 13, 254, 156, 254, 11, 6, 49, 4, 64, 2, 238, 1, 220, 254, 173, 254, 8, 254, 176, 253, 121, 252, 184, 255, 149, 253, 31, 254, 198, 249, 163, 251, 201, 253, 2, 255, 231, 252, 5, 254, 204, 253, 221, 254, 20, 254, 236, 253, 246, 1, 48, 2, 130, 254, 171, 1, 88, 2, 230, 0, 29, 255, 221, 1, 251, 0, 75, 0, 29, 1, 74, 3, 45, 3, 220, 1, 226, 250, 203, 250, 186, 0, 121, 1, 181, 253, 107, 252, 131, 2, 125, 1, 94, 251, 215, 253, 155, 1, 82, 0, 153, 251, 204, 252, 82, 255, 228, 253, 164, 253, 119, 0, 31, 2, 205, 0, 132, 254, 145, 2, 141, 3, 55, 2, 112, 0, 214, 254, 138, 254, 114, 0, 167, 252, 5, 255, 56, 0, 159, 0, 145, 1, 89, 1, 222, 255, 116, 255, 145, 255, 161, 253, 41, 0, 102, 2, 99, 1, 142, 255, 179, 255, 218, 1, 66, 2, 56, 0, 170, 5, 156, 3, 74, 4, 140, 5, 229, 2, 144, 1, 246, 0, 22, 0, 76, 2, 57, 1, 135, 255, 71, 1, 63, 3, 216, 1, 142, 251, 160, 253, 88, 3, 40, 2, 39, 251, 208, 251, 126, 2, 88, 2, 154, 254, 254, 0, 179, 254, 209, 254, 122, 253, 227, 2, 102, 1, 74, 0, 202, 4, 135, 6, 197, 4, 81, 3, 193, 8, 88, 6, 215, 3, 124, 2, 49, 7, 197, 5, 237, 2, 128, 1, 94, 1, 7, 1, 87, 0, 128, 0, 146, 248, 83, 252, 112, 255, 192, 255, 58, 249, 1, 255, 32, 1, 225, 255, 172, 245, 42, 251, 110, 1, 235, 0, 149, 249, 188, 251, 192, 250, 208, 254, 227, 253, 205, 251, 164, 251, 123, 0, 102, 251, 4, 255, 208, 252, 76, 255, 8, 252, 21, 2, 53, 2, 233, 0, 25, 254, 82, 254, 68, 255, 78, 1, 99, 3, 212, 4, 22, 2, 171, 0, 202, 249, 185, 249, 123, 2, 118, 2, 108, 247, 54, 1, 156, 3, 156, 1, 202, 246, 184, 254, 188, 3, 17, 2, 177, 245, 135, 254, 118, 2, 22, 1, 214, 245, 61, 1, 31, 3, 43, 1, 154, 246, 133, 0, 84, 1, 31, 0, 148, 247, 68, 250, 131, 0, 125, 0, 96, 251, 22, 254, 117, 255, 46, 0, 24, 253, 191, 1, 123, 3, 52, 2, 67, 0, 61, 254, 134, 2, 92, 2, 215, 253, 83, 254, 148, 252, 140, 1, 162, 0, 190, 255, 25, 5, 147, 3, 223, 1, 67, 2, 64, 4, 26, 3, 194, 1, 22, 1, 54, 2, 68, 1, 223, 251, 102, 255, 148, 0, 79, 255, 15, 246, 168, 0, 46, 4, 80, 2, 209, 246, 214, 255, 51, 3, 89, 1, 216, 246, 61, 253, 209, 2, 250, 0, 129, 247, 39, 250, 203, 254, 122, 0, 178, 255, 183, 255, 120, 0, 173, 0, 252, 255, 6, 1, 249, 254, 251, 254, 81, 254, 192, 255, 107, 254, 36, 253, 207, 245, 116, 0, 173, 255, 63, 255, 11, 250, 80, 252, 35, 254, 43, 253, 4, 254, 51, 1, 170, 0, 172, 0, 64, 3, 161, 1, 64, 3, 174, 2, 31, 255, 177, 0, 126, 3, 50, 3, 30, 254, 123, 254, 255, 4, 15, 4, 129, 254, 201, 0, 162, 254, 40, 0, 218, 2, 123, 2, 226, 0, 14, 2, 247, 1, 206, 1, 82, 1, 142, 1, 23, 2, 202, 2, 40, 0, 230, 254, 202, 5, 191, 5, 61, 4, 219, 2, 25, 6, 48, 4, 141, 3, 181, 2, 139, 5, 2, 5, 121, 3, 111, 3, 129, 4, 216, 2, 162, 4, 72, 3, 30, 255, 106, 4, 181, 3, 177, 2, 18, 254, 38, 252, 236, 249, 128, 255, 200, 253, 47, 253, 55, 253, 230, 255, 61, 1, 12, 2, 70, 0, 135, 0, 107, 254, 159, 252, 26, 249, 116, 253, 82, 255, 223, 252, 117, 3, 5, 3, 103, 255, 165, 255, 75, 4, 239, 2, 6, 254, 131, 251, 85, 3, 134, 2, 241, 0, 14, 3, 7, 2, 27, 2, 61, 7, 164, 6, 77, 4, 172, 2, 31, 251, 50, 250, 48, 254, 188, 0, 131, 252, 127, 250, 224, 250, 171, 254, 121, 255, 182, 1, 81, 255, 18, 0, 87, 4, 208, 3, 63, 1, 208, 0, 106, 250, 24, 249, 83, 0, 202, 1, 238, 253, 24, 252, 51, 1, 129, 0, 184, 252, 241, 255, 227, 255, 156, 254, 113, 252, 100, 252, 133, 251, 14, 255, 137, 255, 240, 253, 127, 0, 123, 255, 7, 253, 3, 253, 190, 0, 173, 255, 197, 254, 127, 3, 10, 2, 231, 0, 34, 255, 102, 0, 193, 255, 84, 254, 60, 1, 187, 2, 123, 1, 70, 0, 25, 0, 204, 2, 58, 1, 148, 255, 251, 1, 106, 3, 54, 2, 238, 0, 108, 0, 173, 3, 7, 2, 195, 0, 169, 1, 196, 255, 85, 254, 1, 1, 139, 0, 153, 255, 138, 253, 190, 1, 78, 1, 114, 1, 156, 1, 48, 0, 84, 255, 78, 253, 229, 254, 45, 2, 187, 0, 226, 254, 158, 0, 227, 1, 140, 0, 14, 1, 168, 254, 137, 253, 156, 3, 67, 2, 140, 255, 132, 0, 142, 0, 210, 1, 188, 255, 192, 255, 230, 0, 111, 255, 210, 254, 226, 253, 221, 252, 112, 252, 250, 3, 225, 2, 251, 252, 247, 3, 118, 2, 41, 1, 220, 245, 95, 0, 189, 1, 80, 1, 182, 247, 235, 1, 254, 1, 191, 0, 27, 251, 161, 0, 254, 255, 188, 254, 86, 250, 135, 253, 56, 253, 151, 255, 182, 252, 2, 255, 101, 254, 100, 0, 128, 253, 222, 254, 242, 3, 251, 2, 118, 253, 57, 1, 145, 4, 218, 2, 140, 0, 249, 1, 6, 4, 254, 2, 4, 3, 31, 1, 43, 4, 55, 3, 239, 1, 237, 2, 49, 1, 67, 1, 92, 255, 206, 1, 78, 0, 143, 1, 170, 254, 150, 252, 69, 0, 85, 2, 240, 255, 108, 2, 109, 2, 81, 1, 118, 255, 68, 254, 247, 254, 218, 0, 84, 0, 62, 254, 185, 3, 154, 2, 34, 255, 221, 252, 29, 2, 92, 2, 103, 252, 160, 250, 244, 0, 116, 0, 183, 252, 45, 253, 118, 2, 76, 2, 140, 0, 151, 2, 38, 1, 112, 1, 167, 3, 22, 4, 113, 3, 247, 2, 210, 6, 184, 5, 148, 3, 116, 2, 180, 1, 195, 3, 25, 1, 1, 0, 137, 255, 74, 0, 30, 2, 213, 0, 1, 0, 201, 253, 45, 1, 241, 0, 4, 1, 179, 1, 222, 0, 140, 1, 168, 3, 189, 3, 84, 4, 191, 2, 254, 1, 250, 1, 40, 3, 222, 1, 89, 2, 182, 2, 192, 3, 108, 2, 204, 3, 229, 2, 212, 3, 88, 2, 66, 3, 205, 2, 255, 2, 172, 2, 131, 2, 204, 3, 167, 3, 126, 2, 245, 1, 149, 2, 208, 2, 83, 3, 151, 255, 136, 253, 209, 254, 139, 255, 83, 254, 130, 0, 21, 3, 186, 1, 246, 253, 68, 255, 192, 2, 117, 1, 9, 253, 42, 0, 46, 3, 11, 2, 237, 253, 143, 251, 117, 1, 66, 2, 86, 253, 77, 251, 57, 254, 29, 1, 117, 251, 215, 249, 182, 251, 44, 0, 81, 0, 174, 255, 200, 2, 107, 1, 221, 1, 246, 0, 186, 3, 110, 2, 68, 6, 86, 6, 253, 4, 123, 3, 129, 5, 91, 3, 156, 3, 124, 3, 6, 3, 17, 4, 179, 3, 118, 4, 40, 0, 222, 253, 181, 255, 32, 1, 152, 253, 150, 255, 71, 253, 230, 255, 87, 255, 96, 255, 133, 252, 29, 253, 233, 254, 128, 254, 251, 251, 162, 254, 245, 6, 28, 5, 22, 4, 48, 3, 44, 6, 253, 5, 192, 5, 154, 4, 225, 5, 52, 4, 192, 4, 131, 3, 122, 3, 136, 3, 52, 2, 142, 2, 152, 3, 180, 2, 253, 3, 88, 3, 19, 254, 132, 0, 177, 0, 249, 1, 71, 0, 195, 0, 228, 255, 97, 0, 200, 1, 95, 1, 92, 255, 88, 0, 183, 1, 22, 1, 216, 255, 94, 1, 115, 5, 181, 3, 234, 0, 161, 255, 219, 252, 40, 254, 38, 0, 93, 255, 111, 1, 158, 255, 233, 1, 11, 2, 1, 4, 154, 4, 188, 4, 138, 3, 63, 1, 34, 5, 46, 3, 205, 1, 133, 255, 225, 253, 220, 252, 191, 1, 20, 253, 188, 254, 127, 252, 153, 251, 31, 253, 11, 254, 235, 252, 55, 253, 203, 2, 9, 3, 215, 4, 154, 3, 157, 7, 147, 7, 88, 5, 97, 3, 218, 2, 112, 3, 246, 2, 132, 1, 153, 252, 198, 1, 17, 0, 5, 255, 131, 254, 214, 252, 209, 249, 239, 0, 247, 253, 58, 252, 232, 252, 3, 1, 134, 252, 178, 250, 254, 252, 183, 255, 166, 0, 93, 1, 44, 255, 67, 1, 184, 252, 211, 254, 217, 1, 179, 1, 89, 253, 48, 254, 216, 2, 95, 1, 100, 255, 57, 255, 155, 2, 176, 1, 29, 0, 4, 255, 159, 1, 224, 1, 37, 253, 133, 254, 145, 0, 47, 2, 240, 253, 137, 253, 122, 251, 97, 255, 189, 1, 17, 1, 123, 0, 127, 2, 117, 1, 130, 255, 32, 3, 56, 2, 84, 0, 94, 255, 208, 2, 200, 2, 194, 252, 232, 253, 71, 255, 222, 0, 152, 1, 196, 1, 245, 1, 3, 3, 127, 252, 181, 250, 189, 255, 186, 1, 232, 252, 130, 250, 54, 2, 90, 2, 167, 0, 186, 254, 253, 1, 74, 1, 161, 255, 142, 253, 38, 253, 168, 254, 132, 6, 193, 4, 11, 3, 199, 1, 36, 5, 60, 3, 72, 2, 207, 2, 148, 1, 225, 255, 245, 3, 21, 3, 89, 0, 107, 0, 123, 3, 37, 2, 103, 3, 45, 6, 149, 3, 159, 2, 98, 3, 199, 5, 9, 5, 86, 3, 135, 1, 44, 4, 98, 4, 44, 3, 78, 0, 206, 253, 89, 1, 51, 2, 173, 1, 153, 255, 161, 1, 19, 3, 134, 255, 75, 254, 155, 1, 20, 3, 111, 252, 95, 254, 90, 2, 242, 2, 30, 255, 240, 255, 151, 0, 248, 2, 68, 253, 118, 0, 152, 255, 242, 255, 152, 251, 48, 0, 28, 1, 137, 1, 122, 254, 93, 254, 129, 253, 140, 255, 114, 252, 50, 1, 60, 1, 243, 255, 183, 4, 216, 3, 53, 3, 157, 2, 85, 251, 75, 253, 140, 0, 43, 255, 140, 252, 96, 254, 57, 255, 210, 253, 152, 253, 245, 0, 108, 254, 104, 253, 6, 1, 56, 0, 151, 253, 44, 253, 171, 255, 21, 254, 192, 254, 112, 253, 198, 253, 193, 252, 127, 255, 240, 253, 30, 250, 193, 255, 145, 254, 127, 254, 154, 254, 191, 254, 4, 0, 51, 0, 146, 254, 42, 255, 63, 1, 255, 1, 146, 0, 159, 2, 239, 255, 221, 254, 146, 255, 208, 1, 117, 255, 16, 254, 54, 255, 220, 0, 200, 254, 137, 253, 108, 253, 183, 255, 113, 253, 204, 252, 106, 253, 115, 253, 248, 250, 167, 252, 82, 254, 71, 252, 65, 252, 248, 254, 207, 255, 44, 254, 184, 255, 131, 254, 162, 254, 205, 253, 63, 255, 105, 254, 55, 0, 104, 254, 221, 252, 11, 0, 203, 254, 137, 2, 188, 0, 58, 255, 0, 254, 205, 1, 177, 255, 54, 254, 218, 250, 249, 254, 122, 255, 245, 253, 135, 249, 77, 254, 17, 254, 3, 253, 57, 0, 165, 254, 98, 254, 178, 1, 139, 251, 14, 255, 104, 253, 167, 252, 34, 0, 188, 255, 61, 253, 174, 254, 163, 1, 163, 0, 226, 255, 250, 254, 57, 254, 235, 252, 106, 250, 47, 253, 238, 3, 152, 2, 13, 1, 25, 0, 107, 2, 4, 1, 183, 0, 96, 0, 56, 252, 178, 250, 124, 254, 135, 0, 75, 253, 67, 3, 200, 1, 154, 0, 81, 4, 191, 2, 57, 2, 107, 1, 89, 6, 46, 5, 217, 3, 236, 2, 36, 255, 219, 0, 76, 0, 48, 255, 81, 250, 130, 249, 49, 0, 149, 0, 60, 252, 84, 255, 16, 253, 176, 254, 113, 2, 209, 0, 6, 255, 190, 255, 7, 252, 186, 252, 254, 255, 61, 1, 136, 247, 51, 250, 118, 255, 123, 0, 172, 248, 205, 247, 247, 253, 85, 0, 57, 252, 146, 254, 73, 253, 143, 252, 103, 252, 13, 252, 5, 253, 75, 252, 132, 255, 0, 255, 160, 254, 108, 253, 178, 0, 207, 1, 98, 1, 48, 1, 48, 249, 177, 253, 230, 254, 79, 0, 55, 247, 175, 0, 99, 3, 243, 1, 118, 255, 76, 255, 75, 255, 235, 255, 13, 247, 39, 251, 52, 254, 248, 253, 253, 252, 195, 1, 246, 255, 204, 254, 15, 1, 191, 255, 4, 0, 214, 0, 233, 254, 77, 254, 213, 255, 164, 254, 98, 253, 35, 0, 191, 255, 45, 255, 38, 3, 23, 2, 85, 0, 41, 1, 57, 0, 239, 0, 210, 2, 237, 1, 225, 0, 149, 2, 72, 3, 35, 2, 228, 253, 136, 254, 14, 0, 93, 1, 213, 1, 209, 2, 75, 1, 162, 0, 224, 253, 16, 253, 194, 255, 246, 255, 142, 1, 168, 255, 212, 2, 189, 2, 237, 255, 235, 253, 162, 255, 89, 2, 136, 0, 185, 255, 87, 253, 21, 253, 90, 255, 168, 254, 5, 1, 206, 255, 161, 0, 204, 255, 229, 1, 81, 1, 117, 249, 50, 0, 190, 0, 163, 255, 22, 247, 25, 255, 62, 255, 174, 255, 161, 255, 173, 253, 102, 255, 128, 0, 126, 3, 245, 1, 76, 2, 201, 1, 167, 254, 206, 0, 122, 0, 110, 0, 137, 253, 29, 255, 199, 253, 3, 0, 152, 1, 239, 0, 141, 1, 226, 0, 59, 255, 254, 255, 128, 0, 235, 1, 1, 5, 136, 3, 36, 1, 215, 0, 26, 2, 50, 1, 3, 1, 253, 1, 91, 253, 233, 251, 13, 0, 65, 1, 89, 253, 180, 253, 154, 254, 44, 255, 210, 253, 243, 0, 134, 2, 223, 1, 230, 1, 86, 1, 122, 2, 20, 2, 107, 0, 34, 3, 75, 1, 136, 0, 144, 255, 114, 254, 249, 251, 226, 254, 186, 254, 63, 253, 32, 1, 16, 1, 19, 5, 120, 4, 154, 4, 92, 3, 89, 254, 121, 0, 127, 254, 108, 255, 217, 254, 210, 254, 190, 252, 205, 252, 16, 0, 232, 255, 55, 255, 36, 254, 43, 2, 91, 0, 11, 255, 38, 1, 218, 255, 133, 254, 62, 252, 59, 251, 89, 251, 18, 250, 239, 254, 117, 254, 122, 254, 11, 252, 123, 253, 61, 2, 205, 248, 250, 251, 249, 1, 212, 1, 232, 2, 179, 3, 97, 2, 237, 1, 79, 253, 108, 251, 140, 253, 121, 255, 254, 251, 195, 0, 155, 1, 196, 0, 46, 6, 123, 4, 63, 2, 81, 1, 41, 251, 247, 252, 120, 253, 114, 255, 83, 2, 57, 3, 199, 3, 223, 2, 74, 251, 54, 252, 175, 255, 170, 254, 23, 253, 13, 0, 184, 255, 119, 1, 198, 1, 19, 0, 127, 5, 153, 3, 145, 249, 84, 255, 93, 3, 50, 2, 160, 3, 1, 6, 39, 4, 228, 2, 88, 246, 72, 252, 8, 1, 82, 0, 10, 254, 59, 252, 202, 250, 123, 0, 99, 3, 212, 4, 22, 2, 171, 0, 240, 246, 52, 254, 12, 3, 107, 1, 90, 251, 151, 253, 252, 0, 195, 255, 82, 255, 34, 0, 243, 3, 20, 3, 227, 246, 247, 0, 167, 1, 153, 0, 240, 255, 157, 254, 6, 1, 193, 1, 216, 249, 207, 251, 224, 253, 141, 254, 153, 253, 207, 254, 27, 4, 37, 3, 175, 2, 16, 2, 6, 0, 74, 255, 167, 3, 107, 3, 234, 3, 41, 3, 199, 0, 1, 1, 126, 0, 76, 0, 184, 253, 142, 251, 87, 2, 44, 2, 175, 251, 145, 250, 201, 249, 249, 253, 47, 252, 211, 250, 108, 0, 91, 1, 46, 253, 49, 252, 109, 1, 101, 0, 111, 255, 169, 2, 249, 0, 103, 255, 0, 0, 178, 254, 198, 253, 159, 0, 156, 1, 29, 1, 176, 254, 151, 253, 71, 252, 58, 252, 119, 3, 177, 2, 29, 251, 84, 0, 71, 255, 114, 254, 176, 253, 177, 1, 20, 4, 141, 2, 85, 0, 73, 1, 216, 255, 105, 1, 79, 254, 63, 253, 210, 1, 62, 2, 102, 255, 142, 2, 80, 2, 34, 1, 89, 255, 72, 0, 93, 1, 175, 0, 162, 2, 41, 1, 209, 3, 208, 2, 211, 4, 180, 4, 245, 2, 232, 1, 112, 254, 243, 254, 26, 2, 116, 1, 186, 250, 149, 250, 86, 251, 165, 255, 238, 4, 108, 3, 7, 3, 188, 2, 169, 253, 218, 255, 82, 254, 46, 253, 184, 7, 94, 6, 223, 3, 96, 2, 111, 0, 20, 1, 30, 255, 160, 255, 77, 252, 124, 254, 245, 255, 249, 255, 209, 254, 237, 253, 185, 252, 82, 1, 198, 6, 174, 6, 125, 5, 245, 3, 252, 253, 169, 252, 123, 253, 210, 0, 80, 253, 96, 254, 1, 2, 230, 0, 202, 252, 131, 253, 134, 251, 192, 254, 72, 252, 110, 253, 74, 253, 183, 0, 142, 255, 145, 253, 50, 3, 162, 2, 65, 255, 52, 255, 219, 2, 123, 2, 51, 0, 197, 4, 115, 3, 64, 2, 70, 252, 81, 254, 58, 3, 86, 2, 170, 254, 13, 253, 124, 252, 105, 254, 154, 251, 158, 254, 50, 255, 0, 254, 221, 253, 214, 252, 155, 254, 148, 253, 66, 0, 3, 2, 183, 255, 102, 254, 152, 252, 79, 252, 92, 250, 53, 251, 191, 0, 239, 255, 224, 253, 25, 255, 252, 249, 224, 253, 123, 252, 138, 252, 134, 252, 242, 249, 19, 246, 205, 252, 54, 252, 175, 0, 198, 252, 46, 251, 6, 253, 169, 253, 234, 255, 122, 2, 213, 252, 37, 252, 122, 252, 189, 254, 203, 0, 26, 0, 129, 254, 21, 255, 243, 252, 113, 254, 238, 4, 138, 3, 92, 252, 137, 250, 156, 250, 144, 253, 93, 0, 87, 0, 98, 254, 229, 253, 77, 253, 37, 0, 121, 2, 254, 1, 125, 254, 36, 254, 206, 250, 143, 1, 66, 0, 7, 1, 105, 254, 207, 255, 177, 254, 95, 254, 17, 4, 73, 7, 245, 252, 191, 251, 96, 250, 22, 253, 166, 252, 64, 3, 187, 253, 9, 253, 141, 254, 95, 253, 6, 254, 40, 8, 208, 253, 134, 253, 101, 251, 15, 1, 241, 0, 14, 0, 74, 254, 12, 255, 115, 254, 207, 1, 178, 4, 23, 4, 162, 253, 227, 252, 98, 250, 205, 255, 189, 254, 225, 1, 32, 255, 184, 253, 241, 253, 238, 1, 113, 3, 170, 2, 79, 254, 206, 254, 22, 252, 42, 2, 147, 2, 222, 0, 171, 0, 96, 255, 159, 254, 169, 2, 6, 7, 29, 6, 172, 252, 99, 251, 97, 249, 176, 254, 102, 253, 114, 0, 187, 253, 12, 253, 24, 253, 61, 255, 119, 1, 241, 1, 47, 254, 220, 252, 182, 251, 154, 0, 26, 1, 125, 255, 206, 255, 65, 255, 49, 253, 67, 1, 220, 2, 6, 6, 46, 253, 205, 252, 132, 250, 105, 0, 6, 255, 185, 0, 78, 255, 10, 254, 26, 253, 65, 1, 254, 1, 87, 4, 189, 254, 201, 253, 58, 252, 127, 0, 228, 1, 82, 1, 96, 255, 52, 0, 174, 254, 220, 2, 87, 5, 18, 6, 142, 253, 222, 252, 96, 249, 226, 254, 182, 253, 164, 2, 73, 253, 169, 254, 142, 254, 22, 254, 39, 1, 101, 7, 138, 253, 194, 253, 10, 252, 176, 255, 133, 2, 187, 255, 250, 255, 194, 254, 148, 254, 14, 3, 170, 5, 14, 4, 199, 254, 35, 253, 141, 250, 120, 0, 60, 0, 221, 1, 248, 254, 183, 253, 133, 255, 199, 2, 221, 4, 121, 2, 165, 255, 157, 254, 8, 252, 3, 3, 246, 2, 5, 1, 253, 0, 81, 0, 38, 254, 162, 3, 167, 8, 184, 6, 216, 252, 181, 251, 123, 248, 208, 253, 242, 252, 169, 0, 220, 252, 206, 251, 68, 255, 142, 253, 201, 255, 125, 5, 74, 253, 52, 253, 86, 251, 108, 253, 98, 1, 73, 1, 254, 253, 201, 255, 225, 253, 110, 1, 9, 4, 158, 4, 110, 253, 65, 252, 179, 250, 201, 255, 72, 255, 93, 0, 163, 253, 226, 254, 106, 253, 148, 1, 193, 1, 59, 3, 226, 254, 162, 254, 17, 251, 116, 2, 50, 1, 227, 0, 240, 255, 147, 0, 145, 253, 186, 0, 155, 3, 98, 8, 94, 253, 134, 252, 186, 249, 69, 254, 28, 255, 83, 1, 143, 254, 234, 252, 103, 254, 231, 0, 86, 0, 189, 5, 64, 254, 187, 253, 219, 251, 82, 2, 194, 1, 79, 255, 132, 255, 86, 255, 65, 254, 159, 2, 135, 4, 124, 5, 36, 254, 101, 253, 25, 250, 179, 255, 118, 255, 204, 2, 79, 255, 140, 254, 131, 254, 195, 1, 166, 3, 147, 3, 6, 255, 80, 254, 202, 252, 16, 1, 60, 3, 190, 1, 26, 0, 19, 0, 225, 255, 186, 2, 156, 6, 120, 8, 122, 253, 47, 252, 124, 248, 77, 255, 39, 254, 12, 1, 133, 254, 23, 253, 77, 253, 11, 0, 127, 0, 9, 4, 24, 254, 107, 252, 199, 252, 61, 0, 67, 1, 135, 0, 147, 0, 111, 255, 82, 253, 173, 2, 18, 3, 146, 6, 6, 254, 176, 252, 239, 250, 35, 0, 90, 0, 222, 0, 233, 255, 166, 254, 98, 253, 199, 1, 79, 2, 7, 5, 53, 255, 175, 253, 194, 251, 140, 2, 96, 1, 181, 1, 39, 0, 63, 0, 55, 254, 73, 3, 241, 4, 57, 8, 248, 253, 142, 252, 208, 249, 184, 254, 57, 253, 141, 5, 172, 253, 170, 254, 186, 255, 209, 0, 173, 0, 136, 7, 89, 254, 170, 253, 103, 252, 165, 1, 93, 2, 218, 255, 254, 255, 11, 255, 129, 255, 128, 3, 177, 7, 111, 4, 133, 254, 250, 253, 213, 249, 173, 0, 118, 0, 241, 2, 201, 255, 131, 254, 204, 255, 217, 3, 253, 3, 241, 2, 254, 255, 221, 254, 133, 252, 241, 2, 224, 3, 167, 1, 8, 1, 131, 0, 60, 255, 127, 3, 226, 8, 239, 9, 133, 253, 192, 251, 61, 246, 239, 253, 42, 252, 14, 2, 4, 253, 194, 252, 220, 253, 76, 254, 60, 1, 87, 2, 93, 253, 84, 252, 22, 253, 199, 255, 236, 0, 245, 255, 55, 255, 175, 255, 226, 252, 16, 0, 77, 3, 22, 6, 31, 253, 39, 252, 68, 251, 44, 254, 17, 0, 34, 1, 233, 254, 184, 253, 68, 253, 183, 0, 54, 3, 193, 2, 247, 254, 20, 254, 93, 251, 165, 1, 152, 0, 212, 1, 122, 254, 166, 0, 244, 254, 39, 0, 14, 6, 76, 7, 133, 253, 58, 252, 221, 249, 59, 254, 20, 254, 142, 3, 228, 254, 253, 251, 181, 255, 75, 255, 123, 255, 60, 7, 67, 254, 144, 253, 106, 251, 164, 1, 111, 1, 207, 255, 123, 254, 44, 255, 87, 255, 195, 2, 49, 4, 184, 4, 229, 253, 58, 253, 87, 250, 83, 0, 93, 255, 228, 1, 20, 255, 225, 253, 157, 254, 82, 1, 151, 4, 46, 3, 10, 255, 203, 254, 66, 252, 94, 2, 248, 2, 60, 0, 166, 0, 248, 255, 93, 255, 206, 254, 57, 7, 3, 10, 21, 253, 255, 251, 9, 249, 93, 254, 66, 254, 209, 0, 50, 253, 202, 253, 234, 253, 6, 254, 181, 2, 89, 3, 49, 254, 71, 253, 198, 251, 69, 1, 175, 1, 50, 255, 241, 255, 248, 255, 5, 253, 33, 2, 151, 3, 238, 5, 157, 253, 241, 252, 223, 250, 0, 1, 201, 255, 208, 0, 91, 255, 164, 254, 106, 253, 65, 1, 168, 2, 162, 3, 186, 254, 83, 254, 73, 252, 228, 1, 190, 1, 58, 2, 59, 255, 72, 0, 183, 255, 141, 3, 175, 5, 205, 6, 205, 253, 31, 253, 74, 248, 132, 255, 96, 254, 206, 2, 34, 254, 108, 254, 198, 254, 240, 255, 190, 1, 100, 6, 217, 253, 231, 253, 18, 253, 198, 255, 126, 2, 214, 0, 55, 0, 71, 255, 241, 254, 124, 4, 21, 5, 188, 4, 29, 254, 97, 253, 16, 251, 117, 0, 29, 1, 31, 2, 52, 255, 121, 254, 145, 255, 1, 2, 2, 6, 86, 3, 142, 255, 66, 255, 46, 252, 109, 3, 83, 2, 208, 1, 4, 1, 4, 1, 201, 254, 236, 2, 235, 8, 168, 8, 251, 253, 79, 252, 133, 247, 186, 254, 60, 253, 122, 1, 212, 252, 77, 253, 24, 255, 208, 253, 175, 2, 129, 5, 36, 253, 78, 253, 188, 252, 153, 254, 133, 2, 130, 1, 247, 254, 62, 0, 90, 253, 145, 0, 108, 6, 184, 4, 213, 253, 36, 252, 47, 251, 178, 255, 14, 0, 114, 0, 185, 254, 154, 254, 23, 254, 136, 1, 165, 2, 185, 2, 55, 255, 20, 255, 140, 251, 181, 2, 193, 1, 178, 0, 13, 255, 0, 1, 79, 254, 99, 2, 105, 5, 152, 9, 156, 253, 123, 252, 72, 250, 205, 254, 239, 255, 243, 1, 197, 254, 101, 253, 2, 255, 0, 1, 172, 1, 183, 5, 26, 254, 90, 254, 224, 251, 143, 2, 114, 1, 18, 0, 154, 255, 71, 255, 236, 254, 243, 2, 42, 6, 55, 5, 24, 254, 165, 253, 118, 250, 182, 0, 163, 255, 102, 3, 183, 255, 54, 254, 164, 254, 67, 3, 94, 3, 189, 3, 230, 254, 179, 254, 22, 253, 35, 2, 71, 3, 172, 1, 17, 1, 167, 255, 13, 0, 172, 3, 172, 6, 16, 10, 94, 254, 196, 251, 34, 249, 212, 255, 154, 254, 3, 1, 15, 254, 125, 253, 208, 253, 99, 0, 45, 2, 193, 3, 91, 254, 2, 253, 107, 252, 39, 1, 70, 1, 184, 0, 175, 0, 15, 0, 142, 253, 20, 2, 110, 3, 189, 7, 69, 254, 0, 253, 5, 251, 221, 0, 156, 0, 12, 1, 39, 0, 149, 254, 7, 254, 183, 2, 4, 3, 116, 4, 94, 255, 53, 254, 112, 252, 197, 2, 188, 1, 146, 2, 25, 0, 47, 1, 200, 254, 244, 4, 130, 5, 179, 6, 215, 254, 2, 253, 212, 248, 249, 254, 148, 255, 46, 4, 106, 254, 243, 255, 127, 255, 57, 0, 182, 1, 174, 10, 138, 254, 25, 254, 189, 252, 48, 1, 184, 2, 164, 0, 104, 0, 21, 255, 5, 0, 75, 6, 108, 7, 119, 5, 27, 255, 186, 253, 211, 250, 149, 1, 192, 0, 49, 3, 169, 255, 74, 254, 111, 0, 4, 4, 175, 4, 225, 3, 68, 0, 81, 255, 90, 252, 9, 4, 93, 4, 195, 1, 222, 1, 200, 0, 8, 255, 79, 8, 136, 10, 250, 7, 189, 252, 213, 250, 173, 247, 225, 252, 76, 253, 210, 1, 212, 252, 248, 251, 43, 254, 146, 253, 32, 1, 152, 3, 67, 253, 183, 252, 210, 251, 101, 254, 0, 2, 8, 0, 122, 254, 165, 255, 24, 253, 226, 255, 19, 4, 137, 4, 202, 252, 132, 251, 124, 251, 218, 254, 210, 255, 110, 0, 101, 254, 138, 254, 90, 253, 214, 0, 19, 2, 156, 2, 106, 254, 92, 254, 86, 251, 231, 1, 232, 0, 47, 1, 194, 254, 91, 0, 40, 254, 123, 0, 208, 4, 141, 9, 46, 253, 72, 252, 41, 250, 30, 253, 93, 253, 52, 5, 225, 253, 162, 253, 45, 255, 161, 255, 158, 255, 228, 5, 219, 253, 254, 253, 87, 251, 217, 1, 211, 0, 73, 0, 224, 254, 144, 255, 123, 254, 25, 2, 52, 5, 234, 4, 201, 253, 13, 253, 247, 249, 71, 0, 229, 254, 120, 2, 86, 255, 31, 254, 19, 254, 169, 2, 234, 3, 49, 3, 156, 254, 181, 254, 147, 252, 163, 1, 194, 2, 90, 1, 241, 0, 222, 255, 186, 254, 121, 1, 158, 7, 91, 7, 41, 253, 205, 251, 167, 249, 23, 255, 225, 253, 116, 0, 244, 253, 218, 252, 183, 253, 183, 255, 222, 1, 217, 2, 224, 254, 99, 252, 137, 251, 173, 0, 191, 1, 204, 255, 68, 0, 27, 255, 162, 253, 193, 1, 17, 2, 5, 7, 177, 253, 149, 252, 173, 250, 183, 0, 112, 255, 68, 1, 153, 255, 60, 254, 102, 253, 111, 2, 232, 1, 152, 4, 18, 255, 1, 254, 20, 252, 70, 1, 40, 2, 202, 1, 136, 0, 108, 0, 193, 254, 114, 2, 63, 5, 91, 7, 22, 254, 122, 253, 62, 249, 70, 255, 63, 254, 216, 3, 30, 253, 180, 255, 86, 255, 218, 253, 243, 2, 0, 10, 16, 254, 2, 254, 77, 252, 210, 0, 182, 2, 204, 255, 84, 0, 190, 254, 57, 255, 66, 4, 89, 6, 200, 4, 136, 254, 165, 253, 140, 250, 87, 1, 74, 0, 120, 2, 81, 255, 10, 254, 224, 255, 204, 3, 52, 5, 222, 2, 52, 0, 217, 254, 167, 251, 41, 4, 150, 3, 160, 0, 137, 1, 107, 0, 115, 254, 190, 4, 89, 10, 205, 6, 136, 253, 79, 251, 157, 248, 49, 253, 235, 254, 97, 1, 117, 253, 144, 252, 134, 255, 45, 255, 209, 0, 58, 5, 206, 253, 54, 253, 221, 251, 48, 255, 132, 1, 159, 0, 192, 254, 195, 255, 217, 253, 37, 1, 68, 4, 163, 5, 120, 253, 159, 252, 27, 251, 207, 255, 113, 255, 49, 1, 111, 254, 29, 255, 183, 253, 49, 2, 20, 2, 159, 3, 139, 255, 69, 254, 92, 251, 251, 1, 180, 1, 36, 1, 177, 255, 233, 0, 54, 254, 159, 2, 1, 4, 92, 9, 135, 253, 182, 252, 11, 250, 204, 254, 226, 254, 128, 2, 139, 254, 147, 253, 105, 254, 162, 1, 253, 0, 25, 5, 197, 254, 187, 253, 143, 251, 60, 2, 173, 2, 231, 254, 61, 0, 188, 255, 141, 254, 223, 3, 77, 4, 218, 5, 19, 254, 85, 253, 174, 250, 209, 255, 164, 0, 192, 2, 0, 255, 198, 254, 244, 254, 119, 2, 181, 3, 28, 4, 138, 255, 164, 254, 191, 252, 68, 0, 156, 4, 56, 2, 152, 0, 117, 0, 34, 0, 89, 4, 110, 7, 191, 8, 167, 253, 65, 252, 86, 249, 113, 255, 23, 254, 224, 1, 180, 254, 113, 253, 194, 253, 54, 0, 97, 1, 168, 4, 50, 254, 116, 253, 228, 252, 150, 0, 37, 2, 112, 0, 195, 0, 145, 255, 253, 253, 167, 2, 84, 4, 111, 6, 210, 253, 19, 253, 63, 251, 247, 255, 16, 1, 85, 1, 203, 255, 247, 254, 233, 253, 233, 1, 75, 3, 18, 5, 136, 255, 30, 254, 248, 251, 120, 2, 31, 2, 152, 1, 179, 0, 50, 1, 242, 253, 100, 4, 184, 5, 196, 8, 95, 254, 238, 252, 230, 249, 32, 255, 128, 254, 84, 5, 135, 254, 53, 254, 231, 255, 129, 1, 233, 1, 126, 8, 180, 254, 117, 253, 195, 252, 32, 2, 41, 2, 61, 0, 22, 0, 143, 255, 167, 255, 104, 4, 189, 6, 244, 5, 40, 255, 139, 254, 139, 249, 161, 0, 60, 1, 140, 3, 91, 255, 34, 255, 189, 255, 82, 5, 151, 4, 21, 3, 73, 0, 4, 255, 1, 253, 226, 2, 164, 3, 104, 2, 106, 1, 246, 0, 130, 255, 19, 3, 94, 10, 211, 11, 77, 253, 174, 251, 114, 247, 203, 253, 180, 253, 12, 2, 178, 253, 45, 252, 22, 254, 249, 254, 141, 1, 214, 3, 191, 253, 187, 252, 79, 252, 234, 255, 179, 1, 207, 255, 66, 255, 138, 255, 139, 253, 168, 255, 216, 4, 233, 5, 132, 253, 229, 251, 5, 252, 221, 254, 189, 0, 3, 1, 255, 254, 42, 254, 139, 253, 145, 0, 177, 3, 126, 3, 186, 254, 148, 254, 186, 251, 31, 2, 4, 1, 118, 2, 54, 255, 189, 0, 47, 255, 101, 1, 99, 5, 43, 8, 199, 253, 205, 251, 87, 250, 54, 253, 17, 255, 151, 3, 92, 254, 63, 253, 172, 255, 147, 255, 142, 255, 103, 9, 99, 254, 239, 253, 103, 251, 226, 1, 112, 1, 131, 0, 70, 255, 184, 255, 125, 255, 93, 3, 231, 4, 196, 4, 157, 253, 110, 253, 195, 250, 227, 0, 135, 255, 119, 2, 80, 255, 23, 254, 38, 255, 233, 2, 151, 4, 189, 3, 191, 254, 108, 255, 88, 252, 159, 2, 198, 3, 216, 0, 84, 1, 253, 255, 113, 255, 213, 1, 56, 7, 133, 9, 39, 253, 63, 252, 109, 249, 43, 255, 2, 255, 65, 1, 1, 254, 74, 254, 247, 253, 130, 255, 213, 2, 135, 3, 172, 254, 83, 253, 248, 251, 60, 1, 224, 1, 20, 0, 23, 0, 167, 255, 217, 253, 97, 1, 27, 4, 253, 6, 224, 253, 11, 253, 172, 250, 42, 1, 231, 255, 180, 1, 156, 255, 120, 254, 249, 253, 211, 1, 242, 2, 54, 4, 46, 255, 114, 254, 202, 251, 108, 2, 146, 2, 118, 2], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE + 10240),
		allocate([33, 0, 147, 0, 78, 255, 153, 3, 151, 6, 129, 7, 187, 254, 240, 253, 70, 248, 2, 0, 227, 254, 142, 3, 141, 254, 22, 254, 26, 255, 0, 0, 85, 2, 218, 7, 16, 254, 117, 254, 190, 252, 37, 0, 177, 3, 245, 0, 181, 0, 96, 255, 112, 255, 201, 5, 93, 5, 77, 5, 157, 254, 167, 253, 10, 251, 42, 1, 66, 1, 160, 2, 63, 255, 176, 254, 77, 0, 65, 4, 253, 5, 154, 3, 177, 0, 217, 255, 155, 251, 228, 3, 13, 3, 24, 2, 200, 1, 110, 1, 80, 254, 135, 5, 136, 9, 231, 8, 46, 254, 10, 253, 235, 246, 209, 254, 3, 254, 131, 1, 41, 253, 211, 253, 66, 0, 111, 255, 131, 2, 224, 4, 224, 253, 92, 253, 108, 252, 31, 255, 94, 3, 76, 2, 104, 255, 40, 0, 235, 253, 167, 1, 143, 5, 22, 6, 196, 253, 181, 252, 135, 251, 128, 255, 85, 0, 205, 1, 18, 255, 255, 254, 184, 253, 93, 2, 236, 2, 93, 3, 24, 0, 54, 255, 127, 250, 29, 3, 231, 1, 47, 1, 75, 255, 108, 1, 74, 255, 104, 2, 98, 5, 126, 11, 18, 254, 172, 252, 95, 250, 220, 254, 61, 0, 44, 3, 172, 255, 45, 253, 74, 255, 43, 2, 20, 2, 226, 5, 147, 254, 19, 254, 223, 251, 54, 3, 76, 2, 11, 0, 242, 255, 238, 255, 26, 255, 233, 3, 121, 5, 171, 5, 38, 254, 199, 253, 244, 250, 46, 1, 62, 0, 38, 4, 186, 255, 136, 254, 34, 255, 214, 3, 206, 3, 125, 4, 60, 255, 22, 255, 229, 252, 223, 1, 74, 4, 243, 1, 106, 1, 58, 0, 70, 0, 123, 4, 21, 8, 41, 11, 25, 254, 146, 252, 224, 248, 73, 0, 224, 254, 92, 1, 154, 254, 12, 254, 4, 254, 199, 0, 209, 2, 218, 4, 178, 255, 71, 253, 229, 252, 105, 1, 24, 2, 196, 0, 118, 1, 110, 0, 33, 253, 79, 3, 27, 4, 104, 7, 146, 254, 55, 253, 98, 251, 59, 1, 64, 1, 173, 1, 72, 0, 41, 255, 62, 254, 247, 2, 118, 3, 83, 5, 226, 255, 84, 254, 190, 252, 93, 3, 115, 2, 28, 3, 118, 0, 212, 1, 233, 254, 75, 5, 91, 7, 101, 7, 68, 255, 126, 253, 180, 249, 63, 0, 81, 255, 174, 4, 94, 254, 45, 255, 51, 0, 158, 1, 75, 2, 41, 10, 22, 255, 211, 253, 166, 252, 168, 1, 121, 3, 222, 0, 136, 0, 155, 255, 83, 0, 133, 5, 230, 8, 103, 5, 172, 255, 67, 254, 147, 250, 158, 1, 57, 1, 21, 4, 29, 0, 169, 254, 65, 0, 16, 6, 111, 6, 212, 3, 183, 0, 165, 255, 195, 252, 249, 4, 133, 5, 104, 1, 41, 2, 16, 1, 149, 255, 51, 6, 77, 12, 43, 10, 104, 5, 29, 8, 92, 13, 244, 19, 86, 26, 186, 31, 135, 38, 84, 43, 170, 49, 133, 53, 61, 254, 215, 251, 239, 253, 231, 250, 62, 254, 12, 253, 15, 254, 161, 252, 128, 254, 149, 253, 99, 254, 99, 253, 195, 254, 230, 253, 181, 254, 212, 253, 98, 254, 4, 254, 88, 254, 134, 254, 238, 254, 188, 254, 78, 254, 154, 253, 30, 255, 12, 254, 24, 255, 254, 253, 249, 254, 135, 254, 214, 254, 102, 254, 105, 255, 58, 253, 82, 255, 206, 252, 107, 255, 100, 254, 100, 255, 83, 254, 224, 254, 50, 254, 70, 255, 53, 255, 86, 255, 210, 254, 65, 255, 191, 254, 125, 255, 109, 255, 215, 254, 117, 254, 28, 255, 42, 255, 11, 255, 64, 255, 189, 255, 196, 254, 185, 255, 185, 254, 152, 255, 51, 255, 162, 255, 73, 255, 113, 255, 218, 255, 63, 255, 161, 255, 16, 0, 180, 255, 132, 255, 8, 255, 23, 0, 19, 255, 24, 0, 12, 255, 18, 0, 120, 255, 44, 0, 145, 255, 223, 255, 232, 255, 231, 255, 0, 0, 149, 0, 19, 0, 23, 0, 113, 255, 158, 0, 87, 255, 174, 0, 75, 255, 133, 0, 201, 255, 165, 0, 230, 255, 111, 0, 84, 0, 98, 0, 75, 0, 87, 0, 183, 0, 141, 255, 245, 255, 248, 255, 130, 0, 11, 0, 170, 0, 254, 0, 77, 0, 205, 0, 17, 0, 183, 0, 112, 0, 6, 1, 194, 0, 202, 0, 31, 1, 95, 0, 189, 0, 214, 255, 151, 255, 234, 0, 179, 0, 39, 0, 186, 0, 163, 0, 89, 1, 76, 1, 199, 0, 43, 1, 161, 0, 202, 255, 29, 1, 178, 255, 25, 1, 123, 255, 141, 0, 74, 255, 111, 0, 249, 0, 85, 1, 15, 1, 108, 1, 93, 0, 147, 1, 75, 0, 135, 1, 92, 0, 254, 1, 118, 255, 220, 0, 71, 255, 227, 255, 222, 255, 105, 1, 141, 255, 64, 1, 3, 0, 42, 2, 99, 0, 30, 1, 218, 0, 79, 2, 11, 255, 150, 1, 244, 254, 197, 1, 0, 0, 68, 2, 25, 0, 94, 2, 19, 1, 20, 2, 148, 0, 194, 1, 183, 255, 227, 2, 227, 254, 6, 2, 224, 254, 94, 0, 53, 255, 162, 2, 116, 255, 182, 255, 205, 0, 202, 2, 142, 255, 43, 1, 176, 0, 155, 3, 182, 0, 45, 2, 240, 0, 193, 2, 240, 255, 1, 2, 229, 1, 81, 2, 37, 1, 128, 1, 195, 1, 105, 2, 218, 255, 50, 0, 51, 2, 17, 2, 47, 1, 209, 0, 203, 1, 107, 1, 177, 1, 196, 1, 194, 1, 198, 1, 111, 1, 94, 2, 221, 1, 229, 2, 176, 1, 97, 1, 112, 1, 11, 1, 105, 1, 204, 2, 17, 1, 71, 2, 197, 1, 166, 0, 254, 1, 172, 0, 201, 0, 117, 2, 18, 1, 191, 0, 56, 2, 127, 2, 46, 1, 42, 1, 122, 2, 131, 1, 131, 2, 94, 1, 75, 2, 48, 2, 100, 2, 53, 2, 88, 2, 20, 3, 231, 1, 160, 2, 0, 2, 247, 3, 65, 1, 77, 1, 101, 1, 86, 3, 131, 255, 157, 1, 218, 1, 200, 2, 17, 0, 105, 255, 52, 2, 29, 1, 14, 1, 15, 255, 203, 3, 121, 3, 233, 1, 220, 0, 254, 1, 128, 3, 37, 2, 156, 3, 71, 1, 57, 3, 34, 1, 143, 3, 28, 2, 84, 4, 158, 0, 37, 3, 199, 0, 189, 3, 255, 1, 218, 2, 100, 0, 106, 3, 13, 0, 23, 3, 179, 1, 120, 2, 164, 2, 204, 3, 249, 0, 132, 3, 211, 1, 194, 4, 13, 3, 50, 4, 73, 2, 17, 3, 233, 255, 157, 2, 11, 1, 19, 4, 107, 2, 60, 4, 103, 2, 121, 4, 110, 2, 137, 3, 148, 3, 25, 4, 80, 0, 75, 1, 72, 2, 51, 4, 89, 0, 127, 2, 220, 3, 193, 3, 2, 3, 208, 2, 30, 3, 187, 2, 236, 1, 191, 1, 131, 3, 115, 2, 15, 1, 164, 4, 213, 2, 53, 5, 87, 0, 91, 2, 64, 3, 67, 6, 104, 2, 103, 4, 122, 3, 225, 5, 232, 3, 132, 4, 98, 3, 241, 3, 227, 3, 59, 3, 125, 4, 90, 3, 49, 3, 170, 5, 5, 3, 40, 5, 244, 1, 109, 5, 56, 1, 129, 4, 236, 255, 60, 4, 64, 0, 3, 5, 2, 0, 148, 4, 143, 1, 77, 7, 2, 2, 170, 6, 246, 1, 100, 6, 118, 3, 242, 5, 160, 1, 88, 2, 107, 4, 70, 5, 251, 4, 110, 5, 121, 3, 3, 7, 146, 3, 230, 6, 227, 0, 159, 4, 226, 4, 34, 7, 249, 1, 62, 7, 151, 3, 49, 9, 57, 255, 175, 1, 152, 0, 199, 6, 43, 255, 228, 255, 136, 1, 54, 5, 103, 255, 204, 255, 210, 3, 127, 4, 189, 254, 112, 254, 45, 3, 167, 6, 120, 255, 84, 0, 169, 5, 223, 7, 181, 254, 113, 255, 119, 255, 168, 4, 0, 255, 22, 2, 99, 255, 7, 4, 205, 254, 73, 254, 30, 2, 219, 2, 183, 254, 92, 254, 159, 255, 104, 2, 150, 254, 88, 255, 190, 254, 110, 1, 9, 255, 146, 255, 45, 255, 89, 0, 60, 255, 203, 254, 20, 0, 59, 0, 148, 254, 49, 254, 226, 254, 89, 0, 176, 254, 175, 0, 80, 254, 141, 0, 133, 254, 66, 255, 78, 254, 60, 255, 177, 255, 150, 0, 234, 254, 29, 255, 232, 254, 166, 0, 213, 253, 90, 254, 101, 255, 29, 2, 146, 254, 54, 0, 227, 255, 173, 255, 211, 254, 250, 252, 186, 0, 116, 2, 115, 254, 248, 254, 242, 0, 37, 1, 59, 255, 183, 253, 124, 0, 154, 1, 53, 0, 123, 255, 10, 0, 84, 1, 198, 253, 215, 251, 65, 0, 66, 254, 68, 0, 19, 254, 127, 1, 169, 3, 155, 254, 57, 253, 153, 254, 6, 255, 91, 253, 212, 251, 36, 1, 230, 255, 107, 1, 6, 0, 95, 2, 33, 5, 129, 255, 246, 255, 233, 5, 94, 7, 201, 2, 204, 3, 189, 5, 133, 8, 163, 5, 224, 7, 161, 249, 192, 249, 252, 248, 14, 247, 253, 251, 22, 249, 180, 251, 23, 248, 3, 251, 148, 250, 169, 250, 2, 250, 77, 252, 75, 250, 52, 252, 12, 250, 25, 252, 58, 251, 4, 252, 108, 251, 209, 252, 37, 252, 32, 252, 165, 250, 64, 251, 18, 252, 247, 250, 186, 251, 24, 253, 12, 251, 13, 253, 243, 250, 162, 252, 101, 252, 119, 252, 40, 252, 90, 253, 229, 251, 83, 253, 230, 251, 193, 251, 39, 252, 218, 251, 89, 253, 35, 252, 127, 253, 153, 251, 48, 252, 6, 253, 114, 253, 134, 252, 218, 252, 191, 252, 189, 251, 62, 253, 139, 253, 147, 253, 218, 252, 128, 253, 212, 252, 249, 252, 134, 253, 245, 252, 225, 253, 28, 252, 203, 253, 205, 251, 188, 253, 222, 253, 157, 253, 196, 253, 149, 253, 8, 253, 222, 254, 145, 252, 242, 253, 201, 252, 50, 254, 229, 252, 3, 255, 215, 253, 97, 254, 179, 253, 73, 254, 235, 253, 172, 254, 76, 253, 89, 252, 7, 254, 252, 252, 66, 253, 149, 251, 249, 254, 206, 254, 53, 252, 29, 254, 67, 254, 182, 255, 213, 253, 220, 253, 154, 253, 127, 255, 75, 253, 22, 255, 116, 254, 10, 255, 37, 254, 6, 255, 247, 254, 108, 254, 136, 254, 254, 253, 95, 254, 2, 254, 212, 254, 199, 254, 178, 254, 104, 253, 49, 254, 210, 252, 126, 254, 64, 253, 175, 254, 153, 253, 22, 255, 55, 255, 23, 255, 17, 255, 89, 255, 201, 253, 53, 255, 149, 253, 109, 255, 97, 254, 141, 255, 160, 254, 90, 255, 18, 253, 85, 255, 7, 253, 242, 254, 145, 252, 248, 254, 121, 252, 145, 254, 24, 253, 43, 0, 37, 254, 14, 0, 115, 253, 43, 0, 98, 253, 11, 0, 64, 254, 197, 255, 247, 253, 130, 255, 137, 255, 101, 255, 155, 253, 214, 255, 161, 252, 229, 255, 93, 252, 136, 0, 29, 254, 183, 0, 44, 254, 55, 0, 214, 254, 55, 0, 208, 254, 57, 1, 159, 253, 57, 1, 48, 253, 66, 1, 89, 255, 100, 0, 227, 253, 253, 255, 137, 255, 145, 255, 69, 255, 233, 0, 20, 255, 4, 1, 22, 255, 26, 0, 91, 255, 134, 0, 211, 255, 216, 255, 219, 253, 104, 1, 53, 255, 122, 1, 124, 254, 194, 1, 129, 254, 19, 1, 20, 0, 182, 0, 153, 255, 246, 0, 145, 255, 175, 1, 37, 0, 206, 1, 110, 255, 231, 1, 99, 255, 228, 254, 197, 255, 247, 1, 72, 255, 24, 0, 53, 0, 253, 255, 54, 0, 122, 0, 3, 1, 77, 1, 66, 0, 228, 1, 104, 0, 180, 1, 68, 0, 195, 0, 116, 0, 190, 0, 206, 0, 13, 1, 247, 255, 226, 1, 96, 1, 126, 1, 29, 1, 143, 1, 21, 1, 196, 1, 0, 1, 69, 0, 186, 0, 13, 0, 41, 1, 243, 255, 3, 1, 161, 255, 30, 0, 56, 0, 138, 1, 196, 0, 169, 1, 205, 0, 200, 1, 25, 1, 65, 2, 15, 0, 191, 0, 119, 1, 34, 1, 151, 1, 64, 2, 200, 255, 227, 0, 32, 2, 149, 1, 0, 0, 37, 2, 164, 255, 16, 2, 27, 255, 95, 1, 11, 255, 82, 1, 150, 254, 179, 1, 167, 0, 15, 2, 181, 255, 46, 1, 91, 0, 56, 3, 129, 0, 87, 2, 240, 1, 167, 2, 186, 0, 237, 2, 153, 0, 225, 2, 231, 254, 88, 2, 164, 254, 103, 2, 20, 255, 1, 3, 41, 0, 113, 3, 38, 0, 122, 3, 36, 255, 73, 3, 155, 254, 115, 3, 119, 254, 135, 3, 134, 253, 218, 1, 68, 254, 82, 3, 81, 255, 166, 2, 19, 254, 242, 0, 249, 253, 17, 3, 54, 253, 70, 2, 227, 253, 110, 1, 225, 253, 178, 1, 171, 253, 244, 1, 3, 253, 222, 0, 66, 253, 149, 3, 25, 253, 194, 3, 155, 252, 245, 1, 125, 252, 36, 2, 133, 254, 200, 0, 77, 254, 157, 0, 205, 252, 214, 0, 163, 252, 157, 0, 154, 253, 40, 0, 136, 253, 94, 0, 141, 252, 202, 255, 27, 253, 4, 2, 11, 254, 42, 1, 154, 253, 85, 255, 154, 252, 95, 255, 159, 252, 233, 255, 206, 252, 93, 0, 9, 252, 245, 254, 106, 253, 153, 254, 219, 253, 2, 0, 70, 254, 135, 255, 135, 254, 0, 0, 29, 255, 33, 0, 98, 254, 130, 255, 127, 255, 212, 0, 90, 252, 34, 0, 198, 251, 230, 254, 161, 251, 244, 254, 58, 253, 199, 252, 92, 254, 65, 255, 204, 251, 96, 252, 107, 252, 163, 255, 140, 253, 154, 254, 97, 0, 7, 0, 50, 255, 119, 254, 155, 255, 24, 0, 53, 255, 38, 0, 88, 255, 83, 0, 169, 253, 89, 254, 233, 254, 170, 1, 68, 253, 118, 0, 181, 255, 206, 0, 43, 252, 95, 253, 88, 253, 161, 1, 145, 254, 37, 0, 233, 254, 218, 1, 127, 255, 194, 254, 63, 1, 40, 1, 142, 253, 217, 255, 87, 1, 90, 2, 72, 253, 217, 255, 209, 254, 172, 3, 104, 0, 233, 0, 132, 254, 137, 0, 220, 255, 13, 1, 181, 255, 42, 255, 120, 0, 43, 0, 239, 253, 35, 254, 203, 1, 164, 0, 54, 255, 27, 255, 207, 255, 89, 255, 97, 2, 24, 3, 98, 0, 36, 255, 147, 3, 148, 0, 37, 1, 27, 1, 101, 3, 91, 0, 63, 2, 138, 1, 70, 1, 178, 255, 205, 2, 67, 0, 109, 1, 189, 254, 104, 2, 220, 255, 219, 2, 27, 0, 107, 2, 238, 0, 120, 2, 17, 1, 192, 1, 99, 0, 33, 3, 220, 1, 101, 3, 17, 1, 173, 2, 64, 0, 21, 3, 72, 0, 253, 3, 217, 0, 25, 3, 203, 1, 222, 2, 104, 1, 134, 2, 224, 1, 104, 1, 66, 1, 173, 1, 208, 1, 126, 2, 174, 1, 244, 2, 107, 1, 232, 3, 148, 1, 171, 2, 16, 2, 90, 2, 103, 2, 143, 2, 157, 1, 178, 3, 175, 2, 169, 3, 90, 2, 136, 3, 92, 2, 43, 2, 225, 2, 18, 3, 150, 2, 211, 1, 142, 2, 106, 1, 77, 2, 161, 3, 198, 2, 242, 1, 222, 1, 159, 1, 164, 1, 181, 2, 115, 3, 45, 3, 171, 2, 13, 3, 157, 3, 145, 3, 171, 3, 214, 2, 220, 2, 235, 1, 85, 3, 19, 2, 180, 3, 222, 2, 195, 3, 59, 1, 40, 3, 249, 2, 243, 2, 120, 4, 248, 2, 143, 2, 52, 4, 58, 3, 33, 4, 67, 4, 70, 3, 235, 3, 40, 3, 23, 4, 109, 4, 147, 2, 77, 4, 224, 3, 26, 4, 50, 4, 51, 4, 203, 3, 182, 2, 202, 4, 30, 4, 59, 2, 73, 3, 116, 3, 124, 5, 99, 5, 72, 4, 56, 4, 93, 3, 207, 4, 223, 2, 4, 5, 248, 2, 248, 4, 223, 3, 87, 5, 29, 4, 233, 4, 188, 2, 26, 4, 22, 2, 220, 3, 197, 1, 240, 4, 87, 2, 116, 4, 167, 2, 85, 6, 47, 3, 104, 5, 9, 2, 37, 5, 137, 1, 28, 6, 37, 3, 168, 5, 174, 2, 44, 4, 136, 2, 107, 3, 51, 1, 59, 4, 105, 1, 23, 4, 61, 1, 137, 5, 196, 3, 163, 2, 59, 2, 128, 4, 79, 0, 90, 4, 209, 255, 250, 5, 55, 1, 185, 6, 58, 1, 142, 4, 177, 2, 2, 2, 162, 255, 93, 1, 26, 1, 132, 5, 72, 1, 1, 4, 231, 1, 191, 255, 57, 0, 37, 3, 202, 3, 36, 0, 62, 0, 1, 3, 249, 254, 23, 3, 166, 254, 125, 2, 187, 2, 119, 255, 108, 2, 22, 2, 29, 2, 33, 253, 194, 0, 199, 2, 44, 1, 244, 254, 161, 252, 158, 3, 1, 3, 60, 253, 84, 254, 250, 1, 174, 0, 132, 252, 138, 253, 179, 1, 35, 2, 101, 250, 254, 254, 109, 2, 215, 1, 6, 252, 168, 250, 119, 254, 9, 2, 104, 252, 82, 253, 231, 255, 20, 0, 42, 252, 124, 251, 84, 1, 9, 0, 234, 249, 145, 251, 160, 254, 48, 0, 213, 249, 110, 254, 137, 252, 6, 0, 124, 251, 136, 252, 220, 253, 160, 254, 149, 249, 112, 251, 97, 255, 98, 2, 24, 248, 61, 252, 31, 255, 193, 0, 136, 249, 88, 248, 11, 255, 19, 254, 60, 252, 112, 249, 88, 252, 133, 253, 237, 250, 48, 249, 148, 250, 164, 253, 252, 249, 189, 252, 139, 250, 121, 255, 204, 249, 222, 254, 122, 249, 56, 253, 37, 248, 160, 249, 129, 249, 229, 255, 46, 247, 213, 252, 123, 251, 184, 0, 15, 251, 189, 0, 169, 250, 74, 2, 37, 248, 201, 0, 234, 252, 200, 2, 70, 251, 3, 0, 247, 251, 40, 3, 29, 251, 62, 3, 145, 255, 123, 2, 156, 249, 191, 1, 49, 254, 75, 252, 67, 254, 96, 252, 8, 254, 118, 251, 11, 254, 69, 251, 144, 0, 161, 254, 140, 254, 228, 251, 229, 254, 221, 251, 233, 254, 157, 251, 193, 253, 98, 250, 181, 253, 178, 249, 89, 252, 40, 252, 229, 0, 178, 2, 103, 252, 49, 253, 109, 254, 82, 5, 83, 253, 47, 254, 106, 3, 141, 1, 3, 254, 210, 255, 61, 1, 54, 5, 27, 254, 200, 1, 45, 3, 183, 1, 101, 254, 83, 1, 130, 3, 43, 4, 87, 254, 46, 0, 161, 5, 241, 1, 115, 252, 224, 252, 185, 5, 22, 4, 2, 255, 191, 254, 150, 5, 141, 4, 68, 0, 94, 1, 10, 4, 154, 2, 114, 1, 11, 0, 31, 5, 22, 3, 143, 0, 232, 0, 17, 4, 26, 6, 142, 255, 151, 2, 80, 6, 54, 4, 198, 1, 67, 2, 251, 4, 16, 4, 180, 255, 141, 3, 240, 2, 43, 4, 153, 0, 0, 2, 92, 1, 190, 4, 102, 2, 129, 1, 51, 7, 40, 3, 13, 1, 10, 4, 203, 0, 62, 4, 140, 2, 249, 3, 247, 6, 106, 4, 173, 1, 47, 5, 131, 1, 104, 5, 207, 255, 159, 4, 184, 255, 191, 4, 96, 254, 233, 3, 32, 2, 213, 6, 160, 254, 199, 4, 10, 254, 175, 4, 179, 253, 57, 2, 29, 255, 94, 6, 114, 255, 42, 6, 26, 255, 179, 6, 54, 253, 8, 5, 186, 252, 118, 5, 107, 4, 77, 5, 48, 255, 208, 4, 181, 1, 197, 3, 95, 252, 50, 3, 43, 3, 130, 5, 91, 3, 227, 5, 164, 0, 188, 4, 107, 5, 1, 7, 228, 1, 82, 7, 200, 1, 15, 8, 228, 3, 146, 4, 46, 5, 122, 5, 36, 5, 80, 5, 111, 4, 238, 4, 210, 4, 82, 6, 81, 5, 232, 6, 141, 5, 203, 4, 48, 6, 67, 5, 86, 3, 160, 2, 149, 6, 30, 6, 115, 4, 246, 4, 224, 7, 33, 7, 237, 6, 45, 6, 252, 5, 180, 5, 207, 5, 178, 3, 123, 6, 253, 3, 208, 6, 188, 4, 112, 5, 209, 3, 236, 6, 137, 4, 34, 7, 140, 4, 182, 6, 149, 5, 181, 7, 55, 6, 161, 4, 96, 3, 84, 8, 37, 4, 7, 7, 46, 3, 46, 7, 245, 2, 56, 8, 35, 5, 6, 8, 234, 4, 65, 8, 147, 3, 27, 9, 162, 3, 187, 5, 123, 4, 30, 10, 159, 5, 197, 8, 208, 6, 42, 8, 84, 6, 54, 9, 174, 5, 106, 10, 226, 5, 84, 7, 45, 7, 22, 8, 183, 7, 203, 6, 41, 6, 170, 2, 9, 5, 48, 6, 253, 7, 174, 5, 50, 8, 194, 9, 212, 7, 151, 10, 18, 8, 214, 2, 52, 6, 196, 10, 32, 9, 228, 0, 79, 3, 152, 9, 123, 6, 36, 0, 45, 1, 150, 7, 165, 7, 66, 254, 160, 255, 106, 8, 116, 5, 253, 5, 77, 4, 14, 0, 96, 2, 101, 252, 36, 253, 103, 5, 190, 7, 65, 5, 184, 3, 88, 253, 65, 1, 1, 5, 244, 4, 198, 249, 109, 1, 173, 3, 178, 3, 55, 249, 202, 252, 70, 9, 227, 10, 29, 7, 228, 10, 236, 248, 29, 247, 169, 248, 23, 246, 152, 249, 200, 248, 97, 249, 44, 248, 60, 251, 136, 248, 59, 251, 198, 247, 233, 249, 204, 249, 219, 249, 236, 249, 85, 251, 177, 249, 56, 251, 65, 249, 177, 250, 129, 251, 176, 249, 100, 248, 6, 251, 145, 250, 231, 250, 133, 250, 185, 249, 101, 251, 116, 249, 225, 250, 93, 250, 58, 250, 169, 250, 126, 252, 24, 251, 221, 251, 205, 250, 146, 251, 42, 252, 147, 251, 131, 251, 32, 250, 200, 251, 228, 250, 4, 252, 97, 251, 44, 252, 50, 250, 57, 252, 41, 250, 36, 252, 102, 252, 233, 251, 203, 251, 186, 252, 101, 251, 166, 252, 58, 251, 149, 251, 239, 251, 216, 251, 1, 253, 152, 252, 123, 251, 67, 253, 144, 252, 62, 253, 118, 252, 250, 252, 8, 252, 190, 253, 200, 251, 223, 252, 58, 250, 177, 253, 169, 251, 176, 253, 134, 251, 55, 253, 148, 250, 128, 253, 160, 250, 171, 253, 221, 251, 96, 254, 121, 252, 82, 253, 192, 252, 107, 253, 60, 253, 68, 254, 156, 252, 22, 254, 103, 252, 138, 254, 248, 252, 149, 253, 110, 251, 183, 253, 219, 253, 255, 252, 229, 252, 77, 254, 109, 253, 238, 253, 27, 253, 14, 254, 187, 252, 155, 254, 171, 253, 233, 254, 153, 252, 13, 255, 137, 252, 230, 254, 103, 253, 232, 254, 101, 253, 91, 255, 208, 253, 118, 254, 121, 252, 150, 254, 102, 254, 64, 254, 185, 253, 103, 254, 194, 253, 199, 254, 155, 254, 131, 253, 220, 253, 198, 253, 76, 254, 128, 252, 8, 254, 130, 254, 11, 253, 198, 255, 31, 254, 91, 255, 150, 253, 65, 255, 138, 254, 22, 255, 130, 254, 34, 255, 85, 253, 231, 255, 32, 254, 94, 254, 153, 254, 38, 253, 159, 254, 188, 254, 99, 255, 80, 254, 190, 254, 118, 254, 209, 254, 228, 254, 152, 255, 167, 253, 223, 254, 212, 253, 60, 255, 180, 253, 106, 255, 109, 253, 160, 253, 39, 254, 232, 255, 188, 255, 64, 254, 38, 254, 248, 255, 6, 254, 211, 255, 20, 253, 72, 255, 180, 252, 4, 255, 123, 252, 165, 255, 184, 253, 159, 255, 116, 253, 138, 0, 4, 253, 125, 255, 90, 253, 244, 255, 98, 253, 165, 0, 253, 254, 253, 255, 184, 252, 149, 255, 115, 252, 37, 0, 32, 252, 44, 0, 170, 252, 97, 254, 185, 252, 13, 0, 23, 252, 241, 254, 254, 251, 203, 254, 226, 252, 34, 254, 192, 252, 24, 254, 81, 252, 168, 0, 168, 251, 125, 254, 95, 251, 155, 255, 97, 251, 216, 255, 83, 252, 196, 254, 250, 251, 254, 252, 236, 251, 143, 253, 199, 251, 230, 253, 56, 251, 213, 254, 224, 250, 76, 254, 83, 251, 105, 253, 113, 251, 95, 255, 64, 251, 78, 253, 43, 251, 193, 252, 104, 250, 48, 253, 133, 250, 19, 254, 126, 252, 28, 253, 102, 252, 223, 252, 178, 251, 110, 254, 213, 249, 60, 252, 219, 251, 130, 253, 11, 251, 98, 250, 37, 250, 90, 252, 34, 250, 129, 252, 194, 249, 204, 253, 69, 249, 51, 253, 162, 253, 171, 253, 114, 251, 195, 251, 167, 250, 44, 254, 102, 248, 43, 250, 210, 248, 71, 252, 116, 248, 93, 252, 37, 250, 68, 255, 157, 249, 91, 254, 79, 250, 174, 254, 88, 250, 234, 255, 106, 248, 90, 254, 42, 248, 7, 255, 16, 254, 142, 255, 138, 248, 13, 253, 247, 250, 174, 0, 85, 250, 147, 255, 30, 254, 255, 254, 59, 251, 4, 254, 175, 249, 151, 0, 98, 249, 208, 0, 114, 253, 107, 0, 141, 249, 29, 0, 139, 251, 23, 1, 65, 251, 50, 1, 52, 251, 6, 254, 38, 253, 81, 255, 44, 251, 155, 255, 55, 252, 39, 2, 154, 252, 22, 1, 201, 252, 59, 1, 205, 253, 120, 1, 229, 251, 228, 0, 5, 254, 24, 1, 169, 253, 25, 1, 10, 253, 253, 0, 207, 254, 123, 1, 13, 253, 122, 255, 157, 253, 148, 2, 200, 252, 24, 2, 207, 252, 134, 2, 99, 254, 49, 0, 171, 254, 177, 0, 59, 254, 14, 2, 30, 254, 77, 2, 185, 255, 83, 1, 111, 253, 8, 1, 12, 255, 39, 1, 19, 255, 59, 1, 125, 254, 57, 2, 6, 254, 247, 255, 135, 254, 14, 0, 96, 255, 149, 2, 40, 255, 40, 0, 204, 254, 210, 255, 95, 0, 214, 0, 14, 255, 167, 0, 170, 255, 192, 0, 200, 255, 27, 0, 180, 255, 31, 0, 36, 0, 53, 1, 150, 255, 74, 255, 143, 255, 74, 0, 71, 254, 234, 255, 23, 0, 139, 0, 81, 0, 245, 255, 44, 0, 15, 0, 169, 255, 119, 255, 138, 255, 49, 255, 98, 255, 198, 255, 16, 1, 164, 255, 100, 255, 71, 254, 8, 0, 120, 255, 128, 0, 35, 255, 101, 0, 38, 255, 40, 0, 59, 255, 180, 255, 56, 254, 9, 0, 67, 254, 33, 0, 89, 254, 226, 0, 60, 0, 73, 0, 34, 255, 156, 0, 113, 254, 24, 1, 194, 254, 245, 0, 171, 254, 166, 0, 13, 254, 83, 1, 66, 255, 71, 1, 37, 255, 69, 1, 119, 255, 167, 255, 172, 253, 100, 0, 141, 253, 144, 0, 91, 253, 231, 1, 28, 0, 252, 0, 121, 254, 214, 0, 215, 255, 26, 1, 228, 255, 99, 0, 226, 254, 75, 1, 49, 0, 203, 1, 124, 254, 53, 2, 143, 254, 180, 1, 28, 0, 80, 1, 247, 255, 141, 1, 89, 255, 106, 2, 34, 0, 84, 2, 239, 255, 49, 2, 116, 255, 43, 1, 79, 0, 10, 2, 125, 0, 203, 0, 2, 0, 244, 0, 32, 1, 255, 0, 211, 0, 175, 0, 82, 0, 84, 2, 187, 0, 5, 2, 108, 0, 125, 1, 255, 0, 109, 1, 41, 1, 241, 1, 96, 1, 71, 1, 174, 255, 25, 0, 210, 0, 115, 1, 245, 0, 5, 1, 3, 0, 33, 2, 193, 1, 140, 0, 38, 1, 44, 0, 39, 1, 212, 0, 91, 1, 244, 0, 238, 1, 75, 1, 16, 2, 201, 0, 51, 1, 93, 1, 155, 1, 101, 2, 28, 1, 102, 2, 157, 1, 208, 1, 66, 1, 112, 2, 141, 1, 97, 0, 200, 0, 96, 255, 128, 1, 149, 0, 106, 1, 239, 1, 13, 2, 13, 1, 73, 2, 33, 0, 235, 1, 135, 255, 177, 1, 171, 1, 99, 2, 242, 1, 4, 2, 171, 0, 187, 1, 241, 1, 154, 2, 184, 1, 19, 1, 54, 2, 63, 2, 146, 0, 127, 2, 155, 0, 158, 2, 223, 255, 173, 0, 212, 0, 184, 2, 90, 255, 89, 2, 65, 255, 183, 2, 23, 254, 247, 1, 175, 0, 230, 2, 214, 0, 220, 1, 116, 1, 59, 4, 66, 2, 18, 2, 74, 2, 9, 3, 169, 1, 106, 3, 59, 1, 73, 3, 118, 1, 80, 3, 91, 255, 53, 2, 35, 0, 223, 3, 217, 255, 38, 4, 73, 1, 200, 2, 18, 3, 72, 3, 133, 2, 27, 3, 149, 2, 164, 2, 59, 2, 150, 3, 120, 2, 55, 4, 161, 2, 49, 3, 62, 1, 132, 1, 106, 3, 244, 3, 52, 2, 80, 3, 112, 3, 108, 2, 45, 2, 223, 1, 159, 2, 197, 1, 180, 2, 212, 1, 72, 3, 130, 2, 76, 3, 133, 2, 250, 1, 172, 1, 129, 3, 55, 2, 69, 3, 131, 1, 194, 3, 243, 1, 179, 2, 49, 2, 171, 3, 158, 3, 15, 3, 40, 1, 22, 3, 12, 1, 4, 4, 18, 2, 106, 3, 73, 1, 36, 2, 143, 0, 163, 2, 35, 1, 247, 1, 66, 0, 17, 4, 103, 1, 18, 3, 97, 0, 37, 3, 33, 0, 69, 3, 214, 1, 255, 1, 49, 0, 68, 4, 71, 1, 150, 4, 67, 1, 3, 0, 242, 0, 104, 3, 218, 1, 177, 2, 173, 1, 49, 5, 166, 2, 18, 4, 108, 2, 85, 4, 152, 2, 65, 1, 193, 0, 121, 3, 182, 3, 129, 4, 106, 3, 125, 3, 123, 2, 109, 3, 94, 3, 180, 3, 145, 3, 13, 5, 153, 2, 40, 5, 127, 2, 229, 3, 25, 3, 122, 5, 6, 4, 152, 4, 244, 3, 86, 4, 191, 3, 130, 5, 157, 3, 123, 5, 147, 3, 31, 2, 94, 3, 92, 4, 198, 4, 67, 3, 166, 4, 67, 3, 166, 4, 191, 3, 124, 4, 123, 4, 96, 5, 20, 5, 169, 4, 135, 5, 207, 4, 55, 5, 61, 5, 234, 2, 68, 4, 175, 6, 3, 5, 109, 5, 49, 4, 54, 5, 30, 6, 129, 4, 195, 5, 109, 6, 113, 4, 33, 7, 196, 4, 32, 4, 102, 5, 241, 5, 194, 6, 96, 6, 9, 6, 84, 6, 6, 6, 87, 3, 60, 6, 97, 3, 131, 6, 181, 2, 117, 3, 180, 6, 239, 5, 143, 4, 16, 5, 161, 8, 224, 6, 160, 7, 213, 5, 228, 7, 202, 5, 254, 5, 74, 7, 158, 6, 216, 7, 30, 6, 236, 2, 225, 6, 57, 3, 38, 1, 112, 5, 60, 4, 10, 8, 109, 2, 35, 5, 109, 1, 7, 5, 198, 0, 4, 4, 232, 1, 128, 5, 249, 0, 147, 1, 246, 3, 25, 6, 68, 1, 107, 1, 109, 6, 20, 4, 193, 0, 111, 1, 242, 7, 67, 7, 5, 255, 67, 2, 238, 2, 226, 3, 13, 255, 30, 0, 45, 5, 111, 3, 228, 255, 87, 255, 112, 2, 149, 3, 59, 254, 159, 0, 186, 0, 90, 5, 154, 253, 6, 0, 25, 2, 136, 1, 162, 255, 221, 254, 13, 3, 229, 0, 128, 255, 214, 254, 245, 0, 235, 1, 67, 253, 120, 253, 204, 3, 21, 3, 11, 254, 128, 253, 178, 0, 255, 0, 147, 254, 122, 254, 1, 255, 61, 1, 66, 252, 218, 254, 65, 255, 228, 0, 249, 252, 65, 254, 157, 0, 19, 255, 111, 253, 48, 253, 105, 254, 92, 0, 139, 255, 157, 253, 78, 1, 26, 255, 89, 253, 196, 251, 112, 255, 195, 254, 123, 252, 163, 252, 30, 253, 152, 254, 171, 255, 41, 253, 166, 255, 237, 252, 100, 0, 234, 255, 121, 254, 249, 254, 200, 255, 183, 255, 175, 254, 14, 253, 5, 0, 67, 255, 62, 253, 144, 253, 89, 0, 168, 254, 121, 255, 167, 251, 159, 254, 19, 255, 84, 253, 145, 251, 237, 254, 178, 251, 243, 254, 77, 251, 152, 0, 145, 0, 46, 253, 48, 251, 49, 0, 80, 0, 32, 251, 248, 252, 8, 255, 135, 1, 36, 253, 221, 253, 213, 1, 218, 0, 1, 255, 160, 252, 69, 0, 110, 1, 90, 255, 27, 254, 80, 253, 191, 0, 68, 251, 84, 251, 86, 255, 87, 255, 228, 250, 161, 249, 65, 1, 214, 1, 117, 250, 37, 251, 192, 255, 16, 1, 175, 250, 8, 255, 236, 1, 53, 2, 47, 253, 159, 253, 195, 0, 229, 1, 195, 253, 123, 255, 171, 1, 202, 0, 85, 255, 138, 255, 199, 0, 63, 2, 2, 0, 225, 255, 182, 2, 243, 2, 170, 250, 217, 255, 40, 2, 45, 2, 23, 254, 15, 1, 168, 2, 25, 2, 13, 0, 59, 254, 87, 3, 186, 3, 123, 255, 204, 255, 175, 255, 226, 2, 111, 251, 125, 2, 31, 4, 35, 4, 161, 255, 164, 2, 235, 4, 57, 4, 233, 1, 49, 1, 63, 254, 186, 3, 234, 253, 228, 3, 55, 252, 98, 3, 222, 251, 35, 4, 242, 250, 106, 2, 120, 250, 105, 2, 54, 254, 86, 5, 97, 255, 29, 7, 250, 252, 240, 253, 242, 255, 86, 4, 78, 251, 123, 252, 252, 252, 177, 1, 24, 251, 25, 251, 13, 252, 210, 254, 166, 253, 183, 253, 9, 253, 174, 249, 8, 253, 243, 249, 184, 252, 127, 248, 208, 252, 229, 253, 23, 249, 69, 247, 29, 255, 220, 255, 14, 248, 217, 248, 197, 247, 154, 251, 89, 246, 232, 248, 66, 250, 252, 0, 115, 245, 97, 254, 197, 253, 45, 254, 229, 5, 18, 6, 132, 8, 183, 7, 22, 9, 228, 7, 191, 248, 111, 249, 191, 248, 37, 249, 248, 247, 130, 251, 170, 247, 138, 249, 173, 249, 181, 251, 88, 249, 149, 251, 191, 250, 184, 249, 177, 250, 154, 249, 198, 250, 243, 250, 211, 250, 15, 251, 128, 249, 143, 249, 49, 250, 173, 252, 190, 250, 216, 248, 123, 250, 116, 247, 254, 250, 87, 253, 7, 249, 143, 249, 58, 252, 198, 251, 97, 251, 116, 249, 226, 251, 207, 251, 138, 251, 122, 251, 73, 251, 24, 253, 6, 251, 27, 252, 90, 252, 153, 250, 97, 252, 120, 250, 14, 252, 231, 250, 241, 252, 69, 252, 231, 251, 124, 252, 31, 252, 207, 252, 31, 253, 201, 252, 52, 252, 91, 251, 30, 253, 186, 251, 30, 253, 126, 251, 240, 252, 223, 252, 214, 252, 238, 252, 132, 252, 248, 253, 24, 252, 206, 252, 124, 253, 59, 252, 191, 253, 142, 252, 227, 253, 74, 253, 97, 253, 107, 252, 173, 253, 126, 253, 122, 253, 153, 253, 68, 252, 147, 253, 99, 252, 253, 253, 41, 253, 29, 254, 209, 252, 27, 254, 184, 252, 190, 253, 72, 254, 55, 253, 190, 253, 187, 254, 111, 253, 98, 253, 126, 254, 198, 253, 71, 254, 102, 253, 254, 253, 237, 252, 120, 254, 239, 253, 246, 253, 59, 254, 25, 254, 89, 254, 152, 253, 183, 253, 151, 253, 99, 255, 106, 253, 244, 254, 88, 253, 164, 254, 190, 254, 189, 254, 136, 253, 68, 254, 208, 254, 82, 254, 180, 254, 54, 254, 235, 254, 44, 254, 109, 253, 231, 252, 193, 254, 132, 253, 29, 255, 214, 253, 139, 254, 165, 254, 178, 254, 46, 255, 56, 254, 64, 255, 238, 253, 14, 255, 40, 255, 58, 255, 146, 254, 142, 254, 174, 254, 95, 255, 103, 254, 20, 253, 149, 255, 132, 254, 218, 254, 125, 253, 33, 255, 103, 253, 22, 255, 27, 253, 115, 255, 16, 254, 126, 255, 2, 254, 117, 255, 185, 254, 84, 255, 207, 254, 206, 254, 188, 253, 92, 255, 249, 254, 250, 254, 84, 255, 189, 255, 110, 254, 31, 0, 146, 254, 246, 255, 76, 254, 170, 255, 241, 253, 71, 0, 135, 254, 234, 255, 159, 253, 244, 255, 90, 253, 189, 255, 193, 254, 63, 0, 65, 255, 35, 0, 75, 255, 217, 255, 14, 255, 126, 0, 89, 255, 116, 255, 224, 253, 155, 0, 215, 254, 174, 0, 215, 254, 38, 0, 248, 255, 117, 0, 132, 254, 197, 0, 60, 254, 240, 0, 246, 253, 223, 0, 153, 255, 110, 0, 69, 255, 87, 0, 101, 255, 169, 0, 209, 255, 157, 0, 26, 0, 173, 255, 156, 255, 128, 0, 80, 0, 209, 0, 194, 255, 6, 0, 7, 0, 22, 0, 5, 0, 62, 1, 236, 255, 248, 0, 211, 255, 56, 255, 193, 255, 156, 0, 187, 255, 250, 0, 73, 255, 113, 1, 130, 255, 143, 255, 180, 255, 114, 255, 134, 255, 192, 255, 2, 255, 225, 255, 35, 0, 79, 255, 185, 255, 249, 255, 171, 0, 93, 0, 27, 0, 108, 0, 212, 0, 182, 254, 47, 255, 133, 255, 186, 255, 233, 254, 95, 0, 160, 255, 20, 0, 68, 255, 195, 255, 198, 254, 87, 0, 212, 254, 178, 255, 158, 254, 122, 255, 11, 0, 122, 0, 116, 255, 122, 0, 237, 254, 152, 0, 219, 254, 140, 0, 174, 255, 138, 0, 191, 254, 145, 255, 32, 254, 100, 255, 153, 254, 76, 0, 2, 255, 216, 255, 133, 253, 160, 255, 246, 253, 79, 0, 5, 254, 8, 0, 244, 254, 47, 1, 229, 253, 68, 0, 66, 254, 61, 0, 246, 253, 50, 1, 111, 0, 189, 0, 77, 254, 122, 0, 133, 254, 166, 0, 197, 253, 114, 254, 136, 253, 182, 255, 21, 253, 161, 255, 57, 254, 194, 0, 72, 252, 83, 0, 226, 252, 192, 0, 13, 253, 192, 0, 243, 252, 94, 255, 149, 253, 234, 0, 105, 253, 215, 254, 24, 254, 147, 255, 60, 252, 124, 255, 186, 252, 188, 255, 181, 252, 58, 0, 168, 251, 170, 255, 219, 252, 213, 254, 80, 252, 3, 255, 246, 252, 206, 255, 59, 252, 219, 253, 160, 254, 158, 255, 32, 252, 169, 254, 163, 251, 197, 254, 163, 251, 205, 254, 125, 251, 138, 254, 131, 253, 26, 255, 114, 251, 213, 255, 237, 250, 156, 255, 99, 252, 119, 254, 6, 251, 168, 253, 79, 253, 126, 255, 57, 250, 200, 254, 215, 250, 2, 255, 72, 250, 70, 254, 244, 250, 155, 253, 19, 251, 9, 254, 35, 250, 144, 254, 214, 250, 26, 0, 104, 250, 190, 255, 49, 249, 95, 255, 148, 249, 45, 254, 32, 249, 220, 253, 143, 250, 200, 253, 236, 249, 153, 252, 41, 250, 246, 251, 149, 250, 197, 253, 131, 248, 240, 253, 9, 249, 133, 255, 151, 248, 25, 255, 250, 247, 189, 254, 252, 247, 118, 252, 72, 248, 201, 253, 131, 248, 148, 253, 1, 248, 35, 252, 203, 251, 142, 254, 17, 248, 64, 253, 205, 246, 19, 253, 76, 245, 191, 251, 139, 248, 159, 0, 36, 248, 248, 0, 142, 253, 133, 255, 221, 246, 62, 252, 99, 253, 104, 254, 157, 250, 106, 251, 60, 254, 148, 254, 236, 251, 33, 253, 124, 255, 183, 0, 172, 249, 16, 253, 221, 253, 205, 254, 247, 252, 19, 251, 158, 255, 41, 0, 144, 252, 189, 251, 255, 254, 97, 0, 190, 249, 215, 248, 31, 0, 230, 255, 124, 253, 207, 253, 76, 255, 222, 253, 127, 254, 185, 251, 102, 254, 222, 252, 98, 254, 197, 252, 55, 254, 54, 252, 22, 254, 171, 251, 41, 255, 108, 252, 112, 255, 87, 252, 19, 254, 11, 251, 251, 253, 29, 250, 181, 0, 101, 0, 180, 254, 135, 252, 188, 252, 87, 252, 209, 253, 83, 254, 139, 253, 221, 253, 73, 255, 175, 254, 223, 253, 174, 255, 6, 255, 226, 254, 5, 0, 124, 255, 164, 254, 4, 255, 219, 254, 40, 254, 98, 255, 100, 0, 227, 255, 197, 0, 20, 255, 88, 254, 163, 252, 43, 255, 116, 255, 249, 255, 85, 254, 69, 254, 187, 0, 159, 255, 84, 253, 32, 253, 219, 254, 2, 1, 144, 254, 104, 255, 106, 255, 136, 1, 159, 253, 175, 0, 114, 255, 43, 1, 118, 255, 152, 0, 137, 255, 73, 1, 26, 254, 204, 255, 37, 1, 198, 0, 73, 255, 117, 0, 175, 0, 75, 1, 198, 255, 238, 254, 231, 0, 44, 1, 224, 254, 74, 1, 207, 254, 116, 1, 145, 255, 153, 1, 247, 255, 167, 1, 83, 0, 0, 1, 67, 0, 111, 1, 237, 255, 248, 0, 91, 0, 113, 0, 221, 255, 150, 1, 65, 255, 154, 0, 238, 0, 40, 1, 5, 0, 197, 0, 141, 0, 221, 0, 57, 1, 198, 0, 211, 0, 165, 1, 244, 0, 78, 1, 88, 0, 170, 1, 13, 255, 198, 1, 202, 0, 40, 2, 251, 255, 147, 1, 35, 1, 185, 0, 219, 0, 45, 1, 251, 0, 138, 0, 128, 0, 69, 0, 197, 0, 32, 1, 116, 255, 195, 255, 188, 0, 105, 1, 197, 0, 86, 2, 186, 1, 17, 1, 34, 1, 143, 0, 216, 1, 226, 1, 157, 0, 114, 1, 159, 1, 65, 1, 116, 1, 129, 1, 146, 1, 40, 2, 155, 0, 24, 0, 38, 2, 7, 1, 245, 255, 21, 0, 104, 1, 227, 0, 147, 0, 2, 255, 168, 1, 97, 0, 110, 1, 243, 255, 119, 1, 141, 0, 193, 1, 232, 0, 140, 1, 251, 1, 218, 1, 16, 1, 189, 2, 68, 1, 106, 1, 209, 255, 75, 2, 148, 0, 31, 2, 69, 0, 144, 1, 205, 255, 49, 2, 59, 0, 220, 0, 246, 255, 96, 1, 147, 0, 206, 0, 211, 0, 141, 2, 185, 0, 51, 2, 41, 1, 53, 2, 28, 1, 82, 2, 121, 0, 254, 2, 192, 0, 142, 1, 118, 0, 130, 2, 178, 1, 233, 0, 8, 1, 225, 1, 211, 1, 129, 0, 91, 255, 187, 2, 239, 0, 90, 0, 26, 0, 86, 1, 218, 1, 201, 255, 27, 0, 132, 1, 94, 0, 84, 255, 0, 0, 213, 2, 123, 1, 196, 255, 81, 1, 114, 1, 209, 1, 95, 0, 63, 1, 38, 3, 83, 2, 78, 0, 4, 1, 241, 1, 83, 3, 210, 0, 48, 2, 202, 1, 62, 2, 48, 254, 202, 0, 241, 1, 113, 2, 54, 255, 152, 0, 48, 0, 200, 2, 236, 255, 54, 2, 100, 0, 203, 2, 199, 1, 212, 1, 155, 1, 93, 2, 63, 1, 134, 2, 195, 0, 103, 2, 145, 1, 26, 2, 168, 2, 227, 2, 201, 0, 155, 2, 178, 1, 186, 3, 198, 1, 169, 1, 134, 2, 235, 1, 94, 2, 169, 2, 160, 1, 252, 1, 241, 1, 54, 3, 170, 1, 47, 3, 148, 2, 135, 2, 116, 2, 204, 2, 185, 2, 210, 1, 106, 2, 201, 1, 173, 2, 204, 1, 109, 1, 53, 1, 209, 2, 55, 2, 68, 3, 89, 2, 97, 2, 44, 1, 57, 3, 203, 1, 175, 3, 175, 2, 169, 2, 21, 2, 147, 3, 86, 2, 79, 2, 243, 0, 108, 3, 195, 1, 106, 3, 164, 1, 18, 3, 61, 1, 220, 2, 220, 0, 154, 3, 61, 1, 84, 4, 111, 1, 19, 2, 210, 1, 4, 4, 137, 2, 29, 4, 103, 2, 10, 4, 41, 2, 61, 3, 90, 2, 253, 3, 31, 3, 159, 3, 35, 3, 110, 3, 251, 2, 31, 3, 240, 1, 93, 5, 5, 3, 73, 2, 2, 3, 35, 3, 162, 3, 75, 4, 25, 3, 198, 4, 94, 3, 185, 4, 127, 3, 1, 4, 215, 2, 4, 3, 77, 3, 148, 4, 91, 4, 99, 3, 253, 3, 62, 3, 245, 3, 73, 3, 142, 3, 250, 1, 191, 2, 215, 4, 53, 4, 108, 2, 51, 3, 172, 4, 59, 4, 131, 4, 57, 4, 118, 4, 139, 3, 11, 6, 97, 4, 29, 5, 136, 2, 63, 5, 100, 2, 204, 5, 220, 3, 199, 5, 169, 3, 217, 3, 48, 5, 187, 3, 61, 5, 173, 1, 142, 3, 73, 3, 58, 5, 52, 2, 155, 4, 156, 1, 132, 4, 147, 5, 40, 5, 154, 5, 50, 5, 128, 2, 248, 2, 190, 6, 130, 5, 190, 0, 43, 2, 49, 4, 237, 3, 170, 1, 1, 1, 71, 3, 212, 3, 235, 0, 231, 0, 240, 5, 143, 4, 109, 0, 37, 1, 246, 3, 33, 6, 49, 1, 142, 0, 124, 4, 27, 2, 221, 254, 148, 255, 189, 4, 204, 3, 22, 0, 40, 255, 155, 2, 60, 3, 30, 254, 182, 1, 197, 1, 151, 5, 187, 253, 90, 254, 21, 3, 131, 1, 154, 254, 58, 254, 174, 0, 12, 3, 220, 255, 140, 254, 134, 1, 122, 255, 139, 253, 160, 0, 206, 254, 239, 2, 22, 251, 181, 254, 177, 0, 10, 2, 8, 255, 62, 2, 5, 255, 127, 2, 237, 253, 151, 1, 172, 253, 138, 1, 93, 254, 21, 3, 151, 253, 33, 3, 38, 252, 143, 1, 167, 252, 215, 2, 249, 255, 6, 2, 65, 253, 54, 1, 137, 251, 232, 255, 22, 252, 31, 1, 64, 252, 107, 1, 237, 250, 56, 1, 2, 250, 245, 0, 235, 249, 49, 1, 28, 0, 153, 0, 165, 252, 81, 255, 223, 255, 76, 1, 138, 250, 102, 255, 212, 0, 154, 1, 175, 253, 59, 255, 188, 251, 64, 253, 120, 252, 191, 255, 26, 1, 111, 1, 106, 252, 82, 253, 89, 1, 93, 0, 254, 254, 155, 254, 184, 2, 132, 2, 75, 253, 228, 255, 192, 1, 237, 1, 239, 254, 193, 0, 15, 2, 34, 2, 13, 255, 255, 253, 128, 1, 120, 255, 17, 1, 159, 254, 0, 2, 114, 255, 25, 2, 58, 255, 173, 3, 238, 2, 83, 0, 248, 0, 66, 2, 93, 3, 200, 255, 80, 2, 74, 3, 44, 0, 124, 3, 24, 0, 33, 0, 122, 3, 240, 255, 214, 3, 63, 3, 118, 5, 255, 5, 106, 7, 180, 6, 96, 5, 156, 7, 185, 5, 22, 252, 95, 252, 184, 251, 77, 251, 127, 253, 93, 252, 164, 253, 63, 252, 245, 252, 95, 253, 189, 252, 236, 252, 96, 254, 104, 253, 54, 254, 2, 253, 116, 253, 247, 253, 106, 253, 17, 254, 1, 252, 3, 254, 1, 252, 84, 254, 68, 254, 216, 253, 144, 254, 63, 254, 33, 254, 45, 255, 226, 251, 121, 252, 196, 254, 7, 255, 199, 253, 177, 253, 199, 253, 237, 254, 227, 253, 65, 255, 52, 253, 68, 255, 182, 252, 248, 254, 179, 254, 8, 255, 194, 254, 28, 255, 237, 254, 1, 0, 201, 253, 28, 255, 141, 255, 35, 255, 18, 255, 138, 254, 59, 255, 5, 254, 34, 255, 189, 253, 254, 254, 80, 254, 195, 255, 12, 255, 167, 254, 2, 0, 174, 254, 39, 0, 41, 255, 87, 255, 198, 255, 0, 0, 200, 255, 250, 255, 53, 255, 125, 255, 1, 0, 70, 255, 251, 255, 45, 255, 6, 0, 132, 254, 11, 0, 94, 254, 140, 255, 131, 0, 122, 255, 113, 0, 89, 0, 252, 255, 71, 0, 254, 255, 237, 255, 64, 255, 6, 1, 24, 0, 189, 0, 151, 0, 123, 255, 147, 255, 186, 0, 103, 255, 166, 0, 37, 255, 37, 0, 139, 0, 193, 0, 171, 0, 81, 1, 124, 0, 158, 0, 195, 255, 141, 0, 226, 0, 243, 255, 190, 0, 231, 0, 34, 0, 98, 1, 109, 0, 60, 1, 201, 0, 244, 0, 164, 0, 74, 1, 171, 255, 134, 1, 172, 255, 254, 0, 71, 1, 1, 1, 79, 1, 235, 1, 147, 0, 220, 1, 105, 0, 54, 0, 77, 0, 181, 1, 114, 1, 165, 1, 58, 1, 193, 1, 86, 1, 73, 1, 126, 0, 161, 2, 36, 1, 59, 2, 132, 1, 243, 0, 193, 0, 141, 2, 64, 1, 109, 2, 24, 1, 194, 0, 124, 1, 5, 2, 69, 2, 45, 0, 67, 1, 111, 0, 166, 1, 233, 1, 139, 1, 222, 2, 22, 2, 110, 2, 34, 2, 230, 1, 246, 1, 62, 1, 60, 2, 189, 0, 38, 2, 129, 1, 166, 1, 99, 255, 153, 0, 131, 255, 126, 1, 59, 255, 130, 1, 249, 254, 78, 1, 228, 0, 185, 2, 68, 255, 1, 0, 51, 0, 41, 1, 5, 254, 213, 0, 136, 254, 141, 1, 232, 255, 255, 0, 221, 253, 89, 0, 10, 254, 162, 255, 131, 1, 179, 0, 148, 253, 68, 0, 84, 253, 112, 0, 126, 253, 162, 254, 252, 254, 172, 0, 74, 254, 188, 254, 8, 1, 136, 2, 60, 252, 252, 255, 159, 251, 7, 0, 122, 255, 134, 0, 147, 251, 206, 254, 143, 0, 96, 0, 92, 254, 15, 254, 59, 251, 162, 254, 9, 250, 83, 253, 95, 255, 72, 0, 105, 3, 179, 2, 220, 2, 27, 1, 153, 3, 97, 1, 78, 1, 219, 1, 71, 4, 53, 3, 96, 3, 12, 2, 75, 3, 241, 1, 202, 2, 199, 2, 20, 3, 238, 2, 52, 4, 202, 2, 180, 4, 241, 2, 65, 2, 150, 2, 124, 245, 170, 192, 38, 3, 44, 7, 95, 251, 33, 228, 37, 12, 28, 4, 40, 248, 202, 208, 85, 16, 107, 5, 192, 249, 99, 218, 69, 9, 145, 5, 232, 249, 78, 219, 176, 12, 193, 7, 210, 251, 214, 230, 35, 7, 16, 9, 184, 252, 64, 236, 173, 3, 242, 12, 199, 254, 163, 248, 47, 9, 161, 11, 41, 254, 234, 244, 32, 14, 116, 9, 247, 252, 183, 237, 123, 13, 24, 12, 98, 254, 70, 246, 139, 11, 205, 16, 72, 0, 178, 1, 56, 7, 148, 17, 139, 0, 68, 3, 44, 15, 40, 21, 157, 1, 180, 9, 163, 4, 42, 28, 67, 3, 166, 19, 11, 12, 40, 35, 139, 4, 90, 27, 216, 28, 115, 3, 37, 247, 177, 202, 74, 23, 226, 5, 58, 250, 60, 221, 35, 20, 86, 8, 61, 252, 88, 233, 8, 31, 217, 7, 228, 251, 65, 231, 107, 25, 202, 8, 139, 252, 49, 235, 246, 29, 192, 10, 180, 253, 47, 242, 64, 23, 200, 11, 60, 254, 92, 245, 34, 19, 180, 14, 131, 255, 17, 253, 77, 27, 4, 14, 60, 255, 103, 251, 238, 31, 138, 15, 213, 255, 252, 254, 176, 23, 52, 17, 107, 0, 133, 2, 29, 30, 223, 19, 64, 1, 136, 7, 147, 21, 133, 23, 57, 2, 98, 13, 89, 30, 214, 27, 50, 3, 62, 19, 172, 23, 2, 31, 209, 3, 253, 22, 218, 21, 223, 44, 243, 5, 212, 35, 85, 41, 76, 5, 159, 249, 153, 217, 89, 35, 61, 6, 145, 250, 68, 223, 66, 38, 243, 7, 247, 251, 180, 231, 242, 34, 111, 9, 244, 252, 164, 237, 56, 40, 24, 10, 87, 253, 253, 239, 191, 36, 174, 10, 171, 253, 245, 241, 252, 33, 146, 12, 156, 254, 160, 247, 29, 38, 67, 13, 235, 254, 123, 249, 193, 39, 52, 15, 181, 255, 58, 254, 210, 35, 176, 17, 148, 0, 123, 3, 168, 39, 140, 19, 40, 1, 245, 6, 154, 35, 103, 22, 241, 1, 177, 11, 4, 41, 122, 24, 116, 2, 198, 14, 126, 39, 207, 29, 151, 3, 158, 21, 140, 34, 23, 34, 93, 4, 72, 26, 252, 34, 208, 48, 112, 6, 193, 38, 124, 50, 208, 3, 185, 247, 47, 206, 171, 44, 219, 6, 28, 251, 141, 226, 106, 47, 24, 9, 189, 252, 96, 236, 124, 44, 64, 9, 214, 252, 248, 236, 204, 41, 248, 11, 83, 254, 236, 245, 44, 48, 45, 11, 238, 253, 136, 243, 202, 45, 255, 12, 205, 254, 200, 248, 6, 44, 116, 14, 106, 255, 120, 252, 109, 42, 61, 17, 110, 0, 151, 2, 50, 47, 181, 17, 150, 0, 134, 3, 19, 44, 85, 20, 98, 1, 84, 8, 184, 46, 161, 24, 125, 2, 253, 14, 159, 43, 110, 29, 132, 3, 44, 21, 96, 47, 137, 32, 25, 4, 168, 24, 217, 42, 25, 42, 149, 5, 156, 33, 60, 40, 224, 67, 87, 8, 53, 50, 75, 54, 145, 6, 220, 250, 15, 225, 36, 49, 253, 7, 254, 251, 221, 231, 209, 51, 135, 9, 2, 253, 254, 237, 209, 54, 173, 11, 47, 254, 14, 245, 140, 52, 26, 12, 99, 254, 78, 246, 108, 48, 74, 14, 89, 255, 18, 252, 198, 52, 196, 14, 137, 255, 55, 253, 80, 50, 176, 16, 62, 0, 118, 1, 221, 52, 253, 18, 253, 0, 243, 5, 123, 49, 81, 21, 168, 1, 248, 9, 30, 54, 218, 23, 78, 2, 223, 13, 231, 50, 83, 25, 166, 2, 244, 15, 245, 52, 41, 30, 169, 3, 7, 22, 157, 50, 95, 36, 189, 4, 136, 28, 146, 53, 31, 45, 252, 5, 5, 36, 47, 49, 102, 59, 146, 7, 147, 45, 9, 59, 4, 6, 91, 250, 4, 222, 224, 58, 29, 9, 192, 252, 113, 236, 191, 56, 207, 9, 45, 253, 0, 239, 100, 57, 127, 12, 147, 254, 107, 247, 22, 60, 232, 13, 49, 255, 33, 251, 53, 55, 120, 15, 206, 255, 212, 254, 254, 58, 140, 16, 50, 0, 42, 1, 252, 55, 216, 18, 242, 0, 174, 5, 254, 57, 75, 21, 166, 1, 238, 9, 202, 59, 195, 23, 72, 2, 190, 13, 249, 55, 232, 26, 0, 3, 15, 18, 212, 58, 9, 30, 162, 3, 226, 21, 70, 56, 210, 36, 207, 4, 245, 28, 27, 60, 13, 38, 0, 5, 26, 30, 232, 57, 191, 55, 52, 7, 94, 43, 32, 53, 107, 97, 109, 10, 195, 62, 12, 64, 177, 7, 198, 251, 139, 230, 177, 65, 16, 11, 223, 253, 45, 243, 97, 61, 27, 11, 229, 253, 80, 243, 232, 62, 8, 13, 209, 254, 223, 248, 0, 64, 123, 15, 207, 255, 218, 254, 44, 66, 227, 17, 165, 0, 224, 3, 95, 61, 247, 17, 171, 0, 6, 4, 94, 63, 72, 21, 165, 1, 233, 9, 192, 65, 238, 24, 143, 2, 105, 15, 129, 61, 229, 27, 53, 3, 80, 19, 198, 63, 45, 29, 120, 3, 223, 20, 227, 64, 176, 33, 76, 4, 222, 25, 132, 66, 178, 40, 99, 5, 111, 32, 33, 62, 41, 46, 29, 6, 207, 36, 238, 65, 98, 57, 95, 7, 96, 44, 131, 64, 134, 81, 102, 9, 147, 56, 222, 70, 35, 8, 25, 252, 131, 232, 201, 75, 106, 12, 137, 254, 47, 247, 100, 68, 98, 13, 248, 254, 203, 249, 86, 78, 187, 15, 231, 255, 105, 255, 149, 70, 153, 16, 54, 0, 70, 1, 8, 74, 202, 19, 58, 1, 98, 7, 47, 69, 26, 21, 153, 1, 157, 9, 123, 77, 48, 24, 98, 2, 92, 14, 30, 70, 102, 27, 27, 3, 176, 18, 70, 83, 197, 30, 198, 3, 184, 22, 246, 69, 73, 36, 186, 4, 115, 28, 200, 74, 74, 36, 186, 4, 116, 28, 37, 80, 117, 44, 230, 5, 129, 35, 155, 70, 149, 56, 74, 7, 226, 43, 31, 78, 218, 69, 129, 8, 52, 51, 154, 73, 252, 127, 0, 12, 62, 72, 61, 42, 81, 112, 63, 11, 181, 67, 0, 80, 225, 10, 198, 253, 153, 242, 153, 73, 194, 25, 191, 2, 139, 16, 81, 24, 245, 28, 108, 3, 156, 20, 51, 67, 204, 40, 103, 5, 133, 32, 122, 84, 245, 4, 61, 249, 74, 215, 143, 82, 71, 17, 113, 0, 171, 2, 40, 44, 20, 6, 106, 250, 95, 222, 61, 74, 20, 50, 150, 6, 164, 39, 215, 67, 194, 9, 37, 253, 210, 238, 194, 69, 225, 18, 244, 0, 192, 5, 10, 39, 194, 9, 37, 253, 210, 238, 122, 68, 184, 30, 196, 3, 170, 22, 174, 55, 92, 7, 133, 251, 5, 229, 20, 62, 81, 12, 125, 254, 233, 246, 61, 26, 10, 7, 67, 251, 121, 227, 10, 71, 225, 78, 53, 9, 109, 55, 102, 70, 215, 11, 67, 254, 138, 245, 71, 65, 225, 22, 16, 2, 109, 12, 143, 34, 174, 15, 226, 255, 76, 255, 20, 62, 10, 35, 134, 4, 60, 27, 102, 70, 112, 5, 198, 249, 129, 218, 71, 65, 0, 16, 0, 0, 0, 0, 0, 32, 143, 2, 108, 245, 79, 192, 133, 59, 102, 54, 16, 7, 132, 42, 174, 55, 40, 12, 106, 254, 116, 246, 10, 55, 61, 18, 193, 0, 141, 4, 30, 21, 143, 10, 154, 253, 143, 241, 122, 52, 153, 25, 182, 2, 84, 16, 163, 48, 133, 3, 67, 247, 100, 203, 163, 48, 102, 10, 131, 253, 7, 241, 184, 14, 143, 2, 108, 245, 79, 192, 153, 57, 215, 91, 22, 10, 183, 60, 225, 74, 153, 9, 13, 253, 62, 238, 184, 78, 215, 19, 62, 1, 121, 7, 225, 26, 0, 16, 0, 0, 0, 0, 0, 80, 112, 33, 65, 4, 156, 25, 204, 76, 225, 2, 26, 246, 105, 196, 61, 74, 163, 16, 58, 0, 91, 1, 184, 30, 40, 8, 29, 252, 151, 232, 204, 44, 0, 48, 87, 6, 43, 38, 20, 62, 194, 5, 26, 250, 126, 220, 112, 61, 20, 18, 180, 0, 62, 4, 215, 35, 153, 5, 240, 249, 131, 219, 184, 62, 92, 27, 25, 3, 164, 18, 235, 57, 225, 2, 26, 246, 105, 196, 225, 58, 204, 8, 140, 252, 55, 235, 215, 19, 204, 4, 12, 249, 38, 214, 215, 51, 174, 67, 83, 8, 27, 50, 163, 64, 30, 9, 193, 252, 118, 236, 225, 58, 184, 22, 6, 2, 46, 12, 92, 15, 102, 14, 100, 255, 86, 252, 174, 55, 153, 33, 72, 4, 198, 25, 235, 65, 10, 3, 106, 246, 74, 198, 225, 58, 225, 14, 149, 255, 122, 253, 174, 23, 102, 2, 12, 245, 17, 190, 122, 36, 40, 36, 180, 4, 83, 28, 215, 51, 225, 6, 33, 251, 172, 226, 215, 51, 194, 13, 33, 255, 193, 250, 153, 9, 174, 7, 196, 251, 127, 230, 204, 44, 153, 21, 187, 1, 108, 10, 245, 40, 225, 2, 26, 246, 105, 196, 112, 45, 122, 12, 145, 254, 92, 247, 194, 5, 10, 3, 106, 246, 74, 198, 0, 64, 248, 65, 226, 67, 190, 69, 142, 71, 82, 73, 12, 75, 188, 76, 98, 78, 0, 80, 150, 81, 35, 83, 170, 84, 42, 86, 163, 87, 22, 89, 130, 90, 234, 91, 76, 93, 168, 94, 0, 96, 83, 97, 161, 98, 236, 99, 49, 101, 115, 102, 177, 103, 235, 104, 34, 106, 85, 107, 132, 108, 177, 109, 218, 110, 0, 112, 35, 113, 67, 114, 97, 115, 123, 116, 147, 117, 169, 118, 188, 119, 204, 120, 218, 121, 230, 122, 239, 123, 247, 124, 252, 125, 255, 126, 255, 127, 255, 127, 61, 10, 63, 10, 69, 10, 78, 10, 91, 10, 108, 10, 129, 10, 153, 10, 181, 10, 212, 10, 248, 10, 31, 11, 74, 11, 120, 11, 170, 11, 224, 11, 25, 12, 86, 12, 151, 12, 219, 12, 35, 13, 110, 13, 189, 13, 15, 14, 101, 14, 190, 14, 27, 15, 123, 15, 223, 15, 70, 16, 176, 16, 30, 17, 143, 17, 3, 18, 123, 18, 245, 18, 115, 19, 244, 19, 120, 20, 0, 21, 138, 21, 23, 22, 168, 22, 59, 23, 209, 23, 106, 24, 6, 25, 165, 25, 70, 26, 234, 26, 145, 27, 59, 28, 231, 28, 149, 29, 70, 30, 250, 30, 176, 31, 104, 32, 35, 33, 224, 33, 159, 34, 97, 35, 36, 36, 234, 36, 178, 37, 124, 38, 71, 39, 21, 40, 228, 40, 181, 41, 136, 42, 93, 43, 51, 44, 11, 45, 228, 45, 191, 46, 155, 47, 121, 48, 88, 49, 56, 50, 26, 51, 252, 51, 224, 52, 196, 53, 170, 54, 145, 55, 120, 56, 96, 57, 73, 58, 51, 59, 29, 60, 8, 61, 243, 61, 223, 62, 203, 63, 184, 64, 165, 65, 146, 66, 127, 67, 108, 68, 90, 69, 71, 70, 52, 71, 33, 72, 14, 73, 251, 73, 231, 74, 211, 75, 191, 76, 170, 77, 149, 78, 126, 79, 104, 80, 80, 81, 56, 82, 31, 83, 5, 84, 234, 84, 207, 85, 178, 86, 148, 87, 116, 88, 84, 89, 50, 90, 15, 91, 235, 91, 197, 92, 157, 93, 117, 94, 74, 95, 30, 96, 240, 96, 192, 97, 143, 98, 91, 99, 38, 100, 239, 100, 181, 101, 122, 102, 60, 103, 253, 103, 187, 104, 119, 105, 48, 106, 232, 106, 156, 107, 79, 108, 255, 108, 172, 109, 87, 110, 255, 110, 165, 111, 71, 112, 231, 112, 133, 113, 31, 114, 183, 114, 75, 115, 221, 115, 108, 116, 248, 116, 129, 117, 6, 118, 137, 118, 8, 119, 133, 119, 254, 119, 116, 120, 230, 120, 86, 121, 194, 121, 42, 122, 144, 122, 242, 122, 80, 123, 171, 123, 3, 124, 87, 124, 167, 124, 244, 124, 62, 125, 132, 125, 198, 125, 5, 126, 64, 126, 120, 126, 172, 126, 220, 126, 9, 127, 49, 127, 87, 127, 120, 127, 150, 127, 176, 127, 199, 127, 217, 127, 232, 127, 243, 127, 251, 127, 255, 127, 255, 127, 229, 127, 153, 127, 25, 127, 103, 126, 129, 125], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE + 20480),
		allocate([106, 124, 33, 123, 167, 121, 252, 119, 34, 118, 24, 116, 223, 113, 122, 111, 231, 108, 41, 106, 65, 103, 47, 100, 245, 96, 149, 93, 15, 90, 101, 86, 153, 82, 171, 78, 158, 74, 116, 70, 45, 66, 204, 61, 82, 57, 193, 52, 27, 48, 98, 43, 151, 38, 189, 33, 213, 28, 226, 23, 230, 18, 226, 13, 216, 8, 203, 3, 61, 10, 64, 10, 73, 10, 88, 10, 108, 10, 135, 10, 167, 10, 205, 10, 249, 10, 43, 11, 99, 11, 160, 11, 227, 11, 44, 12, 122, 12, 207, 12, 40, 13, 136, 13, 237, 13, 87, 14, 199, 14, 60, 15, 183, 15, 55, 16, 189, 16, 71, 17, 215, 17, 108, 18, 6, 19, 165, 19, 73, 20, 242, 20, 159, 21, 82, 22, 9, 23, 196, 23, 133, 24, 73, 25, 18, 26, 224, 26, 177, 27, 135, 28, 97, 29, 62, 30, 32, 31, 5, 32, 238, 32, 219, 33, 203, 34, 191, 35, 182, 36, 176, 37, 174, 38, 174, 39, 177, 40, 184, 41, 193, 42, 204, 43, 218, 44, 235, 45, 254, 46, 19, 48, 42, 49, 67, 50, 94, 51, 123, 52, 154, 53, 186, 54, 219, 55, 254, 56, 34, 58, 71, 59, 109, 60, 148, 61, 188, 62, 228, 63, 13, 65, 54, 66, 96, 67, 138, 68, 180, 69, 221, 70, 7, 72, 48, 73, 89, 74, 130, 75, 169, 76, 208, 77, 246, 78, 27, 80, 63, 81, 98, 82, 132, 83, 164, 84, 194, 85, 223, 86, 250, 87, 19, 89, 43, 90, 64, 91, 83, 92, 99, 93, 113, 94, 125, 95, 134, 96, 140, 97, 143, 98, 144, 99, 141, 100, 135, 101, 126, 102, 114, 103, 98, 104, 79, 105, 56, 106, 30, 107, 255, 107, 221, 108, 183, 109, 140, 110, 94, 111, 43, 112, 244, 112, 185, 113, 121, 114, 53, 115, 236, 115, 158, 116, 76, 117, 245, 117, 153, 118, 55, 119, 209, 119, 102, 120, 246, 120, 129, 121, 6, 122, 134, 122, 1, 123, 118, 123, 230, 123, 81, 124, 182, 124, 21, 125, 111, 125, 195, 125, 17, 126, 90, 126, 157, 126, 219, 126, 18, 127, 68, 127, 112, 127, 150, 127, 183, 127, 209, 127, 230, 127, 244, 127, 253, 127, 255, 127, 255, 127, 244, 127, 208, 127, 149, 127, 66, 127, 215, 126, 85, 126, 188, 125, 12, 125, 69, 124, 104, 123, 117, 122, 108, 121, 78, 120, 28, 119, 213, 117, 122, 116, 13, 115, 140, 113, 250, 111, 87, 110, 162, 108, 222, 106, 11, 105, 40, 103, 57, 101, 60, 99, 51, 97, 30, 95, 255, 92, 215, 90, 165, 88, 108, 86, 44, 84, 229, 81, 154, 79, 74, 77, 247, 74, 161, 72, 74, 70, 243, 67, 156, 65, 71, 63, 244, 60, 164, 58, 88, 56, 18, 54, 209, 51, 152, 49, 103, 47, 62, 45, 31, 43, 11, 41, 2, 39, 5, 37, 21, 35, 51, 33, 95, 31, 155, 29, 231, 27, 67, 26, 177, 24, 49, 23, 195, 21, 105, 20, 34, 19, 239, 17, 209, 16, 201, 15, 214, 14, 249, 13, 50, 13, 130, 12, 232, 11, 102, 11, 252, 10, 169, 10, 109, 10, 73, 10, 61, 10, 61, 10, 63, 10, 67, 10, 74, 10, 84, 10, 96, 10, 111, 10, 129, 10, 150, 10, 174, 10, 200, 10, 229, 10, 5, 11, 39, 11, 77, 11, 117, 11, 159, 11, 205, 11, 253, 11, 48, 12, 101, 12, 157, 12, 216, 12, 22, 13, 86, 13, 153, 13, 222, 13, 38, 14, 113, 14, 190, 14, 13, 15, 96, 15, 181, 15, 12, 16, 102, 16, 194, 16, 33, 17, 130, 17, 230, 17, 76, 18, 180, 18, 31, 19, 140, 19, 252, 19, 110, 20, 226, 20, 88, 21, 209, 21, 76, 22, 201, 22, 72, 23, 202, 23, 77, 24, 211, 24, 91, 25, 229, 25, 113, 26, 254, 26, 142, 27, 32, 28, 180, 28, 74, 29, 225, 29, 123, 30, 22, 31, 179, 31, 82, 32, 242, 32, 149, 33, 57, 34, 222, 34, 133, 35, 46, 36, 216, 36, 132, 37, 50, 38, 224, 38, 145, 39, 66, 40, 245, 40, 169, 41, 95, 42, 22, 43, 206, 43, 135, 44, 66, 45, 253, 45, 186, 46, 120, 47, 54, 48, 246, 48, 183, 49, 120, 50, 59, 51, 254, 51, 194, 52, 135, 53, 77, 54, 19, 55, 218, 55, 161, 56, 106, 57, 50, 58, 252, 58, 197, 59, 144, 60, 90, 61, 37, 62, 240, 62, 188, 63, 136, 64, 84, 65, 32, 66, 236, 66, 185, 67, 133, 68, 82, 69, 30, 70, 235, 70, 183, 71, 132, 72, 80, 73, 28, 74, 231, 74, 179, 75, 126, 76, 73, 77, 19, 78, 221, 78, 166, 79, 111, 80, 56, 81, 0, 82, 199, 82, 142, 83, 84, 84, 25, 85, 221, 85, 161, 86, 100, 87, 38, 88, 231, 88, 167, 89, 103, 90, 37, 91, 226, 91, 158, 92, 89, 93, 19, 94, 204, 94, 131, 95, 57, 96, 238, 96, 162, 97, 84, 98, 5, 99, 181, 99, 99, 100, 15, 101, 186, 101, 100, 102, 12, 103, 178, 103, 87, 104, 250, 104, 155, 105, 59, 106, 217, 106, 117, 107, 16, 108, 168, 108, 63, 109, 211, 109, 102, 110, 247, 110, 134, 111, 19, 112, 158, 112, 39, 113, 174, 113, 50, 114, 181, 114, 53, 115, 179, 115, 47, 116, 169, 116, 33, 117, 150, 117, 9, 118, 122, 118, 232, 118, 84, 119, 190, 119, 37, 120, 138, 120, 236, 120, 76, 121, 170, 121, 5, 122, 94, 122, 180, 122, 7, 123, 88, 123, 167, 123, 242, 123, 60, 124, 130, 124, 198, 124, 8, 125, 71, 125, 131, 125, 188, 125, 243, 125, 39, 126, 89, 126, 136, 126, 180, 126, 221, 126, 4, 127, 40, 127, 73, 127, 103, 127, 131, 127, 156, 127, 178, 127, 197, 127, 214, 127, 228, 127, 239, 127, 247, 127, 253, 127, 255, 127, 255, 127, 97, 125, 160, 117, 15, 105, 48, 88, 181, 67, 116, 44, 98, 19, 68, 101, 99, 111, 100, 101, 114, 0, 101, 110, 99, 111, 100, 101, 114, 0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE + 30720);
	var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
	assert(tempDoublePtr % 8 == 0);
	var ERRNO_CODES = {
		EPERM: 1,
		ENOENT: 2,
		ESRCH: 3,
		EINTR: 4,
		EIO: 5,
		ENXIO: 6,
		E2BIG: 7,
		ENOEXEC: 8,
		EBADF: 9,
		ECHILD: 10,
		EAGAIN: 11,
		EWOULDBLOCK: 11,
		ENOMEM: 12,
		EACCES: 13,
		EFAULT: 14,
		ENOTBLK: 15,
		EBUSY: 16,
		EEXIST: 17,
		EXDEV: 18,
		ENODEV: 19,
		ENOTDIR: 20,
		EISDIR: 21,
		EINVAL: 22,
		ENFILE: 23,
		EMFILE: 24,
		ENOTTY: 25,
		ETXTBSY: 26,
		EFBIG: 27,
		ENOSPC: 28,
		ESPIPE: 29,
		EROFS: 30,
		EMLINK: 31,
		EPIPE: 32,
		EDOM: 33,
		ERANGE: 34,
		ENOMSG: 42,
		EIDRM: 43,
		ECHRNG: 44,
		EL2NSYNC: 45,
		EL3HLT: 46,
		EL3RST: 47,
		ELNRNG: 48,
		EUNATCH: 49,
		ENOCSI: 50,
		EL2HLT: 51,
		EDEADLK: 35,
		ENOLCK: 37,
		EBADE: 52,
		EBADR: 53,
		EXFULL: 54,
		ENOANO: 55,
		EBADRQC: 56,
		EBADSLT: 57,
		EDEADLOCK: 35,
		EBFONT: 59,
		ENOSTR: 60,
		ENODATA: 61,
		ETIME: 62,
		ENOSR: 63,
		ENONET: 64,
		ENOPKG: 65,
		EREMOTE: 66,
		ENOLINK: 67,
		EADV: 68,
		ESRMNT: 69,
		ECOMM: 70,
		EPROTO: 71,
		EMULTIHOP: 72,
		EDOTDOT: 73,
		EBADMSG: 74,
		ENOTUNIQ: 76,
		EBADFD: 77,
		EREMCHG: 78,
		ELIBACC: 79,
		ELIBBAD: 80,
		ELIBSCN: 81,
		ELIBMAX: 82,
		ELIBEXEC: 83,
		ENOSYS: 38,
		ENOTEMPTY: 39,
		ENAMETOOLONG: 36,
		ELOOP: 40,
		EOPNOTSUPP: 95,
		EPFNOSUPPORT: 96,
		ECONNRESET: 104,
		ENOBUFS: 105,
		EAFNOSUPPORT: 97,
		EPROTOTYPE: 91,
		ENOTSOCK: 88,
		ENOPROTOOPT: 92,
		ESHUTDOWN: 108,
		ECONNREFUSED: 111,
		EADDRINUSE: 98,
		ECONNABORTED: 103,
		ENETUNREACH: 101,
		ENETDOWN: 100,
		ETIMEDOUT: 110,
		EHOSTDOWN: 112,
		EHOSTUNREACH: 113,
		EINPROGRESS: 115,
		EALREADY: 114,
		EDESTADDRREQ: 89,
		EMSGSIZE: 90,
		EPROTONOSUPPORT: 93,
		ESOCKTNOSUPPORT: 94,
		EADDRNOTAVAIL: 99,
		ENETRESET: 102,
		EISCONN: 106,
		ENOTCONN: 107,
		ETOOMANYREFS: 109,
		EUSERS: 87,
		EDQUOT: 122,
		ESTALE: 116,
		ENOTSUP: 95,
		ENOMEDIUM: 123,
		EILSEQ: 84,
		EOVERFLOW: 75,
		ECANCELED: 125,
		ENOTRECOVERABLE: 131,
		EOWNERDEAD: 130,
		ESTRPIPE: 86
	};
	Module._memcpy = _memcpy, Module._memmove = _memmove, Module._memset = _memset;
	var ERRNO_MESSAGES = {
			0: "Success",
			1: "Not super-user",
			2: "No such file or directory",
			3: "No such process",
			4: "Interrupted system call",
			5: "I/O error",
			6: "No such device or address",
			7: "Arg list too long",
			8: "Exec format error",
			9: "Bad file number",
			10: "No children",
			11: "No more processes",
			12: "Not enough core",
			13: "Permission denied",
			14: "Bad address",
			15: "Block device required",
			16: "Mount device busy",
			17: "File exists",
			18: "Cross-device link",
			19: "No such device",
			20: "Not a directory",
			21: "Is a directory",
			22: "Invalid argument",
			23: "Too many open files in system",
			24: "Too many open files",
			25: "Not a typewriter",
			26: "Text file busy",
			27: "File too large",
			28: "No space left on device",
			29: "Illegal seek",
			30: "Read only file system",
			31: "Too many links",
			32: "Broken pipe",
			33: "Math arg out of domain of func",
			34: "Math result not representable",
			35: "File locking deadlock error",
			36: "File or path name too long",
			37: "No record locks available",
			38: "Function not implemented",
			39: "Directory not empty",
			40: "Too many symbolic links",
			42: "No message of desired type",
			43: "Identifier removed",
			44: "Channel number out of range",
			45: "Level 2 not synchronized",
			46: "Level 3 halted",
			47: "Level 3 reset",
			48: "Link number out of range",
			49: "Protocol driver not attached",
			50: "No CSI structure available",
			51: "Level 2 halted",
			52: "Invalid exchange",
			53: "Invalid request descriptor",
			54: "Exchange full",
			55: "No anode",
			56: "Invalid request code",
			57: "Invalid slot",
			59: "Bad font file fmt",
			60: "Device not a stream",
			61: "No data (for no delay io)",
			62: "Timer expired",
			63: "Out of streams resources",
			64: "Machine is not on the network",
			65: "Package not installed",
			66: "The object is remote",
			67: "The link has been severed",
			68: "Advertise error",
			69: "Srmount error",
			70: "Communication error on send",
			71: "Protocol error",
			72: "Multihop attempted",
			73: "Cross mount point (not really error)",
			74: "Trying to read unreadable message",
			75: "Value too large for defined data type",
			76: "Given log. name not unique",
			77: "f.d. invalid for this operation",
			78: "Remote address changed",
			79: "Can   access a needed shared lib",
			80: "Accessing a corrupted shared lib",
			81: ".lib section in a.out corrupted",
			82: "Attempting to link in too many libs",
			83: "Attempting to exec a shared library",
			84: "Illegal byte sequence",
			86: "Streams pipe error",
			87: "Too many users",
			88: "Socket operation on non-socket",
			89: "Destination address required",
			90: "Message too long",
			91: "Protocol wrong type for socket",
			92: "Protocol not available",
			93: "Unknown protocol",
			94: "Socket type not supported",
			95: "Not supported",
			96: "Protocol family not supported",
			97: "Address family not supported by protocol family",
			98: "Address already in use",
			99: "Address not available",
			100: "Network interface is not configured",
			101: "Network is unreachable",
			102: "Connection reset by network",
			103: "Connection aborted",
			104: "Connection reset by peer",
			105: "No buffer space available",
			106: "Socket is already connected",
			107: "Socket is not connected",
			108: "Can't send after socket shutdown",
			109: "Too many references",
			110: "Connection timed out",
			111: "Connection refused",
			112: "Host is down",
			113: "Host is unreachable",
			114: "Socket already connected",
			115: "Connection already in progress",
			116: "Stale file handle",
			122: "Quota exceeded",
			123: "No medium (in tape drive)",
			125: "Operation canceled",
			130: "Previous owner died",
			131: "State not recoverable"
		},
		TTY = {
			ttys: [],
			init: function() {},
			shutdown: function() {},
			register: function(e, r) {
				TTY.ttys[e] = {
					input: [],
					output: [],
					ops: r
				}, FS.registerDevice(e, TTY.stream_ops)
			},
			stream_ops: {
				open: function(e) {
					var r = TTY.ttys[e.node.rdev];
					if(!r) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
					e.tty = r, e.seekable = !1
				},
				close: function(e) {
					e.tty.ops.flush(e.tty)
				},
				flush: function(e) {
					e.tty.ops.flush(e.tty)
				},
				read: function(e, r, n, t, i) {
					if(!e.tty || !e.tty.ops.get_char) throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
					for(var o = 0, a = 0; a < t; a++) {
						var s;
						try {
							s = e.tty.ops.get_char(e.tty)
						} catch(l) {
							throw new FS.ErrnoError(ERRNO_CODES.EIO)
						}
						if(void 0 === s && 0 === o) throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
						if(null === s || void 0 === s) break;
						o++, r[n + a] = s
					}
					return o && (e.node.timestamp = Date.now()), o
				},
				write: function(e, r, n, t, i) {
					if(!e.tty || !e.tty.ops.put_char) throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
					for(var o = 0; o < t; o++) try {
						e.tty.ops.put_char(e.tty, r[n + o])
					} catch(a) {
						throw new FS.ErrnoError(ERRNO_CODES.EIO)
					}
					return t && (e.node.timestamp = Date.now()), o
				}
			},
			default_tty_ops: {
				get_char: function(e) {
					if(!e.input.length) {
						var r = null;
						if(ENVIRONMENT_IS_NODE) {
							var n = 256,
								t = new Buffer(n),
								i = 0,
								o = process.stdin.fd,
								a = !1;
							try {
								o = fs.openSync("/dev/stdin", "r"), a = !0
							} catch(s) {}
							i = fs.readSync(o, t, 0, n, null), a && fs.closeSync(o), r = i > 0 ? t.slice(0, i).toString("utf-8") : null
						} else "undefined" != typeof window && "function" == typeof window.prompt ? (r = window.prompt("Input: "), null !== r && (r += "\n")) : "function" == typeof readline && (r = readline(), null !== r && (r += "\n"));
						if(!r) return null;
						e.input = intArrayFromString(r, !0)
					}
					return e.input.shift()
				},
				put_char: function(e, r) {
					null === r || 10 === r ? (Module.print(UTF8ArrayToString(e.output, 0)), e.output = []) : 0 != r && e.output.push(r)
				},
				flush: function(e) {
					e.output && e.output.length > 0 && (Module.print(UTF8ArrayToString(e.output, 0)), e.output = [])
				}
			},
			default_tty1_ops: {
				put_char: function(e, r) {
					null === r || 10 === r ? (Module.printErr(UTF8ArrayToString(e.output, 0)), e.output = []) : 0 != r && e.output.push(r)
				},
				flush: function(e) {
					e.output && e.output.length > 0 && (Module.printErr(UTF8ArrayToString(e.output, 0)), e.output = [])
				}
			}
		},
		MEMFS = {
			ops_table: null,
			mount: function(e) {
				return MEMFS.createNode(null, "/", 16895, 0)
			},
			createNode: function(e, r, n, t) {
				if(FS.isBlkdev(n) || FS.isFIFO(n)) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
				MEMFS.ops_table || (MEMFS.ops_table = {
					dir: {
						node: {
							getattr: MEMFS.node_ops.getattr,
							setattr: MEMFS.node_ops.setattr,
							lookup: MEMFS.node_ops.lookup,
							mknod: MEMFS.node_ops.mknod,
							rename: MEMFS.node_ops.rename,
							unlink: MEMFS.node_ops.unlink,
							rmdir: MEMFS.node_ops.rmdir,
							readdir: MEMFS.node_ops.readdir,
							symlink: MEMFS.node_ops.symlink
						},
						stream: {
							llseek: MEMFS.stream_ops.llseek
						}
					},
					file: {
						node: {
							getattr: MEMFS.node_ops.getattr,
							setattr: MEMFS.node_ops.setattr
						},
						stream: {
							llseek: MEMFS.stream_ops.llseek,
							read: MEMFS.stream_ops.read,
							write: MEMFS.stream_ops.write,
							allocate: MEMFS.stream_ops.allocate,
							mmap: MEMFS.stream_ops.mmap,
							msync: MEMFS.stream_ops.msync
						}
					},
					link: {
						node: {
							getattr: MEMFS.node_ops.getattr,
							setattr: MEMFS.node_ops.setattr,
							readlink: MEMFS.node_ops.readlink
						},
						stream: {}
					},
					chrdev: {
						node: {
							getattr: MEMFS.node_ops.getattr,
							setattr: MEMFS.node_ops.setattr
						},
						stream: FS.chrdev_stream_ops
					}
				});
				var i = FS.createNode(e, r, n, t);
				return FS.isDir(i.mode) ? (i.node_ops = MEMFS.ops_table.dir.node, i.stream_ops = MEMFS.ops_table.dir.stream, i.contents = {}) : FS.isFile(i.mode) ? (i.node_ops = MEMFS.ops_table.file.node, i.stream_ops = MEMFS.ops_table.file.stream, i.usedBytes = 0, i.contents = null) : FS.isLink(i.mode) ? (i.node_ops = MEMFS.ops_table.link.node, i.stream_ops = MEMFS.ops_table.link.stream) : FS.isChrdev(i.mode) && (i.node_ops = MEMFS.ops_table.chrdev.node, i.stream_ops = MEMFS.ops_table.chrdev.stream), i.timestamp = Date.now(), e && (e.contents[r] = i), i
			},
			getFileDataAsRegularArray: function(e) {
				if(e.contents && e.contents.subarray) {
					for(var r = [], n = 0; n < e.usedBytes; ++n) r.push(e.contents[n]);
					return r
				}
				return e.contents
			},
			getFileDataAsTypedArray: function(e) {
				return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array
			},
			expandFileStorage: function(e, r) {
				if(e.contents && e.contents.subarray && r > e.contents.length && (e.contents = MEMFS.getFileDataAsRegularArray(e), e.usedBytes = e.contents.length), !e.contents || e.contents.subarray) {
					var n = e.contents ? e.contents.buffer.byteLength : 0;
					if(n >= r) return;
					var t = 1048576;
					r = Math.max(r, n * (n < t ? 2 : 1.125) | 0), 0 != n && (r = Math.max(r, 256));
					var i = e.contents;
					return e.contents = new Uint8Array(r), void(e.usedBytes > 0 && e.contents.set(i.subarray(0, e.usedBytes), 0))
				}
				for(!e.contents && r > 0 && (e.contents = []); e.contents.length < r;) e.contents.push(0)
			},
			resizeFileStorage: function(e, r) {
				if(e.usedBytes != r) {
					if(0 == r) return e.contents = null, void(e.usedBytes = 0);
					if(!e.contents || e.contents.subarray) {
						var n = e.contents;
						return e.contents = new Uint8Array(new ArrayBuffer(r)), n && e.contents.set(n.subarray(0, Math.min(r, e.usedBytes))), void(e.usedBytes = r)
					}
					if(e.contents || (e.contents = []), e.contents.length > r) e.contents.length = r;
					else
						for(; e.contents.length < r;) e.contents.push(0);
					e.usedBytes = r
				}
			},
			node_ops: {
				getattr: function(e) {
					var r = {};
					return r.dev = FS.isChrdev(e.mode) ? e.id : 1, r.ino = e.id, r.mode = e.mode, r.nlink = 1, r.uid = 0, r.gid = 0, r.rdev = e.rdev, FS.isDir(e.mode) ? r.size = 4096 : FS.isFile(e.mode) ? r.size = e.usedBytes : FS.isLink(e.mode) ? r.size = e.link.length : r.size = 0, r.atime = new Date(e.timestamp), r.mtime = new Date(e.timestamp), r.ctime = new Date(e.timestamp), r.blksize = 4096, r.blocks = Math.ceil(r.size / r.blksize), r
				},
				setattr: function(e, r) {
					void 0 !== r.mode && (e.mode = r.mode), void 0 !== r.timestamp && (e.timestamp = r.timestamp), void 0 !== r.size && MEMFS.resizeFileStorage(e, r.size)
				},
				lookup: function(e, r) {
					throw FS.genericErrors[ERRNO_CODES.ENOENT]
				},
				mknod: function(e, r, n, t) {
					return MEMFS.createNode(e, r, n, t)
				},
				rename: function(e, r, n) {
					if(FS.isDir(e.mode)) {
						var t;
						try {
							t = FS.lookupNode(r, n)
						} catch(i) {}
						if(t)
							for(var o in t.contents) throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
					}
					delete e.parent.contents[e.name], e.name = n, r.contents[n] = e, e.parent = r
				},
				unlink: function(e, r) {
					delete e.contents[r]
				},
				rmdir: function(e, r) {
					var n = FS.lookupNode(e, r);
					for(var t in n.contents) throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
					delete e.contents[r]
				},
				readdir: function(e) {
					var r = [".", ".."];
					for(var n in e.contents) e.contents.hasOwnProperty(n) && r.push(n);
					return r
				},
				symlink: function(e, r, n) {
					var t = MEMFS.createNode(e, r, 41471, 0);
					return t.link = n, t
				},
				readlink: function(e) {
					if(!FS.isLink(e.mode)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
					return e.link
				}
			},
			stream_ops: {
				read: function(e, r, n, t, i) {
					var o = e.node.contents;
					if(i >= e.node.usedBytes) return 0;
					var a = Math.min(e.node.usedBytes - i, t);
					if(assert(a >= 0), a > 8 && o.subarray) r.set(o.subarray(i, i + a), n);
					else
						for(var s = 0; s < a; s++) r[n + s] = o[i + s];
					return a
				},
				write: function(e, r, n, t, i, o) {
					if(!t) return 0;
					var a = e.node;
					if(a.timestamp = Date.now(), r.subarray && (!a.contents || a.contents.subarray)) {
						if(o) return a.contents = r.subarray(n, n + t), a.usedBytes = t, t;
						if(0 === a.usedBytes && 0 === i) return a.contents = new Uint8Array(r.subarray(n, n + t)), a.usedBytes = t, t;
						if(i + t <= a.usedBytes) return a.contents.set(r.subarray(n, n + t), i), t
					}
					if(MEMFS.expandFileStorage(a, i + t), a.contents.subarray && r.subarray) a.contents.set(r.subarray(n, n + t), i);
					else
						for(var s = 0; s < t; s++) a.contents[i + s] = r[n + s];
					return a.usedBytes = Math.max(a.usedBytes, i + t), t
				},
				llseek: function(e, r, n) {
					var t = r;
					if(1 === n ? t += e.position : 2 === n && FS.isFile(e.node.mode) && (t += e.node.usedBytes), t < 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
					return t
				},
				allocate: function(e, r, n) {
					MEMFS.expandFileStorage(e.node, r + n), e.node.usedBytes = Math.max(e.node.usedBytes, r + n)
				},
				mmap: function(e, r, n, t, i, o, a) {
					if(!FS.isFile(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
					var s, l, f = e.node.contents;
					if(2 & a || f.buffer !== r && f.buffer !== r.buffer) {
						if((i > 0 || i + t < e.node.usedBytes) && (f = f.subarray ? f.subarray(i, i + t) : Array.prototype.slice.call(f, i, i + t)), l = !0, s = _malloc(t), !s) throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
						r.set(f, s)
					} else l = !1, s = f.byteOffset;
					return {
						ptr: s,
						allocated: l
					}
				},
				msync: function(e, r, n, t, i) {
					if(!FS.isFile(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
					if(2 & i) return 0;
					MEMFS.stream_ops.write(e, r, 0, t, n, !1);
					return 0
				}
			}
		},
		IDBFS = {
			dbs: {},
			indexedDB: function() {
				if("undefined" != typeof indexedDB) return indexedDB;
				var e = null;
				return "object" == typeof window && (e = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), assert(e, "IDBFS used, but indexedDB not supported"), e
			},
			DB_VERSION: 21,
			DB_STORE_NAME: "FILE_DATA",
			mount: function(e) {
				return MEMFS.mount.apply(null, arguments)
			},
			syncfs: function(e, r, n) {
				IDBFS.getLocalSet(e, function(t, i) {
					return t ? n(t) : void IDBFS.getRemoteSet(e, function(e, t) {
						if(e) return n(e);
						var o = r ? t : i,
							a = r ? i : t;
						IDBFS.reconcile(o, a, n)
					})
				})
			},
			getDB: function(e, r) {
				var n = IDBFS.dbs[e];
				if(n) return r(null, n);
				var t;
				try {
					t = IDBFS.indexedDB().open(e, IDBFS.DB_VERSION)
				} catch(i) {
					return r(i)
				}
				t.onupgradeneeded = function(e) {
					var r, n = e.target.result,
						t = e.target.transaction;
					r = n.objectStoreNames.contains(IDBFS.DB_STORE_NAME) ? t.objectStore(IDBFS.DB_STORE_NAME) : n.createObjectStore(IDBFS.DB_STORE_NAME), r.indexNames.contains("timestamp") || r.createIndex("timestamp", "timestamp", {
						unique: !1
					})
				}, t.onsuccess = function() {
					n = t.result, IDBFS.dbs[e] = n, r(null, n)
				}, t.onerror = function(e) {
					r(this.error), e.preventDefault()
				}
			},
			getLocalSet: function(e, r) {
				function n(e) {
					return "." !== e && ".." !== e
				}

				function t(e) {
					return function(r) {
						return PATH.join2(e, r)
					}
				}
				for(var i = {}, o = FS.readdir(e.mountpoint).filter(n).map(t(e.mountpoint)); o.length;) {
					var a, s = o.pop();
					try {
						a = FS.stat(s)
					} catch(l) {
						return r(l)
					}
					FS.isDir(a.mode) && o.push.apply(o, FS.readdir(s).filter(n).map(t(s))), i[s] = {
						timestamp: a.mtime
					}
				}
				return r(null, {
					type: "local",
					entries: i
				})
			},
			getRemoteSet: function(e, r) {
				var n = {};
				IDBFS.getDB(e.mountpoint, function(e, t) {
					if(e) return r(e);
					var i = t.transaction([IDBFS.DB_STORE_NAME], "readonly");
					i.onerror = function(e) {
						r(this.error), e.preventDefault()
					};
					var o = i.objectStore(IDBFS.DB_STORE_NAME),
						a = o.index("timestamp");
					a.openKeyCursor().onsuccess = function(e) {
						var i = e.target.result;
						return i ? (n[i.primaryKey] = {
							timestamp: i.key
						}, void i["continue"]()) : r(null, {
							type: "remote",
							db: t,
							entries: n
						})
					}
				})
			},
			loadLocalEntry: function(e, r) {
				var n, t;
				try {
					var i = FS.lookupPath(e);
					t = i.node, n = FS.stat(e)
				} catch(o) {
					return r(o)
				}
				return FS.isDir(n.mode) ? r(null, {
					timestamp: n.mtime,
					mode: n.mode
				}) : FS.isFile(n.mode) ? (t.contents = MEMFS.getFileDataAsTypedArray(t), r(null, {
					timestamp: n.mtime,
					mode: n.mode,
					contents: t.contents
				})) : r(new Error("node type not supported"))
			},
			storeLocalEntry: function(e, r, n) {
				try {
					if(FS.isDir(r.mode)) FS.mkdir(e, r.mode);
					else {
						if(!FS.isFile(r.mode)) return n(new Error("node type not supported"));
						FS.writeFile(e, r.contents, {
							encoding: "binary",
							canOwn: !0
						})
					}
					FS.chmod(e, r.mode), FS.utime(e, r.timestamp, r.timestamp)
				} catch(t) {
					return n(t)
				}
				n(null)
			},
			removeLocalEntry: function(e, r) {
				try {
					var n = (FS.lookupPath(e), FS.stat(e));
					FS.isDir(n.mode) ? FS.rmdir(e) : FS.isFile(n.mode) && FS.unlink(e)
				} catch(t) {
					return r(t)
				}
				r(null)
			},
			loadRemoteEntry: function(e, r, n) {
				var t = e.get(r);
				t.onsuccess = function(e) {
					n(null, e.target.result)
				}, t.onerror = function(e) {
					n(this.error), e.preventDefault()
				}
			},
			storeRemoteEntry: function(e, r, n, t) {
				var i = e.put(n, r);
				i.onsuccess = function() {
					t(null)
				}, i.onerror = function(e) {
					t(this.error), e.preventDefault()
				}
			},
			removeRemoteEntry: function(e, r, n) {
				var t = e["delete"](r);
				t.onsuccess = function() {
					n(null)
				}, t.onerror = function(e) {
					n(this.error), e.preventDefault()
				}
			},
			reconcile: function(e, r, n) {
				function t(e) {
					if(e) {
						if(!t.errored) return t.errored = !0, n(e)
					} else if(++s >= i) return n(null)
				}
				var i = 0,
					o = [];
				Object.keys(e.entries).forEach(function(n) {
					var t = e.entries[n],
						a = r.entries[n];
					(!a || t.timestamp > a.timestamp) && (o.push(n), i++)
				});
				var a = [];
				if(Object.keys(r.entries).forEach(function(n) {
						var t = (r.entries[n], e.entries[n]);
						t || (a.push(n), i++)
					}), !i) return n(null);
				var s = 0,
					l = "remote" === e.type ? e.db : r.db,
					f = l.transaction([IDBFS.DB_STORE_NAME], "readwrite"),
					u = f.objectStore(IDBFS.DB_STORE_NAME);
				f.onerror = function(e) {
					t(this.error), e.preventDefault()
				}, o.sort().forEach(function(e) {
					"local" === r.type ? IDBFS.loadRemoteEntry(u, e, function(r, n) {
						return r ? t(r) : void IDBFS.storeLocalEntry(e, n, t)
					}) : IDBFS.loadLocalEntry(e, function(r, n) {
						return r ? t(r) : void IDBFS.storeRemoteEntry(u, e, n, t)
					})
				}), a.sort().reverse().forEach(function(e) {
					"local" === r.type ? IDBFS.removeLocalEntry(e, t) : IDBFS.removeRemoteEntry(u, e, t)
				})
			}
		},
		NODEFS = {
			isWindows: !1,
			staticInit: function() {
				NODEFS.isWindows = !!process.platform.match(/^win/)
			},
			mount: function(e) {
				return assert(ENVIRONMENT_IS_NODE), NODEFS.createNode(null, "/", NODEFS.getMode(e.opts.root), 0)
			},
			createNode: function(e, r, n, t) {
				if(!FS.isDir(n) && !FS.isFile(n) && !FS.isLink(n)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
				var i = FS.createNode(e, r, n);
				return i.node_ops = NODEFS.node_ops, i.stream_ops = NODEFS.stream_ops, i
			},
			getMode: function(e) {
				var r;
				try {
					r = fs.lstatSync(e), NODEFS.isWindows && (r.mode = r.mode | (146 & r.mode) >> 1)
				} catch(n) {
					if(!n.code) throw n;
					throw new FS.ErrnoError(ERRNO_CODES[n.code])
				}
				return r.mode
			},
			realPath: function(e) {
				for(var r = []; e.parent !== e;) r.push(e.name), e = e.parent;
				return r.push(e.mount.opts.root), r.reverse(), PATH.join.apply(null, r)
			},
			flagsToPermissionStringMap: {
				0: "r",
				1: "r+",
				2: "r+",
				64: "r",
				65: "r+",
				66: "r+",
				129: "rx+",
				193: "rx+",
				514: "w+",
				577: "w",
				578: "w+",
				705: "wx",
				706: "wx+",
				1024: "a",
				1025: "a",
				1026: "a+",
				1089: "a",
				1090: "a+",
				1153: "ax",
				1154: "ax+",
				1217: "ax",
				1218: "ax+",
				4096: "rs",
				4098: "rs+"
			},
			flagsToPermissionString: function(e) {
				if(e &= -32769, e in NODEFS.flagsToPermissionStringMap) return NODEFS.flagsToPermissionStringMap[e];
				throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
			},
			node_ops: {
				getattr: function(e) {
					var r, n = NODEFS.realPath(e);
					try {
						r = fs.lstatSync(n)
					} catch(t) {
						if(!t.code) throw t;
						throw new FS.ErrnoError(ERRNO_CODES[t.code])
					}
					return NODEFS.isWindows && !r.blksize && (r.blksize = 4096), NODEFS.isWindows && !r.blocks && (r.blocks = (r.size + r.blksize - 1) / r.blksize | 0), {
						dev: r.dev,
						ino: r.ino,
						mode: r.mode,
						nlink: r.nlink,
						uid: r.uid,
						gid: r.gid,
						rdev: r.rdev,
						size: r.size,
						atime: r.atime,
						mtime: r.mtime,
						ctime: r.ctime,
						blksize: r.blksize,
						blocks: r.blocks
					}
				},
				setattr: function(e, r) {
					var n = NODEFS.realPath(e);
					try {
						if(void 0 !== r.mode && (fs.chmodSync(n, r.mode), e.mode = r.mode), void 0 !== r.timestamp) {
							var t = new Date(r.timestamp);
							fs.utimesSync(n, t, t)
						}
						void 0 !== r.size && fs.truncateSync(n, r.size)
					} catch(i) {
						if(!i.code) throw i;
						throw new FS.ErrnoError(ERRNO_CODES[i.code])
					}
				},
				lookup: function(e, r) {
					var n = PATH.join2(NODEFS.realPath(e), r),
						t = NODEFS.getMode(n);
					return NODEFS.createNode(e, r, t)
				},
				mknod: function(e, r, n, t) {
					var i = NODEFS.createNode(e, r, n, t),
						o = NODEFS.realPath(i);
					try {
						FS.isDir(i.mode) ? fs.mkdirSync(o, i.mode) : fs.writeFileSync(o, "", {
							mode: i.mode
						})
					} catch(a) {
						if(!a.code) throw a;
						throw new FS.ErrnoError(ERRNO_CODES[a.code])
					}
					return i
				},
				rename: function(e, r, n) {
					var t = NODEFS.realPath(e),
						i = PATH.join2(NODEFS.realPath(r), n);
					try {
						fs.renameSync(t, i)
					} catch(o) {
						if(!o.code) throw o;
						throw new FS.ErrnoError(ERRNO_CODES[o.code])
					}
				},
				unlink: function(e, r) {
					var n = PATH.join2(NODEFS.realPath(e), r);
					try {
						fs.unlinkSync(n)
					} catch(t) {
						if(!t.code) throw t;
						throw new FS.ErrnoError(ERRNO_CODES[t.code])
					}
				},
				rmdir: function(e, r) {
					var n = PATH.join2(NODEFS.realPath(e), r);
					try {
						fs.rmdirSync(n)
					} catch(t) {
						if(!t.code) throw t;
						throw new FS.ErrnoError(ERRNO_CODES[t.code])
					}
				},
				readdir: function(e) {
					var r = NODEFS.realPath(e);
					try {
						return fs.readdirSync(r)
					} catch(n) {
						if(!n.code) throw n;
						throw new FS.ErrnoError(ERRNO_CODES[n.code])
					}
				},
				symlink: function(e, r, n) {
					var t = PATH.join2(NODEFS.realPath(e), r);
					try {
						fs.symlinkSync(n, t)
					} catch(i) {
						if(!i.code) throw i;
						throw new FS.ErrnoError(ERRNO_CODES[i.code])
					}
				},
				readlink: function(e) {
					var r = NODEFS.realPath(e);
					try {
						return r = fs.readlinkSync(r), r = NODEJS_PATH.relative(NODEJS_PATH.resolve(e.mount.opts.root), r)
					} catch(n) {
						if(!n.code) throw n;
						throw new FS.ErrnoError(ERRNO_CODES[n.code])
					}
				}
			},
			stream_ops: {
				open: function(e) {
					var r = NODEFS.realPath(e.node);
					try {
						FS.isFile(e.node.mode) && (e.nfd = fs.openSync(r, NODEFS.flagsToPermissionString(e.flags)))
					} catch(n) {
						if(!n.code) throw n;
						throw new FS.ErrnoError(ERRNO_CODES[n.code])
					}
				},
				close: function(e) {
					try {
						FS.isFile(e.node.mode) && e.nfd && fs.closeSync(e.nfd)
					} catch(r) {
						if(!r.code) throw r;
						throw new FS.ErrnoError(ERRNO_CODES[r.code])
					}
				},
				read: function(e, r, n, t, i) {
					if(0 === t) return 0;
					var o, a = new Buffer(t);
					try {
						o = fs.readSync(e.nfd, a, 0, t, i)
					} catch(s) {
						throw new FS.ErrnoError(ERRNO_CODES[s.code])
					}
					if(o > 0)
						for(var l = 0; l < o; l++) r[n + l] = a[l];
					return o
				},
				write: function(e, r, n, t, i) {
					var o, a = new Buffer(r.subarray(n, n + t));
					try {
						o = fs.writeSync(e.nfd, a, 0, t, i)
					} catch(s) {
						throw new FS.ErrnoError(ERRNO_CODES[s.code])
					}
					return o
				},
				llseek: function(e, r, n) {
					var t = r;
					if(1 === n) t += e.position;
					else if(2 === n && FS.isFile(e.node.mode)) try {
						var i = fs.fstatSync(e.nfd);
						t += i.size
					} catch(o) {
						throw new FS.ErrnoError(ERRNO_CODES[o.code])
					}
					if(t < 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
					return t
				}
			}
		},
		WORKERFS = {
			DIR_MODE: 16895,
			FILE_MODE: 33279,
			reader: null,
			mount: function(e) {
				function r(e) {
					for(var r = e.split("/"), n = t, o = 0; o < r.length - 1; o++) {
						var a = r.slice(0, o + 1).join("/");
						i[a] || (i[a] = WORKERFS.createNode(n, a, WORKERFS.DIR_MODE, 0)), n = i[a]
					}
					return n
				}

				function n(e) {
					var r = e.split("/");
					return r[r.length - 1]
				}
				assert(ENVIRONMENT_IS_WORKER), WORKERFS.reader || (WORKERFS.reader = new FileReaderSync);
				var t = WORKERFS.createNode(null, "/", WORKERFS.DIR_MODE, 0),
					i = {};
				return Array.prototype.forEach.call(e.opts.files || [], function(e) {
					WORKERFS.createNode(r(e.name), n(e.name), WORKERFS.FILE_MODE, 0, e, e.lastModifiedDate)
				}), (e.opts.blobs || []).forEach(function(e) {
					WORKERFS.createNode(r(e.name), n(e.name), WORKERFS.FILE_MODE, 0, e.data)
				}), (e.opts.packages || []).forEach(function(e) {
					e.metadata.files.forEach(function(t) {
						var i = t.filename.substr(1);
						WORKERFS.createNode(r(i), n(i), WORKERFS.FILE_MODE, 0, e.blob.slice(t.start, t.end))
					})
				}), t
			},
			createNode: function(e, r, n, t, i, o) {
				var a = FS.createNode(e, r, n);
				return a.mode = n, a.node_ops = WORKERFS.node_ops, a.stream_ops = WORKERFS.stream_ops, a.timestamp = (o || new Date).getTime(), assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE), n === WORKERFS.FILE_MODE ? (a.size = i.size, a.contents = i) : (a.size = 4096, a.contents = {}), e && (e.contents[r] = a), a
			},
			node_ops: {
				getattr: function(e) {
					return {
						dev: 1,
						ino: void 0,
						mode: e.mode,
						nlink: 1,
						uid: 0,
						gid: 0,
						rdev: void 0,
						size: e.size,
						atime: new Date(e.timestamp),
						mtime: new Date(e.timestamp),
						ctime: new Date(e.timestamp),
						blksize: 4096,
						blocks: Math.ceil(e.size / 4096)
					}
				},
				setattr: function(e, r) {
					void 0 !== r.mode && (e.mode = r.mode), void 0 !== r.timestamp && (e.timestamp = r.timestamp)
				},
				lookup: function(e, r) {
					throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
				},
				mknod: function(e, r, n, t) {
					throw new FS.ErrnoError(ERRNO_CODES.EPERM)
				},
				rename: function(e, r, n) {
					throw new FS.ErrnoError(ERRNO_CODES.EPERM)
				},
				unlink: function(e, r) {
					throw new FS.ErrnoError(ERRNO_CODES.EPERM)
				},
				rmdir: function(e, r) {
					throw new FS.ErrnoError(ERRNO_CODES.EPERM)
				},
				readdir: function(e) {
					throw new FS.ErrnoError(ERRNO_CODES.EPERM)
				},
				symlink: function(e, r, n) {
					throw new FS.ErrnoError(ERRNO_CODES.EPERM)
				},
				readlink: function(e) {
					throw new FS.ErrnoError(ERRNO_CODES.EPERM)
				}
			},
			stream_ops: {
				read: function(e, r, n, t, i) {
					if(i >= e.node.size) return 0;
					var o = e.node.contents.slice(i, i + t),
						a = WORKERFS.reader.readAsArrayBuffer(o);
					return r.set(new Uint8Array(a), n), o.size
				},
				write: function(e, r, n, t, i) {
					throw new FS.ErrnoError(ERRNO_CODES.EIO)
				},
				llseek: function(e, r, n) {
					var t = r;
					if(1 === n ? t += e.position : 2 === n && FS.isFile(e.node.mode) && (t += e.node.size), t < 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
					return t
				}
			}
		},
		_stdin = allocate(1, "i32*", ALLOC_STATIC),
		_stdout = allocate(1, "i32*", ALLOC_STATIC),
		_stderr = allocate(1, "i32*", ALLOC_STATIC),
		FS = {
			root: null,
			mounts: [],
			devices: [null],
			streams: [],
			nextInode: 1,
			nameTable: null,
			currentPath: "/",
			initialized: !1,
			ignorePermissions: !0,
			trackingDelegate: {},
			tracking: {
				openFlags: {
					READ: 1,
					WRITE: 2
				}
			},
			ErrnoError: null,
			genericErrors: {},
			filesystems: null,
			handleFSError: function(e) {
				if(!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
				return ___setErrNo(e.errno)
			},
			lookupPath: function(e, r) {
				if(e = PATH.resolve(FS.cwd(), e), r = r || {}, !e) return {
					path: "",
					node: null
				};
				var n = {
					follow_mount: !0,
					recurse_count: 0
				};
				for(var t in n) void 0 === r[t] && (r[t] = n[t]);
				if(r.recurse_count > 8) throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
				for(var i = PATH.normalizeArray(e.split("/").filter(function(e) {
						return !!e
					}), !1), o = FS.root, a = "/", s = 0; s < i.length; s++) {
					var l = s === i.length - 1;
					if(l && r.parent) break;
					if(o = FS.lookupNode(o, i[s]), a = PATH.join2(a, i[s]), FS.isMountpoint(o) && (!l || l && r.follow_mount) && (o = o.mounted.root), !l || r.follow)
						for(var f = 0; FS.isLink(o.mode);) {
							var u = FS.readlink(a);
							a = PATH.resolve(PATH.dirname(a), u);
							var c = FS.lookupPath(a, {
								recurse_count: r.recurse_count
							});
							if(o = c.node, f++ > 40) throw new FS.ErrnoError(ERRNO_CODES.ELOOP)
						}
				}
				return {
					path: a,
					node: o
				}
			},
			getPath: function(e) {
				for(var r;;) {
					if(FS.isRoot(e)) {
						var n = e.mount.mountpoint;
						return r ? "/" !== n[n.length - 1] ? n + "/" + r : n + r : n
					}
					r = r ? e.name + "/" + r : e.name, e = e.parent
				}
			},
			hashName: function(e, r) {
				for(var n = 0, t = 0; t < r.length; t++) n = (n << 5) - n + r.charCodeAt(t) | 0;
				return(e + n >>> 0) % FS.nameTable.length
			},
			hashAddNode: function(e) {
				var r = FS.hashName(e.parent.id, e.name);
				e.name_next = FS.nameTable[r], FS.nameTable[r] = e
			},
			hashRemoveNode: function(e) {
				var r = FS.hashName(e.parent.id, e.name);
				if(FS.nameTable[r] === e) FS.nameTable[r] = e.name_next;
				else
					for(var n = FS.nameTable[r]; n;) {
						if(n.name_next === e) {
							n.name_next = e.name_next;
							break
						}
						n = n.name_next
					}
			},
			lookupNode: function(e, r) {
				var n = FS.mayLookup(e);
				if(n) throw new FS.ErrnoError(n, e);
				for(var t = FS.hashName(e.id, r), i = FS.nameTable[t]; i; i = i.name_next) {
					var o = i.name;
					if(i.parent.id === e.id && o === r) return i
				}
				return FS.lookup(e, r)
			},
			createNode: function(e, r, n, t) {
				if(!FS.FSNode) {
					FS.FSNode = function(e, r, n, t) {
						e || (e = this), this.parent = e, this.mount = e.mount, this.mounted = null, this.id = FS.nextInode++, this.name = r, this.mode = n, this.node_ops = {}, this.stream_ops = {}, this.rdev = t
					}, FS.FSNode.prototype = {};
					var i = 365,
						o = 146;
					Object.defineProperties(FS.FSNode.prototype, {
						read: {
							get: function() {
								return(this.mode & i) === i
							},
							set: function(e) {
								e ? this.mode |= i : this.mode &= ~i
							}
						},
						write: {
							get: function() {
								return(this.mode & o) === o
							},
							set: function(e) {
								e ? this.mode |= o : this.mode &= ~o
							}
						},
						isFolder: {
							get: function() {
								return FS.isDir(this.mode)
							}
						},
						isDevice: {
							get: function() {
								return FS.isChrdev(this.mode)
							}
						}
					})
				}
				var a = new FS.FSNode(e, r, n, t);
				return FS.hashAddNode(a), a
			},
			destroyNode: function(e) {
				FS.hashRemoveNode(e)
			},
			isRoot: function(e) {
				return e === e.parent
			},
			isMountpoint: function(e) {
				return !!e.mounted
			},
			isFile: function(e) {
				return 32768 === (61440 & e)
			},
			isDir: function(e) {
				return 16384 === (61440 & e)
			},
			isLink: function(e) {
				return 40960 === (61440 & e)
			},
			isChrdev: function(e) {
				return 8192 === (61440 & e)
			},
			isBlkdev: function(e) {
				return 24576 === (61440 & e)
			},
			isFIFO: function(e) {
				return 4096 === (61440 & e)
			},
			isSocket: function(e) {
				return 49152 === (49152 & e)
			},
			flagModes: {
				r: 0,
				rs: 1052672,
				"r+": 2,
				w: 577,
				wx: 705,
				xw: 705,
				"w+": 578,
				"wx+": 706,
				"xw+": 706,
				a: 1089,
				ax: 1217,
				xa: 1217,
				"a+": 1090,
				"ax+": 1218,
				"xa+": 1218
			},
			modeStringToFlags: function(e) {
				var r = FS.flagModes[e];
				if("undefined" == typeof r) throw new Error("Unknown file open mode: " + e);
				return r
			},
			flagsToPermissionString: function(e) {
				var r = ["r", "w", "rw"][3 & e];
				return 512 & e && (r += "w"), r
			},
			nodePermissions: function(e, r) {
				return FS.ignorePermissions ? 0 : (r.indexOf("r") === -1 || 292 & e.mode) && (r.indexOf("w") === -1 || 146 & e.mode) && (r.indexOf("x") === -1 || 73 & e.mode) ? 0 : ERRNO_CODES.EACCES
			},
			mayLookup: function(e) {
				var r = FS.nodePermissions(e, "x");
				return r ? r : e.node_ops.lookup ? 0 : ERRNO_CODES.EACCES
			},
			mayCreate: function(e, r) {
				try {
					FS.lookupNode(e, r);
					return ERRNO_CODES.EEXIST
				} catch(n) {}
				return FS.nodePermissions(e, "wx")
			},
			mayDelete: function(e, r, n) {
				var t;
				try {
					t = FS.lookupNode(e, r)
				} catch(i) {
					return i.errno
				}
				var o = FS.nodePermissions(e, "wx");
				if(o) return o;
				if(n) {
					if(!FS.isDir(t.mode)) return ERRNO_CODES.ENOTDIR;
					if(FS.isRoot(t) || FS.getPath(t) === FS.cwd()) return ERRNO_CODES.EBUSY
				} else if(FS.isDir(t.mode)) return ERRNO_CODES.EISDIR;
				return 0
			},
			mayOpen: function(e, r) {
				return e ? FS.isLink(e.mode) ? ERRNO_CODES.ELOOP : FS.isDir(e.mode) && (0 !== (2097155 & r) || 512 & r) ? ERRNO_CODES.EISDIR : FS.nodePermissions(e, FS.flagsToPermissionString(r)) : ERRNO_CODES.ENOENT
			},
			MAX_OPEN_FDS: 4096,
			nextfd: function(e, r) {
				e = e || 0, r = r || FS.MAX_OPEN_FDS;
				for(var n = e; n <= r; n++)
					if(!FS.streams[n]) return n;
				throw new FS.ErrnoError(ERRNO_CODES.EMFILE)
			},
			getStream: function(e) {
				return FS.streams[e]
			},
			createStream: function(e, r, n) {
				FS.FSStream || (FS.FSStream = function() {}, FS.FSStream.prototype = {}, Object.defineProperties(FS.FSStream.prototype, {
					object: {
						get: function() {
							return this.node
						},
						set: function(e) {
							this.node = e
						}
					},
					isRead: {
						get: function() {
							return 1 !== (2097155 & this.flags)
						}
					},
					isWrite: {
						get: function() {
							return 0 !== (2097155 & this.flags)
						}
					},
					isAppend: {
						get: function() {
							return 1024 & this.flags
						}
					}
				}));
				var t = new FS.FSStream;
				for(var i in e) t[i] = e[i];
				e = t;
				var o = FS.nextfd(r, n);
				return e.fd = o, FS.streams[o] = e, e
			},
			closeStream: function(e) {
				FS.streams[e] = null
			},
			chrdev_stream_ops: {
				open: function(e) {
					var r = FS.getDevice(e.node.rdev);
					e.stream_ops = r.stream_ops, e.stream_ops.open && e.stream_ops.open(e)
				},
				llseek: function() {
					throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
				}
			},
			major: function(e) {
				return e >> 8
			},
			minor: function(e) {
				return 255 & e
			},
			makedev: function(e, r) {
				return e << 8 | r
			},
			registerDevice: function(e, r) {
				FS.devices[e] = {
					stream_ops: r
				}
			},
			getDevice: function(e) {
				return FS.devices[e]
			},
			getMounts: function(e) {
				for(var r = [], n = [e]; n.length;) {
					var t = n.pop();
					r.push(t), n.push.apply(n, t.mounts)
				}
				return r
			},
			syncfs: function(e, r) {
				function n(e) {
					if(e) {
						if(!n.errored) return n.errored = !0, r(e)
					} else ++i >= t.length && r(null)
				}
				"function" == typeof e && (r = e, e = !1);
				var t = FS.getMounts(FS.root.mount),
					i = 0;
				t.forEach(function(r) {
					return r.type.syncfs ? void r.type.syncfs(r, e, n) : n(null)
				})
			},
			mount: function(e, r, n) {
				var t, i = "/" === n,
					o = !n;
				if(i && FS.root) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
				if(!i && !o) {
					var a = FS.lookupPath(n, {
						follow_mount: !1
					});
					if(n = a.path, t = a.node, FS.isMountpoint(t)) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
					if(!FS.isDir(t.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
				}
				var s = {
						type: e,
						opts: r,
						mountpoint: n,
						mounts: []
					},
					l = e.mount(s);
				return l.mount = s, s.root = l, i ? FS.root = l : t && (t.mounted = s, t.mount && t.mount.mounts.push(s)), l
			},
			unmount: function(e) {
				var r = FS.lookupPath(e, {
					follow_mount: !1
				});
				if(!FS.isMountpoint(r.node)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
				var n = r.node,
					t = n.mounted,
					i = FS.getMounts(t);
				Object.keys(FS.nameTable).forEach(function(e) {
					for(var r = FS.nameTable[e]; r;) {
						var n = r.name_next;
						i.indexOf(r.mount) !== -1 && FS.destroyNode(r), r = n
					}
				}), n.mounted = null;
				var o = n.mount.mounts.indexOf(t);
				assert(o !== -1), n.mount.mounts.splice(o, 1)
			},
			lookup: function(e, r) {
				return e.node_ops.lookup(e, r)
			},
			mknod: function(e, r, n) {
				var t = FS.lookupPath(e, {
						parent: !0
					}),
					i = t.node,
					o = PATH.basename(e);
				if(!o || "." === o || ".." === o) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
				var a = FS.mayCreate(i, o);
				if(a) throw new FS.ErrnoError(a);
				if(!i.node_ops.mknod) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
				return i.node_ops.mknod(i, o, r, n)
			},
			create: function(e, r) {
				return r = void 0 !== r ? r : 438, r &= 4095, r |= 32768, FS.mknod(e, r, 0)
			},
			mkdir: function(e, r) {
				return r = void 0 !== r ? r : 511, r &= 1023, r |= 16384, FS.mknod(e, r, 0)
			},
			mkdev: function(e, r, n) {
				return "undefined" == typeof n && (n = r, r = 438), r |= 8192, FS.mknod(e, r, n)
			},
			symlink: function(e, r) {
				if(!PATH.resolve(e)) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
				var n = FS.lookupPath(r, {
						parent: !0
					}),
					t = n.node;
				if(!t) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
				var i = PATH.basename(r),
					o = FS.mayCreate(t, i);
				if(o) throw new FS.ErrnoError(o);
				if(!t.node_ops.symlink) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
				return t.node_ops.symlink(t, i, e)
			},
			rename: function(e, r) {
				var n, t, i, o = PATH.dirname(e),
					a = PATH.dirname(r),
					s = PATH.basename(e),
					l = PATH.basename(r);
				try {
					n = FS.lookupPath(e, {
						parent: !0
					}), t = n.node, n = FS.lookupPath(r, {
						parent: !0
					}), i = n.node
				} catch(f) {
					throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
				}
				if(!t || !i) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
				if(t.mount !== i.mount) throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
				var u = FS.lookupNode(t, s),
					c = PATH.relative(e, a);
				if("." !== c.charAt(0)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
				if(c = PATH.relative(r, o), "." !== c.charAt(0)) throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
				var d;
				try {
					d = FS.lookupNode(i, l)
				} catch(f) {}
				if(u !== d) {
					var h = FS.isDir(u.mode),
						E = FS.mayDelete(t, s, h);
					if(E) throw new FS.ErrnoError(E);
					if(E = d ? FS.mayDelete(i, l, h) : FS.mayCreate(i, l)) throw new FS.ErrnoError(E);
					if(!t.node_ops.rename) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
					if(FS.isMountpoint(u) || d && FS.isMountpoint(d)) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
					if(i !== t && (E = FS.nodePermissions(t, "w"))) throw new FS.ErrnoError(E);
					try {
						FS.trackingDelegate.willMovePath && FS.trackingDelegate.willMovePath(e, r)
					} catch(f) {
						console.log("FS.trackingDelegate['willMovePath']('" + e + "', '" + r + "') threw an exception: " + f.message)
					}
					FS.hashRemoveNode(u);
					try {
						t.node_ops.rename(u, i, l)
					} catch(f) {
						throw f
					} finally {
						FS.hashAddNode(u)
					}
					try {
						FS.trackingDelegate.onMovePath && FS.trackingDelegate.onMovePath(e, r)
					} catch(f) {
						console.log("FS.trackingDelegate['onMovePath']('" + e + "', '" + r + "') threw an exception: " + f.message)
					}
				}
			},
			rmdir: function(e) {
				var r = FS.lookupPath(e, {
						parent: !0
					}),
					n = r.node,
					t = PATH.basename(e),
					i = FS.lookupNode(n, t),
					o = FS.mayDelete(n, t, !0);
				if(o) throw new FS.ErrnoError(o);
				if(!n.node_ops.rmdir) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
				if(FS.isMountpoint(i)) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
				try {
					FS.trackingDelegate.willDeletePath && FS.trackingDelegate.willDeletePath(e)
				} catch(a) {
					console.log("FS.trackingDelegate['willDeletePath']('" + e + "') threw an exception: " + a.message)
				}
				n.node_ops.rmdir(n, t), FS.destroyNode(i);
				try {
					FS.trackingDelegate.onDeletePath && FS.trackingDelegate.onDeletePath(e)
				} catch(a) {
					console.log("FS.trackingDelegate['onDeletePath']('" + e + "') threw an exception: " + a.message)
				}
			},
			readdir: function(e) {
				var r = FS.lookupPath(e, {
						follow: !0
					}),
					n = r.node;
				if(!n.node_ops.readdir) throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
				return n.node_ops.readdir(n)
			},
			unlink: function(e) {
				var r = FS.lookupPath(e, {
						parent: !0
					}),
					n = r.node,
					t = PATH.basename(e),
					i = FS.lookupNode(n, t),
					o = FS.mayDelete(n, t, !1);
				if(o) throw o === ERRNO_CODES.EISDIR && (o = ERRNO_CODES.EPERM), new FS.ErrnoError(o);
				if(!n.node_ops.unlink) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
				if(FS.isMountpoint(i)) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
				try {
					FS.trackingDelegate.willDeletePath && FS.trackingDelegate.willDeletePath(e)
				} catch(a) {
					console.log("FS.trackingDelegate['willDeletePath']('" + e + "') threw an exception: " + a.message)
				}
				n.node_ops.unlink(n, t), FS.destroyNode(i);
				try {
					FS.trackingDelegate.onDeletePath && FS.trackingDelegate.onDeletePath(e)
				} catch(a) {
					console.log("FS.trackingDelegate['onDeletePath']('" + e + "') threw an exception: " + a.message)
				}
			},
			readlink: function(e) {
				var r = FS.lookupPath(e),
					n = r.node;
				if(!n) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
				if(!n.node_ops.readlink) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
				return PATH.resolve(FS.getPath(n.parent), n.node_ops.readlink(n))
			},
			stat: function(e, r) {
				var n = FS.lookupPath(e, {
						follow: !r
					}),
					t = n.node;
				if(!t) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
				if(!t.node_ops.getattr) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
				return t.node_ops.getattr(t)
			},
			lstat: function(e) {
				return FS.stat(e, !0)
			},
			chmod: function(e, r, n) {
				var t;
				if("string" == typeof e) {
					var i = FS.lookupPath(e, {
						follow: !n
					});
					t = i.node
				} else t = e;
				if(!t.node_ops.setattr) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
				t.node_ops.setattr(t, {
					mode: 4095 & r | t.mode & -4096,
					timestamp: Date.now()
				})
			},
			lchmod: function(e, r) {
				FS.chmod(e, r, !0)
			},
			fchmod: function(e, r) {
				var n = FS.getStream(e);
				if(!n) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
				FS.chmod(n.node, r)
			},
			chown: function(e, r, n, t) {
				var i;
				if("string" == typeof e) {
					var o = FS.lookupPath(e, {
						follow: !t
					});
					i = o.node
				} else i = e;
				if(!i.node_ops.setattr) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
				i.node_ops.setattr(i, {
					timestamp: Date.now()
				})
			},
			lchown: function(e, r, n) {
				FS.chown(e, r, n, !0)
			},
			fchown: function(e, r, n) {
				var t = FS.getStream(e);
				if(!t) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
				FS.chown(t.node, r, n)
			},
			truncate: function(e, r) {
				if(r < 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
				var n;
				if("string" == typeof e) {
					var t = FS.lookupPath(e, {
						follow: !0
					});
					n = t.node
				} else n = e;
				if(!n.node_ops.setattr) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
				if(FS.isDir(n.mode)) throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
				if(!FS.isFile(n.mode)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
				var i = FS.nodePermissions(n, "w");
				if(i) throw new FS.ErrnoError(i);
				n.node_ops.setattr(n, {
					size: r,
					timestamp: Date.now()
				})
			},
			ftruncate: function(e, r) {
				var n = FS.getStream(e);
				if(!n) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
				if(0 === (2097155 & n.flags)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
				FS.truncate(n.node, r)
			},
			utime: function(e, r, n) {
				var t = FS.lookupPath(e, {
						follow: !0
					}),
					i = t.node;
				i.node_ops.setattr(i, {
					timestamp: Math.max(r, n)
				})
			},
			open: function(e, r, n, t, i) {
				if("" === e) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
				r = "string" == typeof r ? FS.modeStringToFlags(r) : r, n = "undefined" == typeof n ? 438 : n, n = 64 & r ? 4095 & n | 32768 : 0;
				var o;
				if("object" == typeof e) o = e;
				else {
					e = PATH.normalize(e);
					try {
						var a = FS.lookupPath(e, {
							follow: !(131072 & r)
						});
						o = a.node
					} catch(s) {}
				}
				var l = !1;
				if(64 & r)
					if(o) {
						if(128 & r) throw new FS.ErrnoError(ERRNO_CODES.EEXIST)
					} else o = FS.mknod(e, n, 0), l = !0;
				if(!o) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
				if(FS.isChrdev(o.mode) && (r &= -513), 65536 & r && !FS.isDir(o.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
				if(!l) {
					var f = FS.mayOpen(o, r);
					if(f) throw new FS.ErrnoError(f)
				}
				512 & r && FS.truncate(o, 0), r &= -641;
				var u = FS.createStream({
					node: o,
					path: FS.getPath(o),
					flags: r,
					seekable: !0,
					position: 0,
					stream_ops: o.stream_ops,
					ungotten: [],
					error: !1
				}, t, i);
				u.stream_ops.open && u.stream_ops.open(u), !Module.logReadFiles || 1 & r || (FS.readFiles || (FS.readFiles = {}), e in FS.readFiles || (FS.readFiles[e] = 1, Module.printErr("read file: " + e)));
				try {
					if(FS.trackingDelegate.onOpenFile) {
						var c = 0;
						1 !== (2097155 & r) && (c |= FS.tracking.openFlags.READ), 0 !== (2097155 & r) && (c |= FS.tracking.openFlags.WRITE), FS.trackingDelegate.onOpenFile(e, c)
					}
				} catch(s) {
					console.log("FS.trackingDelegate['onOpenFile']('" + e + "', flags) threw an exception: " + s.message)
				}
				return u
			},
			close: function(e) {
				e.getdents && (e.getdents = null);
				try {
					e.stream_ops.close && e.stream_ops.close(e)
				} catch(r) {
					throw r
				} finally {
					FS.closeStream(e.fd)
				}
			},
			llseek: function(e, r, n) {
				if(!e.seekable || !e.stream_ops.llseek) throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
				return e.position = e.stream_ops.llseek(e, r, n), e.ungotten = [], e.position
			},
			read: function(e, r, n, t, i) {
				if(t < 0 || i < 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
				if(1 === (2097155 & e.flags)) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
				if(FS.isDir(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
				if(!e.stream_ops.read) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
				var o = !0;
				if("undefined" == typeof i) i = e.position, o = !1;
				else if(!e.seekable) throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
				var a = e.stream_ops.read(e, r, n, t, i);
				return o || (e.position += a), a
			},
			write: function(e, r, n, t, i, o) {
				if(t < 0 || i < 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
				if(0 === (2097155 & e.flags)) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
				if(FS.isDir(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
				if(!e.stream_ops.write) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
				1024 & e.flags && FS.llseek(e, 0, 2);
				var a = !0;
				if("undefined" == typeof i) i = e.position, a = !1;
				else if(!e.seekable) throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
				var s = e.stream_ops.write(e, r, n, t, i, o);
				a || (e.position += s);
				try {
					e.path && FS.trackingDelegate.onWriteToFile && FS.trackingDelegate.onWriteToFile(e.path)
				} catch(l) {
					console.log("FS.trackingDelegate['onWriteToFile']('" + path + "') threw an exception: " + l.message)
				}
				return s
			},
			allocate: function(e, r, n) {
				if(r < 0 || n <= 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
				if(0 === (2097155 & e.flags)) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
				if(!FS.isFile(e.node.mode) && !FS.isDir(node.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
				if(!e.stream_ops.allocate) throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
				e.stream_ops.allocate(e, r, n)
			},
			mmap: function(e, r, n, t, i, o, a) {
				if(1 === (2097155 & e.flags)) throw new FS.ErrnoError(ERRNO_CODES.EACCES);
				if(!e.stream_ops.mmap) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
				return e.stream_ops.mmap(e, r, n, t, i, o, a)
			},
			msync: function(e, r, n, t, i) {
				return e && e.stream_ops.msync ? e.stream_ops.msync(e, r, n, t, i) : 0
			},
			munmap: function(e) {
				return 0
			},
			ioctl: function(e, r, n) {
				if(!e.stream_ops.ioctl) throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
				return e.stream_ops.ioctl(e, r, n)
			},
			readFile: function(e, r) {
				if(r = r || {}, r.flags = r.flags || "r", r.encoding = r.encoding || "binary", "utf8" !== r.encoding && "binary" !== r.encoding) throw new Error('Invalid encoding type "' + r.encoding + '"');
				var n, t = FS.open(e, r.flags),
					i = FS.stat(e),
					o = i.size,
					a = new Uint8Array(o);
				return FS.read(t, a, 0, o, 0), "utf8" === r.encoding ? n = UTF8ArrayToString(a, 0) : "binary" === r.encoding && (n = a), FS.close(t), n
			},
			writeFile: function(e, r, n) {
				if(n = n || {}, n.flags = n.flags || "w", n.encoding = n.encoding || "utf8", "utf8" !== n.encoding && "binary" !== n.encoding) throw new Error('Invalid encoding type "' + n.encoding + '"');
				var t = FS.open(e, n.flags, n.mode);
				if("utf8" === n.encoding) {
					var i = new Uint8Array(lengthBytesUTF8(r) + 1),
						o = stringToUTF8Array(r, i, 0, i.length);
					FS.write(t, i, 0, o, 0, n.canOwn)
				} else "binary" === n.encoding && FS.write(t, r, 0, r.length, 0, n.canOwn);
				FS.close(t)
			},
			cwd: function() {
				return FS.currentPath
			},
			chdir: function(e) {
				var r = FS.lookupPath(e, {
					follow: !0
				});
				if(!FS.isDir(r.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
				var n = FS.nodePermissions(r.node, "x");
				if(n) throw new FS.ErrnoError(n);
				FS.currentPath = r.path
			},
			createDefaultDirectories: function() {
				FS.mkdir("/tmp"), FS.mkdir("/home"), FS.mkdir("/home/web_user")
			},
			createDefaultDevices: function() {
				FS.mkdir("/dev"), FS.registerDevice(FS.makedev(1, 3), {
					read: function() {
						return 0
					},
					write: function(e, r, n, t, i) {
						return t
					}
				}), FS.mkdev("/dev/null", FS.makedev(1, 3)), TTY.register(FS.makedev(5, 0), TTY.default_tty_ops), TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops), FS.mkdev("/dev/tty", FS.makedev(5, 0)), FS.mkdev("/dev/tty1", FS.makedev(6, 0));
				var e;
				if("undefined" != typeof crypto) {
					var r = new Uint8Array(1);
					e = function() {
						return crypto.getRandomValues(r), r[0]
					}
				} else e = ENVIRONMENT_IS_NODE ? function() {
					return require("crypto").randomBytes(1)[0]
				} : function() {
					return 256 * Math.random() | 0
				};
				FS.createDevice("/dev", "random", e), FS.createDevice("/dev", "urandom", e), FS.mkdir("/dev/shm"), FS.mkdir("/dev/shm/tmp")
			},
			createSpecialDirectories: function() {
				FS.mkdir("/proc"), FS.mkdir("/proc/self"), FS.mkdir("/proc/self/fd"), FS.mount({
					mount: function() {
						var e = FS.createNode("/proc/self", "fd", 16895, 73);
						return e.node_ops = {
							lookup: function(e, r) {
								var n = +r,
									t = FS.getStream(n);
								if(!t) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
								var i = {
									parent: null,
									mount: {
										mountpoint: "fake"
									},
									node_ops: {
										readlink: function() {
											return t.path
										}
									}
								};
								return i.parent = i, i
							}
						}, e
					}
				}, {}, "/proc/self/fd")
			},
			createStandardStreams: function() {
				Module.stdin ? FS.createDevice("/dev", "stdin", Module.stdin) : FS.symlink("/dev/tty", "/dev/stdin"), Module.stdout ? FS.createDevice("/dev", "stdout", null, Module.stdout) : FS.symlink("/dev/tty", "/dev/stdout"), Module.stderr ? FS.createDevice("/dev", "stderr", null, Module.stderr) : FS.symlink("/dev/tty1", "/dev/stderr");
				var e = FS.open("/dev/stdin", "r");
				assert(0 === e.fd, "invalid handle for stdin (" + e.fd + ")");
				var r = FS.open("/dev/stdout", "w");
				assert(1 === r.fd, "invalid handle for stdout (" + r.fd + ")");
				var n = FS.open("/dev/stderr", "w");
				assert(2 === n.fd, "invalid handle for stderr (" + n.fd + ")")
			},
			ensureErrnoError: function() {
				FS.ErrnoError || (FS.ErrnoError = function(e, r) {
					this.node = r, this.setErrno = function(e) {
						this.errno = e;
						for(var r in ERRNO_CODES)
							if(ERRNO_CODES[r] === e) {
								this.code = r;
								break
							}
					}, this.setErrno(e), this.message = ERRNO_MESSAGES[e]
				}, FS.ErrnoError.prototype = new Error, FS.ErrnoError.prototype.constructor = FS.ErrnoError, [ERRNO_CODES.ENOENT].forEach(function(e) {
					FS.genericErrors[e] = new FS.ErrnoError(e), FS.genericErrors[e].stack = "<generic error, no stack>"
				}))
			},
			staticInit: function() {
				FS.ensureErrnoError(), FS.nameTable = new Array(4096), FS.mount(MEMFS, {}, "/"), FS.createDefaultDirectories(), FS.createDefaultDevices(), FS.createSpecialDirectories(), FS.filesystems = {
					MEMFS: MEMFS,
					IDBFS: IDBFS,
					NODEFS: NODEFS,
					WORKERFS: WORKERFS
				}
			},
			init: function(e, r, n) {
				assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)"), FS.init.initialized = !0, FS.ensureErrnoError(), Module.stdin = e || Module.stdin, Module.stdout = r || Module.stdout, Module.stderr = n || Module.stderr, FS.createStandardStreams()
			},
			quit: function() {
				FS.init.initialized = !1;
				var e = Module._fflush;
				e && e(0);
				for(var r = 0; r < FS.streams.length; r++) {
					var n = FS.streams[r];
					n && FS.close(n)
				}
			},
			getMode: function(e, r) {
				var n = 0;
				return e && (n |= 365), r && (n |= 146), n
			},
			joinPath: function(e, r) {
				var n = PATH.join.apply(null, e);
				return r && "/" == n[0] && (n = n.substr(1)), n
			},
			absolutePath: function(e, r) {
				return PATH.resolve(r, e)
			},
			standardizePath: function(e) {
				return PATH.normalize(e)
			},
			findObject: function(e, r) {
				var n = FS.analyzePath(e, r);
				return n.exists ? n.object : (___setErrNo(n.error), null)
			},
			analyzePath: function(e, r) {
				try {
					var n = FS.lookupPath(e, {
						follow: !r
					});
					e = n.path
				} catch(t) {}
				var i = {
					isRoot: !1,
					exists: !1,
					error: 0,
					name: null,
					path: null,
					object: null,
					parentExists: !1,
					parentPath: null,
					parentObject: null
				};
				try {
					var n = FS.lookupPath(e, {
						parent: !0
					});
					i.parentExists = !0, i.parentPath = n.path, i.parentObject = n.node, i.name = PATH.basename(e), n = FS.lookupPath(e, {
						follow: !r
					}), i.exists = !0, i.path = n.path, i.object = n.node, i.name = n.node.name, i.isRoot = "/" === n.path
				} catch(t) {
					i.error = t.errno
				}
				return i
			},
			createFolder: function(e, r, n, t) {
				var i = PATH.join2("string" == typeof e ? e : FS.getPath(e), r),
					o = FS.getMode(n, t);
				return FS.mkdir(i, o)
			},
			createPath: function(e, r, n, t) {
				e = "string" == typeof e ? e : FS.getPath(e);
				for(var i = r.split("/").reverse(); i.length;) {
					var o = i.pop();
					if(o) {
						var a = PATH.join2(e, o);
						try {
							FS.mkdir(a)
						} catch(s) {}
						e = a
					}
				}
				return a
			},
			createFile: function(e, r, n, t, i) {
				var o = PATH.join2("string" == typeof e ? e : FS.getPath(e), r),
					a = FS.getMode(t, i);
				return FS.create(o, a)
			},
			createDataFile: function(e, r, n, t, i, o) {
				var a = r ? PATH.join2("string" == typeof e ? e : FS.getPath(e), r) : e,
					s = FS.getMode(t, i),
					l = FS.create(a, s);
				if(n) {
					if("string" == typeof n) {
						for(var f = new Array(n.length), u = 0, c = n.length; u < c; ++u) f[u] = n.charCodeAt(u);
						n = f
					}
					FS.chmod(l, 146 | s);
					var d = FS.open(l, "w");
					FS.write(d, n, 0, n.length, 0, o), FS.close(d), FS.chmod(l, s)
				}
				return l
			},
			createDevice: function(e, r, n, t) {
				var i = PATH.join2("string" == typeof e ? e : FS.getPath(e), r),
					o = FS.getMode(!!n, !!t);
				FS.createDevice.major || (FS.createDevice.major = 64);
				var a = FS.makedev(FS.createDevice.major++, 0);
				return FS.registerDevice(a, {
					open: function(e) {
						e.seekable = !1
					},
					close: function(e) {
						t && t.buffer && t.buffer.length && t(10)
					},
					read: function(e, r, t, i, o) {
						for(var a = 0, s = 0; s < i; s++) {
							var l;
							try {
								l = n()
							} catch(f) {
								throw new FS.ErrnoError(ERRNO_CODES.EIO)
							}
							if(void 0 === l && 0 === a) throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
							if(null === l || void 0 === l) break;
							a++, r[t + s] = l
						}
						return a && (e.node.timestamp = Date.now()), a
					},
					write: function(e, r, n, i, o) {
						for(var a = 0; a < i; a++) try {
							t(r[n + a])
						} catch(s) {
							throw new FS.ErrnoError(ERRNO_CODES.EIO)
						}
						return i && (e.node.timestamp = Date.now()), a
					}
				}), FS.mkdev(i, o, a)
			},
			createLink: function(e, r, n, t, i) {
				var o = PATH.join2("string" == typeof e ? e : FS.getPath(e), r);
				return FS.symlink(n, o)
			},
			forceLoadFile: function(e) {
				if(e.isDevice || e.isFolder || e.link || e.contents) return !0;
				var r = !0;
				if("undefined" != typeof XMLHttpRequest) throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
				if(!Module.read) throw new Error("Cannot load without read() or XMLHttpRequest.");
				try {
					e.contents = intArrayFromString(Module.read(e.url), !0), e.usedBytes = e.contents.length
				} catch(n) {
					r = !1
				}
				return r || ___setErrNo(ERRNO_CODES.EIO), r
			},
			createLazyFile: function(e, r, n, t, i) {
				function o() {
					this.lengthKnown = !1, this.chunks = []
				}
				if(o.prototype.get = function(e) {
						if(!(e > this.length - 1 || e < 0)) {
							var r = e % this.chunkSize,
								n = e / this.chunkSize | 0;
							return this.getter(n)[r]
						}
					}, o.prototype.setDataGetter = function(e) {
						this.getter = e
					}, o.prototype.cacheLength = function() {
						var e = new XMLHttpRequest;
						if(e.open("HEAD", n, !1), e.send(null), !(e.status >= 200 && e.status < 300 || 304 === e.status)) throw new Error("Couldn't load " + n + ". Status: " + e.status);
						var r, t = Number(e.getResponseHeader("Content-length")),
							i = (r = e.getResponseHeader("Accept-Ranges")) && "bytes" === r,
							o = 1048576;
						i || (o = t);
						var a = function(e, r) {
								if(e > r) throw new Error("invalid range (" + e + ", " + r + ") or no bytes requested!");
								if(r > t - 1) throw new Error("only " + t + " bytes available! programmer error!");
								var i = new XMLHttpRequest;
								if(i.open("GET", n, !1), t !== o && i.setRequestHeader("Range", "bytes=" + e + "-" + r), "undefined" != typeof Uint8Array && (i.responseType = "arraybuffer"), i.overrideMimeType && i.overrideMimeType("text/plain; charset=x-user-defined"), i.send(null), !(i.status >= 200 && i.status < 300 || 304 === i.status)) throw new Error("Couldn't load " + n + ". Status: " + i.status);
								return void 0 !== i.response ? new Uint8Array(i.response || []) : intArrayFromString(i.responseText || "", !0)
							},
							s = this;
						s.setDataGetter(function(e) {
							var r = e * o,
								n = (e + 1) * o - 1;
							if(n = Math.min(n, t - 1), "undefined" == typeof s.chunks[e] && (s.chunks[e] = a(r, n)), "undefined" == typeof s.chunks[e]) throw new Error("doXHR failed!");
							return s.chunks[e]
						}), this._length = t, this._chunkSize = o, this.lengthKnown = !0
					}, "undefined" != typeof XMLHttpRequest) {
					if(!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
					var a = new o;
					Object.defineProperty(a, "length", {
						get: function() {
							return this.lengthKnown || this.cacheLength(), this._length
						}
					}), Object.defineProperty(a, "chunkSize", {
						get: function() {
							return this.lengthKnown || this.cacheLength(), this._chunkSize
						}
					});
					var s = {
						isDevice: !1,
						contents: a
					}
				} else var s = {
					isDevice: !1,
					url: n
				};
				var l = FS.createFile(e, r, s, t, i);
				s.contents ? l.contents = s.contents : s.url && (l.contents = null, l.url = s.url), Object.defineProperty(l, "usedBytes", {
					get: function() {
						return this.contents.length
					}
				});
				var f = {},
					u = Object.keys(l.stream_ops);
				return u.forEach(function(e) {
					var r = l.stream_ops[e];
					f[e] = function() {
						if(!FS.forceLoadFile(l)) throw new FS.ErrnoError(ERRNO_CODES.EIO);
						return r.apply(null, arguments)
					}
				}), f.read = function(e, r, n, t, i) {
					if(!FS.forceLoadFile(l)) throw new FS.ErrnoError(ERRNO_CODES.EIO);
					var o = e.node.contents;
					if(i >= o.length) return 0;
					var a = Math.min(o.length - i, t);
					if(assert(a >= 0), o.slice)
						for(var s = 0; s < a; s++) r[n + s] = o[i + s];
					else
						for(var s = 0; s < a; s++) r[n + s] = o.get(i + s);
					return a
				}, l.stream_ops = f, l
			},
			createPreloadedFile: function(e, r, n, t, i, o, a, s, l, f) {
				function u(n) {
					function u(n) {
						f && f(), s || FS.createDataFile(e, r, n, t, i, l), o && o(), removeRunDependency(d)
					}
					var h = !1;
					Module.preloadPlugins.forEach(function(e) {
						h || e.canHandle(c) && (e.handle(n, c, u, function() {
							a && a(), removeRunDependency(d)
						}), h = !0)
					}), h || u(n)
				}
				Browser.init();
				var c = r ? PATH.resolve(PATH.join2(e, r)) : e,
					d = getUniqueRunDependency("cp " + c);
				addRunDependency(d), "string" == typeof n ? Browser.asyncLoad(n, function(e) {
					u(e)
				}, a) : u(n)
			},
			indexedDB: function() {
				return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
			},
			DB_NAME: function() {
				return "EM_FS_" + window.location.pathname
			},
			DB_VERSION: 20,
			DB_STORE_NAME: "FILE_DATA",
			saveFilesToDB: function(e, r, n) {
				r = r || function() {}, n = n || function() {};
				var t = FS.indexedDB();
				try {
					var i = t.open(FS.DB_NAME(), FS.DB_VERSION)
				} catch(o) {
					return n(o)
				}
				i.onupgradeneeded = function() {
					console.log("creating db");
					var e = i.result;
					e.createObjectStore(FS.DB_STORE_NAME)
				}, i.onsuccess = function() {
					function t() {
						0 == f ? r() : n()
					}
					var o = i.result,
						a = o.transaction([FS.DB_STORE_NAME], "readwrite"),
						s = a.objectStore(FS.DB_STORE_NAME),
						l = 0,
						f = 0,
						u = e.length;
					e.forEach(function(e) {
						var r = s.put(FS.analyzePath(e).object.contents, e);
						r.onsuccess = function() {
							l++, l + f == u && t()
						}, r.onerror = function() {
							f++, l + f == u && t()
						}
					}), a.onerror = n
				}, i.onerror = n
			},
			loadFilesFromDB: function(e, r, n) {
				r = r || function() {}, n = n || function() {};
				var t = FS.indexedDB();
				try {
					var i = t.open(FS.DB_NAME(), FS.DB_VERSION)
				} catch(o) {
					return n(o)
				}
				i.onupgradeneeded = n, i.onsuccess = function() {
					function t() {
						0 == u ? r() : n()
					}
					var o = i.result;
					try {
						var a = o.transaction([FS.DB_STORE_NAME], "readonly")
					} catch(s) {
						return void n(s)
					}
					var l = a.objectStore(FS.DB_STORE_NAME),
						f = 0,
						u = 0,
						c = e.length;
					e.forEach(function(e) {
						var r = l.get(e);
						r.onsuccess = function() {
							FS.analyzePath(e).exists && FS.unlink(e), FS.createDataFile(PATH.dirname(e), PATH.basename(e), r.result, !0, !0, !0), f++, f + u == c && t()
						}, r.onerror = function() {
							u++, f + u == c && t()
						}
					}), a.onerror = n
				}, i.onerror = n
			}
		},
		PATH = {
			splitPath: function(e) {
				var r = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
				return r.exec(e).slice(1)
			},
			normalizeArray: function(e, r) {
				for(var n = 0, t = e.length - 1; t >= 0; t--) {
					var i = e[t];
					"." === i ? e.splice(t, 1) : ".." === i ? (e.splice(t, 1), n++) : n && (e.splice(t, 1), n--)
				}
				if(r)
					for(; n--; n) e.unshift("..");
				return e
			},
			normalize: function(e) {
				var r = "/" === e.charAt(0),
					n = "/" === e.substr(-1);
				return e = PATH.normalizeArray(e.split("/").filter(function(e) {
					return !!e
				}), !r).join("/"), e || r || (e = "."), e && n && (e += "/"), (r ? "/" : "") + e
			},
			dirname: function(e) {
				var r = PATH.splitPath(e),
					n = r[0],
					t = r[1];
				return n || t ? (t && (t = t.substr(0, t.length - 1)), n + t) : "."
			},
			basename: function(e) {
				if("/" === e) return "/";
				var r = e.lastIndexOf("/");
				return r === -1 ? e : e.substr(r + 1)
			},
			extname: function(e) {
				return PATH.splitPath(e)[3]
			},
			join: function() {
				var e = Array.prototype.slice.call(arguments, 0);
				return PATH.normalize(e.join("/"))
			},
			join2: function(e, r) {
				return PATH.normalize(e + "/" + r)
			},
			resolve: function() {
				for(var e = "", r = !1, n = arguments.length - 1; n >= -1 && !r; n--) {
					var t = n >= 0 ? arguments[n] : FS.cwd();
					if("string" != typeof t) throw new TypeError("Arguments to path.resolve must be strings");
					if(!t) return "";
					e = t + "/" + e, r = "/" === t.charAt(0)
				}
				return e = PATH.normalizeArray(e.split("/").filter(function(e) {
					return !!e
				}), !r).join("/"), (r ? "/" : "") + e || "."
			},
			relative: function(e, r) {
				function n(e) {
					for(var r = 0; r < e.length && "" === e[r]; r++);
					for(var n = e.length - 1; n >= 0 && "" === e[n]; n--);
					return r > n ? [] : e.slice(r, n - r + 1)
				}
				e = PATH.resolve(e).substr(1), r = PATH.resolve(r).substr(1);
				for(var t = n(e.split("/")), i = n(r.split("/")), o = Math.min(t.length, i.length), a = o, s = 0; s < o; s++)
					if(t[s] !== i[s]) {
						a = s;
						break
					}
				for(var l = [], s = a; s < t.length; s++) l.push("..");
				return l = l.concat(i.slice(a)), l.join("/")
			}
		},
		Browser = {
			mainLoop: {
				scheduler: null,
				method: "",
				currentlyRunningMainloop: 0,
				func: null,
				arg: 0,
				timingMode: 0,
				timingValue: 0,
				currentFrameNumber: 0,
				queue: [],
				pause: function() {
					Browser.mainLoop.scheduler = null, Browser.mainLoop.currentlyRunningMainloop++
				},
				resume: function() {
					Browser.mainLoop.currentlyRunningMainloop++;
					var e = Browser.mainLoop.timingMode,
						r = Browser.mainLoop.timingValue,
						n = Browser.mainLoop.func;
					Browser.mainLoop.func = null, _emscripten_set_main_loop(n, 0, !1, Browser.mainLoop.arg, !0), _emscripten_set_main_loop_timing(e, r), Browser.mainLoop.scheduler()
				},
				updateStatus: function() {
					if(Module.setStatus) {
						var e = Module.statusMessage || "Please wait...",
							r = Browser.mainLoop.remainingBlockers,
							n = Browser.mainLoop.expectedBlockers;
						r ? r < n ? Module.setStatus(e + " (" + (n - r) + "/" + n + ")") : Module.setStatus(e) : Module.setStatus("")
					}
				},
				runIter: function(e) {
					if(!ABORT) {
						if(Module.preMainLoop) {
							var r = Module.preMainLoop();
							if(r === !1) return
						}
						try {
							e()
						} catch(n) {
							if(n instanceof ExitStatus) return;
							throw n && "object" == typeof n && n.stack && Module.printErr("exception thrown: " + [n, n.stack]), n
						}
						Module.postMainLoop && Module.postMainLoop()
					}
				}
			},
			isFullScreen: !1,
			pointerLock: !1,
			moduleContextCreatedCallbacks: [],
			workers: [],
			init: function() {
				function e() {
					Browser.pointerLock = document.pointerLockElement === i || document.mozPointerLockElement === i || document.webkitPointerLockElement === i || document.msPointerLockElement === i
				}
				if(Module.preloadPlugins || (Module.preloadPlugins = []), !Browser.initted) {
					Browser.initted = !0;
					try {
						new Blob, Browser.hasBlobConstructor = !0
					} catch(r) {
						Browser.hasBlobConstructor = !1, console.log("warning: no blob constructor, cannot create blobs with mimetypes")
					}
					Browser.BlobBuilder = "undefined" != typeof MozBlobBuilder ? MozBlobBuilder : "undefined" != typeof WebKitBlobBuilder ? WebKitBlobBuilder : Browser.hasBlobConstructor ? null : console.log("warning: no BlobBuilder"), Browser.URLObject = "undefined" != typeof window ? window.URL ? window.URL : window.webkitURL : void 0, Module.noImageDecoding || "undefined" != typeof Browser.URLObject || (console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available."), Module.noImageDecoding = !0);
					var n = {};
					n.canHandle = function(e) {
						return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(e)
					}, n.handle = function(e, r, n, t) {
						var i = null;
						if(Browser.hasBlobConstructor) try {
							i = new Blob([e], {
								type: Browser.getMimetype(r)
							}), i.size !== e.length && (i = new Blob([new Uint8Array(e).buffer], {
								type: Browser.getMimetype(r)
							}))
						} catch(o) {
							Runtime.warnOnce("Blob constructor present but fails: " + o + "; falling back to blob builder")
						}
						if(!i) {
							var a = new Browser.BlobBuilder;
							a.append(new Uint8Array(e).buffer), i = a.getBlob()
						}
						var s = Browser.URLObject.createObjectURL(i),
							l = new Image;
						l.onload = function() {
							assert(l.complete, "Image " + r + " could not be decoded");
							var t = document.createElement("canvas");
							t.width = l.width, t.height = l.height;
							var i = t.getContext("2d");
							i.drawImage(l, 0, 0), Module.preloadedImages[r] = t, Browser.URLObject.revokeObjectURL(s), n && n(e)
						}, l.onerror = function(e) {
							console.log("Image " + s + " could not be decoded"), t && t()
						}, l.src = s
					}, Module.preloadPlugins.push(n);
					var t = {};
					t.canHandle = function(e) {
						return !Module.noAudioDecoding && e.substr(-4) in {
							".ogg": 1,
							".wav": 1,
							".mp3": 1
						}
					}, t.handle = function(e, r, n, t) {
						function i(t) {
							a || (a = !0, Module.preloadedAudios[r] = t, n && n(e))
						}

						function o() {
							a || (a = !0, Module.preloadedAudios[r] = new Audio, t && t())
						}
						var a = !1;
						if(!Browser.hasBlobConstructor) return o();
						try {
							var s = new Blob([e], {
								type: Browser.getMimetype(r)
							})
						} catch(l) {
							return o()
						}
						var f = Browser.URLObject.createObjectURL(s),
							u = new Audio;
						u.addEventListener("canplaythrough", function() {
							i(u)
						}, !1), u.onerror = function(n) {
							function t(e) {
								for(var r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = "=", t = "", i = 0, o = 0, a = 0; a < e.length; a++)
									for(i = i << 8 | e[a], o += 8; o >= 6;) {
										var s = i >> o - 6 & 63;
										o -= 6, t += r[s]
									}
								return 2 == o ? (t += r[(3 & i) << 4], t += n + n) : 4 == o && (t += r[(15 & i) << 2], t += n), t
							}
							a || (console.log("warning: browser could not fully decode audio " + r + ", trying slower base64 approach"), u.src = "data:audio/x-" + r.substr(-3) + ";base64," + t(e), i(u))
						}, u.src = f, Browser.safeSetTimeout(function() {
							i(u)
						}, 1e4)
					}, Module.preloadPlugins.push(t);
					var i = Module.canvas;
					i && (i.requestPointerLock = i.requestPointerLock || i.mozRequestPointerLock || i.webkitRequestPointerLock || i.msRequestPointerLock || function() {}, i.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock || document.msExitPointerLock || function() {}, i.exitPointerLock = i.exitPointerLock.bind(document), document.addEventListener("pointerlockchange", e, !1), document.addEventListener("mozpointerlockchange", e, !1), document.addEventListener("webkitpointerlockchange", e, !1), document.addEventListener("mspointerlockchange", e, !1), Module.elementPointerLock && i.addEventListener("click", function(e) {
						!Browser.pointerLock && i.requestPointerLock && (i.requestPointerLock(), e.preventDefault())
					}, !1))
				}
			},
			createContext: function(e, r, n, t) {
				if(r && Module.ctx && e == Module.canvas) return Module.ctx;
				var i, o;
				if(r) {
					var a = {
						antialias: !1,
						alpha: !1
					};
					if(t)
						for(var s in t) a[s] = t[s];
					o = GL.createContext(e, a), o && (i = GL.getContext(o).GLctx), e.style.backgroundColor = "black"
				} else i = e.getContext("2d");
				return i ? (n && (r || assert("undefined" == typeof GLctx, "cannot set in module if GLctx is used, but we are a non-GL context that would replace it"), Module.ctx = i, r && GL.makeContextCurrent(o), Module.useWebGL = r, Browser.moduleContextCreatedCallbacks.forEach(function(e) {
					e()
				}), Browser.init()), i) : null
			},
			destroyContext: function(e, r, n) {},
			fullScreenHandlersInstalled: !1,
			lockPointer: void 0,
			resizeCanvas: void 0,
			requestFullScreen: function(e, r, n) {
				function t() {
					Browser.isFullScreen = !1;
					var e = i.parentNode;
					(document.webkitFullScreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.mozFullscreenElement || document.fullScreenElement || document.fullscreenElement || document.msFullScreenElement || document.msFullscreenElement || document.webkitCurrentFullScreenElement) === e ? (i.cancelFullScreen = document.cancelFullScreen || document.mozCancelFullScreen || document.webkitCancelFullScreen || document.msExitFullscreen || document.exitFullscreen || function() {}, i.cancelFullScreen = i.cancelFullScreen.bind(document), Browser.lockPointer && i.requestPointerLock(), Browser.isFullScreen = !0, Browser.resizeCanvas && Browser.setFullScreenCanvasSize()) : (e.parentNode.insertBefore(i, e), e.parentNode.removeChild(e), Browser.resizeCanvas && Browser.setWindowedCanvasSize()), Module.onFullScreen && Module.onFullScreen(Browser.isFullScreen), Browser.updateCanvasDimensions(i)
				}
				Browser.lockPointer = e, Browser.resizeCanvas = r, Browser.vrDevice = n, "undefined" == typeof Browser.lockPointer && (Browser.lockPointer = !0), "undefined" == typeof Browser.resizeCanvas && (Browser.resizeCanvas = !1), "undefined" == typeof Browser.vrDevice && (Browser.vrDevice = null);
				var i = Module.canvas;
				Browser.fullScreenHandlersInstalled || (Browser.fullScreenHandlersInstalled = !0, document.addEventListener("fullscreenchange", t, !1), document.addEventListener("mozfullscreenchange", t, !1), document.addEventListener("webkitfullscreenchange", t, !1), document.addEventListener("MSFullscreenChange", t, !1));
				var o = document.createElement("div");
				i.parentNode.insertBefore(o, i), o.appendChild(i),
					o.requestFullScreen = o.requestFullScreen || o.mozRequestFullScreen || o.msRequestFullscreen || (o.webkitRequestFullScreen ? function() {
						o.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
					} : null), n ? o.requestFullScreen({
						vrDisplay: n
					}) : o.requestFullScreen()
			},
			nextRAF: 0,
			fakeRequestAnimationFrame: function(e) {
				var r = Date.now();
				if(0 === Browser.nextRAF) Browser.nextRAF = r + 1e3 / 60;
				else
					for(; r + 2 >= Browser.nextRAF;) Browser.nextRAF += 1e3 / 60;
				var n = Math.max(Browser.nextRAF - r, 0);
				setTimeout(e, n)
			},
			requestAnimationFrame: function(e) {
				"undefined" == typeof window ? Browser.fakeRequestAnimationFrame(e) : (window.requestAnimationFrame || (window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || Browser.fakeRequestAnimationFrame), window.requestAnimationFrame(e))
			},
			safeCallback: function(e) {
				return function() {
					if(!ABORT) return e.apply(null, arguments)
				}
			},
			allowAsyncCallbacks: !0,
			queuedAsyncCallbacks: [],
			pauseAsyncCallbacks: function() {
				Browser.allowAsyncCallbacks = !1
			},
			resumeAsyncCallbacks: function() {
				if(Browser.allowAsyncCallbacks = !0, Browser.queuedAsyncCallbacks.length > 0) {
					var e = Browser.queuedAsyncCallbacks;
					Browser.queuedAsyncCallbacks = [], e.forEach(function(e) {
						e()
					})
				}
			},
			safeRequestAnimationFrame: function(e) {
				return Browser.requestAnimationFrame(function() {
					ABORT || (Browser.allowAsyncCallbacks ? e() : Browser.queuedAsyncCallbacks.push(e))
				})
			},
			safeSetTimeout: function(e, r) {
				return Module.noExitRuntime = !0, setTimeout(function() {
					ABORT || (Browser.allowAsyncCallbacks ? e() : Browser.queuedAsyncCallbacks.push(e))
				}, r)
			},
			safeSetInterval: function(e, r) {
				return Module.noExitRuntime = !0, setInterval(function() {
					ABORT || Browser.allowAsyncCallbacks && e()
				}, r)
			},
			getMimetype: function(e) {
				return {
					jpg: "image/jpeg",
					jpeg: "image/jpeg",
					png: "image/png",
					bmp: "image/bmp",
					ogg: "audio/ogg",
					wav: "audio/wav",
					mp3: "audio/mpeg"
				}[e.substr(e.lastIndexOf(".") + 1)]
			},
			getUserMedia: function(e) {
				window.getUserMedia || (window.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia), window.getUserMedia(e)
			},
			getMovementX: function(e) {
				return e.movementX || e.mozMovementX || e.webkitMovementX || 0
			},
			getMovementY: function(e) {
				return e.movementY || e.mozMovementY || e.webkitMovementY || 0
			},
			getMouseWheelDelta: function(e) {
				var r = 0;
				switch(e.type) {
					case "DOMMouseScroll":
						r = e.detail;
						break;
					case "mousewheel":
						r = e.wheelDelta;
						break;
					case "wheel":
						r = e.deltaY;
						break;
					default:
						throw "unrecognized mouse wheel event: " + e.type
				}
				return r
			},
			mouseX: 0,
			mouseY: 0,
			mouseMovementX: 0,
			mouseMovementY: 0,
			touches: {},
			lastTouches: {},
			calculateMouseEvent: function(e) {
				if(Browser.pointerLock) "mousemove" != e.type && "mozMovementX" in e ? Browser.mouseMovementX = Browser.mouseMovementY = 0 : (Browser.mouseMovementX = Browser.getMovementX(e), Browser.mouseMovementY = Browser.getMovementY(e)), "undefined" != typeof SDL ? (Browser.mouseX = SDL.mouseX + Browser.mouseMovementX, Browser.mouseY = SDL.mouseY + Browser.mouseMovementY) : (Browser.mouseX += Browser.mouseMovementX, Browser.mouseY += Browser.mouseMovementY);
				else {
					var r = Module.canvas.getBoundingClientRect(),
						n = Module.canvas.width,
						t = Module.canvas.height,
						i = "undefined" != typeof window.scrollX ? window.scrollX : window.pageXOffset,
						o = "undefined" != typeof window.scrollY ? window.scrollY : window.pageYOffset;
					if("touchstart" === e.type || "touchend" === e.type || "touchmove" === e.type) {
						var a = e.touch;
						if(void 0 === a) return;
						var s = a.pageX - (i + r.left),
							l = a.pageY - (o + r.top);
						s *= n / r.width, l *= t / r.height;
						var f = {
							x: s,
							y: l
						};
						if("touchstart" === e.type) Browser.lastTouches[a.identifier] = f, Browser.touches[a.identifier] = f;
						else if("touchend" === e.type || "touchmove" === e.type) {
							var u = Browser.touches[a.identifier];
							u || (u = f), Browser.lastTouches[a.identifier] = u, Browser.touches[a.identifier] = f
						}
						return
					}
					var c = e.pageX - (i + r.left),
						d = e.pageY - (o + r.top);
					c *= n / r.width, d *= t / r.height, Browser.mouseMovementX = c - Browser.mouseX, Browser.mouseMovementY = d - Browser.mouseY, Browser.mouseX = c, Browser.mouseY = d
				}
			},
			xhrLoad: function(e, r, n) {
				var t = new XMLHttpRequest;
				t.open("GET", e, !0), t.responseType = "arraybuffer", t.onload = function() {
					200 == t.status || 0 == t.status && t.response ? r(t.response) : n()
				}, t.onerror = n, t.send(null)
			},
			asyncLoad: function(e, r, n, t) {
				Browser.xhrLoad(e, function(n) {
					assert(n, 'Loading data file "' + e + '" failed (no arrayBuffer).'), r(new Uint8Array(n)), t || removeRunDependency("al " + e)
				}, function(r) {
					if(!n) throw 'Loading data file "' + e + '" failed.';
					n()
				}), t || addRunDependency("al " + e)
			},
			resizeListeners: [],
			updateResizeListeners: function() {
				var e = Module.canvas;
				Browser.resizeListeners.forEach(function(r) {
					r(e.width, e.height)
				})
			},
			setCanvasSize: function(e, r, n) {
				var t = Module.canvas;
				Browser.updateCanvasDimensions(t, e, r), n || Browser.updateResizeListeners()
			},
			windowedWidth: 0,
			windowedHeight: 0,
			setFullScreenCanvasSize: function() {
				if("undefined" != typeof SDL) {
					var e = HEAPU32[SDL.screen + 0 * Runtime.QUANTUM_SIZE >> 2];
					e = 8388608 | e, HEAP32[SDL.screen + 0 * Runtime.QUANTUM_SIZE >> 2] = e
				}
				Browser.updateResizeListeners()
			},
			setWindowedCanvasSize: function() {
				if("undefined" != typeof SDL) {
					var e = HEAPU32[SDL.screen + 0 * Runtime.QUANTUM_SIZE >> 2];
					e &= -8388609, HEAP32[SDL.screen + 0 * Runtime.QUANTUM_SIZE >> 2] = e
				}
				Browser.updateResizeListeners()
			},
			updateCanvasDimensions: function(e, r, n) {
				r && n ? (e.widthNative = r, e.heightNative = n) : (r = e.widthNative, n = e.heightNative);
				var t = r,
					i = n;
				if(Module.forcedAspectRatio && Module.forcedAspectRatio > 0 && (t / i < Module.forcedAspectRatio ? t = Math.round(i * Module.forcedAspectRatio) : i = Math.round(t / Module.forcedAspectRatio)), (document.webkitFullScreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.mozFullscreenElement || document.fullScreenElement || document.fullscreenElement || document.msFullScreenElement || document.msFullscreenElement || document.webkitCurrentFullScreenElement) === e.parentNode && "undefined" != typeof screen) {
					var o = Math.min(screen.width / t, screen.height / i);
					t = Math.round(t * o), i = Math.round(i * o)
				}
				Browser.resizeCanvas ? (e.width != t && (e.width = t), e.height != i && (e.height = i), "undefined" != typeof e.style && (e.style.removeProperty("width"), e.style.removeProperty("height"))) : (e.width != r && (e.width = r), e.height != n && (e.height = n), "undefined" != typeof e.style && (t != r || i != n ? (e.style.setProperty("width", t + "px", "important"), e.style.setProperty("height", i + "px", "important")) : (e.style.removeProperty("width"), e.style.removeProperty("height"))))
			},
			wgetRequests: {},
			nextWgetRequestHandle: 0,
			getNextWgetRequestHandle: function() {
				var e = Browser.nextWgetRequestHandle;
				return Browser.nextWgetRequestHandle++, e
			}
		};
	if(Module.requestFullScreen = function(e, r, n) {
			Browser.requestFullScreen(e, r, n)
		}, Module.requestAnimationFrame = function(e) {
			Browser.requestAnimationFrame(e)
		}, Module.setCanvasSize = function(e, r, n) {
			Browser.setCanvasSize(e, r, n)
		}, Module.pauseMainLoop = function() {
			Browser.mainLoop.pause()
		}, Module.resumeMainLoop = function() {
			Browser.mainLoop.resume()
		}, Module.getUserMedia = function() {
			Browser.getUserMedia()
		}, Module.createContext = function(e, r, n, t) {
			return Browser.createContext(e, r, n, t)
		}, FS.staticInit(), __ATINIT__.unshift(function() {
			Module.noFSInit || FS.init.initialized || FS.init()
		}), __ATMAIN__.push(function() {
			FS.ignorePermissions = !1
		}), __ATEXIT__.push(function() {
			FS.quit()
		}), Module.FS_createFolder = FS.createFolder, Module.FS_createPath = FS.createPath, Module.FS_createDataFile = FS.createDataFile, Module.FS_createPreloadedFile = FS.createPreloadedFile, Module.FS_createLazyFile = FS.createLazyFile, Module.FS_createLink = FS.createLink, Module.FS_createDevice = FS.createDevice, Module.FS_unlink = FS.unlink, __ATINIT__.unshift(function() {
			TTY.init()
		}), __ATEXIT__.push(function() {
			TTY.shutdown()
		}), ENVIRONMENT_IS_NODE) {
		var fs = require("fs"),
			NODEJS_PATH = require("path");
		NODEFS.staticInit()
	}
	STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP), staticSealed = !0, STACK_MAX = STACK_BASE + TOTAL_STACK, DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX), assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack"), Module.asmGlobalArg = {
		Math: Math,
		Int8Array: Int8Array,
		Int16Array: Int16Array,
		Int32Array: Int32Array,
		Uint8Array: Uint8Array,
		Uint16Array: Uint16Array,
		Uint32Array: Uint32Array,
		Float32Array: Float32Array,
		Float64Array: Float64Array,
		NaN: NaN,
		Infinity: 1 / 0
	}, Module.asmLibraryArg = {
		abort: abort,
		assert: assert,
		_sysconf: _sysconf,
		_pthread_self: _pthread_self,
		_abort: _abort,
		___setErrNo: ___setErrNo,
		_sbrk: _sbrk,
		_time: _time,
		_emscripten_set_main_loop_timing: _emscripten_set_main_loop_timing,
		_emscripten_memcpy_big: _emscripten_memcpy_big,
		_emscripten_set_main_loop: _emscripten_set_main_loop,
		STACKTOP: STACKTOP,
		STACK_MAX: STACK_MAX,
		tempDoublePtr: tempDoublePtr,
		ABORT: ABORT
	};
	var asm = function(e, r, n) {
			"use asm";
			var t = new e.Int8Array(n);
			var i = new e.Int16Array(n);
			var o = new e.Int32Array(n);
			var a = new e.Uint8Array(n);
			var s = new e.Uint16Array(n);
			var l = new e.Uint32Array(n);
			var f = new e.Float32Array(n);
			var u = new e.Float64Array(n);
			var c = r.STACKTOP | 0;
			var d = r.STACK_MAX | 0;
			var h = r.tempDoublePtr | 0;
			var E = r.ABORT | 0;
			var w = 0;
			var m = 0;
			var S = 0;
			var p = 0;
			var v = e.NaN,
				_ = e.Infinity;
			var b = 0,
				k = 0,
				F = 0,
				M = 0,
				g = 0,
				R = 0,
				y = 0,
				O = 0,
				A = 0;
			var T = 0;
			var D = 0;
			var N = 0;
			var P = 0;
			var C = 0;
			var I = 0;
			var B = 0;
			var L = 0;
			var U = 0;
			var x = 0;
			var H = e.Math.floor;
			var z = e.Math.abs;
			var j = e.Math.sqrt;
			var Y = e.Math.pow;
			var V = e.Math.cos;
			var q = e.Math.sin;
			var K = e.Math.tan;
			var W = e.Math.acos;
			var X = e.Math.asin;
			var G = e.Math.atan;
			var J = e.Math.atan2;
			var Z = e.Math.exp;
			var Q = e.Math.log;
			var $ = e.Math.ceil;
			var ee = e.Math.imul;
			var re = e.Math.min;
			var ne = e.Math.clz32;
			var te = r.abort;
			var ie = r.assert;
			var oe = r._sysconf;
			var ae = r._pthread_self;
			var se = r._abort;
			var le = r.___setErrNo;
			var fe = r._sbrk;
			var ue = r._time;
			var ce = r._emscripten_set_main_loop_timing;
			var de = r._emscripten_memcpy_big;
			var he = r._emscripten_set_main_loop;
			var Ee = 0;

			function we(e) {
				e = e | 0;
				var r = 0;
				r = c;
				c = c + e | 0;
				c = c + 15 & -16;
				return r | 0
			}

			function me() {
				return c | 0
			}

			function Se(e) {
				e = e | 0;
				c = e
			}

			function pe(e, r) {
				e = e | 0;
				r = r | 0;
				c = e;
				d = r
			}

			function ve(e, r) {
				e = e | 0;
				r = r | 0;
				if(!w) {
					w = e;
					m = r
				}
			}

			function _e(e) {
				e = e | 0;
				t[h >> 0] = t[e >> 0];
				t[h + 1 >> 0] = t[e + 1 >> 0];
				t[h + 2 >> 0] = t[e + 2 >> 0];
				t[h + 3 >> 0] = t[e + 3 >> 0]
			}

			function be(e) {
				e = e | 0;
				t[h >> 0] = t[e >> 0];
				t[h + 1 >> 0] = t[e + 1 >> 0];
				t[h + 2 >> 0] = t[e + 2 >> 0];
				t[h + 3 >> 0] = t[e + 3 >> 0];
				t[h + 4 >> 0] = t[e + 4 >> 0];
				t[h + 5 >> 0] = t[e + 5 >> 0];
				t[h + 6 >> 0] = t[e + 6 >> 0];
				t[h + 7 >> 0] = t[e + 7 >> 0]
			}

			function ke(e) {
				e = e | 0;
				T = e
			}

			function Fe() {
				return T | 0
			}

			function Me() {
				var e = 0,
					r = 0;
				r = c;
				c = c + 16 | 0;
				e = r;
				o[e >> 2] = 0;
				Nr(e, 31756) | 0;
				c = r;
				return o[e >> 2] | 0
			}

			function ge(e) {
				e = e | 0;
				var r = 0,
					n = 0;
				r = c;
				c = c + 16 | 0;
				n = r;
				o[n >> 2] = e;
				Pr(n);
				c = r;
				return
			}

			function Re(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				Pe(e, (t | 0) == 0 ? (a[r >> 0] | 0) >>> 3 & 15 : 15, r + 1 | 0, n, 2) | 0;
				return
			}

			function ye(e) {
				e = e | 0;
				var r = 0;
				r = xi(8) | 0;
				Br(r, r + 4 | 0, e) | 0;
				return r | 0
			}

			function Oe(e) {
				e = e | 0;
				Lr(e, e + 4 | 0);
				Hi(e);
				return
			}

			function Ae(e, r, n, i, s) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				i = i | 0;
				s = s | 0;
				var l = 0;
				s = c;
				c = c + 16 | 0;
				l = s;
				o[l >> 2] = r;
				n = (Ur(o[e >> 2] | 0, o[e + 4 >> 2] | 0, r, n, i, l, 3) | 0) << 16 >> 16;
				t[i >> 0] = a[i >> 0] | 0 | 4;
				c = s;
				return n | 0
			}

			function Te(e) {
				e = e | 0;
				if(!e) e = -1;
				else {
					i[e >> 1] = 4096;
					e = 0
				}
				return e | 0
			}

			function De(e, r, n, t, a, s) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				var l = 0,
					f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0;
				d = o[s >> 2] | 0;
				m = a << 16 >> 16 > 0;
				if(m) {
					l = 0;
					f = 0;
					do {
						c = i[n + (l << 1) >> 1] | 0;
						c = ee(c, c) | 0;
						if((c | 0) != 1073741824) {
							u = (c << 1) + f | 0;
							if((c ^ f | 0) > 0 & (u ^ f | 0) < 0) {
								o[s >> 2] = 1;
								f = (f >>> 31) + 2147483647 | 0
							} else f = u
						} else {
							o[s >> 2] = 1;
							f = 2147483647
						}
						l = l + 1 | 0
					} while ((l & 65535) << 16 >> 16 != a << 16 >> 16);
					if((f | 0) == 2147483647) {
						o[s >> 2] = d;
						c = 0;
						u = 0;
						do {
							f = i[n + (c << 1) >> 1] >> 2;
							f = ee(f, f) | 0;
							if((f | 0) != 1073741824) {
								l = (f << 1) + u | 0;
								if((f ^ u | 0) > 0 & (l ^ u | 0) < 0) {
									o[s >> 2] = 1;
									u = (u >>> 31) + 2147483647 | 0
								} else u = l
							} else {
								o[s >> 2] = 1;
								u = 2147483647
							}
							c = c + 1 | 0
						} while ((c & 65535) << 16 >> 16 != a << 16 >> 16)
					} else w = 8
				} else {
					f = 0;
					w = 8
				}
				if((w | 0) == 8) u = f >> 4;
				if(!u) {
					i[e >> 1] = 0;
					return
				}
				E = ((vi(u) | 0) & 65535) + 65535 | 0;
				f = E << 16 >> 16;
				if((E & 65535) << 16 >> 16 > 0) {
					l = u << f;
					if((l >> f | 0) == (u | 0)) u = l;
					else u = u >> 31 ^ 2147483647
				} else {
					f = 0 - f << 16;
					if((f | 0) < 2031616) u = u >> (f >> 16);
					else u = 0
				}
				h = Ni(u, s) | 0;
				l = o[s >> 2] | 0;
				if(m) {
					f = 0;
					u = 0;
					do {
						d = i[r + (f << 1) >> 1] | 0;
						d = ee(d, d) | 0;
						if((d | 0) != 1073741824) {
							c = (d << 1) + u | 0;
							if((d ^ u | 0) > 0 & (c ^ u | 0) < 0) {
								o[s >> 2] = 1;
								u = (u >>> 31) + 2147483647 | 0
							} else u = c
						} else {
							o[s >> 2] = 1;
							u = 2147483647
						}
						f = f + 1 | 0
					} while ((f & 65535) << 16 >> 16 != a << 16 >> 16);
					if((u | 0) == 2147483647) {
						o[s >> 2] = l;
						d = 0;
						u = 0;
						do {
							c = i[r + (d << 1) >> 1] >> 2;
							c = ee(c, c) | 0;
							if((c | 0) != 1073741824) {
								f = (c << 1) + u | 0;
								if((c ^ u | 0) > 0 & (f ^ u | 0) < 0) {
									o[s >> 2] = 1;
									u = (u >>> 31) + 2147483647 | 0
								} else u = f
							} else {
								o[s >> 2] = 1;
								u = 2147483647
							}
							d = d + 1 | 0
						} while ((d & 65535) << 16 >> 16 != a << 16 >> 16)
					} else w = 29
				} else {
					u = 0;
					w = 29
				}
				if((w | 0) == 29) u = u >> 4;
				if(!u) c = 0;
				else {
					f = (vi(u) | 0) << 16 >> 16;
					l = E - f | 0;
					c = l & 65535;
					u = (Gt(h, Ni(u << f, s) | 0) | 0) << 16 >> 16;
					f = u << 7;
					l = l << 16 >> 16;
					if(c << 16 >> 16 > 0) l = c << 16 >> 16 < 31 ? f >> l : 0;
					else {
						w = 0 - l << 16 >> 16;
						l = f << w;
						l = (l >> w | 0) == (f | 0) ? l : u >> 24 ^ 2147483647
					}
					c = (ee(((ai(l, s) | 0) << 9) + 32768 >> 16, 32767 - (t & 65535) << 16 >> 16) | 0) >>> 15 << 16 >> 16
				}
				l = i[e >> 1] | 0;
				if(m) {
					u = t << 16 >> 16;
					f = 0;
					while(1) {
						t = ((ee(l << 16 >> 16, u) | 0) >>> 15 & 65535) + c | 0;
						l = t & 65535;
						i[n >> 1] = (ee(i[n >> 1] | 0, t << 16 >> 16) | 0) >>> 12;
						f = f + 1 << 16 >> 16;
						if(f << 16 >> 16 >= a << 16 >> 16) break;
						else n = n + 2 | 0
					}
				}
				i[e >> 1] = l;
				return
			}

			function Ne(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var a = 0,
					s = 0,
					l = 0,
					f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0;
				l = o[t >> 2] | 0;
				a = n << 16 >> 16 > 0;
				if(a) {
					f = 0;
					s = 0;
					do {
						c = i[r + (f << 1) >> 1] | 0;
						c = ee(c, c) | 0;
						if((c | 0) != 1073741824) {
							u = (c << 1) + s | 0;
							if((c ^ s | 0) > 0 & (u ^ s | 0) < 0) {
								o[t >> 2] = 1;
								s = (s >>> 31) + 2147483647 | 0
							} else s = u
						} else {
							o[t >> 2] = 1;
							s = 2147483647
						}
						f = f + 1 | 0
					} while ((f & 65535) << 16 >> 16 != n << 16 >> 16);
					if((s | 0) == 2147483647) {
						o[t >> 2] = l;
						c = 0;
						l = 0;
						do {
							u = i[r + (c << 1) >> 1] >> 2;
							u = ee(u, u) | 0;
							if((u | 0) != 1073741824) {
								f = (u << 1) + l | 0;
								if((u ^ l | 0) > 0 & (f ^ l | 0) < 0) {
									o[t >> 2] = 1;
									l = (l >>> 31) + 2147483647 | 0
								} else l = f
							} else {
								o[t >> 2] = 1;
								l = 2147483647
							}
							c = c + 1 | 0
						} while ((c & 65535) << 16 >> 16 != n << 16 >> 16)
					} else E = 8
				} else {
					s = 0;
					E = 8
				}
				if((E | 0) == 8) l = s >> 4;
				if(!l) return;
				h = ((vi(l) | 0) & 65535) + 65535 | 0;
				u = h << 16 >> 16;
				if((h & 65535) << 16 >> 16 > 0) {
					f = l << u;
					if((f >> u | 0) == (l | 0)) l = f;
					else l = l >> 31 ^ 2147483647
				} else {
					u = 0 - u << 16;
					if((u | 0) < 2031616) l = l >> (u >> 16);
					else l = 0
				}
				d = Ni(l, t) | 0;
				l = o[t >> 2] | 0;
				if(a) {
					f = 0;
					s = 0;
					do {
						c = i[e + (f << 1) >> 1] | 0;
						c = ee(c, c) | 0;
						if((c | 0) != 1073741824) {
							u = (c << 1) + s | 0;
							if((c ^ s | 0) > 0 & (u ^ s | 0) < 0) {
								o[t >> 2] = 1;
								s = (s >>> 31) + 2147483647 | 0
							} else s = u
						} else {
							o[t >> 2] = 1;
							s = 2147483647
						}
						f = f + 1 | 0
					} while ((f & 65535) << 16 >> 16 != n << 16 >> 16);
					if((s | 0) == 2147483647) {
						o[t >> 2] = l;
						l = 0;
						f = 0;
						do {
							c = i[e + (l << 1) >> 1] >> 2;
							c = ee(c, c) | 0;
							if((c | 0) != 1073741824) {
								u = (c << 1) + f | 0;
								if((c ^ f | 0) > 0 & (u ^ f | 0) < 0) {
									o[t >> 2] = 1;
									f = (f >>> 31) + 2147483647 | 0
								} else f = u
							} else {
								o[t >> 2] = 1;
								f = 2147483647
							}
							l = l + 1 | 0
						} while ((l & 65535) << 16 >> 16 != n << 16 >> 16)
					} else E = 28
				} else {
					s = 0;
					E = 28
				}
				if((E | 0) == 28) f = s >> 4;
				if(!f) a = 0;
				else {
					c = vi(f) | 0;
					u = c << 16 >> 16;
					if(c << 16 >> 16 > 0) {
						l = f << u;
						if((l >> u | 0) == (f | 0)) f = l;
						else f = f >> 31 ^ 2147483647
					} else {
						u = 0 - u << 16;
						if((u | 0) < 2031616) f = f >> (u >> 16);
						else f = 0
					}
					l = h - (c & 65535) | 0;
					u = l & 65535;
					s = (Gt(d, Ni(f, t) | 0) | 0) << 16 >> 16;
					a = s << 7;
					l = l << 16 >> 16;
					if(u << 16 >> 16 > 0) a = u << 16 >> 16 < 31 ? a >> l : 0;
					else {
						h = 0 - l << 16 >> 16;
						e = a << h;
						a = (e >> h | 0) == (a | 0) ? e : s >> 24 ^ 2147483647
					}
					a = ai(a, t) | 0;
					if((a | 0) > 4194303) a = 2147483647;
					else a = (a | 0) < -4194304 ? -2147483648 : a << 9;
					a = Ni(a, t) | 0
				}
				s = (n & 65535) + 65535 & 65535;
				if(s << 16 >> 16 <= -1) return;
				c = a << 16 >> 16;
				u = n + -1 << 16 >> 16 << 16 >> 16;
				while(1) {
					l = r + (u << 1) | 0;
					a = ee(i[l >> 1] | 0, c) | 0;
					do
						if((a | 0) != 1073741824) {
							f = a << 1;
							if((f | 0) <= 268435455)
								if((f | 0) < -268435456) {
									i[l >> 1] = -32768;
									break
								} else {
									i[l >> 1] = a >>> 12;
									break
								}
							else E = 52
						} else {
							o[t >> 2] = 1;
							E = 52
						}
					while(0);
					if((E | 0) == 52) {
						E = 0;
						i[l >> 1] = 32767
					}
					s = s + -1 << 16 >> 16;
					if(s << 16 >> 16 <= -1) break;
					else u = u + -1 | 0
				}
				return
			}

			function Pe(e, r, n, t, a) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				var s = 0,
					l = 0,
					f = 0,
					u = 0;
				u = c;
				c = c + 496 | 0;
				f = u;
				l = (a | 0) == 2;
				do
					if(!(l & 1 | (a | 0) == 4)) {
						if(a) {
							e = -1;
							c = u;
							return e | 0
						}
						l = i[n >> 1] | 0;
						r = n + 490 | 0;
						a = n + 2 | 0;
						s = 0;
						while(1) {
							i[f + (s << 1) >> 1] = i[a >> 1] | 0;
							s = s + 1 | 0;
							if((s | 0) == 244) break;
							else a = a + 2 | 0
						}
						s = l << 16 >> 16;
						if(l << 16 >> 16 == 7) {
							a = 492;
							r = o[e + 1760 >> 2] | 0;
							break
						} else {
							a = 492;
							r = i[r >> 1] | 0;
							break
						}
					} else {
						s = e + 1168 | 0;
						if(l) {
							Ir(r, n, f, s);
							s = 604
						} else {
							pr(r, n, f, s);
							s = 3436
						}
						a = i[s + (r << 1) >> 1] | 0;
						do
							if(r >>> 0 >= 8) {
								if((r | 0) == 8) {
									r = i[f + 76 >> 1] << 2 | (i[f + 74 >> 1] << 1 | i[f + 72 >> 1]);
									s = (i[f + 70 >> 1] | 0) == 0 ? 4 : 5;
									break
								}
								if(r >>> 0 < 15) {
									e = -1;
									c = u;
									return e | 0
								} else {
									r = o[e + 1760 >> 2] | 0;
									s = 7;
									break
								}
							} else s = 0;
						while(0);
						if(a << 16 >> 16 == -1) {
							e = -1;
							c = u;
							return e | 0
						}
					}
				while(0);
				Cr(e, r, f, s, t);
				o[e + 1760 >> 2] = r;
				e = a;
				c = u;
				return e | 0
			}

			function Ce(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					a = 0,
					l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0;
				v = c;
				c = c + 48 | 0;
				S = v + 20 | 0;
				p = v;
				a = S;
				t = a + 20 | 0;
				do {
					i[a >> 1] = i[e >> 1] | 0;
					a = a + 2 | 0;
					e = e + 2 | 0
				} while ((a | 0) < (t | 0));
				e = i[S + 18 >> 1] | 0;
				m = (e & 65535) - ((e & 65535) >>> 15 & 65535) | 0;
				e: do
					if(((m << 16 >> 31 ^ m) & 65535) << 16 >> 16 <= 4095) {
						t = 9;
						m = 9;
						while(1) {
							e = e << 16 >> 16;
							e = (e << 19 >> 19 | 0) == (e | 0) ? e << 3 : e >>> 15 ^ 32767;
							w = r + (t << 1) | 0;
							i[w >> 1] = e;
							e = e << 16 >> 16;
							e = ee(e, e) | 0;
							if((e | 0) == 1073741824) {
								o[n >> 2] = 1;
								a = 2147483647
							} else a = e << 1;
							e = 2147483647 - a | 0;
							if((e & a | 0) < 0) {
								o[n >> 2] = 1;
								e = 2147483647
							}
							h = vi(e) | 0;
							E = 15 - (h & 65535) & 65535;
							l = h << 16 >> 16;
							if(h << 16 >> 16 > 0) {
								a = e << l;
								if((a >> l | 0) != (e | 0)) a = e >> 31 ^ 2147483647
							} else {
								a = 0 - l << 16;
								if((a | 0) < 2031616) a = e >> (a >> 16);
								else a = 0
							}
							a = Gt(16384, Ni(a, n) | 0) | 0;
							do
								if(m << 16 >> 16 > 0) {
									h = t + -1 | 0;
									f = a << 16 >> 16;
									u = m << 16 >> 16;
									d = 0;
									while(1) {
										t = s[S + (d << 1) >> 1] | 0;
										e = t << 16;
										l = ee(i[S + (h - d << 1) >> 1] | 0, i[w >> 1] | 0) | 0;
										if((l | 0) == 1073741824) {
											o[n >> 2] = 1;
											a = 2147483647
										} else a = l << 1;
										l = e - a | 0;
										if(((l ^ e) & (a ^ e) | 0) < 0) {
											o[n >> 2] = 1;
											l = (t >>> 15) + 2147483647 | 0
										}
										l = ee((Ni(l, n) | 0) << 16 >> 16, f) | 0;
										if((l | 0) == 1073741824) {
											o[n >> 2] = 1;
											l = 2147483647
										} else l = l << 1;
										l = ui(l, E, n) | 0;
										a = l - (l >>> 31) | 0;
										if((a >> 31 ^ a | 0) > 32767) {
											l = 24;
											break
										}
										i[p + (d << 1) >> 1] = l;
										d = d + 1 | 0;
										if((u | 0) <= (d | 0)) {
											l = 26;
											break
										}
									}
									if((l | 0) == 24) {
										l = 0;
										a = r;
										t = a + 20 | 0;
										do {
											i[a >> 1] = 0;
											a = a + 2 | 0
										} while ((a | 0) < (t | 0));
										e = 10
									} else if((l | 0) == 26) {
										l = 0;
										if(m << 16 >> 16 > 0) e = m;
										else {
											l = 28;
											break
										}
									}
									a = e + -1 << 16 >> 16;
									Vi(S | 0, p | 0, ((a & 65535) << 1) + 2 | 0) | 0;
									t = a << 16 >> 16
								} else l = 28;
							while(0);
							if((l | 0) == 28) {
								e = m + -1 << 16 >> 16;
								if(e << 16 >> 16 > -1) {
									t = e << 16 >> 16;
									a = 32767
								} else break
							}
							e = i[S + (t << 1) >> 1] | 0;
							m = (e & 65535) - ((e & 65535) >>> 15 & 65535) | 0;
							if(((m << 16 >> 31 ^ m) & 65535) << 16 >> 16 > 4095) break e;
							else m = a
						}
						c = v;
						return
					}
				while(0);
				a = r;
				t = a + 20 | 0;
				do {
					i[a >> 1] = 0;
					a = a + 2 | 0
				} while ((a | 0) < (t | 0));
				c = v;
				return
			}

			function Ie(e, r) {
				e = e | 0;
				r = r | 0;
				var n = 0,
					t = 0,
					i = 0,
					a = 0,
					s = 0;
				if(r << 16 >> 16 <= 0) {
					e = 0;
					return e | 0
				}
				t = o[e >> 2] | 0;
				i = 0;
				n = 0;
				do {
					s = t & 1;
					n = s | n << 1 & 131070;
					a = t >> 1;
					t = (s | 0) == (t >>> 28 & 1 | 0) ? a : a | 1073741824;
					i = i + 1 << 16 >> 16
				} while (i << 16 >> 16 < r << 16 >> 16);
				o[e >> 2] = t;
				s = n & 65535;
				return s | 0
			}

			function Be(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					a = 0,
					s = 0,
					l = 0,
					f = 0,
					u = 0;
				a = r;
				t = a + 80 | 0;
				do {
					i[a >> 1] = 0;
					a = a + 2 | 0
				} while ((a | 0) < (t | 0));
				t = 0;
				a = o[e >> 2] | 0;
				do {
					u = a & 1;
					f = a >> 1;
					f = (u | 0) == (a >>> 28 & 1 | 0) ? f : f | 1073741824;
					s = f & 1;
					l = f >> 1;
					o[e >> 2] = (s | 0) == (f >>> 28 & 1 | 0) ? l : l | 1073741824;
					s = Wt((ee(u << 1 | s, 1310720) | 0) >>> 17 & 65535, t, n) | 0;
					u = o[e >> 2] | 0;
					l = u & 1;
					f = u >> 1;
					a = (l | 0) == (u >>> 28 & 1 | 0) ? f : f | 1073741824;
					o[e >> 2] = a;
					i[r + (s << 16 >> 16 << 1) >> 1] = ((l & 65535) << 13 & 65535) + -4096 << 16 >> 16;
					t = t + 1 << 16 >> 16
				} while (t << 16 >> 16 < 10);
				return
			}

			function Le(e, r, n, t, a, l) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				l = l | 0;
				var f = 0,
					u = 0;
				f = i[e >> 1] | 0;
				if((f * 31821 | 0) == 1073741824) {
					o[l >> 2] = 1;
					u = 1073741823
				} else u = f * 63642 >> 1;
				f = u + 13849 | 0;
				if((u | 0) > -1 & (f ^ u | 0) < 0) {
					o[l >> 2] = 1;
					f = (u >>> 31) + 2147483647 | 0
				}
				i[e >> 1] = f;
				if(r << 16 >> 16 <= 0) return;
				u = 0;
				f = a + ((f & 127) << 1) | 0;
				while(1) {
					i[t + (u << 1) >> 1] = (-65536 << i[n + (u << 1) >> 1] >>> 16 ^ 65535) & s[f >> 1];
					u = u + 1 | 0;
					if((u & 65535) << 16 >> 16 == r << 16 >> 16) break;
					else f = f + 2 | 0
				}
				return
			}

			function Ue(e) {
				e = e | 0;
				var r = 0;
				if(!e) {
					r = -1;
					return r | 0
				}
				r = e + 122 | 0;
				do {
					i[e >> 1] = 0;
					e = e + 2 | 0
				} while ((e | 0) < (r | 0));
				r = 0;
				return r | 0
			}

			function xe(e, r, n, t, a) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				var l = 0,
					f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0;
				u = 159;
				f = 0;
				while(1) {
					d = i[n + (u << 1) >> 1] | 0;
					d = ee(d, d) | 0;
					d = (d | 0) == 1073741824 ? 2147483647 : d << 1;
					l = d + f | 0;
					if((d ^ f | 0) > -1 & (l ^ f | 0) < 0) {
						o[a >> 2] = 1;
						f = (f >>> 31) + 2147483647 | 0
					} else f = l;
					if((u | 0) > 0) u = u + -1 | 0;
					else {
						u = f;
						break
					}
				}
				a = u >>> 14 & 65535;
				f = 32767;
				l = 59;
				while(1) {
					d = i[e + (l << 1) >> 1] | 0;
					f = d << 16 >> 16 < f << 16 >> 16 ? d : f;
					if((l | 0) > 0) l = l + -1 | 0;
					else break
				}
				d = (u | 0) > 536870911 ? 32767 : a;
				a = f << 16 >> 16;
				l = a << 20 >> 16;
				u = f << 16 >> 16 > 0 ? 32767 : -32768;
				n = 55;
				f = i[e >> 1] | 0;
				while(1) {
					c = i[e + (n << 1) >> 1] | 0;
					f = f << 16 >> 16 < c << 16 >> 16 ? c : f;
					if((n | 0) > 1) n = n + -1 | 0;
					else break
				}
				n = i[e + 80 >> 1] | 0;
				c = i[e + 82 >> 1] | 0;
				n = n << 16 >> 16 < c << 16 >> 16 ? c : n;
				c = i[e + 84 >> 1] | 0;
				n = n << 16 >> 16 < c << 16 >> 16 ? c : n;
				c = i[e + 86 >> 1] | 0;
				n = n << 16 >> 16 < c << 16 >> 16 ? c : n;
				c = i[e + 88 >> 1] | 0;
				n = n << 16 >> 16 < c << 16 >> 16 ? c : n;
				c = i[e + 90 >> 1] | 0;
				n = n << 16 >> 16 < c << 16 >> 16 ? c : n;
				c = i[e + 92 >> 1] | 0;
				n = n << 16 >> 16 < c << 16 >> 16 ? c : n;
				c = i[e + 94 >> 1] | 0;
				n = n << 16 >> 16 < c << 16 >> 16 ? c : n;
				c = i[e + 96 >> 1] | 0;
				n = n << 16 >> 16 < c << 16 >> 16 ? c : n;
				c = i[e + 98 >> 1] | 0;
				n = n << 16 >> 16 < c << 16 >> 16 ? c : n;
				c = i[e + 100 >> 1] | 0;
				n = n << 16 >> 16 < c << 16 >> 16 ? c : n;
				c = i[e + 102 >> 1] | 0;
				n = n << 16 >> 16 < c << 16 >> 16 ? c : n;
				c = i[e + 104 >> 1] | 0;
				n = n << 16 >> 16 < c << 16 >> 16 ? c : n;
				c = i[e + 106 >> 1] | 0;
				n = n << 16 >> 16 < c << 16 >> 16 ? c : n;
				c = i[e + 108 >> 1] | 0;
				n = n << 16 >> 16 < c << 16 >> 16 ? c : n;
				c = i[e + 110 >> 1] | 0;
				n = n << 16 >> 16 < c << 16 >> 16 ? c : n;
				c = i[e + 112 >> 1] | 0;
				n = n << 16 >> 16 < c << 16 >> 16 ? c : n;
				c = i[e + 114 >> 1] | 0;
				n = n << 16 >> 16 < c << 16 >> 16 ? c : n;
				c = i[e + 116 >> 1] | 0;
				n = n << 16 >> 16 < c << 16 >> 16 ? c : n;
				c = e + 118 | 0;
				E = i[c >> 1] | 0;
				do
					if((d + -21 & 65535) < 17557 & f << 16 >> 16 > 20 ? (d << 16 >> 16 | 0) < (((a << 4 | 0) == (l | 0) ? l : u) | 0) ? 1 : (n << 16 >> 16 < E << 16 >> 16 ? E : n) << 16 >> 16 < 1953 : 0) {
						f = e + 120 | 0;
						l = i[f >> 1] | 0;
						if(l << 16 >> 16 > 29) {
							i[f >> 1] = 30;
							n = f;
							u = 1;
							break
						} else {
							u = (l & 65535) + 1 & 65535;
							i[f >> 1] = u;
							n = f;
							u = u << 16 >> 16 > 1 & 1;
							break
						}
					} else h = 14;
				while(0);
				if((h | 0) == 14) {
					n = e + 120 | 0;
					i[n >> 1] = 0;
					u = 0
				}
				f = 0;
				do {
					E = f;
					f = f + 1 | 0;
					i[e + (E << 1) >> 1] = i[e + (f << 1) >> 1] | 0
				} while ((f | 0) != 59);
				i[c >> 1] = d;
				f = i[n >> 1] | 0;
				f = f << 16 >> 16 > 15 ? 16383 : f << 16 >> 16 > 8 ? 15565 : 13926;
				l = ri(r + 8 | 0, 5) | 0;
				if((i[n >> 1] | 0) > 20) {
					if(((ri(r, 9) | 0) << 16 >> 16 | 0) > (f | 0)) h = 20
				} else if((l << 16 >> 16 | 0) > (f | 0)) h = 20;
				if((h | 0) == 20) {
					i[t >> 1] = 0;
					return u | 0
				}
				l = (s[t >> 1] | 0) + 1 & 65535;
				if(l << 16 >> 16 > 10) {
					i[t >> 1] = 10;
					return u | 0
				} else {
					i[t >> 1] = l;
					return u | 0
				}
				return 0
			}

			function He(e) {
				e = e | 0;
				var r = 0;
				if(!e) {
					r = -1;
					return r | 0
				}
				r = e + 18 | 0;
				do {
					i[e >> 1] = 0;
					e = e + 2 | 0
				} while ((e | 0) < (r | 0));
				r = 0;
				return r | 0
			}

			function ze(e, r, n, t, a, l, f, u, c, d, h, E) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				c = c | 0;
				d = d | 0;
				h = h | 0;
				E = E | 0;
				var w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0;
				M = e + 2 | 0;
				i[e >> 1] = i[M >> 1] | 0;
				g = e + 4 | 0;
				i[M >> 1] = i[g >> 1] | 0;
				R = e + 6 | 0;
				i[g >> 1] = i[R >> 1] | 0;
				y = e + 8 | 0;
				i[R >> 1] = i[y >> 1] | 0;
				O = e + 10 | 0;
				i[y >> 1] = i[O >> 1] | 0;
				A = e + 12 | 0;
				i[O >> 1] = i[A >> 1] | 0;
				i[A >> 1] = n;
				v = 0;
				F = 0;
				do {
					w = a + (F << 1) | 0;
					S = Bi(i[w >> 1] | 0, i[t + (F << 1) >> 1] | 0, E) | 0;
					S = (S & 65535) - ((S & 65535) >>> 15 & 65535) | 0;
					S = S << 16 >> 31 ^ S;
					k = ((_i(S & 65535) | 0) & 65535) + 65535 | 0;
					m = k << 16 >> 16;
					if((k & 65535) << 16 >> 16 < 0) {
						p = 0 - m << 16;
						if((p | 0) < 983040) _ = S << 16 >> 16 >> (p >> 16) & 65535;
						else _ = 0
					} else {
						p = S << 16 >> 16;
						S = p << m;
						if((S << 16 >> 16 >> m | 0) == (p | 0)) _ = S & 65535;
						else _ = (p >>> 15 ^ 32767) & 65535
					}
					b = _i(i[w >> 1] | 0) | 0;
					S = i[w >> 1] | 0;
					m = b << 16 >> 16;
					if(b << 16 >> 16 < 0) {
						p = 0 - m << 16;
						if((p | 0) < 983040) p = S << 16 >> 16 >> (p >> 16) & 65535;
						else p = 0
					} else {
						p = S << 16 >> 16;
						S = p << m;
						if((S << 16 >> 16 >> m | 0) == (p | 0)) p = S & 65535;
						else p = (p >>> 15 ^ 32767) & 65535
					}
					m = Gt(_, p) | 0;
					p = (k & 65535) + 2 - (b & 65535) | 0;
					S = p & 65535;
					do
						if(p & 32768) {
							if(S << 16 >> 16 != -32768) {
								k = 0 - p | 0;
								p = k << 16 >> 16;
								if((k & 65535) << 16 >> 16 < 0) {
									p = 0 - p << 16;
									if((p | 0) >= 983040) {
										p = 0;
										break
									}
									p = m << 16 >> 16 >> (p >> 16) & 65535;
									break
								}
							} else p = 32767;
							S = m << 16 >> 16;
							m = S << p;
							if((m << 16 >> 16 >> p | 0) == (S | 0)) p = m & 65535;
							else p = (S >>> 15 ^ 32767) & 65535
						} else p = Pi(m, S, E) | 0;
					while(0);
					v = Wt(v, p, E) | 0;
					F = F + 1 | 0
				} while ((F | 0) != 10);
				p = v & 65535;
				S = v << 16 >> 16 > 5325;
				v = e + 14 | 0;
				if(S) {
					a = (s[v >> 1] | 0) + 1 & 65535;
					i[v >> 1] = a;
					if(a << 16 >> 16 > 10) i[e + 16 >> 1] = 0
				} else i[v >> 1] = 0;
				switch(r | 0) {
					case 0:
					case 1:
					case 2:
					case 3:
					case 6:
						break;
					default:
						{
							A = e + 16 | 0;E = n;n = i[A >> 1] | 0;n = n & 65535;n = n + 1 | 0;n = n & 65535;i[A >> 1] = n;
							return E | 0
						}
				}
				_ = (f | l) << 16 >> 16 == 0;
				b = d << 16 >> 16 == 0;
				k = r >>> 0 < 3;
				v = p + (k & ((b | (_ & (u << 16 >> 16 == 0 | c << 16 >> 16 == 0) | h << 16 >> 16 < 2)) ^ 1) ? 61030 : 62259) & 65535;
				v = v << 16 >> 16 > 0 ? v : 0;
				if(v << 16 >> 16 <= 2048) {
					v = v << 16 >> 16;
					if((v << 18 >> 18 | 0) == (v | 0)) c = v << 2;
					else c = v >>> 15 ^ 32767
				} else c = 8192;
				u = e + 16 | 0;
				h = S | (i[u >> 1] | 0) < 40;
				v = i[g >> 1] | 0;
				if((v * 6554 | 0) == 1073741824) {
					o[E >> 2] = 1;
					S = 2147483647
				} else S = v * 13108 | 0;
				v = i[R >> 1] | 0;
				p = v * 6554 | 0;
				if((p | 0) != 1073741824) {
					v = (v * 13108 | 0) + S | 0;
					if((p ^ S | 0) > 0 & (v ^ S | 0) < 0) {
						o[E >> 2] = 1;
						v = (S >>> 31) + 2147483647 | 0
					}
				} else {
					o[E >> 2] = 1;
					v = 2147483647
				}
				p = i[y >> 1] | 0;
				S = p * 6554 | 0;
				if((S | 0) != 1073741824) {
					p = (p * 13108 | 0) + v | 0;
					if((S ^ v | 0) > 0 & (p ^ v | 0) < 0) {
						o[E >> 2] = 1;
						p = (v >>> 31) + 2147483647 | 0
					}
				} else {
					o[E >> 2] = 1;
					p = 2147483647
				}
				v = i[O >> 1] | 0;
				S = v * 6554 | 0;
				if((S | 0) != 1073741824) {
					v = (v * 13108 | 0) + p | 0;
					if((S ^ p | 0) > 0 & (v ^ p | 0) < 0) {
						o[E >> 2] = 1;
						S = (p >>> 31) + 2147483647 | 0
					} else S = v
				} else {
					o[E >> 2] = 1;
					S = 2147483647
				}
				v = i[A >> 1] | 0;
				p = v * 6554 | 0;
				if((p | 0) != 1073741824) {
					v = (v * 13108 | 0) + S | 0;
					if((p ^ S | 0) > 0 & (v ^ S | 0) < 0) {
						o[E >> 2] = 1;
						v = (S >>> 31) + 2147483647 | 0
					}
				} else {
					o[E >> 2] = 1;
					v = 2147483647
				}
				S = Ni(v, E) | 0;
				if(k & ((_ | b) ^ 1)) {
					v = i[e >> 1] | 0;
					if((v * 4681 | 0) == 1073741824) {
						o[E >> 2] = 1;
						S = 2147483647
					} else S = v * 9362 | 0;
					v = i[M >> 1] | 0;
					p = v * 4681 | 0;
					if((p | 0) != 1073741824) {
						v = (v * 9362 | 0) + S | 0;
						if((p ^ S | 0) > 0 & (v ^ S | 0) < 0) {
							o[E >> 2] = 1;
							S = (S >>> 31) + 2147483647 | 0
						} else S = v
					} else {
						o[E >> 2] = 1;
						S = 2147483647
					}
					v = i[g >> 1] | 0;
					p = v * 4681 | 0;
					if((p | 0) != 1073741824) {
						v = (v * 9362 | 0) + S | 0;
						if((p ^ S | 0) > 0 & (v ^ S | 0) < 0) {
							o[E >> 2] = 1;
							S = (S >>> 31) + 2147483647 | 0
						} else S = v
					} else {
						o[E >> 2] = 1;
						S = 2147483647
					}
					v = i[R >> 1] | 0;
					p = v * 4681 | 0;
					if((p | 0) != 1073741824) {
						v = (v * 9362 | 0) + S | 0;
						if((p ^ S | 0) > 0 & (v ^ S | 0) < 0) {
							o[E >> 2] = 1;
							v = (S >>> 31) + 2147483647 | 0
						}
					} else {
						o[E >> 2] = 1;
						v = 2147483647
					}
					p = i[y >> 1] | 0;
					S = p * 4681 | 0;
					if((S | 0) != 1073741824) {
						p = (p * 9362 | 0) + v | 0;
						if((S ^ v | 0) > 0 & (p ^ v | 0) < 0) {
							o[E >> 2] = 1;
							v = (v >>> 31) + 2147483647 | 0
						} else v = p
					} else {
						o[E >> 2] = 1;
						v = 2147483647
					}
					p = i[O >> 1] | 0;
					S = p * 4681 | 0;
					if((S | 0) != 1073741824) {
						p = (p * 9362 | 0) + v | 0;
						if((S ^ v | 0) > 0 & (p ^ v | 0) < 0) {
							o[E >> 2] = 1;
							p = (v >>> 31) + 2147483647 | 0
						}
					} else {
						o[E >> 2] = 1;
						p = 2147483647
					}
					S = i[A >> 1] | 0;
					w = S * 4681 | 0;
					if((w | 0) != 1073741824) {
						m = (S * 9362 | 0) + p | 0;
						if((w ^ p | 0) > 0 & (m ^ p | 0) < 0) {
							o[E >> 2] = 1;
							m = (p >>> 31) + 2147483647 | 0
						}
					} else {
						o[E >> 2] = 1;
						m = 2147483647
					}
					S = Ni(m, E) | 0
				}
				v = h ? 8192 : c << 16 >> 16;
				w = ee(v, n << 16 >> 16) | 0;
				if((w | 0) == 1073741824) {
					o[E >> 2] = 1;
					p = 2147483647
				} else p = w << 1;
				S = S << 16 >> 16;
				m = S << 13;
				if((m | 0) != 1073741824) {
					w = p + (S << 14) | 0;
					if((p ^ m | 0) > 0 & (w ^ p | 0) < 0) {
						o[E >> 2] = 1;
						p = (p >>> 31) + 2147483647 | 0
					} else p = w
				} else {
					o[E >> 2] = 1;
					p = 2147483647
				}
				w = ee(S, v) | 0;
				if((w | 0) == 1073741824) {
					o[E >> 2] = 1;
					m = 2147483647
				} else m = w << 1;
				w = p - m | 0;
				if(((w ^ p) & (m ^ p) | 0) < 0) {
					o[E >> 2] = 1;
					w = (p >>> 31) + 2147483647 | 0
				}
				A = w << 2;
				n = u;
				E = Ni((A >> 2 | 0) == (w | 0) ? A : w >> 31 ^ 2147483647, E) | 0;
				A = i[n >> 1] | 0;
				A = A & 65535;
				A = A + 1 | 0;
				A = A & 65535;
				i[n >> 1] = A;
				return E | 0
			}

			function je(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					o = 0,
					a = 0,
					l = 0;
				t = r;
				o = t + 80 | 0;
				do {
					i[t >> 1] = 0;
					t = t + 2 | 0
				} while ((t | 0) < (o | 0));
				t = 0;
				do {
					l = i[e + (t << 1) >> 1] | 0;
					o = ((l & 8) << 10 & 65535 ^ 8192) + -4096 << 16 >> 16;
					a = t << 16;
					l = ((i[n + ((l & 7) << 1) >> 1] | 0) * 327680 | 0) + a >> 16;
					i[r + (l << 1) >> 1] = o;
					a = ((i[n + ((s[e + (t + 5 << 1) >> 1] & 7) << 1) >> 1] | 0) * 327680 | 0) + a >> 16;
					if((a | 0) < (l | 0)) o = 0 - (o & 65535) & 65535;
					l = r + (a << 1) | 0;
					i[l >> 1] = (s[l >> 1] | 0) + (o & 65535);
					t = t + 1 | 0
				} while ((t | 0) != 5);
				return
			}

			function Ye(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					o = 0,
					a = 0;
				o = r << 16 >> 16;
				t = (o << 1 & 2 | 1) + ((o >>> 1 & 7) * 5 | 0) | 0;
				r = o >>> 4 & 3;
				r = ((o >>> 6 & 7) * 5 | 0) + ((r | 0) == 3 ? 4 : r) | 0;
				o = n;
				a = o + 80 | 0;
				do {
					i[o >> 1] = 0;
					o = o + 2 | 0
				} while ((o | 0) < (a | 0));
				e = e << 16 >> 16;
				i[n + (t << 1) >> 1] = (0 - (e & 1) & 16383) + 57344;
				i[n + (r << 1) >> 1] = (0 - (e >>> 1 & 1) & 16383) + 57344;
				return
			}

			function Ve(e, r, n, t, o, a) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				a = a | 0;
				var l = 0,
					f = 0;
				a = n << 16 >> 16;
				f = a >>> 3;
				e = e << 16 >> 16;
				e = ((e << 17 >> 17 | 0) == (e | 0) ? e << 1 : e >>> 15 ^ 32767) + (f & 8) << 16;
				f = (s[t + (e + 65536 >> 16 << 1) >> 1] | 0) + ((f & 7) * 5 | 0) | 0;
				n = r << 16 >> 16;
				l = (0 - (n & 1) & 16383) + 57344 & 65535;
				e = o + ((s[t + (e >> 16 << 1) >> 1] | 0) + ((a & 7) * 5 | 0) << 16 >> 16 << 1) | 0;
				r = o;
				a = r + 80 | 0;
				do {
					i[r >> 1] = 0;
					r = r + 2 | 0
				} while ((r | 0) < (a | 0));
				i[e >> 1] = l;
				i[o + (f << 16 >> 16 << 1) >> 1] = (0 - (n >>> 1 & 1) & 16383) + 57344;
				return
			}

			function qe(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					o = 0,
					a = 0,
					s = 0;
				r = r << 16 >> 16;
				t = (r & 7) * 5 | 0;
				o = (r >>> 2 & 2 | 1) + ((r >>> 4 & 7) * 5 | 0) | 0;
				r = (r >>> 6 & 2) + 2 + ((r >>> 8 & 7) * 5 | 0) | 0;
				a = n;
				s = a + 80 | 0;
				do {
					i[a >> 1] = 0;
					a = a + 2 | 0
				} while ((a | 0) < (s | 0));
				e = e << 16 >> 16;
				i[n + (t << 1) >> 1] = (0 - (e & 1) & 16383) + 57344;
				i[n + (o << 1) >> 1] = (0 - (e >>> 1 & 1) & 16383) + 57344;
				i[n + (r << 1) >> 1] = (0 - (e >>> 2 & 1) & 16383) + 57344;
				return
			}

			function Ke(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var o = 0,
					a = 0,
					s = 0,
					l = 0;
				r = r << 16 >> 16;
				s = i[n + ((r & 7) << 1) >> 1] | 0;
				l = i[n + ((r >>> 3 & 7) << 1) >> 1] | 0;
				a = i[n + ((r >>> 6 & 7) << 1) >> 1] | 0;
				n = (r >>> 9 & 1) + 3 + ((i[n + ((r >>> 10 & 7) << 1) >> 1] | 0) * 5 | 0) | 0;
				r = t;
				o = r + 80 | 0;
				do {
					i[r >> 1] = 0;
					r = r + 2 | 0
				} while ((r | 0) < (o | 0));
				e = e << 16 >> 16;
				i[t + (s * 327680 >> 16 << 1) >> 1] = (0 - (e & 1) & 16383) + 57344;
				i[t + ((l * 327680 | 0) + 65536 >> 16 << 1) >> 1] = (0 - (e >>> 1 & 1) & 16383) + 57344;
				i[t + ((a * 327680 | 0) + 131072 >> 16 << 1) >> 1] = (0 - (e >>> 2 & 1) & 16383) + 57344;
				i[t + (n << 16 >> 16 << 1) >> 1] = (0 - (e >>> 3 & 1) & 16383) + 57344;
				return
			}

			function We(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					a = 0,
					l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0;
				m = c;
				c = c + 32 | 0;
				w = m + 16 | 0;
				E = m;
				l = r;
				a = l + 80 | 0;
				do {
					i[l >> 1] = 0;
					l = l + 2 | 0
				} while ((l | 0) < (a | 0));
				a = i[e >> 1] | 0;
				i[w >> 1] = a;
				i[w + 2 >> 1] = i[e + 2 >> 1] | 0;
				i[w + 4 >> 1] = i[e + 4 >> 1] | 0;
				i[w + 6 >> 1] = i[e + 6 >> 1] | 0;
				d = i[e + 8 >> 1] | 0;
				Xe(d >>> 3 & 65535, d & 7, 0, 4, 1, E, n);
				d = i[e + 10 >> 1] | 0;
				Xe(d >>> 3 & 65535, d & 7, 2, 6, 5, E, n);
				d = i[e + 12 >> 1] | 0;
				t = d >> 2;
				do
					if((t * 25 | 0) != 1073741824) {
						l = (ee(t, 1638400) | 0) + 786432 >> 21;
						t = l * 6554 >> 15;
						if((t | 0) > 32767) {
							o[n >> 2] = 1;
							f = 1;
							u = 1;
							e = 163835;
							h = 6;
							break
						}
						e = (t << 16 >> 16) * 5 | 0;
						f = t & 1;
						if((e | 0) == 1073741824) {
							o[n >> 2] = 1;
							u = 0;
							e = 65535
						} else {
							u = 0;
							h = 6
						}
					} else {
						o[n >> 2] = 1;
						f = 0;
						t = 0;
						u = 0;
						l = 0;
						e = 0;
						h = 6
					}
				while(0);
				if((h | 0) == 6) e = e & 65535;
				h = l - e | 0;
				f = f << 16 >> 16 == 0 ? h : 4 - h | 0;
				h = f << 16 >> 16;
				i[E + 6 >> 1] = Wt(((f << 17 >> 17 | 0) == (h | 0) ? f << 1 : h >>> 15 ^ 32767) & 65535, d & 1, n) | 0;
				if(u) {
					o[n >> 2] = 1;
					t = 32767
				}
				h = t << 16 >> 16;
				i[E + 14 >> 1] = ((t << 17 >> 17 | 0) == (h | 0) ? t << 1 : h >>> 15 ^ 32767) + (d >>> 1 & 1);
				t = 0;
				while(1) {
					a = a << 16 >> 16 == 0 ? 8191 : -8191;
					h = (i[E + (t << 1) >> 1] << 2) + t << 16;
					l = h >> 16;
					if((h | 0) < 2621440) i[r + (l << 1) >> 1] = a;
					f = (i[E + (t + 4 << 1) >> 1] << 2) + t << 16;
					e = f >> 16;
					if((e | 0) < (l | 0)) a = 0 - (a & 65535) & 65535;
					if((f | 0) < 2621440) {
						h = r + (e << 1) | 0;
						i[h >> 1] = (s[h >> 1] | 0) + (a & 65535)
					}
					t = t + 1 | 0;
					if((t | 0) == 4) break;
					a = i[w + (t << 1) >> 1] | 0
				}
				c = m;
				return
			}

			function Xe(e, r, n, t, a, s, l) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				var f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0;
				u = e << 16 >> 16 > 124 ? 124 : e;
				e = (u << 16 >> 16) * 1311 >> 15;
				w = (e | 0) > 32767;
				if(!w) {
					f = e << 16 >> 16;
					if((f * 25 | 0) == 1073741824) {
						o[l >> 2] = 1;
						f = 1073741823
					} else E = 4
				} else {
					o[l >> 2] = 1;
					f = 32767;
					E = 4
				}
				if((E | 0) == 4) f = (f * 50 | 0) >>> 1;
				d = (u & 65535) - f | 0;
				f = (d << 16 >> 16) * 6554 >> 15;
				h = (f | 0) > 32767;
				if(!h) {
					u = f << 16 >> 16;
					if((u * 5 | 0) == 1073741824) {
						o[l >> 2] = 1;
						c = 1073741823
					} else E = 9
				} else {
					o[l >> 2] = 1;
					u = 32767;
					E = 9
				}
				if((E | 0) == 9) c = (u * 10 | 0) >>> 1;
				d = d - c | 0;
				E = d << 16 >> 16;
				u = r << 16 >> 16;
				c = u >> 2;
				u = u - (c << 2) | 0;
				i[s + (n << 16 >> 16 << 1) >> 1] = ((d << 17 >> 17 | 0) == (E | 0) ? d << 1 : E >>> 15 ^ 32767) + (u & 1);
				if(h) {
					o[l >> 2] = 1;
					f = 32767
				}
				n = f << 16 >> 16;
				i[s + (t << 16 >> 16 << 1) >> 1] = ((f << 17 >> 17 | 0) == (n | 0) ? f << 1 : n >>> 15 ^ 32767) + (u << 16 >> 17);
				if(w) {
					o[l >> 2] = 1;
					e = 32767
				}
				t = e << 16 >> 16;
				i[s + (a << 16 >> 16 << 1) >> 1] = Wt(c & 65535, ((e << 17 >> 17 | 0) == (t | 0) ? e << 1 : t >>> 15 ^ 32767) & 65535, l) | 0;
				return
			}

			function Ge(e) {
				e = e | 0;
				var r = 0,
					n = 0,
					t = 0,
					a = 0;
				if(!e) {
					a = -1;
					return a | 0
				}
				ei(e + 1168 | 0);
				i[e + 460 >> 1] = 40;
				o[e + 1164 >> 2] = 0;
				r = e + 646 | 0;
				n = e + 1216 | 0;
				t = e + 462 | 0;
				a = t + 22 | 0;
				do {
					i[t >> 1] = 0;
					t = t + 2 | 0
				} while ((t | 0) < (a | 0));
				ar(r, o[n >> 2] | 0) | 0;
				wr(e + 686 | 0) | 0;
				cr(e + 700 | 0) | 0;
				He(e + 608 | 0) | 0;
				_r(e + 626 | 0, o[n >> 2] | 0) | 0;
				Ue(e + 484 | 0) | 0;
				kr(e + 730 | 0) | 0;
				sr(e + 748 | 0) | 0;
				Jt(e + 714 | 0) | 0;
				Je(e, 0) | 0;
				a = 0;
				return a | 0
			}

			function Je(e, r) {
				e = e | 0;
				r = r | 0;
				var n = 0,
					t = 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				o[e + 388 >> 2] = e + 308;
				Ki(e | 0, 0, 308) | 0;
				r = (r | 0) != 8;
				if(r) {
					n = e + 412 | 0;
					t = n + 20 | 0;
					do {
						i[n >> 1] = 0;
						n = n + 2 | 0
					} while ((n | 0) < (t | 0));
					i[e + 392 >> 1] = 3e4;
					i[e + 394 >> 1] = 26e3;
					i[e + 396 >> 1] = 21e3;
					i[e + 398 >> 1] = 15e3;
					i[e + 400 >> 1] = 8e3;
					i[e + 402 >> 1] = 0;
					i[e + 404 >> 1] = -8e3;
					i[e + 406 >> 1] = -15e3;
					i[e + 408 >> 1] = -21e3;
					i[e + 410 >> 1] = -26e3
				}
				i[e + 432 >> 1] = 0;
				i[e + 434 >> 1] = 40;
				o[e + 1164 >> 2] = 0;
				i[e + 436 >> 1] = 0;
				i[e + 438 >> 1] = 0;
				i[e + 440 >> 1] = 0;
				i[e + 460 >> 1] = 40;
				i[e + 462 >> 1] = 0;
				i[e + 464 >> 1] = 0;
				if(r) {
					n = e + 442 | 0;
					t = n + 18 | 0;
					do {
						i[n >> 1] = 0;
						n = n + 2 | 0
					} while ((n | 0) < (t | 0));
					n = e + 466 | 0;
					t = n + 18 | 0;
					do {
						i[n >> 1] = 0;
						n = n + 2 | 0
					} while ((n | 0) < (t | 0));
					He(e + 608 | 0) | 0;
					t = e + 1216 | 0;
					_r(e + 626 | 0, o[t >> 2] | 0) | 0;
					ar(e + 646 | 0, o[t >> 2] | 0) | 0;
					wr(e + 686 | 0) | 0;
					cr(e + 700 | 0) | 0;
					Jt(e + 714 | 0) | 0
				} else {
					n = e + 466 | 0;
					t = n + 18 | 0;
					do {
						i[n >> 1] = 0;
						n = n + 2 | 0
					} while ((n | 0) < (t | 0));
					He(e + 608 | 0) | 0;
					ar(e + 646 | 0, o[e + 1216 >> 2] | 0) | 0;
					wr(e + 686 | 0) | 0;
					cr(e + 700 | 0) | 0
				}
				Ue(e + 484 | 0) | 0;
				i[e + 606 >> 1] = 21845;
				kr(e + 730 | 0) | 0;
				if(!r) {
					e = 0;
					return e | 0
				}
				sr(e + 748 | 0) | 0;
				e = 0;
				return e | 0
			}

			function Ze(e, r, n, a, l, f) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				var u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0,
					C = 0,
					I = 0,
					B = 0,
					L = 0,
					U = 0,
					x = 0,
					H = 0,
					z = 0,
					j = 0,
					Y = 0,
					V = 0,
					q = 0,
					K = 0,
					W = 0,
					X = 0,
					G = 0,
					J = 0,
					Z = 0,
					Q = 0,
					$ = 0,
					re = 0,
					ne = 0,
					te = 0,
					ie = 0,
					oe = 0,
					ae = 0,
					se = 0,
					le = 0,
					fe = 0,
					ue = 0,
					ce = 0,
					de = 0,
					he = 0,
					Ee = 0,
					we = 0,
					me = 0,
					Se = 0,
					pe = 0,
					ve = 0,
					_e = 0,
					be = 0,
					ke = 0,
					Fe = 0,
					Me = 0,
					ge = 0,
					Re = 0,
					ye = 0,
					Oe = 0,
					Ae = 0,
					Te = 0,
					De = 0,
					Pe = 0,
					Ce = 0,
					Ie = 0,
					Be = 0,
					Ue = 0,
					He = 0,
					Xe = 0,
					Ge = 0,
					Ze = 0,
					ir = 0,
					ar = 0,
					sr = 0,
					cr = 0,
					wr = 0,
					pr = 0,
					_r = 0,
					kr = 0,
					Rr = 0,
					yr = 0;
				yr = c;
				c = c + 336 | 0;
				S = yr + 236 | 0;
				m = yr + 216 | 0;
				kr = yr + 112 | 0;
				_r = yr + 12 | 0;
				ar = yr + 256 | 0;
				cr = yr + 136 | 0;
				sr = yr + 32 | 0;
				Ze = yr + 8 | 0;
				ir = yr + 6 | 0;
				pr = yr + 4 | 0;
				wr = yr + 2 | 0;
				Rr = yr;
				Be = e + 1164 | 0;
				Ue = e + 748 | 0;
				He = ur(Ue, a, Be) | 0;
				if(He) {
					Je(e, 8) | 0;
					lr(Ue, e + 412 | 0, e + 646 | 0, e + 714 | 0, e + 608 | 0, He, r, n, e + 1168 | 0, l, f, Be);
					Rr = e + 666 | 0;
					mi(Rr, e + 392 | 0, 10, Be);
					br(e + 626 | 0, Rr, Be);
					Rr = e + 1156 | 0;
					o[Rr >> 2] = He;
					c = yr;
					return
				}
				switch(a | 0) {
					case 1:
						{
							u = 1;F = 6;
							break
						}
					case 2:
					case 7:
						{
							Le(e + 606 | 0, i[(o[e + 1256 >> 2] | 0) + (r << 1) >> 1] | 0, o[(o[e + 1260 >> 2] | 0) + (r << 2) >> 2] | 0, n, o[e + 1276 >> 2] | 0, Be);F = 9;
							break
						}
					case 3:
						{
							F = 9;
							break
						}
					default:
						{
							u = 0;F = 6
						}
				}
				do
					if((F | 0) == 6) {
						a = e + 440 | 0;
						if((i[a >> 1] | 0) == 6) {
							i[a >> 1] = 5;
							Ce = 0;
							Ie = 0;
							break
						} else {
							i[a >> 1] = 0;
							Ce = 0;
							Ie = 0;
							break
						}
					} else if((F | 0) == 9) {
					a = e + 440 | 0;
					Ce = (s[a >> 1] | 0) + 1 & 65535;
					i[a >> 1] = Ce << 16 >> 16 > 6 ? 6 : Ce;
					Ce = 1;
					Ie = 1;
					u = 0
				} while (0);
				Ae = e + 1156 | 0;
				switch(o[Ae >> 2] | 0) {
					case 1:
						{
							i[a >> 1] = 5;i[e + 436 >> 1] = 0;
							break
						}
					case 2:
						{
							i[a >> 1] = 5;i[e + 436 >> 1] = 1;
							break
						}
					default:
						{}
				}
				h = e + 646 | 0;
				Te = e + 666 | 0;
				d = kr;
				E = Te;
				w = d + 20 | 0;
				do {
					t[d >> 0] = t[E >> 0] | 0;
					d = d + 1 | 0;
					E = E + 1 | 0
				} while ((d | 0) < (w | 0));
				De = (r | 0) != 7;
				Pe = e + 1168 | 0;
				if(De) {
					tr(h, r, Ie, n, Pe, S, Be);
					d = e + 392 | 0;
					ii(d, S, f, Be);
					n = n + 6 | 0
				} else {
					or(h, Ie, n, Pe, m, S, Be);
					d = e + 392 | 0;
					ni(d, m, S, f, Be);
					n = n + 10 | 0
				}
				E = S;
				w = d + 20 | 0;
				do {
					i[d >> 1] = i[E >> 1] | 0;
					d = d + 2 | 0;
					E = E + 2 | 0
				} while ((d | 0) < (w | 0));
				Oe = r >>> 0 > 1;
				y = r >>> 0 < 4 & 1;
				ye = (r | 0) == 5;
				Re = ye ? 10 : 5;
				ye = ye ? 19 : 9;
				T = e + 434 | 0;
				D = 143 - ye & 65535;
				N = e + 460 | 0;
				P = e + 462 | 0;
				C = e + 464 | 0;
				O = r >>> 0 > 2;
				I = e + 388 | 0;
				B = (r | 0) == 0;
				L = r >>> 0 < 2;
				U = e + 1244 | 0;
				x = e + 432 | 0;
				H = r >>> 0 < 6;
				z = e + 1168 | 0;
				j = (r | 0) == 6;
				Y = Ie << 16 >> 16 == 0;
				V = e + 714 | 0;
				q = e + 686 | 0;
				K = e + 436 | 0;
				W = e + 700 | 0;
				X = (r | 0) == 7;
				G = e + 482 | 0;
				J = r >>> 0 < 3;
				Z = e + 608 | 0;
				Q = e + 626 | 0;
				$ = e + 438 | 0;
				re = r >>> 0 < 7;
				ne = e + 730 | 0;
				A = Ce ^ 1;
				te = u << 16 >> 16 != 0;
				ge = te ? Ie ^ 1 : 0;
				ie = e + 442 | 0;
				oe = e + 458 | 0;
				ae = e + 412 | 0;
				se = e + 80 | 0;
				le = e + 1236 | 0;
				fe = e + 1240 | 0;
				ue = e + 468 | 0;
				ce = e + 466 | 0;
				de = e + 470 | 0;
				he = e + 472 | 0;
				Ee = e + 474 | 0;
				we = e + 476 | 0;
				me = e + 478 | 0;
				Se = e + 480 | 0;
				pe = e + 444 | 0;
				ve = e + 446 | 0;
				_e = e + 448 | 0;
				be = e + 450 | 0;
				ke = e + 452 | 0;
				Fe = e + 454 | 0;
				Me = e + 456 | 0;
				M = 0;
				g = 0;
				p = 0;
				v = 0;
				R = -1;
				while(1) {
					R = (R << 16 >> 16) + 1 | 0;
					w = R & 65535;
					g = 1 - (g << 16 >> 16) | 0;
					b = g & 65535;
					m = Oe & p << 16 >> 16 == 80 ? 0 : p;
					_ = n + 2 | 0;
					S = i[n >> 1] | 0;
					e: do
						if(De) {
							k = i[T >> 1] | 0;
							d = (k & 65535) - Re & 65535;
							d = d << 16 >> 16 < 20 ? 20 : d;
							E = (d & 65535) + ye & 65535;
							h = E << 16 >> 16 > 143;
							$e(S, h ? D : d, h ? 143 : E, m, k, Ze, ir, y, Be);
							m = i[Ze >> 1] | 0;
							i[N >> 1] = m;
							if(Ce) {
								S = i[T >> 1] | 0;
								if(S << 16 >> 16 < 143) {
									S = (S & 65535) + 1 & 65535;
									i[T >> 1] = S
								}
								i[Ze >> 1] = S;
								i[ir >> 1] = 0;
								if((i[P >> 1] | 0) != 0 ? !(O | (i[C >> 1] | 0) < 5) : 0) {
									i[Ze >> 1] = m;
									S = m;
									m = 0
								} else m = 0
							} else {
								S = m;
								m = i[ir >> 1] | 0
							}
							ki(o[I >> 2] | 0, S, m, 40, 1, Be);
							if(L) {
								m = n + 6 | 0;
								Ve(w, i[n + 4 >> 1] | 0, i[_ >> 1] | 0, o[U >> 2] | 0, ar, Be);
								n = i[x >> 1] | 0;
								k = n << 16 >> 16;
								S = k << 1;
								if((S | 0) == (k << 17 >> 16 | 0)) {
									E = B;
									break
								}
								E = B;
								S = n << 16 >> 16 > 0 ? 32767 : -32768;
								break
							}
							switch(r | 0) {
								case 2:
									{
										m = n + 6 | 0;Ye(i[n + 4 >> 1] | 0, i[_ >> 1] | 0, ar);n = i[x >> 1] | 0;k = n << 16 >> 16;S = k << 1;
										if((S | 0) == (k << 17 >> 16 | 0)) {
											E = B;
											break e
										}
										E = B;S = n << 16 >> 16 > 0 ? 32767 : -32768;
										break e
									}
								case 3:
									{
										m = n + 6 | 0;qe(i[n + 4 >> 1] | 0, i[_ >> 1] | 0, ar);n = i[x >> 1] | 0;k = n << 16 >> 16;S = k << 1;
										if((S | 0) == (k << 17 >> 16 | 0)) {
											E = B;
											break e
										}
										E = B;S = n << 16 >> 16 > 0 ? 32767 : -32768;
										break e
									}
								default:
									{
										if(H) {
											m = n + 6 | 0;
											Ke(i[n + 4 >> 1] | 0, i[_ >> 1] | 0, o[z >> 2] | 0, ar);
											n = i[x >> 1] | 0;
											k = n << 16 >> 16;
											S = k << 1;
											if((S | 0) == (k << 17 >> 16 | 0)) {
												E = B;
												break e
											}
											E = B;
											S = n << 16 >> 16 > 0 ? 32767 : -32768;
											break e
										}
										if(!j) {
											E = B;
											F = 44;
											break e
										}
										We(_, ar, Be);S = n + 16 | 0;n = i[x >> 1] | 0;k = n << 16 >> 16;w = k << 1;
										if((w | 0) == (k << 17 >> 16 | 0)) {
											m = S;
											E = B;
											S = w;
											break e
										}
										m = S;E = B;S = n << 16 >> 16 > 0 ? 32767 : -32768;
										break e
									}
							}
						} else {
							er(S, 18, 143, m, Ze, ir, Be);
							if(Y ? m << 16 >> 16 == 0 | S << 16 >> 16 < 61 : 0) {
								S = i[Ze >> 1] | 0;
								m = i[ir >> 1] | 0
							} else {
								i[N >> 1] = i[Ze >> 1] | 0;
								S = i[T >> 1] | 0;
								i[Ze >> 1] = S;
								i[ir >> 1] = 0;
								m = 0
							}
							ki(o[I >> 2] | 0, S, m, 40, 0, Be);
							E = 0;
							F = 44
						}
					while(0);
					if((F | 0) == 44) {
						F = 0;
						if(Ce) Er(q, i[a >> 1] | 0, pr, Be);
						else i[pr >> 1] = nr(r, i[_ >> 1] | 0, o[fe >> 2] | 0) | 0;
						mr(q, Ie, i[K >> 1] | 0, pr, Be);
						je(n + 4 | 0, ar, o[z >> 2] | 0);
						S = n + 24 | 0;
						n = i[pr >> 1] | 0;
						k = n << 16 >> 16;
						w = k << 1;
						if((w | 0) == (k << 17 >> 16 | 0)) {
							m = S;
							S = w
						} else {
							m = S;
							S = n << 16 >> 16 > 0 ? 32767 : -32768
						}
					}
					n = i[Ze >> 1] | 0;
					e: do
						if(n << 16 >> 16 < 40) {
							d = S << 16 >> 16;
							h = n;
							S = n << 16 >> 16;
							while(1) {
								w = ar + (S << 1) | 0;
								n = (ee(i[ar + (S - (h << 16 >> 16) << 1) >> 1] | 0, d) | 0) >> 15;
								if((n | 0) > 32767) {
									o[Be >> 2] = 1;
									n = 32767
								}
								k = n & 65535;
								i[Rr >> 1] = k;
								i[w >> 1] = Wt(i[w >> 1] | 0, k, Be) | 0;
								S = S + 1 | 0;
								if((S & 65535) << 16 >> 16 == 40) break e;
								h = i[Ze >> 1] | 0
							}
						}
					while(0);
					e: do
						if(E) {
							E = (g & 65535 | 0) == 0;
							if(E) {
								n = m;
								w = v
							} else {
								n = m + 2 | 0;
								w = i[m >> 1] | 0
							}
							if(Y) Qe(V, r, w, ar, b, pr, wr, Pe, Be);
							else {
								Er(q, i[a >> 1] | 0, pr, Be);
								dr(W, V, i[a >> 1] | 0, wr, Be)
							}
							mr(q, Ie, i[K >> 1] | 0, pr, Be);
							hr(W, Ie, i[K >> 1] | 0, wr, Be);
							m = i[pr >> 1] | 0;
							S = m << 16 >> 16 > 13017 ? 13017 : m;
							if(E) F = 80;
							else k = w
						} else {
							n = m + 2 | 0;
							S = i[m >> 1] | 0;
							switch(r | 0) {
								case 1:
								case 2:
								case 3:
								case 4:
								case 6:
									{
										if(Y) Qe(V, r, S, ar, b, pr, wr, Pe, Be);
										else {
											Er(q, i[a >> 1] | 0, pr, Be);
											dr(W, V, i[a >> 1] | 0, wr, Be)
										}
										mr(q, Ie, i[K >> 1] | 0, pr, Be);hr(W, Ie, i[K >> 1] | 0, wr, Be);m = i[pr >> 1] | 0;S = m << 16 >> 16 > 13017 ? 13017 : m;
										if(!j) {
											w = v;
											F = 80;
											break e
										}
										if((i[T >> 1] | 0) <= 45) {
											w = v;
											F = 80;
											break e
										}
										w = v;S = S << 16 >> 16 >>> 2 & 65535;F = 80;
										break e
									}
								case 5:
									{
										if(Ce) Er(q, i[a >> 1] | 0, pr, Be);
										else i[pr >> 1] = nr(5, S, o[fe >> 2] | 0) | 0;mr(q, Ie, i[K >> 1] | 0, pr, Be);
										if(Y) rr(V, 5, i[n >> 1] | 0, ar, o[le >> 2] | 0, wr, Be);
										else dr(W, V, i[a >> 1] | 0, wr, Be);hr(W, Ie, i[K >> 1] | 0, wr, Be);S = i[pr >> 1] | 0;n = m + 4 | 0;m = S;w = v;S = S << 16 >> 16 > 13017 ? 13017 : S;F = 80;
										break e
									}
								default:
									{
										if(Y) rr(V, r, S, ar, o[le >> 2] | 0, wr, Be);
										else dr(W, V, i[a >> 1] | 0, wr, Be);hr(W, Ie, i[K >> 1] | 0, wr, Be);S = i[pr >> 1] | 0;m = S;w = v;F = 80;
										break e
									}
							}
						}
					while(0);
					if((F | 0) == 80) {
						F = 0;
						i[x >> 1] = m << 16 >> 16 > 13017 ? 13017 : m;
						k = w
					}
					S = S << 16 >> 16;
					S = (S << 17 >> 17 | 0) == (S | 0) ? S << 1 : S >>> 15 ^ 32767;
					b = (S & 65535) << 16 >> 16 > 16384;
					e: do
						if(b) {
							_ = S << 16 >> 16;
							if(X) m = 0;
							else {
								m = 0;
								while(1) {
									S = (ee(i[(o[I >> 2] | 0) + (m << 1) >> 1] | 0, _) | 0) >> 15;
									if((S | 0) > 32767) {
										o[Be >> 2] = 1;
										S = 32767
									}
									i[Rr >> 1] = S;
									S = ee(i[pr >> 1] | 0, S << 16 >> 16) | 0;
									if((S | 0) == 1073741824) {
										o[Be >> 2] = 1;
										S = 2147483647
									} else S = S << 1;
									i[cr + (m << 1) >> 1] = Ni(S, Be) | 0;
									m = m + 1 | 0;
									if((m | 0) == 40) break e
								}
							}
							do {
								S = (ee(i[(o[I >> 2] | 0) + (m << 1) >> 1] | 0, _) | 0) >> 15;
								if((S | 0) > 32767) {
									o[Be >> 2] = 1;
									S = 32767
								}
								i[Rr >> 1] = S;
								S = ee(i[pr >> 1] | 0, S << 16 >> 16) | 0;
								if((S | 0) != 1073741824) {
									S = S << 1;
									if((S | 0) < 0) S = ~((S ^ -2) >> 1);
									else F = 88
								} else {
									o[Be >> 2] = 1;
									S = 2147483647;
									F = 88
								}
								if((F | 0) == 88) {
									F = 0;
									S = S >> 1
								}
								i[cr + (m << 1) >> 1] = Ni(S, Be) | 0;
								m = m + 1 | 0
							} while ((m | 0) != 40)
						}
					while(0);
					if(Y) {
						i[ce >> 1] = i[ue >> 1] | 0;
						i[ue >> 1] = i[de >> 1] | 0;
						i[de >> 1] = i[he >> 1] | 0;
						i[he >> 1] = i[Ee >> 1] | 0;
						i[Ee >> 1] = i[we >> 1] | 0;
						i[we >> 1] = i[me >> 1] | 0;
						i[me >> 1] = i[Se >> 1] | 0;
						i[Se >> 1] = i[G >> 1] | 0;
						i[G >> 1] = i[pr >> 1] | 0
					}
					if((Ce | (i[K >> 1] | 0) != 0 ? J & (i[P >> 1] | 0) != 0 : 0) ? (Xe = i[pr >> 1] | 0, Xe << 16 >> 16 > 12288) : 0) {
						F = (((Xe << 16 >> 16) + 118784 | 0) >>> 1) + 12288 & 65535;
						i[pr >> 1] = F << 16 >> 16 > 14745 ? 14745 : F
					}
					vr(kr, Te, p, _r, Be);
					S = ze(Z, r, i[wr >> 1] | 0, _r, Q, Ie, i[K >> 1] | 0, u, i[$ >> 1] | 0, i[P >> 1] | 0, i[C >> 1] | 0, Be) | 0;
					switch(r | 0) {
						case 0:
						case 1:
						case 2:
						case 3:
						case 6:
							{
								w = i[pr >> 1] | 0;_ = 1;
								break
							}
						default:
							{
								S = i[wr >> 1] | 0;w = i[pr >> 1] | 0;
								if(re) _ = 1;
								else {
									m = w << 16 >> 16;
									if(w << 16 >> 16 < 0) m = ~((m ^ -2) >> 1);
									else m = m >>> 1;
									w = m & 65535;
									_ = 2
								}
							}
					}
					d = w << 16 >> 16;
					p = _ & 65535;
					m = o[I >> 2] | 0;
					v = 0;
					do {
						m = m + (v << 1) | 0;
						i[sr + (v << 1) >> 1] = i[m >> 1] | 0;
						m = ee(i[m >> 1] | 0, d) | 0;
						if((m | 0) == 1073741824) {
							o[Be >> 2] = 1;
							h = 2147483647
						} else h = m << 1;
						E = ee(i[wr >> 1] | 0, i[ar + (v << 1) >> 1] | 0) | 0;
						if((E | 0) != 1073741824) {
							m = (E << 1) + h | 0;
							if((E ^ h | 0) > 0 & (m ^ h | 0) < 0) {
								o[Be >> 2] = 1;
								m = (h >>> 31) + 2147483647 | 0
							}
						} else {
							o[Be >> 2] = 1;
							m = 2147483647
						}
						F = m << p;
						F = Ni((F >> p | 0) == (m | 0) ? F : m >> 31 ^ 2147483647, Be) | 0;
						m = o[I >> 2] | 0;
						i[m + (v << 1) >> 1] = F;
						v = v + 1 | 0
					} while ((v | 0) != 40);
					Mr(ne);
					if((J ? (i[C >> 1] | 0) > 3 : 0) ? !((i[P >> 1] | 0) == 0 | A) : 0) Fr(ne);
					gr(ne, r, sr, S, i[pr >> 1] | 0, ar, w, _, Pe, Be);
					S = 0;
					E = 0;
					do {
						m = i[sr + (E << 1) >> 1] | 0;
						m = ee(m, m) | 0;
						if((m | 0) != 1073741824) {
							w = (m << 1) + S | 0;
							if((m ^ S | 0) > 0 & (w ^ S | 0) < 0) {
								o[Be >> 2] = 1;
								S = (S >>> 31) + 2147483647 | 0
							} else S = w
						} else {
							o[Be >> 2] = 1;
							S = 2147483647
						}
						E = E + 1 | 0
					} while ((E | 0) != 40);
					if((S | 0) < 0) S = ~((S ^ -2) >> 1);
					else S = S >> 1;
					S = Ii(S, Rr, Be) | 0;
					w = ((i[Rr >> 1] | 0) >>> 1) + 15 | 0;
					m = w & 65535;
					w = w << 16 >> 16;
					if(m << 16 >> 16 > 0)
						if(m << 16 >> 16 < 31) {
							S = S >> w;
							F = 135
						} else {
							S = 0;
							F = 137
						}
					else {
						_ = 0 - w << 16 >> 16;
						F = S << _;
						S = (F >> _ | 0) == (S | 0) ? F : S >> 31 ^ 2147483647;
						F = 135
					}
					if((F | 0) == 135) {
						F = 0;
						if((S | 0) < 0) S = ~((S ^ -4) >> 2);
						else F = 137
					}
					if((F | 0) == 137) {
						F = 0;
						S = S >>> 2
					}
					S = S & 65535;
					do
						if(J ? (Ge = i[C >> 1] | 0, Ge << 16 >> 16 > 5) : 0)
							if(i[P >> 1] | 0)
								if((i[a >> 1] | 0) < 4) {
									if(te) {
										if(!(Ce | (i[$ >> 1] | 0) != 0)) F = 145
									} else if(!Ce) F = 145;
									if((F | 0) == 145 ? (0, (i[K >> 1] | 0) == 0) : 0) {
										F = 147;
										break
									}
									Sr(sr, S, ie, Ge, i[K >> 1] | 0, ge, Be) | 0;
									F = 147
								} else F = 147;
					else F = 151;
					else F = 147;
					while(0);
					do
						if((F | 0) == 147) {
							F = 0;
							if(i[P >> 1] | 0) {
								if(!Ce ? (i[K >> 1] | 0) == 0 : 0) {
									F = 151;
									break
								}
								if((i[a >> 1] | 0) >= 4) F = 151
							} else F = 151
						}
					while(0);
					if((F | 0) == 151) {
						F = 0;
						i[ie >> 1] = i[pe >> 1] | 0;
						i[pe >> 1] = i[ve >> 1] | 0;
						i[ve >> 1] = i[_e >> 1] | 0;
						i[_e >> 1] = i[be >> 1] | 0;
						i[be >> 1] = i[ke >> 1] | 0;
						i[ke >> 1] = i[Fe >> 1] | 0;
						i[Fe >> 1] = i[Me >> 1] | 0;
						i[Me >> 1] = i[oe >> 1] | 0;
						i[oe >> 1] = S
					}
					if(b) {
						S = 0;
						do {
							b = cr + (S << 1) | 0;
							i[b >> 1] = Wt(i[b >> 1] | 0, i[sr + (S << 1) >> 1] | 0, Be) | 0;
							S = S + 1 | 0
						} while ((S | 0) != 40);
						Ne(sr, cr, 40, Be);
						o[Be >> 2] = 0;
						Li(f, cr, l + (M << 1) | 0, 40, ae, 0)
					} else {
						o[Be >> 2] = 0;
						Li(f, sr, l + (M << 1) | 0, 40, ae, 0)
					}
					if(!(o[Be >> 2] | 0)) qi(ae | 0, l + (M + 30 << 1) | 0, 20) | 0;
					else {
						w = 193;
						while(1) {
							m = e + (w << 1) | 0;
							b = i[m >> 1] | 0;
							S = b << 16 >> 16;
							if(b << 16 >> 16 < 0) S = ~((S ^ -4) >> 2);
							else S = S >>> 2;
							i[m >> 1] = S;
							if((w | 0) > 0) w = w + -1 | 0;
							else {
								w = 39;
								break
							}
						}
						while(1) {
							m = sr + (w << 1) | 0;
							b = i[m >> 1] | 0;
							S = b << 16 >> 16;
							if(b << 16 >> 16 < 0) S = ~((S ^ -4) >> 2);
							else S = S >>> 2;
							i[m >> 1] = S;
							if((w | 0) > 0) w = w + -1 | 0;
							else break
						}
						Li(f, sr, l + (M << 1) | 0, 40, ae, 1)
					}
					qi(e | 0, se | 0, 308) | 0;
					i[T >> 1] = i[Ze >> 1] | 0;
					S = M + 40 | 0;
					p = S & 65535;
					if(p << 16 >> 16 >= 160) break;
					else {
						M = S << 16 >> 16;
						f = f + 22 | 0;
						v = k
					}
				}
				i[P >> 1] = xe(e + 484 | 0, e + 466 | 0, l, C, Be) | 0;
				fr(Ue, Te, l, Be);
				i[K >> 1] = Ie;
				i[$ >> 1] = u;
				br(e + 626 | 0, Te, Be);
				Rr = Ae;
				o[Rr >> 2] = He;
				c = yr;
				return
			}

			function Qe(e, r, n, t, a, l, f, u, d) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				d = d | 0;
				var h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0;
				S = c;
				c = c + 16 | 0;
				w = S + 2 | 0;
				m = S;
				n = n << 16 >> 16;
				n = (n << 18 >> 18 | 0) == (n | 0) ? n << 2 : n >>> 15 ^ 32767;
				switch(r | 0) {
					case 3:
					case 4:
					case 6:
						{
							E = n << 16 >> 16;n = o[u + 84 >> 2] | 0;i[l >> 1] = i[n + (E << 1) >> 1] | 0;u = i[n + (E + 1 << 1) >> 1] | 0;h = i[n + (E + 3 << 1) >> 1] | 0;l = i[n + (E + 2 << 1) >> 1] | 0;
							break
						}
					case 0:
						{
							u = (n & 65535) + (a << 16 >> 16 << 1 ^ 2) | 0;u = (u & 65535) << 16 >> 16 > 1022 ? 1022 : u << 16 >> 16;i[l >> 1] = i[782 + (u << 1) >> 1] | 0;l = i[782 + (u + 1 << 1) >> 1] | 0;si(l << 16 >> 16, m, w, d);i[m >> 1] = (s[m >> 1] | 0) + 65524;u = Ci(i[w >> 1] | 0, 5, d) | 0;E = i[m >> 1] | 0;E = Wt(u, ((E << 26 >> 26 | 0) == (E | 0) ? E << 10 : E >>> 15 ^ 32767) & 65535, d) | 0;u = i[w >> 1] | 0;n = i[m >> 1] | 0;
							if((n * 24660 | 0) == 1073741824) {
								o[d >> 2] = 1;
								a = 2147483647
							} else a = n * 49320 | 0;h = (u << 16 >> 16) * 24660 >> 15;n = a + (h << 1) | 0;
							if((a ^ h | 0) > 0 & (n ^ a | 0) < 0) {
								o[d >> 2] = 1;
								n = (a >>> 31) + 2147483647 | 0
							}
							h = n << 13;u = l;h = Ni((h >> 13 | 0) == (n | 0) ? h : n >> 31 ^ 2147483647, d) | 0;l = E;
							break
						}
					default:
						{
							E = n << 16 >> 16;n = o[u + 80 >> 2] | 0;i[l >> 1] = i[n + (E << 1) >> 1] | 0;u = i[n + (E + 1 << 1) >> 1] | 0;h = i[n + (E + 3 << 1) >> 1] | 0;l = i[n + (E + 2 << 1) >> 1] | 0
						}
				}
				Zt(e, r, t, m, w, 0, 0, d);
				a = ee((bi(14, i[w >> 1] | 0, d) | 0) << 16 >> 16, u << 16 >> 16) | 0;
				if((a | 0) == 1073741824) {
					o[d >> 2] = 1;
					n = 2147483647
				} else n = a << 1;
				u = 10 - (s[m >> 1] | 0) | 0;
				a = u & 65535;
				u = u << 16 >> 16;
				if(a << 16 >> 16 > 0) {
					m = a << 16 >> 16 < 31 ? n >> u : 0;
					m = m >>> 16;
					m = m & 65535;
					i[f >> 1] = m;
					Qt(e, l, h);
					c = S;
					return
				} else {
					d = 0 - u << 16 >> 16;
					m = n << d;
					m = (m >> d | 0) == (n | 0) ? m : n >> 31 ^ 2147483647;
					m = m >>> 16;
					m = m & 65535;
					i[f >> 1] = m;
					Qt(e, l, h);
					c = S;
					return
				}
			}

			function $e(e, r, n, t, a, s, l, f, u) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				if(!(t << 16 >> 16)) {
					f = e << 16 >> 16;
					if(e << 16 >> 16 >= 197) {
						i[s >> 1] = f + 65424;
						i[l >> 1] = 0;
						return
					}
					a = ((f << 16) + 131072 >> 16) * 10923 >> 15;
					if((a | 0) > 32767) {
						o[u >> 2] = 1;
						a = 32767
					}
					e = (a & 65535) + 19 | 0;
					i[s >> 1] = e;
					i[l >> 1] = f + 58 - ((e * 196608 | 0) >>> 16);
					return
				}
				if(!(f << 16 >> 16)) {
					u = e << 16 >> 16 << 16;
					e = ((u + 131072 >> 16) * 21846 | 0) + -65536 >> 16;
					i[s >> 1] = e + (r & 65535);
					i[l >> 1] = ((u + -131072 | 0) >>> 16) - ((e * 196608 | 0) >>> 16);
					return
				}
				if((Bi(a, r, u) | 0) << 16 >> 16 > 5) a = (r & 65535) + 5 & 65535;
				f = n << 16 >> 16;
				f = (f - (a & 65535) & 65535) << 16 >> 16 > 4 ? f + 65532 & 65535 : a;
				a = e << 16 >> 16;
				if(e << 16 >> 16 < 4) {
					i[s >> 1] = ((((f & 65535) << 16) + -327680 | 0) >>> 16) + a;
					i[l >> 1] = 0;
					return
				}
				a = a << 16;
				if(e << 16 >> 16 < 12) {
					u = (((a + -327680 >> 16) * 10923 | 0) >>> 15 << 16) + -65536 | 0;
					e = u >> 16;
					i[s >> 1] = (f & 65535) + e;
					i[l >> 1] = ((a + -589824 | 0) >>> 16) - (u >>> 15) - e;
					return
				} else {
					i[s >> 1] = ((a + -786432 + ((f & 65535) << 16) | 0) >>> 16) + 1;
					i[l >> 1] = 0;
					return
				}
			}

			function er(e, r, n, t, o, a, l) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				a = a | 0;
				l = l | 0;
				if(t << 16 >> 16) {
					l = (s[o >> 1] | 0) + 65531 | 0;
					l = (l << 16 >> 16 | 0) < (r << 16 >> 16 | 0) ? r : l & 65535;
					n = n << 16 >> 16;
					r = e << 16 >> 16 << 16;
					e = ((r + 327680 >> 16) * 10924 | 0) + -65536 >> 16;
					i[o >> 1] = (((((l & 65535) << 16) + 589824 >> 16 | 0) > (n | 0) ? n + 65527 & 65535 : l) & 65535) + e;
					i[a >> 1] = ((r + -196608 | 0) >>> 16) - ((e * 393216 | 0) >>> 16);
					return
				}
				t = e << 16 >> 16;
				if(e << 16 >> 16 < 463) {
					e = ((((t << 16) + 327680 >> 16) * 10924 | 0) >>> 16) + 17 | 0;
					i[o >> 1] = e;
					i[a >> 1] = t + 105 - ((e * 393216 | 0) >>> 16);
					return
				} else {
					i[o >> 1] = t + 65168;
					i[a >> 1] = 0;
					return
				}
			}

			function rr(e, r, n, t, a, s, l) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				var f = 0,
					u = 0,
					d = 0,
					h = 0;
				h = c;
				c = c + 16 | 0;
				u = h + 6 | 0;
				f = h + 4 | 0;
				Zt(e, r, t, u, f, h + 2 | 0, h, l);
				d = (n & 31) * 3 | 0;
				t = a + (d << 1) | 0;
				if(!((Bi(r & 65535, 7, l) | 0) << 16 >> 16)) {
					u = bi(i[u >> 1] | 0, i[f >> 1] | 0, l) | 0;
					f = u << 16 >> 16;
					f = (ee(((u << 20 >> 20 | 0) == (f | 0) ? u << 4 : f >>> 15 ^ 32767) << 16 >> 16, i[t >> 1] | 0) | 0) >> 15;
					if((f | 0) > 32767) {
						o[l >> 2] = 1;
						f = 32767
					}
					t = f << 16;
					n = t >> 16;
					if((f << 17 >> 17 | 0) == (n | 0)) f = t >> 15;
					else f = n >>> 15 ^ 32767
				} else {
					n = bi(14, i[f >> 1] | 0, l) | 0;
					n = ee(n << 16 >> 16, i[t >> 1] | 0) | 0;
					if((n | 0) == 1073741824) {
						o[l >> 2] = 1;
						t = 2147483647
					} else t = n << 1;
					n = Bi(9, i[u >> 1] | 0, l) | 0;
					f = n << 16 >> 16;
					if(n << 16 >> 16 > 0) f = n << 16 >> 16 < 31 ? t >> f : 0;
					else {
						l = 0 - f << 16 >> 16;
						f = t << l;
						f = (f >> l | 0) == (t | 0) ? f : t >> 31 ^ 2147483647
					}
					f = f >>> 16
				}
				i[s >> 1] = f;
				Qt(e, i[a + (d + 1 << 1) >> 1] | 0, i[a + (d + 2 << 1) >> 1] | 0);
				c = h;
				return
			}

			function nr(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				r = i[n + (r << 16 >> 16 << 1) >> 1] | 0;
				if((e | 0) != 7) {
					e = r;
					return e | 0
				}
				e = r & 65532;
				return e | 0
			}

			function tr(e, r, n, a, s, l, f) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				f = f | 0;
				var u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0;
				b = c;
				c = c + 48 | 0;
				S = b + 20 | 0;
				_ = b;
				v = o[s + 44 >> 2] | 0;
				p = o[s + 64 >> 2] | 0;
				u = o[s + 4 >> 2] | 0;
				m = o[s + 12 >> 2] | 0;
				h = o[s + 20 >> 2] | 0;
				d = o[s + 56 >> 2] | 0;
				if(!(n << 16 >> 16)) {
					E = r >>> 0 < 2;
					if(E) {
						n = 765;
						w = 508;
						h = o[s + 52 >> 2] | 0
					} else {
						s = (r | 0) == 5;
						n = s ? 1533 : 765;
						w = 2044;
						u = s ? d : u
					}
					d = i[a >> 1] | 0;
					n = ((d * 196608 >> 16 | 0) > (n & 65535 | 0) ? n : d * 3 & 65535) << 16 >> 16;
					d = i[u + (n << 1) >> 1] | 0;
					i[S >> 1] = d;
					i[S + 2 >> 1] = i[u + (n + 1 << 1) >> 1] | 0;
					i[S + 4 >> 1] = i[u + (n + 2 << 1) >> 1] | 0;
					n = i[a + 2 >> 1] | 0;
					if(E) n = n << 16 >> 16 << 1 & 65535;
					E = (n << 16 >> 16) * 196608 | 0;
					E = (E | 0) > 100466688 ? 1533 : E >> 16;
					i[S + 6 >> 1] = i[m + (E << 1) >> 1] | 0;
					i[S + 8 >> 1] = i[m + (E + 1 << 1) >> 1] | 0;
					i[S + 10 >> 1] = i[m + (E + 2 << 1) >> 1] | 0;
					a = i[a + 4 >> 1] | 0;
					a = ((a << 18 >> 16 | 0) > (w & 65535 | 0) ? w : a << 2 & 65535) << 16 >> 16;
					i[S + 12 >> 1] = i[h + (a << 1) >> 1] | 0;
					i[S + 14 >> 1] = i[h + ((a | 1) << 1) >> 1] | 0;
					i[S + 16 >> 1] = i[h + ((a | 2) << 1) >> 1] | 0;
					i[S + 18 >> 1] = i[h + ((a | 3) << 1) >> 1] | 0;
					if((r | 0) == 8) {
						n = 0;
						while(1) {
							p = e + (n << 1) | 0;
							i[_ + (n << 1) >> 1] = Wt(d, Wt(i[v + (n << 1) >> 1] | 0, i[p >> 1] | 0, f) | 0, f) | 0;
							i[p >> 1] = d;
							n = n + 1 | 0;
							if((n | 0) == 10) break;
							d = i[S + (n << 1) >> 1] | 0
						}
						Ti(_, 205, 10, f);
						u = e + 20 | 0;
						d = _;
						n = u + 20 | 0;
						do {
							t[u >> 0] = t[d >> 0] | 0;
							u = u + 1 | 0;
							d = d + 1 | 0
						} while ((u | 0) < (n | 0));
						mi(_, l, 10, f);
						c = b;
						return
					} else u = 0;
					do {
						d = e + (u << 1) | 0;
						n = (ee(i[p + (u << 1) >> 1] | 0, i[d >> 1] | 0) | 0) >> 15;
						if((n | 0) > 32767) {
							o[f >> 2] = 1;
							n = 32767
						}
						a = Wt(i[v + (u << 1) >> 1] | 0, n & 65535, f) | 0;
						r = i[S + (u << 1) >> 1] | 0;
						i[_ + (u << 1) >> 1] = Wt(r, a, f) | 0;
						i[d >> 1] = r;
						u = u + 1 | 0
					} while ((u | 0) != 10);
					Ti(_, 205, 10, f);
					u = e + 20 | 0;
					d = _;
					n = u + 20 | 0;
					do {
						t[u >> 0] = t[d >> 0] | 0;
						u = u + 1 | 0;
						d = d + 1 | 0
					} while ((u | 0) < (n | 0));
					mi(_, l, 10, f);
					c = b;
					return
				} else {
					u = 0;
					do {
						n = (i[e + 20 + (u << 1) >> 1] | 0) * 29491 >> 15;
						if((n | 0) > 32767) {
							o[f >> 2] = 1;
							n = 32767
						}
						d = (i[v + (u << 1) >> 1] | 0) * 3277 >> 15;
						if((d | 0) > 32767) {
							o[f >> 2] = 1;
							d = 32767
						}
						i[_ + (u << 1) >> 1] = Wt(d & 65535, n & 65535, f) | 0;
						u = u + 1 | 0
					} while ((u | 0) != 10);
					if((r | 0) == 8) {
						u = 0;
						do {
							p = e + (u << 1) | 0;
							S = Wt(i[v + (u << 1) >> 1] | 0, i[p >> 1] | 0, f) | 0;
							i[p >> 1] = Bi(i[_ + (u << 1) >> 1] | 0, S, f) | 0;
							u = u + 1 | 0
						} while ((u | 0) != 10);
						Ti(_, 205, 10, f);
						u = e + 20 | 0;
						d = _;
						n = u + 20 | 0;
						do {
							t[u >> 0] = t[d >> 0] | 0;
							u = u + 1 | 0;
							d = d + 1 | 0
						} while ((u | 0) < (n | 0));
						mi(_, l, 10, f);
						c = b;
						return
					} else u = 0;
					do {
						d = e + (u << 1) | 0;
						n = (ee(i[p + (u << 1) >> 1] | 0, i[d >> 1] | 0) | 0) >> 15;
						if((n | 0) > 32767) {
							o[f >> 2] = 1;
							n = 32767
						}
						S = Wt(i[v + (u << 1) >> 1] | 0, n & 65535, f) | 0;
						i[d >> 1] = Bi(i[_ + (u << 1) >> 1] | 0, S, f) | 0;
						u = u + 1 | 0
					} while ((u | 0) != 10);
					Ti(_, 205, 10, f);
					u = e + 20 | 0;
					d = _;
					n = u + 20 | 0;
					do {
						t[u >> 0] = t[d >> 0] | 0;
						u = u + 1 | 0;
						d = d + 1 | 0
					} while ((u | 0) < (n | 0));
					mi(_, l, 10, f);
					c = b;
					return
				}
			}

			function ir(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				qi(e | 0, n + ((r << 16 >> 16) * 10 << 1) | 0, 20) | 0;
				return
			}

			function or(e, r, n, a, s, l, f) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				f = f | 0;
				var u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0;
				b = c;
				c = c + 80 | 0;
				m = b + 60 | 0;
				S = b + 40 | 0;
				v = b + 20 | 0;
				_ = b;
				p = o[a + 48 >> 2] | 0;
				h = o[a + 24 >> 2] | 0;
				E = o[a + 28 >> 2] | 0;
				w = o[a + 32 >> 2] | 0;
				if(r << 16 >> 16) {
					u = 0;
					do {
						m = p + (u << 1) | 0;
						n = Wt(((i[m >> 1] | 0) * 1639 | 0) >>> 15 & 65535, ((i[e + 20 + (u << 1) >> 1] | 0) * 31128 | 0) >>> 15 & 65535, f) | 0;
						i[v + (u << 1) >> 1] = n;
						i[_ + (u << 1) >> 1] = n;
						S = e + (u << 1) | 0;
						i[S >> 1] = Bi(n, Wt(i[m >> 1] | 0, ((i[S >> 1] | 0) * 21299 | 0) >>> 15 & 65535, f) | 0, f) | 0;
						u = u + 1 | 0
					} while ((u | 0) != 10);
					Ti(v, 205, 10, f);
					Ti(_, 205, 10, f);
					u = e + 20 | 0;
					a = _;
					r = u + 20 | 0;
					do {
						t[u >> 0] = t[a >> 0] | 0;
						u = u + 1 | 0;
						a = a + 1 | 0
					} while ((u | 0) < (r | 0));
					mi(v, s, 10, f);
					mi(_, l, 10, f);
					c = b;
					return
				}
				r = o[a + 16 >> 2] | 0;
				a = o[a + 8 >> 2] | 0;
				d = i[n >> 1] | 0;
				d = ((d << 18 >> 18 | 0) == (d | 0) ? d << 2 : d >>> 15 ^ 32767) << 16 >> 16;
				i[m >> 1] = i[a + (d << 1) >> 1] | 0;
				i[m + 2 >> 1] = i[a + (d + 1 << 1) >> 1] | 0;
				i[S >> 1] = i[a + (d + 2 << 1) >> 1] | 0;
				i[S + 2 >> 1] = i[a + (d + 3 << 1) >> 1] | 0;
				d = i[n + 2 >> 1] | 0;
				d = ((d << 18 >> 18 | 0) == (d | 0) ? d << 2 : d >>> 15 ^ 32767) << 16 >> 16;
				i[m + 4 >> 1] = i[r + (d << 1) >> 1] | 0;
				i[m + 6 >> 1] = i[r + (d + 1 << 1) >> 1] | 0;
				i[S + 4 >> 1] = i[r + (d + 2 << 1) >> 1] | 0;
				i[S + 6 >> 1] = i[r + (d + 3 << 1) >> 1] | 0;
				d = i[n + 4 >> 1] | 0;
				a = d << 16 >> 16;
				if(d << 16 >> 16 < 0) r = ~((a ^ -2) >> 1);
				else r = a >>> 1;
				d = r << 16 >> 16;
				d = ((r << 18 >> 18 | 0) == (d | 0) ? r << 2 : d >>> 15 ^ 32767) << 16 >> 16;
				u = h + (d + 1 << 1) | 0;
				r = i[h + (d << 1) >> 1] | 0;
				if(!(a & 1)) {
					i[m + 8 >> 1] = r;
					i[m + 10 >> 1] = i[u >> 1] | 0;
					i[S + 8 >> 1] = i[h + (d + 2 << 1) >> 1] | 0;
					i[S + 10 >> 1] = i[h + (d + 3 << 1) >> 1] | 0
				} else {
					if(r << 16 >> 16 == -32768) r = 32767;
					else r = 0 - (r & 65535) & 65535;
					i[m + 8 >> 1] = r;
					r = i[u >> 1] | 0;
					if(r << 16 >> 16 == -32768) r = 32767;
					else r = 0 - (r & 65535) & 65535;
					i[m + 10 >> 1] = r;
					r = i[h + (d + 2 << 1) >> 1] | 0;
					if(r << 16 >> 16 == -32768) r = 32767;
					else r = 0 - (r & 65535) & 65535;
					i[S + 8 >> 1] = r;
					r = i[h + (d + 3 << 1) >> 1] | 0;
					if(r << 16 >> 16 == -32768) r = 32767;
					else r = 0 - (r & 65535) & 65535;
					i[S + 10 >> 1] = r
				}
				u = i[n + 6 >> 1] | 0;
				u = ((u << 18 >> 18 | 0) == (u | 0) ? u << 2 : u >>> 15 ^ 32767) << 16 >> 16;
				i[m + 12 >> 1] = i[E + (u << 1) >> 1] | 0;
				i[m + 14 >> 1] = i[E + (u + 1 << 1) >> 1] | 0;
				i[S + 12 >> 1] = i[E + (u + 2 << 1) >> 1] | 0;
				i[S + 14 >> 1] = i[E + (u + 3 << 1) >> 1] | 0;
				u = i[n + 8 >> 1] | 0;
				u = ((u << 18 >> 18 | 0) == (u | 0) ? u << 2 : u >>> 15 ^ 32767) << 16 >> 16;
				i[m + 16 >> 1] = i[w + (u << 1) >> 1] | 0;
				i[m + 18 >> 1] = i[w + (u + 1 << 1) >> 1] | 0;
				i[S + 16 >> 1] = i[w + (u + 2 << 1) >> 1] | 0;
				i[S + 18 >> 1] = i[w + (u + 3 << 1) >> 1] | 0;
				u = 0;
				do {
					a = e + (u << 1) | 0;
					r = (i[a >> 1] | 0) * 21299 >> 15;
					if((r | 0) > 32767) {
						o[f >> 2] = 1;
						r = 32767
					}
					w = Wt(i[p + (u << 1) >> 1] | 0, r & 65535, f) | 0;
					i[v + (u << 1) >> 1] = Wt(i[m + (u << 1) >> 1] | 0, w, f) | 0;
					n = i[S + (u << 1) >> 1] | 0;
					i[_ + (u << 1) >> 1] = Wt(n, w, f) | 0;
					i[a >> 1] = n;
					u = u + 1 | 0
				} while ((u | 0) != 10);
				Ti(v, 205, 10, f);
				Ti(_, 205, 10, f);
				u = e + 20 | 0;
				a = _;
				r = u + 20 | 0;
				do {
					t[u >> 0] = t[a >> 0] | 0;
					u = u + 1 | 0;
					a = a + 1 | 0
				} while ((u | 0) < (r | 0));
				mi(v, s, 10, f);
				mi(_, l, 10, f);
				c = b;
				return
			}

			function ar(e, r) {
				e = e | 0;
				r = r | 0;
				var n = 0,
					t = 0;
				if(!e) {
					t = -1;
					return t | 0
				}
				n = e;
				t = n + 20 | 0;
				do {
					i[n >> 1] = 0;
					n = n + 2 | 0
				} while ((n | 0) < (t | 0));
				qi(e + 20 | 0, r | 0, 20) | 0;
				t = 0;
				return t | 0
			}

			function sr(e) {
				e = e | 0;
				var r = 0,
					n = 0,
					a = 0,
					s = 0,
					l = 0;
				if(!e) {
					l = -1;
					return l | 0
				}
				i[e >> 1] = 0;
				i[e + 2 >> 1] = 8192;
				r = e + 4 | 0;
				i[r >> 1] = 3500;
				i[e + 6 >> 1] = 3500;
				o[e + 8 >> 2] = 1887529304;
				i[e + 12 >> 1] = 3e4;
				i[e + 14 >> 1] = 26e3;
				i[e + 16 >> 1] = 21e3;
				i[e + 18 >> 1] = 15e3;
				i[e + 20 >> 1] = 8e3;
				i[e + 22 >> 1] = 0;
				i[e + 24 >> 1] = -8e3;
				i[e + 26 >> 1] = -15e3;
				i[e + 28 >> 1] = -21e3;
				i[e + 30 >> 1] = -26e3;
				i[e + 32 >> 1] = 3e4;
				i[e + 34 >> 1] = 26e3;
				i[e + 36 >> 1] = 21e3;
				i[e + 38 >> 1] = 15e3;
				i[e + 40 >> 1] = 8e3;
				i[e + 42 >> 1] = 0;
				i[e + 44 >> 1] = -8e3;
				i[e + 46 >> 1] = -15e3;
				i[e + 48 >> 1] = -21e3;
				i[e + 50 >> 1] = -26e3;
				i[e + 212 >> 1] = 0;
				i[e + 374 >> 1] = 0;
				i[e + 392 >> 1] = 0;
				n = e + 52 | 0;
				i[n >> 1] = 1384;
				i[e + 54 >> 1] = 2077;
				i[e + 56 >> 1] = 3420;
				i[e + 58 >> 1] = 5108;
				i[e + 60 >> 1] = 6742;
				i[e + 62 >> 1] = 8122;
				i[e + 64 >> 1] = 9863;
				i[e + 66 >> 1] = 11092;
				i[e + 68 >> 1] = 12714;
				i[e + 70 >> 1] = 13701;
				a = e + 72 | 0;
				s = n;
				l = a + 20 | 0;
				do {
					t[a >> 0] = t[s >> 0] | 0;
					a = a + 1 | 0;
					s = s + 1 | 0
				} while ((a | 0) < (l | 0));
				a = e + 92 | 0;
				s = n;
				l = a + 20 | 0;
				do {
					t[a >> 0] = t[s >> 0] | 0;
					a = a + 1 | 0;
					s = s + 1 | 0
				} while ((a | 0) < (l | 0));
				a = e + 112 | 0;
				s = n;
				l = a + 20 | 0;
				do {
					t[a >> 0] = t[s >> 0] | 0;
					a = a + 1 | 0;
					s = s + 1 | 0
				} while ((a | 0) < (l | 0));
				a = e + 132 | 0;
				s = n;
				l = a + 20 | 0;
				do {
					t[a >> 0] = t[s >> 0] | 0;
					a = a + 1 | 0;
					s = s + 1 | 0
				} while ((a | 0) < (l | 0));
				a = e + 152 | 0;
				s = n;
				l = a + 20 | 0;
				do {
					t[a >> 0] = t[s >> 0] | 0;
					a = a + 1 | 0;
					s = s + 1 | 0
				} while ((a | 0) < (l | 0));
				a = e + 172 | 0;
				s = n;
				l = a + 20 | 0;
				do {
					t[a >> 0] = t[s >> 0] | 0;
					a = a + 1 | 0;
					s = s + 1 | 0
				} while ((a | 0) < (l | 0));
				a = e + 192 | 0;
				s = n;
				l = a + 20 | 0;
				do {
					t[a >> 0] = t[s >> 0] | 0;
					a = a + 1 | 0;
					s = s + 1 | 0
				} while ((a | 0) < (l | 0));
				Ki(e + 214 | 0, 0, 160) | 0;
				i[e + 376 >> 1] = 3500;
				i[e + 378 >> 1] = 3500;
				l = i[r >> 1] | 0;
				i[e + 380 >> 1] = l;
				i[e + 382 >> 1] = l;
				i[e + 384 >> 1] = l;
				i[e + 386 >> 1] = l;
				i[e + 388 >> 1] = l;
				i[e + 390 >> 1] = l;
				i[e + 394 >> 1] = 0;
				i[e + 396 >> 1] = 7;
				i[e + 398 >> 1] = 32767;
				i[e + 400 >> 1] = 0;
				i[e + 402 >> 1] = 0;
				i[e + 404 >> 1] = 0;
				o[e + 408 >> 2] = 1;
				i[e + 412 >> 1] = 0;
				l = 0;
				return l | 0
			}

			function lr(e, r, n, a, l, f, u, d, h, E, w, m) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				d = d | 0;
				h = h | 0;
				E = E | 0;
				w = w | 0;
				m = m | 0;
				var S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0,
					C = 0,
					I = 0,
					B = 0,
					L = 0,
					U = 0,
					x = 0,
					H = 0,
					z = 0,
					j = 0,
					Y = 0,
					V = 0,
					q = 0,
					K = 0,
					W = 0,
					X = 0,
					G = 0,
					J = 0,
					Z = 0;
				Z = c;
				c = c + 304 | 0;
				j = Z + 192 | 0;
				x = Z + 168 | 0;
				V = Z + 148 | 0;
				X = Z + 216 | 0;
				q = Z + 146 | 0;
				K = Z + 144 | 0;
				H = Z + 124 | 0;
				z = Z + 104 | 0;
				Y = Z + 84 | 0;
				W = Z + 60 | 0;
				L = Z + 40 | 0;
				B = Z;
				J = e + 404 | 0;
				G = e + 400 | 0;
				if((i[J >> 1] | 0) != 0 ? (i[G >> 1] | 0) != 0 : 0) {
					I = e + 394 | 0;
					i[I >> 1] = i[636 + (u << 1) >> 1] | 0;
					g = i[e + 212 >> 1] | 0;
					M = g + 10 | 0;
					qi(e + 52 + (((M & 65535 | 0) == 80 ? 0 : M << 16 >> 16) << 1) | 0, e + 52 + (g << 1) | 0, 20) | 0;
					g = i[e + 392 >> 1] | 0;
					M = g + 1 | 0;
					i[e + 376 + (((M & 65535 | 0) == 8 ? 0 : M << 16 >> 16) << 1) >> 1] = i[e + 376 + (g << 1) >> 1] | 0;
					M = e + 4 | 0;
					i[M >> 1] = 0;
					g = B + 36 | 0;
					R = B + 32 | 0;
					y = B + 28 | 0;
					O = B + 24 | 0;
					A = B + 20 | 0;
					T = B + 16 | 0;
					D = B + 12 | 0;
					N = B + 8 | 0;
					P = B + 4 | 0;
					C = e + 52 | 0;
					v = B;
					U = v + 40 | 0;
					do {
						o[v >> 2] = 0;
						v = v + 4 | 0
					} while ((v | 0) < (U | 0));
					p = 0;
					S = 7;
					while(1) {
						U = i[e + 376 + (S << 1) >> 1] | 0;
						F = U << 16 >> 16;
						if(U << 16 >> 16 < 0) F = ~((F ^ -8) >> 3);
						else F = F >>> 3;
						p = Wt(p, F & 65535, m) | 0;
						i[M >> 1] = p;
						b = S * 10 | 0;
						v = 9;
						while(1) {
							_ = B + (v << 2) | 0;
							k = o[_ >> 2] | 0;
							U = i[e + 52 + (v + b << 1) >> 1] | 0;
							F = U + k | 0;
							if((U ^ k | 0) > -1 & (F ^ k | 0) < 0) {
								o[m >> 2] = 1;
								F = (k >>> 31) + 2147483647 | 0
							}
							o[_ >> 2] = F;
							if((v | 0) > 0) v = v + -1 | 0;
							else break
						}
						if((S | 0) <= 0) break;
						else S = S + -1 | 0
					}
					i[L + 18 >> 1] = (o[g >> 2] | 0) >>> 3;
					i[L + 16 >> 1] = (o[R >> 2] | 0) >>> 3;
					i[L + 14 >> 1] = (o[y >> 2] | 0) >>> 3;
					i[L + 12 >> 1] = (o[O >> 2] | 0) >>> 3;
					i[L + 10 >> 1] = (o[A >> 2] | 0) >>> 3;
					i[L + 8 >> 1] = (o[T >> 2] | 0) >>> 3;
					i[L + 6 >> 1] = (o[D >> 2] | 0) >>> 3;
					i[L + 4 >> 1] = (o[N >> 2] | 0) >>> 3;
					i[L + 2 >> 1] = (o[P >> 2] | 0) >>> 3;
					i[L >> 1] = (o[B >> 2] | 0) >>> 3;
					mi(L, e + 12 | 0, 10, m);
					i[M >> 1] = Bi(i[M >> 1] | 0, i[I >> 1] | 0, m) | 0;
					Vi(e + 214 | 0, C | 0, 160) | 0;
					L = 9;
					while(1) {
						U = i[e + 214 + (L + 70 << 1) >> 1] | 0;
						_ = U << 16 >> 16;
						B = i[e + 214 + (L + 60 << 1) >> 1] | 0;
						v = (B << 16 >> 16) + _ | 0;
						if((B ^ U) << 16 >> 16 > -1 & (v ^ _ | 0) < 0) {
							o[m >> 2] = 1;
							v = (_ >>> 31) + 2147483647 | 0
						}
						U = i[e + 214 + (L + 50 << 1) >> 1] | 0;
						_ = U + v | 0;
						if((U ^ v | 0) > -1 & (_ ^ v | 0) < 0) {
							o[m >> 2] = 1;
							_ = (v >>> 31) + 2147483647 | 0
						}
						U = i[e + 214 + (L + 40 << 1) >> 1] | 0;
						v = U + _ | 0;
						if((U ^ _ | 0) > -1 & (v ^ _ | 0) < 0) {
							o[m >> 2] = 1;
							v = (_ >>> 31) + 2147483647 | 0
						}
						U = i[e + 214 + (L + 30 << 1) >> 1] | 0;
						_ = U + v | 0;
						if((U ^ v | 0) > -1 & (_ ^ v | 0) < 0) {
							o[m >> 2] = 1;
							_ = (v >>> 31) + 2147483647 | 0
						}
						U = i[e + 214 + (L + 20 << 1) >> 1] | 0;
						v = U + _ | 0;
						if((U ^ _ | 0) > -1 & (v ^ _ | 0) < 0) {
							o[m >> 2] = 1;
							v = (_ >>> 31) + 2147483647 | 0
						}
						U = i[e + 214 + (L + 10 << 1) >> 1] | 0;
						_ = U + v | 0;
						if((U ^ v | 0) > -1 & (_ ^ v | 0) < 0) {
							o[m >> 2] = 1;
							v = (v >>> 31) + 2147483647 | 0
						} else v = _;
						U = i[e + 214 + (L << 1) >> 1] | 0;
						_ = U + v | 0;
						if((U ^ v | 0) > -1 & (_ ^ v | 0) < 0) {
							o[m >> 2] = 1;
							_ = (v >>> 31) + 2147483647 | 0
						}
						if((_ | 0) < 0) _ = ~((_ ^ -8) >> 3);
						else _ = _ >>> 3;
						F = _ & 65535;
						b = i[654 + (L << 1) >> 1] | 0;
						k = 7;
						while(1) {
							S = e + 214 + ((k * 10 | 0) + L << 1) | 0;
							_ = Bi(i[S >> 1] | 0, F, m) | 0;
							i[S >> 1] = _;
							_ = (ee(b, _ << 16 >> 16) | 0) >> 15;
							if((_ | 0) > 32767) {
								o[m >> 2] = 1;
								_ = 32767
							}
							i[S >> 1] = _;
							p = (_ & 65535) - (_ >>> 15 & 1) | 0;
							p = p << 16 >> 31 ^ p;
							v = p & 65535;
							if(v << 16 >> 16 > 655) v = (((p << 16 >> 16) + 261489 | 0) >>> 2) + 655 & 65535;
							v = v << 16 >> 16 > 1310 ? 1310 : v;
							if(!(_ & 32768)) _ = v;
							else _ = 0 - (v & 65535) & 65535;
							i[S >> 1] = _;
							if((k | 0) > 0) k = k + -1 | 0;
							else break
						}
						if((L | 0) > 0) L = L + -1 | 0;
						else break
					}
				}
				if(i[G >> 1] | 0) {
					F = e + 32 | 0;
					k = e + 12 | 0;
					v = F;
					b = k;
					U = v + 20 | 0;
					do {
						t[v >> 0] = t[b >> 0] | 0;
						v = v + 1 | 0;
						b = b + 1 | 0
					} while ((v | 0) < (U | 0));
					b = e + 4 | 0;
					p = i[b >> 1] | 0;
					S = e + 6 | 0;
					i[S >> 1] = p;
					do
						if(i[e + 402 >> 1] | 0) {
							v = i[e >> 1] | 0;
							i[e >> 1] = 0;
							v = v << 16 >> 16 < 32 ? v : 32;
							U = v << 16 >> 16;
							_ = U << 10;
							if((_ | 0) != (U << 26 >> 16 | 0)) {
								o[m >> 2] = 1;
								_ = v << 16 >> 16 > 0 ? 32767 : -32768
							}
							if(v << 16 >> 16 > 1) _ = Gt(1024, _ & 65535) | 0;
							else _ = 16384;
							i[e + 2 >> 1] = _;
							ir(n, i[d >> 1] | 0, o[h + 60 >> 2] | 0);
							tr(n, 8, 0, d + 2 | 0, h, k, m);
							v = n;
							U = v + 20 | 0;
							do {
								t[v >> 0] = 0;
								v = v + 1 | 0
							} while ((v | 0) < (U | 0));
							p = i[d + 8 >> 1] | 0;
							p = p << 16 >> 16 == 0 ? -32768 : ((p + 64 & 65535) > 127 ? p << 16 >> 16 > 0 ? 32767 : 32768 : p << 16 >> 16 << 9) + 60416 & 65535;
							i[b >> 1] = p;
							if((i[e + 412 >> 1] | 0) != 0 ? (o[e + 408 >> 2] | 0) != 0 : 0) break;
							v = F;
							b = k;
							U = v + 20 | 0;
							do {
								t[v >> 0] = t[b >> 0] | 0;
								v = v + 1 | 0;
								b = b + 1 | 0
							} while ((v | 0) < (U | 0));
							i[S >> 1] = p
						}
					while(0);
					v = p << 16 >> 16;
					if(p << 16 >> 16 < 0) v = ~((v ^ -2) >> 1);
					else v = v >>> 1;
					v = v + 56536 | 0;
					_ = v << 16;
					if((_ | 0) > 0) v = 0;
					else v = (_ | 0) < -946077696 ? -14436 : v & 65535;
					i[a >> 1] = v;
					i[a + 2 >> 1] = v;
					i[a + 4 >> 1] = v;
					i[a + 6 >> 1] = v;
					d = ((v << 16 >> 16) * 5443 | 0) >>> 15 & 65535;
					i[a + 8 >> 1] = d;
					i[a + 10 >> 1] = d;
					i[a + 12 >> 1] = d;
					i[a + 14 >> 1] = d
				}
				v = ((i[636 + (u << 1) >> 1] | 0) * 104864 | 0) >>> 15 << 16;
				if((v | 0) < 0) v = ~((v >> 16 ^ -32) >> 5);
				else v = v >> 21;
				u = e + 394 | 0;
				i[u >> 1] = Wt(((i[u >> 1] | 0) * 29491 | 0) >>> 15 & 65535, v & 65535, m) | 0;
				a = (s[e >> 1] << 16) + 65536 | 0;
				v = a >> 16;
				h = e + 2 | 0;
				v = (ee(((a << 10 >> 26 | 0) == (v | 0) ? a >>> 6 : v >>> 15 ^ 32767) << 16 >> 16, i[h >> 1] | 0) | 0) >> 15;
				if((v | 0) > 32767) {
					o[m >> 2] = 1;
					v = 32767
				}
				p = v & 65535;
				if(p << 16 >> 16 <= 1024)
					if(p << 16 >> 16 < -2048) k = -32768;
					else k = v << 4 & 65535;
				else k = 16384;
				d = e + 4 | 0;
				F = k << 16 >> 16;
				_ = ee(i[d >> 1] | 0, F) | 0;
				if((_ | 0) == 1073741824) {
					o[m >> 2] = 1;
					L = 2147483647
				} else L = _ << 1;
				_ = (ee(i[e + 30 >> 1] | 0, F) | 0) >> 15;
				if((_ | 0) > 32767) {
					o[m >> 2] = 1;
					_ = 32767
				}
				M = _ & 65535;
				i[j + 18 >> 1] = M;
				_ = (ee(i[e + 28 >> 1] | 0, F) | 0) >> 15;
				if((_ | 0) > 32767) {
					o[m >> 2] = 1;
					_ = 32767
				}
				i[j + 16 >> 1] = _;
				_ = (ee(i[e + 26 >> 1] | 0, F) | 0) >> 15;
				if((_ | 0) > 32767) {
					o[m >> 2] = 1;
					_ = 32767
				}
				i[j + 14 >> 1] = _;
				_ = (ee(i[e + 24 >> 1] | 0, F) | 0) >> 15;
				if((_ | 0) > 32767) {
					o[m >> 2] = 1;
					_ = 32767
				}
				i[j + 12 >> 1] = _;
				_ = (ee(i[e + 22 >> 1] | 0, F) | 0) >> 15;
				if((_ | 0) > 32767) {
					o[m >> 2] = 1;
					_ = 32767
				}
				i[j + 10 >> 1] = _;
				_ = (ee(i[e + 20 >> 1] | 0, F) | 0) >> 15;
				if((_ | 0) > 32767) {
					o[m >> 2] = 1;
					_ = 32767
				}
				i[j + 8 >> 1] = _;
				_ = (ee(i[e + 18 >> 1] | 0, F) | 0) >> 15;
				if((_ | 0) > 32767) {
					o[m >> 2] = 1;
					_ = 32767
				}
				i[j + 6 >> 1] = _;
				_ = (ee(i[e + 16 >> 1] | 0, F) | 0) >> 15;
				if((_ | 0) > 32767) {
					o[m >> 2] = 1;
					_ = 32767
				}
				i[j + 4 >> 1] = _;
				_ = (ee(i[e + 14 >> 1] | 0, F) | 0) >> 15;
				if((_ | 0) > 32767) {
					o[m >> 2] = 1;
					_ = 32767
				}
				i[j + 2 >> 1] = _;
				_ = (ee(i[e + 12 >> 1] | 0, F) | 0) >> 15;
				if((_ | 0) > 32767) {
					o[m >> 2] = 1;
					_ = 32767
				}
				i[j >> 1] = _;
				a = e + 6 | 0;
				F = 16384 - (k & 65535) << 16 >> 16;
				_ = ee(i[a >> 1] | 0, F) | 0;
				if((_ | 0) != 1073741824) {
					v = (_ << 1) + L | 0;
					if((_ ^ L | 0) > 0 & (v ^ L | 0) < 0) {
						o[m >> 2] = 1;
						B = (L >>> 31) + 2147483647 | 0
					} else B = v
				} else {
					o[m >> 2] = 1;
					B = 2147483647
				}
				v = M;
				b = 9;
				while(1) {
					p = j + (b << 1) | 0;
					_ = (ee(i[e + 32 + (b << 1) >> 1] | 0, F) | 0) >> 15;
					if((_ | 0) > 32767) {
						o[m >> 2] = 1;
						_ = 32767
					}
					v = Wt(v, _ & 65535, m) | 0;
					i[p >> 1] = v;
					U = v << 16 >> 16;
					_ = U << 1;
					if((_ | 0) != (U << 17 >> 16 | 0)) {
						o[m >> 2] = 1;
						_ = v << 16 >> 16 > 0 ? 32767 : -32768
					}
					i[p >> 1] = _;
					_ = b + -1 | 0;
					if((b | 0) <= 0) break;
					v = i[j + (_ << 1) >> 1] | 0;
					b = _
				}
				L = e + 374 | 0;
				_ = ((s[L >> 1] << 16) + -161021952 >> 16) * 9830 >> 15;
				if((_ | 0) > 32767) {
					o[m >> 2] = 1;
					_ = 32767
				}
				_ = 4096 - (_ & 65535) | 0;
				v = _ << 16;
				if((v | 0) > 268369920) F = 32767;
				else F = (v | 0) < 0 ? 0 : _ << 19 >> 16;
				I = e + 8 | 0;
				_ = Ie(I, 3) | 0;
				Si(j, H, 10, m);
				v = z;
				b = H;
				U = v + 20 | 0;
				do {
					i[v >> 1] = i[b >> 1] | 0;
					v = v + 2 | 0;
					b = b + 2 | 0
				} while ((v | 0) < (U | 0));
				v = (_ << 16 >> 16) * 10 | 0;
				b = 9;
				while(1) {
					p = z + (b << 1) | 0;
					S = i[p >> 1] | 0;
					_ = (ee(i[e + 214 + (b + v << 1) >> 1] | 0, F) | 0) >> 15;
					if((_ | 0) > 32767) {
						o[m >> 2] = 1;
						_ = 32767
					}
					i[p >> 1] = Wt(S, _ & 65535, m) | 0;
					if((b | 0) > 0) b = b + -1 | 0;
					else break
				}
				Ti(H, 205, 10, m);
				Ti(z, 205, 10, m);
				v = n + 20 | 0;
				b = H;
				U = v + 20 | 0;
				do {
					t[v >> 0] = t[b >> 0] | 0;
					v = v + 1 | 0;
					b = b + 1 | 0
				} while ((v | 0) < (U | 0));
				mi(H, j, 10, m);
				mi(z, Y, 10, m);
				ci(j, x, m);
				ci(Y, W, m);
				v = w;
				b = x;
				U = v + 22 | 0;
				do {
					t[v >> 0] = t[b >> 0] | 0;
					v = v + 1 | 0;
					b = b + 1 | 0
				} while ((v | 0) < (U | 0));
				v = w + 22 | 0;
				b = x;
				U = v + 22 | 0;
				do {
					t[v >> 0] = t[b >> 0] | 0;
					v = v + 1 | 0;
					b = b + 1 | 0
				} while ((v | 0) < (U | 0));
				v = w + 44 | 0;
				b = x;
				U = v + 22 | 0;
				do {
					t[v >> 0] = t[b >> 0] | 0;
					v = v + 1 | 0;
					b = b + 1 | 0
				} while ((v | 0) < (U | 0));
				v = w + 66 | 0;
				b = x;
				U = v + 22 | 0;
				do {
					t[v >> 0] = t[b >> 0] | 0;
					v = v + 1 | 0;
					b = b + 1 | 0
				} while ((v | 0) < (U | 0));
				Ce(x + 2 | 0, V, m);
				_ = 0;
				v = 32767;
				do {
					p = i[V + (_ << 1) >> 1] | 0;
					p = ee(p, p) | 0;
					if(p >>> 0 < 1073741824) p = 32767 - (p >>> 15) | 0;
					else {
						o[m >> 2] = 1;
						p = 0
					}
					v = (ee(p << 16 >> 16, v << 16 >> 16) | 0) >> 15;
					if((v | 0) > 32767) {
						o[m >> 2] = 1;
						v = 32767
					}
					_ = _ + 1 | 0
				} while ((_ | 0) != 10);
				si(v << 16 >> 16, q, K, m);
				v = (s[q >> 1] << 16) + -983040 | 0;
				p = v >> 16;
				p = Pi(Bi(0, Wt(((v << 12 >> 28 | 0) == (p | 0) ? v >>> 4 : p >>> 15 ^ 32767) & 65535, Pi(i[K >> 1] | 0, 3, m) | 0, m) | 0, m) | 0, 1, m) | 0;
				v = (i[L >> 1] | 0) * 29491 >> 15;
				if((v | 0) > 32767) {
					o[m >> 2] = 1;
					v = 32767
				}
				_ = p << 16 >> 16;
				p = _ * 3277 >> 15;
				if((p | 0) > 32767) {
					o[m >> 2] = 1;
					p = 32767
				}
				i[L >> 1] = Wt(v & 65535, p & 65535, m) | 0;
				p = B >> 10;
				S = p + 262144 | 0;
				if((p | 0) > -1 & (S ^ p | 0) < 0) {
					o[m >> 2] = 1;
					S = (p >>> 31) + 2147483647 | 0
				}
				K = _ << 4;
				p = S - K | 0;
				if(((p ^ S) & (S ^ K) | 0) < 0) {
					o[m >> 2] = 1;
					S = (S >>> 31) + 2147483647 | 0
				} else S = p;
				K = i[u >> 1] << 5;
				p = K + S | 0;
				if((K ^ S | 0) > -1 & (p ^ S | 0) < 0) {
					o[m >> 2] = 1;
					p = (S >>> 31) + 2147483647 | 0
				}
				_ = (bi(p >>> 16 & 65535, p >>> 1 & 32767, m) | 0) << 16 >> 16;
				Be(I, X, m);
				S = 39;
				while(1) {
					v = X + (S << 1) | 0;
					p = (ee(i[v >> 1] | 0, _) | 0) >> 15;
					if((p | 0) > 32767) {
						o[m >> 2] = 1;
						p = 32767
					}
					i[v >> 1] = p;
					if((S | 0) > 0) S = S + -1 | 0;
					else break
				}
				Li(W, X, E, 40, r, 1);
				Be(I, X, m);
				S = 39;
				while(1) {
					v = X + (S << 1) | 0;
					p = (ee(i[v >> 1] | 0, _) | 0) >> 15;
					if((p | 0) > 32767) {
						o[m >> 2] = 1;
						p = 32767
					}
					i[v >> 1] = p;
					if((S | 0) > 0) S = S + -1 | 0;
					else break
				}
				Li(W, X, E + 80 | 0, 40, r, 1);
				Be(I, X, m);
				S = 39;
				while(1) {
					v = X + (S << 1) | 0;
					p = (ee(i[v >> 1] | 0, _) | 0) >> 15;
					if((p | 0) > 32767) {
						o[m >> 2] = 1;
						p = 32767
					}
					i[v >> 1] = p;
					if((S | 0) > 0) S = S + -1 | 0;
					else break
				}
				Li(W, X, E + 160 | 0, 40, r, 1);
				Be(I, X, m);
				v = 39;
				while(1) {
					S = X + (v << 1) | 0;
					p = (ee(i[S >> 1] | 0, _) | 0) >> 15;
					if((p | 0) > 32767) {
						o[m >> 2] = 1;
						p = 32767
					}
					i[S >> 1] = p;
					if((v | 0) > 0) v = v + -1 | 0;
					else break
				}
				Li(W, X, E + 240 | 0, 40, r, 1);
				i[l + 14 >> 1] = 20;
				i[l + 16 >> 1] = 0;
				if((f | 0) == 2) {
					p = i[e >> 1] | 0;
					p = p << 16 >> 16 > 32 ? 32 : p << 16 >> 16 < 1 ? 8 : p;
					E = p << 16 >> 16;
					S = E << 10;
					if((S | 0) != (E << 26 >> 16 | 0)) {
						o[m >> 2] = 1;
						S = p << 16 >> 16 > 0 ? 32767 : -32768
					}
					i[h >> 1] = Gt(1024, S & 65535) | 0;
					i[e >> 1] = 0;
					v = e + 32 | 0;
					b = e + 12 | 0;
					U = v + 20 | 0;
					do {
						t[v >> 0] = t[b >> 0] | 0;
						v = v + 1 | 0;
						b = b + 1 | 0
					} while ((v | 0) < (U | 0));
					m = i[d >> 1] | 0;
					i[a >> 1] = m;
					i[d >> 1] = (m & 65535) + 65280
				}
				if(!(i[G >> 1] | 0)) {
					c = Z;
					return
				}
				do
					if(!(i[e + 402 >> 1] | 0)) {
						if(i[J >> 1] | 0) break;
						c = Z;
						return
					}
				while(0);
				i[e >> 1] = 0;
				i[e + 412 >> 1] = 1;
				c = Z;
				return
			}

			function fr(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var a = 0,
					l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0;
				d = c;
				c = c + 16 | 0;
				f = d + 2 | 0;
				u = d;
				i[u >> 1] = 0;
				l = e + 212 | 0;
				a = (s[l >> 1] | 0) + 10 | 0;
				a = (a & 65535 | 0) == 80 ? 0 : a & 65535;
				i[l >> 1] = a;
				qi(e + 52 + (a << 16 >> 16 << 1) | 0, r | 0, 20) | 0;
				a = 0;
				l = 159;
				while(1) {
					h = i[n + (l << 1) >> 1] | 0;
					h = ee(h, h) | 0;
					h = (h | 0) == 1073741824 ? 2147483647 : h << 1;
					r = h + a | 0;
					if((h ^ a | 0) > -1 & (r ^ a | 0) < 0) {
						o[t >> 2] = 1;
						a = (a >>> 31) + 2147483647 | 0
					} else a = r;
					if((l | 0) > 0) l = l + -1 | 0;
					else break
				}
				si(a, f, u, t);
				a = i[f >> 1] | 0;
				h = a << 16 >> 16;
				r = h << 10;
				if((r | 0) != (h << 26 >> 16 | 0)) {
					o[t >> 2] = 1;
					r = a << 16 >> 16 > 0 ? 32767 : -32768
				}
				i[f >> 1] = r;
				h = i[u >> 1] | 0;
				a = h << 16 >> 16;
				if(h << 16 >> 16 < 0) a = ~((a ^ -32) >> 5);
				else a = a >>> 5;
				u = e + 392 | 0;
				h = (s[u >> 1] | 0) + 1 | 0;
				h = (h & 65535 | 0) == 8 ? 0 : h & 65535;
				i[u >> 1] = h;
				i[e + 376 + (h << 16 >> 16 << 1) >> 1] = a + 57015 + r;
				c = d;
				return
			}

			function ur(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					a = 0,
					l = 0,
					f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0;
				c = (r | 0) == 4;
				d = (r | 0) == 5;
				h = (r | 0) == 6;
				t = o[e + 408 >> 2] | 0;
				e: do
					if((r + -4 | 0) >>> 0 < 3) u = 4;
					else {
						if((t + -1 | 0) >>> 0 < 2) switch(r | 0) {
							case 2:
							case 3:
							case 7:
								{
									u = 4;
									break e
								}
							default:
								{}
						}
						i[e >> 1] = 0;
						f = 0
					}
				while(0);
				if((u | 0) == 4) {
					e: do
						if((t | 0) == 2) {
							switch(r | 0) {
								case 2:
								case 4:
								case 6:
								case 7:
									break;
								default:
									{
										a = 1;
										break e
									}
							}
							a = 2
						} else a = 1;while(0);f = (s[e >> 1] | 0) + 1 & 65535;i[e >> 1] = f;f = (r | 0) != 5 & f << 16 >> 16 > 50 ? 2 : a
				}
				l = e + 398 | 0;
				if(d & (i[e + 412 >> 1] | 0) == 0) {
					i[l >> 1] = 0;
					a = 0
				} else a = i[l >> 1] | 0;
				a = Wt(a, 1, n) | 0;
				i[l >> 1] = a;
				n = e + 404 | 0;
				i[n >> 1] = 0;
				e: do switch(r | 0) {
						case 2:
						case 4:
						case 5:
						case 6:
						case 7:
							{
								if(!((r | 0) == 7 & (f | 0) == 0)) {
									if(a << 16 >> 16 > 30) {
										i[n >> 1] = 1;
										i[l >> 1] = 0;
										i[e + 396 >> 1] = 0;
										break e
									}
									a = e + 396 | 0;
									t = i[a >> 1] | 0;
									if(!(t << 16 >> 16)) {
										i[l >> 1] = 0;
										break e
									} else {
										i[a >> 1] = (t & 65535) + 65535;
										break e
									}
								} else u = 14;
								break
							}
						default:
							u = 14
					}
					while(0);
					if((u | 0) == 14) i[e + 396 >> 1] = 7;
				if(!f) return f | 0;
				a = e + 400 | 0;
				i[a >> 1] = 0;
				t = e + 402 | 0;
				i[t >> 1] = 0;
				if(c) {
					i[a >> 1] = 1;
					return f | 0
				}
				if(d) {
					i[a >> 1] = 1;
					i[t >> 1] = 1;
					return f | 0
				}
				if(!h) return f | 0;
				i[a >> 1] = 1;
				i[n >> 1] = 0;
				return f | 0
			}

			function cr(e) {
				e = e | 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				i[e >> 1] = 1;
				i[e + 2 >> 1] = 1;
				i[e + 4 >> 1] = 1;
				i[e + 6 >> 1] = 1;
				i[e + 8 >> 1] = 1;
				i[e + 10 >> 1] = 0;
				i[e + 12 >> 1] = 1;
				e = 0;
				return e | 0
			}

			function dr(e, r, n, t, a) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				var s = 0,
					l = 0,
					f = 0,
					u = 0;
				u = c;
				c = c + 16 | 0;
				f = u + 2 | 0;
				l = u;
				s = ri(e, 5) | 0;
				e = e + 10 | 0;
				if((Bi(s, i[e >> 1] | 0, a) | 0) << 16 >> 16 > 0) s = i[e >> 1] | 0;
				s = (ee(i[674 + (n << 16 >> 16 << 1) >> 1] | 0, s << 16 >> 16) | 0) >> 15;
				if((s | 0) > 32767) {
					o[a >> 2] = 1;
					s = 32767
				}
				i[t >> 1] = s;
				$t(r, f, l, a);
				Qt(r, i[f >> 1] | 0, i[l >> 1] | 0);
				c = u;
				return
			}

			function hr(e, r, n, t, o) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				if(!(r << 16 >> 16)) {
					if(n << 16 >> 16) {
						r = e + 12 | 0;
						if((Bi(i[t >> 1] | 0, i[r >> 1] | 0, o) | 0) << 16 >> 16 > 0) i[t >> 1] = i[r >> 1] | 0
					} else r = e + 12 | 0;
					i[r >> 1] = i[t >> 1] | 0
				}
				i[e + 10 >> 1] = i[t >> 1] | 0;
				o = e + 2 | 0;
				i[e >> 1] = i[o >> 1] | 0;
				n = e + 4 | 0;
				i[o >> 1] = i[n >> 1] | 0;
				o = e + 6 | 0;
				i[n >> 1] = i[o >> 1] | 0;
				e = e + 8 | 0;
				i[o >> 1] = i[e >> 1] | 0;
				i[e >> 1] = i[t >> 1] | 0;
				return
			}

			function Er(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var a = 0;
				a = ri(e, 5) | 0;
				e = e + 10 | 0;
				if((Bi(a, i[e >> 1] | 0, t) | 0) << 16 >> 16 > 0) a = i[e >> 1] | 0;
				a = (ee(i[688 + (r << 16 >> 16 << 1) >> 1] | 0, a << 16 >> 16) | 0) >> 15;
				if((a | 0) <= 32767) {
					t = a;
					t = t & 65535;
					i[n >> 1] = t;
					return
				}
				o[t >> 2] = 1;
				t = 32767;
				t = t & 65535;
				i[n >> 1] = t;
				return
			}

			function wr(e) {
				e = e | 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				i[e >> 1] = 1640;
				i[e + 2 >> 1] = 1640;
				i[e + 4 >> 1] = 1640;
				i[e + 6 >> 1] = 1640;
				i[e + 8 >> 1] = 1640;
				i[e + 10 >> 1] = 0;
				i[e + 12 >> 1] = 16384;
				e = 0;
				return e | 0
			}

			function mr(e, r, n, t, o) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				if(!(r << 16 >> 16)) {
					if(n << 16 >> 16) {
						r = e + 12 | 0;
						if((Bi(i[t >> 1] | 0, i[r >> 1] | 0, o) | 0) << 16 >> 16 > 0) i[t >> 1] = i[r >> 1] | 0
					} else r = e + 12 | 0;
					i[r >> 1] = i[t >> 1] | 0
				}
				t = i[t >> 1] | 0;
				r = e + 10 | 0;
				i[r >> 1] = t;
				if((Bi(t, 16384, o) | 0) << 16 >> 16 > 0) {
					i[r >> 1] = 16384;
					r = 16384
				} else r = i[r >> 1] | 0;
				o = e + 2 | 0;
				i[e >> 1] = i[o >> 1] | 0;
				t = e + 4 | 0;
				i[o >> 1] = i[t >> 1] | 0;
				o = e + 6 | 0;
				i[t >> 1] = i[o >> 1] | 0;
				e = e + 8 | 0;
				i[o >> 1] = i[e >> 1] | 0;
				i[e >> 1] = r;
				return
			}

			function Sr(e, r, n, t, a, s, l) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				var f = 0,
					u = 0,
					c = 0;
				u = ri(n, 9) | 0;
				c = i[n + 16 >> 1] | 0;
				f = c << 16 >> 16;
				n = (f + (i[n + 14 >> 1] | 0) | 0) >>> 1;
				n = (f | 0) < (n << 16 >> 16 | 0) ? c : n & 65535;
				if(!(r << 16 >> 16 > 5 ? u << 16 >> 16 > r << 16 >> 16 : 0)) return 0;
				f = n << 16 >> 16;
				f = ((f << 18 >> 18 | 0) == (f | 0) ? f << 2 : f >>> 15 ^ 32767) & 65535;
				if(!(t << 16 >> 16 > 6 & a << 16 >> 16 == 0)) f = Bi(f, n, l) | 0;
				u = u << 16 >> 16 > f << 16 >> 16 ? f : u;
				c = _i(r) | 0;
				f = c << 16 >> 16;
				if(c << 16 >> 16 < 0) {
					n = 0 - f << 16;
					if((n | 0) < 983040) f = r << 16 >> 16 >> (n >> 16) & 65535;
					else f = 0
				} else {
					n = r << 16 >> 16;
					a = n << f;
					if((a << 16 >> 16 >> f | 0) == (n | 0)) f = a & 65535;
					else f = (n >>> 15 ^ 32767) & 65535
				}
				t = ee((Gt(16383, f) | 0) << 16 >> 16, u << 16 >> 16) | 0;
				if((t | 0) == 1073741824) {
					o[l >> 2] = 1;
					a = 2147483647
				} else a = t << 1;
				t = Bi(20, c, l) | 0;
				f = t << 16 >> 16;
				if(t << 16 >> 16 > 0) t = t << 16 >> 16 < 31 ? a >> f : 0;
				else {
					r = 0 - f << 16 >> 16;
					t = a << r;
					t = (t >> r | 0) == (a | 0) ? t : a >> 31 ^ 2147483647
				}
				t = (t | 0) > 32767 ? 32767 : t & 65535;
				t = s << 16 >> 16 != 0 & t << 16 >> 16 > 3072 ? 3072 : t << 16 >> 16;
				n = 0;
				do {
					a = e + (n << 1) | 0;
					f = ee(i[a >> 1] | 0, t) | 0;
					if((f | 0) == 1073741824) {
						o[l >> 2] = 1;
						f = 2147483647
					} else f = f << 1;
					i[a >> 1] = f >>> 11;
					n = n + 1 | 0
				} while ((n | 0) != 40);
				return 0
			}

			function pr(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var s = 0,
					l = 0,
					f = 0,
					u = 0;
				s = o[t + 104 >> 2] | 0;
				l = o[t + 96 >> 2] | 0;
				if(e >>> 0 >= 8) {
					i[n >> 1] = (a[r >> 0] | 0) >>> 4 & 1;
					i[n + 2 >> 1] = (a[r >> 0] | 0) >>> 5 & 1;
					i[n + 4 >> 1] = (a[r >> 0] | 0) >>> 6 & 1;
					i[n + 6 >> 1] = (a[r >> 0] | 0) >>> 7 & 255;
					s = s + (e << 1) | 0;
					if((i[s >> 1] | 0) > 1) {
						e = 1;
						t = 1;
						l = 4
					} else return;
					while(1) {
						f = r + e | 0;
						e = l | 1;
						i[n + (l << 16 >> 16 << 1) >> 1] = a[f >> 0] & 1;
						i[n + (e << 16 >> 16 << 1) >> 1] = (a[f >> 0] | 0) >>> 1 & 1;
						u = l | 3;
						i[n + (e + 1 << 16 >> 16 << 16 >> 16 << 1) >> 1] = (a[f >> 0] | 0) >>> 2 & 1;
						i[n + (u << 16 >> 16 << 1) >> 1] = (a[f >> 0] | 0) >>> 3 & 1;
						i[n + (u + 1 << 16 >> 16 << 16 >> 16 << 1) >> 1] = (a[f >> 0] | 0) >>> 4 & 1;
						i[n + (u + 2 << 16 >> 16 << 16 >> 16 << 1) >> 1] = (a[f >> 0] | 0) >>> 5 & 1;
						i[n + (u + 3 << 16 >> 16 << 16 >> 16 << 1) >> 1] = (a[f >> 0] | 0) >>> 6 & 1;
						i[n + (u + 4 << 16 >> 16 << 16 >> 16 << 1) >> 1] = (a[f >> 0] | 0) >>> 7 & 255;
						t = t + 1 << 16 >> 16;
						if(t << 16 >> 16 < (i[s >> 1] | 0)) {
							e = t << 16 >> 16;
							l = l + 8 << 16 >> 16
						} else break
					}
					return
				}
				u = o[(o[t + 100 >> 2] | 0) + (e << 2) >> 2] | 0;
				i[n + (i[u >> 1] << 1) >> 1] = (a[r >> 0] | 0) >>> 4 & 1;
				i[n + (i[u + 2 >> 1] << 1) >> 1] = (a[r >> 0] | 0) >>> 5 & 1;
				i[n + (i[u + 4 >> 1] << 1) >> 1] = (a[r >> 0] | 0) >>> 6 & 1;
				i[n + (i[u + 6 >> 1] << 1) >> 1] = (a[r >> 0] | 0) >>> 7 & 255;
				f = s + (e << 1) | 0;
				if((i[f >> 1] | 0) <= 1) return;
				t = l + (e << 1) | 0;
				s = 1;
				e = 1;
				l = 4;
				while(1) {
					s = r + s | 0;
					l = l << 16 >> 16;
					if((l | 0) < (i[t >> 1] | 0)) {
						i[n + (i[u + (l << 1) >> 1] << 1) >> 1] = a[s >> 0] & 1;
						l = l + 1 | 0;
						if((l | 0) < (i[t >> 1] | 0)) {
							i[n + (i[u + (l << 1) >> 1] << 1) >> 1] = (a[s >> 0] | 0) >>> 1 & 1;
							l = l + 1 | 0;
							if((l | 0) < (i[t >> 1] | 0)) {
								i[n + (i[u + (l << 1) >> 1] << 1) >> 1] = (a[s >> 0] | 0) >>> 2 & 1;
								l = l + 1 | 0;
								if((l | 0) < (i[t >> 1] | 0)) {
									i[n + (i[u + (l << 1) >> 1] << 1) >> 1] = (a[s >> 0] | 0) >>> 3 & 1;
									l = l + 1 | 0;
									if((l | 0) < (i[t >> 1] | 0)) {
										i[n + (i[u + (l << 1) >> 1] << 1) >> 1] = (a[s >> 0] | 0) >>> 4 & 1;
										l = l + 1 | 0;
										if((l | 0) < (i[t >> 1] | 0)) {
											i[n + (i[u + (l << 1) >> 1] << 1) >> 1] = (a[s >> 0] | 0) >>> 5 & 1;
											l = l + 1 | 0;
											if((l | 0) < (i[t >> 1] | 0)) {
												i[n + (i[u + (l << 1) >> 1] << 1) >> 1] = (a[s >> 0] | 0) >>> 6 & 1;
												l = l + 1 | 0;
												if((l | 0) < (i[t >> 1] | 0)) {
													i[n + (i[u + (l << 1) >> 1] << 1) >> 1] = (a[s >> 0] | 0) >>> 7 & 1;
													l = l + 1 | 0
												}
											}
										}
									}
								}
							}
						}
					}
					e = e + 1 << 16 >> 16;
					if(e << 16 >> 16 < (i[f >> 1] | 0)) s = e << 16 >> 16;
					else break
				}
				return
			}

			function vr(e, r, n, t, o) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				var a = 0,
					s = 0,
					l = 0,
					f = 0;
				switch(n << 16 >> 16) {
					case 0:
						{
							f = 9;
							while(1) {
								l = i[e + (f << 1) >> 1] | 0;
								n = l << 16 >> 16;
								if(l << 16 >> 16 < 0) n = ~((n ^ -4) >> 2);
								else n = n >>> 2;
								s = i[r + (f << 1) >> 1] | 0;
								a = s << 16 >> 16;
								if(s << 16 >> 16 < 0) s = ~((a ^ -4) >> 2);
								else s = a >>> 2;
								i[t + (f << 1) >> 1] = Wt((l & 65535) - n & 65535, s & 65535, o) | 0;
								if((f | 0) > 0) f = f + -1 | 0;
								else break
							}
							return
						}
					case 40:
						{
							s = 9;
							while(1) {
								o = i[e + (s << 1) >> 1] | 0;
								n = o << 16 >> 16;
								if(o << 16 >> 16 < 0) a = ~((n ^ -2) >> 1);
								else a = n >>> 1;
								o = i[r + (s << 1) >> 1] | 0;
								n = o << 16 >> 16;
								if(o << 16 >> 16 < 0) n = ~((n ^ -2) >> 1);
								else n = n >>> 1;
								i[t + (s << 1) >> 1] = n + a;
								if((s | 0) > 0) s = s + -1 | 0;
								else break
							}
							return
						}
					case 80:
						{
							f = 9;
							while(1) {
								l = i[e + (f << 1) >> 1] | 0;
								n = l << 16 >> 16;
								if(l << 16 >> 16 < 0) l = ~((n ^ -4) >> 2);
								else l = n >>> 2;
								n = i[r + (f << 1) >> 1] | 0;
								a = n << 16 >> 16;
								if(n << 16 >> 16 < 0) s = ~((a ^ -4) >> 2);
								else s = a >>> 2;
								i[t + (f << 1) >> 1] = Wt(l & 65535, (n & 65535) - s & 65535, o) | 0;
								if((f | 0) > 0) f = f + -1 | 0;
								else break
							}
							return
						}
					case 120:
						{
							i[t + 18 >> 1] = i[r + 18 >> 1] | 0;i[t + 16 >> 1] = i[r + 16 >> 1] | 0;i[t + 14 >> 1] = i[r + 14 >> 1] | 0;i[t + 12 >> 1] = i[r + 12 >> 1] | 0;i[t + 10 >> 1] = i[r + 10 >> 1] | 0;i[t + 8 >> 1] = i[r + 8 >> 1] | 0;i[t + 6 >> 1] = i[r + 6 >> 1] | 0;i[t + 4 >> 1] = i[r + 4 >> 1] | 0;i[t + 2 >> 1] = i[r + 2 >> 1] | 0;i[t >> 1] = i[r >> 1] | 0;
							return
						}
					default:
						return
				}
			}

			function _r(e, r) {
				e = e | 0;
				r = r | 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				qi(e | 0, r | 0, 20) | 0;
				e = 0;
				return e | 0
			}

			function br(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					a = 0,
					s = 0,
					l = 0,
					f = 0,
					u = 0,
					c = 0;
				c = 0;
				do {
					u = e + (c << 1) | 0;
					t = i[u >> 1] | 0;
					l = t & 65535;
					f = l << 16;
					t = t << 16 >> 16;
					if((t * 5243 | 0) == 1073741824) {
						o[n >> 2] = 1;
						s = 2147483647
					} else s = t * 10486 | 0;
					a = f - s | 0;
					if(((a ^ f) & (s ^ f) | 0) < 0) {
						o[n >> 2] = 1;
						s = (l >>> 15) + 2147483647 | 0
					} else s = a;
					t = i[r + (c << 1) >> 1] | 0;
					a = t * 5243 | 0;
					if((a | 0) != 1073741824) {
						t = (t * 10486 | 0) + s | 0;
						if((a ^ s | 0) > 0 & (t ^ s | 0) < 0) {
							o[n >> 2] = 1;
							t = (s >>> 31) + 2147483647 | 0
						}
					} else {
						o[n >> 2] = 1;
						t = 2147483647
					}
					i[u >> 1] = Ni(t, n) | 0;
					c = c + 1 | 0
				} while ((c | 0) != 10);
				return
			}

			function kr(e) {
				e = e | 0;
				var r = 0;
				if(!e) {
					r = -1;
					return r | 0
				}
				r = e + 18 | 0;
				do {
					i[e >> 1] = 0;
					e = e + 2 | 0
				} while ((e | 0) < (r | 0));
				r = 0;
				return r | 0
			}

			function Fr(e) {
				e = e | 0;
				i[e + 14 >> 1] = 1;
				return
			}

			function Mr(e) {
				e = e | 0;
				i[e + 14 >> 1] = 0;
				return
			}

			function gr(e, r, n, t, a, s, l, f, u, d) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				d = d | 0;
				var h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0;
				O = c;
				c = c + 160 | 0;
				g = O + 80 | 0;
				R = O;
				b = o[u + 120 >> 2] | 0;
				k = o[u + 124 >> 2] | 0;
				F = o[u + 128 >> 2] | 0;
				_ = o[u + 132 >> 2] | 0;
				E = e + 6 | 0;
				v = e + 8 | 0;
				i[v >> 1] = i[E >> 1] | 0;
				S = e + 4 | 0;
				i[E >> 1] = i[S >> 1] | 0;
				p = e + 2 | 0;
				i[S >> 1] = i[p >> 1] | 0;
				i[p >> 1] = i[e >> 1] | 0;
				i[e >> 1] = a;
				u = a << 16 >> 16 < 14746 ? a << 16 >> 16 > 9830 & 1 : 2;
				h = e + 12 | 0;
				a = i[h >> 1] | 0;
				w = a << 15;
				do
					if((w | 0) <= 536870911)
						if((w | 0) < -536870912) {
							o[d >> 2] = 1;
							a = -2147483648;
							break
						} else {
							a = a << 17;
							break
						}
				else {
					o[d >> 2] = 1;
					a = 2147483647
				} while (0);
				M = t << 16 >> 16;
				m = e + 16 | 0;
				if((Ni(a, d) | 0) << 16 >> 16 >= t << 16 >> 16) {
					w = i[m >> 1] | 0;
					if(w << 16 >> 16 > 0) {
						w = (w & 65535) + 65535 & 65535;
						i[m >> 1] = w
					}
					if(!(w << 16 >> 16)) {
						a = (i[e >> 1] | 0) < 9830;
						a = (i[p >> 1] | 0) < 9830 ? a ? 2 : 1 : a & 1;
						if((i[S >> 1] | 0) < 9830) a = (a & 65535) + 1 & 65535;
						if((i[E >> 1] | 0) < 9830) a = (a & 65535) + 1 & 65535;
						if((i[v >> 1] | 0) < 9830) a = (a & 65535) + 1 & 65535;
						w = 0;
						u = a << 16 >> 16 > 2 ? 0 : u
					}
				} else {
					i[m >> 1] = 2;
					w = 2
				}
				p = u << 16 >> 16;
				v = e + 10 | 0;
				p = (w << 16 >> 16 == 0 ? (p | 0) > ((i[v >> 1] | 0) + 1 | 0) : 0) ? p + 65535 & 65535 : u;
				e = (i[e + 14 >> 1] | 0) == 1 ? 0 : t << 16 >> 16 < 10 ? 2 : p << 16 >> 16 < 2 & w << 16 >> 16 > 0 ? (p & 65535) + 1 & 65535 : p;
				i[v >> 1] = e;
				i[h >> 1] = t;
				switch(r | 0) {
					case 4:
					case 6:
					case 7:
						break;
					default:
						if(e << 16 >> 16 < 2) {
							w = 0;
							u = 0;
							E = s;
							h = g;
							while(1) {
								if(!(i[E >> 1] | 0)) a = 0;
								else {
									u = u << 16 >> 16;
									i[R + (u << 1) >> 1] = w;
									a = i[E >> 1] | 0;
									u = u + 1 & 65535
								}
								i[h >> 1] = a;
								i[E >> 1] = 0;
								w = w + 1 << 16 >> 16;
								if(w << 16 >> 16 >= 40) {
									v = u;
									break
								} else {
									E = E + 2 | 0;
									h = h + 2 | 0
								}
							}
							p = e << 16 >> 16 == 0;
							p = (r | 0) == 5 ? p ? b : k : p ? F : _;
							if(v << 16 >> 16 > 0) {
								S = 0;
								do {
									m = i[R + (S << 1) >> 1] | 0;
									u = m << 16 >> 16;
									e = i[g + (u << 1) >> 1] | 0;
									if(m << 16 >> 16 < 40) {
										w = e << 16 >> 16;
										E = 39 - m & 65535;
										h = m;
										u = s + (u << 1) | 0;
										a = p;
										while(1) {
											r = (ee(i[a >> 1] | 0, w) | 0) >>> 15 & 65535;
											i[u >> 1] = Wt(i[u >> 1] | 0, r, d) | 0;
											h = h + 1 << 16 >> 16;
											if(h << 16 >> 16 >= 40) break;
											else {
												u = u + 2 | 0;
												a = a + 2 | 0
											}
										}
										if(m << 16 >> 16 > 0) {
											u = p + (E + 1 << 1) | 0;
											y = 36
										}
									} else {
										u = p;
										y = 36
									}
									if((y | 0) == 36) {
										y = 0;
										a = e << 16 >> 16;
										w = 0;
										E = s;
										while(1) {
											r = (ee(i[u >> 1] | 0, a) | 0) >>> 15 & 65535;
											i[E >> 1] = Wt(i[E >> 1] | 0, r, d) | 0;
											w = w + 1 << 16 >> 16;
											if(w << 16 >> 16 >= m << 16 >> 16) break;
											else {
												E = E + 2 | 0;
												u = u + 2 | 0
											}
										}
									}
									S = S + 1 | 0
								} while ((S & 65535) << 16 >> 16 != v << 16 >> 16)
							}
						}
				}
				S = l << 16 >> 16;
				p = M << 1;
				a = f << 16 >> 16;
				h = 0 - a << 16;
				u = h >> 16;
				if(f << 16 >> 16 > 0) {
					w = 0;
					E = n;
					while(1) {
						e = ee(i[n + (w << 1) >> 1] | 0, S) | 0;
						if((e | 0) == 1073741824) {
							o[d >> 2] = 1;
							h = 2147483647
						} else h = e << 1;
						f = ee(p, i[s >> 1] | 0) | 0;
						e = f + h | 0;
						if((f ^ h | 0) > -1 & (e ^ h | 0) < 0) {
							o[d >> 2] = 1;
							e = (h >>> 31) + 2147483647 | 0
						}
						f = e << a;
						i[E >> 1] = Ni((f >> a | 0) == (e | 0) ? f : e >> 31 ^ 2147483647, d) | 0;
						w = w + 1 | 0;
						if((w | 0) == 40) break;
						else {
							s = s + 2 | 0;
							E = E + 2 | 0
						}
					}
					c = O;
					return
				}
				if((h | 0) < 2031616) {
					w = 0;
					E = n;
					while(1) {
						e = ee(i[n + (w << 1) >> 1] | 0, S) | 0;
						if((e | 0) == 1073741824) {
							o[d >> 2] = 1;
							h = 2147483647
						} else h = e << 1;
						f = ee(p, i[s >> 1] | 0) | 0;
						e = f + h | 0;
						if((f ^ h | 0) > -1 & (e ^ h | 0) < 0) {
							o[d >> 2] = 1;
							e = (h >>> 31) + 2147483647 | 0
						}
						i[E >> 1] = Ni(e >> u, d) | 0;
						w = w + 1 | 0;
						if((w | 0) == 40) break;
						else {
							s = s + 2 | 0;
							E = E + 2 | 0
						}
					}
					c = O;
					return
				} else {
					E = 0;
					h = n;
					while(1) {
						e = ee(i[n + (E << 1) >> 1] | 0, S) | 0;
						if((e | 0) == 1073741824) {
							o[d >> 2] = 1;
							e = 2147483647
						} else e = e << 1;
						f = ee(p, i[s >> 1] | 0) | 0;
						if((f ^ e | 0) > -1 & (f + e ^ e | 0) < 0) o[d >> 2] = 1;
						i[h >> 1] = Ni(0, d) | 0;
						E = E + 1 | 0;
						if((E | 0) == 40) break;
						else {
							s = s + 2 | 0;
							h = h + 2 | 0
						}
					}
					c = O;
					return
				}
			}

			function Rr(e) {
				e = e | 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				i[e >> 1] = 0;
				i[e + 2 >> 1] = 0;
				i[e + 4 >> 1] = 0;
				i[e + 6 >> 1] = 0;
				i[e + 8 >> 1] = 0;
				i[e + 10 >> 1] = 0;
				e = 0;
				return e | 0
			}

			function yr(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var o = 0,
					a = 0,
					s = 0,
					l = 0,
					f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0;
				if(n << 16 >> 16 <= 0) return;
				o = e + 10 | 0;
				f = e + 8 | 0;
				c = e + 4 | 0;
				d = e + 6 | 0;
				h = e + 2 | 0;
				a = i[c >> 1] | 0;
				s = i[d >> 1] | 0;
				l = i[e >> 1] | 0;
				u = i[h >> 1] | 0;
				E = 0;
				while(1) {
					w = i[o >> 1] | 0;
					m = i[f >> 1] | 0;
					i[o >> 1] = m;
					S = i[r >> 1] | 0;
					i[f >> 1] = S;
					w = ((S << 16 >> 16) * 7699 | 0) + ((ee(l << 16 >> 16, -7667) | 0) + (((a << 16 >> 16) * 15836 | 0) + ((s << 16 >> 16) * 15836 >> 15)) + ((ee(u << 16 >> 16, -7667) | 0) >> 15)) + (ee(m << 16 >> 16, -15398) | 0) + ((w << 16 >> 16) * 7699 | 0) | 0;
					m = w << 3;
					w = (m >> 3 | 0) == (w | 0) ? m : w >> 31 ^ 2147483647;
					m = w << 1;
					i[r >> 1] = Ni((m >> 1 | 0) == (w | 0) ? m : w >> 31 ^ 2147483647, t) | 0;
					l = i[c >> 1] | 0;
					i[e >> 1] = l;
					u = i[d >> 1] | 0;
					i[h >> 1] = u;
					a = w >>> 16 & 65535;
					i[c >> 1] = a;
					s = (w >>> 1) - (w >> 16 << 15) & 65535;
					i[d >> 1] = s;
					E = E + 1 << 16 >> 16;
					if(E << 16 >> 16 >= n << 16 >> 16) break;
					else r = r + 2 | 0
				}
				return
			}

			function Or(e) {
				e = e | 0;
				if(!e) e = -1;
				else {
					i[e >> 1] = 0;
					e = 0
				}
				return e | 0
			}

			function Ar(e, r, n, t, a) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				var s = 0,
					l = 0,
					f = 0,
					u = 0;
				f = t << 16 >> 16;
				s = r + (f + -1 << 1) | 0;
				f = f + -2 | 0;
				u = i[s >> 1] | 0;
				if(t << 16 >> 16 < 2) t = n << 16 >> 16;
				else {
					t = n << 16 >> 16;
					l = 0;
					r = r + (f << 1) | 0;
					while(1) {
						n = (ee(i[r >> 1] | 0, t) | 0) >> 15;
						if((n | 0) > 32767) {
							o[a >> 2] = 1;
							n = 32767
						}
						i[s >> 1] = Bi(i[s >> 1] | 0, n & 65535, a) | 0;
						s = s + -2 | 0;
						l = l + 1 << 16 >> 16;
						if((l << 16 >> 16 | 0) > (f | 0)) break;
						else r = r + -2 | 0
					}
				}
				t = (ee(i[e >> 1] | 0, t) | 0) >> 15;
				if((t | 0) <= 32767) {
					f = t;
					f = f & 65535;
					l = i[s >> 1] | 0;
					a = Bi(l, f, a) | 0;
					i[s >> 1] = a;
					i[e >> 1] = u;
					return
				}
				o[a >> 2] = 1;
				f = 32767;
				f = f & 65535;
				l = i[s >> 1] | 0;
				a = Bi(l, f, a) | 0;
				i[s >> 1] = a;
				i[e >> 1] = u;
				return
			}

			function Tr(e) {
				e = e | 0;
				var r = 0,
					n = 0,
					t = 0;
				if(!e) {
					t = -1;
					return t | 0
				}
				Ki(e + 104 | 0, 0, 340) | 0;
				r = e + 102 | 0;
				n = e;
				t = n + 100 | 0;
				do {
					i[n >> 1] = 0;
					n = n + 2 | 0
				} while ((n | 0) < (t | 0));
				Te(r) | 0;
				Or(e + 100 | 0) | 0;
				t = 0;
				return t | 0
			}

			function Dr(e, r, n, a, s) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				a = a | 0;
				s = s | 0;
				var l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0;
				k = c;
				c = c + 96 | 0;
				p = k + 22 | 0;
				v = k;
				_ = k + 44 | 0;
				qi(e + 124 | 0, n | 0, 320) | 0;
				E = _ + 22 | 0;
				w = e + 100 | 0;
				m = e + 80 | 0;
				S = e + 102 | 0;
				if((r & -2 | 0) == 6) {
					h = 0;
					while(1) {
						Ui(a, 702, p);
						Ui(a, 722, v);
						d = e + 104 + (h + 10 << 1) | 0;
						Di(p, d, e, 40);
						f = _;
						l = p;
						r = f + 22 | 0;
						do {
							i[f >> 1] = i[l >> 1] | 0;
							f = f + 2 | 0;
							l = l + 2 | 0
						} while ((f | 0) < (r | 0));
						f = E;
						r = f + 22 | 0;
						do {
							i[f >> 1] = 0;
							f = f + 2 | 0
						} while ((f | 0) < (r | 0));
						Li(v, _, _, 22, E, 0);
						r = 0;
						f = 21;
						do {
							l = i[_ + (f << 16 >> 16 << 1) >> 1] | 0;
							l = ee(l, l) | 0;
							if((l | 0) == 1073741824) {
								b = 7;
								break
							}
							u = l << 1;
							l = u + r | 0;
							if((u ^ r | 0) > -1 & (l ^ r | 0) < 0) {
								o[s >> 2] = 1;
								r = (r >>> 31) + 2147483647 | 0
							} else r = l;
							f = f + -1 << 16 >> 16
						} while (f << 16 >> 16 > -1);
						if((b | 0) == 7) {
							b = 0;
							o[s >> 2] = 1
						}
						u = r >>> 16 & 65535;
						l = 20;
						r = 0;
						f = 20;
						while(1) {
							l = ee(i[_ + (l + 1 << 1) >> 1] | 0, i[_ + (l << 1) >> 1] | 0) | 0;
							if((l | 0) == 1073741824) {
								b = 13;
								break
							}
							F = l << 1;
							l = F + r | 0;
							if((F ^ r | 0) > -1 & (l ^ r | 0) < 0) {
								o[s >> 2] = 1;
								r = (r >>> 31) + 2147483647 | 0
							} else r = l;
							l = (f & 65535) + -1 << 16 >> 16;
							if(l << 16 >> 16 > -1) {
								l = l << 16 >> 16;
								f = f + -1 | 0
							} else break
						}
						if((b | 0) == 13) {
							b = 0;
							o[s >> 2] = 1
						}
						r = r >> 16;
						if((r | 0) < 1) r = 0;
						else r = Gt((r * 26214 | 0) >>> 15 & 65535, u) | 0;
						Ar(w, e, r, 40, s);
						r = n + (h << 1) | 0;
						Li(v, e, r, 40, m, 1);
						De(S, d, r, 29491, 40, s);
						r = (h << 16) + 2621440 | 0;
						if((r | 0) < 10485760) {
							h = r >> 16;
							a = a + 22 | 0
						} else break
					}
					f = e + 104 | 0;
					l = e + 424 | 0;
					r = f + 20 | 0;
					do {
						t[f >> 0] = t[l >> 0] | 0;
						f = f + 1 | 0;
						l = l + 1 | 0
					} while ((f | 0) < (r | 0));
					c = k;
					return
				} else {
					h = 0;
					while(1) {
						Ui(a, 742, p);
						Ui(a, 762, v);
						d = e + 104 + (h + 10 << 1) | 0;
						Di(p, d, e, 40);
						f = _;
						l = p;
						r = f + 22 | 0;
						do {
							i[f >> 1] = i[l >> 1] | 0;
							f = f + 2 | 0;
							l = l + 2 | 0
						} while ((f | 0) < (r | 0));
						f = E;
						r = f + 22 | 0;
						do {
							i[f >> 1] = 0;
							f = f + 2 | 0
						} while ((f | 0) < (r | 0));
						Li(v, _, _, 22, E, 0);
						r = 0;
						f = 21;
						do {
							l = i[_ + (f << 16 >> 16 << 1) >> 1] | 0;
							l = ee(l, l) | 0;
							if((l | 0) == 1073741824) {
								b = 22;
								break
							}
							F = l << 1;
							l = F + r | 0;
							if((F ^ r | 0) > -1 & (l ^ r | 0) < 0) {
								o[s >> 2] = 1;
								r = (r >>> 31) + 2147483647 | 0
							} else r = l;
							f = f + -1 << 16 >> 16
						} while (f << 16 >> 16 > -1);
						if((b | 0) == 22) {
							b = 0;
							o[s >> 2] = 1
						}
						u = r >>> 16 & 65535;
						l = 20;
						r = 0;
						f = 20;
						while(1) {
							l = ee(i[_ + (l + 1 << 1) >> 1] | 0, i[_ + (l << 1) >> 1] | 0) | 0;
							if((l | 0) == 1073741824) {
								b = 28;
								break
							}
							F = l << 1;
							l = F + r | 0;
							if((F ^ r | 0) > -1 & (l ^ r | 0) < 0) {
								o[s >> 2] = 1;
								r = (r >>> 31) + 2147483647 | 0
							} else r = l;
							l = (f & 65535) + -1 << 16 >> 16;
							if(l << 16 >> 16 > -1) {
								l = l << 16 >> 16;
								f = f + -1 | 0
							} else break
						}
						if((b | 0) == 28) {
							b = 0;
							o[s >> 2] = 1
						}
						r = r >> 16;
						if((r | 0) < 1) r = 0;
						else r = Gt((r * 26214 | 0) >>> 15 & 65535, u) | 0;
						Ar(w, e, r, 40, s);
						r = n + (h << 1) | 0;
						Li(v, e, r, 40, m, 1);
						De(S, d, r, 29491, 40, s);
						r = (h << 16) + 2621440 | 0;
						if((r | 0) < 10485760) {
							h = r >> 16;
							a = a + 22 | 0
						} else break
					}
					f = e + 104 | 0;
					l = e + 424 | 0;
					r = f + 20 | 0;
					do {
						t[f >> 0] = t[l >> 0] | 0;
						f = f + 1 | 0;
						l = l + 1 | 0
					} while ((f | 0) < (r | 0));
					c = k;
					return
				}
			}

			function Nr(e, r) {
				e = e | 0;
				r = r | 0;
				var n = 0,
					t = 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				o[e >> 2] = 0;
				n = xi(1764) | 0;
				if(!n) {
					e = -1;
					return e | 0
				}
				if((Ge(n) | 0) << 16 >> 16 == 0 ? (t = n + 1748 | 0, (Rr(t) | 0) << 16 >> 16 == 0) : 0) {
					Je(n, 0) | 0;
					Tr(n + 1304 | 0) | 0;
					Rr(t) | 0;
					o[n + 1760 >> 2] = 0;
					o[e >> 2] = n;
					e = 0;
					return e | 0
				}
				r = o[n >> 2] | 0;
				if(!r) {
					e = -1;
					return e | 0
				}
				Hi(r);
				o[n >> 2] = 0;
				e = -1;
				return e | 0
			}

			function Pr(e) {
				e = e | 0;
				var r = 0;
				if(!e) return;
				r = o[e >> 2] | 0;
				if(!r) return;
				Hi(r);
				o[e >> 2] = 0;
				return
			}

			function Cr(e, r, n, t, a) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				var l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0;
				b = c;
				c = c + 208 | 0;
				_ = b + 88 | 0;
				v = b;
				p = e + 1164 | 0;
				l = o[e + 1256 >> 2] | 0;
				if((t + -5 | 0) >>> 0 < 2) {
					S = l + 16 | 0;
					if((i[S >> 1] | 0) > 0) {
						m = o[(o[e + 1260 >> 2] | 0) + 32 >> 2] | 0;
						w = 0;
						l = 0;
						while(1) {
							E = m + (w << 1) | 0;
							d = i[E >> 1] | 0;
							if(d << 16 >> 16 > 0) {
								u = n;
								h = 0;
								f = 0;
								while(1) {
									f = s[u >> 1] | f << 1 & 131070;
									h = h + 1 << 16 >> 16;
									if(h << 16 >> 16 >= d << 16 >> 16) break;
									else u = u + 2 | 0
								}
								f = f & 65535
							} else f = 0;
							i[_ + (w << 1) >> 1] = f;
							l = l + 1 << 16 >> 16;
							if(l << 16 >> 16 < (i[S >> 1] | 0)) {
								n = n + (i[E >> 1] << 1) | 0;
								w = l << 16 >> 16
							} else break
						}
					}
				} else {
					m = l + (r << 1) | 0;
					if((i[m >> 1] | 0) > 0) {
						S = o[(o[e + 1260 >> 2] | 0) + (r << 2) >> 2] | 0;
						E = 0;
						l = 0;
						while(1) {
							w = S + (E << 1) | 0;
							d = i[w >> 1] | 0;
							if(d << 16 >> 16 > 0) {
								u = n;
								h = 0;
								f = 0;
								while(1) {
									f = s[u >> 1] | f << 1 & 131070;
									h = h + 1 << 16 >> 16;
									if(h << 16 >> 16 >= d << 16 >> 16) break;
									else u = u + 2 | 0
								}
								f = f & 65535
							} else f = 0;
							i[_ + (E << 1) >> 1] = f;
							l = l + 1 << 16 >> 16;
							if(l << 16 >> 16 < (i[m >> 1] | 0)) {
								n = n + (i[w >> 1] << 1) | 0;
								E = l << 16 >> 16
							} else break
						}
					}
				}
				Ze(e, r, _, t, a, v);
				Dr(e + 1304 | 0, r, a, v, p);
				yr(e + 1748 | 0, a, 160, p);
				l = 0;
				do {
					e = a + (l << 1) | 0;
					i[e >> 1] = s[e >> 1] & 65528;
					l = l + 1 | 0
				} while ((l | 0) != 160);
				c = b;
				return
			}

			function Ir(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var l = 0,
					f = 0,
					u = 0;
				f = o[t + 100 >> 2] | 0;
				u = (s[(o[t + 96 >> 2] | 0) + (e << 1) >> 1] | 0) + 65535 | 0;
				t = u & 65535;
				l = t << 16 >> 16 > -1;
				if(e >>> 0 < 8) {
					if(!l) return;
					f = o[f + (e << 2) >> 2] | 0;
					l = u << 16 >> 16;
					while(1) {
						i[n + (i[f + (l << 1) >> 1] << 1) >> 1] = (a[r + (l >> 3) >> 0] | 0) >>> (l & 7 ^ 7) & 1;
						t = t + -1 << 16 >> 16;
						if(t << 16 >> 16 > -1) l = t << 16 >> 16;
						else break
					}
					return
				} else {
					if(!l) return;
					l = u << 16 >> 16;
					while(1) {
						i[n + (l << 1) >> 1] = (a[r + (l >> 3) >> 0] | 0) >>> (l & 7 ^ 7) & 1;
						t = t + -1 << 16 >> 16;
						if(t << 16 >> 16 > -1) l = t << 16 >> 16;
						else break
					}
					return
				}
			}

			function Br(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				e = gt(e, n, 31764) | 0;
				return((kt(r) | 0 | e) << 16 >> 16 != 0) << 31 >> 31 | 0
			}

			function Lr(e, r) {
				e = e | 0;
				r = r | 0;
				Rt(e);
				Ft(r);
				return
			}

			function Ur(e, r, n, a, l, f, u) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				var d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0;
				m = c;
				c = c + 512 | 0;
				d = m + 8 | 0;
				h = m + 4 | 0;
				E = m;
				o[E >> 2] = 0;
				w = u << 16 >> 16 == 3;
				if(!((u & 65535) < 2 | w & 1)) {
					if(u << 16 >> 16 != 2) {
						l = -1;
						c = m;
						return l | 0
					}
					yt(e, n, a, d + 2 | 0, E);
					e = o[E >> 2] | 0;
					o[f >> 2] = e;
					Mt(r, e, h);
					r = o[h >> 2] | 0;
					i[d >> 1] = r;
					i[d + 490 >> 1] = (r | 0) == 3 ? -1 : n & 65535;
					t[l >> 0] = r;
					r = 1;
					do {
						d = d + 1 | 0;
						t[l + r >> 0] = t[d >> 0] | 0;
						r = r + 1 | 0
					} while ((r | 0) != 492);
					d = 492;
					c = m;
					return d | 0
				}
				yt(e, n, a, d, E);
				Mt(r, o[E >> 2] | 0, h);
				a = o[h >> 2] | 0;
				if((a | 0) != 3) {
					r = o[E >> 2] | 0;
					o[f >> 2] = r;
					if((r | 0) == 8) {
						switch(a | 0) {
							case 1:
								{
									i[d + 70 >> 1] = 0;
									break
								}
							case 2:
								{
									E = d + 70 | 0;i[E >> 1] = s[E >> 1] | 0 | 1;
									break
								}
							default:
								{}
						}
						i[d + 72 >> 1] = n & 1;
						i[d + 74 >> 1] = n >>> 1 & 1;
						i[d + 76 >> 1] = n >>> 2 & 1;
						r = 8
					}
				} else {
					o[f >> 2] = 15;
					r = 15
				}
				if(w) {
					Fn(r, d, l, (o[e + 4 >> 2] | 0) + 2392 | 0);
					l = i[3404 + (o[f >> 2] << 16 >> 16 << 1) >> 1] | 0;
					c = m;
					return l | 0
				}
				switch(u << 16 >> 16) {
					case 0:
						{
							kn(r, d, l, (o[e + 4 >> 2] | 0) + 2392 | 0);l = i[3404 + (o[f >> 2] << 16 >> 16 << 1) >> 1] | 0;c = m;
							return l | 0
						}
					case 1:
						{
							bn(r, d, l, (o[e + 4 >> 2] | 0) + 2392 | 0);l = i[3436 + (o[f >> 2] << 16 >> 16 << 1) >> 1] | 0;c = m;
							return l | 0
						}
					default:
						{
							l = -1;c = m;
							return l | 0
						}
				}
				return 0
			}

			function xr(e, r, n, t, o, a) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				a = a | 0;
				var s = 0,
					l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0;
				M = c;
				c = c + 480 | 0;
				F = M;
				a = 240;
				u = o;
				f = e;
				l = F;
				s = 0;
				while(1) {
					k = ((ee(i[u >> 1] | 0, i[f >> 1] | 0) | 0) + 16384 | 0) >>> 15;
					i[l >> 1] = k;
					k = k << 16;
					s = (ee(k >> 15, k >> 16) | 0) + s | 0;
					if((s | 0) < 0) {
						d = 4;
						break
					}
					a = a + -1 | 0;
					if(!((a & 65535) << 16 >> 16)) {
						a = 0;
						break
					} else {
						u = u + 2 | 0;
						f = f + 2 | 0;
						l = l + 2 | 0
					}
				}
				if((d | 0) == 4) {
					s = a & 65535;
					l = 240 - a | 0;
					if(!(s << 16 >> 16)) a = 0;
					else {
						u = s;
						f = o + (l << 1) | 0;
						a = e + (l << 1) | 0;
						s = F + (l << 1) | 0;
						while(1) {
							i[s >> 1] = ((ee(i[f >> 1] | 0, i[a >> 1] | 0) | 0) + 16384 | 0) >>> 15;
							u = u + -1 << 16 >> 16;
							if(!(u << 16 >> 16)) {
								a = 0;
								break
							} else {
								f = f + 2 | 0;
								a = a + 2 | 0;
								s = s + 2 | 0
							}
						}
					}
					do {
						f = a & 65535;
						a = 120;
						l = F;
						s = 0;
						while(1) {
							k = (i[l >> 1] | 0) >>> 2;
							_ = l + 2 | 0;
							i[l >> 1] = k;
							k = k << 16 >> 16;
							k = ee(k, k) | 0;
							b = (i[_ >> 1] | 0) >>> 2;
							i[_ >> 1] = b;
							b = b << 16 >> 16;
							s = ((ee(b, b) | 0) + k << 1) + s | 0;
							a = a + -1 << 16 >> 16;
							if(!(a << 16 >> 16)) break;
							else l = l + 4 | 0
						}
						a = f + 4 | 0
					} while ((s | 0) < 1)
				}
				k = s + 1 | 0;
				b = (vi(k) | 0) << 16 >> 16;
				k = k << b;
				i[n >> 1] = k >>> 16;
				i[t >> 1] = (k >>> 1) - (k >> 16 << 15);
				k = F + 478 | 0;
				u = r << 16 >> 16;
				if(r << 16 >> 16 <= 0) {
					F = b - a | 0;
					F = F & 65535;
					c = M;
					return F | 0
				}
				S = F + 476 | 0;
				p = b + 1 | 0;
				v = 239 - u | 0;
				_ = F + (236 - u << 1) | 0;
				r = u;
				n = n + (u << 1) | 0;
				t = t + (u << 1) | 0;
				while(1) {
					d = ee((v >>> 1) + 65535 & 65535, -2) | 0;
					f = F + (d + 236 << 1) | 0;
					d = _ + (d << 1) | 0;
					o = 240 - r | 0;
					m = o + -1 | 0;
					l = F + (m << 1) | 0;
					e = m >>> 1 & 65535;
					o = F + (o + -2 << 1) | 0;
					u = ee(i[k >> 1] | 0, i[l >> 1] | 0) | 0;
					if(!(e << 16 >> 16)) {
						d = o;
						f = S
					} else {
						w = S;
						E = k;
						while(1) {
							s = l + -4 | 0;
							h = E + -4 | 0;
							u = (ee(i[w >> 1] | 0, i[o >> 1] | 0) | 0) + u | 0;
							e = e + -1 << 16 >> 16;
							u = (ee(i[h >> 1] | 0, i[s >> 1] | 0) | 0) + u | 0;
							if(!(e << 16 >> 16)) break;
							else {
								o = l + -6 | 0;
								w = E + -6 | 0;
								l = s;
								E = h
							}
						}
					}
					if(m & 1) u = (ee(i[f >> 1] | 0, i[d >> 1] | 0) | 0) + u | 0;
					m = u << p;
					i[n >> 1] = m >>> 16;
					i[t >> 1] = (m >>> 1) - (m >> 16 << 15);
					if((r & 65535) + -1 << 16 >> 16 << 16 >> 16 > 0) {
						v = v + 1 | 0;
						_ = _ + 2 | 0;
						r = r + -1 | 0;
						n = n + -2 | 0;
						t = t + -2 | 0
					} else break
				}
				F = b - a | 0;
				F = F & 65535;
				c = M;
				return F | 0
			}

			function Hr(e, r, n, t, o, a, l, f) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				var u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0,
					C = 0,
					I = 0,
					B = 0;
				T = c;
				c = c + 3440 | 0;
				A = T + 3420 | 0;
				g = T + 3400 | 0;
				R = T + 3224 | 0;
				O = T;
				F = T + 3320 | 0;
				y = T + 3240 | 0;
				M = T + 24 | 0;
				cn(n, e, F, 2, f);
				bt(F, r, y, R, 5, g, 5, f);
				fn(n, y, M, f);
				vt(10, 5, 5, F, M, g, R, O, f);
				r = t;
				f = r + 80 | 0;
				do {
					i[r >> 1] = 0;
					r = r + 2 | 0
				} while ((r | 0) < (f | 0));
				i[a >> 1] = 65535;
				i[a + 2 >> 1] = 65535;
				i[a + 4 >> 1] = 65535;
				i[a + 6 >> 1] = 65535;
				i[a + 8 >> 1] = 65535;
				w = 0;
				m = O;
				S = A;
				do {
					e = i[m >> 1] | 0;
					m = m + 2 | 0;
					u = (e * 6554 | 0) >>> 15;
					d = u << 16 >> 16;
					r = t + (e << 1) | 0;
					f = i[r >> 1] | 0;
					if((i[y + (e << 1) >> 1] | 0) > 0) {
						i[r >> 1] = f + 4096;
						i[S >> 1] = 8192;
						h = u
					} else {
						i[r >> 1] = f + 61440;
						i[S >> 1] = -8192;
						h = d + 8 | 0
					}
					S = S + 2 | 0;
					E = h & 65535;
					r = e - (u << 2) - d << 16 >> 16;
					u = a + (r << 1) | 0;
					f = i[u >> 1] | 0;
					e = f << 16 >> 16;
					do
						if(f << 16 >> 16 >= 0) {
							d = h << 16 >> 16;
							if(!((d ^ e) & 8)) {
								r = a + (r + 5 << 1) | 0;
								if((e | 0) > (d | 0)) {
									i[r >> 1] = f;
									i[u >> 1] = E;
									break
								} else {
									i[r >> 1] = E;
									break
								}
							} else {
								r = a + (r + 5 << 1) | 0;
								if((e & 7) >>> 0 > (d & 7) >>> 0) {
									i[r >> 1] = E;
									break
								} else {
									i[r >> 1] = f;
									i[u >> 1] = E;
									break
								}
							}
						} else i[u >> 1] = E;
					while(0);
					w = w + 1 << 16 >> 16
				} while (w << 16 >> 16 < 10);
				S = A + 2 | 0;
				w = A + 4 | 0;
				h = A + 6 | 0;
				d = A + 8 | 0;
				u = A + 10 | 0;
				r = A + 12 | 0;
				f = A + 14 | 0;
				e = A + 16 | 0;
				p = A + 18 | 0;
				v = 40;
				_ = n + (0 - (i[O >> 1] | 0) << 1) | 0;
				b = n + (0 - (i[O + 2 >> 1] | 0) << 1) | 0;
				k = n + (0 - (i[O + 4 >> 1] | 0) << 1) | 0;
				F = n + (0 - (i[O + 6 >> 1] | 0) << 1) | 0;
				M = n + (0 - (i[O + 8 >> 1] | 0) << 1) | 0;
				g = n + (0 - (i[O + 10 >> 1] | 0) << 1) | 0;
				R = n + (0 - (i[O + 12 >> 1] | 0) << 1) | 0;
				y = n + (0 - (i[O + 14 >> 1] | 0) << 1) | 0;
				t = n + (0 - (i[O + 16 >> 1] | 0) << 1) | 0;
				m = n + (0 - (i[O + 18 >> 1] | 0) << 1) | 0;
				E = o;
				while(1) {
					B = (ee(i[A >> 1] | 0, i[_ >> 1] | 0) | 0) >> 7;
					I = (ee(i[S >> 1] | 0, i[b >> 1] | 0) | 0) >> 7;
					C = (ee(i[w >> 1] | 0, i[k >> 1] | 0) | 0) >> 7;
					P = (ee(i[h >> 1] | 0, i[F >> 1] | 0) | 0) >> 7;
					N = (ee(i[d >> 1] | 0, i[M >> 1] | 0) | 0) >> 7;
					D = (ee(i[u >> 1] | 0, i[g >> 1] | 0) | 0) >> 7;
					O = (ee(i[r >> 1] | 0, i[R >> 1] | 0) | 0) >> 7;
					n = (ee(i[f >> 1] | 0, i[y >> 1] | 0) | 0) >>> 7;
					o = (ee(i[e >> 1] | 0, i[t >> 1] | 0) | 0) >>> 7;
					i[E >> 1] = (B + 128 + I + C + P + N + D + O + n + o + ((ee(i[p >> 1] | 0, i[m >> 1] | 0) | 0) >>> 7) | 0) >>> 8;
					v = v + -1 << 16 >> 16;
					if(!(v << 16 >> 16)) break;
					else {
						_ = _ + 2 | 0;
						b = b + 2 | 0;
						k = k + 2 | 0;
						F = F + 2 | 0;
						M = M + 2 | 0;
						g = g + 2 | 0;
						R = R + 2 | 0;
						y = y + 2 | 0;
						t = t + 2 | 0;
						m = m + 2 | 0;
						E = E + 2 | 0
					}
				}
				r = 0;
				do {
					f = a + (r << 1) | 0;
					e = i[f >> 1] | 0;
					if((r | 0) < 5) e = (s[l + ((e & 7) << 1) >> 1] | e & 8) & 65535;
					else e = i[l + ((e & 7) << 1) >> 1] | 0;
					i[f >> 1] = e;
					r = r + 1 | 0
				} while ((r | 0) != 10);
				c = T;
				return
			}

			function zr(e, r, n, t, a, s, l, f) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				f = f | 0;
				var u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0,
					C = 0,
					I = 0,
					B = 0,
					L = 0,
					U = 0,
					x = 0;
				x = c;
				c = c + 3456 | 0;
				C = x + 3448 | 0;
				N = x + 3360 | 0;
				T = x + 3368 | 0;
				w = x + 3280 | 0;
				P = x + 3200 | 0;
				D = x;
				B = (t & 65535) << 17;
				U = n << 16 >> 16;
				I = n << 16 >> 16 < 40;
				if(I) {
					t = B >> 16;
					n = U;
					do {
						d = (ee(i[r + (n - U << 1) >> 1] | 0, t) | 0) >> 15;
						if((d | 0) > 32767) {
							o[f >> 2] = 1;
							d = 32767
						}
						A = r + (n << 1) | 0;
						i[A >> 1] = Wt(i[A >> 1] | 0, d & 65535, f) | 0;
						n = n + 1 | 0
					} while ((n & 65535) << 16 >> 16 != 40)
				}
				cn(r, e, T, 1, f);
				_t(T, P, w, 8);
				fn(r, P, D, f);
				A = N + 2 | 0;
				i[N >> 1] = 0;
				i[A >> 1] = 1;
				e = 1;
				d = 0;
				E = 1;
				w = 0;
				h = -1;
				do {
					y = i[2830 + (w << 1) >> 1] | 0;
					O = y << 16 >> 16;
					R = 0;
					do {
						M = i[2834 + (R << 1) >> 1] | 0;
						g = M << 16 >> 16;
						F = e;
						b = O;
						_ = E;
						k = y;
						v = h;
						while(1) {
							u = i[T + (b << 1) >> 1] | 0;
							S = i[D + (b * 80 | 0) + (b << 1) >> 1] | 0;
							n = g;
							E = 1;
							p = M;
							e = M;
							h = -1;
							while(1) {
								t = Wt(u, i[T + (n << 1) >> 1] | 0, f) | 0;
								t = t << 16 >> 16;
								t = (ee(t, t) | 0) >>> 15;
								m = (i[D + (b * 80 | 0) + (n << 1) >> 1] << 15) + 32768 + ((i[D + (n * 80 | 0) + (n << 1) >> 1] | 0) + S << 14) | 0;
								if(((ee(t << 16 >> 16, E << 16 >> 16) | 0) - (ee(m >> 16, h << 16 >> 16) | 0) << 1 | 0) > 0) {
									E = m >>> 16 & 65535;
									e = p;
									h = t & 65535
								}
								m = n + 5 | 0;
								p = m & 65535;
								if(p << 16 >> 16 >= 40) break;
								else n = m << 16 >> 16
							}
							if(((ee(h << 16 >> 16, _ << 16 >> 16) | 0) - (ee(E << 16 >> 16, v << 16 >> 16) | 0) << 1 | 0) > 0) {
								i[N >> 1] = k;
								i[A >> 1] = e;
								d = k
							} else {
								e = F;
								E = _;
								h = v
							}
							m = b + 5 | 0;
							k = m & 65535;
							if(k << 16 >> 16 >= 40) break;
							else {
								F = e;
								b = m << 16 >> 16;
								_ = E;
								v = h
							}
						}
						R = R + 1 | 0
					} while ((R | 0) != 4);
					w = w + 1 | 0
				} while ((w | 0) != 2);
				S = e;
				p = d;
				t = a;
				n = t + 80 | 0;
				do {
					i[t >> 1] = 0;
					t = t + 2 | 0
				} while ((t | 0) < (n | 0));
				E = p;
				n = 0;
				m = 0;
				t = 0;
				while(1) {
					d = E << 16 >> 16;
					u = i[P + (d << 1) >> 1] | 0;
					e = (d * 6554 | 0) >>> 15;
					E = e << 16;
					w = E >> 15;
					h = d - (w + (e << 3) << 16 >> 17) | 0;
					switch(h << 16 >> 16 | 0) {
						case 0:
							{
								w = E >> 10;e = 1;
								break
							}
						case 1:
							{
								if(!((n & 65535) << 16 >> 16)) e = 0;
								else {
									w = e << 22 >> 16 | 16;
									e = 1
								}
								break
							}
						case 2:
							{
								w = e << 22 >> 16 | 32;e = 1;
								break
							}
						case 3:
							{
								w = e << 17 >> 16 | 1;e = 0;
								break
							}
						case 4:
							{
								w = e << 22 >> 16 | 48;e = 1;
								break
							}
						default:
							{
								w = e;e = h & 65535
							}
					}
					w = w & 65535;
					h = a + (d << 1) | 0;
					if(u << 16 >> 16 > 0) {
						i[h >> 1] = 8191;
						i[C + (n << 1) >> 1] = 32767;
						d = e << 16 >> 16;
						if(e << 16 >> 16 < 0) {
							d = 0 - d << 16;
							if((d | 0) < 983040) d = 1 >>> (d >> 16) & 65535;
							else d = 0
						} else {
							D = 1 << d;
							d = (D << 16 >> 16 >> d | 0) == 1 ? D & 65535 : 32767
						}
						t = Wt(t, d, f) | 0
					} else {
						i[h >> 1] = -8192;
						i[C + (n << 1) >> 1] = -32768
					}
					d = Wt(m, w, f) | 0;
					n = n + 1 | 0;
					if((n | 0) == 2) {
						m = d;
						break
					}
					E = i[N + (n << 1) >> 1] | 0;
					m = d
				}
				i[l >> 1] = t;
				w = C + 2 | 0;
				E = i[C >> 1] | 0;
				e = 0;
				h = r + (0 - (p << 16 >> 16) << 1) | 0;
				d = r + (0 - (S << 16 >> 16) << 1) | 0;
				do {
					t = ee(i[h >> 1] | 0, E) | 0;
					h = h + 2 | 0;
					if((t | 0) != 1073741824 ? (L = t << 1, !((t | 0) > 0 & (L | 0) < 0)) : 0) u = L;
					else {
						o[f >> 2] = 1;
						u = 2147483647
					}
					n = ee(i[w >> 1] | 0, i[d >> 1] | 0) | 0;
					d = d + 2 | 0;
					if((n | 0) != 1073741824) {
						t = (n << 1) + u | 0;
						if((n ^ u | 0) > 0 & (t ^ u | 0) < 0) {
							o[f >> 2] = 1;
							t = (u >>> 31) + 2147483647 | 0
						}
					} else {
						o[f >> 2] = 1;
						t = 2147483647
					}
					i[s + (e << 1) >> 1] = Ni(t, f) | 0;
					e = e + 1 | 0
				} while ((e | 0) != 40);
				if(!I) {
					c = x;
					return m | 0
				}
				n = B >> 16;
				t = U;
				do {
					u = (ee(i[a + (t - U << 1) >> 1] | 0, n) | 0) >> 15;
					if((u | 0) > 32767) {
						o[f >> 2] = 1;
						u = 32767
					}
					s = a + (t << 1) | 0;
					i[s >> 1] = Wt(i[s >> 1] | 0, u & 65535, f) | 0;
					t = t + 1 | 0
				} while ((t & 65535) << 16 >> 16 != 40);
				c = x;
				return m | 0
			}

			function jr(e, r, n, t, a, s, l, f, u, d) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				d = d | 0;
				var h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0;
				F = c;
				c = c + 3456 | 0;
				S = F + 3360 | 0;
				p = F + 3368 | 0;
				v = F + 3280 | 0;
				_ = F + 3200 | 0;
				b = F;
				k = a << 16 >> 16;
				w = k << 1;
				if((w | 0) == (k << 17 >> 16 | 0)) m = w;
				else {
					o[d >> 2] = 1;
					m = a << 16 >> 16 > 0 ? 32767 : -32768
				}
				k = t << 16 >> 16;
				h = t << 16 >> 16 < 40;
				if(h) {
					a = m << 16 >> 16;
					E = k;
					do {
						t = n + (E << 1) | 0;
						w = (ee(i[n + (E - k << 1) >> 1] | 0, a) | 0) >> 15;
						if((w | 0) > 32767) {
							o[d >> 2] = 1;
							w = 32767
						}
						i[t >> 1] = Wt(i[t >> 1] | 0, w & 65535, d) | 0;
						E = E + 1 | 0
					} while ((E & 65535) << 16 >> 16 != 40)
				}
				cn(n, r, p, 1, d);
				_t(p, _, v, 8);
				fn(n, _, b, d);
				Yr(e, p, b, u, S);
				w = Vr(e, S, _, s, n, l, f, d) | 0;
				if(!h) {
					c = F;
					return w | 0
				}
				E = m << 16 >> 16;
				a = k;
				do {
					t = s + (a << 1) | 0;
					h = (ee(i[s + (a - k << 1) >> 1] | 0, E) | 0) >> 15;
					if((h | 0) > 32767) {
						o[d >> 2] = 1;
						h = 32767
					}
					i[t >> 1] = Wt(i[t >> 1] | 0, h & 65535, d) | 0;
					a = a + 1 | 0
				} while ((a & 65535) << 16 >> 16 != 40);
				c = F;
				return w | 0
			}

			function Yr(e, r, n, t, o) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				var a = 0,
					l = 0,
					f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0;
				F = o + 2 | 0;
				i[o >> 1] = 0;
				i[F >> 1] = 1;
				b = e << 16 >> 16 << 1;
				a = 1;
				k = 0;
				e = -1;
				do {
					_ = (k << 3) + b << 16 >> 16;
					u = i[t + (_ << 1) >> 1] | 0;
					_ = i[t + ((_ | 1) << 1) >> 1] | 0;
					l = u << 16 >> 16;
					e: do
						if(u << 16 >> 16 < 40) {
							v = _ << 16 >> 16;
							if(_ << 16 >> 16 < 40) p = a;
							else
								while(1) {
									if((e << 16 >> 16 | 0) < (0 - (a << 16 >> 16) | 0)) {
										i[o >> 1] = u;
										i[F >> 1] = _;
										f = 1;
										e = -1
									} else f = a;
									a = l + 5 | 0;
									u = a & 65535;
									if(u << 16 >> 16 >= 40) {
										a = f;
										break e
									} else {
										l = a << 16 >> 16;
										a = f
									}
								}
							while(1) {
								m = i[n + (l * 80 | 0) + (l << 1) >> 1] | 0;
								w = s[r + (l << 1) >> 1] | 0;
								E = v;
								a = 1;
								S = _;
								f = _;
								c = -1;
								while(1) {
									h = (s[r + (E << 1) >> 1] | 0) + w << 16 >> 16;
									h = (ee(h, h) | 0) >>> 15;
									d = (i[n + (l * 80 | 0) + (E << 1) >> 1] << 15) + 32768 + ((i[n + (E * 80 | 0) + (E << 1) >> 1] | 0) + m << 14) | 0;
									if(((ee(h << 16 >> 16, a << 16 >> 16) | 0) - (ee(d >> 16, c << 16 >> 16) | 0) << 1 | 0) > 0) {
										a = d >>> 16 & 65535;
										f = S;
										c = h & 65535
									}
									d = E + 5 | 0;
									S = d & 65535;
									if(S << 16 >> 16 >= 40) break;
									else E = d << 16 >> 16
								}
								if(((ee(c << 16 >> 16, p << 16 >> 16) | 0) - (ee(a << 16 >> 16, e << 16 >> 16) | 0) << 1 | 0) > 0) {
									i[o >> 1] = u;
									i[F >> 1] = f;
									e = c
								} else a = p;
								l = l + 5 | 0;
								u = l & 65535;
								if(u << 16 >> 16 >= 40) break;
								else {
									l = l << 16 >> 16;
									p = a
								}
							}
						}
					while(0);
					k = k + 1 | 0
				} while ((k | 0) != 2);
				return
			}

			function Vr(e, r, n, t, a, s, l, f) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				f = f | 0;
				var u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0;
				u = t;
				c = u + 80 | 0;
				do {
					i[u >> 1] = 0;
					u = u + 2 | 0
				} while ((u | 0) < (c | 0));
				u = i[r >> 1] | 0;
				E = (u * 6554 | 0) >>> 15;
				c = E << 16 >> 16;
				h = (748250 >>> ((u + (ee(c, -5) | 0) << 16 >> 16) + ((e << 16 >> 16) * 5 | 0) | 0) & 1 | 0) == 0;
				d = (i[n + (u << 1) >> 1] | 0) > 0;
				w = d ? 32767 : -32768;
				i[t + (u << 1) >> 1] = d ? 8191 : -8192;
				u = r + 2 | 0;
				e = i[u >> 1] | 0;
				t = t + (e << 1) | 0;
				if((i[n + (e << 1) >> 1] | 0) > 0) {
					i[t >> 1] = 8191;
					n = 32767;
					t = (d & 1 | 2) & 65535
				} else {
					i[t >> 1] = -8192;
					n = -32768;
					t = d & 1
				}
				E = ((e * 6554 | 0) >>> 15 << 3) + (h ? E : c + 64 | 0) & 65535;
				i[l >> 1] = t;
				h = 0;
				d = a + (0 - (i[r >> 1] | 0) << 1) | 0;
				t = a + (0 - (i[u >> 1] | 0) << 1) | 0;
				do {
					u = ee(w, i[d >> 1] | 0) | 0;
					d = d + 2 | 0;
					if((u | 0) == 1073741824) {
						o[f >> 2] = 1;
						e = 2147483647
					} else e = u << 1;
					c = ee(n, i[t >> 1] | 0) | 0;
					t = t + 2 | 0;
					if((c | 0) != 1073741824) {
						u = (c << 1) + e | 0;
						if((c ^ e | 0) > 0 & (u ^ e | 0) < 0) {
							o[f >> 2] = 1;
							u = (e >>> 31) + 2147483647 | 0
						}
					} else {
						o[f >> 2] = 1;
						u = 2147483647
					}
					i[s + (h << 1) >> 1] = Ni(u, f) | 0;
					h = h + 1 | 0
				} while ((h | 0) != 40);
				return E | 0
			}

			function qr(e, r, n, t, a, l, f, u) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				var d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0,
					C = 0,
					I = 0,
					B = 0,
					L = 0,
					U = 0,
					x = 0,
					H = 0,
					z = 0,
					j = 0,
					Y = 0,
					V = 0,
					q = 0,
					K = 0;
				K = c;
				c = c + 3440 | 0;
				U = K + 3360 | 0;
				x = K + 3280 | 0;
				z = K + 3200 | 0;
				H = K;
				Y = (t & 65535) << 17;
				q = n << 16 >> 16;
				j = n << 16 >> 16 < 40;
				if(j) {
					n = Y >> 16;
					d = q;
					do {
						t = (ee(i[r + (d - q << 1) >> 1] | 0, n) | 0) >> 15;
						if((t | 0) > 32767) {
							o[u >> 2] = 1;
							t = 32767
						}
						L = r + (d << 1) | 0;
						i[L >> 1] = Wt(i[L >> 1] | 0, t & 65535, u) | 0;
						d = d + 1 | 0
					} while ((d & 65535) << 16 >> 16 != 40)
				}
				cn(r, e, U, 1, u);
				_t(U, z, x, 6);
				fn(r, z, H, u);
				L = 1;
				h = 2;
				E = 1;
				t = 0;
				d = 1;
				e = -1;
				w = 1;
				while(1) {
					B = 2;
					p = 2;
					while(1) {
						P = 0;
						C = 0;
						I = w;
						N = p;
						while(1) {
							if(C << 16 >> 16 < 40) {
								O = I << 16 >> 16;
								A = I << 16 >> 16 < 40;
								T = N << 16 >> 16;
								D = N << 16 >> 16 < 40;
								R = C << 16 >> 16;
								y = C;
								while(1) {
									if((i[x + (R << 1) >> 1] | 0) > -1) {
										F = i[H + (R * 80 | 0) + (R << 1) >> 1] | 0;
										if(A) {
											M = s[U + (R << 1) >> 1] | 0;
											k = O;
											S = 1;
											g = I;
											n = I;
											p = 0;
											m = -1;
											while(1) {
												_ = (s[U + (k << 1) >> 1] | 0) + M | 0;
												b = _ << 16 >> 16;
												b = (ee(b, b) | 0) >>> 15;
												v = (i[H + (R * 80 | 0) + (k << 1) >> 1] << 15) + 32768 + ((i[H + (k * 80 | 0) + (k << 1) >> 1] | 0) + F << 14) | 0;
												if(((ee(b << 16 >> 16, S << 16 >> 16) | 0) - (ee(v >> 16, m << 16 >> 16) | 0) << 1 | 0) > 0) {
													S = v >>> 16 & 65535;
													n = g;
													p = _ & 65535;
													m = b & 65535
												}
												v = k + 5 | 0;
												g = v & 65535;
												if(g << 16 >> 16 >= 40) break;
												else k = v << 16 >> 16
											}
										} else {
											S = 1;
											n = I;
											p = 0
										}
										if(D) {
											M = p & 65535;
											g = n << 16 >> 16;
											k = (S << 16 >> 16 << 14) + 32768 | 0;
											b = T;
											p = 1;
											F = N;
											m = N;
											S = -1;
											while(1) {
												_ = (s[U + (b << 1) >> 1] | 0) + M << 16 >> 16;
												_ = (ee(_, _) | 0) >>> 15;
												v = k + (i[H + (b * 80 | 0) + (b << 1) >> 1] << 12) + ((i[H + (R * 80 | 0) + (b << 1) >> 1] | 0) + (i[H + (g * 80 | 0) + (b << 1) >> 1] | 0) << 13) | 0;
												if(((ee(_ << 16 >> 16, p << 16 >> 16) | 0) - (ee(v >> 16, S << 16 >> 16) | 0) << 1 | 0) > 0) {
													p = v >>> 16 & 65535;
													m = F;
													S = _ & 65535
												}
												v = b + 5 | 0;
												F = v & 65535;
												if(F << 16 >> 16 >= 40) {
													k = p;
													b = S;
													break
												} else b = v << 16 >> 16
											}
										} else {
											k = 1;
											m = N;
											b = -1
										}
										p = ee(b << 16 >> 16, d << 16 >> 16) | 0;
										if((p | 0) == 1073741824) {
											o[u >> 2] = 1;
											v = 2147483647
										} else v = p << 1;
										p = ee(k << 16 >> 16, e << 16 >> 16) | 0;
										if((p | 0) == 1073741824) {
											o[u >> 2] = 1;
											S = 2147483647
										} else S = p << 1;
										p = v - S | 0;
										if(((p ^ v) & (S ^ v) | 0) < 0) {
											o[u >> 2] = 1;
											p = (v >>> 31) + 2147483647 | 0
										}
										g = (p | 0) > 0;
										h = g ? m : h;
										E = g ? n : E;
										t = g ? y : t;
										d = g ? k : d;
										e = g ? b : e
									}
									p = R + 5 | 0;
									y = p & 65535;
									if(y << 16 >> 16 >= 40) break;
									else R = p << 16 >> 16
								}
							}
							P = P + 1 << 16 >> 16;
							if(P << 16 >> 16 >= 3) break;
							else {
								D = N;
								N = I;
								I = C;
								C = D
							}
						}
						n = B + 2 | 0;
						p = n & 65535;
						if(p << 16 >> 16 >= 5) break;
						else B = n & 65535
					}
					n = L + 2 | 0;
					w = n & 65535;
					if(w << 16 >> 16 < 4) L = n & 65535;
					else {
						p = h;
						h = E;
						break
					}
				}
				n = a;
				d = n + 80 | 0;
				do {
					i[n >> 1] = 0;
					n = n + 2 | 0
				} while ((n | 0) < (d | 0));
				b = t << 16 >> 16;
				e = i[z + (b << 1) >> 1] | 0;
				t = (b * 6554 | 0) >>> 15;
				n = t << 16;
				d = b - (((n >> 16) * 327680 | 0) >>> 16) | 0;
				switch(d << 16 >> 16 | 0) {
					case 1:
						{
							t = n >> 12;
							break
						}
					case 2:
						{
							t = n >> 8;d = 2;
							break
						}
					case 3:
						{
							t = t << 20 >> 16 | 8;d = 1;
							break
						}
					case 4:
						{
							t = t << 24 >> 16 | 128;d = 2;
							break
						}
					default:
						{}
				}
				n = a + (b << 1) | 0;
				if(e << 16 >> 16 > 0) {
					i[n >> 1] = 8191;
					g = 32767;
					E = 65536 << (d << 16 >> 16) >>> 16 & 65535
				} else {
					i[n >> 1] = -8192;
					g = -32768;
					E = 0
				}
				v = h << 16 >> 16;
				h = i[z + (v << 1) >> 1] | 0;
				n = (v * 6554 | 0) >>> 15;
				d = n << 16;
				e = v - (((d >> 16) * 327680 | 0) >>> 16) | 0;
				switch(e << 16 >> 16 | 0) {
					case 1:
						{
							n = d >> 12;
							break
						}
					case 2:
						{
							n = d >> 8;e = 2;
							break
						}
					case 3:
						{
							n = n << 20 >> 16 | 8;e = 1;
							break
						}
					case 4:
						{
							n = n << 24 >> 16 | 128;e = 2;
							break
						}
					default:
						{}
				}
				d = a + (v << 1) | 0;
				if(h << 16 >> 16 > 0) {
					i[d >> 1] = 8191;
					_ = 32767;
					E = (65536 << (e << 16 >> 16) >>> 16) + (E & 65535) & 65535
				} else {
					i[d >> 1] = -8192;
					_ = -32768
				}
				w = n + t | 0;
				S = p << 16 >> 16;
				h = i[z + (S << 1) >> 1] | 0;
				t = (S * 6554 | 0) >>> 15;
				n = t << 16;
				d = S - (((n >> 16) * 327680 | 0) >>> 16) | 0;
				switch(d << 16 >> 16 | 0) {
					case 1:
						{
							n = n >> 12;
							break
						}
					case 2:
						{
							n = n >> 8;d = 2;
							break
						}
					case 3:
						{
							n = t << 20 >> 16 | 8;d = 1;
							break
						}
					case 4:
						{
							n = t << 24 >> 16 | 128;d = 2;
							break
						}
					default:
						n = t
				}
				t = a + (S << 1) | 0;
				if(h << 16 >> 16 > 0) {
					i[t >> 1] = 8191;
					p = 32767;
					t = (65536 << (d << 16 >> 16) >>> 16) + (E & 65535) & 65535
				} else {
					i[t >> 1] = -8192;
					p = -32768;
					t = E
				}
				m = w + n | 0;
				i[f >> 1] = t;
				E = 0;
				w = r + (0 - b << 1) | 0;
				e = r + (0 - v << 1) | 0;
				h = r + (0 - S << 1) | 0;
				do {
					t = ee(i[w >> 1] | 0, g) | 0;
					w = w + 2 | 0;
					if((t | 0) != 1073741824 ? (V = t << 1, !((t | 0) > 0 & (V | 0) < 0)) : 0) d = V;
					else {
						o[u >> 2] = 1;
						d = 2147483647
					}
					t = ee(i[e >> 1] | 0, _) | 0;
					e = e + 2 | 0;
					if((t | 0) != 1073741824) {
						n = (t << 1) + d | 0;
						if((t ^ d | 0) > 0 & (n ^ d | 0) < 0) {
							o[u >> 2] = 1;
							n = (d >>> 31) + 2147483647 | 0
						}
					} else {
						o[u >> 2] = 1;
						n = 2147483647
					}
					d = ee(i[h >> 1] | 0, p) | 0;
					h = h + 2 | 0;
					if((d | 0) != 1073741824) {
						t = (d << 1) + n | 0;
						if((d ^ n | 0) > 0 & (t ^ n | 0) < 0) {
							o[u >> 2] = 1;
							t = (n >>> 31) + 2147483647 | 0
						}
					} else {
						o[u >> 2] = 1;
						t = 2147483647
					}
					i[l + (E << 1) >> 1] = Ni(t, u) | 0;
					E = E + 1 | 0
				} while ((E | 0) != 40);
				t = m & 65535;
				if(!j) {
					c = K;
					return t | 0
				}
				d = Y >> 16;
				n = q;
				do {
					e = (ee(i[a + (n - q << 1) >> 1] | 0, d) | 0) >> 15;
					if((e | 0) > 32767) {
						o[u >> 2] = 1;
						e = 32767
					}
					l = a + (n << 1) | 0;
					i[l >> 1] = Wt(i[l >> 1] | 0, e & 65535, u) | 0;
					n = n + 1 | 0
				} while ((n & 65535) << 16 >> 16 != 40);
				c = K;
				return t | 0
			}

			function Kr(e, r, n, t, a, l, f, u, d) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				d = d | 0;
				var h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0,
					C = 0,
					I = 0,
					B = 0,
					L = 0,
					U = 0,
					x = 0,
					H = 0,
					z = 0,
					j = 0,
					Y = 0,
					V = 0,
					q = 0,
					K = 0,
					W = 0,
					X = 0,
					G = 0,
					J = 0,
					Z = 0,
					Q = 0,
					$ = 0,
					re = 0,
					ne = 0,
					te = 0;
				te = c;
				c = c + 3456 | 0;
				Z = te + 3448 | 0;
				G = te + 3360 | 0;
				K = te + 3368 | 0;
				W = te + 3280 | 0;
				J = te + 3200 | 0;
				X = te;
				$ = (t & 65535) << 17;
				ne = n << 16 >> 16;
				Q = n << 16 >> 16 < 40;
				if(Q) {
					n = $ >> 16;
					h = ne;
					do {
						t = (ee(i[r + (h - ne << 1) >> 1] | 0, n) | 0) >> 15;
						if((t | 0) > 32767) {
							o[d >> 2] = 1;
							t = 32767
						}
						q = r + (h << 1) | 0;
						i[q >> 1] = Wt(i[q >> 1] | 0, t & 65535, d) | 0;
						h = h + 1 | 0
					} while ((h & 65535) << 16 >> 16 != 40)
				}
				cn(r, e, K, 1, d);
				_t(K, J, W, 4);
				fn(r, J, X, d);
				Y = G + 2 | 0;
				i[G >> 1] = 0;
				V = G + 4 | 0;
				i[Y >> 1] = 1;
				q = G + 6 | 0;
				i[V >> 1] = 2;
				i[q >> 1] = 3;
				S = 3;
				w = 2;
				E = 1;
				t = 0;
				n = 1;
				h = -1;
				m = 3;
				do {
					U = 0;
					x = 0;
					H = m;
					z = 1;
					j = 2;
					while(1) {
						if(x << 16 >> 16 < 40) {
							N = z << 16 >> 16;
							P = z << 16 >> 16 < 40;
							C = j << 16 >> 16;
							I = j << 16 >> 16 < 40;
							B = H << 16 >> 16;
							L = H << 16 >> 16 < 40;
							D = x << 16 >> 16;
							T = w;
							O = E;
							y = n;
							A = x;
							while(1) {
								if((i[W + (D << 1) >> 1] | 0) > -1) {
									v = i[X + (D * 80 | 0) + (D << 1) >> 1] | 0;
									if(P) {
										p = s[K + (D << 1) >> 1] | 0;
										_ = N;
										g = 1;
										w = z;
										E = z;
										F = 0;
										M = -1;
										while(1) {
											k = (s[K + (_ << 1) >> 1] | 0) + p | 0;
											b = k << 16 >> 16;
											b = (ee(b, b) | 0) >>> 15;
											R = (i[X + (D * 80 | 0) + (_ << 1) >> 1] << 15) + 32768 + ((i[X + (_ * 80 | 0) + (_ << 1) >> 1] | 0) + v << 14) | 0;
											if(((ee(b << 16 >> 16, g << 16 >> 16) | 0) - (ee(R >> 16, M << 16 >> 16) | 0) << 1 | 0) > 0) {
												g = R >>> 16 & 65535;
												E = w;
												F = k & 65535;
												M = b & 65535
											}
											R = _ + 5 | 0;
											w = R & 65535;
											if(w << 16 >> 16 >= 40) break;
											else _ = R << 16 >> 16
										}
									} else {
										g = 1;
										E = z;
										F = 0
									}
									if(I) {
										n = F & 65535;
										e = E << 16 >> 16;
										v = (g << 16 >> 16 << 14) + 32768 | 0;
										_ = C;
										R = 1;
										p = j;
										w = j;
										M = 0;
										F = -1;
										while(1) {
											k = (s[K + (_ << 1) >> 1] | 0) + n | 0;
											b = k << 16 >> 16;
											b = (ee(b, b) | 0) >>> 15;
											g = v + (i[X + (_ * 80 | 0) + (_ << 1) >> 1] << 12) + ((i[X + (D * 80 | 0) + (_ << 1) >> 1] | 0) + (i[X + (e * 80 | 0) + (_ << 1) >> 1] | 0) << 13) | 0;
											if(((ee(b << 16 >> 16, R << 16 >> 16) | 0) - (ee(g >> 16, F << 16 >> 16) | 0) << 1 | 0) > 0) {
												R = g >>> 16 & 65535;
												w = p;
												M = k & 65535;
												F = b & 65535
											}
											g = _ + 5 | 0;
											p = g & 65535;
											if(p << 16 >> 16 >= 40) break;
											else _ = g << 16 >> 16
										}
									} else {
										R = 1;
										w = j;
										M = 0
									}
									if(L) {
										v = M & 65535;
										p = w << 16 >> 16;
										e = E << 16 >> 16;
										b = (R & 65535) << 16 | 32768;
										k = B;
										n = 1;
										_ = H;
										g = H;
										R = -1;
										while(1) {
											F = (s[K + (k << 1) >> 1] | 0) + v << 16 >> 16;
											F = (ee(F, F) | 0) >>> 15;
											M = (i[X + (k * 80 | 0) + (k << 1) >> 1] << 12) + b + ((i[X + (e * 80 | 0) + (k << 1) >> 1] | 0) + (i[X + (p * 80 | 0) + (k << 1) >> 1] | 0) + (i[X + (D * 80 | 0) + (k << 1) >> 1] | 0) << 13) | 0;
											if(((ee(F << 16 >> 16, n << 16 >> 16) | 0) - (ee(M >> 16, R << 16 >> 16) | 0) << 1 | 0) > 0) {
												n = M >>> 16 & 65535;
												g = _;
												R = F & 65535
											}
											M = k + 5 | 0;
											_ = M & 65535;
											if(_ << 16 >> 16 >= 40) break;
											else k = M << 16 >> 16
										}
									} else {
										n = 1;
										g = H;
										R = -1
									}
									if(((ee(R << 16 >> 16, y << 16 >> 16) | 0) - (ee(n << 16 >> 16, h << 16 >> 16) | 0) << 1 | 0) > 0) {
										i[G >> 1] = A;
										i[Y >> 1] = E;
										i[V >> 1] = w;
										i[q >> 1] = g;
										S = g;
										t = A;
										h = R
									} else {
										w = T;
										E = O;
										n = y
									}
								} else {
									w = T;
									E = O;
									n = y
								}
								k = D + 5 | 0;
								A = k & 65535;
								if(A << 16 >> 16 >= 40) break;
								else {
									D = k << 16 >> 16;
									T = w;
									O = E;
									y = n
								}
							}
						}
						U = U + 1 << 16 >> 16;
						if(U << 16 >> 16 >= 4) break;
						else {
							B = j;
							L = H;
							j = z;
							z = x;
							H = B;
							x = L
						}
					}
					m = m + 1 << 16 >> 16
				} while (m << 16 >> 16 < 5);
				R = S;
				g = w;
				M = E;
				F = t;
				t = a;
				n = t + 80 | 0;
				do {
					i[t >> 1] = 0;
					t = t + 2 | 0
				} while ((t | 0) < (n | 0));
				e = F;
				n = 0;
				h = 0;
				t = 0;
				while(1) {
					w = e << 16 >> 16;
					m = i[J + (w << 1) >> 1] | 0;
					e = w * 13108 >> 16;
					E = w - ((e * 327680 | 0) >>> 16) | 0;
					e = i[u + (e << 1) >> 1] | 0;
					switch(E << 16 >> 16 | 0) {
						case 1:
							{
								S = e << 16 >> 16 << 3 & 65535;
								break
							}
						case 2:
							{
								S = e << 16 >> 16 << 6 & 65535;
								break
							}
						case 3:
							{
								S = e << 16 >> 16 << 10 & 65535;
								break
							}
						case 4:
							{
								S = ((e & 65535) << 10 | 512) & 65535;E = 3;
								break
							}
						default:
							S = e
					}
					e = a + (w << 1) | 0;
					if(m << 16 >> 16 > 0) {
						i[e >> 1] = 8191;
						e = 32767;
						t = (65536 << (E << 16 >> 16) >>> 16) + (t & 65535) & 65535
					} else {
						i[e >> 1] = -8192;
						e = -32768
					}
					i[Z + (n << 1) >> 1] = e;
					h = (S & 65535) + (h & 65535) | 0;
					n = n + 1 | 0;
					if((n | 0) == 4) {
						k = h;
						break
					}
					e = i[G + (n << 1) >> 1] | 0
				}
				i[f >> 1] = t;
				v = Z + 2 | 0;
				_ = Z + 4 | 0;
				b = Z + 6 | 0;
				e = i[Z >> 1] | 0;
				p = 0;
				E = r + (0 - (F << 16 >> 16) << 1) | 0;
				w = r + (0 - (M << 16 >> 16) << 1) | 0;
				m = r + (0 - (g << 16 >> 16) << 1) | 0;
				S = r + (0 - (R << 16 >> 16) << 1) | 0;
				do {
					t = ee(i[E >> 1] | 0, e) | 0;
					E = E + 2 | 0;
					if((t | 0) != 1073741824 ? (re = t << 1, !((t | 0) > 0 & (re | 0) < 0)) : 0) h = re;
					else {
						o[d >> 2] = 1;
						h = 2147483647
					}
					t = ee(i[v >> 1] | 0, i[w >> 1] | 0) | 0;
					w = w + 2 | 0;
					if((t | 0) != 1073741824) {
						n = (t << 1) + h | 0;
						if((t ^ h | 0) > 0 & (n ^ h | 0) < 0) {
							o[d >> 2] = 1;
							n = (h >>> 31) + 2147483647 | 0
						}
					} else {
						o[d >> 2] = 1;
						n = 2147483647
					}
					t = ee(i[_ >> 1] | 0, i[m >> 1] | 0) | 0;
					m = m + 2 | 0;
					if((t | 0) != 1073741824) {
						h = (t << 1) + n | 0;
						if((t ^ n | 0) > 0 & (h ^ n | 0) < 0) {
							o[d >> 2] = 1;
							h = (n >>> 31) + 2147483647 | 0
						}
					} else {
						o[d >> 2] = 1;
						h = 2147483647
					}
					n = ee(i[b >> 1] | 0, i[S >> 1] | 0) | 0;
					S = S + 2 | 0;
					if((n | 0) != 1073741824) {
						t = (n << 1) + h | 0;
						if((n ^ h | 0) > 0 & (t ^ h | 0) < 0) {
							o[d >> 2] = 1;
							t = (h >>> 31) + 2147483647 | 0
						}
					} else {
						o[d >> 2] = 1;
						t = 2147483647
					}
					i[l + (p << 1) >> 1] = Ni(t, d) | 0;
					p = p + 1 | 0
				} while ((p | 0) != 40);
				t = k & 65535;
				if(((ne << 16) + -2621440 | 0) > -1 | Q ^ 1) {
					c = te;
					return t | 0
				}
				h = $ >> 16;
				n = ne;
				do {
					e = (ee(i[a + (n - ne << 1) >> 1] | 0, h) | 0) >> 15;
					if((e | 0) > 32767) {
						o[d >> 2] = 1;
						e = 32767
					}
					l = a + (n << 1) | 0;
					i[l >> 1] = Wt(i[l >> 1] | 0, e & 65535, d) | 0;
					n = n + 1 | 0
				} while ((n & 65535) << 16 >> 16 != 40);
				c = te;
				return t | 0
			}

			function Wr(e, r, n, t, a, l, f) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				var u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0,
					C = 0,
					I = 0,
					B = 0,
					L = 0;
				L = c;
				c = c + 3440 | 0;
				v = L + 3424 | 0;
				N = L + 3408 | 0;
				P = L + 3240 | 0;
				_ = L + 3224 | 0;
				T = L + 3328 | 0;
				p = L + 3248 | 0;
				D = L + 24 | 0;
				B = L + 16 | 0;
				I = L;
				un(n, e, T, 2, 4, 4, f);
				bt(T, r, p, P, 4, N, 4, f);
				fn(n, p, D, f);
				vt(8, 4, 4, T, D, N, P, _, f);
				r = t;
				e = r + 80 | 0;
				do {
					i[r >> 1] = 0;
					r = r + 2 | 0
				} while ((r | 0) < (e | 0));
				i[I >> 1] = -1;
				i[B >> 1] = -1;
				O = I + 2 | 0;
				i[O >> 1] = -1;
				A = B + 2 | 0;
				i[A >> 1] = -1;
				T = I + 4 | 0;
				i[T >> 1] = -1;
				D = B + 4 | 0;
				i[D >> 1] = -1;
				P = I + 6 | 0;
				i[P >> 1] = -1;
				N = B + 6 | 0;
				i[N >> 1] = -1;
				m = 0;
				do {
					E = i[_ + (m << 1) >> 1] | 0;
					r = E >>> 2;
					d = r & 65535;
					e = E & 3;
					h = (i[p + (E << 1) >> 1] | 0) > 0;
					E = t + (E << 1) | 0;
					S = h & 1 ^ 1;
					i[E >> 1] = (s[E >> 1] | 0) + (h ? 8191 : 57345);
					i[v + (m << 1) >> 1] = h ? 32767 : -32768;
					h = I + (e << 1) | 0;
					E = i[h >> 1] | 0;
					do
						if(E << 16 >> 16 >= 0) {
							w = B + (e << 1) | 0;
							u = (E << 16 >> 16 | 0) <= (r << 16 >> 16 | 0);
							r = I + ((e | 4) << 1) | 0;
							if((S & 65535 | 0) == (s[w >> 1] & 1 | 0))
								if(u) {
									i[r >> 1] = d;
									break
								} else {
									i[r >> 1] = E;
									i[h >> 1] = d;
									i[w >> 1] = S;
									break
								}
							else if(u) {
								i[r >> 1] = E;
								i[h >> 1] = d;
								i[w >> 1] = S;
								break
							} else {
								i[r >> 1] = d;
								break
							}
						} else {
							i[h >> 1] = d;
							i[B + (e << 1) >> 1] = S
						}
					while(0);
					m = m + 1 | 0
				} while ((m | 0) != 8);
				b = v + 2 | 0;
				k = v + 4 | 0;
				F = v + 6 | 0;
				M = v + 8 | 0;
				g = v + 10 | 0;
				R = v + 12 | 0;
				y = v + 14 | 0;
				v = i[v >> 1] | 0;
				m = 0;
				w = n + (0 - (i[_ >> 1] | 0) << 1) | 0;
				E = n + (0 - (i[_ + 2 >> 1] | 0) << 1) | 0;
				h = n + (0 - (i[_ + 4 >> 1] | 0) << 1) | 0;
				d = n + (0 - (i[_ + 6 >> 1] | 0) << 1) | 0;
				r = n + (0 - (i[_ + 8 >> 1] | 0) << 1) | 0;
				e = n + (0 - (i[_ + 10 >> 1] | 0) << 1) | 0;
				u = n + (0 - (i[_ + 12 >> 1] | 0) << 1) | 0;
				n = n + (0 - (i[_ + 14 >> 1] | 0) << 1) | 0;
				do {
					S = ee(i[w >> 1] | 0, v) | 0;
					w = w + 2 | 0;
					if((S | 0) != 1073741824 ? (C = S << 1, !((S | 0) > 0 & (C | 0) < 0)) : 0) S = C;
					else {
						o[f >> 2] = 1;
						S = 2147483647
					}
					p = ee(i[b >> 1] | 0, i[E >> 1] | 0) | 0;
					E = E + 2 | 0;
					if((p | 0) != 1073741824) {
						t = (p << 1) + S | 0;
						if((p ^ S | 0) > 0 & (t ^ S | 0) < 0) {
							o[f >> 2] = 1;
							S = (S >>> 31) + 2147483647 | 0
						} else S = t
					} else {
						o[f >> 2] = 1;
						S = 2147483647
					}
					p = ee(i[k >> 1] | 0, i[h >> 1] | 0) | 0;
					h = h + 2 | 0;
					if((p | 0) != 1073741824) {
						t = (p << 1) + S | 0;
						if((p ^ S | 0) > 0 & (t ^ S | 0) < 0) {
							o[f >> 2] = 1;
							t = (S >>> 31) + 2147483647 | 0
						}
					} else {
						o[f >> 2] = 1;
						t = 2147483647
					}
					p = ee(i[F >> 1] | 0, i[d >> 1] | 0) | 0;
					d = d + 2 | 0;
					if((p | 0) != 1073741824) {
						S = (p << 1) + t | 0;
						if((p ^ t | 0) > 0 & (S ^ t | 0) < 0) {
							o[f >> 2] = 1;
							S = (t >>> 31) + 2147483647 | 0
						}
					} else {
						o[f >> 2] = 1;
						S = 2147483647
					}
					p = ee(i[M >> 1] | 0, i[r >> 1] | 0) | 0;
					r = r + 2 | 0;
					if((p | 0) != 1073741824) {
						t = (p << 1) + S | 0;
						if((p ^ S | 0) > 0 & (t ^ S | 0) < 0) {
							o[f >> 2] = 1;
							t = (S >>> 31) + 2147483647 | 0
						}
					} else {
						o[f >> 2] = 1;
						t = 2147483647
					}
					p = ee(i[g >> 1] | 0, i[e >> 1] | 0) | 0;
					e = e + 2 | 0;
					if((p | 0) != 1073741824) {
						S = (p << 1) + t | 0;
						if((p ^ t | 0) > 0 & (S ^ t | 0) < 0) {
							o[f >> 2] = 1;
							S = (t >>> 31) + 2147483647 | 0
						}
					} else {
						o[f >> 2] = 1;
						S = 2147483647
					}
					p = ee(i[R >> 1] | 0, i[u >> 1] | 0) | 0;
					u = u + 2 | 0;
					if((p | 0) != 1073741824) {
						t = (p << 1) + S | 0;
						if((p ^ S | 0) > 0 & (t ^ S | 0) < 0) {
							o[f >> 2] = 1;
							t = (S >>> 31) + 2147483647 | 0
						}
					} else {
						o[f >> 2] = 1;
						t = 2147483647
					}
					p = ee(i[y >> 1] | 0, i[n >> 1] | 0) | 0;
					n = n + 2 | 0;
					if((p | 0) != 1073741824) {
						S = (p << 1) + t | 0;
						if((p ^ t | 0) > 0 & (S ^ t | 0) < 0) {
							o[f >> 2] = 1;
							S = (t >>> 31) + 2147483647 | 0
						}
					} else {
						o[f >> 2] = 1;
						S = 2147483647
					}
					i[a + (m << 1) >> 1] = Ni(S, f) | 0;
					m = m + 1 | 0
				} while ((m | 0) != 40);
				i[l >> 1] = i[B >> 1] | 0;
				i[l + 2 >> 1] = i[A >> 1] | 0;
				i[l + 4 >> 1] = i[D >> 1] | 0;
				i[l + 6 >> 1] = i[N >> 1] | 0;
				e = i[I >> 1] | 0;
				r = i[I + 8 >> 1] | 0;
				u = i[O >> 1] | 0;
				i[l + 8 >> 1] = r << 1 & 2 | e & 1 | u << 2 & 4 | (((r >> 1) * 327680 | 0) + (e >>> 1 << 16) + (ee(u >> 1, 1638400) | 0) | 0) >>> 13 & 65528;
				u = i[T >> 1] | 0;
				e = i[I + 12 >> 1] | 0;
				r = i[I + 10 >> 1] | 0;
				i[l + 10 >> 1] = e << 1 & 2 | u & 1 | r << 2 & 4 | (((e >> 1) * 327680 | 0) + (u >>> 1 << 16) + (ee(r >> 1, 1638400) | 0) | 0) >>> 13 & 65528;
				r = i[I + 14 >> 1] | 0;
				u = i[P >> 1] | 0;
				e = u << 16 >> 16 >>> 1;
				if(!(r & 2)) {
					a = e;
					f = r << 16 >> 16;
					B = f >> 1;
					B = B * 327680 | 0;
					a = a << 16;
					B = a + B | 0;
					B = B << 5;
					B = B >> 16;
					B = B | 12;
					B = B * 2622 | 0;
					B = B >>> 16;
					a = u & 65535;
					a = a & 1;
					f = f << 17;
					f = f & 131072;
					B = B << 18;
					f = B | f;
					f = f >>> 16;
					a = f | a;
					a = a & 65535;
					l = l + 12 | 0;
					i[l >> 1] = a;
					c = L;
					return
				}
				a = 4 - (e << 16 >> 16) | 0;
				f = r << 16 >> 16;
				B = f >> 1;
				B = B * 327680 | 0;
				a = a << 16;
				B = a + B | 0;
				B = B << 5;
				B = B >> 16;
				B = B | 12;
				B = B * 2622 | 0;
				B = B >>> 16;
				a = u & 65535;
				a = a & 1;
				f = f << 17;
				f = f & 131072;
				B = B << 18;
				f = B | f;
				f = f >>> 16;
				a = f | a;
				a = a & 65535;
				l = l + 12 | 0;
				i[l >> 1] = a;
				c = L;
				return
			}

			function Xr(e, r, n, t, a) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				var s = 0,
					l = 0,
					f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0;
				S = n << 16 >> 16;
				s = 0 - S | 0;
				n = a + (s << 2) | 0;
				a = ((S - (t << 16 >> 16) | 0) >>> 2) + 1 & 65535;
				if(a << 16 >> 16 <= 0) return;
				S = r << 16 >> 16 >>> 1 & 65535;
				if(!(S << 16 >> 16)) {
					while(1) {
						o[n >> 2] = 0;
						o[n + 4 >> 2] = 0;
						o[n + 8 >> 2] = 0;
						o[n + 12 >> 2] = 0;
						if(a << 16 >> 16 > 1) {
							n = n + 16 | 0;
							a = a + -1 << 16 >> 16
						} else break
					}
					return
				}
				m = e + (s << 1) | 0;
				while(1) {
					c = m + 4 | 0;
					h = i[c >> 1] | 0;
					f = i[m >> 1] | 0;
					d = h;
					u = S;
					E = e;
					w = m;
					m = m + 8 | 0;
					l = 0;
					s = 0;
					t = 0;
					r = 0;
					while(1) {
						v = i[E >> 1] | 0;
						p = (ee(f << 16 >> 16, v) | 0) + l | 0;
						l = i[w + 2 >> 1] | 0;
						s = (ee(l, v) | 0) + s | 0;
						f = (ee(d << 16 >> 16, v) | 0) + t | 0;
						t = i[w + 6 >> 1] | 0;
						d = (ee(t, v) | 0) + r | 0;
						r = i[E + 2 >> 1] | 0;
						l = p + (ee(r, l) | 0) | 0;
						s = s + (ee(h << 16 >> 16, r) | 0) | 0;
						c = c + 4 | 0;
						t = f + (ee(r, t) | 0) | 0;
						f = i[c >> 1] | 0;
						r = d + (ee(f << 16 >> 16, r) | 0) | 0;
						u = u + -1 << 16 >> 16;
						if(!(u << 16 >> 16)) break;
						v = h;
						d = f;
						h = i[w + 8 >> 1] | 0;
						E = E + 4 | 0;
						w = w + 4 | 0;
						f = v
					}
					o[n >> 2] = l << 1;
					o[n + 4 >> 2] = s << 1;
					o[n + 8 >> 2] = t << 1;
					o[n + 12 >> 2] = r << 1;
					if(a << 16 >> 16 <= 1) break;
					else {
						n = n + 16 | 0;
						a = a + -1 << 16 >> 16
					}
				}
				return
			}

			function Gr(e, r, n, t, a, l, f, u, d) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				d = d | 0;
				var h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0;
				M = c;
				c = c + 16 | 0;
				k = M + 2 | 0;
				F = M;
				do
					if(a << 16 >> 16 > 0) {
						p = t << 16 >> 16;
						_ = 0;
						w = 0;
						t = 0;
						E = 0;
						v = 0;
						while(1) {
							h = i[e + (_ << 1) >> 1] | 0;
							m = h << 16 >> 16;
							w = (ee(m, m) | 0) + w | 0;
							m = i[r + (_ << 1) >> 1] | 0;
							t = (ee(m, m) | 0) + t | 0;
							E = (ee(i[n + (_ << 1) >> 1] | 0, m) | 0) + E | 0;
							m = ee(m, p) | 0;
							if((m | 0) == 1073741824) {
								o[d >> 2] = 1;
								S = 2147483647
							} else S = m << 1;
							m = S << 1;
							m = (Bi(h, Ni((m >> 1 | 0) == (S | 0) ? m : S >> 31 ^ 2147483647, d) | 0, d) | 0) << 16 >> 16;
							m = ee(m, m) | 0;
							if((m | 0) != 1073741824) {
								h = (m << 1) + v | 0;
								if((m ^ v | 0) > 0 & (h ^ v | 0) < 0) {
									o[d >> 2] = 1;
									h = (v >>> 31) + 2147483647 | 0
								}
							} else {
								o[d >> 2] = 1;
								h = 2147483647
							}
							_ = _ + 1 | 0;
							if((_ & 65535) << 16 >> 16 == a << 16 >> 16) {
								v = h;
								break
							} else v = h
						}
						w = w << 1;
						t = t << 1;
						E = E << 1;
						if((w | 0) >= 0) {
							if((w | 0) < 400) {
								h = v;
								b = 14;
								break
							}
						} else {
							o[d >> 2] = 1;
							w = 2147483647
						}
						S = vi(w) | 0;
						m = S << 16 >> 16;
						if(S << 16 >> 16 > 0) {
							h = w << m;
							if((h >> m | 0) != (w | 0)) h = w >> 31 ^ 2147483647
						} else {
							h = 0 - m << 16;
							if((h | 0) < 2031616) h = w >> (h >> 16);
							else h = 0
						}
						i[l >> 1] = h >>> 16;
						w = t;
						p = E;
						h = v;
						t = 15 - (S & 65535) & 65535
					} else {
						t = 0;
						E = 0;
						h = 0;
						b = 14
					}
				while(0);
				if((b | 0) == 14) {
					i[l >> 1] = 0;
					w = t;
					p = E;
					t = -15
				}
				i[f >> 1] = t;
				if((w | 0) < 0) {
					o[d >> 2] = 1;
					w = 2147483647
				}
				m = vi(w) | 0;
				E = m << 16 >> 16;
				if(m << 16 >> 16 > 0) {
					t = w << E;
					if((t >> E | 0) != (w | 0)) t = w >> 31 ^ 2147483647
				} else {
					t = 0 - E << 16;
					if((t | 0) < 2031616) t = w >> (t >> 16);
					else t = 0
				}
				i[l + 2 >> 1] = t >>> 16;
				i[f + 2 >> 1] = 15 - (m & 65535);
				w = vi(p) | 0;
				E = w << 16 >> 16;
				if(w << 16 >> 16 > 0) {
					t = p << E;
					if((t >> E | 0) != (p | 0)) t = p >> 31 ^ 2147483647
				} else {
					t = 0 - E << 16;
					if((t | 0) < 2031616) t = p >> (t >> 16);
					else t = 0
				}
				i[l + 4 >> 1] = t >>> 16;
				i[f + 4 >> 1] = 2 - (w & 65535);
				w = vi(h) | 0;
				t = w << 16 >> 16;
				if(w << 16 >> 16 > 0) {
					E = h << t;
					if((E >> t | 0) != (h | 0)) E = h >> 31 ^ 2147483647
				} else {
					t = 0 - t << 16;
					if((t | 0) < 2031616) E = h >> (t >> 16);
					else E = 0
				}
				t = E >>> 16 & 65535;
				h = 15 - (w & 65535) & 65535;
				i[l + 6 >> 1] = t;
				i[f + 6 >> 1] = h;
				if((E >> 16 | 0) <= 0) {
					d = 0;
					i[u >> 1] = d;
					c = M;
					return
				}
				E = i[l >> 1] | 0;
				if(!(E << 16 >> 16)) {
					d = 0;
					i[u >> 1] = d;
					c = M;
					return
				}
				t = Gt(Pi(E, 1, d) | 0, t) | 0;
				t = (t & 65535) << 16;
				E = ((Bi(h, i[f >> 1] | 0, d) | 0) & 65535) + 3 | 0;
				h = E & 65535;
				E = E << 16 >> 16;
				if(h << 16 >> 16 > 0) h = h << 16 >> 16 < 31 ? t >> E : 0;
				else {
					f = 0 - E << 16 >> 16;
					h = t << f;
					h = (h >> f | 0) == (t | 0) ? h : t >> 31 ^ 2147483647
				}
				si(h, k, F, d);
				F = Un((s[k >> 1] | 0) + 65509 & 65535, i[F >> 1] | 0, d) | 0;
				k = F << 13;
				d = Ni((k >> 13 | 0) == (F | 0) ? k : F >> 31 ^ 2147483647, d) | 0;
				i[u >> 1] = d;
				c = M;
				return
			}

			function Jr(e, r, n, t, a, l, f, u, d, h, E) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				d = d | 0;
				h = h | 0;
				E = E | 0;
				var w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0;
				M = c;
				c = c + 80 | 0;
				b = M;
				i[f >> 1] = i[l >> 1] | 0;
				i[u >> 1] = i[l + 2 >> 1] | 0;
				S = i[l + 4 >> 1] | 0;
				if(S << 16 >> 16 == -32768) S = 32767;
				else S = 0 - (S & 65535) & 65535;
				i[f + 2 >> 1] = S;
				i[u + 2 >> 1] = (s[l + 6 >> 1] | 0) + 1;
				switch(e | 0) {
					case 0:
					case 5:
						{
							_ = 0;m = 0;w = 0;v = 0;
							break
						}
					default:
						{
							_ = 0;m = 1;w = 1;v = 1
						}
				}
				while(1) {
					p = (i[a + (_ << 1) >> 1] | 0) >>> 3;
					i[b + (_ << 1) >> 1] = p;
					p = p << 16 >> 16;
					S = ee(p, p) | 0;
					if((S | 0) != 1073741824) {
						l = (S << 1) + m | 0;
						if((S ^ m | 0) > 0 & (l ^ m | 0) < 0) {
							o[E >> 2] = 1;
							m = (m >>> 31) + 2147483647 | 0
						} else m = l
					} else {
						o[E >> 2] = 1;
						m = 2147483647
					}
					S = ee(i[r + (_ << 1) >> 1] | 0, p) | 0;
					if((S | 0) != 1073741824) {
						l = (S << 1) + w | 0;
						if((S ^ w | 0) > 0 & (l ^ w | 0) < 0) {
							o[E >> 2] = 1;
							w = (w >>> 31) + 2147483647 | 0
						} else w = l
					} else {
						o[E >> 2] = 1;
						w = 2147483647
					}
					S = ee(i[t + (_ << 1) >> 1] | 0, p) | 0;
					if((S | 0) != 1073741824) {
						l = (S << 1) + v | 0;
						if((S ^ v | 0) > 0 & (l ^ v | 0) < 0) {
							o[E >> 2] = 1;
							l = (v >>> 31) + 2147483647 | 0
						}
					} else {
						o[E >> 2] = 1;
						l = 2147483647
					}
					_ = _ + 1 | 0;
					if((_ | 0) == 40) {
						t = l;
						p = w;
						break
					} else v = l
				}
				w = vi(m) | 0;
				l = w << 16 >> 16;
				if(w << 16 >> 16 > 0) {
					S = m << l;
					if((S >> l | 0) != (m | 0)) S = m >> 31 ^ 2147483647
				} else {
					S = 0 - l << 16;
					if((S | 0) < 2031616) S = m >> (S >> 16);
					else S = 0
				}
				a = f + 4 | 0;
				i[a >> 1] = S >>> 16;
				r = u + 4 | 0;
				i[r >> 1] = -3 - (w & 65535);
				m = vi(p) | 0;
				l = m << 16 >> 16;
				if(m << 16 >> 16 > 0) {
					S = p << l;
					if((S >> l | 0) != (p | 0)) S = p >> 31 ^ 2147483647
				} else {
					S = 0 - l << 16;
					if((S | 0) < 2031616) S = p >> (S >> 16);
					else S = 0
				}
				l = S >>> 16;
				i[f + 6 >> 1] = (l | 0) == 32768 ? 32767 : 0 - l & 65535;
				i[u + 6 >> 1] = 7 - (m & 65535);
				m = vi(t) | 0;
				l = m << 16 >> 16;
				if(m << 16 >> 16 > 0) {
					S = t << l;
					if((S >> l | 0) != (t | 0)) S = t >> 31 ^ 2147483647
				} else {
					S = 0 - l << 16;
					if((S | 0) < 2031616) S = t >> (S >> 16);
					else S = 0
				}
				i[f + 8 >> 1] = S >>> 16;
				i[u + 8 >> 1] = 7 - (m & 65535);
				switch(e | 0) {
					case 0:
					case 5:
						{
							S = 0;w = 0;
							break
						}
					default:
						{
							c = M;
							return
						}
				}
				do {
					w = (ee(i[b + (S << 1) >> 1] | 0, i[n + (S << 1) >> 1] | 0) | 0) + w | 0;
					S = S + 1 | 0
				} while ((S | 0) != 40);
				l = w << 1;
				S = vi(l) | 0;
				m = S << 16 >> 16;
				if(S << 16 >> 16 > 0) {
					w = l << m;
					if((w >> m | 0) == (l | 0)) {
						k = w;
						F = 40
					} else {
						k = l >> 31 ^ 2147483647;
						F = 40
					}
				} else {
					w = 0 - m << 16;
					if((w | 0) < 2031616) {
						k = l >> (w >> 16);
						F = 40
					}
				}
				if((F | 0) == 40 ? (k >> 16 | 0) >= 1 : 0) {
					E = Pi(k >>> 16 & 65535, 1, E) | 0;
					i[d >> 1] = Gt(E, i[a >> 1] | 0) | 0;
					i[h >> 1] = 65528 - (S & 65535) - (s[r >> 1] | 0);
					c = M;
					return
				}
				i[d >> 1] = 0;
				i[h >> 1] = 0;
				c = M;
				return
			}

			function Zr(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var a = 0,
					s = 0,
					l = 0;
				s = 0;
				a = 0;
				do {
					l = i[e + (s << 1) >> 1] | 0;
					a = (ee(l, l) | 0) + a | 0;
					s = s + 1 | 0
				} while ((s | 0) != 40);
				if((a | 0) < 0) {
					o[t >> 2] = 1;
					a = 2147483647
				}
				t = vi(a) | 0;
				e = t << 16 >> 16;
				if(t << 16 >> 16 > 0) {
					s = a << e;
					if((s >> e | 0) == (a | 0)) a = s;
					else a = a >> 31 ^ 2147483647
				} else {
					e = 0 - e << 16;
					if((e | 0) < 2031616) a = a >> (e >> 16);
					else a = 0
				}
				i[n >> 1] = a >>> 16;
				i[r >> 1] = 16 - (t & 65535);
				return
			}

			function Qr(e, r, n, t, a, s, l, f, u, d, h, E, w) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				d = d | 0;
				h = h | 0;
				E = E | 0;
				w = w | 0;
				var m = 0,
					S = 0,
					p = 0,
					v = 0;
				S = c;
				c = c + 16 | 0;
				m = S;
				if(d >>> 0 < 2) {
					l = jr(h, e, r, n, t, l, f, m, o[E + 76 >> 2] | 0, w) | 0;
					w = o[u >> 2] | 0;
					i[w >> 1] = l;
					l = i[m >> 1] | 0;
					o[u >> 2] = w + 4;
					i[w + 2 >> 1] = l;
					c = S;
					return
				}
				switch(d | 0) {
					case 2:
						{
							l = zr(e, r, n, t, l, f, m, w) | 0;w = o[u >> 2] | 0;i[w >> 1] = l;l = i[m >> 1] | 0;o[u >> 2] = w + 4;i[w + 2 >> 1] = l;c = S;
							return
						}
					case 3:
						{
							l = qr(e, r, n, t, l, f, m, w) | 0;w = o[u >> 2] | 0;i[w >> 1] = l;l = i[m >> 1] | 0;o[u >> 2] = w + 4;i[w + 2 >> 1] = l;c = S;
							return
						}
					default:
						{
							if((d & -2 | 0) == 4) {
								l = Kr(e, r, n, t, l, f, m, o[E + 36 >> 2] | 0, w) | 0;
								w = o[u >> 2] | 0;
								i[w >> 1] = l;
								l = i[m >> 1] | 0;
								o[u >> 2] = w + 4;
								i[w + 2 >> 1] = l;
								c = S;
								return
							}
							if((d | 0) != 6) {
								h = a << 16 >> 16;
								h = (h << 17 >> 17 | 0) == (h | 0) ? h << 1 : h >>> 15 ^ 32767;
								a = n << 16 >> 16 < 40;
								if(!a) {
									Hr(e, s, r, l, f, o[u >> 2] | 0, o[E + 36 >> 2] | 0, w);
									o[u >> 2] = (o[u >> 2] | 0) + 20;
									c = S;
									return
								}
								m = n << 16 >> 16;
								d = h << 16 >> 16;
								t = m;
								do {
									v = (ee(i[r + (t - m << 1) >> 1] | 0, d) | 0) >>> 15 & 65535;
									p = r + (t << 1) | 0;
									i[p >> 1] = Wt(i[p >> 1] | 0, v, w) | 0;
									t = t + 1 | 0
								} while ((t & 65535) << 16 >> 16 != 40);
								Hr(e, s, r, l, f, o[u >> 2] | 0, o[E + 36 >> 2] | 0, w);
								o[u >> 2] = (o[u >> 2] | 0) + 20;
								if(!a) {
									c = S;
									return
								}
								a = n << 16 >> 16;
								d = h << 16 >> 16;
								m = a;
								do {
									t = (ee(i[l + (m - a << 1) >> 1] | 0, d) | 0) >> 15;
									if((t | 0) > 32767) {
										o[w >> 2] = 1;
										t = 32767
									}
									v = l + (m << 1) | 0;
									i[v >> 1] = Wt(i[v >> 1] | 0, t & 65535, w) | 0;
									m = m + 1 | 0
								} while ((m & 65535) << 16 >> 16 != 40);
								c = S;
								return
							}
							E = t << 16 >> 16;E = (E << 17 >> 17 | 0) == (E | 0) ? E << 1 : E >>> 15 ^ 32767;h = n << 16 >> 16 < 40;
							if(!h) {
								Wr(e, s, r, l, f, o[u >> 2] | 0, w);
								o[u >> 2] = (o[u >> 2] | 0) + 14;
								c = S;
								return
							}
							m = n << 16 >> 16;d = E << 16 >> 16;t = m;do {
								a = (ee(i[r + (t - m << 1) >> 1] | 0, d) | 0) >> 15;
								if((a | 0) > 32767) {
									o[w >> 2] = 1;
									a = 32767
								}
								v = r + (t << 1) | 0;
								i[v >> 1] = Wt(i[v >> 1] | 0, a & 65535, w) | 0;
								t = t + 1 | 0
							} while ((t & 65535) << 16 >> 16 != 40);Wr(e, s, r, l, f, o[u >> 2] | 0, w);o[u >> 2] = (o[u >> 2] | 0) + 14;
							if(!h) {
								c = S;
								return
							}
							a = n << 16 >> 16;d = E << 16 >> 16;m = a;do {
								t = (ee(i[l + (m - a << 1) >> 1] | 0, d) | 0) >> 15;
								if((t | 0) > 32767) {
									o[w >> 2] = 1;
									t = 32767
								}
								v = l + (m << 1) | 0;
								i[v >> 1] = Wt(i[v >> 1] | 0, t & 65535, w) | 0;
								m = m + 1 | 0
							} while ((m & 65535) << 16 >> 16 != 40);c = S;
							return
						}
				}
			}

			function $r(e) {
				e = e | 0;
				var r = 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				o[e >> 2] = 0;
				r = xi(4) | 0;
				if(!r) {
					e = -1;
					return e | 0
				}
				if(!((Jn(r) | 0) << 16 >> 16)) {
					Zn(o[r >> 2] | 0) | 0;
					o[e >> 2] = r;
					e = 0;
					return e | 0
				} else {
					Qn(r);
					Hi(r);
					e = -1;
					return e | 0
				}
				return 0
			}

			function en(e) {
				e = e | 0;
				var r = 0;
				if(!e) return;
				r = o[e >> 2] | 0;
				if(!r) return;
				Qn(r);
				Hi(o[e >> 2] | 0);
				o[e >> 2] = 0;
				return
			}

			function rn(e) {
				e = e | 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				Zn(o[e >> 2] | 0) | 0;
				e = 0;
				return e | 0
			}

			function nn(e, r, n, t, a, l, f, u, d, h, E, w, m, S, p, v, _, b, k, F) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				d = d | 0;
				h = h | 0;
				E = E | 0;
				w = w | 0;
				m = m | 0;
				S = S | 0;
				p = p | 0;
				v = v | 0;
				_ = _ | 0;
				b = b | 0;
				k = k | 0;
				F = F | 0;
				var M = 0,
					g = 0,
					R = 0,
					y = 0;
				g = c;
				c = c + 16 | 0;
				y = g + 2 | 0;
				R = g;
				i[m >> 1] = $n(o[e >> 2] | 0, n, a, f, d, l, 40, t, S, R, y, F) | 0;
				e = i[y >> 1] | 0;
				t = o[_ >> 2] | 0;
				o[_ >> 2] = t + 2;
				i[t >> 1] = e;
				ki(f, i[m >> 1] | 0, i[S >> 1] | 0, 40, i[R >> 1] | 0, F);
				ln(f, l, w, 40);
				i[p >> 1] = Pn(n, d, w, v, 40, F) | 0;
				i[b >> 1] = 32767;
				if(h << 16 >> 16 != 0 ? (M = i[p >> 1] | 0, M << 16 >> 16 > 15565) : 0) M = Ct(r, M, F) | 0;
				else M = 0;
				if(n >>> 0 < 2) {
					y = i[p >> 1] | 0;
					i[p >> 1] = y << 16 >> 16 > 13926 ? 13926 : y;
					if(M << 16 >> 16) i[b >> 1] = 15565
				} else {
					if(M << 16 >> 16) {
						i[b >> 1] = 15565;
						i[p >> 1] = 15565
					}
					if((n | 0) == 7) {
						R = St(7, i[b >> 1] | 0, p, 0, 0, k, F) | 0;
						y = o[_ >> 2] | 0;
						o[_ >> 2] = y + 2;
						i[y >> 1] = R
					}
				}
				m = i[p >> 1] | 0;
				M = 0;
				while(1) {
					R = ee(i[w >> 1] | 0, m) | 0;
					i[E >> 1] = (s[d >> 1] | 0) - (R >>> 14);
					R = (ee(i[f >> 1] | 0, m) | 0) >>> 14;
					y = u + (M << 1) | 0;
					i[y >> 1] = (s[y >> 1] | 0) - R;
					M = M + 1 | 0;
					if((M | 0) == 40) break;
					else {
						f = f + 2 | 0;
						d = d + 2 | 0;
						E = E + 2 | 0;
						w = w + 2 | 0
					}
				}
				c = g;
				return
			}

			function tn(e, r) {
				e = e | 0;
				r = r | 0;
				var n = 0,
					t = 0,
					i = 0,
					a = 0;
				a = c;
				c = c + 16 | 0;
				i = a;
				if(!e) {
					e = -1;
					c = a;
					return e | 0
				}
				o[e >> 2] = 0;
				n = xi(2532) | 0;
				o[i >> 2] = n;
				if(!n) {
					e = -1;
					c = a;
					return e | 0
				}
				ei(n + 2392 | 0);
				o[n + 2188 >> 2] = 0;
				o[(o[i >> 2] | 0) + 2192 >> 2] = 0;
				o[(o[i >> 2] | 0) + 2196 >> 2] = 0;
				o[(o[i >> 2] | 0) + 2200 >> 2] = 0;
				o[(o[i >> 2] | 0) + 2204 >> 2] = 0;
				o[(o[i >> 2] | 0) + 2208 >> 2] = 0;
				o[(o[i >> 2] | 0) + 2212 >> 2] = 0;
				o[(o[i >> 2] | 0) + 2220 >> 2] = 0;
				t = o[i >> 2] | 0;
				o[t + 2216 >> 2] = r;
				o[t + 2528 >> 2] = 0;
				n = t;
				if(((((((($r(t + 2196 | 0) | 0) << 16 >> 16 == 0 ? (di(t + 2192 | 0) | 0) << 16 >> 16 == 0 : 0) ? (On(t + 2200 | 0) | 0) << 16 >> 16 == 0 : 0) ? (nt(t + 2204 | 0) | 0) << 16 >> 16 == 0 : 0) ? (Tt(t + 2208 | 0) | 0) << 16 >> 16 == 0 : 0) ? (Bt(t + 2212 | 0) | 0) << 16 >> 16 == 0 : 0) ? (hn(t + 2220 | 0, o[t + 2432 >> 2] | 0) | 0) << 16 >> 16 == 0 : 0) ? (qn(t + 2188 | 0) | 0) << 16 >> 16 == 0 : 0) {
					an(t) | 0;
					o[e >> 2] = n;
					e = 0;
					c = a;
					return e | 0
				}
				on(i);
				e = -1;
				c = a;
				return e | 0
			}

			function on(e) {
				e = e | 0;
				var r = 0;
				if(!e) return;
				r = o[e >> 2] | 0;
				if(!r) return;
				Kn(r + 2188 | 0);
				Ei((o[e >> 2] | 0) + 2192 | 0);
				An((o[e >> 2] | 0) + 2200 | 0);
				en((o[e >> 2] | 0) + 2196 | 0);
				it((o[e >> 2] | 0) + 2204 | 0);
				Nt((o[e >> 2] | 0) + 2208 | 0);
				Ut((o[e >> 2] | 0) + 2212 | 0);
				wn((o[e >> 2] | 0) + 2220 | 0);
				Hi(o[e >> 2] | 0);
				o[e >> 2] = 0;
				return
			}

			function an(e) {
				e = e | 0;
				var r = 0,
					n = 0,
					t = 0,
					a = 0;
				if(!e) {
					a = -1;
					return a | 0
				}
				o[e + 652 >> 2] = e + 320;
				o[e + 640 >> 2] = e + 240;
				o[e + 644 >> 2] = e + 160;
				o[e + 648 >> 2] = e + 80;
				o[e + 1264 >> 2] = e + 942;
				o[e + 1912 >> 2] = e + 1590;
				t = e + 1938 | 0;
				o[e + 2020 >> 2] = t;
				o[e + 2384 >> 2] = e + 2304;
				r = e + 2028 | 0;
				o[e + 2024 >> 2] = e + 2108;
				o[e + 2528 >> 2] = 0;
				Ki(e | 0, 0, 640) | 0;
				Ki(e + 1282 | 0, 0, 308) | 0;
				Ki(e + 656 | 0, 0, 286) | 0;
				n = e + 2224 | 0;
				a = t + 80 | 0;
				do {
					i[t >> 1] = 0;
					t = t + 2 | 0
				} while ((t | 0) < (a | 0));
				t = r;
				a = t + 80 | 0;
				do {
					i[t >> 1] = 0;
					t = t + 2 | 0
				} while ((t | 0) < (a | 0));
				r = e + 1268 | 0;
				t = n;
				a = t + 80 | 0;
				do {
					i[t >> 1] = 0;
					t = t + 2 | 0
				} while ((t | 0) < (a | 0));
				i[r >> 1] = 40;
				i[e + 1270 >> 1] = 40;
				i[e + 1272 >> 1] = 40;
				i[e + 1274 >> 1] = 40;
				i[e + 1276 >> 1] = 40;
				Wn(o[e + 2188 >> 2] | 0) | 0;
				hi(o[e + 2192 >> 2] | 0) | 0;
				rn(o[e + 2196 >> 2] | 0) | 0;
				Tn(o[e + 2200 >> 2] | 0) | 0;
				tt(o[e + 2204 >> 2] | 0) | 0;
				Dt(o[e + 2208 >> 2] | 0) | 0;
				Lt(o[e + 2212 >> 2] | 0) | 0;
				En(o[e + 2220 >> 2] | 0, o[e + 2432 >> 2] | 0) | 0;
				i[e + 2388 >> 1] = 0;
				a = 0;
				return a | 0
			}

			function sn(e, r, n, t, a, s) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				var l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0,
					C = 0,
					I = 0,
					B = 0,
					L = 0,
					U = 0,
					x = 0,
					H = 0,
					z = 0,
					j = 0,
					Y = 0,
					V = 0,
					q = 0,
					K = 0,
					W = 0,
					X = 0,
					G = 0,
					J = 0,
					Z = 0,
					Q = 0,
					$ = 0,
					ee = 0,
					re = 0,
					ne = 0,
					te = 0,
					ie = 0,
					oe = 0,
					ae = 0,
					se = 0,
					le = 0,
					fe = 0,
					ue = 0,
					ce = 0,
					de = 0,
					he = 0,
					Ee = 0,
					we = 0,
					me = 0;
				me = c;
				c = c + 1184 | 0;
				q = me;
				h = me + 1096 | 0;
				E = me + 1008 | 0;
				u = me + 904 | 0;
				ue = me + 928 | 0;
				ce = me + 824 | 0;
				G = me + 744 | 0;
				he = me + 664 | 0;
				Ee = me + 584 | 0;
				Z = me + 328 | 0;
				se = me + 504 | 0;
				le = me + 424 | 0;
				de = me + 344 | 0;
				we = me + 248 | 0;
				J = me + 168 | 0;
				te = me + 88 | 0;
				oe = me + 68 | 0;
				ae = me + 48 | 0;
				ie = me + 28 | 0;
				fe = me + 24 | 0;
				re = me + 22 | 0;
				$ = me + 20 | 0;
				X = me + 16 | 0;
				K = me + 12 | 0;
				W = me + 10 | 0;
				ee = me + 8 | 0;
				Q = me + 6 | 0;
				ne = me + 4 | 0;
				o[q >> 2] = t;
				V = e + 2528 | 0;
				l = e + 652 | 0;
				Vi(o[l >> 2] | 0, n | 0, 320) | 0;
				o[a >> 2] = r;
				d = e + 2216 | 0;
				if(!(o[d >> 2] | 0)) {
					n = e + 2220 | 0;
					t = 0
				} else {
					t = Yt(o[e + 2212 >> 2] | 0, o[l >> 2] | 0, V) | 0;
					Y = e + 2220 | 0;
					n = Y;
					t = pn(o[Y >> 2] | 0, t, a, V) | 0
				}
				Y = e + 2392 | 0;
				Xn(o[e + 2188 >> 2] | 0, r, o[e + 644 >> 2] | 0, o[e + 648 >> 2] | 0, h, Y, V);
				f = e + 2192 | 0;
				wi(o[f >> 2] | 0, r, o[a >> 2] | 0, h, E, u, q, V);
				Sn(o[n >> 2] | 0, u, o[l >> 2] | 0, V);
				if((o[a >> 2] | 0) == 8) {
					mn(o[n >> 2] | 0, t, o[(o[f >> 2] | 0) + 40 >> 2] | 0, (o[e + 2200 >> 2] | 0) + 32 | 0, q, V);
					Ki(e + 1282 | 0, 0, 308) | 0;
					l = e + 2244 | 0;
					m = l + 20 | 0;
					do {
						i[l >> 1] = 0;
						l = l + 2 | 0
					} while ((l | 0) < (m | 0));
					l = e + 2284 | 0;
					m = l + 20 | 0;
					do {
						i[l >> 1] = 0;
						l = l + 2 | 0
					} while ((l | 0) < (m | 0));
					l = o[e + 2020 >> 2] | 0;
					m = l + 80 | 0;
					do {
						i[l >> 1] = 0;
						l = l + 2 | 0
					} while ((l | 0) < (m | 0));
					l = e + 2028 | 0;
					m = l + 80 | 0;
					do {
						i[l >> 1] = 0;
						l = l + 2 | 0
					} while ((l | 0) < (m | 0));
					hi(o[f >> 2] | 0) | 0;
					l = o[f >> 2] | 0;
					n = u;
					m = l + 20 | 0;
					do {
						i[l >> 1] = i[n >> 1] | 0;
						l = l + 2 | 0;
						n = n + 2 | 0
					} while ((l | 0) < (m | 0));
					l = (o[f >> 2] | 0) + 20 | 0;
					n = u;
					m = l + 20 | 0;
					do {
						i[l >> 1] = i[n >> 1] | 0;
						l = l + 2 | 0;
						n = n + 2 | 0
					} while ((l | 0) < (m | 0));
					rn(o[e + 2196 >> 2] | 0) | 0;
					i[e + 2388 >> 1] = 0;
					j = 0
				} else j = Pt(o[e + 2208 >> 2] | 0, o[f >> 2] | 0, V) | 0;
				x = e + 640 | 0;
				f = e + 2264 | 0;
				l = e + 1264 | 0;
				n = e + 2204 | 0;
				t = e + 2212 | 0;
				H = e + 1268 | 0;
				z = e + 1278 | 0;
				at(r, 2842, 2862, 2882, h, 0, o[x >> 2] | 0, f, o[l >> 2] | 0, V);
				if(r >>> 0 > 1) {
					Gn(o[n >> 2] | 0, o[t >> 2] | 0, r, o[l >> 2] | 0, X, H, z, 0, o[d >> 2] | 0, V);
					at(r, 2842, 2862, 2882, h, 80, o[x >> 2] | 0, f, o[l >> 2] | 0, V);
					Gn(o[n >> 2] | 0, o[t >> 2] | 0, r, (o[l >> 2] | 0) + 160 | 0, X + 2 | 0, H, z, 1, o[d >> 2] | 0, V)
				} else {
					at(r, 2842, 2862, 2882, h, 80, o[x >> 2] | 0, f, o[l >> 2] | 0, V);
					Gn(o[n >> 2] | 0, o[t >> 2] | 0, r, o[l >> 2] | 0, X, H, z, 1, o[d >> 2] | 0, V);
					i[X + 2 >> 1] = i[X >> 1] | 0
				}
				if(o[d >> 2] | 0) jt(o[t >> 2] | 0, X, V);
				if((o[a >> 2] | 0) == 8) {
					Ee = e + 656 | 0;
					we = e + 976 | 0;
					Vi(Ee | 0, we | 0, 286) | 0;
					we = e + 320 | 0;
					Vi(e | 0, we | 0, 320) | 0;
					c = me;
					return 0
				}
				g = e + 2224 | 0;
				R = e + 2244 | 0;
				y = e + 2284 | 0;
				O = e + 2388 | 0;
				A = e + 2020 | 0;
				T = e + 1916 | 0;
				D = e + 1912 | 0;
				N = e + 2024 | 0;
				P = e + 2384 | 0;
				C = e + 2196 | 0;
				I = e + 2208 | 0;
				B = e + 2464 | 0;
				L = e + 2200 | 0;
				U = e + 2224 | 0;
				k = e + 2244 | 0;
				F = e + 1270 | 0;
				M = e + 1280 | 0;
				b = 0;
				d = 0;
				u = 0;
				p = 0;
				v = 0;
				f = 0;
				_ = -1;
				while(1) {
					w = _;
					_ = _ + 1 << 16 >> 16;
					p = 1 - (p << 16 >> 16) | 0;
					t = p & 65535;
					S = (p & 65535 | 0) != 0;
					n = o[a >> 2] | 0;
					l = (n | 0) == 0;
					do
						if(S)
							if(l) {
								l = oe;
								n = g;
								m = l + 20 | 0;
								do {
									i[l >> 1] = i[n >> 1] | 0;
									l = l + 2 | 0;
									n = n + 2 | 0
								} while ((l | 0) < (m | 0));
								l = ae;
								n = R;
								m = l + 20 | 0;
								do {
									i[l >> 1] = i[n >> 1] | 0;
									l = l + 2 | 0;
									n = n + 2 | 0
								} while ((l | 0) < (m | 0));
								l = ie;
								n = y;
								m = l + 20 | 0;
								do {
									i[l >> 1] = i[n >> 1] | 0;
									l = l + 2 | 0;
									n = n + 2 | 0
								} while ((l | 0) < (m | 0));
								i[fe >> 1] = i[O >> 1] | 0;
								r = (o[x >> 2] | 0) + (b << 1) | 0;
								l = 20;
								break
							} else {
								r = (o[x >> 2] | 0) + (b << 1) | 0;
								l = 19;
								break
							}
					else {
						r = (o[x >> 2] | 0) + (b << 1) | 0;
						if(l) l = 20;
						else l = 19
					} while (0);
					if((l | 0) == 19) Ot(n, 2842, 2862, 2882, h, E, r, y, k, o[A >> 2] | 0, T, (o[D >> 2] | 0) + (b << 1) | 0, o[N >> 2] | 0, ue, se, o[P >> 2] | 0);
					else if((l | 0) == 20 ? (0, Ot(0, 2842, 2862, 2882, h, E, r, y, ae, o[A >> 2] | 0, T, (o[D >> 2] | 0) + (b << 1) | 0, o[N >> 2] | 0, ue, se, o[P >> 2] | 0), S) : 0) {
						l = te;
						n = o[N >> 2] | 0;
						m = l + 80 | 0;
						do {
							i[l >> 1] = i[n >> 1] | 0;
							l = l + 2 | 0;
							n = n + 2 | 0
						} while ((l | 0) < (m | 0))
					}
					l = le;
					n = se;
					m = l + 80 | 0;
					do {
						i[l >> 1] = i[n >> 1] | 0;
						l = l + 2 | 0;
						n = n + 2 | 0
					} while ((l | 0) < (m | 0));
					nn(o[C >> 2] | 0, o[I >> 2] | 0, o[a >> 2] | 0, v, X, o[N >> 2] | 0, (o[D >> 2] | 0) + (b << 1) | 0, le, ue, j, ce, he, K, W, ee, Z, q, ne, o[B >> 2] | 0, V);
					switch(w << 16 >> 16) {
						case -1:
							{
								if((i[z >> 1] | 0) > 0) i[F >> 1] = i[K >> 1] | 0;
								break
							}
						case 2:
							{
								if((i[M >> 1] | 0) > 0) i[H >> 1] = i[K >> 1] | 0;
								break
							}
						default:
							{}
					}
					Qr(ce, o[N >> 2] | 0, i[K >> 1] | 0, i[O >> 1] | 0, i[ee >> 1] | 0, le, G, Ee, q, o[a >> 2] | 0, _, Y, V);
					Dn(o[L >> 2] | 0, o[a >> 2] | 0, se, (o[D >> 2] | 0) + (b << 1) | 0, G, ue, ce, he, Ee, Z, t, i[ne >> 1] | 0, re, $, ee, Q, q, Y, V);
					It(o[I >> 2] | 0, i[ee >> 1] | 0, V);
					r = o[a >> 2] | 0;
					do
						if(!r)
							if(S) {
								l = de;
								n = ue;
								m = l + 80 | 0;
								do {
									i[l >> 1] = i[n >> 1] | 0;
									l = l + 2 | 0;
									n = n + 2 | 0
								} while ((l | 0) < (m | 0));
								l = we;
								n = Ee;
								m = l + 80 | 0;
								do {
									i[l >> 1] = i[n >> 1] | 0;
									l = l + 2 | 0;
									n = n + 2 | 0
								} while ((l | 0) < (m | 0));
								l = J;
								n = G;
								m = l + 80 | 0;
								do {
									i[l >> 1] = i[n >> 1] | 0;
									l = l + 2 | 0;
									n = n + 2 | 0
								} while ((l | 0) < (m | 0));
								u = i[K >> 1] | 0;
								d = i[W >> 1] | 0;
								At(o[x >> 2] | 0, 0, v, i[ee >> 1] | 0, i[Q >> 1] | 0, E, s, ue, G, he, Ee, oe, y, ae, o[D >> 2] | 0, O, V);
								i[O >> 1] = i[fe >> 1] | 0;
								f = v;
								break
							} else {
								l = y;
								n = ie;
								m = l + 20 | 0;
								do {
									i[l >> 1] = i[n >> 1] | 0;
									l = l + 2 | 0;
									n = n + 2 | 0
								} while ((l | 0) < (m | 0));
								S = f << 16 >> 16;
								ki((o[D >> 2] | 0) + (S << 1) | 0, u, d, 40, 1, V);
								ln((o[D >> 2] | 0) + (S << 1) | 0, te, he, 40);
								At(o[x >> 2] | 0, o[a >> 2] | 0, f, i[re >> 1] | 0, i[$ >> 1] | 0, E + -22 | 0, s, de, J, he, we, U, y, k, o[D >> 2] | 0, fe, V);
								Ot(o[a >> 2] | 0, 2842, 2862, 2882, h, E, (o[x >> 2] | 0) + (b << 1) | 0, y, k, o[A >> 2] | 0, T, (o[D >> 2] | 0) + (b << 1) | 0, o[N >> 2] | 0, ue, se, o[P >> 2] | 0);
								ki((o[D >> 2] | 0) + (b << 1) | 0, i[K >> 1] | 0, i[W >> 1] | 0, 40, 1, V);
								ln((o[D >> 2] | 0) + (b << 1) | 0, o[N >> 2] | 0, he, 40);
								At(o[x >> 2] | 0, o[a >> 2] | 0, v, i[ee >> 1] | 0, i[Q >> 1] | 0, E, s, ue, G, he, Ee, U, y, k, o[D >> 2] | 0, O, V);
								break
							}
					else At(o[x >> 2] | 0, r, v, i[ee >> 1] | 0, i[Q >> 1] | 0, E, s, ue, G, he, Ee, U, y, k, o[D >> 2] | 0, O, V); while (0);
					r = b + 40 | 0;
					v = r & 65535;
					if(v << 16 >> 16 >= 160) break;
					else {
						b = r << 16 >> 16;
						h = h + 22 | 0;
						E = E + 22 | 0
					}
				}
				Vi(e + 1282 | 0, e + 1602 | 0, 308) | 0;
				Ee = e + 656 | 0;
				we = e + 976 | 0;
				Vi(Ee | 0, we | 0, 286) | 0;
				we = e + 320 | 0;
				Vi(e | 0, we | 0, 320) | 0;
				c = me;
				return 0
			}

			function ln(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var o = 0,
					a = 0,
					s = 0,
					l = 0,
					f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0;
				E = t << 16 >> 16;
				if(t << 16 >> 16 > 1) h = 1;
				else return;
				while(1) {
					o = i[e >> 1] | 0;
					l = r + (h + -1 << 1) | 0;
					t = ee(i[r + (h << 1) >> 1] | 0, o) | 0;
					u = i[l >> 1] | 0;
					o = ee(u << 16 >> 16, o) | 0;
					s = (h + 131071 | 0) >>> 1;
					f = s & 65535;
					a = i[e + 2 >> 1] | 0;
					if(!(f << 16 >> 16)) {
						r = l;
						s = u
					} else {
						c = (s << 1) + 131070 & 131070;
						d = h - c | 0;
						s = e;
						do {
							m = (ee(u << 16 >> 16, a) | 0) + t | 0;
							w = s;
							s = s + 4 | 0;
							t = i[l + -2 >> 1] | 0;
							a = (ee(t, a) | 0) + o | 0;
							o = i[s >> 1] | 0;
							l = l + -4 | 0;
							t = m + (ee(o, t) | 0) | 0;
							u = i[l >> 1] | 0;
							o = a + (ee(u << 16 >> 16, o) | 0) | 0;
							f = f + -1 << 16 >> 16;
							a = i[w + 6 >> 1] | 0
						} while (f << 16 >> 16 != 0);
						s = r + (d + -3 << 1) | 0;
						e = e + (c + 2 << 1) | 0;
						r = s;
						s = i[s >> 1] | 0
					}
					t = (ee(s << 16 >> 16, a) | 0) + t | 0;
					i[n >> 1] = o >>> 12;
					i[n + 2 >> 1] = t >>> 12;
					t = (h << 16) + 131072 >> 16;
					if((t | 0) < (E | 0)) {
						n = n + 4 | 0;
						e = e + (1 - h << 1) | 0;
						h = t
					} else break
				}
				return
			}

			function fn(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var o = 0,
					a = 0,
					s = 0,
					l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0;
				g = c;
				c = c + 80 | 0;
				M = g;
				s = 20;
				a = e;
				o = 1;
				while(1) {
					F = i[a >> 1] | 0;
					F = (ee(F, F) | 0) + o | 0;
					o = i[a + 2 >> 1] | 0;
					o = F + (ee(o, o) | 0) | 0;
					s = s + -1 << 16 >> 16;
					if(!(s << 16 >> 16)) break;
					else a = a + 4 | 0
				}
				o = o << 1;
				if((o | 0) < 0) {
					a = 20;
					o = e;
					t = M;
					while(1) {
						i[t >> 1] = (i[o >> 1] | 0) >>> 1;
						i[t + 2 >> 1] = (i[o + 2 >> 1] | 0) >>> 1;
						a = a + -1 << 16 >> 16;
						if(!(a << 16 >> 16)) {
							F = M;
							break
						} else {
							o = o + 4 | 0;
							t = t + 4 | 0
						}
					}
				} else {
					o = ai(o >> 1, t) | 0;
					if((o | 0) < 16777215) o = ((o >> 9) * 32440 | 0) >>> 15 << 16 >> 16;
					else o = 32440;
					s = 20;
					a = e;
					t = M;
					while(1) {
						i[t >> 1] = ((ee(i[a >> 1] | 0, o) | 0) + 32 | 0) >>> 6;
						i[t + 2 >> 1] = ((ee(i[a + 2 >> 1] | 0, o) | 0) + 32 | 0) >>> 6;
						s = s + -1 << 16 >> 16;
						if(!(s << 16 >> 16)) {
							F = M;
							break
						} else {
							a = a + 4 | 0;
							t = t + 4 | 0
						}
					}
				}
				s = 20;
				a = F;
				t = n + 3198 | 0;
				o = 0;
				while(1) {
					k = i[a >> 1] | 0;
					k = (ee(k, k) | 0) + o | 0;
					i[t >> 1] = (k + 16384 | 0) >>> 15;
					b = i[a + 2 >> 1] | 0;
					o = (ee(b, b) | 0) + k | 0;
					i[t + -82 >> 1] = (o + 16384 | 0) >>> 15;
					s = s + -1 << 16 >> 16;
					if(!(s << 16 >> 16)) break;
					else {
						a = a + 4 | 0;
						t = t + -164 | 0
					}
				}
				k = r + 78 | 0;
				b = 1;
				while(1) {
					o = 39 - b | 0;
					e = n + 3120 + (o << 1) | 0;
					t = n + (o * 80 | 0) + 78 | 0;
					o = r + (o << 1) | 0;
					f = M + (b << 1) | 0;
					a = 65575 - b | 0;
					l = a & 65535;
					s = i[F >> 1] | 0;
					if(!(l << 16 >> 16)) {
						l = k;
						a = 0
					} else {
						S = a + 65535 & 65535;
						v = S * 41 | 0;
						_ = (ee(b, -40) | 0) - v | 0;
						p = 0 - b | 0;
						v = p - v | 0;
						p = p - S | 0;
						m = b + S | 0;
						w = i[f >> 1] | 0;
						h = F;
						E = k;
						u = n + ((38 - b | 0) * 80 | 0) + 78 | 0;
						a = 0;
						d = 0;
						while(1) {
							f = f + 2 | 0;
							a = (ee(w << 16 >> 16, s) | 0) + a | 0;
							h = h + 2 | 0;
							w = i[f >> 1] | 0;
							d = (ee(w << 16 >> 16, s) | 0) + d | 0;
							y = o;
							o = o + -2 | 0;
							s = i[o >> 1] | 0;
							R = i[E >> 1] << 1;
							y = (ee((ee(R, i[y >> 1] | 0) | 0) >> 16, (a << 1) + 32768 >> 16) | 0) >>> 15 & 65535;
							i[t >> 1] = y;
							i[e >> 1] = y;
							s = (ee((ee(R, s) | 0) >> 16, (d << 1) + 32768 >> 16) | 0) >>> 15 & 65535;
							i[e + -2 >> 1] = s;
							i[u >> 1] = s;
							l = l + -1 << 16 >> 16;
							s = i[h >> 1] | 0;
							if(!(l << 16 >> 16)) break;
							else {
								E = E + -2 | 0;
								e = e + -82 | 0;
								t = t + -82 | 0;
								u = u + -82 | 0
							}
						}
						f = M + (m + 1 << 1) | 0;
						l = r + (38 - S << 1) | 0;
						o = r + (p + 38 << 1) | 0;
						e = n + 3040 + (v + 38 << 1) | 0;
						t = n + 3040 + (_ + 38 << 1) | 0
					}
					y = (ee(i[f >> 1] | 0, s) | 0) + a | 0;
					y = (ee((y << 1) + 32768 >> 16, (ee(i[l >> 1] << 1, i[o >> 1] | 0) | 0) >> 16) | 0) >>> 15 & 65535;
					i[e >> 1] = y;
					i[t >> 1] = y;
					t = (b << 16) + 131072 | 0;
					if((t | 0) < 2621440) b = t >> 16;
					else break
				}
				c = g;
				return
			}

			function un(e, r, n, t, a, s, l) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				var f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0;
				S = c;
				c = c + 160 | 0;
				m = S;
				if(a << 16 >> 16 > 0) {
					E = s & 65535;
					w = 0;
					f = 5;
					do {
						if((w | 0) < 40) {
							h = w;
							d = w & 65535;
							s = 0;
							while(1) {
								if(d << 16 >> 16 < 40) {
									d = d << 16 >> 16;
									u = 0;
									do {
										u = (ee(i[e + (d - h << 1) >> 1] | 0, i[r + (d << 1) >> 1] | 0) | 0) + u | 0;
										d = d + 1 | 0
									} while ((d & 65535) << 16 >> 16 != 40)
								} else u = 0;
								u = u << 1;
								o[m + (h << 2) >> 2] = u;
								u = Bn(u) | 0;
								s = (u | 0) > (s | 0) ? u : s;
								u = h + E | 0;
								d = u & 65535;
								if(d << 16 >> 16 >= 40) break;
								else h = u << 16 >> 16
							}
						} else s = 0;
						f = (s >> 1) + f | 0;
						w = w + 1 | 0
					} while ((w & 65535) << 16 >> 16 != a << 16 >> 16)
				} else f = 5;
				t = ((vi(f) | 0) & 65535) - (t & 65535) | 0;
				s = t << 16 >> 16;
				u = 0 - s << 16;
				f = (u | 0) < 2031616;
				u = u >> 16;
				if((t & 65535) << 16 >> 16 > 0)
					if(f) {
						f = 0;
						do {
							t = o[m + (f << 2) >> 2] | 0;
							r = t << s;
							i[n + (f << 1) >> 1] = Ni((r >> s | 0) == (t | 0) ? r : t >> 31 ^ 2147483647, l) | 0;
							f = f + 1 | 0
						} while ((f | 0) != 40);
						c = S;
						return
					} else {
						f = 0;
						do {
							t = o[m + (f << 2) >> 2] | 0;
							r = t << s;
							i[n + (f << 1) >> 1] = Ni((r >> s | 0) == (t | 0) ? r : t >> 31 ^ 2147483647, l) | 0;
							f = f + 1 | 0
						} while ((f | 0) != 40);
						c = S;
						return
					}
				else if(f) {
					f = 0;
					do {
						i[n + (f << 1) >> 1] = Ni(o[m + (f << 2) >> 2] >> u, l) | 0;
						f = f + 1 | 0
					} while ((f | 0) != 40);
					c = S;
					return
				} else {
					f = 0;
					do {
						i[n + (f << 1) >> 1] = Ni(0, l) | 0;
						f = f + 1 | 0
					} while ((f | 0) != 40);
					c = S;
					return
				}
			}

			function cn(e, r, n, t, a) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				var s = 0,
					l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0;
				g = c;
				c = c + 160 | 0;
				M = g;
				b = e + 2 | 0;
				k = i[e >> 1] | 0;
				F = 0;
				a = 5;
				do {
					_ = F;
					f = 0;
					while(1) {
						h = r + (_ << 1) | 0;
						v = 40 - _ | 0;
						s = (v + 131071 | 0) >>> 1 & 65535;
						u = r + (_ + 1 << 1) | 0;
						l = ee(i[h >> 1] << 1, k) | 0;
						if(!(s << 16 >> 16)) s = b;
						else {
							p = 131111 - _ + 131070 & 131070;
							S = _ + p | 0;
							m = b;
							w = e;
							E = h;
							while(1) {
								d = E + 4 | 0;
								h = w + 4 | 0;
								l = (ee(i[u >> 1] << 1, i[m >> 1] | 0) | 0) + l | 0;
								s = s + -1 << 16 >> 16;
								l = (ee(i[d >> 1] << 1, i[h >> 1] | 0) | 0) + l | 0;
								if(!(s << 16 >> 16)) break;
								else {
									u = E + 6 | 0;
									m = w + 6 | 0;
									w = h;
									E = d
								}
							}
							u = r + (S + 3 << 1) | 0;
							s = e + (p + 3 << 1) | 0
						}
						if(!(v & 1)) l = (ee(i[u >> 1] << 1, i[s >> 1] | 0) | 0) + l | 0;
						o[M + (_ << 2) >> 2] = l;
						l = (l | 0) < 0 ? 0 - l | 0 : l;
						f = (l | 0) > (f | 0) ? l : f;
						l = _ + 5 | 0;
						if((l & 65535) << 16 >> 16 < 40) _ = l << 16 >> 16;
						else break
					}
					a = (f >> 1) + a | 0;
					F = F + 1 | 0
				} while ((F | 0) != 5);
				t = ((vi(a) | 0) & 65535) - (t & 65535) | 0;
				l = t << 16 >> 16;
				a = 0 - l << 16;
				f = a >> 16;
				if((t & 65535) << 16 >> 16 > 0) {
					s = 20;
					a = M;
					while(1) {
						M = o[a >> 2] | 0;
						t = M << l;
						i[n >> 1] = (((t >> l | 0) == (M | 0) ? t : M >> 31 ^ 2147483647) + 32768 | 0) >>> 16;
						M = o[a + 4 >> 2] | 0;
						t = M << l;
						i[n + 2 >> 1] = (((t >> l | 0) == (M | 0) ? t : M >> 31 ^ 2147483647) + 32768 | 0) >>> 16;
						s = s + -1 << 16 >> 16;
						if(!(s << 16 >> 16)) break;
						else {
							n = n + 4 | 0;
							a = a + 8 | 0
						}
					}
					c = g;
					return
				}
				if((a | 0) < 2031616) {
					s = 20;
					a = M;
					while(1) {
						i[n >> 1] = ((o[a >> 2] >> f) + 32768 | 0) >>> 16;
						i[n + 2 >> 1] = ((o[a + 4 >> 2] >> f) + 32768 | 0) >>> 16;
						s = s + -1 << 16 >> 16;
						if(!(s << 16 >> 16)) break;
						else {
							n = n + 4 | 0;
							a = a + 8 | 0
						}
					}
					c = g;
					return
				} else {
					i[n >> 1] = 0;
					M = n + 4 | 0;
					i[n + 2 >> 1] = 0;
					i[M >> 1] = 0;
					t = M + 4 | 0;
					i[M + 2 >> 1] = 0;
					i[t >> 1] = 0;
					M = t + 4 | 0;
					i[t + 2 >> 1] = 0;
					i[M >> 1] = 0;
					t = M + 4 | 0;
					i[M + 2 >> 1] = 0;
					i[t >> 1] = 0;
					M = t + 4 | 0;
					i[t + 2 >> 1] = 0;
					i[M >> 1] = 0;
					t = M + 4 | 0;
					i[M + 2 >> 1] = 0;
					i[t >> 1] = 0;
					M = t + 4 | 0;
					i[t + 2 >> 1] = 0;
					i[M >> 1] = 0;
					t = M + 4 | 0;
					i[M + 2 >> 1] = 0;
					i[t >> 1] = 0;
					M = t + 4 | 0;
					i[t + 2 >> 1] = 0;
					i[M >> 1] = 0;
					t = M + 4 | 0;
					i[M + 2 >> 1] = 0;
					i[t >> 1] = 0;
					M = t + 4 | 0;
					i[t + 2 >> 1] = 0;
					i[M >> 1] = 0;
					t = M + 4 | 0;
					i[M + 2 >> 1] = 0;
					i[t >> 1] = 0;
					M = t + 4 | 0;
					i[t + 2 >> 1] = 0;
					i[M >> 1] = 0;
					t = M + 4 | 0;
					i[M + 2 >> 1] = 0;
					i[t >> 1] = 0;
					M = t + 4 | 0;
					i[t + 2 >> 1] = 0;
					i[M >> 1] = 0;
					t = M + 4 | 0;
					i[M + 2 >> 1] = 0;
					i[t >> 1] = 0;
					M = t + 4 | 0;
					i[t + 2 >> 1] = 0;
					i[M >> 1] = 0;
					t = M + 4 | 0;
					i[M + 2 >> 1] = 0;
					i[t >> 1] = 0;
					M = t + 4 | 0;
					i[t + 2 >> 1] = 0;
					i[M >> 1] = 0;
					i[M + 2 >> 1] = 0;
					c = g;
					return
				}
			}

			function dn(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var i = 0,
					a = 0,
					s = 0;
				s = (Gt(16383, r) | 0) << 16 >> 16;
				r = ee(s, r << 16 >> 16) | 0;
				if((r | 0) == 1073741824) {
					o[t >> 2] = 1;
					i = 2147483647
				} else i = r << 1;
				a = (ee(s, n << 16 >> 16) | 0) >> 15;
				r = i + (a << 1) | 0;
				if((i ^ a | 0) > 0 & (r ^ i | 0) < 0) {
					o[t >> 2] = 1;
					r = (i >>> 31) + 2147483647 | 0
				}
				i = 2147483647 - r | 0;
				n = i >> 16;
				r = ee(n, s) | 0;
				if((r | 0) == 1073741824) {
					o[t >> 2] = 1;
					a = 2147483647
				} else a = r << 1;
				s = (ee((i >>> 1) - (n << 15) << 16 >> 16, s) | 0) >> 15;
				r = a + (s << 1) | 0;
				if((a ^ s | 0) > 0 & (r ^ a | 0) < 0) {
					o[t >> 2] = 1;
					r = (a >>> 31) + 2147483647 | 0
				}
				a = r >> 16;
				s = e >> 16;
				n = ee(a, s) | 0;
				n = (n | 0) == 1073741824 ? 2147483647 : n << 1;
				i = (ee((r >>> 1) - (a << 15) << 16 >> 16, s) | 0) >> 15;
				t = (i << 1) + n | 0;
				t = (i ^ n | 0) > 0 & (t ^ n | 0) < 0 ? (n >>> 31) + 2147483647 | 0 : t;
				s = (ee(a, (e >>> 1) - (s << 15) << 16 >> 16) | 0) >> 15;
				e = t + (s << 1) | 0;
				e = (t ^ s | 0) > 0 & (e ^ t | 0) < 0 ? (t >>> 31) + 2147483647 | 0 : e;
				t = e << 2;
				return((t >> 2 | 0) == (e | 0) ? t : e >> 31 ^ 2147483647) | 0
			}

			function hn(e, r) {
				e = e | 0;
				r = r | 0;
				var n = 0,
					t = 0,
					a = 0,
					s = 0;
				if(!e) {
					s = -1;
					return s | 0
				}
				o[e >> 2] = 0;
				n = xi(192) | 0;
				if(!n) {
					s = -1;
					return s | 0
				}
				t = n + 176 | 0;
				i[t >> 1] = 0;
				i[t + 2 >> 1] = 0;
				i[t + 4 >> 1] = 0;
				i[t + 6 >> 1] = 0;
				i[t + 8 >> 1] = 0;
				i[t + 10 >> 1] = 0;
				t = n;
				a = r;
				s = t + 20 | 0;
				do {
					i[t >> 1] = i[a >> 1] | 0;
					t = t + 2 | 0;
					a = a + 2 | 0
				} while ((t | 0) < (s | 0));
				t = n + 20 | 0;
				a = r;
				s = t + 20 | 0;
				do {
					i[t >> 1] = i[a >> 1] | 0;
					t = t + 2 | 0;
					a = a + 2 | 0
				} while ((t | 0) < (s | 0));
				t = n + 40 | 0;
				a = r;
				s = t + 20 | 0;
				do {
					i[t >> 1] = i[a >> 1] | 0;
					t = t + 2 | 0;
					a = a + 2 | 0
				} while ((t | 0) < (s | 0));
				t = n + 60 | 0;
				a = r;
				s = t + 20 | 0;
				do {
					i[t >> 1] = i[a >> 1] | 0;
					t = t + 2 | 0;
					a = a + 2 | 0
				} while ((t | 0) < (s | 0));
				t = n + 80 | 0;
				a = r;
				s = t + 20 | 0;
				do {
					i[t >> 1] = i[a >> 1] | 0;
					t = t + 2 | 0;
					a = a + 2 | 0
				} while ((t | 0) < (s | 0));
				t = n + 100 | 0;
				a = r;
				s = t + 20 | 0;
				do {
					i[t >> 1] = i[a >> 1] | 0;
					t = t + 2 | 0;
					a = a + 2 | 0
				} while ((t | 0) < (s | 0));
				t = n + 120 | 0;
				a = r;
				s = t + 20 | 0;
				do {
					i[t >> 1] = i[a >> 1] | 0;
					t = t + 2 | 0;
					a = a + 2 | 0
				} while ((t | 0) < (s | 0));
				t = n + 140 | 0;
				a = r;
				s = t + 20 | 0;
				do {
					i[t >> 1] = i[a >> 1] | 0;
					t = t + 2 | 0;
					a = a + 2 | 0
				} while ((t | 0) < (s | 0));
				t = n + 160 | 0;
				s = t + 20 | 0;
				do {
					i[t >> 1] = 0;
					t = t + 2 | 0
				} while ((t | 0) < (s | 0));
				i[n + 188 >> 1] = 7;
				i[n + 190 >> 1] = 32767;
				o[e >> 2] = n;
				s = 0;
				return s | 0
			}

			function En(e, r) {
				e = e | 0;
				r = r | 0;
				var n = 0,
					t = 0,
					o = 0;
				if(!e) {
					o = -1;
					return o | 0
				}
				n = e + 176 | 0;
				i[n >> 1] = 0;
				i[n + 2 >> 1] = 0;
				i[n + 4 >> 1] = 0;
				i[n + 6 >> 1] = 0;
				i[n + 8 >> 1] = 0;
				i[n + 10 >> 1] = 0;
				n = e;
				t = r;
				o = n + 20 | 0;
				do {
					i[n >> 1] = i[t >> 1] | 0;
					n = n + 2 | 0;
					t = t + 2 | 0
				} while ((n | 0) < (o | 0));
				n = e + 20 | 0;
				t = r;
				o = n + 20 | 0;
				do {
					i[n >> 1] = i[t >> 1] | 0;
					n = n + 2 | 0;
					t = t + 2 | 0
				} while ((n | 0) < (o | 0));
				n = e + 40 | 0;
				t = r;
				o = n + 20 | 0;
				do {
					i[n >> 1] = i[t >> 1] | 0;
					n = n + 2 | 0;
					t = t + 2 | 0
				} while ((n | 0) < (o | 0));
				n = e + 60 | 0;
				t = r;
				o = n + 20 | 0;
				do {
					i[n >> 1] = i[t >> 1] | 0;
					n = n + 2 | 0;
					t = t + 2 | 0
				} while ((n | 0) < (o | 0));
				n = e + 80 | 0;
				t = r;
				o = n + 20 | 0;
				do {
					i[n >> 1] = i[t >> 1] | 0;
					n = n + 2 | 0;
					t = t + 2 | 0
				} while ((n | 0) < (o | 0));
				n = e + 100 | 0;
				t = r;
				o = n + 20 | 0;
				do {
					i[n >> 1] = i[t >> 1] | 0;
					n = n + 2 | 0;
					t = t + 2 | 0
				} while ((n | 0) < (o | 0));
				n = e + 120 | 0;
				t = r;
				o = n + 20 | 0;
				do {
					i[n >> 1] = i[t >> 1] | 0;
					n = n + 2 | 0;
					t = t + 2 | 0
				} while ((n | 0) < (o | 0));
				n = e + 140 | 0;
				t = r;
				o = n + 20 | 0;
				do {
					i[n >> 1] = i[t >> 1] | 0;
					n = n + 2 | 0;
					t = t + 2 | 0
				} while ((n | 0) < (o | 0));
				n = e + 160 | 0;
				o = n + 20 | 0;
				do {
					i[n >> 1] = 0;
					n = n + 2 | 0
				} while ((n | 0) < (o | 0));
				i[e + 188 >> 1] = 7;
				i[e + 190 >> 1] = 32767;
				o = 1;
				return o | 0
			}

			function wn(e) {
				e = e | 0;
				var r = 0;
				if(!e) return;
				r = o[e >> 2] | 0;
				if(!r) return;
				Hi(r);
				o[e >> 2] = 0;
				return
			}

			function mn(e, r, n, t, a, s) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				var l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0;
				O = c;
				c = c + 112 | 0;
				g = O + 80 | 0;
				R = O + 60 | 0;
				y = O + 40 | 0;
				M = O;
				if(r << 16 >> 16 == 0 ? (l = e + 178 | 0, (i[l >> 1] | 0) != 0) : 0) {
					y = e + 180 | 0;
					s = e + 182 | 0;
					n = l;
					y = i[y >> 1] | 0;
					t = o[a >> 2] | 0;
					R = t + 2 | 0;
					i[t >> 1] = y;
					s = i[s >> 1] | 0;
					y = t + 4 | 0;
					i[R >> 1] = s;
					R = e + 184 | 0;
					R = i[R >> 1] | 0;
					s = t + 6 | 0;
					i[y >> 1] = R;
					y = e + 186 | 0;
					y = i[y >> 1] | 0;
					e = t + 8 | 0;
					i[s >> 1] = y;
					n = i[n >> 1] | 0;
					t = t + 10 | 0;
					o[a >> 2] = t;
					i[e >> 1] = n;
					c = O;
					return
				}
				p = M + 36 | 0;
				v = M + 32 | 0;
				_ = M + 28 | 0;
				b = M + 24 | 0;
				k = M + 20 | 0;
				F = M + 16 | 0;
				w = M + 12 | 0;
				m = M + 8 | 0;
				S = M + 4 | 0;
				r = M;
				l = r + 40 | 0;
				do {
					o[r >> 2] = 0;
					r = r + 4 | 0
				} while ((r | 0) < (l | 0));
				E = 7;
				r = 0;
				while(1) {
					h = i[e + 160 + (E << 1) >> 1] | 0;
					l = h << 16 >> 16;
					if(h << 16 >> 16 < 0) l = ~((l ^ -4) >> 2);
					else l = l >>> 2;
					r = Wt(r, l & 65535, s) | 0;
					u = E * 10 | 0;
					h = 9;
					while(1) {
						d = M + (h << 2) | 0;
						f = o[d >> 2] | 0;
						A = i[e + (h + u << 1) >> 1] | 0;
						l = A + f | 0;
						if((A ^ f | 0) > -1 & (l ^ f | 0) < 0) {
							o[s >> 2] = 1;
							l = (f >>> 31) + 2147483647 | 0
						}
						o[d >> 2] = l;
						if((h | 0) > 0) h = h + -1 | 0;
						else break
					}
					if((E | 0) > 0) E = E + -1 | 0;
					else break
				}
				l = r << 16 >> 16;
				if(r << 16 >> 16 < 0) l = ~((l ^ -2) >> 1);
				else l = l >>> 1;
				i[R + 18 >> 1] = (o[p >> 2] | 0) >>> 3;
				i[R + 16 >> 1] = (o[v >> 2] | 0) >>> 3;
				i[R + 14 >> 1] = (o[_ >> 2] | 0) >>> 3;
				i[R + 12 >> 1] = (o[b >> 2] | 0) >>> 3;
				i[R + 10 >> 1] = (o[k >> 2] | 0) >>> 3;
				i[R + 8 >> 1] = (o[F >> 2] | 0) >>> 3;
				i[R + 6 >> 1] = (o[w >> 2] | 0) >>> 3;
				i[R + 4 >> 1] = (o[m >> 2] | 0) >>> 3;
				i[R + 2 >> 1] = (o[S >> 2] | 0) >>> 3;
				i[R >> 1] = (o[M >> 2] | 0) >>> 3;
				r = e + 178 | 0;
				l = (((l << 16) + 167772160 | 0) >>> 16) + 128 | 0;
				i[r >> 1] = l;
				l = l << 16;
				if((l | 0) < 0) l = ~((l >> 16 ^ -256) >> 8);
				else l = l >> 24;
				i[r >> 1] = l;
				if((l | 0) <= 63) {
					if((l | 0) < 0) {
						i[r >> 1] = 0;
						l = 0
					}
				} else {
					i[r >> 1] = 63;
					l = 63
				}
				A = Bi(l << 8 & 65535, 11560, s) | 0;
				A = A << 16 >> 16 > 0 ? 0 : A << 16 >> 16 < -14436 ? -14436 : A;
				i[t >> 1] = A;
				i[t + 2 >> 1] = A;
				i[t + 4 >> 1] = A;
				i[t + 6 >> 1] = A;
				A = ((A << 16 >> 16) * 5443 | 0) >>> 15 & 65535;
				i[t + 8 >> 1] = A;
				i[t + 10 >> 1] = A;
				i[t + 12 >> 1] = A;
				i[t + 14 >> 1] = A;
				Si(R, g, 10, s);
				Ti(g, 205, 10, s);
				mi(g, R, 10, s);
				t = e + 182 | 0;
				A = e + 180 | 0;
				Fi(n, 8, R, y, t, A, s);
				s = t;
				t = r;
				A = i[A >> 1] | 0;
				n = o[a >> 2] | 0;
				y = n + 2 | 0;
				i[n >> 1] = A;
				s = i[s >> 1] | 0;
				A = n + 4 | 0;
				i[y >> 1] = s;
				y = e + 184 | 0;
				y = i[y >> 1] | 0;
				s = n + 6 | 0;
				i[A >> 1] = y;
				e = e + 186 | 0;
				e = i[e >> 1] | 0;
				A = n + 8 | 0;
				i[s >> 1] = e;
				e = i[t >> 1] | 0;
				n = n + 10 | 0;
				o[a >> 2] = n;
				i[A >> 1] = e;
				c = O;
				return
			}

			function Sn(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var a = 0,
					l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0;
				h = c;
				c = c + 16 | 0;
				f = h + 2 | 0;
				d = h;
				u = e + 176 | 0;
				l = (s[u >> 1] | 0) + 1 | 0;
				l = (l & 65535 | 0) == 8 ? 0 : l & 65535;
				i[u >> 1] = l;
				l = e + ((l << 16 >> 16) * 10 << 1) | 0;
				a = l + 20 | 0;
				do {
					i[l >> 1] = i[r >> 1] | 0;
					l = l + 2 | 0;
					r = r + 2 | 0
				} while ((l | 0) < (a | 0));
				r = 0;
				a = 160;
				while(1) {
					l = i[n >> 1] | 0;
					r = (ee(l << 1, l) | 0) + r | 0;
					if((r | 0) < 0) {
						r = 2147483647;
						break
					}
					a = a + -1 << 16 >> 16;
					if(!(a << 16 >> 16)) break;
					else n = n + 2 | 0
				}
				si(r, f, d, t);
				r = i[f >> 1] | 0;
				f = r << 16 >> 16;
				n = f << 10;
				if((n | 0) != (f << 26 >> 16 | 0)) {
					o[t >> 2] = 1;
					n = r << 16 >> 16 > 0 ? 32767 : -32768
				}
				i[e + 160 + (i[u >> 1] << 1) >> 1] = (((i[d >> 1] | 0) >>> 5) + n << 16) + -558432256 >> 17;
				c = h;
				return
			}

			function pn(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var a = 0,
					s = 0,
					l = 0;
				s = e + 190 | 0;
				l = Wt(i[s >> 1] | 0, 1, t) | 0;
				i[s >> 1] = l;
				a = e + 188 | 0;
				do
					if(!(r << 16 >> 16)) {
						e = i[a >> 1] | 0;
						if(!(e << 16 >> 16)) {
							i[s >> 1] = 0;
							o[n >> 2] = 8;
							e = 1;
							break
						}
						s = (e & 65535) + 65535 & 65535;
						i[a >> 1] = s;
						if((Wt(l, s, t) | 0) << 16 >> 16 < 30) {
							o[n >> 2] = 8;
							e = 0
						} else e = 0
					} else {
						i[a >> 1] = 7;
						e = 0
					}
				while(0);
				return e | 0
			}

			function vn(e, r, n, t, i, o, a, s) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				i = i | 0;
				o = o | 0;
				a = a | 0;
				s = s | 0;
				if(!(o << 16 >> 16)) {
					o = e << 16 >> 16;
					if(((o << 16) + -5570560 | 0) < 65536) {
						r = (o * 3 | 0) + -58 + (r << 16 >> 16) | 0;
						r = r & 65535;
						return r | 0
					} else {
						r = o + 112 | 0;
						r = r & 65535;
						return r | 0
					}
				}
				if(!(a << 16 >> 16)) {
					s = (e & 65535) - (t & 65535) << 16;
					r = (r << 16 >> 16) + 2 + (s >> 15) + (s >> 16) | 0;
					r = r & 65535;
					return r | 0
				}
				t = t << 16 >> 16;
				t = (((n & 65535) - t << 16) + -327680 | 0) > 0 ? t + 5 & 65535 : n;
				i = i << 16 >> 16;
				n = e << 16 >> 16;
				t = (((i - (t & 65535) << 16) + -262144 | 0) > 0 ? i + 65532 & 65535 : t) << 16 >> 16;
				i = t * 196608 | 0;
				e = i + -393216 >> 16;
				o = ((r & 65535) << 16) + (n * 196608 | 0) >> 16;
				if(!(e - o & 32768)) {
					r = n + 5 - t | 0;
					r = r & 65535;
					return r | 0
				}
				if((i + 196608 >> 16 | 0) > (o | 0)) {
					r = o + 3 - e | 0;
					r = r & 65535;
					return r | 0
				} else {
					r = n + 11 - t | 0;
					r = r & 65535;
					return r | 0
				}
				return 0
			}

			function _n(e, r, n, t, i) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				i = i | 0;
				i = e << 16 >> 16;
				do
					if(!(t << 16 >> 16))
						if(e << 16 >> 16 < 95) {
							i = ((i * 393216 | 0) + -6881280 >> 16) + (r << 16 >> 16) | 0;
							break
						} else {
							i = i + 368 | 0;
							break
						}
				else i = ((((i - (n & 65535) | 0) * 393216 | 0) + 196608 | 0) >>> 16) + (r & 65535) | 0; while (0);
				return i & 65535 | 0
			}

			function bn(e, r, n, a) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				a = a | 0;
				var l = 0,
					f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0;
				l = o[a + 96 >> 2] | 0;
				if(e >>> 0 < 8) {
					d = (o[a + 100 >> 2] | 0) + (e << 2) | 0;
					c = o[d >> 2] | 0;
					t[n >> 0] = i[r + (i[c >> 1] << 1) >> 1] << 4 | e | i[r + (i[c + 2 >> 1] << 1) >> 1] << 5 | i[r + (i[c + 4 >> 1] << 1) >> 1] << 6 | i[r + (i[c + 6 >> 1] << 1) >> 1] << 7;
					c = l + (e << 1) | 0;
					a = i[c >> 1] | 0;
					if((a + -7 | 0) > 4) {
						l = 4;
						u = 4;
						e = 1;
						while(1) {
							h = i[r + (i[(o[d >> 2] | 0) + (l << 1) >> 1] << 1) >> 1] | 0;
							a = n + (e << 16 >> 16) | 0;
							t[a >> 0] = h;
							h = s[r + (i[(o[d >> 2] | 0) + ((u | 1) << 16 >> 16 << 1) >> 1] << 1) >> 1] << 1 | h & 65535;
							t[a >> 0] = h;
							h = s[r + (i[(o[d >> 2] | 0) + ((u | 2) << 16 >> 16 << 1) >> 1] << 1) >> 1] << 2 | h;
							t[a >> 0] = h;
							h = s[r + (i[(o[d >> 2] | 0) + ((u | 3) << 16 >> 16 << 1) >> 1] << 1) >> 1] << 3 | h;
							t[a >> 0] = h;
							h = s[r + (i[(o[d >> 2] | 0) + (u + 4 << 16 >> 16 << 16 >> 16 << 1) >> 1] << 1) >> 1] << 4 | h;
							t[a >> 0] = h;
							h = s[r + (i[(o[d >> 2] | 0) + (u + 5 << 16 >> 16 << 16 >> 16 << 1) >> 1] << 1) >> 1] << 5 | h;
							t[a >> 0] = h;
							h = s[r + (i[(o[d >> 2] | 0) + (u + 6 << 16 >> 16 << 16 >> 16 << 1) >> 1] << 1) >> 1] << 6 | h;
							t[a >> 0] = h;
							f = u + 8 << 16 >> 16;
							e = e + 1 << 16 >> 16;
							t[a >> 0] = s[r + (i[(o[d >> 2] | 0) + (u + 7 << 16 >> 16 << 16 >> 16 << 1) >> 1] << 1) >> 1] << 7 | h;
							l = f << 16 >> 16;
							a = i[c >> 1] | 0;
							if((l | 0) >= (a + -7 | 0)) break;
							else u = f
						}
					} else {
						f = 4;
						e = 1
					}
					c = a + 4 & 7;
					if(!c) return;
					l = n + (e << 16 >> 16) | 0;
					t[l >> 0] = 0;
					a = 0;
					u = 0;
					e = 0;
					while(1) {
						u = (s[r + (i[(o[d >> 2] | 0) + (f << 16 >> 16 << 1) >> 1] << 1) >> 1] & 255) << a | u & 255;
						t[l >> 0] = u;
						e = e + 1 << 16 >> 16;
						a = e << 16 >> 16;
						if((a | 0) >= (c | 0)) break;
						else f = f + 1 << 16 >> 16
					}
					return
				}
				if((e | 0) == 15) {
					t[n >> 0] = 15;
					return
				}
				t[n >> 0] = i[r >> 1] << 4 | e | i[r + 2 >> 1] << 5 | i[r + 4 >> 1] << 6 | i[r + 6 >> 1] << 7;
				a = l + (e << 1) | 0;
				e = i[a >> 1] | 0;
				l = ((e & 65535) << 16) + 262144 >> 16;
				d = l & -8;
				u = (d + 524281 | 0) >>> 3 & 65535;
				if(u << 16 >> 16 > 0) {
					l = ((l & -8) + 524281 | 0) >>> 3;
					c = ((l << 3) + 524280 & 524280) + 12 | 0;
					f = 1;
					e = r + 8 | 0;
					while(1) {
						t[n + (f << 16 >> 16) >> 0] = s[e + 2 >> 1] << 1 | s[e >> 1] | s[e + 4 >> 1] << 2 | s[e + 6 >> 1] << 3 | s[e + 8 >> 1] << 4 | s[e + 10 >> 1] << 5 | s[e + 12 >> 1] << 6 | s[e + 14 >> 1] << 7;
						if(u << 16 >> 16 > 1) {
							u = u + -1 << 16 >> 16;
							f = f + 1 << 16 >> 16;
							e = e + 16 | 0
						} else break
					}
					e = i[a >> 1] | 0;
					f = (l << 16) + 65536 >> 16
				} else {
					c = 4;
					f = 1
				}
				e = (0 - d | 4) + (e & 65535) << 16;
				u = e >> 16;
				if(!u) return;
				f = n + f | 0;
				t[f >> 0] = 0;
				if((e | 0) > 0) {
					e = 0;
					l = 0;
					a = 0
				} else return;
				do {
					l = l & 255 | i[r + (c + e << 1) >> 1] << e;
					t[f >> 0] = l;
					a = a + 1 << 16 >> 16;
					e = a << 16 >> 16
				} while ((e | 0) < (u | 0));
				return
			}

			function kn(e, r, n, a) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				a = a | 0;
				var l = 0,
					f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0;
				E = o[a + 100 >> 2] | 0;
				h = o[a + 96 >> 2] | 0;
				t[n >> 0] = e & 15;
				h = h + (e << 1) | 0;
				l = i[h >> 1] | 0;
				if(e >>> 0 >= 8) {
					c = ((l & 65535) << 16) + -458752 | 0;
					if((c | 0) > 0) {
						d = 1;
						u = r;
						while(1) {
							r = u + 16 | 0;
							a = d + 1 << 16 >> 16;
							t[n + (d << 16 >> 16) >> 0] = s[u + 14 >> 1] | s[u + 12 >> 1] << 1 | ((s[u + 2 >> 1] << 6 | s[u >> 1] << 7 | s[u + 4 >> 1] << 5 | s[u + 6 >> 1] << 4) & 240 | s[u + 8 >> 1] << 3 | s[u + 10 >> 1] << 2) & 252;
							c = c + -524288 & -65536;
							if((c | 0) <= 0) break;
							else {
								d = a;
								u = r
							}
						}
						l = i[h >> 1] | 0
					} else a = 1;
					d = l & 7;
					l = n + (a << 16 >> 16) | 0;
					t[l >> 0] = 0;
					if(!d) return;
					else {
						f = 0;
						u = 0;
						c = 0;
						a = r
					}
					while(1) {
						u = u & 255 | i[a >> 1] << 7 - f;
						t[l >> 0] = u;
						c = c + 1 << 16 >> 16;
						f = c << 16 >> 16;
						if((f | 0) >= (d | 0)) break;
						else a = a + 2 | 0
					}
					return
				}
				u = l << 16 >> 16;
				if(l << 16 >> 16 > 7) {
					l = E + (e << 2) | 0;
					a = 0;
					d = 0;
					f = 1;
					while(1) {
						w = s[r + (i[(o[l >> 2] | 0) + (a << 1) >> 1] << 1) >> 1] << 7;
						u = n + (f << 16 >> 16) | 0;
						t[u >> 0] = w;
						w = s[r + (i[(o[l >> 2] | 0) + ((d | 1) << 16 >> 16 << 1) >> 1] << 1) >> 1] << 6 | w;
						t[u >> 0] = w;
						w = s[r + (i[(o[l >> 2] | 0) + ((d | 2) << 16 >> 16 << 1) >> 1] << 1) >> 1] << 5 | w;
						t[u >> 0] = w;
						w = s[r + (i[(o[l >> 2] | 0) + ((d | 3) << 16 >> 16 << 1) >> 1] << 1) >> 1] << 4 | w;
						t[u >> 0] = w;
						w = s[r + (i[(o[l >> 2] | 0) + ((d | 4) << 16 >> 16 << 1) >> 1] << 1) >> 1] << 3 | w & 240;
						t[u >> 0] = w;
						w = s[r + (i[(o[l >> 2] | 0) + ((d | 5) << 16 >> 16 << 1) >> 1] << 1) >> 1] << 2 | w;
						t[u >> 0] = w;
						w = s[r + (i[(o[l >> 2] | 0) + ((d | 6) << 16 >> 16 << 1) >> 1] << 1) >> 1] << 1 | w;
						t[u >> 0] = w;
						c = d + 8 << 16 >> 16;
						f = f + 1 << 16 >> 16;
						t[u >> 0] = w & 254 | s[r + (i[(o[l >> 2] | 0) + ((d | 7) << 16 >> 16 << 1) >> 1] << 1) >> 1];
						a = c << 16 >> 16;
						u = i[h >> 1] | 0;
						if((a | 0) >= (u + -7 | 0)) break;
						else d = c
					}
				} else {
					c = 0;
					f = 1
				}
				h = u & 7;
				d = n + (f << 16 >> 16) | 0;
				t[d >> 0] = 0;
				if(!h) return;
				f = E + (e << 2) | 0;
				l = 0;
				a = 0;
				u = 0;
				while(1) {
					a = (s[r + (i[(o[f >> 2] | 0) + (c << 16 >> 16 << 1) >> 1] << 1) >> 1] & 255) << 7 - l | a & 255;
					t[d >> 0] = a;
					u = u + 1 << 16 >> 16;
					l = u << 16 >> 16;
					if((l | 0) >= (h | 0)) break;
					else c = c + 1 << 16 >> 16
				}
				return
			}

			function Fn(e, r, n, a) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				a = a | 0;
				var l = 0,
					f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0;
				E = o[a + 100 >> 2] | 0;
				h = o[a + 96 >> 2] | 0;
				t[n >> 0] = e << 3;
				h = h + (e << 1) | 0;
				l = i[h >> 1] | 0;
				if(e >>> 0 >= 8) {
					c = ((l & 65535) << 16) + -458752 | 0;
					if((c | 0) > 0) {
						d = 1;
						u = r;
						while(1) {
							r = u + 16 | 0;
							a = d + 1 << 16 >> 16;
							t[n + (d << 16 >> 16) >> 0] = s[u + 14 >> 1] | s[u + 12 >> 1] << 1 | ((s[u + 2 >> 1] << 6 | s[u >> 1] << 7 | s[u + 4 >> 1] << 5 | s[u + 6 >> 1] << 4) & 240 | s[u + 8 >> 1] << 3 | s[u + 10 >> 1] << 2) & 252;
							c = c + -524288 & -65536;
							if((c | 0) <= 0) break;
							else {
								d = a;
								u = r
							}
						}
						l = i[h >> 1] | 0
					} else a = 1;
					d = l & 7;
					l = n + (a << 16 >> 16) | 0;
					t[l >> 0] = 0;
					if(!d) return;
					else {
						f = 0;
						u = 0;
						c = 0;
						a = r
					}
					while(1) {
						u = u & 255 | i[a >> 1] << 7 - f;
						t[l >> 0] = u;
						c = c + 1 << 16 >> 16;
						f = c << 16 >> 16;
						if((f | 0) >= (d | 0)) break;
						else a = a + 2 | 0
					}
					return
				}
				u = l << 16 >> 16;
				if(l << 16 >> 16 > 7) {
					l = E + (e << 2) | 0;
					a = 0;
					d = 0;
					f = 1;
					while(1) {
						w = s[r + (i[(o[l >> 2] | 0) + (a << 1) >> 1] << 1) >> 1] << 7;
						u = n + (f << 16 >> 16) | 0;
						t[u >> 0] = w;
						w = s[r + (i[(o[l >> 2] | 0) + ((d | 1) << 16 >> 16 << 1) >> 1] << 1) >> 1] << 6 | w;
						t[u >> 0] = w;
						w = s[r + (i[(o[l >> 2] | 0) + ((d | 2) << 16 >> 16 << 1) >> 1] << 1) >> 1] << 5 | w;
						t[u >> 0] = w;
						w = s[r + (i[(o[l >> 2] | 0) + ((d | 3) << 16 >> 16 << 1) >> 1] << 1) >> 1] << 4 | w;
						t[u >> 0] = w;
						w = s[r + (i[(o[l >> 2] | 0) + ((d | 4) << 16 >> 16 << 1) >> 1] << 1) >> 1] << 3 | w & 240;
						t[u >> 0] = w;
						w = s[r + (i[(o[l >> 2] | 0) + ((d | 5) << 16 >> 16 << 1) >> 1] << 1) >> 1] << 2 | w;
						t[u >> 0] = w;
						w = s[r + (i[(o[l >> 2] | 0) + ((d | 6) << 16 >> 16 << 1) >> 1] << 1) >> 1] << 1 | w;
						t[u >> 0] = w;
						c = d + 8 << 16 >> 16;
						f = f + 1 << 16 >> 16;
						t[u >> 0] = w & 254 | s[r + (i[(o[l >> 2] | 0) + ((d | 7) << 16 >> 16 << 1) >> 1] << 1) >> 1];
						a = c << 16 >> 16;
						u = i[h >> 1] | 0;
						if((a | 0) >= (u + -7 | 0)) break;
						else d = c
					}
				} else {
					c = 0;
					f = 1
				}
				h = u & 7;
				d = n + (f << 16 >> 16) | 0;
				t[d >> 0] = 0;
				if(!h) return;
				f = E + (e << 2) | 0;
				l = 0;
				a = 0;
				u = 0;
				while(1) {
					a = (s[r + (i[(o[f >> 2] | 0) + (c << 16 >> 16 << 1) >> 1] << 1) >> 1] & 255) << 7 - l | a & 255;
					t[d >> 0] = a;
					u = u + 1 << 16 >> 16;
					l = u << 16 >> 16;
					if((l | 0) >= (h | 0)) break;
					else c = c + 1 << 16 >> 16
				}
				return
			}

			function Mn(e) {
				e = e | 0;
				var r = 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				o[e >> 2] = 0;
				r = xi(16) | 0;
				if(!r) {
					e = -1;
					return e | 0
				}
				i[r >> 1] = 0;
				i[r + 2 >> 1] = 0;
				i[r + 4 >> 1] = 0;
				i[r + 6 >> 1] = 0;
				i[r + 8 >> 1] = 0;
				i[r + 10 >> 1] = 0;
				i[r + 12 >> 1] = 0;
				i[r + 14 >> 1] = 0;
				o[e >> 2] = r;
				e = 0;
				return e | 0
			}

			function gn(e) {
				e = e | 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				i[e >> 1] = 0;
				i[e + 2 >> 1] = 0;
				i[e + 4 >> 1] = 0;
				i[e + 6 >> 1] = 0;
				i[e + 8 >> 1] = 0;
				i[e + 10 >> 1] = 0;
				i[e + 12 >> 1] = 0;
				i[e + 14 >> 1] = 0;
				e = 0;
				return e | 0
			}

			function Rn(e) {
				e = e | 0;
				var r = 0;
				if(!e) return;
				r = o[e >> 2] | 0;
				if(!r) return;
				Hi(r);
				o[e >> 2] = 0;
				return
			}

			function yn(e, r, n, t, a) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				var s = 0,
					l = 0,
					f = 0,
					u = 0,
					c = 0;
				f = r << 16 >> 16 < 2722 ? 0 : r << 16 >> 16 < 5444 ? 1 : 2;
				l = Ci(n, 1, a) | 0;
				c = e + 4 | 0;
				if(!(n << 16 >> 16 > 200 ? l << 16 >> 16 > (i[c >> 1] | 0) : 0)) {
					l = i[e >> 1] | 0;
					if(l << 16 >> 16) {
						s = l + -1 << 16 >> 16;
						i[e >> 1] = s;
						s = s << 16 >> 16 != 0;
						u = 5
					}
				} else {
					i[e >> 1] = 8;
					s = 1;
					u = 5
				}
				if((u | 0) == 5)
					if((f & 65535) < 2 & s) f = (f & 65535) + 1 & 65535;
				u = e + 6 | 0;
				i[u >> 1] = r;
				s = ri(u, 5) | 0;
				if(!(f << 16 >> 16 != 0 | s << 16 >> 16 > 5443))
					if(s << 16 >> 16 < 0) s = 16384;
					else {
						s = s << 16 >> 16;
						s = (((s << 18 >> 18 | 0) == (s | 0) ? s << 2 : s >>> 15 ^ 32767) << 16 >> 16) * 24660 >> 15;
						if((s | 0) > 32767) {
							o[a >> 2] = 1;
							s = 32767
						}
						s = 16384 - s & 65535
					}
				else s = 0;
				l = e + 2 | 0;
				if(!(i[l >> 1] | 0)) s = Pi(s, 1, a) | 0;
				i[t >> 1] = s;
				i[l >> 1] = s;
				i[c >> 1] = n;
				t = e + 12 | 0;
				i[e + 14 >> 1] = i[t >> 1] | 0;
				n = e + 10 | 0;
				i[t >> 1] = i[n >> 1] | 0;
				e = e + 8 | 0;
				i[n >> 1] = i[e >> 1] | 0;
				i[e >> 1] = i[u >> 1] | 0;
				return
			}

			function On(e) {
				e = e | 0;
				var r = 0,
					n = 0,
					t = 0,
					a = 0,
					s = 0,
					l = 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				o[e >> 2] = 0;
				r = xi(68) | 0;
				t = r;
				if(!r) {
					e = -1;
					return e | 0
				}
				o[r + 28 >> 2] = 0;
				a = r + 64 | 0;
				o[a >> 2] = 0;
				s = r + 32 | 0;
				if(((Jt(s) | 0) << 16 >> 16 == 0 ? (l = r + 48 | 0, (Jt(l) | 0) << 16 >> 16 == 0) : 0) ? (Mn(a) | 0) << 16 >> 16 == 0 : 0) {
					n = r + 32 | 0;
					do {
						i[r >> 1] = 0;
						r = r + 2 | 0
					} while ((r | 0) < (n | 0));
					Jt(s) | 0;
					Jt(l) | 0;
					gn(o[a >> 2] | 0) | 0;
					o[e >> 2] = t;
					e = 0;
					return e | 0
				}
				Rn(a);
				Hi(r);
				e = -1;
				return e | 0
			}

			function An(e) {
				e = e | 0;
				var r = 0;
				if(!e) return;
				r = o[e >> 2] | 0;
				if(!r) return;
				Rn(r + 64 | 0);
				Hi(o[e >> 2] | 0);
				o[e >> 2] = 0;
				return
			}

			function Tn(e) {
				e = e | 0;
				var r = 0,
					n = 0,
					t = 0;
				if(!e) {
					t = -1;
					return t | 0
				}
				r = e + 32 | 0;
				n = e;
				t = n + 32 | 0;
				do {
					i[n >> 1] = 0;
					n = n + 2 | 0
				} while ((n | 0) < (t | 0));
				Jt(r) | 0;
				Jt(e + 48 | 0) | 0;
				gn(o[e + 64 >> 2] | 0) | 0;
				t = 0;
				return t | 0
			}

			function Dn(e, r, n, t, a, l, f, u, d, h, E, w, m, S, p, v, _, b, k) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				d = d | 0;
				h = h | 0;
				E = E | 0;
				w = w | 0;
				m = m | 0;
				S = S | 0;
				p = p | 0;
				v = v | 0;
				_ = _ | 0;
				b = b | 0;
				k = k | 0;
				var F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0;
				P = c;
				c = c + 48 | 0;
				M = P + 34 | 0;
				R = P + 32 | 0;
				O = P + 30 | 0;
				y = P + 28 | 0;
				g = P + 18 | 0;
				F = P + 8 | 0;
				A = P + 6 | 0;
				T = P + 4 | 0;
				D = P + 2 | 0;
				N = P;
				if(r) {
					E = e + 32 | 0;
					Zt(E, r, a, M, R, A, T, k);
					do
						if((r | 0) != 7) {
							Jr(r, l, f, u, d, h, g, F, N, D, k);
							if((r | 0) == 5) {
								wt(o[e + 64 >> 2] | 0, n, t, a, g, F, i[A >> 1] | 0, i[T >> 1] | 0, i[M >> 1] | 0, i[R >> 1] | 0, 40, i[N >> 1] | 0, i[D >> 1] | 0, w, p, v, O, y, _, b, k);
								break
							} else {
								e = pt(r, i[M >> 1] | 0, i[R >> 1] | 0, g, F, w, p, v, O, y, b, k) | 0;
								l = o[_ >> 2] | 0;
								o[_ >> 2] = l + 2;
								i[l >> 1] = e;
								break
							}
						} else {
							i[v >> 1] = Nn(f, d, k) | 0;
							e = mt(7, i[M >> 1] | 0, i[R >> 1] | 0, v, O, y, o[b + 68 >> 2] | 0, k) | 0;
							l = o[_ >> 2] | 0;
							o[_ >> 2] = l + 2;
							i[l >> 1] = e
						}
					while(0);
					Qt(E, i[O >> 1] | 0, i[y >> 1] | 0);
					c = P;
					return
				}
				if(!(E << 16 >> 16)) {
					Zt(e + 48 | 0, 0, a, M, R, A, T, k);
					Jr(0, l, f, u, d, h, g, F, N, D, k);
					Zr(l, A, T, k);
					l = ht(e + 32 | 0, i[e >> 1] | 0, i[e + 2 >> 1] | 0, e + 8 | 0, e + 18 | 0, i[e + 4 >> 1] | 0, i[e + 6 >> 1] | 0, a, i[M >> 1] | 0, i[R >> 1] | 0, F, g, i[A >> 1] | 0, i[T >> 1] | 0, w, m, S, p, v, k) | 0;
					i[o[e + 28 >> 2] >> 1] = l;
					c = P;
					return
				}
				E = o[_ >> 2] | 0;
				o[_ >> 2] = E + 2;
				o[e + 28 >> 2] = E;
				E = e + 48 | 0;
				n = e + 32 | 0;
				m = n;
				m = s[m >> 1] | s[m + 2 >> 1] << 16;
				n = n + 4 | 0;
				n = s[n >> 1] | s[n + 2 >> 1] << 16;
				_ = E;
				S = _;
				i[S >> 1] = m;
				i[S + 2 >> 1] = m >>> 16;
				_ = _ + 4 | 0;
				i[_ >> 1] = n;
				i[_ + 2 >> 1] = n >>> 16;
				_ = e + 40 | 0;
				n = _;
				n = s[n >> 1] | s[n + 2 >> 1] << 16;
				_ = _ + 4 | 0;
				_ = s[_ >> 1] | s[_ + 2 >> 1] << 16;
				S = e + 56 | 0;
				m = S;
				i[m >> 1] = n;
				i[m + 2 >> 1] = n >>> 16;
				S = S + 4 | 0;
				i[S >> 1] = _;
				i[S + 2 >> 1] = _ >>> 16;
				S = e + 2 | 0;
				Zt(E, 0, a, e, S, A, T, k);
				Jr(0, l, f, u, d, h, e + 18 | 0, e + 8 | 0, N, D, k);
				u = (s[D >> 1] | 0) + 1 | 0;
				_ = i[N >> 1] | 0;
				m = u << 16 >> 16;
				if((u & 65535) << 16 >> 16 < 0) {
					b = 0 - m << 16;
					if((b | 0) < 983040) b = _ << 16 >> 16 >> (b >> 16) & 65535;
					else b = 0
				} else {
					_ = _ << 16 >> 16;
					b = _ << m;
					if((b << 16 >> 16 >> m | 0) == (_ | 0)) b = b & 65535;
					else b = (_ >>> 15 ^ 32767) & 65535
				}
				i[v >> 1] = b;
				Zr(l, e + 4 | 0, e + 6 | 0, k);
				dt(E, i[e >> 1] | 0, i[S >> 1] | 0, i[D >> 1] | 0, i[N >> 1] | 0, k);
				c = P;
				return
			}

			function Nn(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					o = 0,
					a = 0;
				o = 10;
				n = e;
				t = r;
				e = 0;
				while(1) {
					e = (ee(i[t >> 1] >> 1, i[n >> 1] | 0) | 0) + e | 0;
					e = e + (ee(i[t + 2 >> 1] >> 1, i[n + 2 >> 1] | 0) | 0) | 0;
					e = e + (ee(i[t + 4 >> 1] >> 1, i[n + 4 >> 1] | 0) | 0) | 0;
					e = e + (ee(i[t + 6 >> 1] >> 1, i[n + 6 >> 1] | 0) | 0) | 0;
					o = o + -1 << 16 >> 16;
					if(!(o << 16 >> 16)) break;
					else {
						n = n + 8 | 0;
						t = t + 8 | 0
					}
				}
				n = e << 1;
				o = vi(n | 1) | 0;
				a = o << 16 >> 16;
				n = (o << 16 >> 16 < 17 ? n >> 17 - a : n << a + -17) & 65535;
				if(n << 16 >> 16 < 1) {
					r = 0;
					return r | 0
				} else {
					o = 20;
					t = r;
					e = 0
				}
				while(1) {
					r = i[t >> 1] >> 1;
					r = ((ee(r, r) | 0) >>> 2) + e | 0;
					e = i[t + 2 >> 1] >> 1;
					e = r + ((ee(e, e) | 0) >>> 2) | 0;
					o = o + -1 << 16 >> 16;
					if(!(o << 16 >> 16)) break;
					else t = t + 4 | 0
				}
				e = e << 3;
				o = vi(e) | 0;
				r = o << 16 >> 16;
				n = Gt(n, (o << 16 >> 16 < 16 ? e >> 16 - r : e << r + -16) & 65535) | 0;
				r = (a << 16) + 327680 - (r << 16) | 0;
				e = r >> 16;
				if((r | 0) > 65536) e = n << 16 >> 16 >> e + -1;
				else e = n << 16 >> 16 << 1 - e;
				r = e & 65535;
				return r | 0
			}

			function Pn(e, r, n, t, a, s) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				var l = 0,
					f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0;
				o[s >> 2] = 0;
				d = a << 16 >> 16;
				u = d >>> 2 & 65535;
				E = u << 16 >> 16 == 0;
				if(E) f = 0;
				else {
					c = u;
					l = n;
					f = 0;
					while(1) {
						w = i[l >> 1] | 0;
						w = (ee(w, w) | 0) + f | 0;
						f = i[l + 2 >> 1] | 0;
						f = w + (ee(f, f) | 0) | 0;
						w = i[l + 4 >> 1] | 0;
						w = f + (ee(w, w) | 0) | 0;
						f = i[l + 6 >> 1] | 0;
						f = w + (ee(f, f) | 0) | 0;
						c = c + -1 << 16 >> 16;
						if(!(c << 16 >> 16)) break;
						else l = l + 8 | 0
					}
				}
				if(!((f >>> 31 ^ 1) & (f | 0) < 1073741824)) {
					f = d >>> 1 & 65535;
					if(!(f << 16 >> 16)) f = 1;
					else {
						l = f;
						c = n;
						f = 0;
						while(1) {
							w = i[c >> 1] >> 2;
							w = (ee(w, w) | 0) + f | 0;
							f = i[c + 2 >> 1] >> 2;
							f = w + (ee(f, f) | 0) | 0;
							l = l + -1 << 16 >> 16;
							if(!(l << 16 >> 16)) break;
							else c = c + 4 | 0
						}
						f = f << 1 | 1
					}
					w = (vi(f) | 0) << 16 >> 16;
					h = w + 65532 & 65535;
					w = Ni(f << w, s) | 0
				} else {
					d = f << 1 | 1;
					w = vi(d) | 0;
					h = w;
					w = Ni(d << (w << 16 >> 16), s) | 0
				}
				o[s >> 2] = 0;
				do
					if(!(a << 16 >> 16)) {
						f = 1;
						m = 14
					} else {
						d = a;
						c = r;
						f = n;
						a = 0;
						while(1) {
							S = ee(i[f >> 1] | 0, i[c >> 1] | 0) | 0;
							l = S + a | 0;
							if((S ^ a | 0) > 0 & (l ^ a | 0) < 0) break;
							d = d + -1 << 16 >> 16;
							if(!(d << 16 >> 16)) {
								m = 13;
								break
							} else {
								c = c + 2 | 0;
								f = f + 2 | 0;
								a = l
							}
						}
						if((m | 0) == 13) {
							f = l << 1 | 1;
							m = 14;
							break
						}
						o[s >> 2] = 1;
						if(E) f = 1;
						else {
							f = r;
							l = 0;
							while(1) {
								l = (ee(i[n >> 1] >> 2, i[f >> 1] | 0) | 0) + l | 0;
								l = l + (ee(i[n + 2 >> 1] >> 2, i[f + 2 >> 1] | 0) | 0) | 0;
								l = l + (ee(i[n + 4 >> 1] >> 2, i[f + 4 >> 1] | 0) | 0) | 0;
								l = l + (ee(i[n + 6 >> 1] >> 2, i[f + 6 >> 1] | 0) | 0) | 0;
								u = u + -1 << 16 >> 16;
								if(!(u << 16 >> 16)) break;
								else {
									f = f + 8 | 0;
									n = n + 8 | 0
								}
							}
							f = l << 1 | 1
						}
						n = (vi(f) | 0) << 16 >> 16;
						l = n + 65532 & 65535;
						n = Ni(f << n, s) | 0
					}
				while(0);
				if((m | 0) == 14) {
					n = vi(f) | 0;
					l = n;
					n = Ni(f << (n << 16 >> 16), s) | 0
				}
				i[t >> 1] = w;
				f = h << 16 >> 16;
				i[t + 2 >> 1] = 15 - f;
				i[t + 4 >> 1] = n;
				l = l << 16 >> 16;
				i[t + 6 >> 1] = 15 - l;
				if(n << 16 >> 16 < 4) {
					S = 0;
					return S | 0
				}
				l = Pi(Gt(n << 16 >> 16 >>> 1 & 65535, w) | 0, l - f & 65535, s) | 0;
				l = l << 16 >> 16 > 19661 ? 19661 : l;
				if((e | 0) != 7) {
					S = l;
					return S | 0
				}
				S = l & 65532;
				return S | 0
			}

			function Cn(e, r, n, t, a, s, l) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				var f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0;
				u = (t & 65535) + 65535 & 65535;
				if(u << 16 >> 16 > a << 16 >> 16) {
					h = t + -1 << 16 >> 16 << 16 >> 16;
					t = -2147483648;
					while(1) {
						c = o[e + (0 - h << 2) >> 2] | 0;
						f = c << 1;
						c = (f >> 1 | 0) == (c | 0) ? f : c >> 31 ^ 2147483647;
						f = o[e + (~h << 2) >> 2] | 0;
						d = c - f | 0;
						if(((d ^ c) & (c ^ f) | 0) < 0) {
							o[l >> 2] = 1;
							d = (c >>> 31) + 2147483647 | 0
						}
						c = o[e + (1 - h << 2) >> 2] | 0;
						f = d - c | 0;
						if(((f ^ d) & (c ^ d) | 0) < 0) {
							o[l >> 2] = 1;
							f = (d >>> 31) + 2147483647 | 0
						}
						d = Bn(f) | 0;
						t = (d | 0) < (t | 0) ? t : d;
						u = u + -1 << 16 >> 16;
						if(u << 16 >> 16 <= a << 16 >> 16) {
							a = t;
							break
						} else h = h + -1 | 0
					}
				} else a = -2147483648;
				e = n << 16 >> 16 > 0;
				if(e) {
					t = 0;
					f = r;
					u = 0;
					while(1) {
						d = i[f >> 1] | 0;
						d = ee(d, d) | 0;
						if((d | 0) != 1073741824) {
							c = (d << 1) + u | 0;
							if((d ^ u | 0) > 0 & (c ^ u | 0) < 0) {
								o[l >> 2] = 1;
								u = (u >>> 31) + 2147483647 | 0
							} else u = c
						} else {
							o[l >> 2] = 1;
							u = 2147483647
						}
						t = t + 1 << 16 >> 16;
						if(t << 16 >> 16 >= n << 16 >> 16) break;
						else f = f + 2 | 0
					}
					if(e) {
						e = 0;
						h = r;
						t = r + -2 | 0;
						f = 0;
						while(1) {
							d = ee(i[t >> 1] | 0, i[h >> 1] | 0) | 0;
							if((d | 0) != 1073741824) {
								c = (d << 1) + f | 0;
								if((d ^ f | 0) > 0 & (c ^ f | 0) < 0) {
									o[l >> 2] = 1;
									f = (f >>> 31) + 2147483647 | 0
								} else f = c
							} else {
								o[l >> 2] = 1;
								f = 2147483647
							}
							e = e + 1 << 16 >> 16;
							if(e << 16 >> 16 >= n << 16 >> 16) break;
							else {
								h = h + 2 | 0;
								t = t + 2 | 0
							}
						}
					} else f = 0
				} else {
					u = 0;
					f = 0
				}
				t = u << 1;
				t = (t >> 1 | 0) == (u | 0) ? t : u >> 31 ^ 2147483647;
				n = f << 1;
				n = (n >> 1 | 0) == (f | 0) ? n : f >> 31 ^ 2147483647;
				u = t - n | 0;
				if(((u ^ t) & (n ^ t) | 0) < 0) {
					o[l >> 2] = 1;
					u = (t >>> 31) + 2147483647 | 0
				}
				e = Bn(u) | 0;
				h = ((vi(a) | 0) & 65535) + 65535 | 0;
				u = h << 16 >> 16;
				if((h & 65535) << 16 >> 16 > 0) {
					t = a << u;
					if((t >> u | 0) != (a | 0)) t = a >> 31 ^ 2147483647
				} else {
					u = 0 - u << 16;
					if((u | 0) < 2031616) t = a >> (u >> 16);
					else t = 0
				}
				d = vi(e) | 0;
				f = d << 16 >> 16;
				if(d << 16 >> 16 > 0) {
					u = e << f;
					if((u >> f | 0) == (e | 0)) E = 33;
					else {
						u = e >> 31 ^ 2147483647;
						E = 33
					}
				} else {
					u = 0 - f << 16;
					if((u | 0) < 2031616) {
						u = e >> (u >> 16);
						E = 33
					} else c = 0
				}
				if((E | 0) == 33)
					if(u >>> 0 > 65535) c = Gt(t >>> 16 & 65535, u >>> 16 & 65535) | 0;
					else c = 0;
				u = d & 65535;
				E = (h & 65535) - u | 0;
				t = E & 65535;
				if(!(E & 32768)) {
					l = Pi(c, t, l) | 0;
					i[s >> 1] = l;
					return 0
				}
				if(t << 16 >> 16 != -32768) {
					l = u - h | 0;
					f = l << 16 >> 16;
					if((l & 65535) << 16 >> 16 < 0) {
						f = 0 - f << 16;
						if((f | 0) >= 983040) {
							l = 0;
							i[s >> 1] = l;
							return 0
						}
						l = c << 16 >> 16 >> (f >> 16) & 65535;
						i[s >> 1] = l;
						return 0
					}
				} else f = 32767;
				t = c << 16 >> 16;
				u = t << f;
				if((u << 16 >> 16 >> f | 0) == (t | 0)) {
					l = u & 65535;
					i[s >> 1] = l;
					return 0
				}
				l = (t >>> 15 ^ 32767) & 65535;
				i[s >> 1] = l;
				return 0
			}

			function In(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				if(n << 16 >> 16) r = r << 16 >> 16 << 1 & 65535;
				if(r << 16 >> 16 < 0) {
					e = e + -2 | 0;
					r = (r & 65535) + 6 & 65535
				}
				n = r << 16 >> 16;
				t = 6 - n << 16 >> 16;
				r = (ee(i[3468 + (n << 1) >> 1] | 0, i[e >> 1] | 0) | 0) + 16384 | 0;
				r = r + (ee(i[3468 + (t << 1) >> 1] | 0, i[e + 2 >> 1] | 0) | 0) | 0;
				r = r + (ee(i[3468 + (n + 6 << 1) >> 1] | 0, i[e + -2 >> 1] | 0) | 0) | 0;
				r = r + (ee(i[3468 + (t + 6 << 1) >> 1] | 0, i[e + 4 >> 1] | 0) | 0) | 0;
				r = (ee(i[3468 + (n + 12 << 1) >> 1] | 0, i[e + -4 >> 1] | 0) | 0) + r | 0;
				r = r + (ee(i[3468 + (t + 12 << 1) >> 1] | 0, i[e + 6 >> 1] | 0) | 0) | 0;
				n = r + (ee(i[3468 + (n + 18 << 1) >> 1] | 0, i[e + -6 >> 1] | 0) | 0) | 0;
				return(n + (ee(i[3468 + (t + 18 << 1) >> 1] | 0, i[e + 8 >> 1] | 0) | 0) | 0) >>> 15 & 65535 | 0
			}

			function Bn(e) {
				e = e | 0;
				e = e - (e >>> 31) | 0;
				return e >> 31 ^ e | 0
			}

			function Ln(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var o = 0,
					a = 0,
					s = 0,
					l = 0,
					f = 0;
				if(!(e << 16 >> 16)) return;
				else {
					o = 3518;
					a = 3538;
					t = n
				}
				while(1) {
					t = t + 2 | 0;
					r = r + 2 | 0;
					f = i[r >> 1] | 0;
					l = i[o >> 1] | 0;
					n = ee(l, f) | 0;
					n = (n | 0) == 1073741824 ? 2147483647 : n << 1;
					f = (ee(i[a >> 1] | 0, f) | 0) >> 15;
					s = (f << 1) + n | 0;
					s = (n ^ f | 0) > 0 & (s ^ n | 0) < 0 ? (n >>> 31) + 2147483647 | 0 : s;
					l = (ee(l, i[t >> 1] | 0) | 0) >> 15;
					n = s + (l << 1) | 0;
					n = (s ^ l | 0) > 0 & (n ^ s | 0) < 0 ? (s >>> 31) + 2147483647 | 0 : n;
					i[r >> 1] = n >>> 16;
					i[t >> 1] = (n >>> 1) - (n >> 16 << 15);
					e = e + -1 << 16 >> 16;
					if(!(e << 16 >> 16)) break;
					else {
						o = o + 2 | 0;
						a = a + 2 | 0
					}
				}
				return
			}

			function Un(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					i = 0;
				t = e & 65535;
				i = t << 16;
				r = r << 16 >> 16;
				e = (r << 1) + i | 0;
				if(!((r ^ i | 0) > 0 & (e ^ i | 0) < 0)) {
					i = e;
					return i | 0
				}
				o[n >> 2] = 1;
				i = (t >>> 15) + 2147483647 | 0;
				return i | 0
			}

			function xn(e) {
				e = e | 0;
				var r = 0,
					n = 0,
					t = 0;
				if(!e) {
					t = -1;
					return t | 0
				}
				o[e >> 2] = 0;
				r = xi(22) | 0;
				if(!r) {
					t = -1;
					return t | 0
				}
				i[r >> 1] = 4096;
				n = r + 2 | 0;
				t = n + 20 | 0;
				do {
					i[n >> 1] = 0;
					n = n + 2 | 0
				} while ((n | 0) < (t | 0));
				o[e >> 2] = r;
				t = 0;
				return t | 0
			}

			function Hn(e) {
				e = e | 0;
				var r = 0;
				if(!e) {
					r = -1;
					return r | 0
				}
				i[e >> 1] = 4096;
				e = e + 2 | 0;
				r = e + 20 | 0;
				do {
					i[e >> 1] = 0;
					e = e + 2 | 0
				} while ((e | 0) < (r | 0));
				r = 0;
				return r | 0
			}

			function zn(e) {
				e = e | 0;
				var r = 0;
				if(!e) return;
				r = o[e >> 2] | 0;
				if(!r) return;
				Hi(r);
				o[e >> 2] = 0;
				return
			}

			function jn(e, r, n, t, o, a) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				a = a | 0;
				var l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0,
					C = 0,
					I = 0,
					B = 0,
					L = 0,
					U = 0;
				B = c;
				c = c + 96 | 0;
				C = B + 66 | 0;
				I = B + 44 | 0;
				P = B + 22 | 0;
				f = B;
				A = r + 2 | 0;
				N = n + 2 | 0;
				D = (i[N >> 1] << 1) + (s[A >> 1] << 16) | 0;
				l = Bn(D) | 0;
				l = dn(l, i[r >> 1] | 0, i[n >> 1] | 0, a) | 0;
				if((D | 0) > 0) l = Vn(l) | 0;
				y = l >> 16;
				i[o >> 1] = Ni(l, a) | 0;
				b = l >> 20;
				T = C + 2 | 0;
				i[T >> 1] = b;
				D = I + 2 | 0;
				i[D >> 1] = (l >>> 5) - (b << 15);
				b = ee(y, y) | 0;
				b = (b | 0) == 1073741824 ? 2147483647 : b << 1;
				y = (ee((l >>> 1) - (y << 15) << 16 >> 16, y) | 0) >> 15;
				O = y << 1;
				R = O + b | 0;
				R = (y ^ b | 0) > 0 & (R ^ b | 0) < 0 ? (b >>> 31) + 2147483647 | 0 : R;
				O = R + O | 0;
				O = 2147483647 - (Bn((R ^ y | 0) > 0 & (O ^ R | 0) < 0 ? (R >>> 31) + 2147483647 | 0 : O) | 0) | 0;
				R = O >> 16;
				y = i[r >> 1] | 0;
				b = ee(R, y) | 0;
				b = (b | 0) == 1073741824 ? 2147483647 : b << 1;
				y = (ee((O >>> 1) - (R << 15) << 16 >> 16, y) | 0) >> 15;
				O = (y << 1) + b | 0;
				O = (y ^ b | 0) > 0 & (O ^ b | 0) < 0 ? (b >>> 31) + 2147483647 | 0 : O;
				R = (ee(i[n >> 1] | 0, R) | 0) >> 15;
				b = O + (R << 1) | 0;
				b = (O ^ R | 0) > 0 & (b ^ O | 0) < 0 ? (O >>> 31) + 2147483647 | 0 : b;
				O = vi(b) | 0;
				b = b << (O << 16 >> 16);
				R = P + 2 | 0;
				y = f + 2 | 0;
				u = b;
				b = (b >>> 1) - (b >> 16 << 15) | 0;
				k = f + 4 | 0;
				F = P + 4 | 0;
				M = 2;
				g = 2;
				while(1) {
					_ = u >>> 16;
					l = _ & 65535;
					S = b & 65535;
					p = g + -1 | 0;
					h = C + (p << 1) | 0;
					v = I + (p << 1) | 0;
					m = 1;
					w = h;
					E = v;
					d = A;
					f = N;
					u = 0;
					while(1) {
						L = i[d >> 1] | 0;
						U = ((ee(i[E >> 1] | 0, L) | 0) >> 15) + u | 0;
						u = i[w >> 1] | 0;
						u = U + (ee(u, L) | 0) + ((ee(u, i[f >> 1] | 0) | 0) >> 15) | 0;
						m = m + 1 << 16 >> 16;
						if((m << 16 >> 16 | 0) >= (g | 0)) break;
						else {
							w = w + -2 | 0;
							E = E + -2 | 0;
							d = d + 2 | 0;
							f = f + 2 | 0
						}
					}
					U = (s[r + (g << 1) >> 1] << 16) + (u << 5) + (i[n + (g << 1) >> 1] << 1) | 0;
					u = dn(Bn(U) | 0, l, S, a) | 0;
					if((U | 0) > 0) u = Vn(u) | 0;
					f = O << 16 >> 16;
					if(O << 16 >> 16 > 0) {
						l = u << f;
						if((l >> f | 0) != (u | 0)) l = u >> 31 ^ 2147483647
					} else {
						f = 0 - f << 16;
						if((f | 0) < 2031616) l = u >> (f >> 16);
						else l = 0
					}
					m = l >> 16;
					if((g | 0) < 5) i[o + (p << 1) >> 1] = (l + 32768 | 0) >>> 16;
					U = (l >>> 16) - (l >>> 31) | 0;
					if(((U << 16 >> 31 ^ U) & 65535) << 16 >> 16 > 32750) {
						l = 16;
						break
					}
					E = (l >>> 1) - (m << 15) << 16 >> 16;
					w = 1;
					u = v;
					f = R;
					d = y;
					while(1) {
						L = (ee(i[u >> 1] | 0, m) | 0) >> 15;
						v = i[h >> 1] | 0;
						U = (ee(v, E) | 0) >> 15;
						v = ee(v, m) | 0;
						U = v + L + (i[I + (w << 1) >> 1] | 0) + (i[C + (w << 1) >> 1] << 15) + U | 0;
						i[f >> 1] = U >>> 15;
						i[d >> 1] = U & 32767;
						w = w + 1 | 0;
						if((w & 65535) << 16 >> 16 == M << 16 >> 16) break;
						else {
							h = h + -2 | 0;
							u = u + -2 | 0;
							f = f + 2 | 0;
							d = d + 2 | 0
						}
					}
					i[F >> 1] = l >> 20;
					i[k >> 1] = (l >>> 5) - (i[P + (g << 1) >> 1] << 15);
					L = ee(m, m) | 0;
					L = (L | 0) == 1073741824 ? 2147483647 : L << 1;
					l = (ee(E, m) | 0) >> 15;
					U = l << 1;
					f = U + L | 0;
					f = (l ^ L | 0) > 0 & (f ^ L | 0) < 0 ? (L >>> 31) + 2147483647 | 0 : f;
					U = f + U | 0;
					U = 2147483647 - (Bn((f ^ l | 0) > 0 & (U ^ f | 0) < 0 ? (f >>> 31) + 2147483647 | 0 : U) | 0) | 0;
					f = U >> 16;
					l = _ << 16 >> 16;
					l = ((ee(f, b << 16 >> 16) | 0) >> 15) + (ee(f, l) | 0) + ((ee((U >>> 1) - (f << 15) << 16 >> 16, l) | 0) >> 15) << 1;
					f = (vi(l) | 0) << 16 >> 16;
					l = l << f;
					U = g << 1;
					Vi(T | 0, R | 0, U | 0) | 0;
					Vi(D | 0, y | 0, U | 0) | 0;
					g = g + 1 | 0;
					if((g | 0) >= 11) {
						l = 20;
						break
					} else {
						O = f + (O & 65535) & 65535;
						u = l;
						b = (l >> 1) - (l >> 16 << 15) | 0;
						k = k + 2 | 0;
						F = F + 2 | 0;
						M = M + 1 << 16 >> 16
					}
				}
				if((l | 0) == 16) {
					l = t + 22 | 0;
					do {
						i[t >> 1] = i[e >> 1] | 0;
						t = t + 2 | 0;
						e = e + 2 | 0
					} while ((t | 0) < (l | 0));
					U = o;
					L = U;
					i[L >> 1] = 0;
					i[L + 2 >> 1] = 0 >>> 16;
					U = U + 4 | 0;
					i[U >> 1] = 0;
					i[U + 2 >> 1] = 0 >>> 16;
					c = B;
					return 0
				} else if((l | 0) == 20) {
					i[t >> 1] = 4096;
					U = ((i[D >> 1] | 0) + 8192 + (i[T >> 1] << 15) | 0) >>> 14 & 65535;
					i[t + 2 >> 1] = U;
					i[e + 2 >> 1] = U;
					U = ((i[I + 4 >> 1] | 0) + 8192 + (i[C + 4 >> 1] << 15) | 0) >>> 14 & 65535;
					i[t + 4 >> 1] = U;
					i[e + 4 >> 1] = U;
					U = ((i[I + 6 >> 1] | 0) + 8192 + (i[C + 6 >> 1] << 15) | 0) >>> 14 & 65535;
					i[t + 6 >> 1] = U;
					i[e + 6 >> 1] = U;
					U = ((i[I + 8 >> 1] | 0) + 8192 + (i[C + 8 >> 1] << 15) | 0) >>> 14 & 65535;
					i[t + 8 >> 1] = U;
					i[e + 8 >> 1] = U;
					U = ((i[I + 10 >> 1] | 0) + 8192 + (i[C + 10 >> 1] << 15) | 0) >>> 14 & 65535;
					i[t + 10 >> 1] = U;
					i[e + 10 >> 1] = U;
					U = ((i[I + 12 >> 1] | 0) + 8192 + (i[C + 12 >> 1] << 15) | 0) >>> 14 & 65535;
					i[t + 12 >> 1] = U;
					i[e + 12 >> 1] = U;
					U = ((i[I + 14 >> 1] | 0) + 8192 + (i[C + 14 >> 1] << 15) | 0) >>> 14 & 65535;
					i[t + 14 >> 1] = U;
					i[e + 14 >> 1] = U;
					U = ((i[I + 16 >> 1] | 0) + 8192 + (i[C + 16 >> 1] << 15) | 0) >>> 14 & 65535;
					i[t + 16 >> 1] = U;
					i[e + 16 >> 1] = U;
					U = ((i[I + 18 >> 1] | 0) + 8192 + (i[C + 18 >> 1] << 15) | 0) >>> 14 & 65535;
					i[t + 18 >> 1] = U;
					i[e + 18 >> 1] = U;
					U = ((i[I + 20 >> 1] | 0) + 8192 + (i[C + 20 >> 1] << 15) | 0) >>> 14 & 65535;
					i[t + 20 >> 1] = U;
					i[e + 20 >> 1] = U;
					c = B;
					return 0
				}
				return 0
			}

			function Yn(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				t = e >> 16;
				i[r >> 1] = t;
				i[n >> 1] = (e >>> 1) - (t << 15);
				return
			}

			function Vn(e) {
				e = e | 0;
				return((e | 0) == -2147483648 ? 2147483647 : 0 - e | 0) | 0
			}

			function qn(e) {
				e = e | 0;
				var r = 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				o[e >> 2] = 0;
				r = xi(4) | 0;
				if(!r) {
					e = -1;
					return e | 0
				}
				o[r >> 2] = 0;
				if(!((xn(r) | 0) << 16 >> 16)) {
					Hn(o[r >> 2] | 0) | 0;
					o[e >> 2] = r;
					e = 0;
					return e | 0
				} else {
					zn(r);
					Hi(r);
					e = -1;
					return e | 0
				}
				return 0
			}

			function Kn(e) {
				e = e | 0;
				var r = 0;
				if(!e) return;
				r = o[e >> 2] | 0;
				if(!r) return;
				zn(r);
				Hi(o[e >> 2] | 0);
				o[e >> 2] = 0;
				return
			}

			function Wn(e) {
				e = e | 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				Hn(o[e >> 2] | 0) | 0;
				e = 0;
				return e | 0
			}

			function Xn(e, r, n, t, i, a, s) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				i = i | 0;
				a = a | 0;
				s = s | 0;
				var l = 0,
					f = 0,
					u = 0,
					d = 0;
				d = c;
				c = c + 64 | 0;
				u = d + 48 | 0;
				f = d + 22 | 0;
				l = d;
				if((r | 0) == 7) {
					n = o[a + 116 >> 2] | 0;
					xr(t, 10, l, f, o[a + 112 >> 2] | 0, s) | 0;
					Ln(10, l, f, s);
					jn(o[e >> 2] | 0, l, f, i + 22 | 0, u, s) | 0;
					xr(t, 10, l, f, n, s) | 0;
					Ln(10, l, f, s);
					jn(o[e >> 2] | 0, l, f, i + 66 | 0, u, s) | 0;
					c = d;
					return
				} else {
					xr(n, 10, l, f, o[a + 108 >> 2] | 0, s) | 0;
					Ln(10, l, f, s);
					jn(o[e >> 2] | 0, l, f, i + 66 | 0, u, s) | 0;
					c = d;
					return
				}
			}

			function Gn(e, r, n, t, o, a, s, l, f, u) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				if((n | 0) == 6) {
					i[o >> 1] = ot(e, r, t, 20, 143, 80, a, s, l, f, u) | 0;
					return
				}
				i[s >> 1] = 0;
				i[s + 2 >> 1] = 0;
				if(n >>> 0 < 2) {
					i[o >> 1] = et(r, n, t, 20, 143, 160, l, f, u) | 0;
					return
				}
				if(n >>> 0 < 6) {
					i[o >> 1] = et(r, n, t, 20, 143, 80, l, f, u) | 0;
					return
				} else {
					i[o >> 1] = et(r, n, t, 18, 143, 80, l, f, u) | 0;
					return
				}
			}

			function Jn(e) {
				e = e | 0;
				var r = 0;
				if((e | 0) != 0 ? (o[e >> 2] = 0, r = xi(2) | 0, (r | 0) != 0) : 0) {
					i[r >> 1] = 0;
					o[e >> 2] = r;
					r = 0
				} else r = -1;
				return r | 0
			}

			function Zn(e) {
				e = e | 0;
				if(!e) e = -1;
				else {
					i[e >> 1] = 0;
					e = 0
				}
				return e | 0
			}

			function Qn(e) {
				e = e | 0;
				var r = 0;
				if(!e) return;
				r = o[e >> 2] | 0;
				if(!r) return;
				Hi(r);
				o[e >> 2] = 0;
				return
			}

			function $n(e, r, n, t, o, a, l, f, u, d, h, E) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				d = d | 0;
				h = h | 0;
				E = E | 0;
				var w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0,
					C = 0,
					I = 0,
					B = 0,
					L = 0,
					U = 0,
					x = 0,
					H = 0,
					z = 0,
					j = 0,
					Y = 0,
					V = 0,
					q = 0,
					K = 0;
				K = c;
				c = c + 240 | 0;
				_ = K + 160 | 0;
				b = K + 80 | 0;
				H = K;
				x = i[3558 + (r * 18 | 0) >> 1] | 0;
				q = i[3558 + (r * 18 | 0) + 2 >> 1] | 0;
				w = i[3558 + (r * 18 | 0) + 4 >> 1] | 0;
				z = i[3558 + (r * 18 | 0) + 6 >> 1] | 0;
				p = i[3558 + (r * 18 | 0) + 12 >> 1] | 0;
				S = i[3558 + (r * 18 | 0) + 14 >> 1] | 0;
				m = i[3558 + (r * 18 | 0) + 16 >> 1] | 0;
				e: do switch(f << 16 >> 16) {
						case 0:
						case 80:
							if(r >>> 0 < 2 & f << 16 >> 16 == 80) {
								j = (s[e >> 1] | 0) - (p & 65535) | 0;
								j = (j << 16 >> 16 | 0) < (m << 16 >> 16 | 0) ? m : j & 65535;
								U = S << 16 >> 16;
								Y = (j & 65535) + U & 65535;
								V = Y << 16 >> 16 > 143;
								j = V ? 143 - U & 65535 : j;
								Y = V ? 143 : Y;
								V = 1;
								break e
							} else {
								j = (s[n + ((f << 16 >> 16 != 0 & 1) << 1) >> 1] | 0) - (s[3558 + (r * 18 | 0) + 8 >> 1] | 0) | 0;
								j = (j << 16 >> 16 | 0) < (m << 16 >> 16 | 0) ? m : j & 65535;
								U = i[3558 + (r * 18 | 0) + 10 >> 1] | 0;
								Y = (j & 65535) + U & 65535;
								V = Y << 16 >> 16 > 143;
								j = V ? 143 - U & 65535 : j;
								Y = V ? 143 : Y;
								V = 0;
								break e
							}
						default:
							{
								j = (s[e >> 1] | 0) - (p & 65535) | 0;j = (j << 16 >> 16 | 0) < (m << 16 >> 16 | 0) ? m : j & 65535;U = S << 16 >> 16;Y = (j & 65535) + U & 65535;V = Y << 16 >> 16 > 143;j = V ? 143 - U & 65535 : j;Y = V ? 143 : Y;V = 1
							}
					}
					while(0);
					L = j & 65535;
				f = L + 65532 | 0;
				v = f & 65535;
				B = (Y & 65535) + 4 & 65535;
				U = f << 16 >> 16;
				f = 0 - (f & 65535) | 0;
				p = f & 65535;
				ln(t + (f << 16 >> 16 << 1) | 0, a, _, l);
				f = l << 16 >> 16;
				y = f >>> 1 & 65535;
				k = y << 16 >> 16 == 0;
				if(k) l = 1;
				else {
					l = y;
					m = _;
					n = b;
					S = 0;
					while(1) {
						I = i[m >> 1] | 0;
						i[n >> 1] = I >>> 2;
						I = (ee(I, I) | 0) + S | 0;
						S = i[m + 2 >> 1] | 0;
						i[n + 2 >> 1] = S >>> 2;
						S = I + (ee(S, S) | 0) | 0;
						l = l + -1 << 16 >> 16;
						if(!(l << 16 >> 16)) break;
						else {
							m = m + 4 | 0;
							n = n + 4 | 0
						}
					}
					l = (S | 0) < 33554433
				}
				I = l ? 0 : 2;
				R = l ? _ : b;
				F = l ? _ : b;
				e: do
					if(v << 16 >> 16 <= B << 16 >> 16) {
						M = f + -1 | 0;
						N = R + (M << 1) | 0;
						P = a + (M << 1) | 0;
						C = R + (f + -2 << 1) | 0;
						A = M >>> 1;
						T = A & 65535;
						g = T << 16 >> 16 == 0;
						D = l ? 12 : 14;
						A = (A << 1) + 131070 & 131070;
						n = f + -3 - A | 0;
						O = R + (n << 1) | 0;
						A = R + (f + -4 - A << 1) | 0;
						a = a + (n << 1) | 0;
						if(!k) {
							k = U;
							while(1) {
								b = y;
								_ = F;
								m = o;
								S = 0;
								l = 0;
								while(1) {
									b = b + -1 << 16 >> 16;
									f = i[_ >> 1] | 0;
									S = (ee(f, i[m >> 1] | 0) | 0) + S | 0;
									f = (ee(f, f) | 0) + l | 0;
									l = i[_ + 2 >> 1] | 0;
									S = S + (ee(l, i[m + 2 >> 1] | 0) | 0) | 0;
									l = f + (ee(l, l) | 0) | 0;
									if(!(b << 16 >> 16)) break;
									else {
										_ = _ + 4 | 0;
										m = m + 4 | 0
									}
								}
								_ = ai(l << 1, E) | 0;
								l = _ >> 16;
								m = S << 1 >> 16;
								b = ee(l, m) | 0;
								b = (b | 0) == 1073741824 ? 2147483647 : b << 1;
								m = (ee((_ >>> 1) - (l << 15) << 16 >> 16, m) | 0) >> 15;
								_ = (m << 1) + b | 0;
								_ = (m ^ b | 0) > 0 & (_ ^ b | 0) < 0 ? (b >>> 31) + 2147483647 | 0 : _;
								l = (ee(l, S & 32767) | 0) >> 15;
								b = _ + (l << 1) | 0;
								i[H + (k - U << 1) >> 1] = (_ ^ l | 0) > 0 & (b ^ _ | 0) < 0 ? (_ >>> 31) + 65535 | 0 : b;
								if(v << 16 >> 16 != B << 16 >> 16) {
									p = p + -1 << 16 >> 16;
									b = i[t + (p << 16 >> 16 << 1) >> 1] | 0;
									if(g) {
										_ = M;
										l = C;
										S = P;
										m = N
									} else {
										_ = T;
										l = C;
										S = P;
										m = N;
										while(1) {
											k = (ee(i[S >> 1] | 0, b) | 0) >> D;
											i[m >> 1] = k + (s[l >> 1] | 0);
											k = (ee(i[S + -2 >> 1] | 0, b) | 0) >> D;
											i[m + -2 >> 1] = k + (s[l + -2 >> 1] | 0);
											_ = _ + -1 << 16 >> 16;
											if(!(_ << 16 >> 16)) {
												_ = n;
												l = A;
												S = a;
												m = O;
												break
											} else {
												l = l + -4 | 0;
												S = S + -4 | 0;
												m = m + -4 | 0
											}
										}
									}
									k = (ee(i[S >> 1] | 0, b) | 0) >> D;
									i[m >> 1] = k + (s[l >> 1] | 0);
									i[R + (_ + -1 << 1) >> 1] = b >> I
								}
								v = v + 1 << 16 >> 16;
								if(v << 16 >> 16 > B << 16 >> 16) break e;
								else k = v << 16 >> 16
							}
						}
						if(g) {
							l = R + (f + -2 << 1) | 0;
							S = U;
							while(1) {
								ai(0, E) | 0;
								i[H + (S - U << 1) >> 1] = 0;
								if(v << 16 >> 16 != B << 16 >> 16) {
									p = p + -1 << 16 >> 16;
									o = i[t + (p << 16 >> 16 << 1) >> 1] | 0;
									T = (ee(i[P >> 1] | 0, o) | 0) >> D;
									i[N >> 1] = T + (s[C >> 1] | 0);
									i[l >> 1] = o >> I
								}
								v = v + 1 << 16 >> 16;
								if(v << 16 >> 16 > B << 16 >> 16) break e;
								else S = v << 16 >> 16
							}
						}
						_ = R + (n + -1 << 1) | 0;
						l = U;
						while(1) {
							ai(0, E) | 0;
							i[H + (l - U << 1) >> 1] = 0;
							if(v << 16 >> 16 != B << 16 >> 16) {
								p = p + -1 << 16 >> 16;
								l = i[t + (p << 16 >> 16 << 1) >> 1] | 0;
								S = T;
								m = C;
								n = P;
								f = N;
								while(1) {
									o = (ee(i[n >> 1] | 0, l) | 0) >> D;
									i[f >> 1] = o + (s[m >> 1] | 0);
									o = (ee(i[n + -2 >> 1] | 0, l) | 0) >> D;
									i[f + -2 >> 1] = o + (s[m + -2 >> 1] | 0);
									S = S + -1 << 16 >> 16;
									if(!(S << 16 >> 16)) break;
									else {
										m = m + -4 | 0;
										n = n + -4 | 0;
										f = f + -4 | 0
									}
								}
								o = (ee(i[a >> 1] | 0, l) | 0) >> D;
								i[O >> 1] = o + (s[A >> 1] | 0);
								i[_ >> 1] = l >> I
							}
							v = v + 1 << 16 >> 16;
							if(v << 16 >> 16 > B << 16 >> 16) break;
							else l = v << 16 >> 16
						}
					}
				while(0);
				v = j << 16 >> 16;
				n = L + 1 & 65535;
				if(n << 16 >> 16 > Y << 16 >> 16) a = j;
				else {
					p = j;
					f = i[H + (v - U << 1) >> 1] | 0;
					while(1) {
						S = i[H + ((n << 16 >> 16) - U << 1) >> 1] | 0;
						m = S << 16 >> 16 < f << 16 >> 16;
						p = m ? p : n;
						n = n + 1 << 16 >> 16;
						if(n << 16 >> 16 > Y << 16 >> 16) {
							a = p;
							break
						} else f = m ? f : S
					}
				}
				e: do
					if(!(V << 16 >> 16 == 0 ? a << 16 >> 16 > x << 16 >> 16 : 0)) {
						if(!(r >>> 0 < 4 & V << 16 >> 16 != 0)) {
							p = H + ((a << 16 >> 16) - U << 1) | 0;
							S = In(p, w, q, E) | 0;
							n = (w & 65535) + 1 & 65535;
							if(n << 16 >> 16 <= z << 16 >> 16)
								while(1) {
									m = In(p, n, q, E) | 0;
									f = m << 16 >> 16 > S << 16 >> 16;
									w = f ? n : w;
									n = n + 1 << 16 >> 16;
									if(n << 16 >> 16 > z << 16 >> 16) break;
									else S = f ? m : S
								}
							if((r + -7 | 0) >>> 0 < 2) {
								z = w << 16 >> 16 == -3;
								n = (z << 31 >> 31) + a << 16 >> 16;
								w = z ? 3 : w;
								break
							}
							switch(w << 16 >> 16) {
								case -2:
									{
										n = a + -1 << 16 >> 16;w = 1;
										break e
									}
								case 2:
									{
										n = a + 1 << 16 >> 16;w = -1;
										break e
									}
								default:
									{
										n = a;
										break e
									}
							}
						}
						x = i[e >> 1] | 0;
						x = ((x << 16 >> 16) - v | 0) > 5 ? v + 5 & 65535 : x;
						f = Y << 16 >> 16;
						x = (f - (x << 16 >> 16) | 0) > 4 ? f + 65532 & 65535 : x;
						f = a << 16 >> 16;
						n = x << 16 >> 16;
						if((f | 0) == (n + -1 | 0) ? 1 : a << 16 >> 16 == x << 16 >> 16) {
							p = H + (f - U << 1) | 0;
							f = In(p, w, q, E) | 0;
							n = (w & 65535) + 1 & 65535;
							if(n << 16 >> 16 <= z << 16 >> 16)
								while(1) {
									S = In(p, n, q, E) | 0;
									m = S << 16 >> 16 > f << 16 >> 16;
									w = m ? n : w;
									n = n + 1 << 16 >> 16;
									if(n << 16 >> 16 > z << 16 >> 16) break;
									else f = m ? S : f
								}
							if((r + -7 | 0) >>> 0 < 2) {
								z = w << 16 >> 16 == -3;
								n = (z << 31 >> 31) + a << 16 >> 16;
								w = z ? 3 : w;
								break
							}
							switch(w << 16 >> 16) {
								case -2:
									{
										n = a + -1 << 16 >> 16;w = 1;
										break e
									}
								case 2:
									{
										n = a + 1 << 16 >> 16;w = -1;
										break e
									}
								default:
									{
										n = a;
										break e
									}
							}
						}
						if((f | 0) == (n + -2 | 0)) {
							n = H + (f - U << 1) | 0;
							f = In(n, 0, q, E) | 0;
							if((r | 0) != 8) {
								w = 0;
								p = 1;
								while(1) {
									S = In(n, p, q, E) | 0;
									m = S << 16 >> 16 > f << 16 >> 16;
									w = m ? p : w;
									p = p + 1 << 16 >> 16;
									if(p << 16 >> 16 > z << 16 >> 16) break;
									else f = m ? S : f
								}
								if((r + -7 | 0) >>> 0 >= 2) switch(w << 16 >> 16) {
									case -2:
										{
											n = a + -1 << 16 >> 16;w = 1;
											break e
										}
									case 2:
										{
											n = a + 1 << 16 >> 16;w = -1;
											break e
										}
									default:
										{
											n = a;
											break e
										}
								}
							} else w = 0;
							z = w << 16 >> 16 == -3;
							n = (z << 31 >> 31) + a << 16 >> 16;
							w = z ? 3 : w;
							break
						}
						if((f | 0) == (n + 1 | 0)) {
							p = H + (f - U << 1) | 0;
							n = In(p, w, q, E) | 0;
							f = (w & 65535) + 1 & 65535;
							if(f << 16 >> 16 <= 0)
								while(1) {
									m = In(p, f, q, E) | 0;
									S = m << 16 >> 16 > n << 16 >> 16;
									w = S ? f : w;
									f = f + 1 << 16 >> 16;
									if(f << 16 >> 16 > 0) break;
									else n = S ? m : n
								}
							if((r + -7 | 0) >>> 0 < 2) {
								z = w << 16 >> 16 == -3;
								n = (z << 31 >> 31) + a << 16 >> 16;
								w = z ? 3 : w;
								break
							}
							switch(w << 16 >> 16) {
								case -2:
									{
										n = a + -1 << 16 >> 16;w = 1;
										break e
									}
								case 2:
									{
										n = a + 1 << 16 >> 16;w = -1;
										break e
									}
								default:
									{
										n = a;
										break e
									}
							}
						} else {
							n = a;
							w = 0
						}
					} else {
						n = a;
						w = 0
					}
				while(0);
				if((r + -7 | 0) >>> 0 > 1) {
					z = e;
					e = vn(n, w, i[e >> 1] | 0, j, Y, V, r >>> 0 < 4 & 1, E) | 0;
					i[h >> 1] = e;
					i[z >> 1] = n;
					i[d >> 1] = q;
					i[u >> 1] = w;
					c = K;
					return n | 0
				} else {
					E = _n(n, w, j, V, E) | 0;
					i[h >> 1] = E;
					i[e >> 1] = n;
					i[d >> 1] = q;
					i[u >> 1] = w;
					c = K;
					return n | 0
				}
				return 0
			}

			function et(e, r, n, t, a, s, l, f, u) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				var d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0;
				A = c;
				c = c + 1200 | 0;
				y = A + 1188 | 0;
				R = A + 580 | 0;
				O = A + 578 | 0;
				g = A + 576 | 0;
				b = A;
				F = A + 582 | 0;
				M = (f | 0) != 0;
				do
					if(M)
						if(r >>> 0 < 2) {
							zt(e, 1, u);
							break
						} else {
							zt(e, 0, u);
							break
						}
				while(0);
				k = a << 16 >> 16;
				E = 0 - k | 0;
				h = n + (E << 1) | 0;
				E = E & 65535;
				p = s << 16 >> 16;
				do
					if(E << 16 >> 16 < s << 16 >> 16) {
						S = E;
						m = h;
						E = 0;
						while(1) {
							v = i[m >> 1] | 0;
							E = (ee(v << 1, v) | 0) + E | 0;
							if((E | 0) < 0) break;
							S = S + 1 << 16 >> 16;
							if(S << 16 >> 16 >= s << 16 >> 16) {
								_ = 14;
								break
							} else m = m + 2 | 0
						}
						if((_ | 0) == 14) {
							if((E | 0) < 1048576) {
								_ = 15;
								break
							}
							Vi(F | 0, h | 0, p + k << 1 | 0) | 0;
							v = 0;
							break
						}
						d = p + k | 0;
						w = d >>> 1;
						S = w & 65535;
						if(!(S << 16 >> 16)) E = F;
						else {
							v = ((w << 1) + 131070 & 131070) + 2 | 0;
							p = v - k | 0;
							m = F;
							while(1) {
								i[m >> 1] = (i[h >> 1] | 0) >>> 3;
								i[m + 2 >> 1] = (i[h + 2 >> 1] | 0) >>> 3;
								S = S + -1 << 16 >> 16;
								if(!(S << 16 >> 16)) break;
								else {
									h = h + 4 | 0;
									m = m + 4 | 0
								}
							}
							h = n + (p << 1) | 0;
							E = F + (v << 1) | 0
						}
						if(!(d & 1)) v = 3;
						else {
							i[E >> 1] = (i[h >> 1] | 0) >>> 3;
							v = 3
						}
					} else _ = 15;
				while(0);
				if((_ | 0) == 15) {
					v = p + k | 0;
					E = v >>> 1;
					w = E & 65535;
					if(!(w << 16 >> 16)) E = F;
					else {
						p = ((E << 1) + 131070 & 131070) + 2 | 0;
						m = p - k | 0;
						S = F;
						while(1) {
							i[S >> 1] = i[h >> 1] << 3;
							i[S + 2 >> 1] = i[h + 2 >> 1] << 3;
							w = w + -1 << 16 >> 16;
							if(!(w << 16 >> 16)) break;
							else {
								h = h + 4 | 0;
								S = S + 4 | 0
							}
						}
						h = n + (m << 1) | 0;
						E = F + (p << 1) | 0
					}
					if(!(v & 1)) v = -3;
					else {
						i[E >> 1] = i[h >> 1] << 3;
						v = -3
					}
				}
				p = b + (k << 2) | 0;
				m = F + (k << 1) | 0;
				Xr(m, s, a, t, p);
				d = (r | 0) == 7 & 1;
				E = t << 16 >> 16;
				h = E << 2;
				if((h | 0) != (E << 18 >> 16 | 0)) {
					o[u >> 2] = 1;
					h = t << 16 >> 16 > 0 ? 32767 : -32768
				}
				S = rt(e, p, m, v, d, s, a, h & 65535, y, f, u) | 0;
				E = E << 1;
				w = rt(e, p, m, v, d, s, h + 65535 & 65535, E & 65535, R, f, u) | 0;
				E = rt(e, p, m, v, d, s, E + 65535 & 65535, t, O, f, u) | 0;
				if(l << 16 >> 16 == 1 & M) {
					Cn(p, m, s, a, t, g, u) | 0;
					xt(e, i[g >> 1] | 0)
				}
				h = i[y >> 1] | 0;
				d = i[R >> 1] | 0;
				if(((h << 16 >> 16) * 55706 >> 16 | 0) >= (d << 16 >> 16 | 0)) {
					R = h;
					y = S;
					R = R << 16 >> 16;
					R = R * 55706 | 0;
					R = R >> 16;
					O = i[O >> 1] | 0;
					O = O << 16 >> 16;
					O = (R | 0) < (O | 0);
					O = O ? E : y;
					c = A;
					return O | 0
				}
				i[y >> 1] = d;
				R = d;
				y = w;
				R = R << 16 >> 16;
				R = R * 55706 | 0;
				R = R >> 16;
				O = i[O >> 1] | 0;
				O = O << 16 >> 16;
				O = (R | 0) < (O | 0);
				O = O ? E : y;
				c = A;
				return O | 0
			}

			function rt(e, r, n, t, a, s, l, f, u, c, d) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				c = c | 0;
				d = d | 0;
				var h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0;
				if(l << 16 >> 16 < f << 16 >> 16) {
					f = -2147483648;
					w = l
				} else {
					w = l;
					h = -2147483648;
					E = r + (0 - (l << 16 >> 16) << 2) | 0;
					r = l;
					while(1) {
						l = o[E >> 2] | 0;
						S = (l | 0) < (h | 0);
						r = S ? r : w;
						h = S ? h : l;
						w = w + -1 << 16 >> 16;
						if(w << 16 >> 16 < f << 16 >> 16) {
							f = h;
							w = r;
							break
						} else E = E + 4 | 0
					}
				}
				r = s << 16 >> 16 >>> 2 & 65535;
				if(!(r << 16 >> 16)) r = 0;
				else {
					h = r;
					l = n + (0 - (w << 16 >> 16) << 1) | 0;
					r = 0;
					while(1) {
						S = i[l >> 1] | 0;
						S = (ee(S, S) | 0) + r | 0;
						r = i[l + 2 >> 1] | 0;
						r = S + (ee(r, r) | 0) | 0;
						S = i[l + 4 >> 1] | 0;
						S = r + (ee(S, S) | 0) | 0;
						r = i[l + 6 >> 1] | 0;
						r = S + (ee(r, r) | 0) | 0;
						h = h + -1 << 16 >> 16;
						if(!(h << 16 >> 16)) break;
						else l = l + 8 | 0
					}
					r = r << 1
				}
				if(c) Ht(e, f, r, d);
				r = ai(r, d) | 0;
				l = a << 16 >> 16 != 0;
				if(l) r = (r | 0) > 1073741823 ? 2147483647 : r << 1;
				a = f >> 16;
				e = r >> 16;
				d = ee(e, a) | 0;
				d = (d | 0) == 1073741824 ? 2147483647 : d << 1;
				r = (ee((r >>> 1) - (e << 15) << 16 >> 16, a) | 0) >> 15;
				S = (r << 1) + d | 0;
				S = (r ^ d | 0) > 0 & (S ^ d | 0) < 0 ? (d >>> 31) + 2147483647 | 0 : S;
				a = (ee(e, (f >>> 1) - (a << 15) << 16 >> 16) | 0) >> 15;
				r = S + (a << 1) | 0;
				r = (S ^ a | 0) > 0 & (r ^ S | 0) < 0 ? (S >>> 31) + 2147483647 | 0 : r;
				if(!l) {
					i[u >> 1] = r;
					return w | 0
				}
				l = t << 16 >> 16;
				if(t << 16 >> 16 > 0)
					if(t << 16 >> 16 < 31) {
						l = r >> l;
						m = 16
					} else l = 0;
				else {
					m = 0 - l << 16 >> 16;
					l = r << m;
					l = (l >> m | 0) == (r | 0) ? l : r >> 31 ^ 2147483647;
					m = 16
				}
				if((m | 0) == 16) {
					if((l | 0) > 65535) {
						i[u >> 1] = 32767;
						return w | 0
					}
					if((l | 0) < -65536) {
						i[u >> 1] = -32768;
						return w | 0
					}
				}
				i[u >> 1] = l >>> 1;
				return w | 0
			}

			function nt(e) {
				e = e | 0;
				var r = 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				o[e >> 2] = 0;
				r = xi(6) | 0;
				if(!r) {
					e = -1;
					return e | 0
				}
				i[r >> 1] = 40;
				i[r + 2 >> 1] = 0;
				i[r + 4 >> 1] = 0;
				o[e >> 2] = r;
				e = 0;
				return e | 0
			}

			function tt(e) {
				e = e | 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				i[e >> 1] = 40;
				i[e + 2 >> 1] = 0;
				i[e + 4 >> 1] = 0;
				e = 0;
				return e | 0
			}

			function it(e) {
				e = e | 0;
				var r = 0;
				if(!e) return;
				r = o[e >> 2] | 0;
				if(!r) return;
				Hi(r);
				o[e >> 2] = 0;
				return
			}

			function ot(e, r, n, t, a, s, l, f, u, d, h) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				d = d | 0;
				h = h | 0;
				var E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0;
				D = c;
				c = c + 1200 | 0;
				k = D + 1186 | 0;
				F = D + 1184 | 0;
				T = D + 1182 | 0;
				b = D;
				g = D + 576 | 0;
				M = a << 16 >> 16;
				A = g + (M << 1) | 0;
				E = (0 - M & 65535) << 16 >> 16 < s << 16 >> 16;
				if(E) {
					p = 0 - a << 16 >> 16 << 16 >> 16;
					w = 0;
					do {
						S = i[n + (p << 1) >> 1] | 0;
						S = ee(S, S) | 0;
						if((S | 0) != 1073741824) {
							m = (S << 1) + w | 0;
							if((S ^ w | 0) > 0 & (m ^ w | 0) < 0) {
								o[h >> 2] = 1;
								w = (w >>> 31) + 2147483647 | 0
							} else w = m
						} else {
							o[h >> 2] = 1;
							w = 2147483647
						}
						p = p + 1 | 0
					} while ((p & 65535) << 16 >> 16 != s << 16 >> 16)
				} else w = 0;
				if((2147483646 - w & w | 0) >= 0)
					if((w | 0) == 2147483647) {
						if(E) {
							w = 0 - a << 16 >> 16 << 16 >> 16;
							do {
								i[g + (w + M << 1) >> 1] = Pi(i[n + (w << 1) >> 1] | 0, 3, h) | 0;
								w = w + 1 | 0
							} while ((w & 65535) << 16 >> 16 != s << 16 >> 16)
						}
					} else v = 14;
				else {
					o[h >> 2] = 1;
					v = 14
				}
				do
					if((v | 0) == 14) {
						if((1048575 - w & w | 0) < 0) {
							o[h >> 2] = 1;
							w = (w >>> 31) + 2147483647 | 0
						} else w = w + -1048576 | 0;
						if((w | 0) >= 0) {
							if(!E) break;
							O = 0 - a << 16 >> 16 << 16 >> 16;
							Vi(g + (M + O << 1) | 0, n + (O << 1) | 0, (((s + a << 16 >> 16) + -1 & 65535) << 1) + 2 | 0) | 0;
							break
						}
						if(E) {
							w = 0 - a << 16 >> 16 << 16 >> 16;
							do {
								O = i[n + (w << 1) >> 1] | 0;
								i[g + (w + M << 1) >> 1] = (O << 19 >> 19 | 0) == (O | 0) ? O << 3 : O >>> 15 ^ 32767;
								w = w + 1 | 0
							} while ((w & 65535) << 16 >> 16 != s << 16 >> 16)
						}
					}
				while(0);
				y = b + (M << 2) | 0;
				Xr(A, s, a, t, y);
				p = i[e >> 1] | 0;
				O = e + 4 | 0;
				R = f + (u << 16 >> 16 << 1) | 0;
				e: do
					if(a << 16 >> 16 < t << 16 >> 16) _ = a;
					else {
						if((i[O >> 1] | 0) <= 0) {
							n = a;
							f = -2147483648;
							S = a;
							v = 3402;
							while(1) {
								Yn(o[b + (M - (n << 16 >> 16) << 2) >> 2] | 0, k, F, h);
								m = i[F >> 1] | 0;
								w = i[v >> 1] | 0;
								p = ee(w, i[k >> 1] | 0) | 0;
								if((p | 0) == 1073741824) {
									o[h >> 2] = 1;
									E = 2147483647
								} else E = p << 1;
								_ = (ee(w, m << 16 >> 16) | 0) >> 15;
								p = E + (_ << 1) | 0;
								if((E ^ _ | 0) > 0 & (p ^ E | 0) < 0) {
									o[h >> 2] = 1;
									p = (E >>> 31) + 2147483647 | 0
								}
								m = (p | 0) < (f | 0);
								S = m ? S : n;
								n = n + -1 << 16 >> 16;
								if(n << 16 >> 16 < t << 16 >> 16) {
									_ = S;
									break e
								} else {
									f = m ? f : p;
									v = v + -2 | 0
								}
							}
						}
						f = a;
						E = -2147483648;
						S = a;
						_ = 2902 + (M + 123 - (p << 16 >> 16) << 1) | 0;
						n = 3402;
						while(1) {
							Yn(o[b + (M - (f << 16 >> 16) << 2) >> 2] | 0, k, F, h);
							v = i[F >> 1] | 0;
							m = i[n >> 1] | 0;
							p = ee(m, i[k >> 1] | 0) | 0;
							if((p | 0) == 1073741824) {
								o[h >> 2] = 1;
								w = 2147483647
							} else w = p << 1;
							v = (ee(m, v << 16 >> 16) | 0) >> 15;
							p = w + (v << 1) | 0;
							if((w ^ v | 0) > 0 & (p ^ w | 0) < 0) {
								o[h >> 2] = 1;
								p = (w >>> 31) + 2147483647 | 0
							}
							Yn(p, k, F, h);
							v = i[F >> 1] | 0;
							m = i[_ >> 1] | 0;
							p = ee(m, i[k >> 1] | 0) | 0;
							if((p | 0) == 1073741824) {
								o[h >> 2] = 1;
								w = 2147483647
							} else w = p << 1;
							v = (ee(m, v << 16 >> 16) | 0) >> 15;
							p = w + (v << 1) | 0;
							if((w ^ v | 0) > 0 & (p ^ w | 0) < 0) {
								o[h >> 2] = 1;
								p = (w >>> 31) + 2147483647 | 0
							}
							m = (p | 0) < (E | 0);
							S = m ? S : f;
							f = f + -1 << 16 >> 16;
							if(f << 16 >> 16 < t << 16 >> 16) {
								_ = S;
								break
							} else {
								E = m ? E : p;
								_ = _ + -2 | 0;
								n = n + -2 | 0
							}
						}
					}
				while(0);
				if(s << 16 >> 16 > 0) {
					f = 0;
					n = A;
					v = g + (M - (_ << 16 >> 16) << 1) | 0;
					S = 0;
					w = 0;
					while(1) {
						p = i[v >> 1] | 0;
						m = ee(p, i[n >> 1] | 0) | 0;
						if((m | 0) != 1073741824) {
							E = (m << 1) + S | 0;
							if((m ^ S | 0) > 0 & (E ^ S | 0) < 0) {
								o[h >> 2] = 1;
								S = (S >>> 31) + 2147483647 | 0
							} else S = E
						} else {
							o[h >> 2] = 1;
							S = 2147483647
						}
						E = ee(p, p) | 0;
						if((E | 0) != 1073741824) {
							m = (E << 1) + w | 0;
							if((E ^ w | 0) > 0 & (m ^ w | 0) < 0) {
								o[h >> 2] = 1;
								w = (w >>> 31) + 2147483647 | 0
							} else w = m
						} else {
							o[h >> 2] = 1;
							w = 2147483647
						}
						f = f + 1 << 16 >> 16;
						if(f << 16 >> 16 >= s << 16 >> 16) break;
						else {
							n = n + 2 | 0;
							v = v + 2 | 0
						}
					}
				} else {
					S = 0;
					w = 0
				}
				m = (d | 0) == 0;
				if(!m) {
					zt(r, 0, h);
					Ht(r, S, w, h)
				}
				E = (Ni(w, h) | 0) << 16 >> 16;
				if((E * 13107 | 0) == 1073741824) {
					o[h >> 2] = 1;
					w = 2147483647
				} else w = E * 26214 | 0;
				E = S - w | 0;
				if(((E ^ S) & (w ^ S) | 0) < 0) {
					o[h >> 2] = 1;
					E = (S >>> 31) + 2147483647 | 0
				}
				d = Ni(E, h) | 0;
				i[R >> 1] = d;
				if(d << 16 >> 16 > 0) {
					E = l + 6 | 0;
					i[l + 8 >> 1] = i[E >> 1] | 0;
					d = l + 4 | 0;
					i[E >> 1] = i[d >> 1] | 0;
					E = l + 2 | 0;
					i[d >> 1] = i[E >> 1] | 0;
					i[E >> 1] = i[l >> 1] | 0;
					i[l >> 1] = _;
					i[e >> 1] = ri(l, 5) | 0;
					i[e + 2 >> 1] = 32767;
					E = 32767
				} else {
					i[e >> 1] = _;
					e = e + 2 | 0;
					E = ((i[e >> 1] | 0) * 29491 | 0) >>> 15 & 65535;
					i[e >> 1] = E
				}
				i[O >> 1] = ((Bi(E, 9830, h) | 0) & 65535) >>> 15 ^ 1;
				if(m) {
					c = D;
					return _ | 0
				}
				if((Bi(u, 1, h) | 0) << 16 >> 16) {
					c = D;
					return _ | 0
				}
				Cn(y, A, s, a, t, T, h) | 0;
				xt(r, i[T >> 1] | 0);
				c = D;
				return _ | 0
			}

			function at(e, r, n, t, i, o, a, s, l, f) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				i = i | 0;
				o = o | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				f = f | 0;
				var u = 0,
					d = 0;
				f = c;
				c = c + 48 | 0;
				d = f + 22 | 0;
				u = f;
				r = e >>> 0 < 6 ? r : n;
				n = o << 16 >> 16 > 0 ? 22 : 0;
				e = i + (n << 1) | 0;
				Ui(e, r, d);
				Ui(e, t, u);
				e = o << 16 >> 16;
				o = l + (e << 1) | 0;
				Di(d, a + (e << 1) | 0, o, 40);
				Li(u, o, o, 40, s, 1);
				n = i + (((n << 16) + 720896 | 0) >>> 16 << 1) | 0;
				Ui(n, r, d);
				Ui(n, t, u);
				e = (e << 16) + 2621440 >> 16;
				l = l + (e << 1) | 0;
				Di(d, a + (e << 1) | 0, l, 40);
				Li(u, l, l, 40, s, 1);
				c = f;
				return
			}

			function st(e) {
				e = e | 0;
				var r = 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				o[e >> 2] = 0;
				r = xi(12) | 0;
				if(!r) {
					e = -1;
					return e | 0
				}
				i[r >> 1] = 0;
				i[r + 2 >> 1] = 0;
				i[r + 4 >> 1] = 0;
				i[r + 6 >> 1] = 0;
				i[r + 8 >> 1] = 0;
				i[r + 10 >> 1] = 0;
				o[e >> 2] = r;
				e = 0;
				return e | 0
			}

			function lt(e) {
				e = e | 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				i[e >> 1] = 0;
				i[e + 2 >> 1] = 0;
				i[e + 4 >> 1] = 0;
				i[e + 6 >> 1] = 0;
				i[e + 8 >> 1] = 0;
				i[e + 10 >> 1] = 0;
				e = 0;
				return e | 0
			}

			function ft(e) {
				e = e | 0;
				var r = 0;
				if(!e) return;
				r = o[e >> 2] | 0;
				if(!r) return;
				Hi(r);
				o[e >> 2] = 0;
				return
			}

			function ut(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					o = 0,
					a = 0,
					s = 0,
					l = 0,
					f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0;
				d = e + 10 | 0;
				o = i[d >> 1] | 0;
				h = e + 8 | 0;
				t = i[h >> 1] | 0;
				if(!(n << 16 >> 16)) {
					e = t;
					c = o;
					i[d >> 1] = c;
					i[h >> 1] = e;
					return
				}
				l = e + 4 | 0;
				f = e + 6 | 0;
				u = e + 2 | 0;
				s = i[f >> 1] | 0;
				c = i[l >> 1] | 0;
				a = n;
				n = o;
				while(1) {
					E = (ee(i[e >> 1] | 0, -3733) | 0) + (((c << 16 >> 16) * 7807 | 0) + ((s << 16 >> 16) * 7807 >> 15)) | 0;
					i[e >> 1] = c;
					E = E + ((ee(i[u >> 1] | 0, -3733) | 0) >> 15) | 0;
					i[u >> 1] = s;
					E = ((n << 16 >> 16) * 1899 | 0) + E + (ee(t << 16 >> 16, -3798) | 0) | 0;
					n = i[r >> 1] | 0;
					E = E + ((n << 16 >> 16) * 1899 | 0) | 0;
					i[r >> 1] = (E + 2048 | 0) >>> 12;
					o = E >>> 12;
					c = o & 65535;
					i[l >> 1] = c;
					s = (E << 3) - (o << 15) & 65535;
					i[f >> 1] = s;
					a = a + -1 << 16 >> 16;
					if(!(a << 16 >> 16)) break;
					else {
						E = t;
						r = r + 2 | 0;
						t = n;
						n = E
					}
				}
				i[d >> 1] = t;
				i[h >> 1] = n;
				return
			}

			function ct(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var a = 0,
					s = 0,
					l = 0,
					f = 0;
				a = i[(o[t + 88 >> 2] | 0) + (e << 1) >> 1] | 0;
				if(!(a << 16 >> 16)) return;
				f = n;
				l = o[(o[t + 92 >> 2] | 0) + (e << 2) >> 2] | 0;
				while(1) {
					n = i[l >> 1] | 0;
					if(!(n << 16 >> 16)) n = 0;
					else {
						e = i[r >> 1] | 0;
						s = n;
						t = f + ((n << 16 >> 16) + -1 << 1) | 0;
						while(1) {
							n = e << 16 >> 16;
							i[t >> 1] = n & 1;
							s = s + -1 << 16 >> 16;
							if(!(s << 16 >> 16)) break;
							else {
								e = n >>> 1 & 65535;
								t = t + -2 | 0
							}
						}
						n = i[l >> 1] | 0
					}
					r = r + 2 | 0;
					a = a + -1 << 16 >> 16;
					if(!(a << 16 >> 16)) break;
					else {
						f = f + (n << 16 >> 16 << 1) | 0;
						l = l + 2 | 0
					}
				}
				return
			}

			function dt(e, r, n, t, a, l) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				l = l | 0;
				var f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0;
				E = c;
				c = c + 16 | 0;
				d = E + 2 | 0;
				h = E;
				f = a << 16 >> 16;
				if(a << 16 >> 16 < 1) {
					l = -5443;
					h = -32768;
					Qt(e, h, l);
					c = E;
					return
				}
				u = bi(14, n, l) | 0;
				if((f | 0) < (u << 16 >> 16 | 0)) n = t;
				else {
					n = (t & 65535) + 1 & 65535;
					a = f >>> 1 & 65535
				}
				t = Gt(a, u & 65535) | 0;
				i[h >> 1] = t;
				si(t << 16 >> 16, d, h, l);
				i[d >> 1] = ((((n & 65535) - (r & 65535) << 16) + -65536 | 0) >>> 16) + (s[d >> 1] | 0);
				t = Ci(i[h >> 1] | 0, 5, l) | 0;
				f = i[d >> 1] | 0;
				t = ((f & 65535) << 10) + (t & 65535) & 65535;
				if(t << 16 >> 16 > 18284) {
					l = 3037;
					h = 18284;
					Qt(e, h, l);
					c = E;
					return
				}
				a = i[h >> 1] | 0;
				f = f << 16 >> 16;
				if((f * 24660 | 0) == 1073741824) {
					o[l >> 2] = 1;
					n = 2147483647
				} else n = f * 49320 | 0;
				h = (a << 16 >> 16) * 24660 >> 15;
				f = n + (h << 1) | 0;
				if((n ^ h | 0) > 0 & (f ^ n | 0) < 0) {
					o[l >> 2] = 1;
					f = (n >>> 31) + 2147483647 | 0
				}
				h = f << 13;
				l = Ni((h >> 13 | 0) == (f | 0) ? h : f >> 31 ^ 2147483647, l) | 0;
				h = t;
				Qt(e, h, l);
				c = E;
				return
			}

			function ht(e, r, n, t, a, l, f, u, d, h, E, w, m, S, p, v, _, b, k, F) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				d = d | 0;
				h = h | 0;
				E = E | 0;
				w = w | 0;
				m = m | 0;
				S = S | 0;
				p = p | 0;
				v = v | 0;
				_ = _ | 0;
				b = b | 0;
				k = k | 0;
				F = F | 0;
				var M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0,
					C = 0,
					I = 0,
					B = 0,
					L = 0,
					U = 0,
					x = 0,
					H = 0,
					z = 0,
					j = 0,
					Y = 0,
					V = 0,
					q = 0,
					K = 0,
					W = 0,
					X = 0,
					G = 0,
					J = 0,
					Z = 0,
					Q = 0,
					$ = 0,
					re = 0,
					ne = 0,
					te = 0,
					ie = 0,
					oe = 0,
					ae = 0,
					se = 0;
				se = c;
				c = c + 80 | 0;
				te = se + 66 | 0;
				ie = se + 64 | 0;
				oe = se + 62 | 0;
				ae = se + 60 | 0;
				H = se + 40 | 0;
				z = se + 20 | 0;
				U = se;
				i[te >> 1] = r;
				i[ie >> 1] = d;
				i[oe >> 1] = h;
				L = bi(14, n, F) | 0;
				ne = L & 65535;
				i[ae >> 1] = ne;
				x = bi(14, h, F) | 0;
				B = (s[t >> 1] | 0) + 65523 | 0;
				i[U >> 1] = B;
				T = (s[t + 2 >> 1] | 0) + 65522 | 0;
				D = U + 2 | 0;
				i[D >> 1] = T;
				N = ((r & 65535) << 16) + -720896 | 0;
				y = N >> 16;
				N = (N >>> 15) + 15 + (s[t + 4 >> 1] | 0) | 0;
				P = U + 4 | 0;
				i[P >> 1] = N;
				C = (s[t + 6 >> 1] | 0) + y | 0;
				I = U + 6 | 0;
				i[I >> 1] = C;
				y = y + 1 + (s[t + 8 >> 1] | 0) | 0;
				O = U + 8 | 0;
				i[O >> 1] = y;
				M = (s[E >> 1] | 0) + 65523 & 65535;
				i[U + 10 >> 1] = M;
				A = (s[E + 2 >> 1] | 0) + 65522 & 65535;
				i[U + 12 >> 1] = A;
				g = ((d & 65535) << 16) + -720896 | 0;
				t = g >> 16;
				g = (g >>> 15) + 15 + (s[E + 4 >> 1] | 0) & 65535;
				i[U + 14 >> 1] = g;
				R = (s[E + 6 >> 1] | 0) + t & 65535;
				i[U + 16 >> 1] = R;
				t = t + 1 + (s[E + 8 >> 1] | 0) & 65535;
				i[U + 18 >> 1] = t;
				$ = (l & 65535) - (m & 65535) << 16;
				d = $ >> 16;
				if(($ | 0) > 0) {
					h = f;
					n = S << 16 >> 16 >> d & 65535
				} else {
					h = f << 16 >> 16 >> 0 - d & 65535;
					n = S
				}
				if((Ci(n, 1, F) | 0) << 16 >> 16 > h << 16 >> 16) n = 1;
				else n = (((h << 16 >> 16) + 3 >> 2 | 0) > (n << 16 >> 16 | 0)) << 31 >> 31;
				E = B + n & 65535;
				i[U >> 1] = E;
				$ = T + n & 65535;
				i[D >> 1] = $;
				Q = N + n & 65535;
				i[P >> 1] = Q;
				Z = C + n & 65535;
				i[I >> 1] = Z;
				J = y + n & 65535;
				i[O >> 1] = J;
				d = t << 16 >> 16 > E << 16 >> 16 ? t : E;
				d = R << 16 >> 16 > d << 16 >> 16 ? R : d;
				d = g << 16 >> 16 > d << 16 >> 16 ? g : d;
				d = A << 16 >> 16 > d << 16 >> 16 ? A : d;
				d = M << 16 >> 16 > d << 16 >> 16 ? M : d;
				d = J << 16 >> 16 > d << 16 >> 16 ? J : d;
				d = Z << 16 >> 16 > d << 16 >> 16 ? Z : d;
				d = Q << 16 >> 16 > d << 16 >> 16 ? Q : d;
				d = ($ << 16 >> 16 > d << 16 >> 16 ? $ : d) + 1 & 65535;
				t = 0;
				while(1) {
					n = d - (E & 65535) | 0;
					E = n & 65535;
					h = s[a >> 1] << 16;
					n = n << 16 >> 16;
					if(E << 16 >> 16 > 0) E = E << 16 >> 16 < 31 ? h >> n : 0;
					else {
						$ = 0 - n << 16 >> 16;
						E = h << $;
						E = (E >> $ | 0) == (h | 0) ? E : h >> 31 ^ 2147483647
					}
					$ = E >> 16;
					i[H + (t << 1) >> 1] = $;
					i[z + (t << 1) >> 1] = (E >>> 1) - ($ << 15);
					t = t + 1 | 0;
					if((t | 0) == 5) {
						n = 5;
						h = w;
						break
					}
					E = i[U + (t << 1) >> 1] | 0;
					a = a + 2 | 0
				}
				while(1) {
					t = d - (M & 65535) | 0;
					M = t & 65535;
					E = s[h >> 1] << 16;
					t = t << 16 >> 16;
					if(M << 16 >> 16 > 0) E = M << 16 >> 16 < 31 ? E >> t : 0;
					else {
						Q = 0 - t << 16 >> 16;
						$ = E << Q;
						E = ($ >> Q | 0) == (E | 0) ? $ : E >> 31 ^ 2147483647
					}
					$ = E >> 16;
					i[H + (n << 1) >> 1] = $;
					i[z + (n << 1) >> 1] = (E >>> 1) - ($ << 15);
					E = n + 1 | 0;
					if((E & 65535) << 16 >> 16 == 10) break;
					M = i[U + (E << 1) >> 1] | 0;
					n = E;
					h = h + 2 | 0
				}
				j = L << 16 >> 16;
				Y = i[H >> 1] | 0;
				V = i[z >> 1] | 0;
				q = i[H + 2 >> 1] | 0;
				K = i[z + 2 >> 1] | 0;
				W = i[H + 4 >> 1] | 0;
				X = i[z + 4 >> 1] | 0;
				G = i[H + 6 >> 1] | 0;
				J = i[z + 6 >> 1] | 0;
				Z = i[H + 8 >> 1] | 0;
				Q = i[z + 8 >> 1] | 0;
				$ = p & 65535;
				m = x << 16 >> 16;
				l = i[H + 10 >> 1] | 0;
				R = i[z + 10 >> 1] | 0;
				g = i[H + 12 >> 1] | 0;
				a = i[z + 12 >> 1] | 0;
				n = i[H + 14 >> 1] | 0;
				h = i[z + 14 >> 1] | 0;
				t = i[H + 16 >> 1] | 0;
				M = i[z + 16 >> 1] | 0;
				y = i[H + 18 >> 1] | 0;
				z = i[z + 18 >> 1] | 0;
				d = 2147483647;
				H = 0;
				E = 0;
				O = 782;
				do {
					U = i[O >> 1] | 0;
					C = (ee(j, i[O + 2 >> 1] | 0) | 0) >>> 15 << 16;
					w = C >> 16;
					N = U << 1;
					B = (ee(N, U) | 0) >> 16;
					S = ee(B, Y) | 0;
					if((S | 0) == 1073741824) {
						o[F >> 2] = 1;
						I = 2147483647
					} else I = S << 1;
					x = (ee(V, B) | 0) >> 15;
					S = I + (x << 1) | 0;
					if((I ^ x | 0) > 0 & (S ^ I | 0) < 0) {
						o[F >> 2] = 1;
						S = (I >>> 31) + 2147483647 | 0
					}
					B = ee(q, U) | 0;
					if((B | 0) == 1073741824) {
						o[F >> 2] = 1;
						I = 2147483647
					} else I = B << 1;
					x = (ee(K, U) | 0) >> 15;
					B = I + (x << 1) | 0;
					if((I ^ x | 0) > 0 & (B ^ I | 0) < 0) {
						o[F >> 2] = 1;
						B = (I >>> 31) + 2147483647 | 0
					}
					C = (ee(C >> 15, w) | 0) >> 16;
					I = ee(W, C) | 0;
					if((I | 0) == 1073741824) {
						o[F >> 2] = 1;
						P = 2147483647
					} else P = I << 1;
					x = (ee(X, C) | 0) >> 15;
					I = P + (x << 1) | 0;
					if((P ^ x | 0) > 0 & (I ^ P | 0) < 0) {
						o[F >> 2] = 1;
						I = (P >>> 31) + 2147483647 | 0
					}
					C = ee(G, w) | 0;
					if((C | 0) == 1073741824) {
						o[F >> 2] = 1;
						P = 2147483647
					} else P = C << 1;
					x = (ee(J, w) | 0) >> 15;
					C = P + (x << 1) | 0;
					if((P ^ x | 0) > 0 & (C ^ P | 0) < 0) {
						o[F >> 2] = 1;
						x = (P >>> 31) + 2147483647 | 0
					} else x = C;
					P = (ee(N, w) | 0) >> 16;
					C = ee(Z, P) | 0;
					if((C | 0) == 1073741824) {
						o[F >> 2] = 1;
						N = 2147483647
					} else N = C << 1;
					L = (ee(Q, P) | 0) >> 15;
					C = N + (L << 1) | 0;
					if((N ^ L | 0) > 0 & (C ^ N | 0) < 0) {
						o[F >> 2] = 1;
						C = (N >>> 31) + 2147483647 | 0
					}
					P = i[O + 4 >> 1] | 0;
					N = i[O + 6 >> 1] | 0;
					O = O + 8 | 0;
					if((U - $ & 65535) << 16 >> 16 < 1 ? (re = P << 16 >> 16, P << 16 >> 16 <= p << 16 >> 16) : 0) {
						T = (ee(N << 16 >> 16, m) | 0) >>> 15 << 16;
						U = T >> 16;
						A = re << 1;
						N = (ee(A, re) | 0) >> 16;
						P = ee(l, N) | 0;
						if((P | 0) == 1073741824) {
							o[F >> 2] = 1;
							D = 2147483647
						} else D = P << 1;
						L = (ee(R, N) | 0) >> 15;
						P = D + (L << 1) | 0;
						if((D ^ L | 0) > 0 & (P ^ D | 0) < 0) {
							o[F >> 2] = 1;
							P = (D >>> 31) + 2147483647 | 0
						}
						N = ee(g, re) | 0;
						if((N | 0) == 1073741824) {
							o[F >> 2] = 1;
							D = 2147483647
						} else D = N << 1;
						L = (ee(a, re) | 0) >> 15;
						N = D + (L << 1) | 0;
						if((D ^ L | 0) > 0 & (N ^ D | 0) < 0) {
							o[F >> 2] = 1;
							L = (D >>> 31) + 2147483647 | 0
						} else L = N;
						D = (ee(T >> 15, U) | 0) >> 16;
						N = ee(n, D) | 0;
						if((N | 0) == 1073741824) {
							o[F >> 2] = 1;
							T = 2147483647
						} else T = N << 1;
						w = (ee(h, D) | 0) >> 15;
						N = T + (w << 1) | 0;
						if((T ^ w | 0) > 0 & (N ^ T | 0) < 0) {
							o[F >> 2] = 1;
							w = (T >>> 31) + 2147483647 | 0
						} else w = N;
						N = ee(t, U) | 0;
						if((N | 0) == 1073741824) {
							o[F >> 2] = 1;
							D = 2147483647
						} else D = N << 1;
						T = (ee(M, U) | 0) >> 15;
						N = D + (T << 1) | 0;
						if((D ^ T | 0) > 0 & (N ^ D | 0) < 0) {
							o[F >> 2] = 1;
							f = (D >>> 31) + 2147483647 | 0
						} else f = N;
						D = (ee(A, U) | 0) >> 16;
						N = ee(y, D) | 0;
						if((N | 0) == 1073741824) {
							o[F >> 2] = 1;
							T = 2147483647
						} else T = N << 1;
						U = (ee(z, D) | 0) >> 15;
						N = T + (U << 1) | 0;
						if((T ^ U | 0) > 0 & (N ^ T | 0) < 0) {
							o[F >> 2] = 1;
							N = (T >>> 31) + 2147483647 | 0
						}
						U = B + S + I + x + C + P + L + w + f + N | 0;
						x = (U | 0) < (d | 0);
						d = x ? U : d;
						E = x ? H : E
					}
					H = H + 1 << 16 >> 16
				} while (H << 16 >> 16 < 256);
				p = (E & 65535) << 18 >> 16;
				Et(e, 782 + (p << 1) | 0, ne, r, v, _, F);
				Zt(e, 0, u, ie, oe, te, ae, F);
				u = (bi(14, i[oe >> 1] | 0, F) | 0) & 65535;
				Et(e, 782 + ((p | 2) << 1) | 0, u, i[ie >> 1] | 0, b, k, F);
				c = se;
				return E | 0
			}

			function Et(e, r, n, t, a, l, f) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				var u = 0,
					d = 0,
					h = 0,
					E = 0;
				E = c;
				c = c + 16 | 0;
				d = E + 2 | 0;
				h = E;
				i[a >> 1] = i[r >> 1] | 0;
				u = i[r + 2 >> 1] | 0;
				n = ee(n << 16 >> 16 << 1, u) | 0;
				a = 10 - (t & 65535) | 0;
				r = a & 65535;
				a = a << 16 >> 16;
				if(r << 16 >> 16 > 0) r = r << 16 >> 16 < 31 ? n >> a : 0;
				else {
					a = 0 - a << 16 >> 16;
					r = n << a;
					r = (r >> a | 0) == (n | 0) ? r : n >> 31 ^ 2147483647
				}
				i[l >> 1] = r >>> 16;
				si(u, d, h, f);
				i[d >> 1] = (s[d >> 1] | 0) + 65524;
				a = Ci(i[h >> 1] | 0, 5, f) | 0;
				t = i[d >> 1] | 0;
				a = ((t & 65535) << 10) + (a & 65535) & 65535;
				n = i[h >> 1] | 0;
				t = t << 16 >> 16;
				if((t * 24660 | 0) == 1073741824) {
					o[f >> 2] = 1;
					r = 2147483647
				} else r = t * 49320 | 0;
				h = (n << 16 >> 16) * 24660 >> 15;
				t = r + (h << 1) | 0;
				if(!((r ^ h | 0) > 0 & (t ^ r | 0) < 0)) {
					f = t;
					f = f << 13;
					f = f + 32768 | 0;
					f = f >>> 16;
					f = f & 65535;
					Qt(e, a, f);
					c = E;
					return
				}
				o[f >> 2] = 1;
				f = (r >>> 31) + 2147483647 | 0;
				f = f << 13;
				f = f + 32768 | 0;
				f = f >>> 16;
				f = f & 65535;
				Qt(e, a, f);
				c = E;
				return
			}

			function wt(e, r, n, t, a, l, f, u, d, h, E, w, m, S, p, v, _, b, k, F, M) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				d = d | 0;
				h = h | 0;
				E = E | 0;
				w = w | 0;
				m = m | 0;
				S = S | 0;
				p = p | 0;
				v = v | 0;
				_ = _ | 0;
				b = b | 0;
				k = k | 0;
				F = F | 0;
				M = M | 0;
				var g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0,
					C = 0,
					I = 0,
					B = 0,
					L = 0,
					U = 0,
					x = 0,
					H = 0,
					z = 0,
					j = 0,
					Y = 0,
					V = 0,
					q = 0,
					K = 0,
					W = 0,
					X = 0,
					G = 0,
					J = 0,
					Z = 0,
					Q = 0,
					$ = 0,
					re = 0,
					ne = 0,
					te = 0,
					ie = 0,
					oe = 0,
					ae = 0,
					se = 0,
					le = 0,
					fe = 0,
					ue = 0,
					ce = 0;
				ce = c;
				c = c + 80 | 0;
				le = ce + 72 | 0;
				fe = ce + 70 | 0;
				ue = ce + 68 | 0;
				ae = ce + 66 | 0;
				se = ce + 56 | 0;
				Z = ce + 24 | 0;
				J = ce + 12 | 0;
				X = ce + 48 | 0;
				G = ce + 40 | 0;
				Y = ce + 34 | 0;
				q = ce + 22 | 0;
				z = ce + 6 | 0;
				j = ce;
				St(5, S, p, z, j, o[F + 72 >> 2] | 0, M) | 0;
				y = bi(14, h, M) | 0;
				V = F + 68 | 0;
				H = o[V >> 2] | 0;
				W = d << 16 >> 16;
				K = W + 65526 | 0;
				S = (s[l >> 1] | 0) + 65523 & 65535;
				i[se >> 1] = S;
				F = (s[l + 2 >> 1] | 0) + 65522 & 65535;
				i[se + 2 >> 1] = F;
				te = K << 16 >> 16;
				ie = ((K << 17 >> 17 | 0) == (te | 0) ? K << 1 : te >>> 15 ^ 32767) + 15 + (s[l + 4 >> 1] | 0) & 65535;
				i[se + 4 >> 1] = ie;
				oe = (s[l + 6 >> 1] | 0) + te & 65535;
				i[se + 6 >> 1] = oe;
				l = te + 1 + (s[l + 8 >> 1] | 0) & 65535;
				i[se + 8 >> 1] = l;
				F = F << 16 >> 16 > S << 16 >> 16 ? F : S;
				F = ie << 16 >> 16 > F << 16 >> 16 ? ie : F;
				F = oe << 16 >> 16 > F << 16 >> 16 ? oe : F;
				F = (Wt(l << 16 >> 16 > F << 16 >> 16 ? l : F, 1, M) | 0) & 65535;
				l = S;
				S = 0;
				while(1) {
					h = F - (l & 65535) | 0;
					l = h & 65535;
					R = s[a + (S << 1) >> 1] << 16;
					h = h << 16 >> 16;
					if(l << 16 >> 16 > 0) h = l << 16 >> 16 < 31 ? R >> h : 0;
					else {
						oe = 0 - h << 16 >> 16;
						h = R << oe;
						h = (h >> oe | 0) == (R | 0) ? h : R >> 31 ^ 2147483647
					}
					Yn(h, Z + (S << 1) | 0, J + (S << 1) | 0, M);
					h = S + 1 | 0;
					if((h | 0) == 5) break;
					l = i[se + (h << 1) >> 1] | 0;
					S = h
				}
				U = Z + 2 | 0;
				x = J + 2 | 0;
				oe = y << 16 >> 16;
				Q = Z + 4 | 0;
				$ = J + 4 | 0;
				re = Z + 6 | 0;
				ne = J + 6 | 0;
				te = Z + 8 | 0;
				ie = J + 8 | 0;
				T = 0;
				l = 2147483647;
				a = 0;
				h = 0;
				while(1) {
					L = i[z + (a << 1) >> 1] | 0;
					y = ee(L, L) | 0;
					if(y >>> 0 > 1073741823) {
						o[M >> 2] = 1;
						y = 32767
					} else y = y >>> 15;
					F = i[J >> 1] | 0;
					R = y << 16 >> 16;
					y = ee(R, i[Z >> 1] | 0) | 0;
					if((y | 0) == 1073741824) {
						o[M >> 2] = 1;
						S = 2147483647
					} else S = y << 1;
					B = (ee(F << 16 >> 16, R) | 0) >> 15;
					y = S + (B << 1) | 0;
					if((S ^ B | 0) > 0 & (y ^ S | 0) < 0) {
						o[M >> 2] = 1;
						y = (S >>> 31) + 2147483647 | 0
					}
					F = i[x >> 1] | 0;
					R = ee(i[U >> 1] | 0, L) | 0;
					if((R | 0) != 1073741824) {
						S = (R << 1) + y | 0;
						if((R ^ y | 0) > 0 & (S ^ y | 0) < 0) {
							o[M >> 2] = 1;
							S = (y >>> 31) + 2147483647 | 0
						}
					} else {
						o[M >> 2] = 1;
						S = 2147483647
					}
					y = (ee(F << 16 >> 16, L) | 0) >> 15;
					if((y | 0) > 32767) {
						o[M >> 2] = 1;
						y = 32767
					}
					B = y << 16;
					y = (B >> 15) + S | 0;
					if((B >> 16 ^ S | 0) > 0 & (y ^ S | 0) < 0) {
						o[M >> 2] = 1;
						B = (S >>> 31) + 2147483647 | 0
					} else B = y;
					C = (B >>> 31) + 2147483647 | 0;
					I = a & 65535;
					y = T;
					N = 0;
					P = H;
					do {
						R = (ee(i[P >> 1] | 0, oe) | 0) >> 15;
						P = P + 6 | 0;
						if((R | 0) > 32767) {
							o[M >> 2] = 1;
							R = 32767
						}
						D = R << 16 >> 16;
						R = ee(D, D) | 0;
						if((R | 0) == 1073741824) {
							o[M >> 2] = 1;
							A = 2147483647
						} else A = R << 1;
						Yn(A, le, fe, M);
						R = ee(D, L) | 0;
						if((R | 0) == 1073741824) {
							o[M >> 2] = 1;
							A = 2147483647
						} else A = R << 1;
						Yn(A, ue, ae, M);
						S = i[$ >> 1] | 0;
						O = i[fe >> 1] | 0;
						R = i[Q >> 1] | 0;
						F = i[le >> 1] | 0;
						T = ee(F, R) | 0;
						if((T | 0) != 1073741824) {
							A = (T << 1) + B | 0;
							if((T ^ B | 0) > 0 & (A ^ B | 0) < 0) {
								o[M >> 2] = 1;
								A = C
							}
						} else {
							o[M >> 2] = 1;
							A = 2147483647
						}
						T = (ee(O << 16 >> 16, R) | 0) >> 15;
						if((T | 0) > 32767) {
							o[M >> 2] = 1;
							T = 32767
						}
						O = T << 16;
						T = (O >> 15) + A | 0;
						if((O >> 16 ^ A | 0) > 0 & (T ^ A | 0) < 0) {
							o[M >> 2] = 1;
							T = (A >>> 31) + 2147483647 | 0
						}
						A = (ee(F, S << 16 >> 16) | 0) >> 15;
						if((A | 0) > 32767) {
							o[M >> 2] = 1;
							A = 32767
						}
						O = A << 16;
						A = (O >> 15) + T | 0;
						if((O >> 16 ^ T | 0) > 0 & (A ^ T | 0) < 0) {
							o[M >> 2] = 1;
							A = (T >>> 31) + 2147483647 | 0
						}
						R = i[ne >> 1] | 0;
						T = ee(i[re >> 1] | 0, D) | 0;
						if((T | 0) != 1073741824) {
							O = (T << 1) + A | 0;
							if((T ^ A | 0) > 0 & (O ^ A | 0) < 0) {
								o[M >> 2] = 1;
								O = (A >>> 31) + 2147483647 | 0
							}
						} else {
							o[M >> 2] = 1;
							O = 2147483647
						}
						R = (ee(R << 16 >> 16, D) | 0) >> 15;
						if((R | 0) > 32767) {
							o[M >> 2] = 1;
							R = 32767
						}
						D = R << 16;
						R = (D >> 15) + O | 0;
						if((D >> 16 ^ O | 0) > 0 & (R ^ O | 0) < 0) {
							o[M >> 2] = 1;
							R = (O >>> 31) + 2147483647 | 0
						}
						F = i[ie >> 1] | 0;
						O = i[ae >> 1] | 0;
						S = i[te >> 1] | 0;
						g = i[ue >> 1] | 0;
						T = ee(g, S) | 0;
						do
							if((T | 0) == 1073741824) {
								o[M >> 2] = 1;
								T = 2147483647
							} else {
								A = (T << 1) + R | 0;
								if(!((T ^ R | 0) > 0 & (A ^ R | 0) < 0)) {
									T = A;
									break
								}
								o[M >> 2] = 1;
								T = (R >>> 31) + 2147483647 | 0
							}
						while(0);
						A = (ee(O << 16 >> 16, S) | 0) >> 15;
						if((A | 0) > 32767) {
							o[M >> 2] = 1;
							A = 32767
						}
						D = A << 16;
						A = (D >> 15) + T | 0;
						if((D >> 16 ^ T | 0) > 0 & (A ^ T | 0) < 0) {
							o[M >> 2] = 1;
							A = (T >>> 31) + 2147483647 | 0
						}
						R = (ee(g, F << 16 >> 16) | 0) >> 15;
						if((R | 0) > 32767) {
							o[M >> 2] = 1;
							R = 32767
						}
						D = R << 16;
						R = (D >> 15) + A | 0;
						if((D >> 16 ^ A | 0) > 0 & (R ^ A | 0) < 0) {
							o[M >> 2] = 1;
							R = (A >>> 31) + 2147483647 | 0
						}
						D = (R | 0) < (l | 0);
						y = D ? N : y;
						h = D ? I : h;
						l = D ? R : l;
						N = N + 1 << 16 >> 16
					} while (N << 16 >> 16 < 32);
					a = a + 1 | 0;
					if((a | 0) == 3) {
						R = y;
						a = h;
						break
					} else T = y
				}
				x = (R << 16 >> 16) * 3 | 0;
				l = i[H + (x << 1) >> 1] | 0;
				i[_ >> 1] = i[H + (x + 1 << 1) >> 1] | 0;
				i[b >> 1] = i[H + (x + 2 << 1) >> 1] | 0;
				l = ee(l << 16 >> 16, oe) | 0;
				if((l | 0) == 1073741824) {
					o[M >> 2] = 1;
					y = 2147483647
				} else y = l << 1;
				x = 9 - W | 0;
				H = x & 65535;
				x = x << 16 >> 16;
				U = H << 16 >> 16 > 0;
				if(U) y = H << 16 >> 16 < 31 ? y >> x : 0;
				else {
					B = 0 - x << 16 >> 16;
					L = y << B;
					y = (L >> B | 0) == (y | 0) ? L : y >> 31 ^ 2147483647
				}
				i[v >> 1] = y >>> 16;
				L = a << 16 >> 16;
				z = i[z + (L << 1) >> 1] | 0;
				i[p >> 1] = z;
				j = i[j + (L << 1) >> 1] | 0;
				Gr(r, n, t, z, E, X, G, Y, M);
				yn(e, i[Y >> 1] | 0, i[v >> 1] | 0, q, M);
				if(!((i[X >> 1] | 0) != 0 & (i[q >> 1] | 0) > 0)) {
					M = R;
					_ = o[k >> 2] | 0;
					v = _ + 2 | 0;
					i[_ >> 1] = j;
					_ = _ + 4 | 0;
					o[k >> 2] = _;
					i[v >> 1] = M;
					c = ce;
					return
				}
				D = X + 6 | 0;
				i[D >> 1] = u;
				A = G + 6 | 0;
				i[A >> 1] = f;
				d = ((Bi(m, d, M) | 0) & 65535) + 10 | 0;
				F = d << 16 >> 16;
				if((d & 65535) << 16 >> 16 < 0) {
					h = 0 - F << 16;
					if((h | 0) < 983040) w = w << 16 >> 16 >> (h >> 16) & 65535;
					else w = 0
				} else {
					h = w << 16 >> 16;
					S = h << F;
					if((S << 16 >> 16 >> F | 0) == (h | 0)) w = S & 65535;
					else w = (h >>> 15 ^ 32767) & 65535
				}
				l = i[p >> 1] | 0;
				y = i[q >> 1] | 0;
				V = o[V >> 2] | 0;
				S = i[v >> 1] | 0;
				q = 10 - W | 0;
				F = q << 16 >> 16;
				if((q & 65535) << 16 >> 16 < 0) {
					h = 0 - F << 16;
					if((h | 0) < 983040) u = S << 16 >> 16 >> (h >> 16) & 65535;
					else u = 0
				} else {
					h = S << 16 >> 16;
					S = h << F;
					if((S << 16 >> 16 >> F | 0) == (h | 0)) u = S & 65535;
					else u = (h >>> 15 ^ 32767) & 65535
				}
				a = l << 16 >> 16;
				h = ee(a, a) | 0;
				if(h >>> 0 > 1073741823) {
					o[M >> 2] = 1;
					l = 32767
				} else l = h >>> 15;
				R = Wt(32767 - (y & 65535) & 65535, 1, M) | 0;
				y = y << 16 >> 16;
				h = ee(i[X + 2 >> 1] | 0, y) | 0;
				if((h | 0) == 1073741824) {
					o[M >> 2] = 1;
					h = 2147483647
				} else h = h << 1;
				q = h << 1;
				h = ee(((q >> 1 | 0) == (h | 0) ? q : h >> 31 ^ 2147418112) >> 16, l << 16 >> 16) | 0;
				if((h | 0) == 1073741824) {
					o[M >> 2] = 1;
					T = 2147483647
				} else T = h << 1;
				O = (s[G + 2 >> 1] | 0) + 65521 | 0;
				F = O & 65535;
				h = ee(i[X + 4 >> 1] | 0, y) | 0;
				if((h | 0) == 1073741824) {
					o[M >> 2] = 1;
					l = 2147483647
				} else l = h << 1;
				h = l << 1;
				h = (ee(((h >> 1 | 0) == (l | 0) ? h : l >> 31 ^ 2147418112) >> 16, a) | 0) >> 15;
				if((h | 0) > 32767) {
					o[M >> 2] = 1;
					h = 32767
				}
				i[Q >> 1] = h;
				l = K & 65535;
				i[le >> 1] = l;
				l = Wt(i[G + 4 >> 1] | 0, l, M) | 0;
				h = ee(i[D >> 1] | 0, y) | 0;
				if((h | 0) == 1073741824) {
					o[M >> 2] = 1;
					h = 2147483647
				} else h = h << 1;
				g = h << 1;
				i[re >> 1] = ((g >> 1 | 0) == (h | 0) ? g : h >> 31 ^ 2147418112) >>> 16;
				g = ((W << 17 >> 17 | 0) == (W | 0) ? W << 1 : W >>> 15 ^ 32767) + 65529 & 65535;
				i[le >> 1] = g;
				g = Wt(i[A >> 1] | 0, g, M) | 0;
				h = (ee(i[D >> 1] | 0, R << 16 >> 16) | 0) >> 15;
				if((h | 0) > 32767) {
					o[M >> 2] = 1;
					h = 32767
				}
				i[te >> 1] = h;
				R = Wt(g, 1, M) | 0;
				S = ee(i[X >> 1] | 0, y) | 0;
				if((S | 0) == 1073741824) {
					o[M >> 2] = 1;
					h = 2147483647
				} else h = S << 1;
				A = Ii(h, le, M) | 0;
				a = (s[le >> 1] | 0) + 47 | 0;
				i[le >> 1] = a;
				a = (s[G >> 1] | 0) - (a & 65535) | 0;
				y = a + 31 & 65535;
				y = F << 16 >> 16 > y << 16 >> 16 ? F : y;
				y = l << 16 >> 16 > y << 16 >> 16 ? l : y;
				y = g << 16 >> 16 > y << 16 >> 16 ? g : y;
				y = (R << 16 >> 16 > y << 16 >> 16 ? R : y) << 16 >> 16;
				S = y - (O & 65535) | 0;
				h = S & 65535;
				S = S << 16 >> 16;
				if(h << 16 >> 16 > 0) B = h << 16 >> 16 < 31 ? T >> S : 0;
				else {
					G = 0 - S << 16 >> 16;
					B = T << G;
					B = (B >> G | 0) == (T | 0) ? B : T >> 31 ^ 2147483647
				}
				F = y - (l & 65535) | 0;
				h = F & 65535;
				S = s[Q >> 1] << 16;
				F = F << 16 >> 16;
				if(h << 16 >> 16 > 0) S = h << 16 >> 16 < 31 ? S >> F : 0;
				else {
					X = 0 - F << 16 >> 16;
					G = S << X;
					S = (G >> X | 0) == (S | 0) ? G : S >> 31 ^ 2147483647
				}
				Yn(S, Q, $, M);
				g = y - (g & 65535) | 0;
				S = g & 65535;
				F = s[re >> 1] << 16;
				g = g << 16 >> 16;
				if(S << 16 >> 16 > 0) S = S << 16 >> 16 < 31 ? F >> g : 0;
				else {
					G = 0 - g << 16 >> 16;
					S = F << G;
					S = (S >> G | 0) == (F | 0) ? S : F >> 31 ^ 2147483647
				}
				Yn(S, re, ne, M);
				g = y - (R & 65535) | 0;
				S = g & 65535;
				F = s[te >> 1] << 16;
				g = g << 16 >> 16;
				if(S << 16 >> 16 > 0) S = S << 16 >> 16 < 31 ? F >> g : 0;
				else {
					G = 0 - g << 16 >> 16;
					S = F << G;
					S = (S >> G | 0) == (F | 0) ? S : F >> 31 ^ 2147483647
				}
				Yn(S, te, ie, M);
				g = y + 65505 | 0;
				i[le >> 1] = g;
				g = g - (a & 65535) | 0;
				S = Pi(g & 65535, 1, M) | 0;
				F = S << 16 >> 16;
				if(S << 16 >> 16 > 0) F = S << 16 >> 16 < 31 ? A >> F : 0;
				else {
					G = 0 - F << 16 >> 16;
					F = A << G;
					F = (F >> G | 0) == (A | 0) ? F : A >> 31 ^ 2147483647
				}
				do
					if(!(g & 1)) T = F;
					else {
						Yn(F, Z, J, M);
						S = i[J >> 1] | 0;
						F = i[Z >> 1] | 0;
						if((F * 23170 | 0) == 1073741824) {
							o[M >> 2] = 1;
							g = 2147483647
						} else g = F * 46340 | 0;
						Z = (S << 16 >> 16) * 23170 >> 15;
						F = g + (Z << 1) | 0;
						if(!((g ^ Z | 0) > 0 & (F ^ g | 0) < 0)) {
							T = F;
							break
						}
						o[M >> 2] = 1;
						T = (g >>> 31) + 2147483647 | 0
					}
				while(0);
				D = (B >>> 31) + 2147483647 | 0;
				A = 2147483647;
				O = 0;
				F = 0;
				N = V;
				while(1) {
					S = (ee(i[N >> 1] | 0, oe) | 0) >> 15;
					N = N + 6 | 0;
					if((S | 0) > 32767) {
						o[M >> 2] = 1;
						S = 32767
					}
					g = S & 65535;
					if(g << 16 >> 16 >= u << 16 >> 16) break;
					l = S << 16 >> 16;
					S = ee(l, l) | 0;
					if((S | 0) == 1073741824) {
						o[M >> 2] = 1;
						h = 2147483647
					} else h = S << 1;
					Yn(h, fe, ue, M);
					S = (Bi(g, w, M) | 0) << 16 >> 16;
					S = ee(S, S) | 0;
					if((S | 0) == 1073741824) {
						o[M >> 2] = 1;
						S = 2147483647
					} else S = S << 1;
					Yn(S, ae, se, M);
					g = i[$ >> 1] | 0;
					h = ee(i[Q >> 1] | 0, l) | 0;
					do
						if((h | 0) == 1073741824) {
							o[M >> 2] = 1;
							h = 2147483647
						} else {
							S = (h << 1) + B | 0;
							if(!((h ^ B | 0) > 0 & (S ^ B | 0) < 0)) {
								h = S;
								break
							}
							o[M >> 2] = 1;
							h = D
						}
					while(0);
					S = (ee(g << 16 >> 16, l) | 0) >> 15;
					if((S | 0) > 32767) {
						o[M >> 2] = 1;
						S = 32767
					}
					Z = S << 16;
					S = (Z >> 15) + h | 0;
					if((Z >> 16 ^ h | 0) > 0 & (S ^ h | 0) < 0) {
						o[M >> 2] = 1;
						S = (h >>> 31) + 2147483647 | 0
					}
					a = i[ne >> 1] | 0;
					R = i[ue >> 1] | 0;
					l = i[re >> 1] | 0;
					y = i[fe >> 1] | 0;
					h = ee(y, l) | 0;
					do
						if((h | 0) == 1073741824) {
							o[M >> 2] = 1;
							g = 2147483647
						} else {
							g = (h << 1) + S | 0;
							if(!((h ^ S | 0) > 0 & (g ^ S | 0) < 0)) break;
							o[M >> 2] = 1;
							g = (S >>> 31) + 2147483647 | 0
						}
					while(0);
					h = (ee(R << 16 >> 16, l) | 0) >> 15;
					if((h | 0) > 32767) {
						o[M >> 2] = 1;
						h = 32767
					}
					Z = h << 16;
					h = (Z >> 15) + g | 0;
					if((Z >> 16 ^ g | 0) > 0 & (h ^ g | 0) < 0) {
						o[M >> 2] = 1;
						h = (g >>> 31) + 2147483647 | 0
					}
					S = (ee(y, a << 16 >> 16) | 0) >> 15;
					if((S | 0) > 32767) {
						o[M >> 2] = 1;
						S = 32767
					}
					Z = S << 16;
					S = (Z >> 15) + h | 0;
					if((Z >> 16 ^ h | 0) > 0 & (S ^ h | 0) < 0) {
						o[M >> 2] = 1;
						S = (h >>> 31) + 2147483647 | 0
					}
					S = Ii(S, le, M) | 0;
					g = Pi(i[le >> 1] | 0, 1, M) | 0;
					h = g << 16 >> 16;
					if(g << 16 >> 16 > 0) g = g << 16 >> 16 < 31 ? S >> h : 0;
					else {
						Z = 0 - h << 16 >> 16;
						g = S << Z;
						g = (g >> Z | 0) == (S | 0) ? g : S >> 31 ^ 2147483647
					}
					S = g - T | 0;
					if(((S ^ g) & (g ^ T) | 0) < 0) {
						o[M >> 2] = 1;
						S = (g >>> 31) + 2147483647 | 0
					}
					S = (Ni(S, M) | 0) << 16 >> 16;
					S = ee(S, S) | 0;
					if((S | 0) == 1073741824) {
						o[M >> 2] = 1;
						g = 2147483647
					} else g = S << 1;
					y = i[ie >> 1] | 0;
					l = i[se >> 1] | 0;
					R = i[te >> 1] | 0;
					a = i[ae >> 1] | 0;
					h = ee(a, R) | 0;
					do
						if((h | 0) == 1073741824) {
							o[M >> 2] = 1;
							S = 2147483647
						} else {
							S = (h << 1) + g | 0;
							if(!((h ^ g | 0) > 0 & (S ^ g | 0) < 0)) break;
							o[M >> 2] = 1;
							S = (g >>> 31) + 2147483647 | 0
						}
					while(0);
					h = (ee(l << 16 >> 16, R) | 0) >> 15;
					if((h | 0) > 32767) {
						o[M >> 2] = 1;
						h = 32767
					}
					Z = h << 16;
					h = (Z >> 15) + S | 0;
					if((Z >> 16 ^ S | 0) > 0 & (h ^ S | 0) < 0) {
						o[M >> 2] = 1;
						h = (S >>> 31) + 2147483647 | 0
					}
					S = (ee(a, y << 16 >> 16) | 0) >> 15;
					if((S | 0) > 32767) {
						o[M >> 2] = 1;
						S = 32767
					}
					Z = S << 16;
					S = (Z >> 15) + h | 0;
					if((Z >> 16 ^ h | 0) > 0 & (S ^ h | 0) < 0) {
						o[M >> 2] = 1;
						S = (h >>> 31) + 2147483647 | 0
					}
					h = (S | 0) < (A | 0);
					F = h ? O : F;
					O = O + 1 << 16 >> 16;
					if(O << 16 >> 16 >= 32) break;
					else A = h ? S : A
				}
				ue = (F << 16 >> 16) * 3 | 0;
				g = i[V + (ue << 1) >> 1] | 0;
				i[_ >> 1] = i[V + (ue + 1 << 1) >> 1] | 0;
				i[b >> 1] = i[V + (ue + 2 << 1) >> 1] | 0;
				g = ee(g << 16 >> 16, oe) | 0;
				if((g | 0) == 1073741824) {
					o[M >> 2] = 1;
					g = 2147483647
				} else g = g << 1;
				if(U) g = H << 16 >> 16 < 31 ? g >> x : 0;
				else {
					_ = 0 - x << 16 >> 16;
					M = g << _;
					g = (M >> _ | 0) == (g | 0) ? M : g >> 31 ^ 2147483647
				}
				i[v >> 1] = g >>> 16;
				M = F;
				_ = o[k >> 2] | 0;
				v = _ + 2 | 0;
				i[_ >> 1] = j;
				_ = _ + 4 | 0;
				o[k >> 2] = _;
				i[v >> 1] = M;
				c = ce;
				return
			}

			function mt(e, r, n, t, o, a, s, l) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				var f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0;
				h = (e | 0) == 7;
				f = i[t >> 1] | 0;
				if(h) {
					f = f << 16 >> 16 >>> 1 & 65535;
					d = bi(r, n, l) | 0;
					r = d << 16;
					e = r >> 16;
					if((d << 20 >> 20 | 0) == (e | 0)) e = r >> 12;
					else e = e >>> 15 ^ 32767
				} else {
					d = bi(r, n, l) | 0;
					r = d << 16;
					e = r >> 16;
					if((d << 21 >> 21 | 0) == (e | 0)) e = r >> 11;
					else e = e >>> 15 ^ 32767
				}
				d = e << 16 >> 16;
				l = f << 16 >> 16;
				r = l - ((ee(d, i[s >> 1] | 0) | 0) >>> 15 & 65535) | 0;
				r = ((r & 32768 | 0) != 0 ? 0 - r | 0 : r) & 65535;
				u = 1;
				e = 0;
				c = s;
				while(1) {
					c = c + 6 | 0;
					f = l - ((ee(i[c >> 1] | 0, d) | 0) >>> 15 & 65535) | 0;
					n = f << 16;
					f = (n | 0) < 0 ? 0 - (n >> 16) | 0 : f;
					n = (f << 16 >> 16 | 0) < (r << 16 >> 16 | 0);
					e = n ? u : e;
					u = u + 1 << 16 >> 16;
					if(u << 16 >> 16 >= 32) break;
					else r = n ? f & 65535 : r
				}
				c = (e << 16 >> 16) * 196608 >> 16;
				i[t >> 1] = (ee(i[s + (c << 1) >> 1] | 0, d) | 0) >>> 15 << (h & 1);
				i[o >> 1] = i[s + (c + 1 << 1) >> 1] | 0;
				i[a >> 1] = i[s + (c + 2 << 1) >> 1] | 0;
				return e | 0
			}

			function St(e, r, n, t, o, a, s) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				a = a | 0;
				s = s | 0;
				var l = 0,
					f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0;
				l = Bi(i[n >> 1] | 0, i[a >> 1] | 0, s) | 0;
				l = (l & 65535) - ((l & 65535) >>> 15 & 65535) | 0;
				l = (l << 16 >> 31 ^ l) & 65535;
				u = 0;
				c = 1;
				while(1) {
					f = i[a + (c << 1) >> 1] | 0;
					if(f << 16 >> 16 > r << 16 >> 16) f = l;
					else {
						f = Bi(i[n >> 1] | 0, f, s) | 0;
						f = (f & 65535) - ((f & 65535) >>> 15 & 65535) | 0;
						f = (f << 16 >> 31 ^ f) & 65535;
						h = f << 16 >> 16 < l << 16 >> 16;
						f = h ? f : l;
						u = h ? c & 65535 : u
					}
					c = c + 1 | 0;
					if((c | 0) == 16) break;
					else l = f
				}
				if((e | 0) != 5) {
					l = i[a + (u << 16 >> 16 << 1) >> 1] | 0;
					if((e | 0) == 7) {
						i[n >> 1] = l & 65532;
						return u | 0
					} else {
						i[n >> 1] = l;
						return u | 0
					}
				}
				f = u << 16 >> 16;
				switch(u << 16 >> 16) {
					case 0:
						{
							l = 0;
							break
						}
					case 15:
						{
							d = 8;
							break
						}
					default:
						if((i[a + (f + 1 << 1) >> 1] | 0) > r << 16 >> 16) d = 8;
						else l = f + 65535 & 65535
				}
				if((d | 0) == 8) l = f + 65534 & 65535;
				i[o >> 1] = l;
				h = l << 16 >> 16;
				i[t >> 1] = i[a + (h << 1) >> 1] | 0;
				h = h + 1 | 0;
				i[o + 2 >> 1] = h;
				h = h << 16 >> 16;
				i[t + 2 >> 1] = i[a + (h << 1) >> 1] | 0;
				h = h + 1 | 0;
				i[o + 4 >> 1] = h;
				i[t + 4 >> 1] = i[a + (h << 16 >> 16 << 1) >> 1] | 0;
				i[n >> 1] = i[a + (f << 1) >> 1] | 0;
				return u | 0
			}

			function pt(e, r, n, t, a, l, f, u, d, h, E, w) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				d = d | 0;
				h = h | 0;
				E = E | 0;
				w = w | 0;
				var m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0,
					C = 0,
					I = 0,
					B = 0;
				B = c;
				c = c + 32 | 0;
				p = B + 20 | 0;
				v = B + 10 | 0;
				S = B;
				switch(e | 0) {
					case 3:
					case 4:
					case 6:
						{
							E = E + 84 | 0;I = 128;
							break
						}
					default:
						{
							E = E + 80 | 0;I = 64
						}
				}
				C = o[E >> 2] | 0;
				m = bi(14, n, w) | 0;
				P = r << 16 >> 16;
				N = P + 65525 | 0;
				e = (s[a >> 1] | 0) + 65523 & 65535;
				i[S >> 1] = e;
				r = (s[a + 2 >> 1] | 0) + 65522 & 65535;
				i[S + 2 >> 1] = r;
				D = N << 16 >> 16;
				D = Wt(i[a + 4 >> 1] | 0, ((N << 17 >> 17 | 0) == (D | 0) ? N << 1 : D >>> 15 ^ 32767) + 15 & 65535, w) | 0;
				i[S + 4 >> 1] = D;
				N = Wt(i[a + 6 >> 1] | 0, N & 65535, w) | 0;
				i[S + 6 >> 1] = N;
				a = Wt(i[a + 8 >> 1] | 0, P + 65526 & 65535, w) | 0;
				i[S + 8 >> 1] = a;
				r = r << 16 >> 16 > e << 16 >> 16 ? r : e;
				r = D << 16 >> 16 > r << 16 >> 16 ? D : r;
				r = N << 16 >> 16 > r << 16 >> 16 ? N : r;
				r = (a << 16 >> 16 > r << 16 >> 16 ? a : r) + 1 & 65535;
				a = 0;
				while(1) {
					n = r - (e & 65535) | 0;
					E = n & 65535;
					e = s[t + (a << 1) >> 1] << 16;
					n = n << 16 >> 16;
					if(E << 16 >> 16 > 0) E = E << 16 >> 16 < 31 ? e >> n : 0;
					else {
						N = 0 - n << 16 >> 16;
						E = e << N;
						E = (E >> N | 0) == (e | 0) ? E : e >> 31 ^ 2147483647
					}
					Yn(E, p + (a << 1) | 0, v + (a << 1) | 0, w);
					E = a + 1 | 0;
					if((E | 0) == 5) break;
					e = i[S + (E << 1) >> 1] | 0;
					a = E
				}
				N = m << 16 >> 16;
				M = i[p >> 1] | 0;
				g = i[v >> 1] | 0;
				R = i[p + 2 >> 1] | 0;
				y = i[v + 2 >> 1] | 0;
				O = i[p + 4 >> 1] | 0;
				A = i[v + 4 >> 1] | 0;
				T = i[p + 6 >> 1] | 0;
				D = i[v + 6 >> 1] | 0;
				F = i[p + 8 >> 1] | 0;
				_ = i[v + 8 >> 1] | 0;
				r = 2147483647;
				b = 0;
				E = 0;
				k = C;
				while(1) {
					a = i[k >> 1] | 0;
					if(a << 16 >> 16 > l << 16 >> 16) m = r;
					else {
						m = (ee(i[k + 2 >> 1] | 0, N) | 0) >> 15;
						if((m | 0) > 32767) {
							o[w >> 2] = 1;
							m = 32767
						}
						v = a << 16 >> 16;
						a = ee(v, v) | 0;
						if(a >>> 0 > 1073741823) {
							o[w >> 2] = 1;
							S = 32767
						} else S = a >>> 15;
						n = m << 16 >> 16;
						m = ee(n, n) | 0;
						if(m >>> 0 > 1073741823) {
							o[w >> 2] = 1;
							p = 32767
						} else p = m >>> 15;
						t = (ee(n, v) | 0) >> 15;
						if((t | 0) > 32767) {
							o[w >> 2] = 1;
							t = 32767
						}
						m = S << 16 >> 16;
						S = ee(M, m) | 0;
						if((S | 0) == 1073741824) {
							o[w >> 2] = 1;
							a = 2147483647
						} else a = S << 1;
						m = (ee(g, m) | 0) >> 15;
						S = a + (m << 1) | 0;
						if((a ^ m | 0) > 0 & (S ^ a | 0) < 0) {
							o[w >> 2] = 1;
							S = (a >>> 31) + 2147483647 | 0
						}
						m = ee(R, v) | 0;
						if((m | 0) == 1073741824) {
							o[w >> 2] = 1;
							a = 2147483647
						} else a = m << 1;
						v = (ee(y, v) | 0) >> 15;
						m = a + (v << 1) | 0;
						if((a ^ v | 0) > 0 & (m ^ a | 0) < 0) {
							o[w >> 2] = 1;
							m = (a >>> 31) + 2147483647 | 0
						}
						a = m + S | 0;
						if((m ^ S | 0) > -1 & (a ^ S | 0) < 0) {
							o[w >> 2] = 1;
							a = (S >>> 31) + 2147483647 | 0
						}
						m = p << 16 >> 16;
						S = ee(O, m) | 0;
						if((S | 0) == 1073741824) {
							o[w >> 2] = 1;
							e = 2147483647
						} else e = S << 1;
						v = (ee(A, m) | 0) >> 15;
						S = e + (v << 1) | 0;
						if((e ^ v | 0) > 0 & (S ^ e | 0) < 0) {
							o[w >> 2] = 1;
							S = (e >>> 31) + 2147483647 | 0
						}
						m = S + a | 0;
						if((S ^ a | 0) > -1 & (m ^ a | 0) < 0) {
							o[w >> 2] = 1;
							e = (a >>> 31) + 2147483647 | 0
						} else e = m;
						m = ee(T, n) | 0;
						if((m | 0) == 1073741824) {
							o[w >> 2] = 1;
							S = 2147483647
						} else S = m << 1;
						v = (ee(D, n) | 0) >> 15;
						m = S + (v << 1) | 0;
						if((S ^ v | 0) > 0 & (m ^ S | 0) < 0) {
							o[w >> 2] = 1;
							m = (S >>> 31) + 2147483647 | 0
						}
						a = m + e | 0;
						if((m ^ e | 0) > -1 & (a ^ e | 0) < 0) {
							o[w >> 2] = 1;
							S = (e >>> 31) + 2147483647 | 0
						} else S = a;
						a = t << 16 >> 16;
						m = ee(F, a) | 0;
						if((m | 0) == 1073741824) {
							o[w >> 2] = 1;
							e = 2147483647
						} else e = m << 1;
						v = (ee(_, a) | 0) >> 15;
						m = e + (v << 1) | 0;
						if((e ^ v | 0) > 0 & (m ^ e | 0) < 0) {
							o[w >> 2] = 1;
							a = (e >>> 31) + 2147483647 | 0
						} else a = m;
						m = a + S | 0;
						if((a ^ S | 0) > -1 & (m ^ S | 0) < 0) {
							o[w >> 2] = 1;
							m = (S >>> 31) + 2147483647 | 0
						}
						v = (m | 0) < (r | 0);
						m = v ? m : r;
						E = v ? b : E
					}
					k = k + 8 | 0;
					b = b + 1 << 16 >> 16;
					if((b << 16 >> 16 | 0) >= (I | 0)) break;
					else r = m
				}
				l = E << 16 >> 16;
				l = ((l << 18 >> 18 | 0) == (l | 0) ? l << 2 : l >>> 15 ^ 32767) << 16 >> 16;
				i[f >> 1] = i[C + (l << 1) >> 1] | 0;
				r = i[C + (l + 1 << 1) >> 1] | 0;
				i[d >> 1] = i[C + (l + 2 << 1) >> 1] | 0;
				i[h >> 1] = i[C + (l + 3 << 1) >> 1] | 0;
				r = ee(r << 16 >> 16, N) | 0;
				if((r | 0) == 1073741824) {
					o[w >> 2] = 1;
					e = 2147483647
				} else e = r << 1;
				n = 10 - P | 0;
				r = n & 65535;
				n = n << 16 >> 16;
				if(r << 16 >> 16 > 0) {
					w = r << 16 >> 16 < 31 ? e >> n : 0;
					w = w >>> 16;
					w = w & 65535;
					i[u >> 1] = w;
					c = B;
					return E | 0
				} else {
					d = 0 - n << 16 >> 16;
					w = e << d;
					w = (w >> d | 0) == (e | 0) ? w : e >> 31 ^ 2147483647;
					w = w >>> 16;
					w = w & 65535;
					i[u >> 1] = w;
					c = B;
					return E | 0
				}
				return 0
			}

			function vt(e, r, n, t, o, a, l, f, u) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				var d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0,
					C = 0,
					I = 0,
					B = 0,
					L = 0,
					U = 0,
					x = 0,
					H = 0,
					z = 0,
					j = 0,
					Y = 0,
					V = 0,
					q = 0,
					K = 0,
					W = 0,
					X = 0,
					G = 0,
					J = 0,
					Z = 0,
					Q = 0,
					$ = 0,
					re = 0,
					ne = 0,
					te = 0,
					ie = 0,
					oe = 0,
					ae = 0,
					se = 0,
					le = 0,
					fe = 0,
					ue = 0,
					ce = 0,
					de = 0,
					he = 0,
					Ee = 0,
					we = 0,
					me = 0,
					Se = 0,
					pe = 0,
					ve = 0,
					_e = 0,
					be = 0,
					ke = 0;
				ke = c;
				c = c + 160 | 0;
				be = ke;
				h = e << 16 >> 16;
				ve = e << 16 >> 16 == 10;
				_e = i[l + (i[a >> 1] << 1) >> 1] | 0;
				if(e << 16 >> 16 > 0) {
					u = 0;
					d = f;
					while(1) {
						i[d >> 1] = u;
						u = u + 1 << 16 >> 16;
						if(u << 16 >> 16 >= e << 16 >> 16) break;
						else d = d + 2 | 0
					}
				}
				if(n << 16 >> 16 <= 1) {
					c = ke;
					return
				}
				Se = a + 2 | 0;
				pe = _e << 16 >> 16;
				Ee = t + (pe << 1) | 0;
				we = o + (pe * 80 | 0) + (pe << 1) | 0;
				me = a + 6 | 0;
				G = r & 65535;
				J = a + 4 | 0;
				Z = a + 10 | 0;
				Q = a + 8 | 0;
				$ = a + 14 | 0;
				re = a + 12 | 0;
				ne = a + 18 | 0;
				te = a + 16 | 0;
				ie = f + 2 | 0;
				oe = f + 4 | 0;
				ae = f + 6 | 0;
				se = f + 8 | 0;
				le = f + 10 | 0;
				fe = f + 12 | 0;
				ue = f + 14 | 0;
				ce = f + 16 | 0;
				de = f + 18 | 0;
				he = e << 16 >> 16 > 2;
				W = a + (h + -1 << 1) | 0;
				q = 1;
				X = 1;
				x = 0;
				H = 0;
				K = -1;
				while(1) {
					V = i[l + (i[Se >> 1] << 1) >> 1] | 0;
					Y = V << 16 >> 16;
					r = (s[t + (Y << 1) >> 1] | 0) + (s[Ee >> 1] | 0) | 0;
					d = (i[o + (pe * 80 | 0) + (Y << 1) >> 1] << 13) + 32768 + ((i[o + (Y * 80 | 0) + (Y << 1) >> 1] | 0) + (i[we >> 1] | 0) << 12) | 0;
					h = i[me >> 1] | 0;
					if(h << 16 >> 16 < 40) {
						h = h << 16 >> 16;
						E = be;
						while(1) {
							z = (i[o + (h * 80 | 0) + (h << 1) >> 1] | 0) >>> 1;
							U = i[o + (h * 80 | 0) + (pe << 1) >> 1] | 0;
							j = i[o + (h * 80 | 0) + (Y << 1) >> 1] | 0;
							i[E >> 1] = r + (s[t + (h << 1) >> 1] | 0);
							i[E + 2 >> 1] = (U + 2 + z + j | 0) >>> 2;
							h = h + G | 0;
							if((h & 65535) << 16 >> 16 < 40) {
								h = h << 16 >> 16;
								E = E + 4 | 0
							} else break
						}
						y = i[me >> 1] | 0
					} else y = h;
					r = i[J >> 1] | 0;
					R = d >> 12;
					h = r << 16 >> 16;
					e: do
						if(r << 16 >> 16 < 40) {
							g = y << 16 >> 16;
							if(y << 16 >> 16 < 40) {
								E = 1;
								m = r;
								p = y;
								S = 0;
								w = -1
							} else
								while(1) {
									h = h + G | 0;
									if((h & 65535) << 16 >> 16 < 40) h = h << 16 >> 16;
									else {
										E = 1;
										j = r;
										z = y;
										h = 0;
										break e
									}
								}
							while(1) {
								M = ((i[o + (h * 80 | 0) + (h << 1) >> 1] | 0) + R >> 1) + (i[o + (h * 80 | 0) + (pe << 1) >> 1] | 0) + (i[o + (h * 80 | 0) + (Y << 1) >> 1] | 0) | 0;
								F = s[t + (h << 1) >> 1] | 0;
								b = g;
								k = y;
								_ = be;
								v = S;
								while(1) {
									d = (s[_ >> 1] | 0) + F | 0;
									u = d << 16 >> 16;
									u = (ee(u, u) | 0) >>> 15;
									S = (M + (i[o + (h * 80 | 0) + (b << 1) >> 1] | 0) >> 2) + (i[_ + 2 >> 1] | 0) >> 1;
									if((ee(u << 16 >> 16, E << 16 >> 16) | 0) > (ee(S, w << 16 >> 16) | 0)) {
										E = S & 65535;
										m = r;
										p = k;
										S = d & 65535;
										w = u & 65535
									} else S = v;
									d = b + G | 0;
									k = d & 65535;
									if(k << 16 >> 16 >= 40) break;
									else {
										b = d << 16 >> 16;
										_ = _ + 4 | 0;
										v = S
									}
								}
								h = h + G | 0;
								r = h & 65535;
								if(r << 16 >> 16 < 40) h = h << 16 >> 16;
								else {
									j = m;
									z = p;
									h = S;
									break
								}
							}
						} else {
							E = 1;
							j = r;
							z = y;
							h = 0
						}
					while(0);
					m = E << 16 >> 16 << 15;
					E = i[Z >> 1] | 0;
					if(E << 16 >> 16 < 40) {
						d = j << 16 >> 16;
						u = z << 16 >> 16;
						r = h & 65535;
						E = E << 16 >> 16;
						h = be;
						while(1) {
							I = i[o + (E * 80 | 0) + (E << 1) >> 1] >> 1;
							C = i[o + (E * 80 | 0) + (pe << 1) >> 1] | 0;
							B = i[o + (E * 80 | 0) + (Y << 1) >> 1] | 0;
							L = i[o + (E * 80 | 0) + (d << 1) >> 1] | 0;
							U = i[o + (E * 80 | 0) + (u << 1) >> 1] | 0;
							i[h >> 1] = (s[t + (E << 1) >> 1] | 0) + r;
							i[h + 2 >> 1] = (C + 2 + I + B + L + U | 0) >>> 2;
							E = E + G | 0;
							if((E & 65535) << 16 >> 16 < 40) {
								E = E << 16 >> 16;
								h = h + 4 | 0
							} else break
						}
						I = i[Z >> 1] | 0
					} else I = E;
					w = i[Q >> 1] | 0;
					E = w << 16 >> 16;
					e: do
						if(w << 16 >> 16 < 40) {
							O = j << 16 >> 16;
							A = z << 16 >> 16;
							T = I << 16 >> 16;
							y = m + 32768 | 0;
							if(I << 16 >> 16 < 40) {
								S = 1;
								m = w;
								r = I;
								p = w;
								h = 0;
								w = -1
							} else
								while(1) {
									E = E + G | 0;
									if((E & 65535) << 16 >> 16 < 40) E = E << 16 >> 16;
									else {
										E = 1;
										U = w;
										L = I;
										h = 0;
										break e
									}
								}
							while(1) {
								u = s[t + (E << 1) >> 1] | 0;
								R = (i[o + (E * 80 | 0) + (Y << 1) >> 1] | 0) + (i[o + (E * 80 | 0) + (pe << 1) >> 1] | 0) + (i[o + (E * 80 | 0) + (O << 1) >> 1] | 0) + (i[o + (E * 80 | 0) + (A << 1) >> 1] | 0) | 0;
								g = y + (i[o + (E * 80 | 0) + (E << 1) >> 1] << 11) | 0;
								F = T;
								b = I;
								M = be;
								while(1) {
									v = (s[M >> 1] | 0) + u | 0;
									d = g + (i[M + 2 >> 1] << 14) + (R + (i[o + (E * 80 | 0) + (F << 1) >> 1] | 0) << 12) | 0;
									_ = v << 16 >> 16;
									_ = (ee(_, _) | 0) >>> 15;
									if((ee(_ << 16 >> 16, S << 16 >> 16) | 0) > (ee(d >> 16, w << 16 >> 16) | 0)) {
										S = d >>> 16 & 65535;
										k = p;
										r = b;
										h = v & 65535;
										w = _ & 65535
									} else k = m;
									m = F + G | 0;
									b = m & 65535;
									if(b << 16 >> 16 >= 40) {
										m = k;
										break
									} else {
										F = m << 16 >> 16;
										m = k;
										M = M + 4 | 0
									}
								}
								E = E + G | 0;
								p = E & 65535;
								if(p << 16 >> 16 < 40) E = E << 16 >> 16;
								else {
									E = S;
									U = m;
									L = r;
									break
								}
							}
						} else {
							E = 1;
							U = w;
							L = I;
							h = 0
						}
					while(0);
					S = E << 16 >> 16 << 15;
					E = i[$ >> 1] | 0;
					if(E << 16 >> 16 < 40) {
						d = j << 16 >> 16;
						u = z << 16 >> 16;
						w = U << 16 >> 16;
						m = L << 16 >> 16;
						r = h & 65535;
						E = E << 16 >> 16;
						h = be;
						while(1) {
							D = i[o + (E * 80 | 0) + (E << 1) >> 1] >> 1;
							T = i[o + (pe * 80 | 0) + (E << 1) >> 1] | 0;
							N = i[o + (Y * 80 | 0) + (E << 1) >> 1] | 0;
							P = i[o + (d * 80 | 0) + (E << 1) >> 1] | 0;
							C = i[o + (u * 80 | 0) + (E << 1) >> 1] | 0;
							I = i[o + (w * 80 | 0) + (E << 1) >> 1] | 0;
							B = i[o + (m * 80 | 0) + (E << 1) >> 1] | 0;
							i[h >> 1] = (s[t + (E << 1) >> 1] | 0) + r;
							i[h + 2 >> 1] = (T + 4 + D + N + P + C + I + B | 0) >>> 3;
							E = E + G | 0;
							if((E & 65535) << 16 >> 16 < 40) {
								E = E << 16 >> 16;
								h = h + 4 | 0
							} else break
						}
						r = i[$ >> 1] | 0
					} else r = E;
					p = i[re >> 1] | 0;
					if(p << 16 >> 16 < 40) {
						I = j << 16 >> 16;
						D = z << 16 >> 16;
						T = U << 16 >> 16;
						A = L << 16 >> 16;
						O = r << 16 >> 16;
						y = r << 16 >> 16 < 40;
						N = S + 32768 | 0;
						C = p << 16 >> 16;
						u = 1;
						k = p;
						b = r;
						P = p;
						m = 0;
						E = -1;
						while(1) {
							if(y) {
								S = s[t + (C << 1) >> 1] | 0;
								h = (i[o + (C * 80 | 0) + (Y << 1) >> 1] | 0) + (i[o + (C * 80 | 0) + (pe << 1) >> 1] | 0) + (i[o + (C * 80 | 0) + (I << 1) >> 1] | 0) + (i[o + (C * 80 | 0) + (D << 1) >> 1] | 0) + (i[o + (C * 80 | 0) + (T << 1) >> 1] | 0) + (i[o + (C * 80 | 0) + (A << 1) >> 1] | 0) | 0;
								w = N + (i[o + (C * 80 | 0) + (C << 1) >> 1] << 10) | 0;
								_ = O;
								p = r;
								g = b;
								R = be;
								while(1) {
									M = (s[R >> 1] | 0) + S | 0;
									b = w + (i[R + 2 >> 1] << 14) + (h + (i[o + (C * 80 | 0) + (_ << 1) >> 1] | 0) << 11) | 0;
									F = M << 16 >> 16;
									F = (ee(F, F) | 0) >>> 15;
									if((ee(F << 16 >> 16, u << 16 >> 16) | 0) > (ee(b >> 16, E << 16 >> 16) | 0)) {
										u = b >>> 16 & 65535;
										k = P;
										b = p;
										m = M & 65535;
										E = F & 65535
									} else b = g;
									v = _ + G | 0;
									p = v & 65535;
									if(p << 16 >> 16 >= 40) break;
									else {
										_ = v << 16 >> 16;
										g = b;
										R = R + 4 | 0
									}
								}
							}
							p = C + G | 0;
							P = p & 65535;
							if(P << 16 >> 16 >= 40) {
								B = b;
								break
							} else C = p << 16 >> 16
						}
					} else {
						u = 1;
						k = p;
						B = r;
						m = 0;
						E = -1
					}
					if(ve) {
						_ = u << 16 >> 16 << 15;
						E = i[ne >> 1] | 0;
						if(E << 16 >> 16 < 40) {
							h = j << 16 >> 16;
							r = z << 16 >> 16;
							d = U << 16 >> 16;
							u = L << 16 >> 16;
							S = k << 16 >> 16;
							p = B << 16 >> 16;
							w = m & 65535;
							E = E << 16 >> 16;
							m = be;
							while(1) {
								T = i[o + (E * 80 | 0) + (E << 1) >> 1] >> 1;
								A = i[o + (pe * 80 | 0) + (E << 1) >> 1] | 0;
								D = i[o + (Y * 80 | 0) + (E << 1) >> 1] | 0;
								N = i[o + (h * 80 | 0) + (E << 1) >> 1] | 0;
								P = i[o + (r * 80 | 0) + (E << 1) >> 1] | 0;
								C = i[o + (d * 80 | 0) + (E << 1) >> 1] | 0;
								I = i[o + (u * 80 | 0) + (E << 1) >> 1] | 0;
								x = i[o + (S * 80 | 0) + (E << 1) >> 1] | 0;
								H = i[o + (p * 80 | 0) + (E << 1) >> 1] | 0;
								i[m >> 1] = (s[t + (E << 1) >> 1] | 0) + w;
								i[m + 2 >> 1] = (A + 4 + T + D + N + P + C + I + x + H | 0) >>> 3;
								E = E + G | 0;
								if((E & 65535) << 16 >> 16 < 40) {
									E = E << 16 >> 16;
									m = m + 4 | 0
								} else break
							}
							I = i[ne >> 1] | 0
						} else I = E;
						S = i[te >> 1] | 0;
						if(S << 16 >> 16 < 40) {
							T = j << 16 >> 16;
							A = z << 16 >> 16;
							O = U << 16 >> 16;
							d = L << 16 >> 16;
							D = k << 16 >> 16;
							N = B << 16 >> 16;
							P = I << 16 >> 16;
							C = I << 16 >> 16 < 40;
							y = _ + 32768 | 0;
							h = S << 16 >> 16;
							u = 1;
							p = S;
							m = I;
							r = S;
							E = -1;
							while(1) {
								if(C) {
									_ = s[t + (h << 1) >> 1] | 0;
									w = (i[o + (Y * 80 | 0) + (h << 1) >> 1] | 0) + (i[o + (pe * 80 | 0) + (h << 1) >> 1] | 0) + (i[o + (T * 80 | 0) + (h << 1) >> 1] | 0) + (i[o + (A * 80 | 0) + (h << 1) >> 1] | 0) + (i[o + (O * 80 | 0) + (h << 1) >> 1] | 0) + (i[o + (d * 80 | 0) + (h << 1) >> 1] | 0) + (i[o + (D * 80 | 0) + (h << 1) >> 1] | 0) + (i[o + (N * 80 | 0) + (h << 1) >> 1] | 0) | 0;
									S = y + (i[o + (h * 80 | 0) + (h << 1) >> 1] << 9) | 0;
									R = P;
									F = I;
									g = be;
									while(1) {
										M = (s[g >> 1] | 0) + _ << 16 >> 16;
										M = (ee(M, M) | 0) >>> 15;
										b = S + (i[g + 2 >> 1] << 13) + (w + (i[o + (h * 80 | 0) + (R << 1) >> 1] | 0) << 10) | 0;
										if((ee(M << 16 >> 16, u << 16 >> 16) | 0) > (ee(b >> 16, E << 16 >> 16) | 0)) {
											u = b >>> 16 & 65535;
											p = r;
											m = F;
											E = M & 65535
										}
										v = R + G | 0;
										F = v & 65535;
										if(F << 16 >> 16 >= 40) break;
										else {
											R = v << 16 >> 16;
											g = g + 4 | 0
										}
									}
								}
								S = h + G | 0;
								r = S & 65535;
								if(r << 16 >> 16 >= 40) break;
								else h = S << 16 >> 16
							}
						} else {
							u = 1;
							p = S;
							m = I;
							E = -1
						}
					} else {
						p = x;
						m = H
					}
					if((ee(E << 16 >> 16, q << 16 >> 16) | 0) > (ee(u << 16 >> 16, K << 16 >> 16) | 0)) {
						i[f >> 1] = _e;
						i[ie >> 1] = V;
						i[oe >> 1] = j;
						i[ae >> 1] = z;
						i[se >> 1] = U;
						i[le >> 1] = L;
						i[fe >> 1] = k;
						i[ue >> 1] = B;
						if(ve) {
							i[ce >> 1] = p;
							i[de >> 1] = m
						}
					} else {
						u = q;
						E = K
					}
					h = i[Se >> 1] | 0;
					if(he) {
						r = 1;
						d = 2;
						while(1) {
							i[a + (r << 1) >> 1] = i[a + (d << 1) >> 1] | 0;
							d = d + 1 | 0;
							if((d & 65535) << 16 >> 16 == e << 16 >> 16) break;
							else r = r + 1 | 0
						}
					}
					i[W >> 1] = h;
					X = X + 1 << 16 >> 16;
					if(X << 16 >> 16 >= n << 16 >> 16) break;
					else {
						q = u;
						x = p;
						H = m;
						K = E
					}
				}
				c = ke;
				return
			}

			function _t(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var o = 0,
					a = 0,
					s = 0,
					l = 0,
					f = 0,
					u = 0;
				l = 39;
				while(1) {
					s = e + (l << 1) | 0;
					a = i[s >> 1] | 0;
					o = r + (l << 1) | 0;
					if(a << 16 >> 16 > -1) i[o >> 1] = 32767;
					else {
						i[o >> 1] = -32767;
						if(a << 16 >> 16 == -32768) a = 32767;
						else a = 0 - (a & 65535) & 65535;
						i[s >> 1] = a
					}
					i[n + (l << 1) >> 1] = a;
					if((l | 0) > 0) l = l + -1 | 0;
					else break
				}
				u = 8 - (t << 16 >> 16) | 0;
				if((u | 0) > 0) {
					f = 0;
					o = 0
				} else return;
				do {
					t = 0;
					e = 0;
					s = 32767;
					while(1) {
						r = i[n + (t << 1) >> 1] | 0;
						l = r << 16 >> 16 > -1 ? r << 16 >> 16 < s << 16 >> 16 : 0;
						o = l ? e : o;
						a = t + 5 | 0;
						e = a & 65535;
						if(e << 16 >> 16 >= 40) break;
						else {
							t = a << 16 >> 16;
							s = l ? r : s
						}
					}
					i[n + (o << 16 >> 16 << 1) >> 1] = -1;
					f = f + 1 << 16 >> 16
				} while ((f << 16 >> 16 | 0) < (u | 0));
				f = 0;
				do {
					r = 1;
					e = 1;
					a = 32767;
					while(1) {
						t = i[n + (r << 1) >> 1] | 0;
						l = t << 16 >> 16 > -1 ? t << 16 >> 16 < a << 16 >> 16 : 0;
						o = l ? e : o;
						s = r + 5 | 0;
						e = s & 65535;
						if(e << 16 >> 16 >= 40) break;
						else {
							r = s << 16 >> 16;
							a = l ? t : a
						}
					}
					i[n + (o << 16 >> 16 << 1) >> 1] = -1;
					f = f + 1 << 16 >> 16
				} while ((f << 16 >> 16 | 0) < (u | 0));
				f = 0;
				do {
					r = 2;
					e = 2;
					a = 32767;
					while(1) {
						t = i[n + (r << 1) >> 1] | 0;
						l = t << 16 >> 16 > -1 ? t << 16 >> 16 < a << 16 >> 16 : 0;
						o = l ? e : o;
						s = r + 5 | 0;
						e = s & 65535;
						if(e << 16 >> 16 >= 40) break;
						else {
							r = s << 16 >> 16;
							a = l ? t : a
						}
					}
					i[n + (o << 16 >> 16 << 1) >> 1] = -1;
					f = f + 1 << 16 >> 16
				} while ((f << 16 >> 16 | 0) < (u | 0));
				f = 0;
				while(1) {
					r = 3;
					e = 3;
					a = 32767;
					while(1) {
						t = i[n + (r << 1) >> 1] | 0;
						l = t << 16 >> 16 > -1 ? t << 16 >> 16 < a << 16 >> 16 : 0;
						o = l ? e : o;
						s = r + 5 | 0;
						e = s & 65535;
						if(e << 16 >> 16 >= 40) {
							a = o;
							break
						} else {
							r = s << 16 >> 16;
							a = l ? t : a
						}
					}
					i[n + (a << 16 >> 16 << 1) >> 1] = -1;
					f = f + 1 << 16 >> 16;
					if((f << 16 >> 16 | 0) >= (u | 0)) {
						o = 0;
						break
					} else o = a
				}
				do {
					r = 4;
					e = 4;
					f = 32767;
					while(1) {
						t = i[n + (r << 1) >> 1] | 0;
						l = t << 16 >> 16 > -1 ? t << 16 >> 16 < f << 16 >> 16 : 0;
						a = l ? e : a;
						s = r + 5 | 0;
						e = s & 65535;
						if(e << 16 >> 16 >= 40) break;
						else {
							r = s << 16 >> 16;
							f = l ? t : f
						}
					}
					i[n + (a << 16 >> 16 << 1) >> 1] = -1;
					o = o + 1 << 16 >> 16
				} while ((o << 16 >> 16 | 0) < (u | 0));
				return
			}

			function bt(e, r, n, t, a, s, l, f) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				f = f | 0;
				var u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0;
				M = c;
				c = c + 80 | 0;
				F = M;
				w = 40;
				m = r;
				S = e;
				d = 256;
				h = 256;
				while(1) {
					u = i[m >> 1] | 0;
					m = m + 2 | 0;
					u = ee(u, u) | 0;
					if((u | 0) != 1073741824) {
						E = (u << 1) + d | 0;
						if((u ^ d | 0) > 0 & (E ^ d | 0) < 0) {
							o[f >> 2] = 1;
							d = (d >>> 31) + 2147483647 | 0
						} else d = E
					} else {
						o[f >> 2] = 1;
						d = 2147483647
					}
					k = i[S >> 1] | 0;
					h = (ee(k << 1, k) | 0) + h | 0;
					w = w + -1 << 16 >> 16;
					if(!(w << 16 >> 16)) break;
					else S = S + 2 | 0
				}
				k = ai(d, f) | 0;
				_ = k << 5;
				k = ((_ >> 5 | 0) == (k | 0) ? _ : k >> 31 ^ 2147418112) >> 16;
				_ = (ai(h, f) | 0) << 5 >> 16;
				b = 39;
				p = r + 78 | 0;
				v = F + 78 | 0;
				u = n + 78 | 0;
				while(1) {
					S = ee(i[p >> 1] | 0, k) | 0;
					p = p + -2 | 0;
					m = S << 1;
					r = e + (b << 1) | 0;
					d = i[r >> 1] | 0;
					w = ee(d << 16 >> 16, _) | 0;
					if((w | 0) != 1073741824) {
						E = (w << 1) + m | 0;
						if((w ^ m | 0) > 0 & (E ^ m | 0) < 0) {
							o[f >> 2] = 1;
							E = (S >>> 30 & 1) + 2147483647 | 0
						}
					} else {
						o[f >> 2] = 1;
						E = 2147483647
					}
					h = E << 10;
					h = Ni((h >> 10 | 0) == (E | 0) ? h : E >> 31 ^ 2147483647, f) | 0;
					if(h << 16 >> 16 > -1) i[u >> 1] = 32767;
					else {
						i[u >> 1] = -32767;
						if(h << 16 >> 16 == -32768) h = 32767;
						else h = 0 - (h & 65535) & 65535;
						if(d << 16 >> 16 == -32768) E = 32767;
						else E = 0 - (d & 65535) & 65535;
						i[r >> 1] = E
					}
					u = u + -2 | 0;
					i[v >> 1] = h;
					if((b | 0) <= 0) break;
					else {
						b = b + -1 | 0;
						v = v + -2 | 0
					}
				}
				r = a << 16 >> 16;
				if(a << 16 >> 16 <= 0) {
					i[s + (r << 1) >> 1] = i[s >> 1] | 0;
					c = M;
					return
				}
				S = l & 65535;
				m = 0;
				w = -1;
				u = 0;
				while(1) {
					if((m | 0) < 40) {
						h = m;
						E = m & 65535;
						d = -1;
						while(1) {
							f = i[F + (h << 1) >> 1] | 0;
							l = f << 16 >> 16 > d << 16 >> 16;
							d = l ? f : d;
							u = l ? E : u;
							h = h + S | 0;
							E = h & 65535;
							if(E << 16 >> 16 >= 40) break;
							else h = h << 16 >> 16
						}
					} else d = -1;
					i[t + (m << 1) >> 1] = u;
					if(d << 16 >> 16 > w << 16 >> 16) i[s >> 1] = m;
					else d = w;
					m = m + 1 | 0;
					if((m & 65535) << 16 >> 16 == a << 16 >> 16) break;
					else w = d
				}
				u = i[s >> 1] | 0;
				i[s + (r << 1) >> 1] = u;
				if(a << 16 >> 16 > 1) d = 1;
				else {
					c = M;
					return
				}
				do {
					t = u + 1 << 16 >> 16;
					u = t << 16 >> 16 >= a << 16 >> 16 ? 0 : t;
					i[s + (d << 1) >> 1] = u;
					i[s + (d + r << 1) >> 1] = u;
					d = d + 1 | 0
				} while ((d & 65535) << 16 >> 16 != a << 16 >> 16);
				c = M;
				return
			}

			function kt(e) {
				e = e | 0;
				var r = 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				o[e >> 2] = 0;
				r = xi(12) | 0;
				if(!r) {
					e = -1;
					return e | 0
				}
				i[r >> 1] = 8;
				o[e >> 2] = r;
				i[r + 2 >> 1] = 3;
				i[r + 4 >> 1] = 0;
				o[r + 8 >> 2] = 0;
				e = 0;
				return e | 0
			}

			function Ft(e) {
				e = e | 0;
				var r = 0;
				if(!e) return;
				r = o[e >> 2] | 0;
				if(!r) return;
				Hi(r);
				o[e >> 2] = 0;
				return
			}

			function Mt(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					a = 0,
					s = 0;
				do
					if((r | 0) == 8) {
						t = e + 2 | 0;
						a = (i[t >> 1] | 0) + -1 << 16 >> 16;
						i[t >> 1] = a;
						r = e + 8 | 0;
						if(!(o[r >> 2] | 0)) {
							o[n >> 2] = 1;
							i[t >> 1] = 3;
							break
						}
						s = e + 4 | 0;
						if(a << 16 >> 16 > 2 & (i[s >> 1] | 0) > 0) {
							o[n >> 2] = 2;
							i[s >> 1] = (i[s >> 1] | 0) + -1 << 16 >> 16;
							break
						}
						if(!(a << 16 >> 16)) {
							o[n >> 2] = 2;
							i[t >> 1] = i[e >> 1] | 0;
							break
						} else {
							o[n >> 2] = 3;
							break
						}
					} else {
						i[e + 2 >> 1] = i[e >> 1] | 0;
						o[n >> 2] = 0;
						r = e + 8 | 0
					}
				while(0);
				o[r >> 2] = o[n >> 2];
				return
			}

			function gt(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					i = 0,
					a = 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				o[e >> 2] = 0;
				n = xi(12) | 0;
				t = n;
				if(!n) {
					e = -1;
					return e | 0
				}
				o[n >> 2] = 0;
				i = n + 4 | 0;
				o[i >> 2] = 0;
				a = n + 8 | 0;
				o[a >> 2] = r;
				if((st(n) | 0) << 16 >> 16 == 0 ? (tn(i, o[a >> 2] | 0) | 0) << 16 >> 16 == 0 : 0) {
					lt(o[n >> 2] | 0) | 0;
					an(o[i >> 2] | 0) | 0;
					o[e >> 2] = t;
					e = 0;
					return e | 0
				}
				ft(n);
				on(i);
				Hi(n);
				e = -1;
				return e | 0
			}

			function Rt(e) {
				e = e | 0;
				var r = 0;
				if(!e) return;
				r = o[e >> 2] | 0;
				if(!r) return;
				ft(r);
				on((o[e >> 2] | 0) + 4 | 0);
				Hi(o[e >> 2] | 0);
				o[e >> 2] = 0;
				return
			}

			function yt(e, r, n, t, a) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				var l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0;
				d = c;
				c = c + 448 | 0;
				f = d + 320 | 0;
				u = d;
				Ki(t | 0, 0, 488) | 0;
				l = 0;
				do {
					h = n + (l << 1) | 0;
					i[h >> 1] = (s[h >> 1] | 0) & 65528;
					l = l + 1 | 0
				} while ((l | 0) != 160);
				ut(o[e >> 2] | 0, n, 160);
				h = e + 4 | 0;
				sn(o[h >> 2] | 0, r, n, f, a, u) | 0;
				ct(o[a >> 2] | 0, f, t, (o[h >> 2] | 0) + 2392 | 0);
				c = d;
				return
			}

			function Ot(e, r, n, t, o, a, s, l, f, u, d, h, E, w, m, S) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				d = d | 0;
				h = h | 0;
				E = E | 0;
				w = w | 0;
				m = m | 0;
				S = S | 0;
				var p = 0,
					v = 0,
					_ = 0;
				_ = c;
				c = c + 48 | 0;
				p = _ + 22 | 0;
				v = _;
				Ui(o, (e & -2 | 0) == 6 ? n : r, p);
				Ui(o, t, v);
				n = d;
				r = p;
				o = n + 22 | 0;
				do {
					i[n >> 1] = i[r >> 1] | 0;
					n = n + 2 | 0;
					r = r + 2 | 0
				} while ((n | 0) < (o | 0));
				Li(a, d, E, 40, u, 0);
				Li(v, E, E, 40, u, 0);
				Di(a, s, m, 40);
				n = h;
				r = m;
				o = n + 80 | 0;
				do {
					i[n >> 1] = i[r >> 1] | 0;
					n = n + 2 | 0;
					r = r + 2 | 0
				} while ((n | 0) < (o | 0));
				Li(a, h, S, 40, l, 0);
				Di(p, S, w, 40);
				Li(v, w, w, 40, f, 0);
				c = _;
				return
			}

			function At(e, r, n, t, o, a, l, f, u, c, d, h, E, w, m, S, p) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				c = c | 0;
				d = d | 0;
				h = h | 0;
				E = E | 0;
				w = w | 0;
				m = m | 0;
				S = S | 0;
				p = p | 0;
				var v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0;
				if((r | 0) == 7) {
					b = 11;
					r = t << 16 >> 16 >>> 1 & 65535;
					v = 2
				} else {
					b = 13;
					r = t;
					v = 1
				}
				i[S >> 1] = t << 16 >> 16 < 13017 ? t : 13017;
				_ = n << 16 >> 16;
				m = m + (_ << 1) | 0;
				S = r << 16 >> 16;
				o = o << 16 >> 16;
				n = 20;
				r = u;
				p = m;
				while(1) {
					u = p + 2 | 0;
					F = ee(i[p >> 1] | 0, S) | 0;
					k = ee(i[u >> 1] | 0, S) | 0;
					F = (ee(i[r >> 1] | 0, o) | 0) + F << 1;
					k = (ee(i[r + 2 >> 1] | 0, o) | 0) + k << 1 << v;
					i[p >> 1] = ((F << v) + 32768 | 0) >>> 16;
					i[u >> 1] = (k + 32768 | 0) >>> 16;
					n = n + -1 << 16 >> 16;
					if(!(n << 16 >> 16)) break;
					else {
						r = r + 4 | 0;
						p = p + 4 | 0
					}
				}
				r = t << 16 >> 16;
				Li(a, m, l + (_ << 1) | 0, 40, h, 1);
				n = 30;
				p = 0;
				while(1) {
					k = n + _ | 0;
					i[E + (p << 1) >> 1] = (s[e + (k << 1) >> 1] | 0) - (s[l + (k << 1) >> 1] | 0);
					k = ee(i[c + (n << 1) >> 1] | 0, r) | 0;
					F = (ee(i[d + (n << 1) >> 1] | 0, o) | 0) >> b;
					i[w + (p << 1) >> 1] = (s[f + (n << 1) >> 1] | 0) - (k >>> 14) - F;
					p = p + 1 | 0;
					if((p | 0) == 10) break;
					else n = n + 1 | 0
				}
				return
			}

			function Tt(e) {
				e = e | 0;
				var r = 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				o[e >> 2] = 0;
				r = xi(16) | 0;
				if(!r) {
					e = -1;
					return e | 0
				}
				i[r >> 1] = 0;
				i[r + 2 >> 1] = 0;
				i[r + 4 >> 1] = 0;
				i[r + 6 >> 1] = 0;
				i[r + 8 >> 1] = 0;
				i[r + 10 >> 1] = 0;
				i[r + 12 >> 1] = 0;
				i[r + 14 >> 1] = 0;
				o[e >> 2] = r;
				e = 0;
				return e | 0
			}

			function Dt(e) {
				e = e | 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				i[e >> 1] = 0;
				i[e + 2 >> 1] = 0;
				i[e + 4 >> 1] = 0;
				i[e + 6 >> 1] = 0;
				i[e + 8 >> 1] = 0;
				i[e + 10 >> 1] = 0;
				i[e + 12 >> 1] = 0;
				i[e + 14 >> 1] = 0;
				e = 0;
				return e | 0
			}

			function Nt(e) {
				e = e | 0;
				var r = 0;
				if(!e) return;
				r = o[e >> 2] | 0;
				if(!r) return;
				Hi(r);
				o[e >> 2] = 0;
				return
			}

			function Pt(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					o = 0,
					a = 0,
					l = 0;
				t = s[r + 6 >> 1] | 0;
				n = s[r + 8 >> 1] | 0;
				o = t - n | 0;
				o = (o & 65535 | 0) != 32767 ? o & 65535 : 32767;
				a = s[r + 10 >> 1] | 0;
				n = n - a | 0;
				o = (n << 16 >> 16 | 0) < (o << 16 >> 16 | 0) ? n & 65535 : o;
				n = s[r + 12 >> 1] | 0;
				a = a - n | 0;
				o = (a << 16 >> 16 | 0) < (o << 16 >> 16 | 0) ? a & 65535 : o;
				a = s[r + 14 >> 1] | 0;
				n = n - a | 0;
				o = (n << 16 >> 16 | 0) < (o << 16 >> 16 | 0) ? n & 65535 : o;
				a = a - (s[r + 16 >> 1] | 0) | 0;
				n = i[r + 2 >> 1] | 0;
				l = s[r + 4 >> 1] | 0;
				r = (n & 65535) - l | 0;
				r = (r & 65535 | 0) != 32767 ? r & 65535 : 32767;
				t = l - t | 0;
				if(((a << 16 >> 16 | 0) < (o << 16 >> 16 | 0) ? a & 65535 : o) << 16 >> 16 < 1500 ? 1 : (((t << 16 >> 16 | 0) < (r << 16 >> 16 | 0) ? t & 65535 : r) << 16 >> 16 | 0) < ((n << 16 >> 16 > 32e3 ? 600 : n << 16 >> 16 > 30500 ? 800 : 1100) | 0)) {
					a = (i[e >> 1] | 0) + 1 << 16 >> 16;
					l = a << 16 >> 16 > 11;
					i[e >> 1] = l ? 12 : a;
					return l & 1 | 0
				} else {
					i[e >> 1] = 0;
					return 0
				}
				return 0
			}

			function Ct(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				r = Pi(r, 3, n) | 0;
				r = Wt(r, i[e + 2 >> 1] | 0, n) | 0;
				r = Wt(r, i[e + 4 >> 1] | 0, n) | 0;
				r = Wt(r, i[e + 6 >> 1] | 0, n) | 0;
				r = Wt(r, i[e + 8 >> 1] | 0, n) | 0;
				r = Wt(r, i[e + 10 >> 1] | 0, n) | 0;
				r = Wt(r, i[e + 12 >> 1] | 0, n) | 0;
				return(Wt(r, i[e + 14 >> 1] | 0, n) | 0) << 16 >> 16 > 15565 | 0
			}

			function It(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0;
				n = e + 4 | 0;
				i[e + 2 >> 1] = i[n >> 1] | 0;
				t = e + 6 | 0;
				i[n >> 1] = i[t >> 1] | 0;
				n = e + 8 | 0;
				i[t >> 1] = i[n >> 1] | 0;
				t = e + 10 | 0;
				i[n >> 1] = i[t >> 1] | 0;
				n = e + 12 | 0;
				i[t >> 1] = i[n >> 1] | 0;
				e = e + 14 | 0;
				i[n >> 1] = i[e >> 1] | 0;
				i[e >> 1] = r << 16 >> 16 >>> 3;
				return
			}

			function Bt(e) {
				e = e | 0;
				var r = 0,
					n = 0,
					t = 0;
				if(!e) {
					t = -1;
					return t | 0
				}
				o[e >> 2] = 0;
				r = xi(128) | 0;
				if(!r) {
					t = -1;
					return t | 0
				}
				n = r + 72 | 0;
				t = n + 46 | 0;
				do {
					i[n >> 1] = 0;
					n = n + 2 | 0
				} while ((n | 0) < (t | 0));
				i[r >> 1] = 150;
				i[r + 36 >> 1] = 150;
				i[r + 18 >> 1] = 150;
				i[r + 54 >> 1] = 0;
				i[r + 2 >> 1] = 150;
				i[r + 38 >> 1] = 150;
				i[r + 20 >> 1] = 150;
				i[r + 56 >> 1] = 0;
				i[r + 4 >> 1] = 150;
				i[r + 40 >> 1] = 150;
				i[r + 22 >> 1] = 150;
				i[r + 58 >> 1] = 0;
				i[r + 6 >> 1] = 150;
				i[r + 42 >> 1] = 150;
				i[r + 24 >> 1] = 150;
				i[r + 60 >> 1] = 0;
				i[r + 8 >> 1] = 150;
				i[r + 44 >> 1] = 150;
				i[r + 26 >> 1] = 150;
				i[r + 62 >> 1] = 0;
				i[r + 10 >> 1] = 150;
				i[r + 46 >> 1] = 150;
				i[r + 28 >> 1] = 150;
				i[r + 64 >> 1] = 0;
				i[r + 12 >> 1] = 150;
				i[r + 48 >> 1] = 150;
				i[r + 30 >> 1] = 150;
				i[r + 66 >> 1] = 0;
				i[r + 14 >> 1] = 150;
				i[r + 50 >> 1] = 150;
				i[r + 32 >> 1] = 150;
				i[r + 68 >> 1] = 0;
				i[r + 16 >> 1] = 150;
				i[r + 52 >> 1] = 150;
				i[r + 34 >> 1] = 150;
				i[r + 70 >> 1] = 0;
				i[r + 118 >> 1] = 13106;
				i[r + 120 >> 1] = 0;
				i[r + 122 >> 1] = 0;
				i[r + 124 >> 1] = 0;
				i[r + 126 >> 1] = 13106;
				o[e >> 2] = r;
				t = 0;
				return t | 0
			}

			function Lt(e) {
				e = e | 0;
				var r = 0,
					n = 0;
				if(!e) {
					n = -1;
					return n | 0
				}
				r = e + 72 | 0;
				n = r + 46 | 0;
				do {
					i[r >> 1] = 0;
					r = r + 2 | 0
				} while ((r | 0) < (n | 0));
				i[e >> 1] = 150;
				i[e + 36 >> 1] = 150;
				i[e + 18 >> 1] = 150;
				i[e + 54 >> 1] = 0;
				i[e + 2 >> 1] = 150;
				i[e + 38 >> 1] = 150;
				i[e + 20 >> 1] = 150;
				i[e + 56 >> 1] = 0;
				i[e + 4 >> 1] = 150;
				i[e + 40 >> 1] = 150;
				i[e + 22 >> 1] = 150;
				i[e + 58 >> 1] = 0;
				i[e + 6 >> 1] = 150;
				i[e + 42 >> 1] = 150;
				i[e + 24 >> 1] = 150;
				i[e + 60 >> 1] = 0;
				i[e + 8 >> 1] = 150;
				i[e + 44 >> 1] = 150;
				i[e + 26 >> 1] = 150;
				i[e + 62 >> 1] = 0;
				i[e + 10 >> 1] = 150;
				i[e + 46 >> 1] = 150;
				i[e + 28 >> 1] = 150;
				i[e + 64 >> 1] = 0;
				i[e + 12 >> 1] = 150;
				i[e + 48 >> 1] = 150;
				i[e + 30 >> 1] = 150;
				i[e + 66 >> 1] = 0;
				i[e + 14 >> 1] = 150;
				i[e + 50 >> 1] = 150;
				i[e + 32 >> 1] = 150;
				i[e + 68 >> 1] = 0;
				i[e + 16 >> 1] = 150;
				i[e + 52 >> 1] = 150;
				i[e + 34 >> 1] = 150;
				i[e + 70 >> 1] = 0;
				i[e + 118 >> 1] = 13106;
				i[e + 120 >> 1] = 0;
				i[e + 122 >> 1] = 0;
				i[e + 124 >> 1] = 0;
				i[e + 126 >> 1] = 13106;
				n = 0;
				return n | 0
			}

			function Ut(e) {
				e = e | 0;
				var r = 0;
				if(!e) return;
				r = o[e >> 2] | 0;
				if(!r) return;
				Hi(r);
				o[e >> 2] = 0;
				return
			}

			function xt(e, r) {
				e = e | 0;
				r = r | 0;
				i[e + 118 >> 1] = r;
				return
			}

			function Ht(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var a = 0;
				n = Ni(n, t) | 0;
				if(n << 16 >> 16 <= 0) return;
				n = n << 16 >> 16;
				if((n * 21298 | 0) == 1073741824) {
					o[t >> 2] = 1;
					a = 2147483647
				} else a = n * 42596 | 0;
				n = r - a | 0;
				if(((n ^ r) & (a ^ r) | 0) < 0) {
					o[t >> 2] = 1;
					n = (r >>> 31) + 2147483647 | 0
				}
				if((n | 0) <= 0) return;
				e = e + 104 | 0;
				i[e >> 1] = s[e >> 1] | 0 | 16384;
				return
			}

			function zt(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0;
				e = e + 104 | 0;
				t = Pi(i[e >> 1] | 0, 1, n) | 0;
				i[e >> 1] = t;
				if(!(r << 16 >> 16)) return;
				i[e >> 1] = (Pi(t, 1, n) | 0) & 65535 | 8192;
				return
			}

			function jt(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					o = 0,
					a = 0;
				o = e + 112 | 0;
				t = Bi(i[o >> 1] | 0, i[r >> 1] | 0, n) | 0;
				t = (t & 65535) - ((t & 65535) >>> 15 & 65535) | 0;
				t = ((t << 16 >> 31 ^ t) & 65535) << 16 >> 16 < 4;
				a = i[r >> 1] | 0;
				i[o >> 1] = a;
				r = r + 2 | 0;
				a = Bi(a, i[r >> 1] | 0, n) | 0;
				a = (a & 65535) - ((a & 65535) >>> 15 & 65535) | 0;
				t = ((a << 16 >> 31 ^ a) & 65535) << 16 >> 16 < 4 ? t ? 2 : 1 : t & 1;
				i[o >> 1] = i[r >> 1] | 0;
				o = e + 102 | 0;
				i[o >> 1] = Pi(i[o >> 1] | 0, 1, n) | 0;
				r = e + 110 | 0;
				if((Wt(i[r >> 1] | 0, t, n) | 0) << 16 >> 16 <= 3) {
					i[r >> 1] = t;
					return
				}
				i[o >> 1] = s[o >> 1] | 0 | 16384;
				i[r >> 1] = t;
				return
			}

			function Yt(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					a = 0,
					l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0;
				A = c;
				c = c + 352 | 0;
				h = A + 24 | 0;
				y = A;
				f = 0;
				a = 0;
				do {
					t = i[r + (f + -40 << 1) >> 1] | 0;
					t = ee(t, t) | 0;
					if((t | 0) != 1073741824) {
						l = (t << 1) + a | 0;
						if((t ^ a | 0) > 0 & (l ^ a | 0) < 0) {
							o[n >> 2] = 1;
							a = (a >>> 31) + 2147483647 | 0
						} else a = l
					} else {
						o[n >> 2] = 1;
						a = 2147483647
					}
					f = f + 1 | 0
				} while ((f | 0) != 160);
				E = a;
				if((343039 - E & E | 0) < 0) {
					o[n >> 2] = 1;
					a = (E >>> 31) + 2147483647 | 0
				} else a = E + -343040 | 0;
				if((a | 0) < 0) {
					R = e + 102 | 0;
					i[R >> 1] = s[R >> 1] & 16383
				}
				d = E + -15e3 | 0;
				w = (14999 - E & E | 0) < 0;
				if(w) {
					o[n >> 2] = 1;
					l = (E >>> 31) + 2147483647 | 0
				} else l = d;
				if((l | 0) < 0) {
					R = e + 108 | 0;
					i[R >> 1] = s[R >> 1] & 16383
				}
				t = e + 72 | 0;
				u = e + 74 | 0;
				l = i[t >> 1] | 0;
				f = i[u >> 1] | 0;
				a = 0;
				do {
					R = a << 2;
					M = Bi((i[r + (R << 1) >> 1] | 0) >>> 2 & 65535, ((l << 16 >> 16) * 21955 | 0) >>> 15 & 65535, n) | 0;
					b = ((M << 16 >> 16) * 21955 | 0) >>> 15 & 65535;
					_ = Wt(l, b, n) | 0;
					F = R | 1;
					g = Bi((i[r + (F << 1) >> 1] | 0) >>> 2 & 65535, ((f << 16 >> 16) * 6390 | 0) >>> 15 & 65535, n) | 0;
					k = ((g << 16 >> 16) * 6390 | 0) >>> 15 & 65535;
					l = Wt(f, k, n) | 0;
					i[h + (R << 1) >> 1] = Wt(_, l, n) | 0;
					i[h + (F << 1) >> 1] = Bi(_, l, n) | 0;
					F = R | 2;
					l = Bi((i[r + (F << 1) >> 1] | 0) >>> 2 & 65535, b, n) | 0;
					M = Wt(M, ((l << 16 >> 16) * 21955 | 0) >>> 15 & 65535, n) | 0;
					R = R | 3;
					f = Bi((i[r + (R << 1) >> 1] | 0) >>> 2 & 65535, k, n) | 0;
					g = Wt(g, ((f << 16 >> 16) * 6390 | 0) >>> 15 & 65535, n) | 0;
					i[h + (F << 1) >> 1] = Wt(M, g, n) | 0;
					i[h + (R << 1) >> 1] = Bi(M, g, n) | 0;
					a = a + 1 | 0
				} while ((a | 0) != 40);
				i[t >> 1] = l;
				i[u >> 1] = f;
				f = e + 76 | 0;
				l = e + 80 | 0;
				a = 0;
				do {
					R = a << 2;
					Vt(h + (R << 1) | 0, h + ((R | 2) << 1) | 0, f, n);
					Vt(h + ((R | 1) << 1) | 0, h + ((R | 3) << 1) | 0, l, n);
					a = a + 1 | 0
				} while ((a | 0) != 40);
				f = e + 84 | 0;
				l = e + 86 | 0;
				a = e + 92 | 0;
				t = 0;
				do {
					R = t << 3;
					qt(h + (R << 1) | 0, h + ((R | 4) << 1) | 0, f, n);
					qt(h + ((R | 2) << 1) | 0, h + ((R | 6) << 1) | 0, l, n);
					qt(h + ((R | 3) << 1) | 0, h + ((R | 7) << 1) | 0, a, n);
					t = t + 1 | 0
				} while ((t | 0) != 20);
				f = e + 88 | 0;
				l = e + 90 | 0;
				a = 0;
				do {
					R = a << 4;
					qt(h + (R << 1) | 0, h + ((R | 8) << 1) | 0, f, n);
					qt(h + ((R | 4) << 1) | 0, h + ((R | 12) << 1) | 0, l, n);
					a = a + 1 | 0
				} while ((a | 0) != 10);
				v = Kt(h, e + 70 | 0, 32, 40, 4, 1, 15, n) | 0;
				i[y + 16 >> 1] = v;
				_ = Kt(h, e + 68 | 0, 16, 20, 8, 7, 16, n) | 0;
				i[y + 14 >> 1] = _;
				b = Kt(h, e + 66 | 0, 16, 20, 8, 3, 16, n) | 0;
				i[y + 12 >> 1] = b;
				k = Kt(h, e + 64 | 0, 16, 20, 8, 2, 16, n) | 0;
				i[y + 10 >> 1] = k;
				F = Kt(h, e + 62 | 0, 16, 20, 8, 6, 16, n) | 0;
				i[y + 8 >> 1] = F;
				M = Kt(h, e + 60 | 0, 8, 10, 16, 4, 16, n) | 0;
				i[y + 6 >> 1] = M;
				g = Kt(h, e + 58 | 0, 8, 10, 16, 12, 16, n) | 0;
				i[y + 4 >> 1] = g;
				R = Kt(h, e + 56 | 0, 8, 10, 16, 8, 16, n) | 0;
				i[y + 2 >> 1] = R;
				p = Kt(h, e + 54 | 0, 8, 10, 16, 0, 16, n) | 0;
				i[y >> 1] = p;
				f = 0;
				t = 0;
				do {
					l = e + (t << 1) | 0;
					r = _i(i[l >> 1] | 0) | 0;
					l = i[l >> 1] | 0;
					a = r << 16 >> 16;
					if(r << 16 >> 16 < 0) {
						u = 0 - a << 16;
						if((u | 0) < 983040) u = l << 16 >> 16 >> (u >> 16) & 65535;
						else u = 0
					} else {
						u = l << 16 >> 16;
						l = u << a;
						if((l << 16 >> 16 >> a | 0) == (u | 0)) u = l & 65535;
						else u = (u >>> 15 ^ 32767) & 65535
					}
					l = Gt(Pi(i[y + (t << 1) >> 1] | 0, 1, n) | 0, u) | 0;
					S = Bi(r, 5, n) | 0;
					a = S << 16 >> 16;
					if(S << 16 >> 16 < 0) {
						u = 0 - a << 16;
						if((u | 0) < 983040) u = l << 16 >> 16 >> (u >> 16);
						else u = 0
					} else {
						l = l << 16 >> 16;
						u = l << a;
						if((u << 16 >> 16 >> a | 0) != (l | 0)) u = l >>> 15 ^ 32767
					}
					u = u << 16 >> 16;
					u = ee(u, u) | 0;
					if((u | 0) != 1073741824) {
						l = (u << 1) + f | 0;
						if((u ^ f | 0) > 0 & (l ^ f | 0) < 0) {
							o[n >> 2] = 1;
							f = (f >>> 31) + 2147483647 | 0
						} else f = l
					} else {
						o[n >> 2] = 1;
						f = 2147483647
					}
					t = t + 1 | 0
				} while ((t | 0) != 9);
				S = f << 6;
				f = (((S >> 6 | 0) == (f | 0) ? S : f >> 31 ^ 2147418112) >> 16) * 3641 >> 15;
				if((f | 0) > 32767) {
					o[n >> 2] = 1;
					f = 32767
				}
				S = i[e >> 1] | 0;
				u = S << 16 >> 16;
				m = i[e + 2 >> 1] | 0;
				l = (m << 16 >> 16) + u | 0;
				if((m ^ S) << 16 >> 16 > -1 & (l ^ u | 0) < 0) {
					o[n >> 2] = 1;
					l = (u >>> 31) + 2147483647 | 0
				}
				S = i[e + 4 >> 1] | 0;
				u = S + l | 0;
				if((S ^ l | 0) > -1 & (u ^ l | 0) < 0) {
					o[n >> 2] = 1;
					u = (l >>> 31) + 2147483647 | 0
				}
				S = i[e + 6 >> 1] | 0;
				l = S + u | 0;
				if((S ^ u | 0) > -1 & (l ^ u | 0) < 0) {
					o[n >> 2] = 1;
					l = (u >>> 31) + 2147483647 | 0
				}
				S = i[e + 8 >> 1] | 0;
				u = S + l | 0;
				if((S ^ l | 0) > -1 & (u ^ l | 0) < 0) {
					o[n >> 2] = 1;
					u = (l >>> 31) + 2147483647 | 0
				}
				S = i[e + 10 >> 1] | 0;
				l = S + u | 0;
				if((S ^ u | 0) > -1 & (l ^ u | 0) < 0) {
					o[n >> 2] = 1;
					l = (u >>> 31) + 2147483647 | 0
				}
				S = i[e + 12 >> 1] | 0;
				u = S + l | 0;
				if((S ^ l | 0) > -1 & (u ^ l | 0) < 0) {
					o[n >> 2] = 1;
					u = (l >>> 31) + 2147483647 | 0
				}
				S = i[e + 14 >> 1] | 0;
				l = S + u | 0;
				if((S ^ u | 0) > -1 & (l ^ u | 0) < 0) {
					o[n >> 2] = 1;
					l = (u >>> 31) + 2147483647 | 0
				}
				S = i[e + 16 >> 1] | 0;
				u = S + l | 0;
				if((S ^ l | 0) > -1 & (u ^ l | 0) < 0) {
					o[n >> 2] = 1;
					u = (l >>> 31) + 2147483647 | 0
				}
				m = u << 13;
				m = ((m >> 13 | 0) == (u | 0) ? m : u >> 31 ^ 2147418112) >>> 16 & 65535;
				u = (ee((Bi(m, 0, n) | 0) << 16 >> 16, -2808) | 0) >> 15;
				if((u | 0) > 32767) {
					o[n >> 2] = 1;
					u = 32767
				}
				h = Wt(u & 65535, 1260, n) | 0;
				S = e + 100 | 0;
				u = Pi(i[S >> 1] | 0, 1, n) | 0;
				if((f << 16 >> 16 | 0) > ((h << 16 >> 16 < 720 ? 720 : h << 16 >> 16) | 0)) u = (u & 65535 | 16384) & 65535;
				i[S >> 1] = u;
				if(w) {
					o[n >> 2] = 1;
					d = (E >>> 31) + 2147483647 | 0
				}
				a = i[e + 118 >> 1] | 0;
				w = e + 126 | 0;
				u = i[w >> 1] | 0;
				t = u << 16 >> 16 < 19660;
				t = a << 16 >> 16 < u << 16 >> 16 ? t ? 2621 : 6553 : t ? 2621 : 655;
				r = u & 65535;
				f = r << 16;
				u = ee(t, u << 16 >> 16) | 0;
				if((u | 0) == 1073741824) {
					o[n >> 2] = 1;
					u = 2147483647
				} else u = u << 1;
				l = f - u | 0;
				if(((l ^ f) & (u ^ f) | 0) < 0) {
					o[n >> 2] = 1;
					l = (r >>> 15) + 2147483647 | 0
				}
				f = ee(t, a << 16 >> 16) | 0;
				do
					if((f | 0) == 1073741824) {
						o[n >> 2] = 1;
						u = 2147483647
					} else {
						u = l + (f << 1) | 0;
						if(!((l ^ f | 0) > 0 & (u ^ l | 0) < 0)) break;
						o[n >> 2] = 1;
						u = (l >>> 31) + 2147483647 | 0
					}
				while(0);
				r = Ni(u, n) | 0;
				E = (d | 0) > -1;
				i[w >> 1] = E ? r << 16 >> 16 < 13106 ? 13106 : r : 13106;
				r = e + 106 | 0;
				i[r >> 1] = Pi(i[r >> 1] | 0, 1, n) | 0;
				l = e + 108 | 0;
				u = Pi(i[l >> 1] | 0, 1, n) | 0;
				i[l >> 1] = u;
				f = i[w >> 1] | 0;
				e: do
					if(E) {
						do
							if(f << 16 >> 16 > 19660) i[r >> 1] = s[r >> 1] | 16384;
							else {
								if(f << 16 >> 16 > 16383) break;
								f = e + 116 | 0;
								u = 0;
								break e
							}
						while(0);
						i[l >> 1] = u & 65535 | 16384;
						O = 62
					} else O = 62;
				while(0);
				do
					if((O | 0) == 62) {
						u = e + 116 | 0;
						if(f << 16 >> 16 <= 22936) {
							f = u;
							u = 0;
							break
						}
						f = u;
						u = Wt(i[u >> 1] | 0, 1, n) | 0
					}
				while(0);
				i[f >> 1] = u;
				if((i[r >> 1] & 32640) != 32640) {
					h = (i[l >> 1] & 32767) == 32767;
					i[e + 122 >> 1] = h & 1;
					if(h) O = 67
				} else {
					i[e + 122 >> 1] = 1;
					O = 67
				}
				do
					if((O | 0) == 67) {
						f = e + 98 | 0;
						if((i[f >> 1] | 0) >= 5) break;
						i[f >> 1] = 5
					}
				while(0);
				h = e + 102 | 0;
				do
					if((i[h >> 1] & 24576) == 24576) O = 71;
					else {
						if((i[e + 104 >> 1] & 31744) == 31744) {
							O = 71;
							break
						}
						if(!(i[S >> 1] & 32640)) {
							i[e + 98 >> 1] = 20;
							l = 32767;
							break
						} else {
							l = p;
							f = 0;
							u = 0
						}
						while(1) {
							t = i[e + 18 + (f << 1) >> 1] | 0;
							a = l << 16 >> 16 > t << 16 >> 16;
							d = a ? l : t;
							l = a ? t : l;
							d = d << 16 >> 16 < 184 ? 184 : d;
							l = l << 16 >> 16 < 184 ? 184 : l;
							t = _i(l) | 0;
							a = t << 16 >> 16;
							do
								if(t << 16 >> 16 < 0) {
									r = 0 - a << 16;
									if((r | 0) >= 983040) {
										r = 0;
										break
									}
									r = l << 16 >> 16 >> (r >> 16) & 65535
								} else {
									r = l << 16 >> 16;
									l = r << a;
									if((l << 16 >> 16 >> a | 0) == (r | 0)) {
										r = l & 65535;
										break
									}
									r = (r >>> 15 ^ 32767) & 65535
								}
							while(0);
							d = Gt(Pi(d, 1, n) | 0, r) | 0;
							u = Wt(u, Pi(d, Bi(8, t, n) | 0, n) | 0, n) | 0;
							f = f + 1 | 0;
							if((f | 0) == 9) break;
							l = i[y + (f << 1) >> 1] | 0
						}
						if(u << 16 >> 16 > 1e3) {
							i[e + 98 >> 1] = 20;
							l = 32767;
							break
						}
						l = i[S >> 1] | 0;
						f = e + 98 | 0;
						u = i[f >> 1] | 0;
						do
							if(!(l & 16384)) O = 86;
							else {
								if(!(u << 16 >> 16)) {
									u = l;
									break
								}
								u = Bi(u, 1, n) | 0;
								i[f >> 1] = u;
								O = 86
							}
						while(0);
						if((O | 0) == 86) {
							if(u << 16 >> 16 == 20) {
								l = 32767;
								break
							}
							u = i[S >> 1] | 0
						}
						l = (u & 16384) == 0 ? 16383 : 3276
					}
				while(0);
				if((O | 0) == 71) {
					i[e + 98 >> 1] = 20;
					l = 32767
				}
				f = p;
				u = 0;
				while(1) {
					d = e + 18 + (u << 1) | 0;
					r = pi(l, Bi(f, i[d >> 1] | 0, n) | 0, n) | 0;
					i[d >> 1] = Wt(i[d >> 1] | 0, r, n) | 0;
					u = u + 1 | 0;
					if((u | 0) == 9) break;
					f = i[y + (u << 1) >> 1] | 0
				}
				do
					if(!(i[S >> 1] & 30720)) {
						if(i[h >> 1] & 30720) {
							O = 95;
							break
						}
						if(!(i[e + 114 >> 1] | 0)) {
							a = 2097;
							t = 1638;
							r = 2
						} else O = 95
					} else O = 95;
				while(0);
				do
					if((O | 0) == 95) {
						if((i[e + 98 >> 1] | 0) == 0 ? (i[e + 114 >> 1] | 0) == 0 : 0) {
							a = 1867;
							t = 491;
							r = 2;
							break
						}
						a = 1638;
						t = 0;
						r = 0
					}
				while(0);
				l = 0;
				do {
					f = e + (l << 1) | 0;
					u = Bi(i[e + 36 + (l << 1) >> 1] | 0, i[f >> 1] | 0, n) | 0;
					if(u << 16 >> 16 < 0) {
						u = pi(a, u, n) | 0;
						u = Wt(-2, Wt(i[f >> 1] | 0, u, n) | 0, n) | 0;
						u = u << 16 >> 16 < 40 ? 40 : u
					} else {
						u = pi(t, u, n) | 0;
						u = Wt(r, Wt(i[f >> 1] | 0, u, n) | 0, n) | 0;
						u = u << 16 >> 16 > 16e3 ? 16e3 : u
					}
					i[f >> 1] = u;
					l = l + 1 | 0
				} while ((l | 0) != 9);
				i[e + 36 >> 1] = p;
				i[e + 38 >> 1] = R;
				i[e + 40 >> 1] = g;
				i[e + 42 >> 1] = M;
				i[e + 44 >> 1] = F;
				i[e + 46 >> 1] = k;
				i[e + 48 >> 1] = b;
				i[e + 50 >> 1] = _;
				i[e + 52 >> 1] = v;
				f = m << 16 >> 16 > 100;
				l = f ? 7 : 4;
				f = f ? 4 : 5;
				if(!E) {
					i[e + 94 >> 1] = 0;
					i[e + 96 >> 1] = 0;
					i[e + 114 >> 1] = 0;
					i[e + 116 >> 1] = 0;
					n = 0;
					e = e + 120 | 0;
					i[e >> 1] = n;
					c = A;
					return n | 0
				}
				a = e + 114 | 0;
				t = i[a >> 1] | 0;
				do
					if((i[e + 116 >> 1] | 0) <= 100) {
						if(t << 16 >> 16) break;
						t = i[S >> 1] | 0;
						do
							if(!(t & 16368)) {
								if((i[w >> 1] | 0) > 21298) t = 1;
								else break;
								e = e + 120 | 0;
								i[e >> 1] = t;
								c = A;
								return t | 0
							}
						while(0);
						a = e + 94 | 0;
						if(!(t & 16384)) {
							i[a >> 1] = 0;
							t = e + 96 | 0;
							a = i[t >> 1] | 0;
							if(a << 16 >> 16 <= 0) {
								n = 0;
								e = e + 120 | 0;
								i[e >> 1] = n;
								c = A;
								return n | 0
							}
							i[t >> 1] = Bi(a, 1, n) | 0;
							n = 1;
							e = e + 120 | 0;
							i[e >> 1] = n;
							c = A;
							return n | 0
						} else {
							n = Wt(i[a >> 1] | 0, 1, n) | 0;
							i[a >> 1] = n;
							if((n << 16 >> 16 | 0) < (f | 0)) {
								n = 1;
								e = e + 120 | 0;
								i[e >> 1] = n;
								c = A;
								return n | 0
							}
							i[e + 96 >> 1] = l;
							n = 1;
							e = e + 120 | 0;
							i[e >> 1] = n;
							c = A;
							return n | 0
						}
					} else {
						if(t << 16 >> 16 >= 250) break;
						i[a >> 1] = 250;
						t = 250
					}
				while(0);
				i[e + 94 >> 1] = 4;
				i[a >> 1] = Bi(t, 1, n) | 0;
				n = 1;
				e = e + 120 | 0;
				i[e >> 1] = n;
				c = A;
				return n | 0
			}

			function Vt(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var a = 0,
					s = 0,
					l = 0;
				a = (i[n >> 1] | 0) * 21955 >> 15;
				if((a | 0) > 32767) {
					o[t >> 2] = 1;
					a = 32767
				}
				s = Bi(i[e >> 1] | 0, a & 65535, t) | 0;
				a = (s << 16 >> 16) * 21955 >> 15;
				if((a | 0) > 32767) {
					o[t >> 2] = 1;
					a = 32767
				}
				l = Wt(i[n >> 1] | 0, a & 65535, t) | 0;
				i[n >> 1] = s;
				n = n + 2 | 0;
				a = (i[n >> 1] | 0) * 6390 >> 15;
				if((a | 0) > 32767) {
					o[t >> 2] = 1;
					a = 32767
				}
				s = Bi(i[r >> 1] | 0, a & 65535, t) | 0;
				a = (s << 16 >> 16) * 6390 >> 15;
				if((a | 0) > 32767) {
					o[t >> 2] = 1;
					a = 32767
				}
				a = Wt(i[n >> 1] | 0, a & 65535, t) | 0;
				i[n >> 1] = s;
				i[e >> 1] = Pi(Wt(l, a, t) | 0, 1, t) | 0;
				i[r >> 1] = Pi(Bi(l, a, t) | 0, 1, t) | 0;
				return
			}

			function qt(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var a = 0,
					s = 0;
				a = (i[n >> 1] | 0) * 13363 >> 15;
				if((a | 0) > 32767) {
					o[t >> 2] = 1;
					a = 32767
				}
				s = Bi(i[r >> 1] | 0, a & 65535, t) | 0;
				a = (s << 16 >> 16) * 13363 >> 15;
				if((a | 0) > 32767) {
					o[t >> 2] = 1;
					a = 32767
				}
				a = Wt(i[n >> 1] | 0, a & 65535, t) | 0;
				i[n >> 1] = s;
				i[r >> 1] = Pi(Bi(i[e >> 1] | 0, a, t) | 0, 1, t) | 0;
				i[e >> 1] = Pi(Wt(i[e >> 1] | 0, a, t) | 0, 1, t) | 0;
				return
			}

			function Kt(e, r, n, t, a, s, l, f) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				f = f | 0;
				var u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0;
				if(n << 16 >> 16 < t << 16 >> 16) {
					h = a << 16 >> 16;
					u = s << 16 >> 16;
					E = n << 16 >> 16;
					c = 0;
					do {
						w = i[e + ((ee(E, h) | 0) + u << 1) >> 1] | 0;
						w = (w & 65535) - ((w & 65535) >>> 15 & 65535) | 0;
						w = (w << 16 >> 31 ^ w) << 16;
						d = (w >> 15) + c | 0;
						if((w >> 16 ^ c | 0) > 0 & (d ^ c | 0) < 0) {
							o[f >> 2] = 1;
							c = (c >>> 31) + 2147483647 | 0
						} else c = d;
						E = E + 1 | 0
					} while ((E & 65535) << 16 >> 16 != t << 16 >> 16);
					E = c
				} else E = 0;
				c = i[r >> 1] | 0;
				w = Bi(16, l, f) | 0;
				u = w << 16 >> 16;
				if(w << 16 >> 16 > 0) {
					t = c << u;
					if((t >> u | 0) != (c | 0)) t = c >> 31 ^ 2147483647
				} else {
					u = 0 - u << 16;
					if((u | 0) < 2031616) t = c >> (u >> 16);
					else t = 0
				}
				u = t + E | 0;
				if((t ^ E | 0) > -1 & (u ^ E | 0) < 0) {
					o[f >> 2] = 1;
					u = (E >>> 31) + 2147483647 | 0
				}
				w = l << 16 >> 16;
				l = l << 16 >> 16 > 0;
				if(l) {
					t = E << w;
					if((t >> w | 0) != (E | 0)) t = E >> 31 ^ 2147483647
				} else {
					t = 0 - w << 16;
					if((t | 0) < 2031616) t = E >> (t >> 16);
					else t = 0
				}
				i[r >> 1] = t >>> 16;
				if(n << 16 >> 16 > 0) {
					h = a << 16 >> 16;
					c = s << 16 >> 16;
					d = 0;
					do {
						s = i[e + ((ee(d, h) | 0) + c << 1) >> 1] | 0;
						s = (s & 65535) - ((s & 65535) >>> 15 & 65535) | 0;
						s = (s << 16 >> 31 ^ s) << 16;
						t = (s >> 15) + u | 0;
						if((s >> 16 ^ u | 0) > 0 & (t ^ u | 0) < 0) {
							o[f >> 2] = 1;
							u = (u >>> 31) + 2147483647 | 0
						} else u = t;
						d = d + 1 | 0
					} while ((d & 65535) << 16 >> 16 != n << 16 >> 16)
				}
				if(l) {
					t = u << w;
					if((t >> w | 0) == (u | 0)) {
						f = t;
						f = f >>> 16;
						f = f & 65535;
						return f | 0
					}
					f = u >> 31 ^ 2147483647;
					f = f >>> 16;
					f = f & 65535;
					return f | 0
				} else {
					t = 0 - w << 16;
					if((t | 0) >= 2031616) {
						f = 0;
						f = f >>> 16;
						f = f & 65535;
						return f | 0
					}
					f = u >> (t >> 16);
					f = f >>> 16;
					f = f & 65535;
					return f | 0
				}
				return 0
			}

			function Wt(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				e = (r << 16 >> 16) + (e << 16 >> 16) | 0;
				if((e | 0) <= 32767) {
					if((e | 0) < -32768) {
						o[n >> 2] = 1;
						e = -32768
					}
				} else {
					o[n >> 2] = 1;
					e = 32767
				}
				return e & 65535 | 0
			}

			function Xt(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var o = 0,
					a = 0,
					s = 0,
					l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0;
				M = c;
				c = c + 32 | 0;
				k = M + 12 | 0;
				F = M;
				i[k >> 1] = 1024;
				i[F >> 1] = 1024;
				f = i[e + 2 >> 1] | 0;
				s = i[e + 20 >> 1] | 0;
				t = ((s + f | 0) >>> 2) + 64512 | 0;
				i[k + 2 >> 1] = t;
				s = ((f - s | 0) >>> 2) + 1024 | 0;
				i[F + 2 >> 1] = s;
				f = i[e + 4 >> 1] | 0;
				o = i[e + 18 >> 1] | 0;
				t = ((o + f | 0) >>> 2) - t | 0;
				i[k + 4 >> 1] = t;
				s = ((f - o | 0) >>> 2) + s | 0;
				i[F + 4 >> 1] = s;
				o = i[e + 6 >> 1] | 0;
				f = i[e + 16 >> 1] | 0;
				t = ((f + o | 0) >>> 2) - t | 0;
				i[k + 6 >> 1] = t;
				s = ((o - f | 0) >>> 2) + s | 0;
				i[F + 6 >> 1] = s;
				f = i[e + 8 >> 1] | 0;
				o = i[e + 14 >> 1] | 0;
				t = ((o + f | 0) >>> 2) - t | 0;
				i[k + 8 >> 1] = t;
				s = ((f - o | 0) >>> 2) + s | 0;
				i[F + 8 >> 1] = s;
				o = i[e + 10 >> 1] | 0;
				f = i[e + 12 >> 1] | 0;
				t = ((f + o | 0) >>> 2) - t | 0;
				i[k + 10 >> 1] = t;
				i[F + 10 >> 1] = ((o - f | 0) >>> 2) + s;
				s = i[3454] | 0;
				f = s << 16 >> 16;
				e = i[k + 2 >> 1] | 0;
				o = (e << 16 >> 16 << 14) + (f << 10) | 0;
				p = o & -65536;
				o = (o >>> 1) - (o >> 16 << 15) << 16;
				b = (((ee(o >> 16, f) | 0) >> 15) + (ee(p >> 16, f) | 0) << 2) + -16777216 | 0;
				b = (i[k + 4 >> 1] << 14) + b | 0;
				l = b >> 16;
				b = (b >>> 1) - (l << 15) << 16;
				p = (((ee(b >> 16, f) | 0) >> 15) + (ee(l, f) | 0) << 2) - ((o >> 15) + p) | 0;
				p = (i[k + 6 >> 1] << 14) + p | 0;
				o = p >> 16;
				p = (p >>> 1) - (o << 15) << 16;
				l = (((ee(p >> 16, f) | 0) >> 15) + (ee(o, f) | 0) << 2) - ((b >> 15) + (l << 16)) | 0;
				l = (i[k + 8 >> 1] << 14) + l | 0;
				b = l >> 16;
				o = (t << 16 >> 3) + ((((ee((l >>> 1) - (b << 15) << 16 >> 16, f) | 0) >> 15) + (ee(b, f) | 0) << 1) - ((p >> 15) + (o << 16))) | 0;
				p = k + 4 | 0;
				f = k;
				b = 0;
				l = 0;
				t = 0;
				S = k + 10 | 0;
				o = (o + 33554432 | 0) >>> 0 < 67108863 ? o >>> 10 & 65535 : (o | 0) > 33554431 ? 32767 : -32768;
				e: while(1) {
					v = e << 16 >> 16 << 14;
					m = f + 6 | 0;
					w = f + 8 | 0;
					E = l << 16 >> 16;
					while(1) {
						if((E | 0) >= 60) break e;
						f = (E & 65535) + 1 << 16 >> 16;
						u = i[6908 + (f << 16 >> 16 << 1) >> 1] | 0;
						_ = u << 16 >> 16;
						l = v + (_ << 10) | 0;
						a = l & -65536;
						l = (l >>> 1) - (l >> 16 << 15) << 16;
						d = (((ee(l >> 16, _) | 0) >> 15) + (ee(a >> 16, _) | 0) << 2) + -16777216 | 0;
						h = i[p >> 1] | 0;
						d = (h << 16 >> 16 << 14) + d | 0;
						y = d >> 16;
						d = (d >>> 1) - (y << 15) << 16;
						a = (((ee(d >> 16, _) | 0) >> 15) + (ee(y, _) | 0) << 2) - ((l >> 15) + a) | 0;
						l = i[m >> 1] | 0;
						a = (l << 16 >> 16 << 14) + a | 0;
						e = a >> 16;
						a = (a >>> 1) - (e << 15) << 16;
						y = (((ee(a >> 16, _) | 0) >> 15) + (ee(e, _) | 0) << 2) - ((d >> 15) + (y << 16)) | 0;
						d = i[w >> 1] | 0;
						y = (d << 16 >> 16 << 14) + y | 0;
						R = y >> 16;
						e = (((ee((y >>> 1) - (R << 15) << 16 >> 16, _) | 0) >> 15) + (ee(R, _) | 0) << 1) - ((a >> 15) + (e << 16)) | 0;
						a = i[S >> 1] | 0;
						e = (a << 16 >> 16 << 13) + e | 0;
						e = (e + 33554432 | 0) >>> 0 < 67108863 ? e >>> 10 & 65535 : (e | 0) > 33554431 ? 32767 : -32768;
						if((ee(e << 16 >> 16, o << 16 >> 16) | 0) < 1) {
							_ = f;
							f = h;
							break
						} else {
							E = E + 1 | 0;
							s = u;
							o = e
						}
					}
					p = a << 16 >> 16 << 13;
					S = f << 16 >> 16 << 14;
					h = l << 16 >> 16 << 14;
					w = d << 16 >> 16 << 14;
					a = u << 16 >> 16;
					E = 4;
					while(1) {
						R = (s << 16 >> 16 >>> 1) + (a >>> 1) | 0;
						a = R << 16;
						m = a >> 16;
						a = v + (a >> 6) | 0;
						y = a & -65536;
						a = (a >>> 1) - (a >> 16 << 15) << 16;
						d = S + ((((ee(a >> 16, m) | 0) >> 15) + (ee(y >> 16, m) | 0) << 2) + -16777216) | 0;
						f = d >> 16;
						d = (d >>> 1) - (f << 15) << 16;
						y = h + ((((ee(d >> 16, m) | 0) >> 15) + (ee(f, m) | 0) << 2) - ((a >> 15) + y)) | 0;
						a = y >> 16;
						y = (y >>> 1) - (a << 15) << 16;
						f = w + ((((ee(y >> 16, m) | 0) >> 15) + (ee(a, m) | 0) << 2) - ((d >> 15) + (f << 16))) | 0;
						d = f >> 16;
						R = R & 65535;
						a = p + ((((ee((f >>> 1) - (d << 15) << 16 >> 16, m) | 0) >> 15) + (ee(d, m) | 0) << 1) - ((y >> 15) + (a << 16))) | 0;
						a = (a + 33554432 | 0) >>> 0 < 67108863 ? a >>> 10 & 65535 : (a | 0) > 33554431 ? 32767 : -32768;
						y = (ee(a << 16 >> 16, e << 16 >> 16) | 0) < 1;
						m = y ? u : R;
						e = y ? e : a;
						s = y ? R : s;
						o = y ? a : o;
						E = E + -1 << 16 >> 16;
						a = m << 16 >> 16;
						if(!(E << 16 >> 16)) {
							u = a;
							l = s;
							s = m;
							break
						} else u = m
					}
					f = t << 16 >> 16;
					a = e << 16 >> 16;
					e = (o & 65535) - a | 0;
					o = e << 16;
					if(o) {
						y = (e & 65535) - (e >>> 15 & 1) | 0;
						y = y << 16 >> 31 ^ y;
						e = (_i(y & 65535) | 0) << 16 >> 16;
						e = (ee((Gt(16383, y << 16 >> 16 << e & 65535) | 0) << 16 >> 16, (l & 65535) - u << 16 >> 16) | 0) >> 19 - e;
						if((o | 0) < 0) e = 0 - (e << 16 >> 16) | 0;
						s = u - ((ee(e << 16 >> 16, a) | 0) >>> 10) & 65535
					}
					i[r + (f << 1) >> 1] = s;
					o = b << 16 >> 16 == 0 ? F : k;
					R = s << 16 >> 16;
					e = i[o + 2 >> 1] | 0;
					a = (e << 16 >> 16 << 14) + (R << 10) | 0;
					y = a & -65536;
					a = (a >>> 1) - (a >> 16 << 15) << 16;
					v = (((ee(a >> 16, R) | 0) >> 15) + (ee(y >> 16, R) | 0) << 2) + -16777216 | 0;
					v = (i[o + 4 >> 1] << 14) + v | 0;
					p = v >> 16;
					v = (v >>> 1) - (p << 15) << 16;
					y = (((ee(v >> 16, R) | 0) >> 15) + (ee(p, R) | 0) << 2) - ((a >> 15) + y) | 0;
					y = (i[o + 6 >> 1] << 14) + y | 0;
					a = y >> 16;
					y = (y >>> 1) - (a << 15) << 16;
					p = (((ee(y >> 16, R) | 0) >> 15) + (ee(a, R) | 0) << 2) - ((v >> 15) + (p << 16)) | 0;
					p = (i[o + 8 >> 1] << 14) + p | 0;
					v = p >> 16;
					t = t + 1 << 16 >> 16;
					a = (((ee((p >>> 1) - (v << 15) << 16 >> 16, R) | 0) >> 15) + (ee(v, R) | 0) << 1) - ((y >> 15) + (a << 16)) | 0;
					a = (i[o + 10 >> 1] << 13) + a | 0;
					if(t << 16 >> 16 < 10) {
						p = o + 4 | 0;
						f = o;
						b = b ^ 1;
						l = _;
						S = o + 10 | 0;
						o = (a + 33554432 | 0) >>> 0 < 67108863 ? a >>> 10 & 65535 : (a | 0) > 33554431 ? 32767 : -32768
					} else {
						g = 13;
						break
					}
				}
				if((g | 0) == 13) {
					c = M;
					return
				}
				i[r >> 1] = i[n >> 1] | 0;
				i[r + 2 >> 1] = i[n + 2 >> 1] | 0;
				i[r + 4 >> 1] = i[n + 4 >> 1] | 0;
				i[r + 6 >> 1] = i[n + 6 >> 1] | 0;
				i[r + 8 >> 1] = i[n + 8 >> 1] | 0;
				i[r + 10 >> 1] = i[n + 10 >> 1] | 0;
				i[r + 12 >> 1] = i[n + 12 >> 1] | 0;
				i[r + 14 >> 1] = i[n + 14 >> 1] | 0;
				i[r + 16 >> 1] = i[n + 16 >> 1] | 0;
				i[r + 18 >> 1] = i[n + 18 >> 1] | 0;
				c = M;
				return
			}

			function Gt(e, r) {
				e = e | 0;
				r = r | 0;
				var n = 0,
					t = 0,
					i = 0,
					o = 0,
					a = 0,
					s = 0;
				i = r << 16 >> 16;
				if(e << 16 >> 16 < 1 ? 1 : e << 16 >> 16 > r << 16 >> 16) {
					i = 0;
					return i | 0
				}
				if(e << 16 >> 16 == r << 16 >> 16) {
					i = 32767;
					return i | 0
				}
				t = i << 1;
				n = i << 2;
				o = e << 16 >> 16 << 3;
				e = (o | 0) < (n | 0);
				o = o - (e ? 0 : n) | 0;
				e = e ? 0 : 4;
				a = (o | 0) < (t | 0);
				o = o - (a ? 0 : t) | 0;
				r = (o | 0) < (i | 0);
				e = (r & 1 | (a ? e : e | 2)) << 3 ^ 8;
				r = o - (r ? 0 : i) << 3;
				if((r | 0) >= (n | 0)) {
					r = r - n | 0;
					e = e & 65528 | 4
				}
				o = (r | 0) < (t | 0);
				a = r - (o ? 0 : t) | 0;
				r = (a | 0) < (i | 0);
				e = (r & 1 ^ 1 | (o ? e : e | 2)) << 16 >> 13;
				r = a - (r ? 0 : i) << 3;
				if((r | 0) >= (n | 0)) {
					r = r - n | 0;
					e = e & 65528 | 4
				}
				o = (r | 0) < (t | 0);
				a = r - (o ? 0 : t) | 0;
				r = (a | 0) < (i | 0);
				e = (r & 1 ^ 1 | (o ? e : e | 2)) << 16 >> 13;
				r = a - (r ? 0 : i) << 3;
				if((r | 0) >= (n | 0)) {
					r = r - n | 0;
					e = e & 65528 | 4
				}
				s = (r | 0) < (t | 0);
				o = r - (s ? 0 : t) | 0;
				a = (o | 0) < (i | 0);
				r = (a & 1 ^ 1 | (s ? e : e | 2)) << 16 >> 13;
				e = o - (a ? 0 : i) << 3;
				if((e | 0) >= (n | 0)) {
					e = e - n | 0;
					r = r & 65528 | 4
				}
				s = (e | 0) < (t | 0);
				s = ((e - (s ? 0 : t) | 0) >= (i | 0) | (s ? r : r | 2)) & 65535;
				return s | 0
			}

			function Jt(e) {
				e = e | 0;
				if(!e) {
					e = -1;
					return e | 0
				}
				i[e >> 1] = -14336;
				i[e + 8 >> 1] = -2381;
				i[e + 2 >> 1] = -14336;
				i[e + 10 >> 1] = -2381;
				i[e + 4 >> 1] = -14336;
				i[e + 12 >> 1] = -2381;
				i[e + 6 >> 1] = -14336;
				i[e + 14 >> 1] = -2381;
				e = 0;
				return e | 0
			}

			function Zt(e, r, n, t, a, l, f, u) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				l = l | 0;
				f = f | 0;
				u = u | 0;
				var d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0;
				S = c;
				c = c + 16 | 0;
				w = S + 2 | 0;
				m = S;
				d = 0;
				h = 10;
				while(1) {
					E = i[n >> 1] | 0;
					E = ((ee(E, E) | 0) >>> 3) + d | 0;
					d = i[n + 2 >> 1] | 0;
					d = E + ((ee(d, d) | 0) >>> 3) | 0;
					E = i[n + 4 >> 1] | 0;
					E = d + ((ee(E, E) | 0) >>> 3) | 0;
					d = i[n + 6 >> 1] | 0;
					d = E + ((ee(d, d) | 0) >>> 3) | 0;
					h = h + -1 << 16 >> 16;
					if(!(h << 16 >> 16)) break;
					else n = n + 8 | 0
				}
				h = d << 4;
				h = (h | 0) < 0 ? 2147483647 : h;
				if((r | 0) == 7) {
					si(((Ni(h, u) | 0) << 16 >> 16) * 52428 | 0, w, m, u);
					E = s[w >> 1] << 16;
					h = i[m >> 1] << 1;
					r = i[e + 8 >> 1] | 0;
					d = (r << 16 >> 16) * 88 | 0;
					if(r << 16 >> 16 > -1 & (d | 0) < -783741) {
						o[u >> 2] = 1;
						n = 2147483647
					} else n = d + 783741 | 0;
					r = (i[e + 10 >> 1] | 0) * 74 | 0;
					d = r + n | 0;
					if((r ^ n | 0) > -1 & (d ^ n | 0) < 0) {
						o[u >> 2] = 1;
						n = (n >>> 31) + 2147483647 | 0
					} else n = d;
					r = (i[e + 12 >> 1] | 0) * 44 | 0;
					d = r + n | 0;
					if((r ^ n | 0) > -1 & (d ^ n | 0) < 0) {
						o[u >> 2] = 1;
						n = (n >>> 31) + 2147483647 | 0
					} else n = d;
					e = (i[e + 14 >> 1] | 0) * 24 | 0;
					d = e + n | 0;
					if((e ^ n | 0) > -1 & (d ^ n | 0) < 0) {
						o[u >> 2] = 1;
						d = (n >>> 31) + 2147483647 | 0
					}
					e = E + -1966080 + h | 0;
					n = d - e | 0;
					if(((n ^ d) & (d ^ e) | 0) < 0) {
						o[u >> 2] = 1;
						n = (d >>> 31) + 2147483647 | 0
					}
					u = n >> 17;
					i[t >> 1] = u;
					u = (n >> 2) - (u << 15) | 0;
					u = u & 65535;
					i[a >> 1] = u;
					c = S;
					return
				}
				E = vi(h) | 0;
				d = E << 16 >> 16;
				if(E << 16 >> 16 > 0) {
					n = h << d;
					if((n >> d | 0) == (h | 0)) h = n;
					else h = h >> 31 ^ 2147483647
				} else {
					d = 0 - d << 16;
					if((d | 0) < 2031616) h = h >> (d >> 16);
					else h = 0
				}
				li(h, E, w, m);
				w = ee(i[w >> 1] | 0, -49320) | 0;
				d = (ee(i[m >> 1] | 0, -24660) | 0) >> 15;
				d = (d & 65536 | 0) == 0 ? d : d | -65536;
				m = d << 1;
				n = m + w | 0;
				if((m ^ w | 0) > -1 & (n ^ m | 0) < 0) {
					o[u >> 2] = 1;
					n = (d >>> 30 & 1) + 2147483647 | 0
				}
				switch(r | 0) {
					case 6:
						{
							d = n + 2134784 | 0;
							if((n | 0) > -1 & (d ^ n | 0) < 0) {
								o[u >> 2] = 1;
								d = (n >>> 31) + 2147483647 | 0
							}
							break
						}
					case 5:
						{
							i[f >> 1] = h >>> 16;i[l >> 1] = -11 - (E & 65535);d = n + 2183936 | 0;
							if((n | 0) > -1 & (d ^ n | 0) < 0) {
								o[u >> 2] = 1;
								d = (n >>> 31) + 2147483647 | 0
							}
							break
						}
					case 4:
						{
							d = n + 2085632 | 0;
							if((n | 0) > -1 & (d ^ n | 0) < 0) {
								o[u >> 2] = 1;
								d = (n >>> 31) + 2147483647 | 0
							}
							break
						}
					case 3:
						{
							d = n + 2065152 | 0;
							if((n | 0) > -1 & (d ^ n | 0) < 0) {
								o[u >> 2] = 1;
								d = (n >>> 31) + 2147483647 | 0
							}
							break
						}
					default:
						{
							d = n + 2134784 | 0;
							if((n | 0) > -1 & (d ^ n | 0) < 0) {
								o[u >> 2] = 1;
								d = (n >>> 31) + 2147483647 | 0
							}
						}
				}
				do
					if((d | 0) <= 2097151)
						if((d | 0) < -2097152) {
							o[u >> 2] = 1;
							n = -2147483648;
							break
						} else {
							n = d << 10;
							break
						}
				else {
					o[u >> 2] = 1;
					n = 2147483647
				} while (0);
				f = (i[e >> 1] | 0) * 11142 | 0;
				d = f + n | 0;
				if((f ^ n | 0) > -1 & (d ^ n | 0) < 0) {
					o[u >> 2] = 1;
					d = (n >>> 31) + 2147483647 | 0
				}
				f = (i[e + 2 >> 1] | 0) * 9502 | 0;
				n = f + d | 0;
				if((f ^ d | 0) > -1 & (n ^ d | 0) < 0) {
					o[u >> 2] = 1;
					n = (d >>> 31) + 2147483647 | 0
				}
				f = (i[e + 4 >> 1] | 0) * 5570 | 0;
				d = f + n | 0;
				if((f ^ n | 0) > -1 & (d ^ n | 0) < 0) {
					o[u >> 2] = 1;
					d = (n >>> 31) + 2147483647 | 0
				}
				e = (i[e + 6 >> 1] | 0) * 3112 | 0;
				n = e + d | 0;
				if((e ^ d | 0) > -1 & (n ^ d | 0) < 0) {
					o[u >> 2] = 1;
					n = (d >>> 31) + 2147483647 | 0
				}
				n = ee(n >> 16, (r | 0) == 4 ? 10878 : 10886) | 0;
				if((n | 0) < 0) n = ~((n ^ -256) >> 8);
				else n = n >> 8;
				i[t >> 1] = n >>> 16;
				if((n | 0) < 0) d = ~((n ^ -2) >> 1);
				else d = n >> 1;
				t = n >> 16 << 15;
				n = d - t | 0;
				if(((n ^ d) & (t ^ d) | 0) >= 0) {
					u = n;
					u = u & 65535;
					i[a >> 1] = u;
					c = S;
					return
				}
				o[u >> 2] = 1;
				u = (d >>> 31) + 2147483647 | 0;
				u = u & 65535;
				i[a >> 1] = u;
				c = S;
				return
			}

			function Qt(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					o = 0,
					a = 0;
				o = e + 4 | 0;
				i[e + 6 >> 1] = i[o >> 1] | 0;
				a = e + 12 | 0;
				i[e + 14 >> 1] = i[a >> 1] | 0;
				t = e + 2 | 0;
				i[o >> 1] = i[t >> 1] | 0;
				o = e + 10 | 0;
				i[a >> 1] = i[o >> 1] | 0;
				i[t >> 1] = i[e >> 1] | 0;
				t = e + 8 | 0;
				i[o >> 1] = i[t >> 1] | 0;
				i[t >> 1] = r;
				i[e >> 1] = n;
				return
			}

			function $t(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var o = 0,
					a = 0;
				a = Wt(0, i[e + 8 >> 1] | 0, t) | 0;
				a = Wt(a, i[e + 10 >> 1] | 0, t) | 0;
				a = Wt(a, i[e + 12 >> 1] | 0, t) | 0;
				a = Wt(a, i[e + 14 >> 1] | 0, t) | 0;
				o = a << 16 >> 16 >> 2;
				o = (a << 16 >> 16 < 0 ? o | 49152 : o) & 65535;
				i[r >> 1] = o << 16 >> 16 < -2381 ? -2381 : o;
				r = Wt(0, i[e >> 1] | 0, t) | 0;
				r = Wt(r, i[e + 2 >> 1] | 0, t) | 0;
				r = Wt(r, i[e + 4 >> 1] | 0, t) | 0;
				t = Wt(r, i[e + 6 >> 1] | 0, t) | 0;
				e = t << 16 >> 16 >> 2;
				e = (t << 16 >> 16 < 0 ? e | 49152 : e) & 65535;
				i[n >> 1] = e << 16 >> 16 < -14336 ? -14336 : e;
				return
			}

			function ei(e) {
				e = e | 0;
				o[e >> 2] = 6892;
				o[e + 4 >> 2] = 8180;
				o[e + 8 >> 2] = 21e3;
				o[e + 12 >> 2] = 9716;
				o[e + 16 >> 2] = 22024;
				o[e + 20 >> 2] = 12788;
				o[e + 24 >> 2] = 24072;
				o[e + 28 >> 2] = 26120;
				o[e + 32 >> 2] = 28168;
				o[e + 36 >> 2] = 6876;
				o[e + 40 >> 2] = 7452;
				o[e + 44 >> 2] = 8140;
				o[e + 48 >> 2] = 20980;
				o[e + 52 >> 2] = 16884;
				o[e + 56 >> 2] = 17908;
				o[e + 60 >> 2] = 7980;
				o[e + 64 >> 2] = 8160;
				o[e + 68 >> 2] = 6678;
				o[e + 72 >> 2] = 6646;
				o[e + 76 >> 2] = 6614;
				o[e + 80 >> 2] = 29704;
				o[e + 84 >> 2] = 28680;
				o[e + 88 >> 2] = 3720;
				o[e + 92 >> 2] = 8;
				o[e + 96 >> 2] = 4172;
				o[e + 100 >> 2] = 44;
				o[e + 104 >> 2] = 3436;
				o[e + 108 >> 2] = 30316;
				o[e + 112 >> 2] = 30796;
				o[e + 116 >> 2] = 31276;
				o[e + 120 >> 2] = 7472;
				o[e + 124 >> 2] = 7552;
				o[e + 128 >> 2] = 7632;
				o[e + 132 >> 2] = 7712;
				return
			}

			function ri(e, r) {
				e = e | 0;
				r = r | 0;
				var n = 0,
					t = 0,
					o = 0,
					a = 0,
					s = 0,
					l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0;
				h = c;
				c = c + 48 | 0;
				u = h + 18 | 0;
				d = h;
				f = r << 16 >> 16;
				Vi(d | 0, e | 0, f << 1 | 0) | 0;
				if(r << 16 >> 16 > 0) {
					n = 0;
					t = 0
				} else {
					d = f >> 1;
					d = u + (d << 1) | 0;
					d = i[d >> 1] | 0;
					d = d << 16 >> 16;
					d = e + (d << 1) | 0;
					d = i[d >> 1] | 0;
					c = h;
					return d | 0
				}
				do {
					l = 0;
					s = -32767;
					while(1) {
						o = i[d + (l << 1) >> 1] | 0;
						a = o << 16 >> 16 < s << 16 >> 16;
						t = a ? t : l & 65535;
						l = l + 1 | 0;
						if((l & 65535) << 16 >> 16 == r << 16 >> 16) break;
						else s = a ? s : o
					}
					i[d + (t << 16 >> 16 << 1) >> 1] = -32768;
					i[u + (n << 1) >> 1] = t;
					n = n + 1 | 0
				} while ((n & 65535) << 16 >> 16 != r << 16 >> 16);
				d = f >> 1;
				d = u + (d << 1) | 0;
				d = i[d >> 1] | 0;
				d = d << 16 >> 16;
				d = e + (d << 1) | 0;
				d = i[d >> 1] | 0;
				c = h;
				return d | 0
			}

			function ni(e, r, n, t, o) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				var a = 0,
					s = 0,
					l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0;
				a = c;
				c = c + 32 | 0;
				s = a;
				R = r + 2 | 0;
				g = s + 2 | 0;
				i[s >> 1] = ((i[r >> 1] | 0) >>> 1) + ((i[e >> 1] | 0) >>> 1);
				M = r + 4 | 0;
				F = s + 4 | 0;
				i[g >> 1] = ((i[R >> 1] | 0) >>> 1) + ((i[e + 2 >> 1] | 0) >>> 1);
				k = r + 6 | 0;
				b = s + 6 | 0;
				i[F >> 1] = ((i[M >> 1] | 0) >>> 1) + ((i[e + 4 >> 1] | 0) >>> 1);
				_ = r + 8 | 0;
				v = s + 8 | 0;
				i[b >> 1] = ((i[k >> 1] | 0) >>> 1) + ((i[e + 6 >> 1] | 0) >>> 1);
				p = r + 10 | 0;
				S = s + 10 | 0;
				i[v >> 1] = ((i[_ >> 1] | 0) >>> 1) + ((i[e + 8 >> 1] | 0) >>> 1);
				m = r + 12 | 0;
				w = s + 12 | 0;
				i[S >> 1] = ((i[p >> 1] | 0) >>> 1) + ((i[e + 10 >> 1] | 0) >>> 1);
				E = r + 14 | 0;
				h = s + 14 | 0;
				i[w >> 1] = ((i[m >> 1] | 0) >>> 1) + ((i[e + 12 >> 1] | 0) >>> 1);
				d = r + 16 | 0;
				u = s + 16 | 0;
				i[h >> 1] = ((i[E >> 1] | 0) >>> 1) + ((i[e + 14 >> 1] | 0) >>> 1);
				f = r + 18 | 0;
				l = s + 18 | 0;
				i[u >> 1] = ((i[d >> 1] | 0) >>> 1) + ((i[e + 16 >> 1] | 0) >>> 1);
				i[l >> 1] = ((i[f >> 1] | 0) >>> 1) + ((i[e + 18 >> 1] | 0) >>> 1);
				ci(s, t, o);
				ci(r, t + 22 | 0, o);
				i[s >> 1] = ((i[n >> 1] | 0) >>> 1) + ((i[r >> 1] | 0) >>> 1);
				i[g >> 1] = ((i[n + 2 >> 1] | 0) >>> 1) + ((i[R >> 1] | 0) >>> 1);
				i[F >> 1] = ((i[n + 4 >> 1] | 0) >>> 1) + ((i[M >> 1] | 0) >>> 1);
				i[b >> 1] = ((i[n + 6 >> 1] | 0) >>> 1) + ((i[k >> 1] | 0) >>> 1);
				i[v >> 1] = ((i[n + 8 >> 1] | 0) >>> 1) + ((i[_ >> 1] | 0) >>> 1);
				i[S >> 1] = ((i[n + 10 >> 1] | 0) >>> 1) + ((i[p >> 1] | 0) >>> 1);
				i[w >> 1] = ((i[n + 12 >> 1] | 0) >>> 1) + ((i[m >> 1] | 0) >>> 1);
				i[h >> 1] = ((i[n + 14 >> 1] | 0) >>> 1) + ((i[E >> 1] | 0) >>> 1);
				i[u >> 1] = ((i[n + 16 >> 1] | 0) >>> 1) + ((i[d >> 1] | 0) >>> 1);
				i[l >> 1] = ((i[n + 18 >> 1] | 0) >>> 1) + ((i[f >> 1] | 0) >>> 1);
				ci(s, t + 44 | 0, o);
				ci(n, t + 66 | 0, o);
				c = a;
				return
			}

			function ti(e, r, n, t, o) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				var a = 0,
					s = 0,
					l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0;
				a = c;
				c = c + 32 | 0;
				s = a;
				R = r + 2 | 0;
				g = s + 2 | 0;
				i[s >> 1] = ((i[r >> 1] | 0) >>> 1) + ((i[e >> 1] | 0) >>> 1);
				M = r + 4 | 0;
				F = s + 4 | 0;
				i[g >> 1] = ((i[R >> 1] | 0) >>> 1) + ((i[e + 2 >> 1] | 0) >>> 1);
				k = r + 6 | 0;
				b = s + 6 | 0;
				i[F >> 1] = ((i[M >> 1] | 0) >>> 1) + ((i[e + 4 >> 1] | 0) >>> 1);
				_ = r + 8 | 0;
				v = s + 8 | 0;
				i[b >> 1] = ((i[k >> 1] | 0) >>> 1) + ((i[e + 6 >> 1] | 0) >>> 1);
				p = r + 10 | 0;
				S = s + 10 | 0;
				i[v >> 1] = ((i[_ >> 1] | 0) >>> 1) + ((i[e + 8 >> 1] | 0) >>> 1);
				m = r + 12 | 0;
				w = s + 12 | 0;
				i[S >> 1] = ((i[p >> 1] | 0) >>> 1) + ((i[e + 10 >> 1] | 0) >>> 1);
				E = r + 14 | 0;
				h = s + 14 | 0;
				i[w >> 1] = ((i[m >> 1] | 0) >>> 1) + ((i[e + 12 >> 1] | 0) >>> 1);
				d = r + 16 | 0;
				u = s + 16 | 0;
				i[h >> 1] = ((i[E >> 1] | 0) >>> 1) + ((i[e + 14 >> 1] | 0) >>> 1);
				f = r + 18 | 0;
				l = s + 18 | 0;
				i[u >> 1] = ((i[d >> 1] | 0) >>> 1) + ((i[e + 16 >> 1] | 0) >>> 1);
				i[l >> 1] = ((i[f >> 1] | 0) >>> 1) + ((i[e + 18 >> 1] | 0) >>> 1);
				ci(s, t, o);
				i[s >> 1] = ((i[n >> 1] | 0) >>> 1) + ((i[r >> 1] | 0) >>> 1);
				i[g >> 1] = ((i[n + 2 >> 1] | 0) >>> 1) + ((i[R >> 1] | 0) >>> 1);
				i[F >> 1] = ((i[n + 4 >> 1] | 0) >>> 1) + ((i[M >> 1] | 0) >>> 1);
				i[b >> 1] = ((i[n + 6 >> 1] | 0) >>> 1) + ((i[k >> 1] | 0) >>> 1);
				i[v >> 1] = ((i[n + 8 >> 1] | 0) >>> 1) + ((i[_ >> 1] | 0) >>> 1);
				i[S >> 1] = ((i[n + 10 >> 1] | 0) >>> 1) + ((i[p >> 1] | 0) >>> 1);
				i[w >> 1] = ((i[n + 12 >> 1] | 0) >>> 1) + ((i[m >> 1] | 0) >>> 1);
				i[h >> 1] = ((i[n + 14 >> 1] | 0) >>> 1) + ((i[E >> 1] | 0) >>> 1);
				i[u >> 1] = ((i[n + 16 >> 1] | 0) >>> 1) + ((i[d >> 1] | 0) >>> 1);
				i[l >> 1] = ((i[n + 18 >> 1] | 0) >>> 1) + ((i[f >> 1] | 0) >>> 1);
				ci(s, t + 44 | 0, o);
				c = a;
				return
			}

			function ii(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var o = 0,
					a = 0,
					s = 0,
					l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0,
					C = 0,
					I = 0;
				o = c;
				c = c + 32 | 0;
				a = o;
				P = i[e >> 1] | 0;
				i[a >> 1] = P - (P >>> 2) + ((i[r >> 1] | 0) >>> 2);
				P = e + 2 | 0;
				T = i[P >> 1] | 0;
				C = r + 2 | 0;
				N = a + 2 | 0;
				i[N >> 1] = T - (T >>> 2) + ((i[C >> 1] | 0) >>> 2);
				T = e + 4 | 0;
				y = i[T >> 1] | 0;
				D = r + 4 | 0;
				A = a + 4 | 0;
				i[A >> 1] = y - (y >>> 2) + ((i[D >> 1] | 0) >>> 2);
				y = e + 6 | 0;
				M = i[y >> 1] | 0;
				O = r + 6 | 0;
				R = a + 6 | 0;
				i[R >> 1] = M - (M >>> 2) + ((i[O >> 1] | 0) >>> 2);
				M = e + 8 | 0;
				b = i[M >> 1] | 0;
				g = r + 8 | 0;
				F = a + 8 | 0;
				i[F >> 1] = b - (b >>> 2) + ((i[g >> 1] | 0) >>> 2);
				b = e + 10 | 0;
				p = i[b >> 1] | 0;
				k = r + 10 | 0;
				_ = a + 10 | 0;
				i[_ >> 1] = p - (p >>> 2) + ((i[k >> 1] | 0) >>> 2);
				p = e + 12 | 0;
				w = i[p >> 1] | 0;
				v = r + 12 | 0;
				S = a + 12 | 0;
				i[S >> 1] = w - (w >>> 2) + ((i[v >> 1] | 0) >>> 2);
				w = e + 14 | 0;
				d = i[w >> 1] | 0;
				m = r + 14 | 0;
				E = a + 14 | 0;
				i[E >> 1] = d - (d >>> 2) + ((i[m >> 1] | 0) >>> 2);
				d = e + 16 | 0;
				l = i[d >> 1] | 0;
				h = r + 16 | 0;
				u = a + 16 | 0;
				i[u >> 1] = l - (l >>> 2) + ((i[h >> 1] | 0) >>> 2);
				l = e + 18 | 0;
				I = i[l >> 1] | 0;
				f = r + 18 | 0;
				s = a + 18 | 0;
				i[s >> 1] = I - (I >>> 2) + ((i[f >> 1] | 0) >>> 2);
				ci(a, n, t);
				i[a >> 1] = ((i[e >> 1] | 0) >>> 1) + ((i[r >> 1] | 0) >>> 1);
				i[N >> 1] = ((i[P >> 1] | 0) >>> 1) + ((i[C >> 1] | 0) >>> 1);
				i[A >> 1] = ((i[T >> 1] | 0) >>> 1) + ((i[D >> 1] | 0) >>> 1);
				i[R >> 1] = ((i[y >> 1] | 0) >>> 1) + ((i[O >> 1] | 0) >>> 1);
				i[F >> 1] = ((i[M >> 1] | 0) >>> 1) + ((i[g >> 1] | 0) >>> 1);
				i[_ >> 1] = ((i[b >> 1] | 0) >>> 1) + ((i[k >> 1] | 0) >>> 1);
				i[S >> 1] = ((i[p >> 1] | 0) >>> 1) + ((i[v >> 1] | 0) >>> 1);
				i[E >> 1] = ((i[w >> 1] | 0) >>> 1) + ((i[m >> 1] | 0) >>> 1);
				i[u >> 1] = ((i[d >> 1] | 0) >>> 1) + ((i[h >> 1] | 0) >>> 1);
				i[s >> 1] = ((i[l >> 1] | 0) >>> 1) + ((i[f >> 1] | 0) >>> 1);
				ci(a, n + 22 | 0, t);
				I = i[r >> 1] | 0;
				i[a >> 1] = I - (I >>> 2) + ((i[e >> 1] | 0) >>> 2);
				e = i[C >> 1] | 0;
				i[N >> 1] = e - (e >>> 2) + ((i[P >> 1] | 0) >>> 2);
				e = i[D >> 1] | 0;
				i[A >> 1] = e - (e >>> 2) + ((i[T >> 1] | 0) >>> 2);
				e = i[O >> 1] | 0;
				i[R >> 1] = e - (e >>> 2) + ((i[y >> 1] | 0) >>> 2);
				e = i[g >> 1] | 0;
				i[F >> 1] = e - (e >>> 2) + ((i[M >> 1] | 0) >>> 2);
				e = i[k >> 1] | 0;
				i[_ >> 1] = e - (e >>> 2) + ((i[b >> 1] | 0) >>> 2);
				e = i[v >> 1] | 0;
				i[S >> 1] = e - (e >>> 2) + ((i[p >> 1] | 0) >>> 2);
				e = i[m >> 1] | 0;
				i[E >> 1] = e - (e >>> 2) + ((i[w >> 1] | 0) >>> 2);
				e = i[h >> 1] | 0;
				i[u >> 1] = e - (e >>> 2) + ((i[d >> 1] | 0) >>> 2);
				e = i[f >> 1] | 0;
				i[s >> 1] = e - (e >>> 2) + ((i[l >> 1] | 0) >>> 2);
				ci(a, n + 44 | 0, t);
				ci(r, n + 66 | 0, t);
				c = o;
				return
			}

			function oi(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var o = 0,
					a = 0,
					s = 0,
					l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0,
					C = 0,
					I = 0;
				o = c;
				c = c + 32 | 0;
				a = o;
				P = i[e >> 1] | 0;
				i[a >> 1] = P - (P >>> 2) + ((i[r >> 1] | 0) >>> 2);
				P = e + 2 | 0;
				T = i[P >> 1] | 0;
				C = r + 2 | 0;
				N = a + 2 | 0;
				i[N >> 1] = T - (T >>> 2) + ((i[C >> 1] | 0) >>> 2);
				T = e + 4 | 0;
				y = i[T >> 1] | 0;
				D = r + 4 | 0;
				A = a + 4 | 0;
				i[A >> 1] = y - (y >>> 2) + ((i[D >> 1] | 0) >>> 2);
				y = e + 6 | 0;
				M = i[y >> 1] | 0;
				O = r + 6 | 0;
				R = a + 6 | 0;
				i[R >> 1] = M - (M >>> 2) + ((i[O >> 1] | 0) >>> 2);
				M = e + 8 | 0;
				b = i[M >> 1] | 0;
				g = r + 8 | 0;
				F = a + 8 | 0;
				i[F >> 1] = b - (b >>> 2) + ((i[g >> 1] | 0) >>> 2);
				b = e + 10 | 0;
				p = i[b >> 1] | 0;
				k = r + 10 | 0;
				_ = a + 10 | 0;
				i[_ >> 1] = p - (p >>> 2) + ((i[k >> 1] | 0) >>> 2);
				p = e + 12 | 0;
				w = i[p >> 1] | 0;
				v = r + 12 | 0;
				S = a + 12 | 0;
				i[S >> 1] = w - (w >>> 2) + ((i[v >> 1] | 0) >>> 2);
				w = e + 14 | 0;
				d = i[w >> 1] | 0;
				m = r + 14 | 0;
				E = a + 14 | 0;
				i[E >> 1] = d - (d >>> 2) + ((i[m >> 1] | 0) >>> 2);
				d = e + 16 | 0;
				l = i[d >> 1] | 0;
				h = r + 16 | 0;
				u = a + 16 | 0;
				i[u >> 1] = l - (l >>> 2) + ((i[h >> 1] | 0) >>> 2);
				l = e + 18 | 0;
				I = i[l >> 1] | 0;
				f = r + 18 | 0;
				s = a + 18 | 0;
				i[s >> 1] = I - (I >>> 2) + ((i[f >> 1] | 0) >>> 2);
				ci(a, n, t);
				i[a >> 1] = ((i[e >> 1] | 0) >>> 1) + ((i[r >> 1] | 0) >>> 1);
				i[N >> 1] = ((i[P >> 1] | 0) >>> 1) + ((i[C >> 1] | 0) >>> 1);
				i[A >> 1] = ((i[T >> 1] | 0) >>> 1) + ((i[D >> 1] | 0) >>> 1);
				i[R >> 1] = ((i[y >> 1] | 0) >>> 1) + ((i[O >> 1] | 0) >>> 1);
				i[F >> 1] = ((i[M >> 1] | 0) >>> 1) + ((i[g >> 1] | 0) >>> 1);
				i[_ >> 1] = ((i[b >> 1] | 0) >>> 1) + ((i[k >> 1] | 0) >>> 1);
				i[S >> 1] = ((i[p >> 1] | 0) >>> 1) + ((i[v >> 1] | 0) >>> 1);
				i[E >> 1] = ((i[w >> 1] | 0) >>> 1) + ((i[m >> 1] | 0) >>> 1);
				i[u >> 1] = ((i[d >> 1] | 0) >>> 1) + ((i[h >> 1] | 0) >>> 1);
				i[s >> 1] = ((i[l >> 1] | 0) >>> 1) + ((i[f >> 1] | 0) >>> 1);
				ci(a, n + 22 | 0, t);
				r = i[r >> 1] | 0;
				i[a >> 1] = r - (r >>> 2) + ((i[e >> 1] | 0) >>> 2);
				e = i[C >> 1] | 0;
				i[N >> 1] = e - (e >>> 2) + ((i[P >> 1] | 0) >>> 2);
				e = i[D >> 1] | 0;
				i[A >> 1] = e - (e >>> 2) + ((i[T >> 1] | 0) >>> 2);
				e = i[O >> 1] | 0;
				i[R >> 1] = e - (e >>> 2) + ((i[y >> 1] | 0) >>> 2);
				e = i[g >> 1] | 0;
				i[F >> 1] = e - (e >>> 2) + ((i[M >> 1] | 0) >>> 2);
				e = i[k >> 1] | 0;
				i[_ >> 1] = e - (e >>> 2) + ((i[b >> 1] | 0) >>> 2);
				e = i[v >> 1] | 0;
				i[S >> 1] = e - (e >>> 2) + ((i[p >> 1] | 0) >>> 2);
				e = i[m >> 1] | 0;
				i[E >> 1] = e - (e >>> 2) + ((i[w >> 1] | 0) >>> 2);
				e = i[h >> 1] | 0;
				i[u >> 1] = e - (e >>> 2) + ((i[d >> 1] | 0) >>> 2);
				e = i[f >> 1] | 0;
				i[s >> 1] = e - (e >>> 2) + ((i[l >> 1] | 0) >>> 2);
				ci(a, n + 44 | 0, t);
				c = o;
				return
			}

			function ai(e, r) {
				e = e | 0;
				r = r | 0;
				var n = 0,
					t = 0;
				if((e | 0) < 1) {
					r = 1073741823;
					return r | 0
				}
				n = (vi(e) | 0) << 16 >> 16;
				r = 30 - n | 0;
				e = e << n >> (r & 1 ^ 1);
				n = (e >> 25 << 16) + -1048576 >> 16;
				t = i[7030 + (n << 1) >> 1] | 0;
				r = (t << 16) - (ee(t - (s[7030 + (n + 1 << 1) >> 1] | 0) << 16 >> 15, e >>> 10 & 32767) | 0) >> (r << 16 >> 17) + 1;
				return r | 0
			}

			function si(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				t = vi(e) | 0;
				li(e << (t << 16 >> 16), t, r, n);
				return
			}

			function li(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				if((e | 0) < 1) {
					i[n >> 1] = 0;
					n = 0;
					i[t >> 1] = n;
					return
				} else {
					i[n >> 1] = 30 - (r & 65535);
					n = (e >> 25 << 16) + -2097152 >> 16;
					r = i[7128 + (n << 1) >> 1] | 0;
					n = ((r << 16) - (ee(e >>> 9 & 65534, r - (s[7128 + (n + 1 << 1) >> 1] | 0) << 16 >> 16) | 0) | 0) >>> 16 & 65535;
					i[t >> 1] = n;
					return
				}
			}

			function fi(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					o = 0;
				t = e + 2 | 0;
				n = i[t >> 1] | 0;
				i[r >> 1] = n;
				o = e + 4 | 0;
				i[r + 2 >> 1] = (s[o >> 1] | 0) - (s[e >> 1] | 0);
				i[r + 4 >> 1] = (s[e + 6 >> 1] | 0) - (s[t >> 1] | 0);
				t = e + 8 | 0;
				i[r + 6 >> 1] = (s[t >> 1] | 0) - (s[o >> 1] | 0);
				i[r + 8 >> 1] = (s[e + 10 >> 1] | 0) - (s[e + 6 >> 1] | 0);
				o = e + 12 | 0;
				i[r + 10 >> 1] = (s[o >> 1] | 0) - (s[t >> 1] | 0);
				i[r + 12 >> 1] = (s[e + 14 >> 1] | 0) - (s[e + 10 >> 1] | 0);
				i[r + 14 >> 1] = (s[e + 16 >> 1] | 0) - (s[o >> 1] | 0);
				i[r + 16 >> 1] = (s[e + 18 >> 1] | 0) - (s[e + 14 >> 1] | 0);
				i[r + 18 >> 1] = 16384 - (s[e + 16 >> 1] | 0);
				e = 10;
				o = r;
				while(1) {
					n = n << 16 >> 16;
					r = (n << 16) + -120782848 | 0;
					if((r | 0) > 0) r = 1843 - ((r >> 16) * 12484 >> 16) | 0;
					else r = 3427 - ((n * 56320 | 0) >>> 16) | 0;
					t = o + 2 | 0;
					i[o >> 1] = r << 3;
					e = e + -1 << 16 >> 16;
					if(!(e << 16 >> 16)) break;
					n = i[t >> 1] | 0;
					o = t
				}
				return
			}

			function ui(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				n = r << 16 >> 16;
				if(r << 16 >> 16 > 31) {
					r = 0;
					return r | 0
				}
				if(r << 16 >> 16 > 0) return((1 << n + -1 & e | 0) != 0 & 1) + (r << 16 >> 16 < 31 ? e >> n : 0) | 0;
				n = 0 - n << 16 >> 16;
				r = e << n;
				r = (r >> n | 0) == (e | 0) ? r : e >> 31 ^ 2147483647;
				return r | 0
			}

			function ci(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					a = 0,
					s = 0,
					l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0;
				p = c;
				c = c + 48 | 0;
				m = p + 24 | 0;
				S = p;
				E = m + 4 | 0;
				o[m >> 2] = 16777216;
				t = 0 - (i[e >> 1] | 0) | 0;
				w = m + 8 | 0;
				o[E >> 2] = t << 10;
				a = i[e + 4 >> 1] | 0;
				u = t >> 6;
				o[w >> 2] = 33554432 - (((ee((t << 9) - (u << 15) << 16 >> 16, a) | 0) >> 15) + (ee(u, a) | 0) << 2);
				u = m + 4 | 0;
				a = (o[u >> 2] | 0) - (a << 10) | 0;
				o[u >> 2] = a;
				u = m + 12 | 0;
				t = m + 4 | 0;
				o[u >> 2] = a;
				n = i[e + 8 >> 1] | 0;
				s = a;
				d = 1;
				while(1) {
					f = u + -4 | 0;
					l = o[f >> 2] | 0;
					h = l >> 16;
					o[u >> 2] = s + a - (((ee((l >>> 1) - (h << 15) << 16 >> 16, n) | 0) >> 15) + (ee(h, n) | 0) << 2);
					if((d | 0) == 2) break;
					s = o[u + -12 >> 2] | 0;
					u = f;
					a = l;
					d = d + 1 | 0
				}
				o[t >> 2] = (o[t >> 2] | 0) - (n << 10);
				n = m + 16 | 0;
				t = o[m + 8 >> 2] | 0;
				o[n >> 2] = t;
				f = i[e + 12 >> 1] | 0;
				a = t;
				u = 1;
				while(1) {
					l = n + -4 | 0;
					s = o[l >> 2] | 0;
					h = s >> 16;
					o[n >> 2] = a + t - (((ee((s >>> 1) - (h << 15) << 16 >> 16, f) | 0) >> 15) + (ee(h, f) | 0) << 2);
					if((u | 0) == 3) break;
					a = o[n + -12 >> 2] | 0;
					n = l;
					t = s;
					u = u + 1 | 0
				}
				n = m + 4 | 0;
				o[n >> 2] = (o[n >> 2] | 0) - (f << 10);
				n = m + 20 | 0;
				a = o[m + 12 >> 2] | 0;
				o[n >> 2] = a;
				t = i[e + 16 >> 1] | 0;
				s = a;
				u = 1;
				while(1) {
					f = n + -4 | 0;
					l = o[f >> 2] | 0;
					h = l >> 16;
					o[n >> 2] = s + a - (((ee((l >>> 1) - (h << 15) << 16 >> 16, t) | 0) >> 15) + (ee(h, t) | 0) << 2);
					if((u | 0) == 4) break;
					s = o[n + -12 >> 2] | 0;
					n = f;
					a = l;
					u = u + 1 | 0
				}
				u = m + 4 | 0;
				o[u >> 2] = (o[u >> 2] | 0) - (t << 10);
				o[S >> 2] = 16777216;
				u = 0 - (i[e + 2 >> 1] | 0) | 0;
				h = S + 8 | 0;
				o[S + 4 >> 2] = u << 10;
				t = i[e + 6 >> 1] | 0;
				d = u >> 6;
				o[h >> 2] = 33554432 - (((ee((u << 9) - (d << 15) << 16 >> 16, t) | 0) >> 15) + (ee(d, t) | 0) << 2);
				d = S + 4 | 0;
				t = (o[d >> 2] | 0) - (t << 10) | 0;
				o[d >> 2] = t;
				d = S + 12 | 0;
				u = S + 4 | 0;
				o[d >> 2] = t;
				f = i[e + 10 >> 1] | 0;
				a = t;
				n = 1;
				while(1) {
					l = d + -4 | 0;
					s = o[l >> 2] | 0;
					v = s >> 16;
					o[d >> 2] = a + t - (((ee((s >>> 1) - (v << 15) << 16 >> 16, f) | 0) >> 15) + (ee(v, f) | 0) << 2);
					if((n | 0) == 2) break;
					a = o[d + -12 >> 2] | 0;
					d = l;
					t = s;
					n = n + 1 | 0
				}
				o[u >> 2] = (o[u >> 2] | 0) - (f << 10);
				u = S + 16 | 0;
				t = o[S + 8 >> 2] | 0;
				o[u >> 2] = t;
				f = i[e + 14 >> 1] | 0;
				a = t;
				n = 1;
				while(1) {
					l = u + -4 | 0;
					s = o[l >> 2] | 0;
					v = s >> 16;
					o[u >> 2] = a + t - (((ee((s >>> 1) - (v << 15) << 16 >> 16, f) | 0) >> 15) + (ee(v, f) | 0) << 2);
					if((n | 0) == 3) break;
					a = o[u + -12 >> 2] | 0;
					u = l;
					t = s;
					n = n + 1 | 0
				}
				n = S + 4 | 0;
				o[n >> 2] = (o[n >> 2] | 0) - (f << 10);
				n = S + 20 | 0;
				f = o[S + 12 >> 2] | 0;
				o[n >> 2] = f;
				t = i[e + 18 >> 1] | 0;
				l = f;
				u = 1;
				while(1) {
					a = n + -4 | 0;
					s = o[a >> 2] | 0;
					v = s >> 16;
					o[n >> 2] = l + f - (((ee((s >>> 1) - (v << 15) << 16 >> 16, t) | 0) >> 15) + (ee(v, t) | 0) << 2);
					if((u | 0) == 4) break;
					l = o[n + -12 >> 2] | 0;
					n = a;
					f = s;
					u = u + 1 | 0
				}
				l = (o[S + 4 >> 2] | 0) - (t << 10) | 0;
				d = m + 20 | 0;
				f = S + 20 | 0;
				u = o[m + 16 >> 2] | 0;
				e = (o[d >> 2] | 0) + u | 0;
				o[d >> 2] = e;
				d = o[S + 16 >> 2] | 0;
				v = (o[f >> 2] | 0) - d | 0;
				o[f >> 2] = v;
				f = o[m + 12 >> 2] | 0;
				u = u + f | 0;
				o[m + 16 >> 2] = u;
				s = o[S + 12 >> 2] | 0;
				d = d - s | 0;
				o[S + 16 >> 2] = d;
				t = o[w >> 2] | 0;
				f = f + t | 0;
				o[m + 12 >> 2] = f;
				a = o[h >> 2] | 0;
				w = s - a | 0;
				o[S + 12 >> 2] = w;
				s = o[E >> 2] | 0;
				h = t + s | 0;
				o[m + 8 >> 2] = h;
				E = a - l | 0;
				o[S + 8 >> 2] = E;
				m = s + (o[m >> 2] | 0) | 0;
				S = l - (o[S >> 2] | 0) | 0;
				i[r >> 1] = 4096;
				m = m + 4096 | 0;
				i[r + 2 >> 1] = (m + S | 0) >>> 13;
				i[r + 20 >> 1] = (m - S | 0) >>> 13;
				S = h + 4096 | 0;
				i[r + 4 >> 1] = (S + E | 0) >>> 13;
				i[r + 18 >> 1] = (S - E | 0) >>> 13;
				S = f + 4096 | 0;
				i[r + 6 >> 1] = (S + w | 0) >>> 13;
				i[r + 16 >> 1] = (S - w | 0) >>> 13;
				S = u + 4096 | 0;
				i[r + 8 >> 1] = (S + d | 0) >>> 13;
				i[r + 14 >> 1] = (S - d | 0) >>> 13;
				S = e + 4096 | 0;
				i[r + 10 >> 1] = (S + v | 0) >>> 13;
				i[r + 12 >> 1] = (S - v | 0) >>> 13;
				c = p;
				return
			}

			function di(e) {
				e = e | 0;
				var r = 0,
					n = 0,
					t = 0,
					a = 0,
					s = 0;
				if(!e) {
					s = -1;
					return s | 0
				}
				o[e >> 2] = 0;
				r = xi(44) | 0;
				if(!r) {
					s = -1;
					return s | 0
				}
				n = r + 40 | 0;
				if((yi(n) | 0) << 16 >> 16) {
					s = -1;
					return s | 0
				}
				t = r;
				a = 7452;
				s = t + 20 | 0;
				do {
					i[t >> 1] = i[a >> 1] | 0;
					t = t + 2 | 0;
					a = a + 2 | 0
				} while ((t | 0) < (s | 0));
				t = r + 20 | 0;
				a = 7452;
				s = t + 20 | 0;
				do {
					i[t >> 1] = i[a >> 1] | 0;
					t = t + 2 | 0;
					a = a + 2 | 0
				} while ((t | 0) < (s | 0));
				Oi(o[n >> 2] | 0) | 0;
				o[e >> 2] = r;
				s = 0;
				return s | 0
			}

			function hi(e) {
				e = e | 0;
				var r = 0,
					n = 0,
					t = 0;
				if(!e) {
					t = -1;
					return t | 0
				}
				r = e;
				n = 7452;
				t = r + 20 | 0;
				do {
					i[r >> 1] = i[n >> 1] | 0;
					r = r + 2 | 0;
					n = n + 2 | 0
				} while ((r | 0) < (t | 0));
				r = e + 20 | 0;
				n = 7452;
				t = r + 20 | 0;
				do {
					i[r >> 1] = i[n >> 1] | 0;
					r = r + 2 | 0;
					n = n + 2 | 0
				} while ((r | 0) < (t | 0));
				Oi(o[e + 40 >> 2] | 0) | 0;
				t = 0;
				return t | 0
			}

			function Ei(e) {
				e = e | 0;
				var r = 0;
				if(!e) return;
				r = o[e >> 2] | 0;
				if(!r) return;
				Ai(r + 40 | 0);
				Hi(o[e >> 2] | 0);
				o[e >> 2] = 0;
				return
			}

			function wi(e, r, n, t, a, s, l, f) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				f = f | 0;
				var u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0;
				w = c;
				c = c + 64 | 0;
				E = w + 44 | 0;
				u = w + 24 | 0;
				d = w + 4 | 0;
				h = w;
				if((r | 0) == 7) {
					Xt(t + 22 | 0, u, e, f);
					Xt(t + 66 | 0, s, u, f);
					ti(e, u, s, t, f);
					if((n | 0) == 8) t = 6;
					else {
						gi(o[e + 40 >> 2] | 0, u, s, d, E, o[l >> 2] | 0, f);
						ni(e + 20 | 0, d, E, a, f);
						a = (o[l >> 2] | 0) + 10 | 0;
						t = 7
					}
				} else {
					Xt(t + 66 | 0, s, e, f);
					oi(e, s, t, f);
					if((n | 0) == 8) t = 6;
					else {
						Fi(o[e + 40 >> 2] | 0, r, s, E, o[l >> 2] | 0, h, f);
						ii(e + 20 | 0, E, a, f);
						a = (o[l >> 2] | 0) + 6 | 0;
						t = 7
					}
				}
				if((t | 0) == 6) {
					t = e;
					a = t + 20 | 0;
					do {
						i[t >> 1] = i[s >> 1] | 0;
						t = t + 2 | 0;
						s = s + 2 | 0
					} while ((t | 0) < (a | 0));
					c = w;
					return
				} else if((t | 0) == 7) {
					o[l >> 2] = a;
					t = e;
					a = t + 20 | 0;
					do {
						i[t >> 1] = i[s >> 1] | 0;
						t = t + 2 | 0;
						s = s + 2 | 0
					} while ((t | 0) < (a | 0));
					t = e + 20 | 0;
					s = E;
					a = t + 20 | 0;
					do {
						i[t >> 1] = i[s >> 1] | 0;
						t = t + 2 | 0;
						s = s + 2 | 0
					} while ((t | 0) < (a | 0));
					c = w;
					return
				}
			}

			function mi(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var o = 0,
					a = 0,
					s = 0;
				if(n << 16 >> 16 > 0) t = 0;
				else return;
				do {
					a = i[e + (t << 1) >> 1] | 0;
					s = a >> 8;
					o = i[7194 + (s << 1) >> 1] | 0;
					i[r + (t << 1) >> 1] = ((ee((i[7194 + (s + 1 << 1) >> 1] | 0) - o | 0, a & 255) | 0) >>> 8) + o;
					t = t + 1 | 0
				} while ((t & 65535) << 16 >> 16 != n << 16 >> 16);
				return
			}

			function Si(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var o = 0,
					a = 0,
					s = 0;
				t = (n << 16 >> 16) + -1 | 0;
				n = t & 65535;
				if(n << 16 >> 16 <= -1) return;
				o = 63;
				s = r + (t << 1) | 0;
				a = e + (t << 1) | 0;
				while(1) {
					e = i[a >> 1] | 0;
					r = o;
					while(1) {
						t = r << 16 >> 16;
						o = i[7194 + (t << 1) >> 1] | 0;
						if(e << 16 >> 16 > o << 16 >> 16) r = r + -1 << 16 >> 16;
						else break
					}
					i[s >> 1] = (((ee(i[7324 + (t << 1) >> 1] | 0, (e << 16 >> 16) - (o << 16 >> 16) | 0) | 0) + 2048 | 0) >>> 12) + (t << 8);
					n = n + -1 << 16 >> 16;
					if(n << 16 >> 16 > -1) {
						o = r;
						s = s + -2 | 0;
						a = a + -2 | 0
					} else break
				}
				return
			}

			function pi(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				e = (ee(r << 16 >> 16, e << 16 >> 16) | 0) + 16384 >> 15;
				e = e | 0 - (e & 65536);
				if((e | 0) <= 32767) {
					if((e | 0) < -32768) {
						o[n >> 2] = 1;
						e = -32768
					}
				} else {
					o[n >> 2] = 1;
					e = 32767
				}
				return e & 65535 | 0
			}

			function vi(e) {
				e = e | 0;
				var r = 0;
				e: do
					if((e | 0) != 0 ? (r = e - (e >>> 31) | 0, r = r >> 31 ^ r, (r & 1073741824 | 0) == 0) : 0) {
						e = r;
						r = 0;
						while(1) {
							if(e & 536870912) {
								e = 7;
								break
							}
							if(e & 268435456) {
								e = 8;
								break
							}
							if(e & 134217728) {
								e = 9;
								break
							}
							r = r + 4 << 16 >> 16;
							e = e << 4;
							if(e & 1073741824) break e
						}
						if((e | 0) == 7) {
							r = r | 1;
							break
						} else if((e | 0) == 8) {
							r = r | 2;
							break
						} else if((e | 0) == 9) {
							r = r | 3;
							break
						}
					} else r = 0;
				while(0);
				return r | 0
			}

			function _i(e) {
				e = e | 0;
				var r = 0,
					n = 0;
				if(!(e << 16 >> 16)) {
					n = 0;
					return n | 0
				}
				r = (e & 65535) - ((e & 65535) >>> 15 & 65535) | 0;
				r = (r << 16 >> 31 ^ r) << 16;
				e = r >> 16;
				if(!(e & 16384)) {
					n = r;
					r = 0
				} else {
					n = 0;
					return n | 0
				}
				while(1) {
					if(e & 8192) {
						e = r;
						n = 7;
						break
					}
					if(e & 4096) {
						e = r;
						n = 8;
						break
					}
					if(e & 2048) {
						e = r;
						n = 9;
						break
					}
					r = r + 4 << 16 >> 16;
					n = n << 4;
					e = n >> 16;
					if(e & 16384) {
						e = r;
						n = 10;
						break
					}
				}
				if((n | 0) == 7) {
					n = e | 1;
					return n | 0
				} else if((n | 0) == 8) {
					n = e | 2;
					return n | 0
				} else if((n | 0) == 9) {
					n = e | 3;
					return n | 0
				} else if((n | 0) == 10) return e | 0;
				return 0
			}

			function bi(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					a = 0,
					l = 0;
				r = r << 16 >> 16;
				if((r & 134217727 | 0) == 33554432) {
					o[n >> 2] = 1;
					r = 2147483647
				} else r = r << 6;
				t = r >>> 16 & 31;
				l = i[7792 + (t << 1) >> 1] | 0;
				a = l << 16;
				r = ee(l - (s[7792 + (t + 1 << 1) >> 1] | 0) << 16 >> 16, r >>> 1 & 32767) | 0;
				if((r | 0) == 1073741824) {
					o[n >> 2] = 1;
					t = 2147483647
				} else t = r << 1;
				r = a - t | 0;
				if(((r ^ a) & (t ^ a) | 0) >= 0) {
					l = r;
					e = e & 65535;
					e = 30 - e | 0;
					e = e & 65535;
					n = ui(l, e, n) | 0;
					return n | 0
				}
				o[n >> 2] = 1;
				l = (l >>> 15 & 1) + 2147483647 | 0;
				e = e & 65535;
				e = 30 - e | 0;
				e = e & 65535;
				n = ui(l, e, n) | 0;
				return n | 0
			}

			function ki(e, r, n, t, o, a) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				a = a | 0;
				var s = 0,
					l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0;
				E = c;
				c = c + 48 | 0;
				h = E;
				d = 0 - (n & 65535) | 0;
				d = o << 16 >> 16 == 0 ? d : d << 1 & 131070;
				n = d & 65535;
				d = (n << 16 >> 16 < 0 ? d + 6 | 0 : d) << 16 >> 16;
				a = 6 - d | 0;
				i[h >> 1] = i[7858 + (d << 1) >> 1] | 0;
				i[h + 2 >> 1] = i[7858 + (a << 1) >> 1] | 0;
				i[h + 4 >> 1] = i[7858 + (d + 6 << 1) >> 1] | 0;
				i[h + 6 >> 1] = i[7858 + (a + 6 << 1) >> 1] | 0;
				i[h + 8 >> 1] = i[7858 + (d + 12 << 1) >> 1] | 0;
				i[h + 10 >> 1] = i[7858 + (a + 12 << 1) >> 1] | 0;
				i[h + 12 >> 1] = i[7858 + (d + 18 << 1) >> 1] | 0;
				i[h + 14 >> 1] = i[7858 + (a + 18 << 1) >> 1] | 0;
				i[h + 16 >> 1] = i[7858 + (d + 24 << 1) >> 1] | 0;
				i[h + 18 >> 1] = i[7858 + (a + 24 << 1) >> 1] | 0;
				i[h + 20 >> 1] = i[7858 + (d + 30 << 1) >> 1] | 0;
				i[h + 22 >> 1] = i[7858 + (a + 30 << 1) >> 1] | 0;
				i[h + 24 >> 1] = i[7858 + (d + 36 << 1) >> 1] | 0;
				i[h + 26 >> 1] = i[7858 + (a + 36 << 1) >> 1] | 0;
				i[h + 28 >> 1] = i[7858 + (d + 42 << 1) >> 1] | 0;
				i[h + 30 >> 1] = i[7858 + (a + 42 << 1) >> 1] | 0;
				i[h + 32 >> 1] = i[7858 + (d + 48 << 1) >> 1] | 0;
				i[h + 34 >> 1] = i[7858 + (a + 48 << 1) >> 1] | 0;
				i[h + 36 >> 1] = i[7858 + (d + 54 << 1) >> 1] | 0;
				i[h + 38 >> 1] = i[7858 + (a + 54 << 1) >> 1] | 0;
				a = t << 16 >> 16 >>> 1 & 65535;
				if(!(a << 16 >> 16)) {
					c = E;
					return
				}
				d = e + ((n << 16 >> 16 >> 15 << 16 >> 16) - (r << 16 >> 16) << 1) | 0;
				while(1) {
					u = d + 2 | 0;
					s = i[u >> 1] | 0;
					r = s;
					t = d;
					l = 5;
					f = h;
					o = 16384;
					n = 16384;
					while(1) {
						m = i[f >> 1] | 0;
						S = (ee(m, r << 16 >> 16) | 0) + n | 0;
						w = i[u + -2 >> 1] | 0;
						n = (ee(w, m) | 0) + o | 0;
						m = t;
						t = t + 4 | 0;
						p = i[f + 2 >> 1] | 0;
						n = n + (ee(p, s << 16 >> 16) | 0) | 0;
						o = i[t >> 1] | 0;
						p = S + (ee(o, p) | 0) | 0;
						u = u + -4 | 0;
						S = i[f + 4 >> 1] | 0;
						w = p + (ee(S, w) | 0) | 0;
						r = i[u >> 1] | 0;
						S = n + (ee(r << 16 >> 16, S) | 0) | 0;
						n = i[f + 6 >> 1] | 0;
						o = S + (ee(n, o) | 0) | 0;
						s = i[m + 6 >> 1] | 0;
						n = w + (ee(s << 16 >> 16, n) | 0) | 0;
						if(l << 16 >> 16 <= 1) break;
						else {
							l = l + -1 << 16 >> 16;
							f = f + 8 | 0
						}
					}
					i[e >> 1] = o >>> 15;
					i[e + 2 >> 1] = n >>> 15;
					a = a + -1 << 16 >> 16;
					if(!(a << 16 >> 16)) break;
					else {
						d = d + 4 | 0;
						e = e + 4 | 0
					}
				}
				c = E;
				return
			}

			function Fi(e, r, n, t, o, a, l) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				a = a | 0;
				l = l | 0;
				var f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0;
				O = c;
				c = c + 144 | 0;
				v = O + 120 | 0;
				M = O + 100 | 0;
				R = O + 80 | 0;
				y = O + 60 | 0;
				g = O + 40 | 0;
				m = O + 20 | 0;
				S = O;
				Si(n, v, 10, l);
				fi(v, M, l);
				if((r | 0) == 8) {
					i[a >> 1] = 0;
					u = 2147483647;
					p = 0;
					while(1) {
						h = p * 10 | 0;
						n = 0;
						d = 0;
						do {
							F = (s[7980 + (d + h << 1) >> 1] | 0) + (s[8140 + (d << 1) >> 1] | 0) | 0;
							i[S + (d << 1) >> 1] = F;
							F = (s[v + (d << 1) >> 1] | 0) - (F & 65535) | 0;
							i[m + (d << 1) >> 1] = F;
							F = F << 16;
							n = (ee(F >> 15, F >> 16) | 0) + n | 0;
							d = d + 1 | 0
						} while ((d | 0) != 10);
						if((n | 0) < (u | 0)) {
							_ = y;
							w = m;
							E = _ + 20 | 0;
							do {
								i[_ >> 1] = i[w >> 1] | 0;
								_ = _ + 2 | 0;
								w = w + 2 | 0
							} while ((_ | 0) < (E | 0));
							_ = R;
							w = S;
							E = _ + 20 | 0;
							do {
								i[_ >> 1] = i[w >> 1] | 0;
								_ = _ + 2 | 0;
								w = w + 2 | 0
							} while ((_ | 0) < (E | 0));
							_ = e;
							w = 7980 + (h << 1) | 0;
							E = _ + 20 | 0;
							do {
								i[_ >> 1] = i[w >> 1] | 0;
								_ = _ + 2 | 0;
								w = w + 2 | 0
							} while ((_ | 0) < (E | 0));
							i[a >> 1] = p
						} else n = u;
						p = p + 1 | 0;
						if((p | 0) == 8) break;
						else u = n
					}
				} else {
					n = 0;
					do {
						F = ee(i[8160 + (n << 1) >> 1] | 0, i[e + (n << 1) >> 1] | 0) | 0;
						F = (F >>> 15) + (s[8140 + (n << 1) >> 1] | 0) | 0;
						i[R + (n << 1) >> 1] = F;
						i[y + (n << 1) >> 1] = (s[v + (n << 1) >> 1] | 0) - F;
						n = n + 1 | 0
					} while ((n | 0) != 10)
				}
				do
					if(r >>> 0 >= 2) {
						F = y + 2 | 0;
						k = y + 4 | 0;
						b = s[y >> 1] | 0;
						_ = i[M >> 1] << 1;
						v = s[F >> 1] | 0;
						m = i[M + 2 >> 1] << 1;
						w = s[k >> 1] | 0;
						E = i[M + 4 >> 1] << 1;
						if((r | 0) == 5) {
							S = 2147483647;
							a = 0;
							n = 0;
							p = 17908;
							while(1) {
								d = (ee(b - (s[p >> 1] | 0) << 16 >> 16, _) | 0) >> 16;
								d = ee(d, d) | 0;
								h = (ee(v - (s[p + 2 >> 1] | 0) << 16 >> 16, m) | 0) >> 16;
								d = (ee(h, h) | 0) + d | 0;
								h = (ee(w - (s[p + 4 >> 1] | 0) << 16 >> 16, E) | 0) >> 16;
								h = d + (ee(h, h) | 0) | 0;
								d = (h | 0) < (S | 0);
								n = d ? a : n;
								a = a + 1 << 16 >> 16;
								if(a << 16 >> 16 >= 512) break;
								else {
									S = d ? h : S;
									p = p + 6 | 0
								}
							}
							h = (n << 16 >> 16) * 3 | 0;
							i[y >> 1] = i[17908 + (h << 1) >> 1] | 0;
							i[F >> 1] = i[17908 + (h + 1 << 1) >> 1] | 0;
							i[k >> 1] = i[17908 + (h + 2 << 1) >> 1] | 0;
							i[o >> 1] = n;
							h = y + 6 | 0;
							d = y + 8 | 0;
							b = y + 10 | 0;
							p = s[h >> 1] | 0;
							a = i[M + 6 >> 1] << 1;
							S = s[d >> 1] | 0;
							m = i[M + 8 >> 1] << 1;
							w = s[b >> 1] | 0;
							E = i[M + 10 >> 1] << 1;
							f = 2147483647;
							v = 0;
							n = 0;
							_ = 9716;
							while(1) {
								u = (ee(a, p - (s[_ >> 1] | 0) << 16 >> 16) | 0) >> 16;
								u = ee(u, u) | 0;
								r = (ee(m, S - (s[_ + 2 >> 1] | 0) << 16 >> 16) | 0) >> 16;
								u = (ee(r, r) | 0) + u | 0;
								r = (ee(E, w - (s[_ + 4 >> 1] | 0) << 16 >> 16) | 0) >> 16;
								r = u + (ee(r, r) | 0) | 0;
								u = (r | 0) < (f | 0);
								n = u ? v : n;
								v = v + 1 << 16 >> 16;
								if(v << 16 >> 16 >= 512) break;
								else {
									f = u ? r : f;
									_ = _ + 6 | 0
								}
							}
							f = (n << 16 >> 16) * 3 | 0;
							i[h >> 1] = i[9716 + (f << 1) >> 1] | 0;
							i[d >> 1] = i[9716 + (f + 1 << 1) >> 1] | 0;
							i[b >> 1] = i[9716 + (f + 2 << 1) >> 1] | 0;
							i[o + 2 >> 1] = n;
							f = y + 12 | 0;
							i[o + 4 >> 1] = Mi(f, 12788, M + 12 | 0, 512) | 0;
							v = F;
							p = k;
							n = b;
							u = y;
							break
						} else {
							S = 2147483647;
							a = 0;
							n = 0;
							p = 8180;
							while(1) {
								d = (ee(b - (s[p >> 1] | 0) << 16 >> 16, _) | 0) >> 16;
								d = ee(d, d) | 0;
								h = (ee(v - (s[p + 2 >> 1] | 0) << 16 >> 16, m) | 0) >> 16;
								d = (ee(h, h) | 0) + d | 0;
								h = (ee(w - (s[p + 4 >> 1] | 0) << 16 >> 16, E) | 0) >> 16;
								h = d + (ee(h, h) | 0) | 0;
								d = (h | 0) < (S | 0);
								n = d ? a : n;
								a = a + 1 << 16 >> 16;
								if(a << 16 >> 16 >= 256) break;
								else {
									S = d ? h : S;
									p = p + 6 | 0
								}
							}
							h = (n << 16 >> 16) * 3 | 0;
							i[y >> 1] = i[8180 + (h << 1) >> 1] | 0;
							i[F >> 1] = i[8180 + (h + 1 << 1) >> 1] | 0;
							i[k >> 1] = i[8180 + (h + 2 << 1) >> 1] | 0;
							i[o >> 1] = n;
							h = y + 6 | 0;
							d = y + 8 | 0;
							b = y + 10 | 0;
							p = s[h >> 1] | 0;
							a = i[M + 6 >> 1] << 1;
							S = s[d >> 1] | 0;
							m = i[M + 8 >> 1] << 1;
							w = s[b >> 1] | 0;
							E = i[M + 10 >> 1] << 1;
							f = 2147483647;
							v = 0;
							n = 0;
							_ = 9716;
							while(1) {
								u = (ee(a, p - (s[_ >> 1] | 0) << 16 >> 16) | 0) >> 16;
								u = ee(u, u) | 0;
								r = (ee(m, S - (s[_ + 2 >> 1] | 0) << 16 >> 16) | 0) >> 16;
								u = (ee(r, r) | 0) + u | 0;
								r = (ee(E, w - (s[_ + 4 >> 1] | 0) << 16 >> 16) | 0) >> 16;
								r = u + (ee(r, r) | 0) | 0;
								u = (r | 0) < (f | 0);
								n = u ? v : n;
								v = v + 1 << 16 >> 16;
								if(v << 16 >> 16 >= 512) break;
								else {
									f = u ? r : f;
									_ = _ + 6 | 0
								}
							}
							f = (n << 16 >> 16) * 3 | 0;
							i[h >> 1] = i[9716 + (f << 1) >> 1] | 0;
							i[d >> 1] = i[9716 + (f + 1 << 1) >> 1] | 0;
							i[b >> 1] = i[9716 + (f + 2 << 1) >> 1] | 0;
							i[o + 2 >> 1] = n;
							f = y + 12 | 0;
							i[o + 4 >> 1] = Mi(f, 12788, M + 12 | 0, 512) | 0;
							v = F;
							p = k;
							n = b;
							u = y;
							break
						}
					} else {
						k = y + 2 | 0;
						F = y + 4 | 0;
						h = s[y >> 1] | 0;
						d = i[M >> 1] << 1;
						u = s[k >> 1] | 0;
						f = i[M + 2 >> 1] << 1;
						r = s[F >> 1] | 0;
						E = i[M + 4 >> 1] << 1;
						S = 2147483647;
						a = 0;
						n = 0;
						p = 8180;
						while(1) {
							m = (ee(d, h - (s[p >> 1] | 0) << 16 >> 16) | 0) >> 16;
							m = ee(m, m) | 0;
							w = (ee(f, u - (s[p + 2 >> 1] | 0) << 16 >> 16) | 0) >> 16;
							m = (ee(w, w) | 0) + m | 0;
							w = (ee(E, r - (s[p + 4 >> 1] | 0) << 16 >> 16) | 0) >> 16;
							w = m + (ee(w, w) | 0) | 0;
							m = (w | 0) < (S | 0);
							n = m ? a : n;
							a = a + 1 << 16 >> 16;
							if(a << 16 >> 16 >= 256) break;
							else {
								S = m ? w : S;
								p = p + 6 | 0
							}
						}
						h = (n << 16 >> 16) * 3 | 0;
						i[y >> 1] = i[8180 + (h << 1) >> 1] | 0;
						i[k >> 1] = i[8180 + (h + 1 << 1) >> 1] | 0;
						i[F >> 1] = i[8180 + (h + 2 << 1) >> 1] | 0;
						i[o >> 1] = n;
						h = y + 6 | 0;
						d = y + 8 | 0;
						b = y + 10 | 0;
						p = s[h >> 1] | 0;
						a = i[M + 6 >> 1] << 1;
						S = s[d >> 1] | 0;
						m = i[M + 8 >> 1] << 1;
						w = s[b >> 1] | 0;
						E = i[M + 10 >> 1] << 1;
						f = 2147483647;
						v = 0;
						n = 0;
						_ = 9716;
						while(1) {
							u = (ee(a, p - (s[_ >> 1] | 0) << 16 >> 16) | 0) >> 16;
							u = ee(u, u) | 0;
							r = (ee(m, S - (s[_ + 2 >> 1] | 0) << 16 >> 16) | 0) >> 16;
							u = (ee(r, r) | 0) + u | 0;
							r = (ee(E, w - (s[_ + 4 >> 1] | 0) << 16 >> 16) | 0) >> 16;
							r = u + (ee(r, r) | 0) | 0;
							u = (r | 0) < (f | 0);
							n = u ? v : n;
							v = v + 1 << 16 >> 16;
							if(v << 16 >> 16 >= 256) break;
							else {
								f = u ? r : f;
								_ = _ + 12 | 0
							}
						}
						f = (n << 16 >> 16) * 6 | 0;
						i[h >> 1] = i[9716 + (f << 1) >> 1] | 0;
						i[d >> 1] = i[9716 + ((f | 1) << 1) >> 1] | 0;
						i[b >> 1] = i[9716 + (f + 2 << 1) >> 1] | 0;
						i[o + 2 >> 1] = n;
						f = y + 12 | 0;
						i[o + 4 >> 1] = Mi(f, 16884, M + 12 | 0, 128) | 0;
						v = k;
						p = F;
						n = b;
						u = y
					}
				while(0);
				_ = e;
				w = y;
				E = _ + 20 | 0;
				do {
					i[_ >> 1] = i[w >> 1] | 0;
					_ = _ + 2 | 0;
					w = w + 2 | 0
				} while ((_ | 0) < (E | 0));
				i[g >> 1] = (s[R >> 1] | 0) + (s[u >> 1] | 0);
				i[g + 2 >> 1] = (s[R + 2 >> 1] | 0) + (s[v >> 1] | 0);
				i[g + 4 >> 1] = (s[R + 4 >> 1] | 0) + (s[p >> 1] | 0);
				i[g + 6 >> 1] = (s[R + 6 >> 1] | 0) + (s[h >> 1] | 0);
				i[g + 8 >> 1] = (s[R + 8 >> 1] | 0) + (s[d >> 1] | 0);
				i[g + 10 >> 1] = (s[R + 10 >> 1] | 0) + (s[n >> 1] | 0);
				i[g + 12 >> 1] = (s[R + 12 >> 1] | 0) + (s[f >> 1] | 0);
				i[g + 14 >> 1] = (s[R + 14 >> 1] | 0) + (s[y + 14 >> 1] | 0);
				i[g + 16 >> 1] = (s[R + 16 >> 1] | 0) + (s[y + 16 >> 1] | 0);
				i[g + 18 >> 1] = (s[R + 18 >> 1] | 0) + (s[y + 18 >> 1] | 0);
				Ti(g, 205, 10, l);
				mi(g, t, 10, l);
				c = O;
				return
			}

			function Mi(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var o = 0,
					a = 0,
					l = 0,
					f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0;
				v = e + 2 | 0;
				_ = e + 4 | 0;
				b = e + 6 | 0;
				if(t << 16 >> 16 > 0) {
					d = s[e >> 1] | 0;
					h = i[n >> 1] << 1;
					E = s[v >> 1] | 0;
					w = i[n + 2 >> 1] << 1;
					m = s[_ >> 1] | 0;
					S = i[n + 4 >> 1] << 1;
					p = s[b >> 1] | 0;
					o = i[n + 6 >> 1] << 1;
					f = 2147483647;
					u = 0;
					n = 0;
					c = r;
					while(1) {
						a = (ee(h, d - (s[c >> 1] | 0) << 16 >> 16) | 0) >> 16;
						a = ee(a, a) | 0;
						l = (ee(w, E - (s[c + 2 >> 1] | 0) << 16 >> 16) | 0) >> 16;
						a = (ee(l, l) | 0) + a | 0;
						l = (ee(S, m - (s[c + 4 >> 1] | 0) << 16 >> 16) | 0) >> 16;
						l = a + (ee(l, l) | 0) | 0;
						a = (ee(o, p - (s[c + 6 >> 1] | 0) << 16 >> 16) | 0) >> 16;
						a = l + (ee(a, a) | 0) | 0;
						l = (a | 0) < (f | 0);
						n = l ? u : n;
						u = u + 1 << 16 >> 16;
						if(u << 16 >> 16 >= t << 16 >> 16) break;
						else {
							f = l ? a : f;
							c = c + 8 | 0
						}
					}
				} else n = 0;
				t = n << 16 >> 16 << 2;
				p = t | 1;
				i[e >> 1] = i[r + (t << 1) >> 1] | 0;
				i[v >> 1] = i[r + (p << 1) >> 1] | 0;
				i[_ >> 1] = i[r + (p + 1 << 1) >> 1] | 0;
				i[b >> 1] = i[r + ((t | 3) << 1) >> 1] | 0;
				return n | 0
			}

			function gi(e, r, n, t, o, a, l) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				a = a | 0;
				l = l | 0;
				var f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0,
					C = 0,
					I = 0,
					B = 0;
				C = c;
				c = c + 192 | 0;
				d = C + 160 | 0;
				u = C + 140 | 0;
				O = C + 120 | 0;
				A = C + 100 | 0;
				T = C + 80 | 0;
				D = C + 60 | 0;
				f = C + 40 | 0;
				N = C + 20 | 0;
				P = C;
				Si(r, d, 10, l);
				Si(n, u, 10, l);
				fi(d, O, l);
				fi(u, A, l);
				h = 0;
				n = T;
				r = D;
				E = f;
				while(1) {
					y = (((i[e + (h << 1) >> 1] | 0) * 21299 | 0) >>> 15) + (s[20980 + (h << 1) >> 1] | 0) | 0;
					i[n >> 1] = y;
					i[r >> 1] = (s[d >> 1] | 0) - y;
					i[E >> 1] = (s[u >> 1] | 0) - y;
					h = h + 1 | 0;
					if((h | 0) == 10) break;
					else {
						d = d + 2 | 0;
						u = u + 2 | 0;
						n = n + 2 | 0;
						r = r + 2 | 0;
						E = E + 2 | 0
					}
				}
				i[a >> 1] = Ri(D, f, 21e3, i[O >> 1] | 0, i[O + 2 >> 1] | 0, i[A >> 1] | 0, i[A + 2 >> 1] | 0, 128) | 0;
				i[a + 2 >> 1] = Ri(D + 4 | 0, f + 4 | 0, 22024, i[O + 4 >> 1] | 0, i[O + 6 >> 1] | 0, i[A + 4 >> 1] | 0, i[A + 6 >> 1] | 0, 256) | 0;
				M = D + 8 | 0;
				g = f + 8 | 0;
				R = D + 10 | 0;
				y = f + 10 | 0;
				n = i[M >> 1] | 0;
				w = i[O + 8 >> 1] << 1;
				m = i[R >> 1] | 0;
				S = i[O + 10 >> 1] << 1;
				p = i[g >> 1] | 0;
				v = i[A + 8 >> 1] << 1;
				_ = i[y >> 1] | 0;
				b = i[A + 10 >> 1] << 1;
				u = 2147483647;
				k = 0;
				E = 0;
				F = 24072;
				r = 0;
				while(1) {
					d = i[F >> 1] | 0;
					h = (ee(n - d << 16 >> 16, w) | 0) >> 16;
					h = ee(h, h) | 0;
					d = (ee(d + n << 16 >> 16, w) | 0) >> 16;
					d = ee(d, d) | 0;
					I = i[F + 2 >> 1] | 0;
					B = (ee(m - I << 16 >> 16, S) | 0) >> 16;
					h = (ee(B, B) | 0) + h | 0;
					I = (ee(I + m << 16 >> 16, S) | 0) >> 16;
					d = (ee(I, I) | 0) + d | 0;
					if((h | 0) < (u | 0) | (d | 0) < (u | 0)) {
						B = i[F + 4 >> 1] | 0;
						I = (ee(p - B << 16 >> 16, v) | 0) >> 16;
						I = (ee(I, I) | 0) + h | 0;
						B = (ee(B + p << 16 >> 16, v) | 0) >> 16;
						B = (ee(B, B) | 0) + d | 0;
						d = i[F + 6 >> 1] | 0;
						h = (ee(_ - d << 16 >> 16, b) | 0) >> 16;
						h = I + (ee(h, h) | 0) | 0;
						d = (ee(d + _ << 16 >> 16, b) | 0) >> 16;
						d = B + (ee(d, d) | 0) | 0;
						B = (h | 0) < (u | 0);
						h = B ? h : u;
						I = (d | 0) < (h | 0);
						h = I ? d : h;
						E = B | I ? k : E;
						r = I ? 1 : B ? 0 : r
					} else h = u;
					k = k + 1 << 16 >> 16;
					if(k << 16 >> 16 >= 256) break;
					else {
						u = h;
						F = F + 8 | 0
					}
				}
				h = E << 16 >> 16;
				d = h << 2;
				E = d | 1;
				u = 24072 + (E << 1) | 0;
				n = i[24072 + (d << 1) >> 1] | 0;
				if(!(r << 16 >> 16)) {
					i[M >> 1] = n;
					i[R >> 1] = i[u >> 1] | 0;
					i[g >> 1] = i[24072 + (E + 1 << 1) >> 1] | 0;
					i[y >> 1] = i[24072 + ((d | 3) << 1) >> 1] | 0;
					r = h << 1
				} else {
					i[M >> 1] = 0 - (n & 65535);
					i[R >> 1] = 0 - (s[u >> 1] | 0);
					i[g >> 1] = 0 - (s[24072 + (E + 1 << 1) >> 1] | 0);
					i[y >> 1] = 0 - (s[24072 + ((d | 3) << 1) >> 1] | 0);
					r = h << 1 & 65534 | 1
				}
				i[a + 4 >> 1] = r;
				i[a + 6 >> 1] = Ri(D + 12 | 0, f + 12 | 0, 26120, i[O + 12 >> 1] | 0, i[O + 14 >> 1] | 0, i[A + 12 >> 1] | 0, i[A + 14 >> 1] | 0, 256) | 0;
				i[a + 8 >> 1] = Ri(D + 16 | 0, f + 16 | 0, 28168, i[O + 16 >> 1] | 0, i[O + 18 >> 1] | 0, i[A + 16 >> 1] | 0, i[A + 18 >> 1] | 0, 64) | 0;
				u = 0;
				d = N;
				h = P;
				n = T;
				r = D;
				while(1) {
					I = s[n >> 1] | 0;
					i[d >> 1] = I + (s[r >> 1] | 0);
					B = i[f >> 1] | 0;
					i[h >> 1] = I + (B & 65535);
					i[e + (u << 1) >> 1] = B;
					u = u + 1 | 0;
					if((u | 0) == 10) break;
					else {
						d = d + 2 | 0;
						h = h + 2 | 0;
						n = n + 2 | 0;
						r = r + 2 | 0;
						f = f + 2 | 0
					}
				}
				Ti(N, 205, 10, l);
				Ti(P, 205, 10, l);
				mi(N, t, 10, l);
				mi(P, o, 10, l);
				c = C;
				return
			}

			function Ri(e, r, n, t, o, a, s, l) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				a = a | 0;
				s = s | 0;
				l = l | 0;
				var f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0;
				E = i[e >> 1] | 0;
				_ = e + 2 | 0;
				m = i[_ >> 1] | 0;
				p = i[r >> 1] | 0;
				b = r + 2 | 0;
				v = i[b >> 1] | 0;
				if(l << 16 >> 16 > 0) {
					h = t << 16 >> 16 << 1;
					d = o << 16 >> 16 << 1;
					c = a << 16 >> 16 << 1;
					o = s << 16 >> 16 << 1;
					a = 2147483647;
					f = 0;
					t = 0;
					u = n;
					while(1) {
						s = (ee(h, E - (i[u >> 1] | 0) | 0) | 0) >> 16;
						s = ee(s, s) | 0;
						if(((s | 0) < (a | 0) ? (w = (ee(d, m - (i[u + 2 >> 1] | 0) | 0) | 0) >> 16, w = (ee(w, w) | 0) + s | 0, (w | 0) < (a | 0)) : 0) ? (S = (ee(c, p - (i[u + 4 >> 1] | 0) | 0) | 0) >> 16, S = (ee(S, S) | 0) + w | 0, (S | 0) < (a | 0)) : 0) {
							s = (ee(o, v - (i[u + 6 >> 1] | 0) | 0) | 0) >> 16;
							s = (ee(s, s) | 0) + S | 0;
							k = (s | 0) < (a | 0);
							s = k ? s : a;
							t = k ? f : t
						} else s = a;
						f = f + 1 << 16 >> 16;
						if(f << 16 >> 16 >= l << 16 >> 16) break;
						else {
							a = s;
							u = u + 8 | 0
						}
					}
				} else t = 0;
				k = t << 16 >> 16 << 2;
				l = k | 1;
				i[e >> 1] = i[n + (k << 1) >> 1] | 0;
				i[_ >> 1] = i[n + (l << 1) >> 1] | 0;
				i[r >> 1] = i[n + (l + 1 << 1) >> 1] | 0;
				i[b >> 1] = i[n + ((k | 3) << 1) >> 1] | 0;
				return t | 0
			}

			function yi(e) {
				e = e | 0;
				var r = 0,
					n = 0,
					t = 0;
				if(!e) {
					t = -1;
					return t | 0
				}
				o[e >> 2] = 0;
				r = xi(20) | 0;
				if(!r) {
					t = -1;
					return t | 0
				}
				n = r;
				t = n + 20 | 0;
				do {
					i[n >> 1] = 0;
					n = n + 2 | 0
				} while ((n | 0) < (t | 0));
				o[e >> 2] = r;
				t = 0;
				return t | 0
			}

			function Oi(e) {
				e = e | 0;
				var r = 0;
				if(!e) {
					r = -1;
					return r | 0
				}
				r = e + 20 | 0;
				do {
					i[e >> 1] = 0;
					e = e + 2 | 0
				} while ((e | 0) < (r | 0));
				r = 0;
				return r | 0
			}

			function Ai(e) {
				e = e | 0;
				var r = 0;
				if(!e) return;
				r = o[e >> 2] | 0;
				if(!r) return;
				Hi(r);
				o[e >> 2] = 0;
				return
			}

			function Ti(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var o = 0,
					a = 0,
					s = 0;
				if(n << 16 >> 16 <= 0) return;
				o = r << 16 >> 16;
				a = r & 65535;
				s = 0;
				while(1) {
					t = i[e >> 1] | 0;
					if(t << 16 >> 16 < r << 16 >> 16) {
						i[e >> 1] = r;
						t = (r << 16 >> 16) + o | 0
					} else t = (t & 65535) + a | 0;
					s = s + 1 << 16 >> 16;
					if(s << 16 >> 16 >= n << 16 >> 16) break;
					else {
						r = t & 65535;
						e = e + 2 | 0
					}
				}
				return
			}

			function Di(e, r, n, t) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				var o = 0,
					a = 0,
					s = 0,
					l = 0,
					f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0;
				o = t << 16 >> 16;
				t = o >>> 2 & 65535;
				if(!(t << 16 >> 16)) return;
				h = o + -1 | 0;
				v = e + 20 | 0;
				w = r + (o + -4 << 1) | 0;
				m = r + (o + -3 << 1) | 0;
				S = r + (o + -2 << 1) | 0;
				p = r + (h << 1) | 0;
				E = r + (o + -11 << 1) | 0;
				h = n + (h << 1) | 0;
				while(1) {
					r = i[v >> 1] | 0;
					s = 5;
					l = v;
					f = E;
					u = E + -2 | 0;
					c = E + -4 | 0;
					d = E + -6 | 0;
					a = 2048;
					e = 2048;
					o = 2048;
					n = 2048;
					while(1) {
						a = (ee(i[f >> 1] | 0, r) | 0) + a | 0;
						e = (ee(i[u >> 1] | 0, r) | 0) + e | 0;
						o = (ee(i[c >> 1] | 0, r) | 0) + o | 0;
						r = (ee(i[d >> 1] | 0, r) | 0) + n | 0;
						n = i[l + -2 >> 1] | 0;
						a = a + (ee(i[f + 2 >> 1] | 0, n) | 0) | 0;
						e = e + (ee(i[u + 2 >> 1] | 0, n) | 0) | 0;
						o = o + (ee(i[c + 2 >> 1] | 0, n) | 0) | 0;
						l = l + -4 | 0;
						n = r + (ee(i[d + 2 >> 1] | 0, n) | 0) | 0;
						s = s + -1 << 16 >> 16;
						r = i[l >> 1] | 0;
						if(!(s << 16 >> 16)) break;
						else {
							f = f + 4 | 0;
							u = u + 4 | 0;
							c = c + 4 | 0;
							d = d + 4 | 0
						}
					}
					f = (ee(i[p >> 1] | 0, r) | 0) + a | 0;
					u = (ee(i[S >> 1] | 0, r) | 0) + e | 0;
					c = (ee(i[m >> 1] | 0, r) | 0) + o | 0;
					d = (ee(i[w >> 1] | 0, r) | 0) + n | 0;
					i[h >> 1] = f >>> 12;
					i[h + -2 >> 1] = u >>> 12;
					i[h + -4 >> 1] = c >>> 12;
					i[h + -6 >> 1] = d >>> 12;
					t = t + -1 << 16 >> 16;
					if(!(t << 16 >> 16)) break;
					else {
						w = w + -8 | 0;
						m = m + -8 | 0;
						S = S + -8 | 0;
						p = p + -8 | 0;
						E = E + -8 | 0;
						h = h + -8 | 0
					}
				}
				return
			}

			function Ni(e, r) {
				e = e | 0;
				r = r | 0;
				var n = 0;
				n = e + 32768 | 0;
				if((e | 0) > -1 & (n ^ e | 0) < 0) {
					o[r >> 2] = 1;
					n = (e >>> 31) + 2147483647 | 0
				}
				return n >>> 16 & 65535 | 0
			}

			function Pi(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					i = 0;
				t = r << 16 >> 16;
				if(!(r << 16 >> 16)) return e | 0;
				if(r << 16 >> 16 > 0) {
					e = e << 16 >> 16 >> (r << 16 >> 16 > 15 ? 15 : t) & 65535;
					return e | 0
				}
				i = 0 - t | 0;
				r = e << 16 >> 16;
				i = (i & 65535) << 16 >> 16 > 15 ? 15 : i << 16 >> 16;
				t = r << i;
				if((t << 16 >> 16 >> i | 0) == (r | 0)) {
					i = t & 65535;
					return i | 0
				}
				o[n >> 2] = 1;
				i = e << 16 >> 16 > 0 ? 32767 : -32768;
				return i | 0
			}

			function Ci(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				if(r << 16 >> 16 > 15) {
					r = 0;
					return r | 0
				}
				n = Pi(e, r, n) | 0;
				if(r << 16 >> 16 > 0) return n + ((1 << (r << 16 >> 16) + -1 & e << 16 >> 16 | 0) != 0 & 1) << 16 >> 16 | 0;
				else {
					r = n;
					return r | 0
				}
				return 0
			}

			function Ii(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var t = 0,
					a = 0,
					l = 0;
				if((e | 0) < 1) {
					i[r >> 1] = 0;
					n = 0;
					return n | 0
				}
				a = (vi(e) | 0) & 65534;
				l = a & 65535;
				a = a << 16 >> 16;
				if(l << 16 >> 16 > 0) {
					t = e << a;
					if((t >> a | 0) != (e | 0)) t = e >> 31 ^ 2147483647
				} else {
					a = 0 - a << 16;
					if((a | 0) < 2031616) t = e >> (a >> 16);
					else t = 0
				}
				i[r >> 1] = l;
				r = t >>> 25 & 63;
				r = r >>> 0 > 15 ? r + -16 | 0 : r;
				l = i[30216 + (r << 1) >> 1] | 0;
				e = l << 16;
				t = ee(l - (s[30216 + (r + 1 << 1) >> 1] | 0) << 16 >> 16, t >>> 10 & 32767) | 0;
				if((t | 0) == 1073741824) {
					o[n >> 2] = 1;
					a = 2147483647
				} else a = t << 1;
				t = e - a | 0;
				if(((t ^ e) & (a ^ e) | 0) >= 0) {
					n = t;
					return n | 0
				}
				o[n >> 2] = 1;
				n = (l >>> 15 & 1) + 2147483647 | 0;
				return n | 0
			}

			function Bi(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				e = (e << 16 >> 16) - (r << 16 >> 16) | 0;
				if((e + 32768 | 0) >>> 0 <= 65535) {
					n = e;
					n = n & 65535;
					return n | 0
				}
				o[n >> 2] = 1;
				n = (e | 0) > 32767 ? 32767 : -32768;
				n = n & 65535;
				return n | 0
			}

			function Li(e, r, n, t, o, a) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				t = t | 0;
				o = o | 0;
				a = a | 0;
				var s = 0,
					l = 0,
					f = 0,
					u = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0;
				R = c;
				c = c + 48 | 0;
				E = R;
				f = E;
				s = o;
				l = f + 20 | 0;
				do {
					i[f >> 1] = i[s >> 1] | 0;
					f = f + 2 | 0;
					s = s + 2 | 0
				} while ((f | 0) < (l | 0));
				h = E + 18 | 0;
				p = e + 2 | 0;
				v = e + 4 | 0;
				w = r + 20 | 0;
				_ = e + 6 | 0;
				b = e + 8 | 0;
				k = e + 10 | 0;
				F = e + 12 | 0;
				M = e + 14 | 0;
				g = e + 16 | 0;
				m = e + 18 | 0;
				S = e + 20 | 0;
				l = i[h >> 1] | 0;
				s = 5;
				u = r;
				d = n;
				f = E + 20 | 0;
				while(1) {
					A = i[e >> 1] | 0;
					O = (ee(A, i[u >> 1] | 0) | 0) + 2048 | 0;
					A = (ee(i[u + 2 >> 1] | 0, A) | 0) + 2048 | 0;
					E = l << 16 >> 16;
					O = O - (ee(E, i[p >> 1] | 0) | 0) | 0;
					y = i[v >> 1] | 0;
					E = A - (ee(E, y) | 0) | 0;
					A = i[h + -2 >> 1] | 0;
					y = O - (ee(A, y) | 0) | 0;
					O = i[_ >> 1] | 0;
					A = E - (ee(O, A) | 0) | 0;
					E = i[h + -4 >> 1] | 0;
					O = y - (ee(E, O) | 0) | 0;
					y = i[b >> 1] | 0;
					E = A - (ee(y, E) | 0) | 0;
					A = i[h + -6 >> 1] | 0;
					y = O - (ee(A, y) | 0) | 0;
					O = i[k >> 1] | 0;
					A = E - (ee(A, O) | 0) | 0;
					E = i[h + -8 >> 1] | 0;
					O = y - (ee(E, O) | 0) | 0;
					y = i[F >> 1] | 0;
					E = A - (ee(y, E) | 0) | 0;
					A = i[h + -10 >> 1] | 0;
					y = O - (ee(A, y) | 0) | 0;
					O = i[M >> 1] | 0;
					A = E - (ee(O, A) | 0) | 0;
					E = i[h + -12 >> 1] | 0;
					O = y - (ee(E, O) | 0) | 0;
					y = i[g >> 1] | 0;
					E = A - (ee(E, y) | 0) | 0;
					A = i[h + -14 >> 1] | 0;
					y = O - (ee(A, y) | 0) | 0;
					O = i[m >> 1] | 0;
					A = E - (ee(O, A) | 0) | 0;
					E = i[h + -16 >> 1] | 0;
					O = y - (ee(E, O) | 0) | 0;
					y = i[S >> 1] | 0;
					E = A - (ee(y, E) | 0) | 0;
					y = O - (ee(i[h + -18 >> 1] | 0, y) | 0) | 0;
					y = (y + 134217728 | 0) >>> 0 < 268435455 ? y >>> 12 & 65535 : (y | 0) > 134217727 ? 32767 : -32768;
					E = E - (ee(i[p >> 1] | 0, y << 16 >> 16) | 0) | 0;
					h = f + 2 | 0;
					i[f >> 1] = y;
					i[d >> 1] = y;
					l = (E + 134217728 | 0) >>> 0 < 268435455 ? E >>> 12 & 65535 : (E | 0) > 134217727 ? 32767 : -32768;
					i[h >> 1] = l;
					i[d + 2 >> 1] = l;
					s = s + -1 << 16 >> 16;
					if(!(s << 16 >> 16)) break;
					else {
						u = u + 4 | 0;
						d = d + 4 | 0;
						f = f + 4 | 0
					}
				}
				t = (t << 16 >> 16) + -10 | 0;
				f = t >>> 1 & 65535;
				if(f << 16 >> 16) {
					E = n + 18 | 0;
					l = r + 16 | 0;
					h = i[E >> 1] | 0;
					u = w;
					s = n + 20 | 0;
					while(1) {
						y = i[e >> 1] | 0;
						d = (ee(y, i[u >> 1] | 0) | 0) + 2048 | 0;
						y = (ee(i[l + 6 >> 1] | 0, y) | 0) + 2048 | 0;
						l = i[p >> 1] | 0;
						O = h << 16 >> 16;
						d = d - (ee(O, l) | 0) | 0;
						A = i[v >> 1] | 0;
						O = y - (ee(O, A) | 0) | 0;
						y = i[E + -2 >> 1] | 0;
						A = d - (ee(y, A) | 0) | 0;
						d = i[_ >> 1] | 0;
						y = O - (ee(d, y) | 0) | 0;
						O = i[E + -4 >> 1] | 0;
						d = A - (ee(O, d) | 0) | 0;
						A = i[b >> 1] | 0;
						O = y - (ee(A, O) | 0) | 0;
						y = i[E + -6 >> 1] | 0;
						A = d - (ee(y, A) | 0) | 0;
						d = i[k >> 1] | 0;
						y = O - (ee(y, d) | 0) | 0;
						O = i[E + -8 >> 1] | 0;
						d = A - (ee(O, d) | 0) | 0;
						A = i[F >> 1] | 0;
						O = y - (ee(A, O) | 0) | 0;
						y = i[E + -10 >> 1] | 0;
						A = d - (ee(y, A) | 0) | 0;
						d = i[M >> 1] | 0;
						y = O - (ee(d, y) | 0) | 0;
						O = i[E + -12 >> 1] | 0;
						d = A - (ee(O, d) | 0) | 0;
						A = i[g >> 1] | 0;
						O = y - (ee(O, A) | 0) | 0;
						y = i[E + -14 >> 1] | 0;
						A = d - (ee(y, A) | 0) | 0;
						d = i[m >> 1] | 0;
						y = O - (ee(d, y) | 0) | 0;
						O = i[E + -16 >> 1] | 0;
						d = A - (ee(O, d) | 0) | 0;
						A = i[S >> 1] | 0;
						O = y - (ee(A, O) | 0) | 0;
						A = d - (ee(i[E + -18 >> 1] | 0, A) | 0) | 0;
						d = u + 4 | 0;
						A = (A + 134217728 | 0) >>> 0 < 268435455 ? A >>> 12 & 65535 : (A | 0) > 134217727 ? 32767 : -32768;
						l = O - (ee(l, A << 16 >> 16) | 0) | 0;
						E = s + 2 | 0;
						i[s >> 1] = A;
						do
							if((l + 134217728 | 0) >>> 0 >= 268435455) {
								s = s + 4 | 0;
								if((l | 0) > 134217727) {
									i[E >> 1] = 32767;
									l = 32767;
									break
								} else {
									i[E >> 1] = -32768;
									l = -32768;
									break
								}
							} else {
								l = l >>> 12 & 65535;
								i[E >> 1] = l;
								s = s + 4 | 0
							}
						while(0);
						f = f + -1 << 16 >> 16;
						if(!(f << 16 >> 16)) break;
						else {
							A = u;
							h = l;
							u = d;
							l = A
						}
					}
				}
				if(!(a << 16 >> 16)) {
					c = R;
					return
				}
				f = o;
				s = n + (t << 1) | 0;
				l = f + 20 | 0;
				do {
					i[f >> 1] = i[s >> 1] | 0;
					f = f + 2 | 0;
					s = s + 2 | 0
				} while ((f | 0) < (l | 0));
				c = R;
				return
			}

			function Ui(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				i[n >> 1] = i[e >> 1] | 0;
				i[n + 2 >> 1] = ((ee(i[r >> 1] | 0, i[e + 2 >> 1] | 0) | 0) + 16384 | 0) >>> 15;
				i[n + 4 >> 1] = ((ee(i[r + 2 >> 1] | 0, i[e + 4 >> 1] | 0) | 0) + 16384 | 0) >>> 15;
				i[n + 6 >> 1] = ((ee(i[r + 4 >> 1] | 0, i[e + 6 >> 1] | 0) | 0) + 16384 | 0) >>> 15;
				i[n + 8 >> 1] = ((ee(i[r + 6 >> 1] | 0, i[e + 8 >> 1] | 0) | 0) + 16384 | 0) >>> 15;
				i[n + 10 >> 1] = ((ee(i[r + 8 >> 1] | 0, i[e + 10 >> 1] | 0) | 0) + 16384 | 0) >>> 15;
				i[n + 12 >> 1] = ((ee(i[r + 10 >> 1] | 0, i[e + 12 >> 1] | 0) | 0) + 16384 | 0) >>> 15;
				i[n + 14 >> 1] = ((ee(i[r + 12 >> 1] | 0, i[e + 14 >> 1] | 0) | 0) + 16384 | 0) >>> 15;
				i[n + 16 >> 1] = ((ee(i[r + 14 >> 1] | 0, i[e + 16 >> 1] | 0) | 0) + 16384 | 0) >>> 15;
				i[n + 18 >> 1] = ((ee(i[r + 16 >> 1] | 0, i[e + 18 >> 1] | 0) | 0) + 16384 | 0) >>> 15;
				i[n + 20 >> 1] = ((ee(i[r + 18 >> 1] | 0, i[e + 20 >> 1] | 0) | 0) + 16384 | 0) >>> 15;
				return
			}

			function xi(e) {
				e = e | 0;
				var r = 0,
					n = 0,
					t = 0,
					i = 0,
					a = 0,
					s = 0,
					l = 0,
					f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0,
					O = 0,
					A = 0,
					T = 0,
					D = 0,
					N = 0,
					P = 0,
					C = 0,
					I = 0,
					B = 0,
					L = 0,
					U = 0,
					x = 0,
					H = 0,
					z = 0,
					j = 0,
					Y = 0,
					V = 0,
					q = 0,
					K = 0,
					W = 0;
				do
					if(e >>> 0 < 245) {
						p = e >>> 0 < 11 ? 16 : e + 11 & -8;
						e = p >>> 3;
						d = o[26] | 0;
						f = d >>> e;
						if(f & 3) {
							t = (f & 1 ^ 1) + e | 0;
							r = t << 1;
							n = 144 + (r << 2) | 0;
							r = 144 + (r + 2 << 2) | 0;
							i = o[r >> 2] | 0;
							a = i + 8 | 0;
							s = o[a >> 2] | 0;
							do
								if((n | 0) == (s | 0)) o[26] = d & ~(1 << t);
								else {
									if(s >>> 0 >= (o[30] | 0) >>> 0 ? (c = s + 12 | 0, (o[c >> 2] | 0) == (i | 0)) : 0) {
										o[c >> 2] = n;
										o[r >> 2] = s;
										break
									}
									se()
								}
							while(0);
							K = t << 3;
							o[i + 4 >> 2] = K | 3;
							K = i + (K | 4) | 0;
							o[K >> 2] = o[K >> 2] | 1;
							break
						}
						r = o[28] | 0;
						if(p >>> 0 > r >>> 0) {
							if(f) {
								i = 2 << e;
								i = f << e & (i | 0 - i);
								i = (i & 0 - i) + -1 | 0;
								a = i >>> 12 & 16;
								i = i >>> a;
								t = i >>> 5 & 8;
								i = i >>> t;
								n = i >>> 2 & 4;
								i = i >>> n;
								s = i >>> 1 & 2;
								i = i >>> s;
								l = i >>> 1 & 1;
								l = (t | a | n | s | l) + (i >>> l) | 0;
								i = l << 1;
								s = 144 + (i << 2) | 0;
								i = 144 + (i + 2 << 2) | 0;
								n = o[i >> 2] | 0;
								a = n + 8 | 0;
								t = o[a >> 2] | 0;
								do
									if((s | 0) == (t | 0)) {
										o[26] = d & ~(1 << l);
										h = r
									} else {
										if(t >>> 0 >= (o[30] | 0) >>> 0 ? (u = t + 12 | 0, (o[u >> 2] | 0) == (n | 0)) : 0) {
											o[u >> 2] = s;
											o[i >> 2] = t;
											h = o[28] | 0;
											break
										}
										se()
									}
								while(0);
								K = l << 3;
								r = K - p | 0;
								o[n + 4 >> 2] = p | 3;
								f = n + p | 0;
								o[n + (p | 4) >> 2] = r | 1;
								o[n + K >> 2] = r;
								if(h) {
									n = o[31] | 0;
									t = h >>> 3;
									s = t << 1;
									l = 144 + (s << 2) | 0;
									i = o[26] | 0;
									t = 1 << t;
									if(i & t) {
										i = 144 + (s + 2 << 2) | 0;
										s = o[i >> 2] | 0;
										if(s >>> 0 < (o[30] | 0) >>> 0) se();
										else {
											w = i;
											m = s
										}
									} else {
										o[26] = i | t;
										w = 144 + (s + 2 << 2) | 0;
										m = l
									}
									o[w >> 2] = n;
									o[m + 12 >> 2] = n;
									o[n + 8 >> 2] = m;
									o[n + 12 >> 2] = l
								}
								o[28] = r;
								o[31] = f;
								break
							}
							e = o[27] | 0;
							if(e) {
								i = (e & 0 - e) + -1 | 0;
								q = i >>> 12 & 16;
								i = i >>> q;
								V = i >>> 5 & 8;
								i = i >>> V;
								K = i >>> 2 & 4;
								i = i >>> K;
								s = i >>> 1 & 2;
								i = i >>> s;
								f = i >>> 1 & 1;
								f = o[408 + ((V | q | K | s | f) + (i >>> f) << 2) >> 2] | 0;
								i = (o[f + 4 >> 2] & -8) - p | 0;
								s = f;
								while(1) {
									l = o[s + 16 >> 2] | 0;
									if(!l) {
										l = o[s + 20 >> 2] | 0;
										if(!l) {
											r = i;
											break
										}
									}
									s = (o[l + 4 >> 2] & -8) - p | 0;
									K = s >>> 0 < i >>> 0;
									i = K ? s : i;
									s = l;
									f = K ? l : f
								}
								e = o[30] | 0;
								if(f >>> 0 >= e >>> 0 ? (b = f + p | 0, f >>> 0 < b >>> 0) : 0) {
									t = o[f + 24 >> 2] | 0;
									l = o[f + 12 >> 2] | 0;
									do
										if((l | 0) == (f | 0)) {
											s = f + 20 | 0;
											l = o[s >> 2] | 0;
											if(!l) {
												s = f + 16 | 0;
												l = o[s >> 2] | 0;
												if(!l) {
													v = 0;
													break
												}
											}
											while(1) {
												a = l + 20 | 0;
												i = o[a >> 2] | 0;
												if(i) {
													l = i;
													s = a;
													continue
												}
												a = l + 16 | 0;
												i = o[a >> 2] | 0;
												if(!i) break;
												else {
													l = i;
													s = a
												}
											}
											if(s >>> 0 < e >>> 0) se();
											else {
												o[s >> 2] = 0;
												v = l;
												break
											}
										} else {
											s = o[f + 8 >> 2] | 0;
											if((s >>> 0 >= e >>> 0 ? (n = s + 12 | 0, (o[n >> 2] | 0) == (f | 0)) : 0) ? (E = l + 8 | 0, (o[E >> 2] | 0) == (f | 0)) : 0) {
												o[n >> 2] = l;
												o[E >> 2] = s;
												v = l;
												break
											}
											se()
										}
									while(0);
									do
										if(t) {
											s = o[f + 28 >> 2] | 0;
											a = 408 + (s << 2) | 0;
											if((f | 0) == (o[a >> 2] | 0)) {
												o[a >> 2] = v;
												if(!v) {
													o[27] = o[27] & ~(1 << s);
													break
												}
											} else {
												if(t >>> 0 < (o[30] | 0) >>> 0) se();
												s = t + 16 | 0;
												if((o[s >> 2] | 0) == (f | 0)) o[s >> 2] = v;
												else o[t + 20 >> 2] = v;
												if(!v) break
											}
											a = o[30] | 0;
											if(v >>> 0 < a >>> 0) se();
											o[v + 24 >> 2] = t;
											s = o[f + 16 >> 2] | 0;
											do
												if(s)
													if(s >>> 0 < a >>> 0) se();
													else {
														o[v + 16 >> 2] = s;
														o[s + 24 >> 2] = v;
														break
													}
											while(0);
											s = o[f + 20 >> 2] | 0;
											if(s)
												if(s >>> 0 < (o[30] | 0) >>> 0) se();
												else {
													o[v + 20 >> 2] = s;
													o[s + 24 >> 2] = v;
													break
												}
										}
									while(0);
									if(r >>> 0 < 16) {
										K = r + p | 0;
										o[f + 4 >> 2] = K | 3;
										K = f + (K + 4) | 0;
										o[K >> 2] = o[K >> 2] | 1
									} else {
										o[f + 4 >> 2] = p | 3;
										o[f + (p | 4) >> 2] = r | 1;
										o[f + (r + p) >> 2] = r;
										t = o[28] | 0;
										if(t) {
											n = o[31] | 0;
											i = t >>> 3;
											s = i << 1;
											l = 144 + (s << 2) | 0;
											a = o[26] | 0;
											i = 1 << i;
											if(a & i) {
												s = 144 + (s + 2 << 2) | 0;
												a = o[s >> 2] | 0;
												if(a >>> 0 < (o[30] | 0) >>> 0) se();
												else {
													_ = s;
													k = a
												}
											} else {
												o[26] = a | i;
												_ = 144 + (s + 2 << 2) | 0;
												k = l
											}
											o[_ >> 2] = n;
											o[k + 12 >> 2] = n;
											o[n + 8 >> 2] = k;
											o[n + 12 >> 2] = l
										}
										o[28] = r;
										o[31] = b
									}
									a = f + 8 | 0;
									break
								}
								se()
							} else W = 154
						} else W = 154
					} else if(e >>> 0 <= 4294967231) {
					e = e + 11 | 0;
					k = e & -8;
					d = o[27] | 0;
					if(d) {
						f = 0 - k | 0;
						e = e >>> 8;
						if(e)
							if(k >>> 0 > 16777215) c = 31;
							else {
								b = (e + 1048320 | 0) >>> 16 & 8;
								W = e << b;
								_ = (W + 520192 | 0) >>> 16 & 4;
								W = W << _;
								c = (W + 245760 | 0) >>> 16 & 2;
								c = 14 - (_ | b | c) + (W << c >>> 15) | 0;
								c = k >>> (c + 7 | 0) & 1 | c << 1
							}
						else c = 0;
						e = o[408 + (c << 2) >> 2] | 0;
						e: do
							if(!e) {
								l = 0;
								e = 0;
								W = 86
							} else {
								n = f;
								l = 0;
								r = k << ((c | 0) == 31 ? 0 : 25 - (c >>> 1) | 0);
								u = e;
								e = 0;
								while(1) {
									t = o[u + 4 >> 2] & -8;
									f = t - k | 0;
									if(f >>> 0 < n >>> 0)
										if((t | 0) == (k | 0)) {
											t = u;
											e = u;
											W = 90;
											break e
										} else e = u;
									else f = n;
									W = o[u + 20 >> 2] | 0;
									u = o[u + 16 + (r >>> 31 << 2) >> 2] | 0;
									l = (W | 0) == 0 | (W | 0) == (u | 0) ? l : W;
									if(!u) {
										W = 86;
										break
									} else {
										n = f;
										r = r << 1
									}
								}
							}
						while(0);
						if((W | 0) == 86) {
							if((l | 0) == 0 & (e | 0) == 0) {
								e = 2 << c;
								e = d & (e | 0 - e);
								if(!e) {
									p = k;
									W = 154;
									break
								}
								e = (e & 0 - e) + -1 | 0;
								v = e >>> 12 & 16;
								e = e >>> v;
								m = e >>> 5 & 8;
								e = e >>> m;
								_ = e >>> 2 & 4;
								e = e >>> _;
								b = e >>> 1 & 2;
								e = e >>> b;
								l = e >>> 1 & 1;
								l = o[408 + ((m | v | _ | b | l) + (e >>> l) << 2) >> 2] | 0;
								e = 0
							}
							if(!l) {
								m = f;
								w = e
							} else {
								t = l;
								W = 90
							}
						}
						if((W | 0) == 90)
							while(1) {
								W = 0;
								b = (o[t + 4 >> 2] & -8) - k | 0;
								l = b >>> 0 < f >>> 0;
								f = l ? b : f;
								e = l ? t : e;
								l = o[t + 16 >> 2] | 0;
								if(l) {
									t = l;
									W = 90;
									continue
								}
								t = o[t + 20 >> 2] | 0;
								if(!t) {
									m = f;
									w = e;
									break
								} else W = 90
							}
						if((w | 0) != 0 ? m >>> 0 < ((o[28] | 0) - k | 0) >>> 0 : 0) {
							e = o[30] | 0;
							if(w >>> 0 >= e >>> 0 ? (P = w + k | 0, w >>> 0 < P >>> 0) : 0) {
								f = o[w + 24 >> 2] | 0;
								l = o[w + 12 >> 2] | 0;
								do
									if((l | 0) == (w | 0)) {
										s = w + 20 | 0;
										l = o[s >> 2] | 0;
										if(!l) {
											s = w + 16 | 0;
											l = o[s >> 2] | 0;
											if(!l) {
												M = 0;
												break
											}
										}
										while(1) {
											a = l + 20 | 0;
											i = o[a >> 2] | 0;
											if(i) {
												l = i;
												s = a;
												continue
											}
											a = l + 16 | 0;
											i = o[a >> 2] | 0;
											if(!i) break;
											else {
												l = i;
												s = a
											}
										}
										if(s >>> 0 < e >>> 0) se();
										else {
											o[s >> 2] = 0;
											M = l;
											break
										}
									} else {
										s = o[w + 8 >> 2] | 0;
										if((s >>> 0 >= e >>> 0 ? (S = s + 12 | 0, (o[S >> 2] | 0) == (w | 0)) : 0) ? (p = l + 8 | 0, (o[p >> 2] | 0) == (w | 0)) : 0) {
											o[S >> 2] = l;
											o[p >> 2] = s;
											M = l;
											break
										}
										se()
									}
								while(0);
								do
									if(f) {
										l = o[w + 28 >> 2] | 0;
										s = 408 + (l << 2) | 0;
										if((w | 0) == (o[s >> 2] | 0)) {
											o[s >> 2] = M;
											if(!M) {
												o[27] = o[27] & ~(1 << l);
												break
											}
										} else {
											if(f >>> 0 < (o[30] | 0) >>> 0) se();
											s = f + 16 | 0;
											if((o[s >> 2] | 0) == (w | 0)) o[s >> 2] = M;
											else o[f + 20 >> 2] = M;
											if(!M) break
										}
										l = o[30] | 0;
										if(M >>> 0 < l >>> 0) se();
										o[M + 24 >> 2] = f;
										s = o[w + 16 >> 2] | 0;
										do
											if(s)
												if(s >>> 0 < l >>> 0) se();
												else {
													o[M + 16 >> 2] = s;
													o[s + 24 >> 2] = M;
													break
												}
										while(0);
										s = o[w + 20 >> 2] | 0;
										if(s)
											if(s >>> 0 < (o[30] | 0) >>> 0) se();
											else {
												o[M + 20 >> 2] = s;
												o[s + 24 >> 2] = M;
												break
											}
									}
								while(0);
								e: do
									if(m >>> 0 >= 16) {
										o[w + 4 >> 2] = k | 3;
										o[w + (k | 4) >> 2] = m | 1;
										o[w + (m + k) >> 2] = m;
										l = m >>> 3;
										if(m >>> 0 < 256) {
											a = l << 1;
											t = 144 + (a << 2) | 0;
											i = o[26] | 0;
											s = 1 << l;
											if(i & s) {
												s = 144 + (a + 2 << 2) | 0;
												a = o[s >> 2] | 0;
												if(a >>> 0 < (o[30] | 0) >>> 0) se();
												else {
													g = s;
													R = a
												}
											} else {
												o[26] = i | s;
												g = 144 + (a + 2 << 2) | 0;
												R = t
											}
											o[g >> 2] = P;
											o[R + 12 >> 2] = P;
											o[w + (k + 8) >> 2] = R;
											o[w + (k + 12) >> 2] = t;
											break
										}
										n = m >>> 8;
										if(n)
											if(m >>> 0 > 16777215) l = 31;
											else {
												q = (n + 1048320 | 0) >>> 16 & 8;
												K = n << q;
												V = (K + 520192 | 0) >>> 16 & 4;
												K = K << V;
												l = (K + 245760 | 0) >>> 16 & 2;
												l = 14 - (V | q | l) + (K << l >>> 15) | 0;
												l = m >>> (l + 7 | 0) & 1 | l << 1
											}
										else l = 0;
										s = 408 + (l << 2) | 0;
										o[w + (k + 28) >> 2] = l;
										o[w + (k + 20) >> 2] = 0;
										o[w + (k + 16) >> 2] = 0;
										a = o[27] | 0;
										i = 1 << l;
										if(!(a & i)) {
											o[27] = a | i;
											o[s >> 2] = P;
											o[w + (k + 24) >> 2] = s;
											o[w + (k + 12) >> 2] = P;
											o[w + (k + 8) >> 2] = P;
											break
										}
										n = o[s >> 2] | 0;
										r: do
											if((o[n + 4 >> 2] & -8 | 0) != (m | 0)) {
												l = m << ((l | 0) == 31 ? 0 : 25 - (l >>> 1) | 0);
												while(1) {
													r = n + 16 + (l >>> 31 << 2) | 0;
													s = o[r >> 2] | 0;
													if(!s) break;
													if((o[s + 4 >> 2] & -8 | 0) == (m | 0)) {
														O = s;
														break r
													} else {
														l = l << 1;
														n = s
													}
												}
												if(r >>> 0 < (o[30] | 0) >>> 0) se();
												else {
													o[r >> 2] = P;
													o[w + (k + 24) >> 2] = n;
													o[w + (k + 12) >> 2] = P;
													o[w + (k + 8) >> 2] = P;
													break e
												}
											} else O = n;
										while(0);
										n = O + 8 | 0;
										r = o[n >> 2] | 0;
										K = o[30] | 0;
										if(r >>> 0 >= K >>> 0 & O >>> 0 >= K >>> 0) {
											o[r + 12 >> 2] = P;
											o[n >> 2] = P;
											o[w + (k + 8) >> 2] = r;
											o[w + (k + 12) >> 2] = O;
											o[w + (k + 24) >> 2] = 0;
											break
										} else se()
									} else {
										K = m + k | 0;
										o[w + 4 >> 2] = K | 3;
										K = w + (K + 4) | 0;
										o[K >> 2] = o[K >> 2] | 1
									}
								while(0);
								a = w + 8 | 0;
								break
							}
							se()
						} else {
							p = k;
							W = 154
						}
					} else {
						p = k;
						W = 154
					}
				} else {
					p = -1;
					W = 154
				}
				while(0);
				e: do
					if((W | 0) == 154) {
						e = o[28] | 0;
						if(e >>> 0 >= p >>> 0) {
							r = e - p | 0;
							n = o[31] | 0;
							if(r >>> 0 > 15) {
								o[31] = n + p;
								o[28] = r;
								o[n + (p + 4) >> 2] = r | 1;
								o[n + e >> 2] = r;
								o[n + 4 >> 2] = p | 3
							} else {
								o[28] = 0;
								o[31] = 0;
								o[n + 4 >> 2] = e | 3;
								W = n + (e + 4) | 0;
								o[W >> 2] = o[W >> 2] | 1
							}
							a = n + 8 | 0;
							break
						}
						e = o[29] | 0;
						if(e >>> 0 > p >>> 0) {
							W = e - p | 0;
							o[29] = W;
							a = o[32] | 0;
							o[32] = a + p;
							o[a + (p + 4) >> 2] = W | 1;
							o[a + 4 >> 2] = p | 3;
							a = a + 8 | 0;
							break
						}
						if(!(o[144] | 0)) ji();
						d = p + 48 | 0;
						n = o[146] | 0;
						c = p + 47 | 0;
						t = n + c | 0;
						n = 0 - n | 0;
						u = t & n;
						if(u >>> 0 > p >>> 0) {
							e = o[136] | 0;
							if((e | 0) != 0 ? (O = o[134] | 0, P = O + u | 0, P >>> 0 <= O >>> 0 | P >>> 0 > e >>> 0) : 0) {
								a = 0;
								break
							}
							r: do
								if(!(o[137] & 4)) {
									e = o[32] | 0;
									n: do
										if(e) {
											l = 552;
											while(1) {
												f = o[l >> 2] | 0;
												if(f >>> 0 <= e >>> 0 ? (F = l + 4 | 0, (f + (o[F >> 2] | 0) | 0) >>> 0 > e >>> 0) : 0) {
													a = l;
													e = F;
													break
												}
												l = o[l + 8 >> 2] | 0;
												if(!l) {
													W = 172;
													break n
												}
											}
											f = t - (o[29] | 0) & n;
											if(f >>> 0 < 2147483647) {
												l = fe(f | 0) | 0;
												P = (l | 0) == ((o[a >> 2] | 0) + (o[e >> 2] | 0) | 0);
												e = P ? f : 0;
												if(P) {
													if((l | 0) != (-1 | 0)) {
														R = l;
														v = e;
														W = 192;
														break r
													}
												} else W = 182
											} else e = 0
										} else W = 172;
									while(0);
									do
										if((W | 0) == 172) {
											a = fe(0) | 0;
											if((a | 0) != (-1 | 0)) {
												e = a;
												f = o[145] | 0;
												l = f + -1 | 0;
												if(!(l & e)) f = u;
												else f = u - e + (l + e & 0 - f) | 0;
												e = o[134] | 0;
												l = e + f | 0;
												if(f >>> 0 > p >>> 0 & f >>> 0 < 2147483647) {
													P = o[136] | 0;
													if((P | 0) != 0 ? l >>> 0 <= e >>> 0 | l >>> 0 > P >>> 0 : 0) {
														e = 0;
														break
													}
													l = fe(f | 0) | 0;
													W = (l | 0) == (a | 0);
													e = W ? f : 0;
													if(W) {
														R = a;
														v = e;
														W = 192;
														break r
													} else W = 182
												} else e = 0
											} else e = 0
										}
									while(0);
									n: do
										if((W | 0) == 182) {
											a = 0 - f | 0;
											do
												if(d >>> 0 > f >>> 0 & (f >>> 0 < 2147483647 & (l | 0) != (-1 | 0)) ? (y = o[146] | 0, y = c - f + y & 0 - y, y >>> 0 < 2147483647) : 0)
													if((fe(y | 0) | 0) == (-1 | 0)) {
														fe(a | 0) | 0;
														break n
													} else {
														f = y + f | 0;
														break
													}
											while(0);
											if((l | 0) != (-1 | 0)) {
												R = l;
												v = f;
												W = 192;
												break r
											}
										}
									while(0);
									o[137] = o[137] | 4;
									W = 189
								} else {
									e = 0;
									W = 189
								}
							while(0);
							if((((W | 0) == 189 ? u >>> 0 < 2147483647 : 0) ? (A = fe(u | 0) | 0, T = fe(0) | 0, A >>> 0 < T >>> 0 & ((A | 0) != (-1 | 0) & (T | 0) != (-1 | 0))) : 0) ? (D = T - A | 0, N = D >>> 0 > (p + 40 | 0) >>> 0, N) : 0) {
								R = A;
								v = N ? D : e;
								W = 192
							}
							if((W | 0) == 192) {
								f = (o[134] | 0) + v | 0;
								o[134] = f;
								if(f >>> 0 > (o[135] | 0) >>> 0) o[135] = f;
								m = o[32] | 0;
								r: do
									if(m) {
										a = 552;
										do {
											e = o[a >> 2] | 0;
											f = a + 4 | 0;
											l = o[f >> 2] | 0;
											if((R | 0) == (e + l | 0)) {
												C = e;
												I = f;
												B = l;
												L = a;
												W = 202;
												break
											}
											a = o[a + 8 >> 2] | 0
										} while ((a | 0) != 0);
										if(((W | 0) == 202 ? (o[L + 12 >> 2] & 8 | 0) == 0 : 0) ? m >>> 0 < R >>> 0 & m >>> 0 >= C >>> 0 : 0) {
											o[I >> 2] = B + v;
											W = (o[29] | 0) + v | 0;
											K = m + 8 | 0;
											K = (K & 7 | 0) == 0 ? 0 : 0 - K & 7;
											q = W - K | 0;
											o[32] = m + K;
											o[29] = q;
											o[m + (K + 4) >> 2] = q | 1;
											o[m + (W + 4) >> 2] = 40;
											o[33] = o[148];
											break
										}
										f = o[30] | 0;
										if(R >>> 0 < f >>> 0) {
											o[30] = R;
											f = R
										}
										l = R + v | 0;
										e = 552;
										while(1) {
											if((o[e >> 2] | 0) == (l | 0)) {
												a = e;
												l = e;
												W = 210;
												break
											}
											e = o[e + 8 >> 2] | 0;
											if(!e) {
												l = 552;
												break
											}
										}
										if((W | 0) == 210)
											if(!(o[l + 12 >> 2] & 8)) {
												o[a >> 2] = R;
												E = l + 4 | 0;
												o[E >> 2] = (o[E >> 2] | 0) + v;
												E = R + 8 | 0;
												E = (E & 7 | 0) == 0 ? 0 : 0 - E & 7;
												c = R + (v + 8) | 0;
												c = (c & 7 | 0) == 0 ? 0 : 0 - c & 7;
												l = R + (c + v) | 0;
												w = E + p | 0;
												h = R + w | 0;
												e = l - (R + E) - p | 0;
												o[R + (E + 4) >> 2] = p | 3;
												n: do
													if((l | 0) != (m | 0)) {
														if((l | 0) == (o[31] | 0)) {
															W = (o[28] | 0) + e | 0;
															o[28] = W;
															o[31] = h;
															o[R + (w + 4) >> 2] = W | 1;
															o[R + (W + w) >> 2] = W;
															break
														}
														r = v + 4 | 0;
														s = o[R + (r + c) >> 2] | 0;
														if((s & 3 | 0) == 1) {
															u = s & -8;
															t = s >>> 3;
															t: do
																if(s >>> 0 >= 256) {
																	n = o[R + ((c | 24) + v) >> 2] | 0;
																	a = o[R + (v + 12 + c) >> 2] | 0;
																	i: do
																		if((a | 0) == (l | 0)) {
																			i = c | 16;
																			a = R + (r + i) | 0;
																			s = o[a >> 2] | 0;
																			if(!s) {
																				a = R + (i + v) | 0;
																				s = o[a >> 2] | 0;
																				if(!s) {
																					Y = 0;
																					break
																				}
																			}
																			while(1) {
																				i = s + 20 | 0;
																				t = o[i >> 2] | 0;
																				if(t) {
																					s = t;
																					a = i;
																					continue
																				}
																				i = s + 16 | 0;
																				t = o[i >> 2] | 0;
																				if(!t) break;
																				else {
																					s = t;
																					a = i
																				}
																			}
																			if(a >>> 0 < f >>> 0) se();
																			else {
																				o[a >> 2] = 0;
																				Y = s;
																				break
																			}
																		} else {
																			i = o[R + ((c | 8) + v) >> 2] | 0;
																			do
																				if(i >>> 0 >= f >>> 0) {
																					f = i + 12 | 0;
																					if((o[f >> 2] | 0) != (l | 0)) break;
																					s = a + 8 | 0;
																					if((o[s >> 2] | 0) != (l | 0)) break;
																					o[f >> 2] = a;
																					o[s >> 2] = i;
																					Y = a;
																					break i
																				}
																			while(0);
																			se()
																		}
																	while(0);
																	if(!n) break;
																	f = o[R + (v + 28 + c) >> 2] | 0;
																	s = 408 + (f << 2) | 0;
																	do
																		if((l | 0) != (o[s >> 2] | 0)) {
																			if(n >>> 0 < (o[30] | 0) >>> 0) se();
																			s = n + 16 | 0;
																			if((o[s >> 2] | 0) == (l | 0)) o[s >> 2] = Y;
																			else o[n + 20 >> 2] = Y;
																			if(!Y) break t
																		} else {
																			o[s >> 2] = Y;
																			if(Y) break;
																			o[27] = o[27] & ~(1 << f);
																			break t
																		}
																	while(0);
																	f = o[30] | 0;
																	if(Y >>> 0 < f >>> 0) se();
																	o[Y + 24 >> 2] = n;
																	l = c | 16;
																	s = o[R + (l + v) >> 2] | 0;
																	do
																		if(s)
																			if(s >>> 0 < f >>> 0) se();
																			else {
																				o[Y + 16 >> 2] = s;
																				o[s + 24 >> 2] = Y;
																				break
																			}
																	while(0);
																	l = o[R + (r + l) >> 2] | 0;
																	if(!l) break;
																	if(l >>> 0 < (o[30] | 0) >>> 0) se();
																	else {
																		o[Y + 20 >> 2] = l;
																		o[l + 24 >> 2] = Y;
																		break
																	}
																} else {
																	s = o[R + ((c | 8) + v) >> 2] | 0;
																	a = o[R + (v + 12 + c) >> 2] | 0;
																	i = 144 + (t << 1 << 2) | 0;
																	do
																		if((s | 0) != (i | 0)) {
																			if(s >>> 0 >= f >>> 0 ? (o[s + 12 >> 2] | 0) == (l | 0) : 0) break;
																			se()
																		}
																	while(0);
																	if((a | 0) == (s | 0)) {
																		o[26] = o[26] & ~(1 << t);
																		break
																	}
																	do
																		if((a | 0) == (i | 0)) U = a + 8 | 0;
																		else {
																			if(a >>> 0 >= f >>> 0 ? (x = a + 8 | 0, (o[x >> 2] | 0) == (l | 0)) : 0) {
																				U = x;
																				break
																			}
																			se()
																		}
																	while(0);
																	o[s + 12 >> 2] = a;
																	o[U >> 2] = s
																}
															while(0);
															l = R + ((u | c) + v) | 0;
															e = u + e | 0
														}
														l = l + 4 | 0;
														o[l >> 2] = o[l >> 2] & -2;
														o[R + (w + 4) >> 2] = e | 1;
														o[R + (e + w) >> 2] = e;
														l = e >>> 3;
														if(e >>> 0 < 256) {
															a = l << 1;
															t = 144 + (a << 2) | 0;
															i = o[26] | 0;
															s = 1 << l;
															do
																if(!(i & s)) {
																	o[26] = i | s;
																	V = 144 + (a + 2 << 2) | 0;
																	q = t
																} else {
																	s = 144 + (a + 2 << 2) | 0;
																	a = o[s >> 2] | 0;
																	if(a >>> 0 >= (o[30] | 0) >>> 0) {
																		V = s;
																		q = a;
																		break
																	}
																	se()
																}
															while(0);
															o[V >> 2] = h;
															o[q + 12 >> 2] = h;
															o[R + (w + 8) >> 2] = q;
															o[R + (w + 12) >> 2] = t;
															break
														}
														n = e >>> 8;
														do
															if(!n) l = 0;
															else {
																if(e >>> 0 > 16777215) {
																	l = 31;
																	break
																}
																q = (n + 1048320 | 0) >>> 16 & 8;
																W = n << q;
																V = (W + 520192 | 0) >>> 16 & 4;
																W = W << V;
																l = (W + 245760 | 0) >>> 16 & 2;
																l = 14 - (V | q | l) + (W << l >>> 15) | 0;
																l = e >>> (l + 7 | 0) & 1 | l << 1
															}
														while(0);
														s = 408 + (l << 2) | 0;
														o[R + (w + 28) >> 2] = l;
														o[R + (w + 20) >> 2] = 0;
														o[R + (w + 16) >> 2] = 0;
														a = o[27] | 0;
														i = 1 << l;
														if(!(a & i)) {
															o[27] = a | i;
															o[s >> 2] = h;
															o[R + (w + 24) >> 2] = s;
															o[R + (w + 12) >> 2] = h;
															o[R + (w + 8) >> 2] = h;
															break
														}
														n = o[s >> 2] | 0;
														t: do
															if((o[n + 4 >> 2] & -8 | 0) != (e | 0)) {
																l = e << ((l | 0) == 31 ? 0 : 25 - (l >>> 1) | 0);
																while(1) {
																	r = n + 16 + (l >>> 31 << 2) | 0;
																	s = o[r >> 2] | 0;
																	if(!s) break;
																	if((o[s + 4 >> 2] & -8 | 0) == (e | 0)) {
																		K = s;
																		break t
																	} else {
																		l = l << 1;
																		n = s
																	}
																}
																if(r >>> 0 < (o[30] | 0) >>> 0) se();
																else {
																	o[r >> 2] = h;
																	o[R + (w + 24) >> 2] = n;
																	o[R + (w + 12) >> 2] = h;
																	o[R + (w + 8) >> 2] = h;
																	break n
																}
															} else K = n;
														while(0);
														n = K + 8 | 0;
														r = o[n >> 2] | 0;
														W = o[30] | 0;
														if(r >>> 0 >= W >>> 0 & K >>> 0 >= W >>> 0) {
															o[r + 12 >> 2] = h;
															o[n >> 2] = h;
															o[R + (w + 8) >> 2] = r;
															o[R + (w + 12) >> 2] = K;
															o[R + (w + 24) >> 2] = 0;
															break
														} else se()
													} else {
														W = (o[29] | 0) + e | 0;
														o[29] = W;
														o[32] = h;
														o[R + (w + 4) >> 2] = W | 1
													}
												while(0);
												a = R + (E | 8) | 0;
												break e
											} else l = 552;
										while(1) {
											a = o[l >> 2] | 0;
											if(a >>> 0 <= m >>> 0 ? (s = o[l + 4 >> 2] | 0, i = a + s | 0, i >>> 0 > m >>> 0) : 0) break;
											l = o[l + 8 >> 2] | 0
										}
										l = a + (s + -39) | 0;
										l = a + (s + -47 + ((l & 7 | 0) == 0 ? 0 : 0 - l & 7)) | 0;
										f = m + 16 | 0;
										l = l >>> 0 < f >>> 0 ? m : l;
										s = l + 8 | 0;
										a = R + 8 | 0;
										a = (a & 7 | 0) == 0 ? 0 : 0 - a & 7;
										W = v + -40 - a | 0;
										o[32] = R + a;
										o[29] = W;
										o[R + (a + 4) >> 2] = W | 1;
										o[R + (v + -36) >> 2] = 40;
										o[33] = o[148];
										a = l + 4 | 0;
										o[a >> 2] = 27;
										o[s >> 2] = o[138];
										o[s + 4 >> 2] = o[139];
										o[s + 8 >> 2] = o[140];
										o[s + 12 >> 2] = o[141];
										o[138] = R;
										o[139] = v;
										o[141] = 0;
										o[140] = s;
										s = l + 28 | 0;
										o[s >> 2] = 7;
										if((l + 32 | 0) >>> 0 < i >>> 0)
											do {
												W = s;
												s = s + 4 | 0;
												o[s >> 2] = 7
											} while ((W + 8 | 0) >>> 0 < i >>> 0);
										if((l | 0) != (m | 0)) {
											e = l - m | 0;
											o[a >> 2] = o[a >> 2] & -2;
											o[m + 4 >> 2] = e | 1;
											o[l >> 2] = e;
											i = e >>> 3;
											if(e >>> 0 < 256) {
												s = i << 1;
												l = 144 + (s << 2) | 0;
												a = o[26] | 0;
												t = 1 << i;
												if(a & t) {
													n = 144 + (s + 2 << 2) | 0;
													r = o[n >> 2] | 0;
													if(r >>> 0 < (o[30] | 0) >>> 0) se();
													else {
														H = n;
														z = r
													}
												} else {
													o[26] = a | t;
													H = 144 + (s + 2 << 2) | 0;
													z = l
												}
												o[H >> 2] = m;
												o[z + 12 >> 2] = m;
												o[m + 8 >> 2] = z;
												o[m + 12 >> 2] = l;
												break
											}
											n = e >>> 8;
											if(n)
												if(e >>> 0 > 16777215) s = 31;
												else {
													K = (n + 1048320 | 0) >>> 16 & 8;
													W = n << K;
													q = (W + 520192 | 0) >>> 16 & 4;
													W = W << q;
													s = (W + 245760 | 0) >>> 16 & 2;
													s = 14 - (q | K | s) + (W << s >>> 15) | 0;
													s = e >>> (s + 7 | 0) & 1 | s << 1
												}
											else s = 0;
											t = 408 + (s << 2) | 0;
											o[m + 28 >> 2] = s;
											o[m + 20 >> 2] = 0;
											o[f >> 2] = 0;
											n = o[27] | 0;
											r = 1 << s;
											if(!(n & r)) {
												o[27] = n | r;
												o[t >> 2] = m;
												o[m + 24 >> 2] = t;
												o[m + 12 >> 2] = m;
												o[m + 8 >> 2] = m;
												break
											}
											n = o[t >> 2] | 0;
											n: do
												if((o[n + 4 >> 2] & -8 | 0) != (e | 0)) {
													s = e << ((s | 0) == 31 ? 0 : 25 - (s >>> 1) | 0);
													while(1) {
														r = n + 16 + (s >>> 31 << 2) | 0;
														t = o[r >> 2] | 0;
														if(!t) break;
														if((o[t + 4 >> 2] & -8 | 0) == (e | 0)) {
															j = t;
															break n
														} else {
															s = s << 1;
															n = t
														}
													}
													if(r >>> 0 < (o[30] | 0) >>> 0) se();
													else {
														o[r >> 2] = m;
														o[m + 24 >> 2] = n;
														o[m + 12 >> 2] = m;
														o[m + 8 >> 2] = m;
														break r
													}
												} else j = n;
											while(0);
											n = j + 8 | 0;
											r = o[n >> 2] | 0;
											W = o[30] | 0;
											if(r >>> 0 >= W >>> 0 & j >>> 0 >= W >>> 0) {
												o[r + 12 >> 2] = m;
												o[n >> 2] = m;
												o[m + 8 >> 2] = r;
												o[m + 12 >> 2] = j;
												o[m + 24 >> 2] = 0;
												break
											} else se()
										}
									} else {
										W = o[30] | 0;
										if((W | 0) == 0 | R >>> 0 < W >>> 0) o[30] = R;
										o[138] = R;
										o[139] = v;
										o[141] = 0;
										o[35] = o[144];
										o[34] = -1;
										n = 0;
										do {
											W = n << 1;
											K = 144 + (W << 2) | 0;
											o[144 + (W + 3 << 2) >> 2] = K;
											o[144 + (W + 2 << 2) >> 2] = K;
											n = n + 1 | 0
										} while ((n | 0) != 32);
										W = R + 8 | 0;
										W = (W & 7 | 0) == 0 ? 0 : 0 - W & 7;
										K = v + -40 - W | 0;
										o[32] = R + W;
										o[29] = K;
										o[R + (W + 4) >> 2] = K | 1;
										o[R + (v + -36) >> 2] = 40;
										o[33] = o[148]
									}
								while(0);
								r = o[29] | 0;
								if(r >>> 0 > p >>> 0) {
									W = r - p | 0;
									o[29] = W;
									a = o[32] | 0;
									o[32] = a + p;
									o[a + (p + 4) >> 2] = W | 1;
									o[a + 4 >> 2] = p | 3;
									a = a + 8 | 0;
									break
								}
							}
							o[(zi() | 0) >> 2] = 12;
							a = 0
						} else a = 0
					}
				while(0);
				return a | 0
			}

			function Hi(e) {
				e = e | 0;
				var r = 0,
					n = 0,
					t = 0,
					i = 0,
					a = 0,
					s = 0,
					l = 0,
					f = 0,
					u = 0,
					c = 0,
					d = 0,
					h = 0,
					E = 0,
					w = 0,
					m = 0,
					S = 0,
					p = 0,
					v = 0,
					_ = 0,
					b = 0,
					k = 0,
					F = 0,
					M = 0,
					g = 0,
					R = 0,
					y = 0;
				e: do
					if(e) {
						i = e + -8 | 0;
						u = o[30] | 0;
						r: do
							if(i >>> 0 >= u >>> 0 ? (t = o[e + -4 >> 2] | 0, n = t & 3, (n | 0) != 1) : 0) {
								b = t & -8;
								k = e + (b + -8) | 0;
								do
									if(!(t & 1)) {
										i = o[i >> 2] | 0;
										if(!n) break e;
										c = -8 - i | 0;
										h = e + c | 0;
										E = i + b | 0;
										if(h >>> 0 < u >>> 0) break r;
										if((h | 0) == (o[31] | 0)) {
											a = e + (b + -4) | 0;
											i = o[a >> 2] | 0;
											if((i & 3 | 0) != 3) {
												y = h;
												a = E;
												break
											}
											o[28] = E;
											o[a >> 2] = i & -2;
											o[e + (c + 4) >> 2] = E | 1;
											o[k >> 2] = E;
											break e
										}
										n = i >>> 3;
										if(i >>> 0 < 256) {
											t = o[e + (c + 8) >> 2] | 0;
											a = o[e + (c + 12) >> 2] | 0;
											i = 144 + (n << 1 << 2) | 0;
											do
												if((t | 0) != (i | 0)) {
													if(t >>> 0 >= u >>> 0 ? (o[t + 12 >> 2] | 0) == (h | 0) : 0) break;
													se()
												}
											while(0);
											if((a | 0) == (t | 0)) {
												o[26] = o[26] & ~(1 << n);
												y = h;
												a = E;
												break
											}
											do
												if((a | 0) == (i | 0)) r = a + 8 | 0;
												else {
													if(a >>> 0 >= u >>> 0 ? (s = a + 8 | 0, (o[s >> 2] | 0) == (h | 0)) : 0) {
														r = s;
														break
													}
													se()
												}
											while(0);
											o[t + 12 >> 2] = a;
											o[r >> 2] = t;
											y = h;
											a = E;
											break
										}
										s = o[e + (c + 24) >> 2] | 0;
										i = o[e + (c + 12) >> 2] | 0;
										do
											if((i | 0) == (h | 0)) {
												t = e + (c + 20) | 0;
												i = o[t >> 2] | 0;
												if(!i) {
													t = e + (c + 16) | 0;
													i = o[t >> 2] | 0;
													if(!i) {
														d = 0;
														break
													}
												}
												while(1) {
													n = i + 20 | 0;
													r = o[n >> 2] | 0;
													if(r) {
														i = r;
														t = n;
														continue
													}
													n = i + 16 | 0;
													r = o[n >> 2] | 0;
													if(!r) break;
													else {
														i = r;
														t = n
													}
												}
												if(t >>> 0 < u >>> 0) se();
												else {
													o[t >> 2] = 0;
													d = i;
													break
												}
											} else {
												t = o[e + (c + 8) >> 2] | 0;
												if((t >>> 0 >= u >>> 0 ? (l = t + 12 | 0, (o[l >> 2] | 0) == (h | 0)) : 0) ? (f = i + 8 | 0, (o[f >> 2] | 0) == (h | 0)) : 0) {
													o[l >> 2] = i;
													o[f >> 2] = t;
													d = i;
													break
												}
												se()
											}
										while(0);
										if(s) {
											i = o[e + (c + 28) >> 2] | 0;
											t = 408 + (i << 2) | 0;
											if((h | 0) == (o[t >> 2] | 0)) {
												o[t >> 2] = d;
												if(!d) {
													o[27] = o[27] & ~(1 << i);
													y = h;
													a = E;
													break
												}
											} else {
												if(s >>> 0 < (o[30] | 0) >>> 0) se();
												i = s + 16 | 0;
												if((o[i >> 2] | 0) == (h | 0)) o[i >> 2] = d;
												else o[s + 20 >> 2] = d;
												if(!d) {
													y = h;
													a = E;
													break
												}
											}
											t = o[30] | 0;
											if(d >>> 0 < t >>> 0) se();
											o[d + 24 >> 2] = s;
											i = o[e + (c + 16) >> 2] | 0;
											do
												if(i)
													if(i >>> 0 < t >>> 0) se();
													else {
														o[d + 16 >> 2] = i;
														o[i + 24 >> 2] = d;
														break
													}
											while(0);
											i = o[e + (c + 20) >> 2] | 0;
											if(i)
												if(i >>> 0 < (o[30] | 0) >>> 0) se();
												else {
													o[d + 20 >> 2] = i;
													o[i + 24 >> 2] = d;
													y = h;
													a = E;
													break
												}
											else {
												y = h;
												a = E
											}
										} else {
											y = h;
											a = E
										}
									} else {
										y = i;
										a = b
									}
								while(0);
								if(y >>> 0 < k >>> 0 ? (w = e + (b + -4) | 0, m = o[w >> 2] | 0, (m & 1 | 0) != 0) : 0) {
									if(!(m & 2)) {
										if((k | 0) == (o[32] | 0)) {
											R = (o[29] | 0) + a | 0;
											o[29] = R;
											o[32] = y;
											o[y + 4 >> 2] = R | 1;
											if((y | 0) != (o[31] | 0)) break e;
											o[31] = 0;
											o[28] = 0;
											break e
										}
										if((k | 0) == (o[31] | 0)) {
											R = (o[28] | 0) + a | 0;
											o[28] = R;
											o[31] = y;
											o[y + 4 >> 2] = R | 1;
											o[y + R >> 2] = R;
											break e
										}
										f = (m & -8) + a | 0;
										n = m >>> 3;
										do
											if(m >>> 0 >= 256) {
												r = o[e + (b + 16) >> 2] | 0;
												a = o[e + (b | 4) >> 2] | 0;
												do
													if((a | 0) == (k | 0)) {
														i = e + (b + 12) | 0;
														a = o[i >> 2] | 0;
														if(!a) {
															i = e + (b + 8) | 0;
															a = o[i >> 2] | 0;
															if(!a) {
																F = 0;
																break
															}
														}
														while(1) {
															t = a + 20 | 0;
															n = o[t >> 2] | 0;
															if(n) {
																a = n;
																i = t;
																continue
															}
															t = a + 16 | 0;
															n = o[t >> 2] | 0;
															if(!n) break;
															else {
																a = n;
																i = t
															}
														}
														if(i >>> 0 < (o[30] | 0) >>> 0) se();
														else {
															o[i >> 2] = 0;
															F = a;
															break
														}
													} else {
														i = o[e + b >> 2] | 0;
														if((i >>> 0 >= (o[30] | 0) >>> 0 ? (v = i + 12 | 0,
																(o[v >> 2] | 0) == (k | 0)) : 0) ? (_ = a + 8 | 0, (o[_ >> 2] | 0) == (k | 0)) : 0) {
															o[v >> 2] = a;
															o[_ >> 2] = i;
															F = a;
															break
														}
														se()
													}
												while(0);
												if(r) {
													a = o[e + (b + 20) >> 2] | 0;
													i = 408 + (a << 2) | 0;
													if((k | 0) == (o[i >> 2] | 0)) {
														o[i >> 2] = F;
														if(!F) {
															o[27] = o[27] & ~(1 << a);
															break
														}
													} else {
														if(r >>> 0 < (o[30] | 0) >>> 0) se();
														a = r + 16 | 0;
														if((o[a >> 2] | 0) == (k | 0)) o[a >> 2] = F;
														else o[r + 20 >> 2] = F;
														if(!F) break
													}
													a = o[30] | 0;
													if(F >>> 0 < a >>> 0) se();
													o[F + 24 >> 2] = r;
													i = o[e + (b + 8) >> 2] | 0;
													do
														if(i)
															if(i >>> 0 < a >>> 0) se();
															else {
																o[F + 16 >> 2] = i;
																o[i + 24 >> 2] = F;
																break
															}
													while(0);
													n = o[e + (b + 12) >> 2] | 0;
													if(n)
														if(n >>> 0 < (o[30] | 0) >>> 0) se();
														else {
															o[F + 20 >> 2] = n;
															o[n + 24 >> 2] = F;
															break
														}
												}
											} else {
												t = o[e + b >> 2] | 0;
												a = o[e + (b | 4) >> 2] | 0;
												i = 144 + (n << 1 << 2) | 0;
												do
													if((t | 0) != (i | 0)) {
														if(t >>> 0 >= (o[30] | 0) >>> 0 ? (o[t + 12 >> 2] | 0) == (k | 0) : 0) break;
														se()
													}
												while(0);
												if((a | 0) == (t | 0)) {
													o[26] = o[26] & ~(1 << n);
													break
												}
												do
													if((a | 0) == (i | 0)) S = a + 8 | 0;
													else {
														if(a >>> 0 >= (o[30] | 0) >>> 0 ? (p = a + 8 | 0, (o[p >> 2] | 0) == (k | 0)) : 0) {
															S = p;
															break
														}
														se()
													}
												while(0);
												o[t + 12 >> 2] = a;
												o[S >> 2] = t
											}
										while(0);
										o[y + 4 >> 2] = f | 1;
										o[y + f >> 2] = f;
										if((y | 0) == (o[31] | 0)) {
											o[28] = f;
											break e
										} else a = f
									} else {
										o[w >> 2] = m & -2;
										o[y + 4 >> 2] = a | 1;
										o[y + a >> 2] = a
									}
									i = a >>> 3;
									if(a >>> 0 < 256) {
										t = i << 1;
										a = 144 + (t << 2) | 0;
										r = o[26] | 0;
										n = 1 << i;
										if(r & n) {
											n = 144 + (t + 2 << 2) | 0;
											r = o[n >> 2] | 0;
											if(r >>> 0 < (o[30] | 0) >>> 0) se();
											else {
												M = n;
												g = r
											}
										} else {
											o[26] = r | n;
											M = 144 + (t + 2 << 2) | 0;
											g = a
										}
										o[M >> 2] = y;
										o[g + 12 >> 2] = y;
										o[y + 8 >> 2] = g;
										o[y + 12 >> 2] = a;
										break e
									}
									r = a >>> 8;
									if(r)
										if(a >>> 0 > 16777215) i = 31;
										else {
											M = (r + 1048320 | 0) >>> 16 & 8;
											g = r << M;
											e = (g + 520192 | 0) >>> 16 & 4;
											g = g << e;
											i = (g + 245760 | 0) >>> 16 & 2;
											i = 14 - (e | M | i) + (g << i >>> 15) | 0;
											i = a >>> (i + 7 | 0) & 1 | i << 1
										}
									else i = 0;
									n = 408 + (i << 2) | 0;
									o[y + 28 >> 2] = i;
									o[y + 20 >> 2] = 0;
									o[y + 16 >> 2] = 0;
									r = o[27] | 0;
									t = 1 << i;
									n: do
										if(r & t) {
											n = o[n >> 2] | 0;
											t: do
												if((o[n + 4 >> 2] & -8 | 0) != (a | 0)) {
													i = a << ((i | 0) == 31 ? 0 : 25 - (i >>> 1) | 0);
													while(1) {
														r = n + 16 + (i >>> 31 << 2) | 0;
														t = o[r >> 2] | 0;
														if(!t) break;
														if((o[t + 4 >> 2] & -8 | 0) == (a | 0)) {
															R = t;
															break t
														} else {
															i = i << 1;
															n = t
														}
													}
													if(r >>> 0 < (o[30] | 0) >>> 0) se();
													else {
														o[r >> 2] = y;
														o[y + 24 >> 2] = n;
														o[y + 12 >> 2] = y;
														o[y + 8 >> 2] = y;
														break n
													}
												} else R = n;
											while(0);
											r = R + 8 | 0;
											n = o[r >> 2] | 0;
											g = o[30] | 0;
											if(n >>> 0 >= g >>> 0 & R >>> 0 >= g >>> 0) {
												o[n + 12 >> 2] = y;
												o[r >> 2] = y;
												o[y + 8 >> 2] = n;
												o[y + 12 >> 2] = R;
												o[y + 24 >> 2] = 0;
												break
											} else se()
										} else {
											o[27] = r | t;
											o[n >> 2] = y;
											o[y + 24 >> 2] = n;
											o[y + 12 >> 2] = y;
											o[y + 8 >> 2] = y
										}
									while(0);
									y = (o[34] | 0) + -1 | 0;
									o[34] = y;
									if(!y) r = 560;
									else break e;
									while(1) {
										r = o[r >> 2] | 0;
										if(!r) break;
										else r = r + 8 | 0
									}
									o[34] = -1;
									break e
								}
							}
						while(0);
						se()
					}
				while(0);
				return
			}

			function zi() {
				var e = 0;
				if(!0) e = 600;
				else e = o[(ae() | 0) + 60 >> 2] | 0;
				return e | 0
			}

			function ji() {
				var e = 0;
				do
					if(!(o[144] | 0)) {
						e = oe(30) | 0;
						if(!(e + -1 & e)) {
							o[146] = e;
							o[145] = e;
							o[147] = -1;
							o[148] = -1;
							o[149] = 0;
							o[137] = 0;
							o[144] = (ue(0) | 0) & -16 ^ 1431655768;
							break
						} else se()
					}
				while(0);
				return
			}

			function Yi() {}

			function Vi(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var i = 0;
				if((n | 0) >= 4096) return de(e | 0, r | 0, n | 0) | 0;
				i = e | 0;
				if((e & 3) == (r & 3)) {
					while(e & 3) {
						if(!n) return i | 0;
						t[e >> 0] = t[r >> 0] | 0;
						e = e + 1 | 0;
						r = r + 1 | 0;
						n = n - 1 | 0
					}
					while((n | 0) >= 4) {
						o[e >> 2] = o[r >> 2];
						e = e + 4 | 0;
						r = r + 4 | 0;
						n = n - 4 | 0
					}
				}
				while((n | 0) > 0) {
					t[e >> 0] = t[r >> 0] | 0;
					e = e + 1 | 0;
					r = r + 1 | 0;
					n = n - 1 | 0
				}
				return i | 0
			}

			function qi(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var i = 0;
				if((r | 0) < (e | 0) & (e | 0) < (r + n | 0)) {
					i = e;
					r = r + n | 0;
					e = e + n | 0;
					while((n | 0) > 0) {
						e = e - 1 | 0;
						r = r - 1 | 0;
						n = n - 1 | 0;
						t[e >> 0] = t[r >> 0] | 0
					}
					e = i
				} else Vi(e, r, n) | 0;
				return e | 0
			}

			function Ki(e, r, n) {
				e = e | 0;
				r = r | 0;
				n = n | 0;
				var i = 0,
					a = 0,
					s = 0,
					l = 0;
				i = e + n | 0;
				if((n | 0) >= 20) {
					r = r & 255;
					s = e & 3;
					l = r | r << 8 | r << 16 | r << 24;
					a = i & ~3;
					if(s) {
						s = e + 4 - s | 0;
						while((e | 0) < (s | 0)) {
							t[e >> 0] = r;
							e = e + 1 | 0
						}
					}
					while((e | 0) < (a | 0)) {
						o[e >> 2] = l;
						e = e + 4 | 0
					}
				}
				while((e | 0) < (i | 0)) {
					t[e >> 0] = r;
					e = e + 1 | 0
				}
				return e - n | 0
			}
			return {
				_free: Hi,
				___errno_location: zi,
				_memmove: qi,
				_Decoder_Interface_Decode: Re,
				_Decoder_Interface_exit: ge,
				_Encoder_Interface_init: ye,
				_memset: Ki,
				_malloc: xi,
				_memcpy: Vi,
				_Encoder_Interface_exit: Oe,
				_Decoder_Interface_init: Me,
				_Encoder_Interface_Encode: Ae,
				runPostSets: Yi,
				stackAlloc: we,
				stackSave: me,
				stackRestore: Se,
				establishStackSpace: pe,
				setThrew: ve,
				setTempRet0: ke,
				getTempRet0: Fe
			}
		}(Module.asmGlobalArg, Module.asmLibraryArg, buffer),
		_Encoder_Interface_Encode = Module._Encoder_Interface_Encode = asm._Encoder_Interface_Encode,
		_free = Module._free = asm._free,
		runPostSets = Module.runPostSets = asm.runPostSets,
		_memmove = Module._memmove = asm._memmove,
		_Decoder_Interface_exit = Module._Decoder_Interface_exit = asm._Decoder_Interface_exit,
		_Encoder_Interface_init = Module._Encoder_Interface_init = asm._Encoder_Interface_init,
		_memset = Module._memset = asm._memset,
		_malloc = Module._malloc = asm._malloc,
		_memcpy = Module._memcpy = asm._memcpy,
		_Decoder_Interface_Decode = Module._Decoder_Interface_Decode = asm._Decoder_Interface_Decode,
		_Decoder_Interface_init = Module._Decoder_Interface_init = asm._Decoder_Interface_init,
		_Encoder_Interface_exit = Module._Encoder_Interface_exit = asm._Encoder_Interface_exit,
		___errno_location = Module.___errno_location = asm.___errno_location;
	Runtime.stackAlloc = asm.stackAlloc, Runtime.stackSave = asm.stackSave, Runtime.stackRestore = asm.stackRestore, Runtime.establishStackSpace = asm.establishStackSpace, Runtime.setTempRet0 = asm.setTempRet0, Runtime.getTempRet0 = asm.getTempRet0, ExitStatus.prototype = new Error, ExitStatus.prototype.constructor = ExitStatus;
	var initialStackTop, preloadStartTime = null,
		calledMain = !1;
	dependenciesFulfilled = function e() {
		Module.calledRun || run(), Module.calledRun || (dependenciesFulfilled = e)
	}, Module.callMain = Module.callMain = function(e) {
		function r() {
			for(var e = 0; e < 3; e++) t.push(0)
		}
		assert(0 == runDependencies, "cannot call main when async dependencies remain! (listen on __ATMAIN__)"), assert(0 == __ATPRERUN__.length, "cannot call main when preRun functions remain to be called"), e = e || [], ensureInitRuntime();
		var n = e.length + 1,
			t = [allocate(intArrayFromString(Module.thisProgram), "i8", ALLOC_NORMAL)];
		r();
		for(var i = 0; i < n - 1; i += 1) t.push(allocate(intArrayFromString(e[i]), "i8", ALLOC_NORMAL)), r();
		t.push(0), t = allocate(t, "i32", ALLOC_NORMAL), initialStackTop = Runtime.stackSave();
		try {
			var o = Module._main(n, t, 0);
			exit(o, !0)
		} catch(a) {
			if(a instanceof ExitStatus) return;
			if("SimulateInfiniteLoop" == a) return Module.noExitRuntime = !0, void Runtime.stackRestore(initialStackTop);
			throw a && "object" == typeof a && a.stack && Module.printErr("exception thrown: " + [a, a.stack]), a
		} finally {
			calledMain = !0
		}
	}, Module.run = Module.run = run, Module.exit = Module.exit = exit;
	var abortDecorators = [];
	if(Module.abort = Module.abort = abort, Module.preInit)
		for("function" == typeof Module.preInit && (Module.preInit = [Module.preInit]); Module.preInit.length > 0;) Module.preInit.pop()();
	var shouldRunNow = !0;
	return Module.noInitialRun && (shouldRunNow = !1), Module.noExitRuntime = !0, run(), AMR
}();