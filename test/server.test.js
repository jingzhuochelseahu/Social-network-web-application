/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
const request = require('supertest');
// Import database operations
const { ObjectId } = require('mongodb');
const dbLib = require('../dbOperationsMongo');
const webapp = require('../server');
const profiles = require('../profiles');
// correct url
const { url1 } = profiles.url1;

let db;
const clearDatabaseUser = async (name) => {
  try {
    const result = await db.collection('users').deleteOne({ username: name });
    const { deletedCount } = result;
    if (deletedCount === 1) {
      console.log('info', 'Successfully deleted a test user');
    } else {
      console.log('warning', 'Test user was not deleted');
    }
  } catch (err) {
    console.log('error', err.message);
  }
};
const clearDatabaseGroup = async (name) => {
  try {
    const result = await db.collection('groups').deleteOne({ name });
    const { deletedCount } = result;
    if (deletedCount === 1) {
      console.log('info', 'Successfully deleted a test group');
    } else {
      console.log('warning', 'Test group was not deleted');
    }
  } catch (err) {
    console.log('error', err.message);
  }
};

const clearDatabasePost = async (text_content) => {
  try {
    const result = await db.collection('posts').deleteMany({ text_content });
    const { deletedCount } = result;
    if (deletedCount === 1) {
      console.log('info', 'Successfully deleted a test post');
    } else {
      console.log('warning', 'Test post was not deleted');
    }
  } catch (err) {
    console.log('error', err.message);
  }
};

const clearDatabaseRequest = async (name) => {
  try {
    const result = await db.collection('requests').deleteMany({ username: name });
    const { deletedCount } = result;
    if (deletedCount === 1) {
      console.log('info', 'Successfully deleted a test request');
    } else {
      console.log('warning', 'Test request not deleted');
    }
  } catch (err) {
    console.log('error', err.message);
  }
};

const clearDatabaseInvite = async (groupname) => {
  try {
    const result = await db.collection('invites').deleteMany({ groupname });
    const { deletedCount } = result;
    if (deletedCount === 1) {
      console.log('info', 'Successfully deleted a test invite');
    } else {
      console.log('warning', 'Test invite not deleted');
    }
  } catch (err) {
    console.log('error', err.message);
  }
};

beforeAll(async () => {
  db = await dbLib.connect(url1);
  // db = await dbLib.connect();
  await clearDatabaseUser('testA');
  await clearDatabaseUser('testB');
  await clearDatabaseUser('testChatUser1');
  await clearDatabaseGroup('groupA');
  await clearDatabaseGroup('groupB');
  await clearDatabaseGroup('groupC');
  await clearDatabasePost('happy &&& cis557');
  await clearDatabasePost('happy &&& cs');
  await clearDatabasePost('happy &&& ReactJS');
  await clearDatabaseRequest('testRequestUser1');
  await clearDatabaseInvite('testInviteGroup');
  // await clearDatabaseUser('testuser2');
  // await clearDatabaseUser('testuser3');
});

// // afterEach(async () => {
// //   await clearDatabaseUser('testuser');
// // });

afterAll(async () => {
  await clearDatabaseUser('testA');
  await clearDatabaseUser('testB');
  await clearDatabaseUser('testChatUser1');
  await clearDatabaseGroup('groupA');
  await clearDatabaseGroup('groupB');
  await clearDatabaseGroup('groupC');
  await clearDatabasePost('happy &&& cis557');
  await clearDatabasePost('happy &&& cs');
  await clearDatabasePost('happy &&& ReactJS');
  await clearDatabaseRequest('testRequestUser1');
  await clearDatabaseInvite('testInviteGroup');
  // await clearDatabaseUser('testuser5');
});

/* --------------------Users-----------------------*/
const testUserA = {
  fullname: 'Test UserA',
  username: 'testA',
  email: 'testA@gmail.com',
  password: '$2a$10$Psr396HnQpeJuYDQw1sVuuMeSRfLttFa/EaGJeTn2b2h8axv4JTP6',
  profile_image: '',
  chats: [],
  public_groups: [],
  private_groups: [],
  posts: [],
  registration_date: new Date().toLocaleString('en-US'),
};

let userAid;
let chatUser1Id;
let chat1Id;
let chat2Id;

