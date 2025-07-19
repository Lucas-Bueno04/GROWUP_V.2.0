package com.prometech.growupapi.repositories;

import com.prometech.growupapi.domain.AdminIndicator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminIndicatorRepository extends JpaRepository<AdminIndicator, Long> {
	boolean existsByCod(String cod);
}
