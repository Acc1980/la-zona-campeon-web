module.exports = {
  apps: [
    {
      name: "la-zona-campeon",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001",
      cwd: "/var/www/la-zona-campeon",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        TIKTOK_CLIENT_KEY: "sbaw6h4cvqjd2map27",
        TIKTOK_CLIENT_SECRET: "G4wD85zz1fNuozNFryD4qGIv5nMuDIkQ",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      error_file: "/var/log/pm2/la-zona-campeon-error.log",
      out_file: "/var/log/pm2/la-zona-campeon-out.log",
    },
  ],
};
