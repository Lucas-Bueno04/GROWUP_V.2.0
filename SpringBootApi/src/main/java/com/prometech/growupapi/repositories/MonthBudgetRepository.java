package com.prometech.growupapi.repositories;

import com.prometech.growupapi.domain.MonthBudget;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonthBudgetRepository extends JpaRepository<MonthBudget, Long> {
}
