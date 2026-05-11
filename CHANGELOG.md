# [1.1.0](https://github.com/Berea-Soft/Nexa-Calendar/compare/v1.0.0...v1.1.0) (2026-05-11)


### Bug Fixes

* add --no-build flag to Vercel deployment commands ([c3b85ac](https://github.com/Berea-Soft/Nexa-Calendar/commit/c3b85ac75d8212913a81d3d900a1315d235bb052))
* remove --archive option from Vercel deployment commands ([31041af](https://github.com/Berea-Soft/Nexa-Calendar/commit/31041af7561f8a9e31815aeef8b9b8210fb8bd53))
* remove --prebuilt flag from Vercel deployment commands ([55999e1](https://github.com/Berea-Soft/Nexa-Calendar/commit/55999e1570b8654520d103a855f021d84f6bdf4a))
* remove build skip options from Vercel deployment commands ([bc04dfa](https://github.com/Berea-Soft/Nexa-Calendar/commit/bc04dfac395fff31b7a59692a479366fc5f4542e))
* restore rewrites configuration in Vercel deployment settings ([dd6e463](https://github.com/Berea-Soft/Nexa-Calendar/commit/dd6e463add0aadec99a6e8210413059e5c353690))
* update package versions in Sandpack custom setup to use 'latest' ([33af035](https://github.com/Berea-Soft/Nexa-Calendar/commit/33af035894068fb7d239d936438f846b7334fbe9))
* update Sandpack integration and adjust custom setup for dependencies ([0f702d0](https://github.com/Berea-Soft/Nexa-Calendar/commit/0f702d05b3105b3fa33b9487961fcff8fd32ccb5))
* update Vercel deployment commands to specify correct paths and options ([ad0c4ee](https://github.com/Berea-Soft/Nexa-Calendar/commit/ad0c4ee9572ddd7b5d0edbbe4657055dc35373cd))
* update Vercel deployment commands to specify output directory and commands ([25d74ab](https://github.com/Berea-Soft/Nexa-Calendar/commit/25d74abf21de1e11a5d91869451a09a446bcb761))
* update Vercel deployment commands to use --ignore-build-step ([532a48d](https://github.com/Berea-Soft/Nexa-Calendar/commit/532a48d0a7acc14f4dadd1100ef0cb18d6c4bede))
* update Vercel deployment commands to use environment variable for skipping build ([1b624d6](https://github.com/Berea-Soft/Nexa-Calendar/commit/1b624d67091644586ad5eeb4a87c6c3cc929fa6c))
* update Vercel deployment steps in GitHub Actions workflow ([ef70601](https://github.com/Berea-Soft/Nexa-Calendar/commit/ef7060145ad2fc219cafbea09c0163862ea1791b))


### Features

* add initial Vercel configuration file ([8588db1](https://github.com/Berea-Soft/Nexa-Calendar/commit/8588db10ebd64c7206a42ded6f3b6d3495f6a59f))
* **demos2:** use @codesandbox/sandpack-react and latest packages ([e488074](https://github.com/Berea-Soft/Nexa-Calendar/commit/e4880740afb1bf47820f5112f7c7dd0d47719b05))
* **demos:** replace Sandpack with StackBlitz SDK ([4ca4dd5](https://github.com/Berea-Soft/Nexa-Calendar/commit/4ca4dd59f82f440e9769b9d3ca5c8f3b153fa164))
* update Demos2Page with StackBlitz integration and refactor code ([cb1d3bc](https://github.com/Berea-Soft/Nexa-Calendar/commit/cb1d3bcd41391b73ca137cd859cc2d03e09fb9fc))

# 1.0.0 (2026-05-11)

### Bug Fixes

- add --yes flag to Vercel deployment command for automatic confirmation ([1ea223c](https://github.com/Berea-Soft/Nexa-Calendar/commit/1ea223c9cc7f3b76857ecc2285e9601cf7a3ac27))
- add newline at end of vercel.json file ([f04be57](https://github.com/Berea-Soft/Nexa-Calendar/commit/f04be57185466ddf4e1e35c5a6cda7778dab04e9))
- increase chunkSizeWarningLimit to 800 in vite.config.ts ([46e4206](https://github.com/Berea-Soft/Nexa-Calendar/commit/46e42068feb887556aeb711022b06d2db3f52009))
- rename NPM_TOKEN to NODE_AUTH_TOKEN in publish workflow ([ff0bae7](https://github.com/Berea-Soft/Nexa-Calendar/commit/ff0bae70f2000429421d5e85b254388a05e418a1))
- revert version number to 0.1.0 in package.json ([ff591fe](https://github.com/Berea-Soft/Nexa-Calendar/commit/ff591fee2d675e1b3a610287360da3e4be3e5b20))
- simplify arrow function syntax in update-versions script ([6f34831](https://github.com/Berea-Soft/Nexa-Calendar/commit/6f34831da47bf9197e475906512697450fb7d06a))
- standardize manualChunks function formatting in vite.config.ts ([d793b6f](https://github.com/Berea-Soft/Nexa-Calendar/commit/d793b6fba5b65fa5d1dc3bbd1c905ed5a0f3f100))
- update Node.js version to 22 and remove rootDir from tsconfig files ([2837a06](https://github.com/Berea-Soft/Nexa-Calendar/commit/2837a06cd7648261ffd9440230422ee5574b88f4))
- update Vercel deployment step and configure NPM registry in publish workflow ([062b217](https://github.com/Berea-Soft/Nexa-Calendar/commit/062b2179658dec66df9049f1eb08b6687c614ed3))

### Features

- add Angular, React, Svelte, Vue wrappers for Nexa-Calendar ([99d4ff1](https://github.com/Berea-Soft/Nexa-Calendar/commit/99d4ff11c555fef00e8684e9358c1e7f526c3819))
- add semantic-release for automated versioning and publishing ([60587ac](https://github.com/Berea-Soft/Nexa-Calendar/commit/60587ac329be50028f5f78723c9d50b6faa23516))
- initialize monorepo structure with pnpm, TypeScript, and Turbo ([f389c77](https://github.com/Berea-Soft/Nexa-Calendar/commit/f389c77694e9419c6c151ffc35c63e8ca8c65cfa))
- **ui:** add NxYearView component for displaying yearly calendar view ([de88357](https://github.com/Berea-Soft/Nexa-Calendar/commit/de88357c1dc1e0629bbe737e2ebc0da1a7c31966))
