
-- Script para criação do banco de dados e tabelas

CREATE DATABASE IF NOT EXISTS retech_db;
USE retech_db;

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clientes (
    clienteId INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cpf VARCHAR(11) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    numero_residencia VARCHAR(10),
    rua VARCHAR(100),
    bairro VARCHAR(50),
    cidade VARCHAR(50),
    estado VARCHAR(2),
    cep VARCHAR(10),
    telefone VARCHAR(20),
    celular VARCHAR(20),
    renda DECIMAL(10,2)
);

-- Tabela de Veículos
CREATE TABLE IF NOT EXISTS veiculos (
    veiculoId INT AUTO_INCREMENT PRIMARY KEY,
    chassi VARCHAR(50) UNIQUE NOT NULL,
    placa VARCHAR(20) UNIQUE NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    ano_fabricacao INT NOT NULL,
    cor VARCHAR(30),
    valor DECIMAL(10, 2) NOT NULL,
    status ENUM('disponível', 'comprado', 'vendido') DEFAULT 'disponível',
    disponivel_para ENUM('compra', 'venda', 'ambos') DEFAULT 'ambos'
);

-- Tabela de Montadoras
CREATE TABLE IF NOT EXISTS montadoras (
    montadoraId INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cnpj VARCHAR(14) NOT NULL,
    razao_social VARCHAR(200) NOT NULL,
    marca VARCHAR(100),
    contato VARCHAR(100),
    telefone_comercial VARCHAR(20),
    celular VARCHAR(20)
);

-- Tabela de Vendedores
CREATE TABLE IF NOT EXISTS vendedores (
    vendedorId INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(10) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255),
    cargo ENUM('Vendedor', 'Gerente') DEFAULT 'Vendedor'
);

-- Tabela de Compras
CREATE TABLE IF NOT EXISTS compras (
    compraId INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cod_compra VARCHAR(20),
    data DATE NOT NULL,
    cliente_id INT(11) NOT NULL,
    vendedor_id INT(11) NOT NULL,
    veiculo_id INT(11) NOT NULL,
    valor DECIMAL(10,2),
    FOREIGN KEY (cliente_id) REFERENCES clientes(clienteId),
    FOREIGN KEY (vendedor_id) REFERENCES vendedores(vendedorId),
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(veiculoId)
);

-- Tabela de Vendas
CREATE TABLE IF NOT EXISTS vendas (
    vendaId INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cod_venda VARCHAR(20),
    data DATE NOT NULL,
    cliente_id INT(11) NOT NULL,
    vendedor_id INT(11) NOT NULL,
    veiculo_id INT(11) NOT NULL,
    valor_entrada DECIMAL(10,2),
    valor_financiado DECIMAL(10,2),
    valor_total DECIMAL(10,2),
    FOREIGN KEY (cliente_id) REFERENCES clientes(clienteId),
    FOREIGN KEY (vendedor_id) REFERENCES vendedores(vendedorId),
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(veiculoId)
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    pedidoId INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cod_pedido VARCHAR(20),
    data DATE NOT NULL,
    cliente_id INT(11) NOT NULL,
    montadora_id INT(11) NOT NULL,
    modelo VARCHAR(100),
    ano INT(11),
    cor VARCHAR(50),
    acessorios TEXT,
    valor DECIMAL(10,2),
    status ENUM('pendente', 'aprovado', 'cancelado') DEFAULT 'pendente',
    FOREIGN KEY (cliente_id) REFERENCES clientes(clienteId),
    FOREIGN KEY (montadora_id) REFERENCES montadoras(montadoraId)
);