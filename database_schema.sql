-- Tabela de Clientes
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) UNIQUE NOT NULL, -- Chave principal para o WhatsApp
    address TEXT,
    notes TEXT, -- Observações gerais (ex: "Sem cebola")
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Preferências (O "De sempre")
CREATE TABLE preferences (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    item_name VARCHAR(255) NOT NULL, -- Ex: "Carne Assada"
    full_description TEXT NOT NULL, -- Ex: "Marmita média, carne assada, feijão carioca, sem cebola"
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);

-- Tabela de Carteira/Créditos
CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) UNIQUE,
    balance DECIMAL(10, 2) DEFAULT 0.00, -- Saldo atual
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Histórico de Transações (Para extrato)
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    wallet_id INTEGER REFERENCES wallets(id),
    amount DECIMAL(10, 2) NOT NULL, -- Negativo para pedidos, Positivo para recargas
    description VARCHAR(255), -- Ex: "Pedido 19/12 - Carne Assada"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSERIR DADOS DE TESTE (VOCÊ)
INSERT INTO clients (name, phone, address) 
VALUES ('Hiago', 'BR_PHONE_NUMBER', 'Aziz Nachif, 180, Itamaraca'); 
-- (Substituiremos pelo seu número real no n8n)

INSERT INTO wallets (client_id, balance) 
VALUES (1, 500.00); -- Começando com 500 reais de crédito

INSERT INTO preferences (client_id, item_name, full_description, price)
VALUES (1, 'Carne Assada', 'Marmita Carne Assada, ponto bem passado, sem salada', 38.25);

-- Tabela de Cardápio Diário
CREATE TABLE daily_menus (
    id SERIAL PRIMARY KEY,
    day_of_week VARCHAR(20) NOT NULL, -- 'Monday', 'Tuesday', ...
    option_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) DEFAULT 25.00
);

-- Popular Cardápio (Baseado nas imagens enviadas)
-- SEGUNDA
INSERT INTO daily_menus (day_of_week, option_number, title, description) VALUES 
('Monday', 1, 'Frango Assado', 'Espaguete alho e óleo, arroz, feijão, purê de batata, salada'),
('Monday', 2, 'Lasanha à Bolonhesa', 'Legumes refogados, arroz, feijão, salada'),
('Monday', 3, 'Bife à Cavalo', 'Fixo'),
('Monday', 4, 'Tilápia', 'Fixo');

-- TERÇA
INSERT INTO daily_menus (day_of_week, option_number, title, description) VALUES 
('Tuesday', 1, 'Bobó de Galinha', 'Batata palha, arroz e salada'),
('Tuesday', 2, 'Carne de Panela', 'Batata, cenoura, penne c/ bacon, arroz, feijão, farofa'),
('Tuesday', 3, 'Bife à Cavalo', 'Fixo: Batata chips, arroz, feijão, farofa, salada'),
('Tuesday', 4, 'Tilápia', 'Fixo: Batata chips, arroz, feijão, salada');

-- QUARTA
INSERT INTO daily_menus (day_of_week, option_number, title, description) VALUES 
('Wednesday', 1, 'Feijoada Completa', 'Couve, arroz, laranja, farofa, salada'),
('Wednesday', 2, 'Almôndegas ao Molho', 'Espaguete alho e óleo, arroz, feijão, farofa, salada'),
('Wednesday', 3, 'Bife à Cavalo', 'Fixo'),
('Wednesday', 4, 'Tilápia', 'Fixo');

-- QUINTA
INSERT INTO daily_menus (day_of_week, option_number, title, description) VALUES 
('Thursday', 1, 'Arroz Carreteiro', 'Ovo frito, mandioca, feijão c/ bacon, farofa, salada'),
('Thursday', 2, 'Filé de Frango à Milanesa', 'Macarrão, arroz, feijão c/ bacon, creme de milho'),
('Thursday', 3, 'Bife à Cavalo', 'Fixo'),
('Thursday', 4, 'Tilápia', 'Fixo');

-- SEXTA
INSERT INTO daily_menus (day_of_week, option_number, title, description) VALUES 
('Friday', 1, 'Carne e Linguiça Assada', 'Mandioca, arroz, feijão, farofa, salada'),
('Friday', 2, 'Frango Xadrez', 'Espaguete, arroz, feijão, pastelzinho, salada'),
('Friday', 3, 'Bife à Cavalo', 'Fixo'),
('Friday', 4, 'Tilápia', 'Fixo');

-- SÁBADO
INSERT INTO daily_menus (day_of_week, option_number, title, description) VALUES 
('Saturday', 1, 'Feijoada Completa', 'Couve, arroz, laranja, farofa, salada'),
('Saturday', 2, 'Frango Assado', 'Macarrão, arroz, feijão, batata rústica, salada'),
('Saturday', 3, 'Bife à Cavalo', 'Fixo'),
('Saturday', 4, 'Tilápia à Parmegiana', 'Batata chips, arroz, feijão, salada');
