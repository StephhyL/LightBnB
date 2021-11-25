const {Pool} = require('pg');

const properties = require('./json/properties.json');
const users = require('./json/users.json');


const pool = new Pool ({
  user: 'vagrant',
  password: '123',
  port: 5432,
  database: 'lightbnb'
}
)


pool
  .connect()
  .then(() => {
    console.log("Yay, connected!")
  })
  .catch((err) => {
    console.log("Oh no! Error!");
    console.log(err.message);
  })




/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {

  const queryString = 
  `
  SELECT * 
  FROM users
  WHERE users.email = $1
  `
  const value = [email]

  return pool
    .query(queryString, value)
    .then((res)=>{
      return res.rows[0];
    })
    .catch(() => {
      return null;
    })

  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {

  const queryString = 
  `
  SELECT * 
  FROM users
  WHERE users.id = $1
  `
  const value = [id]

  return pool
  .query(queryString, value)
  .then((res)=>{
    return res.rows[0];
  })
  .catch(() => {
    return null;
  })

  //return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = (user) => {

  const insertString = 
  `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;
  const value = [user.name, user.email, user.password];

  return pool
    .query(insertString, value)
    .then((res) => {
      const newUser = {
        id: res.rows.id,
        name: res.rows.name,
        email: res.rows.email,
        password: res.rows.password
      }
      return newUser;
    })
    .catch((err) => {
      console.error(error.message);
    })

  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = (guest_id, limit = 10) => {

  const reservationQuery = 
  `
  SELECT * 
  FROM properties
  JOIN reservations
  ON property_id = properties.id
  WHERE guest_id = $1
  AND start_date >  now()::date
  LIMIT $2
  `
  const value = [guest_id,limit]

  return pool
    .query(reservationQuery, value)
    .then((res)=> {
      console.log(res.rows)
      return res.rows
    })
    .catch((err)=>{
      console.error(err.message)
    })

  //return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = (options, limit = 10) => {

  const queryParams = [];

  let queryString = 
  `
  SELECT properties.*,
  AVG(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `WHERE owner_id = $${queryParams.length}`
  }

  if (options.city) {
    queryParams.push(`%${options.city}%`)
    queryString += ` WHERE city LIKE $${queryParams.length}`
  }

  if(options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    options.city ? queryString += ` AND` : queryString += ` WHERE`;
    queryString += ` cost_per_night >= $${queryParams.length}`
  }


  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    options.city || options.minimum_price_per_night? queryString += ` AND` : queryString += ` WHERE`;
    queryString += ` cost_per_night <= $${queryParams.length}`
  }

  queryString += ` GROUP BY properties.id`

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += ` HAVING AVG(property_reviews.rating) >= $${queryParams.length}`
  }

  queryParams.push(limit);
  queryString += 
  `
  LIMIT $${queryParams.length};
  `

  console.log("queryString---->", queryString);
  console.log("queryParams---->", queryParams);

  return pool
    .query(queryString, queryParams)
    .then((result)=> result.rows)
    .catch((err) => console.log(err.message))
  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = (property) => {

  let insertNames = 'owner_id'
  const values = [property.owner_id];
  
  if (property.title) {
    insertNames += ", title"
    values.push(property.title)
  }

  if (property.description) {
    insertNames += ", description"
    values.push(property.description);
  }
  
  if (property.thumbnail_photo_url) {
    insertNames += ", thumbnail_photo_url"
    values.push(property.thumbnail_photo_url);
  }

  if (property.cover_photo_url) {
    insertNames += ", cover_photo_url"
    values.push(property.cover_photo_url);
  }

  if (property.cost_per_night) {
    insertNames += ", cost_per_night"
    values.push(property.cost_per_night);
  }

  if (property.parking_spaces) {
    insertNames += ", parking_spaces"
    values.push(property.parking_spaces);
  }

  if (property.number_of_bathrooms) {
    insertNames += ", number_of_bathrooms"
    values.push(property.number_of_bathrooms);
  }

  if (property.number_of_bedrooms) {
    insertNames += ", number_of_bedrooms"
    values.push(property.number_of_bedrooms);
  } 

  if (property.country) {
    insertNames += ", country"
    values.push(property.country);
  } 

  if (property.street) {
    insertNames += ", street"
    values.push(property.street);
  } 

  if (property.city) {
    insertNames += ", city"
    values.push(property.city);
  } 

  if (property.province) {
    insertNames += ", province"
    values.push(property.province);
  } 

  if (property.post_code) {
    insertNames += ", post_code"
    values.push(property.post_code);
  } 

  const insertValues = () => {
    let stringValue = "";
    for (let i=1; i <= values.length; i++) {
      stringValue += `$${i}`;
      (i !== values.length) ? stringValue += ", ": stringValue
    }
    return stringValue;
  }

  const insertString = 
  `
  INSERT INTO properties (${insertNames})
  VALUES(${insertValues()})
  RETURNING *
  `

  console.log("insertString---->", insertString);
  console.log("value array---->", values);

  return pool
    .query (insertString, values)
    .then(res => res.rows)
    .catch((err) => {
      console.error(err.message);
      return err.message;
    })

  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
}
exports.addProperty = addProperty;
