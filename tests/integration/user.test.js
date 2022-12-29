import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/index';

let token;
let noteid;
describe('User APIs Test', () => {
  before((done) => {
    const clearCollections = () => {
      for (const collection in mongoose.connection.collections) {
        mongoose.connection.collections[collection].deleteOne(() => { });
      }
    };

    const mongooseConnect = async () => {
      await mongoose.connect(process.env.DATABASE_TEST);
      clearCollections();
    };

    if (mongoose.connection.readyState === 0) {
      mongooseConnect();
    } else {
      clearCollections();
    }

    done();
  });


  // 1 test case
  describe('UserRegistration', () => {
    const input = {
      "firstName": "Gajananda",
      "lastName": "Rathod",
      "email": "gajanandarathod32@gmail.com",
      "password": "gaja1234"
    }
    it('Given user details should be saved in database', (done) => {
      request(app)
        .post('/api/v1/users/register')
        .send(input)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(201);
          done();
        });
    });
  });
  //2 test case for invalid details
  describe('UserRegistration for invalid details', () => {
    const input = {
      "firstName": "Gaja",
      "lastName": "R",
      "email": "gaj@gmail.com",
      "password": "1234"
    }
    it('Given user invalid details should thorw error', (done) => {
      request(app)
        .post('/api/v1/users/register')
        .send(input)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(500);
          done();
        });
    });
  });
  //3 test case
  describe('UserRegistration', () => {
    const input = {
      firstName: "ga",
      lastName: "Ak",
      email: "gaja@gmail.com",
      password: "reeta1234"
    }
    it('Given user details should be saved in database', (done) => {
      request(app)
        .post('/api/v1/users/register')
        .send(input)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(500);
          done();
        });
    });
  });

  //4 Test case for user login
  describe('Userlogin', () => {
    const input = {
      "email": "gajanandarathod32@gmail.com",
      "password": "gaja1234"
    }
    it('Given user login details should get logged into account', (done) => {
      request(app)
        .post('/api/v1/users/loginuser')
        .send(input)
        .end((err, res) => {
          token = res.body.data
          expect(res.statusCode).to.be.equal(200);
          done();
        });
    });
  });

  // 5 for invalid email

  describe('Userlogin', () => {
    const input = {
      "email": "gajananda@gmail.com",
      "password": "gaja1234"
    }
    it('Given user login details should get error as invalid emailid', (done) => {
      request(app)
        .post('/api/v1/users/loginuser')
        .send(input)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(500);
          done();
        });
    });
  });

  //6 for invalid password
  describe('Userlogin', () => {
    const input = {
      "email": "gajanandarathod32@gmail.com",
      "password": "gaja"
    }
    it('Given user login details should throw invalid password', (done) => {
      request(app)
        .post('/api/v1/users/loginuser')
        .send(input)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(500);
          done();
        });
    });
  });
  // 7 create new note 
  describe('Addnote', () => {
    const input = {
      "Title": "BridgeLabz",
      "descrption": "skill devoloping company",
      "colour": "blue",
      "isArchived": "false",
      "isTrashed": "false"
    }
    it('Given new note should save in database', (done) => {
      request(app)
        .post('/api/v1/notes/add')
        .set('Authorization', `Bearer ${token}`)
        .send(input)
        .end((err, res) => {
          noteid = res.body.data._id;
          expect(res.statusCode).to.be.equal(201);
          done();
        });
    });
  });


});






