const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err.name === 'ValidationError') {
      const errors = {};
      Object.keys(err.errors).forEach(key => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).json({ errors });
    }
  
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ 
        error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }
  
    res.status(500).json({ message: 'Something went wrong!' });
  };
  
  module.exports = { errorHandler };