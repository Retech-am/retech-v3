import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

function Login({ setIsAuthenticated }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Limpa a mensagem de erro ao iniciar o envio

        try {
            const response = await axios.post('http://localhost:3001/api/vendedores/login', { email, senha });
            if (response.status === 200) {
                // Armazena o token e redireciona para a tela principal
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('cargo', response.data.cargo);
                setIsAuthenticated(true); // Atualiza o estado de autenticação no componente pai
                navigate('/home'); // Redireciona para a tela principal
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Erro ao fazer login. Verifique suas credenciais.");
                console.error("Erro ao fazer login:", error);
            }
        }
    };

    return (
        <div className="login-content">
            <h1>Login</h1>
            <form onSubmit={handleLogin} className="form-login">
                <label>Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>Senha:
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Entrar</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <p>
                Não tem uma conta? <button onClick={() => navigate('/register')}>Cadastre-se</button>
            </p>
        </div>
    );
}

export default Login;
