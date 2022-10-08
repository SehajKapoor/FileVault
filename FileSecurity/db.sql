/*
SQLyog Community Edition- MySQL GUI v7.01 
MySQL - 5.0.27-community-nt : Database - filesecurity
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/`filesecurity` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `filesecurity`;

/*Table structure for table `sharedfiles` */

DROP TABLE IF EXISTS `sharedfiles`;

CREATE TABLE `sharedfiles` (
  `id` varchar(255) default NULL,
  `filename` varchar(255) default NULL,
  `uploaderid` varchar(255) default NULL,
  `uploadername` varchar(255) default NULL,
  `receiver` varchar(255) default NULL,
  `privatekey` varchar(255) default NULL,
  `encryptedkey` longtext,
  `recivedate` varchar(255) default NULL,
  `typeofwatermarked` varchar(255) default NULL,
  `filetoshow` varchar(255) default NULL,
  `conditions` longtext,
  `status` varchar(255) default 'None'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `sharedfiles` */

insert  into `sharedfiles`(`id`,`filename`,`uploaderid`,`uploadername`,`receiver`,`privatekey`,`encryptedkey`,`recivedate`,`typeofwatermarked`,`filetoshow`,`conditions`,`status`) values ('1','yash.jpg','1','a','b','yashVisible_private.pem','20660eb8b8f3da49dfd838aa3c0664d9bbad457184ed3df45fe909b3b46a3f5d327f45f2389cadc335b4f88f77e36f730baa7789a5398acf8f9e2b3e499639da9810e93a0f15eaa1f74834cc3c83708e8859508f3e870f3bae91b63999f782976208521e408d7940ce2aedadb2f2c27e5ffabab59ebce9f2274156b8bc38a5d67f04a794d10e92bc64d507e727ca83e578b9136b1391ae340daa08bcd4888b65478bdc3ddbac5ca5b3d8a703ae0bbbe71c62ab72006962c98b004c4302b9fb1612d04567b80413da883dab841d619dd5a681406933b77de61aa1d21de4e5deb22586a30221af25ff4e60eddd73bc521258bd3e985956a94e87577abd17de27b4','2022-08-23','Visible','static/files/a/Visible_yash.jpg','ghjghjghjgh','Accepted'),('5','roshan.pdf','1','a','b','roshanInvisible_private.pem','0ba81636c9f2893f97957a8576f50e6da675a220dac6d3cff2ef5788efdf6f50bde815b1b90c38db3ae1b4e336f02efe32b32cc5878060484f8a54209ccbc092d1a1504df1d5ad542333fd4f5f7dfab19db80d4d70c77ccdc2faf77c7fd82b70e362103cab78f61fe81a302834de9f11ecf5b447907d5c5c3353352a415cf6842de563800d66e355a106dfe32555db228fb7e294b5d73d5932df0ac085d7e9f08b9bd0cee95be17dff27b9cf00acb6dfd8f2cc46cc210d13fe62d348206577e40b666eedd368569c3980a6490d7ff12f7460973623c456e317957f26e1534e09c63bb3fca14d20ad1d1a6e9c7e7bcca510dc544527702eb2753a92630a592adb','2022-08-23','Invisible','static/files/a/Invisible_roshan.pdf','ghfghfgh,fghfgh','Accepted'),('3','yash.jpg','1','a','b','yashBoth_private.pem','79b9c2b22ae8ef3d71902d5a31e32ce61c0c9bad56ea83f12286ea195d18e7ef1e65364e3629f0ca0e40c40bd3f8421f687735b754c2b8219b9b327dd144c6a6d98cbf6e3cf06b2d8277ec14fc051af9b89e0affdeb8fb682318f15a1f706644600cab1c1bb139c4d5267735d2e8e797507538142f62066ee1535bf76ed81f98961c9c2b4131b5a28f1f696653ee8452887f11caf536c14f3d79bede62bdaefc3e426dc22586a4c210c3e4f7a228ec86d42951b407bd1036f55c2cdc82804d794e04e095a95c90e36a57a9f136836e1f497aef92003d2cf655b30c7ab8efff900b171bdddfdec81734197908cf0384f2aee44e09c26d23291923882f264f4585','2022-08-23','Both','static/files/a/Both_yash.jpg','gfdfgdfgdfg','Accepted'),('2','yash.jpg','1','a','b','yashInvisible_private.pem','a3a2f8ec573bafd6a28e67c3909b4a9dde5b92323644a361a65d09e84e9cc0f1cedf3825869a798f5a853675a5caf69ed732bf2df0e4c0b3772bc4ff5b655beb51a8d2ca3915501090e0c4e2edf24c2e822daa0d109f34de225ba476c05147a73ee7ce1a4b516e2789d3ab62038820fe55b7cc07cd9613018e9cb795b7cac53fe3d235bf1c5718f272187ec273901c89287fa68b77a2da74cab3b7c1e66d7e2353f0433c9a47e8346c8c8c7cc554671e77b8ec8b95e3382145a26123c28c8e497f78f2f9e9b14f096a74df64ecf40c5cb02e1a3b96dc7127e7dfe9b9606a9e777a945d8625b3b3cb6b752011b6caaa61313208bf0c2cb25753d024e787761c9a','2022-08-23','Invisible','static/files/a/Invisible_yash.jpg','gfjjghghjgh','Accepted'),('4','roshan.pdf','1','a','b','roshanVisible_private.pem','272c17e1ee529253e27683b76902e4b5cc98e9c6ac6f1d0cefde57756f77acbaa2999b9f35153df7e975ce928e810ade99249a40942503942d4822086562f08bc3880524d5b4876e318a1de9fdbf48e17f7ca9b0d6efea8a5b3ac17ddcf0cd065db97f2f4de33bf6bc6afc4cd31a0f26057c61af3229d978fbdd984ddf011b5534485b8ff9be7eb732e9380d05e4be3b58385a9cf851fde6293aaa15167c5ce3e9ab2b89fe8978521a06a9dffa0a311be9f26da4bad0816d7241530af96c69006454e32c84f6e2ca48901d9487bc2099ddc2816286b580a9f2c19687fb26a0dff01ff0982be4962358fa772c921627b9bccfbf91c1258ef50e6e236e6b552d5a','2022-08-23','Visible','static/files/a/Visible_roshan.pdf','fgdfgdfgdfg','Accepted'),('6','roshan.pdf','1','a','b','roshanBoth_private.pem','6926616e11bf8226f9cf4153e9f9cd266bf0acf0a8731e4c68038314acb7adad9fb1d5191e30cd9eb91896f1c86e474563512f18855f2ce2247c4e49469bb6979f6186be4f24c2501b0f2f6afe3b404ac39cffbb3590ab1ce20d746cd1485bc6e7cb97cd935ae597e96ca78d8dae404849c7024d601c86cdbee16c1da631670c472a73b8c8b84e5e41f5a84a5590de3a2ba581e7fba7fe26311fd9f8a0e23bd975aa2168343887b866f62d4340cf01889a43348452013cb7492277895d3bd087c07541e282ebe9ee8e5e044750cd337bea24a5bcab34456a5f2af2b6715fc4d0e9aa704973efac09fa863b4b11f521104f8cba552e4f05eae8d9b186ae14e400','2022-08-23','Both','static/files/a/Both_roshan.pdf','ghgvnvbnvb','Accepted');

/*Table structure for table `uploadedfiles` */

DROP TABLE IF EXISTS `uploadedfiles`;

CREATE TABLE `uploadedfiles` (
  `id` int(255) NOT NULL auto_increment,
  `filename` varchar(255) default NULL,
  `uploader` varchar(255) default NULL,
  `privatekey` varchar(255) default NULL,
  `encryptedkey` longtext,
  `uploaddate` varchar(255) default NULL,
  `typeofwatermarked` varchar(255) default NULL,
  `filetoshow` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `uploadedfiles` */

insert  into `uploadedfiles`(`id`,`filename`,`uploader`,`privatekey`,`encryptedkey`,`uploaddate`,`typeofwatermarked`,`filetoshow`) values (1,'yash.jpg','a','yashVisible_private.pem','20660eb8b8f3da49dfd838aa3c0664d9bbad457184ed3df45fe909b3b46a3f5d327f45f2389cadc335b4f88f77e36f730baa7789a5398acf8f9e2b3e499639da9810e93a0f15eaa1f74834cc3c83708e8859508f3e870f3bae91b63999f782976208521e408d7940ce2aedadb2f2c27e5ffabab59ebce9f2274156b8bc38a5d67f04a794d10e92bc64d507e727ca83e578b9136b1391ae340daa08bcd4888b65478bdc3ddbac5ca5b3d8a703ae0bbbe71c62ab72006962c98b004c4302b9fb1612d04567b80413da883dab841d619dd5a681406933b77de61aa1d21de4e5deb22586a30221af25ff4e60eddd73bc521258bd3e985956a94e87577abd17de27b4','2022-08-23','Visible','static/files/a/Visible_yash.jpg'),(2,'yash.jpg','a','yashInvisible_private.pem','a3a2f8ec573bafd6a28e67c3909b4a9dde5b92323644a361a65d09e84e9cc0f1cedf3825869a798f5a853675a5caf69ed732bf2df0e4c0b3772bc4ff5b655beb51a8d2ca3915501090e0c4e2edf24c2e822daa0d109f34de225ba476c05147a73ee7ce1a4b516e2789d3ab62038820fe55b7cc07cd9613018e9cb795b7cac53fe3d235bf1c5718f272187ec273901c89287fa68b77a2da74cab3b7c1e66d7e2353f0433c9a47e8346c8c8c7cc554671e77b8ec8b95e3382145a26123c28c8e497f78f2f9e9b14f096a74df64ecf40c5cb02e1a3b96dc7127e7dfe9b9606a9e777a945d8625b3b3cb6b752011b6caaa61313208bf0c2cb25753d024e787761c9a','2022-08-23','Invisible','static/files/a/Invisible_yash.jpg'),(3,'yash.jpg','a','yashBoth_private.pem','79b9c2b22ae8ef3d71902d5a31e32ce61c0c9bad56ea83f12286ea195d18e7ef1e65364e3629f0ca0e40c40bd3f8421f687735b754c2b8219b9b327dd144c6a6d98cbf6e3cf06b2d8277ec14fc051af9b89e0affdeb8fb682318f15a1f706644600cab1c1bb139c4d5267735d2e8e797507538142f62066ee1535bf76ed81f98961c9c2b4131b5a28f1f696653ee8452887f11caf536c14f3d79bede62bdaefc3e426dc22586a4c210c3e4f7a228ec86d42951b407bd1036f55c2cdc82804d794e04e095a95c90e36a57a9f136836e1f497aef92003d2cf655b30c7ab8efff900b171bdddfdec81734197908cf0384f2aee44e09c26d23291923882f264f4585','2022-08-23','Both','static/files/a/Both_yash.jpg'),(4,'roshan.pdf','a','roshanVisible_private.pem','272c17e1ee529253e27683b76902e4b5cc98e9c6ac6f1d0cefde57756f77acbaa2999b9f35153df7e975ce928e810ade99249a40942503942d4822086562f08bc3880524d5b4876e318a1de9fdbf48e17f7ca9b0d6efea8a5b3ac17ddcf0cd065db97f2f4de33bf6bc6afc4cd31a0f26057c61af3229d978fbdd984ddf011b5534485b8ff9be7eb732e9380d05e4be3b58385a9cf851fde6293aaa15167c5ce3e9ab2b89fe8978521a06a9dffa0a311be9f26da4bad0816d7241530af96c69006454e32c84f6e2ca48901d9487bc2099ddc2816286b580a9f2c19687fb26a0dff01ff0982be4962358fa772c921627b9bccfbf91c1258ef50e6e236e6b552d5a','2022-08-23','Visible','static/files/a/Visible_roshan.pdf'),(5,'roshan.pdf','a','roshanInvisible_private.pem','0ba81636c9f2893f97957a8576f50e6da675a220dac6d3cff2ef5788efdf6f50bde815b1b90c38db3ae1b4e336f02efe32b32cc5878060484f8a54209ccbc092d1a1504df1d5ad542333fd4f5f7dfab19db80d4d70c77ccdc2faf77c7fd82b70e362103cab78f61fe81a302834de9f11ecf5b447907d5c5c3353352a415cf6842de563800d66e355a106dfe32555db228fb7e294b5d73d5932df0ac085d7e9f08b9bd0cee95be17dff27b9cf00acb6dfd8f2cc46cc210d13fe62d348206577e40b666eedd368569c3980a6490d7ff12f7460973623c456e317957f26e1534e09c63bb3fca14d20ad1d1a6e9c7e7bcca510dc544527702eb2753a92630a592adb','2022-08-23','Invisible','static/files/a/Invisible_roshan.pdf'),(6,'roshan.pdf','a','roshanBoth_private.pem','6926616e11bf8226f9cf4153e9f9cd266bf0acf0a8731e4c68038314acb7adad9fb1d5191e30cd9eb91896f1c86e474563512f18855f2ce2247c4e49469bb6979f6186be4f24c2501b0f2f6afe3b404ac39cffbb3590ab1ce20d746cd1485bc6e7cb97cd935ae597e96ca78d8dae404849c7024d601c86cdbee16c1da631670c472a73b8c8b84e5e41f5a84a5590de3a2ba581e7fba7fe26311fd9f8a0e23bd975aa2168343887b866f62d4340cf01889a43348452013cb7492277895d3bd087c07541e282ebe9ee8e5e044750cd337bea24a5bcab34456a5f2af2b6715fc4d0e9aa704973efac09fa863b4b11f521104f8cba552e4f05eae8d9b186ae14e400','2022-08-23','Both','static/files/a/Both_roshan.pdf');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(255) NOT NULL auto_increment,
  `username` varchar(255) default NULL,
  `email` varchar(255) default NULL,
  `mobile` varchar(255) default NULL,
  `password` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`email`,`mobile`,`password`) values (1,'a','yashsalvi1999@gmail.com','9930090883','a'),(2,'b','y@gmail.com','9930090883','b');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
