package com.prometech.growupapi.repositories;

import com.prometech.growupapi.domain.UserIndicator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserIndicatorRepository extends JpaRepository<UserIndicator,Long> {
	List<UserIndicator> findByUserId(Long userId);
	boolean existsByCodAndUserId(String cod, Long userId);
}
