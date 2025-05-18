import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../main';
import { Container, Card, Badge } from 'react-bootstrap';

const ItemDetailPage = observer(() => {
  const { id } = useParams();
  const { user, vacancies, resumes } = useContext(Context);
  const isEmployer = user.user.role === 'employer';

  const [item, setItem] = useState(null);

  useEffect(() => {
    if (isEmployer) {
      const found = resumes.resumes.find(r => r.id === Number(id));
      setItem(found);
    } else {
      const found = vacancies.vacancies.find(v => v.id === Number(id));
      setItem(found);
    }
  }, [id, isEmployer, vacancies.vacancies, resumes.resumes]);

  if (!item) {
    return <Container className="mt-4"><p>Загрузка...</p></Container>;
  }

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h3 className="mb-3">
          {isEmployer
            ? `${item.firstName} ${item.lastName}`
            : item.title}
        </h3>

        {isEmployer ? (
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
    </Container>
  );
});

export default ItemDetailPage;
