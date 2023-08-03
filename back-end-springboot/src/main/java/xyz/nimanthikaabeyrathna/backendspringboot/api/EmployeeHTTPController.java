package xyz.nimanthikaabeyrathna.backendspringboot.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import xyz.nimanthikaabeyrathna.backendspringboot.business.custom.EmployeeBO;
import xyz.nimanthikaabeyrathna.backendspringboot.dto.EmployeeDTO;
import xyz.nimanthikaabeyrathna.backendspringboot.entity.Employee;

import javax.servlet.ServletContext;
import javax.servlet.http.Part;
import javax.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import static xyz.nimanthikaabeyrathna.backendspringboot.dao.util.Mappers.EMPLOYEE_ROW_MAPPER;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/employee")
public class EmployeeHTTPController {
    private final EmployeeBO employeeBO;
    private ServletContext servletContext;
    private final JdbcTemplate jdbcTemplate;

    public EmployeeHTTPController(EmployeeBO employeeBO, ServletContext servletContext, JdbcTemplate jdbcTemplate) {
        this.employeeBO = employeeBO;
        this.servletContext = servletContext;
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<EmployeeDTO> getAllEmployees() throws Exception {
        return employeeBO.getAllEmployees();
    }


    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(consumes = "application/json")
    public void saveEmployee(@RequestBody EmployeeDTO employeeDTO) throws Exception {
        employeeBO.saveEmployee(employeeDTO);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{employeeID}")
    public void deleteEmployee(@PathVariable("employeeID") String employeeID) throws Exception {
        employeeBO.deleteEmployee(employeeID);

    }


    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PatchMapping("/{employeeID}")
    public void updateEmployee(@PathVariable("employeeID") String employeeID,
                               @RequestBody @Valid EmployeeDTO employee) throws Exception {
        employeeBO.updateEmployee(employee);
    }


    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> saveFiles(@RequestPart("files") Part file,
                                       @RequestPart("employee") String employee,
                                       UriComponentsBuilder urlBuilder) throws Exception {

        System.out.println("update method working");
        if (file != null) {
            String fileDirPath = servletContext.getRealPath("/files");

            String filePath = new File(fileDirPath, file.getSubmittedFileName()).getAbsolutePath();
            File fileDir = new File(fileDirPath);

            if (!fileDir.exists()) {
                if (fileDir.mkdirs()) {
                    System.out.println("Directory created successfully: " + fileDir.getAbsolutePath());
                } else {
                    System.out.println("Failed to create the directory: " + fileDir.getAbsolutePath());

                }
            }

            try {
                file.write(filePath);
                UriComponentsBuilder cloneBuilder = urlBuilder.cloneBuilder();
                String fileUrl = cloneBuilder.pathSegment("files", file.getSubmittedFileName()).toUriString();

                // Create an instance of ObjectMapper
                ObjectMapper objectMapper = new ObjectMapper();

                // Convert JSON string to EmployeeDTO object
                EmployeeDTO employeeDTO = objectMapper.readValue(employee, EmployeeDTO.class);

                employeeDTO.setImageUrl(fileUrl);
                Thread.sleep(500);
                employeeBO.updateEmployee(employeeDTO);

            } catch (IOException e) {
                e.printStackTrace();

            }


        }

        return new ResponseEntity<>(HttpStatus.CREATED);

    }


}
