import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from './axiosInstance'; // Instância configurada para usar o token automaticamente
import '../styles/CadastroVeiculo.css';

function CadastroVeiculo() {
    const { veiculoId } = useParams(); // Identifica se é edição ou cadastro
    const [veiculo, setVeiculo] = useState({
        chassi: '',
        placa: '',
        marca: '',
        modelo: '',
        ano_fabricacao: '',
        cor: '',
        valor: '',
        disponivel_para: 'Ambos', // Valor padrão
        status: 'Disponível', // Valor padrão
    });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false); // Indica se os dados estão carregando

    useEffect(() => {
        if (veiculoId) {
            // Busca os dados do veículo para edição
            const fetchVeiculo = async () => {
                setIsLoading(true);
                try {
                    const response = await api.get(`/veiculos/${veiculoId}`);
                    setVeiculo(response.data);
                } catch (error) {
                    console.error("Erro ao buscar veículo:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchVeiculo();
        }
    }, [veiculoId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVeiculo({ ...veiculo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (veiculoId) {
                // Atualiza o veículo
                await api.put(`/veiculos/${veiculoId}`, veiculo);
                alert('Veículo atualizado com sucesso!');
            } else {
                // Cadastra um novo veículo
                await api.post('/veiculos', veiculo);
                alert('Veículo cadastrado com sucesso!');
            }
            navigate('/veiculos'); // Redireciona para a listagem de veículos
        } catch (error) {
            console.error("Erro ao salvar veículo:", error);
            alert('Erro ao salvar o veículo. Tente novamente.');
        }
    };

    const handleCancel = () => {
        navigate('/veiculos');
    };

    return (
        <div className="cadastro-veiculo-content">
            <h1>{veiculoId ? 'Editar Veículo' : 'Cadastrar Novo Veículo'}</h1>
            {isLoading ? (
                <p>Carregando...</p>
            ) : (
            <form onSubmit={handleSubmit} className="form-cadastro-veiculo">
                <label>Chassi:
                    <input type="text" name="chassi" value={veiculo.chassi} onChange={handleInputChange} required />
                </label>
                <label>Placa:
                    <input type="text" name="placa" value={veiculo.placa} onChange={handleInputChange} required />
                </label>
                <label>Marca:
                    <input type="text" name="marca" value={veiculo.marca} onChange={handleInputChange} required />
                </label>
                <label>Modelo:
                    <input type="text" name="modelo" value={veiculo.modelo} onChange={handleInputChange} required />
                </label>
                <label>Ano de Fabricação:
                    <input type="number" name="ano_fabricacao" value={veiculo.ano_fabricacao} onChange={handleInputChange} required />
                </label>
                <label>Cor:
                    <input type="text" name="cor" value={veiculo.cor} onChange={handleInputChange} />
                </label>
                <label>Valor:
                    <input type="number" step="0.01" name="valor" value={veiculo.valor} onChange={handleInputChange} required />
                </label>
                <label>Disponível Para:
                    <select name="disponivel_para" value={veiculo.disponivel_para} onChange={handleInputChange} required>
                        <option value="">Selecione...</option>
                        <option value="Compra">Compra</option>
                        <option value="Venda">Venda</option>
                        <option value="Ambos">Ambos</option>
                    </select>
                </label>
                <label>Status:
                    <input type="text" name="status" value={veiculo.status} readOnly />
                </label>
                <div className="form-buttons">
                    <button className="btn-save" type="submit">
                        Salvar
                    </button>
                    <button type="button" onClick={handleCancel} className="btn-cancel">
                        Cancelar
                    </button>
                </div>
            </form>
            )}
        </div>
    );
}

export default CadastroVeiculo;
