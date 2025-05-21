import React, { useContext, useState, useEffect } from 'react';
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
import CreateItem from './CreateItem';
import ChatPanel from '../pages/ChatPanel';
import { createCompany } from '../http/companyAPI';
import { createVacancy } from '../http/vacancyAPI';
import axios from 'axios';

const AppNav = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const isEmployer = user.user?.role === 'employer';
  const isCandidate = user.user?.role === 'seeker';

 
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showVacancyModal, setShowVacancyModal] = useState(false);


  const [companyName, setCompanyName] = useState('');
  const [companyDesc, setCompanyDesc] = useState('');
  const [savingCompany, setSavingCompany] = useState(false);

 
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [salaryFrom, setSalaryFrom] = useState('');
  const [salaryTo, setSalaryTo] = useState('');
  const [savingVacancy, setSavingVacancy] = useState(false);

  useEffect(() => {
 
    if (user.isAuth && !user.companyId) {
      user.loadMyCompany();
    }
  }, [user.isAuth]);

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    user.setUser({});
    user.setIsAuth(false);
    navigate('/');
  };

  const handleSaveCompany = async () => {
    setSavingCompany(true);
    try {
      const newCompany = await createCompany(companyName, companyDesc);
      user.setCompany(newCompany);
      setCompanyName('');
      setCompanyDesc('');
      setShowCompanyModal(false);
    } catch (err) {
      console.error('Ошибка создания компании:', err);
    } finally {
      setSavingCompany(false);
    }
  };

  const handleSaveVacancy = async () => {
    if (!user.companyId) return;
    setSavingVacancy(true);
    try {
      const vacancyData = { title, description: shortDesc, fullDescription: fullDesc, salaryFrom: Number(salaryFrom), salaryTo: Number(salaryTo) };
      await createVacancy(user.companyId, vacancyData);
      setTitle(''); setShortDesc(''); setFullDesc(''); setSalaryFrom(''); setSalaryTo('');
      setShowVacancyModal(false);
    } catch (err) {
      console.error('Ошибка создания вакансии:', err);
    } finally {
      setSavingVacancy(false);
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="fw-bold">FindJob</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar" className="justify-content-end">
            <Nav className="d-flex align-items-center">
              <Button as={NavLink} to="/vacancies" variant="outline-light" size="lg" className="me-2 mt-2" style={{ minWidth: 120 }}>Вакансии</Button>
              {user.isAuth ? (
                <>
                  {isEmployer && (
                    <>
                      <Button variant="warning" onClick={() => setShowCompanyModal(true)} size="lg" className="me-2 mt-2" style={{ minWidth: 120 }}>Создать компанию</Button>
                      <Button variant="success" onClick={() => setShowVacancyModal(true)} size="lg" className="me-2 mt-2" style={{ minWidth: 120 }} disabled={!user.companyId}>Создать вакансию</Button>
                    </>
                  )}
                  {isCandidate && (
                    <Button variant="success" onClick={() => setShowCreateModal(true)} size="lg" className="me-2 mt-2" style={{ minWidth: 120 }}>Создать резюме</Button>
                  )}
                  <ChatPanel />
                  <Button variant="outline-light" onClick={logout} size="lg" className="me-2 mt-2" style={{ minWidth: 120 }}>Выход</Button>
                  <Button variant="light" onClick={() => setShowProfileModal(true)} size="lg" className="mt-2" style={{ padding: '0.375rem' }}><FaUserCircle style={{ fontSize: '1.5rem' }} /></Button>
                </>
              ) : (
                <Button as={NavLink} to="/login" variant="light" size="lg" className="me-2 mt-2" style={{ minWidth: 120 }}>Авторизация</Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

     
      <CreateItem show={showCreateModal} onHide={() => setShowCreateModal(false)} />

      <Modal show={showCompanyModal} onHide={() => setShowCompanyModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Создать компанию</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Название компании" value={companyName} onChange={e => setCompanyName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control as="textarea" rows={4} placeholder="Описание компании" value={companyDesc} onChange={e => setCompanyDesc(e.target.value)} />
            </Form.Group>
            <Button variant="primary" onClick={handleSaveCompany} disabled={savingCompany}>Сохранить</Button>
          </Form>
        </Modal.Body>
      </Modal>

     
      <Modal show={showVacancyModal} onHide={() => setShowVacancyModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Создать вакансию</Modal.Title></Modal.Header>
        <Modal.Body>
          {!user.companyId ? (
            <p>Сначала создайте компанию.</p>
          ) : (
            <Form>
              <Form.Group className="mb-3"><Form.Control type="text" placeholder="Заголовок" value={title} onChange={e => setTitle(e.target.value)} /></Form.Group>
              <Form.Group className="mb-3"><Form.Control type="text" placeholder="Краткое описание" value={shortDesc} onChange={e => setShortDesc(e.target.value)} /></Form.Group>
              <Form.Group className="mb-3"><Form.Control as="textarea" rows={4} placeholder="Полное описание" value={fullDesc} onChange={e => setFullDesc(e.target.value)} /></Form.Group>
              <Form.Group className="mb-3"><Form.Control type="number" placeholder="Зарплата от" value={salaryFrom} onChange={e => setSalaryFrom(e.target.value)} /></Form.Group>
              <Form.Group className="mb-3"><Form.Control type="number" placeholder="Зарплата до" value={salaryTo} onChange={e => setSalaryTo(e.target.value)} /></Form.Group>
              <Button variant="primary" onClick={handleSaveVacancy} disabled={savingVacancy}>Сохранить</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

    
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Профиль</Modal.Title></Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            {isEmployer && (
              <>  
                <ListGroup.Item action onClick={() => { navigate('/my-vacancies'); setShowProfileModal(false); }}>Мои вакансии</ListGroup.Item>
                <ListGroup.Item action onClick={() => { navigate('/my-companies'); setShowProfileModal(false); }}>Мои компании</ListGroup.Item>
              </>
            )}
            {isCandidate && <ListGroup.Item action onClick={() => { navigate('/my-resumes'); setShowProfileModal(false); }}>Мои резюме</ListGroup.Item>}
            <ListGroup.Item action onClick={() => { navigate('/profile'); setShowProfileModal(false); }}>Профиль</ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </>
  );
});

export default AppNav;