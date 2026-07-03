"use strict";
/* [SEPTEM] UI Dev Team :: 셉템 접근성 가이드용 js */

$(function() {
	htmlAdd();

	var pageUrl = window.location.href; //창의 url을 가져온다.
	var splitUrl = pageUrl.split('/');
	var nameFile = splitUrl[splitUrl.length - 1]; 
	console.log(nameFile);

	$('nav ol li a').each(function (index, item) {
		var url = $(this).data('url');
		if( nameFile == url ){
			$(this).addClass('active');
		}		
   	});	
});

function htmlAdd(){
	$('header').html(
		'<div class="inner">Septem Accessibility Guide</div>'
	);
	$('footer').html(
		'<div class="inner">ⓒSeptem Corp. UI/UX Dev Team.</div>'
	);
	$('nav').html(
		'<ol>'
		+'<li>'
			+'<h4>접근성 개요</h4>'
			+'<ol>'
			+'<li><a href="../html/index.html" data-url="index.html">접근성이란?</a>'
			+'<li><a href="../html/semantic.html" data-url="semantic.html">의미론적 HTML</a></li>'
			// +'<li><a href="../html/html.html">올바른 HTML</a></li>'
			+'</ol>'
		+'</li>'
		+'<li>'
			+'<h4>MA</h4>'
			+'<ol>'
			+'<li><a href="../html/ma0.html" data-url="ma0.html">모바일앱 접근성(MA)?</a>'
			+'<li><a href="../html/ma1.html" data-url="ma1.html">1. 인식의 용의성</a></li>'
			+'<li><a href="../html/ma2.html" data-url="ma2.html">2. 운용의 용의성</a>'
			+'<li><a href="../html/ma3.html" data-url="ma3.html">3. 이해의 용의성</a></li>'
			+'<li><a href="../html/ma4.html" data-url="ma4.html">4. 견고성</a>'
			+'<li><a href="../html/ma5.html" data-url="ma5.html">5. 주요사용법</a>'
			+'</ol>'
		+'</li>'
		+'<li>'
			+'<h4>WA</h4>'
			+'<ol>'
			+'<li><a href="../html/wa0.html" data-url="wa0.html">웹 접근성(WA)?</a>'
			+'<li><a href="../html/wa1.html" data-url="wa1.html">1. 인식의 용의성</a></li>'
			+'<li><a href="../html/wa2.html" data-url="wa2.html">2. 운용의 용의성</a>'
			+'<li><a href="../html/wa3.html" data-url="wa3.html">3. 이해의 용의성</a></li>'
			+'<li><a href="../html/wa4.html" data-url="wa4.html">4. 견고성</a>'
			+'<li><a href="../html/wa5.html" data-url="wa5.html">5. 주요사용법</a>'
			+'</ol>'
		+'</li>'
		+'<li>'
			+'<h4>참고사이트</h4>'
			+'<ol>'
			+'<li><a href="https://www.w3.org/WAI/fundamentals/accessibility-principles/ko" target="_blank">W3C 접근성 원칙&#xE001;</a></li>'
			+'<li><a href="https://developers.google.com/web/fundamentals/accessibility" target="_blank">구글 개발자 접근성&#xE001;</a>'
			+'<li><a href="https://developer.mozilla.org/ko/docs/Learn/Accessibility/What_is_accessibilityl" target="_blank">모질라 접근성&#xE001;</a>'
			+'<li><a href="https://accessibility.naver.com/accessibility" target="_blank">네이버접근성&#xE001;</a>'
			+'<li><a href="https://nuli.navercorp.com/education" target="_blank">네이버 널리 접근성 교육&#xE001;</a></li>'
			+'</ol>'
		+'</li>'
		+'</ol>'
	);
	console.log('aaa');
}