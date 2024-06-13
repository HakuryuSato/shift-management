# ベースイメージはNode,バージョンはコンテナ構築時の最新
FROM node:20

# 作業ディレクトリを設定
WORKDIR /

# 必要なファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# プロジェクトファイルをコピー
COPY . .

# ポート3000を公開
EXPOSE 3000

# 開発サーバーを起動
CMD ["npm", "run", "dev"]
# CMD ["npx", "chokidar", ".", "-c", "node app.js", "-i", "node_modules"]
# CMD ["npx", "nodemon", "--watch", ".", "app.js"]