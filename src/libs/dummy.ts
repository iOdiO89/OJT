export const quizData: Quiz[] = [
  {
    type: 'SINGLE',
    topic: '사과 색 알아보기',
    question: '사과의 색깔은 무엇일까요?',
    options: ['빨강', '노랑', '파랑', '초록', '보라', '주황'],
    answer: [true, false, false, false, false, false]
  },
  {
    type: 'SINGLE',
    question: '바다는 어떤 색일까요?',
    topic: '바다 색 구별하기',
    options: ['빨강', '노랑', '파랑', '초록', '보라', '흰색'],
    answer: [false, false, true, false, false, false]
  },
  {
    type: 'MATH',
    question: '2+3',
    topic: '간단한 덧셈 문제',
    options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    answer: [false, false, false, false, false, true, false, false, false, false]
  },
  {
    type: 'MULTI',
    question: '다음 중 과일은 무엇일까요?',
    topic: '과일 맞히기',
    options: ['사과', '바나나', '당근', '포도', '오이', '딸기'],
    answer: [true, true, false, true, false, true]
  },
  {
    type: 'SINGLE',
    question: '밤하늘에 반짝이는 것은 무엇일까요?',
    topic: '밤하늘에서 빛나는 것',
    options: ['해', '별', '구름', '나무', '꽃', '달'],
    answer: [false, true, false, false, false, false]
  },
  {
    type: 'MULTI',
    question: '다음 중 동물은 무엇일까요?',
    topic: '동물 찾기',
    options: ['토끼', '자동차', '호랑이', '비행기', '코끼리', '버스'],
    answer: [true, false, true, false, true, false]
  },
  {
    type: 'DRAG',
    question: '그림을 보고, 빈칸에 알맞은 말을 옮겨 보세요.',
    topic: '사물 이름 옮기기',
    images: ['/images/eraser.png', '/images/scissor.png', '/images/pencil.png'],
    options: ['연필', '풀', '가위', '지우개', '형광펜', '노트'],
    answer: ['지우개', '가위', '연필']
  },
  {
    type: 'SINGLE',
    question: '우리나라의 수도는 어디일까요?',
    topic: '우리나라 수도 맞히기',
    options: ['서울', '부산', '대전', '광주', '제주', '울산'],
    answer: [true, false, false, false, false, false]
  },
  {
    type: 'MULTI',
    question: '다음 중 네 발을 가진 동물은 무엇일까요?',
    topic: '네 발 가진 동물 찾기',
    options: ['사자', '닭', '개', '고양이', '뱀', '말'],
    answer: [true, false, true, true, false, true]
  },
  {
    type: 'MULTI',
    question: '다음 중에서 먹을 수 있는 것은 무엇일까요?',
    topic: '먹을 수 있는 것 찾기',
    options: ['사탕', '연필', '빵', '모자', '초콜릿', '바나나'],
    answer: [true, false, true, false, true, true]
  }
]

export const records: QuizHistory[] = [
  {
    isAllCorrect: true,
    isCorrect: [true],
    answer: ['빨강'],
    topic: '사과 색 알아보기'
  },
  {
    isAllCorrect: false,
    isCorrect: [false],
    answer: ['파랑'],
    topic: '바다 색 구별하기'
  },
  {
    isAllCorrect: true,
    isCorrect: [true],
    answer: ['5'],
    topic: '간단한 덧셈 문제'
  },
  {
    isAllCorrect: false,
    isCorrect: [true, false, true, false],
    answer: ['사과', '바나나', '포도', '딸기'],
    topic: '과일 맞히기'
  },
  {
    isAllCorrect: true,
    isCorrect: [true],
    answer: ['별'],
    topic: '밤하늘에서 빛나는 것'
  },
  {
    isAllCorrect: false,
    isCorrect: [true, false, true],
    answer: ['토끼', '호랑이', '코끼리'],
    topic: '동물 찾기'
  },
  {
    isAllCorrect: true,
    isCorrect: [true, true, true],
    answer: ['지우개', '가위', '연필'],
    topic: '사물 이름 옮기기'
  },
  {
    isAllCorrect: false,
    isCorrect: [false],
    answer: ['서울'],
    topic: '우리나라 수도 맞히기'
  },
  {
    isAllCorrect: true,
    isCorrect: [true, true, true, true],
    answer: ['사자', '개', '고양이', '말'],
    topic: '네 발 가진 동물 찾기'
  },
  {
    isAllCorrect: false,
    isCorrect: [true, false, true, false],
    answer: ['사탕', '빵', '초콜릿', '바나나'],
    topic: '먹을 수 있는 것 찾기'
  }
]
