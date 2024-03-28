# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| | |
| | |
| | |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (29th March, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*


### Dataset
We will mainly work with the [Michelin Guide Restaurants](https://www.kaggle.com/datasets/ngshiheng/michelin-guide-restaurants-2021) dataset, which is a CSV list of restaurants mentioned by the [Michelin Guide](https://guide.michelin.com/en). The dataset consists of **6794 rows**, each representing a unique Michelin-starred restaurant. This dataset encompasses **13 columns** which provide various details about the restaurants such as:

- `Name`
- `Address`
- `Location`
- `Price`
- `Cuisine`
- `Longitude`
- `Latitude`
- `PhoneNumber`
- `Url`
- `WebsiteUrl`
- `Award`   (Michelin star count and a special Bib Gourmand status)
- `FacilitiesAndServices`
- `Description` (taken from the Michelin Guide Website)

Since we are planning to visualize these restaurants on a interactive map, latitude and longitude are the most essential fields. We also plan to visualize the number of Michelin stars, as well as put contract information of the restaurants in our UI.

In addition, we also plan to expand this data with the [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview?hl=tr), which returns more detailed information such as opening hours, reviews, whether it serves wine/beer, has wheelchair support, and so on. We plan to visualize the opening hours on a calendar and use the extra flags (e.g. serves beer) for filtering purposes. Also, we plan to experiment with review word clouds to provide further insight to the restaurants.

For some of the restaurants in Europe, there are also some entries on the website [TheFork](https://www.thefork.com/). For those restaurants, we plan to utilize the [The Fork The Spoon API](https://rapidapi.com/apidojo/api/the-fork-the-spoon), which returns further information such as chef name, accepted currency, and menu data, a nested JSON list with meal descriptions (e.g. ingredients, chef commentary, and price). 


***1052 characters***
> Find a dataset (or multiple) that you will explore. Assess the quality of the data it contains and how much preprocessing/data cleaning it will require before tackling visualization. We recommend using a standard dataset as this course is not about scraping nor data processing.
>
> Hint: some good pointers for finding quality publicly available datasets ([Google dataset search](https://datasetsearch.research.google.com/), [Kaggle](https://www.kaggle.com/datasets), [OpenSwissData](https://opendata.swiss/en/), [SNAP](https://snap.stanford.edu/data/), and [FiveThirtyEight](https://data.fivethirtyeight.com/)). You could also use the datasets proposed by the ENAC (see the Announcements section on Zulip).

### Problematic

> Frame the general topic of your visualization and the main axis that you want to develop.
> - What am I trying to show with my visualization?
> - Think of an overview for the project, your motivation, and the target audience.

### Exploratory Data Analysis

> Pre-processing of the dataset you chose
> - Show some basic statistics and gain insights about the data

### Related work

> - What others have already done with the data?
> - Why is your approach original?
> - What sources of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

## Milestone 2 (26th April, 5pm)

**10% of the final grade**


## Milestone 3 (31st May, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

