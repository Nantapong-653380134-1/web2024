new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      step: 'start',
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      score: 0
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    }
  },
  methods: {
    async startQuiz() {
      const response = await fetch('quiz_questions.json');
      const data = await response.json();
      this.questions = data.map(question => ({
        ...question,
        options: question.choices
      }));
      this.answers = Array(this.questions.length).fill(null);
      this.step = 'quiz';
    },
    selectAnswer(option) {
      this.$set(this.answers, this.currentQuestionIndex, option);
    },
    nextQuestion() {
      this.currentQuestionIndex++;
    },
    prevQuestion() {
      this.currentQuestionIndex--;
    },
    checkAnswers() {
      this.score = this.questions.reduce((total, question, index) => {
        return total + (this.answers[index] === question.answer ? 1 : 0);
      }, 0);
  
      // การตรวจสอบคะแนนและแสดงข้อความที่ต่างกัน
      let message = '';
      if (this.score > 15) {
        message = 'เก่งเกิน ไปทำควิชอื่นได้เลยนะครับ';
      } else if (this.score > 10) {
        message = 'เก่งแล้วครับผม';
      } else if (this.score > 5) {
        message = 'พยายามใหม่นะ';
      } else {
        message = 'ลองใหม่อีกครั้ง!';
      }
  
      // เพิ่มข้อความที่ได้จากการตรวจสอบคะแนน
      this.step = 'result';
      this.resultMessage = message;
    },
    restartQuiz() {
      this.step = 'start';
      this.questions = [];
      this.currentQuestionIndex = 0;
      this.answers = [];
      this.score = 0;
      this.resultMessage = ''; // รีเซ็ตข้อความผลลัพธ์
    }
    
  }
});
