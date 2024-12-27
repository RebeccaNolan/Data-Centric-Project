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

module.exports = { getStudents, addStudent, updateStudent };
