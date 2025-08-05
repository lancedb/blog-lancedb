from ollama import chat
from ollama import ChatResponse

resp = chat(model="gpt-oss:20b", messages=[
    {"role": "user", "content": "Tell me about graph neural networks."}
])
print(resp)
