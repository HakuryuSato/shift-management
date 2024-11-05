const dotenv = require('dotenv');
const path = require('path');

// 環境変数ファイルのパスを指定
const envPath = path.resolve(__dirname, '.env.local');

// 環境変数をロード
dotenv.config({ path: envPath });
