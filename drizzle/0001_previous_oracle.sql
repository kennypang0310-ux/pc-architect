CREATE TABLE `feedbacks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`category` enum('general','bug','feature','performance','ui','other') NOT NULL,
	`message` text NOT NULL,
	`frequency` decimal(3,2),
	`feasibility` decimal(3,2),
	`impact` decimal(3,2),
	`aiAnalysis` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `feedbacks_id` PRIMARY KEY(`id`)
);
