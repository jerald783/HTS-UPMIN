-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: hts_db
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `tbl_zoom_schedule`
--

DROP TABLE IF EXISTS `tbl_zoom_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_zoom_schedule` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `ActivityName` varchar(255) DEFAULT NULL,
  `SetupType` varchar(100) DEFAULT NULL,
  `ZoomDescription` text,
  `StartDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `EventDate` date DEFAULT NULL,
  `TimeStart` time DEFAULT NULL,
  `TimeEnd` time DEFAULT NULL,
  `AlternateHosts` text,
  `RequireRegistration` varchar(10) DEFAULT NULL,
  `DesiredPasscode` varchar(50) DEFAULT NULL,
  `RequesterName` varchar(150) DEFAULT NULL,
  `RequesterEmail` varchar(150) DEFAULT NULL,
  `OfficeUnitProject` varchar(150) DEFAULT NULL,
  `AdditionalDetails` text,
  `Score` int DEFAULT NULL,
  `EmailAddress` varchar(150) DEFAULT NULL,
  `ConfigFile` varchar(255) DEFAULT NULL,
  `DateAddressed` date DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_zoom_schedule`
--

LOCK TABLES `tbl_zoom_schedule` WRITE;
/*!40000 ALTER TABLE `tbl_zoom_schedule` DISABLE KEYS */;
INSERT INTO `tbl_zoom_schedule` VALUES (1,'2026-04-29 08:37:45','Counter-Archives of a Film Guerrera: A Retrospective of Sari Dalena’s Cinema','Meeting','Counter-Archives of a Film Guerrera: A Retrospective of Sari Dalena’s Cinema','2026-04-29','2026-04-29','2026-04-29','08:00:00','17:00:00','jntulibao@up.edu.ph','No','12345678','JERALD TULIBAO','jeraldtulibao@gmail.com','ITO','ASDASDA',NULL,NULL,NULL,NULL,'Pending'),(3,'2025-04-30 15:28:09','sds','Webinar','dsdsd','2025-02-02','2025-02-02','2025-02-02','03:27:00','15:27:00','jeraldtulibao@gmail.com',NULL,'sdsadsadsa','dsadsadsadsad','jeraldtulibao@gmail.com','ds','dsadsad',NULL,NULL,NULL,NULL,'Rejected'),(4,'2025-05-08 22:41:18','123','Webinar','DSADSA','2026-05-12','2026-05-12','2026-05-12','08:00:00','17:00:00','jeraldtulibao@gmail.com','Yes','12345678','jeraldtulibao','jeraldtulibao@gmail.com','OVCAA','none',NULL,NULL,NULL,NULL,'Rejected'),(5,'2026-05-08 22:44:59','dsad','Meeting','sdad','2026-05-08','2026-05-08','2026-05-08','22:44:00','10:44:00','jeraldtulibao@gmail.com','Yes','12345678','jeraldtulibao','jeraldtulibao@gmail.com','OVCAA','dasd',NULL,NULL,NULL,NULL,'Pending'),(6,'2026-05-08 22:46:39','sds','Webinar','dsadsad','2026-05-16','2026-05-16','2026-05-16','10:46:00','22:48:00','jeraldtulibao@gmail.com','Yes','12345678','JERALD TULIBAO','jeraldtulibao@gmail.com','OVCAA','fdsf',NULL,NULL,NULL,NULL,'Approved'),(7,'2026-06-21 16:54:13','Okay','Meeting','sdasdd','2026-06-21','2026-06-21','2026-06-21','16:53:00','16:53:00','jeraldtulibao@gmail.com','Yes','2323213232','Jerald Tulibao','jeraldtulibao@gmail.com','ito','dfdsf',NULL,NULL,NULL,NULL,'Pending'),(8,'2026-06-21 22:25:24','123','Meeting','2121','2026-06-21','2026-06-22','2026-06-21','22:24:00','22:24:00','misakaymoshi@gmail.com','Yes','123213213','Darlene Mainit Talapian','jeraldtulibao@gmail.com','ito','sdasdsadadadsad',NULL,NULL,'2e1679f9-a94d-48c6-a54b-a5247d59db25.pdf',NULL,'Pending'),(9,'2026-07-01 23:22:07','Counter-Archives of a Film Guerrera: A Retrospective of Sari Dalena’s Cinema','Meeting','dsad','2026-07-01','2026-07-02','2026-07-01','23:21:00','23:21:00','jntulibao@up.edu.ph','No','dsadasdsad','Jerald Tulibao','jeraldtulibao@gmail.com','ITO','dsadsadsa',NULL,NULL,'151c4bc6-9dfd-469d-9495-32c89551c9e7.pdf',NULL,'Approved'),(10,'2026-07-01 23:27:01','Counter-Archives of a Film Guerrera: A Retrospective of Sari Dalena’s Cinema','Meeting','dsadsa','2026-07-09','2026-07-08','2026-07-09','23:30:00','23:29:00','jntulibao@up.edu.ph','Yes','dsadsadsad','Jerald Tulibao','jeraldtulibao@gmail.com','ITO','dsadsa',NULL,NULL,'f355d63a-9f0c-4f7b-8b2d-527757b9bab6.pdf',NULL,'Approved'),(11,'2026-07-01 23:28:35','Counter-Archives of a Film Guerrera: A Retrospective of Sari Dalena’s Cinema','Webinar','dsad','2026-07-01','2026-07-01','2026-07-01','23:28:00','23:28:00','jntulibao@up.edu.ph','No','fgdgdfggfd','Jerald Tulibao','jeraldtulibao@gmail.com','g','gfd',NULL,NULL,NULL,NULL,'Approved'),(12,'2026-07-01 23:34:04','d','Webinar','dsad','2026-07-01','2026-07-01','2026-07-01','23:33:00','23:33:00','jntulibao@up.edu.ph','Yes','fgdfgfdgdf','Jerald Tulibao','jeraldtulibao@gmail.com','ITO','fdgfdg',NULL,NULL,NULL,NULL,'Approved'),(13,'2026-07-03 13:36:27','SDSADS','Meeting','SDASD','2026-07-03','2026-07-03','2026-07-03','13:36:00','13:36:00','jntulibao@up.edu.ph','Yes','23123WQWEW','Jerald Tulibao','jeraldtulibao@gmail.com','ITO','SDSADSADA',NULL,NULL,NULL,NULL,'Approved'),(14,'2026-07-03 22:57:21','Counter-Archives of a Film Guerrera: A Retrospective of Sari Dalena’s Cinema','Meeting','dsadsa','2026-07-03','2026-07-09','2026-07-03','22:56:00','22:56:00','jntulibao@up.edu.ph','Yes','dsadsaddsa','Jerald Tulibao','jeraldtulibao@gmail.com','ITO','dsadsadsad',NULL,NULL,NULL,NULL,'Approved'),(15,'2026-08-05 20:32:31','sds','Meeting','sdsad','2026-08-05','2026-08-06','2026-08-05','20:32:00','20:32:00','jeraldtulibao@gmail.com','Yes','1234546757','Jerald Tulibao','jeraldtulibao@gmail.com','OVCAA','sdasdasdasdasdsad',NULL,NULL,NULL,NULL,'Pending'),(16,'2026-08-07 22:54:38','asdadsad','Webinar','sdsadsad','2026-08-08','2026-08-08','2026-08-08','22:54:00','22:54:00','jntulibao@up.edu.ph','Yes','dsadsadsad','Jerald Tulibao','jeraldtulibao@gmail.com','ITO','dsadsadsad',NULL,NULL,NULL,NULL,'Approved'),(17,'2026-08-11 19:45:37','Counter-Archives of a Film Guerrera: A Retrospective of Sari Dalena’s Cinema','Webinar','sdasd','2026-08-11','2026-08-11','2026-08-11','19:45:00','19:45:00','dmtalapian@up.edu.ph','Yes','12345678','Jerald Tulibao','dmtalapian@up.edu.ph','GAD','SDASD',NULL,NULL,NULL,NULL,'Pending'),(18,'2026-08-24 20:46:37','Counter-Archives of a Film Guerrera: A Retrospective of Sari Dalena’s Cinema','Webinar','sdasdasdasda','2026-09-02','2026-09-02','2026-09-02','08:00:00','18:00:00','jeraldtulibao@gmail.com','No','12345678','Jerald Tulibao','jeraldtulibao@gmail.com','ITO','akasdjaskdjsakdsdsfdsfsd',NULL,NULL,NULL,NULL,'Pending');
/*!40000 ALTER TABLE `tbl_zoom_schedule` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-10 16:09:38
