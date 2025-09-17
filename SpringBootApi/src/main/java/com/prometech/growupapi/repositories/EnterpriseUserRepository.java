package com.prometech.growupapi.repositories;

import com.prometech.growupapi.domain.Enterprise;
import com.prometech.growupapi.domain.EnterpriseUser;
import com.prometech.growupapi.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnterpriseUserRepository extends JpaRepository<EnterpriseUser, Long> {

	List<EnterpriseUser> findByEnterprise(Enterprise enterprise);
	
	List<EnterpriseUser> findByUser(User user);
	
	Optional<EnterpriseUser> findByUserAndEnterprise(User user, Enterprise enterprise);
	
	void deleteByEnterprise(Enterprise enterprise);
}
