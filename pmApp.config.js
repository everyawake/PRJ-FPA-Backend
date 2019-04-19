module.exports = {
  apps: [{
    name: "fpa",
    script: "app/index.ts",
    watch: true,
    ignore_watch: ["node_modules", "sqls"],
    env: {
      production: true,
      "NODE_ENV": true,
      "SENDGRID_API_KEY": process.env.SENDGRID_API_KEY,
      "MYSQL_ADDR": process.env.MYSQL_ADDR,
      "MYSQL_USER": process.env.MYSQL_USER,
      "MYSQL_PWD": process.env.MYSQL_PWD,
    },
  }]
}
