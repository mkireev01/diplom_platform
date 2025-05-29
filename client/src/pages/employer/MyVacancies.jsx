import React, { useContext, useState, useMemo, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from "../../main";
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
import { deleteVacancy, fetchVacancy } from '../../http/vacancyAPI';

const MyVacancies = observer(() => {
  const { user, vacancies } = useContext(Context);
  const isEmployer = user.isAuth && user.user?.role === 'employer';
  const isAdmin = user.isAuth && user.user?.role === 'ADMIN';
  const [loading,    setLoading]    = useState(false);

  useEffect(() => {
    if (isEmployer && !user.company) {
      user.loadMyCompany().catch(err => console.error('Ошибка загрузки компании:', err));
    }
  }, [isEmployer, user]);

  useEffect(() => {
    if (isEmployer && user.company) {
      console.log('Loaded company:', user.company);
      fetchVacancy().then(data => {
        console.log('Fetched vacancies:', data);
        vacancies.setVacancies(data);
      });
    }
  }, [isEmployer, user.company]);
  
  
  const [keyword, setKeyword] = useState('');
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => { setCurrentPage(1); }, [keyword]);

  
  const myVacancies = useMemo(() => {
    if (!isEmployer || !user.company) return [];
    return vacancies.vacancies.filter(v => v.companyId === user.company.id);
  }, [vacancies.vacancies, user.company, isEmployer]);

 
  const filtered = useMemo(() => {
    return myVacancies.filter(v => {
      const text = `${v.title} ${v.description || ''}`.toLowerCase();
      return keyword ? text.includes(keyword.toLowerCase()) : true;
    });
  }, [myVacancies, keyword]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginated = filtered.slice(startIndex, endIndex);

  const btnProps = { size: 'sm', className: 'me-2 mt-2', style: { minWidth: 100 } };

  if (!isEmployer) {
    return (
      <Container fluid className="mt-4">
        <Row><Col><p>Доступ только для работодателей.</p></Col></Row>
      </Container>
    );
  }

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
      <Row className="mb-3">
        <Col md={4}><h3>Мои вакансии</h3></Col>
        <Col md={4}>
          <Form.Control
            placeholder="Поиск по вакансиям..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col>
        {totalItems === 0 ? (
          <p>Нет вакансий для отображения.</p>
        ) : (
          <>
            <p className="text-muted">
              Показаны {startIndex + 1}–{endIndex} из {totalItems}
            </p>
            {paginated.map(v => (
              <Card key={v.id} className="mt-3 mb-3 shadow-sm">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title>{v.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {v.description?.slice(0, 100)}…
                    </Card.Text>
                  </div>
                  <div className="d-flex gap-2">
                  <Button as={NavLink} to={`/vacancy/${v.id}`} {...btnProps}>
                    Подробнее
                  </Button>
                  <Button
                          variant="danger"
                          onClick={() => handleDelete(v.id)}
                          disabled={loading}
                          {...btnProps}
                        >
                          Удалить
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
      </Col></Row>
    </Container>
  );
});

export default MyVacancies;