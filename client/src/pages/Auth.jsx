// src/pages/Auth.jsx
import React, { useState } from 'react';
import {
  Button,
  Card,
  Container,
  Form,
  ToggleButton,
  ButtonGroup,
  Row,
  Col
} from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';

const Auth = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  // form state
  const [role, setRole] = useState('seeker');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const passwordsMatch = password === confirm;

  const roles = [
    { name: 'Соискатель', value: 'seeker' },
    { name: 'Работодатель', value: 'employer' },
  ];

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="text-center mb-4">
          {isLogin ? 'Авторизация' : 'Регистрация'}
        </h2>

        {/* Role toggle on registration */}
        {!isLogin && (
          <ButtonGroup className="d-flex mb-4">
            {roles.map((r, idx) => (
              <ToggleButton
                key={idx}
                id={`role-${r.value}`}
                type="radio"
                variant={role === r.value ? 'primary' : 'outline-primary'}
                name="role"
                value={r.value}
                checked={role === r.value}
                onChange={e => setRole(e.currentTarget.value)}
                className="flex-fill"
              >
                {r.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
        )}

        <Form>
          {/* First + Last name fields side by side */}
          {!isLogin && (
            <Row className="mb-3">
              <Col>
                <Form.Control
                  placeholder="Имя"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="Фамилия"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </Col>
            </Row>
          )}

          {/* Email */}
          <Form.Control
            className="mb-3"
            placeholder="Введите Ваш email..."
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          {/* Password */}
          <Form.Control
            className="mb-3"
            placeholder="Введите Ваш пароль"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {/* Confirm password on registration */}
          {!isLogin && (
            <>
              <Form.Control
                className="mb-2"
                placeholder="Повторите пароль"
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
              />
              {!passwordsMatch && (
                <div style={{ color: 'red', fontSize: '0.9rem' }}>
                  Пароли не совпадают
                </div>
              )}
            </>
          )}

          {/* Text + button row */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            {isLogin ? (
              <div>
                Нет аккаунта?{' '}
                <NavLink to="/registration">Зарегистрируйся</NavLink>
              </div>
            ) : (
              <div>
                Есть аккаунт?{' '}
                <NavLink to="/login">Войдите</NavLink>
              </div>
            )}
            <Button
              variant="outline-success"
              disabled={!isLogin && !passwordsMatch}
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Auth;
