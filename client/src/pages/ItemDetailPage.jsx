import React, { useContext, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../main';
import { Container, Card, Badge, Row, Col, Spinner } from 'react-bootstrap';
import { $host } from '../http';

const ItemDetailPage = observer(() => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const { vacancies, resumes } = useContext(Context);

  const isResumePage = pathname.startsWith('/resume');
  const isVacancyPage = pathname.startsWith('/vacancy');

  const [item, setItem] = useState(null);
  const [company, setCompany] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(false);

  useEffect(() => {
    if (isResumePage) {
      const found = resumes.resumes.find(r => r.id === +id);
      setItem(found || null);
    } else if (isVacancyPage) {
      const found = vacancies.vacancies.find(v => v.id === +id);
      setItem(found || null);
    }
  }, [id, isResumePage, isVacancyPage, resumes.resumes, vacancies.vacancies]);

  useEffect(() => {
    if (isVacancyPage && item) {
      setLoadingCompany(true);
      $host.get(`/api/company/${item.companyId}`)
        .then(({ data }) => setCompany(data))
        .catch(console.error)
        .finally(() => setLoadingCompany(false));
    }
  }, [isVacancyPage, item]);

  if (item === null) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" /> Загрузка...
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="g-4">
        <Col lg={isVacancyPage ? 8 : 12}>
          <Card className="p-4 shadow-sm">
            <h3 className="mb-3">
              {isResumePage
                ? `${item.firstName} ${item.lastName}`
                : item.title}
            </h3>
            {isResumePage ? (
              <>
                <p><strong>Гражданство:</strong> {item.nationality}</p>
                <p><strong>Дата рождения:</strong> {item.birthDate}</p>
                <p><strong>Опыт:</strong> {item.experience}</p>
                <p><strong>Навыки:</strong></p>
                <div className="mb-3">
                  {item.skills.map((skill, idx) => (
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
                  {item.salaryFrom.toLocaleString()}₽
                  {item.salaryTo ? ` – ${item.salaryTo.toLocaleString()}₽` : ''}
                </p>
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
              </Card>
            ) : (
              <Card className="p-3 text-center shadow-sm">
                <p>Компания не найдена</p>
              </Card>
            )}
          </Col>
        )}
      </Row>
    </Container>
  );
});

export default ItemDetailPage;
