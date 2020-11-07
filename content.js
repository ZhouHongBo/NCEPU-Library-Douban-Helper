$(document).ready(function () {
    let bookName = $("h1>span").text().split("(")[0].split("（")[0]; // 获取书名并去除括号

    if (bookName) {
        let bookSearchUrl = "http://opac.ncepu.edu.cn:8080/opac/openlink.php?title=" + bookName; // 图书馆检索页网址
        let port = chrome.runtime.connect({ name: "douban" }); // 与background.js建立连接
        port.postMessage({ url: bookSearchUrl }); // 发送url到图书馆检索页

        // 获得馆藏信息后插入豆瓣页面
        port.onMessage.addListener((data) => {
            insertToDouban(data.message);
        });
    } else {
        let isbn = $(".booklist dd:eq(2)").text().split("/")[0].split("-").join(""); // 图书的ISBN编号
        let bookSearchUrl = "https://api.douban.com/v2/book/isbn/" + isbn + "?apikey=054022eaeae0b00e0fc068c0c0a2102a"; // 豆瓣api
        let port = chrome.runtime.connect({ name: "library" }); // 与background.js建立连接
        port.postMessage({ url: bookSearchUrl }); // 发送url到图书馆检索页

        port.onMessage.addListener((data) => {
            let bookInfo = JSON.parse(data.message);
            insertToLibrary(bookInfo);
        });
    }
});

// 向豆瓣添加馆藏信息
function insertToDouban(collectionInfo) {
    $(".gray_ad:first").before('<div class="gray_ad" id="helper"></div>'); // 插入div
    $("#helper").append('<h2>华电图书馆豆瓣助手</h2><ul></ul>');
    if (collectionInfo.length === 0) {
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

// 向图书馆网站的图书页面添加图片和豆瓣评分信息
function insertToLibrary(bookInfo) {
    let imgSrc = bookInfo.images.large; // 图书地址
    let rating = bookInfo.rating.average; // 豆瓣评分
    let numRaters = bookInfo.rating.numRaters; // 评分人数
    $("#book_img").attr("src", imgSrc);
    $("#book_pic").append(`<p>豆瓣评分${rating}</p>`);
    $("#book_pic").append(`<p>${numRaters}人评价</p>`);
}