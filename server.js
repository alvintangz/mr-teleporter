const https = require('https');
const express = require('express');
var app = express();
const JSON = require('JSON');

/** database init */
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./chinook.db', (err)=>{
    if (err){
        return console.error(err.message);
    }
    // console.log('wegucci')
});
/** end database init */

/** api routes */
app.get('/', function(req, res){
    res.send('hello world boi');
  });

app.post('/api/enable', (req,res)=>{
    let query = `UPDATE take_me_to SET enabled = ?`;
    let data = ['true']
    db.run(query, data, (err)=>{
        if (err){
            return console.error(err.message);
        }
        // console.log(`enabled location view`);
    });
    res.sendStatus(200);
});

app.post('/api/disable', (req,res)=>{
    let query = `UPDATE take_me_to SET enabled = ?, latitude = ?, longitude = ?`;
    let data = ['false', 'null', 'null']
    db.run(query, data, (err)=>{
        if (err){
            return console.error(err.message);
        }
        // console.log(`disabled location view`);
    });
    res.sendStatus(200);
});

app.get('/api/fetch', (req, res)=>{
    let query = `SELECT * FROM take_me_to`
    db.get(query, (err, row)=>{
        if(err){
            return console.error(err.message);
        }
        // console.log(JSON.stringify(row))
        res.send(row)
    });
});

const httpGet = (url) => {
    return new Promise((resolve, reject) => {
      https.get(url, res => {
        res.setEncoding('utf8');
        let body = ''; 
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve(body));
      }).on('error', reject);
    });
  };

app.put('/api/new-place/:location', async (req, res)=>{
    var location = req.params.location;
    var body = await httpGet(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyDREz7hHVEKem4yrgn6P7FOhJJO1mAwbVE`)
    var formattedData = JSON.parse(body);
    // var locationPair = {
    //     latitude: null,
    //     longitude: null
    // }
    let query = `UPDATE take_me_to SET latitude = ?, longitude = ?`;
    let queryData = [formattedData.results[0].geometry.location.lat, formattedData.results[0].geometry.location.lng]
    db.run(query, queryData, (err)=>{
        if (err){
            console.error(err)
        }
        res.sendStatus(200)
    });
    // console.log(location)
    // console.log(body)
    
})
/** end api routes */
app.listen(3000);