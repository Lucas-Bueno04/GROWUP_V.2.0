package com.prometech.growupapi.controllers;

import com.prometech.growupapi.domain.Group;
import com.prometech.growupapi.services.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/group")
@RequiredArgsConstructor
public class GroupController {
	
	@Autowired
	private GroupService groupService;
	
	@PostMapping("/create")
	public ResponseEntity<Group> createGroupWithAccount(@RequestBody Group group){
		Group savedGroup = groupService.saveGroupWithAccounts(group);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedGroup);
	}
	
	@GetMapping()
	public ResponseEntity<List<Group>> getAllGroupsWithAccounts(){
		List<Group> groups = groupService.getAllGroupsWithAccounts();
		return ResponseEntity.ok(groups);
	}
	
	@PutMapping("/update/{id}")
	public ResponseEntity<Group> updateGroup(@PathVariable Long id,@RequestBody Group group){
		Group updatedGroup = groupService.updateGroup(id, group);
		return ResponseEntity.ok(updatedGroup);
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Void> deleteGroup(@PathVariable Long id){
		groupService.deleteGroupById(id);
		return ResponseEntity.noContent().build();
	}
}
