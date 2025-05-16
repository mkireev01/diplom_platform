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
  Button
} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const VacancyPage = observer(() => {
  const { vacancies } = useContext(Context);

  // Локальные состояния для поиска и фильтра
  const [keyword, setKeyword] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');

  // Отфильтрованный список
  const filtered = useMemo(() => {
    return vacancies.vacancies.filter(v => {
      const text = (v.title + ' ' + v.description).toLowerCase();
      if (keyword && !text.includes(keyword.toLowerCase())) return false;
      if (minSalary && v.salaryTo < Number(minSalary)) return false;
      if (maxSalary && v.salaryFrom > Number(maxSalary)) return false;
      return true;
    });
  }, [vacancies.vacancies, keyword, minSalary, maxSalary]);

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
              <Form.Label>Зарплата от (BYN)</Form.Label>
              <Form.Control
                type="number"
                placeholder="мин."
                value={minSalary}
                onChange={e => setMinSalary(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Зарплата до (₽)</Form.Label>
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
              onClick={() => {
                setMinSalary('');
                setMaxSalary('');
              }}
            >
              Сбросить фильтры
            </Button>
          </Card>
        </Col>

        {/* Правая колонка — список вакансий */}
        <Col md={9}>
          {filtered.length === 0 ? (
            <p>Ничего не найдено.</p>
          ) : (
            filtered.map(v => (
              <Card key={v.id} className="mb-3 shadow-sm">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title>{v.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {v.description.length > 100
                        ? v.description.slice(0, 100) + '…'
                        : v.description}
                    </Card.Text>
                    <div>
                      <strong>
                        {v.salaryFrom.toLocaleString()}₽
                        {v.salaryTo
                          ? ` – ${v.salaryTo.toLocaleString()}₽`
                          : ''}
                      </strong>
                    </div>
                  </div>
                  <Button
                    as={NavLink}
                    to={`/vacancy/${v.id}`}
                    variant="primary"
                  >
                    Подробнее
                  </Button>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
});

export default VacancyPage;
