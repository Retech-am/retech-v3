import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EditarPerfilVendedor.css';

function EditarPerfilVendedor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vendedor, setVendedor] = useState({
        matricula: '',
        nome: '',
        email: '',
        senha: '',
        cargo: ''
    });

    useEffect(() => {
        const fetchVendedor = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/vendedores/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setVendedor(response.data);
            } catch (error) {
                console.error('Erro ao carregar vendedor:', error);
            }
        };

        fetchVendedor();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVendedor((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:3001/api/vendedores/${id}`, vendedor, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert('Perfil atualizado com sucesso!');
            navigate('/perfil');
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            alert('Erro ao atualizar perfil.');
        }
    };

    const handleCancel = () => {
        navigate('/perfil'); // Redireciona para a tela Home
    };

    return (
        <div>
            <h1>Editar Perfil do Vendedor</h1>
            <form>
                {/* Campo de Matrícula */}
                <label>
                    Matrícula:
                    <input
                        type="text"
                        value={vendedor.matricula}
                        readOnly
                    />
                </label>

                {/* Campo de Nome */}
                <label>
                    Nome:
                    <input
                        type="text"
                        name="nome"
                        value={vendedor.nome}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                {/* Campo de Email */}
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={vendedor.email}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                {/* Campo de Senha */}
                <label>
                    Senha:
                    <input
                        type="password"
                        name="senha"
                        value={vendedor.senha}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                {/* Campo de Cargo */}
                <label>
                    Cargo:
                    <input
                        type="text"
                        value={vendedor.cargo}
                        readOnly
                    />
                </label>

                <div className="form-buttons">
                    <button type="button" onClick={handleSave} className="btn-save">
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

export default EditarPerfilVendedor;
