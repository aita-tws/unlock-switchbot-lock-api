'use strict'

require("date-utils");
require("dotenv-safe").config();

const debug_mode = process.env.NODE_ENV==="development";

if (debug_mode) {
    process.env.DEBUG = "unlock_switchbot_lock_api:*"
}

const debug = require("debug")("unlock_switchbot_lock_api:index")
const app = require("./app");
const port = parseInt(process.env.PORT || "3000", 10);

const http = require("http");
app.set("port", port)
const server = http.createServer(app)

server.on("listening", ()=>{
    require("./utils/db").init();
    const address = server.address()
    const bind = typeof address === "string"
        ? "pipe " + address
        : "port " + address?.port
    debug("Listening on " + bind)
})

server.on("error", (error)=>{
    throw error;
})

server.listen(port);
