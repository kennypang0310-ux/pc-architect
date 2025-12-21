CREATE TABLE `feedbackReactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`feedbackId` int NOT NULL,
	`userId` int NOT NULL,
	`type` enum('like','dislike') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `feedbackReactions_id` PRIMARY KEY(`id`)
);
