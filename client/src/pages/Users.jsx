import React, { useContext, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../main";
import { deleteUser, fetchUsers } from "../http/userAPI";
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

const Users = observer(() => {
  const { user } = useContext(Context);
  const currentRole = (user.user?.role || '').trim().toUpperCase();
  const isAdmin = user.isAuth && currentRole === "ADMIN";

  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    fetchUsers()
      .then(data => {
        console.log('Fetched users:', data);
        // Фильтруем сразу после получения: удаляем админов
        const nonAdmins = data.filter(u => (u.role || '').trim().toUpperCase() !== 'ADMIN');
        setUsersList(nonAdmins);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAdmin]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filtered = useMemo(() => {
    return usersList.filter(u => {
      const text = `${u.firstName || ''} ${u.lastName || ''} ${u.email || ''}`.toLowerCase();
      return search ? text.includes(search.toLowerCase()) : true;
    });
  }, [usersList, search]);

  const total = filtered.length;
  const pages = Math.ceil(total / perPage) || 1;
  const start = (page - 1) * perPage;
  const current = filtered.slice(start, start + perPage);

  const handleDelete = async id => {
    if (!window.confirm('Удалить этого пользователя без восстановления?')) return;
    setDeletingId(id);
    try {
      await deleteUser(id);
      setUsersList(prev => prev.filter(u => u.id !== id));
    } catch (e) {
      console.error(e);
      alert('Не удалось удалить пользователя.');
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
            placeholder="Поиск по пользователям"
            value={search}
            onChange={e => setSearch(e.target.value)}
            disabled={loading}
          />
        </Col>
        <Col md="auto">
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => setSearch('')}
            disabled={loading}
          >
            Сбросить
          </Button>
        </Col>
      </Row>

      {loading ? (
        <p>Загрузка пользователей…</p>
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

          {current.map(u => (
            <Card key={u.id} className="mb-3 shadow-sm">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title>{u.firstName} {u.lastName}</Card.Title>
                  <Card.Text className="small text-muted">
                    {u.email}
                  </Card.Text>
                </div>
                <div>
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={deletingId === u.id}
                    onClick={() => handleDelete(u.id)}
                    className="me-2"
                  >
                    {deletingId === u.id ? 'Удаляем…' : 'Удалить'}
                  </Button>
                  <Button
                    size="sm"
                    as={NavLink}
                    to={`/users/${u.id}`}
                  >
                    Подробнее
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}

          {pages > 1 && (
            <Pagination className="justify-content-center">
              <Pagination.Prev
                disabled={page === 1}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              />
              {Array.from({ length: pages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={page === pages}
                onClick={() => setPage(prev => Math.min(prev + 1, pages))}
              />
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
});

export default Users;
