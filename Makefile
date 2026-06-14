.PHONY: lint deploy

lint:
	@python3 scripts/lint.py && echo "All lint checks passed."

deploy:
	vercel --prod
	@echo "--- Post-deploy verification ---"
	@curl -sf https://brtinc.vercel.app | grep -q 'hero-reel' \
	  && echo "OK: hero-reel present" \
	  || echo "WARN: hero-reel not found — check deployment"
	@curl -sf https://brtinc.vercel.app | grep -q 'particle-canvas' \
	  && echo "OK: particle-canvas present" \
	  || echo "WARN: particle-canvas not found — check deployment"
	@curl -sf https://brtinc.vercel.app | grep -q 'cam-enable' \
	  && echo "OK: hand-tracking button present" \
	  || echo "WARN: cam-enable not found — check deployment"
