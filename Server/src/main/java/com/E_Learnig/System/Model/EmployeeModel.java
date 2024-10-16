package com.E_Learnig.System.Model;

import com.E_Learnig.System.DTO.EducationDTO;
import lombok.NoArgsConstructor;

import java.util.List;


@NoArgsConstructor
public class EmployeeModel {
    private String role;
    private String errorMessage;
    private String staffId;
    private String token;
    private String dbId;
    private Long sr;
    private boolean defaultPasswordChange;
    private String division;
    private String name;
    private String doorLogNo;
    private String department;
    private String team;
    private String email;
    private String status;
    private String defaultPassword;
    private String profilePhotoUrl;
    private List<EducationDTO> educationDTOS;
    private int stuAmount;
    private int instAmount;
    private int adminAmount;
    private int courseAmount;

    public int getStuAmount() {
        return stuAmount;
    }

    public void setStuAmount(int stuAmount) {
        this.stuAmount = stuAmount;
    }

    public int getInstAmount() {
        return instAmount;
    }

    public void setInstAmount(int instAmount) {
        this.instAmount = instAmount;
    }

    public int getAdminAmount() {
        return adminAmount;
    }

    public void setAdminAmount(int adminAmount) {
        this.adminAmount = adminAmount;
    }

    public int getCourseAmount() {
        return courseAmount;
    }

    public void setCourseAmount(int courseAmount) {
        this.courseAmount = courseAmount;
    }

    public boolean isDefaultPasswordChange() {
        return defaultPasswordChange;
    }
    public void setDefaultPasswordChange(boolean defaultPasswordChange) {
        this.defaultPasswordChange = defaultPasswordChange;
    }
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getStaffId() {
        return staffId;
    }

    public void setStaffId(String staffId) {
        this.staffId = staffId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getDbId() {
        return dbId;
    }

    public void setDbId(String dbId) {
        this.dbId = dbId;
    }

    public Long getSr() {
        return sr;
    }

    public void setSr(Long sr) {
        this.sr = sr;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDoorLogNo() {
        return doorLogNo;
    }

    public void setDoorLogNo(String doorLogNo) {
        this.doorLogNo = doorLogNo;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDefaultPassword() {
        return defaultPassword;
    }

    public void setDefaultPassword(String defaultPassword) {
        this.defaultPassword = defaultPassword;
    }

    public String getProfilePhotoUrl() {
        return profilePhotoUrl;
    }

    public void setProfilePhotoUrl(String profilePhotoUrl) {
        this.profilePhotoUrl = profilePhotoUrl;
    }

    public List<EducationDTO> getEducationDTOS() {
        return educationDTOS;
    }

    public void setEducationDTOS(List<EducationDTO> educationDTOS) {
        this.educationDTOS = educationDTOS;
    }
}
