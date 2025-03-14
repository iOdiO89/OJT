export const quizData: QuizItem[] = [
  {
    type: 'SINGLE',
    question: '사과의 색깔은 무엇일까요?',
    options: ['빨강', '노랑', '파랑', '초록', '보라', '주황'],
    answer: [true, false, false, false, false, false],
  },
  {
    type: 'SINGLE',
    question: '바다는 어떤 색일까요?',
    options: ['빨강', '노랑', '파랑', '초록', '보라', '흰색'],
    answer: [false, false, true, false, false, false],
  },
  {
    type: 'SINGLE',
    question: '강아지는 어떤 소리를 낼까요?',
    options: ['야옹', '멍멍', '꽥꽥', '음메', '찍찍', '꼬끼오'],
    answer: [false, true, false, false, false, false],
  },
  {
    type: 'MULTI',
    question: '다음 중 과일은 무엇일까요?',
    options: ['사과', '바나나', '당근', '포도', '오이', '딸기'],
    answer: [true, true, false, true, false, true],
  },
  {
    type: 'SINGLE',
    question: '밤하늘에 반짝이는 것은 무엇일까요?',
    options: ['해', '별', '구름', '나무', '꽃', '달'],
    answer: [false, true, false, false, false, false],
  },
  {
    type: 'MULTI',
    question: '다음 중 동물은 무엇일까요?',
    options: ['토끼', '자동차', '호랑이', '비행기', '코끼리', '버스'],
    answer: [true, false, true, false, true, false],
  },
  {
    type: 'SINGLE',
    question: '자동차는 어디에서 달릴까요?',
    options: ['강', '바다', '하늘', '도로', '숲', '집'],
    answer: [false, false, false, true, false, false],
  },
  {
    type: 'SINGLE',
    question: '우리나라의 수도는 어디일까요?',
    options: ['서울', '부산', '대전', '광주', '제주', '울산'],
    answer: [true, false, false, false, false, false],
  },
  {
    type: 'MULTI',
    question: '다음 중 네 발을 가진 동물은 무엇일까요?',
    options: ['사자', '닭', '개', '고양이', '뱀', '말'],
    answer: [true, false, true, true, false, true],
  },
  {
    type: 'MULTI',
    question: '다음 중에서 먹을 수 있는 것은 무엇일까요?',
    options: ['사탕', '연필', '빵', '모자', '초콜릿', '바나나'],
    answer: [true, false, true, false, true, true],
  },
]
