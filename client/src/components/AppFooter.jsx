import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const AppFooter = () => {
  return (
    <footer className="bg-dark text-light py-2">
      <Container>
        <Row className="gy-3">
          {/* О платформе */}
          <Col md={4}>
            <h6 className="mb-2">О платформе</h6>
            <p className="small mb-0">
              Найдите работу мечты или подберите кандидата. Удобный интерфейс и поддержка 24/7.
            </p>
          </Col>

          {/* Контакты */}
          <Col md={4}>
            <h6 className="mb-2">Контакты</h6>
            <p className="small mb-1">
              <FaMapMarkerAlt className="me-1" />
              ул. Примерная, д.10, Минск
            </p>
            <p className="small mb-1">
              <FaPhoneAlt className="me-1" />
              +375 (29) 123-45-67
            </p>
            <p className="small mb-0">
              <FaEnvelope className="me-1" />
              info@example.com
            </p>
          </Col>

          {/* Соцсети */}
          <Col md={4}>
            <h6 className="mb-2">Мы в соцсетях</h6>
            <Nav className="flex-row mb-1">
              <Nav.Link href="#" className="text-light me-2 fs-6"><FaFacebookF /></Nav.Link>
              <Nav.Link href="#" className="text-light me-2 fs-6"><FaTwitter /></Nav.Link>
              <Nav.Link href="#" className="text-light fs-6"><FaLinkedinIn /></Nav.Link>
            </Nav>
            <p className="small mb-0">
              Подписывайтесь, чтобы не пропустить новинки!
            </p>
          </Col>
        </Row>

        <hr className="border-secondary my-2" />

        <Row>
          <Col className="text-center">
            <small>&copy; {new Date().getFullYear()} FindJob. Все права защищены.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default AppFooter;
