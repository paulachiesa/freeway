import axios from "axios";
import xml2js from "xml2js";
import { prisma } from "@/app/lib/prisma";

const EPAGOS_URL = "https://sandbox.epagos.com/wsdl/2.1/index.php?wsdl";

const credencialesPorMunicipio: Record<
  string,
  {
    id_organismo: string;
    id_usuario: string;
    password: string;
    hash: string;
    convenio: string;
  }
> = {
  Calilegua: {
    id_organismo: process.env.EPAGOS_CALILEGUA_ID_ORGANISMO!,
    id_usuario: process.env.EPAGOS_CALILEGUA_ID_USUARIO!,
    password: process.env.EPAGOS_CALILEGUA_PASSWORD!,
    hash: process.env.EPAGOS_CALILEGUA_HASH!,
    convenio: process.env.EPAGOS_CALILEGUA_CONVENIO!,
  },
  "Apolinario Saravia": {
    id_organismo: process.env.EPAGOS_APOLINARIO_ID_ORGANISMO!,
    id_usuario: process.env.EPAGOS_APOLINARIO_ID_USUARIO!,
    password: process.env.EPAGOS_APOLINARIO_PASSWORD!,
    hash: process.env.EPAGOS_APOLINARIO_HASH!,
    convenio: process.env.EPAGOS_APOLINARIO_CONVENIO!,
  },
  Urundel: {
    id_organismo: process.env.EPAGOS_CALILEGUA_ID_ORGANISMO!,
    id_usuario: process.env.EPAGOS_CALILEGUA_ID_USUARIO!,
    password: process.env.EPAGOS_CALILEGUA_PASSWORD!,
    hash: process.env.EPAGOS_CALILEGUA_HASH!,
    convenio: process.env.EPAGOS_CALILEGUA_CONVENIO!,
  },
};

