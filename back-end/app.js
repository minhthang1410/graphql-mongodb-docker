require("dotenv").config();
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const fileUpload = require("express-fileupload");
const cors = require('cors');
const { PubSub } = require("graphql-subscriptions");
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers')
const { MONGODB } = require('./config.js');
const path = require('path');
const checkAuthenticated = require('./middleware/checkAuthenticated')
const filesPayloadExists = require('./middleware/filesPayloadExists');
const fileExtLimiter = require('./middleware/fileExtLimiter');
const fileSizeLimiter = require('./middleware/fileSizeLimiter');
const User = require('./models/User');

const pubsub = new PubSub();

const app = express()

const PORT = process.env.NODE_DOCKER_PORT || 8080;

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub })
  });
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" })
  app.use('/public', checkAuthenticated, express.static('public'))
  app.use((req, res, next) => {
    res.status(404).json({
      errors: [
        {
          message: 'Route not found'
        }
      ],
      data: null
    });
  });
  app.use(cors())
  console.log(
    `Apollo server is running at http://localhost:${PORT}${server.graphqlPath}`
  );
};


// app.get("/private/:filename", checkAuthenticated, (req, res) => {
//   const filePath = path.join(__dirname, 'private/' + req.params.filename);
//   return res.sendFile(filePath, (err) => {
//     if (err) res.status(404).json({ status: 'error', message: 'File not found' });
//   });
// });

function generateRandomString(length) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

app.post("/update-avatar", checkAuthenticated, fileUpload({ createParentPath: true }), filesPayloadExists, fileExtLimiter(['.png', '.jpg', '.jpeg']), fileSizeLimiter, (req, res) => {
  const avatar = req.files.avatar;
  if (avatar) {
    const { ext } = path.parse(avatar.name);
    const randomName = generateRandomString(24) + ext;
    const filepath = path.join(__dirname, 'public/images/', randomName);
    avatar.mv(filepath, async (err) => {
      if (err) return res.status(500).json({
        errors: [
          {
            message: err
          }
        ],
        data: null
      })
      else {
        const user = await User.findById(req.user.id);
        user.avatar = randomName;
        user.save();
        return res.status(200).json({ 
          errors: null,
          data: randomName 
        });
      }
    });
  } else {
    return res.json({
      errors: [
        {
          message: "Missing file"
        }
      ],
      data: null
    });
  }
});

startApolloServer();

mongoose.connect(MONGODB, { useNewUrlParser: true }).then(() => {
  console.log('MongoDB connected');
  return app.listen({ port: PORT })
}).then(res => {
  console.log(`Server running at http://localhost:${PORT}`)
}).catch(err => {
  console.error(err)
});