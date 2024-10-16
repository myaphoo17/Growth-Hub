    package com.E_Learnig.System.DAO.Service;

    import com.E_Learnig.System.DAO.Repository.CourseRepository;
    import com.E_Learnig.System.DAO.Repository.ExamRepository;
    import com.E_Learnig.System.DAO.Repository.ExamResultRepository;
    import com.E_Learnig.System.DAO.Repository.LearningCourseRepository;
    import com.E_Learnig.System.DTO.*;
    import com.E_Learnig.System.Model.*;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;
    import java.time.LocalDate;
    import java.time.LocalDateTime;

    import java.time.LocalDate;
    import java.time.LocalDateTime;
    import java.time.ZoneId;
    import java.time.ZonedDateTime;
    import java.util.*;
    import java.util.stream.Collectors;

    @Service
    @Transactional
    public class LearningCourseService {

        @Autowired
        private LearningCourseRepository learningCourseRepository;

        @Autowired
        private CourseRepository courseRepository;

        @Autowired
        private ExamRepository examRepository;

        @Autowired
        private ExamResultRepository examResultRepository;

//        public List<LearningCourseDTO> getCoursesByEmployeeId(Long employeeId) {
//            return learningCourseRepository.findByEmployeeDTO_Sr(employeeId);
//        }

        public List<LearningCourseDTO> getCoursesByEmployeeId(Long employeeId) {
            return learningCourseRepository.findByEmployeeDTO_SrAndDeleted(employeeId, 0);
        }
        public List<LearningCourseDTO> getCoursesByEmployeeIdAndStatus(Long employeeId) {
            return learningCourseRepository.findByEmployeeDTO_SrAndAnswerExamFalse(employeeId);
        }

        public List<MonthlyCourseEnrollmentModel> getMonthlyEnrollmentsByStaffId(int year, Long staffId) {

            // Step 1: Fetch all courses by staff ID
            List<CourseDTO> courseDTOList = courseRepository.findByEmployeeDTO_Sr(staffId);

            // Step 2: Fetch all learning courses for the courses
            List<LearningCourseDTO> courses = new ArrayList<>();
            for (CourseDTO course : courseDTOList) {
                List<LearningCourseDTO> learningCourses = learningCourseRepository.findByCourseDTOA_Id(course.getId());
                courses.addAll(learningCourses);
            }

            // Step 3: Filter courses by the specified year
            List<LearningCourseDTO> filteredCourses = courses.stream()
                    .filter(course -> course.getStartDate() != null && course.getStartDate().getYear() == year)
                    .collect(Collectors.toList());

            // Step 4: Check if the filtered courses list is not empty
            if (filteredCourses.isEmpty()) {
                return Collections.emptyList(); // Return an empty list if no courses found
            }

            // Step 5: Group by month and course ID, then transform to MonthlyCourseEnrollmentModel
            return filteredCourses.stream()
                    .collect(Collectors.groupingBy(
                            course -> course.getStartDate().getMonthValue() + "-" + course.getCourseDTOA().getId(),
                            Collectors.collectingAndThen(
                                    Collectors.toList(),
                                    list -> new MonthlyCourseEnrollmentModel(
                                            list.get(0).getStartDate().getMonthValue(),
                                            list.get(0).getCourseDTOA().getId(),
                                            list.get(0).getCourseDTOA().getTitle(),
                                            (long) list.size())
                            )
                    )).values().stream().collect(Collectors.toList());
        }

        public List<MonthlyDataModel> getMonthlyCourseCreationsByStaffId(int year, Long staffId) {
            return courseRepository.findByIsApprovedTrueAndEmployeeDTO_Sr(staffId).stream()
                    .filter(course -> {
                        LocalDateTime approvedDate = course.getApprovedDate();
                        return approvedDate != null && approvedDate.getYear() == year;
                    })
                    .collect(Collectors.groupingBy(
                            course -> course.getApprovedDate().getMonthValue()
                    ))
                    .entrySet().stream()
                    .map(entry -> {
                        List<String> courseNames = entry.getValue().stream()
                                .map(course -> course.getTitle())
                                .collect(Collectors.toList());
                        return new MonthlyDataModel(entry.getKey(), 0, courseNames.size(), courseNames, 0, 0, 0);
                    })
                    .collect(Collectors.toList());
        }

        public Map<Integer, ExamStats> getMonthlyExamStatsByStaffId(int year, Long staffId) {
            // Fetch approved courses created by the staff
            List<CourseDTO> courses = courseRepository.findByIsApprovedTrueAndEmployeeDTO_Sr(staffId);

            // Extract the IDs of the courses
            List<Long> courseIds = courses.stream()
                    .map(CourseDTO::getId)
                    .collect(Collectors.toList());

            // Fetch exams associated with these course IDs
            List<ExamDTO> exams = examRepository.findByCourseIdIn(courseIds);

            // Process exams to get monthly statistics
            return exams.stream()
                    .filter(exam -> exam.getCreatedDate() != null && exam.getCreatedDate().getYear() == year)
                    .collect(Collectors.groupingBy(
                            exam -> exam.getCreatedDate().getMonthValue(),
                            Collectors.collectingAndThen(Collectors.toList(), this::calculateStats)
                    ));
        }


        public List<MonthlyDataModel> getMonthlyDataByStaffId(int year, Long staffId) {
            try {
                List<MonthlyCourseEnrollmentModel> enrollments = getMonthlyEnrollmentsByStaffId(year, staffId);
                List<MonthlyDataModel> courseCreations = getMonthlyCourseCreationsByStaffId(year, staffId);
                Map<Integer, ExamStats> examStatsMap = getMonthlyExamStatsByStaffId(year, staffId);

                // Create a map for course creations by month
                Map<Integer, List<String>> courseCreationsMap = courseCreations.stream()
                        .collect(Collectors.groupingBy(
                                MonthlyDataModel::getMonth,
                                Collectors.flatMapping(
                                        model -> model.getCourseNames().stream(),
                                        Collectors.toList())
                        ));
                System.out.println("Enrollments: ");
                enrollments.forEach(enrollment ->
                        System.out.println("Month: " + enrollment.getMonth() + ", Student Count: " + enrollment.getStudentCount())
                );

                // Create a map for enrollments by month
                Map<Integer, Long> enrollmentsMap = enrollments.stream()
                        .collect(Collectors.groupingBy(
                                MonthlyCourseEnrollmentModel::getMonth,
                                Collectors.summingLong(MonthlyCourseEnrollmentModel::getStudentCount)
                        ));

                // Combine the data for all 12 months
                List<MonthlyDataModel> monthlyData = new ArrayList<>();
                for (int month = 1; month <= 12; month++) {
                    List<String> coursesCreated = courseCreationsMap.getOrDefault(month, Collections.emptyList());
                    long studentEnrollments = enrollmentsMap.getOrDefault(month, 0L);

                    ExamStats examStats = examStatsMap.getOrDefault(month, new ExamStats(0, 0, 0));
                    int totalExams = examStats.getTotalExams();
                    int passedExams = examStats.getPassedExams();
                    int failedExams = examStats.getFailedExams();

                    monthlyData.add(new MonthlyDataModel(month, studentEnrollments, coursesCreated.size(), coursesCreated, totalExams, passedExams, failedExams));
                }

                return monthlyData;
            } catch (Exception e) {
                throw new RuntimeException("Error retrieving monthly data", e);
            }
        }


        public List<MonthlyCourseEnrollmentModel> getMonthlyEnrollments(int year) {
            return learningCourseRepository.findAll().stream()
                    .filter(course -> course.getStartDate().getYear() == year)
                    .collect(Collectors.groupingBy(
                            course -> course.getStartDate().getMonthValue() + "-" + course.getCourseDTOA().getId(),
                            Collectors.collectingAndThen(
                                    Collectors.toList(),
                                    list -> new MonthlyCourseEnrollmentModel(
                                            list.get(0).getStartDate().getMonthValue(),
                                            list.get(0).getCourseDTOA().getId(),
                                            list.get(0).getCourseDTOA().getTitle(),
                                            (long) list.size())
                            )
                    )).values().stream().collect(Collectors.toList());
        }

        public List<MonthlyDataModel> getMonthlyData(int year) {
            try {
                List<MonthlyCourseEnrollmentModel> enrollments = getMonthlyEnrollments(year);
                List<MonthlyDataModel> courseCreations = getMonthlyCourseCreations(year);
                Map<Integer, ExamStats> examStatsMap = getMonthlyExamStats(year);

                // Create a map for course creations by month
                Map<Integer, List<String>> courseCreationsMap = courseCreations.stream()
                        .collect(Collectors.groupingBy(
                                MonthlyDataModel::getMonth,
                                Collectors.flatMapping(
                                        model -> model.getCourseNames().stream(),
                                        Collectors.toList())
                        ));

                // Create a map for enrollments by month
                Map<Integer, Long> enrollmentsMap = enrollments.stream()
                        .collect(Collectors.groupingBy(
                                MonthlyCourseEnrollmentModel::getMonth,
                                Collectors.summingLong(MonthlyCourseEnrollmentModel::getStudentCount)
                        ));

                // Combine the data for all 12 months
                List<MonthlyDataModel> monthlyData = new ArrayList<>();
                for (int month = 1; month <= 12; month++) {
                    List<String> coursesCreated = courseCreationsMap.getOrDefault(month, Collections.emptyList());
                    long studentEnrollments = enrollmentsMap.getOrDefault(month, 0L);

                    ExamStats examStats = examStatsMap.getOrDefault(month, new ExamStats(0, 0, 0));
                    int totalExams = examStats.getTotalExams();
                    int passedExams = examStats.getPassedExams();
                    int failedExams = examStats.getFailedExams();

                    monthlyData.add(new MonthlyDataModel(month, studentEnrollments, coursesCreated.size(), coursesCreated, totalExams, passedExams, failedExams));
                }

                return monthlyData;
            } catch (Exception e) {
                throw new RuntimeException("Error retrieving monthly data", e);
            }
        }

        public List<MonthlyDataModel> getMonthlyCourseCreations(int year) {
            return courseRepository.findAll().stream()
                    .filter(course -> {
                        LocalDateTime approvedDate = course.getApprovedDate();
                        return approvedDate != null && approvedDate.getYear() == year;
                    })
                    .collect(Collectors.groupingBy(
                            course -> course.getApprovedDate().getMonthValue()
                    ))
                    .entrySet().stream()
                    .map(entry -> {
                        List<String> courseNames = entry.getValue().stream()
                                .map(course -> course.getTitle())
                                .collect(Collectors.toList());
                        return new MonthlyDataModel(entry.getKey(), 0, courseNames.size(), courseNames, 0, 0, 0);
                    })
                    .collect(Collectors.toList());
        }

        public Map<Integer, ExamStats> getMonthlyExamStats(int year) {
            List<ExamDTO> exams = examRepository.findAll();

            return exams.stream()
                    .filter(exam -> exam.getCreatedDate().getYear() == year)
                    .collect(Collectors.groupingBy(
                            exam -> exam.getCreatedDate().getMonthValue(),
                            Collectors.collectingAndThen(Collectors.toList(), this::calculateStats)
                    ));
        }

        private ExamStats calculateStats(List<ExamDTO> exams) {
            int totalExams = exams.size();
            List<Long> examIds = exams.stream().map(ExamDTO::getId).collect(Collectors.toList());
            List<ExamResultDTO> results = examResultRepository.findAllByExamIdIn(examIds);

            int passedExams = (int) results.stream().filter(result -> "PASS".equalsIgnoreCase(result.getStatus())).count();
            int failedExams = (int) results.stream().filter(result -> "FAIL".equalsIgnoreCase(result.getStatus())).count();

            return new ExamStats(totalExams, passedExams, failedExams);
        }


        public boolean doesEmployeeExist(Long courseId, Long employeeId) {
            return learningCourseRepository.existsByCourseDTOAIdAndEmployeeDTO_SrAndDeleted(courseId, employeeId, 0);
        }

        public long countEnrollmentsByCourseId(Long courseId) {
            return learningCourseRepository.countByCourseDTOA_Id(courseId);
        }

        private ExamResultModel convertToModel(ExamResultDTO examResultDTO) {
            ExamResultModel model = new ExamResultModel();
            model.setStaffId(examResultDTO.getStaffId());
            model.setCourseId(examResultDTO.getCourseId());
            model.setExamId(examResultDTO.getExamId());
            model.setEarnedPoints(examResultDTO.getEarnedPoints());
            model.setStatus(examResultDTO.getStatus());
            model.setGrade(examResultDTO.getGrade());
            return model;
        }


        public List<EmployeeDTO> getEmployeesByCourseId(Long courseId) {
            return learningCourseRepository.findEmployeesByCourseId(courseId);
        }

        public long countEnrollments(Long courseId, String staffId) {
            return learningCourseRepository.countEnrollmentsByCourseIdAndStaffId(courseId, staffId);
        }


        public List<CourseDTO> getCoursesByStaffId(String staffId) {
            return learningCourseRepository.findCoursesByStaffId(staffId);
        }
        public Long getEnrollmentsByCourseId(Long courseId, int year) {
            return learningCourseRepository.countEnrollmentsByCourseIdAndYear(courseId, year);
        }

        public List<CourseEnrollmentCountModel> getCoursesWithEnrollmentsByStaffId(String staffId, int year) {
            // Fetch courses by staff ID
            List<CourseDTO> courses = learningCourseRepository.findCoursesByStaffId(staffId);

            // Check if no courses found
            if (courses.isEmpty()) {
                return Collections.emptyList();
            }

            // Fetch enrollments count for each course and map to CourseEnrollmentCountModel
            return courses.stream()
                    .map(course -> {
                        Long enrollmentsCount = learningCourseRepository.countEnrollmentsByCourseIdAndYear(course.getId(), year);
                        return new CourseEnrollmentCountModel(course.getId(), course.getTitle(), enrollmentsCount);
                    })
                    .collect(Collectors.toList());
        }
        public List<CourseEnrollmentCountModel> getAllCoursesWithEnrollmentsByYear(int year) {
            // Fetch all courses
            List<CourseDTO> courses = learningCourseRepository.findAllCourses();

            // Check if no courses found
            if (courses.isEmpty()) {
                return Collections.emptyList();
            }

            // Fetch enrollments count for each course and map to CourseEnrollmentCountModel
            return courses.stream()
                    .map(course -> {
                        Long enrollmentsCount = learningCourseRepository.countEnrollmentsByCourseIdAndYear(course.getId(), year);
                        return new CourseEnrollmentCountModel(course.getId(), course.getTitle(), enrollmentsCount);
                    })
                    .collect(Collectors.toList());
        }



    }
