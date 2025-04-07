import { useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaInfoCircle } from "react-icons/fa";
import FinanzasImg from "../assets/Finanzas.jpg";

interface InvestmentComponent {
  description: string;
  value: number;
}

interface FixedCostComponent {
  description: string;
  value: number;
}

interface VariableCostComponent {
  description: string;
  value: number;
  includesIVA: boolean;
  ivaPercentage: number;
}

const BREAK_EVEN_TOOLTIP_TEXT = `1- El Punto de Equilibrio:\n   En finanzas es el nivel de ventas en el que una empresa no gana ni pierde dinero, es decir, sus ingresos totales son iguales a sus gastos y costos totales. En este punto, la empresa cubre todos sus gastos fijos y costos variables, pero no obtiene ganancias.\n   Punto de Equilibrio (unidades) = Costos Fijos Totales / (Precio de Venta por Unidad - Costo Variable por Unidad)\n\n2- La Rentabilidad deseada:\n   Una vez calculado el punto de equilibrio, podemos determinar cuántas unidades adicionales se deben vender para alcanzar una Rentabilidad deseada (por ejemplo, 20%).\n   Unidades Adicionales = (Rentabilidad Deseada × Costos Fijos Totales) / Margen de Contribución\n\n3- El Retorno sobre la Inversión (ROI):\n   Se calcula sobre un periodo que normalmente es anual, y es el porcentaje de utilidad o ganancia que se obtiene en ese periodo y que representa la porción que nos retorna sobre la inversión realizada. Se deben considerar otros factores como inflación, competencia, cambios en la demanda, etc., al realizar una evaluación financiera más completa.`;

