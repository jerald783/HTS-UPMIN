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
-- Table structure for table `log_transferasset`
--

DROP TABLE IF EXISTS `log_transferasset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_transferasset` (
  `AuditId` int NOT NULL AUTO_INCREMENT,
  `Action` varchar(50) NOT NULL,
  `PerformedBy` varchar(100) NOT NULL,
  `PerformedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Details` text,
  PRIMARY KEY (`AuditId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_transferasset`
--

LOCK TABLES `log_transferasset` WRITE;
/*!40000 ALTER TABLE `log_transferasset` DISABLE KEYS */;
/*!40000 ALTER TABLE `log_transferasset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_user`
--

DROP TABLE IF EXISTS `log_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_user` (
  `AuditId` int NOT NULL AUTO_INCREMENT,
  `UserId` int DEFAULT NULL,
  `Email` varchar(100) NOT NULL,
  `Action` varchar(50) NOT NULL,
  `Details` text,
  `PerformedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`AuditId`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `log_user_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `tbl_users` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=348 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_user`
--

LOCK TABLES `log_user` WRITE;
/*!40000 ALTER TABLE `log_user` DISABLE KEYS */;
INSERT INTO `log_user` VALUES (57,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-05-20 23:43:54'),(58,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-05-21 09:40:16'),(59,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-05-21 10:02:27'),(60,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-05-22 11:20:11'),(61,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-05-22 11:24:26'),(62,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-05-22 11:24:46'),(63,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-03 09:20:24'),(64,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-03 10:17:29'),(65,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-03 10:17:50'),(66,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-03 10:31:23'),(67,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-03 10:31:34'),(68,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-03 10:35:10'),(69,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-04 08:40:26'),(70,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-04 09:15:06'),(71,11,'jntulibao@up.edu.ph','Update User','Updated user #11 | RoleId: 1','2026-06-04 09:15:30'),(72,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-04 09:15:49'),(73,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-04 16:05:22'),(74,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-04 16:06:34'),(75,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-10 13:46:35'),(76,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-10 14:22:35'),(77,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-10 15:08:10'),(78,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-10 15:10:17'),(79,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-11 13:44:49'),(80,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-11 14:13:31'),(81,11,'jntulibao@up.edu.ph','Update User','Updated user #18 | RoleId: 2','2026-06-11 14:51:34'),(82,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-11 14:52:09'),(83,11,'jntulibao@up.edu.ph','Update User','Updated user #18 | RoleId: 2','2026-06-11 14:52:31'),(84,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-11 15:07:20'),(85,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-11 15:08:01'),(86,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-11 15:22:14'),(87,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-11 15:22:33'),(88,NULL,'System','UpdateGoogleClientID','Updated Google Client ID to: 374013496538-24tugte7gt307bffsgspgeos9keben99.apps.googleusercontent.com','2026-06-11 15:23:14'),(89,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-11 15:27:35'),(90,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-11 15:27:44'),(91,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-11 15:28:32'),(92,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-11 15:28:50'),(93,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-11 15:41:57'),(94,NULL,'hts.upmin@gmail.com','GoogleLoginFailed','Not registered Google account','2026-06-11 23:06:55'),(95,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-11 23:07:30'),(96,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-11 23:11:32'),(97,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-16 11:44:25'),(98,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-18 21:19:22'),(99,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-18 21:29:11'),(100,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-18 21:32:45'),(101,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-18 21:32:55'),(102,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-18 21:40:09'),(103,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-18 21:47:25'),(104,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-19 16:10:29'),(105,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-19 16:12:52'),(106,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-19 16:13:02'),(107,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-19 16:36:20'),(108,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-19 16:37:17'),(109,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-19 16:38:28'),(110,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-19 16:38:50'),(111,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-19 16:43:19'),(112,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-19 16:45:34'),(113,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-19 16:47:25'),(114,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-19 16:54:20'),(115,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-19 16:57:03'),(116,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-19 17:01:33'),(117,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-19 17:03:00'),(118,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-19 17:04:03'),(119,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-19 17:04:42'),(120,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-19 17:07:30'),(121,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-19 19:02:31'),(122,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-20 00:10:09'),(123,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-20 00:10:19'),(124,NULL,'dmtalapian@gmail.com','GoogleLoginFailed','Not registered Google account','2026-06-20 00:12:55'),(125,18,'webinar.upmindanao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-20 00:13:12'),(126,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-20 00:32:50'),(127,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-20 14:23:16'),(128,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-20 23:56:04'),(129,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-21 00:17:55'),(130,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 00:20:59'),(131,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 00:26:23'),(132,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 00:27:06'),(133,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 00:27:37'),(134,NULL,'hts.upmin@gmail.com','GoogleLoginFailed','Not registered Google account','2026-06-21 00:35:56'),(135,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 11:17:34'),(136,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 11:21:58'),(137,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 11:29:18'),(138,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 11:35:14'),(139,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 11:40:40'),(140,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 11:46:56'),(141,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 11:47:06'),(142,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 11:52:51'),(143,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 11:53:00'),(144,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 11:57:36'),(145,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 11:58:06'),(146,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-21 12:12:04'),(147,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 12:15:22'),(148,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 12:15:52'),(149,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 12:22:00'),(150,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-21 12:32:03'),(151,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 12:33:54'),(152,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 12:53:08'),(153,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 13:06:46'),(154,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 13:11:19'),(155,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 13:28:10'),(156,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-21 13:56:00'),(157,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 13:59:11'),(158,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 13:59:37'),(159,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 14:08:13'),(160,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 14:09:26'),(161,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 14:13:55'),(162,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 14:15:35'),(163,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 15:16:05'),(164,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 15:18:15'),(165,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 15:19:31'),(166,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 15:20:01'),(167,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 15:23:28'),(168,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 15:30:16'),(169,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 15:54:43'),(170,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 16:17:32'),(171,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 16:18:35'),(172,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 16:53:12'),(173,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 17:42:09'),(174,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 17:45:19'),(175,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 17:50:07'),(176,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 18:21:21'),(177,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-21 18:48:33'),(178,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 18:49:18'),(179,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 19:20:52'),(180,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-21 20:07:20'),(181,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 20:11:47'),(182,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 20:18:38'),(183,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 20:23:04'),(184,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 20:34:15'),(185,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 20:37:11'),(186,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 20:43:27'),(187,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 20:43:44'),(188,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 22:05:48'),(189,NULL,'hts.upmin@gmail.com','GoogleLoginFailed','Not registered Google account','2026-06-21 22:42:11'),(190,NULL,'dmtalapian@gmail.com','GoogleLoginFailed','Not registered Google account','2026-06-21 22:45:56'),(191,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 23:02:54'),(192,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-21 23:21:27'),(193,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-22 08:47:13'),(194,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-22 11:44:12'),(195,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-22 11:48:46'),(196,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-22 11:52:04'),(197,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-24 16:53:09'),(198,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-24 19:30:37'),(199,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-24 22:39:08'),(200,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-24 22:50:20'),(201,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-24 22:50:41'),(202,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-24 22:54:14'),(203,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-25 09:04:25'),(204,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-25 10:47:46'),(205,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-25 11:09:48'),(206,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-06-25 11:18:07'),(207,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-25 13:22:03'),(208,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-25 13:43:36'),(209,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-25 13:43:46'),(210,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-25 13:57:53'),(211,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-25 13:58:15'),(212,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-25 13:59:06'),(213,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-25 16:46:16'),(214,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-06-27 15:22:10'),(215,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-29 13:52:48'),(216,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-29 13:53:12'),(217,11,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-06-29 15:24:27'),(218,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-02 22:02:16'),(219,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-02 22:50:04'),(220,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-02 23:01:06'),(221,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-03 10:05:31'),(222,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-03 10:28:40'),(223,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-03 10:51:16'),(224,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-03 10:53:28'),(225,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-03 11:49:36'),(226,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-03 12:56:34'),(227,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-03 13:36:52'),(228,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 14:42:43'),(229,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 14:42:53'),(230,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 14:44:44'),(231,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 15:07:43'),(232,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 15:25:49'),(233,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 16:37:32'),(234,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 16:50:17'),(235,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-03 17:28:00'),(236,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-03 17:29:07'),(237,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 17:29:52'),(238,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 19:59:20'),(239,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-03 20:07:46'),(240,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 20:09:51'),(241,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-03 20:11:10'),(242,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 20:17:50'),(243,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 20:47:48'),(244,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 20:58:41'),(245,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 21:41:57'),(246,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-03 21:55:28'),(247,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 22:01:45'),(248,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-03 22:06:23'),(249,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-03 22:13:02'),(250,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 22:37:48'),(251,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 22:39:02'),(252,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-03 22:48:25'),(253,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 22:51:23'),(254,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 23:14:50'),(255,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 23:20:25'),(256,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-03 23:22:26'),(257,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-03 23:35:33'),(258,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 23:38:28'),(259,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 23:49:21'),(260,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-03 23:54:33'),(261,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-04 00:04:14'),(262,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-07 21:07:26'),(263,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-07 21:33:56'),(264,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-07 22:07:12'),(265,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-07 22:09:42'),(266,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-07 22:16:34'),(267,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-07 22:19:35'),(268,NULL,'System','UpdateGoogleClientID','Updated Google Client ID to: 374013496538-24tugte7gt307bffsgspgeos9keben99.apps.googleusercontent.com','2026-07-07 23:01:41'),(269,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-07 23:01:51'),(270,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-07 23:02:26'),(271,21,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-07 23:04:05'),(272,NULL,'hts.upmin@gmail.com','GoogleLoginFailed','Not registered Google account','2026-07-10 10:34:02'),(273,NULL,'hts.upmin@gmail.com','GoogleLoginFailed','Not registered Google account','2026-07-10 10:34:33'),(274,NULL,'hts.upmin@gmail.com','GoogleLoginFailed','Not registered Google account','2026-07-10 10:34:44'),(275,NULL,'hts.upmin@gmail.com','GoogleLoginFailed','Not registered Google account','2026-07-10 10:35:31'),(276,NULL,'hts.upmin@gmail.com','GoogleLoginFailed','Not registered Google account','2026-07-10 10:42:07'),(277,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-10 11:13:26'),(278,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-10 11:20:52'),(279,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-10 11:21:43'),(280,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-10 12:04:02'),(281,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-10 12:30:37'),(282,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-10 13:33:20'),(283,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-10 14:23:59'),(284,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-10 14:30:04'),(285,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-10 14:33:37'),(286,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-10 14:39:44'),(287,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-10 15:27:36'),(288,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-10 15:28:12'),(289,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-10 15:28:24'),(290,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-10 15:34:14'),(291,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-10 15:37:54'),(292,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-10 15:55:13'),(293,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-10 16:08:14'),(294,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-10 16:31:06'),(295,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-10 16:31:13'),(296,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-11 12:37:58'),(297,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-11 14:52:58'),(298,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-11 14:58:45'),(299,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-13 20:17:48'),(300,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-15 16:13:01'),(301,NULL,'dmtalapian@gmail.com','GoogleLoginFailed','Not registered Google account','2026-07-15 17:00:05'),(302,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-15 17:00:18'),(303,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-15 17:06:56'),(304,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-15 17:17:53'),(305,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-15 20:33:09'),(306,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-15 20:33:52'),(307,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-15 20:49:00'),(308,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-15 20:50:06'),(309,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-07-15 20:58:33'),(310,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-07-15 22:06:35'),(311,2,'dmtalapian@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-15 22:11:03'),(312,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-15 22:13:38'),(313,23,'jntulibao@up.edu.ph','Update User','Updated user #23 | RoleId: 1','2026-07-15 22:55:33'),(314,23,'jntulibao@up.edu.ph','Update User','Updated user #2 | RoleId: 4','2026-07-15 23:05:32'),(315,NULL,'dmtalapian@gmail.com','GoogleLoginFailed','Not registered Google account','2026-07-15 23:50:24'),(316,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-16 08:26:18'),(317,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-16 08:33:22'),(318,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-16 18:08:22'),(319,NULL,'misakaymoshi@gmail.com','GoogleLoginFailed','Not registered Google account','2026-07-17 11:50:34'),(320,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-17 11:50:42'),(321,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-17 11:51:29'),(322,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-17 12:54:38'),(323,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-17 15:28:48'),(324,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-17 19:21:34'),(325,NULL,'misakaymoshi@gmail.com','GoogleLoginFailed','Not registered Google account','2026-07-17 23:00:52'),(326,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-17 23:10:57'),(327,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-17 23:35:36'),(328,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-18 14:38:44'),(329,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-18 14:39:19'),(330,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-20 19:40:37'),(331,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-20 21:31:57'),(332,23,'jntulibao@up.edu.ph','Update User','Updated user #24 | RoleId: 4','2026-07-20 21:32:34'),(333,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-20 21:32:59'),(334,23,'jntulibao@up.edu.ph','Update User','Updated user #24 | RoleId: 4','2026-07-20 21:33:17'),(335,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-21 10:49:35'),(336,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-21 14:17:47'),(337,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-21 20:44:09'),(338,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-21 20:56:55'),(339,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-22 09:45:28'),(340,4,'jeraldtulibao@gmail.com','GoogleLoginSuccess','Login successful','2026-07-22 09:53:29'),(341,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-22 10:13:44'),(342,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-22 11:14:20'),(343,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-22 20:03:12'),(344,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-22 22:58:46'),(345,23,'jntulibao@up.edu.ph','GoogleLoginSuccess','Login successful','2026-07-22 23:03:26'),(346,3,'jeraldtulibao783@gmail.com','GoogleLoginSuccess','Login successful','2026-07-23 16:22:58'),(347,23,'jntulibao@up.edu.ph','Update User','Updated user #24 | RoleId: 4','2026-07-23 16:25:23');
/*!40000 ALTER TABLE `log_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_activity_logs`
--

DROP TABLE IF EXISTS `tbl_activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_activity_logs` (
  `LogId` int NOT NULL AUTO_INCREMENT,
  `Module` varchar(100) NOT NULL,
  `Action` varchar(100) NOT NULL,
  `Description` text NOT NULL,
  `UserId` int DEFAULT NULL,
  `UserEmail` varchar(255) DEFAULT NULL,
  `ReferenceId` varchar(100) DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`LogId`)
) ENGINE=InnoDB AUTO_INCREMENT=11952 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_activity_logs`
--

LOCK TABLES `tbl_activity_logs` WRITE;
/*!40000 ALTER TABLE `tbl_activity_logs` DISABLE KEYS */;
INSERT INTO `tbl_activity_logs` VALUES (11845,'GoogleLogin','GetGoogleClientId','Executed GoogleLogin/GetGoogleClientId',NULL,'jntulibao@up.edu.ph','','2026-07-22 15:12:14'),(11846,'GoogleLogin','GetGoogleClientId','Executed GoogleLogin/GetGoogleClientId',NULL,'jntulibao@up.edu.ph','','2026-07-22 15:12:14'),(11847,'User','Login','Executed User/Login',NULL,'jntulibao@up.edu.ph','','2026-07-22 15:12:33'),(11848,'User','Validate','Executed User/Validate',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:33'),(11849,'Ticket','GetTicketStats','Executed Ticket/GetTicketStats',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:33'),(11850,'Ticket','GetTicketStats','Executed Ticket/GetTicketStats',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:33'),(11851,'Chat','GetUserNotifications','Executed Chat/GetUserNotifications',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:33'),(11852,'User','Validate','Executed User/Validate',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:35'),(11853,'User','GetAgents','Executed User/GetAgents',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:35'),(11854,'Chat','GetUserNotifications','Executed Chat/GetUserNotifications',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:35'),(11855,'Ticket','UpdateOverdueTickets','Executed Ticket/UpdateOverdueTickets',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:35'),(11856,'Chat','GetUserNotifications','Executed Chat/GetUserNotifications',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:35'),(11857,'Ticket','GettAllTickets','Executed Ticket/GettAllTickets',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:35'),(11858,'Ticket','UpdateOverdueTickets','Executed Ticket/UpdateOverdueTickets',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:35'),(11859,'Ticket','GettAllTickets','Executed Ticket/GettAllTickets',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:35'),(11860,'User','Validate','Executed User/Validate',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:38'),(11861,'ZoomSchedule','Get','Executed ZoomSchedule/Get',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:38'),(11862,'Chat','GetUserNotifications','Executed Chat/GetUserNotifications',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:38'),(11863,'User','Validate','Executed User/Validate',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:42'),(11864,'Chat','GetUserNotifications','Executed Chat/GetUserNotifications',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:42'),(11865,'TicketWifi','GetAllSupportRequests','Executed TicketWifi/GetAllSupportRequests',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:42'),(11866,'User','Validate','Executed User/Validate',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:43'),(11867,'Chat','GetUserNotifications','Executed Chat/GetUserNotifications',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:43'),(11868,'ZoomSchedule','Get','Executed ZoomSchedule/Get',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:43'),(11869,'User','Logout','Executed User/Logout',NULL,'jeraldtulibao783@gmail.com','','2026-07-22 15:12:54'),(11870,'GoogleLogin','GetGoogleClientId','Executed GoogleLogin/GetGoogleClientId',NULL,'','','2026-07-22 15:12:54'),(11871,'GoogleLogin','GetGoogleClientId','Executed GoogleLogin/GetGoogleClientId',NULL,'','','2026-07-23 08:22:49'),(11872,'GoogleLogin','GoogleLogin','Executed GoogleLogin/GoogleLogin',NULL,'','','2026-07-23 08:22:58'),(11873,'User','Validate','Executed User/Validate',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:22:58'),(11874,'Ticket','GetTicketStats','Executed Ticket/GetTicketStats',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:22:59'),(11875,'Chat','GetUserNotifications','Executed Chat/GetUserNotifications',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:22:59'),(11876,'Ticket','GetTicketStats','Executed Ticket/GetTicketStats',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:22:59'),(11877,'User','Validate','Executed User/Validate',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:00'),(11878,'User','GetAgents','Executed User/GetAgents',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:01'),(11879,'Chat','GetUserNotifications','Executed Chat/GetUserNotifications',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:01'),(11880,'Ticket','UpdateOverdueTickets','Executed Ticket/UpdateOverdueTickets',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:01'),(11881,'Chat','GetUserNotifications','Executed Chat/GetUserNotifications',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:01'),(11882,'Ticket','UpdateOverdueTickets','Executed Ticket/UpdateOverdueTickets',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:01'),(11883,'Ticket','GettAllTickets','Executed Ticket/GettAllTickets',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:01'),(11884,'Ticket','GettAllTickets','Executed Ticket/GettAllTickets',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:01'),(11885,'User','Validate','Executed User/Validate',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:04'),(11886,'Chat','GetUserNotifications','Executed Chat/GetUserNotifications',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:04'),(11887,'ZoomSchedule','Get','Executed ZoomSchedule/Get',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:04'),(11888,'ZoomSchedule','GetById','Executed ZoomSchedule/GetById',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:10'),(11889,'ZoomSchedule','GetAttachment','Executed ZoomSchedule/GetAttachment',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:10'),(11890,'ZoomSchedule','GetById','Executed ZoomSchedule/GetById',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:19'),(11891,'ZoomSchedule','GetAttachment','Executed ZoomSchedule/GetAttachment',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:19'),(11892,'User','Validate','Executed User/Validate',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:27'),(11893,'Chat','GetUserNotifications','Executed Chat/GetUserNotifications',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:27'),(11894,'TicketWifi','GetAllSupportRequests','Executed TicketWifi/GetAllSupportRequests',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:27'),(11895,'User','Logout','Executed User/Logout',NULL,'jeraldtulibao783@gmail.com','','2026-07-23 08:23:48'),(11896,'GoogleLogin','GetGoogleClientId','Executed GoogleLogin/GetGoogleClientId',NULL,'','','2026-07-23 08:23:48'),(11897,'User','Login','Executed User/Login',NULL,'','','2026-07-23 08:23:54'),(11898,'User','Validate','Executed User/Validate',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:23:54'),(11899,'User','Validate','Executed User/Validate',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:23:57'),(11900,'ZoomSchedule','Get','Executed ZoomSchedule/Get',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:23:57'),(11901,'ZoomSchedule','GetByUser','Executed ZoomSchedule/GetByUser',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:23:57'),(11902,'ZoomSchedule','GetById','Executed ZoomSchedule/GetById',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:00'),(11903,'User','Validate','Executed User/Validate',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:06'),(11904,'Chat','GetUserNotifications','Executed Chat/GetUserNotifications',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:06'),(11905,'Ticket','GetTicketByUser','Executed Ticket/GetTicketByUser',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:06'),(11906,'User','Validate','Executed User/Validate',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:08'),(11907,'ZoomSchedule','GetByUser','Executed ZoomSchedule/GetByUser',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:08'),(11908,'ZoomSchedule','Get','Executed ZoomSchedule/Get',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:08'),(11909,'User','Validate','Executed User/Validate',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:13'),(11910,'Chat','GetUserNotifications','Executed Chat/GetUserNotifications',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:13'),(11911,'Ticket','GetTicketByUser','Executed Ticket/GetTicketByUser',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:13'),(11912,'User','Validate','Executed User/Validate',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:14'),(11913,'Ticket','GetTicketByUser','Executed Ticket/GetTicketByUser',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:14'),(11914,'TicketFeedback','GetByUser','Executed TicketFeedback/GetByUser',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:14'),(11915,'User','Validate','Executed User/Validate',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:15'),(11916,'Ticket','GetTicketByUser','Executed Ticket/GetTicketByUser',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:15'),(11917,'Chat','GetUserNotifications','Executed Chat/GetUserNotifications',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:15'),(11918,'User','Validate','Executed User/Validate',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:17'),(11919,'ZoomSchedule','Get','Executed ZoomSchedule/Get',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:17'),(11920,'ZoomSchedule','GetByUser','Executed ZoomSchedule/GetByUser',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:17'),(11921,'User','Logout','Executed User/Logout',NULL,'jeraldtulibao@gmail.com','','2026-07-23 08:24:39'),(11922,'GoogleLogin','GetGoogleClientId','Executed GoogleLogin/GetGoogleClientId',NULL,'','','2026-07-23 08:24:39'),(11923,'User','Login','Executed User/Login',NULL,'','','2026-07-23 08:24:46'),(11924,'User','Login','Executed User/Login',NULL,'','','2026-07-23 08:24:53'),(11925,'User','Validate','Executed User/Validate',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:24:53'),(11926,'Ticket','GetTicketStats','Executed Ticket/GetTicketStats',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:24:53'),(11927,'Ticket','GetTicketStats','Executed Ticket/GetTicketStats',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:24:53'),(11928,'Ticket','UpdateOverdueTickets','Executed Ticket/UpdateOverdueTickets',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:24:56'),(11929,'Ticket','UpdateOverdueTickets','Executed Ticket/UpdateOverdueTickets',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:24:56'),(11930,'Ticket','GetAgents','Executed Ticket/GetAgents',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:24:56'),(11931,'Ticket','GettAllTickets','Executed Ticket/GettAllTickets',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:24:56'),(11932,'Ticket','GettAllTickets','Executed Ticket/GettAllTickets',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:24:56'),(11933,'ZoomSchedule','Get','Executed ZoomSchedule/Get',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:24:57'),(11934,'ZoomSchedule','GetById','Executed ZoomSchedule/GetById',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:25:02'),(11935,'ZoomSchedule','GetAttachment','Executed ZoomSchedule/GetAttachment',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:25:02'),(11936,'ZoomSchedule','GetAttachment','Executed ZoomSchedule/GetAttachment',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:25:05'),(11937,'User','GetAllUsers','Executed User/GetAllUsers',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:25:15'),(11938,'User','GetRoles','Executed User/GetRoles',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:25:18'),(11939,'User','UpdateUser','Executed User/UpdateUser',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:25:23'),(11940,'User','GetAllUsers','Executed User/GetAllUsers',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:25:27'),(11941,'GoogleLogin','GetGoogleClientId','Executed GoogleLogin/GetGoogleClientId',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:25:35'),(11942,'Smtp','GetSmtpSettings','Executed Smtp/GetSmtpSettings',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:25:35'),(11943,'TicketExtraFields','GetFields','Executed TicketExtraFields/GetFields',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:25:35'),(11944,'Ticket','GetAgents','Executed Ticket/GetAgents',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:25:53'),(11945,'Ticket','UpdateOverdueTickets','Executed Ticket/UpdateOverdueTickets',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:25:53'),(11946,'Ticket','UpdateOverdueTickets','Executed Ticket/UpdateOverdueTickets',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:25:53'),(11947,'Ticket','GettAllTickets','Executed Ticket/GettAllTickets',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:25:53'),(11948,'Ticket','GettAllTickets','Executed Ticket/GettAllTickets',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:25:53'),(11949,'Ticket','GettAllTickets','Executed Ticket/GettAllTickets',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:25:57'),(11950,'GoogleLogin','GetGoogleClientId','Executed GoogleLogin/GetGoogleClientId',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:26:20'),(11951,'GoogleLogin','GetGoogleClientId','Executed GoogleLogin/GetGoogleClientId',NULL,'jntulibao@up.edu.ph','','2026-07-23 08:46:03');
/*!40000 ALTER TABLE `tbl_activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_assets`
--

DROP TABLE IF EXISTS `tbl_assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_assets` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CollCode` varchar(100) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Desc1` text,
  `AnDate` date DEFAULT NULL,
  `MrNum` varchar(100) DEFAULT NULL,
  `PropNo` varchar(100) DEFAULT NULL,
  `Qty` int DEFAULT NULL,
  `UM` varchar(50) DEFAULT NULL,
  `UCost` decimal(18,2) DEFAULT NULL,
  `TCost` decimal(18,2) DEFAULT NULL,
  `UserName` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `CurrentUser` varchar(100) DEFAULT NULL,
  `EqStatus` varchar(100) DEFAULT NULL,
  `SerialNumber` varchar(100) DEFAULT NULL,
  `Location` varchar(100) DEFAULT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `idx_assets_userid` (`UserId`),
  CONSTRAINT `tbl_assets_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `tbl_users` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_assets`
--

LOCK TABLES `tbl_assets` WRITE;
/*!40000 ALTER TABLE `tbl_assets` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_email_verification`
--

DROP TABLE IF EXISTS `tbl_email_verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_email_verification` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(255) DEFAULT NULL,
  `OtpCode` varchar(10) DEFAULT NULL,
  `Expiry` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_email_verification`
--

LOCK TABLES `tbl_email_verification` WRITE;
/*!40000 ALTER TABLE `tbl_email_verification` DISABLE KEYS */;
INSERT INTO `tbl_email_verification` VALUES (1,'webinar.upmindanao@up.edu.ph','164343','2026-05-20 13:41:44'),(2,'webinar.upmindanao@up.edu.ph','796313','2026-05-20 13:41:45'),(3,'webinar.upmindanao@up.edu.ph','994860','2026-05-20 13:50:15'),(4,'webinar.upmindanao@up.edu.ph','435747','2026-05-20 14:04:47'),(5,'webinar.upmindanao@up.edu.ph','651734','2026-05-20 14:06:07'),(6,'webinar.upmindanao@up.edu.ph','207916','2026-05-20 14:07:06'),(7,'webinar.upmindanao@up.edu.ph','216418','2026-05-20 14:12:29'),(8,'webinar.upmindanao@up.edu.ph','852642','2026-05-20 14:13:49'),(9,'webinar.upmindanao@up.edu.ph','874514','2026-05-20 14:24:28'),(10,'jntulibao@up.edu.ph','635862','2026-05-20 15:09:49'),(11,'webinar.upmindanao@up.edu.ph','743379','2026-05-20 15:11:21'),(12,'webinar.upmindanao@up.edu.ph','657758','2026-05-20 15:15:17'),(13,'webinar.upmindanao@up.edu.ph','242060','2026-05-20 15:21:53'),(14,'webinar.upmindanao@up.edu.ph','743905','2026-05-20 15:27:39'),(15,'webinar.upmindanao@up.edu.ph','113922','2026-05-20 15:40:16'),(16,'webinar.upmindanao@up.edu.ph','260875','2026-05-20 15:41:09'),(17,'webinar.upmindanao@up.edu.ph','276772','2026-05-20 15:42:32'),(18,'webinar.upmindanao@up.edu.ph','467365','2026-06-11 06:55:14'),(19,'jntulibao@up.edu.ph','626783','2026-07-02 10:50:15'),(20,'jntulibao@up.edu.ph','966105','2026-07-02 10:53:29'),(21,'jntulibao@up.edu.ph','448280','2026-07-02 10:57:16'),(22,'jntulibao@up.edu.ph','469558','2026-07-02 11:00:23'),(23,'jntulibao@up.edu.ph','503709','2026-07-02 11:02:58'),(24,'jntulibao@up.edu.ph','873506','2026-07-02 11:04:18'),(25,'jntulibao@up.edu.ph','485156','2026-07-02 11:04:52'),(26,'jntulibao@up.edu.ph','800994','2026-07-02 11:05:54'),(27,'jntulibao@up.edu.ph','393638','2026-07-02 11:08:15'),(28,'jntulibao@up.edu.ph','855895','2026-07-02 11:10:50'),(29,'jntulibao@up.edu.ph','905966','2026-07-02 11:12:25'),(30,'jntulibao@up.edu.ph','449035','2026-07-02 11:15:36'),(31,'jntulibao@up.edu.ph','494685','2026-07-02 11:16:22'),(32,'jntulibao@up.edu.ph','545003','2026-07-02 11:19:13'),(33,'jntulibao@up.edu.ph','851774','2026-07-02 11:20:51'),(34,'jntulibao@up.edu.ph','412929','2026-07-02 11:24:12'),(35,'jntulibao@up.edu.ph','344235','2026-07-02 13:52:50'),(36,'jntulibao@up.edu.ph','785837','2026-07-10 05:20:58'),(37,'jntulibao@up.edu.ph','875802','2026-07-10 05:35:42'),(38,'jntulibao@up.edu.ph','808403','2026-07-10 05:36:58'),(39,'dmtalapian@up.edu.ph','259754','2026-07-17 15:07:27');
/*!40000 ALTER TABLE `tbl_email_verification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_googlelogin`
--

DROP TABLE IF EXISTS `tbl_googlelogin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_googlelogin` (
  `SettingKey` varchar(100) NOT NULL,
  `SettingValue` text,
  PRIMARY KEY (`SettingKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_googlelogin`
--

LOCK TABLES `tbl_googlelogin` WRITE;
/*!40000 ALTER TABLE `tbl_googlelogin` DISABLE KEYS */;
INSERT INTO `tbl_googlelogin` VALUES ('google_client_id','374013496538-24tugte7gt307bffsgspgeos9keben99.apps.googleusercontent.com');
/*!40000 ALTER TABLE `tbl_googlelogin` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_password_reset`
--

LOCK TABLES `tbl_password_reset` WRITE;
/*!40000 ALTER TABLE `tbl_password_reset` DISABLE KEYS */;
INSERT INTO `tbl_password_reset` VALUES (2,'jeraldtulibao@gmail.com','3e340d5b-c9ae-4237-9218-7a294001c0bc','2026-05-06 04:13:52','2026-05-06 03:58:52'),(3,'jntulibao@up.edu.ph','c874e516-4f94-43d5-bdca-5561a0ac5b69','2026-05-20 16:00:17','2026-05-20 15:45:17'),(5,'jeraldtulibao@gmail.com','cb95d4de-6fd6-44e3-9582-ee343a5fa208','2026-05-20 16:00:39','2026-05-20 15:45:39'),(6,'jeraldtulibao@gmail.com','724da081-7381-48f7-badb-767553587227','2026-05-20 16:07:57','2026-05-20 15:52:56'),(8,'jntulibao@up.edu.ph','da33233f-ec23-4e3c-a35c-f62f28310e58','2026-05-21 00:58:02','2026-05-21 00:43:02'),(10,'jntulibao@up.edu.ph','1350714c-0820-4602-8f5c-d8dc5fccc4a5','2026-06-21 14:57:46','2026-06-21 14:42:46'),(14,'jeraldtulibao@gmail.com','fa67244e-1bd2-4081-9e7a-c73c5f03f795','2026-07-10 04:01:48','2026-07-10 03:46:47'),(16,'jntulibao@up.edu.ph','d567aba5-66c7-4652-8e5d-a06fce8d6fe5','2026-07-10 04:54:00','2026-07-10 04:50:59'),(17,'jntulibao@up.edu.ph','7d6cc28b-b55f-4e60-9e45-3bd378139484','2026-07-10 07:55:07','2026-07-10 07:52:07');
/*!40000 ALTER TABLE `tbl_password_reset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_roles`
--

DROP TABLE IF EXISTS `tbl_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_roles` (
  `RoleId` int NOT NULL AUTO_INCREMENT,
  `RoleName` varchar(50) NOT NULL,
  PRIMARY KEY (`RoleId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_roles`
--

LOCK TABLES `tbl_roles` WRITE;
/*!40000 ALTER TABLE `tbl_roles` DISABLE KEYS */;
INSERT INTO `tbl_roles` VALUES (1,'Admin'),(2,'Agent'),(3,'Regular'),(4,'COS'),(5,'SPMO');
/*!40000 ALTER TABLE `tbl_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_smtp_settings`
--

DROP TABLE IF EXISTS `tbl_smtp_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_smtp_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `server` varchar(100) DEFAULT NULL,
  `port` int DEFAULT NULL,
  `sender_name` varchar(100) DEFAULT NULL,
  `sender_email` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `enable_ssl` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_smtp_settings`
--

LOCK TABLES `tbl_smtp_settings` WRITE;
/*!40000 ALTER TABLE `tbl_smtp_settings` DISABLE KEYS */;
INSERT INTO `tbl_smtp_settings` VALUES (1,'smtp.gmail.com',587,'Help Desk Ticketing System','hts.upmin@gmail.com','hts.upmin@gmail.com','ymhb rbkn byfi bwkn',1);
/*!40000 ALTER TABLE `tbl_smtp_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_support_requests`
--

DROP TABLE IF EXISTS `tbl_support_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_support_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `up_email` varchar(150) NOT NULL,
  `request_date` date NOT NULL,
  `category` varchar(100) NOT NULL,
  `course_dept` varchar(150) NOT NULL,
  `concern` text NOT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `date_resolved` date DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_support_requests`
--

LOCK TABLES `tbl_support_requests` WRITE;
/*!40000 ALTER TABLE `tbl_support_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_support_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_ticket_extra_fields`
--

DROP TABLE IF EXISTS `tbl_ticket_extra_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_ticket_extra_fields` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `FieldName` varchar(100) DEFAULT NULL,
  `FieldLabel` varchar(100) DEFAULT NULL,
  `FieldType` varchar(50) DEFAULT NULL,
  `Options` text,
  `IsRequired` tinyint(1) DEFAULT '0',
  `IsActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_ticket_extra_fields`
--

LOCK TABLES `tbl_ticket_extra_fields` WRITE;
/*!40000 ALTER TABLE `tbl_ticket_extra_fields` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_ticket_extra_fields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_ticketfeedback`
--

DROP TABLE IF EXISTS `tbl_ticketfeedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_ticketfeedback` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TicketNumber` varchar(50) NOT NULL,
  `TicketId` int DEFAULT NULL,
  `CompanyName` varchar(100) DEFAULT NULL,
  `Unit` varchar(50) DEFAULT NULL,
  `FullName` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `SupportAgent` varchar(100) DEFAULT NULL,
  `IssueType` varchar(255) DEFAULT NULL,
  `SupportChannel` varchar(255) DEFAULT NULL,
  `OtherIssue` varchar(255) DEFAULT NULL,
  `DateRequested` date DEFAULT NULL,
  `DateResolved` date DEFAULT NULL,
  `FeedbackText` text,
  `Rating` int DEFAULT NULL,
  `ResponseTime` varchar(20) DEFAULT NULL,
  `TechnicalKnowledge` varchar(20) DEFAULT NULL,
  `Professionalism` varchar(20) DEFAULT NULL,
  `Communication` varchar(20) DEFAULT NULL,
  `Resolution` varchar(20) DEFAULT NULL,
  `Signature` varchar(255) DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `idx_feedback_ticketid` (`TicketId`),
  CONSTRAINT `tbl_ticketfeedback_ibfk_1` FOREIGN KEY (`TicketId`) REFERENCES `tbl_tickets` (`TicketId`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_ticketfeedback`
--

LOCK TABLES `tbl_ticketfeedback` WRITE;
/*!40000 ALTER TABLE `tbl_ticketfeedback` DISABLE KEYS */;
INSERT INTO `tbl_ticketfeedback` VALUES (1,'TICKET-260427-795732',NULL,'GAD','OC','Jerald Tulibao','jeraldtulibao@gmail.com','9852303857','JERALD TULBIAO','hardware','phone,email','','2026-04-27','2026-04-27','SDASD',5,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_767b302c-8b06-4c66-b098-ded983b7f3f0.png','2026-04-27 13:15:51'),(2,'TICKET-260430-945473',NULL,'UPMINDANAO','OC','Jerald Tulibao','jeraldtulibao@gmail.com','','JERALD TULBIAO','hardware, network','phone,chat,onsite','','2026-05-08','2026-05-08','DSADSADSA',5,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_122a0bfb-b67e-4b4b-b355-fd2defed2f46.png','2026-05-08 14:56:56'),(3,'TICKET-260430-921941',NULL,'','OC','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','hardware, network','onsite','','2026-04-30','2026-05-04','NONE',5,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_0bf486a4-ca3d-4e5d-b42d-df8db5d52aac.png','2026-06-25 06:47:15'),(4,'TICKET-260430-157995',NULL,'ds','OC','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','software','chat','','2026-04-30','2026-05-04','dsad',3,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_96e766f6-88b0-4046-a099-cf9c52cfb8fb.png','2026-07-02 15:20:57'),(5,'TICKET-260504-636449',NULL,'UPMIN','OC','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','hardware','chat','','2026-05-04','2026-05-08','SDASD',3,'Excellent','','','','','/Assets/E-sig/signature_cebbdf6c-5ce0-4aee-b054-66c3d8f3c05a.png','2026-07-02 15:24:40'),(6,'TICKET-260504-458871',NULL,'SDAD','OC','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','network, account','chat','','2026-05-04','2026-05-08','DSDAD',4,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_5eda5d29-cf4d-41bd-8fd9-9be2a8d08a3e.png','2026-07-02 15:25:19'),(7,'TICKET-260504-565239',NULL,'FDSF','PPO','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','software','email,chat','','2026-05-04','2026-05-08','FDSF',4,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_731e1dd9-c6c4-49f8-8e28-46d974ca6983.png','2026-07-02 15:33:23'),(8,'TICKET-260504-302345',NULL,'SADASD','GAD','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','network','email','','2026-05-04','2026-05-08','SDA',4,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_37b8c2ce-7542-4df9-a1d9-884aadc75b12.png','2026-07-03 03:06:14'),(9,'TICKET-260506-636036',NULL,'DSAD','GAD','Jerald Tulibao','jeraldtulibao@gmail.com','9852303857','jeraldtulibao783@gmail.com','hardware, software','chat,onsite','','2026-05-06','2026-05-08','DSADSAD',3,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_fd124857-c136-445e-ac13-dcbda12b5278.png','2026-07-03 03:06:43'),(10,'TICKET-260611-381069',NULL,'DSAD','OC','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','network','chat','','2026-06-11','2026-06-21','DSAD',3,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_67783735-224a-4556-8a3f-0c29e4c6bb22.png','2026-07-03 03:07:06'),(11,'TICKET-260508-694196',NULL,'DSAD','GAD','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','software','email','','2026-05-08','2026-06-18','DSADSAD',4,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_28f915a5-852d-4695-b3e6-6a2809d112d4.png','2026-07-03 03:07:33'),(12,'TICKET-260620-317900',NULL,'sdsa','GAD','Jerald Tulibao','jeraldtulibao@gmail.com','9852303857','jeraldtulibao783@gmail.com','software','chat','','2026-06-20','2026-07-18','',4,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_8e5b89e6-ba7e-4811-b90c-a3579f7a6381.png','2026-07-20 13:34:33'),(13,'TICKET-260621-882635',NULL,'UPMINDANAO','OC','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','hardware, software, network','email,chat,onsite','','2026-06-21','2026-07-20','',3,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_37472530-3597-464d-8970-2f8e16b2349a.png','2026-07-20 13:37:18'),(14,'TICKET-260703-112688',NULL,'UPMIN','OC','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','software, network','email,chat','','2026-07-03','2026-07-20','SDFDSFDSFDSFDFSFSDFDSF',4,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_5e57c947-9a39-405f-9465-361bf261f63b.png','2026-07-20 13:38:59');
/*!40000 ALTER TABLE `tbl_ticketfeedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_ticketmessages`
--

DROP TABLE IF EXISTS `tbl_ticketmessages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_ticketmessages` (
  `MessageId` int NOT NULL AUTO_INCREMENT,
  `TicketId` int NOT NULL,
  `SenderEmail` varchar(255) NOT NULL,
  `Message` text NOT NULL,
  `Timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `UserId` int DEFAULT NULL,
  `FileName` varchar(255) DEFAULT NULL,
  `FilePath` varchar(500) DEFAULT NULL,
  `FileType` varchar(100) DEFAULT NULL,
  `FileSize` bigint DEFAULT NULL,
  PRIMARY KEY (`MessageId`),
  KEY `idx_messages_ticketid` (`TicketId`),
  KEY `idx_messages_userid` (`UserId`),
  CONSTRAINT `tbl_ticketmessages_ibfk_1` FOREIGN KEY (`TicketId`) REFERENCES `tbl_tickets` (`TicketId`),
  CONSTRAINT `tbl_ticketmessages_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `tbl_users` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_ticketmessages`
--

LOCK TABLES `tbl_ticketmessages` WRITE;
/*!40000 ALTER TABLE `tbl_ticketmessages` DISABLE KEYS */;
INSERT INTO `tbl_ticketmessages` VALUES (1,11,'jeraldtulibao@gmail.com','Hello! update to this ticket','2026-05-10 22:20:45',NULL,NULL,NULL,NULL,NULL),(2,11,'jeraldtulibao783@gmail.com','OKay','2026-06-03 10:35:49',NULL,NULL,NULL,NULL,NULL),(3,11,'jeraldtulibao@gmail.com','okay','2026-06-03 10:36:02',NULL,NULL,NULL,NULL,NULL),(4,11,'jeraldtulibao@gmail.com','yes','2026-06-03 10:36:34',NULL,NULL,NULL,NULL,NULL),(5,11,'jeraldtulibao@gmail.com','Need update on this!','2026-06-11 15:43:01',NULL,NULL,NULL,NULL,NULL),(6,12,'jeraldtulibao@gmail.com','Need update','2026-06-11 15:43:34',NULL,NULL,NULL,NULL,NULL),(7,12,'jeraldtulibao@gmail.com','ASAP','2026-06-11 15:43:46',NULL,NULL,NULL,NULL,NULL),(8,12,'jeraldtulibao783@gmail.com','okay','2026-06-11 15:44:31',NULL,NULL,NULL,NULL,NULL),(9,12,'jeraldtulibao@gmail.com','ok','2026-06-11 15:46:25',NULL,NULL,NULL,NULL,NULL),(10,11,'jeraldtulibao@gmail.com','sdsdasdas','2026-06-11 16:03:05',NULL,NULL,NULL,NULL,NULL),(11,11,'jeraldtulibao@gmail.com','dsadsa','2026-06-11 16:03:11',NULL,NULL,NULL,NULL,NULL),(12,12,'jeraldtulibao783@gmail.com','dsad','2026-06-11 16:12:40',NULL,NULL,NULL,NULL,NULL),(13,12,'jeraldtulibao783@gmail.com','dsad','2026-06-11 16:13:14',NULL,NULL,NULL,NULL,NULL),(14,12,'jeraldtulibao@gmail.com','dsadsad','2026-06-11 16:15:51',NULL,NULL,NULL,NULL,NULL),(15,12,'jeraldtulibao783@gmail.com','dsad','2026-06-11 16:16:04',NULL,NULL,NULL,NULL,NULL),(16,12,'jeraldtulibao783@gmail.com','sds','2026-06-11 16:20:28',NULL,NULL,NULL,NULL,NULL),(17,12,'jeraldtulibao@gmail.com','sdsd','2026-06-11 16:20:57',NULL,NULL,NULL,NULL,NULL),(21,14,'jeraldtulibao783@gmail.com','okay','2026-06-21 21:47:50',NULL,NULL,NULL,NULL,NULL),(22,14,'jeraldtulibao@gmail.com','okay pud','2026-06-21 21:48:58',NULL,NULL,NULL,NULL,NULL),(23,14,'jeraldtulibao@gmail.com','Follow up to this ticket','2026-06-21 23:21:42',NULL,NULL,NULL,NULL,NULL),(24,14,'jeraldtulibao783@gmail.com','ok','2026-06-21 23:22:08',NULL,NULL,NULL,NULL,NULL),(25,14,'jeraldtulibao783@gmail.com','k','2026-06-21 23:22:25',NULL,NULL,NULL,NULL,NULL),(26,14,'jeraldtulibao@gmail.com','?‍?️','2026-06-21 23:22:55',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `tbl_ticketmessages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_ticketnotifications`
--

DROP TABLE IF EXISTS `tbl_ticketnotifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_ticketnotifications` (
  `NotificationId` int NOT NULL AUTO_INCREMENT,
  `TicketId` int NOT NULL,
  `RecipientEmail` varchar(255) NOT NULL,
  `SenderEmail` varchar(255) NOT NULL,
  `Message` text,
  `Timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `IsRead` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`NotificationId`),
  KEY `TicketId` (`TicketId`),
  CONSTRAINT `tbl_ticketnotifications_ibfk_1` FOREIGN KEY (`TicketId`) REFERENCES `tbl_tickets` (`TicketId`)
) ENGINE=InnoDB AUTO_INCREMENT=194 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_ticketnotifications`
--

LOCK TABLES `tbl_ticketnotifications` WRITE;
/*!40000 ALTER TABLE `tbl_ticketnotifications` DISABLE KEYS */;
INSERT INTO `tbl_ticketnotifications` VALUES (1,11,'dmtalapian@up.edu.ph','jeraldtulibao@gmail.com','Hello! update to this ticket','2026-05-10 22:20:45',0),(2,11,'fracebedo@up.edu.ph','jeraldtulibao@gmail.com','Hello! update to this ticket','2026-05-10 22:20:45',0),(3,11,'jeraldtulibao783@gmail.com','jeraldtulibao@gmail.com','Hello! update to this ticket','2026-05-10 22:20:45',1),(4,11,'jntulibao@up.edu.ph','jeraldtulibao@gmail.com','Hello! update to this ticket','2026-05-10 22:20:45',0),(5,11,'dmtalapian@up.edu.ph','jeraldtulibao783@gmail.com','OKay','2026-06-03 10:35:49',0),(6,11,'jeraldtulibao@gmail.com','jeraldtulibao783@gmail.com','OKay','2026-06-03 10:35:49',1),(7,11,'jntulibao@up.edu.ph','jeraldtulibao783@gmail.com','OKay','2026-06-03 10:35:49',0),(8,11,'dmtalapian@up.edu.ph','jeraldtulibao@gmail.com','okay','2026-06-03 10:36:02',0),(9,11,'jeraldtulibao783@gmail.com','jeraldtulibao@gmail.com','okay','2026-06-03 10:36:02',1),(10,11,'jntulibao@up.edu.ph','jeraldtulibao@gmail.com','okay','2026-06-03 10:36:02',0),(11,11,'dmtalapian@up.edu.ph','jeraldtulibao@gmail.com','yes','2026-06-03 10:36:34',0),(12,11,'jeraldtulibao783@gmail.com','jeraldtulibao@gmail.com','yes','2026-06-03 10:36:34',1),(13,11,'jntulibao@up.edu.ph','jeraldtulibao@gmail.com','yes','2026-06-03 10:36:34',0),(14,11,'dmtalapian@up.edu.ph','jeraldtulibao@gmail.com','Need update on this!','2026-06-11 15:43:01',0),(15,11,'jeraldtulibao783@gmail.com','jeraldtulibao@gmail.com','Need update on this!','2026-06-11 15:43:01',1),(16,11,'jntulibao@up.edu.ph','jeraldtulibao@gmail.com','Need update on this!','2026-06-11 15:43:01',0),(17,11,'webinar.upmindanao@up.edu.ph','jeraldtulibao@gmail.com','Need update on this!','2026-06-11 15:43:01',0),(21,12,'dmtalapian@up.edu.ph','jeraldtulibao@gmail.com','Need update','2026-06-11 15:43:34',0),(22,12,'jeraldtulibao783@gmail.com','jeraldtulibao@gmail.com','Need update','2026-06-11 15:43:34',1),(23,12,'jntulibao@up.edu.ph','jeraldtulibao@gmail.com','Need update','2026-06-11 15:43:34',0),(24,12,'webinar.upmindanao@up.edu.ph','jeraldtulibao@gmail.com','Need update','2026-06-11 15:43:34',0),(28,12,'dmtalapian@up.edu.ph','jeraldtulibao@gmail.com','ASAP','2026-06-11 15:43:46',0),(29,12,'jeraldtulibao783@gmail.com','jeraldtulibao@gmail.com','ASAP','2026-06-11 15:43:46',1),(30,12,'jntulibao@up.edu.ph','jeraldtulibao@gmail.com','ASAP','2026-06-11 15:43:46',0),(31,12,'webinar.upmindanao@up.edu.ph','jeraldtulibao@gmail.com','ASAP','2026-06-11 15:43:46',0),(35,12,'dmtalapian@up.edu.ph','jeraldtulibao783@gmail.com','okay','2026-06-11 15:44:31',0),(36,12,'jeraldtulibao@gmail.com','jeraldtulibao783@gmail.com','okay','2026-06-11 15:44:31',1),(37,12,'jntulibao@up.edu.ph','jeraldtulibao783@gmail.com','okay','2026-06-11 15:44:31',0),(38,12,'webinar.upmindanao@up.edu.ph','jeraldtulibao783@gmail.com','okay','2026-06-11 15:44:31',0),(42,12,'dmtalapian@up.edu.ph','jeraldtulibao@gmail.com','ok','2026-06-11 15:46:25',0),(43,12,'jeraldtulibao783@gmail.com','jeraldtulibao@gmail.com','ok','2026-06-11 15:46:25',1),(44,12,'jntulibao@up.edu.ph','jeraldtulibao@gmail.com','ok','2026-06-11 15:46:25',0),(45,12,'webinar.upmindanao@up.edu.ph','jeraldtulibao@gmail.com','ok','2026-06-11 15:46:25',0),(49,11,'dmtalapian@up.edu.ph','jeraldtulibao@gmail.com','sdsdasdas','2026-06-11 16:03:05',0),(50,11,'jeraldtulibao783@gmail.com','jeraldtulibao@gmail.com','sdsdasdas','2026-06-11 16:03:05',1),(51,11,'jntulibao@up.edu.ph','jeraldtulibao@gmail.com','sdsdasdas','2026-06-11 16:03:05',0),(52,11,'webinar.upmindanao@up.edu.ph','jeraldtulibao@gmail.com','sdsdasdas','2026-06-11 16:03:05',0),(56,11,'dmtalapian@up.edu.ph','jeraldtulibao@gmail.com','dsadsa','2026-06-11 16:03:11',0),(57,11,'jeraldtulibao783@gmail.com','jeraldtulibao@gmail.com','dsadsa','2026-06-11 16:03:11',1),(58,11,'jntulibao@up.edu.ph','jeraldtulibao@gmail.com','dsadsa','2026-06-11 16:03:11',0),(59,11,'webinar.upmindanao@up.edu.ph','jeraldtulibao@gmail.com','dsadsa','2026-06-11 16:03:11',0),(63,12,'dmtalapian@up.edu.ph','jeraldtulibao783@gmail.com','dsad','2026-06-11 16:12:40',0),(64,12,'jeraldtulibao@gmail.com','jeraldtulibao783@gmail.com','dsad','2026-06-11 16:12:40',1),(65,12,'jntulibao@up.edu.ph','jeraldtulibao783@gmail.com','dsad','2026-06-11 16:12:40',0),(66,12,'webinar.upmindanao@up.edu.ph','jeraldtulibao783@gmail.com','dsad','2026-06-11 16:12:40',0),(70,12,'dmtalapian@up.edu.ph','jeraldtulibao783@gmail.com','dsad','2026-06-11 16:13:14',0),(71,12,'jeraldtulibao@gmail.com','jeraldtulibao783@gmail.com','dsad','2026-06-11 16:13:14',1),(72,12,'jntulibao@up.edu.ph','jeraldtulibao783@gmail.com','dsad','2026-06-11 16:13:14',0),(73,12,'webinar.upmindanao@up.edu.ph','jeraldtulibao783@gmail.com','dsad','2026-06-11 16:13:14',0),(77,12,'dmtalapian@up.edu.ph','jeraldtulibao@gmail.com','dsadsad','2026-06-11 16:15:51',0),(78,12,'jeraldtulibao783@gmail.com','jeraldtulibao@gmail.com','dsadsad','2026-06-11 16:15:51',1),(79,12,'jntulibao@up.edu.ph','jeraldtulibao@gmail.com','dsadsad','2026-06-11 16:15:51',0),(80,12,'webinar.upmindanao@up.edu.ph','jeraldtulibao@gmail.com','dsadsad','2026-06-11 16:15:51',0),(84,12,'dmtalapian@up.edu.ph','jeraldtulibao783@gmail.com','dsad','2026-06-11 16:16:04',0),(85,12,'jeraldtulibao@gmail.com','jeraldtulibao783@gmail.com','dsad','2026-06-11 16:16:04',1),(86,12,'jntulibao@up.edu.ph','jeraldtulibao783@gmail.com','dsad','2026-06-11 16:16:04',0),(87,12,'webinar.upmindanao@up.edu.ph','jeraldtulibao783@gmail.com','dsad','2026-06-11 16:16:04',0),(91,12,'dmtalapian@up.edu.ph','jeraldtulibao783@gmail.com','sds','2026-06-11 16:20:28',0),(92,12,'jeraldtulibao@gmail.com','jeraldtulibao783@gmail.com','sds','2026-06-11 16:20:28',1),(93,12,'jntulibao@up.edu.ph','jeraldtulibao783@gmail.com','sds','2026-06-11 16:20:28',0),(94,12,'webinar.upmindanao@up.edu.ph','jeraldtulibao783@gmail.com','sds','2026-06-11 16:20:28',0),(98,12,'dmtalapian@up.edu.ph','jeraldtulibao@gmail.com','sdsd','2026-06-11 16:20:57',0),(99,12,'jeraldtulibao783@gmail.com','jeraldtulibao@gmail.com','sdsd','2026-06-11 16:20:57',1),(100,12,'jntulibao@up.edu.ph','jeraldtulibao@gmail.com','sdsd','2026-06-11 16:20:57',0),(101,12,'webinar.upmindanao@up.edu.ph','jeraldtulibao@gmail.com','sdsd','2026-06-11 16:20:57',0),(102,13,'dmtalapian@up.edu.ph','jeraldtulibao783@gmail.com','Please sent the screenshot of the error','2026-06-21 00:26:09',0),(103,13,'jeraldtulibao@gmail.com','jeraldtulibao783@gmail.com','Please sent the screenshot of the error','2026-06-21 00:26:09',1),(104,13,'jntulibao@up.edu.ph','jeraldtulibao783@gmail.com','Please sent the screenshot of the error','2026-06-21 00:26:09',0),(105,13,'webinar.upmindanao@up.edu.ph','jeraldtulibao783@gmail.com','Please sent the screenshot of the error','2026-06-21 00:26:09',0),(109,13,'dmtalapian@up.edu.ph','jeraldtulibao@gmail.com','Okay','2026-06-21 00:26:45',0),(110,13,'jeraldtulibao783@gmail.com','jeraldtulibao@gmail.com','Okay','2026-06-21 00:26:45',1),(111,13,'jntulibao@up.edu.ph','jeraldtulibao@gmail.com','Okay','2026-06-21 00:26:45',0),(112,13,'webinar.upmindanao@up.edu.ph','jeraldtulibao@gmail.com','Okay','2026-06-21 00:26:45',0),(116,13,'dmtalapian@up.edu.ph','jeraldtulibao783@gmail.com','Thanks','2026-06-21 00:27:24',0),(117,13,'jeraldtulibao@gmail.com','jeraldtulibao783@gmail.com','Thanks','2026-06-21 00:27:24',1),(118,13,'jntulibao@up.edu.ph','jeraldtulibao783@gmail.com','Thanks','2026-06-21 00:27:24',0),(119,13,'webinar.upmindanao@up.edu.ph','jeraldtulibao783@gmail.com','Thanks','2026-06-21 00:27:24',0),(120,14,'dmtalapian@up.edu.ph','jeraldtulibao783@gmail.com','okay','2026-06-21 21:47:50',0),(121,14,'jeraldtulibao@gmail.com','jeraldtulibao783@gmail.com','okay','2026-06-21 21:47:50',1),(122,14,'jntulibao@up.edu.ph','jeraldtulibao783@gmail.com','okay','2026-06-21 21:47:50',0),(123,14,'webinar.upmindanao@up.edu.ph','jeraldtulibao783@gmail.com','okay','2026-06-21 21:47:50',0),(127,14,'dmtalapian@up.edu.ph','jeraldtulibao@gmail.com','okay pud','2026-06-21 21:48:59',0),(128,14,'jeraldtulibao783@gmail.com','jeraldtulibao@gmail.com','okay pud','2026-06-21 21:48:59',1),(129,14,'jntulibao@up.edu.ph','jeraldtulibao@gmail.com','okay pud','2026-06-21 21:48:59',0),(130,14,'webinar.upmindanao@up.edu.ph','jeraldtulibao@gmail.com','okay pud','2026-06-21 21:48:59',0),(134,14,'dmtalapian@up.edu.ph','jeraldtulibao@gmail.com','Follow up to this ticket','2026-06-21 23:21:42',0),(135,14,'jeraldtulibao783@gmail.com','jeraldtulibao@gmail.com','Follow up to this ticket','2026-06-21 23:21:42',1),(136,14,'jntulibao@up.edu.ph','jeraldtulibao@gmail.com','Follow up to this ticket','2026-06-21 23:21:42',0),(137,14,'webinar.upmindanao@up.edu.ph','jeraldtulibao@gmail.com','Follow up to this ticket','2026-06-21 23:21:42',0),(141,14,'dmtalapian@up.edu.ph','jeraldtulibao783@gmail.com','ok','2026-06-21 23:22:08',0),(142,14,'jeraldtulibao@gmail.com','jeraldtulibao783@gmail.com','ok','2026-06-21 23:22:08',1),(143,14,'jntulibao@up.edu.ph','jeraldtulibao783@gmail.com','ok','2026-06-21 23:22:08',0),(144,14,'webinar.upmindanao@up.edu.ph','jeraldtulibao783@gmail.com','ok','2026-06-21 23:22:08',0),(148,14,'dmtalapian@up.edu.ph','jeraldtulibao783@gmail.com','k','2026-06-21 23:22:25',0),(149,14,'jeraldtulibao@gmail.com','jeraldtulibao783@gmail.com','k','2026-06-21 23:22:25',1),(150,14,'jntulibao@up.edu.ph','jeraldtulibao783@gmail.com','k','2026-06-21 23:22:25',0),(151,14,'webinar.upmindanao@up.edu.ph','jeraldtulibao783@gmail.com','k','2026-06-21 23:22:25',0),(155,14,'dmtalapian@up.edu.ph','jeraldtulibao@gmail.com','?‍?️','2026-06-21 23:22:55',0),(156,14,'jeraldtulibao783@gmail.com','jeraldtulibao@gmail.com','?‍?️','2026-06-21 23:22:55',1),(157,14,'jntulibao@up.edu.ph','jeraldtulibao@gmail.com','?‍?️','2026-06-21 23:22:55',0),(158,14,'webinar.upmindanao@up.edu.ph','jeraldtulibao@gmail.com','?‍?️','2026-06-21 23:22:55',0),(159,17,'dmtalapian@up.edu.ph','jeraldtulibao@gmail.com','213213','2026-07-03 12:38:10',0),(160,17,'jeraldtulibao783@gmail.com','jeraldtulibao@gmail.com','213213','2026-07-03 12:38:10',1),(161,17,'jntulibao@up.edu.ph','jeraldtulibao@gmail.com','213213','2026-07-03 12:38:10',0),(162,17,'jntulibao1@up.edu.ph','jeraldtulibao@gmail.com','213213','2026-07-03 12:38:10',0),(163,17,'jntulibao2@up.edu.ph','jeraldtulibao@gmail.com','213213','2026-07-03 12:38:10',0),(164,17,'jntulibao3@up.edu.ph','jeraldtulibao@gmail.com','213213','2026-07-03 12:38:10',0),(165,17,'webinar.upmindanao@up.edu.ph','jeraldtulibao@gmail.com','213213','2026-07-03 12:38:10',0),(166,17,'dmtalapian@up.edu.ph','jeraldtulibao783@gmail.com','dsad','2026-07-03 23:36:27',0),(167,17,'jeraldtulibao@gmail.com','jeraldtulibao783@gmail.com','dsad','2026-07-03 23:36:27',1),(168,17,'jntulibao@up.edu.ph','jeraldtulibao783@gmail.com','dsad','2026-07-03 23:36:27',0),(169,17,'jntulibao1@up.edu.ph','jeraldtulibao783@gmail.com','dsad','2026-07-03 23:36:27',0),(170,17,'jntulibao2@up.edu.ph','jeraldtulibao783@gmail.com','dsad','2026-07-03 23:36:27',0),(171,17,'jntulibao3@up.edu.ph','jeraldtulibao783@gmail.com','dsad','2026-07-03 23:36:27',0),(172,17,'webinar.upmindanao@up.edu.ph','jeraldtulibao783@gmail.com','dsad','2026-07-03 23:36:27',0),(173,17,'dmtalapian@up.edu.ph','jeraldtulibao@gmail.com','hey','2026-07-07 22:17:44',0),(174,17,'jeraldtulibao783@gmail.com','jeraldtulibao@gmail.com','hey','2026-07-07 22:17:44',1),(175,17,'jntulibao@up.edu.ph','jeraldtulibao@gmail.com','hey','2026-07-07 22:17:44',0),(176,17,'jntulibao1@up.edu.ph','jeraldtulibao@gmail.com','hey','2026-07-07 22:17:44',0),(177,17,'jntulibao2@up.edu.ph','jeraldtulibao@gmail.com','hey','2026-07-07 22:17:44',0),(178,17,'jntulibao3@up.edu.ph','jeraldtulibao@gmail.com','hey','2026-07-07 22:17:44',0),(179,17,'webinar.upmindanao@up.edu.ph','jeraldtulibao@gmail.com','hey','2026-07-07 22:17:44',0),(180,17,'dmtalapian@up.edu.ph','jeraldtulibao783@gmail.com','huy','2026-07-07 22:17:51',0),(181,17,'jeraldtulibao@gmail.com','jeraldtulibao783@gmail.com','huy','2026-07-07 22:17:51',1),(182,17,'jntulibao@up.edu.ph','jeraldtulibao783@gmail.com','huy','2026-07-07 22:17:51',0),(183,17,'jntulibao1@up.edu.ph','jeraldtulibao783@gmail.com','huy','2026-07-07 22:17:51',0),(184,17,'jntulibao2@up.edu.ph','jeraldtulibao783@gmail.com','huy','2026-07-07 22:17:51',0),(185,17,'jntulibao3@up.edu.ph','jeraldtulibao783@gmail.com','huy','2026-07-07 22:17:51',0),(186,17,'webinar.upmindanao@up.edu.ph','jeraldtulibao783@gmail.com','huy','2026-07-07 22:17:51',0),(187,17,'dmtalapian@up.edu.ph','jeraldtulibao@gmail.com','okay','2026-07-07 22:17:56',0),(188,17,'jeraldtulibao783@gmail.com','jeraldtulibao@gmail.com','okay','2026-07-07 22:17:56',1),(189,17,'jntulibao@up.edu.ph','jeraldtulibao@gmail.com','okay','2026-07-07 22:17:56',0),(190,17,'jntulibao1@up.edu.ph','jeraldtulibao@gmail.com','okay','2026-07-07 22:17:56',0),(191,17,'jntulibao2@up.edu.ph','jeraldtulibao@gmail.com','okay','2026-07-07 22:17:56',0),(192,17,'jntulibao3@up.edu.ph','jeraldtulibao@gmail.com','okay','2026-07-07 22:17:56',0),(193,17,'webinar.upmindanao@up.edu.ph','jeraldtulibao@gmail.com','okay','2026-07-07 22:17:56',0);
/*!40000 ALTER TABLE `tbl_ticketnotifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_tickets`
--

DROP TABLE IF EXISTS `tbl_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_tickets` (
  `TicketId` int NOT NULL AUTO_INCREMENT,
  `TicketNumber` varchar(255) DEFAULT NULL,
  `PropNo` varchar(255) DEFAULT NULL,
  `FullName` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `RequestDate` datetime DEFAULT NULL,
  `HelpTopic` varchar(100) DEFAULT NULL,
  `IssueDesc` varchar(200) DEFAULT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `PriorityLevel` varchar(50) DEFAULT NULL,
  `CurrentStatus` varchar(100) DEFAULT NULL,
  `LastUpdated` datetime DEFAULT NULL,
  `DueDate` datetime DEFAULT NULL,
  `Overdue` tinyint(1) DEFAULT NULL,
  `AgentAssigned` varchar(255) DEFAULT NULL,
  `ReopenCount` int DEFAULT '0',
  `UserId` int DEFAULT NULL,
  `FileName` varchar(255) DEFAULT NULL,
  `FileContentType` varchar(50) DEFAULT NULL,
  `ExtraFields` json DEFAULT NULL,
  PRIMARY KEY (`TicketId`),
  KEY `idx_tickets_userid` (`UserId`),
  CONSTRAINT `tbl_tickets_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `tbl_users` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_tickets`
--

LOCK TABLES `tbl_tickets` WRITE;
/*!40000 ALTER TABLE `tbl_tickets` DISABLE KEYS */;
INSERT INTO `tbl_tickets` VALUES (2,'TICKET-260427-193069','N/A','Darlene Talapian','dmtalapian@up.edu.ph','2025-04-30 09:16:09','Information System','SADASDASDSADSASADSADSA','OC','Medium','Resolved','2026-04-30 09:16:09','2026-04-30 09:16:09',0,'jeraldtulibao783@gmail.com',0,NULL,'','','{}'),(3,'TICKET-260430-945473','N/A','Jerald Tulibao','jeraldtulibao@gmail.com','2026-04-30 09:16:09','Information System','SDADSDSADSAD','GAD','Medium','Resolved','2026-04-30 09:16:36','2026-04-30 09:16:09',1,'jeraldtulibao783@gmail.com',0,NULL,'','','{}'),(4,'TICKET-260430-921941','N/A','Jerald Tulibao','jeraldtulibao@gmail.com','2026-04-30 16:01:00','Information System','DSADSADDSADSAD','OC','Medium','Resolved','2026-05-04 16:50:51','2026-05-02 16:01:00',1,'jeraldtulibao783@gmail.com',0,NULL,'','','{}'),(5,'TICKET-260430-157995','N/A','Jerald Tulibao','jeraldtulibao@gmail.com','2026-04-30 16:03:33','Information System','SADSADDSDSDSAD','OC','High','Resolved','2026-05-04 16:50:50','2026-05-01 16:03:33',1,'jeraldtulibao783@gmail.com',0,NULL,'','','{}'),(6,'TICKET-260504-636449','N/A','Jerald Tulibao','jeraldtulibao@gmail.com','2026-05-04 16:50:22','Technical Support','1233432432','OC','High','Resolved','2026-05-08 22:36:07','2026-05-05 16:50:22',1,'jeraldtulibao783@gmail.com',1,NULL,'','','{}'),(7,'TICKET-260504-458871','n/a','Jerald Tulibao','jeraldtulibao@gmail.com','2026-05-04 16:51:33','Technical Support','sadsadsadsadsad','OC','Medium','Resolved','2026-05-08 22:36:07','2026-05-06 16:51:33',1,'jeraldtulibao783@gmail.com',3,NULL,'','','{}'),(8,'TICKET-260504-565239','N/A','Jerald Tulibao','jeraldtulibao@gmail.com','2026-05-04 16:51:59','PPO Technical Supprot','DSADSADDSADSAD','PPO','High','Resolved','2026-05-08 22:36:06','2026-05-05 16:51:59',1,'jeraldtulibao783@gmail.com',8,NULL,'','','{}'),(9,'TICKET-260504-302345','n/a','Jerald Tulibao','jeraldtulibao@gmail.com','2026-05-04 16:52:35','PPO Technical Supprot','sadsadsadasdsadsad','GAD','Low','Resolved','2026-05-08 22:36:06','2026-05-07 16:52:35',1,'jeraldtulibao783@gmail.com',1,NULL,'','','{}'),(10,'TICKET-260506-636036','N/A','Jerald Tulibao','jeraldtulibao@gmail.com','2026-05-06 22:03:10','Technical Support','SADASDASDASDSADSADASSADAS','GAD','High','Resolved','2026-05-08 22:36:05','2026-05-07 22:03:10',1,'jeraldtulibao783@gmail.com',1,NULL,'b35437d4-a9dd-4466-a212-86999c0594f5_Screenshot 2026-04-07 145654.png','image/png','{}'),(11,'TICKET-260508-694196','NA','Jerald Tulibao','jeraldtulibao@gmail.com','2026-05-08 22:37:47','Information System','SDADSADDSADSADSA','GAD','High','Resolved','2026-06-18 21:33:26','2026-05-09 22:37:47',1,'jeraldtulibao783@gmail.com',2,NULL,'','','{}'),(12,'TICKET-260611-381069','N/A','Jerald Tulibao','jeraldtulibao@gmail.com','2026-06-11 15:29:27','Printing and Coppying','Printer Connection','OC','High','Resolved','2026-06-21 20:08:20','2026-06-12 15:29:27',1,'jeraldtulibao783@gmail.com',1,NULL,'','','{}'),(13,'TICKET-260620-317900','N/A','Jerald Tulibao','jeraldtulibao@gmail.com','2026-06-21 00:22:23','Hardware Issue','1234t5ddfff','GAD','High','Resolved','2026-07-18 12:53:02','2026-06-22 00:22:23',1,'jeraldtulibao783@gmail.com',2,NULL,'','','{}'),(14,'TICKET-260621-882635','N/A','Jerald Tulibao','jeraldtulibao@gmail.com','2026-06-21 12:14:42','Technical Support / Access Issue','Wifi unable to connect','OC','Medium','Resolved','2026-07-20 19:41:10','2026-06-23 12:14:42',1,'jeraldtulibao783@gmail.com',2,NULL,'','','{}'),(17,'TICKET-260703-112688','N/A','Jerald Tulibao','jeraldtulibao@gmail.com','2026-07-03 11:21:23','Information System','ASDSDSADSDSADSAD','OC','High','Resolved','2026-07-20 19:41:09','2026-07-04 11:21:23',1,'jeraldtulibao783@gmail.com',9,NULL,'2fcbd0e8-7fe9-4ac1-86f8-82441feac0a1_Screenshot 2026-07-03 105819.png','image/png','{}'),(19,'TICKET-260720-830436','N/A','Jerald Tulibao','jeraldtulibao@gmail.com','2026-07-20 21:35:09','PPO Technical Supprot','DSDSADSFDFDSFDFD','GAD','Low','Pending','2026-07-20 21:35:09','2026-07-27 21:35:09',0,'',0,NULL,'','','{}'),(20,'TICKET-260720-630381','N/A','Jerald Tulibao','jeraldtulibao@gmail.com','2026-07-20 21:38:16','Technical Support','ADDSFDSFDSFDSFDSF','GAD','High','Pending','2026-07-20 21:38:16','2026-07-21 21:38:16',1,'',0,NULL,'','','{}'),(21,'TICKET-260720-127288','N/A','Jerald Tulibao','jeraldtulibao@gmail.com','2026-07-20 21:39:50','Hardware Issue','SADSADASSSFDSFD','OC','Medium','Resolved','2026-07-22 20:09:33','2026-07-23 21:39:50',0,'jeraldtulibao783@gmail.com',0,NULL,'','','{}');
/*!40000 ALTER TABLE `tbl_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_users`
--

DROP TABLE IF EXISTS `tbl_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_users` (
  `UserId` int NOT NULL AUTO_INCREMENT,
  `FullName` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `RoleId` int DEFAULT '2',
  `FailedAttempts` int DEFAULT '0',
  `LockoutEnd` datetime DEFAULT NULL,
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `Email` (`Email`),
  KEY `idx_users_roleid` (`RoleId`),
  CONSTRAINT `tbl_users_ibfk_1` FOREIGN KEY (`RoleId`) REFERENCES `tbl_roles` (`RoleId`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_users`
--

LOCK TABLES `tbl_users` WRITE;
/*!40000 ALTER TABLE `tbl_users` DISABLE KEYS */;
INSERT INTO `tbl_users` VALUES (2,'DARLENE TALAPIAN','$2a$11$r6Ql7AUDfUwaZKQkvhUpiuyMn28bc8S4ZkU0FENWa3RCdVY1WqDJG','dmtalapian1@up.edu.ph',4,0,NULL),(3,'Jerald Tulibao','$2a$11$r6Ql7AUDfUwaZKQkvhUpiuyMn28bc8S4ZkU0FENWa3RCdVY1WqDJG','jeraldtulibao783@gmail.com',2,0,NULL),(4,'Jerald Tulibao','$2a$11$r6Ql7AUDfUwaZKQkvhUpiuyMn28bc8S4ZkU0FENWa3RCdVY1WqDJG','jeraldtulibao@gmail.com',3,0,NULL),(11,'JERALD N. TULIBAO','$2a$11$r6Ql7AUDfUwaZKQkvhUpiuyMn28bc8S4ZkU0FENWa3RCdVY1WqDJG','jntulibao1@up.edu.ph',1,0,NULL),(18,'Webinar','$2a$11$wLTtJOs9QWULT.2v7SrU4ebKYBAc/Uor3rIM168arjnlUwp.owSSK','webinar.upmindanao@up.edu.ph',4,0,NULL),(20,'Jerald Tulibao','$2a$11$nCB1eDIwMNF9zL8XGqNqbOd3z0Ud0LDepo5A5Q/qxqhGJIK8yHK4C','jntulibao3@up.edu.ph',3,0,NULL),(21,'Jerald Tulibao','$2a$11$kk/e/PLO5LRXVakjERcyCu1mzoEC4cgYovqQTcDVyL.C4QcSsfSu2','jntulibao4@up.edu.ph',1,0,NULL),(23,'Jerald Tulibao','$2a$11$vlEIHXoeKHz6Dqbp31RpLOTq8wTKWViGGI3KgG.HcTC8YIyRIyuHG','jntulibao@up.edu.ph',1,0,NULL),(24,'Darlene Talapian','$2a$11$mxSwUxhAdC4lsOLYkm.28Oyl92O9Fq89cNyGJwFhMxMWerpCmMj3S','dmtalapian@up.edu.ph',4,3,NULL);
/*!40000 ALTER TABLE `tbl_users` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_zoom_schedule`
--

LOCK TABLES `tbl_zoom_schedule` WRITE;
/*!40000 ALTER TABLE `tbl_zoom_schedule` DISABLE KEYS */;
INSERT INTO `tbl_zoom_schedule` VALUES (1,'2026-04-29 08:37:45','Counter-Archives of a Film Guerrera: A Retrospective of Sari Dalena’s Cinema','Meeting','Counter-Archives of a Film Guerrera: A Retrospective of Sari Dalena’s Cinema','2026-04-29','2026-04-29','2026-04-29','08:00:00','17:00:00','jntulibao@up.edu.ph','No','12345678','JERALD TULIBAO','jeraldtulibao@gmail.com','ITO','ASDASDA',NULL,NULL,NULL,NULL,'Pending'),(3,'2026-04-30 15:28:09','sds','Webinar','dsdsd','2025-02-02','2025-02-02','2025-02-02','03:27:00','15:27:00','jeraldtulibao@gmail.com',NULL,'sdsadsadsa','dsadsadsadsad','jeraldtulibao@gmail.com','ds','dsadsad',NULL,NULL,NULL,NULL,'Rejected'),(4,'2026-05-08 22:41:18','123','Webinar','DSADSA','2026-05-12','2026-05-12','2026-05-12','08:00:00','17:00:00','jeraldtulibao@gmail.com','Yes','12345678','jeraldtulibao','jeraldtulibao@gmail.com','OVCAA','none',NULL,NULL,NULL,NULL,'Rejected'),(5,'2026-05-08 22:44:59','dsad','Meeting','sdad','2026-05-08','2026-05-08','2026-05-08','22:44:00','10:44:00','jeraldtulibao@gmail.com','Yes','12345678','jeraldtulibao','jeraldtulibao@gmail.com','OVCAA','dasd',NULL,NULL,NULL,NULL,'Approved'),(6,'2026-05-08 22:46:39','sds','Webinar','dsadsad','2026-05-16','2026-05-16','2026-05-16','10:46:00','22:48:00','jeraldtulibao@gmail.com','Yes','12345678','JERALD TULIBAO','jeraldtulibao@gmail.com','OVCAA','fdsf',NULL,NULL,NULL,NULL,'Approved'),(7,'2026-06-21 16:54:13','Okay','Meeting','sdasdd','2026-06-21','2026-06-21','2026-06-21','16:53:00','16:53:00','jeraldtulibao@gmail.com','Yes','2323213232','Jerald Tulibao','jeraldtulibao@gmail.com','ito','dfdsf',NULL,NULL,NULL,NULL,'Pending'),(8,'2026-06-21 22:25:24','123','Meeting','2121','2026-06-21','2026-06-22','2026-06-21','22:24:00','22:24:00','misakaymoshi@gmail.com','Yes','123213213','Darlene Mainit Talapian','jeraldtulibao@gmail.com','ito','sdasdsadadadsad',NULL,NULL,'2e1679f9-a94d-48c6-a54b-a5247d59db25.pdf',NULL,'Pending'),(9,'2026-07-01 23:22:07','Counter-Archives of a Film Guerrera: A Retrospective of Sari Dalena’s Cinema','Meeting','dsad','2026-07-01','2026-07-02','2026-07-01','23:21:00','23:21:00','jntulibao@up.edu.ph','No','dsadasdsad','Jerald Tulibao','jeraldtulibao@gmail.com','ITO','dsadsadsa',NULL,NULL,'151c4bc6-9dfd-469d-9495-32c89551c9e7.pdf',NULL,'Pending'),(10,'2026-07-01 23:27:01','Counter-Archives of a Film Guerrera: A Retrospective of Sari Dalena’s Cinema','Meeting','dsadsa','2026-07-09','2026-07-08','2026-07-09','23:30:00','23:29:00','jntulibao@up.edu.ph','Yes','dsadsadsad','Jerald Tulibao','jeraldtulibao@gmail.com','ITO','dsadsa',NULL,NULL,'f355d63a-9f0c-4f7b-8b2d-527757b9bab6.pdf',NULL,'Pending'),(11,'2026-07-01 23:28:35','Counter-Archives of a Film Guerrera: A Retrospective of Sari Dalena’s Cinema','Webinar','dsad','2026-07-01','2026-07-01','2026-07-01','23:28:00','23:28:00','jntulibao@up.edu.ph','No','fgdgdfggfd','Jerald Tulibao','jeraldtulibao@gmail.com','g','gfd',NULL,NULL,NULL,NULL,'Pending'),(12,'2026-07-01 23:34:04','d','Webinar','dsad','2026-07-01','2026-07-01','2026-07-01','23:33:00','23:33:00','jntulibao@up.edu.ph','Yes','fgdfgfdgdf','Jerald Tulibao','jeraldtulibao@gmail.com','ITO','fdgfdg',NULL,NULL,NULL,NULL,'Pending'),(13,'2026-07-03 13:36:27','SDSADS','Meeting','SDASD','2026-07-03','2026-07-03','2026-07-03','13:36:00','13:36:00','jntulibao@up.edu.ph','Yes','23123WQWEW','Jerald Tulibao','jeraldtulibao@gmail.com','ITO','SDSADSADA',NULL,NULL,NULL,NULL,'Approved'),(14,'2026-07-03 22:57:21','Counter-Archives of a Film Guerrera: A Retrospective of Sari Dalena’s Cinema','Meeting','dsadsa','2026-07-03','2026-07-09','2026-07-03','22:56:00','22:56:00','jntulibao@up.edu.ph','Yes','dsadsaddsa','Jerald Tulibao','jeraldtulibao@gmail.com','ITO','dsadsadsad',NULL,NULL,NULL,NULL,'Pending');
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

-- Dump completed on 2026-07-23 19:31:48
