package com.prometech.growupapi.services;

import com.prometech.growupapi.domain.Group;
import com.prometech.growupapi.repositories.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
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
		List<Group> groups = groupRepository.findAllWithAccounts();
		
		for (Group group : groups) {
			group.getAccounts().sort(Comparator.comparing(account -> {
				String cod = account.getCod();
				if (cod == null || cod.isBlank()) return Integer.MAX_VALUE;
				
				String[] parts = cod.split("\\.");
				if (parts.length < 2) return Integer.MAX_VALUE;
				
				// verifica se partes não estão vazias
				if (parts[0].isEmpty() || parts[1].isEmpty()) return Integer.MAX_VALUE;
				
				try {
					int major = Integer.parseInt(parts[0]);
					int minor = Integer.parseInt(parts[1]);
					return major * 1000 + minor;
				} catch (NumberFormatException e) {
					return Integer.MAX_VALUE;
				}
			}));
		}
		
		return groups;
		
		
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
