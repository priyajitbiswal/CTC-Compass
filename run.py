"""
CTC Compass India — Server Runner
Avoids port 8080 (Jenkins reserved). Default: Port 5000.
"""

import sys
import uvicorn

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5000
    print(f"======================================================")
    print(f"  CTC Compass India — Server Starting on Port {port}")
    print(f"  Open in Browser: http://127.0.0.1:{port}")
    print(f"======================================================")
    uvicorn.run("app:app", host="127.0.0.1", port=port, reload=False)