// Obtener token
export async function obtenerToken(municipio: string) {
  const cred = credencialesPorMunicipio[municipio];
  if (!cred)
    throw new Error(`No hay credenciales configuradas para ${municipio}`);

  const xml = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  xmlns:tns="https://sandbox.epagos.net/">
    <soapenv:Header/>
    <soap:Body>
      <tns:obtener_token>
        <version>2.0</version>
        <credenciales>
          <id_organismo>${cred.id_organismo}</id_organismo>
          <id_usuario>${cred.id_usuario}</id_usuario>
          <password>${cred.password}</password>
          <hash>${cred.hash}</hash>
        </credenciales>
      </tns:obtener_token>
    </soap:Body>
  </soap:Envelope>`;

  const response = await axios.post(EPAGOS_URL, xml, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: "https://sandbox.epagos.net/obtener_token",
    },
  });

  const parsed = await xml2js.parseStringPromise(response.data, {
    explicitArray: false,
  });

  const token =
    parsed?.["SOAP-ENV:Envelope"]?.["SOAP-ENV:Body"]?.[
      "ns1:obtener_tokenResponse"
    ]?.["token"]?._;

  if (!token) throw new Error("No se pudo obtener el token de ePagos");

  return token;
}

// Obtener importes según cuadro tarifario
export async function obtenerMontosDesdeCuadro(velocidadMedida: number) {
  const cuadro = await prisma.cuadrotarifario.findFirst({
    where: {
      velocidad_desde: { lte: velocidadMedida },
      velocidad_hasta: { gte: velocidadMedida },
    },
  });

  if (!cuadro)
    throw new Error(
      `No se encontró cuadro tarifario para velocidad ${velocidadMedida}`
    );

  return {
    cuadro,
    monto1: Number(cuadro.valor_1er_vencimiento ?? 0),
    monto2: Number(cuadro.valor_2do_vencimiento ?? 0),
    gastoAdm: Number(cuadro.gasto_administrativo ?? 0),
  };
}

//Llamada a solicitud_pago (SOAP)
export async function solicitudPago({
  municipio,
  token,
  monto1,
  monto2,
  descripcion,
  email_pagador,
  dni_pagador,
  cuit_pagador,
  fecha_vencimiento_1,
  fecha_vencimiento_2,
}: {
  municipio: string;
  token: string;
  monto1: number;
  monto2: number;
  descripcion: string;
  email_pagador: string;
  dni_pagador: string;
  cuit_pagador: string;
  fecha_vencimiento_1?: string;
  fecha_vencimiento_2?: string;
}) {
  const cred = credencialesPorMunicipio[municipio];
  if (!cred)
    throw new Error(`No hay credenciales configuradas para ${municipio}`);

  const xml = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 xmlns:san="https://sandbox.epagos.net/"
                 xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"
                 xmlns:tns="https://sandbox.epagos.net/">
    <soap:Body>
      <tns:solicitud_pago>
        <version>2.0</version>
        <tipo_operacion>op_pago</tipo_operacion>
        <credenciales>
          <id_organismo>${cred.id_organismo}</id_organismo>
          <token>${token}</token>
        </credenciales>
        <operacion>
          <id_moneda_operacion>1</id_moneda_operacion>
          <monto_operacion>${monto1}</monto_operacion>
          <opc_fecha_vencimiento>${fecha_vencimiento_1}</opc_fecha_vencimiento>
          <fecha_2do_venc>${fecha_vencimiento_2}</fecha_2do_venc>
          <monto_operacion_2do_venc>${monto2}</monto_operacion_2do_venc>
          <opc_devolver_qr>true</opc_devolver_qr>
          <opc_devolver_codbarras>true</opc_devolver_codbarras>
          <detalle_operacion xsi:type="san:DetallePagoArray" SOAP-ENC:arrayType="san:DetallePago[]">
            <item>
              <id_item>1</id_item>
              <desc_item>${descripcion}</desc_item>
              <monto_item>${monto1}</monto_item>
              <cantidad_item>1</cantidad_item>
            </item>
          </detalle_operacion>
          <pagador>
            <email_pagador>${email_pagador}</email_pagador>
            <identificacion_pagador>
              <tipo_doc_pagador>DNI</tipo_doc_pagador>
              <numero_doc_pagador>${dni_pagador}</numero_doc_pagador>
              <cuit_doc_pagador>${cuit_pagador}</cuit_doc_pagador>
            </identificacion_pagador>
          </pagador>
        </operacion>
        <fp xsi:type="san:DatosFormaPagoArray" SOAP-ENC:arrayType="san:DatosFormaPago[]">
          <item>
            <id_fp>34</id_fp>
            <monto_fp>${monto1}</monto_fp>
          </item>
        </fp>
        <convenio>${cred.convenio}</convenio>
      </tns:solicitud_pago>
    </soap:Body>
  </soap:Envelope>`;

  const response = await axios.post(EPAGOS_URL, xml, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: "https://sandbox.epagos.net/solicitud_pago",
    },
  });

  const parsed = await xml2js.parseStringPromise(response.data, {
    explicitArray: false,
  });

  const body =
    parsed["SOAP-ENV:Envelope"]?.["SOAP-ENV:Body"] ||
    parsed["soap:Envelope"]?.["soap:Body"];

  const responseKey = Object.keys(body || {}).find((k) =>
    k.includes("solicitud_pagoResponse")
  );

  if (!responseKey) {
    throw new Error(
      "No se encontró el nodo solicitud_pagoResponse en la respuesta SOAP"
    );
  }

  const result = body?.[responseKey];

  //   console.log("🧾 XML recibido de ePagos:\n", response.data);

  //   console.log(
  //     "📦 Respuesta ePagos (solicitud_pago):",
  //     JSON.stringify(result, null, 2)
  //   );

  if (!result)
    throw new Error("No se obtuvo respuesta válida de solicitud_pago");

  return {
    idResp: result.id_resp?._ ?? result.id_resp,
    respuesta: result.respuesta?._ ?? result.respuesta,
    idTransaccion: result.id_transaccion?._ ?? result.id_transaccion,
    qr: result.fp?.item?.qr_imagen?._ ?? result.fp?.item?.qr_imagen ?? null,
    codigoBarras:
      result.fp?.item?.codigo_barras_imagen?._ ??
      result.fp?.item?.codigo_barras_imagen ??
      null,
    raw: result,
  };
}

//Función principal combinada
export async function generarDatosPago({
  municipio,
  velocidadMedida,
  persona,
  fecha_vencimiento_1,
  fecha_vencimiento_2,
}: {
  municipio: string;
  velocidadMedida: number;
  persona: {
    email?: string | null;
    dni?: string | null;
    cuit?: string | null;
  };
  fecha_vencimiento_1?: string;
  fecha_vencimiento_2?: string;
}) {
  const token = await obtenerToken(municipio);

  const { cuadro, monto1, monto2, gastoAdm } = await obtenerMontosDesdeCuadro(
    velocidadMedida
  );

  const pago = await solicitudPago({
    municipio,
    token,
    monto1,
    monto2,
    descripcion: "Multa de tránsito - Exceso de velocidad",
    email_pagador: persona.email || "",
    dni_pagador: persona.dni || "",
    cuit_pagador: persona.cuit || "",
    fecha_vencimiento_1,
    fecha_vencimiento_2,
  });

  return { token, monto1, monto2, pago, gastoAdm, cuadro };
}
