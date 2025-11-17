import { User } from '../models/user.models.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { emailVerificationMail, sendEmail } from '../utils/mail.js';
const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(503, 'Something went wrong while generating access tokens');
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password, role } = req.body;

  const existedUser = await User.findOne({
    $or: [
      {
        username,
        email,
      },
    ],
  });
  if (existedUser) {
    return new ApiError(407, 'User already exists!!', []);
  }

  const user = await User.create({
    username,
    email,
    fullname,
    password,
    isEmailverified: false,
  });

  const { hashedToken, unHasedToken, tokenExpiry } = user.generateTemporaryToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: 'Verify your email',
    mailgenContent: emailVerificationMail(
      user?.username,
      `${req.protocol}://${req.get('host')}/api/v1/users/verify-email/${unHasedToken}`
    ),
  });

  const createdUser = User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")
  if(!createdUser) { 
    throw new ApiError(504,"User registration error")
  }
  return res
  .status(204)
  .json(
    new ApiResponse(
        200,
        {user : createdUser},
        "User Successfully created"
    )
  )

});


export {registerUser}