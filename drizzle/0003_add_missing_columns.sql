ALTER TABLE `messages` ADD COLUMN `backendId` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `messages` ADD COLUMN `query` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `messages` ADD COLUMN `createdAt` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `messages` ADD COLUMN `responseBlocks` text DEFAULT '[]';
--> statement-breakpoint
ALTER TABLE `messages` ADD COLUMN `status` text DEFAULT 'answering';
--> statement-breakpoint
ALTER TABLE `chats` ADD COLUMN `sources` text DEFAULT '[]';
