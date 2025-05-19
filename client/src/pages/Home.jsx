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
  Pagination
} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const VacancyPage = observer(() => {
  const { user, vacancies, resumes } = useContext(Context);

  // Логируем в консоль, кем нас считает стор
  useEffect(() => {
    console.log('🏷 VacancyPage — role:', user.user?.role, 'isAuth:', user.isAuth);
  }, [user.user, user.isAuth]);

  const isEmployer = user.isAuth && user.user?.role === 'employer';

  // фильтры + пагинация
  const [keyword,   setKeyword]   = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const itemsPerPage  = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // при смене фильтров или роли — сбрасываем страницу на 1-ю
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, minSalary, maxSalary, isEmployer]);

  // отфильтрованные массивы, сразу из ваших статичных store._vacancies / store._resumes
  const filteredVacancies = useMemo(() => {
    return vacancies.vacancies.filter(v => {
      const text = (v.title + v.description).toLowerCase();
      if (keyword && !text.includes(keyword.toLowerCase())) return false;
      if (minSalary && v.salaryTo   < +minSalary) return false;
      if (maxSalary && v.salaryFrom > +maxSalary) return false;
      return true;
    });
  }, [vacancies.vacancies, keyword, minSalary, maxSalary]);

  const filteredResumes = useMemo(() => {
    return resumes.resumes.filter(r => {
      const text = (r.firstName + r.lastName + r.experience).toLowerCase();
      if (keyword && !text.includes(keyword.toLowerCase())) return false;
      if (minSalary && r.salary < +minSalary) return false;
      if (maxSalary && r.salary > +maxSalary) return false;
      return true;
    });
  }, [resumes.resumes, keyword, minSalary, maxSalary]);

  // выбор, что показывать: резюме или вакансии
  const items      = isEmployer ? filteredResumes : filteredVacancies;
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex   = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedItems = items.slice(startIndex, endIndex);

  const handleApply = id => vacancies.apply?.(id);
  const resetFilters = () => {
    setKeyword(''); setMinSalary(''); setMaxSalary('');
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mb-3">
        <Col>
          <Form.Control
            placeholder="Поиск..."
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
            <Button size="sm" variant="outline-secondary" onClick={resetFilters}>
              Сбросить
            </Button>
          </Card>
        </Col>
        <Col md={9}>
          {totalItems === 0 ? (
            <p>Ничего не найдено.</p>
          ) : (
            <>
              <p className="text-muted">
                Показаны {startIndex + 1}–{endIndex} из {totalItems}
              </p>
              {paginatedItems.map(item => (
                <Card key={item.id} className="mb-3 shadow-sm">
                  <Card.Body className="d-flex justify-content-between">
                    <div>
                      <Card.Title>
                        {isEmployer
                          ? `${item.firstName} ${item.lastName}`
                          : item.title}
                      </Card.Title>
                      <Card.Text className="text-muted">
                        {isEmployer
                          ? item.experience.slice(0, 100) + '…'
                          : item.description.slice(0, 100) + '…'}
                      </Card.Text>
                    </div>
                    <div className="d-flex">
                      {!isEmployer && user.isAuth && (
                        <Button className="me-2" onClick={() => handleApply(item.id)}>
                          Откликнуться
                        </Button>
                      )}
                      <Button
                        as={NavLink}
                        to={`/${isEmployer ? 'resume' : 'vacancy'}/${item.id}`}
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

export default VacancyPage;
