# 리액트 과제4 - 채팅구현하기

## 사용한 tool
React, JavaScript, TailwindCSS, pocketbase, vite <br/>
with supabase 

- 프론트엔드 과정으로 처음 Pocketbase 같은 백엔드를 대체할 수 있는 툴이 여러개 있다는 것을 알았다.<br/>
바닐라 때 사용했던 pocketbase는 UI가 사용자에게 복잡하지 않고 단순해서 좋았지만, 요즘 핫하다는 새로운 툴을 적용해보고 싶어서 supabase로 기술 구현을 시도했다.<br/>
해당 툴들은 대체로 API를 사용해 쓸 수 있는 기능들이 비슷하기에, 적용하는데 그리 어렵지는 않았지만 상세한 API사용법을 몰라서 작은 오류를 대처하기 어려웠다.<br/>
그래서 실시간 채팅을 띄우는 것은 성공했지만, 익숙한 Pocketbase로 다시 이주했음을 알린다.<br/>

---

- 4주차 과제를 확인한 후, 과제를 제출하세요. (마크업 구현 ✅ / 기능 구현 ✅)
    - [x]  4주차 과제는 채팅 앱 화면을 구현하는 것입니다.
    사용자가 입력한 내용을 데이터베이스에 저장하고, 사용자 화면에 업데이트 해봅니다.
    - [x]  커스텀 훅 함수를 1개 이상 작성해 여러 곳에서 재사용 해봅니다.
    - [ ]  리액트 컨텍스트 API를 활용해 앱 상태를 관리해보세요.
    - [ ]  PocketBase 인증, 리얼 타임 데이터베이스 등을 활용하세요.
    - [ ]  React Router 라이브러리를 활용해 라우팅하세요. (옵션)
    - [ ]  가능한 경우, Storybook을 활용해보세요. (옵션)

이번 과제는 연휴가 껴서 꽤 많은 조건이 있었는데, `useContext`, `React Router`라는 전혀 알지 못하는 녀석들을 마주했다.<br/>
원래 선생님은 이 내용까지 진도를 나가고 싶으셨던 것 같으나, 해당 목표에 도달하지 못한 것 같았고, 스스로 혼자 공부하며 사용해보려고 했다.<br/>
그러나 여전히 나는 부족하고, 무지해서 해당 내용들을 학습하였지만, 적용할 엄두는 내지 못했다. 그냥 미리 예습으로 공부했다는 사실로 만족하겠다.<br/>

### 그래도 학습한 useContext, React Router
내가 학습한 useContext는 부모의 데이터를 자식에게 넘겨줄 때, 전달받는 자식 컴포넌트의 거리가 멀어질수록 복잡해지는 코드를 해결해주는 훅으로 이해했다.<br/>
또한 React Router는 SPA로 작업하는 리액트 환경에서, 조건에 맞는 다양한 페이지를 한 페이지 안에서 렌더링하기 위한 라이브러리이며, 이번 과제에 활용했다면, 로그인, 회원가입 기능을 추가해 사용자의 인터렉션에 따라 해당하는 화면을 표현하는데 유용했을 것으로 보인다.<br/>
<br/>
추가로 스토리북을 배운 이후로 여전히 적용시켜보고 싶었지만, 연휴의 게을렀던 내 자신을 탓하겠다!!!<br/>

## 기능 구현