describe('Register a user + Get a user by name + Get all users: endpoint API & integration tests', () => {
  test('Register a user: Status code and response when missing username or email or fullname or password', () => request(webapp).post('/api/registration').send({
    username: 'testA',
    fullname: 'Test UserA',
    password: 'cis557',
  })
    .expect(404) // testing the response status code
    .then((response) => {
      expect(JSON.parse(response.text).error).toBe('Missing user params!');
    }));

  test('Register a user: Endpoint status code and response on success', () => request(webapp).post('/api/registration/').send({
    username: 'testA',
    fullname: 'Test UserA',
    password: 'cis557',
    email: 'testA@gmail.com',
  })
    .expect(201) // created
    .then((res) => {
      // expect(JSON.parse(response.text).data).toMatchObject(testPlayer4);
      const user = JSON.parse(res.text).data;
      // ensure an id string is returned as data!
      expect(user).not.toBeUndefined();
      expect(user).not.toEqual(null);
      // expect(user.username).not.toEqual(null); // true, undefined means not.toEqual(null)
      // expect(user.username).toBeUndefined(); // true, undefined
      // expect(user.username).not.toBeNull(); // true, undefined means not.toBeNull
      // expect(user.username).not.toBe(null); // true, undeined means not.toBe(null)
      // to.have.property('username', 'testA');
    }));

  test('Register a user: Status code and response when username already exists', () => request(webapp).post('/api/registration').send({
    username: 'testA',
    fullname: 'Test UserA',
    password: 'cis557',
    email: 'testA@gmail.com',
  })
    .expect(409) // conflict
    .then((res) => {
      expect(JSON.parse(res.text).error).toBe('This username is already registered!');
    })
    .then(async () => {
      await clearDatabaseUser('testA');
    }));

  test('Register a user: The new user is now in the database', () => request(webapp).post('/api/registration').send({
    username: 'testA',
    fullname: 'Test UserA',
    password: 'cis557',
    email: 'testA@gmail.com',
  })
    .expect(201)
    .then(async () => {
      const insertedUser = await db.collection('users').findOne({ username: 'testA' });
      expect(insertedUser.fullname).toEqual('Test UserA');
      userAid = insertedUser._id;
    }));

  test('Register a user whose email already exists: Status code and response on error', () => request(webapp).post('/api/registration').send({
    username: 'testA2',
    fullname: 'Test UserA2',
    password: 'cis557',
    email: 'testA@gmail.com',
  })
    .expect(409)
    .then((res) => {
      expect(JSON.parse(res.text).error).toBe('This email is already registered!');
    }));

  test('Get all users: Endpoint status code and response on success', () => {
    request(webapp).get('/api/users/')
      .expect(200)
      .then((res) => {
        const users = JSON.parse(res.text).data;
        // add _id and delete password for this test user
        testUserA._id = userAid;
        delete testUserA.password;
        // expect(users).toContainEqual(testUserA);
        // expect(users).toEqual(expect.objectContaining(testUserA));
        // expect(users).toEqual(expect.arrayContaining([testUserA]));
        // expect(users).toBeCalledWith(expect.objectContaining(testUserA));
        expect(users).toEqual(expect.arrayContaining([expect.objectContaining({ username: 'testA' })]));
      });
  });

  test('Get a user by id: Status code and response on succes with an existent id', () => {
    request(webapp).get(`/api/users/${userAid}`)
      .expect(200)
      .then((res) => {
        const user = JSON.parse(res.text).data;
        // expect(user).to.have.property('username', 'testA');
        // ensure an id string is returned as data!
        expect(user).not.toBeUndefined();
        expect(user).not.toEqual(null);
      });
  });

  test('Get a user by id: Status code and response on error with an id not in db', () => request(webapp).get('/api/users/fakeidfakeid')
    .expect(404) // testing the response status code
    .then((res) => {
      expect(JSON.parse(res.text).error).toBe('No such user id!');
    }));

  test('Get a user by username: Status code and response when username is not in db', () => {
    request(webapp).get('/api/users/name/nosuchusername')
      .expect(404)
      .then((res) => {
        expect(JSON.parse(res.text).error).toBe('No such user name!');
      });
  });

  test('Get a user by username: Status code and response on succes with an existent username', () => {
    request(webapp).get('/api/users/name/testA')
      .expect(200)
      .then((res) => {
        const user = JSON.parse(res.text).data;
        // ensure an id string is returned as data!
        expect(user).not.toBeUndefined();
        expect(user).not.toEqual(null);
      });
  });
});

