package xyz.nimanthikaabeyrathna.backendspringboot.api;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import xyz.nimanthikaabeyrathna.backendspringboot.business.custom.SalaryBO;
import xyz.nimanthikaabeyrathna.backendspringboot.dto.EmployeeDTO;
import xyz.nimanthikaabeyrathna.backendspringboot.dto.SalaryDTO;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/salary")
public class SalaryHTTPController {

    private final SalaryBO salaryBO;

    public SalaryHTTPController(SalaryBO salaryBO) {
        this.salaryBO = salaryBO;
    }

    @GetMapping
    public List<SalaryDTO> getAllSalaries() throws Exception {
        return salaryBO.getAllSalaries();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(consumes = "application/json")
    public void saveSalary(@RequestBody SalaryDTO salaryDTO) throws Exception {
        salaryBO.saveSalary(salaryDTO);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public void deleteSalary(@PathVariable("id") Integer id) throws Exception {
        salaryBO.deleteSalary(id);

    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PatchMapping("/{id}")
    public void updateSalary(@PathVariable("id") Integer id,
                             @RequestBody @Valid SalaryDTO salaryDTO) throws Exception {
        salaryBO.updateSalary(salaryDTO);
    }

}
