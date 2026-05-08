import Aside from "../components/aside";
import PedidosPage from "../pages/pedidos";

export default function Filiais() {
  return (
    <div className="h-screen bg-[#071226] flex overflow-hidden">
      {/* SIDEBAR FIXA */}
      <div className="shrink-0">
        <Aside />
      </div>

      {/* CONTEÚDO COM SCROLL */}
      <main className="flex-1 overflow-y-auto">
        <PedidosPage />
      </main>
    </div>
  );
}