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

// Listar todos os veículos
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM veiculos');
        res.json(rows);
    } catch (error) {
        console.error("Erro ao listar veículos:", error);
        res.status(500).json({ error: 'Erro ao listar veículos', details: error.message });
    }
});

// Listar veículos disponíveis para compra ou venda
router.get('/disponiveis', async (req, res) => {
    const { para } = req.query; // "compra" ou "venda"
    try {
        const [rows] = await pool.query(
            'SELECT * FROM veiculos WHERE status = "disponível" AND disponivel_para = ?',
            [para]
        );
        res.json(rows);
    } catch (error) {
        console.error("Erro ao buscar veículos disponíveis:", error);
        res.status(500).json({ error: 'Erro ao buscar veículos disponíveis', details: error.message });
    }
});

// Obter um veículo pelo ID
router.get('/:veiculoId', async (req, res) => {
    const { veiculoId } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM veiculos WHERE veiculoId = ?', [veiculoId]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'Veículo não encontrado' });
        } else {
            res.json(rows[0]);
        }
    } catch (error) {
        console.error("Erro ao obter veículo:", error);
        res.status(500).json({ error: 'Erro ao obter veículo', details: error.message });
    }
});

// Criar um novo veículo
router.post('/', async (req, res) => {
    const { chassi, placa, marca, modelo, ano_fabricacao, cor, valor, disponivel_para } = req.body;
    try {
        await pool.query(
            'INSERT INTO veiculos (chassi, placa, marca, modelo, ano_fabricacao, cor, valor, disponivel_para) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [chassi, placa, marca, modelo, ano_fabricacao, cor, valor, disponivel_para || 'Ambos']
        );
        res.json({ message: 'Veículo cadastrado com sucesso' });
    } catch (error) {
        console.error("Erro ao cadastrar veículo:", error);
        res.status(500).json({ error: 'Erro ao cadastrar veículo', details: error.message });
    }
});

// Atualizar o status do veículo
router.put('/atualizar-status/:veiculoId', authenticateToken, async (req, res) => {
    const { veiculoId } = req.params;
    const { status, disponivelPara } = req.body;

    // Validação básica dos dados recebidos
    const validStatus = ['disponível', 'comprado', 'vendido'];
    const validDisponivelPara = ['compra', 'venda', 'ambos', 'nenhum']; // Ajuste conforme os valores do banco

    if (!validStatus.includes(status)) {
        return res.status(400).json({ error: 'Status inválido.' });
    }

    if (!validDisponivelPara.includes(disponivelPara)) {
        return res.status(400).json({ error: 'Valor de "disponivel_para" inválido.' });
    }

    try {
        // Atualização no banco de dados
        const [result] = await pool.query(
            'UPDATE veiculos SET status = ?, disponivel_para = ? WHERE veiculoId = ?',
            [status, disponivelPara, veiculoId]
        );

        // Verifica se algum registro foi afetado
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Veículo não encontrado.' });
        }

        res.json({ message: 'Status do veículo atualizado com sucesso.' });
    } catch (error) {
        console.error("Erro ao atualizar status do veículo:", error);
        res.status(500).json({ error: 'Erro ao atualizar status do veículo', details: error.message });
    }
});

// Atualizar um veículo
router.put('/:veiculoId', async (req, res) => {
    const { veiculoId } = req.params;
    const { chassi, placa, marca, modelo, ano_fabricacao, cor, valor, disponivel_para } = req.body;
    try {
        await pool.query(
            'UPDATE veiculos SET chassi = ?, placa = ?, marca = ?, modelo = ?, ano_fabricacao = ?, cor = ?, valor = ?, disponivel_para = ? WHERE veiculoId = ?',
            [chassi, placa, marca, modelo, ano_fabricacao, cor, valor, disponivel_para, veiculoId]
        );
        res.json({ message: 'Veículo atualizado com sucesso' });
    } catch (error) {
        console.error("Erro ao atualizar veículo:", error);
        res.status(500).json({ error: 'Erro ao atualizar veículo', details: error.message });
    }
});

// Deletar um veículo pelo ID (apenas Gerente pode deletar)
router.delete('/:veiculoId', authenticateToken, isGerente, async (req, res) => {
    const { veiculoId } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM veiculos WHERE veiculoId = ?', [veiculoId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Veículo não encontrado' });
        }

        res.json({ message: 'Veículo deletado com sucesso' });
    } catch (error) {
        console.error("Erro ao deletar veículo:", error);
        res.status(500).json({ error: 'Erro ao deletar veículo', details: error.message });
    }
});

module.exports = router;
