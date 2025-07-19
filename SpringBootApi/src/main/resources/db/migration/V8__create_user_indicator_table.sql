CREATE TABLE user_indicators (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cod VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    formula TEXT NOT NULL,
    unity VARCHAR(255),
    better_when VARCHAR(255),
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_user_indicator_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT uq_user_indicator_cod UNIQUE (cod, user_id)
);