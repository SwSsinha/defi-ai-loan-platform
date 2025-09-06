# DeFi-AI Risk Assessment API Dockerfile
# Purpose: Containerize Flask API for Akash Network deployment
# Entry point for AI risk scoring service
# Build with: docker build -t<Object> ai-api

FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for efficient caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app.py .

# Expose port for Flask
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Run the Flask app
CMD ["python", "app.py"]