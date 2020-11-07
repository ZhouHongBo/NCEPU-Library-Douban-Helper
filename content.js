/* 从豆瓣获取标题生成检索url */
$(document).ready(function () {
    var bookName = $("h1>span").text(); // 获取书名
    var bookSearchUrl = "http://opac.ncepu.edu.cn:8080/opac/openlink.php?title=" + bookName; // 图书馆检索页网址
    var port = chrome.runtime.connect({ name: "port" }); // 与background.js建立连接
    port.postMessage({ url: bookSearchUrl }); // 发送url到图书馆检索页

    // 获得馆藏信息后插入豆瓣页面
    port.onMessage.addListener((data) => {
        insert(data.message);
    });
});

// 向豆瓣添加馆藏信息
function insert(collectionInfo) {
    $("#buyinfo").before('<div class="gray_ad" id="helper"></div>'); // 插入div
    $("#helper").append('<h2>华电图书馆豆瓣助手</h2><ul></ul>');
    if (collectionInfo.length === 0){
        $("#helper").append("<span>无馆藏信息</span>");
    } else {
        for (let i = 0; i < collectionInfo.length; i++) {
            $("#helper ul").append(`<li>
            <a target="_blank" href="${collectionInfo[i].bookUrl}">${collectionInfo[i].bookName}</a>
            <br>
            <span>${collectionInfo[i].authorName}</span>
            <br>
            <span>${collectionInfo[i].press}</span>
            <span>${collectionInfo[i].time}</span>
            <br>
            <span>${collectionInfo[i].totalNum}</span>
            <span>${collectionInfo[i].validNum}</span>
        </li>`);
        }
    }
}