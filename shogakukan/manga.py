from shutil import rmtree
import os
import urllib.request
from PIL import Image
import json


# Hardcoded values
VERBOSE = True
DESTINATION = '/path/to/folder'  # Adjust to your actual destination path
JSON_PATH = '/path/to/the.json'  # Path to your JSON file

def vprint(txt: str, end: str = "\n"):
    if VERBOSE:
        print(txt, end=end)

def read_json():
    with open(JSON_PATH) as file:
        data = json.load(file)
    return [url for key, url in data.items()]  # Ensure we return a list of URLs

def create_destination():
    if not os.path.exists(DESTINATION):
        os.makedirs(DESTINATION)

def request_and_save_images(urls):
    for index, url in enumerate(urls, 1):
        try:
            file_path = os.path.join(DESTINATION, f"{index}.png")
            vprint(f"Downloading image {index}/{len(urls)} to {file_path}...")
            urllib.request.urlretrieve(url, file_path)
            vprint(f"Image {index} saved successfully.")
        except Exception as e:
            vprint(f"Error downloading or saving image {index}: {e}")

def main():
    create_destination()
    urls = read_json()
    request_and_save_images(urls)

if __name__ == "__main__":
    main()
