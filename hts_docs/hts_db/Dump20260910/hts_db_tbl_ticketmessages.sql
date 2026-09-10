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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_ticketmessages`
--

LOCK TABLES `tbl_ticketmessages` WRITE;
/*!40000 ALTER TABLE `tbl_ticketmessages` DISABLE KEYS */;
INSERT INTO `tbl_ticketmessages` VALUES (32,23,'jeraldtulibao783@gmail.com','dsfdsf','2026-07-28 21:30:44',NULL,NULL,NULL,NULL,NULL),(33,23,'jeraldtulibao@gmail.com','OKAY','2026-07-29 12:35:45',NULL,NULL,NULL,NULL,NULL),(34,23,'jeraldtulibao783@gmail.com','YES','2026-08-04 21:54:08',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `tbl_ticketmessages` ENABLE KEYS */;
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
