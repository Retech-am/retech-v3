import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Clientes from './components/Clientes';
import CadastroCliente from './components/CadastroCliente';
import EditarCliente from './components/EditarCliente';
import Veiculos from './components/Veiculos';
import EditarVeiculo from './components/EditarVeiculo';
import CadastroVeiculo from './components/CadastroVeiculo';
import Montadoras from './components/Montadoras';
import EditarMontadora from './components/EditarMontadora';
import CadastroMontadora from './components/CadastroMontadora';
import Perfil from './components/Perfil';
import EditarPerfilVendedor from './components/EditarPerfilVendedor';
import Operacoes from './components/operacoes/Operacoes';
import Compras from './components/operacoes/Compras';
import NovaCompra from './components/operacoes/NovaCompra';
import Vendas from './components/operacoes/Vendas';
import NovaVenda from './components/operacoes/NovaVenda';
import Pedidos from './components/operacoes/Pedidos';
import NovoPedido from './components/operacoes/NovoPedido';
import PrivateRoute from './components/PrivateRoute';
import './styles/App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Verifica se o token existe no localStorage para definir o estado de autenticação
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    return (
        <Router>
            <div className="app-container">
                {isAuthenticated && <Sidebar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
                <div className="content-container">
                    <Routes>
                        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                        <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
                        <Route path="/clientes/cadastro" element={<PrivateRoute><CadastroCliente /></PrivateRoute>} />
                        <Route path="/clientes/editar/:id" element={<PrivateRoute><EditarCliente /></PrivateRoute>} />
                        <Route path="/veiculos" element={<PrivateRoute><Veiculos /></PrivateRoute>} />
                        <Route path="/veiculos/cadastro" element={<PrivateRoute><CadastroVeiculo /></PrivateRoute>} />
                        <Route path="/veiculos/editar/:id" element={<PrivateRoute><EditarVeiculo /></PrivateRoute>} />
                        <Route path="/montadoras" element={<PrivateRoute><Montadoras /></PrivateRoute>} />
                        <Route path="/montadoras/cadastro" element={<PrivateRoute><CadastroMontadora /></PrivateRoute>} />
                        <Route path="/montadoras/editar/:id" element={<PrivateRoute><EditarMontadora /></PrivateRoute>} />
                        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
                        <Route path="/perfil/editar/:id" element={<PrivateRoute><EditarPerfilVendedor /></PrivateRoute>} />
                        <Route path="/vendedores" element={<PrivateRoute><Perfil /></PrivateRoute>} />
                        <Route path="/operacoes" element={<PrivateRoute><Operacoes /></PrivateRoute>} />
                        <Route path="/operacoes/compras" element={<PrivateRoute><Compras /></PrivateRoute>} />
                        <Route path="/operacoes/compras/nova" element={<PrivateRoute><NovaCompra /></PrivateRoute>} />
                        <Route path="/operacoes/vendas" element={<PrivateRoute><Vendas /></PrivateRoute>} />
                        <Route path="/operacoes/vendas/nova" element={<PrivateRoute><NovaVenda /></PrivateRoute>} />
                        <Route path="/operacoes/pedidos" element={<PrivateRoute><Pedidos /></PrivateRoute>} />
                        <Route path="/operacoes/pedidos/novo" element={<PrivateRoute><NovoPedido /></PrivateRoute>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
