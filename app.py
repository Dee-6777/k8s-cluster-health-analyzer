from fastapi import FastAPI
from code_1 import get_node_health, get_pod_health

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Kubernetes Cluster Health API"}

@app.get("/nodes")
def node_metrics():
    node_health = get_node_health()
    return [
        {
            "Node Name": n[0],
            "Status": n[1],
            "CPU Capacity": n[2],
            "CPU Usage": n[3],
            "Memory Capacity": n[4],
            "Memory Usage": n[5]
        }
        for n in node_health
    ]

@app.get("/pods")
def pod_metrics():
    pod_health = get_pod_health()
    return [
        {
            "Namespace": p[0],
            "Pod Name": p[1],
            "Status": p[2],
            "CPU Usage (nanos)": p[3],
            "Memory Usage (KiB)": p[4]
        }
        for p in pod_health
    ]