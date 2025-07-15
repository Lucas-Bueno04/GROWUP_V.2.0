package com.prometech.growupapi.controllers;

import com.prometech.growupapi.domain.Account;
import com.prometech.growupapi.services.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/account")
@RequiredArgsConstructor
public class AccountController {

	@Autowired
	private AccountService accountService;
	
	@PutMapping("/update/{id}")
	public ResponseEntity<Account> updateAccount(@PathVariable Long id, @RequestBody Account account){
		Account updatedAccount = accountService.updateAccount(id, account);
		return  ResponseEntity.ok(updatedAccount);
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Void> deleteAccountById(@PathVariable Long id){
		accountService.deleteAccountById(id);
		
		return  ResponseEntity.noContent().build();
	}
	
	@PostMapping("/create")
	public  ResponseEntity<Account> createAccount(@RequestBody Account account){
		Account created = accountService.createAccount(account);
		return ResponseEntity.ok(created);
	}
}
