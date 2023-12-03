require("dotenv/config")

// const mongoose = require("mongoose")
const express = require("express")


const app = require("./app");

  const port = process.env.PORT
  
  app.listen(port , ()=>{
      console.log(`App running on port ${port}` )
  })

 
