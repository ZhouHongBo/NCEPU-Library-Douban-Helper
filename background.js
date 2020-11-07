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
        let infoStr = bookListInfo[i].innerHTML;

        let bookName = infoStr.match(/(\d\..+)<\/a>/)[1].trim();
        let authorName = infoStr.match(/<\/span>(.+)<br>/)[1].trim();
        let press = infoStr.match(/\n(.+)&nbsp/)[1].trim();
        let time = infoStr.match(/;(.+)<br>/)[1].trim();
        let totalNum = infoStr.match(/<span>(.+)<br>/)[1].trim();
        let validNum = infoStr.match(/(可借复本.+)<\/span>/)[1].trim();
        let bookUrl = "http://opac.ncepu.edu.cn:8080/opac/" + infoStr.match(/"(item.+)"/)[1].trim();

        let collection = new Collection(bookName, authorName, press, time, totalNum, validNum, bookUrl);
        collections.push(collection);
    }
    return collections;
}