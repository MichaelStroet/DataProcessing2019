#!/usr/bin/env python
# Name: Michael Stroet
# Student number: 11293284
"""
Hubedubeduu
"""

import csv
import numpy as np
import pandas as pd

# Global constants for the input file
INPUT_CSV = "input.csv"
WANTED_DATA = ["Country", "Region", "Pop. Density (per sq. mi.)", "Infant mortality (per 1000 births)", "GDP ($ per capita) dollars"]

pd.set_option('display.max_columns', None)
#pd.set_option('display.max_rows', None)


def preprocess_data():
    """
    Sanitises the data in the dataframe object
    """

    # Sets the 'Country' column as the index for the dataframe
    data_df.set_index(WANTED_DATA[0], inplace=True)

    # Removes all leading and trailing spaces from the 'Region' column
    data_df[WANTED_DATA[1]] = data_df[WANTED_DATA[1]].str.strip(" ")

    # Removes all " dollars" from the 'GDP' column
    data_df[WANTED_DATA[4]] = data_df[WANTED_DATA[4]].str.replace(" dollars", "")

    # Sanitises the columns 'Pop. Density', 'Infant mortality' and 'GDP'
    for col in [2,3,4]:
        # Replaces all ',' with '.'
        data_df[WANTED_DATA[col]] = data_df[WANTED_DATA[col]].str.replace(",", ".")

        # Replaces all data not containing any numeric values [0-9] or a '.' with numpy's NaN
        missing_data = data_df[WANTED_DATA[col]].str.contains(r'[^\d.]')
        data_df[WANTED_DATA[col]] = np.where(missing_data, np.nan, data_df[WANTED_DATA[col]])

        # Sets all string types to
        data_df[WANTED_DATA[col]] = pd.to_numeric(data_df[WANTED_DATA[col]])


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    for movie in movies:
        writer.writerow(movie)

if __name__ == "__main__":

    # Add all wanted columns of data from the input csv to a pandas DataFrame object
    data_df = pd.read_csv(INPUT_CSV, usecols = WANTED_DATA)

    preprocess_data()

    # TEMPORARY
    data_df.to_csv("Preprocess_test.csv")
