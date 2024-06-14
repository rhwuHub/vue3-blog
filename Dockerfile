# 使用 Node.js 18.16.0 镜像作为构建阶段
FROM node:18.16.0 AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 或 yarn.lock 文件
COPY package.json package-lock.json* yarn.lock* ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建项目
RUN npm run build-only

# 使用 Nginx 镜像作为运行阶段
FROM nginx:alpine

# 删除默认的 Nginx 网站配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义的 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d

# 复制构建的文件到 Nginx 的 HTML 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
