const router = require("express").Router();
const {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../controllers/authControllers");

router.post("/refresh-token", verifyRefreshToken, (req, res) => {
  try {
    const user = req.user;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);


    res.json({
      accessToken,
      refreshToken,

    });
  } catch (error) {
    switch (error) {
      case error instanceof jwt.TokenExpiredError:


        res.status(403).json({
          message: "Refresh token expired!",

        });


        break;

      case error instanceof jwt.JsonWebTokenError:
        res.status(401).json({
          message: "Invalid refresh token!",


        });
        break;

      default:
        res.status(500).json({
          message: error.message,

        });

        break;
    }
  }
});


module.exports = router;
