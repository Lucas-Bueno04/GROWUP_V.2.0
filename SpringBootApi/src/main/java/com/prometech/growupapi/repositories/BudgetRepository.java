package com.prometech.growupapi.repositories;

import com.prometech.growupapi.domain.Budget;
import com.prometech.growupapi.domain.Enterprise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
	Optional<Budget> findByYearAndEnterpriseId(Integer year, Long EnterpriseId);
	List<Budget> findByEnterpriseUserEmail(String email);
	List<Budget> findByEnterprise(Enterprise enterprise);
}
