"use client"

import { useState, useEffect } from "react"

import {
  Truck,
  Plus,
  Search,
  Filter,
  CircleCheck,
  CircleAlert,
  Mail,
  Phone,
  Pencil,
  Trash2,
  X,
} from "lucide-react"

import { api, Fornecedor } from "@/lib/api"

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [modalExcluir, setModalExcluir] = useState<Fornecedor | null>(null)
  const [busca, setBusca] = useState("")
  const [fornecedorEditando, setFornecedorEditando] = useState<Fornecedor | null>(null)

  useEffect(() => {
    carregarFornecedores()
  }, [])

  async function carregarFornecedores() {
    try {
      setLoading(true)
      const response = await api.fornecedores.getAll()
      setFornecedores(Array.isArray(response) ? response : response.data || [])
      console.log("Fornecedores carregados:", response)
      setError(null)
    } catch (err) {
      setError("Erro ao carregar fornecedores")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fornecedoresFiltrados = fornecedores.filter(f =>
    f.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (f.email && f.email.toLowerCase().includes(busca.toLowerCase()))
  )

  const totalFornecedores = fornecedoresFiltrados.length
  const ativos = fornecedoresFiltrados.filter(f => f).length
  const cadastradosHoje = fornecedores.filter(f => new Date(f.createdAt).toDateString() === new Date().toDateString()).length

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

    const dados = {
      nome: formData.get("nome") as string,
      email: formData.get("email") as string,
      telefone: formData.get("telefone") as string,
      contato: formData.get("contato") as string,
    }

    try {
      if (fornecedorEditando) {
        await api.fornecedores.update(fornecedorEditando.id, dados)
      } else {
        await api.fornecedores.create(dados)
      }
      setModalAberto(false)
      setFornecedorEditando(null)
      carregarFornecedores()
    } catch (err) {
      console.error("Erro ao salvar fornecedor:", err)
    }
  }

  async function handleExcluir() {
    if (!modalExcluir) return
    try {
      await api.fornecedores.delete(modalExcluir.id)
      setModalExcluir(null)
      carregarFornecedores()
    } catch (err) {
      console.error("Erro ao excluir:", err)
    }
  }

  function abrirEdicao(fornecedor: Fornecedor) {
    setFornecedorEditando(fornecedor)
    setModalAberto(true)
  }

  return (
    <div className="bg-[#071226] min-h-screen p-6">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Fornecedores
          </h1>

          <p className="text-[#94A3B8] mt-1">
            Gerencie todos os fornecedores da operação
          </p>
        </div>

        <button
          className="bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white px-5 py-3 rounded-xl flex items-center gap-2 font-medium"
          onClick={() => { setFornecedorEditando(null); setModalAberto(true) }}
        >
          <Plus size={20} />
          Novo fornecedor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">
                Total de Fornecedores
              </p>

              <h2 className="text-3xl font-bold text-white mt-2">
                {loading ? "..." : totalFornecedores}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Truck className="text-blue-400" size={22} />
            </div>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">
                Fornecedores Ativos
              </p>

              <h2 className="text-3xl font-bold text-white mt-2">
                {loading ? "..." : ativos}
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
                Cadastrados Hoje
              </p>

              <h2 className="text-3xl font-bold text-white mt-2">
                {loading ? "..." : cadastradosHoje}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <CircleAlert className="text-orange-400" size={22} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-[#334155] flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Lista de Fornecedores
            </h2>

            <p className="text-[#94A3B8] text-sm mt-1">
              Visualize e acompanhe todos os fornecedores ({totalFornecedores} registros)
            </p>
          </div>

          <div className="flex gap-3">
            <div className="bg-[#0F172A] border border-[#334155] rounded-xl px-4 h-11 flex items-center gap-3">
              <Search className="text-[#64748B]" size={18} />

              <input
                type="text"
                placeholder="Buscar fornecedor..."
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
                  Fornecedor
                </th>

                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">
                  Contato
                </th>

                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">
                  Telefone
                </th>

                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">
                  Cadastro
                </th>

                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-5 text-center text-[#64748B]">
                    Carregando...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-5 text-center text-red-400">
                    {error}
                  </td>
                </tr>
              ) : fornecedoresFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-5 text-center text-[#64748B]">
                    Nenhum fornecedor encontrado
                  </td>
                </tr>
              ) : (
                fornecedoresFiltrados.map((fornecedor) => (
                  <tr
                    key={fornecedor.id}
                    className="border-t border-[#334155] hover:bg-[#162033] transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center">
                          <Truck className="text-blue-400" size={20} />
                        </div>

                        <div>
                          <h3 className="text-white font-medium">
                            {fornecedor.nome}
                          </h3>

                          <p className="text-[#64748B] text-sm">
                            ID: {fornecedor.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-[#CBD5E1]">
                      {fornecedor.contato || "-"}
                    </td>

                    <td className="px-6 py-5 text-[#CBD5E1]">
                      {fornecedor.email || "-"}
                    </td>

                    <td className="px-6 py-5 text-[#CBD5E1]">
                      {fornecedor.telefone || "-"}
                    </td>

                    <td className="px-6 py-5 text-[#94A3B8] text-sm">
                      {formatarData(fornecedor.createdAt || "")}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => abrirEdicao(fornecedor)}
                          className="w-8 h-8 rounded-lg bg-[#0F172A] hover:bg-[#162033] flex items-center justify-center text-[#94A3B8] hover:text-blue-400 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setModalExcluir(fornecedor)}
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
                  {fornecedorEditando ? "Editar Fornecedor" : "Novo Fornecedor"}
                </h2>

                <p className="text-[#94A3B8] mt-1">
                  {fornecedorEditando ? "Atualize os dados do fornecedor" : "Cadastre um novo parceiro comercial"}
                </p>
              </div>

              <button
                className="w-10 h-10 rounded-xl bg-[#0F172A] hover:bg-[#162033] transition-colors text-[#CBD5E1]"
                onClick={() => { setModalAberto(false); setFornecedorEditando(null) }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">
                    Nome do fornecedor
                  </label>

                  <input
                    name="nome"
                    type="text"
                    required
                    defaultValue={fornecedorEditando?.nome}
                    placeholder="Ex: Fresh Foods LTDA"
                    className="w-full h-12 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white placeholder:text-[#64748B] outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">
                    Contato
                  </label>

                  <input
                    name="contato"
                    type="text"
                    defaultValue={fornecedorEditando?.contato}
                    placeholder="Nome do contato"
                    className="w-full h-12 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white placeholder:text-[#64748B] outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">
                    Telefone
                  </label>

                  <input
                    name="telefone"
                    type="text"
                    defaultValue={fornecedorEditando?.telefone}
                    placeholder="(88) 99999-9999"
                    className="w-full h-12 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white placeholder:text-[#64748B] outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    required
                    defaultValue={fornecedorEditando?.email}
                    placeholder="contato@empresa.com"
                    className="w-full h-12 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white placeholder:text-[#64748B] outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  className="h-12 px-5 rounded-xl bg-[#0F172A] border border-[#334155] text-[#CBD5E1] hover:bg-[#162033] transition-colors"
                  onClick={() => { setModalAberto(false); setFornecedorEditando(null) }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white font-medium"
                >
                  {fornecedorEditando ? "Salvar Alterações" : "Criar fornecedor"}
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
                Excluir Fornecedor
              </h2>

              <p className="text-[#94A3B8] mb-6">
                Tem certeza que deseja excluir o fornecedor <span className="text-white font-medium">{modalExcluir.nome}</span>? Esta ação não pode ser desfeita.
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
    </div>
  )
}