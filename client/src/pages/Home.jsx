import React, { useContext, useState, useMemo, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../main';
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  Pagination,
  Modal,
  Spinner
} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { createApplication } from '../http/vacancyAPI';
import { fetchVacancy } from '../http/vacancyAPI';
import { fetchResume } from '../http/resumeAPI';
import { createChat, sendMessage } from '../http/chatAPI';
import { fetchCompanyById } from '../http/companyAPI';

const Home = observer(() => {
  const { user, vacancies, resumes } = useContext(Context);
  const isSeeker = user.isAuth && user.user?.role === 'seeker';

  const [keyword, setKeyword] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showModal, setShowModal] = useState(false);
  const [selectedVacancyId, setSelectedVacancyId] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Грузим вакансии и резюме текущего пользователя
  useEffect(() => {
    fetchVacancy().then(data => vacancies.setVacancies(data));
    if (isSeeker) {
      fetchResume().then(data => {
        // Сохраняем только резюме текущего пользователя
        const myResumes = data.filter(r => r.userId === user.user.id);
        resumes.setResumes(myResumes);
      });
    }
  }, [user.isAuth, user.user?.role]);

  // Сброс страницы при фильтрах
  useEffect(() => setCurrentPage(1), [keyword, minSalary, maxSalary]);

  const filtered = useMemo(() => vacancies.vacancies.filter(v => {
    const text = (v.title + v.description).toLowerCase();
    if (keyword && !text.includes(keyword.toLowerCase())) return false;
    if (minSalary && v.salaryTo < +minSalary) return false;
    if (maxSalary && v.salaryFrom > +maxSalary) return false;
    return true;
  }), [vacancies.vacancies, keyword, minSalary, maxSalary]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginated = filtered.slice(startIndex, endIndex);

  const openApplyModal = vacancyId => {
    if (resumes.resumes.length === 0) return;
    setSelectedVacancyId(vacancyId);
    setCoverLetter('');
    setSelectedResumeId(resumes.resumes[0]?.id || '');
    setShowModal(true);
  };

  const handleSubmitApplication = async () => {
    if (!selectedResumeId) return;
    setSubmitting(true);
    try {
      await createApplication({ vacancyId: selectedVacancyId, resumeId: selectedResumeId, coverLetter });
      const vacancy = vacancies.vacancies.find(v => v.id === selectedVacancyId);
      const company = await fetchCompanyById(vacancy.companyId);
      const employerId = company.userId;

      const resumeUrl = `${window.location.origin}/resume/${selectedResumeId}`;
      const msgContent = coverLetter
        ? `Сопроводительное письмо: "${coverLetter}"<br/>Резюме: <a href=\"${resumeUrl}\" target=\"_blank\">Посмотреть резюме</a>`
        : `Резюме: <a href=\"${resumeUrl}\" target=\"_blank\">Посмотреть резюме</a>`;

      const { chatId } = await createChat({ seekerId: user.user.id, employerId });
      await sendMessage({ chatId, senderId: user.user.id, content: msgContent });

      setShowModal(false);
      alert('Отклик отправлен работодателю');
    } catch (err) {
      console.error(err);
      alert('Ошибка при отправке отклика');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container fluid className="mt-4">
      {/* Поиск и фильтры */}
      <Row className="mb-3">
        <Col>
          <Form.Control
            placeholder="Поиск вакансий..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <Card className="p-3 mb-4 shadow-sm">
            <h5>Фильтры</h5>
            <Form.Group className="mb-2">
              <Form.Label>Зарплата от</Form.Label>
              <Form.Control
                type="number"
                value={minSalary}
                onChange={e => setMinSalary(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Зарплата до</Form.Label>
              <Form.Control
                type="number"
                value={maxSalary}
                onChange={e => setMaxSalary(e.target.value)}
              />
            </Form.Group>
            <Button size="sm" variant="outline-secondary" onClick={() => { setKeyword(''); setMinSalary(''); setMaxSalary(''); }}>
              Сбросить
            </Button>
          </Card>
        </Col>
        <Col md={9}>
          {totalItems === 0
            ? <p>Ничего не найдено.</p>
            : (
              <>
                <p className="text-muted">Показаны {startIndex + 1}–{endIndex} из {totalItems}</p>
                {paginated.map(v => (
                  <Card key={v.id} className="mb-3 shadow-sm">
                    <Card.Body className="d-flex justify-content-between">
                      <div>
                        <Card.Title>{v.title}</Card.Title>
                        <Card.Text className="text-muted">{v.description.slice(0, 100)}…</Card.Text>
                      </div>
                      <div className="d-flex">
                        {isSeeker && <Button className="me-2" onClick={() => openApplyModal(v.id)}>Откликнуться</Button>}
                        <Button as={NavLink} to={`/vacancy/${v.id}`}>Подробнее</Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
                {totalPages > 1 && (
                  <Pagination className="justify-content-center">
                    <Pagination.Prev disabled={currentPage===1} onClick={() => setCurrentPage(p=>p-1)} />
                    {Array.from({length:totalPages}).map((_,i)=>(
                      <Pagination.Item key={i} active={currentPage===i+1} onClick={()=>setCurrentPage(i+1)}>{i+1}</Pagination.Item>
                    ))}
                    <Pagination.Next disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>p+1)} />
                  </Pagination>
                )}
              </>
            )}
        </Col>
      </Row>

      {/* Модалка отклика */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Отклик на вакансию</Modal.Title></Modal.Header>
        <Modal.Body>
          {resumes.resumes.length === 0
            ? <Spinner animation="border" />
            : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Выберите резюме</Form.Label>
                  <Form.Select value={selectedResumeId} onChange={e=>setSelectedResumeId(e.target.value)}>
                    {resumes.resumes.map(r=><option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Сопроводительное письмо</Form.Label>
                  <Form.Control as="textarea" rows={4} value={coverLetter} onChange={e=>setCoverLetter(e.target.value)} />
                </Form.Group>
              </>
            )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowModal(false)}>Отмена</Button>
          <Button variant="primary" onClick={handleSubmitApplication} disabled={submitting||!selectedResumeId}>{submitting?'Отправка…':'Отправить'}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
});

export default Home;
