
export type ProblemType = 'arithmetic' | 'algebraic' | 'mixed';

export interface MathProblem {
  question: string;
  answer: number;
  type: ProblemType;
  explanation?: string;
}

export const generateMathProblem = (difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  const problemTypes: ProblemType[] = difficulty === 'easy' ? ['arithmetic'] : ['arithmetic', 'algebraic', 'mixed'];
  const selectedType = problemTypes[Math.floor(Math.random() * problemTypes.length)];

  switch (difficulty) {
    case 'easy': {
      const operations = ['+', '-', '×'];
      const op = operations[Math.floor(Math.random() * operations.length)];
      const a = Math.floor(Math.random() * 15) + 1;
      const b = Math.floor(Math.random() * 15) + 1;
      
      let question = '';
      let answer = 0;
      
      if (op === '+') {
        question = `${a} + ${b}`;
        answer = a + b;
      } else if (op === '-') {
        const [larger, smaller] = [Math.max(a, b), Math.min(a, b)];
        question = `${larger} - ${smaller}`;
        answer = larger - smaller;
      } else {
        question = `${a} × ${b}`;
        answer = a * b;
      }
      
      return { question, answer, type: 'arithmetic' };
    }

    case 'medium': {
      if (selectedType === 'algebraic') {
        const a = Math.floor(Math.random() * 20) + 1;
        const x = Math.floor(Math.random() * 15) + 1;
        const b = x + a;
        return {
          question: `x + ${a} = ${b}`,
          answer: x,
          type: 'algebraic',
          explanation: `x = ${b} - ${a} = ${x}`
        };
      } else {
        const a = Math.floor(Math.random() * 12) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        const c = Math.floor(Math.random() * 10) + 1;
        const operations = ['×+', '×-', '÷+', '÷-'];
        const op = operations[Math.floor(Math.random() * operations.length)];
        
        let question = '';
        let answer = 0;
        
        if (op === '×+') {
          question = `${a} × ${b} + ${c}`;
          answer = a * b + c;
        } else if (op === '×-') {
          question = `${a} × ${b} - ${c}`;
          answer = a * b - c;
        } else if (op === '÷+') {
          const dividend = a * b;
          question = `${dividend} ÷ ${b} + ${c}`;
          answer = dividend / b + c;
        } else {
          const dividend = a * b;
          question = `${dividend} ÷ ${b} - ${c}`;
          answer = dividend / b - c;
        }
        
        return { question, answer, type: 'mixed' };
      }
    }

    case 'hard': {
      if (selectedType === 'algebraic') {
        const a = Math.floor(Math.random() * 8) + 2;
        const x = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 15) + 1;
        const c = a * x + b;
        return {
          question: `${a}x + ${b} = ${c}`,
          answer: x,
          type: 'algebraic',
          explanation: `x = (${c} - ${b}) ÷ ${a} = ${x}`
        };
      } else {
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        const c = Math.floor(Math.random() * 6) + 2;
        const d = Math.floor(Math.random() * 5) + 1;
        
        const patterns = [
          { q: `(${a} + ${b}) × ${c} - ${d}`, a: (a + b) * c - d },
          { q: `${a} × (${b} + ${c}) - ${d}`, a: a * (b + c) - d },
          { q: `(${a} × ${b}) ÷ ${c} + ${d}`, a: Math.floor((a * b) / c) + d },
          { q: `${a}² - ${b}`, a: a * a - b }
        ];
        
        const selected = patterns[Math.floor(Math.random() * patterns.length)];
        return { question: selected.q, answer: selected.a, type: 'mixed' };
      }
    }

    default:
      return { question: '2 + 2', answer: 4, type: 'arithmetic' };
  }
};
