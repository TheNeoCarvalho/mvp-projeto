"use client"

import { useState, useEffect } from "react"

import {
    Building2,
    Plus,
    Search,
    Filter,
    CircleCheck,
    CircleAlert,
} from "lucide-react"

import { api, Filial } from "@/lib/api"


export default function FiliaisPage() {
    const [filiais, setFiliais] = useState<Filial[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [modalAberto, setModalAberto] = useState(false)
    const [busca, setBusca] = useState("")

    useEffect(() => {
        carregarFiliais()
    }, [])

    async function carregarFiliais() {
        try {
            setLoading(true)
            const response = await api.filiais.getAll()
            setFiliais(response.data || [])
            setError(null)
        } catch (err) {
            setError("Erro ao carregar filiais")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const filiaisFiltradas = filiais.filter(f =>
        f.nome.toLowerCase().includes(busca.toLowerCase())
    )

    const totalFiliais = filiaisFiltradas.length
    const ativas = filiaisFiltradas.filter(f => f).length
    const requerAtencao = 0

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)

        try {
            await api.filiais.create({
                nome: formData.get("nome") as string,
                endereco: formData.get("endereco") as string,
                telefone: formData.get("telefone") as string,
            })
            setModalAberto(false)
            carregarFiliais()
        } catch (err) {
            console.error("Erro ao criar filial:", err)
        }
    }

    return (
        <div className="bg-[#071226] min-h-screen p-6">
            <div className="flex items-center justify-between mb-7">
                <div>
                    <h1 className="text-4xl font-bold text-white">
                        Filiais
                    </h1>

                    <p className="text-[#94A3B8] mt-1">
                        Gerencie todas as filiais da operação
                    </p>
                </div>

                <button
                    className="
            bg-[#2563EB]
            hover:bg-[#1D4ED8]
            transition-colors
            text-white
            px-5 py-3
            rounded-xl
            flex items-center gap-2
            font-medium
          "

                    onClick={() => setModalAberto(true)}
                >
                    <Plus size={20} />
                    Nova filial
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#94A3B8] text-sm">
                                Total de Filiais
                            </p>

                            <h2 className="text-3xl font-bold text-white mt-2">
                                {loading ? "..." : totalFiliais}
                            </h2>
                        </div>

                        <div
                            className="
                w-12 h-12
                rounded-xl
                bg-blue-500/20
                flex items-center justify-center
              "
                        >
                            <Building2
                                className="text-blue-400"
                                size={22}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#94A3B8] text-sm">
                                Filiais Ativas
                            </p>

                            <h2 className="text-3xl font-bold text-white mt-2">
                                {loading ? "..." : ativas}
                            </h2>
                        </div>

                        <div
                            className="
                w-12 h-12
                rounded-xl
                bg-green-500/20
                flex items-center justify-center
              "
                        >
                            <CircleCheck
                                className="text-green-400"
                                size={22}
                            />
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

                        <div
                            className="
                w-12 h-12
                rounded-xl
                bg-orange-500/20
                flex items-center justify-center
              "
                        >
                            <CircleAlert
                                className="text-orange-400"
                                size={22}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden">
                <div
                    className='
            p-5
            border-b border-[#334155]
            flex flex-col xl:flex-row
            gap-4
            xl:items-center
            xl:justify-between
          '
                >
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            Lista de Filiais
                        </h2>

                        <p className="text-[#94A3B8] text-sm mt-1">
                            Visualize e acompanhe todas as unidades
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <div
                            className="
                bg-[#0F172A]
                border border-[#334155]
                rounded-xl
                px-4
                h-11
                flex items-center gap-3
              "
                        >
                            <Search
                                className="text-[#64748B]"
                                size={18}
                            />

                            <input
                                type="text"
                                placeholder="Buscar filial..."
                                className="
                  bg-transparent
                  outline-none
                  text-white
                  placeholder:text-[#64748B]
                "
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                            />
                        </div>

                        <button
                            className="
                h-11
                px-4
                rounded-xl
                bg-[#0F172A]
                border border-[#334155]
                text-[#CBD5E1]
                flex items-center gap-2
              "
                        >
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
                                    Filial
                                </th>

                                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">
                                    Endereço
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
                                    <td colSpan={4} className="px-6 py-5 text-center text-[#64748B]">
                                        Carregando...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-5 text-center text-red-400">
                                        {error}
                                    </td>
                                </tr>
                            ) : filiaisFiltradas.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-5 text-center text-[#64748B]">
                                        Nenhuma filial encontrada
                                    </td>
                                </tr>
                            ) : (
                                filiaisFiltradas.map((filial) => (
                                    <tr
                                        key={filial.id}
                                        className="
                    border-t border-[#334155]
                    hover:bg-[#162033]
                    transition-colors
                  "
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="
                          w-11 h-11
                          rounded-xl
                          bg-blue-500/20
                          flex items-center justify-center
                        "
                                                >
                                                    <Building2
                                                        className="text-blue-400"
                                                        size={20}
                                                    />
                                                </div>

                                                <div>
                                                    <h3 className="text-white font-medium">
                                                        {filial.nome}
                                                    </h3>

                                                    <p className="text-[#64748B] text-sm">
                                                        Unidade operacional
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 text-[#CBD5E1]">
                                            {filial.endereco || "-"}
                                        </td>

                                        <td className="px-6 py-5 text-[#CBD5E1]">
                                            {filial.telefone || "-"}
                                        </td>

                                        <td className="px-6 py-5">
                                            <span
                                                className={`
                            px-3 py-1
                            rounded-full
                            text-sm
                            font-medium
                            bg-green-500/20 text-green-400
                      `}
                                            >
                                                Ativa
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
                <div
                    className="
            fixed inset-0
            bg-black/60
            backdrop-blur-sm
            flex items-center justify-center
            z-50
          "
                >
                    <div
                        className="
      w-full max-w-2xl
      bg-[#1E293B]
      border border-[#334155]
      rounded-3xl
      p-7
    "
                    >
                        <div className="flex items-start justify-between mb-7">
                            <div>
                                <h2 className="text-3xl font-bold text-white">
                                    Nova Filial
                                </h2>

                                <p className="text-[#94A3B8] mt-1">
                                    Cadastre uma nova unidade operacional
                                </p>
                            </div>

                            <button
                                className="
          w-10 h-10
          rounded-xl
          bg-[#0F172A]
          hover:bg-[#162033]
          transition-colors
          text-[#CBD5E1]
        "
                                onClick={() => setModalAberto(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-sm text-[#CBD5E1] block mb-2">
                                        Nome da Filial
                                    </label>

                                    <input
                                        name="nome"
                                        type="text"
                                        required
                                        placeholder="Ex: Unidade Centro"
                                        className="
              w-full h-12
              bg-[#0F172A]
              border border-[#334155]
              rounded-xl
              px-4
              text-white
              placeholder:text-[#64748B]
              outline-none
              focus:border-blue-500
            "
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
                                        className="
              w-full h-12
              bg-[#0F172A]
              border border-[#334155]
              rounded-xl
              px-4
              text-white
              placeholder:text-[#64748B]
              outline-none
              focus:border-blue-500
            "
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-[#CBD5E1] block mb-2">
                                    Endereço
                                </label>

                                <input
                                    name="endereco"
                                    type="text"
                                    placeholder="Rua, número, bairro..."
                                    className="
            w-full h-12
            bg-[#0F172A]
            border border-[#334155]
            rounded-xl
            px-4
            text-white
            placeholder:text-[#64748B]
            outline-none
            focus:border-blue-500
          "
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    className="
            h-12 px-5
            rounded-xl
            bg-[#0F172A]
            border border-[#334155]
            text-[#CBD5E1]
            hover:bg-[#162033]
            transition-colors
          "
                                    onClick={() => setModalAberto(false)}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="
            h-12 px-6
            rounded-xl
            bg-[#2563EB]
            hover:bg-[#1D4ED8]
            transition-colors
            text-white
            font-medium
          "
                                >
                                    Criar Filial
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}