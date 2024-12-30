var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}))

var { check, validationResult } = require('express-validator');

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
    res.render('addStudent', { errors: [], student: {} }); // Pass an empty errors array and student object initially

});


//ADD POST 
app.post('/students/add', (req, res) => {
    const { sid, name, age } = req.body;

    let errors = [];
    if (!sid || sid.length !== 4) {
        errors.push('Student ID should be 4 characters.');
    }
    if (!name || name.length < 2) {
        errors.push('Student Name should be at least 2 characters.');
    }
    if (!age || age < 18) {
        errors.push('Student Age should be at least 18.');
    }

    if (errors.length > 0) {
        // Render the form with error messages and the previously entered data
        res.render('addStudent', { errors, student: { sid, name, age } });
        return;
    }

    // check if Student ID already exists
    mySQL_DAO.getStudents()
        .then((students) => {
            const existingStudent = students.find((student) => student.sid === sid);
            if (existingStudent) {
                res.render('addStudent', {
                    errors: [`Student ID ${sid} already exists.`],
                    student: { sid, name, age },
                });
            } else {
                mySQL_DAO.addStudent(sid, name, age)
                    .then(() => res.redirect('/students'))
                    .catch((error) => res.status(500).send('Error adding student: ' + error));
            }
        })
        .catch((error) => res.status(500).send('Error fetching students: ' + error));
});


//EDIT GET
app.get('/students/edit/:sid', (req, res) => {
    const sid = req.params.sid;
    mySQL_DAO.getStudents()
        .then((students) => {
            const student = students.find(s => s.sid === sid); // Find the student by ID
            if (student) {
                res.render('updateStudent', { student, errors:[] }); // Render updateStudent.ejs with the student
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

    let errors = [];

    //validation
    if(name.length < 2) {
        errors.push('Student Name should be at least 2 characters');
    }
    if(age < 18) {
        errors.push('Student Age should be at least 18');
    }

    // render page again with errors
    if (errors.length > 0) {
        
        const student = { sid, name, age };
        res.render('updateStudent', { student, errors });
    } else {
        mySQL_DAO.updateStudent(sid, name, age)
            .then(() => res.redirect('/students'))
            .catch((error) => {
                console.error('Error updating student:', error);
                res.status(500).send('Error updating student');
            });
    }
});
 
//GRADES GET
app.get('/grades', (req, res) => {
    mySQL_DAO.getInfo()
    .then((grades) => {
        res.render('grades', {grades});
    })
    .catch((error) => {
        res.status(500).send("error");
    });
});

//LECTURERS GET
app.get('/lecturers', (req, res) => {
   MongoDB_DAO.getLecturers()
   .then((lecturers) => {
    res.render('lecturers', {lecturers});
   })
   .catch((error) => {
    res.status(500).send("error")
   });
});

app.get('/lecturers/delete/:lid', (req, res) => {
    var lecturerId = req.params.lid;

    //checl for modules
    mySQL_DAO.getModulesByLectID(lecturerId)
    .then((modules) => {
        if(modules.length > 0) {
            res.send(`<html> <head> <body> <a href="/lecturers">Home</a> <h1>Error message</h1><h3>Cannot delete lecturer ${lecturerId}. They have associated modules.<h3> </body></head></html>`);
        }
        else {
            MongoDB_DAO.deleteLecturer(lecturerId,modules)
            .then(()=> res.redirect('/lecturers'))
            .catch((error) => {
                res.status(500).send('error')
            });
        }
    });
});
