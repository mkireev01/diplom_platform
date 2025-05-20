import React, { useContext, useState } from 'react';
import { Context } from '../main';
import {
  Navbar,
  Container,
  Nav,
  Button,
  Modal,
  ListGroup,
  Form
} from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { observer } from 'mobx-react-lite';
import CreateResume from './CreateResume';
import { createCompany } from '../http/companyAPI';
import axios from 'axios';

const AppNav = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const isEmployer = user.user?.role === 'employer';
  const isCandidate = user.user?.role === 'seeker';

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  const handleOpenCreate = () => setShowCreateModal(true);
  const handleCloseCreate = () => setShowCreateModal(false);

  const handleOpenCompany = () => setShowCompanyModal(true);
  const handleCloseCompany = () => setShowCompanyModal(false);

  const handleProfileClick = () => setShowProfileModal(true);
  const handleCloseProfile = () => setShowProfileModal(false);

  const btnProps = {
    size: 'lg',
    className: 'me-2 mt-2',
    style: { minWidth: 120 }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    user.setUser({});
    user.setIsAuth(false);
    navigate('/');
  };

  // Company form state
  const [companyName, setCompanyName] = useState('');
  const [companyDesc, setCompanyDesc] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveCompany = async () => {
    setSaving(true);
    try {
      await createCompany(companyName, companyDesc);
      setCompanyName('');
      setCompanyDesc('');
      handleCloseCompany();
    } catch (err) {
      console.error('Ошибка создания компании:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="fw-bold">
            FindJob
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar" className="justify-content-end">
            <Nav className="d-flex align-items-center">
              <Button as={NavLink} to="/vacancies" variant="outline-light" {...btnProps}>
                Вакансии
              </Button>

              {user.isAuth && (
                <>
                  {isEmployer && (
                    <>
                      <Button variant="success" onClick={handleOpenCreate} {...btnProps}>
                        Создать вакансию
                      </Button>
                      <Button variant="warning" onClick={handleOpenCompany} {...btnProps}>
                        Создать компанию
                      </Button>
                    </>
                  )}
                  {isCandidate && (
                    <Button variant="success" onClick={handleOpenCreate} {...btnProps}>
                      Создать резюме
                    </Button>
                  )}
                </>
              )}

              {!user.isAuth ? (
                <Button as={NavLink} to="/login" variant="light" {...btnProps}>
                  Авторизация
                </Button>
              ) : (
                <>
                  <Button variant="outline-light" onClick={logout} {...btnProps}>
                    Выход
                  </Button>
                  <Button variant="light" onClick={handleProfileClick} {...btnProps} style={{ padding: '0.375rem' }}>
                    <FaUserCircle style={{ fontSize: '1.5rem' }} />
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Profile Modal */}
      <Modal show={showProfileModal} onHide={handleCloseProfile} centered>
        <Modal.Header closeButton>
          <Modal.Title>Профиль</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            {isEmployer && (
              <>
                <ListGroup.Item action onClick={() => { navigate('/my-vacancies'); handleCloseProfile(); }}>
                  Мои вакансии
                </ListGroup.Item>
                <ListGroup.Item action onClick={() => { navigate('/my-companies'); handleCloseProfile(); }}>
                  Мои компании
                </ListGroup.Item>
              </>
            )}
            {isCandidate && (
              <ListGroup.Item action onClick={() => { navigate('/my-resumes'); handleCloseProfile(); }}>
                Мои резюме
              </ListGroup.Item>
            )}
            <ListGroup.Item action onClick={() => { navigate('/profile'); handleCloseProfile(); }}>
              Профиль
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>

      {/* Create Resume/Vacancy Modal */}
      <CreateResume show={showCreateModal} onHide={handleCloseCreate} />

      {/* Create Company Modal */}
      <Modal show={showCompanyModal} onHide={handleCloseCompany} centered>
        <Modal.Header closeButton>
          <Modal.Title>Создать компанию</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Введите название компании"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Введите описание компании"
                value={companyDesc}
                onChange={e => setCompanyDesc(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSaveCompany} disabled={saving}>
              Сохранить
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
});

export default AppNav;
