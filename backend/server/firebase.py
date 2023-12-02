import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def add_data(user_id: str, battle_to_add, team_to_add):
    doc_ref = db.collection("users").document(user_id)
    # doc_ref.set({"first": "Ada", "last": "Lovelace", "born": 1815})
    if doc_ref.get().exists:
        user_data = doc_ref.get().to_dict()
        if battle_to_add:
            user_data["past_battles"].append(battle_to_add)
        if team_to_add:
            user_data["past_teams"].append(team_to_add)
    else:
        doc_ref.set({"past_battles": battle_to_add, "past_teams": team_to_add})


add_data("22Q90QJV", "test_hattle", "test_team")
