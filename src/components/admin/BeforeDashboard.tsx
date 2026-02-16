import React from 'react'

const BeforeDashboard = () => (
  <div
    style={{
      padding: '32px 24px',
      background: 'linear-gradient(135deg, #231F20 0%, #3a3536 100%)',
      borderRadius: '8px',
      marginBottom: '24px',
      color: '#FFFEFC',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
      <img
        src="/logo/LOGOFINAL2-300x100.png"
        alt="Las Romeas"
        style={{ height: '36px', width: 'auto', filter: 'brightness(1.1)' }}
      />
    </div>
    <p style={{ margin: 0, fontSize: '14px', color: '#C9A96E', letterSpacing: '0.05em' }}>
      Panel de administración
    </p>
    <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'rgba(255,254,252,0.6)', lineHeight: 1.5 }}>
      Gestioná productos, categorías, imágenes y contenido del sitio desde acá.
    </p>
  </div>
)

export default BeforeDashboard
