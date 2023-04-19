/* eslint-disable no-unused-expressions */
/* eslint-disable linebreak-style */
// Create express app
const express = require('express');
const { ObjectId } = require('mongodb');

const webapp = express();
const cors = require('cors');// to accept clients that are not on the same origin as the server?
const bcrypt = require('bcryptjs');// pswd encryption
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');

const corsOptions = {
  origin: '*',
  preflightContinue: false,
};
webapp.use(cors(corsOptions));
webapp.use(express.json());
webapp.use(bodyParser.json());
webapp.use(methodOverride('_method'));
webapp.use(
  express.urlencoded({
    extended: true,
  }),
);
// deploy
webapp.use(express.static(path.join(__dirname, './client/build')));

const portnum = 5000;
const saltRounds = 10;
// Import database operations
const lib = require('./dbOperationsMongo');
// const { calculateObjectSize } = require('bson');
let db;
let gfs; // Init gfs

// Start server
const port = process.env.PORT || portnum;

// move socket here
// const server = http.createServer(webapp);
// const io = socketio(server);
// let onlineUsers = [];

// add the new user to the server
// const addNewUser = (userId, socketId) => {
//   !onlineUsers.some((user) => user.userId === userId)
//     && onlineUsers.push({ userId, socketId });
//   console.log('^^^^^^^^^^^^^^adding new user', userId);
//   console.log('%%%%%%%%%%%%%%%%', socketId);
// };

// const removeUser = (socketId) => {
//   onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
//   console.log('@@@@@@@@@@@ remove user', socketId);
// };

// const getUser = (userId) => onlineUsers.find((user) => user.userId === userId);

// io.on('connection', (socket) => {
//   socket.on('newUser', (userId) => {
//     addNewUser(userId, socket.id);
//   });
//   console.log('#############Someone has connected!');
//   console.log('%%%%%%%%%%%%%% current users are', onlineUsers);

//   // send notification event to people
//   socket.on('SendAddAdminNotification', ({
//     senderId, senderName, receiverId, group,
//   }) => {
//     const receiver = getUser(receiverId);
//     const sender = getUser(senderId);
//     // console.log('^^^^^^^^^^^^^ receiver is', receiver);
//     // console.log('************* receiver is', sender);
//     io.to(receiver.socketId).emit('getAddAdminNotification', { senderId, senderName, group });
//   });

//   socket.on('SendFlagPostNotification', ({
//     senderId, senderName, receiverId, group,
//   }) => {
//     const receiver = getUser(receiverId);
//     // const sender = getUser(senderId);
//     console.log('^^^^^^^^^^^^^ receiver is', receiver);
//     console.log('************* senderName is', senderName);
//     io.to(receiver.socketId).emit('getFlagPostsNotification', { senderId, senderName, group });
//   });

//   socket.on('SendUnflagPostNotification', ({ receiverId, groupName }) => {
//     console.log('in SendUnflagPostNotification');
//     const receiver = getUser(receiverId);
//     console.log('^^^^^^^^^^^^^ receiver is', receiver);
//     console.log('groupname is', groupName);
//     io.to(receiver.socketId).emit('getUnflagPostsNotification', { groupName });
//   });

//   // socket.on('SendDeletePostNotification', ({ senderId, senderName, receiverId, group }) => {
//   //   const receiver = getUser(receiverId);
//   //   const sender = getUser(senderId);
//   //   // console.log('^^^^^^^^^^^^^ receiver is', receiver);
//   //   // console.log('************* receiver is', sender);
//   //   io.to(receiver.socketId).emit('getDeletePostsNotification', { senderId, senderName, group });
//   // });
//   // for posts you flagged
//   socket.on('SendDeletePostNotificationToFlagger', ({ receiverId, groupName }) => {
//     console.log('in SendDeletePostNotificationToFlagger');
//     const receiver = getUser(receiverId);
//     console.log('^^^^^^^^^^^^^ receiver (flagger) is', receiver);
//     console.log('groupname is', groupName);
//     io.to(receiver.socketId).emit('getDeleteFlaggedPostNotification', { groupName });
//   });

//   // for posts you made
//   socket.on('SendDeletePostNotificationToPoster', ({ receiverId, groupName }) => {
//     console.log('in SendDeletePostNotificationToPoster');
//     const receiver = getUser(receiverId);
//     console.log('^^^^^^^^^^^^^ receiver (poster) is', receiver);
//     console.log('groupname is', groupName);
//     io.to(receiver.socketId).emit('getDeletePostNotification', { groupName });
//   });

//   socket.on('SendMessageNotification', ({
//     senderId, senderName, receiverId, group,
//   }) => {
//     const receiver = getUser(receiverId);
//     const sender = getUser(senderId);

