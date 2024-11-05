#!/usr/bin/env python3
'''Flask Application - Task 4: Locale Selection Using URL Parameters
'''

from flask import Flask, render_template, request
from flask_babel import Babel

# Configuration class for application settings
class Config:
    '''Defines configuration for supported languages and timezone.'''
    DEBUG = True
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"

# Initialize the Flask app with configuration
app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)

@babel.localeselector
def get_locale() -> str:
    """Determines the locale for the current request, with URL override.

    Checks URL for locale parameter; if valid, returns it. Otherwise, 
    uses the best match from accepted languages.

    Returns:
        str: Preferred language for the request
    """
    locale = request.args.get('locale')
    if locale in app.config['LANGUAGES']:
        return locale
    return request.accept_languages.best_match(app.config['LANGUAGES'])

@app.route('/')
def index() -> str:
    '''Renders the homepage template.

    Returns:
        str: Rendered HTML for the homepage
    '''
    return render_template("4-index.html")

# Uncomment the following code and comment @babel.localeselector
# to observe AttributeError:
# babel.init_app(app, locale_selector=get_locale)

if __name__ == "__main__":
    app.run()

