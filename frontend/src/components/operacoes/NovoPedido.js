import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosInstance';
import '../../styles/NovoPedido.css';

function NovoPedido() {
    const [clientes, setClientes] = useState([]);
    const [montadoras, setMontadoras] = useState([]);
    const [formData, setFormData] = useState({
        cliente_id: '',
        montadora_id: '',
        modelo: '',
        ano: '',
        cor: '',
        acessorios: '',
        valor: '',
        status: 'pendente', // Status inicial padrão
        data: '',
    });

    const navigate = useNavigate();

    // Fetch de clientes e montadoras
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Você precisa estar logado para acessar esta página.');
                    navigate('/login');
                    return;
                }

                // Fetch de clientes
                const clientesResponse = await api.get('/clientes', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Fetch de montadoras
                const montadorasResponse = await api.get('/montadoras', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setClientes(clientesResponse.data);
                setMontadoras(montadorasResponse.data);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                alert('Erro ao carregar dados. Verifique suas permissões.');
            }
        };

        fetchData();
    }, [navigate]);

    // Atualiza os dados do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Envia os dados do formulário para o backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.post('/pedidos', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Pedido registrado com sucesso!');
            navigate('/operacoes/pedidos');
        } catch (error) {
            console.error('Erro ao registrar pedido:', error);
            alert('Erro ao registrar pedido. Tente novamente.');
        }
    };

    const handleCancel = () => {
        navigate('/operacoes/pedidos');
    };

    return (
        <div className="novo-pedido-content">
            <h1>Registrar Novo Pedido</h1>
            <form onSubmit={handleSubmit}>
                {/* Seleção do cliente */}
                <label htmlFor="cliente_id">Cliente:</label>
                <select
                    id="cliente_id"
                    name="cliente_id"
                    value={formData.cliente_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecione um cliente</option>
                    {clientes.map((cliente) => (
                        <option key={cliente.clienteId} value={cliente.clienteId}>
                            {cliente.nome}
                        </option>
                    ))}
                </select>

                {/* Seleção da montadora */}
                <label htmlFor="montadora_id">Montadora:</label>
                <select
                    id="montadora_id"
                    name="montadora_id"
                    value={formData.montadora_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecione uma montadora</option>
                    {montadoras.map((montadora) => (
                        <option key={montadora.montadoraId} value={montadora.montadoraId}>
                            {montadora.razao_social}
                        </option>
                    ))}
                </select>

                {/* Campos adicionais */}
                <label htmlFor="modelo">Modelo:</label>
                <input
                    type="text"
                    id="modelo"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="ano">Ano:</label>
                <input
                    type="number"
                    id="ano"
                    name="ano"
                    value={formData.ano}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="cor">Cor:</label>
                <input
                    type="text"
                    id="cor"
                    name="cor"
                    value={formData.cor}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="acessorios">Acessórios:</label>
                <textarea
                    id="acessorios"
                    name="acessorios"
                    value={formData.acessorios}
                    onChange={handleChange}
                />

                <label htmlFor="valor">Valor:</label>
                <input
                    type="number"
                    id="valor"
                    name="valor"
                    value={formData.valor}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="data">Data:</label>
                <input
                    type="date"
                    id="data"
                    name="data"
                    value={formData.data}
                    onChange={handleChange}
                    required
                />

                <div className="form-buttons">
                    <button type="submit" className="btn-submit-pedido">
                        Registrar Pedido
                    </button>
                    <button type="button" onClick={handleCancel} className="btn-cancel">
                        Cancelar Pedido
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NovoPedido;
