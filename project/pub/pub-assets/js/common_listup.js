$(document).ready(function() {
  $("tr")
    .not(":first")
    .hover(
      function() {
        $(this).css({
          background: "#eee"
        });
      },
      function() {
        $(this).css({
          background: ""
        });
      }
    );

  //table rowspan
  var trLength = $("tr").length;
  $(".rowLength").attr("rowspan", trLength);

  $(".url").each(function() {
    var link = $(this).text(),
      str = "";
    if (link != null && link != "") {
      str += '<a href="' + "../" + link + '" target="_blank">' + link + "</a>";
      $(this)
        .empty()
        .html(str);
    }
  });
  $(".url a").click(function() {
    var $active = $(this);
    $("a").removeAttr("style");
    $active.css({
      "font-weight": "bold",
      "text-decoration": "underline",
      color: "#c00000"
    });
  });
  $(".total").each(function() {
    var sum = 0;
    var sumG = 0;
    var sumMinus = 0;
    var sumMinusG = 0;
    var count = 0;
    var countG = 0;
    $("table")
      .find(".url")
      .each(function() {
        if ($(this).html() != "") {
          sum++;
        } else {
          sumMinus++;
        }
      });
    $("table")
      .find(".del .url")
      .each(function() {
        if ($(this).html() != "") {
          sumG++;
        } else {
          sumMinusG++;
        }
      });
    $("table")
      .find(".name")
      .each(function() {
        if (
          $(this)
            .find("span")
            .html() == ""
        ) {
          count++;
        }
      });
    $("table")
      .find(".del")
      .each(function() {
        if (
          $(this)
            .find(".name span")
            .html() == ""
        ) {
          countG++;
        }
      });
    count = sum - sumG + (sumMinus - sumMinusG) - (count - countG);
    sum = sum - sumG;
    str = "";
    str +=
      "<span>" + "<strong>" + count + "</strong>" + "/" + sum + "pages" + "</>" + "<em>" + "(진행률 " + parseInt((count / sum) * 100) + "%" + ")" + "</em>";
    $(this)
      .find("> span")
      .html(str);
  });
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
  var today = year + "-" + month + "-" + date;
  //console.log(today);
  $(".date").each(function() {
    var $date = $("> span", this);
    if ($date.length > 1) {
      str = "";
      str += "<strong>" + $date.filter(":last").text() + "</strong>";
      $date.filter(":not(:last)").each(function() {
        str += '<a data-date="' + $(this).text() + '">○</a>';
      });
      $date.filter(":last").each(function() {
        if ($(this).text() === today) {
          str +=
            '<a data-date="' + $(this).text() + "\" style='color:red'>●</a>";
        } else {
          str += '<a data-date="' + $(this).text() + '">●</a>';
        }
      });
      if ($date.filter(":first").text() != "") {
        $(this)
          .empty()
          .html(str);
      }
      var chkDay = $date
        .filter(":last")
        .text()
        .split(" ");
      var chkDay2 = chkDay[0].split("-");
    }
  });
  $("body").on("mouseenter", ".date a", function() {
    $(this)
      .parent()
      .find("strong")
      .text($(this).attr("data-date"));
  });
  $("body").on("mouseleave", ".date a", function() {
    $(this)
      .parent()
      .find("strong")
      .text(
        $(this)
          .parent()
          .find("a:last")
          .attr("data-date")
      );
  });

  /**************************
        필터시작
    */
  // 번호 자동생성, 링크 자동생성
  var $workTbody = $(".working-list tbody"),
    itemlist = $workTbody.find('tr:not(".linetitle")'),
    del = $workTbody.find(".del"),
    $tds = $workTbody.find("td"),
    arrayItem = $.makeArray(itemlist),
    $lineTitle = $workTbody.find(".linetitle td"),
    i = 0;

  // 테이블내의 서브타이틀 영역의 colspan 정의
  var totalcolspan = $("table thead th").length;
  $lineTitle.attr("colspan", totalcolspan);

  // 진척률 생성
  var $complete = itemlist.find("td:last-child"), // 행마다 마지막 td
    groupTotal = $complete.length - del.length,
    delCnt = del.find(".complete").length,
    comTotal = $complete.find(".complete").length - delCnt;

  var groupProgress = (comTotal / groupTotal) * 100;

  // $('.total').html(
  //     '<span class="per">종합 진척률 : ' +
  //     ~~groupProgress +
  //     '%</span>' +
  //     '<span class="status">' +
  //     comTotal +
  //     '/' +
  //     groupTotal +
  //     ' (완료 / 총 본수)</span>'
  // );

  for (; i < arrayItem.length; i++) {
    var item = arrayItem[i]; // 각각 tr 참조
    // $(item).prepend("<td></td>"); // 첫번째 td 생성(number 영역)

    // 파일 디렉토리 영역의 링크 생성
    var $cols = $(item).children("td");
    var $col00 = $cols.eq(0),
      $col01 = $cols.eq(1),
      $col02 = $cols.eq(2),
      $col03 = $cols.eq(3),
      $col04 = $cols.eq(4),
      $col05 = $cols.eq(5),
      $col06 = $cols.eq(6),
      $col07 = $cols.eq(7),
      $col08 = $cols.eq(8),
      $col09 = $cols.eq(9),
      $col10 = $cols.eq(10),
      $col11 = $cols.eq(11);

    // var link = $cols.eq(5);
    // if ($(item).is('.del')) {
    //     $col05.html('<span class="link">' + link.html() + '</span>');
    // } else {
    //     $col05.html('<a href="' + link.html() + '" target="_blank" class="link">' + '<b style="color:#437cbc;">' + link.html() + '</b></a>');
    // }

    // var depthStr = $col00.text(),
    //     depthEm = depthStr.substr(depthStr.lastIndexOf('>') + 1);

    // $col00.html(depthStr.replace(depthEm, '<b style="color:#4b4b4b;">' + depthEm + '</b>'));

    $col06.addClass("year ac");
    $col07.addClass("ac");
    $col08.addClass("date ac");
    $col09.addClass("name ac");
  }

  // 검수요청,완료 여부에 따른 클래스 부여 및 상태란의 텍스트 생성
  // itemlist.each(function () {
  //     var $this = $(this),
  //         tdStr = $this.find('td').eq(1).text(),
  //         newStr = tdStr.substr(tdStr.lastIndexOf('>') + 1),
  //         $tds = $this.find('td');

  //     var state = $this.find('td:last-child');
  //     state.find('.undecided').text('미');
  //     state.find('.delete').text('삭');
  //     state.find('.edit').text('중');
  //     state.find('.complete').text('완');

  //     var $inq = $this.find('td').eq(5),
  //         inqText = $inq.text();

  //     if (inqText.indexOf('검수요청') > -1) {
  //         $inq.addClass('quest');
  //     } else if (inqText.indexOf('검수완료') > -1) {
  //         $this.addClass('comp');
  //     }

  // });

  var $ths = $(".working-list thead th");
  // $ths.eq(0).append(' (' + groupTotal + ')');
  // $ths.eq(6).append(' (' + comTotal + ')');
});

