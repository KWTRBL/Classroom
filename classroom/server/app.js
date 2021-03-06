//include lib
const express = require("express"); // เรียกใช้ Express
var cors = require("cors");
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser"); // ใช้งาน cookie-parser module
var session = require("express-session");
const bcrypt = require("bcrypt");
var MySQLStore = require("express-mysql-session")(session);
var cron = require("node-cron");
const path = require('path')
//import file
const building = require("./routes/building");
const classroom = require("./routes/classroom");
const upload = require("./routes/upload");
const zonedata = require("./routes/zonedata");
const groupdata = require("./routes/groupdata");
const teachdata = require("./routes/teachdata");
const semesterdata = require("./routes/semesterdata");
const yeardata = require("./routes/yeardata");
const availableroom = require("./routes/availableroom");
const auth = require("./routes/auth");
const manageroom = require("./routes/manageroom");
const curriculum = require("./routes/curriculum");
const department = require("./routes/department");
const teacher = require("./routes/teacher");
const officer = require("./routes/officer");
const teacherteach = require("./routes/teacherteach");
const facultycondition = require("./routes/faculty_condition");
const examweek = require("./routes/examweek");
const t_condition = require("./routes/t_condition");
const person = require("./routes/person");
const t_exam_room = require("./routes/t_examroom");
const t_office = require("./routes/t_office");
const exam_schedule = require("./routes/exam_schedule");
const downloadfile = require("./routes/downloadfile");
const regupdate = require("./routes/regupdate")
//insert examweekdata every semester
cron.schedule("0 0 1 1,6,8 *", () => {
  console.log("detect new semester");
  examweek.update();
});

setInterval(async () => {
  console.log('start :', new Date())
  await regupdate.read(callback =>{
    console.log('callback :',callback.length)
  })
  console.log('end :', new Date())
}
  , 86400000);

var options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "classroom_management",
  clearExpired: true,
  //expiration: 2000,
  checkExpirationInterval: 2000,
};
var sessionStore = new MySQLStore(options);

var port = process.env.PORT || 7777;
global.__basedir = __dirname;

