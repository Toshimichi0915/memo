#!/usr/bin/python3

import sys
import requests

def main():
    if len(sys.argv) < 2:
        print("Missing memo ID")
        return

    url = f"https://correcttoapi.net/memo?q={sys.argv[1]}"

    if len(sys.argv) > 2 :
        requests.post(url, data=" ".join(sys.argv[2:]))
    else:
        print(requests.get(url).text)

if __name__ == "__main__":
    main()