(function($) {
  function update() {
    var text, tr, select, visibleTr;

    visibleTr = $("tbody tr:visible");
    tr = $('tbody tr:not(".linetitle")');
    select = $("select");
    text = [];

    // 셀렉트 값이 변경될 때마다 배열 text 에 참조
    select.each(function() {
      text.push(
        $.trim(
          $(this)
            .find("option:selected")
            .text()
        )
      );
    });
    console.log(text);

    // jQuery.inArray : 배열 내의 값을 찾아서 인덱스를 반환합니다.(요소가 없을 경우 -1을 반환)
    // 담당자 전체, 전체인 경우에 모든 table row 를 보여줌
    if ($.inArray("년도전체", text) > -1 && $.inArray("날짜전체", text) > -1) {
      tr.show();
    }
    // year 문자열이 아닌 이름을 선택하고 date 전체인 경우
    else if (
      $.inArray("년도전체", text) == -1 &&
      $.inArray("날짜전체", text) > -1
    ) {
      tr.each(function() {
        var $this = $(this);
        // console.log("this : " + $this);
        // console.log("[0]" + text[0]);
        // console.log("text" + $this.find(".year").text());
        if (text[0] == $this.find(".year").text()) {
          $this.show();
        } else {
          $this.hide();
        }
      });
    }
    // year이고 전체가 아닌 날짜를 선택한 경우
    else if (
      $.inArray("년도전체", text) > -1 &&
      $.inArray("날짜전체", text) == -1
    ) {
      tr.each(function() {
        var $this = $(this);
        // console.log('0' + text[1]);
        // console.log('t' + $this.find('.date > strong').text());
        if (text[1] == $this.find(".date  > strong").text()) {
          $this.show();
        } else {
          $this.hide();
        }
      });
    } else if (
      $.inArray("년도전체", text) == -1 &&
      $.inArray("날짜전체", text) == -1
    ) {
      tr.each(function() {
        var $this = $(this);
        if (
          text[0] == $this.find(".year  > strong").text() &&
          text[1] == $this.find(".date  > strong").text()
        ) {
          $this.show();
        } else {
          $this.hide();
        }
      });
    }
  }

  $(document).on("change", "select", update);

  // 날짜 컬럼을 셀렉트 박스에 차례대로 생성
  function sortDate(idx, el) {
    var worklist = $(".working-list"),
      dateBox = $("thead th").eq(idx),
      dateData = [],
      dateList = worklist.find(el + ":visible");

    dateList.each(function() {
      var $this = $(this);

      if (!!$.trim($(this).text())) {
        // 배열길이가 0 이면 날짜 컬럼 텍스트의 처음 문자열을 배열에 추가
        if (dateData.length == 0) {
          dateData.push($.trim($this.text()));
          return;
        }
        // 배열에 해당 날짜 문자열이 없다면 dateDate 배열에 추가
        if ($.inArray($.trim($this.text()), dateData) == -1) {
          dateData.push($.trim($this.text()));
        }
      }
    });

    var dateSort = dateData.sort(compareForSort);

    dateSort.reverse(); //option정렬

    function compareForSort(first, second) {
        if (first == second) {
            return 0;
        }
        if (first < second) {
            return -1;
        } else {
            return 1;
        }
    }

    // 배열에 저장된 날짜 모음을 셀렉트박스에 추가
    for (var i = 0, max = dateSort.length; i < max; i++) {
      dateBox.find("select").append("<option>" + dateSort[i] + "</option>");
    }
  }

  // number 컬럼에 넘버 증가 및 서브타이틀의 총 갯수 정의
  // function countLine() {
  //     var count = 0,
  //         linetitle = $('.linetitle'),
  //         titleLength = linetitle.length,
  //         title,
  //         tr = $('tbody tr'),
  //         length = tr.length;

  //     linetitle.each(function (index) {
  //         $(this).data('idx', index);
  //     });

  //     tr.each(function (idx) {
  //         var $this = $(this);

  //         if ($this.hasClass('linetitle')) {
  //             // 최초 linetitle 은 count 가 증가하기 전이므로 - 1 하여 요소를 선택하지 않는다.
  //             title = linetitle[$this.data('idx') - 1];

  //             // count 를 증가시킨후 linetitle 을 검색하도록 한다.
  //             if (!!title) {
  //                 $(title).find('td .sub-tit').append(' (' + count + ')');
  //                 // linetitle 이 있다면 count 를 0 으로 초기화
  //                 count = 0;
  //             }
  //         } else {
  //             $this.find('td:first-child').append(count + 1);
  //             // del 클래스가 있으면 변수 count 를 증가시키지 않고 아니면 증가시킨다.
  //             count = $this.hasClass('del') ? count : count + 1;
  //         }

  //         // each 문이 모두 돌았을 때 즉, 마지막 .linetitle 의 count 를 참조
  //         if (idx == length - 1) {
  //             title = linetitle[titleLength - 1];
  //             if (!!title) {
  //                 $(title).find('td .sub-tit').append(' (' + count + ')');
  //             }
  //         }

  //     })

  // }

  // function sortCount() {
  //     var count = 0,
  //         tr = $('tbody tr:not(".del")');

  //     tr.each(function () {
  //         var $this = $(this);
  //         if (!$this.hasClass('linetitle') && $this.is(':visible')) {
  //             count = count + 1;
  //         }
  //     });

  //     return count;

  // }

  function lastYearView() {
    var text, tr, select, visibleTr;

    visibleTr = $("tbody tr:visible");
    tr = $('tbody tr:not(".linetitle")');
    select = $("select");
    option = select.find("option");
    text = [];

    tr.each(function() {
      var $this = $(this);
      if ($this.find(".year").text() == '2020고도화') {
        $this.show();
      } else {
        $this.hide();
      } 
    });
    option.each(function(){
      var $obj = $(this);
      if($obj.text() == '2020고도화'){
        $obj.prop("selected", true);
      }
    });
  }

  $(function() {
    var selectext = [];
    sortDate(6, ".year");
    sortDate(8, ".date > strong");
    
    $("select option").each(function() {
      selectext.push(
        $(this).text()
      );
    });

    if ($.inArray("2020고도화", selectext) > -1){
      lastYearView();
      console.log('lastYearView');
    }

    var $ribbon = $("#header .ribbon");
    $ribbon.on("click", function() {
      var $this = $(this),
        cloneEl = $this.clone(true);

      $this.before(cloneEl);
      $("." + $this.attr("class") + ":last").remove();
    });
  });
})(jQuery);
