import React, { useContext, useState, useMemo, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from "../../main"
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
import { deleteResume, fetchResume } from '../../http/resumeAPI';

const MyResumes = observer(() => {
  const { user, resumes } = useContext(Context);
  const isSeeker = user.isAuth && user.user?.role === 'seeker';
  const [loading,    setLoading]    = useState(false);


  useEffect(() => {
    if (user.isAuth) {
      fetchResume()
        .then(data => resumes.setResumes(data))
        .catch(err => console.error('Ошибка загрузки резюме:', err));
    }
  }, [user.isAuth]);


  const [keyword, setKeyword] = useState('');
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);


  const myResumes = useMemo(() => {
    if (!user.isAuth) return [];
    return resumes.resumes.filter(r => r.userId === user.user.id);
  }, [resumes.resumes, user.user, user.isAuth]);

  
  const filtered = useMemo(() => {
    return myResumes.filter(r => {
      const text = (r.firstName + ' ' + r.lastName + ' ' + r.experience).toLowerCase();
      return keyword ? text.includes(keyword.toLowerCase()) : true;
    });
  }, [myResumes, keyword]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginated = filtered.slice(startIndex, endIndex);


  const handleDelete = async (id) => {
    if (!window.confirm('Удалить эту вакансию без восстановления?')) return;
    setLoading(true);
    try {
      await deleteResume(id);
      const data = await fetchResume();
      resumes.setResumes(data);
    } catch (err) {
      console.error(err);
      alert('Ошибка удаления');
    } finally {
      setLoading(false);
    }
  };

  const btnProps = {
    size: 'sm',
    className: 'me-2 mt-2',
    style: { minWidth: 100 }
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mb-3">
        <Col md={4}>
          <h3>Мои резюме</h3>
        </Col>
        <Col md={4}>
          <Form.Control
            placeholder="Поиск по резюме..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          {totalItems === 0 ? (
            <p>Нет резюме для отображения.</p>
          ) : (
            <>
              <p className="text-muted">
                Показаны {startIndex + 1}–{endIndex} из {totalItems}
              </p>
              {paginated.map(r => (
                <Card key={r.id} className="mt-3 mb-3 shadow-sm">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title>{r.firstName} {r.lastName}</Card.Title>
                    <Card.Text className="text-muted">
                      {r.experience.slice(0, 100)}…
                    </Card.Text>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      as={NavLink}
                      to={`/resume/${r.id}`}
                      {...btnProps}
                    >
                      Подробнее
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(r.id)}
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

export default MyResumes;
