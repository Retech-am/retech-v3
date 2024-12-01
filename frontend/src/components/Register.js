import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Register.css';

function Register() {
    const [vendedor, setVendedor] = useState({
        matricula: '',
        nome: '',
        email: '',
        cargo: 'Vendedor', // Padrão para 'Vendedor'
        senha: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVendedor({ ...vendedor, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Limpa a mensagem de erro ao iniciar o envio

        try {
            // Tenta cadastrar o vendedor
            const response = await axios.post('http://localhost:3001/api/vendedores/register', vendedor);
            if (response.status === 200) {
                // Redireciona para a página de login após o cadastro com sucesso
                navigate('/');
            }
        } catch (error) {
            // Se houver erro, define a mensagem de erro apropriada
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Erro ao cadastrar vendedor. Tente novamente mais tarde.");
                console.error("Erro ao cadastrar vendedor:", error);
            }
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="register-content">
            <h1>Cadastro de Vendedor</h1>
            <form onSubmit={handleSubmit} className="form-register">
                <label>Matrícula:
                    <input type="text" name="matricula" value={vendedor.matricula} onChange={handleInputChange} required />
                </label>
                <label>Nome:
                    <input type="text" name="nome" value={vendedor.nome} onChange={handleInputChange} required />
                </label>
                <label>Email:
                    <input type="email" name="email" value={vendedor.email} onChange={handleInputChange} required />
                </label>
                <label>Cargo:
                    <select name="cargo" value={vendedor.cargo} onChange={handleInputChange} required>
                        <option value="Vendedor">Vendedor</option>
                        <option value="Gerente">Gerente</option>
                    </select>
                </label>
                <label>Senha:
                    <input type="password" name="senha" value={vendedor.senha} onChange={handleInputChange} required />
                </label>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="form-buttons">
                    <button type="submit" className="btn-save">
                        Cadastrar
                    </button>
                    <button type="button" onClick={handleCancel} className="btn-cancel">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Register;
