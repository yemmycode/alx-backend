#!/usr/bin/env python3
'''Flask Application : Multilingual Support with Babel Configuration
'''

from flask import Flask, render_template
from flask_babel import Babel

# Configuration class for language and timezone settings
class Config:
    '''Application configuration for supported languages and default settings.'''
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"

# Initialize Flask application and configure it
app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False

# Set up Babel for language support
babel = Babel(app)

@app.route('/')
def index():
    '''Render template for the root route'''
    return render_template("1-index.html")

# Run the app in debug mode when executed directly
if __name__ == "__main__":
    app.run(debug=True)

