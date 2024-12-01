import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar({ isAuthenticated, setIsAuthenticated }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove o token do localStorage
        localStorage.removeItem('token');
        // Atualiza o estado global de autenticação
        setIsAuthenticated(false);
        // Redireciona para a página de login
        navigate('/');
    };

    if (!isAuthenticated) {
        return null; // Não renderiza nada se o usuário não estiver autenticado
    }

    return (
        <div className="sidebar">
            <h2>Menu</h2>
            <nav>
                <NavLink to="/clientes" className="active-link">Clientes</NavLink>
                <NavLink to="/veiculos" className="active-link">Veículos</NavLink>
                <NavLink to="/montadoras" className="active-link">Montadoras</NavLink>
                <NavLink to="/perfil" className="active-link">Perfil</NavLink>
                <div className="dropdown">
                    <span>Operações</span>
                    <div className="dropdown-content">
                        <NavLink to="/operacoes/compras" className="active-link">Compra</NavLink>
                        <NavLink to="/operacoes/vendas" className="active-link">Venda</NavLink>
                        <NavLink to="/operacoes/pedidos" className="active-link">Pedido</NavLink>
                    </div>
                </div>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </nav>
        </div>
    );
}

export default Sidebar;
