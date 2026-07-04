#!/usr/bin/env bash
# Set brtinc.dev DNS records on Namecheap for Vercel.
# Usage: NC_USER=youruser NC_KEY=yourapikey bash namecheap-dns.sh
set -euo pipefail

NC_USER="${NC_USER:?Set NC_USER=your_namecheap_username}"
NC_KEY="${NC_KEY:?Set NC_KEY=your_namecheap_api_key}"
CLIENT_IP="$(curl -s https://api.ipify.org)"
API="https://api.namecheap.com/xml.response"

echo "Public IP: $CLIENT_IP  (must be whitelisted in Namecheap API settings)"
echo "Setting DNS for brtinc.dev ..."

RESPONSE=$(curl -s "$API" \
  --data-urlencode "ApiUser=$NC_USER" \
  --data-urlencode "ApiKey=$NC_KEY" \
  --data-urlencode "UserName=$NC_USER" \
  --data-urlencode "ClientIp=$CLIENT_IP" \
  --data-urlencode "Command=namecheap.domains.dns.setHosts" \
  --data-urlencode "SLD=brtinc" \
  --data-urlencode "TLD=dev" \
  --data-urlencode "HostName1=@" \
  --data-urlencode "RecordType1=A" \
  --data-urlencode "Address1=76.76.21.21" \
  --data-urlencode "TTL1=300" \
  --data-urlencode "HostName2=www" \
  --data-urlencode "RecordType2=CNAME" \
  --data-urlencode "Address2=cname.vercel-dns.com" \
  --data-urlencode "TTL2=300")

echo "$RESPONSE"

if echo "$RESPONSE" | grep -q 'Status="OK"'; then
  echo ""
  echo "DNS records set successfully."
  echo "  @   A     76.76.21.21"
  echo "  www CNAME cname.vercel-dns.com"
  echo ""
  echo "Propagation typically takes 5-30 minutes."
  echo "Verify: dig brtinc.dev +short"
else
  echo ""
  echo "ERROR: Check API response above."
  exit 1
fi
