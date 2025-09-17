package com.prometech.growupapi.services;

import com.prometech.growupapi.domain.Enterprise;
import com.prometech.growupapi.domain.EnterpriseUser;
import com.prometech.growupapi.domain.User;
import com.prometech.growupapi.dto.InsertEntepriseUserDto;
import com.prometech.growupapi.dto.ResponseEnterpriseDto;
import com.prometech.growupapi.dto.UserDto;
import com.prometech.growupapi.repositories.BudgetRepository;
import com.prometech.growupapi.repositories.EnterpriseUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnterpriseUserService {

	@Autowired
	private EnterpriseUserRepository enterpriseUserRepository;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private EnterpriseService enterpriseService;
	
	@Autowired
	private BudgetRepository budgetRepository;
	
	public void insertEnterpriseUser(InsertEntepriseUserDto insertEntepriseUserDto){
		
		User user = userService.getUserEntityByEmail(insertEntepriseUserDto.emailUser());
		Enterprise enterprise = enterpriseService.getEnterpriseById(insertEntepriseUserDto.idEnterprise());
		EnterpriseUser enterpriseUser = new EnterpriseUser();
		enterpriseUser.setEnterprise(enterprise);
		enterpriseUser.setUser(user);
		enterpriseUserRepository.save(enterpriseUser);
	}
	
	public void deleteByEmailAndEnterpriseId(String email, Long enterpriseId){
		User user = userService.getUserEntityByEmail(email);
		Enterprise enterprise = enterpriseService.getEnterpriseById(enterpriseId);
		
		EnterpriseUser enterpriseUser = enterpriseUserRepository
				                                .findByUserAndEnterprise(user, enterprise)
				                                .orElseThrow(()->new RuntimeException("Vinculo com empresa não encontrado!"));
		
		enterpriseUserRepository.delete(enterpriseUser);
	}
	
	public void deleteAllByEnterpriseId(Long enterpriseId){
		Enterprise enterprise = enterpriseService.getEnterpriseById(enterpriseId);
		enterpriseUserRepository.deleteByEnterprise(enterprise);
	}
	
	public List<ResponseEnterpriseDto> getEnterpriseByUserEmail(String email){
		
		User user = userService.getUserEntityByEmail(email);
		List<EnterpriseUser> enterpriseUsers = enterpriseUserRepository.findByUser(user);
		return enterpriseUsers.stream()
				       .map(eu->enterpriseService.mapToDto(eu.getEnterprise()))
				       .collect(Collectors.toList());
	}
	
	public boolean userHasAcess(Long budget_id, String email){
		
		User user = userService.getUserEntityByEmail(email);
		List<EnterpriseUser> enterpriseUsers = enterpriseUserRepository.findByUser(user);
		List<Enterprise> enterprises = enterpriseUsers.stream()
				                               .map(EnterpriseUser::getEnterprise)
				                               .toList();
		
		return budgetRepository.findById(budget_id)
				       .map(budget->enterprises.contains(budget.getEnterprise()))
				       .orElse(false);
	}
	
}
