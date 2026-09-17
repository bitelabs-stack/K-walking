/* Walk Korea — demo data.
   Everything here is SAMPLE content for the concept page: distances, counts and
   coordinates are approximate. Replace with an API response when the product exists. */
window.WK_DATA = {
  /* Hero picker: each purpose points at a journey card or a Stage Planner preset */
  purposes: {
    rest: { journey: 'reset' },
    reflect: { journey: 'finding' },
    challenge: {
      planner: { days: 4, pace: 25 },
      level: 'hard',
      why: {
        en: 'The Gangneung–Samcheok coast in four strong days, with every night still within 1 km of a bed.',
        ko: '강릉–삼척 해안을 나흘 만에. 강하게 걷되, 매일 밤 숙소는 종점 1km 안에.'
      }
    },
    sea: {
      planner: { days: 5, pace: 20 },
      level: 'moderate',
      why: {
        en: 'Sunrise beaches, harbour towns and a cliffside boardwalk along the East Sea.',
        ko: '일출 해변과 항구 마을, 해안단구 탐방로를 따라 걷는 동해안 5일.'
      }
    },
    temple: { journey: 'temple' },
    culture: { journey: 'jeju' }
  },

  /* East Coast Journey route (Haeparang-gil sections), north → south.
     km = cumulative walking distance; stays/eats/stores = places within 1 km of the stop. */
  route: [
    { id: 'anmok', km: 0, lat: 37.7720, lon: 128.9480,
      name: { en: 'Anmok Coffee Street', ko: '안목 커피거리' }, short: { en: 'Anmok', ko: '안목' },
      stays: 14, eats: 30, stores: 9, laundry: true, bath: true,
      transit: { en: 'Gangneung Station (KTX) is about 15 minutes by bus or taxi', ko: '강릉역(KTX)까지 버스·택시로 약 15분' },
      story: { en: "Gangneung's old port turned coffee street — a good cup before the first kilometre.", ko: '옛 포구가 커피거리가 된 안목. 첫 1km 전에 커피 한 잔.' } },
    { id: 'anin', km: 8.5, lat: 37.7350, lon: 129.0060,
      name: { en: 'Anin Harbour', ko: '안인항' }, short: { en: 'Anin', ko: '안인' },
      stays: 2, eats: 5, stores: 1, laundry: false, bath: false,
      terrain: { en: 'Riverside paths & coast road', ko: '하천변 길·해안 도로' },
      transit: { en: 'City buses to Gangneung', ko: '강릉 시내버스' } },
    { id: 'jeongdongjin', km: 18.3, lat: 37.6913, lon: 129.0341,
      name: { en: 'Jeongdongjin', ko: '정동진' }, short: { en: 'Jeongdongjin', ko: '정동진' },
      stays: 7, eats: 12, stores: 6, laundry: true, bath: false,
      terrain: { en: 'Gwaebangsan ridge trail', ko: '괘방산 능선길' },
      transit: { en: 'Jeongdongjin Station (rail)', ko: '정동진역(철도)' },
      story: { en: 'Jeongdongjin (正東津) means “the port due east” — it lies due east of Gyeongbokgung Palace in Seoul.', ko: '정동진(正東津)은 한양 경복궁의 정동쪽에 있는 나루라는 뜻입니다.' } },
    { id: 'simgok', km: 22.4, lat: 37.6680, lon: 129.0480,
      name: { en: 'Simgok Harbour', ko: '심곡항' }, short: { en: 'Simgok', ko: '심곡' },
      stays: 3, eats: 4, stores: 1, laundry: false, bath: false,
      terrain: { en: 'Cliffside boardwalk', ko: '해안 절벽 탐방로' },
      transit: { en: 'City buses to Gangneung', ko: '강릉 시내버스' },
      story: { en: 'The Badabuchae-gil boardwalk follows a coastal terrace protected as a natural monument.', ko: '바다부채길은 천연기념물인 정동진 해안단구를 따라 이어집니다.' } },
    { id: 'geumjin', km: 25.6, lat: 37.6490, lon: 129.0510,
      name: { en: 'Geumjin Beach', ko: '금진해변' }, short: { en: 'Geumjin', ko: '금진' },
      stays: 4, eats: 6, stores: 2, laundry: false, bath: false,
      terrain: { en: 'Coast road', ko: '해안 도로' },
      transit: { en: 'City buses to Gangneung', ko: '강릉 시내버스' } },
    { id: 'okgye', km: 38.4, lat: 37.6170, lon: 129.0440,
      name: { en: 'Okgye Market', ko: '옥계시장' }, short: { en: 'Okgye', ko: '옥계' },
      stays: 5, eats: 9, stores: 4, laundry: true, bath: true,
      terrain: { en: 'Hill paths & farm villages', ko: '언덕길·농촌 마을' },
      transit: { en: 'Intercity and local buses', ko: '시외·시내버스' },
      story: { en: 'A small market town — the best lunch of the day is usually here.', ko: '작은 장터 마을. 이날 가장 맛있는 점심은 대개 여기서.' } },
    { id: 'mangsang', km: 45.9, lat: 37.5890, lon: 129.0920,
      name: { en: 'Mangsang Beach', ko: '망상해변' }, short: { en: 'Mangsang', ko: '망상' },
      stays: 9, eats: 7, stores: 3, laundry: true, bath: false,
      terrain: { en: 'Pine forest & long beach', ko: '송림·긴 백사장' },
      transit: { en: 'Local buses to Donghae', ko: '동해 시내버스' } },
    { id: 'mukho', km: 53.1, lat: 37.5500, lon: 129.1160,
      name: { en: 'Mukho Port', ko: '묵호항' }, short: { en: 'Mukho', ko: '묵호' },
      stays: 8, eats: 15, stores: 5, laundry: true, bath: true,
      terrain: { en: 'Harbour promenade', ko: '항구 산책로' },
      transit: { en: 'Mukho Station (rail)', ko: '묵호역(철도)' },
      story: { en: "Nongol-dam-gil: hillside lanes where fishing families' stories are painted on the walls.", ko: '논골담길: 어부 가족들의 이야기가 담벼락 그림으로 남은 언덕 골목.' } },
    { id: 'hanseom', km: 58.6, lat: 37.5130, lon: 129.1240,
      name: { en: 'Hanseom Beach, Donghae', ko: '동해 한섬해변' }, short: { en: 'Hanseom', ko: '한섬' },
      stays: 6, eats: 10, stores: 4, laundry: true, bath: true,
      terrain: { en: 'Seaside trail', ko: '해안 산책로' },
      transit: { en: 'Donghae Station (rail)', ko: '동해역(철도)' } },
    { id: 'chuam', km: 66.5, lat: 37.4770, lon: 129.1620,
      name: { en: 'Chuam Beach', ko: '추암해변' }, short: { en: 'Chuam', ko: '추암' },
      stays: 6, eats: 8, stores: 3, laundry: false, bath: false,
      terrain: { en: 'Coastal cliffs', ko: '해안 절벽길' },
      transit: { en: 'Local buses to Donghae and Samcheok', ko: '동해·삼척 시내버스' },
      story: { en: "Candlestick Rock, one of Korea's best-loved sunrise spots.", ko: '한국의 대표 일출 명소로 꼽히는 촛대바위.' } },
    { id: 'samcheok', km: 72.6, lat: 37.4360, lon: 129.1860,
      name: { en: 'Samcheok Port', ko: '삼척항' }, short: { en: 'Samcheok', ko: '삼척' },
      stays: 12, eats: 22, stores: 8, laundry: true, bath: true,
      terrain: { en: 'Park paths & harbour town', ko: '공원길·항구 마을' },
      transit: { en: 'Samcheok Intercity Bus Terminal', ko: '삼척 시외버스터미널' },
      story: { en: 'Jukseoru, a riverside pavilion listed as a National Treasure, is a short detour inland.', ko: '강변 절벽 위 국보 죽서루가 가까이 있습니다.' } },
    { id: 'maengbang', km: 80.9, lat: 37.3930, lon: 129.2080,
      name: { en: 'Maengbang Beach', ko: '맹방해변' }, short: { en: 'Maengbang', ko: '맹방' },
      stays: 4, eats: 5, stores: 2, laundry: false, bath: false,
      terrain: { en: 'Long sandy beach', ko: '긴 모래 해변' },
      transit: { en: 'Local buses to Samcheok', ko: '삼척 시내버스' },
      story: { en: 'In spring the fields behind the beach turn yellow with canola.', ko: '봄이면 해변 뒤 들판이 유채꽃으로 노랗게 물듭니다.' } },
    { id: 'gungchon', km: 92.6, lat: 37.3320, lon: 129.2680,
      name: { en: 'Gungchon', ko: '궁촌' }, short: { en: 'Gungchon', ko: '궁촌' },
      stays: 3, eats: 4, stores: 1, laundry: false, bath: false,
      terrain: { en: 'Village lanes by the old railway', ko: '옛 철길 옆 마을길' },
      transit: { en: 'Local buses to Samcheok', ko: '삼척 시내버스' } },
    { id: 'yonghwa', km: 97.8, lat: 37.3030, lon: 129.3040,
      name: { en: 'Yonghwa', ko: '용화' }, short: { en: 'Yonghwa', ko: '용화' },
      stays: 5, eats: 6, stores: 2, laundry: false, bath: false,
      terrain: { en: 'Coves & coast road', ko: '작은 만·해안 도로' },
      transit: { en: 'Local buses to Samcheok', ko: '삼척 시내버스' } },
    { id: 'jangho', km: 101.2, lat: 37.2870, lon: 129.3160,
      name: { en: 'Jangho Port', ko: '장호항' }, short: { en: 'Jangho', ko: '장호' },
      stays: 7, eats: 9, stores: 3, laundry: true, bath: false,
      terrain: { en: 'Headland path', ko: '곶 산책로' },
      transit: { en: 'Local buses to Samcheok', ko: '삼척 시내버스' },
      story: { en: "Clear water and rocky coves — locals call it Korea's Naples.", ko: '맑은 물과 바위 해안, ‘한국의 나폴리’라 불리는 항구.' } }
  ],

  questions: [
    { en: 'What did you leave behind at the start line today?', ko: '오늘 출발선에 무엇을 내려놓고 왔나요?' },
    { en: 'Who or what surprised you on the road?', ko: '길 위에서 나를 놀라게 한 사람이나 장면이 있었나요?' },
    { en: 'When did you stop counting kilometres?', ko: '언제부터 거리를 세지 않게 되었나요?' },
    { en: 'What felt heavy today — your pack, or something else?', ko: '오늘 무거웠던 건 배낭이었나요, 다른 무엇이었나요?' },
    { en: 'What do you want to carry into tomorrow?', ko: '내일로 가져가고 싶은 것은 무엇인가요?' },
    { en: 'What did the sea sound like when you stopped?', ko: '걸음을 멈췄을 때 바다는 어떤 소리였나요?' }
  ],

  passport: [
    { ko: '정동진', roman: 'Jeongdongjin', km: 18.3, line: { en: 'Arrived with the trains. Tired in the best way.', ko: '기차 소리와 함께 도착. 기분 좋게 지쳤다.' } },
    { ko: '옥계', roman: 'Okgye', km: 20.1, line: { en: 'Lunch at the market. Nobody rushed me.', ko: '시장에서 점심. 아무도 나를 재촉하지 않았다.' } },
    { ko: '동해', roman: 'Donghae', km: 20.2, line: { en: 'Somewhere after Mukho, I stopped counting kilometres.', ko: '묵호를 지나면서 거리를 세지 않게 됐다.' } },
    { ko: '맹방', roman: 'Maengbang', km: 22.3, line: { en: 'Walked barefoot on the sand for an hour.', ko: '한 시간 동안 맨발로 모래 위를 걸었다.' } },
    { ko: '장호', roman: 'Jangho', km: 20.3, line: { en: 'The water was so clear I forgot to take a photo.', ko: '물이 너무 맑아서 사진 찍는 것도 잊었다.' } }
  ],

  /* Interface strings used by scripts ({tokens} are replaced at runtime) */
  ui: {
    menuOpen: { en: 'Open menu', ko: '메뉴 열기' },
    menuClose: { en: 'Close menu', ko: '메뉴 닫기' },

    seeJourney: { en: 'See the journey', ko: 'Journey 보기' },
    openPlanner: { en: 'Open in Stage Planner', ko: '스테이지 플래너에서 보기' },
    eastTitle: { en: 'East Coast Journey in {days} days', ko: '{days}일 East Coast Journey' },
    planMeta: { en: '{days} days · {km} km · {level}', ko: '{days}일 · {km} km · {level}' },
    level: {
      easy: { en: 'Easy', ko: '쉬움' },
      moderate: { en: 'Moderate', ko: '보통' },
      hard: { en: 'Challenging', ko: '도전' }
    },

    daysLabel: { en: 'Days of the plan', ko: '일정별 Stage' },
    dayN: { en: 'Day {n}', ko: 'Day {n}' },
    dayOf: { en: 'Day {n} of {total}', ko: '{total}일 중 {n}일차' },
    summary: { en: '{days} days · {km} km', ko: '{days}일 · {km} km' },
    spread: { en: 'At this pace you would finish early, so the coast is spread over {days} easier days.', ko: '이 속도라면 일찍 끝나서, {days}일에 맞춰 여유 있게 나눴어요.' },
    partial: { en: 'This plan covers the first {km} km. Add days or distance to reach Jangho Port.', ko: '처음 {km} km 구간을 걷는 일정이에요. 장호항까지 가려면 일수나 거리를 늘려 보세요.' },
    distance: { en: 'Distance', ko: '거리' },
    time: { en: 'Walking time', ko: '걷는 시간' },
    terrain: { en: 'Terrain', ko: '길' },
    timeVal: { en: '{h} h {m} m', ko: '{h}시간 {m}분' },
    longer: { en: 'Longer day — the next beds are a little further on.', ko: '긴 하루예요. 다음 숙소가 조금 더 멀리 있어요.' },
    shorter: { en: 'Shorter day — this is the nearest stop with beds.', ko: '짧은 하루예요. 숙소가 있는 가장 가까운 마을이에요.' },
    tonight: { en: 'Tonight in {place}', ko: '오늘 밤, {place}' },
    stays: { en: 'stays within 1 km', ko: '1km 안 숙소' },
    eats: { en: 'places to eat', ko: '식당' },
    stores: { en: 'convenience stores', ko: '편의점' },
    laundry: { en: 'Laundry', ko: '세탁 가능' },
    noLaundry: { en: 'No laundry', ko: '세탁 불가' },
    bath: { en: 'Bathhouse', ko: '목욕탕' },
    noBath: { en: 'No bathhouse', ko: '목욕탕 없음' },
    transit: { en: 'Getting in & out', ko: '교통' },
    story: { en: 'Story point', ko: '스토리 포인트' },
    question: { en: 'Evening question', ko: '오늘 저녁의 질문' },
    seaLabel: { en: 'EAST SEA', ko: '동해' },

    stampNext: { en: 'Stamp day {n}', ko: '{n}일차 스탬프 찍기' },
    stampReset: { en: 'Start again', ko: '처음부터 다시' },
    stamped: { en: 'Day {n} stamped in {place}.', ko: '{place}에서 {n}일차 스탬프를 찍었어요.' },
    notYet: { en: 'Not yet walked', ko: '아직 걷지 않은 길' },
    complete: { en: 'Journey complete', ko: '여정 완주' },
    certTitle: { en: 'East Coast Journey', ko: 'East Coast Journey' },
    certMeta: { en: '5 days · 101.2 km · Gangneung → Samcheok', ko: '5일 · 101.2 km · 강릉 → 삼척' },
    certLine: { en: 'Five places, five lines — the walk in your own words.', ko: '다섯 곳, 다섯 문장 — 내 말로 남긴 나의 길.' },

    installed: { en: 'Installed. Open Walk Korea from your home screen.', ko: '설치했어요. 홈 화면에서 Walk Korea를 열어 보세요.' },
    copied: { en: 'Link copied.', ko: '링크를 복사했어요.' },
    copyFailed: { en: 'Copy the address from your browser bar.', ko: '주소창의 주소를 복사해 주세요.' },

    errEmpty: { en: 'Enter your email address.', ko: '이메일 주소를 입력해 주세요.' },
    errFormat: { en: 'Enter an email address like name@example.com.', ko: 'name@example.com 형식으로 입력해 주세요.' },
    errConsent: { en: 'Tick the box to agree to beta emails.', ko: '베타 소식 수신에 동의해 주세요.' }
  }
};
