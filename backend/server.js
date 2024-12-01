const express = require('express');
const cors = require('cors');

const app = express();

// Configure o CORS para permitir o frontend
app.use(cors({ origin: 'http://localhost:3000' })); // Altere para a origem do frontend

const clientesRouter = require('./routes/clientes');
const veiculosRouter = require('./routes/veiculos');
const montadorasRouter = require('./routes/montadoras');
const comprasRouter = require('./routes/compras');
const vendasRouter = require('./routes/vendas');
const pedidosRouter = require('./routes/pedidos');
const vendedoresRouter = require('./routes/vendedores');

// Middleware para parsear JSON
app.use(express.json());

// Definindo as rotas
app.use('/api/clientes', clientesRouter);
app.use('/api/veiculos', veiculosRouter);
app.use('/api/montadoras', montadorasRouter);
app.use('/api/compras', comprasRouter);
app.use('/api/vendas', vendasRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/vendedores', vendedoresRouter);

// Porta onde o servidor vai escutar
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
