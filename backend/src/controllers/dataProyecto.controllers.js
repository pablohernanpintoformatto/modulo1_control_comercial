const { pool } = require("../db.js");
require('dotenv').config();


/* 

router.get('/dataProyecto', getDataProyecto);
router.delete('/dataProyecto/:id', deleteDetDataProyecto);
router.post('/dataProyecto/add', createDataProyecto);
router.put('/dataProyecto/:id', updateDataProyectoUsers);

*/

/* 


    tipo_cliente, cliente, nombre_proyecto,
    tipo_Proyecto, partidas, fase_proyecto,
    estado_comercial, tipo_contrato, responsable_comercial,
    cartera_comercial_asig, torres, pisos, cant_Inmuebles,
    probabilidad_cierre, info, fecha_solicitud_cotizacion,
    monto_UF, monto_clp, adjuntar_cotizacion_enviada,
    gte_proyecto_contacto, adm_obra, region, comuna,
    direccion_proyecto, ubicacion_google_maps, pagina_web_proyecto,
    instalacion_despacho
     
    
    fecha_deadline
    tipologia_piloto 
    numeros_piloto
    fecha_piloto
    fecha_ejec_inicio_obra
    fecha_ejec_fin_obra 
    motivo_perdida_proyecto 
    programa_entrega_cliente 
    adjuntar_planos 
    one_pager 
    diseñador_asignado
    modificacion_por 
    estado_proyecto 


    tipo_cliente, cliente, nombre_proyecto,tipo_Proyecto, partidas, fase_proyecto,estado_comercial, tipo_contrato, responsable_comercial, cartera_comercial_asig, torres, pisos, cant_Inmuebles, probabilidad_cierre, info, fecha_solicitud_cotizacion, monto_UF, monto_clp, adjuntar_cotizacion_enviada, gte_proyecto_contacto, adm_obra, region, comuna, direccion_proyecto, ubicacion_google_maps, pagina_web_proyecto, instalacion_despacho, fecha_deadline, tipologia_piloto, numeros_piloto, fecha_piloto, fecha_ejec_inicio_obra, fecha_ejec_fin_obra, motivo_perdida_proyecto, programa_entrega_cliente, adjuntar_planos, one_pager, diseñador_asignado, modificacion_por, estado_proyecto  */

const SECRET_KEY = process.env.JWT_SECRET || 'secreto_super_seguro';

const getDataProyecto = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM proyecto');
  res.json(rows);
};


const deleteDetDataProyecto = async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('DELETE FROM proyecto WHERE id_proyecto = $1 RETURNING *', [id]);
  if (rows.length === 0) {
    return res.status(404).json({ message: 'proyecto no encontrado' });
  }
  res.json({ message: 'proyecto eliminado', user: rows[0] });
};

const createDataProyecto = async (req, res) => {
  try {
    const { tipo_cliente, cliente, nombre_proyecto,
      tipo_Proyecto, partidas, fase_proyecto,
      estado_comercial, tipo_contrato, responsable_comercial,
      torres, pisos, cant_Inmuebles,
      probabilidad_cierre, info, fecha_solicitud_cotizacion,
      monto_UF, monto_clp, adjuntar_cotizacion_enviada,
      gte_proyecto_contacto, adm_obra, region, comuna,
      direccion_proyecto, ubicacion_google_maps, pagina_web_proyecto,
      instalacion_despacho } = req.body;

    /* que no se te olvide agregar cartera_comercial_asig */
    const { rows } = await pool.query(`
  INSERT INTO proyecto (
    tipo_cliente, cliente, nombre_proyecto, tipo_Proyecto, partidas, fase_proyecto,
    estado_comercial, tipo_contrato, responsable_comercial, torres, pisos, cant_Inmuebles, 
    probabilidad_cierre, info, fecha_solicitud_cotizacion,
    monto_UF, monto_clp, adjuntar_cotizacion_enviada, gte_proyecto_contacto, adm_obra,
    region, comuna, direccion_proyecto, ubicacion_google_maps, pagina_web_proyecto,
    instalacion_despacho, fecha_deadline, tipologia_piloto, numeros_piloto, fecha_piloto,
    fecha_ejec_inicio_obra, fecha_ejec_fin_obra, motivo_perdida_proyecto,
    programa_entrega_cliente, adjuntar_planos, one_pager, diseñador_asignado,
    modificacion_por, estado_proyecto
  ) VALUES (
    $1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
    $17, $18, $19, $20, $21, $22, $23, $24, $25, $26,
    $27, $28, $29, $30, $31, $32, $33, $34, $35, $36,
    $37, $38, $39
  ) RETURNING *
`, [
      tipo_cliente, cliente, nombre_proyecto, tipo_Proyecto, partidas, fase_proyecto,
      estado_comercial, tipo_contrato, responsable_comercial,
      torres, pisos, cant_Inmuebles, probabilidad_cierre, info, fecha_solicitud_cotizacion,
      monto_UF, monto_clp, adjuntar_cotizacion_enviada, gte_proyecto_contacto, adm_obra,
      region, comuna, direccion_proyecto, ubicacion_google_maps, pagina_web_proyecto,
      instalacion_despacho,
      null, null, null, null, null, null, null, null, null, null, null, null, null
    ]);

    res.status(201).json({ message: 'Proyecto ingresado' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.detail });
  }
};



