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
import { createApplication, deleteVacancy, fetchVacancy } from '../http/vacancyAPI';
import { fetchResume } from '../http/resumeAPI';
import { createChat, sendMessage } from '../http/chatAPI';
import { fetchCompanyById } from '../http/companyAPI';

const Home = observer(() => {
  const { user, vacancies, resumes } = useContext(Context);
  const isEmployer = user.isAuth && user.user?.role === 'employer';
  const isSeeker = user.isAuth && user.user?.role === 'seeker';
  const isAdmin = user.isAuth && user.user?.role === 'ADMIN';

  // Shared pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Seeker filters
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [datePosted, setDatePosted] = useState('');

  // Employer filters
  const [minExp, setMinExp] = useState('');
  const [maxExp, setMaxExp] = useState('');

  // Application modal
  const [showModal, setShowModal] = useState(false);
  const [selectedVacancyId, setSelectedVacancyId] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading,    setLoading]    = useState(false);

  // Load data
  useEffect(() => {
    fetchVacancy().then(data => vacancies.setVacancies(data));
    fetchResume().then(data => {
      if (isSeeker) {
        resumes.setResumes(data.filter(r => r.userId === user.user.id));
      } else if (isEmployer) {
        resumes.setResumes(data);
      } else {
        resumes.setResumes([]);
      }
    });
  }, [user.isAuth, user.user?.role]);

  // Reset page on filter change
  useEffect(() => setCurrentPage(1), [keyword, location, jobType, minSalary, maxSalary, datePosted, minExp, maxExp]);

  // Filtered lists
  const filteredVacancies = useMemo(() => vacancies.vacancies.filter(v => {
    if (keyword && !(`${v.title} ${v.description}`.toLowerCase()).includes(keyword.toLowerCase())) return false;
    if (location && v.location.toLowerCase() !== location.toLowerCase()) return false;
    if (jobType && v.type !== jobType) return false;
    if (minSalary && v.salaryTo < +minSalary) return false;
    if (maxSalary && v.salaryFrom > +maxSalary) return false;
    if (datePosted) {
      const diff = Date.now() - new Date(v.postedAt);
      if (datePosted === '24h' && diff > 86400000) return false;
      if (datePosted === 'week' && diff > 604800000) return false;
      if (datePosted === 'month' && diff > 2592000000) return false;
    }
    return true;
  }), [vacancies.vacancies, keyword, location, jobType, minSalary, maxSalary, datePosted]);

  const filteredResumes = useMemo(() => resumes.resumes.filter(r => {
    if (keyword && !(`${r.firstName}${r.lastName}${r.experience}`.toLowerCase()).includes(keyword.toLowerCase())) return false;
    // Optionally parse experience years from r.experience text if numeric filters desired
    return true;
  }), [resumes.resumes, keyword]);

  // Paginate
  const items = isEmployer ? filteredResumes : filteredVacancies;
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginated = items.slice(startIndex, endIndex);

  const btnProps = { size: 'sm', className: 'me-2' };

  // Handlers
  const openApplyModal = id => { setSelectedVacancyId(id); setCoverLetter(''); setSelectedResumeId(resumes.resumes[0]?.id || ''); setShowModal(true); };
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

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить эту вакансию без восстановления?')) return;
    setLoading(true);
    try {
      await deleteVacancy(id);
      const data = await fetchVacancy();
      vacancies.setVacancies(data);
    } catch (err) {
      console.error(err);
      alert('Ошибка удаления');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container fluid className="mt-4">
      {/* Filters & List Row */}
      <Row>
        <Col md={3}>
          <Card className="p-3 mb-4 shadow-sm">
            <h5>Фильтры</h5>
            {(isSeeker || !user.isAuth || isAdmin) && (
              <> 
                <Form.Group className="mb-2">
                  <Form.Label>Поиск</Form.Label>
                  <Form.Control placeholder="Ключевое слово" value={keyword} onChange={e => setKeyword(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Локация</Form.Label>
                  <Form.Control placeholder="Город" value={location} onChange={e => setLocation(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Тип занятости</Form.Label>
                  <Form.Select value={jobType} onChange={e => setJobType(e.target.value)}>
                    <option value="">Любой</option>
                    <option value="fulltime">Полная</option>
                    <option value="parttime">Частичная</option>
                    <option value="remote">Удаленная</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Дата размещения</Form.Label>
                  <Form.Select value={datePosted} onChange={e => setDatePosted(e.target.value)}>
                    <option value="">Все</option>
                    <option value="24h">За 24 часа</option>
                    <option value="week">За неделю</option>
                    <option value="month">За месяц</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>ЗП от</Form.Label>
                  <Form.Control type="number" value={minSalary} onChange={e => setMinSalary(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>ЗП до</Form.Label>
                  <Form.Control type="number" value={maxSalary} onChange={e => setMaxSalary(e.target.value)} />
                </Form.Group>
              </>
            )}
            {(isEmployer && user.isAuth) && (
              <>
                <Form.Group className="mb-2">
                  <Form.Label>Поиск</Form.Label>
                  <Form.Control placeholder="Поиск" value={keyword} onChange={e => setKeyword(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Мин. опыт</Form.Label>
                  <Form.Control placeholder="Мин. лет" value={minExp} onChange={e => setMinExp(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Макс. опыт</Form.Label>
                  <Form.Control placeholder="Макс. лет" value={maxExp} onChange={e => setMaxExp(e.target.value)} />
                </Form.Group>
              </>
            )}
            <Button size="sm" variant="outline-secondary" onClick={() => {
              setKeyword(''); setLocation(''); setJobType(''); setDatePosted(''); setMinSalary(''); setMaxSalary(''); setMinExp(''); setMaxExp('');
            }}>Сбросить всё</Button>
          </Card>
        </Col>

        <Col md={9}>
          {paginated.length === 0 ? <p>Ничего не найдено.</p> : (
            <>  
              <p className="text-muted">Показаны {startIndex + 1}-{endIndex} из {totalItems}</p>
              {paginated.map(item => (
                <Card key={item.id || item.firstName} className="mb-3 shadow-sm">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                      <Card.Title>{isEmployer ? `${item.firstName} ${item.lastName}` : item.title}</Card.Title>
                      <Card.Text className="text-muted">
                        {isEmployer ? item.experience : `${item.salaryFrom}-${item.salaryTo} BYN`}
                      </Card.Text>
                    </div>
                    <div className="d-flex">
                      {isSeeker && <Button {...btnProps} variant="primary" onClick={() => openApplyModal(item.id)}>Откликнуться</Button>}
                      {isAdmin && <Button
                          variant="danger"
                          onClick={() => handleDelete(item.id)}
                          disabled={loading}
                          {...btnProps}
                        >
                          Удалить
                        </Button>}
                      <Button {...btnProps} variant="secondary" as={NavLink} to={isEmployer ? `/resume/${item.id}` : `/vacancy/${item.id}`}>Подробнее</Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="justify-content-center">
              <Pagination.Prev size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} />
              {Array.from({ length: totalPages }).map((_, i) => (
                <Pagination.Item key={i} size="sm" active={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>{i + 1}</Pagination.Item>
              ))}
              <Pagination.Next size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} />
            </Pagination>
          )}
        </Col>
      </Row>

      {/* Application Modal for seeker */}
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
