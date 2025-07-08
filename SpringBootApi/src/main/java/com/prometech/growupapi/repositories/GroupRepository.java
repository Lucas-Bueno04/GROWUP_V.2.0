package com.prometech.growupapi.repositories;

import com.prometech.growupapi.domain.Group;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<Group, Long> {
}
