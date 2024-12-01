import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const token = localStorage.getItem('token');

    if (!token) {
        // Se não houver token, redirecione para a página de login
        return <Navigate to="/" />;
    }

    // Se o token estiver presente, renderize o componente solicitado
    return children;
}

export default PrivateRoute;
