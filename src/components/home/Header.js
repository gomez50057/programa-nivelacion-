"use client";

import { useEffect, useRef } from 'react';
import dynamic from "next/dynamic";

// Deshabilita SSR para HeaderAnimation
const HeaderAnimation = dynamic(() => import("../shared/HeaderAnimation"), { ssr: false });
import './Header.css';

const Header = () => {
  const imgBasePath = "/img/";
  const imgZmSelect = "/img/ZM elige/";

  const txtRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (txtRef.current) {
      txtRef.current.classList.add('fade-in');
    }
    if (imgRef.current) {
      imgRef.current.classList.add('fade-in');
    }
  }, []);

  // Función para manejar la selección de zona y desplazarse hacia abajo
  const setZonaAndScroll = (zona) => {
    // Guardar en localStorage
    localStorage.setItem('selectedZonaMetropolitana', zona);
    // Emitir evento personalizado
    const event = new Event('zonaChanged');
    window.dispatchEvent(event);

    // Desplazarse hacia abajo 100vh
    window.scrollTo({
      top: window.innerHeight,  // Esto desplaza 100vh
      behavior: 'smooth',       // Animación suave
    });
  };

  return (
    <section id="header" className="header-container">
      <div className="background-svg" />
      <div className="content_header">
        <div className="header_txt fade-in-target" ref={txtRef}>
          <HeaderAnimation />
        </div>

        <div className="ZonasMetro">
          <p>¡Elige una Zona Metropolitana! </p>
          <div className="content_circuleZM">
            <div className="circuleZM" onClick={() => setZonaAndScroll('ZMP')}>
              <img src={`${imgZmSelect}ZMP.jpg`} alt="ZM Pachuca" />
              <div className="tooltip">ZM de Pachuca</div>
            </div>
            <div className="circuleZM" onClick={() => setZonaAndScroll('ZMTula')}>
              <img src={`${imgZmSelect}ZMTula.webp`} alt="ZMTula" />
              <div className="tooltip">ZM de Tula</div>
            </div>
            <div className="circuleZM" onClick={() => setZonaAndScroll('ZMTulancingo')}>
              <img src={`${imgZmSelect}ZMTulancingo.jpg`} alt="ZMTulancingo" />
              <div className="tooltip">ZM de Tulancingo</div>
            </div>
            <div className="circuleZM" onClick={() => setZonaAndScroll('ZMVM')}>
              <img src={`${imgZmSelect}ZMVM.jpg`} alt="ZMVM" />
              <div className="tooltip">ZM del Valle de México</div>
            </div>
          </div>
        </div>

        <div className="header_img fade-in-target" ref={imgRef}>
          <img src={`${imgBasePath}headerimg.png`} alt="img_representativa" className="floating-img" />
        </div>
      </div>
    </section>
  );
};

export default Header;
