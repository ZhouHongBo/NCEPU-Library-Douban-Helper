/* 接收查询url并返回查询结果 */
chrome.runtime.onConnect.addListener((port) => {
    if (port.name == "port") {
        port.onMessage.addListener((data, port) => {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", data.url);
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let collectionInfo = parseInfo(xhr.response); // 书籍馆藏信息
                    port.postMessage({ message: collectionInfo }); // 发送给content.js
                }
            }
        });
    }
});

// 书籍馆藏信息对象
function Collection(bookName, authorName, press, time, totalNum, validNum, bookUrl) {
    this.bookName = bookName;
    this.authorName = authorName;
    this.press = press; // 出版社
    this.time = time; // 出版时间
    this.totalNum = totalNum; // 馆藏副本
    this.validNum = validNum; // 可借副本
    this.bookUrl = bookUrl; // 书籍详情页的链接
}

// 从查询页面提取需要的书籍馆藏信息
function parseInfo(content) {
    let collections = [];
    let bookListInfo = $(content).find(".book_list_info"); // 书籍列表

    for (let i = 0; i < bookListInfo.length; i++) {
        let arr = $(bookListInfo[i]).find("p")[0].innerText.trim().split(/\s+/);

        let bookName = $(bookListInfo[i]).find("h3 a")[0].innerText;
        let totalNum = arr[0];
        let validNum = arr[1];
        let authorName = arr[2];
        let press = arr[3];
        let time = arr[4];
        let bookUrl = "http://opac.ncepu.edu.cn:8080/opac/" +
            $(bookListInfo[i]).find("p a")[0].attributes.href.nodeValue;

        let collection = new Collection(bookName, authorName, press, time, totalNum, validNum, bookUrl);
        collections.push(collection);
    }
    return collections;
}