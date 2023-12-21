import psycopg2


def initialize_postgresql():
    """
    Initializes the postgresql database

    :return: returns the cursor and the connection for the database
    """
    connection = psycopg2.connect(
        database="brawler-ratings", host="localhost", port="5432"
    )
    cursor = connection.cursor()
    return cursor, connection
