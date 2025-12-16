# AI Character Chat Service

**(주)라이언로켓 FE 엔지니어 채용 과제**로 AI 캐릭터와 실시간으로 대화할 수 있는 멀티페이지 웹 애플리케이션입니다.  
사용자는 자신만의 페르소나를 가진 캐릭터를 생성하고 대화할 수 있으며, 모든 데이터는 브라우저 내에 저장됩니다.

<br>

## 🚀 실행 방법 (Getting Started)

이 프로젝트는 Frontend와 Backend를 동시에 실행해야 합니다.

### 1. 필수 환경

- Node.js (v18 이상 권장)
- npm

### 2. 설치 (Installation)

프로젝트 루트 디렉토리에서 아래 명령어를 실행하여 의존성을 설치합니다.
(프론트엔드와 백엔드의 패키지를 한 번에 설치합니다.)

```bash
npm run install:all

# 참고: 만약 스크립트 실행이 안 된다면 각각 설치해주세요.
cd frontend && npm install
cd backend && npm install
```

### 3. 환경 변수 설정 (Environment Setup)

Backend 폴더에 API 키 설정이 필요합니다.

1. backend 폴더로 이동
2. .env.example 파일을 복사하여 .env 파일 생성
3. Claude AI API Key 입력

```bash
cd backend
cp .env.example .env
# .env 파일을 열어 ANTHROPIC_API_KEY 값을 입력하세요.
```

### 4. 실행 (Run)

프로젝트 루트 디렉토리에서 아래 명령어를 실행하면 프론트엔드와 백엔드가 동시에 실행됩니다.

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

---

## 🛠 기술 스택 (Tech Stack)

**Frontend**

- Core: React, TypeScript, Vite
- Routing: React Router v6 (MPA 구조 구현)
- Styling: Tailwind CSS v4, Shadcn UI
- State Management: LocalStorage API (DB 미사용 요구사항 충족)

**Backend**

- Server: Node.js, Express
- AI Integration: @anthropic-ai/sdk (Claude API)
- Security: dotenv (환경변수 관리), cors

---

## ✨ 주요 기능 (Key Features)

**1. 인증 및 사용자 관리**

- 이메일 기반 로그인: 세션 스토리지를 활용한 간편 로그인
- 보안: Protected Route를 통한 비로그인 접근 제한
- 사용자 경험: 프로필 수정 및 다크 모드(Dark Mode) 지원
- 동기화: 탭 간 동기화 지원 (로그아웃 시 열려있는 모든 탭에서 동시 로그아웃 처리)

**2. AI 캐릭터 관리**

- 기본 캐릭터: 개성 있는 기본 캐릭터 3종 제공 (Default 뱃지)
- CRUD: 사용자 정의 캐릭터 생성/수정/삭제 가능
- 페르소나: 캐릭터별 시스템 프롬프트(성격) 설정을 통해 다양한 대화 경험 제공

**3. 실시간 채팅**

- AI 연동: Claude API 연동을 통한 자연스러운 대화 구현
- Context 유지: 이전 대화 문맥(Context)을 기억하여 연속성 있는 대화 가능
- UI: 메시지 로딩 상태(Spinner) 및 타임스탬프 표시
- 유효성 검사: 200자 글자 수 제한 및 입력값 검증

**4. UI/UX**

- 반응형 디자인: TailwindCSS의 Mobile first UI를 사용해 반응형 디자인 구현
- 네비게이션: 공통 헤더 및 Breadcrumbs 적용
- 에러 핸들링: 404 Not Found 페이지 및 API 에러 처리

---

## 📂 폴더 구조 (Project Structure)

```bash
/
├── frontend/                  # React 클라이언트 애플리케이션
│   ├── public/                # 정적 파일 (favicon.svg 등)
│   ├── src/
│   │   ├── assets/            # 로고 및 이미지 리소스
│   │   ├── components/        # 재사용 가능한 UI 컴포넌트
│   │   │   ├── ui/            # Shadcn UI 베이스 컴포넌트 (Button, Input, Card 등)
│   │   │   ├── Breadcrumbs.tsx # 경로 네비게이션 컴포넌트
│   │   │   ├── Header.tsx     # 공통 헤더 및 모바일 메뉴
│   │   │   └── ProtectedRoute.tsx # 로그인 인증 가드 컴포넌트
│   │   ├── contexts/          # 전역 상태 관리
│   │   │   └── ModalContext.tsx # 알림 및 확인 모달 컨텍스트
│   │   ├── pages/             # 페이지 단위 컴포넌트 (Route)
│   │   │   ├── Login.tsx      # 로그인 페이지
│   │   │   ├── Dashboard.tsx  # 메인 대시보드 (캐릭터 목록)
│   │   │   ├── ChatRoom.tsx   # 실시간 채팅 페이지
│   │   │   ├── CharacterManage.tsx # 캐릭터 생성/수정 관리
│   │   │   ├── Profile.tsx    # 사용자 프로필 및 설정
│   │   │   └── NotFound.tsx   # 404 에러 페이지
│   │   ├── services/          # 비즈니스 로직 및 데이터 처리
│   │   │   └── storage.ts     # LocalStorage 관리 (CRUD 및 가상 DB 역할)
│   │   ├── types/             # TypeScript 타입 정의 인터페이스
│   │   ├── utils/             # 유틸리티 함수 (이메일/비밀번호 유효성 검사 등)
│   │   ├── App.tsx            # 메인 라우팅 설정
│   │   └── index.css          # Tailwind CSS v4 설정 및 전역 스타일
│   └── vite.config.ts         # Vite 설정 파일
│
├── backend/                   # Express 서버 애플리케이션
│   ├── index.js               # 서버 진입점 & Claude API 프록시 라우트
│   ├── .env                   # 환경변수
│   └── .env.example           # 환경변수 예시 파일 (제출용)
│
├── package.json               # 프로젝트 전체 실행 스크립트 (concurrently 설정)
├── README.md                  # 프로젝트 실행 가이드
└── AI_USAGE.md                # AI 코딩 도구 활용 내역서
```
