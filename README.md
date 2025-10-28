# Playwright Workshop

Welcome to the Playwright Workshop repository! This project contains educational materials and resources for learning about Playwright, a powerful browser automation library for end-to-end testing.

## Overview

This repository includes:

- **Slidev presentations** for interactive learning about Playwright
- **Demo application** for hands-on practice
- **Workshop materials** to guide you through Playwright concepts

The workshop covers:
- Core concepts of end-to-end testing
- Playwright fundamentals and best practices
- Hands-on exercises and advanced topics

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Git
- Playwright (install with `npm install --save-dev playwright-chromium` for PDF export functionality)

## Quick Start

To get started with the workshop materials:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/workshop-playwright.git
   cd workshop-playwright
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the slides locally:
   ```bash
   npm run dev
   ```

4. Start the demo application:
   ```bash
   cd demo-app
   npm install
   npm start
   ```

## Project Structure

```
workshop-playwright/
├── slides/                 # Slidev presentation files
│   ├── components/         # Reusable slide components
│   └── pages/              # Individual slide pages
├── demo-app/               # Demo application for testing
│   ├── public/             # Frontend files
│   └── server.js           # Simple server to serve the app
├── package.json            # Main project dependencies and scripts
├── slides.workshop.md      # Full workshop version slides (all content inline for PDF export)
└── slides.meetup.md        # Short meetup version slides (all content inline for PDF export)
```

## Demo Application (demo-app/)

The `demo-app/` directory contains a complete, interactive web application designed specifically for practicing Playwright testing techniques. This application serves as a practical playground to learn and experiment with various testing scenarios.

### Features of the Demo Application:

- **Registration Form**: Complete form with multiple input types (text, email, password), select dropdown, and checkboxes
- **Dynamic Content Loading**: Simulated async operations with loading states
- **Interactive Counter**: With increment, decrement, and reset functionality
- **Hidden Content**: Elements that appear conditionally to test visibility handling
- **Responsive Design**: Works across different screen sizes

### Purpose:

This demo application provides realistic testing scenarios including:

- Form filling and validation
- Button interactions
- Working with dynamic content and loading states
- Handling hidden/visible elements
- Working with different input types (text fields, dropdowns, checkboxes)
- Testing responsive behavior

### Running the Demo Application:

1. Navigate to the demo app directory:
   ```bash
   cd demo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

### Using with Playwright Tests:

This application is specifically designed to be tested with Playwright. You can create test files that:

- Fill out the registration form and submit it
- Click the "Load Data" button and verify the loaded content
- Interact with the counter controls
- Test the show/hide functionality for hidden content
- Verify different page states and transitions

## Available Scripts

### Slide Management

- `npm run dev` - Start the Slidev presentation in development mode
- `npm run build` - Build the presentation for production
- `npm run export` - Export slides to PDF
- `npm run export:workshop` - Export workshop slides to PDF
- `npm run export:meetup` - Export meetup slides to PDF
- `npm run dev:workshop` - Run the full workshop version of slides
- `npm run dev:meetup` - Run the meetup version of slides
- `npm run build:workshop` - Build the workshop version
- `npm run build:meetup` - Build the meetup version

### PDF Generation

You can export the slides to PDF format for offline viewing or sharing:

- `npm run export` - Export the default slides to PDF (exports to exports/ folder)
- `npm run export:workshop` - Export the workshop version to PDF (exports to exports/ folder)
- `npm run export:meetup` - Export the meetup version to PDF (exports to exports/ folder)
- `npx slidev export --output exports/custom-name.pdf` - Export to a custom filename in the exports folder

All exported PDFs are saved to the `exports/` directory, which is excluded from Git tracking.

### Demo Application

- Navigate to `demo-app/` directory to manage the demo app
- `npm start` - Run the demo application
- `npm run dev` - Run with nodemon for development

## Workshop Content

The workshop is structured into several key sections:

1. **Introduction** - Learn about the presenter and workshop objectives
2. **Core Concepts** - Understand different types of testing and E2E challenges
3. **Playwright Deep Dive** - Explore Playwright's features and benefits
4. **Hands-on Workshop** - Practical exercises to practice what you've learned
5. **Advanced Topics** - Techniques for parallel execution and CI integration

## Demo Application Features

The included demo application showcases various elements that can be tested with Playwright:

- Registration form with validation
- Dynamic content loading with async behavior
- Counter with increment/decrement/reset functionality
- Hidden content that appears conditionally
- Responsive design elements

## Using the Makefile

For easier management of the project, a Makefile is provided with common commands:

- `make install` - Install all project dependencies
- `make slides` - Start the slides in development mode
- `make slides-workshop` - Start the workshop version
- `make slides-meetup` - Start the meetup version
- `make demo` - Start the demo application
- `make all` - Start both slides and demo application
- `make clean` - Clean up built assets

## Contributing

Feel free to fork this repository and contribute improvements. You can:

- Add more examples to the demo application
- Create additional slide content
- Improve the workshop exercises
- Fix typos or improve explanations

## License

This project is licensed under the MIT License - see the LICENSE file for details.