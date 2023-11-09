const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); 

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.no3nfin.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const foodCollection = client.db('foodDB').collection('food')
    const foodRequestCollection = client.db('foodrequestDB').collection('foodrequest')
    app.get('/foods', async(req,res)=>{
        const cursor = foodCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/foods/:id', async(req,res)=>{
        const id = req.params.id
        const query = { _id: new ObjectId(id) }
        const result = await foodCollection.findOne(query)
        res.send(result)
    })

    app.post('/foods',async(req,res)=>{
        const newFood = req.body
        console.log(newFood)
        const result = await foodCollection.insertOne(newFood)
        res.send(result)
    })
    app.post('/request',async(req,res)=>{
        const newRequest = req.body
        console.log(newRequest)
        const result = await foodRequestCollection.insertOne(newRequest)
        res.send(result)
    })
    app.put('/foods/:id', async(req,res)=>{
        const id = req.params.id
        const filter ={ _id: new ObjectId(id) }
        const options = {upsert: true}
        const updateFood =req.body
        const food = {
            $set:{
                foodName : updateFood.foodName,
                foodImage : updateFood.foodImage,
                foodQuantity : updateFood.foodQuantity,
                pickupLocation: updateFood.pickupLocation,
                expiredDate : updateFood.expiredDate,
                additionalNotes : updateFood.additionalNotes,
                foodStatus : updateFood.foodStatus,
                donatorName : updateFood.donatorName,
                donatorEmail : updateFood.donatorEmail,
                donatorImage : updateFood.donatorImage
            }
        }

        const result = await foodCollection.updateOne( filter, food, options)
        res.send( result )
    })
    app.delete('/foods/:id', async(req,res)=>{
        const id = req.params.id
        const query = { _id: new ObjectId(id) }
        const result = await foodCollection.deleteOne(query)
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) => {
    res.send('crud and jwt server is running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})