import express from "express";
import bodyParser from "body-parser";
import pg from "pg"; 

const app = express();
const port = 3000;
const db = new pg.Client({
  user:"postgres",
  password:'&ç§"',
  host:"localhost",
  database:"permalist",
  port:5432
});
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


let items = [];
async function loadItems (){
  const result = await db.query("SELECT * FROM items ORDER BY id ASC ; "); 
  return result.rows ; 
}
app.get("/", async (req, res) => {
  try{
  items = await loadItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
  }catch(error){
    console.log(error.message);
  }
  
});

app.post("/add", async (req, res) => {
  try{
    const title = req.body.newItem ; 
    await db.query("INSERT INTO items (title) VALUES ($1) ; ", [title]);
    res.redirect("/");
  }catch(error){
    console.log(error.message);
  }
  
});

app.post("/edit",async  (req, res) => {
  try{
    await db.query("UPDATE items SET title=$1 WHERE id=$2" , [req.body.updatedItemTitle , req.body.updatedItemId]);
    res.redirect("/");
  }catch(error){
    console.log(error.message);
  }
  

});

app.post("/delete", async (req, res) => {
  try{
    const id = req.body.deleteItemId ; 
    await db.query("DELETE FROM items WHERE id = $1 " , [id]);
    res.redirect("/");
  }catch(error){
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
