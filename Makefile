
.PHONY: serve-dev

serve-dev:
	bundle exec jekyll serve --config _config_dev.yml

serve-drafts:
	bundle exec jekyll serve --config _config_dev.yml --drafts

publish-image:
	docker buildx build --platform linux/arm64 . -f Dockerfile-mains -t benjvi/blog-arm --push

publish-solar-image:
	docker buildx build --platform linux/arm/v6 . -f Dockerfile-solar -t benjvi/blog-solar --push
