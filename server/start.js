// start.js
const { exec } = require("child_process");

// Прогоняем миграции
exec("npx sequelize-cli db:migrate", (err, stdout, stderr) => {
  if (err) {
    console.error("❌ Ошибка при миграции:", stderr);
    process.exit(1);
  }
  console.log("✅ Миграции выполнены:\n", stdout);

  // Запускаем nodemon
  const nodemon = exec("node node_modules/nodemon/bin/nodemon.js index.js");
  nodemon.stdout.pipe(process.stdout);
  nodemon.stderr.pipe(process.stderr);
});
