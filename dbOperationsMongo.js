/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
// Import MongoDB module
// const { compareSync } = require('bcryptjs');
// const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();
// get db url
const pswd = process.env.MONGODB_PASSWORD;
const collectionName = process.env.MONGODB_COLLECTION;
const user = process.env.MONGODB_USER;
const url = `mongodb+srv://${user}:${pswd}@cluster0.fxsrf.mongodb.net/${collectionName}?retryWrites=true&w=majority`;
// console.log('mongodb server url is ', url);

// Connect to our db on the cloud
// async function connect() {
//     try {
//         console.log('in connect');
//         const con = (await MongoClient.connect(url,
//             { useNewUrlParser: true, useUnifiedTopology: true })).db();
//         // Connected to db
//         console.log(`Connected to database: ${con.databaseName}`);
//         // console.log('deleting from db');
//         // await deleteUserByName(con, 'test1');
//         return con;
//     } catch (err) {
//         console.error(err.message);
//         throw err;
//     }
// }

function connect() {
  // const conn = mongoose.createConnection(url, {
  //   useUnifiedTopology: true,
  //   useNewUrlParser: true,
  //   writeConcern: {
  //     j: true,
  //   },
  // });
  mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    writeConcern: {
      j: true,
    },
  });
  console.log('Connected to database!');
  return mongoose.connection;
}

/* --------------------Users-----------------------*/

