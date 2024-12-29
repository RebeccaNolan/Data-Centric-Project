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

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/home.html");
});
 
app.get('/students', (req, res) => {
    mySQL_DAO.getStudents()
    .then((students) => {
        res.render('students', { students });
    })
    .catch((error) => {
        res.send(error);
    });
});

app.get('/students/add', (req, res) => {
    res.render('addStudent');
    //res.render('index.js', {link: "http://localhost:3000/addStudent"})
});

app.post('/students/add', (req, res) => {
    mySQL_DAO.addStudent(req.body.sid, req.body.name, req.body.age)
        .then(() => {
            res.redirect('/students');
        })
        .catch((error) => {
            res.send('Error adding student: ' + error);
        });
});

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
 
app.get('/grades', (req, res) => {
    res.render('grades', { title: 'Grades Page', grades: [] });
});

app.get('/lecturers', (req, res) => {
    res.render('lecturers', { title: 'Lecturers Page', lecturers: [] });
});
