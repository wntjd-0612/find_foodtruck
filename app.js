const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect();

// body-parser 설정
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// index.html 파일을 루트 경로로 응답
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// index.css 파일을 스타일 시트로 응답
app.get('/styles/index.css', (req, res) => {
    res.sendFile(__dirname + '/styles/index.css');
});

// index.js 파일을 스크립트로 응답
app.get('/script/index.js', (req, res) => {
    res.sendFile(__dirname + '/script/index.js');
});

app.post('/api/register', (req, res) => {
    const { address, place_name, place_kind } = req.body;

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
            res.status(200).send('Place registered successfully');
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
                };
            });
            res.status(200).json(data);
        }
    });
});

// 서버 시작
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
