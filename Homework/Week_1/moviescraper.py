#!/usr/bin/env python
# Name: Michael Stroet
# Student number: 11293284
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry contains the title, rating, year of release, actors and runtime.
    """
    # The data of all movies is found under the lister-item-content class
    # movies_raw is a list containing every entry's div tag and its children
    movies_raw = dom.find_all("div", class_ = "lister-item-content")
    movies = []

    # Itterates over each movie, isolating the required data
    for movie in movies_raw:
        header = movie.find(class_ = re.compile("header"))
        title = header.find('a').string

        # Finds the release year and removes extra characters
        year = header.find(class_ = re.compile("year")).string.strip("()")
        if not len(year) == 4:
            year = year.split('(', 1)[-1]

        runtime = movie.find(class_ = "runtime").string.strip(" min")
        rating = movie.find(class_ = re.compile("imdb-rating")).find("strong").string

        # Finds all actors and saves them as a comma-seperated string
        # All actors contain "_st_" in their href link. Directors have "_dr_"
        actors = movie.find('p', class_ = "").find_all('a', href = re.compile("_st_"))
        for i in range(len(actors)):
            actors[i] = actors[i].string

        actors = ','.join(map(str, actors))

        # Append all scraped data to the list seperated by commas
        movies.append([title, float(rating), int(year), actors, int(runtime)])

    return movies


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    for movie in movies:
        writer.writerow(movie)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
