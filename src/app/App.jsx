import './App.css';
import PocketBase from 'pocketbase';
import { Button, ChatList, Input, MainCover, Message } from '@/components';
import { useState, useRef, useEffect } from 'react';
import useLoad from '@/hooks/useLoad';
const URL = import.meta.env.VITE_PB_URL;
const pb = new PocketBase(URL);

const chattingRoom = await pb
  .collection('chattingRoom')
  .getFullList({ sort: 'created' });

const INITIALCHAT = chattingRoom;

function App() {
  const mainLoad = useLoad();
  const [chat, setChat] = useState([...INITIALCHAT]);
  const refInput = useRef(null);

  async function hadleSubmit(e) {
    e.preventDefault();

    const chatData = new FormData(e.target);
    const messageData = {
      message: chatData.get('message'),
      user: '1bgftjtml8aw9g1',
    };

    if (messageData.message === '') {
      console.log('빈문자를 입력했습니다.');
      return;
    }
    await pb.collection('chattingRoom').create(messageData);

    refInput.current.value = null;
  }

  useEffect(() => {
    pb.collection('chattingRoom').subscribe(
      '*',
      function (e) {
        console.log(e.action);
        setChat([...chat, e.record]);
      },
      {
        /* other options like expand, custom headers, etc. */
      }
    );
  }, [chat]);

  return (
    <>
      {mainLoad ? (
        <MainCover />
      ) : (
        <div className="flex flex-col mx-auto my-8 h-[800px] w-[500px]">
          <ChatList>
            {chat.map((item) => {
              return (
                <Message user={item.user} time={item.created} key={item.id}>
                  {item.message}
                </Message>
              );
            })}
          </ChatList>
          <form className="flex w-full h-12" onSubmit={hadleSubmit}>
            <Input ref={refInput} name="message" />
            <Button>전송</Button>
          </form>
        </div>
      )}
    </>
  );
}

export default App;
