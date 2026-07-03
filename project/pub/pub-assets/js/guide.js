/*
 * 퍼블확인용 js 실제 서비스에서는 제외 
 */

/* 퍼블스크립트 에러(확인용) */
var popOpenRun = function(){ //popup.js에서 실행됨

	$("input:not([readonly],[type='checkbox'],[type='radio'],[type='image'],[type='submit'],[type='button'])").each(function(i){
		if($(this).val()!==''){
			$(this).siblings('.btnReset').show();
		}else{
			$(this).siblings('.btnReset').hide();
		}
	});

	addrSelectFnc(); //타일스타일 라디오 접근성

	if($('.selectList').length > 0){
		$(".nhasset.popWrap .selectList li.active").find("a").attr("title", "선택됨");		
	}
	
	// up,down 버튼 효과
	$('.btnUp, .btnDown').click(function(){
		$li = $(this).closest('li')
		$(this).parents('ul > li').css('background','');
		$li.css('background','#f3faf6');
		setTimeout(function(){
			$li.css('background','');
		},800)
	})

	categorySwipe();
	categoryPosition();
	//cssGoLive()
	
	
	// IOS 팝업 스크롤 이상현상 관련 처리
	if(($('.nhasset.popWrap:visible').length > 0)) {  //퍼블확인용
		console.log('0000')
	//if(($(".nhasset.popWrap > .popInner").length > 0) && (OF.exeStatus == 5)) {
		$(".roundBtnWrap a").on('tap', function() {
			$(this).parent().parent().find('input').blur(); 
		});
	
		$(".btnReset").on('tap', function() {
			$(this).siblings('input').blur();
		});
	
		$(document).on('blur', 'input', function() {
			window.scrollTo(0, NaN); 
			console.log('dddd')
		});
	}
	// IOS 팝업 스크롤 이상현상 관련 처리 END
	
}
/* //퍼블스크립트 에러(확인용) */

function cssGoLive(){
	$('#changeCom').attr('href','../../css2/nhasset_com.css')
	$('#changeCont').attr('href','../../css2/nhasset_cont.css')
}

/* 퍼블 작업 가이드 메뉴 : 2023 고도화 */
const ioGuideView = new IntersectionObserver((entries, observer) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			uiGuideSetMenu($(entry.target)[0].id)
		}
	})
},{
	rootMargin: '-50% 0px -50% 0px',
});
function uiGuideSetMenu(el){
	var _btns = $('.guide_menu a');
	var _target = $('.guide_menu a[href="#'+ el +'"]');
	_btns.removeClass('active');
	_target.addClass('active');
}

