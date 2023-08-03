package xyz.nimanthikaabeyrathna.backendspringboot.business.custom.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.nimanthikaabeyrathna.backendspringboot.business.custom.SalaryBO;
import xyz.nimanthikaabeyrathna.backendspringboot.business.exception.DuplicateRecordException;
import xyz.nimanthikaabeyrathna.backendspringboot.business.exception.RecordNotFoundException;
import xyz.nimanthikaabeyrathna.backendspringboot.business.util.Transformer;
import xyz.nimanthikaabeyrathna.backendspringboot.dao.custom.SalaryDAO;
import xyz.nimanthikaabeyrathna.backendspringboot.dto.SalaryDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SalaryBOImpl implements SalaryBO {

    private final SalaryDAO salaryDAO;
    private final Transformer transformer;

    public SalaryBOImpl(SalaryDAO salaryDAO, Transformer transformer) {
        this.salaryDAO = salaryDAO;
        this.transformer = transformer;
    }

    @Override
    public List<SalaryDTO> getAllSalaries() throws Exception {

        return salaryDAO.findAll().stream().map(transformer::fromSalaryEntity).collect(Collectors.toList());
    }

    @Override
    public void saveSalary(SalaryDTO salaryDTO) throws Exception {

        if (salaryDAO.existsById(salaryDTO.getId())){
            throw new DuplicateRecordException(salaryDTO.getId()+" already exist");
        }
        salaryDAO.save(transformer.toSalaryEntity(salaryDTO));
    }

    @Override
    public void deleteSalary(Integer id) throws Exception {
        salaryDAO.deleteById(id);
    }

    @Override
    public void updateSalary(SalaryDTO salaryDTO) throws Exception {

        if (!salaryDAO.existsById(salaryDTO.getId())){
            throw new RecordNotFoundException(salaryDTO.getId()+" does not exist");
        }
        salaryDAO.update(transformer.toSalaryEntity(salaryDTO));
    }
}
