import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from './axiosInstance'; // Utiliza a instância de axios configurada
import '../styles/EditarMontadora.css';

function EditarMontadora() {
    const { id } = useParams();
    const [montadora, setMontadora] = useState({
        cnpj: '',
        razao_social: '',
        marca: '',
        contato: '',
        telefone_comercial: '',
        celular: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMontadora = async () => {
            try {
                const response = await axios.get(`/montadoras/${id}`);
                setMontadora(response.data);
            } catch (error) {
                console.error("Erro ao buscar montadora:", error);
            }
        };

        if (id) {
            fetchMontadora();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMontadora({ ...montadora, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/montadoras/${id}`, montadora);
            alert('Montadora editada com sucesso!');
            navigate('/montadoras'); // Redireciona para a lista de montadoras
        } catch (error) {
            console.error("Erro ao editar montadora:", error);
            alert('Erro ao editar montadora. Tente novamente.');
        }
    };

    const handleCancel = () => {
        navigate('/montadoras');
    };

    return (
        <div className="editar-montadora-content">
            <h1>Editar Montadora</h1>
            <form onSubmit={handleSubmit} className="form-editar-montadora">
                <label>CNPJ:
                    <input
                        type="text"
                        name="cnpj"
                        value={montadora.cnpj}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>Razão Social:
                    <input
                        type="text"
                        name="razao_social"
                        value={montadora.razao_social}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>Marca:
                    <input
                        type="text"
                        name="marca"
                        value={montadora.marca}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>Contato:
                    <input
                        type="text"
                        name="contato"
                        value={montadora.contato}
                        onChange={handleInputChange}
                    />
                </label>
                <label>Telefone Comercial:
                    <input
                        type="tel"
                        name="telefone_comercial"
                        value={montadora.telefone_comercial}
                        onChange={handleInputChange}
                    />
                </label>
                <label>Celular:
                    <input
                        type="tel"
                        name="celular"
                        value={montadora.celular}
                        onChange={handleInputChange}
                    />
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

export default EditarMontadora;
