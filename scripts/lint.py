#!/usr/bin/env python3
"""Lint checks for brt-inc: HTML structure + auth gate presence."""
import sys
from html.parser import HTMLParser

INTERNAL_PAGES = [
    "tools.html",
    "src/crm/crm.html",
    "src/proposals/proposal-generator.html",
    "src/proposals/invoice.html",
    "src/status/status-dashboard.html",
    "src/agreements/service-agreement.html",
    "src/runbooks/runbook-templates.html",
]

VOID = {"area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"}

class StructureCheck(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []

    def handle_starttag(self, tag, attrs):
        if tag not in VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()

failed = False

# 1. HTML structure
try:
    checker = StructureCheck()
    checker.feed(open("index.html").read())
    if checker.stack:
        print(f"FAIL: index.html has unclosed tags: {checker.stack}", file=sys.stderr)
        failed = True
    else:
        print("OK  HTML structure: index.html")
except FileNotFoundError:
    print("SKIP HTML structure: index.html not found")

# 2. Auth gate on internal pages
for page in INTERNAL_PAGES:
    try:
        content = open(page).read()
        if "auth.js" in content:
            print(f"OK  auth gate: {page}")
        else:
            print(f"FAIL: {page} missing auth.js", file=sys.stderr)
            failed = True
    except FileNotFoundError:
        print(f"SKIP: {page} not found")

sys.exit(1 if failed else 0)
