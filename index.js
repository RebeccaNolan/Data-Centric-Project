var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}))

const { check, validationResult } = require('express-validator');

var ejs = require('ejs');
app.set('view engine', 'ejs');

var MongoDB_DAO = require('./MongoDB_DAO');
var mySQL_DAO = require('./mySQL_DAO');

app.listen(3004, () => {
    console.log("running on port 3004")
});

//Home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/home.html");
});
 
//Students page
app.get('/students', (req, res) => {
    mySQL_DAO.getStudents()
    .then((students) => {
        res.render('students', { students });
    })
    .catch((error) => {
        res.send(error);
    });
});

//ADD GET
app.get('/students/add', (req, res) => {
    res.render('addStudent');
    //res.render('index.js', {link: "http://localhost:3000/addStudent"})
});


//ADD POST 
app.post('/students/add', (req, res) => {
    mySQL_DAO.addStudent(req.body.sid, req.body.name, req.body.age)
        .then(() => {
            res.redirect('/students');
        })
        .catch((error) => {
            res.send('Error adding student: ' + error);
        });
});

//EDIT GET
app.get('/students/edit/:sid', (req, res) => {
    const sid = req.params.sid;
    mySQL_DAO.getStudents()
        .then((students) => {
            const student = students.find(s => s.sid === sid); // Find the student by ID
            if (student) {
                res.render('updateStudent', { student }); // Render updateStudent.ejs with the student
            } else {
                res.status(404).send('Student not found');
            }
        })
        .catch((error) => {
            console.error('Error fetching student:', error);
            res.status(500).send('Error fetching student');
        });
});

//EDIT POST
app.post('/students/edit/:sid', (req, res) => {
    const sid = req.params.sid;
    const { name, age } = req.body;
    mySQL_DAO.updateStudent(sid, name, age)
        .then(() => res.redirect('/students'))
        .catch((error) => {
            console.error('Error updating student:', error);
            res.status(500).send('Error updating student');
        });
});
 
//GRADES
app.get('/grades', (req, res) => {
    mySQL_DAO.getInfo()
    .then((grades) => {
        res.render('grades', {grades});
    })
    .catch((error) => {
        res.status(500).send("error");
    });
});

//LECTURERS
app.get('/lecturers', (req, res) => {
   MongoDB_DAO.getLecturers()
   .then((lecturers) => {
    res.render('lecturers', {lecturers});
   })
   .catch((error) => {
    res.status(500).send("error")
   });
});
