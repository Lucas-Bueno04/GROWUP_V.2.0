package com.prometech.growupapi.repositories;

import com.prometech.growupapi.domain.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {
	// Evita N+1 ao buscar grupos com suas contas
	@Query("SELECT g FROM Group g LEFT JOIN FETCH g.accounts ORDER BY g.cod")
	List<Group> findAllWithAccounts();
}
