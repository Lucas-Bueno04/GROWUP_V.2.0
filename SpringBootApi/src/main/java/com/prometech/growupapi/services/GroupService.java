package com.prometech.growupapi.services;

import com.prometech.growupapi.domain.Group;
import com.prometech.growupapi.repositories.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupService {

	@Autowired
	private GroupRepository groupRepository;
	
	public Group saveGroupWithAccounts(Group group){
		if(group.getAccounts()!=null){
			group.getAccounts().forEach(account -> account.setGroup(group));
			
		}
		
		return  groupRepository.save(group);
		
	}
	
	public List<Group> getAllGroupsWithAccounts(){
		return  groupRepository.findAllWithAccounts();
	}
	
	public Group updateGroup(Long id, Group updateGroup){
		Group existing = groupRepository.findById(id).orElseThrow(()-> new RuntimeException("Grupo não encontrado"));
		
		existing.setCod(updateGroup.getCod());
		existing.setName(updateGroup.getName());
		
		existing.getAccounts().clear();
		if (updateGroup.getAccounts()!=null){
			updateGroup.getAccounts().forEach(account -> {
				account.setGroup(existing);
				existing.getAccounts().add(account);
			});
		}
		
		return groupRepository.save(existing);
	}
	
	public void deleteGroupById(Long id){
		groupRepository.deleteById(id);
	}
}
