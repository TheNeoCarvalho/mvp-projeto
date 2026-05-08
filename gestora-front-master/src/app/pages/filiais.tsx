"use client"

import { useState, useEffect } from "react"

import {
    Building2,
    Plus,
    Search,
    Filter,
    CircleCheck,
    CircleAlert,
    Pencil,
    Trash2,
    X,
} from "lucide-react"

import { api, Filial } from "@/lib/api"


export default function FiliaisPage() {
    const [filiais, setFiliais] = useState<Filial[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [modalAberto, setModalAberto] = useState(false)
    const [modalExcluir, setModalExcluir] = useState<Filial | null>(null)
    const [busca, setBusca] = useState("")
    const [filialEditando, setFilialEditando] = useState<Filial | null>(null)

    useEffect(() => {
        carregarFiliais()
    }, [])

    async function carregarFiliais() {
        try {
            setLoading(true)
            console.log("Iniciando carregamento...")
            const response = await api.filiais.getAll()
            console.log("Resposta da API:", response)
            console.log("É array?", Array.isArray(response))
            
            const dados = Array.isArray(response) ? response : (response.data || [])
            console.log("Dados a salvar:", dados)
            
            setFiliais(dados)
            console.log("filiais state atualizado:", dados.length)
            setError(null)
        } catch (err) {
            setError("Erro ao carregar filiais: " + (err instanceof Error ? err.message : String(err)))
            console.error("ERRO:", err)
        } finally {
            setLoading(false)
        }
    }

    const filiaisFiltradas = filiais.filter(f =>
        f.nome.toLowerCase().includes(busca.toLowerCase()) ||
        (f.endereco && f.endereco.toLowerCase().includes(busca.toLowerCase()))
    )

    const totalFiliais = filiaisFiltradas.length
    const ativas = filiaisFiltradas.filter(f => f).length

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
            endereco: formData.get("endereco") as string,
            telefone: formData.get("telefone") as string,
        }

        try {
            if (filialEditando) {
                await api.filiais.update(filialEditando.id, dados)
            } else {
                await api.filiais.create(dados)
            }
            setModalAberto(false)
            setFilialEditando(null)
            carregarFiliais()
        } catch (err) {
            console.error("Erro ao salvar filial:", err)
        }
    }

    async function handleExcluir() {
        if (!modalExcluir) return
        try {
            await api.filiais.delete(modalExcluir.id)
            setModalExcluir(null)
            carregarFiliais()
        } catch (err) {
            console.error("Erro ao excluir:", err)
        }
    }

    function abrirEdicao(filial: Filial) {
        setFilialEditando(filial)
        setModalAberto(true)
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
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white px-5 py-3 rounded-xl flex items-center gap-2 font-medium"
                    onClick={() => { setFilialEditando(null); setModalAberto(true) }}
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

                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Building2 className="text-blue-400" size={22} />
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

                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <CircleCheck className="text-green-400" size={22} />
                        </div>
                    </div>
                </div>

                <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#94A3B8] text-sm">
                                Cadastradas Hoje
                            </p>

                            <h2 className="text-3xl font-bold text-white mt-2">
                                {loading ? "..." : filiais.filter(f => new Date(f.createdAt).toDateString() === new Date().toDateString()).length}
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
                            Lista de Filiais
                        </h2>

                        <p className="text-[#94A3B8] text-sm mt-1">
                            Visualize e acompanhe todas as unidades ({totalFiliais} registros)
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <div className="bg-[#0F172A] border border-[#334155] rounded-xl px-4 h-11 flex items-center gap-3">
                            <Search className="text-[#64748B]" size={18} />

                            <input
                                type="text"
                                placeholder="Buscar filial..."
                                className="bg-transparent outline-none text-white placeholder:text-[#64748B]"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                            />
                        </div>

                        <button 
                            onClick={carregarFiliais}
                            className="h-11 px-4 rounded-xl bg-[#0F172A] border border-[#334155] text-[#CBD5E1] flex items-center gap-2 hover:bg-[#162033]"
                        >
                            <Filter size={18} />
                            Atualizar
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
                            ) : filiaisFiltradas.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-5 text-center text-[#64748B]">
                                        Nenhuma filial encontrada
                                    </td>
                                </tr>
                            ) : (
                                filiaisFiltradas.map((filial) => (
                                    <tr
                                        key={filial.id}
                                        className="border-t border-[#334155] hover:bg-[#162033] transition-colors"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                                    <Building2 className="text-blue-400" size={20} />
                                                </div>

                                                <div>
                                                    <h3 className="text-white font-medium">
                                                        {filial.nome}
                                                    </h3>

                                                    <p className="text-[#64748B] text-sm">
                                                        ID: {filial.id}
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

                                        <td className="px-6 py-5 text-[#94A3B8] text-sm">
                                            {formatarData(filial.createdAt || "")}
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => abrirEdicao(filial)}
                                                    className="w-8 h-8 rounded-lg bg-[#0F172A] hover:bg-[#162033] flex items-center justify-center text-[#94A3B8] hover:text-blue-400 transition-colors"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setModalExcluir(filial)}
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
                                    {filialEditando ? "Editar Filial" : "Nova Filial"}
                                </h2>

                                <p className="text-[#94A3B8] mt-1">
                                    {filialEditando ? "Atualize os dados da filial" : "Cadastre uma nova unidade operacional"}
                                </p>
                            </div>

                            <button
                                className="w-10 h-10 rounded-xl bg-[#0F172A] hover:bg-[#162033] transition-colors text-[#CBD5E1]"
                                onClick={() => { setModalAberto(false); setFilialEditando(null) }}
                            >
                                <X size={20} />
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
                                        defaultValue={filialEditando?.nome}
                                        placeholder="Ex: Unidade Centro"
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
                                        defaultValue={filialEditando?.telefone}
                                        placeholder="(88) 99999-9999"
                                        className="w-full h-12 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white placeholder:text-[#64748B] outline-none focus:border-blue-500"
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
                                    defaultValue={filialEditando?.endereco}
                                    placeholder="Rua, número, bairro..."
                                    className="w-full h-12 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white placeholder:text-[#64748B] outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    className="h-12 px-5 rounded-xl bg-[#0F172A] border border-[#334155] text-[#CBD5E1] hover:bg-[#162033] transition-colors"
                                    onClick={() => { setModalAberto(false); setFilialEditando(null) }}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="h-12 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white font-medium"
                                >
                                    {filialEditando ? "Salvar Alterações" : "Criar Filial"}
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
                                Excluir Filial
                            </h2>

                            <p className="text-[#94A3B8] mb-6">
                                Tem certeza que deseja excluir a filial <span className="text-white font-medium">{modalExcluir.nome}</span>? Esta ação não pode ser desfeita.
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