//     io.to(receiver.socketId).emit('GetMessageNotification', { senderId, senderName, group });
//   });

//   socket.on('SendPostNotification', ({ senderName, receiverId, group }) => {
//     const receiver = getUser(receiverId);
//     // console.log('^^^^^^^^^^^^^ receiver is', receiver);
//     // console.log('************* receiver is', sender);
//     io.to(receiver.socketId).emit('GetPostNotification', { senderName, group });
//   });

//   socket.on('SendMentionUserNotification', ({ receiverId, group }) => {
//     const receiver = getUser(receiverId);
//     console.log('^^^^^^^^^^^^^ receiver is', receiver);
//     // console.log('************* receiver is', sender);
//     console.log('########## in send mention user notification');
//     io.to(receiver.socketId).emit('GetMentionUserNotification', { group });
//   });

//   // send notification event to people
//   socket.on('SendUserNotification', ({ senderId, senderName, receiverId }) => {
//     const receiver = getUser(receiverId);
//     const sender = getUser(senderId);
//     // console.log('^^^^^^^^^^^^^ receiver is', receiver);
//     // console.log('************* receiver is', sender);
//     io.to(receiver.socketId).emit('getNotificationGroupInvite', { senderId, senderName });
//   });

//   socket.on('SendAcceptRequest', ({ receiverId, group }) => {
//     const receiver = getUser(receiverId);
//     console.log('^^^^^^^^^^^^^ receiver is', receiver);
//     // console.log('************* receiver is', sender);
//     console.log('########## in send accepted request notification');
//     io.to(receiver.socketId).emit('GetAcceptRequestNotification', { group });
//   });

//   socket.on('SendRejectRequest', ({ receiverId, group }) => {
//     const receiver = getUser(receiverId);
//     console.log('^^^^^^^^^^^^^ receiver is', receiver);
//     // console.log('************* receiver is', sender);
//     console.log('########## in send rejected request notification');
//     io.to(receiver.socketId).emit('GetRejectRequestNotification', { group });
//   });

//   socket.on('disconnect', () => {
//     removeUser(socket.id);
//     console.log('Someone has left');
//     console.log('%%%%%%%%%%%%%% current users are', onlineUsers);
//   });
// });

// // changed to server to listen! instead of webapp!
// server.listen(port, () => {
//   db = lib.connect();
//   console.log(`Backend Server running on port: ${port}`);
//   db.once('open', () => {
//     // Init stream
//     Grid.mongo = mongoose.mongo;
//     gfs = Grid(db.db);
//     if (gfs) {
//       console.log('Initialized gfs!');
//       gfs.collection('uploads');// where all the non-texual files are stored
//     }
//   });
// });

webapp.listen(port, () => {
  db = lib.connect();
  console.log(`Backend Server running on port: ${port}`);
  db.once('open', () => {
    // Init stream
    Grid.mongo = mongoose.mongo;
    gfs = Grid(db.db);
    if (gfs) {
      console.log('Initialized gfs!');
      gfs.collection('uploads');// where all the non-texual files are stored
    } else {
      console.error('error init gfs');
    }
    // console.log('gfs is', gfs);
  });
});

// create storage engine
const storage = new GridFsStorage({
  url: lib.url,
  file: (_req, file) => new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buf) => { // generate encrypted names
      if (err) {
        return reject(err);
      }
      const filename = buf.toString('hex') + path.extname(file.originalname);
      const fileInfo = {
        filename,
        bucketName: 'uploads',
      };
      resolve(fileInfo);
    });
  }),
});
const upload = multer({ storage });

// // Root endpoint, changed after deploy
// webapp.get('/', (_req, res) => {
//   res.json({ message: 'Welcome to CIS557 Team19 Proj Backend' });
// });