describe('Login a user: endpoint API & integration tests', () => {
  // test('Update a user: Status code and response when missing username', async () => {
  //   const insertedUser = await db.collection('users').findOne({ username: 'testA' });
  //   expect(insertedUser.fullname).toEqual('Test UserA');
  // });

  // testA should be in db now
  test('Login a user: Status code and response when missing password', () => {
    request(webapp).post('/api/login').send({
      username: 'testA',
    })
      .expect(404)
      .then((res) => {
        expect(JSON.parse(res.text).error).toBe('Missing username or password!');
      });
  });

  test('Login a user: Status code and response when username is not in db', () => {
    request(webapp).post('/api/login').send({
      username: 'impossible',
      password: 'impossible',
    })
      .expect(404)
      .then((res) => {
        expect(JSON.parse(res.text).error).toBe('Incorrect password or username!');
      });
  });

  test('Login a user: Status code and response on succes with an existent id', () => {
    request(webapp).post('/api/login').send({
      username: 'testA',
      password: 'cis557',
    })
      .expect(200)
      .then((res) => {
        const user = JSON.parse(res.text).data;
        // ensure an id string is returned as data!
        expect(user).not.toBeUndefined();
        expect(user).not.toEqual(null);
      });
  });

  // test 3 log in failures
  test('Login a user: Status code and response on error with wrong password, attemp 1', () => {
    request(webapp).post('/api/login').send({
      username: 'testA',
      password: 'wrongpsw',
    })
      .expect(401)
      .then((res) => {
        expect(JSON.parse(res.text).error).toBe('Incorrect password or username!');
      });
  });
  // TODO, not working since the aysnc calls executed in diff orders
  // test('Login a user: Status code and response on error with wrong password, attemp 2', () => {
  //   request(webapp).post('/api/login').send('username=testA&password=wrongpsw')
  //     .expect(401)
  //     .then((res) => {
  //       expect(JSON.parse(res.text).error).toBe('Incorrect password or username!');
  //     });
  // });
  // test('Login a user: Status code and response on error with wrong password, attemp 3', () => {
  //   request(webapp).post('/api/login').send('username=testA&password=wrongpsw')
  //     .expect(401)
  //     .then((res) => {
  //       expect(JSON.parse(res.text).error).toBe('Too many failed attempts! Account is locked for 1 hour!');
  //     });
  // });
});

describe('Update a user: endpoint API & integration tests', () => {
  const g = ['61b41b776b928e3fa000d1de'];
  test('Update a user with id: Endpoint status code and response when id not in db', () => request(webapp).put('/api/users/fakeidfakeid').send({
    public_groups: g,
  })
    .expect(404)
    .then(async (res) => {
      expect(JSON.parse(res.text).error).toBe('User does not exist!');
    }));

  test('Update a user with id: Endpoint status code and db change on success', () => request(webapp).put(`/api/users/${userAid}`).send({
    public_groups: g,
  })
    .expect(200)
    .then(async (res) => {
      expect(JSON.parse(res.text).data.modifiedCount).toBe(1);
      const updatedUser = await db.collection('users').findOne({ username: 'testA' });
      console.log(updatedUser.public_groups);
      // eslint-disable-next-line no-useless-escape
      expect(updatedUser.public_groups).toEqual(g);
    }));

  test('Update a user password with id: Endpoint status code and response on success', () => request(webapp).put(`/api/users/${userAid}`).send({
    password: 'cis557',
  })
    .expect(200)
    .then(async (res) => {
      expect(JSON.parse(res.text).data.modifiedCount).toBe(1);
    }));
});

describe('Delete a user: endpoint API & integration tests', () => {
  //   test('Delete a user: Status code and response with no such user id', () => request(webapp).delete('/api/user/61a1126d45c08c860d75d61f')
  //     .expect(404) // testing the response status code
  //     .then((response) => {
  //       expect(JSON.parse(response.text).error).toBe('No such user id');
  //     }));

  // the user is already in db, delete it and it should be removed from db
  test('Delete a user: Endpoint status code and response on success', async () => request(webapp).delete(`/api/users/${userAid}`)
    .expect(200)
    .then(async () => {
      const deletedUser = await db.collection('users').findOne({ username: 'testA' });
      expect(deletedUser).toBeNull();
    }));
});

/* --------------------Groups-----------------------*/
const testGroupA = {
  name: 'groupA',
  public: 1,
  tags: ['fake', 'test'],
  profile_image: '',
  administrators: [userAid],
  members: [userAid],
  created_date: new Date().toLocaleString('en-US'),
  requests: [],
};

const testGroupB = {
  name: 'groupB',
  public: 1,
  tags: ['fake', 'test'],
  profile_image: '',
  administrators: [userAid],
  members: [userAid],
  created_date: new Date().toLocaleString('en-US'),
  requests: [],
};

