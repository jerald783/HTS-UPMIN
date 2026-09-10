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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_ticketfeedback`
--

LOCK TABLES `tbl_ticketfeedback` WRITE;
/*!40000 ALTER TABLE `tbl_ticketfeedback` DISABLE KEYS */;
INSERT INTO `tbl_ticketfeedback` VALUES (1,'TICKET-260427-795732',NULL,'GAD','OC','Jerald Tulibao','jeraldtulibao@gmail.com','9852303857','JERALD TULBIAO','hardware','phone,email','','2025-04-27','2025-04-27','SDASD',5,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_767b302c-8b06-4c66-b098-ded983b7f3f0.png','2026-04-27 13:15:51'),(2,'TICKET-260430-945473',NULL,'UPMINDANAO','OC','Jerald Tulibao','jeraldtulibao@gmail.com','','JERALD TULBIAO','hardware, network','phone,chat,onsite','','2026-05-08','2026-05-08','DSADSADSA',5,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_122a0bfb-b67e-4b4b-b355-fd2defed2f46.png','2026-05-08 14:56:56'),(3,'TICKET-260430-921941',NULL,'','OC','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','hardware, network','onsite','','2026-04-30','2026-05-04','NONE',5,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_0bf486a4-ca3d-4e5d-b42d-df8db5d52aac.png','2026-06-25 06:47:15'),(4,'TICKET-260430-157995',NULL,'ds','OC','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','software','chat','','2026-04-30','2026-05-04','dsad',3,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_96e766f6-88b0-4046-a099-cf9c52cfb8fb.png','2026-07-02 15:20:57'),(5,'TICKET-260504-636449',NULL,'UPMIN','OC','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','hardware','chat','','2026-05-04','2026-05-08','SDASD',3,'Excellent','','','','','/Assets/E-sig/signature_cebbdf6c-5ce0-4aee-b054-66c3d8f3c05a.png','2026-07-02 15:24:40'),(6,'TICKET-260504-458871',NULL,'SDAD','OC','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','network, account','chat','','2026-05-04','2026-05-08','DSDAD',4,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_5eda5d29-cf4d-41bd-8fd9-9be2a8d08a3e.png','2026-07-02 15:25:19'),(7,'TICKET-260504-565239',NULL,'FDSF','PPO','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','software','email,chat','','2026-05-04','2026-05-08','FDSF',4,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_731e1dd9-c6c4-49f8-8e28-46d974ca6983.png','2026-07-02 15:33:23'),(8,'TICKET-260504-302345',NULL,'SADASD','GAD','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','network','email','','2026-05-04','2026-05-08','SDA',4,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_37b8c2ce-7542-4df9-a1d9-884aadc75b12.png','2026-07-03 03:06:14'),(9,'TICKET-260506-636036',NULL,'DSAD','GAD','Jerald Tulibao','jeraldtulibao@gmail.com','9852303857','jeraldtulibao783@gmail.com','hardware, software','chat,onsite','','2026-05-06','2026-05-08','DSADSAD',3,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_fd124857-c136-445e-ac13-dcbda12b5278.png','2026-07-03 03:06:43'),(10,'TICKET-260611-381069',NULL,'DSAD','OC','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','network','chat','','2026-06-11','2026-06-21','DSAD',3,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_67783735-224a-4556-8a3f-0c29e4c6bb22.png','2026-07-03 03:07:06'),(11,'TICKET-260508-694196',NULL,'DSAD','GAD','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','software','email','','2026-05-08','2026-06-18','DSADSAD',4,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_28f915a5-852d-4695-b3e6-6a2809d112d4.png','2026-07-03 03:07:33'),(12,'TICKET-260620-317900',NULL,'sdsa','GAD','Jerald Tulibao','jeraldtulibao@gmail.com','9852303857','jeraldtulibao783@gmail.com','software','chat','','2026-06-20','2026-07-18','',4,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_8e5b89e6-ba7e-4811-b90c-a3579f7a6381.png','2026-07-20 13:34:33'),(13,'TICKET-260621-882635',NULL,'UPMINDANAO','OC','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','hardware, software, network','email,chat,onsite','','2026-06-21','2026-07-20','',3,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_37472530-3597-464d-8970-2f8e16b2349a.png','2026-07-20 13:37:18'),(14,'TICKET-260703-112688',NULL,'UPMIN','OC','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','software, network','email,chat','','2026-07-03','2026-07-20','asdasdsadsadsadsadasdasdadsadsadasdasdasdasdasdasdasdsadsadsad',4,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_5e57c947-9a39-405f-9465-361bf261f63b.png','2026-07-20 13:38:59'),(15,'TICKET-260724-788796',NULL,'A','OC','Jerald Tulibao','jeraldtulibao@gmail.com','9852303857','Jerald Tulibao','hardware','email','','2026-07-24','2026-07-24','SAD',4,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_955b40d3-b194-4a3e-b8b6-007f8e38077c.png','2026-07-24 02:49:46'),(16,'TICKET-260720-630381',NULL,'DSAD','GAD','Jerald Tulibao','jeraldtulibao@gmail.com','','jeraldtulibao783@gmail.com','hardware, software','phone,email','','2026-07-20','2026-07-24','DSADDSADSAD',5,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_8d58f7c5-b45f-44e2-93fc-b0ba614ddfae.png','2026-07-27 14:28:58'),(17,'TICKET-260720-830436',NULL,'DSAD','GAD','Jerald Tulibao','jeraldtulibao@gmail.com','','Jerald Tulibao','hardware, software, network','phone,email,chat','','2025-07-20','2026-07-27','SADSAD',5,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_814e8cb9-6205-4dbd-886d-6639ad5ee7c0.png','2026-08-05 13:33:41'),(18,'TICKET-260727-349961',NULL,'SADASD','OVCAD','Jerald Tulibao','jeraldtulibao@gmail.com','9852303857','Jerald Tulibao','network, account','chat','','2026-07-27','2026-08-04','DSADASDSA',3,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_e9e2405d-d95f-4335-b4cf-ae113b523050.png','2026-08-05 13:34:13'),(19,'TICKET-260720-127288',NULL,'UPMINDANAO','OC','Jerald Tulibao','jeraldtulibao@gmail.com','-9','Jerald Tulibao','software','email','','2026-07-20','2026-07-22','SDADSADSADASDASDSADSADSAD',4,'Excellent','Excellent','Excellent','Excellent','Excellent','/Assets/E-sig/signature_e41f3ff4-d5a9-4dcf-849d-edd531cb429a.png','2026-08-12 05:24:09');
/*!40000 ALTER TABLE `tbl_ticketfeedback` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-10 16:09:36
