CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    cpf VARCHAR(11) UNIQUE,
    phone VARCHAR(255),
    birth_date DATE,
    status INT,
    type INT
);