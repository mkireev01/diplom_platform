import React, { useContext, useState } from 'react';
import { Context } from '../main';
import {
  Navbar,
  Container,
  Nav,
  Button,
  Modal,
  ListGroup
} from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { observer } from 'mobx-react-lite';
import CreateResume from './CreateResume';

const AppNav = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const isEmployer = user.user?.role === 'employer';
  const isCandidate = user.user?.role === 'seeker';

  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleOpenCreate    = () => setShowCreateModal(true);
  const handleCloseCreate   = () => setShowCreateModal(false);

  const handleProfileClick = () => setShowProfileModal(true);
  const handleClose = () => setShowProfileModal(false);

  const btnProps = {
    size: 'lg',
    className: 'me-2 mt-2',
    style: { minWidth: 120 }
  };

  const logout = () => {
    user.setUser({});
    user.setIsAuth(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isAuth");
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

              <Button
                as={NavLink}
                to="/vacancies"
                variant="outline-light"
                {...btnProps}
              >
                Вакансии
              </Button>

              {user.isAuth && (
               <Button
                 variant="success"
                 onClick={handleOpenCreate}
                 {...btnProps}
               >
                 {isEmployer ? 'Создать вакансию' : 'Создать резюме'}
               </Button>
              )}

              {!user.isAuth ? (
                <Button
                  as={NavLink}
                  to="/registration"
                  variant="light"
                  {...btnProps}
                >
                  Авторизация
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline-light"
                    onClick={logout}
                    {...btnProps}
                  >
                    Выход
                  </Button>
                  <Button
                    variant="light"
                    onClick={handleProfileClick}
                    {...btnProps}
                    style={{ ...btnProps.style, padding: '0.375rem' }}
                  >
                    <FaUserCircle style={{ fontSize: '1.5rem' }} />
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Модальное окно профиля */}
      <Modal show={showProfileModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Профиль</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            {isEmployer && (
              <ListGroup.Item
                action
                onClick={() => {
                  navigate('/my-vacancies');
                  handleClose();
                }}
              >
                Мои вакансии
              </ListGroup.Item>
            )}
            {isCandidate && (
              <ListGroup.Item
                action
                onClick={() => {
                  navigate('/my-resumes');
                  handleClose();
                }}
              >
                Мои резюме
              </ListGroup.Item>
            )}
            <ListGroup.Item
              action
              onClick={() => {
                navigate('/profile');
                handleClose();
              }}
            >
              Профиль
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
      

      {/* Модалка CreateResume/CreateVacancy */}
     <CreateResume
       show={showCreateModal}
      onHide={handleCloseCreate}
     />
    </>
  );
});

export default AppNav;
