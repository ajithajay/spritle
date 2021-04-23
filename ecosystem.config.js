module.exports = {
	apps: [
		{
      name: "Spritle Test",
			script: "server.js",
      out_file: "/root/.pm2/logs/spritle-test/out.log",
			error_file: "/root/.pm2/logs/spritle-test/err.log",
      env: {
        COMMON_VARIABLE: "true",
      },
      env_production: {
        NODE_ENV: "production",
      },
      log_date_format: "YYYY-MM-DD HH:mm Z",
		}
	],

	deploy: {
		production: {
			user: "root",
			host: "dev.ajithr.com",
			ref: "origin/master",
			repo: "git@github.com:ajithajay/spritle.git",
			path: "/root/apps/spritle-test",
			"pre-deploy-local": "",
			"post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js --env production",
			"pre-setup": ""
		}
	}
}
