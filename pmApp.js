module.exports = {
  apps: [{
    name: "fpa-backend",
    script: "ts-node",
    args: "-T app/index.ts",
    instances: "max",
    watch: true,
    ignore_watch: ["node_modules", "sqls"],
    env: {
      "production": true,
    },
    PORT: 3000,
  }]
}
