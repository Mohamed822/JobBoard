import React from 'react';
import { Row, Col, Container, Button, } from 'react-bootstrap';

function Landing() {

    return (
        <Container>
            <Row Style={"color:white"} className="mb-5">
                
                <h1>Hi 👋<br /> Welcome to your job Board <br/> 👨🏻‍💻</h1>
               
            </Row>
            <Button variant="success" size="lg" onClick={() => window.location.href = '/jobs'}> Apply to an offer</Button>
        </Container>
    )

}
export default Landing