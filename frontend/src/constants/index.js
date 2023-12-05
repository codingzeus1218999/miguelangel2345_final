const FRONTEND_URL = "http://localhost:3010";
const BACKEND_URL = "http://localhost:5000";
const API_URL = `${BACKEND_URL}/api`;
const AVATAR_DIR = `${BACKEND_URL}/avatars`;
const ITEM_DIR = `${BACKEND_URL}/items`;
const KICK_API_URL = "https://kick.com/api/v2/channels";
const TWITCH_CLIENT_ID = "rxxe7g6k46ychf0q9oinm19f7a0paj";
const TWITCH_REDIRECT_URL = `${FRONTEND_URL}/profile`;
const TWTICH_TRANSFER_RATE = 1.45;

export default {
  BACKEND_URL,
  API_URL,
  AVATAR_DIR,
  KICK_API_URL,
  ITEM_DIR,
  TWITCH_CLIENT_ID,
  TWITCH_REDIRECT_URL,
  TWTICH_TRANSFER_RATE,
};
