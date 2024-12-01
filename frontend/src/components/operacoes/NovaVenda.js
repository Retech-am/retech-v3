import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosInstance';
import '../../styles/NovaVenda.css';

function NovaVenda() {
    const [clientes, setClientes] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    const [formData, setFormData] = useState({
        cliente_id: '',
        veiculo_id: '',
        vendedor_id: '',
        valor_entrada: '',
        valor_financiado: '',
        valor_total: '',
        data: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Você precisa estar logado para acessar esta página.');
                    navigate('/login');
                    return;
                }

                const clientesResponse = await api.get('/clientes', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const veiculosResponse = await api.get('/veiculos/disponiveis?para=venda', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const vendedoresResponse = await api.get('/vendedores', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setClientes(clientesResponse.data);
                setVeiculos(veiculosResponse.data);
                setVendedores(vendedoresResponse.data);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                alert('Erro ao carregar dados. Verifique suas permissões.');
            }
        };

        fetchData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        if (name === 'veiculo_id') {
            const veiculoSelecionado = veiculos.find((v) => v.veiculoId === parseInt(value));
            if (veiculoSelecionado) {
                setFormData((prevData) => ({
                    ...prevData,
                    valor_total: veiculoSelecionado.valor,
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const valorEntrada = parseFloat(formData.valor_entrada || 0);
        const valorFinanciado = parseFloat(formData.valor_financiado || 0);
        const valorTotal = parseFloat(formData.valor_total || 0);

        if (valorEntrada + valorFinanciado !== valorTotal) {
            setErrorMessage(
                `A soma do valor de entrada e do valor financiado deve ser igual ao valor total de R$ ${valorTotal.toFixed(
                    2
                )}.`
            );
            return;
        }

        setErrorMessage('');

        try {
            const token = localStorage.getItem('token');

            await api.post('/vendas', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            await api.put(
                `/veiculos/atualizar-status/${formData.veiculo_id}`,
                { status: 'vendido', disponivelPara: 'nenhum' },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert('Venda registrada com sucesso!');
            navigate('/operacoes/vendas');
        } catch (error) {
            console.error('Erro ao registrar venda:', error);
            alert('Erro ao registrar venda. Tente novamente.');
        }
    };

    const handleCancel = () => {
        navigate('/operacoes/vendas');
    };

    return (
        <div className="nova-venda-content">
            <h1>Registrar Nova Venda</h1>
            <form onSubmit={handleSubmit}>
                {errorMessage && <p className="error-message">{errorMessage}</p>}

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

                <label htmlFor="veiculo_id">Veículo:</label>
                <select
                    id="veiculo_id"
                    name="veiculo_id"
                    value={formData.veiculo_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecione um veículo</option>
                    {veiculos.map((veiculo) => (
                        <option key={veiculo.veiculoId} value={veiculo.veiculoId}>
                            {veiculo.modelo} - {veiculo.placa}
                        </option>
                    ))}
                </select>

                <label htmlFor="vendedor_id">Vendedor:</label>
                <select
                    id="vendedor_id"
                    name="vendedor_id"
                    value={formData.vendedor_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecione um vendedor</option>
                    {vendedores.map((vendedor) => (
                        <option key={vendedor.vendedorId} value={vendedor.vendedorId}>
                            {vendedor.nome}
                        </option>
                    ))}
                </select>

                <label htmlFor="valor_entrada">Valor de Entrada:</label>
                <input
                    type="number"
                    id="valor_entrada"
                    name="valor_entrada"
                    value={formData.valor_entrada}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="valor_financiado">Valor Financiado:</label>
                <input
                    type="number"
                    id="valor_financiado"
                    name="valor_financiado"
                    value={formData.valor_financiado}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="valor_total">Valor Total:</label>
                <input
                    type="number"
                    id="valor_total"
                    name="valor_total"
                    value={formData.valor_total}
                    readOnly
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
                    <button type="submit" className="btn-submit-venda">
                        Registrar Venda
                    </button>
                    <button type="button" onClick={handleCancel} className="btn-cancel">
                        Cancelar Venda
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NovaVenda;
