var pmysql = require("promise-mysql"); //promise for database connections
var pool;

//create connection pool
pmysql
  .createPool({
    connectionLimit: 3,
    host: "localhost",
    user: "root",
    password: "root", //database password
    database: "proj2024mysql",
  })
  .then((p) => {
    pool = p;
  })
  .catch((e) => {
    console.log("pool error:" + e);
  });

//get all students from table
var getStudents = function () {
  return new Promise((resolve, reject) => {
    pool
      .query("SELECT * FROM student")
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//add student to table
var addStudent = (sid, name, age) => {
  return new Promise((resolve, reject) => {
    pool
      .query("INSERT INTO student (sid, name, age) VALUES (?, ?, ?)", [
        sid,
        name,
        age,
      ])
      .then((student) => {
        resolve(student);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//delete student from table by ID
var deleteStudent = (sid) => {
  return new Promise((resolve, reject) => {
    pool
      .query("DELETE FROM student where sid = ?", [sid])
      .then(() => resolve())
      .catch((error) => reject(error));
  });
};

//uodate details in table
var updateStudent = (sid, name, age) => {
  return new Promise((resolve, reject) => {
    pool
      .query("UPDATE student SET name = ?, age = ? WHERE sid = ?", [
        name,
        age,
        sid,
      ])
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//get all grades from table
var getGrades = (sid, mid, grade) => {
  return new Promise((resolve, reject) => {
    pool
      .query("SELECT * FROM grade")
      .then((grades) => {
        resolve(grades);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//join info from multiple tables
var getInfo = () => {
  return new Promise((resolve, reject) => {
    pool
      .query(
        "SELECT student.name AS student_name, module.name AS module_name, grade.grade  FROM student LEFT JOIN grade ON student.sid = grade.sid LEFT JOIN module ON grade.mid = module.mid ORDER BY student.name ASC, grade.grade ASC"
      )

      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//check if lecturer has associated modules
var getModulesByLectID = (lecturerId) => {
  return new Promise((resolve, reject) => {
    pool
      .query("SELECT * FROM module WHERE lecturer = ?", [lecturerId])
      .then((results) => resolve(results))
      .catch((error) => reject(error));
  });
};

module.exports = {
  getStudents,
  addStudent,
  deleteStudent,
  updateStudent,
  getGrades,
  getInfo,
  getModulesByLectID,
};
