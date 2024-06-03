-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 03, 2024 at 10:05 AM
-- Server version: 10.11.7-MariaDB-cll-lve
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u421310157_shms`
--
CREATE DATABASE IF NOT EXISTS `u421310157_shms` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `u421310157_shms`;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `shms_project_id` varchar(256) NOT NULL,
  `shms_project_images` text NOT NULL,
  `shms_project_study_case` text DEFAULT NULL,
  `shms_project_study_case_visibility` tinyint(1) NOT NULL,
  `shms_project_name` varchar(256) NOT NULL,
  `shms_project_location` varchar(256) NOT NULL,
  `shms_project_start_date` date NOT NULL,
  `shms_project_end_date` date NOT NULL,
  `shms_project_invest_date` date NOT NULL,
  `shms_project_profits_collect_date` date NOT NULL,
  `shms_project_available_stocks` int(4) NOT NULL,
  `shms_project_total_stocks` int(11) NOT NULL,
  `shms_project_stock_price` int(10) NOT NULL,
  `shms_project_special_percentage` int(3) DEFAULT NULL,
  `shms_project_special_percentage_code` varchar(10) DEFAULT NULL,
  `shms_project_stock_profits` int(10) NOT NULL,
  `shms_project_description` text NOT NULL,
  `shms_project_terms` text DEFAULT NULL,
  `shms_project_status` varchar(7) NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`shms_project_id`, `shms_project_images`, `shms_project_study_case`, `shms_project_study_case_visibility`, `shms_project_name`, `shms_project_location`, `shms_project_start_date`, `shms_project_end_date`, `shms_project_invest_date`, `shms_project_profits_collect_date`, `shms_project_available_stocks`, `shms_project_total_stocks`, `shms_project_stock_price`, `shms_project_special_percentage`, `shms_project_special_percentage_code`, `shms_project_stock_profits`, `shms_project_description`, `shms_project_terms`, `shms_project_status`) VALUES
('a446d84c-0082-42e2-a929-cddf84bc552f', '[{\"imgDisplayName\":\"images-1.jpeg-SHMS-a446d84c-0082-42e2-a929-cddf84bc552f\",\"imgDisplayPath\":\"https://shms-uploads.s3.eu-west-2.amazonaws.com/projects/a446d84c-0082-42e2-a929-cddf84bc552f/images-1.jpeg-SHMS-a446d84c-0082-42e2-a929-cddf84bc552f\"},{\"imgDisplayName\":\"images.jpeg-SHMS-a446d84c-0082-42e2-a929-cddf84bc552f\",\"imgDisplayPath\":\"https://shms-uploads.s3.eu-west-2.amazonaws.com/projects/a446d84c-0082-42e2-a929-cddf84bc552f/images.jpeg-SHMS-a446d84c-0082-42e2-a929-cddf84bc552f\"},{\"imgDisplayName\":\"istockphoto-1394674149-612x612.jpg-SHMS-a446d84c-0082-42e2-a929-cddf84bc552f\",\"imgDisplayPath\":\"https://shms-uploads.s3.eu-west-2.amazonaws.com/projects/a446d84c-0082-42e2-a929-cddf84bc552f/istockphoto-1394674149-612x612.jpg-SHMS-a446d84c-0082-42e2-a929-cddf84bc552f\"},{\"imgDisplayName\":\"2aad0371c5b00de59ae64fe74f6a379b.jpg-SHMS-a446d84c-0082-42e2-a929-cddf84bc552f\",\"imgDisplayPath\":\"https://shms-uploads.s3.eu-west-2.amazonaws.com/projects/a446d84c-0082-42e2-a929-cddf84bc552f/2aad0371c5b00de59ae64fe74f6a379b.jpg-SHMS-a446d84c-0082-42e2-a929-cddf84bc552f\"}]', '[{\"imgDisplayName\":\"شمس | للخدمات الزراعية - دراسة جدوى - مشروع زراعة الفول السوداني 2024.pdf-SHMS-a446d84c-0082-42e2-a929-cddf84bc552f\",\"imgDisplayPath\":\"https://shms-uploads.s3.eu-west-2.amazonaws.com/projects/a446d84c-0082-42e2-a929-cddf84bc552f/caseStudy/شمس | للخدمات الزراعية - دراسة جدوى - مشروع زراعة الفول السوداني 2024.pdf-SHMS-a446d84c-0082-42e2-a929-cddf84bc552f\"}]', 1, 'مشروع زراعة الفول السوداني ', 'مدينة الأبيض', '2024-06-21', '2024-12-29', '2024-05-30', '2025-01-31', 2, 150, 2500, 50, 'YJDW498', 1000, 'يعد الفول السوداني من اهم المحاصيل الزراعية وذلك لدخوله في كثير من الاستخدامات الاستهلاكية، مما يعزز \nالطلب عليه محليا وعالميا . ولذلك تسعى شمس الزراعية للعمل في زيادة انتاجية وجودة الفول السوداني المزروع في الاراضي السودانية بإضافة التقانة الزراعية المتكاملة .', '<h3>الموقع:</h3>\n<p>مدينة الأبيض في ولاية شمال كردفان، السودان</p>\n<h3>قيمة السهم الواحد:</h3>\n<p>2500 ريال قطري.</p>\n<h3>مدة المشروع:</h3>\n<p>يستمر المشروع لمدة ستة اشهر.</p>\n<h3>موعد تسليم الأرباح:</h3>\n<p>يتم توزيع الأرباح في تاريخ 1 فبراير 2025.</p>\n<h3>آخر موعد للمساهمة في المشروع:</h3>\n<ol>\n<li>يتم إيقاف استلام المساهمات في تاريخ 15 مايو 2024.</li>\n<li>يمكنك <strong>الاستثمار</strong> في المشروع من خلال شراء الأسهم بقيمة 2500 وحدة نقدية لكل سهم.</li>\n<li>من المتوقع أن يحقق المشروع أرباحًا بقيمة 1000 ريال قطري لكل سهم على مدار فترة المشروع.</li>\n<li>تتوفر فرصة للمساهمين في الاستفادة من الارتفاع المتوقع في الطلب المحلي والعالمي على الفول السوداني، وذلك من خلال تحسين جودة وكمية الإنتاج باستخدام التكنولوجيا الزراعية المتقدمة.</li>\n</ol>\n<blockquote>\n<p>مع تحيات فريق <strong>شمــس</strong> للخدمات الزراعية !</p>\n</blockquote>\n<p><img src=\"https://shmsagricultural.com/logo.svg\" alt=\"Logo\"></p>\n', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `shms_sn` int(11) NOT NULL COMMENT 'Shms Serial Number to organize users by ascending or descending',
  `shms_id` varchar(256) NOT NULL,
  `shms_fullname` varchar(256) NOT NULL,
  `shms_nationality` varchar(10) NOT NULL,
  `shms_date_of_birth` date NOT NULL,
  `shms_address` varchar(256) NOT NULL DEFAULT 'لم يتم إدخال العنوان',
  `shms_email` varchar(256) NOT NULL,
  `shms_password` varchar(256) NOT NULL,
  `shms_phone` varchar(20) NOT NULL,
  `shms_doc` varchar(256) NOT NULL,
  `shms_user_stocks` text DEFAULT NULL,
  `shms_user_stock_limit` int(3) NOT NULL DEFAULT 20,
  `shms_user_total_balance` int(11) NOT NULL DEFAULT 0,
  `shms_user_withdrawable_balance` int(11) NOT NULL DEFAULT 0,
  `shms_created_at` date NOT NULL DEFAULT current_timestamp(),
  `shms_user_account_type` varchar(10) NOT NULL DEFAULT 'user',
  `shms_user_account_status` varchar(7) NOT NULL DEFAULT 'active',
  `shms_user_reset_token` varchar(256) DEFAULT NULL,
  `shms_user_reset_token_expires` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`shms_sn`, `shms_id`, `shms_fullname`, `shms_nationality`, `shms_date_of_birth`, `shms_address`, `shms_email`, `shms_password`, `shms_phone`, `shms_doc`, `shms_user_stocks`, `shms_user_stock_limit`, `shms_user_total_balance`, `shms_user_withdrawable_balance`, `shms_created_at`, `shms_user_account_type`, `shms_user_account_status`, `shms_user_reset_token`, `shms_user_reset_token_expires`) VALUES
(1, '3e508307-3031-4221-833f-254d8dbc56df', 'محمد  بشير عوض الكريم ', 'السودان', '1997-01-01', 'قطر', 'mo.b2shir@gmail.com', '$2a$10$UluiXz1bxBWUSwqrZJWVT.rYHawXrA8GUgN1ImvudZAbexoP0DPtm', '66027723', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/5899fe57-beb1-43a7-bb50-1dd3ce003539-%D9%85%D8%AD%D9%85%D8%AF%20%20%D8%A8%D8%B4%D9%8A%D8%B1%20%D8%B9%D9%88%D8%B6%20%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85%20-17062710961837419856994996967609.jpg', NULL, 50, 27500, 27500, '2024-01-26', 'admin', 'active', NULL, NULL),
(2, 'c54a9939-c130-46c7-963f-2b7d7a2f5e92', 'ابوطالب  بشير  عوض الكريم  محمد ', 'السودان', '1993-11-21', 'السودان الابيض', 'youngb7575@gmail.com', '$2a$10$f4Kzru0GwwkB7sKg9jv59uWUDPqILqHMG1VMrSaTyvL7G0lcmKxQy', '33173144', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/ابوطالب-بشير-عوض-الكريم-محمد-01ED4D2F-DA0D-4EE6-8F02-FD9E5C3451BC.jpeg-SHMS-c54a9939-c130-46c7-963f-2b7d7a2f5e92', NULL, 20, 0, 0, '2024-02-01', 'admin', 'active', NULL, NULL),
(3, 'cc43557d-72d3-4e8c-86aa-afd49164b315', 'محمود  عمر  أحمد البلاع', 'السودان', '1998-01-09', 'قطر الدوحة', 'tanohota98y98y@gmail.com', '$2a$10$ra/q5b09O5i7zpdB25Iw3.8bYKlxlPv34Be0ZKKw35sv/Ij.UgiEi', '97451188548', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/محمود-عمر-أحمد-البلاعIMG_3650.jpeg-SHMS-cc43557d-72d3-4e8c-86aa-afd49164b315', NULL, 20, 0, 0, '2024-02-02', 'user', 'active', NULL, NULL),
(4, 'f1da7c7c-aa7c-47e7-9483-107169893f88', 'Afra Bashir Elkarim  ', 'السودان', '2003-07-29', 'Doha/Qatar', 'afrabashir3@gmail.com', '$2a$10$amCHas9dtZHyL6Pd/L8d9u3lwRH0kBdoRdsIGIjzaX1rBIPvEdauW', '97466507349', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/afra-bashir-elkarim-image.jpg-SHMS-f1da7c7c-aa7c-47e7-9483-107169893f88', NULL, 20, 0, 0, '2024-02-07', 'user', 'active', NULL, NULL),
(5, 'deb28d13-5168-4d72-82eb-ae7166a8abe3', 'Hamza Ibrahim Hamza Elhussain', 'السودان', '1997-02-23', 'الدوحه قطر ', 'hamzaelhussain31@gmail.com', '$2a$10$xg/v2OzX0/tcnw33VaOe2OiCFWtS3ixvuf3k9m8CtPa7YG1DSgTuq', '97455358149', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/hamza-ibrahim-hamza-elhussaina3ac5f92-8feb-420b-bc8b-77c3a6fc3920.jpeg-SHMS-deb28d13-5168-4d72-82eb-ae7166a8abe3', NULL, 20, 0, 0, '2024-02-08', 'user', 'active', NULL, NULL),
(6, '06a89eb6-ac40-44ed-a320-7e7479e916b1', 'راجي خالد محمد بريمه', 'السودان', '1988-05-21', 'الدوحة - معيذر', 'rajykhaled@gmail.com', '$2a$10$a0TYk/iwDZGscA.aXhTZHeyC7Ch.ahMWuE7PWpg3i6wUqL6xvvvb.', '97470072716', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/راجي-خالد-محمد-بريمه17074988204575803361860198978054.jpg-SHMS-06a89eb6-ac40-44ed-a320-7e7479e916b1', NULL, 20, 0, 0, '2024-02-09', 'user', 'active', NULL, NULL),
(7, '5ec07077-fcf1-46f9-afc9-fb9dc7ea362d', 'عثمان  الفاضل عثمان محمد', 'السودان', '1988-01-01', 'قطر الريان معيذر', 'osmanalfadil767@gmail.com', '$2a$10$RMkOoDNaPc9VqwhwUDNTBepsJGB9cUvJcnzoBbne.IDTyPIJs5yLi', '97433510952', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/عثمان-الفاضل-عثمان-محمد580EA822-4DCE-4003-BE91-1B9606C03BCA.jpeg-SHMS-5ec07077-fcf1-46f9-afc9-fb9dc7ea362d', NULL, 20, 0, 0, '2024-02-09', 'user', 'active', NULL, NULL),
(8, '05761c95-17db-43c5-9784-fa7d9c0ce6b4', 'أحمد سيف الدين النميري الغزالي', 'السودان', '1998-07-10', '', 'aelghazaliii@gmail.com', '$2a$10$ejV5AszxP/kUwx8LS/tdWeLxe7dLfehtdv4dIvMVfI.Xpn0NVup56', '97477711168', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/أحمد-سيف-الدين-النميري-الغزاليIMG_3518.jpeg-SHMS-05761c95-17db-43c5-9784-fa7d9c0ce6b4', NULL, 50, 70000, 20000, '2024-02-10', 'user', 'active', NULL, NULL),
(9, '54dd564b-84be-4148-8077-d8cfb38c4d9e', 'Kamal Alrayah Ahmed  Alkejem', 'السودان', '2000-09-12', 'Doha', 'kamalalrayah1999@gmail.com', '$2a$10$1jYZ0CJdGPn.N3gvpWOguO3GZ1VTCaXDpaiSYDbUmMuQ0airtOLDy', '97477377044', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/kamal-alrayah-ahmed-alkejemIMG_4011.jpeg-SHMS-54dd564b-84be-4148-8077-d8cfb38c4d9e', NULL, 25, 83000, 83000, '2024-02-14', 'user', 'active', NULL, NULL),
(10, '48b64c0c-b4ce-438e-b46b-2207ba99dea1', 'حمود محمد اليهري  اليافعي ', 'دولة قطر', '1986-01-17', '', 'bohamad558@gmail.com', '$2a$10$9R1asYMvJ5YN5c3d01sxK.BFKL.tJygUB/6iRzzr15EW/.OMYG7dS', '97455855180', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/حمود-محمد-اليهري-اليافعي-image.jpg-SHMS-48b64c0c-b4ce-438e-b46b-2207ba99dea1', '[{\"shms_project_id\":\"a446d84c-0082-42e2-a929-cddf84bc552f\",\"stocks\":40,\"newPercentage\":50,\"percentageCode\":\"WQO0MLV\",\"createdAt\":\"2024-02-26T12:05:47.592Z\"},{\"shms_project_id\":\"a446d84c-0082-42e2-a929-cddf84bc552f\",\"stocks\":16,\"newPercentage\":50,\"percentageCode\":\"Yjdw498\",\"createdAt\":\"2024-04-30T07:39:32.360Z\"}]', 40, 175000, 0, '2024-02-17', 'user', 'active', NULL, NULL),
(11, '131b748d-f8e5-4eb0-b094-9f1cd67ec030', 'عبدالعزيز  حاتم عباس البشير', 'السودان', '1998-02-19', '', 'abdalazizhatim98@gmail.com', '$2a$10$y/gfFMQjFeKyNwY4fajJbe7wPncNYuYFJd5khuC9XNNwIOVE5Nb6.', '97466034830', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/عبدالعزيز-حاتم-عباس-البشيرinbound6515620707519109357.pdf-SHMS-131b748d-f8e5-4eb0-b094-9f1cd67ec030', NULL, 20, 0, 0, '2024-02-20', 'user', 'active', NULL, NULL),
(12, '6b5661a9-b2c8-4737-abeb-6cb738afa020', 'احمد  عثمان ابوزيد ', 'السودان', '1998-10-05', 'قطر', 'Ahmedosman937@gmail.com', '$2a$10$FJAVa8v8.oLQnClrreN65OUbUx6fRaM4wYNO1CojnYsZjdQZtYZjW', '97455172347', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/احمد-عثمان-ابوزيد-IMG-20240224-WA0055.jpg-SHMS-6b5661a9-b2c8-4737-abeb-6cb738afa020', '[{\"shms_project_id\":\"a446d84c-0082-42e2-a929-cddf84bc552f\",\"stocks\":40,\"newPercentage\":50,\"percentageCode\":\"WQO0MLV\",\"createdAt\":\"2024-02-25T12:02:47.592Z\"},{\"shms_project_id\":\"a446d84c-0082-42e2-a929-cddf84bc552f\",\"stocks\":10,\"newPercentage\":50,\"percentageCode\":\"O51UTVA\",\"createdAt\":\"2024-03-30T06:51:08.863Z\"}]', 60, 125000, 75000, '2024-02-24', 'user', 'active', NULL, NULL),
(13, '6e573bf6-9abc-4e0f-b51f-8717c44d3cf6', 'عمر عاطف محمد ', 'السودان', '1996-05-10', 'معيذر الشمالي', 'moorqa191@gmail.com', '$2a$10$bKsm7sbFuOf2XrkObpYn0.xMEuiR6KofROpjACb5FKT/PSij.tfqG', '97433119140', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/عمر-عاطف-محمد-IMG_5660.jpeg-SHMS-6e573bf6-9abc-4e0f-b51f-8717c44d3cf6', '[{\"shms_project_id\":\"a446d84c-0082-42e2-a929-cddf84bc552f\",\"stocks\":14,\"newPercentage\":50,\"percentageCode\":\"YJDW498\",\"createdAt\":\"2024-05-12T03:46:15.200Z\"}]', 20, 42000, 13500, '2024-02-24', 'user', 'active', NULL, NULL),
(14, '1f07e8fd-e811-4b28-b02e-c657aa3167bd', 'مصطفى  منصور يحي  عطيه', 'اليمن', '1997-01-01', 'الدوحه', 'Mnxzzo@yahoo.com', '$2a$10$3XsjDH3eSrJ/AA7sUi44YeyBgT17XmaQK9OQH6kMDJmcfiUaHQYDa', '97477267303', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/مصطفى-منصور-يحي-عطيه17090987604653387023837396139479.jpg-SHMS-1f07e8fd-e811-4b28-b02e-c657aa3167bd', '[{\"shms_project_id\":\"a446d84c-0082-42e2-a929-cddf84bc552f\",\"stocks\":6,\"newPercentage\":0,\"percentageCode\":\"YJDW498\",\"createdAt\":\"2024-04-28T19:27:11.837Z\"}]', 20, 0, 15000, '2024-02-28', 'user', 'active', NULL, NULL),
(15, 'a103f5c7-6958-4f98-a0ed-dd5f5a861690', 'محمد حيدر الطاهر ', 'السودان', '1997-06-27', 'UK', 'mr.hamood277@gmail.com', '$2a$10$ru8wM9zT1ZN/9tSIxqCJMOPlNtGHhDWjebH1PEQe800ahaf21BARS', '97455308115', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/محمد-حيدر-الطاهر-Passport.pdf-SHMS-a103f5c7-6958-4f98-a0ed-dd5f5a861690', '[{\"shms_project_id\":\"a446d84c-0082-42e2-a929-cddf84bc552f\",\"stocks\":3,\"newPercentage\":50,\"percentageCode\":\"O51UTVA\",\"createdAt\":\"2024-03-26T00:01:44.169Z\"},{\"shms_project_id\":\"a446d84c-0082-42e2-a929-cddf84bc552f\",\"stocks\":1,\"newPercentage\":50,\"percentageCode\":\"O51UTVA\",\"createdAt\":\"2024-04-05T14:48:02.924Z\"}]', 20, 7500, 0, '2024-02-29', 'admin', 'active', NULL, NULL),
(16, '08056ed4-8114-4590-ad6a-29fbf3d4cb08', 'احمد جمال سعيد ابراهيم', 'السودان', '1997-10-26', 'الدوحه - قطر', 'ahmad.boy45.aa@gmail.com', '$2a$10$O82qCyJKDBt3WJs1yKezoervsWivdWMu1fmLEaQXjZSittNmzC4ua', '97433912993', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/احمد-جمال-سعيد-ابراهيمIMG_9301.jpeg-SHMS-08056ed4-8114-4590-ad6a-29fbf3d4cb08', '[{\"shms_project_id\":\"a446d84c-0082-42e2-a929-cddf84bc552f\",\"stocks\":6,\"newPercentage\":50,\"percentageCode\":\"O51UTVA\",\"createdAt\":\"2024-03-11T19:57:35.243Z\"}]', 20, 55000, 19000, '2024-03-05', 'user', 'active', NULL, NULL),
(17, '7e92a58c-4283-4c7e-8086-ec82c756c9aa', 'محمد عبدالرحيم محمد  مكي', 'السودان', '1998-08-23', 'الامارات العربية المتحدة ', 'mohamedabdo2381998@gmail.com', '$2a$10$8bkHavLD3F6UMW6hQdOp8OxrKcM8U2VBTqOWbRqpeG.ermRsNi.7S', '971547968313', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/محمد-عبدالرحيم-محمد-مكي3abb6f2a-152c-4b3e-b692-da545afe92cb.jpg-SHMS-7e92a58c-4283-4c7e-8086-ec82c756c9aa', NULL, 20, 0, 0, '2024-05-05', 'user', 'active', NULL, NULL),
(20, '022b4dfd-f200-4215-b7e6-394e69c990b7', 'ABDULRAHEM ALLAM ABDALLA ', 'السودان', '1992-01-01', '', 'wdallam-458@hotmail.com', '$2a$10$C8lmaluPdrECnhJkhHQa/./vJZs.gpMZCTh7h6kbMFJ6zH0i/b.u2', '97433523553', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/abdulrahem-allam-abdalla-1976f362-54bb-40b1-87fa-1304cb5cbb19.jpeg-SHMS-022b4dfd-f200-4215-b7e6-394e69c990b7', '[{\"shms_project_id\":\"a446d84c-0082-42e2-a929-cddf84bc552f\",\"stocks\":4,\"newPercentage\":50,\"percentageCode\":\"YJDW498\",\"createdAt\":\"2024-05-12T03:48:34.925Z\"}]', 20, 0, 0, '2024-05-08', 'user', 'active', NULL, NULL),
(21, '93b168b5-4a81-42ba-9b16-2694ba597ed2', 'ABDULRAHEM  ALLAM ABDALLA ', 'السودان', '1992-01-01', '', 'allammo370@gmail.com', '$2a$10$TdiYaVE1eIOhOaPNBcCCV.TF762uPfuzEkVxiF49byJRxzibaQLGm', '97433523553', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/abdulrahem-allam-abdalla-1976f362-54bb-40b1-87fa-1304cb5cbb19.jpeg-SHMS-93b168b5-4a81-42ba-9b16-2694ba597ed2', NULL, 20, 0, 0, '2024-05-10', 'user', 'active', NULL, NULL),
(22, '97641d24-b89c-48ec-b523-82f9bdc816d8', 'اسامة الفاضل  فكي  ', 'السودان', '1998-09-17', 'الدوحة', 'Osamaelfadel98@gmail.com', '$2a$10$uulb/oBhY89UJD2KTPMnNeLmhRvtQ4RecVK62fr5yA7eM4i75cP4C', '97477199892', 'https://shms-uploads.s3.eu-west-2.amazonaws.com/اسامة-الفاضل-فكي-17157055562602867878880912229787.jpg-SHMS-97641d24-b89c-48ec-b523-82f9bdc816d8', '[{\"shms_project_id\":\"a446d84c-0082-42e2-a929-cddf84bc552f\",\"stocks\":8,\"newPercentage\":50,\"percentageCode\":\"YJDW498\",\"createdAt\":\"2024-05-14T19:09:04.281Z\"}]', 20, 0, 0, '2024-05-14', 'user', 'active', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `withdraw_actions`
--

CREATE TABLE `withdraw_actions` (
  `shms_withdraw_id` varchar(256) NOT NULL,
  `shms_created_at` timestamp NULL DEFAULT current_timestamp(),
  `shms_user_id` varchar(256) DEFAULT NULL,
  `shms_withdraw_amount` int(11) DEFAULT 0,
  `shms_action_type` varchar(20) NOT NULL DEFAULT 'withdraw',
  `accounting_operation_status` varchar(20) DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `withdraw_actions`
--

INSERT INTO `withdraw_actions` (`shms_withdraw_id`, `shms_created_at`, `shms_user_id`, `shms_withdraw_amount`, `shms_action_type`, `accounting_operation_status`) VALUES
('3c8157d3-89b0-4672-9372-15cab3b09d41', '2024-03-11 19:58:01', '08056ed4-8114-4590-ad6a-29fbf3d4cb08', 6000, 'withdraw', 'completed'),
('93d60bdf-eabe-421a-870c-8a90a95fc501', '2024-03-27 00:10:47', '6e573bf6-9abc-4e0f-b51f-8717c44d3cf6', 21000, 'withdraw', 'completed'),
('af2babb9-a298-4198-b6e4-f6747ce77818', '2024-03-09 20:01:30', '6e573bf6-9abc-4e0f-b51f-8717c44d3cf6', 7500, 'withdraw', 'completed');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`shms_sn`),
  ADD KEY `shms_id_index` (`shms_id`);

--
-- Indexes for table `withdraw_actions`
--
ALTER TABLE `withdraw_actions`
  ADD PRIMARY KEY (`shms_withdraw_id`),
  ADD KEY `shms_user_id` (`shms_user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `shms_sn` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Shms Serial Number to organize users by ascending or descending', AUTO_INCREMENT=33;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `withdraw_actions`
--
ALTER TABLE `withdraw_actions`
  ADD CONSTRAINT `withdraw_actions_ibfk_1` FOREIGN KEY (`shms_user_id`) REFERENCES `users` (`shms_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
