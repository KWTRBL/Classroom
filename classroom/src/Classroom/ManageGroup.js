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
import axios from 'axios';
import { Component } from 'react';
import { json } from 'body-parser';
import Pagination from "react-js-pagination";
import Modal from 'react-bootstrap/Modal'
import './ManageGroup.css';

export default class ManageGroup extends Component {
    constructor(props) {
      super(props);
      this.state = {
            name: [],
            pageclick:1,
            itemperpage:10,
            firstitem:null,
            lastitem:null,
            curr2_id:null,
            class:null,
            sec1:null,
            sec2:null,
            sec3:null,
            editlist: [],
            olddata: []
      }
        this.pageselect = this.pageselect.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        //edit data
        this.enableedit = this.enableedit.bind(this)
        this.canceledit = this.canceledit.bind(this)
        this.confirmedit = this.confirmedit.bind(this)
        this.handleChange_editsec1 = this.handleChange_editsec1.bind(this)
        this.handleChange_editsec2 = this.handleChange_editsec2.bind(this)
        this.handleChange_editsec3 = this.handleChange_editsec3.bind(this)

        //delete row
        this.deletebt = this.deletebt.bind(this)
        this.confirmdelete = this.confirmdelete.bind(this);
        
        //modal
        this.handleClose = this.handleClose.bind(this);
        this.handleClosesubmit = this.handleClosesubmit.bind(this);
        this.handleClosefailed = this.handleClosefailed.bind(this);
  }
  componentWillMount() {
        axios.get('http://localhost:7777/groupdata')
        .then(res => {
            const newIds = this.state.editlist.slice()
                for (var i = 0; i < res.data.length; i++) {
                    newIds.push(0)
                }
            this.setState({
                name: res.data,
                editlist: newIds,
                olddata: JSON.stringify(res.data)
            })
         
        })
        .catch(function (error) {
          console.log(error);
        })
        this.setState({
            firstitem: 0,
            lastitem: this.state.itemperpage
        })
    }
    pageselect(pageNumber) {
        let newId = this.state.editlist.slice()
        for (var i = 0; i < newId.length; i++) {
            if (newId[i] == 1) {
                newId[i] = 0
            }
        }
        this.setState({
            pageclick: pageNumber,
            firstitem: (this.state.itemperpage * pageNumber) - this.state.itemperpage,
            lastitem: (this.state.itemperpage * pageNumber),
            editlist: newId,
            name: JSON.parse(this.state.olddata),

        })
    }

    //edit data handle
    handleChange_editsec1(index, event) {
        const newIds = this.state.name //copy the array
        newIds[index].sec1 = event.target.value//execute the manipulations
        this.setState({ name: newIds }) //set the new state
    }
    handleChange_editsec2(index, event) {
        const newIds = this.state.name //copy the array
        newIds[index].sec2 = event.target.value //execute the manipulations
        this.setState({ name: newIds }) //set the new state
    }    
    handleChange_editsec3(index, event) {
        const newIds = this.state.name //copy the array
        newIds[index].sec3 = event.target.value//execute the manipulations
        this.setState({ name: newIds }) //set the new state

    }

    //handle modal
    handleClose() {
        this.setState({
            show: false
        })
    }
    handleClosesubmit() {
        axios.get('http://localhost:7777/groupdata')
        .then(res => {
            const newIds = this.state.editlist.slice()
                for (var i = 0; i < res.data.length; i++) {
                    newIds.push(0)
                }
            this.setState({
                name: res.data,
                editlist: newIds,
                olddata: JSON.stringify(res.data),
                showsubmit: false
            })
         
        })
        .catch(function (error) {
          console.log(error);
        })
        // this.setState({
        //     showsubmit: false
        // })
        // window.location.reload(false);
    }

    handleClosefailed() {
        axios.get('http://localhost:7777/groupdata')
        .then(res => {
            const newIds = this.state.editlist.slice()
                for (var i = 0; i < res.data.length; i++) {
                    newIds.push(0)
                }
            this.setState({
                name: res.data,
                editlist: newIds,
                olddata: JSON.stringify(res.data),
                showfailed: false
            })
         
        })
        .catch(function (error) {
          console.log(error);
        })
        // this.setState({
        //     showfailed: false
        // })
        // window.location.reload(false);

    }


    //delete row button 
    deletebt = (curr2_id, classdata, index) => {
        this.setState({
            show: true,
            curr2_id: curr2_id,
            class: classdata,
            indextodel: index
        })
    }

    //confirm delete row in table function
    confirmdelete() {
        console.log(this.state.curr2_id)
        axios
            .post("http://localhost:7777/groupdata/delete", { data: { curr2_id: this.state.curr2_id ,class : this.state.class } })
            .then(response => {
                console.log("response: ", response)
                if (response.data == "Success") {
                    this.setState({
                        showsubmit: !this.state.showsubmit
                    })
                }
                else {
                    this.setState({
                        showfailed: !this.state.showfailed
                    })
                }
                // do something about response
            })
            .catch(err => {
                console.error(err)
            })
        this.handleClose()
    }
    

    //cancel edit row
    canceledit = (index) => {
        const newIds = this.state.editlist.slice() //copy the array
        newIds[index] = 0//execute the manipulations
        this.setState({
            editlist: newIds,
            name: JSON.parse(this.state.olddata),
        }) //set the new state
    }

