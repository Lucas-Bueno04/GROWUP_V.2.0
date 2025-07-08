package com.prometech.growupapi.repositories;

import com.prometech.growupapi.domain.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
}
