import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './axiosInstance'; // Importa o axiosInstance
import '../styles/Clientes.css';

function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Termo de busca
    const [selectedClients, setSelectedClients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await api.get('/clientes'); // Usando o axiosInstance
                const sortedClients = response.data.sort((a, b) => a.nome.localeCompare(b.nome)); // Ordena por nome
                setClientes(sortedClients);
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
            }
        };

        fetchClientes();
    }, []);

    // Lida com a seleção de checkboxes
    const handleSelectClient = (clienteId) => {
        setSelectedClients((prevSelected) => {
            if (prevSelected.includes(clienteId)) {
                return prevSelected.filter(id => id !== clienteId);
            } else {
                return [...prevSelected, clienteId];
            }
        });
    };

    // Lida com a busca
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtra clientes com base no termo de busca
    const filteredClientes = clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.cpf.includes(searchTerm)
    );

    // Redireciona para a página de edição de cliente
    const handleEditClient = () => {
        if (selectedClients.length === 1) {
            navigate(`/clientes/editar/${selectedClients[0]}`);
        }
    };

    // Deleta os clientes selecionados
    const handleDeleteClients = async () => {
        try {
            await Promise.all(
                selectedClients.map(clienteId =>
                    api.delete(`/clientes/${clienteId}`) // Usando o axiosInstance
                )
            );
            setClientes(clientes.filter(cliente => !selectedClients.includes(cliente.clienteId)));
            setSelectedClients([]);
        } catch (error) {
            console.error("Erro ao deletar clientes:", error);
            if (error.response && error.response.status === 403) {
                alert("Acesso negado: apenas gerentes podem realizar esta ação.");
            } else if (error.response && error.response.status === 401) {
                alert("Sessão expirada. Faça login novamente.");
                navigate('/login');
            } else {
                alert("Erro ao deletar clientes. Tente novamente.");
            }
        }
    };

    return (
        <div className="clientes-content">
            <h1>Clientes</h1>
            <p>Gerenciamento de clientes cadastrados.</p>
            
            {/* Barra de Pesquisa */}
            <input
                type="text"
                placeholder="Pesquisar por Nome ou CPF"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
            />
            
            {/* Botões de ação */}
            <button onClick={() => navigate('/clientes/cadastro')} className="btn-cadastrar-cliente action-button">
                Cadastrar Novo Cliente
            </button>
            <button
                onClick={handleEditClient}
                disabled={selectedClients.length !== 1}
                className="btn-editar-cliente action-button"
            >
                Editar Cadastro
            </button>
            <button
                onClick={handleDeleteClients}
                disabled={selectedClients.length === 0}
                className="btn-deletar-cliente action-button"
            >
                Deletar
            </button>

            {/* Tabela de clientes cadastrados */}
            {filteredClientes.length > 0 ? (
                <table className="clientes-table">
                    <thead>
                        <tr>
                            <th></th> {/* Coluna para os checkboxes */}
                            <th>CPF</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Número Residência</th>
                            <th>Rua</th>
                            <th>Bairro</th>
                            <th>Cidade</th>
                            <th>Estado</th>
                            <th>CEP</th>
                            <th>Telefone</th>
                            <th>Celular</th>
                            <th>Renda</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClientes.map((cliente) => (
                            <tr key={cliente.clienteId}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedClients.includes(cliente.clienteId)}
                                        onChange={() => handleSelectClient(cliente.clienteId)}
                                    />
                                </td>
                                <td>{cliente.cpf}</td>
                                <td>{cliente.nome}</td>
                                <td>{cliente.email}</td>
                                <td>{cliente.numero_residencia}</td>
                                <td>{cliente.rua}</td>
                                <td>{cliente.bairro}</td>
                                <td>{cliente.cidade}</td>
                                <td>{cliente.estado}</td>
                                <td>{cliente.cep}</td>
                                <td>{cliente.telefone}</td>
                                <td>{cliente.celular}</td>
                                <td>{cliente.renda}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Nenhum cliente encontrado.</p>
            )}
        </div>
    );
}

export default Clientes;