    //confirm edit data sent to database
    confirmedit = (index) => {
        let olddata = JSON.parse(this.state.olddata)
        axios
            .put("http://localhost:7777/groupdata/update", {

                    curr2_id: olddata[index].curr2_id,
                    class: olddata[index].class,
                    sec1: this.state.name[index].sec1,
                    sec2: this.state.name[index].sec2,
                    sec3: this.state.name[index].sec3
            })
            .then(response => {
                console.log("response: ", response)
                axios.get('http://localhost:7777/groupdata')
                .then(res => {
                    const newIds = []
                        for (var i = 0; i < res.data.length; i++) {
                            newIds.push(0)
                        }
                    this.setState({
                        name: res.data,
                        editlist: newIds,
                        olddata: JSON.stringify(res.data)
                    })
                 
                })
                .catch(function (error) {
                  console.log(error);
                })
                // do something about response
            })
            .catch(err => {
                console.error(err)
            })
            // window.location.reload(false);

    }

    //enable edit row
    enableedit = (index) => {
        const result = this.state.editlist.find((data) => {
            return data == 1
        })
        if (!result) {
            const newIds = this.state.editlist.slice() //copy the array
            newIds[index] = 1//execute the manipulations
            this.setState({ editlist: newIds }) //set the new state
        }
    }

    render() {
        const item = this.state.name.filter((member,index) => {
            return member
        }).slice(this.state.firstitem,this.state.lastitem).map((data,index) =>
        {
            if (this.state.editlist[index] == 1) {
                return (

                    <tr>
                        <td>{data.curr2_tname}</td>
                        <td>{data.class}</td>
                        <td>
                            <input
                                value={data.sec1}
                                type="number"
                                className="form-control"
                                id="formGroupExampleInput"
                                min="0"
                                onChange={(e) => this.handleChange_editsec1(((this.state.pageclick-1)*this.state.itemperpage) +index, e)}
                            />
                        </td>
                        <td>
                            <input
                                value={data.sec2}
                                type="number"
                                className="form-control"
                                id="formGroupExampleInput"
                                min = "0"
                                onChange={(e) => this.handleChange_editsec2(((this.state.pageclick-1)*this.state.itemperpage) +index, e)}
                            />
                        </td>
                        <td>
                            <input
                                value={data.sec3}
                                type="number"
                                className="form-control"
                                id="formGroupExampleInput"
                                min = "0"
                                onChange={(e) => this.handleChange_editsec3(((this.state.pageclick-1)*this.state.itemperpage) + index, e)}
                            />
                        </td>
                        <td>
                            <Button variant="link" onClick={() => this.canceledit(index)}>ยกเลิก</Button>

                            <Button variant="primary" onClick={() => this.confirmedit(((this.state.pageclick-1)*this.state.itemperpage) + index)} >ยืนยัน</Button>
                        </td>
                    </tr>

                )
            } else {
                return (
                    <tr>
                        <td>{data.curr2_tname}</td>
                        <td>{data.class}</td>
                        <td>{data.sec1}</td>
                        <td>{data.sec2}</td>
                        <td>{data.sec3}</td>
                        <td>
                            <Button variant="light" className="editdata" onClick={() => this.enableedit(index)}> 
                                <img src={editbt} className="editicon" alt="edit" />
                            </Button>
                            <Button variant="light" className="deletedata" onClick={() => this.deletebt(data.curr2_id,data.class)}>
                                <img src={deletebt} className="deleteicon" alt="delete" />
                        </Button>
                        </td>
                    </tr>

                )
            }

        }
        )

        let data_num = this.state.name.filter((member) => {
                return member
        }).length
       
        return (
            <div className="page-container" >
                <div className="content-wrap">
                <Nav/>
                <h1 class="state">จัดจำนวนนักศึกษาแต่ละกลุ่ม</h1>
                <div id="detail">
                    <Table striped responsive className="Crtable">
                        <thead>
                        <tr className="Managegrouptable">
                            <th>สาขา</th>
                            <th>ชั้นปี</th>
                            <th>กลุ่ม 1</th>
                            <th>กลุ่ม 2</th>
                            <th>กลุ่ม 3</th>
                            <th>แก้ไขข้อมูล</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            item
                        }
                        </tbody>
                    </Table>
                    {/* <Button variant="light" className="adddata">
                        <img src={addbt} className="addicon" alt="add" />
                    </Button> */}
                    <Pagination
                        activePage={this.state.pageclick}
                        itemsCountPerPage={this.state.itemperpage}
                        totalItemsCount={data_num}
                        itemClass="page-item"
                        linkClass="page-link"
                        pageRangeDisplayed={5}
                        onChange={this.pageselect}

                    />
                </div>
                </div>
                <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>คำเตือน</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>คุณแน่ใจหรือไม่ที่จะต้องการลบข้อมูลนี้</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                ยกเลิก
                        </Button>
                            <Button variant="primary" onClick={this.confirmdelete}>
                                ยืนยัน
                        </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal size="sm" show={this.state.showsubmit} onHide={this.handleClosesubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Success</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>บันทึกข้อมูลสำเร็จ</Modal.Body>
                        <Modal.Footer>
                        </Modal.Footer>
                    </Modal>

                    <Modal size="sm" show={this.state.showfailed} onHide={this.handleClosefailed}>
                        <Modal.Header closeButton>
                            <Modal.Title>Failed</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>บันทึกข้อมูลล้มเหลว</Modal.Body>
                        <Modal.Footer>
                        </Modal.Footer>
                    </Modal>
                <div className="footer">
                    <Foot />
                </div>
            </div>
        );
    }
}

