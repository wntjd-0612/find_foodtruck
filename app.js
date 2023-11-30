const express = require('express');
const bodyParser = require('body-parser');
var app = express();

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


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/api/register', (req, res) => {
    const address = req.body.address;
    const place_name = req.body.place_name;
    const place_kind = req.body.place_kind;

    const newUser = {
        address: address,
        placename: place_name,
        placekind: place_kind
    };

    connection.query('INSERT INTO PLACE SET ?', newUser, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(500).send('Database error');
        } else {
            console.log('New user added with ID:', results.insertId);
            res.status(200).send('User registered successfully');
        }
    });
});

app.listen(3000,function (){
    console.log("open sever");
});

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'wntjd',
    password: '0612',
    database: 'find_foodtruck'
});

connection.connect();

connection.end();
