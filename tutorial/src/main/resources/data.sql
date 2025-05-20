INSERT INTO category(name) VALUES ('Eurogames');
INSERT INTO category(name) VALUES ('Ameritrash');
INSERT INTO category(name) VALUES ('Familiar');

INSERT INTO author(name, nationality) VALUES ('Alan R. Moon', 'US');
INSERT INTO author(name, nationality) VALUES ('Vital Lacerda', 'PT');
INSERT INTO author(name, nationality) VALUES ('Simone Luciani', 'IT');
INSERT INTO author(name, nationality) VALUES ('Perepau Llistosella', 'ES');
INSERT INTO author(name, nationality) VALUES ('Michael Kiesling', 'DE');
INSERT INTO author(name, nationality) VALUES ('Phil Walker-Harding', 'US');

INSERT INTO game(title, age, category_id, author_id) VALUES ('On Mars', '14', 1, 2);
INSERT INTO game(title, age, category_id, author_id) VALUES ('Aventureros al tren', '8', 3, 1);
INSERT INTO game(title, age, category_id, author_id) VALUES ('1920: Wall Street', '12', 1, 4);
INSERT INTO game(title, age, category_id, author_id) VALUES ('Barrage', '14', 1, 3);
INSERT INTO game(title, age, category_id, author_id) VALUES ('Los viajes de Marco Polo', '12', 1, 3);
INSERT INTO game(title, age, category_id, author_id) VALUES ('Azul', '8', 3, 5);

INSERT INTO customer(name) VALUES ('Antonio');
INSERT INTO customer(name) VALUES ('Magdalena');
INSERT INTO customer(name) VALUES ('Carlos');
INSERT INTO customer(name) VALUES ('Luis');
INSERT INTO customer(name) VALUES ('Nerea');
INSERT INTO customer(name) VALUES ('Pablo');

INSERT INTO borrow( game_id, customer_id, start_date, finish_date) VALUES ( 1, 1,'2025-04-03', '2025-04-14');
INSERT INTO borrow( game_id, customer_id, start_date, finish_date) VALUES ( 2, 2,'2025-04-05', '2025-04-13');
INSERT INTO borrow( game_id, customer_id, start_date, finish_date) VALUES ( 3, 1,'2025-04-10', '2025-04-15');
INSERT INTO borrow( game_id, customer_id, start_date, finish_date) VALUES ( 6, 5,'2025-04-04', '2025-04-14');
INSERT INTO borrow( game_id, customer_id, start_date, finish_date) VALUES ( 3, 4,'2025-04-05', '2025-04-09');
INSERT INTO borrow( game_id, customer_id, start_date, finish_date) VALUES ( 5, 6,'2025-04-06', '2025-04-12');