import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  Offcanvas,
  Button,
  ListGroup,
  Form,
  InputGroup,
  ButtonGroup,
  Row,
  Col,
  Image,
  Spinner
} from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../main';
import { $host } from '../http';

const ChatPanel = observer(() => {
  const { user, chats } = useContext(Context);
  const chatStore = chats;

  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState('');
  const [contacts, setContacts] = useState([]);
  const [mode, setMode] = useState('chats');

  const messagesEndRef = useRef(null);

  // 1. Load chats when user authenticates
  useEffect(() => {
    if (user.isAuth) {
      chatStore.loadChats();
    }
  }, [user.isAuth, chatStore]);

  // 2. Load contacts list when panel is opened
  useEffect(() => {
    if (show && user.isAuth) {
      $host
        .get('/api/user')
        .then(({ data }) => setContacts(data.filter(u => u.id !== user.user.id)))
        .catch(console.error);
    }
  }, [show, user.user.id]);

  // 3. Auto-scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatStore.messages.length]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const selectChat = chat => {
    const otherId = chat.seekerId === user.user.id ? chat.employer.id : chat.seeker.id;
    chatStore.openChatWith(otherId);
    setMode('chats');
    setDraft('');
  };

  const startChat = async u => {
    await chatStore.openChatWith(u.id);
    setMode('chats');
    setDraft('');
  };

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !chatStore.currentChatId) return;
    setDraft('');
    try {
      // Only send; assume server will echo this message back via WebSocket
      await chatStore.sendMessage(text);
    } catch (err) {
      console.error('Ошибка отправки сообщения:', err);
    }
  };

  const btnProps = { size: 'lg', className: 'me-2 mt-2', style: { minWidth: 120 } };

  return (
    <>
      <Button variant="outline-primary" onClick={handleShow} {...btnProps}>
        Чат
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: '80%' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Чат</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0 h-100">
          <Row className="g-0 h-100">
            {/* Sidebar */}
            <Col xs={4} className="border-end d-flex flex-column">
              <ButtonGroup className="m-2">
                <Button
                  size="sm"
                  variant={mode === 'chats' ? 'primary' : 'outline-secondary'}
                  onClick={() => setMode('chats')}
                >
                  Мои чаты
                </Button>
                <Button
                  size="sm"
                  variant={mode === 'new' ? 'primary' : 'outline-secondary'}
                  onClick={() => setMode('new')}
                >
                  Новый чат
                </Button>
              </ButtonGroup>

              <Form.Control
                size="sm"
                placeholder={mode === 'chats' ? 'Поиск чатов...' : 'Поиск пользователей...'}
                className="mx-2 mb-2"
                onChange={e =>
                  mode === 'chats'
                    ? chatStore.filterChats(e.target.value)
                    : chatStore.filterUsers(e.target.value)
                }
              />

              <div className="flex-grow-1 overflow-auto">
                <ListGroup variant="flush">
                  {mode === 'chats'
                    ? chatStore.chats.map(c => {
                        const other = c.seekerId === user.user.id ? c.employer : c.seeker;
                        return (
                          <ListGroup.Item
                            key={c.id}
                            action
                            active={c.id === chatStore.currentChatId}
                            onClick={() => selectChat(c)}
                            className="d-flex align-items-center"
                          >
                            <Image
                              src={other.avatarUrl || '/default-avatar.png'}
                              roundedCircle
                              width={32}
                              height={32}
                              className="me-2"
                            />
                            <div className="flex-grow-1">
                              <div className="fw-bold small">
                                {other.firstName} {other.lastName}
                              </div>
                              <small className="text-truncate d-block">
                                {c.lastMessage?.content.slice(0, 30) || '—'}
                              </small>
                            </div>
                          </ListGroup.Item>
                        );
                      })
                    : contacts.map(u => (
                        <ListGroup.Item
                          key={u.id}
                          action
                          onClick={() => startChat(u)}
                          className="d-flex align-items-center"
                        >
                          <Image
                            src={u.avatarUrl || '/default-avatar.png'}
                            roundedCircle
                            width={32}
                            height={32}
                            className="me-2"
                          />
                          <div className="small">
                            {u.firstName} {u.lastName}
                          </div>
                        </ListGroup.Item>
                      ))}
                </ListGroup>

                {mode === 'new' && contacts.length === 0 && (
                  <div className="text-center py-3">
                    <Spinner animation="border" size="sm" /> Загрузка...
                  </div>
                )}
              </div>
            </Col>

            {/* Messages */}
            <Col xs={8} className="d-flex flex-column">
              <div className="flex-grow-1 overflow-auto p-3">
                {chatStore.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`mb-3 d-flex ${
                      msg.senderId === user.user.id
                        ? 'justify-content-end'
                        : 'justify-content-start'
                    }`}
                  >
                    <div
                      className={`p-2 rounded ${
                        msg.senderId === user.user.id ? 'bg-primary text-white' : 'bg-light'
                      }`}
                      style={{ maxWidth: '75%' }}
                      // рендерим HTML-контент сразу с ссылками
                      dangerouslySetInnerHTML={{ __html: msg.content }}
                    />
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <InputGroup className="p-2 border-top">
                <Form.Control
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  placeholder="Написать сообщение..."
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  disabled={!chatStore.currentChatId}
                />
                <Button
                  variant="primary"
                  onClick={handleSend}
                  disabled={!chatStore.currentChatId}
                >
                  Отправить
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
});

export default ChatPanel;
