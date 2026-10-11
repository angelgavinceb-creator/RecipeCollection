-- =====================================================================
-- Esquema inicial de RecipeCollection
-- Postgres solo ejecuta este archivo cuando el volumen de datos está vacío.
-- =====================================================================
 
create table users (
	id serial primary key,
	username varchar(30),
	email varchar(255) unique,
	password varchar(500),
	created_at timestamptz default now()
);
 
create table recipes (
	id serial primary key,
	user_id int references users (id) on delete cascade,
	title varchar(50),
	description text,
	prep_time int,
	difficulty int check (difficulty > 0 and difficulty < 4),
	servings int check (servings > 0),
	image_path text,
	created_at timestamptz default now()
);
 
create table ingredients (
	id serial primary key,
	name varchar(30)
);
 
create table recipes_ingredients (
	recipe_id int references recipes (id) on delete cascade,
	ingredient_id int references ingredients (id) on delete cascade,
	quantity numeric(10,2) check (quantity > 0),
	unit varchar(20),
	primary key (recipe_id, ingredient_id)
);
 
create table categories (
	id serial primary key,
	name varchar(50)
);
 
create table recipes_categories (
	recipe_id int references recipes (id) on delete cascade,
	category_id int references categories (id) on delete cascade,
	primary key (recipe_id, category_id)
);
 
create table favorites (
	user_id int references users (id) on delete cascade,
	recipe_id int references recipes (id) on delete cascade,
	primary key (user_id, recipe_id)
);
 
create table ratings (
	id serial primary key,
	user_id int not null references users (id) on delete cascade,
	recipe_id int not null references recipes (id) on delete cascade,
	score int not null check (score >= 1 and score <= 100),
	comment text,
	created_at timestamptz default now(),
	unique (user_id, recipe_id)
);
 
-- =====================================================================
-- Datos iniciales
-- =====================================================================
 
insert into ingredients (name) values
	('Tomate'),
	('Cebolla'),
	('Ajo'),
	('Patata'),
	('Zanahoria'),
	('Pimiento'),
	('Calabacín'),
	('Berenjena'),
	('Espinacas'),
	('Lechuga'),
	('Champiñones'),
	('Pepino'),
	('Brócoli'),
	('Coliflor'),
	('Apio'),
	('Puerro'),
	('Aceite de oliva'),
	('Mantequilla'),
	('Leche'),
	('Huevo'),
	('Harina'),
	('Azúcar'),
	('Sal'),
	('Pimienta negra'),
	('Arroz'),
	('Macarrones'),
	('Pan'),
	('Pechuga de pollo'),
	('Carne picada'),
	('Lomo de cerdo'),
	('Chorizo'),
	('Salmón'),
	('Atún'),
	('Gambas'),
	('Bacalao'),
	('Queso parmesano'),
	('Mozzarella'),
	('Queso cheddar'),
	('Yogur'),
	('Salsa de tomate'),
	('Limón'),
	('Albahaca'),
	('Perejil'),
	('Orégano'),
	('Pimentón'),
	('Comino'),
	('Garbanzos'),
	('Lentejas'),
	('Almendras'),
	('Miel'),
	('Agua'),
	('Vinagre'),
	('Nata'),
	('Caldo de verduras'),
	('Caldo de pollo'),
	('Jamón serrano'),
	('Judías verdes'),
	('Guisantes'),
	('Maíz'),
	('Aceitunas'),
	('Nueces'),
	('Canela'),
	('Chocolate negro'),
	('Levadura'),
	('Espaguetis'),
	('Tofu');
 
insert into categories (name) values
	('Vegano'),
	('Vegetariano'),
	('Postre'),
	('Sin gluten'),
	('Desayuno'),
	('Entrante'),
	('Plato principal'),
	('Sopa'),
	('Ensalada'),
	('Merienda');