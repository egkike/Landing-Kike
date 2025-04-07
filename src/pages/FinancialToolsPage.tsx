import { Link } from "react-router-dom";
import FinanzasImg from "../assets/Finanzas.jpg";

const FinancialToolsPage: React.FC = () => {
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
      <div
        className={`
          w-full max-w-md bg-white dark:bg-dark-1 bg-opacity-90 dark:bg-opacity-90 rounded-[15px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] p-6 sm:p-8 text-center
          animate-fade-in
          transition-all duration-300 ease-in-out
          hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:border-2 hover:border-primary
        `}
      >
        {/* Título */}
        <h1 className="text-3xl sm:text-4xl font-bold text-text-dark dark:text-text-primary mb-3 tracking-tight">
          Herramientas Financieras
        </h1>
        <p className="text-sm sm:text-base text-text-dark dark:text-gray-100 mb-8 leading-relaxed">
          Calcula, proyecta y toma decisiones sobre tu negocio apoyado en datos
          financieros sólidos.
        </p>

        {/* Botones */}
        <div className="space-y-4">
          <Link
            to="/sales-price-calculator"
            className="block w-full py-3 px-6 text-text-dark dark:text-text-primary bg-primary rounded-[25px] border-2 border-primary uppercase tracking-wider transition-all duration-300 hover:bg-transparent hover:text-primary hover:scale-105"
          >
            Define un Precio de Venta y su Margen de Ganancia
          </Link>
          <Link
            to="/break-even-calculator"
            className="block w-full py-3 px-6 text-text-dark dark:text-text-primary bg-primary rounded-[25px] border-2 border-primary uppercase tracking-wider transition-all duration-300 hover:bg-transparent hover:text-primary hover:scale-105"
          >
            Proyecta el Punto de Equilibrio, Rentabilidad y Retorno (ROI)
          </Link>
        </div>

        {/* Pie de página */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-300">
          © {new Date().getFullYear()} Kike Garcia
        </p>
      </div>
    </div>
  );
};

export default FinancialToolsPage;