let groupAid;
let groupBid;
describe('Create a group + Get a group by id + Get all groups: endpoint API & integration tests', () => {
  test('Create a group: Status code and response when missing params', () => request(webapp).post('/api/group').send({
    groupname: 'groupA',
    public: 1,
  })
    .expect(404)
    .then((res) => {
      expect(JSON.parse(res.text).error).toBe('Missing groupname, public type or userid!');
    }));

  test('Create a group: Endpoint status code, response and db change on success', () => request(webapp).post('/api/group').send({
    groupname: 'groupA',
    public: 1,
    userId: userAid,
  })
    .expect(201) // created
    .then(async (res) => {
      const group = JSON.parse(res.text).data;
      // ensure an id string is returned as data!
      expect(group).not.toBeUndefined();
      expect(group).not.toEqual(null);
      // check in db
      const insertedGroup = await db.collection('groups').findOne({ name: 'groupA' });
      expect(insertedGroup.public).toEqual(1);
      groupAid = insertedGroup._id;
    }));

  test('Create a group: Status code and response when groupname already exists', () => request(webapp).post('/api/group').send({
    groupname: 'groupA',
    public: 1,
    userId: userAid,
  })
    .expect(409) // conflict
    .then((res) => {
      expect(JSON.parse(res.text).error).toBe('Group name already exists!');
    }));

  test('Get a group by id: Status code and response on succes with an existent id', () => {
    request(webapp).get(`/api/groups/${groupAid}`)
      .expect(200)
      .then((res) => {
        const group = JSON.parse(res.text).data;
        // ensure an id string is returned as data!
        expect(group).not.toBeUndefined();
        expect(group).not.toEqual(null);
      });
  });

  test('Get all groups: Endpoint status code and response on success', () => {
    request(webapp).get('/api/groups')
      .expect(200)
      .then((res) => {
        const groups = JSON.parse(res.text).data;
        // expect the newly added groupA is in it
        expect(groups).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'groupA' })]));
      });
  });
});

describe('Update a group: endpoint API & integration tests', () => {
  const newMembers = ['32b795d69926e08618b81123', '61b795d69926e08618b81193'];
  test('Update a group with id: Endpoint status code and db change on success', () => request(webapp).put(`/api/groups/${groupAid}`).send({ members: newMembers })
    .expect(200)
    .then(async (res) => {
      expect(JSON.parse(res.text).data.modifiedCount).toBe(1);
      const updatedGroup = await db.collection('groups').findOne({ name: 'groupA' });
      expect(updatedGroup.members).toEqual(newMembers);
    }));
});

// compares 2 dates
function isLater(str1, str2) {
  return new Date(str1) > new Date(str2);
}

describe('Sort groups prepare: endpoint API & integration tests', () => {
  // add another group first
  test('Create another group: The new group is in the database', () => request(webapp).post('/api/group').send({
    groupname: 'groupB',
    public: 1,
    userId: userAid,
  })
    .expect(201)
    .then(async (res) => {
      const group = JSON.parse(res.text).data;
      // ensure an id string is returned as data!
      expect(group).not.toBeUndefined();
      expect(group).not.toEqual(null);
      // check in db
      const insertedGroup = await db.collection('groups').findOne({ name: 'groupB' });
      expect(insertedGroup.public).toEqual(1);
      groupBid = insertedGroup._id;
    }));

  test('Sort groups by nummembers in descending order: Should return groupA before groupB ', () => request(webapp).get('/api/groups/sort/nummembers/-1')
    .expect(200)
    .then((res) => {
      const arr = JSON.parse(res.text).data;
      // a should appear before b
      let aidx;
      let bidx;
      for (let i = 0; i < arr.length; i += 1) {
        if (arr[i].groupname === 'groupA') aidx = i;
        if (arr[i].groupname === 'groupB') bidx = i;
      }
      expect(bidx).toBeGreaterThan(aidx);
    }));

  test('Sort groups by numposts in asc order: Should return correct order ', () => request(webapp).get('/api/groups/sort/numposts/1')
    .expect(200)
    .then((res) => {
      const arr = JSON.parse(res.text).data;
      if (arr[1].countPosts !== arr[0].countPosts) { expect(arr[1].countPosts).toBeGreaterThan(arr[0].countPosts); }
    }));

  test('Sort groups by newpost in asc order: Should return correct order ', () => request(webapp).get('/api/groups/sort/newpost/1')
    .expect(200)
    .then((res) => {
      const arr = JSON.parse(res.text).data;
      const t1 = arr[1].newestPost;
      const t0 = arr[0].newestPost;
      if (t1 !== t0) { expect(isLater(t1, t0)).toBeTruthy(); }
    }));
});

