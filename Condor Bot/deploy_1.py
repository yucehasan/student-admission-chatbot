from langchain import PromptTemplate
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.llms import CTransformers
from langchain.chains import RetrievalQA

DB_FAISS_PATH = "vectorstores/db_faiss/"

custom_prompt_template = '''Use the following pieces of information to answer the user's question. 
If you don't know the answer, please just say that you don't know the answer. Don't make up an answer.

Context:{context}
Question:{question}

Only return the helpful answer below and nothing else.
Helpful answer:
'''

def set_custom_prompt():
    """
    Prompt template for QA retrieval for each vector store
    """
    prompt = PromptTemplate(template=custom_prompt_template, input_variables=['context', 'question'])
    return prompt


def load_llm():
    """
    Load the Llama 2 7B model optimized for CPU usage
    """
    llm = CTransformers(
        model="llama-2-7b-chat.ggmlv3.q8_0.bin",  # Ensure the model file is in the same directory
        model_type="llama",
        max_new_tokens=256,  # Reduce to optimize RAM usage
        temperature=0.5,
        gpu_layers=0  # Ensure the model runs only on CPU
    )
    return llm


def retrieval_qa_chain(llm, prompt, db):
    """
    Set up the retrieval-based QA chain with FAISS and LangChain
    """
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=db.as_retriever(search_kwargs={'k': 2}),
        return_source_documents=True,
        chain_type_kwargs={'prompt': prompt}
    )
    return qa_chain


def qa_bot():
    """
    Load FAISS database and LLM, and initialize the QA chain
    """
    embeddings = HuggingFaceEmbeddings(
        model_name='sentence-transformers/all-MiniLM-L6-v2',
        model_kwargs={'device': 'cpu'}
    )

    db = FAISS.load_local(DB_FAISS_PATH, embeddings, allow_dangerous_deserialization=True)  # Ensure safe deserialization
    llm = load_llm()
    qa_prompt = set_custom_prompt()
    qa = retrieval_qa_chain(llm, qa_prompt, db)
    return qa


def final_result(query):
    """
    Process a user query and return the final answer
    """
    try:
        qa_result = qa_bot()
        response = qa_result({'query': query})
        return response
    except Exception as e:
        print(f"Error: {e}")
        return {"result": "An error occurred while processing your query. Try a shorter input."}


# Local shell-based interaction instead of web interface
def start():
    print("Booting up the Condor bot...")

    # Initialize the bot
    qa_chain = qa_bot()

    # Keep asking for input until the user exits
    while True:
        user_query = input("Hi, welcome to the Condor bot. What is your query? (type 'exit' to quit): ")
        if user_query.lower() == 'exit':
            print("Exiting the bot. Goodbye!")
            break

        # Get the final result for the query
        result = final_result(user_query)

        # Print the answer
        print(result["result"])


if __name__ == "__main__":
    start()

