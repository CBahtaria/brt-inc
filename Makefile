.PHONY: lint deploy verify

LIVE_URL ?= https://brt-inc.vercel.app

lint:
	@python3 scripts/lint.py && echo "All lint checks passed."

deploy:
	vercel --prod
	@echo "--- Post-deploy verification ---"
	@echo "Waiting 15s for cert / propagation..."
	@sleep 15
	@$(MAKE) verify

verify:
	@echo "Checking $(LIVE_URL)..."
	@curl -sfL --compressed --max-time 20 $(LIVE_URL) > /tmp/brtinc-verify.html \
	  && echo "OK: $(LIVE_URL) reachable, $$(wc -c < /tmp/brtinc-verify.html) bytes" \
	  || (echo "FAIL: $(LIVE_URL) unreachable" && exit 1)
	@grep -q 'hero-reel' /tmp/brtinc-verify.html \
	  && echo "OK: hero-reel present" \
	  || echo "WARN: hero-reel not found — check deployment"
	@grep -q 'particle-canvas' /tmp/brtinc-verify.html \
	  && echo "OK: particle-canvas present" \
	  || echo "WARN: particle-canvas not found — check deployment"
	@grep -q 'Safety-critical software' /tmp/brtinc-verify.html \
	  && echo "OK: institutional hero copy present" \
	  || echo "WARN: institutional hero copy not found — check deployment"
	@grep -q 'brt-practice-selector' /tmp/brtinc-verify.html \
	  && echo "OK: practice-areas InteractiveSelector mount present" \
	  || echo "WARN: practice-areas mount not found — check deployment"
