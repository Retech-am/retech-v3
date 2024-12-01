import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Operacoes.css';

function Operacoes() {
    const navigate = useNavigate();

    return (
        <div className="operacoes-container">
            <h1>Operações</h1>
            <p>Selecione a operação desejada:</p>
            <div className="operacoes-buttons">
                <button onClick={() => navigate('/operacoes/compras')}>Compra</button>
                <button onClick={() => navigate('/operacoes/vendas')}>Venda</button>
                <button onClick={() => navigate('/operacoes/pedidos')}>Pedido</button>
            </div>
        </div>
    );
}

export default Operacoes;
