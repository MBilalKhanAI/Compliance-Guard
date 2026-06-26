from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI
from services.ingestion import vector_store
from core.config import settings

# --- State Definition ---
class AgentState(TypedDict):
    question: str
    context: str
    answer: str
    compliance_mode: bool
    sources: List[dict]

# --- Nodes ---

def retrieve(state: AgentState):
    """
    Retrieve documents from Vector DB
    """
    print(f"--- RETRIEVING for: {state['question']} ---")
    retriever = vector_store.as_retriever(search_kwargs={"k": 5})
    docs = retriever.invoke(state['question'])
    
    # Format context
    formatted_context = "\n\n".join(f"Content: {doc.page_content}\nSource: {doc.metadata.get('source', 'Unknown')}\nPage: {doc.metadata.get('page_label', '?')}" for doc in docs)
    
    # Extract sources for UI
    sources = []
    for doc in docs:
        sources.append({
            "file": doc.metadata.get("source"),
            "page": doc.metadata.get("page_label"),
            "content": doc.metadata.get("text", "")[:100] + "..."
        })
        
    return {"context": formatted_context, "sources": sources}

def generate(state: AgentState):
    """
    Generate answer using LLM
    """
    print("--- GENERATING ---")
    
    STRICT_SYSTEM_PROMPT = """You are ComplianceGuard, a strict regulatory assistant. 
    Answer the user's question based ONLY on the following context. 
    If the answer is not in the context, say "Insufficient regulatory context found."
    You MUST cite your sources at the end of the answer in the format [File: Page].
    Do not hallucinate or use outside knowledge.
    
    Context:
    {context}
    """
    
    CONVERSATIONAL_SYSTEM_PROMPT = """You are ComplianceGuard, a helpful regulatory assistant.
    Answer the user's question using the following context. 
    You can be more conversational and helpful, but still prioritize the provided context.
    Cite your sources if possible.
    
    Context:
    {context}
    """
    
    system_prompt = STRICT_SYSTEM_PROMPT if state.get("compliance_mode", True) else CONVERSATIONAL_SYSTEM_PROMPT
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("user", "{question}")
    ])
    
    llm = ChatOpenAI(
        model="gpt-4o",
        temperature=0,
        api_key=settings.OPENAI_API_KEY
    )
    
    chain = prompt | llm | StrOutputParser()
    answer = chain.invoke({"context": state["context"], "question": state["question"]})
    
    return {"answer": answer}

# --- Graph Definition ---
workflow = StateGraph(AgentState)

# Add Nodes
workflow.add_node("retrieve", retrieve)
workflow.add_node("generate", generate)

# Set Entry Point
workflow.set_entry_point("retrieve")

# Add Edges
workflow.add_edge("retrieve", "generate")
workflow.add_edge("generate", END)

# Compile
app = workflow.compile()
