module.exports = {
  apps: [{
    name: "fpa-backend",
    script: "app/index.ts",
    instances: "max",
    watch: true,
    ignore_watch: ["node_modules", "sqls"],
    env: {
      "production": true,
    },
    PORT: 80,
  }]
}
