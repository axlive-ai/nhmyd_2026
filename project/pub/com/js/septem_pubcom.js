"use strict";
/* [SEPTEM] UI Dev Team */

$(function() {
	let thead = '<thead><tr><th>No</th><th>depth2</th><th>depth3</th><th>depth4</th><th>depth etc.</th><th>화면명</th><th>파일명</th><th>범위</th><th>최근수정일</th><th>작업자</th><th>비고</th></tr></thead>';
	$('.pubList table.display caption').after(thead);
	
	tableNo(); //테이블 넘버링 & date
	dataTable();
	menu();
	dataTableDateFilter();
	colorBox(); //No 클릭시 컬러박스 실행
	overIframe(); //파일명 마우스오버시 아이프레임
	total();
	scrollEvent();
	currentActive();
	imageList();
	matchMenu();

	$('#cboxOverlay').on('click',function(){
		$('html').css('overflow','auto');
		console.log('dd');
	})
});

const now = new Date();
let year = now.getFullYear();
let month = now.getMonth() + 1;
if (month < 10) {
	month = "0" + month;
}
let date = now.getDate();
if (date < 10) {
	date = "0" + date;
}
let today = year + '-' + month + '-' + date;

function tableNo(){
	$('.display tbody tr').each(function(e){
		let path = $(this).find('.path a').attr('href');
		$(this).prepend('<td class="no"><a href="' + path + '" class="colorNo cboxElement">' + (e+1) + '</a></td>');

		$(this).find('.date').each(function() {
			// let date = $(this).find('span');
			
			// date.attr('data-date', date.html()).empty();
			// let date = $(this).find('.date span');
			// if( $(this).date > 2 ){
			// 	date.attr('data-date', text).empty();	
			// }
			let lastDate = $(this).find(':last').html();
			$(this).prepend('<em>'+ lastDate +'</em>');
			var length = $(this).find('span').length;
			if( length > 1 ){
				$(this).find('span').each(function(index) {
					$(this).attr('data-date', $(this).html()).empty();
					if(index == (length -1 )){
						$(this).addClass('active');
						if( $(this).attr('data-date') == today ){
							$(this).addClass('today');
						}
					}
				});
			} else {
				$(this).find('span').remove();
			}
		});
	});
}


$('.date span').on({
	'mouseenter' : function(){
		$(this).parent().find('em').text($(this).attr('data-date'));
	},
	'mouseleave' : function(){
		$(this).parent().find('em').text($(this).parent().find('a:last').attr('data-date'));
	}  
})

function dataTable(){
	let dataTables = $('table.display').DataTable({
		"paging":   false,
		"info":     false,
		"search":	false,
		"orderMulti": true,
		"responsive": false,
		"details": false,
		"autoWidth": true,
	});	
}

