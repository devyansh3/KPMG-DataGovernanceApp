const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const StoreUserDao = require("../dao/storeUserDao");
const {
  SECRET_KEY,
  ERROR_MESSAGES,
  STATUS_CODES,
} = require("../utils/constants");

// Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "username" },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const storeUsers = await StoreUserDao.getStoreUsersByFilter(
            { userId: user._id },
            true
          );
          if (!storeUsers || storeUsers.length === 0) {
            return res
              .status(STATUS_CODES.NOT_FOUND)
              .json({ message: ERROR_MESSAGES.INVALID_REQUEST });
          }
          const userWithoutPassword = user.toObject();
          delete userWithoutPassword.password;
          return done(null, { ...userWithoutPassword, stores: storeUsers });
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        function (req, res) {
          var token = null;
          if (req && req.cookies) {
            token = req.cookies["token"];
          }
          return token;
        },
      ]),
      secretOrKey: SECRET_KEY,
    },
    async (token, done) => {
      try {
        // console.log("PASSPORT 1, token", token?.username);
        const user = await User.findOne({ username: token.username });

        // console.log("PASSPORT 2, user", user);
        if (!user) {
          const customError = new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
          customError.status = STATUS_CODES.UNAUTHORIZED;
          return done(customError);
        }

        const storeUsers = await StoreUserDao.getStoreUsersByFilter(
          { userId: user._id },
          true
        );
        if (!storeUsers || storeUsers.length === 0) {
          return res
            .status(STATUS_CODES.NOT_FOUND)
            .json({ message: ERROR_MESSAGES.INVALID_REQUEST });
        }
        return done(null, { ...user.toObject(), stores: storeUsers });
      } catch (error) {
        if (error) {
          return done(error);
        }
      }
    }
  )
);

module.exports = passport;
