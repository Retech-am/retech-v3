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

// Registrar uma venda (Acesso para todos os vendedores autenticados)
router.post('/', authenticateToken, async (req, res) => {
    const { cliente_id, vendedor_id, veiculo_id, valor_entrada, valor_financiado, valor_total, data } = req.body;

    try {
        const cod_venda = `V-${Date.now()}`; // Gerar um código único para a venda
        await pool.query(
            `INSERT INTO vendas (cod_venda, cliente_id, vendedor_id, veiculo_id, valor_entrada, valor_financiado, valor_total, data) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [cod_venda, cliente_id, vendedor_id, veiculo_id, valor_entrada, valor_financiado, valor_total, data]
        );
        res.json({ message: 'Venda registrada com sucesso' });
    } catch (error) {
        console.error('Erro ao registrar venda:', error);
        res.status(500).json({ message: 'Erro ao registrar venda', details: error.message });
    }
});

// Atualizar uma venda (Apenas Gerentes podem realizar)
router.put('/:vendaId', authenticateToken, isGerente, async (req, res) => {
    const { vendaId } = req.params;
    const { cliente_id, vendedor_id, veiculo_id, valor_entrada, valor_financiado, valor_total, data } = req.body;

    try {
        await pool.query(
            `UPDATE vendas 
            SET cliente_id = ?, vendedor_id = ?, veiculo_id = ?, valor_entrada = ?, valor_financiado = ?, valor_total = ?, data = ? 
            WHERE vendaId = ?`,
            [cliente_id, vendedor_id, veiculo_id, valor_entrada, valor_financiado, valor_total, data, vendaId]
        );
        res.json({ message: 'Venda atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar venda:', error);
        res.status(500).json({ message: 'Erro ao atualizar venda', details: error.message });
    }
});

// Excluir uma venda (Apenas Gerentes podem realizar)
router.delete('/:vendaId', authenticateToken, isGerente, async (req, res) => {
    const { vendaId } = req.params;

    try {
        await pool.query('DELETE FROM vendas WHERE vendaId = ?', [vendaId]);
        res.json({ message: 'Venda deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar venda:', error);
        res.status(500).json({ message: 'Erro ao deletar venda', details: error.message });
    }
});

// Obter uma venda específica
router.get('/:vendaId', authenticateToken, async (req, res) => {
    const { vendaId } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT vendas.vendaId, vendas.cod_venda, vendas.data, vendas.valor_entrada, vendas.valor_financiado, vendas.valor_total, 
                   clientes.nome AS cliente_nome, vendedores.nome AS vendedor_nome, veiculos.modelo AS veiculo_modelo
            FROM vendas
            INNER JOIN clientes ON vendas.cliente_id = clientes.clienteId
            INNER JOIN vendedores ON vendas.vendedor_id = vendedores.vendedorId
            INNER JOIN veiculos ON vendas.veiculo_id = veiculos.veiculoId
            WHERE vendas.vendaId = ?`,
            [vendaId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Venda não encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Erro ao obter venda:', error);
        res.status(500).json({ message: 'Erro ao obter venda', details: error.message });
    }
});

// Listar todas as vendas
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT vendas.vendaId, vendas.cod_venda, vendas.data, vendas.valor_entrada, vendas.valor_financiado, vendas.valor_total, 
                   clientes.nome AS cliente_nome, vendedores.nome AS vendedor_nome, veiculos.modelo AS veiculo_modelo
            FROM vendas
            INNER JOIN clientes ON vendas.cliente_id = clientes.clienteId
            INNER JOIN vendedores ON vendas.vendedor_id = vendedores.vendedorId
            INNER JOIN veiculos ON vendas.veiculo_id = veiculos.veiculoId`
        );
        res.json(rows);
    } catch (error) {
        console.error('Erro ao listar vendas:', error);
        res.status(500).json({ message: 'Erro ao listar vendas', details: error.message });
    }
});

module.exports = router;
