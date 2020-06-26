const express = require('express') // เรียกใช้ Express
var cors = require('cors');
var bodyParser = require('body-parser');
var port = process.env.PORT || 7777;
const building = require('./routes/building')
const classroom = require('./routes/classroom')
const upload = require('./routes/upload')
const zonedata = require('./routes/zonedata')
const groupdata = require('./routes/groupdata')
const teachdata = require('./routes/teachdata')
const semesterdata = require('./routes/semesterdata')
const yeardata = require('./routes/yeardata')

global.__basedir = __dirname;
const app = express() // สร้าง Object เก็บไว้ในตัวแปร app เพื่อนำไปใช้งาน
app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Building Data
app.get('/building', (req, res) => {   // Router เวลาเรียกใช้งาน
    building.read(function (callback) {
        res.json(callback)
    })
})

//Classroom Data
app.get('/classroom', (req, res) => {   // Router เวลาเรียกใช้งาน
    classroom.read(function (callback) {
        res.json(callback)
    })
})

//CurriculumZone Data
app.get('/zonedata', (req, res) => {   // Router เวลาเรียกใช้งาน
    zonedata.read(function (callback) {
        res.json(callback)
    })
})

//CurriculumGroup Data
app.get('/groupdata', (req, res) => {   // Router เวลาเรียกใช้งาน
    groupdata.read(function (callback) {
        res.json(callback)
    })
})

//Teach Data
app.get('/teachdata', (req, res) => {   // Router เวลาเรียกใช้งาน
    teachdata.read(function (callback) {
        res.json(callback)
    })
})

//Semester Data
app.get('/semesterdata', (req, res) => {   // Router เวลาเรียกใช้งาน
    semesterdata.read(function (callback) {
        res.json(callback)
    })
})

//Year Data
app.get('/yeardata', (req, res) => {   // Router เวลาเรียกใช้งาน
    yeardata.read(function (callback) {
        res.json(callback)
    })
})

app.post('/uploadfile', upload.upload.single("uploadfile"), (req, res) => {
    upload.importCsvData2MySQL(__basedir + '/uploads/' + req.file.filename);
    res.json({
        'msg': 'File uploaded/import successfully!', 'file': req.file
    });
});


app.listen(port, () => {     // 
    console.log('start port ' + port)
})



