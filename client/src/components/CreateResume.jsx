// src/components/CreateResume.js
import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Col, Form, Modal, Row, Button } from "react-bootstrap";

const CreateResume = ({ show, onHide }) => {
  const { user } = useContext(Context);

  const [firstName,    setFirstName]    = useState("");
  const [lastName,     setLastName]     = useState("");
  const [nationality,  setNationality]  = useState("");
  const [birthDate,    setBirthDate]    = useState("");   // new state for date
  const [skills,       setSkills]       = useState("");
  const [experience,   setExperience]   = useState("");
  const [fullText,     setFullText]     = useState("");
  const [titleVacancy, setTitleVacancy]     = useState("");
  const [descriptionVacancy, setDescriptionVacancy] = useState("");
  const [fullDescriptionVacancy, setFullDescriptionVacancy] = useState("");
  const [salaryFrom, setSalaryFrom] = useState(0);
  const [salaryTo, setSalaryTo] = useState(0)


  const handleSubmit = () => {
    // TODO: отправить форму (через fetch/axios/MobX)
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {user.user?.role === "seeker" ? "Создать резюме" : "Создать вакансию"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user.user.role === "seeker" ? 
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Control
                placeholder="Введите имя"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </Col>
            <Col>
              <Form.Control
                placeholder="Введите фамилию"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </Col>
          </Row>

          <Form.Control
            className="mt-3"
            placeholder="Введите гражданство"
            value={nationality}
            onChange={e => setNationality(e.target.value)}
          />

          <Form.Control
            className="mt-3"
            type="date"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
          />

          <Form.Control
            className="mt-3"
            placeholder="Опишите свои навыки"
            value={skills}
            onChange={e => setSkills(e.target.value)}
          />

          <Form.Control
            className="mt-3"
            placeholder="Опишите свой опыт (кратко)"
            value={experience}
            onChange={e => setExperience(e.target.value)}
          />

          <Form.Control
            className="mt-3"
            as="textarea"
            rows={4}
            placeholder="Резюме"
            value={fullText}
            onChange={e => setFullText(e.target.value)}
          />

          <Button
            className="mt-3"
            variant="primary"
            onClick={handleSubmit}
            block
          >
            Сохранить
          </Button>
        </Form> : 
        <Form>
           <Form.Control
            className="mt-3"
            placeholder="Напишите название вакансии"
            value={titleVacancy}
            onChange={e => setTitleVacancy(e.target.value)}
          />

          <Form.Control
            className="mt-3"
            placeholder="Введите краткое описание вакансии"
            value={descriptionVacancy}
            onChange={e => setDescriptionVacancy(e.target.value)}
          />

          <Form.Control
            className="mt-3"
            as="textarea"
            rows={4}
            placeholder="Опишите полное описание вакансии"
            value={fullDescriptionVacancy}
            onChange={e => setFullDescriptionVacancy(e.target.value)}
          />

        <Row className="mb-3">
            <Col>
                <Form.Control
                className="mt-3"
                placeholder="Введите зарплату от"
                type="number"
                value={salaryFrom}
                onChange={e => setSalaryFrom(e.target.value)}
                />
            </Col>
            <Col>
                <Form.Control
                className="mt-3"
                placeholder="Введите зарплату до"
                type="number"
                value={salaryTo}
                onChange={e => setSalaryTo(e.target.value)}
                />
            </Col>
          </Row>

          <Button
            className="mt-3"
            variant="primary"
            onClick={handleSubmit}
            block
          >
            Сохранить
          </Button>
        </Form>
        }
      </Modal.Body>
    </Modal>
  );
};

export default CreateResume;
