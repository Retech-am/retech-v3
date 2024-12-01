const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const secretKey = 'seu-segredo-seguro'; // Substitua pela sua chave secreta

// Middleware para verificar token JWT e adicionar cargo do usuário
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token.split(' ')[1], secretKey, (err, user) => {
        if (err) {
            console.log("Erro ao verificar o token:", err);
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
}

// Middleware para verificar se o usuário é Gerente
function isGerente(req, res, next) {
    if (req.user.cargo !== 'Gerente') {
        return res.status(403).json({ message: 'Acesso negado: apenas gerentes podem realizar esta ação' });
    }
    next();
}

// Registrar um pedido
router.post('/', authenticateToken, async (req, res) => {
    const { cliente_id, montadora_id, modelo, ano, cor, acessorios, valor } = req.body;

    try {
        const cod_pedido = `P-${Date.now()}`; // Gerar um código único para o pedido
        const data = new Date().toISOString().split('T')[0]; // Data atual no formato YYYY-MM-DD
        await pool.query(
            `INSERT INTO pedidos (cod_pedido, cliente_id, montadora_id, modelo, ano, cor, acessorios, valor, data, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendente')`,
            [cod_pedido, cliente_id, montadora_id, modelo, ano, cor, acessorios, valor, data]
        );
        res.json({ message: 'Pedido registrado com sucesso' });
    } catch (error) {
        console.error('Erro ao registrar pedido:', error);
        res.status(500).json({ message: 'Erro ao registrar pedido', details: error.message });
    }
});

// Atualizar um pedido
router.put('/:pedidoId', authenticateToken, async (req, res) => {
    const { pedidoId } = req.params;
    const { cliente_id, montadora_id, modelo, ano, cor, acessorios, valor, status } = req.body;

    try {
        await pool.query(
            `UPDATE pedidos 
            SET cliente_id = ?, montadora_id = ?, modelo = ?, ano = ?, cor = ?, acessorios = ?, valor = ?, status = ? 
            WHERE pedidoId = ?`,
            [cliente_id, montadora_id, modelo, ano, cor, acessorios, valor, status, pedidoId]
        );
        res.json({ message: 'Pedido atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar pedido:', error);
        res.status(500).json({ message: 'Erro ao atualizar pedido', details: error.message });
    }
});

// Excluir um pedido
router.delete('/:pedidoId', authenticateToken, isGerente, async (req, res) => {
    const { pedidoId } = req.params;

    try {
        await pool.query('DELETE FROM pedidos WHERE pedidoId = ?', [pedidoId]);
        res.json({ message: 'Pedido deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar pedido:', error);
        res.status(500).json({ message: 'Erro ao deletar pedido', details: error.message });
    }
});

// Obter um pedido específico
router.get('/:pedidoId', authenticateToken, async (req, res) => {
    const { pedidoId } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT pedidos.*, clientes.nome AS cliente_nome, montadoras.razao_social AS montadora_nome
            FROM pedidos
            INNER JOIN clientes ON pedidos.cliente_id = clientes.clienteId
            INNER JOIN montadoras ON pedidos.montadora_id = montadoras.montadoraId
            WHERE pedidos.pedidoId = ?`,
            [pedidoId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Erro ao obter pedido:', error);
        res.status(500).json({ message: 'Erro ao obter pedido', details: error.message });
    }
});

// Listar todos os pedidos
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT pedidos.*, clientes.nome AS cliente_nome, montadoras.razao_social AS montadora_nome
            FROM pedidos
            INNER JOIN clientes ON pedidos.cliente_id = clientes.clienteId
            INNER JOIN montadoras ON pedidos.montadora_id = montadoras.montadoraId`
        );
        res.json(rows);
    } catch (error) {
        console.error('Erro ao listar pedidos:', error);
        res.status(500).json({ message: 'Erro ao listar pedidos', details: error.message });
    }
});

module.exports = router;
