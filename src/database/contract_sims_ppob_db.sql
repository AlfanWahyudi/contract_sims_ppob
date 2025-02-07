-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

COMMENT ON SCHEMA public IS 'standard public schema';

-- DROP SEQUENCE public.banners_id_seq;

CREATE SEQUENCE public.banners_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.banners_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.banners_id_seq TO postgres;
-- public.banners definition

-- Drop table

-- DROP TABLE public.banners;

CREATE TABLE public.banners (
	id serial4 NOT NULL,
	banner_name varchar(255) NOT NULL,
	banner_image varchar(255) NULL,
	description text NULL,
	CONSTRAINT banners_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.banners OWNER TO postgres;
GRANT ALL ON TABLE public.banners TO postgres;


-- public.services definition

-- Drop table

-- DROP TABLE public.services;

CREATE TABLE public.services (
	service_code varchar(100) NOT NULL,
	service_name varchar(255) NOT NULL,
	service_icon varchar(255) NULL,
	service_tariff int8 NOT NULL,
	CONSTRAINT services_pkey PRIMARY KEY (service_code)
);

-- Permissions

ALTER TABLE public.services OWNER TO postgres;
GRANT ALL ON TABLE public.services TO postgres;


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	email varchar(255) NOT NULL,
	first_name varchar(255) NOT NULL,
	last_name varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	img_file_name text NULL,
	balance int8 NOT NULL DEFAULT 0,
	CONSTRAINT users_pkey PRIMARY KEY (email)
);

-- Permissions

ALTER TABLE public.users OWNER TO postgres;
GRANT ALL ON TABLE public.users TO postgres;


-- public.transactions definition

-- Drop table

-- DROP TABLE public.transactions;

CREATE TABLE public.transactions (
	invoice_number varchar(255) NOT NULL,
	user_email varchar(255) NOT NULL,
	total_amount int8 NOT NULL,
	description text NOT NULL,
	is_top_up bool NOT NULL,
	service_code varchar(100) NULL,
	created_on timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT transactions_pkey PRIMARY KEY (invoice_number),
	CONSTRAINT transactions_user_email_fkey FOREIGN KEY (user_email) REFERENCES public.users(email) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.transactions OWNER TO postgres;
GRANT ALL ON TABLE public.transactions TO postgres;




-- Permissions

GRANT ALL ON SCHEMA public TO pg_database_owner;
GRANT USAGE ON SCHEMA public TO public;