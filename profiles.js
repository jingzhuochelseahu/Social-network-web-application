require('dotenv').config();

// get correct db url
const pswd = process.env.MONGODB_PASSWORD;
const collectionName = process.env.MONGODB_COLLECTION;
const user = process.env.MONGODB_USER;
const url1 = `mongodb+srv://${user}:${pswd}@cluster0.ubha6.mongodb.net/${collectionName}?retryWrites=true&w=majority`;

// url for exceptions
const url2 = `mongodb+srv://${user}:${pswd}@cluster0.ubha6.mongodb.net/proj_wrongdb?retryWrites=true&w=majority`;

module.exports = {
  url1, url2,
};
