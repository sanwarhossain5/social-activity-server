const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://socialActivitis:LEx304HZEg1scxBl@cluster0.nxgxqoq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const postCollection = client.db("social-activitis").collection("posts");
    const aboutCollection = client.db("social-activitis").collection("about");
    const commentCollection = client
      .db("social-activitis")
      .collection("comment");
    const reactionCollection = client
      .db("social-activitis")
      .collection("reaction");

    app.get("/about", async (req, res) => {
      const query = {};
      const result = await aboutCollection.find(query).toArray();
      res.send(result);
    });

    //update about info
    app.put("/about/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const info = req.body;
      console.log(info);
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          name: info.name,
          email: info.email,
          university: info.university,
          address: info.address,
        },
      };
      const result = await aboutCollection.updateOne(filter, updateDoc, option);
      res.send(result);
    });

    //send post in db
    app.post("/posts", async (req, res) => {
      const post = req.body;
      const result = await postCollection.insertOne(post);
      res.send(result);
    });
    // all post get
    app.get("/posts", async (req, res) => {
      const query = {};
      const result = await postCollection
        .find(query, { sort: { _id: -1 } })
        .toArray();
      res.send(result);
    });

    //single post for service details com
    app.get("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await postCollection.findOne(query);
      res.send(result);
    });

    //comment post
    app.post("/comment", async (req, res) => {
      const comment = req.body;
      const result = await commentCollection.insertOne(comment);
      res.send(result);
    });

    //single comment
    app.get("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { postId: id };
      const comments = await commentCollection.find(query).toArray();
      res.send(comments);
    });

    //comment post
    app.post("/reaction", async (req, res) => {
      const reaction = req.body;
      const result = await reactionCollection.insertOne(reaction);
      res.send(result);
    });

    //single comment
    app.get("/reaction/:id", async (req, res) => {
      const id = req.params.id;
      const query = { postId: id };
      const reaction = await reactionCollection.find(query).toArray();
      res.send(reaction);
    });
  } finally {
  }
}
run().catch((error) => console.log(error));

console.log(uri);

app.get("/", (req, res) => {
  res.send("Social activity database");
});

app.listen(port, () => {
  console.log(`social activity database running ${port}`);
});

  