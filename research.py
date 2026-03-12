"""Research — in-depth answers with citations from the You.com Research API."""

import os
import sys

from youdotcom import You

# take question from command line, or use a default
question = sys.argv[1] if len(sys.argv) > 1 else "What are the latest breakthroughs in quantum computing?"

# initialize the client with your API key
you = You(api_key_auth=os.environ["YDC_API_KEY"])

# run research — returns a markdown answer with inline citations
# research_effort options: "lite", "standard", "deep", "exhaustive"
response = you.research(input=question, research_effort="standard")

# print the answer
print(response.output.content)
print()

# print the sources
for i, source in enumerate(response.output.sources, 1):
    print(f"[{i}] {source.title}")
    print(f"    {source.url}")
