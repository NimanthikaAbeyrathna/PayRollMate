package xyz.nimanthikaabeyrathna.backendspringboot.business.custom;

import xyz.nimanthikaabeyrathna.backendspringboot.dto.SalaryDTO;

import java.util.List;

public interface SalaryBO {
    List<SalaryDTO> getAllSalaries() throws Exception;

    void saveSalary(SalaryDTO salaryDTO) throws Exception;

    void deleteSalary(Integer id) throws Exception;

    void updateSalary(SalaryDTO salaryDTO) throws Exception;
}
