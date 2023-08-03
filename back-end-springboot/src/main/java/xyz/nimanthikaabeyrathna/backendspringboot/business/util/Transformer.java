package xyz.nimanthikaabeyrathna.backendspringboot.business.util;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import xyz.nimanthikaabeyrathna.backendspringboot.dto.EmployeeDTO;
import xyz.nimanthikaabeyrathna.backendspringboot.dto.SalaryDTO;
import xyz.nimanthikaabeyrathna.backendspringboot.entity.Employee;
import xyz.nimanthikaabeyrathna.backendspringboot.entity.Salary;


@Component
public class Transformer {
    private final ModelMapper mapper;

    public Transformer(ModelMapper mapper) {
        this.mapper = mapper;
    }

    public Employee toEmployeeEntity(EmployeeDTO employeeDTO) {

        return mapper.map(employeeDTO, Employee.class);

    }

    public EmployeeDTO fromEmployeeEntity(Employee employeeEntity) {
        return mapper.map(employeeEntity, EmployeeDTO.class);

    }

    public Salary toSalaryEntity(SalaryDTO salaryDTO) {

        return mapper.map(salaryDTO, Salary.class);

    }

    public SalaryDTO fromSalaryEntity(Salary salaryEntity) {
        return mapper.map(salaryEntity, SalaryDTO.class);

    }
}
