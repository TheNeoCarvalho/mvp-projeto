"use client"

import GraficoReceita from "../components/grafico-receita"

import {
    DollarSign,
    ShoppingCart,
    Building2,
    TriangleAlert,
    Package,
    CheckCircle2,
    Clock3,
} from "lucide-react"

const cards = [
    {
        titulo: "Receita Total",
        valor: "R$125.480",
        descricao: "vs semana passada",
        crescimento: "+12.5%",
        icon: DollarSign,
        corIcone: "bg-blue-500/20 text-blue-400",
        corCrescimento: "text-green-400",
    },
    {
        titulo: "Pedidos Hoje",
        valor: "47",
        descricao: "8 pendentes",
        crescimento: "+18.2%",
        icon: ShoppingCart,
        corIcone: "bg-green-500/20 text-green-400",
        corCrescimento: "text-green-400",
    },
    {
        titulo: "Filiais Ativas",
        valor: "12",
        descricao: "1 nova este mês",
        crescimento: "+2",
        icon: Building2,
        corIcone: "bg-purple-500/20 text-purple-400",
        corCrescimento: "text-green-400",
    },
    {
        titulo: "Alertas de Estoque",
        valor: "8",
        descricao: "4 críticos",
        crescimento: "+3",
        icon: TriangleAlert,
        corIcone: "bg-orange-500/20 text-orange-400",
        corCrescimento: "text-red-400",
    },
]

