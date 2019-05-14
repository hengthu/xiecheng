const uas = require('./my-ua')//ua数组
const urls = require('./my-url')//携程链接数组
const fs = require('fs')
const Nightmare = require('nightmare')


const getpoxy = require('./4.js').getPoxy;//getpoxy为动态获取代理ip获取失败是等待并再来一遍
const uaList = uas.uas
let urlArr =urls.urls
let inx =0


main(urlArr[inx])
function main(url){
    getpoxy(v=>{
        if(v===null){
            setTimeout(()=>{
                main(url)
            },1000)
            //1000毫秒后再来一次
        }else{
            getMainPage(url,v)
        }
    })
}
function getMainPage(url,poxyurl) {
    let ua = uaList[Math.floor(Math.random() * uaList.length)]

    let tit = url.substring(url.indexOf("/hotel/")+7,url.indexOf(".html")+5)

    let nightmare = Nightmare({
        // switches: {
        //     'proxy-server': '122.97.166.237:22087', //配置获取到的poxyurl
        //     'ignore-certificate-errors': true
        // },
        webPreferences: {
            images: false
        },
        show: false,
        waitTimeout: 10000,
        gotoTimeout: 10000,
        width: 1920,
        height: 1080
    })

    nightmare
        .useragent(ua)
        .goto(`${url}`)
        .wait('#J_RoomListTbl')
        .evaluate(() => {
            var el = document.querySelector("#J_RoomListTbl")
            return "<div><table id=\"J_RoomListTbl\">" + $(el).html() + "</table></div>"
        })
        .end()
        .then(function (result) {
            fs.writeFile(tit, result, function(err) {
                if (err) {
                    console.log(err)
                }

                if(inx>=urlArr.length-1){
                    return
                }else{
                    inx++
                    main(urlArr[inx])
                }
            })
        })
        .catch(function (err) {
            console.error('Search failed:', url)
            console.error(err)

            if(inx>=urlArr.length-1){
                return
            }else{
                inx++
                main(urlArr[inx])
            }
        })
}