1. 시작페이지<br/>
![시작페이지](https://github.com/clapsheep/weekly4/assets/140643716/d7d4dee2-6aac-4eb5-b252-e83a91a05e86)<br/>

우선 커스텀 훅으로 메인로딩 페이지를 만들어 보았다.<br/>
딱히 어려운 과정은 아니었지만 커스텀 훅을 만든다는 관점에서 setTimeOut으로 2초간의 텀을 두고 메인 로딩 페이지 이후 채팅창이 나타나게 구현했다.<br/>
이는 같은 부트캠프 동기인 SW님의 아이디어를 참고했다.<br/>
```js
import { useState, useEffect } from 'react';

export default function useLoad() {
  const [main, setMain] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMain(false);
    }, 2000);
  }, []);
  return main;
}
```

2. 상태관리 전략 - 이렇게 상태관리해서 하는게 맞을까?<br/>
초기 상태는 PB에서 가져오는 데이터를 초기 상태로 설정했다.<br/>
내용을 입력하고 전송 버튼을 누르면 입력한 내용을 PB에 create 한다.<br/>
```jsx
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
```

여기서 핵심은 PB에 있는 subscribe 기능을 사용해, PB data가 새로 업데이트 되면, 해당 내용을 가져와 setChat에 상태를 추가하는 방식으로 구현했다.<br/>
뭔가 이 방법은 서버통신을 100% 활용하는 느낌이 아닌 로컬로 상태를 업데이트하는 하이브리드 짬뽕인 것 같다.<br/>
실시간 데이터를 그대로 상태 업데이트에 사용하고 싶었지만, useEffect 안에는 await를 쓸 수 없었고,<br/>
어차피 내가 PB에 올린 내용이든, 상대방이 올린 내용이든 해당 데이터를 실시간으로 e.record에 떨어지기 때문에 상태에 그 내용을 복사해서 집어넣는 방식이다.<br/>
```jsx
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
```
그러나 기능은 보기에 제대로 작동하지만 아래의 오류가 나타나는 것으로 보아, 뭔가 잘못되었다. 어떻게 하는 것이 정석인지 너무 궁금하다.<br/>
<img width="440" alt="스크린샷 2024-02-13 오전 2 34 47" src="https://github.com/clapsheep/weekly4/assets/140643716/4a11b6e2-0652-417e-a12d-340048abc9f7">


## 렌더링
PB로 가져온 데이터의 relation 된 User를 조회해 내가 보낸 것은 오른쪽에, 상대방이 보낸 것은 왼쪽에 렌더링 (로그인을 구현하지 않았기 때문에 상대방이 보내는 메세지는 pb에서 수동으로 만들어준다.<br/>
근데 PB에서 UTC 시간 설정을 한국시간으로는 어떻게 하는거지???
![채팅](https://github.com/clapsheep/weekly4/assets/140643716/7cc43416-8c5b-4f09-9843-467632b070ae)


## 느낀점
1. 파이널 프로젝트 전까지 배운 모든 내용을 완벽히 숙지하고 넘어가고 싶었다. 하지만 아직은 useEffect의 정확한 활용을 못하겠다.<br/>
처음 useEffect를 배웠을 때는 이렇게 비동기를 사용한 서버 통신에 무조건 useEffect를 사용해야 할 것으로 이해했지만, 이렇게 PB같은 툴을 사용하면 그럴 일이 별로 없었다..<br/>
특정 state나 props를 트리거로 DOM조작, 비동기 등에 활용하는 useEffect를 언제 어떻게 활용하는 것이 옳을까에 대한 명확한 개념이 필요하다.<br/>
2. 커스텀 훅을 만드는 것이 익숙하지 않다. 이 부분은 내가 복습을 깊이있게 하지 않은 탓도 있지만, 응용력이 부족한 것 같다.<br/>
3. 여전히 배우지 않은 것을 학습하는 능력이 부족하다.<br/>
앞으로 배울 날은 1주일이며, 프로젝트 때는 내가 배웠든 안배웠든 원하는 기능을 구현하는 방법에 대해 스스로 검색하고 익혀서 적용시켜야 하는데, react Router가 필요한 것을 알고, 학습했음에도 불구하고 적용이 막막하다는 사실에 나는 진짜 천재가 전혀 아니구나라는 생각을 했다.<br/>
천재가 아니면 어떠하리, 지식과 알아야할 내용이 아무리 많아도 그것들은 한정적이다. 아직은 모르는게 많지만 그래서 잘 마른 스펀지같은 상태이지 않을까?<br/>
내가 모를 때 물어볼 동료와 선생님이 있고, 포기하지 않는 집념과 깡이 있다면, 무조건 나는 모든 필요한 내용을 습득하는데 수렴할 수 있다!<br/>