/* --------------------Users-----------------------*/
webapp.post('/api/registration', async (req, res) => { // make sure no dup in username or email
  try {
    console.log('Register a new user');
    // will add registration date in dbOperation
    if (!req.body.username || req.body.email === undefined || req.body.fullname === undefined || req.body.password === undefined) {
      console.log('req body missing params');
      res.status(404).json({ error: 'Missing user params!' });
      return;
    }
    const nameCheck = {
      username: req.body.username,
    };
    const emailCheck = {
      email: req.body.email,
    };
    const checkExistName = await lib.getUserByAttrib(db, nameCheck);
    const checkExistEmail = await lib.getUserByAttrib(db, emailCheck);
    if (checkExistName) {
      console.log(`user with name ${req.body.username} already exists!`);
      res.status(409).json({ error: 'This username is already registered!' });
      return;
    } if (checkExistEmail) {
      console.log(`user with email ${req.body.email} already exists!`);
      res.status(409).json({ error: 'This email is already registered!' });
      return;
    }
    // if not, can create a new user
    // hash password first, TODO, do we put it here in server or in frontend? Maybe backend is safer
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    if (!hashedPassword) {
      res.status(400).json({ error: 'Server side encrption failed' });
      return;
    }
    console.log('hashed pswd is ', hashedPassword);
    const newUser = {
      fullname: req.body.fullname,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      profile_image: '',
      chats: [],
      public_groups: [],
      private_groups: [],
      posts: [],
      registration_date: new Date().toLocaleString('en-US'), // new Date('<YYYY-mm-ddTHH:MM:ss>');
    };
    console.log('newUser with hashed pswd is ', newUser);
    const result = await lib.createUser(db, newUser);
    res.status(201).json({ data: result });// data is the userId
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.post('/api/login', async (req, res) => {
  try {
    console.log('Login a user');
    if (!req.body.username || req.body.password === undefined) {
      console.log('req body missing params');
      res.status(404).json({ error: 'Missing username or password!' });
      return;
    }
    const target = {
      username: req.body.username,
    };
    // const result = await lib.getUserByName(db, req.body.username);
    const result = await lib.getUserByAttrib(db, target);
    console.log('!!!hey result is ', result);
    if (!result) {
      console.log('no such username!');
      res.status(404).json({ error: 'Incorrect password or username!' });
      return;
    }
    // check if already locked and has not expired yet
    if (result.hasOwnProperty('lockout_expdate') && result.lockout_expdate !== '') {
      console.log('already has an expiration date! ', result.lockout_expdate);
      const now = new Date().toLocaleString('en-US');
      console.log('now is! ', now);
      if (new Date(result.lockout_expdate) > new Date(now)) {
        console.log('account lockout has not expired yet!');
        res.status(401).json({ error: 'Account is still being locked!' });
        return;
      }
      // else, can try to log in
      // reset expriation date and failed_attempts
      result.lockout_expdate = '';
      result.failed_attempts = 0;
    }
    // check pswd match not in frontend, but here
    const pswdCheck = await bcrypt.compare(req.body.password, result.password);
    // add lockout policy after 3 failures
    if (!pswdCheck) {
      console.error('passwords do not match');
      // accumulate failed_attempts
      // if (result.failed_attempts === NaN) {
      if (!result.hasOwnProperty('failed_attempts')) {
        console.log('no failed attempts yet');
        result.failed_attempts = 0;
      }
      result.failed_attempts += 1;
      // check failed attempts, set expiration time of one hour
      console.log('--------failed attemps are', result.failed_attempts);
      if (result.failed_attempts === 3) {
        const expDate = new Date(Date.now() + 1 * (60 * 60 * 1000)).toLocaleString('en-US');
        console.log('expDate is', expDate);
        result.lockout_expdate = expDate;
        // update result user to db
        console.log('newUser is', result);
        await lib.updateUserByAttrib(db, result._id, result);
        res.status(401).json({ error: 'Too many failed attempts! Account is locked for 1 hour!' });
        return;
      }
      // update result user to db
      // console.log('not 3 times yet, newUser is', result);
      await lib.updateUserByAttrib(db, result._id, result);
      // for testing
      // const testres = await lib.getUserByAttrib(db, target);
      // console.log('@@@@@', testres);
      res.status(401).json({ error: 'Incorrect password or username!' });
      return;
    }
    // successfully logged in, hide password
    delete result.password;
    // update in db, since might have changed lockout date
    await lib.updateUserByAttrib(db, result._id, result);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/users', async (_req, res) => {
  console.log('Get all users in db!');
  try {
    const results = await lib.getUsers(db);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/users/name/:username', async (req, res) => {
  console.log('Get user info with a specific name!');
  try {
    if (req.params.username === undefined) {
      res.status(404).json({ error: 'Missing user name!' });
      return;
    }
    // const result = await lib.getUserById(db, req.params.id);
    const target = {
      username: req.params.username,
    };
    const result = await lib.getUserByAttrib(db, target);
    if (!result) {
      console.log('no user with name ', req.params.username);
      res.status(404).json({ error: 'No such user name!' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/users/:id', async (req, res) => {
  console.log('Get user info with a specific id!');
  try {
    if (req.params.id === undefined) {
      res.status(404).json({ error: 'Missing user id!' });
      return;
    }
    // const result = await lib.getUserById(db, req.params.id);
    const target = {
      _id: ObjectId(req.params.id),
    };
    const result = await lib.getUserByAttrib(db, target);
    if (!result) {
      console.log('no user with id ', req.params.id);
      res.status(404).json({ error: 'No such user id!' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// update a User by id. eg: supports updating of password or update profile image
webapp.put('/api/users/:id', async (req, res) => {
  console.log('!!!Update user info with a specific id!');
  console.log(req.body);
  try {
    if (req.params.id === undefined) {
      res.status(404).json({ error: 'Missing user id!' });
      return;
    }
    // first see if the user exists, if yes, update, otherwise, return error
    const userInfo = {
      _id: ObjectId(req.params.id),
    };
    const checkExist = await lib.getUserByAttrib(db, userInfo);
    // or can we use modifiedCount: 1 of insertOne to check if match exists?
    if (!checkExist) {
      res.status(404).json({ error: 'User does not exist!' });
      return;
    }
    // if updating password, hash it first
    if (req.body.password) {
      console.log('!!!updating user password');
      // hash password
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      if (!hashedPassword) {
        res.status(400).json({ error: 'Server side encryption failed!' });
        return;
      }
      // replace password by newly hashed version
      req.body.password = hashedPassword;
      console.log('now req.body is', req.body);
    }
    const result = await lib.updateUserByAttrib(db, req.params.id, req.body);
    // console.log('result is ', result);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.delete('/api/users/:id', async (req, res) => {
  console.log('Delete a user with id and remove everything related to this user from db!');
  try {
    if (req.params.id === undefined) {
      res.status(404).json({ error: 'Missing user id!' });
      return;
    }
    const target = {
      _id: ObjectId(req.params.id),
    };
    const result = await lib.deleteUserByAttrib(db, target);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/* --------------------Groups-----------------------*/
webapp.post('/api/group', async (req, res) => {
  try {
    console.log('Create a new group');
    // will automatically add creater to administrator and member here
    // will set created_date as well
    // tags can be empty
    if (!req.body.groupname || req.body.public === undefined || req.body.userId === undefined) {
      console.log('req body missing params');
      res.status(404).json({ error: 'Missing groupname, public type or userid!' });
      return;
    }
    // see if group with the same name already exists in db
    // const checkName = await lib.getGroupByName(db, req.body.groupname);
    const target = {
      name: req.body.groupname,
    };
    const checkName = await lib.getGroupByAttrib(db, target);

    if (checkName) {
      console.log(`group with name ${req.body.name} already exists!`);
      res.status(409).json({ error: 'Group name already exists!' });
      return;
    }
    // if not, can create a new group
    const newGroup = {
      name: req.body.groupname,
      public: req.body.public,
      tags: req.body.tags,
      profile_image: req.body.profile_image,
      administrators: [req.body.userId],
      members: [req.body.userId],
      created_date: new Date().toLocaleString('en-US'),
      requests: [],
    };
    const result = await lib.createGroup(db, newGroup);
    res.status(201).json({ data: result });// data is the group id
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/groups', async (_req, res) => {
  console.log('Get all groups in db!');
  try {
    const results = await lib.getGroups(db);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/groups/:id', async (req, res) => {
  console.log('Get a group by id!');
  try {
    if (req.params.id === undefined) {
      res.status(404).json({ error: 'Missing group id!' });
      return;
    }
    // const results = await lib.getGroupById(db, req.params.id);
    const target = {
      _id: ObjectId(req.params.id),
    };
    const result = await lib.getGroupByAttrib(db, target);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// sort groups by <attrib> in <order>
// -1 for desc, 1 for asc
webapp.get('/api/groups/sort/:attrib/:order', async (req, res) => {
  console.log('Sort groups!');
  try {
    if (!req.params.attrib || !req.params.order) {
      res.status(404).json({ error: 'Missing attribute or order to sort on!' });
      return;
    }
    let results;
    const order = Number(req.params.order);
    if (req.params.attrib === 'numposts') {
      console.log('Sort on num of posts!');
      results = await lib.sortGroupByNumPosts(db, order);
    } else if (req.params.attrib === 'nummembers') {
      console.log('Sort on num of members!');
      results = await lib.sortGroupByNumMembers(db, order);
    } else if (req.params.attrib === 'newpost') {
      console.log('Sort on newest post');
      results = await lib.sortGroupByNewestPost(db, order);
    }
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// now supports update admins
webapp.put('/api/groups/:id', async (req, res) => {
  console.log('Update Group Info');
  try {
    if (req.params.id === undefined) {
      res.status(404).json({ error: 'Missing group id!' });
      return;
    }
    // console.log('!!!!!body is', req.body);
    const result = await lib.updateGroup(db, req.params.id, req.body);
    // const target = {
    //   _id: ObjectId(req.params.id),
    // };
    // const testres = await lib.getGroupByAttrib(db, target);
    // console.log('update testres~~~~~~~~', testres);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

//  can use the above one
// webapp.put('/api/groups/:id/administrators', async (req, res) => {
//   console.log('*************update administrators');
//   try {
//     if (req.params.id === undefined) {
//       res.status(404).json({ error: 'Missing group id!' });
//       return;
//     }
//     // const results = await lib.updateGroupAdmins(db, req.params.id, req.body.administrators);
//     // replaced with updateGroup
//     const result = await lib.updateGroup(db, req.params.id, req.body.administrators);
//     res.status(200).json({ data: result });
//   } catch (err) {
//     res.status(404).json({ error: err.message });
//   }
// });

/* --------------------Requests-----------------------*/
webapp.post('/api/requests', async (req, res) => {
  console.log('Make a request to join');
  try {
    if (!req.body.userId || !req.body.groupId || !req.body.username) {
      res.status(404).json({ error: 'Missing parameters' });
      return;
    }
    const newRequest = {
      userId: req.body.userId,
      groupId: req.body.groupId,
      username: req.body.username,
    };
    const result = await lib.createRequest(db, newRequest);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/requests', async (_req, res) => {
  console.log('Get requests in db!');
  try {
    const results = await lib.getRequests(db);
    console.log('Successfully getting specific group request');
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/requests/groupId/:groupId', async (req, res) => {
  console.log('Get requests for specific group');
  try {
    if (req.params.groupId === undefined) {
      res.status(404).json({ error: 'Missing group id!' });
      console.log('Missing group id');
      return;
    }
    // modified 12/02/2021
    // update whole info of user in body
    const results = await lib.getRequestsById(db, req.params.groupId);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.delete('/api/requests/:id', async (req, res) => {
  console.log('Delete request');
  try {
    if (req.params.id === undefined) {
      res.status(404).json({ error: 'Missing request id!' });
      return;
    }
    const result = await lib.deleteRequest(db, req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});
/* --------------------Invites-----------------------*/
webapp.post('/api/invites', async (req, res) => {
  try {
    if (!req.body.invitedId || !req.body.groupId || !req.body.invitingId || !req.body.groupname) {
      res.status(404).json({ error: 'Missing parameters' });
      return;
    }
    const newInvite = {
      invitedId: req.body.invitedId,
      invitingId: req.body.invitingId,
      groupId: req.body.groupId,
      groupname: req.body.groupname,
    };
    const result = await lib.createInvite(db, newInvite);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/invites', async (_req, res) => {
  console.log('Get all invites in db!');
  try {
    const results = await lib.getInvites(db);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/invites/invitedId/:invitedId', async (req, res) => {
  console.log('Get invites for specific group');
  try {
    if (req.params.invitedId === undefined) {
      res.status(404).json({ error: 'Missing invited id!' });
      return;
    }
    const results = await lib.getInvitesById(db, req.params.invitedId);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.delete('/api/invites/:id', async (req, res) => {
  console.log('Delete invite');
  try {
    if (req.params.id === undefined) {
      res.status(404).json({ error: 'Missing invite id!' });
      return;
    }
    const result = await lib.deleteInvite(db, req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});
/* --------------------Posts-----------------------*/
webapp.get('/api/posts', async (_req, res) => {
  console.log('Get all posts in db!');
  try {
    const results = await lib.getPosts(db);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/posts/:id', async (req, res) => {
  console.log('Get a post by id!');
  try {
    if (req.params.id === undefined) {
      res.status(404).json({ error: 'Missing post id!' });
      return;
    }
    const target = {
      _id: ObjectId(req.params.id),
    };
    const result = await lib.getPostByAttrib(db, target);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/groups/:id/posts', async (req, res) => {
  console.log('Getting all posts of a group!');
  try {
    if (!req.params.id) {
      res.status(404).json({ error: 'Missing group id!' });
      return;
    }
    // const results = await lib.getPostsByGroupId(db, req.params.id);
    const target = {
      group_id: req.params.id,
    };
    const results = await lib.getPostsByAttrib(db, target);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/groups/:id/flaggedposts', async (req, res) => {
  console.log('Getting all flagged posts of a group!');
  try {
    if (!req.params.id) {
      res.status(404).json({ error: 'Missing group id!' });
      return;
    }
    const result = await lib.getFlaggedPostsByGroupId(db, req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// version1: create a post with file
// attribs like text and userid will be in req.body, file is in req.file
// create a new post, upload the file to /uploads in mongodb, set attachment of post to be
// the file's id
// webapp.post('/api/groups/:id/postswithfile', upload.single('file'), async (req, res) => {
//   console.log('Make a post with file to a group!');
//   console.log('req.body is', req.body);
//   console.log('now req.file in gfs is', req.file);
//   console.log('req.file.id in gfs is', req.file.id);
//   try {
//     if (req.params.id === undefined) {
//       res.status(404).json({ error: 'Missing group id!' });
//       return;
//     }
//     // at least 1 of text and attachment file should be present
//     if (!req.body.userid || (req.body.text === undefined && req.file === undefined)) {
//       console.log('req body missing params');
//       res.status(404).json({ error: 'Missing userid or content(or attachment)' });
//       return;
//     }
//     const newPost = {
//       group_id: req.params.id,
//       user_id: req.body.userid,
//       text_content: req.body.text,
//       // save the uploaded file's info
//       attachment_name: req.file.filename,
//       attachment_type: req.file.contentType,
//       created_date: new Date().toLocaleString('en-US'),
//       lastupdated_date: new Date().toLocaleString('en-US'),
//       flag: 0,
//       comments: [],
//       hider: [],
//       hashtags: req.body.hashtags === undefined ? [] : req.body.hashtags,
//       mentioned: req.body.mentioned === undefined ? [] : req.body.mentioned, // MUST be of type Array to do $pull from
//     };
//     const result = await lib.createPost(db, newPost);
//     // add this post id (in string form) to the poster's posts
//     console.log('newly added post', result);
//     await lib.addPostToUser(db, req.body.userid, result._id.toString());
//     res.status(200).json({ data: result });
//   } catch (err) {
//     res.status(404).json({ error: err.message });
//   }
// });

// version 2, create post without file
webapp.post('/api/groups/:id/posts', async (req, res) => {
  console.log('!!!!Make a post with no file to a group!');
  console.log('req.body is', req.body);
  // BUG here: req.body should be formData. Something wrong !!!!
  try {
    if (req.params.id === undefined) {
      res.status(404).json({ error: 'Missing group id!' });
      return;
    }
    if (!req.body.userid) {
      console.log('req body missing params');
      res.status(404).json({ error: 'Missing userid or content(or attachment)' });
      return;
    }
    const newPost = {
      group_id: req.params.id,
      user_id: req.body.userid,
      text_content: req.body.text,
      created_date: new Date().toLocaleString('en-US'),
      lastupdated_date: new Date().toLocaleString('en-US'),
      flag: 0,
      comments: [],
      hider: [],
      hashtags: req.body.hashtags === undefined ? [] : req.body.hashtags,
      mentioned: req.body.mentioned === undefined ? [] : req.body.mentioned, // MUST be of type Array to do $pull from
    };
    const result = await lib.createPost(db, newPost);
    // add this post id (in string form) to the poster's posts
    console.log('newly added post', result);
    await lib.addPostToUser(db, req.body.userid, result._id.toString());
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// get a post/chat attachment file from /uploads using gfs
// webapp.get('/api/files/:filename', (req, res) => {
//   console.log('Get an attachment file from /uploads using gfs!');
//   try {
//     if (!req.params.filename) {
//       res.status(404).json({ error: 'Missing file name!' });
//       return;
//     }
//     gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//       if (err) {
//         console.error('error getting an attachment from gfs!');
//         return res.status(404).json({
//           err: 'Error getting file from GridFs!',
//         });
//       }
//       // Check if file
//       if (!file || file.length === 0) {
//         return res.status(404).json({
//           err: 'No such file!',
//         });
//       }
//       // console.log('file is', file);
//       let readstream;
//       // Check if image
//       if (file.contentType.match('image/*')) {
//         // Read output to browser
//         console.log('an image!');
//         res.contentType('image/png');
//         readstream = gfs.createReadStream(file.filename);
//         readstream.pipe(res);
//       } else if (file.contentType.match('video/*')) {
//         console.log('a video!');
//         res.contentType('video/mp4');
//         readstream = gfs.createReadStream(file.filename);
//         readstream.pipe(res);
//       } else if (file.contentType.match('audio/*')) {
//         console.log('an audio!');
//         res.contentType(file.contentType);
//         readstream = gfs.createReadStream(file.filename);
//         readstream.pipe(res);
//       } else {
//         res.status(404).json({ err: 'Not an image' });
//       }
//     });
//   } catch (err) {
//     res.status(404).json({ error: err.message });
//   }
// });

// update post, now only supports flag, unflag, comment-related and hide post
webapp.put('/api/posts/:id', async (req, res) => {
  console.log('Update a post!');
  try {
    if (!req.params.id) {
      res.status(404).json({ error: 'Missing post id!' });
      return;
    }
    // const oldPost = await lib.getPostById(db, req.params.id);
    const target = {
      _id: ObjectId(req.params.id),
    };
    const post = await lib.getPostByAttrib(db, target);
    if (!post) {
      res.status(404).json({ error: 'No such post id!' });
      return;
    }
    // TODO iterate over the fileds in req.body and change each one
    // const fields = req.body;
    console.log('here! body is ', req.body);
    // const bodyMap = JSON.parse(req.body);
    // for (const [key, value] of bodyMap.entries()) {
    //   console.log('body entry', key + ' = ' + value);
    // }
    let result;
    if (req.body.flag === 1 && req.body.flagger) { // flag a post
      console.log('flagging post');
      post.flag = 1;
      post.flagger = req.body.flagger;
      post.lastupdated_date = new Date().toLocaleString('en-US');
      console.log('now post is ', post);
      result = await lib.updatePostByAttrib(db, req.params.id, post);
    } else if (req.body.flag === 0) { // unflag a post
      console.log('unflagging post');
      post.flag = 0;
      post.flagger = '';
      post.lastupdated_date = new Date().toLocaleString('en-US');
      result = await lib.updatePostByAttrib(db, req.params.id, post);
    }
    if (req.body.type === 'add') {
      // add comment to the post
      post.comments.push(req.body.comment);
      console.log('now post is ', post);
      result = await lib.updatePostByAttrib(db, req.params.id, post);
    } else if (req.body.type === 'delete') {
      // delete comment from post
      const newPostComment = post.comments.filter((item) => JSON.stringify(item) !== JSON.stringify(req.body.comment));
      console.log('newPostComment', newPostComment);
      post.comments = newPostComment;
      console.log('now post is ', post);
      result = await lib.updatePostByAttrib(db, req.params.id, post);
    } else if (req.body.type === 'edit') {
      console.log('edit');
      const newPostComment = post.comments.filter((item) => JSON.stringify(item) !== JSON.stringify(req.body.oldComment));
      newPostComment.push(req.body.newComment);
      post.comments = newPostComment;
      console.log('now post is ', post);
      result = await lib.updatePostByAttrib(db, req.params.id, post);
    } else if (req.body.type === 'hide') {
      console.log('hide the post');
      post.hider.push(req.body.hider);
      console.log('************************now post is', post);
      result = await lib.updatePostByAttrib(db, req.params.id, post);
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.delete('/api/posts/:id', async (req, res) => {
  console.log('Delete a post with id from db!');
  try {
    if (req.params.id === undefined) {
      res.status(404).json({ error: 'Missing post id!' });
      return;
    }
    const results = await lib.deletePost(db, req.params.id);
    // also needs to delete this post from its poster's posts
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// can just use /delete/posts/:id
// webapp.delete('/posts/:id/flag', async (req, res) => {
//   console.log('Delete a flagged post with id from db!');
//   try {
//     if (req.params.id === undefined) {
//       res.status(404).json({ error: 'Missing post id!' });
//       return;
//     }
//     const results = await lib.deletePost(db, req.params.id);
//     res.status(200).json({ data: results });
//   } catch (err) {
//     res.status(404).json({ error: err.message });
//   }
// });

/* --------------------Chats-----------------------*/
// make a new chat
webapp.post('/api/chats', async (req, res) => {
  console.log('Start a new chat');
  try {
    console.log('Start a new chat');
    if (req.body.user1_id === undefined || req.body.user2_id === undefined) {
      console.log('req body missing params');
      res.status(404).json({ error: 'Missing two users ids' });
      return;
    }
    const target1 = {
      user1_id: req.body.user1_id,
      user2_id: req.body.user2_id,
    };

    const target2 = {
      user1_id: req.body.user2_id,
      user2_id: req.body.user1_id,
    };

    const result = await lib.getChatByAttrib(db, target1, target2);
    console.log('result is ', result);
    if (result) {
      console.log('chat is alreagy existed!');
      res.status(409).json({ error: 'Chat is already existed!' });
      return;
    }
    const newChat = {
      user1_id: req.body.user1_id,
      user2_id: req.body.user2_id,
      created_date: new Date().toLocaleString('en-US'),
      lastupdated_date: new Date().toLocaleString('en-US'),
      message: [req.body.message],
    };
    const chat = await lib.makeNewChat(db, newChat);
    res.status(201).json({ data: chat });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// version1: create a post with file
// attribs like text and userid will be in req.body, file is in req.file
// create a new post, upload the file to /uploads in mongodb, set attachment of post to be
// the file's id
// webapp.post('/api/chats/chatswithfile', upload.single('file'), async (req, res) => {
//   console.log('Make a chat with file!');
//   console.log('req.body is', req.body);
//   console.log('now req.file in gfs is', req.file);
//   console.log('req.file.id in gfs is', req.file.id);
//   try {
//     // at least 1 of text and attachment file should be present
//     if (req.body.user1_id === undefined || req.body.user2_id === undefined) {
//       console.log('req body missing params');
//       res.status(404).json({ error: 'Missing userids or content(or attachment)' });
//       return;
//     }
//     const target1 = {
//       user1_id: req.body.user1_id,
//       user2_id: req.body.user2_id,
//     };

//     const target2 = {
//       user1_id: req.body.user2_id,
//       user2_id: req.body.user1_id,
//     };

//     const result = await lib.getChatByAttrib(db, target1, target2);
//     console.log('result is ', result);
//     if (result) {
//       console.log('chat is alreagy existed!');
//       res.status(409).json({ error: 'Chat is already existed!' });
//       return;
//     }

//     const newMessageInfo = {};
//     newMessageInfo.from = req.body.from;
//     newMessageInfo.to = req.body.to;
//     newMessageInfo.created_date = req.body.created_date;
//     newMessageInfo.content = req.body.content;
//     newMessageInfo.attachment_id = req.file.filename;
//     newMessageInfo.attachment_type = req.body.attachment_type;

//     const newChat = {
//       user1_id: req.body.user1_id,
//       user2_id: req.body.user2_id,
//       created_date: new Date().toLocaleString('en-US'),
//       lastupdated_date: new Date().toLocaleString('en-US'),
//       message: [newMessageInfo],
//     };

//     const chat = await lib.makeNewChat(db, newChat);
//     res.status(200).json({ data: chat });
//   } catch (err) {
//     res.status(404).json({ error: err.message });
//   }
// });

// get all the chats
webapp.get('/api/chats', async (_req, res) => {
  console.log('Get all chats in db!');
  try {
    const results = await lib.getChats(db);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// get chats by two users
webapp.get('/api/chats/user1/:user1_id/user2/:user2_id', async (req, res) => {
  // console.log('Get existed chat');
  try {
    console.log('Get an exisiting chat');
    if (req.params.user1_id === undefined || req.params.user2_id === undefined) {
      // console.log('missing params');
      res.status(404).json({ error: 'Missing two users id' });
      return;
    }
    const target1 = {
      user1_id: req.params.user1_id,
      user2_id: req.params.user2_id,
    };

    const target2 = {
      user1_id: req.params.user2_id,
      user2_id: req.params.user1_id,
    };

    const result = await lib.getChatByAttrib(db, target1, target2);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// update the chat without file
webapp.put('/api/chats/user1/:user1_id/user2/:user2_id', async (req, res) => {
  // console.log('update existed chat');
  try {
    // console.log('Update an exisiting chat');
    if (req.params.user1_id === undefined || req.params.user2_id === undefined) {
      // console.log('missing params');
      res.status(404).json({ error: 'Missing two users id' });
      return;
    }
    const target1 = {
      user1_id: req.params.user1_id,
      user2_id: req.params.user2_id,
    };

    const target2 = {
      user1_id: req.params.user2_id,
      user2_id: req.params.user1_id,
    };
    const existingChat = await lib.getChatByAttrib(db, target1, target2);
    // add the new message to the existing chat
    existingChat.message.push(req.body.newMessage);
    const result = await lib.updateChatByAttrib(db, target1, target2, req.body.lastupdated_date, existingChat.message);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// webapp.put('/api/chats/user1/:user1_id/user2/:user2_id/chatswithfile', upload.single('file'), async (req, res) => {
//   // console.log('update existed chat');
//   try {
//     console.log('Make a chat with file!');
//     console.log('req.body is', req.body);
//     console.log('now req.file in gfs is', req.file);
//     console.log('req.file.id in gfs is', req.file.id);
//     // console.log('Update an exisiting chat');
//     if (req.params.user1_id === undefined || req.params.user2_id === undefined) {
//       // console.log('missing params');
//       res.status(404).json({ error: 'Missing two users id' });
//       return;
//     }
//     const target1 = {
//       user1_id: req.params.user1_id,
//       user2_id: req.params.user2_id,
//     };

//     const target2 = {
//       user1_id: req.params.user2_id,
//       user2_id: req.params.user1_id,
//     };
//     const existingChat = await lib.getChatByAttrib(db, target1, target2);
//     // add the new message to the existing chat
//     const newMessageInfo = {};
//     newMessageInfo.from = req.body.from;
//     newMessageInfo.to = req.body.to;
//     newMessageInfo.created_date = req.body.created_date;
//     newMessageInfo.content = req.body.content;
//     newMessageInfo.attachment_id = req.file.filename;
//     newMessageInfo.attachment_type = req.body.attachment_type;

//     existingChat.message.push(newMessageInfo);
//     const result = await lib.updateChatByAttrib(db, target1, target2, req.body.created_date, existingChat.message);
//     res.status(200).json({ data: result });
//   } catch (err) {
//     res.status(404).json({ error: err.message });
//   }
// });

// deploy
webapp.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

// Default response for any other request
webapp.use((_req, res) => {
  res.status(404);
});

module.exports = webapp; // for testing
