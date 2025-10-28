# Playwright Workshop Makefile
#
# This Makefile provides convenient commands for managing the Playwright workshop.
# It includes commands for slides, demo app, and development workflows.

# Default target
.DEFAULT_GOAL := help

# Variables
NODE_MODULES := node_modules
DEMO_DIR := demo-app
DEMO_NODE_MODULES := $(DEMO_DIR)/node_modules

# Help target - shows available commands
.PHONY: help
help: ## Show this help message
	@echo "Playwright Workshop - Available Commands:"
	@echo ""
	@echo "Usage:"
	@echo "  make <target>"
	@echo ""
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_0-9%-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Install dependencies for both main project and demo app
.PHONY: install
install: ## Install all project dependencies
	@echo "Installing main project dependencies..."
	npm install
	@echo "Installing demo app dependencies..."
	cd $(DEMO_DIR) && npm install

# Run the main slides in development mode
.PHONY: slides
slides: $(NODE_MODULES) ## Start the slides in development mode
	npx slidev --open

# Run the workshop version of slides
.PHONY: slides-workshop
slides-workshop: $(NODE_MODULES) ## Start the workshop version of slides
	npx slidev slides.workshop.md --open

# Run the meetup version of slides
.PHONY: slides-meetup
slides-meetup: $(NODE_MODULES) ## Start the meetup version of slides
	npx slidev slides.meetup.md --open

# Build the slides for production
.PHONY: build-slides
build-slides: $(NODE_MODULES) ## Build the main slides for production
	npx slidev build

# Build the workshop version of slides
.PHONY: build-workshop
build-workshop: $(NODE_MODULES) ## Build the workshop version of slides
	npx slidev build slides.workshop.md

# Build the meetup version of slides
.PHONY: build-meetup
build-meetup: $(NODE_MODULES) ## Build the meetup version of slides
	npx slidev build slides.meetup.md

# Export slides to PDF
.PHONY: export
export: $(NODE_MODULES) ## Export main slides to PDF
	npx slidev export --output exports/slides-export.pdf

# Export the workshop version to PDF
.PHONY: export-workshop
export-workshop: $(NODE_MODULES) ## Export workshop slides to PDF
	npx slidev export slides.workshop.md --output exports/slides.workshop-export.pdf

# Export the meetup version to PDF
.PHONY: export-meetup
export-meetup: $(NODE_MODULES) ## Export meetup slides to PDF
	npx slidev export slides.meetup.md --output exports/slides.meetup-export.pdf

# Export all slide versions to PDF
.PHONY: export-all
export-all: $(NODE_MODULES) ## Export all slide versions to PDF
	npx slidev export --output exports/slides-export.pdf
	npx slidev export slides.workshop.md --output exports/slides.workshop-export.pdf
	npx slidev export slides.meetup.md --output exports/slides.meetup-export.pdf

# Start the demo application
.PHONY: demo
demo: $(DEMO_NODE_MODULES) ## Start the demo application
	cd $(DEMO_DIR) && npm start

# Start the demo application in development mode
.PHONY: demo-dev
demo-dev: $(DEMO_NODE_MODULES) ## Start the demo application in development mode
	cd $(DEMO_DIR) && npm run dev

# Start both slides and demo application (in background)
.PHONY: all
all: $(NODE_MODULES) $(DEMO_NODE_MODULES) ## Start both slides and demo application
	@echo "Starting demo application in background..."
	cd $(DEMO_DIR) && npm start &
	@echo "Starting slides in development mode..."
	npx slidev --open

# Clean up built assets and node_modules
.PHONY: clean
clean: ## Clean up built assets and node_modules
	rm -rf dist/
	rm -rf $(DEMO_DIR)/dist/
	@echo "Cleaned up built assets"

# Clean up everything including node_modules
.PHONY: distclean
distclean: ## Clean up everything including node_modules
	rm -rf node_modules/
	rm -rf dist/
	rm -rf $(DEMO_DIR)/node_modules/
	rm -rf $(DEMO_DIR)/dist/
	@echo "Cleaned up everything including node_modules"

# Check if node_modules exists for main project
$(NODE_MODULES): package.json
	@echo "Installing main project dependencies..."
	npm install
	@touch $(NODE_MODULES)

# Check if demo app node_modules exists
$(DEMO_NODE_MODULES): $(DEMO_DIR)/package.json
	@echo "Installing demo app dependencies..."
	cd $(DEMO_DIR) && npm install
	@touch $(DEMO_NODE_MODULES)

# Lint the project (if linters are configured)
.PHONY: lint
lint: $(NODE_MODULES) ## Lint the project files
	@echo "No linter configured by default. Install and configure ESLint/Prettier as needed."

# Run tests (if testing setup exists)
.PHONY: test
test: $(NODE_MODULES) ## Run tests
	@echo "No tests configured by default. Add Playwright tests as needed for the demo app."