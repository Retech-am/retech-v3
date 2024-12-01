import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './axiosInstance'; // Importa o axiosInstance
import '../styles/Veiculos.css';

function Veiculos() {
    const [veiculos, setVeiculos] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Termo de busca
    const [selectedVehicles, setSelectedVehicles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVeiculos = async () => {
            try {
                const response = await api.get('/veiculos', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }); // Usando o axiosInstance
                const sortedVehicles = response.data.sort((a, b) => 
                    a.marca.localeCompare(b.marca) || a.modelo.localeCompare(b.modelo)
                );
                setVeiculos(sortedVehicles);
            } catch (error) {
                console.error("Erro ao buscar veículos:", error);
            }
        };

        fetchVeiculos();
    }, []);

    // Lida com a seleção de checkboxes
    const handleSelectVehicle = (vehicleId) => {
        setSelectedVehicles((prevSelected) => {
            if (prevSelected.includes(vehicleId)) {
                return prevSelected.filter(veiculoId => veiculoId !== vehicleId);
            } else {
                return [...prevSelected, vehicleId];
            }
        });
    };

    // Lida com a busca
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtra veículos com base no termo de busca
    const filteredVeiculos = veiculos.filter(veiculo =>
        veiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Redireciona para a página de edição de veículo
    const handleEditVehicle = () => {
        if (selectedVehicles.length === 1) {
            navigate(`/veiculos/editar/${selectedVehicles[0]}`); // Direciona para a rota de edição com o ID do veículo
        } else {
            alert("Por favor, selecione um único veículo para editar.");
        }
    };

    // Deleta os veículos selecionados
    const handleDeleteVehicles = async () => {
        try {
            await Promise.all(
                selectedVehicles.map(veiculoId =>
                    api.delete(`/veiculos/${veiculoId}`) // Usando o axiosInstance
                )
            );
            setVeiculos(veiculos.filter(veiculo => !selectedVehicles.includes(veiculo.veiculoId)));
            setSelectedVehicles([]);
        } catch (error) {
            console.error("Erro ao deletar veículos:", error);
            if (error.response && error.response.status === 403) {
                alert("Acesso negado: apenas gerentes podem realizar esta ação.");
            } else if (error.response && error.response.status === 401) {
                alert("Sessão expirada. Faça login novamente.");
                navigate('/login');
            } else {
                alert("Erro ao deletar veículos. Tente novamente.");
            }
        }
    };

    return (
        <div className="veiculos-content">
            <h1>Veículos</h1>
            <p>Gerenciamento de veículos cadastrados.</p>
            
            {/* Barra de Pesquisa */}
            <input
                type="text"
                placeholder="Pesquisar por Marca ou Modelo"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
            />
            
            {/* Botões de ação */}
            <button onClick={() => navigate('/veiculos/cadastro')} className="btn-cadastrar-veiculo action-button">
                Cadastrar Novo Veículo
            </button>
            <button
                onClick={handleEditVehicle}
                disabled={selectedVehicles.length !== 1}
                className="btn-editar-veiculo action-button"
            >
                Editar Cadastro
            </button>
            <button
                onClick={handleDeleteVehicles}
                disabled={selectedVehicles.length === 0}
                className="btn-deletar-veiculo action-button"
            >
                Deletar
            </button>

            {/* Tabela de veículos cadastrados */}
            {filteredVeiculos.length > 0 ? (
                <table className="veiculos-table">
                    <thead>
                        <tr>
                            <th></th> {/* Coluna para os checkboxes */}
                            <th>Chassi</th>
                            <th>Placa</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Ano de Fabricação</th>
                            <th>Cor</th>
                            <th>Valor</th>
                            <th>Status</th>
                            <th>Disponível Para</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVeiculos.map((veiculo) => (
                            <tr key={veiculo.veiculoId}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedVehicles.includes(veiculo.veiculoId)}
                                        onChange={() => handleSelectVehicle(veiculo.veiculoId)}
                                    />
                                </td>
                                <td>{veiculo.chassi}</td>
                                <td>{veiculo.placa}</td>
                                <td>{veiculo.marca}</td>
                                <td>{veiculo.modelo}</td>
                                <td>{veiculo.ano_fabricacao}</td>
                                <td>{veiculo.cor}</td>
                                <td>{veiculo.valor}</td>
                                <td>{veiculo.status}</td>
                                <td>{veiculo.disponivel_para}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Nenhum veículo encontrado.</p>
            )}
        </div>
    );
}

export default Veiculos;
