-- 1. LIMPEZA E CRIAÇÃO (V2)
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS preferences CASCADE;
DROP TABLE IF EXISTS weekly_schedule CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

-- ESTRUTURA
CREATE TABLE categories (id SERIAL PRIMARY KEY, name VARCHAR(100));
CREATE TABLE products (id SERIAL PRIMARY KEY, category_id INTEGER REFERENCES categories(id), name VARCHAR(255), description TEXT, base_price DECIMAL(10,2));
CREATE TABLE product_variants (id SERIAL PRIMARY KEY, product_id INTEGER REFERENCES products(id), variant_name VARCHAR(50), price DECIMAL(10,2));
CREATE TABLE weekly_schedule (id SERIAL PRIMARY KEY, day_of_week VARCHAR(20), option_number INTEGER, product_id INTEGER REFERENCES products(id));
CREATE TABLE clients (id SERIAL PRIMARY KEY, name VARCHAR(255), phone VARCHAR(50) UNIQUE, address TEXT, notes TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE wallets (id SERIAL PRIMARY KEY, client_id INTEGER REFERENCES clients(id) UNIQUE, balance DECIMAL(10,2) DEFAULT 0.00, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- 2. POPULAR CATEGORIAS
INSERT INTO categories (name) VALUES 
('Marmitex do Dia'), ('Cardapio Semanal'), ('Combos'), ('Bebidas'), ('Cervejas'), ('Sobremesas'), ('Porções de Acompanhamento');

-- 3. MARMITEX DO DIA (Categorias de Tamanho)
-- Feijoada Completa
INSERT INTO products (category_id, name, description) VALUES (1, 'Feijoada Completa', 'Arroz, Feijoada Completa, Couve Refogada, Laranja, Farofa da Casa e Salada do Dia.');
INSERT INTO product_variants (product_id, variant_name, price) VALUES (1, 'Mini', 17.00), (1, 'Média', 20.00), (1, 'Grande', 22.00), (1, 'Executiva', 25.00);

-- Frango Assado
INSERT INTO products (category_id, name, description) VALUES (1, 'Frango Assado', 'Arroz, Feijão, Frango Assado, Espaguete Alho e Óleo, Batata Rústica e Salada do Dia.');
INSERT INTO product_variants (product_id, variant_name, price) VALUES (2, 'Mini', 17.00), (2, 'Média', 20.00), (2, 'Grande', 22.00), (2, 'Executiva', 25.00);

-- Bife à Cavalo
INSERT INTO products (category_id, name, description) VALUES (1, 'Bife à Cavalo', 'Arroz, Feijão c/ Bacon, Bife á Cavalo, Farofa da Casa, Batata Chips e Salada do Dia');
INSERT INTO product_variants (product_id, variant_name, price) VALUES (3, 'Mini', 18.90), (3, 'Média', 21.90), (3, 'Grande', 23.90), (3, 'Executiva', 26.90);

-- Tilápia
INSERT INTO products (category_id, name, description) VALUES (1, 'Tilápia', 'Arroz, Feijão c/ Bacon, Tilápia, Batata Chips e Salada do Dia');
INSERT INTO product_variants (product_id, variant_name, price) VALUES (4, 'Mini', 19.90), (4, 'Média', 22.90), (4, 'Grande', 24.90), (4, 'Executiva', 27.90);

-- 4. OUTROS PRODUTOS (Cardápio Semanal Específicos)
INSERT INTO products (category_id, name, description) VALUES 
(2, 'Lasanha à Bolonhesa', 'Legumes Refogados, Arroz e Feijão, Salada do Dia.'), -- ID 5
(2, 'Bobó de Galinha', 'Batata Palha, Arroz, Salada do Dia.'), -- ID 6
(2, 'Carne de Panela', 'Batata e Cenoura, Penne c/ Bacon, Arroz e Feijão, Farofa da Casa, Salada do Dia.'), -- ID 7
(2, 'Almôndegas ao Molho Sugo', 'Espaguete Alho e Óleo, Arroz e Feijão, Farofa da Casa, Salada do Dia.'), -- ID 8
(2, 'Arroz Carreteiro', 'Ovo Frito e Mandioca, Feijão c/ Bacon, Farofa da Casa, Salada do Dia.'), -- ID 9
(2, 'Filé de Frango à Milanesa', 'Macarrão Alho e Óleo, Arroz e Feijão c/ Bacon, Creme de Milho, Salada do Dia.'), -- ID 10
(2, 'Carne e Linguiça Assada', 'Mandioca, Arroz e Feijão, Farofa da Casa, Salada do Dia.'), -- ID 11
(2, 'Frango Xadrez', 'Espaguete a Moda da Casa, Arroz e Feijão, Pastelzinho, Salada do Dia.'); -- ID 12

-- 5. CRONOGRAMA SEMANAL (Weekly Schedule)
-- Segunda
INSERT INTO weekly_schedule (day_of_week, option_number, product_id) VALUES ('Monday', 1, 2), ('Monday', 2, 5), ('Monday', 3, 3), ('Monday', 4, 4);
-- Terça
INSERT INTO weekly_schedule (day_of_week, option_number, product_id) VALUES ('Tuesday', 1, 6), ('Tuesday', 2, 7), ('Tuesday', 3, 3), ('Tuesday', 4, 4);
-- Quarta
INSERT INTO weekly_schedule (day_of_week, option_number, product_id) VALUES ('Wednesday', 1, 1), ('Wednesday', 2, 8), ('Wednesday', 3, 3), ('Wednesday', 4, 4);
-- Quinta
INSERT INTO weekly_schedule (day_of_week, option_number, product_id) VALUES ('Thursday', 1, 9), ('Thursday', 2, 10), ('Thursday', 3, 3), ('Thursday', 4, 4);
-- Sexta
INSERT INTO weekly_schedule (day_of_week, option_number, product_id) VALUES ('Friday', 1, 11), ('Friday', 2, 12), ('Friday', 3, 3), ('Friday', 4, 4);
-- Sábado
INSERT INTO weekly_schedule (day_of_week, option_number, product_id) VALUES ('Saturday', 1, 1), ('Saturday', 2, 2), ('Saturday', 3, 3), ('Saturday', 4, 4);

-- 6. BEBIDAS (Amostra para teste)
INSERT INTO products (category_id, name, base_price) VALUES (4, 'Coca-Cola Original 310ml', 5.00), (4, 'Coca-Cola 2L', 13.50), (4, 'Suco Dell Valle 290ml - Uva', 5.00), (4, 'Água Com Gás 500ml', 4.00);

-- 7. SOBREMESAS
INSERT INTO products (category_id, name, base_price) VALUES (6, 'Brigadeiro - 4un', 10.00), (6, 'Bala Baiana', 4.00);

-- 8. RESTAURAR USUÁRIO VIP (Hiago)
INSERT INTO clients (name, phone, address) VALUES ('Hiago', 'BR_PHONE_NUMBER_TEST', 'Aziz Nachif, 180, Itamaraca');
INSERT INTO wallets (client_id, balance) VALUES (1, 500.00);
