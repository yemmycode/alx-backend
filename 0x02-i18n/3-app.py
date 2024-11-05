#!/usr/bin/env python3
'''Flask Application - Task 2: Locale Selection Based on Client Request
'''

from flask import Flask, render_template, request
from flask_babel import Babel

# Configuration class for language and debug settings
class Config:
    '''Defines application configuration settings for language and timezone.'''
    DEBUG = True
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"

# Initialize Flask app with the specified configuration
app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)

@babel.localeselector
def get_locale() -> str:
    """Selects the best language match for the request.

    Returns:
        str: Preferred language based on request headers
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])

@app.route('/')
def index() -> str:
    '''Renders the homepage.

    Returns:
        str: HTML content for the homepage
    '''
    return render_template("3-index.html")

# Uncomment the following code and comment out @babel.localeselector 
# to observe AttributeError:
# babel.init_app(app, locale_selector=get_locale)

if __name__ == "__main__":
    app.run()

