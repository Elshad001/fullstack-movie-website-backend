const express = require('express');
const PORT =process.env.PORT || 3001
const app = express();
const mysql2 = require('mysql2');
const bodyParser = require('body-parser');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended:false }));
app.use(express.json());
app.use(express.static('public'));

const db=mysql2.createConnection(
    {
        host: 'localhost',
        user: 'root',
        database: 'movies',
        password:"root1898"
    }
)

db.connect((err)=>
{
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log("Connect")
    }
})

app.listen(PORT, ()=>
{
    console.log(`Server listening on ${PORT}`)
})

app.get('/', (req, res)=>
{
    res.render('index')
});


app.get('/movies', (req, res) => {
    const sql = 'SELECT * FROM allMovies';
  
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Ürünleri getirirken hata oluştu: ', err);
      } else {
        res.render('movies', { movies: result });
      }
    });
  });


  app.get('/movies/add', (req, res) => {
    res.render('add-movies');
  });




  app.post('/movies/add', (req, res) => {
    const { name,image,genre,raiting,year} = req.body;
    const sql = 'INSERT INTO allMovies (name,image,genre,raiting,isFavorite) VALUES (?, ?, ?, ?, ?,?)';
  
    db.query(sql, [ name,image,genre,raiting,year,0], (err, result) => {
      if (err) {
        console.error('Ürün eklerken hata oluştu: ', err);
      } else {
        res.redirect('/movies');
        res.render('/movies')
      }
    });
  });

  app.get("/api", (req, res) => {
    db.query("SELECT * from allMovies", (err,results) => {
      res.send(results)
      if(err){
        console.log(err)
      }
      console.log(results)
    });
  });

  app.get('/movies/edit/:id', (req, res) => {
    const moviesId = req.params.id;
    const sql = 'SELECT * FROM allMovies WHERE id = ?';
    db.query(sql, [moviesId], (err, result) => {
      if (err) {
        console.error('Ürünü getirirken hata oluştu: ', err);
        res.redirect('/movies'); 
      } else {
        const movie = result[0];
        res.render('edit-movies', { movie });
      }
    });
});


  app.post('/movies/edit/:id', (req, res) => {
    const moviesId = req.params.id;
    const { name, image, genre, raiting, year, isFavorite} = req.body;
  
    const sql = 'UPDATE allMovies SET name = ?, image = ?, genre = ?, raiting = ?,year = ?, isFavorite = ? WHERE id = ?';
    const values = [name, image, genre, raiting, year, 0, moviesId];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Ürünü güncellerken hata oluştu: ', err);
        res.redirect('/movies'); 
      } else {
        res.redirect('/movies');
      }
    });
  });

  app.get('/movies/delete/:id', (req, res) => {
    const movieId = req.params.id;
    const sql = 'DELETE FROM allMovies WHERE id = ?';
  
    db.query(sql, [movieId], (err, result) => {
      if (err) {
        console.error('Ürünü silerken hata oluştu: ', err);
      } else {
        console.log('Ürün başarıyla silindi.');
      }
      res.redirect('/movies'); 
    });
  });