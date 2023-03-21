const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

const checkAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // Bearer ....
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        if (user) {
          req.user = user;
          next();
        }
      } catch (err) {
        res.status(401).json({
          errors: [
            {
              message: 'Invalid/Expired token'
            }
          ],
          data: null
        });
      }
    } else {
      res.status(401).json({
        errors: [
          {
            message: 'Authentication token must be \'Bearer [token]'
          }
        ],
        data: null
      });
    }
  } else {
    res.status(401).json({
      errors: [
        {
          message: 'Authorization header must be provided'
        }
      ],
      data: null
    });
  }
};

module.exports = checkAuthenticated