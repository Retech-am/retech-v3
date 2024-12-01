const jwt = require('jsonwebtoken');
const secretKey = 'seu-segredo-seguro'; // Use a mesma chave secreta usada para gerar tokens

// Middleware para autenticar o token JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Espera o token no formato "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = user; // Adiciona o usuário autenticado à requisição
        next();
    });
}

module.exports = authenticateToken;
