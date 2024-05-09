const crypto = require("crypto");
const {fetch2, FetchResponseError, FetchError} = require("../utils/fetch");
require("dotenv-safe").config();


let Authorization = {};

/**
 * Retrieves information on all devices owned.
 * @return {Promise<Response>}
 *
 * @throws {FetchResponseError}
 * @throws {FetchError}
 */
exports.get_all_device = () => {
    const header = JSON.parse(JSON.stringify(get_authorization()));
    header['Content-Type'] = "application/json";
    const init = {
        method: "GET",
        headers: header,
    }

    return fetch2(`https://api.switch-bot.com/v1.1/devices/`, init)
        .then(async res=>{
            const res_json = await res.json()
            //if(res_json)

            return res_json.body.deviceList;
        })
}

/**
 * Obtains the status of the specified device.
 * @param {string}device_id
 * @return {Promise<Response>}
 *
 * @throws {FetchResponseError}
 * @throws {FetchError}
 */
exports.get_device_status = (device_id) => {
    const header = JSON.parse(JSON.stringify(get_authorization()));
    header['Content-Type'] = "application/json";
    const init = {
        method: "GET",
        headers: header,
    }

    return fetch2(`https://api.switch-bot.com/v1.1/devices/${device_id}/status`, init)
}

/**
 * Executes a specific command for the specified Device
 * @param {String}command
 * @param {String}device_id
 * @param [parameter]
 *
 * @return {Promise<Response>}
 *
 * @throws {FetchResponseError}
 * @throws {FetchError}
 */
exports.execute_command = (command, device_id, parameter) => {
    const body = {
        "commandType": "command",
        "command": command,
        "parameter": parameter
    }

    const header = JSON.parse(JSON.stringify(get_authorization()));
    header['Content-Type'] = "application/json";
    const init = {
        method: "POST",
        headers: header,
        body: JSON.stringify(body)
    }

    return fetch2(`https://api.switch-bot.com/v1.1/devices/${device_id}/commands`, init)
}

/**
 * Get authentication information for SwitchBotAPI
 * @return {null|{Authorization: String, t: string, sign: string, nonce: string}}
 */
const get_authorization = ()=>{
    if(Authorization && Date.now()<=Authorization.expired) return Authorization.authorization;
    const token = process.env.TOKEN;
    const secret = process.env.SECRET;
    const t = Date.now();
    const nonce = crypto.randomUUID();

    const data = token + t + nonce;
    const signTerm = crypto.createHmac('sha256', secret)
        .update(Buffer.from(data, 'utf-8'))
        .digest();
    const sign = signTerm.toString("base64");

    const now = new Date()
    now.setMinutes(now.getMinutes()+5)

    Authorization = {
        expired: now,
        authorization: {
            "Authorization": token,
            "sign": sign,
            "t": t.toString(),
            "nonce": nonce
        }
    }

    return Authorization.authorization;
}
