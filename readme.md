# Kubernetes Cluster Health Analyzer

The Kubernetes Cluster Health Analyzer is a tool designed to monitor and evaluate the health of a Kubernetes cluster. It gathers essential metrics from nodes and pods, providing insights into performance, resource utilization, and overall cluster stability.

## Features

- Collects node and pod metrics (CPU, memory, status, etc.)
- Exposes a REST API for health monitoring
- Provides alerts for unhealthy nodes or pods
- Easily extendable for additional health checks

## Installation

### Prerequisites

- Python 3.8+
- Kubernetes cluster with access via `kubectl`
- Virtual environment (recommended)

### Setup

```sh
# Clone the repository
git clone https://github.com/yourusername/k8s-cluster-health-analyzer.git
cd k8s-cluster-health-analyzer

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\\Scripts\\activate`

# Install dependencies
pip install -r requirements.txt
```

## Usage

### Start the API Server

```sh
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### API Endpoints

| Endpoint  | Method | Description |
|-----------|--------|-------------|
| `/`       | GET    | Health check API |
| `/nodes`  | GET    | Fetch node metrics |
| `/pods`   | GET    | Fetch pod metrics |

Example:

```sh
curl http://localhost:8000/nodes
```

## Contributing

1. Fork the repository.
2. Create a new branch (`feature-branch`).
3. Commit your changes.
4. Push to your fork and create a PR.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or issues, feel free to open an issue in the repository.