$(document).ready(function(){
	//스뱅, 올뱅 확인용 버튼
	var $wrap_sw = $('.wrap_guide').length;
	var $sw_text = $('<div class="guide_button"><a href="#none" class="btn_sw01">스마트개인</a><a href="#none" class="btn_sw02">올원</a></div>')
	if($wrap_sw == 0){
		$('.wrapper').after($sw_text);
	}

	$('.btn_sw02').click(function(){
		$('body').addClass('nhd_allone');
	});
	$('.btn_sw01').click(function(){
		$('body').removeClass('nhd_allone');
	});

	//폰확인용 버튼
	// var $pubUtile = ''
	// 	+'<div class="pubUtileWrap">'
	// 	+'<div class="pubToggleWrap">'
	// 	+'<button type="button" class="btnToggle"><span class="blind">열/닫</span></button>'
	// 	+'</div>'
	// 	+'<ul>'
	// 	+'<li><button type="button" class="btnPubBack" onClick="javascript:history.back()">뒤로</button></li>'
	// 	+'<li><button type="button" class="btnPubReload" onClick="javascript:location.reload(true)">새로고침</button></li>'
	// 	+'<li><button type="button" class="btnPubFontBig" >글자크게</button></li>'
	// 	+'<li><button type="button" class="btnPubFontNormal" >글자작게</button></li>'
	// 	+'</ul>'
	// 	+'</div>'
	// ;

	// $('body').append($pubUtile)
	$('.pubToggleWrap .btnToggle').click(function(){
		var $this = $(this);
		$this.closest('.pubUtileWrap').toggleClass('active')
	});
	$('.pubUtileWrap .btnPubFontBig').click(function(){
		$('html').addClass('fontBig')
	});
	$('.pubUtileWrap .btnPubFontNormal').click(function(){
		$('html').removeClass('fontBig')
	});
	


	//전체메뉴 열기
	/*$('body').append('<div class="allMenuWrap"> <div class="allMenuHeader"> <a href="javascript:;"><span class="blind">메뉴닫기</span></a> </div> <div class="allMenuCont"> <div class="depth"><strong>NH마이데이터</strong></div> <ul class="allMenuList"> <li><a href="../ps/MS-UI-PS-3020.html">메인</a></li> <li><a href="../dl/MS-UI-DL-1010.html">금융플래너</a></li> <li><a href="../ya/MS-UI-YA-1010.html">연말정산컨설팅</a></li> <li><a href="../mc/MS-UI-MC-1010.html">내차관리</a></li> <li><a href="../gs/MS-UI-GS-1010.html">맞춤정부혜택</a></li> <li><a href="#none" class="pointColor">마이데이터센터</a> <ul class="allMunuDep2"> <li><a href="../ps/MS-UI-PS-2020.html">자산연결관리</a></li> <li><a href="../ps/MS-UI-PS-2060.html">데이터전송관리</a></li> <li><a href="../ps/MS-UI-PS-2070.html">약관/가입관리</a></li> <li><a href="../ps/MS-UI-PS-2080.html">이벤트</a></li> <li><a href="../ps/MS-UI-PS-2090.html">공지사항</a></li> </ul> </li> </ul> </div> </div>'); $('.btnNav').click(function(){
		$('body').addClass('hasMenu');
		$('.allMenuWrap').show();
	});
	$('.allMenuHeader a').click(function(){
		$('body').removeClass('hasMenu');
		$('.allMenuWrap').hide();
	});*/

	/*$('.bankLogo img').each(function(){
		var $this = $(this).attr('src').split('/');
		var $thisLangth = $this[$this.length-1];
		//console.log($thisLangth.length)
		if ($thisLangth.length == 14) {
			var $refilename = $thisLangth.substring(2,10);
			$(this).attr('src','../../../ms_com/images/logos/' + $refilename + '.png')
		}
	});*/

	// $('.wrapper').addClass('nhasset');
	// $('.container').removeClass('dfs');

	//[2023 고도화] 가이드 메뉴
	if($('[id^="GCONTENT"]').length){
		$('section[id^="GCONTENT"]').each(function(i, obj){
			ioGuideView.observe(obj);
		});
		$(document).off('click.gmenu').on('click.gmenu','.guide_menu a',function(){
			var _CONTOP = $($(this).attr('href')).offset().top;
			$(window).scrollTop(_CONTOP - 100)
			return false;
		});
	}
});

/*document.addEventListener('DOMContentLoaded',function(){
	$('.btn_folding').each(function(){
		var $labelLength = $(this).parents('.titWrap').find('.assetSubject strong').length || $(this).parents('.titWrap').find('.planType').length;
		var $labelText = $(this).parents('.titWrap').find('.assetSubject strong').text() || $(this).parents('.titWrap').find('.planType').text();
		if ($labelLength > 0) {
			$(this).attr('title',$labelText)
		}
	});
});*/

/*function accb(){
	$('.btn_folding').each(function(){
		var $labelLength = $(this).parents('.titWrap').find('.assetSubject strong').length || $(this).parents('.titWrap').find('.planType').length;
		var $labelText = $(this).parents('.titWrap').find('.assetSubject strong').text() || $(this).parents('.titWrap').find('.planType').text();
		if ($labelLength > 0) {
			$(this).attr('title',$labelText)
		}
	});
}*/