function menu(){
	let dataTables = $('table.display').DataTable();
	if ($('.cmImages').length > 0) {
		$('.cmImages').each(function () {
			let imgsTxt = $(this).find('.imgTit').text();
			// $('.gnb ul').append('<li><a href="javascript:;">' + imgsTxt + '</a></li>');
			$('.gnb ul').append('<li><span>' + imgsTxt + '</span></li>');
		});
	} else { 
		$('table.display').each(function () {
			let captionTxt = $(this).find('caption').text();
			// $('.gnb ul').append('<li><a href="javascript:;">' + captionTxt + '</a></li>');
			$('.gnb ul').append('<li><span>' + captionTxt + '</span></li>');
		});
	}

	$('.gnb span').on('click', function() {
		let val = $(this).text();
		let _prev = $(this).parents('.gnb').find('.active').text(); //2023 마이데이터 고도화
		if ($('.cmImages').length > 0) { //imgList의 경우
			if (val == '전체보기') {
				$('.cmImages').css('display', 'block');
			} else {
				$('.cmImages').each(function () {
					let tit = $(this).find('.imgTit').text();
					if (tit == val) {
						$(this).css('display', 'block');
					} else {
						$(this).css('display', 'none');
					}
				});
			}
		}
		else {
			if (val == '전체보기') {
				$('.display').css('display', 'block');
				//$('#fromDate').val('');
			} else {
				$('.display').each(function () {
					let captionTxt = $(this).find('caption').text();
					if (captionTxt == val) {
						$(this).css('display', 'block');
					} else {
						$(this).css('display', 'none');
					}
				});
			}
		}
		$(window).scrollTop(0);
		$(this).parent().siblings('li').find('span').removeClass('active');
		$(this).addClass('active');
	});

	var clicking = false;
	var $gnb = $('.gnb')
	var slPos = '';
	var mlPos = '';
	var scrollL = $gnb.scrollLeft();
	$gnb.on('click, mousedown',function(e){
		clicking = true;
		slPos = e.pageX;
	});
	$(document).on('mouseup',function(e){
		clicking = false;
		scrollL = $gnb.scrollLeft();
	})
	$gnb.on('mousemove', function(e){
		if(clicking == false) return;
		mlPos = e.pageX;
		// if( slPos - mlPos > 10) {
		// 	scrollL += 10;
		// }else if( slPos - mlPos < 10) {
		// 	scrollL -= 10;
		// }
		scrollL = scrollL + (slPos - mlPos);
		$gnb.scrollLeft(scrollL);
	});
   

	
}

function dataTableDateFilter(){
	let dataTables = $('table.display').DataTable();
	$('.search').prepend('<span class="dataFilter"><input type="date" id="fromDate" placeholder="2018-01-01"> ~ <input type="date" id="toDate" placeholder="'+today+'" value=""></span> ');	

	$.fn.dataTable.ext.search.push(
		function(settings, data, dataIndex){
			let min = Date.parse($('#fromDate').val());
			let max = Date.parse($('#toDate').val());
			let targetDate = Date.parse(data[8]); //검색될 셀
			if( (isNaN(min) && isNaN(max) ) || 
				(isNaN(min) && targetDate <= max )|| 
				( min <= targetDate && isNaN(max) ) ||
				( targetDate >= min && targetDate <= max) ){ 
					return true;
			}
			return false;
		}
	)

	$('#toDate, #fromDate').on('change',function(){ //날짜검색
		dataTables.draw();
	});

	$('#tableSearch').on( 'keyup', function(){ //검색
		if ($('.cmImages').length > 0) { //imgList의 경우
			var keyword = $(this).val();
			var result = $('.name:contains("' + keyword + '")');
			console.log(result.length);
			$('.cmImages ul li').hide();
			$(result).parent('li').show();
		} else { 
			dataTables.search(this.value).draw();
			$('.dataTable').show();
			$('.dataTables_empty').parents('.dataTable').hide();
		}
	});
};

function colorBox(){
	let colorW = "95%"
	$('#cboxWrapper').append('<div class="resizeBtn"><button value="1600">1600px</button><button value="1024">1024px</button><button value="960">960px</button><button value="800">800px</button><button value="717">717px</button><button value="414">414px</button><button value="375">375px</button><button value="360">360px</button><button value="320">320px</button></div>')
	$('.resizeBtn button').on('click',function(){
		colorW = $(this).attr('value');
		$.colorbox.resize({width:colorW, height:'90%'});
		$(".colorNo").colorbox({width:colorW, height:"90%"}); //reset
		$('.resizeBtn button').removeClass('active');
		$(this).addClass('active');
		return colorW;
	})
	$(".colorNo").colorbox({rel:'iframe', iframe:true, scalePhotos:true, width:colorW, height:"90%", opacity:.8, title: function(){
		let title = '';
		let pathTxt = $(this).parent().siblings('td:nth-child(7)').text();
		title = '<span class="pathTxt">'+pathTxt+'</span><span class="depthTxt">';
		title += $(this).parents('table').find('caption').text();
		title += ' > ';
		for (let i = 2; i < 7; i++) {
			if( $(this).parent().siblings('td:nth-child('+i+')').text() != ''){
				if(i == 2){
					title += $(this).parent().siblings('td:nth-child('+i+')').text();
				}else{
					title += ' > ';
					title += $(this).parent().siblings('td:nth-child('+i+')').text();
				}
			}else{
				break;
			}
		}
		title += '</span>';
		let url = $(this).attr('href');
		return '<a href="' + url + '" target="_blank" class="colorBtn">열기</a><span class="">' + title + '</span>';
	}});
	$(document).on('cbox_open', function(){
		$('html').css('overflow','hidden')
	});
	$(document).on('cbox_closed', function(){
		$('html').css('overflow','')
	});
	$(document).on('cbox_load', function(){
		$.colorbox.resize({width:colorW, height:'90%'});
		console.log('colorW'+colorW);
	});
};

