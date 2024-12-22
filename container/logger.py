from flask import Flask, jsonify
import time
import sys
import threading
import random

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
    "My password is 'incorrect', so when I forget it, the computer reminds me, 'Your password is incorrect.'",
    "Why do programmers love hiking? Because they enjoy going through their stacks.",
    "What's a programmer's favorite hangout spot? The cache.",
    "Why did the programmer get stuck in the shower? The shampoo bottle said, 'Lather, Rinse, Repeat.'",
    "Why don't programmers like to leave the house? There are too many outside variables.",
    "Why do programmers always mix up Christmas and Halloween? Because Oct 31 == Dec 25.",
    "Why did the database administrator break up with their partner? They found them too clingy and not relational.",
    "Why did the programmer go broke? They used up all their cache.",
    "Why did the C++ developer get in trouble? They forgot to delete their ex.",
    "How do functions break up? They stop calling each other.",
    "Why don't programmers like bowling? They hate handling exceptions.",
    "Why do programmers prefer laptops over desktops? They like to work anywhere with their private keys.",
]

log_buffer = []  # Buffer to store logs
counter = 0
buffer_size = 50  # Maximum number of logs to store in the buffer


def get_ist_time():
    utc_time = time.gmtime()

    ist_hour = (utc_time.tm_hour + 5) % 24
    ist_minute = (utc_time.tm_min + 30)

    # Adjust for overflow of minutes
    if ist_minute >= 60:
        ist_minute -= 60
        ist_hour = (ist_hour + 1) % 24

    # Format the time as a string
    return f"{utc_time.tm_year}-{utc_time.tm_mon:02}-{utc_time.tm_mday:02} {ist_hour:02}:{ist_minute:02}:{utc_time.tm_sec:02}"


def generate_logs():
    time.sleep(100)
    global counter
    while True:
        log_message = random.choice(messages)
        current_time = get_ist_time()
        timestamped_message = f"{current_time} - {log_message}"
        
        # Print and flush the message
        print(timestamped_message)
        sys.stdout.flush()
        
        # Add the message to the log buffer
        log_buffer.append(timestamped_message)
        if len(log_buffer) > buffer_size:
            log_buffer.pop(0)
        
        counter += 1
        time.sleep(10)


@app.route("/logs", methods=["GET"])
def get_logs():
    return jsonify(log_buffer)  # Return the buffered logs as JSON


if __name__ == "__main__":
    # Start the log generation in a separate thread
    threading.Thread(target=generate_logs, daemon=True).start()
    
    # Start the Flask app
    app.run(host="0.0.0.0", port=80)