describe('Create a post without filte + update a post + get all flagged posts: endpoint API & integration tests', () => {
  let postId;
  // add another group first
  test('Create another group: The new group is in the database', () => request(webapp).post('/api/group').send({
    groupname: 'groupC',
    public: 1,
    userId: userAid,
  })
    .expect(201)
    .then(async (res) => {
      const group = JSON.parse(res.text).data;
      // ensure an id string is returned as data!
      expect(group).not.toBeUndefined();
      expect(group).not.toEqual(null);
      // check in db
      const insertedGroup = await db.collection('groups').findOne({ name: 'groupC' });
      expect(insertedGroup.public).toEqual(1);
      postGroupId = insertedGroup._id;
    }));

  // test('Create a post: Endpoint status code and missing params', () => request(webapp).post('/api/groups/posts').send({
  //   userid: userAid,
  //   test_content: 'happy everyday',
  // })
  //   .expect(404)
  //   .then((res) => {
  //     expect(JSON.parse(res.text).error).toBe('Missing group id!');
  //   }));

  test('Create a post: Endpoint status code and missing user id', () => request(webapp).post(`/api/groups/${postGroupId}/posts`).send({
    group_id: postGroupId,
    test_content: 'in test post, test create post',
  })
    .expect(404)
    .then((res) => {
      expect(JSON.parse(res.text).error).toBe('Missing userid or content(or attachment)');
    }));

  test('Create a post: Endpoint status code and missing user id', () => request(webapp).post(`/api/groups/${postGroupId}/posts`).send({
    userid: userAid,
    text: 'happy &&& cis557',
  })
    .expect(200)
    .then(async (res) => {
      const newPost = JSON.parse(res.text).data;
      // ensure an id string is returned as data!
      expect(newPost).not.toBeUndefined();
      expect(newPost).not.toEqual(null);
      // check in db
      const insertedPost = await db.collection('posts').findOne({ text_content: 'happy &&& cis557' });
      expect(insertedPost.text_content).toEqual('happy &&& cis557');
      postId = insertedPost._id;
    }));

  const fakeId = '61b2b44a421f6d19db657f58';
  // test('Update a post: Endpoint status code and missing post id', () => request(webapp).put(`/api/posts/${fakeId}`).send({
  //   flag: 1,
  //   hider: userAid,
  // })
  //   .expect(404)
  //   .then((res) => {
  //     expect(JSON.parse(res.text).error).toBe('Missing post id!');
  //   }));

  test('Update a post: Endpoint status code and invalid post id', () => request(webapp).put(`/api/posts/${fakeId}`).send({
    flag: 1,
    hider: userAid,
  })
    .expect(404)
    .then((res) => {
      expect(JSON.parse(res.text).error).toBe('No such post id!');
    }));

  test('Update a post: Endpoint status code and flag a post', () => request(webapp).put(`/api/posts/${postId}`).send({
    flag: 1,
    flagger: userAid,
  })
    .expect(200)
    .then(async (res) => {
      expect(JSON.parse(res.text).data.modifiedCount).toEqual(1);
      const flaggedPost = await db.collection('posts').findOne({ _id: ObjectId(postId) });
      expect(flaggedPost.flag).toEqual(1);
      expect(JSON.stringify(flaggedPost.flagger)).toBe(JSON.stringify(userAid));
    }));

  test('Get all the flagged posts: Endpoint status code and get all flagged posts', () => request(webapp).get(`/api/groups/${postGroupId}/flaggedposts`)
    .expect(200)
    .then((res) => {
      const allFlaggedPosts = JSON.parse(res.text).data;
      expect(allFlaggedPosts).not.toEqual(null);
      // console.log('^^^^^^^^^^^^^^^^^^^^^^^ all flag posts', allFlaggedPosts);
    }));

  test('Update a post: Endpoint status code and unflag a post', () => request(webapp).put(`/api/posts/${postId}`).send({
    flag: 0,
  })
    .expect(200)
    .then(async (res) => {
      expect(JSON.parse(res.text).data.modifiedCount).toEqual(1);
      const unflaggedPost = await db.collection('posts').findOne({ _id: ObjectId(postId) });
      expect(unflaggedPost.flag).toEqual(0);
      expect(JSON.stringify(unflaggedPost.flagger)).toBe(JSON.stringify(''));
    }));

  test('Update a post: Endpoint status code and add a comment to a post', () => request(webapp).put(`/api/posts/${postId}`).send({
    type: 'add',
    comment: 'nice',
  })
    .expect(200)
    .then(async (res) => {
      expect(JSON.parse(res.text).data.modifiedCount).toEqual(1);
      const updatedPost = await db.collection('posts').findOne({ _id: ObjectId(postId) });
      expect(updatedPost.comments).toEqual(['nice']);
    }));

  test('Add another comment', () => request(webapp).put(`/api/posts/${postId}`).send({
    type: 'add',
    comment: 'good',
  })
    .expect(200)
    .then(async (res) => {
      expect(JSON.parse(res.text).data.modifiedCount).toEqual(1);
      const updatedPost = await db.collection('posts').findOne({ _id: ObjectId(postId) });
      expect(updatedPost.comments).toEqual(['nice', 'good']);
    }));

  test('Update a post: Endpoint status code and delete a comment to a post', () => request(webapp).put(`/api/posts/${postId}`).send({
    type: 'delete',
    comment: 'nice',
  })
    .expect(200)
    .then(async (res) => {
      expect(JSON.parse(res.text).data.modifiedCount).toEqual(1);
      const updatedPost = await db.collection('posts').findOne({ _id: ObjectId(postId) });
      expect(updatedPost.comments).toEqual(['good']);
    }));

  test('Update a post: Endpoint status code and edit a comment to a post', () => request(webapp).put(`/api/posts/${postId}`).send({
    type: 'edit',
    oldComment: 'good',
    newComment: 'nice post',
  })
    .expect(200)
    .then(async (res) => {
      expect(JSON.parse(res.text).data.modifiedCount).toEqual(1);
      const updatedPost = await db.collection('posts').findOne({ _id: ObjectId(postId) });
      expect(updatedPost.comments).toEqual(['nice post']);
    }));

  test('Update a post: Endpoint status code and hide a post', () => request(webapp).put(`/api/posts/${postId}`).send({
    type: 'hide',
    hider: userAid,
  })
    .expect(200)
    .then((res) => {
      expect(JSON.parse(res.text).data.modifiedCount).toEqual(1);
    }));
});

