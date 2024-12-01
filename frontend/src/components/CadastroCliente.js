import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CadastroCliente.css';

function CadastroCliente() {
    const [novoCliente, setNovoCliente] = useState({
        cpf: '',
        nome: '',
        email: '',
        numero_residencia: '',
        rua: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        telefone: '',
        celular: '',
        renda: ''
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNovoCliente({ ...novoCliente, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/clientes', novoCliente);
            console.log("Cliente cadastrado com sucesso, redirecionando...");
            navigate('/clientes'); // Redireciona para a página de listagem de clientes após o sucesso
        } catch (error) {
            console.error("Erro ao cadastrar cliente:", error);
        }
    };

    const handleCancel = () => {
        navigate('/clientes');
    };

    return (
        <div className="cadastro-cliente-content">
            <h1>Cadastro de Cliente</h1>
            <form onSubmit={handleSubmit} className="form-cadastro-cliente">
                <label>CPF<span className="required">*</span>:
                    <input type="text" name="cpf" value={novoCliente.cpf} onChange={handleInputChange} required />
                </label>
                <label>Nome<span className="required">*</span>:
                    <input type="text" name="nome" value={novoCliente.nome} onChange={handleInputChange} required />
                </label>
                <label>Email:
                    <input type="email" name="email" value={novoCliente.email} onChange={handleInputChange} />
                </label>
                <label>Número da Residência:
                    <input type="text" name="numero_residencia" value={novoCliente.numero_residencia} onChange={handleInputChange} />
                </label>
                <label>Rua:
                    <input type="text" name="rua" value={novoCliente.rua} onChange={handleInputChange} />
                </label>
                <label>Bairro:
                    <input type="text" name="bairro" value={novoCliente.bairro} onChange={handleInputChange} />
                </label>
                <label>Cidade:
                    <input type="text" name="cidade" value={novoCliente.cidade} onChange={handleInputChange} />
                </label>
                <label>Estado:
                    <input type="text" name="estado" value={novoCliente.estado} onChange={handleInputChange} maxLength="2" />
                </label>
                <label>CEP<span className="required">*</span>:
                    <input type="text" name="cep" value={novoCliente.cep} onChange={handleInputChange} required />
                </label>
                <label>Telefone:
                    <input type="tel" name="telefone" value={novoCliente.telefone} onChange={handleInputChange} />
                </label>
                <label>Celular<span className="required">*</span>:
                    <input type="tel" name="celular" value={novoCliente.celular} onChange={handleInputChange} required />
                </label>
                <label>Renda:
                    <input type="number" step="0.01" name="renda" value={novoCliente.renda} onChange={handleInputChange} />
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

export default CadastroCliente;
