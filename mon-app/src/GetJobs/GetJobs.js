import './GetJobs.css'
import React from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useState, useEffect } from "react";
import { Card, Row, Col, Button, Modal, Form, Alert,FloatingLabel,InputGroup,FormControl } from 'react-bootstrap';
import config from '../config/config';

function GetJobs() {
  const url = config.url
  const [annonces, setAnnonces] = useState([]);
  const href = "#collapseExample";

  const [show, setShow] = useState(false);
  const [alertShow, setalertShow] = useState(false);
  const [alertEmailShow, setalertEmailShow] = useState(false);
  const [alertSuccessShow, setalertSuccessShow] = useState(false);
  const [title, setTitle] = useState('');
  const [id_Ads, setId_Ads] = useState(null);
  const [id_Comp, setId_Comp] = useState(null);
  const [company_name, setCompany_name] = useState(null);
  const [id_recruiter, SetId_recruiter] = useState(null);
  const [recruiter_email, setRecruiter_email] = useState(null);
  const [Applicant_email, setApplicant_email] = useState(null);
  const [Applicant_name, setApplicant_name] = useState(null);
  const [Applicant_surname, setApplicant_surname] = useState(null);
  const [status, setStatus] = useState(3)
  const [Tel, setTel] = useState(null);

// JOB APPLICATION
  const [Jobtitle,setJobtitle] = useState(null);
  const [Short_desc,setShort_desc] = useState(null);
  const [Startdate,setStartdate] = useState(null);
  const [Hours,setHours] = useState(null);
  const [Salary,setSalary] = useState(null);
  const [Location,setLocation] = useState(null);
  const [Full_Desc,setFull_Desc] = useState(null);
  const [companies,setCompanies] = useState(null);
  const [comp_id, setCompid] = useState(null);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const handleCloseCreateJob = () => setShowCreateJob(false);
  const handleOpenCreateJob = () => setShowCreateJob(true);
// JOB APPLICATION
  
  const [message, setMessage] = useState(null);
  const [showForm, setShowform] = useState(false);
  const userID = localStorage.getItem('id');
  const Userstatus = localStorage.getItem('status');
  const [showApply, setShowApply] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showdelete, setshowDelete] = useState(false);
  const [jobID, setjobID] = useState(null);
  const [deleteAds, setDeleteads] = useState(false);
  const dialogMessage = "Are you sure you want to delete this Job Application ?";

  const hideDeleteDialog = () => {
    setshowDelete(false);
    setjobID(null);
  }
  const toastError = (str) => {
    toast.error(str, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  const toastSuccess = (str) => {
    toast.success(str, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  const checkStatus = () => {
    if (userID) {
      setShowform(true);
    }
    if (Userstatus) {
      if (Userstatus !== '0') {
        setShowApply(true);
        getCompanies();
        if(Userstatus === '2') {
          setDeleteads(true);
        }
      }
    }
  }

  async function getCompanies (){
    const res = await axios.get(config.url + 'companies')
    setCompanies(res.data)  
  }
  async function getData() {
    const res = await axios.get(`${url}jobs`)
    setAnnonces(res.data);

  }
  useEffect(() => {
    getData();
    checkStatus();
  }, [userID, url, Userstatus, showApply, showForm])

  function renderData(data) {
    setTitle(data.Job);
    setId_Ads(data.id);
    setId_Comp(data.id_Comp);
    setCompany_name(data.Company);
    SetId_recruiter(data.id_recruiter);
    setRecruiter_email(data.recruiter_email);
    if (showForm) {
      setShowform(true);
      const userID = localStorage.getItem('id')
      axios.get(`${url}users/${userID}`).then(res => {
        const data = res.data[0];
        setApplicant_name(data.Name);
        setApplicant_surname(data.Surname);
        setApplicant_email(data.Email);
        setTel(data.Tel);
        setStatus(data.Status);
      })
    }
    handleShow();
  }

  const sendAppForm = () => {
    const data = {
      id_Ads: id_Ads,
      id_Comp: id_Comp,
      Company_name: company_name,
      Applicant_email: Applicant_email,
      Message: message,
      id_Recruiter: id_recruiter,
      Recruiter_email: recruiter_email,
      Status: status,
      Applicant_name: Applicant_name,
      Applicant_surname: Applicant_surname,
      Tel: Tel
    }
    axios.post(`${url}infos`, data)
      .then(res => {
        if (res.status === 200) {
          setShow(false);
          // setalertSuccessShow(true)
          toastSuccess('Perfect ! you just send an Application !')
        }
      })
      .catch(err => {
      })
  }
  function sendApplication() {
    var mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!Applicant_surname || !Applicant_name || !Tel || !message || !Applicant_email) {
      setalertShow(true)
    }
    else {
      setalertShow(false);
      if (!Applicant_email.match(mailformat)) {
        setalertEmailShow(true)
      }
      else {
        setalertEmailShow(false);
        sendAppForm();
      }
    }
  }
  const showDeleteDialog = (job) => {
    setjobID(job.id)
    setshowDelete(true);
  };

  function deleteJob () {
    axios.delete(`${url}jobs/${jobID}`).then(res => {
      if(res.status===200){
        toastSuccess('Good Job ! You just Erased one 😉 ');
        hideDeleteDialog();
        const arrDeleted = annonces.filter((value,index)=>{
          return value.id !== jobID;
        });
        setAnnonces(arrDeleted)
      }
    })
  }

  function addDeleteForRecruiter (jobs) {
    if(Userstatus===1){
      if(jobs.id_recruiter == userID){
        return true;
    } else {
      return false
    }
    }
  }

  const getDays = (year, month, day) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date();
    const secondDate = new Date(year, month - 1, day);
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
  }

  function sendJobCreation(){
    if(!Short_desc || !Jobtitle || !Startdate || !Hours || !Location || comp_id === "Select your company :" || !Salary || !Full_Desc ){
    toastError('Something missing !')
    }
    else {
      const compObject = companies.find( obj => {
        return obj.id = comp_id;
      });
      const data = {
          Company: compObject.Name,
          Description: Full_Desc,
          Short_desc: Short_desc,
          Salary: Salary,
          Work_hours: Hours,
          Start_date: Startdate,
          Place: Location,
          Job: Jobtitle,
          id_Comp:comp_id,
          id_recruiter:userID,
          recruiter_email:compObject.Email
      };
      axios.post(`${url}jobs`,data).then(res => {
        if(res.status === 200){
          toastSuccess('Good Job ! You just created One 😉 ')
          handleCloseCreateJob();
        } else {
          toastError('An error happened !')
        }
      })
    }
  }

  return (
    <div className="m-4">
     <SweetAlert
        danger
        showCancel
        show={showdelete}
        confirmBtnText="Yes"
        cancelBtnBsStyle="light"
        cancelBtnText="No"
        confirmBtnBsStyle="danger"
        title="Are you sure ?"
        onConfirm={deleteJob}
        onCancel={hideDeleteDialog}
        focusCancelBtn
      >
        {dialogMessage}
      </SweetAlert>
      <Row className="m-4">

        <Alert variant="success" show={alertSuccessShow} onClose={() => setalertSuccessShow(false)} dismissible>
          <Alert.Heading>Perfect ! you just send an Application !</Alert.Heading>
          <p>
            Create an account to have more information about all your applications !
          </p>
        </Alert>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {showApply && (
          <Row>
            <Col sm={8}></Col>
            <Col sm={4}><Button className="mt-5" sm={2} variant="success" size="lg" onClick={handleOpenCreateJob}>
              Create a Job
            </Button>
            </Col>
          </Row>
        )}


{/* ----------------------------------------CREATE JOB MODAL---------------------------------------- */}

<Modal
show={showCreateJob}
onHide={handleCloseCreateJob}
backdrop="static"
size="lg"
keyboard={false}
>
<Modal.Header closeButton>
  <Modal.Title>Create a new Job</Modal.Title>
</Modal.Header>
<Modal.Body>

  <form>
    <Row>
      <Col>
        <Form.Group className="mb-3" controlId="FirstName">
          <Form.Label>Job Title</Form.Label>
          <Form.Control type="text" placeholder="Job Title" onChange={e => setJobtitle(e.target.value)} />
        </Form.Group>
      </Col>
      <Col>
        <Form.Group className="mb-3" controlId="LastName">
          <Form.Label>Short Description</Form.Label>
          <Form.Control type="text" placeholder="Short Description" onChange={e => setShort_desc(e.target.value)} />
        </Form.Group>
      </Col>
    </Row>
    <Form.Group className="mb-3" controlId="email">
      <Form.Label>Start Date</Form.Label>
      <Form.Control type="date" onChange={e => setStartdate(e.target.value)} />
    </Form.Group>

    <Form.Group className="mb-3" controlId="LastName">
          <Form.Label>Working Hours</Form.Label>
          <Form.Control type="text" placeholder="Working Hours" onChange={e => setHours(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="LastName">
          <Form.Label>Location</Form.Label>
          <Form.Control type="text" placeholder="Location" onChange={e => setLocation(e.target.value)} />
        </Form.Group>

        <FloatingLabel controlId="floatingSelectGrid" className="mb-2">
                    {companies && (<div>
                      <Form.Select value={comp_id} onChange={e => {
                      setCompid(e.target.value)
                      }}>

                        <option>Select your company :</option>
                        {companies.map((value, id) =>
                           <option value={value.id}>{value.Name}</option>
                         )}
                      </Form.Select>
                      </div>)
                  }</FloatingLabel>
    
                  <InputGroup className="mt-3">
        <InputGroup.Text>€</InputGroup.Text>
        <FormControl type="tel" id="inlineFormInputGroup" placeholder="Salary" onChange = {e=> setSalary(e.target.value)} />
      </InputGroup>
    <Form.Group className="mb-3" controlId="Bio">
      <Form.Label>Full Description</Form.Label>
      <Form.Control as="textarea" rows={3} onChange={e => setFull_Desc(e.target.value)} />
    </Form.Group>
  </form>
</Modal.Body>
<Modal.Footer>
  <Button variant="secondary" onClick={handleCloseCreateJob}>
    Close
  </Button>
  <Button variant="primary" onClick={() => sendJobCreation()}>
    Create
  </Button>
</Modal.Footer>
</Modal>
{/* ----------------------------------------CREATE JOB MODAL---------------------------------------- */}


        {
          annonces.map((jobs, index) => (
            <Col className='m-4' sm={5} xs={3}>
              <Card className="text-center">
                <Card.Header className="title-card">
                  <Row>
                    <Col sm={12} className="text-center"> {jobs.Job} </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  <Card.Title>Short Description :</Card.Title>
                  <Card.Text>
                    {jobs.Short_desc}
                  </Card.Text>
                  <a class="btn btn-primary" data-toggle="collapse" href={href + index} role="button" aria-expanded="false" aria-controls={(href + index).substring(1)}>
                    Learn more
                  </a>
                  <Button variant="success" className="ml-1" onClick={() => renderData(jobs)}>Apply</Button>
                  {showApply || addDeleteForRecruiter(jobs) && (<Button variant="danger" className="ml-1" onClick={() => showDeleteDialog(jobs)}>Delete</Button>)}
                  {addDeleteForRecruiter(jobs) && (<Button variant="danger" className="ml-1" onClick={() => showDeleteDialog(jobs)}>Delete</Button>)}
                  {deleteAds && (<Button variant="danger" className="ml-1" onClick={() => showDeleteDialog(jobs)}>Delete</Button>)}

                  <div class="collapse" id={(href + index).substring(1)}>
                    <div class="card card-body">
                      <ul className="text-left">
                        <li > <span className="text-left">Company :</span><strong> {jobs.Company} </strong></li>
                        <li> <span>Title :</span><strong> {jobs.Job} </strong></li>
                        <li> <span> Description :</span> {jobs.Description} </li>
                        <li> <span> Working Time :</span> <strong> {jobs.Work_hours} </strong> </li>
                        <li> <span> Starting :</span> <strong> {(jobs.Start_date).substring(0, 10)} </strong> </li>
                        <li> <span> Place :</span> <strong> {jobs.Place} </strong> </li>
                        <li> <span> Salary :</span> <strong> {jobs.Salary} € Brut / Mois</strong></li>
                      </ul>
                    </div>
                  </div>
                </Card.Body>
                {/* ---------------------MODAL APPLICATION ------------------ */}
                <Card.Footer className="text-muted">{getDays(jobs.Date.substring(0, 4), jobs.Date.substring(5, 7), jobs.Date.substring(8, 10))} days ago</Card.Footer>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title><strong>Apply for the Job </strong>{title} </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Alert show={alertShow} variant="danger" onClose={() => setalertShow(false)} dismissible>
                        <Alert.Heading>Oh snap! You are missing something in the Form!</Alert.Heading>
                        <p>
                          Check that you have entered all your infos.
                        </p>
                      </Alert>
                      <Alert show={alertEmailShow} variant="danger" onClose={() => setalertEmailShow(false)} dismissible>
                        <Alert.Heading>Oh snap! You're Email is not valid!</Alert.Heading>
                      </Alert>
                      {!showForm && (<Form>

                        <Form.Group className="mb-3" controlId="FirstName">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control type="text" placeholder="First Name" onChange={e => setApplicant_name(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="LastName">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control type="text" placeholder="Last Name" onChange={e => setApplicant_surname(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                          <Form.Label>Email address</Form.Label>
                          <Form.Control type="email" placeholder="name@example.com" onChange={e => setApplicant_email(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="tel">
                          <Form.Label>Phone number</Form.Label>
                          <Form.Control type="tel" onChange={e => setTel(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="message">
                          <Form.Label>Message to recruiter</Form.Label>
                          <Form.Control as="textarea" rows={3} onChange={e => setMessage(e.target.value)} />
                        </Form.Group>
                      </Form>)}
                      {showForm && (<Form>
                        <Form.Group className="mb-3" controlId="message">
                          <Form.Label>Message to recruiter</Form.Label>
                          <Form.Control as="textarea" rows={3} onChange={e => setMessage(e.target.value)} />
                        </Form.Group>
                      </Form>)}
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                      <Button variant="primary" onClick={() => sendApplication()}>
                        Send Application
                      </Button>
                    </Modal.Footer>
                  </Modal>
                {/* ---------------------MODAL APPLICATION ------------------ */}
              </Card>
            </Col>
            
          ))
        }
      </Row>
    </div>
  )

}

export default GetJobs