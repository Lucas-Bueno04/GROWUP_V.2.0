CREATE TABLE enterprise (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cnpj VARCHAR(20),
    corporate_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    size_id BIGINT,
    tax_regime VARCHAR(100),
    sector VARCHAR(100),
    region VARCHAR(100),
    invoicing DECIMAL(19,2),
    user_id BIGINT NOT NULL,

    CONSTRAINT fk_enterprise_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_enterprise_size
        FOREIGN KEY (size_id)
        REFERENCES size(id)
);
