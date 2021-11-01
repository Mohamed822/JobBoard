import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Navbar, Nav, Row, Col, Container, Form, Modal, Button, NavDropdown,FloatingLabel } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PasswordChecklist from "react-password-checklist";
import { useEffect, useState } from "react";
import GetJobs from './GetJobs/GetJobs';
import Profile from './Profile/Profile';
import axios from 'axios';
import { decodeToken } from "react-jwt";
import Companies from './Companies/Companies';
import config from './config/config';
import Users from './users/Users';
import Infos from './infos/Infos';
import Landing from './landing/landing';

function App() {
  const url = config.url;
  const [showUser, setShowUser] = useState(false);
  const [showConnect, setShowConnect] = useState(false)
  const handleCloseConnect = () => setShowConnect(false);
  const handleShowConnect = () => setShowConnect(true);
  const [showRegisterApplicant, setShowRegisterApplicant] = useState(false);
  const handleCloseRegisterApplicant = () => setShowRegisterApplicant(false);
  const handleShowRegisterApplicant = () => setShowRegisterApplicant(true);
  const [showRegisterRecruiter, setShowRegisterRecruiter] = useState(false)
  const handleCloseRegisterRecruiter = () => setShowRegisterRecruiter(false);
  const handleShowRegisterRecruiter = () => setShowRegisterRecruiter(true);
  const [showRegisterSelect, setShowRegisterSelect] = useState(false)
  const handleCloseRegisterSelect = () => setShowRegisterSelect(false);
  const handleShowRegisterSelect = () => setShowRegisterSelect(true);
  const [Name, setName] = useState(null);
  const [Surname, setSurname] = useState(null);
  const [Tel, setTel] = useState(null);
  const [disabled, setDisableCheck] = useState(false);
  const [Bio, setBio] = useState(null);
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [imageType, setimageType]= useState('png');
  const [Email, setEmail] = useState(null);
  const [Password, setPassword] = useState('');
  const [PasswordAgain, setPasswordAgain] = useState("")
  const [passwordValid, setPasswordvalid] = useState(false);
  const handlePassTrue = () => setPasswordvalid(true);
  const handlePassFalse = () => setPasswordvalid(false);
  const [IsChecked, setChecked] = useState(false);
  const [userName, setUsername] = useState(localStorage.getItem('user'));
  const [status,setStatus] = useState(localStorage.getItem('status'));
  const [statusRegister, setStatusregister] = useState(null)
  const [showAdmin, setShowadmin] = useState(false);
  const [showRecruiter, setShowrecruiter] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [companyID, setCompID] = useState(0);

  const getData = () => {
    axios.get(url + 'companies').then(res => {
      setCompanies(res.data)
    }).catch(err => {
      console.log(err);
    })
  }
  useEffect(() => {
    getData();
    if (typeof userName === 'string') {
      setShowUser(true);
      setUsername(localStorage.getItem('user'));
    }
    setStatus(localStorage.getItem('status'));
    if(status === '2') {
      setShowadmin(true);
    } else if(status === '1') {
      setShowrecruiter(true);
    } else {
      setShowrecruiter(false);
      setShowadmin(false)
    }
  }, [status]);

  
  const sendFile = (id, file) => {
    const data = new FormData();
    data.append('file', file);
    axios.post(`${url}users/${id}/file`, data, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
      .then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
  };
  const login = () => {
    const loginData = {
      email: Email,
      password: Password
    }
    axios.post(`${url}users/login`, loginData).then(res => {
      const body = res.data;
      const success = body.success;
      if (success) {
        const token = body.token;
        const myDecodedToken = decodeToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', myDecodedToken.userName);
        localStorage.setItem('id', myDecodedToken.userID);
        localStorage.setItem('status',myDecodedToken.status);
        toast.success('Congrats ! You just logged in with your account,', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setShowConnect(false)
        setUsername(myDecodedToken.userName);
        setStatus(myDecodedToken.status);
        if(status === '2')
          setShowadmin(true)

      } else {
        const message = body.message;
        if (message === 'Password') {
          toast.error('Incorrect password !', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        else {
          toast.error('Email not registered yet !', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }

    })
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
  function registerSubmit() {
    var mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if(statusRegister === 0 ){
      if (!Surname || !Name || !Tel || !Email || !Bio || !Password ||!pdf ||!image || !passwordValid) {
      toastError('Something missing !') 
    }
    else {
      const ext = image.name.slice(-3);
      if (!Email.match(mailformat)) {
        toastError("this email isn't valid!")
      }
      else if(ext !=="png" && ext !== "jpg"){
        toast.error('image format not valid ! it must be a .JPG or .PNG ', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      else if(pdf.name.slice(-3)!== "pdf"){
        toast.error('PDF format not valid ! it must be a .PDF ', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      else {
        if (image.name.slice(-4) === '.jpg') {
          setimageType('jpg')
        }
        const registerData = {
          Name: Name,
          Surname: Surname,
          Email: Email,
          Password: Password,
          Status: statusRegister,
          Tel: Tel,
          Bio: Bio,
          imgType: imageType
        };
        axios.post(url + 'users', registerData).then(res => {
          if (!res.data) {
            toast.error('Email already exists !', {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
          else {
            const id = res.data.insertId;
            sendFile(id, pdf);
            sendFile(id, image);
            toast.success('Congrats ! You just created your account !', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setShowRegisterApplicant(false);
            setShowConnect(true);
            toast.info('You can now connect here !', {
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
    }
  }else if (statusRegister === 1) {
    if (!Name || !Surname || !Email || !passwordValid || !Tel) {
      toastError('Something missing !')
    } if (!Email.match(mailformat)) {
      toastError("this email isn't valid!")
    }

    else {
      if (companyID === 'Select your company :' && !IsChecked) {
        toast.error('Select checkbox or a company !', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      else {
        let registerData = {
          Name: Name,
          Surname: Surname,
          Email: Email,
          Password: Password,
          Status: statusRegister,
          Tel: Tel,
          id_Comp: 0
        };
        if (companyID !== 'Select your company :') {
          Object.assign(registerData, { id_Comp: companyID })
        }
        axios.post(url + 'users', registerData).then(res => {
          if (!res.data) {
            toast.error('Email already exists !', {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
          else {
            toast.success('Congrats ! You just created your account,', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            handleCloseRegisterRecruiter();
            handlePassFalse();
            setCompID(0);
            setShowConnect(true);
            toast.info('You can now connect here !', {
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
    }
  }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('status');
    localStorage.removeItem('id');
    toast.info('You just logged out !', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setShowUser(false);
    setUsername(false);
    setShowadmin(false);
    window.location.href = '/'
  }

  return (
    <div className="App">
      <header>
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
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <ToastContainer
          position="top-center"
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
          show={showConnect}
          onHide={handleCloseConnect}
          backdrop="static"
          size="lg"
          keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Authentification</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="name@example.com" onChange={e => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" onChange={e => setPassword(e.target.value)} />
              </Form.Group>
            </form>
            <Container>
              <Row>
                <Col md={{ span: 6, offset: 3 }}>
                  <p className="text-center"> no account? sign up <Button variant="link" onClick={() => { handleShowRegisterSelect(); handleCloseConnect(); }}> here </Button></p>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseConnect}>
              Close
            </Button>
            <Button variant="primary" type="submit" onClick={login}>
              sign in
            </Button>
          </Modal.Footer>
        </Modal>



        
 {/* ----------------------------------------SELECT STATUS MODAL---------------------------------------- */}

 <Modal
          show={showRegisterSelect}
          onHide={handleCloseRegisterSelect}
          backdrop="static"
          size="lg"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create a new account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4 className="text-center">Choose your Status:</h4>
            <div className="d-grid gap-2">
              <Button variant="primary" size="lg" onClick={() => { handleShowRegisterApplicant(); handleCloseRegisterSelect(); setStatusregister(0) }}>
                Applicant
              </Button>
              <Button variant="secondary" size="lg" onClick={() => { handleShowRegisterRecruiter(); handleCloseRegisterSelect(); setStatusregister(1) }}>
                Recruiter
              </Button>
            </div>
          </Modal.Body>

        </Modal>
        {/* ----------------------------------------SELECT STATUS MODAL---------------------------------------- */}

        {/* ----------------------------------------REGISTER APPLICANT MODAL---------------------------------------- */}

        <Modal
          show={showRegisterApplicant}
          onHide={handleCloseRegisterApplicant}
          backdrop="static"
          size="lg"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create a new applicant account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="FirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="First Name" onChange={e => setName(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="LastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Last Name" onChange={e => setSurname(e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="name@example.com" onChange={e => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>password: </Form.Label>
                <Form.Control type="password" onChange={e => setPassword(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Confirm password: </Form.Label>
                <Form.Control type="password" onChange={e => setPasswordAgain(e.target.value)} />
              </Form.Group>
              <PasswordChecklist
                rules={["minLength", "specialChar", "number", "capital", "match"]}
                minLength={5}
                value={Password}
                valueAgain={PasswordAgain}
                onChange={(isValid) => { 
                  if (isValid)
                    handlePassTrue();
                  else
                    handlePassFalse();}}
              />
              <Form.Group className="mb-3" controlId="tel">
                <Form.Label>Phone number</Form.Label>
                <Form.Control type="tel" onChange={e => setTel(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="Bio">
                <Form.Label>Bio</Form.Label>
                <Form.Control as="textarea" rows={3} onChange={e => setBio(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="formCV" className="mb-3">
                <Form.Label>CV</Form.Label>
                <Form.Control type="file" onChange={(e) => { setPdf(e.target.files[0]) }} />
              </Form.Group>
              <Form.Group controlId="formPfp" className="mb-3">
                <Form.Label>Profile picture</Form.Label>
                <Form.Control type="file" onChange={(e) => { setImage(e.target.files[0]) }} />
              </Form.Group>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseRegisterApplicant}>
              Close
            </Button>
            <Button variant="primary" onClick={() => registerSubmit()}>
              Register
            </Button>
          </Modal.Footer>
        </Modal>
        {/* ----------------------------------------REGISTER APPLICANT MODAL---------------------------------------- */}

        {/* ----------------------------------------REGISTER RECRUITER MODAL---------------------------------------- */}

        <Modal
          show={showRegisterRecruiter}
          onHide={handleCloseRegisterRecruiter}
          backdrop="static"
          size="lg"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create a new recruiter account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="FirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="First Name" onChange={e => setName(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="LastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Last Name" onChange={e => setSurname(e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="name@example.com" onChange={e => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>password:</Form.Label>
                <Form.Control type="password" onChange={e => setPassword(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Confirm password:</Form.Label>
                <Form.Control type="password" onChange={e => setPasswordAgain(e.target.value)} />
              </Form.Group>
              <PasswordChecklist
                rules={["minLength", "specialChar", "number", "capital", "match"]}
                minLength={5}
                value={Password}
                valueAgain={PasswordAgain}
                onChange={(isValid) => {
                  if (isValid)
                    handlePassTrue();
                  else
                    handlePassFalse();
                }}
              />
              <Form.Group className="mb-3" controlId="tel">
                <Form.Label>Phone number</Form.Label>
                <Form.Control type="tel" onChange={e => setTel(e.target.value)} />
              </Form.Group>
              <Row className="g-2">
                <Col md>
                  <FloatingLabel controlId="floatingSelectGrid">
                    <div>
                      <Form.Select value={companyID.Name} onChange={e => {
                        setCompID(e.target.value)
                      }}>

                        <option>Select your company :</option>
                        {companies.map((value, id) =>
                          <option value={value.id}>{value.Name}</option>
                        )}
                      </Form.Select></div>
                  </FloatingLabel>
                </Col>
                <Col md>
                  if your company is not in the list check this :
                  <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check disabled={disabled} type="checkbox" className="text-center" onClick={() => setChecked(true)} />
                  </Form.Group>
                </Col>
              </Row>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseRegisterRecruiter}>
              Close
            </Button>
            <Button variant="primary" onClick={() => registerSubmit()}>
              Register
            </Button>
          </Modal.Footer>
        </Modal>
        {/* ----------------------------------------REGISTER RECRUITER MODAL---------------------------------------- */}


        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
          <Container>
            <Navbar.Brand href="/">Job board  
            {showAdmin && ( <strong> for admin</strong>)} 
            {showRecruiter && ( <strong> for recruiter</strong>)} 
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
              </Nav>
              <Nav>
                {showAdmin && (<Nav.Link href="infos">Informations</Nav.Link>)}
                {showAdmin && (<Nav.Link href="users">Users</Nav.Link>)}
               { showAdmin  && (<Nav.Link href="companies">Entreprises</Nav.Link>) }
                <Nav.Link href="jobs">Offers</Nav.Link>
                {!showUser && (
                  <Nav.Link eventKey={2} onClick={handleShowConnect}>
                    Connect
                  </Nav.Link>)
                }
                {showUser && (
                  <NavDropdown
                    id="nav-dropdown-dark-example"
                    menuVariant="dark"
                    title={userName}
                    style={{ "backgroundColor": "rgb(52,58,64)" }}
                  > 
                    <NavDropdown.Item
                    onClick={()=>window.location.href = '/profile'}
                      menuVariant="dark"
                      as="button"
                      style={{ "backgroundColor": "rgb(52,58,64)" }}>My Profile</NavDropdown.Item>
                    <NavDropdown.Item style={{ "backgroundColor": "rgb(52,58,64)" }} onClick={logout}>logout</NavDropdown.Item>
                  </NavDropdown>)
                }
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      <div className="App-body">
        <BrowserRouter>
          <Switch>
            <Route path="/jobs" component={GetJobs}>
              <GetJobs />
            </Route>
            <Route path="/profile" component={Profile}>
              <Profile />
            </Route>
            <Route path="/companies" component={Companies}>
              <Companies />
            </Route>
            <Route path="/users" component={Users}>
                <Users/>
            </Route>
            <Route path="/infos" component={Infos}>
                <Infos/>
            </Route>
            <Route path="/" component={Landing}>
                <Landing/>
            </Route>
          </Switch>
        </BrowserRouter>
        <Container>

        </Container>
      </div>
    </div>
  );
}

export default App;