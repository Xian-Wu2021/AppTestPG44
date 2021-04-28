const express = require("express");
const path = require("path");
const app = express();


app.listen(3000, () => {
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
    res.render("about");
})

app.get("/data", (req, res) => {
    const test = {
        title: "Test",
        items: ["one", "two", "three"]
    };
    res.render("data", { model: test });
});