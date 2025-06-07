-- Create "user_roles" table
CREATE TABLE `user_roles` (`id` integer NOT NULL, `name` varchar NOT NULL, `description` text NULL, `created_at` datetime NOT NULL, PRIMARY KEY (`id`));
-- Create index "user_roles_name" to table: "user_roles"
CREATE UNIQUE INDEX `user_roles_name` ON `user_roles` (`name`);
-- Create "users" table
CREATE TABLE `users` (`id` integer NOT NULL, `email` varchar NOT NULL, `password_hash` varchar NOT NULL, `is_active` boolean NOT NULL, `is_verified` boolean NOT NULL, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, `last_login` datetime NULL, `role_id` integer NULL, PRIMARY KEY (`id`), CONSTRAINT `0` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION);
-- Create index "users_email" to table: "users"
CREATE UNIQUE INDEX `users_email` ON `users` (`email`);
-- Create "articles" table
CREATE TABLE `articles` (`id` integer NOT NULL, `title` varchar NOT NULL, `slug` varchar NOT NULL, `content` text NOT NULL, `summary` text NULL, `category` varchar NULL, `tags` varchar NULL, `published` boolean NOT NULL, `order_index` integer NULL, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, `author_id` integer NOT NULL, PRIMARY KEY (`id`), CONSTRAINT `0` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION);
-- Create index "articles_slug" to table: "articles"
CREATE UNIQUE INDEX `articles_slug` ON `articles` (`slug`);
-- Create "posts" table
CREATE TABLE `posts` (`id` integer NOT NULL, `title` varchar NOT NULL, `slug` varchar NOT NULL, `content` text NOT NULL, `excerpt` text NULL, `image_url` varchar NULL, `published` boolean NOT NULL, `featured` boolean NOT NULL, `view_count` integer NOT NULL, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, `published_at` datetime NULL, `author_id` integer NOT NULL, PRIMARY KEY (`id`), CONSTRAINT `0` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION);
-- Create index "posts_slug" to table: "posts"
CREATE UNIQUE INDEX `posts_slug` ON `posts` (`slug`);
-- Create "quizzes" table
CREATE TABLE `quizzes` (`id` integer NOT NULL, `title` varchar NOT NULL, `slug` varchar NOT NULL, `description` text NULL, `is_active` boolean NOT NULL, `passing_score` integer NOT NULL, `time_limit_minutes` integer NULL, `max_attempts` integer NULL, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, `created_by_id` integer NOT NULL, PRIMARY KEY (`id`), CONSTRAINT `0` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION);
-- Create index "quizzes_slug" to table: "quizzes"
CREATE UNIQUE INDEX `quizzes_slug` ON `quizzes` (`slug`);
-- Create "user_profiles" table
CREATE TABLE `user_profiles` (`id` integer NOT NULL, `user_id` integer NOT NULL, `first_name` varchar NULL, `last_name` varchar NULL, `bio` text NULL, `location` varchar NULL, `website` varchar NULL, `github_username` varchar NULL, `linkedin_url` varchar NULL, `avatar_url` varchar NULL, `timezone` varchar NULL, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, PRIMARY KEY (`id`), CONSTRAINT `0` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE);
-- Create index "user_profiles_user_id" to table: "user_profiles"
CREATE UNIQUE INDEX `user_profiles_user_id` ON `user_profiles` (`user_id`);
-- Create "user_progress" table
CREATE TABLE `user_progress` (`id` integer NOT NULL, `total_quizzes_completed` integer NOT NULL, `total_quizzes_passed` integer NOT NULL, `total_articles_read` integer NOT NULL, `current_streak_days` integer NOT NULL, `longest_streak_days` integer NOT NULL, `total_points` integer NOT NULL, `level` integer NOT NULL, `last_activity_date` datetime NULL, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, `user_id` integer NOT NULL, PRIMARY KEY (`id`), CONSTRAINT `0` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION);
-- Create index "user_progress_user_id" to table: "user_progress"
CREATE UNIQUE INDEX `user_progress_user_id` ON `user_progress` (`user_id`);
-- Create "quiz_completions" table
CREATE TABLE `quiz_completions` (`id` integer NOT NULL, `score` integer NOT NULL, `total_questions` integer NOT NULL, `correct_answers` integer NOT NULL, `time_spent_minutes` integer NULL, `passed` boolean NOT NULL, `attempt_number` integer NOT NULL, `completed_at` datetime NOT NULL, `user_id` integer NOT NULL, `quiz_id` integer NOT NULL, PRIMARY KEY (`id`), CONSTRAINT `0` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION, CONSTRAINT `1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION);
-- Create "quiz_questions" table
CREATE TABLE `quiz_questions` (`id` integer NOT NULL, `question_text` text NOT NULL, `question_type` varchar NOT NULL, `options` text NULL, `correct_answer` text NOT NULL, `explanation` text NULL, `points` integer NOT NULL, `order_index` integer NOT NULL, `created_at` datetime NOT NULL, `quiz_id` integer NOT NULL, PRIMARY KEY (`id`), CONSTRAINT `0` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE);
