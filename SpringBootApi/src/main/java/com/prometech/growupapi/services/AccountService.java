package com.prometech.growupapi.services;

import com.prometech.growupapi.domain.Account;
import com.prometech.growupapi.domain.Group;
import com.prometech.growupapi.repositories.AccountRepository;
import com.prometech.growupapi.repositories.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountService {
	
	@Autowired
	private AccountRepository accountRepository;
	
	@Autowired
	private GroupRepository groupRepository;
	
	public Account createAccount(Account account){
		if(account.getGroup()==null || account.getGroup().getId() == null){
			throw new IllegalArgumentException("Grupo é obrigatorio para criar uma conta");
		}
		Long groupId = account.getGroup().getId();
		Group group = groupRepository.findById(groupId).orElseThrow(()->new RuntimeException("Grupo informado não encontrado"));
		
		account.setGroup(group);
		return accountRepository.save(account);
	}
	
	public Account updateAccount(Long id, Account updatedAccount){
		Account existing = accountRepository.findById(id).orElseThrow(()-> new RuntimeException("Conta não encontrada"));
		
		existing.setCod(updatedAccount.getCod());
		existing.setName(updatedAccount.getName());
		
		if(updatedAccount.getGroup()!=null){
			Long groupId = updatedAccount.getGroup().getId();
			Group group = groupRepository.findById(groupId).orElseThrow(()-> new RuntimeException("Grupo informado não encontrado"));
			existing.setGroup(group);
		}
		
		return accountRepository.save(existing);
	}
	
	public void deleteAccountById(Long id){
		accountRepository.deleteById(id);
	}
}
