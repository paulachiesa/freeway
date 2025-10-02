// app/ui/infracciones/ActaTemplate.tsx

import { formatDateTimeToLocal, formatDateToLocal } from "@/app/lib/utils";
import React from "react";

type ActaTemplateProps = {
  infraccion: any;
  municipio: any;
  radar: any;
  numero_acta: number;
  vehiculo: any;
};

export default function ActaTemplate({
  infraccion,
  municipio,
  radar,
  numero_acta,
  vehiculo,
}: ActaTemplateProps) {
  return (
    <div className="w-[210mm] bg-white text-sm text-black px-6 py-1 shadow m-1">
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
        }
      `}</style>
      <h1 className="text-[10px] font-bold text-start px-3 border-2 border-gray-500 bg-gray-300">
        NOTIFICACIÓN DE INFRACCIÓN DE TRÁNSITO / ACTA N° {numero_acta}
      </h1>

      <div className="grid grid-cols-[15%_50%_30%] items-start gap-2 my-4">
        <div>
          <img
            className="w-[100px] h-auto object-contain"
            src={municipio?.logoUrl}
          />
        </div>
        <div className="font-bold leading-tight uppercase ml-4 text-[10px]">
          <p>MUNICIPALIDAD DE {municipio?.nombre}</p>
          <p className="mt-1 uppercase">{municipio?.ciudad}</p>
        </div>
        <aside className="leading-tight" style={{ fontSize: "6px" }}>
          <strong>AVISO</strong>
          <br />
          La presente infracción ha sido constatada mediante Cinemómetro{" "}
          {radar?.marca}
          homodolago mediante Res. {radar?.disp_autorizante}, con verificación
          primitiva y periódica vigente, según constancias emitidas por el INTI.
        </aside>
      </div>

      <div className="flex flex-row gap-2">
        {/* recuadro izq */}
        <div className="w-[50%] border border-black">
          <div
            className="w-full h-5 border border-black px-1 flex items-center justify-center"
            style={{
              fontFamily: "monospace",
              fontSize: "8px",
              fontWeight: "800",
              color: "white",
              backgroundColor: "black",
            }}
          >
            ACTA DE INFRACCIÓN DE TRÁNSITO
          </div>
          <div className="grid grid-cols-[0.6fr_0.6fr_0.6fr_0.6fr_0.5fr_1.5fr_1.3fr_0.4fr] text-center text-[7px]">
            {/* columnas  */}
            <div
              style={{
                borderLeftWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgb(0 0 0 / var(--tw-border-opacity))",
                height: "18px",
              }}
            >
              DÍA
            </div>
            <div
              style={{
                borderLeftWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgb(0 0 0 / var(--tw-border-opacity))",
                height: "18px",
              }}
            >
              MES
            </div>
            <div
              style={{
                borderLeftWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgb(0 0 0 / var(--tw-border-opacity))",
                height: "18px",
              }}
            >
              AÑO
            </div>
            <div
              style={{
                borderLeftWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgb(0 0 0 / var(--tw-border-opacity))",
                height: "18px",
              }}
            >
              HORA
            </div>
            <div
              style={{
                borderLeftWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgb(0 0 0 / var(--tw-border-opacity))",
                height: "18px",
              }}
            >
              MIN
            </div>
            <div
              style={{
                borderLeftWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgb(0 0 0 / var(--tw-border-opacity))",
                height: "18px",
              }}
            >
              COD. I. NUMERO
            </div>
            <div
              style={{
                borderLeftWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgb(0 0 0 / var(--tw-border-opacity))",
                height: "18px",
              }}
            >
              AUT. CONST.
            </div>
            <div
              style={{
                borderLeftWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgb(0 0 0 / var(--tw-border-opacity))",
                height: "18px",
              }}
            ></div>

            {/* Datos de la infraccion  */}
            <div
              style={{
                borderLeftWidth: "1px",
                borderTopWidth: "1px",
                borderBottomWidth: "1px",
                borderColor: "rgb(0 0 0 / var(--tw-border-opacity))",
                fontWeight: "800",
                height: "18px",
              }}
            >
              {infraccion?.fecha.getUTCDate()}
            </div>
            <div
              style={{
                borderLeftWidth: "1px",
                borderTopWidth: "1px",
                borderBottomWidth: "1px",
                borderColor: "rgb(0 0 0 / var(--tw-border-opacity))",
                fontWeight: "800",
                height: "18px",
              }}
            >
              {infraccion?.fecha.getUTCMonth() + 1}
            </div>
            <div
              style={{
                borderLeftWidth: "1px",
                borderTopWidth: "1px",
                borderBottomWidth: "1px",
                borderColor: "rgb(0 0 0 / var(--tw-border-opacity))",
                fontWeight: "800",
                height: "18px",
              }}
            >
              {infraccion?.fecha.getUTCFullYear()}
            </div>
            <div
              style={{
                borderLeftWidth: "1px",
                borderTopWidth: "1px",
                borderBottomWidth: "1px",
                borderColor: "rgb(0 0 0 / var(--tw-border-opacity))",
                fontWeight: "800",
                height: "18px",
              }}
            >
              {infraccion?.fecha.getUTCHours()}
            </div>
            <div
              style={{
                borderLeftWidth: "1px",
                borderTopWidth: "1px",
                borderBottomWidth: "1px",
                borderColor: "rgb(0 0 0 / var(--tw-border-opacity))",
                fontWeight: "800",
                height: "18px",
              }}
            >
              {infraccion?.fecha.getUTCMinutes()}
            </div>
            <div
              style={{
                borderLeftWidth: "1px",
                borderTopWidth: "1px",
                borderBottomWidth: "1px",
                borderColor: "rgb(0 0 0 / var(--tw-border-opacity))",
                fontWeight: "800",
                height: "18px",
              }}
            >
              {numero_acta}
            </div>
            <div
              style={{
                borderLeftWidth: "1px",
                borderTopWidth: "1px",
                borderBottomWidth: "1px",
                borderColor: "rgb(0 0 0 / var(--tw-border-opacity))",
                fontWeight: "800",
                height: "18px",
              }}
            >
              Ejido Urbano
            </div>

            <div
              style={{
                borderLeftWidth: "1px",
                borderTopWidth: "1px",
                borderBottomWidth: "1px",
                borderColor: "rgb(0 0 0 / var(--tw-border-opacity))",
                fontWeight: "800",
                height: "18px",
              }}
            >
              SI
            </div>
          </div>
          <div className="w-full border-b border-black px-1 text-center bg-gray-300">
            DOMINIO <b>{vehiculo?.dominio}</b>
          </div>

          <div className="border-black p-1 text-[7px] leading-tight h-6">
            <div className="font-medium">Lugar de la Infracción</div>
            <div className="font-extrabold uppercase">
              {infraccion?.lote?.lugar_infraccion}
            </div>
          </div>

          <div className="grid grid-cols-3 border-y border-black divide-x divide-black text-[6.5px] leading-tight">
            <div className="p-1">
              <div className="font-medium">Intersección o esquina</div>
              <div className="font-extrabold uppercase">—</div>
            </div>
            <div className="p-1">
              <div className="font-medium">Localidad</div>
              <div className="font-extrabold uppercase">
                {municipio?.nombre}
              </div>
            </div>
            <div className="p-1">
              <div className="font-medium">Provincia</div>
              <div className="font-extrabold uppercase">
                {municipio?.provincia}
              </div>
            </div>
          </div>

          <div className=" border-black p-1 text-[7px] leading-tight ">
            <div className="font-medium">Marca Vehículo</div>
            <div className="font-extrabold uppercase">
              {vehiculo?.marca} {vehiculo?.modelo}
            </div>
          </div>

          <div className="grid grid-cols-[2fr_0.5fr_1fr] border-t border-black divide-x divide-black text-[7px] leading-tight">
            <div className="p-1">
              <div className="font-medium">
                Presunto Infractor: Nombre y Apellido
              </div>
              <div className="font-extrabold uppercase">
                {vehiculo?.persona?.nombre_completo}
              </div>
            </div>
            <div className="p-1">
              <div className="font-medium">Tipo Doc.</div>
              <div className="font-extrabold uppercase">DNI</div>
            </div>
            <div className="p-1">
              <div className="font-medium">N° Doc.</div>
              <div className="font-extrabold uppercase">
                {vehiculo?.persona?.dni}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[2fr_1fr] border-y border-black divide-x divide-black text-[7px] leading-tight">
            <div className="p-1">
              <div className="font-medium">
                Domicilio del Presunto Infractor: Calle Nro./Ruta Km.
              </div>
              <div className="font-extrabold uppercase">
                {vehiculo?.persona?.domicilio?.direccion}
              </div>
            </div>
            <div className="p-1">
              <div className="font-medium">Localidad</div>
              <div className="font-extrabold uppercase">
                {vehiculo?.persona?.domicilio?.localidad}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1.5fr_1fr_1fr] border-black divide-x divide-black text-[7px] leading-tight">
            <div className="p-1">
              <div className="font-medium">Provincia</div>
              <div className="font-extrabold uppercase">
                {vehiculo?.persona?.domicilio?.provincia}
              </div>
            </div>
            <div className="p-1">
              <div className="font-medium">Lic. de Conducir N°</div>
              <div className="font-extrabold uppercase">NO APLICA</div>
            </div>
            <div className="p-1">
              <div className="font-medium">Clase</div>
              <div className="font-extrabold uppercase">NO APLICA</div>
            </div>
          </div>

          <div className="grid grid-cols-[1.8fr_1fr_1fr_1fr_1fr] border-t border-black divide-x divide-black text-[7px] leading-tight">
            <div className="p-1">
              <div className="font-medium">Municipalidad Otorgante</div>
              <div className="font-extrabold uppercase">NO APLICA</div>
            </div>
            <div className="p-1">
              <div className="font-medium">Pcia. Otorgante</div>
              <div className="font-extrabold uppercase">NO APLICA</div>
            </div>
            <div className="p-1">
              <div className="font-medium">Se dió a la fuga</div>
              <div className="font-extrabold uppercase">NO APLICA</div>
            </div>
            <div className="p-1">
              <div className="font-medium">Negó a identificar</div>
              <div className="font-extrabold uppercase">NO APLICA</div>
            </div>
            <div className="p-1">
              <div className="font-medium">No identif.</div>
              <div className="font-extrabold uppercase">NO APLICA</div>
            </div>
          </div>

          <div className="border-y border-black p-1 text-[7px] leading-tight ">
            <div className="font-extrabold uppercase text-center">
              DISPOSICIONES LEGALES PRESUNTAMENTE INFRINGIDAS
            </div>
          </div>

          <div className="grid grid-cols-2 border  text-[7px] text-center leading-tight">
            <div className="p-1">
              <div className="font-medium">Código</div>
              <div className="font-extrabold uppercase">
                ART. 51 INC E.4 LEY 24449
              </div>
            </div>
            <div className="p-1">
              <div className="font-medium">Descripción</div>
              <div className="font-extrabold uppercase">
                EXCESO DE VELOCIDAD
              </div>
            </div>
          </div>

          <div className="w-full border-y border-black px-1 text-center text-[8px] font-extrabold bg-gray-300">
            DESCRIPCIÓN DE LA PRESUNTA INFRACCIÓN
          </div>

          <div
            className="w-full border-b border-black overflow-hidden"
            style={{ height: "250px" }}
          >
            <img
              src={infraccion?.imagen_url}
              className="block w-full h-auto align-bottom"
              style={{ display: "block", margin: 0, padding: 0 }}
            />
          </div>

          <div className="grid grid-cols-[2fr_1fr] border-y border-black divide-x divide-black text-[7px] leading-tight">
            <div className="p-1">
              <div className="font-medium">Autoridad de Constatación</div>
              <div className="font-extrabold uppercase">
                DIRECCIÓN DE TRÁNSITO DE {municipio?.nombre}
              </div>
            </div>
            <div className="p-1">
              <div className="font-medium">Jerarquía/ Cargo</div>
              <div className="font-extrabold uppercase"></div>
            </div>
          </div>

          <div className="grid grid-cols-[2fr_1fr] border-b border-black divide-x divide-black text-[7px] leading-tight">
            <div className="p-1">
              <div className="font-medium">
                Nombre y Apellido del Funcionario interviniente en el operativo
              </div>
              <div className="font-extrabold uppercase">
                {municipio?.autoridad_constatacion}
              </div>
            </div>
            <div className="p-1">
              <div className="font-medium">Código ID</div>
              <div className="font-extrabold uppercase"></div>
            </div>
          </div>
          <div className="grid grid-cols-[2fr_1fr] border-b border-black divide-x divide-black text-[7px] leading-tight">
            <div className="p-1">
              <div className="font-medium ">
                Firma del responsable de la Autoridad de Constatación
              </div>
              <div className="font-extrabold uppercase grid grid-cols-[1fr_2fr]">
                <img
                  className="w-[100px] h-auto object-contain px-3"
                  src={municipio?.firmaUrl}
                />
                <div className="flex items-center justify-center">
                  {municipio?.autoridad_constatacion}
                </div>
              </div>
            </div>
            <div className="p-1">
              <div className="font-medium">Firma Infractor</div>
              <div className="font-extrabold uppercase">NO APLICA</div>
            </div>
          </div>
        </div>

        {/* recuadro der */}
        <div className="w-[50%] border border-black">
          <div
            className="w-full h-5 border-black px-1 text-center"
            style={{
              fontFamily: "monospace",
              fontSize: "8px",
              fontWeight: "800",
              color: "white",
              backgroundColor: "black",
            }}
          ></div>
          <div className="grid grid-cols-2 justify-between px-2">
            <div className="text-[8px]">Señor/a</div>
            <div className="text-[8px] text-end">
              {new Date().toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
          </div>
          <div className="grid px-2">
            <div className="text-[10px] font-extrabold uppercase">
              {vehiculo?.persona?.nombre_completo}
            </div>
            <div className="text-[10px] font-extrabold uppercase">
              {vehiculo?.persona?.domicilio?.direccion}
            </div>
            <div className="text-[10px] font-extrabold uppercase">
              {vehiculo?.persona?.domicilio?.localidad}
            </div>
            <div className="text-[10px] font-extrabold uppercase">
              {vehiculo?.persona?.domicilio?.provincia}
            </div>
            <div className="text-[10px] font-extrabold uppercase text-end">
              DNI {vehiculo?.persona?.dni}
            </div>
          </div>
          <div
            className="w-full h-5 border-black px-1 text-center"
            style={{
              fontFamily: "monospace",
              fontSize: "8px",
              fontWeight: "800",
              color: "white",
              backgroundColor: "black",
            }}
          >
            OBJETO: NOTIFICACIÓN DEL ACTA DE INFRACCIÓN N° {numero_acta}
          </div>
          <div className="grid p-1 leading-normal">
            <div className="text-[8px]">
              Cuya copia obra adjunta, de fecha:{" "}
              {formatDateToLocal(infraccion?.fecha)}, hora:{" "}
              {formatDateTimeToLocal(infraccion?.fecha)}, en RUTA PROVINCIAL 5
              KM 140. <br />
              Velocidad Permitida: {infraccion?.velocidad_maxima} km/h;
              Velocidad Registrada: {infraccion?.velocidad_medida} km/h. <br />
              Conduciendo el vehículo dominio: {infraccion?.dominio}. <br />
              Marca: {vehiculo?.marca}. <br />
              Modelo: {vehiculo?.modelo}.
            </div>
            <div className="text-[8px] mt-3">
              Autoridad Constatación: <br />
              DIRECCIÓN DE TRÁNSITO DE{" "}
              <span className="uppercase">{municipio?.nombre}</span>
            </div>
          </div>
          <div
            className="w-full h-5 border-t border-black px-1 text-center"
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              fontWeight: "900",
              color: "black",
              backgroundColor: "white",
            }}
          >
            ESPECIFICACIONES DEL EQUIPO
          </div>
          <div className="grid grid-cols-4 border-black divide-x border-t divide-black text-[7px] leading-tight">
            <div className="p-1">
              <div className="font-medium">Equipo/Marca</div>
              <div className="uppercase mt-1">{radar?.marca}</div>
            </div>
            <div className="p-1">
              <div className="font-medium">N° Serie</div>
              <div className="uppercase mt-1">{radar?.nro_serie}</div>
            </div>
            <div className="p-1">
              <div className="font-medium">Modelo</div>
              <div className="uppercase mt-1">{radar?.modelo}</div>
            </div>
            <div className="p-1">
              <div className="font-medium">Disp. Autorizante</div>
              <div className="uppercase mt-1">{radar?.disp_autorizante}</div>
            </div>
          </div>
          <div
            className="w-full h-5 border-black px-1 text-center"
            style={{
              fontFamily: "monospace",
              fontSize: "8px",
              fontWeight: "800",
              color: "white",
              backgroundColor: "black",
            }}
          >
            QUEDA USTED NOTIFICADO EN FORMA LEGAL
          </div>
          <div className="px-3 py-1 leading-normal">
            <div className="grid grid-cols-[70%_30%]">
              <div className="text-[8px]">MONTO ORIGINAL DE LA MULTA</div>
              <div className="text-[8px] text-end">$200.000,00</div>
            </div>
            <div className="grid grid-cols-[70%_30%]">
              <div className="text-[8px]">DESCUENTO (PAGO VOLUNTARIO 50%)</div>
              <div className="text-[8px] text-end">$-80.000,00</div>
            </div>
            <div className="grid grid-cols-[70%_30%]">
              <div className="text-[8px]">TOTAL PAGO VOLUNTARIO 50%</div>
              <div className="text-[8px] text-end">$120.000,00</div>
            </div>
            <div className="grid grid-cols-[70%_30%]">
              <div className="text-[8px]">GASTOS ADMINISTRATIVOS</div>
              <div className="text-[8px] text-end">$20.000,00</div>
            </div>
            <div className="flex justify-end my-0.5">
              <hr className="border-black w-20 font-extrabold" />
            </div>
            <div className="grid grid-cols-[70%_30%] font-extrabold">
              <div className="text-[8px]">TOTAL A PAGAR</div>
              <div className="text-[8px] text-end">$120.000,00</div>
            </div>
            <div className="grid grid-cols-[70%_30%] font-extrabold">
              <div className="text-[8px]">PAGO POSTERIOR AL VENCIMIENTO</div>
              <div className="text-[8px] text-end">$200.000,00</div>
            </div>
          </div>
          <div className="w-full border-y border-black px-1 text-start text-[8px] font-extrabold bg-gray-300">
            Fecha de Vto: 05/03/2025
          </div>
          <div className="text-[6px] leading-normal m-1 w-[85%]">
            <b>PAGO VOLUNTARIO DE LA MULTA: </b> Notificada la falta, el
            presunto infractor podrá dentro de los 5 (cinco) días siguientes,
            abonar voluntariamente la multa correespondiente a la transgresión
            verificada. En este caso oblará únicamente el monto mínimo de
            aquella, disminuida en un 50% de su monto (Art. 85 inc. a - Ley
            24449). <br />
            <b>SE NOTIFICA A UD. </b> Que en el caso de no optar por el pago
            voluntario, el presunto infractor deberá, dentro de los 5 (cinco)
            días hábiles siguientes, comparecer ante la oficina administrativa
            de faltas de la Municipalidad de{" "}
            <span className="uppercase">{municipio?.nombre}</span>, ubicada en{" "}
            <span className="uppercase">{municipio?.direccion}</span>, provincia
            de <span className="uppercase">{municipio?.provincia}</span>. <br />{" "}
            En el caso de error, diferencias con los datos del titular o
            descargos por favor dirigirlos a{" "}
            <span className="uppercase">{municipio?.email}</span>.
            <br />
            <br />
            Queda usted debidamente notificado.
          </div>
          <div className="flex items-center justify-end mt-10 mr-3">
            <img
              className="w-[80px] h-auto object-contain"
              src={municipio?.firmaUrl}
            />
          </div>
        </div>
      </div>

      <div className="w-full border border-black mt-1">
        <div className="grid grid-cols-[15%_85%] border-black divide-x divide-black text-[6px] leading-tight">
          <div className="p-1">
            <div className="font-extrabold uppercase text-center my-2">
              PROVINCIA DE SALTA
            </div>
            <div className="p-1">
              <img
                className="w-[100px] h-auto object-contain"
                src={municipio?.logoUrl}
              />
            </div>
          </div>
          <div className="p-1 grid grid-cols-[85%_15%]">
            <div>
              <div className="font-medium">
                Pagá con <b>Código QR:</b> Escaneá el <b>QR</b> con tu celular y
                pagá con tarjeta de crédito, débito, dinero en billetera y demás
                medios de pago.
              </div>
              <div>
                <img
                  className="w-auto h-auto object-contain"
                  src="/banner-logos.png"
                />
              </div>
            </div>
            <div className="flex flex-col items-center my-2">
              <img
                className="w-auto h-auto object-contain"
                src="/qr-prueba.png"
              />
              <br />
              <span>Pagos procesados por epagos</span>
            </div>
          </div>
        </div>
        <div className="border-y border-black divide-x divide-black text-[7px] leading-tight">
          <div className="w-full text-[10px] mt-4 mx-2">
            <div className="grid grid-cols-[24%_30%_0.9fr] gap-4 items-start">
              <div className="space-y-1 text-[8px]">
                <div className="grid grid-cols-2 gap-1">
                  <span>Acta de Infracción:</span>
                  <span className="font-bold">00036861</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span>Dominio:</span>
                  <span className="font-bold">AA575JV</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span>Fecha de Emisión:</span>
                  <span className="font-bold">03/02/2025</span>
                </div>
              </div>

              <div className="space-y-1 text-[8px]">
                <div className="grid grid-cols-2 gap-1">
                  <span>Código Pago Mis Cuentas:</span>
                  <span className="font-bold">309844097300000</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span>Código Red Link:</span>
                  <span className="font-bold">30984409730</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span>Fecha de Vencimiento:</span>
                  <span className="font-bold">05/03/2025</span>
                </div>
              </div>

              <div>
                <img
                  src="/codigo-barras.png"
                  alt="Código de barras"
                  className="w-full h-auto object-contain"
                />
                <div className="text-[8px] mt-1">
                  9690000000100000229455699202504070000120000005
                </div>
              </div>
            </div>

            <div className="my-2 text-[10px] grid grid-cols-[35%_65%]">
              <div>IMPORTE PAGO VOLUNTARIO CON 50% DTO.</div>
              <div className="font-semibold">$120.000,00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
