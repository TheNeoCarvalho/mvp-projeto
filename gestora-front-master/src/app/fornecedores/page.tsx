import Aside from "../components/aside";
import FornecedoresPage from "../pages/fornecedores";

export default function Filiais() {
  return (
    <div className="h-screen bg-[#071226] flex overflow-hidden">
      {/* SIDEBAR FIXA */}
      <div className="shrink-0">
        <Aside />
      </div>

      {/* CONTEÚDO COM SCROLL */}
      <main className="flex-1 overflow-y-auto">
        <FornecedoresPage />
      </main>
    </div>
  );
}