package com.prometech.growupapi.repositories;

import com.prometech.growupapi.domain.EnterpriseGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnterpriseGroupRepository extends JpaRepository<EnterpriseGroup, Long> {
}
