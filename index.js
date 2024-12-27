import bodyParser from "body-parser";
import express from "express";
import pg from "pg";


const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    password: "Aldoger12!",
    database: "manga",
    port: 5432
});

db.connect();

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

let manga;

app.get("/", async (req, res) => {
    try {
        // Query the database for manga entries
        const mangaResult = await db.query("SELECT * FROM manga ORDER BY score DESC");

        // Send the manga data to the view
        res.render("index", { mangas: mangaResult.rows });
    } catch (err) {
        console.error("Error fetching manga data:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/addbook", (req, res) => {
    res.render("addBookForm");
});

app.post("/add",async (req, res) => {
    const title = req.body["title"];
    const isbn = parseInt(req.body["isbn"]);
    const author = req.body["author"];
    const score = parseInt(req.body["score"]);
    const desc = req.body["desc"];
    try{
        await db.query(
            "INSERT INTO manga (bookisbn, title, author, score, description) VALUES ($1, $2, $3, $4, $5)",
            [isbn, title, author, score, desc]
        );
        res.redirect("/");
    }
    catch (err){
        console.error("Cannot execute query");
        res.send(500).status(500)
    }
});

process.on("SIGINT", () => {
    db.end();
    console.log("Database connection closed");
    process.exit();
});

app.listen(port, () => {
    console.log("Listening to port: "+ port);
});
