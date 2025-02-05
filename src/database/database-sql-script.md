# Database Script

## Script for create table

```sql
CREATE TABLE "users" (
  email VARCHAR(255) PRIMARY KEY UNIQUE NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  img_file_name TEXT,
  balance BIGINT DEFAULT 0 NOT NULL
);

CREATE TABLE "banners" (
  id SERIAL PRIMARY KEY,
  banner_name VARCHAR(255) NOT NULL,
  banner_image VARCHAR(255),
  description TEXT
);

CREATE TABLE "services" (
  service_code VARCHAR(100) UNIQUE PRIMARY KEY NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  service_icon VARCHAR(255),
  service_tarif BIGINT NOT NULL
);

CREATE TABLE "transactions" (
  invoice_number varchar(255) PRIMARY key not null,
  user_email varchar(255) not null,
  total_amount BIGINT not null,
  description text not null,
  is_top_up boolean not null,
  service_code varchar(100),
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (user_email) REFERENCES "User"(email) ON DELETE CASCADE
);

CREATE TABLE "references" (
  code varchar(255) PRIMARY key not null,
  name varchar(255) not null,
  value text not null,
  description text
);

```
