'use client';

import SignatureCanvas from 'react-signature-canvas';
import { useRef } from 'react';
import styles from './FirmaDigital.module.css';

const FirmaDigital = ({ setFieldValue }) => {
  const sigCanvas = useRef(null);

  const clear = () => {
    sigCanvas.current.clear();
    setFieldValue('firma_digital', '');
  };

  const save = () => {
    const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    setFieldValue('firma_digital', dataURL);
  };

  return (
    <div className={styles.signatureWrapper}>
      <label>Firma Digital:</label>
      <SignatureCanvas
        penColor="black"
        canvasProps={{ width: 400, height: 150, className: styles.signatureCanvas }}
        ref={sigCanvas}
      />
      <div className={styles.signatureControls}>
        <button type="button" onClick={clear} className={styles.button}>Limpiar</button>
        <button type="button" onClick={save} className={styles.button}>Guardar Firma</button>
      </div>
    </div>
  );
};

export default FirmaDigital;
