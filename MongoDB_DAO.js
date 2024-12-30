var MongoClient = require('mongodb').MongoClient;

var db;
var coll;

// Connect to MongoDB and use the `proj2024MongoDB` database and `lecturers` collection
MongoClient.connect('mongodb://localhost:27017')
    .then((client) => {
        db = client.db('proj2024MongoDB'); // Switch to the `proj2024MongoDB` database
        coll = db.collection('lecturers'); // Access the `lecturers` collection
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Connection error:', error.message);
    });

    var getLecturers = () => {
        return coll.find({}).sort({ _id: 1 }).toArray(); 
    }

    var deleteLecturer = () => {
        return coll.deleteOne({ _id: lecturerId });
    }

    module.exports = {getLecturers, deleteLecturer}