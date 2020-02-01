.PHONY: prepare
prepare:
	cd quiz-app/src && npm install

.PHONY: lint
lint:
	cd quiz-app/src && npm run lint

.PHONY: serve
serve:
	cd quiz-app/src && npm run start

.PHONY: build
build:
	cd quiz-app/src && npm run build

.PHONY: build-gh-pages
build-gh-pages:
	cd quiz-app/src && npm run build -- --prod --base-href "https://${USERNAME}.github.io/${REPOSITORY_NAME}/"

.PHONY: local-deploy
local-deploy:
	npm install -g angular-cli-ghpages
	$(MAKE) build-gh-pages USERNAME=franzdiebold REPOSITORY_NAME=ng2d-quiz-app
	angular-cli-ghpages --dir quiz-app/src/dist/quiz-app --no-silent
