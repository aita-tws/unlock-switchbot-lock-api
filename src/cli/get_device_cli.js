const {read_input} = require("../utils/read_stdio");
const {init, get_all, execute} = require("../utils/db");
const {get_all_device} = require("../switchbot/switchbot_api_caller");


(async ()=>{
    init()

    execute("DELETE FROM devices");
    const device_list = await get_all_device();

    const new_device_list = [];

    console.info("設置されている部屋番号を入力してください。")

    for(let device of device_list){
        if(device["deviceType"]!=="Smart Lock") continue;

        const room_number_srt = await read_input(`デバイス名:${device["deviceName"]}\n> `);
        try{
            const room_number = parseInt(room_number_srt);
            new_device_list.push([device["deviceId"], room_number, device["deviceName"]]);
        }catch (e) {
           console.log("部屋番号のフォーマットが正しくありません。スキップします。");
        }
    }

    new_device_list.forEach(v=>{
        execute(
            "INSERT INTO devices(device_id, room_number, name) VALUES (?,?,?)",
            v
        )
    })

})()