//express
const app = express(); // สร้าง Object เก็บไว้ในตัวแปร app เพื่อนำไปใช้งาน
app.use(
  session({
    secret: "session_cookie_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//login
app.post("/login", (req, res) => {
  // Router เวลาเรียกใช้งาน
  auth.login(req, function (callback) {
    if (callback.message == "login success") {
      // const timeout = 60 * 60 * 1000;
      // console.log(req.session.cookie.maxAge)
      // req.session.cookie.maxAge = timeout;
      req.session.token = callback.token;
      res.cookie("token", callback.token, { httpOnly: true });
      res.cookie("session_id", req.sessionID, { httpOnly: true });
      req.session.save();
    }
    console.log(callback.role)
    res.send({
      message: callback.message,
      isLogin: callback.isLogin,
      role: callback.role
    });
  });
});


//authen ของการ login
app.get("/auth", (req, res) => {
  auth.auth(req, function (callback) {
    if (callback.isLogin == 1) {
      res.status(200).send({
        login: callback.isLogin,
        role: callback.role
      });
    } else {
      res.status(200).send({
        login: callback.isLogin,
      });
    }

  });
});


//ลบ session ออกจาก db
app.get("/logout", (req, res) => {
  res.cookie("token", "", { expires: new Date(1), path: "/" });
  res.cookie("session_id", "", { expires: new Date(1), path: "/" });
  res.cookie("connect.sid", "", { expires: new Date(1), path: "/" });
  auth.logout(req, function (callback) {
    res.status(200).send({
      logout: callback,
    });
  });
});


//register account api
app.post("/register", (req, res) => {
  // Router เวลาเรียกใช้งาน
  auth.register(req, function (callback) {
    res.send(callback);
  });
});

//Building Data
app.get("/building", (req, res) => {
  // Router เวลาเรียกใช้งาน
  building.read(function (callback) {
    res.json(callback);
  });
});

//building data delete
app.delete("/building/delete", (req, res) => {
  // Router เวลาเรียกใช้งาน
  building.delete(req.body.building_no, function (callback) {
    console.log(callback);
    if (callback) {
      res.send("Success");
    } else {
      res.send("Error");
    }
  });
});


//insert ข้อมูลลง t_building
app.post("/building/insert", (req, res) => {
  // Router เวลาเรียกใช้งาน
  building.add(req, function (callback) {
    res.send(callback);
  });
});

//update ข้อมูล
app.put("/building/update", (req, res) => {
  // Router เวลาเรียกใช้งาน
  building.update(req, function (callback) {
    res.send(callback);
  });
});

//get Classroom Data
app.get("/classroom", (req, res) => {
  // Router เวลาเรียกใช้งาน
  classroom.read(function (callback) {
    res.json(callback);
  });
});

//delete classroom data
app.delete("/classroom/delete", (req, res) => {
  // Router เวลาเรียกใช้งาน
  classroom.delete(req.body.room_no, function (callback) {
    console.log(callback);
    if (callback) {
      res.send("Success");
    } else {
      res.send("Error");
    }
  });
});

app.post("/classroom/insert", (req, res) => {
  // Router เวลาเรียกใช้งาน
  classroom.add(req, function (callback) {
    res.send(callback);
  });
});

app.put("/classroom/update", (req, res) => {
  // Router เวลาเรียกใช้งาน
  classroom.update(req, function (callback) {
    res.send(callback);
  });
});

//CurriculumZone Data
app.get("/zonedata", (req, res) => {
  // Router เวลาเรียกใช้งาน
  zonedata.read(function (callback) {
    res.json(callback);
  });
});
app.put("/zonedata/update", (req, res) => {
  // Router เวลาเรียกใช้งาน
  zonedata.update(req, function (callback) {
    res.send(callback);
  });
});
app.post("/zonedata/delete", (req, res) => {
  // Router เวลาเรียกใช้งาน
  //console.log(req.body.data.curr2_id)
  zonedata.delete(req, function (callback) {
    if (callback) {
      res.send("Success");
    } else {
      res.send("Error");
    }
    // res.send(callback);
  });
});

//Curriculum Data From teachtable
app.get("/curriculum", (req, res) => {
  // Router เวลาเรียกใช้งาน
  curriculum.read(function (callback) {
    res.json(callback);
  });
});

//Curriculum teacherteach Data From teachtable
app.get("/teacherteachcurriculum", (req, res) => {
  // Router เวลาเรียกใช้งาน
  curriculum.readforteacherteach(function (callback) {
    res.json(callback);
  });
});

//Department data
app.get("/department", (req, res) => {
  // Router เวลาเรียกใช้งาน
  department.read(function (callback) {
    res.json(callback);
  });
});

//teacher data
app.get("/teacher", (req, res) => {
  // Router เวลาเรียกใช้งาน
  teacher.read(function (callback) {
    res.json(callback);
  });
});

//officer data
app.get("/officer", (req, res) => {
  // Router เวลาเรียกใช้งาน
  officer.read(function (callback) {
    res.json(callback);
  });
});

//CurriculumGroup Data
app.get("/groupdata", (req, res) => {
  // Router เวลาเรียกใช้งาน
  groupdata.read(function (callback) {
    res.json(callback);
  });
});

app.put("/groupdata/update", (req, res) => {
  // Router เวลาเรียกใช้งาน
  groupdata.update(req, function (callback) {
    res.send(callback);
  });
});
app.post("/groupdata/delete", (req, res) => {
  // Router เวลาเรียกใช้งาน
  //console.log(req.body.data.curr2_id)
  groupdata.delete(req, function (callback) {
    if (callback) {
      res.send("Success");
    } else {
      res.send("Error");
    }
    // res.send(callback);
  });
});


//Teach Data
app.get("/teachdata", (req, res) => {
  // Router เวลาเรียกใช้งาน
  teachdata.read(function (callback) {

    res.json(callback);
  });
});

app.post("/teachdata/update", (req, res) => {
  // Router เวลาเรียกใช้งาน
  teachdata.update(req, function (callback) {
    res.json(callback);
  });
});
//Semester Data
app.get("/semesterdata", (req, res) => {
  // Router เวลาเรียกใช้งาน
  semesterdata.read(function (callback) {
    res.json(callback);
  });
});

//Year Data
app.get("/yeardata", (req, res) => {
  // Router เวลาเรียกใช้งาน
  yeardata.read(function (callback) {
    res.json(callback);
  });
});

app.post("/uploadfile", upload.upload.single("uploadfile"), (req, res) => {
  upload.importCsvData2MySQL(__basedir + "/uploads/" + req.file.filename);
  res.json({
    msg: "File uploaded/import successfully!",
    file: req.file,
  });
});

app.post("/insert", (req, res) => {
  // Router เวลาเรียกใช้งาน
  upload.insert(req, function (callback) {
    console.log(callback.status);
    res.status(callback.status);
    res.end();
    // res.json(callback)
  });
});

//Availableroom Data
app.get("/availableroom", (req, res) => {
  // Router เวลาเรียกใช้งาน
  availableroom.read(function (callback) {
    res.json(callback);
  });
});

//update available room
app.post("/availableroom/update", (req, res) => {
  // Router เวลาเรียกใช้งาน
  availableroom.update(req, function (callback) {
    res.json(callback);
  });
});

//delete available room
app.post("/availableroom/delete", (req, res) => {
  // Router เวลาเรียกใช้งาน
  availableroom.delete(req, function (callback) {
    if (callback) {
      res.send("Success");
    } else {
      res.send("Error");
    }
  });
});

//Manage room
app.post("/manageroom", (req, res) => {
  // Router เวลาเรียกใช้งาน
  console.log('manage room')
  manageroom.read(req, async function (callback) {
    console.log('success')
    res.json(callback);
  });
});
//manageroom test
// app.get("/manageroom", (req, res) => {
//   // Router เวลาเรียกใช้งาน
//   manageroom.read(function (callback) {
//     res.json(callback);
//   });
// });

//teacherteach data
app.get("/teacherteach", (req, res) => {
  // Router เวลาเรียกใช้งาน

  teacherteach.read(function (callback) {
    res.json(callback);
  });
});

//facultycondition Data
app.get("/facultycondition", (req, res) => {
  // Router เวลาเรียกใช้งาน
  facultycondition.read(function (callback) {
    res.json(callback);
  });
});

//update facultycondition
app.post("/facultycondition/update", (req, res) => {
  // Router เวลาเรียกใช้งาน
  facultycondition.update(req, function (callback) {
    res.json(callback);
  });
});
app.post("/facultycondition/updateweek1", (req, res) => {
  // Router เวลาเรียกใช้งาน
  console.log("123")
  facultycondition.updateweek1(req, function (callback) {
    res.json(callback);
    console.log("abc")
  });
});
app.post("/facultycondition/updateweek1_end", (req, res) => {
  // Router เวลาเรียกใช้งาน
  facultycondition.updateweek1_end(req, function (callback) {
    res.json(callback);
  });
});
app.post("/facultycondition/updateweek2", (req, res) => {
  // Router เวลาเรียกใช้งาน
  facultycondition.updateweek2(req, function (callback) {
    res.json(callback);
  });
});
app.post("/facultycondition/updateweek2_end", (req, res) => {
  // Router เวลาเรียกใช้งาน
  facultycondition.updateweek2_end(req, function (callback) {
    res.json(callback);
  });
});
app.post("/facultycondition/updateweek3", (req, res) => {
  // Router เวลาเรียกใช้งาน
  facultycondition.updateweek3(req, function (callback) {
    res.json(callback);
  });
});
app.post("/facultycondition/updateweek3_end", (req, res) => {
  // Router เวลาเรียกใช้งาน
  facultycondition.updateweek3_end(req, function (callback) {
    res.json(callback);
  });
});
app.post("/facultycondition/updateweek4", (req, res) => {
  // Router เวลาเรียกใช้งาน
  facultycondition.updateweek4(req, function (callback) {
    res.json(callback);
  });
});
app.post("/facultycondition/updateweek4_end", (req, res) => {
  // Router เวลาเรียกใช้งาน
  facultycondition.updateweek4_end(req, function (callback) {
    res.json(callback);
  });
});

//examweek Data
app.get("/examweek", (req, res) => {
  // Router เวลาเรียกใช้งาน
  examweek.read(function (callback) {
    res.json(callback);
  });
});

app.get("/examweekrecent", (req, res) => {
  // Router เวลาเรียกใช้งาน
  examweek.readrecent(function (callback) {
    res.json(callback);
  });
});


//t_condition
app.get("/t_condition", (req, res) => {
  // Router เวลาเรียกใช้งาน
  t_condition.read(function (callback) {
    res.json(callback);
  });
});

//update t_condition
app.post("/t_condition/update", (req, res) => {
  // Router เวลาเรียกใช้งาน
  t_condition.updatecondition(req, function (callback) {
    res.json(callback);
  });
});
//insert ข้อมูลลง t_condition
app.post("/t_condition/insert", (req, res) => {
  // Router เวลาเรียกใช้งาน
  t_condition.add(req, function (callback) {
    res.send(callback);
  });
});

//person
app.get("/person", (req, res) => {
  // Router เวลาเรียกใช้งาน
  person.read(function (callback) {
    res.json(callback);
  });
});
//person data delete
app.delete("/person/delete", (req, res) => {
  // Router เวลาเรียกใช้งาน
  person.delete(req.body.person_id, function (callback) {
    console.log(callback);
    if (callback) {
      res.send("Success");
    } else {
      res.send("Error");
    }
  });
});

//person filter
app.get("/personfilter", (req, res) => {
  // Router เวลาเรียกใช้งาน
  person.getfilter(function (callback) {
    res.json(callback);
  });
});


//t_examroom
app.get("/t_examroombuilding", (req, res) => {
  // Router เวลาเรียกใช้งาน
  t_exam_room.building(function (callback) {
    res.json(callback);
  });
});

//t_office
app.get("/t_office", (req, res) => {
  // Router เวลาเรียกใช้งาน
  t_office.read(function (callback) {
    res.json(callback);
  });
});
//t_office data edit
app.put("/t_office/update", (req, res) => {
  // Router เวลาเรียกใช้งาน
  t_office.update(req, function (callback) {
    res.send(callback);
  });
});
//t_office data delete
app.delete("/t_office/delete", (req, res) => {
  // Router เวลาเรียกใช้งาน
  t_office.delete(req.body.Office_id, function (callback) {
    console.log(callback);
    if (callback) {
      res.send("Success");
    } else {
      res.send("Error");
    }
  });
});
//insert ข้อมูลลง t_office
app.post("/t_office/insert", (req, res) => {
  // Router เวลาเรียกใช้งาน
  t_office.add(req, function (callback) {
    res.send(callback);
  });
});

//exam_schedule
app.post("/exam_schedule", (req, res) => {
  // Router เวลาเรียกใช้งาน
  exam_schedule.ownsubject(req, function (callback) {
    res.json(callback);
  });
});


app.post("/exam_schedule_other", (req, res) => {
  // Router เวลาเรียกใช้งาน
  exam_schedule.othersubject(req, function (callback) {
    res.json(callback);
  });
});

app.get("/exam_committee", (req, res) => {
  // Router เวลาเรียกใช้งาน
  exam_schedule.read(function (callback) {
    res.json(callback);
  });
});


app.post("/exam_committee_officer", (req, res) => {
  // Router เวลาเรียกใช้งาน
  exam_schedule.officersubject(req, function (callback) {
    res.json(callback);
  });
});
//building data delete
app.delete("/exam_committee/delete", (req, res) => {
  // Router เวลาเรียกใช้งาน
  exam_schedule.removedata(req, function (callback) {
    // console.log(callback);
    if (callback) {
      res.send("Success");
    } else {
      res.send("Error");
    }
  });
});

app.post("/exam_committee/adddata", (req, res) => {
  // Router เวลาเรียกใช้งาน
  exam_schedule.teacher_exam(req, function (callback) {
    console.log(callback);
    if (callback) {
      res.send("Success");
    } else {
      res.send("Error");
    }
  });
});

//downloadfile
app.post("/downloadfile", (req, res) => {
  // Router เวลาเรียกใช้งาน
  downloadfile.read(req, function (callback) {
    console.log('send data :')
    res.sendFile(callback, { root: '.' });
  });
});

//exportdata from t_exam_committee
app.post("/exportfile", (req, res) => {
  // Router เวลาเรียกใช้งาน
  exam_schedule.exportfile(req, async function (callback) {
    console.log('send data :', callback)
    res.sendFile(path.join(__dirname, callback))

    // await res.sendFile(callback, { root: '.' });
  });
});

//exportdata from t_exam_committee
app.post("/exportnamefile", (req, res) => {
  // Router เวลาเรียกใช้งาน
  exam_schedule.exportnamefile(req, function (callback) {
    console.log('send data :')
    // res.sendFile(path.join(__dirname, callback),{ root: '.' })

    res.sendFile(callback, { root: '.' });
  });
});


app.get("/exam_committee_filter", (req, res) => {
  // Router เวลาเรียกใช้งาน
  exam_schedule.getfilter(function (callback) {
    res.json(callback);
  });
});

app.get("/report_filter", (req, res) => {
  // Router เวลาเรียกใช้งาน
  exam_schedule.report_filter(function (callback) {
    res.json(callback);
  });
});

app.get("/exam_committee_check", (req, res) => {
  // Router เวลาเรียกใช้งาน
  exam_schedule.committeecheck(function (callback) {
    // console.log('callback :',callback[0].year)
    var data = callback
    res.json(data);
  });
});

app.post("/exam_committee_getdata", (req, res) => {
  // Router เวลาเรียกใช้งาน
  exam_schedule.examdata(req, function (callback) {
    if (typeof callback == "object") {
      // console.log(typeof callback)
      res.status(200).json(callback)
    } else {
      res.status(404).send(callback);
    }
  });
});

app.post("/exam_committee_insteaddata", (req, res) => {
  // Router เวลาเรียกใช้งาน
  exam_schedule.examdatainstead(req, function (callback) {
    if (callback == "ไม่มีข้อมูลที่ต้องการ") {
      res.status(404).send(callback)
    } else {
      res.status(200).json(callback);
    }

  });
});

app.post("/exam_committee_swap", (req, res) => {
  // Router เวลาเรียกใช้งาน
  exam_schedule.swapdata(req, function (callback) {
    if (callback == 'swapp failed') {
      res.status(500).send(callback)
    } else {
      res.status(200).send(callback)
    }
  });
});


app.post("/exam_committee_instead", (req, res) => {
  // Router เวลาเรียกใช้งาน
  exam_schedule.examinstead(req, function (callback) {
    if (callback == "success") {
      res.status(200).send(callback)
    } else {
      res.status(500).json(callback);
    }
  });
});

app.listen(port, () => {
  console.log("start port " + port);
});



