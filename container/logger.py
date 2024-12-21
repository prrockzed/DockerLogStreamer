from flask import Flask, jsonify
import time
import threading

app = Flask(__name__)

messages = [
    "Why do programmers hate nature? It has too many bugs.",
    "How do you comfort a JavaScript bug? You console it.",
    "Why was the developer unhappy at their job? They wanted arrays.",
    "Why do programmers prefer coffee? Because coding without it is depresso.",
    "What do you call 8 hobbits? A hobbyte.",
    "Why was the developer so good at music? They had an excellent sense of loops.",
    "Why do Python developers prefer snakes? Because they understand 'self'.",
    "Why did the programmer quit their job? They didn't get arrays.",
    "My password to 'incorrect', so when I forget it, computer reminds me, 'Your password is incorrect.'",
    "Why do programmers love hiking? Because they enjoy going through their stacks.",
    "What's a programmer's favorite hangout spot? The cache.",
    "Why did the programmer get stuck in the shower? The shampoo bottle said, 'Lather, Rinse, Repeat.'",
    "Why don't programmers like to leave the house? There are too many outside variables.",
    "Why do programmers always mix up Christmas and Halloween? Because Oct 31 == Dec 25.",
    "Why database administrator break up with their partner? They found them too clingy and not relational.",
    "Why did the programmer go broke? They used up all their cache.",
    "Why did the C++ developer get in trouble? They forgot to delete their ex.",
    "How do functions break up? They stop calling each other.",
    "Why don't programmers like bowling? They hate handling exceptions.",
    "Why programmers prefer laptops over desktops? They like to work anywhere with their private keys."
]

log_buffer = []  # Buffer to store logs
counter = 0

def generate_logs():
    global counter
    while True:
        log_message = messages[counter % len(messages)]
        log_buffer.append(log_message)
        if len(log_buffer) > 50:  # Keep only the last 50 logs
            log_buffer.pop(0)
        counter += 1
        time.sleep(3000)

@app.route("/logs", methods=["GET"])
def get_logs():
    return jsonify(log_buffer)

if __name__ == "__main__":
    threading.Thread(target=generate_logs, daemon=True).start()
    app.run(host="0.0.0.0", port=80)
