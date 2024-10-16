-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: el
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Programming Languages'),(2,'Business'),(3,'Marketing'),(4,'IT & Software'),(5,'Others'),(6,'Programming Languages'),(7,'Business'),(8,'Programming Languages'),(9,'Programming Languages'),(10,'Programming Languages'),(11,'Programming Languages'),(12,'Business'),(13,'IT & Software'),(14,'Programming Languages');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificate`
--

DROP TABLE IF EXISTS `certificate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificate` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `data` longblob,
  `instructor_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK30jlt7am5fxlpi75sc3jnv6lg` (`instructor_id`),
  CONSTRAINT `FK30jlt7am5fxlpi75sc3jnv6lg` FOREIGN KEY (`instructor_id`) REFERENCES `employee` (`sr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificate`
--

LOCK TABLES `certificate` WRITE;
/*!40000 ALTER TABLE `certificate` DISABLE KEYS */;
/*!40000 ALTER TABLE `certificate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificate_results`
--

DROP TABLE IF EXISTS `certificate_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificate_results` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `certificate_id` bigint NOT NULL,
  `course_id` bigint NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `staff_id` varchar(255) NOT NULL,
  `staff_name` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificate_results`
--

LOCK TABLES `certificate_results` WRITE;
/*!40000 ALTER TABLE `certificate_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `certificate_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_message`
--

DROP TABLE IF EXISTS `chat_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_message` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(251) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `type` tinyint DEFAULT NULL,
  `recipient_sr` bigint DEFAULT NULL,
  `sender_sr` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrqd3lmiuttct0fx8n7ybkxs0v` (`recipient_sr`),
  KEY `FKixxktrvctl39v3b35wvebuun3` (`sender_sr`),
  CONSTRAINT `FKixxktrvctl39v3b35wvebuun3` FOREIGN KEY (`sender_sr`) REFERENCES `employee` (`sr`),
  CONSTRAINT `FKrqd3lmiuttct0fx8n7ybkxs0v` FOREIGN KEY (`recipient_sr`) REFERENCES `employee` (`sr`),
  CONSTRAINT `chat_message_chk_1` CHECK ((`type` between 0 and 2))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_message`
--

LOCK TABLES `chat_message` WRITE;
/*!40000 ALTER TABLE `chat_message` DISABLE KEYS */;
INSERT INTO `chat_message` VALUES (1,'hi','2024-08-05 09:09:18.659000',0,1,4),(2,'hi','2024-08-05 13:37:53.899000',0,4,1);
/*!40000 ALTER TABLE `chat_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `admin_id` varchar(255) DEFAULT NULL,
  `approved_date` datetime(6) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `is_approved` bit(1) NOT NULL,
  `is_delete` bit(1) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `categories_id` bigint DEFAULT NULL,
  `course_creator_id` bigint DEFAULT NULL,
  `saved_course_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmsjafllnoru41ign7lc53wy35` (`categories_id`),
  KEY `FK2xsb4eld8fyrvqfpxsdq5x7ki` (`course_creator_id`),
  KEY `FKt0jbeypdoef1hij1w4ovaw2a9` (`saved_course_id`),
  CONSTRAINT `FK2xsb4eld8fyrvqfpxsdq5x7ki` FOREIGN KEY (`course_creator_id`) REFERENCES `employee` (`sr`),
  CONSTRAINT `FKmsjafllnoru41ign7lc53wy35` FOREIGN KEY (`categories_id`) REFERENCES `category` (`id`),
  CONSTRAINT `FKt0jbeypdoef1hij1w4ovaw2a9` FOREIGN KEY (`saved_course_id`) REFERENCES `saved_coursedto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'26-99935','2024-08-04 14:55:37.973055','2024-07-04','Explore JavaScript fundamentals, DOM manipulation, and frameworks like Angular','3 months',_binary '',_binary '\0','JavaScript',6,2,NULL),(2,'26-99935','2024-08-04 14:56:16.160352','2024-07-03','Explore the key concepts of Enterprise Resource Planning systems, including ERP software','2 months',_binary '',_binary '\0','ERP Systems',7,3,NULL),(3,'26-99935','2024-08-04 14:56:12.216811','2024-08-07','Deep dive into the Java\'s advanced features such as concurrency and, streams etc.','2 months',_binary '',_binary '\0','Java Advanced',8,3,NULL),(4,'26-99935','2024-08-05 01:53:57.247816','2024-06-07','An introduction to data science concepts, including data analysis, machine learning algorithms','2 months',_binary '',_binary '\0','Data Science',9,2,NULL),(5,'26-99935','2024-08-05 01:54:11.434086','2024-06-02','Learn the principles of project management, including planning, execution, and monitoring','2 months',_binary '',_binary '\0','Project Management',10,2,NULL),(6,'26-99935','2024-08-05 01:54:15.486735','2024-04-05',' Gain an understanding of software testing principles, techniques, and tools etc.','3 months',_binary '',_binary '\0','Software Testing',11,3,NULL),(7,'26-99935','2024-08-04 14:56:07.402653','2024-04-04','Learn the principles of user experience design, focusing  creating intuitive user interfaces.','3 months',_binary '',_binary '\0','User Experience',12,3,NULL),(8,'26-99935','2024-08-04 14:56:00.596151','2024-05-04','Explore the fundamentals of cybersecurity, including network security, threat analysis','2 months',_binary '',_binary '\0','Cybersecurity Basics',13,3,NULL),(9,'26-99935','2024-08-05 12:48:53.668393','2024-08-05','Learn about blockchain technology and its applications, focusing on cryptocurrencies, smart contracts','2 month',_binary '',_binary '\0','Blockchain and Cryptocurrency',14,2,NULL);
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `education`
--

DROP TABLE IF EXISTS `education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `education` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `degree` varchar(255) DEFAULT NULL,
  `graduation_date` varchar(255) DEFAULT NULL,
  `institution` varchar(255) DEFAULT NULL,
  `start_date` varchar(255) DEFAULT NULL,
  `employee_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrphg8gbx569xvj1txkkt91uy4` (`employee_id`),
  CONSTRAINT `FKrphg8gbx569xvj1txkkt91uy4` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`sr`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `education`
--

LOCK TABLES `education` WRITE;
/*!40000 ALTER TABLE `education` DISABLE KEYS */;
INSERT INTO `education` VALUES (1,'B.C.Sc (Computer Science)','2019-05-30','University of Computer Studies ( Yangon )','2015-07-31',1);
/*!40000 ALTER TABLE `education` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `sr` bigint NOT NULL AUTO_INCREMENT,
  `default_password` varchar(255) DEFAULT NULL,
  `default_password_change` bit(1) NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `division` varchar(255) DEFAULT NULL,
  `door_log_no` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `profile_photo_url` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `staff_id` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `team` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`sr`)
) ENGINE=InnoDB AUTO_INCREMENT=234 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'psw1234',_binary '','Offshore Development Dept-2','Offshore Division','39392','myaphoothwe92@gmail.com','Mya Phoo Thwe','http://res.cloudinary.com/dsc9cgrzu/image/upload/v1722800498/samples/mpttt.jpg.jpg','Admin','26-99935','Active','Offshore Dept-2'),(2,'psw123',_binary '','Offshore Development Dept-1','Offshore Division','39393','phuesone@gmail.com','Phue Phue Sone','http://res.cloudinary.com/dsc9cgrzu/image/upload/v1722800348/samples/pps.jpg.jpg','Student','26-99936','Active','Offshore Dept-1'),(3,'psw123',_binary '','Finance Dept','Management Division','39394','eisandar@gmail.com','Ei Sandar Phyoe','http://res.cloudinary.com/dsc9cgrzu/image/upload/v1722800390/samples/mpt.jpg.jpg','Instructor','26-99937','Active','Finance'),(4,'psw123',_binary '','PMO & QC Dept','Management Division','39395','aungkyawnyein@gmail.com','Ko Nyein Maung','http://res.cloudinary.com/dsc9cgrzu/image/upload/v1722800444/samples/KN.jpg.jpg','Student','26-99938','Active','PMOQC'),(5,'psw123456',_binary '','PMO & QC Dept','Management Division','39396','yupaingmoe2003.npt@gmail.com','Yu Paing Moe','http://res.cloudinary.com/dsc9cgrzu/image/upload/v1722800444/samples/KN.jpg.jpg','Student','26-99939','Active','PMOQC');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrolled_course`
--

DROP TABLE IF EXISTS `enrolled_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrolled_course` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `answer_exam` bit(1) NOT NULL,
  `unenrolled` int NOT NULL,
  `end_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `course_id` bigint NOT NULL,
  `employee_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7ymxj31qf504o3u6sxmrx8mw1` (`course_id`),
  KEY `FK42vby66eqpea0mg2elst5mkoq` (`employee_id`),
  CONSTRAINT `FK42vby66eqpea0mg2elst5mkoq` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`sr`),
  CONSTRAINT `FK7ymxj31qf504o3u6sxmrx8mw1` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrolled_course`
--

LOCK TABLES `enrolled_course` WRITE;
/*!40000 ALTER TABLE `enrolled_course` DISABLE KEYS */;
INSERT INTO `enrolled_course` VALUES (1,_binary '\0',0,NULL,'2024-08-04',1,1),(2,_binary '',0,NULL,'2024-08-04',1,4),(3,_binary '\0',0,NULL,'2024-08-04',3,4),(5,_binary '\0',0,NULL,'2024-08-05',4,4),(6,_binary '',0,NULL,'2024-08-05',9,4);
/*!40000 ALTER TABLE `enrolled_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam`
--

DROP TABLE IF EXISTS `exam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime(6) NOT NULL,
  `deleted` bit(1) NOT NULL,
  `description` tinytext,
  `title` varchar(255) NOT NULL,
  `updated_date` datetime(6) NOT NULL,
  `course_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKiub3ue9cklcyyra24v9ns656n` (`course_id`),
  CONSTRAINT `FKiub3ue9cklcyyra24v9ns656n` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam`
--

LOCK TABLES `exam` WRITE;
/*!40000 ALTER TABLE `exam` DISABLE KEYS */;
INSERT INTO `exam` VALUES (1,'2024-08-04 15:23:51.229188',_binary '\0','this is js exam.','Java Script Exam','2024-08-04 15:23:51.229188',1),(2,'2024-08-05 10:43:24.649696',_binary '\0','Test For Data Science','Data Science','2024-08-05 10:43:24.649696',4),(3,'2024-08-05 11:42:38.591080',_binary '\0','Test for Project Management','Project Management','2024-08-05 11:42:38.591080',5),(4,'2024-08-05 13:07:33.373069',_binary '\0','Test for JavaScript','JavaScript','2024-08-05 13:07:33.373069',9);
/*!40000 ALTER TABLE `exam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_results`
--

DROP TABLE IF EXISTS `exam_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_results` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `course_id` bigint NOT NULL,
  `earned_points` double NOT NULL,
  `exam_id` bigint NOT NULL,
  `grade` varchar(255) NOT NULL,
  `staff_id` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_results`
--

LOCK TABLES `exam_results` WRITE;
/*!40000 ALTER TABLE `exam_results` DISABLE KEYS */;
INSERT INTO `exam_results` VALUES (1,1,2,1,'','26-99938','Fail'),(2,1,5,1,'Grade B','26-99938','Pass'),(3,9,3.5,4,'','26-99938','Fail'),(4,9,10.5,4,'Grade A','26-99938','Pass');
/*!40000 ALTER TABLE `exam_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grade`
--

DROP TABLE IF EXISTS `grade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grade` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `max_points` int NOT NULL,
  `min_points` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_points` int DEFAULT NULL,
  `course_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7e8ca7hfmrpruicqhocskjlf2` (`course_id`),
  CONSTRAINT `FK7e8ca7hfmrpruicqhocskjlf2` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade`
--

LOCK TABLES `grade` WRITE;
/*!40000 ALTER TABLE `grade` DISABLE KEYS */;
INSERT INTO `grade` VALUES (1,10,8,'Grade A',0,1),(2,7,5,'Grade B',0,1),(3,5,3,'Grade C',0,1),(4,10,8,'Grade A',0,4),(5,7,6,'Grade B',0,4),(6,5,3,'Grade C',0,4),(7,10,8,'Grade A',0,5),(8,7,6,'Grade B',0,5),(9,5,4,'Grade C',0,5),(13,11,9,'Grade A',0,9),(14,8,6,'Grade B',0,9),(15,5,4,'Grade C',0,9);
/*!40000 ALTER TABLE `grade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructorassi`
--

DROP TABLE IF EXISTS `instructorassi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructorassi` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `due_date` datetime(6) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `course_id` bigint DEFAULT NULL,
  `instructor_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhr0gpxs09iyj1vfx76bu67csn` (`course_id`),
  KEY `FKnffolcd50dmb18kgrc23wm7q6` (`instructor_id`),
  CONSTRAINT `FKhr0gpxs09iyj1vfx76bu67csn` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  CONSTRAINT `FKnffolcd50dmb18kgrc23wm7q6` FOREIGN KEY (`instructor_id`) REFERENCES `employee` (`sr`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructorassi`
--

LOCK TABLES `instructorassi` WRITE;
/*!40000 ALTER TABLE `instructorassi` DISABLE KEYS */;
INSERT INTO `instructorassi` VALUES (2,'h','2024-08-21 00:00:00.000000','g',3,2),(3,'JavaScript assignment','2024-08-06 00:00:00.000000','JavaScript',1,2),(4,'Data Science Assignment','2024-08-15 00:00:00.000000','Data Science',4,2),(5,'Project Management Assignment','2024-08-06 00:00:00.000000','Project Management Presentation',5,2),(6,'Assignment 1','2024-08-06 00:00:00.000000','Assignment ',9,2);
/*!40000 ALTER TABLE `instructorassi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email_from` varchar(200) DEFAULT NULL,
  `id_post` bigint DEFAULT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `message` varchar(200) DEFAULT NULL,
  `notification_type` tinyint DEFAULT NULL,
  `recipient_sr` bigint DEFAULT NULL,
  `user_from_sr` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpf6p0w8th4pw87t4r4cr7qn7d` (`recipient_sr`),
  KEY `FK5hgcnifeefq232d43dqm245sh` (`user_from_sr`),
  CONSTRAINT `FK5hgcnifeefq232d43dqm245sh` FOREIGN KEY (`user_from_sr`) REFERENCES `employee` (`sr`),
  CONSTRAINT `FKpf6p0w8th4pw87t4r4cr7qn7d` FOREIGN KEY (`recipient_sr`) REFERENCES `employee` (`sr`),
  CONSTRAINT `notification_chk_1` CHECK ((`notification_type` between 0 and 2))
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,'2024-08-04 14:37:58.024000','phuesone@gmail.com',1,_binary '','Phue Phue Sone created a new course: JavaScript',1,1,2),(2,'2024-08-04 14:39:35.001000','phuesone@gmail.com',2,_binary '','Phue Phue Sone created a new course: ERP Domain Knowledge',1,1,2),(3,'2024-08-04 14:40:53.307000','phuesone@gmail.com',3,_binary '','Phue Phue Sone created a new course: Java EE',1,1,2),(4,'2024-08-04 14:43:45.963000','phuesone@gmail.com',4,_binary '','Phue Phue Sone created a new course: Python ',1,1,2),(5,'2024-08-04 14:47:40.345000','phuesone@gmail.com',5,_binary '','Phue Phue Sone created a new course: Web Tech',1,1,2),(6,'2024-08-04 14:50:22.582000','eisandar@gmail.com',6,_binary '','Ei San Dar Phyo created a new course: Java SE ',1,1,3),(7,'2024-08-04 14:52:36.610000','eisandar@gmail.com',7,_binary '','Ei San Dar Phyo created a new course: Java FX',1,1,3),(8,'2024-08-04 14:54:01.376000','eisandar@gmail.com',8,_binary '','Ei San Dar Phyo created a new course: ShellScripts',1,1,3),(9,'2024-08-04 14:57:12.541000','myaphoothwe92@gmail.com',1,_binary '\0','Mya Phoo Thwe enrolled you in the null course.',0,2,1),(10,'2024-08-04 14:58:16.990000','aungkyawnyein@gmail.com',1,_binary '\0','Ko Nyein Maung enrolled you in the null course.',0,2,4),(11,'2024-08-04 16:42:46.104000','aungkyawnyein@gmail.com',3,_binary '\0','Ko Nyein Maung enrolled you in the null course.',0,2,4),(12,'2024-08-05 09:04:30.581000','aungkyawnyein@gmail.com',2,_binary '\0','Ko Nyein Maung enrolled you in the null course.',0,3,4),(13,'2024-08-05 09:09:18.640000','aungkyawnyein@gmail.com',NULL,_binary '','Ko Nyein Maung sent you a message',2,1,4),(14,'2024-08-05 09:24:18.259000','aungkyawnyein@gmail.com',4,_binary '\0','Ko Nyein Maung enrolled you in the null course.',0,2,4),(15,'2024-08-05 12:47:35.477000','phuesone@gmail.com',9,_binary '','Phue Phue Sone created a new course: Blockchain and Cryptocurrency',1,1,2),(16,'2024-08-05 13:17:40.556000','aungkyawnyein@gmail.com',9,_binary '\0','Ko Nyein Maung enrolled you in the null course.',0,2,4),(17,'2024-08-05 13:37:53.890000','myaphoothwe92@gmail.com',NULL,_binary '','Mya Phoo Thwe sent you a message',2,4,1);
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `options`
--

DROP TABLE IF EXISTS `options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `options` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_correct` bit(1) NOT NULL,
  `multiple` varchar(255) NOT NULL,
  `points` int NOT NULL,
  `question_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKk821m563xwucpkx6ju8r3rkm4` (`question_id`),
  CONSTRAINT `FKk821m563xwucpkx6ju8r3rkm4` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `options`
--

LOCK TABLES `options` WRITE;
/*!40000 ALTER TABLE `options` DISABLE KEYS */;
INSERT INTO `options` VALUES (1,_binary '','7',1,1),(2,_binary '\0','-1',0,1),(3,_binary '','7',1,2),(4,_binary '\0','-1',0,2),(5,_binary '','7',1,3),(6,_binary '\0','-1',0,3),(7,_binary '','7',1,4),(8,_binary '\0','-1',0,4),(9,_binary '','7',1,5),(10,_binary '\0','-1',0,5),(11,_binary '','7',1,6),(12,_binary '\0','-1',0,6),(13,_binary '','7',1,7),(14,_binary '\0','-1',0,7),(15,_binary '','7',1,8),(16,_binary '\0','-1',0,8),(17,_binary '','7',1,9),(18,_binary '\0','-1',0,9),(19,_binary '','7',1,10),(20,_binary '\0','-1',0,10),(21,_binary '\0','Data Visualization',0,11),(22,_binary '\0','Data Cleaning',0,11),(23,_binary '','Predictive Analytics',1,11),(24,_binary '\0','Data Visualization',0,12),(25,_binary '\0','Data Cleaning',0,12),(26,_binary '','Predictive Analytics',1,12),(27,_binary '\0','Data Visualization',0,13),(28,_binary '\0','Data Cleaning',0,13),(29,_binary '','Predictive Analytics',1,13),(30,_binary '\0','Data Visualization',0,14),(31,_binary '\0','Data Cleaning',0,14),(32,_binary '','Predictive Analytics',1,14),(33,_binary '\0','Java',0,15),(34,_binary '','Python',1,15),(35,_binary '\0','JavaScript',0,15),(36,_binary '\0','Java',0,16),(37,_binary '','Python',1,16),(38,_binary '\0','JavaScript',0,16),(39,_binary '\0','Java',0,17),(40,_binary '','Python',1,17),(41,_binary '\0','JavaScript',0,17),(42,_binary '\0','Java',0,18),(43,_binary '','Python',1,18),(44,_binary '\0','JavaScript',0,18),(45,_binary '\0','Java',0,19),(46,_binary '','Python',1,19),(47,_binary '\0','JavaScript',0,19),(48,_binary '\0','Java',0,20),(49,_binary '','Python',1,20),(50,_binary '\0','JavaScript',0,20),(51,_binary '\0','The life cycle phases',0,21),(52,_binary '\0','The logical order of tasks',0,21),(53,_binary '','The scope of the project',1,21),(54,_binary '\0','The life cycle phases',0,22),(55,_binary '\0','The logical order of tasks',0,22),(56,_binary '','The scope of the project',1,22),(57,_binary '\0','The life cycle phases',0,23),(58,_binary '\0','The logical order of tasks',0,23),(59,_binary '','The scope of the project',1,23),(60,_binary '\0','The life cycle phases',0,24),(61,_binary '\0','The logical order of tasks',0,24),(62,_binary '','The scope of the project',1,24),(63,_binary '\0','The life cycle phases',0,25),(64,_binary '\0','The logical order of tasks',0,25),(65,_binary '','The scope of the project',1,25),(66,_binary '\0','Conceptualization',0,26),(67,_binary '\0','Planning',0,26),(68,_binary '','Execution',1,26),(69,_binary '\0','Before the project',0,27),(70,_binary '\0','During the project execution',0,27),(71,_binary '','At the start of the project',1,27),(72,_binary '\0','Before the project',0,28),(73,_binary '\0','During the project execution',0,28),(74,_binary '','At the start of the project',1,28),(75,_binary '\0','Before the project',0,29),(76,_binary '\0','During the project execution',0,29),(77,_binary '','At the start of the project',1,29),(78,_binary '\0','Before the project',0,30),(79,_binary '\0','During the project execution',0,30),(80,_binary '','At the start of the project',1,30),(81,_binary '\0','Object-Oriented',0,31),(82,_binary '','Object-Based',1,31),(83,_binary '\0','Assembly-language',0,31),(84,_binary '\0','Object-Oriented',0,32),(85,_binary '','Object-Based',1,32),(86,_binary '\0','Assembly-language',0,32),(87,_binary '\0','Alternative to if-else',0,33),(88,_binary '','Switch statement',1,33),(89,_binary '','immediate if',1,33),(90,_binary '\0','Data Cleaning',0,34),(91,_binary '','Predictive Analytics',1,34),(92,_binary '\0','Java',0,35),(93,_binary '','Python',1,35),(94,_binary '\0','C++',0,35),(95,_binary '','7',1,36),(96,_binary '\0','-1',0,36),(97,_binary '\0','8',0,36),(98,_binary '','7',1,37),(99,_binary '\0','-1',0,37),(100,_binary '\0','8',0,37),(101,_binary '','7',1,38),(102,_binary '\0','-1',0,38),(103,_binary '\0','8',0,38),(104,_binary '','7',1,39),(105,_binary '\0','-1',0,39),(106,_binary '\0','8',0,39),(107,_binary '','7',1,40),(108,_binary '\0','-1',0,40),(109,_binary '\0','8',0,40),(113,_binary '','-1',0,42),(114,_binary '\0','2',0,42),(115,_binary '\0','5',0,42);
/*!40000 ALTER TABLE `options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime(6) NOT NULL,
  `deleted` bit(1) NOT NULL,
  `title` tinytext NOT NULL,
  `total_points` int NOT NULL,
  `updated_date` datetime(6) NOT NULL,
  `exam_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhupso6ldavcx993tfnrjsdl1p` (`exam_id`),
  CONSTRAINT `FKhupso6ldavcx993tfnrjsdl1p` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (1,'2024-08-04 15:23:51.236163',_binary '\0','3+4',1,'2024-08-04 15:23:51.236163',1),(2,'2024-08-04 15:23:51.247516',_binary '\0','3+4',1,'2024-08-04 15:23:51.247516',1),(3,'2024-08-04 15:23:51.252988',_binary '\0','3+4',1,'2024-08-04 15:23:51.252988',1),(4,'2024-08-04 15:23:51.260551',_binary '\0','3+4',1,'2024-08-04 15:23:51.260551',1),(5,'2024-08-04 15:23:51.266514',_binary '\0','3+4',1,'2024-08-04 15:23:51.266514',1),(6,'2024-08-04 15:23:51.271653',_binary '\0','3+4',1,'2024-08-04 15:23:51.271653',1),(7,'2024-08-04 15:23:51.277560',_binary '\0','3+4',1,'2024-08-04 15:23:51.277560',1),(8,'2024-08-04 15:23:51.283339',_binary '\0','3+4',1,'2024-08-04 15:23:51.283339',1),(9,'2024-08-04 15:23:51.289679',_binary '\0','3+4',1,'2024-08-04 15:23:51.289679',1),(10,'2024-08-04 15:23:51.294950',_binary '\0','3+4',1,'2024-08-04 15:23:51.294950',1),(11,'2024-08-05 10:43:24.707600',_binary '\0','What is the primary goal of Data Science?\n',1,'2024-08-05 10:43:24.707600',2),(12,'2024-08-05 10:43:24.726461',_binary '\0','What is the primary goal of Data Science?\n',1,'2024-08-05 10:43:24.726461',2),(13,'2024-08-05 10:43:24.741574',_binary '\0','What is the primary goal of Data Science?\n',1,'2024-08-05 10:43:24.741574',2),(14,'2024-08-05 10:43:24.757129',_binary '\0','What is the primary goal of Data Science?\n',1,'2024-08-05 10:43:24.757129',2),(15,'2024-08-05 10:43:24.772398',_binary '\0','Which programming language is commonly used for Data Science tasks ?',1,'2024-08-05 10:43:24.772398',2),(16,'2024-08-05 10:43:24.787915',_binary '\0','Which programming language is commonly used for Data Science tasks ?',1,'2024-08-05 10:43:24.787915',2),(17,'2024-08-05 10:43:24.799224',_binary '\0','Which programming language is commonly used for Data Science tasks ?',1,'2024-08-05 10:43:24.799224',2),(18,'2024-08-05 10:43:24.813395',_binary '\0','Which programming language is commonly used for Data Science tasks ?',1,'2024-08-05 10:43:24.813395',2),(19,'2024-08-05 10:43:24.827146',_binary '\0','Which programming language is commonly used for Data Science tasks ?',1,'2024-08-05 10:43:24.827297',2),(20,'2024-08-05 10:43:24.838089',_binary '\0','Which programming language is commonly used for Data Science tasks ?',1,'2024-08-05 10:43:24.838089',2),(21,'2024-08-05 11:42:38.649739',_binary '\0','Which one of the following is captured in the Work Breakdown Structure (WBS)?\n',1,'2024-08-05 11:42:38.649739',3),(22,'2024-08-05 11:42:38.667075',_binary '\0','Which one of the following is captured in the Work Breakdown Structure (WBS)?\n',1,'2024-08-05 11:42:38.667075',3),(23,'2024-08-05 11:42:38.679021',_binary '\0','Which one of the following is captured in the Work Breakdown Structure (WBS)?\n',1,'2024-08-05 11:42:38.679021',3),(24,'2024-08-05 11:42:38.693801',_binary '\0','Which one of the following is captured in the Work Breakdown Structure (WBS)?\n',1,'2024-08-05 11:42:38.693801',3),(25,'2024-08-05 11:42:38.710368',_binary '\0','Which one of the following is captured in the Work Breakdown Structure (WBS)?\n',1,'2024-08-05 11:42:38.710368',3),(26,'2024-08-05 11:42:38.722067',_binary '\0','Which stage of project management life cycle requires the maximum time of completion?',1,'2024-08-05 11:42:38.722067',3),(27,'2024-08-05 11:42:38.735370',_binary '\0','In Project management when does planning take place?',1,'2024-08-05 11:42:38.735370',3),(28,'2024-08-05 11:42:38.746992',_binary '\0','In Project management when does planning take place?',1,'2024-08-05 11:42:38.746992',3),(29,'2024-08-05 11:42:38.757398',_binary '\0','In Project management when does planning take place?',1,'2024-08-05 11:42:38.757398',3),(30,'2024-08-05 11:42:38.768528',_binary '\0','In Project management when does planning take place?',1,'2024-08-05 11:42:38.768528',3),(31,'2024-08-05 13:07:33.380339',_binary '\0','Which type of JavaScript language is ___\n?',1,'2024-08-05 13:07:33.380339',4),(32,'2024-08-05 13:07:33.391091',_binary '\0','Which type of JavaScript language is ___\n?',1,'2024-08-05 13:07:33.391091',4),(33,'2024-08-05 13:07:33.399643',_binary '\0','Which one of the following also known as Conditional Expression:',1,'2024-08-05 13:07:33.399643',4),(34,'2024-08-05 13:07:33.408505',_binary '\0','What is the primary goal of Data Science?',1,'2024-08-05 13:07:33.408505',4),(35,'2024-08-05 13:07:33.414472',_binary '\0','Which programming language is commonly used for Data Science tasks ?\n',1,'2024-08-05 13:07:33.414472',4),(36,'2024-08-05 13:07:33.424016',_binary '\0','3+4?',1,'2024-08-05 13:07:33.424016',4),(37,'2024-08-05 13:07:33.431637',_binary '\0','3+4?',1,'2024-08-05 13:07:33.431637',4),(38,'2024-08-05 13:07:33.441300',_binary '\0','3+4?',1,'2024-08-05 13:07:33.441300',4),(39,'2024-08-05 13:07:33.449386',_binary '\0','3+4?',1,'2024-08-05 13:07:33.449386',4),(40,'2024-08-05 13:07:33.457555',_binary '\0','3+4?',1,'2024-08-05 13:07:33.457555',4),(42,'2024-08-05 13:09:34.359956',_binary '\0','2-3?',1,'2024-08-05 13:09:34.371381',4);
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_coursedto`
--

DROP TABLE IF EXISTS `saved_coursedto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_coursedto` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_coursedto`
--

LOCK TABLES `saved_coursedto` WRITE;
/*!40000 ALTER TABLE `saved_coursedto` DISABLE KEYS */;
/*!40000 ALTER TABLE `saved_coursedto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_answers`
--

DROP TABLE IF EXISTS `student_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_answers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `staff_id` varchar(15) NOT NULL,
  `submitted_at` datetime(6) NOT NULL,
  `course_id` bigint NOT NULL,
  `exam_id` bigint NOT NULL,
  `option_id` bigint NOT NULL,
  `question_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKigtaxy7f89y6oo8gl23erry0y` (`course_id`),
  KEY `FKtnm2rp1rfc01ue646j5l29ucs` (`exam_id`),
  KEY `FK7wugr4h46w0iiidumwh06o8s0` (`option_id`),
  KEY `FKobii0vbrtk5jysgoe6944kcx5` (`question_id`),
  CONSTRAINT `FK7wugr4h46w0iiidumwh06o8s0` FOREIGN KEY (`option_id`) REFERENCES `options` (`id`),
  CONSTRAINT `FKigtaxy7f89y6oo8gl23erry0y` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  CONSTRAINT `FKobii0vbrtk5jysgoe6944kcx5` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`),
  CONSTRAINT `FKtnm2rp1rfc01ue646j5l29ucs` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_answers`
--

LOCK TABLES `student_answers` WRITE;
/*!40000 ALTER TABLE `student_answers` DISABLE KEYS */;
INSERT INTO `student_answers` VALUES (1,'26-99938','2024-08-04 15:27:27.164384',1,1,1,1),(2,'26-99938','2024-08-04 15:27:27.211942',1,1,3,2),(3,'26-99938','2024-08-04 15:28:30.063735',1,1,1,1),(4,'26-99938','2024-08-04 15:28:30.093873',1,1,3,2),(5,'26-99938','2024-08-04 15:28:30.109518',1,1,5,3),(6,'26-99938','2024-08-04 15:28:30.131245',1,1,7,4),(7,'26-99938','2024-08-04 15:28:30.146520',1,1,9,5),(8,'26-99938','2024-08-04 15:28:30.163235',1,1,12,6),(9,'26-99938','2024-08-04 15:28:30.180691',1,1,16,8),(10,'26-99938','2024-08-04 15:28:30.197424',1,1,18,9),(11,'26-99938','2024-08-04 15:28:30.215587',1,1,20,10),(12,'26-99938','2024-08-05 13:20:54.850989',9,4,82,31),(13,'26-99938','2024-08-05 13:20:54.880371',9,4,85,32),(14,'26-99938','2024-08-05 13:20:54.906777',9,4,89,33),(15,'26-99938','2024-08-05 13:20:54.930380',9,4,91,34),(16,'26-99938','2024-08-05 13:20:54.949641',9,4,105,39),(17,'26-99938','2024-08-05 13:20:54.970705',9,4,108,40),(18,'26-99938','2024-08-05 13:20:54.988173',9,4,115,42),(19,'26-99938','2024-08-05 13:20:55.003794',9,4,114,42),(20,'26-99938','2024-08-05 13:20:55.020662',9,4,113,42),(21,'26-99938','2024-08-05 13:22:07.938064',9,4,82,31),(22,'26-99938','2024-08-05 13:22:07.968187',9,4,85,32),(23,'26-99938','2024-08-05 13:22:07.989999',9,4,89,33),(24,'26-99938','2024-08-05 13:22:08.011793',9,4,91,34),(25,'26-99938','2024-08-05 13:22:08.035222',9,4,93,35),(26,'26-99938','2024-08-05 13:22:08.056897',9,4,95,36),(27,'26-99938','2024-08-05 13:22:08.079631',9,4,98,37),(28,'26-99938','2024-08-05 13:22:08.098197',9,4,101,38),(29,'26-99938','2024-08-05 13:22:08.115822',9,4,104,39),(30,'26-99938','2024-08-05 13:22:08.134877',9,4,107,40),(31,'26-99938','2024-08-05 13:22:08.156486',9,4,113,42);
/*!40000 ALTER TABLE `student_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentassi`
--

DROP TABLE IF EXISTS `studentassi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentassi` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `file_type` tinytext,
  `submitted_date` datetime(6) DEFAULT NULL,
  `assignment_id` bigint DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2ycp0snys90rrpaannh4kgmq2` (`assignment_id`),
  KEY `FK8oj9ft236g5gqllam3oo6sjud` (`student_id`),
  CONSTRAINT `FK2ycp0snys90rrpaannh4kgmq2` FOREIGN KEY (`assignment_id`) REFERENCES `instructorassi` (`id`),
  CONSTRAINT `FK8oj9ft236g5gqllam3oo6sjud` FOREIGN KEY (`student_id`) REFERENCES `employee` (`sr`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentassi`
--

LOCK TABLES `studentassi` WRITE;
/*!40000 ALTER TABLE `studentassi` DISABLE KEYS */;
INSERT INTO `studentassi` VALUES (1,'stuOriginak.zip','2024-08-04 16:57:00.198918',2,4),(2,'MERN Stack Course-20240418T035708Z-002.zip','2024-08-04 17:02:59.494214',2,4),(3,'signal base aptitude test.zip','2024-08-04 17:03:04.596339',2,4),(4,'table (1).xlsx','2024-08-04 17:03:20.860691',2,4),(5,'table (3).xlsx','2024-08-05 09:24:52.424953',4,4),(6,'Dump20240716.zip','2024-08-05 13:18:41.557583',4,4);
/*!40000 ALTER TABLE `studentassi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `upload_files`
--

DROP TABLE IF EXISTS `upload_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `upload_files` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `completed` bit(1) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `course_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhvy396b5gs76if7y1nkicxdyd` (`course_id`),
  CONSTRAINT `FKhvy396b5gs76if7y1nkicxdyd` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `upload_files`
--

LOCK TABLES `upload_files` WRITE;
/*!40000 ALTER TABLE `upload_files` DISABLE KEYS */;
INSERT INTO `upload_files` VALUES (1,_binary '','Trailer video','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722758876/samples/lesson1.mp4.mp4',1),(2,_binary '','Lesson - 1','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722758876/samples/lesson1.mp4.mp4',1),(3,_binary '','Lesson - 2','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722758886/samples/lesson2.mp4.mp4',1),(4,_binary '\0','Trailer video','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722758876/samples/lesson1.mp4.mp4',2),(5,_binary '\0','Unit - 1','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722758886/samples/lesson2.mp4.mp4',2),(6,_binary '\0','Unit - 2','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722758983/samples/lesson14.mp4.mp4',2),(7,_binary '\0','Trailer video','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722759052/samples/lesson9.mp4.mp4',3),(8,_binary '\0','Lesson - 1','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722757298/samples/lesson5.mp4.mp4',3),(9,_binary '\0','Lesson - 2','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722757293/samples/lesson6.mp4.mp4',3),(10,_binary '','Trailer video','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722759218/samples/lesson11.mp4.mp4',4),(11,_binary '','Unit - 1','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722757293/samples/lesson6.mp4.mp4',4),(12,_binary '','Unit - 2','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722759229/samples/lesson15.mp4.mp4',4),(13,_binary '','Unit - 3 ','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722759234/samples/lesson24.mp4.mp4',4),(14,_binary '\0','Trailer video','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722758983/samples/lesson14.mp4.mp4',5),(15,_binary '\0','Unit - 1','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722759463/samples/lesson41.mp4.mp4',5),(16,_binary '\0','Unit - 2','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722757293/samples/lesson6.mp4.mp4',5),(17,_binary '\0','Trailer video','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722759052/samples/lesson9.mp4.mp4',6),(18,_binary '\0','Lesson - 1','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722759625/samples/lesson23.mp4.mp4',6),(19,_binary '\0','Lesson - 2','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722757293/samples/lesson6.mp4.mp4',6),(20,_binary '\0','Trailer video','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722759760/samples/lesson27.mp4.mp4',7),(21,_binary '\0','Unit - 1','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722759765/samples/lesson28.mp4.mp4',7),(22,_binary '\0','Trailer video','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722759840/samples/lesson4.mp4.mp4',8),(23,_binary '\0','Lesson - 1','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722759229/samples/lesson15.mp4.mp4',8),(24,_binary '\0','Lesson - 2','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722759849/samples/lesson26.mp4.mp4',8),(25,_binary '','Trailer video','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722758876/samples/lesson1.mp4.mp4',9),(26,_binary '','video 1','http://res.cloudinary.com/dsc9cgrzu/video/upload/v1722759840/samples/lesson4.mp4.mp4',9);
/*!40000 ALTER TABLE `upload_files` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-06 11:06:36
