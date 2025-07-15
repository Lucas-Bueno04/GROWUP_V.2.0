
CREATE TABLE budget (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    year INT NOT NULL,
    enterprise_id BIGINT NOT NULL,
    FOREIGN KEY (enterprise_id) REFERENCES enterprise(id)
);

CREATE TABLE month_budget (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    month VARCHAR(20) NOT NULL, -- usando enum como string
    budget_id BIGINT NOT NULL,
    FOREIGN KEY (budget_id) REFERENCES budget(id) ON DELETE CASCADE
);

CREATE TABLE account_value (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    value DECIMAL(15, 2) NOT NULL,
    value_type VARCHAR(20) NOT NULL, -- enum
    account_id BIGINT NOT NULL,
    month_budget_id BIGINT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES account(id),
    FOREIGN KEY (month_budget_id) REFERENCES month_budget(id) ON DELETE CASCADE
);
