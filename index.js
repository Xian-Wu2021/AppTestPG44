// Add packages
require("dotenv").config();
// Add database package and connection string
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
      rejectUnauthorized: false
  }
});


const express = require("express");
const path = require("path");
const app = express();

// Server configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false })); // <--- middleware configuration


app.listen(process.env.POST || 3000, () => {
    console.log("Sever started (http://localhost:3000/) !");
})

app.get("/", (req, res) => {
    //res.send ("Hello word...");
    res.render("index");
})

//5. Use views in Express

app.set("view engine", "ejs");



app.set("views", __dirname + "/views");

app.use(express.static(path.join(__dirname, "public")));

app.get("/about", (req, res) => {
    console.log("about!");
    res.render("about");
})

app.get("/data", (req, res) => {
    const test = {
        title: "Test",
        items: ["one", "two", "three"]
    };
    console.log("data");
    res.render("data", { model: test });
});

app.get("/books", (req, res) => {
    const sql = "SELECT * FROM Books ORDER BY Title"
    pool.query(sql, [], (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("books", { model: result.rows });
    });
  });

// GET /edit/5
app.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM Books WHERE Book_ID = $1";
    pool.query(sql, [id], (err, result) => {
      // if (err) ...
      res.render("edit", { model: result.rows[0] });
    });
  });

// POST /edit/5
app.post("/edit/:id", (req, res) => {
    const id = req.params.id;
    const book = [req.body.Title, req.body.Author, req.body.Comments, id];
    const sql = "UPDATE Books SET Title = $1, Author = $2, Comments = $3 WHERE (Book_ID = $4)";
    console.log(req);
    console.log(book);
    console.log(sql);
    pool.query(sql, book, (err, result) => {
      // if (err) ...
      res.redirect("/books");
    });
  });


// GET /create
app.get("/create", (req, res) => {
    res.render("create", { model: {} });
  });


// POST /create
app.post("/create", (req, res) => {
    const sql = "INSERT INTO Books (Title, Author, Comments) VALUES ($1, $2, $3)";
    const book = [req.body.Title, req.body.Author, req.body.Comments];
    pool.query(sql, book, (err, result) => {
      // if (err) ...
      res.redirect("/books");
    });
  });

// GET /delete/5
app.get("/delete/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM Books WHERE Book_ID = $1";
    pool.query(sql, [id], (err, result) => {
      // if (err) ...
      res.render("delete", { model: result.rows[0] });
    });
  });

// POST /delete/5
app.post("/delete/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM Books WHERE Book_ID = $1";
    pool.query(sql, [id], (err, result) => {
      // if (err) ...
      res.redirect("/books");
    });
  });