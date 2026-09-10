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
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_email_verification`
--

LOCK TABLES `tbl_email_verification` WRITE;
/*!40000 ALTER TABLE `tbl_email_verification` DISABLE KEYS */;
INSERT INTO `tbl_email_verification` VALUES (1,'webinar.upmindanao@up.edu.ph','164343','2026-05-20 13:41:44'),(2,'webinar.upmindanao@up.edu.ph','796313','2026-05-20 13:41:45'),(3,'webinar.upmindanao@up.edu.ph','994860','2026-05-20 13:50:15'),(4,'webinar.upmindanao@up.edu.ph','435747','2026-05-20 14:04:47'),(5,'webinar.upmindanao@up.edu.ph','651734','2026-05-20 14:06:07'),(6,'webinar.upmindanao@up.edu.ph','207916','2026-05-20 14:07:06'),(7,'webinar.upmindanao@up.edu.ph','216418','2026-05-20 14:12:29'),(8,'webinar.upmindanao@up.edu.ph','852642','2026-05-20 14:13:49'),(9,'webinar.upmindanao@up.edu.ph','874514','2026-05-20 14:24:28'),(10,'jntulibao@up.edu.ph','635862','2026-05-20 15:09:49'),(11,'webinar.upmindanao@up.edu.ph','743379','2026-05-20 15:11:21'),(12,'webinar.upmindanao@up.edu.ph','657758','2026-05-20 15:15:17'),(13,'webinar.upmindanao@up.edu.ph','242060','2026-05-20 15:21:53'),(14,'webinar.upmindanao@up.edu.ph','743905','2026-05-20 15:27:39'),(15,'webinar.upmindanao@up.edu.ph','113922','2026-05-20 15:40:16'),(16,'webinar.upmindanao@up.edu.ph','260875','2026-05-20 15:41:09'),(17,'webinar.upmindanao@up.edu.ph','276772','2026-05-20 15:42:32'),(18,'webinar.upmindanao@up.edu.ph','467365','2026-06-11 06:55:14'),(19,'jntulibao@up.edu.ph','626783','2026-07-02 10:50:15'),(20,'jntulibao@up.edu.ph','966105','2026-07-02 10:53:29'),(21,'jntulibao@up.edu.ph','448280','2026-07-02 10:57:16'),(22,'jntulibao@up.edu.ph','469558','2026-07-02 11:00:23'),(23,'jntulibao@up.edu.ph','503709','2026-07-02 11:02:58'),(24,'jntulibao@up.edu.ph','873506','2026-07-02 11:04:18'),(25,'jntulibao@up.edu.ph','485156','2026-07-02 11:04:52'),(26,'jntulibao@up.edu.ph','800994','2026-07-02 11:05:54'),(27,'jntulibao@up.edu.ph','393638','2026-07-02 11:08:15'),(28,'jntulibao@up.edu.ph','855895','2026-07-02 11:10:50'),(29,'jntulibao@up.edu.ph','905966','2026-07-02 11:12:25'),(30,'jntulibao@up.edu.ph','449035','2026-07-02 11:15:36'),(31,'jntulibao@up.edu.ph','494685','2026-07-02 11:16:22'),(32,'jntulibao@up.edu.ph','545003','2026-07-02 11:19:13'),(33,'jntulibao@up.edu.ph','851774','2026-07-02 11:20:51'),(34,'jntulibao@up.edu.ph','412929','2026-07-02 11:24:12'),(35,'jntulibao@up.edu.ph','344235','2026-07-02 13:52:50'),(36,'jntulibao@up.edu.ph','785837','2026-07-10 05:20:58'),(37,'jntulibao@up.edu.ph','875802','2026-07-10 05:35:42'),(38,'jntulibao@up.edu.ph','808403','2026-07-10 05:36:58'),(39,'dmtalapian@up.edu.ph','259754','2026-07-17 15:07:27'),(40,'jntulibao@up.edu.ph','561041','2026-07-24 14:13:03'),(41,'jntulibao@up.edu.ph','892075','2026-07-24 14:17:44'),(42,'jntulibao@up.edu.ph','598540','2026-07-24 14:20:40'),(43,'jntulibao@up.edu.ph','304777','2026-07-24 14:27:45'),(44,'jntulibao@up.edu.ph','490278','2026-07-24 14:32:02'),(45,'jntulibao@up.edu.ph','739279','2026-07-24 14:32:58'),(46,'jntulibao@up.edu.ph','447075','2026-07-24 14:35:32'),(47,'jntulibao@up.edu.ph','291052','2026-07-24 14:42:35'),(48,'jntulibao@up.edu.ph','627922','2026-07-24 14:42:50'),(49,'webinar.upmindanao@up.edu.ph','169180','2026-07-27 09:01:22'),(50,'webinar.upmindanao@up.edu.ph','989766','2026-07-27 09:10:56'),(51,'webinar.upmindanao@up.edu.ph','761786','2026-07-27 09:13:04'),(52,'webinar.upmindanao@up.edu.ph','279978','2026-07-27 09:16:26'),(53,'webinar.upmindanao@up.edu.ph','165579','2026-07-27 09:19:33'),(54,'webinar.upmindanao@up.edu.ph','504877','2026-07-27 09:20:02'),(55,'webinar.upmindanao@up.edu.ph','882580','2026-07-27 09:22:57'),(56,'webinar.upmindanao@up.edu.ph','541686','2026-07-27 09:25:48'),(57,'webinar.upmindanao@up.edu.ph','968987','2026-07-27 09:26:46'),(58,'webinar.upmindanao@up.edu.ph','126949','2026-07-27 09:27:36'),(59,'webinar.upmindanao@up.edu.ph','207911','2026-07-27 09:29:02'),(60,'webinar.upmindanao@up.edu.ph','195295','2026-07-27 09:31:25'),(61,'webinar.upmindanao@up.edu.ph','535908','2026-07-27 09:32:38'),(62,'webinar.upmindanao@up.edu.ph','797839','2026-07-27 09:33:14'),(63,'webinar.upmindanao@up.edu.ph','982543','2026-07-27 11:07:51'),(64,'webinar.upmindanao@up.edu.ph','995157','2026-07-27 11:46:58'),(65,'webinar.upmindanao@up.edu.ph','540854','2026-07-27 11:47:54'),(66,'webinar.upmindanao@up.edu.ph','949376','2026-07-27 11:49:15'),(67,'webinar.upmindanao@up.edu.ph','959892','2026-07-27 11:51:25'),(68,'webinar.upmindanao@up.edu.ph','610568','2026-07-27 14:12:27'),(69,'webinar.upmindanao@up.edu.ph','247862','2026-08-03 14:26:26'),(70,'webinar.upmindanao@up.edu.ph','566887','2026-08-03 14:35:29'),(71,'webinar.upmindanao@up.edu.ph','321596','2026-08-03 14:40:59'),(72,'webinar.upmindanao@up.edu.ph','763338','2026-08-03 14:52:39'),(73,'webinar.upmindanao@up.edu.ph','705321','2026-08-03 14:55:22'),(74,'webinar.upmindanao@up.edu.ph','255848','2026-08-03 15:04:43'),(75,'webinar.upmindanao@up.edu.ph','313684','2026-08-03 15:08:46'),(76,'webinar.upmindanao@up.edu.ph','717133','2026-08-21 06:08:57'),(77,'webinar.upmindanao@up.edu.ph','803361','2026-08-21 06:11:27'),(78,'webinar.upmindanao@up.edu.ph','211358','2026-08-21 06:16:28'),(79,'webinar.upmindanao@up.edu.ph','481305','2026-08-21 06:17:34'),(80,'webinar.upmindanao@up.edu.ph','585455','2026-08-21 06:23:09'),(81,'webinar.upmindanao@up.edu.ph','332315','2026-08-21 06:25:15'),(82,'webinar.upmindanao@up.edu.ph','702425','2026-08-21 06:25:54'),(83,'webinar.upmindanao@up.edu.ph','918129','2026-08-21 06:26:36'),(84,'webinar.upmindanao@up.edu.ph','396326','2026-08-21 06:29:45'),(85,'dmtalapian@up.edu.ph','965110','2026-08-22 08:13:17'),(86,'dmtalapian@up.edu.ph','791053','2026-08-22 08:14:27'),(87,'webinar.upmindanao@up.edu.ph','701221','2026-08-22 08:17:44');
/*!40000 ALTER TABLE `tbl_email_verification` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-10 16:09:37
