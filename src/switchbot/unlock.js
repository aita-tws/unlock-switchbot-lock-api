const switchbot_api = require("./switchbot_api_caller");
const {get_all} = require("../utils/db")

/**
 * 指定の部屋番号の部屋に設置されているデバイスのdevice_idを返す。
 * @param {Number}room_number
 * @return {Promise<string[]>}
 */
const get_device_id = async (room_number)=>{
    const devices = await get_all(
        "SELECT * FROM devices WHERE room_number=?",
        [room_number]
    )
    return devices.map(v=>{ return v["device_id"]});
}

/**
 * 指定のdevice_idのSwitchBot Lockを開錠する。
 * @param {string}device_id
 * @return {Promise<Response>}
 */
const unlock_device = (device_id)=>{
    return switchbot_api.execute_command("unlock", device_id, "{}")
}

/**
 * 指定の部屋番号の部屋のSwitchBot Lockを全て開錠する。
 * @param {Number}room_number
 */
const unlock_room_lock = async (room_number)=>{
    const device_id_list = await get_device_id(room_number);
    device_id_list.forEach(v=>{
        unlock_device(v);
    })
}

exports.unlock_room_lock = unlock_room_lock;
exports.unlock_device = unlock_device;
