package xyz.nimanthikaabeyrathna.backendspringboot.business.custom.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import xyz.nimanthikaabeyrathna.backendspringboot.business.custom.EmployeeBO;
import xyz.nimanthikaabeyrathna.backendspringboot.business.exception.DuplicateRecordException;
import xyz.nimanthikaabeyrathna.backendspringboot.business.exception.RecordNotFoundException;
import xyz.nimanthikaabeyrathna.backendspringboot.business.util.Transformer;
import xyz.nimanthikaabeyrathna.backendspringboot.dao.custom.EmployeeDAO;
import xyz.nimanthikaabeyrathna.backendspringboot.dto.EmployeeDTO;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeBOImpl implements EmployeeBO {
    private final EmployeeDAO employeeDAO;
    private final Transformer transformer;

    public EmployeeBOImpl(EmployeeDAO employeeDAO, Transformer transformer) {
        this.employeeDAO = employeeDAO;
        this.transformer = transformer;
    }

    @Transactional(readOnly = true)
    @Override
    public List<EmployeeDTO> getAllEmployees() throws Exception {
        return employeeDAO.findAll().stream().map(transformer::fromEmployeeEntity).collect(Collectors.toList());
    }


    @Override
    public void saveEmployee(@RequestBody @Valid EmployeeDTO employeeDTO) throws Exception {

        if (employeeDAO.existsById(employeeDTO.getEmployeeID())){
            throw new DuplicateRecordException(employeeDTO.getEmployeeID()+" already exist");
        }
        employeeDAO.save(transformer.toEmployeeEntity(employeeDTO));
    }

    @Override
    public void deleteEmployee(String employeeID) throws Exception {
        employeeDAO.deleteById(employeeID);
    }

    @Override
    public void updateEmployee(EmployeeDTO employeeDTO) throws Exception {
        if (!employeeDAO.existsById(employeeDTO.getEmployeeID())){
            throw new RecordNotFoundException(employeeDTO.getEmployeeID()+" does not exist");
        }
        employeeDAO.update(transformer.toEmployeeEntity(employeeDTO));
    }


}
