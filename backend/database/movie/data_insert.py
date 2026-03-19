import os
import csv
import mysql.connector as db
from config import *

media_type = 'movie'

def insert_media_links_from_csv(cursor, csv_file_path, emotion):
    try:
        # Open and read the CSV file
        with open(csv_file_path, 'r') as csv_file:
            csv_reader = csv.reader(csv_file)
            next(csv_reader)  # Skip the header row

            # Insert data into the media_links table
            for row in csv_reader:
                # Check if the row is not empty
                if row:
                    try:
                        name, link = row
                        cursor.execute("INSERT INTO media_links (name, link, media_type, emotion) VALUES (%s, %s, %s, %s);", (name, link, media_type, emotion))
                    except db.Error as e:
                        print(f"Error in row: {e}")
                    except ValueError as e:
                        print(f"Error in row: {e}")

        print(f"Data from {emotion}.csv inserted successfully!")

    except db.Error as err:
        print(f"Error: {err}")

# Replace these values with your MySQL database configuration
mydb = db.connect(
    host=mysql_host,
    user=mysql_user,
    password=mysql_password,
    database=database_name,
)
cursor = mydb.cursor()

# Get the path to the folder containing the script and CSV files
csv_folder_path = os.path.join(os.getcwd(), "./backend/database", media_type)  # Path to the folder containing music CSV files
all_files_processed_successfully = True

# Iterate through each file in the folder
for file_name in os.listdir(csv_folder_path):
    if file_name.endswith('.csv'):
        emotion = file_name.split('.')[0]  # Extract emotion from file name
        csv_file_path = os.path.join(csv_folder_path, file_name)
        insert_media_links_from_csv(cursor, csv_file_path, emotion)
        if not all_files_processed_successfully:
            all_files_processed_successfully = False

# Commit the changes if all files were processed successfully
if all_files_processed_successfully:
    mydb.commit()
    print("All data inserted successfully!")

# Close the cursor and connection
cursor.close()
mydb.close()
