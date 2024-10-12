const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z7hla77.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// console.log(uri);
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
    const usersCollection = client.db("TaskPlanet").collection('users');
    const submissionCollection = client.db("TaskPlanet").collection('submission');


    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      res.send({ token });
    })











    app.get('/allUser', async (req, res) => {
      const query = { role: 'regularUser' };
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    })




    // login 
    app.post('/login', async (req, res) => {
      const { email, pass } = req.body;
      const query = { email: email };

      try {
        console.log('Received login request:', req.body);

        const result = await usersCollection.findOne(query);
        if (!result) {
          console.log('User not found for number:', email);
          return res.status(400).json({ message: 'User not found' });
        }

        console.log('User found:', result);

        const isMatch = (pass === result.password);
        if (isMatch) {
          console.log('Password match for user:', email);

          res.status(200).json({ message: 'Login successful' });
        } else {
          console.log('Invalid password for user:', email);
          res.status(400).json({ message: 'Invalid password' });
        }
      } catch (err) {
        console.log('Error during login:', err);
        res.status(500).json({ message: 'Internal server error' });
      }
    });


    // save user in database 
    app.post('/user', async (req, res) => {

      const { email, password, role } = req.body;
      const query = { email: email }
      const isExistingUser = await usersCollection.findOne(query);

      if (isExistingUser) {
        return res.send({
          message: 'user already exists', insertedId: null
        })
      }
      const user = {

        email,
        password,
        role
      }
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })


    // check role for user 
    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      query = { email: email }
      const result = await usersCollection.findOne(query);
      res.send(result);
    })




    app.put('/updateUser/:email', async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const options = { upsert: true };
      const updateUser = req.body;

      const user = {
        $set: {
          name: updateUser.name,
          socialMediaHandle: updateUser.handle,
        },
        $push: {
          photos: { $each: updateUser.imageURLs }
        }
      };

      const result = await usersCollection.updateOne(filter, user, options);
      res.send(result);
    });





    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Task planet is running');
})

app.listen(port, () => {
  console.log(`Task planet server is running on port ${port}`);
})


