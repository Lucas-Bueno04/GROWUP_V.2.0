package com.prometech.growupapi.repositories;

import com.prometech.growupapi.domain.Size;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.Optional;

public interface SizeRepository extends JpaRepository<Size, Long> {
	Optional<Size> findByMinValueLessThanEqualAndMaxValueGreaterThanEqual(BigDecimal invoicing1, BigDecimal invoicing2);
}
