export type ProblemType = 'arithmetic' | 'algebraic' | 'mixed';

export interface MathProblem {
  question: string;
  answer: number;
  type: ProblemType;
  explanation?: string;
}

export const generateMathProblem = (difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  // Easy: Simple arithmetic, including basic division
  if (difficulty === 'easy') {
    const operations = ['+', '-', '×', '÷'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let a = Math.floor(Math.random() * 10) + 1;
    let b = Math.floor(Math.random() * 10) + 1;

    if (op === '+') {
      return { question: `${a} + ${b}`, answer: a + b, type: 'arithmetic' };
    } else if (op === '-') {
      const [larger, smaller] = [Math.max(a, b), Math.min(a, b)];
      return { question: `${larger} - ${smaller}`, answer: larger - smaller, type: 'arithmetic' };
    } else if (op === '×') {
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
      return { question: `${a} × ${b}`, answer: a * b, type: 'arithmetic' };
    } else { // '÷'
      const divisor = Math.floor(Math.random() * 5) + 2; // 2 to 6
      const quotient = Math.floor(Math.random() * 10) + 1;
      const dividend = divisor * quotient;
      return { question: `${dividend} ÷ ${divisor}`, answer: quotient, type: 'arithmetic' };
    }
  }

  // Medium: Two-step arithmetic/mixed or simple algebra
  if (difficulty === 'medium') {
    const problemType = Math.random() > 0.4 ? 'mixed' : 'algebraic';

    if (problemType === 'algebraic') {
        const operations = ['+', '-', '×'];
        const op = operations[Math.floor(Math.random() * operations.length)];
        const x = Math.floor(Math.random() * 12) + 2; // 2 to 13
        const a = Math.floor(Math.random() * 8) + 2;  // 2 to 9
        
        if (op === '+') {
            const b = x + a;
            return { question: `x + ${a} = ${b}`, answer: x, type: 'algebraic' };
        } else if (op === '-') {
            const b = x - a;
            return { question: `x - ${a} = ${b}`, answer: x, type: 'algebraic' };
        } else { // op === '×'
            const b = x * a;
            return { question: `${a}x = ${b}`, answer: x, type: 'algebraic' };
        }
    } else { // 'mixed'
        const a = Math.floor(Math.random() * 10) + 2;
        const b = Math.floor(Math.random() * 10) + 2;
        const c = Math.floor(Math.random() * 15) + 1;
        const operations = ['×', '÷'];
        const op1 = operations[Math.floor(Math.random() * operations.length)];
        const op2 = Math.random() > 0.5 ? '+' : '-';

        if (op1 === '×') {
            const question = `${a} × ${b} ${op2} ${c}`;
            const answer = op2 === '+' ? (a * b) + c : (a * b) - c;
            return { question, answer, type: 'mixed' };
        } else { // '÷'
            const dividend = a * b;
            const question = `${dividend} ÷ ${a} ${op2} ${c}`;
            const answer = op2 === '+' ? b + c : b - c;
            return { question, answer, type: 'mixed' };
        }
    }
  }
  
  // Hard: Multi-step arithmetic with parentheses or more complex algebra
  if (difficulty === 'hard') {
    const problemType = Math.random() > 0.5 ? 'mixed' : 'algebraic';

    if (problemType === 'algebraic') {
        // ax + b = c
        const a = Math.floor(Math.random() * 10) + 2; // 2-11
        const x = Math.floor(Math.random() * 15) + 2; // 2-16
        const b = Math.floor(Math.random() * 20) + 1; // 1-20
        const c = a * x + b;
        return {
          question: `${a}x + ${b} = ${c}`,
          answer: x,
          type: 'algebraic',
          explanation: `x = (${c} - ${b}) / ${a} = ${x}`
        };
    } else { // 'mixed'
        const a = Math.floor(Math.random() * 8) + 3; // 3-10
        const b = Math.floor(Math.random() * 8) + 3; // 3-10
        const c = Math.floor(Math.random() * 6) + 2; // 2-7
        const d = Math.floor(Math.random() * 10) + 1; // 1-10
        
        const patterns = [
          { q: `(${a} + ${b}) × ${c}`, a: (a + b) * c },
          { q: `${a} × (${b} - ${c})`, a: a * (b - c) },
          { q: `(${a * b} ÷ ${b}) × ${c} + ${d}`, a: a * c + d},
          { q: `${a}² + ${b}²`, a: a * a + b * b },
          { q: `(${d} + ${c}) × ${b} - ${a}`, a: (d + c) * b - a },
        ];
        
        const selected = patterns[Math.floor(Math.random() * patterns.length)];
        return { question: selected.q, answer: selected.a, type: 'mixed' };
    }
  }

  // Fallback, should not be reached
  return { question: '1 + 1', answer: 2, type: 'arithmetic' };
};
