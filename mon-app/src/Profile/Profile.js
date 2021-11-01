import React, { useEffect, useState } from "react";
import './Profile.css';
import { FaFilePdf, FaFileImage } from 'react-icons/fa';
import { Form, Button, Container, Row, Col, Alert, Modal } from 'react-bootstrap'
import axios from "axios";
import PasswordChecklist from "react-password-checklist"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config/config';

function Profile() {
    const url = config.url
    const [Applicant_name, setApplicant_name] = useState(null);
    const [Applicant_surname, setApplicant_surname] = useState(null);
    const [Applicant_email, setApplicant_email] = useState(null);
    const [id_Comp, setIdcomp] = useState(null);
    const [Tel, setTel] = useState(null);
    const [Bio, setBio] = useState(null);
    const [status, setStatus] = useState(null);
    const userID = localStorage.getItem('id');
    const [showChangePassword, setShowChangePassword] = useState(false)
    const handleCloseChangePassword = () => setShowChangePassword(false);
    const handleShowChangePassword = () => setShowChangePassword(true);
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [alertEmailShow, setalertEmailShow] = useState(false);
    const [alertPasswordShow, setalertPasswordShow] = useState(false);
    const [passwordValid, setPasswordvalid] = useState(false);
    const handlePassTrue = () => setPasswordvalid(true);
    const handlePassFalse = () => setPasswordvalid(false);
    const [show, setShow] = useState(false);
    const [id] = useState(localStorage.getItem('id'));
    const [img, setImg] = useState(null);
    const [pdf, setPdf] = useState(null);
    const [compObject, setCompobject] = useState(null);

    const getCompany = () => {
        if (status === 0) {
            setShow(true);
        }
        if (status === 1) {
            axios.get(url + 'companies/' + id_Comp)
                .then(res => {
                    setCompobject(res.data[0]);
                })
                .catch(err => console.log(err))
        }
    }
    const getProfile = async () => {
        const res = await axios.get(url + 'users/' + id);
        const data = res.data[0];
        const imgPath = data.img;
        const pdfPath = data.pdf;
        setImg(`${url}static/img/${imgPath.slice(-6)}`)
        setPdf(`${url}static/pdf/${pdfPath.slice(-6)}`)
        setApplicant_name(data.Name);
        setApplicant_surname(data.Surname);
        setApplicant_email(data.Email);
        setTel(data.Tel);
        setBio(data.Bio);
        setStatus(data.Status);
        setIdcomp(data.id_Comp)
    }
    useEffect(() => {
        if (status === null)
            getProfile();
    }, [status])

    useEffect(() => {
        if (compObject === null && status !== null)
            getCompany();
    }, [id_Comp])

    function submitModification() {
        var mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!Applicant_email.match(mailformat)) {
            setalertEmailShow(true)
        } else {
            const userData = {
                id: userID,
                Name: Applicant_name,
                Surname: Applicant_surname,
                Email: Applicant_email,
                Status: status,
                Tel: Tel,
                Bio: Bio,
            };
            axios.put(`${url}users`, userData)
                .then(res => {
                    if (res.status === 200) {
                        // setalertSuccessShow(true)
                        toast.success('Modification sent!', {
                            position: "bottom-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            progress: undefined,
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    function submitPassword() {
        if (password === null || !passwordValid) {
            toast.error('Password must be valid !', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });

        }

        else {
            const userData = {
                id: userID,
                password: password
            };
            axios.put(`${url}users/resetpassword`, userData)
                .then(res => {
                    if (res.status === 200) {
                        // setalertSuccessShow(true)
                        handleCloseChangePassword();
                        toast.success('Password updated', {
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
                .catch(err => {
                    console.log(err);
                })
        }
    }

    return (

        <Container className="m-5 mt-10" style={{ "backgroundColor": "white" }}>
            <Row>
                <Col className="text-center m-4">

                            <img width="100px" height="100px"
                            src="https://media.istockphoto.com/vectors/business-man-icon-male-face-silhouette-with-office-suit-and-tie-user-vector-id1194657253?k=20&m=1194657253&s=612x612&w=0&h=3ITnX773lL3l1i5wAyw75-BfBig1GgkbMFIZYNwyGZ8=" />
                    <h1>profile</h1>
                </Col>
            </Row>
            <form>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="FirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder={Applicant_name} onChange={e => setApplicant_name(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="LastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" placeholder={Applicant_surname} onChange={e => setApplicant_surname(e.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder={Applicant_email} onChange={e => setApplicant_email(e.target.value)} />
                </Form.Group>
                <Alert show={alertEmailShow} variant="danger" onClose={() => setalertEmailShow(false)} dismissible>
                    <Alert.Heading>Oh snap! You're Email is not valid!</Alert.Heading>
                </Alert>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="*******" onClick={handleShowChangePassword} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="tel">
                    <Form.Label>Phone number</Form.Label>
                    <Form.Control type="tel" placeholder={Tel} onChange={e => setTel(e.target.value)} />
                </Form.Group>
                {
                    !show && (

                        <Container>

                        </Container>
                    )
                }
                {
                    show && (

                        <Container>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="Bio">
                                        <Form.Label>Bio</Form.Label>
                                        <Form.Control as="textarea" rows={3} placeholder={Bio} onChange={e => setBio(e.target.value)} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col sm={2}>

                                            <Button variant="light" className="mt-3" href={pdf} target="_blank" size="lg">
                                                <FaFilePdf />   </Button>
                                        </Col>
                                        <Col sm={10}>
                                            <Form.Group controlId="formCV" className="mb-3">
                                                <Form.Label className="center">CV</Form.Label>
                                                <Form.Control type="file" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col sm={2}>

                                            <Button variant="light" className="mt-3" href={img} target="_blank" size="lg">
                                                <FaFileImage />   </Button>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="formPfp" className="mb-3">
                                                <Form.Label>Profile picture</Form.Label>
                                                <Form.Control type="file" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                    )
                }

            </form>
            <Row>
                <Col className="text-center">
                    <Button className="m-3" onClick={submitModification}>Submit modification</Button>
                    {
                        compObject === undefined && (
                            <Container>
                                <h1 className="text-center">Your company</h1>
                                <Button className="m-3" onClick={()=>window.location.href = '/companies'}> Create company</Button>
                            </Container>
                        )
                    }
                </Col>
            </Row>
            <form>
                {
                    (!show && compObject !== null && compObject !== undefined) && (
                        <Container>
                            <h1 className="text-center">Your company</h1>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="FirstName">
                                        <Form.Label>Company Name</Form.Label>
                                        <Form.Control type="text" placeholder={compObject.Name} readOnly />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="LastName">
                                        <Form.Label>Company Sector</Form.Label>
                                        <Form.Control type="text" placeholder={compObject.Sector} readOnly />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="FirstName">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control type="text" placeholder={compObject.Address} readOnly />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="LastName">
                                        <Form.Label>date of creation</Form.Label>
                                        <Form.Control type="text" placeholder={(compObject.Date_Cr).substring(0, 10)} readOnly />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <h3 className="text-center">Company contact</h3>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="FirstName">
                                        <Form.Label>Phone number</Form.Label>
                                        <Form.Control type="text" placeholder={compObject.Tel} readOnly />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="LastName">
                                        <Form.Label>Address email</Form.Label>
                                        <Form.Control type="text" placeholder={compObject.Email} readOnly />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="text-center">
                                    <Button className="mb-3" onClick={() => {window.location.href = '/companies'}} >Modify company information</Button>
                                </Col>
                            </Row>
                        </Container>

                    )
                }
            </form>
            <Modal
                show={showChangePassword}
                onHide={handleCloseChangePassword}
                backdrop="static"
                size="lg"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Change password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>New password:</Form.Label>
                            {/* <Form.Control type="password" onChange={e => setApplicant_password(e.target.value)} /> */}
                            <Form.Control type="password" onChange={e => setPassword(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password Again:</Form.Label>
                            <Form.Control type="password" onChange={e => setPasswordAgain(e.target.value)} />
                        </Form.Group>
                        <PasswordChecklist
                            rules={["minLength", "specialChar", "number", "capital", "match"]}
                            minLength={5}
                            value={password}
                            valueAgain={passwordAgain}
                            onChange={(isValid) => {
                                if (isValid)
                                    handlePassTrue();
                                else
                                    handlePassFalse();
                            }}
                        />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseChangePassword}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" onClick={() => { submitPassword() }}>
                        Submit new password
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
       
    )
}

export default Profile