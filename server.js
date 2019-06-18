const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const categoryJson = require('./category.json');
const categoriesJson = require('./categories.json');
const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'hetic',
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
        SELECT category
        FROM categories
    `;

    conn.query(sqlQuery, (err, rows, fields) => {
        if (err) throw err;
        rows.map(el => {
           data.push(el)
        });    
        
        res.status(200).json({data})
    });
    
    // conn.end();
});

app.route('/api/category')
   .get( (req, res) => {
        res.json( categoryJson );
   });

app.route('/api/categories/id=:id')
    .get( (req , res) => {
       let answer;
       let dataError = 'No data found';

       categoriesJson.forEach(element => {
         if(req.params.id  === String(element.id)) {
            answer = element;
         }
       });
       answer !== undefined ? res.send(answer) : res.send(dataError);
    });


app.get('*' , (req , res) => {
   res.status(404).send('Get the fuck out ');
})

 app.listen(port, () => console.log(`Listening on port ${port}`));
