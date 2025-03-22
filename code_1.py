import csv
import pandas as pd
from kubernetes import client, config

def get_node_health():
    """Fetch node health and resource usage."""
    config.load_kube_config()
    v1 = client.CoreV1Api()
    metrics_api = client.CustomObjectsApi()

    node_data = []

    print("\n🔹 Fetching Node Health & Resource Usage...")

    nodes = v1.list_node()
    for node in nodes.items:
        node_name = node.metadata.name
        status = "Ready" if any(c.status == "True" for c in node.status.conditions if c.type == "Ready") else "Not Ready"
        cpu_capacity = node.status.capacity.get("cpu", "N/A")
        mem_capacity = node.status.capacity.get("memory", "N/A")

        # Fetch resource usage from metrics.k8s.io
        try:
            node_metrics = metrics_api.get_cluster_custom_object("metrics.k8s.io", "v1beta1", "nodes", node_name)
            cpu_usage = node_metrics["usage"]["cpu"]
            mem_usage = node_metrics["usage"]["memory"]
        except Exception:
            cpu_usage, mem_usage = "N/A", "N/A"

        node_data.append([node_name, status, cpu_capacity, cpu_usage, mem_capacity, mem_usage])

    return node_data

def get_pod_health():
    """Fetch pod health and resource usage."""
    config.load_kube_config()
    v1 = client.CoreV1Api()
    metrics_api = client.CustomObjectsApi()

    pod_data = []

    print("\n🔹 Fetching Pod Health & Resource Usage...")

    pods = v1.list_pod_for_all_namespaces(watch=False)
    for pod in pods.items:
        pod_name = pod.metadata.name
        namespace = pod.metadata.namespace
        status = pod.status.phase

        # Fetch resource usage from metrics.k8s.io
        try:
            pod_metrics = metrics_api.get_namespaced_custom_object("metrics.k8s.io", "v1beta1", "default", "pods", pod_name)
            containers = pod_metrics["containers"]
            cpu_usage = sum(int(c["usage"]["cpu"].replace("n", "")) for c in containers)  # Convert nano CPUs to int
            mem_usage = sum(int(c["usage"]["memory"].replace("Ki", "")) for c in containers)  # Convert KiB to int
        except Exception:
            cpu_usage, mem_usage = "N/A", "N/A"

        pod_data.append([namespace, pod_name, status, cpu_usage, mem_usage])

    return pod_data

def save_to_csv(data, filename, headers):
    """Save data to a CSV file."""
    df = pd.DataFrame(data, columns=headers)
    df.to_csv(filename, index=False)
    print(f"✅ Report saved: {filename}")

if __name__ == "__main__":
    node_health = get_node_health()
    pod_health = get_pod_health()

    save_to_csv(node_health, "node_health_report.csv", ["Node Name", "Status", "CPU Capacity", "CPU Usage", "Memory Capacity", "Memory Usage"])
    save_to_csv(pod_health, "pod_health_report.csv", ["Namespace", "Pod Name", "Status", "CPU Usage (nanos)", "Memory Usage (KiB)"])
