import {Server} from "socket.io"
import express from "express"
import http from "http"
import "dotenv/config"

const app = express();

const server = http.createServer(app)

const io = new Server(server , {
    cors: {
        origin: process.env.URL,
        methods: ["GET","POST"]
    }
})