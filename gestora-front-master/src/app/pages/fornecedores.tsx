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
} from "lucide-react"

import { api, Fornecedor } from "@/lib/api"

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [busca, setBusca] = useState("")

  useEffect(() => {
    carregarFornecedores()
  }, [])

  async function carregarFornecedores() {
    try {
      setLoading(true)
      const response = await api.fornecedores.getAll()
      setFornecedores(response.data || [])
      setError(null)
    } catch (err) {
      setError("Erro ao carregar fornecedores")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fornecedoresFiltrados = fornecedores.filter(f =>
    f.nome.toLowerCase().includes(busca.toLowerCase())
  )

  const totalFornecedores = fornecedoresFiltrados.length
  const ativos = fornecedoresFiltrados.filter(f => f).length
  const requerAtencao = 0

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      await api.fornecedores.create({
        nome: formData.get("nome") as string,
        email: formData.get("email") as string,
        telefone: formData.get("telefone") as string,
        contato: formData.get("contato") as string,
      })
      setModalAberto(false)
      carregarFornecedores()
    } catch (err) {
      console.error("Erro ao criar fornecedor:", err)
    }
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
          onClick={() => setModalAberto(true)}
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
                Requer Atenção
              </p>

              <h2 className="text-3xl font-bold text-white mt-2">
                {loading ? "..." : requerAtencao}
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
              Visualize e acompanhe todos os fornecedores
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
                  Status
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
              ) : fornecedoresFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-5 text-center text-[#64748B]">
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
                          <Truck
                            className="text-blue-400"
                            size={20}
                          />
                        </div>

                        <div>
                          <h3 className="text-white font-medium">
                            {fornecedor.nome}
                          </h3>

                          <p className="text-[#64748B] text-sm">
                            Parceiro comercial
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

                    <td className="px-6 py-5">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400"
                      >
                        Ativo
                      </span>
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
                  Novo Fornecedor
                </h2>

                <p className="text-[#94A3B8] mt-1">
                  Cadastre um novo parceiro comercial
                </p>
              </div>

              <button
                className="w-10 h-10 rounded-xl bg-[#0F172A] hover:bg-[#162033] transition-colors text-[#CBD5E1]"
                onClick={() => setModalAberto(false)}
              >
                ✕
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
                    placeholder="Nome do contato"
                    className="w-full h-12 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white placeholder:text-[#64748B] outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">
                    CNPJ
                  </label>

                  <input
                    name="cnpj"
                    type="text"
                    placeholder="00.000.000/0000-00"
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
                    placeholder="(88) 99999-9999"
                    className="w-full h-12 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white placeholder:text-[#64748B] outline-none focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-[#CBD5E1] block mb-2">
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="contato@empresa.com"
                    className="w-full h-12 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white placeholder:text-[#64748B] outline-none focus:border-blue-500"
                  />
                </div>
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
                  Criar fornecedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}