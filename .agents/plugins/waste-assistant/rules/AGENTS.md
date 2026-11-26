# AI Waste Segregation Assistant - Architecture & Guidelines

## Core Principles
1. **Zero-Downtime Resilience**: Backend uses MongoDB with automatic transparent in-memory/JSON fallback for persistent scans and users.
2. **AI Segregation Streams**:
   - Wet Waste (Green Bin)
   - Dry Waste (Blue/Grey Bin)
   - Recyclable Waste (Blue Bin)
   - Hazardous Waste (Red Bin)
   - Uncertain / Non-Waste Safeguard (< 20% confidence or non-waste items)
3. **CORS & Multi-Platform Deployments**:
   - Backend deployed on Render (`https://ai-waste-segregation-backend.onrender.com`)
   - Frontend deployed on Vercel (`https://ai-waste-segregation-assistant.vercel.app`)
   - Allowed origins include all Vercel preview and production subdomains.
