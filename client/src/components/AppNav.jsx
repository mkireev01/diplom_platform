import React, { useContext } from 'react';
import { Context } from '../main';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { observer } from 'mobx-react-lite';

const AppNav = observer(() => {
  const { user } = useContext(Context);

  // Общие пропсы для всех кнопок
  const btnProps = {
    size: "lg",
    className: "me-2",      // отступ справа
    style: { minWidth: 120 } // минимальная ширина
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold">
          FindJob
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center">
            <Button
              as={NavLink}
              to="/vacancies"
              variant="outline-light"
              {...btnProps}
            >
              Вакансии
            </Button>

            {!user.isAuth ? (
              <Button
                as={NavLink}
                to="/login"
                variant="light"
                onClick={() => user.setIsAuth(true)}
                {...btnProps}
              >
                Авторизация
              </Button>
            ) : (
              <>
                <Button
                  variant="outline-light"
                  onClick={() => {
                    user.setIsAuth(false);
                    user.setUser({});
                  }}
                  {...btnProps}
                >
                  Выход
                </Button>
                <Button
                  as={NavLink}
                  to="/profile"
                  variant="light"
                  {...btnProps}
                  // для иконки уберём лишние паддинги внутри
                  style={{ ...btnProps.style, padding: '0.375rem' }}
                >
                  <FaUserCircle style={{ fontSize: '1.5rem' }} />
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default AppNav;
