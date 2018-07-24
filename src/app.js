/**
 * Created by yixin on 18/7/22.
 */


define(["pageInit", "./page/index", "./page/second"], function(page, index, second) {

    var queryStringToObject = function (str) {
        return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = decodeURI(n[1]),this}.bind({}))[0];
    }

    var pages = {
        "index": index,
        "second": second
    }
    var query = queryStringToObject()["page"]

    page(pages[query || "index"], query+"_demo")
    
    
})