describe('Get all posts + get post by id: endpoint API & integration tests', () => {
  let postId2;
  let postId3;
  test('Create another post in groupC', () => request(webapp).post(`/api/groups/${postGroupId}/posts`).send({
    userid: userAid,
    text: 'happy &&& reactJS',
  })
    .expect(200)
    .then(async (res) => {
      const newPost = JSON.parse(res.text).data;
      expect(newPost).not.toBeUndefined();
      expect(newPost).not.toEqual(null);
      const insertedPost = await db.collection('posts').findOne({ text_content: 'happy &&& reactJS' });
      expect(insertedPost.text_content).toEqual('happy &&& reactJS');
      postId2 = insertedPost._id;
    }));

  test('Get a post by id: Endpoint status code', () => request(webapp).get(`/api/posts/${postId2}`)
    .expect(200)
    .then((res) => {
      const post = JSON.parse(res.text).data;
      expect(post).not.toBeUndefined();
      expect(post).not.toEqual(null);
      expect(post.text_content).toEqual('happy &&& reactJS');
      console.log('*************** existed post is', post);
    }));

  test('Create another post in groupA', () => request(webapp).post(`/api/groups/${groupAid}/posts`).send({
    userid: userAid,
    text: 'happy &&& cs',
  })
    .expect(200)
    .then(async (res) => {
      const newPost = JSON.parse(res.text).data;
      // ensure an id string is returned as data!
      expect(newPost).not.toBeUndefined();
      expect(newPost).not.toEqual(null);
      // check in db
      const insertedPost = await db.collection('posts').findOne({ text_content: 'happy &&& cs' });
      expect(insertedPost.text_content).toEqual('happy &&& cs');
      postId3 = insertedPost._id;
    }));

  test('Get all posts in db: Endpoint status code', () => request(webapp).get('/api/posts')
    .expect(200)
    .then((res) => {
      const allPosts = JSON.parse(res.text).data;
      // expect(JSON.parse(res.text).data.length).toEqual(3);
      expect(allPosts).toEqual(expect.arrayContaining([expect.objectContaining({ text_content: 'happy &&& cis557' })]));
      expect(allPosts).toEqual(expect.arrayContaining([expect.objectContaining({ text_content: 'happy &&& cs' })]));
      expect(allPosts).toEqual(expect.arrayContaining([expect.objectContaining({ text_content: 'happy &&& reactJS' })]));
    }));

  test('Get all posts in groupC: Endpoint status code', () => request(webapp).get(`/api/groups/${postGroupId}/posts`)
    .expect(200)
    .then((res) => {
      expect(JSON.parse(res.text).data.length).toEqual(2);
      expect(JSON.parse(res.text).data[0].text_content).toEqual('happy &&& cis557');
      expect(JSON.parse(res.text).data[1].text_content).toEqual('happy &&& reactJS');
    }));
});

