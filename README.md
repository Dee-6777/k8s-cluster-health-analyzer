# Kubernetes Cluster Health Analyzer

A comprehensive monitoring solution for Kubernetes clusters with a modern React dashboard and FastAPI backend. Monitor and analyze the health of your Kubernetes cluster with real-time metrics, interactive charts, and intuitive visualizations.

![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🎯 **Core Functionality**
- **Real-time Cluster Monitoring** - Live node and pod metrics with 30-second auto-refresh
- **Resource Usage Tracking** - CPU, memory, and storage metrics from Kubernetes Metrics Server
- **Multi-namespace Support** - Monitor pods across all namespaces
- **Status Monitoring** - Track node and pod health states with visual indicators

### 📊 **Advanced Dashboard**
- **Interactive Charts** - Bar charts, pie charts, and resource usage visualizations using Recharts
- **Modern UI** - Clean, responsive design with Tailwind CSS and Heroicons
- **Multi-tab Interface** - Overview, Nodes, and Pods tabs for organized data viewing
- **Search & Filter** - Find specific resources quickly with built-in search functionality
- **Sortable Tables** - Click column headers to sort data ascending/descending

### 🔧 **Technical Features**
- **FastAPI Backend** - High-performance REST API with automatic documentation
- **CORS Support** - Seamless frontend-backend communication
- **Error Handling** - Graceful error handling with user-friendly messages
- **Auto-reload Development** - Hot reload for both frontend and backend during development

## 🖥️ Dashboard Preview

### Overview Tab
- **Summary Cards**: Total nodes, pods, namespaces, and cluster health status
- **Resource Charts**: Interactive visualizations of node and pod metrics
- **Health Indicators**: Visual status badges for quick health assessment

### Nodes Tab
- **Node Details**: Comprehensive node information with resource usage
- **Capacity vs Usage**: Compare allocated vs actual resource consumption
- **Status Monitoring**: Real-time node health status

### Pods Tab
- **Pod Distribution**: Visual breakdown by namespace and status
- **Resource Metrics**: CPU and memory usage for all pods
- **Searchable Interface**: Quickly find specific pods or filter by namespace

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 16+ & npm**
- **Kubernetes cluster** (local or remote)
- **kubectl** configured and accessible
- **Metrics Server** installed on your cluster

### 1. Set Up Local Kubernetes Cluster (Optional)

If you don't have a cluster, create one with Minikube:

```bash
# Install Minikube (macOS)
brew install minikube

# Start cluster with metrics server
minikube start --memory=4096 --cpus=2
minikube addons enable metrics-server

# Verify cluster
kubectl get nodes
kubectl top nodes  # Should show resource usage
```

### 2. Clone and Setup Backend

```bash
git clone https://github.com/yourusername/k8s-cluster-health-analyzer.git
cd k8s-cluster-health-analyzer

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Setup Frontend

```bash
cd dashboard
npm install
```

### 4. Start the Application

**Terminal 1 - Backend API:**
```bash
# From project root
source venv/bin/activate
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend Dashboard:**
```bash
# From dashboard directory
npm start
```

### 5. Access Dashboard

🎉 **Open your browser and navigate to:** **http://localhost:3000**

## 📡 API Endpoints

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/` | GET | Health check | `{"message": "Kubernetes Cluster Health API"}` |
| `/nodes` | GET | Node metrics | Array of node objects with CPU, memory, status |
| `/pods` | GET | Pod metrics | Array of pod objects with resource usage |

### Example API Response

**GET /nodes:**
```json
[
  {
    "Node Name": "minikube",
    "Status": "Ready",
    "CPU Capacity": "2",
    "CPU Usage": "110205564n",
    "Memory Capacity": "3708872Ki",
    "Memory Usage": "1530780Ki"
  }
]
```

**GET /pods:**
```json
[
  {
    "Namespace": "kube-system",
    "Pod Name": "coredns-668d6bf9bc-6t8jg",
    "Status": "Running",
    "CPU Usage (nanos)": 1344188,
    "Memory Usage (KiB)": 58248
  }
]
```
## 🔎 Dashboard Overview
### The first page you'll land into 🚀 - provides overall cluster health 🩺
<img width="2938" height="1890" alt="image" src="https://github.com/user-attachments/assets/867fd278-20a5-4f92-b5c1-f6a059bf94be" />

### Node health 📈
<img width="3456" height="2081" alt="image" src="https://github.com/user-attachments/assets/b399bf36-a961-4282-a82c-ed1169240e54" />

### Pods health 📈
<img width="3455" height="2076" alt="image" src="https://github.com/user-attachments/assets/2ac977e8-e90d-4440-872a-8d76a34ac5a5" />


## 🛠️ Development

### Project Structure
```
k8s-cluster-health-analyzer/
├── app.py                 # FastAPI backend application
├── code_1.py             # Kubernetes metrics collection
├── requirements.txt       # Python dependencies
├── dashboard/            # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── MetricsChart.js
│   │   │   ├── MetricsTable.js
│   │   │   └── StatusCard.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json      # Node.js dependencies
│   └── tailwind.config.js
└── README.md
```

### Backend Development

The backend uses:
- **FastAPI** for the REST API
- **Kubernetes Python Client** for cluster communication
- **uvicorn** as the ASGI server

### Frontend Development

The frontend uses:
- **React 18** with functional components and hooks
- **Tailwind CSS** for styling
- **Heroicons** for icons
- **Recharts** for data visualization

## 🐛 Troubleshooting

### Common Issues

**1. "Loading..." message persists**
- Ensure your Kubernetes cluster is running: `kubectl get nodes`
- Check if metrics-server is installed: `kubectl get pods -n kube-system | grep metrics-server`
- Verify backend is accessible: `curl http://localhost:8000/`

**2. "Metrics not available yet"**
- Wait 2-3 minutes after starting the cluster for metrics collection
- Restart metrics-server if needed: `kubectl rollout restart deployment/metrics-server -n kube-system`

**3. Backend API not responding**
- Check if port 8000 is in use: `lsof -ti:8000`
- Restart the backend server
- Verify virtual environment is activated

**4. Frontend not loading**
- Ensure React dev server is running on port 3000
- Check browser console for errors
- Try clearing browser cache

**5. CORS errors**
- Backend includes CORS middleware for localhost:3000
- If using different ports, update CORS settings in `app.py`

### Performance Tips

- **Resource Requirements**: Minimum 2GB RAM for Minikube
- **Metrics Collection**: Metrics server needs ~30 seconds to collect initial data
- **Browser Performance**: Dashboard works best in modern browsers (Chrome, Firefox, Safari)

## 🔧 Configuration

### Customizing Refresh Rate

Edit `dashboard/src/components/Dashboard.js`:
```javascript
// Change from 30000 (30 seconds) to desired interval
const interval = setInterval(fetchData, 30000);
```

### Adding Custom Metrics

Extend `code_1.py` to collect additional Kubernetes resources:
```python
def get_custom_metrics():
    # Add your custom metrics collection logic
    pass
```

## 📈 Monitoring Multiple Clusters

To monitor multiple clusters, modify the kubectl context:
```bash
kubectl config get-contexts
kubectl config use-context <cluster-name>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Kubernetes](https://kubernetes.io/) for the amazing container orchestration platform
- [FastAPI](https://fastapi.tiangolo.com/) for the modern Python web framework
- [React](https://reactjs.org/) for the powerful frontend library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Recharts](https://recharts.org/) for beautiful React charts

## 📞 Support

- 🐛 **Bug Reports**: Open an issue with detailed description
- 💡 **Feature Requests**: Suggest new features via issues
- 📖 **Documentation**: Contribute to improve documentation
- 💬 **Questions**: Start a discussion in the repository

---

**⭐ If this project helped you, please consider giving it a star!**

Made with ❤️ for the Kubernetes community
