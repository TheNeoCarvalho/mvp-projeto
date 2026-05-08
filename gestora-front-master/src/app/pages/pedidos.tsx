"use client"

import { useState, useEffect } from "react"

import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  CircleCheck,
  CircleAlert,
  Clock3,
  Package,
  Pencil,
  Trash2,
  X,
} from "lucide-react"

import { api, Pedido, Filial } from "@/lib/api"

interface PedidoComFilial extends Pedido {
  filial?: Filial
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<PedidoComFilial[]>([])
  const [filiais, setFiliais] = useState<Filial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [modalExcluir, setModalExcluir] = useState<Pedido | null>(null)
  const [modalEditar, setModalEditar] = useState<Pedido | null>(null)
  const [statusEditar, setStatusEditar] = useState("")
  const [busca, setBusca] = useState("")

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      setLoading(true)
      const [pedidosRes, filiaisRes] = await Promise.all([
        api.pedidos.getAll(),
        api.filiais.getAll(),
      ])
      const pedidosArray = Array.isArray(pedidosRes) ? pedidosRes : pedidosRes.data || []
      const filiaisArray = Array.isArray(filiaisRes) ? filiaisRes : filiaisRes.data || []
      const pedidosComFilial = pedidosArray.map(p => ({
        ...p,
        filial: filiaisArray.find(f => f.id === p.filialId)
      }))
      setPedidos(pedidosComFilial)
      setFiliais(filiaisArray)
      console.log("Pedidos carregados:", pedidosComFilial)
      setError(null)
    } catch (err) {
      setError("Erro ao carregar dados")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const pedidosFiltrados = pedidos.filter(p => {
    const buscaLower = busca.toLowerCase()
    const idStr = String(p.id)
    return idStr.includes(buscaLower) || 
           (p.filial?.nome && p.filial.nome.toLowerCase().includes(buscaLower))
  })

  const totalPedidos = pedidosFiltrados.length
  const entregues = pedidosFiltrados.filter(p => p.status === "ENTREGUE").length
  const pendentes = pedidosFiltrados.filter(p => p.status === "PENDENTE").length
  const cadastradosHoje = pedidos.filter(p => new Date(p.createdAt).toDateString() === new Date().toDateString()).length

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      await api.pedidos.create({
        filialId: Number(formData.get("filialId")),
        status: "PENDENTE",
      })
      setModalAberto(false)
      carregarDados()
    } catch (err) {
      console.error("Erro ao criar pedido:", err)
    }
  }

  async function handleExcluir() {
    if (!modalExcluir) return
    try {
      await api.pedidos.delete(modalExcluir.id)
      setModalExcluir(null)
      carregarDados()
    } catch (err) {
      console.error("Erro ao excluir:", err)
    }
  }

  async function handleEditar(e: React.FormEvent) {
    e.preventDefault()
    if (!modalEditar) return
    try {
      await api.pedidos.updateStatus(modalEditar.id, statusEditar)
      setModalEditar(null)
      carregarDados()
    } catch (err) {
      console.error("Erro ao editar:", err)
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ENTREGUE":
        return "Entregue"
      case "PENDENTE":
        return "Pendente"
      case "CANCELADO":
        return "Cancelado"
      default:
        return status || "Pendente"
    }
  }

  const getStatusClass = (status: string) => {
    const s = status?.toUpperCase()
    if (s === "ENTREGUE") return "bg-green-500/20 text-green-400"
    if (s === "PENDENTE") return "bg-yellow-500/20 text-yellow-400"
    return "bg-red-500/20 text-red-400"
  }

  return (
    <div className="bg-[#071226] min-h-screen p-6">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Pedidos
          </h1>

          <p className="text-[#94A3B8] mt-1">
            Gerencie todos os pedidos da operação
          </p>
        </div>

        <button
          className="bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white px-5 py-3 rounded-xl flex items-center gap-2 font-medium"
          onClick={() => setModalAberto(true)}
        >
          <Plus size={20} />
          Novo pedido
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">
                Total de Pedidos
              </p>

              <h2 className="text-3xl font-bold text-white mt-2">
                {loading ? "..." : totalPedidos}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <ClipboardList className="text-blue-400" size={22} />
            </div>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">
                Pedidos Entregues
              </p>

              <h2 className="text-3xl font-bold text-white mt-2">
                {loading ? "..." : entregues}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CircleCheck className="text-green-400" size={22} />
            </div>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">
                Pedidos Pendentes
              </p>

              <h2 className="text-3xl font-bold text-white mt-2">
                {loading ? "..." : pendentes}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Clock3 className="text-orange-400" size={22} />
            </div>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">
                Criados Hoje
              </p>

              <h2 className="text-3xl font-bold text-white mt-2">
                {loading ? "..." : cadastradosHoje}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Package className="text-purple-400" size={22} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-[#334155] flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Lista de Pedidos
            </h2>

            <p className="text-[#94A3B8] text-sm mt-1">
              Visualize e acompanhe todos os pedidos ({totalPedidos} registros)
            </p>
          </div>

          <div className="flex gap-3">
            <div className="bg-[#0F172A] border border-[#334155] rounded-xl px-4 h-11 flex items-center gap-3">
              <Search className="text-[#64748B]" size={18} />

              <input
                type="text"
                placeholder="Buscar pedido..."
                className="bg-transparent outline-none text-white placeholder:text-[#64748B]"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            <button className="h-11 px-4 rounded-xl bg-[#0F172A] border border-[#334155] text-[#CBD5E1] flex items-center gap-2">
              <Filter size={18} />
              Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#162033]">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">
                  Código
                </th>

                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">
                  Filial
                </th>

                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">
                  Data Criação
                </th>

                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-5 text-center text-[#64748B]">
                    Carregando...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-5 text-center text-red-400">
                    {error}
                  </td>
                </tr>
              ) : pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-5 text-center text-[#64748B]">
                    Nenhum pedido encontrado
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map((pedido) => (
                  <tr
                    key={pedido.id}
                    className="border-t border-[#334155] hover:bg-[#162033] transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                          <Package className="text-blue-400" size={18} />
                        </div>

                        <div>
                          <h3 className="text-white font-medium">
                            #{String(pedido.id).slice(0, 8).toUpperCase()}
                          </h3>

                          <p className="text-[#64748B] text-sm">
                            ID: {pedido.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-[#CBD5E1]">
                      {pedido.filial?.nome || `Filial #${pedido.filialId}`}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(pedido.status)}`}
                      >
                        {getStatusLabel(pedido.status)}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-[#94A3B8] text-sm">
                      {formatarData(pedido.createdAt || "")}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          className="w-8 h-8 rounded-lg bg-[#0F172A] hover:bg-[#162033] flex items-center justify-center text-[#94A3B8] hover:text-blue-400 transition-colors"
                          onClick={() => {
                            setModalEditar(pedido)
                            setStatusEditar(pedido.status)
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setModalExcluir(pedido)}
                          className="w-8 h-8 rounded-lg bg-[#0F172A] hover:bg-[#162033] flex items-center justify-center text-[#94A3B8] hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-2xl bg-[#1E293B] border border-[#334155] rounded-3xl p-7">
            <div className="flex items-start justify-between mb-7">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Novo Pedido
                </h2>

                <p className="text-[#94A3B8] mt-1">
                  Crie um novo pedido operacional
                </p>
              </div>

              <button
                className="w-10 h-10 rounded-xl bg-[#0F172A] hover:bg-[#162033] transition-colors text-[#CBD5E1]"
                onClick={() => setModalAberto(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm text-[#CBD5E1] block mb-2">
                  Filial
                </label>

                <select
                  name="filialId"
                  required
                  className="w-full h-12 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white outline-none focus:border-blue-500"
                >
                  <option value="">Selecionar filial</option>
                  {filiais.map((filial) => (
                    <option key={filial.id} value={filial.id}>
                      {filial.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-[#CBD5E1] block mb-2">
                  Observações
                </label>

                <textarea
                  name="observacoes"
                  placeholder="Informações adicionais sobre o pedido..."
                  className="w-full h-32 resize-none bg-[#0F172A] border border-[#334155] rounded-xl p-4 text-white placeholder:text-[#64748B] outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  className="h-12 px-5 rounded-xl bg-[#0F172A] border border-[#334155] text-[#CBD5E1] hover:bg-[#162033] transition-colors"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white font-medium"
                >
                  Criar pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalExcluir && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-3xl p-7">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-400" size={32} />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Excluir Pedido
              </h2>

              <p className="text-[#94A3B8] mb-6">
                Tem certeza que deseja excluir o pedido <span className="text-white font-medium">#{String(modalExcluir.id).slice(0, 8).toUpperCase()}</span>? Esta ação não pode ser desfeita.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  className="h-12 px-6 rounded-xl bg-[#0F172A] border border-[#334155] text-[#CBD5E1] hover:bg-[#162033] transition-colors"
                  onClick={() => setModalExcluir(null)}
                >
                  Cancelar
                </button>

                <button
                  className="h-12 px-6 rounded-xl bg-red-500 hover:bg-red-600 transition-colors text-white font-medium"
                  onClick={handleExcluir}
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalEditar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-3xl p-7">
            <div className="flex items-start justify-between mb-7">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Editar Pedido
                </h2>
                <p className="text-[#94A3B8] mt-1">
                  Altere o status do pedido
                </p>
              </div>
              <button
                className="w-10 h-10 rounded-xl bg-[#0F172A] hover:bg-[#162033] transition-colors text-[#CBD5E1]"
                onClick={() => setModalEditar(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditar}>
              <div className="mb-5">
                <label className="text-sm text-[#CBD5E1] block mb-2">
                  Status
                </label>
                <select
                  value={statusEditar}
                  onChange={(e) => setStatusEditar(e.target.value)}
                  className="w-full h-12 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white outline-none focus:border-blue-500"
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="CONFIRMADO">Confirmado</option>
                  <option value="PREPARANDO">Preparando</option>
                  <option value="ENTREGUE">Entregue</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="h-12 px-5 rounded-xl bg-[#0F172A] border border-[#334155] text-[#CBD5E1] hover:bg-[#162033] transition-colors"
                  onClick={() => setModalEditar(null)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white font-medium"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}