describe('Delete a post: endpoint API & integration tests', () => {
  let newPostId;
  test('Create another post in GroupC', () => request(webapp).post(`/api/groups/${postGroupId}/posts`).send({
    userid: userAid,
    text: 'happy &&& everyday',
  })
    .expect(200)
    .then(async (res) => {
      const newPost = JSON.parse(res.text).data;
      // ensure an id string is returned as data!
      expect(newPost).not.toBeUndefined();
      expect(newPost).not.toEqual(null);
      // check in db
      const insertedPost = await db.collection('posts').findOne({ text_content: 'happy &&& everyday' });
      expect(insertedPost.text_content).toEqual('happy &&& everyday');
      newPostId = insertedPost._id;
    }));

  test('Delete a post: Endpoint status code and delete a post', () => request(webapp).delete(`/api/posts/${newPostId}`)
    .expect(200)
    .then(async (res) => {
      expect(JSON.parse(res.text).data.deletedCount).toEqual(1);
      const deletedPost = await db.collection('posts').findOne({ _id: ObjectId(newPostId) });
      expect(deletedPost).toEqual(null);
    }));
});

describe('Create a new chat: endpoint API & integration tests', () => {
  test('Register another user: testB', () => request(webapp).post('/api/registration').send({
    username: 'testChatUser1',
    fullname: 'Test Chat',
    password: 'cis557',
    email: 'testB@gmail.com',
  })
    .expect(201)
    .then(async () => {
      const insertedUser = await db.collection('users').findOne({ username: 'testChatUser1' });
      expect(insertedUser.fullname).toEqual('Test Chat');
      chatUser1Id = insertedUser._id;
    }));

  test('Create a new chat without two users ids: Endpoint status code', () => request(webapp).post('/api/chats').send({
    message: [{ message_content: 'happy' }],
  })
    .expect(404)
    .then((res) => {
      expect(JSON.parse(res.text).error).toBe('Missing two users ids');
    }));

  test('Create a new chat successfully: Endpoint status code and start a new chat', () => request(webapp).post('/api/chats').send({
    user1_id: userAid,
    user2_id: chatUser1Id,
    message: {
      from: userAid,
      to: chatUser1Id,
      created_date: new Date().toLocaleString('en-US'),
      content: 'happy chat',
    },
  })
    .expect(201)
    .then(async (res) => {
      chat1Id = JSON.parse(res.text).data;
      const insertedChat = await db.collection('chats').findOne({ _id: ObjectId(chat1Id) });
      expect(insertedChat.message[0].content).toEqual('happy chat');
    }));

  test('Create a new chat with conflict error: Endpoint status code', () => request(webapp).post('/api/chats').send({
    user1_id: userAid,
    user2_id: chatUser1Id,
  })
    .expect(409)
    .then((res) => {
      expect(JSON.parse(res.text).error).toBe('Chat is already existed!');
    }));
});

describe('Create all chats && get all chats by two user ids + update chats by two user ids: endpoint API & integration tests', () => {
  test('Get all chats: Endpoint status code', () => request(webapp).get('/api/chats')
    .expect(200)
    .then((res) => {
      const allChats = JSON.parse(res.text).data;
      expect(allChats).not.toEqual(null);
      expect(allChats).not.toEqual([]);
    }));

  test('Get all chats by two user ids: Endpoint status code', () => request(webapp).get(`/api/chats/user1/${userAid}/user2/${chatUser1Id}`)
    .expect(200)
    .then((res) => {
      const chatsByTwoUsers = JSON.parse(res.text).data;
      expect(chatsByTwoUsers.message[0].content).toEqual('happy chat');
    }));

  test('Update the chat by two user ids: Endpoint status code', () => request(webapp).put(`/api/chats/user1/${userAid}/user2/${chatUser1Id}`).send({
    lastupdated_date: new Date().toLocaleString('en-US'),
    newMessage: {
      from: chatUser1Id,
      to: userAid,
      created_date: new Date().toLocaleString('en-US'),
      content: 'nice weather',
    },
  })
    .expect(200)
    .then(async (res) => {
      expect(JSON.parse(res.text).data.modifiedCount).toEqual(1);
      const target1 = { user1_id: userAid, user2_id: chatUser1Id };
      const target2 = { user1_id: chatUser1Id, user2_id: userAid };
      const updatedChat = await db.collection('chats').find({ $or: [target1, target2] });
      expect(updatedChat).not.toEqual(null);
    }));
});

