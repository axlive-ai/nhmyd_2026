$(function(){
    var ua = navigator.userAgent;
    var agent = ua.toLowerCase();
    if((/Android/i).test(ua)) {
        $('html').addClass('Android').data('browser', 'Android');
        var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8)); 
        // console.log(androidversion);
        if (androidversion >= 5)
        {   
            console.log('greater than or equal to Android5');
        } else {
            console.log('less than Android5')
            //nhComUi.mobile.toast('less than Android5');
        }
    } else if((/iPad|iPhone|iPod/i).test(ua)) {
        $('html').addClass('iOS').data('browser', 'iOS');
    } else if((/Chrome/i).test(ua)) {
        $('html').addClass('Chrome').data('browser', 'Chrome');
    }
    
    var agent = navigator.userAgent.toLowerCase(),
        name = navigator.appName,
        browser = '';
 
    // MS 계열 브라우저를 구분
    if(name === 'Microsoft Internet Explorer' || agent.indexOf('trident') > -1 || agent.indexOf('edge/') > -1) {
        browser = 'ie';
        if(name === 'Microsoft Internet Explorer') { // IE old version (IE 10 or Lower)
            agent = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agent);
            browser += parseInt(agent[1]);
        } else { // IE 11+
            if(agent.indexOf('trident') > -1) { // IE 11
                browser += 11;
            } else if(agent.indexOf('edge/') > -1) { // Edge
                browser = 'edge';
            }
        }
    } else if(agent.indexOf('safari') > -1) { // Chrome or Safari
        if(agent.indexOf('opr') > -1) { // Opera
            browser = 'opera';
        } else if(agent.indexOf('chrome') > -1) { // Chrome
            browser = 'chrome';
        } else { // Safari
            browser = 'safari';
        }
    } else if(agent.indexOf('firefox') > -1) { // Firefox
        browser = 'firefox';
    }
    $('html').addClass(browser);
});