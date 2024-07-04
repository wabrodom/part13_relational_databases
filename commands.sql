CREATE TABLE BLOGS(	
	id SERIAL PRIMARY KEY,
	author text,
	url text NOT NULL,
	title text NOT NULL,
	likes integer DEFAULT 0
);


INSERT INTO blogs (url, title) 
values ('https://bookishbrews.com/', 'Bookish Brews');

INSERT INTO blogs (url, title, likes) 
values ('www.crimebookjunkie.co.uk', 'CrimeBookJunkie', 5);

