// src/pages/VacancyPage.jsx
import React, { useContext, useState, useMemo } from 'react';
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

const Home= observer(() => {
  const { user, vacancies, resumes } = useContext(Context);
  const isEmployer = user.user.role === 'employer';
  const isSeeker = user.user.role === 'seeker';

  // Общие фильтры
  const [keyword, setKeyword] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');

  // Пагинация
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Фильтрация данных
  const filteredVacancies = useMemo(() => {
    return vacancies.vacancies.filter(v => {
      const text = (v.title + ' ' + v.description).toLowerCase();
      if (keyword && !text.includes(keyword.toLowerCase())) return false;
      if (minSalary && v.salaryTo < Number(minSalary)) return false;
      if (maxSalary && v.salaryFrom > Number(maxSalary)) return false;
      return true;
    });
  }, [vacancies.vacancies, keyword, minSalary, maxSalary]);

  const filteredResumes = useMemo(() => {
    return resumes.resumes.filter(r => {
      const text = (r.firstName + ' ' + r.lastName + ' ' + r.experience).toLowerCase();
      if (keyword && !text.includes(keyword.toLowerCase())) return false;
      if (minSalary && r.salary < Number(minSalary)) return false;
      if (maxSalary && r.salary > Number(maxSalary)) return false;
      return true;
    });
  }, [resumes.resumes, keyword, minSalary, maxSalary]);

  const items = isEmployer ? filteredResumes : filteredVacancies;
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedItems = items.slice(startIndex, endIndex);

  const handlePageChange = page => setCurrentPage(page);
  const handleResetFilters = () => {
    setKeyword('');
    setMinSalary('');
    setMaxSalary('');
    setCurrentPage(1);
  };

  // Обработчик отклика для соискателя
  const handleApply = (vacancyId) => {
    // Здесь можно вызвать метод из vacancies, например:
    vacancies.apply(vacancyId);
  };

  return (
    <Container fluid className="mt-4">
      {/* Поиск сверху */}
      <Row className="mb-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Поиск по ключевым словам..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
        </Col>
      </Row>

      <Row>
        {/* Левая колонка — фильтры */}
        <Col md={3}>
          <Card className="p-3 mb-4 shadow-sm">
            <h5>Фильтры</h5>
            <Form.Group className="mb-3">
              <Form.Label>Зарплата от</Form.Label>
              <Form.Control
                type="number"
                placeholder="мин."
                value={minSalary}
                onChange={e => setMinSalary(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Зарплата до</Form.Label>
              <Form.Control
                type="number"
                placeholder="макс."
                value={maxSalary}
                onChange={e => setMaxSalary(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleResetFilters}
            >
              Сбросить фильтры
            </Button>
          </Card>
        </Col>

        {/* Правая колонка — список */}
        <Col md={9}>
          {totalItems === 0 ? (
            <p>Ничего не найдено.</p>
          ) : (
            <>
              {/* Индикация диапазона */}
              <p className="text-muted">
                Показаны {startIndex + 1}–{endIndex} из {totalItems}
              </p>

              {paginatedItems.map(item => (
                <Card key={item.id} className="mb-3 shadow-sm">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                      <Card.Title>
                        {isEmployer
                          ? `${item.firstName} ${item.lastName}`
                          : item.title}
                      </Card.Title>
                      <Card.Text className="text-muted">
                        {isEmployer
                          ? (item.experience.length > 100
                            ? item.experience.slice(0, 100) + '…'
                            : item.experience)
                          : (item.description.length > 100
                            ? item.description.slice(0, 100) + '…'
                            : item.description)
                        }
                      </Card.Text>
                    </div>
                    <div className="d-flex">
                      {isSeeker && (
                        <Button
                          variant="success"
                          className="me-2"
                          onClick={() => handleApply(item.id)}
                        >
                          Откликнуться
                        </Button>
                      )}
                      <Button
                        as={NavLink}
                        to={`/${isEmployer ? 'resume' : 'vacancy'}/${item.id}`}
                        variant="primary"
                      >
                        Подробнее
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}

              {/* Пагинация */}
              {totalPages > 1 && (
                <Pagination className="justify-content-center">
                  <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <Pagination.Item
                      key={idx + 1}
                      active={currentPage === idx + 1}
                      onClick={() => handlePageChange(idx + 1)}
                    >
                      {idx + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
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

export default Home;