describe('Make a request to join a group && get all requests && get a request in a specific group && delete a request: endpoint API & integration tests', () => {
  let requestId1;
  test('Make a request to join a group with missing body parameters: Endpoint status code', () => request(webapp).post('/api/requests').send({
    userId: userAid,
    groupId: groupAid,
  })
    .expect(404)
    .then((res) => {
      expect(JSON.parse(res.text).error).toBe('Missing parameters');
    }));

  test('Make a request to join a group: Endpoint status code', () => request(webapp).post('/api/requests').send({
    userId: userAid,
    groupId: groupAid,
    username: 'testRequestUser1',
  })
    .expect(201)
    .then(async (res) => {
      const requestId = JSON.parse(res.text).data;
      const newRequest = await db.collection('requests').findOne({ _id: ObjectId(requestId) });
      expect(newRequest.username).toEqual('testRequestUser1');
      requestId1 = newRequest._id;
    }));

  test('Get all request: Endpoint status code', () => request(webapp).get('/api/requests')
    .expect(200)
    .then(async (res) => {
      const insertedRequest = JSON.parse(res.text).data;
      expect(insertedRequest).not.toBeUndefined();
      expect(insertedRequest).not.toEqual(null);
      const newRequest = await db.collection('requests').findOne({ username: 'testRequestUser1' });
      expect(newRequest).not.toEqual(null);
    }));

  test('Get all request in a specific group: Endpoint status code', () => request(webapp).get(`/api/requests/groupId/${groupAid}`)
    .expect(200)
    .then((res) => {
      const insertedRequest = JSON.parse(res.text).data;
      expect(insertedRequest).not.toBeUndefined();
      expect(insertedRequest).not.toEqual(null);
    }));

  test('Delete a specific request: Endpoint status code', () => request(webapp).delete(`/api/requests/${requestId1}`)
    .expect(200)
    .then(async (res) => {
      expect(JSON.parse(res.text).data.deletedCount).toEqual(1);
      const deletedRequest = await db.collection('requests').findOne({ username: 'testRequestUser1' });
      expect(deletedRequest).toEqual(null);
    }));
});

describe('Create an invite && get all invites && get a specific invite && delete an invite: endpoint API & integration tests', () => {
  let inviteId1;
  test('Make an invite with missing body parameters: Endpoint status code', () => request(webapp).post('/api/invites').send({
    groupId: groupAid,
  })
    .expect(404)
    .then((res) => {
      expect(JSON.parse(res.text).error).toBe('Missing parameters');
    }));

  test('Make an invite successfully: Endpoint status code', () => request(webapp).post('/api/invites').send({
    invitedId: 'invited123',
    invitingId: 'inviting123',
    groupId: groupAid,
    groupname: 'testInviteGroup',
  })
    .expect(201)
    .then(async (res) => {
      const inviteId = JSON.parse(res.text).data;
      expect(inviteId).not.toEqual(null);
      const newInvite = await db.collection('invites').findOne({ groupname: 'testInviteGroup' });
      expect(newInvite.invitedId).toEqual('invited123');
      inviteId1 = newInvite._id;
    }));

  test('Get all invites: Endpoint status code', () => request(webapp).get('/api/invites')
    .expect(200)
    .then((res) => {
      const insertedInvite = JSON.parse(res.text).data;
      expect(insertedInvite).not.toBeUndefined();
      expect(insertedInvite).not.toEqual(null);
    }));

  test('Get an specific invite: Endpoint status code', () => request(webapp).get(`/api/invites/invitedId/${inviteId1}`)
    .expect(200)
    .then(async (res) => {
      const insertedInviteId = JSON.parse(res.text).data;
      expect(insertedInviteId).not.toEqual(null);
    }));

  test('Delete a specific request: Endpoint status code', () => request(webapp).delete(`/api/invites/${inviteId1}`)
    .expect(200)
    .then(async (res) => {
      expect(JSON.parse(res.text).data.deletedCount).toEqual(1);
      const deletedInvite = await db.collection('invites').findOne({ groupname: 'testInviteGroup' });
      expect(deletedInvite).toEqual(null);
    }));
});
