import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/database.js";

dotenv.config({
    path: "./.env",
});


const port = process.env.PORT ||  3000

/*app.get('/', (req, res) => {
  res.send('Hello World!')
})*/

connectDB()
   .then(() => {
    app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
})
    
   })
   .catch((err) => {
    console.error("MongoDB connection failed, error:", err);
    process.exit(1);
   })



