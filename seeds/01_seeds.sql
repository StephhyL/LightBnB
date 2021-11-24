INSERT INTO users (name, email, password)
VALUES 
('Jacob Jones', 'jj@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Apple Pie', 'ap@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Green Sky', 'gs@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night,parking_spaces,number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES
(2, 'Big Apple', 'This property is in the shape of an apple!', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 450, 2, 3, 3, 'Canada', 'Apple Drive', 'Colborne', 'Ontario', 'U8D 4F3', TRUE),
(2, 'Pineapple', 'This property is in the shape of a pineapple - can we consider a pineapple an apple?!', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 500, 3, 4, 4, 'Canada', 'pineapple Drive', 'Colborne', 'Ontario', 'U8D 4F3', TRUE),
(3, 'Blue', 'This property is coloured in Green but we call it ''Blue''', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 700, 1, 1, 1, 'Italy', 'Blue Drive', 'Capital of Italy', 'A Province in Italy', 'A postal code in Italy', FALSE),
(1, 'Generic', 'Just a typical home', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 150, 2, 2, 2, 'France', 'Rue', 'Paris', 'Île-de-France', '75001', FALSE);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES 
('2021-11-19', '2021-11-23', 1, 3),
('2021-08-08', '2021-09-09', 3, 2),
('2021-08-08', '2021-09-09', 2, 1),
('2021-06-06', '2021-06-12', 4, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES
(3, 1, 1, 5, 'Splendid time at the ''Big Apple''! It is truly a unquie experience. Love the architectural design of this house!'),
(2, 3, 2, 4, 'One star off because the title name and the colour of the place really tripped me off a lot. Otherwise, I highly recommend it!'),
(1, 2, 3, 4, 'Not as great of a stay as in it''s cousin''s house, the ''Big Apple'' but still a place to check out'),
(2, 4, 4, 5, 'Great bang for it''s buck')
