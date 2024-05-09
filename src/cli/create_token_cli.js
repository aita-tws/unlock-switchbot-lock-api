const {read_input} = require("../utils/read_stdio")
const {init} = require("../utils/db")
const {create_token} = require("../auth/auth")
require('date-utils');

(async ()=>{
    init()
    const name = await read_input("トークンの名前を入力してください。\n> ");
    const expires_how_long_srt = await read_input(
        "トークンの有効期限を入力してください。\n"+
        " 0 = 有効期限なし\n" +
        " d = n日後\n" +
        " w = n週間後\n" +
        " m = nヶ月後\n" +
        " y = n年後\n" +
        "> "
    )

    let expires = new Date()

    const expires_how_long_srt_list = expires_how_long_srt.split("")
    if(expires_how_long_srt_list.length===1){
        expires = null;
    }else{
        const suffix = expires_how_long_srt_list[expires_how_long_srt_list.length-1];
        let period_num = 0;
        try{
            period_num = parseInt(expires_how_long_srt_list
                .map((v,i)=>{return i<expires_how_long_srt_list.length-1? v:""})
                .join("")
            )
            switch (suffix){
                case "d": expires.setHours(expires.getHours() + period_num*24); break;
                case "w": expires.setHours(expires.getHours() + period_num*24*7); break;
                case "m": expires.setMonth(expires.getMonth() + period_num); break;
                case "y": expires.setMonth(expires.getMonth() + period_num*12); break;
                default: throw Error();
            }
        }catch (e) {
            console.log(e)
            console.log("有効期限のフォーマットが正しくありません。")
            process.exit(0)
        }
    }

    const token = create_token(name, expires);
    console.log(`名称:${name}, 有効期限:${expires?expires.toFormat("YYYY/MM/DD HH24:MI"):"期限なし"}`);
    console.log(`トークン:${token}`);
})()
