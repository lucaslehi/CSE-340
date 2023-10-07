-- Insert Tony Stark's recond into the table
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Modify Tony's account type to Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Delete Tony's record
DELETE FROM account
WHERE account_id = 1;

-- Modify GM Hummer description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10

-- Select the make and model of cars in the sports category
SELECT inv_make, inv_model
FROM inventory AS inv
INNER JOIN classification AS cls
ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';

-- Update images path
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
