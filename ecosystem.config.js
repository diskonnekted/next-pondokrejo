// ecosystem.config.js
module.exports = {
    apps: [
        {
            name: "app", // The name of your application
            script: "node_modules/next/dist/bin/next", // The script to run
            args: "start", // Arguments for the script
            instances: "4", // Launch 32 instances as CPU cores
            exec_mode: "cluster", // Enable cluster mode
            autorestart: true, // Restart the app if it crashes
            watch: false, // Do not watch for file changes (we handle builds manually)
            max_memory_restart: "8G", // Restart if it exceeds 1GB of memory
            env: {
                NODE_ENV: "production",
                PORT: 5091,
            },
        },
    ],
};