export default function DashboardPage() {
    return (
        <div className="bg-[#071226] min-h-screen p-6">
            {/* HEADER */}
            <div className="flex items-start justify-between mb-7">
                <div>
                    <h1 className="text-4xl font-bold text-white">
                        Dashboard
                    </h1>

                    <p className="text-[#94A3B8] mt-1">
                        Bem-vindo de volta, veja o que está acontecendo hoje
                    </p>
                </div>

                <p className="text-[#94A3B8] text-sm">
                    Última atualização: 20:36:00
                </p>
            </div>

            {/* TOP CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {cards.map((card) => {
                    const Icon = card.icon

                    return (
                        <div
                            key={card.titulo}
                            className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5"
                        >
                            <div className="flex items-start justify-between">
                                <div
                                    className={`
                    w-12 h-12
                    rounded-xl
                    flex items-center justify-center
                    ${card.corIcone}
                  `}
                                >
                                    <Icon size={22} />
                                </div>

                                <span
                                    className={`
                    text-sm font-semibold
                    ${card.corCrescimento}
                  `}
                                >
                                    {card.crescimento}
                                </span>
                            </div>

                            <div className="mt-5">
                                <p className="text-[#CBD5E1] text-sm">
                                    {card.titulo}
                                </p>

                                <h2 className="text-3xl font-bold text-white mt-2">
                                    {card.valor}
                                </h2>

                                <p className="text-[#64748B] text-sm mt-1">
                                    {card.descricao}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* SECOND ROW */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
                {/* CHART */}
                <div
                    className="
            xl:col-span-2
            bg-[#1E293B]
            border border-[#334155]
            rounded-2xl
            p-6
            h-[420px]
          "
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                Receita & Pedidos
                            </h2>

                            <p className="text-[#94A3B8] mt-1 text-sm">
                                Desempenho dos últimos 7 dias
                            </p>
                        </div>

                        <select
                            className="
                bg-[#0F172A]
                border border-[#334155]
                text-white
                px-4 py-2
                rounded-xl
                outline-none
              "
                        >
                            <option>Últimos 7 dias</option>
                        </select>
                    </div>

                    <div className="mt-8">
                        <GraficoReceita />
                    </div>
                </div>

                {/* RECENT ACTIVITY */}
                <div
                    className="
            bg-[#1E293B]
            border border-[#334155]
            rounded-2xl
            p-6
          "
                >
                    <h2 className="text-2xl font-bold text-white">
                        Atividade Recente
                    </h2>

                    <div className="space-y-6 mt-7">
                        {[
                            {
                                titulo: "Novo pedido aprovado",
                                descricao: "REQ-2847 da filial Centro",
                                tempo: "5 min atrás",
                                icon: CheckCircle2,
                                cor: "text-green-400",
                            },
                            {
                                titulo: "Alerta de estoque",
                                descricao: "Estoque baixo: Tomates",
                                tempo: "15 min atrás",
                                icon: TriangleAlert,
                                cor: "text-orange-400",
                            },
                            {
                                titulo: "Fornecedor atualizado",
                                descricao: "Dados da Fresh Farm Foods alterados",
                                tempo: "3 hrs atrás",
                                icon: Clock3,
                                cor: "text-blue-400",
                            },
                        ].map((item) => {
                            const Icon = item.icon

                            return (
                                <div
                                    key={item.titulo}
                                    className="flex gap-4"
                                >
                                    <Icon
                                        className={item.cor}
                                        size={22}
                                    />

                                    <div>
                                        <h3 className="text-white font-medium">
                                            {item.titulo}
                                        </h3>

                                        <p className="text-[#94A3B8] text-sm mt-1">
                                            {item.descricao}
                                        </p>

                                        <span className="text-[#64748B] text-xs">
                                            {item.tempo}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* THIRD ROW */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
                {/* BRANCH TABLE */}
                <div
                    className="
            xl:col-span-2
            bg-[#1E293B]
            border border-[#334155]
            rounded-2xl
            overflow-hidden
          "
                >
                    <div className="p-5 border-b border-[#334155]">
                        <h2 className="text-2xl font-bold text-white">
                            Desempenho das Filiais
                        </h2>
                    </div>

                    <table className="w-full">
                        <thead className="bg-[#162033]">
                            <tr>
                                <th className="px-5 py-4 text-left text-sm text-[#94A3B8]">
                                    Filial
                                </th>

                                <th className="px-5 py-4 text-left text-sm text-[#94A3B8]">
                                    Receita
                                </th>

                                <th className="px-5 py-4 text-left text-sm text-[#94A3B8]">
                                    Pedidos
                                </th>

                                <th className="px-5 py-4 text-left text-sm text-[#94A3B8]">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {[
                                {
                                    nome: "Centro",
                                    revenue: "R$45.280",
                                    orders: 234,
                                    status: "Excelente",
                                },
                                {
                                    nome: "Northgate",
                                    revenue: "R$42.150",
                                    orders: 218,
                                    status: "Bom",
                                },
                                {
                                    nome: "Westside",
                                    revenue: "R$38.920",
                                    orders: 195,
                                    status: "Médio",
                                },
                            ].map((filial) => (
                                <tr
                                    key={filial.nome}
                                    className="border-t border-[#334155]"
                                >
                                    <td className="px-5 py-4 text-white font-medium">
                                        {filial.nome}
                                    </td>

                                    <td className="px-5 py-4 text-[#CBD5E1]">
                                        {filial.revenue}
                                    </td>

                                    <td className="px-5 py-4 text-[#CBD5E1]">
                                        {filial.orders}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className="
                        bg-green-500/20
                        text-green-400
                        px-3 py-1
                        rounded-full
                        text-sm
                      "
                                        >
                                            {filial.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ALERTS */}
                <div
                    className="
            bg-[#1E293B]
            border border-[#334155]
            rounded-2xl
            p-5
          "
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                Alertas de Estoque
                            </h2>

                            <p className="text-[#94A3B8] text-sm mt-1">
                                Itens abaixo do limite
                            </p>
                        </div>

                        <TriangleAlert
                            className="text-orange-400"
                            size={22}
                        />
                    </div>

                    <div className="space-y-4 mt-6">
                        {[
                            "Tomates",
                            "Peito de Frango",
                            "Queijo",
                        ].map((item) => (
                            <div
                                key={item}
                                className="
                  bg-[#162033]
                  rounded-xl
                  p-4
                  flex items-center justify-between
                "
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="
                      w-10 h-10
                      rounded-lg
                      bg-orange-500/20
                      flex items-center justify-center
                    "
                                    >
                                        <Package
                                            className="text-orange-400"
                                            size={18}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-white font-medium">
                                            {item}
                                        </h3>

                                        <p className="text-[#94A3B8] text-sm">
                                            Centro
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className="
                    bg-red-500/20
                    text-red-400
                    px-2 py-1
                    rounded-full
                    text-xs
                  "
                                >
                                    alto
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}