import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
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
  const [messageDraft, setMessageDraft] = useState('');
  const [contacts, setContacts] = useState([]);
  const [mode, setMode] = useState('chats');
  const [localMessages, setLocalMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user.isAuth) chatStore.loadChats();
  }, [user.isAuth]);

  useEffect(() => {
    if (show && user.isAuth) {
      $host.get('/api/user')
        .then(({ data }) => setContacts(data.filter(u => u.id !== user.user.id)))
        .catch(console.error);
    }
  }, [show, user.user.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatStore.messages.length, localMessages.length]);

  const displayedMessages = useMemo(() => {
    const combined = [...localMessages, ...chatStore.messages];
    const map = new Map();
    combined.forEach(msg => {
      if (!map.has(msg.id)) {
        map.set(msg.id, msg);
      }
    });
    return Array.from(map.values());
  }, [chatStore.messages, localMessages]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const selectChat = chat => {
    const otherId = chat.seekerId === user.user.id ? chat.employer.id : chat.seeker.id;
    chatStore.openChatWith(otherId);
    setMode('chats');
    setLocalMessages([]);
  };

  const startChat = async userObj => {
    await chatStore.openChatWith(userObj.id);
    setMode('chats');
    setLocalMessages([]);
  };

  const handleSend = () => {
    const content = messageDraft.trim();
    if (!content || !chatStore.currentChatId) return;
    const tempId = `temp-${Date.now()}`;
    const tempMsg = {
      id: tempId,
      senderId: user.user.id,
      content,
      createdAt: new Date().toISOString()
    };
    setLocalMessages(prev => [...prev, tempMsg]);
    chatStore.sendMessage(content);
    setMessageDraft('');
  };

  const btnProps = {
    size: 'lg',
    className: 'me-2 mt-2',
    style: { minWidth: 120 }
  };


  return (
    <>
      <Button variant="outline-primary" onClick={handleShow} className="ms-2" {...btnProps}>
        Чат
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: '80%' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Чат</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0 h-100">
          <Row className="g-0 h-100">
            <Col xs={4} className="border-end d-flex flex-column">
              <ButtonGroup className="m-2">
                <Button size="sm" variant={mode === 'chats' ? 'primary' : 'outline-secondary'} onClick={() => setMode('chats')}>
                  Мои чаты
                </Button>
                <Button size="sm" variant={mode === 'new' ? 'primary' : 'outline-secondary'} onClick={() => setMode('new')}>
                  Новый чат
                </Button>
              </ButtonGroup>
              <Form.Control
                size="sm"
                placeholder={mode === 'chats' ? 'Поиск чатов...' : 'Поиск пользователей...'}
                className="mx-2 mb-2"
                onChange={e => mode === 'chats' ? chatStore.filterChats(e.target.value) : chatStore.filterUsers(e.target.value)}
              />
              <div className="flex-grow-1 overflow-auto">
                <ListGroup variant="flush">
                  {mode === 'chats'
                    ? chatStore.chats.map(chat => {
                        const other = chat.seekerId === user.user.id ? chat.employer : chat.seeker;
                        return (
                          <ListGroup.Item
                            key={chat.id}
                            action
                            active={chat.id === chatStore.currentChatId}
                            onClick={() => selectChat(chat)}
                            className="d-flex align-items-center"
                          >
                            <Image src={other.avatarUrl || '/default-avatar.png'} roundedCircle width={32} height={32} className="me-2" />
                            <div className="flex-grow-1">
                              <div className="fw-bold small">{other.firstName} {other.lastName}</div>
                              <small className="text-truncate d-block">{chat.lastMessage?.content.slice(0, 30) || '—'}</small>
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
                          <Image src={u.avatarUrl || '/default-avatar.png'} roundedCircle width={32} height={32} className="me-2" />
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

            <Col xs={8} className="d-flex flex-column">
              <div className="flex-grow-1 overflow-auto p-3">
                {displayedMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`mb-3 d-flex ${msg.senderId === user.user.id ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    <div
                      className={`p-2 rounded ${msg.senderId === user.user.id ? 'bg-primary text-white' : 'bg-light'}`}
                      style={{ maxWidth: '75%' }}
                    >
                      {msg.content}
                      <div className="text-muted small text-end mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <InputGroup className="p-2 border-top">
                <Form.Control
                  value={messageDraft}
                  onChange={e => setMessageDraft(e.target.value)}
                  placeholder="Написать сообщение..."
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  disabled={!chatStore.currentChatId}
                />
                <Button variant="primary" onClick={handleSend} disabled={!chatStore.currentChatId}>
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
