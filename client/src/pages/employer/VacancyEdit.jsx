import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOneVacancy, updateVacancy } from '../../http/vacancyAPI';
import { Form, Button, Container } from 'react-bootstrap';

const VacancyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('fullemployment');
  const [salaryFrom, setSalaryFrom] = useState('');
  const [salaryTo, setSalaryTo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOneVacancy(id).then(data => {
      setTitle(data.title || '');
      setShortDesc(data.description || '');
      setFullDesc(data.fullDescription || '');
      setLocation(data.location || '');
      setJobType(data.employment || 'fullemployment');
      setSalaryFrom(data.salaryFrom || '');
      setSalaryTo(data.salaryTo || '');
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateVacancy(id, {
        title,
        shortDesc,
        description: fullDesc,
        location,
        jobType,
        salaryFrom,
        salaryTo
      });
      navigate('/my-vacancies');
    } catch (err) {
      alert('Ошибка обновления вакансии');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h3>Редактировать вакансию</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Заголовок"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Краткое описание"
            value={shortDesc}
            onChange={e => setShortDesc(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Полное описание"
            value={fullDesc}
            onChange={e => setFullDesc(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Город"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Select value={jobType} onChange={e => setJobType(e.target.value)}>
            <option value="fullemployment">Полная</option>
            <option value="underemployment">Частичная</option>
            <option value="remotely">Удаленная</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="number"
            placeholder="Зарплата от"
            value={salaryFrom}
            onChange={e => setSalaryFrom(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="number"
            placeholder="Зарплата до"
            value={salaryTo}
            onChange={e => setSalaryTo(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" disabled={loading}>Сохранить</Button>
      </Form>
    </Container>
  );
};

export default VacancyEdit;
