import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './axiosInstance';
import '../styles/CadastroVeiculo.css';

function EditarVeiculo() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        chassi: '',
        placa: '',
        marca: '',
        modelo: '',
        ano_fabricacao: '',
        cor: '',
        valor: '',
        disponivel_para: '', // Adicionado
        status: '', // Adicionado
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await api.get(`/veiculos/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error("Erro ao buscar veículo:", error);
            }
        };

        fetchVehicle();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/veiculos/${id}`, formData);
            alert('Veículo atualizado com sucesso!');
            navigate('/veiculos');
        } catch (error) {
            console.error('Erro ao atualizar veículo:', error);
            alert('Erro ao atualizar veículo. Tente novamente.');
        }
    };

    const handleCancel = () => {
        navigate('/veiculos');
    };

    return (
        <div className="editar-veiculo-content">
            <h1>Editar Veículo</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="chassi">Chassi:</label>
                <input
                    type="text"
                    id="chassi"
                    name="chassi"
                    value={formData.chassi}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="placa">Placa:</label>
                <input
                    type="text"
                    id="placa"
                    name="placa"
                    value={formData.placa}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="marca">Marca:</label>
                <input
                    type="text"
                    id="marca"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="modelo">Modelo:</label>
                <input
                    type="text"
                    id="modelo"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="ano_fabricacao">Ano de Fabricação:</label>
                <input
                    type="number"
                    id="ano_fabricacao"
                    name="ano_fabricacao"
                    value={formData.ano_fabricacao}
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

                <label htmlFor="valor">Valor:</label>
                <input
                    type="number"
                    id="valor"
                    name="valor"
                    value={formData.valor}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="disponivel_para">Disponível Para:</label>
                <select
                    id="disponivel_para"
                    name="disponivel_para"
                    value={formData.disponivel_para}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecione...</option>
                    <option value="Compra">Compra</option>
                    <option value="Venda">Venda</option>
                    <option value="Ambos">Ambos</option>
                </select>

                <label htmlFor="status">Status:</label>
                <input
                    type="text"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    readOnly
                />

                <div className="form-buttons">
                    <button className="btn-save" type="submit">
                        Salvar
                    </button>
                    <button type="button" onClick={handleCancel} className="btn-cancel">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditarVeiculo;
