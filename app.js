
import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { Redis } from '@upstash/redis'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
//import serverless from 'serverless-http';

const port = 3000
const redis = Redis.fromEnv()

// recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express()


app.use(express.static(path.join(__dirname,'public')))
app.use(express.json());

app.get('/',(req,res) => {
  res.sendFile(path.join(__dirname, 'public','index.html'))
})




app.post('/user/cards',(req,res) => {
    console.log('route')
    const {id:userID, data:card} = req.body
    console.log(`request received card is ${card.title}`)

    res.status(200).json({
    message: 'recieved card',
    cardTitle: card.title,
    id: userID
    }) 

    //setRedis(card,userID)

})


async function setRedis(card,userID){



    await redis.rpush(`id:${userID}`,card)

    //const existingData = await redis.get(`id:${userID}`)

    // if(existingData != ""){
    //     console.log("existing redis entry")
    //    console.log(existingData)
    //    existingData.rpush(`id:${userID}`,card)
    // } else{
    //     await redis.set(`id:${userID}`,card)
    //     console.log('redis pushed')

    // }
    
}

async function getRedis(userID) {
    const stored = await redis.lrange(`id:${userID}`,0,-1)
    //let data = stored.map(item => JSON.stringify(item))
    console.log(stored)
    return stored
}

app.get('/user/:id', async (req,res) =>{
    console.log('route hit here')
    let id = req.params.id
    let userData = await getRedis(id)
    console.log(userData)

     res.status(200).json(
     userData
    ) 
})


//export default app;
app.listen(port, () => {
  console.log(`App live on port: ${port}`)
})