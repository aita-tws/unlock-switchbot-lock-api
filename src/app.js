'use strict'

const express = require("express");
const cors = require('cors')
const bodyParser = require('body-parser');
const debug = require("debug")("unlock_switchbot_lock_api:app")
const {fetch2, FetchResponseError} = require("./utils/fetch");
const auth = require("./auth/auth")
const switchbot_lock = require("./switchbot/unlock");

const debug_mode = process.env.NODE_ENV==="development";
const app = express();

app.use(bodyParser.json());
app.use(cors())
app.set('view engine', 'jade');

app.use((req, res, next) => {
    res.send400 = () => res.status(400).send({ error: "bad_request" })
    res.send401 = () => res.status(401).send({ error: "unauthorized" })
    res.send403 = () => res.status(403).send({ error: "forbidden" })
    res.send404 = () => res.status(404).send({ error: "not_found" })
    res.send500 = async (e) => {
        if (debug_mode) {
            debug("an eor occurred:", e.stack || e)
        }
        res.status(e.status || 500).send({ error: "unknown" })
    }
    next()
})
app.get("/", async (req,res)=>{
    return res.status(200).send({"message": "reached"});
})

app.post("/unlock", async (req, res) => {
    const authorization_header = req.headers["authorization"];

    if(!authorization_header) return res.send401();

    const token = authorization_header.toString().replace("Bearer ","");
    if(!(await auth.authenticate_token(token))) return res.send403();

    const body = await req.body;
    const room_number_str = body["room_number"];
    if(!room_number_str) return res.send400();

    let room_number;
    try{
        room_number = parseInt(room_number_str)
    }catch (e) {
        debug(e.stack || e);
        return res.send400();
    }

    switchbot_lock.unlock_room_lock(room_number)
        .then(r=>{
            return res.status(200).json({message: "ok"});
        })
        .catch(e=>{
            debug(e.stack || e);
            return res.send500(e);
        })
});

module.exports = app;
