const express = require('express')
const app = express()

const port = 3000

app.use(express.json())


app.use("/home", (request, response)=>{
    response.send("Bienvenido al inicio")
})

const router = require('./Routers/routers')
app.use(router)

app.use("/", (request, response)=>{
    response.send("Not found")
})

app.listen(port, ()=>{
    console.log("El api está corriendo en  el http://localhost:"+port);
})
