import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../main';
import { Container, Card, Row, Col, ListGroup, Button, Badge, Spinner } from 'react-bootstrap';
import { FaUserCircle, FaBriefcase, FaBuilding, FaFileAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { fetchCompany } from '../http/companyAPI';

const UserProfile = observer(() => {
  const { user, vacancies, resumes, companies } = useContext(Context);

  useEffect(() => {
    if (user.isAuth && user.user.role === 'employer') {
      fetchCompany()
        .then(data => companies.setCompany(Array.isArray(data) ? data : [data]))
        .catch(err => console.error('Ошибка загрузки компаний:', err));
    }
  }, [user.isAuth, user.user]);

  if (!user.isAuth) {
    return (
      <Container className="mt-4 text-center">
        <p>Пожалуйста, авторизуйтесь, чтобы просмотреть профиль.</p>
      </Container>
    );
  }

  const { firstName, lastName, email, role, createdAt } = user.user;

  const vacancyCount = vacancies?.vacancies?.length ?? 0;
  const resumeCount = resumes?.resumes?.length ?? 0;
  const companyCount = companies?.companies?.length ?? 0; resumes.resumes.length;

  return (
    <Container fluid className="mt-4">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <div className="mb-3">
                <FaUserCircle style={{ fontSize: '4rem', color: '#6c757d' }} />
              </div>
              <Card.Title>{`${firstName} ${lastName}`}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {role === 'employer' ? 'Работодатель' : 'Соискатель'}
              </Card.Subtitle>
              <ListGroup variant="flush" className="text-start my-3">
                <ListGroup.Item>
                  <strong>Email:</strong> {email}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Дата регистрации:</strong> {new Date(createdAt).toLocaleDateString()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Роль:</strong> {role}
                </ListGroup.Item>
              </ListGroup>

              {role === 'employer' ? (
                <div className="d-grid gap-2">
                  <Button as={NavLink} to="/my-vacancies" variant="outline-primary">
                    <FaBriefcase /> Мои вакансии{' '}
                  </Button>
                  <Button as={NavLink} to="/my-companies" variant="outline-secondary">
                    <FaBuilding /> Мои компании{' '}
                  </Button>
                </div>
              ) : (
                <div className="d-grid gap-2">
                  <Button as={NavLink} to="/my-resumes" variant="outline-success">
                    <FaFileAlt /> Мои резюме{' '}
                    <Badge bg="secondary">{resumeCount}</Badge>
                  </Button>
                </div>
              )}

              <div className="mt-4 text-muted small">
                Здесь отображена ваша основная информация. В дальнейшем вы сможете
                редактировать профиль и добавлять контакты.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
});

export default UserProfile;
