#!/usr/bin/env python3
'''Flask Application - Task 0: Basic Setup
'''

from flask import Flask, render_template

# Initialize the Flask app
app = Flask(__name__)

@app.route('/')
def index():
    '''Render the default route template'''
    return render_template("0-index.html")

# Run the app in debug mode if executed directly
if __name__ == "__main__":
    app.run(debug=True)
