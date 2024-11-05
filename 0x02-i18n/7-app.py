#!/usr/bin/env python3
'''Determinng the correct time zone
'''

from typing import Dict, Union
from flask import Flask, render_template, request, g
from flask_babel import Babel
import pytz


class Config:
    '''Configuration settings for the application.'''

    DEBUG = True
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user() -> Union[Dict, None]:
    """Fetches a user by their user ID.
    """
    login_id = request.args.get('login_as')
    return users.get(int(login_id)) if login_id else None


@app.before_request
def before_request() -> None:
    """Executes routines prior to handling each request.
    """
    g.user = get_user()


@babel.localeselector
def get_locale() -> str:
    """Determines the appropriate locale for a web page.

    Returns:
        str: The best matching locale.
    """
    locale = request.args.get('locale')
    if locale in app.config['LANGUAGES']:
        return locale
    if g.user and g.user['locale'] in app.config["LANGUAGES"]:
        return g.user['locale']
    header_locale = request.headers.get('locale', '')
    if header_locale in app.config["LANGUAGES"]:
        return header_locale
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@babel.timezoneselector
def get_timezone() -> str:
    """Obtains the timezone for a web page.
    """
    timezone = request.args.get('timezone', '').strip() or g.user['timezone'] if g.user else None
    try:
        return pytz.timezone(timezone).zone if timezone else app.config['BABEL_DEFAULT_TIMEZONE']
    except pytz.exceptions.UnknownTimeZoneError:
        return app.config['BABEL_DEFAULT_TIMEZONE']


@app.route('/')
def index() -> str:
    '''Main route

    Returns:
        html: The homepage
    '''
    return render_template("7-index.html")

# Uncomment the following line and comment the @babel.localeselector to see an error:
# AttributeError: 'Babel' object has no attribute 'localeselector'
# babel.init_app(app, locale_selector=get_locale)


if __name__ == "__main__":
    app.run()

