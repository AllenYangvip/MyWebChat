! function(o, t) {
	function e(t) {
		s = t.pageIndex, chouti.lazyLoadImg("#content-list .news-pic img"), chouti.Init(), chouti.showPublishWindow("#pubTabZixun"), chouti.vote(""), chouti.cancelVote(), chouti.addCollect(), chouti.removeCollect(), chouti.shareweibo(""), chouti.timeChange(), i(), o(window).scroll(function() {
			var t = n();
			o(this).scrollTop() > 55 ? o("#yellow-msg-box-intohot").css({
				position: "fixed",
				top: "44px",
				left: t + "px",
				"z-index": "1"
			}).prev().css({
				marginBottom: "27px"
			}) : o("#yellow-msg-box-intohot").css({
				position: "relative",
				left: "0px",
				top: "0px"
			}).prev().css({
				marginBottom: "0px"
			})
		}), o(window).resize(function() {
			var t = n();
			o(this).scrollTop() > 133 && o("#yellow-msg-box-intohot").css("left", t + "px")
		})
	}

	function n() {
		var t = o(".main-content").offset().left + 28 - document.body.scrollLeft,
			e = navigator.userAgent.toLowerCase();
		if(e.indexOf("firefox") > 0) var t = o(".main-content").offset().left + 28 - document.documentElement.scrollLeft;
		var t;
		return t
	}

	function i() {
		o("#yellow-msg-box-intohot").click(function() {
			return o("#newIntoHotCount").val(0), window.location.href = "/all/hot/recent/1", !1
		}).hover(function() {
			o(this).addClass("yellow-comment-msg-box-hover")
		}, function() {
			o(this).removeClass("yellow-comment-msg-box-hover")
		})
	}
	var l = o.gozap,
		c = l.labi,
		s = (c.i18n, c.RESULT_CODE.success, 0);
	NS_links_hotts = {
		init: e,
		yellowIntohotBoxHover: i
	}
}(jQuery);