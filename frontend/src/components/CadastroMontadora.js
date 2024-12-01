import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/CadastroMontadora.css';

function CadastroMontadora() {
    const { montadoraId } = useParams();
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
        if (montadoraId) {
            const fetchMontadora = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/api/montadoras/${montadoraId}`);
                    setMontadora(response.data);
                } catch (error) {
                    console.error("Erro ao buscar montadora:", error);
                }
            };

            fetchMontadora();
        }
    }, [montadoraId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMontadora({ ...montadora, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (montadoraId) {
                await axios.put(`http://localhost:3001/api/montadoras/${montadoraId}`, montadora);
            } else {
                await axios.post('http://localhost:3001/api/montadoras', montadora);
            }
            navigate('/montadoras');
        } catch (error) {
            console.error("Erro ao salvar montadora:", error);
        }
    };

    const handleCancel = () => {
        navigate('/montadoras');
    };

    return (
        <div className="cadastro-montadora-content">
            <h1>{montadoraId ? 'Editar Montadora' : 'Cadastrar Nova Montadora'}</h1>
            <form onSubmit={handleSubmit} className="form-cadastro-montadora">
                <label>CNPJ:
                    <input type="text" name="cnpj" value={montadora.cnpj} onChange={handleInputChange} required />
                </label>
                <label>Razão Social:
                    <input type="text" name="razao_social" value={montadora.razao_social} onChange={handleInputChange} required />
                </label>
                <label>Marca:
                    <input type="text" name="marca" value={montadora.marca} onChange={handleInputChange} required />
                </label>
                <label>Contato:
                    <input type="text" name="contato" value={montadora.contato} onChange={handleInputChange} />
                </label>
                <label>Telefone Comercial:
                    <input type="tel" name="telefone_comercial" value={montadora.telefone_comercial} onChange={handleInputChange} />
                </label>
                <label>Celular:
                    <input type="tel" name="celular" value={montadora.celular} onChange={handleInputChange} />
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

export default CadastroMontadora;
