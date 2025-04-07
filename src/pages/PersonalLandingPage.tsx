import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter, FaCalculator } from "react-icons/fa6";
import FotoKike from "../assets/Foto-Kike.jpeg";

const PersonalLandingPage: React.FC = () => {
  const personalInfo = {
    name: "Kike Garcia",
    description:
      "Emprendedor | Ayudo a emprendedores con mi experiencia en análisis y desarrollo de software.",
  };

  const links = [
    {
      title: "GitHub",
      url: "https://github.com/egkike",
      icon: <FaGithub size={24} />,
    },
    {
      title: "LinkedIn",
      url: "https://linkedin.com/in/enrique-garcia-6526a15a",
      icon: <FaLinkedin size={24} />,
    },
    {
      title: "(ex-Twitter)",
      url: "https://x.com/kike_eg",
      icon: <FaXTwitter size={24} />,
    },
    {
      title: "Te ayudo a Calcular y Decidir",
      url: "/financial-tools",
      icon: <FaCalculator size={24} />,
    },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-dark-2 flex items-center justify-center p-4 sm:p-6">
      <div
        className={`
          w-full max-w-md bg-white dark:bg-dark-1 rounded-[15px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] p-6 sm:p-8 text-center
          animate-fade-in
          transition-all duration-300 ease-in-out
          hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:border-2 hover:border-primary
        `}
      >
        {/* Encabezado con foto de perfil */}
        <div className="relative mb-6">
          <img
            src={FotoKike}
            alt="Foto de Kike Garcia"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto object-cover border-4 border-primary transition-transform duration-300 hover:scale-105"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-dark dark:text-text-primary mb-3 tracking-tight">
          {personalInfo.name}
        </h1>
        <p className="text-sm sm:text-base text-text-dark dark:text-gray-100 mb-8 leading-relaxed">
          {personalInfo.description}
        </p>

        {/* Lista de enlaces */}
        <div className="space-y-4">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center py-3 px-6 text-text-dark dark:text-text-primary bg-primary rounded-[25px] border-2 border-primary uppercase tracking-wider transition-all duration-300 hover:bg-transparent hover:text-primary hover:scale-105"
            >
              {link.icon && <span className="mr-3">{link.icon}</span>}
              {link.title}
            </a>
          ))}
        </div>

        {/* Pie de página */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-300">
          © {new Date().getFullYear()} {personalInfo.name}
        </p>
      </div>
    </div>
  );
};

export default PersonalLandingPage;
