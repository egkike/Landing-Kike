import { useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaInfoCircle } from "react-icons/fa";
import FinanzasImg from "../assets/Finanzas.jpg";

interface CostComponent {
  description: string;
  value: number;
  includesIVA: boolean;
  ivaPercentage: number;
}

const INFO_TOOLTIP_TEXT = `Consideraciones Principales al Definir el Precio de Venta:\n\n1- Análisis de Costos:\n   Debes conocer a fondo tus costos de producción, adquisición, operativos, de marketing y cualquier otro costo asociado al producto. El precio de venta debe cubrir estos costos y generar un margen de ganancia.\n\n2- Análisis de la Competencia:\n   Investigar los precios de productos similares o sustitutos en el mercado es fundamental. ¿A qué precio venden tus competidores? ¿Cuál es su propuesta de valor?\n\n3- Propuesta de Valor Única:\n   ¿Qué diferencia tu producto de la competencia? ¿Ofrece características, calidad, servicio o beneficios adicionales que justifiquen un precio diferente?\n\n4- Percepción del Cliente:\n   ¿Cuánto están dispuestos a pagar los clientes por tu tipo de producto? La percepción de valor influye directamente en la disposición a pagar.\n\n5- Elasticidad de la Demanda:\n   ¿Cómo responde la demanda de tu producto a los cambios en el precio? Algunos productos son más sensibles al precio que otros.\n\n6- Objetivos de Negocio:\n   ¿Tu objetivo es maximizar la ganancia por unidad, ganar cuota de mercado, o posicionarte como una marca premium o económica?\n\n7- Ciclo de Vida del Producto:\n   La estrategia de precios puede variar según la etapa en la que se encuentre el producto (introducción, crecimiento, madurez, declive).`;

const PRICING_PSYCHOLOGY_TOOLTIP_TEXT = `Algunos principios de pricing psicológico que te podrían ayudar:\n\n1- El efecto señuelo influye sin que lo notes:\n   $25 y $45 no dicen mucho. (No)\n   Agrega uno de $40 en medio... y el de $45 parece mejor oferta. (Sí)\n\n2- Sin signo de pesos $ se siente menos como un gasto:\n   $199 (No)\n   199 (Sí)\n\n3- Si el precio se puede dividir fácil, se compra más fácil:\n   5 t-shirts por $27 (No)\n   5 t-shirts por $25 (Sí)\n\n4- La urgencia dinámica mueve decisiones:\n   "Lo pienso y luego lo compro" (No)\n   "Solo hoy a este precio!" = acción inmediata (Sí)\n\n5- Separa los costos y el precio base se ve más bajo:\n   $450 total (No)\n   $420 + $30 de envío (Sí)\n\n6- La regla del 1000 importa:\n   15% de descuento en un producto de $1.000 (No)\n   $150 menos suena más tangible (Sí)\n\n7- El contexto lo cambia todo:\n   Sin comparar, un precio parece alto (No)\n   Ponlo junto a uno más caro y de pronto se ve más barato (Sí)\n\n8- Los paquetes se perciben como mayor valor:\n   "Compra esto y agrégale esto otro" (No)\n   Bundle completo. La gente siente que recibe más (Sí)\n\n9- Precio redondeado vs. precio preciso:\n   $200 (emocional) (No)\n   $197,60 (racional, parece más pensado) (Sí)\n\nEstos conceptos no son trucos baratos, son principios basados en cómo funciona nuestro cerebro y te ayudarán a vender sin empujar tan solo entendiendo cómo decidimos.`;

