CREATE TABLE channels ( channel_id serial PRIMARY KEY, channel VARCHAR(255) NOT NULL );

CREATE TABLE members ( member_id serial PRIMARY KEY, channel_id INT NOT NULL, username VARCHAR(255) NOT NULL, order INT NOT NULL );

CREATE TABLE reviews ( assignment_id, channel_id, member_id )