import React, { useContext, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../main";
import { deleteResume, fetchResume } from "../http/resumeAPI";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  Pagination
} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Resumes = observer(() => {
  const { resumes, user } = useContext(Context);

  const isEmployer = user.isAuth && user.user?.role === 'employer';
  const isAdmin    = user.isAuth && user.user?.role === 'ADMIN';
  const isSeeker = user.isAuth && user.user?.role === 'seeker'

  const [keyword,   setKeyword]   = useState('');
  const [minExp,    setMinExp]    = useState('');
  const [maxExp,    setMaxExp]    = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);

  // Загрузка резюме для работодателей и админов
  useEffect(() => {
    if (user.isAuth && (isEmployer || isAdmin || isSeeker )) {
      fetchResume()
        .then(data => resumes.setResumes(data))
        .catch(console.error);
    }
  }, [user.isAuth, isEmployer, isAdmin]);

  // Сбрасываем страницу при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, minExp, maxExp]);

  // Фильтрация
  const filtered = useMemo(() => {
    return resumes.resumes.filter(r => {
      const text = (r.firstName + r.lastName + r.experience).toLowerCase();
      if (keyword && !text.includes(keyword.toLowerCase())) return false;
      if (minExp && r.experience.length < +minExp) return false;
      if (maxExp && r.experience.length > +maxExp) return false;
      return true;
    });
  }, [resumes.resumes, keyword, minExp, maxExp]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex   = Math.min(startIndex + itemsPerPage, totalItems);
  const paginated  = filtered.slice(startIndex, endIndex);

  const resetFilters = () => {
    setKeyword(''); setMinExp(''); setMaxExp('');
  };

  const handleDelete = async (resumeId) => {
    if (!window.confirm('Удалить это резюме без возможности восстановления?')) return;
    setLoading(true);
    try {
      await deleteResume(resumeId);
      // перезагрузим список
      const data = await fetchResume();
      resumes.setResumes(data);
    } catch (err) {
      console.error('Ошибка удаления резюме:', err);
      alert('Не удалось удалить резюме.');
    } finally {
      setLoading(false);
    }
  };

const btnProps = {
    size: 'lg',
    className: 'me-2 mt-2',
    style: { minWidth: 100 }
};
  return (
    <Container fluid className="mt-4">
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            placeholder="Поиск по резюме..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            placeholder="Мин. опыт (симв.)"
            value={minExp}
            onChange={e => setMinExp(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            placeholder="Макс. опыт (симв.)"
            value={maxExp}
            onChange={e => setMaxExp(e.target.value)}
          />
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          <Button size="sm" variant="outline-secondary" onClick={resetFilters}>
            Сбросить фильтры
          </Button>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          {totalItems === 0 ? (
            <p>Ничего не найдено.</p>
          ) : (
            <>
              <p className="text-muted">
                Показаны {startIndex + 1}–{endIndex} из {totalItems}
              </p>
              {paginated.map(r => (
                <Card key={r.id} className="mb-3 shadow-sm">
                  <Card.Body className="d-flex justify-content-between">
                    <div>
                      <Card.Title>{r.firstName} {r.lastName}</Card.Title>
                      <Card.Text className="text-muted">
                        {r.experience.slice(0, 100)}…
                      </Card.Text>
                    </div>
                    <div className="d-flex">
                      {isAdmin && (
                        <Button
                          variant="danger"
                          className="me-2"
                          onClick={() => handleDelete(r.id)}
                          disabled={loading}
                          {...btnProps}
                        >
                          {loading ? 'Удаление...' : 'Удалить'}
                        </Button>
                      )}
                      <Button
                        as={NavLink}
                        to={`/resume/${r.id}`}
                        {...btnProps}
                      >
                        Подробнее
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}

              {totalPages > 1 && (
                <Pagination className="justify-content-center">
                  <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  />
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Pagination.Item
                      key={i}
                      active={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  />
                </Pagination>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
});

export default Resumes;
