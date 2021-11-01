import './Companies.css';
import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Modal, Form, Alert } from 'react-bootstrap';
import config from '../config/config';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import { FaTrashAlt, FaBuilding, FaUserEdit } from 'react-icons/fa';
var _ = require('lodash');
function Companies() {

    const [companies, setCompanies] = useState([]);
    const status = localStorage.getItem('status');
    const [showAdmin, setShowadmin] = useState(false);
    const [showRecruiter, setShowrecruiter] = useState(false);
    const [showAddComp, setShowAddComp] = useState(false);
    const [RecruiterID, setRecruiterID] = useState(null);
    const [showdelete, setshowDelete] = useState(false);
    const [compID, setCompID] = useState(null);
    const id = localStorage.getItem('id');
    const handleCloseDialog = () => setshowDelete(false);
    const [showCreateComp, setShowCreateComp] = useState(false);
    const handleShowCreateComp = () => setShowCreateComp(true);
    const handleCloseCreateComp = () => setShowCreateComp(false);
    const [showModifyComp, setShowModifyComp] = useState(false);
    const handleShowModifyComp = () => setShowModifyComp(true);
    const handleCloseModifyComp = () => setShowModifyComp(false);
    const [compName, setCompName] = useState(null);
    const [compAddress, setCompAddress] = useState(null);
    const [compTel, setCompTel] = useState(null);
    const [compEmail, setCompEmail] = useState(null);
    const [compDate_Cr, setCompDate_Cr] = useState(null);
    const [compSector, setCompSector] = useState(null);
    const [alertEmailShow, setalertEmailShow] = useState(false);
    const [compObjet, setCompObjet] = useState(null);



    useEffect(() => {
        const getData = async () => {

            const AllCompanies = (await axios.get(config.url + 'companies')).data.reverse();
            if (status === '2') {
                setCompanies(AllCompanies);
                setShowadmin(true)
            } else {
                axios.get(config.url + 'users/' + id).then(res => {
                    const data = res.data[0];
                    setRecruiterID(data.id_Comp);
                }).catch(err => {
                    console.log(err);
                })
                if (RecruiterID === 0) {
                    setShowAddComp(true);
                } else {
                    const result  = AllCompanies.filter(comp => {
                        return comp.id === RecruiterID;
                    })
                    setCompanies(result);
                    setShowrecruiter(true);
                }
            }

        }
        getData();
    }, [status, RecruiterID])

    const showButtonInComp = (id) => {
        if (id === RecruiterID) {
            return true;
        }
        else {
            return false;
        }
    }
    function toastr(message,type){
        if(type==='success'){
        toast.success(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
        }
        else if(type){
            toast.error(message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
    }
    function sendDelete() {
        axios.delete(config.url + 'companies/' + compID).then(res => {
            if (res.status === 200) {
                const updateData = {
                    id: id,
                    id_Comp: 0
                }
                axios.put(config.url + 'users', updateData).then(res => {
                    toastr('Congrats ! You just delete the company with id : ' + compID,true);
                })
                handleCloseDialog();
                const result = companies.filter((value,index)=>{
                    return value.id !== compID;
                });
                setCompanies(result)
            } else {
                toast.error('An error occured !', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        })
    }

    const deleteCompany = (id) => {
        setCompID(id);
        setshowDelete(true);
    }

    function modifyCompany(company) {
        handleShowModifyComp();
        setCompObjet(company);
    }

    function submitComp() {

        var mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

        if (RecruiterID === 0) {
            if (!compName || !compAddress || !compTel || !compEmail || !compDate_Cr || !compSector) {
                toast.error('Something is missing', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });
            } else if (!compEmail.match(mailformat)) {
                toast.error('Email format not valid', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });            
            } else {

                const compData = {
                    Name: compName,
                    Address: compAddress,
                    Tel: compTel,
                    Email: compEmail,
                    Date_Cr: compDate_Cr,
                    Sector: compSector
                }
                axios.post(`${config.url}companies`, compData)
                    .then(res => {
                        if (res.status === 200) {
                            toast.success('Congrats ! You just added your company ', {
                                position: "top-right",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                            handleCloseCreateComp();
                            const updateUser = {
                                id: id,
                                id_Comp: res.data.insertId
                            }
                            axios.put(`${config.url}users`, updateUser)
                                .catch(err =>  console.log(err) )
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        } else {
            if (!compName && !compAddress && !compTel && !compEmail && !compDate_Cr && !compSector) {
                toast.error('No modification to send', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });
            } 
            else if (compEmail !==null && !compEmail.match(mailformat)) {
                setalertEmailShow(true)
            } else {
                setalertEmailShow(false)
                const compData = {
                    id:compObjet.id,
                    Name: compName,
                    Address: compAddress,
                    Tel: compTel,
                    Email: compEmail,
                    Date_Cr: compDate_Cr,
                    Sector: compSector
                }
                const atLeast9Wins = _.flow([
                    Object.entries,
                    arr => arr.filter(([key, value]) => value !== null),
                    Object.fromEntries
                  ])(compData);
                axios.put(config.url+'companies',atLeast9Wins).then(res => {
                    if(res.status === 200){
                    toast.success('Modification sent', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                    });
                    handleCloseModifyComp()        
                }
                else {
                    toast.error('No modification to send', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                    });
                }
                })
            }

        }
    }
    return (
        <div className="parent">
            {
                (showAdmin || showAddComp) && (
                    <Row>
                        <Col sm={5}></Col>
                        <Col sm={6}>
                            <Button className="m-2" variant="success" size="lg" onClick={handleShowCreateComp}>
                                Create a company <FaBuilding />
                            </Button></Col>
                    </Row>
                )
            }
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <SweetAlert
                danger
                showCancel
                show={showdelete}
                confirmBtnText="Yes"
                cancelBtnBsStyle="light"
                cancelBtnText="No"
                confirmBtnBsStyle="danger"
                title="Are you sure ?"
                onConfirm={sendDelete}
                onCancel={handleCloseDialog}
                focusCancelBtn
            >
                Are your sure to delete this company ?
            </SweetAlert>

            
            
            
            {showAddComp && (
                            <p className="v15">You don’t have a company registered yet, Create one by clicking the button !</p>
                            )}
            {(!showAddComp || showAdmin) && (
            <Row>
                <Col sm={2}></Col>
                <Col sm={10}>
                    <Table className="table" responsive striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th># id</th>
                                <th>Company Name</th>
                                <th>Sector</th>
                                <th>Email</th>
                                <th>Adress</th>
                                <th>Phone</th>
                                <th>Creation date</th>
                                {(showAdmin || showRecruiter) && (
                                    <th>Action</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                companies.map(comp => (
                                    <tr>
                                        <td>{comp.id}</td>
                                        <td>{comp.Name}</td>
                                        <td>{comp.Sector}</td>
                                        <td>{comp.Email}</td>
                                        <td>{comp.Address}</td>
                                        <td>{comp.Tel}</td>
                                        <td>{comp.Date_Cr.substring(0, 10)}</td>
                                        {showButtonInComp(comp.id) && 
                                        (<td>
                                            <Row>
                                                <Col sm={6}>
                                                    <Button variant="warning" onClick={() => modifyCompany(comp)}>Modify <FaUserEdit /></Button>
                                                </Col>
                                                <Col sm={6}>
                                                    <Button onClick={() => { deleteCompany(comp.id) }} variant="danger">Delete <FaTrashAlt /></Button>
                                                </Col>
                                            </Row>
                                        </td>
                                        )}
                                        {showAdmin && (<td> <Button onClick={() => { deleteCompany(comp.id) }} variant="danger">Delete <FaTrashAlt /></Button></td>)}
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
            )}
            <Modal
                show={showCreateComp}
                onHide={handleCloseCreateComp}
                backdrop="static"
                size="lg"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Create your company</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Company name:</Form.Label>
                            <Form.Control type="text" onChange={e => setCompName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Sector of activity:</Form.Label>
                            <Form.Control type="text" onChange={e => setCompSector(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Date of creation:</Form.Label>
                            <Form.Control type="date" onChange={e => setCompDate_Cr(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Address:</Form.Label>
                            <Form.Control type="text" onChange={e => setCompAddress(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Tel:</Form.Label>
                            <Form.Control type="tel" onChange={e => setCompTel(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="email" onChange={e => setCompEmail(e.target.value)} />
                        </Form.Group>
                        <Alert show={alertEmailShow} variant="danger" onClose={() => setalertEmailShow(false)} dismissible>
                            <Alert.Heading>Oh snap! You're Email is not valid!</Alert.Heading>
                        </Alert>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCreateComp}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" onClick={() => { submitComp() }}>
                        Create company
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={showModifyComp}
                onHide={handleCloseModifyComp}
                backdrop="static"
                size="lg"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify your company's information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {compObjet !== null && (

                        <form>
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Your Company name : {compObjet.Name}</Form.Label>
                                <Form.Control type="text" onChange={e => setCompName(e.target.value)} placeholder={compObjet.Name} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Your Sector of activity : {compObjet.Sector}</Form.Label>
                                <Form.Control type="text" onChange={e => setCompSector(e.target.value)} placeholder= {compObjet.Sector} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Your Date of creation :   {(compObjet.Date_Cr).substring(0, 10)}</Form.Label>
                                <Form.Control type="date" onChange={e =>{
                                    var chooseDate= new Date(e.target.value);
                                    // chooseDate.setDate(chooseDate.getDate()+1);
                                    setCompDate_Cr(chooseDate.toISOString())} } />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Your Address : {compObjet.Address}</Form.Label>
                                <Form.Control type="text" onChange={e => setCompAddress(e.target.value)} placeholder= {compObjet.Address} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Your Tel : {compObjet.Tel}</Form.Label>
                                <Form.Control type="tel" maxLength="8" onChange={e => setCompTel(e.target.value)} placeholder={compObjet.Tel} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Your Email : {compObjet.Email}</Form.Label>
                                <Form.Control type="email" onChange={e => setCompEmail(e.target.value)} placeholder={compObjet.Email} />
                            </Form.Group>
                            <Alert show={alertEmailShow} variant="danger" onClose={() => setalertEmailShow(false)} dismissible>
                                <Alert.Heading>Oh snap! You're Email is not valid!</Alert.Heading>
                            </Alert>
                        </form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModifyComp}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" onClick={() => { submitComp() }}>
                        Submit modification
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )

}
export default Companies;