function overIframe(){
	const $body = $('body');
	let prevIframe = $('<iframe class="previewIframe"></iframe>');
	$('.path a')
		.on('mouseover',function(){
			$body.append(prevIframe);
			let $this = $(this);
			prevIframe.attr('src', $this.attr('href'));
		})
		.on('mouseout',function(){
			prevIframe.remove();
		});
}

function total(){
	$(".total").each(function() {
		let sum = 0;
		let sumG = 0;
		let sumMinus = 0;
		let sumMinusG = 0;
		let count = 0;
		let countG = 0;
		$("table").find(".path a").each(function() {
				if ($(this).html() != "") {
					sum++;
				} else {
					sumMinus++;
				}
			});
		$("table").find(".del .path a").each(function() {
				if ($(this).html() != "") {
					sumG++;
				} else {
					sumMinusG++;
				}
			});
		$("table").find(".name").each(function() {
				if ($(this).html() == "") {
					count++;
				}
			});
		$("table").find(".del").each(function() {
				if ($(this).find(".name").html() == "") {
					countG++;
				}
			});
		count = sum - sumG + (sumMinus - sumMinusG) - (count - countG);
		sum = sum - sumG;
		let str = "";
		str += "<span>" + "<strong>" + count + "</strong>" + "/" + sum + "pages" + "</>" + "<em>" + "(" + parseInt((count / sum) * 100) + "%" + ")" + "</em>";
		
		$(this).find("> span").html(str);
	});
}

function scrollEvent(){
	$('.top').on('click',function(){
		$('html').animate({scrollTop:0}, 300);
		console.log('화면 맨위로');
	});
}	

function currentActive() {
	$('table tr a').on('click', function () {
		$('table tr').removeClass('focus')
		$(this).closest('tr').addClass('focus');
	});
}	

function matchMenu() {
	$("table.display.compact").each(function (i) {
		var _this = $(this);
		$(this).on({
			'mouseenter focusin': function () {
				var targetName = _this.find('caption').text();
				// console.log(targetName);
				$('.gnb').find('span').each(function () { 
					if ($(this).text() == targetName) { 
						$('.gnb').find('span').removeClass('on');
						$(this).addClass('on')
					}					
				})
				return false;
			}
			, 'mouseleave focusout': function () {
				var targetName = _this.find('caption').text();
				$('.gnb').find('span').removeClass('on');
			}
		});
	});
}

//pubImages
function imageList() {
	let target = $('.cmImages li');
	target.each(function () { 
		let href = $(this).find('a').attr('href');
		let file = href.split('/').reverse()[0];
		$(this).find('.img img').attr('src', href);
		$(this).find('a').append(file);
		$(this).find('.img').on({
			mouseenter: function () { 
				$(this).find('img').attr('title', href )
			}
		})
	})
}

// function menuSwiper(){
// 	var swiper = new Swiper('.gnb', {
// 		slidesPerView: "auto",
// 		centeredSlides: true,
// 		pagination: {
// 			el: ".mainSwiperPage",
// 			type: "progressbar",
// 		},
// 		scrollbar: {
// 			el: ".mainAccSwiper .swiper-scrollbar",
// 		},
// 	});
// }