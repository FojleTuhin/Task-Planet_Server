const express = require ('express');
const cors = require ('cors');
require ('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z7hla77.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}


app.get('/', (req, res)=>{
    res.send('Task planet is running');
})

app.listen(port,()=>{
    console.log(`Task planet server is running on port ${port}`);
})


