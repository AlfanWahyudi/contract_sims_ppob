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
  service_tariff BIGINT NOT NULL
);

CREATE TABLE "transactions" (
  invoice_number varchar(255) PRIMARY key not null,
  user_email varchar(255) not null,
  total_amount BIGINT not null,
  description text not null,
  is_top_up boolean not null,
  service_code varchar(100),
  created_on TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (user_email) REFERENCES "users"(email) ON DELETE CASCADE
);

```

## Seeder

Table banners

```sql

INSERT INTO banners (banner_name, banner_image, description) VALUES ('Banner 1', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');
INSERT INTO banners (banner_name, banner_image, description) VALUES ('Banner 2', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');
INSERT INTO banners (banner_name, banner_image, description) VALUES ('Banner 3', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');
INSERT INTO banners (banner_name, banner_image, description) VALUES ('Banner 4', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');
INSERT INTO banners (banner_name, banner_image, description) VALUES ('Banner 5', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');
INSERT INTO banners (banner_name, banner_image, description) VALUES ('Banner 6', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');

```

Table services

```sql
INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES ('PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000);
INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES ('PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000);
INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES ('PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 40000);
INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES ('PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000);
INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES ('PGN', 'PGN Berlanggana', 'https://nutech-integrasi.app/dummy.jpg', 50000);
INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES ('MUSIK', 'Musik Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000);
INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES ('TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000);
INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES ('PAKET_DATA', 'Paket data', 'https://nutech-integrasi.app/dummy.jpg', 50000);
INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES ('VOUCHER_GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 100000);
INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES ('VOUCHER_MAKANAN', 'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', 100000);
INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES ('QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 200000);
INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES ('ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 300000);
```
