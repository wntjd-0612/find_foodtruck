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

app.listen(3000,function (){
    console.log("open sever");
});
