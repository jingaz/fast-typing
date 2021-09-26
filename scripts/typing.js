var dictionarys = ["cet4", "cet6", "gre_toefl", "pro"];
var dict = dictionarys[0];
if (localStorage.getItem("select") == null) {
    localStorage.setItem("select", dict);
} else {
    dict = localStorage.getItem("select");
}
var myColors = ["#4285f4", "#34a853", "#fbbc04", "#ea4335"];
// 输入框回车事件
function keyDown(event) {
    if (event.keyCode == 13) {
        //输入和单词不一致会重来
        let typein = document.getElementById("inputtext").value.trim();
        if (typein == "") { return; }
        let elem_word = document.getElementById("word").innerText;
        if (elem_word[0] == '*' && typein[0] != '*') {
            typein = "*" + typein;
        }
        if (typein == elem_word) {
            document.getElementById("inputtext").wrong_times = 0;
            get_word();
        }
        else {
            if (document.getElementById("inputtext").wrong_times >= 2) {
                alert("Word: " + elem_word + "\nTypein: " + typein);
            } else {
                document.getElementById("inputtext").wrong_times += 1;
            }
            document.getElementById("inputtext").value = "";
        }

    }
}
// 显示单词
function show_word(myWord) {
    let elem_word = document.getElementById("word");
    let new_word = "";
    for (var i = 0; i < myWord.length; i++) {
        let rand = ~~(Math.random() * myColors.length);
        new_word += "<span style='color:" + myColors[rand] + "'>" + myWord[i] + "</span>";
    }
    elem_word.innerHTML = new_word;
    document.getElementById("inputtext").value = "";
}
//随机从localStorage选出一个单词
function get_word() {
    let json = JSON.parse(localStorage.getItem(dict));
    let word = Object.keys(json)[Math.random() * Object.keys(json).length | 0];
    document.getElementById("contents").innerText = json[word];
    show_word(word.trim());
}
// 从服务器获取json文件 存到本地
function getjsonfile() {
    if (!in_new_tab) { return; }
    if (localStorage.getItem(dict) != null) {
        return get_word();
    }
    let url = "http://39.108.62.38/json/" + dict + ".json";
    let request = new XMLHttpRequest();
    request.open("get", url);/*设置请求方法与路径*/
    request.send(null);/*不发送数据到服务器*/
    request.onload = function () {/*XHR对象获取到返回信息后执行*/
        if (request.status == 200) {/*返回状态为200，即为数据获取成功*/
            localStorage.setItem(dict, request.responseText);
            get_word();
        }
    }
}
function change_dict() {
    let index = dictionarys.indexOf(dict) + 1;
    index = index >= dictionarys.length ? 0 : index;
    dict = dictionarys[index];
    getjsonfile();
    localStorage.setItem("select", dict);
    alert(dict);
}
if (chrome.browserAction != undefined && chrome.browserAction.onClicked != undefined) {
    chrome.browserAction.onClicked.addListener(function (tab) {
        var newURL = "../html/index.html";
        chrome.tabs.create({ url: newURL });
    });
}

var in_new_tab = false;
window.onload = function () {
    if (document.getElementById("inputtext") != null && document.getElementById("word") != null && document.getElementById("contents") != null) {
        in_new_tab = true;
        document.getElementById("inputtext").wrong_times = 0;
    }
    if (in_new_tab) {
        document.getElementById("inputtext").addEventListener("keydown", keyDown);
        document.getElementById("word").addEventListener("dblclick", change_dict);
        getjsonfile();
    }
};