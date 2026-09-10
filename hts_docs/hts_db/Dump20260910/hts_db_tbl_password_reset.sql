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
-- Table structure for table `tbl_password_reset`
--

DROP TABLE IF EXISTS `tbl_password_reset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_password_reset` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(255) DEFAULT NULL,
  `ResetToken` varchar(255) DEFAULT NULL,
  `Expiry` datetime DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_password_reset`
--

LOCK TABLES `tbl_password_reset` WRITE;
/*!40000 ALTER TABLE `tbl_password_reset` DISABLE KEYS */;
INSERT INTO `tbl_password_reset` VALUES (2,'jeraldtulibao@gmail.com','3e340d5b-c9ae-4237-9218-7a294001c0bc','2026-05-06 04:13:52','2026-05-06 03:58:52'),(3,'jntulibao@up.edu.ph','c874e516-4f94-43d5-bdca-5561a0ac5b69','2026-05-20 16:00:17','2026-05-20 15:45:17'),(5,'jeraldtulibao@gmail.com','cb95d4de-6fd6-44e3-9582-ee343a5fa208','2026-05-20 16:00:39','2026-05-20 15:45:39'),(6,'jeraldtulibao@gmail.com','724da081-7381-48f7-badb-767553587227','2026-05-20 16:07:57','2026-05-20 15:52:56'),(8,'jntulibao@up.edu.ph','da33233f-ec23-4e3c-a35c-f62f28310e58','2026-05-21 00:58:02','2026-05-21 00:43:02'),(10,'jntulibao@up.edu.ph','1350714c-0820-4602-8f5c-d8dc5fccc4a5','2026-06-21 14:57:46','2026-06-21 14:42:46'),(14,'jeraldtulibao@gmail.com','fa67244e-1bd2-4081-9e7a-c73c5f03f795','2026-07-10 04:01:48','2026-07-10 03:46:47'),(16,'jntulibao@up.edu.ph','d567aba5-66c7-4652-8e5d-a06fce8d6fe5','2026-07-10 04:54:00','2026-07-10 04:50:59'),(17,'jntulibao@up.edu.ph','7d6cc28b-b55f-4e60-9e45-3bd378139484','2026-07-10 07:55:07','2026-07-10 07:52:07'),(19,'jntulibao@up.edu.ph','051a312a-851b-4f02-8daf-d570be7f7100','2026-07-24 14:45:39','2026-07-24 14:42:38'),(20,'jntulibao@up.edu.ph','5537f318-e865-4288-8508-7e5afdd0b7e5','2026-07-27 11:06:11','2026-07-27 11:03:10'),(21,'jntulibao@up.edu.ph','264560b1-1e8c-4e01-9ad9-9d627a5d65f5','2026-07-27 14:24:02','2026-07-27 14:21:01'),(22,'jntulibao@up.edu.ph','032e2bf2-2f1f-4614-84c0-0766060235e8','2026-07-27 14:27:04','2026-07-27 14:24:04');
/*!40000 ALTER TABLE `tbl_password_reset` ENABLE KEYS */;
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
