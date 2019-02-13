#!/usr/bin/env python
# Name: Michael Stroet
# Student number: 11293284
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt
from statistics import mean

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

def readcsv():
    """
    Opens the csv file and adds the required data to the data dictionary
    """

    with open(INPUT_CSV, newline = '') as csvfile:
        # Skips the first row
        next(csvfile)
        csvdata = csv.reader(csvfile)

        # Itterates over each row, adding the rating and year to the dictionary
        for row in csvdata:
            rating = row[1]
            year = row[2]

            data_dict[year].append(rating)


def plot_results(years, ratings):
    """
    Plots the given data in 2 lineplots. One with the ratings shown from 0 tot 10
    and the other from 8 to 9. Both contain a horizontal line of the average rating of all years.
    """

    # Defines the figure with two subplots and a fixed size in inches
    fig, axs = plt.subplots(nrows=1, ncols=2, figsize = (12, 5))

    # Leftern subplot with ratings from 0 to 10
    ax = axs[0]
    plot_subplot(years, rating, ax, 0, 10)

    # Rightenr subplot with ratings from 8 to 9
    ax = axs[1]
    plot_subplot(years, rating, ax, 8, 9)

    fig.suptitle("The average rating per year of the top 50 highest-rated movies from 2008 to 2017")


def plot_subplot(years, rating, ax, ymin, ymax):
    """
    Plots the data as a lineplot in a subplot with axes object 'ax'.
    """
    mean_rating = mean(ratings)

    ax.plot(years,ratings, color = "steelblue", marker = "o")
    ax.hlines(mean_rating, years[0] - 0.5, years[-1] + 0.5, color = "orangered", linestyle = "dashed", label = "Average rating all years")
    ax.text(years[-1] + 0.6, mean_rating, round(mean_rating, 2))

    ax.set_xlim(years[0] - 0.5, years[-1] + 0.5)
    ax.set_ylim(ymin, ymax)

    ax.set_title(f"Ratings shown from {ymin} to {ymax}")
    ax.set_xlabel("Year of release")
    ax.set_ylabel("Average rating per year")

    ax.legend(loc = "upper right")
    ax.grid(axis = "both")


if __name__ == "__main__":

    # Open the csv file and append data to the data dictionary
    readcsv()

    years = []
    ratings = []

    # Itterate over each year in the dictionary
    for year in data_dict:
        years.append(int(year))
        year_ratings = []

        # Itterates over each rating under the given year and calculates the average
        for rating in data_dict[year]:
            year_ratings.append(float(rating))

        ratings.append(mean(year_ratings))

    # Plots the data in two line plot subplots
    plot_results(years, ratings)

    plt.show()
