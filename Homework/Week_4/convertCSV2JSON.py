#!/usr/bin/env python
# Name: Michael Stroet
# Student number: 11293284
"""
This script converts a csv file into a JSON file
"""

import csv
import json
import time
import numpy as np
import pandas as pd

# Global constants for in and out put files and the required columns
INPUT_CSV = "games-features.csv"    # Source: https://data.world/craigkelly/steam-game-data
OUTPUT_JSON = "data.json"

WANTED_DATA = ["ResponseName","ReleaseDate","PlatformWindows","PlatformLinux","PlatformMac","GenreIsNonGame"]
# "PlatformWindows","PlatformLinux","PlatformMac",
#"GenreIsNonGame","GenreIsIndie","GenreIsAction","GenreIsAdventure","GenreIsCasual","GenreIsStrategy","GenreIsRPG","GenreIsSimulation","GenreIsEarlyAccess","GenreIsFreeToPlay","GenreIsSports","GenreIsRacing","GenreIsMassivelyMultiplayer"]


def open_csv():
    '''
    Opens a csv file and returns a pandas dataframe
    '''
    df = pd.read_csv(INPUT_CSV, usecols = WANTED_DATA)

    return(df)


def save_json(df):
    '''
    Output a JSON file containing all data ordered by index.
    '''
    # Convert the dataframe to a json string ordered by index
    data_json = df.to_json(orient = 'values')

    with open(OUTPUT_JSON, 'w') as outfile:
        outfile.write(data_json)


def date_to_unix(date, format):
    '''
    Converts a date in a given format to a unix timestamp.
    '''
    return(time.mktime(time.strptime(date, format)))


def preprocess_data(df):
    '''
    Sanitises the data in the dataframe object
    '''
    # Remove all leading and trailing spaces from the column headers
    df.columns = df.columns.str.strip(" ")

    # Remove non-game rows
    df = df[df.GenreIsNonGame == False]

    return(df)


if __name__ == "__main__":

    # Open the csv and convert it to a pandas dataframe object
    data_df = open_csv()

    # Sanitise the dataframe
    data_df = preprocess_data(data_df)

    # Save the data as a json file
    save_json(data_df)
