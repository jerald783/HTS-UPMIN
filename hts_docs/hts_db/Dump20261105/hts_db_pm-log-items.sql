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
-- Table structure for table `pm-log-items`
--

DROP TABLE IF EXISTS `pm-log-items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pm-log-items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pm_log_id` bigint NOT NULL,
  `property_tag` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serial_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_model` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hw` tinyint(1) DEFAULT '0',
  `os` tinyint(1) DEFAULT '0',
  `sec` tinyint(1) DEFAULT '0',
  `status` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `remarks` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `fk_pm_log_items_pm_log` (`pm_log_id`),
  CONSTRAINT `fk_pm_log_items_pm_log` FOREIGN KEY (`pm_log_id`) REFERENCES `pm-log` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pm-log-items`
--

LOCK TABLES `pm-log-items` WRITE;
/*!40000 ALTER TABLE `pm-log-items` DISABLE KEYS */;
INSERT INTO `pm-log-items` VALUES (41,1,'UPMin-2024-PC-001','ABC123XYZ01','Dell OptiPlex 3080',1,1,1,'P','All checks passed.'),(42,1,'UPMin-2024-PC-002','ABC123XYZ02','Dell OptiPlex 3080',1,1,1,'P','Replaced noisy fan.'),(43,1,'UPMin-2024-PC-003','ABC123XYZ03','Dell OptiPlex 3080',0,0,0,'J','Dead PSU - Issued Job Order'),(44,3,'UPMin-2024-PC-001','ABC123XYZ01','Dell OptiPlex 3080',1,1,1,'P','All checks passed.'),(45,3,'UPMin-2024-PC-002','ABC123XYZ02','Dell OptiPlex 3080',1,1,1,'P','Replaced noisy fan.');
/*!40000 ALTER TABLE `pm-log-items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-05 21:44:56
