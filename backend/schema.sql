-- Generated schema for UnderdogDevs backend
-- Auto-generated from SQLAlchemy models


CREATE TABLE user_roles (
	id INTEGER NOT NULL, 
	name VARCHAR(50) NOT NULL, 
	description TEXT, 
	created_at DATETIME NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (name)
)

;


CREATE TABLE users (
	id INTEGER NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	password_hash VARCHAR(255) NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	is_verified BOOLEAN NOT NULL, 
	created_at DATETIME NOT NULL, 
	updated_at DATETIME NOT NULL, 
	last_login DATETIME, 
	role_id INTEGER, 
	PRIMARY KEY (id), 
	UNIQUE (email), 
	FOREIGN KEY(role_id) REFERENCES user_roles (id)
)

;


CREATE TABLE articles (
	id INTEGER NOT NULL, 
	title VARCHAR(255) NOT NULL, 
	slug VARCHAR(255) NOT NULL, 
	content TEXT NOT NULL, 
	summary TEXT, 
	category VARCHAR(100), 
	tags VARCHAR(500), 
	published BOOLEAN NOT NULL, 
	order_index INTEGER, 
	created_at DATETIME NOT NULL, 
	updated_at DATETIME NOT NULL, 
	author_id INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (slug), 
	FOREIGN KEY(author_id) REFERENCES users (id)
)

;


CREATE TABLE posts (
	id INTEGER NOT NULL, 
	title VARCHAR(255) NOT NULL, 
	slug VARCHAR(255) NOT NULL, 
	content TEXT NOT NULL, 
	excerpt TEXT, 
	image_url VARCHAR(500), 
	published BOOLEAN NOT NULL, 
	featured BOOLEAN NOT NULL, 
	view_count INTEGER NOT NULL, 
	created_at DATETIME NOT NULL, 
	updated_at DATETIME NOT NULL, 
	published_at DATETIME, 
	author_id INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (slug), 
	FOREIGN KEY(author_id) REFERENCES users (id)
)

;


CREATE TABLE quizzes (
	id INTEGER NOT NULL, 
	title VARCHAR(255) NOT NULL, 
	slug VARCHAR(255) NOT NULL, 
	description TEXT, 
	is_active BOOLEAN NOT NULL, 
	passing_score INTEGER NOT NULL, 
	time_limit_minutes INTEGER, 
	max_attempts INTEGER, 
	created_at DATETIME NOT NULL, 
	updated_at DATETIME NOT NULL, 
	created_by_id INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (slug), 
	FOREIGN KEY(created_by_id) REFERENCES users (id)
)

;


CREATE TABLE user_profiles (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	first_name VARCHAR(100), 
	last_name VARCHAR(100), 
	bio TEXT, 
	location VARCHAR(100), 
	website VARCHAR(255), 
	github_username VARCHAR(100), 
	linkedin_url VARCHAR(255), 
	avatar_url VARCHAR(500), 
	timezone VARCHAR(50), 
	created_at DATETIME NOT NULL, 
	updated_at DATETIME NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (user_id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
)

;


CREATE TABLE user_progress (
	id INTEGER NOT NULL, 
	total_quizzes_completed INTEGER NOT NULL, 
	total_quizzes_passed INTEGER NOT NULL, 
	total_articles_read INTEGER NOT NULL, 
	current_streak_days INTEGER NOT NULL, 
	longest_streak_days INTEGER NOT NULL, 
	total_points INTEGER NOT NULL, 
	level INTEGER NOT NULL, 
	last_activity_date DATETIME, 
	created_at DATETIME NOT NULL, 
	updated_at DATETIME NOT NULL, 
	user_id INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (user_id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
)

;


CREATE TABLE quiz_completions (
	id INTEGER NOT NULL, 
	score INTEGER NOT NULL, 
	total_questions INTEGER NOT NULL, 
	correct_answers INTEGER NOT NULL, 
	time_spent_minutes INTEGER, 
	passed BOOLEAN NOT NULL, 
	attempt_number INTEGER NOT NULL, 
	completed_at DATETIME NOT NULL, 
	user_id INTEGER NOT NULL, 
	quiz_id INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id), 
	FOREIGN KEY(quiz_id) REFERENCES quizzes (id)
)

;


CREATE TABLE quiz_questions (
	id INTEGER NOT NULL, 
	question_text TEXT NOT NULL, 
	question_type VARCHAR(50) NOT NULL, 
	options TEXT, 
	correct_answer TEXT NOT NULL, 
	explanation TEXT, 
	points INTEGER NOT NULL, 
	order_index INTEGER NOT NULL, 
	created_at DATETIME NOT NULL, 
	quiz_id INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
)

;

-- Total tables: 9
