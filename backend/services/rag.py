from core.graph import app
import time

async def generate_answer(query: str, compliance_mode: bool):
    start_time = time.time()
    
    # Invoke LangGraph Workflow
    inputs = {
        "question": query,
        "compliance_mode": compliance_mode,
        "context": "",
        "answer": "",
        "sources": []
    }
    
    result = app.invoke(inputs)
    
    latency = time.time() - start_time
    
    return {
        "answer": result["answer"],
        "sources": result.get("sources", []),
        "latency": latency
    }
