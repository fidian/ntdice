I'm trying to figure out more information about non-transitive dice.

https://singingbanana.com/dice/article.htm

There's several combinations that could work and the one in the paper cited is the best. You can see that with `one-way-set-of-three.js`. There's a lot of output but only the last line matters. It will list the rolls and the percentage it wins over the set to the right. Also the average odds and the minimum odds remain.

|    Sides    | Odds To Win Vs Next |
| :---------: | :-----------------: |
| 1 4 4 4 4 4 |        69.44        |
| 3 3 3 3 3 6 |        58.33        |
| 2 2 2 5 5 5 |        58.33        |

Average odds: 62.04%
Minimum odds: 58.33%

I've ran a program to find the ideal set of dice where each player takes two of the same die. I didn't get the results I expected. Because the results don't also list a few alternatives (such as a die with 4 on every side), I suspect my result is incorrect.

|    Sides    | Odds To Win Vs Previous |
| :---------: | :---------------------: |
| 1 1 1 1 6 6 |          55.56          |
| 2 2 2 2 2 6 |          58.02          |
| 3 3 3 3 3 3 |          69.44          |
