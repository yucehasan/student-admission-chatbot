from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain import PromptTemplate
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.llms import CTransformers
from langchain.chains import RetrievalQA
import uvicorn
import logging
import asyncio

# Initialize FastAPI app
app = FastAPI(title="Condor Bot API")

# Configure logging
logging.basicConfig(level=logging.INFO)

# Define FAISS database path
DB_FAISS_PATH = "vectorstores/db_faiss/"

# Define prompt template
custom_prompt_template = '''Use the following pieces of information to answer the user's question. 
If you don't know the answer, please just say that you don't know the answer. Don't make up an answer.

Context:{context}
Question:{question}

Only return the helpful answer below and nothing else.
Helpful answer:
'''

# Request model
class QueryRequest(BaseModel):
    query: str

def set_custom_prompt():
    """Creates a prompt template for QA retrieval"""
    return PromptTemplate(template=custom_prompt_template, input_variables=['context', 'question'])

def load_llm():
    """Loads the Llama 2 model optimized for CPU usage"""
    try:
        return CTransformers(
            model="llama-2-7b-chat.ggmlv3.q8_0.bin",
            model_type="llama",
            max_new_tokens=256,
            temperature=0.5,
            gpu_layers=0  # Force CPU usage
        )
    except Exception as e:
        logging.error(f"Failed to load LLM: {e}")
        raise RuntimeError("Failed to load language model.")

def retrieval_qa_chain(llm, prompt, db):
    """Creates a RetrievalQA chain"""
    try:
        return RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=db.as_retriever(search_kwargs={'k': 2}),
            return_source_documents=True,
            chain_type_kwargs={'prompt': prompt}
        )
    except Exception as e:
        logging.error(f"Failed to initialize RetrievalQA chain: {e}")
        raise RuntimeError("Error creating retrieval QA chain.")

def qa_bot():
    """Initializes the QA bot with FAISS and LLM"""
    try:
        embeddings = HuggingFaceEmbeddings(
            model_name='sentence-transformers/all-MiniLM-L6-v2',
            model_kwargs={'device': 'cpu'}
        )

        # Load FAISS vector store
        db = FAISS.load_local(DB_FAISS_PATH, embeddings, allow_dangerous_deserialization=True)

        # Load LLM
        llm = load_llm()
        
        # Set custom prompt
        qa_prompt = set_custom_prompt()
        
        # Create retrieval chain
        return retrieval_qa_chain(llm, qa_prompt, db)
    except Exception as e:
        logging.error(f"QA bot initialization failed: {e}")
        raise RuntimeError("Error setting up QA system.")

# Load the model once when the API starts
try:
    qa_chain = qa_bot()
except Exception as e:
    logging.error(f"Critical Error: {e}")
    qa_chain = None  # Prevent API from crashing if the model fails to load

@app.post("/ask")
async def get_answer(request: QueryRequest):
    """API endpoint to get an answer from the LLM"""
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    if qa_chain is None:
        raise HTTPException(status_code=503, detail="QA system is not available. Try again later.")

    try:
        # Set timeout for model response (e.g., 10 seconds)
        response = await asyncio.wait_for(asyncio.to_thread(qa_chain, {'query': request.query}), timeout=120)

        if not response or "result" not in response:
            raise HTTPException(status_code=500, detail="Received an empty response.")

        return {"answer": response["result"]}
    except asyncio.TimeoutError:
        logging.warning(f"Query timed out: {request.query}")
        raise HTTPException(status_code=504, detail="The request took too long to process.")
    except Exception as e:
        logging.error(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred while processing your request.")

# Run the FastAPI server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

