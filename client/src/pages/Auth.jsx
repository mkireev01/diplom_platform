import React, { useContext, useState, useEffect } from 'react';
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
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { login, registration } from '../http/userAPI';
import { observer } from 'mobx-react-lite';
import { Context } from '../main';

const Auth = observer(() => {
  const { user } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/login';

  const [role, setRole] = useState('seeker');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [emailError, setEmailError] = useState(false); // ✅ новое состояние

  const passwordsMatch = password === confirm;

  useEffect(() => {
    setRole('seeker');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirm('');
    setEmailError(false); // ✅ сбрасываем ошибку при смене режима
  }, [location.pathname]);

  // ✅ Проверка email
  const isValidEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (!isLogin) {
      setEmailError(email !== '' && !isValidEmail(email));
    }
  }, [email, isLogin]);

  const click = async () => {
    try {
      let data;
      if (isLogin) {
        data = await login(email, password);
        user.setUser(data);
        user.setIsAuth(true);
        navigate('/');
      } else {
        if (!isValidEmail(email)) {
          setEmailError(true);
          return;
        }
        data = await registration(firstName, lastName, email, password, role);
        navigate('/login');
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Ошибка авторизации/регистрации');
    }
  };

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

          <Form.Control
            className="mb-1"
            placeholder="Введите Ваш email..."
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            isInvalid={emailError}
          />
          {!isLogin && emailError && (
            <div style={{ color: 'red', fontSize: '0.9rem' }}>
              Введите корректный email
            </div>
          )}

          <Form.Control
            className="mb-3 mt-2"
            placeholder="Введите Ваш пароль"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

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

          <div className="d-flex justify-content-between align-items-center mt-4">
            {isLogin ? (
              <div>
                Нет аккаунта? <NavLink to="/registration">Зарегистрируйся</NavLink>
              </div>
            ) : (
              <div>
                Есть аккаунт? <NavLink to="/login">Войдите</NavLink>
              </div>
            )}
            <Button
              variant="outline-success"
              disabled={!isLogin && (!passwordsMatch || emailError)}
              onClick={click}
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
});

export default Auth;
