import React, { useContext, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../main";
import { fetchVacancy, deleteVacancy } from "../http/vacancyAPI";
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
import { useLocation } from "react-router-dom";

const Vacancies = observer(() => {
  const { vacancies, user } = useContext(Context);

  const isSeeker = user.isAuth && user.user?.role === 'seeker';
  const isAdmin  = user.isAuth && user.user?.role === 'ADMIN';
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userIdParam = queryParams.get('userId'); // строка или null

  const [keyword,    setKeyword]    = useState('');
  const [minSalary, setMinSalary]  = useState('');
  const [maxSalary, setMaxSalary]  = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading,    setLoading]    = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user.isAuth && (isSeeker || isAdmin)) {
      fetchVacancy()
        .then(data => vacancies.setVacancies(data))
        .catch(console.error);
    }
  }, [user.isAuth, isSeeker, isAdmin, vacancies]);


  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, minSalary, maxSalary]);

  const filtered = useMemo(() => {
    return vacancies.vacancies.filter(v => {
      if (userIdParam && String(v.userId) !== String(userIdParam)) return false;
      const txt = (v.title + v.description).toLowerCase();
      if (keyword && !txt.includes(keyword.toLowerCase())) return false;
      if (minSalary && v.salaryTo   < +minSalary) return false;
      if (maxSalary && v.salaryFrom > +maxSalary) return false;
      return true;
    });
  }, [vacancies.vacancies, keyword, minSalary, maxSalary, userIdParam]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex   = Math.min(startIndex + itemsPerPage, totalItems);
  const pageItems  = filtered.slice(startIndex, endIndex);

  const resetFilters = () => {
    setKeyword(''); setMinSalary(''); setMaxSalary('');
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

  

  const btnProps = { size: 'sm', className: 'me-2' };

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Левая колонка — Фильтры */}
        <Col md={3}>
          <Card className="p-3 mb-4 shadow-sm">
            <h6>Фильтры</h6>
            <Form.Group className="mb-2">
              <Form.Control
                placeholder="Поиск..."
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                size="sm"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="small">Зарплата от</Form.Label>
              <Form.Control
                type="number"
                value={minSalary}
                onChange={e => setMinSalary(e.target.value)}
                size="sm"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="small">Зарплата до</Form.Label>
              <Form.Control
                type="number"
                value={maxSalary}
                onChange={e => setMaxSalary(e.target.value)}
                size="sm"
              />
            </Form.Group>
            <Button variant="outline-secondary" size="sm" onClick={resetFilters}>
              Сбросить
            </Button>
          </Card>
        </Col>

        {/* Правая колонка — Список вакансий */}
        <Col md={9}>
          {totalItems === 0 ? (
            <p>Ничего не найдено.</p>
          ) : (
            <>
              <p className="text-muted small">
                {startIndex + 1}–{endIndex} из {totalItems}
              </p>

              {pageItems.map(v => (
                <Card key={v.id} className="mb-3 shadow-sm">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                      <Card.Title className="mb-1">{v.title}</Card.Title>
                      <Card.Text className="small text-muted mb-0">
                        {v.description.slice(0, 80)}…
                      </Card.Text>
                    </div>
                    <div>
                      {isAdmin && (
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(v.id)}
                          disabled={loading}
                          {...btnProps}
                        >
                          Удалить
                        </Button>
                      )}
                      <Button
                        as={NavLink}
                        to={`/vacancy/${v.id}`}
                        variant="primary"
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
                  {Array.from({ length: totalPages }, (_, i) => (
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

export default Vacancies;
