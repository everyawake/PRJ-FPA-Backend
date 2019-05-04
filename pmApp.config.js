module.exports = {
  apps: [{
    name: "fpa",
    script: "ts-node",
    args: "--files app/index.ts",
    watch: true,
    ignore_watch: ["node_modules", "sqls"],
    env: {
      production: true,
      PORT: 80,
      "NODE_ENV": "production",
      "SENDGRID_API_KEY": process.env.SENDGRID_API_KEY,
      "MYSQL_ADDR": process.env.MYSQL_ADDR,
      "MYSQL_USER": process.env.MYSQL_USER,
      "MYSQL_PWD": process.env.MYSQL_PWD,
      "FPA_SIGN_KEY": process.env.FPA_SIGN_KEY
    },
  }]
}
