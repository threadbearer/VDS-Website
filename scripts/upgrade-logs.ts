import * as fs from "fs";
import * as path from "path";

function replaceLogs(dir: string) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceLogs(fullPath);
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      const content = fs.readFileSync(fullPath, "utf-8");
      if (content.includes("console.log")) {
        const newContent = content.replace(/console\.log/g, "console.info");
        fs.writeFileSync(fullPath, newContent);
        console.info(`Upgraded logs in ${fullPath}`);
      }
    }
  }
}

replaceLogs(path.join(process.cwd(), "src/lib"));
replaceLogs(path.join(process.cwd(), "src/app/api"));
