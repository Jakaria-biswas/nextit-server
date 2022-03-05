const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { ObjectID } = require('bson');
require('dotenv').config()


const app = express();
app.use(bodyParser.json());
app.use(cors());


const port = 3400;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.me6u3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
// const uri = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // const collection = client.db("nextit_center").collection("info");
    const contactData = client.db("nextit_center").collection("contact-info");
    const courseInfo = client.db("nextit_center").collection("course-info");

    app.get('/getAllData', (req, res) => {
        courseInfo.find({})
            .toArray((error, documents) => {
                res.send(documents)
            })
    })
    app.get('/getSingleCourse/:courseId', (req, res) => {

        courseInfo.find({ _id: ObjectID(req.params.courseId) })
            .toArray((error, documents) => {
                res.send(documents[0])
            })
    })
    app.post('/addContactInfo', (req, res) => {

        const contactInfo = req.body;
        contactData.insertOne(contactInfo)
            .then(result => {
                res.send(result.acknowledged = true)
            })
        // console.log(contactInfo)
    });


    app.post('/addNewCourse', (req, res) => {

        const courseAddInfo = req.body;
        
        courseInfo.insertOne(courseAddInfo)
            .then(result => {
                res.send(result.acknowledged = true)
            })
    })
    app.delete('/deleteCourse/:id', (req, res) => {
        
        courseInfo.deleteOne({ _id: ObjectID(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })

    app.get('/update/:id', (req, res) => {

        courseInfo.find({ _id: ObjectID(req.params.id)})
        .toArray((error, documents) => {
            res.send(documents[0])
        })
    })

    // get contact message information 

    app.get('/getContactData', (req, res) => {
            
        contactData.find({})
        .toArray((error, documents) => {
               res.send(documents)
        })
    })
 // get contact single data 
   app.get('/showSingleContact/:id', (req,res) => {
         contactData.find({_id: ObjectID(req.params.id)})
         .toArray((error,document) => {
               res.send(document[0])
         })
         
   } )


   app.delete('/deleteContact/:id', (req, res) => {
          contactData.deleteOne({_id : ObjectID(req.params.id)})
          .then(result => {
                 res.send(result.deletedCount > 0)
          })
   })














































































































































});


app.get("/", (req, res) => {
    res.send("server ok")
})


app.listen(process.env.PORT || port)