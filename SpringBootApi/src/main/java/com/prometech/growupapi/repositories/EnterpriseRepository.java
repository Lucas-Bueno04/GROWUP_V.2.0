package com.prometech.growupapi.repositories;

import com.prometech.growupapi.domain.Enterprise;
import com.prometech.growupapi.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnterpriseRepository extends JpaRepository<Enterprise, Long> {
	List<Enterprise> findAllByUser(User user);
}
