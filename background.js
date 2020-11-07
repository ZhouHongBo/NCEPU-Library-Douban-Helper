/* 接收查询url并返回查询结果 */
chrome.runtime.onConnect.addListener((port) => {
    if (port.name == "port") {
        port.onMessage.addListener((data, port) => {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", data.url);
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let collectionInfo = parseInfo(xhr.response); // 馆藏信息
                    port.postMessage({ message: collectionInfo }); // 发送给content.js
                }
            }
        });
    }

    function Collection(bookName, authorName, totalNum, validNum, bookUrl) {
        this.bookName = bookName;
        this.authorName = authorName;
        this.totalNum = totalNum;
        this.validNum = validNum;
        this.bookUrl = bookUrl;
    }

    function parseInfo(content){
        let collections = [];
        let bookListInfo = $(content).find(".book_list_info"); // 书籍列表
        let bookUrlInfo = $(bookListInfo).find("p a"); // 书籍链接列表
        for (let i = 0 ; i < bookListInfo.length; i++){
            let infoStr = bookListInfo[i].innerText;
            let bookUrl = "http://opac.ncepu.edu.cn:8080/opac/" + bookUrlInfo[i].attributes.href.nodeValue;
            let arr = infoStr.trim().split(/\s+/).filter((val)=>val.indexOf("/") === -1);
            let collection = new Collection(arr[0], arr[3], arr[1], arr[2], bookUrl);
            collections.push(collection);
        }
        return collections;
    }
});