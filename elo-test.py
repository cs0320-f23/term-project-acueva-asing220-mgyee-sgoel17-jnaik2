import numpy
import random
import matplotlib.pyplot as plt

NUM_PLAYERS = 73
SONAS_MOD = True

NUM_TRIALS = 1000000

K = 32  # subject to change with some sort of algorithm
BASE_ELO = 1500

players = [i for i in range(NUM_PLAYERS)]
player_stats = [i + 1 for i in range(NUM_PLAYERS)]
player_elos = [BASE_ELO for i in range(NUM_PLAYERS)]
player_elo_history = [[] for i in range(NUM_PLAYERS)]


def team_1_win_prob(team_1, team_2):
    if len(team_1) != 3 and  len(team_2) != 3:
        raise Exception("Wrong number of players per team")

    return sum(team_1) / (sum(team_1) + sum(team_2))


for i in range(NUM_TRIALS):
    for j in range(NUM_PLAYERS):
        player_elo_history[j].append(player_elos[j])

    # generate teams
    team1 = random.sample(players, 3)
    team2 = random.sample(players, 3)

    # print(f"Team 1: {team1} vs Team 2: {team2}")

    team1_stats = [player_stats[player] for player in team1]
    team2_stats = [player_stats[player] for player in team2]

    win_prob = team_1_win_prob(team1_stats, team2_stats)

    if random.random() > win_prob:
        team1, team2 = team2, team1  # team1 should always store winning team
        # print("Team 2 won.\n")
    # else:
        # print("Team 1 won.\n")

    team1_adjustment = [0, 0, 0]
    team2_adjustment = [0, 0, 0]
    for j, winner in enumerate(team1):
        for k, loser in enumerate(team2):
            e_w = 1 / (1 + 10 ** ((player_elos[loser] - player_elos[winner]) / (480 if SONAS_MOD else 400)))
            e_l = 1 / (1 + 10 ** ((player_elos[winner] - player_elos[loser]) / (480 if SONAS_MOD else 400)))

            s_w = 1
            s_l = 0

            team1_adjustment[j] += K * (s_w - e_w)
            team2_adjustment[k] += K * (s_l - e_l)

    for j, player in enumerate(team1):
        player_elos[player] += team1_adjustment[j]

    for j, player in enumerate(team2):
        player_elos[player] += team2_adjustment[j]

    # print("New Player Elos:")
    # print(f"Winner 1: {player_elos[team1[0]]} |
    # Winner 2: {player_elos[team1[1]]} | Winner 3: {player_elos[team1[2]]}")
    # print(f"Loser 1: {player_elos[team2[0]]} | Loser 2: {player_elos[team2[1]]} | Loser 3: {player_elos[team2[2]]}")
    # print()


print("Final Player Elos:")
for i in range(NUM_PLAYERS):
    print(f"Player {i + 1}: {player_elos[i]}")

x = range(1, NUM_TRIALS + 1)

# for i in range(NUM_PLAYERS):
#     plt.plot(x, player_elo_history[i])

# plt.plot(x, player_elo_history[0], 'r')
# plt.plot(x, player_elo_history[NUM_PLAYERS - 1])

plt.plot(players, player_elos)

plt.show()