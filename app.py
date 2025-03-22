from fastapi import FastAPI
from kubernetes import client, config

app = FastAPI()

# Load kubeconfig
config.load_kube_config()

@app.get("/")
def home():
    return {"message": "Kubernetes Cluster Health API"}

@app.get("/metrics")
def get_cluster_metrics():
    v1 = client.CoreV1Api()
    nodes = v1.list_node()

    metrics = []
    for node in nodes.items:
        node_name = node.metadata.name
        status = "Ready" if any(status.type == "Ready" and status.status == "True" for status in node.status.conditions) else "Not Ready"

        metrics.append({
            "Node Name": node_name,
            "Status": status,
            "CPU Usage (cores)": 5,  # Mock value (replace with actual metric collection)
            "Memory Usage (MB)": 1024  # Mock value
        })

    return metrics
