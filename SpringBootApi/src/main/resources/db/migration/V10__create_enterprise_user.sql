CREATE TABLE enterprise_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    enterprise_id BIGINT NOT NULL,
    CONSTRAINT fk_enterprise_user_user FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_enterprise_user_enterprise FOREIGN KEY (enterprise_id)
        REFERENCES enterprise(id)
        ON DELETE CASCADE,
    CONSTRAINT uc_user_enterprise UNIQUE (user_id, enterprise_id)
);
