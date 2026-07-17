# Team Prototypes

모바일 프로토타입을 iPhone 목업 위에서 같이 보는 정적 사이트입니다.
화면 규격은 **393 × 852** (iPhone 15 Pro) 고정.

## 폴더 구조

```
index.html              사이드바 + 목업이 있는 메인 화면
assets/
  css/style.css         메인 화면 스타일
  css/proto.css         프로토타입 공통 스타일 (상태바·탭바·홈 인디케이터)
  js/pages.js           ★ 프로토타입 목록 — 여기에 등록합니다
  js/app.js             사이드바·라우팅·배율
  js/proto.js           iOS 상태바 그려주는 스크립트
laseon/                 라선
yunjin/                 윤진
jiwon/                  지원
```

폴더 이름을 영문으로 둔 이유: 한글 폴더명은 URL에서 `%EB%9D%BC%EC%84%A0` 처럼
퍼센트 인코딩돼서 주소 공유가 불편해집니다. 사이드바에는 한글 이름으로 보입니다.

## 화면 추가하는 법

1. 본인 폴더에 html 파일을 만듭니다. 기존 `home.html` 을 복사해서 쓰는 게 제일 빠릅니다.
2. `assets/js/pages.js` 의 본인 `pages` 배열에 한 줄 추가합니다.

```js
{
  id: 'laseon',
  name: '라선',
  pages: [
    { id: 'home',  title: '홈',     file: 'laseon/home.html' },
    { id: 'login', title: '로그인', file: 'laseon/login.html' },   // ← 추가
  ],
},
```

`id` 는 주소에 쓰이니 영문/숫자/하이픈만, `title` 은 한글 OK.

## 상태바

직접 그릴 필요 없습니다. 이 한 줄이면 iOS 상태바(시간·신호·와이파이·배터리)가 나옵니다.

```html
<div class="status"></div>
<script src="../assets/js/proto.js"></script>
```

필요할 때만 쓰는 옵션:

```html
<div class="status" data-time="14:30"></div>   <!-- 시간 (기본 9:41) -->
<div class="status" data-battery="15"></div>   <!-- 20% 이하면 빨간색 -->
<div class="status" data-dark></div>           <!-- 어두운 배경용 흰색 아이콘 -->
```

## 로컬에서 보기

```bash
python3 -m http.server 8000
```

→ http://localhost:8000

## 주소

각 화면은 고유 주소를 가집니다. 그대로 복사해서 공유하면 됩니다.

```
https://<계정>.github.io/<저장소>/#/laseon/home
```

## 배포

`main` 에 push 하면 GitHub Actions 가 자동 배포합니다.

최초 1회만 설정이 필요합니다:
**저장소 Settings → Pages → Build and deployment → Source 를 `GitHub Actions` 로 변경**

## 규칙

- 남의 폴더는 건드리지 않기
- `pages.js` 는 모두가 함께 고치는 파일이라 충돌이 잘 납니다. 본인 블록만 수정하세요.
- 프로토타입 html 에서 `proto.css` 를 불러 쓰면 상태바·탭바를 다시 만들 필요 없습니다.
