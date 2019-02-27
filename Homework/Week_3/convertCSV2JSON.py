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

INPUT_CSV = "Zonnepanelen.csv"
OUTPUT_JSON = "data.json"


def open_csv():
    '''
    Opens a csv file and returns a pandas dataframe
    '''
    df = pd.read_csv(INPUT_CSV, dtype = object)

    return(df)


def save_json(df):
    '''
    Output a JSON file containing all data ordered by index.
    '''
    # Convert the dataframe to a json string ordered by index
    data_json = df.to_json(orient = 'index')

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

    # Renames columns in the dataframe
    col_rename_dict = {"Generation (kWh)": "Generation" ,"Income (€)" : "Income"}
    df.rename(columns = col_rename_dict, inplace = True)

    # Replace all dates with unix timestamps
    column = df.columns[0]
    date_format = '%Y%m%d'

    for row in df.index.values:
        df.loc[row, column] = date_to_unix(df.loc[row, column], date_format)

    # Sets the first column as the index for the dataframe
    df.set_index(df.columns[0], inplace=True)

    # Sanitises the remaining (numeric) columns
    for col in df.columns:

        # Remove all leading and trailing spaces from the columns
        df.loc[:, col] = df.loc[:, col].str.strip(" ")

        # Replaces all ',' with '.'
        df.loc[:, col] = df.loc[:, col].str.replace(",", ".")

        # Replaces all data not containing any numeric values [0-9], '.' or a '-' with numpy's NaN
        missing_data = df.loc[:, col].str.contains(r'[^\d.-]')
        df.loc[:, col] = np.where(missing_data, np.nan, df.loc[:, col])

        # Converts all strings to floats
        df.loc[:, col] = pd.to_numeric(df.loc[:, col])

    return(df)


if __name__ == "__main__":

    # Open the csv and convert it to a pandas dataframe object
    data_df = open_csv()

    # Sanitise the dataframe
    data_df = preprocess_data(data_df)

    # Save the data as a json file
    save_json(data_df)
