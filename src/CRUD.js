import React,{useState,useEffect, Fragment} from "react";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios";
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Form from 'react-bootstrap/Form';


const CRUD = () => {
    const [data,setData] = useState([]);
    const [show, setShow] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const [name,setName] = useState('');
    const [age,setAge] = useState('');
    const [personType,setPersonType] = useState('');

    const [editName,setEditName] = useState('');
    const [editAge,setEditAge] = useState('');
    const [editPersonType,setEditPersonType] = useState('');
    const [editId,setEditId] = useState('');
    const [randomNumbers,setRandomNumbers] = useState([]);
    const [randomDates,setRandomDates] = useState(['']);
    const [titleArr,settitleArr] = useState(['']);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(()=>{
        getData();
    },[])

    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
    function randomNumber(min, max) {
        return Math.ceil(Math.random() * (max - min)) + min;
    }
    function createRandomNumbers() {
        var ranNum = [];
        for (var i = 0; i < 10; i++) {
            var min = i + 5;
            var max = i * 10;
            ranNum.push(randomNumber(min, max));

        }
        return ranNum
    }

    function createRandomDate() {
        var randDate = [];
        for (var i = 0; i < 10; i++) {
            var dte = randomDate(new Date(2012, 0, i), new Date());
            randDate.push(formatDate(dte));
        }
        return randDate;
    }

    function formatDate(date) {
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1; // Months start at 0!
        let dd = date.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return mm + '/' + dd + '/' + yyyy;

    }
    const getData = () => {
        axios.get('/api/person')
        .then((result)=>{
            setData(result.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    const handleEdit = (id) =>{
        handleShow();
        getPerson(id);
    }
    const handleChartClick = (id) =>{
        axios.get(`/api/person/${id}`)
        .then((result)=>{
            var arr = []
            arr.push(result.data.Name);
            arr.push(result.data.Age);
            arr.push(result.data.PersonTypeDesc);
            settitleArr(arr);
            setRandomDates(createRandomDate());
            setRandomNumbers(createRandomNumbers());
            setShowChart(true);
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    const getPerson = (id) =>{
        axios.get(`/api/person/${id}`)
        .then((result)=>{
            setEditName(result.data.Name);
            setEditAge(result.data.Age);
            setEditPersonType(result.data.PersonTypeDesc);
            setEditId(result.data.Id);
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    const handleDelete = (id) =>{
        if(window.confirm("Are you sure to delete person?")){
            deletePerson(id);
        }
        
    }
    const deletePerson = (id) =>{
        fetch(`/api/person/${id}`, { method: 'DELETE' })
        .then(() => {
            toast.success('Person deleted successfully.');
            getData();
        }).catch(error => console.log("Error detected: " + error));
    }
    const handleUpdate = () =>{
        const dataModel = {
            "Id":editId,
            "Name": editName,
            "Age": editAge,
            "PersonTypeDesc": editPersonType   
        }
        fetch(`/api/person/${editId}`,{
            method: 'put',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8'
            },
              body:JSON.stringify(dataModel)
          }).then((response) => {
            toast.success('Person successfully updated.');
            getData();
            clearFields();
            handleClose();
          })
          .catch(error => console.log("Error detected: " + error));
    }
    const dataModel={                    
        "Name": name,
        "Age": age,
        "PersonTypeDesc": personType            
    }
    const handleCreate = ()=>{
        fetch('/api/person',{
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8'
            },
              body:JSON.stringify(dataModel)
          }).then((response) => {
            toast.success('Person successfully created.');
            getData();
            clearFields();
          })
          .catch(error => console.log("Error detected: " + error));
    }

    const clearFields = () =>{
        setName('');
        setAge('');
        setPersonType('');

        setEditName('');
        setEditAge('');
        setEditPersonType('');
        setEditId('');
    }

    const options = {
        chart:{
            type:'column'
        },
        title: {
            useHTML: true,
            style: {
                textAlign: 'center'
            },
            text: '<div style="display: flex; justify-content: space-between;"><span style="margin-right: 100px;" >' + titleArr[0] + '</span><span>' + titleArr[1] + '</span><span  style="margin-left: 100px;">' + titleArr[2] +'</span></div>'

        },
        xAxis: {
            categories: randomDates
        },
        yAxis: {
            title: {
                text: 'Value'
            }
        },
        series: [
            {
                name: 'RandomDates',
                data: randomNumbers
            },

        ]
      }
    return(
        <Fragment>
         <ToastContainer/>   
         <h1 className="float-left">Manage Person</h1>
         <Container className="p-2 mt-1">
            
            <Row>
                <Col><input type="text" className="form-control" placeholder="Enter Name" value={name} onChange={(e)=> setName(e.target.value)}/></Col>
                <Col><input type="text" className="form-control" placeholder="Enter Age" value={age} onChange={(e)=> setAge(e.target.value)}/></Col>
                {/* <Col><input type="text" className="form-control" placeholder="Enter Person Type" value={personType} onChange={(e)=> setPersonType(e.target.value)}/></Col> */}
                <Col><Form.Select aria-label="Default select example" value={personType} onChange={(e) => setPersonType(e.currentTarget.value)}>
      <option>Select Person Type</option>
      <option value="Teacher">Teacher</option>
      <option value="Student">Student</option>
    </Form.Select></Col>
                <Col><button className="btn btn-primary" onClick={()=>handleCreate()}>Add New</button></Col>
            </Row>
        </Container>
        <Container className="mt-2">
        <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Id</th>
          <th>Name</th>
          <th>Age</th>
          <th>PersonType</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody className="p-2">
        {
            data && data.length > 0 ?
            data.map((item,index) =>{
                return(
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.Id}</td>
                    <td>{item.Name}</td>
                    <td>{item.Age}</td>
                    <td>{item.PersonTypeDesc}</td>
                    <td colSpan={2}>
  
                        <button className="btn btn-primary" onClick={()=> handleEdit(item.Id)}>Edit</button> &nbsp;
                        <button className="btn btn-danger" onClick={()=> handleDelete(item.Id)}>Delete</button> &nbsp;
                        {item.PersonTypeDesc==="Teacher" ?<button className="btn btn-secondary" onClick={()=>handleChartClick(item.Id)}>Chart</button>: null
                        }

                    </td>
                  </tr>
                )
            })
            :
            '<tr><td>Loading...</td></tr>'
        }


      </tbody>
    </Table>
    </Container>

    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Person</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row>
                <Col><input type="text" className="form-control" placeholder="Enter Name" value={editName} onChange={(e)=> setEditName(e.target.value)}/></Col>
                <Col><input type="text" className="form-control" placeholder="Enter Age" value={editAge} onChange={(e)=> setEditAge(e.target.value)}/></Col>
                <Col><input type="text" className="form-control" placeholder="Enter Person Type" value={editPersonType} onChange={(e)=> setEditPersonType(e.target.value)}/></Col>

            </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showChart}
        onHide={() => setShowChart(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Custom Modal Styling
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <HighchartsReact
    highcharts={Highcharts}
    options={options}
  />
        </Modal.Body>
      </Modal>
        </Fragment>
    )
}

export default CRUD;