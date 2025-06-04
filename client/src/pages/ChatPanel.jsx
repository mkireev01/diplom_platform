import React, { useContext, useState, useEffect, useRef } from 'react';
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
import { FaUserCircle, FaComments, FaTimes } from 'react-icons/fa';
import "../styles/main.css";
import { deleteChat } from '../http/chatAPI';

const ChatPanel = observer(() => {
  const { user, chats } = useContext(Context);
  const chatStore = chats;

  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState('');
  const [contacts, setContacts] = useState([]);
  const [mode, setMode] = useState('chats');

  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    if (user.isAuth) {
      chatStore.loadChats();
    }
  }, [user.isAuth, chatStore]);

  useEffect(() => {
    if (show && user.isAuth) {
      $host
        .get('/api/user')
        .then(({ data }) => setContacts(data.filter(u => u.id !== user.user.id)))
        .catch(console.error);
    }
  }, [show, user.user.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatStore.messages.length]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const selectChat = chat => {
    const otherId =
      chat.seekerId === user.user.id ? chat.employer.id : chat.seeker.id;
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
      await chatStore.sendMessage(text);
      await chatStore.loadMessages(chatStore.currentChatId);
    } catch (err) {
      console.error('Ошибка отправки сообщения:', err);
    }
  };

  // убираем дубликаты
  const uniqueMessages = [];
  const seenIds = new Set();
  for (const msg of chatStore.messages) {
    if (!seenIds.has(msg.id)) {
      seenIds.add(msg.id);
      uniqueMessages.push(msg);
    }
  }

  const totalUnread = chatStore.chats.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <>
      {/* Плавающая иконка */}
      {!show && (
        <Button
          onClick={handleShow}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1060,
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
          variant="primary"
        >
          <FaComments style={{ fontSize: '1.5rem', color: 'white' }} />
          {totalUnread > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                background: 'red',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.75rem',
                lineHeight: '20px',
                textAlign: 'center',
              }}
            >
              {totalUnread > 9 ? '9+' : totalUnread}
            </span>
          )}
        </Button>
      )}

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        style={{ width: '80%' }}
      >
        <Offcanvas.Header>
          <Offcanvas.Title>Чат</Offcanvas.Title>
          {/* Крестик вместо стандартного */}
          <Button
            variant="link"
            onClick={handleClose}
            style={{ color: '#000', textDecoration: 'none' }}
          >
            <FaTimes size="1.2rem" />
          </Button>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0 h-100">
          <Row className="g-0 h-100">
            {/* --- Левый сайдбар --- */}
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
                          className={`d-flex align-items-center justify-content-between ${c.id === chatStore.currentChatId ? 'active' : ''}`}
                        >
                          <div
                            className="d-flex align-items-center flex-grow-1"
                            style={{ cursor: 'pointer' }}
                            onClick={() => selectChat(c)}
                          >
                            {other.avatarUrl ? (
                              <Image
                                src={other.avatarUrl}
                                roundedCircle
                                width={32}
                                height={32}
                                className="me-2"
                              />
                            ) : (
                              <FaUserCircle
                                className="me-2"
                                style={{ fontSize: '1.5rem', color: '#6c757d' }}
                              />
                            )}
                            <div>
                              <div className="fw-bold small">{other.firstName} {other.lastName}</div>
                              <small className="text-truncate d-block">{c.lastMessage?.content.slice(0, 30) || '—'}</small>
                            </div>
                          </div>
                          <Button
                            variant="link"
                            size="sm"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (window.confirm('Удалить этот чат?')) {
                                try {
                                  await deleteChat(c.id); // удаление с бэка
                                  chatStore.loadChats();     // обновление чатов
                                  if (c.id === chatStore.currentChatId) {
                                    chatStore.currentChatId = null;
                                  }
                                } catch (err) {
                                  console.error('Ошибка при удалении чата:', err);
                                }
                              }
                            }}
                            style={{ color: 'red' }}
                          >
                            <FaTimes />
                          </Button>
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
                          {u.avatarUrl ? (
                            <Image
                              src={u.avatarUrl}
                              roundedCircle
                              width={32}
                              height={32}
                              className="me-2"
                            />
                          ) : (
                            <FaUserCircle
                              className="me-2"
                              style={{ fontSize: '1.5rem', color: '#6c757d' }}
                            />
                          )}
                          <div className="small">{u.firstName} {u.lastName}</div>
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

            {/* --- Основная часть с сообщениями --- */}
            <Col xs={8} className="d-flex flex-column">
              <div className="flex-grow-1 overflow-auto p-3">
                {uniqueMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`mb-3 d-flex ${
                      msg.senderId === user.user.id ? 'justify-content-end' : 'justify-content-start'
                    }`}
                  >
                    <div
                      className={`message-content p-2 rounded ${
                        msg.senderId === user.user.id ? 'bg-primary text-white' : 'bg-light'
                      }`}
                      style={{ maxWidth: '75%' }}
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
