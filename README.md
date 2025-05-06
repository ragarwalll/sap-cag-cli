# CLI Tool for SAP BTP Full-Stack Applications

[![NPM Version](https://img.shields.io/npm/v/@ragarwal06/create-sap-fs-app)](https://www.npmjs.com/package/@ragarwal06/create-sap-fs-app)  [![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A zero-config CLI tool to scaffold full-stack SAP Business Technology Platform (BTP) applications in minutes. Supports UI5 or React frontends and Node.js or Spring Boot backends, with ready-to-use deployment descriptors.

## 🚀 Features

- Generates complete project boilerplates:
  - UI5 or React frontend  
  - Node.js or Spring Boot backend  
- Auto-configured `package.json` / `pom.xml`, VS Code launch & task files
- Predefined deployment descriptors: `mta.yaml`, `xs-app.json`, etc.
- Extensible via a plugin API or direct CLI flags
- Out-of-the-box integration with common SAP BTP services
- Consistent conventions for faster team onboarding

## 🎯 Prerequisites

- Node.js ≥ 14.19  
- npm, yarn, or pnpm  
- (Optional) SAP BTP CLI (`@sap/cli`) & Cloud Foundry CLI (`cf`) to deploy 

## ⚙️ Installation & Usage

Invoke the generator using your preferred package manager’s `create` command. This downloads and runs the latest CLI without global install.

### npm

```bash
npm create @ragarwal06/sap-fs-app@latest
```

### yarn

```bash
yarn create @ragarwal06/sap-fs-app@latest
```

### pnpm

```bash
pnpm create @ragarwal06/sap-fs-app@latest
```

## 📋 Usage

After running the `create` command, follow the interactive prompts:

1. Project name, namespace, and package type  
2. Frontend choice: UI5 or React  
3. Backend choice: Node.js or Spring Boot  
4. Select additional SAP BTP services (e.g., Connectivity, XSUAA, HANA)  
5. Review dependency versions and confirm  

The generator creates a new directory containing:

- `package.json` or `pom.xml`  
- Scaffolded UI5/React frontend code  
- Scaffolded Node.js/Spring Boot backend code
- Deployment descriptors (`mta.yaml`, `xs-app.json`, etc.)  


## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
