import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "invalid credential" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking user already exists or not
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    // Send congratulatory email
    const subject = "Welcome to F1 Success Hub!";
const text = `Dear ${name},\n\nCongratulations on taking the first step towards your F1 visa journey with F1 Success Hub! We are delighted to welcome you to our platform, where your success is our mission.\n\nAs a member, you’ll have access to expert guidance throughout your F1 visa process, including personalized advice from our experienced former visa officers. Our team is here to ensure you are fully prepared and confident every step of the way.\n\nWhat’s next? Explore our platform to find exclusive resources, tips, and support tailored to help you achieve your academic and career goals in the United States.\n\nShould you have any questions, feel free to reach out to our support team anytime. We’re excited to be part of your journey to success!\n\nWarm regards,\n\nThe F1 Success Hub Team\nEmail: f1successhub@gmail.com\nPhone: +977-9764558713`;


    await sendEmail({ to: email, subject, text });

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = (req, res) => {
  try{

    const {email, password} = req.body;
    
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
      const token = createToken(email);
      res.json({success: true, token});
    } else {
      res.json({success: false, message: "Invalid credentials"});

    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin };
