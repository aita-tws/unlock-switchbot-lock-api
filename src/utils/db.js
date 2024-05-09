const sqlite3 = require("sqlite3");

const file_path = "./data/data.db"

/**
 * データベースを初期化します。
 */
const init = ()=>{
    const db = new sqlite3.Database(file_path);

    db.serialize(()=>{
        db.run('CREATE TABLE IF NOT EXISTS tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, hash TEXT, expires INTEGER, created_at INTEGER, updated_at INTEGER)');
        db.run('CREATE TABLE IF NOT EXISTS devices (device_id TEXT PRIMARY KEY, room_number INTEGER, name TEXT)');
    })

    db.close()
}

/**
 * SQL文を実行し、結果を返します。
 * @param {string}statement SQL文
 * @param {[]}[placeholder] プレースホルダー
 * @return {Promise<unknown>}
 */
const query = (statement, placeholder)=>{
    return new Promise((resolve) => {
        const db = new sqlite3.Database(file_path);
        db.all(statement, placeholder, (err, rows)=>{
            resolve(rows)
        })
        db.close();
    })
}

/**
 * SQL文を実行します。
 * @param {string}statement SQL文
 * @param {[]}[placeholder] プレースホルダー
 */
const execute = (statement, placeholder)=>{
    const db = new sqlite3.Database(file_path);
    db.run(statement, placeholder);
    db.close();
}

/**
 * SQL文を実行し、該当する結果を配列ですべて返します。
 * @param {string}statement SQL文
 * @param {[]}[placeholder] プレースホルダー
 * @return {Promise<[unknown]>}
 */
const get_all = (statement, placeholder)=>{
    return new Promise((resolve) => {
        const db = new sqlite3.Database(file_path);
        db.all(statement, placeholder, (err, rows)=>{
            resolve(rows?.length ? rows: [])
        })
        db.close();
    })
}

/**
 * SQL文を実行し、該当する結果のうち、1番最初のデータを返します。
 * @param {string}statement SQL文
 * @param {[]}[placeholder] プレースホルダー
 * @return {Promise<unknown>}
 */
const get_first = (statement, placeholder)=>{
    return new Promise((resolve) => {
        const db = new sqlite3.Database(file_path);
        db.get(statement, placeholder, (err, row)=>{
            resolve(row)
        })
        db.close();
    })
}

exports.init = init;
exports.query = query;
exports.execute = execute;
exports.get_all = get_all;
exports.get_first = get_first;
