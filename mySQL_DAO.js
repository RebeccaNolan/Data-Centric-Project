var pmysql = require('promise-mysql')
var pool;

pmysql.createPool({
    connectionLimit : 3,
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'proj2024mysql'
    })
    .then((p) => {
        pool = p
    })
    .catch((e) => {
    console.log("pool error:" + e)
   })
   

   var getStudents = function () {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM student')
        .then((data) => {
            resolve(data)
        })
        .catch((error) => {
            reject(error)
         })
   })
}
const addStudent = (sid, name, age) => {
    return pool.query('INSERT INTO student (sid, name, age) VALUES (?, ?, ?)', [sid, name, age]);
};


const updateStudent = (sid, name, age) => {
    return pool.query('UPDATE student SET name = ?, age = ? WHERE sid = ?', [name, age, sid]);
};

const getGrades = (sid, mid, grade) => {
    return pool.query('SELECT * FROM grade')
};

const getInfo = () => {
return pool.query('SELECT student.name AS student_name, module.name AS module_name, grade.grade  FROM student LEFT JOIN grade ON student.sid = grade.sid LEFT JOIN module ON grade.mid = module.mid ORDER BY student.name ASC, grade.grade ASC')
};

module.exports = { getStudents, addStudent, updateStudent, getGrades, getInfo };