const SalesPriceCalculatorPage: React.FC = () => {
  const [costs, setCosts] = useState<CostComponent[]>([]);
  const [newCost, setNewCost] = useState({
    description: "",
    value: "",
    includesIVA: "no",
    ivaPercentage: "21",
  });
  const [method, setMethod] = useState<"markup" | "margin">("markup");
  const [percentage, setPercentage] = useState("20");
  const [ivaVenta, setIvaVenta] = useState({
    include: false,
    percentage: "21",
  });
  const [additionalTax, setAdditionalTax] = useState({
    include: false,
    percentage: "5",
  });
  const [commissions, setCommissions] = useState({
    include: false,
    percentage: "3",
  });
  const [discount, setDiscount] = useState({
    include: false,
    percentage: "10",
  });
  const [result, setResult] = useState<any>(null);
  const [showCostTooltip, setShowCostTooltip] = useState(false);
  const [showPricingTooltip, setShowPricingTooltip] = useState(false);

  const formatNumber = (num: number) =>
    num.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const addCost = () => {
    if (newCost.description && newCost.value) {
      setCosts([
        ...costs,
        {
          description: newCost.description,
          value: parseFloat(newCost.value),
          includesIVA: newCost.includesIVA === "yes",
          ivaPercentage:
            newCost.includesIVA === "yes"
              ? parseFloat(newCost.ivaPercentage)
              : 0,
        },
      ]);
      setNewCost({
        description: "",
        value: "",
        includesIVA: "no",
        ivaPercentage: "21",
      });
    }
  };

  const deleteCost = (index: number) => {
    setCosts(costs.filter((_, i) => i !== index));
  };

  const calculatePrice = () => {
    const totalCost = costs.reduce((sum, cost) => sum + cost.value, 0);
    const totalCostNoIVA = costs.reduce(
      (sum, cost) =>
        sum +
        (cost.includesIVA
          ? cost.value / (1 + cost.ivaPercentage / 100)
          : cost.value),
      0
    );
    const totalIVACost = totalCost - totalCostNoIVA;

    let basePrice =
      method === "markup"
        ? totalCost * (1 + parseFloat(percentage) / 100)
        : totalCost / (1 - parseFloat(percentage) / 100);

    const priceNoIVA = basePrice;
    const ivaVentaAmount = ivaVenta.include
      ? priceNoIVA * (parseFloat(ivaVenta.percentage) / 100)
      : 0;
    const priceWithIVA = priceNoIVA + ivaVentaAmount;

    const additionalTaxAmount = additionalTax.include
      ? priceWithIVA * (parseFloat(additionalTax.percentage) / 100)
      : 0;
    const commissionsAmount = commissions.include
      ? priceWithIVA * (parseFloat(commissions.percentage) / 100)
      : 0;
    const discountAmount = discount.include
      ? priceWithIVA * (parseFloat(discount.percentage) / 100)
      : 0;
    const totalAdditional =
      additionalTaxAmount + commissionsAmount + discountAmount;

    const ivaBalance = ivaVentaAmount - totalIVACost;
    const netProfit = priceWithIVA - totalCost - totalAdditional; // Excluimos ivaBalance del cálculo
    const profitPercentage = (netProfit / priceWithIVA) * 100;

    setResult({
      totalCost,
      totalCostNoIVA,
      totalIVACost,
      priceNoIVA,
      ivaVentaAmount,
      priceWithIVA,
      additionalTaxAmount,
      commissionsAmount,
      discountAmount,
      totalAdditional,
      ivaBalance,
      netProfit,
      profitPercentage,
    });
  };

  const isCalculateButtonEnabled = costs.some((cost) => cost.value > 0);

  return (
    <div
      className="min-h-screen bg-background dark:bg-dark-2 flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundImage: `url(${FinanzasImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-4xl bg-white dark:bg-dark-1 bg-opacity-90 dark:bg-opacity-90 rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] p-4 sm:p-6 relative">
        <Link
          to="/financial-tools"
          className="text-primary hover:underline mb-4 inline-block"
        >
          ← Volver al inicio
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-text-dark dark:text-text-primary mb-4 text-center">
          Calcula tu Precio de Venta y Margen de Ganancia
        </h1>

        {/* Paso 1: Estructura de Costos */}
        <div className="mb-6 relative">
          <div className="absolute top-0 right-0">
            <FaInfoCircle
              className="text-primary cursor-pointer"
              onClick={() => setShowCostTooltip(!showCostTooltip)}
            />
            {showCostTooltip && (
              <div className="absolute bg-sky-200 text-gray-800 text-xs sm:text-sm p-4 rounded shadow-lg top-6 right-0 w-[896px] max-h-[50vh] overflow-y-auto z-10">
                {INFO_TOOLTIP_TEXT.split("\n").map((line, index) => {
                  const isTitle = line.match(/^\d+-/);
                  return (
                    <p
                      key={index}
                      className={isTitle ? "font-bold mb-1" : "ml-4 mb-1"}
                    >
                      {line}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-text-dark dark:text-text-primary mt-8">
            Paso 1 de 3: Estructura de Costos
          </h2>
          <p className="text-gray-800 dark:text-white mb-4 text-sm sm:text-base">
            Agrega los componentes de costo involucrados en tu producto o
            servicio.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
            <input
              type="text"
              value={newCost.description}
              onChange={(e) =>
                setNewCost({ ...newCost, description: e.target.value })
              }
              placeholder="Descripción del costo"
              className="p-2 border-b border-light-border focus:border-b-primary outline-none text-black dark:text-black w-full"
            />
            <input
              type="number"
              value={newCost.value}
              onChange={(e) =>
                setNewCost({ ...newCost, value: e.target.value })
              }
              placeholder="Valor del costo $"
              className="p-2 border-b border-light-border focus:border-b-primary outline-none text-black dark:text-black w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative group w-full sm:w-auto">
              <select
                value={newCost.includesIVA}
                onChange={(e) =>
                  setNewCost({ ...newCost, includesIVA: e.target.value })
                }
                className="p-2 border-b border-light-border text-black dark:text-yellow-400 bg-transparent w-full sm:w-20"
              >
                <option value="yes">Sí</option>
                <option value="no">No</option>
              </select>
              <div className="absolute hidden group-hover:block bg-sky-200 text-gray-800 text-xs sm:text-sm p-2 rounded shadow-lg top-full left-0 mt-1 z-10">
                ¿Incluye IVA?
              </div>
            </div>
            {newCost.includesIVA === "yes" && (
              <div className="relative group w-full sm:w-auto">
                <input
                  type="number"
                  value={newCost.ivaPercentage}
                  onChange={(e) =>
                    setNewCost({ ...newCost, ivaPercentage: e.target.value })
                  }
                  placeholder="% IVA"
                  className="p-2 border-b border-light-border focus:border-b-primary outline-none text-black dark:text-black w-full sm:w-20"
                />
                <div className="absolute hidden group-hover:block bg-sky-200 text-gray-800 text-xs sm:text-sm p-2 rounded shadow-lg top-full left-0 mt-1 z-10">
                  Ingrese porcentaje %
                </div>
              </div>
            )}
          </div>
          <button
            onClick={addCost}
            className="py-2 px-4 bg-primary text-text-dark dark:text-text-primary rounded-[25px] border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-500 w-full sm:w-auto"
          >
            Agregar Costo
          </button>

          {costs.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-200 dark:bg-dark-3">
                    <th className="p-2 text-gray-800 dark:text-white">
                      Descripción
                    </th>
                    <th className="p-2 text-gray-800 dark:text-white">Valor</th>
                    <th className="p-2 text-gray-800 dark:text-white">
                      Incluye IVA
                    </th>
                    <th className="p-2 text-gray-800 dark:text-white">
                      Porcentaje IVA
                    </th>
                    <th className="p-2 text-gray-800 dark:text-white">
                      Valor sin IVA
                    </th>
                    <th className="p-2 text-gray-800 dark:text-white">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {costs.map((cost, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-300 dark:border-dark-5"
                    >
                      <td className="p-2 text-gray-800 dark:text-white">
                        {cost.description}
                      </td>
                      <td className="p-2 text-gray-800 dark:text-white">
                        ${formatNumber(cost.value)}
                      </td>
                      <td className="p-2 text-gray-800 dark:text-white">
                        {cost.includesIVA ? "Sí" : "No"}
                      </td>
                      <td className="p-2 text-gray-800 dark:text-white">
                        {formatNumber(cost.ivaPercentage)}%
                      </td>
                      <td className="p-2 text-gray-800 dark:text-white">
                        $
                        {formatNumber(
                          cost.includesIVA
                            ? cost.value / (1 + cost.ivaPercentage / 100)
                            : cost.value
                        )}
                      </td>
                      <td className="p-2">
                        <button onClick={() => deleteCost(index)}>
                          <FaTrash className="text-red-500 hover:text-red-700" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-gray-800 dark:text-white text-sm sm:text-base">
                <div className="relative group inline-block bg-gray-100 dark:bg-dark-3 p-2 rounded">
                  <p className="font-bold">
                    Costo Total: $
                    {formatNumber(costs.reduce((sum, c) => sum + c.value, 0))}
                  </p>
                  <div className="absolute hidden group-hover:block bg-sky-200 text-black text-xs sm:text-sm p-2 rounded shadow-lg -top-10 left-0 z-10">
                    Sumatoria de costos ingresados
                  </div>
                </div>
                <div className="relative group ml-4">
                  <p>
                    Costo sin IVA: $
                    {formatNumber(
                      costs.reduce(
                        (sum, c) =>
                          sum +
                          (c.includesIVA
                            ? c.value / (1 + c.ivaPercentage / 100)
                            : c.value),
                        0
                      )
                    )}
                  </p>
                  <div className="absolute hidden group-hover:block bg-sky-200 text-black text-xs sm:text-sm p-2 rounded shadow-lg -top-10 left-0 z-10">
                    Suma de (Valor / (1 + % IVA / 100)) para costos con IVA, más
                    valores sin IVA
                  </div>
                </div>
                <div className="relative group ml-4">
                  <p>
                    Total IVA Costo: $
                    {formatNumber(
                      costs.reduce((sum, c) => sum + c.value, 0) -
                        costs.reduce(
                          (sum, c) =>
                            sum +
                            (c.includesIVA
                              ? c.value / (1 + c.ivaPercentage / 100)
                              : c.value),
                          0
                        )
                    )}
                  </p>
                  <div className="absolute hidden group-hover:block bg-sky-200 text-black text-xs sm:text-sm p-2 rounded shadow-lg -top-10 left-0 z-10">
                    Costo Total - Costo sin IVA
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Paso 2: Método de Cálculo */}
        <div className="mb-6 relative">
          <h2 className="text-lg sm:text-xl font-semibold text-text-dark dark:text-text-primary">
            Paso 2 de 3: Método de Cálculo del Margen
          </h2>
          <p className="text-gray-800 dark:text-white mb-4 text-sm sm:text-base">
            Elige cómo deseas calcular tu margen del precio de venta:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <label className="flex items-center group">
              <input
                type="radio"
                name="method"
                checked={method === "markup"}
                onChange={() => setMethod("markup")}
                className="mr-2"
              />
              <span className="text-gray-800 dark:text-white">Markup</span>
              <div className="relative group-hover:block hidden ml-2">
                <FaInfoCircle className="text-primary" />
                <div className="absolute bg-sky-200 text-gray-800 text-xs sm:text-sm p-2 rounded shadow-lg -top-10 w-48 sm:w-64 z-10">
                  Precio de Venta = Costo Total × (1 + % Markup / 100)
                </div>
              </div>
            </label>
            <label className="flex items-center group">
              <input
                type="radio"
                name="method"
                checked={method === "margin"}
                onChange={() => setMethod("margin")}
                className="mr-2"
              />
              <span className="text-gray-800 dark:text-white">
                Margen sobre Venta
              </span>
              <div className="relative group-hover:block hidden ml-2">
                <FaInfoCircle className="text-primary" />
                <div className="absolute bg-sky-200 text-gray-800 text-xs sm:text-sm p-2 rounded shadow-lg -top-10 w-48 sm:w-64 z-10">
                  Precio de Venta = Costo Total / (1 - % Margen / 100)
                </div>
              </div>
            </label>
          </div>
          <div className="relative group">
            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              placeholder="%"
              className="p-2 border-b border-light-border focus:border-b-primary outline-none w-full sm:w-32 text-black dark:text-black"
            />
            <div className="absolute hidden group-hover:block bg-sky-200 text-gray-800 text-xs sm:text-sm p-2 rounded shadow-lg top-full left-0 mt-1 z-10">
              Ingrese porcentaje %
            </div>
          </div>
          {costs.length > 0 && percentage && (
            <div className="mt-2 relative group">
              <p className="text-gray-800 dark:text-white text-sm sm:text-base font-bold">
                Precio de Venta: $
                {formatNumber(
                  method === "markup"
                    ? costs.reduce((sum, c) => sum + c.value, 0) *
                        (1 + parseFloat(percentage) / 100)
                    : costs.reduce((sum, c) => sum + c.value, 0) /
                        (1 - parseFloat(percentage) / 100)
                )}
              </p>
              <div className="absolute hidden group-hover:block bg-sky-200 text-gray-800 text-xs sm:text-sm p-2 rounded shadow-lg top-full left-0 mt-1 z-10">
                {method === "markup"
                  ? `Precio de Venta = Costo Total × (1 + ${formatNumber(
                      parseFloat(percentage)
                    )}% / 100)`
                  : `Precio de Venta = Costo Total / (1 - ${formatNumber(
                      parseFloat(percentage)
                    )}% / 100)`}
              </div>
            </div>
          )}
          <h3 className="mt-4 text-base sm:text-lg font-semibold text-text-dark dark:text-text-primary">
            Impuestos y Descuentos Adicionales
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {[
              { label: "IVA Venta", state: ivaVenta, setState: setIvaVenta },
              {
                label: "Impuesto Adicional",
                state: additionalTax,
                setState: setAdditionalTax,
              },
              {
                label: "Comisiones",
                state: commissions,
                setState: setCommissions,
              },
              { label: "Descuento", state: discount, setState: setDiscount },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2"
              >
                <label className="text-gray-800 dark:text-white text-sm sm:text-base">
                  {item.label}:
                </label>
                <select
                  value={item.state.include ? "yes" : "no"}
                  onChange={(e) =>
                    item.setState({
                      ...item.state,
                      include: e.target.value === "yes",
                    })
                  }
                  className="p-2 border-b border-light-border text-black dark:text-yellow-400 bg-transparent w-full sm:w-auto"
                >
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </select>
                {item.state.include && (
                  <div className="relative group w-full sm:w-auto">
                    <input
                      type="number"
                      value={item.state.percentage}
                      onChange={(e) =>
                        item.setState({
                          ...item.state,
                          percentage: e.target.value,
                        })
                      }
                      className="p-2 border-b border-light-border w-full sm:w-20 text-black dark:text-black"
                    />
                    <div className="absolute hidden group-hover:block bg-sky-200 text-gray-800 text-xs sm:text-sm p-2 rounded shadow-lg top-full left-0 mt-1 z-10">
                      Ingrese porcentaje %
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Paso 3: Cálculo Final */}
        <div className="mb-6 relative">
          <h2 className="text-lg sm:text-xl font-semibold text-text-dark dark:text-text-primary">
            Paso 3 de 3: Cálculo Final
          </h2>
          <button
            onClick={calculatePrice}
            disabled={!isCalculateButtonEnabled}
            className={`mt-4 py-2 px-4 bg-primary text-text-dark dark:text-text-primary rounded-[25px] border-2 border-primary transition-all duration-500 w-full sm:w-auto ${
              isCalculateButtonEnabled
                ? "hover:bg-transparent hover:text-primary"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            Calcular
          </button>

          {result && (
            <div className="mt-4 text-gray-800 dark:text-white text-sm sm:text-base">
              <div className="relative group inline-block bg-gray-100 dark:bg-dark-3 p-2 rounded">
                <p className="font-bold">
                  Precio de Venta: ${formatNumber(result.priceNoIVA)}
                </p>
                <div className="absolute hidden group-hover:block bg-sky-200 text-black text-xs sm:text-sm p-2 rounded shadow-lg -top-10 left-0 z-10">
                  {method === "markup"
                    ? "Costo Total × (1 + % Markup / 100)"
                    : "Costo Total / (1 - % Margen / 100)"}
                </div>
              </div>
              <div className="relative group ml-4">
                <p>Total IVA Venta: ${formatNumber(result.ivaVentaAmount)}</p>
                <div className="absolute hidden group-hover:block bg-sky-200 text-black text-xs sm:text-sm p-2 rounded shadow-lg -top-10 left-0 z-10">
                  Precio de Venta × (% IVA Venta / 100)
                </div>
              </div>
              <div className="relative group inline-block bg-gray-100 dark:bg-dark-3 p-2 rounded mt-2">
                <p className="font-bold">
                  Precio de Venta con IVA: ${formatNumber(result.priceWithIVA)}
                </p>
                <div className="absolute hidden group-hover:block bg-sky-200 text-black text-xs sm:text-sm p-2 rounded shadow-lg -top-10 left-0 z-10">
                  Precio de Venta + Total IVA Venta
                </div>
              </div>
              <div className="relative group ml-4 mt-2">
                <p>Balance del IVA: ${formatNumber(result.ivaBalance)}</p>
                <div className="absolute hidden group-hover:block bg-sky-200 text-black text-xs sm:text-sm p-2 rounded shadow-lg -top-10 left-0 z-10">
                  Total IVA Venta - Total IVA Costo. Un valor negativo indica un
                  crédito fiscal que podrías recuperar en tu declaración de IVA.
                </div>
              </div>

              <h3 className="mt-4 font-semibold">Descuentos adicionales:</h3>
              {result.additionalTaxAmount > 0 && (
                <p>
                  Impuestos Adicionales: $
                  {formatNumber(result.additionalTaxAmount)}
                </p>
              )}
              {result.commissionsAmount > 0 && (
                <p>Comisiones: ${formatNumber(result.commissionsAmount)}</p>
              )}
              {result.discountAmount > 0 && (
                <p>Descuentos: ${formatNumber(result.discountAmount)}</p>
              )}
              <p>Total Adicionales: ${formatNumber(result.totalAdditional)}</p>

              <div
                className={`mt-4 p-4 rounded-[10px] ${
                  result.netProfit >= 0 ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <div className="relative group">
                  <p
                    className={`text-base sm:text-lg font-semibold ${
                      result.netProfit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    Ganancia Neta: ${formatNumber(result.netProfit)}
                  </p>
                  <div className="absolute hidden group-hover:block bg-sky-200 text-black text-xs sm:text-sm p-2 rounded shadow-lg -top-10 left-0 z-10">
                    Precio de Venta con IVA - Costo Total - Total Adicionales
                  </div>
                </div>
                <div className="relative group">
                  <p
                    className={`text-base sm:text-lg font-semibold ${
                      result.profitPercentage >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Porcentaje de Ganancia: $
                    {formatNumber(result.profitPercentage)}%
                  </p>
                  <div className="absolute hidden group-hover:block bg-sky-200 text-black text-xs sm:text-sm p-2 rounded shadow-lg -top-10 left-0 z-10">
                    (Ganancia Neta / Precio de Venta con IVA) × 100
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-100 dark:bg-dark-3 rounded-[10px] text-sm sm:text-lg">
                <p className="text-gray-800 dark:text-white">
                  <span className="text-cyan-500 font-semibold">Resumen:</span>{" "}
                  El costo total del producto fue de{" "}
                  <span className="text-green-600">
                    ${formatNumber(result.totalCost)}
                  </span>{" "}
                  y se calcula un precio de venta con IVA de{" "}
                  <span className="text-green-600">
                    ${formatNumber(result.priceWithIVA)}
                  </span>
                  . Tu ganancia neta es de{" "}
                  <span
                    className={
                      result.netProfit >= 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    ${formatNumber(result.netProfit)}
                  </span>{" "}
                  que representa el{" "}
                  <span
                    className={
                      result.profitPercentage >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {formatNumber(result.profitPercentage)}%
                  </span>{" "}
                  del precio de venta con IVA. El Balance del IVA es{" "}
                  <span
                    className={
                      result.ivaBalance >= 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    ${formatNumber(result.ivaBalance)}
                  </span>
                  .
                </p>
              </div>
            </div>
          )}

          <div className="mt-4 relative">
            <Link
              to="/financial-tools"
              className="text-primary hover:underline inline-block text-sm sm:text-base"
            >
              ← Volver al inicio
            </Link>
            <div className="absolute bottom-0 right-0">
              <FaInfoCircle
                className="text-primary cursor-pointer"
                onClick={() => setShowPricingTooltip(!showPricingTooltip)}
              />
              {showPricingTooltip && (
                <div className="absolute bg-sky-200 text-gray-800 text-xs sm:text-sm p-4 rounded shadow-lg bottom-6 right-0 w-[896px] max-h-[50vh] overflow-y-auto z-10">
                  {PRICING_PSYCHOLOGY_TOOLTIP_TEXT.split("\n").map(
                    (line, index) => {
                      const isTitle = line.match(/^\d+-/);
                      return (
                        <p
                          key={index}
                          className={isTitle ? "font-bold mb-1" : "ml-4 mb-1"}
                        >
                          {line}
                        </p>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPriceCalculatorPage;
