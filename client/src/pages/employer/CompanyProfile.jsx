import React, { useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../main';
import { Container, Card, Spinner, Button } from 'react-bootstrap';
import { deleteCompany, fetchCompany } from '../../http/companyAPI';

const CompanyProfile = observer(() => {
  const { user } = useContext(Context);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (user.isAuth) {
      fetchCompany()
        .then(data => {
          const list = Array.isArray(data) ? data : [data];
          const my = list.find(c => c.userId === user.user.id);
          setCompany(my || null);
        })
        .catch(err => {
          console.error('Ошибка загрузки компании:', err);
          setError('Не удалось загрузить данные компании');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user.isAuth, user.user]);

  const handleDelete = async id => {
    if (!window.confirm('Удалить эту компанию без возможности восстановления?')) return;
    setDeletingId(id);
    try {
      await deleteCompany(id);
      setCompany(null);
    } catch (err) {
      console.error('Ошибка удаления компании:', err);
      alert('Не удалось удалить компанию.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <Container className="mt-4">Загрузка компании...</Container>;
  }

  if (error) {
    return <Container className="mt-4 text-danger">{error}</Container>;
  }

  if (!company) {
    return <Container className="mt-4">Компания не найдена.</Container>;
  }

  return (
    <Container fluid className="mt-4">
      <Card className="shadow-sm">
        <Card.Header as="h4">{company.name}</Card.Header>
        <Card.Body>
          <Card.Text>{company.description}</Card.Text>
          <Card.Text>Контактный номер компании: {company.telephoneNumber}</Card.Text>
          <Button
            variant="danger"
            onClick={() => handleDelete(company.id)}
            disabled={deletingId === company.id}
          >
            {deletingId === company.id ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Удаление...
              </>
            ) : (
              'Удалить компанию'
            )}
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
});

export default CompanyProfile;
