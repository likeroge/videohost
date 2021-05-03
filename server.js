const express = require('express')
const fs = require('fs')
const app = express()

//const
const CHUNK_SIZE = 5**6

const PORT = process.env.PORT || 8080

app.get('/', (req, res) =>res.sendFile(__dirname + '/public'+'/index.html'))

app.get('/video', (req,res)=>{
    const range = req.headers.range
    if(!range){
        res.status(400).send('Range header missing')
    }
    const videoPath = __dirname + '/public/' + 'football.mp4'
    const fileSize = fs.statSync(videoPath).size
    //start byte
    const start = Number(range.replace(/\D/g, ''))
    //end byte
    const end = Math.min(start + CHUNK_SIZE, fileSize - 1)
    const contentLength = end - start + 1 
    
    const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes', 
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4'
    } 

    const videoStream = fs.createReadStream(videoPath, {start, end})

    videoStream.pipe(res)    

    res.writeHead(206, headers)

})

app.listen(PORT, ()=>console.log('Server has been running'))