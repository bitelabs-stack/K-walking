# Walk Korea — 가상 랜딩페이지 기획 & 프로토타입

> 한국형 Walking Journey Platform(가칭 **Walk Korea**)을 글로벌 방문자에게 소개하는 반응형 랜딩 웹앱.
> 순수 HTML · CSS · JavaScript, 빌드 도구 없음.
>
> **Live:** https://bitelabs-stack.github.io/K-walking/ · 한국어: https://bitelabs-stack.github.io/K-walking/?lang=ko

## 1. 기획 요약

| 항목 | 내용 |
|---|---|
| 페이지의 한 가지 목적 | 방문자가 "왜 걷는가"에서 출발해 자신에게 맞는 Journey를 발견하고 **베타 신청**까지 이어지게 한다 |
| 핵심 타깃 | ① 한국의 장거리 길을 걷고 싶은 외국인(영어권) ② 회복·성찰형 여행을 찾는 국내 여행자 ③ 지자체·숙소 파트너 ④ 심사위원·투자자 |
| 메시지 | EN **Walk Korea. Find yourself.** · KO **길을 찾는 것이 아니라, 나를 찾는 여행** |
| 포지셔닝 | "The Korean Camino" — 산티아고의 *Camino*(길)와 한국어 *길*을 잇는 창업 스토리 |
| 1차 전환 | 베타 신청(이메일) · 2차 전환: 스테이지 플래너 체험, 파트너 문의 |

### 페이지 구성 (스토리 흐름)

| # | 섹션 | 역할 | 사업계획서 연결 |
|---|---|---|---|
| 1 | Hero + "왜 걷고 싶으세요?" | 목적 선택 → 추천 Journey 즉시 제시 | 3.1 목적 기반 코스 |
| 2 | The opportunity | 길은 있지만 여정이 없다 · 6개 서비스를 오가는 문제 | 1. 시장조사 |
| 3 | Where it began (길 글리프) | 아일랜드 → 산티아고 → 한국, 창업 동기 | 10. 창업동기 |
| 4 | How it works | 인포그래픽 5단계를 HTML로 재구성(번역·접근성) | 서비스 흐름 |
| 5 | Stage Planner (체험형) | 기간·하루 거리 → 일별 Stage, 종점 1km 숙소, 교통, 저녁 질문, 지도 | 3.2 / 5.2 |
| 6 | Journeys | 목적별 필터, 일별 거리 막대, 출시/추후 상태 | 9. MVP |
| 7 | Stay · Eat · Experience | 워커 전용 필터, 지역경제 연결 | 3.5 / 5.4 |
| 8 | Pilgrim Story + Passport | 별점 대신 감정 기록, 스탬프 찍기 체험 → 완주 인증서 | 3.3 / 3.4 |
| 9 | International walkers | 교통·에티켓·안전(112/119/1330)·오프라인·다국어 | 7. 외국인 전략 |
| 10 | Comparison | 서비스 **유형**별 비교(경쟁사 실명 미표기) | 8. 경쟁구도 |
| 11 | Plans | Explorer(무료) / Journey Planner(프리미엄) | 6.3 |
| 12 | Partners | 지자체 B2B · 숙소/호스트 | 6.1, 6.2, 6.4 |
| 13 | FAQ → Beta | 불안 해소 후 신청 | — |

## 2. 글로벌 기준 적용 항목

- **다국어**: 영어 기본 + 한국어 전환. `?lang=ko` → 저장된 선택 → 브라우저 첫 언어 순으로 자동 결정, `<html lang>` 갱신, `hreflang` 대체 링크, 한국어 `word-break: keep-all`
- **접근성(WCAG 2.2 AA 지향)**: 시맨틱 랜드마크, 본문 바로가기, 키보드 조작(탭 목록 화살표 키), `aria-live` 결과 안내, 명확한 포커스, 대비 4.5:1 이상, `prefers-reduced-motion` 대응, 의미 있는 대체 텍스트
- **반응형·앱 경험**: 375px~대형 화면, 모바일 가로 스와이프 카드·하단 고정 CTA, 다크 모드(`prefers-color-scheme`), 웹 앱 매니페스트·아이콘(홈 화면 추가)
- **성능**: WebP + JPEG 반응형 이미지(`srcset`/`sizes`), 지연 로딩, 히어로 `fetchpriority`, 원본 17~43MB 사진 → 150~380KB
- **SEO·공유**: meta description, Open Graph/X 카드(`assets/img/og-image.jpg`), JSON-LD
- **신뢰·정직성**: 예시 데이터와 예시 이야기에 "Sample/Example" 표기, 걷기길 운영기관과 비제휴 고지, 폼은 전송·저장하지 않음을 명시

## 3. 디자인 시스템

- **색**: Mist paper `#F1F4EF` · Pine ink `#13261D` · Pine `#1E5B3F` · East Sea `#1D5E7A` · Dawn gold `#E3A23B` · Seal red `#B23A2E`(스탬프·인증서)
- **서체**: Hahmlet(한글·라틴 겸용 디스플레이) · IBM Plex Sans KR(본문) · IBM Plex Mono(거리·시간 데이터)
- **시그니처**: ‘길’의 ㄹ을 지그재그 길로 그린 로고/글리프 — 창업 스토리(카미노 = 길)를 시각화

## 4. 파일 구조

```
index.html            페이지(영문 기본 콘텐츠, data-i18n 키)
css/styles.css        토큰(라이트/다크) · 레이아웃 · 컴포넌트
js/i18n.js            한국어 문구 사전
js/data.js            예시 데이터: 동해안 경로·질문·스탬프·UI 문구 (API로 교체 지점)
js/main.js            언어 전환 · 메뉴 · 추천 · 필터 · 스테이지 플래너 · 패스포트 · 폼
assets/img/           최적화된 사진 + OG 이미지
assets/icons/         파비콘 · 앱 아이콘
manifest.webmanifest  웹 앱 매니페스트
robots.txt, sitemap.xml  검색엔진용 (GitHub Pages 주소 기준)
.nojekyll             GitHub Pages에서 Jekyll 처리 없이 정적 파일 그대로 배포
```

## 배포 (GitHub Pages)

`main` 브랜치 루트(`/`)에서 GitHub Pages로 배포됩니다. `main`에 푸시하면 1~2분 안에 사이트가 갱신됩니다.

## 5. 실행

```bash
python -m http.server 4173
```

브라우저에서 `http://localhost:4173` (한국어: `http://localhost:4173/?lang=ko`)

## 6. 실제 서비스로 옮길 때 바꿀 곳

1. **브랜드명**: 가칭 "Walk Korea" — 상표·도메인 확인 후 `index.html`의 `brand__name`, `<title>`, OG 태그, `manifest.webmanifest` 교체
2. **베타 신청 폼**: `js/main.js`의 `betaForm` submit 핸들러에 실제 전송(예: 폼 서비스·CRM API)과 개인정보 처리방침 링크 추가
3. **데이터 검증**: `js/data.js`의 거리·숙소 수·좌표는 예시값 — 두루누비·제주올레 공식 자료와 현장 조사로 교체
4. **사진 초상권**: 동행자 사진(`camino-meseta`)을 공개 페이지에 쓰기 전에 당사자 동의 확인. 해안 이미지는 참고용(생성) 이미지
5. **도메인 변경 시**: 현재 canonical·`hreflang`·`og:url`·`og:image`·`robots.txt`·`sitemap.xml`은 `https://bitelabs-stack.github.io/K-walking/` 기준 — 커스텀 도메인을 연결하면 함께 교체
