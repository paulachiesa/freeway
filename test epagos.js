process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const soap = require("soap");

const WSDL_URL = "https://sandbox.epagos.com/wsdl/2.1/index.php?wsdl";

// 🔹 Credenciales base (usar las reales)
const credenciales = {
  id_organismo: "4411",
  id_usuario: "2600",
  password: "d08a8d910b0b25e4583f8c2232d22e55",
  hash: "e85dce903c50b668184b40affde9303e",
};

// 🔹 Convenio real (numérico)
const CONVENIO = 14411;
const monto = 100.00;

// 🔹 Flujo principal
(async () => {
  try {
    const client = await soap.createClientAsync(WSDL_URL);

    // 1️⃣ Obtener token
    const [tokenResult] = await client.obtener_tokenAsync({
      version: "2.0",
      credenciales,
    });
    const token = tokenResult.token?.$value;
    if (!token) throw new Error("No se obtuvo token válido");
    console.log("🔹 Token obtenido:", token);

    // Armar solicitud completa para op_pago
    const args = {
      version: "2.0",
      tipo_operacion: "op_pago",
      credenciales: {
        id_organismo: credenciales.id_organismo,
        token,
      },
      operacion: {
        id_moneda_operacion: 1,
        monto_operacion: monto,
        opc_devolver_qr: true,
        opc_devolver_codbarras: true,
        detalle_operacion: {
          item: [
            {
              id_item: 1,
              desc_item: "Multa de tránsito - Infracción por exceso de velocidad",
              monto_item: monto,
              cantidad_item: 1,
            },
          ],
        },
        pagador: {
          email_pagador: "test@example.com",
          cbu_pagador: "2850590940090418125201",
          identificacion_pagador: {
            tipo_doc_pagador: "DNI",
            numero_doc_pagador: "30123456",
            cuit_doc_pagador: "20301234568",
          },
        },
      },
      fp: {
        item: [
          {
            id_fp: 34,
            monto_fp: monto,
          }]
      },
      convenio: CONVENIO,
    };

    client.on("request", (xml) => console.log("📤 XML enviado:\n", xml));

    //  llamada op_pago
    const [response] = await client.solicitud_pagoAsync(args);

    console.log("✅ Respuesta de solicitud_pago:");
    console.log(JSON.stringify(response, null, 2));

    // Mostrar datos clave si existen
    const codigoQR = response.codigo_qr?.$value || response.codigo_qr;
    const codigoBarras = response.codigo_barra?.$value || response.codigo_barra;
    const montoTotal = response.monto_total?.$value || response.monto_total;

    console.log("\n📦 Datos importantes:");
    console.log("Monto:", montoTotal);
    console.log("Código QR:", codigoQR);
    console.log("Código de Barras:", codigoBarras);
  } catch (error) {
    console.error("❌ Error al ejecutar op_pago:", error);
  }
})();
