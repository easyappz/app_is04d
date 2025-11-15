import React from 'react';
import Calculator from '../Calculator/index.jsx';

export default function Home() {
  return (
    <main data-easytag="id1-react/src/components/Home/index.jsx" className="home-page" style={{display:'flex', justifyContent:'center', alignItems:'flex-start', padding:'24px'}}>
      <div style={{width:'100%', maxWidth: '420px'}}>
        <Calculator />
      </div>
    </main>
  );
}
