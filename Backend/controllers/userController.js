const User = require('../models/userModel')
const bcrypt = require("bcryptjs")
const validateUser = require('../services/userValidation')
const jwt = require('jsonwebtoken')

async function register(req,res) {
    try { 

      console.log("Body:", req.body);
        console.log("File:", req.file);

         if (!req.file) {
            return res.status(400).send({success: false,msg: "Please upload image",});
        }
        const validation = await validateUser(req.body)
            if (!validation.success) {
            return res.status(400).send(validation);
        }
    let{name,email,password, contactNumber,role} = req.body

        const existingUser = await User.findOne({email:email})
        if(existingUser){
            return res.status(400).send({success:false, msg:"User already exists..."})
        }

        password = await bcrypt.hash(password,8)
        let imgPath = `/uploads/users/${req.file.filename}`;


        const newUser = await User.create({name, email, password, contactNumber,role,imgPath})
        console.log(newUser)
        await newUser.save()

        res.status(200).send({success:true, msg:"Successfully Registered..."})

    }catch (error) {
        console.log(error.message)
        res.status(500).send({msg:"Server Error"})
    }
}

// let existingUser
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).send({
        success: false,
        msg: "User does not exist",
      });
    }

    const isPassCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPassCorrect) {
      return res.status(401).send({
        success: false,
        msg: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "72h" }
    );

    res.status(200).send({
      success: true,
      msg: "Logged in successfully",
      token,
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    res.status(500).send({
      success: false,
      msg: error.message,
    });
  }
};

const getUserInfo = async(req,res) =>{
    try{
        console.log("************", req.user)


        const loggedUser = await User.findById(req.user.id,{password:0,createdAt:0,updatedAt:0})


    // Convert Sequelize instance to plain object
        const userData = loggedUser.toObject();

        // Update image path
        if (userData.imgPath) {
            userData.imgPath = `http://localhost:7005${userData.imgPath}`;
        }

        console.log(userData);
        res.status(200).send({loggedUser:userData,success:true})

        } catch (error) {
        res.status(500).send({msg:"Server error", success:false})
    }
}
const updateProfile = async (req, res) => {
  try {
    const { name, contactNumber } = req.body;

    const updateData = {
      name,
      contactNumber,
    };

    // If user uploads a new image
    if (req.file) {
      updateData.imgPath = `/uploads/users/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).send({
        success: false,
        msg: "User not found",
      });
    }

    // Update image URL
    if (updatedUser.imgPath) {
      updatedUser.imgPath = `http://localhost:5000${updatedUser.imgPath}`;
    }

    res.status(200).send({
      success: true,
      msg: "Profile updated successfully",
      updatedUser,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      msg: "Server error",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, {
      password: 0,
      __v: 0
    });

    res.status(200).send({
      success: true,
      users
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      msg: "Server error"
    });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).send({
        success: false,
        msg: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).send({
        success: false,
        msg: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 8);

    user.password = hashedPassword;

    await user.save();

    res.status(200).send({
      success: true,
      msg: "Password changed successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      msg: "Server error",
    });
  }
};
const totalNumberOfUsers = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();

    res.status(200).send({
      success: true,
      totalUsers,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      msg: "Server error",
    });
  }
};

module.exports = {
    register, login , getUserInfo, updateProfile,getAllUsers,changePassword,totalNumberOfUsers
}