import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './axiosInstance'; // Substituímos axios por a instância configurada
import '../styles/Montadoras.css';

function Montadoras() {
    const [montadoras, setMontadoras] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Termo de busca
    const [selectedManufacturers, setSelectedManufacturers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMontadoras = async () => {
            try {
                const response = await api.get('/montadoras');
                const sortedManufacturers = response.data.sort((a, b) => a.razao_social.localeCompare(b.razao_social));
                setMontadoras(sortedManufacturers);
            } catch (error) {
                console.error("Erro ao buscar montadoras:", error);
            }
        };

        fetchMontadoras();
    }, []);

    // Lida com a seleção de checkboxes
    const handleSelectManufacturer = (manufacturerId) => {
        setSelectedManufacturers((prevSelected) => {
            if (prevSelected.includes(manufacturerId)) {
                return prevSelected.filter(montadoraId => montadoraId !== manufacturerId);
            } else {
                return [...prevSelected, manufacturerId];
            }
        });
    };

    // Lida com a busca
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtra montadoras com base no termo de busca
    const filteredMontadoras = montadoras.filter(montadora =>
        montadora.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
        montadora.cnpj.includes(searchTerm)
    );

    // Redireciona para a página de edição de montadora
    const handleEditManufacturer = () => {
        if (selectedManufacturers.length === 1) {
            navigate(`/montadoras/editar/${selectedManufacturers[0]}`);
        } else {
            alert("Por favor, selecione apenas uma montadora para editar.");
        }
    };

    // Deleta as montadoras selecionadas
    const handleDeleteManufacturers = async () => {
        try {
            await Promise.all(
                selectedManufacturers.map(montadoraId =>
                    api.delete(`/montadoras/${montadoraId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`, // Adiciona o token de autorização
                        },
                    })
                )
            );
            setMontadoras(montadoras.filter(montadora => !selectedManufacturers.includes(montadora.montadoraId)));
            setSelectedManufacturers([]);
        } catch (error) {
            console.error("Erro ao deletar montadoras:", error);
            if (error.response && error.response.status === 403) {
                alert("Acesso negado: apenas gerentes podem realizar esta ação.");
            } else if (error.response && error.response.status === 401) {
                alert("Sessão expirada. Faça login novamente.");
                navigate('/login');
            } else {
                alert("Erro ao deletar montadoras. Tente novamente.");
            }
        }
    };

    return (
        <div className="montadoras-content">
            <h1>Montadoras</h1>
            <p>Gerenciamento de montadoras cadastradas.</p>

            {/* Barra de Pesquisa */}
            <input
                type="text"
                placeholder="Pesquisar por CNPJ ou Razão Social"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
            />

            {/* Botões de ação */}
            <button onClick={() => navigate('/montadoras/cadastro')} className="btn-cadastrar-montadora action-button">
                Cadastrar Nova Montadora
            </button>
            <button
                onClick={handleEditManufacturer}
                disabled={selectedManufacturers.length !== 1}
                className="btn-editar-montadora action-button"
            >
                Editar Cadastro
            </button>
            <button
                onClick={handleDeleteManufacturers}
                disabled={selectedManufacturers.length === 0}
                className="btn-deletar-montadora action-button"
            >
                Deletar
            </button>

            {/* Tabela de montadoras cadastradas */}
            {filteredMontadoras.length > 0 ? (
                <table className="montadoras-table">
                    <thead>
                        <tr>
                            <th></th> {/* Coluna para os checkboxes */}
                            <th>CNPJ</th>
                            <th>Razão Social</th>
                            <th>Marca</th>
                            <th>Contato</th>
                            <th>Telefone Comercial</th>
                            <th>Celular</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMontadoras.map((montadora) => (
                            <tr key={montadora.montadoraId}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedManufacturers.includes(montadora.montadoraId)}
                                        onChange={() => handleSelectManufacturer(montadora.montadoraId)}
                                    />
                                </td>
                                <td>{montadora.cnpj}</td>
                                <td>{montadora.razao_social}</td>
                                <td>{montadora.marca}</td>
                                <td>{montadora.contato}</td>
                                <td>{montadora.telefone_comercial}</td>
                                <td>{montadora.celular}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Nenhuma montadora encontrada.</p>
            )}
        </div>
    );
}

export default Montadoras;
