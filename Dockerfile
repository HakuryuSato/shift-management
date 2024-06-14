# ベースイメージはNode,バージョンはコンテナ構築時の最新
FROM node:20

# 作業ディレクトリを設定 *デフォルトはルート
# WORKDIR /src/app
WORKDIR /web

# 必要なファイルをコピー
COPY package* ./
# 依存関係をインストール
RUN npm install
COPY public ./public
COPY src ./src

# プロジェクトファイルをコピー
COPY . .

# ポート3000を公開
EXPOSE 3000


# 開発サーバーを起動
# CMD [ "npm", "run", "dev:watch" ]
# CMD ["npm", "run", "start:watch"]
CMD ["npm", "run", "dev"]



# CMD ["npx", "chokidar", ".", "-c", "node app.js", "-i", "node_modules"]
# CMD ["npx", "nodemon", "--watch", ".", "app.js"]