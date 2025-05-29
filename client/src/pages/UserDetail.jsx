import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, Navigate, NavLink } from 'react-router-dom';
import { Context } from '../main';
import { fetchUserById, deleteUser } from '../http/userAPI';
import { Container, Card, Row, Col, ListGroup, Button, Badge, Spinner } from 'react-bootstrap';
import { FaUserCircle, FaEnvelope, FaCalendarAlt, FaUserTag } from 'react-icons/fa';

const UserDetail = observer(() => {
  const { id } = useParams();
  const { user } = useContext(Context);
  const currentRole = (user.user?.role || '').trim().toUpperCase();
  const isAdmin = user.isAuth && currentRole === 'ADMIN';

  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    fetchUserById(id)
      .then(data => setTargetUser(data))
      .catch(err => console.error('Ошибка загрузки пользователя:', err))
      .finally(() => setLoading(false));
  }, [id, isAdmin]);

  if (!user.isAuth) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    return (
      <Container className="mt-4 text-center">
        <p>Доступ закрыт.</p>
      </Container>
    );
  }
  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }
  if (!targetUser) {
    return (
      <Container className="mt-4 text-center">
        <p>Пользователь не найден.</p>
      </Container>
    );
  }

  const { firstName, lastName, email, role, createdAt } = targetUser;

  const handleDelete = async () => {
    if (!window.confirm('Удалить этого пользователя без восстановления?')) return;
    setDeleting(true);
    try {
      await deleteUser(id);
      // после удаления возвращаем к списку
      window.location.href = '/users';
    } catch (err) {
      console.error('Ошибка удаления пользователя:', err);
      alert('Не удалось удалить пользователя.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <div className="mb-3">
                <FaUserCircle style={{ fontSize: '4rem', color: '#6c757d' }} />
              </div>
              <Card.Title>{`${firstName} ${lastName}`}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
              {role === 'employer' ? 'Работодатель' : 'Соискатель'}
              </Card.Subtitle>
              <ListGroup variant="flush" className="text-start my-3">
                <ListGroup.Item>
                  <FaEnvelope /> <strong>Email:</strong> {email}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaCalendarAlt /> <strong>Дата регистрации:</strong> {new Date(createdAt).toLocaleDateString()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaUserTag /> <strong>Роль:</strong> {role === 'employer' ? 'Работодатель' : 'Соискатель'}
                </ListGroup.Item>
              </ListGroup>

              <div className="d-grid gap-2">
                  {/* Роль-зависимые действия */}
                  {role === 'employer' && (
                    <>
                      <Button
                        as={NavLink}
                        to={`/vacancies?userId=${targetUser.id}`}
                        variant="primary"
                      >
                        Вакансии пользователя
                      </Button>
                      <Button
                        as={NavLink}
                        to={`/companies?userId=${targetUser.id}`}
                        variant="info"
                      >
                        Компания пользователя
                      </Button>
                    </>
                  )}

                  {role === 'seeker' && (
                    <Button
                      as={NavLink}
                      to={`/resumes?userId=${targetUser.id}`}
                      variant="success"
                    >
                      Резюме пользователя
                    </Button>
                  )}

                  {/* Удаление и возврат */}
                  <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Удаление…' : 'Удалить пользователя'}
                  </Button>
                  <Button as={NavLink} to="/users" variant="outline-secondary">
                    Вернуться к списку
                  </Button>
                </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
});

export default UserDetail;
