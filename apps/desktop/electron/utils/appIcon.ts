import path from 'path';
import fs from 'fs';

export function getAppIconPath(): string | undefined {
  const candidatePaths = [
    path.join(__dirname, '../../assets/icon.png'),
    path.join(__dirname, '../assets/icon.png'),
    path.join(__dirname, '../../public/freedom.png'),
    path.join(__dirname, '../../public/icon.png'),
    path.join(process.cwd(), 'assets/icon.png'),
    path.join(process.cwd(), 'public/freedom.png'),
    path.join(process.cwd(), 'public/icon.png'),
    path.join(process.cwd(), 'apps/desktop/assets/icon.png'),
    path.join(process.cwd(), 'apps/desktop/public/freedom.png'),
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return undefined;
}
