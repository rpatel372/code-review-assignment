CREATE TABLE channels ( channel_id serial PRIMARY KEY, channel VARCHAR(255) NOT NULL, rotation_type VARCHAR(255) NOT NULL );

CREATE TABLE repos ( repo_id serial PRIMARY KEY, channel_id INT NOT NULL, repo VARCHAR(2000) NOT NULL );

CREATE TABLE members ( member_id serial PRIMARY KEY, channel_id INT NOT NULL, user_id VARCHAR(255) NOT NULL, user_order INT NOT NULL );

CREATE TABLE reviews ( assignment_id, channel_id, member_id )