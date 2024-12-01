const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const secretKey = 'seu-segredo-seguro'; 

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

// Registrar uma compra
router.post('/', authenticateToken, async (req, res) => {
    const { cliente_id, vendedor_id, veiculo_id, valor, data } = req.body;

    try {
        const cod_compra = `C-${Date.now()}`; // Gerar um código único para a compra
        await pool.query(
            `INSERT INTO compras (cod_compra, cliente_id, vendedor_id, veiculo_id, valor, data) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [cod_compra, cliente_id, vendedor_id, veiculo_id, valor, data]
        );
        res.json({ message: 'Compra registrada com sucesso' });
    } catch (error) {
        console.error('Erro ao registrar compra:', error);
        res.status(500).json({ message: 'Erro ao registrar compra', details: error.message });
    }
});

// Atualizar uma compra
router.put('/:compraId', authenticateToken, isGerente, async (req, res) => {
    const { compraId } = req.params;
    const { cliente_id, vendedor_id, veiculo_id, valor, data } = req.body;

    try {
        await pool.query(
            `UPDATE compras 
            SET cliente_id = ?, vendedor_id = ?, veiculo_id = ?, valor = ?, data = ? 
            WHERE compraId = ?`,
            [cliente_id, vendedor_id, veiculo_id, valor, data, compraId]
        );
        res.json({ message: 'Compra atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar compra:', error);
        res.status(500).json({ message: 'Erro ao atualizar compra', details: error.message });
    }
});

// Excluir uma compra
router.delete('/:compraId', authenticateToken, isGerente, async (req, res) => {
    const { compraId } = req.params;

    try {
        await pool.query('DELETE FROM compras WHERE compraId = ?', [compraId]);
        res.json({ message: 'Compra deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar compra:', error);
        res.status(500).json({ message: 'Erro ao deletar compra', details: error.message });
    }
});

// Obter uma compra específica
router.get('/:compraId', authenticateToken, async (req, res) => {
    const { compraId } = req.params;

    try {
        const [rows] = await pool.query(`
            SELECT compras.compraId, compras.cod_compra, compras.data, compras.valor, 
                   clientes.nome AS cliente_nome, vendedores.nome AS vendedor_nome, veiculos.modelo AS veiculo_modelo
            FROM compras
            INNER JOIN clientes ON compras.cliente_id = clientes.clienteId
            INNER JOIN vendedores ON compras.vendedor_id = vendedores.vendedorId
            INNER JOIN veiculos ON compras.veiculo_id = veiculos.veiculoId
            WHERE compras.compraId = ?
        `, [compraId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Compra não encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Erro ao obter compra:', error);
        res.status(500).json({ message: 'Erro ao obter compra', details: error.message });
    }
});

// Listar todas as compras
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT compras.compraId, compras.cod_compra, compras.data, compras.valor, 
                   clientes.nome AS cliente_nome, vendedores.nome AS vendedor_nome, veiculos.modelo AS veiculo_modelo
            FROM compras
            INNER JOIN clientes ON compras.cliente_id = clientes.clienteId
            INNER JOIN vendedores ON compras.vendedor_id = vendedores.vendedorId
            INNER JOIN veiculos ON compras.veiculo_id = veiculos.veiculoId
        `);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao obter compras:', error);
        res.status(500).json({ message: 'Erro ao obter compras', details: error.message });
    }
});

module.exports = router;
