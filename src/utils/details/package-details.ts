import path from 'path';
import fs from 'fs-extra';
import { type PackageJson } from 'type-fest';
import { CLI_DIR } from '@/utils/constants/dir.js';

export const getPackageVersion = () => {
    let packageManagerPath = path.join(CLI_DIR, 'package.json');

    // for windows
    packageManagerPath = packageManagerPath.replace('file:\\', '');

    // for linux
    // for mac
    packageManagerPath = packageManagerPath.replace('file:', '');

    const packageManagerContent = fs.readJSONSync(
        packageManagerPath,
    ) as PackageJson;
    return packageManagerContent?.version ?? '1.0.0';
};
