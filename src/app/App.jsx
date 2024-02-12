import './App.css';
import { Button, ChatList, Input, Message } from '@/components';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* -------------------------------------------------------------------------- */
/*                                 DB메세지 불러오기                                 */
/* -------------------------------------------------------------------------- */
const { data: chatDATA, error } = await supabase.from('chatting').select('*');

// 1. 최초 상태는 DB DATA
const INITIALCHAT = chatDATA;

function App() {
  const [chat, setChat] = useState([...INITIALCHAT]);
  const refInput = useRef(null);

  async function hadleSubmit(e) {
    e.preventDefault();

    const chatData = new FormData(e.target);
    const message = chatData.get('message');

    if (message === '') {
      console.log('빈문자를 입력했습니다.');
      return;
    }

    // 2. submit 내용 DB 업로드
    await supabase.from('chatting').insert([{ message }]);

    // 3. 상태 업로드 : 실시간 DB를 받아와야함

    supabase
      .channel('chatting')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chatting' },
        (payload) => {
          console.log('Change received!', payload);

          setChat([...chat, payload.new]);
          setChat(chatDATA);
        }
      )
      .subscribe();

    // submit 후 인풋창 초기화
    refInput.current.value = null;
  }
  // 다음작업은 지금 입력하고 있는 폼의 사용자와 서버에서 입력한 사용자의 폼을 구분해서 서로 다르게 렌더링 (실시간)
  return (
    <div className="flex flex-col mx-auto my-8 h-[800px] w-[500px]">
      <ChatList>
        {chat.map((item) => {
          return (
            <Message user={item.user} time={item.created_at} key={item.id}>
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
  );
}

export default App;
