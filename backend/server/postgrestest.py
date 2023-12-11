import psycopg2

from db_constants import *

connection = psycopg2.connect(database="brawler-ratings", host='localhost', port='5432')
cursor = connection.cursor()

cursor.execute("SELECT * FROM main.\"globalTrueSkill\"")
print(cursor.fetchall())
print(cursor.description)
print([i.name for i in cursor.description])
print({col.name: index for index, col in enumerate(cursor.description)})

cursor.execute(f"INSERT INTO {SCHEMA_NAME}.\"{MAP_RATING_TABLE}\" "
               f"("
               f"\"{BRAWLER_NAME_KEY}\", \"{PRO_PLAYER_MU_KEY}\", \"{PRO_PLAYER_SIGMA_KEY}\", "
               f"\"{PRO_PLAYER_BATTLE_COUNT_KEY}\", \"{USER_MU_KEY}\", \"{USER_SIGMA_KEY}\", "
               f"\"{USER_BATTLE_COUNT_KEY}\", \"{COMBINED_MU_KEY}\", \"{COMBINED_SIGMA_KEY}\", \"{MODE_NAME_KEY}\", "
               f"\"{MAP_NAME_KEY}\""
               f") "
               f"VALUES "
               f"("
               f"\'5\', 2.0, 2.0, 2, 2.0, 2.0, 2, 2.0, 2.0, \'fuck\', \'god fuck\'"
               f");")

connection.commit()
