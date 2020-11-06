    /*------------------从豆瓣获取标题生成检索url-------------------*/
$(document).ready(function() {
    var bookName = $('h1>span').text();
   // console.log(bookName);
    //获取书名。
    var bookSearchUrl = "http://opac.ncepu.edu.cn:8080/opac/openlink.php?strSearchType=title&match_flag=forward&historyCount=0&strText=" + bookName;
    //图书馆检索页网址。
    //console.log(bookSearchUrl);
    var port = chrome.runtime.connect({name: "port"});
    port.postMessage({message: bookSearchUrl});

    /*--------------------发送url到图书馆检索页请求----------------*/

    port.onMessage.addListener(onMessageRecieved);

    function onMessageRecieved(data) {
        insert(data.message);
        //console.log(data.message);
    }

    /*--------------------向豆瓣添加检索信息----------------------*/

    function insert(addContent)
        {

        $('#buyinfo').before('<div class="gray_ad" id="xatulibhelper"></div>');
        $('#xatulibhelper').append('<h2>华电图书馆豆瓣助手</h2><div class="bs" id="isex"></div>');
        $('#isex').after('<h2>有没有？</h2><div class="bs" id="have？"></div>');
        if (addContent.indexOf("本馆没有您要检索的图书")!= -1)
        {
            $('#have？').html('没有:(');
            $('#have？').append('&nbsp&nbsp<a href="http://opac.ncepu.edu.cn:8080/asord/asord_redr.php" target="_blank">点击荐购</a>');
        }
        else {
            $('#have？').html('有:)');
            $('#have？').after('<div class="bs" id="Details">');
            $("#Details").append('<br><h2>具体点？</h2>');
            $(addContent).find('.book_list_info').appendTo('#Details');
            $(".book_list_info img").remove();
            $(".tooltip").remove();
            $(".book_list_info").css("list-style", "none");
            $(".book_list_info h3").css("margin-left", "0px");
            $(".book_list_info h3>span").remove();
            $('.book_list_info h3').text(function () {
                return $(this).text().trim()
            })
            $(".book_list_info h3").css("color", "#3377AA");
            $(".book_list_info p").contents()
                .filter((_, n) => n.nodeType === 3)
        .remove();
            /*-------------------提取检索码字母--------------------------*/
            var searchNum = $(".book_list_info h3:first").text();
            //console.log(searchNum);
            var arr = searchNum.split("     ");
            var Num = arr[1];
            //console.log(arr[1]);
            var where = Num.replace(/[^A-Z]+/ig, "");
            //console.log(where);
            /*----------------对应科室信息----------------------------*/
            var sheke1 = new Array('G','K','J');
            var sheke2 = new Array('A','B','C','D','E');
            var sheke3 = new Array('F');
            var keji1 = new Array('TB','TD','TE','TF','TG','TH','TJ','TK','TL','TQ','TS');
            var keji2 = new Array( 'TM','TN','TU','TV');
            var keji3 = new Array('N','O','P','Q','R','X','U','V','X','Y','Z');
            var wenxue = new Array('I');
            var wenzi = new Array('H');
            if (jQuery.inArray(where,sheke1)!== -1)
                 {
                     place = "203&nbsp&nbsp社科一";
                 }
                    else if (jQuery.inArray(where,sheke2)!== -1)
                    {
                        place = "204&nbsp&nbsp社科二";
                    }
                        else if(jQuery.inArray(where,sheke3)!== -1)
                        {
                            place = "211&nbsp&nbsp社科三";
                         }
                            else if(jQuery.inArray(where,keji1)!== -1)
                            {
                                 place = "303&nbsp&nbsp科技一";
                            }
                                 else if(jQuery.inArray(where,keji2)!==-1)
                                    {
                                         place = "304&nbsp&nbsp科技二";
                                    }
                                        else if(jQuery.inArray(where,keji3)!==-1)
                                        {
                                            place ="313&nbsp&nbsp科技三";
                                        }
                                            else if(jQuery.inArray(where,wenxue)!==-1)
                                            {
                                                place ="314&nbsp&nbsp文学";
                                            }
                                                else if (jQuery.inArray(where,wenzi)!==-1)
                                                {
                                                    place = "404&nbsp&nbsp语言、文字";
                                                }
                                                else
                                                {
                                                    place = "508&nbsp&nbsp自动化、计算机";
                                                }


            $('#Details').after('<div class="bs" id="place">');
            $("#Details").append('<br><h2>在哪儿？</h2>');
            $("#place").html( place );
        }
}});