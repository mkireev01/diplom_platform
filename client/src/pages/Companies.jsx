import React, { useContext, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../main";
import { fetchCompany, deleteCompany } from "../http/companyAPI";
import { Container, Row, Col, Form, Card, Button, Pagination } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Companies = observer(() => {
  const { user } = useContext(Context);
  const role = (user.user?.role || '').trim().toUpperCase();
  const isAdmin = user.isAuth && role === 'ADMIN';

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    fetchCompany()
      .then(data => setCompanies(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAdmin]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filtered = useMemo(() => {
    return companies.filter(c => {
      const text = `${c.name}`.toLowerCase();
      return search ? text.includes(search.toLowerCase()) : true;
    });
  }, [companies, search]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const current = filtered.slice(start, start + perPage);

  const handleDelete = async id => {
    if (!window.confirm('Удалить эту компанию без возможности восстановления?')) return;
    setDeletingId(id);
    try {
      await deleteCompany(id);
      setCompanies(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Ошибка удаления компании:', err);
      alert('Не удалось удалить компанию.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <Container className="mt-4">
        <p>Доступ закрыт.</p>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            placeholder="Поиск по компаниям"
            value={search}
            onChange={e => setSearch(e.target.value)}
            disabled={loading}
          />
        </Col>
        <Col md="auto">
          <Button size="sm" variant="outline-secondary" onClick={() => setSearch('')} disabled={loading}>
            Сбросить
          </Button>
        </Col>
      </Row>

      {loading ? (
        <p>Загрузка компаний…</p>
      ) : total === 0 ? (
        <p>Ничего не найдено.</p>
      ) : (
        <>
          <Row>
            <Col>
              <p className="text-muted small">
                Показаны {start + 1}–{start + current.length} из {total}
              </p>
            </Col>
          </Row>

          {current.map(c => (
            <Card key={c.id} className="mb-3 shadow-sm">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title>{c.name}</Card.Title>
                  <Card.Text className="small text-muted">
                    {c.description?.slice(0, 100)}…
                  </Card.Text>
                </div>
                <div>
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={deletingId === c.id}
                    onClick={() => handleDelete(c.id)}
                    className="me-2"
                  >
                    {deletingId === c.id ? 'Удаляем…' : 'Удалить'}
                  </Button>
                  <Button size="sm" as={NavLink} to={`/companies/${c.id}`}>
                    Подробнее
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}

          {pages > 1 && (
            <Pagination className="justify-content-center">
              <Pagination.Prev disabled={page === 1} onClick={() => setPage(p => Math.max(p - 1, 1))} />
              {Array.from({ length: pages }, (_, i) => (
                <Pagination.Item key={i + 1} active={page === i + 1} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next disabled={page === pages} onClick={() => setPage(p => Math.min(p + 1, pages))} />
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
});

export default Companies;
