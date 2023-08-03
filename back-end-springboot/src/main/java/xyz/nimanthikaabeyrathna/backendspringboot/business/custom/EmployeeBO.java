package xyz.nimanthikaabeyrathna.backendspringboot.business.custom;

import xyz.nimanthikaabeyrathna.backendspringboot.dto.EmployeeDTO;

import java.util.List;

public interface EmployeeBO {
    List<EmployeeDTO> getAllEmployees() throws Exception;

    void saveEmployee(EmployeeDTO employeeDTO) throws Exception;

    void deleteEmployee(String employeeID) throws Exception;

    void updateEmployee(EmployeeDTO employeeDTO) throws Exception;

}
