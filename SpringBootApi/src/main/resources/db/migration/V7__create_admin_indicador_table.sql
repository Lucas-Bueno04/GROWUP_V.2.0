CREATE TABLE admin_indicators (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cod VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    formula TEXT NOT NULL,
    unity VARCHAR(255),
    better_when VARCHAR(255)
);