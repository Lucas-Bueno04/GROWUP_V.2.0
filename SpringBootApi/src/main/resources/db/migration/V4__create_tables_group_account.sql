-- Criação da tabela `group`
CREATE TABLE `group` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cod VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE account (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cod VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    group_id BIGINT,
    CONSTRAINT fk_account_group FOREIGN KEY (group_id) REFERENCES `group`(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);