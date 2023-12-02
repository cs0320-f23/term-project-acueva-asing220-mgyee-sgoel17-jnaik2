import numpy
import random
import matplotlib.pyplot as plt
from trueskill import Rating, rate
from scipy import stats

NUM_PLAYERS = 73

NUM_TRIALS = 20000

players = [i for i in range(NUM_PLAYERS)]
player_stats = [i + 1 for i in range(NUM_PLAYERS)]
player_trueskill = [Rating() for i in range(NUM_PLAYERS)]
player_trueskill_mu_history = [[] for i in range(NUM_PLAYERS)]
player_trueskill_sigma_history = [[] for i in range(NUM_PLAYERS)]


def team_1_win_prob(team_1, team_2):
    if len(team_1) != 3 and  len(team_2) != 3:
        raise Exception("Wrong number of players per team")

    return sum(team_1) / (sum(team_1) + sum(team_2))


for i in range(NUM_TRIALS):
    for j in range(NUM_PLAYERS):
        player_trueskill_mu_history[j].append(player_trueskill[j].mu)
        player_trueskill_sigma_history[j].append(player_trueskill[j].sigma)

    # generate teams
    team1 = random.sample(players, 3)
    team2 = random.sample(players, 3)

    team1_stats = [player_stats[player] for player in team1]
    team2_stats = [player_stats[player] for player in team2]

    win_prob = team_1_win_prob(team1_stats, team2_stats)

    if random.random() > win_prob:
        team1, team2 = team2, team1  # team1 should always store winning team

    team_1_trueskill = [player_trueskill[player] for player in team1]
    team_2_trueskill = [player_trueskill[player] for player in team2]

    # lower rank = winner
    (new_team_1, new_team_2) = rate([team_1_trueskill, team_2_trueskill], ranks=[0, 1])

    for j, player in enumerate(team1):
        player_trueskill[player] = new_team_1[j]

    for j, player in enumerate(team2):
        player_trueskill[player] = new_team_2[j]


print("Final Player Elos:")
for i in range(NUM_PLAYERS):
    print(f"Player {i + 1}: {player_trueskill[i]}")

x = range(1, NUM_TRIALS + 1)

# for i in range(NUM_PLAYERS):
#     plt.plot(x, player_elo_history[i])

# plt.plot(x, player_elo_history[0], 'r')
# plt.plot(x, player_elo_history[NUM_PLAYERS - 1])

plt.plot(players, [p.mu for p in player_trueskill], 'r')
plt.show()

slope, intercept, r_value, p_value, std_err = stats.linregress(players, [p.mu for p in player_trueskill])
print(f"SLOPE: {slope}, INTERCEPT: {intercept}, R_VALUE: {r_value}, P_VALUE: {p_value}, STD_ERR: {std_err}")

plt.plot(players, [p.sigma for p in player_trueskill], 'b')
plt.show()
