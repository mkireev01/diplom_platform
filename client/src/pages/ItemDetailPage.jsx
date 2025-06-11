import React, { useContext, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../main';
import { Container, Card, Badge, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { $host } from '../http';

const ItemDetailPage = observer(() => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const { vacancies } = useContext(Context);

  const isResumePage = pathname.startsWith('/resume');
  const isVacancyPage = pathname.startsWith('/vacancy');

  const [item, setItem] = useState(null);
  const [company, setCompany] = useState(null);
  const [loadingItem, setLoadingItem] = useState(true);
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [error, setError] = useState(null);

  // Load item data
  useEffect(() => {
    setLoadingItem(true);
    setError(null);

    if (isResumePage) {
      // Fetch resume by ID
      $host.get(`/api/resume/${id}`)
        .then(({ data }) => setItem(data))
        .catch(() => setError('Не удалось загрузить резюме'))
        .finally(() => setLoadingItem(false));

    } else if (isVacancyPage) {
      // Try to get from context first
      const found = vacancies.vacancies.find(v => v.id === +id);
      if (found) {
        setItem(found);
        setLoadingItem(false);
      } else {
        // Fetch single vacancy by API if not in context
        $host.get(`/api/vacancy/${id}`)
          .then(({ data }) => setItem(data))
          .catch(() => setError('Вакансия не найдена'))
          .finally(() => setLoadingItem(false));
      }
    }
  }, [id, isResumePage, isVacancyPage, vacancies.vacancies]);

  // Load company data for vacancy
  useEffect(() => {
    if (isVacancyPage && item) {
      setLoadingCompany(true);
      $host.get(`/api/company/${item.companyId}`)
        .then(({ data }) => setCompany(data))
        .catch(() => setCompany(null))
        .finally(() => setLoadingCompany(false));
    }
  }, [isVacancyPage, item]);

  if (loadingItem) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error || !item) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">{error || (isResumePage ? 'Резюме не найдено' : 'Вакансия не найдена')}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-4">
      <Row className="g-4">
        <Col lg={isVacancyPage ? 8 : 12}>
          <Card className="p-4 shadow-sm">
            <h3 className="mb-3">
              {isResumePage ? `${item.firstName} ${item.lastName}` : item.title}
            </h3>

            {isResumePage ? (
              <>  
                <p><strong>Гражданство:</strong> {item.nationality}</p>
                <p><strong>Дата рождения:</strong> {item.birthDate}</p>
                <p><strong>Опыт:</strong> {item.experience}</p>
                <p><strong>Навыки:</strong></p>
                <div className="mb-3">
                  {item.skills?.map((skill, idx) => (
                    <Badge key={idx} bg="secondary" className="me-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p><strong>О соискателе:</strong></p>
                <p>{item.fullText}</p>
              </>
            ) : (
              <>  
                <p><strong>Краткое описание:</strong></p>
                <p>{item.description}</p>
                <p><strong>Полное описание вакансии:</strong></p>
                <p>{item.fullDescription}</p>
                <p><strong>Зарплата:</strong></p>
                <p>
                  {item.salaryFrom.toLocaleString()} – {item.salaryTo.toLocaleString()} BYN
                </p>
                <p> <strong> Город: </strong></p>
                <p>{item.location}</p>
                <p> <strong> Тип занятости: </strong></p>
                {item.employment === "fullemployment" && (
                  
                  <p> Полная занятость </p>
                 
                )}
                {item.employment === "underemployment" && (
                  <p> Частичная занятость</p>
                )}
                {item.employment === "remotely" && (
                  <p> Удаленно </p>
                )}
              </>
            )}

          </Card>
        </Col>

        {isVacancyPage && (
          <Col lg={4}>
            {loadingCompany ? (
              <Card className="p-3 text-center shadow-sm">
                <Spinner animation="border" /> Загрузка компании...
              </Card>
            ) : company ? (
              <Card className="p-3 shadow-sm">
                <h5 className="mb-3">Компания</h5>
                <p className="fw-bold mb-2">{company.name}</p>
                {company.description && <p>{company.description}</p>}
                {company.telephoneNumber && (
                  <p>Контактный телефон: {company.telephoneNumber}</p>
                )}
              </Card>
            ) : (
              <Card className="p-3 text-center shadow-sm">
                <Alert variant="warning">Компания не найдена</Alert>
              </Card>
            )}
          </Col>
        )}
      </Row>
    </Container>
  );
});

export default ItemDetailPage;
