#!/usr/bin/env python3
'''Flask Application - Task 2: Locale Selection Based on Request
'''

from flask import Flask, render_template, request
from flask_babel import Babel

# Configuration class for language and app settings
class Config:
    '''Defines configuration for languages, locale, and debug mode.'''
    DEBUG = True
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"

# Initialize Flask application and load configurations
app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)

@babel.localeselector
def get_locale() -> str:
    """Determine the best match for supported languages.

    Returns:
        str: Preferred language based on request
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])

@app.route('/')
def index() -> str:
    '''Renders the homepage template.

    Returns:
        str: Rendered HTML for the homepage
    '''
    return render_template("2-index.html")

# Run the application
if __name__ == "__main__":
    app.run()

