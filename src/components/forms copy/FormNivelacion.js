'use client';

import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import SectionTitle from './componentsForm/SectionTitle';
import FirmaDigital from './componentsForm/FirmaDigital';
import styles from './FormNivelacion.module.css';

import {
  municipiosDeHidalgo,
  identificacionOpciones,
  distritosPorModulos,
  nivelesOpciones,
  profundidadSueloOpciones,
  tipoRevestimientoOpciones,
  gastoCanalesOpciones,
  tipoSeccionOpciones,
  productoSembrados,
  cultivosAnuales,
  documentosPresentados
} from '@/utils/utils';

const FormNivelacion = () => {
  const [modulosFiltrados, setModulosFiltrados] = useState([]);

  const initialValues = {
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    curp: '',
    cuenta_conagua: '',
    domicilio: '',
    identificacion: '',
    telefono: '',
    municipio: '',
    localidad: '',
    distrito_riego: '',
    modulo_riego: '',
    superficie_parcela: '',
    tiempo_promedio_riego: '',
    latitud: '',
    longitud: '',
    grado_pendiente: '',
    pedregosidad: '',
    profundidad_suelo: '',
    tamano_canaleta: '',
    tipo_revestimiento: '',
    gasto_canales: '',
    distancia_canaleta: '',
    tipo_seccion: '',
    ha_nivelado: '',
    anio_nivelacion: '',
    problemas_drenaje: '',
    cultivos_dominantes: '',
    cultivo_actual: '',
    perene_roturacion: '',
    fecha_libre_parcela: '',
    acreditacion_propiedad: '',
    documento_presentado: '',
    archivo_pdf: null,
    firma_digital: '',
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().required('Campo obligatorio'),
    apellido_paterno: Yup.string().required('Campo obligatorio'),
    apellido_materno: Yup.string().required('Campo obligatorio'),
    curp: Yup.string().length(18, 'CURP debe tener 18 caracteres').required('Campo obligatorio'),
    cuenta_conagua: Yup.string().required('Campo obligatorio'),
    domicilio: Yup.string().required('Campo obligatorio'),
    telefono: Yup.string().required('Campo obligatorio'),
    municipio: Yup.string().required('Campo obligatorio'),
    superficie_parcela: Yup.number().positive('Debe ser positivo').required('Campo obligatorio'),
    tiempo_promedio_riego: Yup.number().positive().required('Campo obligatorio'),
    latitud: Yup.number().required('Campo obligatorio'),
    longitud: Yup.number().required('Campo obligatorio'),
    tamano_canaleta: Yup.number().min(0).required('Campo obligatorio'),
    gasto_canales: Yup.string().required('Campo obligatorio'),
    distancia_canaleta: Yup.number().min(0).required('Campo obligatorio'),
    tipo_seccion: Yup.string().required('Campo obligatorio'),
    archivo_pdf: Yup.mixed().test(
      'fileFormat',
      'Solo se permite PDF',
      (value) => !value || (value && value.type === 'application/pdf')
    ),
    firma_digital: Yup.string().required('Firma requerida'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }

      await axios.post('http://localhost:8000/api/formularios/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Formulario enviado con éxito');
      resetForm();
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h2>Formulario de Nivelación de Tierra</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => {
          useEffect(() => {
            const modulos = distritosPorModulos[values.distrito_riego] || [];
            setModulosFiltrados(modulos);

            if (values.ha_nivelado !== 'si') {
              setFieldValue('anio_nivelacion', 'No aplica');
            }

            if (values.cultivo_actual !== 'Alfalfa') {
              setFieldValue('perene_roturacion', 'No aplica');
            }

            if (!cultivosAnuales.includes(values.cultivo_actual)) {
              setFieldValue('fecha_libre_parcela', 'No aplica');
            }
          }, [values.distrito_riego, values.ha_nivelado, values.cultivo_actual, setFieldValue]);

          return (
            <Form>
              <SectionTitle title="Datos Personales" />
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="nombre">Nombre:</label>
                  <Field name="nombre" className={styles.inputField} />
                  <ErrorMessage name="nombre" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="apellido_paterno">Apellido Paterno:</label>
                  <Field name="apellido_paterno" className={styles.inputField} />
                  <ErrorMessage name="apellido_paterno" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="apellido_materno">Apellido Materno:</label>
                  <Field name="apellido_materno" className={styles.inputField} />
                  <ErrorMessage name="apellido_materno" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="curp">CURP:</label>
                  <Field name="curp" className={styles.inputField} />
                  <ErrorMessage name="curp" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="cuenta_conagua">No. cuenta CONAGUA:</label>
                  <Field name="cuenta_conagua" className={styles.inputField} />
                  <ErrorMessage name="cuenta_conagua" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="domicilio">Domicilio:</label>
                  <Field name="domicilio" className={styles.inputField} />
                  <ErrorMessage name="domicilio" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="identificacion">Identificación oficial:</label>
                  <Field as="select" name="identificacion" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {identificacionOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="identificacion" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="telefono">No. Telefónico:</label>
                  <Field name="telefono" className={styles.inputField} />
                  <ErrorMessage name="telefono" component="div" className={styles.errorMessage} />
                </div>
              </div>

              {/* DATOS DE LA PARCELA */}

              <SectionTitle title="Datos de la parcela" />
              <div className={styles.formRow}>

                <div className={styles.formGroup}>
                  <label htmlFor="municipio">Municipio:</label>
                  <Field as="select" name="municipio" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {municipiosDeHidalgo.map((mun) => (
                      <option key={mun} value={mun}>
                        {mun}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="municipio" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="localidad">Localidad:</label>
                  <Field name="localidad" className={styles.inputField} />
                  <ErrorMessage name="localidad" component="div" className={styles.errorMessage} />
                </div>
              </div>


              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="distrito_riego">Distrito de Riego:</label>
                  <Field as="select" name="distrito_riego" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {Object.keys(distritosPorModulos).map((distrito) => (
                      <option key={distrito} value={distrito}>
                        {distrito}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="distrito_riego" component="div" className={styles.errorMessage} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="modulo_riego">Módulo de Riego:</label>
                  <Field as="select" name="modulo_riego" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {modulosFiltrados.map((modulo) => (
                      <option key={modulo} value={modulo}>
                        {modulo}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="modulo_riego" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="superficie_parcela">Superficie de parcela (ha):</label>
                  <Field name="superficie_parcela" className={styles.inputField} />
                  <ErrorMessage name="superficie_parcela" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="tiempo_promedio_riego">Tiempo promedio de riego (h):</label>
                  <Field name="tiempo_promedio_riego" className={styles.inputField} />
                  <ErrorMessage name="tiempo_promedio_riego" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="latitud">Latitud (Norte):</label>
                  <Field
                    name="latitud"
                    type="number"
                    step="any"
                    className={styles.inputField}
                  />
                  <ErrorMessage name="latitud" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="longitud">Longitud (Oeste):</label>
                  <Field
                    name="longitud"
                    type="number"
                    step="any"
                    className={styles.inputField}
                  />
                  <ErrorMessage name="longitud" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="grado_pendiente">Grado de Pendiente:</label>
                  <Field as="select" name="grado_pendiente" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {nivelesOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="grado_pendiente" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="pedregosidad">Pedregosidad:</label>
                  <Field as="select" name="pedregosidad" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {nivelesOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="pedregosidad" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="profundidad_suelo">Profundidad del suelo:</label>
                  <Field as="select" name="profundidad_suelo" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {profundidadSueloOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="profundidad_suelo" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="tamano_canaleta">Tamaño de canaleta de riego en cm (zanja):</label>
                  <Field name="tamano_canaleta" type="number" min="0" className={styles.inputField} />
                  <ErrorMessage name="tamano_canaleta" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="tipo_revestimiento">Tipo de revestimiento de canaleta:</label>
                  <Field as="select" name="tipo_revestimiento" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {tipoRevestimientoOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="tipo_revestimiento" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="gasto_canales">Gasto en canales (lps):</label>
                  <Field as="select" name="gasto_canales" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {gastoCanalesOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="gasto_canales" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="distancia_canaleta">Distancia de parcela a la canaleta (m):</label>
                  <Field name="distancia_canaleta" type="number" min="0" className={styles.inputField} />
                  <ErrorMessage name="distancia_canaleta" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="tipo_seccion">Tipo de sección:</label>
                  <Field as="select" name="tipo_seccion" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {tipoSeccionOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="tipo_seccion" component="div" className={styles.errorMessage} />
                </div>

              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="ha_nivelado">¿Ha realizado nivelación de tierra anteriormente?</label>
                  <Field as="select" name="ha_nivelado" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {identificacionOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="ha_nivelado" component="div" className={styles.errorMessage} />
                </div>
                {/* Campo condicional: ¿En qué año? */}
                {values.ha_nivelado === 'si' && (
                  <div className={styles.formGroup}>
                    <label htmlFor="anio_nivelacion">¿En qué año?</label>
                    <Field as="select" name="anio_nivelacion" className={styles.inputField}>
                      <option value="">Seleccione</option>
                      {Array.from({ length: 2025 - 1920 + 1 }, (_, i) => 1920 + i).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="anio_nivelacion" component="div" className={styles.errorMessage} />
                  </div>
                )}
                <div className={styles.formGroup}>
                  <label htmlFor="problemas_drenaje">¿Su parcela presenta problemas de drenaje y/o sanidad?</label>
                  <Field as="select" name="problemas_drenaje" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {identificacionOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="problemas_drenaje" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="cultivos_dominantes">Cultivos dominantes en la parcela:</label>
                  <Field as="select" name="cultivos_dominantes" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {productoSembrados.map((cultivo) => (
                      <option key={cultivo} value={cultivo}>
                        {cultivo}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="cultivos_dominantes" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="cultivo_actual">¿Cultivo actual?</label>
                  <Field as="select" name="cultivo_actual" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {productoSembrados.map((cultivo) => (
                      <option key={cultivo} value={cultivo}>
                        {cultivo}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="cultivo_actual" component="div" className={styles.errorMessage} />
                </div>
                {values.cultivo_actual === 'Alfalfa' && (
                  <div className={styles.formGroup}>
                    <label htmlFor="perene_roturacion">¿Va a realizar trabajos de roturación (cambio del cultivo) en el presente año?</label>
                    <Field as="select" name="perene_roturacion" className={styles.inputField}>
                      <option value="">Seleccione</option>
                      {identificacionOpciones.map((opcion) => (
                        <option key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="perene_roturacion" component="div" className={styles.errorMessage} />
                  </div>
                )}
                {cultivosAnuales.includes(values.cultivo_actual) && (
                  <div className={styles.formGroup}>
                    <label htmlFor="fecha_libre_parcela">¿En qué fecha estaría libre la parcela?</label>
                    <Field type="date" name="fecha_libre_parcela" className={styles.inputField} />
                    <ErrorMessage name="fecha_libre_parcela" component="div" className={styles.errorMessage} />
                  </div>
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="acreditacion_propiedad">Acreditación de la posesión o legal propiedad del titular:</label>
                  <Field as="select" name="acreditacion_propiedad" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {identificacionOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="acreditacion_propiedad" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="documento_presentado">Documento que presenta:</label>
                  <Field as="select" name="documento_presentado" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {documentosPresentados.map((doc) => (
                      <option key={doc.value} value={doc.value}>
                        {doc.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="documento_presentado" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <SectionTitle title="Carga de Documento y Firma" />
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="archivo_pdf">Cargar documento (solo PDF):</label>
                  <input
                    id="archivo_pdf"
                    name="archivo_pdf"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => {
                      setFieldValue('archivo_pdf', event.currentTarget.files[0]);
                    }}
                    className={styles.inputField}
                  />
                  <ErrorMessage name="archivo_pdf" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <FirmaDigital setFieldValue={setFieldValue} />

              <div className={styles.formGroup}>
                <button type="submit" className={styles.submitButton}>
                  Enviar Formulario
                </button>
              </div>

            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default FormNivelacion;
