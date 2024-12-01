const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',        // Endereço do banco de dados
    user: 'retech_user',       // Usuário configurado
    password: 'senhaUsuario',  // Senha do usuário
    database: 'retech_db',     // Nome do banco de dados
    port: 3306                 // Porta do MariaDB
});

module.exports = pool;
