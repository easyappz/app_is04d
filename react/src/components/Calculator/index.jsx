import React, { useEffect, useMemo, useState } from 'react';
import './styles.css';

function toNumberSafe(v) {
  if (v === '' || v === '-' || v === '.') return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState(null); // previous operand
  const [op, setOp] = useState(null); // '+', '-', '×', '÷'
  const [overwrite, setOverwrite] = useState(true);
  const [lastOperand, setLastOperand] = useState(null); // for repeated equals

  const isZero = display === '0' || display === '-0';
  const clearLabel = isZero && prev === null && !op ? 'AC' : 'C';

  const btn = (label, onClick, className = '', aria = undefined) => (
    <button
      key={label}
      type="button"
      className={className}
      onClick={onClick}
      aria-label={aria || label}
    >
      {label}
    </button>
  );

  const inputDigit = (d) => {
    setDisplay((curr) => {
      if (overwrite) {
        setOverwrite(false);
        return String(d);
      }
      if (curr.length >= 14) return curr; // simple length guard
      if (curr === '0') return String(d);
      if (curr === '-0') return '-' + String(d);
      return curr + String(d);
    });
  };

  const inputDot = () => {
    setDisplay((curr) => {
      if (overwrite) {
        setOverwrite(false);
        return '0.';
      }
      return curr.includes('.') ? curr : curr + '.';
    });
  };

  const toggleSign = () => {
    setDisplay((curr) => (curr.startsWith('-') ? curr.slice(1) || '0' : (curr === '0' ? '-0' : '-' + curr)));
  };

  const applyPercent = () => {
    setDisplay((curr) => {
      const current = toNumberSafe(curr);
      if (op && prev !== null) {
        const value = (prev * current) / 100;
        setOverwrite(true);
        return String(value);
      }
      const value = current / 100;
      setOverwrite(true);
      return String(value);
    });
  };

  const clear = () => {
    if (clearLabel === 'C') {
      setDisplay('0');
      setOverwrite(true);
    } else {
      setDisplay('0');
      setPrev(null);
      setOp(null);
      setLastOperand(null);
      setOverwrite(true);
    }
  };

  const compute = (a, b, operation) => {
    switch (operation) {
      case '+': return a + b;
      case '−': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const chooseOp = (nextOp) => {
    const current = toNumberSafe(display);
    if (op && prev !== null && !overwrite) {
      const result = compute(prev, current, op);
      setPrev(result);
      setDisplay(String(result));
      setOverwrite(true);
      setLastOperand(null);
      setOp(nextOp);
      return;
    }
    if (prev === null) {
      setPrev(current);
    }
    setOp(nextOp);
    setOverwrite(true);
    setLastOperand(null);
  };

  const equals = () => {
    if (!op) return;
    const current = toNumberSafe(display);
    let b;
    if (!overwrite) {
      b = current;
      setLastOperand(current);
    } else {
      b = lastOperand !== null ? lastOperand : current;
    }
    const a = prev !== null ? prev : current;
    const result = compute(a, b, op);
    setDisplay(String(result));
    setPrev(result);
    setOverwrite(true);
  };

  const handleKeyDown = (e) => {
    const key = e.key;
    if (key >= '0' && key <= '9') {
      inputDigit(key);
      return;
    }
    if (key === '.' || key === ',') {
      e.preventDefault();
      inputDot();
      return;
    }
    if (key === '+' || key === '-') {
      chooseOp(key === '+' ? '+' : '−');
      return;
    }
    if (key === '*' || key.toLowerCase() === 'x') {
      chooseOp('×');
      return;
    }
    if (key === '/') {
      chooseOp('÷');
      return;
    }
    if (key === 'Enter' || key === '=') {
      equals();
      return;
    }
    if (key === '%') {
      applyPercent();
      return;
    }
    if (key === 'Escape') {
      clear();
      return;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, op, prev, overwrite, lastOperand]);

  const opClass = (name) => (op === name ? ' op-active' : '');

  return (
    <main data-easytag="id1-react/src/components/Calculator/index.jsx" className="calc-root">
      <div className="calc-wrapper">
        <div className="calc-display" aria-live="polite">{display}</div>
        <div className="calc-grid">
          {btn(clearLabel, clear, 'btn btn-func')}
          {btn('+/-', toggleSign, 'btn btn-func', 'Смена знака')}
          {btn('%', applyPercent, 'btn btn-func')}
          {btn('÷', () => chooseOp('÷'), 'btn btn-op' + opClass('÷'))}

          {btn('7', () => inputDigit(7), 'btn btn-num')}
          {btn('8', () => inputDigit(8), 'btn btn-num')}
          {btn('9', () => inputDigit(9), 'btn btn-num')}
          {btn('×', () => chooseOp('×'), 'btn btn-op' + opClass('×'))}

          {btn('4', () => inputDigit(4), 'btn btn-num')}
          {btn('5', () => inputDigit(5), 'btn btn-num')}
          {btn('6', () => inputDigit(6), 'btn btn-num')}
          {btn('−', () => chooseOp('−'), 'btn btn-op' + opClass('−'))}

          {btn('1', () => inputDigit(1), 'btn btn-num')}
          {btn('2', () => inputDigit(2), 'btn btn-num')}
          {btn('3', () => inputDigit(3), 'btn btn-num')}
          {btn('+', () => chooseOp('+'), 'btn btn-op' + opClass('+'))}

          <button type="button" className="btn btn-num btn-zero" onClick={() => inputDigit(0)}>0</button>
          {btn('.', inputDot, 'btn btn-num')}
          {btn('=', equals, 'btn btn-op btn-eq')}
        </div>
      </div>
    </main>
  );
}
