package com.E_Learnig.System.DAO.Service;

import com.E_Learnig.System.DAO.Repository.CourseRepository;
import com.E_Learnig.System.DAO.Repository.EmployeeRepository;
import com.E_Learnig.System.DTO.CourseDTO;
import com.E_Learnig.System.DTO.EmployeeDTO;
import com.E_Learnig.System.Model.CourseApprovedModel;
import com.E_Learnig.System.Model.EmployeeModel;
import com.E_Learnig.System.Model.ForgetPassModel;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EmployeeService {
    @Autowired
    private JavaMailSender mailSender;
    private final ModelMapper modelMapper;
    private final EmployeeRepository employerRepo;
    private  final CourseRepository courseRepository;
    @Autowired
    public EmployeeService(ModelMapper modelMapper, EmployeeRepository employerRepo, CourseRepository courseRepository) {
        this.modelMapper = modelMapper;
        this.employerRepo = employerRepo;
        this.courseRepository = courseRepository;
    }

    public boolean isValidExcelFile(MultipartFile file) {
        return Objects.equals(file.getContentType(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    public void uploadEmployerData(MultipartFile file) throws IOException {
        List<EmployeeModel> newEmployerData = getEmployerDataFromExcel(file.getInputStream());
        List<EmployeeDTO> existingEmployerData = employerRepo.findAll();

        for (EmployeeModel newEmployeeModel : newEmployerData) {
            if ("99-09999".equals(newEmployeeModel.getStaffId())) {
                continue;
            }
            boolean found = existingEmployerData.stream()
                    .anyMatch(existingEmployer -> existingEmployer.getStaffId().equals(newEmployeeModel.getStaffId()));
            if (!found) {
                String defaultPassword = "dat123";
                String defaultProfileUrl = "https://asset.cloudinary.com/dsc9cgrzu/065aaf706c2d98210c45f9923689c004";
                newEmployeeModel.setDefaultPassword(defaultPassword);
                newEmployeeModel.setProfilePhotoUrl(defaultProfileUrl);
                EmployeeDTO newEmployeeDTO = modelMapper.map(newEmployeeModel, EmployeeDTO.class);
                employerRepo.save(newEmployeeDTO);
            }
        }
    }

    public List<EmployeeModel> getEmployerDataFromExcel(InputStream inputStream) throws IOException {
        List<EmployeeModel> employerData = new ArrayList<>();
        try (XSSFWorkbook workbook = new XSSFWorkbook(inputStream)) {
            XSSFSheet sheet = workbook.getSheet("Employee_Data");
            for (Row row : sheet) {
                if (row.getRowNum() == 0) {
                    continue; // Skip header row
                }
                EmployeeModel employeeModel = new EmployeeModel();
                for (Cell cell : row) {
                    switch (cell.getColumnIndex()) {
                        case 1:
                            if (cell.getCellType() == Cell.CELL_TYPE_STRING) {
                                employeeModel.setDivision(cell.getStringCellValue());
                            }
                            break;
                        case 2:
                            if (cell.getCellType() == Cell.CELL_TYPE_STRING) {
                                employeeModel.setStaffId(cell.getStringCellValue());
                            }
                            break;
                        case 3:
                            if (cell.getCellType() == Cell.CELL_TYPE_STRING) {
                                employeeModel.setName(cell.getStringCellValue());
                            }
                            break;
                        case 4:
                            if (cell.getCellType() == Cell.CELL_TYPE_STRING) {
                                employeeModel.setDoorLogNo(cell.getStringCellValue());
                            } else if (cell.getCellType() == Cell.CELL_TYPE_NUMERIC) {
                                employeeModel.setDoorLogNo(String.valueOf((long) cell.getNumericCellValue()));
                            }
                            break;
                        case 5:
                            if (cell.getCellType() == Cell.CELL_TYPE_STRING) {
                                employeeModel.setDepartment(cell.getStringCellValue());
                            }
                            break;
                        case 6:
                            if (cell.getCellType() == Cell.CELL_TYPE_STRING) {
                                employeeModel.setTeam(cell.getStringCellValue());
                            }
                            break;
                        case 7:
                            if (cell.getCellType() == Cell.CELL_TYPE_STRING) {
                                employeeModel.setEmail(cell.getStringCellValue());
                            }
                            break;
                        case 8:
                            if (cell.getCellType() == Cell.CELL_TYPE_STRING) {
                                employeeModel.setStatus(cell.getStringCellValue());
                            }
                            break;
                        case 9:
                            if (cell.getCellType() == Cell.CELL_TYPE_STRING) {
                                employeeModel.setRole(cell.getStringCellValue());
                            }
                            break;
                        default:
                            break;
                    }
                }
                employerData.add(employeeModel);
            }
        }
        return employerData;
    }

    public List<EmployeeModel> getInstructorEmployer() {
        List<String> roles = List.of("Instructor", "Admin");
        List<EmployeeDTO> employeeDTOS = employerRepo.findByRoleIn(roles);
        return employeeDTOS.stream()
                .map(employerDTO -> modelMapper.map(employerDTO, EmployeeModel.class))
                .collect(Collectors.toList());
    }
    public List<EmployeeModel> getAllEmployees() {
        List<EmployeeDTO> employeeDTOS = employerRepo.findAll();
        return employeeDTOS.stream()
                .map(employeeDTO -> modelMapper.map(employeeDTO, EmployeeModel.class))
                .collect(Collectors.toList());
    }

    public List<EmployeeModel> getStudentEmployer() {
        List<EmployeeDTO> employeeDTOS = employerRepo.findByRole("Student");;
        return employeeDTOS.stream()
                .map(employerDTO -> modelMapper.map(employerDTO, EmployeeModel.class))
                .collect(Collectors.toList());
    }

    public EmployeeModel getProfileByStaffId(String staffId) {
        EmployeeDTO employeeDTO = employerRepo.findByStaffId(staffId);
        if (employeeDTO == null) {
            throw new IllegalArgumentException("Employer not found with staff ID: " + staffId);
        }
        return modelMapper.map(employeeDTO, EmployeeModel.class);
    }
    public EmployeeModel getUserByStaffId(String staffId) {
        EmployeeDTO employeeDTO = employerRepo.findByStaffId(staffId);
        if (employeeDTO == null) {
            throw new IllegalArgumentException("Employer not found with staff ID: " + staffId);
        }
        return modelMapper.map(employeeDTO, EmployeeModel.class);
    }

    public boolean checkingStaffId(String staffId) {
        return employerRepo.existsByStaffId(staffId);
    }

    public boolean checkingPasswordAndId(String staffId, String password) {
        return employerRepo.existsByStaffIdAndDefaultPassword(staffId, password);
    }
    public int updateEmployerRole(String staffId, EmployeeModel employeeModelDetails) {
        EmployeeDTO existingEmployeeDTO = employerRepo.findByStaffId(staffId);
        if (existingEmployeeDTO != null && employeeModelDetails.getRole() != null) {
            existingEmployeeDTO.setRole(employeeModelDetails.getRole());
            employerRepo.save(existingEmployeeDTO);
            return 1;
        }
        return 0;
    }
    public int updateEmployer(Long sr, EmployeeModel employeeModelDetails) {
        EmployeeDTO existingEmployeeDTO = employerRepo.findBySr(sr);
        if (    existingEmployeeDTO != null
                && employeeModelDetails.getName() != null
                && employeeModelDetails.getStaffId() != null
                && employeeModelDetails.getDepartment() != null
                && employeeModelDetails.getDivision() != null
                && employeeModelDetails.getDoorLogNo() != null
                && employeeModelDetails.getTeam() != null
        ) {
            existingEmployeeDTO.setName(employeeModelDetails.getName());
            existingEmployeeDTO.setStaffId(employeeModelDetails.getStaffId());
            existingEmployeeDTO.setDepartment(employeeModelDetails.getDepartment());
            existingEmployeeDTO.setDivision(employeeModelDetails.getDivision());
            existingEmployeeDTO.setDoorLogNo(employeeModelDetails.getDoorLogNo());
            existingEmployeeDTO.setTeam(employeeModelDetails.getTeam());
            employerRepo.save(existingEmployeeDTO);
            return 1;
        }
        return 0;
    }

    public int changePermissionEmployer(String staffId, EmployeeModel employeeModelDetails) {
        EmployeeDTO existingEmployeeDTO = employerRepo.findByStaffId(staffId);
        if (existingEmployeeDTO != null && employeeModelDetails.getStatus() != null) {
            existingEmployeeDTO.setStatus(employeeModelDetails.getStatus());
            employerRepo.save(existingEmployeeDTO);
            return 1;
        }
        return 0;
    }
    public EmployeeDTO updatePassword(ForgetPassModel model) {
        EmployeeDTO existingEmployer = employerRepo.findByEmail(model.getEmail());
        if (model.getNewPass() != null) {
            // Update the role of the existing employer
            existingEmployer.setDefaultPassword(model.getNewPass());
        } else {
            throw new IllegalArgumentException("Password cannot be null");
        }
        return employerRepo.save(existingEmployer);
    }
    public int changePassword(String newPass, String staffId) {
        EmployeeDTO existingEmployer = employerRepo.findByStaffId(staffId);
        if (newPass!= null) {
            // Update the role of the existing employer
            existingEmployer.setDefaultPassword(newPass);
            existingEmployer.setDefaultPasswordChange(true);
        } else {
            throw new IllegalArgumentException("Password cannot be null");
        }
        employerRepo.save(existingEmployer);
        return 0;
    }
    public ForgetPassModel sendOtp(String email) {
        EmployeeDTO userOptional = employerRepo.findByEmail(email);
        ForgetPassModel model=new ForgetPassModel();
        if (userOptional == null) {
            model.setMessage( "Email not found");
            return model;
        }
        String otpCode = generateOtp();
        sendEmail(email, otpCode);
        model.setOtp(otpCode);
        model.setMessage("OTP Was Sent To Your E-Mail Address");
        model.setEmail(email);
        return model;
    }

    private String generateOtp() {
        // Generate a 6-digit OTP
        return String.valueOf(new Random().nextInt(900000) + 100000);
    }

    private void sendEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Forget Password");
        message.setText("Please Dont' share Anyone ! Your OTP code is: " + otp);
        mailSender.send(message);
    }

    public CourseDTO courseApprovedByAdmin(CourseApprovedModel model) {
        long courseIdLong = Long.parseLong(model.getCourseId());
        Optional<CourseDTO> optionalCourse = courseRepository.findById(courseIdLong);

        if (optionalCourse.isPresent()) {
            CourseDTO existingCourse = optionalCourse.get();
            existingCourse.setAdminId(model.getAdminId());
            existingCourse.setApprovedDate(LocalDateTime.now());
            existingCourse.setApproved(true);
            return courseRepository.save(existingCourse);
        } else {
            throw new IllegalArgumentException("Course not found");
        }
    }
    public EmployeeModel getProfileBySr(Long id) {
        EmployeeDTO employeeDTO = employerRepo.findBySr(id);
        if (employeeDTO == null) {
            throw new IllegalArgumentException("Employer not found with staff ID: " + id);
        }
        return modelMapper.map(employeeDTO, EmployeeModel.class);
    }
    public EmployeeModel getDataAmount() {
        EmployeeModel model=new EmployeeModel();
        List<EmployeeDTO> admin = employerRepo.findByRole("Admin");
        int adminAmount=admin.size();
        List<EmployeeDTO> student = employerRepo.findByRole("Student");
        int stuAmount=student.size();
        List<EmployeeDTO> instructor = employerRepo.findByRole("Instructor");
        int instAmount=instructor.size();
        List<CourseDTO> course=courseRepository.findByIsApprovedTrue();
        int curseAmount=course.size();
        model.setAdminAmount(adminAmount);
        model.setInstAmount(instAmount);
        model.setStuAmount(stuAmount);
        model.setCourseAmount(curseAmount);
        return model;
    }
}
