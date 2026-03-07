CREATE TABLE IF NOT EXISTS `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`passwordHash` text NOT NULL,
	`createdAt` text NOT NULL,
	`plan` text DEFAULT 'free',
	`questionsToday` integer DEFAULT 0,
	`lastQuestionDate` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `users_email_unique` ON `users` (`email`);
--> statement-breakpoint
ALTER TABLE `chats` ADD COLUMN `userId` text;
