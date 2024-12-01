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

// Listar todos os clientes
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clientes');
        res.json(rows);
    } catch (error) {
        console.error("Erro ao listar clientes:", error);
        res.status(500).json({ error: 'Erro ao listar clientes', details: error.message });
    }
});

// Obter um cliente pelo ID
router.get('/:clienteId', async (req, res) => {
    const { clienteId } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM clientes WHERE clienteId = ?', [clienteId]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'Cliente não encontrado' });
        } else {
            res.json(rows[0]);
        }
    } catch (error) {
        console.error("Erro ao obter cliente:", error);
        res.status(500).json({ error: 'Erro ao obter cliente', details: error.message });
    }
});

// Criar um novo cliente
router.post('/', async (req, res) => {
    const {cpf, nome, email, numero_residencia, rua, bairro, cidade, estado, cep, telefone, celular, renda} = req.body;

    try {
        await pool.query(
            'INSERT INTO clientes (cpf, nome, email, numero_residencia, rua, bairro, cidade, estado, cep, telefone, celular, renda) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [cpf, nome, email, numero_residencia, rua, bairro, cidade, estado, cep, telefone, celular, renda]
        );
        res.json({ message: 'Cliente cadastrado com sucesso' });
    } catch (error) {
        console.error("Erro ao cadastrar cliente:", error);
        res.status(500).json({ error: 'Erro ao cadastrar cliente', details: error.message });
    }
});

// Atualizar um cliente pelo ID
router.put('/:clienteId', async (req, res) => {
    const { clienteId } = req.params;
    const {cpf, nome, email, numero_residencia, rua, bairro, cidade, estado, cep, telefone, celular, renda} = req.body;

    try {
        await pool.query(
            'UPDATE clientes SET cpf = ?, nome = ?, email = ?, numero_residencia = ?, rua = ?, bairro = ?, cidade = ?, estado = ?, cep = ?, telefone = ?, celular = ?, renda = ? WHERE clienteId = ?',
            [cpf, nome, email, numero_residencia, rua, bairro, cidade, estado, cep, telefone, celular, renda, clienteId]
        );
        res.json({ message: 'Cliente atualizado com sucesso' });
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        res.status(500).json({ error: 'Erro ao atualizar cliente', details: error.message });
    }
});

// Deletar um cliente pelo ID (apenas Gerente pode deletar)
router.delete('/:clienteId', authenticateToken, isGerente, async (req, res) => {
    const { clienteId } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM clientes WHERE clienteId = ?', [clienteId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }

        res.json({ message: 'Cliente deletado com sucesso' });
    } catch (error) {
        console.error("Erro ao deletar cliente:", error);
        res.status(500).json({ error: 'Erro ao deletar cliente', details: error.message });
    }
});

module.exports = router;
