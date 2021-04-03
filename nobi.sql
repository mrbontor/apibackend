-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 03, 2021 at 11:17 AM
-- Server version: 10.1.37-MariaDB
-- PHP Version: 7.3.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nobi`
--

-- --------------------------------------------------------

--
-- Table structure for table `investment_balance`
--

CREATE TABLE `investment_balance` (
  `id` int(11) NOT NULL,
  `nab_amount` float(20,4) NOT NULL DEFAULT '1.0000',
  `assets` float(20,4) NOT NULL DEFAULT '0.0000',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `investment_balance`
--

INSERT INTO `investment_balance` (`id`, `nab_amount`, `assets`, `created_at`, `updated_at`) VALUES
(1, 1.0000, 0.0000, '2021-04-03 16:12:34', '2021-04-03 16:12:34'),
(2, 1.4000, 0.0000, '2021-04-03 16:13:34', '2021-04-03 16:13:34'),
(3, 2.2250, 0.0000, '2021-04-03 16:14:19', '2021-04-03 16:14:19'),
(4, 2.4000, 0.0000, '2021-04-03 16:15:32', '2021-04-03 16:15:32');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `amount` float(20,4) NOT NULL DEFAULT '0.0000',
  `assets_temp` float(20,4) NOT NULL DEFAULT '0.0000',
  `nab_temp` float(20,4) NOT NULL DEFAULT '0.0000',
  `ib_temp` float(20,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `type`, `amount`, `assets_temp`, `nab_temp`, `ib_temp`, `created_at`) VALUES
(1, 1, 'kredit', 5000.0000, 3571.4285, 1.4000, 4999.99, '2021-04-03 16:13:41'),
(2, 2, 'kredit', 15000.0000, 6741.5732, 2.2250, 14999.99, '2021-04-03 16:14:57'),
(3, 1, 'debit', 6000.0000, 1071.4285, 2.4000, 2571.42, '2021-04-03 16:16:53');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(30) DEFAULT NULL,
  `lastname` varchar(30) DEFAULT NULL,
  `username` varchar(30) NOT NULL,
  `status` int(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `username`, `status`, `created_at`, `updated_at`) VALUES
(1, 'tobok', 'sitangang', 'mrbontor', 0, '2021-04-02 22:32:40', '2021-04-02 22:32:40'),
(2, 'sitanggang', 'tobok', 'user', 0, '2021-04-03 02:39:32', '2021-04-03 02:39:32');

-- --------------------------------------------------------

--
-- Table structure for table `users_balance`
--

CREATE TABLE `users_balance` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` float(20,4) NOT NULL DEFAULT '0.0000',
  `assets` float(20,4) NOT NULL DEFAULT '0.0000',
  `ib` float(20,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users_balance`
--

INSERT INTO `users_balance` (`id`, `user_id`, `amount`, `assets`, `ib`, `created_at`) VALUES
(1, 1, -1000.0098, 1071.4285, 2571.42, '2021-04-03 16:16:53'),
(2, 2, 14999.9902, 6741.5732, 0.00, '2021-04-03 16:14:57');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `investment_balance`
--
ALTER TABLE `investment_balance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `users_balance`
--
ALTER TABLE `users_balance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `investment_balance`
--
ALTER TABLE `investment_balance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users_balance`
--
ALTER TABLE `users_balance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users_balance`
--
ALTER TABLE `users_balance`
  ADD CONSTRAINT `users_balance_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
