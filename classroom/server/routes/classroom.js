const pool = require('./dbconfig')

module.exports.read = function (callback){

    let sql = 'SELECT t_room.building_no,t_building.building_name,room_no,seat_num ,t_room.room_floor,t_room.room_status FROM t_room,t_building WHERE t_room.building_no = t_building.building_no    ORDER BY building_no ,room_floor,room_no ASC '  // คำสั่ง sql

    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql, (err, rows) => {
            
            if(err) throw err;
            console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}