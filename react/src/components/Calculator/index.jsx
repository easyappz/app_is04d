import React from 'react';

export default function Calculator() {
  return (
    <section data-easytag="id1-react/src/components/Calculator/index.jsx" style={{
      background: '#f2f2f7',
      borderRadius: '28px',
      padding: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
    }}>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12, textAlign: 'center' }}>Калькулятор</div>
      <div style={{ padding: '24px', borderRadius: 20, background: '#fff', textAlign: 'center', color: '#888' }}>
        Здесь будет iOS-калькулятор
      </div>
    </section>
  );
}
