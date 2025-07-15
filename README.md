# Kubernetes Cluster Health Analyzer

Monitor and analyze the health of your Kubernetes cluster, including node and pod metrics, via a REST API and dashboard.

## Features

- Collects node and pod metrics (CPU, memory, status, etc.)
- Exposes a REST API for health monitoring
- Visualizes metrics in a React dashboard
- Easily extendable for additional health checks

## Installation

### Prerequisites

- Python 3.8+
- Node.js & npm (for dashboard)
- Kubernetes cluster with access via `kubectl`
- Metrics Server installed on your cluster

### Setup (Backend)

```sh
git clone https://github.com/yourusername/k8s-cluster-health-analyzer.git
cd k8s-cluster-health-analyzer

python3 -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

pip install -r requirements.txt
```

### Setup (Frontend)

```sh
cd dashboard
npm install
npm start
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

### View in Dashboard

1. Start the backend server (see above).
2. Start the frontend.
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

1. Fork the repository.
2. Create a new branch (`feature-branch`).
3. Commit your changes.
4. Push to your fork and create a PR.

## License

MIT License. See [LICENSE](LICENSE).

## Contact

Open an issue for questions or suggestions.