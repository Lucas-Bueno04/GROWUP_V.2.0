package com.prometech.growupapi.repositories;

import com.prometech.growupapi.domain.UserEnterprise;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserEnterpriseRepository extends JpaRepository<UserEnterprise, Long> {
}
