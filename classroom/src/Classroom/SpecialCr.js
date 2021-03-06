import React from 'react';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import Foot from '../Navbar/FooterCr'
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import addbt from './icon/plus.png';
import './SpecialCr.css';
import { Component } from 'react';
import axios from 'axios';


export default class ManageIn extends Component {
    constructor(props) {
        super(props);
        this.state = { curr2: [] }
        this.componentWillMount = this.componentWillMount.bind(this);

    }
    componentWillMount() {
        axios.get('http://localhost:7777/curriculum')
            .then(res => {
                this.setState({
                    curr2: res.data,
                })

            })
            .catch(function (error) {
                console.log(error);
            })

    }
    render() {
        return (
            <div className="page-container" >
                <div className="content-wrap">

                    <Nav />

                    <h1 class="state">กำหนดห้องเรียนกรณีพิเศษ</h1>
                    <div id="detail">
                        <div className="filter">
                            <h4 className="departfil2">สาขาวิชา</h4>
                            <select className="departfil2detail">
                                {
                                    this.state.curr2.map((data, index) =>
                                        <option value={data.curr2_id}>{data.curr2_tname}</option>
                                    )
                                }
                            </select>
                        </div>

                        <Table striped responsive className="Crtable">
                            <thead>
                                <tr className="ManageTable">
                                    <th>รหัสวิชา</th>
                                    <th>ชื่อวิชา</th>
                                    <th>กลุ่ม</th>
                                    <th>เวลาเรียน</th>
                                    <th>รหัสอาคาร</th>
                                    <th>ห้อง</th>
                                    <th>จำนวนที่นั่ง</th>
                                    <th>จำนวนนศ.</th>
                                    <th>แก้ไขข้อมูล</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td >01006004</td>
                                    <td >INDUSTRIAL TRAINING</td>
                                    <td>1</td>
                                    <td>9.00-12.00</td>
                                    <td>HM</td>
                                    <td>401</td>
                                    <td>100</td>
                                    <td>40</td>
                                    <td>
                                        <Button variant="light" className="editdata">
                                            <img src={editbt} className="editicon" alt="edit" />
                                        </Button>
                                        <Button variant="light" className="deletedata">
                                            <img src={deletebt} className="deleteicon" alt="delete" />
                                        </Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td >01006015</td>
                                    <td >ENGINEERING DRAWING</td>
                                    <td>1</td>
                                    <td>9.00-12.00</td>
                                    <td>E12</td>
                                    <td>402</td>
                                    <td>100</td>
                                    <td>40</td>
                                    <td>
                                        <Button variant="light" className="editdata">
                                            <img src={editbt} className="editicon" alt="edit" />
                                        </Button>
                                        <Button variant="light" className="deletedata">
                                            <img src={deletebt} className="deleteicon" alt="delete" />
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        <Button variant="light" className="adddata">
                            <img src={addbt} className="addicon" alt="add" />
                        </Button>
                    </div>
                </div>
                <div className="footer">
                    <Foot />
                </div>
            </div>
        )
    }


}
/*
export default class SpecialCr extends Component {
    render() {
        return (
            <div className="page-container" >
                <div className="content-wrap">

                    <Nav />

                    <h1 class="state">กำหนดห้องเรียนกรณีพิเศษ</h1>
                    <div id="detail">
                        <div className="filter">
                            <h4 className="departfil2">สาขาวิชา</h4>
                            <select className="departfil2detail">
                                <option value="1">วิศวกรรมโทรคมนาคม</option>
                                <option value="2">วิศวกรรมไฟฟ้า</option>
                                <option value="3">วิศวกรรมอิเล็กทรอนิกส์</option>
                                <option value="4">วิศวกรรมระบบควบคุม</option>
                                <option value="5">วิศวกรรมคอมพิวเตอร์</option>
                                <option value="6">วิศวกรรมเครื่องกล</option>
                                <option value="7">วิศวกรรมการวัดคุม</option>
                                <option value="8">วิศวกรรมโยธา</option>
                                <option value="9">วิศวกรรมเกษตร</option>
                                <option value="10">วิศวกรรมเคมี</option>
                                <option value="11">วิศวกรรมอาหาร</option>
                                <option value="12">วิศวกรรมอุตสาหการ</option>
                                <option value="13">วิศวกรรมชีวการแพทย์</option>
                                <option value="14">สำนักงานบริหารหลักสูตรวิศวกรรมสหวิทยาการนานาชาติ</option>
                            </select>
                        </div>

                        <Table striped responsive className="Crtable">
                            <thead>
                                <tr className="ManageTable">
                                    <th>รหัสวิชา</th>
                                    <th>ชื่อวิชา</th>
                                    <th>กลุ่ม</th>
                                    <th>เวลาเรียน</th>
                                    <th>รหัสอาคาร</th>
                                    <th>ห้อง</th>
                                    <th>จำนวนที่นั่ง</th>
                                    <th>จำนวนนศ.</th>
                                    <th>แก้ไขข้อมูล</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td >01006004</td>
                                    <td >INDUSTRIAL TRAINING</td>
                                    <td>1</td>
                                    <td>9.00-12.00</td>
                                    <td>HM</td>
                                    <td>401</td>
                                    <td>100</td>
                                    <td>40</td>
                                    <td>
                                        <Button variant="light" className="editdata">
                                            <img src={editbt} className="editicon" alt="edit" />
                                        </Button>
                                        <Button variant="light" className="deletedata">
                                            <img src={deletebt} className="deleteicon" alt="delete" />
                                        </Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td >01006015</td>
                                    <td >ENGINEERING DRAWING</td>
                                    <td>1</td>
                                    <td>9.00-12.00</td>
                                    <td>E12</td>
                                    <td>402</td>
                                    <td>100</td>
                                    <td>40</td>
                                    <td>
                                        <Button variant="light" className="editdata">
                                            <img src={editbt} className="editicon" alt="edit" />
                                        </Button>
                                        <Button variant="light" className="deletedata">
                                            <img src={deletebt} className="deleteicon" alt="delete" />
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        <Button variant="light" className="adddata">
                            <img src={addbt} className="addicon" alt="add" />
                        </Button>
                    </div>
                </div>
                <div className="footer">
                    <Foot />
                </div>
            </div>
        )
    }
}
*/