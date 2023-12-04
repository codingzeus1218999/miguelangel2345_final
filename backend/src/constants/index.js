const MONGODB_URL = "mongodb://127.0.0.1:27017/miguelangel2345";
const FRONTEND_URL = "http://localhost:3010";
const BACKEND_URL = "http://localhost:5000";
const SECRET = "miguelangel2345";
const EXPIRESTIME = "2h";
const EXPIRESFOREVERTIME = "365d";

const VERIFICATION_MAIL_ADDRESS = "rayanbrooks102@gmail.com";
const VERIFICATION_MAIL_PASSWORD = "vmsmxagtzqddmvtw";

const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const TWITCH_USER_URL = "https://api.twitch.tv/helix/users";
const TWITCH_CLIENT_ID = "rxxe7g6k46ychf0q9oinm19f7a0paj";
const TWITCH_CLIENT_SECRET = "xyt6fiybcsftp9brvow63rem2jpite";
const TWITCH_REDIRECT_URI = `${FRONTEND_URL}/profile`;

export default {
  MONGODB_URL,
  FRONTEND_URL,
  BACKEND_URL,
  SECRET,
  EXPIRESTIME,
  EXPIRESFOREVERTIME,
  VERIFICATION_MAIL_ADDRESS,
  VERIFICATION_MAIL_PASSWORD,
  TWITCH_TOKEN_URL,
  TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET,
  TWITCH_REDIRECT_URI,
  TWITCH_USER_URL,
};
