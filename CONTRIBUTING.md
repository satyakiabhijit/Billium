# Contributing to Billium

First off, thank you for considering contributing to Billium! It's people like you that make Billium such a great tool for freelancers and small businesses around the world.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

*   **Use the GitHub issue search** — check if the issue has already been reported.
*   **Check if the issue has been fixed** — try to reproduce it using the latest `main` branch.
*   **Provide clear steps to reproduce** — explain exactly how to reproduce the bug. Include any relevant screenshots if you are experiencing a UI issue.

### Suggesting Enhancements

If you have a feature request or an idea to improve Billium:

*   **Use the GitHub issue search** to see if it has already been suggested.
*   Provide a clear and detailed explanation of the feature you want.
*   Explain why this enhancement would be useful to most Billium users.

### Pull Requests

1.  **Fork the repo** and create your branch from `main`.
2.  If you've added code that should be tested, add tests.
3.  If you've changed APIs, update the documentation.
4.  Ensure the test suite passes (`npm run test`).
5.  Make sure your code lints (`npm run lint`).
6.  Issue that pull request!

## Setting Up Your Local Development Environment

Billium is built with React, Electron, Node.js, and TypeScript. To get started locally:

### Prerequisites

*   [Node.js](https://nodejs.org/) v18+ (v20+ recommended)
*   [npm](https://www.npmjs.com/) v9+
*   Git

### Installation

1.  Clone your fork of the repository:
    ```bash
    git clone https://github.com/YOUR_USERNAME/Billium.git
    cd Billium
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the App

Billium has two main modes:

1.  **Desktop Mode (Electron):**
    ```bash
    npm run dev
    ```
    This launches the standalone Electron desktop application.

2.  **Web Mode (Self-Hosted Webserver):**
    ```bash
    npm run dev:webserver
    ```
    This launches the Express API and Vite development server for the browser at `http://127.0.0.1:5173`.

## Architecture Overview

Billium features a **Dual-Mode API Layer**. The React frontend is completely agnostic to whether it is running inside Electron or a web browser. 

All data operations should be routed through the `getApi()` helper (located in `src/renderer/shared/api/platformApi.ts`), which automatically uses:
*   `window.electronAPI` (IPC calls) when in Electron.
*   `fetch()` REST calls when in the browser.

When adding a new CRUD operation, you must implement it in:
1.  **The shared service layer** (`src/backend/shared/services/`)
2.  **The IPC handlers** for Electron (`src/backend/main/ipc/`)
3.  **The REST endpoints** for Web (`src/backend/webserver/routes/`)
4.  **The API interface** (`src/backend/shared/types/api.ts`)

## Styleguides

### Git Commit Messages

*   Use the present tense ("Add feature" not "Added feature").
*   Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
*   Limit the first line to 72 characters or less.
*   Reference issues and pull requests liberally after the first line.

### TypeScript / React

*   We use functional components and React Hooks exclusively.
*   Prefer `type` over `interface` unless you specifically need declaration merging.
*   Avoid `any`; be as strict as possible with typings.

Thank you for contributing! 🚀
