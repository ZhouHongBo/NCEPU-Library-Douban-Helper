/* 接收豆瓣页的url请求图书馆检索页 */
chrome.runtime.onConnect.addListener(onPortContent);

function onPortContent(port) {
    if (port.name == "port") {
        port.onMessage.addListener(onMessageRecieved);
    }
    function onMessageRecieved(data, port) {
        var xhr = new XMLHttpRequest();
        var url = data.message;
        console.log(url);
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resp = xhr.responseText;
                //console.log(resp);
                // resp = eval(resp);
                sendBack(port, resp);

            }
        }
        xhr.send(null);
    }
}
function sendBack(port, addResult) {
    port.postMessage({ message: addResult });
    //console.log(addResult);
}


/* 选中搜索功能 */
chrome.contextMenus.create({
    'type': 'normal',
    'title': '在华电图书馆检索',
    'id': 'btn-add',
    'contexts': ['selection'],
    'onclick': translate

});

function translate(info) {
    var query = 'http://opac.ncepu.edu.cn:8080/opac/openlink.php?strSearchType=title&match_flag=forward&historyCount=1&strText=';
    query += info.selectionText;
    window.open(query, 'Translate Results');
}