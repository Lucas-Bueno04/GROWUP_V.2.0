package com.prometech.growupapi.repositories;

import com.prometech.growupapi.domain.AccountValue;
import com.prometech.growupapi.domain.ValueType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountValueRepository extends JpaRepository<AccountValue, Long> {
	List<AccountValue> findByMonthBudgetIdAndValueType(Long monthBudgetId, ValueType valueType);
}
