const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'wntjd',
    password: '0612',
    database: 'find_foodtruck'
});

connection.connect();

// body-parser 설정
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// index.html 파일을 루트 경로로 응답
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// index.css 파일을 스타일 시트로 응답
app.get('/styles/index.css', function (req, res) {
    res.sendFile(__dirname + '/styles/index.css');
});
// index.js 파일을 스타일 시트로 응답
app.get('/script/index.js', function (req, res) {
    res.sendFile(__dirname + '/script/index.js');
});

app.post('/api/register', (req, res) => {
    const address = req.body.address;
    const place_name = req.body.place_name;
    const place_kind = req.body.place_kind;

    const newData = {
        address: address,
        placename: place_name,
        placetype: place_kind
    };

    console.log('newData:', newData);

    connection.query('INSERT INTO PLACE SET ?', newData, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(500).send('Database error');
        } else {
            console.log('New Data added with ID:', results.insertId);
            res.status(200).send('User registered successfully');
        }
    });
});
app.get('/api/data', (req, res) => {
    connection.query('SELECT * FROM PLACE', (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(500).send('Database error');
        } else {
            let data = results.map(result => {
                return {
                    id: result.id,
                    address: result.address,
                    placename: result.placename,
                    placetype: result.placetype
                }
            });
            res.status(200).json(data);
        }
    });
});

app.listen(3000,function (){
    console.log("open sever");
});
