#!/usr/bin/env node
import {
    ABORTING_INSTALLTION,
    ERROR_CONTACT,
} from '@/utils/constants/message.js';
import { renderPackageTitle } from '@/utils/render-details.js';
import { renderGenerator } from '@/cli/index.js';
import { prepareDirectoryForPackages } from '@/scaffold/index.js';
import { logger } from '@/utils/logger.js';

const renderer = async () => {
    // render package title
    renderPackageTitle();

    // get user inputs
    const metadata = await renderGenerator();
    await prepareDirectoryForPackages(metadata);

    process.exit(0);
};

renderer().catch((error) => {
    logger.error(ABORTING_INSTALLTION);
    if (error instanceof Error) logger.error(error);
    else logger.error(ERROR_CONTACT);

    process.exit(1);
});
