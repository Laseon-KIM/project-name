/**
 * 프로토타입 등록 파일
 * =====================
 * 새 프로토타입을 추가하려면
 *   1) 본인 폴더에 html 파일을 만들고
 *   2) 아래 본인 pages 배열에 한 줄 추가하면 끝.
 *
 *   { id: 'login', title: '로그인', file: 'laseon/login.html' }
 *
 *   id    - URL 주소에 쓰임 (영문/숫자/하이픈)
 *   title - 사이드바에 보이는 이름 (한글 OK)
 *   file  - 실제 파일 경로 (루트 기준)
 */

window.TEAM = [
  {
    id: 'laseon',
    name: '라선',
    pages: [
      { id: 'home', title: '홈', file: 'laseon/home.html' },
    ],
  },
  {
    id: 'yunjin',
    name: '윤진',
    pages: [
      { id: 'home', title: '홈', file: 'yunjin/home.html' },
    ],
  },
  {
    id: 'jiwon',
    name: '지원',
    pages: [
      { id: 'home', title: '홈', file: 'jiwon/home.html' },
    ],
  },
];
