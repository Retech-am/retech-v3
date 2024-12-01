const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const secretKey = 'seu-segredo-seguro'; // Mantenha isso seguro e secreto


// Middleware para verificar token JWT e adicionar cargo do usuário
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401); // Sem token, retorna 401

    jwt.verify(token.split(' ')[1], secretKey, (err, user) => {
        if (err) return res.sendStatus(403); // Token inválido, retorna 403
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

// Rota de Login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM vendedores WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Vendedor não encontrado" });
        }

        const vendedor = rows[0];
        const senhaValida = await bcrypt.compare(senha, vendedor.senha);
        if (!senhaValida) {
            return res.status(401).json({ success: false, message: "Senha incorreta" });
        }

        // Gera o token JWT com o cargo incluído
        const token = jwt.sign({ vendedorId: vendedor.vendedorId, email: vendedor.email, cargo: vendedor.cargo }, secretKey, { expiresIn: '1h' });
        res.json({ success: true, token });
    } catch (error) {
        console.error("Erro ao realizar login:", error);
        res.status(500).json({ success: false, message: "Erro ao realizar login", details: error.message });
    }
});

// Verifica se já existe um gerente cadastrado
async function gerenteJaExiste() {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM vendedores WHERE cargo = 'Gerente'");
    return rows[0].total > 0;
}

// Cadastro de novo vendedor com verificação de cargo
router.post('/register', async (req, res) => {
    const { matricula, nome, email, cargo, senha } = req.body;

    try {
        if (cargo === 'Gerente') {
            // Verifica se já existe um gerente
            const existeGerente = await gerenteJaExiste();
            if (existeGerente) {
                return res.status(400).json({ message: 'Já existe um gerente registrado. Por favor, cadastre-se como vendedor.' });
            }
        }

        const hashedPassword = await bcrypt.hash(senha, 10);
        await pool.query(
            'INSERT INTO vendedores (matricula, nome, email, cargo, senha) VALUES (?, ?, ?, ?, ?)',
            [matricula, nome, email, cargo, hashedPassword]
        );
        res.json({ message: 'Vendedor cadastrado com sucesso' });
    } catch (error) {
        console.error("Erro ao cadastrar vendedor:", error);
        res.status(500).json({ error: 'Erro ao cadastrar vendedor', details: error.message });
    }
});

// Rota para obter o perfil do vendedor logado
router.get('/perfil', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT vendedorId, matricula, nome, email, cargo FROM vendedores WHERE vendedorId = ?', [req.user.vendedorId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Perfil não encontrado" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error("Erro ao buscar perfil do vendedor:", error);
        res.status(500).json({ error: "Erro ao buscar perfil do vendedor" });
    }
});

// Listar todos os vendedores
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT vendedorId, matricula, nome, email, cargo FROM vendedores');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar vendedores:', error);
        res.status(500).json({ message: 'Erro ao buscar vendedores' });
    }
});

// Rota para buscar um vendedor específico pelo ID
router.get('/:vendedorId', authenticateToken, async (req, res) => {
    const { vendedorId } = req.params;

    try {
        const [rows] = await pool.query('SELECT vendedorId, matricula, nome, email, cargo FROM vendedores WHERE vendedorId = ?', [vendedorId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Vendedor não encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Erro ao buscar vendedor:', error);
        res.status(500).json({ message: 'Erro ao buscar vendedor' });
    }
});

// Atualizar um vendedor (Gerente e Vendedor podem acessar, mas cargo de Gerente pode ser apenas por outro Gerente)
router.put('/:vendedorId', authenticateToken, async (req, res) => {
    const { vendedorId } = req.params;
    const { matricula, nome, email, cargo, senha } = req.body;

    try {
        // Verifica se o usuário atual é Gerente para permitir a atualização de cargos
        if (cargo === 'Gerente' && req.user.cargo !== 'Gerente') {
            return res.status(403).json({ message: 'Apenas gerentes podem promover outros a Gerente' });
        }

        // Atualiza os campos normalmente
        const updatedFields = { matricula, nome, email, cargo };

        // Criptografa a senha se ela for fornecida
        if (senha) {
            const salt = await bcrypt.genSalt(10);
            updatedFields.senha = await bcrypt.hash(senha, salt);
        }

        // Gera a query dinâmica com base nos campos atualizados
        const fields = Object.keys(updatedFields).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updatedFields), vendedorId];

        await pool.query(
            `UPDATE vendedores SET ${fields} WHERE vendedorId = ?`,
            values
        );

        res.json({ message: 'Vendedor atualizado com sucesso' });
    } catch (error) {
        console.error("Erro ao atualizar vendedor:", error);
        res.status(500).json({ error: 'Erro ao atualizar vendedor', details: error.message });
    }
});

// Deletar um vendedor pelo ID (apenas Gerente pode deletar)
router.delete('/:vendedorId', authenticateToken, isGerente, async (req, res) => {
    const { vendedorId } = req.params;

    try {
        await pool.query('DELETE FROM vendedores WHERE vendedorId = ?', [vendedorId]);
        res.json({ message: 'Vendedor deletado com sucesso' });
    } catch (error) {
        console.error("Erro ao deletar vendedor:", error);
        res.status(500).json({ error: 'Erro ao deletar vendedor', details: error.message });
    }
});

module.exports = router;
