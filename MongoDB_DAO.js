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

    //get all lecturers
    var getLecturers = () => {
        return coll.find({}).sort({ _id: 1 }).toArray(); 
    };

    //delete lecturer if not associated with any modules
    var deleteLecturer = (lecturerID, associatedModules) => {
        return new Promise((resolve, reject) => {
            if(associatedModules.length > 0) {
                reject("can't delete")
            }else {
                coll.deleteOne({_id: lecturerID})
                .then(resolve)
                .catch(reject);
            }
        });
    };

    module.exports = {getLecturers, deleteLecturer}