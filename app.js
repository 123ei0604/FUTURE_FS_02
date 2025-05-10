const express = require("express");
const {response} = require("express");
const https = require("https");
const app = express();

app.get('/',(req,res)=>{
    const url ='https://api.openweathermap.org/data/2.5/weather?q=Durgapur&appid=1f5304f708242de2950285e4d6e9bbfd&units=metric'
    https.get(url,(response) =>{
        console.log(response)
    })
}
    );


app.listen(3000,()=>console.log("Our server is running at port 3000"));

