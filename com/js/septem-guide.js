/*
 * [SEPTEM] UI/UX Dev Team
 * @description [SEPTEM] guide
 */

(function() {
    var Class = {
        winHeight: 0,
        winWidth: 0,
        popZIndex: 5000,
        /* 브라우저 체크 */	initBrowserOnce: function initBrowserOnce(a, z) {
            a = navigator.userAgent;
            var u = 'unknown',
                x = 'X',
                m = function(r, h) {
                    for (var i = 0; i < h.length; i = i + 1) {
                        r = r.replace(h[i][0], h[i][1]);
                    }
                    return r;
                },
                c = function(i, a, b, c) {
                    var r = {
                        name: m((a.exec(i) || [u, u])[1], b)
                    };
                    r[r.name] = true;
                    r.version = (c.exec(i) || [x, x, x, x])[3];
                    if (r.name.match(/safari/) && r.version > 400) {
                        r.version = '2.0';
                    }
                    if (r.name === 'presto') {
                        r.version = ($.browser.version > 9.27) ? 'futhark' : 'linear_b';
                    }
                    r.versionNumber = parseFloat(r.version) || 0;
                    r.versionX = (r.version !== x) ? (r.version + '').substr(0, 1) : x;
                    r.className = r.name + r.versionX;
                    return r;
                };
            a = (a.match(/Opera|Navigator|Minefield|KHTML|Chrome/) ? m(a, [
                [/(Firefox|MSIE|KHTML,\slike\sGecko|Konqueror)/, ''],
                ['Chrome Safari', 'Chrome'],
                ['KHTML', 'Konqueror'],
                ['Minefield', 'Firefox'],
                ['Navigator', 'Netscape']
            ]) : a).toLowerCase();
            $.browser = $.extend((!z) ? $.browser : {}, c(a, /(camino|chrome|firefox|netscape|konqueror|lynx|msie|opera|safari)/, [], /(camino|chrome|firefox|netscape|netscape6|opera|version|konqueror|lynx|msie|safari)(\/|\s)([a-z0-9\.\+]*?)(;|dev|rel|\s|$)/));
            $.layout = c(a, /(gecko|konqueror|msie|opera|webkit)/, [
                ['konqueror', 'khtml'],
                ['msie', 'trident'],
                ['opera', 'presto']
            ], /(applewebkit|rv|konqueror|msie)(:|\/|\s)([a-z0-9\.]*?)(;|\)|\s)/);
            $.os = {
                name: (/(win|mac|linux|sunos|solaris|iphone)/.exec(navigator.platform.toLowerCase()) || [u])[0].replace('sunos', 'solaris')
            };
            if (!z) {
                $('html').addClass([$.os.name, $.browser.name, $.browser.className, $.layout.name, $.layout.className].join(' '));
            }
		}
		,
        /* body에 브라우저 CSS 추가 */	initBodyCssOnce: function initBodyCssOnce() {
                var agent = navigator.userAgent.toLowerCase();
                if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1)) {
                    $('body').addClass('msie ie11');

				} else if((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)){
					$('body').addClass('msie ie11').removeClass('ie11');
				}

				if (/Edge\/\d./i.test(navigator.userAgent)){
					$('body').addClass('msEdge');
				}

                // if ($.browser.name == 'msie') {
                //     $('body').addClass($.browser.name);
                //     // var str = "msie";
                //     // var console = window.console || {log:function(){}};
                //     // console.log(str);
                // } else {
                //     $('body').addClass($.browser.name);
                // }

        }
        , 
        /* asideShow */ initAsideShowOnce : function initAsideShowOnce(){
            $(document)
                .on('click', '.menuToggle', function(e) {
                    $('.wrap').toggleClass('asideShow');
                    e.preventDefault();
                });
        }
        , 
        /* yearSelect */ initYearSelectOnce : function initYearSelectOnce(){
            if($('.yearSelect').length){
                var $yearSelect = $('.yearSelect');

                $(document)
                    .on('click','.yearSelect dt',function(){
                        $(this).toggleClass('active')
                        $(this).next('dd').toggleClass('active')
                    })
                    .on('mouseup',function(e) {
                        if (!$yearSelect.is(e.target) && $yearSelect.has(e.target).length === 0){
                                $('.yearSelect').find('dd, dt').removeClass('active');
                                if(parent.frames['frmTopmenu']){
                                    var frames = window.parent.frames['frmTopmenu'];
                                    var element = frames.document.getElementsByTagName('dd')[0];
                                    element.removeAttribute('class');
                                    console.log('top.document');
                                }
                            }
                    });
            }
        }
		,/* setLayout */ setLayout : function setLayout(){
			Class.winWidth = $(window).width();
            Class.winHeight = $(window).height();
            var $html = $('html');
            var $scroll = $(window).scrollTop();
            var $yearSelect = $('.yearSelect');
            var $path = document.location.pathname.split('/');
                
            if($yearSelect.length){
                if($path.indexOf('2020') != -1){
                    $html.addClass('year y2020');
                    $yearSelect.find('dt a').text('2020년');
                } else if($path.indexOf('2019') != -1){
                    $html.addClass('year y2019');
                    $yearSelect.find('dt a').text('2019년');
                } else if($path.indexOf('2018') != -1){
                    $html.addClass('year y2018');
                    $yearSelect.find('dt a').text('2018년');
                } else {
                    $html.removeClass('year y2018 y2019 y2020');
                }
            }

            // var URLString = top.location.href + "/";
            // tURLString = URLString.split("/");
            // iii = tURLString.length > 2 ? (tURLString[3].length > 0 ? false:true) : false
            // if(!iii){
            //     document.cookie = "UrlString=" + top.window.location.href + "; path=/;";
            //     top.window.location.href = "http://"+top.window.location.host;
            // }
        }
        ,/* onLoad */ initWindowLoad: function initWindowLoad(){
			$(window).on('load',function(e){
				var locArray = document.location.pathname.split('/');
                var parLoc = locArray[locArray.length-3];
                var newLoc = locArray[locArray.length-2];
                
                if($('.aside').length){
                    $('.aside li a').each(function(){
                        var href = $(this).attr('href').split('/');
                        var par = href[href.length-3];
                        var cur =  href[href.length-2];
                        //console.log(cur, par)
                        if(cur.indexOf(newLoc) != -1 && (par.indexOf(parLoc) != -1 || par.length == 0)){
                            $(this).addClass('active');
                        }
                    });
            
                    var offset = $('.aside a.active').offset();
                    $('.aside').animate({scrollTop : offset.top - 30}, 400);
                }

                Class.winWidth = $(window).width();
                Class.winHeight = $(window).height();
                if(Class.winWidth<=980) {
                    $('html').addClass('mobile').removeClass('pc');
                } else {
                    $('html').addClass('pc').removeClass('mobile');

                    if(Class.winWidth < 1600){
                        $('html').addClass('narrow');
                    }
                    else {
                        $('html').removeClass('narrow');
                    }
                }
            });
		}
        ,/* scroll */ initWindowScroll: function initWindowScroll(){
			$(window).on('scroll',function(e){
				Class.winWidth = $(window).width();
				Class.winHeight = $(window).height();
				var $scroll = $(window).scrollTop();

				});
		}
		,
        //항상 마지막에
        /* window 세팅 */
        initWindowResizeOnce: function initWindowResizeOnce() {
            $(window)
                .on('resize', function() {
                    Class.winWidth = $(window).width();
                    Class.winHeight = $(window).height();

					if(Class.winWidth < 1600){
						$('html').addClass('narrow');
                    }
                    else {
                        $('html').removeClass('narrow');
                    }
				});
				Class.setLayout();
        },
        /* septemGuideUI 초기화 */
        init: function() {
            var wrapper = this;

            function init(obj, prefix) {
                prefix = typeof prefix === 'undefined' ? '' : prefix;

                for (var func in obj) {
                    if (obj.hasOwnProperty(func)) {
                        if (func.indexOf('_') == 0) {
                            init(obj[func], prefix + func);
                        } else {
                            if (func !== 'init' && func.indexOf('init') == 0) {
                                var $document = $(document);
                                if (func.lastIndexOf('Once') + 4 == func.length && !$document.data(prefix + func)) {
                                    $document.data(prefix + func, true);
                                    obj[func].call(wrapper);
                                } else if (func.lastIndexOf('Once') + 4 != func.length) {
                                    obj[func].call(wrapper);
                                }

                            }
                        }
                    }
                }
            }
            init(Class);
        }
    };

    if (typeof this['septemGuideUI'] === 'undefined') {
        this['septemGuideUI'] = Class;
    }
})();

$.fn.septemGuideUI = septemGuideUI.init;
$(function() {
	$(document).septemGuideUI();
});

//window pop
var win = null;
function NewWindow(mypage, myname, w, h, scroll) {
    var winl = (screen.width - w) / 2;
    var wint = (screen.height - h) / 2;
    var settings = 'height=' + h + ',';
    settings += 'width=' + w + ',';
    settings += 'top=' + wint + ',';
    settings += 'left=' + winl + ',';
    settings += 'scrollbars=' + scroll + ',';
    settings += 'resizable=yes';
    win = window.open(mypage, myname, settings);
    if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
}