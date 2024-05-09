const crypto = require("crypto");
const {execute, get_first} = require("../utils/db")

/**
 * トークンの文字列を生成します。
 * @param {string}str
 * @return {string}
 */
const create_token_str = (str)=>{
    const token_raw = crypto.randomUUID() + process.env.SALT  + str + Date.now();
    const base64_token_raw = Buffer.from(token_raw).toString('base64');
    const rmd160_toke_raw = crypto.createHash('rmd160').update(base64_token_raw).digest('hex');
    const token = Buffer.from(rmd160_toke_raw).toString('base64').replace(/==/g,"");

    return token;
}

/**
 * 与えられた文字列のハッシュを返します。
 * アルゴリズム: sha256
 * @param {string}str
 * @return {string}
 */
const get_hash_str = (str)=>{
    return crypto.createHash('sha256').update(str).digest('hex');
}

/**
 * トークンを生成します。
 * @param {string}name
 * @param {Date|null}expires
 * @return {string}
 */
const create_token = (name, expires)=>{
    const token = create_token_str(name);
    const hash = get_hash_str(token)

    execute(
        "INSERT INTO tokens(name, hash, expires, created_at, updated_at) VALUES (?,?,?,?,?)",
        [name, hash, expires?expires.getTime():0, Date.now(), Date.now()]
    )

    return token;
}


/**
 * トークンを検証します。
 * @param {string}token
 * @return {Promise<boolean>}
 */
const authenticate_token = async (token)=>{
    const hash = get_hash_str(token);
    const list = await get_first(
        "SELECT id, name FROM tokens WHERE hash LIKE ? AND (expires>=? OR expires=0)",
        [hash, Date.now()]
    )

    return !!list
}


exports.create_token = create_token;
exports.authenticate_token = authenticate_token;
