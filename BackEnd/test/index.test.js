const chai = require('chai')
const {should} = require('chai')

const chaiHttp = require('chai-http')
let server = require('../index')

should();

const expect = chai.expect

const baseUrl = "http://localhost:3000"

chai.use(chaiHttp);

describe("Getting all the description record", function(){
it('server is live', function(done) {
        chai.request(baseUrl)
        .get('/notes')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            res.body.should.be.an('array');
            done();
        });
    })
})

describe("Getting all the Balance record", function(){
    it('server is live', function(done) {
            chai.request(baseUrl)
            .get('/balance')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                res.body.should.be.an('array');
              //  res.body.should.have.property("username");
                done();
            });
        })
    })



describe("Deleting a record by userId", function(){
    it('server is live', function(done) {
                
            chai.request(baseUrl)
            .delete('/notes/121')
           // .send(data)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
        })
    })
describe("Inserting credit values to the wallet database", function(){
    it('server is live', function(done) {
        let data = {

            note:"test",
            amount:100,
            user:"dhilip",
            action:"credit",
            email:"deelepkumar.g@gmail.com"

        }
            chai.request(baseUrl)
            .post("/notes")
            .send(data)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                res.body.data.should.be.a('object');
                res.body.data.should.have.property('note');
                res.body.data.should.have.property('amount');
                res.body.data.should.have.property('username');
                res.body.data.should.have.property('action');
                res.body.data.should.have.property('email');
                
                done();
            });
        })
    })
describe("Trying to debit with insufficient balance from the wallet database", function(){
    it('server is live', function(done) {
        const data = {

            note:"test",
            amount:10000,
            user:"dhilip",
            action:"debit",
            email:"deelepkumar.g@gmail.com"

        }
            chai.request(baseUrl)
            .post("/notes")
            .send(data)
            .end(function (err, res) {
                expect(res).to.have.status(400);
                res.body.should.be.a('object');
               // res.msg.have.to.be.eql("insufficent balance")
                done();
            });
        })
    })
describe("Search by Notes filter", function(){
    it('server is live', function(done) {
            
            chai.request(baseUrl)
            .get("/notes/hi")
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
        })
    })