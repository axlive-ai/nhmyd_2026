$(function(){		

	var tabM = $(".tabDep2 a");
	var tabCont = $(".tabCont > div");

	tabM.click(function(){
		var tabIdx = $(this).parent("li").index();
		tabCont.hide();
		$(".tabDep2 a").removeClass('active');
		$(this).addClass('active');
		tabCont.each(function () {		
			tabCont.eq(tabIdx).show();
		});
	})

	// $('.tabMenu > li > a').click(function(){
	// 	$('.tabMenu > li > a').removeClass('active');
	// 	$(this).addClass('active');
	// 	$('.tabMenu .tabDep2').hide();
	// 	$(this).next('.tabDep2').show();
	// })

	//navigation
	function navPath(i) {
		if (i != 0){
			var thisAct = $(".topMenu > .inr > ul > li").eq(i).find(">a");
		}else {
			var thisAct = $(".topMenu");
		}
		$(".topMenu > .inr > ul > li").mouseenter(function(){
			$(this).find(">a").addClass("active");
		})
		.mouseleave(function(){
			$(this).find(">a").removeClass("active");
			thisAct.addClass("active");
		});
		thisAct.addClass("active");
    }
    
    /* 20200520 오영주 추가*/
    function nav2Path(i){
        var target = $(".topMenu>.inr>ul>li ul:visible li").eq(i-1).find(">a");
        target.addClass("active");
    }

    if(dep1 != null){
        navPath(dep1);
    }
    if(dep2 != null){
        nav2Path(dep2);
        console.log(dep1, dep2);
	}

	$(".leftWrap > ul > li > a").click(function(){
		var leftDep2 = $(this).next("ul");		
		if(leftDep2.length > 0 && leftDep2.css('display') == 'block'){
			leftDep2.toggle();
			$(this).toggleClass('active');			
		}else {
			$(".leftWrap .dep2").hide();	
			leftDep2.show();
			$(".leftWrap > ul > li > a").removeClass('active');
			$(this).addClass("active");
			location.href = $(this).attr("href");
		}			
	})

	$(".leftWrap .dep2 a").click(function(){
		if($("this").closest(".dep2").css("display","block")){
			if(! $(this).hasClass("active")){
				$(".leftWrap .dep2 a").removeClass("active");
				$(this).addClass('active');			
			}else {
				
			}			
		}else {
			$(".leftWrap .dep2 a").removeClass("active");
		}
		
	})

	function leftPath(dep1,dep2,dep3) {
		if(dep1 != ''){
			if(dep2 != ''){
				var leftDep2 = $(".leftWrap > ul > li").eq(dep2-1).find(">a");
				leftDep2.addClass("active");
				if(dep3 != ''){					
					var leftDep3 = leftDep2.parent("li").children(".dep2").find("li").eq(dep3-1).find(">a");
					leftDep3.addClass("active");
				}
			}
		}
	}

	leftPath(dep1,dep2,dep3);

	//top 버튼
	$scrollTop = $(".btnTop");
	$(window).scroll( function() {
        if ( $(this).scrollTop() > 250 ) {
            $scrollTop.css("display","inline-block");
            $scrollTop.stop().animate({opacity:1});
        } else {
            $scrollTop.stop().animate({opacity:0},{
                duration: 300,
                specialEasing: {
                    height: "linear",
                    width: "easeOutBounce"
                }
            },300);
        }
	});
	$scrollTop.click(function(){
		$( 'html, body' ).animate( { scrollTop : 0 }, 150 );
        return false;
	})
	
	//셀렉트 옵션 새창열기
	function go_url(url){
		if(url != '')   window.open(url, '_blank');
	}

	//UI 샘플 iframe
	$("#container").ready(function(){	
		var menu = $(this).find(".leftWrap .dep2.iframeMenu li");
		var frame = $(this).find("#contFrame");

		menu.bind('click',function(e){
			if($(e.target).attr('tagName') != 'SPAN') frame.attr('src', $.trim($(this).find('a').attr('href')));
			return false;
		});
	
		function resizeIframe(){
			frame.load(function() {
				if ($.browser.safari || $.browser.opera) $(this).height(0);
				$(this).height($(this).contents().find('body')[0].scrollHeight - 300);
			});
		}
		resizeIframe();
		menu.eq(0).trigger('click');
	})
})


//상위 셀렉트로 하위 셀렉트 제어하기
function showSub(obj) {	
	f = document.forms.select_project;

	if(obj == 1) {	
		f.sub1.style.display = "";
		f.sub2.style.display = "none";

	} else {	
		f.sub1.style.display = "none";
		f.sub2.style.display = "";

	 }
}