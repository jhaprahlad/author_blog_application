const mongoose = require("mongoose")

const authorSchema = new mongoose.Schema({ //creting a Schema for author model
  fname: {
    type: String,
    required: [true, "fname is required"],
    minLength:[2,"fname must contain atleast two letters"], 
    maxLength:[60,"maximum length for fname exceeded"],
    trim: true,
    validate: {
      validator: function (value) {
        const nameRegex = /^[A-Za-z\s]+$/;
        return nameRegex.test(value);
      },
      message: 'Name should only contain only alphabets.'
    }
  },

  lname: {
    type: String,
    required: [true, "lname is required"],
    trim: true,
    minLength:[2,"lname must contain atleast two letters"], 
    maxLength:[60,"maximum length for lname exceeded"],
    validate: {
      validator: function (value) {
        const nameRegex = /^[A-Za-z\s]+$/;
        return nameRegex.test(value);
      },
      message: 'Name should only contain only alphabets'
    }
  },

  title: {
    type: String,
    required: [true, "title is required"],
    enum: {
      values: ["Mr", "Mrs", "Miss"],
      message: "{VALUE} is not a valid title"
    }
  },

  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
      },
      message: "{VALUE} is not a valid email"
    }
  },
  
  password: {
    type: String,
    minLength: [4,"password should be at least 4 characters"],
    required: [true, "Password is necessary"],
    trim: true,
    validate: {
      validator: function (value) {
        return !/\s/.test(value);   // this regex for no space in password 
      },
      message: 'Password should not contain any spaces.'
    }
  }

}, { timestamps: true })

//exporting author model
module.exports = mongoose.model("Author", authorSchema)



//{ fname: { mandatory}, lname: {mandatory}, title: {mandatory, enum[Mr, Mrs, Miss]}, email: {mandatory, valid email, unique}, password: {mandatory} }