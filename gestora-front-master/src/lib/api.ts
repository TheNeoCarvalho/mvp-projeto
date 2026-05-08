const API_URL = "http://localhost:4000/api";

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  const data = await response.json();
  return data.data || data;
}

export interface Filial {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Fornecedor {
  id: string;
  nome: string;
  contato?: string;
  email: string;
  telefone: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  categoria?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pedido {
  id: string;
  filialId: string;
  status: string;
  itens?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T[];
  meta?: PaginationMeta;
}

export const api = {
  filiais: {
    getAll: (params?: { nome?: string; page?: number; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchAPI<ApiResponse<Filial>>(`/filiais?${query}`);
    },
    getById: (id: string) => fetchAPI<Filial>(`/filiais/${id}`),
    create: (data: Partial<Filial>) =>
      fetchAPI<Filial>("/filiais", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Filial>) =>
      fetchAPI<Filial>(`/filiais/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchAPI<void>(`/filiais/${id}`, { method: "DELETE" }),
  },

  fornecedores: {
    getAll: (params?: { nome?: string; page?: number; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchAPI<ApiResponse<Fornecedor>>(`/fornecedores?${query}`);
    },
    getById: (id: string) => fetchAPI<Fornecedor>(`/fornecedores/${id}`),
    create: (data: Partial<Fornecedor>) =>
      fetchAPI<Fornecedor>("/fornecedores", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Fornecedor>) =>
      fetchAPI<Fornecedor>(`/fornecedores/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchAPI<void>(`/fornecedores/${id}`, { method: "DELETE" }),
  },

  produtos: {
    getAll: (params?: { nome?: string; categoria?: string; page?: number; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchAPI<ApiResponse<Produto>>(`/produtos?${query}`);
    },
    getById: (id: string) => fetchAPI<Produto>(`/produtos/${id}`),
    create: (data: Partial<Produto>) =>
      fetchAPI<Produto>("/produtos", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Produto>) =>
      fetchAPI<Produto>(`/produtos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchAPI<void>(`/produtos/${id}`, { method: "DELETE" }),
  },

  pedidos: {
    getAll: (params?: { filialId?: string; status?: string; page?: number; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchAPI<ApiResponse<Pedido>>(`/pedidos?${query}`);
    },
    getById: (id: string) => fetchAPI<Pedido>(`/pedidos/${id}`),
    create: (data: Partial<Pedido>) =>
      fetchAPI<Pedido>("/pedidos", { method: "POST", body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      fetchAPI<Pedido>(`/pedidos/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
    delete: (id: string) =>
      fetchAPI<void>(`/pedidos/${id}`, { method: "DELETE" }),
  },
};