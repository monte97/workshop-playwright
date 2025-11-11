.PHONY: help slides slides-open slides-presenter slides-export slides-build demo demo-dev demo-docker clean install

# Default target
help: ## Show this help message
	@echo "Available targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Slide commands
slides: ## Start the slides in development mode
	cd slides && npx slidev slides.md

slides-open: ## Start the slides and open browser automatically
	cd slides && npx slidev slides.md --open

slides-presenter: ## Start the slides in presenter mode
	cd slides && npx slidev slides.md --open --presenter

slides-export: ## Export slides to PDF
	cd slides && npx slidev export slides.md

slides-build: ## Build slides for production
	cd slides && npx slidev build slides.md

# Demo application commands
demo: ## Start the demo application
	cd demo-app && npm start

demo-dev: ## Start the demo app in development mode (with nodemon)
	cd demo-app && npx nodemon server.js

demo-docker: ## Start the demo app with Docker
	cd demo-app && docker-compose up -d

# Utility commands
install: ## Install project dependencies
	npm install
	cd demo-app && npm install

clean: ## Clean up built assets
	rm -rf exports/
	cd demo-app && rm -rf node_modules/
	cd slides && rm -rf node_modules/