// get a use by target attrib(s), hide password in server.js
async function getUserByAttrib(db, target) {
  console.log('in getUser by Attrib');
  console.log('target is ', target);
  try {
    const res = await db.collection('users').findOne(target);
    // console.log(`Found user: ${JSON.stringify(res)}`);
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function createUser(db, newUser) {
  try {
    console.log('in createUser');
    const res = await db.collection('users').insertOne(newUser);
    // console.log(`Created user with id: ${res.insertedId}`);
    return res.insertedId;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

// get all users, hide password in server.js
async function getUsers(db) {
  try {
    console.log('in getUsers');
    // const results = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
    const results = await db.collection('users').find({}).toArray();
    // console.log(`All Users: ${JSON.stringify(results)}`);
    return results;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

// modified 12/02/2021
// async function updateUser(db, userInfo) {
//     console.log('update user: ', userInfo.username);
//     // Performing an update on the path '_id' would modify the immutable field '_id'
//     delete userInfo._id;
//     try {
//         const res = await db.collection('users').updateOne(
//             { username: userInfo.username },
//             { $set: userInfo },
//         );
//         console.log(`Updated: ${JSON.stringify(res)}`);
//         return res;
//     } catch (e) {
//         console.log(`error: ${e.message}`);
//     }
// }

async function updateUserByAttrib(db, id, target) {
  console.log('in updateUser by Attrib');
  try {
    const res = await db.collection('users').updateOne(
      { _id: ObjectId(id) },
      {
        $set: target,
      },
    );
    console.log(`!!!!Updated user: ${JSON.stringify(res)}`);
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function addPostToUser(db, id, postId) {
  console.log('in addPostToUser');
  try {
    const res = await db.collection('users').updateOne(
      { _id: ObjectId(id) },
      { $push: { posts: postId } },
    );
    console.log(`!!!!added post to user: ${JSON.stringify(res)}`);
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

// will remove everything in db related to this user!
async function deleteUserByAttrib(db, target) {
  console.log('in deleteUser by Attrib, target is', target);
  try {
    const targetUserIdStr = target._id.toString(); // convert from ObjectId to String
    // console.log('targetUserIdStr is', targetUserIdStr);
    const targetUserName = await getUserByAttrib(db, target).then((res) => res.username);
    // const targetUserName = 'test2';
    // console.log('targetUserName is', targetUserName);
    // remove user from posts collection. user_id, user_id in comments, mentioned(username) in comments, username in mentioned
    // all fields pulled from(like mentioned) must be of type Array!
    await db.collection('posts').deleteMany({ user_id: targetUserIdStr });
    await db.collection('posts').updateMany(
      {},
      {
        $pull: {
          comments: { user_id: targetUserIdStr, mentioned: targetUserName },
          mentioned: targetUserName,
        },
      },
    );
    // remove user from groups collection. administrators and members
    await db.collection('groups').updateMany(
      {},
      { $pull: { members: targetUserIdStr, administrators: targetUserIdStr } },
    );
    // remove user from chats collection, user1_id, user2_id, from or to in messages
    await db.collection('chats').deleteMany({ user1_id: targetUserIdStr });
    await db.collection('chats').deleteMany({ user2_id: targetUserIdStr });
    await db.collection('chats').updateMany(
      {},
      { $pull: { messages: { from: targetUserIdStr, to: targetUserIdStr } } },
    );
    // TODO maybe flagged and requests/invites collection
    // lastly, remove user from users collection
    const res = await db.collection('users').deleteOne(target);
    console.log(`Deleted User and related: ${JSON.stringify(res)}`);
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

/* --------------------Groups-----------------------*/
// get all groups
async function getGroups(db) {
  try {
    console.log('in getGroups');
    const results = await db.collection('groups').find({}).toArray();
    // console.log(`All groups: ${JSON.stringify(results)}`);
    return results;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function createGroup(db, newGroup) {
  try {
    console.log('in createGroup');
    const res = await db.collection('groups').insertOne(newGroup);
    // console.log(`Created group with id: ${res.insertedId}`);
    return res.insertedId;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function updateGroup(db, id, groupInfo) {
  console.log('in updateGroup');
  // delete groupInfo._id;
  try {
    const res = await db.collection('groups').updateOne(
      { _id: ObjectId(id) },
      { $set: groupInfo },
    );
    console.log(`Updated: ${JSON.stringify(res)}`);
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

// // TODO, replace with updateGroup
// async function updateGroupAdmins(db, id, administrators) {
//   console.log('in updateGroup by ID');
//   try {
//     const res = await db.collection('groups').updateOne(
//       { _id: ObjectId(id) },
//       {
//         $set: {
//           administrators,
//         },
//       },
//     );
//     console.log(`Group: ${JSON.stringify(res)}`);
//     return res;
//   } catch (err) {
//     console.log(`error: ${err.message}`);
//   }
// }

async function getGroupByAttrib(db, target) {
  console.log('in getGroup by Attrib');
  // console.log('target is ', target);
  try {
    const res = await db.collection('groups').findOne(target);
    // console.log(`Group: ${JSON.stringify(res)}`);
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function sortGroupByNumPosts(db, order) {
  console.log('in sortGroupByNumPosts');
  // get the number of posts in each group, and sort by the count in DESC or ASC order
  try {
    const res = await db.collection('posts').aggregate([
      // convert id string to obejectId first, otherwise cannot join
      { $set: { group_id: { $toObjectId: '$group_id' } } },
      { // join posts with groups
        $lookup: {
          from: 'groups',
          localField: 'group_id',
          foreignField: '_id',
          as: 'joined',
        },
      },
      { $match: { 'joined.public': 1 } }, // ONLY on PUBLIC groups
      { // group posts by group_id
        $group: {
          _id: '$joined.name', // use group name as id to group
          countPosts: { // count how many posts are in a group
            $sum: 1,
            // TODO, how to keep the ones with zero posts?
          },
        },
      },
      {
        $project: {
          _id: 1, // _id is actually the groupname
          groupname: '$_id',
          countPosts: 1,
        },
      },
      { $sort: { countPosts: order } }, // -1 for desc, 1 for asc
    ]).toArray();
    // for await (const info of res) {
    //   console.log(info);
    // }
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function sortGroupByNumMembers(db, order) {
  console.log('in sortGroupByNumMembers');
  // get the number of members in each group, and sort by the count
  try {
    const res = await db.collection('groups').aggregate([
      { $match: { public: 1 } }, // ONLY on PUBLIC groups
      {
        $project: {
          item: 1,
          countMembers: { $cond: { if: { $isArray: '$members' }, then: { $size: '$members' }, else: 'NA' } },
          groupname: '$name',
        },
      },
      { $sort: { countMembers: order } },
    ]).toArray();
    // for await (const info of res) {
    //   console.log(info);
    // }
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function sortGroupByNewestPost(db, order) {
  console.log('in sortGroupByNewestPost');
  // get the newest post of each group and sort the groups based on order
  try {
    const res = await db.collection('posts').aggregate([
      // convert id string to obejectId first, otherwise cannot join
      { $set: { group_id: { $toObjectId: '$group_id' } } },
      {
        $lookup: {
          from: 'groups',
          localField: 'group_id',
          foreignField: '_id',
          as: 'joined',
        },
      },
      { $match: { 'joined.public': 1 } }, // ONLY on PUBLIC groups
      {
        $group: {
          _id: '$joined.name', // use group name as id to group
          // posts: { $push: "$created_date" }: gets an array of created_date
          // gets the newst created_date of each group
          newestPost: { $max: '$created_date' },
        },

      },
      {
        $project: {
          _id: 1, // _id is actually the groupname
          groupname: '$_id',
          newestPost: 1,
        },
      },
      { $sort: { newestPost: order } }, // -1 for desc, 1 for asc
    ]).toArray();
    // for await (const info of res) {
    //   console.log(info);
    // }
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

/* --------------------Requests-----------------------*/
async function getRequests(db) {
  try {
    console.log('in getRequests');
    const results = await db.collection('requests').find({}).toArray();
    // console.log(`All posts: ${JSON.stringify(results)}`);
    return results;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function createRequest(db, newRequest) {
  try {
    console.log('in createRequest');
    console.log(newRequest);
    const res = await db.collection('requests').insertOne(newRequest);
    return res.insertedId;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function getRequestsById(db, groupId) {
  try {
    console.log('in getRequestsById');
    const results = await db.collection('requests').find({ groupId }).toArray();
    // console.log(`All posts: ${JSON.stringify(results)}`);
    console.log(`this is a specific request ${results}`);
    return results;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function deleteRequest(db, id) {
  console.log('in delete requests');
  try {
    const res = await db.collection('requests').deleteOne({ _id: ObjectId(id) });
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}
/* --------------------Invites-----------------------*/
async function getInvites(db) {
  try {
    console.log('in getInvites');
    const results = await db.collection('invites').find({}).toArray();
    return results;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function createInvite(db, newInvite) {
  try {
    console.log('in createInvite');
    const res = await db.collection('invites').insertOne(newInvite);
    // console.log(`Created group with id: ${res.insertedId}`);
    return res.insertedId;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}
async function getInvitesById(db, invitedId) {
  try {
    console.log('in getInvitesById');
    const results = await db.collection('invites').find({ invitedId: invitedId }).toArray();
    // console.log(`All posts: ${JSON.stringify(results)}`);
    return results;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}
async function deleteInvite(db, id) {
  console.log('in delete invite');
  try {
    const res = await db.collection('invites').deleteOne({ _id: ObjectId(id) });
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}
/* --------------------Posts-----------------------*/
async function getPosts(db) {
  try {
    console.log('in getPosts');
    const results = await db.collection('posts').find({}).toArray();
    // console.log(`All posts: ${JSON.stringify(results)}`);
    return results;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

// get a post by attrib
async function getPostByAttrib(db, target) {
  console.log('!!!!!!!!!in getPost by Attrib');
  try {
    const res = await db.collection('posts').findOne(target);
    console.log(`Post: ${JSON.stringify(res)}`);
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

// get many posts by attrib
async function getPostsByAttrib(db, target) {
  console.log('in getPosts by Attrib');
  try {
    const res = await db.collection('posts').find(target).toArray();
    console.log(`Posts: ${JSON.stringify(res)}`);
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function createPost(db, newPost) {
  try {
    console.log('in createPost');
    const res = await db.collection('posts').insertOne(newPost);
    console.log(`Created post with id: ${res.insertedId}`);
    return res.insertedId;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function updatePostByAttrib(db, id, target) {
  console.log('in updatePost by Attrib');
  try {
    const res = await db.collection('posts').updateOne(
      { _id: ObjectId(id) },
      {
        $set: target,
      },
    );
    console.log(`Updated Post: ${JSON.stringify(res)}`);
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

// return an array of post models
async function getFlaggedPostsByGroupId(db, id) {
  console.log('in getFlaggedPosts by groupid');
  try {
    const res = await db.collection('posts').find({ group_id: id, flag: 1 }).toArray();
    console.log(`Flagged Posts: ${JSON.stringify(res)}`);
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function deletePost(db, id) {
  console.log('in delete post');
  try {
    // delete it from its poster's posts!
    const deleteFromUser = db.collection('users').updateMany(
      {},
      { $pull: { posts: id } },
    );
    console.log('deleted post from user?', deleteFromUser);
    const res = await db.collection('posts').deleteOne({ _id: ObjectId(id) });
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}
/* --------------------Chats-----------------------*/
async function getChats(db) {
  try {
    console.log('in getChats');
    const results = await db.collection('chats').find({}).toArray();
    // console.log(`All chats: ${JSON.stringify(results)}`);
    return results;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function makeNewChat(db, newChat) {
  try {
    console.log('in createChat');
    const res = await db.collection('chats').insertOne(newChat);
    console.log(`Created chat with id: ${res.insertedId}`);
    return res.insertedId;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function getChatByAttrib(db, target1, target2) {
  try {
    console.log('in getChatByAttrib');
    const res = await db.collection('chats').findOne(
      {
        $or: [
          target1,
          target2,
        ],
      },
    );
    console.log('**********existing chat is', res);
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

async function updateChatByAttrib(db, target1, target2, lastUpatedTime, newMessage) {
  try {
    console.log('in updateChatByAttrib');
    const res = await db.collection('chats').updateOne(
      {
        $or: [
          target1,
          target2,
        ],
      },
      {
        $set: { lastupdated_date: lastUpatedTime, message: newMessage },
      },
    );
    console.log();
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

// removes every document from db, helps testing
async function resetDB(db) {
  console.log('reset db!');
  db.collection('users').deleteMany({});
  db.collection('posts').deleteMany({});
  db.collection('groups').deleteMany({});
  db.collection('chats').deleteMany({});
  db.collection('requests').deleteMany({});
  db.collection('uploads.chunks').deleteMany({});
  db.collection('uploads.files').deleteMany({});
}

// async function operations() {
//   console.log('in mongo opreations');
//   const db = await connect();
//   // await getUsers(db);
//   // test sort group on num of posts
//   // await sortGroupByNumPosts(db, 1);
//   // test sort group on num of members
//   // await sortGroupByNumMembers(db, 1);
//   // test sort group on newest post
//   // await sortGroupByNewestPost(db, 1);
//   // const target = {
//   //     // _id: ObjectId("61b2b333de07ce18b33db1cb"),
//   // }
//   // await deleteUserByAttrib(db, target);
//   // await getFlaggedPostsByGroupId(db, "61b2a67f6c1c20fea71a50a2");
//   // reset db
//   // await resetDB(db);
// }

// operations();

module.exports = {
  url,
  connect,
  createUser,
  getUserByAttrib,
  getUsers,
  updateGroup,
  updateUserByAttrib,
  deleteUserByAttrib,
  getGroups,
  createGroup,
  getGroupByAttrib,
  sortGroupByNumPosts,
  sortGroupByNumMembers,
  sortGroupByNewestPost,
  // updateGroupAdmins,
  getPosts,
  createPost,
  getPostByAttrib,
  getPostsByAttrib,
  getFlaggedPostsByGroupId,
  deletePost,
  updatePostByAttrib,
  addPostToUser,
  getChats,
  makeNewChat,
  getChatByAttrib,
  updateChatByAttrib,
  getRequests,
  createRequest,
  getInvites,
  createInvite,
  getRequestsById,
  getInvitesById,
  deleteInvite,
  deleteRequest,
};
