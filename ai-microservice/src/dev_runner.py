import subprocess
from watchdog.observers.polling import PollingObserver as Observer
from watchdog.events import FileSystemEventHandler
import time
import os

IGNORED_DIRS = {"__pycache__", ".venv"}
IGNORED_EXTENSIONS = {".pyc", ".pyo", ".swp"}

class RestartOnChange(FileSystemEventHandler):
    def __init__(self, command, watch_path="."):
        self.command = command
        self.process = None
        self.watch_path = watch_path
        self.start_process()

    def start_process(self):
        if self.process:
            self.process.terminate()
        print("Starting gRPC server...")
        self.process = subprocess.Popen(self.command)

    def on_any_event(self, event):
        # Ignore directories and unwanted file types
        if any(ignored in event.src_path for ignored in IGNORED_DIRS):
            return
        if any(event.src_path.endswith(ext) for ext in IGNORED_EXTENSIONS):
            return
        if event.is_directory:
            return
        if event.src_path.endswith(".py"):
            print(f"Detected change in {event.src_path}, restarting...")
            self.start_process()

if __name__ == "__main__":
    event_handler = RestartOnChange(["python", "-m", "src.main"], watch_path=".")
    observer = Observer()
    observer.schedule(event_handler, path="src", recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        if event_handler.process:
            event_handler.process.terminate()
    observer.join()
