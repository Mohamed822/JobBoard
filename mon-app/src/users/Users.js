import './Users.css';
import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Modal, Table, Button, Container } from 'react-bootstrap';
import config from '../config/config';
import axios from 'axios';
import { FaUserEdit, FaUserAlt, FaTrashAlt } from 'react-icons/fa';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Users() {

  const [Users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDialog, setShowdialog] = useState(false);
  const [userID, setUserID] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userSurname, setUserSurname] = useState(null);
  const [userTel, setUserTel] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [changedStatus, setChangestatus] = useState(null);
  const [dialogMessage, setDialog] = useState('');
  const [showdelete, setshowDelete] = useState(false);
  const handleCloseDialog = () => setShowdialog(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  useEffect(() => {
    const getData = () => {
      axios.get(config.url + 'users').then(res => {
        setUsers(res.data);

      }).catch(err => {
        console.log(err);
      })
    }
    getData()

  }, []);
  const convertStatus = (stat) => {
    if (typeof stat === 'number') {
      switch (stat) {
        case 0:
          return 'Applicant';
        case 1:
          return 'Recruiter';
        case 2:
          return 'Admin';
        default:
          return 'unknown'
      }
    } else {
      switch (stat) {
        case 'Applicant':
          return 0;
        case 'Recruiter':
          return 1;
        case 'Admin':
          return 2;
        default:
          return 'unknown'
      }
    }
  }
  function modifyUser(user) {
    setUserID(user.id);
    setUserName(user.Name);
    setUserEmail(user.Email);
    setUserSurname(user.Surname);
    setUserTel(user.Tel);
    setUserStatus(user.Status);
    setChangestatus(convertStatus(user.Status));

    handleShowModal();
  }
  function sendUpdate() {
    const data = {
      id: userID,
      Status: convertStatus(changedStatus)
    }
    axios.put(config.url + 'users', data).then(res => {
      if (res.data) {
        toast.success('Congrats ! You just changed the status of ' + userName, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        handleCloseDialog()
      }

    }).catch(err => {
      console.log(err);
    })
  }
  function sendChanges() {
    setDialog(`you want to change the status of ${userName} to ${changedStatus} ?`)
    handleCloseModal()
    const status = convertStatus(userStatus);
    if (changedStatus !== status) {
      setShowdialog(true);
    }
  }
  function deleteUser(user) {
    setUserID(user.id);
    setDialog(`Your want to delete ${user.Name} account ?`);
    setshowDelete(true);

  }

  function sendDelete() {
    const data = {
      id: userID
    }
    axios.delete(`${config.url}users/${userID}`).then(res => {
      console.log(res)
      if (res.status === 200) {
        setshowDelete(false);
        toast.success('Congrats ! You just deleted the account', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }).catch(err => {
      console.log(err)
    })
  }
  return (
    <div className="parent">

      <SweetAlert
        warning
        showCancel
        show={showDialog}
        confirmBtnText="Yes"
        cancelBtnBsStyle="light"
        cancelBtnText="No"
        confirmBtnBsStyle="danger"
        title="Are you sure ?"
        onConfirm={sendUpdate}
        onCancel={handleCloseDialog}
        focusCancelBtn
      >
        {dialogMessage}
      </SweetAlert>

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
        {dialogMessage}
      </SweetAlert>
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
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        backdrop="static"
        size="lg"
        keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Change the status of {userName} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
              <Form.Label column sm="2">
                Email :
              </Form.Label>
              <Col sm="10">
                <Form.Control plaintext readOnly defaultValue={userEmail} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
              <Form.Label column sm="2">
                Surname :
              </Form.Label>
              <Col sm="10">
                <Form.Control plaintext readOnly defaultValue={userSurname} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
              <Form.Label column sm="2">
                Tel :
              </Form.Label>
              <Col sm="10">
                <Form.Control plaintext readOnly defaultValue={userTel} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
              <Form.Label column sm="2">
                Status :
              </Form.Label>
              <Col sm="4">
                <Form.Select value={changedStatus} onChange={(e) => setChangestatus(e.target.value)}>
                  <option value="Applicant">Applicant</option>
                  <option value="Recruiter">Recruiter</option>
                  <option value="Admin">Admin</option>
                </Form.Select>
              </Col>
            </Form.Group>


          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={() => sendChanges()} >
            Change
          </Button>
        </Modal.Footer>
      </Modal>
      <Row>
        <Col sm={11}>
        <h2 class="title"> All Users
</h2>        </Col>
      </Row>
      <Row>
        <Col sm={2}></Col>
        <Col sm={10}>
          <Table className="table" responsive striped bordered hover variant="dark">
            <thead>
              <tr>
                <th># id</th>
                <th>Name</th>
                <th>Surname</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                Users.map((user, key) => (
                  <tr>
                    <td>{user.id}</td>
                    <td>{user.Name}</td>
                    <td>{user.Surname}</td>
                    <td>{user.Email}</td>
                    <td>{user.Tel}</td>
                    <td>{convertStatus(user.Status)}</td>
                    <td>
                      <Row>
                        <Col sm={6}>
                          <Button onClick={() => modifyUser(user)} variant="warning">Modify <FaUserEdit /></Button>
                        </Col>
                        <Col sm={6}>
                          <Button variant="danger" onClick={() => deleteUser(user)} >Delete <FaTrashAlt /></Button>
                        </Col>
                      </Row>
                    </td>

                  </tr>
                ))
              }
            </tbody>
          </Table>

        </Col>

      </Row>
    </div>
  )

}
export default Users;