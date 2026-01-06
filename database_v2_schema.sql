-- Limpar tabelas antigas para nova estrutura
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS preferences CASCADE;
DROP TABLE IF EXISTS daily_menus CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

-- Nova Tabela de Categorias
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Nova Tabela de Produtos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2)
);

-- Tabela de Opções de Preço (Tamanhos)
CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    variant_name VARCHAR(50), -- Mini, Média, Grande, Executiva, etc.
    price DECIMAL(10, 2) NOT NULL
);

-- Tabela de Cardápio Semanal (Link com produtos)
CREATE TABLE weekly_schedule (
    id SERIAL PRIMARY KEY,
    day_of_week VARCHAR(20) NOT NULL,
    option_number INTEGER,
    product_id INTEGER REFERENCES products(id)
);

-- Manter estrutura de Clientes e Saldo
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) UNIQUE,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE preferences (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    product_id INTEGER REFERENCES products(id),
    variant_id INTEGER REFERENCES product_variants(id),
    notes TEXT
);

-- Popular Categorias
INSERT INTO categories (name) VALUES 
('Marmitex do Dia'), ('Combos'), ('Bebidas'), ('Cervejas'), ('Sobremesas'), ('Porções de Acompanhamento');

-- Exemplo de inserção de produto variável (Feijoada)
INSERT INTO products (category_id, name, description) 
VALUES (1, 'Feijoada Completa', 'Arroz, Feijoada Completa, Couve Refogada, Laranja, Farofa da Casa e Salada do Dia.');

INSERT INTO product_variants (product_id, variant_name, price) VALUES 
(1, 'Mini', 17.00), (1, 'Média', 20.00), (1, 'Grande', 22.00), (1, 'Executiva', 25.00);

-- Exemplo de inserção de produto fixo (Bebida)
INSERT INTO products (category_id, name, base_price) 
VALUES (3, 'Coca-Cola 2L', 13.50);
