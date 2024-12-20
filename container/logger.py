import time
from datetime import datetime
import sys

messages = [
    "I told my computer I needed a break, and now it won't stop sending me error messages.",
    "Why do programmers prefer dark mode? Because the light attracts bugs!",
    "Debugging: where you take all the time to fix the code you didn't write.",
    "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'",
    "To understand recursion, you must first understand recursion.",
    "Why do Java developers wear glasses? Because they can't C#.",
    "I'm not a great programmer, but I can code the basics - that's how I keep my job.",
    "Code never lies, but comments do.",
    "There are 10 types of people in the world: those who understand binary and those who don't.",
    "'Hello, World!' is the most satisfying thing a programmer can type... until the syntax error pops up."
]


def generate_logs():
    counter = 0
    while True:
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"{current_time} - {messages[counter % 10]}")
        sys.stdout.flush()
        counter += 1
        time.sleep(3)

if __name__ == "__main__":
    generate_logs()
