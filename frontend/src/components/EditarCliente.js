import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/CadastroCliente.css';

function EditarCliente() {
    const { id } = useParams(); // Obtém o ID do cliente a partir da URL
    const [cliente, setCliente] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Busca os dados do cliente a partir do ID
        const fetchCliente = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/clientes/${id}`);
                setCliente(response.data);
            } catch (error) {
                console.error("Erro ao buscar cliente:", error);
            }
        };

        fetchCliente();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCliente({ ...cliente, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/api/clientes/${id}`, cliente);
            navigate('/clientes'); // Redireciona para a página de listagem de clientes após a edição
        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
        }
    };

    if (!cliente) return <p>Carregando...</p>;

    const handleCancel = () => {
        navigate('/clientes');
    };

    return (
        <div className="cadastro-cliente-content">
            <h1>Editar Cliente</h1>
            <form onSubmit={handleSubmit} className="form-cadastro-cliente">
                <label>CPF:
                    <input type="text" name="cpf" value={cliente.cpf} onChange={handleInputChange} required />
                </label>
                <label>Nome:
                    <input type="text" name="nome" value={cliente.nome} onChange={handleInputChange} required />
                </label>
                <label>Email:
                    <input type="email" name="email" value={cliente.email} onChange={handleInputChange} />
                </label>
                <label>Número da Residência:
                    <input type="text" name="numero_residencia" value={cliente.numero_residencia} onChange={handleInputChange} />
                </label>
                <label>Rua:
                    <input type="text" name="rua" value={cliente.rua} onChange={handleInputChange} />
                </label>
                <label>Bairro:
                    <input type="text" name="bairro" value={cliente.bairro} onChange={handleInputChange} />
                </label>
                <label>Cidade:
                    <input type="text" name="cidade" value={cliente.cidade} onChange={handleInputChange} />
                </label>
                <label>Estado:
                    <input type="text" name="estado" value={cliente.estado} onChange={handleInputChange} maxLength="2" />
                </label>
                <label>CEP:
                    <input type="text" name="cep" value={cliente.cep} onChange={handleInputChange} required />
                </label>
                <label>Telefone:
                    <input type="tel" name="telefone" value={cliente.telefone} onChange={handleInputChange} />
                </label>
                <label>Celular:
                    <input type="tel" name="celular" value={cliente.celular} onChange={handleInputChange} required />
                </label>
                <label>Renda:
                    <input type="number" step="0.01" name="renda" value={cliente.renda} onChange={handleInputChange} />
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
        </div>
    );
}

export default EditarCliente;
