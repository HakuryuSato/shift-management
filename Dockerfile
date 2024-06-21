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
# ENV NEXT_PUBLIC_SUPABASE_URL="https://ixwfsfgjvipedpzpxiwv.supabase.co"
# ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4d2ZzZmdqdmlwZWRwenB4aXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg3MTQyNTYsImV4cCI6MjAzNDI5MDI1Nn0._ZoEqO1VxgiC_hMZZ7jcwd1e5ehK0Ac7bac6S2wgdkk"

# 開発サーバーを起動
# CMD [ "npm", "run", "dev:watch" ]
# CMD ["npm", "run", "start:watch"]
CMD ["npm", "run", "dev"]



# CMD ["npx", "chokidar", ".", "-c", "node app.js", "-i", "node_modules"]
# CMD ["npx", "nodemon", "--watch", ".", "app.js"]