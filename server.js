const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mysql = require('mysql');
const settings = require('./settings');

const conn = mysql.createConnection({
    host: 'sushi-gemu-aws.cevgmwsivig4.eu-west-3.rds.amazonaws.com',
    user: settings.username,
    password: settings.password,
    database: 'sushi_gemu'
});

conn.connect((err) => {
    if(err){
        throw err;
    }
    console.log('Connected to database');
});

app.use(function(req, res, next) {
//    res.header("Access-Control-Allow-Origin", "https://sushi-gemu.doriantaing.fr");
   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
 });

app.route('/api/categories').get((req , res) => {
    const data = [];
    const sqlQuery = `
        SELECT category , questionId
        FROM categories
    `;

    conn.query(sqlQuery, (err, rows, fields) => {
        if (err) throw err;
        rows.map(el => {
            data.push({title: el.category , id: el.questionId})
        });
        res.status(200).json({data})
    });

    // conn.end();
});

app.route('/api/category')
   .get( (req, res) => {
        res.json( categoryJson );
   });

app.route('/api/category/id=:id')
    .get( (req , res) => {
       let data = [];
       let dataError = 'No data found';
       const sqlQuery = `
        SELECT question , answer , id
        FROM questions
        WHERE ${req.params.id} = questionId
        LIMIT 10
        `;

        conn.query(sqlQuery, (err, rows, fields) => {
            if (err) throw err;
            rows.map(el => {
                data.push(el)
            });

             data.length > 0 ? res.send(data) : res.send(dataError);
        });
    });


app.get('*' , (req , res) => {
   res.status(404).send('404');
})

 app.listen(port, () => console.log(`Listening on port ${port}`));