const BreakEvenCalculatorPage: React.FC = () => {
  const [investments, setInvestments] = useState<InvestmentComponent[]>([]);
  const [newInvestment, setNewInvestment] = useState({
    description: "",
    value: "",
  });
  const [fixedCosts, setFixedCosts] = useState<FixedCostComponent[]>([]);
  const [newFixedCost, setNewFixedCost] = useState({
    description: "",
    value: "",
  });
  const [variableCosts, setVariableCosts] = useState<VariableCostComponent[]>(
    []
  );
  const [newVariableCost, setNewVariableCost] = useState({
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
  const [desiredProfitability, setDesiredProfitability] = useState("25");
  const [result, setResult] = useState<any>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const formatNumber = (num: number, isUnit: boolean = false) =>
    isUnit
      ? Math.round(num).toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : num.toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  const addInvestment = () => {
    if (newInvestment.description && newInvestment.value) {
      setInvestments([
        ...investments,
        {
          description: newInvestment.description,
          value: parseFloat(newInvestment.value),
        },
      ]);
      setNewInvestment({ description: "", value: "" });
    }
  };

  const deleteInvestment = (index: number) => {
    setInvestments(investments.filter((_, i) => i !== index));
  };

  const addFixedCost = () => {
    if (newFixedCost.description && newFixedCost.value) {
      setFixedCosts([
        ...fixedCosts,
        {
          description: newFixedCost.description,
          value: parseFloat(newFixedCost.value),
        },
      ]);
      setNewFixedCost({ description: "", value: "" });
    }
  };

  const deleteFixedCost = (index: number) => {
    setFixedCosts(fixedCosts.filter((_, i) => i !== index));
  };

  const addVariableCost = () => {
    if (newVariableCost.description && newVariableCost.value) {
      setVariableCosts([
        ...variableCosts,
        {
          description: newVariableCost.description,
          value: parseFloat(newVariableCost.value),
          includesIVA: newVariableCost.includesIVA === "yes",
          ivaPercentage:
            newVariableCost.includesIVA === "yes"
              ? parseFloat(newVariableCost.ivaPercentage)
              : 0,
        },
      ]);
      setNewVariableCost({
        description: "",
        value: "",
        includesIVA: "no",
        ivaPercentage: "21",
      });
    }
  };

  const deleteVariableCost = (index: number) => {
    setVariableCosts(variableCosts.filter((_, i) => i !== index));
  };

  const calculateBreakEven = () => {
    const totalInvestment = investments.reduce(
      (sum, inv) => sum + inv.value,
      0
    );
    const totalFixedCosts = fixedCosts.reduce(
      (sum, cost) => sum + cost.value,
      0
    );
    const totalVariableCost = variableCosts.reduce(
      (sum, cost) => sum + cost.value,
      0
    );
    const totalVariableCostNoIVA = variableCosts.reduce(
      (sum, cost) =>
        sum +
        (cost.includesIVA
          ? cost.value / (1 + cost.ivaPercentage / 100)
          : cost.value),
      0
    );
    const totalIVACost = totalVariableCost - totalVariableCostNoIVA;

    let basePrice =
      method === "markup"
        ? totalVariableCost * (1 + parseFloat(percentage) / 100)
        : totalVariableCost / (1 - parseFloat(percentage) / 100);
    const priceNoIVA = basePrice;
    const ivaVentaAmount = ivaVenta.include
      ? priceNoIVA * (parseFloat(ivaVenta.percentage) / 100)
      : 0;
    const priceWithIVA = priceNoIVA + ivaVentaAmount;

    const contributionMargin = priceWithIVA - totalVariableCost;
    const contributionPercentage = (contributionMargin / priceWithIVA) * 100;
    const breakEvenUnits =
      contributionMargin > 0 ? totalFixedCosts / contributionMargin : 0;
    const breakEvenMoney = breakEvenUnits * priceWithIVA;

    const desiredProfitabilityNum = parseFloat(desiredProfitability) / 100;
    const additionalUnits =
      contributionMargin > 0
        ? (desiredProfitabilityNum * totalFixedCosts) / contributionMargin
        : 0;
    const additionalGrossProfit = additionalUnits * priceWithIVA;
    const totalUnitsToSell = breakEvenUnits + additionalUnits;
    const totalMoneyToSell = breakEvenMoney + additionalGrossProfit;
    const grossProfitPercentage =
      breakEvenMoney > 0 ? (additionalGrossProfit / breakEvenMoney) * 100 : 0;

    const inventoryMoney = totalVariableCost * totalUnitsToSell;
    const workingCapital = inventoryMoney + totalFixedCosts;

    const totalIVAVenta = ivaVenta.include
      ? priceNoIVA * (parseFloat(ivaVenta.percentage) / 100)
      : 0;
    const ivaBalance = (totalIVAVenta - totalIVACost) * additionalUnits;

    const additionalTaxAmount = additionalTax.include
      ? additionalGrossProfit * (parseFloat(additionalTax.percentage) / 100)
      : 0;
    const commissionsAmount = commissions.include
      ? additionalGrossProfit * (parseFloat(commissions.percentage) / 100)
      : 0;
    const discountAmount = discount.include
      ? additionalGrossProfit * (parseFloat(discount.percentage) / 100)
      : 0;
    const totalAdditional =
      additionalTaxAmount + commissionsAmount + discountAmount;

    const netProfit = additionalGrossProfit - totalAdditional;
    const profitPercentage =
      breakEvenMoney > 0 ? (netProfit / breakEvenMoney) * 100 : 0; // Corrección aquí
    const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

    setResult({
      totalInvestment,
      totalFixedCosts,
      totalVariableCost,
      totalVariableCostNoIVA,
      totalIVACost,
      priceNoIVA,
      totalIVAVenta,
      priceWithIVA,
      contributionMargin,
      contributionPercentage,
      breakEvenUnits,
      breakEvenMoney,
      additionalUnits,
      additionalGrossProfit,
      grossProfitPercentage,
      totalUnitsToSell,
      totalMoneyToSell,
      inventoryMoney,
      workingCapital,
      ivaBalance,
      additionalTaxAmount,
      commissionsAmount,
      discountAmount,
      totalAdditional,
      netProfit,
      profitPercentage,
      roi,
    });
  };

  const isCalculateButtonEnabled =
    investments.some((inv) => inv.value > 0) &&
    fixedCosts.some((cost) => cost.value > 0) &&
    variableCosts.some((cost) => cost.value > 0) &&
    parseFloat(desiredProfitability) > 0;

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
          Calcula el Punto de Equilibrio, Rentabilidad y Retorno sobre la
          Inversión
        </h1>
        <div className="absolute top-4 right-4">
          <FaInfoCircle
            className="text-primary cursor-pointer"
            onClick={() => setShowTooltip(!showTooltip)}
          />
          {showTooltip && (
            <div className="absolute bg-sky-200 text-gray-800 text-xs sm:text-sm p-4 rounded shadow-lg top-6 right-0 w-[896px] max-h-[50vh] overflow-y-auto z-10">
              {BREAK_EVEN_TOOLTIP_TEXT.split("\n").map((line, index) => {
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

        {/* Paso 1: Estructura de la Inversión */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-text-dark dark:text-text-primary">
            Paso 1 de 4: Estructura de la Inversión
          </h2>
          <p className="text-gray-800 dark:text-white mb-4 text-sm sm:text-base">
            Añade los componentes de inversión para tu negocio:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={newInvestment.description}
              onChange={(e) =>
                setNewInvestment({
                  ...newInvestment,
                  description: e.target.value,
                })
              }
              placeholder="Descripción de Inversión"
              className="p-2 border-b border-light-border focus:border-b-primary outline-none text-black dark:text-black w-full"
            />
            <input
              type="number"
              value={newInvestment.value}
              onChange={(e) =>
                setNewInvestment({ ...newInvestment, value: e.target.value })
              }
              placeholder="Valor Inversión $"
              className="p-2 border-b border-light-border focus:border-b-primary outline-none text-black dark:text-black w-full"
            />
          </div>
          <button
            onClick={addInvestment}
            className="py-2 px-4 bg-primary text-text-dark dark:text-text-primary rounded-[25px] border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-500 w-full sm:w-auto"
          >
            Agregar Inversión
          </button>
          {investments.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-200 dark:bg-dark-3">
                    <th className="p-2 text-gray-800 dark:text-white">
                      Descripción Inversión
                    </th>
                    <th className="p-2 text-gray-800 dark:text-white">
                      Valor Inversión
                    </th>
                    <th className="p-2 text-gray-800 dark:text-white">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((inv, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-300 dark:border-dark-5"
                    >
                      <td className="p-2 text-gray-800 dark:text-white">
                        {inv.description}
                      </td>
                      <td className="p-2 text-gray-800 dark:text-white">
                        ${formatNumber(inv.value)}
                      </td>
                      <td className="p-2">
                        <button onClick={() => deleteInvestment(index)}>
                          <FaTrash className="text-red-500 hover:text-red-700" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-gray-800 dark:text-white font-bold">
                Inversión Total: $
                {formatNumber(
                  investments.reduce((sum, inv) => sum + inv.value, 0)
                )}
              </p>
            </div>
          )}
        </div>

        {/* Paso 2: Estructura de Gastos Fijos */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-text-dark dark:text-text-primary">
            Paso 2 de 4: Estructura de Gastos Fijos
          </h2>
          <p className="text-gray-800 dark:text-white mb-4 text-sm sm:text-base">
            Añade los componentes de gastos fijos de tu negocio:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={newFixedCost.description}
              onChange={(e) =>
                setNewFixedCost({
                  ...newFixedCost,
                  description: e.target.value,
                })
              }
              placeholder="Descripción de Gasto"
              className="p-2 border-b border-light-border focus:border-b-primary outline-none text-black dark:text-black w-full"
            />
            <input
              type="number"
              value={newFixedCost.value}
              onChange={(e) =>
                setNewFixedCost({ ...newFixedCost, value: e.target.value })
              }
              placeholder="Valor del Gasto $"
              className="p-2 border-b border-light-border focus:border-b-primary outline-none text-black dark:text-black w-full"
            />
          </div>
          <button
            onClick={addFixedCost}
            className="py-2 px-4 bg-primary text-text-dark dark:text-text-primary rounded-[25px] border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-500 w-full sm:w-auto"
          >
            Agregar Gasto
          </button>
          {fixedCosts.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-200 dark:bg-dark-3">
                    <th className="p-2 text-gray-800 dark:text-white">
                      Descripción Gasto
                    </th>
                    <th className="p-2 text-gray-800 dark:text-white">
                      Valor Gasto
                    </th>
                    <th className="p-2 text-gray-800 dark:text-white">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fixedCosts.map((cost, index) => (
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
                      <td className="p-2">
                        <button onClick={() => deleteFixedCost(index)}>
                          <FaTrash className="text-red-500 hover:text-red-700" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-gray-800 dark:text-white font-bold">
                Gasto Fijo Total: $
                {formatNumber(
                  fixedCosts.reduce((sum, cost) => sum + cost.value, 0)
                )}
              </p>
            </div>
          )}
        </div>

        {/* Paso 3: Estructura de Costos y Precio de Venta */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-text-dark dark:text-text-primary">
            Paso 3 de 4: Estructura de Costos y Precio de Venta
          </h2>
          <p className="text-gray-800 dark:text-white mb-4 text-sm sm:text-base">
            Añade los componentes de costos unitarios involucrados en tu
            producto o servicio:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
            <input
              type="text"
              value={newVariableCost.description}
              onChange={(e) =>
                setNewVariableCost({
                  ...newVariableCost,
                  description: e.target.value,
                })
              }
              placeholder="Descripción del costo"
              className="p-2 border-b border-light-border focus:border-b-primary outline-none text-black dark:text-black w-full"
            />
            <input
              type="number"
              value={newVariableCost.value}
              onChange={(e) =>
                setNewVariableCost({
                  ...newVariableCost,
                  value: e.target.value,
                })
              }
              placeholder="Valor del costo $"
              className="p-2 border-b border-light-border focus:border-b-primary outline-none text-black dark:text-black w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative group w-full sm:w-auto">
              <select
                value={newVariableCost.includesIVA}
                onChange={(e) =>
                  setNewVariableCost({
                    ...newVariableCost,
                    includesIVA: e.target.value,
                  })
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
            {newVariableCost.includesIVA === "yes" && (
              <div className="relative group w-full sm:w-auto">
                <input
                  type="number"
                  value={newVariableCost.ivaPercentage}
                  onChange={(e) =>
                    setNewVariableCost({
                      ...newVariableCost,
                      ivaPercentage: e.target.value,
                    })
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
            onClick={addVariableCost}
            className="py-2 px-4 bg-primary text-text-dark dark:text-text-primary rounded-[25px] border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-500 w-full sm:w-auto"
          >
            Agregar Costo
          </button>
          {variableCosts.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-200 dark:bg-dark-3">
                    <th className="p-2 text-gray-800 dark:text-white">
                      Descripción Costo
                    </th>
                    <th className="p-2 text-gray-800 dark:text-white">
                      Valor Costo
                    </th>
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
                  {variableCosts.map((cost, index) => (
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
                        <button onClick={() => deleteVariableCost(index)}>
                          <FaTrash className="text-red-500 hover:text-red-700" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-gray-800 dark:text-white text-sm sm:text-base">
                <p className="font-bold">
                  Costo Total: $
                  {formatNumber(
                    variableCosts.reduce((sum, c) => sum + c.value, 0)
                  )}
                </p>
                <p>
                  Costo sin IVA: $
                  {formatNumber(
                    variableCosts.reduce(
                      (sum, c) =>
                        sum +
                        (c.includesIVA
                          ? c.value / (1 + c.ivaPercentage / 100)
                          : c.value),
                      0
                    )
                  )}
                </p>
                <p>
                  Total IVA Costo: $
                  {formatNumber(
                    variableCosts.reduce((sum, c) => sum + c.value, 0) -
                      variableCosts.reduce(
                        (sum, c) =>
                          sum +
                          (c.includesIVA
                            ? c.value / (1 + c.ivaPercentage / 100)
                            : c.value),
                        0
                      )
                  )}
                </p>
              </div>
            </div>
          )}

          <h3 className="mt-4 text-base sm:text-lg font-semibold text-text-dark dark:text-text-primary">
            Elige cómo deseas calcular el margen del precio de venta:
          </h3>
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
          {variableCosts.length > 0 && percentage && (
            <div className="mt-2 relative group">
              <p className="text-gray-800 dark:text-white text-sm sm:text-base font-bold">
                Precio de Venta: $
                {formatNumber(
                  method === "markup"
                    ? variableCosts.reduce((sum, c) => sum + c.value, 0) *
                        (1 + parseFloat(percentage) / 100)
                    : variableCosts.reduce((sum, c) => sum + c.value, 0) /
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
            Ingrese los impuestos o descuentos adicionales:
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

        {/* Paso 4: Cálculo Final */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-text-dark dark:text-text-primary">
            Paso 4 de 4: Cálculo Final
          </h2>
          <div className="mt-4">
            <label className="text-gray-800 dark:text-white text-sm sm:text-base">
              Porcentaje Rentabilidad Deseada:
            </label>
            <input
              type="number"
              value={desiredProfitability}
              onChange={(e) => setDesiredProfitability(e.target.value)}
              placeholder="%"
              className="p-2 border-b border-light-border focus:border-b-primary outline-none w-full sm:w-32 text-black dark:text-black mt-2"
            />
          </div>
          <button
            onClick={calculateBreakEven}
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
              <h3 className="font-semibold">
                1- Composición del Precio de Venta:
              </h3>
              <div className="relative group">
                <p>
                  Total IVA Venta (por unidad): $
                  {formatNumber(result.totalIVAVenta)}
                </p>
                <div className="absolute hidden group-hover:block bg-sky-200 text-black text-xs sm:text-sm p-2 rounded shadow-lg -top-10 left-0 z-10">
                  Precio de Venta sin IVA × (% IVA Venta / 100)
                </div>
              </div>
              <div className="relative group">
                <p className="font-bold">
                  Precio de Venta con IVA: ${formatNumber(result.priceWithIVA)}
                </p>
                <div className="absolute hidden group-hover:block bg-sky-200 text-black text-xs sm:text-sm p-2 rounded shadow-lg -top-10 left-0 z-10">
                  Precio de Venta sin IVA + Total IVA Venta
                </div>
              </div>

              <h3 className="mt-4 font-semibold">
                2- Margen de Contribución del Precio de Venta:
              </h3>
              <p>
                Margen Contribución: ${formatNumber(result.contributionMargin)}
              </p>
              <p>
                Porcentaje Contribución:{" "}
                {formatNumber(result.contributionPercentage)}%
              </p>

              <h3 className="mt-4 font-semibold">
                3- Punto de Equilibrio en Unidades y en Dinero:
              </h3>
              <p>
                Punto de Equilibrio (unidades):{" "}
                <span className="text-green-500 bg-green-100 font-bold px-2 py-1 rounded">
                  {formatNumber(result.breakEvenUnits, true)}
                </span>
              </p>
              <p>
                Punto de Equilibrio (dinero):{" "}
                <span className="text-green-500 bg-green-100 font-bold px-2 py-1 rounded">
                  ${formatNumber(result.breakEvenMoney)}
                </span>
              </p>

              <h3 className="mt-4 font-semibold">
                4- Determinar cuánto hay que vender para alcanzar la
                Rentabilidad deseada:
              </h3>
              <p>
                Unidades Adicionales:{" "}
                {formatNumber(result.additionalUnits, true)}
              </p>
              <p>
                Utilidad Bruta Adicional: $
                {formatNumber(result.additionalGrossProfit)}
              </p>
              <p className="font-bold">
                Porcentaje Utilidad Bruta (Deseado):{" "}
                <span className="text-yellow-500 bg-yellow-100 px-2 py-1 rounded">
                  {formatNumber(result.grossProfitPercentage)}%
                </span>
              </p>
              <p>
                Total a Vender (Unidades):{" "}
                {formatNumber(result.totalUnitsToSell, true)}
              </p>
              <p>
                Total a Vender (Dinero): $
                {formatNumber(result.totalMoneyToSell)}
              </p>

              <h3 className="mt-4 font-semibold">
                5- Estimación del Capital de Trabajo requerido:
              </h3>
              <p>Inventario (Dinero): ${formatNumber(result.inventoryMoney)}</p>
              <div className="relative group">
                <p className="font-bold">
                  Capital de Trabajo: ${formatNumber(result.workingCapital)}
                </p>
                <div className="absolute hidden group-hover:block bg-sky-200 text-black text-xs sm:text-sm p-2 rounded shadow-lg -top-10 left-0 z-10">
                  El Capital de Trabajo debe ser suficiente para cubrir el
                  inventario necesario para la venta y los gastos operativos o
                  fijos del ciclo.
                </div>
              </div>

              <h3 className="mt-4 font-semibold">
                6- Descuentos sobre el total de ventas para determinar la
                Utilidad Neta:
              </h3>
              <div className="relative group">
                <p>Balance del IVA: ${formatNumber(result.ivaBalance)}</p>
                <div className="absolute hidden group-hover:block bg-sky-200 text-black text-xs sm:text-sm p-2 rounded shadow-lg -top-10 left-0 z-10">
                  (Total IVA Venta - Total IVA Costo) × Unidades Adicionales. Un
                  valor negativo indica un crédito fiscal que podrías recuperar
                  en tu declaración de IVA.
                </div>
              </div>
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
              <div className="relative group">
                <p>Utilidad Neta: ${formatNumber(result.netProfit)}</p>
                <div className="absolute hidden group-hover:block bg-sky-200 text-black text-xs sm:text-sm p-2 rounded shadow-lg -top-10 left-0 z-10">
                  Utilidad Bruta Adicional - Total Adicionales
                </div>
              </div>
              <div className="relative group">
                <p className="font-bold">
                  Porcentaje Utilidad Neta:{" "}
                  <span className="text-yellow-500 bg-yellow-100 px-2 py-1 rounded font-bold">
                    {formatNumber(result.profitPercentage)}%
                  </span>
                </p>
                <div className="absolute hidden group-hover:block bg-sky-200 text-black text-xs sm:text-sm p-2 rounded shadow-lg -top-10 left-0 z-10">
                  (Utilidad Neta / Punto de Equilibrio en Dinero) × 100
                </div>
              </div>

              <h3 className="mt-4 font-semibold">
                7- Estimación del Retorno sobre la Inversión (ROI):
              </h3>
              <p className="font-bold">
                Retorno de Inversión (ROI):{" "}
                <span className="text-green-500 bg-green-100 px-2 py-1 rounded">
                  {formatNumber(result.roi)}%
                </span>
              </p>

              <h3 className="mt-4 font-semibold">
                8- Análisis del negocio proyectado:
              </h3>
              <div className="relative group bg-gray-100 dark:bg-dark-3 p-4 rounded-[10px]">
                <p>
                  <span className="text-cyan-500 font-semibold">Resumen:</span>{" "}
                  El costo total del producto/servicio sería de{" "}
                  <span className="text-green-600">
                    ${formatNumber(result.totalVariableCost)}
                  </span>{" "}
                  y se calcula un precio de venta con IVA de{" "}
                  <span className="text-green-600">
                    ${formatNumber(result.priceWithIVA)}
                  </span>
                  . El gasto fijo total sería de{" "}
                  <span className="text-green-600">
                    ${formatNumber(result.totalFixedCosts)}
                  </span>{" "}
                  con lo cual se establece un punto de equilibrio en unidades de{" "}
                  <span className="text-green-600">
                    {formatNumber(result.breakEvenUnits, true)}
                  </span>{" "}
                  que equivaldrían a{" "}
                  <span className="text-green-600">
                    ${formatNumber(result.breakEvenMoney)}
                  </span>{" "}
                  de ventas a realizar para alcanzarlo. La Rentabilidad deseada
                  de{" "}
                  <span className="text-green-600">
                    {formatNumber(parseFloat(desiredProfitability))}%
                  </span>{" "}
                  sería de{" "}
                  <span className="text-green-600">
                    ${formatNumber(result.additionalGrossProfit)}
                  </span>
                  , que después de los descuentos quedaría en{" "}
                  <span className="text-green-600">
                    ${formatNumber(result.netProfit)}
                  </span>{" "}
                  que representa el{" "}
                  <span className="text-green-600">
                    {formatNumber(result.profitPercentage)}%
                  </span>{" "}
                  respecto al punto de equilibrio. El Balance del IVA es{" "}
                  <span
                    className={
                      result.ivaBalance >= 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    ${formatNumber(result.ivaBalance)}
                  </span>
                  . El Retorno sobre la Inversión (ROI) estimado sería del{" "}
                  <span className="text-green-600">
                    {formatNumber(result.roi)}%
                  </span>
                  . El Capital de Trabajo estimado sería de{" "}
                  <span className="text-green-600">
                    ${formatNumber(result.workingCapital)}
                  </span>{" "}
                  tomando en cuenta que se trabaja sin créditos, es decir pagos
                  a proveedores y ventas a clientes al contado. Si desea
                  trabajar con créditos, deberá realizar un análisis más preciso
                  del Capital de Trabajo.
                </p>
                <div className="absolute hidden group-hover:block bg-sky-200 text-black text-xs sm:text-sm p-2 rounded shadow-lg -top-10 left-0 w-full z-10">
                  Este análisis es una simplificación y puede no reflejar la
                  realidad de una situación empresarial específica. Se
                  recomienda consultar con profesionales financieros para una
                  evaluación más precisa.
                </div>
              </div>
            </div>
          )}

          <Link
            to="/financial-tools"
            className="text-primary hover:underline mt-4 inline-block"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BreakEvenCalculatorPage;
