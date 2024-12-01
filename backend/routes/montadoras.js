const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const secretKey = 'seu-segredo-seguro';

// Middleware para verificar token JWT e adicionar cargo do usuário
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token.split(' ')[1], secretKey, (err, user) => {
        if (err) {
            console.log("Erro ao verificar o token:", err);
            return res.sendStatus(403);
        }
        console.log("Usuário autenticado:", user); // Verifica o conteúdo de `user`
        req.user = user;
        next();
    });
}

// Middleware para verificar se o usuário é Gerente
function isGerente(req, res, next) {
    console.log("Verificando cargo do usuário:", req.user); // Verifica o conteúdo de `req.user`
    if (req.user.cargo !== 'Gerente') {
        return res.status(403).json({ message: 'Acesso negado: apenas gerentes podem realizar esta ação' });
    }
    next();
}
// Listar todas as montadoras
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM montadoras');
        res.json(rows);
    } catch (error) {
        console.error("Erro ao listar montadoras:", error);
        res.status(500).json({ error: 'Erro ao listar montadoras', details: error.message });
    }
});

// Obter uma montadora pelo ID
router.get('/:montadoraId', async (req, res) => {
    const { montadoraId } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM montadoras WHERE montadoraId = ?', [montadoraId]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'Montadora não encontrada' });
        } else {
            res.json(rows[0]);
        }
    } catch (error) {
        console.error("Erro ao obter montadora:", error);
        res.status(500).json({ error: 'Erro ao obter montadora', details: error.message });
    }
});

// Criar uma nova montadora
router.post('/', async (req, res) => {
    const { cnpj, razao_social, marca, contato, telefone_comercial, celular } = req.body;
    try {
        await pool.query(
            'INSERT INTO montadoras (cnpj, razao_social, marca, contato, telefone_comercial, celular) VALUES (?, ?, ?, ?, ?, ?)',
            [cnpj, razao_social, marca, contato, telefone_comercial, celular]
        );
        res.json({ message: 'Montadora cadastrada com sucesso' });
    } catch (error) {
        console.error("Erro ao cadastrar montadora:", error);
        res.status(500).json({ error: 'Erro ao cadastrar montadora', details: error.message });
    }
});

// Atualizar uma montadora
router.put('/:montadoraId', async (req, res) => {
    const { montadoraId } = req.params;
    const { cnpj, razao_social, marca, contato, telefone_comercial, celular } = req.body;
    try {
        await pool.query(
            'UPDATE montadoras SET cnpj = ?, razao_social = ?, marca = ?, contato = ?, telefone_comercial = ?, celular = ? WHERE montadoraId = ?',
            [cnpj, razao_social, marca, contato, telefone_comercial, celular, montadoraId]
        );
        res.json({ message: 'Montadora atualizada com sucesso' });
    } catch (error) {
        console.error("Erro ao atualizar montadora:", error);
        res.status(500).json({ error: 'Erro ao atualizar montadora', details: error.message });
    }
});

// Deletar uma montadora pelo ID (apenas Gerente pode deletar)
router.delete('/:montadoraId', authenticateToken, isGerente, async (req, res) => {
    const { montadoraId } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM montadoras WHERE montadoraId = ?', [montadoraId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Montadora não encontrada' });
        }

        res.json({ message: 'Montadora deletada com sucesso' });
    } catch (error) {
        console.error("Erro ao deletar montadora:", error);
        res.status(500).json({ error: 'Erro ao deletar montadora', details: error.message });
    }
});


module.exports = router;
