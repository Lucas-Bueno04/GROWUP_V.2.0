CREATE TABLE enterprise (
    id BIGINT NOT NULL AUTO_INCREMENT,
    corporate_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    phone VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    tax_regime VARCHAR(255),
    sector VARCHAR(255),
    region VARCHAR(255),
    invoicing DECIMAL(19,2) NOT NULL,

    size_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,

    PRIMARY KEY (id),

    CONSTRAINT fk_enterprise_size FOREIGN KEY (size_id)
        REFERENCES size(id),

    CONSTRAINT fk_enterprise_user FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE
);
