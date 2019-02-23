#!/usr/bin/env python
# Name: Michael Stroet
# Student number: 11293284
"""
This script converts a csv file to a JSON file
"""

import csv
import json
import pandas as pd

INPUT_CSV = "KNMI_20190221.csv"
OUTPUT_JSON = "KNMI_test.json"

WANTED_DATA = ["YYYYMMDD","   TN","   TX"]

def open_csv():
    '''
    Opens a csv file and returns a pandas dataframe
    '''
    df = pd.read_csv(INPUT_CSV, dtype = object, usecols = WANTED_DATA)

    return(df)


def save_json(df):
    '''
    Output a JSON file containing all data ordered by index.
    '''
    # Convert the dataframe to a json string ordered by index
    data_json = df.to_json(orient = 'index')

    with open(OUTPUT_JSON, 'w') as outfile:
        outfile.write(data_json)


def preprocess_data(df):
    '''
    Sanitises the data in the dataframe object
    '''

    # Remove all leading and trailing spaces from the headers and columns
    df.columns = df.columns.str.strip(" ")
    for col in df.columns:
        df.loc[:, col] = df.loc[:, col].str.strip(" ")

    # Renames columns in the dataframe
    col_rename_dict = {'YYYYMMDD' : 'Date', 'TN' : 'Tmin (C)', 'TX' : 'Tmax (C)'}
    df.rename(columns = col_rename_dict, inplace = True)

    # Sets the 'Date' column as the index for the dataframe
    df.set_index(df.columns[0], inplace=True)

    df["Tmin (C)"] = df["Tmin (C)"].multiply(10)

    return(df)

if __name__ == "__main__":

    data_df = open_csv()
    print(data_df.head(2))
    print()

    # Sanitise the dataframe
    data_df = preprocess_data(data_df)

    print(data_df.head(2))
    print()

    # Save the data as a json file
    save_json(data_df)
