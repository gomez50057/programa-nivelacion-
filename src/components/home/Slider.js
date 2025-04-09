"use client";

import React, { useState, useEffect } from 'react';
import './Slider.css';
import { slidesZMVM, slidesOther } from '../../utils/sliderData';

const Slider = () => {
  // const imgBasePath = "/img/glifos/";
  const [zonaSeleccionada, setZonaSeleccionada] = useState('');
  const [slides, setSlides] = useState(slidesZMVM); // Diapositivas predeterminadas
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const getZonaFromLocalStorage = () => {
      const zonaMetropolitana = localStorage.getItem('selectedZonaMetropolitana');
      setZonaSeleccionada(zonaMetropolitana || ''); // Actualiza el estado
    };
    getZonaFromLocalStorage();
    window.addEventListener('zonaChanged', getZonaFromLocalStorage);
    return () => {
      window.removeEventListener('zonaChanged', getZonaFromLocalStorage);
    };
  }, []);

  useEffect(() => {
    // Cambiar las diapositivas según la zona seleccionada
    if (zonaSeleccionada === 'ZMVM') {
      setSlides(slidesZMVM);
    } else {
      setSlides(slidesOther);
    }
    setCurrentSlide(0); // Reiniciar al primer slide
  }, [zonaSeleccionada]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        setFade(false);
      }, 1000); // Duración de la animación
    }, 12000); // Cambiar cada 12 segundos

    return () => clearInterval(interval);
  }, [slides]);

  return (
    <div className="slider-container">
      <div className="slide">
        <div className={`slide-image ${fade ? 'fade-out' : ''}`}>
          <img src={slides[currentSlide].image} alt="placeholder" />
        </div>
        <div className="slide-content">
          <h2 className={`slide-title ${fade ? 'fade-out' : ''}`}>
            {slides[currentSlide].title}
          </h2>
          {/* <div className="slide-glifo">
            <img src={`${imgBasePath}Atitalaquia.webp`} alt="img_representativa" />
            <img src={`${imgBasePath}atotonilco-de-tula.webp`} alt="img_representativa" />
            <img src={`${imgBasePath}Tlahuelilpan.webp`} alt="img_representativa" />
            <img src={`${imgBasePath}Tlaxcoapan.webp`} alt="img_representativa" />
            <img src={`${imgBasePath}Tula de allende.webp`} alt="img_representativa" />
          </div> */}
          <p className={`slide-description ${fade ? 'fade-out' : ''}`}>
            {slides[currentSlide].description}
          </p>
        </div>
        <div className="slider-controls">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