const updateDataProyectoUsers = async (req, res) => {
  const { id } = req.params;
  const campos = req.body;

  try {
    const { rows } = await pool.query('SELECT * FROM proyecto WHERE id_proyecto = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    const proyectoActual = rows[0];

    // Utilidad: si el nuevo valor está vacío, conservar el anterior
    const getValor = (nuevo, actual) => {
      return (nuevo === undefined || nuevo === null || nuevo === '') ? actual : nuevo;
    };

    const camposActualizados = {
      nombre_proyecto: getValor(campos.nombre_proyecto, proyectoActual.nombre_proyecto),
      tipo_cliente: getValor(campos.tipo_cliente, proyectoActual.tipo_cliente),
      estado_comercial: getValor(campos.estado_comercial, proyectoActual.estado_comercial),
      info: getValor(campos.info, proyectoActual.info),
      cliente: getValor(campos.cliente, proyectoActual.cliente),
      monto_uf: getValor(campos.monto_uf, proyectoActual.monto_uf),
      monto_clp: getValor(campos.monto_clp, proyectoActual.monto_clp),
      tipo_proyecto: getValor(campos.tipo_proyecto, proyectoActual.tipo_proyecto),
      cant_inmuebles: getValor(campos.cant_inmuebles, proyectoActual.cant_inmuebles),
      pisos: getValor(campos.pisos, proyectoActual.pisos),
      torres: getValor(campos.torres, proyectoActual.torres),
      partidas: getValor(campos.partidas, proyectoActual.partidas),
      tipo_contrato: getValor(campos.tipo_contrato, proyectoActual.tipo_contrato),
      fecha_solicitud_cotizacion: getValor(campos.fecha_solicitud_cotizacion, proyectoActual.fecha_solicitud_cotizacion),
      fecha_deadline: getValor(campos.fecha_deadline, proyectoActual.fecha_deadline),
      tipologia_piloto: getValor(campos.tipologia_piloto, proyectoActual.tipologia_piloto),
      numeros_piloto: getValor(campos.numeros_piloto, proyectoActual.numeros_piloto),
      fecha_piloto: getValor(campos.fecha_piloto, proyectoActual.fecha_piloto),
      fase_proyecto: getValor(campos.fase_proyecto, proyectoActual.fase_proyecto),
      fecha_ejec_inicio_obra: getValor(campos.fecha_ejec_inicio_obra, proyectoActual.fecha_ejec_inicio_obra),
      fecha_ejec_fin_obra: getValor(campos.fecha_ejec_fin_obra, proyectoActual.fecha_ejec_fin_obra),
      adjuntar_cotizacion_enviada: getValor(campos.adjuntar_cotizacion_enviada, proyectoActual.adjuntar_cotizacion_enviada),
      probabilidad_cierre: getValor(campos.probabilidad_cierre, proyectoActual.probabilidad_cierre),
      motivo_perdida_proyecto: getValor(campos.motivo_perdida_proyecto, proyectoActual.motivo_perdida_proyecto),
      programa_entrega_cliente: getValor(campos.programa_entrega_cliente, proyectoActual.programa_entrega_cliente),
      adjuntar_planos: getValor(campos.adjuntar_planos, proyectoActual.adjuntar_planos),
      one_pager: getValor(campos.one_pager, proyectoActual.one_pager),
      instalacion_despacho: getValor(campos.instalacion_despacho, proyectoActual.instalacion_despacho),
      diseñador_asignado: getValor(campos.diseñador_asignado, proyectoActual.diseñador_asignado),
      pagina_web_proyecto: getValor(campos.pagina_web_proyecto, proyectoActual.pagina_web_proyecto),
      ubicacion_google_maps: getValor(campos.ubicacion_google_maps, proyectoActual.ubicacion_google_maps),
      region: getValor(campos.region, proyectoActual.region),
      comuna: getValor(campos.comuna, proyectoActual.comuna),
      direccion_proyecto: getValor(campos.direccion_proyecto, proyectoActual.direccion_proyecto),
      responsable_comercial: getValor(campos.responsable_comercial, proyectoActual.responsable_comercial),
      modificacion_por: getValor(campos.modificacion_por, proyectoActual.modificacion_por),
      gte_proyecto_contacto: getValor(campos.gte_proyecto_contacto, proyectoActual.gte_proyecto_contacto),
      adm_obra: getValor(campos.adm_obra, proyectoActual.adm_obra),
      estado_proyecto: getValor(campos.estado_proyecto, proyectoActual.estado_proyecto)
    };
    // 3. Ejecutar el UPDATE con todos los campos
    const query = `
      UPDATE proyecto SET
        nombre_proyecto = $1,
        tipo_cliente = $2,
        estado_comercial = $3,
        info = $4,
        cliente = $5,
        monto_uf = $6,
        monto_clp = $7,
        tipo_proyecto = $8,
        cant_inmuebles = $9,
        pisos = $10,
        torres = $11,
        partidas = $12,
        tipo_contrato = $13,
        fecha_solicitud_cotizacion = $14,
        fecha_deadline = $15,
        tipologia_piloto = $16,
        numeros_piloto = $17,
        fecha_piloto = $18,
        fase_proyecto = $19,
        fecha_ejec_inicio_obra = $20,
        fecha_ejec_fin_obra = $21,
        adjuntar_cotizacion_enviada = $22,
        probabilidad_cierre = $23,
        motivo_perdida_proyecto = $24,
        programa_entrega_cliente = $25,
        adjuntar_planos = $26,
        one_pager = $27,
        instalacion_despacho = $28,
        diseñador_asignado = $29,
        pagina_web_proyecto = $30,
        ubicacion_google_maps = $31,
        region = $32,
        comuna = $33,
        direccion_proyecto = $34,
        responsable_comercial = $35,
        modificacion_por = $36,
        gte_proyecto_contacto = $37,
        adm_obra = $38,
        estado_proyecto = $39,
        fecha_modificacion = CURRENT_TIMESTAMP
      WHERE id_proyecto = $40
    `;

    const values = [
      camposActualizados.nombre_proyecto,
      camposActualizados.tipo_cliente,
      camposActualizados.estado_comercial,
      camposActualizados.info,
      camposActualizados.cliente,
      camposActualizados.monto_uf,
      camposActualizados.monto_clp,
      camposActualizados.tipo_proyecto,
      camposActualizados.cant_inmuebles,
      camposActualizados.pisos,
      camposActualizados.torres,
      camposActualizados.partidas,
      camposActualizados.tipo_contrato,
      camposActualizados.fecha_solicitud_cotizacion,
      camposActualizados.fecha_deadline,
      camposActualizados.tipologia_piloto,
      camposActualizados.numeros_piloto,
      camposActualizados.fecha_piloto,
      camposActualizados.fase_proyecto,
      camposActualizados.fecha_ejec_inicio_obra,
      camposActualizados.fecha_ejec_fin_obra,
      camposActualizados.adjuntar_cotizacion_enviada,
      camposActualizados.probabilidad_cierre,
      camposActualizados.motivo_perdida_proyecto,
      camposActualizados.programa_entrega_cliente,
      camposActualizados.adjuntar_planos,
      camposActualizados.one_pager,
      camposActualizados.instalacion_despacho,
      camposActualizados.diseñador_asignado,
      camposActualizados.pagina_web_proyecto,
      camposActualizados.ubicacion_google_maps,
      camposActualizados.region,
      camposActualizados.comuna,
      camposActualizados.direccion_proyecto,
      camposActualizados.responsable_comercial,
      camposActualizados.modificacion_por,
      camposActualizados.gte_proyecto_contacto,
      camposActualizados.adm_obra,
      camposActualizados.estado_proyecto,
      id
    ];

    await pool.query(query, values);

    res.status(200).json({ message: 'Proyecto actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.detail || 'Error al actualizar el proyecto' });
  }
};


module.exports = {
  getDataProyecto,
  deleteDetDataProyecto,
  createDataProyecto,
  updateDataProyectoUsers
};

