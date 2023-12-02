
// credentials = require('./middi/credentials.js');
// const corsOptions = require('./config/corsOptions.js');
const express =require("express")
const path = require("path")
const cors = require("cors")
const app = express()


  

app.use(express.json())

app.setMaxListeners(15)

app.use(cors({
  origin: "http://localhost:3000",
  
}))

// app.use(cors(corsOptions));


   
//  for route


const pdfToImage= require("./Routes/pdfToImageRoute.js")



app.get("/PdfToImage", async (req, res) => {
  const indexPath = path.join(__dirname, "templates/pdfToImage.html");
  res.sendFile(indexPath);
});
 


app.use("/convert", pdfToImage)


module.exports = app