(function() {
	var Class = {
		toast: function toast(str, toastTarget) { //toast(str, toastTarget)
			var $toast = $('#toast');
			if($toast.length<1) {
				$toast=$('<div id="toast"></div>');
				if(toastTarget){
					toastTarget.prepend($toast);
				} else{
					$('body').append($toast);
				}
			}
			$toast.append('<span>'+str+'</span>').addClass('on');
			var $toastTimer = setTimeout(function(){
				$toast.removeClass('on');
				$toast.remove();
				},3500);
			console.log('toast');
		}, 
		initTotalOnce : function initTotalOnce(){
			$(".total").each(function() {
				var sum = 0;
				var sumG = 0;
				var sumMinus = 0;
				var sumMinusG = 0;
				var count = 0;
				var countG = 0;
				$("table").find(".url").each(function() {
						if ($(this).html() != "") {
							sum++;
						} else {
							sumMinus++;
						}
					});
				$("table").find(".del .url").each(function() {
						if ($(this).html() != "") {
							sumG++;
						} else {
							sumMinusG++;
						}
					});
				$("table").find(".date").each(function() {
						if ($(this).html() == "") {
							count++;
						}
					});
				$("table").find(".del").each(function() {
						if ($(this).find(".date").html() == "") {
							countG++;
						}
					});
				count = sum - sumG + (sumMinus - sumMinusG) - (count - countG);
				sum = sum - sumG;
				str = "";
				str += "<span>" + "<strong>" + count + "</strong>" + "/" + sum + "pages" + "</>" + "<em>" + "(진행률 " + parseInt((count / sum) * 100) + "%" + ")" + "</em>";
				
				$(this).find("> span").html(str);
			});
		}, 
		initUrlLinkOnce : function initUrlLinkOnce(){
			$(".url").each(function() {
				var link = $(this).text(),
					str = "";
				if (link != null && link != "") {
					str += '<a href="' + "../" + link + '" target="_blank">' + link + "</a>";
					$(this).empty().html(str);
				}
			});
			$(".url a").click(function() {
				var $active = $(this);
				$("a").removeAttr("style");
				$active.css({"text-decoration": "underline",color: "#786BD9"
				});
			});
			//Class.setPagePreview();
		},
		initModifyHistoryOnce : function initModifyHistoryOnce(){
			$('.date').each(function () {
				var now = new Date();
				var year = now.getFullYear();
				var month = now.getMonth() + 1;
				if (month < 10) {
					month = "0" + month;
				}
				var date = now.getDate();
				if (date < 10) {
					date = "0" + date;
				}
				var $date = $('> span', this);
				var today = year + '-' + month + '-' + date;
				if ($date.length > 1) {
					str = "";
					str += "<strong>" + $date.filter(':last').text() + "</strong>";
					$date.filter(':not(:last)').each(function () {
						str += "<a data-date=\"" + $(this).text() + "\">○</a>";
					});
					$date.filter(':last').each(function () {
						if ($(this).text() === today) {
							str += "<a data-date=\"" + $(this).text() + "\" style='color:red'>●</a>";
						} else {
							str += "<a data-date=\"" + $(this).text() + "\">●</a>";
						}
					});
					if ($date.filter(':first').text() != "") {
						$(this).empty().html(str);
					}
					var chkDay = $date.filter(':last').text().split(" ");
					var chkDay2 = chkDay[0].split("-");
				}
				$('.date a').on({
					'mouseenter' : function(){
						$(this).parent().find('strong').text($(this).attr('data-date'));
					},
					'mouseleave' : function(){
						$(this).parent().find('strong').text($(this).parent().find('a:last').attr('data-date'));
					}  
				})
			});
		},
		initTableSortOnce : function initTableSortOnce(){
			if($("#dataTable").length){
				var table = $("#dataTable").dataTable({
					"pageLength": -1,
					"order": [],
					"lengthMenu": [[ 10 , 25 , 50 , -1 ], [ 10 , 25 , 50 , " All "]]
					//order : [[1, 'desc']]
					// "search": {
					//	 "search": "검색어 입력"
					// }
				});
			}
			
		},	
		initPageListLeftOnce : function initPageListLeftOnce(){
			//var depth1LI = $('.pageListLeft>ul>li', this);

			 $(document)
			 .on('click','.pageListLeft a:not(.logolink)',function(){
				 var li = $(this).parent();
				 var sibling = li.siblings();
				 var ul = $('>ul', li);

				 sibling.removeClass('active');
				 if(!li.hasClass('active')){
					 $('li', sibling).removeClass('active');
					 $('ul', sibling).slideUp();
					 li.addClass('active');

					 if (ul.length > 0) {
						 ul.slideDown();
					 }
				 } else {
                     //li.removeClass('active');
                     if(ul.length) li.removeClass('active');
					 ul.slideUp();
				 }
			 });


		},
		initWindowLoad: function initWindowLoad(){
			$(window).on('load',function(e){
				Class.setLayout();
			});
		},
		// 항상 마지막에
		/* 레이아웃 세팅 */	setLayout: function setLayout() {
			//console.log('setLayout');
			var locArray = document.location.pathname.split('/');
			//var parLoc = locArray[locArray.length-3];
			var parLoc = locArray[locArray.length-1];
			var newLoc = parLoc.split('.')[0];
			
			var $body = $('body.pagelist.mobile'),
				$a = $body.find('.url a'),
				$iframe = $('<iframe class="previewIframe"></iframe>');

				var $agent = navigator.userAgent;
				var $browser = '';
				if((/Android/i).test($agent)) {
					$browser = 'Android';
				} else if((/iPad|iPhone|iPod/i).test($agent)) {
					$browser = 'iOS';
				}
				//console.log($browser);
				if($body.length && $browser != 'Android' && $browser != 'iOS'){
					$body.append($iframe); //$body.closest('html').hasClass('pc')
					$a.each(function(){
						var $this = $(this);
						$this
							.on('mouseover',function(){
								$iframe.attr('src', $this.attr('href'));
								$iframe.css({'display':'block'});
								//console.log('mouseover');
						})
							.on('mouseout',function(){
								$iframe.css({'display':'none'});
								//console.log('mouseout');
						});
					});
					//console.log('setPagePreview');
				}
		},
		/* nhList 초기화 */
		init: function() {
			for(var func in Class) {
				if(Class.hasOwnProperty(func)) {
					if(func !== 'init' && func.indexOf('init')==0) {
						var $document = $(document);
						if(func.lastIndexOf('Once')+4 == func.length && !$document.data(func)) {
							$document.data(func, true);
							Class[func].call(this);
							//console.log('init1 ' + func + ' ' + func.lastIndexOf('Once'), func.length);
						} else if ( func.lastIndexOf('Once')+4 != func.length) {
							Class[func].call(this);
							//console.log('init2 ' + func + ' ' + func.lastIndexOf('Once'), func.length);
						}
					}
				}
			}
		}
	};
	if (typeof this['nhList'] === 'undefined') {
		this['nhList'] = Class;
	}
})();

$.fn.nhList = nhList.init;
$(function() {
	$(document).nhList();
	nhList.setLayout();
});
